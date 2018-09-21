---
local_klipse: false
layout: post
title:  Hello Clojure
description:  Run Clojure code snippets from command line. Hello World in Clojure.
date:   2018-09-16 05:21:34 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: "02DDCE95-D027-4701-B0C3-B055A8FD9FAB"
author: "@viebel"
---


# Introduction

For many years, Clojure was known as a language that is not beginner friendly. For sure, the unusual order of the parenthesis contributed to this reputation, but also the complexity of the required tools in order to achieve a simple task like running a "Hello World" program. 

Rich Hickey (the inventor of Clojure) often says that good Programming Languages are like Musical instruments: they are designed for professionals. You need to learn (and sometimes suffer during the learning period) in order to become a professional. This might hurt at the beginning. And even for professionals, it require some effort to perform at their best. Look at the fact of John Coltrane when he plays the saxophone!

![Coltrane](/assets/coltrane.png)

Anyway, the order of the parenthesis is not going to change: Clojure is and will always be a LISP dialect. 

But since the release of Clojure 1.9.0 in December 2017, Clojure features command-line tools that make it very easy (and not only simple) to run Clojure programs.




# CLI tool installation 

On Mac and Linux, it is very straightforward to install the Clojure CLI (Command Line Interface) tools; on Windows, you need to first install WSL on Windows and then follow the same instructions as for Linux.

On Mac

~~~bash
brew install clojure
~~~

On Linux:

~~~bash
curl -O https://download.clojure.org/install/linux-install-1.9.0.394.sh
chmod +x linux-install-1.9.0.394.sh
sudo ./linux-install-1.9.0.394.sh
~~~

See [Getting Started](https://clojure.org/guides/getting_started) for more detailed instructions.

If you are not familiar at all with the Clojure syntax, you will not be able to enjoy this article before having being told that in Clojure, the function symbol appears inside the parenthesis and the function arguments are separated by whitespaces.

# Evaluating Clojure expressions

Once the CLI tool is installed, a program named `clj` is available for you. And now, it is a real pleasure to evaluate small Clojure code snippets with the `-e` flag. 

~~~bash
> clj -e '(+ 1 2)'
3
~~~

It is a good idea to use single quotes instead of double quotes so that you don't need to escape strings quotes when concatanating strings (Clojure supports only strings with double quotes):

~~~bash
> clj -e '(str "1 + 2 is: " (+ 1 2))'
"1 + 2 is: 3"
~~~


When your code snippet contains several expressions, the CLI prints the value of all the expressions one after line:

~~~bash
> clj -e '(+ 1 2)(+ 2 3)'
3
5
~~~

# Running a Clojure file

Sometimes, you don't want to evaluate a series of expressions but you want to run a program for its side effects like printing a cool message in the console. What message? "Hello world" for instance!

For that noble purpose, you write your Clojure code in a file (usually with a `.clj suffix) and you pass to the CLI the path of the Clojure file. You can create the file with any text editor or even directly from the shell with `echo`

~~~bash
> echo '(def my-name "world") (println "hello" my-name)' > /tmp/hello.clj
~~~

Let's inspect the content of the file with the `cat` command:

~~~bash
> cat /tmp/hello.clj
(def my-name "world") (println "hello" my-name)
~~~

And then, you can execute the content of your Clojure by passing the filename as an argument to `clj`:

~~~bash
> clj /tmp/hello.clj
hello world
~~~

That is fantastic: We were able to print "hello world" by executing a Clojure file directly from the command line!

A note that Clojure beginners should skip:

--- start of the note ---

If you run the exact same code with the `-e` flag as exposed in the previous section, the CLI will display the evaluation of both expressions:

1. `(def my-name "world")` evaluates to `#'user/my-name` - this is the fully qualified name of the variable created by `def`
2. `(println "hello" my-name)` evaluates to `hello world`

Try it by yourself:

~~~bash
> clj -e '(def my-name "world") (println "hello" my-name)'
#'user/my-name
hello world
~~~

--- end of the note ---

# The REPL

But the best of all is obviously the REPL, the famous Read Eval Print Loop, one of the heroes of the LISP tradition. The REPL is an interactive development environment that allows you to evaluate successive Clojure expressions interactively.

You launch a Clojure REPL, simply by typing `clj` with no arguments:

~~~bash
> clj
Clojure 1.9.0
user=> (+ 1 2)
3
user=> (+ 4 5)
9
user=>
~~~

Now it is your turn to perform and create the Clojure code of your dreams!

This is only the tip of the iceberg, you can do much more powerful tricks with Clojure CLI like running a full Clojure Program with many namespaces or manipulating aliases to setup the perfect Java Classpath. Unfortunately, it is far beyond the scope of this article. If you want to learn more about it, feel free to read the [Clojure CLI official guide](https://clojure.org/guides/deps_and_cli).
