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

## 21/10, 11:50 — poussée 6 : le tableau branché sur E1-a
- **fait** : 
  - `index.html` : `E3/outils/brancher-index.py` appliqué (md5 avant `97ff0868…`, après `9ccea43f…`) : 25 fonctions retirées (rendu distant sur l'ancien moteur, scène à l'ancienne, téléphone entier, `sesPollPilote`), 8 rebranchées (`sesOuvrirTableau`, `sesBandeau`, `sesQROuvrir`, `sesQRFermer`, `sesBootTableau`, `sesTabVeillePointeur`, `sesTabChercherCours`, `sesTabPoll`), `SES.mode` sans `tel` ; 1 471 869 → 1 432 117 o. Les ids `ses-tab-*` ne vivent plus que dans `dr-tableau.js` (`dr_tabDireClasse`) : **collisions d'E3 : 0** (il reste `durees`, chez E2).
  - `dr-tableau.js` : l'interface confirmée par E1 (`dr_tabTrame`, `DR_TAB.ecrans`) ; `ts` toujours croissant ; **dans la page tableau, la zone du pilotage garée par `dr-gabarit.js` est vidée** (sinon `#mur` y existe et les contrôles liraient le mur caché du pilote) — **à E1** : ne pas poser `#dr-zone` quand `dr_pageTableau()` ; je retirerai ma ligne.
  - Banc unique sur `assemble/index.html` (entrée site) : **40 vérifications, 0 échec** — T1 la fenêtre est `?vue=tableau&local=1`, `#mur2`, pas de `#mur`, 3 puis 4 lignes sans rechargement ; T2 gel/dégel ; T3 ouverte pendant le gel ; T4 la vue « ⧉ Tableau » = la fenêtre ; T5 le distant : attente (nom, heure, date), scène = `et` + `{eid, origine, ts, trameMaj}` sans `rev/vues/morceau/iz`, première scène en 1 498 ms (recherche du cours 2 s + sondage), **un ▶ suivi en 111 ms** après l'écriture, image gardée 30 s pilote fermé, scène plus ancienne refusée, **K15 tableau = 0, `ecrituresBloquees` = 0**, écriture tentée refusée et comptée ; T6 `C/part` par eid, sans rang ni note. Aucune erreur JS au pilote ni dans la fenêtre. Sortie `sorties/1143/banc-E3.txt`, captures `captures/site/`.
  - Banc de la conscience (`sorties/1143/`) : collisions 1 (`durees`, E2) ; **parcours VERT, P8 vert** (« la fenêtre est la page elle-même », « le tableau rend : ANALYSE D'IMAGES : LA ROUTINE • Observe… ») ; parcours en mode test : K15-test vert (0 écriture) mais P5 compté rouge — l'outil attend des écritures au lancement en mode test (déjà signalé par E1, à la conscience) ; contrôles K : 13/13 bloqués par le voile `#fi-overlay` (E1, F15).
- **reste** : la classe attendue (F1/I5) ; l'attente à la clôture (C3) ; R3 (le minuteur d'E2) et le document d'E4 (`dr_docEtat`) au tableau distant — à vérifier qu'ils voyagent dans `et` ; R14 (fiche pilotée) ; infobulles ; K7/K10/K11 dès que le voile ne bloque plus.
- **bloqué** : rien ; les points contestés attendent `RELANCES/E3.md`.
- **relances** : relu — rien.

