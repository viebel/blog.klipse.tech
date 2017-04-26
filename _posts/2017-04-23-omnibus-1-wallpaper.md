---
layout: post
title:  "Turing Omnibus #1: Algorithm for generating wallpapers"
description:  "An algorithm for generating wallpapers"
date:   2017-04-23 17:43:52 +0200
categories: omnibus
thumbnail: assets/klipse.png
guid: "6B7DE0A8-DB07-4707-9546-B893DDD58970"
author: "Yehonathan Sharvit"
---


I have started to read [The New Turing Omnibus](https://www.goodreads.com/book/show/964709.The_New_Turing_Omnibus) - a book that offers 66 concise, brilliantly written articles on the major points of interest in computer science theory, technology and applications.

From time to time, I will write a blog post presenting a chapter of this book.


![omnibus](/assets/omnibus-turing.jpg)

Today, I am glad to present an interactive version of Chapter 1 about algorithms in general.


## The algorithm

In order to explain what is an algorithm, the author presents a simple recipe for generating wallpapers.

Here is the recipe:

![algo](/assets/algo-wallpaper.jpg)

Now, we are going to code this algorithm in `Clojurescript` and you will be able to play with it in your browser thanks to the [interactive Klipse snippets](https://github.com/viebel/klipse).

## Preliminaries

First, we need a function that draws a color pixel on a canvas:

~~~klipse
(defn draw-pixel! [canvas x y color]
  (let [ctx (.getContext canvas "2d")
        scale 2]
    (set! (.-fillStyle ctx) color)
    (.fillRect ctx (* scale x) (* scale y) scale scale)))
~~~

Then, a function that erases a canvas i.e. color it in white:

~~~klipse
(defn reset-canvas! [canvas]
(let [ctx (.getContext canvas "2d")]
  (set! (.-fillStyle ctx) "white")
  (.fillRect ctx 0 0 (.-width canvas) (.-height canvas))))
~~~

## Black and White Wallpaper

The algorithm is controlled by the geometry of a square: 

- its `x`-position named `a`
- its `y`-position named `b`
- the side of the square named `side`


<pre class="language-klipse" data-preamble='(def canvas (js/document.getElementById "canvas-1")) (reset-canvas! canvas)' data-eval-idle-msec="500"><code>

(defn draw-bw-wallpaper! [canvas a b side]
  (let [points 200]
  (dotimes [i points]   
    (dotimes [j points]
      (let [x (+ a (* i (/ side points)))
            y (+ b (* j (/ side points))) 
            c (int (+ (* x x) (* y y)))] 
        (when (even? c)
          (draw-pixel! canvas i j "black")))))))

(draw-bw-wallpaper! canvas 5 5 9)
</code></pre>

<canvas class="canvas" id="canvas-1"></canvas>

The cool thing about this algorithm is that when we modify the side of the square, we get a completly different pattern:

<pre class="language-klipse" data-preamble='(def canvas (js/document.getElementById "canvas-2")) (reset-canvas! canvas)' data-eval-idle-msec="500"><code>
(draw-bw-wallpaper! canvas 5 5 100)
</code></pre>
<canvas class="canvas" id="canvas-2"></canvas>


Go ahead, play with the code...

The interactive code snippets are powered by [the Klipse plugin](https://github.com/viebel/klipse).


## Three Colors

We can generate a 3-color wallpaper by calculating the remainder of `c` modulo 4 and chose a color accordingly:

<pre class="language-klipse" data-preamble='(def canvas (js/document.getElementById "canvas-3")) (reset-canvas! canvas)' data-eval-idle-msec="500"><code>

(defn draw-color-wallpaper! [canvas a b side]
  (let [points 200]
    (dotimes [i points]
      (dotimes [j points]
        (let [x (+ a (* i (/ side points)))
              y (+ b (* j (/ side points)))
              c (int (+ (* x x) (* y y)))
              color  (case (mod c 4)
                       0 "red"
                       1 "green"
                       2 "blue"
                       "white")]
         (draw-pixel! canvas i j color))))))

(draw-color-wallpaper! canvas 5 7 101)
</code></pre>

<canvas class="canvas" id="canvas-3"></canvas>

Again, when we modify the side of the square, we get a completly different pattern:

<pre class="language-klipse" data-preamble='(def canvas (js/document.getElementById "canvas-4")) (reset-canvas! canvas)' data-eval-idle-msec="500"><code>
(draw-color-wallpaper! canvas 5 7 57)
</code></pre>

<canvas class="canvas" id="canvas-4"></canvas>


## Grand Finale

Someone in [reddit](https://www.reddit.com/r/Clojure/comments/67amvu/turing_omnibus_1_algorithm_for_generating/dgqn8t0/) suggested to loop over the value of `side` in order to watch all the generated wallpapers like a movie.

Here is the result:

<pre class="language-klipse" data-preamble='(def canvas (js/document.getElementById "canvas-5")) (reset-canvas! canvas)'><code>
(defonce interval (atom nil))
(defonce side (atom 0))

(def delta 0.5)
(defn step [canvas container]
  (set! (.-innerHTML container) (str "side: " @side) )
  (reset-canvas! canvas)
  (draw-color-wallpaper! canvas 5 5 (swap! side + delta)))

(.clearInterval js/window @interval)
(reset! side 0)
(reset! interval (.setInterval js/window step  500 canvas js/klipse-container)) 
</code></pre>

<canvas class="canvas" id="canvas-5"></canvas>

Are you able to provide a simple explanation about this algorithm?

How is it able to generate so many different beautiful patterns?

Have you found a magnificient pattern? Please share its code...

<style>
.canvas {
padding: 10px;
width: 700px;
height: 300px;
}
</style>


