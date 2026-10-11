# Les remarques de Paul sur la maquette v7 — mesures (11/10/2026, 14:04, conscience n°12)

Maquette mesurée : `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v7.html` (md5 `6be84ea1fb636017ce7225bfa3556082`), sur les 109 scènes des vues de Paul (console, téléphone, MJPC).

## 1. Les textes explicatifs (`scripts/textes.js`, `sorties/textes-neufs.txt`)

On a relevé chaque texte visible d'au moins 70 caractères, puis on l'a cherché dans les sources du site d'aujourd'hui (`evaluation-qcm.html`, `index.html`, `correction_dictee.html`, dépliées par `scripts/corpus.py`).

Résultat : **241 textes longs, dont 220 absents du site d'aujourd'hui.**

- La plupart sont des données ou des états : énoncés, noms, notes, alertes, erreurs de collage, commentaires, PDF.
- Une soixantaine, comptés à la lecture, sont des explications de règles écrites pour la validation. Par exemple :
  - « Tant qu'elle n'est pas terminée, cette séance ne compte pas comme « QCM précédent » pour les binômes. » ;
  - « Elle vaut dans les deux sens, et pour toutes les apps qui partagent une tablette… » ;
  - « Les listes d'élèves, leurs codes, leurs aménagements et leurs exclusions appartiennent au site MJPC… ».

## 2. Les infobulles (`scripts/bulles.js`, `sorties/bulles-v7.txt`)

Pour chaque élément visible, on a regardé si le survol atteint une infobulle (l'élément ou un parent qui porte `title`) :
- **gestes** (boutons, champs, menus, liens, cases) : 4 893, dont **269 sans infobulle** ;
- **affichages** (pastilles, compteurs, phases, chronos, états, en-têtes de tableau) : 1 095, dont **866 sans infobulle**. Les plus fréquents sont les niveaux de maîtrise, « MODE PROF », la difficulté, « TEMPS DE RÉFLEXION » et les phases.

## 3. La liste des évaluations

`correction_dictee.html` (l. 3460-3466) montre toujours les quatre niveaux, même vides (« vide pour l'instant »), et chaque dictée y dit sa classe (`d.classeLisible`).

La maquette (`c-evals`, capture 1) n'affiche que les niveaux qui ont une évaluation (« 3e », « Sans chapitre »). Elle s'écarte donc du point 465 du cadrage, qui demandait les évaluations rangées « comme dans la correction de dictée ».

## 4. Le niveau d'une évaluation

Une évaluation déclare son chapitre de MJPC (points 316, 317 ; le prompt, `{{CHAPITRE}}`), et ce chapitre porte son niveau. La maquette affiche « 3e · Ch. 1 » et range l'évaluation sous « 3e ».

Dans `index.html`, une évaluation QCM se lie à un chapitre comme une dictée : par 🔗 en mode admin (l. 4295-4310, l. 3806). Les 7 évaluations du hub n'ont pas de chapitre : elles sont « Sans chapitre ».
