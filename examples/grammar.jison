%locations
%token NUMBER OPERATOR EOF

%left OPERATOR
%%

s: expr EOF { return $1; }
;

expr
  : expr OPERATOR expr
      {
        $$ = {
          type: "OPERATOR",
          left: $1,
          right: $3,
          loc: @2
        };
      }
  | NUMBER
      {
        $$ = {
          type: "number",
          value: Number($1),
          loc: @1
        };
      }
  ;

%%

const lexer = require("./example.js");
parser.lexer = lexer;