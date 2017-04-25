import flag from 'flag';
import Tokenizer from 'tokenizer';
import Parser from 'parser';
import Compiler from 'compiler';

function macroCC(str) {
  let ast = new Parser().parse(str);
  return new Compiler(ast, flag).CCScript;
}

export default macroCC;
export {flag, Tokenizer, Parser, Compiler};