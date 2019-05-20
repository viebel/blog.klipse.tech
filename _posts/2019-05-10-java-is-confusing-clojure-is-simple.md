---
layout: post
title: Java is confusing, Clojure is simple.  
description:  Data Collections in Java versus Immutable Data Collections in Clojure. The complexity of Java compared to the simplicity of Clojure.
date:   2019-05-10 03:14:52 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: 9434BD0B-BA8D-4518-9704-BC1E45887B77
author: Yehonathan Sharvit
---

## The inherent complexity of Collections in Java

During a brainstorm related to the writing of my [Get Programming with Clojure book](https://www.manning.com/books/get-programming-with-clojure?a_aid=viebel&a_bid=399d9d64), I was discussing with an experienced Java teacher about Data Collections and he told me that the world's best Java instructors consistentky agree that Java learners are confused by the behaviour of Collections in Java:

- What kind of Objects are the Collections?
- Are the Collections changed by the methods or not?
- Are we passing Objects or References from method to method?
- When we pass a reference to a method, are we making a copy of the Object or not?

> The common agreement among experienced Java teachers is that in order to properly explain how Collections work in Java, they have to spend time explaining how stack and heap work in Java and how objects can have references to other objects and what is the impact on the garbage collector etc...


## The confusion with Java

Let me illustrate how confusing Collections are for Java learners with a short code snippet:

~~~java
import java.util.*;
public class Main
{
  public static void main(String[] args)
  {
    ArrayList myNumbers = new ArrayList<Integer>(Arrays.asList(1,2,3));
    ArrayList yourNumbers = myNumbers;
    yourNumbers.add(4);
        
    ArrayList theirNumbers = new ArrayList<Integer>(Arrays.asList(1,2,3));
    add5(theirNumbers);

    System.out.println("myNumbers: " + myNumbers);
    System.out.println("yourNumbers: " + yourNumbers);
    System.out.println("theirNumbers: " + theirNumbers);
  }

  public static void add5(ArrayList a) {
    a.add(5);
  }
}
~~~

`ArrayList` are mutable, therefore `yourNumbers.add(4)` changes the content of `yourNumbers`. But what about the content of `myNumbers`? Is it modified or not? Does it behave the same when we call the `add` method in another method (like `add5` in our example)?

When a Java learner asks herself those questions, she is confused and as I mentioned before, the agreed strategy among Java teachers to explain the behaviour of Data Collections is to talk about stack, heaps and the garbage collector.

(I am not going to tell you what is the output of the above code snippet. The point of my article is to illustrate the confusion that occurs in the mind of Java learners and this confusion is avoided in the Clojure.)

## The simplicity of numbers

Let's write a similar Java code snippet that deals with values instead of collections:

~~~java
public class Main
{
  public static void main(String[] args)
  {
    int myNumber = 42;
    int yourNumber = myNumber;
    yourNumber = yourNumber + 10;
        
    int theirNumber = 42;
    add5(theirNumber);

    System.out.println("myNumber: " + myNumber);
    System.out.println("yourNumber: " + yourNumber);
    System.out.println("theirNumber: " + theirNumber);
  }

  public static void add5(int a) {
    int b = a + 5;
  }
}
~~~

When we deal with numbers, the code is really easy to grasp: it is clear to every Java learner that `yourNumber += 10` modifies `yourNumber` but not `myNumber`. And similarly, the `add5` method doesn't modify `theirNumber`.

The reason is that numbers are values and therefore they never change.


## The simplicity of Clojure

[Clojure](https://en.wikipedia.org/wiki/Clojure) is a dynamic functional LISP dialect that runs on the Java platform (like [Scala](https://en.wikipedia.org/wiki/Scala_(programming_language))). Clojure advocates immutability and immutable data structures. 

> The common agreement among experienced Clojure teachers is that in order to properly explain how Collections work in Clojure, the only thing they have to teach is that Data Collections are values.

It might be hard to believe but that's the only thing that a Clojure learner has to understand: Data Collections are values. The big difference between objects and values is that values never change. They are immutable. In Clojure, Data Collections never change.

The immutability of Collections in Clojure make the code easy to grasp. The difficulty that has to be overcome for Clojure learners is the unusual syntax and the weird usage of parenthesis à la LISP.  (Helping Java developers to get into Clojure syntax is one of the main goals of my [Get Programming with Clojure book](https://www.manning.com/books/get-programming-with-clojure?a_aid=viebel&a_bid=399d9d64).)

Let's take a look at a similar Clojure code snippet:

~~~clojure
(defn add5 [a]
  (conj a 5))

(def myNumbers [1 2 3])
(def yourNumbers myNumbers)
(conj yourNumbers 4)
(def theirNumbers [1 2 3])
(add5 theirNumbers)

(println "myNumbers: " myNumbers)
(println "yourNumbers: " yourNumbers)
(println "theirNumbers: " theirNumbers)
~~~

Once a Clojure learner gets used to Clojure syntax, she has no questions about the content of `myNumbers`, `yourNumbers` and `theirNumbers` after the code is executed.

Their content is: `[1 2 3]`. The reason is simple: in Clojure, Data Collections are values, exactly like numbers. They never change!

Happy Clojure!
