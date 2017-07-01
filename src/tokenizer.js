import error from './error'

class Tokenizer {

  constructor(pos, code, lineCode) {
    this.code = code
    this.index = 0
    this.pos = pos
  }

  run() {
    let tokens = []
    while(this.chr() != void 0) {
      tokens.push(this.exp(), this.chr())
    }
    return tokens
  }

  next() {
    this.index += 1
  }

  nextIs(chr) {
    return this.code[this.index] == chr
  }

  ws() {

  }

  chr() {
    return this.code[this.index]
  }

  skip() {

  }

  getPos() {
    let pos = Object.assign({}, this.pos)
    pos.cols += this.index
    return pos
  }

  exp() {
    this.ws()
    let chr = this.chr()
    if (chr.match(/[A-Z]/)) {
      return {
        type: 'flag',
        pos: this.index,
        value: this.flag()
      }
    }
    if (chr = '$') {
      return {
        type: 'globalIdentifier',
        pos: this.index,
        value: this.globalIdentifier()
      }
    }
    if (chr.match(/[a-z_]/)) {
      let pos = this.index
      let value = this.identifier()
      if (value.match(/true||false||null||undefined/)) {
        value = eval(value)
        type = 'keyword'
      } else {
        type = 'identifier'
      }
      return { type: type, pos: pos, value: value }
    }
    if (chr.match(/['"]/)) {
      return {
        type: 'string',
        pos: this.index,
        value: this.string()
      }
    }
    if (chr = '/') {
      return {
        type: 'string',
        pos: this.index,
        value: this.regexp()
      }
    }
  }

  number() {
    let number = ''
    let decHas = false
    let eHas = false
    while (true) {
      if(this.chr() == void 0) break
      if (this.chr().match(/[0-9.]/)) {
        if (this.chr() == '.') {
          if (decHas || eHas) {
            error(SyntaxError, 'Unexpected number', this.getPos())
          }
        }
        decHas = true
        number += this.chr()
        this.next()
      } else {
        if (this.chr().match(/[eE]/)) {
          if (eHas) {
            error(SyntaxError, 'Unexpected number', this.getPos())
          } else {
            eHas = true
            number += this.chr()
            this.next()
          }
        }
        // if() {

        // }
        break
      }
    }
  }

  string() {

  }

  regexp() {

  }

  identifier() {

  }

  globalIdentifier() {

  }

  flag() {

  }

}

export default Tokenizer