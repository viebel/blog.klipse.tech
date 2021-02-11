---
layout: post
title:  "Transit format: An interactive tutorial - better than JSON (part 1)"
description:  "Transit format: An interactive tutorial - better than JSON (part 1)"
date:   2016-09-22 14:22:54 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "c10c83f6-832e-11e6-9843-600308a46268"
author: Yehonathan Sharvit
tags: [clojure]
---

# What is Transit?
[Transit](https://github.com/cognitect/transit-format) is a format and set of libraries for conveying values between applications written in different programming languages.


Transit provides:

- a set of basic elements
- a set of extension elements for representing typed values.

The extension mechanism is open, allowing programs using `Transit` to add new elements specific to their needs. It constrats with traditional formats where usually users of data formats must rely on one of the following:

- schemas
- convention
- context

to convey elements not included in the base set, making application code much more complex.

`Transit` is designed to be implemented as an encoding on top of formats for which high performance processors already exist, specifically `JSON` and `MessagePack`. Transit uses these formats' native representations for built-in elements, e.g., strings and arrays, wherever possible. Extension elements which have no native representation in these formats, e.g., dates, are represented using a tag-based encoding scheme. It makes `Transit` a self-describing and extensible format.


Read more about [Transit](https://github.com/cognitect/transit-format).

![Sandbox](/assets/transit.jpg)

# Code examples please

All the above is very very abstract. Let's code some examples.

In this article, we are going to use [transit-cljs](https://github.com/cognitect/transit-cljs/) to illustrate `Transit` format.


As usual, the code snippets are interactive - powered by [the KLIPSE plugin](https://github.com/viebel/klipse). Feel free to modify the code in order to get a better feeling of the concepts.

First, let's require `transit`:

~~~klipse
(ns my.transit
  (:require [cognitect.transit :as t]))
~~~

Now, we can play with `transit`...

Let's create a `JSON` reader and writer:

~~~klipse
(def r (t/reader :json))
(def w (t/writer :json))
~~~


And let's see them in action:

# Reader - basics

The reader receives a string in `json` format, and returns a clojure object:


Any type supported in `json` can go in...

Arrays, numbers, unicode strings, booleans, `null`:

~~~klipse
(t/read r "[1, \"2\", null, true, \"\u03BB\"]")
~~~

and obviously objects:


~~~klipse
(t/read r "{\"a\": 1, \"b\": [1, 2.2, 2e5, null]}")
~~~


# Writer - basics

The writer is the opposite of the writer: it receives a `clojure` object and returns a string in `json` format:

Let's write a `clojure` array:

~~~klipse
(t/write w [1 1.2e4 "2" nil true])
~~~

And a `clojure` object:

~~~klipse
(t/write w {"a" 1, "b" [1 2.2 200000 nil]})
~~~


# Additional types

The interest of `transit` is that it supports additional types that are not supported in `JSON` like: keywords, symbols, dates, sets, lists:

Let's see how keywords are encoded:

~~~klipse
(t/write w [:aaa :bbb :my.ns/bbb ::aaa])
~~~

Symbols:

~~~klipse
(t/write w ['aa 'bb])
~~~

Dates:

~~~klipse
(t/write w [(js/Date) #inst "2016-09-22T18:27:18.001-00:00"])
~~~

Sets:

~~~klipse
(t/write w #{1 2 3})
~~~

UUIDs: 

~~~klipse
(t/write w (random-uuid))
~~~


Each of the above strings can be decoded back into a `clojure` object with the writer:

~~~klipse
(t/read r (t/write w [(js/Date) #inst "2016-09-22T18:27:18.001-00:00"]))
~~~

~~~klipse
(t/read r (t/write w #{1 2 3}))
~~~

# Any keys in an object

JSON suports only strings in keys. However in `clojure`, any type can be a key in a `map`. It means that we cannot truly serialize a `clojure` map. Usually, the trick is to convert types into strings. Like this:

~~~klipse
(def array-key-map {[1 2] "cool"})
(-> array-key-map
    clj->js
        js/JSON.stringify)
~~~

But when we read the string back, we don't get the original object:

~~~klipse
(-> array-key-map
 clj->js
 js/JSON.stringify
 js/JSON.parse
 js->clj)
~~~

`Transit` solves this problem by encoding the types:

~~~klipse
(t/write w array-key-map)
~~~

And the roundtrip is safe:

~~~klipse
(t/read r (t/write w array-key-map))
~~~



In our [next article]({% post_url 2016-09-25-transit-clojure-2 %}) , we are going to show how `Transit` deals with custom handlers and caching. You will see that in some cases, `Transit` is more efficient that `JSON`!
