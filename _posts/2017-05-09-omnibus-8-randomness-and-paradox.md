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

It's complex to measure complexity!

I have started to read [The New Turing Omnibus](https://www.goodreads.com/book/show/964709.The_New_Turing_Omnibus) - a book that offers 66 concise, brilliantly written articles on the major points of interest in computer science theory, technology and applications.

From time to time, I will write a blog post presenting a chapter of this book.


![omnibus](/assets/omnibus-turing.jpg)

Today, I am glad to present an interactive version of Chapter 6 about the generation of random numbers.


# Algorithms for generating random numbers

## Generating a sequence from seed an next

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

## Linear Congruency
~~~eval-js
linearCong = (k, c, m) => (prev) => (k*prev + c) % m
~~~

~~~eval-js
linearCong(19, 51, 101)(231)
~~~

~~~eval-js
linearCongRandomSeq = ({size, seed, k,c,m}) => generateSequence(size, seed, linearCong(k,c,m))
~~~

~~~eval-js
linearCongRandomSeq({size: 10, seed: 22, k: 19, c: 3, m:54})
~~~

## Logistic Formula
~~~eval-js
regression = (r) => (prev) => r*prev*(1-prev)
~~~

~~~eval-js
generateSequence(5, 0.5, regression(3.57))
~~~

~~~eval-js
logisiticRandomSeq = ({size, seed, r, max}) => generateSequence(size, seed, regression(r)).map(x => Math.round(max*x))
~~~

~~~eval-js
logisiticRandomSeq({size: 10, seed: 0.5, r: 3.57, max: 1e9})
~~~


## Javascript Math.random

~~~eval-js
rand = (max) => Math.round(max*Math.random())
mathRandomSeq = ({size, max}) => generateSequence(size, rand(max), () => rand(max))
~~~

~~~eval-js
mathRandomSeq({size: 10, max: 1e9})
~~~


# How to measure complexity?

## Period

~~~eval-js
period = (seq) => (new Set(seq)).size
~~~

~~~eval-js
period(linearCongRandomSeq({size: 100, seed: 22, k: 19, c: 3, m:54}))
~~~

~~~eval-js
period(mathRandomSeq({size: 1e4, max: 1e9}))
~~~

~~~eval-js
period(logisiticRandomSeq({size: 1e4, seed: 0.5, r: 3.57, max: 1e9}))
~~~

## Distribution of the values mod n



## The problem

The sequence of integer numbers never repeats and distributes uniformly

# Kolmogorov Complexity

# Paradox 

Most of the sequences are random but no sequence can be proved to be random




# Logistic Formula


# Measure randomness

How do we measure the randomness of a sequence of numbers?
By looking at the repartition of the values mod m?

~~~eval-js
measureRandomness = (seq) => R.map(x => 100*x/seq.length,
                                   R.countBy(x => x % 10)(seq))
~~~


~~~eval-js
visualizeRandomness = (seq, name) => ({
  dataTable: [["n", "%"], ...Object.entries(measureRandomness(seq) )],
  options: {
    showRowNumber: true,
    width: '100%', 
    height: '100%',
    title: `The repartition of the elements of a sequence created by ${name}`,
    vAxis: {
      title: 'percentage',
      viewWindow : {
        min: 0,
      }
    },
    hAxis: {
      title: 'bin'
    }
  }, 
  chartType: "ColumnChart"
})
~~~

<pre><code class="language-google-chart" data-loop-msec="1000">
visualizeRandomness(linearCongRandomSeq({size: 10, seed: 22, k: 19, c: 3, m:54}), 'Linear Congruency')
</code></pre>

<pre><code class="language-google-chart" data-loop-msec="1000">
visualizeRandomness(logisiticRandomSeq({size: 10, seed: 0.5, r: 3.57, max: 1e9}), 'Logistic Regression') 
</code></pre>

<pre><code class="language-google-chart" data-loop-msec="1000">
visualizeRandomness(mathRandomSeq({size: 1e6, max: 1e9}), 'Math.random()') 
</code></pre>



<script src="//cdnjs.cloudflare.com/ajax/libs/ramda/0.23.0/ramda.min.js"></script>
