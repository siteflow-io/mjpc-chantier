# AVENANT AU COMPLÉMENT 4 — LA MAQUETTE COMPLÈTE DU QCM, RACCOURCIE

*Écrit par la conscience n°12 le 12/10/2026 (tour 665), sur l'ordre de Paul, à 13:10 : « Non mais là il faut raccourcir. Je dois utiliser qcm demain, je ne peux pas attendre autant de temps, surtout si le temps qu'il passe n'est pas utile. »*

*Il s'adresse à l'exécutant du complément 4, en cours sur la branche `maquette-qcm`. Tu ne t'arrêtes pas : tu continues d'où tu en es, avec ce qui suit. Le complément 4 vaut toujours, sauf ce que cet avenant retire ou remplace.*

*Le protocole de l'audit, validé par Paul le 12/10 à 11:28 : https://github.com/siteflow-io/mjpc-chantier/blob/main/PROTOCOLE-AUDIT-12-10.md*

---

## 1. Ce qui est retiré

1. **La garde 16.3** : les gardes 9 à 15 ne sont plus rejouées sur chacune des destinations. Elles restent jouées sur les 169 scènes, aux tailles de chaque vue.
2. **Au §4, la lecture de chaque capture** des 169 scènes et des 3 149 destinations, et le rejeu de tous les scripts de la conscience.

## 2. Ce qui reste, sur toutes les pages (les 169 scènes et toutes les destinations)

Les gardes 16.1, 16.2 (l'exploration), 16.4 (la structure d'un écran à paramètres), 17, 18, 19 et 20. Ce sont elles qui ont trouvé sur la v8, en une passe, ce que l'audit n'avait pas vu : le QR toujours à la question 1, l'appel des séances rouvertes (Lou présente le 24/09, Adam barré le 15/09), le mode test à « réflexion » au moment de B, le tableau d'une question rouverte sans son énoncé, les couleurs de la maquette sous le seuil de contraste.

## 3. Ce qui remplace le §4

1. `git merge origin/main`, pour avoir `AUDITS/CONTROLES-QCM/` ;
2. **les contrôles de la conscience** : `node AUDITS/CONTROLES-QCM/controles.js MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html sorties/controles-conscience-v9.txt`, à zéro échec. Tu ne modifies ni `controles.js` ni `attendus/` : leurs md5 sont dans `AUDITS/CONTROLES-QCM/EMPREINTES.md5`. Si un contrôle te semble faux, tu ne le contournes pas : tu l'écris dans le README de la livraison, avec la mesure qui le montre ;
3. **les écrans changés** : `node AUDITS/CONTROLES-QCM/releve.js <la v8> /tmp/rel-v8`, puis `node AUDITS/CONTROLES-QCM/releve.js <la v9> /tmp/rel-v9`, puis `python3 AUDITS/CONTROLES-QCM/compare.py /tmp/rel-v8 /tmp/rel-v9 sorties/ecrans-changes-v8-v9.txt c-resultats,x632-pdf,c-rattrapage,t-demo-q,c-interrompue,t-corr-seul,p-corr-avant,p-corr-apres,t-coeval,t-coeval-daccord,x610-6-coeval-laquelle,t-coeval-ecrit,x610-7-coeval-ecrit` ; tu regardes la capture de chaque écran changé, de chaque écran qui devait changer et n'a pas bougé, et de chacun de leurs voisins ; `sorties/lecture-v9.md` dit ce que tu y as vu, une ligne par écran.

## 4. Ce que tu corriges

Les neuf corrections du complément 4, et tout ce que tes gardes ont déjà trouvé sur la v8 ou trouveront sur tes versions de travail (§2 ci-dessus). Rien d'autre.

## 5. La livraison

Dès que le banc (gardes 1 à 15 sur les scènes, 16.1, 16.2, 16.4, 17 à 20 sur toutes les pages) et les contrôles de la conscience sont à zéro, et que `lecture-v9.md` est écrit : `maquette-qcm-v9.html` et son md5, les sorties, le README (section « Complément 4 » en tête, qui dit aussi ce que cet avenant a retiré), `DEFAUTS.md`. Tu t'arrêtes, une seule fois.
