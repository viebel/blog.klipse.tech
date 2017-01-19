---
layout: post
title:  "Core.match interactive tutorial"
description:  "Core.match interactive tutorial. Pattern matching clojure"
date:   2016-10-25 12:21:32 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "A880C155-1B72-4801-BD98-F7BAAFE95BF0"
author: "@viebel"
---


# Pattern matching in clojure


[core.match](https://github.com/clojure/core.match) - An optimized pattern matching library for Clojure[script] - is *almost* available for self-host `clojuresript`. It means that it can run in [Planck](https://github.com/mfikes/planck) and [Klipse](https://github.com/viebel/klipse).

There is a [JIRA ticket](http://dev.clojure.org/jira/browse/MATCH-116) for the port of `core.match` with a patch of mine - that makes `core.match` self-host compatible. (Please take a couple of seconds to vote for [this ticket](http://dev.clojure.org/jira/browse/MATCH-116))

With this patch, we can make this interactive tutorial of `core.match` - that will guide you through all the features of `core.match`. Actually, this tutorial is a rewrite of a [wiki page](https://github.com/clojure/core.match/wiki/Basic-usage) form `core.match` GitHub repository - with a tweak: the code snippets are interactive.

![match](/assets/match.jpg)


# Introduction


Let's require `core.match` from [my fork of core.match](https://github.com/viebel/core.match/) (until it gets merged into the official repo). 


<pre><code class="language-klipse">
(ns my.match
  (:require [cljs.core.match :refer-macros [match]]))
</code></pre>

Now, we can play with `core.match`.

Matching Literals
---

The simplest thing you can do is match literals:

~~~klipse
(let [x true
      y true
      z true]
  (match [x y z]
    [_ false true] 1
    [false true _ ] 2
    [_ _ false] 3
    [_ _ true] 4
    :else 5))
~~~

Note that the only clause that matches the values of the local
variables is the fourth one. "Wildcards", the `_`, in the pattern
signifies values that are present that you don't actually care about.

When matching on a single variable you may omit the brackets:

~~~klipse
(let [x true]
  (match x
    true 1
    false 2
    :else 5))
~~~


# FizzBuzz

Now, let's solves the famous Fizz-buzz interview question:

~~~klipse
(with-out-str (doseq [n (range 1 11)]
  (println
    (match [(mod n 3) (mod n 5)]
           [0 0] "FizzBuzz"
           [0 _] "Fizz"
           [_ 0] "Buzz"
           :else n))))
~~~

Binding
---

You may match values and give them names for later use:

~~~klipse
(let [x 1 y 2]
  (match [x y]
    [1 b] b
    [a 2] a
   :else nil))
~~~

This may seem pointless here but in complex patterns this feature
becomes more useful (consider red black tree balancing for example).

Sequential types
---

You may match sequences by using the sequence matching facility:

~~~klipse
(let [x [1 2 nil nil nil]]
  (match [x]
    [([1] :seq)] :a0
    [([1 2] :seq)] :a1
    [([1 2 nil nil nil] :seq)] :a2
    :else nil))
~~~

Note this works on all `ISeqs` as well as `Sequential` types.

Vector types
---

You can also match vector types, the benefit is much better
performance when you want to test something internal without looking
at earlier values - random access:

~~~klipse
(let [x [1 2 3]]
  (match [x]
    [[_ _ 2]] :a0
    [[1 1 3]] :a1
    [[1 2 3]] :a2
    :else :a3))
~~~

`core.match` will optimize this case and test the third column first.

Rest patterns
---

Both seq and vector patterns support rest patterns. As in Clojure's
builtin destructuring, rest pattern will capture the "rest" of a
collection.

~~~klipse
(let [x '(1 2)]
  (match [x]
    [([1] :seq)] :a0
    [([1 & r] :seq)] [:a1 r]
    :else nil))
~~~

Map patterns
---

`core.match` supports matching maps. Here is a simple example:

~~~klipse
(let [x {:a 1 :b 1}]
  (match [x]
    [{:a _ :b 2}] :a0
    [{:a 1 :b 1}] :a1
    [{:c 3 :d _ :e 4}] :a2
    :else nil))
~~~

This will return `:a1`. Note that if you specify a key but you don't
care about its value, you are asserting that the key must at least be
present. For example:

~~~klipse
(let [x {:a 1 :b 1}]
  (match [x]
    [{:c _}] :a0
    :else :no-match))
~~~

will return `:no-match` since the map does not have the key `:c`.

It's also useful to specify that some map has *only* a set of
specified keys, this can be accomplished with the `:only` map pattern
modifier:

~~~klipse
(let [x {:a 1 :b 2}]
  (match [x]
    [({:a _ :b 2} :only [:a :b])] :a0
    [{:a 1 :c _}] :a1
    [{:c 3 :d _ :e 4}] :a2
    :else nil))
~~~

This will return `:a0` however the following:

~~~klipse
(let [x {:a 1 :b 2 :c 3}]
  (match [x]
    [({:a _ :b 2} :only [:a :b])] :a0
    [{:a 1 :c _}] :a1
    [{:c 3 :d _ :e 4}] :a2
    :else nil))
~~~

Will return `:a1`.

Or patterns
---

`core.match` supports "or" patterns - sugar for specifying
alternatives.

~~~klipse
(let [x 4 y 6 z 9]
  (match [x y z]
    [(:or 1 2 3) _ _] :a0
    [4 (:or 5 6 7) _] :a1
    :else nil))
~~~

This is much more succinct that having to define six separate clauses.

Guards
---

`core.match` supports arbitrary guards on patterns:

~~~klipse
(match [1 2]
  [(_ :guard #(odd? %)) (_ :guard odd?)] :a1
  [(_ :guard #(odd? %)) _] :a2
  :else :a4)
~~~

Nesting
---

It is possible to match on nested maps:

~~~klipse
(match [{:a {:b :c}}]
  [{:a {:b nested-arg}}] nested-arg)
~~~

Function application
---

core.match supports pattern matching on the result of function applications

~~~klipse
(let [n 0]
  (match [n]
    [(1 :<< inc)] :one
    [(2 :<< dec)] :two
    :else :no-match))
~~~

The right hand side is the function to apply, the left hand side is any valid
pattern.


# The algorithm

The `core.match` algorithm is based on Luc Maranget's paper
[Compiling Pattern Matching to good Decision Trees](http://www.cs.tufts.edu/~nr/cs257/archive/luc-maranget/jun08.pdf).
A gentle description of the algorithm is provided in [core.match wiki](https://github.com/clojure/core.match/wiki/Understanding-the-algorithm).


Self-host Clojurescript rocks!

