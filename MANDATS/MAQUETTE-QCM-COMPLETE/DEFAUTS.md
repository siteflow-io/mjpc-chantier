# Le journal des défauts (mandat §7.4)

*Chaque défaut trouvé : l'étape, ce qu'on a vu, sa cause, sa correction. Un défaut qui revient deux fois reçoit une vérification de plus dans le banc (colonne « garde »).*

| N° | Étape | Défaut | Cause | Correction | Garde ajoutée au banc |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | La maquette assemblée s'ouvrait sur une page blanche (aucune scène rendue). | `build.py` retirait toutes les lignes `rendre();` des morceaux, y compris le dernier appel, celui du socle. | Le socle garde son appel ; seuls les morceaux anciens perdent le leur. | 1 : « la scène montre quelque chose » (déjà là) |
| 2 | 1 | Les scènes des tours 626 et 627 auraient montré le commentaire d'un autre tour. | Les fichiers `com626.js`, `com627.js`, `com628.js` (et `com632.js`) déclaraient tous `commentaireQCM` : dans un seul script, la dernière déclaration gagne partout. | À l'assemblage, chaque morceau garde le sien (`commentaireQCM_626`…) ; `com632.js` garde `commentaireQCM`. | 9 : le commentaire est celui de com632 (à l'étape 4) |
| 3 | 1 | Le PDF « notes et compétences » était coupé à 1 220 px dans sa scène. | L'aperçu avait une hauteur fixe. | L'aperçu prend la hauteur de son contenu à son chargement, et la scène attend ce chargement pour se dire prête. | 1 et 9 : la scène montre le PDF entier, mot pour mot |
| 4 | 1 | Deux captures identiques (t-fin et t-combien). | Voulu : à « Terminer », la tablette revient à « Combien êtes-vous sur cette tablette ? » (cadrage 64). | Déclaré dans `capture.js` (liste des doublons voulus) ; tout autre doublon est signalé. | capture : md5 de chaque image |
