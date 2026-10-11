# p8-5d — les notes suivent toujours la diapo, et le premier caractère
*Exécutant, session cloud de Claude Code, 11/10/2026. Complément `MANDATS/COMPLEMENT-DEROULE-P8-5d.md` (C13, tours 46-47), lu en entier après le mandat et le complément p8-5c. Branche `deroule/p8-5d`, partie de `deroule/p8-5c`. Règle les dettes n°13 · 13 et 14.*

## Ce que ça change pour la classe
- **Le panneau des notes montre toujours la diapo que Paul a sous les yeux.** Quand la diapo change, le panneau passe aussitôt à la nouvelle diapo, même si Paul était en train d'écrire dans une note. Ce qu'il avait tapé est déjà enregistré dans la note de la diapo d'avant, entier. Jamais une note d'une autre diapo sous ses doigts.
- **Plus aucun caractère perdu après Entrée.** Le paragraphe neuf reçoit la frappe dès la première touche, même tapée sans attendre.

## La base et son md5
- Base : le gabarit livré en p8-5c, md5 `2b2f475aa21d539c3953f061a39fc1b9` (maquette p8-5c `abbf3d2f61e52cf64e33670c907e8983`).
- `regen.sh` refait toute la chaîne jusqu'à **p8-5d**. Avant d'appliquer p8-5d, il vérifie octet pour octet chaque gabarit livré, de p8-2 à **p8-5c**. Sa sortie est dans `sorties/regen.txt`.
- `p8-5c.js` est repris identique (vérifié par `cmp`). Les deux changements sont dans **`patch-p8-5d.py`**, qui touche le code p8-5c dans le gabarit : pas de fichier `p8-5d.js`, parce que deux remplacements ne le justifient pas.

## Les décisions, et comment je les ai lues
1. **Le panneau suit la diapo courante, toujours** (point 1). La décision 8 de la NOTE p8-5c est retirée : le panneau n'attend plus la sortie du paragraphe.
   - Si le paragraphe qui a le focus appartient à une autre diapo que celle du rendu, `p8RendreNotes` lui ôte le focus (`blur`) avant de rendre.
   - Rien n'est perdu : chaque frappe est enregistrée à l'instant (règle p8-5c, point 8).
   - Ce que j'ai mesuré : par le geste (▶, ◀, une vignette, le volet de l'atelier), le clic ôte **déjà** le focus de la note avant que la diapo change. Ces bancs passaient donc déjà sur p8-5c (voir plus bas).
   - La branche « ôter le focus avant le rendu » ne sert que lorsque la diapo change sans un clic de Paul. Dans la maquette, seule l'animation accélérée de ⚙ fait cela. Dans le vrai site, ce sera tout changement de diapo venu d'ailleurs.
   - Le complément retire l'animation des bancs : je l'ai donc mesurée **à part, hors banc** (`bancs/mesure-p8-5d-sans-clic.mjs`, sorties dans `sorties/`) :
     - sur p8-5c, le panneau restait sur la diapo 1 alors que l'heure était passée à la diapo 2, le focus encore dans la note ;
     - sur p8-5d, le panneau rend la diapo 2, la note a rendu le focus, et « Silence, puis on observe. » est entier dans la note de la diapo 1.
2. **Le premier caractère après Entrée** (point 3). Dans `p8NouvelleNote`, le paragraphe neuf prenait le focus au tour suivant (`setTimeout(…, 0)`), et les touches tapées entre-temps se perdaient. Il le prend maintenant dans le même geste.
   - Cela vaut pour Entrée dans une note existante comme pour Entrée dans le premier paragraphe d'une diapo sans note.
   - Mesuré sur p8-5c avec le nouveau banc : de 1 à 3 caractères perdus à chaque fois (« yz 0.0 », « z 6.0 », « 12.1 »…). Dans la suite « Premier ↵ Deuxième ↵ Troisième », « Deuxième » devenait « ième » et « Troisième » était perdu en entier.
   - Sur p8-5d, rien ne se perd.

## Ce qui a été modifié, compté
`patch-p8-5d.py` fait 2 remplacements, chacun exigé une fois. Aucun nom nouveau. Tailles relevées par le patch (`sorties/regen.txt`) ; j'ai relu les deux fonctions en entier.

| fonction | avant | après | quoi |
|---|---|---|---|
| `p8RendreNotes` | 2 883 o / 7 lignes | 2 905 o / 7 lignes | si le paragraphe qui a le focus est d'une autre diapo : `blur`, puis le rendu (avant : `return`, le panneau attendait) |
| `p8NouvelleNote` | 670 o / 1 ligne | 730 o / 1 ligne | `focus()` du paragraphe neuf dans le même geste (avant : dans un `setTimeout`) |

Rien d'autre de p8-5c n'est touché : ni la répétition, ni les ancres, ni la mise en forme.

