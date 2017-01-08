---
layout: post
title:  "Interactive reagent snippets"
description:  "Interactive reagent snippets in klipse. react clojurescript. minimal. fast"
date:   2016-12-31 19:22:44 +0200
categories: reagent
thumbnail: assets/klipse.png
guid: "64CBD559-2C8A-4621-9758-3629BE75680C"
author: "@viebel"
---


[Reagent](https://github.com/reagent-project/reagent) provides a minimalistic interface between ClojureScript and React. It allows you to define efficient React components using nothing but plain ClojureScript functions and data, that describe your UI using a [Hiccup](https://github.com/weavejester/hiccup)-like syntax.

In this article, we are going to show you how you can write a blog post with interactive reagent component inside a blog post using the [klipse plugin](https://github.com/viebel/klipse). 

In this context, **interactive** means that the reader of the blog post can edit the code of the component.

It's super simple:

0. You add the klipse javascript tag to your blog posts as explained [here](https://github.com/viebel/klipse).
1. You require `reagent.core` in a `clojure` snippet.
2. You define and render your component in a `clojure` snippet.

 
![minority](/assets/minority.jpg)

# Hello World!

Let's start with a **Hello World!** reagent component:

First, we require `reagent.core` - in a `clojure` snippet:

(Please be a bit patient, it takes some time to load both `react.js` and `reagent` code into this web page...)

~~~klipse
(require '[reagent.core :as r])
~~~

Then, we define and render our component - in a `reagent` snippet:

~~~reagent
(defn hello [name]
[:p (str "Hello " name "!")])

[hello "Klipse"]
~~~


So easy. Right?

Go ahead, enjoy the interactivity: modify the code of the component and add a `space` in the `reagent` snippet to re-render the component.

Now, let's see how it works...

# Under the hood

The code snippet with `[hello "World"]` is not a regular `clojure` snippet: it's a `reagent` snippet. Klipse wraps the last expression of the snippet in a call to `reagent.core/render-component` and passes to it the dom element that is right after the code snippet (a.k.a the klipsecontainer).

Nothing magic, we can do it manually using a regular `clojure` snippet like this:

~~~klipse
(reagent.core/render-component [hello "World!"] js/klipse-container)
~~~

Each klipse snippets has a dom sibling associated to it and it is accessible by `js/klipse-container`.


And if your component doesn't require any argument, you even don't need to wrap into into a vector - klipse will wrap it into a vector for you - this nice idea was emitted and implemented by [Timothy Pratley](https://twitter.com/timothypratley):

~~~reagent
(defn tim []
  [:span "Timothy"])

(defn hello-there []
    [:p "Thanks " [tim]])
~~~

Now, for the fun, let's take a look at a more interesting `reagent` component...

# A more interesting example: A BMI calculator

Here is a nice example from [Reagent Website](http://reagent-project.github.io/) that shows how to implement a BMI calculator with `reagent`:

~~~reagent
(def bmi-data (r/atom {:height 180 :weight 80}))

(defn calc-bmi []
  (let [{:keys [height weight bmi] :as data} @bmi-data
        h (/ height 100)]
    (if (nil? bmi)
      (assoc data :bmi (/ weight (* h h)))
      (assoc data :weight (* bmi h h)))))

(defn slider [param value min max]
  [:input {:type "range" :value value :min min :max max
           :style {:width "100%"}
           :on-change (fn [e]
                        (swap! bmi-data assoc param (.-target.value e))
                        (when (not= param :bmi)
                          (swap! bmi-data assoc :bmi nil)))}])

(defn bmi-component []
  (let [{:keys [weight height bmi]} (calc-bmi)
        [color diagnose] (cond
                          (< bmi 18.5) ["orange" "underweight"]
                          (< bmi 25) ["inherit" "normal"]
                          (< bmi 30) ["orange" "overweight"]
                          :else ["red" "obese"])]
    [:div
     [:h3 "BMI calculator"]
     [:div
      "Height: " (int height) "cm"
      [slider :height height 100 220]]
     [:div
      "Weight: " (int weight) "kg"
      [slider :weight weight 30 150]]
     [:div
      "BMI: " (int bmi) " "
      [:span {:style {:color color}} diagnose]
      [slider :bmi bmi 10 50]]]))
~~~


# What else now?

Now, I'm expecting all the cool guys of the clojurecript community to write incredible blog posts with interactive reagent code snippets...

If you haven't done it already, please give a github star to [reagent](https://github.com/reagent-project/reagent) and [klipse](https://github.com/viebel/klipse).


# A final note

It is also possible to evaluate `reagent` code snippets in the browser with the great [CljsFiddle](http://escherize.com/cljsfiddle/) by [@escherize](https://twitter.com/escherize).


<style>

.klipse-container:not(:empty):before {
    content: "**** Rendered Component ****";
    font-weight: bold;
    font-family: monospace;
}

</style>
