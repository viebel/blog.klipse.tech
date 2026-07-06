---
layout: post
title:  "The caustics of the Aboulafia graph"
description: "Place the permutations on a circle in Aboulafia's order, join each word to its reversal, and luminous curves appear — caustics, the same phenomenon as the bright cusp at the bottom of a coffee cup. No one draws them; they emerge from the rule."
date:   2026-07-06 11:00:00 +0200
categories: aboulafia
thumbnail: assets/aboulafia-hero.png
guid: 9148E9B7-91DA-4E69-8DE4-03D1F2B0DDF1
author: Yehonathan Sharvit
tags: [aboulafia, math, caustics, generative, visualization]
---

*Third article in [the series]({% post_url 2026-07-06-aboulafia-tserouf-first-permutation-algorithm %}). We have seen that [Aboulafia's tserouf order]({% post_url 2026-07-06-aboulafia-and-the-formula-bill-gates-studied %}) is a Hamiltonian cycle on the pancake graph. Now let us draw it.*

## How to draw a permutation space

Take all the arrangements of `n` letters — all `n!` of them — and place them, in Aboulafia's order, as points evenly spaced around a circle. Then, to reveal the structure, draw one chord for each point: **join every word to its reversal**, the same word read back-to-front — the mirror that closes Aboulafia's cycle, front and back, as the *Sefer Yetzirah* says. (These reversal chords are the "long" edges of the pancake graph; note that reversal is not the move Aboulafia *generates* the order with — that is the cyclic shift of [article one]({% post_url 2026-07-06-aboulafia-tserouf-first-permutation-algorithm %}) — it is the mirror that completes it.)

There is a practical problem: `n!` is astronomical. For `n = 300` it is a number with 615 digits — more arrangements than atoms in the universe, many times over. You cannot draw them all. So instead you **sample**: pick tens of thousands of arrangements at random, draw their chords, and let them accumulate.

You would expect a mess. Thousands of chords thrown down at random should blacken the disk uniformly. The opposite happens.

![Aboulafia graph, n = 9](/assets/aboulafia-hero.png)

The chords do not spread evenly. They **pile up along smooth, glowing curves**. Those curves have a name.

## Caustics

Look at the bright, cusped curve of light at the bottom of a coffee cup in the morning sun. That is a **caustic** — the curve where reflected light rays bunch together, the *envelope* of a whole family of rays. Wherever infinitely many neighbouring rays graze the same curve, light accumulates there and it glows.

The chords of the Aboulafia graph do the same thing. Each chord is like a ray; where many neighbouring chords bunch up, a bright caustic appears. The image is not drawn — it is **revealed**.

This is a known effect in its simplest form. Put points around a circle and join each point `k` to the point `2k`; the envelope of those chords is a **cardioid**. Join `k` to `3k` and you get a **nephroid**. Times tables become curves.

![Cardioid — k to 2k](/assets/aboulafia-cardioid.png)

![Nephroid — k to 3k](/assets/aboulafia-nephroid.png)

Aboulafia's construction is of the same family, but the map that sends each point to its partner is neither doubling nor tripling — it is the **reversal**, carried around the circle by his recursive order. Its caustics are therefore far richer than a cardioid, yet obey the same underlying law.

## Complexity grows with the number of letters

Nothing here is decorative. As you add letters, the lacework thickens according to a strict internal logic — you are watching complexity being born from a fixed rule.

![n = 5](/assets/aboulafia-n5.png)
![n = 6](/assets/aboulafia-n6.png)
![n = 7](/assets/aboulafia-n7.png)
![n = 8](/assets/aboulafia-n8.png)

## Descending into the image

Because [Zaks's formula]({% post_url 2026-07-06-aboulafia-and-the-formula-bill-gates-studied %}) lets you compute the position of *any* permutation without walking through the others, you can **zoom**: open a tiny window inside the disk and populate it afresh. Secondary caustics appear — chords that, accumulating, draw circles, and more circles, at ever finer scales.

![A zoomed window of the n = 9 graph](/assets/aboulafia-zoom.png)

A strict combinatorial rule — reverse a word, place it by a recursive rank — produces an organic form that the rule never contained. It is a living illustration of what Henri Atlan called the space between crystal and smoke, and of Jacques Monod's chance and necessity: the apparent chaos of the random sample is not the enemy of order; it is *born from it*, and re-condenses into order at the large scale. The caustic is the exact place where you can watch that reconciliation happen.

And the symmetry of these figures is not arbitrary. It is the symmetry of a **mandala** — and there is a precise mathematical reason for that, which is [the final article]({% post_url 2026-07-06-why-the-aboulafia-graph-is-a-mandala %}).