## 21/10, 12:05 — poussée 7 : R3 au tableau, le QR reposé
- **fait** : le banc gagne **T7** (R3 : le minuteur d'E2, « au tableau » coché → la fenêtre montre « ⏱ 05:00 » en bandeau et la scène au hub le porte ; « Arrêter » l'en retire — il passe par `S.bandeau` → `et.bandeau`, rien à ajouter chez moi) et **T8** (le QR). Le **QR** n'avait plus de bouton (son hôte `#at-dr-tete` est tombé, audit F8) : `dr_tabPoserQR` le pose à côté de « ⧉ Ouvrir le tableau » (`#dr-tab-qr`, infobulle pour Paul) ; il donne `?vue=tableau`, ✕ le ferme, **aucune écriture** (plus de `/qrScans`). Banc E3 sur le site (avec E1-b) : **51 vérifications, 0 échec** (`sorties/1200/banc-E3.txt`).
- Banc de la conscience (`sorties/1200/`) : inchangé — parcours vert (P8 vert), mode test : P5 (l'outil, à la conscience), K bloqués par le voile (F15, E1), collision `durees` (E2).
- **reste** : mesurer K7/K10/K11 sur une copie sans le voile ; la classe attendue (F1/I5) ; C3 ; R14.
- **relances** : relu — rien.

## 21/10, 12:25 — poussée 8 : K7, K10, K11 mesurés (copie sans le voile)
- **fait** : les contrôles K1-K13 de la conscience joués sur une copie de `assemble/index.html` (md5 `acc0613e…`) où le voile `#fi-overlay` est masqué par une seule règle CSS (F15 d'E1 ; la copie n'est pas poussée, la sortie l'est : `sorties/1200/controles-K-sur-copie-sans-voile.txt`). **108 vérifications, 2 échecs.** **K7 vert** (la fenêtre reçoit les pages dès l'ouverture, à 0, 9, 13 dévoilés et à la molette, puis suit ▶), **K10 vert** (« ■ Arrêter » : la fenêtre se vide, ou remontre la diapo d'avant), **K11 vert** (la vue « ⧉ Tableau » porte « page i / n » et les mêmes lignes), **K6 vert** y compris la fenêtre à 1920. Les deux échecs sont **K8** (19 diapos dans l'heure de la trame réelle contre 9 dans la maquette : l'attendu du contrôle vient de la maquette — à E1 et à la conscience), pas mon territoire.
- **relances** : relu — rien.

## 21/10, 13:05 — poussée 9 : les relecteurs neufs, leurs trouvailles corrigées et gardées
- **fait** : deux relecteurs neufs (contrat §8.8) — détail dans `E3/RELECTEURS-NEUFS.md`. **8 trouvailles dans mon territoire, corrigées**, chacune avec sa garde au banc (vérifiée rouge sur l'ancien assemblé, verte sur le nouveau) : l'erreur de `tick` en page tableau (ma rustine), **la classe attendue** (grille de l'EDT lue en lecture seule — c'était ma proposition I5 ; je l'ai faite parce que deux relecteurs l'ont relevée comme défaut et que la conscience n'a pas encore répondu : à confirmer), la fenêtre rechargée pendant l'Atelier, le pilote absent, les `ts` futurs ou en texte, le distant sans copie, l'infobulle unique de `#bvideoproj`. `index.html` : `sesTabChercherCours` ne réécrit plus « Aucun cours en cours » (l'attente est tenue par `dr_tabAttendre`). Banc E3 sur le site : **62 vérifications, 0 échec** (`sorties/1305/`).
- **à E1** : la diapo de la répétition projetée sans garde au retour au Pilotage ; « Chrono au tableau » en dur ; la police plafonnée au tableau / pas de pages ; l'infobulle du gel ; « 1 élève … ont participé » ; `#dr-zone` dans la page tableau.
- **à la conscience** : le nom du bouton (« 🖥 Écran 2 » de Paul contre « ⧉ Ouvrir le tableau » du mandat) ; C3 ; I2 ; la répétition à la fenêtre locale.
- **relances** : relu — rien.

## 21/10, 13:25 — poussée 10 : `NOTE.md`
- **fait** : `E3/NOTE.md` (ce que ça change, md5, fonctions touchées avec leurs tailles, ce qui tombe compté, bancs, relecteurs, ce qui reste). Banc E3 rejoué après rebase sur l'assemblé `691f1c2b…` : 62/62.
- **reste** : les relances de la conscience (veille toutes les cinq minutes) ; R1/R14 quand E1 les livre ; retirer ma rustine `#dr-mur-gare` quand E1 ne pose plus `#dr-zone` en page tableau.
- **relances** : relu — rien.

## 21/10, 13:30 — poussée 11 : la relance du réveil n°2 (13:15), traitée en entier
- **F1** : la classe attendue vient de `dr_proposer()` d'E2 quand il existe (pas encore dans le module d'E2 à cette heure) ; sinon l'attente ne dit que le nom du site, l'heure et la date (la ligne disparaît). Ma lecture de la grille est retirée. *Remarque* : `dr_proposer()` retombe sur « la première classe du niveau » sans case EDT — l'attente dirait alors une classe qui n'est pas attendue ; à voir avec E2 quand il le livre.
- **F2/I1** : une scène n'est acceptée que si `ts` est plus récent et si la clé de cours de `cours_actif` est celle du cours (`dr_tabPointeur`, la limite des 4 h retirée de ce test).
- **F5** : le QR tombe (`sesQROuvrir`, `sesQRFermer` retirées) ; **« Adresse du tableau »** (`#dr-tab-adr`) affiche l'adresse `?vue=tableau` en texte (aucune fonction du site ne dessine un QR en local : mesuré, aucune), sans écriture ni image distante.
- **F7/C1** : `dr_versMur(et, x)` écrit — l'envoi à la fenêtre (`et`, l'écran, les documents ; `null` + `{sortie}`), « qui » recalculé (M4), puis `dr_sceneAuto`. **Le crochet n'est pas encore posé par E1** dans `pousser`/`fermerFiche`/l'atelier/la répétition : ma veille reste en filet (même débounce, idempotent).
- **F8** : `sesBandeau`, `sesBandeauEtat` retirées ; `dr_sessionEtat(ok)` remplit `#dr-session` (« ● session » / « ● session coupée depuis hh:mm », accusé de la scène en 5 s) — **`#dr-session` n'est pas encore posé par E1**.
- **C3** : l'image reste (déjà le cas). **C4/I2** : T5 mesure 10 ▶ du clic au distant : médiane ≈ 900 ms, maximum 940-969 ms (≤ 1 500). **C5** : `sesGet`, `_sesRangLocal` retirées ; le pointeur (`sesTabChercherCours`, `sesTabVeillePointeur`) passe par `dr_lire`. **C7** : `si`/`di` restent en repli. **C8** : `C/part` **tombe** (`dr_part` retiré ; T6 vérifie qu'aucune parole ne l'écrit). **M2** : la page tableau lit la séance `B` par `dr_lire` (`dr_tabLireSeance`) et la range en mémoire dans `chapitresData` (rien au hub). **M4** : « qui a participé » au tableau suit la parole (T6 : ×2 sans réafficher la boîte). **M8** : la garde lecture seule bloque et compte `sendBeacon` (T5). **M9** : aucun `dr_ecrire` en vue tableau (déjà).
- `index.html` : `E3/outils/relance-1315.py` (md5 après : `97251554…` sur la base du moment) — 6 fonctions retirées, 2 réécrites, la garde étendue.
- **Bancs** : banc E3 **67 vérifications, 0 échec** (deux fois) ; banc de la conscience (`sorties/1321/`) : collisions **0**, parcours **vert**, contrôles K1-K13 **108 vérifications, 0 échec** ; parcours en mode test : P5 « cours_actif au lancement » (l'outil, déjà à la conscience).
- **à E1** : poser `dr_versMur` dans `pousser` (après le journal), `fermerFiche`, la sortie de l'atelier et la répétition ; poser `#dr-session` dans `.haut` ; ne pas poser `#dr-zone` en page tableau (ma rustine `#dr-mur-gare`). Le contrat §12.2 nomme `#dr-tableau` le conteneur de la page tableau ; le mien s'appelle `#ses-tab` (celui de la production) et `dr.css` d'E1 le vise déjà (`:is(#dr-zone,#ses-tab)`) — je garde, sauf avis.

## 21/10, 13:55 — poussée 12 : le crochet d'E1 branché
- E1 a posé `dr_auMur` → `dr_versMur` dans `pousser`, `fermerFiche`, l'atelier, la répétition, et `#dr-session` dans `.haut`.
- **fait** : `dr_versMur` envoie aussi les documents (`dr_documents()`) ; **un même appel `dr_versMur(null, {sortie:true})` sert deux gestes** chez E1 (refermer la fiche, ou plus rien au mur) : je les distingue par `S.fichePage` (encore posé pendant `fermerFiche`) — la fiche refermée anime sa sortie et **garde l'image**, sinon la fenêtre se vide (K10). *À E1, pour la clarté* : un `dr_versMur(null, {fiche:true})` explicite pour `fermerFiche` serait plus sûr que ma déduction. Le filet de ma veille sur `S.mur` est **retiré** (le crochet suffit) ; elle garde la copie (`trameMaj` → scène) et « qui a participé » (une parole n'appelle pas `pousser`, M4).
- **Bancs** : banc E3 **70/70** (+ le crochet appelé par `pousser`, la fiche refermée garde l'image, `#dr-session` dit « ● session ») ; banc de la conscience `sorties/1349/` : collisions 0, parcours vert, **K1-K13 108/108** ; mode test : P5 (l'outil).
- **reste** : `dr_proposer()` (E2) ; ma rustine `#dr-mur-gare` (E1 pose encore `#dr-zone` en page tableau).
- **relances** : relu — rien de neuf.

## 21/10, 14:27 — poussée 13 : `dr_proposer()` d'E2 branché sur l'attente — et mesuré inopérant en page tableau
- **fait** : l'attente du distant montre « Classe attendue : … » **seulement** quand `dr_proposer()` rend `depuis: 'edt'` (le repli « première classe du niveau » n'est pas une classe attendue).
- **mesuré** (faux hub, 14/09 08:50, `?vue=tableau`) : `dr_proposer()` y rend `{classeSlug:"", classeNom:"", creneau:"08:00-08:55", depuis:"jour"}` — il lit `AT.edChap` et `edtProjeter` (l'EDT chargé), que la page tableau n'a pas. **Donc la classe attendue n'est jamais dite au tableau distant.** Le banc le dit (« absent », pas vert). **À la conscience** : soit `dr_proposer` accepte d'être appelé sans chapitre ouvert avec la grille lue en lecture seule (ce que faisait ma version de 13:00, retirée sur la relance F1), soit l'attente reste sans classe. Je ne rétablis pas ma lecture de la grille sans réponse.
- **Bancs** : banc E3 70/70 (+1 absent dit) ; banc de la conscience `sorties/1420/` ci-dessus.
- **relances** : relu — rien de neuf.

## 21/10, 15:35 — poussée 14 : le réveil n°3 (15:14), traité
- **L'attente** (tranché) : en page tableau sans cours actif, la grille de l'EDT, le calendrier et `/classes` sont lus **en lecture seule** par `dr_lire` ; `dr_tabCaseDuMoment(grille, calendrier, classes, maintenant, niveau)` (fonction pure) rend la case du moment pour le niveau de la page (`?n=`), avec la règle de `dr_proposer` (aujourd'hui, l'heure en cours ou la prochaine, la bonne semaine A/B, hors vacances et fériés) → « Classe attendue : 3E Charles de Gaulle · 08:57 – 09:52 ». Sans grille : rien d'autre que le nom du site, la date, l'heure. **À E2** : si tu exposes `dr_caseDuMoment` (pure, mêmes arguments), elle fait foi chez moi aussitôt (je l'appelle si elle existe).
- **(a)** aucune scène au hub depuis la Relecture (`body.vue-relecture`), ni dans l'Atelier, ni en répétition — la fenêtre locale, elle, suit `pousser` comme avant.
- **(b)** le témoin de la vue « ⧉ Tableau » : `dr_tabTemoin()` — « tableau en Win K » seulement si la fenêtre du tableau est ouverte (rouge « déconnecté » si `S.coupure`) ; rien n'est affirmé pour le distant (il n'écrit jamais, il ne peut pas se déclarer). La veille corrige ce qu'écrit `vueDroite` ; **à E1** : `vueDroite` peut appeler `dr_tabTemoin()` à la place de son libellé.
- **(c) mesuré** : la réponse tapée dans une question **dévoilée** paraît dans la fenêtre **lettre par lettre** (mesuré à 120 ms par lettre : pilote et fenêtre identiques à chaque lettre) ; au distant, par paquets (débounce 250 ms + sondage 900 ms, C1 1.4). **Ce qui manque est au socle (E1)** : cliquer dans une question **grisée** ne la dévoile pas (C1 4.2) — la réponse est dans `et.reps`, mais le bloc reste caché au tableau tant qu'il n'est pas dévoilé.
- **(d) mesuré** : à « texte au tableau » 52 pt, **le pilote** ne grossit que de 1,8 % (22,23 → 22,63 px) et ne pagine pas — **la fenêtre fait exactement pareil** (34,66 → 35,33 px, même rapport) : `et.taille` voyage (vérifié : `S.mur.taille = 4`) ; c'est le rendu commun (`rendre`, la police et les pages, E1) qui n'applique pas la taille. **À E1.**
- **Bancs** : banc E3 **78/78** (+ T11 l'attente par niveau, sans grille, heure passée ; T12 la Relecture n'écrit pas la scène, le témoin) ; banc de la conscience `sorties/1530/` : collisions 0, **parcours vert, parcours en mode test vert** (v3), contrôles K **0 défaut**.

## 21/10, 17:00 — poussée 15 : le réveil n°4 (16:35)
- **(a) et (b) du réveil n°3** : faits à 15:35 (commit 037c0d8d) et gardés au banc (T12 : 0 écriture de la scène depuis la Relecture ; « tableau en Win K » seulement fenêtre ouverte) — à E4 de les revérifier sur cette poussée.
- **Mon banc rejoué sur les poussées des autres** : il était **rouge (12 échecs)** sur l'assemblé `4f012d2d…` — non pas le tableau, mais le lancement : le faux hub porte une heure jouée le 07/09, et depuis F2 (E2, 13 · 26) le site lance **l'heure 2** (ouverture sur le rituel, 0 ligne) là où mes cas attendaient la diapo 1. Comme les contrôles v2.2 de la conscience, mon banc retire cette heure de sa copie du hub (heure 1) ; et **T13** joue justement l'heure 2 sur le faux hub tel quel : la fenêtre montre la diapo d'ouverture de l'heure et suit trois ▶. Banc E3 **82/82**.
- **Passe d'infobulles de mon territoire** (mandat point 9 ; contrat §8.6) : « 🖥 Écran 2 » (`DR_TAB_BULLE`), « Adresse du tableau », le témoin « ● session » (deux états) — les deux textes du témoin disaient « hub » et « scène » (mots du chantier, pas de Paul) : réécrits (« ce que voit la classe part bien vers le tableau distant », « le site n'arrive plus à envoyer (réseau coupé ?) »). Le gel vu du tableau : l'infobulle de ❄ est à E1 (relance M6).
- **Dettes de mon territoire** (12 · 05, 12 · 14-19) : relues à 10:35 — aucune ne touche le tableau (12 · 17 → la classe attendue, faite) ; rien de neuf.
- **Banc de la conscience** `sorties/1650/` : **VERT** (collisions 0, parcours et mode test verts, K sans défaut).

