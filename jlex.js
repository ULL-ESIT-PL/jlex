#!/usr/bin/env node
// replace example by the name of the generated module
const fs = require("fs");
const { execSync } = require('child_process');
const { Command } = require('commander')
const packageJson = require('./package.json')
const path = require('path');
const program = new Command();

program
  .version(packageJson.version)
  .description('A tiny wrapper around jison-lex that allows you to use jison-lex as a standalone (flex like) processor.')
  .option("-o <fileName>", "Output file name")
  .usage("[options] <filename>");

program.parse(process.argv);
const options = program.opts();

const fileName = program.args[0];

const {dir,name } = path.parse(fileName); // { dir, base, ext, name }
const outputFileName = options.o || path.join(dir, `${name}.js`);
const outputParse = path.parse(outputFileName);

const shellCommand = `npx jison-lex ${fileName} -o ${outputFileName}`;
try {
    execSync(shellCommand, { encoding: 'utf-8' });
    let lexerStr = fs.readFileSync(outputFileName, "utf8").toString();
    let lexerModule = lexerStr.replace(new RegExp(`var ${outputParse.name} =`), `\nmodule.exports =`);
    console.log("Writing file:", outputFileName);
    fs.writeFileSync(outputFileName, lexerModule);
} catch (error) {
    console.error("Error:", error.message);
}