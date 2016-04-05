---
layout: post
title:  "Messing with Macros at the REPL"
date:   2016-03-26 22:57:46 +0200
categories: clojure
thumbnail: assets/klipse.png
description: "KLIPSE shows you how to play with macros"
author: "@viebel"
---

> This article is a rewrite of [fikesfarm blog post][mfikes-article], using KLIPSE to see the magic happening inside the article.


In bootstrapped ClojureScript we have macros, but they need to be defined separately from runtime code. They are typically defined in a file and loaded using require-macros or via a :require-macros spec in a namespace form.

But, what if you just want to mess around with macros at the ClojureScript REPL, like you can with Clojure?



It turns out that with bootstrapped ClojureScript, this is possible. You just need to know one weird trick that may give some deeper insight into how macros really work.

First, it is helpful to understand that macros are really just special functions that are called at compile time. (A plug for Colin Jones’s awesome book Mastering Clojure Macros: he covers this topic in a sidebar on page 30.)

Try defining a macro in KLIPSE:

<iframe frameborder="0" width="100%" height="200px"
    src= 
    "http://app.klipse.tech/?js_only=1&cljs_in=(defmacro%20hello%0A%20%20%5Bx%5D%0A%20%20%60(inc%20~x))">
</iframe>


You see that the JavaScript function emitted for the macro has the `_AMPERSAND_form` and `_AMPERSAND_env` arguments associated with the `&form` and `&env` special variables.

You can actually call this function (here we are passing nil for &form and &env):

<iframe frameborder="0" width="100%" height="200px"
    src= 
    "http://app.klipse.tech/?eval_only=1&cljs_in=(defmacro%20hello%20%0A%20%20%5Bx%5D%20%0A%20%20%60(inc%20~x))%0A%0A(hello%20nil%20nil%2013)">
</iframe>

It produces the code that the macro would generate. But, alas, this is treated as a regular function call, not a macro call.

Now, let's look at the meta for this function:

<iframe frameborder="0" width="100%" height="200px"
    src= 
    "http://app.klipse.tech/?eval_only=1&cljs_in=(defmacro%20hello%20%0A%20%20%5Bx%5D%20%0A%20%20%60(inc%20~x))%0A%0A(meta%20%23%27hello)">
</iframe>

You see that it has `:macro` set to `true`. But, what you really want is for this function to be treated as the macro it truly is.

The trick, at least in bootstrapped ClojureScript like `KLIPSE`, is to define this function in a **macro namespace** by employing the internal compiler suffix $macros.

>This, of course, depends on implementation details of the ClojureScript compiler, and you certainly shouldn’t use this for production code. But, we are really just doing this for fun and to learn.
The following works in bootstrapped ClojureScript REPLs. I’ve tried it in: ClojureScript.net, Replete, Planck and of course KLIPSE.

Let’s define `hello` as a macro in the `foo.core$macros` namespace. 

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/index-dbg.html?eval_only=1&cljs_in=(ns%20foo.core%24macros)%0A%0A(defmacro%20hello%20%0A%20%20%5Bx%5D%0A%20%20(prn%20%26form)%0A%20%20%60(inc%20~x))%0A%0A(foo.core%2Fhello%2012)">
</iframe>

Notice that:

1. to call `hello` as a macro, you must refer to its symbol in the non-macro `foo.core` namespace.
2. to call macros, you must use [KLIPSE in dbg mode][klipse-dbg]{:target="_blank"} where it is compiled with `:optimizations :none` - as macros are not yet supported with `:optimizations :whitespace` compilation.


And it works! We were even able to print out `&form`, just for fun: open the browser console and you'll see the value of `&form`.

This is cool for two reasons, IMHO:

1. It gives you a little insight into how macros work. (They are truly just functions that are given special treatment at compile time.)
2. This trick provides a way to quickly iterate with ideas about macros at a REPL (e.g. KLIPSE), especially when you can’t easily edit source (say, when using ClojureScript.net or Replete).

Have fun!


[klipse-dbg]: http://app.klipse.tech/index-dbg.html
[mfikes-article]: http://blog.fikesfarm.com/posts/2015-09-07-messing-with-macros-at-the-repl.html
