# Contrôle de la conscience n°12 — 13/10/2026 11:31, sur la reprise 4 bis du code du QCM

*Tour 696, d'après le réveil programmé de 11:31 (pas de Paul). App contrôlée : `LIVRAISONS/CODE-QCM/evaluation-qcm.staging.html`, sur `code-qcm` à `c5a818c` (tout ce qui était poussé à 11:22), md5 `805732bcff4ec2fedd7d2831123037f8`, 1 975 300 o. Verdict de QCM-4 de 11:30 : `f805adef`.*

## Verdict : ça ne va pas ; rien n'est mis en ligne, la 7.7.2 reste

| Épreuve | Résultat |
| --- | --- |
| Reconstruction par `build.py` | même md5 que VERDICT.md de QCM-4 (11:30) : `805732bc…` |
| Contrôles de la conscience (`AUDITS/CONTROLES-QCM-APP`, md5 `1f1ac0d8…`) | 32 vérifications, 0 échec, 111 s (`controles-app-sur-c5a818c.txt`) |
| Sonde B (`AUDITS/CODE-QCM-AUDIT-1000-13-10/sonde-b.js`) | 17 vérifications, 0 échec, 97 s (`sonde-b-sur-c5a818c.txt`) |
| Bancs de QCM-4 | 211 / 211, et les reprises : 22 / 22, 13 / 13, 26 / 26 ; à 10:55 : 47 / 47 et 109 / 109 |

Pourquoi ça ne va pas :
- un défaut connu reste ouvert : pendant l'appel, le téléphone montre la séance (R9, n° 2) ;
- un écart à la maquette : « 🚀 Lancer la séance » de la carte est grisé pendant l'appel (R9, n° 1, `c-appel`) ;
- des corrections ne sont rejouées par personne : le dénominateur des présents au téléphone et au tableau, « 1 réponse enregistrée » ;
- la partie de R10, de l'estimation au soir, n'a été jouée par aucun relecteur ;
- QCM-4 écrit lui-même qu'il ne peut pas dire que l'heure va.

Écartés après mesure :
- les accords : `SCN.sexe` lit `classes/<classe>/amenagements/<élève>/sexe`. La conscience a lu le hub sans rien écrire, et n'en a gardé que des comptes, aucun nom : les quatre classes de Paul ont le sexe de tous leurs élèves (25, 30, 30, 30) ;
- « Je commence » fermé (R9, n° 3) : l'écran a sa case à cocher (`banc/relecteurs/R9/cap/tab1-2.png`).

La reprise 5 (seulement si Paul relance) est en tête de `LIVRAISONS/CODE-QCM/DEFAUTS-OUVERTS.md` sur `code-qcm` (`f848040f`).
