---
layout: post
title:  "KLIPSE: Clojure libs are now available!"
date:   2016-03-29 18:57:46 +0200
categories: clojure
thumbnail: assets/klipse.png
description: "Clojure libs are now available inside KLIPSE"
author: "@RaphaelBoukara"
---

Let's talk about a new pretty feature in [KLIPSE][app-url]{:target="_blank"}!

Now KLIPSE use [replumb][replumb-url] to eval the clojurescript code. 
All your favorite clojure libraries you are using everyday in your development are now available inside KLIPSE.

Check that in KLIPSE:

~~~klipse
(ns my-ns
  (:require 
      [clojure.string :as string]))

(string/blank? "HELLO!!")
~~~

For the moment `:require-macros`, `use-macros` and `:refer` are not supported but we actively working on that.

Another cool feature is that you can use all the KLIPSE's project dependencies. For example you can use replumb functions in KLIPSE!

~~~klipse
(ns my.ns
  (:require 
      [replumb.core :as replumb]))

(replumb/read-eval-call {} identity "(+ 2 3)")
~~~


[app-url]: http://app.klipse.tech
[replumb-url]: https://github.com/Lambda-X/replumb
