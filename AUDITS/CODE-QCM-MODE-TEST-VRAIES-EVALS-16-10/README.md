# Contrôle de la conscience n°12 — le mode test joue les vraies évaluations (16/10/2026, 18:4x)

La reprise : section « Le mode test joue les vraies évaluations — 16/10/2026 » de `LIVRAISONS/CODE-QCM/DEFAUTS-OUVERTS.md` (branche `code-qcm`, `174f0d8c`), sur l'ordre de Paul (16:56, 17:02 « ok », 17:09 « lancé maintenant »).

L'app contrôlée : `evaluation-qcm.staging.html` assemblée par `build.py` à `882611f` (rien n'a changé dans `src/` ni `build.py` jusqu'à `2aad8ff0`), reconstruite à l'identique par la conscience : md5 `764a184f6a91657697004fca4be38488`, 2 032 414 o. Le VERDICT de QCM-4 de 18:34 (`0081477d`) : ça va.

| Contrôle, fixé d'avance dans la section | Résultat |
|---|---|
| les contrôles fixes de la conscience (`AUDITS/CONTROLES-QCM-APP/controles-app.js`, md5 `35a0f5c2…`, empreintes vérifiées) | `controles.txt` : 32 / 32 |
| la sonde du mode test (`sonde-modetest.js`), par le geste sur le faux hub : la carte de lancement du mode test (le menu, la démo par défaut, les évaluations prêtes dans l'ordre de la console, une de 3e, une de 4e), la copie réécrite au choix, la séance de 4e jusqu'au premier tour (la console et la tablette simulée 1), « 🗑️ Sortir et purger », les deux vraies évaluations identiques bit à bit et jamais écrites (journal du faux hub), la carte de lancement de la console inchangée, la démo par défaut à l'entrée suivante | `sonde-modetest.txt` : 24 / 24 |

Lu dans le diff `381184d..882611f` (`src/`) : `maquette620.js` (`copieTestV`, `evalsTestV`, `choixTestV`, `ecrireCopieTest`, `LancementTestV`), quatre infobulles de Paul (`etape4.js` `BOUTONS_CAS`, `gestes.js` « 🧪 Mode test », `c3-gestes.js` son « ⓘ », le titre de la carte). Aucun texte côté élève.

Les deux points que QCM-4 laissait à la conscience : l'écart à la maquette des infobulles de « 🧪 Mode test » est pris (elles disaient « sauf la démo », ce qui n'est plus vrai) ; `t-q1-attente` (« gestes en trop ») est un relevé pris trop tôt sous la charge : le banc commun y voit bien « Attends la prochaine question » (`banc.txt` l. 60, ok), la scène était fidèle à 14:48, et la livraison ne touche pas la tablette.

Aucune capture archivée (les tablettes simulées portent des noms). La sonde écrit les évaluations du faux hub : « Évaluation d'essai » (les attendus de la conscience) et une de 4e tirée de celle de Paul déjà au faux hub (4 questions), complétée pour être prête ; aucune donnée d'élève.
