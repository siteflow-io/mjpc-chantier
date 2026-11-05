# MANDAT S6 — LA DIAPO DES CONSIGNES DU BILAN, COMME LE DESSIN ACQUIS — POUR DEMAIN
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base et la durée. Branche : `deroule/bilan` (tu continues `e94569839`). **20 minutes au plus, le plus économe possible.***

## 0 · CE QUI EST DIT
- Paul, 10:31 : « B est bien. Par ailleurs montre la diapo des consignes aussi, au fur et à mesure de la sélection ».
- C16, 810 (10:32), avec le dessin `scratchpad/cap-attente/bilan-consignes-au-fur-et-a-mesure.png` (joint au sas : `MANDATS/DEROULE-01-11/APRES-8860/S6-dessin-acquis.png`) : « la diapo des consignes du bilan telle que 🅱️ l'ouvre, à chaque Alt + B : au départ 0 / 5 ; puis le point 1, le 2, le 3 se cochent, avec la même marque et la même pastille que dans la mise en commun, et le compteur suit des deux côtés. »
- Paul, 10:37 : « Tout est ok. »
- Mesuré par la conscience sur l'assemblé `6c47be89` (capture `bilan-3-consignes-ouvertes-tableau`) : la diapo du bilan, ouverte par 🅱️ à 4 / 4, montre des ☑ simples ; ni la marque or, ni la pastille, ni le compteur. Ça ne va pas.

## 1 · CE QUE TU FAIS
1. Dans la diapo « Le bilan », un point coché porte la marque B (la même que dans la mise en commun : or `#ffc93c`, texte `#2a1a00`, trait `inset 0 -.18em 0 #e0a000`, coins arrondis) et, à la fin, la pastille verte `#1f6f4a` avec son numéro ; la case cochée comme sur le dessin (carré vert plein, coche blanche), la case vide comme sur le dessin. Décoché (à la main ou par 0, « Annuler »), la marque et la pastille s'en vont. Au tableau et au pilotage.
2. Le compteur « n / N » en haut à droite de la diapo du bilan, le même que sur la mise en commun, dès que la mise en commun de cette heure a été atteinte (au départ 0 / N) ; avant (les élèves rédigent au brouillon), la diapo du bilan reste telle qu'elle est.
3. Rien d'autre ne change.
Supposition forte (à mesurer avant d'agir), lignes de l'assemblé `6c47be89` : la diapo se dessine l. 18187 (`li.dr-bco` / `dr-bco on`, la case du point) et l. 18202 (`dr-bcompte`, aujourd'hui seulement pour `bilan-commun`) ; l'état vient de `dr_bEt` l. 21784-21785 (`bCoches` pour le bilan, `bCompte` pour la mise en commun) ; le style l. 16777-16781.
La sonde `LIVRAISONS/DEROULE-01-11/BILAN/sonde-bilan.mjs` lit ce que tu changes : ajoute à la partie B, par le geste, au tableau et au pilotage, en vraie heure, en mode test et en répétition : la marque et la pastille sur chaque point coché de la diapo du bilan (0 → n), parties à la décoche ; le compteur sur la diapo du bilan après la mise en commun, absent avant. Ses quatre captures refaites (`MJPC_CAPT`). La partie B en vraie heure, en mode test et en répétition verte ; W, le parcours, la case et le gel verts.
