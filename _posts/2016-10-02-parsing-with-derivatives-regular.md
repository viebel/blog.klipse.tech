---
layout: post
title:  "Parsing with derivatives - Elegant matching of regular languages in clojure"
description:  "Parsing with derivatives - regular languages"
date:   2016-10-02 09:22:07 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "A5584B91-A757-470A-8E27-F8986EB57B88"
mathjax: true
klipse_line_numbers: true
author: "@viebel"
---

# Introduction

This article is an interactive version of the first part of this paper: [Parsing with derivatives - a Functional Pearl](http://matt.might.net/papers/might2011derivatives.pdf) - the part that shows how to implement a regular expression matcher in a few lines of code using a concept from 1964 named Brzozowski's derivative.

As David Nolen explains it in [his talk about this paper at Papers We Love](https://youtu.be/FKiEsJiTMtI), `clojure.spec` implementation is based on this paper.

In this article, we are going to implement a regular expression matcher in `clojure` using Brzozowski's derivative.

The theoretical part is a bit abstract but it worths making the effort as the implementation is really elegant.


![Zen](/assets/zen.jpg)

# Preliminary: Formal languages

**Definition**: A language `L` is a set of strings.

**Definition**: A string `w` is a sequence of characters from an alphabet `A`.

Examples of languages:

- The empty language \\( \emptyset \\) that contains no strings at all

- The null language \\( \epsilon \\) contains only the empty string `""`

- The singleton languages that contain a single string made of a single character from the alphabet



# Regular languages

A regular language is a language that can be defined from atomic languages using 3 basic operations - without using recursion:

- **Concatenation** of \\(L_1\\) and \\(L_2\\) - noted \\( L_1 \circ L_2 \\): the strings formed by concatenating a string from \\(L_1\\) followed by a string from \\(L_2\\).
- **Union** of \\(L_1\\) and \\(L_2\\) - noted \\(L_1 \cup L_2 \\): the strings that belong either to \\(L_1\\) or to \\(L_2\\).
- **Repetition** (a.k.a Kleene star) of \\(L\\) - noted \\(L^{\*} \\): the strings formed by concatenating a finite number (including zero) of strings from \\(L\\).


We can encode a regular language programatically using types.


All the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


Here, in `clojure`, we are going to use `types`, type detectors and convenient construtors that deal with multi-arity.

The empty language:

~~~klipse
(deftype empty-type [])
(def empty ->empty-type)
(defn empty? [x] (= (type x) empty-type))
(empty? (empty))
~~~

The null language \\( \epsilon \\) (that contains only the empty string):

~~~klipse
(deftype eps-type [])
(def eps ->eps-type)
(defn eps? [x] (= (type x) eps-type))
(eps? (eps))
~~~

The language that contains a single string made of a single character:

~~~klipse
(deftype char-type [c])
(def char ->char-type)
(defn char? [x] (= (type x) char-type))
(char? (char \a))
~~~

The concatenation of two or more languages:

~~~klipse
(deftype cat-type [left right])
(defn cat 
  ([a b]  (cat-type. a b))
  ([a b & args] (apply cat (cat-type. a b) args)))
(defn cat? [x] (= (type x) cat-type))

(cat? (cat (char \a) (char \b) (char \c)))
~~~

The union (a.k.a alt) of two or more languages:

~~~klipse
(deftype alt-type [this that])
(defn alt 
  ([a b]  (alt-type. a b))
  ([a b & args] (apply alt (alt-type. a b) args)))
(defn alt? [x] (= (type x) alt-type))

(alt? (alt (char \a) (char \b) (char \c)))
~~~

The repetition of a language:

~~~klipse
(deftype rep-type [lang])
(def rep ->rep-type)
(defn rep? [x] (= (type x) rep-type))
(rep? (rep (char \a)))
~~~

For instance the regexp `/a*b[ce]/` is encoded like this:

~~~klipse
(cat (rep (char \a))
     (char \b)
     (alt (char \c)
          (char \e)))
~~~

The regexp for detecting a floating point number `[-+]?[0-9]*\.?[0-9]+` is encoded this way:

~~~klipse
(def digit (alt (char \0) (char \1)(char \2)(char \3)(char \4)(char \5)(char \6)(char \7)(char \8)(char \9)))
(def float-number (cat (alt (eps)
          (alt (char \+) (char \-)))
     (rep digit)
     (char \.)
     digit
     (rep digit)))
~~~

# The nullability function 

It turns out that the fact that a language contains the empty string or not is essential. (We will explain why later...)


Let's define the nullability function \\(\delta \\):


\\[\delta(L) = true \textrm{ if } \epsilon \in L \\]
\\[\delta(L) = false \textrm{ if } \epsilon \notin L \\]

The nullability function has the following recursive properties:


\\[\delta(\emptyset) = false\\]
\\[\delta(\epsilon) = true\\]
\\[\delta(c) = false\\]
\\[\delta(L_1 \cup L_2) = \delta(L_1) \textrm{ or } \delta(L_2)\\]
\\[\delta(L_1 \circ L_2) = \delta(L_1) \textrm{ and } \delta(L_2) \textrm{}\\]
\\[\delta(L^{\*}) = true \\]

It's trivial to code this function in `clojure`: 

~~~klipse
(defn d "Nullability function - returns true if the language contains the empty string"
  [L]
  (cond
    (empty? L) false
    (eps? L) true
    (char? L) false
    (rep? L) true
    (alt? L) (or (d (.-this L)) (d (.-that L)))
    (cat? L) (and (d (.-left L)) (d (.-right L)))
    :else (throw (str "not a language: " L ", c: " c))))
~~~

Let's test this function:

~~~klipse
(d (cat (char \a) (char \b) (char \c)))
~~~


~~~klipse
(d (alt (char \a) (eps)))
~~~

~~~klipse
(d (alt (char \a) (rep (char \b))))
~~~

# Brzozowski's derivative

In 1964, Brzozowski (don't try to pronounce his name) introduced a simple yet powerful concept in his work on recognition of regular languages:

**Definition**: The derivative of a language `L` with respect to a character `c` is a new language that has been "filtered" and "chopped" - \\( D_c(L) \\):

1. First, retain only the strings that start with the character `c`.

2. Second, chop that first character off every string.

In  mathematical notation:

\\[ D_c(L) = \\{w : wc \in L \\}.\\]


Examples:

\\[D_b \\{foo, bar, baz\\} = \\{ar, az\\} \\]
\\[D_f \\{foo, bar, baz\\} = \\{oo\\} \\]
\\[D_a \\{foo, bar, baz\\} = \emptyset \\]


# Code for Brzozowski's derivative 

The nice thing about the derivative is that it can be defined recursively from the atomic languages. 

We will first enumerate its recursive properties and then implement it in a couple of lines of code.

For the atomic languages:


\\[ D\_c(\emptyset) = \emptyset \\] 
\\[ D\_c(\epsilon) = \emptyset \\] 
\\[ D\_c(c) = \epsilon \\] 
\\[ D\_c(c') = \emptyset \textrm{ if } c \ne c' \\] 

For the union:


\\[ D\_c(L_1 \cup L_2) =  D\_c(L_1) \cup D\_c(L_2) \\] 


For the Kleene star:

\\[ D\_c(L^{\*}) =  D\_c(L) \circ L^{\*} \\] 

For the concatenation:


\\[ D\_c(L_1 \circ L_2) =  D\_c(L_1) \circ L_2 \textrm{ if } \epsilon \notin L_1\\] 

\\[ D\_c(L_1 \circ L_2) =  D\_c(L_1) \circ L_2 \cup D_c(L_2) \textrm{ if } \epsilon \in L_1\\] 

And now the code:

~~~klipse
(defn D "returns Brzozowski's derivative of L by c"
  [c L]
  (cond
    (empty? L) (empty)
    (eps? L) (empty)
    (char? L) (if (= (.-c L) c)
                     (eps)
                     (empty))
    (alt? L) (alt (D c (.-this L))
                   (D c (.-that L)))
    (cat? L) (let [L1 (.-left L)
                   L2 (.-right L)]
               (if (d L1)
                 (alt (cat (D c L1) L2)
                      (D c L2))
                 (cat (D c L1) L2)))
    (rep? L) (cat (D c (.-lang L)) L)
    :else (throw (str "not a language: " L ", c: " c))))
~~~


# The importance of the derivative


> To determine membership of a string, derive the language with respect to each character of the string and check if the final language conatains the `null` string: if yes, `s` belongs to the the language; otherwise it doesn't

For instance, let's derivate the string `abc` with respect to `a` then `b` then `c` - and computes the nullability function of the result:

~~~klipse
(->> (cat (char \a) (char \b) (char \c))
     (D \a)
     (D \b)
     (D \c)
     d)
~~~

We can code this property, very easilly:

~~~klipse
(defn matches?
"Determines whether a string belongs to a language"
[w L]
  (if (clojure.core/empty? w)
      (d L)
      (matches? (subs w 1) (D (first w) L))))
~~~

Note that we used the fully qualified `clojure.core/empty?` because we have defined `empty?` to be the type detector of the empty language.

Actually, we are done: `matches?` is our regular expression matcher in `clojure`.  


Let's see it in action with the `float-number` language that we have defined above:


~~~klipse
(map #(matches? % float-number) ["-2.0" "1" "" "+12.12" "1.0"])
~~~


All the code of this article is consolidated in an [interactive gist](http://app.klipse.tech/?eval_only=1&cljs_in.gist=viebel/21fd0e02d1a1d85b2e2089568f16828c).

Happy parsing!

