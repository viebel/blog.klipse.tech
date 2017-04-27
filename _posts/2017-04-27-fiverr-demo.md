---
layout: post
title:  "Fiverr demo: Funnel Visualization"
description:  "Fiverr demo: Funnel Visualization"
date:   2017-04-27 01:22:44 +0200
categories: data
thumbnail: assets/klipse.png
guid: "380CE61C-4E0D-4FC6-8310-85F236305B24"
author: "@viebel"
draft: true
hidden: true
---

## Introduction

This article demonstrates how to create an interactive business report with data visualization widgets using [Klipse](https://github.com/viebel/klipse) add Google Charts.


Google chart is a solid and rich javascript library for visualization widgets. Be sure to check out [the Google chart Gallery](https://developers.google.com/chart/interactive/docs/gallery).

We will visualize simulated data for a website conversion funnel.

The data of the funnel is in this [Google drive spreadsheet](https://docs.google.com/spreadsheets/d/1kB4B4c0x11SNagYKmjI1ZpHYP-pQn1Hq_N6tlWaWg10/edit#gid=0).

## Raw data grouped by month

~~~google-chart
{
  chartType:'ColumnChart',
  dataSourceUrl:'https://docs.google.com/spreadsheets/d/1kB4B4c0x11SNagYKmjI1ZpHYP-pQn1Hq_N6tlWaWg10/edit?usp=sharing',
  query: 'select A, sum(B), sum(C), sum(D), sum(E) group by A',
  refreshInterval: 5,
  options: {
    height: 400,
  }
}
~~~

Modify the query parameter and the chart will update automagically...

You can also modify the options.


Check out the [Bar chart guide](https://developers.google.com/chart/interactive/docs/gallery/columnchart) for more visulization options. 


## Revenue by Geography for January 2016



~~~google-chart
{
  chartType:'PieChart',
  dataSourceUrl:'https://docs.google.com/spreadsheets/d/1kB4B4c0x11SNagYKmjI1ZpHYP-pQn1Hq_N6tlWaWg10/edit?usp=sharing',
  query: "select F, sum(E) where A = 'Jan 2016' group by F ",
  refreshInterval: 5,  
  options: {
    title: "Revenue by Geography",
    height: 400, 
  },
}  
~~~

Modify the query parameter and the chart will update automagically...

You can also modify the options.

Check out the [Pie chart guide](https://developers.google.com/chart/interactive/docs/gallery/piechart) for more visulization options. 


## Conversion rate by region

~~~google-chart
{
  chartType:'ColumnChart',
  dataSourceUrl:'https://docs.google.com/spreadsheets/d/1kB4B4c0x11SNagYKmjI1ZpHYP-pQn1Hq_N6tlWaWg10/edit?usp=sharing',
  query: "select F, sum(D)/sum(B)  where A = 'Jan 2016' group by F ",
  refreshInterval: 5,  
  options: {
    title: 'Conversion rate by Region',
    series: [
      {color: 'orange', visibleInLegend: false,},
    ],
    height: 400,
    vAxis: {
      format: "#,##0.00%",
      title: 'conversion rate'
    },
    xAxis: {
      title: 'Region'
    }
  } 
}
~~~

Modify the query parameter and the chart will update automagically...

You can also modify the options.

Check out the [Bar chart guide](https://developers.google.com/chart/interactive/docs/gallery/columnchart) for more visulization options. 

