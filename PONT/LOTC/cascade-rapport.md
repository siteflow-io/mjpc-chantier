# LOT CASCADE — l'ordre du contenu, et l'étiquette qui chevauche
Exécutant n°8 · 25/08/2026 · candidat `PONT/LOTC/cascade-index.html`. **STOP après livraison.**
Ce mécanisme a été cassé trois fois aujourd'hui. **La troisième fois est la mienne** : le LOT SUITES déplaçait chaque morceau en fin de groupe, l'ordre des écrans devenait juste et l'ordre du contenu devenait faux. Ce lot défait cela.
Deux leçons appliquées à la lettre : **ce qui se voit se prouve par l'image** (deux captures regardées, §②) · **l'ordre du contenu se prouve étape par étape**, en numérotant les six étapes E1…E6 à la source et en les lisant de gauche à droite.

## ⓪ SCEAU
| | |
|---|---|
| base re-téléchargée | md5 **`8f8a7ecebdcd918777cbd645e3150d57`**, **1 487 846 o** = attendu (v8.66.0) |
| candidat | **1 490 154 o**, md5 **`9968969807aae52052ca0e6254d3daf9`** |
| `APP_VERSION` | **8.67.0** · double parseur (`node --check` + acorn ES2020) : **verts** |
| moteur `AT_DR_B64` | **identique à l'octet** (md5 interne `e7ceefa87d9b…`) |
| `secu*` | **29 → 29, aucune divergente** · `published` : **97 → 97** |
| fonctions | **1 modifiée, 0 neuve, 0 supprimée** — `_drEnvelopper` : 9 628 → **11 856 o** |
| micro `__scissionGarde` | **code identique à l'octet (605 o) et commentaire identique (1 371 o)** — il reste |
| ancien bloc `__ordreSuites` (LOT SUITES) | **retiré** : plus aucun déplacement après coup |
| écritures non-GET **sorties** | **0**, base comme candidat · `pageerrors` : **1 = 1** (issu du hub simulé, pas du lot) |

**Intouchés, corps comparés — AUCUN divergent** : le T-5 · `copierED` · le récit · le papier · `atDrReprendre` · `_drCopieAuto` · `_drTraceAuto` · `_drIdentifierEcrans` et toute l'identité de C2 · **`_drRefusionner`** · les correctifs de C3a · `atDrModifsDeLaSeance` · `sesPhoto` · `sesTabPoll` · côté moteur `scinde`, `degorge`, `verifDeborde`, `reabsorbe` : **appelés, jamais réécrits**. **La refusion n'a pas été touchée.**

## ① L'ORDRE DU CONTENU — mesuré étape par étape
Six étapes numérotées **E1…E6** dans la trame réelle de Paul, quatre coupures nées du geste (curseur de zoom tiré à la main, écran scindé 900×600, parcours par clics) :

| | 8.66.0 | candidat 8.67.0 |
|---|---|---|
| ordre des **écrans** | `PÈRE \| suite 1 \| suite 2 \| suite 3 \| suite 4` | **identique** |
| **contenu par écran** | `E1 \| E6 E3 E2 \| E5 \| E4 \| —` | **`E1 \| — \| E2 \| E3 \| E4 E5 E6`** |
| **lecture de gauche à droite** | **`E1 E6 E3 E2 E5 E4`** | **`E1 E2 E3 E4 E5 E6`** |
| dans l'ordre | **non** | **oui** |
| les six étapes présentes | oui | oui |
| position de Paul, retrouvée par identité | tenue | **tenue** |
| **au dézoom complet** | **`E1 E6 E4 E3 E2 E5`** | **`E1 E2 E3 E4 E5 E6`**, dans l'ordre |

**Le défaut était plus grave que décrit** : en production le contenu n'est pas seulement inversé à partir du deuxième morceau, il est mélangé — et **le désordre survit au dézoom complet**, donc il s'inscrit dans la préparation de Paul.

**Le correctif.** Le moteur seul est juste : il insère en `i+1` **et fait avancer la position sur le morceau**, si bien que le suivant se pose derrière **son parent immédiat** — c'est cela qui tient l'ordre dans une cascade. Le micro restaure la position après *chaque* coupure et son rendu de restauration re-scinde le père : la cascade perd son fil. Donc, pendant la cascade, **le moteur travaille seul** — `degorge` est temporairement remplacé par sa version nue, le micro ne s'interpose plus, et **rien n'est déplacé après coup**. La position n'est ramenée **qu'une fois, à la fin**, sur l'écran où Paul était, **retrouvé par son identité** (LOT C2), jamais par son rang. L'intention du micro est tenue, au bon moment ; quand il reprend la main, la position est déjà celle qu'il aurait posée, il ne fait rien. **S'il tapait, on ne restaure pas** : le curseur suit son morceau.

**Les rangs suivent l'ordre physique.** La cascade crée le morceau de la seconde moitié en premier : il porte le rang 1 et finit en dernier, si bien que la bande lisait « suite 4, suite 3, suite 2, suite 1 » alors que le contenu était juste. La renumérotation finale emploie **le motif exact de `supprimeSuite` du moteur** — rien n'est inventé — et `suiteDe`, qui porte le libellé « suite N » dans le contenu lui-même, est aligné dessus.

**Un morceau sans étape apparaît dans la cascade** (celui qui porte la fin du *texte* de la consigne, coupé). **Il existe aussi en production** — visible sur la capture de base, en SUITE 4. Ce n'est donc pas une régression, et je n'y touche pas. Différence : en production il se retrouve en dernier, loin du texte qu'il continue ; sur le candidat il suit immédiatement le père, ce qui est sa place.

