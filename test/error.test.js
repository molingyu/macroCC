var expect = require('chai').expect
var error = require('../lib/error').default

describe('error', () => {
  it('should return a SyntaxError', () => {
    var pos = {
      file: 'test.js',
      lines: 3,
      cols: 11
    }
    $macroCCScript = 'a = 33\nb = 22\n//#define a = 11\nc = a + b + /*# a #*/\nconsole.log(c)'
    expect(error(SyntaxError, 'There have a syntax error!', pos)).to.be.throw()
  })
})