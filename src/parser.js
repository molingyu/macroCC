// import error from './error';
function error(type, msg, pos) {
  throw new type(`${msg}(${pos.file}:${pos.line}:${pos.index})`, pos)
}

class Parser {
  constructor() {
    this.nodeStack = []
    this.lineCode = ''
    this.index = 0
    this.list = []
  }

  parse(codeStr, file = '') {
    $script = codeStr
    let ast = {
      type: 'root',
      child: []
    }
    let codes = codeStr.split('\n')
    let script = ''
    let start = {
      file: file,
      lines: 1,
      cols: 0
    }
    this.node = this.nodeStack[this.nodeStack.length - 1]
    codes.forEach((line, index) => {
      // only code
      if (line.slice(0, 3) == '//#') {
        if (script != '') {
          list.push({ type: 'script', value: script, pos: Object.assign({}, start) })
          script = ''
        }
        start.lines = index + 1
        start.cols = 3
        //error!!!
        let node = this.code(line.slice(3, line.length), Object.assign({}, start))
        if (node != void 0) this.list.push(node)
        start.lines += 1
        start.cols = 0
      } else {
        let reg
        while (reg = line.match(/\/\*#(.*?)#\*\//)) {
          script += line.slice(0, reg.index)
          this.list.push({ type: 'script', value: script, pos: Object.assign({}, start) })
          script = ''
          start.lines = index + 1
          start.cols += reg.index + 3
          let node = this.code(reg[1], Object.assign({}, start))
          if (node != void 0) this.list.push(node)
          start.cols += reg[0].length - 3
          line = line.slice(reg.index + reg[0].length, line.length)
        }
        script += line + '\n';
      }
    })
    return this.ast;
  }

  reList() {
    this.node = this.nodeStack[this.nodeStack.length - 1]
    if (this.node) {
      ist = this.node.isConsequent ? this.node.ifConsequent : this.node.ifAlternate
    } else {
      this.list = this.ast
    }
  }

  expression(start) {
    this.ws()
    let chr = this.chr()
    let node
    if (chr != void 0) {
      //   if (chr.match(/[0-9]/)) {
      //     this.clear()
      //     node = {
      //       type: 'value',
      //       value: this.number(),
      //       pos: Object.assign({}, start)
      //     }
      //     return node
      //   } else if (chr.match(/[A-Z]/)) {
      //     return {
      //       type: 'flag',
      //       identifier: this.name(start),
      //       pos: Object.assign({}, start)
      //     }
      //   } else if (chr == '$') {
      //     return {
      //       type: 'identifier',
      //       global: true,
      //       identifier: this.name(start),
      //       pos: Object.assign({}, start)
      //     }
      //   } else if (chr.match(/[_a-z]/)) {
      //     return {
      //       type: 'identifier',
      //       global: false,
      //       identifier: this.name(start),
      //       pos: Object.assign({}, start)
      //     }
      //   }
      return 'expression 233'
    }
  }

  code(codeStr, start) {
    this.lineCode = codeStr
    this.ws()
    if (this.nextIs('define')) {
      this.ws()
      let node = {
        type: this.nextIs('$') ? 'globalVariableDeclaration' : 'variableDeclaration',
        identifier: this.name()
      }
      this.ws()
      if (!this.nextIs('=')) {
        start.cols += this.index
        error(SyntaxError, `Unexpected token "${this.chr()}"`, start)
      }
      this.ws()
      node.value = this.expression(start)
      node.pos = Object.assign({}, start)
      this.clear()
      return node
    } else if (this.nextIs('if')) {
      this.ws()
      let node = {
        type: 'ifStatement',
        ifConsequent: [],
        ifAlternate: [],
        pos: Object.assign({}, start),
        isConsequent: true
      }
      node.ifTest = this.expression()
      this.nodeStack.push(node)
      // this.node = this.nodeStack[this.nodeStack.length - 1]
      this.clear()
      return node
    } else if (this.nextIs('else')) {
      this.node.isConsequent = false
      this.clear()
    } else if (this.nextIs('endif')) {
      delete this.node.isConsequent
      let node = this.nodeStack.pop()
      this.clear()
      return node
    } else {
      // return this.expression(start)
      this.clear()
      return { type: 'code', value: codeStr, pos: Object.assign({}, start) }
    }
  }

  number() {
    let number = ''
    while (this.chr() != void 0 && this.chr().match(/[0-9\.]/)) {
      number += this.chr();
      this.index += 1;
    }
    if (number.match(/^[0-9]+.?[0-9]*$/) != number) {
      new MacroCCError('error number string(' + number + ')!');
    }
    return Number(number);
  }

  string() {
    let string = '';
    this.nextIs('"');
    while (this.chr() != '"') {
      string += this.chr();
      this.index += 1;
    }
    return string;
  }

  flag() {
    let flag = '';
    while (this.chr().match(/[A-Z_]/) == this.chr()) {
      flag += this.chr();
      this.index += 1;
    }
    return flag;
  }

  name(start) {
    let name = '';
    while (this.chr().match(/[_a-z]/) == this.chr()) {
      name += this.chr()
      this.index += 1
    }
    return name
  }

  // line code function:

  clear() {
    this.lineCode = '';
    this.index = 0;
  }

  nextIs(str) {
    let index = 0
    for (let i in str) {
      if (str[i] != this.chr()) return false
      this.index += 1
    }
    return true
  }

  chr() {
    return this.lineCode[this.index];
  }

  ws() {
    while (this.chr() == ' ') {
      this.index += 1;
    }
  }
}

// export default Parser;

var script = `//#define a = 233
var a = /*# a #*/ / /*# 233 #*/ + 1
//#if a > 100
console.log(100)
//#else
console.log(0)
//#endif`;

let parser = new Parser()
let ast = parser.parse(script, 'main.js')
console.log(ast)