# Audit final — le complément 2 de la maquette complète du QCM (11/10/2026, conscience n°12)

Branche auditée : `maquette-qcm` du sas (commit `c6611fb3`, 11/10 06:50 UTC). Elle fusionne `main` à 06:19 UTC, après la mise à jour du complément (08:15 à Paris) : l'exécutant a donc lu le complément complet.

Complément : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-2.md.

Livraison : `MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v7.html` (md5 `6be84ea1fb636017ce7225bfa3556082`, vérifié), 169 scènes, et `livret-maquette-qcm-v7.pdf` (170 pages).

## Verdict : ça va

Tout ce que le complément demandait est fait, et cela a été vérifié ici par des relevés indépendants du banc de l'exécutant.

Son banc, rejoué ici, passe : **19 222 vérifications, 0 échec** (`sorties/banc-audit-v7.txt`).

La maquette peut aller à Paul pour validation, sur le livret.

## Ce qui a été vérifié

- **Le périmètre.** La branche n'écrit que dans `MANDATS/MAQUETTE-QCM-COMPLETE/`, hors la fusion de `main`. Les v1 à v6 sont intactes, avec leurs md5.
- **Défaut 7, les boutons fermés de MJPC** (`scripts/mjpc.js`, `scripts/survol.js`, `scripts/grises.js`) :
  - dans les 12 scènes `m-…`, aux trois tailles, chaque bouton fermé a une opacité de 0,45 et le curseur barré, et sa raison se lit au survol ;
  - dans `m-emploi-du-temps-un` et `-tous`, le message de la copie est ouvert par-dessus la page : c'est la vraie fenêtre d'`atInfo`, et ce n'est pas un défaut ;
  - sur les 169 scènes, les seuls boutons fermés à pleine opacité sont des états d'élève validés : le clic figé de B, les cartes de « Mes évaluations » en relecture, les coches faites (`sorties/grises-v7.txt`).
- **Dette 87.** Le panneau touche les quatre bords de la fenêtre (0, 0, 0, 0) dans les 12 scènes `m-…`, à 1366 × 768, 1536 × 864 et 1920 × 1080, sans défilement de côté (`sorties/mjpc-v7.txt`).
- **Dette 88.** Sur les 25 lignes de « Élèves & codes », ↻ ✕ sont dans la carte, à 4 px au plus de la ligne du nom, aux trois tailles.
- **La rangée de l'emploi du temps (n°12 · 212)** :
  - aux trois tailles, il n'y a ni défilement de côté, ni bouton sur plus de deux lignes ;
  - les lignes d'état disent « 52 semaines · 7 périodes sans cours · 11 fériés · 30 jalons · 15 événements de classe », « 30 cases · 4 classes nommées » et les 8 créneaux, comme la capture de Paul ;
  - les messages des copies ont été recalculés ici sur les données relues au hub (md5 vérifiés) : 19 717 caractères pour le calendrier seul, 33 349 pour les six objets ;
  - captures 162 et 153 regardées.
- **Les écarts avec le vrai MJPC** (`banc/existant/ecarts-mjpc.json`, 18) : chacun porte sa raison, un point du cadrage, une dette ou la simulation déclarée.
- **Les 8 nouveaux retraits** sont les boutons de l'ancienne rangée de l'emploi du temps, retirés au titre du point 714.
- **Les gardes 6, 7 et 8**, jouées sur la v6 et sur les témoins, trouvent chacune leur défaut connu (`sorties/gardes-6-7-8-sur-v6.txt` de la livraison).
- **Le méta et les soulignés** sur les 169 scènes, cadres compris : aucun renvoi au cadrage (les lignes relevées sont des faux positifs connus) et 0 souligné.

## À signaler à Paul pour sa validation

1. La rangée de l'emploi du temps suit le tranchage de la conscience entre ses trois voies (point 714) : trois groupes et un sélecteur. Paul le valide ou le corrige sur la capture.
2. Le titre du premier groupe, « 📅 L'écran de la semaine », vient de l'exécutant, tiré d'un commentaire du code d'`index.html` (l. 20039) : ce n'est pas un texte que le vrai site affiche aujourd'hui.

## Ajout du 11/10, 13:15 (tour 646, Paul : « Vérifie ») : les quatre tests du tour 645, joués par la conscience

Les quatre tests (points 721 à 724) ont été joués **par le geste** dans Chromium, comme Paul les ferait : clic sur ⚙, choix de l'écran dans le sommaire, cases, boutons, survol à la souris, puis taille de la fenêtre changée sans recharger. Script : `scripts/tests-645.js`. Sortie : `tests/tests-645-joues.txt`.

Résultat : **12 vérifications, 0 échec.**
- Test 1 : « ⤓ Sortir les JSON cochés » est fermé tant que rien n'est coché ; avec « Calendrier de l'année » coché, le message est « JSON de « calendrier » copié — 19717 caractères. ».
- Test 2 : avec « Tout cocher », le message porte sur les six objets, 33349 caractères.
- Test 3 : sous la souris, « Tableau de bord » est à l'opacité 0,45, le curseur est barré, et la raison est « Inchangé : cet écran reste celui d'aujourd'hui. ».
- Test 4 : à 1920 × 1080, 1366 × 768, 1280 × 720, 1100 × 700 et 1536 × 864, le panneau touche les quatre bords et ↻ ✕ sont dans la carte sur les 25 lignes. Il n'y a aucun défilement de côté.

Captures : `tests/test1-calendrier.png`, `test2-tous.png`, `test3-survol.png`, `test4-1366.png`.

Le bouton ⚙ de la maquette, fixe en bas à droite, ne recouvre aucun bouton ni aucun champ du panneau. C'est vérifié à toutes les positions du défilement, dans 10 scènes `m-…`, aux trois tailles de la console (`scripts/gear-recouvrement.js`, `tests/gear-recouvre.txt`).

Depuis l'audit, rien n'a bougé sur la branche `maquette-qcm` ni dans `index.html` (md5 `ac792b28…`). La conscience n°13 a écrit au registre de la production (`e123dc5`, `5d48b91`) et au sas, mais elle n'a fait qu'ajouter des lignes : les entrées n°12 · 87, 88 et 212 sont intactes.
