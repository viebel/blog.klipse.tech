---
layout: post
title:  An interactive Quine in Clojure
description:  Interactive Quines in Clojure. A quine is a program that evaluates to itself.
date:   2019-01-08 16:14:14 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: A5CCFFBF-5831-4979-81A2-F73D816D434F
author: Yehonathan Sharvit
---

## What's a quine?

According to [Wikipedia](https://en.wikipedia.org/wiki/Quine_(computing)), a *quine* is a non-empty computer program which takes no input and produces a copy of its own source code as its only output. 

In other words, a quine is a code snippet whose output is exactly the same as its source code.


![Escher](/assets/self-escher.png)

In the Clojure world, we would say that a quine is a code expression that evaluates to itself.

We say code expression in opposition with data expressions that trivially update to themselves:

~~~klipse
42
~~~

~~~klipse
[1 2 42]
~~~

## TL;DR

If you have no patience to read this article, here is the simplest Clojure Quine:

~~~klipse
((fn [x] (list x (list 'quote x))) '(fn [x] (list x (list 'quote x))))
~~~

Indeed, the output is exactly the same as the source code.

## Quine: first attempt

A quine is a piece of code that evaluates to itself. As a first attempt, we might be tempted to try to write a function that returns its source code as a form. After all, Clojure is [homoiconic](https://en.wikipedia.org/wiki/Homoiconicity): the structure of the code is the same as the structure of the data.

Let's try to write an anonymous function with no arguments that returns its code as a quoted form. This function does nothing so its code should be `(fn [])`.  So let's write and call an anonymous function that returns `'(fn [])`:

~~~klipse
((fn [] '(fn [])))
~~~

The problem is that now our anonymous function doesn't do nothing. In fact, it returns `'(fn [])`. So the body of the function is now `'(fn [])`.

No problem, let's improve our anonymous function so that it returns `'(fn [] '(fn []))`:

~~~klipse
((fn [] '(fn [] '(fn []))))
~~~

But now, the problem is that our anonynous function returns `'(fn [] '(fn [])`.

This strategy is not going to work: we will always be missing a `(fn [])` wrapping level.

## Quine: self referentiality

You might already have guessed that a real quine is going to involve self-referentiality. 

Let's find a function `f` and an argument `x` such that  such that `(f x)` is exactly `(f x)`.

A good guess for `x` is `'f`.

So let's write our function `f` such that `(f 'f)` is `(f 'f)`:

~~~klipse
(defn f [x] '(f 'f))
(f 'f)
~~~

It works! `(f 'f)` indeed evaluates to itself.

The only problem is that our code contains the definition of `f` but our output doesn't.

In order to overcome this issue, we need to define `f` as an anonymous function.

As a first step, let's rewite `f` in such a way that it will return `(f 'f)` not for all the arguments but only when we pass `'f` to `f`:

~~~klipse
(defn f [x] (list x (list 'quote x)))
(f 'f)
~~~

Finally if we replace `f` by its definition, we get our quine:

~~~klipse
((fn [x] (list x (list 'quote x))) '(fn [x] (list x (list 'quote x))))
~~~

Do you feel a headache?

That's normal: self-referentiality is very often a dizzy activity.


