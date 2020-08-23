const pp = require('./parser').Parser.prototype;

////////////////////////////////
pp.parse = function() {
  var ast = {
    type: "Stylesheet",
    rules: []
  }
  while (this.token !== undefined) {
    ast.rules.push(this.parseToplevel())
    this.next()
  }
  return ast
}


////////////////////////////////
pp.parseToplevel = function(noImp) {
  if (this.isSelector())    return this.parseSelectorList(noImp)
  if (this.isMediaQuery())  return this.parseMedia()
  if (this.isKeyframes())   return this.parseKeyframes()
  if (this.isCharsetRule()) return this.parseCharset()
  if (this.isFontface())    return this.parseFontface()
  if (this.isImportRule())  return this.parseImport()
  throw new SyntaxError("Unknown token "+ this.token.val + " at " + this.token.line + ":" + this.token.start);
}


////////////////////////////////
pp.parseImport = function() {
  var node = {
    type: "ImportRule",
    url: "",
    media: null
  }
  this.next()
  node.url = this.token.val // this.parseString || parseFunction(specific fn)
  this.next()
  if (!this.isStatementEnd()) {
    node.media = []
    while (!this.isStatementEnd()) {
      if (this.isParanStart()) {
        var statement = {
          type: "Statement",
          prop: "",
          val: {}
        }
        this.next()
        statement.prop = this.token.val
        this.next(2)

        statement.val = this.parseValue()
        node.media.push(statement)
      }
      else {
        node.media.push(this.parseAtom())
        this.next()
      }
    }
  }
  return node
}


////////////////////////////////
pp.parseCharset = function() {
  var node = {
    type: "CharsetRule",
    encoding: ""
  }
  this.next()
  node.encoding = this.parseString()
  this.next()
  return node
}


////////////////////////////////
pp.parseFontface = function() {
  var node = {
    type: "FontFaceRule",
    block: {}
  }
  this.next()
  node.block = this.parseBlock()

  return node
}


////////////////////////////////
pp.parseKeyframes = function() {
  var node = {
    type: "KeyframesRule",
    name: "",
    arguments: []
  }
  this.next()
  node.name = this.token.val
  this.next(2)

  while (!this.isBlockEnd()) {
    node.arguments.push(this.parseToplevel(true))
    this.next()
  }

  return node
}


////////////////////////////////
pp.parseMedia = function() {
  var node = {
    type: "MediaRule",
    def: [],
    selectors: []
  }
  this.next()
  while(!this.isBlockStart()) {
    node.def.push(this.token.val)
    this.next()
  }
  this.next()
  while (!this.isBlockEnd()) {
    node.selectors.push(this.parseToplevel())
    this.next()
  }
  return node
}


////////////////////////////////
pp.parseSelectorList = function(noImp) {
  var node = {
    type: "StyleRule",
    selectors: [],
    rules: {}
  }
  node.selectors.push(this.parseSelector())
  while (this.token.val === ",") {
    this.next()
    node.selectors.push(this.parseSelector())
  }
  node.rules = this.parseBlock(noImp)

  return node
}


////////////////////////////////
pp.parseSelector = function() {
  var node = {
    type: "Selector",
    children: []
  }
  while(!this.isBlockStart() && this.token.val !== ",") {
    if (this.isClass())       node.children.push({type: "ClassSelector", name: this.token.val})
    if (this.isTag())         node.children.push({type: "TagSelector", name: this.token.val})
    if (this.isID())          node.children.push({type: "IdSelector", name: this.token.val})
    if (this.isCombinator())  node.children.push({type: "Combinator", name: this.token.val})

    if (this.isPseudoElement()) {
      let _node = {
        type: "PsuedoElementSelector",
        name: ""
      }
      this.next()
      _node.name = this.token.val
      node.children.push(_node)
    }
    if (this.isPseudoClass()) {
      let _node = {
        type: "PseudoClassSelector",
        name: ""
      }
      this.next()
      _node.name = this.token.val
      node.children.push(_node)
    }

    if (this.isAttribute()) {
      let _node = {
        type: "AttributeSelector",
        name: "",
        operator: null,
        value: null,
        // flags: []
      }
      this.next()
      _node.name = this.parseIdent()
      this.next()
      if (this.isAttributeOperator()) {
          _node.operator = this.token.val
          this.next()
          _node.value = this.token.type === "string" ? this.parseString() : this.parseIdent()
          this.next()
      }
      node.children.push(_node)
    }


    this.next()
  }

  return node
}


////////////////////////////////
pp.parseBlock = function(noImp) {
  var node = {
    type: "Block",
    statements: []
  }
  this.next()
  while (!this.isBlockEnd()) {
    node.statements.push(this.parseStatement(noImp))
  }
  return node
}


////////////////////////////////
pp.parseStatement = function(noImp) {
  var node = {
    type: "Statement",
    important: false,
    property: "",
    value: {}
  }
  node.property = this.token.val
  this.next(2)
  node.value = this.parseValue(node, noImp)
  this.next()
  return node
}


////////////////////////////////
pp.parseValue = function(parent, noImp) {
  var node = {
    type: "Value",
    parts: []
  }
  while (!this.isStatementEnd()) {

    if (this.isNum()) {
      let part = {
        type: "Dimension",
        val: this.token.val,
      }
      if (this.token.postfix &&
          this.token.postfix !== "%")   part.unit = this.token.postfix
      if (this.token.postfix === "%")   part.type = "Percentage"
      if (!this.token.postfix)          part.type = "Number"
      node.parts.push(part)
    }

    if (this.isIdent()) {
      let part = {
        type: "Identifier",
        name: this.token.val
      }
      this.isImportant() ?
        noImp === true ? null : parent.important = true :
        node.parts.push(part)
    }

    if (this.isFunction()) {
      node.parts.push(this.parseFunction(node.parts.pop()))
    }

    if (this.isHex()) {
      let part = {
        type: "Hex",
        val: this.token.val
      }
      node.parts.push(part)
    }

    this.next()
  }
  return node
}


////////////////////////////////
pp.parseAtom = function() {
  var node = {}

  if (this.isNum()) {
    node = {
      type: "Dimension",
      val: this.token.val,
    }
    if (this.token.postfix && this.token.postfix !== "%") {
      node.unit = this.token.postfix
    }
    if (this.token.postfix === "%") {
      node.type = "Percentage"
    }

    if (!this.token.postfix) {
      node.type = "Number"
    }
  }

  if (this.isIdent()) {
    node = {
      type: "Identifier",
      name: this.token.val
    }
  }

  if (this.isHex()) {
    node = {
      type: "Hex",
      val: this.token.val
    }
  }

  return node
}


////////////////////////////////
pp.parseFunction = function(name) {
  var node = {
    type: "Function",
    name: name,
    arguments: []
  }
  this.next()
  while (!this.isParanEnd()) {
    node.arguments.push(this.parseAtom())
    this.next()
  }
  return node
}


////////////////////////////////
pp.parseIdent = function() {
  return {
    type: "Identifier",
    name: this.token.val
  }
}


////////////////////////////////
pp.parseString = function() {
  return {
    type: "String",
    val: this.token.val
  }
}
