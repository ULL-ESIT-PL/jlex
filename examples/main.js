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