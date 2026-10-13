# Préparation de la mise en ligne de 09:15 (conscience n°12, 13/10/2026, 07:30)

*Paul (13/10, 07:22) : « Je relance les exécutants, les défauts doivent être corrigés et l'App en ligne à 9h15 dernier délai. » Audit à 08:30 (réveil programmé), verdict avant 09:00, mise en ligne avant 09:15 si ça va.*

## Mesuré dès maintenant sur l'app livrée à 06:30 (`ca069f6`, md5 `172efa3c…`)

1. Elle charge le vrai SDK Firebase (`https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js` et `firebase-database.js`), `databaseURL` de `mjpc-hub`, `DB_ROOT = "qcm"` : la même base que la 7.7.2. Aucune adresse du faux hub dedans (le seul « localhost » est dans un commentaire du socle sur WebCrypto).
2. Le portail (`index.html`, md5 `ac792b28…`, inchangé) l'ouvre par `evaluation-qcm.html?mode=prof`, `?mode=eleve` et `?mode=eleve&eval=<id>` ; la 7.7.2 n'utilise pas `eval` non plus : rien ne change pour le portail.
3. Elle n'a pas de pastille `APP_VERSION` : elle se reconnaît à son md5. Dans les documents : « 8.0.0, le code de la maquette v9 ».

## Le geste de mise en ligne (si l'audit de 08:30 dit que ça va)

1. Point de retour dans `docs/MJPC6-restauration.md` : la 7.7.2, blob `07f11ffcc65e` (commit `40f1810`), 550 800 o, md5 `3aaf749929863d69e30a36f7bc4ad355`.
2. Copier l'app livrée, vérifiée par son md5 et reconstruite à l'identique, en `evaluation-qcm.html` de la production.
3. Journal, dettes (198 et 210 restent réglées ; les défauts encore ouverts, s'il y en a, sont des dettes : alors pas de mise en ligne), `docs/MJPC6-OU-TROUVER-QUOI.md`.
4. `git push origin HEAD:main` ; bit à bit au dépôt et en ligne (`curl` de https://siteflow-io.github.io/monsieurjaipascompris/evaluation-qcm.html).
5. Pour Paul : l'adresse https://siteflow-io.github.io/monsieurjaipascompris/evaluation-qcm.html?mode=prof&v=800 et ses tests geste par geste.

## Verdict de 08:30 : ça ne va pas — la mise en ligne n'a pas lieu

La livraison de la reprise (`d669ea6`, md5 `360af4ba39ad028143c258ad3b42c408`, VERDICT.md de QCM-4 à 08:14) garde neuf défauts de l'heure ouverts, vus par les relecteurs neufs R4 à R6 : « Rouvrir pour un élève » rouvre pour toute la classe ; « Rouvrir pour tous » ne rouvre plus rien ; au téléphone, « ▶️ Commencer la correction » reste fermé et le chrono ne bouge pas ; la console rechargée ; les compteurs ; l'alerte de la co-évaluation et « Trouvée au dernier moment ». La décision de Paul (la correction sur son clic) est tenue. Rien n'est poussé en production : la 7.7.2 (md5 `3aaf7499…`) reste en ligne.
