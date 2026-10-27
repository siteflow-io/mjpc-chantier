# L18 — toute la largeur (13 · 61) · E4 · 27/10/2026
*Base : la production **6.7.0-L17-1q3** (`correction_dictee.html` de `monsieurjaipascompris`, 1 011 698 o, md5 `9d5dcfb612a70a8182689566b1fe23c5`). → **6.7.0-L18** : 1 012 323 o, md5 `e032d0ac3ed20afe262557687f0631b6`. Rien n'est promu.*

## Ce que ça change pour la classe
Sur l'ordinateur de Paul, l'accueil « Mes dictées », la dictée ouverte (Pilotage, Données, Réglages) et la correction d'une copie (mode texte, mode rapide) prennent toute la largeur de l'écran, au lieu d'une colonne de 1 100 ou 1 300 px au milieu. Règle de Paul (26/10) : « On utilise toute la largeur et la hauteur de l'écran, tout le temps. » Côté élève, rien ne change (la tablette, la copie, les exercices : `.container`, 760 px, intact).

## Le changement (trois lignes)
- `.container-wide` (la dictée ouverte, `CorrScreen`) : `max-width:1300px` → `none`.
- `.container.corr-prof` (l'accueil, les écrans de correction du professeur) : `max-width:1100px` → `none`.
- 48 px de marge à droite sur ces deux cadres : le « ? » de l'aide est fixé en haut à droite (`.aide-btn`, 8 px du bord, 32 px de large) ; sans cette marge, il recouvrait le bouton 🔀 de l'en-tête d'une copie et touchait « ← Retour ».
- `APP_VERSION` : `6.7.0-L18`.
- **Un défaut révélé par la largeur, corrigé** (`deplacerL8`, mode texte au clavier) : ↑ et ↓ cherchent la ligne voisine, puis le mot le plus proche en x parmi ceux « à la même distance » — sans regarder le sens. Avec des lignes plus longues, ↑ choisissait un mot de la ligne d'en dessous (banc L8 : « haut » rouge, « fort » → ↓ « et » → ↑ partait encore vers le bas). Le sens est maintenant exigé aussi au second tri ; L8 est vert. Rien d'autre ne bouge dans ce geste.
Ni geste, ni texte, ni donnée ne change. Les fenêtres (popups, aide, prompt IA), la vue « élève miroir » du Suivi (800 px) et les fichiers exportés gardent leurs largeurs : ce ne sont pas des écrans de travail du professeur sur toute la page.

## Mesuré (`bancs/cap_l18.py`, le même parcours avant / après)
Douze écrans par taille : accueil, dictée ouverte, une copie en mode texte, en mode rapide, puis Préparation, Rapide, Bilan, Copies, Fiches élèves, Suivi, Exercices, Réglages.
- **Avant** (production) : le cadre fait 1 100 px (accueil, copie) ou 1 300 px (dictée ouverte), centré ; à 1707 px, 300 à 400 px vides de chaque côté.
- **Après** : le cadre fait la largeur de l'écran à 1366 × 768, 1536 × 743, 1707 × 743 et 1920 × 1080 ; **aucun défilement de côté** sur les 48 écrans ; zéro erreur de page, zéro accès au vrai hub.
- Captures (`captures/`) : `avant-*` et `apres-*` à 1707 × 743 et 1366 × 768, regardées.

## Bancs
- Le kit (`KITS/banc_dictee_kit_anonyme.zip`) et les bancs de toutes les livraisons L1 → L17-1q, rejoués par le banc unique (`bancs/lance.sh` : la liste de L17-1q, `FICHIER` = cette livrée).
- **`banc_L7_geste.py` accordé** : il exigeait un cadre de 1 100 px (décision du 01/10) ; il exige maintenant la largeur de l'écran (13 · 61), sans bouton qui dépasse de son cadre ni défilement de côté ; ses autres conditions (la phrase en mode rapide, les écrans élèves au pixel près contre la 6.6.3) sont inchangées. L'ancien est gardé au kit sous `banc_L7_geste_avant_L18.py`.
- **Banc unique (53 étapes) sur la L18 : 42 vertes, 11 rouges — les 11 rouges le sont à l'identique sur la production 6.7.0-L17-1q3, rejouée ici** (`sorties/prod/`) :
  - mêmes conditions rouges, sans lien avec la largeur : L11 (`eleve_feuille`), L12 (`rapide` : l'aide du mode rapide a gagné la ligne « C » depuis, le banc ne la connaît pas), L13 (`a_zero_mes_dictees`) ;
  - données absentes du sas (extraits réels du hub et PDF de Paul, jamais déposés) : L15e (`pdfs_paul/`), traitunion (`/tmp/dylan.json`), l17bis, l17bisb, l17bisc (`/tmp/hugo.json`…), 175, 177 (`/tmp/hugo2.json`…), trouvees (`/tmp/franklin2.json`). Ils ne peuvent tourner qu'avec ces fichiers, chez la conscience.
  - Vertes, entre autres : modes, fuzz texte (5 + 4 copies, 0 bug), fuzz rapide (3 copies, 0 bug), grille, L1 → L10, L7 accordé, L8 (après le correctif ↑), L14, L15*, L16a, L171, revient, la vue élève (identique à la référence).
- Sorties : `sorties/l18/` (le banc unique entier), `sorties/prod/` (les 12 étapes rouges rejouées sur la production ; L151b1 y est verte une fois son fichier `cesure_relue_L151.json` posé, sur les deux).
