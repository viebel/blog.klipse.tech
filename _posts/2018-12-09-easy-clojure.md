---
local_klipse: false
layout: post
title:  Easy Clojure, Easy REPL
description:  Beginners friendly REPL. Easy Clojure. Easy REPL. Klipse REPL.
date:   2018-12-09 04:22:34 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "11B448BE-94F9-408F-964C-CA6EDB594B53"
author: Yehonathan Sharvit
---


Have you ever tried to convince a friend that Clojure is a great language?

Have you ever tried to convince your boss to let your team on a side project with Clojure?

If that's the case, you have probably used as a solid argument the fact that in Clojure, the REPL is very powerful and very helpful for beginners. Inside the REPL, you can do *everything* and it is so simple to hack with Clojure expressions in the REPL.


If you did a good job, your friend or your boss decided to give it a try. She installed the Clojure CLI on her machine as explained in [this blog post]({% post_url 2018-09-16-hello-clojure %}) and she launched the Clojure REPL with a simple 3-letter command line:

~~~bash
>clj
user=>
~~~

Fantastic! Now she had the ability to experiment with Clojure.

After having typed a couple of arithmetic expressions like `(+ 2 3)` and a few list manipulations expressions like `(map inc [1 2 3])`, she probably tried to define a variable with a form like the apparenlty innocent `(def my-var 42)`:

~~~bash
user=> (def my-var 42)
#'user/my-var
~~~


Then, she asked you with naive expression on her face: "what is this weird dash quote user ?"

At this point, you had two options:

1. "Oh! That's the fully qualified name of the variable you created"
2. "Forget about it, you will understand this part, when you are more experienced with Clojure"

No matter what was your answer, my guess is that she felt a bit confused...

![Disapointed](/assets/upset.png)

And it probably got worse when you tried to explain her that this was something "simple but not easy"...

The point of this imaginary story is to illustrate the fact that the default Clojure REPL is not beginners friendly.

When I started to write my [Get Programming with Clojure](https://www.manning.com/books/get-programming-with-clojure?a_aid=viebel&a_bid=399d9d64) book, I had to find a way to let my readers enjoy the power of the REPL without being confused by some weird dash quote symbols too early in their Clojure journey.

The solution I came with was to create my own REPL with a single objective in mind: to be beginners friendly. I named it the Klipse REPL and it is available on [github](https://github.com/viebel/klipse-repl).

The way I am handling `def` forms in the Klipse REPL is to display the value of the variable instead of its fully-qualified name. 

~~~bash
user=> (def my-var 42)
42
~~~

No more questions about "weird dash quote symbols"!

Similarly, for function definition with `defn` forms: I decided to display the name of the function and the arguments that the function expects:


~~~bash
user=> (defn foo [x]
    =>   (* 42 x))
Created function foo ([x])
~~~


I made another small improvement in the traditional `doc` form that the default REPL provides:  The `doc` macro provided by Klipse REPL includes a link to the form page in [clojuredocs.org](https://clojuredocs.org/). Clojuredocs is one of the most valuable resources for Clojure beginners as it provides examples of usage of the Clojure forms. (There are so many situations where the docstring is so cryptic.)

For instance, take a look at the last line of the output of `(doc inc)`:

~~~bash
user=> (doc inc)
-------------------------
clojure.core/inc
([x])
  Returns a number one greater than num. Does not auto-promote
  longs, will throw on overflow. See also: inc
-------------------------
Online doc: https://clojuredocs.org/clojure.core/inc
~~~

The [Klipse REPL](https://github.com/viebel/klipse-repl) also includes all of the great features of Bruce Hauman's [rebel-readline](https://github.com/bhauman/rebel-readline) for the simple reason that the Klipse REPL is built on top of [rebel-readline](https://github.com/bhauman/rebel-readline). Some of them are:

1. autocompletion 
2. indentation of multi-line expressions
3. coloring of forms

Now that my book is [available for early access](https://www.manning.com/books/get-programming-with-clojure?a_aid=viebel&a_bid=399d9d64), you can use it as another solid argument to convince your friend and your boss about the value of Clojure.








