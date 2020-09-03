const Tokenizer   = require('./src/tokenize').Tokenizer
const Parser      = require('./src/parser').Parser
require('./src/predicates');
require('./src/parse');
const { isString, def, removeProp } = require('./src/util');


module.exports = function (input, noLoc) {
  if (!def(input)) return console.warn("Argument not defined");
  if (!isString(input)) return console.warn("Argument must be string");

  var tokenizer =   new Tokenizer(input);
  var tokens    =   tokenizer.tokenize()
  var parser    =   new Parser(tokens);
  var ast       =   parser.parse()

  if (noLoc)  removeProp("loc", ast)

  return ast
}
