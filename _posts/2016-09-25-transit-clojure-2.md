---
layout: post
title:  "Transit format: An interactive tutorial -  custom types and caching (part 2)"
description:  "Transit format: An interactive tutorial -  custom types and caching (part 2)"
date:   2016-09-22 15:22:54 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "2BAE417C-E63F-4D47-86B9-365E569DEA63"
author: "@viebel"
---

# What is Transit?

In our [previous article]({% post_url 2016-09-25-transit-clojure %}), we introduced [Transit](https://github.com/cognitect/transit-format).

Basically, `Transit` is a format and set of libraries for conveying values between applications written in different programming languages.


Transit provides:

- a set of basic elements
- a set of extension elements for representing typed values.

In this article, we are going to show:

- how to write readers and writers to deal with custom types
- how `Transit` supports compression via caching of repeated elements, e.g., map keys, that can significantly reduce payload size and decoding time, as well as memory in the resulting application representation.

Read more about [Transit](https://github.com/cognitect/transit-format).

![Sandbox](/assets/transit_ford.jpg)

# Code examples please

All the above is very very abstract. Let's code some examples. As usual, the code snippets are interactive: feel free to modify the code in order to get a better feeling of the concepts.


In this article, we are going to use [transit-cljs](https://github.com/cognitect/transit-cljs/) to illustrate `Transit` format.


First, let's require `transit`:

<pre>
<code class="language-klipse" data-external-libs="https://raw.githubusercontent.com/cognitect/transit-js/master/src/,https://raw.githubusercontent.com/cognitect/transit-cljs/master/src/">
(ns my.transit
  (:require [cognitect.transit :as t]))
</code>
</pre>


One of the biggest drawbacks of `JSON` as a data format is the lack of extensibility. `Transit` allows users to customize both reading and writing.


Let's say that we have a type `Rational` for rational numbers. Something like this:

~~~klipse
(defrecord Rational [numerator denominator])
~~~

# Writer - customization

Now, let's see how to write a `Transit` writer that serializes the `Rational` values:

~~~klipse
(deftype ^:no-doc RationalHandler []
  Object
    (tag [_ v] "rational")
      (rep [_ v] #js [(:numerator v) (:denominator v)])
        (stringRep [_ v] nil))

(def rational-handler (RationalHandler.))
(def rational-writer (t/writer :json {:handlers {Rational rational-handler}}))
~~~

And here is the represantation of a `Rational`:

~~~klipse
(t/write rational-writer [(Rational. 2 3)])
~~~


# Reader - customization

Now, let's see how to write a `Transit` reader for `Rational` values:

~~~klipse
(def rational-reader (t/reader :json
                               {:handlers
                                {:rational (fn [[a b]] (->Rational a b))}}))
~~~

Let's read an array of  `Rational` values:

~~~klipse
(t/read rational-reader "[ [\"~#rational\", [3,4]], [\"~#rational\", [2,5]]]")
~~~


Now, let's check that we have closed the loop properly:


~~~klipse
(def y [(Rational. 2 3)])
(= y (t/read rational-reader (t/write rational-writer y)))
~~~

And the other direction:

~~~klipse
(def x "[\"~#rational\",[3,4]]")
(= x (t/write rational-writer (t/read rational-reader x)))
~~~

# Caching

In `Transit`, repeated keys in a map are cached. Therefore the payload doesn't depend much on the length of the keys.

Let's create a `JSON` reader and writer:

~~~klipse
(def r (t/reader :json))
(def w (t/writer :json))
~~~


Let's see how repeated keys in maps are encoded:

~~~klipse
(def some-ids [{:id 1} {:id 2} {:id 3}])

(t/write w some-ids)
~~~

Obvioulsy, we can read it back:

~~~klipse
(t/read r (t/write w some-ids))
~~~


The length of the encoded string almost doesn't increase, when the length of the keys increases.

First with a short key:

~~~klipse
(def n 100)
(def key :abc)
(def many-ids (for [x (range n)] {key n}))

(count (t/write w many-ids))
~~~

And now with a long key:

~~~klipse
(def n 100)
(def key :abcdefghijklmnop)
(def many-ids (for [x (range n)] {key n}))

(count (t/write w many-ids))
~~~


Increase the length of the key, and see how the length of the encoded string stays almost the same.

Pretty cool. Right?

Clojure[script] rocks!
