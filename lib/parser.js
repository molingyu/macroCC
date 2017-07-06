'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _tokenizer = require('./tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
  function Parser() {
    _classCallCheck(this, Parser);

    this.nodeStack = [];
    this.list = [];
    this.nodeIndex = 0;
  }

  _createClass(Parser, [{
    key: 'parse',
    value: function parse(codeStr) {
      var _this = this;

      var file = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var start = {
        file: file,
        lines: 1,
        cols: 0
      };
      var ASTRoot = {
        type: 'root',
        child: []
      };
      this.nodeStack.push(ASTRoot);
      var codes = codeStr.split('\n');
      var script = '';
      codes.forEach(function (line, index) {
        start.lines = index + 1;
        start.cols = 0;
        _this.nodeIndex = 0;
        _this.reList();
        if (line.slice(0, 3) == '//#') {
          if (script != '') {
            _this.list.push({ type: 'script', value: script, pos: Object.assign({}, start) });
            script = '';
          }
          start.cols = 3;
          var node = _this.code(line.slice(3, line.length), Object.assign({}, start));
          if (node != void 0) _this.list.push(node);
        } else {
          var reg = void 0;
          while (reg = line.match(/\/\*#(.*?)#\*\//)) {
            script += line.slice(0, reg.index);
            _this.list.push({ type: 'script', value: script, pos: Object.assign({}, start) });
            script = '';
            start.cols += reg.index + 3;
            var _node = _this.code(reg[1], Object.assign({}, start));
            if (_node != void 0) _this.list.push(_node);
            start.cols += reg[0].length - 3;
            line = line.slice(reg.index + reg[0].length, line.length);
          }
          script += line + '\n';
        }
      });
      this.reList();
      if (this.node != ASTRoot) {
        var pos = this.getPos(start, 0);
        pos.cols = codes[codes.length - 1].length - 1;
        (0, _error2.default)(SyntaxError, 'Unexpected endif of input', pos);
      }
      return ASTRoot;
    }
  }, {
    key: 'reList',
    value: function reList() {
      this.node = this.nodeStack[this.nodeStack.length - 1];
      if (this.node.type == 'ifStatement') {
        this.list = this.node.isConsequent ? this.node.ifConsequent : this.node.ifAlternate;
      } else {
        this.list = this.node.child;
      }
    }
  }, {
    key: 'getPos',
    value: function getPos(posObject, index) {
      var pos = Object.assign({}, posObject);
      pos.cols += index;
      return pos;
    }
  }, {
    key: 'code',
    value: function code(codeStr, start) {
      this.tokens = new _tokenizer2.default(codeStr, start).run();
      console.log(this.tokens);
      while (this.token() != void 0) {
        switch (this.token().type) {
          case 'value':
            return {
              type: 'value',
              value: this.token().value,
              pos: this.getPos(start, this.token().pos)
            };
          case 'keyword':
            return this.keyword(start);
          case 'flag':
            return {
              type: 'flag',
              identifier: this.token().value,
              pos: this.getPos(start, this.token().pos)
            };
          case 'globalIdentifier':
            return this.identifier(start);
          case 'identifier':
            return this.identifier(start);
          default:
            (0, _error2.default)(SyntaxError, 'error token type', this.getPos(start, this.nodeIndex));
        }
      }
    }
  }, {
    key: 'token',
    value: function token() {
      return this.tokens[this.nodeIndex];
    }
  }, {
    key: 'next',
    value: function next() {
      this.nodeIndex += 1;
    }
  }, {
    key: 'isOnly',
    value: function isOnly(pos) {
      this.next();
      if (this.token() != void 0) {
        (0, _error2.default)(SyntaxError, 'Unexpected token ' + this.token().value, this.getPos(pos, this.token().pos));
      }
    }
  }, {
    key: 'identifier',
    value: function identifier(start) {
      if (this.tokens[this.tokens.length - 1] == this.token()) {
        return {
          type: 'identifier',
          identifier: this.token().value,
          pos: this.getPos(start, this.token().pos)
        };
      } else {
        var node = {};
        node.type = 'variableUpdate';
        node.identifier = this.token().value;
        node.pos = this.getPos(start, this.token().pos);
        this.next();
        if (this.token().value == '=') {
          node.value = this.expression(start);
        } else {
          (0, _error2.default)(SyntaxError, 'Unexpected token ' + this.token().value, this.getPos(start, posIndex));
        }
      }
    }
  }, {
    key: 'expression',
    value: function expression(start) {
      return {
        type: 'expression',
        value: this.tokens.slice(this.nodeIndex, this.tokens.length),
        pos: this.getPos(start, 0)
      };
    }
  }, {
    key: 'keyword',
    value: function keyword(start) {
      var node = {};
      var posIndex = this.token().pos;
      console.log('keyword:', this.token().value);
      switch (this.token().value) {
        case 'define':
          this.next();
          var obj = {
            'globalIdentifier': 'globalVariableDeclaration',
            'identifier': 'variableDeclaration'
          };
          if (obj[this.token().type] != void 0) {
            node.type = obj[this.token().type];
            node.identifier = this.token().value;
            this.next();
            if (this.token().value == '=') {
              this.next();
              node.value = this.expression(start);
              node.pos = this.getPos(start, posIndex);
              return node;
            } else {
              (0, _error2.default)(SyntaxError, 'Unexpected token ' + this.token().value, this.getPos(start, posIndex));
            }
          } else {
            (0, _error2.default)(SyntaxError, 'Unexpected token ' + this.token().value, this.getPos(start, posIndex));
          }
        case 'if':
          node.type = 'ifStatement';
          node.test = this.expression(start);
          node.ifConsequent = [];
          node.ifAlternate = [];
          node.isConsequent = true;
          node.pos = this.getPos(start, posIndex);
          this.nodeStack.push(node);
          return node;
        case 'else':
          this.isOnly(start);
          if (this.node.type != 'ifStatement') {
            (0, _error2.default)(SyntaxError, 'Unexpected token else', this.getPos(start, posIndex));
          }
          this.node.isConsequent = false;
          break;
        case 'endif':
          this.isOnly(start);
          if (this.node.type != 'ifStatement') {
            (0, _error2.default)(SyntaxError, 'Unexpected token endif', this.getPos(start, posIndex));
          }
          delete this.node.isConsequent;
          this.nodeStack.pop();
          break;
        default:
          (0, _error2.default)('Unexpected token ' + this.token().value, this.getPos(start, posIndex));
      }
    }
  }]);

  return Parser;
}();

exports.default = Parser;