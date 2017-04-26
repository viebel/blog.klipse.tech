---
layout: post
title:  "Turing Omnibus #1: Algorithm for generating wallpapers in javascript"
description:  "An algorithm for generating wallpapers in javascript"
date:   2017-04-24 17:43:52 +0200
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

Now, we are going to code this algorithm in `javascript` and you will be able to play with it right in your browser thanks to the [interactive Klipse snippets](https://github.com/viebel/klipse).

## Preliminaries

First, we need a function that draws a color pixel on a canvas:

~~~eval-js
function drawPixel(canvas, x, y, color) {
  let ctx = canvas.getContext("2d"),
      scale = 2;
  ctx.fillStyle = color;
  ctx.fillRect(x * scale, y * scale, scale, scale)
}
~~~

Then, a function that erases a canvas i.e. color it in white:

~~~eval-js
function resetCanvas (canvas){
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width,canvas.height);
};
~~~

## Black and White Wallpaper

The algorithm is controlled by the geometry of a square: 

- its `x`-position named `a`
- its `y`-position named `b`
- the side of the square named `side`


<pre class="language-eval-js" data-preamble='let canvas=document.getElementById("canvas-1"); resetCanvas(canvas);' data-eval-idle-msec="500"><code>

function drawBwWallpaper(canvas, a, b, side){
const points = 200;
for(let i=0; i< points; i++)
for(let j=0; j< points; j++) {
const x = a + i * side/points;
const y = b + j * side/points;
const c = Math.floor(x*x + y*y);
if (c % 2 === 0) {
drawPixel(canvas, i, j, "black");
}
}
}

drawBwWallpaper(canvas, 5, 5, 9);
</code></pre>

<canvas class="canvas" id="canvas-1"></canvas>

The cool thing about this algorithm is that when we modify the side of the square, we get a completly different pattern:
<pre class="language-eval-js" data-preamble='let canvas=document.getElementById("canvas-2"); resetCanvas(canvas);' data-eval-idle-msec="500"><code>

drawBwWallpaper(canvas, 5, 5, 100)
</code></pre>
<canvas class="canvas" id="canvas-2"></canvas>


Go ahead, play with the code...

The interactive code snippets are powered by [the Klipse plugin](https://github.com/viebel/klipse).


## Three Colors

We can generate a 3-color wallpaper by calculating the remainder of `c` modulo 4 and chose a color accordingly:


<pre class="language-eval-js" data-preamble='let canvas=document.getElementById("canvas-3"); resetCanvas(canvas);' data-eval-idle-msec="500"><code>
function choseColor(c) {
  let colors = ["red", "green", "blue", "white"];
  return colors[c % 4];
}
function drawColorWallpaper(canvas, a, b, side){
  const points = 200;
  for(let i=0; i<points; i++){
    for(let j=0; j<points; j++) {
      const x = a + i * side/points;
      const y = b + j * side/points;
      const c = Math.floor(x*x + y*y);
      drawPixel(canvas, i, j, choseColor(c));
    }
  }
}
drawColorWallpaper(canvas, 5, 7, 100)
</code></pre>

<canvas class="canvas" id="canvas-3"></canvas>

Again, when we modify the side of the square, we get a completly different pattern:

<pre class="language-eval-js" data-preamble='let canvas=document.getElementById("canvas-4"); resetCanvas(canvas);' data-eval-idle-msec="500"><code>
drawColorWallpaper(canvas, 5, 7, 57)
</code></pre>

<canvas class="canvas" id="canvas-4"></canvas>


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


