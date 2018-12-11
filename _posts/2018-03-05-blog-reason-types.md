---
layout: post
title: Polymorphic vs. ordinary variants in reason 
description:  polymorphic and ordinary variants. reason. reasonml. ocaml.
date:   2018-03-12 13:22:18 +0200
categories: reason
thumbnail: assets/klipse.png
guid: 294191D2-B3B8-4F4A-B1E3-F98F63861F6B
author: Yehonathan Sharvit
minified_plugin: true
---

# Introduction

Variants are one of the coolest features of `reasonml`. 

In the [official documentation](https://reasonml.github.io/docs/en/variant.html), they mention a limitation of the variants (also called ordinary variants):

> A function can't accept an arbitrary constructor shared by two different variants.

They also mention that this is possible to overcome this limitation using polymorphic variants.

The purpose of this article is to expose the limitations of the ordinary variants and to see how polymorphic variants overcome this limitation. We hope that the examples we bring with dogs and tulips will make the reading of this article somewhat enjoyable.

![Einstein](/assets/dog_tulip.jpg)

# Ordinary Variants - brief recap

Let's say you have an `animal` variant

~~~klipse-reason-types
type animal = 
| Dog
| Cat 
~~~

And you want to write a function that stringifies an `animal`.

~~~klipse-reason-types
let string_of_animal = x => 
switch (x)  {
|Dog => "dog"
|Cat => "cat"
}
~~~

Now, a `Dog` is a "dog" and a `Cat` is a "cat":

~~~klipse-reason-types
"The " ++ string_of_animal(Dog) ++ " bites the " ++  string_of_animal(Cat)
~~~

So far so good.

Now let's do the same with flowers:

~~~klipse-reason-types
type flower =
| Rose
| Tulip;

let string_of_flower = x => 
switch (x)  {
|Rose => "rose"
|Tulip => "tulip"
};

let a = "The " ++ string_of_flower(Rose) ++ " is more beautiful than the " ++  string_of_flower(Tulip);
~~~

# The limitation of Variants


Now what happens if you try to write a function that stringifies both flowers and animals?

~~~klipse-reason-types
let string_of_flower_or_animal = x =>
switch (x)  {
|Rose => "rose"
|Tulip => "tulip"
|Dog => "dog"
|Cat => "cat"
};
~~~

The constructor `Dog` doesn't belong to type `flower` and in that case `ocaml` doesn't create a `flower_or_animal` type on the fly!

Another limitation of ordinary variants is that you cannot mix elements of types `animal` and `flower` in a list or in an array:

~~~klipse-reason-types
let a = [Dog, Cat, Rose, Tulip]
~~~


Welcome to the world of polymorphic variants!

# Polymorphic variants

Syntactically, polymorphic variants are distinguished from ordinary variants by the leading backtick:

~~~klipse-reason-types
let myDog = `Dog;
~~~

Note that unlike ordinary variants, polymorphic variants can be used without an explicit type declaration. 
Their type is inferred automatically. 

Of course, it works also with variants that are parametrized:

~~~klipse-reason-types
let myNumber = `Int(4)
~~~

Now, let's see how to write our `string_of_animal_or_flower` function with polymorphic types:

~~~klipse-reason-types
let string_of_flower_or_animal = x =>
switch (x)  {
|`Rose => "rose"
|`Tulip => "tulip"
|`Dog => "dog"
|`Cat => "cat"
};
~~~

Note that the system has automatically inferred the type of the function argument: it's ``[< `Cat | `Dog | `Rose | `Tulip ]``. You probably wonder what is the meaning of the `<` sign. 

Before answering that question, let's see how polymorphic variants allow us to mix elements of different types in a list:

~~~klipse-reason-types
let myNature = [`Dog, `Cat, `Rose, `Tulip]
~~~

Now, the type of the list is: ``[> `Cat | `Dog | `Rose | `Tulip ] list``.


# Upper and lower bounds

Now it's time to explain what is the meaning of `<` and `>` in the context of polymorphic variants.

The `>` at the beginning of a variant type marks the type a being **open to combination** with other variant types. We can read the type ``[> `Cat | `Dog | `Rose | `Tulip]`` as describing a variant whose tags include `` `Cat``, `` `Dog``, `` `Rose`` and `` `Tulip``, but may include more tags as well.

In other words, you can roughly translate `>` to mean: "these tags or more".

Indeed, we are allowed concatenate list of animals and list of flowers:

~~~klipse-reason-types
let myAnimals = [`Dog, `Cat];
let myFlowers = [`Rose, `Tulip];
let myThings = List.concat([myAnimals, myFlowers]);
~~~


The `<` at the beginning of a variant type means "these tags or less". For instance, in our `string_of_flower_or_animal` function defined above, the argument has been inferred to be of type ``[< `Cat | `Dog | `Rose | `Tulip ]``. Indeed the function has no way to deal with values that have tags other than `` `Cat``, `` `Dog``, `` `Rose`` and `` `Tulip``.

# Conclusion

You might now ask yourself why not always use polymorphic variants. 

The answer is that the flexibility of polymorphic variant comes at a price.

1. They are more complex that ordinary variants
2. They are less likely to catch bugs that ordinary variants - precisely because of the flexxibility they allow
3. They are a bit heavier and less performant that ordinary variants

Be sure to read [this chapter](https://realworldocaml.org/v1/en/html/variants.html#polymorphic-variants) of Real World Ocaml to go deeper with your understanding of ordinary and polymorphic variants. At the end of this chapter they explain with grat details what are the advantages and disadvantages of polymorphic variants over ordinary variants.


