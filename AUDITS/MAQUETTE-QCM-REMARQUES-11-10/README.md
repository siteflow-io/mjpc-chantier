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

## 5. Les bulles « i » (ajout de 14:25, tour 653 : la capture de Paul, `TRANSCRIPTS/C12/pieces/T653-infobulle-coupee.png`)

On a survolé, par le geste, les 365 bulles « i » (`.info-i` / `.info-tip`) de toutes les scènes, à 1366 × 768 (`scripts/bulles-i.js`, `sorties/info-i-v7.txt`).

- **5 sortent de leur bulle** : « 📚 Chapitre » et les quatre « 🎯 Ce qu'elle vérifie » de `x627-3-editeur`, ce que montre la capture de Paul.
  - La cause (`scripts/bulle-nowrap.js`) : l'étiquette `.ed-lbl`, une classe de la maquette, porte `white-space: nowrap`, et la bulle en hérite.
  - Le texte de 269 caractères tient alors sur une ligne, qui sort de la bulle noire de 280 × 42 px et s'écrit en blanc sur la page.
- **30 sont coupées par le bord de la fenêtre.** Par exemple, la bulle de « Classe » de « Lancer une nouvelle session » perd sa première lettre (`sorties/bulle-classe-coupee-c-lancer.png`) ; « Mode » et « 📋 Toutes les questions » sont coupées aussi.
- **13 sont coupées en bas.**
- Les 94 relevés « ne s'ouvre pas » sont des bulles derrière une fenêtre ouverte de la scène. Ce n'est pas un défaut : deux sont vérifiés, `c-voir-tablette` et `c-appel`.

Je ne sais pas si la 7.7.1 coupe aussi la bulle de « Classe » : cela n'a pas été mesuré.
