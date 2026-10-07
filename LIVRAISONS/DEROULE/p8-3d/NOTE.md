# p8-3d — la carte de démonstration qui tient
*Exécutant, session cloud de Claude Code, 07/10/2026. Complément `MANDATS/COMPLEMENT-DEROULE-P8-3d.md` (C13, tour 28), lu après le mandat `MANDATS/MANDAT-DEROULE-MAQUETTE-P8.md` (version 3) et les compléments p8-3b et p8-3c. Branche `deroule/p8-3d`, partie de `deroule/p8-3c`.*

## Ce que ça change pour la classe
La diapo de démonstration « consigne d'une ligne, puis un schéma » (« Les mouvements du siècle (suite) », diapo 7 de l'heure 2) se lit du fond de la classe. Sa carte porte maintenant **« Figures d'analogie » + « Figures d'amplification »**, avec leurs notions telles qu'elles sont dans la vraie carte : personnification, comparaison, métaphore, allégorie ; hyperbole, accumulation, gradation. Elle mesure **0 · 0 · 0 · 0 · 0**, dans l'atelier et au tableau.

## La base et son md5
- Base : le gabarit livré en p8-3c, md5 `65d123c91a7c99aaa99e44df9f212969`.
- `regen.sh` refait toute la chaîne : p7 → p8-2 → p8-3 → p8-3b → p8-3c → **p8-3d** → générateur `T159`. Avant d'appliquer p8-3d, il vérifie octet pour octet les gabarits p8-2, p8-3, p8-3b et p8-3c livrés. Sa sortie est dans `sorties/regen.txt`.

## Ce qui a été modifié, compté
- `patch-p8-3d.py` fait **un seul remplacement**, exigé une fois : la source (`src`) du schéma de la simulation `e-sim-schema-plausible` (209 → 277 o).
- Rien d'autre ne change sur la diapo : sa consigne d'une ligne, son titre, sa place, sa durée (4 min), son réglage « Tout ensemble ».
- Aucune fonction n'est touchée.

## Les bancs, comptés
- `test-p8-3c` (26 `ok(`), sans changement : 0 défaut. Sa vérification « la diapo « consigne d'une ligne + schéma » tient lisible » passe : 0 · 0 · 0 · 0 · 0 dans l'atelier, et 0 · 0 · 0 · 0 · 0 au tableau.
- **Recalé** : `test-p7-schema-envoi` (13 `ok(`). Le premier schéma de la trame est la carte de démonstration ; elle a maintenant 10 bulles au lieu de 14 (le centre, 2 familles, 7 notions). Trois vérifications changent, une dans l'atelier, une au pilote, une au tableau ; chacune est marquée « recalé en p8-3d ».
- Les 25 autres bancs sont inchangés.

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`
- Lancé le 2026-10-07 à 12:31 UTC : node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37.
- Maquette jouée : md5 `2494e13cd7290c771da6bd1a3971a296`.
- **27 bancs, 27 × « fin : 0 défaut(s) », « TOUS LES BANCS : 0 défaut ».**

## La capture (regardée, écran entier)
`captures/p8-3d-diapo-plausible.png` : la diapo juste après le geste « + bloc → Schéma… » sur la diapo 6 (d'où la notice en bas).
- La consigne d'une ligne est en haut, la carte au-dessous, dans le cadre.
- Aucune bulle n'en chevauche une autre, et chaque trait va de sa famille à sa notion.
- « Sur la forme » ne signale rien pour cette diapo.

## Les défauts trouvés et corrigés
Aucun.

## Ce qui est simulé
La diapo de démonstration (`e-sim-schema-plausible`, déclarée en p8-3c), avec sa nouvelle carte ; la vraie carte en H2 ; `tableau-double` et la page sans contrat (p4a).

## Ce qui reste
L'import et son refus : mandat de production. La suite : p8-4, puis p8-5.

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `2494e13cd7290c771da6bd1a3971a296`
- gabarit `v9c15p8-template.html` : `91dfc216485ff7e778998ed91fed9a05`
- tous les fichiers livrés : `EMPREINTES.md5`, vérifié par `md5sum -c` avant l'envoi.
