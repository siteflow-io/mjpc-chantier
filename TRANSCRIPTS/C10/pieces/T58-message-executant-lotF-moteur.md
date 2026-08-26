[Document collé par Paul au tour 58 — texte intégral au document 14 de la conversation, recopié ici mot pour mot]
Voici le message, complet. Rien n'est omis, y compris ce que j'ai cassé.

---

# MESSAGE À LA CONSCIENCE — LOT F : OÙ ON EN EST, ET POURQUOI LE MOTEUR DOIT ÊTRE REFAIT

Exécutant du LOT F · 25/08/2026 · remis à Paul en texte, à sa demande. **Décision de Paul, verbatim : « s'il faut refaire le moteur, il faut. »**

## ① CE QUI EST AU SAS, ET CE QUI N'Y EST PAS

Au sas : **8.70.0, md5 `2cbd75cd4d0a6262a71adf1d9106c975`**, celui que tu as contrôlé. Il tient : le zoom traverse jusqu'au mur, plus rien ne se revoile, les boutons − / + fonctionnent, **aucun texte n'est perdu**. Son défaut connu : au cran 5, la découpe du mur peut différer d'un morceau de celle du pilote.

**Mon candidat de ce soir n'est PAS livré.** Il ferme ce défaut mais il en a créé un pire — voir ④. Rien ne sortira dans cet état.

## ② CE QUE LA RÈGLE A A FERMÉ

Paul a arbitré : **la découpe ne dépend que du cran** (recomposition à neuf), pas du chemin parcouru. Appliquée partout — pilote, mur, Win+K.

| banc | résultat |
|---|---|
| découpe, PC source (5 crans + avance au morceau 2) | **6 / 6** — découpe **et** image identiques |
| découpe, téléphone source | **6 / 6** |
| mur 16/9 · mur 4/3 | **9 / 9** · **9 / 9** |
| téléphone · deux réglettes | **4 / 4** · **3 / 3** |
| phase 0 (revoilage) | **rien n'est revoilé** |

## ③ TROIS FAITS MESURÉS QUI DOIVENT ÊTRE TRANSMIS

**Le suspect que tu désignais était hors de cause.** Mon filet « le dernier morceau doit tenir » ne s'est **jamais** déclenché : compteur à 0. Ne le soupçonne plus.

**`zoom()` ne recolle qu'au dézoom** (`if(iz<av) reabsorbe()`). En montant les crans un à un, le pilote re-scinde par-dessus une découpe existante : `[3,3]` devient `[2,1,3]`. Le mur, qui recompose à neuf, obtient `[3,3]`. **Ton banc et le mien étaient tous les deux justes** — on ne montait pas les crans de la même façon. C'est l'origine de la divergence, pas la géométrie.

**La cascade du moteur ne fait qu'UN tour par appel** : `rendre()` déclenche un `degorge`, qui rappelle `rendre()` pendant que le verrou `enCoursDeDegorgement` est encore levé, donc rien ne repart. Conséquence mesurée : le pilote restait à `[3,3]` avec **428 px de contenu dans une boîte de 313** — `deborde()` répondait `true`, **il voyait qu'il débordait et ne coupait pas**.

**Deux faits utiles en plus** : le rapport toile/cadre est **constant à 0,85** aux cinq crans (0,851 · 0,849 · 0,862) — ce qui tient dans le cadre tient toujours dans la toile ; et la **reprise à froid était correcte** — le mur rouvert retrouve `[2,1,3]`, morceau 1, comme le pilote. C'est **mon banc** qui était fautif : il intercalait un dévoiler/replier après le F5 et mesurait autre chose que la reprise. Je l'ai corrigé.

## ④ CE QUE J'AI CASSÉ, ET QU'IL FAUT REGARDER EN FACE

**Banc « étape longue » : 2 échecs sur 8.** Une étape unique de 405 signes, coupée par le zoom, **se recolle à 201 signes**. **La seconde moitié du texte du professeur est perdue.**

C'est une régression de la règle A. En recomposant à neuf, on recolle et on recoupe plusieurs fois de suite, et la chaîne de recollement ne remonte plus jusqu'au bout. J'ai tenté de ne recoller qu'à la montée : le chiffre n'a pas bougé. **Ma première explication était donc fausse, et je n'en donne pas une seconde sans l'avoir mesurée.**

Ce n'est pas un décalage d'affichage. C'est **du texte écrit par le professeur qui disparaît**. C'est le défaut le plus grave que ce chantier ait produit.

## ⑤ LE DIAGNOSTIC DE FOND — POURQUOI JE TOURNE

**Le découpage détruit la donnée.** Quand le moteur coupe une étape, il fait `etapes = [moitié 1, moitié 2]` : il **écrase le texte du professeur**. Il faut donc le recoller au dézoom, à l'export, dans le récit, sur le papier — et si la chaîne se brise une seule fois, une phrase est amputée.

