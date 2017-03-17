---
layout: post
title:  "A new way of writing Data Driven Documents with Klipse and Google Charts"
description:  "Interactive Data Drive Documents with Google Charts. Klipse. Data Visualization."
date:   2017-03-17 07:42:44 +0200
categories: data
thumbnail: assets/klipse.png
guid: "1810818B-BCB5-4B58-AB6F-3A81CAF19318"
author: "@viebel"
---

## Introduction

This article introduces a new way of writing Data Driven Documents that contains interacive data visualization widgets - using [Klipse](https://github.com/viebel/klipse).

Usually, in order to write a Data Driven Document will powerful data widgets, you need the help of a Software Developer or you do it by yourself but in most cases the document will be made of **static** screen shots of the charts that you generated in Excel for instance.

Another option is to host your document on a data platform that provides data visualization.


[Klipse](https://github.com/viebel/klipse) allows people who are not Software Developers (e.g. Business Analysts, Product Owners, CEOs) to leverage the full power of the javascript visualization libraries without requiring any help from a Software developer.

In this article we will show how a Business Analyst can create an interactive document using [Google Charts](https://developers.google.com/chart/interactive/docs/gallery) - a very powerful and robust javascript Visualization library by `Google`.


With [Klipse](https://github.com/viebel/klipse), it's extremly simple to include Google Charts in any HTML document: **no technical knoledged is required**.


## How it works?

In order to include a Google Chart, you provide the specifications of the chart as a JSON object with threes keys:

- `chartType`: one of the [Google Chart Types](https://developers.google.com/chart/interactive/docs/gallery) e.g. "Table", "ComboChart", "AreaChart", "GeoChart"...
- `options`: the options of the chart as a map - like `title`, `width`, `height` etc... 

For the data of the charts, there are two possibilities:

# Data Included in the page itself

In order to visualize data that is included int the page itself, you specify the `dataTable` key:

- `dataTable`: the data of the chart as an array

# Data Included in a Google Spreadsheet

You can alos visualize data from a Google Spreadsheet, by setting the `dataSourceUrl` and the `query` keys:

- `dataSourceUrl`: the shareable URL of your Google spreadsheet
- `query`: a `SQL`-like query to filter/aggregate your data - as specified [here](https://developers.google.com/chart/interactive/docs/querylanguage#Language_Syntax)

Enough words, let's this it in action...

## Data stored on the page: Coffee Production in the World

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

## Data stored on a Google Spreadsheet: The World Population in 2016

I have imported the World Population Data from [Wikipedia](https://en.wikipedia.org/wiki/List_of_countries_by_population_(United_Nations)) in a [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1uOGdwnpNpLSTFD1iI1hTqMyez0HVimCiNVSpx7OOXvg/edit#gid=0) and made this spreadsheet public.

# Data Table

Let's visualize the Data in a Table:

~~~google-chart
{
  chartType:'Table',
  dataSourceUrl:'https://docs.google.com/spreadsheets/d/1uOGdwnpNpLSTFD1iI1hTqMyez0HVimCiNVSpx7OOXvg/edit#gid=0',
  options: {
    height: 400,
    page:'enable'
  }
}
~~~

## BarChart

Let's visualize the Data as a [Bar chart](https://developers.google.com/chart/interactive/docs/gallery/barchart): we need to select the columns that we want to visualize. We want the country name, the Population in 2016 and the Population in 2015. Therefore, our query is: `'select B, E,F'`: 

~~~google-chart
{
  chartType:'BarChart',
  dataSourceUrl:'https://docs.google.com/spreadsheets/d/1uOGdwnpNpLSTFD1iI1hTqMyez0HVimCiNVSpx7OOXvg/edit#gid=0',
  query: 'select B, E,F',
  options: {
    height: 400,
    page:'enable'
  }
}
~~~

You can play with the query, the chart will re-draw itself immediately.

For example, try:

- `'select B, E where E > 100000000'` to visualize only the highly-populated countries

- `'select B, E where E < 100000'` to visualize only the small countries

# Pie Chart

Now, let's visualiuze the population by Continent as a [Pie chart](https://developers.google.com/chart/interactive/docs/gallery/piechart). We need to aggregate the population by continent. Here is our query: `'select C, sum(E) group by C'`. 

~~~google-chart
{
  chartType:'PieChart',
  dataSourceUrl:'https://docs.google.com/spreadsheets/d/1uOGdwnpNpLSTFD1iI1hTqMyez0HVimCiNVSpx7OOXvg/edit#gid=0',
  query: 'select C, sum(E) group by C',
  options: {
    height: 500,
    is3D: true,
    pieSliceText: 'label',
    title: 'World Population by Continent',
  }
}
~~~

# Geo Chart

Now, let's use the full power of Google to create a [Geo chart](https://developers.google.com/chart/interactive/docs/gallery/geochart).

~~~google-chart
{
  chartType:'GeoChart',
  dataSourceUrl:'https://docs.google.com/spreadsheets/d/1uOGdwnpNpLSTFD1iI1hTqMyez0HVimCiNVSpx7OOXvg/edit#gid=0',
  query: 'select B, E',
  options: {
    height: 800,
    colorAxis: {colors: ['green', 'blue', 'red'],
                minValue: 1000000} 

  }
}
~~~


## Conclusion

Feel free to [contact me](mailto:viebel@gmail.com) if you need help for creating your first Data Driven Interactive Document or if you want to use [Klipse](https://github.com/viebel/klipse) in your organisation for leveraging the power and the simplicity of Data Visualization.

Let us know what you think about this new way of writing Data Driven Documents in the comments below...

## Try it yourself

All you need to do in order to integrate [Klipse](https://github.com/viebel/klipse) in your HTML document, is to add this `javascript` tag at the end of the `body` of your web page:

~~~html
<link rel="stylesheet" type="text/css" href="http://app.klipse.tech/css/codemirror.css">

<script>
    window.klipse_settings = {
	    selector_eval_js: '.language-eval-js',
        selector_google_charts: '.language-google-chart', // css selector for the google charts elements that contain the charts specifications
    };
</script>
<script src="http://app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"></script>
~~~

By the way, this is exactly what we did on the page that you are currently reading.


