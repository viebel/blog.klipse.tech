---
layout: post
title:  "Lambda Calculus: The Y combinator in ruby"
description:  "Recursions without names. The y combinator in ruby. Lambda Calculus."
date:   2016-08-10 14:49:33 +0200
categories: lambda
thumbnail: assets/klipse.png
minified_plugin: true
ruby: true
guid: "e29076c0-61de-11e6-8353-600308a46268"
author: "@viebel"

---

In a [previous article]({% post_url 2016-08-14-almost-y-combinator-ruby %}), we have shown how one can write recursive functions without using names.

Now, we are going to present the [Y combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator).


The Y combinator is one of the most aesthetic idea of computer science. It might not be so practical, but it is really beautiful.  (It has some practical usages like [recursive memoization]({% post_url 2016-8-14-y-combinator-app-ruby %}).)

The Y combinator is a function that allows to generate recursive functions without using names.

![Recursive](/assets/drawing-recursive.jpg)

Many articles have been written about the Y combinator. The particularity of the current article is that you - the reader - are going to feel the magic of the Y combinator with your hand.


All the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


# The Y combinator in action


The Y-combinator takes the idea presented in [our previous article]({% post_url 2016-08-14-almost-y-combinator-ruby %}) one step further and makes it applicable to any function.


Here is the code of the Y-combinator in `ruby`:

~~~klipse-eval-ruby
$Y = ->(f) {
  ->(x) {
    x[x]
    }[->(x) {
      f[->(y) {
        x[x][y]
        }]
      }]
      }
      nil
~~~

So much power in just 44 characters (not counting the whitespaces), with no other concepts than function definition and function execution!


Let's see the Y combinator in action with the `factorial` function. For that purpose, we need to write the `factorial` function with a tweak: the recursive call is going to be parameterised. Like this:

~~~klipse-eval-ruby
$factorial_gen = ->(f) {
  ->(n) {
  if (n === 0) then
    1
  else 
    n * f[n - 1]
  end
    }
    }
nil
~~~


And now, it's time for magic:

~~~klipse-eval-ruby
$Y[$factorial_gen][19]
~~~

Obviously, we can write exactly the same code without names, by replacing `Y` and `factorial_gen` with their bodies:

~~~klipse-eval-ruby
->(f) {
  ->(x) {
    x[x]
    }[->(x) {
      f[->(y) {
        x[x][y]
        }]
      }]
  }[->(f) {
  ->(n) {
    if (n === 0) then
      1
    else 
      n * f[n - 1]
    end
      }
    }][19]
~~~

Please take the time to play with the code above: modify the values, rename the arguments....

Then, please take a pause for a few minutes to contemplate this amazing piece of code.

After that, you have two options:

1. Read more about the Y combinator: [Long but awesome article](http://mvanier.livejournal.com/2897.html), [Practical applications of the Y combinator](http://www.viksit.com/tags/clojure/practical-applications-y-combinator-clojure/), [wikipedia](https://en.wikipedia.org/wiki/Fixed-point_combinator).

2. Write your own recursive function without names using the Y combinator, for instance: fibonacci, quicksort, max, min...

3. Take a look at a real life application of the [Y Combinator]({% post_url 2016-8-14-y-combinator-app-ruby %}).

If you go for option #2, please be kind and share your code in the comments below.



