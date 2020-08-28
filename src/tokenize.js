exports.Tokenizer = class Tokenizer {
  constructor(input) {
    this.input = input
    this.line = 1
    this.pos = 0
    this.tokens = []
    this.curr = 0
    this.char = this.input[0]
  }

  tokenize() {
    while(this.curr < this.input.length) {

      if (this.isWhitespace()) {
        this.move()
        this.next()
        continue
      }


      if (this.isComment()) {
        var pos = this.pos, line = this.line
        this.move(2)
        this.next(2)

        while (!this.isCommentEnd()) {
          this.move(), this.next()
          this.isEnd(line, pos)
        }
        this.move(2)
        this.next(2)
        continue
      }


      if (this.isNum()) {
        var num = "", start = this.pos
        var postfix = ""
        while (this.isNum() || this.isDot()) {
          num += this.char
          this.move()
          this.next()
        }
        while (this.isIdent()) {
          postfix += this.char
          this.move()
          this.next()
        }
        var token = this.createToken("num", num, start)
        token.postfix = postfix
        continue
      }


      if (this.isIdent()) {
        var val = "";
        var start = this.pos
        while (this.isIdent()) {
          val += this.char
          this.move()
          this.next()
        }
        this.createToken("ident", val, start)
        continue
      }


      if (this.isAttributeOperator()) {
        var start = this.pos
        this.move()
        var token = this.createToken("attributeoperator", this.char, start)
        this.next()

        if (this.char === "=") {
          token.val += this.char
          this.move(), this.next()
        }
        continue
      }


      if (this.isPunctation()) {
        var start = this.pos
        this.move()
        var token = this.createToken("punctation", this.char, start)
        this.next()
        if (this.char === ":") {
          token.val += ":"
          this.move(); this.next()
        }
        continue
      }


      if (this.isDot()) {
        let val = "", start = this.pos
        this.move()
        this.next()

        if (this.isNum()) {
          val += "."
          var postfix = ""

          while (this.isNum() || this.isDot()) {
            val += this.char
            this.move()
            this.next()
          }

          while (this.isIdent()) {
            postfix += this.char
            this.move()
            this.next()
          }
          var token = this.createToken("num", val, start)
          token.postfix = postfix
        }

        if (this.isIdent()) {
          while (this.isIdent()) {
            val += this.char
            this.move()
            this.next()
          }
          this.createToken("class", val, start)
        }
        continue
      }


      if (this.isID()) {
        let name = "", start = this.pos
        this.next()
        this.move()
        while (this.isIdent()) {
          name += this.char
          this.next(), this.move()
        }
        this.createToken("id", name, start)
        continue
      }


      if (this.isCombinator()) {
        var start = this.pos
        this.move()
        this.createToken("combinator", this.char, start)
        this.next()
        continue
      }


      if (this.isStringStart()) {
        var type = this.char
        var start = this.pos, line = this.line
        let val = ""
        this.move()
        this.next()
        while (!this.isStringEnd(type)) {
          val += this.char
          this.move(), this.next()
          this.isEnd(line, start)
        }
        this.move()
        this.next()
        this.createToken("string", val, start)
        continue
      }


      if (this.isAtRule()) {
        let type = "", start = this.pos
        this.move()
        this.next()
        while (this.isIdent()) {
          type += this.char
          this.move(), this.next()
        }
        this.createToken("@", type, start)
        continue
      }

      throw new SyntaxError("Unknown token " + this.char + " at " + this.line + ":" + this.pos)
    }

    return this.tokens
  }

  isEnd(line, pos) {
    if (this.curr >= this.input.length) {
      throw new SyntaxError("Unexpected end of input. Unclosed comment starting at line " + line + ":" + pos);
    }
  }

  isStringEnd(type) {
    return type === '"' ?
      this.char === '"' && this.lookback() !== "\\" :
      this.char === "'" && this.lookback() !== "\\"
  }

  isStringStart() {
    return this.char === '"' || this.char === "'"
  }

  isID() {
    return this.char === "#"
  }

  isDot() {
    return this.char === "."
  }

  isIdentStart() {
    return /[a-zA-Z_]/.test(this.char)
  }

  isIdent() {
    return /[a-zA-Z_\-0-9!%\*]/.test(this.char) && this.char !== undefined
  }

  isNum() {
    return /[0-9]/.test(this.char)
  }

  isNewline() {
    return this.char === "\n"
  }

  isWhitespace() {
    return /\s/.test(this.char)
  }

  isAttributeOperator() {
    return (
      this.char === "$" ||
      this.char === "~" ||
      this.char === "*" ||
      this.char === "^" ||
      this.char === "|" ||
      this.char === "="
    )
  }

  isPunctation(char) {
    return (
      this.char === "}"  ||
      this.char === "{"  ||
      this.char === "["  ||
      this.char === "]"  ||
      this.char === "("  ||
      this.char === ")"  ||
      this.char === ";"  ||
      this.char === ":"
    )
  }

  isUniversal() {
    return this.char === "*"
  }

  isAtRule() {
    return this.char === "@"
  }

  isCombinator() {
    return (
      this.char === "," ||
      this.char === ">" ||
      this.char === "+" ||
      this.char === "~"
    )
  }

  isComment() {
    return this.char + this.peek() === "/*"
  }

  isCommentEnd() {
    return this.char === "*" && this.peek() === "/"
  }

  lookback(n) {
    return n ?
      this.input[this.curr - n] :
      this.input[this.curr - 1]
  }

  peek(n) {
    return n ?
      this.input[this.curr + n] :
      this.input[this.curr + 1]
  }

  next(n, move) {
    return this.char = n ?
      this.input[this.curr = this.curr + n] :
      this.input[++this.curr]
  }

  move(n) {
    if (this.isNewline()) n ? this.line = this.line + n : this.line++
    n ? this.pos = this.pos + n : this.pos++
    if (this.isNewline()) this.pos = 0
  }

  createToken(type, val, start) {
    var token = {
      type: type,
      val:  val,
      line: this.line,
      start: start,
      end: this.pos
    }
    this.tokens.push(token)
    return token
  }
}
