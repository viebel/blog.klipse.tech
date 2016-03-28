---
layout: post
title:  "Clojurescript's namespaces"
date:   2016-03-27 17:32:46 +0200
categories: clojure
thumbnail: assets/klipse.png
description: "Demystify clojurescript's namespaces"
---

If you are like me, you use a lot clojurescript namespaces, but without really understanding how it works under the hoods.
Let's clarify using [KLIPSE][app-url]{:target="_blank"}:

<iframe frameborder="0" width="100%" height="300px"
    src="http://app.klipse.tech/?cljs_in=(ns%20my-project.my-ns)%0A%0A(def%20x%201)%0A(def%20y%202)&js_only=1">
</iframe>

As you know, javascript doesn't support namespaces, clojurescript solves this using goog closure library, where namespaces are objects.
All variables of your javascript namespace will be nested in this object.

You've probably already understood that clojurescript compiler use simply the same trick! 
So `goog.provide` function initialize the `my_project.my_ns` object and you can find variables `x` and `y` nested inside it. 

`goog.require` function includes the namespace you need need to use in your code. It receive a string with several dot-separated levels. Each level is a nested part of the javascript object to include. In this case, require will include all the object `cljs.core` which is the ClojureScript standard library.

You can learn more about google closure library [here](https://developers.google.com/closure/library/docs/gettingstarted#hello-closure).

[app-url]: http://app.klipse.tech