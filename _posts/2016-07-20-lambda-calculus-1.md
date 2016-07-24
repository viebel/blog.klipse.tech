---
layout: post
title:  "Numbers and Arithmetics with functions only: live lambda calculus tutorial."
description:  "Numbers and Arithmetics with functions only. Lamnda-Calculus introduction in Clojure. Live tutorial."
date:   2016-07-24 10:22:34 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "E4F49774-308C-49F7-928E-5A22EB25F66A"
author: "@viebel"

---


The mathematical theory behind `LISP` is the [λ-calculus](https://en.wikipedia.org/wiki/Lambda_calculus) (pronounced lambda-calculus).

The amazing thing about `λ-calculus` is that it is possible to represent numbers and the arithmetic operations (`successor`, `addition` and `multiplication`) as functions.

Once you have arithmetics, you have almost all the mathematics and the computer science.

In this article, we are going to show this representation using `clojure`. 

By the way, this is the signification of the `λ` sign in the clojure logo:

![Clojure](/assets/clojure_logo.jpg){:height="300px" width="300px"}

# Numbers representation in λ-calculus

Like everything in `λ-calculus`, numbers are functions.

A number `n` is a function that receives as argument a `1-arity` function `f` and returns a function that applies `f` `n` times. 

Let's define the first natural numbers, manually:


~~~klipse
(defn zero [f]
  (fn [x] x))

(defn one [f]
  (fn [x]
    (f x)))

(defn two [f]
  (fn [x]
    (f (f x))))

(defn three [f]
  (fn [x]
    (f (f (f x)))))
~~~

# Numbers in action

In order to see the numbers in action, we need to execute them on a function and to execute the resulting function on a value.


All the code snippets on this article are live and interactive: feel free to modify the code and it will evaluate instantaneously!

We could take the increment function `inc`, and execute the result on `42`:

~~~klipse
((zero inc) 42)
~~~

~~~klipse
((one inc) 42)
~~~

~~~klipse
((two inc) 42)
~~~

~~~klipse
((three inc) 42)
~~~


But, in order to make it more visual, we are going to define a custom function:

~~~klipse
(defn visual [x]
  (list 'f x))
~~~

Let's see what happens when we pass it to a lambda number:

~~~klipse
((two visual) 'x)
~~~

Nice! Now, we see visually the definition of the number `two`: Application of a function twice.

In oder to make things more convenient, let's define a helper function `view`:

~~~klipse
(defn view [f]
  ((f visual) 'x))
~~~

And let's view the lambda numbers we have defined so far:

~~~klipse
(map view [zero one two three])
~~~

# Generating any lambda number

Let's write a function that receives a regular number `n` and returns the corresponding `lambda-number`, using `clojure` functions `comp`, `repeat` and `apply`:

~~~klipse
(defn lambda-num [n]
  (fn [f]
      (fn [x]
            ((apply comp (repeat n f)) x))))
~~~

Let's view the lambda-number `6`:

~~~klipse
(view (lambda-num 6))
~~~

And we can easily view a range of lambda-numbers:

~~~klipse
(map view (map lambda-num (range 5)))
~~~

# Equality

Two `lambda-numbers` are equal if they are the same functions from a mathematical perspective. 


It is disappointing that a `lambda-number` is not equal to itself:

~~~klipse
(= (lambda-num 6) (lambda-num 6))
~~~

The reason, is that from a `clojure` perspective they are two different functions with the same code.

We will use the function `view` for equality test:

~~~klipse
(defn eq? [m n]
  (= (view m) (view n)))
~~~

It works as expected:

~~~klipse
(eq? (lambda-num 6) (lambda-num 6))
~~~

~~~klipse
(eq? (lambda-num 4) (lambda-num 6))
~~~

# Type definition for lambda

Let's define a `clojure` type to customize the viewability and equality of lambda numbers. Our type will have the following properties:

1. It is callable as a function
2. It is viewable with `view`
3. It redefines equality with `view`


For that purpose, we need to implement three `clojure` protocols:

1. `IFn`
2. `IPrintWithWriter`
3. `IEquiv`

Let's define a type named `Lambda`:

(If you are not familiar with the details of `clojure` protocols, you can skip the following code snippet.)

~~~klipse
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
~~~

And a function that converts a regular number to a typed lambda number:

~~~
(defn lambda-typed-num [n]
  (Lambda. (lambda-num n)))
~~~


Now, lambda numbers are viewable:

~~~klipse
(map lambda-typed-num (range 5))
~~~

And comparable:

~~~klipse
(= (lambda-typed-num 6) (lambda-typed-num 6))
~~~


~~~klipse
(= (lambda-typed-num 4) (lambda-typed-num 6))
~~~

Now that we have defined lambda numbers and that they are viewable and comparable, we can introduce the basic arithmetic operations: successor, addition and multiplication.

# The successor operation

Here is how one implements the `successor` function in `λ-calculus`. Successor is a function that receives a number `n` and returns `n+1`.

~~~klipse
(defn successor [m]
 (fn [f]
  (fn [x]
   (f ((m f) x)))))
~~~

The code basically means: apply the function `f` `m` times and then another time.

Now, lets' wrap it with our `Lambda` type


~~~klipse
(defn succ [m]
  (Lambda. (successor m)))
~~~

Let's check it works fine:

~~~klipse
(succ (lambda-typed-num 1))
~~~

~~~klipse
(= (succ (lambda-typed-num 8)) (lambda-typed-num 9))
~~~

## The addition operation


Here is how one implements the `addition` function in `λ-calculus`. Addition is a function that receives two numbers and returns the result of their addition:


~~~klipse
(defn add [m n]
 (Lambda.
  (fn [f]
   (fn [x]
    ((n f) ((m f) x))))))
~~~

The code basically means: apply the function `f` `m` times and then `n` times.

Let's check it works fine:

~~~klipse
(add (lambda-typed-num 3) (lambda-typed-num 2))
~~~

Make sure that `3+2` equals 5:

~~~klipse
(= (add (lambda-typed-num 3) (lambda-typed-num 2))
   (lambda-typed-num 5))
~~~


# The multiplication operation

Here is how one implements the `multiplication` function in `λ-calculus`. Multiplication is a function that receives two numbers and returns the result of their multiplication:


~~~klipse
(defn mult [m n]
  (Lambda.
      (fn [f]
            (m (n f)))))
~~~

The code basically means: compose the function `f` `n` times and then `n` times.

Let's check it works fine:

~~~klipse
(mult (lambda-typed-num 3) (lambda-typed-num 2))
~~~

Make sure that `3*2` equals 6:

~~~klipse
(= (mult (lambda-typed-num 3) (lambda-typed-num 2))
   (lambda-typed-num 6))
~~~

# Conclusion

It is really amazing to see concretely how powerful is the `λ-calculus`. With a very limited set of characters and concepts we can build the arithmetics.



