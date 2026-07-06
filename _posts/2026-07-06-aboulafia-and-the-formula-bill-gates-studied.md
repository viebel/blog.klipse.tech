---
layout: post
title:  "Aboulafia and the formula Bill Gates studied"
description: "Aboulafia's ordering of the permutations is the very order Shimon Zaks generated in 1984 by reversing suffixes — keeping the head fixed and flipping the tail. The mirror of that move, prefix reversal, is the subject of Bill Gates's only scientific paper."
date:   2026-07-06 10:00:00 +0200
categories: aboulafia
thumbnail: assets/aboulafia-hero.png
guid: FD0887F7-F3AE-47FB-AFF4-D39F58BB5951
author: Yehonathan Sharvit
tags: [aboulafia, math, permutations, pancake, zaks]
---

*Second article in [the series]({% post_url 2026-07-06-aboulafia-tserouf-first-permutation-algorithm %}). In the [first part]({% post_url 2026-07-06-aboulafia-tserouf-first-permutation-algorithm %}) we saw that Aboulafia's Tserouf is a recursive algorithm for permutations, driven by one simple rule — send the first letter to the end, and repeat at every scale. Here is the part that still gives me chills — the same order was rediscovered in 1984, through a completely different door.*

## Bill Gates's only paper

Imagine a stack of pancakes of different sizes. The one move you are allowed is to slide a spatula somewhere into the stack and **flip everything above it**. How many flips does it take to sort the stack, largest at the bottom?

This is the **pancake problem**. It was first posed in 1975 by one *Harry Dweighter* — say the name aloud: a *harried waiter*, forever sorting his stack of pancakes — which was the pen name of the mathematician Jacob E. Goodman. Four years later it became the subject of the only scientific paper ever published by William H. Gates — yes, that Bill Gates — with Christos Papadimitriou: [*Bounds for Sorting by Prefix Reversal*](https://doi.org/10.1016/0012-365X%2879%2990068-2). They proved that `(5n+5)/3` flips always suffice; the bound stood as the best known for three decades.

Flipping the top of the stack is a **prefix reversal**: reverse the *front* block of a sequence. Hold on to that move — and notice which end it acts on.

## Zaks, 1984: a sequence of suffix lengths

In 1984 the mathematician Shimon Zaks published [*A new algorithm for generation of permutations*](https://doi.org/10.1007/BF01937486) — with no knowledge of any 13th-century Kabbalist. His idea: list all `n!` permutations so that **each one is obtained from the previous by reversing a suffix** — flipping the last `k` letters — so that the whole order is described by nothing but the sequence of those lengths `k`.

Here is the order his rule produces for three letters, each link labelled by the length `k` of the suffix it reverses:

<p align="center"><img src="/assets/Tserouf_abc_numbers.png" alt="The order Zaks's rule produces for three letters, each link labelled by the suffix length reversed" width="30%"></p>

The lengths form a clean, regular beat: **2, 3, 2, 3, 2**. Reverse the last two letters, then all three, then the last two, then all three, then the last two. That short list of numbers *is* Zaks's whole ordering of three letters.

Now four:

<p align="center"><img src="/assets/Tserouf_abcd_numbers.png" alt="The order Zaks's rule produces for four letters, each link labelled by the suffix length reversed" width="100%"></p>

Look at what happened. Each of the four rows is **the three-letter pattern, unchanged** — `2, 3, 2, 3, 2` — and the rows are stitched together by a single `4`.

## The recursive formula

That nesting is the whole algorithm. Zaks writes the sequence of suffix lengths as `sₙ`, and defines it in one compact line:

```
s₂ = 2
sₙ = (sₙ₋₁ n)^(n−1) sₙ₋₁      for n > 2
```

In plain English: **to build the recipe for `n` letters, take the recipe for `n−1` letters, tack the number `n` onto the end of it, and repeat that block `n−1` times — then write the `n−1` recipe once more at the end.** 

The base case, `s₂ = 2`, is simply "reverse the last two letters".

Unfolded, the suffix lengths for three letters are:

```
2 3 2 3 2
```

and for four letters:

```
2 3 2 3 2 4
2 3 2 3 2 4
2 3 2 3 2 4
2 3 2 3 2
```

Read `s₄` in blocks: each line is `s₃` — the beat `2 3 2 3 2` — and the blocks are joined by a single `4`. The recursion in one glance.

And here is *why* it works. Every length in `sₙ₋₁` is at most `n−1`, so those reversals **never touch the first letter**: the head stays fixed while the tail runs through all of its arrangements. The only length equal to `n` is the full reversal — the `4` between the blocks — which swings a fresh letter to the front. Do it until every letter has taken its turn leading, and you have all `n!` permutations, back where you began.

## The coincidence — and the hidden constraint

Zaks reached this order in 1984 for a thoroughly modern reason — I will come to it — and with no idea that anyone had been here before. Yet the words his rule produces are, letter for letter, Aboulafia's words in Aboulafia's order. I did not believe it either, so I checked the two constructions against each other by computer: they give the **identical ordering** — three letters, four, five, six, on and on. 

> Aboulafia's Tserouf *is* Zaks's order.

And the reason they coincide is the constraint we just saw: Zaks's reversals never disturb the head, only the tail. That is, word for word, Aboulafia's second rule — *hold the head*. Suffix reversal is not a modern trick laid on top of the Tserouf; it is the Tserouf's **hidden constraint**, the very thing Aboulafia insisted on, seven centuries before Bill Gates gave it a name and Zaks found a recursive formula for the sequence of lengths that enumerates all the permutations.


## I called Zaks

I picked up the phone and called **Shimon Zaks** — today 75 — to thank him, and to ask the question that had been nagging at me: why had he cared about an *ordering* of permutations in the first place?

His reason was purely practical. Say you have written a sorting algorithm that takes `n` inputs, and you want to be sure it really works. You cannot try all `n!` possible inputs — there are far too many — so you test it on *random* permutations. An elegant way to achieve that is with two operations: turning a random number into a permutation (to produce a test case), and turning a permutation back into its number (to record it, reproduce it, reason about it). That back-and-forth is **ranking** and **unranking** — and Zaks gives an efficient formula for ranking and unranking in this paper.

I did not realize it during the call, but that same ranking and unranking is exactly what lets you *draw* Aboulafia's order — to jump straight to any of its `n!` positions without walking through all the rest. It is the key to the next article.

## Why the *order* matters

You might think any systematic ordering of permutations is as good as any other. It is not. The specific order Aboulafia chose has mathematical properties that other systematic orderings of the same permutations simply do not have.

To see them, you have to **draw** the order. When you do, it stops being a list and becomes an object of startling beauty. That is [the next article]({% post_url 2026-07-06-the-caustics-of-the-aboulafia-graph %}).
