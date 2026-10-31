# COMPLÉMENT — RECOPIE : LES POIGNÉES SE PLACENT SEULES (marge rouge, bord de la copie)

Conscience n°14, 31/10/2026 07:02. Pour C15 (GPT), sur la 1.3.0-RU en ligne (production `380d5c9`).

## Ce que ça change pour la classe
Paul n'a plus à recaler chaque ligne à la main avant de recopier : il tape tout de suite.

## L'exigence de Paul (31/10 07:00), mot pour mot
« il faudrait que les points s'alignent toujours juste avant la marge rouge à gauche, et aillent au bord de la copie, à droite. De manière automatique. »

## Mesuré au site (lecture seule, la première page recopiée par Paul sur une copie réelle ; aucune donnée d'élève ici)
31 lignes trouvées seules, 23 recopiées. Poignée gauche : trouvée seule entre 0,020 et 0,230 de la largeur ; Paul l'a déplacée à la main sur 20 des 23 lignes, entre 0,209 et 0,224 (juste avant la marge rouge ; la valeur baisse du haut vers le bas : la marge penche sur la photo). Poignée droite : trouvée seule entre 0,939 et 0,969 ; Paul en a poussé 3 au bord, à 0,995.

## À coder (dans `recopie.js`, sans toucher aux lignes déjà recalées par Paul)
1. Sur chaque page, chercher la marge rouge dans la photo (un trait vertical rouge sur presque toute la hauteur ; elle peut pencher : sa position se prend à la hauteur de chaque ligne).
2. À la détection des lignes, la poignée gauche se pose juste avant cette marge, la poignée droite au bord de la copie.
3. Si aucune marge rouge n'est trouvée sur une page : le dire à l'écran, en clair, et garder le placement actuel. Taux de réussite sur les vraies photos : je ne sais pas (les photos ne sont que dans le navigateur de Paul).
4. Une ligne que Paul a déjà déplacée ne bouge plus jamais seule ; les pages déjà recopiées restent telles quelles.

## Banc
Page inventée avec une marge rouge qui penche et une copie plus étroite que la photo : poignées gauches juste avant la marge à chaque hauteur, poignées droites au bord ; page sans marge : message et placement actuel ; une ligne déplacée à la main ne bouge pas au rechargement. Banc complet 0 défaut, livraison sur une branche du sas ; la n°14 vérifie au vrai site en lecture seule et met en ligne sur le « promeus » de Paul.
