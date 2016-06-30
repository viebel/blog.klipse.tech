---
layout: post
title:  "Generative Testing with Javascript"
description:  "Generative Testing with Javascript"
description:  "Multi language live and interactive code snippets with the klipse plugin: javascript, ruby, PHP, clojure."
date:   2016-06-30 04:17:33 +0200
categories: javascript
thumbnail: assets/klipse.png
guid: "B0F4E47C-AA69-42F9-9611-E5994AB468E0"
author: "@viebel"
minified_plugin: true
---

# What is generative testing?

<pre>
<code class="language-klipse-eval-js" 
data-external-libs="https://raw.githubusercontent.com/leebyron/testcheck-js/master/dist/testcheck.js">

tc = testcheck
gen = tc.gen;
Object.keys(gen)
</code>
</pre>


~~~klipse-eval-js
tc.check(
  tc.property(
      [gen.int],
          x => x - x === 0
            )
  )
~~~

~~~klipse-eval-js
tc.check(
  tc.property(
      [gen.int],
          x => x <= 90
            )
  )
~~~


~~~ klipse-eval-js
tc.check(
    tc.property(
            [gen.int, gen.int],
                    (a, b) => a*b  >= a+b
                        )
    )

~~~

~~~klipse-eval-js
tc.sample(gen.suchThat((x) => x > 10, gen.int))
~~~


~~~klipse-eval-js
bigNumber = gen.suchThat((x) => x > 1, gen.int)
tc.check(
    tc.property(
            [bigNumber, bigNumber],
                    (a, b) => a * b >= a + b
                        )
    )
~~~



# Real use case



