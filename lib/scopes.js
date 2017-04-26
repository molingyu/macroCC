"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scopes = function () {
  function Scopes() {
    var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, Scopes);

    this.parent = parent;
    if (this.parent) this.parent.addChild(this);
    this.children = [];
    this.table = new Map();
  }

  _createClass(Scopes, [{
    key: "addChild",
    value: function addChild(child) {
      this.children.push(child);
    }
  }, {
    key: "add",
    value: function add(key, value) {
      if (this.has(key)) return false;
      this.table.set(key, value);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (!this.allHas(key)) return false;
      this.table.set(key, value);
    }
  }, {
    key: "get",
    value: function get(key) {
      var scopes = this;
      while (!scopes.table.has(key)) {
        scopes = scopes.parent;
      }
      return scopes.table.get(key);
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.table.has(key);
    }
  }, {
    key: "allHas",
    value: function allHas(key) {
      var scopes = this;
      while (scopes) {
        if (scopes.has(key)) {
          return true;
        } else {
          scopes = scopes.parent;
        }
      }
    }
  }]);

  return Scopes;
}();

exports.default = Scopes;