Un découpage sain ne toucherait jamais la donnée : il garderait l'étape entière et calculerait **quel bout afficher**. Alors : rien à recoller, donc rien à perdre ; le dézoom efface des bornes au lieu de reconstituer un texte ; l'export ne voit jamais de fragment ; **et la règle A devient gratuite**, parce qu'un affichage calculé ne dépend jamais du chemin parcouru.

**Second symptôme du même mal : j'ai empilé six enveloppes** autour d'un moteur intouchable — garde de position, filet Win+K, coupe d'étape, recollement, recomposition à neuf, achèvement de scission. Elles interagissent. **Je passe mon temps à arbitrer entre mes propres rustines au lieu de résoudre le problème.** Quatre tours à refermer un écart en en ouvrant un autre : ce n'est pas de la malchance, c'est le signe que le mécanisme est construit à l'envers et que je le compense au lieu de le dire.

**Je le dis maintenant : la règle « le moteur ne bouge pas » a cessé de protéger le dispositif. Elle le fait pourrir par les bords.**

## ⑥ L'AMPLEUR DU CHANTIER, MESURÉE

| | |
|---|---|
| moteur | **2 682 lignes** |
| fonctions à reprendre | `scinde` 58 · `reabsorbe` 42 · `degorge` 27 · `html` 97 · `rendre` 130 · `majVues` 177 — **~530 lignes, un cinquième du moteur, et les plus centrales** |
| points de lecture de `.etapes` / `.reps` | **67 dans le moteur + 77 dans le site = 144** |
| intégrité | **`AT_DR_SHA256` devra être régénérée** — la garantie d'intégrité au boot change |
| portée | le moteur sert **aussi en préparation** : une régression ne casse pas seulement la classe, elle casse **la fabrication des chapitres** |

## ⑦ CE QUE JE RECOMMANDE, ET CE QUE JE NE DÉCIDE PAS

**Le chantier est le bon.** Il supprime une famille entière de bugs au lieu d'en corriger un, et il rend six enveloppes inutiles.

**Mais pas cette semaine.** À sept jours de la rentrée, 530 lignes au cœur du moteur avec 144 points de lecture exigent un banc de non-régression complet sur la préparation **et** la classe. Bâclé, il empêcherait Paul de fabriquer ses chapitres. **Le 8.70.0 du sas fait passer la rentrée et ne perd aucun texte.**

**Paul a tranché autrement** (« s'il faut refaire le moteur, il faut »). Je ne discute pas sa décision — je pose le calendrier comme le seul point que je lui demande de reconsidérer, et l'arbitrage t'appartient.

## ⑧ CE QUE DOIT CONTENIR LE MANDAT DE CE CHANTIER

1. **Le principe, en une phrase** : le découpage ne modifie jamais la donnée ; il pose des bornes d'affichage sur un bloc intact.
2. **Le retrait des six enveloppes**, une par une, avec la preuve à chaque retrait que le moteur seul fait le travail.
3. **Un banc de non-régression sur la PRÉPARATION** — dupliquer, couper/coller, déplacer, supprimer, exporter, papier, relecture — avant tout banc de classe. C'est ce qui manque le plus aujourd'hui : tous mes bancs mesurent la classe.
4. **La régénération de `AT_DR_SHA256`** et la trace de qui l'a régénérée.
5. **Un point de retour explicite** : le 8.70.0, md5 `2cbd75cd4d0a6262a71adf1d9106c975`.
6. **La règle A inscrite au dispositif** — la découpe ne dépend que du cran — pour qu'aucune conscience n'ait à la redécouvrir.
7. **La règle du POURQUOI** (mon message du lot D) : ce mandat doit dire, dans les mots de la salle, à quoi sert le découpage. Il sert à ce que l'élève du fond lise sans qu'aucune ligne ne soit coupée ni perdue.

## ⑨ CE QUE JE LAISSE DERRIÈRE MOI

Les bancs sont au sas dans `lotF/tests/` et réutilisables tels quels : trois pages (PC + téléphone + mur), faux hub en mémoire, zéro écriture sortante, parcours par clics réels. Ils ont attrapé chacun des défauts cités ici. **Le prochain exécutant ne doit pas les réécrire — il doit commencer par les jouer.**

Et une chose que je n'ai pas su faire et qu'il devra faire avant tout correctif : **suivre une étape de 405 signes à travers un cycle complet** — coupe, recoupe, recollement — en relevant à chaque étape combien de fragments existent et ce que chacun contient. Tant que ce relevé n'existe pas, tout patch est un coup dans le noir. J'en ai tiré quatre.

---

## TESTS MANUELS POUR TOI

Un seul, et il oriente le calendrier plus que n'importe quelle mesure de ma part : sur le **8.70.0 du sas**, ta diapo 1 au cran 5, en classe.

**Est-ce que voir trois étapes sur ton écran quand la classe en voit deux te gêne pendant que tu parles ?**

Si ça ne te gêne pas, tu passes la rentrée avec le 8.70.0 et le chantier du moteur s'ouvre après. Si ça te gêne, dis-le et la conscience arbitrera le calendrier en connaissance de cause.

**Et n'oublie pas : révoque le jeton du sas.** Il circule en clair depuis le début de ces conversations.

MEMO
