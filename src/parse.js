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
pp.parseToplevel = function(noImp, isKeyframe) {
  if (this.isSelector())    return this.parseSelectorList(noImp, isKeyframe)
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
    loc: this.createLoc(),
    url: "",
    media: null
  }
  this.next()
  var token = this.parseIdent()
  node.url = this.isString() ? this.parseString() : (this.next(), this.parseFunction(token))
  this.next()
  if (!this.isStatementEnd()) {
    node.media = []
    while (!this.isStatementEnd()) {
      if (this.isParanStart()) {
        var statement = {
          type: "Statement",
          loc: this.createLoc(),
          prop: "",
          val: {}
        }
        this.next()
        statement.prop = this.token.val
        this.next(2)
        statement.val = this.parseValues()
        node.media.push(statement)
        node.loc.end.line = this.token.line
        node.loc.end.col = this.token.end
      }
      else {
        node.media.push(this.parseAtom())
        this.next()
      }
    }
  }
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseCharset = function() {
  var node = {
    type: "CharsetRule",
    loc: this.createLoc(),
    encoding: "",
  }
  this.next()
  node.encoding = this.parseString()
  this.next()
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseFontface = function() {
  var node = {
    type: "FontFaceRule",
    loc: this.createLoc(),
    block: {}
  }
  this.next()
  node.block = this.parseBlock()
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseKeyframes = function() {
  var node = {
    type: "KeyframesRule",
    loc: this.createLoc(),
    name: "",
    arguments: []
  }
  this.next()
  node.name = this.token.val
  this.next(2)
  while (!this.isBlockEnd()) {
    node.arguments.push(this.parseToplevel(true, true))
    this.next()
  }
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseMediaList = function() {
  var node = {
    type: "MediaQueryList",
    loc: this.createLoc(),
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
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseMedia = function() {
  var node = {
    type: "MediaRule",
    loc: this.createLoc(),
    def: []
  }
  while(!this.isBlockStart() && !this.isListSeparator()) {
    node.def.push(this.parseAtom() || this.parseMediaFeature())
    this.next()
  }
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseMediaFeature = function() {
  var node = {
    type: "MediaFeature",
    loc: this.createLoc(),
    prop: null,
    val: null
  }
  this.next()
  node.prop = this.parseIdent()
  this.next(2)
  node.val = this.parseAtom()
  this.next()
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseSelectorList = function(noImp, isKeyframe) {
  var node = {
    type: "StyleRule",
    loc: this.createLoc(),
    selectors: [],
    rules: {}
  }
  node.selectors.push(this.parseSelector(isKeyframe))
  while (this.isListSeparator()) {
    this.next()
    node.selectors.push(this.parseSelector(isKeyframe))
  }
  node.rules = this.parseBlock(noImp)
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseSelector = function(isKeyframe, context) {
  var node = {
    type: "SelectorPattern",
    loc: this.createLoc(),
    selectors: []
  }
  while(!this.isBlockStart() && !this.isListSeparator()) {
    if (this.isClass() && !isKeyframe)          node.selectors.push(this.parseClass())
    if (this.isTag())                           node.selectors.push(this.parseTag())
    if (this.isID() && !isKeyframe)             node.selectors.push(this.parseID())
    if (this.isCombinator() && !isKeyframe)     node.selectors.push(this.parseCombinator())
    if (this.isPseudoElement()  && !isKeyframe) node.selectors.push(this.parsePseudoElement())
    if (this.isPseudoClass()  && !isKeyframe)   node.selectors.push(this.parsePseudoClass())
    if (this.isAttribute()  && !isKeyframe)     node.selectors.push(this.parseAttribute())
    if (this.isPercent() && isKeyframe)         node.selectors.push(this.parseNum())
    this.next()
  }
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parsePseudoElement  = function () {
  let node = {
    type: "PsuedoElementSelector",
    loc: this.createLoc(),
    name: ""
  }
  this.next()
  node.name = this.token.val
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
};


////////////////////////////////
pp.parsePseudoClass  = function () {
  let node = {
    type: "PseudoClassSelector",
    loc: this.createLoc(),
    name: ""
  }
  this.next()
  node.name = this.token.val
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
};


////////////////////////////////
pp.parseAttribute = function() {
  let node = {
    type: "AttributeSelector",
    loc: this.createLoc(),
    name: "",
    operator: null,
    value: null
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
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseClass = function() {
  return {
    type: "ClassSelector",
    loc: this.createLoc(),
    name: this.token.val
  }
}


////////////////////////////////
pp.parseTag = function() {
  return {
    type: "TagSelector",
    loc: this.createLoc(),
    name: this.token.val
  }
}


////////////////////////////////
pp.parseID = function() {
  return {
    type: "IdSelector",
    loc: this.createLoc(),
    name: this.token.val
  }
}


////////////////////////////////
pp.parseCombinator = function() {
  return {
    type: "Combinator",
    loc: this.createLoc(),
    name: this.token.val
  }
}


////////////////////////////////
pp.parseBlock = function(noImp) {
  var node = {
    type: "Block",
    loc: this.createLoc(),
    statements: []
  }
  this.next()
  while (!this.isBlockEnd()) {
    node.statements.push(this.parseStatement(noImp))
    this.next()
  }
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseStatement = function(noImp) {
  var node = {
    type: "Statement",
    important: false,
    property: "",
    loc: this.createLoc(),
    value: {}
  }
  node.property = this.token.val
  this.next(2)
  node.value = this.parseValues(node, noImp)
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseValues = function(parent, noImp) {
  var node = {
    type: "Value",
    loc: this.createLoc(),
    parts: []
  }
  while (!this.isStatementEnd()) {
    if (this.isNum())       node.parts.push(this.parseNum())
    if (this.isFunction())  node.parts.push(this.parseFunction(node.parts.pop()))
    if (this.isString())    node.parts.push(this.parseString())
    if (this.isHex())       node.parts.push(this.parseHex())
    if (this.isIdent())
      this.isImportant() ?
        noImp === true ? null : parent.important = true :
        node.parts.push(this.parseIdent());
    this.next()
  }
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
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
pp.parseFunction = function(token) {
  var node = {
    type: "Function",
    name: token.name,
    loc: this.createLoc(token),
    arguments: []
  }
  this.next()
  while (!this.isParanEnd()) {
    if (this.isListSeparator()) this.next()
    node.arguments.push(this.parseAtom())
    this.next()
  }
  node.loc.end.line = this.token.line
  node.loc.end.col = this.token.end
  return node
}


////////////////////////////////
pp.parseNum  = function() {
  var node = {
    type: "Dimension",
    loc: this.createLoc(),
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
    loc: this.createLoc(),
    val: this.token.val
  }
}


////////////////////////////////
pp.parseIdent = function() {
  return {
    type: "Identifier",
    loc: this.createLoc(),
    name: this.token.val
  }
}


////////////////////////////////
pp.parseString = function() {
  return {
    type: "String",
    loc: this.createLoc(),
    val: this.token.val
  }
}

////////////////////////////////
pp.parseOperator = function() {
  return {
    type: "Operator",
    loc: this.createLoc(),
    val: this.token.val
  }
}
