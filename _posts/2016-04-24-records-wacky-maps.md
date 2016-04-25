---
layout: post
title:  "In Clojure, records are wacky maps #cljklipse @viebel"
description:  "records, defrecord, clojure, clojurescript,  Michał Marczyk"
date:   2016-04-25 17:17:14 +0200
categories: clojurescript
thumbnail: assets/klipse.png
guid: "4F96220D-2B51-41AE-A092-BD7192257900"
author: "@viebel"

---

In `clojure`, records, types and protocols are parts of the fundamental building blocks of the language.

We have unveiled `defprotocol`'s secret in [a previous post]({% post_url 2016-04-09-clojurescript-protocols-secret  %}){:target="_blank"}. Now it's time to explore `defrecord`.

This article has been inspired by this great talk by Michał Marczyk: [defrecord/deftype in Clojure and ClojureScript](https://youtu.be/vZtkqDIicqI){:target="_blank"}.

Michał knows this topic very deeply as he contributed to the implementation of types, records and
protocols in `clojurescript` in 2012.

He's also the #4 contributor on `clojurescript`.

![Michal Marczyk](/assets/michalmarczyk.jpg)


We were very honoured when Michał encouraged us to write a blog post on the topic using [KLIPSE][app-url]{:target="_blank"}.

### Introduction

What is a record?

> In computer science, a record (also called struct or compound data) is a basic data structure. A record is a collection of fields, possibly of different data types, typically in fixed number and sequence. [Wikipedia](https://en.wikipedia.org/wiki/Record_(computer_science)){:target="_blank"} 

In `clojure`, `defrecord`, `deftype` and `defprotocol` were introduced in version 1.2

In `clojurescript` the persistent data structures (maps, vectors ...) are based on types, records and protocols.

### Records: creation and identity

There are 3 ways to create a record: a constructor and two factory functions: `(A.)`, `(->A)` and `(map->A)`.

You can retrieve the basis keys of the record with `getBasis` that returns a vector of basis keys as symbols.

Records of the same type and same values are equal and have the same hash code.

Records of different types are never equal (even if they have the same values).


Let's see it in action with [KLIPSE](http://app.klipse.tech/?cljs_in=(ns%20my.records%24macros)%20%0A(defmacro%20disp%20%5B%26%20forms%5D%20(cons%20%60str%20(for%20%5Bform%20forms%5D%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(defrecord%20A%20%5Bx%5D)%0A(defrecord%20B%20%5Bx%5D)%0A(def%20a%20(A.%201))%0A(def%20aa%20(map-%3EA%20%7B%3Ax%201%7D))%0A(def%20aaa%20(-%3EA%201))%0A(def%20b%20(B.%201))%0A%0A(my.records%2Fdisp%0A%20%20%5Ba%20b%5D%0A%20%20(record%3F%20a)%0A%20%20(map%20hash%20%5Ba%20aa%20aaa%20b%5D)%0A%20%20(%3D%20a%20aaa%20aa)%0A%20%20(%3D%20a%20b))&eval_only=1){:target="_blank"}:

<iframe frameborder="0" width="100%" height="450px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.records%24macros)%20%0A(defmacro%20disp%20%5B%26%20forms%5D%20(cons%20%60str%20(for%20%5Bform%20forms%5D%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(defrecord%20A%20%5Bx%5D)%0A(defrecord%20B%20%5Bx%5D)%0A(def%20a%20(A.%201))%0A(def%20aa%20(map-%3EA%20%7B%3Ax%201%7D))%0A(def%20aaa%20(-%3EA%201))%0A(def%20b%20(B.%201))%0A%0A(my.records%2Fdisp%0A%20%20%5Ba%20b%5D%0A%20%20(record%3F%20a)%0A%20%20(map%20hash%20%5Ba%20aa%20aaa%20b%5D)%0A%20%20(%3D%20a%20aaa%20aa)%0A%20%20(%3D%20a%20b))&eval_only=1">
</iframe>


In `clojurescript`, the `hash` function doesn't take the record type into account.

### Maps

At first glance, records behave like maps: keyword access, `get`, `count`, `keys` and iteration work as expected.

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.records%24macros)%0A(defmacro%20disp%20%5B%26%20forms%5D%20(cons%20%60str%20(for%20%5Bform%20forms%5D%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(defrecord%20A%20%5Bx%5D)%0A(def%20a%20(A.%201))%0A%0A(my.records%2Fdisp%0A%20%20%5B(%3Ax%20a)%20(get%20a%20%3Ay%20%22n%2Fa%22)%5D%0A%20%20%5B(keys%20a)%20(count%20a)%5D%0A%20%20(map%20(fn%20%5B%5Bk%20v%5D%5D%20%5Bk%20(inc%20v)%5D)%20a))&eval_only=1">
</iframe>

But records are not real maps. Michał called them **Wacky maps**.

### Wacky maps

Here are the differences between records and maps:

- Unlike a regular map, a record is not callable as a function.
- When you `assoc` a record you get another record.
- When you `dissoc` basis keys in a record you get a map instead of a record.
- In `clojure` boxing happens on records when you use type hints; but not in `clojurescript`. (Boxing can be avoided with type hints, if you use field access syntax and you're in a primitive-friendly context e.g. an arithmetic expression.)

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.records%24macros)%0A%0A(defmacro%20disp%20%5B%26%20forms%5D%0A%20%20(cons%20%60str%20(for%20%5Bform%20forms%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(defrecord%20A%20%5Bx%20y%5D)%0A(def%20a%20(A.%201%202))%0A%0A%0A(my.records%2Fdisp%0A%20%20(assoc%20a%20%3Az%20%22zzz%22)%0A%20%20(dissoc%20a%20%3Ax))%0A%20%20%0A&eval_only=1">
</iframe>


### Behind the scenes : defrecord's transpiled javascript code

If you are curious to see how the magic occurs in `clojurescript`, you will find it very interesting to observe and meditate around the transpiled `javascript` code of `defrecord`:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(defrecord%20A%20%5Bx%5D)&js_only=1">
</iframe>

You might find it more convenient to open [defrecord's transpiled code]( http://app.klipse.tech/?cljs_in=(defrecord%20A%20%5Bx%5D)&js_only=1){:target="_blank"} in a separate tab.

In a subsequent article, we will explore `deftype`...

Clojure & Clojurescript rock!

[app-url-static]: http://app.klipse.tech?blog=klipse&js_only=1
[app-url]: http://app.klipse.tech?blog=klipse&static-fns=true&js_only=1

