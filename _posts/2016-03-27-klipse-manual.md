---
layout: post
title:  "KLIPSE hotkeys and url parameters"
date:   2016-03-27 12:57:46 +0200
categories: clojure
thumbnail: assets/klipse.png
description: "KLIPSE manual - hotkeys and url parameters"
author: Yehonathan Sharvit
tags: [klipse]
---

[KLIPSE][klipse-url]{:target="_blank"} is a `clojure[script]` web REPL built on top of self-host `clojurescript`.

In this article, we describe how to tweak [KLIPSE][klipse-url]{:target="_blank"}.


## URL parameters

KLIPSE configuration is done with the url parameters:


* `cljs_in=<cljs_code>` - initial content of the `clojurescript` box ( `code` must be encoded properly)
* `cljs_in.gist=<gist_id>` - load code from a gist;  e.g. [http://app.klipse.tech?cljs_in.gist=viebel/368d3bec58d3ec47e935ad488bafb600&eval_only=1](http://app.klipse.tech?cljs_in.gist=viebel/368d3bec58d3ec47e935ad488bafb600&eval_only=1)
* `container=1` - container more useful for UI stuff: instead of the compilation box, you have your klipse container
* `js_only=1` - display only `input` and `js` boxes
* `eval_only=1` - display only `input`, `eval` and `print` boxes
* `static-fns=true` - eval and transpile js code with [static dispatch](https://github.com/clojure/clojurescript/wiki/Compiler-Options#static-fns)
* `external-libs` - array of external libs to resolve the namespace dependencies. Here is an [example with the gadjett library](http://app.klipse.tech/?cljs_in.gist=viebel/56695ae0360b8692255cc84115d37c6b&external-libs=["https://raw.githubusercontent.com/viebel/gadjett/master/src/"]). Each lib name must me wrapped in double quotes.
* `verbose` - (default false) passed to bootstraped `eval` and `compile` functions as `:verbose` opts
* `cache-buster` - (default false) when true the namespaces are loaded with a cache buster
* `max-eval-duration` - (default 1000) max number of 1000 seconds the code is allowed to run synchronously before being interrupted.
* `compile-display-guard`: (default false) when true, display the anti-starvation code inside result of compilation
* `print-length`: (default 1000) max number of items in collections to display - useful to prevent browser stuck when evaluating infinite sequences like `(range)`
* `beautify-strings`: (default false) when evaluation result is a string - display the "interior" of the string without escaping the quotes.


## Hotkeys

Interaction with the REPL is done with hotkeys:


* `Ctrl-Enter` or `Cmd-Enter` - eval and transpile
* `Ctrl-S` - display in the console and alert box shareable url that embeds the content of your current KLIPSE session.
* `Ctrl-R` - reload the app with the same content (pass the content to `cljs_in` url parameter).



[klipse-url]: http://app.klipse.tech/
