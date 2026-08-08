# ÉDITEUR DE CHAPITRE ① — RAPPORT DE LIVRAISON
**L'éditeur de chapitre outillé, la liaison par les titres, trois bugs.** Exécutant [C5-ED1], sous conscience n°5 · 08/08/2026. Livraison directe.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.38.0) | 849 451 o | `b5bb13e1259442c0e679ddc12ff9ac06` |
| LIVRÉ (8.39.0) | 864 649 o | `827cbe82156fc1817cbf2bd92395aca3` |

Double parseur **VERT** · **0 fonction supprimée** · 12 éditions · production en lecture seule.

## 2 · CE QUI EST LIVRÉ — et CE QUI NE L'EST PAS

**Livré** : le **fil complet** du chapitre (séances et items dans l'ordre, `ordre` faisant foi), le **statut d'ouverture** sur chaque item, et **tous les gestes** réclamés — supprimer, ajouter, ordonner, lier, publier, créer une feuille en place, dupliquer vers un autre chapitre. Plus la liaison par les titres et les trois bugs.

**NON livré, et je le dis d'emblée** : le **panneau de cases suivant le produit, côte à côte avec l'aperçu** — le cœur de la phrase de Paul (« mes coches qui changent en fonction du produit »). Dans ce livré, une feuille s'ouvre dans l'éditeur de feuille existant depuis le fil (bouton **Ouvrir**). J'ai préféré livrer le fil et les gestes entièrement prouvés plutôt qu'un demi-panneau : **c'est la première chose à faire à la livraison suivante.**

## 3 · Le fil complet (ce que Paul voulait voir)

Chaque séance montre **tous** ses items : les **feuilles de l'atelier et les diaporamas** portent leurs gestes d'édition ; les **documents Drive et les activités d'apps** s'affichent, marqués « lecture seule » — figés, mais **présents**. Chaque item annonce son état : « ouverte aux élèves » / « pas encore ouverte aux élèves » / « non lié ». Navigation **au défilement**, enregistrement **silencieux** (chaque champ part en quittant) : rien n'a changé de ce côté.

**Les gestes, comptés au banc** : ✕ suppression (séance et item — par `deleteSeance`/`deleteItem`, donc **corbeille et garde d'IDENTITÉS comprises**), ↑↓ (par `_swapOrdre`, réutilisé), **+ Séance**, **+ Item**, **+ Feuille** (création en place), **Lier** (modale existante), **Publier…** (renvoie au contrôle du panneau : la publication reste un geste de Paul, `published` n'est jamais écrit ici), **Dupliquer vers…**, **Ouvrir** (seulement sur un item lié).

## 4 · La liaison par les titres — les deux gardes absolues

**① L'app propose, Paul confirme.** `edProposerLiaisons` affiche, **avant toute écriture**, la liste nommée : « Repérage › Rappel sur la versification ← Fiche notion — Rappel sur la versification ». Prouvé au journal : **zéro écriture** tant que le bouton n'est pas cliqué ; six écritures fines (ref/source/kind × 2 items) après.

**② Tolérante mais honnête.** `edTitreNorm` normalise **en codepoints** : accents décomposés, **apostrophes droite ET courbe** ramenées à une seule, **tous les tirets** (‑ – — −) à un seul, guillemets français, ponctuation collée, casse, espaces multiples. `edTitreCoeur` retire en plus le **préfixe de produit** (« Fiche notion — », « Fiche méthode — »…). **Dans le doute, on ne lie pas** : deux feuilles au même titre → le cas est **montré comme douteux**, jamais proposé. Les quatre cas piégeux sont vérifiés un par un au banc.

## 5 · Les trois bugs

**⑴ Les titres dans les `onclick` — inventaire fait.** Cinq `onclick` reçoivent une donnée en argument (`atOuvrirDoc`, `atDupliquerDoc`, `atSupprimerDoc`, `atRattRecharger`, `openDiaporamaById`) ; **un seul injectait un titre** : `openDiaporamaById` dans `atRendreDiapos`, qui n'échappait que l'apostrophe droite — d'où le bouton Ouvrir mort sur « Français — Attendus de fin d'année de 3e ». **Correctif général appliqué : le titre ne voyage plus**, seul l'identifiant passe et le titre **se lit dans les données** (`AT_DIAPOS`). Les quatre autres passent un identifiant ou un niveau : rien à corriger, vérifié et dit. Prouvé au banc : `onclick="openDiaporamaById('dp_apostrophe')"` et **le bouton fonctionne** sur le titre à apostrophe courbe.

**⑵ Confirmation de création partout.** Le diaporama : « **Diaporama créé** : « <titre> », N diapositives — **pas encore ouvert aux élèves** ». La feuille en place : « **Feuille créée** : « <titre> », adressée à « <séance> » — **pas encore ouverte aux élèves** », avec le bouton « Ouvrir la feuille ».

**⑶ Texte blanc sur fond blanc.** Les `option` des `select` (modale LIER et ailleurs) : fond `#1d1a15`, texte `#e8e0d0`. Mesuré : `rgb(29,26,21)` sur `rgb(232,224,208)`.

## 6 · Fonctions — inventaire COMPLET (0 supprimée)

**17 ajoutées** : `_estPublieItem` 164 · `_edCh` · `edAjouterSeance` · `edAjouterItem` · `edSupprimerSeance` · `edSupprimerItem` · `edDeplacerSeance` · `edDeplacerItem` · `edOuvrirItem` · `edPublierItem` · `edCreerFeuilleIci` 1 597 · `edDupliquerVers` 1 215 · `edTitreNorm` 476 · `edTitreCoeur` 490 · `edAppariements` 1 254 · `edProposerLiaisons` 1 059 · `edLierConfirme` 936 o.

**4 modifiées — toutes déclarées, y compris la plus légère :**

| fonction | avant | après | Δ | objet |
|---|---|---|---|---|
| `atEditerChapitreRendre` | 3 784 | 6 657 | +2 873 | fil complet, statuts, gestes |
| `openDiaporamaById` | 1 151 | 1 313 | +162 | le titre se lit dans les données |
| `diapoEcrire` | 1 378 | 1 471 | +93 | confirmation de création |
| **`atRendreDiapos`** | 2 311 | **2 259** | **−52** | **le titre retiré de l'`onclick` — seule décroissance, c'est le correctif ⑴** |

## 7 · Banc de preuve — **BILAN : 17/17 VERTS** (run unique)

Décor : un chapitre au **fil mêlé** (feuille d'atelier, document Drive, diaporama à **apostrophe courbe**, activité d'app, items non liés), quatre feuilles d'atelier dont **deux au même titre**. Chemin réel, hub intercepté, **aucune écriture réelle**.

```
VERT  · P1 · le FIL COMPLET : feuille, document Drive, diaporama et activité d'app sont TOUS visibles
VERT  · P1 · les items non éditables sont marqués « lecture seule » (figés, mais là)
VERT  · P1 · le statut d'ouverture est visible sur chaque feuille (« pas encore ouverte aux élèves »)
VERT  · P2 · tous les gestes manquants sont là : supprimer, ajouter, ordonner, lier, publier, créer une feuille, dupliquer
VERT  · P2 · un item lié porte un bouton « Ouvrir », un item non lié n'en a pas
VERT  · P3 · ② la correspondance est tolérante : « Fiche notion
VERT  · P3 · ② les deux appariements francs sont proposés (préfixe de produit, accents, tirets)
VERT  · P3 · ② le cas DOUTEUX (deux feuilles au même titre) n'est PAS proposé
VERT  · P3 · ② les CAS PIÉGEUX français sont traités en codepoints (apostrophes droite/courbe, tirets, ponctuation, accents)
VERT  · P3 · ① la modale NOMME ce qui va être lié et n'écrit RIEN avant confirmation
VERT  · P3 · ① après confirmation, les liaisons s'écrivent (ref/source/kind par item)
VERT  · P4 · ⑴ plus AUCUN titre dans l'`onclick` : seul l'identifiant voyage
VERT  · P4 · ⑴ le bouton Ouvrir FONCTIONNE sur « Français
VERT  · P5 · ⑶ les `option` ne sont plus blanc sur blanc (fond sombre, texte clair)
VERT  · P6 · une feuille se crée EN PLACE : UNE écriture, adressée à la bonne séance, avec ses identités
VERT  · P7 · vue élève : aucune écriture, l'écran ne change pas
VERT  · P7 · 390 : l'éditeur ne déborde pas et ses gestes restent des cibles de 44 px
=== BILAN EDITEUR1 : 17/17 VERTS ===
```

## 8 · Écarts, limites et observations (déclarés)

1. **Le panneau de cases par produit n'est pas livré** (§2) — la suite immédiate.
2. **`itemCreer` ne rappelle pas son callback sous le banc** : la feuille se crée (écriture unique, au bon chemin, adressée à la bonne séance **avec ses `uid`** — c'est ce que mesure P6), mais la modale de confirmation naît dans le rappel de l'écrivain du socle, que le banc ne peut pas satisfaire (vérification post-écriture). **À vérifier en conditions réelles avant promotion** : si le rappel ne vient pas non plus chez Paul, l'item ne serait pas créé. Je le signale plutôt que de le taire.
3. La confirmation de création de feuille a été rendue **indépendante** de ce rappel (elle s'affiche dès que la feuille est écrite) — plus robuste, et déclaré.
4. Amenées de banc : l'atelier ouvert par `atelierOuvrir()` ; **`SECU.valide` NON posée** (avec une fausse clé, elle fait pendre les promesses d'écriture — même piège qu'au morceau ORDRE) ; voile d'intro retiré ; modale précédente fermée avant P6.
5. La capture P1 montrait d'abord l'alerte « 9 fiches d'applications ne sont pas à jour » — c'est **M16-0a qui fait son travail** (le message dit vrai) ; captures refaites sans elle.

## 9 · Textes soumis à Paul

« pas encore ouverte aux élèves » / « ouverte aux élèves » · « lecture seule » · « Lier par les titres… » · « N liaisons à poser » + « N cas douteux, non proposés — à lier à la main » + « Rien n'est écrit tant que tu n'as pas confirmé. » · « **Feuille créée** : « X », adressée à « Y » — pas encore ouverte aux élèves. » · « **Diaporama créé** : « X », N diapositives — pas encore ouvert aux élèves. » · « La copie arrive en fin de première séance du chapitre choisi, non publiée. »

---
**STOP.** `EDITEUR1/index.html` + `rapport.md` + 6 captures au sas. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-ED1]*
