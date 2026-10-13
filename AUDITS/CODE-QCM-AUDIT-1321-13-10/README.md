# Contrôle de la conscience n°12 — 13/10/2026 13:21, seconde passe de la reprise 6 : mise en ligne de la 8.0.0

*Tour 704, réveil programmé de 13:21 (pas de Paul). Ordre de Paul : 12:35, « Il faut terminer coûte que coûte. » ; 12:38, « Je veux que ce soit fait, point. 13h30 dernier délai. »*

## Verdict : ça va ; en ligne à 13:26:43

| Épreuve | Résultat |
| --- | --- |
| VERDICT.md de QCM-4 de 13:20 (`ff8014b7`) | « ça va » : contrôles 32/32, banc commun 211/211, reprises 2 à 5 : 22/22, 14/14, 27/27, 9/9 |
| Reconstruction par `build.py` sur `code-qcm` à `42e2d974` | md5 `9a5f581453edbf5f7778d4fffb2f8fdd`, celui du VERDICT |
| Contrôles de la conscience (md5 `1f1ac0d8…`, empreintes vérifiées) | 32 vérifications, 0 échec, 110 s (`controles-app-sur-42e2d97.txt`) |
| Sonde B | 17 vérifications, 0 échec, 97 s (`sonde-b-sur-42e2d97.txt`) |
| Mise en ligne | production `2c93c3c`, `git push origin HEAD:main` à 13:25:54 ; en ligne et bit à bit à 13:26:43 (md5 `9a5f5814…`, 2 021 094 o) ; `index.html` inchangé (`ac792b28…`) |

Les deux défauts de la reprise 6 sont corrigés et rejoués par le geste :
- la garde de l'alerte tranchée dit la note du bilan, avec et sans trouvée (`banc-reprise3.js`, `banc-reprise4.js`, et QCM-3 par le geste) ;
- « ont répondu » est compté sur ceux qui ont la main au 1er tour, sur les présents au 2e tour et question close, comme la maquette (`banc-reprise2.js`, `banc-reprise5.js`).

Le point de 13:00 venait d'une phrase fausse de la conscience dans la reprise 6 (« Le 2e tour suit la même règle »), corrigée d'après la maquette (`c-q1-tour2`).

Encore en cours à la mise en ligne : les gestes rares et l'heure de demain, rejoués par QCM-4 sur cette app, résultat vers 13:30. Sur l'app de 10:55, ils donnaient 47/47 et 109/109.

Point de retour : `docs/MJPC6-restauration.md` (production), la 7.7.2, blob `07f11ffcc65e`.
