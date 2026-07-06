---
layout: post
title:  "Why the Aboulafia graph is a mandala"
description: "The caustics of Aboulafia's order have the exact symmetry of a mandala — rotations and reflections — and a fractal self-similarity that no other ordering shares. Here is the mathematics behind it, and why it may be a fingerprint of Aboulafia's method itself."
date:   2026-07-06 12:00:00 +0200
categories: aboulafia
thumbnail: assets/aboulafia-hero.png
guid: CF2BF51A-F44D-45A6-9009-4B4CCB904DB8
author: Yehonathan Sharvit
tags: [aboulafia, math, symmetry, dihedral, fractal]
---

*Final article in [the series]({% post_url 2026-07-06-aboulafia-tserouf-first-permutation-algorithm %}). We drew [the caustics]({% post_url 2026-07-06-the-caustics-of-the-aboulafia-graph %}); now let us understand their symmetry — and why it belongs to Aboulafia's order alone.*

![The Aboulafia graph, n = 9](/assets/aboulafia-hero.png)

## A real mandala, not a metaphor

Look again at the figure. It has the symmetry of a mandala: turn it by a fixed angle and it maps onto itself; reflect it in an axis and it maps onto itself. Rotations *and* reflections — that combination is what mathematicians call a **dihedral symmetry**, the group `Dₙ`, of order `2n`. It is precisely the symmetry class of the mandalas of Eastern traditions.

This is not an accident of the drawing. It is forced by Aboulafia's order, and two facts explain it.

**First, a rotation is a shift of one block.** Aboulafia's ordering is built recursively: the `n!` arrangements fall into `n` blocks, each a re-scaled copy of the ordering for `n−1` letters. Advancing the whole cycle by one block turns out to be *exactly* a rotation of the circle by `2π/n`. Block boundary and axis of symmetry are the same thing. The recursion *is* the rotational symmetry.

**Second, reversal is a mirror.** Joining each word to its reversal is a symmetric relation — reverse twice and you are back where you started. This "front and back" involution supplies the reflection. And it has a small, pleasing property: **it has no fixed points.** A word equal to its own reversal would be a palindrome, and a permutation of distinct letters can never be a palindrome. So no chord ever shrinks to a point; the whole family is a *free* involution, and the mirror symmetry is exact.

## Self-similar — like an attenuated Mandelbrot

Zoom into the figure and the caustics repeat at finer and finer scales. That looks fractal, so I put it to the test — not by eye, but with the tools built for exactly this question: the catastrophe-theory spectrum of the caustic (the classification of its cusps, due to Arnold), and a self-similarity measure calibrated so that the Sierpiński triangle scores zero.

The verdict is clear and, I think, honest. The self-similarity is **real and strong** — far above noise, structurally rich. But it is *not* a Mandelbrot set inventing new worlds at every depth: the same repertoire of cusps tiles more and more copies of itself as `n` grows, without producing structurally new forms. It is a faithful, mandala-like repetition of one motif across scales.

## The part that may matter beyond mathematics

Here is the finding I find most provocative. This entire structure — the mandala symmetry, the self-similar caustics — belongs to **Aboulafia's order specifically**.

There are other Hamiltonian cycles on the very same pancake graph, built from the very same edges. I tested one of them (the ordering of Aaron Williams). Same graph, same reversals, different order — and the caustic **collapses**: frozen, degenerate, no rich envelope at all. The beauty is not a property of the pancake graph. It is a property of the *particular ordering* Aboulafia chose.

That gives us something rare: an **objective, mathematical fingerprint** of Aboulafia's method. It is a genuinely open and delicate question — one I would rather raise carefully than pronounce on — whether such a fingerprint could one day serve as a criterion to compare tserouf traditions, or even to weigh variant manuscripts of the *Sefer Yetzirah*, in which an ordering of the permutations of the letters of the Divine Name appears. I make no claim here; I only note that the door exists.

## The whole story

A 13th-century Kabbalist described an algorithm for permutations. Its move is the pancake flip of Bill Gates's only paper. Its order was rediscovered by Zaks in 1984. Drawn, it produces caustics of mandala symmetry and fractal self-similarity that no other ordering shares.

I have written up the mathematics as a note on [arXiv](ARXIV_URL_TO_FILL), and you can turn the wheel yourself in [the interactive Aboulafia explorer](APP_URL_TO_FILL) — change `n`, toggle the reversal chords, and zoom into the caustics.

If any of this moved you, that is the point. Aboulafia turned letters until meaning dissolved and something else appeared. Seven hundred years later, we can finally see what it looks like.
