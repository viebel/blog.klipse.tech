---
layout: post
title:  Manipulate immutable collections with no performance hit.
description:  Manipulate immutable collections with no performance hit. Immutable.js and lodash.js. JavaScript live tutorial.
date:   2020-11-09 02:21:34 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: FD815449-8850-4FFE-AD0B-976082BD40D4
author: Yehonathan Sharvit
minified_plugin: true
tags: [javascript]
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/immutable/4.0.0-rc.12/immutable.min.js" integrity="sha512-OA48phPVdkQE2u9b6nhv71zeq9zvwc6oLq3IVWLw8WfRlcRO/+6zhUcWZxfXi75agm3bfqCxIdstBfK/g6fYvw==" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js" integrity="sha512-90vH1Z83AJY9DmlWa8WkjkV79yfS2n2Oxhsi2dZbIv0nC4E6m5AbH8Nh156kkM7JePmqD6tcZsfad1ueoaovww==" crossorigin="anonymous"></script>

Constraining our programs to manipulate **immutable data structures** is [known to be beneficial]({% post_url 2020-10-02-immutable-data %}) in terms of code predictability, concurrency and safety.

In a language like Clojure, where immutable data structures are native to the language, this benefits come for free.
However, in languages where immutable data structures are not **native** to the language, the **price** we have to pay to benefit from data immutability is that we need to **convert the data back and forth** from immutable to native. Beside the inconvenience of this conversion, it might cause a **performance hit**, it we are not careful with the conversion.

![Car](/assets/fast-car-infiniti.jpg)

The purpose of the is article is to illustrate how to manipulate carefully immutable data collection from Immutable.js with the a data manipulation library like Lodash.js, leveraging Immutable's **shallow and deep conversion** functions.

A similar approach could be applied to other immutable data collection libraries and other data manipulation libraries (and also to other programming languages).


Imagine we have a nested piece of data that we want to:

1. Treat as **immutable** (e.g Immutable.js)
1. **Manipulate** with data manipulation library (e.g Lodash.js)


The challenge is that Immutable.js data collections are not native JavaScript objects. Therefore, before passing the data to a JavaScript library, we have to convert it to a JavaScript object. In this article, we are going to show how to convert to JavaScript without impacting the performance too much.

Let's take as an example the data of a library, that might looks similar to this nested object:

~~~eval-js
var libraryData = {
  "name": "The smallest library on earth",
  "address": "Here and now",
  "catalog": {
    "books": [
      {
        "title": "Watchmen",
        "publicationYear": 1986,
        "authors": [
          {
            "firstName": "Alan",
            "lastName": "Moore"
          },
          {
            "firstName": "Dave",
            "lastName": "Gibbons"
          }
        ]
      },
      {
        "title": "Jimmy Corrigan, the Smartest Kid on Earth",
        "publicationYear": 2000,
        "authors": [
          {
            "firstName": "Chris",
            "lastName": "Ware"
          }
        ]
      },
      {
        "title": "Ultimate Spider-Man",
        "publicationYear": 2000,
        "authors": [
          {
            "firstName": "Brian Michael",
            "lastName": "Bendis"
          }
        ]
      }
    ]
  },
  "users": [
    {"username": "user-1"}, {"username": "user-2"}, {"username": "user-3"}
  ]
}

~~~

Now, we convert the native JavaScript object to an Immutable map with `fromJS()`:

~~~eval-js
var immutableLibData = Immutable.fromJS(libraryData);
~~~

Our purpose is to find the best way to call `_.countBy()` on our immutable collection, in the same way as we would use it on the JavaScript native object:

~~~eval-js
_.countBy(libraryData.catalog.books, "publicationYear");
~~~

Immutable.js provides a `.toJS()` function that **deeply converts** an immutable collection to a JavaScript object or array.


We are then free to pass `immutableLibData.toJS()` to any Lodash function:

~~~eval-js
_.countBy(immutableLibData.toJS().catalog.books, "publicationYear");
~~~

The problem is that it causes a **performance hit**, as we have to convert the whole `immutableLibData` immutable collection (including the `users` part which is unnecessary)


A better solution is to convert only the part of the data that we are interested in:

~~~eval-js
_.countBy(immutableLibData.getIn(["catalog", "books"]).toJS(), "publicationYear");
~~~

But still, there is a performance hit as we convert the books data deeply (including the authors part which is unnecessary).

The best thing we can do, is to do a careful shallow conversion to native JavaScript: It requires 2 steps:

1. **Shallow convert** books to a JavaScript array with Immutable's `toArray()`
1. **Shallow convert** each object of the books array to a JavaScript object with Immutable's `toObject()`

Here is the code for that:

~~~eval-js
function toArrayofObjects(m) {
  return m.toArray().map(x => x.toObject());
}
~~~

And now, we can use `_.countBy()` with no unnecessary performance hit:

~~~eval-js
_.countBy(toArrayofObjects(immutableLibData.getIn(["catalog", "books"])), "publicationYear");
~~~


A similar approach could be applied to other immutable data collection libraries and other data manipulation libraries (and also to other programming languages). The **features** that the immutable data collection library needs to provide are:

1. **Deep conversion** to native objects (like Immutable `toJS()`)
1. **Shallow conversion** to native objects (like Immutable `toArray()` and `toObject()`)

Enjoy immutability!

{% include databook-intro.html %}
