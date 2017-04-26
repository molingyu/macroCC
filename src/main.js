import flag from './flag';
import Tokenizer from './tokenizer';
import Parser from './parser';
import Scopes from './scopes';
import Compiler from './compiler';

function macroCC(str) {
  let ast = new Parser().parse(str);
  return new Compiler(ast, flag).cc();
}

export default macroCC;
export {flag, Tokenizer, Parser, Compiler};