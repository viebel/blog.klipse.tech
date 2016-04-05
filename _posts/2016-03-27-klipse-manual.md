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

## url parameters

* `cljs_in=<cljs_code>` - initial content of the `clojurescript` box ( `code` must be encoded properly)
* `js_only=1` - display only `cljs` and `js` boxes
* `eval_only=1` - display only `cljs` and `eval` boxes

[klipse-url]: http://app.klipse.tech/
