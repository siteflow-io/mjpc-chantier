# Le mode test du QCM, tel qu'il est en production (7.7.1) — 09/10/2026

*Conscience n°12, tour 619. Demande de Paul (09/10, 21:18) : « 559. Va regarder le mode test actuel. »*

**Comment.** L'app de production (`evaluation-qcm.html` 7.7.1, identique à la production) servie sur le faux hub du banc, ouverte en mode professeur ; un clic sur « 🧪 Mode test » ; puis « ▶️ Lancer Q1 », « ✋ Autoriser la réponse », « 🎲 Tous les élèves répondent », et « 👋 Ouvrir le portail élève ». Aucune erreur de page. Le banc : [banc/banc_modetest.js](banc/banc_modetest.js) (il se lance depuis le dossier du banc de l'audit QCM-FAUSSE-CLASSE-3E-08-10).

**Ce qu'il a, lu dans le code (l. 4415-4925) et vu sur les captures.**

- En haut : « 📥 Exporter snapshot test », « 📱 QR pilotage » (le téléphone pilote la séance de test), « 🗑️ Sortir et purger ».
- « 🔬 Éprouver les mécanismes livrés » (`OutilsTestP2`) : cinq boutons qui appellent les vraies fonctions de l'app : « 🔒 Clôturer (chemin réel) », « ✏️ Modifier l'éval après coup », « ⚖️ Vérifier que les notes n'ont pas bougé », « ⏱️ Faire expirer le chrono », « 🔄 Relire l'état ».
- « 🎓 Entrer comme un élève » (`PortailTestQCM`) : le vrai portail élève (`AppEleve`), choix de la classe puis code personnel, avec les 30 codes de test (`codesTest`, écrits dans `/codes`, effacés à la sortie).
- « 🎯 Panneau prof » : la vraie console de séance (`SessionLive`), sur la classe « _test_evaluation-qcm » et l'évaluation « Évaluation TEST — Capitales » (4 questions), séance lancée d'office : ni appel, ni binômes.
- « 👥 Panneaux élèves simulés » : 30 élèves fictifs (`TEST_ELEVES`, avec leur sexe), un panneau cliquable par élève (`EleveSimule`), en grille de trois ; « 🎲 Tous les élèves répondent » répond au hasard, aux questions et à l'estimation.
- À la sortie (`purgerEtSortir`) : la classe, l'évaluation, les séances, les codes et la présence de test sont effacés.

**Texte faux.** L'infobulle du bouton « 🧪 Mode test » (l. 6026) annonce « 3 élèves simulés » et « les 3 panneaux élèves » : il y en a 30. Dette 211.

**Captures.**

1. Le haut de la page, à l'ouverture : [captures/1-haut-de-page.png](captures/1-haut-de-page.png)
2. La console et les premiers panneaux, quand les 30 ont répondu à Q1 : [captures/2-console-et-panneaux.png](captures/2-console-et-panneaux.png)
3. « Entrer comme un élève » : [captures/3-entrer-comme-un-eleve.png](captures/3-entrer-comme-un-eleve.png)
4. Les pages entières : [captures/page-entiere-ouverture.png](captures/page-entiere-ouverture.png), [captures/page-entiere-q1-tous-repondu.png](captures/page-entiere-q1-tous-repondu.png)
