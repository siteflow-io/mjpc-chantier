# p8-2 — le moteur des schémas de l'ancien déroulé, repris, lisible par construction (le rendu)
*Exécutant, session cloud de Claude Code, 06/10/2026. Mandat `MANDATS/MANDAT-DEROULE-MAQUETTE-P8.md` (version 3), livraison p8-2. Branche `deroule/p8-2`, partie de `deroule/p8-1`.*

## Ce que ça change pour la classe
Au tableau, un schéma est dessiné comme dans l'ancien déroulé — une couleur par famille, une bulle par notion, les bulles écartées pour ne pas se toucher — mais **toujours lisible du fond** : 32 pt pour le centre, les familles, les dates et les nœuds de tête, 26 pt pour les notions, **à tous les crans** de « Texte au tableau ». Réglé « Un à un », chaque ▶ fait paraître **une bulle** (la famille, puis chacune de ses notions, dans l'ordre de la source), **à sa place** : rien ne bouge au tableau quand une bulle arrive. Dans l'atelier, quand un schéma ne tient pas lisible, « Sur la forme » et « À régler » le disent, mesuré, avec le geste : « coupe-le ».

## La base et son md5
- Gabarit de départ : `TRANSCRIPTS/C12/pieces/T265-v9c15p7-template.html` (md5 `0c497a635d99e461babd08cdf16feb4f`), qui régénère la p7 au md5 `5045f337d930faaa9cb073e203cf44eb` (prouvé en p8-1).
- Le moteur repris : `AT_DR_B64` d'`index.html` de production à la base `c9bc2d9` — **md5 d'`index.html` : `ac792b28f40d3a0510e725fc4a6b6985`** ; décodé : 232 358 octets, **229 960 caractères** (le chiffre du mandat), md5 `e7ceefa87d9bce00ebcf860cfa636d9f`. Les fonctions des schémas, lues en entier, sont recopiées telles quelles dans `moteur-ancien-extrait.js` (lignes 284-288, 820-1060, 1455-1466, 1619, 1703-1726, 1759-1786, 1806-1808 du fichier décodé) : c'est la pièce contre laquelle chaque écart ci-dessous se vérifie.
- Production : lue, rien écrit. `index.html`, `correction_dictee.html`, `main` du sas : pas touchés.

