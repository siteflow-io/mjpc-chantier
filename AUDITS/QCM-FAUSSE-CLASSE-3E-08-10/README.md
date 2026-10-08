# Fausse classe — QCM de 3e du 09/10, app en ligne telle quelle

*Conscience n°12, 08/10/2026, tour 571. Ordre de Paul (11:56) : « tu vas faire tourner une fausse classe sur l'évaluation de 3e de demain dans son format actuel, et tu vas me sortir des données précises qui exemplifient 1. Le bénéfice du doute. 2. Sans le bénéfice du doute. » Références : les numéros de [CADRAGE-QCM.md](https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/CADRAGE-QCM.md).*

## Ce qui a tourné

- **L'app** : `evaluation-qcm.html` 7.7.1, servie à l'octet près (md5 `ecae65624855a1a877708986a8e984e5`, celui de la production).
- **L'évaluation** : « 3e- éval 1 Analyse logique - Construire une phrase complexe », telle qu'au hub le 08/10 (relue en lecture seule, identique à celle du matin) : 11 questions, mode strict, 29 points (Q1 2, Q2 2, Q3 3, Q4 3, Q5 2, Q6 3, Q7 4, Q8 3, Q9 2, Q10 1, Q11 4).
- **Le hub** : un faux hub en mémoire (`banc/fakefb.js`, `banc/server.js`). Le vrai hub n'a jamais été joint : le SDK Firebase est remplacé, et toute requête vers le hub est servie ou bloquée par le banc.
- **La classe** : « 3 ESSAI », 25 élèves fictifs, un par tablette (format actuel). Aucun nom ni aucun nom de famille ne croise un élève réel des rosters du hub (vérifié sur 154 élèves).
- **Les gestes, tous par l'écran** : au poste du prof, choix de la classe et de l'éval, appel (« Tout le monde présent »), case « ✋ Réponse » à 20 s, « ▶️ Lancer Q1 », « Q suiv. → », autoévaluation, correction (« Révéler », « Question suivante → »), « Terminer la session ». Sur chaque tablette : code, prénom, nom, puis les lettres touchées pendant la réponse. Après la séance : « Tes évaluations passées », saisie papier, « Envoyer → ».
- **Ce qui est posé par moi** : ce que chaque élève a écrit sur sa feuille, touché sur la tablette et saisi ensuite (`banc/scenario.py`, `donnees/scenario.json`). Les cas qui illustrent les deux règles sont posés à la main ; le reste suit un niveau par élève, tiré au sort (graine fixe). **Ce ne sont pas des mesures de tes élèves** : au hub, seule la séance du 19/06 a des saisies (4 élèves, 52 réponses, aucun cas de bénéfice du doute).
- **Ce qui est mesuré** : tout le reste. Les notes sont celles que l'app a calculées et affichées (bilan de fin de séance, page de résultats de l'élève, tableau des scores de ta console, export CSV). Mon recompte indépendant (`banc/recompte.py`, depuis ce que le faux hub a reçu) donne les mêmes chiffres pour les 25 élèves : 0 désaccord.

## Ce que l'app affiche aujourd'hui

- **Fin de séance, tablette de l'élève** : « x / 11 bonnes réponses » et « Points pour la note : x / 29 », d'après la **tablette seule** (capture 10).
- **Page de résultats de l'élève** (après sa saisie) : « Score officiel » = **avec** le bénéfice du doute, « Score papier » = **sans**, « Score app » ; tous trois en bonnes réponses sur 11, sans les points (capture 1).
- **Ta console**, Données → Résultats : « App », « Papier », « Écart », en bonnes réponses sur 11. **Pas de colonne « Officiel »** (j'avais écrit le contraire en 137 : c'est faux). L'infobulle de « Papier » dit : « C'est le score qui compte » (capture 2).
- Donc aujourd'hui, **l'élève lit sa note avec le bénéfice du doute, toi sans**.

## Les 25 élèves