## Les bancs, comptés
- **`test-p8-5d`** (nouveau, 13 `ok(`, dont 4 dans des boucles), par la souris et le clavier :
  1. **Le panneau suit.**
     - Heure lancée, diapo 1 : un clic dans la note ⌂, Ctrl+Fin, puis les dix caractères « Xàéèùç1234 ».
     - Ensuite, 7 clics sur ▶ jusqu'à la diapo 2. Le panneau rend la diapo 2 : la clé portée par ses paragraphes est celle de la diapo 2. Aucun paragraphe n'a le focus. La note ⌂ de la diapo 1 finit par les dix caractères, entiers, qui ne s'affichent pas sur la diapo 2.
     - Puis ◀ : le panneau remontre la diapo 1, avec le texte.
  2. **Par une vignette du volet.** La garde « La classe te suivrait » s'ouvre, puis « Y aller devant la classe » : le panneau rend la diapo 2 et la note de la diapo 1 est entière.
     - Puis, au début de la diapo 2 (dévoilée 0), Paul écrit « Ici la deux » et clique ◀ : le panneau remontre la diapo 1, et la note de la diapo 2 est gardée.
  3. **Dans l'atelier** : pendant la frappe dans la note, un clic sur la diapo 2 du volet. Même résultat.
  4. **Le premier caractère.** Sur les diapos 1, 7 et 13, trois fois chacune : un clic dans un élément, un clic au bout de la dernière note, Ctrl+Fin, Entrée, puis la frappe **sans aucune attente**. Les 9 paragraphes sont entiers.
     - Sur la diapo 14, qui n'a pas de note : la frappe dès le clic, puis Entrée et la frappe sans attente, deux fois. Les paragraphes sont `["Premier","Deuxième","Troisième"]`.
- **Retiré de `test-p8-5c`** : le banc « taper pendant l'animation accélérée » (4 `ok(`). Le complément le retire (point 5) : l'animation est une simulation de la maquette, pas un cas de classe. Il est remplacé par le banc 1 ci-dessus, et la ligne retirée le dit en commentaire.
- **Joué sur la maquette p8-5c**, `test-p8-5d` donne 9 défauts : 8 des 9 frappes « Entrée puis frappe » du point 4 (seule « Xyz 0.2 » passait), et la diapo sans note. Les points 1 à 3 passaient déjà (voir la décision 1).
- Inchangés : les 30 autres bancs. **31 bancs dans le banc unique.**

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`
- Lancé le 2026-10-11 à 13:57 UTC : node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37.
- Maquette jouée : md5 `da37e0f02091399a6b3b1750814d9034`.
- **31 bancs, 31 × « fin : 0 défaut(s) », « TOUS LES BANCS : 0 défaut »**, en un seul passage.
- Le blocage de chargement (`page.goto` à 30 s) signalé dans la NOTE p8-5c ne s'est pas produit.

## Les captures (toutes regardées, écran entier) — les chiffres sont dans `captures/MESURES-p8-5d.txt`
| capture | ce qu'elle prouve |
|---|---|
| `p8-5d-diapo2-apres-dev.png` | heure lancée, juste après le 7ᵉ ▶ : « Diapo 2 sur 9 », le tableau de Friedrich. Le panneau des notes est celui de la diapo 2 (vide : « ✎ écris ici tes notes pour cette diapo »), sans focus. Rien de la note de la diapo 1 ne s'y voit |
| `p8-5d-diapo1-retour.png` | après ◀ : « Diapo 1 sur 9 », 6 / 6 dévoilés. La note ⌂ de la diapo 1, vive, finit par « …ait trois lignes.Xàéèùç1234 » : les dix caractères, entiers |

## Les défauts trouvés et corrigés (avec leur cause)
1. **Le premier caractère après Entrée se perdait** (dette n°13 · 14). **Cause** : le paragraphe neuf recevait le focus au tour suivant ; les touches arrivées avant allaient à la page.
2. **Le panneau pouvait montrer la note d'une autre diapo** (dette n°13 · 13). **Cause** : la décision 8 de p8-5c, qui faisait attendre le panneau. Retirée comme le tranche Paul.

## Ce qui est simulé
Rien de nouveau. Le seul changement de diapo sans clic que la maquette sait provoquer est l'animation accélérée, une simulation ; elle n'est que mesurée, hors banc.

## Ce qui reste
- Avec l'animation accélérée, une frappe qui continue après le changement de diapo n'arrive plus dans une note : la note a rendu le focus, et les touches vont à la page, où certaines lettres sont des raccourcis de classe. C'est la conséquence voulue de « une note suit sa diapo, toujours ». Je le signale, sans y toucher.

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `da37e0f02091399a6b3b1750814d9034`
- gabarit `v9c15p8-template.html` : `f4a3f4c14124041279fef059b5a429b6`
- tous les fichiers livrés : `EMPREINTES.md5`, vérifié par `md5sum -c` avant l'envoi.
