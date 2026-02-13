
# jlex [![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/jlex)

## Install

`npm i jlex`

## Usage

```
npx jlex <package name>
```


## Example

`jlex` is  a tiny wrapper around `jison-lex` that allows you to use the script 
`jlex` as standalone (`flex` like) processor.

Assuming the following lexer in file `example.js`:

```
%%
\s+                   /* skip whitespace */
[0-9]+                return 'NUMBER';
"-"                   return '-';
<<EOF>>               return 'EOF';
.                     return 'INVALID';% 
```

Compile it with:

```
➜  jlex-test npx jlex example  
Processing file: example
Writing file: example.js
``` 

This produces a Common.JS module `example.js` you can use with a simple `require` like in the file `main.js` below:

```js
const lex = require("./example");
lex.setInput("2\n-\n3")

const results = [];

results.push({ type: lex.lex(), lexeme: lex.yytext, loc: lex.yylloc });
results.push({ type: lex.lex(), lexeme: lex.yytext, loc: lex.yylloc });
results.push({ type: lex.lex(), lexeme: lex.yytext, loc: lex.yylloc });
results.push({ type: lex.lex(), lexeme: lex.yytext, loc: lex.yylloc });

console.log(results);
/*
➜  examples git:(main) ✗ node main.js
[
  {
    type: 'NUMBER',
    lexeme: '2',
    loc: { first_line: 1, last_line: 1, first_column: 0, last_column: 1 }
  },
  {
    type: '-',
    lexeme: '-',
    loc: { first_line: 2, last_line: 2, first_column: 0, last_column: 1 }
  },
  {
    type: 'NUMBER',
    lexeme: '3',
    loc: { first_line: 3, last_line: 3, first_column: 0, last_column: 1 }
  },
  {
    type: 'EOF',
    lexeme: '',
    loc: { first_line: 3, last_line: 3, first_column: 1, last_column: 1 }
  }
]
*/  
```
When you execute the former program, you get:


```js
➜  jlex-test node main.js 
[
  {
    type: 'NUMBER',
    lexeme: '2',
    loc: { first_line: 1, last_line: 1, first_column: 0, last_column: 1 }
  },
  {
    type: '-',
    lexeme: '-',
    loc: { first_line: 2, last_line: 2, first_column: 0, last_column: 1 }
  },
  {
    type: 'NUMBER',
    lexeme: '3',
    loc: { first_line: 3, last_line: 3, first_column: 0, last_column: 1 }
  },
  {
    type: 'EOF',
    lexeme: '',
    loc: { first_line: 3, last_line: 3, first_column: 1, last_column: 1 }
  }
]
```

## Using the lexer from a Jison grammar

In file  [examples/grammar.jison](examples/grammar.jison#L32-L33) you'll find an example
of setting the generated lexer to be used from a Jison grammar. The key is 
to set the `lex` attribute of the `parser` object to the generated lexer:

```js
%%
const lexer = require("./example.js");
parser.lexer = lexer;
```
Compile the grammar with:

```
➜  jlex git:(main) ✗ npx jison examples/grammar.jison -o examples/parser.js
```

And use the parser:

```
➜  jlex git:(main) ✗ node
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> p = require("./examples/parser.js")
{
  parser: { yy: {} },
  Parser: [Function: Parser],
  parse: [Function (anonymous)],
  main: [Function: commonjsMain]
}
> p.parse(`3
| -
| /* comment */
| 1`)
{
  type: 'OPERATOR',
  left: {
    type: 'number',
    value: 3,
    loc: { first_line: 1, last_line: 1, first_column: 0, last_column: 1 }
  },
  right: {
    type: 'number',
    value: 1,
    loc: { first_line: 4, last_line: 4, first_column: 0, last_column: 1 }
  },
  loc: { first_line: 2, last_line: 2, first_column: 0, last_column: 1 }
}
```

## The Lexical Analyzer Object

Here is a description of the attributes of the lexer object:

```js
{
  EOF: 1,
  parseError: [Function: parseError],
  setInput: [Function: setInput],
  input: [Function: input],
  unput: [Function: unput],
  more: [Function: more],
  reject: [Function: reject],
  less: [Function: less],
  pastInput: [Function: pastInput],
  upcomingInput: [Function: upcomingInput],
  showPosition: [Function: showPosition],
  test_match: [Function: test_match],
  next: [Function: next],
  lex: [Function: lex],
  begin: [Function: begin],
  popState: [Function: popState],
  _currentRules: [Function: _currentRules],
  topState: [Function: topState],
  pushState: [Function: pushState],
  stateStackSize: [Function: stateStackSize],
  options: { moduleName: 'example' },
  performAction: [Function: anonymous],
  rules: [ /^(?:\s+)/, /^(?:[0-9]+)/, /^(?:-)/, /^(?:$)/, /^(?:.)/ ],
  conditions: { INITIAL: { rules: [Array], inclusive: true } }
}
```