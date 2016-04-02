---
layout: post
title:  "Truth in clojurescript"
description:  "Truth in clojurescript"
date:   2016-04-02 19:15:43 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "C64D8095-C512-49A5-9184-15608D909CE0"

---

## Truth and languages

The title of this paragraph sounds a bit [postmodern](https://en.wikipedia.org/wiki/Postmodernism{:target="_blank"}). But here, we want to discuss the truth in `Clojurescript` and `javascript`.

`Javascript`'s conception of the truth is a bit surprising. See by yourself:

~~~ javascript
Boolean(0) // false
Boolean("0") // true
0 == "0" // true
0 == false //  true
"0" == false // true


Boolean("") // false
Boolean([]) // true
Boolean({}) // true
~~~
`Clojure`'s conception of the truth is completly well defined.

It is therefore very interesting to ask:

>How `Clojurescript` handles the truth?

## Clojurescript: a teacher about truth 

Let's look at some transpiled `javascript` code with [KLIPSE][app-url]{:target="_blank"} in order to understand how `clojurescript` checks if something is true:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?js_only=1&cljs_in=(defn%20check%20%5Bx%5D%0A%20%20(if%20x%20%22true%22%20%22false%22))">
</iframe>

You see in the transpiled `javascript` code that the `x` variable has been wrapped into into a call to th `cljs.core.truth_` function.

Here is the code for `cljs.core.truth_`:

~~~ javascript
function cljs$core$truth_(x) {
  return x != null && x !== false
}
~~~

> This is how `clojurescript` teaches `javascript` what is true and what is not - in its own language!

## Performances

It's nice to have a truth wrapper. But what if you are in a performance sensitive environment and you want to use the native `javascript` truth system - in order to move faster?

Well, `clojurescript` provides a way to let the compiler know that you trust `javascript`: the `^boolean` type hint.

Let's see it in action with [KLIPSE][app-url]{:target="_blank"}:
<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?js_only=1&cljs_in=(defn%20check%20%5B%5Eboolean%20x%5D%0A%20%20(if%20x%20%22true%22%20%22false%22))&js_only=1">
</iframe>

By using the `^boolean` type hint, you let the compiler know that `x` must be a boolean i.e. either `true` or `false`. In that case, it's safe to trust `javascript` about the truth. There is no need to wrap the hinted variable into `cljs.core.truth_`.

And the `clojurescript` compiler is smart: it knows how to propagate type hints i.e. if you assign a hinted variable `x` into an unhinted variable `y`, then `y` is automatically hinted.

Let's check it with a simple piece of code in [KLIPSE][app-url]{:target="_blank"}:


<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(defn%20check%20%5B%5Eboolean%20x%5D%0A%20%20(let%20%5By%20x%5D%0A%20%20%09(if%20y%20%22true%22%20%22false%22)))&js_only=1">
</iframe>

You see that `y` has not been wrapped.

Cool, isn't it?

## Dangers

>With great power comes great responsibility

Let's have a look at some interesting edge cases exposed by [Mike Fikes](http://blog.fikesfarm.com/posts/2016-03-31-unhinted-clojurescript.html){:target="_blank"} involving the `^boolean` type hint:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(defn%20f%20%5B%5Eboolean%20b%5D%0A%20%20(loop%20%5Bx%20b%0A%20%20%20%20%20%20%20%20%20n%200%5D%0A%20%20%20%20(cond%0A%20%20%20%20%20%20(%3D%20n%20100000)%20%22almost%20infinite%20loop%22%0A%20%20%20%20%20%20(not%20x)%20(recur%200%20(inc%20n))%0A%20%20%20%20%20%20%3Aelse%20%3Adone)))%0A%0A%0A(f%20false)&eval_only=1">
</iframe>

What's happened here?

Remember that in `javascript`, `0` is falsy.

`b` is a boolean and `x` is also considered as a boolean because of type propagations.

`f` is called with a boolean value: `false`. 

But `f` breaks the contract as it assigned a non-boolean value `0` into `x`.

And then the `javascript` truth system makes troubles: `0` is falsy, so we get into the loop almost forever.

`Clojurescript` provides a way to turn off type inference, using the `^any` type hint.

So let's add `^any` to `x` and see what happens:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(defn%20f%20%5B%5Eboolean%20b%5D%0A%20%20(loop%20%5B%5Eany%20x%20b%0A%20%20%20%20%20%20%20%20%20n%200%5D%0A%20%20%20%20(cond%0A%20%20%20%20%20%20(%3D%20n%20100000)%20%22almost%20infinite%20loop%22%0A%20%20%20%20%20%20(not%20x)%20(recur%200%20(inc%20n))%0A%20%20%20%20%20%20%3Aelse%20%3Adone)))%0A%0A%0A(f%20false)">
</iframe>

Hourra! `x` has been wrapped again and we are safe.


Clojurescript rocks!

[app-url]: http://app.klipse.tech

