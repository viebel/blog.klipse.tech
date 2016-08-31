---
layout: post
title:  "Functional programming: Monads made clear - in javascript"
description:  "Introduction to monads in javascript. Functional javascript. Haskell."
date:   2016-08-31 14:22:36 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "94672FCD-6D50-4C26-8FB3-952A86B9A6CE"
author: "@viebel"
---

# Background 

[Monad](https://en.wikipedia.org/wiki/Monad_(functional_programming)) is an advanced concept of functional programming.

Monads are prevalent in `Haskell` because it only allows [pure functions](https://en.wikipedia.org/wiki/Pure_function), that is functions that do not have [side effects](https://en.wikipedia.org/wiki/Side_effect_(computer_science)).

Pure functions accept input as arguments and emit output as return values, and that’s it. 

In usual languages like `Ruby`, `JavaScript` or even `Clojure`, we do not have this constraint, but it often turns out to be a useful discipline to enforce yourself. 

The typical monad introduction will tell you that monads are all about sneaking side effects into this model so you can do I/O.

But that’s just one application. Monads are really about composing functions, as we’ll see.

This article is not easy, but if you make the effor and go through it until the end, you'll feel like you have climbed a mountain...

![Mountain](/assets/mountain_top.jpg)

Our hope is that the the interactive snippet of this blog post will help you to climb the mountain.

All the code snippets of this page are **live** and **interactive** powered by the [KLIPSE plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type

It will work only if your browser supports `EcmaScript6` [arrow functions](https://kangax.github.io/compat-table/es6/).

# Logging function calls

Let’s imagine you have a function for finding the `sine` of a number, which in `JavaScript` would be a simple wrapper around the Math library:

~~~klipse-eval-js
var sine = (x) => Math.sin(x);
sine(0.123)
~~~

And you have another function for taking the `cube` of a number:

~~~klipse-eval-js
cube = (x) => x * x * x;
cube(0.987)
~~~

These functions take one number as input and return one number as output, making them composable: you can use the output of one as the input to the next:

~~~klipse-eval-js
sineCubed = (x) => cube(sine(x));
sineCubed(1.22);
~~~

Let’s create a function to encapsulate function composition. This takes two functions `f` and `g` and returns another function that computes `f(g(x))`.

~~~klipse-eval-js
compose = (f, g) => (x) => f(g(x)); 
var sineOfCube = compose(cube, sine);

var x = 1.22;
sineOfCube(x) === sineCubed(x);
~~~

Now, we decide that we need to debug these functions, and we want to log the fact that they have been called. We might do this like so:

~~~klipse-eval-js
var cube = (x) => {
  console.log('cube was called.');
  return x * x * x;
};
~~~

# Pure functions - no side effects

But we’re not allowed to do this in a system that only allows pure functions: `console.log()` is neither an argument nor a return value of the function, it is a side effect. 

If we want to capture this logging information, it must form part of the return value. Let’s modify our functions to return a pair of values: the result, and some debugging information:

~~~klipse-eval-js
var sine = (x) => [Math.sin(x), 'sine was called.'];
sine(0.3218)
~~~

~~~klipse-eval-js
var cube = (x) =>  [x * x * x, 'cube was called.'];
cube(3)
~~~

But we now find, to our horror, that these functions don’t compose:

~~~klipse-eval-js
compose(sine, cube)(3)
~~~

This is broken in two ways:

1. `sine` is trying to calculate the sine of an array, which results in `null`

2. we’re losing the debugging information from the call to `cube`

We’d expect the composition of these functions to return the `sine` of the `cube` of `x`, and a string stating that both `cube` and `sine` were called:

A simple composition won’t work here because the return type of `cube` (an `array`) is not the same as the argument type to `sine` (a `number`).

A little more glue is required. We could write a function to compose these ‘debuggable’ functions: it would break up the return values of each function and stitch them back together in a meaningful way:

~~~klipse-eval-js
var composeDebuggable = (f, g) => (x) => {
        const [y,s] = g(x),
               [z,t ] = f(y);
                   return [z, s + t];
};
composeDebuggable(sine, cube)(3)
~~~

We’ve composed two functions that take a number and return a `(number, string)` pair, and created another function with the same signature, meaning it can be composed further with other debuggable functions.

# Haskell to the rescue

To simplify things, let's borrow some `Haskell` notation. The following type signature says that the function `cube` accepts a `number` and returns a tuple containing a `number` and a `string`:

~~~haskell
cube :: Number -> (Number,String)
~~~

This is the signature that all our debuggable functions and their compositions have. Our original functions had the simpler signature `Number -> Number`.

The symmetry of the argument and return types is what makes these functions composable. Rather than writing customized composition logic for our debuggable functions, what if we could simply convert them such that their signature was:

~~~haskell
cube :: (Number,String) -> (Number,String)
~~~

We could then use our original compose function for glueing them together. We could do this conversion by hand, and rewrite the source for cube and sine to accept `(Number,String)` instead of just `Number` but this doesn’t scale, and you end up writing the same boilerplate in all your functions.

# The Writer monad

Far better to let each function just do its job, and provide one tool to coerce the functions into the desired format. We’ll call this tool `bind`, and its job is to take a `Number -> (Number,String)` function and return a `(Number,String) -> (Number,String)` function.

Let's write `bind` in `javascript`:

~~~klipse-eval-js
var bind = (f) => function(tuple) {
      const [x, s] = tuple,
              [y, t] = f(x);
                return [y, s + t];
};
~~~

We can use this to convert our functions to have composable signatures, and then compose the results.

~~~klipse-eval-js
var f = compose(bind(sine), bind(cube));
f([3, ''])
~~~

But now all the functions we’re working with take `(Number,String)` as their argument, and we’d much rather just pass a `Number`.

As well as converting functions, we need a way of converting values to acceptable types, that is we need the following function:

~~~haskell
unit :: Number -> (Number,String)
~~~

The role of `unit` is to take a value and wrap it in a basic container that the functions we’re working with can consume. For our debuggable functions, this just means pairing the number with a blank string:

~~~klipse-eval-js
var unit = (x) => [x, ''];

var f = compose(bind(sine), bind(cube));
f(unit(3)) 
~~~

Or, we can also compose `f` and `unit`, like this:

~~~klipse-eval-js
compose(f, unit)(3) 
~~~

This `unit` function also lets us convert any function into a debuggable one, by converting its return value into an acceptable input for debuggable functions. For instance:

~~~klipse-eval-js
// round :: Number -> Number
var round = function(x) { return Math.round(x) };

// roundDebug :: Number -> (Number,String)
var roundDebug = function(x) { return unit(round(x)) };
roundDebug(1.23)
~~~

Again, this type of conversion, from a 'plain’ function to a debuggable one, can be abstracted into a function we’ll call `lift`. 

~~~haskell
lift :: (Number -> Number) -> (Number -> (Number,String))
~~~

The type signature says that `lift` takes a function with signature `Number -> Number` and returns a function with signature `Number -> (Number,String)`.

And now, the code for `lift`:

~~~klipse-eval-js
var lift = (f) => compose(unit, f);
~~~

Let’s try this out with our existing functions and see if it works:

~~~klipse-eval-js
var roundDebug = lift(Math.round);

var f = compose(bind(roundDebug), bind(sine));
f(unit(27)) // -> [1, 'sine was called.']
~~~

# Summary

We’ve discovered three important abstractions for glueing debuggable functions together:

1. `lift` - which converts a 'simple’ function into a debuggable function
2. `bind` - which converts a debuggable function into a composable form
3. `unit` -  which converts a simple value into the format required for debugging, by placing it in a container

These abstractions (well, really just `bind` and `unit`), define a monad. In the `Haskell` standard library it’s called the `Writer` monad.


PS: This article is a rewrite of [Translation from Haskell to JavaScript of selected portions of the best introduction to monads I’ve ever read](https://blog.jcoglan.com/2011/03/05/translation-from-haskell-to-javascript-of-selected-portions-of-the-best-introduction-to-monads-ive-ever-read/) with interactive code snippets instead of static ones.

PPS: If you are a technical blogger, feel free to write interactive code snippets with [the KLIPSE plugin](https://github.com/viebel/klipse)...
