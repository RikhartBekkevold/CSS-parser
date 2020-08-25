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
  if (this.isMediaQuery())  return this.parseMediaList()
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
  var name = this.parseIdent()
  node.url = this.isString() ? this.parseString() : (this.next(), this.parseFunction(name))
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
        statement.val = this.parseValues()
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
pp.parseMediaList = function() {
  var node = {
    type: "MediaQueryList",
    queries: [],
    selectors: []
  }
  this.next()
  node.queries.push(this.parseMedia())
  while (this.isListSeparator()) {
    this.next()
    node.queries.push(this.parseMedia())
  }
  this.next()
  while (!this.isBlockEnd()) {
    node.selectors.push(this.parseToplevel())
    this.next()
  }
  return node
}


////////////////////////////////
pp.parseMedia = function() {
  var node = {
    type: "MediaRule",
    def: []
  }
  while(!this.isBlockStart() && !this.isListSeparator()) {
    node.def.push(this.parseAtom() || this.parseMediaFeature())
    this.next()
  }
  return node
}


////////////////////////////////
pp.parseMediaFeature = function() {
  var node = { type: "MediaFeature", prop: null, val: null}
  this.next()
  node.prop = this.parseIdent()
  this.next(2)
  node.val = this.parseAtom()
  this.next()
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
  while (this.isListSeparator()) {
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
  while(!this.isBlockStart() && !this.isListSeparator()) {
    if (this.isClass())         node.children.push(this.parseClass())
    if (this.isTag())           node.children.push(this.parseTag())
    if (this.isID())            node.children.push(this.parseID())
    if (this.isCombinator())    node.children.push(this.parseCombinator())
    if (this.isPseudoElement()) node.children.push(this.parsePseudoElement())
    if (this.isPseudoClass())   node.children.push(this.parsePseudoClass())
    if (this.isAttribute())     node.children.push(this.parseAttribute())
    if (this.isNum())           node.children.push({type: "Number", name: this.token.val})
    this.next()
  }
  return node
}


////////////////////////////////
pp.parsePseudoElement  = function () {
  let node = {
    type: "PsuedoElementSelector",
    name: ""
  }
  this.next()
  node.name = this.token.val
  return node
};


////////////////////////////////
pp.parsePseudoClass  = function () {
  let node = {
    type: "PseudoClassSelector",
    name: ""
  }
  this.next()
  node.name = this.token.val
  return node
};


////////////////////////////////
pp.parseAttribute = function() {
  let node = {
    type: "AttributeSelector",
    name: "",
    operator: null,
    value: null,
    // flags: []
  }
  this.next()
  node.name = this.parseIdent()
  this.next()
  if (this.isAttributeOperator()) {
    node.operator = this.token.val
    this.next()
    node.value = this.isString() ? this.parseString() : this.parseIdent()
    this.next()
  }
  return node
}


////////////////////////////////
pp.parsePseudoClass = function() {
  let node = {
    type: "PseudoClassSelector",
    name: ""
  }
  this.next()
  node.name = this.token.val
  return node
}


////////////////////////////////
pp.parseClass = function() {
  return {
    type: "ClassSelector",
    name: this.token.val
  }
}


////////////////////////////////
pp.parseTag = function() {
  return {
    type: "TagSelector",
    // loc: {start, end}
    name: this.token.val
  }
}


////////////////////////////////
pp.parseID = function() {
  return {
    type: "IdSelector",
    name: this.token.val
  }
}


////////////////////////////////
pp.parseCombinator = function() {
  return {
    type: "Combinator",
    name: this.token.val
  }
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
  node.value = this.parseValues(node, noImp)
  this.next()
  return node
}


////////////////////////////////
pp.parseValues = function(parent, noImp) {
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

    if (this.isString()) {
      node.parts.push(this.parseString())
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
  if (this.isNum())     return this.parseNum()
  if (this.isIdent())   return this.parseIdent()
  if (this.isString())  return this.parseString()
  if (this.isHex())     return this.parseHex()
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
    if (this.isListSeparator()) this.next()
    node.arguments.push(this.parseAtom())
    this.next()
  }
  return node
}


////////////////////////////////
pp.parseNum  = function() {
  var node = {
    type: "Dimension",
    val: this.token.val,
  }

  if (this.token.postfix && this.token.postfix !== "%")
    node.unit = this.token.postfix
  if (this.token.postfix === "%")
    node.type = "Percentage"
  if (!this.token.postfix)
    node.type = "Number"

  return node
}


////////////////////////////////
pp.parseHex = function() {
  return {
    type: "Hex",
    val: this.token.val
  }
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

////////////////////////////////
pp.parseOperator = function() {
  return {
    type: "Operator",
    val: this.token.val
  }
}
