---
layout: post
title:  "In javascript, setTimeout is forced to be >= 4 msec"
description:  "In javascript, setTimeout is forced to be >= 4 msec. 0 delay timer. postMessage. asynchronous."
date:   2016-11-01 01:12:54 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "07407DA4-151B-4AE0-AC13-779965B1E3B5"
author: "@viebel"
minified_plugin: true
klipse_eval_idle_msec: 3000
---

Javascript is a language full of surprises: there are the `good parts` and the `bad parts`. Today, I discovered that `setTimeout` featured a minimal delay of 4 msec.

This is well documented in [Reasons for delays longer than specified](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout#Reasons_for_delays_longer_than_specified).

But I wonder, how many experienced javascript developers are aware of this weird behaviour.

What about you?

Did you know that the minimal delay of `setTimeout` was 4 msec?


In this article, we are going to:

1. demonstrate the 4 sec delay added by the browser when one uses a `setTimeout` with 0 delay.
2. demonstrate how to write 0-delay timers using `postMessage`.

![Stop](/assets/stopwatch.jpg)

# Code example

All the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated after 3 seconds of inactivity of if you press `Ctrl-Enter` inside the code snippet.


We're going to need those printing helper functions in order to print the elapsed time - just below the code snippets:


~~~klipse-eval-js
function printTimeout (txt) {
  document.getElementById("timeout").innerText = txt;
}
function printZeroTimeout (txt) {
  document.getElementById("zero-timeout").innerText = txt;
}
~~~

# The 4 msec delay in action

Here is the  code that demonstrates the 4-msec delay - calling `setTimeout` recursively 100 times with a `0` delay.

As you can see by yourslef, the execution time for 100 iterations is around 400 msec.

You might need to reevaluate the snippet - for some reason the first evaluation takes much more time.

Press `Ctrl-Enter` inside the code snippet or modify the code and wait for 3 seconds...


<pre><div class="language-klipse-eval-js">

function bar(iterations) {
  if(iterations === 0) {
    printTimeout("done in: " + (new Date() - startTimeout)+ " msec")
  }
  else {
  setTimeout(bar, 0, iterations - 1);
  }
  }

startTimeout = new Date();
printTimeout("Start");
bar(100);

</div><div id="timeout">Empty</div></pre>


Amazing. No?

# The solution for fast timeouts

If we want to have a `0 msec` timer, we have to use `postMessage`.

So, let's do it and take the following code from [setTimeout with a shorter delay](https://dbaron.org/log/20100309-faster-timeouts).

`setZeroTimeout` takes a single argument: the callback function that is going to be called with 0 delay - but asynchronously.

~~~klipse-eval-js
(function() {
    var timeouts = [];
    var messageName = "zero-timeout-message";

    function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, "*");
    }

    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                var fn = timeouts.shift();
                fn();
            }
        }
    }
    window.addEventListener("message", handleMessage, true);
    window.setZeroTimeout = setZeroTimeout;
})();
~~~

And now, let's see it in action - in my browser, it takes around 17 msec for 100 iterations.

Again, you might need to reevaluate the snippet - as the first evaluation takes much more time.

Press `Ctrl-Enter` inside the code snippet or modify the code and wait for 3 seconds...

<pre><div class="language-klipse-eval-js">
function runBaz(iterations) {
  function baz() {
    if(--iterations === 0) {
      printZeroTimeout("done in: " + (new Date() - startZeroTimeout) + " msec")
    }
    else {
      setZeroTimeout(baz);
    }
  }
  baz();
}

startZeroTimeout = new Date();
printZeroTimeout("OK");
runBaz(100);
</div><div id="zero-timeout">Empty</div></pre>



By the way, what do you think about the interactive code snippets powered by [KLIPSE](https://github.com/viebel/klipse)?

You might what to give a star on [Github](https://github.com/viebel/klipse)...
