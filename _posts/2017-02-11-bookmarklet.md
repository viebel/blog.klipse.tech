---
layout: post
title:  "Klipsify any web page with KLIPSE bookmarklet"
title:  "Klipsify any web page"
date:   2017-02-11 18:11:21 +0200
categories: klipse
thumbnail: assets/klipse.png
guid: "37CE2DA5-B3D0-4EFD-9397-7FD10FC3D986"
author: Yehonathan Sharvit
minified_plugin: true
draft: true
hidden: true
---


Here is the KLIPSE bookmarklet: <a style="background: #5f7fbf;     display: inline-block;
    font-size: 20px;
    padding: 5px;
    color: #fff;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;"
	class="bookmarklet" href="javascript:(function()%7Bfunction%20callback()%7Bconsole.log(1)%7Dvar%20s%3Ddocument.createElement(%22script%22)%3Bs.src%3D%22https%3A%2F%2Fstorage.googleapis.com%2Fapp.klipse.tech%2Fbookmarklet.js%3F%22%2BMath.random()%3Bif(s.addEventListener)%7Bs.addEventListener(%22load%22%2Ccallback%2Cfalse)%7Delse%20if(s.readyState)%7Bs.onreadystatechange%3Dcallback%7Ddocument.body.appendChild(s)%3B%7D)()">Klipsify</a>
	
Drag and drop it into your bookmarks and then you can try it on:

- [ClojureDocs.org](https://clojuredocs.org/clojure.core/keep)
- [gist.github.com](https://gist.github.com/viebel/6bdefe58f4a38591399f0628fb775418)
- [Clojure.org](https://clojure.org/guides/destructuring)
