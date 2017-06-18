"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = error;
function error(type, msg, pos) {
  throw new type(msg + "(" + pos.file + ":" + pos.line + ":" + pos.index + ")", pos);
}