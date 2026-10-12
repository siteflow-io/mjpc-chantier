# Audit de la livraison du soir du code du QCM — 12/10/2026, 22:05 à 22:45 (conscience n°12)

*Ordre de Paul (12/10, 19:14) : « il faudrait qu'ils aient fini ce soir avant 22h, afin que tu fasses un audit avant la nuit et qu'on lance les correctifs si besoin ». Réveil programmé à 22:05 (« oui 921 »).*

**Ce qui est audité** : `code-qcm` à `596b6ef2` (21:39), l'app que QCM-4 a assemblée à 22:00 (assemblage n°2, `LIVRAISONS/CODE-QCM/sorties/2026-10-12_2200/`, sur `code-qcm`). La conscience l'a assemblée elle-même : même md5, `c6dd982faf947dbaef348e0ab3276158`. `VERDICT-22H.md` n'est pas écrit.

## Verdict : ça ne va pas encore

L'heure se joue de bout en bout ; ses écrans ne sont pas encore ceux de la maquette.

| Mesure | Résultat |
| --- | --- |
| Contrôles de la conscience (`AUDITS/CONTROLES-QCM-APP/`, md5 `cf0cd37d…`) | 30 vérifications, 0 échec (`controles-app-sur-596b6ef.txt`) |
| L'heure de demain (4e, 11 questions, le JSON collé, 12 tablettes), banc de QCM-4 rejoué par la conscience | 107 vérifications, 1 échec (« ▶️ Commencer la correction », question posée à Paul) |
| Banc commun de QCM-4, rejoué | 205 vérifications, 1 échec (le même) |
| Gestes rares, rejoués | 44 vérifications, 0 échec |
| Fidélité à la maquette v9 (`fidelite.js` de QCM-4, rejoué ; le même résultat que le sien) | 157 écrans : 120 atteints par le geste, 46 sans écart, 74 avec des écarts non nommés (334 dans 56 écrans de QCM-2, 110 dans 18 écrans de QCM-3), 37 jamais atteints |
| Captures regardées (liste fixe de l'heure de demain) | la tablette prête, le 1er tour de la question 1 (les deux moitiés), la correction de la question 11, les bilans des deux moitiés : rien de cassé ; écarts de fidélité, voir plus bas |

## La faute trouvée

La liste des défauts de QCM-4 disait « un seul défaut reste ouvert » ; sa propre fidélité en comptait 444. Son mandat : chaque écart avec la maquette est un défaut, sauf s'il est nommé un par un, avec sa raison. Les défauts de l'audit sont en tête de `LIVRAISONS/CODE-QCM/DEFAUTS-OUVERTS.md` sur `code-qcm` (commit `ce15fa0f`), par propriétaire : d'abord ce que voit l'élève et ce que montre le téléphone, puis la console de l'heure, puis le soir ; les 37 écrans jamais atteints, ceux de l'heure d'abord.

## La question posée à Paul

À la fin de la seconde attestation, la correction démarre-t-elle seule quand tous ont coché (ce qui est codé), ou « ▶️ Commencer la correction » s'ouvre-t-il et Paul clique ? La maquette ne tranche pas : le bouton fermé dit « S'ouvre quand les 24 présents ont coché… », l'infobulle de la carte « La correction commence quand tous les présents l'ont cochée en entier, comme au début ». Proposition de la conscience : Paul clique, comme pour « ▶️ Lancer Q1 ».
