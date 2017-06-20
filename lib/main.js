'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = exports.Parser = exports.flag = exports.macroCC = undefined;

var _flag = require('./flag');

var _flag2 = _interopRequireDefault(_flag);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _scopes = require('./scopes');

var _scopes2 = _interopRequireDefault(_scopes);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function macroCC(str) {
  var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _flag2.default)();

  var ast = new _parser2.default().parse(str);
  return new _compiler2.default(ast, flags).cc();
}

exports.macroCC = macroCC;
exports.flag = _flag2.default;
exports.Parser = _parser2.default;
exports.Compiler = _compiler2.default;