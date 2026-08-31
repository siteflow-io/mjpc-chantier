# RAPPORT — LOT 2ter · livraison ①ter-a · LA GRILLE DATÉE GARDE SES IDENTITÉS
Version **8.73.0-①ter-a**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ①ter | 1 660 869 | `e6e8836f3ee6d1b93d1f4e2c0ca68637` | 8.73.0-①bis |
| **Candidat ①ter-a** | **1 662 509** | **`a6d2469cb79a45328ae36955c28aa70a`** | **8.73.0-①ter-a** |

md5 de la base vérifié avant d'écrire une ligne : conforme. md5 du candidat **relu au sas après le push** : identique, garde VERTE sur le fichier relu.

## Ce qui a été fait — trois modifications
1. **`edtPoserIdsObjet` traite les deux formes de grille** (L17937). `o.creneaux` s'il existe **et** `o.versions[].creneaux` sinon, **toutes les versions**. L'unicité s'apprécie **version par version** : un identifiant reconduit d'une version à l'autre n'est pas une collision, il ne reçoit ni `#2` ni rien d'autre. Deux créneaux **différents d'une même version** ne partagent jamais un identifiant : le second en reçoit un neuf.
2. **La charge de mise à niveau passe par cette même pose** (charge `identite`). Elle ne lisait que `gr.creneaux` — absent dès qu'une version existe : au chargement, une grille datée n'aurait jamais reçu la moindre identité. C'est le chemin réel de la pose, il devait suivre le §①.
3. **Un créneau qui naît naît avec son identifiant** (`edtChangerEmploiDuTemps`, après le `push`). Le créneau **déplacé** garde le sien : il est recopié depuis `retire`, c'est la même heure de cours — non touché.

Aucune fonction ajoutée ni supprimée. Les critères de famille n'ont pas bougé (`classe` reste un critère fort de `creneauxGrille`).

## Preuves — §⑤ du mandat, avant / après
Banc : `tests/banc-grille-datee-01ter.mjs`. **Méthode reprise de `tests/banc-versions.mjs` (LOT 2bis)**, relu avant d'écrire : faux hub REST posé par `evaluateOnNewDocument` avec `fetch` détourné — lectures **et** écritures passent par ce hub, aucune requête ne sort — et l'écran ouvert par `document.body.classList.add('admin-mode'); edtOuvrir();`, sans aucun code d'accès. C'est ce qui manquait au banc de ①bis : sans écran ouvert, `EDT_VUE.cellules` reste vide et `edtCellule` rend `null`, ce que le rapport précédent avait pris pour une impossibilité.

Pièce de départ : `tests/grille-appariee.json` du sas — 30 créneaux réels, appariés, sans identifiant.
Commande : `node tests/banc-grille-datee-01ter.mjs index.html`

