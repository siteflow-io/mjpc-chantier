# RAPPORT — LOT 2ter · livraison ①ter (finale) · CAPTURES PAR CLICS ET AUDIT ADVERSE
Version **8.73.0-①ter**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ①ter | 1 660 869 | `e6e8836f3ee6d1b93d1f4e2c0ca68637` | 8.73.0-①bis |
| Livraison ①ter-a | 1 662 509 | `a6d2469cb79a45328ae36955c28aa70a` | 8.73.0-①ter-a |
| **Candidat ①ter** | **1 662 507** | **`cb20546e7abe9b4c32e322a5b03f7c60`** | **8.73.0-①ter** |

Le candidat ①ter ne diffère de ①ter-a que par le **numéro de version affiché** (`8.73.0-①ter-a` → `8.73.0-①ter`, deux octets de moins). Aucune autre ligne n'a bougé. md5 **relu au sas après le push** : identique, garde VERTE sur le fichier relu.

## §③ — LES CAPTURES PAR CLICS
`tests/captures-clics-01ter.mjs`, joué **deux fois, même parcours** : sur la base `8.73.0-①bis` (préfixe `AVANT-01bis-clic-*`) et sur le candidat `8.73.0-①ter` (préfixe `APRES-01ter-clic-*`), huit captures écran entier chacune, plus le journal geste par geste (`*-clics-journal.txt`).

**Ce qui a bloqué au tour précédent, et ce que c'était.** Un voile du site, `fi-overlay`, recouvre l'écran et intercepte les pointeurs : `document.elementFromPoint` rendait `fi-overlay` au lieu de la case, `edtDepot` n'était jamais appelée. Le banc du LOT 2bis le retirait déjà (`tests/banc-2b.mjs`, fonction `nettoyer`). Retiré de la même façon, le geste passe. **Je ne clique jamais « Annuler »** dans ce nettoyage : ce serait répondre à la place de Paul — mesuré, une première version du banc fermait ainsi la modale « Nouvelle version » et faussait l'étape ③.

Le parcours, geste par geste, mesuré sur le candidat :
| # | Clic | Résultat mesuré | Capture |
|---|---|---|---|
| ① | « 🛠 Panneau prof » | panneau ouvert, **14 sections** | `…-clic-1-panneau-prof.png` |
| ② | « 📅 Emploi du temps » | grille au hub : forme simple, 30 créneaux, **0 sans identifiant, 30 distincts** | `…-clic-2-section-edt.png` |
| ③ | « + Nouvelle version à partir d'une date » | modale : **Annuler · Créer à partir d'aujourd'hui** | `…-clic-3-nouvelle-version.png` |
| ④ | « Créer à partir d'aujourd'hui » | **2 versions au hub** (2026-08-01 et 2026-08-31), 30 créneaux chacune, **0 sans identifiant, 30 distincts** | `…-clic-4-version-creee.png` |
| ⑤ | « 📅 Ouvrir l'emploi du temps » | 18 cases occupées, **3 saisissables** (nature « prévu »), 22 libres | `…-clic-5-grille.png` |
| ⑥ | glisser lundi 08:57 → lundi 08:00 (souris, `mouse.down/move/up`) | `edtDepot` appelée, **refus : aucun** ; question du dépôt affichée : « Changer l'emploi du temps à partir de cette date » / « Déplacer cette heure seulement » ; date d'effet proposée **2026-08-31**, créneau visé **08:00-08:55** | `…-clic-6-question-du-depot.png` |
| ⑦ | « Changer l'emploi du temps à partir de cette date » | **le créneau `crn:1a22nwk` garde son identifiant** : lundi **08:57** dans la version du 2026-08-01 (le passé, intact), lundi **08:00** dans la version du 2026-08-31 | `…-clic-7-heure-deplacee.png` |
| ⑧ | retour sur la grille | 2 versions, 30 créneaux chacune, **0 sans identifiant, 30 distincts** | `…-clic-8-retour-grille.png` |

**Une seule ligne du parcours n'est pas un clic, et je la déclare** : `document.body.classList.add('admin-mode')`, la marque du professeur connecté — c'est la méthode des bancs du LOT 2bis, aucun code d'accès n'est demandé. Tout le reste (panneau, sections, modales, navigation de semaine, glisser-déposer, validation) passe par de vrais clics et de vrais mouvements de souris.

