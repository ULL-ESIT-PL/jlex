%%
\s+                   /* skip whitespace */
[0-9]+                return 'NUMBER';
"-"                   return '-';
<<EOF>>               return 'EOF';
.                     return 'INVALID';