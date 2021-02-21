---
layout: post
title:  Procedural Texture Generator in JavaScript
description: Procedural Texture Generator in JavaScript
date:   2020-09-10 06:23:22 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: B927BB68-F143-4492-9AE5-5DC4478725F7
author: Yehonathan Sharvit
minified_plugin: true
tags: [algo, javascript]
---


The code snippets are powered by the [Klipse plugin](https://github.com/viebel/klipse).

First, let's load [texgen.js](https://github.com/mrdoob/texgen.js) - a Procedural Texture Generator javascript library - from github:

<pre>
<code class="language-eval-js" data-external-libs="https://raw.githubusercontent.com/mrdoob/texgen.js/master/src/TexGen.js">
Object.keys(TG).length;
</code></pre>

<pre class="hidden">
<code class="language-eval-js">
function render(texture) {
  container.innerHTML = "";  
  container.appendChild(texture.toCanvas());
}
</code></pre>

Now, let's create a nice texture:

<pre>
<code class="language-eval-js" data-preamble="container =document.getElementById('c0');">
var texture = new TG.Texture( 256, 256 )
    .add( new TG.XOR().tint( 1, 0.5, 0.7 ) )
    .add( new TG.SinX().frequency( 0.004 ).tint( 0.5, 0, 0 ) )
    .mul( new TG.SinY().frequency( 0.004 ).tint( 0.5, 0, 0 ) )
    .add( new TG.SinX().frequency( 0.0065 ).tint( 0.1, 0.5, 0.2 ) )
    .add( new TG.SinY().frequency( 0.0065 ).tint( 0.5, 0.5, 0.5 ) )
    .add( new TG.Noise().tint( 0.1, 0.1, 0.2 ) );

render(texture);
</code></pre>

<div id="c0"></div>

Go ahead! Feel free to play with the code above and see how the texture is rendered as you modify the code.

The library is not well documented, but the function names are quite expressive...


And here is another texture:

<pre>
<code class="language-eval-js" data-preamble="container =document.getElementById('c1');">

var texture = new TG.Texture( 256, 256 )
					.add( new TG.SinX().offset( - 16 ).frequency( 0.03 ).tint( 0.1, 0.25, 0.5 ) )
					.add( new TG.SinY().offset( - 16 ).frequency( 0.03 ).tint( 0.1, 0.25, 0.5 ) )
					.add( new TG.Number().tint( 0.75, 0.5, 0.5 ) )
					.add( new TG.SinX().frequency( 0.03 ).tint( 0.2, 0.2, 0.2 ) )
					.add( new TG.SinY().frequency( 0.03 ).tint( 0.2, 0.2, 0.2 ) )
					.add( new TG.Noise().tint( 0.1, 0, 0 ) )
					.add( new TG.Noise().tint( 0, 0.1, 0 ) )
					.add( new TG.Noise().tint( 0, 0, 0.1 ) );

render(texture);
</code></pre>

<div id="c1"></div>

Enjoy the code interactivity!

The code snippets are powered by the [Klipse plugin](https://github.com/viebel/klipse).

<style>
canvas {
  border: rgb(35, 41, 45) 1px solid;
  margin: 10px 20px;
}
			
</style>
