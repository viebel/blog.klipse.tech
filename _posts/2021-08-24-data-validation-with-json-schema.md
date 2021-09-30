---
layout: post
title: Data validation with JSON schema
description:  How to represent data schema with JSON schema. Benefits of separating data schema from data representation in Data-Oriented Programming.
date:   2021-09-30 02:15:28 +0200
categories: javascript
thumbnail: assets/klipse.png
author: Yehonathan Sharvit
minified_plugin: true
tags: [javascript]
---

According to the principles of [Data-Oriented Programming](https://www.manning.com/books/data-oriented-programming?utm_source=viebel&utm_medium=affiliate&utm_campaign=book_sharvit2_data_1_29_21&a_aid=viebel&a_bid=d5b546b7), we should represent data with **generic** and **immutable** data structures, like immutable hash maps and immutable vectors. At first sight, it might seem that it means to *live in the wild* and not validate that data is conformed to an expected schema.

In fact, it is possible -- and advised -- to maintain a data schema in Data-Oriented Programming. For instance, in Clojure, we handle data validation with tools like [clojure.spec] or [malli].

The major insight of this kind of data validation is that **data schema** should be **separated** from **data representation**.

> We should separate data schema from data representation.

The purpose of this article is to illustrate how to implement Clojure approach of data validation in other programming languages using JSON schema.

This article is made of 4 parts:

1. How to express a data schema using **JSON schema**
1. How to **validate** data against a JSON schema
1. The **benefits** of separating between data schema and data representation
1. The **costs** of separating between data schema and data representation

This article is an interactive version of the article published on [JavaScript Works](https://javascript.works-hub.com/learn/data-validation-without-objects-78fcc).

![Freedom](/assets/freedom-2.jpg)

## JSON schema


Think about handling a request in a library management system for the addition of an author to the system. To keep things simple, imagine that such a request contains only basic information about the author: 

1. Their first name 
1. Their last name
1. Optionally, the number of books they have written


In Data-Oriented Programming, we represent the request data in our program as a string map that is expected to have three fields:

1. `firstName` - a string
1. `lastName` - a string
1. `books` - a number (optional)


Using [JSON schema](https://json-schema.org/), we represent the data schema of the request with the following map:

~~~klipse-eval-js
var addAuthorRequestSchema = {
  "type": "object",
  "required": ["firstName", "lastName"], 
  "properties": {
    "firstName": {"type": "string"},
    "lastName": {"type": "string"},
    "books": {"type": "integer"}
  }
};
~~~

A couple of remarks regarding the syntax of this JSON schema:

1. Data is expected to be a map (in JSON, a map is called an object)
1. Only `firstName` and `lastName` fields are required
1. `firstName` must be a string
1. `lastName` must be a string
1. `books` must be an integer (when it is provided)

## Data validation against a schema

In order to check whether a piece of data conforms to a data schema, we use a **data validation library** for our preferred programming language. 

| Language   | Data validation Library | 
| ---------- | --------------- | 
| JavaScript | [Ajv](https://github.com/ajv-validator/ajv)             | 
| Clojure    | [jinx](https://github.com/juxt/jinx)
| Java       | [Snow](https://github.com/ssilverman/snowy-json)           |
| C#         | [JSON.net Schema](https://www.newtonsoft.com/jsonschema) |
| Python     | [jschon](https://github.com/marksparkza/jschon)         |
| Ruby       | [JSONSchemer](https://github.com/davishmcclurg/json_schemer)    |

The complete list of data validation libraries is available [here](http://json-schema.org/implementations.html).

For instance, in JavaScript, using [Ajv JSON schema validator](https://ajv.js.org/), we validate a piece of data using the `validate` function. As you might expect, when a piece of data is valid, `validate` returns `true`:

~~~klipse-eval-js
var ajv = new Ajv({allErrors: true}); 

var validAuthorData = {
  firstName: "Isaac",
  lastName: "Asimov",
  books: 500
};

ajv.validate(addAuthorRequestSchema, validAuthorData); 
~~~

When a piece of data is invalid (e.g. using `lastNam` instead of `lastName`), `validate` returns `false`:

~~~klipse-eval-js
var invalidAuthorData = {
  firstName: "Isaac",
  lastNam: "Asimov",
  books: "five hundred"
};

ajv.validate(addAuthorRequestSchema, invalidAuthorData);
~~~


When a piece of data is invalid, we can easily get details about data validation failures in a human readable format:


~~~klipse-eval-js
var invalidAuthorData = {
  firstName: "Isaac",
  lastNam: "Asimov",
  books: "five hundred"
};

ajv.validate(addAuthorRequestSchema, invalidAuthorData);
ajv.errorsText(ajv.errors);
// "data should have required property 'lastName', data.books should be number"
~~~

A couple of remarks regarding validation with `Ajv`:

1. By default, Ajv stores only the first data validation error. We use `allErrors: true` to store all errors.
1. Data validation errors are stored internally as an array. In order to get a human readable string, we use `errorsText` function.

## The benefits of separating between data schema and data representation

When we separate data schema from data representation in our programs, our programs benefit from:

1. **Freedom** to choose what data should be validated
1. **Optional** fields
1. **Advanced** data validation conditions
1. Automatic generation of data model **visualization**
1. Automatic generation of **unit tests**


### Benefit #1: Freedom to choose what data should be validated

When data schema is separated from data representation we are free to instantiate data without specifying its expected shape. Such a *freedom* is useful in various situations. For example:

1. We want to experiment with code quickly 
1. Data has already been validated

#### Rapid prototyping

In classic Object-Oriented Programming and in some statically typed Functional Programming, each and every piece of data must have a predefined shape (either a class or a data type). During the **exploration phase** of coding, where we don't know yet what is the exact shape of our data, being forced to update the type definition each time we update our data model *slows us down*. In Data-Oriented Programming, we can develop at a *fast pace* during the exploration phase, by **delaying** the data schema definition to a later phase.


#### Code refactoring

One common refactoring pattern is the **split phase refactoring** where you basically split a single large function into multiple smaller functions, with a private scope. Those functions are called with data that has already been validated by the large function. In Data-Oriented Programming, we are free to not specify the shape of the arguments of the inner functions, relying on the data validation that has already occurred.


Suppose we want to display some information about an author, like their full name and whether they are considered as prolific or not. 

First, we define the data schema for the author data:

~~~klipse-eval-js
var authorSchema = {
  "type": "object",
  "required": ["firstName", "lastName"],
  "properties": {
    "firstName": {"type": "string"},
    "lastName": {"type": "string"},
    "books": {"type": "integer"}
  }
};
~~~

Then, we write a `displayAuthorInfo` function that first check whether data is valid and then displays the information about he author:

~~~klipse-eval-js
function displayAuthorInfo(authorData) {
  if(!ajv.validate(authorSchema, authorData)) {
    throw "displayAuthorInfo called with invalid data";
  };
  console.log("Author full name is: ", authorData.firstName + " " + authorData.lastName);
  if(authorData.books == null) {
    console.log("Author has not written any book");
  } else {
    if (authorData.books > 100) {
      console.log("Author is prolific");
    } else {
      console.log("Author is not prolific");
    }
  }
}
~~~

Notice that the first thing we do inside the body of `displayAuthorInfo` is to validate that the argument passed to the function is valid.

Now, let's apply the split phase refactoring pattern to this simplistic example and split the body of `displayAuthorInfo` in two inner functions:


1. `displayFullName`: Display the author full name
1. `displayProlificity`: Display whether the author is prolific or not

~~~klipse-eval-js

function displayFullName(authorData) {
  console.log("Author full name is: ", authorData.firstName + " " + authorData.lastName);
}

function displayProlificity(authorData) {
  if(authorData.books == null) {
    console.log("Author has not written any book");
  } else {
    if (authorData.books > 100) {
      console.log("Author is prolific");
    } else {
      console.log("Author is not prolific");
    }
  }
}

function displayAuthorInfo(authorData) {
  if(!ajv.validate(authorSchema, authorData)) {
    throw "displayAuthorInfo called with invalid data";
  };
  displayFullName(authorData);
  displayProlificity(authorData);
}
~~~

Having the data schema separated from the data representation allows us not to specify a data schema for the arguments of the inner functions `displayFullName` and `displayProlificity`. It makes the refactoring process a bit *smoother*.

In some cases, the inner functions are more complicated and it makes sense to specify a data schema for their arguments. Data-Oriented Programming gives us the freedom to choose!



### Benefit #2: Optional fields

In Object-Oriented Programming, allowing a class member to be *optional* is not easy. For instance, in Java one needs a special construct like the `Optional` class [introduced in Java 8](https://www.oracle.com/technical-resources/articles/java/java8-optional.html).

In Data-Oriented Programming, it is natural to declare a field as optional in a map. In fact in JSON schema, **by default** every field is optional. In order to make a field non-optional, we have to include its name in the `required` array as for instance in the author schema in the following code snippet where only `firstName` and `lastName` are required while `books` is optional. 

~~~klipse-eval-js
var authorSchema = {
  "type": "object",
  "required": ["firstName", "lastName"], // `books` is not included in `required`, as it is an optional field
  "properties": {
    "firstName": {"type": "string"},
    "lastName": {"type": "string"},
    "books": {"type": "integer"} // when present, `books` must be an integer
  }
};
~~~


Let's illustrate how the validation function deals with optional fields: A map without a `books` field is considered to be valid:

~~~klipse-eval-js
var authorDataNoBooks = {
  "firstName": "Yehonathan",
  "lastName": "Sharvit"
};

ajv.validate(authorSchema, authorDataNoBooks) // true
~~~

However, a map with a `books` field where the value is not an interger is considered to be invalid:


~~~klipse-eval-js
var authorDataInvalidBooks = {
  "firstName": "Albert",
  "lastName": "Einstein",
  "books": "Five"
};

ajv.validate(authorSchema, authorDataInvalidBooks) // false
~~~

### Benefit #3: Advanced data validation conditions

In Data-Oriented Programming, data validation occurs at **run time**. It allows us to define data validation conditions that go beyond the **type** of a field. For instance, we might want to make sure that a field is not only a string but a string with a maximal number of characters or a number comprised in a range of numbers.

For instance, here is a JSON schema that expects `firstName` and `lastName` to be strings of less than 100 characters and `books` to be a number between `0` and `10,000`:

~~~klipse-eval-js
var authorComplexSchema = {
  "type": "object",
  "required": ["firstName", "lastName"],
  "properties": {
    "firstName": {
      "type": "string",
      "maxLength": 100
    },
    "lastName": {
      "type": "string",
      "maxLength": 100
    },
    "books": {
      "type": "integer",
      "minimum": 0,
      "maximum": 10000
    }
  }
};
~~~


JSON schema supports many other advanced data validation conditions, like regular expression validation for string fields or number fields that should be a multiple of a given number.


### Benefit #4: Automatic generation of data model visualization

When the data schema is defined as data, we can leverage tools that generate data model visualization: with tools like [JSON Schema Viewer](https://navneethg.github.io/jsonschemaviewer/) and [Malli](https://github.com/metosin/malli) we can generate a UML diagram out of a JSON schema. For instance, the following JSON schema defines the shape of a `bookList` field that is an array of books where each book is a map. 

~~~json
{
  "type": "object",
  "required": ["firstName", "lastName"],
  "properties": {
    "firstName": {"type": "string"},
    "lastName": {"type": "string"},
    "bookList": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {"type": "string"},
          "publicationYear": {"type": "integer"}
        }
      }
    }
  }
}
~~~

The tools we just mentioned can generate the following UML diagram from the JSON schema:

![author schema](/assets/author-schema.png)


### Benefit #5: Automatic generation of unit tests

An interesting way to leverage data schema for function arguments is to automatically generate unit tests. Let's change a bit the `displayAuthorInfo` function into a function called `calculateAuthorInfo` that -- instead of displaying the author info -- returns the author info as a string.

~~~klipse-eval-js
function calculateAuthorInfo(authorData) {
  if(!ajv.validate(authorSchema, authorData)) {
    throw "calculateAuthorInfo called with invalid data";
  };
  var fullName = "Author full name is: " + authorData.firstName + " " + authorData.lastName;
  var prolificity = "";
  if(authorData.books == null) {
    prolificity = "Author has not written any book";
  } else {
    if (authorData.books > 100) {
      prolificity = "Author is prolific";
    } else {
      prolificity = "Author is not prolific";
    }
  }
  return fullName + "\n" + prolificity;
}
~~~

We are going to generate a unit test for `calculateAuthorInfo` by generating random input data that conforms to `authorSchema`. For that purpose, we use a library like [JSON Schema Faker](https://github.com/json-schema-faker/json-schema-faker).

~~~klipse-eval-js
JSONSchemaFaker(authorSchema)
~~~


Then we call `calculateAuthorInfo` with the random data:

~~~klipse-eval-js
calculateAuthorInfo(JSONSchemaFaker(authorSchema))
~~~

Depending on what the function does, we might expect different things. In the case of `calculateAuthorInfo`, we expect the output to be a string that starts with the word `Author`. Let's create a schema for the return value of `calculateAuthorInfo`:


~~~klipse-eval-js
var calculateAuthorInfoReturnValueSchema = {
"type": "string",
"pattern": "Author.*"
};
~~~

Here is the code of our unit test:


~~~klipse-eval-js
var res = calculateAuthorInfo(JSONSchemaFaker(authorSchema));
ajv.validate(calculateAuthorInfoReturnValueSchema, res)
~~~

## The costs of separating between data schema and data representation

There is no such thing as a free lunch. Separating between data schema and data representation comes at a cost:

1. *Loose connection* between data and its schema
1. Light *performance* hit 

### Cost #1: Loose connection between data and its schema

By definition, when we separate between data schema and data representation, the connection between data and its schema is **looser** that when we represent data with classes. Moreover, the schema definition language (e.g. JSON schema) is not part of the programming language. It is up to the developer to decide where data validation is **necessary** and where it is **superfluous**.

As the idiom says, with great **power** comes great **responsibility**.


### Cost #2: Light performance hit

As we mentioned earlier, there exist implementations of JSON schema validation in most programming languages. When data validation occurs at **run time** it takes some time to run the data validation while in Object-Oriented programming, data validation occurs usually at **compile time**.

This drawback is **mitigated** by the fact that even in Object-Oriented programming some parts of the data validation occur at run time. For instance, the conversion of a request JSON payload into an object occurs at run time. Moreover, in Data-Oriented Programming, it is quite common to have some data validation parts enabled only during **development** and to disable them when the system runs in **production**.

As a consequence, the performance hit is not significant.


## Wrapping up

In [Data-Oriented Programming](https://www.manning.com/books/data-oriented-programming?utm_source=viebel&utm_medium=affiliate&utm_campaign=book_sharvit2_data_1_29_21&a_aid=viebel&a_bid=d5b546b7), data is represented with immutable generic data structures. When additional information about the shape of the data is required, we are free to define a data schema (e.g. in JSON Schema).

Keeping the data schema separate from the data representation leaves the developer free to decide where and when data should be validated. Moreover, data validation occurs at run-time. As a consequence, we can express data validation conditions that go beyond the static data types (e.g. the string length). 

However, with great power comes great responsibility and it's up to the developer to decide to validate data.

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.20/lodash.min.js" integrity="sha512-90vH1Z83AJY9DmlWa8WkjkV79yfS2n2Oxhsi2dZbIv0nC4E6m5AbH8Nh156kkM7JePmqD6tcZsfad1ueoaovww==" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ajv/6.12.6/ajv.bundle.js" integrity="sha512-km2o1mynU1nR0HonrYrI0TA+QvRMtONwnfA/nl15hnd/WyjZ/FLV7NROHAbzzSjHxIeQPfiJRUSUzevO2Ut0Ng==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/json-schema-faker/0.5.0-rc9/json-schema-faker.min.js" integrity="sha512-MigyB2SaiNKRt1O7yhf1CbLSUnhIopQfQQfzt4N8+JFa4cBizE+OxsfPy+rUUw5sQ2WootqG1kxHS1pvjcsPyA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
