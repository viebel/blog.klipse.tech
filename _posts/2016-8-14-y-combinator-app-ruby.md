---
layout: post
title: "Y combinator real life application: recursive memoization in ruby"
description: "Y combinator real life application: recursive memoization in ruby"
date:   2016-08-14 06:05:11 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "bb5f9d38-61de-11e6-9059-600308a46268"
ruby: true
author: "@viebel"

---

When we presented  [the Y combinator]({% post_url 2016-08-14-pure-y-combinator-ruby  %}), we said that it was very aesthetic but not so practical.


Today, we are going to show a real life application of the [Y combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator): the memoization of a recursive function.


![Recursive](/assets/escher-stairs.jpg)

# The problem

Did you ever try to [memoize](https://en.wikipedia.org/wiki/Memoization) a recursive function?

At first glance, it seems easy, using standard memoization technique: 

~~~klipse-eval-ruby
$memoize = ->(f){
  memo = {}
  ->(x){
    if memo.has_key?(x) then
      memo[x]
    else
      res = f[x]
      memo[x] = res
      res
    end
      }
    }
  nil
~~~

Now, let's create a memoized version of factorial, including a counter of the number of function calls to `factorial`:

~~~klipse-eval-ruby
factorial = n => {
    window.function_calls++;
    return (n === 0) ? 1: n * factorial(n - 1)
}

factorial_memo = memoize(factorial);
factorial_memo(5)
~~~

And indeed subsequent calls to `factorial-memo` are cached:

~~~klipse-eval-ruby
factorial_memo = memoize(factorial);
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


~~~klipse-eval-ruby
factorial_memo = memoize(factorial);
window.function_calls = 0
factorial_memo(6)
factorial_memo(5)
window.function_calls
~~~

The reason is that the code of `factorial_memo` uses `factorial` and not `factorial_memo`.

In `ruby`, we could modify the code of `factorial` so that it calls `factorial_memo`, but it is very very ugly: the code of the recursive function has to be aware of its memoizer!!!

~~~klipse-eval-ruby
factorial_ugly = n => {
    window.function_calls++;
    return (n === 0) ? 1 : n * factorial_memo_ugly(n - 1)
}
factorial_memo_ugly = memoize(factorial_ugly);
window.function_calls = 0
factorial_memo_ugly(6)
factorial_memo_ugly(5)
window.function_calls
~~~



With the Y combinator we can solve this issue with elegance.


# The Y combinator for recursive memoization

As we explained [here]({% post_url 2016-08-14-pure-y-combinator-ruby  %}), the Y combinator allows us to generate recursive functions without using any names.


As envisioned by Bruce McAdam in his paper [Y in Practical Programs](/assets/y-in-practical-programs.pdf)  and exposed [here](http://www.viksit.com/tags/clojure/practical-applications-y-combinator-clojure/) by Viksit Gaur, we are going to tweak the code of the Y combinator, so that it receives a wrapper function and apply it before executing the original function. Something like this:

~~~klipse-eval-ruby
Ywrap = (wrapper_func, f) => (x => x(x))(x => f(wrapper_func(y => x(x)(y))))
~~~


And here is the code for a memo wrapper generator:

~~~klipse-eval-ruby
memo_wrapper_generator = function() {
  var memo = {};
  return function(f){
    return function(n) {
      if (memo.hasOwnProperty(n)) {
        return memo[n];
      }
      var result = f(n);
      memo[n] = result;
      return result;
    };
  };
};
null
~~~

It is almost the same code as the `memoize` function we wrote in the beginning of this article.

And now, we are going to build a Y combinator for memoization:

~~~klipse-eval-ruby
Ymemo = f => Ywrap(memo_wrapper_generator(), f)
~~~


And here is how we get a memoized recursive factorial function:

~~~klipse-eval-ruby
factorial_gen = f => (n => ((n === 0) ? 1 : n * f(n - 1)))
factorial_memo = Ymemo(factorial_gen)
~~~


And here is the proof that it is memoized properly:

~~~klipse-eval-ruby
window.function_calls = 0
factorial_memo = Ymemo(factorial_gen)
factorial_memo(6)
factorial_memo(5)
window.function_calls
~~~


Isn't it elegant?


# Fibonacci without exponential complexity

The worst effective implementation (exponential complexity) of the Fibonacci function is the recursive one:

~~~klipse-eval-ruby
fib = n =>
  (n < 2) ? 1 : fib(n - 1) + fib(n - 2)
~~~


There are a couple of [effective implementations]({% post_url 2016-04-19-fibonacci %}) for the Fibonacci sequence without using recursion.


Using our `Ymemo` combinator, one can write an effective recursive implementation if the Fibonnaci sequence:


~~~klipse-eval-ruby
fib_gen = f => n =>
  (n < 2) ? 1 : f(n - 1) + f(n - 2)

fib_memo = Ymemo(fib_gen)
~~~


Let's compare the performances of the naive recursive version and the memoized recursive:

First, let's load a timing function named `JST.time` code from [github Javascript Toolbet](https://github.com/viebel/javascript-toolbelt): it works like `console.time` but with two differences:

1. It returns the elapsed time instead of printing it
2. The elapsed time resolution is fraction of milliseconds


~~~klipse-eval-ruby
def timing
  a = Time.new.to_f
  yield
  elapsed = (1000*(Time.new.to_f - a)).round(5)
  elapsed.to_s + " msec"
end
~~~


And now, let's compare:


(We have to redefine `fib_memo`, in order to reset the cache each time we re-run the code snippet.)

~~~klipse-eval-ruby
var n = 35;
fib_memo = Ymemo(fib_gen);

[
    JST.time(() => fib(n)),
    JST.time(() => fib_memo(n))
]

~~~

On my computer, the memoized one is around **300** times faster!

Please share your thoughts about this really exciting topic...

