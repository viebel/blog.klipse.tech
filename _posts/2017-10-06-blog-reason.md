---
layout: post
title: A new way of writing about Reason
description:  blogging klipse reason reasonml live examples code snippets
date:   2017-10-06 09:12:28 +0200
categories: reason
thumbnail: assets/klipse.png
guid: F2886609-0166-4118-A3C9-AA62816B7411
author: "@viebel"
minified_plugin: true
---

This blog post is about to show a new way of writing web pages (blogs, tutorials, documentation...) about [Reason](https://reasonml.github.io/).


# What is Reason?

`Reason` is not a new language; it's a new syntax and toolchain powered by the battle-tested language, [OCaml](https://ocaml.org/). Reason gives `OCaml` a familiar syntax geared toward JavaScript programmers, and caters to the existing NPM/Yarn workflow folks already know.

In that regard, `Reason` can almost be considered as a solidly statically typed, faster and simpler cousin of JavaScript, minus the historical crufts, plus the features of `ES2030` you can use today, and with access to both the `JS` and the `OCaml` ecosystem!

`Reason` is supported by Facebook and has very good integration with `React.js`.

![Einstein](/assets/einstein.png)

# The klipse plugin

The klipse plugin is a `javascript` tag that transforms static code snippets of an html page into live and interactive snippets:

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type

[Klipse](https://github.com/viebel/klipse) is written in `clojurescript`, 

The following languages are supported by [Klipse](https://github.com/viebel/klipse) - in any modern browser (including mobile): clojure, ruby, javascript, python, scheme, es2017, jsx, brainfuck, c++, Lua, OCaml and Reason.

In this article, we are going to demonstrate interactive `Reason` code snippets evaluated by [BuckleScript](https://bucklescript.github.io/bucklescript/) and `refmt`. 

# The magic

The evaluation of Reason code snippets inside your browser is done in 3 steps:

1. `Reason` code is converted into `Ocaml` code by [refmt](https://github.com/reasonml-community/refmt-js).
2. `Ocaml` code is transpiled into `javascript` by [Bucklescript](https://bucklescript.github.io/bucklescript/).
3. `javascript` code is evaluated with `eval` js function.




# Klipsify a Reason code snippet

Let's have on this page a small static code snippet:

~~~ocaml
let hello name => "Hello " ^ name ^ "!";
let a = hello "World";
~~~

(This blog is written with `jekyll`: the `kramdown` plugin helps a lot in beautifying the code snippets.)

And now, we are going to **klipsify** this code snippet:

~~~klipse-reason
let hello name => "Hello " ^ name ^ "!";
let a = hello "World";
~~~

Feel free to edit the code above: it's interactive => it evaluates as you type.

All I had to do in order to **klipsify** my code snippet, was to set the `language-klipse-reason` class (configurable) to the appropriate html element.

See it by yourself: here is the source of this page:

~~~html
<p>And now, we are going to <strong>klipsify</strong> this code snippet:</p>

<pre><code class="language-klipse-reason">
let hello name = "Hello " ^ name ^ "!";;
let a = hello "World";;
</code></pre>
~~~


# Live demo

Before dealing about integration of the klipse plugin on a web page, let's enjoy another klipse snippet implementing `factorial` in `Reason`:

~~~klipse-reason
let rec fact n =>
switch n {
| 1 => 1
| _ => n * fact(n-1)
};

let x = fact 9;
~~~

Go ahead! modify the code snippet above, and it will evaluate as you type...


# Transpilation into JS

Klipse can also display the transpiled javascript code.

Here you go:

~~~transpile-reason
let rec fact n =>
switch n {
| 1 => 1
| _ => n * fact(n-1)
};

let x = fact 9;
~~~

# Conversion into Ocaml

And if you are really curious, you can see the converted `Ocaml` code:

~~~transpile-reason-to-ocaml
let rec fact n =>
switch n {
| 1 => 1
| _ => n * fact(n-1)
};

let x = fact 9;
~~~

# Evaluating a gist

We can also evaluate code from a `gist`.

For instance, we could evaluate [this gist](https://gist.github.com/viebel/de19a9c8827f887d1f9ae4568decb0de) that defines a high-order function `sigma` that returns the sum of the results of applying a given function `f` to each element of a list:

<pre>
<div class="language-klipse-reason" data-gist-id="viebel/de19a9c8827f887d1f9ae4568decb0de"></div>
</pre>

Again, feel free to modify the code...

# Integration

All you need to do in order to integrate the klipse plugin to your blog (or any other web page), is to add this `javascript` tag to your web page:

~~~html
<link rel="stylesheet" type="text/css" href="http://app.klipse.tech/css/codemirror.css">

<script>
    window.klipse_settings = {
        selector_eval_reason: '.language-klipse-reason', // selector for reason evaluation snippets
		selector_transpile_reason: '.language-transpile-reason', // selector for reason transpilation snippets
        selector_transpile_reason_to_ocaml: '.language-transpile-reason-to-ocaml' // selector for reason transpilation into ocaml snippets
     };
</script>
<script src="http://app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"></script>
~~~

By the way, this is exactly what we did on the page that you are currently reading.

# Other languages

The [Klipse plugin]((https://github.com/viebel/klipse)) is designed as a platform that could support any language that has a client-side evaluator, by writing modules to the Klipse plugin. Currently, there are modules available for the following languages: 

- javascript: [A new way of blogging about javascript](http://blog.klipse.tech/javascript/2016/06/20/blog-javascript.html)

- clojure[script]: [How to klipsify a clojure[script] blog post](http://blog.klipse.tech/clojure/2016/06/07/klipse-plugin-tuto.html)

- python: [The python turtle in the browser](http://blog.klipse.tech/python/2017/01/04/python-turtle-fractal.html)

- brainfuck: [Brainfuck for dummies](http://blog.klipse.tech/brainfuck/2016/12/17/brainfuck.html)

- scheme: [Interactive overview of Scheme's semantics](http://blog.klipse.tech/scheme/2016/09/11/scheme-tutorial-1.html)

- lua: [A new way of blogging about Lua](http://blog.klipse.tech/lua/2017/03/19/blog-lua.html)
- ocaml: [A new way of blogging about Ocaml](http://blog.klipse.tech/ocaml/2017/10/05/blog-ocaml.html)

# Conclusion

Go ahead!

Write your own blog post with interactive snippets in your preferred language. 

It's super simple to integrate the [Klipse plugin](https://github.com/viebel/klipse) on a blog bost: check the instructions on [Klipse github repository](https://github.com/viebel/klipse).

You can get inspired by [the work of the Klipse community](https://github.com/viebel/klipse#community)...

