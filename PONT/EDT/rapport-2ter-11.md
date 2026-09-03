# RAPPORT — LOT 2ter · LIVRAISON ⑪ · LE MODE TEST NE VIDE PLUS L'ÉCRAN

## LA BASE ET LE CANDIDAT
- **Base** : le candidat ⑪b au sas — 1 767 472 o, md5 `4a5aa3d23d2e0eac38cf55ebd5a5fec7`, version 8.73.0-⑪ᵇ.
- **Candidat livré** : **1 769 457 octets**, md5 **`8837063de4466afb71622e89181ae44a`**, version **8.73.0-⑪** — relu au sas après la poussée, identique bit à bit à ce qui a été joué au banc.

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul : « **pour le mode test qui vide tout à la sortie, il faut régler le problème.** »
Le mode test servait à éprouver un mécanisme sans toucher aux vraies données. Mais **il vidait l'écran** : le magasin de test partant vide, toute lecture rendait `null` — plus un chapitre, plus une séance, une grille de cases mortes (mesuré au parcours ⑩, capture `p28` : toutes les cases à « aucune séance prête »). Essayer quelque chose obligeait donc à essayer sur du rien. **Maintenant, le mode test ouvre le site tel qu'il est, avec ses classes, ses chapitres et ses séances — et rien de ce qu'on y fait n'en sort.**

## CE QUI A ÉTÉ ÉCRIT — 4 endroits, 33 lignes ajoutées, 4 remplacées

**① `_siteGet` — LA SEULE MODIFICATION HORS DU BLOC EDT, déclarée nommément.**
Le patron est celui que le site portait déjà, dans `taxoCharger` : **lire le vrai, écrire dans le faux**.
En mode test, une clé absente du magasin est demandée au hub par un **GET, une lecture pure**, déposée au magasin, et tout ce qui suit vient du magasin — on édite donc une **copie**, qui s'évapore à l'extinction.
**Aucune écriture n'a été touchée** : `_sitePut`, `_siteDel` et `mjpcEcrireRest` sont mot pour mot ceux d'avant. **`mjpcEcrireRest`, 1 600 premiers octets : `668cda2757a5`** — le repère du mandat, remesuré sur le fichier livré.
**La panne ne se met pas en cache** : un hub injoignable rend `cb(null, true)` comme hors mode test, sans rien déposer au magasin — sinon le vide deviendrait définitif alors que le réseau peut revenir.

**② à ④ — dans le bloc EDT** : l'emploi du temps retient **dans quel monde il a lu** (`EDT.enEssai`), et à la prochaine ouverture — écran ou panneau — il jette ce qu'il a et relit **si le monde a changé**. C'est ce qui fait revenir les vraies séances à l'extinction **sans recharger la page**.

**Un défaut trouvé à l'audit adverse, corrigé dans la même livraison** : après une panne du hub, `EDT.charge` restait vrai avec des objets nuls et la grille restait vide **jusqu'au rechargement de la page**. Une lecture en panne ne se fige plus : `EDT.pannes` non vide force la relecture à la prochaine ouverture. **Rien n'est promu sur dette.**

## LES PREUVES DU §⑤ — par le geste
Banc : `tests/banc-mode-test-11.mjs`, **VERT**, **un seul chargement de page du début à la fin**. Captures dans `tests/11/`, journal dans `tests/11/journal-11.txt`. Dans ce banc, le faux hub REST **tient lieu de vrai hub** : toute écriture qui l'atteint est une écriture au vrai hub.

**§⑤.5 — le mode test ne vide plus.**
`c01` hors mode test : 18 cases, `{prevu:3, horsMjpc:2, rienDePret:6, nonImportee:7}`, **3 séances**, chapitres `3e:1`.
`c02` mode test allumé : 22 cases, **7 séances = les 3 réelles + les 4 de la classe d'essai**, chapitres `3e:1` — **les mêmes**. À comparer à `p28` du parcours ⑩ : **0 séance, tout à « aucune séance prête »**.

**§⑤.6 — aucune écriture au vrai hub.**
`c03` : en mode test, une case ouverte au clic puis **« Banaliser cette heure »** — le geste qui écrit le plus.
Écritures qui ont atteint le vrai hub : **`[]`**.
Contenu du vrai hub **avant** : `112610|4c60dd6f` — **après** : `112610|4c60dd6f`. **Identique, octet pour octet.**
Sur **toute la session** (78 lectures, mode test allumé quatre fois) : **aucune écriture**.

**§⑤.7 — en sortant, les vraies données reviennent sans rechargement.**
`c04` : après extinction, la grille est **exactement** `{prevu:3, horsMjpc:2, rienDePret:6, nonImportee:7}` — celle d'avant le mode test — et les **3 séances réelles** sont revenues. L'heure banalisée pendant le test a disparu avec le magasin. **`performance` compte 1 seule navigation** : la page n'a jamais été rechargée.

