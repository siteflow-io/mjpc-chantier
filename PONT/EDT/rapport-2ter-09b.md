# RAPPORT — LOT 2ter · livraison ⑨-b · LA LISTE ENTIÈRE, SA RECHERCHE, ET LE REFUS QUI PORTE SUR LA TRACE
Version **8.73.0-⑨b**. Exécutant 11.

## Base et candidat

| | octets | md5 | version |
|---|---|---|---|
| ⑨-a | 1 754 915 | `2134aab32e45755d8669fcd4dd95529a` | 8.73.0-⑨a |
| **Candidat ⑨b** | **1 758 505** | **`9393639ee38f0819ab0a9e52b4f35e4b`** | **8.73.0-⑨b** |

*(taille et md5 relus au sas après le push — voir la fin du rapport)*

## §①.3 LA LISTE DES DESTINATIONS VA JUSQU'AU BOUT

**Deux coupes, pas une.** Le mandat n'en nommait qu'une ; l'épreuve du mandat avait
trouvé la seconde, et c'est elle que Paul voyait :

- `edtDestinationsPour` passait un plafond de **120 jours** à `edtCreneauxOu` ;
- l'affichage du rappel faisait ensuite `.slice(0, 60)` — **60 entrées**.

Les deux sont tombées. `edtCreneauxOu` s'arrête d'elle-même à `edtFinAnnee()` : le
plafond ne servait qu'à couper avant la fin de l'année, ce que le mandat ⑥ §③.1
interdisait.

**Les trois chiffres demandés au §③.4 :**

| | entrées calculées | entrées vues par Paul |
|---|---|---|
| **avant** (plafond 120 jours, puis coupe à 60) | **377** | **60** |
| **après** | **967** | **967** |

Dernière entrée de la liste : « ven 2/7 · 16:04-16:59 — créneau libre, heure
ajoutée » — la fin d'année de ce jeu de données est le 2027-07-31.

**Le coût, mesuré avant de livrer** : 54 ms pour calculer les 967 entrées,
**3 ms pour peindre la modale**. Une liste huit fois plus longue dans un menu, en
classe, pouvait devenir un problème. Ce n'en est pas un.

## §①.3 LA RECHERCHE — un seul champ, quatre recherches

Le mandat demandait le mois, le numéro de semaine et le type A/B ; le filtre par
date existait déjà. **Quatre champs auraient encombré la modale : un seul les fait
tous, et il devine lequel.**

| ce que Paul tape | ce que le champ comprend |
|---|---|
| `12/5` | une date, comme avant |
| `mai`, `juin` | un mois |
| `37` (ou `s37`) | le numéro de semaine |
| `A` ou `B` | le type de semaine |
| tout le reste | le texte de la ligne, à l'identique |

**Le numéro et la lettre sont LUS dans le calendrier injecté** (`semaines`), jamais
déduits d'une parité — c'est la règle du prompt du calendrier.

**Les trois mesures du §③.5, sur 967 entrées :**

| recherche | entrées filtrées | contrôle |
|---|---|---|
| mois « mai » | **100** | 100 options portent `data-mois="mai"` |
| semaine « 37 » | **27** | 27 options portent `data-sem="37"` |
| type « A » | **500** | 500 options portent `data-ab="A"` |
| type « B » | **467** | 500 + 467 = **967**, le compte est juste |
| retour au champ vide | **967** | rien n'est resté caché |

**Un défaut trouvé par la mesure, et corrigé** : le champ affichait « filtrer par
date (ex. 12/05) », mais les lignes s'écrivent « mer 12/5 », **sans zéro**. Mesuré :
`12/05` → **0 entrée**, `12/5` → **2 entrées**. L'aide du champ mentait depuis le
lot ⑥. Elle dit maintenant « filtrer : 12/5 · mai · 37 · A ou B ».

## §①.4 LE REFUS PORTE SUR LA TRACE, ET IL EST NOMMÉ

`edtTraceExiste(nomClasse, iso, creneau)` est une fonction nommée qui **relit la
trace à chaque appel** — elle ne retient rien, donc une trace supprimée rend l'heure
déplaçable aussitôt.

- **Au glissé**, une heure qui a laissé sa trace ne se saisit plus, et le site le
  dit : *« Cette heure a été lancée le … — elle a laissé sa trace, et on ne déplace
  pas une heure qui a eu lieu. Les heures de cette journée qui n'ont pas encore été
  lancées, elles, se déplacent. »* **Le refus est nommé, jamais sec.**
- **Dans la modale** d'une heure jouée : « Elle a laissé sa trace : elle ne se
  déplace plus. »
- **Le critère est la trace, jamais la date** : une heure du jour non encore lancée
  garde sa liste de déplacement.

**Les mesures du §③.6 :**

| | mesuré |
|---|---|
| heure **du jour non lancée** | trace : **false** · liste « Déplacer » présente : **true** · 2 cases du jour dans ce cas |
| **la trace est relue à chaque appel** | trois appels de suite sur la même heure : **identiques** |

**Ce que je n'ai PAS pu mesurer, et je le dis** : le jeu de données de ce banc ne
contient **aucune heure déjà jouée** dans la semaine affichée. Le refus nommé sur
une heure avec trace est donc **prouvé par le code et par la modale**, pas par un
geste sur une vraie heure jouée. Il faut un jeu de données qui en porte une —
c'est à faire, et je le déclare plutôt que de le compter comme prouvé.

