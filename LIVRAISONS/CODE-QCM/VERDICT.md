# Verdict de la livraison du code du QCM — QCM-4 · BANC, reprise 7, 11:40

*Après le contrôle de la conscience de 11:05. App : `evaluation-qcm.staging.html`, md5 **`9194384daab9d02d40d32d3314a90df5`**, `code-qcm` à `263633b` (tout ce qui était poussé à 11:30). Sorties : `sorties/2026-10-15_1130/`.*

## Verdict : **ça va.**

Tout ce que la reprise 7 demande, rejoué par le geste sur cette app, passe ; les défauts du verdict de 11:00 sont corrigés et rejoués.

| Épreuve, sur l'app de 11:30 (md5 `9194384d…`) | Résultat |
| --- | --- |
| Contrôles de la conscience, ceux de `main` refaits pour la nouvelle entrée (md5 `b7d6b6ef…`, `EMPREINTES.md5` vérifié) | **32 / 32** |
| Banc commun (B exigé de chacun ; l'entrée unique « 👋 Identifie-toi » ; la tablette revient à l'entrée) | **211 / 211** |
| L'heure de demain (l'évaluation de 4e collée, 11 questions), sur la même app (md5 `9194384d…`), à 11:13 | **109 / 109** |
| Gestes rares (dont « ↩️ Revenu »), sur la même app, à 11:13 | **47 / 47** |
| Reprises 2, 3 (avec le point 14), 4, 5 | **22 / 22, 15 / 15, 27 / 27, 10 / 10** |
| Reprise 7-a : points 1, 2, 3, 5 | **40 / 40** |
| Reprise 7-b : points 6, 7 (mode test) | **83 / 83** |
| Reprise 7-c : points 8, 9, 10 (le soir, « Lire les copies », la question de l'élève, les lignes à lire ; la fiche avec toutes ses lignes) | **141 / 141** |
| Reprise 7-d : points 11, 12, 13 (la lecture figée à 0 ; aucun rouge ; deux classes, la session MJPC, la session de professeur, une autre heure, le binôme, l'absent marqué présent par « ↩️ Revenu », la fin de la séance) | **86 / 86** |
| Reprise 7-e : points 12 et 14 sur papier (lancée sur papier, « ⏸️ Feuilles ramassées », reprise, « Avant la correction ») | **9 / 9** |

Deux questions posées par QCM-4 restent sans réponse écrite, et le contrôle de 11:05 ne les a pas retenues parmi ce qui reste : le nom en rouge à la lecture (celui de l'élève dont la feuille n'est pas lue, plutôt que celui du lecteur) ; une seconde séance qui ne se lance pas par le geste d'une seconde console quand une autre est en cours (le banc la lance par `ACT`). Je ne les compte pas comme défauts.

---

# Verdict de 11:00 (pour mémoire)

*La reprise 7 (`DEFAUTS-OUVERTS.md`, « Reprise 7 du 13/10, complétée le 15/10 », points 1 à 14 ; point 4 pour QCM-4). App : `evaluation-qcm.staging.html`, md5 **`23609a66c416aaf1ae87b04ea02ed35e`**, `code-qcm` à `0aae9af` (tout ce qui était poussé à 10:45). Sorties : `sorties/2026-10-15_1045/` (et l'assemblage complet de 10:30, `sorties/2026-10-15_1030/`).*

## Verdict : **ça ne va pas.**

| Épreuve, sur l'app de 10:45 | Résultat |
| --- | --- |
| Contrôles de la conscience (ceux de `main`, non modifiés) | **30 / 32** : K2 attend encore « Combien êtes-vous sur cette tablette ? » et « 👥 2 élèves », que le point 13 retire ; la conscience a dit refaire K2 avant son contrôle |
| Banc commun (B exigé de chacun ; la nouvelle entrée ; la tablette revient à « 👋 Identifie-toi ») | **211 / 211** (plus de B manquant depuis `74a0eeb`) |
| L'heure de demain (l'évaluation de 4e collée, 11 questions) | **109 / 109** (le collage repasse la garde ; la trouvée de Lina) |
| Gestes rares | **46 / 47** : **« ↩️ Revenu » ne retire plus Lou de `partis`** (`partis/zeller_lou` reste) — depuis `6d7c287` (« ↩️ Retour d'un élève » liste aussi les absents de l'appel) ; à QCM-2, QCM-1 |
| Reprises 2, 3 (avec le point 14 : la ligne du stylo vert, juste après « Montre ta feuille »), 4 | **22 / 22, 15 / 15, 27 / 27** |
| Reprise 5 | 4 / 10 dans l'assemblage (le jeu n'a fait entrer personne sous la charge : un défaut du banc, corrigé) ; **rejoué seul à 10:58 sur la même app (md5 `23609a66…`) : 10 / 10** |
| Reprise 7-a (points 1, 2, 3, 5) | **40 / 40** |
| Reprise 7-b (points 6, 7, mode test) | **83 / 85** : au 2e tour de Q1, la tablette simulée (en petit et en grand) ne dessine pas ce que dessine « 👁 » (« Élise, laisse la tablette à Gatien… ») ; à QCM-3 |
| Reprise 7-c (points 8, 9, 10) | **137 / 139** : la fiche de l'élève ne montre qu'une ligne « à lire » par question (Julien, Camille) ; à QCM-3, ouvert depuis 09:00 |
| Reprise 7-d (points 11, 12, 13 complété) | **83 / 84** : **« ↩️ Revenu » ne marque pas présent Adam, absent à l'appel** (`absents` = `[yvon_adam]` après le geste) ; à QCM-2, QCM-1 |

Défauts ouverts, par propriétaire :
- **QCM-2, QCM-1** : « ↩️ Revenu » n'écrit plus le retour (Lou partie, gestes rares) ni la présence (Adam absent, point 13).
- **QCM-3** : la fiche de l'élève, une seule ligne « à lire » par question (point 8) ; le mode test au 2e tour de Q1 (point 6).
- **La conscience** : K2 de ses contrôles, à refaire pour la nouvelle entrée (dit par elle).
- Non rejoués : la variante papier du point 12 et du point 14 (le banc ne joue pas la séance sur papier).

---

# Verdict de 13:20, le 13/10 (pour mémoire)

*App : `evaluation-qcm.staging.html`, md5 **`9a5f581453edbf5f7778d4fffb2f8fdd`**, `code-qcm` à `42e2d97` (tout ce qui était poussé à 13:12). Sorties : `sorties/2026-10-13_1312/`.*

## Verdict : **ça va.**

Les deux défauts de la reprise 6 et le point de 13:00 sont corrigés, et rejoués par le geste sur cette app ; aucun défaut ouvert dans ce que le banc et les jeux par le geste couvrent.

| Épreuve, sur l'app de 13:12 | Résultat |
| --- | --- |
| Contrôles de la conscience (ceux de `main`, md5 `1f1ac0d8…`) | **32 / 32** |
| Banc commun (la séance du scénario, 12 tablettes, B exigé de chacun, la correction au clic de Paul, le soir, le reste) | **211 / 211** |
| `banc-reprise2.js` : compteurs (« ONT RÉPONDU » au 2e tour sur les présents, comme `c-q1-tour2`), chrono et « Commencer la correction » au téléphone, « Rouvrir pour un élève », « pour tous », la console rechargée | **22 / 22** |
| `banc-reprise3.js` : l'alerte avec trouvée ; **la garde tranchée annonce la note du bilan** ; le « Oui » tardif ; « séance » au téléphone | **14 / 14** |
| `banc-reprise4.js` : l'alerte sans trouvée, aucun bouton à choix vide ; **la garde annonce la note du bilan** ; B pour chacun ; « Rouvrir pour tous » seulement pour ceux sans réponse ; la question écartée nulle part ; « +5 » au 1er tour ; le bandeau du téléphone | **27 / 27** |
| `banc-reprise5.js` : l'appel (téléphone sans séance, les deux « 🚀 Lancer la séance ») ; « ont répondu » au 1er tour sur ceux qui ont la main (console, téléphone, tableau), question close sur les présents (console, téléphone) ; « 1 réponse enregistrée » | **9 / 9** |

Rejoué par QCM-3 (DEMANDES, `fa42147`, `f722840`) : la garde pour « la feuille dit autre chose » et « je relis ce soir » dit la note du bilan.

Sur la même app (md5 `9a5f5814…`), relancés à 13:19 et finis à 13:29 : **les gestes rares 47 / 47** (1 min 55 s), **l'heure de demain 109 / 109** (10 min 25 s) (`sorties/2026-10-13_1312/branches.txt`, `demain.txt`).

---

# Verdict de 13:00 (pour mémoire)

*La reprise 6 (Paul 12:35). App : `evaluation-qcm.staging.html`, md5 **`e155c121d34265440a47eb0c148a5d07`**, `code-qcm` à `f722840` (tout ce qui était poussé à 12:50). Sorties : `sorties/2026-10-13_1250/`.*

## Verdict : **ça ne va pas** — un seul point, un écart à la maquette.

| Épreuve | Résultat |
| --- | --- |
| Contrôles de la conscience (ceux de `main`) | **32 / 32** |
| Banc commun (B exigé de chacun) | **211 / 211** |
| `banc-reprise3.js` : l'alerte **avec** trouvée, et (nouveau) **la garde de l'alerte tranchée annonce la note du bilan** | **14 / 14** |
| `banc-reprise4.js` : l'alerte **sans** trouvée, et (nouveau) **la garde annonce la note du bilan** ; B pour chacun ; « Rouvrir pour tous » ; la question écartée ; les temps changés | **27 / 27** |
| `banc-reprise5.js` : l'appel (téléphone sans séance, les deux « 🚀 Lancer la séance ») ; « ont répondu » au 1er tour sur ceux qui ont la main (« 1 / 12 ») à la console, au téléphone, au tableau ; question close sur les présents (« 1 / 24 ») au téléphone et à la console ; « 1 réponse enregistrée » | **9 / 9** |
| `banc-reprise2.js` : compteurs, réouvertures, la console rechargée | **21 / 22** : **au 2e tour, « ONT RÉPONDU » compte sur 12** (ceux qui ont la main) ; la maquette (`c-q1-tour2`, `c-q2-tour2`) dit « 23/24 », sur les présents |

Le point qui reste : le dénominateur du 2e tour. Le point 2 de la reprise 6 demande « le 2e tour suit la même règle » que le 1er ; la maquette dit l'inverse. Je suis la maquette, et je le mets à la conscience (`DEFAUTS-OUVERTS.md`, « QCM-4, 12:57 »). Le contrôle de `banc-reprise2.js` qui exigeait « le même dénominateur d'un tour à l'autre » (écrit à 08:40 d'après R4) était lui-même faux contre la maquette (« 0/24 » en réflexion, « 10/12 » au 1er tour) : il attend maintenant « / 24 » au 2e tour.

