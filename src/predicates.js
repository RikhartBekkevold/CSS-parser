const pp = require('./parser').Parser.prototype

pp.isMediaQuery = function() {
  return this.token.type === "@" && this.token.val === "media"
}

pp.isKeyframes = function() {
  return this.token.type === "@" && (this.token.val === "keyframes" || this.token.val === "-webkit-keyframes")
}

pp.isImportRule = function() {
  return this.token.type === "@" && this.token.val === "import"
}

pp.isCharsetRule = function() {
  return this.token.type === "@" && this.token.val === "charset"
}

pp.isFontface = function() {
  return this.token.type === "@" && this.token.val === "font-face"
}

pp.isStatementEnd = function() {
  return this.token.type === "punctation" && this.token.val === ";"
}

pp.isBlockStart = function() {
  return this.token.type === "punctation" && this.token.val === "{"
}

pp.isBlockEnd = function() {
  return this.token.type === "punctation" && this.token.val === "}"
}

pp.isParanStart = function() {
  return this.token.type === "punctation" && this.token.val === "("
}

pp.isParanEnd = function() {
  return this.token.type === "punctation" && this.token.val === ")"
}

pp.isListSeparator = function() {
  return this.token.type === "combinator" && this.token.val === ","
}

pp.isAttributeOperator = function() {
  return this.token.type === "attributeoperator"
}

pp.isID = function() {
  return this.token.type === "id"
}

pp.isTag = function() {
  return this.token.type === "ident"
}

pp.isClass = function() {
  return this.token.type === "class"
}

pp.isAttribute = function() {
  return this.token.type === "punctation" && this.token.val === "["
}

pp.isPseudoClass = function() {
  return this.token.type === "punctation" && this.token.val === ":"
}

pp.isPseudoElement = function() {
  return this.token.type === "punctation" && this.token.val === "::"
}

pp.isUniversal = function() {
  return this.token.type === "operator" && this.token.val === "*"
}

pp.isSelector = function() {
  return (
    this.isID()             ||
    this.isTag()            ||
    this.isClass()          ||
    this.isPseudoClass()    ||
    this.isPseudoElement()  ||
    this.isAttribute()      ||
    this.isNum()
  )
}

pp.isImportant = function() {
  return this.token.type === "ident" && this.token.val === "!important"
}

pp.isCombinator = function() {
  return this.token.type === "combinator"
}

pp.isIdent = function() {
  return this.token.type === "ident"
}

pp.isNum = function() {
  return this.token.type === "num"
}

pp.isFunction = function() {
  return this.isParanStart()
}

pp.isHex = function() {
  return this.isID()
}

pp.isString = function() {
  return this.token.type === "string"
}
