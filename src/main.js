import flag from './flag'
import Parser from './parser'
import Scopes from './scopes'
import Compiler from './compiler'
import {error, MacroCCError} from './error'

function macroCC(str, flags = flag()) {
  MacroCCError.script = str
  let ast = new Parser().parse(str)
  return new Compiler(ast, flags).cc()
}

export { macroCC, flag, Parser, Compiler}