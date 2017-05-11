---
layout: post
title:  "Turing Omnibus #6: Randomness and Paradoxes"
descrition:  "Turing Omnibus #6: Randomness and Paradoxes. Kolmogorov Chaitin Complexity. Halting problem."
date:   2017-05-09 07:43:52 +0200
categories: omnibus
thumbnail: assets/klipse.png
guid: "2B8567D5-3BEA-4751-BD6D-21B6BC9693BE"
author: "Yehonathan Sharvit"
draft: true
hidden: true
---


I have started to read [The New Turing Omnibus](https://www.goodreads.com/book/show/964709.The_New_Turing_Omnibus) - a book that offers 66 concise, brilliantly written articles on the major points of interest in computer science theory, technology and applications.

From time to time, I will write a blog post presenting a chapter of this book.


![omnibus](/assets/omnibus-turing.jpg)

Today, I am glad to present an interactive version of Chapter 6 about random numbers.


## The algorithm for generating random numbers



~~~eval-js
linearCong = (k, c, m) => (prev) => (k*prev + c) % m
~~~

~~~eval-js
linearCong(19, 51, 101)(231)
~~~



~~~eval-js
generateSequence = (n, seed, next)  => {
  let seq = new Array(n);
  seq[0] = seed;
  for(let i=1; i< n; i++) {
    seq[i] = next(seq[i-1])
  }
  return seq
}
~~~

~~~eval-js
generateSequence(10, 5, linearCong(19,22,15))
~~~


~~~eval-js
MAX_PERIOD = 1e3
period = (seed, next)  => {
  let s = new Set(),
      prev = seed
  s.add(seed)
  for(let i=1; i< MAX_PERIOD; i++) {
    curr = next(prev)
    if(s.has(curr)) {
      return i
    }
    s.add(curr)
    prev = curr
  }
  throw new Error(`the period of the sequence is greater than ${MAX_PERIOD}`)
}
~~~

~~~eval-js
period(5, linearCong(19,22,15000))
~~~


# Logistic Formula

~~~eval-js
regression = (r) => (prev) => r*prev*(1-prev)
~~~

~~~eval-js
generateSequence(34, 0.5, regression(3.5))
~~~

~~~eval-js
a=0.3
b=0.9
generateSequence(34, 0.5, regression(3.57)).map(x => Math.round(1e9*(x - a)/(b-a)))
~~~

~~~eval-js
period(.5, regression(3.57)) 
~~~


How do we measure the randomness of a sequence of number?
By looking at the repartition of the values mod m?

~~~eval-js
measureRandomness = R.countBy(x => x % 10)
~~~

~~~eval-js
freqs = measureRandomness(generateSequence(1e4, 0.5, regression(3.57)).map(x => Math.round(1e9*(x - a)/(b-a))))
~~~

<pre><code class="language-google-chart" data-loop-msec="1000">
{
  dataTable: [["n", "count"], ...Object.entries(freqs)],
  options: {
    showRowNumber: true,
    width: '100%', 
    height: '100%',
    hAxis: {
      viewWindow : {
        min: 0
      }
    }
  }, 
  chartType: "BarChart"
} 
</code></pre>

<script src="//cdnjs.cloudflare.com/ajax/libs/ramda/0.23.0/ramda.min.js"></script>
