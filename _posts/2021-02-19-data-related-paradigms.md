---
layout: post
title:  Distinction between three data related programming paradigms.
description: Distinction between three data related programming paradigms. Data-driven programming. Data-oriented design. Data-Oriented programming.
date:   2021-02-16 16:11:22 +0200
categories: visualization
thumbnail: assets/klipse.png
featured: true
featured_image: /assets/data-love.jpg
tags: [dop, theory]
---

**Data-oriented programming** is not a new concept. It is a paradigm that is applied by developers from different programming languages in order to reduce the complexity of the systems they build.


The purpose of my book [Data-oriented programming](https://www.manning.com/books/data-oriented-programming?utm_source=viebel&utm_medium=affiliate&utm_campaign=book_sharvit2_data_1_29_21&a_aid=viebel&a_bid=d5b546b7) is to explore the principles underlying this paradigm and to illustrate their benefits in the context of a software system.


The present article describes the distinction between **Data-oriented programming** and two other programming paradigms whose name contain the term *data*: **Data-oriented design** and **Data-driven programming**. 


Each paradigm has a its own objective and pursues it by focusing on a different aspect of data.
 
![data](/assets/data-love.jpg)

> There are only two hard things in Computer Science: cache invalidation and naming things. (*Phil Karlton*)


## Data-oriented design 

**Data-oriented design** is a program optimization approach motivated by efficient usage of the CPU cache, used mostly in video game development.

The approach is to focus on the **data layout**, separating and sorting fields according to when they are needed, and to think about transformations of data.

In this context, what's important is how the data **resides in memory**.

The objective of this paradigm is to **improve the performance** of the system.

## Data-driven programming

**Data-driven programming** is the idea that you create **domain specific languages** (DSLs) which are made out of **descriptive data**. It is a branch of declarative programming.

In this context, what's important is to describe the **behaviour of a program** in terms of data.

The objective of this paradigm is to **increase code clarity** and to **reduce the risk of bugs** related to mistakes in the implementation of the expected behaviour of the program.

## Data-oriented programming

**Data-oriented programming** is a paradigm that treats data of the system as a **first-class citizen**. Data is represented by **generic immutable data structures** (like maps and vectors) that are manipulated by **general purpose functions** (like map, filter, select, group, sort ...).

In this context, what's important is the **representation of data** by the program.

The objective of this paradigm is to **reduce the complexity** of the system.

## Summary

Before we conclude, I'd like to mention that there is a draft [Wikipedia article](https://en.wikipedia.org/wiki/Draft:Data-oriented_programming) about Data-Oriented programming. You are welcome to contribute to the article.

We saw that the three data-related  paradigms have different objectives and each of them pursues its objective by focusing on a different aspect of data inside a program.

| Paradigm                  | Objective            | Data                        |
| -----------               | -----------          | --------------              |
| Data-oriented design      | Increase performance | Data layout                 |
| Data-driven programming   | Increase clarity     | Behaviour described by data |
| Data-oriented programming | Reduce complexity    | Data representation         |
