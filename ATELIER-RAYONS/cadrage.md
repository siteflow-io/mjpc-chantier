# ATELIER-RAYONS — CADRAGE (TEMPS 1)
**Les transversales et les onglets d'apps.** Exécutant [C5-AR], sous conscience n°5 · 06/08/2026.
BASE mesurée : production **818 372 o, md5 `ac02bd59ab0a7d4fecadab8fd5e0cc3d`** (conforme au mandat).

## 1 · Le moteur existant, mesuré (à réutiliser tel quel)

`collectChapterItems(level, kind)` — l. 4472, **752 o**. Balaie `chapitresData[level]` → chapitres triés par `ordre` → séances triées par `ordre` → items triés par `ordre`, et **filtre à trois étages par `_visiblePourSession`** (chapitre, séance, item — M8-IDENTITÉ I1), puis `it.kind !== kind || !it.ref` écarte le reste. Rend `[{chnum, chapTitle, seanceTitle, itemId, item}]` : **le chapitre et la séance d'origine sont déjà portés**, c'est ce qui rend le dézoom possible sans rien inventer.
`renderItemListByChapter(items, onclickFn, bgColor, icon)` — l. 4546, **1 148 o**. Groupe par chapitre (intertitre ambré au changement de `chnum`), une carte par item, et **porte déjà le message de vide** : « Aucun élément disponible pour le moment. »

**Le filtre de publication est la seule vérité élève** : je ne le contourne nulle part, aucune collecte nouvelle ne relira les données autrement.

## 2 · L'état exact des dix onglets (compte vérifié au code — le mandat en annonçait quatre ou cinq)

