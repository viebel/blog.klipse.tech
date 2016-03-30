---
layout: post
title:  "Destructuring in Clojure - Part 1"
title:  "Destructuring in Clojure - Part 1"
date:   2016-03-30 19:21:46 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "E1D50DFC-9C61-4EC8-AA69-C6203C38CCBC"

---

## Introduction

Basically, destructuring allows you to create local bindings in a very succint (and elegant) syntax.

In this article, we will demonstrate the basics of destructuring in clojure, using [KLIPSE][app-url]{:target="_blank"}.

## Destructuring a vector

The simplest example is destructuring the first `n` values of a vector:
<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?eval_only=1&cljs_in=(def%20point%20%5B5%207%5D)%0A%0A(let%20%5B%5Bx%20y%5D%20point%5D%0A%20%20%20%20%7B%3Ax%20x%0A%20%20%20%20%20%3Ay%20y%7D)&eval_only=1">
</iframe>


A more advanced example is splitting a vector into a `head` and a `tail`:
<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(def%20indexes%20%5B1%202%203%5D)%0A%0A(let%20%5B%5Bx%20%26%20more%5D%20indexes%5D%0A%20%20%7B%3Ax%20x%20%3Amore%20more%7D)&eval_only=1">
</iframe>

It's also worth noting that you can bind the entire vector to a local using the `:as` directive.


<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(def%20indexes%20%5B1%202%203%5D)%0A%0A(let%20%5B%5Bx%20%26%20more%20%3Aas%20full-list%5D%20indexes%5D%0A%20%20%7B%3Ax%20x%20%3Amore%20more%20%3Afull-list%20full-list%7D)&eval_only=1">
</iframe>


## Destructuring a map

Simple destructuring on a map is as easy as choosing a local name and providing the key.

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(def%20point%20%7B%3Ax%205%20%3Ay%207%7D)%0A%0A(let%20%5B%7Bthe-x%20%3Ax%20the-y%20%3Ay%7D%20point%5D%0A%20%20%20%20%20%20%20%20%20%7B%3Ax%20the-x%20%3Ay%20the-y%7D)&eval_only=1">
</iframe>

As the example shows, the values of `:x` and `:y` are bound to locals with the names `the-x` and `the-y`.

Usually, you want to create locals with the same name as the keys of the map.

In this case, the syntax becomes even simpler, using the `:keys` directive:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(def%20point%20%7B%3Ax%205%20%3Ay%207%7D)%0A%0A(let%20%5B%7B%3Akeys%20%5Bx%20y%5D%7D%20point%5D%0A%20%20(%2B%20x%20y))&eval_only=1">
</iframe>

As with vectors, you can bind the entire map to a local using the `:as` directive.

Here is how to combine `:keys` and `:as`.

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(def%20point%20%7B%3Ax%205%20%3Ay%207%7D)%0A%0A(let%20%5B%7B%3Akeys%20%5Bx%20y%5D%20%3Aas%20the-map%7D%20point%5D%0A%20%20%5Bx%20y%20the-map%5D)&eval_only=1">
</iframe>


In the next article, we will show more advanced usages og destructuring in clojure.

[app-url]: http://app.klipse.tech

