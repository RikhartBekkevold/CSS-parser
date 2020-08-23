#!/usr/bin/env node
const Parser = require('../src/parser').Parser; // file dir. or working dir in shell?
const Tokenizer = require('../src/tokenize').Tokenizer;

// require inside the parser?
require('../src/predicates');
require('../src/parse');

const fs = require('fs').readFileSync
console.log(fs);

var content = fs("test.css", "utf8");
console.log(content);
// the shl validating.. must be based on parser
// html = and css parser for framework? my own parsers.
// html parsr, then framework and compiler
var css =
`
  /* show diff spacing/formatting */

  @charset 'utf-8';
  @import "path.woff" print;

  #about .visible span {
    height: 100px;
    width: calc(100px - 100%);
  }

  name:hover [type$="text"] [v-cloak] {
    font-size: 10 inherit;
  }

  name::after {}

  @media only screen and (max-width: 600px) {
    body {
      background-color: lightblue;
    }
  }

  @keyframes mymove {
    from {top: 0px;}
    to {top: 200px;}
  }

 `;


 // gets = because no nithing after
 // gets* even thouhg lone.. should be wrong?
 // is it keyframes that cant have importnat? ... so pass false.. which i did
// css ||
// pass to parser, that does the tokenizer adn tokens
// pass file, str, or path
// pass diff, accept diff
var token = new Tokenizer(content);  // incorporate into the parser when done. but keep separate and utliize in the parsaer only.
var parser = new Parser(token.tokenize());
console.log(JSON.stringify(parser.parse(), null, 2));
