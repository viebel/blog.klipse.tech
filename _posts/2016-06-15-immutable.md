---
layout: post
title:  "immutable.js live tutorial"
description:  "spec tutorial clojure klipse live coding examples clojurescript cljs"
date:   2016-03-30 18:17:52 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "4BEFF6B0-8E1C-482F-98B0-BCA39A0F84B1"
author: "@viebel"

---
# Introduction to Immutable.js


Inspired by [introduction to immutable.js](http://www.zsoltnagy.eu/introduction-to-immutable-js/)

This entry was posted in Javascript Libraries  and tagged Functional Programming Javascript JSON NodeJs NPM Tutorial UnderscoreJs  on 13th September 2015 by zsolt-nagy
Most developers emphasize immutability when dealing with functional programming. Code written in functional style is testable, because the functions operate on data treated as immutable. In practice though, I see this principle violated from time to time. I will present one way to force yourself to eliminate side effects in your code: using immutable.js.

# Immutable.js to the rescue

You can use Immutable.js in your code by installing it as an npm module or loading the source file immutable.min.js.

Let’s explore an immutable map as our first example. A map is basically an object consisting of key-value pairs.


<div class="language-klipse-eval-js" data-external-libs="immutable">
     Immutable
</div>
               

~~~klipse-eval-js
window.person = Immutable.Map({ 
        name: 'John', 
            birth: 594687600000,
                phone: '12345678'
});
~~~

~~~klipse-eval-js
window.changePhone = function( person, newPhone ) {
        return person.set( 'phone', newPhone );
};

window.person2 = changePhone( person, '87654321' );

 person2 == person;
~~~

~~~klipse-eval-js
[person.get('phone'), person2.get( 'phone' )]
~~~

Maps are not plain `javascript` objects:

~~~klipse-eval-js
[person.phone, person2.phone]
~~~

First, a person is created with the name, birth and phone attributes. The changePhone function returns a new immutable map. When the changePhone function is executed, person2 is created as a return value, and person2 is strictly different than person. The phone numbers of each person map can be accessed via the get method. The properties of the maps are hidden behind the get/set interface, therefore they cannot be directly accessed or modified.


~~~klipse-eval-js
       window.person3 = changePhone( person, '12345678' );

       [person3 == person, person3 === person] 
~~~

~~~klipse-eval-js
window.person4 = changePhone( person, '87654321' );
window.person5 = changePhone( person4, '12345678' );
person5 === person
~~~

The immutable abstraction is intelligent enough to detect when an attribute is changed to the same value as before. In this case, both == and === comparisons return true, as the return of the o.set method is o. In all other cases, a real change takes place, and a new object reference is returned. This is why person5 is not equal to person even though they have the exact same keys and values. Mind you, in many real-life scenarios, person is supposed to be a thrown-away value after a modification takes place, therefore a comparison between person and person5 is rarely useful.

If we wanted to check the equality of attribute key-value pairs of person and person5, we can use the equals method of the immutable map interface:


~~~klipse-eval-js
person5.equals( person )
~~~
                         
~~~klipse-eval-js
person5.equals( person )
~~~
              
---
[app-url]: http://app.klipse.tech?blog=klipse

