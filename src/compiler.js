import error from './error'
import Scopes from './scopes'

class Compiler {
  constructor(ast, flag) {
    this.ast = ast;
    this.flag = flag;
    this.rootScopes = new Scopes();
    this.scopes = this.rootScopes;
  }

  eval(node) {
    let value;
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
        error(SyntaxError, 'Error AST node type.', node.pos)
        break;
    }
    return value
  }

  eachEval(nodes) {
    let value = '';
    nodes.forEach((node) => { value += this.eval(node) }, nodes);
    return value;
  }

  cc() {
    return this.eachEval(this.ast);
  }

  flag(node) {
    /**
     * {
     *    type: 'flag',
     *    identifier: @flagIdentifier,
     *    pos: @posObject
     * }
     */
    return this.flag.get(node.identifier)
  }

  identifier(node) {
    /**
     * {
     *    type: 'identifier',
     *    global: Boolean,
     *    identifier: @globalIdentifier | @identifier,
     *    pos: @posObject
     * }
     */
    if (!this.scopes.allHas(node.identifier)) {
      error(ReferenceError, `Identifier ${node.identifier} is not defined`, node.pos);
    }
    return this.scopes.get(node.identifier);
  }

  value(node) {
    /**
     * {
     *    type: 'value',
     *    value: Number | String | Boolean | Null | Undefined | Regexp,
     *    pos: @posObject
     * }
     */
    return node.value
  }

  globalVariableDeclaration(node) {
    /**
     * {
     *    type: 'globalVariableDeclaration',
     *    identifier: @globalIdentifier
     *    value: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression
     *    pos: @posObject
     * }
     */
    if (!this.rootScopes.add(node.identifier, this.eval(node.value))) {
      error(SyntaxError, `Identifier '${node.identifier}' has already been declared`, node.pos);
    }
    return '';
  }

  variableDeclaration(node) {
    /**
     * {
     *    type: 'variableDeclaration',
     *    identifier: @identifier
     *    value: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression
     *    pos: @posObject
     * }
     */
    if (this.scopes.add(node.identifier, this.eval(node.value))) {
      error(SyntaxError, `Identifier '${node.identifier}' has already been declared`, node.pos);
    }
    return '';
  }

  variableUpdate(node) {
    /**
     * {
     *    type: 'variableUpdate',
     *    identifier: @globalIdentifier | @identifier
     *    value: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression
     *    pos: @posObject
     * }
     */
    let scopes = node.global ? this.rootScopes : this.scopes;
    if (!scopes.set(node.identifier, this.eval(node.value))) {
      error(ReferenceError, `Identifier ${node.identifier} is not defined`, node.pos);
    }

    return '';
  }

  ifStatement(node) {
    /**
     * {
     *    type: 'ifStatement',
     *    ifTest: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression,
     *    ifConsequent: [@flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement | @script],
     *    ifAlternate:  [@flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement | @script],
     *    pos: @posObject
     * }
     */
    this.scopes = new Scopes(this.scopes);
    let value;
    if (this.eval(node.ifTest)) {
      value = this.eachEval(node.ifConsequent);
    } else {
      value = this.eachEval(node.ifAlternate);
    }
    this.scopes = this.scopes.parent;
    return value;
  }

  unaryExpression(node) {
    /**
     * {
     *    type: 'unaryExpression',
     *    operator: @unaryOperator
     *    value: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
     *    pos: @posObject
     * }
     */
    let value;
    switch (node.operator) {
      case '!':
        value = !this.eval(node.value);
        break;
      case '~':
        value = ~this.eval(node.value);
        break;
      case 'typeof':
        value = typeof this.eval(node.value);
        break;
      case 'void':
        value = void this.eval(node.value);
        break;
      default:
        error(SyntaxError, `Operator ${node.operator} is not defined`, node.pos);
        break;
    }
    return value;
  }

  binaryExpression(node) {
    /**
     * {
     *    type: 'binaryExpression',
     *    operator: @binaryOperator
     *    left: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
     *    right: @flag | @globalIdentifier | @identifier | @value | @unaryExpression | @binaryExpression | @conditionalExpression | @ifStatement,
     *    pos: @posObject
     * }
     */
    let value;
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
        break
      case '!==':
        value = this.eval(node.left) !== this.eval(node.right);
        break;
       case '&':
        value = this.eval(node.left) & this.eval(node.right);
        break
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
        error(SyntaxError, `Operator ${node.operator} is not defined`, node.pos);
        break;
     }
     return value;
  }

  conditionalExpression(node) {
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

  script(node) {
    /**
     * {
     *    type: 'script',
     *    value: ScriptString,
     *    pos: @posObject
     * }
     */
    return node.value;
  }

}

export default Compiler;