# La consigne des relecteurs neufs (QCM-4-BANC.md, « De 05:30 à 06:30 », point 2)

Chaque relecteur est un sous-agent qui n'a jamais vu le code de l'app ni le banc. Il reçoit seulement :
1. **la maquette validée** : `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html` (s'ouvre dans Chromium, `file://…#scene=<id>` ; ⚙ en bas donne le sommaire des scènes) ;
2. **son README** : `MANDATS/MAQUETTE-QCM-COMPLETE/README.md` ;
3. **l'adresse de l'app sur le faux hub** : le fichier que `serveur-relecteurs.js` écrit (l'adresse, les pages, les 25 élèves de 3 ESSAI et leurs codes), et la façon d'ouvrir une page comme un appareil de la classe (`relecteur-outils.js`).

Il lui est interdit d'ouvrir `LIVRAISONS/CODE-QCM/src`, `build.py`, `banc/` (hors `relecteur-outils.js`), `DEFAUTS-OUVERTS.md`, `sorties/` et l'app assemblée en texte : il clique, comme Paul.

## Le texte donné à chacun

> Tu es un relecteur neuf de l'app QCM de Paul, professeur de français. Demain matin, il fait passer à une classe une évaluation avec cette app : la console sur son ordinateur, les tablettes partagées par deux élèves, son téléphone, le tableau projeté. L'app doit faire exactement ce que montre la maquette validée par Paul.
>
> Tu as : la maquette, `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html` (chaque scène s'ouvre par `file://<chemin>#scene=<id>`, le sommaire ⚙ les liste dans l'ordre de la séance) ; son README, `MANDATS/MAQUETTE-QCM-COMPLETE/README.md` ; l'app, servie sur un faux hub : `<INFO>` (un fichier JSON : l'adresse, les pages, la classe 3 ESSAI et les codes de ses 25 élèves). Pour ouvrir une page de l'app comme un appareil : `const R = require("<OUTILS>"); const nav = await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath: "/opt/pw-browsers/chromium"}); const p = await R.ouvrir(nav, info, "?mode=prof", 1536, 864);` (console : `?mode=prof` ; tablette : `?mode=eleve`, 1280 × 800, une par contexte ; téléphone : `?mode=prof&view=phone`, 390 × 844 ; tableau : `?mode=prof&view=board`). `p.__erreurs` garde les erreurs de la page. Tu écris tes scripts dans `<DOSSIER>` et tu y ranges tes captures.
>
> Tu n'ouvres pas le code de l'app, ni son banc, ni ses défauts déjà connus : tu cliques, comme Paul. **<PARTIE>** Compare chaque écran à la scène de la maquette du même moment : ce qui est écrit, les boutons, ce qui se passe quand on clique, ce qui arrive sur les autres appareils sans recharger.
>
> Écris dans `<DOSSIER>/trouvailles.md` chaque chose qui ne va pas, une par ligne : l'appareil, l'écran, le geste, ce que montre la maquette (l'id de la scène), ce que tu vois (avec la capture). Pas de proposition de correction. Termine par le nombre de trouvailles et ce que tu n'as pas pu jouer, et pourquoi.

Les trois parties (une par relecteur) :
- **R1 — l'heure, de l'appel à la fin des questions** : lancer la séance de 3 ESSAI sur l'évaluation d'essai (Adam absent), l'entrée de quatre élèves sur deux tablettes partagées, l'attestation, les trois questions à leurs deux tours avec B, un élève rouvert, le téléphone et le tableau à chaque étape ;
- **R2 — l'heure, de l'estimation au bilan** : la même séance jouée jusqu'au bout avec deux tablettes ; l'estimation, la seconde attestation, la correction par la lecture de la feuille du voisin, « 💡 Révéler », « Trouvée au dernier moment », le point d'autonomie, la co-évaluation et son alerte, le bilan de chaque élève, « 🛑 Terminer » ;
- **R3 — le soir et le reste** : après une séance jouée jusqu'au bilan, Données → Résultats, le tableau de la séance, la fiche d'un élève, « Que dit la feuille ? », rendre les copies, le PDF, « 📊 Mes évaluations » côté élève ; puis Évaluations (la liste, « ➕ Nouvelle évaluation » avec le JSON de `banc/donnees/eval-4e-11.json` qu'on lui donne, l'éditeur), Réglages et le prompt, le mode test.

## La reprise du 13/10 (DEFAUTS-OUVERTS, « Reprise du 13/10 », points 0 à 7) — trois relecteurs neufs de plus, lancés à 08:00 sur l'app de 08:00

Même texte, mêmes interdits ; chacun a son faux hub (son port) et n'utilise aucun autre port. La décision de Paul du 13/10 07:22 leur est donnée, parce qu'elle change la maquette sur ce point : « Non c'est moi qui lance la correction. Jamais de sessions de groupe lancées automatiquement. » Les situations à jouer sont données (ce sont celles où les premiers relecteurs ont trouvé quelque chose), jamais ce qu'il faut y voir : c'est la maquette qui le dit.

- **R4 — l'heure, de l'appel à la fin des questions** : la séance de 3 ESSAI (Adam absent), deux tablettes partagées et **une troisième tablette où personne n'entre** (ses deux élèves présents à l'appel) ; un élève **qui ne clique rien** à une question ; **une question à laquelle personne ne répond** ; « 🔓 Rouvrir pour un élève » (qui la liste propose, ce que voient l'élève, la console, le téléphone, le tableau, pendant et après sa réponse) ; « 🔓 Rouvrir pour tous » sur une question close ; le tableau et sa liste « 👥 Classe » ; la console rechargée au milieu d'une question (« ⚠️ Séance interrompue détectée »).
- **R5 — l'heure, de l'estimation au bilan** : l'estimation, la seconde attestation et **le moment où la correction commence** ; la correction ; « Trouvée au dernier moment » ; la co-évaluation et son alerte, **notamment quand un élève trouvé au dernier moment signale ❌ cette question** ; le bilan ; « 🛑 Terminer ».
- **R6 — la fin et le soir** : « 🛑 Terminer » **pendant que la console se ferme** (la page fermée juste après le clic), puis ce que la console rouverte montre de la séance ; puis le soir : « Que dit la feuille ? » sur une feuille que Paul lit lui-même (qui y a lu quoi, ce qui reste « à lire »).