| onglet | `goto…` | collecte ? | état réel |
|---|---|---|---|
| Dictée | `gotoDictee` | `collectChapterItems(level,'dictee')` | **branché** |
| Réécriture | `gotoReecriture` | `collectChapterItems(level,'reecriture')` | **branché** |
| Évaluation des connaissances | `gotoEvalConn` | `collectChapterItems(level,'qcm')` | **branché** (le mandat le croyait coquille — il ne l'est pas) |
| Analyse logique | `gotoAnalyse` | *aucune* | **porte d'app seule**, aucune collecte |
| Analyse d'image | `gotoImage` | *aucune* | **coquille** (`showEmptyTab`) |
| Étude de texte | `gotoEtude` | *aucune* | **coquille** (`showEmptyTab`) |
| Rédaction | `gotoRedaction` | *aucune* | **coquille** (`showEmptyTab`) |
| Fiches transversales | — | *aucune* | **HTML figé** (10 zones `fiche-drop-zone`, compteurs à « 0 fiches ») |

**Compte exact : 3 coquilles + 1 porte sans collecte**, non 4 ou 5.

## 3 · LE POINT DUR — ce que la mesure oblige à remonter avant d'éditer

### 3.1 · Les items n'ont pas de `kind` pour image / étude / rédaction
Les `kind` réellement produits par la modale LIER sont : `dictee`, `reecriture`, `qcm`, `atelier`, `applaudimetre`, `debat`, `doc`, `diaporama`, `gallery`. **Il n'existe aucun `kind` « image », « etude » ou « redaction »** : brancher ces trois onglets sur `collectChapterItems(level,'image')` collecterait toujours zéro. La doctrine relève d'ailleurs les types d'item réels au hub : `doc`, `dictee`, `analyse_logique`, `tache`.

**Ce que je propose (choix à Paul)** : (a) **collecter par produit de feuille** — ces trois onglets rassemblent les items `kind:'atelier'` dont la feuille déclare le produit correspondant (voie cohérente avec l'objet ②, aucun `kind` nouveau) ; (b) **ajouter les `kind` manquants** à la modale LIER (l'objet devient « une source de plus à lier », travail plus large) ; (c) **brancher seulement `analyse_logique`** (le seul type existant côté données) et laisser les trois autres en coquille avec la phrase sobre, en attendant que des contenus existent. Je ne tranche pas seul : chacune engage un modèle de données différent.

### 3.2 · `ATELIER_PRODUITS` ne déclare **qu'un seul produit**
Mesuré : la table contient **`fiche_seance` et rien d'autre**. Or l'objet ② range les feuilles dans Langue / Brevet / Aller plus loin **selon le produit déclaré** — et les produits 4 à 7 de la doctrine (**fiche grammaire, fiche notion, prépa brevet, fiche analyse logique**) **n'existent pas encore dans le code**. Le produit d'une feuille vit bien dans `d.produit` (lu par `loadAtelierDocList` via `atSiteGetDocs` sur `/site/atelier/documents`), mais aucune feuille ne peut aujourd'hui déclarer autre chose que `fiche_seance`.

**Conséquence** : ranger par produit exige d'**étendre `ATELIER_PRODUITS`** avec les quatre produits transversaux (déclaration minimale : libellé + lot de cases hérité de `fiche_seance`, la doctrine dit « des boutons qui pré-cochent des lots de cases »). C'est un ajout de table, pas un moteur nouveau — mais **cela dépasse « brancher ce qui manque »**, donc je le soumets. **Sans cette extension, l'onglet transversales serait alimenté mais toujours vide**, et je ne veux pas livrer un rayonnage sans rayons.

*Repli si Paul préfère ne rien étendre* : ranger par **section explicite** posée sur l'item au moment de la liaison (un menu « ranger dans : Langue / Brevet / Aller plus loin »), stockée `/…/items/<k>/rayon`. Plus pauvre conceptuellement, mais livrable sans toucher aux produits.

### 3.3 · Les six feuilles réelles du hub
`/site/atelier/documents` en porte six (`feuille_1785850139338`, `…917488690`, `…921383502`, `…938825852`, `…863030726`, `…007960913`). Leur produit sera relevé au TEMPS 2 pour la recette du cas réel de Paul (« je crée une fiche notion, je la lie, je ne la retrouve nulle part »).

## 4 · Ce que je compte livrer (sous réserve des arbitrages ci-dessus)

1. **Les onglets branchés** sur le patron EXACT de `showDicteeList` / `showEvalConn` : intertitre `section-label`, phrase d'intention, `renderItemListByChapter`, porte d'app en dernier quand elle existe (règle du 31/07). Aucun second moteur. `showEmptyTab` reste pour ce qui n'a rien à collecter, avec une phrase sobre — **texte proposé** : « Rien ici pour l'instant — les documents apparaîtront quand ton professeur les aura publiés. »
2. **Les transversales alimentées** : le HTML figé (10 `fiche-drop-zone`, compteurs à zéro) remplacé par une collecte réelle des items `kind:'atelier'` **publiés**, rangés en **Langue / Brevet / Aller plus loin** selon le produit de la feuille, **présentés par chapitre** via `renderItemListByChapter` (le double accès de Paul : chronologique dans les chapitres, dézoomé ici) ; **compteurs réels** en tête de section. **Les quatre produits ancrés** (fiche de séance, support de cours, bilan, point d'étape) **n'y remontent pas** — ligne ancré/transversal du 29/07 ; c'est un cas de banc explicite.
3. **Libellés d'onglets éditables** (point 26) : `TAB_LABELS` (l. 2361, 7 entrées en dur) gagne un repli hub — lecture `/site/libelles/onglets/<tabId>`, **une écriture fine par libellé** depuis le panneau prof, section **Contenu** (les sections existantes sont dashboard, classes, eleves, profil-test, archi, archives, corbeille, annonces, brevet, taxo, config, presence : **il n'y a pas de section « Contenu »** — je propose de poser l'éditeur dans `config`, ou de créer la section ; à trancher). Repli sur le libellé actuel si rien n'est posé. `published` jamais touché.

**Fonctions concernées, tailles de base** : `collectChapterItems` 752 · `renderItemListByChapter` 1 148 · `showDicteeList` 2 411 · `showReecritureList` 4 246 · `gotoEvalConn` 1 685 · `gotoAnalyse` 1 236 · `gotoImage`/`gotoEtude`/`gotoRedaction` 62 chacune · `showEmptyTab` 618 · `TAB_LABELS` (table) · le bloc HTML figé des transversales (l. 1355-1375). **0 fonction supprimée** ; toute extraction sera déclarée.

## 5 · Plan de preuve (TEMPS 2)

- Un onglet **vide** / avec **1 élément** / avec des éléments dans **3 chapitres différents** (les intertitres par chapitre vérifiés).
- **Une fiche liée dans une séance NON publiée n'apparaît PAS** (le filtre à trois étages, prouvé au journal).
- **Une fiche de séance (produit ancré) ne remonte PAS** aux transversales.
- **Les quatre niveaux** (6e, 5e, 4e, 3e), pas seulement la 3e.
- **Vue élève rejouée et capturée** (règle du dispositif) **et** vue prof ; **390 px et desktop**.
- Libellés : repli sans écriture ; une écriture fine par libellé ; le libellé posé s'affiche côté élève.
- Aucune écriture réelle, hub intercepté, `published` jamais écrit.

---
**STOP.** J'attends le feu vert de la conscience n°5 — et surtout **les trois arbitrages** : ① la voie pour image/étude/rédaction (a, b ou c) ; ② l'extension d'`ATELIER_PRODUITS` aux quatre produits transversaux (ou le repli « rayon posé à la liaison ») ; ③ où loger l'éditeur de libellés (section `config` ou section nouvelle).
*[exécutant C5-AR]*
