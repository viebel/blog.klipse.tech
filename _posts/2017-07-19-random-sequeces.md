---
layout: post
title:  "It's complex to measure complexity"
description:  "Randomness and Complexity. javascript interactive examples. klipse random sequences"
date:   2017-07-19 07:43:52 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "2B8567D5-3BEA-4751-BD6D-21B6BC9693BE"
author: "Yehonathan Sharvit"
tags: [algo, javascript]
---


Have you ever thought how we can generate random numbers mathematically?

In this article, we are going to present simple algorithms for generating pseudo-random sequences and we will discuss about how we can measure the complexity (i.e. the randomness) of a sequence of numbers.

We will see that indeed, it is complex to measure complexity!

![dices](/assets/dices.jpg)

We will illustrate the mathematical idea of randomness by coding the algorithms and the formulas in `javascript`.

Even if you are not 100% familiar with javascript, you should be able to enjoy this article.

As usual, all the code snippets of this article are interactive - powered by [the KLIPSE plugin](https://github.com/viebel/klipse). Feel free to modify the code in order to get a better feeling of the concepts.

# Algorithms for generating random numbers


## Generating a sequence from seed an next

The simplest way to generate a pseudo-random sequence is to start from a seed number and to provide a `next` function that receives a number and return the next number of the sequence.

Here is a function that generate a pseudo-random sequence of length `n`:

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

Linear congruency formula is parametrized by:

- `k`: the coefficent
- `c`: the offset
- `m`: the period

Here is the code for linear congruency:

(Don't be afraid by the fact that `linearCong` is a function that returns a function!)

~~~eval-js
linearCong = (k, c, m) => (prev) => (k*prev + c) % m
~~~

Let's see `linearCong` in action:

~~~eval-js
linearCongExample = linearCong(19, 51, 101)
linearCongExample(231)
~~~

Now, we can generate a pseudo-random sequence using the linear congruency formula as our `next` function:

(Don't be afraid by the fact that we are using [ES6 destructuring syntax](http://untangled.io/in-depth-es6-destructuring-with-assembled-avengers/)!)

~~~eval-js
linearCongRandomSeq = ({size, seed, k, c, m}) => generateSequence(size, seed, linearCong(k,c,m))
~~~

Let's see `linearCongRandomSeq` in action:

~~~eval-js
linearCongRandomSeq({size: 10, seed: 22, k: 19, c: 3, m:54})
~~~

## Logistic Regression Formula

Logistic Regression is another possible formula for generating pseudo-random sequences:

Here is the formula (parametrized with `r`):

~~~eval-js
regression = (r) => (prev) => r*prev*(1-prev)
~~~

As before, let's generate a sequence using the logistic regression formula (with `r`=3.57):

~~~eval-js
generateSequence(5, 0.5, regression(3.57))
~~~

Feel free to play with the value of `r`

The problem with logistic regression is that the values are between `0` and `1`. 

But its's very simple to scale the values of the sequence and transform the values to integers, by mapping each value of the sequence:


~~~eval-js
logisiticRandomSeq = ({size, seed, r, max}) => generateSequence(size, seed, regression(r)).map(x => Math.round(max*x))
~~~

Let's see it in action:

~~~eval-js
logisiticRandomSeq({size: 10, seed: 0.5, r: 3.57, max: 1e9})
~~~

Feel free to play with all the parameters - but be careful with `size`. If you take a value that is too bug, your browser might crash...

## Javascript random function

In `javascript`, the language provides a `Math.random` function for generating random numbers between `0` and `1`.

Here is how we can plug `Math.random` into our random sequence generation mechanism:

~~~eval-js
rand = (max) => Math.round(max*Math.random())
mathRandomSeq = ({size, max}) => generateSequence(size, rand(max), () => rand(max))
~~~

Let's see `mathRandomSeq` in action:

~~~eval-js
mathRandomSeq({size: 10, max: 1e9})
~~~

Now, that we have seen how to generate pseudo-random sequences, let's see how we can measure the complexity of the sequence. By complexity, we mean the "level of randomness" of the sequence.


# How to measure complexity?


## Period

One simple way to assess the complexity of a sequence, is to count the number of unique elements - the period - of the sequence. If the elemets repeat themselves, the period will be lower than the size of the sequence.

In `javascript`, we have the mathematical `sets` available in the language. 

In a `set` duplicate elements are removed.

Therefore, in order to count the number of unique elements, we can convert our sequence into a `set` and count the number of elements in the resulting set.

~~~eval-js
period = (seq) => (new Set(seq)).size
~~~

### Period of Linear Congruency sequences 

Let's measure the period of psedo-random sequences generated using linear congruency:

~~~eval-js
period(linearCongRandomSeq({size: 100, seed: 22, k: 19, c: 3, m:54}))
~~~

Obviously, the period can never be greater than the value of `m`!

Exercise: Can you find a good combination of `k`, `c` and `m`? By good combination, we mean a combination that generate a sequence whose period is very close to `m`.


### Period of Logistic Regression sequences 

Logistic regression sequences give better results, when we chose an appropriate value for `r`:

~~~eval-js
period(logisiticRandomSeq({size: 1e2, seed: 0.5, r: 3.57, max: 1e4}))
~~~

### Period of javascript random sequences 

Sequences generated with the javascript `Math.random` function seem to perfom even better:

~~~eval-js
period(mathRandomSeq({size: 1e2, max: 1e4}))
~~~

A more precise way of measuring complexity is by checking how much the values of the sequence share common properties. For instance, we can visualize the distribution of the values modulo `n`. If the sequence is perfectly random, then the values modulo `n` should be distributed uniformly.

## Distribution of the values modulo 10


Let's write a function that calculates the distribution of a sequence modulo `10`.

More precisely, the function receives an array of arbitrary length and return an array of length 10 where the `i`th element of the array contains the frequency (in percentage) of the values `x` of the sequence such that `x mod 10 = i`.

Here is the code using `map` and `countBy` provided by [Ramda.js](http://ramdajs.com/):

~~~eval-js
measureRandomness = (seq) => R.map(x => 100*x/seq.length,
                                   R.countBy(x => x % 10)(seq))
~~~


Let's see it in action by measuring the randomness of the sequence of integers from 0 to 999:

~~~eval-js
measureRandomness(R.range(0, 1000))
~~~

Now, let's visualize the randomness in a [Column chart](https://developers.google.com/chart/interactive/docs/gallery/columnchart) powered by google charts:

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

Let's visualize the randomness of our linear congruency sequence:

~~~google-chart
visualizeRandomness(linearCongRandomSeq({size: 10, seed: 22, k: 19, c: 3, m:54}), 'Linear Congruency')
~~~


Feel free to play with the parameters of `linearCongRandomSeq` and see how the chart updates auto-magically.

Let's visualize the randomness of our logistic regression sequence:

~~~google-chart
visualizeRandomness(logisiticRandomSeq({size: 10, seed: 0.5, r: 3.57, max: 1e9}), 'Logistic Regression') 
~~~

Feel free to play with the parameters of `logisiticRandomSeq` and see how the chart updates auto-magically.

Let's visualize the randomness of the javacript random sequence:

~~~google-chart
visualizeRandomness(mathRandomSeq({size: 1e6, max: 1e9}), 'Math.random()') 
~~~

Feel free to play with the parameters of `mathRandomSeq` and see how the chart updates auto-magically.

<script src="//cdnjs.cloudflare.com/ajax/libs/ramda/0.23.0/ramda.min.js"></script>
