var expect = require('chai').expect;
var Compiler = require('../lib/compiler').default;

var ast = [
  {
    type: 'variableDeclaration',
    identifier: 'a',
    value: {
      type: 'binaryExpression',
      operator: '*',
      left: {
        type: 'value',
        value: 23
      },
      right: {
        type: 'value',
        value: 23
      },
      pos: '1-binaryExpression'
    },
    pos: '1-variableDeclaration'
  },
  {
    type: 'script',
    value: 'var a = '
  },
  {
    type: 'identifier',
    global: false,
    identifier: 'a',
    pos: '1-identifier'
  },
  {
    type: 'script',
    value: ' / 2\n'
  },
  {
    type: 'ifStatement',
    ifTest: {
      type: 'binaryExpression',
      operator: '>',
      left: {
        type: 'identifier',
        global: false,
        identifier: 'a',
        pos: '2-identifier'
      },
      right: {
        type: 'value',
        value: 100
      },
      pos: '2-binaryExpression->'
    },
    ifConsequent: [
      {
        type: 'script',
        value: 'console.log(100)\n'
      }
    ],
    ifAlternate: [
      {
        type: 'script',
        value: 'console.log(0)\n'
      }
    ]
  }
];

var CCScript = 'var a = 529 / 2\nconsole.log(100)\n'
var flag = new Map()
flag.set('WIN', true)
var compiler = new Compiler(ast, flag)

describe('compiler', function () {
  describe('#cc', function () {
    it('should return CCScript:\n' + CCScript, function () {
      expect(compiler.cc()).to.be.equal(CCScript)
    })
  })

  describe('#node-flag', function () {
    var node = {
      type: 'flag',
      identifier: 'WIN',
      pos: {}
    }
    it('should return flag["WIN"](true)', function () {
      expect(compiler.flag(node)).to.be.equal(true)
    })
  })

  describe('#node-globalVariableDeclaration', function () {
    var node = {
      type: 'globalVariableDeclaration',
      identifier: '$test',
      value: {
        type: 'flag',
        identifier: 'WIN',
        pos: {}
      },
      pos: {
        file:'test.js',
        line:12,
        index:0
      }
    }
    it('should return ""', function () {
      expect(compiler.globalVariableDeclaration(node)).to.be.equal("")
    })
    
    it('compiler rootScopes add new identifier("$test")', function () {
      expect(compiler.rootScopes.has('$test')).to.be.equal(true)
      expect(compiler.rootScopes.get('$test')).to.be.equal(true)
    })
  })

  describe('#node-identifier', function () {
    var node = {
      type: 'identifier',
      global: true,
      identifier: '$test',
      pos: {}
    }
    it('should return true', function () {
      expect(compiler.identifier(node)).to.be.equal(true)
    })
  })

})