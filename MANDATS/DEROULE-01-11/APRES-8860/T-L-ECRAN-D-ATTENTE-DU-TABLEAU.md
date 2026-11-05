# MANDAT T — LE TABLEAU EN ATTENDANT UNE HEURE : LA MAQUETTE v3 VALIDÉE, DANS LE SITE
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base et la durée. Branche : `deroule/attente`, partie de `deroule/bilan` `048be4d1f` (= la production 8.87.0-⑳). **30 minutes au plus, le plus économe possible.***

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
Avant l'heure, le tableau projeté montre l'heure, la date, la classe attendue et son horaire en grand, sous « Cours de français - M. Meney » en or, sur un fond animé ; le site ne s'impose plus en titre.

## 1 · CE QUI EST DIT
- Paul, 05/11 09:09 : « le tableau, en attendant une heure, montre ce qu'il y a sur ma deuxième capture. le "monsieurjaipascompris" doit passer en bas au milieu, en plus petit, et à sa place, il faut mettre MJPC, et agrandir l'heure, la date et le nom de la classe attendue ainsi que l'horaire. Enfin, que coûterait le fait de faire une animation comme dans evaluation qcm? Montre moi une capture construite de ce que ça donnerait. »
- 09:15 : « OK c'est bien. Mets en dessous de MJPC "Cours de français - M. Meney ". »
- 09:20 : « Pour 793 j'attends la nouvelle mouture et il faut que l'animation soit plus franche et plus classy. Le CSS doit être moderner »
- 09:24 : « l'animation est fixe, ta vidéo montre une anim fixe. par ailleurs mjpc doit être pllus petit que cours de français etc. il faut intervertir leur taille de police. cours de français monsieur meney doit être en or avec un halo contrasté. l'heure doit être en surimpression le reste esrt correct »
- 09:30 : « C'est bon je valide. » (la maquette v3) — 16:31 : « Promeus la nouvelle vue tableau aussi »

## 2 · CE QUE TU FAIS
1. La maquette v3 validée est le code : `T-maquette/cap-attente-v3.mjs` (ce qu'elle écrit dans l'écran d'attente `#ses-tab-att` du vrai fichier : `apres`, son style, `#anim-calme`, la ligne, `#mjpc-bas`, « MJPC », « Cours de français - M. Meney »), sa capture `T-maquette/attente-avant-apres-v3.png` et sa vidéo `T-maquette/attente-animation-v3.mp4`. Tu l'écris dans le site (`LIVRAISONS/INTEGRATION/dr/*.js`, `dr.css`), sans rien y ajouter ni retirer. Les anneaux suivent le centre de l'heure (aussi quand la fenêtre change de taille). La police : celle du site au tableau (la maquette chargeait EB Garamond en local pour la capture seulement).
2. Rien d'autre ne change : l'écran d'attente n'écrit toujours rien (assemblé `6c47be89`, l. 21992 : « n'écrit jamais rien ») ; l'heure et la classe attendue restent à jour comme aujourd'hui ; dès qu'une heure se lance, l'écran d'attente s'en va comme aujourd'hui.
3. **La preuve, par le geste**, au faux hub : le tableau ouvert sans heure lancée → l'écran d'attente comme la capture v3 (capture de l'écran entier, à côté de la v3) ; l'animation bouge (écart moyen entre images mesuré, comme pour la v3 : 4,8) ; l'heure change à la minute ; 0 écriture au hub pendant l'attente (compté) ; une heure se lance → la diapo, inchangée. La fenêtre réduite puis agrandie : les anneaux restent sur l'heure.
4. Les sondes du banc qui lisent l'écran d'attente (cherche `ses-tab-att`, `ses-tab-h`, `ses-tab-c`, « monsieurjaipascompris ») : mises à jour dans ta branche si ce que tu changes les touche ; le parcours P0-P12 vert ; la sonde du bilan partie B verte.
