# RAPPORT — LOT 2ter · livraison ⑨-a · LES CAPTURES QUI MANQUAIENT, ET UN GESTE QUI N'EXISTAIT PAS
Version **8.73.0-⑨a**. Exécutant 11.

## Base et candidat

| | octets | md5 | version |
|---|---|---|---|
| Base ⑧ | 1 753 661 | `c6d62dc787682d86ba60159c7a699c93` | 8.73.0-⑧ |
| **Candidat ⑨a** | **1 754 915** | **`2134aab32e45755d8669fcd4dd95529a`** | **8.73.0-⑨a** |

**Relu au sas après poussée, identique bit à bit** — commit `18b19f1a06dd`.

## CE QUE ⑨-a A TROUVÉ EN CLIQUANT — et pourquoi il a fallu du code

Le mandat ⑨-a devait être **sans code** : prendre les captures que ⑤ et ⑥ n'avaient
jamais livrées. Dès le premier écran, le geste demandé s'est révélé **inatteignable**.

Le mandat ⑤ §⑧.13 exigeait « une banalisation par-dessus, avec son annonce ».
Mesuré sur la même case, avant et après une coche :

| état de la case | boutons proposés par la modale |
|---|---|
| sans décision | `▶ Ouvrir le pilotage et lancer` · **`Banaliser cette heure`** |
| avec une coche | `▶ Ouvrir le pilotage et lancer` · `↶ Annuler cette décision` |

Le bloc « Banaliser » n'apparaissait que si la case ne portait **aucune** décision,
et `edtSansSeance` n'avait que cet unique appelant. **L'annonce « Cette heure est
déjà comptée perdue — la banaliser remplacera ce motif » n'était atteignable par
aucun clic.** Elle existait depuis ⑤, elle était prouvée au banc — mais par appel
de fonction, et le banc ⑤b l'écrivait lui-même : *« appel de fonction : déclaré »*.
Personne n'avait relevé ce que ça voulait dire.

**Tranché par Paul le 02/09** : « Banaliser » doit être proposé sur une case qui
porte déjà une décision. Passer par « ↶ Annuler » ferait repasser son compte par
zéro, ce que le §② du mandat ⑤ interdit.

### Le correctif

Le bloc « Banaliser » est sorti dans une fonction nommée, **`edtBlocBanaliser`**, et
proposé dans les deux branches de la modale. Même texte, mêmes catégories, même
bouton : rien n'a changé de ce que Paul lit.

**Deux états restent exclus, et c'est déclaré** : une heure **jouée** (elle a eu
lieu), et une heure prise dans un **déplacement** — elle porte `deplaceeVers` au
départ ou `venantDe` à l'arrivée. La banaliser effacerait le lien avec son autre
bout et laisserait une heure épinglée orpheline à l'autre extrémité. **Ce point n'a
pas été tranché par Paul : il est signalé, pas décidé.**

`function edt*` : **221 → 222 déclarations pour 222 noms**, une seule ajoutée
(`edtBlocBanaliser`), aucune disparue, aucun doublon.

## §③.1 LES CAPTURES DE ⑤ — quatre écrans, par clics

`tests/captures-heures-perdues-05.mjs` · `05-perdues-1…4.png` · journal
`05-perdues-journal.txt`. Parcours cliqué : panneau prof → Emploi du temps →
Ouvrir → « Heures perdues… ».

| écran | ce qu'il contient |
|---|---|
| 1 · l'écran Heures perdues | 6 fiches, 10 cases, 0 cochée · en tête : « Ce que l'année t'a coûté — Aucune heure perdue pour l'instant » |
| 2 · une coche | clic sur « Séjour Verdun 3e · 14-16 octobre · tes 3e perdraient 2 heures » → 1 décision, motif `calendrier` · en tête : « 3E Charles de Gaulle · cette année, 1 heure perdue, dont 1 déclarée justifiée » |
| 3 · **l'annonce** | clic sur « Banaliser cette heure » → *« Cette heure est déjà comptée perdue — événement du calendrier — Séjour Verdun 3e. La banaliser remplacera ce motif. L'heure ne sera comptée qu'une fois, et son statut deviendra modifiable. »* — deux boutons, Annuler et Remplacer le motif |
| 4 · le total en tête | après « Remplacer le motif » : motif `calendrier` → `banalisee`, catégorie « Événement d'établissement » |

**LA PREUVE QUI COMPTE — une heure ne compte jamais deux fois** : décisions **1 → 1**,
heures justifiées **1 → 1**. Le compte n'est jamais repassé par zéro.

## §③.2 LES CAPTURES DE ⑥ — cinq écrans, par clics

`tests/captures-issues-06.mjs` · `06-issues-1…5.png` · journal `06-issues-journal.txt`.

