#!/usr/bin/env node
// replace example by the name of the generated module
const fs = require("fs");
const jisonLex = require('jison-lex');

const { Command } = require('commander')
const packageJson = require('./package.json')
const path = require('path');
const program = new Command();

program
    .version(packageJson.version)
    .description('A tiny wrapper around jison-lex that allows you to use jison-lex as a standalone (flex like) processor.')
    .addHelpText('after', `See https://github.com/ULL-ESIT-PL/jlex/blob/main/README.md for more help`)
    .option("-o, --output <fileName>", "Output file name")
    .option("-v, --verbose", "Enable verbose output")
    .usage("[options] <filename>");

program.parse(process.argv);
const options = program.opts();

// Logging helper
function log(message, isVerbose = false) {
    if (!isVerbose || options.verbose) {
        console.log(message);
    }
}

function logError(message) {
    console.error(`❌ Error: ${message}`);
}

function logSuccess(message) {
    console.log(`✅ ${message}`);
}

if (program.args.length === 0) {
    logError("No input file specified");
    program.help();
    process.exit(1);
}
const fileName = program.args[0];

// Validate input file extension
if (!/[.](l|lex|flex)$/.test(fileName)) {
    console.warn(`⚠️  Warning: Expected .l or .lex extension for lexer file, got: ${path.extname(fileName)}`);
}

const { dir, name } = path.parse(fileName);
const outputFileName = options.output || path.join(dir, `${name}.js`);

try {
    if (!fs.existsSync(fileName)) {
        logError(`File '${fileName}' does not exist`);
        process.exit(1);
    }
    
    const stats = fs.statSync(fileName);
    if (!stats.isFile()) {
        logError(`'${fileName}' is not a regular file`);
        process.exit(1);
    }
    
    log(`📖 Reading lexer grammar from: ${fileName}`, true);
    let lexerStr = fs.readFileSync(fileName, "utf8");

    let generatedCode = jisonLex.generate(lexerStr, { moduleType: 'commonjs' });
    
    if (!generatedCode || generatedCode.trim().length === 0) {
        logError(`jison-lex failed to generate code from '${fileName}'`);
        process.exit(1);
    }
    
    log(`📝 Generated ${generatedCode.length} characters of lexer code`, true);
    
    // More robust transformation with multiple patterns
    const patterns = [
        /var\s+lexer\s*=/,
        /let\s+lexer\s*=/,
        /const\s+lexer\s*=/,
        new RegExp(`var\\s+${name}\\s*=`)
    ];
    
    let lexerModule = generatedCode;
    let transformApplied = false;
    
    for (const pattern of patterns) {
        if (pattern.test(generatedCode)) {
            lexerModule = generatedCode.replace(pattern, `module.exports =`);
            transformApplied = true;
            log(`🔄 Applied transformation pattern: ${pattern}`, true);
            break;
        }
    }
    
    //transformApplied = false;
    if (!transformApplied) {
        logError(
`No standard pattern found in the generated code!.
       Applied patterns: ${patterns.map(p => p.toString()).join(' or ')}.
       Output may not be a valid CommonJS module.
       Consider adding an issue: https://github.com/ULL-ESIT-PL/jlex/issues.
`);
    }
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputFileName);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        log(`📁 Created directory: ${outputDir}`, true);
    }
    
    log(`📝 Writing file: ${outputFileName}`);
    fs.writeFileSync(outputFileName, lexerModule);
    
    logSuccess(`Successfully processed ${fileName} → ${outputFileName}`);
    log(`📊 Output size: ${(fs.statSync(outputFileName).size / 1024).toFixed(1)}KB`, true);
    
} catch (error) {
    if (error.message.includes('Lexical error') || error.message.includes('Parse error')) {
        logError(`Invalid lexer grammar in '${fileName}': ${error.message}`);
    } else if (error.code === 'EACCES') {
        logError(`Permission denied accessing '${error.path}'`);
    } else if (error.code === 'ENOSPC') {
        logError(`No space left on device when writing '${outputFileName}'`);
    } else {
        logError(error.message);
        if (options.verbose) {
            console.error('Stack trace:', error.stack);
        }
    }
    process.exit(1);
}