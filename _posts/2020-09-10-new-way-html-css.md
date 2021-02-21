---
local_klipse: false
layout: post
title:  A new way of blogging about HTML and CSS
description:  A new way of blogging about HTML and CSS
date:   2020-09-10 06:13:14 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: 7A8B36D7-CA57-42F7-9C74-CE8757BF1716
author: Yehonathan Sharvit
tags: [klipse, html]
---



Imagine you want to write a blog post that shows something really cool about `html` and `css`. 

How would you do that? You will probably embed a `jsfiddle`, `jsbin` or `codepen` in your page. The problem is that for each snippet you have to create a page on their server and embed an iframe in your page.

Today, we are going to show a new way of blogging about `html` and `css` in a much more lighweight way: we are going to have our `html` and `css` code in our page and use [the Klipse plugin](https://github.com/viebel/klipse) to transform the code into an interactive code snippet.


## Hello World

First, let's have an interactive `html` "Hello World":

~~~klipse-html
<div> Hello <b> World</b> </div>
~~~

An image:

~~~klipse-html
<p> I have invented HTML </p>
<img src="/assets/tim.jpg" width="300">
~~~

Go ahead, play with the code: it is re-rendered as you type...

And you can even add `css` using the `<style>` tag:

~~~klipse-html
<style>  
#lea {
    display: inline-block;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 0 5px 5px black;
    padding: 5px;
    transition: 0.3s;
}
#lea:hover {
    box-shadow: 0 0 5px 5px green;
}
</style>  
<div> I am a CSS Guru. </div>  
<div> If you hover on my picture, the shadow will change...</div>  
<img id="lea" src="/assets/lea.jpg" width="300"> 
~~~

## SVG

It becomes really cool when you start to play with `SVG`.

Like this:

~~~klipse-html
<svg width="100%" height="400" viewBox="0 0 300 200">
  <path d="M3.9,74.8c0,0,0-106.4,75.5-42.6S271.8,184,252.9,106.9s-47.4-130.9-58.2-92s59.8,111.2-32.9,126.1 S5.9,138.6,3.9,90z"
      fill="none" id="theMotionPath" stroke="brown"/>
  <g stroke-width="2" stroke="black" fill="white">
    <circle r="20"/>
    <circle r="2" cx="-7" cy="-5"/>
    <circle r="2" cx="7" cy="-5"/>
    <path d="M -10 5 Q 0 15 10 5"/>
    <animateMotion dur="4s" repeatCount="indefinite"  rotate="auto">
      <mpath xlink:href="#theMotionPath"/>
    </animateMotion>
  </g>
</svg>
~~~

or like that:

~~~klipse-html
<svg width="100%" height="300">
   <g stroke-width="5" stroke="lightgreen" fill="none"
      transform="translate(150,100) scale(3)"
      style="stroke-dasharray: 3; animation: dash-spin 5s linear infinite;">
    <circle r="20"/>
    <circle r="2" cx="-7" cy="-5"/>
    <circle r="2" cx="7" cy="-5"/>
    <path d="M -10 5 Q 0 15 10 5"/>
    <text x="0" y="35" font-family="Verdana" font-size="30" text-anchor="middle"
          fill="red" stroke="blue" stroke-width="2">
      Klipse
    </text>
  </g>
</svg>
<style>@keyframes dash-spin { to { stroke-dashoffset: 100; } }</style>
</svg>
~~~

## The Grand Finale

And now for the Grand Finale, a **universal Klipse machine**: an `Html` Klipse snippet of an `iframe` of a document that includes Klipse `JavaScript` tag and a `Javascript` and an `HTML` Klipse snippet:

~~~klipse-html
<iframe style="overflow: scroll;" height="450" width="500"  
        srcdoc="  
                <!DOCTYPE html>  
                <head>  
                <meta charset='utf-8'>
                <link rel='stylesheet' type='text/css' href='https://storage.googleapis.com/app.klipse.tech/css/codemirror.css'>
                </head>  
                <h2> A JavaScript interactive snippet:</h2>
                <div class='js'>[1, 2, 3].map((x) => x + 1)</div>
                <h2> An html interactive snippet (this one is completly crazy - don't look at the source):</h2>
                <div class='html'>&amp;lt;div&amp;gt; Hello &amp;lt;b&amp;gt; World&amp;lt;/b&amp;gt; &amp;lt;/div&amp;gt;</div>
                <script>  
                window.klipse_settings = {  
                selector: '.klipse',
                selector_eval_js: '.js',
                selector_eval_html: '.html'
                };
                </script>  
                <script src='https://storage.googleapis.com/app.klipse.tech/plugin/js/klipse_plugin.js'></script>  
                "></iframe>   
~~~

One last thing: [the Klipse plugin](https://github.com/viebel/klipse) supports a couple of languages: [javascript](http://blog.klipse.tech/javascript/2016/06/20/blog-javascript.html), [jsx](http://blog.klipse.tech/javascript/2016/12/14/jsx.html), [es2017](http://blog.klipse.tech/javascript/2016/12/21/es2017-await.html), [python](http://blog.klipse.tech/python/2017/01/04/python-turtle-fractal.html), [ruby](http://blog.klipse.tech/ruby/2016/06/20/blog-ruby.html), [clojure](http://exupero.org/hazard/post/fractals/) and even [brainfuck](http://blog.klipse.tech/brainfuck/2016/12/17/brainfuck.html). 

Give us a star on [github](https://github.com/viebel/klipse/stargazers) if you like this stuff and leave us a comment below to tell you what you think about this new way of blogging....

Big thanks to [Timothy Pratley](https://twitter.com/timothypratley) for the cool `svg` examples and the incredible `Klipse inside Klipse` snippet.

<script>
window.klipse_settings.eval_idle_msec = 1000;
</script>