## ② L'ÉTIQUETTE DE GROUPE — prouvé par l'image, regardée
**Captures cadrées sur la boîte du groupe, que j'ai ouvertes et regardées** : `tests/cascade-base-groupe.png` et `tests/cascade-candidat-groupe.png`.
- **Sur la production** : l'étiquette « HEURE 1 · ANALYSE D'IMAGES : LA ROUTINE · SUR PLUSIEURS ÉCRANS » et le libellé « 10:07 · HEURE 1 · ANALYSE D'IMAGES : LA ROUTINE » **se superposent** — deux textes l'un sur l'autre, illisibles.
- **Sur le candidat** : l'étiquette occupe deux lignes **au-dessus**, le libellé est **en dessous**, sur sa vignette. Les deux se lisent, rien n'est perdu.

Mesure concordante avec l'image, et non substituée à elle :

| | 8.66.0 | candidat |
|---|---|---|
| position CSS de l'étiquette | `absolute` | **`static`** |
| bas de l'étiquette / haut du libellé | **21 / 19** (elle passe dessous) | **32 / 34** (elle s'arrête avant) |
| se chevauchent | **oui** | **non** |

**Cause** : l'étiquette est en `position:absolute`, donc elle ne pousse rien et passe sous le libellé dès qu'elle tient sur deux lignes. On la remet **dans le flux**, par une surcharge CSS posée depuis le pont — le moteur n'est pas touché. Ce n'était pas un doublon de données : deux informations justes, mal placées.

## ③ CE QUI N'A PAS BOUGÉ — sur la trame réelle de Paul, base contre candidat
| mécanisme | résultat |
|---|---|
| chargement : **15 écrans**, titres, durées, blocs | **identiques** |
| rendu : libellés de bande, badge, titre de colonne | **identiques** |
| dévoilement : avancer ×3 / reculer ×2 sur cinq écrans, **dix pas** | **identiques** (`rev` et `vues`) |
| ce qui partirait au hub : empreinte des PUT | **identique** · trame exportée **5 919 = 5 919 signes** |
| session à trois pages : structure des photos émises | **identique** · tableau **0 / rev 2** = **0 / rev 2** · téléphone **3 = 3** |
| clôture sans modification | **« Tu n'as rien modifié pendant le cours »**, dans les deux |

**Matrice actions × état, rejouée en entier, par l'état — identique dans les deux versions** : copier/dupliquer (identifiant neuf, original conservé, **0 doublon**, dévoilement à zéro, fragment effacé) · déplacer (retrouvé par identité, même titre, même nombre de blocs) · supprimer (retiré, marques purgées) · ajouter (neuf, à zéro) · **zoom/dézoom (dévoilement transmis au morceau, recollé au retour — les six étapes, §①)** · fiche (dévoilement interne conservé).

## ④ LE BANC
`tests/banc_cascade.js` · parcours **par clics** abouti (Panneau prof → Atelier → Mes chapitres → Modifier → Séance → Déroulé) · **aucun appel direct à la coupure** : le zoom est monté en tirant le curseur `rz` et en émettant son événement, les morceaux naissent par le mécanisme normal, **quatre** · écran scindé **900×600** · cadre visible et dimensionné · garde `__hubPose` · hub en GET, **0 écriture sortie**.
Deux détails de méthode, déclarés : les six étapes sont numérotées **à la source** dans la trame servie par le hub simulé (rien d'autre n'est modifié) — sans cela l'ordre du contenu est illisible ; et la capture a demandé quatre essais avant d'être cadrée sur la bonne zone : **les trois premières montraient la page hôte, je ne les ai pas retenues.** C'est exactement le piège où le compteur remplace l'image.

## ⑤ CE QUE LE BANC NE PROUVE PAS
Le tactile · le clavier mobile · le réseau de l'établissement · le vidéoprojecteur · une vraie heure de classe · une autre taille d'écran que 900×600 · le cas où Paul **tape** pendant la cascade (le code ne restaure alors pas la position, mais je ne l'ai pas éprouvé au clavier réel) · le rendu de l'étiquette sur un écran très étroit, où elle pourrait tenir sur trois lignes. **Le test de Paul reste le juge.**

## ⑥ LES TESTS MANUELS POUR PAUL
1. **L'ordre du contenu** : sur la consigne à six étapes de l'Heure 1, monter le zoom jusqu'à trois ou quatre morceaux, puis **lire les étapes de gauche à droite** : elles doivent se suivre. C'est la seule vérification qui compte.
2. **Regarder la bande** : l'étiquette « sur plusieurs écrans » doit être **au-dessus** du libellé de la première vignette, sans le recouvrir.
3. **Redescendre le zoom jusqu'en bas** → les six étapes recollées **dans l'ordre**.
4. **Ne pas taper** pendant la montée du zoom : la vue ne doit pas partir sur un morceau.
5. **Taper** dans un champ jusqu'à déborder : le curseur doit suivre le texte sur le morceau neuf.
6. **Rejouer un chapitre entier** : titres, durées, dévoilement, « où on en est » — rien ne doit avoir changé.
7. **Clore sans rien modifier** → *« Tu n'as rien modifié pendant le cours »*.

---
*Livré au sas, non promu. Point de retour : production 8.66.0, md5 `8f8a7ecebdcd918777cbd645e3150d57`.*

MEMO
