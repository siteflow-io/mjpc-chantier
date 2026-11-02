# redaction 1.4.21-RU — candidate du 02/11/2026 (conscience n°14)

*Sur le mot de Paul (02/11, 06:48 : « en fait il n'y a plus la bande, je ne vois plus la copie de [l'élève], c'est ça le problème » ; 06:59 : « ok » à C14 626). Rien n'est en ligne : la mise en ligne attend son promeus.*

- Fichier : `redaction-1.4.21-RU-candidat.html`, 873 001 o, md5 `19d8d706c69b70a16f61f71b067b3f18`. Base en ligne : 1.4.20-RU, md5 `cca2b54a64a3921bfe5403054e8af17c`.
- Maquette et bancs : branche `c14-poignees`, commit `9547e06b`.

## Ce que ça change pour Paul
- **626 — la copie dans la bande, sur un sticker de toute la lettre.** Jusqu'ici, un sticker de toute la lettre vidait la bande (il n'a pas de place dans la copie). Maintenant la bande montre toute la copie : ses lignes bout à bout, depuis la première, chacune entière, sans cadre. ← → la font défiler ligne par ligne. Les touches sous la carte le disent ; l'aide « ? » de la bande aussi.

## Les preuves
- Banc complet : **148 vérifications, 0 défaut** (une nouvelle : sur le sticker S38 de toute la lettre, la bande montre la copie depuis sa ligne 1, ses 4 lignes avec leur photo ; → → va à la ligne 3, ← à la ligne 2, la bande change à chaque fois ; les touches le disent).
- Vrai site, en lecture seule (écritures interceptées), sur la copie de la 3 Dylan Bob qui a montré le défaut : sur S21 bis, la bande montre ses 29 lignes (sans photo dans ce navigateur : leurs places) ; → → ligne 3, ← ligne 2 ; aucune erreur.
- Le code changé : `rcBandeLettre` (nouvelle), `stBandeCarte` (appelle `rcBandeLettre` au lieu de vider la bande), `rcBandeClavier` (← → sur un sticker de toute la lettre), `RU_AIDES.bande`. Rien d'autre.

## Capture
- `captures-1.4.21/apres-626-toute-la-lettre.png` (maquette, élèves inventés). L'avant : la capture de Paul, 06:44 (une vraie copie : jamais au sas).
