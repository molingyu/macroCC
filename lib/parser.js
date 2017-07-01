'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import error from './error';
function error(type, msg, pos) {
  throw new type(msg + '(' + pos.file + ':' + pos.line + ':' + pos.index + ')', pos);
}

var Parser = function () {
  function Parser() {
    _classCallCheck(this, Parser);

    this.nodeStack = [];
    this.lineCode = '';
    this.index = 0;
    this.list = [];
  }

  _createClass(Parser, [{
    key: 'parse',
    value: function parse(codeStr) {
      var _this = this;

      var file = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      $script = codeStr;
      var ast = {
        type: 'root',
        child: []
      };
      var codes = codeStr.split('\n');
      var script = '';
      var start = {
        file: file,
        lines: 1,
        cols: 0
      };
      this.node = this.nodeStack[this.nodeStack.length - 1];
      codes.forEach(function (line, index) {
        // only code
        if (line.slice(0, 3) == '//#') {
          if (script != '') {
            list.push({ type: 'script', value: script, pos: Object.assign({}, start) });
            script = '';
          }
          start.lines = index + 1;
          start.cols = 3;
          //error!!!
          var node = _this.code(line.slice(3, line.length), Object.assign({}, start));
          if (node != void 0) _this.list.push(node);
          start.lines += 1;
          start.cols = 0;
        } else {
          var reg = void 0;
          while (reg = line.match(/\/\*#(.*?)#\*\//)) {
            script += line.slice(0, reg.index);
            _this.list.push({ type: 'script', value: script, pos: Object.assign({}, start) });
            script = '';
            start.lines = index + 1;
            start.cols += reg.index + 3;
            var _node = _this.code(reg[1], Object.assign({}, start));
            if (_node != void 0) _this.list.push(_node);
            start.cols += reg[0].length - 3;
            line = line.slice(reg.index + reg[0].length, line.length);
          }
          script += line + '\n';
        }
      });
      return this.ast;
    }
  }, {
    key: 'reList',
    value: function reList() {
      this.node = this.nodeStack[this.nodeStack.length - 1];
      if (this.node) {
        ist = this.node.isConsequent ? this.node.ifConsequent : this.node.ifAlternate;
      } else {
        this.list = this.ast;
      }
    }
  }, {
    key: 'expression',
    value: function expression(start) {
      this.ws();
      var chr = this.chr();
      var node = void 0;
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
        return 'expression 233';
      }
    }
  }, {
    key: 'code',
    value: function code(codeStr, start) {
      this.lineCode = codeStr;
      this.ws();
      if (this.nextIs('define')) {
        this.ws();
        var node = {
          type: this.nextIs('$') ? 'globalVariableDeclaration' : 'variableDeclaration',
          identifier: this.name()
        };
        this.ws();
        if (!this.nextIs('=')) {
          start.cols += this.index;
          error(SyntaxError, 'Unexpected token "' + this.chr() + '"', start);
        }
        this.ws();
        node.value = this.expression(start);
        node.pos = Object.assign({}, start);
        this.clear();
        return node;
      } else if (this.nextIs('if')) {
        this.ws();
        var _node2 = {
          type: 'ifStatement',
          ifConsequent: [],
          ifAlternate: [],
          pos: Object.assign({}, start),
          isConsequent: true
        };
        _node2.ifTest = this.expression();
        this.nodeStack.push(_node2);
        // this.node = this.nodeStack[this.nodeStack.length - 1]
        this.clear();
        return _node2;
      } else if (this.nextIs('else')) {
        this.node.isConsequent = false;
        this.clear();
      } else if (this.nextIs('endif')) {
        delete this.node.isConsequent;
        var _node3 = this.nodeStack.pop();
        this.clear();
        return _node3;
      } else {
        // return this.expression(start)
        this.clear();
        return { type: 'code', value: codeStr, pos: Object.assign({}, start) };
      }
    }
  }, {
    key: 'number',
    value: function number() {
      var number = '';
      while (this.chr() != void 0 && this.chr().match(/[0-9\.]/)) {
        number += this.chr();
        this.index += 1;
      }
      if (number.match(/^[0-9]+.?[0-9]*$/) != number) {
        new MacroCCError('error number string(' + number + ')!');
      }
      return Number(number);
    }
  }, {
    key: 'string',
    value: function string() {
      var string = '';
      this.nextIs('"');
      while (this.chr() != '"') {
        string += this.chr();
        this.index += 1;
      }
      return string;
    }
  }, {
    key: 'flag',
    value: function flag() {
      var flag = '';
      while (this.chr().match(/[A-Z_]/) == this.chr()) {
        flag += this.chr();
        this.index += 1;
      }
      return flag;
    }
  }, {
    key: 'name',
    value: function name(start) {
      var name = '';
      while (this.chr().match(/[_a-z]/) == this.chr()) {
        name += this.chr();
        this.index += 1;
      }
      return name;
    }

    // line code function:

  }, {
    key: 'clear',
    value: function clear() {
      this.lineCode = '';
      this.index = 0;
    }
  }, {
    key: 'nextIs',
    value: function nextIs(str) {
      var index = 0;
      for (var i in str) {
        if (str[i] != this.chr()) return false;
        this.index += 1;
      }
      return true;
    }
  }, {
    key: 'chr',
    value: function chr() {
      return this.lineCode[this.index];
    }
  }, {
    key: 'ws',
    value: function ws() {
      while (this.chr() == ' ') {
        this.index += 1;
      }
    }
  }]);

  return Parser;
}();

// export default Parser;

var script = '//#define a = 233\nvar a = /*# a #*/ / /*# 233 #*/ + 1\n//#if a > 100\nconsole.log(100)\n//#else\nconsole.log(0)\n//#endif';

var parser = new Parser();
var ast = parser.parse(script, 'main.js');
console.log(ast);