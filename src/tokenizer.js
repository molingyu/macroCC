import error from './error'

class Tokenizer {

  constructor(pos, code) {
    this.code = code
    this.index = 0
    this.pos = pos
    this.arithmetics = [
      '!',
      '~',
      '(',
      ')',
      '*',
      '/',
      '%',
      '+',
      '-',
      '>',
      '<',
      '>=',
      '>=',
      '==',
      '!=',
      '>>>',
      '===',
      '!==',
      '='      
    ]
  }

  run() {
    let tokens = []
    while (this.chr() != void 0) {
      tokens.push(this.exp(), this.chr())
    }
    return tokens
  }

  next() {
    this.index += 1
  }

  nextIs(chr) {
    return this.code[this.index + 1] == chr
  }

  ws() {
    while (this.chr() == ' ') {
      this.index += 1;
    }
  }

  chr() {
    return this.code[this.index]
  }

  skip(str) {
    for (let i in str) {
      if (str[i] != this.chr()) return false
      this.index += 1
    }
    return true
  }

  getPos() {
    let pos = Object.assign({}, this.pos)
    pos.cols += this.index
    return pos
  }

  expression() {
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
    if(this.arithmetics.includes(this.chr)) {
      return {
        type: 'arithmetic',
        pos: this.index,
        value: this.arithmetic()
      }
    }
    if(this.skip('typeof')){
      return {
        type: 'arithmetic',
        pos: this.index,
        value: 'typeof'
      }
    }
    if(this.skip('void')){
      return {
        type: 'arithmetic',
        pos: this.index,
        value: 'void'
      }
    }
    error(SyntaxError, 'Invalid or unexpected token', this.getPos())
  }

  number() {
    let number = ''
    let decHas = false
    let eHas = false
    while (true) {
      if (this.chr() == void 0) break
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
        } else if (this.chr().match(/[+-]/)) {
          if (this.code[this.index - 1].match(/[eE]/)) {
            number += this.chr()
            this.next()
          }
        } else {
          break
        }
      }
    }
    number = Number(number)
    if(isNaN(number)) {
      error(SyntaxError, 'Bad number', this.getPos())
    } else {
      return number
    }
  }

  string() {
    let string = ''
    let startStr = this.chr()
    let lastIs = false
    this.next()
    while (true) {
      if(this.chr() == void 0) error(SyntaxError, 'Invalid or unexpected token', this.getPos())
      if (this.chr() == '/') {
        lastIs = !lastIs
        if (lastIs && this.nextIs(startStr)) {
          this.next()
          break
        }
        string += this.chr()
        this.next()
      }
    }
  }

  identifier() {
    let identifier = ''
    while(this.chr().match(/[_a-z0-9]/)) {
      identifier += this.chr()
    }
    return identifier
  }

  globalIdentifier() {
    let globalIdentifier = '$'
    this.next()
    while(this.chr().match(/[_a-z0-9]/)) {
      globalIdentifier += this.chr()
    }
    return globalIdentifier
  }

  flag() {
    let flag = ''
    while(this.chr().match(/[_A-Z0-9]/)) {
      flag += this.chr()
    }
    return flag
  }

  arithmetic() {
    let arithmetic = this.chr()
    this.next()
    if (this.nextIs('=')) {
      arithmetic += this.chr()
      this.next()
      if (this.nextIs('=')) {
        arithmetic += this.chr()
        this.next()
      }
    } else {
      if (this.skip('>>') && this.code[this.index - 1] == '>') {
        arithmetic = '>>>'
      }
    }
    return arithmetic
  }

}

export default Tokenizer