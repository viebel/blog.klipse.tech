---
layout: post
title:  What is Category Theory?
description:  What is Category Theory?
date:   2019-09-10 06:11:22 +0200
categories: clojure
thumbnail: assets/klipse.png
guid: 14EF7226-4DA3-4617-91FF-2B2AD1EAD68E
author: Yehonathan Sharvit
hidden: true
draft: true
tags: [theory]
---


**Yehonathan (The Novice)**:
Hello Mr. Peschanski. Coud you briefly explain what is category theory and why it might be interesting for me? See, I am so curious, there are so many topics I find interesting.

**M. Peschanski (The Expert)**: 
First, I suggest you call me **Senpai** and I will then call you **Kohai** rather than **The Novice** (or Yehonathan for that matter).
Briefly, a Kohai may not be a novice and a Senpai is just a little bit more knowledgeable about the concerned topic, and also maybe a little bit older.

**Kohai**:
I like those Japanese terms that convey deep ideas. So, Senpai would you please let me know why should I care about category theory more than any other interesting topic?

**Senpai**:
I have suggested category theory because it is a very abstract area of mathematics, and for good or bad reasons it has some good or bad impact on programming. Since our common concern is programming (especially programming in Clojure, sorry for the javascript or Python crowd) I find it a good topic. But I have to be a little bit egoistic here. I am not a fan of category theory, and to understand precisely why or alternatively to change my point of view, I think I have to learn more about it, to try to make it more concrete... 
This is important, I am not an expert in the field, knowledgeable is all I am.  So in a way, I ask you to help me Kohai. But the most important bit is that I really think with this topic we can share our understanding through a lot of programming and a bit of abstract mathematics, rather than the converse.

Instead of telling you precisely what is category theory (I simply cannot), I have to start with explaining what is a category. And for this I need a programming environment.

Kohai, here's now my question for you:
- do you know how we may continue our correspondence in a literate programming environment?
I know you are the developer of [Klipse](https://github.com/viebel/klipse), so you are the most knowledgeable here!

**Kohai**: 
I am honoured Senpai, to be asked a question by you. 
Here is my gift of interactivity fo you:

```klipse
(str "Hello " "Senpai!")
```

**Senpai**:
This is great gift Kohai, I shall use it with care and dedication.
So...

> What is a **Category**?

Well, I shall begin to answer when there is some support for latex ...

**Kohai**: Are you seeking, Senpai, to write simple lambda terms with their greek symbol? Simple terms like \\(\lambda x.x\\)? I hope that you are not willing to confuse my mind too much with complicated math concepts like Riemann's Zeta function?

$$\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}$$

**Senpai**: Oh oh, I like these... but I will try not to abuse them. Well let's begin. First, Kohai, I need to start with a graph. The graph must be relatively small (5, 6 vertices), it must be directed also (edges are arrows). Well, let me explain what I need by code.

```klipse
(def my-graph  {:a #{:b :d}
                :b #{:e}
                :c #{:b}
                :d #{:e}
                :e #{}})
```

Do you see what I mean? It may be another graph, but that's a good starting point.

**Kohai**: My mind *sees*  what you mean, dear Senpai. But, my eyes need to *visualize* the graph. With Klipse, it's quite simple to *visualize* a graph, assuming that you allow me to use the popular JSON format, instead of the powerful - but not so popular - EDN format.

```eval-js
   var defaultGraphOptions = {
  style: [ 
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        "label": "data(label)"
      }
    }
  ],

  layout: {
    name: 'circle'
  },
  userZoomingEnabled: false,
  userPanningEnabled: false,
  boxSelectionEnabled: false,
};
```

```klipse
 (def ^:dynamic *default-graph-options* js/defaultGraphOptions)
```
 
```eval-js
var cy = cytoscape({
  ...cljs.user._STAR_default_graph_options_STAR_,
  container: document.getElementById('graph-1'), 
  elements: [ 
    { 
      data: { id: 'a' }
    },
    { 
      data: { id: 'b' }
    },
    { 
      data: { id: 'c' }
    },
    { 
      data: { id: 'd' }
    },
    { 
      data: { id: 'e' }
    },
    { 
      data: { id: 'ab', source: 'a', target: 'b' }
    },
    { 
      data: { id: 'ad', source: 'a', target: 'd' }
    },
    {
      data: { id: 'be', source: 'b', target: 'e' }
    },
    { 
      data: { id: 'cb', source: 'c', target: 'b' }
    },
    {
      data: { id: 'de', source: 'd', target: 'e' }
    }
  ],
})
```

<div id="graph-1" style="width: 100%; height: 200px; background-color: white;">
</div>

**Senpai**: that's my graph for sure ... but Kohai, what if I want to generate of transform graphs using Clojure programs? Through programs we shall see the light, Kohai!

**Kohai**: Through invisible functions, we create the light, Senpai. In a invisible html element just below, I have created a Clojure function named `cytoscape-clj` that receives a vector of elements and the id of container where to render the graph.

<pre style="visibility: hidden; height: 0px;">
<code class="language-klipse" >
(defn cytoscape-clj [elements container-id]
  (js/cytoscape
   (clj->js (merge (js->clj *default-graph-options*)
                   {:container (js/document.getElementById container-id)
                    :elements elements})))
  nil)
 </code>
 </pre>
 
 ```klipse
 (def elements [{:data {:id "a"}}
               {:data {:id "b"}}
               {:data {:id "c"}}
               {:data {:id "d"}}
               {:data {:id "e"}}
               {:data {:id "ab" :source "a" :target "b"}}
               {:data {:id "ad" :source "a" :target "d"}}
               {:data {:id "be" :source "b" :target "e"}}
               {:data {:id "cb" :source "c" :target "b"}}
               {:data {:id "de" :source "d" :target "e"}}])
 (cytoscape-clj elements "graph-2")
 ```
 
 <div id="graph-2" style="width: 100%; height: 200px; background-color: white;">
</div>
 
Now, dear Senpai, enlightened by the invisible `cytoscape-clj` function, you are free to manipulate the elements of the graph as you wish. 
 
 ```klipse
 (cytoscape-clj (take 6 elements) "graph-3")
 ```
 
<div id="graph-3" style="width: 100%; height: 200px; background-color: white;">
</div>
 
Will you agree at this point, Senpai, to start sharing with a humble creature like me the secrets of the Category Theory **without** any further introduction?

**Senpai**: How neat! I like this very much... Let me see... It shouldn't be too hard to write a Clojure function that converts the adjacency matrix of a graph to its cytoscape elements. After all, it's all about data manipultion.

