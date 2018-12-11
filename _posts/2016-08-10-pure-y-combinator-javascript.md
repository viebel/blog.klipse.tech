---
layout: post
title:  "Lambda Calculus: The Y combinator in javascript"
description:  "Recursions without names. The y combinator in javascript. Lambda Calculus."
date:   2016-08-10 14:49:33 +0200
categories: lambda
thumbnail: assets/klipse.png
minified_plugin: true
guid: "C1B6FA30-F437-4AE7-9F9B-6CA9381955E9"
author: Yehonathan Sharvit

---

In a [previous article]({% post_url 2016-08-10-almost-y-combinator-javascript %}), we have shown how one can write recursive functions without using names.

Now, we are going to present the [Y combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator).


The Y combinator is one of the most aesthetic idea of computer science. It might not be so practical, but it is really beautiful.  (It has some practical usages like [recursive memoization]({% post_url 2016-8-10-y-combinator-app-javascript %}).)

The Y combinator is a function that allows to generate recursive functions without using names.

![Recursive](/assets/drawing-recursive.jpg)

Many articles have been written about the Y combinator. The particularity of the current article is that you - the reader - are going to feel the magic of the Y combinator with your hand.


All the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


# The Y combinator in action


The Y-combinator takes the idea presented in [our previous article]({% post_url 2016-08-10-almost-y-combinator-javascript %}) one step further and makes it applicable to any function.


Here is the code of the Y-combinator in `javascript`:

~~~klipse-eval-js
Y = f => (x => x(x))(x => f(y => x(x)(y)))
~~~

So much power in just 38 characters, with no other concepts than function definition and function execution!


Let's see the Y combinator in action with the `factorial` function. For that purpose, we need to write the `factorial` function with a tweak: the recursive call is going to be parameterised. Like this:

~~~klipse-eval-js
factorial_gen = f => (n => ((n === 0) ? 1 : n * f(n - 1)))
~~~


And now, it's time for magic:

~~~klipse-eval-js
Y(factorial_gen)(19)
~~~

Obviously, we can write exactly the same code without names, by replacing `Y` and `factorial_gen` with their bodies:

~~~klipse-eval-js
(f => (x => x(x))(x => f(y => x(x)(y))))(f => (n => ((n === 0) ? 1 : n * f(n - 1))))(19)
~~~

Please take the time to play with the code above: modify the values, rename the arguments....

Then, please take a pause for a few minutes to contemplate this amazing piece of code.

After that, you have two options:

1. Read more about the Y combinator: [Long but awesome article](http://mvanier.livejournal.com/2897.html), [Practical applications of the Y combinator](http://www.viksit.com/tags/clojure/practical-applications-y-combinator-clojure/), [wikipedia](https://en.wikipedia.org/wiki/Fixed-point_combinator).

2. Write your own recursive function without names using the Y combinator, for instance: fibonacci, quicksort, max, min...

3. Take a look at a real life application of the [Y Combinator]({% post_url 2016-8-10-y-combinator-app-javascript %}).

If you go for option #2, please be kind and share your code in the comments below.