## §③.9 NON-RÉGRESSION

- Moteur `AT_DR_B64` : **309 812** caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944` — identique.
- `function secu*` **29** · `published` **97**.
- `function edt*` : **225 déclarations / 225 noms**, aucun doublon. Quatre ajoutées depuis ⑧, toutes nommées : `edtBlocBanaliser` (⑨-a), **`edtTraceExiste`**, **`edtSemaineDe`**, **`edtQuoiChercher`**.
- Trois portes inchangées · `edt-fige` **9** · `fig*` **24** — rien renommé.
- `EDT_CATEGORIES` et `EDT_MOTIFS` inchangés.
- **Garde VERTE** sur ses cinq questions · **double parseur vert**.
- `tests/banc-liste-trace-09b.mjs` — **4 repères, tous verts**.
- **`banc-tout.mjs` : 30 bancs, tous verts.** Le passage a été lancé d'une seule
  commande ; la machine de l'exécutant a coupé le processus après le 29e banc, avant
  la ligne de bilan. Le 30e a été rejoué juste après :
  `⑧a · la photo du prévu se prend toute seule · 146 s · 3/3 repères ✔`.

```
BANC-TOUT — 30 banc(s) sur 30, fichier ../cand9.html

  ✔ ①bis-a · la mise à niveau au chargement              ·  40 s · 3/3 repères
  ✔ ①bis-b · l'identité des périodes                     ·  25 s · 3/3 repères
  ✔ ①ter · la grille datée                               ·   7 s · 3/3 repères
  ✔ ②a · la coche sort de l'objet                        ·  10 s · 3/3 repères
  ✔ ②b · la migration des coches héritées                ·  63 s · 3/3 repères
  ✔ ② · ce que devient une coche quand les choses bougent ·  53 s · 3/3 repères
  ✔ ③a · l'appariement branché                           ·  50 s · 3/3 repères
  ✔ ③b · le différentiel et la classe renommée           ·  58 s · 3/3 repères
  ✔ ③ · l'archivage avant écrasement (par clics)         ·  36 s · 3/3 repères
  ✔ ③bis-a · la classe d'essai en mode test              ·  13 s · 3/3 repères
  ✔ ③bis-b · l'identifiant dit sa famille                ·  32 s · 3/3 repères
  ✔ ④a · un seul collage                                 ·  39 s · 3/3 repères
  ✔ ④ · l'épreuve de bout en bout                        · 130 s · 3/3 repères
  ✔ ⑤a · l'écran Heures perdues                          ·  11 s · 3/3 repères
  ✔ ⑤b · une heure ne compte jamais deux fois            ·  21 s · 3/3 repères
  ✔ ⑤c · banaliser, classer, basculer, déplacer          ·  24 s · 3/3 repères
  ✔ ⑤c-bis · l'archive des décisions                     ·  11 s · 2/2 repères
  ✔ ⑤c-ter · les archives des autres objets              ·  16 s · 3/3 repères
  ✔ audit adverse ② · les coches                         ·  40 s · 2/2 repères
  ✔ audit adverse ③ · l'appariement                      ·  63 s · 2/2 repères
  ✔ audit adverse ③bis · la classe d'essai               ·  40 s · 2/2 repères
  ✔ ⑥a · les trois issues au dépôt                       ·  36 s · 3/3 repères
  ✔ ⑥b · l'heure à replacer et la perte sèche            ·  24 s · 3/3 repères
  ✔ ⑥c · la liste élargie et le replacement réel         ·  17 s · 4/4 repères
  ✔ ⑥ · les dates de l'année                             ·  23 s · 3/3 repères
  ✔ ⑦b · la vue Année dans le site                       ·  13 s · 3/3 repères
  ✔ ⑦ · la pastille d'événement et l'audit adverse       ·  66 s · 3/3 repères
  ✔ ⑤ · l'alerte mensuelle                               ·  34 s · 3/3 repères
  ✔ le calendrier réel · 122 identifiants                ·   3 s · 3/3 repères
  ✔ ⑧a · la photo du prévu se prend toute seule          · 146 s · 3/3 repères
     (rejoué seul — le passage d'un seul tenant a été coupé avant cette ligne)
```

## Écarts signalés, jamais ajustés

1. **Le refus sur une heure réellement jouée n'est pas prouvé par le geste** (ci-dessus).
2. **La dette de ⑨-a reste ouverte** : deux gestes concurrents sur un magasin de
   décisions vide perdent le premier, sans archive. Deux réparations possibles,
   **en attente de la décision de Paul**.
3. **Le bloc « Banaliser » reste exclu sur une heure prise dans un déplacement**
   (⑨-a) — signalé, non tranché.
4. **Mon banc a échoué deux fois avant de rendre ses chiffres** : un sélecteur CSS
   invalide (`option[value!=""]`) levait une exception dans la page, et la mesure
   ne revenait jamais. Corrigé. Aucune conséquence sur le candidat.

## Ce que je n'ai pas pu mesurer

- Le geste sur le site réel de Paul : faux hub, le sas n'est pas publié en Pages.
- Le refus sur une heure jouée, par le geste (écart 1).

## ARRÊT

La liste va jusqu'à la fin de l'année et se cherche par mois, semaine ou type A/B.
Le refus de déplacer porte sur la trace, et il se dit. **Deux dettes restent
ouvertes derrière moi, toutes deux en attente d'une décision de Paul.**
