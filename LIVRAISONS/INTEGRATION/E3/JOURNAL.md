# JOURNAL — E3, le tableau

*Tenu à chaque poussée : l'heure (Paris), fait · reste · bloqué · relances traitées.*

## 21/10, 09:30 — poussée 1 : l'audit du mandat
- **fait** : md5 des deux objets vérifiés (production `ac792b28…`, maquette `62d9557a…`) ; lecture complète des sept documents ; lecture du code du tableau (production l. 17290-18105, maquette l. 919-961, 1804-1815) ; `E3/AUDIT-DU-MANDAT.md` (9 faux, 8 contradictions, 9 manques, 5 impossibles à mesurer, verdict par point).
- **reste** : les bancs sur la maquette p8-5g ; `dr-tableau.js` pour ce qui n'est pas contesté (audit §6).
- **bloqué** : rien. `integration` n'avait pas encore de E1-a : je la crée depuis `main` (contrat §3 : « créée depuis `main` par le premier qui pousse »).
- **relances** : `RELANCES/E3.md` relu — « rien pour l'instant ».

## 21/10, 09:35 — poussée 2 : le banc unique, joué sur la maquette p8-5g
- **fait** : `E3/bancs/banc.mjs` (banc unique, deux entrées : la maquette seule, ou le site par ses gestes avec `MJPC_ENTREE=site`) — T1 la fenêtre locale (trois dévoilements, un ▶ de plus sans rechargement, `#mur2`, pas de `#mur` dans la page tableau) · T2 le gel (la fenêtre tient pendant trois ▶, rattrape au dégel) · T3 la fenêtre ouverte pendant le gel · T4 la vue « ⧉ Tableau » = la fenêtre · T5 le distant (attente, scène = `et`, suivi mesuré, image gardée 30 s, scène plus ancienne refusée, K15 tableau = 0 et `ecrituresBloquees` = 0, écriture tentée refusée et comptée) · T6 `C/part` par `eid`, sans rang, sans note privée. Sur la maquette : **19 vérifications, 0 échec**, T5/T6 « absents » (pas de page `?vue=tableau` ni d'écriture dans la maquette). Sortie : `sorties/0931/banc-E3-sur-maquette-p8-5g.txt` ; captures `captures/maquette-T*.png`.
- **le banc de la conscience** (`banc.sh`) : lancé, **rouge par construction** — `LIVRAISONS/INTEGRATION/index.html` n'existe pas avant E1-a (sortie `sorties/0931/banc.txt`).
- **reste** : `dr-tableau.js` (audit §6, point 2) ; attendre E1-a (`git fetch` toutes les cinq minutes).
- **bloqué** : rien.
- **relances** : `RELANCES/E3.md` relu — rien.

## 21/10, 09:55 — poussée 3 : `dr/dr-tableau.js`, première version (avant E1-a)
- **fait** : le module du tableau, écrit sur les interfaces du contrat §5 (`S`, `rendre`, `pousser`, `etatComplet`, `eidDe`, `dr_trame`, `dr_ecrire`, `dr_lire`, `dr_cheminC`) — **côté pilote** : `dr_ouvrirTableau` (une seule fenêtre, `?vue=tableau&local=1`, qui devient `fenetreMur` pour `pousser`), le clic sur `#bvideoproj` capté (l'ancienne fenêtre `document.write` ne s'ouvre plus), son infobulle, la réponse à `pret` ; `dr_scene` (= `et` + `{eid, origine, ts, trameMaj}`, sans ce qui ne regarde que Paul), `dr_sceneAuto` (250 ms), `dr_part` (`C/part` depuis `S.parts`, par eid, sans rang ni note privée), **la veille** (`S.mur`, la copie, la participation : ce qui change part — **sans crochet** sur `pousser`, audit C1) ; **côté tableau** : `dr_tabPoser` (l'attente de la production, `#mur2.mur.tableau`, le témoin « interrompu »), `dr_tabRecevoir` (la fenêtre locale ne lit jamais le hub), `dr_tabDemarrer`, `dr_tabMonter`/`dr_tabSonder`/`dr_tabMontrer` (le distant : 900 ms, `C/ecrans` sur `trameMaj`, l'eid fait foi, jamais une scène plus ancienne, ni celle d'une heure précédente), `dr_rendreMur` (le rendu unique).
- **dette déclarée** : `dr_tabPoserEcran` ne sait pas encore comment le rendu du socle lit l'écran dans la page tableau (audit M2) — à brancher sur E1-a. La classe attendue de l'écran d'attente n'est pas faite (audit F1/I5, en attente).
- **reste** : brancher `index.html` (les fonctions `ses*` qui me sont attribuées) dès E1-a.
- **bloqué** : E1-a pas encore poussée (E1 a poussé son audit : il prend R14 « la fiche pilotée comme une diapo » au tableau pour moi — noté).
- **relances** : `RELANCES/E3.md` relu — rien.

## 21/10, 10:10 — poussée 4 : l'outil de branchement d'`index.html`
- **fait** : `E3/outils/brancher-index.py` — retire ce qui tombe dans mon territoire (25 fonctions : `sesPhoto`, `sesEmettre`, `sesPartEmettre`, `sesTabMonter`, `_sesTabBoite`, `_sesTabComposer`, `sesTabChrono`, `sesTabQui`, le téléphone entier — `sesBootTel`, 11 `sesTel*`/`sesCurseurFin`, `sesPartPeindre/Motifs/Motif/Retirer` —, et `sesPollPilote`, orpheline, audit C5) ; rebranche ce qui est repris (`sesOuvrirTableau` → la fenêtre unique, `sesBootTableau` → `dr_tabDemarrer`, `sesTabChercherCours`/`sesTabVeillePointeur` → `dr_tabMonter`, `sesTabPoll` → `dr_tabSonder`, `sesQROuvrir` → l'adresse `?vue=tableau` sans fermeture au scan ni `DELETE` direct, `sesBandeau` sans « 📱 Téléphone ») ; `SES.mode` ne connaît plus `tel`. Essayé sur une copie de la production : 33 fonctions, 1 838 175 → 1 798 519 o, les deux blocs `<script>` passent `node --check`. Les seuls appels restants aux fonctions retirées sont dans `sesBrancherPilote` et `sesAppliquer`, qui tombent chez E2 (contrat §6).
- `dr-tableau.js` : `dr_estTableau` lit l'adresse (le module se charge avant que `SES` n'existe, à la place d'`AT_DR_B64`).
- **reste** : appliquer l'outil sur `LIVRAISONS/INTEGRATION/index.html` dès E1-a, puis le banc sur `assemble/index.html`.
- **bloqué** : E1-a absente.
- **relances** : rien.

## 21/10, 10:20 — poussée 5 : `dr-tableau.js` éprouvé sur la maquette (avant E1-a)
- **fait** : `E3/outils/essai-sur-maquette.sh` — la maquette p8-5g + `dr-tableau.js` + l'amorce de la page tableau. Le banc unique y donne **18 vérifications vertes sur 19** : la fenêtre ouverte par « ⧉ » est **la page elle-même** (`maq.html?vue=tableau&local=1`), rendue par le `rendre` de la maquette, sans `document.write` ni `inj` ; elle suit ▶ sans rechargement ; elle tient pendant le gel et rattrape au dégel ; ouverte pendant le gel, elle montre l'image gelée ; la vue « ⧉ Tableau » montre la même chose. **Le seul échec est attendu** : la page de la maquette garde son `#mur` (corps statique) — dans le site, le gabarit n'est posé que par `atVuesPoser`, jamais dans la page tableau. Sortie `sorties/1020/banc-E3-essai-module-sur-maquette.txt`, captures `captures/essai-module-*.png`.
- **reste** : E1-a → appliquer `brancher-index.py`, brancher `dr_tabPoserEcran` sur le socle réel, banc sur `assemble/index.html`.
- **bloqué** : E1-a absente (veille toutes les 5 min).
- **relances** : rien.

## 21/10, 10:35 — les dettes de mon territoire, lues (registre de la production `docs/MJPC6-DETTES.md`)
- n°12 · 05 (lancer depuis l'EDT ne montre pas le cours) : **E2** (la porte), rien au tableau. n°12 · 14, 15, 16, 18, 19 : méthode, cadrage, maquettes, préalables — **rien au tableau**. n°12 · 17 : contient `_drProchainCreneau` (le prochain jour ouvré) — **c'est mon audit F1** ; ajouté à l'audit (la dette était connue). Aucune autre ne touche le tableau ; je le redirai à la fin, dans `NOTE.md`.
