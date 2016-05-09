---
layout: post
title:  "Clojure Macros Tutorial - part 4: Examples of cool macros #cljklipse @viebel"
description:  "macros tutorial examples Clojure clojurescript defprint doseq doseq-indexed disp"
date:   2016-05-09 17:12:43 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "E4991207-5FDC-43BF-830F-C50D5CDB4B5C"
author: "@viebel"

---

This article is the last part of our Clojure macros tutorial. The previous parts were:

1. [functions vs. macros]({% post_url 2016-05-01-macro-tutorial-1 %}) 
2. [how not to write macros]({% post_url 2016-05-04-macro-tutorial-2 %})
3. [syntax quote]({% post_url 2016-05-05-macro-tutorial-3 %})

Now we are going to show you how `clojure` ninjas write macros.

![Ninja](/assets/ninja.jpg)

### The `disp` macro - by 2 anonymous ninjas

The `disp` macro receives expressions and returns a string with the expressions and their respective evaluations.

<iframe frameborder="0" width="100%" height="250px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.best%24macros)%0A%0A(defmacro%20disp%20%5B%26%20forms%5D%0A%20%20(cons%20%60str%20(for%20%5Bform%20forms%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(my.best%2Fdisp%20%0A%20%20(map%20inc%20%5B1%202%203%5D)%0A%20%20(%2B%204%205%206))%0A&eval_only=1">
</iframe>

Two smart guys on [Clojurians Slack](https://clojurians.slack.com) helped me to write the `disp` macros.

### The `defprint` macro - by Herwig Hochleitner 

The `defprint` macro defines a function with a tweak: each time the function is called, it prints the values of its arguments. The tricky part is that it works also with desctructuring.

<iframe frameborder="0" width="100%" height="500px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.best%24macros)%0A%0A(defmacro%20defprint%20%5Bfunc-name%20args%20%26%20body%5D%0A%20%20%60(defn%20~func-name%20%5B%26%20args%23%5D%0A%20%20%20%20%20(print%20'~func-name%20%22called%20with%3A%20%22%20args%23)%0A%20%20%20%20%20(let%20%5B~args%20args%23%5D%0A%20%20%20%20%20%20%20~%40body)))%0A%0A(my.best%2Fdefprint%20foo%20%5Ba%20b%20c%5D%20(%2B%20a%20b%20c))%0A(my.best%2Fdefprint%20hello-world%20%5B%26%20%7B%3Akeys%20%5Blanguage%5D%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Aor%20%7Blanguage%20%3Aen%7D%7D%5D%0A%20%20%20(case%20language%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Afr%20%22bonjour%20monde%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Aen%20%22hello%20world%22))%0A%5B%0A%20%20%5B(foo%201%202%203)%20(with-out-str%20(foo%201%202%203))%5D%0A%20%20%5B(hello-world%20%3Alanguage%20%3Afr)%20(with-out-str%20(hello-world%20%3Alanguage%20%3Afr))%5D%0A%20%20(macroexpand-1%20'(my.best%2Fdefprint%20foo%20%5B%26%20%7B%3Akeys%20%5Blanguage%5D%7D%20%3Aor%20%7Blanguage%20%3Aen%7D%5D))%0A%20%20%5D%0A&eval_only=1">
</iframe>

Take a couple of minutes to meditate on the power of this part of the macro:

~~~clojure
(let [~args args#]
       ~@body)
~~~

[Herwig Hochleitner](https://twitter.com/bendlas) helped me to write the `defprint` macro.

You can read [more about desctructuring]({% post_url 2016-03-31-destructuring-part-2 %}).

### The `doseq-indexed` macro - by Tim Baldridge

`doseq-indexed` works like `doseq` with an additional binding to the index. 

[Tim Baldridge](https://twitter.com/timbaldridge) (`core.async` author) wrote an elegant implementation for `doseq-indexed`:

<iframe frameborder="0" width="100%" height="250px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.best%24macros)%0A%0A(defmacro%20doseq-indexed%20%5Bindex-sym%20%5Bitem-sym%20coll%5D%20%26%20body%5D%0A%20%20%60(doseq%20%5B%5B~item-sym%20~index-sym%5D%0A%20%20%20%20%20%20%20%20%20%20%20(map%20vector%20~coll%20(range))%5D%0A%20%20%20%20%20~%40body))%0A%0A(with-out-str%0A%20%20(my.best%2Fdoseq-indexed%20i%20%5Bx%20%5B10%20100%201000%5D%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(println%20%22i%3A%20%22%20i%20%22x%3A%20%22%20x)))%0A&eval_only=1">
</iframe>

Here is [Tim's original gist](https://gist.github.com/halgari/4136116).

Feel free to share your favorite macros in the comments below.

Clojure rocks!

[app-url-static]: http://app.klipse.tech?blog=klipse&js_only=1
[app-url]: http://app.klipse.tech?blog=klipse&static-fns=true&js_only=1

