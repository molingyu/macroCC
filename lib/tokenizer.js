'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tokenizer = function () {
  function Tokenizer(code, pos) {
    _classCallCheck(this, Tokenizer);

    this.code = code;
    this.index = 0;
    this.pos = pos;
    this.arithmetics = ['!', '~', '(', ')', '*', '/', '%', '+', '-', '>', '<', '>=', '>=', '==', '!=', '>>>', '===', '!==', '='];
    this.keyword = ['define', 'if', 'else', 'endif'];
  }

  _createClass(Tokenizer, [{
    key: 'run',
    value: function run() {
      var tokens = [];
      this.ws();
      while (this.chr() != void 0) {
        tokens.push(this.expression());
        this.ws();
      }
      return tokens;
    }
  }, {
    key: 'next',
    value: function next() {
      this.index += 1;
    }
  }, {
    key: 'nextIs',
    value: function nextIs(chr) {
      return this.code[this.index + 1] == chr;
    }
  }, {
    key: 'ws',
    value: function ws() {
      while (this.chr() == ' ') {
        this.index += 1;
      }
    }
  }, {
    key: 'chr',
    value: function chr() {
      return this.code[this.index];
    }
  }, {
    key: 'skip',
    value: function skip(str) {
      for (var i in str) {
        if (str[i] != this.chr()) return false;
        this.index += 1;
      }
      return true;
    }
  }, {
    key: 'getPos',
    value: function getPos() {
      var pos = Object.assign({}, this.pos);
      pos.cols += this.index;
      return pos;
    }
  }, {
    key: 'expression',
    value: function expression() {
      var chr = this.chr();
      if (chr.match(/[A-Z]/)) {
        return {
          type: 'flag',
          pos: this.index,
          value: this.flag()
        };
      } else if (chr == '$') {
        return {
          type: 'globalIdentifier',
          pos: this.index,
          value: this.globalIdentifier()
        };
      } else if (chr.match(/[a-z_]/)) {
        var type = void 0;
        var pos = this.index;
        var value = this.identifier();
        if (this.keyword.includes(value)) {
          type = 'keyword';
        } else if (value.match(/true||false||null||undefined/) == value) {
          type = 'value';
          value = eval(value);
        } else {
          type = 'identifier';
        }
        return { type: type, pos: pos, value: value };
      } else if (chr.match(/['"]/)) {
        return {
          type: 'value',
          pos: this.index,
          value: this.string()
        };
      } else if (chr.match(/[0-9]/)) {
        return {
          type: 'value',
          pos: this.index,
          value: this.number()
        };
      } else if (this.arithmetics.includes(chr)) {
        return {
          type: 'arithmetic',
          pos: this.index,
          value: this.arithmetic()
        };
      } else if (this.skip('typeof')) {
        return {
          type: 'arithmetic',
          pos: this.index,
          value: 'typeof'
        };
      } else if (this.skip('void')) {
        return {
          type: 'arithmetic',
          pos: this.index,
          value: 'void'
        };
      } else {
        (0, _error2.default)(SyntaxError, 'Invalid or unexpected token \'' + chr + '\'', this.getPos());
      }
    }
  }, {
    key: 'number',
    value: function number() {
      var number = '';
      var decHas = false;
      var eHas = false;
      while (true) {
        if (this.chr() == void 0) break;
        if (this.chr().match(/[0-9.]/)) {
          if (this.chr() == '.') {
            if (decHas || eHas) {
              (0, _error2.default)(SyntaxError, 'Unexpected number', this.getPos());
            }
          }
          decHas = true;
          number += this.chr();
          this.next();
        } else {
          if (this.chr().match(/[eE]/)) {
            if (eHas) {
              (0, _error2.default)(SyntaxError, 'Unexpected number', this.getPos());
            } else {
              eHas = true;
              number += this.chr();
              this.next();
            }
          } else if (this.chr().match(/[+-]/)) {
            if (this.code[this.index - 1].match(/[eE]/)) {
              number += this.chr();
              this.next();
            }
          } else {
            break;
          }
        }
      }
      number = Number(number);
      if (isNaN(number)) {
        (0, _error2.default)(SyntaxError, 'Bad number', this.getPos());
      } else {
        return number;
      }
    }
  }, {
    key: 'string',
    value: function string() {
      var string = '';
      var startStr = this.chr();
      var lastIs = false;
      this.next();
      while (true) {
        if (this.chr() == void 0) (0, _error2.default)(SyntaxError, 'Invalid or unexpected token', this.getPos());
        if (this.chr() == '/') {
          lastIs = !lastIs;
          if (lastIs && this.nextIs(startStr)) {
            this.next();
            break;
          }
          string += this.chr();
          this.next();
        }
      }
    }
  }, {
    key: 'identifier',
    value: function identifier() {
      var identifier = '';
      while (this.chr() != void 0 && this.chr().match(/[_a-z0-9]/)) {
        identifier += this.chr();
        this.next();
      }
      return identifier;
    }
  }, {
    key: 'globalIdentifier',
    value: function globalIdentifier() {
      var globalIdentifier = '$';
      this.next();
      while (this.chr() != void 0 && this.chr().match(/[_a-z0-9]/)) {
        globalIdentifier += this.chr();
        this.next();
      }
      return globalIdentifier;
    }
  }, {
    key: 'flag',
    value: function flag() {
      var flag = '';
      while (this.chr().match(/[_A-Z0-9]/)) {
        flag += this.chr();
        this.next();
      }
      return flag;
    }
  }, {
    key: 'arithmetic',
    value: function arithmetic() {
      var arithmetic = this.chr();
      this.next();
      if (this.nextIs('=')) {
        arithmetic += this.chr();
        this.next();
        if (this.nextIs('=')) {
          arithmetic += this.chr();
          this.next();
        }
      } else {
        if (this.skip('>>') && this.code[this.index - 1] == '>') {
          arithmetic = '>>>';
        }
      }
      return arithmetic;
    }
  }]);

  return Tokenizer;
}();

exports.default = Tokenizer;