Limite : la garde est vérifiée pour deux décisions (raison au lecteur avec trouvée, raison à l'élève sans trouvée) ; QCM-3 a rejoué « la feuille dit autre chose » (`f722840`) ; « je relis ce soir » n'est rejoué par personne.

---

# Verdict de 12:30 (pour mémoire)

*La reprise 5 (`DEFAUTS-OUVERTS.md`, Paul 12:07). App : `evaluation-qcm.staging.html`, md5 **`b6b494034114f7b3e6db32920b8d752f`**, assemblée par `build.py` sur `code-qcm` à `7228ab2` (tout ce qui était poussé à 12:22). Sorties : `sorties/2026-10-13_1222/`. Les verdicts précédents, plus bas, restent pour mémoire.*

## Verdict : **ça ne va pas.**

Le chemin de l'heure passe (contrôles de la conscience 32 / 32, banc commun 211 / 211, `banc-reprise3.js` 13 / 13, `banc-reprise4.js` 26 / 26), mais à 12:28 il reste des écarts à la maquette ouverts, joués par le geste :

| Point de la reprise 5 | Rejoué par le geste (`banc-reprise5.js`, `sorties/2026-10-13_1222/reprise5.txt`, `captures-reprise5/`) | Résultat |
| --- | --- | --- |
| 1. Pendant l'appel, le téléphone sans séance | « Aucune séance active » pendant l'appel ; la séance paraît au clic de « 🚀 Lancer la séance » de la fenêtre | **passe** |
| 2. « 🚀 Lancer la séance » de la carte pendant l'appel (`c-appel`) | les deux boutons ouverts | **passe** |
| 4. Le dénominateur de « ont répondu » | maquette : `c-q1-tour1` « 10/12 », `p-reponse` « 10 / 12 », `b-reponse` « 10 / 12 » au 1er tour (ceux qui ont la main), puis « 23/24 », « 24/24 » (les présents). Tableau au 1er tour : **juste** (QCM-2, `7228ab2`) ; téléphone question close « 1 / 24 » : **juste** ; **console au 1er tour « 1 / 24 » (attendu « 1 / 12 ») et téléphone au 1er tour « 1 / 24 » (attendu « 1 / 12 ») : écarts ouverts** | **échoue** (2 / 8 en échec) |
| 4. « 1 réponse enregistrée » | au singulier | **passe** |
| `banc-reprise2.js` (compteurs, réouvertures, console rechargée) | à 12:22, arrêté au démarrage (son faux hub et un autre ont pris le même port : un défaut du banc) ; **rejoué seul à 12:30, après la livraison du verdict, sur la même app (md5 `b6b49403…`) : 22 / 22** | passe (ajouté à 12:31) |

Ce que QCM-3 a trouvé en jouant ce que R10 n'avait pas joué (point 3, `DEFAUTS-OUVERTS.md`, « QCM-3, point 3 (12:10) ») : « ❌ 2 pense : mal lu (tranché) » au lieu de « pensent » (à QCM-2) ; **non rejoué par moi à 12:28**, son état à 12:30 n'est pas vérifié.

Défauts ouverts, par propriétaire : **QCM-1, QCM-2** : « ONT RÉPONDU » à la console au 1er tour sur les présents au lieu de ceux qui ont la main ; **QCM-2** : le téléphone au 1er tour, de même ; « 2 pense » (à vérifier).

---

# Verdict de 11:30 (pour mémoire)

*La reprise 4 bis (`DEFAUTS-OUVERTS.md`, Paul 10:47 : accélérer). App livrée : `evaluation-qcm.staging.html`, md5 **`805732bcff4ec2fedd7d2831123037f8`**, assemblée par `build.py` sur `code-qcm` à `c5a818c` (tout ce qui était poussé à 11:22). Sorties : `sorties/2026-10-13_1055/` (l'assemblage complet, sur `3458d28`, la trouvée remise) et `sorties/2026-10-13_1122/` (le réassemblage de 11:22). Les verdicts précédents, plus bas, restent pour mémoire.*

## En une phrase

**Sur l'app de 11:22, tout ce que jouent le banc et les jeux par le geste passe, sans un échec : les contrôles corrigés de la conscience (32 / 32), le banc commun avec B exigé de chacun (211 / 211), et les points des reprises 2, 3 et 4 (22 / 22, 13 / 13, 26 / 26), dont les deux cas de l'alerte, B pour chacun dans les réouvertures, la question écartée nulle part et « Rouvrir pour tous » réservé à ceux qui n'ont pas répondu. Mais les trois relecteurs neufs n'ont couvert qu'une partie de l'heure (R9 jusqu'aux réouvertures, R11 la seule Q1, R10 rien : son automate n'a fait entrer personne), et plusieurs corrections faites sur leurs trouvailles n'ont été rejouées par aucun relecteur : je ne peux pas dire que l'heure va sans réserve.** Aucun défaut établi n'est ouvert à 11:30 dans ce que le banc et les relecteurs ont joué ; les réserves sont dans le tableau ci-dessous.

## Ce qui le prouve

| Épreuve | 10:55 (`3458d28`, md5 `3f25ee05…`) | 11:22 (`c5a818c`) |
| --- | --- | --- |
| Contrôles de la conscience **corrigés** (ceux de `main`, md5 `1f1ac0d8…` dans `EMPREINTES.md5`, extraits tels quels) | **32 / 32**, 109 s | **32 / 32**, 118 s |
| Banc commun (la séance du scénario, 12 tablettes ; **B sans tolérance** : chaque élève qui a répondu doit voir B ; la correction au clic de Paul ; le soir ; le reste) | **211 / 211**, 6 min 8 s | **211 / 211**, 6 min 4 s |
| Gestes rares | **47 / 47**, 2 min 11 s | (non rejoué) |
| L'heure de demain (4e, 11 questions) | **109 / 109**, 10 min 36 s | (non rejoué) |
| `banc-reprise2.js` : compteurs, chrono et « Commencer la correction » au téléphone, rouvrir pour un élève, pour tous, la console rechargée | **22 / 22** | **22 / 22** |
| `banc-reprise3.js` : l'alerte sur une question **trouvée au dernier moment** (→ 1 point des deux côtés, la règle de Paul), sa garde, le bilan ; le « Oui » tardif de B ; « séance » au téléphone | **13 / 13** | **13 / 13** |
| `banc-reprise4.js` : l'alerte **sans** trouvée (« juste → 1 point », « faux → 0 point »), aucun bouton à choix vide ; B pour chacun (1er et 2e tour, rouvert seul, rouvert « pour tous ») ; « Rouvrir pour tous » seulement pour ceux sans réponse, la garde sans les jamais entrés ; la question écartée nulle part (téléphone, correction, « c'est laquelle ? », bilan) ; l'heure de la coupure ; « +5 » au 1er tour pour le 1er tour ; le bandeau du téléphone ; pas de « ✗ » pour les sans-réponse | **24 / 24** | **26 / 26** (avec, depuis 11:09, « Rouvrir pour tous » après une réouverture pour un élève : ni « Pose ton stylo » ni B à ceux qui avaient répondu) |
| Fidélité à la maquette v9 | 126 scènes atteintes sur 157, 51 sans écart | — |
| Les écrans jamais atteints (`banc-jamais.js`) | 7 relevés ; l'alerte de Michel sur l'évaluation de 3e n'apparaît pas (selon QCM-2 : la donnée du banc ; à reprendre dans le banc) ; plafond de 5 min | — |
| Durée de l'assemblage complet | 12 min 33 s | 6 min 9 s (court : contrôles, banc commun, reprises, fidélité) |

## Les relecteurs neufs R9, R10, R11 (lancés par QCM-1, QCM-3, QCM-2 à 10:55–11:00) et ce que leurs trouvailles sont devenues

| Trouvaille | Relecteur | Devenue | Vu par |
| --- | --- | --- | --- |
| « ONT RÉPONDU » sur les entrés, au téléphone et au tableau (« 0 / 2 », « 2 / 2 » quand une tablette n'a pas répondu) | R9, R11 | corrigé selon QCM-1 (11:00, le dénominateur = les présents) | `banc-reprise2.js` (le dénominateur gardé d'un tour à l'autre) ; **le dénominateur des présents au téléphone et au tableau n'est rejoué par personne** |
| « 1 réponses enregistrées » | R9 | corrigé (QCM-1, 11:08) | non rejoué |
| « Rouvrir pour tous » : « Pose ton stylo » et B à qui avait répondu | R9, et `banc-reprise4.js` à 11:13 (Léa) | corrigé (QCM-2, `c5a818c`) | **`banc-reprise4.js` à 11:22 : passe** — rayé |
| « Rouvrir pour un élève » : console, téléphone, tableau restent à « Question close » | R9 | **pas un défaut** : c'est la maquette (`c-rouvrir-un`, « ⏸️ Question close »), demandé par la reprise 3 | `banc-reprise2.js` |
| Julien rouvert seul : B pas vu ; Léa : clic non compté après « +30 » | R9 (à confirmer) | non reproduits | `banc-reprise4.js` : B vu par l'élève rouvert seul, et par celui rouvert « pour tous » |
| Le téléphone montre la séance pendant l'appel | R9 | **ouvert** (QCM-2), non bloquant pour l'heure (le téléphone ne lance rien seul) | — |
| « Je commence » fermé, rien à cocher (attestation) | R9 | à comparer à `t-attest-1` ; le banc commun coche ligne par ligne et passe | banc commun |
| Accords au masculin (« pour qu'il réponde » pour Léa) | R9, R11 | écarté : le faux hub des relecteurs n'a pas le sexe des élèves ; avec lui, le banc commun voit les accords justes | banc commun |
| L'entrée « Identifie-toi » refusée | R10, R11 | **pas un défaut** : leur automate ne tapait que le code (il faut prénom, nom, code) ; R4, R5, R8 et le banc entrent | banc commun |
| Le tableau liste Adam, absent | R9 | **pas un défaut** (la maquette le liste) | — |
| R10 : l'estimation, la correction, l'alerte, le bilan, le soir | R10 | **non joués par un relecteur** | joués par le banc commun (211 / 211), `banc-reprise3.js` et `banc-reprise4.js` |

## Tranché par QCM-4 à la capture (demandé par R9)

- « 🚀 Lancer la séance » de la carte, grisé derrière la fenêtre de l'appel (`R9/cap/c2-appel.png`) : celui de la fenêtre est ouvert et lance la séance. La maquette (`c-appel`) a les deux ouverts : **écart à la maquette**, sans effet pour Paul (le geste est dans la fenêtre) ; je ne le change pas en défaut bloquant, la décision du comportement est à Paul.
- Le tableau qui liste Adam, absent, dans « 👥 Classe (25) » : **pas un défaut**, la maquette `b-reponse` le liste aussi.

---

# Verdict de 09:58 (pour mémoire)

*La reprise 3 (`DEFAUTS-OUVERTS.md`, « Reprise 3 du 13/10 », Paul 09:03, séance à 13:00). App livrée : `evaluation-qcm.staging.html`, md5 **`011ae89f91f62cc5796aa32d3fe8d4aa`**, assemblée par `build.py` sur `code-qcm` à `f95030b` (tout ce qui a été poussé jusqu'à 09:40). Sorties : `sorties/2026-10-13_0940/`. Les verdicts de 08:58 et de 08:30, plus bas, restent pour mémoire.*

## Reprise 3 — en une phrase

**Les défauts que la reprise 3 demandait de corriger passent au geste, sauf l'heure de la coupure ; mais le relecteur neuf de 09:41 (R8), en jouant autrement (Q2 et Q3 écartées, temps raccourcis, B au 2e tour), trouve de nouveaux défauts de l'heure qui toucheront la séance de 13:00 : pas de B après une réponse au 2e tour ou après une réouverture, « Rouvrir pour tous » qui rejoue un 2e tour entier, une alerte qui compte juste une réponse fausse, des questions écartées comptées fausses au bilan. L'heure ne va pas telle quelle.**

| Épreuve, sur l'app de 09:40 | Sortie | Résultat |
| --- | --- | --- |
| Contrôles de la conscience (non modifiés) | `controles.txt` | 22 / 30, 99 s ; les 8 échecs (K11 à K15) : K11 ne clique pas « ▶️ Commencer la correction », que la décision de Paul rend nécessaire |
| Fidélité à la maquette v9 (avec les écrans jamais atteints) | `fidelite.txt` | 127 scènes atteintes sur 157 (120 à 08:00), 51 sans écart |
| Banc commun (la séance du scénario, 12 tablettes, de l'appel au bilan, la correction au clic de Paul ; le soir ; le reste) | `banc.txt` | **211 / 211**, 6 min 12 s |
| Gestes rares | `branches.txt` | **47 / 47**, 2 min 13 s |
| L'heure de demain | `demain.txt` | **109 / 109**, 10 min 40 s |
| Reprise 3, points 1 à 4 rejoués par le geste (`banc-reprise2.js`) | `reprise2.txt`, `captures-reprise2/` | **21 / 22** : « Rouvrir pour tous » rouvre pour ceux qui n'ont pas répondu ; « Rouvrir pour un élève » n'annonce rien à la classe ni au téléphone ni au tableau ; « CONNECTÉS » compte les entrés, « ONT RÉPONDU » garde son dénominateur ; l'état vrai de la séance interrompue, la reprise garde le chrono ; au téléphone « ▶️ Commencer la correction » et le chrono. **Échoue : l'heure de la coupure** (celle du lancement) |
| Reprise 3, point 5 rejoué par le geste (`banc-reprise3.js`) | `reprise3.txt`, `captures-reprise3/` | **13 / 13** : l'alerte sur une question « Trouvée au dernier moment » part de la note réelle (→ 1 point des deux côtés), sa garde dit vrai, le bilan 3 / 3 ; le « Oui » de B cliqué dans les 2,5 dernières secondes est compté ; « Aucune séance active » au téléphone |
| Reprise 3, point 7 : les écrans jamais atteints (`banc-jamais.js`) | `jamais.txt`, `captures-jamais/` | atteints : `t-un-eleve`, `x610-1-b-julien`, `x610-2-b-michel`, `x610-6`, `x610-7` (et, aux essais, `c-deplacer`, `t-deplace`, `t-corr-seul`) ; écarts envoyés à QCM-2 ; **non atteints** : `x610-8`, `x610-9`, `x610-autonomie-*` (l'alerte de Michel sur l'évaluation de 3e n'apparaît pas : défaut probable, à confirmer) ; le script dépasse son plafond de 5 min |
| Relecteur neuf R8 (l'heure seule, 10 min, sur l'app de 09:40) | `banc/relecteurs/R8/trouvailles.md`, `cap/` | 16 trouvailles, 9 situations justes (dont : la correction ne part qu'au clic de Paul, la reprise garde le chrono, « Rouvrir pour un élève » liste les seuls entrés sans réponse, « Terminer ») |

### Défauts ouverts de l'heure à 09:58 (détail et captures : `DEFAUTS-OUVERTS.md`, section « Reprise 3 — QCM-4, 09:51 »)

| Propriétaire | Défaut |
| --- | --- |
| QCM-1, QCM-2 | pas de B après une réponse au 2e tour ni après une réouverture pour un élève ; ils sont mis « à lire ce soir : n'a pas dit » (R8) |
| QCM-1 | « Rouvrir pour tous » rejoue un 2e tour entier à ceux qui avaient répondu ; la garde liste les jamais entrés (R8) |
| QCM-1, QCM-2 | l'alerte compte juste une réponse fausse (« Milan → 1 point ») ; « → 1 point » à choix vide (R8) |
| QCM-1, QCM-2 | les questions écartées reviennent : « faux → 0 point » au bilan, proposées en co-évaluation, « 0 % » au téléphone (R8) |
| QCM-1, QCM-2 | « Séance interrompue » : l'heure de la coupure est celle du lancement (geste et R8) |
| QCM-2 | le passage du 1er tour avec une réponse courte ; « +30 » qui passe au 2e tour (R8) |
| QCM-2 | téléphone : les temps changés ne s'affichent pas, « ✗ » pour les sans-réponse (R8) |
| QCM-2 | `x610-1-b-julien`, `c-deplacer`, `t-deplace` : écarts avec la maquette ; l'alerte sur l'évaluation de 3e à confirmer |

---

# Verdict de 08:58 (pour mémoire)

*La reprise 2 (`DEFAUTS-OUVERTS.md`, « Reprise 2 du 13/10 », Paul 08:33). App livrée : `evaluation-qcm.staging.html`, md5 **`784ac5e802d8d225234bf93e46703c05`**, assemblée par `build.py` sur `code-qcm` à `8d35f41` (tout ce qui a été poussé jusqu'à 08:50). Sorties : `sorties/2026-10-13_0850/` (`resume.txt`, `controles.txt`, `reprise2.txt` et `captures-reprise2/`, `demain.txt`). Le verdict de 08:30, plus bas, reste pour mémoire.*

## Reprise 2 — en une phrase

**Sur l'app de 08:50, le point 1 passe (au téléphone : le chrono avance, « ▶️ Commencer la correction » s'ouvre quand tous sont prêts et lance la correction) et l'heure de demain passe en entier (109 / 109) ; les points 2, 3, 4 et 5 restent en défaut, rejoués par le geste : l'heure ne va toujours pas telle quelle.**

| Point | Propriétaire | Rejoué par le geste (`banc/banc-reprise2.js`, `sorties/2026-10-13_0850/reprise2.txt`) | Résultat |
| --- | --- | --- | --- |
| 1. Téléphone : « ▶️ Commencer la correction », le chrono | QCM-2 | tous prêts : rien ne part seul ; au téléphone le bouton s'ouvre ; son clic lance la correction (`deroule.ph = lecture`) ; le chrono passe d'une valeur à l'autre en 3 s | **passe** |
| 2. « 🔓 Rouvrir pour tous » | QCM-1 | Q1 close, une tablette sans réponse ; la garde liste aussi les 20 présents jamais entrés ; « 🔓 Rouvrir pour ceux qui n'ont pas répondu » : la question reste close (`ph = close`), la tablette sans réponse ne la retrouve pas (`10-c-rouvrir-tous.png`, `11-t-rouvert-tous.png`, `12-c-rouvert-tous.png`) | **échoue** |
| 3. « 🔓 Rouvrir pour un élève » | QCM-1, QCM-2 | « Rouvrir pour Léa » : le téléphone affiche « Phase : réponse — 2e tour : moitiés de droite », le tableau « 🖊️ POSE TON STYLO 2e tour » pour la classe ; la console reste « Question close » ; après sa réponse, la console passe en « ✋ Phase RÉPONSE — 2e tour, moitiés de droite » et Michel « répond… » (`04-p-rouvert-un.png`, `05-b-rouvert-un.png`, `08-c-apres-rouvert-un.png`). Julien, qui avait répondu, ne se voit pas redonner la question | **échoue** |
| 4. La console rechargée | QCM-1, QCM-2 | pendant la réflexion de Q2 : l'heure de la coupure est juste ; l'état dit « question 2, 1er tour (moitiés de gauche) » au lieu de la réflexion ; « 🔄 Reprendre » remet le chrono à son début (`deroule.depuis` repoussé de 16 s) (`13-c-interrompue.png`, `14-c-reprise.png`) | **échoue** (l'heure : passe) |
| 5. Les compteurs | QCM-1, QCM-2 | « ONT RÉPONDU » garde son dénominateur : passe ; « CONNECTÉS » : « 24/24 » à « ▶️ Lancer Q1 » avec 4 élèves entrés (`01-c-q1-reflexion.png`) | **échoue** (le dénominateur : passe) |
| 6. L'alerte et « Trouvée au dernier moment » | QCM-1, QCM-2 | la séance jouée jusqu'au début de la correction (`banc/relecteurs/R7/`) ; l'alerte et sa garde n'ont pas été atteintes avant 08:56 | **non rejoué** : ouvert (R5, 08:13) |
| 7. « Aucune séance active » | QCM-2 | (QCM-2, `93d6d03`) | non rejoué |
| 8. « Oui » tardif à B | QCM-1 | à confirmer | non rejoué |

Contrôles de la conscience : **22 / 30**, 100 s ; les 8 échecs, K11 à K15, sont ceux de 08:00 : K11 ne clique pas « ▶️ Commencer la correction » que la décision de Paul rend nécessaire. L'heure de demain (`demain.txt`, finie à 09:00, ajoutée après la livraison de 08:57) : **109 / 109**, 10 min 30 s, la correction au clic de Paul comprise. Ce qui reste : les points 2, 3, 4, 5 (échouent au geste), 6 et 8 (non rejoués) — l'heure ne va pas telle quelle.

---

# Verdict de 08:30 (pour mémoire)

*Mandats : `MANDATS/CODE-QCM/COMMUN.md` et `QCM-4-BANC.md` (branche `main`) ; la reprise : `DEFAUTS-OUVERTS.md`, « Reprise du 13/10 » (Paul, 07:22). App livrée : `evaluation-qcm.staging.html`, md5 **`360af4ba39ad028143c258ad3b42c408`**, assemblée par `build.py` sur `code-qcm` à `d669ea6` (tout ce qui a été poussé jusqu'à 08:00). Le verdict de 06:00 (app `1fed29e0…`, puis `172efa3c…` à 06:29) est remplacé par celui-ci.*

## En une phrase

**La décision de Paul est tenue (la correction ne commence que sur son clic) et le chemin de l'heure tel que la maquette le joue passe en entier sur tous les appareils, le soir et le reste aussi ; mais les relecteurs neufs de 08:00 voient encore, dans des gestes que Paul fera (rouvrir pour un élève ou pour tous, une console rechargée, une alerte de co-évaluation sur une question trouvée au dernier moment), des défauts de l'heure ouverts : l'heure ne va pas telle quelle.** Le soir va, sous une réserve ; le reste va.

## Ce qui le prouve

| Épreuve | Sortie | Résultat | Durée |
| --- | --- | --- | --- |
| Contrôles de la conscience (`AUDITS/CONTROLES-QCM-APP/controles-app.js`, md5 vérifiés, non modifiés) | `sorties/2026-10-13_0800/controles.txt` | **22 / 30** : K1 à K10 passent ; les 8 échecs (K11 à K15) viennent de ce que K11 attend que la correction commence seule et ne clique pas « ▶️ Commencer la correction », ce que la décision de Paul de 07:22 interdit désormais (QCM-1 le signale aussi, DEMANDES 07:54). Ce que K11 à K15 vérifient ensuite (l'ordre, « 💡 Révéler », la trouvée, le bilan 3 / 3 et 1 / 3, la base) est vérifié par le banc, après le clic | 98 s |
| Banc commun : la séance du scénario, console + 12 tablettes + téléphone + tableau, de l'appel au bilan (24 notes comparées à la règle), avec **la correction au clic de Paul** (fermé, ouvert quand tous ont coché, rien sans le clic, puis la lecture) ; le soir ; le reste | `sorties/2026-10-13_0800/banc.txt` | **211 / 211** | 6 min 1 s |
| Gestes rares (démo, entrée qui se trompe, 👁, temps ajouté, départ et retour, écarter / remettre, annuler, rouvrir, finir et reprendre, console perdue, tablette et téléphone rechargés) | `branches.txt` | **47 / 47** | 2 min 7 s |
| L'heure de demain (4e, JSON collé, 11 questions, élève seul, correction au clic de Paul, soir, PDF) | `demain.txt` | **109 / 109** | 10 min 32 s |
| Fidélité à la maquette v9 | `fidelite.txt` | 120 scènes atteintes sur 157 (hors MJPC), 49 sans écart ; 37 non atteintes | — |
| Les trois bancs en même temps, avec les contrôles et la fidélité | `resume.txt`, `synthese.txt` | assemblage complet | **12 min 16 s** (< 20 min) |
| Relecteurs neufs de 08:00 (sous-agents qui n'ont vu ni le code ni le banc : la maquette, son README, l'adresse de l'app, et la décision de Paul) sur l'app de 08:00 | `banc/relecteurs/R4`, `R5`, `R6` : `trouvailles.md`, `cap/` | R4 (de l'appel à la fin des questions) 13 trouvailles ; R5 (de l'estimation au bilan) 11 ; R6 (la fin et le soir) 6 ; retenus : **9 défauts**, dont 4 déjà connus | 8 à 12 min chacun |
| Relecteurs neufs de 05:00 (R1, R2, R3, sur l'app de 05:00) | `banc/relecteurs/R1`, `R2`, `R3` | 11 défauts ; 3 rayés à 08:13 (rejoués corrigés), 1 rayé (pas un défaut) | — |

Captures de l'heure à chaque phase et sur chaque appareil : `sorties/2026-10-13_0800/captures/` et `captures-demain/`. L'assemblage d'essai de 07:46 sur l'app de 06:16 (`sorties/2026-10-13_0746`) montre que le banc voit bien une correction qui commence seule (5 échecs).

## Par partie

### L'heure de classe — **ne va pas telle quelle**

Ce qui va, prouvé par le geste (banc et relecteurs) : la décision de Paul (la correction attend son clic ; rien d'autre ne part seul : la question suivante, l'estimation, la co-évaluation, le bilan attendent un geste) ; l'appel, l'entrée, les attestations, les questions à leurs deux tours avec B, l'élève qui ne clique rien, la question sans réponse close sans rien lancer, l'estimation, la correction, « 💡 Révéler », la trouvée au dernier moment, la co-évaluation à son ouverture, le bilan juste pour les 24 élèves, « 🛑 Terminer » même la console fermée aussitôt.

Rayés depuis 06:00, rejoués corrigés par un relecteur neuf : « 0 pense (tranché) » (R5) ; une séance terminée restée en cours (R6) ; « 🔓 Rouvrir pour un élève » qui listait les non-entrés (R4) ; les absents au tableau (pas un défaut : la maquette les liste).

Défauts ouverts (détail, gestes, captures : `DEFAUTS-OUVERTS.md`, sections R4, R5, R6 en tête) :

| Propriétaire | Défaut | Quand il se produira |
| --- | --- | --- |
| QCM-1, QCM-2 | « 🔓 Rouvrir pour un élève » rouvre la question pour toute la classe (téléphone, tableau, puis un 2e tour pour tous) | chaque « Rouvrir pour un élève » |
| QCM-1 | « 🔓 Rouvrir pour tous » ne rouvre plus rien | chaque « Rouvrir pour tous » |
| QCM-1, QCM-2 | l'alerte de la co-évaluation ignore « Trouvée au dernier moment », et sa garde se contredit (« reste à 0 ; note 3 / 3 ») | un élève trouvé au dernier moment qui signale ❌ cette question |
| QCM-1, QCM-2 | « ⚠️ Séance interrompue détectée » : état et heure faux ; la reprise remet le chrono de réflexion à son début | chaque console rechargée |
| QCM-1, QCM-2 | les compteurs : « 24/24 CONNECTÉS » à Q1 avec 4 entrés ; « ONT RÉPONDU » change de dénominateur | des présents qui n'entrent pas |
| QCM-2 | au téléphone, « ▶️ Commencer la correction » reste fermé quand tous sont prêts | chaque correction lancée du téléphone |
| QCM-2 | le chrono du téléphone ne bouge pas | chaque question |
| QCM-2 | au téléphone, « Aucune session active » (README point 8 : « séance ») | après chaque séance |
| QCM-1 (à confirmer) | « n'a pas dit si sa feuille disait son clic » pour un « Oui » cliqué dans les dernières secondes | un élève qui répond tard à B |

Non rejoués par un relecteur neuf, faute de temps : B demandé sans clic, la question sans réponse dans l'ordre de la correction (corrigés selon QCM-2 et QCM-1 ; le banc ne les joue pas).

### Le soir — **va, sous une réserve**

Banc du soir 38 / 38 (Résultats par niveau, le tableau de la séance, les fiches, « ✔ Marquer lue », « Que dit la feuille ? », le point d'autonomie, rendre les copies, le PDF, « 📊 Mes évaluations », la corbeille, la sauvegarde). Réserves : « Que dit la feuille ? » corrigé par QCM-3 (`463d0bf`) n'a pas été rejoué par un relecteur (R6 bloqué avant les questions) ; une séance terminée avant Q1 compte « 📌 12 feuilles à lire » (R6, QCM-1 et QCM-3).

### Le reste — **va**

16 / 16 et 22 / 22 pages ; écarts de fidélité nommés et justifiés dans `banc/ecarts-maquette.json` ; non joués par le banc : la séance sur papier en entier, le rattrapage, une partie du mode test (37 scènes non atteintes, listées dans `fidelite.txt`).

## Par propriétaire

- **QCM-1 · SOCLE** : 7 défauts ouverts (rouvrir pour un élève, rouvrir pour tous, alerte et trouvée, séance interrompue, compteurs, « n'a pas dit » à confirmer, 12 feuilles à lire), dont 4 partagés avec QCM-2 et 1 avec QCM-3.
- **QCM-2 · HEURE** : 7 défauts ouverts (les 4 partagés, plus : « Commencer la correction » au téléphone, le chrono du téléphone, « session »).
- **QCM-3 · SOIR** : 1 défaut partagé (12 feuilles à lire) ; « Que dit la feuille ? » à rejouer.
- **La conscience** : K11 des contrôles ne clique pas « ▶️ Commencer la correction » ; avec la décision de Paul, K11 à K15 ne peuvent plus passer sans ce clic.

## Pour l'audit de 08:30

Le chemin nominal de l'heure et la décision de Paul sont sûrs : 211 / 211, 47 / 47, 109 / 109 sur l'app de 08:00. Les défauts ouverts touchent des gestes que Paul fera probablement (rouvrir, une console rechargée, le téléphone). Le banc se rejoue par `bash LIVRAISONS/CODE-QCM/banc/assembler.sh` (12 min).
