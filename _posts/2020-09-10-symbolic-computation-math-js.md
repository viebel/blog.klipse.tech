---
layout: post
title:  Symbolic Computation in JavaScript with Math.js
description: Symbolic Computation in JavaScript with Math.js
date:   2020-09-10 16:08:22 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: D031C550-1687-4391-B7F0-CD7F383062E8
author: Yehonathan Sharvit
minified_plugin: true
tags: [javascript, klipse]
---


[Math.js](http://mathjs.org/index.html) is an extensive math library for JavaScript and Node.js.


`Math.js` comes with a function `math.evaluate` to evaluate expressions. 

In this blog post, we are going to see the `Math.js` evaluator in action with interactive code snippets powered by the [Klipse plugin](https://github.com/viebel/klipse).

![Math](https://pi.tedcdn.com/r/pf.tedcdn.com/images/playlists/hated_math_1200x627.jpg?c=1050%2C550&w=1050)

<pre class="hidden"><code class="language-js" data-external-libs="https://raw.githubusercontent.com/josdejong/mathjs/master/dist/math.min.js">
  Object.keys(math)
</code></pre>


# Simple expressions

Easy power:
~~~eval-js
math.evaluate('sqrt(3^2 + 4^2)'); 
~~~

Implicit multiplication:
  
~~~eval-js
math.evaluate('(2+3)(4+5)');  
~~~

Complex numbers:

~~~eval-js
math.evaluate('sqrt(-1)').toString();
~~~

~~~eval-js
math.evaluate('sqrt(1+i)').toString();  
~~~

Easy trigonometry:

~~~eval-js
math.evaluate('cos(pi)')
~~~
But the real power of `Math.js` comes with the ability to define symbolic expressions...

# Defining symbolic functions

First, we need to create a `scope` for our evaluation environment: The `scope` is a regular JavaScript Object that is used to resolve symbols, and to write assigned variables or function.

~~~eval-js
scope = {}
~~~

Then, we can create functions:
~~~eval-js
math.evaluate('bar(x,y) = (x+y)(x-y)', scope)
~~~

And call them:

~~~eval-js
math.evaluate('bar(10,5)', scope)
~~~


Now, let's check that for any angle, `sinus squared + cosinus squared` equals 1:

~~~eval-js
math.evaluate('amp(x,y) = sqrt(x^2 + y^2)', scope)
~~~

~~~eval-js
math.evaluate('foo(x)=amp(sin(x), cos(x))', scope)
~~~


~~~eval-js
math.evaluate('foo(pi/2)',scope)
~~~

I hope that I have been able to trigger your curiousity about [Math.js](http://mathjs.org/index.html). 

And that you cannot wait to use the [Klipse plugin](https://github.com/viebel/klipse) on your next blog post.

Happy interactive coding!

<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/7.2.0/math.min.js" integrity="sha512-4VdpCxbABk7wjJb/9z/d3EyibeHwUY0FgHbFO4EiIPVtyyV6llhENCvzRk8SH5D86+Jwm6QLagqRRnEJCd3gJg==" crossorigin="anonymous"></script>
