# Moteur deroule89 — état officiel du 21/08/2026 (conscience n°8)

Trois correctifs versionnés depuis deroule86 (base intacte par ailleurs, non-régression prouvée à chaque pas) :

**87 — le « neuf » des blocs visuels.** `neuf` (« jamais montré à la classe ») ne tombait
que sur l'édition des champs texte : un schéma/une image, édités par le panneau, restaient
brouillons À VIE (grisés au pilote, jamais projetés au tableau, drapeau gravé dans la trame).
→ éditer un bloc visuel par le panneau (`majB`) lève `neuf`.

**88 — les boutons selon la liste validée par Paul.** Plus rien ne disparaît selon le type
d'écran : l'inapplicable se grise avec infobulle (`outilsDuRegime` réécrit, CSS `.off`).
Ids fantômes `bgras`/`bsoul` réparés (le masquage des G/S ratait depuis l'origine).
« Un seul visuel par écran » : `+ Schéma`/`+ Image` grisés si l'écran en porte un.

**89 — le filet « suite vide » réparé en trois points.** ① `lire()` ne tue `neuf` qu'à
l'écriture RÉELLE (avant : la simple existence du champ suffisait) ; ② les fragments de
`scinde()` transmettent `neuf` (le morceau reporté restait « fini ») ; ③ la vacuité compte
`src`/`ref` (un schéma plein comptait pour du vide). Le confirm natif ne joue plus que pour
une suite réellement vidée. Reproduit depuis la vidéo de Paul (schéma + consigne sur une suite).

md5 deroule89.html : 8c78b33a504a25b4d4a7582a05156682
Ces trois lots sont scellés dans les livraisons (bac à sable et production-PONT).
deroule86.html reste pour histoire et témoin.
