# `src/live/` — le socle de l'app (QCM-1 · SOCLE)

*La maquette validée (v9) ne lisait qu'un scénario écrit d'avance ; ici, ses écrans lisent la vraie séance, dans la base de la 7.7.1, et leurs gestes y écrivent. Mandat : `MANDATS/CODE-QCM/COMMUN.md` et `QCM-1-SOCLE.md` (branche `main`).*

## Les fichiers

| Fichier | Ce qu'il fait |
| --- | --- |
| `mjpc-core.js` | MJPC-CORE 1.6.0 et M-SÉCU-2/3, copiés **tels quels** de la 7.7.1 (l. 1086 à 1883) : `sanMJPC`, `extractEleves`, la session MJPC, l'entrée par le code (`mjpcEntreeCode`, `mjpcVerifierCode`, l'empreinte PBKDF2), la porte professeur (`mjpcVerifierProf`). |
| `base.js` | La base (`FIREBASE_CONFIG` et `DB_ROOT = "qcm"` de la 7.7.1) ; **`LIVE`** (ce qui est lu, abonné : `classes`, `qcm/evaluations`, `qcm/sessions`, `qcm/sessionActive`, `qcm/settings`, `taxonomie/competences` ; `LIVE.abonner(f)` ; l'horloge du serveur) ; **`SCN`** (les fonctions de la maquette, calculées sur la vraie séance) ; **`ACT`** (les gestes de Paul) ; **`ELV`** (les gestes de l'élève, dans sa moitié) ; **`MOTEUR`** (les temps comptés : la réflexion, le passage, le tour, B, par transaction). |
| `pages.js` | **`PAGES.ecran()`** : l'écran de chaque appareil au moment réel (la console `?mode=prof`, le tableau `&view=board`, le téléphone `&view=phone`, la tablette `?mode=eleve`, l'accueil) ; il appelle les points d'entrée de QCM-2 (`EcranConsoleHeure`, `EcranTablette`, `EcranTableau`, `EcranTelephone`) et de QCM-3 (`EcranConsoleSoir`, `EcranMesEvaluations`) ; **`NAV`** (ce qui s'ouvre sur place : un onglet, une fenêtre, une fiche) ; la tablette avant l'entrée (la classe, l'attente du lancement). |
| `gestes.js`, `gestes.json` | **Le routeur des gestes** : un clic qui, dans la maquette, sautait à une scène (`data-va`, `versScene`) fait ici l'action (`ACT`, `ELV`) ou ouvre sur place (`NAV`) ; `gestes.json` en est la table (écran de départ, geste, action). Un bouton `data-local` est tenu par son composant : le routeur n'y touche pas. |
| `sans-mjpc.js` | Les écrans de MJPC n'entrent pas dans l'app : les quelques noms de `mjpc.js` que d'autres fichiers lisent au chargement y sont vides. |
| `live.css` | Les retouches de style du socle. |
| `essais/` | `socle.js` : l'épreuve du socle (une séance entière par `ACT` et `ELV` dans plusieurs pages, sur le faux hub ; 52 vérifications) ; `k1.js` : le lancement pas à pas ; `ouvrir.js` : chaque appareil ouvert, ses erreurs. |

Les fichiers de la maquette tenus par QCM-1 et changés pour l'app : `scenario.js` (remplacé : le scénario n'est plus), `socle.js` (le rendu : plus de sommaire ⚙ ni d'adresse `#scene=`, un rendu sans démontage qui garde le curseur), `c3-base.js` (`MO()` vaut `"LIVE"`, `brancherGlobales`, `paramHash` lit `NAV.params`), `c3-gestes.js` (l'accueil : la porte professeur de la 7.7.1 ; « 📺 Ouvrir vue tableau » : `#mode=prof&view=board` ; l'appel), `c3-scenes.js` (« 📱 QR pilotage » : le vrai QR, fermé par `qcm/qrScans/<nonce>`), `build.py`.

## Le contrat

COMMUN §3, plus `../../CONTRAT-CHANGEMENTS.md` : **C1** l'état de la séance est en `deroule` (la 7.7.1 garde `etat` = `"en_cours"` / `"terminee"`) ; **C2** ses champs (`reprise`, `autreHeure`) et le miroir de la 7.7.1 (`phase`, `qIdx`, `phaseStart`, `paused`) ; **C3** `rouverts`, `lancee`, `autoevals`, `qcm/settings/durees` ; **C4** `ELV` prend l'élève en dernier argument ; **C5** les écritures du soir de QCM-3.

## Ce que le socle garantit

- **La séance tient** : tout est dans la base ; une page rechargée revient au même écran, le chrono se recalcule de `depuis` + `duree` (l'horloge du serveur) ; une tablette rechargée garde ses deux élèves (`localStorage`).
- **Les passages de phase** se font une fois, par transaction, depuis la console, le téléphone ou le tableau ; si la console se ferme, les tablettes relaient au bout de 1,5 s.
- **Chaque écriture** est nettoyée pour le vrai Firebase (ni `undefined`, ni `NaN`).
- **La note** suit la règle (288 à 293, 303, 332) : la feuille, lue par le voisin ; « Trouvée au dernier moment » une fois par évaluation, dans l'ordre de la correction ; les annulées et les écartées hors du total ; une question posée pendant le départ d'un élève hors de son total ; sans lecture, pas de note ; le mode partiel. Une séance de la 7.7.1 se note avec ce qu'elle a (sa feuille recopiée, `papier/<slug>/choix`, sinon sa tablette).
- **L'entrée** : le professeur comme dans la 7.7.1 (`?mode=prof`, ou la clé ou l'empreinte du hub) ; l'élève par son code, vérifié contre l'empreinte de `/codes`, avec les messages de la 7.7.1 ; « rejoins » son binôme s'il s'assied à la mauvaise tablette.

## Les essais

```
BANC=<faux hub avec node_modules> APP_FILE=LIVRAISONS/CODE-QCM/evaluation-qcm.staging.html node LIVRAISONS/CODE-QCM/src/live/essais/socle.js
```
