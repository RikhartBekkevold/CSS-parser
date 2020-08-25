exports.Parser = class Parser {
  constructor(tokens) {
    this.config = null
    this.tokens = tokens
    this.i = 0
    this.token = this.tokens[this.i]
  }

  next(n) {
    this.token = n ?
    this.tokens[this.i = this.i + n] :
    this.tokens[++this.i]
  }

  peek(n) {
    return this.tokens[this.i + 1]
  }

  expect(token) {
    if (this.token === token)
      throw "Expected " + token + ", instead found" + this.token
  }

  isEnd(line, pos) {
    if (this.i >= this.tokens.length || this.token === undefined) {
      throw new SyntaxError("Unexpected end of input. Starting at line " + line + ":" + pos)
    }
  }
}