```klipse
(defn graph-to-elements [g]
  (let [verts (mapv (fn [n] {:data {:id (name n)}}) (keys g))]
    (reduce (fn [els [src tgts]]
              (into els
                    (map (fn [tgt]
                           {:data {:id (str (name src) (name tgt))
                                   :source (name src)
                                   :target (name tgt)}})
                         tgts)))
            verts g)))
            
(defn showgraph [g id]
  (cytoscape-clj (graph-to-elements g) id))
```

```klipse
(showgraph my-graph "my-graph")
```

<div id="my-graph" style="width: 100%; height: 200px; background-color: white;">
</div>

Excellent, now I have what I wanted (Klipse is so cool!)... So let's take our graph, and can you Kohai:

 1. For each vertex, add a "self-loop", i.e. a directed edge with source and target the very same vertex?
 2. If e.g. `a` goes to `b` and `b` goes to `c`, then add a directed edge from `a` to `c`, and do that "everywhere possible" in the graph? 

That's two **exercises** . If you find an exercise hard, I'll try to give you hints, and ultimately I'll give a solution (if I have one). If you find an exercise boring, please tell me, I'll wipe it out! 

**Kohai**: I am so honoured by such a compliment coming from you, respected Senpai, regarding my work on Klipse.

I don't understand the connection between those exercises and Category Theory, but I will put my impatience aside for now and behave as a disciplined Kohai and reaffirm my trust on your way of teaching, respected Senpai, by working on those exercises.

The first exercise looks to me pretty easy, when we represent a graph through its ajacency matrix:

```klipse
my-graph
```

