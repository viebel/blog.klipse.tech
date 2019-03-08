---
layout: post
title:  "Custom defn macros with clojure.spec"
description:  "Custom defn macros with clojure.spec. conform unform. parsers. ast. abstract syntax tree.  . clojure.spec live tutorial. ast. abstract syntax trees. grammars"
date:   2019-03-08 02:14:12 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: A4D0F2BE-B8F0-4694-918A-494AF67FEFE9
author: Yehonathan Sharvit
---

# Introduction

`clojure.spec` is a core library that allows programmers to specify the structure of their data, to validate and destrucutre it and to generate data based on a specification. 

If you are not familiar with `clojure.spec`, be sure to read the [spec Rationale](https://clojure.org/about/spec) and the [spec Guide](https://clojure.org/guides/spec).

One of the cool features of `clojure.spec` is that we can parse functions and macros arguments into kind of an Abstract Syntax Tree (AST) back on forth, using `conform` and `unform`.

In this article, we are going to show how one can write his custom `defn`-like macro, using the specs for `defn`.

A [previous version of this article]({% post_url 2016-10-07-defn-args %}) has been written back in 2016. The current version of the article has been updated and made more digestable.


First, we are going to show to parse the arguments of the `defn` macro, modifies the parse tree and converts it back to the format `defn` expects.

Then, we will leverage this idea in order to write three of custom `defn` like macros:

- `defndoc`: automatic enrichment of docstring
- `defnlog`: automatic logging of function calls
- `defntry`: automatic catching of exceptions

![Tree](/assets/tree.jpg)


# Interactive code snippets

The code snippets run by [Klipse](https://github.com/viebel/klipse) in this article will reside in the `my.m$macros`.

If you wonder why we have to append `$macros` to the namespace, read [Messing with Macros at the REPL]({% post_url 2016-03-17-messing-with-macros %}){:target="_blank"}.

~~~klipse
(ns my.m$macros)
~~~

# conform and unform

With `clojure.spec` we can parse functions and macros arguments into kind of an Abstract Syntax Tree (AST) back on forth, using `conform` and `unform`: 

1. `conform` receives data and spec and destrcutures it into an AST
2. `unform` takes an AST and it returns data


The basic idea of this article is that in `clojure.spec`, `conform` and `unform` are reciprocical, in the sense that `(unform spec (conform spec x))` is equal to `x`.

Let's see know some examples of `conform` and `unform`.

First, we require `clojure.spec`.


~~~klipse
(require '[clojure.spec.alpha :as s])
~~~


Let's play with `conform` and `unform` on a simple spec that receives a list of two elements following this spec:

1. either a string or a keyword
2. a number

~~~klipse
(s/def ::str-or-kw (s/alt :str string?
                          :kw  keyword?))

(s/def ::my-spec (s/cat
                   :first ::str-or-kw
                   :second number?))
~~~


Let's look how `conform` destrucutres data:

~~~klipse
(s/conform ::my-spec '(:a 1))
~~~

And when we call `unform`, we get the original data back:

~~~klipse
(->> (s/conform ::my-spec '(:a 1))
     (s/unform ::my-spec))
~~~

# Catches with conform/unform

Sometimes `conform` and `unform` are not fully inlined.

Take a look at this:

~~~klipse
(->> (s/conform ::my-spec [:a 1])
     (s/unform ::my-spec))
~~~

`[:a 1]` is a valid `::my-spec` but it is unformed as a list and not as a vector.

One way to fix that is to use `spec/conformer`, like this:

~~~klipse
(s/def ::my-spec-vec (s/and vector?
                            (s/conformer vec vec)
                            (s/cat
                             :first ::str-or-kw
                             :second number?)))
~~~

Now, `[:a 1]` is informed as a vector:

~~~klipse
(->> (s/conform ::my-spec-vec [:a 1])
     (s/unform ::my-spec-vec))
~~~

Now, let's move to the `defn` stuff...

# args of defn macro

The `spec` for `defn` arguments is provided by `clojure.core.specs` namespace and it is called `:clojure.core.specs/defn-args`:

~~~klipse
(require '[clojure.core.specs.alpha :as specs])
(s/describe ::specs/defn-args)
~~~

In prose,  the `::specs/defn-args` specifies a list made of:

1. the function name (`:fn-name`) that must be symbol
2. optionallly: the doc string (`:docstring`) that must be a string
3. optionally: the meta data (`:meta) tha must be a map
4. the function tail (`:fn-tail`) that must be either of arity 1 or multiple arity


But there is a problem with this `defn-args` spec:  `unform` and `conform` are not fully inlined  (`unform` returns lists instead of vectors).


The cool thing is that we can monkey patch `:defn-args` so that `unform` and `conform` are fully inlined. This code is inspired form Mark Engleberg's [better-cond repo](https://github.com/Engelberg/better-cond).

If the following code snippet is confusing you, feel free to skip it - it will not prevent you from understanding the rest of the article.

~~~klipse
(s/def ::specs/seq-binding-form
       (s/and vector?
              (s/conformer identity vec)
              (s/cat :elems (s/* ::specs/binding-form)
                     :rest (s/? (s/cat :amp #{'&} :form ::specs/binding-form))
                     :as (s/? (s/cat :as #{:as} :sym ::specs/local-name)))))

(defn arg-list-unformer [a]
  (vec 
   (if (and (coll? (last a)) (= '& (first (last a))))
     (concat (drop-last a) (last a))
     a)))

(s/def ::specs/param-list
       (s/and
        vector?
        (s/conformer identity arg-list-unformer)
        (s/cat :args (s/* ::specs/binding-form)
               :varargs (s/? (s/cat :amp #{'&} :form ::specs/binding-form)))))
~~~

Now, let's see `::specs/defn-args` in action.

Imagine we have a simple function `foo`:

~~~klipse
(defn foo [a b] (+ a b))
~~~

In this case, the arguments of the `defn` macro is a list made of three elements: `(foo [a b] (+ a b))`.

Let's convert this list into an AST with `conform`:

~~~klipse
(s/conform ::specs/defn-args '(foo [[a b]] (+ a b)))
~~~


And now, with a pretty complicated function `bar`:

~~~klipse
(defn bar "bar is a multi-arity variadic function" 
  {:private true} 
  ([a b & c] (+ a b (first c))) 
  ([] (bar 1 1 3)))
~~~


Notice some facts about `bar`:
1. it has multi-arity 
2. it is a variadic function 
3. it provides a docstring
4. it has meta data.

No matter how complicated the function is, we can convert the function definition into an AST with `conform`:

~~~klipse
(s/conform ::specs/defn-args 
           '(bar "bar is a multi-arity variadic function" 
                 {:private true} 
                 ([a b & c] (+ a b (first c))) 
                 ([] (bar 1 3))))
~~~

Now that we have an AST in hand, we can manipulate it like any other Clojure map. For instance, we can modify the docstring by using `assoc` on the `:docstring` key:

~~~klipse
(def args-ast
  (s/conform ::specs/defn-args 
           '(bar "bar is a multi-arity variadic function" 
                 {:private true} 
                 ([a b & c] (+ a b (first c))) 
                 ([] (bar 1 3)))))

(def the-new-args-ast 
    (assoc args-ast :docstring "bar has a cool docstring"))

the-new-args-ast
~~~


And we get back a list for `defn`, using `unform`:

~~~klipse
(s/unform ::specs/defn-args the-new-args-ast)
~~~

We can now, create a `defn` statement with the modified arguments, by simply prepending `defn` to the list of arguments:

~~~klipse
(cons `defn (s/unform ::specs/defn-args the-new-args-ast))
~~~

> Clojure is a LISP dialect: we can do lots of cool stuff simply by manipulating lists!

All the pieces are now in place to create our 3 custom `defn` macros:


# Automatic enrichment of docstring

Let's say, we want to write a `defn` like macro with a twist: the docstring will automatically contain the name of the function that is currently defined. Without `clojure.spec`, you will have to extract manually the optional docstring and reinject it into `defn`. With `clojure.spec`, we can do much better by:

1. Conforming the args into a tree
2. Modifying the `:docstring` part of the tree
3. Unforming back

Here is the code in action:

~~~klipse
(defmacro defndoc [& args]
  (let [conf (s/conform ::specs/defn-args args)
        fn-name (:fn-name conf)
        new-conf (update conf :docstring #(str fn-name " is a cool function. " %))
        new-args (s/unform ::specs/defn-args new-conf)]
    (cons `defn new-args)))
~~~

When no docstring is provided, a docstring is created:

~~~klipse
(my.m/defndoc foo [a b] (+ a b))
(:doc (meta #'foo))
~~~

(If you wonder why we have to reference the fully-qualified macro, read [Messing with Macros at the REPL]({% post_url 2016-03-17-messing-with-macros %}){:target="_blank"}.)

When a docstring is provided, an enriched docstring is created:

~~~klipse
(my.m/defndoc foo "sum of a and b." [a b] (+ a b))
(:doc (meta #'foo))
~~~

This one was pretty easy, because we only had to deal with the docstring. The next one is more challenging - as we are going to deal with the body of the function...

# Automatic logging of function calls

`defnlog` is a macro that defines a function that automatically prints a log each time it is called.

In other words, we are going to write a macro that modifies the body of a function. It's pretty easy, clojure being a homoiconic language: Code is data and it can be manipulated as a regular list.

Our first piece is going to be a function `prepend-log` that receives a body and a function name and prepend to it a call to `(print func-name "has been called)`:

~~~klipse
(defn prepend-log [name body]
  (cons `(println ~name "has been called.") body))
~~~

Our second piece is a function `update-conf` that updates the body of a conformed `::specs/defn-args`. This is a bit tricky because the shape of the confomed object is different if the function is a single-arity or a multi-arity function.

Let's take a look at the shape of a `::specs/defn-args` for a single arity function:

~~~klipse
(s/conform ::specs/defn-args '(foo [a b] (* a b)))
~~~

The body path is: `[:fn-tail 1 :body]`.

And now for a multi-arity function:

~~~klipse
(s/conform ::specs/defn-args '(bar 
                          ([] (* 10 12))
                          ([a b] (* a b))))
~~~

The bodies path is: `[:fn-tail 1 :bodies]`.

Note that in both cases, the arity type is located at `[:fn-tail 0]`.

Let's write `update-conf`: 

- In single-arity, we update the body
- In multi-arity, we updtate all the bodies 

Notice how we destructure the `conf` in order to get the arity.

~~~klipse
(defn update-conf [{[arity] :fn-tail :as conf} body-update-fn]
  (case arity
    :arity-1 (update-in conf [:fn-tail 1 :body 1] body-update-fn)
    :arity-n (update-in conf [:fn-tail 1 :bodies] (fn [bodies]
                                                    (prn bodies)
                                                      (map (fn [body] (update-in body [:body 1] body-update-fn)) bodies)))))
~~~

All the pieces are in place to write our `defnlog` macro:

~~~klipse  
(defmacro defnlog [& args]
  (let [{:keys [fn-name] :as conf} (s/conform ::specs/defn-args args)
        new-conf (update-conf conf (partial prepend-log  (str fn-name)))
        new-args (s/unform ::specs/defn-args new-conf)]
    (cons `defn new-args)))
~~~

Let's see `defnlog` in action.

First, we define a simple function `fooz`:

~~~klipse
(my.m/defnlog fooz "a very simple function" [a b] (+ a b))
~~~

And when we call it, a log is printed:

~~~klipse
(fooz 55 200)
~~~

It works fine with destructuring:

~~~klipse
(my.m/defnlog baz "a simple function" [{:keys [a b]}] (+ a b))
(baz {:a 55 :b 200})
~~~

And also with multi-arity functions:

~~~klipse
(my.m/defnlog bar 
  ([] (* 10 12))
  ([a b] (* a b)))

(bar)
~~~

~~~klipse
(bar 12 3)
~~~

# Automatic try/catch

We can use exactly the same technique to create a `defntry` macro that wraps the body into a `try/catch` block - and throws an exception with the name of the function. (It is especially useful in `clojurescript` with advanced compilation where function names are not available any more at run time!)

First, let's write a `wrap-try` function that wraps a body into a `try/catch` block:

~~~klipse
(defn wrap-try [name body]
  `((try ~@body
     (catch :default ~'e
       (throw (str "Exception caught in function " ~name ": " ~'e))))))
~~~

And now, the code of the `defntry` macro:

~~~klipse
(defmacro defntry [& args]
  (let [{:keys [fn-name] :as conf} (s/conform ::specs/defn-args args)
        new-conf (update-conf conf (partial wrap-try  (str fn-name)))
        new-args (s/unform ::specs/defn-args new-conf)]
    (cons `defn new-args)))
~~~

Let's see it in action - with a `kool` function that receives a function and calls it.

~~~klipse
(my.m/defntry kool "aa" [a] (a))
~~~

~~~klipse
(kool #(inc 2))
~~~

Now, if we pass something that is not a function, we will get a nice exception with the name of the `kool` function:

~~~klipse
(kool 2)
~~~

So beautiful...

And so simple (but definitely not easy)...

clojure.spec rocks!
