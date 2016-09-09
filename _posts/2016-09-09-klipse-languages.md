---
layout: post
title:  "Code playground in ruby, clojure, javascript, python, PHP and more"
description:  "Code playground in ruby, clojure, javascript, python, PHP and more"
date:   2016-09-09 05:12:23 +0200
categories: klipse
thumbnail: assets/klipse.png
guid: "DD28E4A1-7652-41A5-9819-B8E4A97EBC51"
author: "@viebel"
all_languages: true
---

This is a playground for the languages supported by the [KLIPSE plugin](https://github.com/viebel/klipse).

All the code snippets of this page are **live** and **interactive**:

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


## Clojure

# Evaluation

~~~klipse
(map inc [1 2 3])
~~~

# Transpilation into javascript

~~~klipse-js
(defn foo [[x y]]
  (+ x y))

(foo [1 2])
~~~


## Javacript

# Regular Javascript

~~~klipse-eval-js
var res = 0;
for (x = 0; x < 10; x++)
      res += 10*x;
res
~~~

# ECMAScript 6

It will work only if your browser supports `EcmaScript6` [arrow functions](https://kangax.github.io/compat-table/es6/).

~~~klipse-eval-js
[1,2,3].map (x => x + 1)
~~~

## Ruby

~~~klipse-eval-ruby
[1,2]*10
~~~

## Python

~~~klipse-python
print([x + 1 for x in range(10)])
~~~

## PHP

~~~klipse-eval-php
print "Hello". " World!";
~~~

## HTML

<div class="language-klipse-html" data-editor-type="html">
    &lt;img id="amelie" src="http://epsilonwiki.free.fr/lambdaway/data/amelie_poulain.jpg" height="150" title="Amélie Poulain" style="box-shadow:0 0 8px black; border:1px solid white; -webkit-transform:rotate(-5deg); -moz-transform:rotate(-5deg); transform:rotate(-5deg);"&gt;&lt;/img&gt;
</div>


## Markdown

~~~klipse-markdown
# Hello KLIPSE
## Markdown is cool
`Markdown` and `KLIPSE` rock!
~~~


## LambdaWay

`LambdaWay` is a kind of a markup language. More about it [here](http://epsilonwiki.free.fr/lambdaway/?view=primal)

<div class="language-klipse-lambdaway" data-editor-type="html">{div {@ style="text-align:center;font:bold 2em georgia;color:red;"} √(3{sup 2}+4{sup 2}) = {sqrt {+ {* 3 3} {* 4 4}}}}</div>