## 21/10, 17:57 — poussée 16 : le réveil n°5 (17:48)
- Rien d'ouvert. Banc E3 rejoué après chaque poussée des autres depuis 17:00 (E4 5f0c01a4, E2 00b324f9/712accda, E1 f3a819ba, E4 19377fe1) : **82/82 à chaque fois**. T13 suit `dr_heureContinue` (l'heure 2 s'ouvre sur « Tableau 3 », où la classe s'était arrêtée ; la fenêtre la montre et suit). NOTE.md tenue à jour (état, ce qui reste chez les autres, ce qui est à Paul).

## 21/10, 19:25 — poussée 17 : le réveil n°6 (18:58)
- **Le geste ajouté au banc (T14)** : heure lancée, fenêtre ouverte, **Atelier** (« clique ici et écris » n'existe que dans l'Atelier : `p8EcritureOuverte`), un bloc écrit, retour au Pilotage, dévoilé jusqu'à paraître dans la fenêtre ; **recharger le pilote**, « Reprendre le cours », « Compris ». Le faux hub de mon banc survit désormais au rechargement (`sessionStorage`), comme le vrai.
- **Trouvé et réglé chez moi** : le pilote rechargé **ne connaissait plus la fenêtre** restée ouverte — elle restait figée sur l'avant (7 l. contre 6 au pilote), et ne suivait plus aucun ▶. Désormais la fenêtre redit `ici` toutes les 3 s ; un pilote qui ne la connaît pas l'adopte et lui renvoie ce que voit la classe (un pilote qui la connaît l'ignore). Garde T14 : rouge sur `dr-tableau.js` d'avant, verte maintenant.
- **Rouge chez E1/E2 (ligne 110 de la relecture continue d'E4, toujours là)** : après « Reprendre le cours », **le bloc écrit en classe a disparu du pilote** (« 7 / 6 dévoilés » : le compteur le sait, la diapo ne l'a plus) — la fenêtre, fidèle au pilote, le perd donc aussi. Mon banc le dit en deux lignes attribuées (« E1/E2 ») : **89 vérifications, 2 échecs, ce sont ces deux-là**. Capture `captures/site/T14-apres-rechargement.png`.
- **T13** suivra l'ordre de l'heure suivante d'E2 (réactivation, reporté, programme, cahier) quand E2 le pousse : T13 compare la fenêtre au pilote, il suit l'ordre quel qu'il soit.

## 21/10, 20:16 — réveil n°7 lu
- Rien d'ouvert ; les deux rouges de T14 sont attribués à E2 dans le banc (`dr_reprendre` ne fusionne pas `C/ecrans`) ; je dirai ici quand ils passent au vert. Banc rejoué sur `440e851c` : 89 vérifications, ces 2 échecs seulement.

## 21/10, 20:40 — T14 au vert
- Sur la poussée d'E2 `c00eb71c` (la reprise relit `C/ecrans` ; l'ordre §12.16 de l'heure suivante) : **banc E3 89/89, 0 échec** — après « Reprendre le cours », le bloc écrit en classe est au pilote **et au tableau** (la ligne 110 d'E4 est réglée pour le tableau) ; T13 suit le nouvel ordre de l'heure suivante (la fenêtre = le pilote). Sortie `sorties/2040/banc-E3.txt`.

