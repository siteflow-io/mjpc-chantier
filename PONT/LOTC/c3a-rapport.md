# LOT C3a — UN SEUL ÉTAT DE VÉRITÉ
Exécutant n°8 · 24/08/2026 · candidat `PONT/LOTC/c3a-index.html`. **STOP après livraison.**
Lus avant de coder, dans l'ordre du mandat : `OU-EST-CE-DEJA-ECRIT.md` · `PASSATION-C6-C7.md` (§⑦, la matrice) · `DEROULE/CADRAGE-TEMPS.md` · `docs/MJPC6-2-DOCTRINE.md` · `PONT/LOTC/c1-rapport.md` et `c2-rapport.md`. **Rien n'a été créé là où quelque chose existait : les cinq correctifs appellent des fonctions déjà écrites (`reabsorbe`, `_drRefusionner`, `sesPut`, `bornes`).**

## ⓪ SCEAU
| | |
|---|---|
| base re-téléchargée | md5 **`a4a985efff9e1f902ea2fabd3bc64fc3`**, **1 474 448 o** = attendu (v8.64.0) |
| candidat | **1 483 376 o**, md5 **`89aec8cbc9a234c5ae9c8725837660b3`** |
| `APP_VERSION` | **8.65.0** · double parseur (`node --check` + acorn ES2020) : **verts** |
| moteur `AT_DR_B64` | **identique à l'octet** (md5 interne `e7ceefa87d9b…`) — pas une ligne touchée |
| `secu*` | **29 → 29, aucune divergente** · `published` : **97 → 97**, jamais écrit |
| fonctions | **9 modifiées, 11 neuves, 0 supprimée** |
| écritures non-GET **sorties vers le hub** | **0** (banc à hub simulé, compteur affiché) · `pageerrors` : **0** |

**Intouchés, corps comparés à l'octet — AUCUN divergent** : tout le T-5 (`atT5Modale`, `atT5Appel`, `atT5Appliquer`, `atT5Etat`, `atT5Veille`, `atT5Choix`, `atT5Reste`) · `copierED` · `atDrReprendre` (reprise dans la préparation) · `_drCopieAuto` (copie au fil de l'eau) · `_drTraceAuto` et `_drPaquetHeure`, `_drTraceReprendre`, `_drBaseHeure` (trace de C1) · `_drIdentifierEcrans`, `_drEidDuRang`, `_drRangPere`, `_drRangDeLEid`, `_drRefusionner` (identité de C2) · `atVecuDemarrer`, `atVecuEntrer`, `atVecuSortir`, `atVecuEcrire`, `atVecuMinutes`, `atVecuAfficher`, `atTempsUtile`, `atDrCloreFin` · `atDrJouer`, `atDrJouerClic`, `sesCoursEcrire`, `sesCoursFermer`, `sesEmettre`, `sesPartEmettre`, `mjpcPutJson`, `_drNormaliserTrame`.

## ① TAILLES — et le seul point qui demande une lecture, pas une confiance
| fonction | avant | après |
|---|---|---|
| `_drCreneauDe` · `_drCleHeureDe` · `_drBaseHeureDe` | — | 271 · 377 · 294 o (neuves) |
| `_drSignatureCours` · `_drCoursActifEffacerSi` · `_drHeureCloseAu` | — | 130 · 355 · 240 o (neuves) |
| `_drTailleCadre` · `_drVuePere` | — | 233 · 806 o (neuves) |
| `sesRepriseRetirer` · `sesReprisePeindre` · `sesRepriseSilence` | — | 116 · 641 · 102 o (neuves) |
| `_drEnvelopper` | 2 662 | **5 260** (+2 598) |
| `sesReprendre` | 569 | **1 315** (+746) |
| `sesAppliquer` · `sesPhoto` · `sesTabPoll` | 714 · 1 882 · 1 575 | 900 · 2 026 · 1 620 |
| `_drCleHeure` · `_drCreneauHeure` · `_drCloreHeureRestee` · `sesReprisePoser` | 847 · 303 · 1 816 · 965 | **503 · 64 · 1 719 · 795** |

