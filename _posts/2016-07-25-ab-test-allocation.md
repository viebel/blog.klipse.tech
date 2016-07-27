---
layout: post
title:  "How to detect and fix bucket imbalance in A/B tests?"
description:  "How to detect and fix bucket imbalance in A/B tests?"
date:   2016-07-25 12:31:12 +0200
categories: ruby
ruby: true
thumbnail: assets/klipse.png
guid: "DCCB58C1-2EA5-4A06-9D40-6C2CCA54BCF9"
author: "@viebel"
minified_plugin: true
---

# The code for bucket allocation
~~~klipse-eval-ruby
def calculate_hash(user_id, exp_id)
  rand(1000000)
end
def should_allocate_to_test?(value, allocation_percentage)
  (value % 100) <= allocation_percentage
end
def calculate_variation(value, num_variations)
  value % num_variations
end
def allocate_user_to_experiment(exp_id: , user_id: nil, allocation_percentage: 100)
  value = calculate_hash(user_id, exp_id)
  return unless should_allocate_to_test?(value, allocation_percentage)
  calculate_variation(value, 2)
end
~~~

Let's add `freqs` to `Array`:


~~~klipse-eval-ruby
class Array
  def freqs 
    self.reduce(Hash.new {0}) {|res, x|
      if x.nil?
        res
        else
      res[x] = res[x] + 1
      res
      end
      }
  end
end
~~~

Let's see our allocation algorithm in action - allocating 100% of the users:

~~~klipse-eval-ruby
(0..100000).map { |user_id|
    allocate_user_to_experiment(exp_id: 523, user_id: user_id)
}.freqs()
~~~

Is the allocation balanced?


And what about this one - allocating 20 % of the users?

~~~klipse-eval-ruby
(0..100000).map { |user_id|
    allocate_user_to_experiment(exp_id: 523, user_id: user_id, allocation_percentage: 20)
}.freqs()
~~~




# Chi Squared


![Chi](/assets/chi_squared.jpg){:width="300px"}


![P](/assets/p_value.jpg)

Source: [Wikipedia](https://en.wikipedia.org/wiki/Chi-squared_distribution)

~~~klipse-eval-ruby
def chi_squared(a, b)
  expected = (a + b)*0.5
    chi_sqrd = [a,b].map {|x| (x - expected)**2/expected}.reduce(&:+)
end
~~~


Let's add a `balanced?` method to `Array`:

~~~klipse-eval-ruby

class Array
  def balanced?()
      a,b = self
          "a: #{a}, b: #{b} -- chi squared: #{chi_squared(a,b).round(3)} (Should be less than 3.84)"
            end
            end
~~~


~~~klipse-eval-ruby
a,b = (0..100000).map { |user_id|
  allocate_user_to_experiment(exp_id: 523, user_id: user_id)
    }.freqs().values().balanced?()
~~~

# The bug

~~~klipse-eval-ruby
(0..100000).map { |user_id|
  allocate_user_to_experiment(exp_id: 523, user_id: user_id, allocation_percentage:20)
    }.freqs().values().balanced?()
~~~

The bug happens because between 0 and 20 there are 11 even numbers and only 10 odd numbers.


Off by one!!!


> There are **two** hard things in computer science: cache invalidation, naming things, and off-by-one errors.

# The solution

Use `19` instead of `20`:

~~~klipse-eval-ruby
(0..100000).map { |user_id|
  allocate_user_to_experiment(exp_id: 523, user_id: user_id, allocation_percentage:19)
    }.freqs().values().balanced?()
~~~

Seriously, the solution is decoupling the allocation decision and the variation calculation:



~~~klipse-eval-ruby
def allocate_user_to_experiment_fixed(exp_id: , user_id: nil, allocation_percentage: 100)
value = calculate_hash(user_id, exp_id*10001)
return unless should_allocate_to_test?(value, allocation_percentage)

value = calculate_hash(user_id, exp_id)
calculate_variation(value, 2)
end
~~~

~~~klipse-eval-ruby
a,b = (0..100000).map { |user_id|
allocate_user_to_experiment_fixed(exp_id: 523, user_id: user_id, allocation_percentage:20)
  }.freqs().values().balanced?
~~~