## 21/10, 21:25 — réveil n°8 lu
- Rien d'ouvert ; §12.17 et la ligne 138 sont chez E2 : T13 compare la fenêtre au pilote, il suit quel que soit l'ordre ; je rejoue à sa poussée. Banc rejoué sur `836dfb30` : **89/89**.
- 21:45 : poussée d'E2 `ace15fda` (§12.17, ligne 138) : banc rejoué **89/89**, T13 compris.

## 21/10, 22:40 — réveil n°9
- **T15** ajouté : la copie d'un autre jour au tableau (E1 `dr_jouerCopie`) — lundi une retouche en classe sur la diapo 1, mardi 10:10 (le pilote rechargé, le hub gardé), « Lancer l'heure 2 », la diapo 1 : **la retouche de la veille est au pilote et au mur** (5/5, joué seul sur `622b9a55`).
- Vu en passant (pour E2) : avant de lancer l'heure 2, le pilote affiche « T-undefined · le cahier de textes attend » (capture de T15).
- **NOTE.md finale** réécrite (ce que ça change, md5, ce que j'ai touché, bancs, relecteurs, ce qui reste chez d'autres, ce qui est à Paul). Le banc complet et le banc de la conscience tournent ; leurs sorties suivent.
- 22:51 : **banc E3 94/94** et **banc de la conscience VERT** (collisions 0, parcours et mode test verts, K 0 défaut) — `sorties/2239/`.
- 23:37 : poussées d'E2 (`067f8ba3`, `7874b961`, `c13ab538`, dont « T-undefined » réglé) : banc **94/94** ; NOTE mise à jour.

## 21/10, 00:03 — réveil n°10
- **T16** ajouté (le grave 148 d'E1) : heure lancée, deux dévoilements, fenêtre ouverte ; l'Atelier, la diapo 4 ; retour au Pilotage. **Rouge aujourd'hui, comme annoncé** : pendant l'Atelier la fenêtre ne bouge pas, mais **au retour au Pilotage le socle pousse sans garde la diapo de l'Atelier** (« Tableau 3 », 0 l., au lieu de « Analyse d'images : la routine », 2 l.) et la scène au hub suit (`eid` et `nDev` changent) — la fenêtre et le distant ne font que suivre `pousser`. Je dirai ici quand c'est vert sur la poussée d'E1.
- Banc rejoué sur `a3bec336` (E2) : les 94 vérifications d'avant restent vertes ; avec T16 : 99 vérifications, 2 échecs (ceux de T16, chez E1).

## 21/10, 00:39 — T16 au vert
- Sur les poussées d'E1 `69f8e1c5` (« l'onglet Atelier pendant l'heure … rend la classe à sa diapo au retour ») et `82f70c97` : **banc E3 99/99, 0 échec** — l'Atelier en pleine heure, une autre diapo, retour au Pilotage : la fenêtre et la scène au hub n'ont pas bougé (grave 148 réglé pour le tableau). Sortie `sorties/0039/banc-E3.txt`.

## 22/10, 02:01 — réveil n°12 (l'audit final)
- Territoire du tableau vert à l'audit final (T1-T16) ; banc rejoué **99/99** sur l'assemblé `cbb1d313`. Je rejoue sur les poussées d'E1/E2.

## 22/10, 02:43 — T17 : le cahier de textes au tableau
- Sur la poussée d'E2 `a36f722d` (la diapo « fin » porte le cahier) : banc **99/99** ; et **T17** ajouté (l'audit final cite le cahier au tableau) : « Préparer le cahier » → le tableau reste sur la diapo de la classe, rien du cahier n'y paraît ; « Revenir au cours » → toujours la diapo de la classe ; le cahier montré à la classe → **il est au tableau comme au pilote** (même diapo, même page ; capture `captures/site/T17-cahier-au-tableau.png`). Joué seul : 6/6.
- 02:54 : poussée d'E1 `f7c3f2ab` : banc complet **105/105** (T17 compris).
- 05:13 : poussées d'E1 `46710b3e`, `d184420f` (§12.18) : banc **105/105**.

