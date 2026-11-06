# MANDAT W — LES ABSENTS DE L'HEURE · partie de `deroule/enchainer` `f22d321ae` (8.89.1-㉓)

## 0 · Ce qui a changé en route
- Paul, 07:04 : « uniquement la modif des absents ». La partie 1 (le retour au cahier de textes) arrêtée avant toute mesure : rien de mesuré, rien gardé.

## 1 · Le code (3 lignes)
- `dr/dr-socle.js` : `dr_segDeLHeure(x, h)` (un segment de l'appel compte pour l'heure `h`, par défaut `S.heure` ; un segment sans `heure` compte comme celle-ci) ; `absentA` ne lit que les segments de l'heure en cours.
- `dr/dr-classe.js` : le contrôle du cahier (étape 5, « le mot aux absents (n) ») et « Un mot pour les absents » de la clôture : les élèves qui ont un segment À CETTE HEURE (avant : à n'importe quelle heure de la séance).
- Le récit n'est pas touché (il lisait déjà `x.heure === h`).

## 2 · La preuve (par le geste, `sonde-absents-heure.mjs`, partie W ; une séance en deux heures : l'heure 1 le 14/09, l'heure 2 le 15/09)
- ÉLÈVE 3 absent au clic droit à l'heure 1 ; ÉLÈVE 5 absent au clic droit à l'heure 2.
- Base `179766c8`, à l'heure 2 (vraie heure et mode test) : ÉLÈVE 3 barré (28/29 présents), ses initiales disent « absent », rien n'est posé ; l'étape 5 compte 2 absents (`sorties/w-base-179766c8.txt`).
- Après `be78a5a79d4150f6445636b9139386fa`, à l'heure 2 (vraie heure et mode test) : ÉLÈVE 3 pas barré (29/29), sa prise de parole posée ; ÉLÈVE 5 barré (28/29) ; l'étape 5 compte 1 absent ; l'heure 1 inchangée (ÉLÈVE 3 barré, « Un mot pour les absents » : lui seul) (`sorties/w-apres-be78a5a7.txt`).
- La sonde de l'enchaînement en vraie heure, après : 29/29.

## 3 · Ce qui reste rouge dans la sonde (pareil base et après : la sonde, pas le code)
- À l'heure 2, la liste écrite de « Un mot pour les absents » n'est pas lue par la sonde (le compte de l'étape 5 l'est : 1).
- « Relire cette heure » : la Relecture lue ne contient ni « L'appel » ni « Le mot pour chaque absent » (base comme après) — la sonde ne lit pas le bon endroit.
- Le faux hub de cette sonde refuse l'écriture `…/absentsPar/<élève>/<appareil>` (HTTP 400), base comme après.
- Pas passés : l'appel (étape 15), le parcours P0-P12.
