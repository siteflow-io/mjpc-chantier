# DICTÉE — L'ÉCRAN DE CORRECTION · L2 — ⇧R est une bascule, sans perte

*Exécutant du mandat « L'écran de correction » (conscience n°12). Rien n'est promu.*

## Ce que ça change pour toi
- **⇧R (Maj+R) bascule dans les deux sens, sur la même copie** : du mode texte au mode rapide, et du mode rapide au mode texte. Rien n'est perdu (depuis L1, tout est enregistré à chaque geste ; chaque mode reprend sa position : le mot du mode rapide, le mot encadré du mode texte).
- Depuis l'onglet « ⚡ Rapide » ouvert sans copie, ⇧R ramène en mode texte **la copie que le mode rapide montrait** ; « ← Texte » et « ⏸ Pause » font de même (avant : retour à la grille des élèves).
- ⇧R ne fait rien quand le curseur est dans un champ de saisie : la lettre s'y écrit.
- Les infobulles le disent : l'onglet « ⚡ Rapide » (« ⇧R (Maj+R) bascule entre le mode texte et le mode rapide, sur la même copie, sans rien perdre ») ; « ← Texte » et « ⏸ Pause » (« … — ⇧R »).

## Le fichier
- **Base de L2 = L1 (6.7.0-L1, 738 687 o, md5 `913f8b5c…`), non encore promue**, elle-même partie de la 6.6.3 en ligne, **vérifiée à la commande** (737 047 o, md5 `be6e2481d8b6f850c7eb88b5f72c4ac5`, inchangée).
- → **6.7.0-L2** : **739,572 o** (+885 depuis L1), md5 `9053962b97f967e1894ed2751aff422b`.
- Modifié dans `CorrScreen` : l'écoute du clavier (⇧R dans les deux sens, ses dépendances), `eleveRapideParDefaut` (ajoutée : la même règle que l'onglet Rapide), le `onExitFast` de l'onglet Rapide (la même copie) ; les infobulles de l'onglet « ⚡ Rapide », de « ← Texte » et de « ⏸ Pause ». Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, 0 accès au vrai hub
**`banc_L2_geste.py`** (touches et clics réels) : Mike, 2 erreurs en texte → ⇧R → mode rapide sur Mike, hub [(3,G),(7,L)] → touche I → hub 3 erreurs → ⇧R → mode texte sur Mike, 3 erreurs → une M en texte → hub 4 → ⇧R, ⇧R, ⇧R, ⇧R : toujours Mike, les 4 erreurs intactes (« 7,5 · 1G1L1∅1? ») ; « aR » tapé dans le champ « ce qu'a écrit l'élève » : la lettre s'écrit, rien ne bascule ; l'onglet Rapide ouvert depuis la grille → ⇧R → le même élève, en mode texte ; 0 fenêtre, 0 erreur. **Sur L1, ce banc échoue** (le retour par ⇧R n'existait pas).
**Banc unique `banc_unique_dictee.sh` sur L2 : VERT, 0 échec** (`sorties/`) : `scenarios_modes` — S1 sans perte, **S3 « après ⇧R : 2 err. »**, S2 correct ; `fuzz_correction` graines 1 et 2 : 0 bug ; `fuzz_rapide` : 0 bug ; grille : 0 erreur ; `banc_L1_geste` et `banc_L2_geste` : verts ; vue élève identique à la 6.6.3.

## Captures (`captures/`)
`Z1-avant.png` (6.6.3 : 2 erreurs puis ⇧R → « 0 err. ») ; `Z2-apres-rapide.png` (L2 : ⇧R → le mode rapide, « 2 err. ») ; `Z3-apres-texte.png` (L2 : ⇧R encore → le mode texte, les 2 erreurs).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une dictée → une copie en mode texte → 2 erreurs → ⇧R : le mode rapide, sur la même copie, avec ses 2 erreurs.
2. Une erreur au clavier (G, L…) → ⇧R : retour au mode texte, les 3 erreurs ; refais l'aller-retour deux fois : rien ne bouge.
3. Ouvre le champ « ce qu'a écrit l'élève » et tape un R majuscule : il s'écrit, rien ne bascule.
