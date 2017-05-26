'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MacroCCError = function (_Error) {
  _inherits(MacroCCError, _Error);

  /**
   * 
   * @param {Number} line 
   * @param {Number} pos 
   * @param {String} message 
   */
  function MacroCCError(message, line, pos) {
    _classCallCheck(this, MacroCCError);

    if (arguments.length == 1) {
      var _this = _possibleConstructorReturn(this, (MacroCCError.__proto__ || Object.getPrototypeOf(MacroCCError)).call(this, arguments[0]));
    } else {
      var _this = _possibleConstructorReturn(this, (MacroCCError.__proto__ || Object.getPrototypeOf(MacroCCError)).call(this, arguments[2] + "\n" + 'line: ' + arguments[0] + ',pos: ' + arguments[1]));
    }
    _this.name = 'MacroCCError';
    return _possibleConstructorReturn(_this);
  }

  _createClass(MacroCCError, [{
    key: 'print',
    value: function print() {
      console.error(this.name + ':' + this.message + "\n" + 'line: ' + this.line + ',pos: ' + this.pos);
    }
  }]);

  return MacroCCError;
}(Error);

exports.default = MacroCCError;