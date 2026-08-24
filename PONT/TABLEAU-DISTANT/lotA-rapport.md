# LOT A — LE CHARGEMENT DE TRAME : RÉPARATION
Exécutant · 24/08/2026 · candidat `PONT/TABLEAU-DISTANT/lotA-index.html`. **STOP après livraison.**

## ⓪ BASE ET SCEAU
| | |
|---|---|
| base re-téléchargée de la production | md5 **`69c17e5c806bbfa2dfd6fdfe9eb337c4`**, **1 427 982 o** = attendu (v8.60.0) |
| candidat livré | **1 436 968 o**, md5 **`0857be3e41abc15376b98788bb971716`** |
| double parseur | `node --check` + acorn ES2020 sur les 2 scripts : **verts** |
| moteur `AT_DR_B64` | **identique à l'octet** (empreinte de la chaîne base64 comparée : égale) |
| `secu*` | **29 fonctions, corps identiques à l'octet** |
| `published` | 97 motifs → 97, **aucune écriture nouvelle** |
| fonctions supprimées | **0** |
| zones de diff | **25**, toutes marquées `[LOT A ①]`…`[LOT A ⑦]` |

## ① TAILLES PAR FONCTION — 12 modifiées, 4 neuves, 0 supprimée
| fonction | avant | après | point |
|---|---|---|---|
| `_drNormaliserTrame` | — | **816 o** (neuve) | ① |
| `sesIncident` | — | **697 o** (neuve) | ② |
| `_drEmpreinteTrame` | — | **359 o** (neuve) | ③ |
| `_drLibelles` | — | **464 o** (neuve) | ⑦ |
| `_drVerifier` | 1 130 | 1 168 (+38) | ① |
| `dr_ouvrir` / `dr_chargerTrame` (objet `DR`) | — | +2 lignes | ①③ |
| `atDrJouer` | 981 | **2 069** (+1 088) | ④ |
| `atEditerChapitreRendre` | 13 452 | 14 056 (+604) | ⑤ |
| `addChapter` | 850 | 1 595 (+745) | ⑥ |
| `_drPoserContexteMoteur` | 1 111 | 1 228 (+117) | ⑦ |
| `sesBrancherPilote` · `sesBrancherPiloteTel` | 1 501 · 981 | 1 763 · 1 185 | ② |
| `sesTelGeste` | 633 | 782 (+149) | ② |
| `sesPollPilote` · `sesTabMonter` · `sesTabPoll` · `sesTelChercherCours` | 1 012 · 1 046 · 1 380 · 1 691 | +38 chacune | ① |
Toutes **agrandies**, aucune réduite.

## ② LES SEPT POINTS — checklist à preuves

