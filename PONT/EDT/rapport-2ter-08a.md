# RAPPORT — LOT 2ter · livraison ⑧-a · LA PHOTO SE PREND TOUTE SEULE
Version **8.73.0-⑧a**. Exécutant 11.

## Base et candidat — relus au sas après poussée

| | octets | md5 | version |
|---|---|---|---|
| Base ⑦ | 1 750 002 | `47cb5add128eea6fdcb241cf70cc3dd0` | 8.73.0-⑦ |
| **Candidat ⑧a** | **1 753 662** | **`84e2e5f57b44c186e53315be2a981f4b`** | **8.73.0-⑧a** |

**Relu au sas, identique bit à bit** — commit `835aa4e7f291`.

| fichier | octets | md5 relu | commit |
|---|---|---|---|
| `PONT/EDT/tests/banc-photo-auto-08a.mjs` | 16 171 | `6076e8e76721675cfeb36fafb3ca5d41` | `dce8d7880ef0` |
| `PONT/EDT/tests/banc-tout.mjs` | 9 301 | `8f48ce0ab9751cb4a18fdb632ac40214` | `712c789b5bbb` |

*Un premier candidat (`5a30c271d86c808e9954adf376a4ecac`) a été poussé puis remplacé :
il portait la modale bloquante décrite plus bas. Il ne doit pas être audité.*

## Ce que ça change pour la classe

En juin, Paul pourra comparer ce qu'il avait prévu à ce qu'il a fait — même s'il n'a
jamais pensé à cliquer sur le bouton. À la rentrée et au début de chaque période, le
site prend la photo du prévu tout seul, une fois, **sans rien lui demander**, et la
nomme : « Rentrée », « Trimestre 1 ». Le bouton « 📷 Photo du prévu » ne bouge pas.

## §⓪ter — LA DÉCLARATION MORTE, RETIRÉE

`function edtDebutAnnee` était écrite deux fois (L17823 et L18734). La seconde
écrasait la première au chargement : la première était du code mort qui disait
« l'année commence le 1er août ». Retirée.

| | déclarations `function edt*` | noms distincts |
|---|---|---|
| avant | **217** | 216 (doublon `edtDebutAnnee`) |
| après le retrait | **216** | 216 |
| après les cinq fonctions de cette livraison | **221** | **221** |

**Aucune fonction perdue.** Les cinq ajoutées, nommées : `edtPhotoPrendre`,
`edtEcheancesPhoto`, `edtEcheanceDue`, `edtPhotoFaite`, `edtPhotoAuto`.

## §① — CE QUI A ÉTÉ FAIT

1. **La photo se prend toute seule** à l'ouverture de l'emploi du temps, quand une
   date de début est passée. Branchée après le chargement des classes et des
   chapitres — à ce moment seulement `edtProjeter` rend le prévu entier — **dans
   `edtOuvrir`, sans porte nouvelle**.
2. **Une seule fois par échéance** : la photo porte son échéance (`per:UN`,
   `annee:2026-2027`), et le site la cherche avant de prendre.
3. **La photo à la main reste**, et plusieurs le même jour ne s'écrasent pas.
4. **Chaque photo porte un identifiant** `pho:` horodaté à la seconde. Le mécanisme
   existait dans `edtAmorce` : il n'était pas appelé.
5. **Elle est nommée** : la photo automatique porte le nom de son échéance, celle
   prise à la main porte sa date en clair (« mercredi 2 septembre »).
6. **« figer »** : rien renommé, rien introduit — 24 occurrences avant, 24 après.

**On ne rattrape jamais le passé** : seule la dernière échéance échue est
photographiée. Ouvrir le site en janvier ne fabrique pas une « photo de la rentrée ».

## LA RÉGRESSION QUE J'AI INTRODUITE, ET CE QU'ELLE A APPRIS

Le banc ②a, vert sur la base ⑦, est passé au rouge sur mon premier candidat :
cocher « Séjour Verdun 3e » ne posait plus qu'**1 décision au lieu de 2**.

Cause mesurée : **`atInfo` n'est pas un bandeau, c'est une modale avec un bouton
« Compris »** (`atModaleChoix`, L13411). Ma photo automatique en ouvrait une
par-dessus l'emploi du temps à chaque rentrée et à chaque début de période — elle
recouvrait l'écran et **mangeait le premier clic**.

Correctif : **la photo automatique est silencieuse**. Une photo que Paul n'a pas
demandée ne lui coupe pas la parole ; celle qu'il prend à la main garde son message.
Banc ②a re-vert. Un repère ⑮ a été ajouté au banc ⑧-a : il vérifie qu'aucune modale
ne s'ouvre à l'arrivée.

## §⑥ — LES PREUVES, MESURÉES

