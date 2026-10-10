# Le journal des défauts (mandat §7.4)

*Chaque défaut trouvé : l'étape, ce qu'on a vu, sa cause, sa correction. Un défaut qui revient deux fois reçoit une vérification de plus dans le banc (colonne « garde »).*

| N° | Étape | Défaut | Cause | Correction | Garde ajoutée au banc |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | La maquette assemblée s'ouvrait sur une page blanche (aucune scène rendue). | `build.py` retirait toutes les lignes `rendre();` des morceaux, y compris le dernier appel, celui du socle. | Le socle garde son appel ; seuls les morceaux anciens perdent le leur. | 1 : « la scène montre quelque chose » (déjà là) |
| 2 | 1 | Les scènes des tours 626 et 627 auraient montré le commentaire d'un autre tour. | Les fichiers `com626.js`, `com627.js`, `com628.js` (et `com632.js`) déclaraient tous `commentaireQCM` : dans un seul script, la dernière déclaration gagne partout. | À l'assemblage, chaque morceau garde le sien (`commentaireQCM_626`…) ; `com632.js` garde `commentaireQCM`. | 9 : le commentaire est celui de com632 (à l'étape 4) |
| 3 | 1 | Le PDF « notes et compétences » était coupé à 1 220 px dans sa scène. | L'aperçu avait une hauteur fixe. | L'aperçu prend la hauteur de son contenu à son chargement, et la scène attend ce chargement pour se dire prête. | 1 et 9 : la scène montre le PDF entier, mot pour mot |
| 4 | 1 | Deux captures identiques (t-fin et t-combien). | Voulu : à « Terminer », la tablette revient à « Combien êtes-vous sur cette tablette ? » (cadrage 64). | Déclaré dans `capture.js` (liste des doublons voulus) ; tout autre doublon est signalé. | capture : md5 de chaque image |
| 5 | 2 | Le banc ne finissait pas : arrêté au bout de 30 minutes. | Pour chaque bouton cliqué, un navigateur neuf était ouvert (des milliers d'ouvertures). | La scène est remise à neuf sur place (démontée, puis rendue de nouveau) avant chaque clic, et quatre scènes se vérifient à la fois : 4 min 42 pour tout. | — |
| 6 | 2 | 400 « ne se clique pas » : les boutons de la console derrière une fenêtre ouverte. | Le banc cliquait aussi les boutons recouverts par la fenêtre, que personne ne peut cliquer. | Le banc ne clique que les boutons de la couche du dessus ; un bouton recouvert n'est pas un geste de la scène. | 5 |
| 7 | 2 | « ❌ Écarter » et « ⚠️ Annuler », dans « 📋 Toutes les questions », ne faisaient rien. | Aucune destination. | Ils ouvrent leur garde (`c-ecarter`, `c-annuler`). | 5 : « chaque bouton déclare son geste » (nouvelle) |
| 8 | 2 | Les lignes déjà cochées de l'attestation étaient grisées sans dire pourquoi. | Infobulle trop courte (« Cochée. »). | « Cette ligne est déjà cochée. » | 5 |
| 9 | 2 | B : le clic figé restait cliquable, et ne faisait rien. | Seuls les autres choix étaient grisés. | Tous les choix sont grisés, avec la raison ; le clic figé reste lisible (pleine couleur). | 5 |
| 10 | 2 | « 🔄 Chrono » du téléphone ne faisait rien. | Le chrono du téléphone était un texte fixe. | Un chrono à état, que « 🔄 Chrono » relance. | 5 : « chaque bouton déclare son geste » |
| 11 | 2 | « 🖊️ POSE TON STYLO. » au tableau, introuvable dans le validé. | L'émoji (le stylo qui remplace le livre, 431) était collé à la phrase. | L'émoji est à part ; la phrase est celle de la 7.7.1. | 3 |
| 12 | 2 | Le ✕ d'une fenêtre chevauchait son titre (QR pilotage, mode d'emploi). | Le titre allait jusqu'au bord droit, sous le ✕. | Le titre s'arrête avant le ✕. | 8 |
| 13 | 2 | « Annuler » de « 🔓 Rouvrir pour un élève » ne faisait rien. | Aucune destination. | Il ferme la fenêtre (retour à la question 2 close). | 5 : « chaque bouton déclare son geste » |
| 14 | 2 | Deux captures identiques : l'estimation et celle de la reprise sur papier. | La scène papier reprenait la même scène. | La scène papier montre un autre moment (Michel a choisi, Julien pas encore). | capture : md5 |
| 15 | 2 | Des noms coupés au milieu (« CHEVALLIE R Théo ») dans la grille des binômes. | La grille autorisait la coupe n'importe où. | Les noms ne se coupent qu'entre deux mots. | 8 (relu sur capture) |
| 16 | 2 | L'onglet ou le mode déjà en cours comptait comme un bouton inerte. | Il ramène à la scène elle-même. | Marqué « en cours » (`actif`, `aria-pressed`) et non compté ; tout autre bouton qui ne change rien reste un défaut. | 5 |

*Défaut revenu deux fois ou plus : le bouton sans geste (7, 10, 13). Garde ajoutée : « chaque bouton déclare son geste » — tout bouton actif de la couche du dessus a une destination, un composant à état, ou est une case qui se coche sur place.*