| § | Preuve | AVANT (8.73.0-①bis) | APRÈS (8.73.0-①ter-a) |
|---|---|---|---|
| ⑤.1 | pose en forme datée — 2 versions, 3 créneaux privés de leur `id` dans chacune | **0 identifiant posé** | **6 identifiants posés** · 0 créneau sans identité, 30 distincts par version |
| ⑤.2 | aucun identifiant en service touché | — | **30/30** identiques à la liste de départ (27 non touchés + 3 reposés qui retombent sur la même amorce : le contenu n'a pas changé) · **0 suffixe `#2`** |
| ⑤.3 | reconduction entre versions | 30/30 identiques (déjà vrai) | **30/30 identiques**, aucun `#2` : la version neuve est une copie, c'est le même créneau |
| ⑤.4 | unicité dans une version | 27 distincts / 30 créneaux (3 sans identité) | **30 distincts / 30** |
| ⑤.4bis | le **même** identifiant porté deux fois **dans une version** (adverse) | — | le premier garde `crn:1a22nwk`, le second reçoit **son amorce propre** `crn:1bx9ru9` · **30 distincts, 0 suffixe** |
| ⑤.5 | créneau **déplacé** (`edtChangerEmploiDuTemps`) | `crn:1a22nwk` lundi 08:57 → `crn:1a22nwk` jeudi 14:00 (déjà vrai) | **identique** : `crn:1a22nwk` conservé, jour et heure changés, version d'arrivée **30 créneaux, 0 sans identité, 30 distincts** |
| ⑤.6 | créneau **neuf** (source non retrouvée) | `{classe:'3 FRANKLIN Aretha', jour:'jeudi', 15:07-16:02}` → **PAS D'ID**, 3 sans identité dans la version | **`crn:ajmk4z`** · **0 sans identité**, 31 créneaux, **31 distincts** |

**⑤.7 non-régression** — mesurée sur le candidat : `function edt*` **149** (aucune disparue, aucune ajoutée, listes comparées nom à nom) · `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif ③ intact · **`edtApparier` 0 appel** · **`edtMettreANiveau` 1 appel** · `edtPoserIdsObjet` : 4 appels → **6** (les deux ajoutés sont nommés au §« ce qui a été fait ») · **node --check** et **acorn ES2020** VERTS.
**Calendrier réel** : 122 identifiants posés, **15 evc · 30 jal · 59 eta · 11 fer · 7 vac**, 122 distincts, **0 collision** (`tests/verif122.mjs`).
**Les bancs de ①bis rejoués sur ce candidat** : `banc-mise-a-niveau-01bis-a.mjs` → les huit scénarios rendent le même résultat (hub vide 0 écriture · hub complet 0 écriture · hub sans `id` archive puis écriture · archivage en échec 0 écriture avec message · abandon global · deux chargements concurrents 1 seule écriture). `banc-periodes-01bis-b.mjs` → **A 3/3 · B 3/3 · C 3/3 · D 3/3 · E 4 identifiants pour 4 périodes · F 5 distincts · G 2 neufs distincts**, inchangé.

**⑤.8 garde** : VERTE sur le candidat et sur le fichier relu au sas ; **ROUGE sur trois contrôles négatifs** posés sur ce candidat — `mjpcSucces()` dans le bloc → « ① le bloc EDT appelle hors contrat : mjpcSucces » · `edtPoserIdsObjet()` appelée hors du bloc → « ② appelé hors du bloc sans être une porte : edtPoserIdsObjet » · écriture de la grille vers `/site/ailleurs/` → « ③ écriture hub hors de /site/edt/ et hors exception » + « ③ chemin hub en dur hors de /site/edt/ ».

**Vrai hub** : `/site/edt` et `/corbeille/2026-08-31` relus après tous les bancs → **`null`** tous les deux. Rien n'est sorti.

## Écarts signalés, jamais ajustés
1. **Un identifiant reposé retombe sur le même identifiant qu'avant** quand le contenu du créneau n'a pas changé : l'amorce est déterministe. C'est pourquoi la perte d'identité était **invisible** tant que rien ne bougeait — et c'est pourquoi le banc retire volontairement des identifiants pour la rendre mesurable. Ce n'est pas un recalcul d'identifiant en service : la pose ne touche **que** les créneaux qui n'en ont pas.
2. **Le doublon d'identifiant dans une même version est réparé par le second, pas par le premier.** Le premier créneau rencontré garde l'identifiant partagé ; c'est l'ordre du tableau qui tranche, comme pour `#2` au §① du mandat v2. Déterministe, mais dépendant de l'ordre : je le dis plutôt que de le taire.
3. **La forme datée n'apparaît toujours pas au chargement** : `edtNormaliserGrille` n'est appelée que par les gestes de version. Une grille encore en forme simple se comporte exactement comme avant — mesuré : 30/30 posés au chargement, seconde pose 0.

## Ce que je n'ai pas pu mesurer
- **Rien.** Les preuves ⑤.1 à ⑤.6 sont toutes jouées dans le site chargé, avec l'écran de l'emploi du temps ouvert. Deux d'entre elles (⑤.1 et ⑤.4bis) fabriquent leur cas en retirant ou en dupliquant des identifiants **par script** avant d'appeler la fonction : c'est un appel de fonction, pas un geste de Paul, et je le déclare comme tel. Les preuves ⑤.5 et ⑤.6 passent par le geste réel du site (`edtChangerEmploiDuTemps`) sur une case peinte à l'écran.
- **Les captures par clics** sont la livraison ①ter, conformément à la découpe du §⑥.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-①ter-a**) · `rapport-2ter-01ter-a.md` (ce rapport) · `tests/banc-grille-datee-01ter.mjs`.

## ARRÊT
Les deux corrections mécaniques sont faites et prouvées, aucune dette ouverte. Reste la livraison **①ter** : les captures par clics du parcours du §③, l'audit adverse complet du §⑤.10, le rapport final. Paul relance par « continuer ».
