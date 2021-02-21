---
layout: post
title:  The most elegant implementation of FizzBuzz
description:  The most elegant implementation of FizzBuzz. FizzBuzz in Clojure.
date:   2020-09-11 06:28:22 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: 45866A95-4455-49EC-AFE3-98130501C005
author: Yehonathan Sharvit
tags: [clojure]
---

### What is FizzBuzz?

The `FizzBuzz` test is an interview question designed to help filter out the 99.5% of programming job candidates who can't seem to program their way out of a wet paper bag. 
The text of the programming assignment is as follows:

>Write a program that prints the numbers from 1 to 100. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz"


There are a lot of ways to write the `FizzBuzz` program. See for instance [the one using Clojure pattern matching](http://blog.klipse.tech/clojure/2016/10/25/core-match.html#fizzbuzz). 
Today, I'd like to share with you the most elegant implementation of FizzBuzz I've ever seen. It's elegant because it doesn't make use of any imperative constructs (like `if` statements), but only functional programming constructs (like infinite lazy sequences and function composition).

![Pure](/assets/blog_purity.jpg)

This implementation was developed by [Dierk Konig](https://dierk.gitbooks.io/fregegoodness/content/src/docs/asciidoc/fizzbuzz.html) and Kevlin Henney presented a `Haskell` version of it - in his amazing talk [Declarative Thinking, Declarative Practice](https://youtu.be/nrVIlhtoE3Y).

In this article, we are going to present an interactive version of Kevlin's code in `Clojure`.

### The elegant code


Take a look at this marvel: no `if` statements - only 3 infinite lazy sequences and function composition. 

This is exactly what we call -  **Purely Functional**:

<pre><code class="language-eval-clj" data-gist-id="viebel/b133efde8669d6c0630ee6895c1797c6">
</code></pre>

And it works like a charm:


~~~eval-clj
(fizzbuzz 19)
~~~


Feel free to modify `19` - the code snippets are **live** and **interactive** powered by the [Klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


If you are a bit skeptic (yet) about the elegance of this implementation, you might want to read [Dierk Konig's article](https://dierk.gitbooks.io/fregegoodness/content/src/docs/asciidoc/fizzbuzz.html): he explains in details the pragmatic advantages of his code.

### Further details

You probably wonder what is this `choice` function and why does `max` do when it receives 2 strings?


Well, `ClojureScript` runs on top of `JavaScript` - and in `JavaScript`, strings are comparable:

~~~eval-clj
(> "Fizz" "")
~~~

~~~eval-clj
(max "Fizz" "")
~~~
But that is an ugly trick - that doesn't work in `Clojure`. So it's much better to use the `choice` function - that returns the first non-empty string of the two it receives:

~~~eval-clj
(choice "abc" "")
~~~


<pre><code class="language-eval-clj" data-gist-id="viebel/564b99b1365d1966342ad0a0977b94b3">
</code></pre>


And it works also:

~~~eval-clj
(fizzbuzz-clean 15)
~~~