« Sans » = la feuille, d'après la saisie de l'élève (la colonne « Papier » de ta console). « Avec » = le meilleur des deux, question par question (le « Score officiel » de l'élève). Les points suivent la pondération 1/2/3/4 ; la note sur 20 est le prorata des points (décision 133). « Feuille réelle » = ce que dit vraiment la feuille, que l'app ne voit pas.

| Élève | Cas posé | Tablette | Sans le bénéfice du doute | Avec le bénéfice du doute | Écart | Feuille réelle |
|---|---|---|---|---|---|---|
| ABRIAL Julien | — | 9 / 11 · 22 pts | 9 / 11 · 22 pts · 15,2/20 | 9 / 11 · 22 pts · 15,2/20 | +0 | 22 pts |
| BAUDRY Léa | Q3 feuille juste, lettre touchée fausse | 6 / 11 · 15 pts | 7 / 11 · 18 pts · 12,4/20 | 7 / 11 · 18 pts · 12,4/20 | +0 | 18 pts |
| CARRÉ Tom | Q9 feuille fausse, lettre touchée juste | 9 / 11 · 21 pts | 8 / 11 · 19 pts · 13,1/20 | 9 / 11 · 21 pts · 14,5/20 | +2 | 19 pts |
| DUVERNAY Michel | Q10 feuille fausse, lettre touchée juste ; **pas de saisie** | 7 / 11 · 15 pts | — | — | — | 14 pts |
| ESNAULT Inès | Q9 feuille juste, lettre touchée fausse | 6 / 11 · 14 pts | 7 / 11 · 16 pts · 11,0/20 | 7 / 11 · 16 pts · 11,0/20 | +0 | 16 pts |
| FOUCHER Hugo | Q4 feuille fausse, lettre touchée juste | 5 / 11 · 13 pts | 4 / 11 · 10 pts · 6,9/20 | 5 / 11 · 13 pts · 9,0/20 | +3 | 10 pts |
| GALLOIS Manon | — | 9 / 11 · 24 pts | 9 / 11 · 24 pts · 16,6/20 | 9 / 11 · 24 pts · 16,6/20 | +0 | 24 pts |
| HÉBRARD Nathan | Q11 feuille : aucun des choix ; lettre touchée juste | 6 / 11 · 18 pts | 5 / 11 · 14 pts · 9,7/20 | 6 / 11 · 18 pts · 12,4/20 | +4 | 14 pts |
| ISAMBERT Chloé | — | 9 / 11 · 23 pts | 9 / 11 · 23 pts · 15,9/20 | 9 / 11 · 23 pts · 15,9/20 | +0 | 23 pts |
| JOUBERT Louis | Q7 feuille juste, lettre touchée fausse | 7 / 11 · 17 pts | 8 / 11 · 21 pts · 14,5/20 | 8 / 11 · 21 pts · 14,5/20 | +0 | 21 pts |
| LACOMBE Emma | Q11 feuille fausse, lettre touchée juste | 8 / 11 · 21 pts | 7 / 11 · 17 pts · 11,7/20 | 8 / 11 · 21 pts · 14,5/20 | +4 | 17 pts |
| MAILLARD Noah | — ; **pas de saisie** | 4 / 11 · 12 pts | — | — | — | 12 pts |
| NOGARET Zoé | Q1 feuille juste, lettre touchée fausse | 5 / 11 · 12 pts | 6 / 11 · 14 pts · 9,7/20 | 6 / 11 · 14 pts · 9,7/20 | +0 | 14 pts |
| OLLIVIER Sacha | Q2 feuille fausse, lettre touchée juste; Q6 feuille fausse, lettre touchée juste; Q7 feuille fausse, lettre touchée juste; Q8 feuille fausse, lettre touchée juste | 5 / 11 · 15 pts | 1 / 11 · 3 pts · 2,1/20 | 5 / 11 · 15 pts · 10,3/20 | +12 | 3 pts |
| PERRAUD Jade | — | 7 / 11 · 19 pts | 7 / 11 · 19 pts · 13,1/20 | 7 / 11 · 19 pts · 13,1/20 | +0 | 19 pts |
| QUINTON Enzo | Q5 rien touché à temps ; feuille juste | 8 / 11 · 21 pts | 9 / 11 · 23 pts · 15,9/20 | 9 / 11 · 23 pts · 15,9/20 | +0 | 23 pts |
| RAMBAUD Lina | Q8 feuille juste, lettre touchée fausse | 5 / 11 · 12 pts | 6 / 11 · 15 pts · 10,3/20 | 6 / 11 · 15 pts · 10,3/20 | +0 | 15 pts |
| SABATIER Malo | — | 7 / 11 · 15 pts | 7 / 11 · 15 pts · 10,3/20 | 7 / 11 · 15 pts · 10,3/20 | +0 | 15 pts |
| TESSIER Anna | Q1 feuille fausse, lettre touchée juste | 6 / 11 · 15 pts | 5 / 11 · 13 pts · 9,0/20 | 6 / 11 · 15 pts · 10,3/20 | +2 | 13 pts |
| VALLÉE Rayan | Q3 feuille : aucun des choix ; lettre touchée fausse | 4 / 11 · 8 pts | 4 / 11 · 8 pts · 5,5/20 | 4 / 11 · 8 pts · 5,5/20 | +0 | 8 pts |
| WEBER Clara | Q2 feuille juste, lettre touchée fausse | 4 / 11 · 12 pts | 5 / 11 · 14 pts · 9,7/20 | 5 / 11 · 14 pts · 9,7/20 | +0 | 14 pts |
| YVON Adam | Q10 feuille : aucun des choix ; lettre touchée fausse | 5 / 11 · 15 pts | 5 / 11 · 15 pts · 10,3/20 | 5 / 11 · 15 pts · 10,3/20 | +0 | 15 pts |
| ZELLER Lou | Q10 rien touché à temps ; feuille fausse | 3 / 11 · 8 pts | 3 / 11 · 8 pts · 5,5/20 | 3 / 11 · 8 pts · 5,5/20 | +0 | 8 pts |
| BRUNEAU Camille | Q7 feuille fausse, lettre fausse, saisie arrangée en juste | 1 / 11 · 2 pts | 2 / 11 · 6 pts · 4,1/20 | 2 / 11 · 6 pts · 4,1/20 | +0 | 2 pts |
| CHEVALLIER Théo | Q3 feuille fausse, lettre juste, saisie arrangée en juste | 7 / 11 · 18 pts | 7 / 11 · 18 pts · 12,4/20 | 7 / 11 · 18 pts · 12,4/20 | +0 | 15 pts |

**Sur la classe** : 17 élèves sur 23 ont la même note avec les deux règles ; le bénéfice du doute ajoute 27 points, à 6 élèves, dont 12 à Sacha seul.

## Les cas, question par question

| Élève | Question | Sa feuille | Lettre touchée | Sa saisie | Bonne réponse |
|---|---|---|---|---|---|
| BAUDRY Léa | Q3 (3 pts) | BCE | BC | BCE | BCE |
| CARRÉ Tom | Q9 (2 pts) | B | C | B | C |
| DUVERNAY Michel | Q10 (1 pts) | C | B | (pas de saisie) | B |
| ESNAULT Inès | Q9 (2 pts) | C | D | C | C |
| FOUCHER Hugo | Q4 (3 pts) | AB | ABD | AB | ABD |
| HÉBRARD Nathan | Q11 (4 pts) | aucun | D | — | D |
| JOUBERT Louis | Q7 (4 pts) | ACE | AC | ACE | ACE |
| LACOMBE Emma | Q11 (4 pts) | A | D | A | D |
| NOGARET Zoé | Q1 (2 pts) | D | C | D | D |
| OLLIVIER Sacha | Q2 (2 pts) | CD | CDF | CD | CDF |
| OLLIVIER Sacha | Q6 (3 pts) | BCDF | BDF | BCDF | BDF |
| OLLIVIER Sacha | Q7 (4 pts) | ACEF | ACE | ACEF | ACE |
| OLLIVIER Sacha | Q8 (3 pts) | AE | ADE | AE | ADE |
| QUINTON Enzo | Q5 (2 pts) | A | — | A | A |
| RAMBAUD Lina | Q8 (3 pts) | ADE | AD | ADE | ADE |
| TESSIER Anna | Q1 (2 pts) | A | D | A | D |
| VALLÉE Rayan | Q3 (3 pts) | aucun | CE | — | BCE |
| WEBER Clara | Q2 (2 pts) | CDF | CD | CDF | CDF |
| YVON Adam | Q10 (1 pts) | aucun | C | — | B |
| ZELLER Lou | Q10 (1 pts) | D | — | D | B |
| BRUNEAU Camille | Q7 (4 pts) | AC | AC | ACE | ACE |
| CHEVALLIER Théo | Q3 (3 pts) | ABCE | BCE | BCE | BCE |

« aucun » : la feuille ne dit aucun des choix ; dans l'app actuelle, l'élève laisse la question vide à la saisie (« — »).

**Ta vérification de 180** (« saisie juste, tablette fausse ») signale ici 8 élèves : Léa, Inès, Louis, Zoé, Lina, Clara, Enzo, honnêtes, et Camille, la seule saisie arrangée. Théo (saisie arrangée, lettre juste) n'est pas signalé (186).

## Ce que la fausse classe a montré d'autre (mesuré)

1. **La correction plante sur les tablettes** (dette 198). À la première question corrigée, **25 tablettes sur 25** montrent un écran vide (capture 4) ; erreur de l'app : `ReferenceError: bonnes is not defined`, dans `EleveCorrection` (ligne 4365 : `var bon = bonnes.indexOf(i) >= 0;`, `bonnes` n'est défini nulle part dans la fonction). Le tableau, lui, affiche la correction (capture 5). Après la dernière question, une tablette rechargée (code retapé) retrouve son bilan : 0 écran vide sur 25. Au hub, la dernière séance passée par la correction date du 19/06.
2. **La case « ✋ Réponse » n'est prise que par « ✋ Autoriser la réponse »** (dette 199 ; `donnees/chrono.log`, capture 6). Case à 20 s : Q1 et Q2 laissées au chrono, la réponse dure 5,0 s et 5,5 s ; Q3 ouverte par « ✋ Autoriser la réponse », 20,1 s ; Q4 laissée au chrono, 20,5 s : la valeur reste ensuite pour la séance. Dans le code, la fin automatique de la réflexion écrit `{phase:"reponse", phaseStart}` sans le chrono de la case.
3. **La saisie en classe s'efface quand un autre élève envoie la sienne** (dette 180 complétée ; `donnees/saisie.log`, captures 7 et 8). Trois tablettes restées ouvertes depuis la séance, après « Terminer la session » : Léa a coché 4 lettres ; Julien appuie sur « Envoyer → » ; Léa n'a plus aucune lettre et revient, comme Tom resté sur l'accueil, à « ⏳ Attends la prochaine question... ». Seul un rechargement les en sort. Cause : l'écoute `sessions/<sid>` de `EleveSession` n'est jamais retirée ; l'envoi de Julien la réveille chez tous.
4. **Après « Envoyer → », 23 élèves sur 23 tombent sur « Choisis ta classe »** (138 ; capture 9) et doivent retaper code, prénom et nom pour voir leurs résultats.

## Pour rejouer

`banc/` : `npm i ws@8.18.0 react@17.0.2 react-dom@17.0.2`, Playwright, puis `node run.js` (la séance complète, environ 9 minutes), `node banc_chrono.js`, `node banc_saisie.js`, `python3 recompte.py out`. `server.js` lit l'app dans `/home/claude/QCM/evaluation-qcm.html` (à adapter). `fakefb.js` est le faux Firebase 8 partagé entre pages (écoutes « value », `off()` sans argument qui retire toutes les écoutes d'une adresse, tableaux stockés en objets, `ServerValue.TIMESTAMP`, `onDisconnect`, `transaction`).
