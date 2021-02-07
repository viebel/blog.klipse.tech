---
layout: post
title: A new way of blogging about Python
description: Klipse allows you to include interactive Python code snippets in a technical blog. 
date:   2021-02-07 04:34:28 +0200
categories: python
thumbnail: assets/klipse.png
guid: 7AD554D9-05AF-4AA1-A5A4-926A823DE86B
author: Yehonathan Sharvit
minified_plugin: true
---

This blog post is about to show a new way of blogging about Python.

Look at a typical blog post or tutorial about any programming language: The article usually presents a couple of code snippets. As I see it, there are two pains with code snippets:

1. They contain the input and the output but not the **actual evaluation** of the input
2. It's impossible for the reader to **modify** the output

# The forgotten dream

A long time ago, all the developers had a common **dream**. The dream was about interactivity, instant feedback, evaluation...

But we put this dream aside - because the browser understands only `JavaScript`.

And after a while, we even forgot that we ever had this dream.

Still, there are some people that didn't forget this dream, like Alan Kay:

>Question: Well, look at Wikipedia — it's a tremendous collaboration.

>Alan Kay: It is, but go to the article on [Logo](https://en.wikipedia.org/wiki/Logo_(programming_language)), can you write and execute Logo programs? Are there examples? No. The Wikipedia people didn't even imagine that, in spite of the fact that they're on a computer.

Here is the [full interview of Alan Kay](http://www.drdobbs.com/architecture-and-design/interview-with-alan-kay/240003442?pgno=2){:target="_blank"}. (Thanks [@fasihsignal](https://twitter.com/fasihsignal) for bringing this quote to our awareness.)

![dream](/assets/dream.jpg)


# The Klipse plugin

The Klipse plugin is a small step toward our forgotten dream: it is a `JavaScript` tag that transforms static code snippets of an html page into live and interactive snippets:

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type

[Klipse](https://github.com/viebel/klipse) is written in `ClojureScript`, 

The following languages are supported by [Klipse](https://github.com/viebel/klipse): Clojure, Ruby, JavaScript, Ocaml, Scheme, Jsx, Brainfuck, Prolog, C++ and Lua.

In this article, we are going to demonstrate interactive `Python` code snippets evaluated by 
[Skulpt](https://skulpt.org/),  an **entirely in-browser** implementation of Python.


# Klipsify an Python code snippet

Let's have on this page a small static code snippet:

~~~python
def hello():
  print("Hello World!")
  
hello()
~~~

(This blog is written with `jekyll`: the `kramdown` plugin helps a lot in beautifying the code snippets.)

And now, we are going to **klipsify** this code snippet:

~~~klipse-python
def hello():
  print("Hello World!")
  
hello()
~~~

Feel free to edit the code above: it's interactive => it evaluates as you type.

All I had to do in order to **klipsify** my code snippet, was to set the `language-klipse-python` class (configurable) to the appropriate html element.

See it by yourself: here is the source of this page:

~~~html
<p>And now, we are going to <strong>klipsify</strong> this code snippet:</p>

<pre><code class="language-klipse-python">
def foo:
  print("Hello World!")
  
foo()
</code></pre>
~~~


# Live demo

Before dealing about integration of the Klipse plugin on a web page, let's enjoy another Klipse snippet implementing `factorial` in `python`:

~~~klipse-python
def factorial(n):
  if n == 0:
    return 1
  return n*factorial(n-1)

print(factorial(5))
~~~

Go ahead! modify the code snippet above, and it will evaluate as you type...

# Evaluating a gist

We can also evaluate code from a `gist`.

For instance, we could evaluate [this gist](https://gist.github.com/viebel/9ab6b853c78c5e651f844ea2568c44a9) that tells a turtle to draw a [Sierpiński triangle](https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle).

<pre>
<div class="language-klipse-python" data-gist-id="viebel/9ab6b853c78c5e651f844ea2568c44a9"></div>
</pre>

Again, feel free to modify the code...

# Integration

All you need to do in order to integrate the Klipse plugin to your blog (or any other web page), is to add this `JavaScript` tag to your web page:

~~~html
<link rel="stylesheet" type="text/css" href="http://app.klipse.tech/css/codemirror.css">

<script>
    window.klipse_settings = {
        selector_eval_python_client: '.language-klipse-python'
    };
</script>
<script src="http://app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"></script>
~~~

By the way, this is exactly what we did on the page that you are currently reading.

# Other languages

The [Klipse plugin](https://github.com/viebel/klipse) is designed as a platform that could support any language that has a client-side evaluator, by writing modules to the Klipse plugin. Currently, in addition to Python, there are modules available for the following languages: 

- Javascript: [A new way of blogging about javascript](http://blog.klipse.tech/javascript/2016/06/20/blog-javascript.html)

- Clojure[script]: [How to klipsify a clojure[script] blog post](http://blog.klipse.tech/clojure/2016/06/07/klipse-plugin-tuto.html)

- Brainfuck: [Brainfuck for dummies](http://blog.klipse.tech/brainfuck/2016/12/17/brainfuck.html)

- Scheme: [Interactive overview of Scheme's semantics](http://blog.klipse.tech/scheme/2016/09/11/scheme-tutorial-1.html)

- Lua: [A new way of blogging about Lua](http://blog.klipse.tech/lua/2017/03/19/blog-lua.html)

# Conclusion

Go ahead!

Write your own blog post with interactive snippets in your preferred language. 

It's super simple to integrate the [Klipse plugin](https://github.com/viebel/klipse) on a blog post: check the instructions on [Klipse github repository](https://github.com/viebel/klipse).

You can get some inspiration by [the work of the Klipse community](https://github.com/viebel/klipse#community)...