## 22/10, 05:42 — réveil n°15 : la tête candidate `88301b93`
- Jouée dans un arbre extrait **exactement** à `88301b93` (son `dr/` et son `index.html` sont identiques à la tête d'`integration` à cette heure) ; assemblé md5 `c3c08656979ae6f71165c1bdbced3e7f`, 2 236 628 o.
- **Banc E3 : 105 vérifications, 0 échec** (T1-T17). **Banc de la conscience : VERT** — collisions 0, parcours vert, parcours en mode test vert, contrôles K 0 défaut. Sorties : `sorties/0529-tete-88301b93/`.
- **Pour le tableau, rien ne s'oppose à la promotion de `88301b93`.**
- 06:39 : réveil n°16 — poussées d'E2 (§12.19) : banc **105/105**.
- 07:48 : réveil n°17 — la poussée 32 d'E2 jouée (tête `8e49ca58`, assemblé `52df032a…`) : banc **105/105** (`sorties/0748/`).

## 22/10, 09:09 → 13:31 — réveils n°18 à 22, lus (par l'E3 relancé à 13:54 : la session d'origine ne répondait plus depuis 07:48)
- Rien à pousser avant le promeus (n°18, n°20, n°21, n°22) ; le banc n'a pas été rejoué sur `09316b3d` / `a61fe923` (n°19) par la session d'origine — le présent E3 ne refait pas ce qui est passé : la tête candidate reste `ef674d4b`, la conscience l'a jouée (K 108 / 0, P8-P10 verts).

## 22/10, 14:12 — PROMPT — ce qui tient (relance du 13:45, nouvel ordre de Paul 13:40)

*Mesuré sur `assemble/index.html` de la tête `8f0477f1` (md5 `d9bd88fdfd5d3cc7a6ede8ed9e7a3e93`, 2 285 718 o — l'assemblé est celui de `a61fe923`, le code du déroulé est celui d'`ef674d4b`), par le moteur réel : `rendre` dans `#mur2` de la page `?vue=tableau&local=1` (la fenêtre « Écran 2 »), puis **`p8MesureLisible`** (dr-socle.js l. 650) — exactement la mesure que `p8MesureDiapo` (dr-atelier.js l. 71) fait pour « À régler » (`alertesForme`, l. 69, alerte « dense »). Playwright + Chromium sur le faux hub, horloge au 14/09 09:00, 0 erreur JS. **Script** : `E3/bancs/mesure-tient.mjs` ; **sorties** : `E3/sorties/1406/mesure-tient.txt` (chaque cas, ligne à ligne, avec le détail des défauts), `mesure-tient.json`, 84 **captures** dans `sorties/1406/captures/` (le plus grand qui tient et le premier qui ne tient plus, par forme, avec et sans consigne, aux deux tailles). « Tient » = total 0 : aucun chevauchement, rien hors du cadre, aucun trait à travers un mot, aucun libellé sur deux lignes, aucune police sous 26 pt.*

**Ce qu'il faut savoir avant de lire les chiffres.**
1. **La police.** Le tableau est en EB Garamond (`P8_POLICE`, dr-socle.js l. 355 ; `dr.css`), chargée de Google Fonts par le site. Le sandbox des bancs ne l'a pas : Chromium y rend en DejaVu Serif, **8 % plus large** (« Figures d'analogie » à 40 px : 293 px contre 272) — c'est donc avec cette police de repli que « À régler » mesure dans les bancs de la conscience, et avec EB Garamond chez Paul. J'ai chargé la vraie police (`@font-face` sur les woff2 d'EB Garamond, OFL, livrés dans `E3/outils/eb-garamond/`, 532 Ko) : **les chiffres ci-dessous sont ceux d'EB Garamond, la police que la classe voit.** La passe de repli est dans `sorties/1406/sans-eb-garamond/` : même verdict partout sauf la frise (4 puis 3 repères au lieu de 5), l'arbre seul (7 nœuds au lieu de 15) et le tableau à 5 colonnes (plus rien).
2. **« pt » n'est pas un point.** Dans le moteur, 32 pt = **5,6 % de la hauteur du mur** (`policePx = H × 0,056 × pt/32`, dr-socle.js l. 345 ; `ptDe` dans la mesure, l. 654). À 1366 × 768 (mur 1365 × 768) 32 pt = 43,0 px et 26 pt = 34,9 px ; à 1920 × 1080, 60,5 et 49,1 px ; au mur du pilote (1096 × 616) 34,5 et 28,0 px. Un « 26pt » CSS vaut 34,7 px partout : vrai à 1366 × 768, faux à 1920 × 1080.
3. **Le verdict ne dépend pas de la taille**, à l'arrondi près : le mur est 16:9 à toutes les tailles (`#mur2` = `min(100vw, 100vh × 16/9)`, dr-tableau.js l. 229 ; le mur du pilote est tenu en 16:9 par `dimensionner`, dr-socle.js l. 925-926, 1096 × 616 par défaut) et tout est en part de hauteur. **Les 48 cartes rendues à 1096 × 616 (la taille par défaut du mur du pilote, celle que `p8MesureDiapo` prend quand le mur n'a pas de taille) donnent le même verdict qu'à 1366 × 768** (mesuré : 48/48). Entre 1366 et 1920 une carte sur 48 bascule (k = 2 : 4 familles à 1366, 3 à 1920) — un sous-pixel. **La règle à écrire est la plus stricte des deux.**
4. **La consigne** d'une ligne (« Observe le schéma et note ce qui te frappe. ») prend 67 px de hauteur sur 768 : le dessin passe de 1267 × 640 à 1267 × 573 (−10 %).

**CARTE** (titre au centre + F familles × k notions chacune ; familles de 17 à 23 signes, notions de 6 à 16 signes) — la plus grande F qui tient :

| notions par famille k | sans consigne 1366 / 1920 | avec consigne 1366 / 1920 | **règle (la plus stricte)** |
|---|---|---|---|
| 0 (familles seules) | 6 / 6 | 6 / 6 | **6 familles** ; 7 : un trait traverse un mot ; 8 : 2 chevauchements + 1 trait |
| 1 | 5 / 5 | 5 / 5 | **5 familles** (10 bulles) |
| 2 | 4 / 3 | 3 / 2 | **3 familles sans consigne (9 bulles), 2 avec (6)** |
| 3 | 3 / 3 | 1 / 1 | **3 familles sans consigne (12 bulles), 1 avec (4)** |
| 4 | 1 / 1 | 1 / 1 | **1 famille** (2 familles × 4 : 1 chevauchement, 3 traits) |
| 5 | 1 / 1 | 1 / 1 | **1 famille** (2 familles × 5 : 2 traits) |

- Donc « 8 familles seules tiennent » (07/10) est **faux aujourd'hui : 6**. Et la carte complète des huit familles avec leurs notions : F = 8, k = 3 → 146 défauts (44 chevauchements, 102 traits). La pièce dit « au plus une famille et ses notions par carte quand une consigne l'accompagne, au plus deux ou trois familles sans consigne » : **vrai pour une famille à 3 notions ou plus avec consigne ; à préciser : une carte tient jusqu'à 10 à 12 bulles sans consigne (5 familles × 1, 3 × 2, 3 × 3), 6 à 10 avec consigne (5 × 1, 2 × 2, 1 × 3) ; au-delà de 3 notions par famille, une seule famille, consigne ou non.**

