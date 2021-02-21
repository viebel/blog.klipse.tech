---
layout: post
title:  "A new way of blogging about Prolog"
description:  "A new way of blogging about Prolog. With interactive and live code snippets powered by Klipse"
date:   2019-01-01 08:11:22 +0200
categories: prolog
thumbnail: assets/klipse.png
guid: "7AB08321-AC7C-44C1-A1FD-91316AB392A8"
author: Yehonathan Sharvit
minified_plugin: true
tags: [klipse, prolog]
---

This blog post is about to show a new way of blogging about [Prolog](https://en.wikipedia.org/wiki/Prolog)).

Look at a typical blog post or tutorial about any programming language: it usually presents a couple of code snippets. As I see it, there are two pains with code snippets:

1. they contain the input and the output but not the actual evaluation of the input
2. it's impossible for the reader to modify the input and see how it impacts the output

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

The following languages are supported by [Klipse](https://github.com/viebel/klipse) - in any modern browser (including mobile): clojure, ruby, javascript, python, scheme, es2017, jsx, brainfuck, c++, lua and prolog.

In this article, we are going to demonstrate interactive `Prolog` code snippets where the evaluation of the code is done through the amazing [tau-prolog](http://tau-prolog.org/), a Prolog interperter in Javascript. 


# Klipsify a Prolog code snippet

Let's have on this page a small static set of rules:

~~~
woman(emily).
man(john).
~~~

And now, let's query our knowledge base:

~~~
?- man(john).
~~~

The Prolog system will answer either "yes" or "true" depending on the implementation.


But all of this is static and the developers learn much better through interactivity.

So let's **klipsify** the rules and the query:

~~~prolog-rules
woman(emily).
man(john).
~~~

~~~prolog-query
man(john).
~~~

Have you noticed the small icon to the left of the code snippet to differentiate between rules and queries, instead of the usual `?-` to introduce a query?

Feel free to edit the code above: it's interactive => it evaluates as you type.

All I had to do in order to **klipsify** my code snippet, was to set the `language-prolog-rules` class (configurable) to the html element that contains the rules and the `language-prolog-query` classes (configurable) to html element that contains the query.

See it by yourself, here is the html portion of this page that klipsifies the code snippets:

~~~html
<p>So let’s <strong>klipsify</strong> the rules and the query:</p>

<pre><code class="language-prolog-rules">woman(emily).
man(john).
</code></pre>

<pre><code class="language-prolog-query">man(john).
</code></pre>
~~~

# Live demo

Before dealing about integration of the klipse plugin on a web page, let's enjoy another pair of klipsified Prolog rules and query, that involves fruits:

~~~prolog-rules
% load lists module, see tau-prolog documentation
:- use_module(library(lists)).

% fruit/1
fruit(apple). fruit(pear). fruit(banana).

% fruits_in/2
fruits_in(Xs, X) :- member(X, Xs), fruit(X).
~~~

Let's ask Prolog to list all the fruits of a list:

~~~prolog-query
fruits_in([carrot, apple, banana, broccoli, orange], X).
~~~

Go ahead! modify the code snippet above, and it will evaluate as you type...

# Visualisation of the process

The great thing about `tau-prolog` is that it runs in the browser. As a consequence, we can graphically visualize the steps of the process. 

Let's take for example the classic [Knight's tour problem](https://en.wikipedia.org/wiki/Knight%27s_tour), where we look for a sequence of moves of a knight on a chessboard such that the knight visits every square only once.

The `tau-prolog` team wrote a [short Prolog program](http://tau-prolog.org/examples/knights-tour) to solve this problem:

~~~prolog-rules
:- use_module(library(dom)).
:- use_module(library(lists)).
:- use_module(library(system)).

% mov/2
mov( 1, 2). mov( 1,-2). mov(-1, 2). mov(-1,-2).
mov( 2, 1). mov( 2,-1). mov(-2, 1). mov(-2,-1).

% jump/2
jump((X0,Y0), (X1,Y1)) :-
mov(X,Y),
X1 is X0+X,
Y1 is Y0+Y,
X1 >= 1, X1 =< 8,
Y1 >= 1, Y1 =< 8.

% tour/2
tour(Init, Tour) :-
tour(Init, [], 1, Tour).

% tour/4
tour(Position, Visited, N, Tour) :-
fill_cell(Position, N),
jump(Position, Next),
%	sleep(50),
M is N+1,
\+(member(Next, Visited)),
( tour(Next, [Position|Visited], M, Tour) ; 
fill_cell(Next, ''), fail).

% fill_cell/2
fill_cell((Row, Col), Content) :-
remove_knight,
number_chars(Row, [AtomRow]),
number_chars(Col, [AtomCol]),
atom_concat(col, AtomRow, ColRow),
atom_concat(ColRow, AtomCol, Id),
get_by_id(Id, Cell),
html(Cell, Content),
add_class(Cell, knight).

% remove_knight/0
remove_knight :-
get_by_class(knight, Knight), !, remove_class(Knight, knight).
remove_knight.
~~~

And a short query to trigger the program, starting at he top left square, named `(1,1)`:

~~~prolog-query
tour((1,1), _).
~~~

 <div id="table">
	<div id="row1"><div class="col" id="col11"></div><div class="col" id="col12"></div><div class="col" id="col13"></div><div class="col" id="col14"></div><div class="col" id="col15"></div><div class="col" id="col16"></div><div class="col" id="col17"></div><div class="col" id="col18"></div></div>
	<div id="row2"><div class="col" id="col21"></div><div class="col" id="col22"></div><div class="col" id="col23"></div><div class="col" id="col24"></div><div class="col" id="col25"></div><div class="col" id="col26"></div><div class="col" id="col27"></div><div class="col" id="col28"></div></div>
	<div id="row3"><div class="col" id="col31"></div><div class="col" id="col32"></div><div class="col" id="col33"></div><div class="col" id="col34"></div><div class="col" id="col35"></div><div class="col" id="col36"></div><div class="col" id="col37"></div><div class="col" id="col38"></div></div>
	<div id="row4"><div class="col" id="col41"></div><div class="col" id="col42"></div><div class="col" id="col43"></div><div class="col" id="col44"></div><div class="col" id="col45"></div><div class="col" id="col46"></div><div class="col" id="col47"></div><div class="col" id="col48"></div></div>
	<div id="row5"><div class="col" id="col51"></div><div class="col" id="col52"></div><div class="col" id="col53"></div><div class="col" id="col54"></div><div class="col" id="col55"></div><div class="col" id="col56"></div><div class="col" id="col57"></div><div class="col" id="col58"></div></div>
	<div id="row6"><div class="col" id="col61"></div><div class="col" id="col62"></div><div class="col" id="col63"></div><div class="col" id="col64"></div><div class="col" id="col65"></div><div class="col" id="col66"></div><div class="col" id="col67"></div><div class="col" id="col68"></div></div>
	<div id="row7"><div class="col" id="col71"></div><div class="col" id="col72"></div><div class="col" id="col73"></div><div class="col" id="col74"></div><div class="col" id="col75"></div><div class="col" id="col76"></div><div class="col" id="col77"></div><div class="col" id="col78"></div></div>
	<div id="row8"><div class="col" id="col81"></div><div class="col" id="col82"></div><div class="col" id="col83"></div><div class="col" id="col84"></div><div class="col" id="col85"></div><div class="col" id="col86"></div><div class="col" id="col87"></div><div class="col" id="col88"></div></div>
</div>
<br/>
<br/>

The algorithm will run for quite a long time, but without freezing the browser .



# Integration

All you need to do in order to integrate the klipse plugin to your blog (or any other web page), is to add this `javascript` tag to your web page:

~~~html
<link rel="stylesheet" type="text/css" href="http://app.klipse.tech/css/codemirror.css">
<link rel="stylesheet" type="text/css" href="http://app.klipse.tech/css/prolog.css">
<script>
    window.klipse_settings = {
       selector_prolog_rules: '.language-prolog-rules', // css selector for the prolog rules elements you want to klipsify
       selector_prolog_query: '.language-prolog-query', // css selector for the prolog query elements you want to klipsify	   
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

<style type="text/css">
#table {
	box-shadow: 0px 0px 10px #bfbfbf;
	border: 5px solid white;
	border-radius: 5px;
	font-size: 30px;
	text-align: center;
	text-shadow: 0px 0px 5px #2c0d5a;
	color: white;
	margin: 0px auto;
	width: 400px;
}

#table > div {
	overflow: hidden;
}

#table > div:nth-child(even) > div:nth-child(odd), #table > div:nth-child(odd) > div:nth-child(even) {
	background-color: #442178;
	box-shadow: inset 0px 0px 5px #2c0d5a;
}

#table > div:nth-child(even) > div:nth-child(even), #table > div:nth-child(odd) > div:nth-child(odd) {
	background-color: #977bc1;
}

#table > div > div {
	float: left;
	padding-top: 6px;
	height: 44px;
	width: 50px;
}

.knight {
	background-image: url(/assets/knight.png);
	background-position: center center;
	background-repeat: no-repeat;
	font-size: 0px;
}
</style>
