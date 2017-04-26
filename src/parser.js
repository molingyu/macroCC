import Tokenizer from './tokenizer';

class Parser {
  constructor() {
  }

  parse(codeStr) {
    let tokens = new Tokenizer(codeStr);
  }

}

export default Parser;