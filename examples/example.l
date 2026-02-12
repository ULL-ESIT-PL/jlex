comment [/][*](.|[\r\n])*?[*][/]
%%
\s+|{comment}         /* skip whitespace */
[0-9]+                return 'NUMBER';
[-+*/]                return 'OPERATOR';
<<EOF>>               return 'EOF';
.                     return 'INVALID';