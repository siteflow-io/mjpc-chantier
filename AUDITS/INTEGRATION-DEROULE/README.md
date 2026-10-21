# L'outillage de l'intégration du déroulé — conscience n°13, 21/10/2026

*Ce dossier est celui de la conscience : les exécutants le lancent, ne le modifient jamais (contrat §6). Un outil qui échoue se signale dans `JOURNAL.md` avec la sortie ; la conscience tranche.*

| fichier | ce qu'il fait | quand |
|---|---|---|
| `banc.sh` | **le banc d'intégration** : assemble, collisions, parcours, parcours en mode test, contrôles K1-K13 par l'entrée du site ; code 0 si tout est vert ; sorties horodatées | avant chaque poussée (exécutants) ; à chaque audit (conscience) |
| `assembler.mjs` | `LIVRAISONS/INTEGRATION/index.html` + `dr/*` → `assemble/index.html` (un seul fichier : **ce qu'on joue et ce que Paul promeut**) | par `banc.sh` |
| `collisions.mjs` | ids, classes CSS, globales en collision entre `dr/*` et le reste du site : 0 attendu (contrat §7) ; `collisions.json` = la mesure de départ (21/10 : 8 globales, 14 classes, 15 ids) | par `banc.sh` |
| `parcours.mjs` | **P0-P12** : le parcours réel joué par la conscience le 20/10 sur la production (panneau prof → emploi du temps → case → Atelier → clic droit → lancer → parole → palette → tableau → fin de l'heure → Relecture → Papier → clôture), écran entier à chaque pas ; **K15** : les écritures au hub, toutes sur des chemins permis ; **K15-test** (`MJPC_MODE_TEST=1`) : zéro écriture. Chaque pas essaie d'abord les noms du déroulé intégré, puis ceux de la production, et dit lequel il a pris ; un pas sans entrée est « absent » (pas un échec). **Éprouvé le 21/10 sur la production 8.74.0-③** : vert (`epreuves/parcours-sur-prod.txt`) ; **rouge en mode test** (`epreuves/parcours-sur-prod-mode-test.txt`) = la dette 13 · 25, qui se règle. | par `banc.sh` |
| `hub/` | le faux hub : `classes.json` (3E Charles de Gaulle, 29 élèves ; `ed` d'essai posé par les scripts), `site_3e.json` (le chapitre 0, ses 9 séances, 95 écrans), `site_config.json`, `grille-appariee.json` (semaine du 14/09), `calendrier.json`, `creneaux.json`, `taxonomie.json` (copie du sas ; à rafraîchir depuis le vrai hub si Paul la donne) | lu par `parcours.mjs` et `controles.mjs` (`MJPC_HUB` pour un autre dossier) |
| `../CONTROLES-DEROULE/controles.mjs` (v2) | K1-K13, inchangés, **avec l'entrée du site** quand `MJPC_ENTREE=site` (faux hub, horloge au 14/09 09:00, gestes réels jusqu'à l'onglet Atelier) ; sans la variable, la maquette seule comme avant. `noteDe` lit `dr.notes()` sur le site intégré (contrat §5) | par `banc.sh` |

Playwright : `MJPC_PLAYWRIGHT` (facultatif), sinon le global `/opt/node22/lib/node_modules/playwright`, sinon `node_modules/` à côté du fichier joué ; Chromium : `MJPC_CHROMIUM`. Horloge fixée au lundi 14/09/2026 09:00 (créneau 08:57-09:52 de 3E Charles de Gaulle, heure 1/3), fenêtre 1366 × 768 pour le parcours, 1280 × 800 pour les contrôles.

## Pour l'exécutant
`sh AUDITS/INTEGRATION-DEROULE/banc.sh E<n>/sorties/<heure>` avant de pousser ; la sortie est poussée avec. Un pas « absent » d'un territoire qui n'est pas le tien n'est pas ton affaire ; un pas « absent » du tien est ton prochain travail. Un contrôle K rouge pour une raison de taille (la zone du déroulé est moins haute dans le site) : la mesure dans `JOURNAL.md`, et on continue.

## Pour la conscience, à chaque audit (toutes les deux heures)
`git pull origin integration` → `sh banc.sh` → lire `E*/JOURNAL.md` → comparer les captures du parcours avec celles de la veille (`TRANSCRIPTS/C13/pieces/T72-EX-*`) → écrire les relances dans `MANDATS/INTEGRATION-DEROULE/RELANCES/E<n>.md` → le point à Paul.
