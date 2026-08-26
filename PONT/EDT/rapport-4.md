# LOT 2bis — LIVRAISON ④ · LA MODALE, LES DÉCISIONS HORAIRES, ET LA PORTE DU PILOTAGE

*Candidat `8.71.0` au sas, 1 594 947 o. Aucune promotion. Faux hub, zéro sortie réseau.*

---

## ① LA MODALE D'UNE CASE

Un clic sur une case l'ouvre. **Sans voile** : la grille reste lisible derrière et **se recalcule à chaque choix**. Déplaçable par sa poignée (pointer events), **contenue dans la zone** et pouvant descendre aux deux tiers. Fermable par la croix ou par Échap — Échap ferme d'abord la modale, puis l'écran.

Selon la case, elle montre : la séance prévue avec son titre et « heure n sur m » · une heure jouée avec ses activités et ses reportées · une heure qui ne compte plus, avec sa catégorie et sa précision · une classe pas encore importée · un groupe partagé · un jour sans cours.

## ② LES DÉCISIONS — mesurées

**« Ne plus compter cette séance dans la prévision horaire »** — jamais le mot « annuler ». Les **dix catégories** sont dans une liste déroulante, **libellés entiers, aucune complétion par début de mot** : Événement d'établissement · Évaluation hors séance · Sortie, voyage, projet · Orientation et vie de classe · Gestion de classe · Absence du professeur · Absence massive d'élèves · Reprise ou rattrapage · Temps libre choisi · Autre. Plus un champ de précision libre, **enregistré**.

Mesuré, mardi 8 septembre 15:07, catégorie « Gestion de classe », précision « retour sur le conseil de classe » :

| Avant | Après |
|---|---|
| mar 8/9 15:07 → prévu, L'Albatros heure 1/3 | mar 8/9 15:07 → **sansSeance** |
| mer 9/9 10:07 → heure 2/3 | mer 9/9 10:07 → **heure 1/3** |
| jeu 10/9 16:04 → heure 3/3 | jeu 10/9 16:04 → **heure 2/3** |
| ven 11/9 10:07 → séance suivante | ven 11/9 10:07 → **heure 3/3** |

**La grille glisse en temps réel.** Au hub : `{"sansSeance":true,"categorie":"Gestion de classe","precision":"retour sur le conseil de classe","pose":…}`.

**↶ Annuler** — la case redevient « prévu, L'Albatros, heure 1/3 », la décision est retirée du hub (`decisionRestante: false`), et le journal garde les deux gestes : `["ne plus compter cette séance dans la prévision horaire", "retour arrière"]`.

**Déplacer cette heure vers un autre créneau** — la liste propose les prochains créneaux **de cette classe** (`mer 9/9 · 10:07-11:02`, `jeu 10/9 · 16:04-16:59`, `ven 11/9 · 10:07-11:02`). Après le geste, deux décisions au hub : le départ vidé avec son motif, l'arrivée **épinglée** et sachant d'où elle vient. ↶ Annuler défait les deux côtés.

**Le déplacement de la modale**, mesuré : posée en (493, 90), tirée en (753, 480), poussée à 9999 → elle s'arrête à (982, 553), c'est-à-dire la limite de la fenêtre et **72 % de la hauteur** — elle descend aux deux tiers et ne sort jamais.

## ③ LA PORTE DU PILOTAGE — les six champs sont identiques

Le §⑨ exige que l'état du site après « ▶ Ouvrir le pilotage et lancer » soit celui du bouton d'aujourd'hui. Le banc joue les deux chemins sur deux pages, et compare.

| Champ | Par l'EDT | Par le chemin d'aujourd'hui |
|---|---|---|
| chapitre | `3e/0` | `3e/0` |
| séance | `1` | `1` |
| vue | `deroule` | `deroule` |
| régime | `classe` | `classe` |
| cours | `3E Charles de Gaulle 10:07-11:02` | `3E Charles de Gaulle 10:07-11:02` |
| copie jouée au hub | `3E Charles de Gaulle` | `3E Charles de Gaulle` |

**Les six champs sont identiques.** L'EDT n'a pas touché au moteur : il amène le site dans l'état où le bouton existe, et appuie dessus.

**Deux défauts trouvés en le prouvant, tous deux corrigés :**

1. **Un délai fixe ne suffit pas.** Le premier jet attendait 700 ms avant de lancer : le bandeau était là, le moteur non, le régime restait « prep » et rien ne partait. Remplacé par une **sonde bornée** (150 ms, 30 essais) qui attend les cinq éléments **et** le moteur, puis dit « Pilotage indisponible — ouvre l'atelier » si l'un manque encore. Un délai fixe marche au banc et rate en classe sur une machine lente ; ce n'est pas une preuve, c'est une chance.
2. **Le menu des classes du déroulé sortait vide** (`optionsClasse: []`) : le bandeau lit `classesData`, que le site n'avait pas chargé. `edtLancer` appelle désormais `loadClasses` puis `atChargerChapitres` avant d'ouvrir le chapitre — le chemin du téléphone pilote, repris à l'identique. C'est le même défaut de fond que celui trouvé en ③b : **l'EDT ne doit jamais supposer qu'un autre bout du site a déjà chargé ce dont il a besoin.**

**Quand aucune séance n'est prête** : un message de demande — « Aucune séance prête pour la 3E Charles de Gaulle — ouvrir l'atelier pour en préparer une ? », avec « Rester ici » et « Ouvrir Mes chapitres ». Jamais un saut sans prévenir.

## ④ LE CONTRAT S'ÉLARGIT, NOMMÉMENT

La garde a refusé deux appels que j'avais ajoutés sans les déclarer : `atModaleChoix` (le message de demande) et `atelierOuvrir` (l'ouverture de l'atelier, déjà prévue au §③ du mandat). Ils entrent au contrat, écrits dans `verif_edt.py` avec leur raison. C'est le comportement voulu : **on n'élargit pas le contrat en silence.**

Contrat complet aujourd'hui : `secuLire` · `_siteGet` · `mjpcPutJson` · `escapeHtml` · `atInfo` · `atModaleChoix` · `showProfSection` · `openProfPanel` · `atelierOuvrir` · `isPubFor` · `loadClasses` · `atChargerChapitres` · `atEditerChapitre` · `atVuesAller` · `atDrMonter` · `atDrJouerClic`.

## ⑤ INVARIANTS

| | |
|---|---|
| Candidat | 8.71.0, 1 594 947 o |
| Double parseur | vert |
| Garde `verif_edt.py` | **VERT**, rouge sur les trois contrôles négatifs |
| Moteur `AT_DR_B64` | intact, md5 inchangé |
| `published` | 97 → 97 |
| Appels `edt*` hors du bloc | `edtSectionPanneau` seul |
| Écritures hors `/site/edt/` | `brevetDates` seule |

Captures : `4-1-modale-ouverte` · `4-2-modale-deplacee` · `4-3-sans-seance-et-glissement` · `4-4-heure-deplacee` · `4-5-pilotage-lance-depuis-edt` · `4-6-pilotage-chemin-du-site`.

## ⑥ CE QUI VIENT

**⑤** mois, année, divergence par paliers, écarts justifiés, classe expérimentale, absence des élèves dans la trace de l'heure.
**⑥** les portes ① (arrivée du professeur) et ③ (bandeau du déroulé), le réglage « arriver sur l'emploi du temps », les bancs complets, la séquence de test, le rapport final.

« La dernière fois » (le lien vers la relecture) reste au lot 7, comme le mandat le dit.

*Mot à attendre : **continuer**.*
