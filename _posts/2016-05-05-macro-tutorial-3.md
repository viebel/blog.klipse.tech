---
layout: post
title:  "Clojure Macros Tutorial - part 3: Syntax Quote (aka Backtick) in Clojure"
description:  "macros tutorial splicing Syntax Quote, Backquote, Backtick in Clojure"
date:   2016-05-05 03:24:53 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "C1450F62-F4D4-4909-BB44-1C091B53ABBC"
author: "@viebel"

---

`Clojure` provides a powerful tool to allow the developer to write macros effectively. This tool is called "Syntax quote".

This tool provide an elegant solution to the issues mentioned in [how not to write macros in Clojure]({% post_url 2016-05-04-macro-tutorial-2 %}){:target="_blank"}.

Syntax quote has 4 powerful features:

1. fully-qualified symbols
2. unquote with `~`
3. unquote splicing with `~@`
4. generated symbols with `#`

Here is the [official documentation for syntax quote](http://clojure.org/reference/reader#__a_id_syntax_quote_a_syntax_quote_note_the_backquote_character_unquote_and_unquote_splicing){:target="_blank"}.

But this documentation is too cryptic.

In this article, we present this powerful tool in a much digestible way...

![Dummies](/assets/quoting_dummies.jpg)

### Regular Quote

Before dealing with syntax quoting, let's remember how the regular quote works.

There are two equivalent ways to quote a form either with `quote` or with `'`.
The latter is much more convenient so we will use it.

It works recursively with any kind of forms and types: strings, maps, lists, vectors...

Let's have a look at some examples:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.quote%24macros)%0A%0A(defmacro%20disp%20%5B%26%20forms%5D%0A%20%20(cons%20%60str%20(for%20%5Bform%20forms%5D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(my.quote%2Fdisp%0A%20%20(quote%20a%20%3Aa%201)%0A%20%20'(a%20%3Aa%201)%0A%20%20'(a%20(b%20(c%20d%20(e%20f%20(g%20h)%20i)%20j)))%0A%20%20'%7B%3Aa%20(1%202%203)%20b%20(c%20d%20%22x%22)%7D)&eval_only=1">
</iframe>



### Syntax Quote - symbol resolution

Syntax quote is done with a backtick `` ` ``. It quotes a form and resolves symbols in the current context yielding a fully-qualified symbol. If the symbol doesn't exist in the current namespace, it is resolved to the current namespace.

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.quote)%0A%0A(def%20a%20123)%0A%5B%0A%20%20'map%3B%20with%20quote%2C%20no%20namespace%20resolution%0A%20%20%60map%3B%20map%20is%20resolved%20into%20cljs.core%20namespace%0A%20%20%60a%3B%20a%20is%20resolved%20into%20current%20namespace%3A%20my.quote%0A%20%20%60b%3B%20b%20is%20also%20resolved%20into%20current%20namespace%3A%20my.quote%0A%5D&eval_only=1">
</iframe>


### Syntax Quote - unquote

With syntax quote, it's possible to unquote part of the form that is quoted with `~`. It allows you to evaluate part of the expression.


<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.quote)%0A%0A%5B%0A%20%20%60(16%2017%20(inc%2017))%0A%20%20%60(16%2017%20~(inc%2017))%0A%20%20%60(16%2017%20~(map%20inc%20%5B16%2017%5D))%0A%5D&eval_only=1">
</iframe>


### Syntax Quote - unquote splicing

But what if you want to unquote a list and insert its elements (not the list) inside the quoted form?

No problem, `~@` is your friend (his official name is unquote splicing). And `~@` is really a good friend as he knows to handle any kind of collection.

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.quote)%0A%0A%5B%0A%20%20%60(16%2017%20~(map%20inc%20%5B16%2017%5D))%0A%20%20%60(16%2017%20~%40(map%20inc%20%5B16%2017%5D))%0A%20%20%60(1%202%20~%40%5B1%20%5B2%203%5D%5D)%0A%20%20%60(1%202%20~%40%23%7B1%202%203%7D)%0A%20%20%60(1%202%20~%40%7B%3Aa%201%20%3Ab%202%20%3Ac%203%7D)%0A%5D&eval_only=1">
</iframe>



### Syntax Quote - symbol generation


Inside syntax quote, you can generate unique symbol names by appending `#` to the symbol.

The cool thing is that all the references to that symbol within a syntax-quoted expression resolve to the same generated symbol.

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.quote)%0A%0A%5B%0A%20%20%60A%23%09%0A%20%20%60(a%20b%20a%23%20b%23)%0A%20%20%60(a%20b%20a%23%20b%23%20a%23%20b%23)%0A%20%20%60%7B%3Aa%20a%23%20%3Ab%20b%23%20%3Ac%20b%23%7D%0A%5D&eval_only=1">
</iframe>

There are other advanced features available inside syntax quote like `~'`, `~~`and `'~@`.

We might write an article on it in the (near) future...


Clojure rocks!

[app-url-static]: http://app.klipse.tech?blog=klipse&js_only=1
[app-url]: http://app.klipse.tech?blog=klipse&static-fns=true&js_only=1

