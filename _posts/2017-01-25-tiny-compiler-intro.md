---
layout: post
title:  "Write your own compiler - Introduction "
description:  "Write your own compiler: introduction. Code genetation. AST. Abstract syntax tree. lisp. javascript."
date:   2017-02-08 08:12:21 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "DAD172A0-B2A9-4418-B175-453557BE5174"
author: Yehonathan Sharvit
minified_plugin: true
tags: [javascript, compiler]
---

## Writing a compiler

Nothing in computer science sounds more challenging than writing a compiler.

And indeed, it is challenging - **very** challenging. You probably have to be one of those genius guys in order to be able to write a real compiler.

Nevertheless, in this series of blog posts, we are going to show the basic structure of a compiler by implementing a very simple compiler in `javascript`: our compiler is going to compile code in `LISP`-like syntax into `C`-like syntax.

Something like `(add 1 2)` will become `add(1, 2)`.

This is not going to be easy - but I can guarantee you that you are going to enjoy. I know that for sure because in this series there will be **a lot** of code snippets and all the code snippets are going to be interactive. You can modify the code as you read the articles. And for sure, it will make this hard journey a lot more fun.

(The interactive code snippets are powered by a tool of mine named [KLIPSE](https://github.com/viebel/klipse).)

This series has been inspired by [the super tiny compiler](https://github.com/thejameskyle/the-super-tiny-compiler).

![climbing](/assets/climbing.jpg)

Our hope is that you will enjoy this journey and at the end of it, you'll be a bit less scared by compilers.


## The plan

Our journey is made of 4 stations - each of them depending on the previous ones:

1. [The tokenizer]({% post_url 2017-01-25-tiny-compiler-tokenizer %}) (aka "Lexical Analysis"): converting an input code - in `LISP` syntax - into an array of tokens.
2. [The parser]({% post_url 2017-01-25-tiny-compiler-parser %}) (aka "Syntactic Analysis"): transforming an array of tokens into an Abstract Syntax Tree (AST).
3. [The emitter]({% post_url 2017-01-25-tiny-compiler-emitter %}) (aka "Code Generation"): string-ifying an AST into `C`-like code.
4. [The compiler]({% post_url 2017-01-25-tiny-compiler-compiler %}) (aka "You made it"): combining all the pieces together.

At the end of the journey, you will have code that does that does the following:

<pre><code class="language-eval-js" data-external-libs="https://raw.githubusercontent.com/viebel/javascript-toolbelt/master/lib/compiler.js">
compiler("(add 1 2 (mult 3 4))")
</code></pre>

This code snippet is interactive - feel free to play with it...

Are you ready for the journey?


Take a deep breath...

Let's start with [the tokenizer]({% post_url 2017-01-25-tiny-compiler-tokenizer %})!

One last thing: please don't try to read all the posts of the series at once, you won't enjoy. Take at least a couple of hours of rest between each station...



