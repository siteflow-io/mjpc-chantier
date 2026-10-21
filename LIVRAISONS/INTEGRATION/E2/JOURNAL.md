# JOURNAL — E2, la classe et l'heure

*Tenu à chaque poussée : l'heure (UTC), fait · reste · bloqué · relances traitées. H0 = 07:24 UTC.*

## 07:35 UTC — poussée 1 : l'audit du mandat (mission 0)

- **Fait** : lu en entier, dans l'ordre, `CONTRAT.md`, `PLAN-INTEGRATION-DEROULE.md`, `MANDAT-E2-CLASSE-HEURE.md`, `AUDITS/INTEGRATION-DEROULE/README.md`, `RECYCLAGE-ANCIEN-DEROULE.md`, `CADRAGE-1-LA-CLASSE.md`, `CADRAGE-TEMPS.md`. md5 vérifiés : production `ac792b28…` (1 838 175 o), maquette p8-5g `62d9557a…` (605 996 o). Toutes les fonctions du site que le contrat m'attribue lues dans la production ; mes plages de la maquette lues. Sonde de la production par le geste sur le faux hub (`bancs/sonde-prod.mjs`, `bancs/hub.mjs`, sortie `sorties/sonde-prod.txt`) : trois défauts d'aujourd'hui mesurés (la case saute à la séance 1 après une heure de la séance 0 ; la reprise par la bannière n'écrit plus le paquet `H` ; le mode test laisse partir 3 écritures au lancement). **`AUDIT-DU-MANDAT.md` poussé** : 13 faux, 8 contradictions, 8 manques, 3 mesures impossibles telles quelles, un verdict par point.
- **Branche** : `integration` créée depuis `main` (personne ne l'avait encore poussée — contrat §3 : « créée par le premier qui pousse »).
- **Banc** (`sh AUDITS/INTEGRATION-DEROULE/banc.sh LIVRAISONS/INTEGRATION/E2/sorties/0733`) : **ROUGE, attendu** — `LIVRAISONS/INTEGRATION/index.html` n'existe pas encore (c'est E1-a) ; l'assemblage, les collisions, le parcours et les contrôles n'ont rien à jouer. Sortie jointe.
- **Reste** : tout le mandat. Ensuite : le banc d'E2 sur la maquette p8-5g (les gestes : lancer, dévoiler, parole, T-5, sept étapes, clôture, reprise), puis `dr-classe.js` dès E1-a (surveillée toutes les cinq minutes).
- **Bloqué / en attente de la conscience** : F2 (l'EDT ne lance jamais l'heure 2 d'une séance), C1 (`HEURES_SIM`/`now()` chez E4, lus par E1 et E4), C2 (`tick` chez E1), C3-C5 (rangs, granularité, `absents` dans le paquet), F9 (`C/vecu`), F10-F11 (la scène et l'émission, avec E3). Je code ma lecture écrite dans l'audit, §6.
- **Relances** : `RELANCES/E2.md` relu — « rien pour l'instant ».
- **Note** : le message collé dans cette session disait « section E1 » ; la session s'appelle E2 et le message « Tu es E2 » : j'ai suivi la section E2.

## 07:40 UTC — poussée 2 : le banc unique d'E2, vert sur la maquette p8-5g

- **Fait** : `bancs/banc.mjs` (un seul banc, il reconnaît son entrée : site intégré / production / maquette) — B1 la case EDT (« ▶ Ouvrir le pilotage et lancer », « Préparer » `[data-preparer]`, zéro écriture), B2 lancer en un clic (`[data-lancer="1"]`), ▶ ×3, une parole (F2 « AE » 1 Entrée), le paquet `H` (classe, créneau, début réel, `activites[0].passages ≥ 1`), `C/journal` et `C/etat` sans rang, **K15 par la liste exacte** ; B4 la fin de l'heure à **T-5 = fin − 10 min** (audit F7), les sept étapes, la clôture (`H.clos`, `finReel`, `cours_actif` nul) ; B3 la reprise (diapo, chrono ± 2 s recalculé, paroles, notes) ; B5 deux créneaux = deux clés ; B6 le mode test (zéro écriture).
- **Sorties** : `sorties/banc-maquette.txt` (**VERT** : B2 et B4 joués sur la maquette ; B1, B3, B5, B6 « absents », ce sont des gestes du site) ; `sorties/banc-production.txt` (la production : B1 joué — la case lance la séance 1 « L'Albatros » heure 1/3 ; « Préparer » absent ; le reste absent). Captures `captures/maquette/`.
- **Vu en jouant** : `S.parts[].di` est un rang (la parole porte `di` et `eid`) — à retirer de `C/etat` avec les autres (audit M2).
- **Reste** : `dr-classe.js`. Coordination lue dans les audits des autres : E1 écrit `dr_heureDe(h)` au socle (heure courante) et je fournis les heures passées depuis `H` ; `dr_sauve` d'E1 appelle `dr_copieAuto` s'il existe (je l'écris) ; R19 (⌫ = ◀ replier au pilotage) m'est attribué par E1, en attente de la conscience ; E3 (C6) attend une scène neuve au format `et` au lancement.
- **Banc d'intégration** : toujours rouge par construction (pas d'`index.html` intégré) — non relancé, rien n'a changé de ce côté.
- **Relances** : `RELANCES/E2.md` relu — rien.
