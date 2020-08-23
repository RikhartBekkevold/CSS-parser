exports.Parser = class Parser {
  constructor(tokens) {
    this.config = null
    this.tokens = tokens
    this.i = 0
    this.token = this.tokens[this.i]
    // this.tokenizer = new tokenizer()
    // this.level - add in tokenizer instead?
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

  // parse() {
  //   return this.parse(this.tokenizer(input))
  // }


}
