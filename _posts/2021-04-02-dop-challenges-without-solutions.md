---
layout: post
title: Data-Oriented programming simplicity illustrated by coding challenges
description:  Data-Oriented programming challenges that illustrate the simplicity of Data-Oriented programming.
date:   2021-04-01 14:38:15 +0200
categories: dop
thumbnail: assets/klipse.png
author: Yehonathan Sharvit
minified_plugin: true
tags: [dop, javascript]
---


According to Data-Oriented programming, the best way to reduce complexity of information systems is to follow three basic principles:


1. Separate code from data
1. Keep data immutable
1. Represent data with generic data structures


Here are a series of 6 short programming challenges and their solutions written in JavaScript according to the principles of Data-Oriented programming. The purpose is to illustrate the simplicity of Data-Oriented programming. 


If you agree with DOP principles, please implement your solutions in the programming language of your choice, according to DOP principles. I'm sure you'll enjoy!

If you disagree with one or more DOP principles, feel free to implement the solutions by breaking one or more principles (e.g. use data types, classes or records instead of maps), and explain why you think that your solution is simpler than the ones that I wrote.


# Rules

1. You are allowed to choose any programming language
1. You are allowed to use any third-party library
1. You are allowed to use reflection
1. In the context of the challenges, simplicity is more important than performances.
1. Submit your code snippets as a pull request to the official book source code [Github repository](https://github.com/viebel/data-oriented-programming), under the `challenges` folder
1. In case you disagree with DOP, please add a few words as comments in your code that explain why you think that your solution is simpler than the ones that I wrote.
1. Four copies of [Data-Oriented programming](https://www.manning.com/books/data-oriented-programming?utm_source=viebel&utm_medium=affiliate&utm_campaign=book_sharvit2_data_1_29_21&a_aid=viebel&a_bid=d5b546b7) will be given away among the folks that submit a correct solution to at least 4 of the challenges.


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

In this article, I am using [Lodash FP](https://github.com/lodash/lodash/wiki/FP-Guide) configured so that it never mutates data in place. Instead of mutating data in place, functions like `_.set()` create a new version.

~~~eval-js
var informationPath = ["catalog", "booksByIsbn", "978-1779501127", "title"]; 
_.get(libraryData, informationPath).toUpperCase();
~~~

In Data-Oriented programming, each piece of information has an information path. As you'll see through the upcoming challenges, this unusual approach has many benefits.


# Challenge #1: Retrieve a piece of information

**Challenge ‍**: Write a function named `getBookProperty` that receives library data and ISBN and a field name and returns the value of the field for the book with the given ISBN

~~~eval-js
function getBookProperty(libraryData, isbn, fieldName) {
  var informationPath = ["catalog", "booksByIsbn", isbn, fieldName]; 
  return _.get(libraryData, informationPath);
}
~~~


~~~eval-js
getBookProperty(libraryData, "978-1779501127", "title");
~~~

In Data-Oriented programming, data fields are first-class citizens. We are free to create and combine field names dynamically in our program.

# Challenge #2: Search information

**Challenge ‍**: Write a function named `bookInfo` that receives library data and a string and returns a JSON string that contains book information about the books whose title contains the given string, in a case insensitive way. Book information is made of: title, isbn, author full names.

**Remark**: You are not allowed to extract author names from author ids. Assume that author ids are opaque strings.

~~~eval-js
function authorNames(catalogData, book) {
  return _.map(_.get(book, "authorIds"),
               function(authorId) {
    return _.get(catalogData, ["authorsById", authorId, "name"]);
    });
}

function bookInfo(catalogData, book) {
  return  {
    "title": _.get(book, "title"),
    "isbn": _.get(book, "isbn"),
    "authorNames": authorNames(catalogData, book)
  };
}

function searchBooksByTitle(libraryData, query) {
  var catalogData = _.get(libraryData, "catalog");
  var allBooks = _.get(catalogData, "booksByIsbn");
  var matchingBooks = _.filter(allBooks, function(book) { 
    return _.get(book, "title").toLowerCase()
      .includes(query.toLowerCase());
  });
  return JSON.stringify(_.map(matchingBooks, function(book) {
    return bookInfo(catalogData, book);
  }));
}
~~~

~~~eval-js
searchBooksByTitle(libraryData, "watCH");
~~~

Here, the main benefits are the power of expression of `map` and `reduce` combined with the freedom of creating on the fly a book info structure and serialize it for free.

# Challenge #3: Add a piece of information

**Challenge**: Write a function named `blockMember` that receives library data and an email address and returns a new version of library data **without altering the original version**, where the user with the given email is blocked.

Remember that I am using a version of Lodash that, instead of mutating data in place, creates a new version.


~~~eval-js
function blockMember(libraryData, email) {
  var informationPath = ["userManagement", "members", email, "isBlocked"]; 
  return _.set(libraryData, informationPath, true);
}
~~~

~~~eval-js
var updatedLibraryData = blockMember(libraryData, "samantha@gmail.com");

var informationPath = ["userManagement", "members", "samantha@gmail.com", "isBlocked"]; 
[_.get(updatedLibraryData, informationPath), _.get(libraryData, informationPath)];
~~~

In Data-Oriented programming, data is immutable. Functions like `_.set()_` make it efficient (both in terms of memory and computation) to create modified versions of data.

# Challenge #4: Rename keys in a data entity

**Challenge**: Write a function named `renameKeys` that receives a data entity and a key mappings and returns a new data entity, without altering the original entity, where the fields are renamed according to the key mappings

~~~eval-js
function renameKeys(map, keyMap) {
  return _.reduce(keyMap,
                  function(res, newKey, oldKey) {
                    var value = _.get(map, oldKey);
                    var resWithNewKey = _.set(res, newKey, value);
                    var resWithoutOldKey = _.omit(resWithNewKey, oldKey);
                    return resWithoutOldKey;
                  },
                  map);
}
~~~

`renameKeys` works with author entities:

~~~eval-js
var alanMoore = {
  "name": "Alan Moore",
  "bookIsbns": ["978-1779501127"]
};
renameKeys(alanMoore, {"bookIsbns": "books"}); 
~~~

`renameKeys` works also with book item entities:

~~~eval-js
var bookItem = {
  "id": "book-item-1",
  "rackId": "rack-17",
  "isLent": true
};

renameKeys(bookItem, {"rackId": "id",
                     "id": "bookItemId"}); 
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

We simply merge the two maps:

~~~eval-js
_.merge(watchmenFromDB, watchmenFromOpenLib);
~~~

And we JSON serialize the result:

~~~eval-js
function mergeAndSerialize(a, b) {
  return JSON.stringify(_.merge(a, b));
}

mergeAndSerialize(watchmenFromDB, watchmenFromOpenLib);
~~~

When we represent data with generic data structures, we benefit from many well defined functions like `merge`, implemented either in the programming language itself or in third-party libraries like `Lodash.js.


# Challenge #6: Compare versions of data

**Challenge**: Write a function named `diff` that receives two versions of library data and returns an object that contains the diff between the two versions, in the format of your choice.

~~~eval-js
function diffObjects(data1, data2) {
  var emptyObject = _.isArray(data1) ? [] : {};
  if(data1 == data2) {
    return emptyObject;
  }
  var keys = _.union(_.keys(data1), _.keys(data2));
  return _.reduce(keys,
                  function (acc, k) {
    var res = diff(_.get(data1, k),
                   _.get(data2, k));
    if((_.isObject(res) && _.isEmpty(res)) ||
       (res == "data-diff:no-diff")) {
      return acc;
    }
    return _.set(acc, [k], res);
  },
                  emptyObject);
}

function diff(data1, data2) {
  if(_.isObject(data1) && _.isObject(data2)) {
    return diffObjects(data1, data2);
  }
  if(data1 !== data2) {
    return data2;
  }
  return "data-diff:no-diff";
}
~~~

~~~eval-js
diff(libraryData, updatedLibraryData);
~~~

~~~eval-js
diff(libraryData, libraryData);
~~~

When every piece of data in the system is represented with generic data structures, it is quite easy to compare recursively different data versions.

# Conclusion

Do you like 😃 DOP or do you hate 😡 it? 

Anyway, it's time to show off your coding skills 🧑‍💻!


Submit your code snippets as a pull request to the official book source code [Github repository](https://github.com/viebel/data-oriented-programming), under the `challenges` folder.
In case you disagree with DOP, please add a few words as comments in your code that explain why you think that your solution is simpler than the ones that I wrote.


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


