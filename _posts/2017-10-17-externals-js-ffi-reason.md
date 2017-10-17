---
layout: post
title: Type-safe bindings from JS to Reason for dummies
description: FFI. type safe bindings from JS to Ocaml and Reason. external javascript declaration.
date:   2017-10-17 17:18:28 +0200
categories: reason
thumbnail: assets/klipse.png
guid: F2886609-0166-4118-A3C9-AA62816B7411
author: "@viebel"
minified_plugin: true
---

Sometimes, we need to be able to access JS code from our `reason` code.
This is part of what is called the `Javasript interop`.

More specifically, this is called FFI (foreign function interface).
A [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface) is a mechanism by which a program written in one programming language can call routines or make use of services written in another.

In the context of `reason`, in order to access JS code, we have to build type-safe bindings from JS to Reason. For that purpose, we have to write type declarations.

FFI in `Reason` is very powerful but this power comes at a price. It is a bit complex to understand how it works.

The purpose of this article is to expose the main features of Reason FFI in a simple way in order to help you overcoming the difficulty of the syntax.


![Burnout](/assets/burn-out.jpg)

# Binding to simple JS functions values

Let's take a look at some examples:

Here is how we make the `Math.sqrt` function accessible to our `reason code`:

~~~klipse-reason
external sqrt : float => float = "Math.sqrt" [@@bs.val];
let a = sqrt 2.0;
~~~

When the assigned name is exactly the same as the original name, we can leave the name empty:

~~~transpile-reason
external sqrt : float => float = "" [@@bs.val];
let a = sqrt 2.0;
~~~

# Binding to JavaScript constructor: bs.new

`bs.new` is used to create a JavaScript object.

~~~klipse-reason
type date;
external create_date : unit => date = "Date" [@@bs.new];
let date = create_date (); 
~~~


# Binding to method: bs.send and bs.send.pipe

`bs.send` allows us to call a method of a JS object.
For instance, this is how we can bind `dom.getElementById`

`dom` is an abstract type for the DOM
`element` is an abstract type fot the element

~~~transpile-reason
type dom;
external dom : dom = "document" [@@bs.val];
type element;
external get_by_id : dom => string => element =
  "getElementById" [@@bs.send];

let a = get_by_id dom "klipse"
~~~


`bs.send.pipe` is similar to `bs.send` except that the first argument, i.e, the object, is put in the position of last argument to help user write in a *chaining style*:

~~~klipse-reason
external map : ('a => 'b) [@bs] => array 'b = "" [@@bs.send.pipe : array 'a];

let test arr => 
	arr
    |> map ((fun x => x + 1) [@bs])
    |> map ((fun x => x * 10) [@bs]);

let a = test [|1,2,3|]
~~~

In case, you are not familiar yet with Ocaml/Reason pipe operator, here is the transpiled js code:

~~~transpile-reason
external map : ('a => 'b) [@bs] => array 'b = "" [@@bs.send.pipe : array 'a];

let test arr => 
	arr
    |> map ((fun x => x + 1) [@bs])
    |> map ((fun x => x * 10) [@bs]);
~~~

> If you are curious about the `[@bs]` attribute in the callback, see [Binding to callbacks (high-order function)](https://bucklescript.github.io/bucklescript/Manual.html#_binding_to_callbacks_high_order_function).


# Binding to dynamic key access/set: bs.set_index and bs.get_index

Here is how we can have a dynamic access to a JavaScript property:


~~~klipse-reason
type js_array;
external create : int => js_array = "Int32Array" [@@bs.new];
external get : js_array => int => int = "" [@@bs.get_index];
external set : js_array => int => int => unit = "" [@@bs.set_index];

let i32arr = create 3;
set i32arr 0 42;
let a = get i32arr 0;
~~~

# Binding to Getter/Setter: bs.get, bs.set

This attribute helps get and set the property of a JavaScript object.

~~~klipse-reason
type textarea;
external set_name : textarea => string => unit = "name" [@@bs.set];
external get_name : textarea => string = "name" [@@bs.get];
~~~

# Splice calling convention: bs.splice

In JS, it is quite common to have a function take variadic arguments. BuckleScript supports typing homogeneous variadic arguments. Instead of passing a variable number of arguments, we pass an array:

~~~klipse-reason
external max : array int => int = "Math.max" [@@bs.val] [@@bs.splice];
let _ = max [|10, 12, 99|];
~~~

# Binding to a value from a module: bs.module

We can bind to values from a js module:

~~~transpile-reason
external add : int => int => int = "add" [@@bs.module "x"];
let f = add 3 4;
~~~

We can even hint the compiler to generate a better name for the module:

~~~transpile-reason
external add : int => int => int = "add" [@@bs.module ("x", "cool-x")];
let f = add 3 4;
~~~

There are many other advanced features of Bucklescript FFI. You can read about the in the excellent official [BuckleScript manual](https://bucklescript.github.io/bucklescript/Manual.html#_ffi).

It is also interesting to note that with FFI it is quite simple to access `React.js` component inside a `ReasonReact` project as it is exlained [here](https://reasonml.github.io/reason-react/docs/en/interop.html).