`tests/banc-photo-auto-08a.mjs` — **15 repères, tous verts**, parcours cliqué
(panneau prof → Emploi du temps → Ouvrir l'emploi du temps). Une seule ligne n'est
pas un clic et elle est déclarée : `admin-mode`, que la connexion prof pose et
qu'aucun clic n'atteint dans un fichier ouvert en local.

| | mesuré |
|---|---|
| ① la photo automatique se prend | 1 photo · `pho:20260902…` · nom « Trimestre 1 » · échéance `per:UN` · prise 2026-09-02 · depuis 2026-08-31 · **26 cases** |
| ② deux puis trois chargements le même jour | 1 · 1 |
| ③ deux clics sur « 📷 Photo du prévu » | 1 → 3 photos, « Trimestre 1 », « mercredi 2 septembre », « mercredi 2 septembre » |
| ④ identifiants | tous `pho:`, **tous distincts** |
| ⑤ archive avant écriture | l'archive **contient 2 photos** quand le hub en porte 3 |
| ⑥ mode test, site déjà chargé, échéance neuve due (« P3 ») | photos 1 → **1**, écritures photos **[]** |
| ⑦ aucune période déclarée | 1 photo, « Rentrée », échéance `annee:2026-2027`, 27 cases |
| ⑧ deux périodes le même jour | **1** photo |
| ⑨ échéance échue depuis longtemps | 1 photo, échéance `per:VIEUX`, prise aujourd'hui |
| ⑩ vingt photos déjà en magasin | 21 photos, **21 identifiants distincts** |
| ⑪ une photo aux cellules vides | 2 photos, aucune casse |
| ⑫ le hub refuse l'écriture | **0** photo écrite, l'écran reste debout |
| ⑬ « figer » dans les textes affichés | **0** · `edt-fige` intacte, plein écran actif |
| ⑭ photo à la main en mode test | rien au vrai hub (le transport honore le mode test depuis la dette ③ du 27/08) |
| ⑮ la photo automatique | **aucune modale** ouverte par-dessus l'écran |

**Contrôles négatifs.** Le même banc joué sur la base ⑦ **échoue** sur ①, ② et ④
(0 photo automatique, identifiants `null`). Second contrôle, obtenu en cours de mise
au point : quand la pastille du mode test n'avait pas basculé, le repère ⑥ a montré
**une photo partant au hub** (1 → 2, écriture `/site/edt/photos/2026-2027`). Ce n'est
donc pas l'absence de chemin qui protège, c'est le garde-fou.

## LE REPÈRE ⑤c-ter, RELEVÉ AVEC SA RAISON

`banc-tout` attendait `"dansLArchive":1`. Mesuré des deux côtés :

| | archive | hub |
|---|---|---|
| base ⑦ | 1 photo | 2 |
| candidat ⑧a | **2 photos** | **3** |

Le hub de ce banc part avec une photo, et depuis ⑧a la photo se prend toute seule à
l'ouverture : il y en a donc deux avant le geste. **Ce que le banc prouve est
inchangé — l'archive porte l'état d'AVANT.** Le repère est passé à `2`, la raison et
les deux mesures sont écrites au-dessus dans `banc-tout.mjs`. Rien n'a été ajusté en
silence.

## §⑤ — NON-RÉGRESSION, REMESURÉE SUR LE CANDIDAT POUSSÉ

- Moteur `AT_DR_B64` : **309 812** caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944` — identique.
- `function secu*` **29** · `published` **97**.
- Trois portes, pas une de plus : `edtArriveeProf` 2 · `edtSectionPanneau` 2 · `edtOuvrir` 4.
- `edtApparier` **1 appel** · `edtMettreANiveau` **2 appels**.
- `EDT_CATEGORIES` et `EDT_MOTIFS` inchangés.
- `fig*` **24** avant / 24 après · `edt-fige` 9 · `at-corps-fige` 7 — intactes.
- **Garde VERTE** sur ses cinq questions · **double parseur vert** (node --check + acorn ES2020).
- **`banc-tout` : 30 bancs, 87 repères, TOUT PASSE** — compte-rendu complet, joué
  d'une seule commande sur ce candidat (`node tests/banc-tout.mjs index.html`) :

```
BANC-TOUT — 30 banc(s) sur 30, fichier ../index.html

  ✔ ①bis-a · la mise à niveau au chargement              ·  36 s · 3/3 repères
  ✔ ①bis-b · l'identité des périodes                     ·  22 s · 3/3 repères
  ✔ ①ter · la grille datée                               ·   6 s · 3/3 repères
  ✔ ②a · la coche sort de l'objet                        ·  10 s · 3/3 repères
  ✔ ②b · la migration des coches héritées                ·  40 s · 3/3 repères
  ✔ ② · ce que devient une coche quand les choses bougent ·  44 s · 3/3 repères
  ✔ ③a · l'appariement branché                           ·  42 s · 3/3 repères
  ✔ ③b · le différentiel et la classe renommée           ·  53 s · 3/3 repères
  ✔ ③ · l'archivage avant écrasement (par clics)         ·  33 s · 3/3 repères
  ✔ ③bis-a · la classe d'essai en mode test              ·  11 s · 3/3 repères
  ✔ ③bis-b · l'identifiant dit sa famille                ·  29 s · 3/3 repères
  ✔ ④a · un seul collage                                 ·  30 s · 3/3 repères
  ✔ ④ · l'épreuve de bout en bout                        · 104 s · 3/3 repères
  ✔ ⑤a · l'écran Heures perdues                          ·  10 s · 3/3 repères
  ✔ ⑤b · une heure ne compte jamais deux fois            ·  17 s · 3/3 repères
  ✔ ⑤c · banaliser, classer, basculer, déplacer          ·  17 s · 3/3 repères
  ✔ ⑤c-bis · l'archive des décisions                     ·  10 s · 2/2 repères
  ✔ ⑤c-ter · les archives des autres objets              ·  14 s · 3/3 repères
  ✔ audit adverse ② · les coches                         ·  31 s · 2/2 repères
  ✔ audit adverse ③ · l'appariement                      ·  51 s · 2/2 repères
  ✔ audit adverse ③bis · la classe d'essai               ·  35 s · 2/2 repères
  ✔ ⑥a · les trois issues au dépôt                       ·  24 s · 3/3 repères
  ✔ ⑥b · l'heure à replacer et la perte sèche            ·  21 s · 3/3 repères
  ✔ ⑥c · la liste élargie et le replacement réel         ·  14 s · 4/4 repères
  ✔ ⑥ · les dates de l'année                             ·  19 s · 3/3 repères
  ✔ ⑦b · la vue Année dans le site                       ·  11 s · 3/3 repères
  ✔ ⑦ · la pastille d'événement et l'audit adverse       ·  49 s · 3/3 repères
  ✔ ⑤ · l'alerte mensuelle                               ·  31 s · 3/3 repères
  ✔ le calendrier réel · 122 identifiants                ·   3 s · 3/3 repères
  ✔ ⑧a · la photo du prévu se prend toute seule          · 115 s · 3/3 repères

TOUT PASSE — 30 banc(s), 87 repères vérifiés
```

## Écarts signalés, jamais ajustés

1. **Les bancs ne sont pas rejouables d'une seule commande depuis le dépôt.** Ils
   lisent `hub-classes.json`, `hub-site3e.json`, `hub-siteconfig.json`,
   `calendrier-2026-2027.json`, `creneaux-2026-2027.json`, `grille-2026-2027.json`
   sous des noms qui n'existent nulle part au sas — les vrais sont
   `tests/hub/classes.json`, `tests/hub/site_3e.json`, `tests/hub/site_config.json`,
   `json/calendrier-2026-2027.json`, `json/creneaux-2026-2027.json`,
   `json/grille-2026-2027.json`. Et plusieurs bancs écrivent leurs captures dans
   `tests/…` alors que `banc-tout` les lance depuis `tests/`. Il faut un plan de
   travail préparé à la main. **Dette du dispositif, déclarée, non réparée : elle
   appartient à la livraison ⑧ (§⑥.10).**
2. **Le message du mode test** : après un clic sur « 📷 Photo du prévu » en mode test,
   le site dit « Photo du prévu prise — 26 cases » alors que rien n'est enregistré.
   C'est le comportement de TOUS les gestes du site en mode test, et la pastille
   l'annonce en permanence. Signalé, non corrigé : ce serait une passe sur tout le
   site, pas sur l'emploi du temps.
3. **`EDT.photoAutoEmise`** : si l'écriture de la photo automatique échoue, elle
   n'est pas retentée dans la même session. Elle repart au chargement suivant.

## Ce que je n'ai pas pu mesurer

- Le geste sur le site réel de Paul : faux hub, le sas n'est pas publié en Pages.
- Le premier chargement d'une année réelle, avec son calendrier injecté.

## ARRÊT

La photo se prend toute seule, une fois par échéance, nommée et identifiée, et **sans
rien demander à Paul**. Le doublon `edtDebutAnnee` est retiré. Le candidat est au sas,
relu, identique bit à bit. **Rien n'est parti en production.**

Restent pour la livraison ⑧ : la matrice actions × état, `SEQUENCE-TEST-PAUL.md`, les
captures par clics, l'audit adverse, et le rapport final du lot.
