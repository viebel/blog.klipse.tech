---
layout: post
title:  The concepts behind Data-Oriented programming 
description: Writing effective information systems. Abstraction vs. Concretion. Functional programming vs. Object-Oriented programming vs. Data-Oriented programming. Dynamic typing vs. Static typing. Identity vs. State. The value of immutability.
date:   2021-03-15 06:03:52 +0200
categories: clojure
thumbnail: assets/klipse.png
tags: [dop, clojure, theory]
---


Here are 9 fundamental general concepts about programming.

In my opinion, **Data-Oriented programming** as a language-agnostic paradigm is founded on a certain understanding (interpretation?) of those concepts.

My understanding of those concepts has been highly influenced by **Rich Hickey**'s talks where he shares his unique approach to **effective information systems** and the rationale behind **Clojure** as a **Data-Oriented** programming language.

This glossary is my attempt to make Data-Oriented programming better understood in the global community of developers and explains how DOP differs from Object-Oriented programming and functional programming.

The concepts are presented in alphabetical order.

## 1. Abstraction
### Definition
**Abstraction** is about drawing from a set of **exemplars** some **essential** thing.

### Example
**Relational algebra** is an example of **data abstraction**. Modelling data as relations gives us lot of power:

1. We express advanced data manipulation operations with well-defined relational algebra operators
1. An implementation of relational algebra operators is applicable to all exemplars of data. 

### In Clojure
Representing data with **maps** ("just use maps") is a **data abstraction**. The only required knowledge in order to access data is the field name, represented with a generic entity (e.g. a string or a keyword).

Moreover, there is a well-defined algebra of maps  applicable to any data represented with maps.

### See also
Concretion

## 2. Concretion
### Definition

**Concretion** is when in order to use something we need a **concrete** knowledge about the thing.

### Example

[Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle): Entities must depend on **abstractions**, not on **concretions**.

The common way to apply DIP to Object-Oriented programming is that when a class depends on another class, it should not depend on concrete instances of the other class. Rather, it should depend on an **abstract interface** implemented by that class.

A more abstract way to handle dependency between entities is to invoke code by **sending a message** to an object. The only required knowledge is the name of the message, represented with a generic entity (e.g. a string).

### In Clojure

In a sense, Clojure idiom *just use maps* is an application of the Dependency Inversion Principle to **data**. Representing data with a data class or a data record is a **concretion**: The only way to access data is via the class methods or record members.

When we access data through the methods of an interface, it's a bit less concrete. But still, we can access data only through the methods defined in the interface.

A more abstract (less concrete) way to represent data is with generic maps. In order to access data in a map, the only required knowledge is the field name, represented with generic entities like strings (or Clojure keywords).

|               | Code            | Data                        |
|---------------|-----------------|-----------------------------|
| Concrete      | Concrete class  | Concrete record             |
| Less concrete | Abstract class  | Abstract class with getters |
| Most abstract | Message passing | Generic map                 |

### See also
Abstraction

## 3. Identity
### Definition

**Identity** is a **stable** logical entity that humans or programs associate with a series of different **values** over **time**.

An identity is not the same as a name.

### Example

~~~clojure
(def yehonathan (atom nil))

(def yehonathan-state-on-march-2021
     {:age 42  ;; No kidding!
      :firstName "Yehonathan"
      :lastName "Sharvit"})
  
(reset! yehonathan yehonathan-state-on-march-2021)
~~~

Let's describe exactly what happens in this code snippet in terms of name, identity, state and value:

1. `yehonathan` is a name that refers to an identity
1. The identity is represented as an [atom](https://clojuredocs.org/clojure.core/atom)
1. The map with the fields `age=42`, `firstName="Yehonathan"` and `lastName="Sharvit"` is a value
1. After calling `(reset! yehonathan ...)`, the state of the identity referred by the name `yehonathan` is the map with the fields `age=42`, `firstName="Yehonathan"` and `lastName="Sharvit"`.

### See also
State, Value

## 4. Information
### Definition
**Information** is what you **know** about something that happened in the **world**.

Information is inherently **sparse**.

Information is **open** in the sense that it could contain pieces that you don't care about in some context. 

Information **accretes**, it just keeps accumulating.

The best way to grapple information is by using names.

## 5. Loose coupling
### Definition

A system is **loosely coupled** when its components have little knowledge of the internals of other components.

Components A is loosely coupled with component B if A communicates with B without **concrete knowledge** about the internals of B.

### Example

Web services that communicate via JSON are loosely coupled.

### In Clojure

In Clojure, inside a program we "**just use maps**" to communicate. This is based on the principle that
"we should program the **insides** of our systems like we program the **outsides**".
Outside, we have loose coupling everywhere: over the wire we communicate via data (e.g. JSON).
Let's do the same inside and communicate via data (e.g. hash maps).

Compare that with functions that receive a record (or a data class) as an argument. In order to call those functions, we need to import the definition of the record. That's not loose coupling!


### See also

Abstraction, Concretion

## 6. Maybe
### Definition
Nothing is of type _maybe_ something.

Maybe is a property of the aggregate not of the field.

### Example
It makes no sense to say that the type of the social security number of a person is *maybe* a string.

What makes sense is to say: in this map (that aggregates data about a person), the social security number is maybe a string (it could also be absent from the map).

Even more precise: this function receives as an argument a map where the social security number is maybe a string.

## 7. Names
### Definition
**Names** are a fundamental property of information. However, in statically-typed languages, names compile away. There exist at compile time but not a run time.

At run time, a field cannot be access **dynamically** by its name. In order to access data, we are required to import the definition of the class that contains the data.

### In Clojure
In a map, field names are first-class.

### See also

Concretion, Loose-coupling

## 8. State
### Definition
The **state** of an identity is the value **currently** associated with this identity.

State never changes. At different times, different values are associated with an identity. We say that an identity can be in different states at different times.

An identity is not a state. An identity has a state at any point in time.

### See also
Identity, Value

## 9. Value
### Definition
A **value** is something that doesn't change. A value is inherently **immutable**.

Values are part of the world, not part of our programs or our mental models.


### Example

- In all programming languages, numbers are values.
- In most programming languages, strings are values.
- In functional programming languages, data collections are values.

### See also

Identity, State

### In Clojure
In Clojure, every piece of data is a value: numbers, strings, maps, vectors, sets, lists.



# Conclusion

I'll leave you with the following questions:

1. What are the fundamental differences between Clojure and Object-Oriented programming?
1. What are the fundamental differences between Clojure and functional Oriented programming?
1. What are the main benefits of Data-Oriented programming as evangelised by Clojure when building information systems?
