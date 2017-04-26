export default class Tokenizer {
  constructor(str) {
    this.code = str;
    this.index = 0;
    this.chr = this.code[this.index];
    this.tokens = [];
  }

  next() {
    this.index += 1;
  }
  
  ws() {

  }

}