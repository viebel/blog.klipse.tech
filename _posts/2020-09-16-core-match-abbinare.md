---
layout: post
title:  Core.match available for self hosted ClojureScript (Planck and Klipse)
description: Core.match available for self hosted ClojureScript (Planck and Klipse). In the browser.
date:   2020-09-16 15:21:32 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: 9E48E40A-624B-4A1C-9F04-AB0E58F3223B
author: Yehonathan Sharvit
tags: [clojure]
---


[core.match](https://github.com/clojure/core.match) - A pattern matching library for Clojure[script] - is  available for self-hosted `ClojureScript`. It means that it can run in [Planck](https://github.com/mfikes/planck) and [Klipse](https://github.com/viebel/klipse).

The code is available as a [fork](https://github.com/viebel/abbinare) of `core.match` called `abbinare`.

The approach is similar to what Mike Fikes did for `core.async` with [andare](https://github.com/mfikes/andare).

Both names comes from italian: "andare" means "go" and "abbinare" means match (in the sense of combine).

![match](/assets/match.jpg)


In order to use `core.match` in Klipse, simply require it and Klipse will fetch `abbinare` code from its [analysis cache repository](https://viebel.github.io/cljs-analysis-cache/cache/):

<pre><code class="language-klipse">
(require '[cljs.core.match :refer-macros [match]])
</code></pre>

In order to use `core.match` in Planck, add `abbinare` as a dependency with:

~~~
 [viebel/abbinare "1.10.597"]
~~~


Here is a quick demo - running in your browser - of a solution to the famous [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) interview question with `core.match`:

~~~klipse
(with-out-str (doseq [n (range 1 11)]
  (println
    (match [(mod n 3) (mod n 5)]
           [0 0] "FizzBuzz"
           [0 _] "Fizz"
           [_ 0] "Buzz"
           :else n))))
~~~


Want more `core.match` cool stuff in your browser? Read this [core.match interactive tutorial]({% post_url 2016-10-25-core-match %}).
