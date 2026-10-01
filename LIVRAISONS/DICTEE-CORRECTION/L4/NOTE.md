# DICTÉE — L'ÉCRAN DE CORRECTION · L4 — LE RECLASSEMENT, À BLANC (rien n'est écrit)

*Exécutant du mandat « L'écran de correction ». Ce rapport est tout ce que produit L4 : aucun fichier de l'app n'est changé, rien n'est écrit au hub. **Tu le lis et tu dis « ok » avant L5.***

## Ce qui est reclassé, et rien d'autre
1. **Une erreur « M » (manquant) posée sur un signe de ponctuation** (hors apostrophe) **devient « P »** — la règle exacte du bouton « M→P » (le signe lu dans le texte de la dictée, à la place de l'erreur).
2. **Un « mot en trop » qui est un signe de ponctuation** (hors apostrophe) **passe au forfait ponctuation** : il est compté comme une ponctuation — en brevet, dans le compte « quatre ponctuations = 0,5 » ; en préparée, au coût de la ponctuation (0,5, le même que le mot en trop).
La note est recalculée **par la fonction même de l'app** (`computeNote`, extraite de la 6.7.0-L3), **sur la base de la copie** (la base aménagée pour une copie aménagée) ; tout le reste de la copie est gardé tel quel (sa trace, ses positions, son commentaire…).

## Les nombres, et ceux de la conscience
**Au hub (lu maintenant, lecture seule)** : **21 copies touchées** sur 107 ; **2 « M » sur un signe**, **22 signes « en trop »** ; les 86 autres copies identiques octet pour octet. Les notes stockées sont toutes égales à la note recalculée avant reclassement (0 écart) : le calcul part d'une base saine.
- **« M » sur un signe** — la conscience comptait 3 chez Banksy et 2 chez Pythagore ; je trouve **1 et 1** : les autres sont des **M sur une apostrophe** (2 chez Banksy, 1 chez Pythagore), que la règle exclut (une apostrophe est une élision, pas une ponctuation). Les Dylan et le brevet blanc 3E : 0, comme elle.
- **Signes « en trop »** — Dylan **4 (3 copies)**, Banksy **4**, Pythagore **1** : comme elle ; brevet blanc 3E : **13** et non 14 — le 14ᵉ est **une apostrophe seule** mise en trop, exclue par la même règle.
- **L'instantané du kit (27/09, anonymisé)** donne les mêmes résultats pour les quatre dictées qu'il partage avec le hub, plus deux dictées de la 5e Hergé (supprimées du hub depuis) : 26 copies touchées, 119 intactes et identiques.

## Ce que ça change pour la note — à lire avant de dire « ok »
- **En brevet**, un signe « en trop » ne coûte plus 0,5 ; il rejoint les ponctuations, qui coûtent 0,5 **par tranche de 4**. Une copie gagne donc 0,5 par signe… **sauf si ce signe lui fait atteindre une nouvelle tranche de 4 ponctuations** : alors le 0,5 retiré au mot en trop revient en forfait, et la note ne bouge pas. **Tes Dylan** : 3 copies touchées → **1 gagne 0,5, 2 ne bougent pas** (leur ponctuation atteint une tranche de 4).
- **En préparée**, la ponctuation coûte 0,5, comme le mot en trop : **le reclassement ne change pas la note** (la copie compte simplement une ponctuation au lieu d'un mot en trop).
- « M » → « P » : en brevet, la ponctuation au forfait (gain de 0,5 au plus) ; en préparée, de 1 à 0,5.

## La forme d'un signe « en trop » reclassé — mesurée, et ma recommandation
Le mandat dit : « il quitte `extras` et devient une erreur P rattachée au signe (ou à la position d'insertion) ; tu mesures la forme que `errors` permet ». **Mesuré : `errors` ne connaît que les mots du texte** — chaque erreur est rattachée à un mot par sa position (`idx`), une seule par mot (l'écran, le mode rapide, l'autocorrection de l'élève et ses exercices s'y fient). **Un signe en trop n'est pas un mot du texte.** Deux formes possibles :
- **(A)** le sortir de `extras` en erreur P rattachée au mot après lequel il est écrit : **2 collisions au hub** (ce mot porte déjà une erreur : l'une des deux disparaîtrait de l'écran) ; et l'élève verrait apparaître dans son autocorrection **une « ponctuation manquante » à corriger qui n'en est pas une**.
- **(B) — ma recommandation** : le signe **reste dans les mots en trop, marqué « ponctuation »** (`type: "P"`), et **compté au forfait ponctuation** par le calcul de la note. Aucune collision, l'écran le montre toujours où l'élève l'a écrit (« + , »), l'autocorrection de l'élève ne change pas, et la règle de Paul est tenue : il est compté comme une ponctuation, plus comme un mot en trop.
C'est la forme (B) que le calcul de ce rapport applique. **Si tu dis « ok », L5 l'applique pour de bon** (avec la corbeille avant, la ligne « n copies reclassées », la ponctuation en trop automatique à la saisie, et le bouton « M→P » retiré).

## Une chose que L5 corrigera au passage
Le bouton « M→P » actuel **reconstruit la copie en perdant ses autres champs** (la position du mode rapide, celle du mode texte, le commentaire de bilan) ; le reclassement de L5 garde tout (c'est ce que ce rapport simule).

## Le détail, copie par copie — au hub

### Dictée brevet blanc 3E — 3E Charles de Gaulle (brevet, sur 10)
*Les élèves sont désignés par leur rang dans la grille de la classe — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°1 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 2,5 | **3** |
| n°5 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 5 | **5,5** |
| n°13 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 5 | **5,5** |
| n°16 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 2,5 | **3** |
| n°18 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 6 | **6,5** |
| n°19 | signe « en trop » → forfait ponctuation : « . » (après le mot 88) | 10 | 0,5 | **1** |
| n°20 | signe « en trop » → forfait ponctuation : « - » (après le mot 64) | 10 | 0 | **0** |
| n°22 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 5 | **5,5** |
| n°23 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |
| n°25 | signe « en trop » → forfait ponctuation : « . » (après le mot -1)<br>signe « en trop » → forfait ponctuation : « . » (après le mot 88) | 10 | 0 | **0** |
| n°26 | signe « en trop » → forfait ponctuation : « . » (après le mot -1)<br>signe « en trop » → forfait ponctuation : « . » (après le mot 88) | 10 | 8,5 | **9,5** |

Les **17 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 17, 21, 24, 27, 28 (empreintes avant/après dans `rapport_*.json`).

### Dictée brevet blanc 4E — 4e Banksy (brevet, sur 10)
*Les élèves sont désignés par leur rang alphabétique des copies (classe absente) — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°11 | M sur un signe → P : « - » (mot 91) | 10 | 5,5 | **6** |
| n°12 | signe « en trop » → forfait ponctuation : « ? » (après le mot 87) | 10 | 7 | **7,5** |
| n°17 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |
| n°19 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 1 | **1,5** |
| n°26 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |

Les **23 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 18, 20, 21, 22, 23, 24, 25, 27, 28 (empreintes avant/après dans `rapport_*.json`).

### Dictée brevet blanc 4E — 4e Pythagore (brevet, sur 10)
*Les élèves sont désignés par leur rang alphabétique des copies (classe absente) — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°22 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |
| n°28 | M sur un signe → P : « ? » (mot 116) | 10 | 3 | **3,5** |

Les **26 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27 (empreintes avant/après dans `rapport_*.json`).

### Dictée n°1 type brevet (avec révisions), extrait de la lettre de Fritz — 3_dylan_bob (brevet, sur 10)
*Les élèves sont désignés par leur rang dans la grille de la classe — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°1 | signe « en trop » → forfait ponctuation : « - » (après le mot 146)<br>signe « en trop » → forfait ponctuation : « - » (après le mot 147) | 10 | 0 | **0** |
| n°7 | signe « en trop » → forfait ponctuation : « , » (après le mot 31) | 10 | 0 | **0** |
| n°12 | signe « en trop » → forfait ponctuation : « - » (après le mot 136) | 10 | 0 | **0,5** |

Les **20 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 2, 3, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 (empreintes avant/après dans `rapport_*.json`).

## Le détail — l'instantané du kit (27/09, anonymisé)

### Dictée 5E, chapitre utopie — 5e HERGÉ (préparée, sur 20)
*Les élèves sont désignés par leur rang dans la grille de la classe — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°7 | signe « en trop » → forfait ponctuation : « . » (après le mot -1)<br>signe « en trop » → forfait ponctuation : « - » (après le mot 66) | 20 | 1 | **1** |

Les **30 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 (empreintes avant/après dans `rapport_*.json`).

### Dictée brevet blanc 3E — 3E Charles de Gaulle (brevet, sur 10)
*Les élèves sont désignés par leur rang dans la grille de la classe — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°4 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 5 | **5,5** |
| n°12 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 5 | **5,5** |
| n°15 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 2,5 | **3** |
| n°17 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 6 | **6,5** |
| n°18 | signe « en trop » → forfait ponctuation : « . » (après le mot 88) | 10 | 0,5 | **1** |
| n°19 | signe « en trop » → forfait ponctuation : « - » (après le mot 64) | 10 | 0 | **0** |
| n°21 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 5 | **5,5** |
| n°22 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |
| n°24 | signe « en trop » → forfait ponctuation : « . » (après le mot -1)<br>signe « en trop » → forfait ponctuation : « . » (après le mot 88) | 10 | 0 | **0** |
| n°25 | signe « en trop » → forfait ponctuation : « . » (après le mot -1)<br>signe « en trop » → forfait ponctuation : « . » (après le mot 88) | 10 | 8,5 | **9,5** |
| n°28 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 2,5 | **3** |

Les **17 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 13, 14, 16, 20, 23, 26, 27 (empreintes avant/après dans `rapport_*.json`).

### Dictée brevet blanc 4E — 4e Banksy (brevet, sur 10)
*Les élèves sont désignés par leur rang dans la grille de la classe — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°11 | M sur un signe → P : « - » (mot 91) | 10 | 5,5 | **6** |
| n°12 | signe « en trop » → forfait ponctuation : « ? » (après le mot 87) | 10 | 7 | **7,5** |
| n°17 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |
| n°19 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 1 | **1,5** |
| n°25 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |

Les **23 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 18, 20, 21, 22, 23, 24, 26, 27, 28 (empreintes avant/après dans `rapport_*.json`).

### Dictée brevet blanc 4E — 4e Pythagore (brevet, sur 10)
*Les élèves sont désignés par leur rang dans la grille de la classe — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°22 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |
| n°28 | M sur un signe → P : « ? » (mot 116) | 10 | 3 | **3,5** |

Les **26 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27 (empreintes avant/après dans `rapport_*.json`).

### Dictée préparée 5e grandes découvertes — 5e HERGÉ (préparée, sur 10)
*Les élèves sont désignés par leur rang dans la grille de la classe — jamais par leur nom ni leur clé (la clé d'un élève est son nom).*

| élève | ce qui est reclassé | base de la copie | note avant | note après |
|---|---|---|---|---|
| n°2 | signe « en trop » → forfait ponctuation : « . » (après le mot 19)<br>signe « en trop » → forfait ponctuation : « . » (après le mot 27) | 10 | 5 | **5** |
| n°9 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 0 | **0** |
| n°10 | signe « en trop » → forfait ponctuation : « . » (après le mot 22) | 10 | 8,5 | **8,5** |
| n°11 | signe « en trop » → forfait ponctuation : « . » (après le mot -1)<br>signe « en trop » → forfait ponctuation : « . » (après le mot 7)<br>signe « en trop » → forfait ponctuation : « . » (après le mot 18) | 10 | 4 | **4** |
| n°12 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 1,5 | **1,5** |
| n°26 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 1 | **1** |
| n°27 | signe « en trop » → forfait ponctuation : « . » (après le mot -1) | 10 | 6 | **6** |

Les **23 autres copies** ne sont pas touchées — chacune relue avant et après le passage : **identique octet pour octet** (toutes) ; élèves n° 1, 3, 4, 5, 6, 7, 8, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30 (empreintes avant/après dans `rapport_*.json`).

## Comment c'est fait
`reclassement_a_blanc.js` (joint) avec `noyau_note.js` (les fonctions `tokenize`, `isPunct`, `estApostrophe`, `computeNote`, `bonusRepetitions`, `toArr`, `baseDeCopie` et les barèmes, **copiées telles quelles de la 6.7.0-L3**) ; entrée : l'instantané du kit, et une lecture du vrai hub (`/correction_dictee`, `/classes` — lecture seule, rien n'est écrit, aucun nom ne sort : les élèves sont remplacés par leur rang). Pour chaque copie intacte, l'empreinte SHA-256 avant et après le passage est donnée dans `rapport_hub.json` / `rapport_kit.json`.
