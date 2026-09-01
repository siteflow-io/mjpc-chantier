# RAPPORT — LOT 2ter · livraison ⑥b · L'HEURE À REPLACER, RAPPELÉE JUSQU'À CE QU'ELLE SOIT POSÉE
Version **8.73.0-⑥b**.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ⑥a | 1 734 473 | `bc02c791eb2506fb9d25dc8c46d06721` | 8.73.0-⑥a |
| **Candidat ⑥b** | **1 737 659** | **`aeb8a9d72f0aea22dbfd0de68144a9f3`** | **8.73.0-⑥b** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses cinq questions.

## Ce qui a été fait
Quatre fonctions ajoutées, nommées — **`function edt*` 194 → 198** : `edtHeuresAReplacer(nomClasse)` · `edtRappelAReplacerHtml(nomClasse)` · `edtHeureReplacee(classe, cle)` · `edtPerteSeche(classe, cle)`.
Le rappel paraît **à deux endroits** : au **bandeau** de l'écran (« ⏳ 1 heure à replacer »), et **dans la vue de la classe** — la modale d'une case — avec la liste nommée et deux boutons.

## Preuves — §⑦
Banc : `tests/banc-a-replacer-06b.mjs`. Le geste d'origine est un **glisser-déposer réel** suivi du clic « Prendre le créneau » ; la perte sèche est un **clic réel** sur le bouton du rappel.

**⑦.5 — l'heure est rappelée, et elle survit au rechargement.** Après un rechargement complet depuis le hub :
- **au bandeau** : « 1 heure à replacer » ;
- **la liste** : « 4E BANKSY 2026-08-31 15:07-16:02 · prise par 3E Charles de Gaulle » ;
- **dans la vue de la classe** : « 1 heure à replacer | 4E BANKSY · lundi 31 août 15:07-16:02 · prise par 3E Charles de Gaulle », avec les boutons **« je l'ai replacée »** et **« elle ne sera pas rendue »**.

**⑦.6 — la perte sèche, par clic.** Le motif devient **`priseAutreClasse`**, statut **justifiée**, **basculable**, `aReplacer` retombe à faux ; **il ne reste plus rien à replacer** ; **1 archive puis 1 écriture**. Le total ne bouge pas d'une unité de plus : l'heure était déjà comptée perdue, elle change seulement de motif et de statut — c'est la règle « une heure, une clé, un seul motif » de ⑤b.

**⑦.8 — aucune trace touchée** (dette de ⑥a, résorbée) : les contenus du niveau — séances, activités, traces — font **58 036 caractères avant le geste et 58 036 après**, **identiques**. Horaire, jamais contenu.

**⑦.7 — partiellement mesuré, et je le dis** : une **heure du jour non encore lancée est déplaçable** — mesuré, la case du 31 août 08:57 est saisissable. En revanche **aucune heure jouée n'existait dans la semaine du banc** : le cas « une heure dont la trace existe ne se déplace pas » **n'est pas mesuré**. Ce que je peux dire sans le mesurer : `edtGlisserDebut` n'accepte que la nature `prevu`, et une heure jouée porte `jouee` — c'est une lecture du code, pas une preuve. **La dette reste ouverte** pour ce cas et pour « une trace vide supprimée la rend de nouveau déplaçable ».

**§⑥ non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · dix catégories et quatre motifs inchangés · **node --check** et **acorn ES2020** VERTS.
**`banc-tout.mjs` rejoué en entier — 25 bancs (le banc ⑥b ajouté), 75 repères, aucun échec** : ①bis-a 40 s · ①bis-b 25 s · ①ter 7 s · ②a 10 s · ②b 63 s · ② 54 s · ③a 50 s · ③b 51 s · ③ 36 s · ③bis-a 13 s · ③bis-b 32 s · ④a 33 s · ④ 124 s · ⑤a 11 s · ⑤b 21 s · ⑤c 19 s · ⑤c-bis 11 s · ⑤c-ter 16 s · audits ② 40 s, ③ 63 s, ③bis 40 s · ⑥a 41 s · **⑥b 25 s** · alerte 33 s · 122 identifiants 3 s.
**Garde** : VERTE ; **ROUGE sur quatre contrôles négatifs** — `mjpcSucces()` dans `edtPerteSeche` → ① · `edtHeuresAReplacer()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④. Le cinquième a été mesuré en ⑥a (un caractère ajouté au prompt) ; je ne l'ai pas rejoué ici.

## Écarts signalés, jamais ajustés
1. **« Je l'ai replacée » est une déclaration de Paul, pas une pose.** Poser l'heure depuis la **liste des destinations** est la livraison **⑥c**, où cette liste est refaite ; en attendant, le bouton sort l'heure du rappel et du compte, et le journal garde le geste. **Je n'ai pas inventé un demi-mécanisme de pose.**
2. **La bascule automatique de fin d'année** — une heure à replacer jamais replacée qui deviendrait « non justifiée » au 30 juin — **n'est pas faite** : elle dépend de `finAnnee`, qui arrive en **⑥ finale** (§⑤ du mandat). Le motif `aReplacer` porte déjà ce statut, mais rien ne déclenche encore le passage.
3. **Le rappel s'affiche pour toutes les classes** dans le bandeau, et pour la classe de la case ouverte dans la modale. Il montre au plus six lignes, puis « … et N de plus ».
4. **Une heure déclarée perdue sèche reste comptée** : elle passe de « à replacer, non justifiée » à « prise par une autre classe, justifiée ». C'est ce que demande le §②.3 — mais cela veut dire que **le total ne baisse pas** quand Paul déclare la perte. Seul « je l'ai replacée » fait sortir l'heure du compte.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : faux hub ; le sas n'est pas publié en Pages.
- **Le refus de déplacer une heure jouée**, et la trace vide supprimée (écart ⑦.7 ci-dessus) — **dette ouverte**.
- **Les 25 bancs d'affilée dans un seul processus** : environnement coupé à ~90 s ; joués en six tranches, toutes par `banc-tout`.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑥b**) · `tests/banc-a-replacer-06b.mjs` · `tests/banc-tout.mjs` (25 bancs) · `rapport-2ter-06b.md` (ce rapport).

## ARRÊT
Une heure prise n'est plus perdue en silence : elle est nommée, rappelée au bandeau et dans la vue de la classe, et Paul décide — replacée, ou perdue et déclarée telle. **Une dette reste ouverte : le refus de déplacer une heure jouée, non mesuré.** La suite est **⑥c** : la liste des destinations élargie et `edtVerifierCoherence`. Paul relance par « continuer ».
