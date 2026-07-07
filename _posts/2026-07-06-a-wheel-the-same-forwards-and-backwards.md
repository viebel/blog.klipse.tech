---
layout: post
title:  "A Wheel, the Same Forwards and Backwards"
description: "The Aboulafia graph has the exact symmetry of a regular polygon — n rotations and n reflections, the dihedral group. It is the same symmetry as a mandala, a kaleidoscope, and the corolla of a flower — a wheel that is the same forwards and backwards."
date:   2026-07-06 12:00:00 +0200
categories: aboulafia
thumbnail: assets/tserouf_22_z1_plum.png
guid: CF2BF51A-F44D-45A6-9009-4B4CCB904DB8
author: Yehonathan Sharvit
tags: [aboulafia, math, symmetry, dihedral, mandala]
---

*Final article in [the series]({% post_url 2026-07-06-a-13th-century-enumeration-algorithm-ignored-for-700-years %}). We [drew Aboulafia's order]({% post_url 2026-07-06-too-big-to-draw-but-yet-drawable %}) and watched a striking symmetry appear. That symmetry has a precise name.*

## The symmetry of a polygon

Take a regular polygon with `n` sides — an equilateral triangle, a square, a regular pentagon, and so on. Ask: in how many ways can you pick it up and set it back down so that it looks exactly the same? You can **rotate** it, by any multiple of `360°/n` — that is `n` rotations. And you can **flip** it over across an axis of mirror symmetry — a regular `n`-gon has exactly `n` such axes. Altogether, `2n` motions leave it unchanged.

<figure style="margin:1.8em 0;text-align:center"><img src="/assets/heptagon-symmetries.svg" alt="The 14 symmetries of a regular heptagon" style="width:62%;max-width:380px"><figcaption style="font-size:0.9em;color:#888;margin-top:.5em">A regular heptagon (n = 7): 7 rotations and 7 reflections — its 7 mirror axes dashed — 14 motions in all that keep every distance between the vertices unchanged. That is the dihedral group D₇.</figcaption></figure>

That collection of `2n` symmetries is a mathematical object in its own right, called the **dihedral group**, written `Dₙ`. It is *the* symmetry of the regular `n`-sided polygon: `n` rotations and `n` reflections.

The name is worth unpacking. **Dihedral** comes from the Greek *di-*, "two", and *hedra*, "seat" or "face". A *dihedron* is a figure with two faces — think of a flat polygon as an infinitely thin solid, with a front face and a back face. The dihedral group is the group of symmetries of that two-faced figure. Keep that "front and back" in mind; we will meet it again.

## Why the Aboulafia graph has exactly this symmetry

Recall how the graph is built: the `n!` words sit on a circle in Aboulafia's order, and each is joined to its reversal. In a paper with **Or-Hai Benjo**, we prove that this figure has exactly the dihedral symmetry `Dₙ` — and the two generators fall straight out of Zaks's recursive recipe.

**The rotation — the wheel turns.** The [recursion]({% post_url 2026-07-06-an-elegant-formulation-inspired-by-bill-gates %}) cuts the order into `n` identical blocks, each a copy of the order for `n−1` letters, whose starting points are the successive powers `id, ρ, ρ², …, ρⁿ⁻¹` of a single `n`-fold cyclic step `ρ`. Applying `ρ` sends every block to the next — it turns the whole wheel by one block, exactly `360°/n`. There are the `n` rotations.

**The reflection — the palindrome.** The recipe of reversals that builds the order is a **palindrome**: it reads the same forwards and backwards. And because every reversal undoes itself, walking the cycle from the other end simply reverses the whole sequence of words — a mirror. There is the reflection.

A rotation of order `n` and a mirror: together they generate `Dₙ`. The harder half of our paper then shows these two are the *only* symmetries — the Aboulafia graph has *exactly* the symmetry of the regular `n`-gon, no more and no less.

You can see it directly — count the repeated motifs around the rim, and notice that each motif is itself mirror-symmetric:

<figure style="margin:1.8em 0;text-align:center"><img src="/assets/tserouf_13_blue.png" alt="Aboulafia graph of 13 letters, with 13-fold dihedral symmetry" style="width:88%;max-width:760px;background:#000;border-radius:8px;box-sizing:border-box;padding:40px"><figcaption style="font-size:0.9em;color:#888;margin-top:.5em">13 letters — 13 copies of one motif around the wheel, each with its own mirror axis (`D₁₃`).</figcaption></figure>

<figure style="margin:1.8em 0;text-align:center"><img src="/assets/tserouf_22_z1_plum.png" alt="Aboulafia graph of 22 letters, with 22-fold dihedral symmetry" style="width:88%;max-width:760px;background:#000;border-radius:8px;box-sizing:border-box;padding:40px"><figcaption style="font-size:0.9em;color:#888;margin-top:.5em">22 letters — the number of letters of the Hebrew alphabet — 22 mirror-symmetric copies around the centre (`D₂₂`).</figcaption></figure>

## The same law: mandala, kaleidoscope, flower

Dihedral symmetry is not exotic. It is one of the most common shapes the world reaches for whenever it arranges parts around a centre.

A **mandala** — from the Sanskrit *maṇḍala*, simply "circle" or "disk" — is built, in Buddhist and Hindu traditions, on rotations and reflections about a centre. Its structure is dihedral.

A **kaleidoscope** — coined in 1817 from the Greek *kalos* ("beautiful"), *eidos* ("form") and *skopein* ("to look at"): "the seeing of beautiful forms" — produces its images with mirrors, reflecting a small pattern again and again around a centre. Its images are dihedral by construction.

The **corolla of a flower** — its ring of petals — repeats one petal `n` times around the centre, each petal a mirror of its neighbours. Dihedral again.

Cultural, optical, biological — three utterly different worlds, and the same group `Dₙ` underneath all of them. One is tempted to see in dihedral symmetry something like a **meta-law of organisation**: the form that matter and mind alike fall into whenever they order themselves around a still centre — in a crystal, a petal, a rose window, a mandala. The Aboulafia graph simply adds one more member to that family, grown not from matter but from the permutations of letters.

## A wheel, the same forwards and backwards

The *Sefer Yetzirah*, the ancient book at the root of this whole tradition, speaks of the **galgal** (גלגל) — the **wheel** — and describes it as *panim v'aḥor* (פנים ואחור), **"front and back."** I read this as a wheel that is *the same forwards and backwards.*

That single phrase is dihedral symmetry, stated in two words. The **wheel** is the rotation. **"Front and back" — the same either way** — is the reflection, the two faces of the *dihedron*. And the mathematics echoes the words exactly: the recipe of reversals behind the wheel is a *palindrome*, a sequence that reads the same *panim v'aḥor* — and that palindrome is precisely the mirror. Aboulafia's letter-wheel, turned and reversed, is a dihedral object; and the graph proves it, letter for letter, `n` copies to the turn.

A 13th-century Kabbalist set out to turn the letters until ordinary meaning dissolved. Seven hundred years later, drawn on a circle, his wheel comes back to us in the shape of a mandala, a kaleidoscope, a flower — the same forwards and backwards. Perhaps that shape is what he was turning toward all along.
