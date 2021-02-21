---
layout: post
title: A new way of blogging about Ocaml
description:  blogging klipse Ocaml live examples code snippets
date:   2017-10-05 15:12:28 +0200
categories: ocaml
thumbnail: assets/klipse.png
guid: 7DB6EA6C-B7E5-4398-81BD-B9A4F501DF8A
author: Yehonathan Sharvit
minified_plugin: true
tags: [klipse, ocaml]
---

This blog post is about to show a new way of blogging about [OCaml](https://ocaml.org/).

Look at a typical blog post or tutorial about any programming language: The article usually presents a couple of code snippets. As I see it, there are two pains with code snippets:

1. they contain the input and the output but not the actual evaluation of the input
2. it's impossible for the reader to modify the output

# The forgotten dream

A long time ago, all the developers had a common dream. The dream was about interactivity, liveness, evaluation...

But we put this dream aside - because the browser understands only `javascript`.

And after a while, we even forgot that we ever had this dream.


Still, there are some people that didn't forget this dream, like Alan Kay:

>Question: Well, look at Wikipedia — it's a tremendous collaboration.

>Alan Kay: It is, but go to the article on [Logo](https://en.wikipedia.org/wiki/Logo_(programming_language)), can you write and execute Logo programs? Are there examples? No. The Wikipedia people didn't even imagine that, in spite of the fact that they're on a computer.

Here is the [full interview of Alan Kay](http://www.drdobbs.com/architecture-and-design/interview-with-alan-kay/240003442?pgno=2){:target="_blank"}. (Thanks [@fasihsignal](https://twitter.com/fasihsignal) for bringing this quote to our awareness.)

![dream](/assets/dream.jpg)

# BuckleScript

[Bucklescript](https://bucklescript.github.io/bucklescript/) is a backend for OCaml which emits readable, modular and highly performant JavaScript. We are going to use Bucklescript in order to evaluate Ocaml code snippets in this blog post.



# The klipse plugin

The klipse plugin is a small step toward this dream: it is a `javascript` tag that transforms static code snippets of an html page into live and interactive snippets:

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type

[Klipse](https://github.com/viebel/klipse) is written in `clojurescript`, 

The following languages are supported by [Klipse](https://github.com/viebel/klipse) - in any modern browser (including mobile): clojure, ruby, javascript, python, scheme, es2017, jsx, brainfuck, c++, Lua and OCaml.

In this article, we are going to demonstrate interactive `Ocaml` code snippets evaluated by [BuckleScript](https://bucklescript.github.io/bucklescript/). 


# Klipsify an Ocaml code snippet

Let's have on this page a small static code snippet:

~~~ocaml
let hello name = "Hello " ^ name ^ "!";;
let a = hello "World";;
~~~

(This blog is written with `jekyll`: the `kramdown` plugin helps a lot in beautifying the code snippets.)

And now, we are going to **klipsify** this code snippet:

~~~klipse-ocaml
let hello name = "Hello " ^ name ^ "!";;
let a = hello "World";;
~~~

Feel free to edit the code above: it's interactive => it evaluates as you type.

All I had to do in order to **klipsify** my code snippet, was to set the `language-klipse-ocaml` class (configurable) to the appropriate html element.

See it by yourself: here is the source of this page:

~~~html
<p>And now, we are going to <strong>klipsify</strong> this code snippet:</p>

<pre><code class="language-klipse-ocaml">
let hello name = "Hello " ^ name ^ "!";;
let a = hello "World";;
</code></pre>
~~~


# Live demo

Before dealing about integration of the klipse plugin on a web page, let's enjoy another klipse snippet implementing `factorial` in `OCaml`:

~~~klipse-ocaml
let rec fact n = 
match n with
| 1 -> 1
| _ -> n * fact(n-1);;

let x = fact 9;;
~~~

Go ahead! modify the code snippet above, and it will evaluate as you type...

# Evaluating a gist

We can also evaluate code from a `gist`.

For instance, we could evaluate [this gist](https://gist.github.com/viebel/7dcac7f4c488741ecfbbadec27212d4f) that defines a high-order function `sigma` that returns the sum of the results of applying a given function `f` to each element of a list:

<pre>
<div class="language-klipse-ocaml" data-gist-id="viebel/7dcac7f4c488741ecfbbadec27212d4f"></div>
</pre>

Again, feel free to modify the code...

# Integration

All you need to do in order to integrate the klipse plugin to your blog (or any other web page), is to add this `javascript` tag to your web page:

~~~html
<link rel="stylesheet" type="text/css" href="http://app.klipse.tech/css/codemirror.css">

<script>
    window.klipse_settings = {
        selector_ocaml: '.language-klipse-ocaml', // css selector for the html elements you want to klipsify
    };
</script>
<script src="http://app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"></script>
~~~

By the way, this is exactly what we did on the page that you are currently reading.

# Other languages

The [Klipse plugin](https://github.com/viebel/klipse) is designed as a platform that could support any language that has a client-side evaluator, by writing modules to the Klipse plugin. Currently, there are modules available for the following languages: 

- javascript: [A new way of blogging about javascript](http://blog.klipse.tech/javascript/2016/06/20/blog-javascript.html)

- clojure[script]: [How to klipsify a clojure[script] blog post](http://blog.klipse.tech/clojure/2016/06/07/klipse-plugin-tuto.html)

- python: [The python turtle in the browser](http://blog.klipse.tech/python/2017/01/04/python-turtle-fractal.html)

- brainfuck: [Brainfuck for dummies](http://blog.klipse.tech/brainfuck/2016/12/17/brainfuck.html)

- scheme: [Interactive overview of Scheme's semantics](http://blog.klipse.tech/scheme/2016/09/11/scheme-tutorial-1.html)

- lua: [A new way of blogging about Lua](http://blog.klipse.tech/lua/2017/03/19/blog-lua.html)

# Conclusion

Go ahead!

Write your own blog post with interactive snippets in your preferred language. 

It's super simple to integrate the [Klipse plugin](https://github.com/viebel/klipse) on a blog bost: check the instructions on [Klipse github repository](https://github.com/viebel/klipse).

You can get inspired by [the work of the Klipse community](https://github.com/viebel/klipse#community)...

