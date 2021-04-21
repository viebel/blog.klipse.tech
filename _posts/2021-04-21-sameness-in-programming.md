---
layout: post
title: On sameness in programming
description: A fundamental aspect of the difference between functional programming and Object-Oriented programming
date:   2021-04-21 04:09:18 +0200
categories: dop
thumbnail: assets/klipse.png
author: Yehonathan Sharvit
minified_plugin: true
tags: [dop, maths]
---

We often talk about the importance of writing our code in terms of pure functions which, like math functions, have no side effects and return the same values ​​for the same arguments. In this article, I propose to explore another fundamental aspect of the difference between functional programming and object-oriented programming: the notion of sameness, that is to say: how do we define that two "things" are the same?

# Ship of Theseus 

Do you know the story about the ship of Theseus? This Greek hero whose ship, according to legend, was preserved by the Athenians for centuries: they removed the worn planks from the ship and replaced them until no original planks remained.

The question then arose as to whether it was still the same ship or whether the maintenance had made it a different ship.

What do you think? And most importantly what does that have to do with programming?


![ship](/assets/theseus.png)


# Sameness in math

Let's start by exploring the concept of sameness in math and ask ourselves a question similar to the ship of Theseus in the realm of sets.

Consider a set with three elements: the numbers 1, 2 and 3.

What happens when we replace a number from this set, for example: the number 3 by the number 4?

Obviously, we get a set than is not the same as the original set!

Now imagine that we have a set with the numbers 1, 2 and 10. What happens when we replace 10 with 3? Well, we get a set with the numbers 1, 2 and 3.

A set with the numbers 1, 2 and 3 like the one in the previous example? Is it the same set or another set with the same elements? Funny question, isn't it?

For mathematics, the answer is formal: two sets having the same elements are the same! This is one of the axioms of axiomatic set theory. This axiom even has a pretty name: it is called the axiom of extensionality[^extensionality].

According to mathematics, therefore, the ship of Theseus is no longer the same as soon as one of its planks is replaced


# Sameness in programming

Let's move on to programming now, if you don't mind. Imagine a product sold on an e-commerce site, a pretty coffee mug, for instance. Let's simplify it and say that a mug has only two attributes: a description and a price. What happens when you drop the price of a cup? Is this the same cup or is it a different cup?

Obviously, this is the same cup! In programming, the identity of an object is more than the values ​​of its attributes.

According to programming, therefore, the ship of Theseus remains the same, although all its planks have been replaced.


# Functional programming

We are at the core of an obvious contradiction between the world of programming and the world of mathematics. As Bruce MacLennan so beautifully wrote in his beautiful article "Values ​​and Objects in Programming Languages", in 1982[^paper]:

> Math is value oriented programming.
>
> Programming is object-oriented mathematics.

What he means by an object is an entity having a set of attributes at a given time. Whereas a value is, by definition, an entity that never changes.

In a way, it can be said that the fundamental divergences between functional programming and object-oriented programming revolve around the manipulation of the object/value cursor. Functional programming encourages developers to activate the cursor towards values ​​while object-oriented programming encourages developers to activate the cursor towards objects.

One of the reasons why a program written in functional programming is less complex than an object-oriented program is because, as we have just seen, it is more complex to define the sameness of objects than the sameness of values.

# Back to Theseus

Writing a program these days is sometimes as much of a challenge as finding a way out of Daedalus' Labyrinth. According to legend, Theseus managed to find his way out of the Labyrinth with the help of Ariadne's thread.
I am going to let you meditate on the following question: Could we consider functional programming as Ariadne's thread that will allow us to find our way out of the maze of complexity created by our programs?


[^paper]: MacLennan, Bruce. (1982). [Values and Objects in Programming Languages](https://www.researchgate.net/publication/220177801_Values_and_Objects_in_Programming_Languages).
[^extensionality]: https://en.wikipedia.org/wiki/Axiom_of_extensionality
