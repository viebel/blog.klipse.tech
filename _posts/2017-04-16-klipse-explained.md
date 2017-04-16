---
layout: post
title:  "Klipse: A javascript plugin for interactive code snippets in blog posts"
desription: ""
date:   2017-03-28 04:42:44 +0200
categories: klipse
thumbnail: assets/klipse.png
guid: "5627BF95-4EE1-4C6E-98C2-1B2A720A0CD0"
author: "Yehonathan Sharvit"
---


Look at a typical blog post that unveils practical tips about a computer language.

It contains several code snippets in order to help the reader to understand the ideas conveyed by the author.

But the clarity of the content is limited because the code snippets are usually static. The reader cannot interact with the code. And interactivity is key for an effective learning experience.


Meet Dave. He is a javascript expert. He has a blog where he frequently shares his tips about `javascript` and `react.js`. He has good explanatory skills and his articles always contain code examples to illustrate his ideas.

![daveblog](/assets/daveblog.png)

He has tried to embed `jsfiddle` and `codepen` iframes in a couple of articles but it feels not natural to him to edit his code snippets on a website and embed them as iframes. More important, Dave was really frustrated by the fact that he couldn't share data and code between the different code snippets of the same article.

![happy](/assets/emoji-frustrated.jpg)

A couple of weeks ago, Dave discovered [Klipse][klipse-github], a javascript plugin for interactive code snippets in blog posts: with `Klipse`, it is super easy to include interactive code snippets in his blog posts and share data and code between the code snippets. 

Dave decided to use `Klipse` in order to rewrite 3 of his top articles where instead of static code snippets he would have interactive code snippets. 

It was really a fun experience for Dave and it took him less than 20 minutes per article. Dave called it the **klipsification** of his blog.

Dave republished his **klipsified** articles and shared the 3 of them on [reddit](https://www.reddit.com/r/javascript/) and [Hacker News](https://news.ycombinator.com/). The readers were excited by this new way of blogging about `javascript`: it was super fun for them to interact with Dave's code snippets and the interactivity helped them to have a clear understanding of Dave's ideas. 

![reddit](/assets/reddit.jpg)


Here is the Klipse snippets that Dave created in order to explain [EcmaScript 6 arrow functions](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions):


~~~klipse-eval-js
var hello = name => "hello " + name;
hello("klipse")
~~~


Dave used his `hello` function inside a `react` snippet with a jsx component:

~~~render-jsx
<div style={ {color:'red'} }>
  {hello("dave")}
</div>
~~~

Dave's readers were delighted by the fact that when they changed the color in the snippet from `'red'` to `'purple'`, the component re-rendered itself instantaneously!

Dave was even able to show to his readers exactly how his `jsx` component is transpiled into `javascript`:

~~~transpile-jsx
<div style={ {color:'red'} }>
  {hello("dave")}
</div>
~~~


The excitation of his readers made Dave feel happy.

![happy](/assets/emoji-happy.jpg)


If like Dave, you own a technical blog and you want to delight your readers, you should give it a try today and **klipsify** your 3 top articles.

[Klipse][klipse-github] supports the following languages: clojure, ruby, javascript, python, scheme, es2017, jsx, brainfuck, c++, reagent.

In order to **klipsify** his blog post, Dave made two simple steps as explained in [Klipse's README][klipse-github]:

1. He created DOM elements for the klipse snippets with class names of his choice, corresponding to the snippet type:
   1. `.language-eval-js` for javascript snippets
   2. `.language-render-jsx` for react snippets to render
   3. `.language-transpile-jsx` for jsx snippets to transpile
   
2. He include the klipse javascript tag at the end of the page's `<body>` with the `klipse_settings` set according to the class names that Dave chose:

~~~html
<link rel="stylesheet" type="text/css" href="https://storage.googleapis.com/app.klipse.tech/css/codemirror.css">

<script>
window.klipse_settings = {
  selector_eval_js: '.language-eval-js',
  selector_render_jsx: '.language-render-jsx',
  selector_transpile_jsx: '.language-transpile-jsx',
  };
</script>

<script src="https://storage.googleapis.com/app.klipse.tech/plugin_prod/js/klipse_plugin.min.js"></script>
~~~

Dave chose those class names because he loved but you could chose any class names and set the `klipse_settings` accordingly.
   



<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react-with-addons.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react-dom.js"></script>


[klipse-github]: https://github.com/viebel/klipse
