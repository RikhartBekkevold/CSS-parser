#!/usr/bin/env node
const parse       = require('../index.js')
const read        = require('fs').readFileSync
const write       = require('fs').writeFileSync

// var css     =   read("materialize.css", "utf8")
var css     =   read("test.css", "utf8");
var start   =   new Date().getTime()
var ast     =   parse(css)
var end     =   new Date().getTime()
console.log("To parse:", (end-start)/1000)

write("ast.json",  JSON.stringify(ast, null, 2), "utf8")
ast = parse(css, true)
write("ast_no_loc.json",  JSON.stringify(ast, null, 2), "utf8")
end = new Date().getTime()
console.log("To write:", (end-start)/1000)
