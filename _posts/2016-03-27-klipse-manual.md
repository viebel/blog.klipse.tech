---
layout: post
title:  "KLIPSE hotkeys and url parameters"
date:   2016-03-27 12:57:46 +0200
categories: clojure
thumbnail: assets/klipse.png
description: "KLIPSE manual - hotkeys and url parameters"
author: "@viebel"
---

[KLIPSE][klipse-url]{:target="_blank"} layout is intentionnaly kept simple.

In this article, we describe how to tweek [KLIPSE][klipse-url]{:target="_blank"}.


## Hotkeys

* `Ctrl-Enter` - eval and transpile
* `Ctrl-S` - create a shareable url that embeds the content of your current KLIPSE session.
* `Ctrl-R` - reload the app with the same content (pass the content to `cljs_in` url parameter).

## url parameters

* `cljs_in=<cljs_code>` - initial content of the `clojurescript` box ( `code` must be encoded properly)
* `js_only=1` - display only `cljs` and `js` boxes
* `eval_only=1` - display only `cljs` and `eval` boxes
* `static-fns=true` - eval and transpile js code with [static dispatch](https://github.com/clojure/clojurescript/wiki/Compiler-Options#static-fns)
* `external-libs` - array of external libs to resolve the namespace dependencies. Here is an [example with the gadjett library](http://app.klipse.tech/?cljs_in.gist=viebel/56695ae0360b8692255cc84115d37c6b&external-libs=[https://raw.githubusercontent.com/viebel/gadjett/master/src/]).



[klipse-url]: http://app.klipse.tech/
