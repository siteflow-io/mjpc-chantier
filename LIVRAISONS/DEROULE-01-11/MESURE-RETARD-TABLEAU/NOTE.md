# MANDAT O — LE RETARD DU TABLEAU (mesure seulement, aucune ligne du site ne change)
Base `1a60c142b` (assemblé md5 `fd014e542fc12f4f8f99904dc5d36694`), faux hub rangé comme le vrai avec son flux, une vraie heure, montres du navigateur.
Sonde : `sonde-retard-tableau.mjs` (harnais de FRAPPE-TABLEAU). Sorties : `sorties/sonde-retard-tableau-n3.txt` (3 fois chaque geste, arrêtée à la limite des 20 minutes), `sorties/sonde-retard-tableau-essai.txt` (1 fois, premier essai, filtre du bruit moins strict).
Mesure : du dernier événement réel du pilote à la première modification de la page du tableau (l'image suit à la trame suivante, ≤ 17 ms).

| Geste | Fenêtre du tableau : médiane / plus long | Tableau distant : médiane / plus long | Fois |
|---|---|---|---|
| diapo suivante (clic sur la vignette) | 46 / 62 ms | 74 / 79 ms | 3 |
| diapo précédente (clic sur la vignette) | 55 / 56 ms | 83 / 103 ms | 3 |
| ▶ dévoiler | 42 / 71 ms | 71 / 114 ms | 3 |
| chrono « au tableau » | 14 / 15 ms | 20 / 26 ms | 2 |
| chrono ▶ lancer | 138 ms (1 vu, 1 non vu) ; essai : 479 ms | 51 ms (1 vu, 1 non vu) ; essai : 492 ms | je ne sais pas |
| chrono glisser, redimensionner | non vu (2 sur 2) ; essai : 21 ms, 6 ms | 28 ms (1 vu) ; essai : 28 ms, 13 ms | je ne sais pas |
| geler, dégeler, écrire un mot, surligner, une réponse validée | non mesuré (la sonde ne voyait pas l'effet : à reprendre) | non mesuré | 0 |

Au-delà de 500 ms : aucun geste mesuré. La ligne qui attend : sans objet pour ce qui est mesuré.
Vu dans le code (pas mesuré) : la fenêtre reçoit l'état par `postMessage` direct (`dr/dr-tableau.js` l. 78) ; le distant par la scène au hub, après le débounce de 250 ms de `dr_sceneAuto` (`dr/dr-tableau.js` l. 185), et pour la copie jouée par la veille d'une seconde puis 1100 ms (`dr/dr-tableau.js` l. 292).
