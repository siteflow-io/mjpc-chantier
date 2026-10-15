# `src/live/` — le socle de l'app (QCM-1 · SOCLE)

*La maquette validée (v9) ne lisait qu'un scénario écrit d'avance ; ici, ses écrans lisent la vraie séance, dans la base de la 7.7.1, et leurs gestes y écrivent. Mandat : `MANDATS/CODE-QCM/COMMUN.md` et `QCM-1-SOCLE.md` (branche `main`).*

## Les fichiers

| Fichier | Ce qu'il fait |
| --- | --- |
| `mjpc-core.js` | MJPC-CORE 1.6.0 et M-SÉCU-2/3, copiés **tels quels** de la 7.7.1 (l. 1086 à 1883) : `sanMJPC`, `extractEleves`, la session MJPC, l'entrée par le code (`mjpcEntreeCode`, `mjpcVerifierCode`, l'empreinte PBKDF2), la porte professeur (`mjpcVerifierProf`). |
| `base.js` | La base (`FIREBASE_CONFIG` et `DB_ROOT = "qcm"` de la 7.7.1) ; **`LIVE`** (ce qui est lu, abonné : `classes`, `qcm/evaluations`, `qcm/sessions`, `qcm/sessionActive`, `qcm/settings`, `taxonomie/competences` ; `LIVE.abonner(f)` ; l'horloge du serveur) ; **`SCN`** (les fonctions de la maquette, calculées sur la vraie séance) ; **`ACT`** (les gestes de Paul) ; **`ELV`** (les gestes de l'élève, dans sa moitié) ; **`MOTEUR`** (les temps comptés : la réflexion, le passage, le tour, B, par transaction). |
| `pages.js` | **`PAGES.ecran()`** : l'écran de chaque appareil au moment réel (la console `?mode=prof`, le tableau `&view=board`, le téléphone `&view=phone`, la tablette `?mode=eleve`, l'accueil) ; il appelle les points d'entrée de QCM-2 (`EcranConsoleHeure`, `EcranTablette`, `EcranTableau`, `EcranTelephone`) et de QCM-3 (`EcranConsoleSoir`, `EcranMesEvaluations`) ; **`NAV`** (ce qui s'ouvre sur place : un onglet, une fenêtre, une fiche) ; la tablette avant l'entrée (l'identification, l'attente du lancement ; jamais le choix de la classe : elle vient de l'élève). |
| `gestes.js`, `gestes.json` | **Le routeur des gestes** : un clic qui, dans la maquette, sautait à une scène (`data-va`, `versScene`) fait ici l'action (`ACT`, `ELV`) ou ouvre sur place (`NAV`) ; `gestes.json` en est la table (écran de départ, geste, action). Un bouton `data-local` est tenu par son composant : le routeur n'y touche pas. |
| `sans-mjpc.js` | Les écrans de MJPC n'entrent pas dans l'app : les quelques noms de `mjpc.js` que d'autres fichiers lisent au chargement y sont vides. |
| `live.css` | Les retouches de style du socle. |
| `essais/` | `socle.js` : l'épreuve du socle (une séance entière par `ACT` et `ELV` dans plusieurs pages, sur le faux hub, plus la reprise, le papier, deux séances actives, la console fermée, la séance de la 7.7.1, l'élève chez lui ; 73 vérifications) ; `k1.js` : le lancement pas à pas (`ETAPES=1` : les boutons de la console à chaque phase) ; `coeval.js` : la co-évaluation par le geste ; `demain.js` : l'heure de demain par `ACT` et `ELV` (la 4e, 11 questions dont la bonus, Paul seul sur sa tablette, qui répond une fois, les notes attendues ; 17 vérifications) ; `poids.js` : le poids de l'historique ; `ouvrir.js` : chaque appareil ouvert, ses erreurs. |