| écran | ce qu'il contient |
|---|---|
| 1 · la liste des destinations | **968 entrées**, dont **139 créneaux « pris par une autre classe »** |
| 2 · **les trois issues** | *« mercredi 2 septembre à 11:04-11:59, c'est 4E BANKSY. Échanger : 3E Charles de Gaulle et 4E BANKSY permutent leurs deux heures — personne ne perd rien. Prendre le créneau : 4E BANKSY perd son heure du mercredi 2 septembre — elle devient une heure à replacer, et le site te la rappellera. »* · boutons : Ne rien faire · Échanger les deux heures · Prendre le créneau |
| 3 · l'échange | **4 décisions, 1 seule écriture** — les deux départs partent, les deux arrivées arrivent, personne ne perd d'heure |
| 4 · l'écrasement | 4E BANKSY reçoit `aReplacer`, **justifiée false**, « prise par 3E Charles de Gaulle » |
| 5 · le rappel | *« 1 heure à replacer — 4E BANKSY · mercredi 2 septembre 11:04-11:59 · prise par 3E Charles de Gaulle »* avec son menu « — la replacer… — » |

**Une condition qu'il fallait connaître** : ces captures n'existent qu'avec **deux
classes appariées** (`grille-deux-classes.json`). Avec la grille à une seule classe
appariée, aucun créneau n'est « pris » et les trois issues ne peuvent pas s'ouvrir —
c'est ce qui rendait ces écrans impossibles à produire.

## §③.3 L'AUDIT ADVERSE DE ⑥ — les sept cas du §⑦.15

`tests/audit-adverse-06.mjs`. **Aucune erreur de page sur tout l'audit.**

| cas | mesuré |
|---|---|
| échange avec une classe **non appariée** | refus nommé : « ce créneau est pris par 4 TURING, une classe que le site ne connaît pas encore — apparie-la d'abord » · les trois issues **ne s'ouvrent pas** · **0 écriture** |
| écrasement d'une heure **déjà à replacer** | 1 heure à replacer avant, **1 après** — pas de doublon · 0 télescopage |
| heure replacée **sur sa propre case de départ** | **0** heure « à la fois partie et arrivée » · 0 télescopage |
| trois classes qui tournent | 5 décisions, 1 à replacer, **0 télescopage**, écran debout |
| `finAnnee` avancée avec **dix heures au-delà** | les dix sont **nommées une par une** : « 10 heures posées après la nouvelle fin d'année : à replacer — 3E Charles de Gaulle jeudi 10 juin 08:00-08:55, … » · les dix passent en `aReplacer` |
| **deux gestes concurrents sur la même case** | **2 écritures, 0 archive, le journal ne garde que le second** — voir la dette ci-dessous |
| une heure à replacer dont la **classe disparaît** de la grille | 6 cases retirées · l'heure **reste au magasin** · le rappel l'affiche toujours par son nom · **aucune exception**, écran debout |

## LA DETTE QUE L'AUDIT A TROUVÉE — déclarée, non résolue

**Deux gestes lancés coup sur coup sur la même case perdent le premier, sans
archive.** Mesuré : 2 écritures, **0 archive**, journal réduit au second geste.

Cause, mesurée à la ligne :
`function edtDecisions(){ return (EDT.decisions&&typeof EDT.decisions==='object')?EDT.decisions:{}; }`
Tant que le magasin des décisions est **vide**, chaque appel rend **un objet neuf**.
Les deux gestes travaillent alors chacun sur le sien, et le second écrase le premier
au hub. Et comme `avant` valait `null` des deux côtés, **rien n'a été archivé** : le
geste perdu n'est récupérable nulle part.

Le défaut est étroit — dès que le magasin contient une décision, les deux gestes
mutent la même référence et rien ne se perd. Mais c'est étroitement **le jour de la
rentrée**, sur un magasin encore vide.

**Deux réparations possibles, et le choix appartient à Paul** : soit `edtDecisions()`
pose l'objet dans `EDT.decisions` dès le premier appel (une ligne), soit les
écritures de décisions se sérialisent derrière un verrou, comme la mise à niveau le
fait déjà (plus sûr, plus lourd). **Rien n'a été codé sans sa décision.**

## §③.9 NON-RÉGRESSION

