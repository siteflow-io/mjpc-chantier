# MANDAT V7 — LE BOUTON APRÈS LE CAHIER DE TEXTES · suite de `0d7211bba`

## 0 · L'erreur du mandat
- « Arriver sur la diapo Cahier de textes ouvre la fin de l'heure » : pas au faux hub. Mesuré par le geste (vraie heure et mode test, base `86e8a269`) : arrivé sur le cahier (0/4) puis dévoilé en entier (4/4), `S.enFin` reste faux, la colonne de fin d'heure fermée. Ce qui l'a ouverte dans le Chrome de Paul : je ne sais pas. La sonde l'ouvre donc par « Fin de l'heure » (`#bfin`), sur le cahier dévoilé.

## 1 · Ce qui est fait et prouvé (par le geste, faux hub du banc)
- Code (`dr/dr-classe.js`, `dr_enchVisible`, 1 condition retirée) : `S.enFin` ne cache plus le bouton. Le clic ne change pas.
- Sonde : la séance 1 finit comme la vraie (le bilan, ses trois blocs ; la mise en commun du bilan et le cahier de textes, posés par le site) — lu sur la page : `bilan,bilan-commun,fin`. Le cahier dévoilé 4/4, la fin de l'heure ouverte, le bouton doit paraître.
- Base `86e8a269`, vraie heure : **18/29** (`sorties/v7-vh-base-86e8a269.txt`) : fin de l'heure ouverte, bouton absent, rien n'enchaîne (le défaut de Paul).
- Après, assemblé `179766c8e84e25cbf3b0ee92b5b902ea` : vraie heure **29/29**, mode test **31/31**, répétition **14/14**, deux heures **29/29**, T-5 **24/24**, reprise (`MJPC_ROUV=1`) **36/36** (`sorties/v7-*-apres.txt`) ; le parcours P0-P12 **vert** (`sorties/v7-parcours.txt`).
