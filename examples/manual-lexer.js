const lexer = {
  input: "",
  index: 0,

  yytext: "",
  yylineno: 0,  // base 0 internamente
  yylloc: {},

  setInput(input) {
    this.input = input;
    this.index = 0;
    this.yylineno = 0;
    this.column = 0;
    return this;
  },

  lex() {
    if (this.index >= this.input.length) {
      return 'EOF' /* this.EOF */;
    }

    // Saltar espacios
    while (/\s+/.test(this.input[this.index])) {
      this.advance(this.input[this.index]);
    }

    if (this.index >= this.input.length) {
      return this.EOF;
    }

    const startLine = this.yylineno + 1;   // Jison usa base 1
    const startColumn = this.column;

    const char = this.input[this.index];

    // OPERATOR
    if (/[-+*\/]/.test(char)) {
      this.yytext = char;
      this.advance(char);

      this.yylloc = {
        first_line: startLine,
        last_line: this.yylineno + 1,
        first_column: startColumn,
        last_column: this.column
      };

      return "OPERATOR";
    }

    // NUMBER (soporta múltiples dígitos)
    if (/\d/.test(char)) {
      let num = "";

      while (/\d/.test(this.input[this.index])) {
        num += this.input[this.index];
        this.advance(this.input[this.index]);
      }

      this.yytext = num;

      this.yylloc = {
        first_line: startLine,
        last_line: this.yylineno + 1,
        first_column: startColumn,
        last_column: this.column
      };

      return "NUMBER";
    }

    throw new Error("Carácter inesperado: " + char);
  },

  advance(char) {
    this.index++;

    if (char === "\n") {
      this.yylineno++;
      this.column = 0;
    } else {
      this.column++;
    }
  }
};

module.exports = lexer;