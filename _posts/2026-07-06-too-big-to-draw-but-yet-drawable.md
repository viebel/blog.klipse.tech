---
layout: post
title:  "Too big to draw, but yet drawable"
description: "Place the permutations on a circle in Aboulafia's order, join each word to its reversal, and — once there are too many to draw and you sample at random — luminous curves appear: caustics, the same phenomenon as the bright cusp of light at the bottom of a coffee cup."
date:   2026-07-06 11:00:00 +0200
categories: aboulafia
thumbnail: assets/tserouf_42.png
guid: 9148E9B7-91DA-4E69-8DE4-03D1F2B0DDF1
author: Yehonathan Sharvit
tags: [aboulafia, math, caustics, generative, visualization]
---

<div style="margin:0 0 2em;padding:.7em 1em;border:1px solid #e6e2d8;border-radius:8px;background:#faf8f3;font-size:0.9em">
<span style="color:#a08d6a;text-transform:uppercase;letter-spacing:.07em;font-size:0.78em">Aboulafia's Tserouf · Part 3 of 4</span><br>
← Previous: <a href="{% post_url 2026-07-06-an-elegant-formulation-inspired-by-bill-gates %}">An elegant formulation, inspired by Bill Gates</a> &nbsp;·&nbsp; Next: <a href="{% post_url 2026-07-06-a-wheel-the-same-forwards-and-backwards %}">A wheel, the same forwards and backwards</a> →
</div>

*Third article in [the series]({% post_url 2026-07-06-a-13th-century-enumeration-algorithm-ignored-for-700-years %}). We have seen that [Aboulafia's tserouf]({% post_url 2026-07-06-an-elegant-formulation-inspired-by-bill-gates %}) is a precise ordering of all the permutations of a word. Now let us draw it.*

## How to draw a permutation space

Take all the arrangements of `n` letters — all `n!` of them — and place them, in Aboulafia's order, as points evenly spaced around a circle. This is only possible because [Zaks's ranking and unranking]({% post_url 2026-07-06-an-elegant-formulation-inspired-by-bill-gates %}) is **recursive in `n`, not in `n!`**: to find where a given word belongs on the circle, we run a short recursion over its `n` letters — we never have to walk through the astronomical list. Then join each word to its **reversal**, the same word read back to front. Those are the only chords that matter: drawing them is enough to reveal the whole structure.

Watch what happens as `n` climbs. Up to six letters the picture is still a sparse tangle of chords — you can almost count them.

<figure style="margin:1.8em 0;text-align:center"><img src="/assets/zaks-svg_n4.png" alt="Aboulafia graph for 4 letters" style="width:70%;max-width:520px;background:#0b0b0f;border-radius:8px"><figcaption style="font-size:0.9em;color:#888;margin-top:.5em">4 letters</figcaption></figure>

<figure style="margin:1.8em 0;text-align:center"><img src="/assets/zaks-svg_n5.png" alt="Aboulafia graph for 5 letters" style="width:70%;max-width:520px;background:#0b0b0f;border-radius:8px"><figcaption style="font-size:0.9em;color:#888;margin-top:.5em">5 letters</figcaption></figure>

<figure style="margin:1.8em 0;text-align:center"><img src="/assets/zaks-svg_n6.png" alt="Aboulafia graph for 6 letters" style="width:70%;max-width:520px;background:#0b0b0f;border-radius:8px"><figcaption style="font-size:0.9em;color:#888;margin-top:.5em">6 letters</figcaption></figure>

But **at seven letters the magic begins**: the chords start to organise themselves, all on their own, into a dense, luminous, structured web. New patterns starts to emerge.

<figure style="margin:1.8em 0;text-align:center"><img src="/assets/zaks-svg_n7.png" alt="Aboulafia graph for 7 letters" style="width:70%;max-width:520px;background:#0b0b0f;border-radius:8px"><figcaption style="font-size:0.9em;color:#888;margin-top:.5em">7 letters</figcaption></figure>

## Too big to draw yet drawable

The trouble is that `n!` grows ferociously. At ten letters there are already 3,628,800 arrangements. At sixty letters there are more of them than there are atoms in the observable universe. You cannot draw them all — not even close.

So instead you **sample**: pick a few hundred thousand arrangements at random, draw each one's chord to its reversal, and let them accumulate. 

This is doable since Zak's formula is so simple!

You would expect a grey mush. The opposite happens.

## Caustics

The chords do not spread evenly. They pile up along smooth, glowing curves — the same phenomenon as the bright cusp of light at the bottom of a coffee cup, where reflected rays bunch together. Mathematicians call such a curve a **caustic**: the place where a whole family of lines crowds onto a single envelope, and light gathers. The picture is not drawn — it is *revealed*.

## The Tserouf of 42 letters

<p align="center"><img src="/assets/tserouf_42.png" alt="The Tserouf of 42 letters — 870,000 random chords" style="width:92%;max-width:820px;background:#0b0b0f;border-radius:8px;box-sizing:border-box;padding:52px"></p>

*The Tserouf of 42 letters. Its **1.41 × 10⁵¹** permutations could never be drawn — this is just **870,000** of its chords, taken at random.*

And you can fall into it. Because [Zaks's ranking and unranking functions]({% post_url 2026-07-06-an-elegant-formulation-inspired-by-bill-gates %}) let you jump straight to any position without visiting the others, you can zoom in — here **985×** — and the same rings return, finer and finer:

<p align="center"><img src="/assets/tserouf_42_z985.png" alt="985× zoom into the 42-letter Tserouf" style="width:92%;max-width:820px;background:#0b0b0f;border-radius:8px;box-sizing:border-box;padding:52px"></p>

*A 985× zoom into the very same figure — the caustics repeat at every scale.*

A strict rule — order the words, join each to its reversal — sampled blindly, and out of the randomness rises this. It is a living illustration of what Henri Atlan called the space between crystal and smoke, and of Jacques Monod's chance and necessity: the apparent chaos is harmonious.

Moreover, the symmetry of the figure grows with the number of letters and it is the symmetry of a **mandala** and a **kaleidoscope**.

There is a precise mathematical reason for that, which is [the final article]({% post_url 2026-07-06-a-wheel-the-same-forwards-and-backwards %}).
