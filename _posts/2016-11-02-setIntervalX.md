---
layout: post
title:  "setInterval with limited number of iterations"
description:  "setInterval with limited number of iterations"
date:   2016-11-01 01:12:54 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "53BC6A1A-BA1B-4527-A2B2-FF741CF4C9EE"
author: "@viebel"
minified_plugin: true
draft: true
hidden: true
klipse_eval_idle_msec: 5000
---


~~~klipse-eval-js
function printInterval (txt) {
  document.getElementById("interval").innerText = txt;
}
~~~


<pre><div class="language-klipse-eval-js">
setIntervalX = function (callback, delay, repetitions, onCompleted) {
  var x = 0;
  var intervalID = window.setInterval(function () {
    callback();
    if (++x === repetitions) {
      window.clearInterval(intervalID);
      if(onCompleted) {
        onCompleted();
      }
    }
  }, delay);
}


let startInterval = new Date();
printInterval("Start");

setIntervalX(function(){},
             0,
             100,
             function() {
  printInterval("done in: " + (new Date() - startInterval) + " msec");
});
</div><div id="interval">Empty</div></pre>



# Conclusion

What do you think about the interactive code snippets powered by [KLIPSE](https://github.com/viebel/klipse)?

