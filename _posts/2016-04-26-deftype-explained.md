---
layout: post
title:  "The power and danger of deftype in clojure and clojurescript"
description:  "records, defrecord, clojure, clojurescript,  deftype Michał Marczyk"
date:   2016-04-26 08:07:23 +0200
categories: clojurescript
thumbnail: assets/klipse.png
guid: "FD4E29FB-024B-4BC3-B14E-A75AC0620202"
author: "@viebel"

---

In `clojure`, records, types and protocols are parts of the fundamental building blocks of the language.
We have talked about `defrecord` here: [records are wacky maps]({% post_url 2016-04-24-records-wacky-maps %}) and we have unveiled `deprotocol` secret there: [defprotocol's secret]({% post_url 2016-04-09-clojurescript-protocols-secret  %}).

Now, we are going to talk about `deftype` - inspired again by this great talk by Michał Marczyk: [defrecord/deftype in Clojure and ClojureScript](https://youtu.be/vZtkqDIicqI){:target="_blank"}.


### Importance of types

In `clojure` the persistent data structures are implemented in `java`. 

In `clojurescript` the persistent data structures are `clojure` types. (This is one of those areas where `clojurescript` is cooler than `clojure`.)

Here is an excerpt from [core.cljs](https://github.com/clojure/clojurescript/blob/master/src/main/cljs/cljs/core.cljs#L6996){:target="_blank"}:


~~~clojure
(deftype PersistentVector [meta cnt shift root tail ^:mutable __hash]
(deftype PersistentQueueIter [^:mutable fseq riter]
(deftype PersistentQueueSeq [meta front rear ^:mutable __hash]
(deftype PersistentQueue [meta count front rear ^:mutable __hash]
(deftype PersistentArrayMapSeq [arr i _meta]
(deftype PersistentArrayMapIterator [arr ^:mutable i cnt]
(deftype PersistentArrayMap [meta cnt arr ^:mutable __hash]
(deftype PersistentHashMap [meta cnt root ^boolean has-nil? nil-val ^:mutable __hash]
(deftype PersistentTreeMapSeq [meta stack ^boolean ascending? cnt ^:mutable __hash]
(deftype PersistentTreeMap [comp tree cnt meta ^:mutable __hash]
(deftype PersistentHashSet [meta hash-map ^:mutable __hash]
(deftype PersistentTreeSet [meta tree-map ^:mutable __hash]
~~~

Overall, there are 74 `deftype` inside `core.cljs`


Like `defrecord`, `deftype` also fits into the definition of a record:

> In computer science, a record (also called struct or compound data) is a basic data structure. A record is a collection of fields, possibly of different data types, typically in fixed number and sequence. [Wikipedia](https://en.wikipedia.org/wiki/Record_(computer_science)){:target="_blank"} 


`deftype` is much simpler to `defrecord`: just constructors and `getBasis`; even value-based equality is not provided (see the "Types have no identity" paragraph below).

![Einstein](/assets/einstein_kiss.jpg)

### Types creation 

There are 2 ways to create a type: a constructor and a positional factory function: `(A.)` and `(->A)`.

You can retrieve the basis keys of the type with `getBasis` that returns a vector of basis keys as symbols.

Types are plain `java` or `javascript` objects (it's called a host type). Unlike `defrecord`, `deftype` adds almost nothing to the plain object. See the "Behind the scenes" paragraph below.


Let's see it in action with [KLIPSE](http://app.klipse.tech/?cljs_in=(ns%20my.types%24macros)%0A(defmacro%20disp%20%5B%26%20forms%5D%20(cons%20%60str%20(for%20%5Bform%20forms%5D%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(deftype%20A%20%5Bx%20y%20z%5D)%0A%0A(def%20a%20(A.%201%202%203))%0A(def%20aa%20(-%3EA%201%202%203))%0A%0A(my.types%2Fdisp%0A%20%20%5Ba%20aa%5D%0A%20%20(type%20a)%0A%20%20(.getBasis%20A)%0A%20%20%5B(.-x%20a)%20(.-y%20aa)%5D)&eval_only=1){:target="_blank"}:

<iframe frameborder="0" width="100%" height="380px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.types%24macros)%0A(defmacro%20disp%20%5B%26%20forms%5D%20(cons%20%60str%20(for%20%5Bform%20forms%5D%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(deftype%20A%20%5Bx%20y%20z%5D)%0A%0A(def%20a%20(A.%201%202%203))%0A(def%20aa%20(-%3EA%201%202%203))%0A%0A(my.types%2Fdisp%0A%20%20%5Ba%20aa%5D%0A%20%20(type%20a)%0A%20%20(.getBasis%20A)%0A%20%20%5B(.-x%20a)%20(.-y%20aa)%5D)&eval_only=1">
</iframe>


### Types are mutable

Read again the title of this paragraph.

No, you are not dreaming: `clojure` types are indeed mutable.

See it by yourself if you don't believe it:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.types%24macros)%0A(defmacro%20disp%20%5B%26%20forms%5D%20(cons%20%60str%20(for%20%5Bform%20forms%5D%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(deftype%20A%20%5Bx%5D)%0A(def%20a%20(A.%201))%0A%0A(my.types%2Fdisp%0A%20%20(.-x%20a)%0A%20%20(set!%20(.-x%20a)%2019)%0A%20%20(.-x%20a))&eval_only=1">
</iframe>

In `clojure`, you have to add `:volatile-mutable` or `:unsynchronized-mutable` type hint (also mutable fields mutable become private).

Like Michał said in [his talk at 28m34s](https://youtu.be/vZtkqDIicqI?t=28m34s){:target="_blank"}:

> deftype is the only clojure code generation facility that gives you access to actual mutable fields of the host. And it's fantastic. It's like a SW development version of woodworking hand tools. It's an apt analogy both on the power front and on the danger front.


![Woodworking](/assets/woodworking.jpg)

### Types have no identity

Like we wrote above, value-based identity is not provided by `deftype`.

In the [klipse](http://app.klipse.tech/?cljs_in=(ns%20my.types%24macros)%0A(defmacro%20disp%20%5B%26%20forms%5D%20(cons%20%60str%20(for%20%5Bform%20forms%5D%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(deftype%20A%20%5Bx%5D)%0A%0A(deftype%20AWithIdentity%20%5Bx%5D%0A%20%20IEquiv%0A%20%20(-equiv%20%5Bthis%20other%5D%20(and%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(%3D%20(type%20this)%20(type%20other))%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(%3D%20(.-x%20this)%20(.-x%20other)))))%0A%0A(def%20a%20(A.%201))%0A(def%20aa%20(AWithIdentity.%201))%0A%0A(my.types%2Fdisp%0A%20%20(%3D%20(A.%201)%20(A.%201))%0A%20%20(%3D%20(AWithIdentity.%201)%20(AWithIdentity.%201))%0A%20%20(%3D%20(AWithIdentity.%201)%20(A.%201)))&eval_only=1){:target="_blank"} below, we show that `(A. 1)` and `(A. 1)` are not equal.

We also show how to add value and type based identity to `deftype` (like it is provided by `defrecord`).


<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(ns%20my.types%24macros)%0A(defmacro%20disp%20%5B%26%20forms%5D%20(cons%20%60str%20(for%20%5Bform%20forms%5D%20%60(str%20(pr-str%20'~form)%20%22%20%3D%3E%20%22%20(pr-str%20~form)%20%22%5Cn%22))))%0A%0A(deftype%20A%20%5Bx%5D)%0A%0A(deftype%20AWithIdentity%20%5Bx%5D%0A%20%20IEquiv%0A%20%20(-equiv%20%5Bthis%20other%5D%20(and%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(%3D%20(type%20this)%20(type%20other))%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20(%3D%20(.-x%20this)%20(.-x%20other)))))%0A%0A(def%20a%20(A.%201))%0A(def%20aa%20(AWithIdentity.%201))%0A%0A(my.types%2Fdisp%0A%20%20(%3D%20(A.%201)%20(A.%201))%0A%20%20(%3D%20(AWithIdentity.%201)%20(AWithIdentity.%201))%0A%20%20(%3D%20(AWithIdentity.%201)%20(A.%201)))&eval_only=1">
</iframe>

### Behind the scenes : deftype's transpiled javascript code

If you are curious to see how the magic occurs in `clojurescript`, you will find it very interesting to observe and meditate around the transpiled `javascript` code of `deftype`:

<iframe frameborder="0" width="100%" height="300px"
    src= 
    "http://app.klipse.tech/?cljs_in=(deftype%20A%20%5Bx%5D)&js_only=1">
</iframe>

You might find it more convenient to open [deftype's transpiled code](http://app.klipse.tech/?cljs_in=(deftype%20A%20%5Bx%5D)&js_only=1){:target="_blank"} in a separate tab.


Clojure & Clojurescript rock!

[app-url-static]: http://app.klipse.tech?blog=klipse&js_only=1
[app-url]: http://app.klipse.tech?blog=klipse&static-fns=true&js_only=1

