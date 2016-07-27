---
layout: post
title:  "Lambda Calculus Live Tutorial with Klipse: Boolean Algebra"
description:  "Lambda Calculus Live Tutorial with Klipse: Boolean Algebra"
date:   2016-07-24 18:17:23 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "D03763A2-9A81-4336-9EDD-A1D114C73546"
author: "@viebel"

---

In our [previous article]({% post_url 2016-07-20-lambda-calculus-1%}), we showed how the numbers are represented in lambda calculus.


The purpose of this article is to show how we represent boolean values in lambda calculus. And to show the code of the basic boolean operations: negation, conjunction and disjunction a.k.a `not`, `and` and `or`.


![Truth](/assets/truth.jpg)

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


# Definition of true and false 

Here is how we define `T` (`true`) and `F` (`false`) in lambda calculus:

~~~klipse
(defn T [x]
          (fn [y] x))

(defn F [x]
          (fn [y] y))
~~~


You can see `T` as a 2-arity function that returns the first argument and `F` as a 2-arity function that returns the second argument.


As we did with numerals, we can view a lambda boolean by passing to it `T` and `F`. Like this


~~~klipse
(defn view-bool [bool]
  ((bool "T") "F"))
~~~

And it works as expected: `T` returns `"T"`

~~~klipse
(view-bool T)
~~~

and `F` returns `"F"`:

~~~klipse
(view-bool F)
~~~

As we did in [Numbers and Arithmetics with functions only: lambda calculus live tutorial.]({% post_url 2016-07-20-lambda-calculus-1%}), we are going to define the `Lambda` type to make the visualisation and comparison of the lambda booleans more convenient.

~~~klipse

(deftype Lambda [f]
  Object
    (toString [_] (str (view-bool f)))

      IPrintWithWriter
        (-pr-writer [this writer _] (-write writer (str (view-bool f))))
          
             IEquiv
               (-equiv [this other]
                         (= (view-bool this) (view-bool other)))

                 IFn
                   (-invoke [this g]
                              (f g)))

~~~


Now, let's redefine `T` and `F` using `Lambda` type:

~~~klipse
(def T (Lambda.
         (fn [x]
           (fn [y] x))))
(def F (Lambda.
         (fn [x]
           (fn [y] y))))
~~~

Now, the lambda booleans are viewed properly:

~~~klipse
[T F T T F T]
~~~


They are invokable as functions

~~~klipse
((T T) F)
~~~

and they are comparable:

~~~klipse
(= ((T T) F) F)
~~~

Now, we are going to build the basic boolean operations, using the definition of `T` and `F`: In a nutshell, `T` returns the first argument and `F` returns the second argument.

In boolean algebra, the operations are defined by their truth table.

# Negation

~~~klipse
(defn negation [x]
  (Lambda.
      ((x F) T)))
~~~

Basically, what this code say is: if `x` is `T` then return the first argument - which is `F`. And if `x` is `F` then return the second argument - which is `T`. This is exactly what the `negation` is supposed to do.


Let's check that `negation` respects the truth table:

~~~klipse
(disp
(negation T)
(negation F))
~~~


# Conjunction

~~~klipse
(defn conjunction [x]
  (Lambda.
      (fn [y]
            (Lambda. ((x y) F)))))
~~~

Basically, this code says: if `x` is `T` return `y` else return `F`. This is exactly the definition of the conjunction in logic.

Let's check that `conjunction` respects the truth table:

~~~klipse
(disp ((conjunction T) T)
 ((conjunction T) F)
  ((conjunction F) F)
   ((conjunction F) T))
~~~

# Disjunction

~~~klipse
(defn disjunction [x]
  (Lambda.
      (fn [y]
            (Lambda. ((x T) y)))))
~~~


Basically, this code says: if `x` is `T` return `T` else return `y`. This is exactly the definition of the disjunction in logic.

Let's check that `conjunction` respects the truth table:

~~~klipse
(disp ((disjunction T) T)
 ((disjunction T) F)
  ((disjunction F) F)
   ((disjunction F) T))
~~~
