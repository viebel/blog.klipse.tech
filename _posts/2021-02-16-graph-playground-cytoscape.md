---
layout: post
title:  Graph visualization playground with Cytoscape.
description:  Graph visualization playground with Cytoscape in Clojure.
date:   2021-02-16 16:11:22 +0200
categories: visualization
thumbnail: assets/klipse.png
tags: [visualization, clojure, graph]
---

Playground for visualizing graphs using [Cytoscape.js](https://js.cytoscape.org/) in Clojure.


We define the default graph options:

```klipse
(def ^:dynamic *default-graph-options* 
  {:style [{:selector "node"
  :style {:background-color "#666"
        :label "data(label)"}}
    {:selector "edge"
      :style {"width" 2
        :line-color "#ccc"
        :target-arrow-color "#ccc"
        :curve-style "bezier"
        :target-arrow-shape "triangle"
        :label "data(label)"}}]
  :layout {:name "circle"}
  :userZoomingEnabled false
  :userPanningEnabled false
  :boxSelectionEnabled false}) 
```
 
A function that renders the graph specified by `elements` on the container whose id is `container-id`:

```klipse
(defn cytoscape-clj [elements container-id]
  (js/cytoscape
   (clj->js (merge *default-graph-options*
                   {:container (js/document.getElementById container-id)
                    :elements elements})))
  nil)
```
 
Let's render a graph with some nodes and edges:

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
 
 
Now we write functions that create edges and nodes for a fully-connected graph:

```klipse
(defn edge [a b] {:data {:source a :target b}})
(defn connect-all [ids]
  (for [a ids
        b ids
        :when (< a b)]
    (edge a b)))

(defn nodes [ids]
  (for [id ids]
    {:data {:id id}}))

(defn elements [ids]
  (concat (nodes ids)
          (connect-all ids)))
```

We render a fully-connected directed graph with 6 nodes:

```klipse
(cytoscape-clj (elements (range 6)) "graph-3")
```
 
<div id="graph-3" style="width: 100%; height: 200px; background-color: white;">
</div>

We render a fully-connected undirected graph with 6 nodes:

```klipse
(binding [*default-graph-options* (assoc-in *default-graph-options*
            [:style 1 :style :target-arrow-shape] nil)]
            (cytoscape-clj (elements (range 6)) "graph-4"))
```
 
<div id="graph-4" style="width: 100%; height: 200px; background-color: white;">
</div>

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.18.0/cytoscape.min.js">
</script>


