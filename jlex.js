#!/usr/bin/env node
// replace example by the name of the generated module
const fs = require("fs");
const { execSync } = require('child_process');
const fileName = process.argv[2];
console.log("Processing file:", fileName);
execSync(`npx jison-lex ${fileName}.l`, { encoding: 'utf-8' });
let lexerStr = fs.readFileSync(`${fileName}.js`, "utf8").toString();
//console.log("Processing file:", lexerStr);
let lexerModule = lexerStr.replace(new RegExp(`var ${fileName} =`, 'g'), `\nmodule.exports =`);
console.log("Writing file:", `${fileName}.js`);
fs.writeFileSync(`${fileName}.js`, lexerModule);