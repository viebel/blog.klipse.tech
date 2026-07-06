---
layout: post
title:  "Aboulafia and the formula Bill Gates studied"
description: "Aboulafia's ordering of the permutations — built from a cyclic shift and a final swap — turns out to be the very same Hamiltonian cycle that Shimon Zaks generated in 1984 by pancake flips, the move a young Bill Gates analysed in his only scientific paper. Two descriptions, seven centuries apart, of one order."
date:   2026-07-06 10:00:00 +0200
categories: aboulafia
thumbnail: assets/aboulafia-hero.png
guid: FD0887F7-F3AE-47FB-AFF4-D39F58BB5951
author: Yehonathan Sharvit
tags: [aboulafia, math, permutations, pancake, zaks]
---

*Second article in [the series]({% post_url 2026-07-06-aboulafia-tserouf-first-permutation-algorithm %}). In the [first part]({% post_url 2026-07-06-aboulafia-tserouf-first-permutation-algorithm %}) we saw that Aboulafia's tserouf is a recursive algorithm for permutations, driven by one simple rule — send the first letter to the end, and repeat at every scale. Here is the part that still gives me chills — the same order was rediscovered in 1984, through a completely different door.*

## Pancakes, and Bill Gates's only paper

Imagine a stack of pancakes of different sizes. The one move you are allowed is to slide a spatula somewhere into the stack and **flip everything above it**. How many flips does it take to sort the stack, largest at the bottom?

This is the **pancake problem**, and in 1979 it was the subject of the only scientific paper ever published by William H. Gates — yes, that Bill Gates — with Christos Papadimitriou: *Bounds for Sorting by Prefix Reversal* (*Discrete Mathematics* 27, pp. 47–57). They proved that `(5n+5)/3` flips always suffice; the bound stood as the best known for three decades.

"Flipping the top of the stack" is a **prefix reversal**: reverse a block of a sequence. Hold on to that move.

## Zaks, 1984: all permutations by reversals

In 1984 the mathematician Shimon Zaks published *A new algorithm for generation of permutations* (*BIT* 24). His idea: generate all `n!` permutations by a sequence of block reversals, so that each appears exactly once and the whole thing forms a single closed loop — a **Hamiltonian cycle** on the pancake graph, the graph whose moves are precisely those pancake flips.

Zaks's construction is recursive. For three letters (writing the letters as positions `1 2 3`), his order is the cycle:

```
123  →  132  →  231  →  213  →  312  →  321  →  (back to 123)
```

Notice something. This is *exactly* the sequence Aboulafia gives in *Or ha-Sekhel* — `abc, acb, bca, bac, cab, cba` — letter for letter.

## The coincidence: one order, two descriptions

That could be a fluke at three letters. It is not. I checked the two constructions against each other by computer, and **they produce the identical ordering** — at three letters, four, five, six, on and on. Aboulafia's order *is* Zaks's order.

What makes this beautiful is that the two men build it by entirely different moves:

- **Zaks** advances by **prefix/suffix reversals** — Bill Gates's pancake flip.
- **Aboulafia** advances by **turning the wheel** — the *gilgoul*, sending the first letter to the end, of [the first article]({% post_url 2026-07-06-aboulafia-tserouf-first-permutation-algorithm %}).

Different machinery, same Hamiltonian cycle. And the two descriptions are not even strangers: inside Zaks's own formula, the step that moves from one block of the cycle to the next is precisely a cyclic shift of the symbols — Aboulafia's `R`. The cyclic wheel of the 13th-century Kabbalist is hiding inside the 1984 combinatorial algorithm.

So, to be exact: Aboulafia did *not* flip pancakes. But the order he prescribed is the pancake-graph Hamiltonian cycle that Zaks would discover seven centuries later — and that cycle lives on the very operation Bill Gates once analysed. The bridge between them is not the move; it is **the order itself**.

## I asked the people who would know

I did not fully trust my own eyes, so I wrote to them. I discussed it with **Professor Shimon Zaks** himself, and with **Professor Aaron Williams**, another researcher on permutation-generation orders. Both were struck — not only that a 13th-century mystic had produced this exact ordering, but that the tserouf text carries the seed of a recursive, inductive construction. It is hard, after that, to keep calling it simply "Zaks's order."

## Why the *order* matters

You might think any systematic ordering of permutations is as good as any other. It is not. The specific order Aboulafia chose has mathematical properties that other orderings — even other Hamiltonian cycles on the very same pancake graph — simply do not have.

To see them, you have to **draw** the order. When you do, it stops being a list and becomes an object of startling beauty. That is [the next article]({% post_url 2026-07-06-the-caustics-of-the-aboulafia-graph %}).
