'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = error;
function error(type, msg, pos) {
  console.error(msg + '\n' + pos);
}