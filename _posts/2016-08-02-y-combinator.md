---
layout: post
title:  "Lambda Calculus Live Tutorial: Recursions without names"
description:  "Lambda Calculus Live Tutorial: Recursions without names"
date:   2016-08-02 07:22:31 +0200
categories: lambda
thumbnail: assets/klipse.png
guid: "E9F1C71A-64B1-490D-821B-7B5B4D9AB788"
author: "@viebel"

---


~~~klipse
(defn factorial [n]
 (if (zero? n)
   1
     (* n (factorial (dec n)))))
~~~

~~~klipse
(factorial 10)
~~~

~~~klipse
(defn factorial-gen [func]
  (fn [n]
    (if (zero? n)
      1
      (* n (func (dec n))))))
~~~

~~~klipse
((factorial-gen nil)
 0)
~~~

~~~klipse
((factorial-gen
   (factorial-gen nil))
 1)
~~~

~~~klipse
((factorial-gen
   (factorial-gen
        (factorial-gen nil)))
 2)
~~~

~~~klipse

((factorial-gen
   (factorial-gen
      (factorial-gen
           (factorial-gen nil))))
 3)
~~~

f^n = f^n+1 
=> f^n = (f f^n)
=> f^n is a fixed point of f

(f g) = g

# Generalisation until n

~~~klipse
(defn factorial-gen-until [n]
  ((apply comp (repeat (inc n) factorial-gen)) nil))
~~~

~~~klipse
((factorial-gen-until 10) 10)
~~~

~~~klipse
(defn fn-gen-until [f n]
  ((apply comp (repeat (inc n) f)) nil))
~~~


~~~klipse
((fn-gen-until factorial-gen 10) 9)
~~~


# Generalisation until ∞: No Limit

~~~klipse
(defn fn-gen-no-limit [f]
  (fn [n]
    (((apply comp (repeat (inc n) f)) nil) n)))
~~~

~~~klipse
((fn-gen-no-limit factorial-gen) 14)
~~~


This is cheating because `comp` implementation uses recursion...


# The Y Combinator

`Y ≡ λf.(λx.f(xx))(λx.f(xx))`

`YG = G(YG)`

`YG` is a fixed point of `G`.

`(Y factorial-gen)` is a fixed point of `factorial-gen`.

`(factorial-gen (Y factorial-gen)) = (Y factorial-gen)`.

Let's assume that `(Y factorial-gen)` works up to `n` then `(factorial-gen (Y factorial-gen)` works up to `n + 1`. Thus `(Y factorial-gen)` works up to `n+1`. CQFD

`(factorial-gen factorial)` is exactly `factorial`!
`factorial` is a fixed point of `factorial-gen`.

The claim is that any function that is a fixed point of `factorial-gen` is equal to `factorial`.


~~~klipse
;; Y combinator
(defn Y [f] ;;  λf
  ((fn [future] ;; λx
     (future future)) ;; f(x x)
   (fn [future] ;; λx
     (f (fn [arg]
          ((future future) arg)))))) ;; f(x x)
~~~


~~~klipse
((Y factorial-gen) 10)
~~~


~~~klipse
;; Y combinator
(defn YY [m] ;;  λf
  ((fn [future] ;; λx
     (m (fn [arg]
          ((future future) arg)))) ;; f(x x)
   (fn [future] ;; λx
     (m (fn [arg]
          ((future future) arg)))))) ;; f(x x)

((YY factorial-gen) 10)

~~~


~~~klipse
;; Y combinator
(defn YYY [m] ;;  λf
  ((fn [future] ;; λx
     (m (future future))) ;; f(x x)
   (fn [future] ;; λx
     (m (fn [arg]
          ((future future) arg)))))) ;; f(x x)

((YY factorial-gen) 10)
~~~klipse
