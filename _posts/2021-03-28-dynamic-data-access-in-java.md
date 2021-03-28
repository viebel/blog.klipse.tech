---
layout: post
title: How to access data dynamically in Java without losing type safety
description:  Dynamic data access with Java classes and records using reflection. Type safe data access in Java hash maps.
date:   2021-03-28 14:11:42 +0200
categories: java
thumbnail: assets/klipse.png
author: Yehonathan Sharvit
minified_plugin: true
tags: [java]
---

An interesting question in the context of information systems is:

To what extent [Data-Oriented programming](https://www.manning.com/books/data-oriented-programming?utm_source=viebel&utm_medium=affiliate&utm_campaign=book_sharvit2_data_1_29_21&a_aid=viebel&a_bid=d5b546b7) is applicable in a statically-typed language like Java?

The first two principles of Data-Oriented programming (DOP) seem to be in the spirit of the newest additions to Java (e.g data records in Java 14):

- Principle #1: Code is **separated** from data
- Principle #2: Data is **immutable**

However, when it comes to Principle #3, it causes discomfort to many Java developers:

- Principle #3: Data access is **flexible** 

By flexible data access, we mean that it should be possible inside our programs to access dynamically a data field, given its name.

There are two ways to provide **dynamic data access** in Java:

1. Represent data with **classes** (or records in Java 14) and use **reflection**
1. Represent data with **string maps** 

The purpose of this article is to illustrate various ways to **access data dynamically** in Java, both with classes and maps. Towards the end of the article, we suggest how to keep a bit of **type safety** even when data access is dynamic.

![freedom](/assets/freedom.jpg)

# Data in JSON

Let's take as an example data from a library catalog with a single book.

Here is an example of a catalog data in JSON:

~~~json
{
  "items": "books",
  "booksByIsbn": {
    "978-1779501127": {
      "isbn": "978-1779501127",
      "title": "Watchmen",
      "publicationYear": 1987,
      "authorIds": ["alan-moore", "dave-gibbons"]
    }
  },
  "authorsById": {
    "alan-moore": {
      "name": "Alan Moore",
      "bookIds": ["978-1779501127"]
    },
    "dave-gibbons": {
      "name": "Dave Gibbons",
      "bookIds": ["978-1779501127"]
    }
  }
}
~~~

Some pieces of data in our catalog are **homogeneous maps of unknown size** (e.g. the book index, the author index)

Other pieces of data are **heterogeneous maps of fixed size** (e.g. a book, a author).

Homogeneous maps of unknown size are usually represented by **hash maps**, while heterogeneous maps of fixed sized are usually represented with **classes**.


The example that we are going to use again and again throughout the article, is accessing the title of watchmen inside the catalog and convert it to upper case.


# Representing data with records

Java 14 introduced the concept of a **data record** that provides a first-class means for modelling data-only aggregates.

Here is how our data model would look like with records:

~~~java
public record AuthorData (String name,
                          List<String> bookIds) {}

public record BookData (String title,
                        String isbn,
                        Integer publicationYear,
                        List<String> authorIds) {}

public record CatalogData (String items, 
                           Map<String, BookData> booksByIsbn,
                           Map<String, AuthorData> authorByIds) {}

~~~

Records are instantiated like classes:

~~~java
var watchmen = new BookData("Watchmen",
                            "978-1779501127",
                            1987,
                            List.of("alan-moore", "dave-gibbons"));

var alanM = new AuthorData("Alan Moore", List.of("978-1779501127"));
var daveG = new AuthorData("Dave Gibbons", List.of("978-1779501127"));

var booksByIsbn = Map.of("978-1779501127", watchmen);

var authorsById = Map.of("alan-moore", alanM,
                         "dave-gibbons", daveG);

var catalog = new CatalogData("books", booksByIsbn, authorsById);
~~~


Conceptually, the title of Watchmen, like any other piece of information has an *information path*:

~~~java
["booksByIsbn", "978-1779501127", "title"]
~~~


However, when we navigate the information path we encounter both records and hash maps:

* The natural way to access data in a record is via the dot notation
* The natural way to access data in a hash map is via the `get()` method

Here is how we access the title of watchmen and convert it to upper case.

~~~java
catalog.booksByIsbn().get("978-1779501127")
.title().toUpperCase(); // "WATCHMEN"
~~~

This lack of uniformity between data access in a record and in a map is not only annoying from a theoretic perspective. It also has practical drawbacks. For instance, we cannot store the information path in a variable or in a function argument. In fact, we don't have a **dynamic access to information**.

# Accessing data in a record via reflection

We can overcome the drawbacks exposed in the previous section and provide a **dynamic access to information** in a record or in a class, via **reflection**.

~~~java
class DynamicAccess {
    static Object get(Object o, String k) throws IllegalAccessException, NoSuchFieldException {
        return (o.getClass().getDeclaredField(k).get(o));
    }
}
~~~

And now, we are able to access data in a record via a string that holds the name of a field. For instance:

~~~java
DynamicAccess.get(watchmen,
                  "title") // "Watchmen"
~~~

We can easily modify `DynamicAccess.get()` so that it works both with records and maps:

~~~java
class DynamicAccess {
    static Object get(Object o, String k) throws IllegalAccessException, NoSuchFieldException {
        if(o instanceof Map) {
            return ((Map)o).get(k);
        }
        return (o.getClass().getDeclaredField(k).get(o));
    }
}
~~~

And now, we can write a `getIn()` method that receives an object and an information path:

~~~java
class DynamicAccess {
    static Object get(Object o, String k) throws IllegalAccessException, NoSuchFieldException {
        if(o instanceof Map) {
            return ((Map)o).get(k);
        }
        return (o.getClass().getDeclaredField(k).get(o));
    }

    static Object getIn(Object o, List<String> path) throws IllegalAccessException, NoSuchFieldException {
        Object v = o;
        for (String k : path) {
            v = get(v, k);
        }
        return v;
    }
}
~~~


Here is how we access the title of watchmen in the catalog, via its **information path**:

~~~java
var informationPath = List.of("booksByIsbn",
                              "978-1779501127",
                              "title");
DynamicAccess.getIn(catalog,
                    informationPath); // "watchmen"
~~~

The problem that remains to be solved is the type of the value that we retrieve via `DynamicAccess.get()` or `DynamicAccess.getIn()`.


The most cumbersome way is to cast explicitly:


~~~java
var informationPath = List.of("booksByIsbn",
                              "978-1779501127",
                              "title");

((String)DynamicAccess.getIn(catalog,
                             informationPath))
    .toUpperCase(); // "WATCHMEN"
~~~

Another option is to add two specific methods to `DynamicAccess` that return a string:

~~~java
class DynamicAccess {
    static String getAsString(Object o, String k) throws IllegalAccessException, NoSuchFieldException {
        return (String)get(o, k);
    }

    static String getInAsString(Object o, List<String> path) throws IllegalAccessException, NoSuchFieldException {
        return (String)getIn(o, path);
    }
}

~~~

It makes data access a bit less verbose:

~~~java
var informationPath = List.of("booksByIsbn",
                              "978-1779501127",
                              "title");

DynamicAccess.getInAsString(catalog,
                            informationPath)
    .toUpperCase(); // "WATCHMEN"
~~~


# Representing data with hash maps


Another approach to providing a **dynamic data access** is to represent every piece of data with hash maps. The benefits of this approach is that we don't need to use reflection. The drawback is that all our maps are `Map<String, Object>` and it means that we have lost **type safety**.

~~~java
var watchmen = Map.of("title", "Watchmen",
                      "isbn", "978-1779501127",
                      "publicationYear", 1987,
                      "authorIds", List.of("alan-moore",
                                           "dave-gibbons"));

var alanM = Map.of("name", "Alan Moore",
                      "bookIds", List.of("978-1779501127"));

var daveG = Map.of("name", "Dave Gibbons",
                         "bookIds", List.of("978-1779501127"));

var booksByIsbn = Map.of("978-1779501127", watchmen);

var authorsById = Map.of("alan-moore", alanM,
                         "dave-gibbons", daveG);

var catalog = Map.of("items", "book",
                     "booksByIsbn", booksByIsbn,
                     "authorsById", authorsById);
~~~

Like before, we are free to access any piece of information via its information path:

~~~java
var informationPath = List.of("booksByIsbn",
                              "978-1779501127",
                              "title");

DynamicAccess.getInAsString(catalog, informationPath)
                  .toUpperCase(); // "WATCHMEN"
~~~

# Typed getters

We could move one step further and try to make it easier to specify the type of a value associated with a key, by making **field names first-class citizens** in our program. 


Let's start with a non-nested key in a map or a record.

We create a generic `Getter` class:

~~~java
class Getter <T> {
    private String key;

    public <T> Getter (String k) {
        this.key = k;
    }

    public T get (Object o) throws IllegalAccessException, NoSuchFieldException {
        return (T)(DynamicAccess.get(o, key));
    }
}
~~~

We can create a **typed getter** that contains both:

1. the name of the field 
1. the type of its value.

For instance, here is how we create a typed getter for the title of a book:

~~~java
Getter<String> TITLE = new Getter("title");
~~~

And here is how we use the typed getter to access the field value:

~~~java
TITLE.get(watchmen); // "watchmen"
~~~

The getter is typed, therefore we can access the value as a string without any casting:


~~~java
TITLE.get(watchmen).toUpperCase(); // "WATCHMEN"
~~~


We can extend the typed getter approach to nested keys:

~~~java
class GetterIn <T> {
    private List<String> path;

    public <T> GetterIn (List<String> path) {
        this.path = path;
    }

    T getIn (Object o) throws IllegalAccessException, NoSuchFieldException {
        return (T)(DynamicAccess.getIn(o, path));
    }
}
~~~

And here is how we access a piece of information via its information path:

~~~java
var informationPath = List.of("booksByIsbn",
                              "978-1779501127",
                              "title");


GetterIn<String> NESTED_TITLE = new GetterIn(informationPath);
NESTED_TITLE.getIn(library).toUpperCase(); // "WATCHMEN"
~~~

# Conclusion

Providing a **dynamic data access** in a **statically-typed** language like Java is challenging. When data is represented with classes or records, we need to use reflection and when data is represented with string maps, we loose the information about types. 

Maybe an approach like the typed getters, presented at the end of the article, could open the door to the Java community for a **dynamic data access** that doesn't compromise **type safety**.

