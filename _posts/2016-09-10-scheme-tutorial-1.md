---
layout: post
title:  "Interactive overview of Scheme's semantics"
description:  "Interactive overview of Scheme's semantics"
date:   2016-09-11 06:21:29 +0200
categories: scheme
thumbnail: assets/klipse.png
guid: "44ad3264-77ea-11e6-9313-600308a46268"
author: Yehonathan Sharvit
scheme: true
minified_plugin: false
tags: [scheme]
---

## Introduction

Following Algol, Scheme is a statically scoped programming language. Each use of a variable is associated with a lexically apparent binding of that variable.

Scheme has latent as opposed to manifest types. Types are associated with objects (also called values) rather than with variables. (Some authors refer to languages with latent types as untyped, weakly typed or dynamically typed languages.)

Other languages with latent types are Python, Ruby, Smalltalk, and other dialects of Lisp.

Languages with manifest types (sometimes referred to as strongly typed or statically typed languages) include Algol 60, C, C#, Java, Haskell, and ML.

Scheme was one of the first languages to support procedures as objects in their own right. Procedures can be created dynamically, stored in data structures, returned as results of procedures, and so on. Other languages with these properties include Common Lisp, Haskell, ML, Ruby, and Smalltalk.

One distinguishing feature of Scheme is that continuations - which in most other languages only operate behind the scenes - also have “first-class” status. First-class continuations are useful for implementing a wide variety of advanced control constructs, including non-local exits, backtracking, and coroutines.

In Scheme, the argument expressions of a procedure call are evaluated before the procedure gains control, whether the procedure needs the result of the evaluation or not.

C, C#, Common Lisp, Python, Ruby, and Smalltalk are other languages that always evaluate argument expressions before invoking a procedure.

This is distinct from the lazy-evaluation semantics of Haskell, or the call-by-name semantics of Algol 60, where an argument expression is not evaluated unless its value is needed by the procedure.

![Everest](/assets/everest.jpg)

## Tutorial through code examples