**Trois choses apprises en montant ce banc, qui expliquent des écrans vides :** sans `/classes` au faux hub, toutes les cases sont « classe non encore importée » ; sans les chapitres (`/site/3e`), les cases de la classe appariée sont « rien de prêt » et **ne se saisissent pas** (`edtGlisserDebut` n'accepte que la nature « prévu ») ; la semaine du 26/10 est en vacances, donc tout y est « hors temps ».

**Avant / après** : le parcours donne le **même résultat** sur les deux versions — 0 créneau sans identifiant, 30 distincts, le créneau déplacé garde `crn:1a22nwk`, le passé ne bouge pas. C'est une **preuve de non-régression, pas une preuve du correctif** : dans ce parcours, tous les créneaux ont reçu leur identifiant au chargement, en forme simple, avant toute version — le défaut corrigé ne s'y montre donc pas. Les preuves du correctif sont celles du §⑤ de `rapport-2ter-01ter-a.md`, mesurées au banc.

## §⑤.10 — AUDIT ADVERSE
`tests/audit-adverse-01ter.mjs`. **Aucune exception, aucune erreur de page.**

| Cas cherché | Résultat mesuré |
|---|---|
| trois versions, créneaux reconduits | 3 posés par version · **mêmes identifiants d'une version à l'autre** · 0 suffixe |
| une version vide | aucune casse · 0 créneau dans la vide, l'autre intacte |
| deux versions à la même date | chacune traitée pour elle-même · identifiants identiques · 0 suffixe |
| un créneau retiré de la seconde version | les survivants gardent le leur (`crn:1xd6hig`, `crn:gy1wdw`) · rien n'est reporté du disparu |
| **le même identifiant deux fois dans une version** | le premier garde `crn:PARTAGE`, le second reçoit son amorce propre · 3 distincts · 0 suffixe |
| grille encore en forme simple | comportement d'avant : 3 posés |
| versions absurdes (`null`, sans `creneaux`, `creneaux` qui n'est pas un tableau, éléments `null` et `42`) | **aucune casse** · seul l'objet réel reçoit un identifiant |
| objet vide (hub vide — l'état réel) | 0 posé, aucune casse |
| deux poses de suite | 3 puis **0** · listes strictement identiques |
| **un identifiant de créneau donné à une période** | la période **garde** `crn:1xd6hig` : un identifiant en service n'est jamais recalculé. Voir « écarts » |

## §④ — NON-RÉGRESSION, remesurée sur le candidat final
`function edt*` **149** (aucune disparue, aucune ajoutée) · `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif ③ intact · **`edtApparier` 0 appel** · **`edtMettreANiveau` 1 appel** · **node --check** et **acorn ES2020** VERTS.
**Calendrier réel** : 122 identifiants, **15 evc · 30 jal · 59 eta · 11 fer · 7 vac**, 122 distincts, **0 collision**.
**Les trois bancs rejoués sur le candidat final** :
- `banc-mise-a-niveau-01bis-a.mjs` → hub vide **0 écriture** · hub complet **0** · hub sans `id` **1 archive puis 1 écriture** · archivage en échec **0 écriture** + message · abandon global **0 écriture** · deux chargements concurrents **1 seule écriture**.
- `banc-periodes-01bis-b.mjs` → A **3/3** · B **3/3** · C **3/3** · D **3/3** · E **4 identifiants pour 4 périodes** · F **5 distincts** · G **2 neufs distincts**.
- `banc-grille-datee-01ter.mjs` → pose en forme datée **6** · 30 distincts par version · doublon réparé · déplacé conserve `crn:1a22nwk` · neuf reçoit `crn:ajmk4z`, **0 sans identifiant**.

**Garde** : VERTE sur le candidat et sur le fichier relu au sas ; **ROUGE sur trois contrôles négatifs** posés sur ce candidat — `mjpcSucces()` dans le bloc → « ① le bloc EDT appelle hors contrat » · `edtChangerEmploiDuTemps()` appelée hors du bloc → « ② appelé hors du bloc sans être une porte » · écriture de la grille vers `/site/ailleurs/` → « ③ écriture hub hors de /site/edt/ » + « ③ chemin hub en dur hors de /site/edt/ ».

**Vrai hub** : `/site/edt` et `/corbeille/2026-08-31` relus après tous les bancs → **`null`** tous les deux.

## Écarts signalés, jamais ajustés
1. **Un identifiant peut être porté par un créneau ET par une période.** Mesuré à l'audit : le site n'impose l'unicité qu'**à l'intérieur d'une famille** — un identifiant en service n'étant jamais recalculé, une période à qui l'on donne `crn:…` le garde. Sans conséquence à l'usage (familles et chemins hub distincts), mais le mandat interdit d'y toucher (« les critères de famille : on n'y touche pas ») : je le rapporte, je ne le corrige pas.
2. **Le cas « source non retrouvée » (§⑤.6) n'est pas atteignable par un parcours de clics simple.** Il demande une version d'effet qui existe déjà **sans** le créneau visé. Essayé : déplacer deux fois la même heure avec des dates d'effet différentes — la version d'effet est toujours une copie de la version en vigueur, elle contient donc le créneau. La preuve est jouée au banc, en dépouillant une version, et déclarée comme appel de fonction.
3. **Les captures ⑤ diffèrent d'un md5 entre AVANT et APRÈS** : le numéro de version en bas d'écran et l'heure affichée en tête changent d'une exécution à l'autre. Les états mesurés, eux, sont identiques.
4. Rappels de ①ter-a, toujours vrais : un identifiant reposé retombe sur la même amorce quand le contenu n'a pas changé ; le doublon dans une version est réparé par le second créneau, l'ordre du tableau tranche ; la forme datée n'apparaît pas au chargement.

## Ce que je n'ai pas pu mesurer
- **Le déplacement d'heure sur le site réel de Paul** : tous les bancs tournent sur un faux hub. Le sas n'est pas publié en Pages, je n'ai pas d'adresse à donner pour un essai à la main.
- **Le cas ⑤.6 par clics**, ci-dessus.

## Deux trous signalés en ①bis, toujours ouverts, hors périmètre
1. **Les photos naissent sans identifiant** (`edtPhoto`) — livraisons ⑤ à ⑧.
2. **L'unicité inter-familles** (écart 1 ci-dessus), à trancher si Paul le juge utile.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-①ter**) · `rapport-2ter-01ter-a.md` · `rapport-2ter-01ter.md` (ce rapport) · `tests/banc-grille-datee-01ter.mjs` · `tests/audit-adverse-01ter.mjs` · `tests/captures-clics-01ter.mjs` · `tests/verif122.mjs` · les seize captures `AVANT-01bis-clic-*.png` et `APRES-01ter-clic-*.png` · les deux journaux de clics.

## ARRÊT
Le mandat ①ter est fini : la pose traite la grille datée, un créneau neuf naît avec son identifiant, les captures par clics sont faites, l'audit adverse ne casse rien. **Aucune dette ouverte dans le périmètre.** Paul promeut sur captures : elles sont au sas, avant et après, écran entier.
