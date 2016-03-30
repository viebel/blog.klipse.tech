---
layout: post
title:  "Measuring performance clojurescript with KLIPSE"
description:  "Measuring performance clojurescript with KLIPSE"
date:   2016-03-29 10:12:36 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "F043D871-9E0C-4CD6-B80E-067D97B0E85A"
---

Let's say that you want to profile a piece of code in clojurescript. 
There is a cool macro for that in clojurescript: [time](https://clojuredocs.org/clojure.core/time){:target="_blank}.

>`time` evaluates an expression and prints the time it took and returns the value of the expression.


The interesting question is:

> Where does `time` print the time it took?

Usually, it prints in the browser console. This is because, you have probably called `(enable-console-print!)` somewhere in your code.

But as a [KLIPSE][app-url-js]{:target="_blank"} user, you want the time to be displayed in the evaluation rectangle instead of inside the console.

It's simple to achieve that using [with-out-str](https://clojuredocs.org/clojure.core/with-out-str){:target="_blank}.

Let's see it in action by comparing the running time of two naive implementations for prime number generation:


<iframe frameborder="0" width="100%" height="600px"
    src= 
    "http://app.klipse.tech/?eval_only=1&cljs_in=(defn%20is-prime%3F%20%5Bn%5D%0A%20%20(empty%3F%20(filter%20%23(%3D%200%20(mod%20n%20%20%25))%20(range%202%20n))))%0A%0A(defn%20nth-prime%20%5Bn%5D%0A%20%20(last%20(take%20n%20(filter%20%23(is-prime%3F%20%25)%20(iterate%20inc%202)))))%0A%0A%0A%0A(defn%20is-prime-opt%3F%20%5Bn%5D%0A%20%20(or%20(%3D%202%20n)%0A%20%20%20(not-any%3F%20%23(%3D%200%20(mod%20n%20%25))%20(range%203%20(inc%20(Math%2Fsqrt%20n))%202))))%0A%0A(defn%20nth-prime-opt%20%5Bn%5D%0A%20%20(last%20(take%20n%20(filter%20%23(is-prime%3F%20%25)%20(cons%202%20(iterate%20(partial%20%2B%202)%203))))))%0A%0A%0A%5B(with-out-str%20(time%20(nth-prime%2050)))%0A%20(with-out-str%20(time%20(nth-prime-opt%2050)))%5D%0A">
    </iframe>


[app-url-js]: http://app.klipse.tech?js_only=1

