var expect = require('chai').expect;
var Parser = require('../lib/parser');

var script = `//#define a = 233
var a = /* a */ / 2
//#if a > 100
console.log(100)
//#else
console.log(0)
//end`;

var CCScript = [
  {
    type: 'variableDeclaration',
    identifier: 'a',
    value: {
      type: 'binaryExpression',
      operator: '*',
      left: 23,
      right: 23
    }
  },
  {
    type: 'code',
    value: 'var a = '
  },
  {
    type: 'identifier',
    value: 'a'
  },
  {
    type: 'code',
    value: ' / 2\n'
  },
  {
    type: 'ifStatement',
    ifTest: {
      type: 'binaryExpression',
      operator: '>',
      left: {
        type: 'identifier',
        value: 'a'
      },
      right: 100
    },
    ifConsequent: [
      {
        type: 'code',
        value: 'console.log(100)\n'
      }
    ],
    ifAlternate: [
      {
        type: 'code',
        value: 'console.log(0)\n'
      }
    ]
  }
];

describe('parser', function () {
  describe('#parse', function () {
    it('should return -1 when the value is not present', function () {
      expect(Parser.parse(script)).to.be.equal(CCScript);
    });
  });
});