# CONTRAT COMMUN DES LOTS DU PLAN 10 JOURS — ATTENDUS (A1), DICTÉE (D1), PROMPT (P1), APPS (S1-S3)

*Conscience n°13, 22/10/2026. Ordre de Paul (21/10, 21:46) : « dans 10 jours on doit avoir le site fonctionnel ainsi que toutes les apps », toutes les dettes réglées, tout le prévu codé ; (22:09) « rien ne doit être créé qui n'existe pas déjà » ; (22/10, 09:31) « Go, avec audit préalable de tes mandats par les exécutants, comme on a fait là pour l'intégration du déroulé ». Le plan : `MANDATS/PLAN-10-JOURS.md`. Ce contrat vaut pour chaque lot ; le mandat du lot (`MANDAT-<X>-*.md`) dit le reste. Quand les deux se contredisent, c'est écrit dans `AUDIT-DU-MANDAT.md` (mission 0), et la conscience tranche au §9.*

## 1 · CE QUE ÇA CHANGE POUR LA CLASSE
Le 31/10, Paul ouvre le site, lance une heure, joue une dictée, une réécriture, un débat, un QCM, et rien ne casse : aucune dette au registre, chaque app dit à l'élève ce qui le concerne et rien d'autre, chaque geste du professeur porte son infobulle, chaque donnée vit au hub et se redessine sans rechargement. Chaque mandat dit, en tête, ce que **son** lot change pour la classe.

## 2 · LES OBJETS DE DÉPART (md5 à vérifier avant de toucher quoi que ce soit)
La production est le dépôt `siteflow-io/monsieurjaipascompris` (clone en lecture ; `main`, commit `7cddc22` au 22/10 09:40). Le fichier de départ de chaque lot et son empreinte :

| lot | fichier de production | octets | md5 |
|---|---|---|---|
| D1 DICTÉE | `correction_dictee.html` | 1 011 698 | `9d5dcfb612a70a8182689566b1fe23c5` |
| S1 APPS | `reecriture.html` | 275 929 | `1d9ce172495d8b2a2070c4876866ebd6` |
| S1 APPS | `reecriture_bb4e.html` | 145 138 | `f91b47301b714847ddb91d9d7e6163ac` |
| S2 APPS | `dictee_universelle.html` | 1 997 272 | `a9020d67543394c5780347aedb484980` |
| S2 APPS | `applause_meter.html` | 669 748 | `90fa5aa47ccaf777539b93b5eaf95ce5` |
| S2 APPS | `worktrack.html` | 1 059 696 | `7184a11ac2f96c3fd89f26ae47ba8bb4` |
| S2 APPS | `analyse_logique.html` | 585 625 | `f93590493274362b9696495ba5b611d5` |
| S3 APPS | `pilotage_debat_s3.html` | 490 509 | `e843757ae6f49ea3d3f549a4f5f0b41c` |
| S3 APPS | `Console_ateliers_revisions.html` | 436 556 | `c3746887d2198629408e85fbe2007545` |
| S3 APPS | `redaction_dugain_v3.html` | 349 982 | `f61f1ec0992946f36ad538bfe57f151f` |
| S3 APPS | `etude_dugain.html` | 318 030 | `66cf38bfcfea2007259f2e7752883cba` |
| A1 ATTENDUS, P1 PROMPT | pas de fichier html : des données et un document (le mandat dit lesquels) | — | — |

Hors des lots : `index.html` (le déroulé, E1-E4 puis E1'-E4'), `evaluation-qcm.html` (conscience n°12), `deploy-monitor.html`. **Un exécutant ne touche qu'aux fichiers de son lot.** Le registre des dettes est `docs/MJPC6-DETTES.md` (prod) : les numéros que les mandats citent y renvoient, mot pour mot — on les vérifie contre le code, jamais sur souvenir.

