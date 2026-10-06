# p8-1 — les bancs tournent dans la machine cloud (la maquette ne change pas)
*Exécutant, session cloud de Claude Code, 06/10/2026. Mandat : `MANDATS/MANDAT-DEROULE-MAQUETTE-P8.md` (version 3), livraison p8-1. Branche `deroule/p8-1`, partie de `main` (`0441428`).*

## Ce que ça change pour la classe
Rien à l'écran : la maquette p7 n'est pas touchée. Ce qui change, c'est la preuve : les 24 bancs de la p7 tournent maintenant hors de la machine de la conscience n°12, d'une seule commande, et échouent si un seul geste échoue. C'est la condition pour que p8-2 et p8-3 (les schémas lisibles du fond de la classe) soient prouvés par le geste.

## La base et son md5
- Maquette jouée : `TRANSCRIPTS/C12/pieces/T265-maquette-pilotage-ordi-v9c15p7-manipulable.html`, **md5 `5045f337d930faaa9cb073e203cf44eb`** (inchangée).
- **Prouvé avant toute modification** : régénérée ici depuis le gabarit `T265-v9c15p7-template.html` (md5 `0c497a635d99e461babd08cdf16feb4f`) par `T159-gen-par-difference.py`, avec `vis/v9c13-template.html` = `T142-v9c13-template.html` (md5 `225451a58f0ac0c6a4dcfbd8d6ccfd15`) et `C12/maquette-v9c13-courante.html` = `T280-maquette-v9c13-courante.html` (md5 `21225e9b5442ce37a63f7a0a27488f77`) : « généré … 501893 octets · bloc repris 92432 », **md5 `5045f337d930faaa9cb073e203cf44eb`** — identique.

