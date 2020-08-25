#!/usr/bin/env node
const Tokenizer  = require('../src/tokenize').Tokenizer
const Parser     = require('../src/parser').Parser
const read       = require('fs').readFileSync

require('../src/predicates');
require('../src/parse');

// var content = read("materialize.css", "utf8");
var content =   read("test.css", "utf8");
var start   =   new Date().getTime()
var token   =   new Tokenizer(content);
var tokens  =   token.tokenize()
var parser  =   new Parser(tokens);
var a       =   parser.parse()
var end     =   new Date().getTime()

// .rules[a.rules.length-1]
console.log(JSON.stringify(a, null, 2));
console.log((end-start)/1000);
