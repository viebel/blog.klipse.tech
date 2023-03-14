---
layout: post
title: Data-Oriented programming coding challenges
description:  Data-Oriented programming challenges that illustrate the simplicity of Data-Oriented programming.
date:   2021-04-02 14:38:15 +0200
categories: dop
thumbnail: assets/klipse.png
author: Yehonathan Sharvit
minified_plugin: true
tags: [dop, javascript]
---

Here are a series of 5 short programming challenges in JavaScript. 

# Data model

Here is the library data model in an informal way:

![mindmap](/assets/lms-data-mindmap.png)

More formally, here is a UML diagram that describes the relationships between the data entities of the library:

![diagram](/assets/lms-data-diagram.png)

Here is an example of library data in JavaScript that we are going to use through this article:

~~~eval-js
var libraryData = {
    "name": "The smallest library on earth",
    "address": "Here and now",
    "catalog": {
        "booksByIsbn": {
            "978-1779501127": {
                "isbn": "978-1779501127",
                "title": "Watchmen",
                "publicationYear": 1987,
                "authorIds": ["alan-moore",
                              "dave-gibbons"],
                "bookItems": [
                    {
                        "id": "book-item-1",
                        "rackId": "rack-17",
                    },
                    {
                        "id": "book-item-2",
                        "rackId": "rack-17",
                    }
                ]
            }
        },
        "authorsById": {
            "alan-moore": {
                "name": "Alan Moore",
                "bookIsbns": ["978-1779501127"]
            },
            "dave-gibbons": {
                "name": "Dave Gibbons",
                "bookIsbns": ["978-1779501127"]
            }
        }
    },
  "userManagement": {
    "librarians": {
      "franck@gmail.com" : {
        "email": "franck@gmail.com",
        "encryptedPassword": "bXlwYXNzd29yZA=="
      }
    },
    "members": {
      "samantha@gmail.com": {
        "email": "samantha@gmail.com",
        "encryptedPassword": "c2VjcmV0",
        "isBlocked": false,
      }
    }
  }
};
~~~

# Warm up

What's the title of the book whose ISBN is "978-1779501127" in upper case?

