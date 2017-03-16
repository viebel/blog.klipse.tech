---
layout: post
title:  "Interactive Business Report"
description:  "Interactive Business Report"
date:   2017-03-16 01:42:44 +0200
categories: data
thumbnail: assets/klipse.png
guid: "1810818B-BCB5-4B58-AB6F-3A81CAF19318"
author: "@viebel"
draft: true
hidden: true
---



## Coffee Prduction in the World

<pre class="hidden"><code class="language-klipse-eval-js">
window.coffeeData = [
    ['Year', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua New Guinea', 'Rwanda', 'Average'],
    ['2012',  165,      938,         522,             998,           450,      614.6],
    ['2013',  135,      1120,        599,             1268,          288,      682],
    ['2014',  157,      1167,        587,             807,           397,      623],
    ['2015',  139,      1110,        615,             968,           215,      609.4],
    ['2016',  136,      691,         629,             1026,          366,      569.6]
  ];

</code></pre>

# Raw Data

Let's look at the raw data, as it is returned from the API or the Database:

~~~klipse-eval-js
var json = {
  data: coffeeData,
  options: {
    showRowNumber: true,
    width: '100%', 
    height: '100%'
  },
  chartType: "Table"
};


drawGoogleChart(json, klipse_container);
~~~

# Combo Chart

Let's visualize the data as a Combo chart:

(Feel free to modify the options - the chart will re-draw itself immediately...)

~~~klipse-eval-js

var json =   {
  data: coffeeData,
  options: {
    title : 'Monthly Coffee Production by Country',
    legend: {position: 'top', maxLines: 3},	
    vAxis: {title: 'Million of Cups'},
    hAxis: {title: 'Year'},
    seriesType: 'bars',
    series: {5: {type: 'line'}}
  },
  chartType: "ComboChart"
};


drawGoogleChart(json, klipse_container);
~~~


# Area Chart

Let's see if we get more interesting insights when we visualize the data as a Area chart:

(Again, feel free to modify the options - the chart will re-draw itself immediately...)

~~~klipse-eval-js
var json =   {
  data: coffeeData,
  options: {
    title : 'Monthly Coffee Production by country',
    hAxis: {title: 'Year'},
    legend: {position: 'top', maxLines: 3},
    vAxis: {minValue: 0, title: "Million of Cups"}
  },
  chartType: "AreaChart"
};

drawGoogleChart(json, klipse_container);
~~~

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script>
 google.charts.load('current', {'packages':['corechart', 'table']});
 //google.charts.setOnLoadCallback(drawVisualization);
</script>

<script>
function drawGoogleChart(dataAndOptions, container) {
  var data = google.visualization.arrayToDataTable(dataAndOptions.data);
  var options = dataAndOptions.options;
  var chartType = dataAndOptions.chartType;
  try {
  var chartConstructor = google.visualization[chartType];
  } catch (e) {
  throw "The chartType is not valid: " + chartType;
  }
  var chart = new chartConstructor(container);

  chart.draw(data, options);
}
</script>
