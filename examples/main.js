const lex = require("./example");
const input = process.argv[2] || "2\n-/* a comment*/\n3";
lex.setInput(input);

const results = [];

results.push({ type: lex.lex(), lexeme: lex.yytext, loc: lex.yylloc });
results.push({ type: lex.lex(), lexeme: lex.yytext, loc: lex.yylloc });
results.push({ type: lex.lex(), lexeme: lex.yytext, loc: lex.yylloc });
results.push({ type: lex.lex(), lexeme: lex.yytext, loc: lex.yylloc });

console.log(results);
