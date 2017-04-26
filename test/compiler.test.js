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

describe('compiler', function () {
  describe('#cc', function () {
    it('should return -1 when the value is not present', function () {
      expect((new Compiler(ast, {})).cc(ast)).to.be.equal(CCScript);
    });
  });
});