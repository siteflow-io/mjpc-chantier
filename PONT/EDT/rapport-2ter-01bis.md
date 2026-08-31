# RAPPORT — LOT 2ter · livraison ①bis (finale) · CE QUI EST POSÉ SURVIT À LA RÉINJECTION
Version **8.73.0-①bis**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat | 1 657 594 | `b322540e9baa879985a6dca7697a9948` | 8.73.0-① |
| Livraison ①bis-a | 1 659 907 | `ae243de30613db108d3af5a810ce3bdf` | 8.73.0-①bis-a |
| **Candidat ①bis** | **1 660 869** | **`e6e8836f3ee6d1b93d1f4e2c0ca68637`** | **8.73.0-①bis** |

md5 du candidat **relu au sas après le push** : identique. Garde **VERTE** sur le fichier relu.

## Ce qui a été fait — deux modifications
1. **`edtFusionnerPeriodes` conserve l'identité** (L18250). Trois temps, dans cet ordre : l'entrant porte un `id` → il fait foi ; sinon la période retrouvée **par son nom** — celle que la fonction avait déjà sous la main — transmet le sien ; sinon seulement, `edtPoserIdsObjet` en pose un neuf juste après. **Aucun appariement nouveau n'a été fabriqué** : `edtApparier` reste à **0 appel**, le gradué et le différentiel restent la livraison ③. Un `id` déjà retenu dans le passage n'est jamais redonné à un second objet.
2. **Un objet né après la pose naît avec son `id`** (`edtPeriodesEcrire`, L18326). Trou trouvé pendant la revue et fermé ici : voir « dette trouvée ».

## Preuves — §④ du mandat
Banc : `tests/banc-periodes-01bis-b.mjs`, faux hub = mode test natif (`M8_TEST` / `M8_TEST_STORE`), toute requête non-`file://` avortée. Hub de départ : trois périodes portant des identifiants **en service** (`per:POSEE1/2/3`), volontairement différents de l'amorce que leur contenu produirait — sans quoi la perte serait invisible, l'`id` recalculé retombant sur le même.

Commande : `node tests/banc-periodes-01bis-b.mjs index.html`

