# LOT E — LE ZOOM TRAVERSE JUSQU'AU MUR
Exécutant MJPC · 25/08/2026 · candidat `PONT/TABLEAU-DISTANT/lotE/index.html`. **STOP après livraison. Je ne promeus pas.**
Phase 0 rapportée séparément ; arbitrage reçu (voie iii) ; ce rapport est la phase 1.

## CE QUE ÇA CHANGE POUR LA CLASSE
L'élève du fond lit le mur au cran que le professeur choisit, et il voit **tout** ce que le professeur voit sur son écran de contrôle — jamais une étape coupée en deux, jamais une étape perdue. Quand le professeur pilote au téléphone depuis le fond de la salle, sa réglette est **une télécommande du mur** : elle grossit le tableau et ne touche pas son propre écran.

## ⓪ SCEAU
| | |
|---|---|
| base retéléchargée | md5 **`868477343d4375d7be4d820ab8eb2630`**, **1 491 450 octets** = attendu (v8.68.0) |
| candidat | **1 506 500 octets**, md5 **`2a87b636fb8c1297a09b13e9d4fe4e17`** *(chiffre corrigé au COMPLÉMENT ⓪ : la première livraison annonçait une taille en unités UTF-16, pas en octets)* |
| `APP_VERSION` | **8.69.0** |
| double parseur | `node --check` + acorn ES2020, 2 blocs `<script>` (1 328 579 signes) : **VERTS** |
| moteur `AT_DR_B64` | **identique à l'octet** — md5 interne `2ba70f9ef8aa…` · `AT_DR_SHA256` inchangé |
| `secu*` | **29 → 29, corps tous identiques** |
| `published` | **97 → 97**, jamais écrit |
| fonctions | **4 modifiées · 6 neuves · 0 supprimée · 0 renommée · 0 rétrécie** *(tailles refaites en octets au COMPLÉMENT)* |
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

---

# COMPLÉMENT DU 25/08 — LES TROIS POINTS FERMÉS
*Demandé par la conscience n°10 sur décision de Paul : « je ne promeus pas avec une dette. »*

## ⓪ SCEAU CORRIGÉ — et d'où venait le chiffre faux
| | commande | sortie |
|---|---|---|
| taille du candidat | `wc -c candE.html` | **1 506 500 octets** |
| — vérifiée deux fois | `stat -c '%s' candE.html` | **1 506 500** |
| md5 | `md5sum candE.html` | **`2a87b636fb8c1297a09b13e9d4fe4e17`** |
| base 8.68.0 | `wc -c` | **1 491 450 octets**, md5 `868477343d4375d7be4d820ab8eb2630` |
| écart | | **+15 050 octets** |
| `APP_VERSION` | | **8.69.0** |
| double parseur | `node --check` + acorn ES2020 | **VERT** (2 blocs, 1 332 062 signes) |
| moteur `AT_DR_B64` | | **identique à l'octet**, md5 interne `2ba70f9ef8aa…` · `AT_DR_SHA256` inchangé |
| `secu*` | | **29 → 29, corps identiques** |
| `published` | | **97 → 97** |
| fonctions | | **4 modifiées · 6 neuves · 0 supprimée · 0 renommée** |

**D'où venait l'erreur, exactement.** Mon outil `tests/invariants.mjs` lisait le fichier en `utf8` et affichait `String.length` — c'est-à-dire des **unités UTF-16**, pas des octets. Chaque caractère accentué compte **1 unité** en UTF-16 et **2 octets** en UTF-8. Mesuré :

```
String.length (unités UTF-16) : 1481565
Buffer.length (OCTETS)        : 1502894
écart                         : 21329
```

21 329 octets d'écart = tous les accents du fichier. **L'outil est corrigé** : il lit désormais `fs.statSync().size`, affiche les octets, et rappelle explicitement l'autre chiffre pour qu'on ne les confonde plus. **Portée de l'erreur** : elle touche toutes les tailles de fichier et de fonction que j'ai annoncées depuis le LOT D (les md5, eux, ont toujours été justes — ils portent sur les octets). Le tableau des tailles de fonctions ci-dessus est refait en octets UTF-8.

## ① DEUX RÉGLETTES — LE DERNIER GESTE GAGNE
**Codé** dans `sesAppliquer` (905 → 2 361 o), avec la règle écrite en tête : *toute surface adopte le cran reçu et le montre sur sa réglette, personne ne réimpose le sien.* Le **PC applique** le cran adopté à son propre rendu, par sa réglette, comme si la main l'avait poussée — son écran de contrôle ne ment jamais sur ce que voit la classe. Le **téléphone** ne bouge que son étiquette : son prompteur n'est pas un tableau.

**Banc à trois pages** (`tests/bancE-reglettes.mjs`) : pilote PC + téléphone + mur.

| geste | mur | réglette PC | réglette téléphone | 10 cycles de sondage |
|---|---|---|---|---|
| **PC pose 5** | iz=4 · **69,6 px** ✔ | cran 5 « 52 pt » | cran 5 « 52 pt » | `[4,4,4,4,4,4,4,4,4,4]` **aucune oscillation** |
| **TÉL pose 2** | iz=1 · **42,8 px** ✔ | cran 2 « 32 pt » | cran 2 « 32 pt » | `[1,1,1,1,1,1,1,1,1,1]` **aucune oscillation** |
| **PC pose 4** | iz=3 · **58,9 px** ✔ | cran 4 « 44 pt » | cran 4 « 44 pt » | `[3,3,3,3,3,3,3,3,3,3]` **aucune oscillation** |

**Suite au mur : 5 → 2 → 4** — exactement l'attendu. **Les deux réglettes affichent le cran courant après chaque adoption.** Le moteur du téléphone : `iz=1` au départ, `iz=1` à la fin — **son affichage n'a jamais bougé**. **3 épreuves sur 3, 30 cycles de sondage sans une oscillation.**

