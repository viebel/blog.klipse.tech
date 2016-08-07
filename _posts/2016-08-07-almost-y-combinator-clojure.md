---
layout: post
title:  "Recursions without names: Introduction to the Y combinator in clojure"
description:  "Recursions without names"
date:   2016-08-07 03:21:33 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "A433A82B-68C5-4083-9DA4-72878DC03972"
ruby: true
author: "@viebel"

---


This is an introductory article to the [Y combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator) from `lambda-calculus`. But we won't mention the `Y combinator` in this article.

In this article, we are going to show how to write recursive functions in `clojure` without giving names to any function.

At first glance it seems impossible: how could we refer to something that we are currently defining without using its name?


![Escher](/assets/escher_hand.jpg)

All the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type



## Begin with the end in mind

The end result of this article is the recursive implementation of the `factorial` function without using neither names nor loops.

Here is the code:

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

As you can check, no mention of any names.

At first, it feels like magic.

Now, we are going to show the 4 step process that leads to this wonderful piece of code.


(We were inspired by this [long but awesome article](http://mvanier.livejournal.com/2897.html) by [Mike Vanier](http://users.cms.caltech.edu/~mvanier/).)

## The process

# Step 0: recursive function

Let's start with the recursive implementation of `factorial`:

~~~klipse
(defn factorial [n]
 (if (zero? n)
   1
     (* n (factorial (dec n)))))
~~~

~~~klipse
(factorial 10)
~~~

# Step 1: simple generator

Let's write a function that is a generator of the `factorial` function:


~~~klipse
(defn factorial-gen [func]
  (fn [n]
    (if (zero? n)
      1
      (* n (func (dec n))))))
~~~

One one hand, `factorial-gen` is not recursive.

On the other hand, `factorial-gen` is not the `factorial` function. 

But the interesting thing is that if we pass `factorial` to `factorial-gen` it returns the `factorial` function:

~~~klipse
((factorial-gen factorial)
 19)
~~~


Before going on reading make sure you understand why it is true that:

> `(factorial-gen factorial)` is exactly `factorial`

# Step 2: weird generator


Now, we are going to do something very weird: instead of using `func`, we are going to use `(func func)`. Like this:

~~~klipse
(defn factorial-weird [func]
  (fn [n]
    (if (zero? n)
      1
      (* n ((func func)(dec n))))))
~~~

The funny thing now is that if we apply `factorial-weird` to itself we get the `factorial` function:


~~~klipse
((factorial-weird factorial-weird) 19)
~~~

Before going on reading make sure you understand why it is true that:

> `(factorial-weird factorial-weird)` is exactly `factorial`


# Step 3: Recursion without names

Now, let's write down the application of `factorial-weird` to itself, using the body of `factorial-weird` instead of its name:

~~~klipse
(def factorial-no-names
((fn [func]
    (fn [n]
      (if (zero? n)
        1
        (* n ((func func) (dec n))))))
(fn [func]
    (fn [n]
      (if (zero? n)
        1
        (* n ((func func) (dec n))))))))
~~~


And we got a recursive implementation of `factorial` without using any names!

We gave it a name just for the convenience of using it.


As you can check, this is a completely valid implementation of `factorial`:


~~~klipse
(map factorial-no-names (range 20))
~~~


Do you understand why this is equivalent to the code we shown in the beginning of the article?

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



Can you write your own implementation of recursive functions without names?

Share in the comments your implementation for:

- Fibonacci
- Quicksort
- max
- min
- ...


