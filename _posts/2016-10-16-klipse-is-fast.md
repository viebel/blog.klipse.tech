---
layout: post
title:  "bootrapped (self-host) namespace loading strategy in KLIPSE - insights into the cljs compiler"
description:  "bootrapped (self-host) namespace loading strategy in KLIPSE - insights into the cljs compiler"
date:   2016-10-16 10:04:15 +0200
categories: klipse
thumbnail: assets/klipse.png
guid: "54959EFB-5C67-427F-A14A-C883A109CCB2"
author: "@viebel"
---

# The problem


Until today, and the deployment of version `3.2.0`, KLIPSE was slow when one wanted to load some namespaces like `clojure.spec` or `clojure.math.combinatorics`. 

The reason is that KLIPSE used to load and evaluate all the pieces of code required for the namespace resolution from an external url - as specified in the `data-external-libs` attribute of the DOM element of the code snippet.

But it was not necessary - as most of the code required is already bundled into KLIPSE.


From today, KLIPSE loads only the necessary code from external urls and our articles about `clojure.spec` and `clojure.math.combinatorics` load in a descent time (under 10 seconds on my machine).

- [Custom defn macros with clojure.spec]({% post_url 2016-10-07-defn-args %}) 
- [Solving a not-so-easy riddle with clojure.math.combinatorics]({* post_url 2016-09-16-combinatorics-riddle %})

![Cheetah](/assets/cheetah-speed.jpg)


In this article, we are going to present what we did in KLIPSE to speed up the namespace loading - and our hope is that it will give you a couple of interesting insights into the internals of the `clojurescript` compiler.


# The solution

The main function of bootstrapped `clojurescript` is `eval-str` from [cljs.js namespace](https://github.com/clojure/clojurescript/blob/2f2b7f253cd2bc5156bf74caeb1145823570470b/src/main/cljs/cljs/js.cljs#L870). 

One of the parameter of `eval-str` is the `load` function that as `eval-str` doesn't specify how to load a namespace: each runtime environment provides a different way to load a library.

Whatever function `*load-fn*` is bound to will be passed two arguments - a map and a callback function.

The map will have the following keys:

- `:name`   - the name of the library (a symbol)
- `:macros` - modifier signaling a macros namespace load
- `:path`   - munged relative library path (a string)

It is up to the implementor to correctly resolve the corresponding `.cljs`, `.cljc`, or `.js` resource (the order must be respected).

Upon resolution the callback should be invoked with a map
  containing the following keys:

- `:lang`       - the language, `:clj` or `:js`
-  `:source`     - the source of the library (a string)
-  `:cache`      - optional, if a `:clj` namespace has been precompiled to `:js`, can give an analysis cache for faster loads.

If the resource could not be resolved, the callback should be invoked with `nil`.



There are 6 kinds of namespaces that might be loaded by the compiler:

0. core namespaces
1. clojurescript namespaces **bundled** into KLIPSE
2. clojurescript namespaces **not bundled** into KLIPSE
3. macro namespaces
4. goog namespaces
5. unloadable namespaces

Each of this kind of namespaces receives a special treatment in [KLIPSE code](https://github.com/viebel/klipse/blob/f6a4ffa029de170b749fe3483b82853511a6e9a0/src/klipse/io.cljs):

Many thanks to **António Monteiro**, **Mike Fikes** and **David Nolen** who helped me refining this namespace loading strategy and are always willing to help solving tough issues on the #cljs-dev slack channel. I'm so proud to be part of this wonderful community!

# core namespaces

The core clojurescript and macro namespaces `cljs.core` are already bundled - therefore we can skip them when someone requires them: we are calling the callback with `:source ""`.

# Clojure namespaces bundled into KLIPSE

Examples of namespaces bundled into KLIPSE: `clojure.spec`, `cljs.pprint`, `clojure.string`, `clojure.set`.

In this case, we could also skip them but then the compiler would not have access to the meta data of the variables defined in the namespace. 

Therefore, instead of skipping them, we are passing their analysis cache with `:cache cache-content`.

You probably ask yourself where do we take the cache from?

Well, we take it from the artifacts of KLIPSE compilation . You can take a look for instance at `clojure.set` cache [here](https://storage.googleapis.com/app.klipse.tech/fig/js/clojure/set.cljs.cache.json).

~~~klipse
(ns my.set
  (:require [clojure.set :refer [union]]))

(union #{1 2} #{2 3 4} #{10 1 20})
~~~


# Clojure namespaces not bundled into KLIPSE

Examples of namespaces not bundled into KLIPSE: `clojure.math.combinatorics`, `clojure.test`.

In this case, we load the source code from the `external-libs` specified in the DOM element of the code snippet.

For instance, here we load `clojure.math.combinatorics` from my fork of `clojure.math.combinatorics` at [https://raw.githubusercontent.com/viebel/math.combinatorics/master/src/main/clojure](https://raw.githubusercontent.com/viebel/math.combinatorics/master/src/main/clojure) - as `clojure.math.combinatorics is not yet bootrsapped compatible because [currently Clojure contrib projects with cljc cannot be built in the Clojure CI system ](https://github.com/clojure/math.combinatorics/pull/3):

<pre><code class="language-klipse" data-external-libs="https://raw.githubusercontent.com/viebel/math.combinatorics/master/src/main/clojure">
(ns my.combinatorics
  (:require [clojure.math.combinatorics :refer [permutations]]))

(permutations [1 2 3])
</code></pre>


# Macro namespaces

Even for namespaces bundled in KLIPSE, the macro code is not available at run time; it is only used during the build phase. 

Therefore, we load the code for macros namespaces either from `data-external-libs` as for namespaces not bundled in KLIPSE or from a manually maintained list of urls:

~~~clojure
(def the-ns-map '{cljs.spec "https://raw.githubusercontent.com/clojure/clojurescript/r1.9.229/src/main/cljs/"
                  cljs.spec.impl.gen "https://raw.githubusercontent.com/clojure/clojurescript/r1.9.229/src/main/cljs/"})
~~~

# Goog namespaces

Examples of `goog` namespaces: `goog.string`, `goog.string.format`.

Some `goog` namespaces are bundled into KLIPSE and we can skip them. For other namespaces, we load their javacript code from [closure-library github repo](https://github.com/google/closure-library).

~~~klipse
(ns my.goog
  (:require [goog.string :as s]))

(s/capitalize "hello klipse")
~~~

# Incompatible namespaces

Examples of namespaces that have not yet been ported to be bootstrapped compatible: `core.match`, `core.logic`. 

For those namespaces, we have only one solution: encourage you - the `clojurecript` community - to demonstrate your courage and motivation and to port those libraries. [Mike Fikes](https://twitter.com/mfikes) the author of [Planck](https://github.com/mfikes/planck) already ported a couple of libraries...



