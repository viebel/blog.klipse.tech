---
layout: post
title:  "str vs. pr-str - humans vs. machines"
description:  "Human printing vs. data printing. str pr-str. pprint. Stringification in clojure"
date:   2016-11-24 05:34:18 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "A511D476-D801-46B4-BDAA-F96D3E19E08C"
author: "@viebel"
---

This post is an interactive adaptation of a detailed [explanation of Alex Miller](https://groups.google.com/forum/#!topic/clojure/_qzaqqkMHHw) in the Clojure Google group about Clojure print system.

Clojure's print system has two families of functions:

1. one for human consumption
2. and one for machine consuption

![robot](/assets/human-robot.jpg)

Many kinds of Clojure data print the same in either mode (strings are one exception).

# The human printing functions

The human printing is most commonly encountered with functions like `println`, `print` and `str`. It's designed to print things to the repl or to the console for a person to read:

Strings print without the surrounding quotes:

~~~klipse
(str "Hello World!")
~~~


Newlines are really printed as newlines:

~~~klipse
(str "Hello\nWorld!")
~~~

Tabs are really printed as tabs:

~~~klipse
(str "Hello\tWorld!")
~~~

, etc...

> Dear reader, what other examples could you think about? Please add a comment below...


`str` doesn't directly use either Clojure printing mode but instead returns the `toString()` of each object (this is Java[script]'s built-in printing system).

~~~klipse
(.toString "Hello\nWorld!")
~~~

For strings, both Clojure's printing and `str` wind up just relying on Java[script] to print a string in a "human-readable" way.

# The problem with humans

The problem with humans is that they don't like to read like machines. In other words `str` and `read-string` do not always play well together. Let's see it in action:

(In clojurescript, `read-string` is not part of the core so we have to explicitly require it.)

~~~klipse
(require '[cljs.reader :as r :refer [read-string]])
~~~

~~~klipse
(-> (str "Hello World!")
    read-string)
~~~

Oh oh...

What's happened there? Where is the World?

In order to discover it, let's check what is the type of the object returned by `read-string`:

It is not a string:

~~~klipse
(-> (str "Hello World!")
    read-string
    string?)
~~~

But it is a symbol:

~~~klipse
(-> (str "Hello World!")
    read-string
    symbol?)
~~~

The reason is because `str` omits the surrounding quotes - in order to be human friendly:

~~~klipse
(str "Hello World!")
~~~

So, for `read-string`, this string is in fact composed of two symbols. And `read-string` reads only one object.

~~~klipse
(read-string "Hello World!")
~~~

In order to be `read-string`, one has to **not-omit** the surrounding quotes:


~~~klipse
(read-string "\"Hello World!\"")
~~~

This is exactly the purpose of clojure's data printing functions...

# The data printing functions - for machine consumption

The data printing functions are things like:

- `pr` - like `print`, but for data
- `prn` - like `println`, but for data
- `pr-str` - like `str`, but for data

The idea with the data printers is that the thing you print should be readable by Clojure. So `pr-str` etc... will print a string as the actual characters Clojure would need to read that string back as data.


Strings print with the surrounding quotes:

~~~klipse
(pr-str "Hello World!")
~~~

Newlines are printed as `\n`:

~~~klipse
(pr-str "Hello\nWorld!")
~~~

Tabs are printed as `\t`:

~~~klipse
(pr-str "Hello\nWorld!")
~~~

# Clojure types

Clojure types (like maps) implement `toString()` to route back into the Clojure printing system.

So `str` and `pr-str` prints the same:

~~~klipse
(str {:first "Hello"
      :second "World!"})
~~~

~~~klipse
(pr-str {:first "Hello"
      :second "World!"})
~~~


# What else?

This is the big picture. I have left the even more complicated pretty printing (`pprint`) and `cl-format` (following CommonLisp) parts.

You are in a maze of twisty little passages, all alike. If you look too hard at it, you are likely to be eaten by a grue.

The `print` and `pprint` systems also have many dynamic vars to influence behavior and a number of multimethods intended for extension or modification.

In particular, you can provide your own printers for either built-in types or custom records or types by extending things like `print-method` (human) or `print-dup` (data).

If anyone wanted to write a mini Clojure book, this would be a killer topic.


