# RAPPORT — LOT 2ter · livraison ⑥c-bis · UNE FUITE GLOBALE, ET CE QU'ELLE CACHAIT
Version **8.73.0-⑥c-bis**. Correctif signalé par Paul le 01/09.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ⑥c | 1 742 164 | `8977a8a59b07cf0e31d9336e5d8c76d9` | 8.73.0-⑥c |
| **Candidat ⑥c-bis** | **1 743 164** | **`3bbc12e64edbb1a75091358e4a86d1c0`** | **8.73.0-⑥c-bis** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses cinq questions.

## Le signalement de Paul
`var edtOut=[],edtD=edtDepart=depuis||edtAujourdhui();` — **`edtDepart` n'était pas déclaré** : le fichier n'ayant pas de `'use strict'`, chaque appel de `edtVerifierCoherence` créait une variable **globale**. Et `edtD` n'était jamais relu. Écrit comme demandé :
`var edtOut=[],edtDepart=depuis||edtAujourdhui();`

**J'ai cherché s'il y en avait d'autres**, avec un petit outil posé au sas — `tests/fuites.mjs` : il parcourt l'arbre du fichier et liste **les identifiants assignés qui ne sont déclarés nulle part**. Résultat sur le bloc script principal : **6 fuites, aucune dans le bloc EDT** — `ctxSommaireCible`, `ctxSommaireOuvrir`, `ed2SelectionnerSeance`, `chValiderChapitre`, `chInjecter`, `chInjecterConfirme`. Elles sont **préexistantes et hors de mon périmètre** : je les signale, je n'y touche pas.

## CE QUE LA CORRECTION A FAIT SORTIR — un vrai défaut, corrigé ici
Le banc de ⑥c a rejoué, et cette fois il a choisi **une destination prise par une autre classe** (l'ordre des options dépend de la date du jour). `edtVerifierCoherence` — qui marchait, elle — a alors rendu :
> **2026-09-02 10:07-11:02 : 3E Charles de Gaulle et 4E BANKSY au même créneau**

**`edtReplacerHeure` posait sans rien vérifier.** Depuis ⑥c la liste propose aussi les créneaux pris ; y replacer une heure mettait donc **deux classes au même moment, en silence**. Corrigé : le site **dit le prix avant**, comme partout ailleurs — mesuré, texte exact :
> mercredi 2 septembre à 11:04-11:59, c'est **4E BANKSY**.
> Y poser l'heure de 3E Charles de Gaulle mettrait **deux classes au même moment**.
> — *Choisir un autre créneau* / *La poser quand même*

**Écritures avant la réponse : `[]`.** Ce n'est pas un refus : Paul tranche, et rien ne se fait dans son dos.

**La preuve de ⑥c tient toujours**, sur un créneau libre : **TOTAL heures perdues 4E BANKSY 1 → 0**, 0 heure à replacer, **télescopages `[]`**.

## Non-régression
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` md5 `2ba70f9ef8aacb6f81962ea4e1b62944` · **`function edt*` 203**, aucune ajoutée, aucune disparue · **node --check** et **acorn ES2020** VERTS · garde VERTE sur cinq questions.
**`banc-tout.mjs` rejoué en entier — 26 bancs, 79 repères (un de plus : l'annonce du créneau pris), aucun échec** : ①bis-a 34 s · ①bis-b 21 s · ①ter 6 s · ②a 10 s · ②b 46 s · ② 41 s · ③a 41 s · ③b 42 s · ③ 31 s · ③bis-a 12 s · ③bis-b 28 s · ④a 28 s · ④ 101 s · ⑤a 9 s · ⑤b 17 s · ⑤c 17 s · ⑤c-bis 9 s · ⑤c-ter 13 s · audits ② 29 s, ③ 47 s, ③bis 29 s · ⑥a 27 s · ⑥b 17 s · **⑥c 14 s (4/4 repères)** · alerte 26 s · 122 identifiants 3 s.

## Écarts signalés, jamais ajustés
1. **Six fuites globales subsistent hors du bloc EDT** (liste ci-dessus). Préexistantes, hors mandat. `tests/fuites.mjs` permet de les revoir d'une commande — si Paul veut que la garde les refuse, c'est une sixième question possible.
2. **Le garde-fou du replacement se souvient de la confirmation par un champ temporaire** (`__confirme`) posé puis retiré sur la décision. Il ne part jamais au hub : la pose écrit une valeur reconstruite. Je le dis parce que c'est un champ qui existe une fraction de seconde en mémoire.
3. **Les deux dettes de ⑥c restent ouvertes** : la recherche par mois / semaine / type A-B dans la liste, et le refus de déplacer une heure dont la trace existe.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : faux hub ; le sas n'est pas publié en Pages.
- **Les 26 bancs d'affilée dans un seul processus** : environnement coupé à ~90 s ; joués en sept tranches, toutes par `banc-tout`.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑥c-bis**) · `tests/fuites.mjs` (nouveau) · `tests/banc-destinations-06c.mjs` (le cas du créneau pris) · `tests/banc-tout.mjs` · `rapport-2ter-06c-bis.md` (ce rapport).

## ARRÊT
La fuite est fermée, et elle en cachait une autre : replacer une heure sur un créneau pris mettait deux classes au même moment sans un mot. **Aucune dette nouvelle ; deux dettes de ⑥c restent ouvertes.** Reste la livraison **⑥** : les dates de l'année, les captures, l'audit adverse, le rapport final.
