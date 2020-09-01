#!/usr/bin/env node
const parse       = require('../index.js')
const read        = require('fs').readFileSync
const write       = require('fs').writeFileSync
const removeProp  = require('../src/util').removeProp

// var css     =   read("materialize.css", "utf8")
var css     =   read("test.css", "utf8");
var start   =   new Date().getTime()
var ast     =   parse(css)
var end     =   new Date().getTime()
console.log("To parse:", (end-start)/1000)

write("output.json",  JSON.stringify(ast, null, 2), "utf8")
removeProp("loc", ast)
write("output_no_loc.json",  JSON.stringify(ast, null, 2), "utf8")
end = new Date().getTime()
console.log("To write:", (end-start)/1000)
