import error from './error'
import Tokenizer from './tokenizer'

class Parser {
  constructor() {
    this.nodeStack = []
    this.list = []
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
    console.log(codeStr)
    let tokens = new Tokenizer(codeStr, start).run()
    let nodeStack = []
    let node
    tokens.forEach((token) => {
      switch (token.type) {
        case 'value':
          node = {
            type: 'value',
            value: token.value,
            pos: this.getPos(start, value.pos)
          }
          break
        case 'keyword':

          break
        case 'flag':

          break
        case 'globalIdentifier':

          break
        case 'identifier':

          break
        case 'arithmetic':

          break
      }
    })
  }

}

export default Parser