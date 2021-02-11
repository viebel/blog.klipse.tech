---
layout: post
title:  "Parsing with clojure.spec"
description:  "Parsing with clojure.spec"
date:   2016-10-06 05:11:22 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "497798B9-A498-46BE-A5DC-AB8C04C8F2B0"
draft: true
hidden: true
author: Yehonathan Sharvit
tags: [clojure]
---

# Introduction

We can parse with `clojure.spec`!

![Zen](/assets/zen.jpg)

# Require

<pre>
<code class="language-klipse" data-external-libs="https://raw.githubusercontent.com/clojure/test.check/master/src/main/clojure">
    (ns my.spec
        (:require [clojure.spec.alpha :as s]
                  clojure.test.check.generators))
</code></pre>

# balanced parenthesis

~~~klipse
(s/def ::balanced-parenthesis 
  (s/* (s/cat :open #{"("}
                   :p (s/? ::balanced-parenthesis)
                   :close #{")"})))
~~~

~~~klipse
(s/explain-str ::balanced-parenthesis (seq "(()())"))
~~~

~~~klipse
(s/explain-str ::balanced-parenthesis (seq "())())"))
~~~

~~~klipse
(s/exercise ::balanced-parenthesis)
~~~

# Palindromes

~~~klipse
(s/def ::palindrome 
  (s/* (s/alt :a (s/cat :a1 #{"a"}
                        :rest ::palindrome
                        :a2 #{"a"})
              :b (s/cat :b1 #{"b"}
                        :rest ::palindrome
                        :b2 #{"b"}))))
~~~

~~~klipse
(s/explain-str ::palindrome (seq "abba"))
~~~

# Another implementation for palindromes

Thanks Alex Miller!

~~~klipse
(s/def ::pal 
  (s/alt :0 (s/cat)
         :1 int?
         :n (s/& (s/cat :a int? :b ::pal :c int?)
                 (fn [{:keys [a c]}] (= a c)))))
(s/explain-str ::pal [1 2 2 1])
~~~


# Algebraic expressions

~~~klipse
(s/def ::my-int (s/* #{\0 \1 \2 \3 \4 \5 \6 \7 \8 \9}))
(s/def ::ar (s/alt :operation (s/cat :a ::my-int      
                                     :r (s/? (s/cat :op #{"+"}
                                                    :b (s/alt :i ::my-int :e ::ar))))
                   :parentheses (s/cat :o #{"("}
                                       :b (s/alt :i ::my-int :e ::ar)
                                       :c #{")"})))

(s/explain-str ::ar (seq "(2+3)"))
~~~

# args of defn macro

~~~klipse
;;;; destructure

(s/def ::local-name (s/and simple-symbol? #(not= '& %)))

(s/def ::binding-form
  (s/or :sym ::local-name
        :seq ::seq-binding-form
        :map ::map-binding-form))

;; sequential destructuring

(s/def ::seq-binding-form
  (s/and vector?
         (s/conformer vec vec)
         (s/cat :elems (s/* ::binding-form)
                :rest (s/? (s/cat :amp #{'&} :form ::binding-form))
                :as (s/? (s/cat :as #{:as} :sym ::local-name)))))

;; map destructuring

(s/def ::keys (s/coll-of ident? :kind vector?))
(s/def ::syms (s/coll-of symbol? :kind vector?))
(s/def ::strs (s/coll-of simple-symbol? :kind vector?))
(s/def ::or (s/map-of simple-symbol? any?))
(s/def ::as ::local-name)

(s/def ::map-special-binding
  (s/keys :opt-un [::as ::or ::keys ::syms ::strs]))

(s/def ::map-binding (s/tuple ::binding-form any?))

(s/def ::ns-keys
  (s/tuple
    (s/and qualified-keyword? #(-> % name #{"keys" "syms"}))
    (s/coll-of simple-symbol? :kind vector?)))

(s/def ::map-bindings
  (s/every (s/or :mb ::map-binding
                 :nsk ::ns-keys
                 :msb (s/tuple #{:as :or :keys :syms :strs} any?)) :into {}))

(s/def ::map-binding-form (s/merge ::map-bindings ::map-special-binding))

;; bindings

(s/def ::binding (s/cat :binding ::binding-form :init-expr any?))
(s/def ::bindings (s/and vector? (s/* ::binding)))

;; defn, defn-, fn

(s/def ::arg-list
  (s/and
    vector?
    (s/conformer vec vec)
    (s/cat :args (s/* ::binding-form)
           :varargs (s/? (s/cat :amp #{'&} :form ::binding-form)))))

(s/def ::args+body
  (s/cat :args ::arg-list
         :prepost (s/? map?)
         :body (s/* any?)))

(s/def ::defn-args
  (s/cat :name simple-symbol?
         :docstring (s/? string?)
         :meta (s/? map?)
         :bs (s/alt :arity-1 ::args+body
                    :arity-n (s/cat :bodies (s/+ (s/spec ::args+body))
                                    :attr (s/? map?)))))


(s/def ::arg-list
  (s/and
    vector?
    (s/conformer vec vec)
    (s/cat :args (s/* ::binding-form)
           :varargs (s/? (s/cat :amp #{'&} :form ::binding-form)))))

(s/def ::args+body
  (s/cat :args ::arg-list
         :prepost (s/? map?)
         :body (s/* any?)))

(s/def ::defn-args
  (s/cat :name simple-symbol?
         :docstring (s/? string?)
         :meta (s/? map?)
         :bs (s/alt :arity-1 ::args+body
                    :arity-n (s/cat :bodies (s/+ (s/spec
 ::args+body))
                                    :attr (s/? map?)))))

~~~

~~~klipse
(s/conform ::defn-args '(foo "foo is a multi-arity function" {:private true} ([a b] (+ a b)) ([] (foo 1 1))))
~~~

~~~klipse
(s/conform ::arg-list '[a b & c])
~~~

~~~klipse
(s/conform ::binding-form '{:keys [a b c] :or {aa 2} :as pp})
~~~

~~~klipse
(s/conform ::defn-args '(foo "foo multiplies a and b" [[a b]] (+ a b)))
~~~

~~~klipse
(s/unform ::defn-args (s/conform ::defn-args '(foo "aa" [[a b]] (+ a b (first c)))))
~~~

#  custom defn

~~~klipse
(ns my.m$macros
  (:require [clojure.spec.alpha :as s]))
~~~

~~~klipse
(defmacro defprint [& args]
  (let [conf (s/conform :my.spec/defn-args args)
        name (:name conf)
        new-conf (update-in conf [:bs 1 :body] #(cons `(print '~name "has been called") %))
        new-args (s/unform :my.spec/defn-args new-conf)]
    (print "conf: " conf)
    (print "name:" name)
    (print "new-conf: " new-conf)
     (print "new-args: " new-args)
    (cons 'cljs.core/defn new-args)))
~~~

~~~klipse
(my.m/defprint foo "aa" [[a b]] (+ a b (first c)))
(foo [55 200 10 200])
(with-out-str (foo [55 200]))
~~~

# multi-arity

~~~klipse

(defn update-conf [arity conf body-update]
  (case arity
    :arity-1 (update-in conf [:bs 1 :body] body-update)
    :arity-n
    (let [bodies (:bodies (second (:bs conf)))
          new-bodies (mapv (fn [body] (update body :body body-update)) bodies)]
      (assoc-in conf [:bs 1 :bodies] new-bodies))))

(defmacro defprint-multi [& args]
  (let [conf (s/conform :my.spec/defn-args args)
        name (:name conf)
        arity (first (:bs conf))
        my-conf (update-conf arity conf #(cons `(print '~name " is  called")))
        new-args (s/unform :my.spec/defn-args my-conf)]
    (print "old-conf:" conf)
    (print "new-conf:" my-conf)
    (cons 'cljs.core/defn new-args)))
~~~

~~~klipse
(defn new-conf [arity conf name]
  (case arity
    :arity-1 (update-in conf [:bs 1 :body] #(cons `(print '~name "has been called") %))
    :arity-n
    (let [bodies (:bodies (second (:bs conf)))
          new-bodies (mapv (fn [body] (update body :body #(cons `(print '~name "has been called") %))) bodies)]
      (assoc-in conf [:bs 1 :bodies] new-bodies))))

(defmacro defprint-multi [& args]
  (let [conf (s/conform :my.spec/defn-args args)
        name (:name conf)
        arity (first (:bs conf))
        my-conf (new-conf arity conf name)
        new-args (s/unform :my.spec/defn-args my-conf)]
    (print "old-conf:" conf)
    (print "new-conf:" my-conf)
    (cons 'cljs.core/defn new-args)))
~~~

~~~klipse
(my.m/defprint-multi foo "aa" [{:keys [a b]}] (+ a b (first c)))
(foo {:a 55 :b 200})
(my.m/defprint-multi bar 
  ([] (* 10 12))
  ([a b] (* a b)))

(bar)
(bar 12 3)
~~~

~~~klipse
(keys my-spec)
~~~



