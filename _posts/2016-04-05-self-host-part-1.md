---
layout: post
title:  "Self-Hosted Clojurescript in action - Part 1"
description:  "Self-Hosted Clojurescript in action - Part 1"
date:   2016-04-04 22:15:43 +0200
categories: clojurescript
thumbnail: assets/klipse.png
guid: "F6454336-D490-475D-B188-BE3474D38B18"
author: "@viebel"

---

## ClojureScript can compile itself

Like the whole clojurescript community, we were excited when David Nolen [published][cljs-next-url]{:target="_blank"} on July 29, 2015:

>ClojureScript can compile itself.

And actually, it's quite simple: the [cljs.js namespace](https://github.com/clojure/clojurescript/blob/master/src/main/cljs/cljs/js.cljs){:target="_blank"} provides two functions for evaluation and compilation of `clojurescript` expressions:

1. `eval-str` for evaluation of `clojurescript` expressions
2. `compile-str` for compilation of `clojurescript` expressions

In this article, we are going to let you experiment `cljs.js` inside [KLIPSE][app-url]{:target="_blank"}.


## Evaluation
Let's start by evaluating `(map inc [1 2 3])`:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.main%0A%20%20(%3Arequire%20%5Bcljs.js%20%3Aas%20cljs%5D))%0A%0A(cljs%2Feval-str%20(cljs%2Fempty-state)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22(ns%20my.user)%20(map%20inc%20%5B1%202%203%5D)%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%3Aeval%20cljs%2Fjs-eval%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20identity)&eval_only=1">
</iframe>

Feel free to play with the second argument to `eval-str` and see the result of the evaluation.

Here is [eval-str documentation](https://github.com/cljsinfo/cljs-api-docs/blob/catalog/refs/cljs.js/eval-str.md){:target="_blank"} and if you are really curious you can also read [empty-state documentation](https://github.com/cljsinfo/cljs-api-docs/blob/catalog/refs/cljs.js/empty-state.md){:target="_blank"}.

## Compilation

You can also play with `compile-str`:
<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.main%0A%20%20(%3Arequire%20%5Bcljs.js%20%3Aas%20cljs%5D))%0A%0A(cljs%2Fcompile-str%20(cljs%2Fempty-state)%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22(ns%20my.user)%20(map%20inc%20%5B1%202%203%5D)%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%3Aeval%20cljs%2Fjs-eval%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20identity)&eval_only=1">
</iframe>

## Vertigo

The funny thing about this article is that [KLIPSE][app-url]{:target="_blank"} itself evaluates the code through `cljs.js`. 
Every time I am trying to think about it, I feel dizzy !?!?!

> A piece of code that evaluates a piece of code that evaluates a piece of code!

Please share your thoughts (and your feelings) in the comments below.

In an upcoming article, we will demonstrate advanced features of `cljs.js` like: expression vs. statement, macros, advanced compilation and more...

Clojurescript rocks!

[app-url]: http://app.klipse.tech
[cljs-next-url]: http://swannodette.github.io/2015/07/29/clojurescript-17/
