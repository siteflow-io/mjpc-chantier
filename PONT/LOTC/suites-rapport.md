# LOT SUITES — l'ordre des morceaux, et ce qui n'a pas bougé
Exécutant n°8 · 24/08/2026 · candidat `PONT/LOTC/suites-index.html`. **STOP après livraison.**
Lus avant de coder : `OU-EST-CE-DEJA-ECRIT.md` · `PASSATION-C6-C7.md` §⑦ · `PONT/LOTC/c3a-rapport.md`.
Ce lot a **abîmé un chapitre de Paul aujourd'hui**. La moitié de ce rapport est donc consacrée à prouver que **rien d'autre n'a bougé**, mécanisme par mécanisme, sur **sa trame réelle**.

## ⓪ SCEAU
| | |
|---|---|
| base re-téléchargée | md5 **`85a6c75946dd002327b36114090c2eb7`**, **1 485 415 o** = attendu (v8.65.1) |
| candidat | **1 487 846 o**, md5 **`8f8a7ecebdcd918777cbd645e3150d57`** |
| `APP_VERSION` | **8.66.0** · double parseur (`node --check` + acorn ES2020) : **verts** |
| moteur `AT_DR_B64` | **identique à l'octet** (md5 interne `e7ceefa87d9b…`) |
| `secu*` | **29 → 29, aucune divergente** · `published` : **97 → 97** |
| fonctions | **1 modifiée, 0 neuve, 0 supprimée** — `_drEnvelopper` : 7 243 → **9 628 o** |
| micro `__scissionGarde` | **identique à l'octet** (2 589 o) — **il reste, il n'a pas été touché** |
| écritures non-GET **sorties** | **0**, base comme candidat |

**Intouchés, corps comparés — AUCUN divergent** : le T-5 · `copierED` · le récit, le papier · `atDrReprendre` · `_drCopieAuto` · `_drTraceAuto`, `_drPaquetHeure`, `_drTraceReprendre` · `_drIdentifierEcrans`, `_drEidDuRang`, `_drEidNeuf`, `_drRangPere`, `_drRefusionner` (identité de C2) · tous les correctifs de C3a · `atDrClotureModale`, `atDrModifsDeLaSeance`, `_drNormaliserTrame`, `sesPhoto`, `sesTabPoll`, `sesEmettre` · côté moteur `scinde`, `degorge`, `verifDeborde`, `reabsorbe` : **appelés, jamais réécrits**.
**Une seule fonction touchée**, et par ajout : une enveloppe supplémentaire posée **avant** le micro dans `_drEnvelopper`, donc **autour** de lui à l'exécution.

## ① L'ORDRE DES SUITES — reproduit, puis corrigé
**Reproduit avec le geste de Paul** (parcours par clics, sa trame, écran scindé 900×600, curseur de zoom tiré à la main) :

| | 8.65.1 | candidat 8.66.0 |
|---|---|---|
| morceaux créés | 4 | 4 |
| **ordre observé** | **`PÈRE \| suite 4 \| suite 3 \| suite 2 \| suite 1`** | **`PÈRE \| suite 1 \| suite 2 \| suite 3 \| suite 4`** |
| rangs croissants | **non** | **oui** |

C'est exactement ce que Paul a vu en classe. **Cause confirmée** : le moteur insère toujours en `i+1` ; dans le comportement d'origine la position avançait sur le fils, donc le suivant se posait derrière lui ; le micro ramène la position sur le père, et chaque nouveau morceau se glisse **au même endroit**, repoussant les précédents.
**Le correctif n'empêche pas l'insertion** : il **replace** le morceau né de l'appel après le dernier morceau de son groupe. Ni le moteur, ni le micro, ni le rang `suite` calculé par le moteur ne sont touchés — **seul l'ordre physique change**, et il redevient celui des rangs. La position courante suit **l'objet** où elle était : si Paul tapait, elle reste sur son morceau ; sinon, sur le père.

**Le double titre et le « SUITE 1 » sur le père : NON REPRODUITS.** Mesuré `titresEnDouble: 0` et libellé du père `10:07 · Heure 1 · Analyse d'images…` — corrects **dans les deux versions**. Je ne les corrige donc pas : **je ne devine pas**. Deux pistes que je n'ai pas pu départager : ils pourraient être une conséquence d'affichage de l'ordre inversé (auquel cas ① les emporte), ou tenir à un cas que mon banc n'a pas produit. **À vérifier par Paul en classe**, c'est le juge.

## ② LA REFUSION — le défaut NE SE CONFIRME PAS avec le geste réel
La réserve de la conscience était justifiée. Mesuré, dézoom **cran par cran** (3 → 2 → 1 → 0) après quatre morceaux réels :

| | 8.65.1 | candidat |
|---|---|---|
| écrans du groupe au bas | 2 | 2 |
| **étapes présentes dans le groupe** | **6 / 6** | **6 / 6** |
| étapes de toute la trame | **7 = 7 au départ** | **7 = 7** |
| écrans totaux | **15 = 15 au chargement** | **15 = 15** |