| Scénario | AVANT (8.73.0-①bis-a) | APRÈS (8.73.0-①bis) |
|---|---|---|
| **④.6** réinjection, entrant **sans** `id`, mêmes noms | `per:1pw8crv` · `per:1q67ygu` · `per:1qg7k5t` — **0/3 conservés** | `per:POSEE1` · `per:POSEE2` · `per:POSEE3` — **3/3 conservés, aucun neuf** |
| réinjection, entrant **avec** `id`, noms retouchés | les `id` de l'entrant **jetés** — 0/3 | **3/3** : l'entrant fait foi |
| réinjection, **dates déplacées**, entrant sans `id` | 0/3 | **3/3** |
| **④.7** période **renommée dans le site**, puis réinjectée sous son nouveau nom | `per:POSEE2` → `per:1hbzw6k` — **identité perdue** | `per:POSEE2` **avant et après les deux gestes** |
| première injection, hub vide (l'état réel) | 2 `id` neufs distincts | 2 `id` neufs distincts, **inchangé** |

**④.8 — revue de toutes les reconstructions d'objet du bloc.** Les 15 écritures du bloc ont été relevées une par une (`mjpcPutJson` et `secuEcrire`), puis chaque objet écrit remonté jusqu'à sa fabrication :

| Où | Ce qu'elle écrit | Conserve l'`id` ? |
|---|---|---|
| `edtArchiver` L17948 | l'archive à la corbeille | sans objet (photo de l'état d'avant, ①bis-a) |
| `edtMettreANiveau` L18037 | `EDT[nom]`, muté en place | **oui** |
| `edtInjInjecter` L18286 | l'objet collé, `id` manquants posés avant écriture | **oui** pour les `id` de l'entrant ; ne récupère pas ceux du hub — c'est l'appariement, **livraison ③** |
| `edtInjecterAvecLaGrille` créneaux L18298 | enveloppe `{annee, creneaux}`, éléments non refabriqués | **oui** (mêmes objets) ; même réserve ③ |
| `edtInjecterAvecLaGrille` périodes L18304 | `edtFusionnerPeriodes(…)` | **NON avant — corrigé ici** |
| `edtEcrireBrevet` L18318 | une date au format ISO | sans objet (pas une famille) |
| `edtPeriodesEcrire` L18326 | reconstruit `{id, rang, nom, debut, fin}` | **oui** (corrigé en livraison ①) — **et pose désormais les `id` manquants** |
| `edtCreneauPoser` L18360 | `EDT.creneaux` muté en place | **oui** |
| `edtNormaliserGrille` L18413 | `.slice()` : mêmes objets | **oui** |
| `edtVersionAjouter` L18421 | copie profonde des créneaux de la version source | **oui — et c'est le trou signalé** (voir plus bas) |
| `edtEcrireGrille` L18400 | `o` tel quel | **oui** |
| `edtReglagePoser` L18458 | les réglages | sans objet |
| `edtApparierNom` L18596 | cases mutées en place | **oui** |
| `edtPhoto` L19188 | `{prise, depuis, cellules}` **sans `id`** | **objet neuf sans identité — signalé, non ouvert (photos = livraisons ⑤ à ⑧)** |
| `edtEcrireDecision` L19234 | magasin par clé d'heure | sans objet |
| `edtTraceAbsents` L19515 | `absents[]` dans la trace de l'heure | sans objet |
| `edtJustifier` L19835 | `EDT.calendrier` muté en place, ciblé **par `id` stocké** | **oui** |
| `edtChangerEmploiDuTemps` L20013/20022 | créneau retiré recopié (conserve) **ou** créneau neuf `{classe, classeMjpc, mjpc, semaine}` sans `id` | **partiel — signalé, non ouvert (heure déplacée = livraison ⑥)** |

Objets **non écrits au hub** (affichage seulement, hors revue) : `cel` L18989, les cases ajoutées L18983, les repères et lignes de la vue Année, `out` des destinations.

**④.9 non-régression** : `function edt*` **149** (aucune disparue, aucune ajoutée) · `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · `edtApparier` **0 appel** · `edtMettreANiveau` **1 appel** (celui de ①bis-a) · trois portes inchangées · correctif ③ non touché · **node --check** et **acorn ES2020** VERTS.
**Le banc de ①bis-a rejoué intégralement sur ce candidat** : les huit scénarios rendent le même résultat qu'à la livraison précédente (hub vide 0 écriture, hub complet 0 écriture, hub sans `id` archive puis écriture, archivage en échec 0 écriture avec message, abandon global, deux chargements concurrents 1 seule écriture).
**Captures** : l'écran de l'emploi du temps, ouvert puis réinjecté, avant et après le correctif — `tests/AVANT-01bis-a-periodes-*.png` et `tests/APRES-01bis-periodes-*.png`. Les quatre images sont **identiques deux à deux, md5 pour md5** (`81a6710a…` avant, `cf9d93ac…` après) : le correctif ne change **rien** à l'écran. Ce qui change est invisible à l'œil, et c'est le sujet même du lot.

**④.10 garde** : VERTE sur le candidat ; **ROUGE sur les trois contrôles négatifs** posés sur ce candidat final — `mjpcSucces()` dans le bloc → « ① le bloc EDT appelle hors contrat : mjpcSucces » · `edtCharger()` hors du bloc → « ② appelé hors du bloc sans être une porte : edtCharger » · écriture des périodes vers `/site/ailleurs/` → « ③ écriture hub hors de /site/edt/ et hors exception » + « ③ chemin hub en dur hors de /site/edt/ ».

**④.11 audit adverse** (scénario F du banc, un seul passage) : deux périodes **homonymes** dans l'entrant → la première reçoit l'`id` de l'ancienne, la seconde un `id` neuf ; une période **sans nom** → `id` neuf, aucune casse ; **le même `id` porté deux fois par l'entrant** → le premier le garde, le second reçoit un `id` neuf. Résultat : **5 périodes, 5 identifiants distincts, aucune collision**. Ajoutés depuis ①bis-a : JSON tronqué, tableaux qui n'en sont pas, dates inversées, hub vide, hub en panne au milieu de l'archivage, deux chargements concurrents — tous rejoués verts.

## Dette trouvée pendant la revue, fermée ici
**Une période ajoutée à la main naissait sans identité.** `edtPeriodeAjouter` pousse `{rang, nom, debut, fin}` ; `edtPeriodesEcrire` écrivait `id:undefined`, que `JSON.stringify` supprime. Mesuré avant correctif (scénario E) : `Stage → PAS D'ID`, 3 identifiants pour 4 périodes. Conséquence réelle : les cinq fonctions livrées en ① désignent une période **par son `id`** (`edtPeriodePoser`, `edtPeriodeSupprimer`, `edtPeriodeDeplacer`…) — sur une période sans `id`, la comparaison `p.id===id` peut viser une autre période. Corrigé : `edtPoserIdsObjet('periodes', o)` avant l'écriture. Remesuré : `Stage → per:103zxl4`, **4 identifiants pour 4 périodes**, et les 3 anciens conservés.

## Deux trous signalés, NON ouverts — ils appartiennent à d'autres livraisons
1. **L'identité des créneaux à travers les versions datées de la grille.** Mesuré (`tests/mesure-versions-grille.mjs`) : après `edtVersionAjouter`, **2 versions, 4 créneaux, 2 identifiants distincts** — chaque `id` porté par **deux** créneaux, parce que la nouvelle version est une copie profonde de la précédente. Et `edtPoserIdsObjet('grille', o)` **ne pose plus rien** en forme datée : elle ne regarde que `o.creneaux`, supprimé par `edtNormaliserGrille`. Un créneau neuf créé par `edtChangerEmploiDuTemps` naît donc sans identité. Trancher « un créneau est-il le même objet d'une version à l'autre ? » est une question de cadrage, pas une correction mécanique : les versions datées sont au §⑯ « ce qui ne doit pas bouger », et l'heure déplacée est la livraison ⑥. **Je le signale et j'attends.**
2. **Les photos naissent sans identifiant.** `edtPhoto` pousse `{prise, depuis, cellules}` ; l'`id` ne serait posé qu'au chargement suivant, et `edtHorodatage` retomberait alors sur `Date.now()` faute de `quand`/`pose` sur l'objet — deux photos posées au même chargement produiraient la même amorce, donc un `#2`, que le §① interdit pour un objet créé après la pose. Les photos sont explicitement rangées en livraisons ⑤ à ⑧ par le mandat. **Je le signale et j'attends.**

## Écarts signalés, jamais ajustés
1. **Une période dont le nom est retouché dans un JSON entrant qui ne porte pas les `id` reçoit un `id` neuf.** C'est voulu, pas un défaut : la famille `periodes` est à **critère unique** (le nom normalisé), et le mandat v2 §① écrit que ces familles **n'ont pas d'appariement faible** — sans quoi une période renommée s'apparierait à n'importe quelle période encore libre. Les deux chemins réels sont couverts : le JSON régénéré par le site portera les `id` (livraison ④), et un renommage fait **dans** le site conserve l'`id` (mesuré, scénario D).
2. Rappel de ①bis-a, toujours vrai : `mjpcPutJson` ne rappelle pas son callback sur refus ou panne ; il signale l'issue par le canal du site.

## Ce que je n'ai pas pu mesurer
- **Le parcours par clics.** Le banc n'a pas de session professeur : l'écran de l'emploi du temps est ouvert **par appel de fonction** (`edtOuvrir`), pas par des clics, et les captures montrent la vue Semaine, pas le panneau où se lisent les périodes. Les identifiants sont donc prouvés par le relevé du hub avant/après, pas à l'œil. **Paul promeut sur captures : les captures d'un vrai parcours par clics restent à faire, sur un site visitable.**
- **Rien n'a été joué sur le vrai hub** : `/site/edt` est resté `null`, la corbeille du jour aussi.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-①bis**) · `rapport-2ter-01bis-a.md` · `rapport-2ter-01bis.md` (ce rapport) · `tests/banc-mise-a-niveau-01bis-a.mjs` · `tests/banc-periodes-01bis-b.mjs` · `tests/mesure-versions-grille.mjs` · `tests/captures-periodes.mjs` · les captures `01bis-a-*` et `*-periodes-*.png`.

## ARRÊT
Le mandat ①bis est fini : la mise à niveau est branchée, les périodes ne perdent plus leur identité, la revue des reconstructions est faite et déclarée. **Aucune dette ouverte dans le périmètre.** Deux trous signalés hors périmètre attendent une décision de Paul. Ne pas promouvoir sans les captures d'un parcours par clics.