- Moteur `AT_DR_B64` : **309 812** caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944` — identique.
- `function secu*` **29** · `published` **97** · `edt*` **222 / 222**, aucun doublon.
- Trois portes inchangées · `edt-fige` **9** — rien renommé.
- `EDT_CATEGORIES` et `EDT_MOTIFS` inchangés.
- **Garde VERTE** sur ses cinq questions · **double parseur vert** (node --check + acorn ES2020).
- **`banc-tout.mjs` : 30 bancs, 87 repères, TOUT PASSE**, d'une seule commande
  (`node tests/banc-tout.mjs ../index.html`) :

```
BANC-TOUT — 30 banc(s) sur 30, fichier ../cand9.html

  ✔ ①bis-a · la mise à niveau au chargement              ·  41 s · 3/3 repères
  ✔ ①bis-b · l'identité des périodes                     ·  25 s · 3/3 repères
  ✔ ①ter · la grille datée                               ·   7 s · 3/3 repères
  ✔ ②a · la coche sort de l'objet                        ·  10 s · 3/3 repères
  ✔ ②b · la migration des coches héritées                ·  64 s · 3/3 repères
  ✔ ② · ce que devient une coche quand les choses bougent ·  53 s · 3/3 repères
  ✔ ③a · l'appariement branché                           ·  45 s · 3/3 repères
  ✔ ③b · le différentiel et la classe renommée           ·  59 s · 3/3 repères
  ✔ ③ · l'archivage avant écrasement (par clics)         ·  35 s · 3/3 repères
  ✔ ③bis-a · la classe d'essai en mode test              ·  13 s · 3/3 repères
  ✔ ③bis-b · l'identifiant dit sa famille                ·  33 s · 3/3 repères
  ✔ ④a · un seul collage                                 ·  39 s · 3/3 repères
  ✔ ④ · l'épreuve de bout en bout                        · 126 s · 3/3 repères
  ✔ ⑤a · l'écran Heures perdues                          ·  11 s · 3/3 repères
  ✔ ⑤b · une heure ne compte jamais deux fois            ·  21 s · 3/3 repères
  ✔ ⑤c · banaliser, classer, basculer, déplacer          ·  23 s · 3/3 repères
  ✔ ⑤c-bis · l'archive des décisions                     ·  12 s · 2/2 repères
  ✔ ⑤c-ter · les archives des autres objets              ·  17 s · 3/3 repères
  ✔ audit adverse ② · les coches                         ·  40 s · 2/2 repères
  ✔ audit adverse ③ · l'appariement                      ·  64 s · 2/2 repères
  ✔ audit adverse ③bis · la classe d'essai               ·  40 s · 2/2 repères
  ✔ ⑥a · les trois issues au dépôt                       ·  36 s · 3/3 repères
  ✔ ⑥b · l'heure à replacer et la perte sèche            ·  24 s · 3/3 repères
  ✔ ⑥c · la liste élargie et le replacement réel         ·  16 s · 4/4 repères
  ✔ ⑥ · les dates de l'année                             ·  22 s · 3/3 repères
  ✔ ⑦b · la vue Année dans le site                       ·  13 s · 3/3 repères
  ✔ ⑦ · la pastille d'événement et l'audit adverse       ·  67 s · 3/3 repères
  ✔ ⑤ · l'alerte mensuelle                               ·  34 s · 3/3 repères
  ✔ le calendrier réel · 122 identifiants                ·   3 s · 3/3 repères
  ✔ ⑧a · la photo du prévu se prend toute seule          · 135 s · 3/3 repères

TOUT PASSE — 30 banc(s), 87 repères vérifiés
```

## Écarts signalés, jamais ajustés

1. **La dette des deux gestes concurrents** (ci-dessus) — déclarée, en attente de la décision de Paul.
2. **Le bloc « Banaliser » reste exclu sur une heure déplacée** — signalé, non tranché.
3. **Dans le script de captures ⑥, la dernière modale s'ouvre par appel de fonction.**
   Plutôt que de l'écrire « déclaré » et de passer, j'ai vérifié si le geste était
   atteignable : **il l'est** — 18 cases à l'écran, 18 éléments cliquables, et la
   case de la classe qui a perdu son heure correspond à l'un d'eux. C'est mon
   sélecteur qui rate après le repeint, pas le site.
4. **Les sept cas de l'audit adverse passent par des appels de fonction**, chacun
   déclaré avec le geste équivalent et le fait qu'il soit atteignable. Un audit
   adverse enchaîne des états que le clic seul met très longtemps à produire.

## Ce que je n'ai pas pu mesurer

- Le geste sur le site réel de Paul : faux hub, le sas n'est pas publié en Pages.
- Ce que donnent deux gestes concurrents **sur un magasin déjà rempli** en conditions
  réelles de réseau — mesuré ici avec un hub qui répond instantanément.

## ARRÊT

Les quatre captures de ⑤ et les cinq de ⑥ existent, l'audit adverse de ⑥ est joué,
et l'annonce de remplacement est prouvée **par le clic** — elle ne l'avait jamais
été. **Une dette est ouverte et nommée : deux gestes concurrents sur un magasin vide
perdent le premier.** Rien n'est parti en production.
