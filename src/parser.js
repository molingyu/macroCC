import error from './error'
import Tokenizer from './tokenizer'

class Parser {
  constructor() {
    this.nodeStack = []
    this.list = []
    this.nodeIndex = 0
  }

  parse(codeStr, file = '') {
    let start = {
      file: file,
      lines: 1,
      cols: 0
    }
    let ASTRoot = {
      type: 'root',
      child: []
    }
    this.nodeStack.push(ASTRoot)
    let codes = codeStr.split('\n')
    let script = ''
    codes.forEach((line, index) => {
      start.lines = index + 1
      start.cols = 0
      this.reList()
      if (line.slice(0, 3) == '//#') {
        if (script != '') {
          this.list.push({ type: 'script', value: script, pos: Object.assign({}, start) })
          script = ''
        }
        start.cols = 3
        let node = this.code(line.slice(3, line.length), Object.assign({}, start))
        if (node != void 0) this.list.push(node)
      } else {
        let reg
        while (reg = line.match(/\/\*#(.*?)#\*\//)) {
          script += line.slice(0, reg.index)
          this.list.push({ type: 'script', value: script, pos: Object.assign({}, start) })
          script = ''
          start.cols += reg.index + 3
          let node = this.code(reg[1], Object.assign({}, start))
          if (node != void 0) this.list.push(node)
          start.cols += reg[0].length - 3
          line = line.slice(reg.index + reg[0].length, line.length)
        }
        script += line + '\n';
      }
    })
    if (this.node != ASTRoot) {
      let pos = this.getPos(start, 0)
      pos.cols = codes[codes.length - 1].length - 1
      error(SyntaxError, 'Unexpected endif of input', pos)
  }
    return ASTRoot;
  }

reList() {
  this.node = this.nodeStack[this.nodeStack.length - 1]
  if (this.node.type == 'ifStatement') {
    this.list = this.node.isConsequent ? this.node.ifConsequent : this.node.ifAlternate
  } else {
    this.list = this.node.child
  }
}

getPos(posObject, index) {
  let pos = Object.assign({}, posObject)
  pos.cols += index
  return pos
}

code(codeStr, start) {
  this.tokens = new Tokenizer(codeStr, start).run()
  while (this.token() != void 0) {
    switch (token.type) {
      case 'value':
        return {
          type: 'value',
          value: token.value,
          pos: this.getPos(start, value.pos)
        }
      case 'keyword':
        return this.keyword(start)
      case 'flag':
        return {
          type: 'flag',
          identifier: this.token().value,
          pos: this.getPos(start, this.token().pos)
        }
      case 'globalIdentifier':
        return this.identifier(start)
      case 'identifier':
        return this.identifier(start)
      default:
        error(SyntaxError, 'error token type', this.getPos(start, this.nodeIndex))
    }
  }
}

token() {
  return this.tokens[this.nodeIndex]
}

next() {
  this.nodeIndex += 1
}

isOnly(pos) {
  this.next()
  if (this.token() != void 0) {
    error(SyntaxError, `Unexpected token ${this.token().value}`, this.getPos(pos, this.token().pos))
  }
}

identifier(start) {
  if (this.tokens[this.tokens.length - 1] == this.token()) {
    return {
      type: 'identifier',
      identifier: this.token().value,
      pos: this.getPos(start, this.token().pos)
    }
  } else {
    let node = {}
    node.type = 'variableUpdate'
    node.identifier = this.token().value
    node.pos = this.getPos(start, this.token().pos)
    this.next()
    if (this.token().value == '=') {
      node.value = this.expression(start)
    } else {
      error(SyntaxError, `Unexpected token ${this.token().value}`, this.getPos(start, posIndex))
    }
  }
}

expression(start) {
  
}

keyword(start) {
  let node = {}
  let posIndex = this.token().pos
  switch (this.token().value) {
    case 'define':
      this.next()
      let obj = {
        'globalIdentifier': 'globalVariableDeclaration',
        'identifier': 'variableDeclaration'
      }
      if (obj[this.token().type] != void 0) {
        node.type = obj[this.token().type]
        node.identifier = this.token().value
        this.next()
        if (this.token().value == '=') {
          this.next()
          node.value = this.expression(start)
          node.pos = this.getPos(start, posIndex)
        } else {
          error(SyntaxError, `Unexpected token ${this.token().value}`, this.getPos(start, posIndex))
        }
      } else {
        error(SyntaxError, `Unexpected token ${this.token().value}`, this.getPos(start, posIndex))
      }
      break
    case 'if':
      node.type = 'ifStatement'
      node.test = this.expression(start)
      node.ifConsequent = []
      node.ifAlternate = []
      node.isConsequent = true
      node.pos = this.getPos(start, posIndex)
      this.nodeStack.push(node)
      break
    case 'else':
      this.isOnly(start)
      if (this.node.type != 'ifStatement') {
        error(SyntaxError, 'Unexpected token else', this.getPos(start, posIndex))
      }
      this.node.isConsequent = false
      break
    case 'endif':
      this.isOnly(start)
      if (this.node.type != 'ifStatement') {
        error(SyntaxError, 'Unexpected token endif', this.getPos(start, posIndex))
      }
      delete this.node.isConsequent
      this.nodeStack.pop()
      break
    default:
      error()
  }
}

}

export default Parser