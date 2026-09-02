# RAPPORT — LOT 2ter · livraison ⑦ (finale) · LES PASTILLES, LES CAPTURES, L'AUDIT
Version **8.73.0-⑦**. Les trois dettes de ⑦b sont réglées.

## Base et candidat
| | octets | md5 | version |
|---|---|---|---|
| ⑦b | 1 749 464 | `f14f692abf44c324961297bf106d4f15` | 8.73.0-⑦b |
| **Candidat ⑦** | **1 750 002** | **`47cb5add128eea6fdcb241cf70cc3dd0`** | **8.73.0-⑦** |

md5 **relu au sas** : identique. Garde VERTE sur ses cinq questions. **`function edt*` 217**, aucune ajoutée, aucune disparue.

## L'ANCIENNE VUE ANNÉE, que Paul a demandé à revoir
`tests/ancienne-vue-annee.png` (capturée sur la version ⑥, avant remplacement). Elle montrait : une **échelle de mois horizontale**, une **bande « temps de l'année »** avec les repères groupés (« 2 le 18/12 », « 3 le 18/01 »), puis **une piste par classe** — 3E Charles de Gaulle, 4 HUGO, 4E BANKSY, 4 TURING — et les événements en **barres verticales fines** traversant les pistes. Les classes non appariées y affichaient « classe non encore importée — à apparier dans le panneau prof ». **C'est exactement la frise par classe et les barres verticales que le mandat demandait d'abandonner.**

## ⑥.10 — LA PASTILLE D'ÉVÉNEMENT (dette réglée)
Mesuré dans la vue Année, par clics réels sur les cases de l'écran Heures perdues :

| état | le bandeau |
|---|---|
| aucune heure marquée | « Séjour Verdun 3e » — **éteinte** |
| **une seule** heure marquée sur 2 | « Séjour Verdun 3e **✓** » — **allumée** |
| décochée, zéro heure marquée | « Séjour Verdun 3e » — **éteinte** |

C'est la règle tranchée le 31/08, portée par cette vue.

## ⑥.13 — LES CAPTURES PAR CLICS (dette réglée)
`tests/captures-annee-07.mjs`, cinq captures + journal (`tests/07-annee-*.png`, `07-annee-journal.txt`). Parcours entièrement cliqué : **panneau prof → Emploi du temps → Ouvrir l'emploi du temps → Année** (104 bandeaux, 12 colonnes) → **survol** d'un bandeau (infobulle « Séjour Verdun 3e — du 2026-10-14 au 2026-10-16 ») → **clic** sur le bandeau (« Séjour Verdun 3e | du mercredi 14 octobre au vendredi 16 octobre ») → **Ctrl + molette** pour zoomer, puis dézoomer. Une seule ligne n'est pas un clic, déclarée : `admin-mode`.

## ⑥.14 — L'AUDIT ADVERSE (dette réglée)
`tests/banc-pastille-audit-07.mjs`. **Aucune casse, aucun débordement de colonne dans aucun cas.**

| cas | mesuré |
|---|---|
| mois à 31 et à 28 jours | mars **31** lignes, février **28**, 104 bandeaux, **0 débordement** |
| un événement d'un seul jour | 1 bandeau, empilement 1 |
| un événement de trois semaines | 1 bandeau, **0 débordement** |
| **dix événements le même jour** | **10 bandeaux empilés**, 0 débordement |
| un événement sans date de fin | traité comme un jour, 1 bandeau |
| une année sans aucun événement | **12 colonnes, 0 bandeau**, aucune casse |
| **une classe non appariée** | pas de pastille, **et le site le dit** — voir ci-dessous |
| calendrier réinjecté pendant que la vue est ouverte | **non concluant** — voir écarts |

**La classe non appariée est nommée**, au pied de la vue : « 59 événements d'établissement · 15 de classe · 30 jalons · Ctrl + molette pour zoomer · **2 classes de ta grille ne sont pas encore appariées : 4 HUGO, 4 TURING — pas de pastille pour elles** ».

## Non-régression
Moteur `AT_DR_B64` md5 `2ba70f9ef8aacb6f81962ea4e1b62944` · `secu*` **29** · `published` **97** · **node --check** VERT · aucune fuite globale dans le bloc EDT.
**`banc-tout.mjs` rejoué en entier — 29 bancs, 88 repères, aucun échec.**
**Garde** : VERTE sur cinq questions, **ROUGE sur cinq contrôles négatifs**, un par question — dont le cinquième : un caractère ajouté à `prompts/grille.md` → « la consigne « grille » diffère : 9203 caractères contre 9202 — premier écart au caractère 9202 ». Fichier remis.

## Écarts signalés, jamais ajustés
1. **Le cas « calendrier réinjecté pendant que la vue est ouverte » n'est pas concluant** : la vue **reste debout et intacte** (104 bandeaux avant, 104 après, l'écran est toujours là), mais je n'ai pas pu établir si l'injection avait abouti — donc je ne peux pas dire que la vue s'est correctement rafraîchie. **Je le déclare comme non prouvé** plutôt que de le compter comme réussi.
2. **La vue ne se repeint pas d'elle-même** quand le calendrier change sous elle : il faut revenir dessus. Ce n'est pas demandé par le mandat, mais c'est ce que le cas 1 laisse penser.
3. **Les dettes des lots précédents restent ouvertes**, et je les redis : la recherche par mois / semaine / type A-B dans la liste des destinations (⑥ §③.1) · le refus de déplacer une heure dont la trace existe (⑥ §⑦.7) · la bascule automatique de fin d'année pour une heure jamais replacée · les captures et l'audit adverse du **lot ⑥** (§⑦.14 et §⑦.15).

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : faux hub ; le sas n'est pas publié en Pages.
- Le cas 1 des écarts.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑦**) · `tests/banc-pastille-audit-07.mjs` · `tests/captures-annee-07.mjs` · `tests/banc-tout.mjs` (29 bancs) · cinq captures `07-annee-*` et leur journal · `tests/ancienne-vue-annee.png` et `tests/shot-ancienne.mjs` · `rapport-2ter-07.md`.

## ARRÊT
Les trois dettes de ⑦ sont réglées : la pastille s'allume dès une heure et s'éteint à zéro, le parcours est capturé clic par clic, et l'audit ne casse rien — dix événements le même jour s'empilent sans déborder. **Un cas reste non prouvé et quatre dettes des lots précédents restent ouvertes.**