I suggest you use [Lodash FP](https://github.com/lodash/lodash/wiki/FP-Guide). 

Here's an example: 

~~~eval-js
var informationPath = ["catalog", "booksByIsbn", "978-1779501127", "title"]; 
_.get(libraryData, informationPath).toUpperCase();
~~~


# Challenge #1: Retrieve a piece of information

**Challenge ‍**: Write a function named `getBookProperty` that receives library data and ISBN and a field name and returns the value of the field for the book with the given ISBN

~~~eval-js
function getBookProperty(libraryData, isbn, fieldName) {
   // Write your code here using _.get
}
~~~


~~~eval-js
getBookProperty(libraryData, "978-1779501127", "title") === "Watchmen"
~~~


# Challenge #2: Search information

**Challenge ‍**: Write a function named `bookInfo` that receives library data and a string and returns a JSON string that contains book information about the books whose title contains the given string, in a case insensitive way. Book information is made of: title, isbn, author full names.

**Remark**: You are not allowed to extract author names from author ids. Assume that author ids are opaque strings.

~~~eval-js
function searchBooksByTitle(libraryData, query) {
   // Write your code here using _.get, _.map and _.filter
}
~~~

~~~eval-js
function searchBooksByTitleJSON(libraryData, query) {
  return JSON.stringify(searchBooksByTitle(libraryData, query));
}
~~~

~~~eval-js
var expected = [
   {
    "authorNames":  [
      "Alan Moore",
      "Dave Gibbons",
    ],
    "isbn": "978-1779501127",
    "title": "Watchmen",
  },
]
_.isEqual(searchBooksByTitle(libraryData, "watCH"), expected)
~~~

# Challenge #3: Add a piece of information

**Challenge**: Write a function named `blockMember` that receives library data and an email address and returns a new version of library data **without altering the original version**, where the user with the given email is blocked.

Remember that we are using a version of Lodash that, instead of mutating data in place, creates a new version.


~~~eval-js
function blockMember(libraryData, email) {
   // Write your code here using _.set
}
~~~

~~~eval-js
var informationPath = ["userManagement", "members", "samantha@gmail.com", "isBlocked"]; 
_.get(updatedLibraryData, informationPath) == true
~~~

~~~eval-js
_.get(libraryData, informationPath) === false
~~~

In Data-Oriented programming, data is immutable. Functions like `_.set()_` make it efficient (both in terms of memory and computation) to create modified versions of data.

# Challenge #4: Rename keys in a data entity

**Challenge**: Write a function named `renameKeys` that receives a data entity and a key mappings and returns a new data entity, without altering the original entity, where the fields are renamed according to the key mappings

~~~eval-js
function renameKeys(map, keyMap) {
   // Write your code here using _.get, _.set, _.omit and _.reduce
}
~~~

`renameKeys` works with author entities:

~~~eval-js
var alanMoore = {
  "name": "Alan Moore",
  "bookIsbns": ["978-1779501127"]
};

var expected = {
   "name": "Alan Moore",
  "books": [
    "978-1779501127",
  ],
}

_.isEqual(renameKeys(alanMoore, {"bookIsbns": "books"}), expected)
~~~

`renameKeys` should also works also with book item entities:

~~~eval-js
var bookItem = {
  "id": "book-item-1",
  "rackId": "rack-17",
  "isLent": true
};

var expected = {
  "bookItemId": "book-item-1",
  "isLent": true,
};

_.isEqual(
renameKeys(bookItem, {"rackId": "id",
                      "id": "bookItemId"}),
  expected)
~~~

In Data-Oriented programming, data entities are represented with generic data structures that can be manipulated with generic functions that work with any data entity.

# Challenge #5: Merge pieces of information

**Challenge**: Write a function named `mergeAndSerialize` that receives two pieces of book information, one from the database and one from an external service like [Open Library Books API](https://openlibrary.org/dev/docs/api/books) and returns a JSON string with information from both sources.

~~~eval-js
var watchmenFromDB = {
        "isbn": "978-1779501127",
        "title": "Watchmen",
        "publicationYear": 1987,
        "authorIds": ["alan-moore",
                      "dave-gibbons"],
        "bookItems": [
          {
            "id": "book-item-1",
            "rackId": "rack-17",
            "isLent": true
          },
          {
            "id": "book-item-2",
            "rackId": "rack-17",
            "isLent": false
          }
        ]
      };

var watchmenFromOpenLib = {
  "publishers": [
    "DC Comics"
  ],
  "number_of_pages": 334,
  "weight": "1.4 pounds",
  "physical_format": "Paperback",
  "subjects": [
    "Graphic Novels",
    "Comics & Graphic Novels",
    "Fiction",
    "Fantastic fiction"
  ],
  "isbn_13": [
    "9780930289232"
  ],
  "title": "Watchmen",
  "isbn_10": [
    "0930289234"
  ],
  "publish_date": "April 1, 1995",
  "physical_dimensions": "10.1 x 6.6 x 0.8 inches"
}
~~~

~~~eval-js
function mergeAndSerialize(a, b) {
   // Write your code here using _.merge
}

mergeAndSerialize(watchmenFromDB, watchmenFromOpenLib);
~~~

When we represent data with generic data structures, we benefit from many well defined functions like `merge`, implemented either in the programming language itself or in third-party libraries like `Lodash.js.



<script src='https://cdn.jsdelivr.net/g/lodash@4(lodash.min.js+lodash.fp.min.js)'></script>
<script>
var fp = _.noConflict();
var _ = fp.convert({
  // Specify capping iteratee arguments.
  'cap': false,
  // Specify currying.
  'curry': false,
  // Specify fixed arity.
  'fixed': false,
  // Specify immutable operations.
  'immutable': true,
  // Specify rearranging arguments.
  'rearg': false
});
</script>


