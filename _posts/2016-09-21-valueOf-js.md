---
layout: post
title:  "Fun with valueOf in javascript"
description:  "Fun with valueOf in javascript"
date:   2016-09-21 04:21:32 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "3e33d72a-7fbb-11e6-8909-600308a46268"
author: Yehonathan Sharvit
minified_plugin: true
---

Javascript is a language full of surprises: there are the `good parts` and the `bad parts`. Today, I discovered [valueOf](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf). I'll let you decide to what parts of javascript `valueOf` belongs...


![good parts](/assets/js_good_parts.jpg)


# A pure function that is not pure

The following [interactive code snippet](https://github.com/viebel/klipse) is based on [Is Your Javascript function actually pure?](http://staltz.com/is-your-javascript-function-actually-pure.html).


Have a look at this (simple?) javascript function and ask yourself whether it is a [pure function](https://en.wikipedia.org/wiki/Pure_function) or not.

> Does the following function always returns the same result given the same argument?

~~~klipse-eval-js
function sum(arr) {
    var z = 0;
    for (var i = 0; i < arr.length; i++) {
        z += arr[i];
    }
    return z;
}
~~~

If you are like [the majority of javascript developers](https://twitter.com/andrestaltz/status/768833714990309376), you probably think that the answer is: `YES`.


But the correct answer is: `NO`.


Here is the proof:

~~~klipse-eval-js
var arr = [{}, {}, {}];
arr[0].valueOf = arr[1].valueOf = arr[2].valueOf = Math.random;
sum(arr)
~~~


Calling `sum` another time with the same argument:

~~~klipse-eval-js
sum(arr)
~~~

But not the same result.

And once again, for the fun:

~~~klipse-eval-js
sum(arr)
~~~

Someone wrote in [Reddit](https://www.reddit.com/r/learnjavascript/comments/53rrhb/a_couple_of_weird_examples_with_valueof_in/d7vvsd5) that we can also hack the `sum` function using `Object.defineProperty`. Like this:

~~~klipse-eval-js
arr_with_get = [0,0,0];
arr_with_get.forEach(function(o, i, a) {
      Object.defineProperty(a, i, {get:Math.random});
});
~~~

And indeed, `sum` returns different results with the same input:

~~~klipse-eval-js
sum(arr_with_get)
~~~

~~~klipse-eval-js
sum(arr_with_get)
~~~

# An impossible assertion that is true

Another weird example is shown in [Object.prototype.valueOf, Coercion, and Comparison Hackery in JavaScript](http://raghuvirkasturi.com/2015/04/14/guest-post-object-prototype-valueof-coercion-and-comparison-hackery-in-javascript/).


> We are going to provide an object that will make the following (impossible) assertion be true

~~~javascript
(mysteryObject < 1) && (mysteryObject > 1)
~~~


Here is the [interactive code snippet](https://github.com/viebel/klipse) for `mysteryObject`:

~~~klipse-eval-js
var mysteryObject = (function() {  
      var cachedValue = -2;
        return {
                valueOf: function() { return cachedValue += 2; }
                  };
})();

(mysteryObject < 1) && (mysteryObject > 1)
~~~


# Conclusion

Did you like it? Does `valueOf` belong to the `good parts` or to the `bad parts` of javascript?

What do you think about the interactive code snippets powered by [KLIPSE](https://github.com/viebel/klipse)?

