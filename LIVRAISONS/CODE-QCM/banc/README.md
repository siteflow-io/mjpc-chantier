# Le banc de l'app QCM — QCM-4 · BANC

*Mandat : `MANDATS/CODE-QCM/QCM-4-BANC.md` et `COMMUN.md` (branche `main`). QCM-4 n'écrit pas l'app : il la met à l'épreuve, l'assemble toutes les deux heures et range chaque défaut au nom de son propriétaire dans `../DEFAUTS-OUVERTS.md`.*

## Ce qui tourne, à chaque assemblage

`bash LIVRAISONS/CODE-QCM/banc/assembler.sh` — dans `LIVRAISONS/CODE-QCM/sorties/<date_heure>/` :

| Étape | Fichier | Ce qu'il fait |
| --- | --- | --- |
| `build.py` | `build.txt` | assemble `evaluation-qcm.staging.html` (QCM-1) |
| les contrôles de la conscience | `controles.txt` | `AUDITS/CONTROLES-QCM-APP/controles-app.js`, passés sans modification ; leurs md5 vérifiés d'abord |
| le banc commun | `banc.txt`, `banc.json`, `captures/` | `banc.js`, ci-dessous |
| la fidélité | `fidelite.txt`, `fidelite.json` | `fidelite.js`, ci-dessous |
| le résumé | `resume.txt` | chaque étape, sa durée, ses échecs |

## Le banc commun (`banc.js`)

Par le geste, dans Chromium, sur le faux hub (`AUDITS/QCM-MODE-TEST-09-10/banc/`, la base partagée par WebSocket entre toutes les pages). Une page par appareil : la console (1536 × 864), **les 12 tablettes partagées** (1280 × 800, chacune dans son contexte), le téléphone (390 × 844), le tableau (1280 × 800), plus une tablette pour le code faux et une page élève pour le soir.

Il joue **la séance du scénario de la maquette v9** (`MANDATS/MAQUETTE-QCM-COMPLETE/src/scenario.js`, chargé tel quel) : la classe 3 ESSAI (la fausse classe du faux hub, les mêmes noms que la maquette), Adam absent à l'appel, l'évaluation d'essai (`AUDITS/CONTROLES-QCM-APP/attendus/evaluation-essai.json`), et pour chacun des 24 présents ses clics à chaque question et à chaque tour, ses B, son estimation, la lecture de sa feuille par son voisin, sa co-évaluation :

1. **l'heure** — « 🚀 Lancer la séance », l'appel, les places ; le tableau et le téléphone ; l'entrée des 24 au code, au clavier de l'app (et un code faux) ; la première attestation ; Q1 à Q3, chacune à ses deux tours, B, Théo sans réponse à Q2 puis « 🔓 Rouvrir pour Théo » ; l'estimation ; la seconde attestation ; la correction dans l'ordre des plus ratées (Q2, Q3, Q1), « 💡 Révéler » fermé puis ouvert, « Trouvée au dernier moment » exactement là où la règle la met ; le point d'autonomie de Hugo ; la co-évaluation, l'alerte de Michel tranchée ; le bilan de chacun des 24, sa note comparée à celle que le scénario calcule (`SCN.note`) ; « 🛑 Terminer » ;
2. **le soir** — Résultats, le tableau de la séance, les fiches, « Que dit la feuille ? » (Lou, Q3), rendre les copies, le PDF, « 📊 Mes évaluations » de l'élève, masquer ;
3. **le reste** — les évaluations par niveau, le collage du JSON, les réglages ; puis **l'heure de demain** : une classe de 4e, l'évaluation de 4e (`donnees/eval-4e-11.json` : les questions 1 à 10 et la 21 de `MANDATS/EVAL-4E-PARIS`, complétées au format du prompt, chapitre `4e-ch1`) collée, lancée, Q1 sur une tablette ;
4. aucune erreur de page, aucune boîte système, dans aucune page.

Chaque geste qui doit se voir ailleurs est attendu dans l'autre page sans rechargement ; un champ de la console tapé avant que les 12 tablettes répondent doit garder sa valeur et le curseur. Chaque vérification porte le nom de son propriétaire (COMMUN §1) : la base et l'état → QCM-1 ; les écrans de l'heure → QCM-2 ; le soir et le reste → QCM-3. **Plafond : 19 minutes** ; la durée est écrite en tête de `banc.txt`.

## La fidélité (`fidelite.js`)

`reference/maquette-v9.json` est le relevé de **chacune des 169 scènes** de `maquette-qcm-v9.html` (md5 `2f453a1ce78033172b23d57657d0ab8c`), à la taille de son appareil : son texte, ses gestes (ouverts ou fermés), ses infobulles (`title` et bulles « i »). Il se refait par `node banc/releve-maquette.js`.

À chaque moment d'une scène, le banc relève l'écran de l'app sur l'appareil de la scène (la tablette de Julien et Michel pour les scènes de tablette). `fidelite.js` compare, **aux données près** (les noms d'élèves, les nombres, les heures et les dates deviennent des jetons) : les gestes de la maquette absents ou en trop, ouverts/fermés autrement, les infobulles absentes, les textes absents. Chaque écart est un défaut, sauf s'il est nommé un par un dans `ecarts-maquette.json`, avec sa raison. Les scènes que le banc n'atteint pas encore par le geste sont listées à la fin de `fidelite.txt`.
