# ATELIER-RAYONS — RAPPORT DE LIVRAISON (TEMPS 2)
**Les transversales et les onglets d'apps.** Exécutant [C5-AR], sous conscience n°5 · 06/08/2026.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.34.0) | 818 372 o | `ac02bd59ab0a7d4fecadab8fd5e0cc3d` |
| LIVRÉ (8.35.0) | 830 142 o | `33dfe78a9a401d1ba251d7a9217c37b9` |

Double parseur **VERT** · **0 fonction supprimée** · 11 éditions, chaîne reproductible.

## 2 · ① Les onglets — voie (c) appliquée

**Analyse logique est branchée** sur le type réel `analyse_logique`, au patron EXACT de `showDicteeList` : `section-label`, phrase d'intention, `renderItemListByChapter`, **puis la porte de l'app EN DERNIER** (règle du 31/07). Ouvreur `_openAnalyseFromList` sur le modèle de `_openDicteeFromList`. Aucun second moteur : `collectChapterItems` est appelé tel quel, son filtre de publication à trois étages reste la seule vérité élève.

**Les trois coquilles** (Analyse d'image, Étude de texte, Rédaction) gardent `showEmptyTab` et portent chacune, **à l'endroit exact du futur appel**, un repère cherchable **`[C5-AR] À BRANCHER — <APP>`** nommant : la fonction à appeler (`collectChapterItems(level,'<kind>')`), le `kind` à poser par la modale LIER, l'ouvreur à écrire, le patron à suivre (`showDicteeList`) et la règle de la porte en dernier. Trois repères, un par onglet ; le quatrième marque le produit 8 réservé. Cherchables par « À BRANCHER ».

## 3 · ② Les rayons — la collecte réelle remplace le squelette figé

`collectRayons(level)` appelle `collectChapterItems(level,'atelier')` puis **range** le résultat d'après le produit que la feuille déclare (`/site/atelier/documents/<id>/produit`, lu par `atSiteGetDocs` → `LINK_ATELIER_DOCS`). `renderRayons` remplit les zones existantes (`.fiche-drop-zone[data-section]`) via `renderItemListByChapter` — **donc par chapitre**, le dézoom de Paul — et **alimente les compteurs figés du HTML** (`count-fiches-grammaire`, `count-fiches-notions`, `count-prepa-brevet`, `count-analyse-logique`) : aucun compteur nouveau créé. L'appel se fait à l'ouverture de l'onglet (`switchTab`), avec chargement du cache des feuilles s'il est vide.

**Un produit sans `rayon` est ANCRÉ** : il ne remonte pas (ligne ancré/transversal du 29/07). Le rangement découle du produit, jamais d'un menu au moment de lier.

### 3.1 · Les sept produits et leurs LOTS DE CASES — à valider par Paul, case par case

**Fiche de séance** (`fiche_seance`) — rayon : **ANCRÉ** (vit dans la séance) — 16 cases pré-cochées
> `titre` · `seance` · `date_seance` · `classe` · `niveau` · `chapitre` · `date_edition` · `annee_scolaire` · `objectif` · `notions` · `criteres_reussite` · `a_retenir` · `consigne` · `zone_lignee` · `travail_a_faire` · `mention_conserver`

**Support de cours** (`support_cours`) — rayon : **ANCRÉ** (vit dans la séance) — 11 cases pré-cochées
> `titre` · `seance` · `chapitre` · `niveau` · `objectif` · `notions` · `a_retenir` · `definition` · `exemple` · `citation` · `ecran_seul`

**Bilan (retour élève)** (`bilan`) — rayon : **ANCRÉ** (vit dans la séance) — 15 cases pré-cochées
> `titre` · `nom_eleve` · `classe` · `niveau` · `periode` · `date_edition` · `annee_scolaire` · `competences` · `notions` · `place_agregats` · `place_resultats` · `place_absence` · `criteres_je` · `a_retenir` · `mention_conserver`

**Fiche grammaire** (`fiche_grammaire`) — rayon : Langue — 11 cases pré-cochées
> `titre` · `niveau` · `notions` · `definition` · `a_retenir` · `attention_piege` · `exemple` · `contre_exemple` · `methode` · `cases_a_cocher` · `mention_conserver`

**Fiche notion** (`fiche_notion`) — rayon : Langue — 12 cases pré-cochées
> `titre` · `niveau` · `notions` · `domaine_socle` · `definition` · `a_retenir` · `exemple` · `lexique_seance` · `methode` · `prolongements` · `place_strates` · `mention_conserver`

**Prépa brevet** (`prepa_brevet`) — rayon : Brevet — 13 cases pré-cochées
> `titre` · `niveau` · `objectif` · `methode` · `criteres_reussite` · `consigne` · `sujet_redaction` · `nb_mots` · `bareme` · `note_sur` · `duree_prevue` · `zone_lignee` · `mention_conserver`


**Fiche analyse logique** (`fiche_analyse_logique`) — rayon : Aller plus loin — 10 cases pré-cochées
> `titre` · `niveau` · `notions` · `methode` · `definition` · `exemple` · `consigne` · `extrait_numerote` · `zone_lignee` · `mention_conserver`

**Produit 8 — Point d'étape : RÉSERVÉ, non codé.** Un repère `[C5-AR] À BRANCHER — PRODUIT 8` marque sa place dans la table, avec ses cases pivots nommées (`place_agregats`, `place_resultats`, `place_absence`, `periode`, `date_edition`) et sa dépendance (M15 + Concordance).

**Doctrine respectée : les produits sont des pistons, jamais des verrous.** Le lot pré-coche, Paul ajoute ou retire ensuite : **aucune case n'est verrouillée**. Le grisage des cases incohérentes n'est **pas fait dans ce morceau** — je le déclare comme le mandat l'autorise.

**La place des strates est déjà là** : `place_strates` (composante existante parmi les 111) est pré-cochée dans le lot de la fiche notion — le morceau des strates par niveau et le réglage d'impression pourront s'y loger sans rien déplacer. Rien d'autre n'a été codé de ce périmètre.

### 3.2 · Requalifier une feuille existante

Les six feuilles de Paul portent toutes `produit:'fiche_seance'`. Un **menu de produit sur la carte de « Mes feuilles »** (`atProduitMenu`) permet de les requalifier : `atFeuilleProduitPoser` écrit **une seule fois, le seul champ** `/site/atelier/documents/<id>/produit` — prouvé au journal.

### 3.3 · Observation de structure (déclarée)

Le rayon **« Aller plus loin » ne vit pas dans l'onglet Fiches transversales** mais dans **Zone autonomie** (`#tab-autonomie`, section « Aller plus loin », zone `analyse-logique`) : c'est la structure existante du site, je l'ai alimentée là où elle est plutôt que de la déplacer. Les rayons Langue et Brevet sont bien dans Fiches transversales.

## 4 · ③ Les libellés d'onglets éditables (section Architecture)

`TAB_LABELS` cesse d'être la seule source : `TAB_LABELS_HUB` porte les remplacements lus sur `/site/libelles/onglets`, `tabLibelle(tabId)` sert le libellé courant avec **repli sur le libellé d'origine** (rien de posé = rien ne change, jamais de trou), `tabLibellesAppliquer` pose le texte sur les boutons. L'éditeur vit dans **Architecture** (`_profSectionArchi`, 1 302 → 2 151 o) : un champ par onglet, le libellé d'origine en repère et en `placeholder`, **une écriture fine par libellé** (`/site/libelles/onglets/<tabId>`) — vider le champ efface la valeur et restaure l'origine.

## 5 · Fonctions — inventaire (0 supprimée)

BASE 738 → LIVRÉ 752. **14 ajoutées** : `collectRayons` 579 · `renderRayons` 905 · `_rayonPoser` 134 · `zone` 230 · `gotoFiches` 334 · `_openAtelierFromList` 172 · `_openAnalyseFromList` 201 · `atProduitRayon` 102 · `atFeuilleProduitPoser` ~560 · `atProduitMenu` 396 · `tabLibelle` · `tabLibellesCharger` · `tabLibellePoser` · `tabLibellesAppliquer`. **3 modifiées** (relues entières) : `switchTab` 464 → 614 (appel des rayons à l'ouverture) · `gotoAnalyse` 1 191 → 1 590 (collecte + porte en dernier) · `_profSectionArchi` 1 302 → 2 151 (éditeur de libellés).

## 6 · Textes soumis à Paul

Éditeur de libellés : « Libellés des onglets » / « Ces mots sont lus par les élèves. Change-les quand tu veux : vide = le libellé d'origine revient. » · menu de produit : « Produit… » · échecs : « ⚠ Le produit n'a pas pu s'enregistrer. » / « Le libellé n'a pas pu s'enregistrer. » · le message de vide des rayons est celui du patron existant (« Aucun élément disponible pour le moment. ») · les libellés et infos des six produits nouveaux (§3.1).

## 7 · Banc de preuve — **BILAN : 15/15 VERTS** (run unique)

Chemin réel, hub intercepté, **aucune écriture réelle**. Décor : six feuilles de produits variés liées dans **trois chapitres différents** de 3e, une dans une **séance non publiée**, une **fiche de séance publiée** (produit ancré), un élément en 4e, rien en 6e/5e.

```
VERT  · P1 · élève : la fiche grammaire, la fiche notion, la prépa brevet et l'analyse logique sont rangées chacune dans SON rayon
VERT  · P1 · élève : les compteurs FIGÉS du HTML portent les nombres réels
VERT  · P1 · élève : chaque carte porte SON chapitre d'origine (le dézoom de Paul)
VERT  · P1 · élève : le produit ANCRÉ (fiche de séance) ne remonte PAS aux transversales
VERT  · P1 · élève : la fiche liée dans une séance NON PUBLIÉE n'apparaît PAS
VERT  · P2 · élève : ANALYSE LOGIQUE est branchée
VERT  · P3 · une coquille dit une phrase sobre au lieu de rester vide
VERT  · P4 · LES QUATRE NIVEAUX : 6e et 5e vides (message, pas d'erreur), 4e un élément, 3e servie
VERT  · P4 · un rayon vide affiche le message du patron, jamais une page blanche
VERT  · P5 · prof : requalifier le produit d'une feuille = UNE écriture fine du seul champ produit
VERT  · P5 · prof : l'éditeur de libellés d'onglets vit dans ARCHITECTURE, un champ par onglet
VERT  · P5 · prof : poser un libellé = UNE écriture fine /site/libelles/onglets/<tabId>
VERT  · P5 · le repli tient : TAB_LABELS reste la valeur d'origine quand rien n'est posé
VERT  · P6 · 390 vue élève : les rayons sont là et la page ne déborde pas
VERT  · P7 · `published` n'est JAMAIS écrit par ce morceau
=== BILAN ATELIER-RAYONS : 15/15 VERTS ===
```

Exigences de preuve tenues : **les quatre niveaux** (6e et 5e vides avec le message du patron, 4e un élément, 3e servie) · **vue élève rejouée et capturée** (desktop et 390) et vue prof · **la fiche liée dans une séance NON publiée n'apparaît pas** · **le produit ancré ne remonte pas** · **`published` jamais écrit** · 390 px sans débordement.

## 8 · Écarts et amenées (déclarés)

1. Rayon « Aller plus loin » dans Zone autonomie (§3.3) — structure existante, non déplacée.
2. Pas de grisage des cases incohérentes (autorisé par le mandat).
3. Amenées de banc : `SECU.valide` posé · attente explicite du chargement des chapitres avant lecture · décor 4e injecté dans le nœud `/site/4e.json` (servi sans fusion par la tête) · identité élève de la classe publiée pour la 4e.
4. `_openAtelierFromList` ouvre la feuille par `atOuvrirFeuilleEleve` si elle existe, sinon par la visionneuse — l'ouvreur élève des feuilles d'atelier n'est pas l'objet de ce morceau.

---
**STOP.** `ATELIER-RAYONS/index.html` + `rapport.md` + 4 captures au sas. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-AR]*