## ② LE FILET DE LA FENÊTRE LOCALE WIN+K — posé, mesuré, et une limite nommée
**Codé depuis le pont** (enveloppe de `W.envoie`, moteur intact, vue distante exclue puisqu'elle a déjà le sien). Deux parades :
- **le format** : le gabarit `.e` a une hauteur ET une largeur imposées ; sur une fenêtre qui n'est pas en 16/9 il se **déforme**, le texte se recompose sur moins de largeur et déborde. On le **contient** au format de l'écran de contrôle — des bandes, comme un diaporama.
- **la mesure** : ce qui est **peint** dans la fenêtre est mesuré (pas ce que compose le cadre, qui rend l'écran entier, grisé compris) ; si ça ne tient pas, la découpe descend d'un morceau, et la garde de position remet le professeur où il était.

### Preuve n°1 — la non-régression, exigée : rien ne change en 16/9
| | fenêtre 1280×720, décor actuel |
|---|---|
| **avant** (8.68.0) | 30,2 · 40,3 · 47,9 · 55,4 · 65,5 px · 0 cran rogné |
| **après** (candidat) | **30,2 · 40,3 · 47,9 · 55,4 · 65,5 px** · 0 cran rogné |

**Identiques au dixième de pixel.** Le pilotage PC n'est touché par aucune fonction (tailles au tableau ci-dessus : toutes intouchées).

### Preuve n°2 — la fenêtre déformée revient à la loi
| forme de fenêtre | avant (8.68.0) | après (candidat) |
|---|---|---|
| 16/10 (1280×800) | boîte 1280×800 · **33,6 · 44,8 · 53,2 · 61,6 · 72,8 px** | boîte **1280×720** · **30,2 · 40,3 · 47,9 · 55,4 · 65,5 px** |
| 4/3 (1024×768) | boîte 1024×768 · 32,3 · 43,0 · 51,1 · 59,1 · 69,9 px | boîte **1024×576** · 24,2 · 32,3 · 38,3 · 44,4 · **52,4 px** |
| 4/3 (800×600) | boîte 800×600 · 25,2 · 33,6 · 39,9 · 46,2 · 54,6 px | boîte **800×450** · 18,9 · 25,2 · 29,9 · 34,6 · **41,0 px** |

**Après, la fenêtre locale suit exactement la même loi que le mur distant et que l'écran de contrôle, quelle que soit sa forme** — bandes au lieu de déformation. C'était ça, la vraie dette : pas « elle rogne parfois », mais « elle ne montre pas la même chose que le mur quand elle n'est pas en 16/9 ».

### Preuve n°3 — ce que le filet ne peut PAS fermer, et pourquoi ce n'est pas une dette du lot
Le décor exigé (**consigne + 10 étapes longues**) ne rogne **ni avant ni après**, sur aucune des quatre formes de fenêtre : le pilote scinde jusqu'à 18 écrans, chaque morceau est court. Je ne peux donc pas fournir le « avant : N px » demandé sur ce décor — **il vaut 0**.

Pour trouver un rognage, j'ai construit un décor que le moteur **ne sait pas couper** : une consigne courte et **une seule étape de 450 signes**. `scinde()` répartit les étapes en deux moitiés — avec une seule, il n'a rien à répartir.

| décor insécable, fenêtre 1024×768 | cran 4 | cran 5 |
|---|---|---|
| avant (8.68.0) | rogné de **242 px** | rogné de **558 px** |
| après (candidat) | rogné de **134 px** | rogné de **284 px** |

Le filet **divise le rognage par deux** mais ne le supprime pas. **Et ce n'est pas une dette de Win+K** : sur le même décor au cran 5, **le pilote rogne son PROPRE écran de contrôle de 115 px** (contenu 428 px, boîte 313 px), tandis que le mur distant, lui, tient (469 px sur 765).

**Constat, pas dette du lot** : un bloc que `scinde()` ne sait pas couper déborde de toute surface trop petite pour lui — le pilote le premier. C'est une limite du **moteur** (`AT_DR_B64`, que ce mandat interdit de toucher), elle préexiste à ce lot, elle n'est pas créée par lui, et elle se voit d'abord sur l'écran du professeur. **À porter au registre comme une dette du moteur, distincte, si la conscience le juge utile.** En usage réel elle demande une étape de plus de 450 signes d'un seul tenant.

## ③ LES BANCS REJOUÉS SUR LE CANDIDAT COMPLÉTÉ
| banc | résultat |
|---|---|
| preuve mur **16/9** (5 crans, replier, gel, dégel, reprise à froid) | **9 / 9** |
| preuve mur **4/3** | **9 / 9** |
| **téléphone** (3 gestes + téléphone seul PC fermé) | **4 / 4** · rien d'amputé (549 px / 765) |
| **deux réglettes** (3 pages) | **3 / 3** · 30 cycles sans oscillation |
| **total** | **25 épreuves, 0 échec** · **0 écriture sortie** · **0 `pageerror`** |

## ④ MATRICE ACTIONS × ÉTAT — ce que le complément y change
| ligne | effet du complément |
|---|---|
| copier / dupliquer · couper / coller · déplacer · supprimer · ajouter | **aucun** : aucun chemin de ces gestes n'est touché |
| **zoom / dézoom** | le cran devient un état **de session** et non d'appareil : toute surface l'adopte et le montre. Le dévoilement reste transmis au morceau et recollé au retour. La fenêtre locale suit désormais la même loi de police que le mur, quelle que soit sa forme. Aucun fils ne traverse la scène |
| ouvrir / fermer une fiche | **aucun** |
