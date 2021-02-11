---
layout: post
title:  "Recursions without names: Introduction to the Y combinator"
description:  "Recursions without names"
date:   2016-08-07 03:21:33 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "1C2DE54F-6C88-419D-8447-7E57D23ED032"
ruby: true
author: Yehonathan Sharvit
tags: [lambda-calculus, clojure, javascript, ruby]

---


In this article, we are going to show how one could write recursive functions in a language where there are no names and no loops.


![Escher](/assets/escher_hand.jpg)

With no explanations, we are going to show the magic in action: the recursive implementation of the `factorial` function without using neither names nor loops.


All the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


There are versions of the code in: `clojure`, `javascript`, `EcmaScript6` and `ruby`.

Feel free to play with the value passed to the function in your preferred language. We are starting with `19`:

# Clojure


~~~klipse
(((fn [f]
   (f f))
  (fn [func]
   (fn [n]
    (if (zero? n)
     1
     (* n ((func func) (dec n)))))))
 19)
~~~

Here is [a detailed explanation of this code]({% post_url 2016-08-07-almost-y-combinator-clojure %}).

# Javascript

~~~klipse-eval-js
(function (f){
  return f(f);
})(function (func){
  return (function (n){
    if (n === 0){
      return 1;
    }
    else {
      return (n * func(func)(n - 1));
    }
  })})(19)
~~~

Here is [a detailed explanation of this code]({% post_url 2016-08-10-almost-y-combinator-javascript %}).

# EcmaScript 6

It will work only if your browser supports `EcmaScript6` [arrow functions](https://kangax.github.io/compat-table/es6/).

~~~klipse-eval-js
((f => f(f)))
(func => n => (n === 0)? 1 : (n * func(func)(n - 1)))
(19)
~~~

Here is [a detailed explanation of this code]({% post_url 2016-08-10-almost-y-combinator-javascript %}).

# Ruby

~~~klipse-eval-ruby
->(f){
  f[f]
  }[->(func){
    ->(n) { n == 0 ? 1 : n * func[func][n-1]}
    }][19]
~~~




