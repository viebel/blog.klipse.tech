---
layout: post
title:  "KLIPSE secured mode" 
description:  "Interactive code snippets running in a secured sandbox"
date:   2017-03-14 10:22:44 +0200
categories: klipse
thumbnail: assets/klipse.png
guid: "E4147F55-7562-4C2D-A25B-15104845BCBF"
secured_eval: true
author: Yehonathan Sharvit
---


## Introduction

Code interactivity comes at a price: it gives unlimited power to the author of the page. In the case of a blog, that's ok because you are the author of the page (and I assume that you trust yourself).

But in the case of a blogging platform like [dev.to](https://dev.to/) or other collaborative web sites like [clojuredocs.org](https://clojuredocs.org/), you cannot trust the authors of the KLIPSE interactive snippets.

For that use cases, Klipse features a **secured mode**.

When a page is in secured mode - like it is the case in this page -  the Klipse snippets cannot access:

- the `document` 
- the cookies
- `eval` function
- the `Function` constructor (big thanks to [Vesa Karvonen](https://twitter.com/VesaKarvonen)!)
- ajax function: `XMLHttpRequest`
- the klipse container that is associated to each klipse snippets


The secured mode is activated by switching on the `secured_eval` parameter in the `klipse_settings`.

~~~javascript
window.klipse_settings = {
		secured_eval: true,
        selector: '.klipse-clojure',
        selector_eval_js: '.klipse-js',
}
~~~

![Security](/assets/security.jpg)


Since this page is in Klipse secured mode, we can see the features of this mode - in action.


## Functionalities that are blocked

No access to the cookies:

~~~eval-js
document.cookie
~~~

No access to the `document`:

~~~eval-js
document
~~~

No ajax calls:

~~~eval-js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        alert(xhr.responseText);
    }
}
xhr.open('GET', 'http://example.com', true);
xhr.send(null);
~~~

No `eval`:

~~~eval-js
eval("1+2")
~~~


No `Function` constructor:

~~~eval-js
new Function("1+98")()
~~~

No access to the Klipse container:

~~~eval-js
klipse_container.innerHTML = "Hello World!"
~~~

## Functionalities that are kept

You can still share data between snippets:

~~~eval-js
foo = 42
~~~

~~~eval-js
foo
~~~

## Hacks

# Calling window explicitly

If an attacker tries to hack it by calling `window` explicitly, it won't work:

~~~eval-js
window.document.cookie
~~~

# Loading and external library


If an attacker tries to load a dangerous library - like jQuery - using `data-external-libs`, Klipse will block you
<pre><code class="language-eval-js" data-external-libs="jQuery">
$
</code></pre>

# Final remark

If you find a way to run dangerous code while in Klipse secured more, please be kind and send me a private email to: viebel@gmail.com