In order to add a self-loop to a vertex, I am going to add the vertex itself to its set of neighbours. To code it in Clojure, I  will map each  `neighbours` set  to `(conj  neighbours vertex)`. I have a Clojure library of my own, named [gadjett](http://viebel.github.io/gadjett/index.html) that provides a util function  [map-object-with-key](http://viebel.github.io/gadjett/gadjett.collections.html#var-map-object-kv) that makes this kind of manipulations straightforward:


```klipse
(require '[gadjett.collections :as coll])

(defn add-self-loops [graph]
  (coll/map-object-with-key 
   (fn [vertex neighbours]
     (conj neighbours vertex))
   graph))
```

And now, with the help of the `show-graph` function that you kindly wrote, respected Senpai, I can visually confirm thay my `add-self-loop` function works as required:

```klipse
(showgraph 
 (add-self-loops my-graph)
 "graph-with-self-loops")
```


<div id="graph-with-self-loops" style="width: 100%; height: 200px; background-color: white;">
</div>

I am satisfied with my success on the first exercise. 

May I ask a hint for solving the second exercise, respected Senpai?


**Senpai**: Using the standard library, I would write something like the following:

```klipse
(into {} (map (fn [[src tgts]] [src (conj tgts src)]) my-graph))
```

But that's a bit of a mouthful and I like that you show me tricks from you own toolbox Kohai, please do not stop at all. I think there is a nice alternative name for your function: `map-kv`  (in the spirit of `reduce-kv`).

And now, Kohai, here is my hint for you:

```klipse
(showgraph (update my-graph :a #(conj % :e)) "my-graph-hint")
```

<div id="my-graph-hint" style="width: 100%; height: 200px; background-color: white;">
</div>

**Kohai**: From now on, I shall use `map-kv`, as I learned during my initiation that proper naming is essential to good programming. 
I cannot find a way to use your hint, Senpai, but after some new thinking I come with a possible solution to the second exercise. My idea is to map each set of neighbours to the union of:
1. itself
2. the neighbours of each vertex in the set 

using again `map-kv`:

```klipse
(require '[clojure.set :refer [union]])

(def map-kv coll/map-object-with-key)
(defn add-paths [graph]
  (map-kv
   (fn [v neighbours]
      (apply union #{v} neighbours (map graph neighbours)))
   graph)) 
```

```klipse
(showgraph (add-paths my-graph) "my-graph-paths")
```

<div id="my-graph-paths" style="width: 100%; height: 200px; background-color: white;">
</div>

My code seems to work, but it looks to me a bit complicated. Is there a way to simplify the code, respected Senpai?

**Senpai**: The thing is, you're not quite there but this is my fault, my example was a little bit insufficent.  Let me change it slightly:

```klipse
(def my-graph-v2  {:a #{:b }
                   :b #{:c :e}
                   :c #{:b :d}
                   :d #{:e}
                   :e #{}})
```

```klipse
(showgraph my-graph-v2 "my-graph-v2")
```

<div id="my-graph-v2" style="width: 100%; height: 200px; background-color: white;">
</div>


```klipse
(showgraph (add-paths my-graph-v2) "my-graph-v2-paths")
```

<div id="my-graph-v2-paths" style="width: 100%; height: 200px; background-color: white;">
</div>

The self-loop are not wrong, but I would prefer to avoid them since it is redundant with the first part of the exercise. But there is one edge missing, can you find it? I give you two hints: 
1. start from `a`
2. think about one of the most important and beautiful things in this  world: **recursion**.


**Kohai**: I can easily get rid of the self-loops by changing a bit the `add-paths` function:

```klipse
(require '[clojure.set :refer [difference]])

(defn add-simple-paths [graph]
  (map-kv
   (fn [v neighbours]
     (union neighbours 
            (difference 
             (apply union (map graph neighbours))
             #{v})))
   graph)) 
```

```klipse
(showgraph (add-simple-paths my-graph-v2) "my-graph-v2-simple-paths")
```

<div id="my-graph-v2-simple-paths" style="width: 100%; height: 200px; background-color: white;">
</div>

The hints you gave me, Senpai, make me think that `a` should also be connected to `d` because, in the original graph there exists a path \\(a\rightarrow b \rightarrow c \rightarrow d\\). However my `add-simple-paths` function only adds paths with 2 edges, like \\(a\rightarrow b \rightarrow c\\). 
    
Hmm...
    
My function should be able to create length of unlimited paths. I am so scared to lose myself in an infinite maze with this kind of recursive node traversal.

    
![maze](https://media.mnn.com/assets/images/2014/06/snakes.jpg)
    

The tone of your voice is so quiet, respected Senpai. It gives me the confidence and the courage to take some distance from my fears and to look for a simple solution.
    
*The Kohai takes a deep breath and enters in a meditation state for about 30 minutes, as he was taught by his Senpai in a previous lesson.*
    
*After 30 minutes, the kohai gently opens his eyes and goes back to his computer...*
    
I need to find a way to *stabilize* `add-simple-paths` in the sense that when I call it again, the graph will stay unchanged. In other words, I need to write a function `add-paths-recursively` such that `(add-paths-recursively (add-paths-recursively g))` is the same as `(add-paths-recursively g)`. 

I think I can achieve this *stability* by calling `add-simple-paths` in a loop until the graph of the next iteration is the same as the graph of the current iteration:

```klipse
(defn add-paths-recursively [g]
  (loop [graph g]
    (let [next-graph (add-simple-paths graph)]
      (if (= next-graph graph)
        graph
        (recur next-graph)))))
```

I want to check my assertion:

```klipse
(= (add-paths-recursively (add-paths-recursively my-graph-v2))
   (add-paths-recursively my-graph-v2))
```

Yeah! My assertion is verified. And, visually I see that the edge connecting `a` to `d` has been added:

```klipse
(showgraph (add-paths-recursively my-graph-v2) "my-graph-v2-paths-fixed")
```

<div id="my-graph-v2-paths-fixed" style="width: 100%; height: 200px; background-color: white;">
</div>

Is that what you had in mind, respected Senpai?

**Senpai**: I think it is... But it will be you telling me that. Because it is time, Kohai, for a definition.

> **Definition**: a **category** \\(C\\) is:
> 
> - a collection \\(\mathcal{O}\\) of **objects**
> - a collection \\(\mathcal{A}\\) of **arrows** (a.k.a. **morphisms**) with each arrow \\(f\\) going from a **source** object \\(a\\) to a **target** object \\(b\\), and denoted by \\(f:a\rightarrow b\\)
> 
> Moreover:
> 
> - for any object \\(a\\) there is an arrow \\(Id_a:a\rightarrow a\\) called the **identity** of \\(a\\)
> - if there is an arrow \\(f:a\rightarrow b\\) and an arrow \\(g:b \rightarrow c\\) then there exists an arrow \\(g \circ f:a\rightarrow c\\) called the **composition** of \\(f\\) and \\(g\\), or more precisely of \\(f\\) *then* \\(g\\)
> 
> While ensuring that the following **category laws** hold:
> 
> 1. the **identitity law**: if \\(f:a\rightarrow b\\) is an arrow then \\(f \circ Id_a = f\\) (right identity) and \\(Id_b \circ f = f\\) (left identity)
> 2. the **associativity law**: if \\(f:a\rightarrow b\\), \\(g:b\rightarrow c\\) and \\(h:c\rightarrow d\\) then \\(h\circ\(g \circ f\) = \(h\circ g\) \circ f\\)
> 

Sometimes, Kohai, people will tell you - with perhaps a slightly condescending tone - that the definition above is *so* simple, and that such simplicity is the reason why category theory is so beautiful.
But in my opinion it is *not* the case, the definition above is not simple at all, even when writing it I was afraid of forgetting something. Also I wonder if things are well articulated. As you will see, later on, there are also many hidden assumptions.

So you might wonder Kohai if a category is not as beautiful as many "categorists" think, is it still a concept worthy of our interest? I would think that "maybe it is", which is enough an argument for our journey to continue.


And now I have a new question for you:

> If I take a directed graph such as `my-graph`, do you think it is a category?


**Kohai**: In order to give you a proper answer, Senpai, I need to look again at `my-graph`:

```klipse
(showgraph my-graph "my-graph-again")
```

<div id="my-graph-again" style="width: 100%; height: 200px; background-color: white;">
</div>

Well, it could be a category if we apply the following "translation":
1. The Objects are the vertices 
2. The Arrows are the edges
3. The identity is the self loop
4. The composition of arrows is similar to the second exercise that you gave me

I would say that a general directed graph is not a category but when we apply `add-paths-recursively` to a graph, it becomes a category.
However, I am not quite sure that this is correct as I don't know how to give meaning to equality of arrows in order to check the category laws:

> 1. the **identitity law**: if \\(f:a\rightarrow b\\) is an arrow then \\(f \circ Id_a = f\\) (right identity) and \\(Id_b \circ f = f\\) (left identity)
> 2. the **associativity law**: if \\(f:a\rightarrow b\\), \\(g:b\rightarrow c\\) and \\(h:c\rightarrow d\\) then \\(h\circ\(g \circ f\) = \(h\circ g\) \circ f\\)

**Senpai**: First, yes you are right, a graph together with *self-loops* (as identities) and *graph-paths* (as compositions) is a good candidate for a category. Before addressing the *law* question, I will redefine the notion of a category in Clojure. We will only define the `CatFin` protocol for **finite categories**. A category is finite if the collections of objects and arrows are finite sets.

First, for me `CatFin` is an abstract concept, and Clojure *protocols* are a good language feature to give an abstraction a proper name.

```klipse
(defprotocol CatFin
  "A protocol for finite categories."
  (objects [cat] "the finite set of objects of `cat`")
  (arrows [cat] "the finite set of arrows of `cat`"))
```

Moreover, I think we can use anything as an object, although I will only use *keywords*, such as `:a`, `:b`, etc. But I need to fix the representation of an arrow somehow and I propose we simply take a pair of two objects, e.g. `[:a :b]`.

Then I can define what is an identity arrow for any `CatFin`:

```klipse
(defn ident 
  "Identity arrow for `obj`."
  [obj]
  [obj obj])
  
(ident :a)
```

And I can also define a composition arrow:

```klipse
(defn compose
  "Composition arrow of `arr1` and `arr2` in a [[CatFin]]."
  [arr2 arr1]
  (let [[src2 tgt2] arr2
        [src1 tgt1] arr1]
    (when-not (= tgt1 src2)
      (throw (ex-info "Arrows not composable" {:arrow1 arr1
                                               :arrow2 arr2
                                               :mismatch [tgt1 src2]})))
    [src1 tgt2]))
    
(compose [:e :f] [:d :e]) 
```

```klipse
(compose [:f :e] [:d :e])
```

Let me now "prove" the category laws:

```klipse
;; left identity
(let [f [:x 'obj]]
  (= (compose (ident 'obj) f) f))
```

```klipse
;; right identity
(let [g ['obj :y]]
  (= (compose g (ident 'obj)) g))
```

```klipse
;; Associativity law
(let [f ['x 'y] g ['y 'z] h ['z 'u]]
  (= (compose (compose h g) f)
     (compose h (compose g f))))
```

Are you satisfied Kohai with these?

**Kohai**: I am bit confused by the `'obj` symbol: Why are you sometimes using `:x` and `:y` for a general object and sometimes `'obj`.

**Senpai**: Yes, yes, it's confusing... Since I took *keywords* as objets, I wanted to have a way to name an *arbitrary object*. So where I use a quoted symbol, you should imagine that it could be *any object*. This, way, the laws become universal, in a way. If I replace `'obj` by any keyword the law still holds. So `:x` is a specific object named `x`, while `'x` is an arbitrary object. I hope it's less confusing now...

**Kohai**: I see, this is an important clarification, Senpai. 
But in the "proof" of the left-identity law, I would expect both objects to be *arbitrary*, and to write the proof like this:

```klipse
;; left identity
(let [f ['x 'y]]
  (= (compose (ident 'y) f) f))
```

**Senpai**:  Of course, you're right! *Errare humanum est*.
So let me correct myself with right identity:

```klipse
;; right identity (fixed)
(let [g ['x 'y]]
  (= (compose g (ident 'x)) g))
```

**Kohai**: Also, the "right-to-left" ordering is confusing me.

**Senpai**: I use the "right-to-left" ordering because it mimics the way function composition works in Clojure. Let me give you an example.

```klipse
(letfn [(f [x] (= x :a))
        (g [y] (if y :b :c))
        (h [z] (= z :b))]
  (= (h (g (f :a)))
     ((comp h g f) :a)))
```

It is of course the same in mathematics, we would write:

$$h \circ g \circ f (x) = h(g(f(x)))$$

Very often, arrows will be Clojure(script) functions so it is good if we have a similar way of writing compositions, i.e. right-to-left. But I agree it can be a little bit confusing. This is why I think often we prefer the following:

```klipse
(letfn [(f [x] (= x :a))
        (g [y] (if y :b :c))
        (h [z] (= z :b))]
  (-> :a (f) (g) (h)))
```

**Kohai**: Indeed, the notation with thread macro is much more intuitive to me...

**Senpai**: Another important remark is that composition is "self-verifying". It generates an exception if the two arrows of `(compose arr2 arr1)` are not composable. The condition we check is that the target of `arr1` (the first function to apply) is *equal* to the source of `arr2` (the second function to apply).

This is in fact a very important "hidden assumption" of the definition of a category: we need objets to be comparable for equality. Luckily Clojure(script) is a "pure-functional-first" programming language, so we can compare so many things for equality. By the way, in your `add-paths-recursively` you compared whole graphs for equality (although a simple form of equality, not *graph isomorphism* and we'll go back to this later on). But in some categories It can be quite a strong assumption to have an equality for objets. So please Kohai remember this: the notion of equality of objects (and thus of arrows) is *fundamental* although it is relatively hidden in the definition.

> **Equality** is **fundamental**

Let me add two useful utility functions. I will not explain nor comment them but they will be used, and you'll know why.

```klipse
(defn catfin-all-arrows-from [cat obj]
  (filter (fn [[from to]] (= from obj)) (arrows cat)))
```

```klipse
(defn catfin-graph [cat]
  (reduce (fn [g obj] 
            (assoc g obj 
                   (into #{}
                         (map second (catfin-all-arrows-from cat obj)))))
          {} (objects cat)))
```

Now Kohai, I have yet an exercise for you.

```klipse
(defrecord GraphCat [graph]
  CatFin
  ;; <TBD>
)
```

**Question**: Can you complete the definition explaining that any `graph` (such as `my-graph`) can be seen as a category?

**Kohai**: I can try...
Let me look again at `my-graph` data representation:

```klipse
my-graph
```

The objects are the keys of the map:

```klipse
(keys my-graph)
```

The arrows of `my-graph` are the `[vertex neighbour]` pairs of the graph obtained by adding self-loops and paths through `add-paths-recursively`. In order to list all the arrows of `(add-paths-recursively my-graph)`, I will use *list comprehension*. Fortunately, in Clojure, the `for` macro - that provides list comprehension - supports maps:


```klipse
 (for [[vertex neighbours] (add-paths-recursively my-graph)
                neighbour neighbours]
            [vertex neighbour])
```

Here is my suggestion for `GraphCat` record implementation:

```klipse
(defrecord GraphCat [graph]
  CatFin
  (objects [cat] 
           "get the finite set of objects of `cat`"
           (keys graph))
  (arrows [cat]
          "get the finite set of arrows of `cat`"
          (for [[vertex neighbours] (add-paths-recursively graph)
                neighbour neighbours]
            [vertex neighbour])))
```

Please tell me, respected Senpai, if I have answered correctly to your question. 

**Senpai**: Let me check ...

```klipse
(showgraph (catfin-graph (->GraphCat my-graph)) "my-graph-catfin")
```

<div id="my-graph-catfin" style="width: 100%; height: 200px; background-color: white;">
</div>

Well, dear Kohai, I think the self-loops are missing... 

**Kohai**: Well, that is easy to add self-loops, using the `add-self-loops`, I wrote earlier:

```klipse
(defrecord GraphCat2 [graph]
  CatFin
  (objects [cat] 
           "get the finite set of objects of `cat`"
           (keys graph))
  (arrows [cat]
          "get the finite set of arrows of `cat`"
          (for [[vertex neighbours] (add-paths-recursively (add-self-loops graph))
                neighbour neighbours]
            [vertex neighbour])))
```

```klipse
(showgraph (catfin-graph (->GraphCat2 my-graph)) "my-graph-catfin-2")
```

<div id="my-graph-catfin-2" style="width: 100%; height: 200px; background-color: white;">
</div>

**Senpai**: Well done, Kohai!
I know that self-loops do not look like really necessary, but you'll see they play an important role. In particular, each such identity arrow helps to ... identify a specific object, and thus we can forget a little bit about the objects by focusing on the arrows only.

**Kohai**: It is similar to focusing on the relationships between people and forget about the ego of each one.

*(Senpai's face began to light up)*

**Senpai**: There's something deep about what you just said ... Well, at least we have the identity arrows so that oneself is not totally lost. By the way, do you understand now why I defined `catfin-graph`? Any (directed) graph is a finite category if you add the self-loops and "all-recursive paths" (we'll find a better name soon). But the converse is also true, any finite category can be seen as a graph.  Do you know how such a correspondance is named in maths?

**Kohai**: An isomorphism?

**Senpai**: That's exactly that! I think there is an interesting isomorphism to explore between:

 - a finite category, seen as a graph:

```klipse
(showgraph (catfin-graph (->GraphCat2 my-graph))
           "my-graph-catfin-again")
```

<div id="my-graph-catfin-again" style="width: 100%; height: 200px; background-color: white;">
</div>

- and the original graph:

```klipse
(showgraph my-graph "my-graph-again-again")
```

<div id="my-graph-again-again" style="width: 100%; height: 200px; background-color: white;">
</div>

If the first graph is *the category* itself (represented as a graph), I would like to call the second graph *the shape* of the category. This is not standard terminology, but I like it very much.

**Kohai**: When you say *the shape* of a finite category `C`, do you mean a graph `G` with no self loops and no recursive paths such that `(->GraphCat2 my-graph)` equals `C`?

**Senpai**: Yes Kohai, what I call a shape is without self loops or recursive paths, exactly!

**Kohai**: I was thinking about another isomorphism.

**Senpai**: Which one?

**Kohai**: A correspondance between a finite category and the set of all graphs that have the same closure. By closure, I mean the addition of self-loops and recursive paths. But I am not even sure that this correspondance is  indeed an isomorphism. Can you please tell me, resepected Senpai, what do you think of this correspondance?

**Senpai**: Yes Kohai, your correspondance is in fact the generalization of the one I was starting from. Each time you add a "recursive path", in a way you stay within the same "class" of graphs with the same "closure". And you can always go "forward", adding new paths, or "backward" by removing them. So you have an isomorphism at each step, however the two ends are the most interesting:

- the "most backward" step is when you don't have any self-loop or recursive path, what I called a shape
- the "most forward" step is when you have *all* self-loops and recursive paths, which is the finite category

By the way, you used a very important word to explain *exactly* the phenomenon: *closure*. We will reuse the word very soon Kohai.

Are you satisfied with my answer, Kohai?

**Kohai**: I need to think more about it...
But, while listening to you, respected Senpai, I asked myself whether the shape of a graph was unique. If the shape is not unique, then the correspondance between shapes and closed graphs is not an isomorphism. Are we going to *prove* that the shape is unique or are we going to *assume* it for the moment?

**Senpai**: I would prefer to talk about "the shape of a finite category" (which is a graph). I think Kohai that the shape indeed is unique, do you have an example of two shapes describing the *same* finite cateogry?
At least if there is no cycle in the shape, I am *sure* it's unique.

**Kohai**: I don't have such an example. 
What makes you be *sure* that the shape is unique?

**Senpai**: I am sure it is unique if the graph has no cycle because it is then a mathematical object I study a lot in my research work: a *partial order*. But it is a little bit too soon to discuss this, we got distracted...

(A few moments later ...)

**Senpai**: Probably you anticipated this but I have yet another exercise for you. You know already how to go from a *shape* to a finite category, but can you do the converse? From the first graph above, I would like to obtain the second one below. In fact, I need two distinct things:

  1. a way to obtain the shape of a finite category
  2. a way to check that it is *indeed* a shape

For testing your solution, let me give you a more complex (and interesting!) example.

```klipse
(def my-sys
  {:init #{:gen :step-1 :fork}
   :gen #{:yield-1}
   :yield-1 #{:yield-2 :step-3}
   :yield-2 #{:end}
   :step-1 #{:load :step-2}
   :load #{:xform}
   :xform #{:step-4}
   :step-2 #{:step-3}
   :step-3 #{:step-4}
   :step-4 #{:end}
   :fork #{:comp-1 :comp-2-1}
   :comp-1 #{:join}
   :comp-2-1 #{:comp-2-2}
   :comp-2-2 #{:join}
   :join #{:end}
   :end #{}})
   
(showgraph my-sys "my-sys")
```

<div id="my-sys" style="width: 100%; height: 400px; background-color: white;">
</div>

Please trust me Kohai, this *is* a shape.

**Remark**: the layout of the graph is not optimal... I would rather use the *breadthfirst* layout, cf. http://js.cytoscape.org/#layouts/breadthfirst
Do you know how we could do that with your almighty Klipse?

**Kohai**: Let me create a new function that will allow us to control the cytoscape graph options:

```klipse
(defn showgraph-with-options [g id options]
  (binding [*default-graph-options* (clj->js (merge (js->clj *default-graph-options*) options))]
  (cytoscape-clj (graph-to-elements g) id)))
```

Now, we can visualize the graph you defined with *breadthfirst* layout:

```klipse
(showgraph-with-options my-sys "my-sys-breadthfirst"
                        {:layout {:name "breadthfirst"
                                  :directed true}})
```

<div id="my-sys-breadthfirst" style="width: 100%; height: 400px; background-color: white;">
</div>

Does it address your needs, respected Senpai?

**Senpai**: Yes! I think it's much clearer what is the intent of `my-sys`, don't you think? You inspire me a lot of respect Kohai! Are you ready for our little exercise?

**Kohai**: Indeed your intent is much clearer now.
I am ready for our exercise. 
Let me start by reflecting upon how one could check that a graph is *a shape*. I have to check two things:
1. There are no self-loops
2. There are no recursive paths

Detecting the absence of self loops seems easy to me as I only need to check that for every node, the node is not a member of the neighbours set:

```klipse
(defn no-self-loops? [graph]
  (every? (fn [[node neighbours]]
                   (not (contains? neighbours node)))
                 graph))
```

But I have no idea how to check that there are no recursive paths. Would you agree to give me a hint, respected Senpai?

**Senpai**: I agree, the exercise is not so easy. If we don't mind too much about *algorithm complexity*, we can maybe find a simple solution.

As a starting point, I would say that an edge `[:a :b]` is "recursive" (perhaps I would say "redundant") in a graph `g` if I can still go from `:a` to `:b` in the graph with this edge removed. The following utility function might prove useful:

```klipse
(defn reachables
  "Reachable vertices from `v` in graph `g`"
  ([g v] (reachables g #{} v))
  ([g visited v]
   (let [targets (get g v #{})]
     (reduce union 
             targets 
             (map #(reachables g (conj visited v) %)
                  (difference targets visited))))))
```

Let's see with our example graph.

```klipse
(def my-catfin-graph (catfin-graph (->GraphCat2 my-graph)))
(showgraph my-catfin-graph "my-catfin-graph")
```

<div id="my-catfin-graph" style="width: 100%; height: 200px; background-color: white;">
</div>

For example, `:e` is reachable from `:a`:

```klipse
(reachables my-catfin-graph :a)
```

If I remove the edge `[:a :e]`, it seems `:e` is still reachable

```klipse
(reachables (update my-catfin-graph :a #(disj % :e)) :a)
```

Hence `[:a :e]` is a recursive/redundant edge, because for example I can follow the path composed of the two edges `[:a :b]` and `[:b :e]`.

If we compare with the initial graph, `:e` is reachable from `:a` of course.

```klipse
(reachables my-graph :a)
```

But there is no such edge `[:a :e]`.

```klipse
(contains? (my-graph :a) :e)
```

... no redundancy!

I think it is a good time to state the following.

> **Reachability** is a fundamental property of directed graphs. 

Do you agree with the following?

> If a vertex `:e` is reachable from a vertex `:a` in a shape, then it  will also be reachable in the graph with self-loops and recursive paths.

**Kohai**: I agree with this claim but I think that the other direction of the claim is more interesting:

> If a vertex `:e` is reachable from a vertex `:a` in a graph (that might contain self-loops and recursive paths), then it  will also be reachable in the graph with self-loops and recursive paths.

**Senpai**: I think both sides are interesting ... reachability is a very robust concept.

**Kohai**: The side that you mentioned seems to me trivial for the simple reason that the graph with self-loops and recursive paths in an *extension* of the original graph. How could it be possible for a vertex `:e` to be reachable from a vertex `:a` in a graph `G` and not in a graph that contains `G`?

(Senpai walking in circles ...)

**Senpai**: Yes Kohai, your argument has valour: this side is rather easy to prove, but it's *still* an important and useful property. It is a property that I can decide on a small graph, the shape, and it easily translates to the concept we are studying: a (finite) category.  So let me rephrase the property:

> A vertex  `:e` is reachable from a vertex `:a` in a shape if, and only if (*iff*) there is an arrow `[:a :e]`  in the corresponding finite category. 

(Senpai back to a resting position ...)

**Senpai**: 
Dear Kohai, shall we go back to the exercise?

**Kohai**: Well... You told me that for the moment, we can ignore the algorithm complexity. It allows me to think of all kind of ideas, including the most naive ones.
Here is a naive idea that comes to my mind:

I am going to check if there is an edge in the graph that can be removed without impacting the reachability of any pair of nodes in the graph. If such an edge exist, then I would argue that this edge is *redundant* and therefore the graph in question is not a shape.
What do you think of my naive idea, respected Senpai?

**Senpai**: Do you mean that for each node `:a` , and for each neighbour (or direct successor) `:b` of this node (i.e. `(contains? :b (get graph :a))` is `true`), check if `:b` is still *reachable* when it is removed from the neighbours/successors of `:a`?
(I think *neighbour* is more an undirected graph concept...). 

**Kohai**: Exactly, Senpai!
I take the fact that you are taking time to rephrase my idea as an indication that my idea is valuable.
Let me try to code it in Clojure.

First, I need a predicate function that checks whether a successor is redundant, I will call it `redundant-successor?`:

```klipse
(defn redundant-successor? [graph node successor]
  (or (= node successor)
      (= (reachables graph node)
         (reachables (update graph node #(disj % successor)) node))))
```

Now, a graph is a *shape* if for all the `[node successor]` pairs, `(redundant-successor? node successor)` is `false`. With list comprehension, it's a piece of cake to code it:

```klipse
(defn shape? [graph]
  (every? false? 
          (for [[node successors] graph
                successor successors]
            (redundant-successor? graph node successor))))
```

As surprising as it could be, my naive idea and my simple function seem to work properly:

```klipse
(map shape? [my-graph my-catfin-graph my-sys])
```

**Senpai**: This is *simple* as in [Simple Made Easy](https://www.infoq.com/presentations/Simple-Made-Easy)! Very well done, Kohai...

Well, we need one last couple of things, though: 

- a function `shape-of-catfin` that takes a finite category and returns its shape as a graph.
- a function `catfin-of-shape` that does the converse (hint! I've seen this somewhere, but the name was different...)

Remember, I wanted to establish through code that there is an isomorphism between finite categories and their shape. So I would like something like:

```clojure
(catfin-of-shape (shape-of-catfin <C>)) = <C> ~> true
(shape-of-catfin (catfin-of-shape <G>)) = <G> ~> true
```

**Kohai**: Proving a math theorem via coding is really exciting!

First, I want to write a function that takes a graph and returns its shape:

```klipse
(defn shape-of-graph [graph]
  (map-kv (fn [node successors]
            (into #{} 
                  (remove (partial redundant-successor? graph node)
                          successors)))
          graph))
```

And to implement `shape-of-catfin`, I just need to convert the catfin to a graph and then call `shape-of-graph`:

```klipse
(defn shape-of-catfin [catfin]
  (shape-of-graph (catfin-graph catfin)))
```

For `catfin-of-shape`, I think it's exactly the same as instantiating a `GraphCat2`, since a shape is a graph:

```klipse
(defn catfin-of-shape [shape]
  (GraphCat2. shape))
```

Now, let's check whether the two sides of the isomorphism hold.

From a *catfin* to its *shape* and back to its *catfin*:

```klipse
(def my-catfin (GraphCat2. my-graph))
(= (catfin-of-shape (shape-of-catfin my-catfin))
   my-catfin)
```

From a *shape* to its *catfin* and back to its *shape*:

```klipse
(def my-shape my-graph)
(= (shape-of-catfin (catfin-of-shape  my-shape))
    my-shape)
```

The isomorphism holds!

**Senpai**: Wonderful! However what we did, Kohai, is to *construct* an isomorphism rather than prove it. But at least we have a witness of the fact, which is already a good thing.

**Kohai**: I am so grateful, respected Senpai, that you initiated me to the wonders of mathematical proofs via programming.

*(The Senpai and the Kohai celebrate the initiation of the Kohai, by drinking 17 glasses of water...)*

*(After the celebration, illuminated by the power of the 17 glasses of water, the Kohai comes to the Senpai...)*

**Kohai**: I don't know why, but I feel a spirit of skepticism invading my mind: Now, I am asking myself how much this proof is really valid mathematically. After all, we have only proved the isomorphism for a specific graph. Are we going to check it programatically for *all* the possible graphs? It will take forever....
    
**Senpai**: Of course we cannot prove the fact in this way, but a fact it is. What we could do is to try to find a counter-example, if only by enumerating shapes. Or we could use [LaTTe](https://github.com/latte-central/LaTTe) and work a few more weeks to obtain a formal proof in Clojure... But this would distract us from where we are now, and where we are going *from* now. So let me summarize our current situation.

 - we have the definition of a category with objects and arrows,
 - a finite category (with finite sets of objects and arrows) is akin to a directed graph with all self-loops and recursive paths 
 - we constructed and witnessed an isomorphism between what I called the *shape* of a finite category and the finite category itself, which consists in removing self-loops and recursive paths.

We are almost *there* but I would like to introduce one more mathematical concept. Do you know *kohai* the definition of a **partially ordered set** (or **poset**)? You can of course consult Wikipedia if you wish!

**Kohai**: I learned about **posets** at University during an introductory course to Mathematical Sets. If my memory doesn't delue me, a poset is a set with a relation of order between **some** of its elements. A relation of order \\(\leqslant\\) is a relation that is:
1. **reflexive**: for every element \\(X\\) of the poset,  \\(X \leqslant X\\)
2. **transitive**: for every elements \\(X\\) and \\(Y\\), if \\(X \leqslant Y\\) and \\(Y \leqslant Z\\), then \\(X \leqslant Z \\) 
3. **antisymmetric**: there is no distinct elements \\(X\\) and \\(Y\\) such that both \\(X \leqslant Y\\) and \\(Y \leqslant X\\)

Let me try to guess what is your intent, respected Senpai....
Representing a poset as a graph where the relation of order between two nodes corresponds to the existence of an edge between the nodes. 
I can see that:
1. The existence of self loops ensure the reflexivity.
2. The existence of recursive paths ensure the transitivity.

**Senpai**: Yes! a directed graph can be seen as a poset, but only if it is *acyclic*  (well, let's say that the longest cycle you allow is a self-loop). Soon Kohai you will not need me anymore. 

**Kohai**: The clarity of your teachings, respected Senpai, is what allows me to progress quickly and safely in the path of my initiation to Category Theory.

But what about the antisymmetric property?

**Senpai**: that is an *excellent* question. In fact, you had me think *a lot* about it! 

(Senpai navigated the internet for days in the look of an interesting answer)

And I reckon I have some elements of answer...

First, if we take a directed *acyclic* graph (DAG) then antisymmetry holds by construction because you simply cannot have both an edge from \\(X\\) to \\(Y\\) and another one from \\(Y\\) to \\(X\\) with \\(X\\) and \\(Y\\) distinct vertices because this would form a cycle in the graph. So acyclicity and antisymmetry are tightly related.

Technically speaking, the objets and arrows of a category form a *preorder* if we consider an object \\(a\\) to be "less than" an object \\(b\\) if there is an arrow \\(a \rightarrow b\\).
- we have reflexivity because for each object \\(a\\) we have an identity arrow \\(a \rightarrow a\\)
- we have transitivity thanks to arrow composition (if there is an arrow \\(a \rightarrow b\\) and an arrow \\(b \rightarrow c\\) then we have an arrow \\(a \rightarrow c\\)).

However the category conditions do not impose antisymmetry. Only if we further add the constraint, then we have a poset. Taking the problem upside-down, any poset can be seen as a category with the extra property of antisymmetry. And if we have antisymmetry, we have acyclicity in the directed graph *representation*. We are a little bit distracted here, but that's a very interesting distraction. 

(after a few weaks of reflecting, and investigating, the matter ...)

A category which assumes that isomorphic objects are in fact equal is called a **skeletal category**. In many situations this further "hidden" assumption is in fact omnipresent so we must be careful. Equality strikes again!

**Kohai**: I am bit confused by the term *representation* and by the fact that you mention *preorders*. Are we dealing with DAG or with Directed Graphs?

**Senpai**: Yes, yes, I confess this is somewhat confusing. The point is that the objects and arrows of a category form a preorder *by definition*. Moreover, for the finite case, this is representable as a directed graph. So we are dealing with directed graphs. However, if what we want is a poset, thus also antisymmetry, then in the representation we have a directed *acyclic* graph. Well, at least the *shape* is acyclic and that's the thing I am interested in: representing a (finite) category by its shape.

So why am I talking about the *representation* of a finite category as a directed graph, alternatively the *representation* of a poset-as-a-finite-category as a DAG?

This is because there may be some structure in the objects and the arrows of the category, e.g. the objects are sets and the arrows are functions between sets (we will go back to this example in the second part of our study). In the graph I have only vertices and directed edges, no structure "inside". That is why I talk about *the* shape of a finite category, and that is also why I am talking about *representation* or *shape*.

**Kohai**: (silence ...)

**Senpai**: Do you agree with the following?

> Any finite category whose shape is acyclic is (also) a *preorder*. And this is complete: any *preorder* can be represented by an acyclic shape (which is called its *covering*). Thus, a (finite) poset *is* a (finite) category.
 
**Kohai**: Well, if the shape is acyclic, then I would say that it is an *order* and not only a *preorder*...

**Senpai**: Yes! This is an overlook from my part, I have to rephrase: 

> Any finite category is (also) a *preorder* and is representable by a directed graph, its *shape*. Moreover if it is antisymmetric then is is a poset and representable as a DAG, its *acyclic shape*. And this is complete: any *preorder* (resp. *poset*) can be represented by a shape (resp. acyclic shape, which is called its *covering*).

... or something like that... Well I don't remember well why I wanted to say this, but I know that posets are interesting things!

**Kohai**: (silence, again ...)

**Senpai**: All we need to know is wether a given shape is *acyclic* or not... Could you implement such a test? (yes, yes, Kohai, that's one more exercise for you). As a witness, I would think that `my-graph-v2` above is not a poset, unlike the other graphs, in particular `my-sys`.

**Kohai**: I enjoy very much your exercises, respected Senpai, as they allow me to integrate your teachings, to make them *mine*, in a sense...

Detecting the absence of any cycle in a graph is really easy when we use your `reachables` function. We only need to check no node is reachable from itself!

```klipse
(defn acyclic? [graph]
  (let [nodes (keys graph)]
    (every? (fn [node]
              (not (contains? (reachables graph node) node)))
            nodes)))
```

Indeed `my-graph-v2` is not acyclic:

```klipse
(acyclic? my-graph-v2)
```

While `my-sys` is acyclic:

```klipse
(acyclic? my-sys)
```

Do you have another last exercise for me, Senpai?

**Senpai**: Well, dear Kohai, before finishing this first part of our common study, I would like to consider a change of viewpoint. We know that any directed graph (without recursive paths) can be "upgraded" to a finite category by adding all self-loops and all recursive paths. This is the same with acyclic (and intransitive) graphs but then the category we obtain is antisymmetric and is thus (also) a poset.

Now I propose to consider two new and much larger categories. In the first category that I want to call **ShapeCat**
- the objects are directed graphs (without transitive edges, i.e. recursive paths) or self-loops
- the arrows are *graph transformations*

The second category **OrdCat** is the same but with the extra condition that the graphs/shapes are *acyclic*.

Now the basic *graph transformations* are:
- the insertion/removal of a disconnected vertex
- the insertion of a directed edge between two existing vertices, such that: if the edge is `[:a :b]` then these are distinct vertices (otherwise we would have a self-loop) and moreover there is no existing path from `:a` to `:b` already in the graph (otherwise we would have a transitive edge). In the specific case of **OrdCat** it must also be the case that the new edge does not create a cycle in the graph.
- the removal of an edge from two existing vertices

These are your exercises Kohai: a function for any of these basic graph transformations (with examples!). Is this too much work Kohai?

(After a  long week made of short nights, the Kohai comes again to the house of the Senpai, exhausted but proud of himself...)

**Kohai**: It was indeed a lot of work, Senpai!

I was able to write 4 functions for the 4 *graph transformations* that you define. When one of the conditions of the transformation doesn't hold, the function throw an exception?

**Senpai**: that sounds like a decent solution. The transformations are clearly *partial* functions on graphs and it is an error to attempt a wrong transformation.  Let me see your functions...

```klipse
(defn insert-vertex [graph v]
  (if (get graph v)
    (throw (ex-info "The vertex already exists in the graph" {:graph graph
                                                              :vertex v}))
  (assoc graph v #{})))

(insert-vertex {:a #{:b :d}, :b #{}, :c #{:b}, :d #{}, :e #{}} :z)
```

```klipse
(defn remove-vertex [graph v]
  (if 
    (or 
     (not (get graph v))
     (not (empty? (get graph v)))
     (contains? (into #{} (apply concat (vals graph))) v))
    (throw (ex-info "The vertex is not disconnected or doesn't exist"
             {:graph graph
              :vertex v}))
    (dissoc graph v)))
(remove-vertex {:a #{:b :d}, :b #{}, :c #{:b}, :d #{}, :e #{}} :e)
```

```klipse
(defn remove-edge [graph [a b]]
  (cond
    (or (not (graph a))
        (not (graph b))) (throw (ex-info "one of the two vertices of the edge doesn't exist" {:edge [a b] :graph graph}))
    (not (contains? (graph a) b)) (throw (ex-info "the edge doesn't exist" {:edge [a b] :graph graph}))
    :else (update graph a #(difference % #{b}))))

(remove-edge {:a #{:b :d}, :b #{:e}, :c #{:b}, :d #{:e}, :e #{}} [:a :b])
```

```klipse
(defn insert-edge [graph [a b]]
  (cond
    (= a b) (throw (ex-info "the two vertices of the edge are the same" {:edge [a b] :graph graph}))
    (or (not (graph a))
        (not (graph b))) (throw (ex-info "one of the two vertices of the edge doesn't exist" {:edge [a b] :graph graph}))
    (contains? (graph a) b) (throw (ex-info "the edge already exists" {:edge [a b] :graph graph}))
    (contains? (reachables graph a) b) (throw (ex-info "the edge is redundant" {:edge [a b] :graph graph}))
    :else (update graph a #(union % #{b}))))

(insert-edge {:a #{:b :d}, :b #{:e}, :c #{:b}, :d #{:e}, :e #{}} [:c :a])
```

**Senpai**: That's good, I think we have the primitive **ShapeCat** arrows. For the **OrdCat** case we should also avoid the creation of a cycle, do you want me to create the **OrdCat** variants?

**Kohai**:

**Senpai**: Now, we need a way to compose such transformations because we need the composability of arrows in categories.

**Kohai**: Please guide me, respected Senpai, through the path of the composition.

**Senpai**: I think that a transformation is a function that takes a *particular* graph (or an acyclic graph) and produces another particular graph. The functions you wrote are thus like "families" of graph transformations. If we "speak" in types, for a transformation "family" \\(\phi\\) should be something of the form:

$$\phi :: X \times Graph \rightarrow Graph$$

Here \(X\) is the type of the extra argument, like the vertex you add in  `insert-vertex`. Given a `X` and a `Graph`, and provided that the transformation is possible on this graph, we obtain a resulting `Graph`.

Now if we combine with a second transformation "family":

$$\psi :: Y \times Graph \rightarrow Graph$$

The family of compositions \\(\phi\\) *then* \\(\psi\\) could be a function of the following kind of signature:

$$\rho :: (X \times Y) \times Graph \rightarrow Graph$$

(but an arrow in **ShapeCat** is when the parameters and the input graph are fixed).

Can you compose Kohai ?

(Senpai passes a few days thinking about arrows in graphs ...)

Kohai, I have an alternative idea! Of course, we can take a function from a graph to a graph as an arrow in **ShapeCat** or **OrdCat**. But in a way it is not very *canonical*. How can we be sure that the transformation is possible on the given graph? Moreover, many functions will compute the same transformation, and it is all very *opaque*  (that is something I have "against" functions, they are not data, you cannot see "through" them).

But what about representing a graph transformation as a pair of graphs:

 - a *negative subgraph* \\(G^-\\) that explains which vertices and edges should be removed
 - a *positive subgraph* \\(G^+\\) that explain which vertices and edges should (then) be added

An extra condition is that these two subgraphs are disjoint.

With this notion, could you explain (maybe in code ?) what would be the identity arrows, and the composition of arrows?
(maybe we should then check that **ShapeCat** and **OrdCat** respectfully agree with the definition of a category).

We would then have reached the end of our first approach to *what is a category?*, and we would be ready to begin our second encounter!

**Kohai**: The new approach seems to me much more enjoyable!
If I understand you correctly, a transformation \\(T\\) can be represented as a pair \\(\langle G_1, G_2 \rangle\\) and when we apply \\(T\\) on a graph \\(G\\), we get the graph \\((G \cup G_1) \setminus G_2\\). Is that correct?

**Senpai**: I would intuitively say \\((G \setminus G_2) \cup G_1\\), but it's interesting to make things commute, i.e. \\((G \setminus G_2) \cup G_1 = (G \cup G_1) \setminus G_2\\). Undoubtedly, it is not that case in general, there must be some conditions on the graphs. By the way, I would rather denote the transformation by \\(\langle G^-,G^+ \rangle\\) or something like that. I'm sure there is such a theory somewhere, maybe in *graph rewriting* but let's pretend it's our idea for now!

**Kohai**: Back to your question about identity arrow and composition of arrows:
The identity arrow would then be \\(\langle \phi,\phi \rangle\\), where \\(\phi\\) is the empty set. 

If \\(\langle G_1,G_2 \rangle\\) and \\(\langle H_1,H_2 \rangle\\) are two arrows, then the composition of the two arrows is given by: \\(\langle G_1 \cup H_1 \setminus G_2,G_2 \cup H_2 \setminus G_1 \rangle\\). My idea is that:
1. The composed positive subgraph is the union of the two positive subgraphs from which we subtract the second negative subgraph
2. The composed negative subgraph is the union of the two negative subgraphs from which we subtract the first positive subgraph

Am I in the right direction, respected Senpai?

**Senpai**: Looks like the right direction... In fact I don't know and I guess we should try with some code! Do you want to write some code Kohai, or do you want me to write some code for a change? It is for you to decide! 

**Kohai**: Currently, I am in the middle of a meditation... I am practicing my ability to encompass the existence as a whole. Therfore, I prefer to abandon you the pleasure of filling up the details....

**Senpai**: Well, Kohai, in fact we went far beyond what I had in mind for this first step, on the point that we may have a reached a *boring point* (a point where things start to bore a fellow Clojurian).

In fact, we have plenty enough examples of concrete **categories**:

 - the abstraction **FinCat** of finite categories
 - the isomorphism between **FinCat** and  acyclic direct graphs with no self-loop (the *shape* of a category)
 - the interesting subcategory of (finite) *Posets* seen as **FinCat**'s
 - the change of point of view of considering categories of *graph transformations* in which objects are graphs and arrows are transformation from graphs to (modified) graphs, let's call it **GraphCat**.

Note that **GraphCat** has an infinite number of objects (all the possible graphs) and arrows (all the possible transformations). However in category this is still considered a *small category*, Category theory is a very *large* field of study!

In conclusion, I am quite happy Kohai with this first iteration of our dialogue. We did not go very far in **GraphCat**: we did not build it, and we haven't checked (even informally) that this is indeed a category. It may come back at some point since *graph transformations* are quite an interesting topic, but for now we should start thinking about our next dialogue, in which I intend to introduce a much more *practical* category: **SpecCat** which of course involves the [Spec](https://clojure.org/guides/spec) framework!

Curious enough?

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.3.3/cytoscape.min.js">
</script>

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>

