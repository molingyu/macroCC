export default class MacroCCError extends Error {
  /**
   * 
   * @param {Number} line 
   * @param {Number} pos 
   * @param {String} message 
   */
  constructor(message, line, pos) {
    if (arguments.length == 1) {
      super(arguments[0]);
    } else{
      super(arguments[2] + "\n" + 'line: ' + arguments[0] + ',pos: ' + arguments[1]);
    }
    this.name = 'MacroCCError';
  }

  print() {
    console.error(this.name + ':' + this.message + "\n" + 'line: ' + this.line + ',pos: ' + this.pos);
  }

}