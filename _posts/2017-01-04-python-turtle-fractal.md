---
layout: post
title:  "A turtle can draw fractals"
description:  "Fractals with python turtle. Hilbert filling curve. interactive python. klipse."
date:   2017-01-04 15:12:26 +0200
categories: python
thumbnail: assets/klipse.png
author: "@viebel"
guid: "4EEC3CC1-F7B5-4FE7-BF1C-265533EBFFCC"
minified_plugin: true
---

[Turtle graphics](https://docs.python.org/2/library/turtle.html) is a popular way for introducing programming to kids. It was part of the original Logo programming language developed by Wally Feurzig and Seymour Papert in 1966.

Imagine a robotic turtle starting at (0, 0) in the x-y plane. After an `import turtle`, give it the command `turtle.forward(15)`, and it moves (on-screen!) 15 pixels in the direction it is facing, drawing a line as it moves. Give it the command `turtle.right(25)`, and it rotates in-place 25 degrees clockwise.

The amazing thing is that you can draw quite very cool shapes with a couple of recursive instructions to this turtle. For instance, the [Space Filling Hilbert Curve](https://en.wikipedia.org/wiki/Hilbert_curve#Representation_as_Lindenmayer_system):

<pre><code class="language-klipse-python" data-gist-id="viebel/5349bcca144c41b8f83af39079bf59ad">
</code></pre>

You can modify the code and the turtle will immediatly restart to draw.

This article was inspired by [Lindenmayer Fractals](http://exupero.org/hazard/post/fractals/).

This interactive code snippet is powered by the [KLIPSE plugin](https://github.com/viebel/klipse).

The python code evaluation in the browser is made possible by [Skuplt](http://www.skulpt.org/).
