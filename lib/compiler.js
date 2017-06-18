'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _error = require('./error');

var _error2 = _interopRequireDefault(_error);

var _scopes = require('./scopes');

var _scopes2 = _interopRequireDefault(_scopes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Compiler = function () {
  function Compiler(ast, flag) {
    _classCallCheck(this, Compiler);

    this.ast = ast;
    this.flag = flag;
    this.rootScopes = new _scopes2.default();
    this.scopes = this.rootScopes;
  }

  _createClass(Compiler, [{
    key: 'eval',
    value: function _eval(node) {
      var value = void 0;
      switch (node.type) {
        case 'flag':
          value = this.flag(node);
          break;
        case 'identifier':
          value = this.identifier(node);
          break;
        case 'value':
          value = this.value(node);
          break;
        case 'globalVariableDeclaration':
          value = this.globalVariableDeclaration(node);
          break;
        case 'variableDeclaration':
          value = this.variableDeclaration(node);
          break;
        case 'variableUpdate':
          value = this.variableUpdate(node);
          break;
        case 'ifStatement':
          value = this.ifStatement(node);
          break;
        case 'unaryExpression':
          value = this.unaryExpression(node);
          break;
        case 'binaryExpression':
          value = this.binaryExpression(node);
          break;
        case 'conditionalExpression':
          value = this.conditionalExpression(node);
          break;
        case 'script':
          value = this.script(node);
          break;
        default:
          (0, _error2.default)(SyntaxError, 'Error AST node type.', node.pos);
          break;
      }
      return value;
    }
  }, {
    key: 'eachEval',
    value: function eachEval(nodes) {
      var _this = this;

      var value = '';
      nodes.forEach(function (node) {
        value += _this.eval(node);
      }, nodes);
      return value;
    }
  }, {
    key: 'cc',
    value: function cc() {
      return this.eachEval(this.ast);
    }
  }, {
    key: 'flag',
    value: function flag(node) {
      /**
       * {
       *    type: 'flag',
       *    identifier: @flagIdentifier,
       *    pos: @posObject
       * }
       */
      return this.flag.get(node.identifier);
    }
  }, {
    key: 'identifier',
    value: function identifier(node) {
      /**
       * {
       *    type: 'identifier',
       *    global: Boolean,
       *    identifier: @globalIdentifier | @identifier,
       *    pos: @posObject
       * }
       */
      if (!this.scopes.allHas(node.identifier)) {
        (0, _error2.default)(ReferenceError, 'Identifier ' + node.identifier + ' is not defined', node.pos);
      }
      return this.scopes.get(node.identifier);
    }
  }, {
    key: 'value',
    value: function value(node) {
      /**
       * {
       *    type: 'value',
       *    value: Number | String | Boolean | Null | Undefined | Regexp,
       *    pos: @posObject
       * }
       */
      return node.value;
    }
  }, {
    key: 'globalVariableDeclaration',
    value: function globalVariableDeclaration(node) {
      /**
       * {
       *    type: 'globalVariableDeclaration',
       *    
       *    identifier: @globalIdentifier
       *    value: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression
       *    pos: @posObject
       * }
       */
      if (!this.rootScopes.add(node.identifier, this.eval(node.value))) {
        (0, _error2.default)(SyntaxError, 'Identifier \'' + node.identifier + '\' has already been declared', node.pos);
      }
      return '';
    }
  }, {
    key: 'variableDeclaration',
    value: function variableDeclaration(node) {
      /**
       * {
       *    type: 'variableDeclaration',
       *    identifier: @identifier
       *    value: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression
       *    pos: @posObject
       * }
       */
      if (this.scopes.add(node.identifier, this.eval(node.value))) {
        (0, _error2.default)(SyntaxError, 'Identifier \'' + node.identifier + '\' has already been declared', node.pos);
      }
      return '';
    }
  }, {
    key: 'variableUpdate',
    value: function variableUpdate(node) {
      /**
       * {
       *    type: 'variableUpdate',
       *    identifier: @globalIdentifier | @identifier
       *    value: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression
       *    pos: @posObject
       * }
       */
      var scopes = node.global ? this.rootScopes : this.scopes;
      if (!scopes.set(node.identifier, this.eval(node.value))) {
        (0, _error2.default)(ReferenceError, 'Identifier ' + node.identifier + ' is not defined', node.pos);
      }

      return '';
    }
  }, {
    key: 'ifStatement',
    value: function ifStatement(node) {
      /**
       * {
       *    type: 'ifStatement',
       *    ifTest: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression,
       *    ifConsequent: [@flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement | @script],
       *    ifAlternate:  [@flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement | @script],
       *    pos: @posObject
       * }
       */
      this.scopes = new _scopes2.default(this.scopes);
      var value = void 0;
      if (this.eval(node.ifTest)) {
        value = this.eachEval(node.ifConsequent);
      } else {
        value = this.eachEval(node.ifAlternate);
      }
      this.scopes = this.scopes.parent;
      return value;
    }
  }, {
    key: 'unaryExpression',
    value: function unaryExpression(node) {
      /**
       * {
       *    type: 'unaryExpression',
       *    operator: @unaryOperator
       *    value: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
       *    pos: @posObject
       * }
       */
      var value = void 0;
      switch (node.operator) {
        case '!':
          value = !this.eval(node.value);
          break;
        case '~':
          value = ~this.eval(node.value);
          break;
        case 'typeof':
          value = _typeof(this.eval(node.value));
          break;
        case 'void':
          value = void this.eval(node.value);
          break;
        default:
          (0, _error2.default)(SyntaxError, 'Operator ' + node.operator + ' is not defined', node.pos);
          break;
      }
      return value;
    }
  }, {
    key: 'binaryExpression',
    value: function binaryExpression(node) {
      /**
       * {
       *    type: 'binaryExpression',
       *    operator: @binaryOperator
       *    left: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
       *    right: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
       *    pos: @posObject
       * }
       */
      var value = void 0;
      switch (node.operator) {
        case '*':
          value = this.eval(node.left) * this.eval(node.right);
          break;
        case '/':
          value = this.eval(node.left) / this.eval(node.right);
          break;
        case '%':
          value = this.eval(node.left) % this.eval(node.right);
          break;
        case '+':
          value = this.eval(node.left) + this.eval(node.right);
          break;
        case '-':
          value = this.eval(node.left) - this.eval(node.right);
          break;
        case '<<':
          value = this.eval(node.left) << this.eval(node.right);
          break;
        case '>>':
          value = this.eval(node.left) >> this.eval(node.right);
          break;
        case '>>>':
          value = this.eval(node.left) >>> this.eval(node.right);
          break;
        case '<':
          value = this.eval(node.left) < this.eval(node.right);
          break;
        case '<=':
          value = this.eval(node.left) <= this.eval(node.right);
          break;
        case '>':
          value = this.eval(node.left) > this.eval(node.right);
          break;
        case '>=':
          value = this.eval(node.left) >= this.eval(node.right);
          break;
        case '==':
          value = this.eval(node.left) == this.eval(node.right);
          break;
        case '!=':
          value = this.eval(node.left) != this.eval(node.right);
          break;
        case '===':
          value = this.eval(node.left) === this.eval(node.right);
          break;
        case '!==':
          value = this.eval(node.left) !== this.eval(node.right);
          break;
        case '&':
          value = this.eval(node.left) & this.eval(node.right);
          break;
        case '^':
          value = this.eval(node.left) ^ this.eval(node.right);
          break;
        case '|':
          value = this.eval(node.left) | this.eval(node.right);
          break;
        case '&&':
          value = this.eval(node.left) && this.eval(node.right);
          break;
        case '||':
          value = this.eval(node.left) || this.eval(node.right);
          break;
        default:
          (0, _error2.default)(SyntaxError, 'Operator ' + node.operator + ' is not defined', node.pos);
          break;
      }
      return value;
    }
  }, {
    key: 'conditionalExpression',
    value: function conditionalExpression(node) {
      /**
       * {
       *    type: 'conditionalExpression',
       *    test: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
       *    consequent: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
       *    alternate: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
       *    pos: @posObject
       * }
       */
      if (this.eval(node.test)) {
        return this.eval(node.consequent);
      } else {
        return this.eval(node.alternate);
      }
    }
  }, {
    key: 'script',
    value: function script(node) {
      /**
       * {
       *    type: 'script',
       *    value: ScriptString,
       *    pos: @posObject
       * }
       */
      return node.value;
    }
  }]);

  return Compiler;
}();

exports.default = Compiler;