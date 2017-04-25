class Scopes {
  constructor(parent = null) {
    this.parent = parent;
    if (this.parent) this.parent.addChild(this);
    this.children = [];
    this.table = new Map();
  }
}

class Compiler {
  constructor(ast, flag) {
    this.ast = ast;
    this.flag = flag;
    this.CCScript = '';
    this.rootScopes = new Scopes();
    this.cc();
  }

  cc() {
    let ast = this.ast;
    ast.forEach(function (node) {
      let code;
      switch (node.type) {
        case 'globalVariableDeclaration':
          code = this.globalVariableDeclaration(node);
          break;
        default:
          break;
      }
      this.CCScript += code;
    }, ast);
  }

  globalVariableDeclaration(node) {
    /**
     * {
     *    type: 'globalVariableDeclaration',
     *    identifier: @globalIdentifier
     *    value: @valueNode
     *    pos: @posObject
     * }
     */
    if (this.rootScopes.has(node.identifier)) {
      error(`SyntaxError: Identifier '${node.identifier}' has already been declared`, node.pos);
    }
    let value = this.value(node.value);
    this.rootScopes.set(node.identifier, value);
    return '';
  }
  
}

export default Compiler;