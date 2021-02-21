---
layout: post
title:  "Brainfuck for dummies"
description:  "Brainfuck for dummies"
date:   2016-12-17 12:21:32 +0200
categories: brainfuck
thumbnail: assets/klipse.png
guid: "E541B9CD-E12F-49D6-8432-ACEBD6A8106B"
author: Yehonathan Sharvit
minified_plugin: true
tags: [brainfuck]
---


# What is BrainFuck?

You have probably heard of the [brainfuck language](https://en.wikipedia.org/wiki/Brainfuck) - being known to contain a minimal set of symbols and to be the most famous [Turing tarpit](https://en.wikipedia.org/wiki/Turing_tarpit).


Maybe you have even already seen a program written in `brainfuck` - probably something like `+>++<[->+<]>.` 

But have you even run a `brainfuck` program?

Have you ever modified a valid `brainfuck` program - and see its evaluation as you type?


This is the purpose of this **unique** article: to let you play with `brainfuck` syntax and hopefully understand it (at least partially).

The interactive evaluation of `brainfuck` code is powered by the [Klipse plugin](https://github.com/viebel/klipse): Klipse is a javascript tag for embedding interacitve code snippets in any web page.


Oh I forgot to mention that `brainfuck` is considered to be an esoteric language...

![Esoteric](/assets/esoteric.jpg)


# The language

The language consists of eight commands, listed below. A brainfuck program is a sequence of these commands, possibly interspersed with other characters (which are ignored). The commands are executed sequentially, with some exceptions: an instruction pointer begins at the first command, and each command it points to is executed, after which it normally moves forward to the next command. The program terminates when the instruction pointer moves past the last command.

The brainfuck language uses a simple machine model consisting of:

- The program
- The instruction pointer
- A (conceptually infinite) array of byte cells initialized to zero - like the tape of the Turing machine
- A movable data pointer (initialized to point to the leftmost byte of the array)
- Two streams of bytes for input and output


The language is made of 8 commands - each consist of a single character: 6 calcuation symbols and 2 i/o symbols


### The calculation commands

|Character |Meaning
|`>` |increment the data pointer to point to the next cell to the right.
|`<` |decrement the data pointer to point to the next cell to the left.
|`+` |increment (increase by one) the byte at the data pointer.
|`-` |decrement (decrease by one) the byte at the data pointer.
|`[` |if the byte at the data pointer is zero, then instead of moving the instruction pointer forward to the next command, jump it *forward* to the command after the *matching* `]`.
|`]` |if the byte at the data pointer is nonzero, then instead of moving the instruction pointer forward to the next command, jump it *back* to the command after the *matching* `[`command.

### The i/o commands

|Character |Meaning
|`.` |output the byte at the data pointer.
|`,` |accept one byte of input, storing its value in the byte at the data pointer.


A bit cryptic right?

So let's start to play with `brainfuck` with a very simple program:

~~~brainfuck
+++++++++++++++++++++++++++++++++ Increment 33 times
.
+++++++++                         Increment 9 times
.
>>                                Move forward twice
~~~


By the way, all the characters that are not part of the set of 8 commands are ignored. This is convenient for inserting comments in the code.


In the ouput cell, you can see the state of the "tape" at the end of the program execution and the output in 2 formats: array and string.


Go ahead, play with the code. Modify the program and see how it evaluates as you type.

# Addition

The cool thing with `brainfuck` is that it is possible to do simple calculations and somehow to understand the code.

As an example, let's put two numbers on cell #0 and cell #1 and store their addition on cell #1 and output it. Here is the code with number 7 on cell #0 and number 3 on cell #1

~~~brainfuck
+++++++    put 7 on cell #0
>          move to cell #1
+++        put 3 on cell # 1
<          move to cell #0
[->+<]     dec cell #0 and inc cell #1 until cell #0 is 0
>          move to cell #1
.          output cell #1
~~~

# Infinite loops

Some program never halts. In order not to freeze your browser, klipse stops brainfuck exectition after too many iterations.

Let's see an example:

~~~brainfuck
+         Increment cell #0
[]        Loop until cell #0 is 0 i.e. infinite loop
~~~


# Hello World!

Now, let's look at a `Hello World!` program in `brainfuck` i.e. a program that ouputs an array of integers with the ascii values of "H","e","l","l"," ","W","o","r","l","d","!" and "\n".

First, the program in its compact form:

~~~brainfuck
++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>
~~~

And now with the explanations:

~~~brainfuck
[ This program prints "Hello World!" and a newline to the screen, its
length is 106 active command characters. [It is not the shortest.]

This loop is an "initial comment loop", a simple way of adding a comment
to a BF program such that you don't have to worry about any command
characters. Any ".", ",", "+", "-", "<" and ">" characters are simply
ignored, the "[" and "]" characters just have to be balanced. This
loop and the commands it contains are ignored because the current cell
is the first cell of the tape and when the program starts, its value is
0; the 0 value causes this loop to be skipped.
]
++++++++               Set Cell #0 to 8
[
>++++               Add 4 to Cell #1; this will always set Cell #1 to 4
[                   as the cell will be cleared by the loop
>++             Add 2 to Cell #2
>+++            Add 3 to Cell #3
>+++            Add 3 to Cell #4
>+              Add 1 to Cell #5
<<<<-           Decrement the loop counter in Cell #1
]                   Loop till Cell #1 is zero; number of iterations is 4
>+                  Add 1 to Cell #2
>+                  Add 1 to Cell #3
>-                  Subtract 1 from Cell #4
>>+                 Add 1 to Cell #6
[<]                 Move back to the first zero cell you find; this will
be Cell #1 which was cleared by the previous loop
<-                  Decrement the loop Counter in Cell #0
]                       Loop till Cell #0 is zero; number of iterations is 8

The result of this is:
Cell No :   0   1   2   3   4   5   6
Contents:   0   0  72 104  88  32   8
Pointer :   ^

>>.                     Cell #2 has value 72 which is 'H'
>---.                   Subtract 3 from Cell #3 to get 101 which is 'e'
+++++++..+++.           Likewise for 'llo' from Cell #3
>>.                     Cell #5 is 32 for the space
<-.                     Subtract 1 from Cell #4 for 87 to give a 'W'
<.                      Cell #3 was set to 'o' from the end of 'Hello'
+++.------.--------.    Cell #3 for 'rl' and 'd'
>>+.                    Add 1 to Cell #5 gives us an exclamation point
>++.                    And finally a newline from Cell #6
~~~

# Inputs

In klipse, we can set the output of our program using the `[in: ...]` syntax.

(The `[in: ...]` block has to be contained in a single line.)

Like this:

~~~brainfuck
[in: abcde]
,+.      read input increment it output it
[,+.]    read input increment it output it until no more input
~~~

Now, everything is set to experiment real esoteric stuff. Are you ready?


# Universal Turing machine

Now, we are going to see crazzy stuff: `brainfuck` is turing complete, therefore it can evaluate itself.

Here is a `brainfuck` program that receives another `brainfuck` program as its input and evaluates the program (the `!` at the end of the input is to separate the code from the input - in our case, there is no input).

Let's see it in action with the `Hello World!` program from above as its input.
(Remember that the input must be contained in a single line.)

~~~brainfuck
[in: ++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.!]

>>>>+[->>>++>+>+++++++[<++++>>++<-]++>>+>+>+++++[>++>++++++<<-]+>>>,<++[[>[->>]<[>>]<<-]<[<]<+>>[>]>[<+>-[[<+>-]>]<[[[-]<]++<-[<+++++++++>[<->-]>>]>>]]<<]>[-]+<<[--[[-]>>-<<<+>]>>[-<<<<[>+<-]+<<+[->[<+>>>>>>+<<<<<-]<[>+<-]>>>>>>>+<[-[-[-[-[-[-[-[-[[-]>-<]>[-<<+++++++>>]<]]]>[-]<]>[-<<+++>>]<]>[-<<+>>]<]>[-]<]>[-<<<<<<<+>>>>>>>]<]>[-]<<<<<]>>>[<<+>>-]<+<[-[-[-[-[-[-[-[-[-[-[[-]>-<<<[-]<<+>>]]]]>[-]<]>[-<<<[-]<<+++++++>>>]<]]]>[-]<]>[-<<<[-]<<+++++++>>>]<]]>[-]<<<<<<[-]>>[-<<<[>+>>+<<<-]>[<+>-]>>[-[-[[-]>>]>[<<[<+>>+<-]>[<+>-]+<<-[-[-[-[-[-[-[-[-[-[-<+>]<+++++++++++++>>[-]>->-<<]]]>>[->>>>>]<<]>>[-<<<++++++++++++>>[-]>>-]<<]>>[->>>>>]<<]>>[-<<<+++++++++++>>[-]>>-]<<]>>[-<<<++++++++++>>[-]>>-]<<]]>>[->>>>>]<<]<]]>[>>]<<<]>>+>>>]<<]>>[->+>]<<<]<<[<<]>>[[<+>>+<-]+<-[-[-[-[-[-[-[-[-[-[-[-[-[-[-[->->>[>>]>>[>>]<[<-<<-<]<[<<]<<[<<]<]>[->>[>>]>>[>>]<[>+>>+>]<[<<]<<[<<]]<]>[->>[>>]>>[>>]<[-]<[<<]<<[<<]]<]>[->>[>>]>>[>>]<[<-<]<[<<]<<[<<]]<]>[->>[>>]>>[>>]<[>+>]<[<<]<<[<<]]<]>[->>[>>]>>[>>]<<-<<-<<[<<]<<[<<]]<]>[->>[>>]>>[>>]+>>+[<<]<<[<<]]<]>[->>[>>]>>[>>]<++<[<<]<<[<<]]<]>[->>[>>]>>[>>]<+<[<<]<<[<<]]<]>[->>[>>]>>[>>]<,<[<<]<<[<<]]<]>[->>[>>]>>[>>]<-<[<<]<<[<<]]<]>[->>[>>]>>[>>]<.<[<<]<<[<<]]<]>[->>[>>]>>[>>]<<-<<[<<]<<[<<]]<]>[->>[>>]>>[>>]+[<<]<<[<<]]<]>[->>[>>]>>[>>]<[>+>>+<<<-]>[<+>-]>>[<<+>>[-]]+<<[>>-<<-]>>[<<+>>>>+<<-]>>[<<+>>-]<<[>>+<<-]+>>[<<->>-]<<<<[-<<[<<]<<[<<]<<<<<++>>]>>[-<<<<<<[<<]<<[<<]<]>]<]>[->>[>>]>>[>>]<[>+>>+<<<-]>[[<+>-]>>[-]+<<]>>[<<+>>>>+<<-]>>[<<+>>-]<<[>>+<<-]+>>[<<->>-]<<<<[-<<[<<]<<[<<]<<<<<+>>]>>[-<<<<<<[<<]<<[<<]<]>]>[<+>-]<<<<<<[>>+<<-[->>->>+[>>>[-<+>>+<]+<-[-[[-]>-<]>[-<<<+>>>]<]>[-<<<->>>]>[-<+>]<<<<[>>+<<-]>>]<<<<<<]>>[-<<+[>>>[-<+>>+<]+<-[-[[-]>-<]>[-<<<->>>]<]>[-<<<+>>>]>[-<+>]<<<<[<<+>>-]<<]]]>>>>>>>]
~~~

This crazy piece of code has been written by [Clive Gifford](http://homepages.xnet.co.nz/~clive/eigenratios/cgbfi2.b).


If you liked the code interactivity of this article, please give a star on [KLIPSE github repository](https://github.com/viebel/klipse) and use it on your blog. Take a look at [KLIPSE documentation](https://github.com/viebel/klipse): it's super simple to use.
