# DICTÉE — L'ÉCRAN DE CORRECTION · L12 — l'aide « ? » qui suit l'écran

*Exécutant des compléments L9-L11-L12, livraison L12. Rien n'est promu.*

## Ce que ça change pour toi
- **La touche « ? »** ouvre l'aide partout côté professeur — sauf quand le curseur est dans une case de saisie : là, « ? » s'écrit. **F1** l'ouvre partout, case ou pas (l'aide du navigateur ne s'ouvre pas). **Échap** la ferme — et seulement elle : une case ou un menu ouvert dessous reste ouvert (une fenêtre à la fois). Un second « ? » / F1 la ferme aussi. **Tant qu'elle est ouverte, aucune touche ne passe à l'écran dessous** (G n'y pose rien).
- **« i » seul fait Illisible** en mode rapide : l'alias « ? » d'Illisible est retiré (le code et la ligne d'aide du mode rapide : « i = illisible … ? (ou F1) = l'aide »).
- **Le bouton « ? » rond, en haut à droite, sur tous les écrans du professeur** : l'accueil, l'écran d'une dictée (tous ses onglets), l'écran d'une copie (texte et rapide) — toujours au même endroit, au-dessus de tout. L'ancien « ? » de la barre (« Aide et nouveautés ») est remplacé par lui.
- **« Ce que tu peux faire ici »** : le nom de l'endroit et le tableau touche → ce qu'elle fait, **seulement les gestes possibles là** ; elle **change toute seule** quand l'écran change. Les endroits : l'accueil · la grille · le mode texte, menu fermé (avec le bandeau d'une copie effacée quand il est là) · menu ouvert · la case « ce qu'a écrit l'élève » · le mode rapide sur un mot · la fin de copie · Préparation · la version aménagée · les formes acceptées · Réglages · Données. Les lignes de L9 (la date, le bandeau) et de L11 (le bouton « forme acceptée », « accepter ici », Préparation, Réglages) y sont. Un second onglet **« Nouveautés »** garde l'ancien panneau.
- **Chaque ligne vient du code** (rien d'inventé) ; **règle pour la suite** : toute livraison qui ajoute ou change un geste ajoute ou corrige sa ligne (`AIDES`, dans le fichier).

## Défauts trouvés en route, réglés ici
1. Sur l'écran d'une copie, la grille n'est plus dessous : l'aide disparaissait avec elle — l'écran de la copie la porte désormais.
2. L'aide ouverte au-dessus de la case : Échap fermait aussi la case (une autre écoute de la fenêtre passait avant) — l'aide arrête désormais la touche avant tout le reste.

## Mesuré au passage
Cocher « Paramétrer une version aménagée » ramène à l'onglet Correction (c'est l'existant ; je ne l'ai pas changé).

## Le fichier
- Base **6.7.0-L11 en ligne** (795 799 o, md5 `fe8f030b0f402f0cb8bcf031d91799bb`, vérifiée à la commande) → **6.7.0-L12** : **809,581 o** (+13,782), md5 `89a82a824077066e82823dda85353cfe`.
- Ajoutés : `AIDE`, `aidePoser`, `aideContexte`, `useAide`, `AIDES` (les contenus), `lignesAide`, `AideContextuelle` ; `useAide` dans `CorrScreen` (l'onglet), `CorrEleve` (l'état de la copie) et `EditionDictee` (ses sous-écrans) ; le bouton sur l'accueil, l'écran de la dictée et l'écran de la copie ; le « ? » de la barre retiré ; « ? » retiré d'Illisible ; la ligne d'aide du mode rapide. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L12_geste.py`** (par le geste, 15 vérifications) : l'accueil (« ? », le bouton, ⧉ listé, Échap) ; la grille (F1 ; l'ancien « ? » de la barre absent) ; **l'aide qui change sans se fermer** (l'onglet Rapide ouvert sous elle → « Mode rapide — sur un mot ») ; le mode texte menu fermé (« ? », G pendant l'aide ne lance aucune recherche) ; menu ouvert (« ? » ; Échap ferme l'aide et laisse le menu) ; **les touches du menu, une par une** (M, I, A posent leur erreur ; Échap ferme ; L ouvre la case) ; le mode rapide : **son tableau exact** (G / L, M (ou /), i, A, Espace / Entrée, Retour, ⇧R, ? ou F1) et **chaque touche pressée** (Espace et Entrée avancent, Retour recule, i → I, A → A, M → manquant, G et L ouvrent la case, ⇧R → mode texte) ; « ? » ne pose plus Illisible ; G pendant l'aide ne pose rien ; la case : F1 → « La case… », Échap ferme l'aide et laisse la case, « ? » s'écrit dans la case ; la fin de copie ; Préparation, formes acceptées, version aménagée ; Réglages ; Données ; « Nouveautés » ; le bouton sur l'écran de la copie ; 0 erreur.
**Accordés** (les versions d'avant jointes) : `mesure_largeur.py` (banc L7) — le « ? » est fixé en haut à droite de l'écran, hors de tout cadre, voulu : il n'est plus compté comme un bouton qui dépasse ; `fuzz_correction.py` — le « ? » en tête de l'écran n'est pas la note qu'il lit dans la barre.
**Banc unique sur L12 : VERT, 0 échec** (`sorties/`) : S1/S3 sans perte, S2 correct ; fuzz_correction ×2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur ; bancs L1, L2, L3, L5, L6, L6b, L7, L8, L10, L9, L11, L12 verts ; vue élève (l'accueil) identique à la 6.6.3.

## Captures (`captures/`)
`H1-accueil.png`, `H2-texte.png`, `H3-rapide.png`, `H4-case.png`, `H5-fin.png` — l'aide ouverte sur cinq endroits.

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → l'accueil : le « ? » rond en haut à droite ; tape « ? » : ce que tu peux faire ; Échap.
2. Une dictée → une copie → ⇧R (mode rapide) → « ? » : le tableau du mode rapide ; tape G : rien ne se passe dessous ; Échap.
3. G (la case s'ouvre) → F1 : l'aide de la case ; Échap : l'aide se ferme, la case reste ; tape « ? » : il s'écrit dans la case.
4. « i » pose Illisible ; « ? » n'en pose plus.
5. Va en Préparation, Réglages, Données : le « ? » montre chaque fois l'endroit où tu es.
