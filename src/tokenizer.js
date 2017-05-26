// class Tokenizer {
//   constructor(str) {
//     this.codes = str.split('\n');
//     this.pos = {line: 1, index: 0}
//     this.tokens = [];
//   }

//   getTokens() {
//     let script = '';
//     let start = this.pos;
//     this.codes.forEach(function(line) {

//     }, this);

//     if(script != '') {
//       this.tokens.push({type: 'script', value: script.slice(0, script.length - 1), pos: start});
//     }
//     return this.tokens;
//   }

//   code(str) {

//   }

//   // lineCode() {
//   //   let start = this.pos;
//   //   let token = '';
//   //   while(!this.next()) {
//   //     token += this.chr;
//   //     if(token == 'define') {
//   //       this.tokens.push({type: 'identifier', value: 'define', pos: start});
//   //       token = '';
//   //       this.ws();
//   //     }
//   //     if(token == 'if') {

//   //     }
//   //     if(token == 'else') {

//   //     }
//   //     if(token == 'end') {

//   //     }
//   //     if(token == '"' || token == "'") {

//   //     }
//   //     if(token.match(/[]/) == token) {

//   //     }

//   //   }
//   // }



//   // nextIs(string) {
//   //   for (let index = 0; index < string.length; index++) {
//   //     if(this.line[this.pos.index + 1 + index] != string[index]) return false
//   //   }
//   //   this.pos.index += string.length;
//   //   return true;
//   // }

//   // next() {
//   //   if(this.line[this.pos.index + 1] != void 0) {
//   //     this.pos.index =+ 1;
//   //     return true;
//   //   } else {
//   //     return false;
//   //   }
//   // }

//   // nextLine() {
//   //   if(this.codes[this.pos.line + 1] != void 0) {
//   //     this.pos.line += 1;
//   //     this.pos.index = 0;
//   //     return true;
//   //   } else {
//   //     return false
//   //   }
//   // }
  
//   // ws() {
//   //   if(this.chr == '\s') this.next()
//   // }

//   // isEnd() {
//   //   return this.chr == void 0 && this.codes[this.pos.line + 1] == void 0
//   // }

// }

// export default Tokenizer;
// //#define a = 233
// var a = /*# a */ / 2
// //#if a > 100
// console.log(100)
// //#else
// console.log(0)
// //#end
// a = '/*#' /*#  #*/ 
// console.log('hello macroCC!')
// {macro: true, value: 'define', pos:{line: 1, pos:0}}
// [['define', true, ], 'a', '=', '233', 'var a = ',]