---
layout: post
title:  "How to do arithmetics in BrainFuck?"
description:  "How to do arithmetics in BrainFuck?"
date:   2016-12-21 08:12:42 +0200
categories: brainfuck
thumbnail: assets/klipse.png
guid: "E2BD9738-220D-433C-A860-69E4552A391F"
author: "@viebel"
minified_plugin: true
local_klipse: true
---

# BrainFuck is like the DNA of any programming language

Brainfuck is an esoteric language with only 8 symbols. But it is [Turing Complete]() : that means that from a theoretical perspective, it is as powerful as any other *regular* language.


In this article, we are going to show how one can implement basic arithmetic operations in `Brainfuck`: addition, multiplication and exponentiation.

The fact that we can do amazing stuff with only 8 characters reminds the fact that our body (and maybe also our mind) is generated with only 4 symbols: [A,C,G and T](https://en.wikipedia.org/wiki/Nucleobase).

In a sense, evaluating `brainfuck` code snippets is like exploring the DNA of all computer languages.

![DNA](/assets/dna.jpg)


If you are new into `brainfuck`, you might need to read first [this introduction to brainfuck]({% post_url 2016-12-17-brainfuck %}).

# Addition

Our algorithm for adding two numbers `a` and `b` is going to be: 

> Decrement `b` and increment `a` until `a` equals `0`.


Let's code `3+5`:

~~~brainfuck
+++       store 3 in #0
>         move to #1
+++++     store 5 in #1
[-<+>]    loop: dec #1
                inc #0
<         move to #0
~~~

The code snippets are live and interactive. So have fun and modify the code ans see its evaluation as you type.

The interactive snippets are powered by a tool of mine named [KLIPSE](https://github.com/viebel/klipse).

# Multiplication

For the multiplication of `a` and `b`, we are going to:

> Decrement `a` and increment `b` `a` times until `a` equals `0`.

Let's see how to code `4*7`:

~~~brainfuck
>++++      store 4 in  #1
[-         loop: dec #1
 <               move to #0
 +++++++         inc 7 times #0
 >               move to #1
]
<          move to #0
~~~

# Powers of 2

In order to calculate `2^a`, our strategy will be:

> Initialise the result to 1. Then decrement `a` and multiply the result by `2` until `a` equals `0`.

Let's calculate 2 to the 10:

~~~brainfuck
+              store 1 in #0
>>++++++++++   store 10 in #2
[ <<           loop:
  [>++<-]        #1 contains the double of #0
  >              move to #1
  [<+>-]         move the value from #1 to #0
  >-             dec #3
]
<<             move to #0
~~~

If you liked the code interactivity of this article, please give a star on [KLIPSE github repository](https://github.com/viebel/klipse) and use it on your blog. Take a look at [KLIPSE documentation](https://github.com/viebel/klipse): it's super simple to use.

