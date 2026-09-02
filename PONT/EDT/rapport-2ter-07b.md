# RAPPORT — LOT 2ter · livraison ⑦b · LA VUE ANNÉE, DANS LE SITE
Version **8.73.0-⑦b**.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base | 1 748 712 | `966eaafd1e1f260c2cdef9e3826aebca` | 8.73.0-⑥ |
| **Candidat ⑦b** | **1 749 464** | **`f14f692abf44c324961297bf106d4f15`** | **8.73.0-⑦b** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses cinq questions.

## Ce qui a été fait
`edtPeindreAnnee` est **remplacée** par la vue du rendu ⑦-a que Paul a validé : douze mois en colonnes, les jours en lignes, mêmes couleurs, mêmes proportions, mêmes règles. **La frise par classe est abandonnée.** Sept fonctions ajoutées, nommées — **`function edt*` 210 → 217** : `edtAnneeColonnes`, `edtAnneeEvenements`, `edtAnneeVacance`, `edtAnneeFerie`, `edtAnneeHauteurs`, `edtAnneeDetail`, `edtAnneeZoom`. Le CSS reprend celui du rendu, préfixé `edt-an-`.

## Preuves — §⑥
Banc : `tests/banc-annee-07b.mjs`. **On entre dans la vue par un CLIC** sur le bouton « Année » de l'écran, et le zoom se fait par **Ctrl + molette réel** (souris, pas d'appel de fonction). Captures : `tests/07b-annee-dezoome.png`, `-zoome.png`.

| | rendu ⑦-a validé | **dans le site** |
|---|---|---|
| colonnes | 12 | **12** |
| bandeaux | 104 (59 étab · 15 classe · 30 jalons) | **104 (59 · 15 · 30)** |
| jours de vacances · fériés | 118 · 11 | **118 · 11** |
| un samedi | 10 px, « 1 S » | **10 px, « 1 S »** |
| un mardi de cours | 32 px | **31 px** |
| Séjour Verdun | 1 bandeau, 3 jours | **1 bandeau, 3 jours, 149 px** |
| bandeaux qui débordent de leur colonne | 0 | **0** |
| défilement vertical dézoomé | aucun | **aucun** |

**⑥.7 — zoomé, par Ctrl + molette** : `zoome: true`, **défilement horizontal actif**, et le libellé long « 13h45 photo 14h30-18h pré-rentrée » **se lit en entier**.

**⑥.12 — la vue affiche, elle ne recalcule rien** : **écritures depuis l'ouverture de la vue : `[]`**, et les comptes d'heures perdues sont **identiques avant et après** (`3E Charles de Gaulle:0`, `4E BANKSY:0`). Le pied de l'écran redit ce qui est affiché : « 59 événements d'établissement · 15 de classe · 30 jalons · Ctrl + molette pour zoomer ».

**⑥.11 — non-régression** : `function secu*` **29** · `published` **97** · moteur `AT_DR_B64` md5 `2ba70f9ef8aacb6f81962ea4e1b62944` · aucune fonction disparue · **node --check** VERT · **aucune fuite globale dans le bloc EDT**.
**`banc-tout.mjs` rejoué en entier — 28 bancs (le banc ⑦b ajouté), 85 repères, aucun échec.**

## Écarts signalés, jamais ajustés
1. **Les pastilles montent à 2 par jour dans le site, contre 4 dans le rendu.** Ce n'est pas la vue : c'est la grille de banc, qui n'apparie que deux classes. Avec la grille réelle de Paul, il y en aura autant que de classes appariées ce jour-là, quatre au maximum.
2. **La pastille d'un événement de classe (le ✓) est branchée sur `edtEvenementJustifie`** — elle s'allume dès qu'une heure de l'événement est marquée. Elle n'apparaît dans aucune capture parce qu'**aucune heure n'est marquée dans le banc** : le cas est prouvé par le banc de la livraison ②, pas par celui-ci. **⑥.10 reste donc à mesurer dans cette vue.**
3. **Le zoom est à deux états**, comme dans le rendu validé, et il n'agit **que** dans la vue Année : ailleurs, Ctrl + molette reste le zoom du navigateur.
4. **L'ancienne vue Année a disparu entièrement** (frise, bande des temps, regroupement des repères proches). C'est ce que le §①.1 demande, mais c'est un retrait, pas un ajout : si Paul y tenait pour une raison que je n'ai pas vue, il faut le dire maintenant.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : faux hub ; le sas n'est pas publié en Pages.
- **⑥.10** (la pastille d'événement allumée dans cette vue) — écart 2.
- **⑥.13** (le parcours par clics depuis le panneau prof) et l'audit adverse **⑥.14** : ils restent dus pour la livraison ⑦.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑦b**) · `tests/banc-annee-07b.mjs` · `tests/banc-tout.mjs` (28 bancs) · deux captures · `rapport-2ter-07b.md`.

## ARRÊT
La vue que Paul a validée est dans le site, avec les mêmes chiffres à l'écran que le rendu : 104 bandeaux, 12 colonnes, aucun débordement, rien qui s'écrive. **Trois dettes déclarées : la pastille d'événement dans cette vue, les captures par clics, l'audit adverse.**
