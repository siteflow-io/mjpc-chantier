# LOT F — RAPPORT DE PHASE 0 : LES DEUX CONFLITS SONT REPRODUITS, ET ILS N'EN FONT QU'UN
Exécutant MJPC · 25/08/2026 · **écrit avant toute ligne de correctif.**

## ⓪ SCEAU
Production retéléchargée : md5 **`3b945b55daee272a1809a638ed170531`**, **1 513 609 octets**, `APP_VERSION` **8.69.0** = attendu.
Banc à **trois pages** (pilote PC 1440×900 + téléphone 390×844 + mur 1360×768), faux hub en mémoire, **le téléphone est la source**, comme chez Paul. Décor : l'écran 1 réel — consigne + 6 étapes. **0 écriture sortie · 0 `pageerror`.**

## ① LA REPRODUCTION, CHIFFRÉE

| geste | scène émise | PILOTE PC | MUR | au mur |
|---|---|---|---|---|
| tout dévoilé au téléphone | `vues {0:6}` · morceau 0 · iz 1 | découpe **[6]** vues **[6]** · **6/6** | découpe [6] vues [6] · **6/6** | étapes **1 2 3 4 5 6** |
| **cran 5 depuis le téléphone** | **`vues {0:3}`** · morceau 0 · iz 4 | découpe **[3,3]** vues **[3,3]** · 6/6 · **sur le morceau 0** | découpe [2,1,3] vues [2,1,0] · **3/6** · **sur le morceau 1** | **étape 3 seule** |
| cran 3 | `vues {0:3}` | découpe [3,3] vues **[3,0]** · **3/6** | [3,3] vues [3,0] · 3/6 | étapes 1 2 3 |
| **cran 1 — dézoom** | `vues {0:3}` | découpe **[6]** vues **[3]** · **3/6** | [6] vues [3] · **3/6** | étapes 1 2 3 |

**Conflit ① reproduit** : au cran 5, le PC est sur le morceau **0** (étapes 1·2·3) et le mur sur le morceau **1** — il projette l'étape 3 seule pendant que le professeur regarde 1·2·3.
**Conflit ③ reproduit** : parti de **6 étapes dévoilées**, on finit à **3**. Les étapes 4, 5 et 6 sont **revoilées**. C'est exactement ce que Paul décrit.

## ② LA RACINE — une seule, et elle est visible dans une case du tableau
**Au cran 5, la scène passe de `vues {0:6}` à `vues {0:3}`.** Ce n'est pas le téléphone qui l'écrit : son cadre fait 0×0, il n'a jamais scindé, son écran porte toujours `vues [6]` puis `[3]` **reçues**. C'est **le PC** qui l'émet, et voici pourquoi, sur pièces :

`sesPhoto` (L≈16560) calcule le dévoilement cumulé ainsi :
```js
if(e.suite)_vp=_drVuePere(W,n);
```
**Le cumul n'est calculé que depuis un morceau de SUITE.** Or après le zoom, le PC est scindé mais reste sur le **morceau 0** — qui n'est pas une suite. Il émet donc les `vues` de **ce seul morceau** : **3**, alors que **6** sont dévoilées dans le groupe. Le reste suit mécaniquement :

1. le mur reçoit 3 → il ne voit plus que 3 étapes dévoilées → `_drMorceauDuDevoilement` le mène au **dernier morceau entamé**, qui n'est plus celui du professeur → **conflit ①** ;
2. le téléphone reçoit 3 et le réémet ;
3. **le PC lui-même reçoit 3** (adoption du cran, complément 1 du LOT E) et **écrase ses propres `vues`** : il passe de 6/6 à 3/6 ;
4. au dézoom, `reabsorbe` recolle 3 + 0 = **3** → **conflit ③**.

**Les deux conflits n'en font qu'un.** Le mur ne « choisit pas le bon morceau » parce qu'on lui a menti sur le dévoilement. Et le dévoilement recule parce que la scène annonce un cumul partiel.

**Les trois hypothèses du mandat, jugées sur pièces** : le référentiel du téléphone → **écarté** (il ne fait que réémettre ce qu'il reçoit) · le recollement `max` du complément 2 → **écarté** (il ne touche que `suiteEt`, absent ici) · deux émetteurs qui se croisent → **écarté** (aucune oscillation ; le PC et le téléphone convergent sur la même valeur fausse).

## ③ CE QU'IL FAUT CHANGER — trois points, une racine
1. **La scène doit porter le dévoilement du GROUPE ENTIER**, pas le cumul jusqu'au morceau courant : c'est le référentiel unique que le mandat demande. Une fonction dédiée (`_drVueGroupe`), `_drVuePere` restant en place pour l'offset de fiche.
2. **La position doit être déclarée explicitement**, pas déduite : un champ `pos` vrai quand l'appareil a un écran de contrôle qui découpe (cadre mesurable). Le mur suit alors **le morceau** ; sans `pos` (téléphone seul), il continue de choisir par dévoilement, comme au LOT E.
3. **Le récepteur qui est scindé doit recoller avant d'appliquer.** Poser un dévoilement de groupe sur un père de 3 étapes sans réabsorber laisse deux états incompatibles ; il faut `reabsorbe` → poser → `rendre` → aller au morceau, exactement ce que `_sesTabComposer` fait déjà côté mur.

Et, indépendamment, **la réglette du téléphone devient − / +** (décision de Paul : « la réglette est très difficile à piloter au doigt »).

## ④ CE QU'AUCUN BANC NE PROUVERA
Le hub réel · la latence (hors périmètre, lot 3) · le vidéoprojecteur · **le doigt de Paul sur les boutons**. Le juge reste Paul, debout au fond de sa salle.

---
*Phase 0 close. Aucun code écrit à ce stade.*
