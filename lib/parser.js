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
      console.log(codeStr);
      var tokens = new _tokenizer2.default(codeStr, start).run();
      // let nodeStack = []
      // let node
      // tokens.forEach((token) => {
      //   switch (token.type) {
      //     case 'value':
      //       node = {
      //         type: 'value',
      //         value: token.value,
      //         pos: this.getPos(start, value.pos)
      //       }
      //       break
      //     case 'keyword':

      //       break
      //     case 'flag':

      //       break
      //     case 'globalIdentifier':

      //       break
      //     case 'identifier':

      //       break
      //     case 'arithmetic':

      //       break
      //   }
      // })
      return {
        type: 'code',
        value: tokens,
        pos: this.getPos(start, 0)
      };
    }
  }]);

  return Parser;
}();

exports.default = Parser;