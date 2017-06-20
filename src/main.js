import flag from './flag';
import Parser from './parser';
import Scopes from './scopes';
import Compiler from './compiler';

function macroCC(str, flags = flag()) {
  let ast = new Parser().parse(str);
  return new Compiler(ast, flags).cc();
}

export { macroCC, flag, Parser, Compiler};