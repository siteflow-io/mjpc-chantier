# LIVRAISONS/CODE-QCM — le code du QCM d'après la maquette

Créé par la conscience n°12 le 12/10/2026 (tour 672), depuis la branche `maquette-qcm` à `5852823d` (la v9 candidate, 13:58).

**Mis à jour le 12/10 à 17:10 (tour 674), avant le lancement des exécutants** : `maquette-qcm` fusionnée à `6fa8a9fe` (la v9 finale, poussée à 15:58, `maquette-qcm-v9.html` md5 `2f453a1ce78033172b23d57657d0ab8c`) ; les deux sources qu'elle change depuis la candidate (`src/c3-corr.js`, `src/c3-x610.js` : « 🤔 1 pense » au singulier) sont copiées ici. `src/` est identique à celui de la v9 finale : il n'y a plus rien à reporter.

- `src/`, `build.py` : les sources de la maquette, copiées telles quelles ; les quatre exécutants les transforment en app (`MANDATS/CODE-QCM/COMMUN.md` sur `main`). `build.py` lit encore des chemins de `MANDATS/MAQUETTE-QCM-COMPLETE/` : QCM-1 les reprend.
- `banc-maquette/` : le banc de la maquette, copié pour mémoire ; le banc de l'app est `banc/`, écrit par QCM-4.
- `DEMANDES.md`, `DEFAUTS-OUVERTS.md`, `CONTRAT-CHANGEMENTS.md` : les fichiers communs (COMMUN §1 à §3).
- La maquette elle-même reste dans `MANDATS/MAQUETTE-QCM-COMPLETE/` : c'est la référence de la fidélité.

## Livraison du 13/10/2026 à 06:30 (QCM-4 · BANC, COMMUN §5)

- `evaluation-qcm.staging.html` et `evaluation-qcm.staging.html.md5` : l'app assemblée par `build.py` depuis `src/` sur `code-qcm` à `d669ea6`, md5 `360af4ba39ad028143c258ad3b42c408` (réassemblée à 08:00, reprise du 13/10).
- `src/`, `build.py` : ses sources.
- `banc/` : le banc commun (console, tablettes partagées, téléphone, tableau, sur le faux hub, par le geste) ; il se rejoue par `bash banc/assembler.sh` (12 min) ; mode d'emploi dans `banc/README.md`, écarts de fidélité nommés dans `banc/ecarts-maquette.json`, relecteurs neufs dans `banc/relecteurs/`.
- `sorties/2026-10-13_0800/` : le banc final, ses sorties avec leurs durées et les captures de l'heure à chaque phase et sur chaque appareil (`captures/`, `captures-demain/`) ; les assemblages de la nuit dans les autres dossiers de `sorties/`.
- `VERDICT.md` : le verdict par partie (l'heure, le soir, le reste) ; `DEFAUTS-OUVERTS.md` : les défauts encore ouverts, par propriétaire.
