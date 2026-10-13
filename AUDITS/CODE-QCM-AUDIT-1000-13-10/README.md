# Contrôle de la conscience n°12 — 13/10/2026 10:00, sur la reprise 3 du code du QCM

*Tour 693. La séance de Paul est décalée à 13:00 (Paul, 09:03). App contrôlée : `LIVRAISONS/CODE-QCM/evaluation-qcm.staging.html` sur la branche `code-qcm` à `f95030b` (tout ce qui a été poussé jusqu'à 09:40), md5 `011ae89f91f62cc5796aa32d3fe8d4aa`, 1 971 555 o.*

## Verdict : ça ne va pas ; rien n'est mis en ligne, la 7.7.2 reste

| Épreuve | Résultat |
| --- | --- |
| Reconstruction par `build.py` | même md5 que VERDICT.md de QCM-4 (09:58) : `011ae89f…` |
| Contrôles de la conscience (`AUDITS/CONTROLES-QCM-APP`, K11 corrigé à 10:05) | 32 vérifications, 0 échec, 109 s (`controles-app-sur-f95030b.txt`) |
| Bancs de QCM-4 (sur la même app) | 211 / 211, 47 / 47, l'heure de demain 109 / 109 ; points 1 à 5 de la reprise 3 rejoués par le geste : tout passe sauf l'heure de la coupure |
| Relecteur neuf R8 de QCM-4 | 16 trouvailles ; vues par la conscience sur les captures : l'alerte « Donner raison à Julien : Milan → 1 point » (bonne réponse : Rome), « À lire ce soir : n'a pas dit si sa feuille disait son clic » pour Léa et Tom, le bilan « Question 2 · faux → 0 point » pour une question écartée |
| Sonde B de la conscience (`sonde-b.js`, par le geste) | sur le chemin normal, B paraît à la 2e moitié dans deux cas : quand « 🔒 Clore la question » est cliqué dès sa réponse (Q1), et à la fin du temps sans aucun clic (Q2). Le 2e tour s'ouvre seul après 27 s. Le B perdu de R8 vient donc d'un autre chemin (réouverture, temps changés) ; sa cause n'est pas mesurée |

L'app n'est pas mise en ligne, parce que des défauts connus restent dans des gestes que Paul fera : l'alerte, B après une réouverture, « Rouvrir pour tous », les questions écartées, l'heure de la coupure, le téléphone. La règle est : jamais de promotion avec un défaut connu. La liste et l'ordre de la reprise 4 sont dans `LIVRAISONS/CODE-QCM/DEFAUTS-OUVERTS.md` sur `code-qcm`, à la section « Reprise 4 du 13/10 ». Elle ne sert que si Paul relance les exécutants.

## La faute de la conscience corrigée ici

K11 attendait encore que la correction commence seule, alors que Paul l'a interdit à 07:22. Il échouait depuis 08:00, et K12 à K15 avec lui. Corrigé à 10:05 : voir `AUDITS/CONTROLES-QCM-APP/README.md`.

## Rejouer la sonde

`APP_FILE=<app> BANC=<faux hub, avec node_modules> CAP=<dossier des captures> node sonde-b.js <sortie.txt>` (96 s).
