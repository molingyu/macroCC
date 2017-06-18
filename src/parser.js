import MacroCCError from './error';

class Parser {
  constructor() {
    this.ast = [];
    this.pos = { line: 1, index: 0 };
    this.deep = 0;
    this.nodeList = [];
    this.codeStr = '';
    this.index = 0;
  }

  parse(codeStr) {
    let codes = codeStr.split('\n');
    let start = { line: this.pos.line, index: this.pos.index };
    let script = '';
    codes.forEach(function (line) {
      this.node = this.nodeList[this.nodeList.length - 1];
      if (this.node) {
        this.list = this.node.else ? this.node.ifConsequent : this.node.ifAlternate;
      } else {
        this.list = this.ast;
      }
      if (line.slice(0, 3) == '//#') {
        if (script != '') {
          console.log(start)
          this.list.push({ type: 'script', value: script, pos: start });
          start = { line: this.pos.line, index: this.pos.index };
          script = '';
        }
        console.log(start)
        this.code(line.slice(3, line.length), start);
      } else {
        let reg = line.match(/\/\*#(.*)#\*\//);
        if (reg) {
          script += line.slice(0, reg.index);
          this.list.push({ type: 'script', value: script, pos: start });
          start = { line: this.pos.line, index: this.pos.index };
          script = '';
          this.code(reg[1], start);
          start.index += reg.index + reg[0].length;
          let antherLine = line.slice(reg.index + reg[0].length, line.length);
          if (antherLine != '') {
            script += antherLine + '\n';
          }
        } else {
          script += line + '\n';
        }
      }
      this.pos.line += 1;
      this.pos.index = 0;
    }, this);
    return this.ast;
  }

  expression() {
    return 'expression 233'
  }

  code(codeStr, start) {
    this.codeStr = codeStr;
    this.ws();
    console.log(this.codeStr)
    if (this.nextIs('define')) {
      this.ws();
      let node = { pos: start };
      if (this.chr() == '$')
        node.type = this.nextIs('$') ? 'globalVariableDeclaration' : 'variableDeclaration';
      node.identifier = this.name();
      node.value = this.expression();
      this.list.push(node);
      this.clear();
    } else if (this.nextIs('if')) {
      this.deep += 1;
      this.ws();
      let node = {
        type: 'ifStatement',
        ifConsequent: [],
        ifAlternate: [],
        pos: start,
        deep: this.deep,
        else: true
      };
      node.ifTest = this.expression();
      this.nodeList.push(node);
      this.clear();
    } else if (this.nextIs('else')) {
      console.log(this.nodeList)
      if (this.node.deep != this.deep) {
        error()
      }
      this.node.else = false;
      this.clear();
    } else if (this.nextIs('endif')) {
      delete this.node.deep;
      delete this.node.else;
      let node = this.node;
      this.nodeList.pop();
      this.node = this.nodeList[this.nodeList.length - 1];
      if (this.node) {
        this.list = this.node.else ? this.node.ifConsequent : this.node.ifAlternate;
      } else {
        this.list = this.ast;
      }
      this.list.push(node);
      this.deep -= 1;
      this.clear();
    } else {
      this.ast.push({ type: 'code', value: codeStr, pos: start })
      this.clear();
    }
  }

  number() {
    let number = ''
    while (this.chr().match(/[0-9\.]/)) {
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
    while(this.chr().match(/[A-Z_]/) == this.chr()) {
      flag += this.chr();
      this.index += 1;
    }
    return flag;
  }

  name() {
    let name = '';
    let line = this.pos.line;
    let pos = this.pos.index;
    if (this.nextIs('$')) {
      this.chr().match(/[_a-z]/)
    }
  }

  clear() {
    this.codeStr = '';
    this.index = 0;
  }

  nextIs(str) {
    console.log(this.index, this.codeStr.slice(this.index, str.length), str)
    if (this.codeStr.slice(this.index, str.length) == str) {
      this.index += str.length;
      return true;
    } else {
      return false;
    }

  }

  chr() {
    return this.codeStr[this.index];
  }

  ws() {
    while (this.chr() == ' ') {
      this.index += 1;
      if (this.chr() == void 0) break;
    }
  }
}

export default Parser;