---
layout: post
title:  "Aboulafia's Tserouf: an algorithm hidden in a 13th-century meditation"
description: "In Or ha-Sekhel, the Kabbalist Abraham Aboulafia prescribes a systematic way to run through every arrangement of the letters of a word. With only two or three simple rules, he describes what we would now call a recursive algorithm for generating permutations."
date:   2026-07-06 09:00:00 +0200
categories: aboulafia
thumbnail: assets/tserouf_abc.png
guid: 5F24E14A-03A9-45D8-9CD8-357083136A3B
author: Yehonathan Sharvit
tags: [aboulafia, math, permutations, kabbalah, history]
---

This is the first article in a series about a discovery I made while researching **Tserouf** in the writings of the Kabbalist Abraham Aboulafia (1240 – after 1291). Tserouf is the Kabbalistic art of permuting the letters — and, in plain mathematical terms, it is the enumeration of all the **permutations** of an `n`-letter word.


## The context

In *Or ha-Sekhel* ("The Light of the Intellect"), chapter 23, *The Tserouf*, Aboulafia prescribes a systematic method for enumerating all the possible arrangements of an `n`-letter word. The method is conceived inside a frame of spiritual practice — and yet it carries a mathematical structure of remarkable rigour.

For a three-letter word, Aboulafia gives the Tserouf — the ordering of all six permutations — explicitly:

<p align="center"><img src="/assets/tserouf_abc.png" alt="The tserouf (permutations) of three letters, in Aboulafia's order" width="26%"></p>

The words fall into three groups, by their first letter:

1. first, the words starting with `a`;
2. then, those starting with `b`;
3. finally, those starting with `c`.


## The two rules for three letters

Aboulafia explicitly mentions two rules for the Tserouf of 3 letters:

**Rule 1 — the mirror.** The whole sequence must *end on the reverse of where it began*. Aboulafia says it plainly: "the last utterance is the reverse of the first." The first word is `abc`; the last must be `cba`, its end-to-end reversal.

**Rule 2 — hold the head.** Keep the leading letter for as long as possible before letting it go. You exhaust every word beginning with `a`, then every word beginning with `b`, then `c`. The head does not change until it has to.

These two rules are almost enough to force the entire three-letter order. The *hold the head* rule sets the three groups in the order `a`, `b`, `c`. Within a group only the last two letters can swap, and the mirror rule pins down the first group — it must start with `abc` — and the last, which must end with `cba`.

Almost — but one case nagged at me: why does `bca` come before `bac`, and not the reverse? Nothing in the two rules seems to force it.

**That one small question is the engine of this whole discovery.** Sometimes a simple question turns out to be precious. I could not let go of it for months — and, as it turns out, chasing it is what led to everything in this series.

## From n to n + 1: turn the wheel

How do you get from the order for three letters to the order for four? Aboulafia gives one more rule, and it is the heart of the whole thing:

> Go back to the beginning, and send the first letter to the end of the word.

That is, **rotate the word by one notch**. `abcd` becomes `bcda` becomes `cdab` becomes `dabc` — four rotations, four heads, four groups. And inside each group, you apply the very same method to the letters that remain.

<p align="center"><img src="/assets/tserouf_abcd.png" alt="The tserouf (permutations) of four letters, in Aboulafia's order" width="100%"></p>

Each of the four rows is headed by one rotation of the word, and each row is a complete copy of the three-letter order applied to the letters left behind.

## The uniform rule

Here is what reveals Aboulafia's genius. The whole procedure — for three letters, four, ten, any number — is governed by **one operation, applied again and again at every scale**: *send the first letter to the end.*

It is this single rotation that carries you from one group to the next at the top level. It is the same rotation that, applied to the letters left over, builds each group one level down. And again, one level below that. A single gesture walks the entire nested hierarchy of permutations. The method does not grow more complicated as the words get longer; it simply re-applies the same move to shorter and shorter sub-words.

This is what a computer scientist would call a **recursive algorithm** — and a beautifully economical one. The rule is trivial to state, yet it generates all `n!` arrangements, each exactly once, and returns you to the start.

Aboulafia names the whole thing in the very first line of the chapter:

> *This rule is easy to understand; and though it has no end that we can grasp, it necessarily has an end.*

Three clauses, three moments: the rule is simple; what it unfolds outruns anything we can hold in mind; and yet the walk is finite — it closes, it *necessarily has an end.*

## The only others who did this

What I did not know, at the time, was how much was hanging on it.

Until the 17th century, no one but Aboulafia had given an *ordering* of the permutations at all. Every other tradition — every other Kabbalist — simply listed them in **tables**. That tiny choice between `bca` and `bac` was the visible tip of the only systematic method in the world.

There is one striking historical parallel. The only other people to independently invent a rule-based way to run through all the permutations were the English **change-ringers** in the 17th century.

The ringers found their order in the bell tower; Aboulafia found his in a spritual practice. Different worlds, same goal: a method to traverse the whole space of permutations, missing none and repeating none. And Aboulafia did it in the 13th century — three hundred years before the bell-ringers, and seven hundred before computer science.

## Where this goes

So Aboulafia gave a genuine recursive algorithm for permutations. That alone would be a fine historical note. But there is much more.

His exact ordering turns out to coincide with an algorithm published in 1984 by the mathematician Shimon Zaks — reached through an entirely different door, and built on a move that a young Bill Gates studied in his only scientific paper. That is [the next article]({% post_url 2026-07-06-aboulafia-and-the-formula-bill-gates-studied %}). And when you *draw* Aboulafia's order, something happens that no one expects — [that is where the series is heading]({% post_url 2026-07-06-the-caustics-of-the-aboulafia-graph %}).
