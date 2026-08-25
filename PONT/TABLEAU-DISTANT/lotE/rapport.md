# LOT E — LE ZOOM TRAVERSE JUSQU'AU MUR
Exécutant MJPC · 25/08/2026 · candidat `PONT/TABLEAU-DISTANT/lotE/index.html`. **STOP après livraison. Je ne promeus pas.**
Phase 0 rapportée séparément ; arbitrage reçu (voie iii) ; ce rapport est la phase 1.

## CE QUE ÇA CHANGE POUR LA CLASSE
L'élève du fond lit le mur au cran que le professeur choisit, et il voit **tout** ce que le professeur voit sur son écran de contrôle — jamais une étape coupée en deux, jamais une étape perdue. Quand le professeur pilote au téléphone depuis le fond de la salle, sa réglette est **une télécommande du mur** : elle grossit le tableau et ne touche pas son propre écran.

## ⓪ SCEAU
| | |
|---|---|
| base retéléchargée | md5 **`868477343d4375d7be4d820ab8eb2630`**, **1 491 450 o** = attendu (v8.68.0) |
| candidat | **1 481 565 o**, md5 **`97390ad4c0b122983c5249b783da1758`** |
| `APP_VERSION` | **8.69.0** |
| double parseur | `node --check` + acorn ES2020, 2 blocs `<script>` (1 328 579 signes) : **VERTS** |
| moteur `AT_DR_B64` | **identique à l'octet** — md5 interne `2ba70f9ef8aa…` · `AT_DR_SHA256` inchangé |
| `secu*` | **29 → 29, corps tous identiques** |
| `published` | **97 → 97**, jamais écrit |
| fonctions | **4 modifiées · 6 neuves · 0 supprimée · 0 renommée · 0 rétrécie** |
| zones de diff | **19** |
| écritures **sorties** vers le hub | **0** sur les quatre bancs · `pageerror` **0** partout |

## ① CE QUI A ÉTÉ ÉCRIT
| fonction | avant | après |
|---|---|---|
| `sesPhoto` | 2 025 | **2 505** (+480) — la scène transporte `iz` et `ratio` |
| `sesAppliquer` | 899 | **1 349** (+450) — tout appareil **adopte** le cran reçu sans toucher son rendu |
| `sesTabPoll` | 1 619 | **1 831** (+212) — boîte, cran, composition |
| `sesTabMonter` | 1 186 | **1 286** (+100) — la boîte existe avant la première peinture |
| `_drRatioEcran` · `_sesTabBoite` · `_drMorceauDuDevoilement` · `_sesTabComposer` · `sesTelCran` · `sesTelMajCran` | — | 198 · 1 410 · 983 · 2 597 · 161 · 345 (neuves) |

**Intouchées, corps comparés à l'octet** : `_drVuePere` · `_drRefusionner` · `_drIdentifierEcrans` · `_drEidDuRang` · `_drRangDeLEid` · `_sesRangLocal` · `atDrJouer` · `sesEmettre` · `sesBrancherPilote` · `sesTelGeste` · `sesTelPeindre` · `sesTelChrono` · tout le T-5 · les 29 `secu*`. **Le pilotage PC et le tableau local Win+K ne changent pas d'un octet** — preuve au ④.

**Le principe** : le cran de zoom est un **état de session**, pas un état d'appareil. Chaque surface peut le poser (la réglette du PC, la télécommande du téléphone) et **toutes l'adoptent en le recevant sans modifier leur propre affichage** — sans quoi deux pilotes se le voleraient à chaque geste. Idem pour `ratio`, les proportions de l'écran de contrôle : le téléphone réémet celles qu'il a reçues, et n'en invente pas.

## ② LE CŒUR : « DÉVOILEMENT CUMULÉ → MORCEAU »
Le mur reçoit l'identité du **père**, le dévoilement **dans le référentiel du père** (`_drVuePere`, intouchée) et le **cran**. Puis, à chaque cycle : il **recolle** (`reabsorbe`), **remet les vues à zéro**, applique le dévoilement, **se découpe** avec son propre moteur dans une boîte aux proportions de l'écran de contrôle, va au **dernier morceau entamé**, peint, et **vérifie que ce qui est projeté tient**.

Aucun état ne survit d'un cycle à l'autre : deux états ne peuvent pas coexister par construction, pas par un ordre d'appels à surveiller.

