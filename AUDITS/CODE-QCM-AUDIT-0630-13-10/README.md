# Audit de la livraison finale du code du QCM — 13/10/2026, 06:36 à 06:42 (conscience n°12)

*Réveil programmé à 06:35, sur l'ordre de Paul (« oui 921 »).*

**Ce qui est audité** : la livraison de QCM-4 sur `code-qcm` (`d8d47f9e`), l'app `evaluation-qcm.staging.html` assemblée à `ca069f6`, md5 `172efa3c4f5ce73c6095b2868f4cb456` ; reconstruite par la conscience à l'identique (même md5). `VERDICT.md` de QCM-4 (06:00, mis à jour à 06:29).

## Verdict : ça ne va pas — la 7.7.2 reste en ligne, rien n'est poussé en production

| Mesure | Résultat |
| --- | --- |
| Contrôles de la conscience, sur l'app livrée | 30 vérifications, 0 échec (`controles-app-sur-ca069f6.txt`) |
| Banc de QCM-4 à 06:16 (`sorties/2026-10-13_0616/`) | l'heure 286 / 286, le soir 38 / 38, le reste 16 / 16, l'heure de demain (4e, 11 questions) 107 / 107 |
| Défauts de l'heure ouverts, de l'aveu des exécutants (VERDICT.md, 06:29) | 6 : « Rouvrir pour tous » rejoue le 1er tour ; l'élève rouvert seul sans B, la console muette ; les compteurs avec des présents non entrés ; « Séance interrompue » faux ; l'alerte de la co-évaluation ignore « Trouvée au dernier moment » ; les absents au tableau |
| Corrections de 05:53 non rejouées | 5 de l'heure et 1 du soir, dites corrigées, rejouées par personne |
| L'audit de 22:28 | non traité : les écarts vus par l'élève et au téléphone sont les mêmes à 06:16 qu'à 22:00 ; 37 écrans toujours jamais atteints ; 49 écrans sur 120 identiques à la maquette |

La liste de reprise, si Paul relance les quatre jusqu'à 08:45, est en tête de `LIVRAISONS/CODE-QCM/DEFAUTS-OUVERTS.md` sur `code-qcm` (`ed546c10`).
