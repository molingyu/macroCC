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
  function Tokenizer(pos, code, lineCode) {
    _classCallCheck(this, Tokenizer);

    this.code = code;
    this.index = 0;
    this.pos = pos;
  }

  _createClass(Tokenizer, [{
    key: 'run',
    value: function run() {
      var tokens = [];
      while (this.chr() != void 0) {
        tokens.push(this.exp(), this.chr());
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
      return this.code[this.index] == chr;
    }
  }, {
    key: 'ws',
    value: function ws() {}
  }, {
    key: 'chr',
    value: function chr() {
      return this.code[this.index];
    }
  }, {
    key: 'skip',
    value: function skip() {}
  }, {
    key: 'getPos',
    value: function getPos() {
      var pos = Object.assign({}, this.pos);
      pos.cols += this.index;
      return pos;
    }
  }, {
    key: 'exp',
    value: function exp() {
      this.ws();
      var chr = this.chr();
      if (chr.match(/[A-Z]/)) {
        return {
          type: 'flag',
          pos: this.index,
          value: this.flag()
        };
      }
      if (chr = '$') {
        return {
          type: 'globalIdentifier',
          pos: this.index,
          value: this.globalIdentifier()
        };
      }
      if (chr.match(/[a-z_]/)) {
        var pos = this.index;
        var value = this.identifier();
        if (value.match(/true||false||null||undefined/)) {
          value = eval(value);
          type = 'keyword';
        } else {
          type = 'identifier';
        }
        return { type: type, pos: pos, value: value };
      }
      if (chr.match(/['"]/)) {
        return {
          type: 'string',
          pos: this.index,
          value: this.string()
        };
      }
      if (chr = '/') {
        return {
          type: 'string',
          pos: this.index,
          value: this.regexp()
        };
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
          }
          // if() {

          // }
          break;
        }
      }
    }
  }, {
    key: 'string',
    value: function string() {}
  }, {
    key: 'regexp',
    value: function regexp() {}
  }, {
    key: 'identifier',
    value: function identifier() {}
  }, {
    key: 'globalIdentifier',
    value: function globalIdentifier() {}
  }, {
    key: 'flag',
    value: function flag() {}
  }]);

  return Tokenizer;
}();

exports.default = Tokenizer;