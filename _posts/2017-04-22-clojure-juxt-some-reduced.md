---
layout: post
title:  "Clojure.core: juxt, some and reduced"
description:  "Clojure.core: juxt, some and reduced"
date:   2017-04-22 18:09:44 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "8DD695F0-8386-49E6-97D1-A4CD554AD6B1"
author: "Yehonathan Sharvit"
tags: [clojure]
---


I have been coding in `Clojure` for 5 years now - but still from time to time I am re-discovering some interesting functions from the `clojure.core` namespace. Today, I am going to share with you some interesting usages of `juxt`, `some` and `reduced`.



## Select several values from a map - with juxt

We have `select-keys` to create a submap of a map.

~~~klipse
(select-keys {:a 1 :b 2 :c 3} [:a :b])
~~~

But what if we want to get only the values?

We could chain `select-keys` and `vals`:

~~~klipse
(-> (select-keys {:a 1 :b 2 :c 3} [:a :b])
    vals)
~~~

But it doesn't feel idiomatic.

It's much cleaner to use `juxt`:

~~~klipse
((juxt :a :b) {:a 1 :b 2 :c 3})
~~~

## Find an item in a sequence - with some

We can find an item in a sequence with `(first (filter ...))`:

~~~klipse
(first (filter #(= % :c) [:a :b :c :d]))
~~~


But it's much more idiomatic to use [some](https://clojuredocs.org/clojure.core/some) and a set as a predicate:

~~~klipse
(some #{:c} [:a :b :c :d])
~~~

It works fine because in clojure, a set behaves as a function that receives an argument and returns it if it belongs to the set - and nil otherwise:

~~~klipse
(#{:c} :c)
~~~

~~~klipse
(#{:c} :a)
~~~

## Terminates a reduce - with reduced

How do you terminate a reduce once you have found the value that you were looking for?

For instance, let's imagine that you want to sum a sequence of positive numbers with a tweak: if the sum is greater than `1000` you want to return `:big-sum` instead of the sum.

You could write it with `reduce`:

~~~klipse
(defn my-sum [s]
  (let [res (reduce (fn [sum x]
                      (+ sum x))
                    0
                    s)]
    (if (>= res 1000)
      :big-sum
      res)))

(my-sum (range 100))
~~~

But - inside the `reduce` - once you have discovered that the sum is greater than `1000`, there is no point of continuing the calculation (because all the numbers are positive).

Let's terminate our `reduce` with `reduced`:

~~~klipse
(defn my-sum-opt [s]
  (reduce (fn [sum x]
            (let [res (+ sum x)]
              (if (>= res 1000)
                (reduced :big-sum)
                res)))
            0
            s))

(my-sum-opt (range 100))
~~~