## §⑩ — L'AUDIT ADVERSE, cinq points, tous joués par le geste
| ce qui est éprouvé | ce qui a été mesuré |
|---|---|
| **le vrai hub injoignable** pendant le mode test (`c05`) | l'écran tient debout, aucune écriture, aucune erreur qui casse la page |
| **la panne n'est pas mise en cache** | hub coupé puis rendu : les séances reviennent (3 réelles + 4 d'essai) **sans recharger** |
| **une injection pendant le mode test** (`c06`) | créneaux collés, vérifiés, injectés : **`[]` au vrai hub** |
| **la classe d'essai un jour sans cours** (`c07`) | **10 jours sans cours** atteints aux flèches en vue mois : **aucune case d'essai ne s'y pose** (16 ailleurs dans le mois) |
| **une fin d'année saisie avant tout début, puis effacée** (`c08`) | la fin se pose seule — `edtValiderDatesAnnee` ne compare rien tant qu'il manque une date : **comportement d'origine, mesuré, non modifié**. Le champ ensuite vidé **n'écrit rien** : le hub garde la dernière date entière |

## NON-RÉGRESSION — le §④, remesuré sur le candidat livré
| ce qui ne devait pas bouger | mesuré |
|---|---|
| `AT_DR_B64` | **309 812 car · `2ba70f9ef8aacb6f81962ea4e1b62944`** |
| **`mjpcEcrireRest`** — le plus important | **`668cda2757a5`** — inchangé |
| `function secu*` · `published` · `edt-fige` | **29 · 97 · 9** |
| `EDT_CATEGORIES` + `EDT_MOTIFS` | `6817baddf5c2` — mot pour mot |
| portes hors bloc | **trois**, les mêmes |
| `edtApparier` · `edtMettreANiveau` | **1 appel · 2 appels** |
| `edt*` | **229 déclarations / 229 noms**, aucune disparue, aucun doublon |
| la vue Année | **aucune écriture** (banc ⑦b, vert) |
| hors mode test, la grille de Paul | **18 cases identiques**, comptes par classe inchangés |
| double parseur | `node --check` **VERT** · `acorn` ES2020 **VERT** |
| garde `verif_edt.py` | **VERTE sur ses cinq questions** — `_siteGet` appartient au socle, la modification n'entre pas dans le bloc et le bloc n'appelle rien de nouveau |
| `banc-tout` | **35 bancs, tous verts**, ⑪a, ⑪b et ⑪ compris |

## ÉCARTS SIGNALÉS, NON AJUSTÉS
- **`banc-tout` a été joué en six tranches**, pas en une commande : les commandes longues sont coupées par l'outil dont je dispose. Les 35 bancs ont tourné sur le fichier livré. **Ce n'est pas la commande unique que la règle demande, et je le dis.**
- **Le mode test lit désormais le vrai hub.** C'est ce que le mandat demande, mais c'est un changement de nature : avant, le mode test ne touchait le réseau que pour la taxonomie ; maintenant, chaque clé lue une première fois déclenche **un GET**. 78 lectures sur toute la session du banc. **Aucune écriture, jamais** — mais le mode test n'est plus « hors réseau », il est « en lecture seule ». Il faut le savoir.
- **La garde ne couvre pas `_siteGet`.** Elle ne le peut pas : c'est le socle. La preuve que rien n'écrit tient donc au **banc** (`[]` d'écritures, empreinte du hub identique) et au **md5 de `mjpcEcrireRest`**, pas à la garde.

## CE QUE JE N'AI PAS PU MESURER
- **Le comportement sur le vrai hub Firebase.** Tout est mesuré contre un faux hub qui répond en mémoire. Ce qu'il prouve : aucune requête d'écriture n'est émise, et l'état lu ne change pas. Ce qu'il ne prouve pas : la latence réelle des premières lectures en mode test sur le réseau du collège.
- **Les autres applications du site.** `_siteGet` sert tout le site ; je n'ai éprouvé que le portail et l'emploi du temps. Les 35 bancs du lot passent, mais **aucun banc du lot ne couvre l'atelier ni le déroulé en mode test**.

## LIVRÉ
`PONT/EDT/index.html` (**8.73.0-⑪**, 1 769 457 o, `8837063de4466afb71622e89181ae44a`) · `tests/banc-mode-test-11.mjs` · `tests/banc-tout.mjs` (banc ⑪ ajouté au lot) · `tests/11/` (8 captures + le journal) · ce rapport. **Rien en production.**
