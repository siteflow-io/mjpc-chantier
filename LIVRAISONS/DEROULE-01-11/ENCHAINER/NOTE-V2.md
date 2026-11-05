# MANDAT V2 — FINIR « ▶ SÉANCE SUIVANTE DANS CETTE HEURE » · suite de `23359ecdb` (assemblé V `d81d142b`)

## 0 · Les erreurs du mandat (mesurées)
1. **La preuve demandée au point 1 ne prouve pas la marque.** « Une séance 1 prévue en deux heures, enchaînée à sa 2e heure — la case suivante dit la séance 2 » : à l'heure 2/2, les heures jouées atteignent les heures prévues, et l'emploi du temps compte la séance finie **sans** la marque `seanceFaite`. La case suivante ne dit donc rien de la marque. La marque est prouvée autrement : relue au magasin du mode test sur le chemin de l'heure (contrôle 3 : `seanceFaite: true`).
2. **Le cas de Paul (heure 2/2) n'avait pas de bouton.** Avec la règle de V, chaque diapo de la séance devait être « finie » dans la page, mais la page ne connaît que l'heure qui tourne. Les diapos de l'heure 1, jouée un autre jour, n'y comptaient pas. Je n'ai pas rejoué la règle de V sur ce cas : je ne sais pas ce qu'elle aurait donné. Réglé (`dr_enchSeanceFaite`) : une diapo d'une heure d'avant, close avec cette heure et pas reportée dans l'heure qui tourne, est derrière la classe. Une diapo reportée revient dans l'ordre de l'heure, et il faut alors la faire.
3. **Le faux hub n'a pas de séance 1 en deux heures.** Ses 110 minutes font 3 heures (la case dit « heure 2/3 »). La sonde ramène ses durées à 0,5 (55 minutes), et garde la trace jouée le 07/09 : la case du 14/09 dit « heure 2/2 ». **Dette trouvée en route, non réglée :** avec des durées à 0,7 (77 minutes), la case dit « heure 2/2 » alors que le pilotage découpe une 3e heure (les diapos 20 à 24 portent `heure: 3`). La case et le pilotage ne comptent pas les heures de la même façon. Dans ce cas, à « 2/2 », le bouton ne paraît pas, puisqu'il reste les diapos de la 3e heure.
4. **Le temps** : les étapes 14 à 16 ont des limites de 1500 + 1800 + 1800 s. Avec le reste, elles ne tiennent pas dans 45 minutes. Elles ne sont pas faites (§3).

## 1 · Ce qui change
- `dr/dr-classe.js` :
  - En mode test, le paquet de l'heure (`dr_paquetPatch`) garde `seanceFaite`, comme il garde les absents. Avant, il se réécrivait entier après le PATCH de la marque et l'effaçait (mesuré : `ecrire …/heures/<clé>`, puis `patch seanceFaite`, puis à nouveau `ecrire …/heures/<clé>`).
  - Le point 2 du §0 (`dr_enchSeanceFaite`).
- `dr/dr-recit.js` : le récit ne raconte que les diapos de sa séance. En mode test, pendant que « Relire cette heure » passe d'une séance à l'autre, le journal relu était celui de l'autre séance, ce qui donnait « reading 'actId' » ×2. Le récit final est contrôlé par son titre (séance 1, puis séance 2).
- `index.html` :
  - La case jouée par deux séances dit ce que chaque séance a fait, avec ses vrais nombres : « Close · Séance 1 : 16 diapos jouées ; puis Séance 2 : 1 diapo jouée · 10 reportées ». Avant, les deux séances étaient additionnées (« 25 diapos jouées · 10 reportées »).
  - `edtSeancesDeTrace` donne le rang de chaque séance dans son chapitre.
- `sonde-enchainer.mjs` : le cas en deux heures (`MJPC_DEUX=1`), les nombres de la case comparés au hub, le titre de chaque récit relu, le témoin (ce que Paul voit, imprimé « TÉMOIN » pour la comparaison base → après), le chemin de l'heure du témoin (avant, un slug écrit en dur ne trouvait pas la trace).

## 2 · La preuve (par le geste, faux hub du banc) — `sorties/v2-*.txt`
Assemblé `d2533e752457390f2ed29e1136898f72`.
- **La séance 1 en deux heures, enchaînée à sa 2e heure (le cas de Paul)** :
  - **vraie heure 26/26** (`v2-vh-deux-heures.txt`) et **mode test 28/28** (`v2-test-deux-heures.txt`).
  - La case du 14/09 dit « heure 2/2 ». Le bouton paraît sur la dernière diapo. Le clic ouvre la garde, puis la séance 2 démarre (heure 1, même créneau).
  - La séance 1 est close et marquée faite (`seanceFaite: true`). En mode test, la marque se relit au magasin.
  - L'absent est repris. Le tableau passe à la séance 2 sans écran d'attente.
  - La case dit : « Close · Séance 1 : 16 diapos jouées ; puis Séance 2 : 1 diapo jouée · 10 reportées ». Au hub : 16, 0 ; 1, 10.
  - La case suivante (15/09) dit « L'Albatros heure 2/3 ».
  - « Relire cette heure » ouvre le récit de la séance 1 (son titre, pas celui de la séance 2), puis « ▶ La suite de cette heure » ouvre le récit de la séance 2.
  - 0 écriture sous /site/3e en mode test. **0 erreur de page.**
- **La séance 1 en une heure (le cas de V)** : vraie heure 26/26 (`v2-vh-une-heure.txt`), mode test 28/28 (`v2-test-une-heure.txt`, avant 23/25). 0 erreur de page.
- **Le témoin** (une classe qui clôt par « ■ Clore l'heure », sans enchaîner) : base `46ce703a1` (assemblé `73030306`) → après. Les 4 lignes « TÉMOIN » sont identiques : la case du jour (« Close · 24 diapos jouées »), la case suivante (« L'Albatros heure 1/3 »), la case ouverte, et la Relecture (8328 caractères, md5 `b41ca3fa…`, pas de « La suite »). Après : 12/12 (`v2-temoin-*.txt`). La base ne passe pas les contrôles du bouton, qui n'existe pas dans sa version.
- **Parcours P0-P12 : vert** (30 contrôles ok, assemblé `d2533e75`, `sorties/v2-parcours.txt`).
- **Captures** (écran entier, 1920×1080, ×2) dans `scratchpad/ENCHAINER-captures-V2/{vh,test,vh-une-heure}/` : `vh/vh-6-la-case-ouverte.png` (la case du jour ouverte, en vraie heure) et `test/test-1-le-bouton.png` (le bouton, en mode test).

## 3 · Ce qui reste
- **La répétition n'est pas prouvée.** La sonde (`MJPC_MODE=rep`) échoue dès son étape 1 (« la séance 1 tourne », `cours: null`), puis la boucle des diapos dépasse 200 s (`v2-rep-non-prouve.txt`). Je ne sais pas si l'erreur vient du site ou de la sonde.
- Les étapes 14, 15 et 16, avec les sondes du banc mises à jour ; la sonde du bilan partie B.
- La dette du §0.3 : la case et le pilotage ne comptent pas les heures de la même façon.
