# JOURNAL — L18 largeur (13 · 61) · E4 · branche `l18-largeur`

## 27/10 20:50 (Paris) · poussée 1 — la livrée, ses bancs, ses captures
- **Mission 0** (relance 19:40 relue contre la production) : la colonne mesurée est de **1 100 px** (accueil `corr-prof`, copie) et de **1 300 px** (dictée ouverte, `container-wide`) — pas « environ 1 270 » ; c'est le 1 300 moins les marges. Les écrans élèves sont sur `.container` (760 px) : rien n'y touche.
- Le changement : deux `max-width` à `none`, 48 px à droite pour le « ? » de l'aide, `APP_VERSION` 6.7.0-L18 ; un défaut révélé par la pleine largeur, corrigé (↑ dans `deplacerL8`). Détail et mesures : `NOTE.md`.
- Mesures (`bancs/cap_l18.py`, 12 écrans × 4 tailles) : cadre = largeur de l'écran à 1366, 1536, 1707, 1920 ; aucun défilement de côté ; zéro erreur ; zéro accès au hub. Captures avant / après à 1707 × 743 et 1366 × 768, regardées.
- Banc unique : **42 / 53 vertes ; les 11 rouges sont rouges à l'identique sur la production** (3 conditions anciennes, 8 données hors sas) — rien de rouge n'est dû à la L18. `banc_L7_geste.py` accordé (la largeur de l'écran au lieu de 1 100 px).
- `correction_dictee.html` : 1 012 323 o, md5 e032d0ac3ed20afe262557687f0631b6. Rien n'est promu.

**L18 largeur fini (457140d59)** — 27/10 20:50 (Paris) · branche `l18-largeur`.
