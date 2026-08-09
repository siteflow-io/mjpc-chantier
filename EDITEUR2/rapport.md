# ÉDITEUR DE CHAPITRE ② — RAPPORT DE LIVRAISON
**La visionneuse est l'impression.** Exécutant [C5-ED2], sous conscience n°5 · 08/08/2026. Livraison directe, les deux maquettes font foi.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.39.0) | 869 694 o | `6ccec065bad3661a8103954ae68c6829` |
| LIVRÉ (8.40.0) | 893 248 o | `fe991006366426e914e1a7bd92c73225` |

Double parseur **VERT** · **0 fonction supprimée** · 11 éditions · production en lecture seule.

## 2 · ① UN ÉCRAN, UNE IDENTITÉ

Ce qui disparaît : la barre de cartes mêlant feuilles, titres de séance et titre de chapitre ; le bouton « Éditer » caché. L'éditeur de chapitre est désormais **son propre écran**, ouvert par « Mes chapitres → Modifier ». L'éditeur de FEUILLE, lui, garde son comportement depuis « Mes feuilles » — les deux ne se mélangent plus.

## 3 · ② LES TROIS COLONNES (maquette 5)

**Le sommaire** — séances avec leur **teinte propre** (pastille), documents en dessous : **point plein** pour l'existant (cliquable, amène la feuille au repère), **point creux, grisé, italique** pour l'attendu non lié. En tête : « **4 documents sur 6 attendus** » — navigation ET avancement.
**Le panneau** — champs de la séance courante puis de l'item courant, avec tous les gestes de ce matin conservés (⑸⑶) : ↑↓, + Item, + Feuille, Éditer, Ouvrir, Lier, Publier…, Dupliquer vers…, ✕.
**L'atelier papier** — §5.

## 4 · ③ LES TROIS SYNCHRONISATIONS

**a. La feuille courante** est celle dont le centre est le plus proche du milieu de la zone de lecture ; elle porte le **halo doré permanent**, le sommaire l'allume. **Garde prouvée** : `document.activeElement` dans un champ → **le défilement ne change JAMAIS de feuille pendant une saisie**.
**b. Clic dans le document → le point d'édition exact** : la ligne du panneau est mise en valeur et **le curseur se place dans le champ** (capture `e9`).
**c. Clic sur un champ → la zone vient à l'écran et s'allume.**
**La sélection est PERSISTANTE des deux côtés** : elle survit au défilement, prouvé par verdict — « ça ne devrait s'éteindre que lorsque je quitte cette ligne ».
**Le piège mesuré est évité** : aucun `scrollIntoView` — le panneau et le papier se défilent en posant leur `scrollTop`, jamais autrement.

## 5 · ④ L'ATELIER PAPIER

