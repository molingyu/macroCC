'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
  function Parser() {
    _classCallCheck(this, Parser);

    this.ast = [];
    this.pos = { line: 1, index: 0 };
    this.deep = 0;
    this.nodeList = [];
    this.codeStr = '';
    this.index = 0;
  }

  _createClass(Parser, [{
    key: 'parse',
    value: function parse(codeStr) {
      var codes = codeStr.split('\n');
      var start = { line: this.pos.line, index: this.pos.index };
      var script = '';
      codes.forEach(function (line) {
        this.node = this.nodeList[this.nodeList.length - 1];
        if (this.node) {
          this.list = this.node.else ? this.node.ifConsequent : this.node.ifAlternate;
        } else {
          this.list = this.ast;
        }
        if (line.slice(0, 3) == '//#') {
          if (script != '') {
            console.log(start);
            this.list.push({ type: 'script', value: script, pos: start });
            start = { line: this.pos.line, index: this.pos.index };
            script = '';
          }
          console.log(start);
          this.code(line.slice(3, line.length), start);
        } else {
          var reg = line.match(/\/\*#(.*)#\*\//);
          if (reg) {
            script += line.slice(0, reg.index);
            this.list.push({ type: 'script', value: script, pos: start });
            start = { line: this.pos.line, index: this.pos.index };
            script = '';
            this.code(reg[1], start);
            start.index += reg.index + reg[0].length;
            var antherLine = line.slice(reg.index + reg[0].length, line.length);
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
  }, {
    key: 'expression',
    value: function expression() {
      return 'expression 233';
    }
  }, {
    key: 'code',
    value: function code(codeStr, start) {
      this.codeStr = codeStr;
      this.ws();
      console.log(this.codeStr);
      if (this.nextIs('define')) {
        this.ws();
        var node = { pos: start };
        if (this.chr() == '$') node.type = this.nextIs('$') ? 'globalVariableDeclaration' : 'variableDeclaration';
        node.identifier = this.name();
        node.value = this.expression();
        this.list.push(node);
        this.clear();
      } else if (this.nextIs('if')) {
        this.deep += 1;
        this.ws();
        var _node = {
          type: 'ifStatement',
          ifConsequent: [],
          ifAlternate: [],
          pos: start,
          deep: this.deep,
          else: true
        };
        _node.ifTest = this.expression();
        this.nodeList.push(_node);
        this.clear();
      } else if (this.nextIs('else')) {
        console.log(this.nodeList);
        if (this.node.deep != this.deep) {
          error();
        }
        this.node.else = false;
        this.clear();
      } else if (this.nextIs('endif')) {
        delete this.node.deep;
        delete this.node.else;
        var _node2 = this.node;
        this.nodeList.pop();
        this.node = this.nodeList[this.nodeList.length - 1];
        if (this.node) {
          this.list = this.node.else ? this.node.ifConsequent : this.node.ifAlternate;
        } else {
          this.list = this.ast;
        }
        this.list.push(_node2);
        this.deep -= 1;
        this.clear();
      } else {
        this.ast.push({ type: 'code', value: codeStr, pos: start });
        this.clear();
      }
    }
  }, {
    key: 'number',
    value: function number() {
      var number = '';
      while (this.chr().match(/[0-9\.]/)) {
        number += this.chr();
        this.index += 1;
      }
      if (number.match(/^[0-9]+.?[0-9]*$/) != number) {
        new _error2.default('error number string(' + number + ')!');
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
    value: function name() {
      var name = '';
      var line = this.pos.line;
      var pos = this.pos.index;
      if (this.nextIs('$')) {
        this.chr().match(/[_a-z]/);
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.codeStr = '';
      this.index = 0;
    }
  }, {
    key: 'nextIs',
    value: function nextIs(str) {
      console.log(this.index, this.codeStr.slice(this.index, str.length), str);
      if (this.codeStr.slice(this.index, str.length) == str) {
        this.index += str.length;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'chr',
    value: function chr() {
      return this.codeStr[this.index];
    }
  }, {
    key: 'ws',
    value: function ws() {
      while (this.chr() == ' ') {
        this.index += 1;
        if (this.chr() == void 0) break;
      }
    }
  }]);

  return Parser;
}();

exports.default = Parser;