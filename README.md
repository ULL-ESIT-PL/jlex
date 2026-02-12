## Using jison-lex

I have written a small wrapper around `jison-lex`that allows you to use the script 
`jlex` as standalone (`flex`like) processor.
Here is an example:

```
➜  only-lexer git:(main) ✗ ./jlex.js example
Processing file: example
Writing file: example.js
```

```
➜  only-lexer git:(main) ✗ npx jison-lex example.l -o example.js
```

Modify `example.js` to export the generated value `example`:

```js 
module.exports = example;
```

Then we can use it:

```
➜  only-lexer git:(main) ✗ node
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> lex = require("./example.js")
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

Now:

```js
> lex.setInput("2 - 3")
{
  ...
  offset: 0
}
> lex.lex()
'NUMBER'
> lex.lex()
'-'
> lex.lex()
'NUMBER'
> lex.yytext
'3'
> lex.yylloc
{ first_line: 1, last_line: 1, first_column: 4, last_column: 5 }
```

## The program `jlex.js`


```
> lex = require("./example")
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
> lex.setInput("2 - 3")
> lex.lex()
'NUMBER'
> lex.yytext
'2'
> lex.yylloc
{ first_line: 1, last_line: 1, first_column: 0, last_column: 1 }
> 
```