### ① NORMALISER TOUTE TRAME À L'ENTRÉE — **fait, six portes**
`_drNormaliserTrame(ecrans)` : `etapes||[]`, `pic||''`, `reps||[]` (et `i`/`r` en chaînes), `vues|0`, `src||ref||''`. Elle n'écrit jamais au hub.
Appelée aux **six** points d'entrée, celui qui manquait aux rapports antérieurs compris : **L14876** (repli du boot), **L15020** (`dr_chargerTrame`), **L16023** (scène pilote), **L16176** (vue tableau), **L16214** (rechargement de trame de la vue — *la sixième*), **L16292** (téléphone).
**Banc du moteur, sur la trame RÉELLE de Paul** (`GET /site/3e/chapitres/0/seances/0/deroule/ecrans` — 15 écrans, 2 consignes sans `etapes`, 4 sans `pic`, 5 images sans `src`) :
| mesure | avant | après |
|---|---|---|
| exception au chargement | **`TypeError: Cannot read properties of undefined (reading 'length')`** | **aucune** |
| écrans en mémoire / badge | 15 · « écran 1 / 15 » | 15 · « écran 1 / 15 » |
| **vignettes rendues** | **1** (fantôme du rendu précédent) | **15**, vrais titres (« 10:07 · Titre et objectif de la séance », « 10:09 · Heure 1 · Analyse d'images : la routine », …) |
| lignes « où on en est » | 1 | **15** |
| lignes « temps par activité » | 1 | **15** |
| champs manquants après entrée | 2 `etapes`, 4 `pic`, 5 `src` | **0 · 0 · 0** |
**`envoie()` atteint — preuve directe** (enveloppes comptant les appels réels, trois dévoilements) :
| | avant | après |
|---|---|---|
| appels `envoie()` | **0** | **3** |
| appels `majVues()` | 0 | 3 |
| appels `peintQui()` | 0 | 3 |
Captures : `lotA-moteur-avant.png` / `lotA-moteur-apres.png`, `lotA-vignettes-avant.png` / `lotA-vignettes-apres.png` — la première **reproduit exactement l'écran de Paul** (une vignette « 10:07 · NOUVELLE ACTIVITÉ » devant une colonne de 15 écrans).

### ② LA CEINTURE — **fait**
`sesIncident(ou, err)` : `console.warn` + bandeau discret `#ses-incident` (6 s). **Jamais affiché dans la vue tableau** (`SES.mode==='tableau'` → retour immédiat) : rien ne peut être projeté. Le message décrit le flux — « Ce geste n'a pas pu aboutir (‹ dévoiler ›). L'écran suivant peut ne pas suivre — le détail est dans la console. » — et ne met jamais le professeur en cause.
Posée sur : les six crochets du pilote et du téléphone (`rendre`, `envoie`, `quiParle`) et sur `sesTelGeste` (le `catch` muet devient `catch(e){ sesIncident(g,e); }`), plus `sesTelPeindre`. **L'émission de scène part désormais même si le rendu a bronché** — le tableau ne reste plus muet sans que personne le sache.

### ③ LE JETON PORTE LE CONTENU — **fait**
`_drEmpreinteTrame(ecrans)` = `<nb écrans>-<hash36 des act|h|nb blocs>`. Ajoutée en 6ᵉ segment du jeton de `dr_ouvrir`. La mémoire de position se compare au **lieu seul** (5 premiers segments) : une édition ne renvoie plus Paul à l'écran 1.

### ④ LA COPIE JOUÉE REPART DE LA PRÉPARATION — **fait**
`atDrJouer` : la copie existante n'est plus rejouée telle quelle. Écritures **ciblées** — `…/deroule_joue/<classe>/ecrans.json`, `…/demarreLe.json`, `…/classe.json`. **`part`, `scene` et `vecu` ne sont jamais touchés** (branches sœurs, aucun PUT sur le nœud parent quand la copie existe). Pas de modale, pas de choix en début d'heure (décision de Paul du 24/08).

### ⑤ LA POSITION DE LA COLONNE — **fait**, patron 8.59.2 repris
Mémorisation avant le rendu, restitution **après `atVuesMonter()`** (qui reconstruit `#at-arbre`), avec le même `ED2.gel=Date.now()+400` que la pile.
**Banc du site, parcours réel par clics** (Panneau prof → Atelier → Mes chapitres → Modifier → Déroulé, puis `atEditerChapitreRendre()`) :
| | avant | après |
|---|---|---|
| `scrollTop` avant repeint | 900 | 900 |
| `scrollTop` après repeint | **0** | **900** |
| hauteur / contenu | 878 / 2 326→2 434 | 878 / 2 434 |

### ⑥ LA CRÉATION DE CHAPITRE CONFIRME — **fait**, patron des feuilles repris
`addChapter` : `AT_CHAP_ETAT[level]=''` puis `atChargerChapitres` → `renderChapitres` **et** `atRendreListe` (onglet « Mes chapitres »), plus une confirmation `atInfo` nommant le chapitre.
**Banc du site, geste réel** (`addChapter('3e')` → saisie → clic « Valider ») :
| | avant | après |
|---|---|---|
| modale fermée après validation | oui | oui |
| chapitres en données | 1 → 2 | 1 → 2 |
| **cartes affichées** | **1 → 1** (le chapitre n'apparaît pas) | **1 → 2** |
| titre présent dans la liste | **non** | **oui** |
Captures : `lotA-chapitre-avant.png` / `lotA-chapitre-apres.png` (la seconde montre la carte neuve **et** la confirmation).

### ⑦ LES DEUX LIBELLÉS EN DUR — **instruit puis réparé**
**Pourquoi ils ne produisaient pas leur effet** — deux causes, toutes deux au code :
1. `Wm.META.classe` lisait **`AT_DR_COURS.classe`**, champ qui **n'existe pas** : l'objet porte `classeSlug` (et `classeNom`). META.classe restait vide, `#h3part` affichait « Participation · — ».
2. La réécriture n'avait lieu **qu'une fois**, dans `dr_ouvrir` : après tout rechargement du cadre, toute reconstruction ou tout changement de classe, le moteur reprenait les valeurs **en dur de sa maquette** (`<div class="vgt">Écrans · séance 3</div>` et `<h3 id="h3part">Participation · 3e Franklin Aretha</h3>`, posées à son chargement).
**Correctif** : `_drLibelles()` (colonne + participation, source unique) appelée **à chaque pose de contexte** — laquelle suit toutes ces reconstructions — et lecture de `classeSlug` avec repli sur `classeNom`.
**Banc du site, régime classe** :
| | avant | après |
|---|---|---|
| colonne | **« Écrans · séance 3 »** | « Écrans · Poésie et peinture : le Romantisme en question » |
| participation | **« Participation · 3e Franklin Aretha »** | « Participation · 3E Charles de Gaulle » |
| `META.classe` | `''` | « 3E Charles de Gaulle » |
Captures : `lotA-libelles-avant.png` / `lotA-libelles-apres.png`. Point **distinct du ①** : vérifié, la normalisation ne les touche pas.

## ③ HARNAIS EN LECTURE SEULE — le compteur, en toute franchise
Aucune écriture n'a atteint le hub : **toute requête non-GET a été bloquée** (bancs moteur : `0` tentative ; banc du site : **80 tentatives bloquées, listées par chemin**).
Ces 80 sont **40 avant + 40 après, aux chemins rigoureusement identiques** : ce sont des `…/uid.json` du mécanisme `[C5-UID]` du site, déclenchés par la lecture d'un chapitre importé sans `uid` — **aucune ne provient du LOT A** (comparaison chemin à chemin). Constat porté à la conscience : ce chapitre déclenche 40 écritures de rattrapage à chaque ouverture tant que les `uid` ne sont pas posés.
Pour le point ⑥ seulement, les PUT ont été **interceptés et simulés** (réponse 200 fabriquée, **jamais transmise au hub**) : sans cela le callback de création ne s'exécute pas et le point n'est pas mesurable. Déclaré ici, compté (`putSimules`).
`pageerrors` : **0** sur tous les bancs, avant comme après.

## ④ INTOUCHÉS — prouvés, pas déclarés
Aucune identité, aucun rang, aucune indexation touchés (c'est le LOT C) : les 25 zones de diff ne contiennent ni `uid`, ni `ordre`, ni renumérotation. Moteur intouché (empreinte égale). `secu*` : 29/29 identiques. `published` : 97 → 97. Le déroulé local (fenêtre Win+K) : `tableau()`/`envoie()` du moteur inchangés, aucune couture nouvelle sur ce chemin — la normalisation ne fait qu'assainir la trame qui y entre.

## ⑤ CE QUE LE BANC NE PROUVERA PAS
Le tactile Android · le clavier mobile (focus conservé, normalisation HTML au `blur`) · le réseau de l'établissement · le vidéoprojecteur. **Le test de Paul sur ses trois appareils reste le juge** — et il se fera cette fois sur une trame normalisée, ce qui n'était jamais arrivé.

## ⑥ CE QUI RESTE, HORS PÉRIMÈTRE DE CE LOT
A-0 (la classe `.ses-saisie` collante), A-3 (initiale non saisie, insertion au point du tap), A-4 (le chrono, deux gestes en un), A-5 (le stylo sans surface), A-6 (la liste dense), C (la vue qui ne revient pas à l'attente), et le LOT temps réel. Rien de tout cela n'a été touché ici.
