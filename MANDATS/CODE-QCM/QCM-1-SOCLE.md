# QCM-1 · SOCLE — la séance réelle sous les écrans de la maquette

*Conscience n°12, 12/10/2026, tour 672. Lis d'abord en entier `MANDATS/CODE-QCM/COMMUN.md` : il vaut pour toi en entier.*

Tu es **QCM-1 · SOCLE**. Tu fais tout d'une traite, sans t'arrêter et sans rien demander, jusqu'à 06:30.

## Pour commencer

1. `git fetch origin`, `git checkout code-qcm`. Lis `COMMUN.md`, puis l'app en ligne (`evaluation-qcm.html` de la production : depuis le 12/10 à 14:44, la 7.7.2, md5 `3aaf749929863d69e30a36f7bc4ad355`, qui est la 7.7.1 — md5 `ecae65624855a1a877708986a8e984e5`, commit `2287da6` — réparée de deux lignes, dettes 198 et 210) pour la configuration Firebase, `DB_ROOT`, les chemins, l'entrée par le code (`codes`, l'empreinte), les adresses (`?mode=prof`, `&view=board`, `&view=phone`, `?mode=eleve`, `qr`) ; puis la maquette : `src/scenario.js`, `src/socle.js`, `src/gestes.js`, `src/c3-gestes.js`, `src/c3-scenes.js`, `src/c3-base.js`, `build.py`.
2. **Dans ta première heure, pousse les noms** : `src/live/base.js` avec `SCN`, `ACT` et `ELV` (COMMUN §3.2), chacun appelable, et `build.py` qui assemble l'app (sans sommaire ⚙ ni scènes), qui inclut aussi `src/qcm2.css` et `src/qcm3.css` s'ils existent (QCM-2 et QCM-3 y mettent leurs retouches de style).

## Ce que tu construis

1. **`SCN` branché sur la séance réelle**, abonné à la base, avec les fonctions de la maquette calculées pour n'importe quelle classe et n'importe quel nombre de questions (les règles de note de `scenario.js` : la feuille, « Trouvée au dernier moment » une fois par évaluation, les annulées et les écartées, les compétences, la maîtrise) ;
2. **`ACT` et `ELV`**, qui écrivent dans la base selon le contrat (COMMUN §3.1) ; l'état de la séance (`etat`) et ses passages d'une phase à l'autre, avec les chronos qui tiennent si une page se recharge ou se reconnecte ;
3. **le routeur des gestes** : dans `gestes.js` / `c3-gestes.js`, un clic qui, dans la maquette, sautait à une scène (`data-va`) devient l'action qui fait ce que la scène suivante montre, ou l'ouverture sur place de la fenêtre ou de la fiche ; tu écris cette table d'équivalence (`src/live/gestes.json` : scène de départ, geste, action) et tu la tiens à jour pour QCM-2 et QCM-3 ;
4. **les adresses et les pages** : la console (`?mode=prof`), le tableau (`&view=board`), le téléphone (`&view=phone`, le QR), la tablette (`?mode=eleve`) ; chacune montre l'écran de son appareil au moment réel ;
5. **l'entrée** : le professeur comme dans la 7.7.1 ; l'élève par son code, vérifié contre son empreinte au hub (`codes`), comme dans la 7.7.1 ;
6. **la synchronisation** : chaque donnée affichée est abonnée ; un redessin ne touche pas à l'élément qui a le focus ;
7. **les données d'avant** : une séance de la 7.7.1 se lit avec ce qu'elle a.

## Tes demandes

Tu lis `LIVRAISONS/CODE-QCM/DEMANDES.md` à chaque `git pull`, et tu traites celles qui te sont adressées avant ton travail en cours. Un changement du contrat s'écrit d'abord dans `CONTRAT-CHANGEMENTS.md`.
