# LOT 2bis — LIVRAISON ③b · LE PRÉVU CALCULÉ ET LA SEMAINE SANS SCROLL

*Candidat `8.71.0` au sas, 1 578 496 o. Aucune promotion. Faux hub, zéro sortie réseau.*

---

## ① CE QUI EST À L'ÉCRAN

L'écran de la semaine s'ouvre par-dessus l'accueil, en plein écran, avec « ✕ Fermer l'emploi du temps » qui rend l'accueil intact. En-tête : le jour, le créneau de maintenant, la classe qui s'y trouve, l'heure. La case de maintenant est cerclée d'ambre. Sous l'en-tête, le bandeau des temps de l'année : la période en vigueur, puis ce qui tombe cette semaine (vacances, fériés, jalons, événements de classe, événements qui prennent un créneau). Huit créneaux × cinq jours. En bas, une carte par classe : barre de progression du chapitre, chapitre en cours, séances faites sur total, et la ligne du fil langue quand il existe.

**Cinq natures de case**, chacune sa couleur :
prévu (liseré gris, titre de séance, « heure n/m ») · **jouée** (liseré vert, « n activités · m reportées ») · sans séance (liseré ambre, catégorie et précision — l'UI de décision vient en ④) · hors MJPC (« X Français », grisé, jamais compté) · classe non encore importée (liseré rouge). 📌 marque une heure épinglée. Le fil langue porte un liseré violet et le mot « fil langue ».

## ② LE PRÉVU — mesuré sur la semaine du 7 septembre 2026 (semaine B)

Faux hub : chapitre 3e publié à la 3E Charles de Gaulle, une heure déjà jouée le lundi 7 septembre 08:57, grille appariée sur « 3 FRANKLIN Aretha ».

| Quand | Ce que le prévu pose |
|---|---|
| lun 7/9 08:57 | **jouée** — 3 activités, 1 reportée *(le réel colore la case)* |
| mar 8/9 15:07 | « Étude de texte accompagnée : L'Albatros » — **heure 1/3** |
| mer 9/9 10:07 | même séance — **heure 2/3** |
| jeu 10/9 16:04 | même séance — **heure 3/3** |
| ven 11/9 10:07 | séance suivante — heure 1/3 |
| lun 7/9 10:07 | X Français — 4 TURING → hors MJPC |
| partout ailleurs | 4 HUGO, 4 TURING, 3 DYLAN Bob → « classe non encore importée » |

Tout y est : la séance 1 est jouée donc sautée · une séance de 110 minutes prend **trois heures** (110 ÷ 50, arrondi au supérieur) et reste la même séance sur trois cases successives · le mercredi 10:07 est en semaine **B**, donc chapitre principal et non fil langue · les groupes partagés s'affichent et ne comptent jamais · les classes sans appariement s'affichent sans rien projeter.

Carte de classe : `3E Charles de Gaulle · Poésie et peinture au XIXe siè · 1/9`.

## ③ SANS SCROLL — le critère, et comment il est mesuré

| | 1366×768 | 1920×1080 |
|---|---|---|
| hauteur de l'écran / fenêtre | 768 / 768 | 1080 / 1080 |
| `document.scrollHeight` | **768** | **1080** |
| `scrollY` après une tentative de défilement à 4000 px | **0** | **0** |
| cases dont le contenu déborde | **0** | **0** |
| zones internes qui défilent | **0** | **0** |

Le premier jet passait au vert sur l'écran lui-même mais **le document défilait encore de 684 px** : l'accueil vivait derrière. Une classe `.edt-fige` pose `overflow:hidden` sur `html` et `body` à l'ouverture, et la retire à la fermeture — l'accueil reste intact dessous, il ne bouge plus. Je ne me suis pas contenté de la formule : le banc **essaie** de faire défiler et vérifie que rien ne bouge.

## ④ « SORTIR LE JSON ACTUEL »

Un bouton par objet présent au hub, en haut de la section Emploi du temps. Il copie l'objet tel qu'il est, `atInfo` dit combien de caractères. Repli sur `textarea` + `execCommand` quand le presse-papiers n'est pas disponible (page ouverte en `file://`).
**Mesuré** : `{"longueur": 7770, "premiereCle": "annee"}`.

## ⑤ DEUX DÉFAUTS TROUVÉS AU BANC, ET CORRIGÉS

1. **L'EDT dépendait d'un chargement fait ailleurs.** `edtNiveauDe` lisait `classesData`, la variable du site — vide au moment où l'EDT s'ouvre (mesuré : `classesData: []`). Résultat : aucun niveau trouvé, aucun chapitre chargé, « aucune séance prête » partout alors que le chapitre était publié. L'EDT lit désormais `/classes` lui-même (`edtChargerClasses`) et ne dépend plus de personne.
2. **Le réel dépendait du prévu.** Une heure jouée n'était cherchée que dans les séances encore en attente : une fois le chapitre terminé ou dépublié, l'historique de la classe aurait disparu de la grille. `edtChercherTrace` balaie désormais **tous** les chapitres du niveau. Le réel ne dépend jamais de ce qui reste à faire.

*Et un défaut de méthode, à consigner :* un `replace` d'insertion du CSS avait échoué en silence — la feuille de style de l'écran n'était jamais posée, `position:fixed` ne s'appliquait pas, et l'écran mesurait 684 px de haut quelle que soit la fenêtre. Chaque insertion est maintenant suivie d'une vérification de présence. Un remplacement muet qui échoue est une panne invisible.

*Un faux positif de la garde, corrigé :* `classList.add(` était compté comme un appel à une éventuelle `function add(` du site. La garde ignore désormais tout appel précédé d'un point — une méthode n'est pas une fonction globale. Les trois contrôles négatifs restent rouges.

## ⑥ INVARIANTS

| | |
|---|---|
| Candidat | 8.71.0, 1 578 496 o (+55 643 sur la base) |
| Double parseur | `new Function` + acorn ES2020, vert |
| Garde `verif_edt.py` | **VERT**, et rouge sur les trois contrôles négatifs |
| Moteur `AT_DR_B64` | intact, md5 inchangé |
| `published` | 97 → 97 |
| Appels `edt*` hors du bloc | `edtSectionPanneau` seul |
| Écritures hors `/site/edt/` | `brevetDates` seule |
| Écritures de l'écran | `photos` seulement — **le prévu n'est écrit nulle part** |

Photo du prévu : 20 cases, datée du jour, ancrée sur le lundi affiché. Le mot « figer » n'apparaît nulle part.

## ⑦ CE QUI VIENT

**④** la modale d'une case (déplaçable, sans voile), les décisions horaires, « ne plus compter cette séance dans la prévision horaire » et ses dix catégories, ↶ Annuler, le journal, l'ouverture du pilotage — c'est là que les portes ① et ③ arrivent.
**⑤** mois, année, divergence, écarts justifiés, classe expérimentale, absence.
**⑥** bancs complets, séquence de test, rapport final.

Les boutons Mois, Année et « Calendrier de l'année… » ne sont pas posés : je ne livre pas de bouton mort.

*Mot à attendre : **continuer**.*