Les fichiers de la maquette tenus par QCM-1 et changés pour l'app : `scenario.js` (remplacé : le scénario n'est plus), `socle.js` (le rendu : plus de sommaire ⚙ ni d'adresse `#scene=`, un rendu sans démontage qui garde le curseur), `c3-base.js` (`MO()` vaut `"LIVE"`, `brancherGlobales`, `paramHash` lit `NAV.params`), `c3-gestes.js` (l'accueil : la porte professeur de la 7.7.1 ; « 📺 Ouvrir vue tableau » : `#mode=prof&view=board` ; l'appel), `c3-scenes.js` (« 📱 QR pilotage » : le vrai QR, fermé par `qcm/qrScans/<nonce>`), `build.py`.

## Le contrat

COMMUN §3, plus `../../CONTRAT-CHANGEMENTS.md` : **C1** l'état de la séance est en `deroule` (la 7.7.1 garde `etat` = `"en_cours"` / `"terminee"`) ; **C2** ses champs (`reprise`, `autreHeure`) et le miroir de la 7.7.1 (`phase`, `qIdx`, `phaseStart`, `paused`) ; **C3** `rouverts`, `lancee`, `autoevals`, `qcm/settings/durees` ; **C4** `ELV` prend l'élève en dernier argument ; **C5** les écritures du soir de QCM-3.

## Ce que le socle garantit

- **La séance tient** : tout est dans la base ; une page rechargée revient au même écran, le chrono se recalcule de `depuis` + `duree` (l'horloge du serveur) ; une tablette rechargée garde ses deux élèves (`localStorage`).
- **Les passages de phase** se font une fois, par transaction, depuis la console, le téléphone ou le tableau ; si la console se ferme, les tablettes relaient au bout de 1,5 s.
- **Chaque écriture** est nettoyée pour le vrai Firebase (ni `undefined`, ni `NaN`).
- **La note** suit la règle (288 à 293, 303, 332) : la feuille, lue par le voisin ; « Trouvée au dernier moment » une fois par évaluation, dans l'ordre de la correction ; les annulées et les écartées hors du total ; une question posée pendant le départ d'un élève hors de son total ; sans lecture, pas de note ; le mode partiel. Une séance de la 7.7.1 se note avec ce qu'elle a (sa feuille recopiée, `papier/<slug>/choix`, sinon sa tablette).
- **L'entrée** : le professeur comme dans la 7.7.1 (`?mode=prof`, ou la clé ou l'empreinte du hub) ; l'élève par son code, vérifié contre l'empreinte de `/codes`, avec les messages de la 7.7.1 ; « rejoins » son binôme s'il s'assied à la mauvaise tablette.

## Les règles de l'heure que le socle tient (en plus du contrat)

- **Les gestes de Paul coupent l'attente** (C6) : « ⏭️ Tour suivant » ouvre le 2e tour et « 🔒 Clore la question » clôt la question tout de suite ; la moitié qui vient de répondre dit B pendant ce temps (`deroule.bPour`, `SCN.doitDireB`). « ✋ Autoriser la réponse » garde le passage (« POSE TON STYLO » sur les deux moitiés, puis le 1er tour). Sans geste, au bout du temps : B, puis le passage, puis le tour (les moments de la maquette).
- **Aucun moment de la classe ne commence seul** (Paul, 13/10 : « Jamais de sessions de groupe lancées automatiquement ») : la correction commence quand Paul clique « ▶️ Commencer la correction », ouvert quand tous les présents ont coché la seconde attestation (c-attest2) ; seuls les temps comptés d'une question passent seuls (réflexion, passage, tour, B). La séance terminée, la tablette revient à « Combien êtes-vous ? » (t-fin).
- **L'élève seul** (nombre impair, binôme absent ou parti, rattrapage) répond une fois par question, au premier tour, quel que soit son côté ; sa réponse donnée, il n'a plus la main au tour suivant (`SCN.seul`, `SCN.aLaMain` ; un seul tour, `scenario.js`) ; un tour sans personne ne se joue pas.
- **Les attentes** (attestations, estimation, lecture, co-évaluation, « 🏁 ») ne comptent que les présents **entrés** sur une tablette (`SCN.actifs`).
- **La reprise** d'une séance finie à une autre heure : l'appel, l'entrée, « prêt », puis `ACT.reprendre()` relance la phase gelée au début.
- **La séance sur papier** : après l'appel, la séance sur papier ; la reprise : l'appel, l'estimation, la seconde attestation, la correction d'après la grille (sans lecture, sans « Trouvée au dernier moment »).
- **La séance interrompue** (la console perdue, `lastDisconnect` de la 7.7.1) : la console rouverte ouvre « ⚠️ Séance interrompue détectée » ; « 🔄 Reprendre la séance » confirme la reprise : le chrono reste où il en était (13/10).
- **« À lire sur les feuilles »** s'écrit dans la base dès qu'une ligne naît (`aLire/<id>`) ; **la présence** de la 7.7.1 (`qcm/presence/<classe>/<élève>`) est tenue par chaque tablette.
- **Les niveaux de maîtrise** suivent les tranches des Réglages (`qcm/settings/maitrise`) ; sans réglage, celles de la maquette (15, 10, 5).
- **La question bonus** compte dans les points gagnés, pas dans le total ; la note ne dépasse pas 20.
- **Plusieurs séances actives** : la console pilote la plus récente ; « 🔴 n séances en cours » les liste, chacune à son pilotage ou à « 🛑 Terminer ».
- **Fermer ne quitte jamais la page** : `history.back()` de la maquette devient la fermeture sur place.

## Le poids de l'historique (mesuré le 12/10, `essais/poids.js`)

Chaque page écoute `qcm/sessions` entier, comme la 7.7.1 (`AppProf`, `EleveSession`). Au hub, le 11/08 : 3 séances, 37 Ko (`SAUVEGARDES/hub-snapshot-2026-08-11.json`) ; demain, quelques dizaines de Ko. Mesuré avec 80 séances passées de 25 élèves et 20 questions (4,3 Mo) : un redessin coûte 24 ms (médiane) sur la console, 6 ms sur une tablette, mais chaque réponse fait relire les 4,3 Mo à chaque page. Si l'historique grossit à ce point dans l'année, il faudra que les tablettes n'écoutent que la séance active (`qcm/sessions/<sid>`) : rien à faire pour demain.

## Les essais

```
BANC=<faux hub avec node_modules> APP_FILE=LIVRAISONS/CODE-QCM/evaluation-qcm.staging.html node LIVRAISONS/CODE-QCM/src/live/essais/socle.js
```
