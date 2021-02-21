---
layout: post
title:  Manipulating the DOM with Clojure using Klipse
description:  Manipulating the DOM with Clojure using Klipse
date:   2020-09-10 06:11:22 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: DDCFAC15-C7D2-4942-9BD1-D4A31B172986
author: Yehonathan Sharvit
tags: [klipse]
---


The [Klipse plugin](https://github.com/viebel/klipse) is a **client-side** code evaluator. 

This means that inside a web page, you are not limited to manipulate data, but you can also manipulate the DOM.

In this article we will show 4 approaches for manipulating the DOM with Clojure using [Klipse](https://github.com/viebel/klipse):

- `reagent`
- the Klipse container
- the `html` editor type
- a custom DOM element


## 1. Reagent

~~~eval-clj
(require '[reagent.core :as r])
~~~

~~~reagent
[:div
  "Hello "
  [:strong "World!"]]
~~~

For a full explanation about using `reagent` inside Klipse, have a look at [Interactive reagent snippets](http://blog.klipse.tech/reagent/2016/12/31/reagent-in-klipse.html).

And if you want very cool material about `reagent`, read this [series of reagegent deep dive](http://timothypratley.blogspot.co.il/2017/01/reagent-deep-dive-part-1.html) and [How to use a charting library in Reagent](http://ingesolvoll.github.io/2017/01/01/how-to-use-a-charting-library-in-reagent.html).


## 2. The Klipse container

Each Klipse snippet is associated with a container -  a `DOM` element that is just below the Klipse snippet and accessible with `js/klipse-container` and `js/klipse-container-id`:

~~~eval-clj
(set!
 (.-innerHTML js/klipse-container)
 "<div style='color: blue;'> Hello <b>Container</b>!</div>")
~~~

~~~eval-clj
(set!
  (.-innerHTML (js/document.getElementById js/klipse-container-id))
  "<div style='color: red;'> Hello <b>Container Id</b>!</div>")
~~~

## 3. Html editor type

You can also have a Klipse snippet with `data-editor-type="html"`: the evaluation of the snippet will be the `innerHTML` of the result box.

<pre><code class="language-eval-clj" data-editor-type="html">
"Hello &lt;strong&gt;HTML editor&lt;/strong&gt;"
</code></pre>

## 4. A custom DOM element

Another thing you can do is to add a DOM element to you page (a `div` a `canvas` or anything you want) and to manipulate it with your klipse snippet.

In this page we have inserted a `<div id="my-custom-container">`  just above the Klipse snippet.

<div id="my-custom-container"></div>

~~~eval-clj
(set!
  (.-innerHTML (js/document.getElementById "my-custom-container"))
  "<div style='color: green;'> Hello <b>Custom Container</b>!</div>")
~~~

There are a couple of blog posts with lots of creative stuff using this approach:

- [An Island Generator](http://exupero.org/hazard/post/islands/)
- [Procedural Dungeon Generation: A Drunkard's Walk in ClojureScript](http://blog.jrheard.com/procedural-dungeon-generation-drunkards-walk-in-clojurescript)
- [Lindenmayer Fractals](http://exupero.org/hazard/post/fractals/)
