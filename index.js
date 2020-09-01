const Tokenizer   = require('./src/tokenize').Tokenizer
const Parser      = require('./src/parser').Parser
require('./src/predicates');
require('./src/parse');
const { isString, def } = require('./src/util');


module.exports = function (input) {
  if (!def(input))
    return console.warn("Argument not defined");

  if (!isString(input))
    return console.warn("Argument must be string");

  var tokenizer =   new Tokenizer(input);
  var tokens    =   tokenizer.tokenize()
  var parser    =   new Parser(tokens);
  var ast       =   parser.parse()

  return ast
}