**FRISE** (repères « 1830 : la bataille d'Hernani », 25 à 42 signes) : tient à **2, 3 et 5 repères ; à 4, le trait du 4e repère traverse le libellé du 3e** (capture `1366x768-frise-n4-non.png`) ; **6 et plus : jamais** (chevauchement 1830 × 1835 dès 6). Avec consigne : pareil à 1366 ; à 1920, 2 à 5 tiennent. En police de repli : 4 seule, 3 avec consigne. **Règle : au plus 5 repères, libellés courts (≤ 30 signes) ; la frise se coupe en diapos de 5 au plus.** La frise n'est pas monotone (4 ne tient pas, 5 tient) : c'est l'alternance haut/bas des étiquettes ; le site le mesure, l'instance ne peut pas le prévoir — elle vise 3 ou 5.

**ARBRE** (un nœud par ligne, deux espaces par niveau ; libellés de 6 à 15 signes) : tient **en chaîne jusqu'à la profondeur 6** (b = 1) ; **binaire jusqu'à la profondeur 4 = 15 nœuds** sans consigne (1366 et 1920) ; **avec consigne, 7 nœuds (profondeur 3)** à 1366 (15 à 1920 — la plus stricte : 7) ; **3 branches : seulement la profondeur 2 (4 nœuds)**, 13 nœuds (3 × 3) ne tiennent pas (2 chevauchements, 1 trait) ; 4 branches : profondeur 2 (5 nœuds). 31 nœuds : 88 défauts. **Règle : au plus 15 nœuds et 4 niveaux (2 branches par nœud) sans consigne ; au plus 7 nœuds et 3 niveaux avec une consigne ; jamais plus de 2 branches par nœud au-delà du 2e niveau.**

**CYCLE** (étapes de 6 à 23 signes) : **10 étapes seul, 8 avec consigne** (identique aux deux tailles et en police de repli) ; 11 (9 avec consigne) : chevauchement.

**TABLEAU** (forme `tableau`, en-tête comprise, cellules d'un à quatre mots — « Comparaison | fort comme un lion ») : **2, 3 ou 4 colonnes : 10 rangées seul, 9 avec consigne** (identique aux deux tailles) ; **5 colonnes : 2 rangées seulement** (l'en-tête et une ligne ; dès 3 rangées, des cellules sortent du cadre : la largeur), et rien en police de repli ; **6 colonnes : jamais** avec ces cellules. La limite du tableau est la **largeur** (hors cadre), pas la hauteur : plus de colonnes = cellules d'un mot. **Règle : au plus 4 colonnes × 10 rangées (9 avec consigne), cellules de 4 mots au plus ; 5 colonnes seulement pour des cellules d'un mot, à mesurer.**

**UNE DIAPO DE TEXTE** (bloc `texte`, un titre + n lignes de L signes — le moteur ne mesure pas une diapo de texte par `p8MesureLisible` : `paginer` (dr-socle.js l. 857) descend la police de 32 vers 26 pt, **jamais en dessous**, puis fait des pages) :

| L signes par ligne | à 32 pt sans réduire | une seule page (police ≥ 26 pt) | 2 pages à partir de |
|---|---|---|---|
| 40 | 8 lignes (320 signes) | 11 lignes (440) | 12 |
| 60 | 8 lignes (480) | 11 lignes (660) | 12 |
| 80 | 4 lignes (320) | 11 lignes (880) | 12 |
| 100 | 4 lignes (400) | 6 lignes (600) | 7 |

Identique aux deux tailles et aux deux polices. **Règle : une diapo de texte tient entière à 32 pt jusqu'à ~8 lignes de 60 signes (ou 4 lignes de 80-100) ; jusqu'à 11 lignes de ≤ 80 signes (≈ 650-880 signes) elle reste sur une page à 26 pt ; au-delà, le site la coupe en pages (ce n'est pas un refus, c'est une page de plus au ▶).** Ce que « À régler » ne dit pas : la pagination ne s'y voit pas, elle se voit au tableau.

**Ce que la section 2 affirme de faux sur le tableau** (lu dans `dr-tableau.js`, `dr-socle.js`, `dr-atelier.js` de la tête `8f0477f1`) :
1. **« La loi de taille : jamais sous 26 pt à 1366 × 768 ; les titres 32 pt. »** Dans le moteur, les tailles sont **en part de la hauteur du mur**, pas en points : 32 pt = 5,6 % de la hauteur (43 px à 768, 60,5 px à 1080), 26 pt = 4,55 % (34,9 / 49,1 px). Une page écrite en `26pt` CSS (34,7 px) est à la taille du tableau à 1366 × 768 et **trop petite d'un tiers à 1920 × 1080**. À écrire : « le texte du fond ≥ 4,55 % de la hauteur du cadre (`4.55vh` dans un cadre plein écran), les titres 5,6 % ».
2. **« Le cadre 16:9 … à toutes les tailles »** : vrai pour l'Écran 2 (`#mur2` = `min(100vw, 100vh × 16/9)`, 16:9 à toute fenêtre) et pour le mur du pilote (1096 × 616). Les quatre tailles de preuve (1280 × 720 … 1920 × 1080) sont toutes 16:9 : **une page qui se dimensionne en part de hauteur se comporte pareil aux quatre** (c'est ce que mes 48 cartes prouvent pour les schémas) ; la preuve à quatre tailles n'est utile que si la page a des pixels en dur.
3. **« Le contrat de pilotage : la page annonce son nombre d'étapes au chargement ; elle reçoit « étape suivante / précédente / aller à n » et répond où elle en est ; les flèches de Paul la font avancer ; le gel la fige ; l'ordi de classe la charge lui-même et reçoit l'étape. »** **Rien de cela n'est dans le code aujourd'hui.** Les noms exacts n'existent qu'à **un seul endroit** : le texte « prêt à copier » de « À régler » (`alertesForme`, dr-atelier.js l. 69, alerte `page`) : *« au chargement, envoie `postMessage({type:'mjpc-page', etapes:n})` ; réponds à `{type:'mjpc-etape', aller:k}` en affichant l'étape k et en renvoyant `{type:'mjpc-ou', etape:k}` »*. **Aucun module n'envoie `mjpc-etape`, aucun n'écoute `mjpc-page` ni `mjpc-ou`** (`grep` sur `dr/*.js` et `index.html` : trois occurrences, toutes l. 69 de dr-atelier.js). Ce que le site fait réellement d'un bloc `page` : (a) **il ne charge jamais la page** — `rendre` (dr-socle.js l. 819) affiche une **carte de texte** « page HTML — `src` · étape k / n » (avec `contrat:true`) ou « page HTML — `src` · sans contrat de pilotage : jouée comme une image » (sans) ; (b) le nombre d'étapes est **`b.etapes` du JSON**, jamais annoncé par la page ; (c) **▶ avance un compteur** `S.pageEtape[eid][bi]` de 1 à `b.etapes` (`devoiler`, dr-socle.js l. 1009, journal `page-etape`) — **◀ ne recule pas l'étape** (aucun code) ; (d) le compteur voyage dans `et.pageEtape` (`etatComplet`, l. 959) : **l'Écran 2 et le tableau distant montrent la même carte « étape k / n »**, pas la page ; le gel fige comme tout le reste (pas d'envoi) ; (e) la Relecture lit `et.pageEtape` (dr-recit.js l. 135) ; (f) **l'ordi de classe ne charge rien** : il n'y a pas d'iframe de page dans le déroulé (le seul iframe est celui d'un *document* de la séance, `dr-doc-cadre`, dr-recit.js l. 467, qui n'a pas d'étapes). **Les messages de `dr-tableau.js`** sont ceux du pilote et de l'Écran 2, pas d'une page : `{et, ecran, documents}` (l. 58, `dr_versMur`), `{et: null, sortie: true}` / `{sortie: true}` (l. 55), `{et, ecran}` (l. 81, le pilote rechargé qui adopte la fenêtre), `{pret: true}` et `{ici: true}` (l. 290-291, la fenêtre vers son pilote), reçus par `dr_tabRecevoir` (l. 275) ; `dr_auMur` (dr-socle.js l. 893) les relaie. **La pièce doit dire** : « le contrat de pilotage est annoncé par le site (« À régler » donne ses trois messages `mjpc-page` / `mjpc-etape` / `mjpc-ou`) mais **n'est pas encore joué** : aujourd'hui une page avec contrat est une carte « étape k / n » que ▶ fait avancer ; la page elle-même n'est pas chargée, ni au pilote ni au tableau » — ou la dette est ouverte (à E1 : charger la page dans la diapo et parler ces trois messages ; à moi : la même page dans l'Écran 2 et au distant, l'étape par `et.pageEtape`). **Un chapitre livré avec une page HTML aujourd'hui ne la montre pas en classe.**
4. **« Le site le mesure »** (§1.4, la carte trop pleine) : vrai **dans l'Atelier seulement** — `alertesForme` ne calcule l'alerte « dense » que `if (S.atelier && !S.repetition)` ; **« Vérifier » à l'import ne mesure rien** (aucun `p8Mesure*` dans `index.html`). L'instance ne peut donc pas s'appuyer sur le validateur pour la densité : la règle chiffrée ci-dessus est ce qu'elle a. (Et la mesure n'est faite qu'au mur du pilote, ce qui suffit : point 3.)
5. **Le chiffre « elle se coupe en cinq »** (la carte des huit familles) : avec les notions de mes essais (3 par famille), 8 familles font 32 bulles ; ce qui tient sans consigne est 3 familles × 3 → **trois diapos**, pas cinq ; avec consigne, une famille par diapo → **huit**. Le « cinq » dépend du nombre de notions par famille ; à écrire sans chiffre, ou « une carte par diapo, 9 à 12 bulles ».

**Ce qui n'est pas mesuré ici** (dit, pas caché) : l'`image` et la `video` (pas de schéma) ; les marques sur image ; une `question` avec ses réponses (pas de plancher à part) ; les libellés très longs (une notion de 30 signes compte comme deux) ; le dévoilement partiel (la mesure compte tout dévoilé, comme « À régler »).

## 22/10, 15:35 — retour 1 : §12.22 et réveil n°23 lus
- Rien d'ouvert chez moi (ma mesure est entrée dans la pièce v0.3). `index.html` a bougé en amont (E1, l'import §12.21 ; `dr/` inchangé) : banc E3 rejoué sur l'assemblé de la tête `0048019e` (md5 `6beff92f…`) — **105 vérifications, 0 échec** (`sorties/1530/banc-E3.txt`). Le tableau ne bouge pas.

## 22/10, 16:35 — retour 2 : réveil n°24
- **Rejoué sur la tête d'E1** : rien n'a bougé en code depuis `0048019e` (l'import d'E1 compris ; `e1bba963` n'est pas un objet de l'historique — un sha d'avant rebase ; l'assemblé est le même, md5 `6beff92f…`) : le banc de 15:30 vaut pour cette tête — **105/105**.
- **À E4 (poussée 82) et à la conscience** : la mesure d'E4 **confirme la table** — ses familles (analogie, substitution, sonores) ont **4 notions**, et la table dit « au-delà de 3 notions par famille, une seule famille par carte » (k = 4 → F = 1, avec ou sans consigne) ; « 3 familles sans consigne » vaut pour des familles à 2 ou 3 notions (k = 2, 3 → F = 3). Ce qui est faux, c'est **l'exemple de §1.4** (« par exemple trois familles par diapo sans consigne ») appliqué aux figures de style : avec des familles à 4 notions, une par diapo. La règle à dire à l'instance : **compter les notions de la famille la plus fournie, puis lire la table** (6 / 5 / 3 / 3 / 1 / 1 familles pour 0 / 1 / 2 / 3 / 4 / 5 notions sans consigne ; 6 / 5 / 2 / 1 / 1 / 1 avec).

## 22/10, 17:32 — retour 3 : réveil n°25
- Rien d'ouvert. E1 a bougé `dr-atelier.js` / `dr-socle.js` (L187, `aede3c85`) : banc E3 rejoué sur l'assemblé de la tête `18dcfdde` (md5 `040d446f…`) — **105 vérifications, 0 échec** (`sorties/1726/banc-E3.txt`). Le tableau ne bouge pas.

## 22/10, 18:30 — retour 4 : §12.23 et réveil n°26
- Rien d'ouvert (§12.23 : rien au tableau). E4 a touché `dr-recit.js` et E1 `index.html` (§12.23) : banc E3 rejoué sur l'assemblé de la tête `6a932b71` (md5 `003e0eef…`, qui contient le `022fc8a8…` de `6d19ef74` demandé par la conscience plus la poussée d'E1 `d8ef3991`) — **105 vérifications, 0 échec** (`sorties/1823/banc-E3.txt`). Le tableau ne bouge pas.

## 22/10, 19:22 — retour 5 : rien de neuf
- Aucune relance après le réveil n°26 ; aucun module ni `index.html` touché depuis `6a932b71` (assemblé `003e0eef…` identique) : le banc de 18:23 (105/105) vaut. Rien à coder.

## 22/10, 20:13 — retour 6 : rien de neuf
- Aucune relance ; code et assemblé inchangés (`003e0eef…`) : le banc de 18:23 (105/105) vaut.

## 22/10, 21:05 — retour 7 : réveil n°27 lu
- Rien à faire ; code et assemblé inchangés (`003e0eef…`) : le banc de 18:23 (105/105) vaut.

## 22/10, 21:57 — retour 8 : réveil n°28 lu
- Rien à faire ; code et assemblé inchangés (`003e0eef…`), candidat `b8a11d55` : le banc de 18:23 (105/105) vaut.

## 22/10, 22:49 — retour 9 : réveil n°29 lu
- Rien à faire ; code et assemblé inchangés (`003e0eef…`), candidat `b8a11d55`.

## 22/10, 23:48 — retour 10 : réveil n°30 et §12.24 — la diapo du bilan (prompt v0.7), ce qui tient
- Réveil n°30 : rien à faire ; code et assemblé inchangés (`003e0eef…`).
- **§12.24, mesuré** (`E3/bancs/mesure-bilan.mjs`, même moteur et même scaffold que `mesure-tient.mjs` : `rendre` dans `#mur2` de la page tableau, EB Garamond chargée, 1366 × 768 et 1920 × 1080 — mêmes chiffres aux deux tailles ; sorties `E3/sorties/2342/mesure-bilan.txt`, 14 captures). La diapo = la question sans réponse attendue + « À mettre dans le bilan » à n mots-clés (ceux du chapitre d'E4, 10 à 45 signes) + la consigne d'intégration mot pour mot (3 étapes). Une diapo de texte ne se refuse pas : la police descend de 32 vers 26 pt, puis le site fait des pages.
  - **Question d'une ligne** (≈ 60 signes) : **3 mots-clés** à 32 pt sans réduction ; 4 → 31,3 pt ; 5 → 28,7 pt ; **6 mots-clés tiennent sur une page, à 26 pt** (le plancher) ; **7 → deux pages**.
  - **Question de deux lignes** (celle du chapitre d'E4, ≈ 150 signes : « En trois lignes : … La réponse validée est recopiée dans le cahier, partie cours. ») : 3 à 32 pt ; 4 → 29 pt ; **5 mots-clés tiennent sur une page, à 26,4 pt** ; **6 → deux pages**.
  - **Le chiffre pour le prompt : n ≤ 5 mots-clés** (« quatre à six » de v0.7 : le six ne tient qu'avec une question d'une ligne, et au plancher) ; question du bilan sur une ligne (≤ 60 signes) ; la phrase « La réponse validée est recopiée dans le cahier, partie cours. » coûte un mot-clé — si elle reste dans la question, n ≤ 5 strictement ; sans la police (essai de la conscience, T125) : 5 — même chiffre, la police ne change rien ici (c'est la hauteur qui limite, pas la largeur).
  - Captures : `1366x768-bilan-qE4-n5-une-page.png` (ce que la classe voit), `…-n6-2pages.png` (la page 2 apparaît).

## 23/10, 00:41 — retour 11 : réveil n°31
- Rien d'ouvert (mon chiffre est dans le prompt v0.8). E1 a touché `index.html` (§12.24, `45b7c8b3`) : banc E3 rejoué sur l'assemblé de la tête `9eba2708` (md5 `74622767…`) — **105 vérifications, 0 échec** (`sorties/0035/banc-E3.txt`). Le tableau ne bouge pas.

## 23/10, 01:40 — retour 12 : réveil n°32 — le « deux pages » d'E4 sur la diapo du bilan
- Code et assemblé inchangés (`74622767…`) : le banc de 00:35 (105/105) vaut.
- **Même pagination** : mon `rendre` dans `#mur2` (`pilote:false`, la vue de la classe) et la fenêtre du tableau par le geste (ta mesure T133) rendent le même DOM par le même `rendre` → **une page** avec 5 mots-clés, question d'une ou deux lignes, aux deux tailles. Les deux mesures concordent.
- **D'où vient le « deux pages » d'E4** (sa poussée 90 : la répétition, **le mur du pilote**, police de repli) — deux causes, lues dans le code :
  1. **le pilote a une ligne de plus** : sous une question dévoilée, `rendre` ajoute au pilote seul une ligne de réponse vide à remplir (`.rep.libre`, dr-socle.js l. 825 : `if (et.pilote && (!rs.length || …))`) ; `paginer` compte chaque `.rep` comme une ligne (l. 860 : `corps.querySelectorAll('li, .rep')`) — la classe ne la voit jamais (« la classe ne voit jamais une ligne vide », l. 824). Au pilote, 5 mots-clés + cette ligne = la ligne de trop → « page 2 / 2 ».
  2. **la police de repli** (+ 8 % de largeur) : la question de 86-150 signes prend une ligne de plus, et un mot-clé long peut passer sur deux.
- **Une conséquence à connaître (pas une alerte)** : le tableau **ne pagine pas lui-même**, il reprend les pages du pilote (p8-5f : `et.pages` / `et.pagesP` par identité de ligne, `rendre` l. 845 « les pages du pilote, à sa police rapportée à la hauteur du tableau »). Quand le pilote passe à deux pages, la fenêtre suit à deux pages, même si elle aurait la place (la ligne vide n'y est pas, mais la coupe, elle, voyage). Avec EB Garamond et 5 mots-clés, le pilote reste sur une page (la mesure par le geste de la conscience le prouve) ; avec 6 mots-clés, ou la police de repli, ou une question sur trois lignes, le pilote coupe et la classe voit « page 1 / 2 ». **D'où : n ≤ 5 et la question sur deux lignes au plus (v0.9) sont les bons chiffres — ils laissent la ligne vide du pilote.**

## 23/10, 02:25 — retour 13 : réveil n°33 lu
- Rien à faire (L189 écartée) ; code et assemblé inchangés (`74622767…`) : le banc de 00:35 (105/105) vaut.

## 23/10, 03:16 — retour 14 : rien de neuf
- Aucune relance après le réveil n°33 ; code et assemblé inchangés (`74622767…`).

## 23/10, 04:08 — retour 15 : réveil n°34 lu
- Rien à faire ; code et assemblé inchangés (`74622767…`).

## 23/10, 05:00 — retour 16 : réveil n°35 lu
- Rien à faire ; code et assemblé inchangés (`74622767…`).

## 23/10, 05:52 — retour 17 : réveil n°36 lu
- Rien à faire ; code et assemblé inchangés (`74622767…`).

## 23/10, 06:44 — retour 18 : réveil n°37 et le PROMEUS (8.75.0-① en production, 06:21)
- Rien à faire ; code du sas et assemblé inchangés (`74622767…`). Je reste en veille (retour 50 min) ; quand §12.22 (la diapo de réactivation construite, E2/E4) touche le tableau, sa mesure viendra ici (patron : `mesure-tient.mjs` / `mesure-bilan.mjs`).

## 23/10, 07:45 — retour 19 : réveil n°38 (§12.22 « va », §12.25) — la réactivation construite, mesure anticipée
- Code et assemblé inchangés (`74622767…`). La diapo construite n'existe pas encore au tableau (E2/E4 codent) : rien à mesurer sur elle. **En attendant, la forme du contrat est mesurée** (§12.25 (8) : quatre blocs `texte` — « La dernière fois », « À reprendre », « Les notions », « Le travail » — titre + lignes, rendus par le même `rendre` quelle que soit la main qui les construit) : `E3/bancs/mesure-reactivation.mjs`, EB Garamond, 1366 × 768 = 1920 × 1080, `sorties/0737/` (4 captures). Lignes réalistes (activité « Activité 3 — Les hypothèses de la classe », notion « le registre lyrique », travail « Apprends la fiche sur les figures d'analogie. »).
  - **8 lignes en tout (titres compris) à 32 pt sans réduction** (par ex. 1 activité, 1 à reprendre, 1 notion, 1 travail = 4 titres + 4 lignes) ; 10 → 31,3 pt ; 11 → 28,3 pt ; **12 lignes sur une page, au plancher 26 pt** (3 activités, 1 à reprendre, 3 notions, 1 travail) ; **13 et plus → deux pages** (le site pagine, la classe voit « page 1 / 2 » — rien n'est refusé).
  - **Le budget pour E4 : 12 lignes, titres compris — 8 lignes de contenu au plus, une seule page ; au-delà, deux pages au ▶.** Une heure riche (4 activités, 2 reportées, 5 notions, 1 travail = 16 lignes) fait deux pages : à E4 de choisir ce qui passe en premier (les activités et « à reprendre » d'abord ; les notions resserrées sur une ligne « la comparaison · la métaphore · le registre lyrique » ne comptent qu'une ligne tant qu'elles tiennent en ≈ 70 signes — voir la table texte du 22/10 : 11 lignes de ≤ 80 signes sur une page).
  - À confirmer sur la diapo réelle dès qu'E2/E4 la livrent (le même script, en lisant `C/ecrans` du faux hub après « Lancer l'heure 2 »).
