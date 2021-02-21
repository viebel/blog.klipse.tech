---
layout: post
title:  "Write your own compiler - Last station"
description:  "Write your own compiler: the compiler. Code genetation. AST. Abstract syntax tree. lisp. javascript."
date:   2017-02-08 08:14:21 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "DAD172A0-B2A9-4418-B175-453557BE5174"
author: Yehonathan Sharvit
minified_plugin: true
tags: [javascript, compiler]
---


## The plan

Our [journey]({% post_url 2017-01-25-tiny-compiler-intro %}) is made of 4 stations - each of them depending on the previous ones:

1. [The tokenizer]({% post_url 2017-01-25-tiny-compiler-tokenizer %}) (aka "Lexical Analysis"): converting an input code - in `LISP` syntax - into an array of tokens.
2. [The parser]({% post_url 2017-01-25-tiny-compiler-parser %}) (aka "Syntactic Analysis"): transforming an array of tokens into an Abstract Syntax Tree (AST).
3. [The emitter]({% post_url 2017-01-25-tiny-compiler-emitter %}) (aka "Code Generation"): string-ifying an AST into `C`-like code.
4. [The compiler]({% post_url 2017-01-25-tiny-compiler-compiler %}) (aka "You made it"): combining all the pieces together.

(The interactive code snippets are powered by a tool of mine named [KLIPSE](https://github.com/viebel/klipse).)


## The last station: the compiler


The last station is only fun - lot of fun!!!


Let's write our last piece of code - by assembling the `tokenizer`, the `parser` and the `emitter` into a single `my_compiler` function:


<pre class="hidden"><code class="language-eval-js" data-external-libs="https://raw.githubusercontent.com/viebel/javascript-toolbelt/master/lib/compiler.js">
1+2
</code></pre>

~~~eval-js
my_compiler = input => {
  let tokens = tokenizer(input);
  let ast    = parser(tokens);
  let output = emitter(ast);

  return output;
}
~~~

And let's test it...

~~~eval-js
my_compiler("(add 1 2 (mult 3 4))")
~~~

Enjoy the moment, play with your compiler... 


Congratulations - I mean you did it. Give yourself a huge hug, buy yourself a gift. I don't know... Find the most appropriate way to celebrate your success... You truly deserve it!


![ast](/assets/hourra.png)

One last thing: the whole code is accessible as a single file on [github](https://github.com/viebel/javascript-toolbelt/blob/master/lib/compiler.js): it's around 150 line of codes.
