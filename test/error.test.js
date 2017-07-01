var expect = require('chai').expect
var error = require('../lib/error').default

describe('error', () => {
  it('should return a SyntaxError', () => {
    var pos = {
      file: 'test.js',
      lines: 12,
      cols: 2
    }
    expect(error(SyntaxError, 'There have a syntax error!', pos)).to.be.throw()
  })
})