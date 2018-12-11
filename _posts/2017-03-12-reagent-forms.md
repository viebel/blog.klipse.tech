---
layout: post
title:  "Reagent Forms Tutorial"
description:  "Gallery of reagent forms"
date:   2017-03-12 00:42:44 +0200
categories: reagent
thumbnail: assets/klipse.png
guid: "DCB1C486-06AB-4E52-A1CF-5E481884EB80"
author: Yehonathan Sharvit
draft: true
hidden: true
---



# Hello World!


~~~klipse
(ns my.playground
  (:require [reagent.core :as r]
            [reagent-forms.core :refer [bind-fields]]))
~~~

~~~klipse

(defn row [label input]
  [:div.row
   [:div.col-md-2 [:label label]]
   [:div.col-md-5 input]])

(defn radio [label name value]
  [:div.radio
   [:label
    [:input {:field :radio :name name :value value}]
    label]])

(defn input [label type id]
  (row label [:input.form-control {:field type :id id}]))

(def form-template
  [:div
   (input "first name" :text :person.first-name)
   [:div.row
    [:div.col-md-2]
    [:div.col-md-5
     [:div.alert.alert-danger
      {:field :alert :id :errors.first-name}]]]

   (input "last name" :text :person.last-name)
   [:div.row
    [:div.col-md-2]
    [:div.col-md-5
     [:div.alert.alert-success
      {:field :alert :id :person.last-name :event empty?}
      "last name is empty!"]]]

   (input "email" :email :person.email)
   (row
     "comments"
     [:textarea.form-control
      {:field :textarea :id :comments}])

   [:hr]


   (input "kg" :numeric :weight-kg)
   (input "lb" :numeric :weight-lb)

   [:hr]
   [:div.row
    [:div.col-md-5 [:label "date of birth"]]]

   [:div.row
    [:div.col-md-7
     [:div {:field :datepicker
            :auto-close? true
            :id :dob
            :date-format "yyyy/mm/dd"
            :inline true}]]]
   [:hr]

   [:h3 "BMI Calculator"]
   (input "height" :numeric :height)
   (input "weight" :numeric :weight)
   (row "BMI"
        [:input.form-control
         {:field :numeric :fmt "%.2f" :id :bmi :disabled true}])
   [:hr]

   (row "isn't data binding lovely?"
        [:input {:field :checkbox :id :databinding.lovely}])
   [:label
    {:field :label
     :preamble "The level of awesome: "
     :placeholder "N/A"
     :id :awesomeness}]

   [:input {:field :range :min 1 :max 10 :id :awesomeness}]

   [:h3 "option list"]
   [:div.form-group
    [:label "pick an option"]
    [:select.form-control {:field :list :id :many.options}
     [:option {:key :foo} "foo"]
     [:option {:key :bar} "bar"]
     [:option {:key :baz} "baz"]]]

   (radio
     "Option one is this and that—be sure to include why it's great"
     :foo :a)
   (radio
     "Option is something else, selecting it will deselect option one"
     :foo :b)

   [:h3 "multi-select buttons"]
   [:div.btn-group {:field :multi-select :id :every.position}
    [:button.btn.btn-default {:key :left} "Left"]
    [:button.btn.btn-default {:key :middle} "Middle"]
    [:button.btn.btn-default {:key :right} "Right"]]

   [:h3 "single-select buttons"]
   [:div.btn-group {:field :single-select :id :unique.position}
    [:button.btn.btn-default {:key :left} "Left"]
    [:button.btn.btn-default {:key :middle} "Middle"]
    [:button.btn.btn-default {:key :right} "Right"]]

   [:h3 "single-select list"]
   [:div.list-group {:field :single-select :id :pick-one}
    [:div.list-group-item {:key :foo} "foo"]
    [:div.list-group-item {:key :bar} "bar"]
    [:div.list-group-item {:key :baz} "baz"]]

   [:h3 "multi-select list"]
   [:ul.list-group {:field :multi-select :id :pick-a-few}
    [:li.list-group-item {:key :foo} "foo"]
    [:li.list-group-item {:key :bar} "bar"]
    [:li.list-group-item {:key :baz} "baz"]]])




(defn weight-translation
  [[id] value {:keys [weight-lb weight-kg] :as document}]
  (cond
    (= id :weight-lb)
    (assoc document :weight-kg (/ value 2.2046))
    (= id :weight-kg)
    (assoc document :weight-lb (* value 2.2046))
    :else nil))

(defn bmi-calculation
  [[id] value {:keys [height weight] :as document}]
  (when (and (some #{id} [:height :weight]) weight height)
    (assoc document :bmi (/ weight (* height height)))))

(defn page []
  (let [doc
        (atom {:person {:first-name "Johnat"
                        :age 35
                        :email "foo@bar.baz"}
               :weight 100
               :height 200
               :comments "some interesting comments
               on this subject"
               :radioselection :b
               :position [:left :right]
               :pick-one :bar
               :unique {:position :middle}
               :pick-a-few [:bar :baz]
               :many {:options :bar}})]
    (fn []
      [:div
       [:div.padding]

       [:div.page-header [:h1 "Sample Form"]]

       [:div
        [bind-fields
         form-template
         doc
         bmi-calculation
         weight-translation]

        [:button.btn.btn-default
         {:on-click
          #(if (empty? (get-in @doc [:person :first-name]))
             (swap! doc assoc-in [:errors :first-name]
                    "first name is empty"))}
         "save"]]])))
~~~


~~~reagent
[:div 
   (input "name" :numeric :name)
   (input "number of kids" :numeric :kids)]
~~~

~~~reagent
[page]
~~~

<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
