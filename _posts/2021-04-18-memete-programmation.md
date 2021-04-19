---
layout: post
title: La notion de mêmeté en programmation 
description: Un aspect fondamental de l'importance des manipulations de valeurs en programmation fonctionnelle.
date:   2021-04-18 17:04:28 +0200
categories: dop
thumbnail: assets/klipse.png
author: Yehonathan Sharvit
minified_plugin: true
draft: true
tags: [dop, maths]
---

On parle souvent de l'importance d'écrire notre code en termes de fonctions pures qui, comme les fonctions mathématiques, n'ont pas d'effets de bords et retournent les mêmes valeurs pour les mêmes arguments. Dans cet article, je vous propose d'explorer un autre aspect fondamental de la différence entre la programmation fonctionnelle et la programmation orientée objet: la notion de mêmeté, c'est-à-dire: comment définit-on que deux "choses" sont les mêmes?

# Une histoire un peu bateau 

Connaissez-vous l'histoire du bateau de Thésée? Ce héros grec dont le bateau, selon la légende, aurait été préservé par les Athéniens durant des siècles: ils retiraient les planches usées du bateau et les remplaçaient jusq'au point où il ne restait plus aucune planche d'origine.

Se posa alors la question de savoir s'il s'agissait encore du même bateau ou bien si l'entretien en avait fait un tout autre bateau.

Qu'en pensez-vous? Et surtout qu'est-ce que cela a à voir avec les maths et la programmation?

![ship](/assets/theseus.png)

# La mêmeté en maths

Commençons par les maths en nous posant une question similaire concernant le concept le plus fondamental des mathématiques: le concept d'ensemble.

Prenons un ensemble avec trois éléments: les nombres 1, 2 et 3.

Que se passe-t-il quand on remplace un nombre de cet ensemble, par exemple: le nombre 3 par le nombre 4?

Bien évidemment, nous obtenons un ensemble différent de l'ensemble d'origine!

Maintenant imaginons que nous ayons un ensemble avec les nombres 1, 2 et 10. Que se passe-t-il quand on remplace 10 par 3? Et bien, me direz-vous nous obtenons un ensemble avec les nombres 1, 2 et 3. 

Un ensemble avec les nombres 1, 2 et 3 comme celui de l'exemple précédent? S'agit-il du même ensemble ou bien d'un autre ensemble avec les mêmes éléments? Drôle de question, non?

Et bien pour les mathématiques, la réponse est formelle: deux ensembles ayant les mêmes éléments sont les mêmes! C'est l'un des axiomes de la théorie axiomatique des ensembles. Cet axiome porte même un joli nom: on l'appelle l'axiome de l'extensionnalité[^extensionality].

Selon les mathématiques donc, le bateau de Thésée n'est plus le même dès que l'on remplace une de ses planches.

# La mêmeté en programmation

Passons à la programmation maintenant, si vous le voulez bien. Imaginons un produit vendu sur un site e-commerce, une jolie tasse à café, par exemple. Simplifions les choses et disons qu'une tasse ne possède que deux attributs: un descriptif et un prix. Que se passe-t-il quand on baisse le prix d'une tasse? S'agit-il de la même tasse ou bien d'une autre tasse? 

Bien évidemment, il s'agit de la même tasse! En programmation, l'identité d'un objet ne se résume pas à la valeurs de ses attributs. 

Selon la programmation donc, le bateau de Thésée reste le même, bien que toutes ses planches aient été remplacées.


# La programmation fonctionnelle

Nous sommes ici au coeur d'une contradiction manifeste entre le monde de la programmation et le monde des mathématiques. Comme l'a si joliment écrit Bruce MacLennan en 1982[^paper]:

> Les mathématiques, c'est de la programmation orientée valeur.
> 
> La programmation, c'est des mathématiques orientées objet.

Ce qu'il entend par un objet, c'est une entité ayant un ensemble d'attributs à un moment donné. Alors qu'une valeur est une entité qui ne change jamais.

La programmation fonctionnelle se propose de limiter l'impact de cette contradiction en réduisant au maximum les morceaux de codes qui manipulent des objets. La plupart de notre code en programmation fonctionnelle manipule des valeurs. Alors qu'en programmation orientée objet, la manipulation d'objets se répand un peu partout dans notre code.

# Retour à Thésée

Écrire un programme de nos jours représente parfois un défi aussi grand que trouver la sortie du labyrinthe de Dédale. Selon la légende, Thésée parvint à sortir du labyrinthe de Dédale grâce à une pelote de fil qu'Ariane lui avait fournit en entrant dans le labyrinthe. Et nous, programmeurs quel est notre file d'Ariane? 

[^paper]: Maclennan, Bruce. (1982). [Values and Objects in Programming Languages](https://www.researchgate.net/publication/220177801_Values_and_Objects_in_Programming_Languages).
[^extensionality]: https://en.wikipedia.org/wiki/Axiom_of_extensionality
