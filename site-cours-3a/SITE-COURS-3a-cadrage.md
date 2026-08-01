# SITE-COURS-3a — CADRAGE (exécutant → conscience)
**01/08 · j'attends le feu vert**

## Lu (md5 mesurés)
**doctrine du site `bbc34f10fd772eb16b0268cafaebe3f5`** — **XIII.3 lue en entier** (JSON pas HTML, règle de partage, critère de tri, relecture obligatoire) et XIII.4 (le gabarit unique à composantes cochables, métaphore de l'orgue) · DISPOSITIF `6546b8b2ff84397e2549da60eac184d2` · **DOCTRINE `c92d863d0fad9714a756d5552c97f3be`** · **CHANTIER `e5722295b1c9c06936e639ce22c94c71`** · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · **journal `a3381e47e89cd75aa6f0aa6c4af98ce2`** · canon **`d89d456389f598c7a731cf894a60a4cb` (1.4.0, §12)**.
**Base** : `index.html` **626 088 o · `3f68b6a46cfe2ce9f012af0f02f3cb2f` · 8.12.1** (SITE-COURS-2c promu + correctif). Mécanique mesurée : `ATELIER_PROMPT_SEED` porte **deux produits** (`chapitre`, `fiche_seance`) ; les fonctions de la zone sont **toutes top-level** (positions relevées) ; `AT_NOEUD='/site/atelier/documents'`, `AT_IA_NOEUD='/site/atelier/prompts'`, `CH_KINDS`/`CH_SOURCES` mesurés.

## Le vocabulaire de blocs — dix, et ce que j'écarte
| bloc | contenu | pourquoi |
|---|---|---|
| `titre` | texte | le titre de la diapositive |
| `sous_titre` | texte | |
| `puces` | liste de lignes | le plus fréquent d'un cours |
| `numeros` | liste de lignes | une procédure, des étapes |
| `definition` | terme + texte | « X : … », omniprésent en grammaire |
| `exemple` | texte (+ source facultative) | l'exemple encadré |
| `citation` | texte + auteur + œuvre | avec sa source, exigence de Paul |
| `tableau` | en-têtes + lignes | tableaux **simples** seulement |
| `note` | texte (+ ton : rappel / attention) | le « à retenir », le « attention » |
| `image` | `ref` Drive + légende + alternative textuelle | ce qui reste graphique |
**Écartés, et pourquoi** : *colonnes libres* (une mise en page, pas un contenu — et impossible à rendre à 390 px) · *schéma fléché, frise, carte heuristique* (la doctrine les envoie sur Drive : les décrire en JSON serait « une trahison ») · *couleur, police, taille* (**l'IA ne choisit jamais la forme**) · *animation, transition* (n'ont pas de sens hors PowerPoint). **`image` porte une alternative textuelle obligatoire** : sans elle, on perd le lecteur d'écran qui est l'un des motifs du morceau.

## La forme du JSON
```json
{ "produit":"diaporama", "titre":"Le portrait — séance 2", "niveau":"3e",
  "diapos":[ { "titre":"Les procédés du portrait", "blocs":[
      {"type":"puces","items":["Le portrait physique","Le portrait moral"]},
      {"type":"definition","terme":"Un portrait","texte":"description d'un personnage…"},
      {"type":"citation","texte":"Elle était belle…","auteur":"Hugo","oeuvre":"Les Misérables"},
      {"type":"image","ref":"1AbC…","legende":"Gravure de 1862","alt":"Portrait gravé de Fantine"} ] } ] }
```
**L'IA ne décrit que le contenu** ; aucun champ de forme n'est acceptable — un `style`, une `couleur` ou une `classe` **sera refusé en étant nommé**.

## Où je stocke, et pourquoi : **`/site/diaporamas/<id>`**
**Pas** `/site/atelier/documents` : l'atelier est **l'établi** (les feuilles que Paul compose), le site est **la maison** (ce que l'élève ouvre). Un diaporama converti est un **contenu de cours publié**, du même ordre qu'une dictée — et les dictées vivent sous `/dictees`, pas dans l'atelier. Le mettre dans l'atelier mêlerait deux durées de vie : un brouillon de travail et une ressource que des items de séance référencent. **Conséquence pratique** : un diaporama supprimé de l'atelier ne casserait pas les items qui le désignent, parce qu'il n'y est pas.

## Devenir un item de séance — **sans toucher au format d'item**
Mesuré : `openItem(level,chnum,snum,itemId)` **dispatche par `kind` + `source`** (`dictee`, `reecriture`, `qcm`, `debat` → `firebase_app`, plus une branche `gallery` avec **viewer dédié interne**). Un diaporama devient donc `{kind:'diaporama', source:'firebase_app', ref:'<id>'}` — **les trois champs existent déjà**, aucun format ne change. Il faut **une branche de plus dans `openItem`** et un **viewer** qui rend le JSON par le gabarit — sinon le diaporama serait injectable mais invisible (Q2). Et **`kind:'diaporama'` doit rejoindre `CH_KINDS`** pour que le prompt maître de chapitre puisse le désigner : **un ajout de vocabulaire, pas un changement de format** (Q3).

## La relecture réellement praticable — ma proposition
Un aperçu passif ne fait pas relire. Je propose une **relecture bloc à bloc en regard** : chaque bloc s'affiche **dans sa forme finale** (le gabarit appliqué) **et** avec son **texte brut sélectionnable** juste à côté, plus une case **« relu »**. Un compteur dit « **7 blocs relus sur 12** », et **le bouton d'écriture reste inactif tant que tout n'est pas relu** — avec un raccourci « tout marquer relu » qui, lui, **est un geste explicite de Paul** (il assume, il n'est pas piégé). Motif : la doctrine dit qu'une règle recopiée de travers *« se propage aux élèves avec l'autorité du site »* ; une case à cocher par bloc rend la faute visible **au moment où on peut encore la corriger**. Les blocs `image` affichent leur **alternative textuelle**, qui est précisément ce que personne ne relit jamais.

## Le rendu (le cœur, et la raison d'être du morceau)
Un gabarit unique, **une forme par bloc**, dans la charte : aucune dépendance externe, texte sélectionnable, **`@media print`** dédié (c'est un cours), et **390 px sans balayage horizontal** — les tableaux passent en **liste de paires libellé/valeur** sous 480 px plutôt que de déborder, ce qui est la seule façon honnête de rendre un tableau au téléphone. Mesures au banc, pas impressions.

## Ancres et portées (les deux pièges du fichier)
`/* ═══ fin § ZONE PROMPT IA ═══ */` existe **deux fois** (CSS et JS) : j'ancre par contexte sur la portée JS, comme à 2c. **Le socle n'est pas contigu** (pastille au milieu) : **je n'y touche pas du tout** — le canon 1.4.0 y est déjà, mon morceau n'a rien à y ajouter. Ma section ira après `§ PROMPT MAÎTRE DE CHAPITRE`, top-level, et **chaque fonction sera vérifiée sur `window` au banc navigateur**.

## Questions (3)
**Q1 — le nœud `/site/diaporamas/<id>`** (plutôt que l'atelier) : validé ?
**Q2 — la branche `openItem` + le viewer sont-ils dans ce morceau ?** Sans eux, un diaporama converti n'est pas ouvrable par un élève : le morceau livrerait une capacité morte. **Je propose de les livrer** (une branche de plus, patron `gallery` déjà présent). Si tu préfères les renvoyer à un 3b, dis-le — mais alors 3a produit des données que rien ne lit, et je le signalerai au rapport.
**Q3 — ajouter `diaporama` à `CH_KINDS`** pour que le prompt maître le désigne : validé ? (Ajout de vocabulaire ; le format d'item et la validation existante ne changent pas.)