**⚠ Quatre fonctions ont RÉTRÉCI — par EXTRACTION, jamais par perte, et cela se prouve.** `_drCleHeure` et `_drCreneauHeure` ne calculent plus : elles délèguent à `_drCleHeureDe`/`_drCreneauDe`, désormais partagées avec le pointeur `cours_actif` (qui en avait une **copie en ligne** dans `_drCloreHeureRestee` — d'où son rétrécissement à elle). C'est le cœur de ① : *deux fabriques de clé, c'était déjà deux vérités sur le même objet.* Mesuré au banc : `_drCleHeure()` rend **`2026-08-24_10h07-11h02_c3a`**, identique à la base, et `memeCleParLesDeuxChemins: true`. `sesReprisePoser` rétrécit parce que la bannière est éclatée en quatre fonctions nommées : l'ensemble (poser + peindre + retirer + silence + reprendre) passe de **1 534 à 2 969 o**.

## ② LES CINQ POINTS — base 8.64.0 contre candidat, mesuré
| mesure | 8.64.0 | candidat |
|---|---|---|
| **①** pointeur `cours_actif` après clôture automatique | **reste posé** | **effacé** |
| **①** reprise d'une heure close | possible | **refusée** |
| **①** clôture volontaire : pointeur / plus rien à reprendre | retiré / rien | retiré / rien |
| **②** bannière après tentative sur une heure close | — | **retirée** + message |
| **②** bannière retirée par la veille seule | (mécanisme absent) | **retirée** |
| **③** fils nés de la réduction de fenêtre | 1 | 1 |
| **③** fils **survivants** après retour en grand | **1** | **0** |
| **④** `vues` émises, pilote sur un fils | `{0:0}` | **`{0:6, 1:0}`** |
| **④** texte réellement projeté au tableau | **172 signes** | **661 signes** |
| **④** identité désignée par les trois appareils | la même | la même |
| **⑤** doublons d'identité après duplication | **1** | **0** |
| **⑤** la copie porte une identité NEUVE | **non** | **oui** |

### ① `cours_actif` cesse d'être une seconde source
La clôture automatique (`_drCloreHeureRestee`, LOT C2) marquait `clos` **sans toucher au pointeur** : mesuré sur la base, `pointeurEfface: false`. Le pointeur retire désormais sa désignation à toute clôture — mais **sous condition** : on relit `cours_actif`, on compare sa **signature** (`_drSignatureCours` : niveau·chapitre·séance·classe·début·fin), et on n'efface **que s'il désigne encore l'heure close**. Si le cours neuf a déjà pris la place, on n'y touche pas. *Aucune course ne peut donc effacer le pointeur du cours en train de tourner* — c'est ce qui rend l'incohérence impossible par construction, et non par un ordre d'appels qu'il faudrait surveiller.
**Preuve, enchaînement de deux classes sans clôture** : trace de la 3e `clos: true`, **pointeur effacé**, pointeur neuf sur `c3b`, puis tentative de reprise de la 3e → `reprisePossible: false`, la classe courante reste `c3b`.

### ② La bannière est un reflet, plus une pose
`sesReprisePoser` posait une fois et n'écoutait plus rien. Elle **vérifie maintenant à chaque passage** (même veille de 5 s, réutilisée) : pas de pointeur, pointeur périmé, ou trace `clos: true` → elle se retire d'elle-même. « Plus tard » la tait **pour ce cours** (par signature) et non pour toujours : un autre cours la ramène. `sesReprendre` revérifie **avant d'agir** — pointeur et trace — et, s'il est trop tard, le dit d'une ligne sans rien bloquer.

### ③ Ce qui a été scindé par la taille est réabsorbé quand la taille revient
La mesure de la conscience est confirmée : la réabsorption n'avait que deux appelants. Le pont lui donne le troisième — un `resize` débouncé (260 ms) plus un `ResizeObserver` sur le cadre — qui appelle **`reabsorbe()` du moteur, telle quelle**, uniquement quand la boîte a **grandi** et qu'il existe des fils. Si la place ne suffit toujours pas, le rendu re-scinde de lui-même : l'état final reste celui que la taille autorise.
**Preuve** : l'écran de test déborde déjà en grand (1 fils légitime, dû au contenu). Réduction à 700×520 → **2 fils**. Retour en grand → base : **2 fils** (celui du geste survit) ; candidat : **1 fils**, exactement l'état d'avant. *Le fils né du redimensionnement est mort ; celui que le contenu impose reste — c'est le comportement voulu, pas un reliquat.*

### ④ Le tableau ne montre jamais plus que ce que le professeur a dévoilé
La mécanique de C2 est juste : le pilote émet bien l'identité du **père**. Ce qui ne l'était pas, c'est le **référentiel du dévoilement** : `rev` et `vues` étaient ceux du **fils**, appliqués au père entier. La photo transporte désormais le dévoilement **cumulé, exprimé dans le référentiel du père** : on **refusionne le groupe jusqu'au morceau courant** avec `_drRefusionner` — la fonction qui fait déjà exactement ce recollement (étapes concaténées, réponse coupée recollée, fiches réunies, `vues` additionnées). Les morceaux **suivants** sont exclus du calcul : *ce qui n'a pas été montré ne peut pas être compté.* La fiche se pose en outre sur le rang **local** du récepteur, et non sur celui de l'émetteur (les deux appareils n'ont pas le même nombre d'écrans quand le pilote est scindé).
**Preuve, trois pages** (pilote scindé + `?vue=tableau` + `?vue=tel`) : pilote sur le fils, `morceau: 1`, identité émise = celle du père sur les trois. Le tableau projette **172 signes** sur la base — la consigne **amputée des six étapes que Paul avait dévoilées** — contre **661 signes** sur le candidat : la consigne et ses six étapes, **et pas la question**, qui n'a pas été montrée. Capture : `tests/c3a-candidat-tableau.png`.
**Écart à déclarer, il compte** : mon banc n'a **pas** reproduit le symptôme dans le sens où Paul le décrit (« le tableau dévoile en avance »). Ce que j'ai mesuré est l'écart de référentiel du **même** mécanisme, et il joue dans l'autre sens : la base projette **moins** que ce que Paul a montré. Le correctif rend le dévoilement **exact** dans les deux sens ; que le symptôme de Paul soit bien celui-là reste à confirmer par son test.

### ⑤ Un écran dupliqué naît avec son identité
L'identité est posée **au geste**, à la naissance — pas plus tard par détection de collision (arbitrage de la conscience respecté). Le pont enveloppe `ctxDup` et interroge **`bornes()` du moteur avant l'appel** : les bornes disent exactement où les copies vont naître, donc rien n'est deviné et aucun « second » arbitraire n'est désigné. L'original garde la sienne ; un fils du zoom n'en reçoit jamais.
**Preuve par l'ÉTAT** : base **1 doublon**, candidat **0** ; `copiePorteUneIdentiteNEUVE: true`, `originalGardeLaSienne: true`.

## ③ MATRICE ACTIONS × ÉTAT — prouvée par l'état, pour ce que ce lot touche
| ligne | état mesuré |
|---|---|
| **copier / dupliquer** | identifiant **NEUF** (0 doublon) · dévoilement **à zéro** (`rev:0`, toutes `vues` à 0) · **fragment effacé** · ids de blocs distincts de l'original |
| **couper / coller** | au niveau bloc, `neuf_` donne déjà un id neuf et remet à zéro — **inchangé, non touché** |
| **déplacer** | tout conservé : aucun chemin de ce lot ne touche à un déplacement |
| **supprimer** | marques purgées : `purgeMarques` **intouchée** |
| **ajouter** | neuf à zéro : `ctxVide`/`nouvelEcran` **intouchées**, l'identité vient du point de passage de C2 |
| **zoom / dézoom** | dévoilement transmis au morceau et **recollé au retour** — et c'est désormais aussi ce que voit le tableau (④) ; les fils n'ont **aucune** identité (`delete` maintenu dans l'enveloppe de duplication) |
| **fiche** | dévoilement interne conservé ; la fiche se pose sur le rang **local** du récepteur |

## ④ CE QUI RESTE À TRANCHER — réserve nommée, non maquillée
**Une trace close reste cumulable si Paul relance la MÊME classe sur le MÊME créneau, le même jour.** `_drTraceReprendre` (corps intouché) reprendrait alors ses minutes et ses décisions du T-5. Les chemins de **reprise de session** sont tous fermés (bannière, pointeur, garde de `sesReprendre`), mais ce chemin-là ne l'est pas. Deux voies, **aucune codée** : (a) refuser la reprise d'une trace `clos:true` — simple, mais la trace neuve écraserait alors la close sous la même clé, et l'heure jouée serait perdue ; (b) archiver la trace close avant de repartir — sans perte, mais c'est une politique de données que Paul n'a pas arrêtée. **Je ne tranche pas seul.** Dans l'intervalle l'effet est borné : il faut clore puis relancer la même classe dans le même créneau.

## ⑤ LE BANC
`tests/banc_c3a.js` · hub **simulé en mémoire** : les GET sont servis, les écritures rangées localement, **comptées et JAMAIS transmises** (garde `__hubPose` contre le double enveloppement, comme le mandat l'annonçait). **Écritures non-GET sorties : 0**, sur les cinq pages du banc. `pageerrors` : **0**, base comme candidat.
Le cadre du déroulé est monté par les **portes du site** (`_drAssurerCadre` + `_drNormaliserTrame`) puis rendu visible et dimensionné : sans hauteur réelle, le moteur ne peut pas mesurer un débordement, donc jamais scinder — c'est le piège qui m'a coûté deux passes. Je n'ai **pas** emprunté la chaîne de clics du mandat (Panneau prof → Atelier → Mes chapitres → Modifier → Déroulé) : je le déclare, c'est un écart.

## ⑥ CE QUE LE BANC NE PROUVE PAS
Le hub réel (latence, règles, coupure en cours d'écriture) · le tactile Android et le clavier mobile · le réseau de l'établissement · le vidéoprojecteur · une vraie heure de 55 minutes · l'enchaînement réel à deux minutes, chronomètre en main · le redimensionnement à la souris (le banc change le viewport d'un coup, Paul tire une bordure par paliers) · et le fait que le symptôme de ④ soit bien celui que Paul a vu. **Le test de Paul sur ses trois appareils reste le juge.**

## ⑦ LES TESTS MANUELS POUR PAUL
1. **Enchaîner deux classes sans clore** : lancer la 3e Franklin, jouer deux activités, puis lancer la 4e Hugo sans clore. Vérifier le message de clôture, **puis** qu'aucune bannière ne propose plus la 3e — et que si elle était affichée, elle disparaît d'elle-même en moins de cinq secondes.
2. **Fermer la page en pleine heure**, rouvrir le site : la bannière propose bien la classe en cours. Cliquer « Reprendre le cours » → on retombe sur la bonne séance.
3. **Clore volontairement**, puis rouvrir le site : **aucune** bannière. Si elle apparaissait, cliquer dessus doit donner « Cette heure a été close ».
4. **Réduire la fenêtre de pilotage** en écran partagé sur une diapositive chargée : un écran de suite apparaît. **Remettre en grand** : il doit disparaître. Si la diapositive débordait déjà en grand, une suite légitime reste — c'est normal.
5. **Trois appareils, le point le plus important** : pilote + tableau projeté + téléphone. Zoomer jusqu'à ce qu'une suite naisse, se placer **sur la suite**, et regarder le mur : le tableau doit montrer **exactement** ce qui a été dévoilé — ni moins, ni la suite du texte.
6. **Dupliquer un écran** (clic droit sur une vignette → Dupliquer), modifier la copie, puis clore : le message de fin d'heure ne doit annoncer que **les vraies** modifications.
7. **Ouvrir une fiche** pendant que le pilote est sur une suite : elle doit s'afficher au tableau, la bonne.

---
*Livré au sas, non promu. Le point de retour est la production 8.64.0, md5 `a4a985efff9e1f902ea2fabd3bc64fc3`.*

MEMO