All the code snippets of this page are **live** and **interactive** powered by the [klipse plugin](https://github.com/viebel/klipse):

1. **Live**: The code is executed in your browser
2. **Interactive**: You can modify the code and it is evaluated as you type


This tutorial is an interactive adaptation of the [Overview of Scheme](http://www.r6rs.org/final/html/r6rs/r6rs-Z-H-4.html#node_chap_1) written by [r6rs.org](http://www.r6rs.org).

The evaluation of scheme code in the browser is powered by [biwascheme](https://github.com/biwascheme/biwascheme).


##  Basic types

Scheme programs manipulate objects, which are also referred to as values. Scheme objects are organized into sets of values called types. This section gives an overview of the fundamentally important types of the Scheme language. More types are described in later chapters.

>As Scheme is latently typed, the use of the term type in this report differs from the use of the term in the context of other languages, particularly those with manifest typing.

### Booleans

A boolean is a truth value, and can be either true or false. In Scheme, the object for “false” is written #f. The object for “true” is written #t. In most places where a truth value is expected, however, any object different from #f counts as true.

~~~klipse-scheme
#t
~~~

~~~klipse-scheme
#f
~~~


### Numbers

Scheme supports a rich variety of numerical data types, including objects representing integers of arbitrary precision, rational numbers, complex numbers, and inexact numbers of various kinds.

### Characters

Scheme characters mostly correspond to textual characters. More precisely, they are isomorphic to the scalar values of the Unicode standard.

~~~klipse-scheme
#\a
~~~

### Strings

Strings are finite sequences of characters with fixed length and thus represent arbitrary Unicode texts.

~~~klipse-scheme
"Hello, Scheme"
~~~

### Symbols

A symbol is an object representing a string, the symbol's name. Unlike strings, two symbols whose names are spelled the same way are never distinguishable. Symbols are useful for many applications; for instance, they may be used the way enumerated values are used in other languages.

### Pairs and lists

A pair is a data structure with two components. The most common use of pairs is to represent (singly linked) lists, where the first component (the `car`) represents the first element of the list, and the second component (the `cdr`) the rest of the list. Scheme also has a distinguished empty list, which is the last `cdr` in a chain of pairs that form a list.

~~~klipse-scheme
(car '(1 2 3))
~~~
~~~klipse-scheme
(cdr '(1 2 3))
~~~


### Vectors

Vectors, like lists, are linear data structures representing finite sequences of arbitrary objects. Whereas the elements of a list are accessed sequentially through the chain of pairs representing it, the elements of a vector are addressed by integer indices. Thus, vectors are more appropriate than lists for random access to elements.

~~~klipse-scheme
#(1 2 3)
~~~

~~~klipse-scheme
(vector-ref #(1 2 3) 2)
~~~


## Expressions

The most important elements of Scheme code are expressions. Expressions can be evaluated, producing a value. The most fundamental expressions are literal expressions:

~~~klipse-scheme
#t
~~~

~~~klipse-scheme
23
~~~


This notation means that the expression #t evaluates to #t, that is, the value for “true”, and that the expression 23 evaluates to a number object representing the number 23.

Compound expressions are formed by placing parentheses around their subexpressions. The first subexpression identifies an operation; the remaining subexpressions are operands to the operation:

In the following expression, `+` is the name of the built-in operation for addition, and 23 and 42 are the operands. The expression `(+ 23 42)` reads as “the sum of 23 and 42”.

~~~klipse-scheme
(+ 23 42)
~~~

Compound expressions can be nested: the following expression reads as “the sum of 14 and the product of 23 and 42”.

~~~klipse-scheme
(+ 14 (* 23 42))
~~~


As these examples indicate, compound expressions in Scheme are always written using the same prefix notation. As a consequence, the parentheses are needed to indicate structure. Consequently, “superfluous” parentheses, which are often permissible in mathematical notation and also in many programming languages, are not allowed in Scheme.

As in many other languages, whitespace (including line endings) is not significant when it separates subexpressions of an expression, and can be used to indicate structure.

### Infinity

It is possible to deal a bit with the infinity in Scheme. Here is how we represent the infinity:


~~~klipse-scheme
+inf.0
~~~


Every number is less than `infinity`:

~~~klipse-scheme
(< 999999999 +inf.0)
~~~

And when we add a number to `infinity`, nothing happens:

~~~klipse-scheme
(= +inf.0 (+ 999 +inf.0))
~~~


# Variables and binding

Scheme allows identifiers to stand for locations containing values. These identifiers are called variables. In many cases, specifically when the location's value is never modified after its creation, it is useful to think of the variable as standing for the value directly.

~~~klipse-scheme
(let ((x 23)
      (y 42))
  (+ x y))
~~~


In this case, the expression starting with let is a binding construct. The parenthesized structure following the let lists variables alongside expressions: the variable `x` alongside 23, and the variable `y` alongside 42. The let expression binds `x` to 23, and `y` to 42. These bindings are available in the body of the let expression, `(+ x y)`, and only there.

#  Definitions

The variables bound by a let expression are local, because their bindings are visible only in the let's body. Scheme also allows creating top-level bindings for identifiers as follows:

~~~klipse-scheme
(define x 23)
(define y 42)

(+ x y)
~~~


The first two parenthesized structures are definitions; they create top-level bindings, binding `x` to 23 and `y` to 42. Definitions are not expressions, and cannot appear in all places where an expression can occur. Moreover, a definition has no value.

~~~klipse-scheme
(define c 123)
~~~

Bindings follow the lexical structure of the program: When several bindings with the same name exist, a variable refers to the binding that is closest to it, starting with its occurrence in the program and going from inside to outside, and referring to a top-level binding if no local binding can be found along the way:

~~~klipse-scheme
(define x 23)
(define y 42)

(let ((y 43))
  (+ x y))
~~~

~~~klipse-scheme
(let ((y 43))
  (let ((y 44))
    (+ x y)))
~~~


# Forms

While definitions are not expressions, compound expressions and definitions exhibit similar syntactic structure:

~~~klipse-scheme
(define x 23)
(* x 2)
~~~

While the first line contains a definition, and the second an expression, this distinction depends on the bindings for `define` and `*`. At the purely syntactical level, both are forms, and form is the general name for a syntactic part of a Scheme program. In particular, 23 is a subform of the form `(define x 23)`.

#  Procedures

Definitions can also be used to define procedures:

~~~klipse-scheme
(define (f x)
  (+ x 42))

(f 23)
~~~


A procedure is, slightly simplified, an abstraction of an expression over objects. In the example, the first definition defines a procedure called `f`. (Note the parentheses around `f x`, which indicate that this is a procedure definition.) The expression `(f 23)` is a procedure call, meaning, roughly, “evaluate `(+ x 42)` (the body of the procedure) with `x` bound to 23”.

As procedures are objects, they can be passed to other procedures:

~~~klipse-scheme
(define (f x)
  (+ x 42))

(define (g p x)
  (p x))

(g f 23)
~~~


In this example, the body of `g` is evaluated with `p` bound to `f` and `x` bound to 23, which is equivalent to `(f 23)`, which evaluates to 65.

In fact, many predefined operations of Scheme are provided not by syntax, but by variables whose values are procedures. The `+` operation, for example, which receives special syntactic treatment in many other languages, is just a regular identifier in Scheme, bound to a procedure that adds number objects. The same holds for `*` and many others:

~~~klipse-scheme
(define (h op x y)
  (op x y))

(h + 23 42)
~~~

~~~klipse-scheme
(h * 23 42)
~~~


Procedure definitions are not the only way to create procedures. A `lambda` expression creates a new procedure as an object, with no need to specify a name:

~~~klipse-scheme
((lambda (x) (+ x 42)) 23)
~~~

The entire expression in this example is a procedure call: `(lambda (x) (+ x 42))`, evaluates to a procedure that takes a single number object and adds 42 to it.

#  Procedure calls and syntactic keywords

Whereas `(+ 23 42)`, `(f 23)`, and `((lambda (x) (+ x 42)) 23)` are all examples of procedure calls, `lambda` and `let` expressions are not. This is because `let`, even though it is an identifier, is not a variable, but is instead a syntactic keyword.

A form that has a syntactic keyword as its first subexpression obeys special rules determined by the keyword. The `define` identifier in a definition is also a syntactic keyword. Hence, definitions are also not procedure calls.

The rules for the `lambda` keyword specify that the first subform is a list of parameters, and the remaining subforms are the body of the procedure. In `let` expressions, the first subform is a list of binding specifications, and the remaining subforms constitute a body of expressions.

Procedure calls can generally be distinguished from these special forms by looking for a syntactic keyword in the first position of an form: if the first position does not contain a syntactic keyword, the expression is a procedure call. (So-called identifier macros allow creating other kinds of special forms, but are comparatively rare.)

The set of syntactic keywords of Scheme is fairly small, which usually makes this task fairly simple. It is possible, however, to create new bindings for syntactic keywords.

# Assignment

Scheme variables bound by definitions or let or lambda expressions are not actually bound directly to the objects specified in the respective bindings, but to locations containing these objects. The contents of these locations can subsequently be modified destructively via assignment:

~~~klipse-scheme
(let ((x 23))
  (set! x 42)
  x)
~~~


In this case, the body of the let expression consists of two expressions which are evaluated sequentially, with the value of the final expression becoming the value of the entire let expression. The expression `(set! x 42)` is an assignment, saying “replace the object in the location referenced by `x` with 42”. Thus, the previous value of `x`, 23, is replaced by 42.

# Derived forms and macros

Many of the special forms specified in this report can be translated into more basic special forms. For example, a let expression can be translated into a procedure call and a lambda expression. The following two expressions are equivalent:

~~~klipse-scheme
(let ((x 23)
      (y 42))
  (+ x y))
~~~

~~~klipse-scheme
((lambda (x y) (+ x y)) 23 42)
~~~


Special forms like `let` expressions are called derived forms because their semantics can be derived from that of other kinds of forms by a syntactic transformation. Some procedure definitions are also derived forms. The following two definitions are equivalent:

~~~klipse-scheme
(define (f x)
  (+ x 42))
~~~

~~~klipse-scheme
(define f
  (lambda (x)
    (+ x 42)))
~~~


In Scheme, it is possible for a program to create its own derived forms by binding syntactic keywords to macros:

~~~scheme
(define-syntax def
  (syntax-rules ()
    ((def f (p ...) body)
     (define (f p ...)
       body))))
~~~

~~~scheme
(def f (x)
  (+ x 42))
~~~


The define-syntax construct specifies that a parenthesized structure matching the pattern `(def f (p ...) body)`, where `f`, `p`, and `body` are pattern variables, is translated to `(define (f p ...) body)`. Thus, the `def` form appearing in the example gets translated to:

~~~scheme
(define (f x)
  (+ x 42))
~~~

The ability to create new syntactic keywords makes Scheme extremely flexible and expressive, allowing many of the features built into other languages to be derived forms in Scheme.

#  Syntactic data and datum values

A subset of the Scheme objects is called datum values. These include booleans, number objects, characters, symbols, and strings as well as lists and vectors whose elements are data.

Each datum value may be represented in textual form as a syntactic datum, which can be written out and read back in without loss of information. A datum value may be represented by several different syntactic data. Moreover, each datum value can be trivially translated to a literal expression in a program by prepending a `'` to a corresponding syntactic datum:



~~~klipse-scheme
'23
~~~

~~~klipse-scheme
'#t
~~~

The `'` shown in the previous examples is not needed for representations of number objects or booleans.

~~~klipse-scheme
'23
~~~

~~~klipse-scheme
'#t
~~~


The syntactic datum `foo` represents a symbol with name `“foo”`, and `'foo` is a literal expression with that symbol as its value.

~~~klipse-scheme
'foo
~~~

`(1 2 3)` is a syntactic datum that represents a list with elements 1, 2, and 3, and `'(1 2 3)` is a literal expression with this list as its value.

~~~klipse-scheme
'(1 2 3)
~~~

Likewise, `#(1 2 3)` is a syntactic datum that represents a vector with elements 1, 2 and 3, and '#(1 2 3) is the corresponding literal.

~~~klipse-scheme
'#(1 2 3)
~~~


The syntactic data are a superset of the Scheme forms. Thus, data can be used to represent Scheme forms as data objects. In particular, symbols can be used to represent identifiers.

~~~klipse-scheme
'(+ 23 42)
~~~

~~~klipse-scheme
'(define (f x) (+ x 42))
~~~


This facilitates writing programs that operate on Scheme source code, in particular interpreters and program transformers.

# Continuations

Whenever a Scheme expression is evaluated there is a continuation wanting the result of the expression. The continuation represents an entire (default) future for the computation. 

For example, informally the continuation of 3 in the expression `(+ 1 3)` adds 1 to it.

Normally these ubiquitous continuations are hidden behind the scenes and programmers do not think much about them. On rare occasions, however, a programmer may need to deal with continuations explicitly.

The `call-with-current-continuation` procedure allows Scheme programmers to do that by creating a procedure that reinstates the current continuation. The `call-with-current-continuation` procedure accepts a procedure, calls it immediately with an argument that is an escape procedure. This escape procedure can then be called with an argument that becomes the result of the call to `call-with-current-continuation`. That is, the escape procedure abandons its own continuation, and reinstates the continuation of the call to `call-with-current-continuation`.

In the following example, an escape procedure representing the continuation that adds 1 to its argument is bound to escape, and then called with 3 as an argument. The continuation of the call to escape is abandoned, and instead the 3 is passed to the continuation that adds 1:

~~~klipse-scheme
(+ 1 (call-with-current-continuation
       (lambda (escape)
         (+ 2 (escape 3))))) 
~~~

An escape procedure has unlimited extent: It can be called after the continuation it captured has been invoked, and it can be called multiple times. This makes call-with-current-continuation significantly more powerful than typical non-local control constructs such as exceptions in other languages.


# Conclusion

If you like it, go ahead an provide in the comments some examples of cool code in Scheme. For instance, I'm really curious to see a real-life application of the `call-with-current-continuation`...