## Les pièces
- `p8-moteur.js` — le moteur repris, **à part, sous le préfixe `p8`** (chaque nom cherché dans le gabarit avant d'être écrit, n°12 · 40 : aucun n'existait).
- `patch-p8-2.py` — le patch appliqué au gabarit p7 ; il exige chaque motif **une fois exactement** (sinon il s'arrête) et imprime les tailles avant / après.
- `regen.sh` — gabarit p7 + `p8-moteur.js` → `v9c15p8-2-template.html` (patch) → `maquette-pilotage-ordi-v9c15p8-2-manipulable.html` (générateur `T159-gen-par-difference.py`, bloc de données de la v9c13, inchangé).
- md5 : voir « Les empreintes » en fin de NOTE.

## Ce qui a été modifié, compté
### Dans le gabarit (fonctions de la p7 touchées, taille avant → après, en octets)
| fonction | avant | après | quoi |
|---|---|---|---|
| `elements` | 591 | 803 | un schéma compte ses **bulles** (`p8Elements`), plus `b.el` (T10, décision 6) |
| `rendre` | 16 663 | 17 071 | le bloc schéma branché sur le moteur repris ; la carte ne répète pas son titre (décision 2) ; `p8Poser` après la pagination |
| `alertesForme` | 7 137 | 7 376 | la règle p7 « moins de la moitié de la diapo » **retirée** ; à sa place, la mesure (p8-2 § 5) |
| `formulaireObjet` | 15 057 | 15 161 | « Schéma… » crée le schéma réglé « Un à un » (décision 6 ter) |
| `dessinerSchema` (p7) | 4 352 | **retirée** | T10 : remplacée par le moteur repris ; plus aucun appel |
| ouverture de la fenêtre du tableau (`$('bvideoproj').onclick`) | — | — | la liste fermée des fonctions passées au tableau reçoit les **21 fonctions `p8`** (toutes celles de `p8-moteur.js`) et les constantes `P8_*` (n°12 · 75, T7) ; la fenêtre redessine le dernier état reçu quand elle change de taille (T7) |
| ajoutées | — | — | `p8MesureDiapo` (1 182 o, la mesure d'une diapo du chapitre, rendue hors écran telle que la classe la voit) ; la préhension (4 626 o, T6) ; le style (classes `p8-…`, n°12 · 40 et 48) |
Taille du gabarit : 414 492 → 442 013 o ; insertion du moteur : 22 190 o.

### Le moteur : chaque fonction de l'ancien, et ce qu'elle devient (taille avant → après)
| ancien | repris | taille | écarts avec l'ancien code, et la ligne du tableau qui les justifie |
|---|---|---|---|
| `schLignes` | `p8Lignes` | 147 → 146 | aucun (le nom) |
| `cle` | `p8Cle` | 89 → 91 | aucun (le nom) |
| `SCH_COUL`, `COUL` | `P8_SCH_COUL`, `P8_COUL` | — | aucun (T8 : repris tel quel) |
| `schEch` | `p8Ech(pt)` | 81 → 78 | lit le cran de « Texte au tableau » de la maquette (26 · 32 · 38 · 44 · 52) au lieu de `PT[iz]` ; **ne sert plus qu'à la géométrie** (rayons, écarts), jamais à la police (T1) |
| `mesure` | `p8Mesure` | 176 → 1 033 | **la boîte réelle** du texte rendu (un SVG caché, même police, `getComputedTextLength`) au lieu de « caractères × 0,54 » (T4) ; les marges 52 et 14 de l'ancien sont gardées, converties par `u` (l'unité de l'ancien en pixels : `u` = police des notions ÷ (13 × échelle), T1) ; hauteur `fs × 2,1` inchangée |
| `separe` | `p8Separe` | 1 649 → 2 505 | les longueurs 4 et 3 converties par `u` (T1) ; **T5** : (1) le cadre visible est une limite, alors une poussée que le cadre bloque passe sur l'autre axe s'il a la place (`p8Place`, 192 o) ; (2) le dernier recours « on descend la plus basse » ne sort plus du cadre : si le bas l'arrête, la bulle part sur le côté qui a de la place ; ce qui se touche encore, la mesure le dit |
| `surface` | **non reprise** | 400 → — | T1 : elle agrandissait le dessin, que l'écran réduisait ensuite — le texte rapetissait. Plus jamais. |
| `dessine` | `p8Dessine` | 549 → 1 315 | épaisseurs × `u` (T1) ; la frise écrit sa date en 32 pt et l'événement en 26 pt (deux `tspan`, T1 : « dates » = titres) ; classe `p8-pas` / `spot-on` par bulle (T2) ; **un fond blanc opaque sous la bulle** pour qu'une bulle pâle au pilote cache les traits qui passent dessous (T2) ; l'infobulle de la bulle, dans l'atelier seulement (T6 ; règle « chaque geste porte son infobulle ») ; classes `p8-n`, `p8-bouge` (n°12 · 40) |
| `carte` | `p8Carte` | 2 441 → 1 616 | polices de la loi : 32 pt centre et familles, 26 pt notions (T1) ; les positions de l'ancien calculées dans le repère 1000 × 560 **étiré sur la place « plein »** (`sx`, `sy`, T6) ; plus d'appel à `surface` ni de recadrage du `viewBox` (le dessin n'est jamais mis à l'échelle, T1) ; chaque trait porte ses deux bulles (`data-a`, `data-b`) pour la mesure (T4) et la classe de la bulle qu'il atteint (T2) ; le contexte passe en paramètre au lieu de la variable globale `bSch` (T3, T7) |
| `frise` | `p8Frise` | 2 085 → 1 975 | idem carte (T1, T6, T2) ; la source « date = événement » des feuilles est lue aussi (**T9**, « repris tel quel ») ; l'infobulle du point « Tire ce point pour changer sa date » dans l'atelier (T6) ; classe `p8-jal` (n°12 · 40) |
| `arbre` | `p8Arbre` | 1 770 → 1 404 | nœuds de tête 32 pt, les autres 26 pt (T1) ; repère étiré (T6) ; `surface` et recadrage retirés (T1) ; traits classés (T2) |
| `cycle` | `p8Cycle` | 2 224 → 1 982 | étapes 26 pt (T1) ; repère étiré (T6) ; une flèche paraît avec l'étape qu'elle atteint, la dernière quand le cycle se referme (T2) ; marqueur `p8-fl` (n°12 · 40) |
| `grille` | `p8Grille` | 315 → 477 | en-têtes 32 pt, cases 26 pt (T1) ; chaque rangée classée (T2) ; au tableau, une rangée non dévoilée est cachée **à sa place** (`visibility:hidden`, bordures par case) pour que rien ne bouge (T2) |
| `schemaHTML` | `p8SchemaHTML` | 836 → 276 | **ne coupe plus la source au dévoilé** avant de calculer les places (T2) ; ne lit plus `b.vues` (T3) |
| `elems` (part du schéma) | `p8Elements` | — → 383 | la même liste (famille puis notions ; une ligne pour les autres formes ; « Tout ensemble » : rien), rendue en textes pour les comptes de la maquette ; pas de `b.vues` (T3) |
| `tirSch`, `jalSch`, `PRIS`, mousedown / mousemove / mouseup | `p8Tir`, `p8Jal`, `P8_PRIS` (préhension) | 4 626 o en tout | **dans l'atelier seulement** (T6) ; `pos` reste dans le repère 1000 × 560 (T6) ; un déplacement de moins de 2 px n'est pas un déplacement (un clic ne fixe pas une place, T6) ; à la fin du geste, l'enregistrement de la maquette (`marquerModif`, « ✔ enregistré ») au lieu de `sauve()` / `lire()` (T6) ; le point de frise garde le séparateur de sa ligne (`:` ou `=`, T9) |
| `repeintSch` | `p8Redessiner` | 54 → — | T6 : redessine **le dessin du schéma seul**, plus tout l'écran |
| `marquePris` | `p8MarquePris` | 147 → — | classe `p8-pris` (n°12 · 40) |
| — | `p8Contexte` (299), `p8Dessin` (400), `p8Poser` (581), `p8Cls` (108), `p8Trait` (326), `p8Svg` (155) | | nouvelles, sans équivalent : les tailles de la loi (T1), le dessin mémorisé tant que rien ne change, posé dans la place réelle et repris par le morph (T6, n°12 · 69), les classes et traits factorisés (T2) |
| — | `p8MesureLisible` (5 458) | | **la mesure unique** (p8-2 § 5) |

**Ce qui n'est pas repris** (T3) : `b.vues`. **Repris tel quel** : `b.devoilerTout` (le réglage), `forme`, `titre`/`txt`, `src`, `pos` (T9).

## La mesure (une seule, pour les bancs et pour l'atelier)
`p8MesureLisible(diapo)` compte, sur ce qui est **affiché**, contre **le cadre réellement visible** (la place du dessin, rognée par chaque ancêtre qui coupe) : les **chevauchements** (bulle × bulle, et bulle × toute autre couche de la diapo qui porte du texte : étiquette, titre, consigne, point de connexion…), les bulles **hors du cadre visible**, les **traits qui passent à travers un mot** (60 points par trait, contre la boîte du texte de chaque bulle qui n'est pas l'une de ses deux bulles), les **libellés sur deux lignes**, les **polices sous 26 pt** (taille réelle × échelle d'écran, loi 32 pt = 5,6 % de la hauteur de la diapo). Dans l'atelier, chaque diapo à schéma du chapitre est rendue hors de l'écran **telle que la classe la verra** (rendu tableau, tout dévoilé) et mesurée ; si un compte n'est pas à zéro : « Schéma « … » : il ne tient pas lisible — coupe-le : clic droit sur une famille → Couper le schéma ici », avec les cinq chiffres. Le geste « Couper le schéma ici » arrive en p8-3 : en p8-2, la phrase le nomme, aucun bouton n'est inerte.

## Les bancs, comptés
| banc | ce qu'il vérifie | `ok(` |
|---|---|---|
| **test-p8-2-formes** (nouveau) | par le geste : cinq formes + la vraie carte créées par « + bloc » → « Schéma… », seules sur leur diapo (la consigne supprimée au clic droit) ; « Un à un » (6 ter) ; le nombre de bulles ; la mesure à 0 dans l'atelier et « Sur la forme » muet ; pour chaque forme, en « Jouer en avance », la fenêtre du tableau à 1280 × 720 : ce qui est montré avant tout ▶, pâle au pilote / absent au tableau, **les places de toutes les bulles et de tous les traits identiques avant et après chaque ▶, au pilote et au tableau**, exactement une bulle de plus à chaque ▶, la diapo entière après n ▶ ; les cinq crans de « Texte au tableau » parcourus au clavier, aucune police sous 26 pt au pilote ni au tableau ; trois tailles d'écran, colonnes ouvertes et repliées (double-clic sur les poignées) : la mesure à 0 ; la vraie carte mesurée et capturée | 21 (dans des boucles : par forme, par ▶, par cran, par taille d'écran) |
| test-p7-schema-envoi | **recalé (T10)** : section 1 — le schéma simulé (sans réglage, donc « Tout ensemble », décision 6 ter) est dessiné par le moteur repris (10 bulles : le centre, 3 familles, 6 notions) et paraît **d'un coup** au pilote et au tableau (les 3 vérifications « une branche par ▶ » de la p7 n'ont plus d'objet sur ce schéma : le dévoilement bulle par bulle est vérifié par `test-p8-2-formes`) ; section 2 — les dessins se comptent en bulles `g.p8-n` / rangées (la carte de deux branches : 6 bulles au lieu de 2 lignes) ; « trop dense » est le message de la mesure (« ne tient pas lisible », « Couper le schéma ici ») | 16 → 13 |
| test-p4a-p7 | inchangé (il vérifie `b.el` du formulaire, que le formulaire écrit toujours) | 28 |
| les 22 autres | inchangés | 488 |

## La sortie du banc unique
`sorties/tous-les-bancs.txt` — 25 bancs (le nouveau en tête). Résumé : voir la fin de la NOTE (« Le banc unique, résultat »).

## Les captures (toutes regardées) — `captures/`, avec leurs cinq chiffres dans `captures/MESURES.txt`
- Pour chaque forme (**carte** à trois familles, **frise**, **arbre**, **cycle**, **tableau**), dévoilée **à moitié** puis **en entier** : `p8-2-<forme>-pilote-<moitie|entier>.png` (le pilote, écran entier 1536 × 864), `…-zoom.png` (la diapo seule), `p8-2-<forme>-tableau-<moitie|entier>.png` (la fenêtre du tableau, 1280 × 720) — 30 captures. **Chacune : 0 chevauchement · 0 hors du cadre visible · 0 trait à travers un mot · 0 libellé sur deux lignes · 0 police sous 26 pt.** Ce qu'elles prouvent : à moitié, le non-dévoilé est pâle au pilote et **absent** au tableau, à sa place ; en entier, tout tient, lisible.
- **La vraie carte « Les figures de style »** (8 familles, **26 notions** — 34 bulles à dévoiler) : `p8-2-vraie-carte-atelier.png` (+ `-zoom`) et `p8-2-vraie-carte-tableau.png` (34 / 34). **Elle ne tient pas** : au pilote, 93 chevauchements · 0 hors du cadre · 215 traits à travers un mot · 0 sur deux lignes · 0 sous 26 pt ; au tableau, 93 · 0 · 217 · 0 · 0 (1366 × 768 : 69 · 0 · 177 · 0 · 0). Les captures le montrent : les familles du bas s'empilent. **Ni la police ni rien d'autre n'a été baissé** ; « Sur la forme » dit « il ne tient pas lisible — coupe-le ». La conscience le rapporte à Paul.
- **Un chiffre du mandat corrigé par la mesure** : la source de la vraie carte (`CONSULTANT/CHAPITRE-1/chapitre-3e-poesie-peinture-final.json`) a **26 notions**, pas 27 (4 + 3 + 4 + 3 + 3 + 2 + 3 + 4) : 34 ▶, pas 35.

## Les défauts trouvés et corrigés (avec leur cause)
1. **La carte à trois familles s'entassait en bas du cadre** (2 chevauchements, 4 traits à travers un mot). Cause : l'écartement de l'ancien pousse toujours sur l'axe du moindre recouvrement, et son dernier recours descend sans limite ; avec le cadre devenu une limite (T5), la poussée était annulée par le cadre à chaque tour. Corrigé dans `p8Separe` (T5, deux points listés plus haut) ; mesuré : 0.
2. **Le tableau coupait « la forme » sur deux lignes.** Cause : mon style plaçait la table en `position:absolute; left:50%` — sa largeur était limitée à la moitié de la place. Corrigé (`width:max-content`).
3. **Au tableau, après redimensionnement de la fenêtre, le dessin restait à l'ancienne taille.** Cause : la fenêtre du tableau ne redessinait qu'à la réception d'un état. Corrigé (T7) : elle redessine le dernier état reçu.
4. **Au pilote, une bulle pâle laissait voir le trait qui passe dessous, à travers le mot** (« Figures d'insistance »). Cause : la transparence s'appliquait à toute la bulle. Corrigé (T2) : un fond blanc opaque sous la bulle.
5. **Au tableau, les rangées non dévoilées d'un tableau laissaient voir leur grille vide.** Cause : bordures fusionnées (`border-collapse`). Corrigé : bordures par case ; la rangée est absente, à sa place.
6. La mesure nommait les bulles par le texte de leur infobulle. Cause : `textContent` du groupe (qui contient `<title>`). Corrigé : le texte de la bulle.
7. Mon banc attendait 27 notions (le chiffre du mandat) ; la source en a 26. Corrigé dans le banc ; dit ci-dessus.

## Ce qui est simulé
Rien de nouveau dans la donnée de la maquette : le schéma simulé « Les figures de style » (3 familles, sous une consigne, `b-sim-schema`) est celui de la p7, inchangé. Les cinq formes et la vraie carte des captures sont **créées par le banc, par le geste**, dans une maquette ouverte pour l'occasion : elles ne sont pas dans la trame livrée (p8-3 y pose la vraie carte, sur une diapo à elle).

## Ce qui reste
- **p8-3** : « Schéma… » sur une diapo pleine, les gestes grisés, « Couper le schéma ici », le panneau du schéma (forme, « Un à un / Tout ensemble », contenu, « ⌖ Réordonner »), le banc du déplacement d'une bulle. **La préhension (T6) est codée en p8-2** (elle fait partie du moteur repris) mais **n'est pas encore éprouvée par un banc** : c'est `test-p8-3-gestes` qui la rejoue.
- La vraie carte ne tient pas lisible sur une diapo entière : c'est à Paul (par la conscience) ; p8-3 la coupe par le geste.
- Rien d'autre : aucune dette cachée.

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`. En tête : node v22.22.0 · playwright 1.56.1 · chromium 141.0.7390.37 · maquette jouée `maquette-pilotage-ordi-v9c15p8-2-manipulable.html`, md5 `88f76892c316b36753915580e7bf8621` · 25 bancs. Résumé : **25 lignes « fin : 0 défaut(s) »** (test-p8-2-formes, audit-affichage-p7, test-p7-schema-envoi recalé, et les 22 autres), « TOUS LES BANCS : 0 défaut », code 0. Les captures livrées sont celles écrites par ce passage du banc unique, et ce sont celles que j'ai regardées.

## Les empreintes
- Maquette générée : `maquette-pilotage-ordi-v9c15p8-2-manipulable.html` — md5 `88f76892c316b36753915580e7bf8621`.
- Gabarit : `v9c15p8-2-template.html` — md5 `53c8d39d7bec6183d1477d83331d6e46`.
- Tous les fichiers de la livraison : `EMPREINTES.md5`, contrôlé par `md5sum -c` avant de pousser.