## 3 · OÙ ON TRAVAILLE
- Le sas `siteflow-io/mjpc-chantier`, **une branche par lot** : `lot/attendus` (A1), `lot/dictee` (D1), `lot/prompt` (P1), `lot/apps-s1`, `lot/apps-s2`, `lot/apps-s3` (S1-S3). Jamais `main` (la conscience y écrit les relances et les audits ; `git pull --rebase origin <branche>` avant chaque poussée ; `git fetch` et ne pousser que si rien n'a bougé en amont depuis le banc).
- Les livraisons dans `LIVRAISONS/PLAN-10-JOURS/<X>/` (X = A1, D1, P1, S1, S2, S3) : le fichier candidat (même nom que la production), `JOURNAL.md`, `NOTE.md`, `AUDIT-DU-MANDAT.md`, `bancs/`, `sorties/`, `captures/`, `EMPREINTES.md5`.
- **Rien ne s'écrit au hub réel** (`mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app`) par un exécutant : les bancs tournent sur un faux hub en page (le patron : `AUDITS/INTEGRATION-DEROULE/parcours.mjs`, lignes 1-46 — `window.fetch` et `WebSocket` interceptés, `__HUB` en mémoire, les écritures tracées) ou sur un nœud de test de l'app (`_test_…`, déjà existants au hub : `/classes/_TEST`, `_test_correction_dictee`, `_test_pilotage_debat_s3`). Un lot de données (A1) livre le JSON et le script qui le pose ; la pose au hub réel est une **promotion** : le mot de Paul, le geste de la conscience, le point de retour écrit avant.
- Un seul outil de banc : Playwright + Chromium (le global `/opt/node22/lib/node_modules/playwright` s'il est là, sinon `npm i playwright && npx playwright install chromium`). Le banc passe **par le geste** (clic, frappe, capture), jamais par l'appel direct d'une fonction. **Un banc unique** `bancs/banc.mjs` rejoue tout le lot et échoue si un seul geste échoue ; `sorties/<HHMM>/` garde la sortie réelle, horodatée, le md5 du fichier joué en tête.

## 4 · MISSION 0 — L'AUDIT DU MANDAT (Paul, 22/10 : « avec audit préalable de tes mandats par les exécutants »)
Avant de coder, l'exécutant **confronte son mandat et ce contrat au code réel** (le fichier de production de son lot, le registre des dettes, les cadrages que le mandat nomme) et pousse `LIVRAISONS/PLAN-10-JOURS/<X>/AUDIT-DU-MANDAT.md` — sa première poussée, dans l'heure :
1. **Ce qui est faux** : une fonction nommée qui n'existe pas ou ne fait pas ce que le mandat dit ; une plage de lignes qui ne correspond pas ; un chemin du hub qui n'est pas celui que l'app écrit ; une dette citée qui n'est pas au registre, ou qui y est déjà cochée ✔.
2. **Ce qui est contradictoire** : entre le mandat et le registre, entre le mandat et un cadrage, entre deux lots (un même fichier à deux exécutants, une dette à personne).
3. **Ce qui manque** : une dette ouverte du registre sur le fichier du lot que le mandat ne cite pas (l'exécutant relit la section de son fichier dans `docs/MJPC6-DETTES.md` en entier) ; un geste de l'app qui marche aujourd'hui et que le mandat ferait tomber.
4. **Ce qui est impossible à mesurer** tel que demandé, avec la mesure proposée à la place.
5. **Le verdict par point du mandat** : « tient » / « faux, parce que… » / « incomplet, il manque… ». Rien d'autre : pas de réécriture du mandat, pas de design.

Puis il continue sans attendre : il code ce qui n'est pas contesté ; ce qui est contesté attend la réponse de la conscience dans `MANDATS/PLAN-10-JOURS/RELANCES/<X>.md` (au premier réveil, une heure au plus). Un audit vide (« tout tient ») est suspect : la conscience le relit ligne à ligne.

## 5 · CE QU'ON LIVRE, ET COMMENT ON TOURNE
- `JOURNAL.md` à chaque poussée : l'heure (Paris), fait · reste · bloqué · relances traitées (« traitée le <heure>, commit <sha> »). Une ligne par heure au moins, même s'il n'y a rien.
- Chaque dette réglée = une ligne au JOURNAL avec son numéro de registre et le commit ; chaque geste neuf = son banc (rouge avant, vert après) et son infobulle écrite pour Paul (ce qu'il fait, ce qu'il coûte) ; un bouton grisé dit sa raison en clair.
- `captures/` : écran entier (1366 × 768), nommées par le geste, **avant / après du même parcours** — c'est sur elles que Paul promeut.
- `NOTE.md` à la fin : ce que ça change pour la classe ; le md5 de départ et d'arrivée ; chaque fonction touchée (nom, taille avant/après) ; ce qui tombe (compté) ; les bancs et leurs sorties ; les captures ; **ce qui reste — jamais une dette cachée** : ce qui n'est pas fait est écrit, avec son numéro de registre. Le signal de fin : **« lot livré : 0 ouverte (commit) »** dans la NOTE, sur une tête où `bancs/banc.mjs` est vert.
- L'exécutant tourne sans s'arrêter : il pousse chaque morceau dès qu'il est fait, et **reprogramme son propre retour toutes les 50 minutes** (une tâche planifiée, comme E1-E4 : relire les relances d'abord, puis continuer). La conscience audite toutes les heures (réveils), rejoue le banc du lot, relance par gravité dans `RELANCES/<X>.md`, met le plan à jour.

## 6 · CE QUI NE CHANGE PAS
- **Rien ne se crée qui n'existe pas déjà** : les lots règlent les dettes et codent le prévu cadré ; aucun écran, nœud, module ou app nouveau hors de ce que le registre, les cadrages et le mandat écrivent déjà. Ce qui serait neuf est écrit dans la NOTE comme « hors plan », pas codé.
- Jamais de service ou d'API payante ; pas d'annonce aux élèves dans une livraison ; aucun terme technique dans un texte vu par un élève ; côté élève tout est tactile (« clique », jamais « touche »), consigne en clair, jamais « va voir ton professeur » ; une compétence se nomme par sa reformulation élève.
- Une page ne dépend jamais d'un rechargement : chaque donnée est abonnée à sa source (`.on('value')`, `storage`, `BroadcastChannel`), un redessin ne touche pas l'élément qui a le focus, garde le défilement, n'efface jamais une saisie en cours ; enregistrement à chaque geste, reprise exacte à la réouverture.
- Le style du code de chaque app reste le sien (fichier html autonome, React 18 UMD avec `h = React.createElement` là où c'est déjà le cas, Firebase 8.10.1 par CDN) : pas de JSX, pas de bundler, pas de module nouveau.
- Les noms des nœuds du hub que l'app écrit aujourd'hui ne changent pas (les autres apps et le site les lisent).

## 7 · CE QUI ARRÊTE UN EXÉCUTANT (et rien d'autre)
Rien. Si le mandat est contradictoire ou impossible sur un point, on l'écrit dans `JOURNAL.md`, on livre le reste, on continue.

## 8 · LA PROMOTION
Elle n'est jamais le geste de l'exécutant. Quand la NOTE dit « lot livré : 0 ouverte (commit) » et que la conscience a rejoué le banc vert sur cette tête, la conscience audite (écrans changés et voisins, un parcours fixe, captures entières avant/après), écrit à Paul « À jouer : … · en cours : … · ouvert : … » ; sur son mot « promeus », elle copie le fichier en production, dans le tour même : bit à bit, journal, dettes ✔, point de retour, index des fonctions, « où trouver quoi », adresse avec `&v=`, tests geste par geste.

## 9 · LES DÉCISIONS DE LA CONSCIENCE (ce que les audits de mission 0 et les réveils ont changé)
*(numérotées 9.1, 9.2… ; chacune dit la date, la source — quel audit, quelle relance — et ce qu'elle change)*

MEMO
