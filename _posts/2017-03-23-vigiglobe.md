---
layout: post
title:  "Vigiglobe"
description:  "Vigiglobe"
date:   2017-03-23 18:22:44 +0200
categories: data
thumbnail: assets/klipse.png
guid: "3CDBB636-ADDE-4EEA-9A83-E20B94676FA7"
author: "@viebel"
minified_plugin: true
hidden: true
draft: true
---


# Vigiglobe 

[Vigiglobe](http://vigiglobe.com/) is a data platform that leverages the power of social media content in real-time.

In this article, we are going to visualize the top 10 countries with the highest numbers of tweets of earthquakes over the last 10 minutes.

We are using [WIZR API](http://api.wizr.io/index.html) to fetch the data, this is the JSON endpoint that we use: [http://api.wizr.io/api/statistics/v1/geoloc?level=country&project_id=vigiglobe-Earthquake](http://api.wizr.io/api/statistics/v1/geoloc?level=country&project_id=vigiglobe-Earthquake){:target="_blank"}.

The globe fetches new data from WIZR every 60 seconds.

There is also a refresh button.

<style>

pre {
visibility: hidden;
height: 0px;
}

#map-container {
height: 1000px;
widht: 1000px;
}

.map-contained-dev {
position: fixed;
top: 200px;
height: 500px;
width: 1000px;
z-index: 99999;
background-color: white;
}




#country-name {
  position: absolute;
  top: 500px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 18px;
  text-align: center;
  width: 960px;
  font-size: larger;
  font-weight: bold;
}

</style>

~~~eval-js
var width = 960
    height = 960;

var projection = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .scale(width / 2 - 20)
    .clipAngle(90)
    .precision(0.6);

d3.select("#map").text("");

var canvas = d3.select("#map").append("canvas")
    .attr("width", width)
    .attr("height", height);

var c = canvas.node().getContext("2d");
var path = d3.geo.path()
    .projection(projection)
    .context(c);

var title = d3.select("#country-name");
~~~

<div id="map-container">
<div style="position: relative;">
<div id="country-name"></div>
<div id="map"></div>
<button id="refresh">Refresh</button>
</div>
</div>



~~~eval-js
function ready(error, world, names, earthquakes) {
  if (error) throw error;
  window.eartquakes = earthquakes;
  window.selectedCountries = Object.values(window.eartquakes.data).reduce((res, x) => {
	  res[x.country_name] = x
	  return res
	}, {})
  window.globe = {type: "Sphere"};
  window.land = topojson.feature(world, world.objects.land);
  var countries = topojson.feature(world, world.objects.countries).features;
  window.borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

  window.allCountries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  window.countries = window.allCountries.filter(function(d) {
    return selectedCountries.hasOwnProperty(d.name);
  }).sort(function(a,b) {
      return selectedCountries[b.name].messages[0][1] -   selectedCountries[a.name].messages[0][1];
  });
  
  window.displayedCountryIdx = -1;
  transition();
}
~~~


~~~eval-js

function transition() {
  d3.transition()
    .duration(1250)
    .each("start", nameCountry)
    .tween("rotate", markCountry)
    .transition()
    .each("end", transition);
}
~~~

~~~eval-js
function nameCountry() {
    var n = countries.length;
	displayedCountryIdx = (displayedCountryIdx + 1) % n;
	var name = countries[displayedCountryIdx].name;
    title.text('#' + (displayedCountryIdx + 1) + ' '+ name + ': ' + selectedCountries[name].messages[0][1] + ' events');
  }
~~~

~~~eval-js
function markCountry() {
    var p = d3.geo.centroid(countries[displayedCountryIdx]),
        r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
    return function(t) {
      projection.rotate(r(t));
      c.clearRect(0, 0, width, height);
      c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
      c.fillStyle = "#f00", c.beginPath(), path(countries[displayedCountryIdx]), c.fill();
      c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
      c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
    };
  }
~~~

~~~eval-js
d3.select(self.frameElement).style("height", height + "px");
~~~

~~~eval-js
function loadData() {
queue()
    .defer(d3.json, "/assets/world-110m.json")
    .defer(d3.tsv, "/assets/world-country-names.tsv")
	.defer(d3.json, "http://api.wizr.io/api/statistics/v1/geoloc?level=country&project_id=vigiglobe-Earthquake")
    .await(ready);
}
~~~

~~~eval-js
document.getElementById("refresh").onclick = loadData;
~~~

<pre><code class="language-eval-js" data-loop-msec="60000">
loadData()
</code></pre>


<script src="//d3js.org/d3.v3.min.js"></script>
<script src="//d3js.org/queue.v1.min.js"></script>
<script src="//d3js.org/topojson.v1.min.js"></script>
