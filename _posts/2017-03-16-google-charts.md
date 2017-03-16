---
layout: post
title:  "Interactive Business Report with Google Charts"
description:  "Interactive Business Report with Google Charts"
date:   2017-03-16 01:42:44 +0200
categories: data
thumbnail: assets/klipse.png
guid: "1810818B-BCB5-4B58-AB6F-3A81CAF19318"
author: "@viebel"
---

## Introduction

This article demonstrates how to create an interactive business report with data visualization widgets using [Klipse](https://github.com/viebel/klipse).

Usually, there are two types of data-driven reports:

- advanced reports written by Software Developers
- Static reports written by Business Analysts with *static* screen shorts of the charts - generated in Excel for instance
- Live reports written by Business Analysts hosted on data platforms like Jupyter


(https://github.com/viebel/klipse) allows the author of a business report to get the full power of the javascript visualization libraries without requiring any help from a Software developer.

For instance, in this article we will show how a Business Analyst can create interactive google charts widgets - simply by providing the specifications of the chart as a JSON object with threes keys:

- `data`: the data of the chart as an array
- `options`: the options of the chart as a map.
- `chartType`: the Google chart type e.g. "Table", "ComboChart", "AreaChart" etc...



## Coffee Production in the World

In this article, we use [Google Charts](https://developers.google.com/chart/interactive/docs/) to visualize the coffee production in the world.

Here is the data that we are going to use in this article: The production of coffee in million of cups by year and by country.

The format of the data is a JSON array (in the future, we will support more formats like CSV and data coming from an HTTP endpoint).

<pre><code class="language-klipse-eval-js" data-async-code="true">
window.coffeeData = [
    ['Year', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
    ['2012',  165,      938,         522,             998,           450,      614.6],
    ['2013',  135,      1120,        599,             1268,          288,      682],
    ['2014',  157,      1167,        587,             807,           397,      623],
    ['2015',  139,      1110,        615,             968,           215,      609.4],
    ['2016',  136,      691,         629,             1026,          366,      569.6]
  ]
</code></pre>

When the reader modifies the data, the charts are updated immediately (give it a try)...

# Data Table

First, let's look at the data in a sortable data table - using a [Table chart](https://developers.google.com/chart/interactive/docs/gallery/table):


<pre><code class="language-google-chart" data-loop-msec="1000">
{
  dataTable: coffeeData,
  options: {
    showRowNumber: true,
    width: '100%', 
    height: '100%'
  },
  chartType: "Table"
}

</code></pre>

# Combo Chart

Now, let's visualize the data with a [Combo chart](https://developers.google.com/chart/interactive/docs/gallery/table):

(Feel free to modify the options - the chart will re-draw itself immediately...)

<pre><code class="language-google-chart" data-loop-msec="1000">
{
  dataTable: coffeeData,
  options: {
    title : 'Annual Coffee Production by Country',
    legend: {position: 'top', maxLines: 3},	
    vAxis: {title: 'Million of Cups'},
    hAxis: {title: 'Year'},
    seriesType: 'bars',
	height: 500,
    series: {5: {type: 'line'}}
  },
  chartType: "ComboChart"
}
</code></pre>


# Area Chart

Let's see if we get more interesting insights when we visualize the data as an [Area chart](https://developers.google.com/chart/interactive/docs/gallery/areachart):

(Again, feel free to modify the options - the chart will re-draw itself immediately...)


<pre><code class="language-google-chart" data-loop-msec="1000">
{
  dataTable: coffeeData,
  options: {
    title : 'Annual Coffee Production by country',
    hAxis: {title: 'Year'},
    legend: {position: 'top', maxLines: 3},
    vAxis: {minValue: 0, title: "Million of Cups"}
  },
  chartType: "AreaChart"
}
</code></pre>

## Conclusion

Let us know what you think about this interactive charts in the comments below...

