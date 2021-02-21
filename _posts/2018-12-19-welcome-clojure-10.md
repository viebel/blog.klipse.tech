---
local_klipse: false
layout: post
title:  Welcome Clojure 10
description:  Demo of Clojure 1.10 features. Tutorial. Data and People.
date:   2018-12-18 21:11:24 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "62BC4D8C-5AB3-4D97-B6B2-29A0BC2D0EAD"
author: Yehonathan Sharvit
tags: [clojure]
---


# Clojure 1.10 features

Clojure 1.10 is out. If you look at the [official change log in github](https://github.com/clojure/clojure/blob/master/changes.md#changes-to-clojure-in-version-110), you will see the main features of Clojure 1.10:

1. Java compatibility improvement
2. A new stream based REPL named `prepl`
3. Better Error messages
4. Two new protocols: `Datafiable` and `Navigable`
5. Protocol Extension by Metadata
6. A new System named `tap`
7. Read string - capture mode


To me, the main theme of Clojure 1.10 is: **Data and People**.

![Data and People](/assets/data-and-people.jpg)


In this blog post, we are going to explore features 3 to 7 and illustrate each feature with live code snippets that run directly in your browser. The code snippets are in Clojurescript. The corresponding Clojure code might be slighlty different. 

Having a live demo of Clojure 1.10 features in the browser, the same week that Clojure 1.10 is released has made possible by the great work of [David Nolen](https://twitter.com/swannodette) and [Mike Fikes](https://twitter.com/mfikes) who ported Clojure 1.10 features to Clojurescript so quickly. 

I am personally thankful for Mike that helped me integrating those features into [Klipse](https://github.com/viebel/klipse). Klipse is a tool that leverages self-hosted Clojurescript to integrate interactive code snippets in a web page.


# Better Error messages

Error messages now contain the phase where the error occurs. There are 5 phases:

1. reading the source code
2. macro exansion
3. compilation
4. execution
5. result printing


The way errors are displayed in the REPL is:

1. The first line details the phase where the error occured
2. The subsequent lines provide details about the error

The errors get more detailed when we require the `clojure.core.specs.alpha` namespace, that contains `clojure.spec` definitions for basic parts of the language:

~~~klipse
(require 'clojure.core.specs.alpha)
~~~

The most valuable improvement is when an error occur inside a macro. Now, when you make a syntax error inside `defn`, you get a detailed explanation given by `clojure.spec` about what parts of the form are incorrect. 



~~~klipse
(defn foo "" 1)
~~~

And if you provide a map with an odd number of forms, you get a very clear explanation:

~~~klipse
(def my-map {:foo 12 :bar})
~~~

Better error messages is really a great human contribution by the Clojure team.

# Two new protocols: `Datafiable` and `Navigable`

Clojure's narrative has always been around data. Data immutability, Code as data etc... Some people say that Clojure is a Data-drive languages. Clojure 1.10 takes the data story one step further. Now, every piece of Clojure can be seen as data: it can be *datified* and *navigated*. Out of the box, Clojure provides datification of atoms, vars, namespaces and more...

Remark: `Datafiable` and `Navigable` have their most natural application in the context of building tools for data exploration. You will probably not need it in your web service. But it's part of Clojure now, so I think it's interesting to discover their "mechanics".

To datafy a value, we call the `datafy` function from the `clojure.datafy` namespace:

~~~klipse
(require '[clojure.datafy :refer [datafy]])
~~~

Simple values are datafied *as is*:

~~~klipse
(datafy 42)
~~~

Atoms are datafied with wrapping square brackets:

~~~klipse
(datafy (atom 42))
~~~

In order to datafy an object, all we need to do is to extend the `clojure.core.protocols/Datafiable` protocol that is made of a single function named `datafy`.

Let's illustrate that by creating custom Record with the name of the record  included in its datafication.

~~~klipse
(require '[clojure.core.protocols :as p])

(defrecord MyRecord [a b]
  p/Datafiable
  (datafy [x] {:type 'MyRecord
               :a (:a x)
               :b (:b x)}))
			   
(datafy (MyRecord. 1 2))
~~~


And because in Clojure protocols and records are open, we can even datafy an existing object with `extend-type`.

For instance, we can datafy lazy sequences as truncated lists with the first 10 items:

~~~klipse
(extend-type LazySeq
  p/Datafiable
  (datafy [x] (take 10 x)))

(datafy (map inc (range 100)))
~~~


The examples shown in this section are for illustrative purpose only. It is not advised to modify the behaviour of a Clojure core component like `LazySeq`. 

You can check [this talk about the REBL](https://www.youtube.com/watch?v=c52QhiXsmyI) to discover a really cool application of `Datafiable` `Navigable`.


# Protocol Extension by Metadata

What about datification of a specific map? 

No problem, Clojure 1.10 supports protocol extension by metadata. When a protocol is marked with `:extend-via-metadata true`, we can extend it via metadata. 

~~~klipse
(defprotocol Component
  :extend-via-metadata true
  (start [component]))
~~~

Now, any object can extend `Component` by specifying a value for `start` in its metadata, just like this:

~~~klipse
(def component (with-meta {:name "db"} {`start (constantly "started")}))
(start component)
~~~


It is no surprise that the `Datafiable` protocol, exposed in the previous section, is marked with `:extend-via-metadata true`. As a consequence, a map can be datafied on the fly. All we have to do is specify an implementation for `clojure.core.protocols/datafy` in the metadata:


~~~klipse
(def john-doe (with-meta 
                {:name "John Doe"
                 :language "us"} 
                {`clojure.core.protocols/datafy (fn [x] (assoc x :type 'Person))}))

(datafy john-doe)
~~~

Here is the official documentation for [Protocol Extension by Metadata](https://clojure.org/reference/protocols#_extend_via_metadata).

# A new system: tap 

`tap` is a shared, globally accessible system for distributing a series of informational or diagnostic values to a set of (presumably effectful) handler functions. 

In a nutshell, with `tap`, we can distribute a series of values to a set of handlers. 
We register handlers with `add-tap`:

~~~klipse
(def my-atom (atom nil))
(add-tap #(reset! my-atom %))
(def your-atom (atom nil))
(add-tap #(reset! your-atom %))
~~~

And we send values with `tap>`:

~~~klipse
(tap> "Hello World")
~~~

Our handlers have been called, therefore both `my-atom` and `your-atom` contains the value that we sent:


<pre><code class="language-klipse" data-loop-msec="100">
[@my-atom @your-atom]
</code></pre>


`tap` can be used as a better debug `prn`, or for facilities like logging etc...

# Read String - capture mode

As a LISP dialect, Clojure allows us to convert a string that contains an expression to the corresponding data, with `read-string` function. Clojure 1.10 introduces `read+string` (with a `+` instead of `-`) that returns both the data and the original string.

~~~klipse
(require '[clojure.tools.reader :refer [read+string]])
(require '[cljs.tools.reader.reader-types :refer [source-logging-push-back-reader]])
(read+string (source-logging-push-back-reader "(def a    1)"))
~~~

There are two differences in Clojure vs Clojurescript regarding `read+string`:

1. In Clojure, it requires a `LineNumberingPushbackReader` instead of `source-logging-push-back-reader`
2. In Clojure, it is part of `clojure.core`



# Play on your own REPL

I hope that you enjoyed the discovery of Clojure 1.10 features in your browser. Now, it's time to try on your own machine. Thanks to the awesome [Clojure CLI]({% post_url 2018-09-16-hello-clojure %}), that's super easy with this single command line:

~~~bash
>clj -Sdeps "{:deps {org.clojure/clojure {:mvn/version \"1.10.0\"}}}"
Clojure 1.10.0
user=>
~~~

Go for it!

