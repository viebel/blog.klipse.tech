---
layout: post
title:  "A turtle can draw fractals"
description:  "Fractals with python turtle. Hilbert filling curve. interactive python. klipse."
date:   2017-01-04 15:12:26 +0200
categories: python
thumbnail: assets/klipse.png
author: Yehonathan Sharvit
guid: "4EEC3CC1-F7B5-4FE7-BF1C-265533EBFFCC"
minified_plugin: true
tags: [python]
---

[Turtle graphics](https://docs.python.org/2/library/turtle.html) is a popular way for introducing programming to kids. It was part of the original Logo programming language developed by Wally Feurzig and Seymour Papert in 1966.

Imagine a robotic turtle starting at (0, 0) in the x-y plane. After an `import turtle`, give it the command `turtle.forward(15)`, and it moves (on-screen!) 15 pixels in the direction it is facing, drawing a line as it moves. Give it the command `turtle.right(25)`, and it rotates in-place 25 degrees clockwise.

(The uniqueness of this article is that it features an interactive python code snippet inside a regular blog post. This is done by a tool of mine named [KLIPSE](https://github.com/viebel/klipse) - a multi-language evaluator pluggable on any web page.)

The amazing thing about Python Turtle is that you can draw quite very cool shapes with a couple of recursive instructions to this turtle. For instance, the [Space Filling Hilbert Curve](https://en.wikipedia.org/wiki/Hilbert_curve#Representation_as_Lindenmayer_system):

<pre><code class="language-klipse-python" data-gist-id="viebel/5349bcca144c41b8f83af39079bf59ad">
</code></pre>

Go ahead, modify the code (the depth, the step or anything else) and the turtle will immediatly restart to draw.

Can you draw other cool shape with the turtle? Please share your code and screenshots on the comments below or on twitter...

This article was inspired by [Lindenmayer Fractals](http://exupero.org/hazard/post/fractals/).

If you want to write your own blog post with interactive code snippets in python, you shoulde checkout the  [KLIPSE plugin documentation and usage](https://github.com/viebel/klipse): it is a simple javascript tag that you add to your page.

The python code evaluation in the browser is made possible by [Skulpt](http://www.skulpt.org/).
