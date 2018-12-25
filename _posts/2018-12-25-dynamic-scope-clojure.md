---
local_klipse: false
layout: post
title:  Lazy sequences are not compatible with dynamic scope
description:  In functional pogramming, Lazy sequences are not compatible with dynamic scope
date:   2018-12-25 10:12:24 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "E080D107-A451-4190-9F1C-2EDE2F24C52A"
author: Yehonathan Sharvit
---



Lazy sequences are a great invention of functional programming.

Dynamic scope is a great invention of functional programming.

But, when you combine lazy sequnces with dynamic scope you get a complex behaviour.

This inherent complexity has been clarifed to me while reading [Elements of Clojure](https://leanpub.com/elementsofclojure/), definitely a great book!

After all, it's not a big surprise: in the real life, laziness and dynamism are quite opposite.


![laziness](/assets/laziness.png){:width="1000px"}


Before dealing with this complexity, let's see how lazy sequences live in peace with lexical scope.

In Clojure, the `map` function returns a lazy sequence consisting of the result of applying a function to the items of a collection. 

In the following code snippet, our collection is the array `[1 2 3]` and our function always returns `my-value` which is part of the lexical scope specify by the `let` macro.

In this scenario, `map` behaves in a simple way: it takes `my-value` from the lexical scope and its value is 1. The global variable `my-value` is overriden by the local binding of `my-value`:

~~~klipse
(def my-value 42)
(def my-lexical-scope-map
  (let [my-value 1]
    (mapv (fn [_] my-value) [1 2 3])))

(first my-lexical-scope-map)
~~~

So far so good.


But with dynamic scope, things get much more complicated.
Let's map again over the `[1 2 3]` array, this time with a dynamic variable `*my-value*` that is overriden by the `binding` macro:

~~~klipse
(def ^:dynamic *my-value* 42)
(def my-dynamic-scope-map (binding [*my-value* 1]
              (map (fn [_] *my-value*) [1 2 3])))

(first my-dynamic-scope-map)
~~~

In this situation, the value of the first element of the map is: `42`. It seems like the `binding` macro had no effect. This is a complex behaviour. If we use `mapv` instead of `map`, we get the same behaviour as with the lexical scope:


~~~klipse
(def my-value 42)
(def my-dynamic-scope-vector
  (binding [*my-value* 1]
    (mapv (fn [] *my-value*) [1 2 3])))
(first my-dynamic-scope-vector)
~~~

This complex idea is that lazy sequences relies on [referential transparency](https://en.wikipedia.org/wiki/Referential_transparency), which formally means that an expres sion and its result are interchangeable. Dynamic scope breaks referential transparency.

The reason `map` and `mapv` behave differently is because `map` returns a lazy sequence, while `mapv` returns a vector. The lazy sequence elements are evaluates outside of the dynamic scope: therefore `(first my-dynamic-scope-map)` is `42`, while the vector elements are evaluates in the dynamic scope: therefore `(first my-dynamic-scope-vector)` is `1`.


Clojure supports dynamic scope for convenience reason. For instance, in the case of testing, dynamic scope allows us to easilly mock a function. But this comes at a price. Dynamic scope is definitely not simple. 

Beware of the inherent complexity of dynamic scope, each time, you rely on dynamic scope.








