# DICTÉE — L'ÉCRAN DE CORRECTION · L7 — la largeur (1100 px) et la phrase entière en mode rapide

*Exécutant du mandat « L'écran de correction » (N2). Rien n'est promu.*

## Ce que ça change pour toi
- **Les écrans de correction du professeur prennent 1100 px** (ta décision du 01/10) : le mode texte (avant : 760) et le mode rapide (avant : 480). Une classe propre à ces deux écrans (`.container.corr-prof`) : **`.container` n'est pas touché** — c'est lui que partagent les écrans des élèves (téléphone, moitiés de tablette).
- **Mesuré par la géométrie, à 1366 et à 1920 px de large** : les deux écrans font 1100 px ; **aucun bouton ne dépasse de son cadre** (avant : « ← Texte » dépassait de 68 px dans la colonne de 480) ; aucun défilement de côté.
- **Le mode rapide montre la phrase entière autour du mot** : la ligne de contexte est bornée par les ponctuations fortes (. ! ? …), le mot courant en gras ; si la phrase dépasse la ligne, elle est **coupée aux bords** (« … ») autour du mot courant (avant : trois mots de chaque côté).

## Le fichier
- Base de L7 = **la 6.7.0-L6 en ligne**, vérifiée à la commande (746 811 o, md5 `c28534fac49660fde55a51c2623a4324`).
- → **6.7.0-L7** : **748,162 o** (+1,351), md5 `665317fbfb6f0ba5a1dcaf3130779326`.
- La feuille de style : `.container.corr-prof{max-width:1100px}`, `.ctx-phrase` (une ligne, coupée aux bords). Dans `CorrEleve` : les deux racines (mode texte, mode rapide) portent `corr-prof` (le `maxWidth:480` du mode rapide retiré) ; la ligne de contexte (les bornes de la phrase, la coupe « … »). Le `maxWidth:480` de l'« ancien écran » (`RapideGlobal`, jamais affiché — n°12 · 97) n'est pas touché. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L7_geste.py`** (avec `mesure_largeur.py`) : à 1366 × 768 et 1920 × 1080, une copie ouverte en mode texte, puis ⇧R et 14 mots avancés en mode rapide — **largeur 1100 px partout, 0 bouton hors de son cadre, 0 défilement de côté**, 0 erreur ; la ligne de contexte : « Pour lui parler , nous nous adressions d ' abord à Penanster , qui lui répétait nos propos par une lente … » (la phrase qui suit le point, coupée à droite). **Sur L6** : 760 / 480, « ← Texte » dépasse de 68 px, sept mots de contexte → rouge. **Les écrans des élèves, comparés au pixel** (l'accueil et le choix « 1 élève / 2 élèves », à 1366 et à 390 px de large, la pastille de version masquée) : **identiques** à la 6.6.3.
**Banc unique sur L7 : VERT, 0 échec** (`sorties/`) : S1/S3 sans perte, S2 correct ; fuzz_correction ×2 : 0 bug ; fuzz_rapide : 0 bug ; grille : 0 erreur ; bancs L1, L2, L3, L5, L6, L7 verts ; vue élève identique.

## Captures (`captures/`)
À 1366 px : `T1-texte-avant.png` / `T2-texte-apres.png` (mode texte) ; `T3-rapide-avant.png` / `T4-rapide-apres.png` (mode rapide) ; les écrans entiers bruts à 1366 et 1920 dans `captures/avant/` et `captures/apres/`.

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une copie en mode texte : elle prend la largeur de ton écran (1100 px), le texte tient sur moins de lignes ; rien ne dépasse.
2. ⇧R (mode rapide) : la même largeur ; au-dessus du mot, la phrase entière où il se trouve, le mot en gras.
3. Côté élève (téléphone ou tablette) : rien n'a changé.
