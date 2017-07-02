'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = error;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function error(type, msg, pos) {
  var error = type.name + ': ' + msg + '(' + pos.file + ':' + pos.lines + ':' + pos.cols + ')';
  var errorScript = getErrorScript(pos);
  console.log(error + '\n' + errorScript);
  process.exit(1);
}

function getErrorScript(pos) {
  var str = '';
  var codes = $macroCCScript.split('\n');
  var lines = [pos.lines - 2, pos.lines - 1, pos.lines, pos.lines + 1, pos.lines + 2];
  var maxWidth = lines[4].toString().length;
  lines.forEach(function (lineIndex) {
    var code = codes[lineIndex - 1];
    var width = lineIndex.toString().length;
    var lineIndexStr = maxWidth - width > 0 ? Array().join(' ') + lineIndex : '' + lineIndex;
    if (lineIndex == pos.lines) {
      str += _chalk2.default.red('> ') + _chalk2.default.gray(lineIndexStr + ' | ') + (code + '\n');
      str += _chalk2.default.gray(Array(maxWidth + 3).join(' ') + ' | ') + Array(pos.cols).join(' ') + _chalk2.default.red('^\n');
    } else {
      if (code != void 0) str += '  ' + _chalk2.default.gray(lineIndexStr + ' |') + ' ' + code + '\n';
    }
  });
  return str;
}