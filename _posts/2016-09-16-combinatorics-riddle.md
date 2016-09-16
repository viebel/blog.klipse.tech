---
layout: post
title:  "Solving a not-so-easy riddle with clojure.math.combinatorics"
description:  "Solving a not-so-easy riddle with clojure.math.combinatorics. permutations. arithmetics."
date:   2016-09-16 05:34:18 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "30362234-7bd5-11e6-97d5-600308a46268"
author: "@viebel"
---


A friend of mine (Hillel Cahana) shared with me a riddle that his 10-year old son brought from a math workshop. At first, the riddle sounded easy...



# The riddle

You've got the first 6 digits 1,2,3,4,5 and 6.

You have to partition the digits into 3 numbers `x`, `y` and `z` where:

- `x` is a 3-digit number
- `y` is a 2-digit number
- `z` is a single digit number

Such that the multiplication `x*y*z` is maximal.

Each digit must be used only once.

For instance, `123*45*6`:

~~~klipse
(* 123 4 5 6)
~~~

But, obviously we can do better.

Sounds easy. Right?

So give it a try.

Before reading the rest of this article, take a pencil and a sheet of paper and try to find the solution.

Have fun with the digits!

![digits](/assets/digits.jpg)


# Elegant or brute force

Maybe, you were a math genius and you are able to find the elegant solution to this riddle and to prove mathematically that your solution is correct.

It's not my case, so we are going to go with a brute force algorithm with a couple of lines of  `clojure` code.

We are going to go over the `6!` permutations and take the one that leads to the greatest number.

But, wait a minute `6!=720`!

How are we going to generate those 720 permutations?

Hmm....


# Clojure.math.combinatorics to the rescue

There is a `clojure` library named `clojure.math.combinatorics` (by [Mark Engelberg](https://github.com/Engelberg)) that has a `permutations` function (and a lot of other useful functions: check it [here](https://github.com/clojure/math.combinatorics)).


For instance, let's generate all the `3!` permutations of `[1 2 3]`:


<pre><code class="language-klipse" data-external-libs="https://raw.githubusercontent.com/viebel/math.combinatorics/master/src/main/clojure">
(ns my.combinatorics
  (:require [clojure.math.combinatorics :refer [permutations]]))

(permutations [1 2 3])
</code></pre>


# The solution

With `permutations`, it's really easy to find the solution to the riddle:


~~~klipse
(apply max-key (fn [[a b c d e f]]
                 (* (+ (* 100 a) (* 10 b) c)
                                     (+ (* 10 d) e)
                                                         f))
       (permutations (range 1 7)))
~~~

`max-key` returns the value for which the function is greatest.


Clojure rocks!

PS: Do you have a more elegant solution to this riddle? Let us know in the comments below...
