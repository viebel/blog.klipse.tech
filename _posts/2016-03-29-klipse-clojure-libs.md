---
layout: post
title:  "KLIPSE: Clojure libs are now available!"
date:   2016-03-28 18:57:46 +0200
categories: clojure
thumbnail: assets/klipse.png
description: "Clojure libs are now available inside KLIPSE"
---

Let's talk about a new pretty feature in [KLIPSE][app-url]{:target="_blank"}!

All your favorite clojure libraries you are using everyday in your development are now available inside KLIPSE.

Check that in KLIPSE:

<iframe frameborder="0" width="100%" height="300px"
    src="http://app.klipse.tech/?cljs_in=(ns%20my-ns%0A%20%20(%3Arequire%20%0A%20%20%20%20%5Bclojure.string%20%3Aas%20string%5D))%0A%0A(string%2Fblank%3F%20%22HELLO!!%22)&eval_only=1">
</iframe>

For the moment `:require-macros`, `use-macros` and `:refer` not working but we actively working on that.

[app-url]: http://app.klipse.tech