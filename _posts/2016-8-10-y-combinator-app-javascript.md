---
layout: post
title: "Y combinator real life application: recursive memoization in javascript"
description: "Y combinator real life application: recursive memoization in javascript"
date:   2016-08-10 19:17:22 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "8604CAEE-E2F4-4DEE-A86B-AE87F4B4FF13"
author: Yehonathan Sharvit
tags: [javascript,lambdacalculus]
---

When we presented  [the Y combinator]({% post_url 2016-08-10-pure-y-combinator-javascript  %}), we said that it was very aesthetic but not so practical.


Today, we are going to show a real life application of the [Y combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator): the memoization of a recursive function.


![Recursive](/assets/escher-stairs.jpg)

# The problem

Did you ever try to [memoize](https://en.wikipedia.org/wiki/Memoization) a recursive function?

At first glance, it seems easy, using standard memoization technique e.g the `memoize` function from [github Javascript Toolbet](https://github.com/viebel/javascript-toolbelt):

<pre><code class="language-klipse-eval-js" data-external-libs="https://raw.githubusercontent.com/viebel/javascript-toolbelt/master/lib/core.js">
  JST.memoize
</code></pre>


Now, let's create a memoized version of factorial, including a counter of the number of function calls to `factorial`:

~~~klipse-eval-js
factorial = n => {
    window.function_calls++;
    return (n === 0) ? 1: n * factorial(n - 1)
}

factorial_memo = JST.memoize(factorial);
factorial_memo(5)
~~~

And indeed subsequent calls to `factorial-memo` are cached:

~~~klipse-eval-js
factorial_memo = JST.memoize(factorial);
window.function_calls = 0
factorial_memo(6)
factorial_memo(6)

window.function_calls
~~~


The function has been called only 7 times.

By the way, all the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


But what happens to subsequent calls with smaller numbers?
We'd like them to be cached also. But they are not.

Here is the proof:


~~~klipse-eval-js
factorial_memo = JST.memoize(factorial);
window.function_calls = 0
factorial_memo(6)
factorial_memo(5)
window.function_calls
~~~

The reason is that the code of `factorial_memo` uses `factorial` and not `factorial_memo`.

In `javascript`, we could modify the code of `factorial` so that it calls `factorial_memo`, but it is very very ugly: the code of the recursive function has to be aware of its memoizer!!!

~~~klipse-eval-js
factorial_ugly = n => {
    window.function_calls++;
    return (n === 0) ? 1 : n * factorial_memo_ugly(n - 1)
}
factorial_memo_ugly = JST.memoize(factorial_ugly);
window.function_calls = 0
factorial_memo_ugly(6)
factorial_memo_ugly(5)
window.function_calls
~~~



With the Y combinator we can solve this issue with elegance.


# The Y combinator for recursive memoization

As we explained [here]({% post_url 2016-08-10-pure-y-combinator-javascript  %}), the Y combinator allows us to generate recursive functions without using any names.


As envisioned by Bruce McAdam in his paper [Y in Practical Programs](/assets/y-in-practical-programs.pdf)  and exposed [here](http://www.viksit.com/tags/clojure/practical-applications-y-combinator-clojure/) by Viksit Gaur, we are going to tweak the code of the Y combinator, so that it receives a wrapper function and apply it before executing the original function. Something like this:

~~~klipse-eval-js
Ywrap = (wrapper_func, f) => (x => x(x))(x => f(wrapper_func(y => x(x)(y))))
~~~


And here is the code for a memo wrapper generator:

~~~klipse-eval-js
memo_wrapper_generator = () => {
    const memo = {};
    return f => n => {
        if (memo.hasOwnProperty(n)) {
            return memo[n];
        }
        const result = f(n);
        memo[n] = result;
        return result;
    };
}
null
~~~

It is almost the same code as `JST.memoize` we presented in the beginning of this article.

And now, we are going to build a Y combinator for memoization:

~~~klipse-eval-js
Ymemo = f => Ywrap(memo_wrapper_generator(), f)
~~~


And here is how we get a memoized recursive factorial function:

~~~klipse-eval-js
factorial_gen = f => {
  window.function_calls++; 
  return (n => ((n === 0) ? 1 : n * f(n - 1)))
};
factorial_memo = Ymemo(factorial_gen)
~~~


And here is the proof that it is memoized properly:

~~~klipse-eval-js
window.function_calls = 0
factorial_memo = Ymemo(factorial_gen)
factorial_memo(6)
factorial_memo(5)
window.function_calls
~~~


Isn't it elegant?


# Fibonacci without exponential complexity

The worst effective implementation (exponential complexity) of the Fibonacci function is the recursive one:

~~~klipse-eval-js
fib = n =>
  (n < 2) ? 1 : fib(n - 1) + fib(n - 2)
~~~


There are a couple of [effective implementations]({% post_url 2016-04-19-fibonacci %}) for the Fibonacci sequence without using recursion.


Using our `Ymemo` combinator, one can write an effective recursive implementation if the Fibonnaci sequence:


~~~klipse-eval-js
fib_gen = f => n =>
  (n < 2) ? 1 : f(n - 1) + f(n - 2)

fib_memo = Ymemo(fib_gen)
~~~


Let's compare the performances of the naive recursive version and the memoized recursive:

First, let's load a timing function named `JST.time` code from [github Javascript Toolbet](https://github.com/viebel/javascript-toolbelt): it works like `console.time` but with two differences:

1. It returns the elapsed time instead of printing it
2. The elapsed time resolution is fraction of milliseconds


<pre><code class="language-klipse-eval-js" data-external-libs="https://raw.githubusercontent.com/viebel/javascript-toolbelt/master/lib/core.js">
  JST.time
</code></pre>


And now, let's compare:


(We have to redefine `fib_memo`, in order to reset the cache each time we re-run the code snippet.)

~~~klipse-eval-js
var n = 35;
fib_memo = Ymemo(fib_gen);

[
    JST.time(() => fib(n)),
    JST.time(() => fib_memo(n))
]

~~~

On my computer, the memoized one is around **300** times faster!

Please share your thoughts about this really exciting topic...