**Des pages A4 réelles** (794 de large, marges, fond d'atelier, **folio « feuille N / M »**), documents à la suite, chaque séance ouverte par son **en-tête teinté**. Une séance sans document — ou un item attendu — devient un **TROU NOMMÉ** portant ses deux gestes sur place.

**Le compteur de feuilles est permanent et vivant** (« 1 feuille à imprimer »), recalculé à chaque rendu : c'est l'outil d'économie de Paul.

**Le réglage à trois positions, chacune avec son coût affiché** : *Au plus serré* (1 f.) · *Une séance par feuille* (2 f.) · *Un document par feuille* (4 f.) — **retenu d'une fois sur l'autre** (`localStorage`) et modifiable à chaque impression. **Le papier garde le dernier mot** : le réglage ajoute des sauts, il n'en supprime jamais un imposé par la place — prouvé par verdict (serré ≤ séance ≤ document), et un document qui ne tient pas glisse à la page suivante.

**L'outil de découpe** : une ligne pointillée avec ciseau là où deux documents partagent une feuille ; sous chaque document, un emplacement **visible en permanence**, sans mode à activer. **Deux couleurs à l'écran seulement** : **grise** (partage) · **dorée** (ajoutée par Paul). Toute ligne se retire par une croix au survol — « ces deux-là restent ensemble » — et l'emplacement redevient proposable. **Sur le papier : pointillés et ciseau, rien d'autre** (`@media print`), et **aucun vocabulaire de machine**.

**LA MARQUE DES MORCEAUX** : chaque document porte sa **référence imprimée « Ch. 1 · S. 2 »**, discrète, en tête de morceau — prouvée sur les quatre documents. Un morceau découpé n'est plus un papier orphelin.

**🖨 Imprimer** (cette feuille / tout le chapitre) et **Ouvrir dans un onglet** réutilisent `atelierPageHTML` et `atelierDocumentHTML`.

## 6 · ⑤ LES TROIS CORRECTIFS

**⑴ Le bug d'une ligne — déclaration citée avant écriture, comme exigé** : `var AT={doc:null,docId:null,liste:{},…}` — **`AT.liste` est un OBJET indexé par id** (12 accès `AT.liste[<id>]` mesurés) ; `.length` et `.forEach` ne répondaient jamais, le bloc ne s'exécutait pas et le menu de produit revenait en arrière. Écrit : `if(AT&&AT.liste&&AT.liste[id])AT.liste[id].produit=prod;` — prouvé.
**⑵ « Publier… » publie**, sur place, avec le choix des classes, en réutilisant `togglePublishItemCls` / `togglePublishItemAll` — aucun chemin d'écriture parallèle ; l'écriture est vérifiée au journal. `published` ne part que sur un geste de Paul.
**⑶ Les gestes de ce matin sont conservés**, rangés dans le panneau.

## 7 · Fonctions — inventaire (0 supprimée)

**26 ajoutées** : `ed2Documents` · `ed2Sommaire` · `ed2Pile` · `ed2Papier` · `ed2Pages` · `ed2HauteurDoc` · `ed2CoutFeuilles` · `ed2PagModeLu` · `ed2PagPoser` · `ed2CoupeCle` · `ed2CoupeBasculer` · `ed2CoupeRetirer` · `ed2Imprimer` · `ed2ImprimerChapitre` · `ed2ImprimerHTML` · `ed2OuvrirOnglet` · `ed2Poser` · `ed2Aller` · `ed2Suivre` 639 · `ed2PanVers` · `ed2PapierVers` · `ed2Selectionner` · `ed2ClicDocument` · `ed2ClicChamp` · `ed2Teinte` · `edPublierClasse` 268 o.
**3 modifiées, toutes déclarées** : `atFeuilleProduitPoser` 756 → 1 046 (+290, ⑴) · `edPublierItem` 246 → 1 400 (+1 154, ⑵) · `atEditerChapitreRendre` 6 844 → 7 953 (+1 109, les trois colonnes).

## 8 · Banc de preuve — **BILAN : 24/24 VERTS** (run unique)

Décor : chapitre au fil mêlé (feuille, document Drive, diaporama, activité d'app, item attendu, **séance vide**). Chemin réel, hub intercepté, **aucune écriture réelle**. **Le capteur d'exceptions JavaScript est un verdict du bilan** (leçon du 08/08) : aucune exception sur tout le parcours.

```
VERT  · P1 · TROIS COLONNES : sommaire, panneau, pile
VERT  · P1 · le sommaire dit l'avancement (« N documents sur M attendus »)
VERT  · P1 · chaque séance a SA teinte (pastilles distinctes)
VERT  · P1 · l'ATTENDU non lié ET la séance vide : grisés, italiques, points creux
VERT  · P1 · la feuille courante porte le HALO DORÉ (une seule)
VERT  · P2 · ③a la feuille courante suit le défilement de la pile
VERT  · P2 · ③a GARDE : le défilement ne change JAMAIS de feuille pendant une saisie
VERT  · P3 · un clic au sommaire amène la feuille au repère et l'allume des deux côtés
VERT  · P4 · ④ chaque document porte sa RÉFÉRENCE (Ch. N · S. N)
VERT  · P5 · ⑸⑴ AT.liste (OBJET indexé par id) est bien mis à jour
VERT  · P6 · ⑸⑵ « Publier… » ouvre le choix des CLASSES sur place (plus de renvoi au panneau)
VERT  · P6 · ⑸⑵ un clic sur une classe écrit la publication de CET item, par le chemin existant
VERT  · P10 · ④ des pages A4 réelles, avec folio « feuille N / M » et la référence sur chaque morceau
VERT  · P10 · ④ LES TROIS POSITIONS, chacune avec son COÛT en feuilles, et une seule active
VERT  · P10 · ④ le compteur de feuilles est affiché en permanence
VERT  · P10 · ④ le réglage AJOUTE des sauts, il n'en supprime jamais (serré ≤ séance ≤ document)
VERT  · P11 · ④ deux documents sur une feuille : une ligne pointillée GRISE avec son ciseau
VERT  · P11 · ④ une ligne AJOUTÉE par Paul est DORÉE (deux couleurs à l'écran seulement)
VERT  · P11 · ④ retirer une ligne dit « ces deux-là restent ensemble »
VERT  · P12 · ③b un clic dans le document mène au POINT D'ÉDITION exact (ligne en valeur, curseur dedans)
VERT  · P12 · ③ LA SÉLECTION EST PERSISTANTE
VERT  · P7 · vue élève : aucune écriture, l'écran ne change pas
VERT  · P8 · 390 : les trois colonnes s'empilent, la page ne déborde pas
VERT  · P9 · CAPTEUR : aucune exception JavaScript sur tout le parcours
=== BILAN ED2 : 24/24 VERTS ===
```

## 9 · Captures — **chacune ouverte et examinée avant livraison**

`e1_trois_colonnes` · `e2_publier_sur_place` · `e5_papier_serre` (compteur + les trois coûts + trous + ligne de découpe) · `e6_papier_une_seance_par_feuille` · `e7_papier_un_doc_par_feuille` (compteur à 4) · `e8_decoupe_ligne_grise` · `e9_point_edition` (ligne cerclée, curseur dans le champ, zone allumée) · `e3_vue_eleve` · `e4_390`.

## 10 · Écarts et observations (déclarés)

1. **Trois régressions rattrapées par le banc en cours de travail** : la séance vide invisible, les trous nommés perdus quand la pile est devenue le papier, le suivi de défilement resté branché sur l'ancienne colonne. Elles sont corrigées ; je les signale parce qu'elles disent la valeur du banc rejoué.
2. **Amenée déclarée** : pour prouver ③a, la fenêtre de lecture est étrécie à 260 px — les quatre documents du décor tiennent presque dans un écran de 950 px ; sur un chapitre réel elle défile d'elle-même.
3. La hauteur des documents est **estimée** (patron de la maquette papier) : le compteur est un ordre de grandeur fidèle, pas une mesure au pixel du rendu final.
4. Les autres amenées : atelier ouvert par `atelierOuvrir()`, voile d'intro fermé par son geste, `SECU` non posée.

## 11 · Textes soumis à Paul

« N documents sur M attendus » · « attendu — aucun document lié » / « rien à imprimer pour l'instant » · « N feuilles à imprimer » · « Au plus serré » / « Une séance par feuille » / « Un document par feuille » (+ coût « N f. ») · « ✂ couper ici » · « Ch. 1 · S. 2 » · « Un clic publie ou retire pour cette classe. Rien d'autre n'est touché. »

---
**STOP.** `EDITEUR2/index.html` + `rapport.md` + 9 captures au sas. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-ED2]*