**Il n'y a aucune perte.** Les six étapes sont toutes là, dans l'ordre, réparties 3 + 3 sur deux écrans. La formule « 3 étapes sur 6 recollées » décrivait le contenu **du père**, pas une disparition. Et ce qui subsiste s'explique : **le père déborde encore**, mesuré sur lui-même à chaque cran, **y compris à 24 pt** — `reabsorbe()` recolle tout, puis le rendu re-scinde ce qui ne tient pas. C'est le mécanisme normal, pas une refusion incomplète.
**Je n'ai donc rien corrigé sur ②, et je le dis en toutes lettres plutôt que de corriger à l'aveugle.** Reste une question qui appartient à Paul, et qui est de place, non de mécanisme : *est-il normal qu'à 24 pt, en écran scindé, une consigne à six étapes tienne sur deux écrans ?* Si la réponse est non, c'est un lot de mise en page, pas de refusion.

## ③ CE QUI PORTE LE CHAPITRE — prouvé mécanisme par mécanisme
Sur la **trame réelle de Paul**, chargée du hub en GET (`/site/3e/chapitres/0/seances/0/deroule/ecrans.json`), **base contre candidat** :

| mécanisme | 8.65.1 | candidat |
|---|---|---|
| **le chargement** — écrans / étapes | **15 / 7** | **15 / 7** |
| titres · durées · blocs de chaque écran | — | **identiques** |
| **le rendu** — libellés de bande, badge, titre de colonne | — | **identiques** |
| **le dévoilement** — avancer ×3 et reculer ×2 sur cinq écrans | 10 pas | **10 pas identiques** (`rev` et `vues`) |
| **l'enregistrement** — ce qui partirait au hub | 2 PUT, même chemin | **identiques** |
| trame exportée | **5 901 signes** | **5 901 signes** |
| **la session à trois pages** — structure des 5 photos émises | — | **identique** |
| tableau : écran désigné / `rev` | **3 / 2** | **3 / 2** |
| tableau : contenu projeté | `HEURE 1 · TABLEAU 3 Le Radeau de la Méduse…` | **le même** |
| téléphone : écran désigné | **3** | **3** |
| **la clôture, rien modifié** | *« Tu n'as rien modifié pendant le cours : ta préparation reste telle quelle. »* | **le même message**, `nbModifs: 0` |
| **la clôture, après modifications** | 14 modifications vues | **14** |

**La matrice actions × état, rejouée EN ENTIER, par l'état de la trame — identique dans les deux versions :**
| ligne | état mesuré |
|---|---|
| copier/dupliquer | identifiant **neuf**, original conservé, **0 doublon**, dévoilement à zéro, **fragment effacé** |
| déplacer | écran retrouvé par son identité, **même titre, même nombre de blocs**, total inchangé |
| supprimer | écran retiré, total = attendu, **marques purgées** |
| ajouter | écran créé, **à zéro** |
| zoom/dézoom | dévoilement transmis au morceau, **recollé au retour** (6 étapes sur 6, §②) |
| fiche | **dévoilement interne conservé** (`vues` inchangées, fiche ouverte) |

**Les trois interdits sont tenus** : l'identité des écrans n'est pas touchée (C2 intact, 0 doublon) · le micro de position est **identique à l'octet** · le dévoilement transmis aux morceaux est inchangé.

## ④ LE BANC — le geste, pas l'appel
`tests/banc_suites.js` · **le parcours réel aboutit** (`cadreParClics: true`) : Panneau prof → Atelier → Mes chapitres → Modifier → Séance → Déroulé, **par clics**. **Aucun appel direct à la fonction de scission** : le zoom est monté en tirant le curseur `rz` et en émettant son événement, les morceaux naissent par le mécanisme normal, **quatre**, comme chez Paul. Écran scindé **900×600**, cadre visible et dimensionné, hub simulé en lecture (garde `__hubPose`), **0 écriture sortie**.
Deux remarques de mesure, déclarées : le premier rendu en 900×600 scinde déjà (17 écrans bruts) — la référence est prise **après réabsorption**, à 15 écrans, ce qui correspond au chiffre du mandat. Un `pageerror` unique apparaît **dans les deux versions** (`(chaps||[]).forEach is not a function`) : il vient du parcours sur mon hub simulé, pas du lot.

## ⑤ CE QUE LE BANC NE PROUVE PAS
Le tactile · le clavier mobile · le réseau de l'établissement · le vidéoprojecteur · une vraie heure de classe · un écran d'une autre taille que 900×600 · et **le double titre / le « SUITE 1 » sur le père, que je n'ai pas su reproduire** (§①). **Le test de Paul reste le juge.**

## ⑥ LES TESTS MANUELS POUR PAUL
1. **Le symptôme** : sur la consigne à six étapes de l'Heure 1, monter le zoom jusqu'à obtenir trois ou quatre morceaux → la bande doit afficher **suite 1, suite 2, suite 3, suite 4**, dans cet ordre.
2. **Regarder les vignettes** pendant cette montée : y a-t-il encore un **double titre** ? le père porte-t-il encore **« SUITE 1 »** ? Si oui, dire lequel des deux subsiste — ils ne se sont pas reproduits au banc.
3. **Redescendre le zoom cran par cran** jusqu'en bas → vérifier que **les six étapes sont là**, dans l'ordre. Si elles restent sur deux écrans à 24 pt, ce n'est pas une perte : c'est la place.
4. **Rejouer un chapitre entier** en préparation : titres, durées, dévoilement, « où on en est » — rien ne doit avoir changé.
5. **Une séance avec les trois écrans** : vérifier que le tableau et le téléphone désignent le même écran que le pilote.
6. **Clore sans rien modifier** → le message doit être *« Tu n'as rien modifié pendant le cours »*.

---
*Livré au sas, non promu. Point de retour : production 8.65.1, md5 `85a6c75946dd002327b36114090c2eb7`.*

MEMO
