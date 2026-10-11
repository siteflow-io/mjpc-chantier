# Les objets de l'emploi du temps, relus au hub (11/10/2026, 08:11, conscience n°12)

Relus **en lecture seule** au hub (`/site/edt/<objet>/2026-2027`), pour le complément 2 de la maquette complète du QCM (https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2.md, §4).

Ils servent à la scène `m-emploi-du-temps` de la maquette. La scène montre les chiffres que le vrai écran affiche avec ces données, et la longueur réelle de chaque JSON sorti.

Il n'y a aucune donnée d'élève dans ces fichiers : seulement le calendrier de l'année, la grille de Paul (des noms de classes et de salles), les horaires, les périodes, les photos du prévu et les réglages.

## Les fichiers

| Objet | Fichier | Injecté le | `JSON.stringify(o, null, 1).length` |
| --- | --- | --- | --- |
| calendrier | `calendrier.json` | 2026-09-03 | 19 717 |
| grille | `grille.json` | 2026-09-03 | 9 273 |
| creneaux | `creneaux.json` | 2026-09-03 | 1 789 |
| periodes | `periodes.json` | 2026-09-04 | 533 |
| photos | `photos.json` | 2026-09-04 | 243 |
| reglages | `reglages.json` | 2026-09-04 | 77 |

Il n'y a pas d'objet `decisions` au hub pour 2026-2027 : le vrai écran ne montre donc pas son bouton.

Les md5 sont dans `md5.txt`.

## Les chiffres du vrai écran, recomptés sur ces données

- calendrier : 52 semaines · 7 périodes sans cours · 11 fériés · 30 jalons · 15 événements de classe ;
- grille : 30 cases ;
- créneaux : 8 créneaux, de 08:00-08:55 à 16:04-16:59.

Ce sont les chiffres de la capture de Paul du 11/10 (`TRANSCRIPTS/C12/pieces/T644-emploi-du-temps.png`). Les « 4 classes nommées » se recalculent avec la vraie fonction `edtNomsDeGrille` d'`index.html`.
