import error from './error'

class Tokenizer {

  constructor(code, pos) {
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
    this.keyword = [
      'define',
      'if',
      'else',
      'endif'
    ]
  }

  run() {
    let tokens = []
    this.ws()
    while (this.chr() != void 0) {
      tokens.push(this.expression())
      this.ws()
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
    let chr = this.chr()
    if (chr.match(/[A-Z]/)) {
      return {
        type: 'flag',
        pos: this.index,
        value: this.flag()
      }
    } else if (chr == '$') {
      return {
        type: 'globalIdentifier',
        pos: this.index,
        value: this.globalIdentifier()
      }
    } else if (chr.match(/[a-z_]/)) {
      let type
      let pos = this.index
      let value = this.identifier()
      if (this.keyword.includes(value)) {
        type = 'keyword'
      } else if (value.match(/true||false||null||undefined/) == value) {
        type = 'value'
        value = eval(value)
      } else {
        type = 'identifier'
      }
      return { type: type, pos: pos, value: value }
    } else if (chr.match(/['"]/)) {
      return {
        type: 'value',
        pos: this.index,
        value: this.string()
      }
    } else if (chr.match(/[0-9]/)) {
      return {
        type: 'value',
        pos: this.index,
        value: this.number()
      }
    } else if(this.arithmetics.includes(chr)) {
      return {
        type: 'arithmetic',
        pos: this.index,
        value: this.arithmetic()
      }
    } else if(this.skip('typeof')){
      return {
        type: 'arithmetic',
        pos: this.index,
        value: 'typeof'
      }
    } else if(this.skip('void')){
      return {
        type: 'arithmetic',
        pos: this.index,
        value: 'void'
      }
    } else {
      error(SyntaxError, `Invalid or unexpected token '${chr}'`, this.getPos())
    }
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
    while (this.chr() != void 0 && this.chr().match(/[_a-z0-9]/)) {
      identifier += this.chr()
      this.next()
    }
    return identifier
  }

  globalIdentifier() {
    let globalIdentifier = '$'
    this.next()
    while (this.chr() != void 0 && this.chr().match(/[_a-z0-9]/)) {
      globalIdentifier += this.chr()
      this.next()
    }
    return globalIdentifier
  }

  flag() {
    let flag = ''
    while(this.chr().match(/[_A-Z0-9]/)) {
      flag += this.chr()
      this.next()
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