## Les versions (la machine)
- Node **v22.22.0** (npm 10.9.4) · Playwright **1.56.1** (`npm install` dans ce dossier, `package.json` / `package-lock.json`) · Chromium **141.0.7390.37** (révision 1194, le « headless shell » de Playwright).
- **Écart avec le mandat, dit** : `npx playwright install --with-deps chromium` **n'a pas été lancé**. L'environnement cloud fournit Chromium déjà installé pour Playwright (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`, révisions 1194) et ses consignes interdisent de le retélécharger. J'ai donc fixé Playwright à 1.56.1, la version qui attend exactement cette révision : aucun téléchargement, aucun chemin à donner. La version de Chromium est lue par le banc unique lui-même (en tête de sa sortie).

## Ce qui a été modifié, compté
La maquette : **rien** (0 fonction touchée). Les bancs : seules les lignes de chemin.
- Les 24 bancs `T265-*.mjs` copiés dans `bancs/` sous leur nom sans `T265-` (`test-p7-schema-envoi.mjs` garde son nom complet ; le banc unique de la n°12 l'appelait `test-p7`).
- Dans chacun, et **nulle part ailleurs** (contrôlé par `diff` contre l'original : seules ces lignes diffèrent ; `sorties/tailles-bancs.txt`) :
  - l'import de Playwright (`/home/claude/.npm-global/…/index.mjs`) → `import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs'` : **24** lignes ;
  - `executablePath: '/opt/google/chrome/chrome'` → `executablePath: CHROMIUM` : **24** ;
  - `page.goto('file:///home/claude/C12/maquette-v9c15p7-courante.html')` → `page.goto(MAQUETTE)` : **32** (plus `const F = MAQUETTE` dans `tout-cliquer-p7`, 1) ;
  - `path: 'vis/….png'` → `path: capture('….png')` : **9** captures.
  - Lignes changées par banc (diff, avant + après) : 6 à 12 ; tailles avant → après, par exemple `test-p3-p7` 12 431 → 12 344 o, `tout-cliquer-p7` 26 098 → 26 016 o (la liste complète : `sorties/tailles-bancs.txt`).
  - **Aucune vérification changée** : aucun `ok(…)` touché (le compte des `ok(` est identique avant et après dans chacun des 24 bancs : `sorties/tailles-bancs.txt`).
- Nouveau : `bancs/env.mjs` (l'environnement, 13 lignes) — trois variables, chacune avec un défaut relatif au dossier de la livraison :
  - `MJPC_MAQUETTE` (défaut : `../../../TRANSCRIPTS/C12/pieces/T265-maquette-pilotage-ordi-v9c15p7-manipulable.html`),
  - `MJPC_CHROMIUM` (défaut : le Chromium de Playwright),
  - `MJPC_CAPTURES` (défaut : `captures/`) ; et, facultatif, `MJPC_PLAYWRIGHT` (le module).
- Nouveau : `bancs/tous-les-bancs.sh`, le banc unique (variables en plus : `MJPC_SORTIE`, `MJPC_BANCS`).

## Les bancs, ce que chacun vérifie (compté : nombre d'appels `ok(` dans le fichier)
| banc | ce qu'il vérifie | `ok(` |
|---|---|---|
| audit-affichage-p7 | trois tailles, colonnes ouvertes et repliées, cinq écrans : rien ne dépasse | 7 |
| test-p7-schema-envoi | les cinq formes (p7), « trop dense », l'écran d'envoi | 16 |
| test-p6-p7 | « Jouer en avance — répétition » | 15 |
| test-p5-p7 | « Ce que la diapo déclare » qui s'écrit | 28 |
| test-p4b-p7 | vidéo, document, page | 25 |
| test-p4a-p7 | les objets et leurs gardes | 28 |
| test-p3-p7 | le clic droit complet de l'atelier (dont « Couper la diapo ici ») | 27 |
| test-p2-p7 | écrire dans la diapo | 22 |
| test-p1-p7 | l'atelier, troisième onglet | 16 |
| test-g2-p7 | le faisceau | 17 |
| test-g1-p7 | l'oral | 15 |
| test-f-p7 | le chapitre | 8 |
| test-e-p7 | qui a participé | 9 |
| test-b5-p7 | le récit au fil de l'heure | 17 |
| test-b4-p7 | la préparation du cahier | 12 |
| test-b3-p7 | le guidage | 18 |
| test-d-p7 | le récit | 33 |
| test-c-p7 | les durées | 23 |
| test-b2-apercu-p7 | l'aperçu | 10 |
| test-b-p7 | l'alerte T-5 | 31 |
| test-cahier-p7 | le cahier de textes | 23 |
| test-a0-p7 | l'insertion : rien ne bouge | 10 |
| regression-p7 | la non-régression par titre et par le geste | 24 |
| tout-cliquer-p7 | tout cliquer, tout frapper, 0 erreur JS | 38 |
| **total** | | **532** |

## La sortie du banc unique
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt` (sortie complète de chaque banc, puis le résumé). En tête :
```
date : 2026-10-06 06:15:16 +0000
node : v22.22.0 · playwright : 1.56.1 · chromium : 141.0.7390.37
maquette jouée : ../../../TRANSCRIPTS/C12/pieces/T265-maquette-pilotage-ordi-v9c15p7-manipulable.html
md5 de la maquette jouée : 5045f337d930faaa9cb073e203cf44eb
bancs : 24
```
Résumé : **24 lignes « fin : 0 défaut(s) »**, puis « TOUS LES BANCS : 0 défaut », code de sortie 0.

## L'épreuve des bancs (addendum du 20/08, ④)
- La copie cassée : `epreuve/maquette-p7-cassee-sans-couper-la-diapo.html` (md5 `8d636475c27267b6b6ec12af58e8a68e`) = la p7 dont **une seule chose** est retirée : l'entrée « Couper la diapo ici » du menu du bloc (`{ a: 'b-couper-diapo', … }`).
- Le banc qui l'exerce : `test-p3-p7` (il lit le menu du bloc, puis clique l'entrée et vérifie la diapo « (suite) »).
- Sur la copie cassée : `sorties/epreuve-1-copie-cassee.txt` — le banc **échoue** (`page.click: Timeout … waiting for locator('#menu [data-a="b-couper-diapo"]')`, code 1), le banc unique dit « ÉCHEC », code 1.
- Sur la vraie maquette, juste après : `sorties/epreuve-2-vraie-maquette.txt` — « fin : 0 défaut(s) », « TOUS LES BANCS : 0 défaut », code 0.

## Les captures
Aucune capture livrée : p8-1 ne change pas la maquette, il n'y a rien à montrer à l'écran. Les 8 images que les bancs de la p7 écrivent d'eux-mêmes (`a0-apres-insertion.png`, `b2-apercu.png`, …) atterrissent bien dans `captures/` (et plus dans `vis/`), mais ce sont des sous-produits des bancs, pas des preuves : elles ne sont pas poussées (`.gitignore`), donc pas présentées comme regardées.

## Les défauts trouvés et corrigés
- Aucun dans la maquette. Dans les bancs : aucun (24 × 0 au premier passage).
- Un écart du banc unique de la n°12, constaté : il appelait `vis/test-p7.mjs`, alors que la pièce s'appelle `T265-test-p7-schema-envoi.mjs`. Le banc unique de p8-1 l'appelle par son vrai nom.

## Ce qui est simulé
Rien de nouveau. La maquette p7 garde ses simulations déclarées par la n°12.

## Ce qui reste
- p8-2 et p8-3, sur leurs branches.
- Les bancs de la n°12 posent encore leur état par appel de fonction à certains endroits (`ev(() => { S.aideFermee = true; tout(); })`, `etatDiapo().nDev = …`) : le mandat interdit de changer leurs vérifications en p8-1 ; je les ai laissés tels quels. Les bancs nouveaux de p8-2 et p8-3 passent par le geste.

## Les empreintes
`EMPREINTES.md5` : le md5 de chaque fichier de la livraison, contrôlé avant de pousser (`md5sum -c`).