## ③ TROIS PIÈGES PAYÉS AU BANC — nommés, parce qu'ils se reproduiront
1. **Le critère du morceau ne peut pas se lire dans le rendu.** J'avais écrit « le dernier morceau dont la page classe n'est pas vide ». Faux : un morceau de suite **réaffiche toujours l'activité et le titre hérités**, donc tout morceau paraît plein. Mesuré : le mur allait sur un fils à `vues:[0]` et projetait 94 signes au lieu de 311. Remplacé par une lecture de l'**état** (seuil hérité : 2 pour un fils, 1 pour le père).
2. **Les `vues` de la trame relue au hub survivaient à une reprise à froid.** La copie au fil de l'eau porte le dévoilement du moment ; un bloc que la scène ne mentionne pas restait dévoilé — **la classe aurait vu ce que le professeur avait replié**. Remise à zéro avant application.
3. **On mesure ce qui est PROJETÉ, pas ce qui est composé.** Le `deborde()` du moteur mesure le **cadre**, qui rend l'écran entier, grisé compris ; la toile ne peint que le dévoilé. M'y fier faisait recouper des morceaux qui tenaient : le mur montrait **151 signes contre 201** à la fenêtre locale au cran 5. La mesure est passée sur la toile.

## ④ LES PREUVES — banc rejoué à l'identique
`tests/bancE-preuve.mjs` (mur 16/9 **et** 4/3) · `tests/bancE-tel.mjs` · faux hub en mémoire · parcours par clics réels.

### La même image, cran par cran — mur 16/9 (1360×765)
| cran | fenêtre LOCALE (1280×720) | mur DISTANT | verdict |
|---|---|---|---|
| 1 — 24 pt | 30,2 px · prop **0,042** · 523 signes | 32,1 px · prop **0,042** · 523 signes | **texte identique** ✔ |
| 2 — 32 pt | 40,3 px · prop **0,056** · 523 signes | 42,8 px · prop **0,056** · 523 signes | **identique** ✔ |
| 3 — 38 pt | 47,9 px · prop **0,0665** · 311 signes | 50,9 px · prop **0,0665** · 311 signes | **identique** ✔ |
| 4 — 44 pt | 55,4 px · prop **0,077** · 201 signes | 58,9 px · prop **0,077** · 201 signes | **identique** ✔ |
| 5 — 52 pt | 65,5 px · prop **0,091** · 201 signes | 69,6 px · prop **0,091** · 201 signes | **identique** ✔ |

**Cinq crans sur cinq : même texte, même police après mise à l'échelle.** Base 8.68.0 pour comparaison : 43,0 px **aux cinq crans**, texte figé.

### Mur 4/3 (1024×576) — la découpe ne change pas
**Cinq crans sur cinq, texte identique**, police 24,2 · 32,3 · 38,3 · 44,4 · 52,4 px — mêmes proportions qu'en 16/9. La toile se **contient** au ratio de l'écran de contrôle : bandes en haut et en bas, **aucune déformation, aucune ligne coupée**. Capture : `E-deux-murs.png`.

### Les épreuves
| épreuve | 16/9 | 4/3 |
|---|---|---|
| replier ×3 au cran 5 | 39 signes des deux côtés ✔ | ✔ |
| **gel** : le cran change, le mur ne bouge pas | 69,6 px / 39 signes **figé** ✔ | 52,4 px **figé** ✔ |
| dégel — rattrapage | ✔ | ✔ |
| **reprise à froid** (F5 en pleine séance) | cran **et** écran retrouvés, même image que la locale ✔ | ✔ |
| **total** | **9 / 9** | **9 / 9** |

### Le téléphone
| geste | mur | téléphone |
|---|---|---|
| cran 5 | 42,8 → **69,6 px** | « 52 pt » · **affichage inchangé** ✔ |
| cran 1 | **32,1 px** · 523 signes | « 24 pt » · **inchangé** ✔ |
| cran 4 | **58,9 px** | « 44 pt » · **inchangé** ✔ |

Empreinte du prompteur et des cartes **identique** à chaque geste ; `W.zoom()` jamais appelé ; `W.iz` du téléphone jamais modifié. **3 / 3.**

**Téléphone SEUL, PC fermé** : aucun ratio reçu → le mur se découpe dans **sa boîte réelle** (1360×765), contenu **389 px sur 765 — rien d'amputé**, 16 écrans dans sa trame. ✔ *(Sur la version intermédiaire, ce cas amputait de 57 px : c'est ce banc qui l'a trouvé.)*

