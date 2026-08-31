# RAPPORT — LOT 2ter · livraison ①bis-a · LA MISE À NIVEAU EST BRANCHÉE
Version **8.73.0-①bis-a**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés, pas supposés
| | octets | md5 | `function edt*` | version |
|---|---|---|---|---|
| Base (sas) | 1 657 594 | `b322540e9baa879985a6dca7697a9948` | 149 | 8.73.0-① |
| Candidat poussé | 1 659 907 | `ae243de30613db108d3af5a810ce3bdf` | 149 | 8.73.0-①bis-a |

Le md5 de la base est **identique** à celui de l'en-tête du mandat : rien n'avait bougé, le travail a démarré.
Le md5 du candidat est **remesuré sur le fichier relu au sas après le push** (aller-retour), pas sur le fichier du disque.

## Ce qui a été fait — trois modifications, pas une de plus
1. **Le branchement** (`edtCharger`, L18070). L'exécution nue des charges qui terminait `edtCharger` est remplacée par `edtMettreANiveau()`, dans un `try` dont le `catch` rejoue les charges en repli : **l'identité en mémoire est garantie dans tous les cas** (« rien ne s'affiche sans identité »). L'appel n'attend pas le réseau : archivage et écriture partent en arrière-plan, l'affichage continue.
2. **L'archive porte l'état d'AVANT** (`edtMettreANiveau`, photo prise avant les charges).
3. **L'abandon est global** : toutes les archives d'abord, les écritures seulement si toutes ont abouti.

Les points 2 et 3 sont **deux dettes trouvées en mesurant, déclarées et fermées dans cette livraison** (détail plus bas). Aucune fonction ajoutée, aucune supprimée, aucune charge touchée : `edtMettreANiveau` ne porte toujours que `identite`. `edtApparier` reste à **0 appel**.

## Preuves — §④ du mandat, chiffre par chiffre
Banc : `tests/banc-mise-a-niveau-01bis-a.mjs` (puppeteer-core + @sparticuz/chromium, candidat chargé en `file://`, **toute requête non-`file://` avortée**). Faux hub = le **mode test natif** du site (`M8_TEST` / `M8_TEST_STORE`), qui intercepte `_siteGet`, `_sitePut` et — depuis le correctif ③ — `mjpcEcrireRest`. Aucun banc de 1,6 Mo n'a été fabriqué. Le banc **clone à la lecture** : sans ce clone, le magasin rend l'objet par référence et une pose d'`id` en mémoire se verrait « au hub » sans qu'aucune écriture ait eu lieu — mesure faussée, corrigée avant tout relevé.

Commande unique : `node tests/banc-mise-a-niveau-01bis-a.mjs index.html`

| § | Preuve | Mesure |
|---|---|---|
| ④.1 | La mise à niveau est atteignable | `edtMettreANiveau` : **2 occurrences** — déclaration L18003, **1 appel L18070, dans `edtCharger`** (déclarée L18058). Base : 1 occurrence, 0 appel. |
| ④.2 | Hub vide → 0 écriture | scénario ① : **0 archive, 0 écriture**, journal vide, `EDT.miseANiveauDit` = `[]` |
| ④.3 | Hub déjà complet → 0 écriture | scénario ③ (hub à 122 `id`) : **0 archive, 0 écriture** |
| ④.4 | Hub sans `id` → 1 archive **puis** 1 écriture | scénario ② : ordre journalisé **archive → écriture** · archive `/corbeille/2026-08-31/edt-mise-a-niveau-calendrier_…` · écriture `/site/edt/calendrier/2026-2027` · hub après : **122 `id`** · le site dit « 122 identifiants posés au calendrier » |
| ④.5 | Archivage en échec → 0 écriture | scénario ④ : **1 archive tentée, 0 écriture**, hub inchangé (**0 `id`**), mémoire à **122 `id`** (le site continue en lecture), message affiché à l'écran : capture `tests/01bis-a-4-archivage-echoue.png` |
| ④.9 | Non-régression | `function edt*` **149** (aucune disparue, aucune ajoutée — listes comparées nom à nom) · `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** (identique bit à bit) · `edtApparier` **0 appel** avant et après · trois portes inchangées · correctif ③ non touché · **node --check VERT** et **acorn ES2020 VERT** sur les deux blocs `<script>` |
| ④.10 | Garde | `python3 verif_edt.py index.html` → **VERT**. Trois contrôles négatifs posés sur le candidat final, **tous ROUGE (code retour 1)** : ① `mjpcSucces()` ajouté dans le bloc → « ① le bloc EDT appelle hors contrat : mjpcSucces » · ② `edtCharger()` appelé hors du bloc → « ② appelé hors du bloc sans être une porte : edtCharger » · ③ écriture vers `/site/ailleurs/` → « ③ écriture hub hors de /site/edt/ et hors exception » + « ③ chemin hub en dur hors de /site/edt/ : /site/ailleurs/ » |
| ④.11 | Audit adverse | voir ci-dessous |

**Avant / après, même parcours, même faux hub** (`node tests/banc-… base-8.73.0-1.html`) :
| | hub sans `id` au chargement |
|---|---|
| **AVANT** (8.73.0-①) | 0 archive · 0 écriture · hub toujours à **0 `id`** — les identifiants ne vivaient qu'en mémoire et repartaient à chaque chargement (`tests/AVANT-8.73.0-1-2-hub-sans-id.png`) |
| **APRÈS** (8.73.0-①bis-a) | 1 archive · 1 écriture · hub à **122 `id`** (`tests/01bis-a-2-hub-sans-id.png`) |

### Audit adverse — ce que j'ai cherché à casser
- **Hub vide (l'état réel)** : rien ne se déclenche, aucune écriture. ✔
- **JSON tronqué / tableaux qui n'en sont pas** : calendrier = une chaîne, `grille.creneaux` = un objet, une période `null`, une période sans nom, dates inversées → **aucune erreur de page**, aucune écriture parasite ; seules les 2 périodes réelles reçoivent leur `id`, archive avant écriture. ✔
- **Trois objets d'un coup** : 3 archives **puis** 3 écritures, chaque écriture après son archive. ✔
- **L'archivage tombe au milieu, sur un seul objet parmi trois** : **0 écriture** (voir dette 2). ✔
- **Deux chargements concurrents** : **1 seule archive, 1 seule écriture**, et l'identité est en mémoire dans les deux chargements. ✔
- **Mise à niveau pendant une modale ouverte** : mesuré statiquement — `edtMettreANiveau` ne touche **pas au DOM** ; le seul affichage est `atInfo`, le toast du site, qui se superpose sans fermer la modale (visible sur la capture ④). Pas éprouvé au clic (voir « ce que je n'ai pas pu mesurer »).
- **Aucune écriture n'est sortie** : `/site/edt` au vrai hub relu après tous les bancs → **`null`** ; `/corbeille/2026-08-31` → **`null`**.

## Deux dettes trouvées en mesurant, fermées dans cette livraison
**Dette 1 — l'archive contenait déjà ce qu'elle devait sauver.** `edtPoserIds` **mute les objets en place**. Les charges tournant avant l'archivage, `edtArchiver(…, EDT[nom])` archivait l'objet **déjà modifié**. Pour la charge `identite` la perte est nulle (l'archive et l'écrit ne diffèrent que par les `id` ajoutés), mais le mécanisme était faux pour toute charge qui **retire** quelque chose — et la livraison ② en retire une (`justifie`). Corrigé : photo JSON des objets **avant** les charges, archivée telle quelle. Mesuré : `ARCHIVE … → id dans la donnée archivée : 0` alors que le hub écrit en porte 122.

**Dette 2 — l'abandon n'était pas global, et le site le disait faux.** Chaque objet archivait puis écrivait pour son compte. Mesuré sur le candidat intermédiaire, archivage tombant sur `grille` seule, trois objets à mettre à niveau : **2 écritures parties** (`calendrier`, `periodes`) pendant que le site affichait « rien n'a été écrit ». Corrigé : **toutes les archives d'abord, les écritures seulement si toutes ont abouti**, abandon global sinon. Remesuré : **0 écriture**, message affiché, hub inchangé, identité en mémoire.

**Ajout lié** : un verrou (`EDT.miseANiveauEnCours`) empêche deux chargements concurrents d'archiver et d'écrire deux fois la même chose. Il **n'arrête que l'écriture** — les charges tournent toujours, donc l'identité est en mémoire dans tous les cas — et se lève dès que toutes les archives ont répondu, jamais bloqué. Un `.catch` a été ajouté sur l'archivage : **un archivage qui lève est un archivage échoué**, pas un rejet silencieux.

## Écarts signalés, jamais ajustés
1. **§①.1 « appelée après que les charges ont tourné » — la lettre est intenable, mesuré.** Si l'appel est ajouté **après** l'exécution nue des charges (ancienne L18034 conservée), la mise à niveau **n'écrit jamais rien** : les charges viennent de poser les `id` en mémoire, le second passage n'en pose plus aucun, `objets` est vide, sortie sans écriture — et les preuves ④.4 et ④.5 deviennent impossibles. Le branchement **remplace** donc l'exécution nue : `edtMettreANiveau` fait tourner les charges elle-même (son propre code, L18021), puis décide d'écrire. Les charges tournent une fois, comme avant. Signalé, pas réécrit.
2. **`mjpcPutJson` ne rappelle pas son callback sur refus ou panne** : il signale l'issue par le canal du site (`mjpcSignalerIssue`, avec « retenter »). Conséquence : le `apres(true)` de `edtMettreANiveau` n'est appelé que si **toutes** les écritures sont acceptées. Aucun appelant ne passe `apres` aujourd'hui (le branchement appelle `edtMettreANiveau()` sans argument), donc rien n'en dépend. Non corrigé : y toucher voudrait dire écrire par un autre transport que celui du contrat.
3. **Un `id` posé n'est jamais recalculé** : rien dans cette livraison ne recalcule ni ne compare un `id`. Le §① reste tenu.

## Ce que je n'ai pas pu mesurer
- **Le parcours par clics dans l'écran EDT** (panneau prof → emploi du temps). Le banc charge le fichier en `file://` sans session professeur ; les captures montrent donc l'écran d'accueil, avec le message de la mise à niveau et la version en bas à droite. Entrer dans le panneau prof demande un code d'accès que je n'ai pas. **Les captures avant/après livrées sont donc celles du même parcours de chargement, pas d'un parcours de clics dans l'EDT.**
- **Rien n'a été joué sur le vrai hub** : `/site/edt` est resté `null` du début à la fin.

## Livrables poussés au sas (`PONT/EDT/`)
- `index.html` — candidat **8.73.0-①bis-a**
- `rapport-2ter-01bis-a.md` — ce rapport
- `tests/banc-mise-a-niveau-01bis-a.mjs` — le banc, rejouable d'une commande
- `tests/01bis-a-2-hub-sans-id.png`, `tests/01bis-a-4-archivage-echoue.png`, `tests/AVANT-8.73.0-1-2-hub-sans-id.png`, `tests/AVANT-8.73.0-1-4-archivage-echoue.png`

## ARRÊT
Livraison ①bis-a terminée, sans dette ouverte. La suite est **①bis-b** : les périodes qui perdent leur `id` dans `edtFusionnerPeriodes`, et la revue de toutes les reconstructions d'objet du bloc. Paul relance par « continuer ».
