#!/usr/bin/env node
const Tokenizer  = require('../src/tokenize').Tokenizer
const Parser     = require('../src/parser').Parser
const read       = require('fs').readFileSync

require('../src/predicates');
require('../src/parse');

var content = read("materialize.css", "utf8");
// var content =   read("test.css", "utf8");
var start   =   new Date().getTime()
var token   =   new Tokenizer(content);
var tokens  =   token.tokenize()
// console.log(tokens);
var parser  =   new Parser(tokens);
var a       =   parser.parse()
var end     =   new Date().getTime()

// .rules[a.rules.length-1]

removeProps("loc", a)
console.log(JSON.stringify(a, null, 2));
console.log((end-start)/1000);


// obj = obj = not copy, new ref, so still lost

// deletes all "prop" properties of a nested object
// irreversable - in place - make copy first
function removeProps(prop, object) {
  var prop = prop

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      if (key === prop) delete object[key]
      else if (typeof object[key] === "object")
        removeProps("loc", object[key])
    }
  }
}
