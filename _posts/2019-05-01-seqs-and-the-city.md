---
layout: post
title:  Seqs and the City
description:  The importance of sequences in Clojure. Sequences and data collections. Lazy sequences.
date:   2019-05-01 14:32:13 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: 26A7E17F-DDCB-40BD-9FD3-354F41E84791
author: Yehonathan Sharvit
---

## What's a seq?

In Clojure, seq is a shorthand for the word sequence.

The most useless explanation that one could give to a sequence is:

> A sequence is an entity that implements the `Iseq` interface, made of two methods: `-first`, `-rest`.

The concept of sequence becomes a bit clearer when one explains the intent of the two methods of the `ISeq` interface:

- `-first` retrieves the first element of the sequence 
- `-rest`  returns the sequence without the first element

> Remark: In this article, we refer to the ways sequences and collections are designed and coded in Clojurescript, where protocols are at the core of the language. In Clojure, it works a bit differently, but the guiding principles are the same.

Now that we are set with some definitions, we can move on to the fun part in which we are going to tell how Clojure makes this `seq` concept so seqsy.

![Seqs and the City](/assets/seqs-city.jpg)

# Ghost Protocol 

First of all, you need to know that when you call a Clojure function that operates on a collection, this function is never a method of the data collection: It is usually a wrapper around the appropriate method. 

For example, in a simple piece of code like:

~~~klipse
(first '(1 2 3))
~~~

Have you noticed that the function we use is called `first` while the method of the PersistentList object is called `-first`?  

If you look at the [source code](https://github.com/clojure/clojurescript/blob/95b13de8300123c3c984b80410475d5acd92af6f/src/main/cljs/cljs/core.cljs#L1228-L1237) of `first`, things get clearer:

~~~clojure
(defn first
  "Returns the first item in the collection. Calls seq on its
  argument. If coll is nil, returns nil."
  [coll]
  (when-not (nil? coll)
    (if (implements? ISeq coll)
      (-first coll)
      (let [s (seq coll)]
        (when-not (nil? s)
          (-first s))))))
~~~

This additional layer of abstraction between `-first` and `first` is here to handle cases where the collection doesn't implement the `ISeq` protocol.

For instance, vectors and maps don't implement the `Iseq` protocol, but we can call `first` on them.


~~~klipse
(implements? ISeq [1 2 3])
~~~

~~~klipse
(first [1 2 3])
~~~

But we cannot call `-first` on a vector or on a map:

~~~klipse
(-first [1 2 3])
~~~

`-first` is available only for collections that implmement `ISeq` e.g. a list:

~~~klipse
(-first '(1 2 3))
~~~

> WARNING: In your application code, it's not a good practice to use `-first` or any other methods of any protocol. They are considered as implementation details and you should always use the high level functions that Clojure provides.


# Confusion of Feelings

You might be confused by our revelation that vectors and maps are not sequences because you know that we can call `map` on vectors and maps. 

The explanation is subtle: vectors and maps are not sequences but they are seqable, meaning that they can be converted to sequences. If you look at the [source code for map](https://github.com/clojure/clojurescript/blob/95b13de8300123c3c984b80410475d5acd92af6f/src/main/cljs/cljs/core.cljs#L4709-4719), you'll see that the first thing the code does is to convert the collection into a sequence by calling `seq`. 

For sure, the return value of `seq` implements the `ISeq` protocol:

~~~klipse
(implements? ISeq (seq [1 2 3]))
~~~

How do you make a collection seqable? 

You make a collection seqable by implementing the `ISeqable` protocol which is made of a single method: `-seq`. But in order to convert a collection to a sequence, you are advised to call the `seq` function rather than the `-seq` method. (Same idea as `first` and `-first`.)


# Happy days

The cool thing is that once a collection is seqable, all the data manipulation functions of the core library work on this collection. For instance, let's create our own seqable numbers:

~~~klipse
(deftype SeqableNum [n]
  ISeqable
  (-seq [this] (range n)))
~~~

Now, we can `map` on a seqable number:

~~~klipse
(map inc (SeqableNum. 10))
~~~

# Conclusion

Let's conclude this article by this quote from Alex Miller:
> Sequences are the key abstraction that connects two of the most important parts of Clojure - immutable persistent collections and the sequence library. [Clojure sequences](http://insideclojure.org/2015/01/02/sequences/)



