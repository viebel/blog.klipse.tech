---
layout: post
title:  "Clojure Append Cyclic"
date:   2016-03-28 12:31:46 +0200
categories: clojure
thumbnail: assets/klipse.png
description: "Clojure Append Cyclic"
---

## Introduction
In this article, we present an interesting function named `append-cyclic`.

Let's say, you want to log events but you don't want to limit the memory consumption. Let's say you want to store the 1000 last events of your system.

In clojure, it's really easy to achieve that:

1. you initialize a vector of size 1000 (e.g 1000 times `nil`)
2. on each `append`, you remove the first (the oldest) element


## Naive Implementation

Let's see it in action with [KLIPSE][app-url]{:target="_blank"}:

<iframe frameborder="0" width="100%" height="300px"
    src="http://app.klipse.tech/?eval_only=1&cljs_in=(defn%20append-cyclic%5Blst%20a%5D%0A%20%20(concat%20(rest%20lst)%20%5Ba%5D))%0A%0A%0A(-%3E%20(repeat%203%20nil)%0A%20%20%20%20(append-cyclic%20%209)%0A%20%20%20%20(append-cyclic%20%2010)%0A%20%20%20%20(append-cyclic%20%2011)%0A%20%20%20%20(append-cyclic%20%2012))">
</iframe>


On each call to `append-cyclic`, the first element of the vector is removed and the new element is appended at the end of the vector.

## Efficient implementation

Now, let's improve our code from a performace perspective, by using a FIFO queue - `PersistentQueue` - instead of lists, as it was suggested by [Jozef Wagner](https://disqus.com/by/jozefwagner/){:target="blank"}.

<iframe frameborder="0" width="100%" height="300px"
    src="http://app.klipse.tech/?eval_only=1cljs_in=(defn%20queue%0A%20%20%5Bsize%5D%0A%20%20(into%20(PersistentQueue.)%20(repeat%20size%20nil)))%0A%0A(defn%20append-cyclic-queue%0A%20%20%5Bqueue%20x%5D%0A%20%20(pop%20(conj%20queue%20x)))%0A%0A%0A(-%3E%20(queue%203)%0A%20%20%20%20(append-cyclic-queue%20%209)%0A%20%20%20%20(append-cyclic-queue%20%2010)%0A%20%20%20%20(append-cyclic-queue%20%2011)%0A%20%20%20%20(append-cyclic-queue%20%2012))">
</iframe>


## Performance comparison
Here is a perfomance comparison of the two approaches using [KLIPSE][app-url]{:target="_blank"}. (Read more about [Performance comparison with KLIPSE]({% post_url 2016-03-29-profiling %})).

You see that the queue based approach is much must faster.

<iframe frameborder="0" width="100%" height="600px"
  src="http://app.klipse.tech/?eval_only=1&cljs_in=(defn%20append-cyclic-concat%20%5Blst%20a%5D%0A%20%20(concat%20(rest%20lst)%20%5Ba%5D))%0A%0A(defn%20queue%0A%20%20%5Bsize%5D%0A%20%20(into%20(PersistentQueue.)%20(repeat%20size%20nil)))%0A%0A(defn%20append-cyclic-queue%0A%20%20%5Bqueue%20x%5D%0A%20%20(pop%20(conj%20queue%20x)))%0A%0A%0A(defn%20run%20%5Bq%20iterations%20func%5D%0A%20%20(loop%20%5Bn%200%20%0A%20%20%20%20%20%20%20%20%20q%20q%5D%0A%20%20%20%20(if%20(%3C%20n%20iterations)%0A%20%20%20%20%20%20(recur%20(inc%20n)%20(func%20q%20n))%0A%20%20%20%20%20%20q)))%0A%0A%0A%5B(with-out-str%0A%20%20(time%20(run%20(queue%20100)%201000%20append-cyclic-queue)))%0A%20(with-out-str%0A%20%20(time%20(run%20(queue%20100)%201000%20append-cyclic-concat)))%5D%0A%0A%0A%20%20%20%20%20%20">
</iframe>

## Clojure vs. Clojurescript
Almost, all the code presented here is portable between `clojure` and `clojurescript`, except the code for the queue creation.

If you want to use the queue based implementation in `clojure`, you have to create the queue with a slighlty diffent syntax:

~~~ clojure
(clojure.lang.PersistentQueue/EMPTY)
~~~

[app-url]: http://app.klipse.tech
