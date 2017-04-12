---
layout: post
title:  "Interactive Plotting of Functions"
title:  "Interactive Plotting of Functions"
date:   2017-03-28 04:42:44 +0200
categories: data
thumbnail: assets/klipse.png
guid: "2FAB7E07-E473-499D-9A0D-3AA277546FC7"
author: "Yehonathan Sharvit"
hidden: true
draft: true
---


## Introduction

This article demonstrates how to create an interactive business report with data visualization widgets using [Klipse](https://github.com/viebel/klipse).



## Function plots

In this article, we use a plotter named [Function Plot](http://maurizzzio.github.io/function-plot/).





## The probability of prime numbers

In terms of probability, the prime number theorem states that if you pick a natural number x at random, the probability P(x) that that number will be a prime number is about 1 / ln(x). This means that the average gap between consecutive prime numbers among the first x integers is approximately ln(x).


~~~plot
{
  xAxis: {
    type: 'log', 
    domain: [1e6, 1e9]
  },
  yAxis: {
    domain: [0, .1] 
  },
  data: [{
    fn: '1/log(x)'
  }]
}	
~~~

## Multiple graphs on the same chart


~~~plot
{
  data: [
    { fn: 'x', color: 'pink' },
    { fn: '-x' },
    { fn: 'x * x' },
    { fn: 'x * x * x' },
    { fn: 'x * x * x * x' }
  ]
}
~~~

## Integrals


~~~plot
{
  xAxis: {
    type: 'log',
    domain: [0.01, 1]
  },
  yAxis: {
    domain: [-100, 100] 
  },
  grid: true,
  data: [{
    fn: '1/x * cos(1/x)',
    // to make it look like a definite integral
    closed: true
  }]
}
~~~

## Derivative

if updateOnMouseMove is set to true then tangent line is computed whenever the mouse is moved inside the canvas (let x0x0 be the mouse's abscissa then the tangent line to the point (x0,f(x0))(x0,f(x0)) is computed whenever the position of the mouse changes)


~~~plot
{
  yAxis: {domain: [-1, 9]},
  data: [{
    fn: 'x^2',
    derivative: {
      fn: '2 * x',
      updateOnMouseMove: true
    }
  }]
}
~~~

<style>
.klipse-container:not(:empty)   {
    background-color: white;
    border: solid gray 1px;
    margin-top: 5px;
}
</style>


