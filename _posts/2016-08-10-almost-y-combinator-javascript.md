---
layout: post
title:  "Recursions without names: Introduction to the Y combinator in javascript"
description:  "Recursions without names: Introduction to the Y combinator in javascript"
date:   2016-08-10 14:22:53 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "306FEB6D-0FFD-477B-8FB9-1014512A3E0D"
minified_plugin: true
author: "@viebel"

---


This is an introductory article to the [Y combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator) from `lambda-calculus`. But we won't mention the `Y combinator` in this article.

In this article, we are going to show how to write recursive functions in `javascript` (`EcmaScript6`) without giving names to any function.


(If you are curious to see it in other languages, there is [a version of the code]({% post_url 2016-08-07-almost-y-combinator %}) in `clojure` and `ruby`.)

At first glance it seems impossible: how could we refer to something that we are currently defining without using its name?


![Escher](/assets/escher_hand.jpg)

All the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


It will work only if your browser supports `EcmaScript6` [arrow functions](https://kangax.github.io/compat-table/es6/).

## Begin with the end in mind

The end result of this article is the recursive implementation of the `factorial` function without using neither names nor loops.

Here is the code:

~~~klipse-eval-js
((f => f(f)))
(func => n => (n === 0) ? 1 : (n * func(func)(n - 1)))
(19)
~~~

As you can check, no mention of any names.

At first, it feels like magic.

Now, we are going to show the 4 step process that leads to this wonderful piece of code.


(We were inspired by this [long but awesome article](http://mvanier.livejournal.com/2897.html) by [Mike Vanier](http://users.cms.caltech.edu/~mvanier/).)

## The process

# Step 0: recursive function

Let's start with the recursive implementation of `factorial`:

~~~klipse-eval-js
factorial = n => (n === 0)? 1 : n * factorial(n - 1)
~~~

~~~klipse-eval-js
factorial(10)
~~~

# Step 1: simple generator

Let's write a function that is a generator of the `factorial` function:


~~~klipse-eval-js
factorial_gen = f => (n => ((n === 0) ? 1 : n * f(n - 1)))
~~~

One one hand, `factorial-gen` is not recursive.

On the other hand, `factorial-gen` is not the `factorial` function. 

But the interesting thing is that if we pass `factorial` to `factorial-gen` it returns the `factorial` function:

~~~klipse-eval-js
factorial_gen(factorial)(19)
~~~


Before going on reading make sure you understand why it is true that:

> `factorial-gen(factorial)` is equivalent to `factorial`

# Step 2: weird generator


Now, we are going to do something very weird: instead of using `func`, we are going to use `(func func)`. Like this:

~~~klipse-eval-js
factorial_weird = f => (n => ((n === 0) ? 1 : n * f(f)(n - 1)))
~~~

The funny thing now is that if we apply `factorial-weird` to itself we get the `factorial` function:


~~~klipse-eval-js
factorial_weird(factorial_weird)(19)
~~~

Before going on reading make sure you understand why it is true that:

> `factorial-weird(factorial-weird)` is equivalent to `factorial`


# Step 3: Recursion without names

Now, let's write down the application of `factorial_weird` to itself, using the body of `factorial_weird` instead of its name:

~~~klipse-eval-js
factorial_no_names = (f => (n => ((n === 0) ? 1 : n * f(f)(n - 1))))((f => (n => ((n === 0) ? 1 : n * f(f)(n - 1)))))
~~~


And we got a recursive implementation of `factorial` without using any names!

We gave it a name just for the convenience of using it.


As you can check, this is a completely valid implementation of `factorial`:


~~~klipse-eval-js
[1,2,3,4,5,6,7,8,9,10,11].map(factorial_no_names)
~~~


Do you understand why this is equivalent to the code we shown in the beginning of the article?

~~~klipse-eval-js
((f => f(f)))
(func => n => (n === 0) ? 1 : (n * func(func)(n - 1)))
(19)
~~~



Can you write your own implementation of other recursive functions without names?

Share in the comments your implementation for:

- Fibonacci
- Quicksort
- max
- min
- ...


In our [next article]({% post_url 2016-08-10-pure-y-combinator-javascript %}), we are going to show the Y combinator in action in `javscript`.

