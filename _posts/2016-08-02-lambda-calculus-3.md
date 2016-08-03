---
layout: post
title:  "Lambda Calculus Live Tutorial: Functions with several arguments"
description:  "Lambda Calculus Live Tutorial: Functions with several arguments"
date:   2016-08-02 04:22:31 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "53595AD9-18CE-4103-8B1E-8E4AFF92679A"
author: "@viebel"

---

In the previous articles, we showed how in lambda-calculus, we represent [the basic arithmetic operations]{% post_url 2016-07-20-lambda-calculus-1%} and [the basic boolean operations]{% post_url 2016-07-24-lambda-calculus-2 %}.


The numbers, the boolean and the operations are all represented by `1-arity` functions. But in the real life, operations like `mult` and `or` are supposed to receive two arguments.

Instead of writing

~~~clojure
((mult two) three)
~~~

we'd prefer to write

~~~clojure
(mult two three)
~~~



If you think about it, it all comes down to associativity:

![Associativity](/assets/associativity.png)

# Associativity in Lambda-Calculus

As a convention, in lambda-calculus, application associates to the left. It means that `(F G H)` is a shorthand for `((F G) H)`.

> It is important to understand that this is just a convention: It's not part of the core language. 

Now, we are going to show how to implement in `clojure` the left association convention.

All the code snippets on this article are live and interactive: feel free to modify the code and it will evaluate instantaneously!

The code snippets are powered by the [Klipse plugin](https://github.com/viebel/klipse).


# Setup

First, let's create a namespace for our journey, and `refer` the `disp` macro, from the [gadjett repository](https://github.com/viebel/gadjett/blob/master/src/gadjett/macros.clj) on github:

<pre>
<code class="language-klipse" data-external-libs="https://raw.githubusercontent.com/viebel/gadjett/master/src/">
(ns lambda.boolean-algebra
   (:require-macros [gadjett.macros :refer [disp]]))
</code>
</pre>

More about the `disp` macro in [this article]({% post_url 2016-05-09-macro-tutorial-4 %})...

More about loading code from github inside a klipse snippet in [this article]({% post_url 2016-05-29-spec %}) 


# Arithmetic with 1-arity

This is a recap of [the basic arithmetic operations]{% post_url 2016-07-20-lambda-calculus-1%}:

~~~klipse
(defn lambda-num [n]
  (fn [f]
      (fn [x]
            ((apply comp (repeat n f)) x))))

(defn visual [x]
  (list 'f x))

(defn view [f]
  ((f visual) 'x))

(deftype Lambda [f]
  Object
    (toString [_] (str (view f)))
      IPrintWithWriter
        (-pr-writer [this writer _] (-write writer (str (view f))))
          IEquiv
            (-equiv [this other]
                      (= (view this) (view other)))
              IFn
                (-invoke [this g]
                           (f g)))
(defn mult [m n]
  (Lambda.
      (fn [f]
            (m (n f)))))
~~~


And here is how we calculate `3` times `2`:

~~~klipse
(mult (lambda-typed-num 3) (lambda-typed-num 2))
~~~


Let us know what you think about this lambda-calculus tutorial in the comments below....