### Le cadre de découpe : invisible et hors d'atteinte
Mesuré sur la page en fonctionnement : `opacity: 0` · `pointer-events: none` · `left: -30000px` · `z-index: -1` · `tabindex: -1` · `aria-hidden: true`. Il ne sert qu'à mesurer un débordement ; il n'est jamais montré, jamais cliquable, jamais focusable.

### Le pilotage PC et le tableau local : inchangés
Fenêtre locale, production **et** candidat : **30,2 · 40,3 · 47,9 · 55,4 · 65,5 px** aux cinq crans — identiques. Aucune fonction du pilotage n'est touchée (tailles au §①). Capture côte à côte : `E-local-contre-distant.png` (cran 5 : 65,5 px / 201 signes contre 69,6 px / 201 signes, même texte).

**Une capture écartée, et pourquoi** : le montage à trois surfaces que j'avais produit montrait, côté pilote, la **modale de fin d'heure (T-5)** ouverte par le banc — l'écran de contrôle était masqué. Je l'ai regardée avant de livrer (addendum du 20/08 ⑥) et je l'ai retirée plutôt que de la laisser au sas : une capture qu'on ne peut pas comparer n'est pas une preuve. La comparaison décisive est local contre distant, et elle est lisible.

## ⑤ MATRICE ACTIONS × ÉTAT (`PASSATION §⑦`) — ligne à ligne
| ligne | ce que ce lot y change | état mesuré |
|---|---|---|
| **copier / dupliquer** | rien : aucun chemin de copie n'est touché | inchangé |
| **couper / coller** | rien | inchangé |
| **déplacer** | rien — l'`eid` voyage avec l'objet, et c'est ce qui permet au mur de retrouver le père | inchangé |
| **supprimer** | rien : `purgeMarques` intouchée | inchangé |
| **ajouter** | rien | inchangé |
| **zoom / dézoom** | **la ligne du lot.** Le dévoilement est transmis au morceau et recollé au retour — et le mur le refait pour lui-même, à sa boîte. Au **dézoom**, il recolle (`reabsorbe`) avant de recomposer, comme `zoom()` du moteur. Les fils n'ont jamais d'identité, et **aucun fils ne traverse la scène** : elle porte une position, un dévoilement et un cran. Mesuré : dévoiler 523→311→201, replier 201→39, dézoom sans reste | **étendu au mur** |
| **ouvrir / fermer une fiche** | la fiche suit le morceau choisi (rang local recalculé) | conservé |

## ⑥ CE QUE JE DÉCLARE, ET QUE JE NE TRANCHE PAS
1. **Deux pilotes, deux réglettes.** Le dernier geste gagne : si le PC bouge sa réglette après le téléphone, c'est le cran du PC qui part au mur. Aucune oscillation (chaque appareil adopte au lieu de réimposer), mesuré. Mais **le cas « deux réglettes contradictoires » n'a pas été arbitré** : faut-il que le PC cesse d'imposer le sien quand un téléphone est connecté ? Question ouverte.
2. **La cascade de `degorge` ne vérifie que l'écran courant** (la garde de position du pont le ramène au père à chaque tour). Le mur s'en protège en mesurant sa toile ; **la fenêtre locale Win+K, elle, n'a pas ce filet**. Elle ne rogne pas dans le décor mesuré (607 px sur 720 au cran 5), mais rien ne le garantit sur un écran plus chargé. **Dette à ouvrir, hors périmètre** (le mandat interdit d'y toucher).
3. **Un artefact de banc, déclaré** : la fenêtre tableau locale s'ouvre en 800×600 sous Puppeteer ; je la force à 1280×720 pour la rendre comparable. Chez Paul, c'est le vidéoprojecteur qui décide.

## ⑦ CE QU'AUCUN BANC NE PROUVERA
Le hub réel · le réseau de l'établissement · **le vidéoprojecteur et sa définition** · deux machines physiques · le tactile de la réglette au doigt · **et surtout : si un élève du fond lit vraiment.** Le seul juge est Paul, debout au fond de sa salle.

---
*Livré au sas, non promu. Le point de retour est la production 8.68.0, md5 `868477343d4375d7be4d820ab8eb2630`.*
