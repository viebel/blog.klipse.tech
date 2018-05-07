---
layout: post
title:  A new way of blogging about Common Lisp
description:  blogging klipse Common Lisp live examples code snippets
date:   2018-05-07 03:08:12 +0200
categories: lisp
thumbnail: assets/klipse.png
guid: "26614336-2454-4C74-BCB2-0C70705702C5"
author: "@viebel"
minified_plugin: true
---

This blog post is about to show a new way of blogging about [Common Lisp](https://en.wikipedia.org/wiki/Common_Lisp).

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

# The klipse plugin

The klipse plugin is a small step toward this dream: it is a `javascript` tag that transforms static code snippets of an html page into live and interactive snippets:

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type

[Klipse](https://github.com/viebel/klipse) is written in `clojurescript`, 

The following languages are supported by [Klipse](https://github.com/viebel/klipse) - in any modern browser (including mobile): clojure, ruby, javascript, python, scheme, es2017, jsx, brainfuck, c++, ocaml, reason and Common Lisp.

In this article, we are going to demonstrate interactive `Common Lisp` code snippets evaluated by [JSCL](https://github.com/jscl-project/jscl). Big thanks to [@HenryS1](https://github.com/HenryS1), [@davazp](https://github.com/davazp) and [@t-cool](https://github.com/t-cool) for this super cool project and their help for integration `JSCL` into `Klipse`.


# Klipsify a Common Lisp code snippet

Let's have on this page a small static code snippet:

~~~common_lisp
(let ((a 6)
      (b 4))
  (+ a b))  
~~~

(This blog is written with `jekyll`: the `kramdown` plugin helps a lot in beautifying the code snippets.)

And now, we are going to **klipsify** this code snippet:

~~~klipse-clisp
 (let ((a 6)
       (b 4))
   (+ a b))  
~~~

Feel free to edit the code above: it's interactive => it evaluates as you type.

All I had to do in order to **klipsify** my code snippet, was to set the `language-klipse-clisp` class (configurable) to the appropriate html element.

See it by yourself: here is the source of this page:

~~~html
<p>And now, we are going to <strong>klipsify</strong> this code snippet:</p>

<pre><code class="language-klipse-clisp"> 
(let ((a 6)
       (b 4))
   (+ a b))  
</code></pre>

~~~


# Live demo

Before dealing about integration of the klipse plugin on a web page, let's enjoy another simple klipse snippet in `Common Lisp`:

~~~klipse-clisp
 (flet ((square (x)
          (* x x)))
   (square 3))
~~~

Go ahead! modify the code snippet above, and it will evaluate as you type...

# Evaluating a gist

We can also evaluate code from a `gist`.


For instance, we could evaluate [this gist](https://gist.github.com/viebel/b0b68f35d7f91d001bac3e2e0d300b5e) that defines the factorial function and calls it with `5`:

<pre>
<div class="language-klipse-clisp" data-gist-id="viebel/b0b68f35d7f91d001bac3e2e0d300b5e"></div>
</pre>

Again, feel free to modify the code...

# Integration

All you need to do in order to integrate the klipse plugin to your blog (or any other web page), is to add this `javascript` tag to your web page:

~~~html
<link rel="stylesheet" type="text/css" href="http://app.klipse.tech/css/codemirror.css">

<script>
    window.klipse_settings = {
        selector_eval_clisp: '.language-klipse-clisp', // css selector for the html elements you want to klipsify
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

# Conclusion

Go ahead!

Write your own blog post with interactive snippets in your preferred language. 

It's super simple to integrate the [Klipse plugin](https://github.com/viebel/klipse) on a blog bost: check the instructions on [Klipse github repository](https://github.com/viebel/klipse).

You can get inspired by [the work of the Klipse community](https://github.com/viebel/klipse#community)...

