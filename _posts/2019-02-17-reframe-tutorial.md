---
local_klipse: false
layout: post
title:  re-frame interactive demo
description:  re-frame interactive demo with Klipse. A pattern for writing SPAs in ClojureScript, using Reagent.
date:   2019-02-17 14:33:24 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: F09CE47F-0789-480C-8E2E-2E6FAC632FF6
author: Yehonathan Sharvit
---

## What is re-frame?

re-frame is a functional framework for writing SPAs in ClojureScript, using Reagent.

Being a functional framework, it is about two things: 

1. data
2. the functions which transform that data. 

And, because it is a reactive framework, the "data coordinates the functions" (and not the other way around).

re-frame is often described as  a 6-domino cascade:


One domino triggers the next, which triggers the next, et cetera, boom, boom, boom, until we are back at the beginning of the loop, and the dominoes spring to attention again, ready for the next iteration of the same cascade.

The six dominoes are:

1. Event dispatch
2. Event handling
3. Effect handling
4. Query
5. View
6. DOM

![domino](/assets/Dominoes.jpg)

The purpose of this tutorial is to explain how to write the code of a re-frame app that corresponds to those 6 dominoes.

## Credits

This article is an interactive rewrite of the [code walkthrough from re-frame repo](https://github.com/Day8/re-frame/blob/master/docs/CodeWalkthrough.md). It is published with the blessing of [Mike Thompson](https://twitter.com/wazound). Some of the details have been omitted in order to keep the article as easy to read as possible. Be sure to read also the original article to fill out all the details.

The interactive snippets are powered by [Klipse](https://github.com/viebel/klipse).

There are two kinds of Klipse snippets in this article:

1. regular Clojure snippets for which Klipse displays below the snippet the evaluation of the last expression of the snippet.
2. reagent snippets for which Klipse renders the reagent component just below the snippet as explained [here](http://blog.klipse.tech/reagent/2016/12/31/reagent-in-klipse.html).

If you really want to become a re-frame master, take a [video course on re-frame](https://www.learnreframe.com/?ref=pjksj){:target="_blank"}.

## Usage

In order to use re-frame, you have to require both `re-frame` and `reagent`:

~~~klipse
(ns simple.core
  (:require [reagent.core :as reagent]
            [re-frame.db :as db]
            [re-frame.core :as rf]))
~~~


## Begin with the end in mind

The app we are going to build contains around 70 lines of code.

This app:

1. displays the current time in a nice big, colourful font
2. provides a single text input field, into which you can type a hex colour code, like `#CCC` or `red`, used for the time display

When it is running, here's what it looks like:


<div id="app" class="my-container">
</div>

## App database

In re-frame, there is this notion of a single app database (sometimes called store or app state) that holds all the data of our application. We call it the `app-db`. In our case, the `app-db` will contain a two-key map like this:

~~~klipse
{:time       (js/Date.)  ;; current time for display
 :time-color "#f88"}     ;; the colour in which the time should be shown
~~~

## Events (domino 1)

Events are data. re-frame uses a vector format for events. For example:

~~~clojure
[:time-color-change "red"]
~~~

The first element in the vector, `:time-color-change`, is a keyword which identifies the kind of event. The further elements are optional, and can provide additional data associated with the event. The additional value above, `"red"`, is presumably the color of the time display.

> Rule: events are pure data. No sneaky tricks like putting callback functions on the wire. You know who you are.

# dispatch 

To send an event, call `rf/dispatch` with the event vector as argument:

~~~klipse
"magenta"
#_(rf/dispatch [:time-color-change "magenta"])
~~~

Feel free to uncomment the code snippet just above and see how the color of the time display is updated at the top of the page.


# After dispatch

`dispatch` puts an event into a queue for processing.

So, an event is not processed synchronously, like a function call. The processing happens later - asynchronously. Very soon, but not now.

The consumer of the queue is a router which looks after the event's processing.

The router:

1. inspects the 1st element of an event vector
2. looks for the event handler (function) which is registered for this kind of event
3. calls that event handler with the necessary arguments

As a re-frame app developer, your job, then, is to write and register an event handler (function) for each kind of event.

## Event Handlers (domino 2)

Collectively, event handlers provide the control logic in a re-frame application.

In this application, 3 kinds of event are dispatched: `:initialize`, `:time-color-change` and `:timer`.

3 events means we'll be registering 3 event handlers.

Event handler functions take two arguments `coeffects` and `event`, and they return effects.

Conceptually, you can think of coeffects as being "the current state of the world". And you can think of event handlers as computing and returning changes (effects) based on "the current state of the world" and the arriving event.

Event handlers can be registered via either `reg-event-fx` or `reg-event-db` (`-fx` vs `-db`). Because of its simplicity, we'll be using the latter here: `reg-event-db`.

`reg-event-db` allows you to write simpler handlers for the common case where you want them to take only one coeffect - the current app state - and return one effect - the updated app state.

Here is the syntax of `reg-event-db`:

~~~clojure
(rf/reg-event-db
  :the-event-id
  the-event-handler-fn)
~~~  
  
The handler function you provide should expect two arguments:

1. `db`, the current application state (the value contained in app-db)
2. `v`, the event vector (what was given to dispatch)

So, your function will have a signature like this: `(fn [db v] ...)`.

Each event handler must compute and return the new state of the application, which means it returns a modified version of `db` (or an unmodified one, if there are to be no changes to the state).


### :initialize

On startup, application state must be initialized. We want to put a sensible value into app-db, which starts out containing `{}`.

So a `(dispatch [:initialize])` will happen early in the app's life (more on this below), and we need to write an event handler for it.

Now this event handler is slightly unusual because not only does it not care about any event information passed in via the event vector, but it doesn't even care about the existing value in `db` - it just wants to plonk a completely new value:

~~~klipse
(rf/reg-event-db     ;; sets up initial application state
 :initialize
 (fn [_ _]           ;; the two parameters are not important here, so use _
   {:time (js/Date.) ;; What it returns becomes the new application state
    :time-color "orange"})) 
nil
~~~

This particular handler `fn` ignores the two parameters (usually called `db` and `v`) and simply returns a map literal, which becomes the application state.

Let's initialize our app now, by dispatching an `[:initialize]` event that will be handled by the event handler we just wrote:

~~~klipse
(rf/dispatch-sync [:initialize]) 
~~~

### :timer

Now, we set up a timer function to `(dispatch [:timer now])` every second:

(We use `defonce` in order to ensure that no  more than a single timer is created.)

~~~klipse
(defn dispatch-timer-event
  []
  (let [now (js/Date.)]
    (rf/dispatch [:timer now])))  ;; <-- dispatch used

;; call the dispatching function every second
(defonce do-timer (js/setInterval dispatch-timer-event 1000))
~~~


And here's how we handle it:

~~~klipse
(rf/reg-event-db                 ;; usage:  (rf/dispatch [:timer a-js-Date])
  :timer
  (fn [db [_ new-time]]          ;; <-- de-structure the event vector
    (assoc db :time new-time)))  ;; compute and return the new application state
nil
~~~


### :time-color-change

When the user enters a new colour value a `:time-color-change` event is going to be dispatched via the view.

Here is how we handle a `:time-color-change` event:

~~~klipse
(rf/reg-event-db
  :time-color-change            ;; usage:  (rf/dispatch [:time-color-change 34562])
  (fn [db [_ new-color-value]]
    (assoc db :time-color new-color-value)))   ;; compute and return the new application state
nil
~~~


## Effect Handlers (domino 3)

Domino 3 realises/puts into action the effects returned by event handlers.

In this "simple" application, our event handlers are implicitly returning only one effect: "update application state".

This particular effect is accomplished by a re-frame-supplied effect handler. So, there's nothing for us to do for this domino. We are using a standard re-frame effect handler.

And this is not unusual. You'll seldom have to write effect handlers...

## Subscription Handlers (domino 4)

Subscription handlers, or query functions, take application state as an argument and run a query over it, returning something called a "materialised view" of that application state.

When the application state changes, subscription functions are re-run by re-frame, to compute new values (new materialised views).

Ultimately, the data returned by query functions is used in the view functions (Domino 5).


### reg-sub

`reg-sub` associates a query id with a function that computes that query, like this:

~~~clojure
(rf/reg-sub
  :some-query-id  ;; query id (used later in subscribe)
  a-query-fn)     ;; the function which will compute the query
~~~

Then later, a view function (domino 5) subscribes to a query like this: `(subscribe [:some-query-id])`, and a-query-fn will be used to perform the query over the application state.

Each time application state changes, a-query-fn will be called again to compute a new materialised view (a new computation over app state) and that new value will be given to all view functions which are subscribed to `:some-query-id`. These view functions will then be called to compute the new DOM state (because the views depend on query results which have changed).

Along this reactive chain of dependencies, re-frame will ensure the necessary calls are made, at the right time.

Remember that our application state is a simple Clojure map. In fact, re-frame allows us to access the app state:

(By the way, the following code snippet is evaluated in a loop every second...)

<pre><code class="language-klipse" data-loop-msec="1000">
@db/app-db
</code></pre>

Returning the `:time-color` of our app state is a simple as this:

<pre><code class="language-klipse" data-loop-msec="1000">
(:time-color @db/app-db)
</code></pre>


Here's the code for defining our 2 subscription handlers:

~~~klipse
(rf/reg-sub
  :time
  (fn [db _]     ;; db is current app state. 2nd unused param is query vector
    (:time db))) ;; return a query computation over the application state

(rf/reg-sub
  :time-color
  (fn [db _]
    (:time-color db)))
~~~

Notice that we don't have to `deref` the app db atom as `re-frame` passes to the subscription handlers the content of the atom.


## View Functions (domino 5)

View functions turn data into DOM. They are "State in, Hiccup out" and they are Reagent components.

An SPA will have lots of view functions, and collectively, they render the app's entire UI.

### Hiccup

Hiccup is a data format for representing HTML.

Here's a trivial view function which returns hiccup-formatted data:

~~~klipse
(defn greet
  []
  [:div "Hello viewers"])  ;; means <div>Hello viewers</div>
~~~

And if we call it:

~~~klipse
(greet)
~~~

~~~klipse
(first (greet))
~~~

Yep, that's a vector with two elements: a keyword and a string.

But when we render it with reagent, it becomes a DOM element

~~~reagent
[greet]
~~~

Now, greet is pretty simple because it only has the "Hiccup Out" part. There's no "Data In".


## Subscribing

To render the DOM representation of some part of the app state, view functions must query for that part of `app-db`, and that means using `subscribe`.

`subscribe` is always called like this:

~~~clojure
(rf/subscribe  [query-id some optional query parameters])
~~~

There's only one (global) `subscribe` function and it takes one argument, assumed to be a vector.

The first element in the vector (shown above as query-id) identifies the query, and the other elements are optional query parameters. With a traditional database a query might be:

~~~sql
SELECT * from customers WHERE name="blah"
~~~

In re-frame, that would be done as follows: `(subscribe [:customer-query "blah"])`, which would return a ratom holding the customer state (a value which might change over time!).

> Because subscriptions return a ratom, they must always be dereferenced to obtain the value. This is a recurring trap for newbies.


## The View Functions

This view function renders the clock:

~~~klipse
(defn clock
  []
  [:div.example-clock
   {:style {:color @(rf/subscribe [:time-color])}}
   (-> @(rf/subscribe [:time])
       .toTimeString
       (clojure.string/split " ")
       first)])
~~~

As you can see, it uses `subscribe` twice to obtain two pieces of data from `app-db`. If either change, re-frame will re-run this view function.

We can render the `clock` as any other reagent component:

~~~reagent
[clock]
~~~

The cool thing is that when we change the a value in our app state, the `clock` changes immediately:

Uncomment the following `swap!` expression and see how the clock changes its color:

~~~klipse
"blue"
#_(swap! db/app-db assoc :time-color "blue")
~~~

And this view function renders the input field:

~~~klipse
(defn color-input
  []
  [:div.color-input
   "Time color: "
   [:input {:type "text"
            :value @(rf/subscribe [:time-color])        ;; subscribe
            :on-change #(rf/dispatch [:time-color-change (-> % .-target .-value)])}]])  ;; <---
~~~
			
Notice how it does BOTH a `subscribe` to obtain the current value **AND** a `dispatch` to say when it has changed.

It is very common for view functions to run event-dispatching functions. The user's interaction with the UI is usually the largest source of events.

We can render the `color-input` as any other reagent component:

~~~reagent
[color-input]
~~~


And then a view function to bring the others together, which contains no subscriptions or dispatching of its own:

~~~klipse
(defn ui
  []
  [:div.clock
   [:h1.clock "Hello world, it is now"]
   [clock]
   [color-input]])
~~~

## Kick Starting The App

Below, `run` is called to kick off the application once the HTML page has loaded.

It has two tasks:

1. Load the initial application state
2. Load the GUI by "mounting" the root-level function in the hierarchy of view functions -- in our case, `ui` -- onto an existing DOM element.

~~~klipse
(defn run
  []
  (rf/dispatch-sync [:initialize])  ;; puts a value into application state
  (reagent.dom/render [ui]   ;; mount the application's ui into '<div id="app" />'
                  (js/document.getElementById "app")))
~~~

After `run` is called, the app passively waits for events. Nothing happens without an event.

~~~klipse
(run)
~~~

The `run` function renders the app in the DOM element whose id is `app`: this DOM element is located at the top of the page. This is the element we used to show how the app looks like at the begining of the article.


Because I know you are too lazy to scroll up till the begining of the article, I decided to render the whole app as a reagent element, just here:

~~~reagent
[ui]
~~~

When it comes to establishing initial application state, you'll notice the use of `dispatch-sync`, rather than `dispatch`. This is a simplifying cheat which ensures that a correct structure exists in `app-db` before any subscriptions or event handlers run.


I hope you enjoyed this interactive tutorial and got a better understanding about how to write a re-frame application.

But if you really want to become a re-frame master, take a [video course on re-frame](https://www.learnreframe.com/?ref=pjksj){:target="_blank"}.

If you liked this article, you might also like my book...

<style>
.my-container {
border: solid 1px blue;
padding: 20px;
}

div.clock, h1.clock, input {
    font-family: HelveticaNeue, Helvetica;
    color: #777;
}

.example-clock {
    font-size: 90px;
    line-height: 1.2em;
    font-family: HelveticaNeue-UltraLight, Helvetica;
}

@media (max-width: 768px) {
    .example-clock {
        font-size: 64px;
    }
}

.color-input, .color-input input {
    font-size: 18px;
    line-height: 1.5em;
}
</style>




 

