---
layout: post
title:  How to draw on a canvas with Klipse and core.async
description:  How to draw on a canvas with Klipse and core.async
date:   2020-09-09 09:12:22 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: 7950F54A-4378-4B56-921E-0F75B0AE3809
author: Yehonathan Sharvit
---


The cool thing with Klipse is that it is 100% client-side.
It means that you can interact freely with the page where the Klipse snippets are hosted. As an example, you can draw on a canvas. All you need to do is to add in your html a `<canvas>` element and refer it from your Klipse snippet.


## Boring fillRect

Let's start with a simple `fillRect` manipulation:

~~~klipse
(let [canvas (js/document.getElementById "canvas-1")
      ctx (.getContext canvas "2d")
      width (.-width canvas)
      height (.-height canvas)]
  (set! (.-fillStyle  ctx) "red")
  (.clearRect ctx 0 0 width height)
  (.fillRect ctx 0 0 width height))
~~~

<canvas id="canvas-1" width="500" height="300"></canvas>


## Random color


~~~klipse
(let [canvas (js/document.getElementById "canvas-2")
      ctx (.getContext canvas "2d")
      width (.-width canvas)
      height (.-height canvas)
      colors ["red" "blue" "green" "yellow" "magenta" "purple" "pink"]]
  (set! (.-fillStyle  ctx) (rand-nth colors))
  (.clearRect ctx 0 0 width height)
  (.fillRect ctx 0 0 width height))
~~~

<canvas id="canvas-2" width="500" height="300"></canvas>

Each time you press `Ctrl-Enter` inside the snippet, the color is randomly picked.

Wouldn't it be cool to evaluate the snippet automatically every second or so?

## Random color in a loop

Let's run the same Klipse snippet in a loop - by setting `data-loop-msec="1000"` attribute of the DOM element that contains the snippet (look at the page source!):

<pre><code class="language-klipse" data-loop-msec="1000">
(let [canvas (js/document.getElementById "canvas-3")
      ctx (.getContext canvas "2d")
      width (.-width canvas)
      height (.-height canvas)
      colors ["red" "blue" "green" "yellow" "magenta" "purple" "pink"]]
  (set! (.-fillStyle  ctx) (rand-nth colors))
  (.clearRect ctx 0 0 width height)
  (.fillRect ctx 0 0 width height))
</code></pre>

<canvas id="canvas-3" width="500" height="300"></canvas>


## Core.async

With `core.async` you can do really cool stuff - like having a progress bar:

First, let's require `core.async` (It takes a bit of time...):

~~~klipse
(ns my.canvas
  (:require [cljs.core.async :refer [go go-loop <! timeout]]))
~~~

<canvas id="canvas-4" width="500" height="50"></canvas>

<pre><code class="language-klipse" data-eval-idle-msec="10000000">
(let [canvas (js/document.getElementById "canvas-4")
      ctx (.getContext canvas "2d")
      width (.-width canvas)
      height (.-height canvas)]
  (.clearRect ctx 0 0 width height)
  (set! (.-fillStyle  ctx) "green")
  (go-loop [percentage 0]
           (when (<= percentage 100)
             (<! (timeout 200))
             (.fillRect ctx 0 (/ height 2) (/ (* width percentage) 100) 10)
             (recur (+ percentage 10)))))
</code></pre>

It's a bit tricky to use `core.async` inside Klipse because once a snippet is evaluated it runs forever. That might cause a lot of confusion if several versions of the snippet run in parallel.

In our `core.async` snippet, we have set `data-eval-idle-msec="10000000"` which means that the snippets will run automatically only after 10000 seconds of idleness or when you press `Ctrl-Enter`.

That's it!
Enjoy your interactive drawings...


