---
layout: post
title:  Generative testing in Clojure with test.check
description: Generative testing in Clojure with test.check
date:   2020-09-11 04:11:22 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: 9BC0DFC8-7103-4D6F-895D-73D850C87EA3
author: Yehonathan Sharvit
---


### The idea
[test.check](https://github.com/clojure/test.check) is a `Clojure` property-based testing tool inspired by [QuickCheck](https://en.wikipedia.org/wiki/QuickCheck) from `Haskell`.

The core idea of `test.check` is that instead of enumerating expected input and output for unit tests, you write properties about your function that should
hold true for all inputs.

This lets you write concise, powerful tests.

In a sense it gives you the illusion that you deal with the infinity.


![Infinity](/assets/infinity.jpg)

#### Code examples

First, let's require `test.check`:

<pre><code class="language-eval-clj" data-external-libs="https://raw.githubusercontent.com/clojure/test.check/master/src/main/clojure">
(ns my.test
  (:require [clojure.test.check :as tc]
            [clojure.test.check.generators :as gen]
            [clojure.test.check.properties :as prop :include-macros true]))
</code></pre>


Let's say we're testing a sort function. We want to check that that our sort function is **idempotent** - that is, applying sort twice should be equivalent to
applying it once: `(= (sort a) (sort (sort a)))`. 

Let's write a quick test to make sure this is the case:


~~~eval-clj
(def sort-idempotent-prop
  (prop/for-all [v (gen/vector gen/int)]
    (= (sort v) (sort (sort v)))))

(tc/quick-check 100 sort-idempotent-prop)
~~~

In prose, this test reads: for all vectors of integers, `v`, sorting `v` is equal to sorting `v` twice.

What happens if our test fails? `test.check` will try and find 'smaller' inputs that still fail. This process is called **shrinking**. Let's see it in action:

~~~eval-clj
(def prop-sorted-first-less-than-last
  (prop/for-all [v (gen/not-empty (gen/vector gen/int))]
    (let [s (sort v)]
      (< (first s) (last s)))))

(tc/quick-check 100 prop-sorted-first-less-than-last)
~~~

This test claims that the first element of a sorted vector should be less-than the last. Of course, this isn't true: the test fails with input `[3]`, which gets shrunk down to `[0]`, as seen in the output above.

### Deterministic Randomness

Each time you call `tc/quick-check`, `test.check` generates different test cases - as you can see in this two examples where the failing test cases are always different:

~~~eval-clj
(:fail (tc/quick-check 100 prop-sorted-first-less-than-last))
~~~

~~~eval-clj
(:fail (tc/quick-check 100 prop-sorted-first-less-than-last))
~~~


But what if you want to re-run exactly the same values?

No problem: pass `:seed` to `tc/quick-check` and you'll run always the same values:

~~~eval-clj
(:fail (tc/quick-check 100 prop-sorted-first-less-than-last :seed 1477508406394))
~~~


~~~eval-clj
(:fail (tc/quick-check 100 prop-sorted-first-less-than-last :seed 1477508406394))
~~~


### Shrinking
As your test functions require more  sophisticated input, shrinking becomes critical to being able to understand exactly why a random test failed.
To see how powerful shrinking is, let's come up with a contrived example: a function that fails if it's passed a sequence that contains the number `12`:


~~~eval-clj
(def prop-no-12
  (prop/for-all [v (gen/vector gen/int)]
    (not (some #{12} v))))

(tc/quick-check 100 prop-no-12)
~~~

We see that the test failed on a rather large vector, as seen in the `:fail` key. But then `test.check` was able to shrink the input down to `[12]`, as seen in the keys `[:shrunk :smallest]`.


### zipmap


`(zipmap keys vals)` allows you to creates a map with the `keys` mapped to the corresponding `vals`.

`(keys map)` retrieves the keys of a map.

`(vals map)` retrieves the values of a map.

But how well do they combine together?

According to `keys` and `vals` docstrings, the keys and the values are returned in the same order - the order of `(seq map)`

And indeed, for map with 100 pairs of random integers, `zipmap`, `keys` and  `vals` are consistent:


~~~eval-clj
(def n 100)
(def mm (zipmap (shuffle (range n)) (shuffle (range n))))
[(count mm) (= mm (zipmap (keys mm) (vals mm)))]
~~~

You can try to increase the value of `n` - and it will remain true. But is it a proof? What about keys and values from other types?


Let's check it for sure - using a more advanced random genertor, provided by `test.check`:

~~~eval-clj
(def random-map (gen/map (gen/one-of [gen/keyword gen/string gen/boolean gen/int gen/symbol]) gen/int))
~~~

`(gen/one-of generators)` creates a generator that randomly chooses a value from the list of
`generators`. 

`(gen/map map key-gen val-gen)` creates a generator that generates maps, with keys chosen from `key-gen` and values chosen from `val-gen`.

Let's look at some samples - with `gen/sample`:

~~~eval-clj
(gen/sample random-map)
~~~


Now, we can test the consistency of `zipmap`, `keys` and  `vals`:


~~~eval-clj
(def zipmap-keys-vals-consistency
  (prop/for-all [m (gen/map (gen/one-of [gen/keyword gen/string gen/boolean gen/int gen/symbol]) gen/int)]
                  (= m (zipmap (keys m) (vals m)))))

(tc/quick-check 15 zipmap-keys-vals-consistency)
~~~

It seems that the docstrings were right: `zipmap`, `keys` and  `vals` are consistent.

Check [test.check documentation](http://clojure.github.io/test.check/index.html) for additional functions and explanations.

### Conclusion

I hope that you enjoyed this interactive tutorial about generative testing in `clojure`. This is really a powerful paradigm that might change forever the way you write and think about testing. And who know? Maybe it will catch a bug or two... 

Please forward it to your friends if you liked it and share your critics on [twitter @viebel](https://twitter.com/viebel) or on slack `#klipse` channel.
