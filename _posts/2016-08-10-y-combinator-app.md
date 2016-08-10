---
layout: post
title: "Y combinator real life application: recursive memoization in clojure"
description: "Y combinator real life application: recursive memoization in clojure"
date:   2016-08-10 11:21:33 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "2A90C05E-6043-4167-B7F6-4516C451A81C"
author: "@viebel"

---

When we presented  [the Y combinator]({% post_url 2016-08-07-pure-y-combinator-clojure  %}), we said that it was very aesthetic but not so practical.


Today, we are going to show a real life application of the [Y combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator): the memoization of a recursive function.


![Recursive](/assets/escher-stairs.jpg)

# The problem

Did you ever try to [memoize](https://en.wikipedia.org/wiki/Memoization) a recursive function?

At first glance it seems easy, especially in `clojure` with the [memoize](https://clojuredocs.org/clojure.core/memoize) function: 

~~~klipse
(defn factorial [n]
    (print n)
    (if (zero? n)
      1
      (* n (factorial (dec n)))))

(def factorial-memo (memoize factorial))
~~~


And indeed subsequent calls to `factorial-memo` are cached:

~~~klipse
(def factorial-memo (memoize factorial))

(with-out-str
  (factorial-memo 6)
  (factorial-memo 6))
~~~

The numbers are only printed once.

By the way, all the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


But what happens to subsequent calls with smaller numbers?
We'd like them to be cached also. But they are not.

Here is the proof:


~~~klipse
(def factorial-memo (memoize factorial))

(with-out-str
  (factorial-memo 6)
    (factorial-memo 5))
~~~

The reason is that the code of `factorial-memo` uses `factorial` and not `factorial-memo`.

In `clojure`, we could modify the code of `factorial` so that it calls `factorial-demo`, but it is very very ugly: the code of the recursive function has to be aware of its memoizer!!!

~~~klipse
(defn factorial-ugly [n]
  (print n)
    (if (zero? n)
        1
            (* n (factorial-memo-ugly (dec n)))))

(def factorial-memo-ugly (memoize factorial-ugly))

(with-out-str
  (factorial-memo-ugly 6)
    (factorial-memo-ugly 5))
~~~



With the Y combinator we can solve this issue with elegance.


# The Y combinator for recursive memoization

As we explained [here]({% post_url 2016-08-07-pure-y-combinator-clojure  %}), the Y combinator allows us to generate recursive functions without using any names.


As envisioned by Bruce McAdam in his paper [Y in Practical Programs](/assets/y-in-practical-programs.pdf)  and exposed [here](http://www.viksit.com/tags/clojure/practical-applications-y-combinator-clojure/) by Viksit Gaur, we are going to tweak the code of the Y combinator, so that it receives a wrapper function and apply it before executing the original function. Something like this:

~~~klipse
(def Ywrap
  (fn [wrapper-func f]
    ((fn [x]
       (x x))
     (fn [x]
       (f (wrapper-func (fn [y]
                          ((x x) y))))))))
~~~


And here is the code for a memo wrapper generator:

~~~klipse
(defn memo-wrapper-generator [] 
  (let [hist (atom {})]
    (fn [f]
      (fn [y]
        (if (find @hist y)
          (@hist y)
          (let [res (f y)]
            (swap! hist assoc y res)
            res))))))
~~~

It is almost the same code as the clojure [memoize](https://en.wikipedia.org/wiki/Memoization).

And now, we are going to build a Y combinator for memoization:

~~~klipse
(def Ymemo 
  (fn [f]
      (Ywrap (memo-wrapper-generator) f)))
~~~


And here is how we get a memoized recursive factorial function:

~~~klipse
(def factorial-gen
  (fn [func]
    (fn [n]
      (println n)
      (if (zero? n)
        1
        (* n (func (dec n)))))))
(def factorial-memo (Ymemo factorial-gen))
~~~


And here is the proof that it is memoized properly:

~~~klipse
(with-out-str
(factorial-memo 6)
(factorial-memo 5))
~~~


Isn't it elegant?


# Fibonacci without exponential complexity

The worst effective implementation (exponential complexity) of the Fibonacci function is the recursive one:

~~~klipse
(defn fib [n]
  (if (< n 2) 1
    (+ (fib (- n 1))
       (fib (- n 2)))))
~~~


There are a couple of [effective implementations]({% post_url 2016-04-19-fibonacci %}) for the Fibonacci sequence without using recursion.


Using our `Ymemo` combinator, one can write an effective recursive implementation if the Fibonnaci sequence:


~~~klipse
(defn fib-gen [f]
  (fn [n]
    (if (< n 2) 1
      (+ (f (- n 1))
         (f (- n 2))))))

(def fib-recursive-memo (Ymemo fib-gen))
~~~


Let's compare the performances of the naive recursive version and the memoized recursive:

(We have to redefine `fib-recursive-memo`, in order to reset the cache each time we re-run the code snippet.)

~~~klipse
(def fib-recursive-memo (Ymemo fib-gen))
(def n 35)
(with-out-str
  (time (fib n))
  (time (fib-recursive-memo n)))
~~~

On my computer, the memoized one is around *300* times faster!

Please share your thoughts about this really exciting topic...

