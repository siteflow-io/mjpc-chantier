# RAPPORT — LOT 2ter · livraison ⑥c · LA LISTE ÉLARGIE, LE REPLACEMENT RÉEL, LA COHÉRENCE
Version **8.73.0-⑥c**.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ⑥b | 1 737 659 | `aeb8a9d72f0aea22dbfd0de68144a9f3` | 8.73.0-⑥b |
| **Candidat ⑥c** | **1 742 164** | **`8977a8a59b07cf0e31d9336e5d8c76d9`** | **8.73.0-⑥c** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses cinq questions.

## LA PREUVE QUE PAUL A DEMANDÉE — une heure posée cesse de compter
Le rappel d'une heure à replacer porte désormais **la liste des destinations**. Choix réel dans le menu (« mar 1/9 · 08:00-08:55 — créneau libre, heure ajoutée ») :

| | |
|---|---|
| **TOTAL heures perdues 4E BANKSY, avant** | **1** |
| **TOTAL heures perdues 4E BANKSY, après la pose** | **0** |
| heures à replacer restantes | **0** |
| télescopages après la pose | **[]** |

Les deux décisions écrites, en **une seule écriture** : l'heure d'origine devient `{motif:'aReplacer', replacee:true, deplaceeVers:'2026-09-01|08:00-08:55'}` — elle sort du compte —, et la destination reçoit `{ajoutee:true, epingle:true, venantDe:…}`. **Poser l'heure ne la fait pas seulement disparaître du rappel : elle cesse d'être une heure perdue.**

## §③ — LA LISTE DES DESTINATIONS
Mesuré sur 40 jours, depuis une heure de la 3E : **161 destinations — 112 créneaux libres (« heure ajoutée »), 26 de ses propres créneaux, et 23 créneaux pris par une autre classe**, marqués nommément : « mar 1/9 · 10:07-11:02 — **pris par 4E BANKSY** ». Choisir l'un d'eux **ouvre les trois issues de ⑥a**, jamais un refus. Sans cette ligne, le geste de Paul restait impossible.
La liste va **jusqu'au 31 juillet de l'année scolaire** (`edtCreneauxOu`, 400 jours par défaut) et reste groupée par semaine.

## §④ — `edtVerifierCoherence`
Elle rend **la liste des télescopages**, pas un booléen : deux classes au même créneau le même jour, deux fois la même classe, une heure à la fois partie et arrivée. Elle tient compte des heures parties (`deplaceeVers`) et des heures venues (`epingle`/`ajoutee`) — c'est `edtProjeterJour` qui recompose la journée réelle.

| geste | télescopages |
|---|---|
| au départ, avant tout geste | **[]** |
| après « Prendre le créneau » (glisser-déposer réel) | **[]** |
| après avoir posé l'heure depuis la liste | **[]** |

## Non-régression — §⑥
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · dix catégories et quatre motifs inchangés · **node --check** et **acorn ES2020** VERTS.
**`function edt*` 198 → 203**, aucune disparue ; cinq ajoutées, nommées : `edtQuiEstEn`, `edtDestinationsPour`, `edtReplacerHeure`, `edtVerifierCoherence`, `edtProjeterJour`.
**`banc-tout.mjs` rejoué en entier — 26 bancs (le banc ⑥c ajouté), 78 repères, aucun échec** : ①bis-a 38 s · ①bis-b 23 s · ①ter 7 s · ②a 10 s · ②b 51 s · ② 48 s · ③a 43 s · ③b 58 s · ③ 34 s · ③bis-a 12 s · ③bis-b 31 s · ④a 36 s · ④ 111 s · ⑤a 10 s · ⑤b 18 s · ⑤c 18 s · ⑤c-bis 11 s · ⑤c-ter 15 s · audits ② 33 s, ③ 55 s, ③bis 33 s · ⑥a 35 s · ⑥b 24 s · **⑥c 16 s** · alerte 28 s · 122 identifiants 3 s.
**Garde** : VERTE ; **ROUGE sur quatre contrôles négatifs** — `mjpcSucces()` dans `edtVerifierCoherence` → ① · `edtVerifierCoherence()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④. Le cinquième a été mesuré en ⑥a.

## Écarts signalés, jamais ajustés
1. **La recherche par mois, par numéro de semaine et par type de semaine (A/B) n'est pas faite.** La liste reste groupée par semaine, comme avant. C'est le point 1 du §③ et **il reste dû** : je l'ai laissé de côté pour livrer le reste prouvé plutôt que tout à moitié.
2. **`edtVerifierCoherence` est appelée par le banc, pas par le site.** Le mandat dit « elle est appelée par le banc après chaque geste » — c'est ce qui est fait. Aucun geste du site ne la déclenche : si Paul veut qu'elle tourne en vrai après chaque écriture, c'est une décision, pas une correction.
3. **Le replacement pose une heure ajoutée**, avec `venantDe` qui pointe la clé d'origine. C'est le même mécanisme que l'heure ajoutée existante ; l'heure d'origine garde son motif `aReplacer` **plus** `replacee:true`, ce qui laisse la trace de ce qui s'est passé au lieu d'effacer.
4. **La dette de ⑥b reste ouverte** : le refus de déplacer une heure dont la trace existe n'est toujours pas mesuré, faute d'heure jouée dans la semaine du banc.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : faux hub ; le sas n'est pas publié en Pages.
- **Le refus de déplacer une heure jouée** (dette de ⑥b).
- **Les 26 bancs d'affilée dans un seul processus** : environnement coupé à ~90 s ; joués en sept tranches, toutes par `banc-tout`.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑥c**) · `tests/banc-destinations-06c.mjs` · `tests/banc-tout.mjs` (26 bancs) · `rapport-2ter-06c.md` (ce rapport).

## ARRÊT
Les créneaux pris par une autre classe sont proposés et nommés, une heure posée depuis la liste **cesse de compter comme perdue** — 1 → 0, mesuré —, et aucun télescopage n'apparaît après aucun geste. **Deux dettes ouvertes : la recherche dans la liste, et le refus de déplacer une heure jouée.** Reste la livraison **⑥** : les dates de l'année, les captures, l'audit adverse, le rapport final.
