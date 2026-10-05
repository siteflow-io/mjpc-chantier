# CARTE DE L'EXISTANT — LE DÉROULÉ, L'ÉDITEUR ET CE QUI S'Y BRANCHE
*Conscience n°13, pièce du transcript, ouverte le 05/10/2026 (tour 12) sur l'ordre de Paul : « avant de piloter un exécutant tu dois avoir une connaissance vraiment complète de déroulé, de l'éditeur, de toutes les implications aussi (liens, calendrier, etc) ». Écrite zone par zone, poussée à chaque tour : ce qui est ici est lu dans le code ou joué dans le navigateur, jamais de mémoire ; ce qui n'est pas encore lu est dit « pas lu ».*

**Base lue** : `index.html` de production, commit `c0f76b4`, 1808861 o, md5 `ac792b28f40d`.

## Z0 · Inventaire (fait, 05/10, tour 12)
- 1341 fonctions dans `index.html` ; deux scripts : le principal, et `pont-fusion` (à l'octet 1046889).
- Le moteur de l'ancien déroulé est embarqué en base64 dans `AT_DR_B64` (309812 caractères ; décodé : une page de 229 960 o, 157 fonctions).
- Les familles de fonctions, par taille (préfixe · nombre · Ko, de la déclaration à la suivante) :
  - `at` · 239 · 552 Ko
  - `edt` · 230 · 236 Ko
  - `_dr` · 58 · 78 Ko
  - `ed` · 81 · 69 Ko
  - `ses` · 47 · 55 Ko
  - `ch` · 28 · 43 Ko
  - `mjpc` · 31 · 37 Ko
  - `secu` · 29 · 29 Ko
  - `eli` · 35 · 28 Ko
  - `CH` · 1 · 27 Ko
  - `_prof` · 15 · 23 Ko
  - `render` · 8 · 19 Ko
  - `open` · 17 · 17 Ko
  - `elf` · 28 · 17 Ko
  - `fiches` · 18 · 15 Ko
  - `_taxo` · 23 · 14 Ko
  - `atelier` · 7 · 13 Ko
  - `show` · 8 · 12 Ko
  - `_b` · 20 · 12 Ko
  - `_uni` · 13 · 10 Ko
  - `_corb` · 11 · 9 Ko
  - `ctx` · 7 · 9 Ko
  - `on` · 4 · 8 Ko
  - `_purge` · 8 · 8 Ko

## Les zones à lire et à jouer, dans l'ordre
- **Z1 · le parcours réel, joué** sur le faux hub (`PONT/EDT/tests/hub/`) : l'emploi du temps → « Éditer dans l'atelier » / « Préparer » → le déroulé → « Lancer » → le tableau → la fin d'heure → la relecture ; captures d'écran entier. — pas fait
- **Z2 · le pont et le cadre** (`_dr*`, le script `pont-fusion`) : onglets, sommaire, régimes, temps, T-5, reprise, vécu. — pas lu
- **Z3 · le moteur** (157 fonctions) : rendu des blocs, schémas, participation, récit, dévoilement, gel. — lu : les schémas seulement (tours 10-11)
- **Z4 · l'éditeur de chapitre et l'atelier** (`ed*`, `at*` hors moteur, `ch*`, fiches, feuilles, import « Compléter le chapitre », prompts au hub). — pas lu
- **Z5 · l'emploi du temps et le calendrier** (`edt*`). — pas lu
- **Z6 · le tableau distant et le cours actif** (`ses*`). — pas lu
- **Z7 · le hub et les liens sortants** : les nœuds lus et écrits par Z2 à Z6 ; la dictée (`heure.seanceId`, la fiche de préparation), le profil, la taxonomie, les élèves et le PAP. — pas lu
- **Z8 · la confrontation** : ce que Z1 à Z7 changent au mandat p8 (version 2) et au futur mandat de production. — pas fait

## Ce que chaque zone écrit ici
Par fonction ou groupe : ce qu'elle fait pour Paul (dans ses mots), sa taille, qui l'appelle, ce qu'elle lit et écrit au hub ; les gestes joués ; **ce que ça implique pour le mandat**.
