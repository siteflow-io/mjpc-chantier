# LA MAQUETTE « LA CLASSE » — le profil de classe, 26/10/2026 (conscience n°13)

- `la-classe.js` — le bloc ajouté à la fin du fichier de production 8.75.0-③ (md5 `83adc8decc16ee4c51b8a68e3ceaa285`) : la vue « la classe » telle que T1-T6 du `../CADRAGE-RELU.md` la décrivent. Rien du fichier n'est réécrit ; trois fonctions de l'EDT sont recouvertes (`edtCarteClic`, `edtPeindre` pour le mode `classe`, `edtLancer` en mode « Préparer »).
- `maquette-8.75.0-3-la-classe.html` — le fichier de production ③ + le bloc, avant le `</html>` final (md5 dans `captures/journal.txt`). Il ne montre rien sans hub : il se joue sur le faux hub.
- `capture.mjs` — le geste joué sur le faux hub (le dispositif d'E3, `banc-1226.mjs` : faux hub moins la trace du 07/09, horloge figée au lundi 14/09/2026 09:00, entrée par le site jusqu'au Pilotage) : heure 1 lancée, 14 ▶, close à 09:47 → l'EDT → la carte → la vue → un badge → les stats → une heure jouée → la semaine → la case du 15/09 → « ✎ Préparer » → « ▶ Ouvrir le pilotage et lancer ».
  `MJPC_HUB=AUDITS/INTEGRATION-DEROULE/hub MJPC_FONTS=LIVRAISONS/INTEGRATION/E3/outils/eb-garamond node MANDATS/PROFIL-CLASSE/maquette/capture.mjs <maquette.html> <captures/> [1366x768]` (fontes : sur `integration`).
- `captures/` — les neuf captures écran entier 1366 × 768 et `journal.txt` (ce que le geste a mesuré : la copie, les natures des heures, l'écriture du badge, « Où en est la classe » ouvert sans lancer, 0 erreur JS). Les mêmes sont en pièces `TRANSCRIPTS/C13/pieces/T179-*.png`.

Rebâtir la maquette : prendre `index.html` de production, insérer `<script>` + `la-classe.js` + `</script>` juste avant le `</html>` final.
