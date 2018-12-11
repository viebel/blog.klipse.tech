---
layout: post
title:  "Solving a not-so-easy riddle with javascript permutations"
description:  "Solving a not-so-easy riddle with javascript permutations"
date:   2016-09-20 03:12:54 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "87396648-7ee8-11e6-9552-600308a46268"
author: Yehonathan Sharvit
minified_plugin: true
---


A friend of mine (Hillel Kahana) shared with me a riddle that his 10-year old son brought from a math workshop. At first, the riddle sounded easy...



# The riddle

You've got the first 6 digits 1,2,3,4,5 and 6.

You have to partition the digits into 3 numbers `x`, `y` and `z` where:

- `x` is a 3-digit number
- `y` is a 2-digit number
- `z` is a single digit number

Such that the multiplication `x*y*z` is maximal.

Each digit must be used only once.

For instance, `123*45*6`:

~~~klipse-eval-js
123*45*6
~~~

But, obviously we can do better.

Sounds easy. Right?

So give it a try.

Before reading the rest of this article, take a pencil and a sheet of paper and try to find the solution.

Have fun with the digits!

![digits](/assets/digits.jpg)


# Elegant or brute force

Maybe, you are a math genius and you are able to find the elegant solution to this riddle and to prove mathematically that your solution is correct.

It's not my case, so we are going to go with a brute force algorithm.

We are going to go over the `6!` permutations and take the one that leads to the greatest number.

But, wait a minute `6!=720`!

How are we going to generate those 720 permutations?

Hmm....


# StackOverflow to the rescue


Let's import a piece of javascript code from [a gist](https://gist.github.com/viebel/5cc67a97903f04036b569c0eb0436e5f) for generating the permutations of an array:
<pre>
<div class="language-klipse-eval-js" data-gist-id="viebel/5cc67a97903f04036b569c0eb0436e5f">
</div>
</pre>


For instance, let's see all the permutations of `[1, 2, 3]`:

~~~klipse-eval-js
permutations([1,2,3])
~~~

By the way, all the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


# StackOverflow to the rescue - again

We will need another convenient function `maxBy` that calculates the element of an array that maximizes a function.


Again, let's import a piece of javascript code from [a gist](https://gist.github.com/viebel/d5074a79db2bdb65f5e94627b901ba86) for `maxBy` :
<pre>
<div class="language-klipse-eval-js" data-gist-id="viebel/d5074a79db2bdb65f5e94627b901ba86">
</div>
</pre>

Let's see `maxBy` in actions:

~~~klipse-eval-js
maxBy(function(s) { return s.length;}, ['albatross', 'dog', 'horse'])
~~~

# The brute force algorithm

Our algorithm is going to be very straightforward:

1. Generate all the permutations of `[1,2,3,4,5,6]`

2. Take the permutation `[a,b,c,d,e,f]` such that `abc*de*f` is maximal


Let's write it in a single line of javascript code, using `maxBy`, `permutations` and [EcmaScript 6 destructuring](http://untangled.io/in-depth-es6-destructuring-with-assembled-avengers/):

~~~klipse-eval-js
maxBy(([a,b,c,d,e,f]) => (100*a+10*b+c) * (10*d+e) * f, permutations([1,2,3,4,5,6]))
~~~


As you can see, the best permutation is:

~~~klipse-eval-js
431*52*6
~~~

PS: Do you have a more elegant solution to this riddle? Let us know in the comments below...
