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

~~~eval-js
var width = 960,
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

var title = d3.select("h1");
~~~

<div id="map"></div>



~~~eval-js
function ready(error, world, names) {
  if (error) throw error;

  window.globe = {type: "Sphere"};
  window.land = topojson.feature(world, world.objects.land);
  window.countries = topojson.feature(world, world.objects.countries).features;
  window.borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });
   window.n = countries.length;

  window.countries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  transition();
}
~~~

~~~eval-js

  var i = -1;

  function transition() {
    d3.transition()
        .duration(1250)
        .each("start", function() {
          title.text(countries[i = (i + 1) % n].name);
        })
        .tween("rotate", function() {
          var p = d3.geo.centroid(countries[i]),
              r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            c.clearRect(0, 0, width, height);
            c.fillStyle = "#ccc", c.beginPath(), path(land), c.fill();
            c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
            c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
            c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
          };
        })
    .transition()
     .each("end", transition);
  }
~~~


~~~eval-js
d3.select(self.frameElement).style("height", height + "px");
~~~


~~~eval-js

queue()
    .defer(d3.json, "/assets/world-110m.json")
    .defer(d3.tsv, "/assets/world-country-names.tsv")
    .await(ready);
	
~~~
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="//d3js.org/queue.v1.min.js"></script>
<script src="//d3js.org/topojson.v1.min.js"></script>
