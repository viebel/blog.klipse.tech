---
local_klipse: false
layout: post
title:  Welcome Clojurescript 1.10.516
description:  Demo of Clojure 1.10 features. Tutorial. Data and People.
date:   2019-02-04 11:13:14 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "62BC4D8C-5AB3-4D97-B6B2-29A0BC2D0EAD"
author: Yehonathan Sharvit
tags: [clojurescript]
---


Clojurescript `1.10.516` has been released on January 31, 2019


This article is an interactive version of [the official announcement on Clojurescript.org](https://clojurescript.org/news/2019-01-31-release), with the permission of Alex Miller.

## Noteworthy Changes
Spec instrumentation (`cljs.spec.test.alpha/instrument` and related functionality) no longer requires `test.check`.

Let's define a function `fooz` that receives numbers only:

~~~klipse
(require '[cljs.spec.test.alpha :as stest])
(require '[cljs.spec.alpha :as s])

(defn fooz [x] x)
(s/fdef fooz :args (s/cat :x number?))

(stest/instrument `fooz)
~~~

Now, when we call `fooz` with an argument that is not a number, `spec` emits an error:

~~~klipse
(fooz "42")
~~~

If you use `cljs.spec.test.alpha/check`, the data generation functionality of `test.check` is needed; in that case you need to require the `clojure.test.check` namespace.

Keywords used in the `cljs.spec.test.alpha/check` API pertaining to Spec’s use of `test.check` are now qualified with `clojure.spec.test.check`, thus aligning with Clojure. The previous way of qualifying with `clojure.test.check` is still supported.

## Clojure 1.10 Features

# Improved Exception Messages and Printing
The improved exception infrastructure added in Clojure 1.10 has been ported to ClojureScript with this release.

# Protocols via Metadata
The ability to add protocols via metadata (for protocols defined with the :extend-via-metadata true directive) has been ported to ClojureScript with this release.

# Datafy and Nav
The clojure.datafy namespace has been ported to ClojureScript, along with associated protocols in the clojure.core.protocols namespace.


See [Welcome Clojure 1.10]({% post_url 2018-12-19-welcome-clojure-10 %}) for interactive examples of improved exception messages, protocols via Metadata, Datafy and Nav.


## clojure.edn namespace
A new `clojure.edn` namespace is added with this release which delegates to `cljs.reader` for functionality. This facilitates writing portable Clojure/ClojureScript source making use of `clojure.edn/read` and `clojure.edn/read-string`:

~~~klipse
(require 'clojure.edn)

(clojure.edn/read-string "(def a)")
~~~


## Type Inference Improvements

# Predicate-Induced Type Inference
The type inference algorithm will now consider core predicates when inferring the types of locals used in conditional expressions.

For example, in

~~~clojure
(if (string? x)
  (inc x)
  10)
~~~
  
because `x` satisfies `string?`, it will be inferred to be of string type in the then branch (and thus cause a warning to be emitted because inc is being applied to it).

~~~klipse
(defn my-inc-if [x]
  (if (string? x)
    (inc x)
    10))
~~~


Because `cond` and `when` are macros built on top of `if`, predicate-induced inference also works as expected for expressions involving `cond` and `when`.

~~~klipse
(defn my-inc-when [x]
  (when (string? x)
    (inc x)
    10))
~~~

In addition to core predicates, predicate-induced type inference also works for `instance?` checks. So, for example testing `(instance? Atom x)` will result in `x` being inferred of type `cljs.core/Atom`.

# Truthy-Induced Inference
In situations where a value could potentially be `nil` (represented by the symbol `clj-nil` in type tags), if a simple symbol referring to such a value is used as the test in a conditional, the type inference algorithm will infer that the value cannot be `nil` in the then branch.

This is perhaps best illustrated by way of example. Let’s say you have the following function:

~~~clojure
(defn f [x]
  (when (even? x)
    (inc x)))
~~~
	
This function’s return type is `#{number clj-nil}`, meaning that either a number or `nil` can be returned.

The following function, which uses `f` and would previously be inferred as returning `#{number clj-nil}`, is now inferred as returning number:

~~~clojure
(defn g [y]
  (let [z (f y)]
    (if z
      z
      17)))
~~~
	  
In fact, owing to the way the or macro expands, the expression `(or (f 1) 17)` is now inferred as being simply number.

# Improved loop / recur Inference
The type-inferrence algorithm will now consider `recur` parameter types when inferring `loop` local types.

For example, in

~~~klipse
(loop [x "a"]
  (if (= "a" x)
   (recur 1)
   (+ 3 x)))
~~~

the local `x` would previously be inferred to be of string type (and this would cause a warning to be emitted for the expression adding it to 3). Now, the compiler will infer `x` to be either string or numeric (and thus the warning will no longer appear).

# Multi-Arity and Variadic Function Return Type Inference

ClojureScript `1.10.439` added function return type inference, but this capability only worked for single-arity functions. This release extends this capability to multi-arity and variadic functions.

Furthermore, the inferred return type will properly vary if different arities return different types. For example,

~~~klipse
(defn foo
  ([x] 1)
  ([x y] "a"))
~~~

then the expression `(foo true)` will be inferred to be of numeric type while `(foo :a :b)` will be inferred to be of string type.

If we try to call `inc` on `(foo :a :b)`, we get a warning:

~~~klipse
(inc (foo :a :b))
~~~

However, the warning is not emitted, when we call `inc` on `(foo true)`:

~~~klipse
(inc (foo true))
~~~


## Spec Improvements

Several improvements in the Spec implementation are in this release, making it easier to spec functions in the standard core library, as well as improving instrumentation performance when a large number of functions in a codebase have specs.

## Improved Performance

# Chunked-Seq support for Ranges

ClojureScript now supports `chunked-seqs` for ranges. An example where this capability improves performance is

~~~clojure
(reduce + (map inc (map inc (range (* 1024 1024)))))
~~~

which is evaluated 5 times faster in V8, 7 times in SpiderMonkey, and 2 times in JavaScriptCore.

Please uncomment the following code snippet, in order to check how much time it takes on your browser:

~~~klipse
(comment (time (reduce + (map inc (map inc (range (* 1024 1024)))))))
~~~

# Improved re-seq Performance

`re-seq` performance has been improved, with a speedup of 1.5 or more under major JavaScript engines.

# Optimized String Expression Concatenation

Generally, arguments supplied to the `str` function are first coerced to strings before being concatenated. With this release, unnecessary coercion is eliminated for arguments that are inferred to be of string type, leading to more compact codegen as well as a speed boost.

For example, in

~~~clojure
(defn foo [x y]
  (str (+ x y)))

(str (name :foo/bar) "-" (foo 3 2))
~~~

the last `str` expression is evaluated 3 times faster in V8 and 4 times faster in JavaSriptCore as a result of the improved codgen.


Here is how the transpiled code looks like:

~~~klipse-js
(defn foo [x y]
  (str (+ x y)))

(str (name :foo/bar) "-" (foo 3 2))
~~~

## Change List
For a complete list of updates in ClojureScript 1.10.516 see [Changes](https://github.com/clojure/clojurescript/blob/master/changes.md#1.10.516).

## Contributors

Thanks to all of the community members who contributed to ClojureScript 1.10.516:

- Anton Fonarev
- Enzzo Cavallo
- Erik Assum
- Eugene Kostenko
- Martin Kučera
- Michiel Borkent
- Oliver Caldwell
- Sahil Kang
- Thomas Heller
- Thomas Mulvaney
- Timothy Pratley
- Will Acton
