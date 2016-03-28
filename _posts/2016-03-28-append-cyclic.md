---
layout: post
title:  "Clojure Append Cyclic"
date:   2016-03-28 12:31:46 +0200
categories: clojure
thumbnail: assets/klipse.png
description: "Clojure Append Cyclic"
---

In this article, we present an interesting function named `append-cyclic`.

Let's say, you want to log events but you don't want to limit the memory consumption. Let's say you want to store the 1000 last events of your system.

In clojure, it's really easy to achieve that:

1. you initialize a vector of size 1000 (e.g 1000 times `nil`)
2. on each `append`, you remove the first (the oldest) element

Let's see it in action with [KLIPSE][app-url]{:target="_blank"}:

<iframe frameborder="0" width="100%" height="300px"
    src="http://app.klipse.tech/?eval_only=1&cljs_in=(defn%20append-cyclic%5Blst%20a%5D%0A%20%20(concat%20(rest%20lst)%20%5Ba%5D))%0A%0A%0A(-%3E%20(repeat%203%20nil)%0A%20%20%20%20(append-cyclic%20%209)%0A%20%20%20%20(append-cyclic%20%2010)%0A%20%20%20%20(append-cyclic%20%2011)%0A%20%20%20%20(append-cyclic%20%2012))">
</iframe>


On each call to `append-cyclic`, the first element of the vector is removed and the new element is appended at the end of the vector.

Simple as Clojure!

[app-url]: http://app.klipse.tech
