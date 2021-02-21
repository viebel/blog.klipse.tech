---
layout: post
title:  Lodash playground
description:  Lodash playground. javascript. functional programming.
date:   2017-09-28 7:43:52 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: 1E7545BB-CD67-4A94-8EB2-9FA3731358E7
author: Yehonathan Sharvit
tags: [javascript]
---


[Lodash](https://lodash.com/) is a modern JavaScript utility library delivering modularity, performance & extras.

You have probably used Lodash in one of your projects. 

Wouldn't it be great if every javascript developer could experiment Lodash in her browser without needing to install anything or to create a JsFiddle?

Today, this dream comes true. In this blog post, you can play with Lodash functions. Experiment the edge cases of the API. Compose a short gist and check if it works as expected....

The interactive code snippets are powered by [Klipse](https://github.com/viebel/klipse). 


Go ahead! Enjoy! Reconnect with your inner child!


![Playground](/assets/playground-girl.jpg)


My personal fun session with Lodash, was to write a function that receives an array and calculate the frequency of its elements.

First try was to use `countBy`:

~~~eval-js
_.countBy([1,2,3])
~~~

Now, we need to divide each value by the length of the array. 
For that we need to write a function that receives an object and maps its values:

~~~eval-js
function mapVals(obj, f) {
  return _.zipObject(_.keys(obj), _.map(_.values(obj), f))
}
~~~

Let's check our code:

~~~eval-js
mapVals({a: 1, b: 2, c:3}, x => x*x)
~~~

Now, we have all the lego pieces for writing our `frequencies` function:

~~~eval-js
function frequencies(arr) {
    return mapVals(_.countBy(arr), occurences => occurences/arr.length);
}
~~~

It seems to work:

~~~eval-js
frequencies(["aa", "aa", "bb"])
~~~

Now it's your turn to play.

In case you don't remember how a specific function works, Lodash documentation is just [here](https://lodash.com/docs/4.17.4).

~~~eval-js
~~~

~~~eval-js
~~~

~~~eval-js
~~~

Are you proud of the function that you created?

Feel free to share it in the comments below...

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js" integrity="sha256-8E6QUcFg1KTnpEU8TFGhpTGHw5fJqB9vCms3OhAYLqw=" crossorigin="anonymous"></script>
