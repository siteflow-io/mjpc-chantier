# E4 — JOURNAL (le récit et le papier)

*Tenu à chaque poussée : l'heure (UTC), fait · reste · bloqué · relances traitées.*

## 07:28 — poussée 1 : l'audit du mandat (mission 0)
- **fait** : lu en entier, dans l'ordre, `CONTRAT.md`, `PLAN-INTEGRATION-DEROULE.md`, `MANDAT-E4-RECIT-PAPIER.md`, `AUDITS/INTEGRATION-DEROULE/README.md`, `RECYCLAGE-ANCIEN-DEROULE.md`, `DEROULE/CADRAGE-2-LA-RELECTURE.md`, `DEROULE/CADRAGE-INTEGRATION.md`. Production clonée en lecture, md5 `ac792b28f40d3a0510e725fc4a6b6985` vérifié. Maquette p8-5g extraite de `deroule/p8-5g`, md5 `62d9557ac8fedcfbdd8b157a2588cbee` vérifié. Ancien moteur décodé depuis `AT_DR_B64` de la production. `AUDIT-DU-MANDAT.md` écrit et poussé.
- **reste** : les bancs sur la maquette p8-5g (le récit, le papier, ED, documents) ; attendre E1-a sur `integration` (`git fetch` toutes les cinq minutes) ; puis `dr/dr-recit.js`.
- **bloqué / contesté** (attend `RELANCES/E4.md`) : F2 (la forme de `C/recit/<h>`), F7 (les notes du professeur), F8 (le lien ED), C1 (`ouvrirDocs` 1435-1438), C3 (le papier « ce qu'on colle »), C4 (le choix de la classe), C5 (les heures passées). Je code en attendant ce qui n'est pas contesté, et pour les points contestés la lecture la plus fidèle à l'ancien, dite dans `NOTE.md`.
- **branche** : `integration` n'existait pas à 07:26 ; créée depuis `main` par cette poussée (contrat §3 : « par le premier qui pousse »).
- **relances traitées** : aucune (fichier vide).

## 07:42 — poussée 2 : `dr/dr-recit.js` (première version) et le banc unique, éprouvés sur la maquette p8-5g
- **fait** : `dr/dr-recit.js` (89 ko) — le code de mon territoire pris dans la maquette (l. 382-442, 888-891, 916-917, 1435-1448, 1644-1803 ; `voir()` et les raccourcis de l'atelier, l. 1640-1643, restent au socle), avec les seules substitutions de simulation (table en tête du module : `HEURES_SIM`, `DATA.*` → `dr_recit*()`, qui lisent `dr_ctx`, `dr_classe`, `dr_chapitre`, `dr_taxo`, `dr_seance`, et retombent sur la simulation quand elle existe) ; et le nouveau : `C/recit/<h>` (débounce 900 ms par `dr_ecrire`, relu au hub avant la première composition — jamais une écriture avant la lecture) ; la face **Papier** (une par heure : le récit tel qu'il part, l'entête classe · chapitre · séance, « À relire — », le travail, le pied, puis les fiches montrées « à coller dans le cahier ») et l'impression (`#dr-impression`, `@media print` : seule la feuille) ; la copie ED en **HTML propre** (R13, renuméroté R22 à 07:44) ; le rappel d'une fiche et les citations dans le récit (R2, R15) ; la dette **13 · 8** (le récit lit la copie de la classe `S.copie[h][eid][bid]`, pas la trame) ; les documents **par référence** (`sce.items` → `/preview`, « vient de Structure · Séance N », « ⤢ en grand » = `openViewer`).
- **banc** : `E4/bancs/banc.mjs`, sur la maquette + module injecté (`E4/outils/inject.py`) : **23 ok · 0 échec · 3 absents** (C/recit au hub, le rechargement, les documents par référence : ils ne se mesurent que sur le site) — `E4/sorties/0742-maquette/banc-E4.txt`, captures `E4/captures/E4-*.png`. `banc.sh` de la conscience ne se joue pas encore (pas d'`index.html` intégré : E1-a absente).
- **pour E1 (à l'arrivée d'E1-a, je l'écrirai aussi dans la relance si besoin)** : (1) `docHtml`, `videoHtml`, `loupeSur` sont maintenant dans `dr-recit.js`, chargé **en dernier** : le rendu ne doit pas les appeler avant la fin du chargement des modules ; (2) `brancherDocs` (l. 1208) et le bloc `doc` (l. 855) lisent `DATA.documents[String(S.si)]` et refusent un type hors `pdf/image/html/docx` : sur le site, `dr_recitDocuments()` rend les items de Structure (`{id, titre, type:'doc', url, reference:true, pages:1, etapes:1}`) — un document `reference` avec `url` est projetable ; (3) la feuille de style du papier attend dans `E4/dr-recit.css`, je l'ajoute en fin de `dr.css` dans un bloc `/* E4 */` dès qu'il existe.
- **reste** : brancher sur E1-a (noms préfixés `dr_esc`, `dr_presents`, `dr_tout`… ; `seance()` du site ; `dr_blocLu`) ; la Relecture après clôture et rechargement (lire `C/journal`, `C/etat` d'E2) ; le choix de la classe (C4) ; les heures passées depuis `H` (C5) ; le lien ED d'une vidéo à la maison (F8, texte d'E2) ; les infobulles relues ; les relecteurs neufs ; `NOTE.md`.
- **bloqué** : rien ; les points contestés de l'audit attendent `RELANCES/E4.md`.
- **relances traitées** : aucune (fichier vide).

## 07:44 — poussée 3 : alignements avec E1 et E2
- **fait** : audit complété (section 8 : F10 `voir()`/raccourcis 1640-1643 = socle, d'accord avec E1 C6 ; C6 `dr_heureDe` ; C7 le format `C/journal`/`C/etat` d'E2 ; M8 la copie de la classe dans le récit). Recyclage renuméroté sur E1 : mes ajouts = **R15** (citations), **R16** (papier « ce qu'on colle »), **R22** (copie ED en HTML propre). `dr_recitHeure(h)` lit d'abord `dr_heureDe(h)` (E1/E2). Infobulles du sélecteur « composé par le site | ma version » et de « Reprendre la suite ».
- **pour E1 (découpage d'E1-a)** : `dr/dr-recit.js` existe déjà et c'est mon fichier (contrat §3) : si `decouper.mjs` écrit les tranches d'E4, **n'écrase pas `dr/dr-recit.js`** — mets ta tranche à côté (par ex. `E1/sorties/tranche-E4.js`) ou laisse-la dans `dr-socle.js` ; je reporte tes renommages de collisions (`esc`→?, `presents`→?, `tout`→?, classes `c`, `ok`…) dans mon module dès E1-a. Les lignes que j'ai prises : 382-443 (récit), 888-891, 916-917 (`docHtml`, `videoHtml`, `loupeSur`), 1435-1448 (documents, vidéo), 1644-1803 (relecture).
- **reste / bloqué / relances** : inchangé (E1-a attendue ; `RELANCES/E4.md` : rien).

## 07:47 — poussée 4 : le document voyage avec la scène ; l'essai sur maquette en une commande
- **fait** : `dr_docEtat(id)` — un document montré porte dans `S.doc` (donc dans `et.doc`) son titre, son URL `/preview`, sa séance : le tableau (une autre page, `?vue=tableau`, sans le chapitre chargé) le rend sans relire Structure ; `docHtml` le prend là s'il ne trouve pas l'item. `E4/outils/essai-maquette.sh` : le banc sur la maquette avec le module du dépôt injecté — **23 ok · 0 échec · 3 absents** (`E4/sorties/0745-maquette/`). Heures du journal corrigées sur l'horloge réelle (UTC).
- **pour E1 / E3** : `brancherDocs` (le bloc `doc` d'un écran) devrait poser `S.doc = dr_docEtat(id)` au lieu de `{id, pos: 1}` pour que le tableau ait de quoi rendre.
- **à reporter dès E1-a** : les collisions dans mon module — `esc` (98), `tout` (7), `presents` (1), classes `c` (2), `h` (1), `d` (1) — avec les noms qu'E1 aura choisis.
- **relances** : `RELANCES/E4.md` relu : rien.

## 07:47 — poussée 5 : le choix de la classe dans la Relecture (audit C4)
- **fait** : un sélecteur des classes qui ont joué la séance (`B/deroule_joue/*`, la plus récente d'abord), dans la barre des faces, sur le site seulement ; par défaut la classe du cours actif, sinon la dernière jouée (mandat §3) ; grisé avec sa raison pendant une heure en cours ; au changement : relit `C'/journal` et `C'/etat` de cette classe (ou `dr_relireClasse` d'E2 s'il existe), puis son `C'/recit`. Banc maquette inchangé : 23 ok · 0 échec · 3 absents.
- **relances** : rien. **E1-a** : pas encore là (surveillance de `integration` armée, une minute).

## 07:51 — poussée 6 : branché sur les lectures d'E2
- **fait** : la Relecture d'une autre classe / d'une heure close lit par `dr_lireJoue(cb, C)` d'E2 (`{S, parDiapo, vuMax, J}`, rangs refaits depuis les `eid`) ; `dr_recitHeure(h)` lit `dr_heureJouee(h)` (`S.heuresCours[h]`, même forme que `HEURES_SIM`). Banc maquette : vert, inchangé.
- **relances** : rien. E1-a : pas encore.

## 08:50 — poussée 7 : le banc sur un socle simulé — C/recit, le rechargement, les documents mesurés avant E1-a
- **fait** : `E4/bancs/socle-simule.js` (jamais livré : un hub en mémoire gardé d'une ouverture à l'autre, `dr_lire/dr_ecrire`, `dr_cheminB/C`, `dr_seance` = la séance 0 du faux hub avec ses items) ; `MJPC_ENTREE=simule sh E4/outils/essai-maquette.sh …`. **Socle simulé : 29 ok · 0 échec · 0 absent** — `C/recit/1` écrit (`{version:'moi', texte, versions}`), rechargé : la phrase corrigée revient ; K15 (E4) : seulement `C/recit/<h>` ; l'item Drive « Les cinq tableaux à analyser » s'ouvre dans l'écran en `/preview`, « vient de Structure · Séance 1 ». **Maquette seule : 23 ok · 0 échec · 3 absents.** Sorties : `E4/sorties/*-simule`, `*-maquette`.
- **corrigé** : `dr_recitDocuments` ne prend la simulation que si elle a des documents pour la séance ; le banc lit un chemin du hub qui contient des espaces (« 3E Charles de Gaulle ») ; les épreuves après R3 repartent d'un hub neuf ; bouton grisé visible dans le panneau des documents.
- **E1-a** : toujours absente à 08:50 (dernière poussée d'E1 : 07:50, son audit). Si rien à H0 + 3 (≈ 10:23), je travaille dans `attente-E4/` comme le dit le contrat §10 — en pratique mon module tourne déjà sur une copie de la maquette (le banc) : je le dirai ici.
- **relances** : `RELANCES/E4.md` relu : rien.

## 09:11 — poussée 8 : premier relecteur neuf (passe préalable) — dix trouvailles corrigées
- **fait** : deux relecteurs neufs lancés sur la maquette + module ; le n°1 (récit, ma version, ED) a rendu 13 trouvailles : 10 corrigées dans `dr-recit.js`, chacune avec sa garde au banc (épreuve **T**) — `E4/relecteurs/R1-pre-E1a.md`. Banc : **socle simulé 34 ok · 0 échec · 0 absent ; maquette 28 ok · 0 échec · 3 absents**.
- **pour E2** : les boutons `#f-copie-contenu` / `#f-copie-travail` de la fin de l'heure (l. 1567-1568, ton territoire) copient du texte brut ; cadrage 2 · 1.9 veut le HTML propre : `dr_recitCopierED(html, null, 'copié : …')` (dr-recit.js) le fait — html = `recitPourED(h)` pour le contenu, `'<p>' + esc(texteTravail()) + '</p>'` pour le travail.
- **dettes (jamais cachées)** : (11) les prises de parole hors question ne sont pas racontées ; (12) après des sauts de diapo, `troisTemps` sort de l'ordre du temps et « et enfin » peut ne pas être le dernier connecteur ; (13) le verdict apparaît en cours d'heure. Hérités de la maquette ; je les reprends après le branchement sur E1-a.
- **relances** : rien. E1-a : absente.

## 09:16 — poussée 9 : second relecteur neuf (passe préalable) — Papier, impression, séance
- **fait** : 15 trouvailles (`E4/relecteurs/R2-pre-E1a.md`) ; corrigées dans mon territoire : la note pour Paul hors du papier et d'ED, l'échéance de chaque heure, les marges d'impression, « La séance » avec ma version, l'impression depuis toutes les faces de la Relecture, pas de récit avant un lancement (garde : banc **P0**), « on a regardé ». Banc : **socle simulé 35 ok · maquette 29 ok · 3 absents · 0 échec**.
- **pour E2** (ton territoire, vu par le relecteur n°2 sur la maquette) : (2) après la clôture de l'heure 1 puis « Voir la relecture de l'heure 1 », l'heure 2 ne se lance plus et ◀ ▶ écrivent `h:1` dans le journal de l'heure close ; (3) la fin de l'heure 2 s'ouvre à l'étape 7, « sans échéance » coché, « ce qui reste » non décidé ; (5) le travail de l'heure 2 donne à apprendre les notions de l'heure 1 (`S.travail.apprendre` non remis à zéro). Boutons sans infobulle : « Revérifier », « Voir la relecture de l'heure 1 », « Lancer l'heure 2 », « Clore l'heure », « Annuler », `#f-ech`.
- **relances** : rien. E1-a : absente.

## 09:17 — poussée 10 : « et enfin » à sa place
- **fait** : `adverbeEtape` ne tire plus « et enfin » au hasard : il vient à la dernière étape racontée (dette 12 du relecteur n°1, en partie ; l'ordre du temps après des sauts reste). Banc maquette : 29 ok · 3 absents.
- **relances** : rien. E1-a : absente ; personne n'a poussé depuis 07:59 hormis moi.

## 09:36 — poussée 11 : branché sur E1-a — **mon banc vert sur le site intégré (35/35)**
- **E1-a reçue à 09:28** (commit 12bfa0ba) ; `dr/dr-recit.js` intact, chargé en dernier. Ce que j'ai branché :
  - les noms définitifs du socle : `esc` → `dr_esc` (100), `tout` → `dr_tout` (7), `presents` → `dr_presents` (1), classes `c`/`h`/`d` → `dr-c`/`dr-h`/`dr-d` (les alias de transition d'E1 ne me servent plus) ;
  - `dr_activites()` rend `{si: […]}` ; `dr_heureDe(h)` du socle ne lit pas `h` (l'heure d'aujourd'hui) : je ne la prends que pour l'heure en cours, et `dr_heureJouee(h)` d'E2 d'abord ;
  - les blocs du site ont `bid/txt/el` en accesseurs non énumérables : la copie de la classe (13 · 8) passe par `dr_blocVu` ;
  - **`dr_documents()`** (le stub d'E1 « remplacée dans dr-recit.js ») : les items de Structure de la séance, `type` « projetable » pour `brancherDocs` de l'Atelier, les documents ajoutés dans l'Atelier gardés ;
  - mon bloc CSS ajouté **en fin de `dr.css`** (« /* E4 — le récit et le papier … */ », non circonscrit à `#dr-zone` : `#dr-impression` est un enfant de `body`).
- **Bancs** : `E4/bancs/banc.mjs` sur `assemble/index.html` (entrée du site, faux hub) : **35 ok · 0 échec · 0 absent** (`E4/sorties/0934-site-E4/`) — le récit, ma version au hub et au rechargement, le Papier et l'impression, la copie ED HTML, le rappel et « ce qu'on colle », le document Drive en `/preview`, 13 · 8, P0, la langue. Le voile `#fi-overlay` (faux hub sans `/manifestes`, audit E1 F15) est écarté dans mon banc, et dit.
- **banc.sh** (`E4/sorties/0930-site/`) : P10 et **P11 verts** (« Le récit · heure 1 | Ce qui s'est passé · heure 1 | Papier · heure 1 | Le chapitre ») ; rouge ailleurs : **P8** (le tableau, E3) ; en mode test **P5** (le parcours attend des écritures au lancement que le mode test retient) ; P12 absent (E2). Contrôles K : en cours.
- **pour E2** : `ouvrirDocs` est défini aussi dans la coupe d'E1 en tête de `dr-classe.js` ; le mien (chargé après) l'emporte ; à retirer de ta coupe quand tu la reprends (audit C1, d'accord avec ton F13).
- **relances** : `RELANCES/E4.md` relu : rien.

## 09:45 — poussée 12 : la Relecture rechargée relit le hub ; le sélecteur de classe lisible
- **fait** : à l'ouverture de la Relecture sans heure lancée en mémoire (rechargé, ou après la clôture), la classe par défaut est relue au hub par `dr_lireJoue` d'E2 (`C/journal`, `C/etat`) puis son `C/recit` ; le sélecteur de classe a le style du déroulé et une ligne par classe (la copie jouée existe sous deux formes de clé : `3e_charles_de_gaulle` et `3E Charles de Gaulle`, audit F9). Banc site : **35 ok · 0 échec · 1 absent** (`E4/sorties/0942-site-E4/`).
- **pour E2 — mesuré** : `C/journal` au hub n'a que les 3 événements du lancement après une heure jouée (3 dévoilements, une parole, une réponse) : `dr_journalAuto` (et `dr_etatAuto`, `dr_traceAuto`) ne partent que depuis `dr_copieAuto`, appelée par `dr_sauve` quand la **copie** change — pas à chaque `journal(…)`. Conséquences : la reprise après rechargement et la Relecture d'une heure close racontent une heure vide. Et au rechargement, `cours_actif` désigne l'heure mais `S.lancee` reste faux (pas de reprise). Mon épreuve R3 « recomposé depuis C/journal » attend ça (absente tant que le journal au hub n'a pas la réponse).
- **relances** : rien.

## 09:51 — poussée 13 : le verdict au passage au cahier ; harnais maquette remis à jour ; E1-b rejouée
- **fait** : le verdict (« Et on l'a terminée. » / « Mais on ne l'a pas terminée. ») n'est dit qu'au passage au cahier ou à la clôture (cadrage 2 · 1.2 quater ; dette 13 du relecteur n°1). `E4/bancs/alias-maquette.js` : sur la maquette seule, `dr_esc/dr_tout/dr_presents` renvoient aux noms de la maquette (banc, jamais livré). Avec **E1-b** (la colonne unique) : **site 35 ok · 1 absent (R3, dépend d'E2) · 0 échec ; maquette 29 ok · 3 absents ; socle simulé 35 ok**. Captures `E4/captures/` : celles du site.
- **en cours** : la passe obligatoire des relecteurs neufs sur `assemble/index.html` (deux sous-agents, contrat §8.8).
- **banc.sh** : les K sont tous arrêtés par le voile `#fi-overlay` (audit E1 F15, à la conscience) ; P10 et P11 verts.
- **relances** : rien.

## 10:14 — poussée 14 : la passe obligatoire des relecteurs neufs sur le site — corrections
- **fait** : deux relecteurs neufs sur `assemble/index.html` (`E4/relecteurs/R3-R4-site.md`) ; 14 trouvailles de mon territoire corrigées (impression refaite au moment d'imprimer, rien avant un lancement, aperçu du document, date sur le papier, infobulles, journal, langue, paroles hors question, participation, classe relue, « (proposition) », lien ED dans la copie du travail). Banc site : **38 ok · 0 échec · 1 absent (R3, E2)** ; sans `ed` : **38 ok**, la copie sans lien.
- **pour E2 (mesuré par deux relecteurs)** : `C/journal` jamais réécrit après le lancement ; **« Clore l'heure » → `edt is not defined`**, `H` reste `clos:false` ; la garde de clôture couvre la Relecture. **Pour E1** : ▶ dévoile derrière un document projeté ; `#bdev` recouvert à 1366/1280 ; activités sans numéro. **Pour E3** : « ma version » fait écrire `C/scene`.
- **relances** : `RELANCES/E4.md` relu à 10:14 : rien.

## 10:17 — poussée 15 : dettes du récit (relecteurs neufs)
- **fait** : une note versée entre précédée d'un connecteur et close par un point (cadrage 2 · 3.4) ; ↶ ↷ des versions de « ma version » dans la Relecture aussi (cadrage 2 · 3.8) ; une étape « Regarde : la troisième bande… » se raconte « on a regardé la troisième bande… » (seulement devant un déterminant : « Date : 1820 » reste tel quel). Banc site : **38 ok · 1 absent (E2) · 0 échec** ; l'épreuve T mesure les quatre transpositions.
- **relances** : rien.

## 10:20 — poussée 16 : NOTE.md ; l'effectif de la classe relue
- **fait** : `E4/NOTE.md` écrite (tenue à jour jusqu'à la fin) ; le bilan d'une classe relue (autre que celle du socle) compte ses présents à elle. Banc site vert. Les dettes de la section C du plan dans mon territoire : 13 · 8 seule, réglée.
- **relances** : rien.

## 10:27 — poussée 17 : rejoué sur E1-b (la trame ligne pour ligne, l'Atelier entier)
- **fait** : banc site **38 ok · 0 échec · 1 absent (R3, E2)** sur l'assemblé avec E1-b (`e19d2e4d`) ; captures mises à jour.
- **relances** : rien.

## 11:09 — poussée 18 : relance E4-2 — R1 les marques sur une image ; le réveil n°2 appliqué
- **relances** : `RELANCES/E4.md` (fusionné de `main`) : **E4-2** (A : R1, R4, R2, R6, R5 dans `dr-recyclage.js` ; B : le relecteur continu) et **le réveil n°2** (mon audit tranché). Traitées en premier.
- **fait — réveil n°2** : `C/recit/<clé d'heure>` (`_drCleHeureDe` : `S.heuresCours[h].cle` d'E2, ou `AT_DR_COURS`) portant `{version, moi, moiT, versions, k, relu, aChange, copieED}` ; la copie ED **sans lien** ; les documents sans la modale du site, « Ce document n'a pas d'adresse » en clair.
- **fait — R1** (`dr/dr-recyclage.js`, chargé après `dr-recit.js` : une ligne dans `index.html`) : l'ancien modèle `b.marques[{t, x, y, txt, w, h}]` (point numéroté, étiquette, flèche, cadre, légende), « Document analysé / Illustration », « Marques une à une / Toutes ensemble », poser d'un clic (outil armé), éditer en place (deux appuis), supprimer (✕, Suppr), Échap ; calibrées à la largeur de l'image (4,2 %) au pilote, au tableau, dans les vignettes ; le panneau des marques en tête de la colonne de l'Atelier, chaque bouton avec son infobulle. **Deux crochets d'une ligne dans `dr-socle.js`** (`/* E4 : R1 */`) : `elements()` (une marque « une à une » = un élément, comme une étape) et le rendu de l'image (`dr_marquesHtml`, `k += dr_marquesNb`). `marques` devient une propriété enregistrée à la première marque (le socle la pose cachée tant qu'elle est vide). Le récit dit « où on a repéré « … » » pour les marques dévoilées nommées. CSS en fin de `dr.css` (bloc E4).
- **banc** : `E4/bancs/banc.mjs` + **RC1** — site : **51 ok · 0 échec · 0 absent** (R3 est vert : E2 réécrit `C/journal`). `banc.sh` : K1-K13 **108/108**, parcours vert ; seul rouge : P5 en mode test (l'outil attend une écriture que le mode test retient — écrit dans `RELECTURE-CONTINUE.md`).
- **conflit résolu** : `dr.css` (le bloc d'E2 et le mien ajoutés en fin de fichier en même temps) : les deux gardés.
- **reste** : R4, R2, R6, R5 ; relecteurs continus.

## 11:17 — poussée 19 : E4-2 · R4 ↶ Annuler (Ctrl+Z) dans l'Atelier
- **fait** : la pile de l'ancien (`sauve`/`annuler`, 40 états) : `dr_sauve` (E1) est **enveloppée depuis `dr-recyclage.js`** (aucune ligne changée chez E1 : toute modification de l'atelier passe par `marquerModif` → `dr_sauve`) ; au premier appel d'une rafale l'état d'avant est empilé, 900 ms de calme et l'état courant devient l'état posé ; ↶ reprend la trame (blocs, textes, ordre, marques ; `heure`, non énumérable chez le socle, gardée) et la réenregistre au hub. « ↶ Annuler » dans la barre de l'atelier (à gauche de « + bloc »), grisé avec sa raison ; Ctrl+Z hors d'un champ ; **dans un champ, Ctrl+Z reste celui du navigateur**. Rien en classe.
- **banc RC4** : trois gestes (texte, Alt+↓, Suppr) → trois ↶ (Ctrl+Z, Ctrl+Z, le bouton) à l'identique (eid, id, texte), `B/deroule` réécrit ; site **57 ok · 0 échec**.
- **B** : deux relecteurs continus lancés sur tout le parcours (commit `843b49b4`), résultats à venir dans `RELECTURE-CONTINUE.md`.
- **relances** : rien de neuf depuis 11:09.

## 11:22 — poussée 20 : E4-2 · R2 le rappel d'une fiche
- **fait** : l'ancien (`MOTIFS_RAPPEL`, `memeFeuille`, `dejaPosee`, `ouvrirRappel`/`poseRappel`, le rendu « ↻ Rappel ») : après chaque modification de l'atelier (via `dr_sauve` enveloppée), une fiche qui vient d'apparaître et qui est déjà dans le chapitre (toutes les séances) devient un rappel `b.rappel = {motif:'', libre:''}` et « Pourquoi ce rappel ? » s'ouvre près du bloc (quatre motifs, « dis-le autrement (les élèves le liront) », « valider ce texte », « plus tard ») ; la fiche porte « ↻ Rappel — <motif> » au pilote, dans l'atelier (un clic rouvre la question) et au tableau : **un crochet d'une ligne** dans le rendu de la fiche (`dr-socle.js`, `/* E4 : R2 */`). `memeFeuille` : la feuille, sinon la référence ; **les fiches du site n'ont ni l'une ni l'autre (F17)** : alors le titre (et le genre quand les deux l'ont) — écart à l'ancien, écrit ici. Le récit et le papier le disaient déjà (« on a repris la fiche T — pour réviser avant l'évaluation », bilan « repris une fiche déjà vue »).
- **banc RC2** : fiche neuve → rien ; « Le registre lyrique » (séance 1) reposé en séance 0 → la question, le motif, la diapo, le hub, la classe, le récit, le papier ; site **65 ok · 0 échec**.
- **relances** : rien de neuf.

## 11:28 — poussée 21 : E4-2 · R5 la sélection multiple ; R6 bloqué par R13 (E1)
- **fait — R5** (Paul ne l'a pas rayée : je l'ai faite, comme la relance le dit) : Ctrl+clic (Cmd+clic) sur une étape ou un bloc de la diapo de l'atelier → sélection (pointillés) et menu « Supprimer les N éléments » · « ✍🏻 Marquer « à écrire » » · « Annuler la sélection » (infobulles) ; Échap vide ; changer de diapo vide. Supprimer passe par `marquerModif` (donc ↶ R4 le défait) ; « à écrire » se garde **dans la trame par identité** (`e.aEcrire = ['<bid>', '<bid>.<étape>']`, jamais un rang) et devient le ✍🏻 de la classe : **un crochet d'une ligne dans `etatDiapo`** (`dr-socle.js`, `/* E4 : R5 */`). L'ancien sélectionnait au lasso et copiait/coupait plusieurs blocs : ici Ctrl+clic (la relance), copier/couper restent ceux de l'atelier (un bloc).
- **R6 — bloqué, à la conscience** : Ctrl+B / Ctrl+U doivent faire « les boutons G / S » ; **ces boutons n'existent pas dans le site** (R13, attribué à E1, pas encore fait), et une ligne de la diapo s'enregistre en texte brut (`ecrireDansDiapo` : `textContent`, audit E1) : un raccourci aujourd'hui poserait un gras **perdu à l'enregistrement**. Je le fais en une ligne dès que R13 donne les boutons (ou leur fonction) ; d'ici là, rien (pas de faux geste).
- **banc RC5** : site **72 ok · 0 échec**. `banc.sh` : en cours.
- **relances** : rien de neuf.
- **11:35 — banc.sh** (`E4/sorties/1128-site/`) : K1-K13 **0 défaut**, parcours vert ; seul rouge : P5 en mode test (l'outil, déjà dans `RELECTURE-CONTINUE.md`).

## 12:05 — poussée 22 : B · les deux relecteurs continus rendus ; deux défauts à moi réglés
- **B** : relecteur A (l'heure de classe, l'EDT, la reprise, la fin de l'heure) : **19 défauts** (E2 surtout : le lancement par la case plante dans `voir()` et n'écrit pas `cours_actif`, donc pas de reprise ; l'heure 2 qui disparaît de l'EDT ; « rien ne restait » ; E1 : la question grisée, l'entête à 1280) ; relecteur B (Atelier, tableau, Relecture) : **14 défauts** (E1 : le menu de la colonne, le témoin simulé, le bandeau « Enregistré » qui couvre, le journal dans l'atelier ; E3 : 52 pt au tableau). Tout est dans `RELECTURE-CONTINUE.md`, daté, avec le commit joué, la source et la capture (`E4/relecteurs/continu-1115/`, `continu-1140/`).
- **à moi, réglé** : Suppr sur une marque supprimait aussi la diapo (mon écoute passe maintenant sur `window`, avant le socle) ; la majuscule devant un nom en gras et « ?. ». Gardes au banc (RC1, T).
- **incident git, réparé** : un `stash pop` silencieusement refusé (« Cannot rebase onto multiple branches » au `pull`) ; la remise retrouvée dans les objets git (`8890b686`) et réappliquée ; rien de perdu.
- **banc** : sur l'assemblé avec E1 (poussée 8) et E3 : **74 ok · 0 échec** — RC4 suit la modale du site (`dr_confirmer` d'E1 a remplacé `confirm()`).
- **relances** : rien de neuf.

## 12:25 — poussée 23 : rejoué sur la relance d'E2 (F2 : l'heure n de la case)
- **mesuré** : avec `1f688d29` d'E2, « Lancer l'heure » lance **l'heure 2** de la séance 0 (le faux hub a une heure jouée le 07/09) — conforme (son F2) ; `S.heuresCours[2].cle` = `2026-09-14_08h57-09h52_3E_Charles_de_Gaulle`, que mon `C/recit/<clé>` suit. Mon banc lisait l'heure 1 en dur à deux endroits (R2, ED) : il lit maintenant `S.heure`. Site **74 ok · 0 échec**. Rien à changer dans mes modules.
- **relances** : rien de neuf.

## Poussée 24 — 12:36 UTC
- Relecture continue : le relecteur A2 (sur `5bbc8097`) est consigné dans RELECTURE-CONTINUE. Il juge réglés le lancement par la case, la reprise et la tête à 1280. Restent ouverts, revérifiés : « rien ne restait », la question grisée, le bandeau « Enregistré », la séance qui disparaît de l'EDT à la clôture, la réponse absente du tableau. Il y a 8 lignes nouvelles, et une écartée par le cadrage : l'heure de fin dans le récit. Les captures sont dans `relecteurs/continu-1233/`.
- Ensuite : je rejoue banc.sh sur les poussées E2 `59c633ea` et E3 `b35bcc0f`, et j'attends le relecteur B2.

## Poussée 25 — 12:45 UTC
- Rejoué sur les poussées E2 `59c633ea` / `4a13e628` et E3 `b35bcc0f` :
  - banc.sh : K1-K13 108/0, parcours vert ; seul rouge, P5 en mode test, l'outil (`sorties/1235`).
  - Mon banc : **74 ok · 0 échec**.
- Relecteur B2 consigné (sur `5bbc8097`) :
  - les 6 points de 11:40 sont réglés ;
  - la répétition reste cachée à 1280 et à 1366 ;
  - 12 lignes nouvelles, dont **8 à moi** (marque posée sans focus, phrase fantôme au rechargement, transpositions, annuler après « Marquer », annulation en rafale, menu de la sélection, « Ce qui s'est passé », espace insécable au papier).
  - Captures dans `relecteurs/continu-1238/`.
- Ensuite : je corrige mes 8 lignes, une épreuve chacune.

## Poussée 26 — 13:04 UTC
- **Mes 8 lignes de B2 sont réglées**, chacune avec une garde au banc.
- **dr-recyclage.js :**
  - l'étiquette ou la légende posée prend la frappe ;
  - chaque geste discret fait un pas de ↶ (`dr_annulerCoupure`) ;
  - ↶ après « Marquer à écrire » recalcule les ✍ (`dr_ecrResynchro`) ;
  - le clic droit sur une sélection ouvre le menu de la sélection, et Suppr supprime la sélection.
- **dr-recit.js :**
  - une diapo reloguée au rechargement ne compte plus (`dr_recitSansRepetes`), donc plus de phrase fantôme ni de « Ensuite, on a fait X » à chaque rechargement ;
  - ce qui ne se transpose pas se cite (`dr_seCite`) ;
  - l'impératif en tête se transpose ;
  - « Ce qui s'est passé » signale la réponse sans élève, et la dernière diapo garde ce qui arrive à l'instant de sa fin ;
  - le papier a ses espaces insécables (`dr_typo`).
- **Bancs :**
  - Mon banc : **82 ok · 0 échec** (`sorties/1258-site-E4`).
  - banc.sh : K1-K13 108/0, parcours vert. Seul rouge, P5 en mode test, qui vient de l'outil (`sorties/1302`).
- `assemble/index.html` est régénéré.
- **Dette dite :** la phrase fantôme est gardée par un test unitaire (`dr_recitSansRepetes`), pas encore par un rechargement complet au banc. Le prochain relecteur la revérifie.

## Poussée 27 — 13:16 UTC
- **R6 fait** : Ctrl/Cmd+B et +U sur une sélection de la diapo appellent `dr_grasSoul` (R13, livré par E1). Ils marchent dans l'atelier (trame) et en classe (état de l'heure). Garde RC6 : gras et souligné posés, enregistrés au hub ; sans sélection, rien.
- Toute la relance E4-2 A est faite : R1, R4, R2, R6, R5.
- **Bancs :**
  - Mon banc : **86 ok · 0 échec** (`sorties/1310-site-E4`).
  - banc.sh : K 108/0, parcours vert. Seul rouge, P5 en mode test, qui vient de l'outil (`sorties/1314`).
- Les relecteurs neufs A3 (heure de classe) et B3 (atelier, relecture) tournent sur `a68469f5`.

## Poussée 28 — 13:38 UTC
- **Réveil n°3 lu et traité :**
  - `C/part` tombe (contrat §12.9) : ligne écartée.
  - L'outil des relecteurs pose `M8_TEST = true` après le panneau prof : ligne réglée.
  - L'heure de fin dans le récit est posée à Paul ; ma lecture tient en attendant.
  - R6 est fait (poussée 27).
  - Mes lignes de 12:38 étaient marquées réglées depuis la poussée 26.
- **Dette soldée :** la phrase fantôme est gardée par un vrai rechargement (R3, mesuré dans le DOM : ni `.ed-suite`, ni « on a continué X avec X »). La garde a trouvé un défaut de plus : avec ce qui a été vu à l'instant où Paul prend la plume, `>=` faisait une « suite » fantôme. Le test est maintenant strict (`>`).
- **Bancs :**
  - Mon banc : **87 ok · 0 échec** (`sorties/1330-site-E4`).
  - banc.sh (parcours.mjs v3) : **tout vert**, K 108/0 et les deux parcours, y compris le mode test (`sorties/1334`).

## Poussée 29 — 13:56 UTC
- **Relecteur A3 consigné** (sur `a68469f5`) :
  - réglés : le chrono après la clôture ; l'EDT après la clôture ; l'échéance au lancement ;
  - encore ouverts : la question grisée, le bandeau, la réponse au tableau, le paquet sans décisions, l'échéance après une reprise ;
  - 10 lignes nouvelles, dont 2 graves : F2 qui pose une parole pour une autre élève, et la reprise qui fait perdre le cahier de l'heure 2.
  - **1 ligne à moi, réglée** : « on a continué » n'est plus inventé quand le journal n'a rien dans ce temps (garde T).
- **Mon banc :** **88 ok · 0 échec** (`sorties/1342-site-E4`).
- **banc.sh : ROUGE, et ce n'est pas mon fait.**
  - K 108 / 18 échecs (K2, K6-K11) apparaissent avec la poussée E2 `a0c4c92d` (la frontière d'heure par les durées).
  - C'est mesuré sur `origin/integration` seul, sans mon changement : les mêmes 18 échecs (`sorties/1345-a0c4c92d-seul/`).
  - Les deux parcours restent verts.
  - Je l'écris dans RELECTURE-CONTINUE pour la conscience. Je ne corrige pas chez E2.

## Poussée 30 — 14:32 UTC
- **Relecteur B3** (sur `a68469f5`) :
  - Il confirme 7 de mes 8 corrections de B2.
  - Il a 11 lignes pour moi. **8 sont réglées**, chacune avec une garde (épreuve B3) :
    - l'heure fantôme : `dr_dansLH`, et une heure n'est racontée que si elle a été lancée ;
    - le bloc libre est raconté ;
    - le premier clic sur un outil après l'écriture n'est plus perdu ;
    - l'étiquette vide s'enregistre vide ;
    - le point après « », et jamais deux fois le même connecteur ;
    - le verdict sans activités ;
    - les insécables à l'écran ;
    - la ligne « a répondu » n'est plus doublée.
  - **Dettes dites** (RELECTURE-CONTINUE) : « Le chapitre » quand la classe joue l'heure 2 ; « hors de l'heure » sans reprise ; la suite qui ne raconte pas un dévoilement sur une diapo déjà vue ; le « ⚠ » pas encore cliquable.
- **La frontière d'heure d'E2 (`a0c4c92d`)** fait lancer, sur le faux hub, l'heure 2 aux diapos 7-16.
  - Mon banc s'aligne : RC1, RC2, RC5 jouent l'heure 1, et R1 donne la parole sur une diapo sans question.
  - Les K2-K11 de la conscience visent la diapo 1 : c'est à trancher par la conscience (écrit en relecture continue).
- **Bancs :**
  - Mon banc : **95 ok · 0 échec** (`sorties/1426-site-E4`).
  - banc.sh : les parcours sont verts. K 108 / 18, la cause est ci-dessus, pas mon module (`sorties/1431`).

## Poussée 31 — 15:00 UTC
- **Réveil n°4 lu** : sur les dix lignes du 14:05, sept étaient réglées à la poussée 30. Celle-ci règle **l'impression**.
  - `dr_relectureVisible` lisait `offsetParent`. En média d'impression, ma règle cache la Relecture, donc beforeprint retirait la copie et tout le site s'imprimait.
  - Garde P1 : un vrai `page.pdf`, dont le texte est lu par pdftotext.
- Restent « Le chapitre » et « la réponse attendue » (dettes dites). R6 est fait depuis la poussée 27.
- **Relecteur A4** consigné (sur `d5f9a6d6`) :
  - 6 réglés : la question grisée, le bandeau, la réponse au tableau, « Où on en est », la reprise de l'heure 2, l'EDT ;
  - 10 lignes nouvelles. **2 à moi, réglées** : l'échéance hors de la liste se dit (`dr_recitEcheanceDe`) ; une diapo jouée n'est plus « hors de l'heure » (garde B3).
  - J'ai mesuré que la copie ED de la Relecture garde ses paragraphes. Les paragraphes collés viennent de l'étape 6 de la fin de l'heure (E2).
- **Bancs :**
  - Mon banc : **97 ok · 0 échec** (`sorties/1452-site-E4`).
  - **banc.sh v1.1 : VERT**, K 108/0 et les deux parcours (`sorties/1457`).

## Poussée 32 — 15:37 UTC
- **Deux dettes soldées :**
  - **La suite de ma version** dit ce qui a été dévoilé après la prise de plume sur une diapo déjà vue, par exemple « Ensuite, sur X, la réponse attendue vue en classe était : « … » » (`dr_suiteDevoiles`, cadrage 2 §1.10).
  - **« Le chapitre »** : une heure antérieure à la première heure relue est « jouée avant », jamais « à venir ». « Travaillée pas encore » tient à la règle 7.1 du socle.
  - Gardes B3.
- **Bancs :**
  - Mon banc : **99 ok · 0 échec** (`sorties/1535-site-E4`, avec E2 `712accda` / `00b324f9`).
  - banc.sh : **VERT** (`sorties/1524`).
- Le relecteur B4 (atelier, relecture, impression) tourne sur `5f0c01a4`. E1 a poussé après ; le prochain relecteur A partira de la tête.

## Poussée 33 — 15:56 UTC
- **Réveil n°5 lu.**
  - Les trois lignes « à moi » qu'il cite (le bloc « clique ici et écris », l'outil qui avale le premier clic, l'Étiquette vide) sont **réglées depuis la poussée 30 (14:30)**, gardes B3. Le relecteur B4 (sur `5f0c01a4`) les a revérifiées : réglées toutes trois, aux deux tailles.
  - **R2 et R4 : faits et gardés depuis 12:05**, comme R1, R5 et R6 (13:10).
    - R2, le rappel d'une fiche : la question « Pourquoi ce rappel ? », le motif sur la diapo, au tableau, dans le récit et sur le papier (RC2).
    - R4, ↶ Annuler et Ctrl+Z dans l'Atelier : pas à pas, chaque geste discret fait un pas (RC4, RC1, RC5).
- **La dernière dette de B3 est soldée** : le « ⚠ élève non identifié » est un bouton. On choisit l'élève dans la liste et le récit le nomme. La trace `reponse-corrigee` va au journal et se réapplique au rechargement (cadrage 1 §4.7, cadrage 2 §2.3, garde T).
- **Bancs :**
  - Mon banc : **100 ok · 0 échec** (`sorties/1548-site-E4`).
  - banc.sh : **VERT** (`sorties/1553`).
- **Ensuite** : la passe de revérification complète de la table sur `21ed40fe` que demande le réveil n°5. A5 (sur `d212aaec`, qui contient `21ed40fe`) joue l'heure de classe. Je lance la passe de l'atelier et de la relecture, puis je consigne B4.

## Poussée 34 — 16:10 UTC
- **Relecteur B4** consigné (sur `5f0c01a4`) :
  - Il vérifie mes 12 corrections : 9 réglées, 3 réglées avec une réserve. Le seul « pas réglé » : « puis… puis » (réglé maintenant).
  - **Réglés à 16:07**, avec gardes :
    - la relecture d'une heure close lit les écrans de la classe (C/ecrans) et relit `ordres` / `ordresEid` : le bloc écrit en classe est raconté, les rangs reviennent ;
    - une activité montrée n'est jamais « pas faite » ;
    - « A, puis B et enfin C » ;
    - la minuscule après le connecteur d'une note versée ;
    - une image sans légende dit le nom de la diapo (« on a observé . », trouvé par mon banc).
  - **Ouverts, à moi** :
    - la reprise sans « Reprendre le cours » (ordres et participation) ;
    - « Diapo par diapo » sans les diapos jouées hors de l'heure ;
    - « Le chapitre » après un rechargement ;
    - l'ordre bilan / travail en ma version ;
    - le cadre qu'on ne dimensionne pas.
- **Bancs :** mon banc **101 ok · 0 échec** (`sorties/1607-site-E4`).
- banc.sh : VERT (`sorties/1612`).

## Poussée 35 — 16:20 UTC
- **Relecteur A5** consigné (sur `d212aaec`, qui contient `21ed40fe`) :
  - réglés : F2 avec sa note, la copie ED en HTML, le paquet avec ses décisions ;
  - pas réglés : l'échéance après une reprise, « Lancer » après la clôture, le curseur dans la réponse, la page 1 d'une diapo paginée, la confirmation de F2, T-5, le chrono ;
  - 7 lignes nouvelles, dont 2 hautes chez E2 (la reprise en « H1 », les décisions rejouées à l'heure 3). Rien à moi.
- **La passe complète du réveil n°5** : il reste 84 lignes ouvertes (56 pour l'heure de classe, 28 pour l'atelier et la relecture). Deux relecteurs neufs revérifient **chaque ligne** sur la tête `d1b54fc9`, qui contient `21ed40fe`. Chaque ligne sera marquée « réglé le … (commit) » ou « pas réglé (commit) ».

## Poussée 36 — 16:30 UTC
- **Trois lignes de B4 réglées**, avec gardes :
  - rechargée sans « Reprendre le cours », la Relecture relit l'état de la classe : « Diapo par diapo » et la participation reviennent (R3) ;
  - « Diapo par diapo » montre aussi les diapos jouées hors de l'heure ;
  - en ma version, le bilan reste celui du site, après le travail, dans le récit, sur le Papier et dans la copie ED (T).
- **Bancs :**
  - Mon banc : **103 ok · 0 échec** (`sorties/1626-site-E4`).
  - banc.sh : **VERT** (`sorties/1631`).
- La passe complète (84 lignes) tourne sur `28a0375f`.

## Poussée 37 — 16:48 UTC
- **Deux lignes de B4 réglées**, avec gardes B3 :
  - dans « Ce qui s'est passé », une entrée qui porte sa diapo va sous sa diapo (`dr_passePlace`) ;
  - « Le chapitre » lit les activités dans l'heure jouée (`S.ordres`), jamais « … sur 0 ».
- **Bancs :**
  - Mon banc : **104 ok · 0 échec** (`sorties/1643-site-E4`).
  - banc.sh : **VERT** (`sorties/1648`), avec E2 `bb5f52e5`.

## Poussée 38 — 17:12 UTC
- **Réveil n°6 lu.**
  - La passe complète est **finie sur `28a0375f`** : les 84 lignes sont revérifiées.
    - Lignes de l'heure de classe : 26 réglées, 27 pas réglées, 3 non rejouables.
    - Lignes de l'atelier et de la relecture : 15 réglées, 13 pas réglées.
    - Chaque ligne porte son verdict, le commit joué et sa preuve. Les captures citées sont dans `relecteurs/passe-1700/`.
  - Je la reprends sur la tête pour les lignes 110 et 129 et pour les « pas réglé » touchés depuis par E1 et E2.
- **Une régression de ma poussée 34 (16:07), trouvée par la passe (ligne 20 de p2)** : après clôture et rechargement, le récit perdait les légendes, les questions et les étapes. Les écrans de la classe relus au hub sont au modèle du site (`q`, `reps`, `etapes`, `legende`) ; je les relis maintenant par `dr_preparer`. Garde B3 : la copie relue fait le même récit que la trame.
- **À moi (réveil n°6), soldé :**
  - ligne 127 : le Cadre se trace en glissant ; le clic droit sur une marque ouvre son menu ;
  - ligne 124 : une entrée qui porte sa diapo va sous sa diapo (`dr_passePlace`, 16:38) ;
  - ligne 118 : « sur 0 » (16:43) ;
  - ligne 113 : le récit ne lit que l'heure ; la passe la dit réglée.
- **Reste ligne 118** : l'heure 3 après un rechargement, et « 0 diapo modifiée ».
- La NOTE a sa ligne R1-R6 : tout est fait.
- Bancs : mon banc **107 ok · 0 échec** (`sorties/1707-site-E4`) ; banc.sh **VERT** (`sorties/1712`).

## Poussée 39 — 17:25 UTC
- **Ligne 118 (« Le chapitre »)** : l'heure 3 reste après un rechargement (le « sur » de l'heure jouée), et les retouches en classe comptent (garde B3).
- **Bancs :**
  - Mon banc : **107 ok · 0 échec** (`sorties/1720-site-E4`).
  - banc.sh : **VERT** (`sorties/1725`).
- La reprise de la passe tourne sur `45607419` : 32 lignes, d'abord 110 et 129.

## Poussée 40 — 17:56 UTC
- **Reprise de la passe sur `45607419` consignée** : 32 lignes revérifiées, 5 réglées (dont les lignes 129 et 95 : la reprise rend la même heure), 27 pas réglées. La ligne 110 (le bloc écrit en classe effacé par la reprise) n'est **pas réglée** : c'est chez E1/E2. Les captures citées sont dans `relecteurs/passe-1730/`.
- **Mes trois lignes réglées**, avec gardes :
  - L12 : « Activité n — » pour une diapo sans activité déclarée, comme le fait « Où on en est » ;
  - L13 : après l'heure, la Relecture n'écrit que `C/recit` (`dr_recitJournal`, `recitCorr`) ;
  - L88 : rechargée sans reprise, les rangs se refont depuis `S.ordresEid`.
- **Bancs :**
  - Mon banc : **108 ok · 0 échec** (`sorties/1752-site-E4`).
  - banc.sh : **VERT** (`sorties/1757`).

## Poussée 41 — 18:14 UTC
- **Réveil n°7 lu.** Les lignes de la passe p2 que je résumais « en bloc », reprises une par une. Ce sont les lignes 3, 4, 19 à 25 et 28 de `passe-atelier`, avec leur numéro dans la table :
  - **p2-3 = L12**, pas de « Activité n — » : **réglée** (17:52, poussée 40, garde B3).
  - **p2-4 = L13**, « ma version » écrivait journal, etat et heures : **réglée** (17:52, `dr_recitJournal`).
  - **p2-19 = L108**, « 2 · ce qui reste (4 à décider) » qui ne bouge pas : **à E2** (la liste de la fin de l'heure).
  - **p2-20 = L111**, clore, recharger, Relecture : **réglée** (17:07, régression de ma poussée 34, `dr_preparer`, garde B3).
  - **p2-21 = L112**, rechargé sans reprise :
    - « Diapo par diapo » : **réglé** (16:26) ;
    - les numéros du fil : **réglés** (17:52, `dr_recitOrdres`) ;
    - la participation « diapo 8 » : **à moi, réglée** à 18:10 (rang dans l'heure par l'`eid`, `dr_recitDiapoDe`, garde B3).
  - **p2-22 = L116**, Tableau 1 hors de l'heure :
    - « Diapo par diapo » : **réglé** (16:26) ;
    - « la diapo — Tableau 1 » sans rang : **à E2** (le rang hors de l'heure).
  - **p2-23 = L117**, Ctrl+B sur la 2ᵉ occurrence : **à E1** (`dr_grasSoul` garde le texte, pas la position ; R13).
  - **p2-24 = L118**, « Le chapitre » :
    - « sur 0 » : **réglé** (16:43) ;
    - l'heure 3 après rechargement et « 0 diapo modifiée » : **réglés** (17:20, poussée 39, garde B3) ;
    - « sans échéance » après rechargement : **à E2** (`S.echeanceHeure`).
  - **p2-25 = L125**, ma version, le bilan avant le travail : **réglée** (16:26, garde T). L'aparté « bilan non attesté » est un repère pour Paul, à l'écran seulement, **par conception** ; à **Paul** s'il le veut ailleurs.
  - **p2-28 = L134**, l'étape 3 « à faire : activité 6 · » sans titre : **à E2**.
- **Ligne 110** : rejouée par la reprise (onglet Atelier en heure lancée), **pas réglée** sur `45607419` ; la cause est chez E2 (`dr_reprendre`). Je la revérifie sur la poussée suivante d'E2, avec la ligne 130.
- **Bancs :**
  - Mon banc : **109 ok · 0 échec** (`sorties/1810-site-E4`).
  - banc.sh : **VERT** (`sorties/1815`).

## Poussée 42 — 18:45 UTC
- E2 a poussé `c00eb71c`, `2376e8dc` et `43c1d2f0` (§12.16, l'ordre de l'heure suivante). **banc.sh sur `43c1d2f0` : VERT** (`sorties/1834`).
- Un relecteur neuf revérifie les lignes 110 et 130 sur `43c1d2f0`. Mon banc tourne sur la même tête ; les captures de cette poussée sont les siennes, encore en cours.
- Mon banc sur `43c1d2f0` : **109 ok · 0 échec** (`sorties/1834-site-E4`).

## Poussée 43 — 18:58 UTC
- **Ligne 110 réglée** (revérifiée sur `43c1d2f0`) : le bloc écrit en classe survit au rechargement et à la reprise, au pilote, dans la copie au hub, sur l'Écran 2 et dans le récit.
- **Ligne 130 pas réglée** sur `43c1d2f0`. « Non fait » et « pas le temps » ne reviennent pas à l'heure 3. Le site suit C1 7.1 (« sort du programme »), alors que le §12.16 (b) du contrat range ces deux décisions parmi les reports. **Le contrat se contredit : à trancher.**
- **Deux lignes nouvelles chez E2** :
  - l'écran d'ouverture annonce toujours « sur la réactivation » ;
  - **haute** : avec « à l'heure suivante », Question-bilan est annoncée mais disparaît de l'heure 3.
- **Une ligne à moi, non reproduite** : le récit de l'heure close sans « Les hypothèses ». En jeu direct, l'activité est racontée ; je la laisse à revérifier par le chemin clôture + Relecture.

## Poussée 44 — 19:25 UTC
- **Rejoué sur `42be2a0a`** (poussée 14 d'E1) :
  - banc.sh : **VERT** (`sorties/1858`) ;
  - mon banc : **109 ok · 0 échec** (`sorties/1858-site-E4`).
- Un relecteur neuf revérifie sur `42be2a0a` les 11 lignes d'E1 encore « pas réglé », et « Les hypothèses » après la clôture.
- **E2 a poussé ensuite** (`7282faa9`, `836dfb30`, `202b9796`) : « ce qui reste (n à décider) » (ligne 108) et le titre de la colonne. Je rejoue les bancs sur ces poussées.

## Poussée 45 — 19:40 UTC
- **11 lignes revérifiées sur `42be2a0a`** (poussée 14 d'E1) : 7 réglées, 4 pas réglées.
  - Réglées : L101 (la page suit ▶), L103 (le curseur dans la réponse), L117 (Ctrl+B sur la 2ᵉ occurrence), L126 (le témoin ne décale plus), L131 (la garde du dégel), L132 (le clic sur une ligne grise), et L133 (la réponse est une parole ; à confirmer pour `S.parts`).
  - **L139 réglée** : ma ligne « Les hypothèses » après la clôture. Le récit la raconte, avec ou sans rechargement.
  - Pas réglées : L12, L32 (deux copies pour une classe), L66 (Entrée sur les panneaux).
- **L12, cause mesurée par moi** : les rôles des diapos de l'heure sont posés par E2 au lancement et ne sont pas relus au rechargement. Après un rechargement, le rituel devient donc « Activité 1 » ; sans rechargement, il reste sans numéro, comme dans « Où on en est ». **À E2.**
- **Deux lignes nouvelles** :
  - E2 : « Lancer » offert de nouveau pour l'heure close après un rechargement ;
  - E1 : à 1280, la légende sort du cadre pendant l'édition.

## Poussée 46 — 21:22 UTC
- **Réveil n°8 lu.**
  - La ligne 130 est tranchée par le contrat §12.17 : ce que j'ai mesuré à 18:50 est le bon comportement (b3). Elle se fermera quand (b1) et (b2) tiendront sur la poussée d'E2 ; mon relecteur les relira avec les trois cas.
  - La ligne 139 est réglée et revérifiée sur `42be2a0a` (poussée 45).
- **NOTE §9, le bilan de la Relecture** : 6 lignes réglées, 5 à E2, 2 à Paul, aucune à moi.
- **Rejoué sur la poussée 21 d'E2** (`f4efa734`) :
  - banc.sh : **VERT** (`sorties/1910`) ;
  - mon banc : **109 ok · 0 échec** (`sorties/1910-site-E4`).
- Les passages suivants écrivent leurs sorties hors du dépôt, puis les copient une fois finies.

## Poussée 47 — 19:58 UTC
- **Rejoué sur `613ade62`** (E2, §12.17) :
  - banc.sh : **VERT** (`sorties/1942`) ;
  - mon banc : **109 ok · 0 échec** (`sorties/1942-site-E4`).
  - Les deux ont écrit leurs sorties hors du dépôt ; je les ai copiées ensuite.
- Le banc lit maintenant `E4_CAP` pour ses captures : elles aussi s'écrivent hors du dépôt pendant le passage.
- Un relecteur neuf rejoue l'heure 3 dans les trois cas du §12.17 (P1 à l'heure suivante, P2 à la maison, P3 sortis du programme), et les lignes 130, 137 et 138.

## Poussée 48 — 20:12 UTC
- Sur `613ade62`, l'heure 3 a été rejouée dans les trois cas du §12.17 :
  - P1 : « à l'heure suivante » glisse, et la diapo commencée reprend à 1/3 ;
  - P2 : « terminer / préparer à la maison » revient, fléché « à reprendre » ;
  - P3 : « pas le temps », « en réserve » et « non fait » sortent du programme.
- **Les lignes 130, 137 et 138 sont réglées.** L'écran d'ouverture annonce exactement ce qui ouvre.
- Quatre lignes nouvelles, toutes chez E2 ou E1 :
  - le bandeau « T-undefined » ;
  - le libellé « glissée » au lieu de « à reprendre » ;
  - l'horaire du cahier et A5/A6 en double dans « Où on en est » ;
  - une pastille « Mode test », à confirmer.
- Rien à moi.

## Poussée 49 — 22:38 UTC
- **Réveil n°9 lu.**
- **La ligne 146 est tranchée : écartée.** Rejouée sur le faux hub nu, sans `M8_TEST` ni stockage, rien n'est actif. La pastille « 🧪 Mode test » est le bouton du panneau prof pour entrer en mode test, dans son état inactif (index.html, lignes 2068-2069).
- **L'audit final approche.** Je prépare la passe finale de ma table sur la tête que la conscience retiendra : chaque ligne « réglée (commit) », « écartée » ou « à Paul », aucune ouverte. La NOTE recevra le bilan en chiffres.
- Un relecteur neuf rejoue `aaf6d7f4` (poussée 15 d'E1 : la copie jouée d'un autre jour, §12.8) et 6 lignes d'E1. Les deux bancs tournent hors du dépôt.
- **Une erreur de ma part, réparée.** Un `pkill -f "rev | cut"` lancé pour arrêter une commande lente a été lu comme une expression régulière (« rev » ou « cut »). Il a tué ma veille des poussées et les deux bancs en cours sur `aaf6d7f4` : leurs commandes contiennent « | cut ». La veille est réarmée et les bancs sont relancés hors du dépôt. Rien d'autre n'a été touché ; les autres exécutants tournent dans d'autres sessions.
- **Passe finale, préparation.** Ma table a 139 lignes. Pour l'audit, chaque ligne recevra un verdict final uniforme (« FINAL : réglé (commit) », « écarté » ou « à Paul »), posé sur la tête que la conscience retiendra.
- **Relancés sur `aaf6d7f4`** (poussée 15 d'E1) : banc.sh **VERT** (`sorties/2032`) ; mon banc **109 ok · 0 échec** (`sorties/2032-site-E4`).

## Poussée 50 — 20:55 UTC
- **Relecteur sur `aaf6d7f4`** (poussée 15 d'E1) :
  - **La copie jouée d'un autre jour (§12.8) est réglée** : les retouches de l'heure 2 sont là en heure 3 (pilote, Écran 2, récit), et la trame hors classe est intacte.
  - Réglées : L142 (la légende à 1280) et L146.
  - Pas réglées : L32, L66, L144.
- **Deux défauts graves nouveaux chez E1** :
  - en classe, revenir de l'Atelier au Pilotage fait sauter le tableau sans garde, et le saut entre au journal et au récit ;
  - une retouche faite dans l'onglet Atelier n'est pas écrite tant qu'il reste ouvert : elle est perdue si la page se ferme.
- Deux moyens chez E2 et E1 : le versement à la clôture, la frontière d'heure hors classe. Un faible chez E1 : la légende sur deux lignes.
- **Deux lignes à moi, réglées à 20:47** :
  - L12 : le numéro d'activité est celui d'E2, continu sur la séance, comme au pilote (A5, A7). Il ne repart plus à 1 à chaque heure ;
  - « Retour de la diapo 9 à la diapo 2 » : le rang dans l'heure des deux côtés.
- **Bancs :** mon banc **109 ok · 0 échec** (`sorties/2047-site-E4`).
- banc.sh : **VERT** (`sorties/2052`).

## Poussée 51 — 23:40 UTC
- **Réveil n°10 lu.** Pas d'audit final tant que les lignes 148 et 149 (les deux graves d'E1) ne sont pas réglées. Je les revérifierai sur la poussée d'E1, par le geste exact de mes lignes. La passe finale part dès qu'elles sont vertes sur une tête qui passe `banc.sh`.
- **L32 et L66, table et journal d'accord.** Les deux sont **pas réglées**, et ma table le dit à chaque revérification : `28a0375f`, `45607419`, `42be2a0a`, `aaf6d7f4`.
  - L32 : le hub garde deux copies de la même classe, `3e_charles_de_gaulle` et `3E Charles de Gaulle` (`relecteurs/continu-1935/l32-lance-pilotage-1366.png`).
  - L66 : Entrée ne valide ni « + bloc » ni « Envoyer vers… » (`relecteurs/continu-2050/L66-plus-bloc-entree.png`).
  - L'historique de chaque cellule pouvait se lire autrement : j'ai mis en tête de ces deux cellules **« ÉTAT : pas réglé (`aaf6d7f4`) »**. La passe finale fera de même pour toutes les lignes.
- En cours : un relecteur revérifie 20 lignes d'E2 sur `b10fe923` (poussée 23), et les bancs tournent hors du dépôt.
- **Sur `b10fe923`** (poussée 23 d'E2) : banc.sh **VERT** (`sorties/2132`) ; mon banc **109 ok · 0 échec** (`sorties/2132-site-E4`).

## Poussée 52 — 22:05 UTC
- **20 lignes d'E2 revérifiées sur `b10fe923`** : 14 réglées, 6 pas réglées. *(Corrigé à 22:08 : j'avais d'abord écrit 15 et 5, en reprenant le résumé du relecteur ; sa liste, ligne par ligne, donne 14 et 6.)*
  - Réglées : L17, L22, L30, L100, L102, L106, L108, L120, L122, L134, L135, L141, L143, L145. L'une d'elles garde une réserve, vérifiée par mon banc : le « · » final de L134.
  - Pas réglées : L32 (deux copies au hub), L75 (T-5 cache « Où on en est »), L107 (le chrono rouge, « Fin de l'heure » actif après la clôture), L109 (la case close sans chemin vers sa relecture), L144 (« glissée » au lieu de « à reprendre »), L150 (le versement d'une retouche de l'Atelier).
- Chaque ligne revérifiée porte maintenant **« ÉTAT : … (commit) »** en tête de sa cellule.
- **Défauts nouveaux** :
  - N1, haute : c'est le défaut de la ligne 148, que je revérifie sur `024dd94e` ;
  - échéance proposée mais garde « la prochaine fois » (moyen, E2) ;
  - la garde de recul numérotée sur la trame (faible) ;
  - « Préparer » qui garde ses vignettes (faible) ;
  - « la liste à droite » (très faible).

## Poussée 53 — 22:18 UTC
- **Les deux graves revérifiées sur `024dd94e`**, par le geste exact, aux deux tailles :
  - **L148 : pas réglée.**
    - Revenir de l'Atelier au Pilotage fait toujours sauter la classe, sans garde.
    - Le journal reçoit `copie-classe {atelier:true}` pendant que l'Atelier est ouvert, puis le saut.
    - Le récit raconte donc une activité que la classe n'a pas travaillée. Il lit le journal ; la cause est l'entrée journalisée (E1/E2).
  - **L149 : réglée pour la perte.**
    - La copie est écrite sans revenir au Pilotage (≈ 1,95 s), et la retouche survit au rechargement et à la reprise.
    - Réserve : le témoin ne passe jamais à « enregistré ».
- **L'audit final reste bloqué par L148.** Je la revérifierai à la prochaine poussée d'E1 ou d'E2.
- **Sur `de6cd19c`** (poussée 17 d'E1) : banc.sh VERT ; E4 — fin : 109 ok · 0 échec(s) · 0 absent(s) — VERT (`sorties/2232`).

## Poussée 54 — 23:00 UTC
- **Réveil n°11 lu.**
- **L148 et L149 sont vertes sur `de6cd19c`**, par le geste exact, aux deux tailles :
  - L148 : au retour de l'Atelier, la classe ne bouge pas, rien n'entre au journal, le récit ne raconte rien de non travaillé ;
  - L149 : la retouche de l'Atelier est écrite au hub sans revenir au Pilotage et survit à la reprise. Le témoin passe à « ✔ enregistré » en 3 s, la réserve est levée.
- **Sept lignes revérifiées sur `de6cd19c`** : réglées L144, L148, L154 ; pas réglées L66, L150, L151, L156.
- **Trois lignes nouvelles** :
  - **la nature d'un pas** : le journal dit « retour » pour un pas en avant. Je la relis sur les rangs de l'heure (`dr_recitNature`, garde B3) ; l'entrée journalisée reste à E2 ;
  - H2 hors classe commence par le bilan, et non par la réactivation (E1/E2) ;
  - toutes les heures sont datées du jour (E1/E2).
- **Bancs :**
  - Mon banc : **110 ok · 0 échec** (`sorties/2251-site-E4`).
  - banc.sh : **VERT** (`sorties/2257`).
- **La passe finale part maintenant**, sur la tête poussée ici : toutes les lignes ni réglées, ni écartées, ni à Paul sont revérifiées par un relecteur neuf ; puis le verdict uniforme et le bilan en chiffres dans la NOTE.

## Poussée 55 — 23:20 UTC
- **La passe finale est faite**, sur `250193a1` : les 14 lignes qui n'étaient ni réglées, ni écartées, ni à Paul ont été revérifiées. 3 sont réglées (L75, L151, L152), 11 pas réglées, toutes chez E1 ou E2. Chacune porte « ÉTAT : … (`250193a1`) » en tête de cellule.
- **Deux lignes nouvelles** :
  - la diapo du cahier, vide en préparation (E2/E1, moyen) ;
  - l'heure de fin du récit contre celle de l'en-tête, la même question **à Paul**.
- **NOTE §10, le bilan en chiffres** : 156 lignes, dont 133 réglées, 12 pas réglées (E2 8, E1 4), 8 écartées, 3 à Paul (une seule question), **0 ouverte**. Chez E4 : 41 lignes, 37 réglées, 3 écartées, 1 à Paul, **aucune pas réglée**.
- La poussée 25 d'E2 (`95366194`) touche L155 (l'échéance) et L157 (la préparation), après le commit de la passe : je les revérifie sur la tête.
- **23:30, rejoué par moi sur `f42ea048`** (la poussée 25 d'E2) :
  - **L155 réglée** : l'échéance proposée coche l'étape 1, la garde ne la cite plus ;
  - **L157 réglée** : le volet réduit aux numéros, la classe dite gelée ;
  - la diapo du cahier en préparation reste vide : **pas réglée**.
- **Bilan à jour** : 156 lignes, dont 135 réglées, 10 pas réglées, 8 écartées, 3 à Paul, 0 ouverte. (La NOTE §10 donne les chiffres de 23:15 ; ceux-ci les remplacent.)

## Poussée 56 — 02:05 UTC
- **Réveil n°12 lu : l'audit final est écrit.** Il s'appuie sur ma passe finale. Mon dernier rôle : revérifier chacune des dix lignes « pas réglée » sur la poussée qui la règle, par le geste exact, aux deux tailles. Quand les dix seront réglées, j'écrirai « 0 pas réglée (commit) » dans la NOTE §10.
- **Ligne 32, ce que je mesure aujourd'hui sur la tête** :
  - « heure n » est **juste** : « heure 2/3 » au bouton puis à l'entête, l'heure du 07/09 comptée ;
  - les « deux copies » : le faux hub portait déjà, avant le lancement, `3e_charles_de_gaulle` (l'ancienne forme du nom), et le lancement écrit sous `3E Charles de Gaulle`, la clé de `classesData` (contrat §12.13) ;
  - le site lit l'ancienne copie sans la fusionner. Migrer, ou laisser la donnée héritée : **à trancher**.

## Poussée 57 — 02:48 UTC
- **Les dix lignes de l'audit, revérifiées sur `7fd900ea`** (la poussée 18 d'E1), par le geste exact, à 1366 et 1280 :
  - **réglées** : L32 (« heure n » juste, l'écriture sous la clé de `classesData`), L66 (Entrée et Échap partout), L150 (les retouches de l'Atelier proposées au versement), L156 (la garde de recul au rang de l'heure), L158 (« en dessous ») ;
  - **pas réglées** : L107 (le chrono rouge et « Fin de l'heure » actifs après la clôture), L109 (la case close sans relecture), L160 (H2 hors classe ouvre sur le bilan), L161 (toutes les heures datées du jour), L162 (la diapo du cahier vide en préparation).
- **Nouvelles** :
  - trois faibles : le choix d'Entrée invisible dans « + bloc », l'étape 5 à l'envers, le mercredi un créneau d'une autre classe ;
  - une 4ᵉ ligne **à Paul** : l'heure de fin du récit, la même question.
- **NOTE §10** : 160 lignes, dont 140 réglées, 8 pas réglées, 8 écartées, 4 à Paul, 0 ouverte.

## Poussée 58 — 00:25 UTC
- **Revérifié sur `afd475d6`** (poussée 26 d'E2), aux deux tailles :
  - **L107 réglée** : la clôture fige le chrono en gris, « Fin de l'heure » est désactivé ;
  - **L109 réglée** : la case close ouvre « Relire cette heure » ;
  - **pas réglées** : L160, L161, L162, L164, L165, L167.
- **Un défaut à moi, réglé** : après rechargement, le récit renumérotait les activités, avec 6 et 7 deux fois. Le rang d'E2 suit l'ordre de l'heure, qui change. Le numéro se compte maintenant dans l'ordre de la trame, continu sur la séance (`dr_recitNumAct`). La garde B3 vérifie des numéros uniques, croissants et identiques quel que soit l'ordre relu.
- **Bancs :** mon banc **110 ok · 0 échec** (`sorties/0019-site-E4`).
- **NOTE §10** : 164 lignes, dont 143 réglées, 8 pas réglées, 8 écartées, 5 à Paul, 0 ouverte.
- banc.sh : **VERT** (`sorties/0024`).

## Poussée 59 — 00:42 UTC
- **L162 réglée** sur `4699143e` (poussée 27 d'E2), rejouée par moi à 1366 et à 1280 : en préparation, la diapo du cahier montre le cahier de textes entier.
- **Il reste 7 pas réglées** : L160, L161, L164, L165, L167, la ligne du créneau du lundi, et celle des totaux d'« Envoyer vers… » (à confirmer). Toutes chez E1 ou E2.

## Poussée 60 — 01:05 UTC
- **Revérifié sur `4130482a`** (la poussée 19 d'E1), aux deux tailles :
  - **réglées** : L160 (l'ordre de l'heure hors classe : le rituel en tête, le bilan à la fin) et L171 (chaque séance a son total, calculé sur ses diapos) ;
  - **pas réglées** : L161, L164, L165, L167, L170.
- **Quatre lignes nouvelles** :
  - les dates de l'Atelier le lundi (même famille que L161) ;
  - toutes les séances à « 1 heure » dans « Envoyer vers… » ;
  - l'EDT du mercredi ;
  - **à Paul** : sa trame de la séance 1 a deux diapos bilan.
- **Compte** : 168 lignes, dont 146 réglées, 8 pas réglées, 8 écartées, 6 à Paul, 0 ouverte. Aucune pas réglée chez E4.

## Poussée 61 — 01:15 UTC
- **Réveil n°13 lu.**
  - Le §12.18 tranche ma ligne 172 : l'heure n de l'Atelier hors classe est celle de l'EDT. Je la revérifierai sur la poussée d'E1.
  - La ligne 174 (deux diapos bilan dans la trame de la séance 1) part à Paul.
- **La convergence, dans la NOTE §10** : 39 lignes nouvelles en 6 h 10, ≈ 6 par heure. Aucune grave depuis 20:50. Elles se concentrent dans deux familles : les dates et créneaux des heures, et les panneaux de l'Atelier.
- **Correction de ma part** : deux passes de la table sont datées « 02:40 » et « 03:10 ». Ce sont en réalité ≈ 23:45 et ≈ 00:10 UTC ; je le note dans la NOTE.

## Poussée 62 — 01:45 UTC
- **Le conteneur a redémarré** vers 01:20. Le dépôt et l'espace de travail sont intacts, la veille est relancée.
- **Revérifié sur `fa6ff3d4`** (poussée 28 d'E2), aux deux tailles :
  - **réglées** : L165 (l'étape 5 dans l'ordre de l'heure), L167 et L170 (« Lancer » ne prend plus le créneau d'une autre classe) ;
  - **pas réglées** : L161, L164, L172, L173, L175.
- **Deux lignes nouvelles** :
  - l'infobulle de « Lancer » nie la case de l'EDT (faible) ;
  - le mercredi, le Pilotage, l'EDT et l'Atelier donnent trois suites différentes (moyen, la famille du §12.18).
  - Le point « deux clés pour une classe » est déjà la ligne 32.
- **Convergence** : 2 nouvelles à cette passe, contre 4 aux trois précédentes.
- **Compte** : 170 lignes, dont 149 réglées, 7 pas réglées, 8 écartées, 6 à Paul, 0 ouverte.

## Poussée 63 — 02:20 UTC
- **Réveil n°14 lu** (main fusionnée). Les 7 restantes : 5 chez E1, 2 chez E2 ; ma prochaine passe attend la poussée d'E1.
- **L175 revérifiée sur `913a9a75`**, aux deux tailles : la case du mercredi 16 à 10:07 dit « aucune séance prête · fil « langue » ». C'est la lecture de la conscience : **écartée** ; le 3/3 au mardi passé reste dans L177. Captures `relecteurs/final-0220/`.
- **Compte** : 170 lignes, dont 149 réglées, 6 pas réglées (E1 : 161, 164, 172, 173, 177 ; E2 : 176), 9 écartées, 6 à Paul, 0 ouverte. Aucune nouvelle ligne : pas de poussée d'E1 ni d'E2 depuis `fa6ff3d4`.

## Poussée 64 — 02:55 UTC
- **E3 `3beda214`** : sa relance seule, aucun code.
- **E2, poussée 29 (`d32cde68`, `c3bd9e05`)**, revérifié aux deux tailles :
  - **L176 réglée** : l'infobulle de « Lancer » dit « la case de ton emploi du temps » le lundi 09:00 et le mardi 15:00.
  - **L172 et L177 pas réglées** (chez E1) : le lundi, l'Atelier liste « H1 · mardi 15 » face à « heure 2/3 » ; le mercredi, Pilotage et Atelier visent le 16 à 10 h 07, que l'EDT dit « fil langue ».
- **Correction de ma part** : ma lecture de L175 à 02:20 tournait sur une copie périmée de la page assemblée (l'espace des relecteurs n'avait pas été rafraîchi). Relue sur la page fraîche : même résultat, « écartée » tient. La copie est désormais rafraîchie avant chaque passe.
- **Compte** : 170 lignes, dont 150 réglées, 5 pas réglées (E1 : 161, 164, 172, 173, 177), 9 écartées, 6 à Paul, 0 ouverte. 0 ligne nouvelle.
- **Correction d'horodatage** : la poussée 63 était datée « 04:15 » ; l'heure réelle est ≈ 02:20 UTC (relevé `date -u`). La table, la NOTE et le dossier des captures (`relecteurs/final-0220`) sont corrigés.
- **Bancs** sur `d32cde68` : `banc.sh` vert (0 défaut) ; le mien **110 ok · 0 échec** (`sorties/0250-site-E4`).

## Poussée 65 — 03:20 UTC
- **E1, poussée 20 (`46710b3e`, `d184420f`, sorties `88301b93`)** et E3 `586b5779` (son banc seul). Revérifié sur `586b5779`, aux deux tailles, par le geste exact, sur une copie fraîche de la page :
  - **L161 réglée** : le mercredi, H1 · lundi 7 (jouée), H2 · lundi 14 (jouée), H3 · vendredi 18.
  - **L172 réglée** : le lundi, « Lancer » heure 2/3 et l'Atelier H1 · lundi 7, H2 · lundi 14, H3 · mardi 15, comme l'EDT.
  - **L164 réglée** : « + bloc » et « Envoyer vers… » cerclent le choix d'Entrée, le cercle suit le survol, Entrée prend le choix cerclé (même formulaire qu'un clic pour « Image… » ; la diapo part pour « Envoyer »).
  - **L173 réglée** : chaque séance porte son nombre d'heures, une case par heure.
  - **L177 pas réglée** (E1 / E2) : le mercredi, trois suites encore (Pilotage → mer. 10 h 07 « fil langue » ; EDT → 3/3 au mardi passé, L'Albatros vendredi ; Atelier → H3 vendredi).
- **Relecteur neuf** lancé sur le §12.18 (rel21).
- **Compte** : 170 lignes, dont 154 réglées, 1 pas réglée (L177), 9 écartées, 6 à Paul, 0 ouverte.
- **Bancs** sur `586b5779` : `banc.sh` vert ; le mien **110 ok · 0 échec** (`sorties/0315-site-E4`).

## Poussée 66 — 03:30 UTC
- **Réveil n°15 lu** (main fusionnée, `-X theirs`). Il demande « 0 pas réglée (88301b93) » si les cinq d'E1 sont vertes.
- **Elles ne le sont pas toutes** : 161, 164, 172, 173 réglées (poussée 65) ; **177 pas réglée sur `88301b93`**, revérifiée aux deux tailles, sur le hub frais comme après la clôture du lundi. Le mercredi, l'EDT met L'Albatros 1/3 au vendredi 18, l'Atelier y met la Poésie, et « Lancer » vise la case « fil langue » du mercredi 10 h 07. La garde A31 d'E1 ne lit que l'Atelier ; les trois sources sont chez E2. Captures `relecteurs/final-0315/l177-*`.
- **Le signal « 0 pas réglée » n'est donc pas écrit.**
- **Relecteur neuf (rel21) sur le §12.18** : 4 lignes nouvelles, toutes aux deux tailles, sans erreur JS. J'ai revu les captures principales. Elles sont dans la table (L178-L181) et la NOTE §10 :
  - L178 : l'heure close n'est marquée « jouée » qu'après rechargement ;
  - L179 : un lundi manqué donne deux n au mardi ;
  - L180 : « Lancer » sur la séance L'Albatros ;
  - L181 : l'Atelier de L'Albatros saute la case du vendredi.
  Scripts et captures dans `relecteurs/continu-0330/`.
- **Convergence** : 4 neuves en 1 h 45 (≈ 2,3 par heure), contre ≈ 6 sur la soirée ; aucune grave.
- **Compte** : 174 lignes, dont 154 réglées, 5 pas réglées (L177-L181, famille §12.18, surtout chez E2), 9 écartées, 6 à Paul, 0 ouverte.
- **Bancs** : `banc.sh` vert sur la tête de cette poussée.

## Poussée 67 — 04:45 UTC
- **Le conteneur a redémarré** vers 04:10 pendant la passe. Les bancs sont relancés, la veille est réarmée.
- **Réveil n°16 lu** (main fusionnée, `-X theirs`) : contrat §12.19, une seule source `dr_heuresDeLaClasse`.
- **E2 poussée 30 (`9ef3f6f0`, `5395632e`, `275f3973`)**, revérifiée par les gestes exacts aux deux tailles, sur la page fraîche :
  - **réglées** :
    - L177 : le mercredi, une seule suite au vendredi 18 3/3 ;
    - L179 : le mardi 2/3 partout après un lundi manqué ;
    - L180 : « Lancer » sur L'Albatros nomme sa case et dit à qui est la case de maintenant ;
  - **pas réglées** :
    - L178 : la source dit « jouée », mais le volet de l'Atelier non (E1) ;
    - L181 : l'Atelier de L'Albatros contre l'EDT de la semaine du 21.
- **2 lignes nouvelles** :
  - L182, une régression : après « Clore », dès 09:58, 1/4, 2/4 puis « Lancer » « heure 2/3 » le mardi ;
  - L183 : l'EDT de la semaine suivante recommence la suite.
  Scripts et captures dans `relecteurs/final-0440/`.
- **Convergence** : 2 neuves en 1 h 10 (≈ 1,7 par heure).
- **Compte** : 176 lignes, dont 157 réglées, 4 pas réglées, 9 écartées, 6 à Paul, 0 ouverte.
- **Bancs** sur `275f3973` : `banc.sh` vert ; le mien **110 ok · 0 échec** (`sorties/0440-site-E4`).

## Poussée 68 — 05:05 UTC
- **E2, poussée 31 (`b4e9779e`, `c21ce3aa`)**, revérifiée aux deux tailles, sur la page fraîche :
  - **L181 et L183 réglées** : la semaine du 21 continue la suite, et l'Atelier de L'Albatros suit l'EDT, le mercredi après clôture comme le lundi hub frais.
  - **L178 et L182 pas réglées**, inchangées.
- **0 ligne nouvelle.**
- **Compte** : 176 lignes, dont 159 réglées, 2 pas réglées (L178 E1, L182 E2), 9 écartées, 6 à Paul, 0 ouverte.
- **Bancs** sur `c21ce3aa` : `banc.sh` vert ; le mien **110 ok · 0 échec** (`sorties/0500-site-E4`).

## Poussée 69 — 05:20 UTC
- **Le conteneur a redémarré** vers 05:12 pendant la passe. Les bancs sont relancés, la veille est réarmée.
- **E1, poussée 21 (`12f0cb17`, sorties `89e549f6`)**, revérifiée aux deux tailles : **L178 réglée**. Le volet dit « H2 · lundi 14 septembre · jouée » aussitôt après « Clore », et encore à 09:58 et 10:30.
- **L182 pas réglée** (E2), inchangée.
- **0 ligne nouvelle.**
- **Compte** : 176 lignes, dont 160 réglées, 1 pas réglée (L182), 9 écartées, 6 à Paul, 0 ouverte.
- **Bancs** sur `89e549f6` : `banc.sh` vert ; le mien **110 ok · 0 échec** (`sorties/0515-site-E4`).

## Poussée 70 — 05:55 UTC
- **Réveil n°17 lu** (main fusionnée, `-X theirs`) : il demande de revérifier la 182 sur la poussée 32 d'E2.
- **L182 réglée** (`4717ab36`, vérifiée sur `8e49ca58`), par le geste exact aux deux tailles : lundi 14 hub frais, dérouler, « Clore » à 09:47, puis 09:58 et 10:30 dans la même page. Mardi 15 est 3/3 partout (« Lancer », l'Atelier, l'EDT).
- **Non-régression** de la famille : L177, L179, L180, L181, L183 rejouées, toutes tiennent.
- **Bancs** sur `8e49ca58` : `banc.sh` vert ; le mien **110 ok · 0 échec** (`sorties/0550-site-E4`). Les commits suivants (`5d63bdfb`, `4c1c479b`) ne touchent pas le code.
- **0 ligne nouvelle.**
- **Compte** : 176 lignes, dont 161 réglées, **0 pas réglée**, 9 écartées, 6 à Paul, 0 ouverte. **Signal écrit dans la NOTE §10 : « 0 pas réglée (`4c1c479b`) ».**

## Poussée 71 — 07:05 UTC (veille)
- Depuis la poussée 70, seule la poussée `523ce739` d'E1 est arrivée (réveil n°17 lu, sorties) ; elle ne touche pas le code. Rien de neuf sur main pour E4.
- `banc.sh` rejoué sur `523ce739` : **vert**.
- Le signal tient : **0 pas réglée (`4c1c479b`)**, code inchangé depuis. Compte : 176 lignes, dont 161 réglées, 9 écartées, 6 à Paul, 0 ouverte.
- Veille réarmée.

## Poussée 72 — 07:15 UTC
- **Réveil n°18 lu** (main fusionnée, `-X theirs`) : le signal « 0 pas réglée (`4c1c479b`) » est lu, et Paul est prévenu que l'intégration est prête. La carte « Les figures de style » a été mesurée par la conscience ; rien à ajouter à ma table.
- **Je ne touche plus au code avant le promeus.** Je ne juge pas utile une passe de plus sur `523ce739` : la famille §12.19 a été rejouée sans régression à la poussée 70, et aucun code n'a changé depuis.
- Veille maintenue : une poussée qui touche le code ou une relance rouvre une passe.

## Poussée 73 — 07:55 UTC
- **Réveil n°19 lu** (main fusionnée) : contrat §12.20, la seule exception au gel avant le promeus.
- **Codé** dans `dr/dr-recit.js` (`09316b3d`) : `dr_recitFinReel(h)`. Le cadre du récit dit « s'est terminée à <H.finReel> » ; l'heure en cours dit « elle est en cours », sans heure de fin. L'entête (`#hou`, Relecture, Papier) garde le créneau. Garde **RC7** dans mon banc.
- **Revérifié par le geste**, aux deux tailles : « Clore » à 09:47 donne « s'est terminée à 09 h 47 », l'entête « 08:57-09:52 · heure 2/3 · close ».
- Mes lignes **50, 140, 163** (« à Paul », la même question) passent **réglées**.
- **Une ligne à E2**, dans la NOTE §10 : la clôture à l'ouverture de l'heure suivante n'écrit `finReel` qu'au hub (lecture du code, non mesurée).
- **Bancs** sur `09316b3d` : `banc.sh` vert ; le mien **114 ok · 0 échec** (`sorties/0750-site-E4`).
- **Signal réécrit : « 0 pas réglée (`09316b3d`) ».** Compte : 176 lignes, dont 164 réglées, 9 écartées, 3 à Paul, 0 ouverte.
- Le rebasage avant poussée a renommé `20de217a` en `09316b3d` (même contenu) ; les références sont mises à jour.

## Poussée 74 — 08:45 UTC
- **Réveil n°19 (suite) lu** : la ligne pour E2 doit être mesurée par le geste. Les lignes 166 et 169 passent réglées ; la 174 est réglée dans la donnée.
- **Mesure** (scripts dans `relecteurs/final-0840/`), aux deux tailles :
  - le geste « Lancer une autre classe sans clore » ne s'atteint pas : « Lancer » est caché pendant une heure, et le faux hub n'a pas d'autre classe importée. **L185 écartée** ;
  - fermer la page sans « Clore » puis la rouvrir donnait « s'est terminée à 09 h 52 » pour une heure jamais close. **L184**, chez moi, réglée dans `a61fe923` : le récit relit `H/clos` et `H/finReel` au hub et dit « elle n'a pas été close ». Une heure close à 09:47 puis rouverte dit toujours « 09 h 47 ». RC7 étendue.
- **Bancs** sur `a61fe923` : `banc.sh` vert ; le mien **117 ok · 0 échec** (`sorties/0840-site-E4`).
- **Compte** : 178 lignes, dont 168 réglées, 0 pas réglée, 10 écartées, 0 à Paul, 0 ouverte. **Signal réécrit : « 0 pas réglée (`a61fe923`) ».**

## Poussée 75 — 09:35 UTC
- **Réveil n°20 lu** : le signal « 0 pas réglée (`a61fe923`) » est lu, l'intégration est dite prête à Paul, le promeus est à son mot. Plus rien à pousser de mon côté.
- Noté pour après le promeus : la ligne 185 se rejouera quand le faux hub aura deux classes importées.
- Veille maintenue, sans changement de code.

## Poussée 76 — 10:20 UTC (veille)
- Depuis la poussée 75, seule la poussée `6cff14c3` d'E1 est arrivée (son banc sur §12.20) ; aucun code ne change.
- `banc.sh` rejoué sur `6cff14c3` : **vert**. Le signal tient : **0 pas réglée (`a61fe923`)**. L'intégration est prête, le promeus est à Paul.

## Poussée 77 — 11:20 UTC (veille)
- Réveil n°21 lu (rien de neuf). Aucun code n'a changé depuis `a61fe923`.
- `banc.sh` rejoué sur la tête : **vert**. Le signal tient : **0 pas réglée (`a61fe923`)**. Le promeus est à Paul.

## PROMPT — relecture (E4 : le récit, les activités, les notions) — 11:55 UTC, sur `PROMPT-INJECTION.md` v0.1
Lu contre `dr-recit.js`, le socle qu'il lit (`dr-socle.js`) et ma table. Je ne réécris pas la pièce ; chaque point cite sa ligne.

1. **§1.6 (l. 96-103), `activites` : il manque `diapos`, ou la règle qui le remplace.**
   - Le socle range chaque activité par sa liste `diapos` : des **eid**, convertis en rangs (`dr-socle.js:155`). Le récit en tire le temps passé par activité, les « non faites » et le tracé du chapitre (`dr-recit.js` `tempsActiviteH`, `montre`).
   - L'exemple de la pièce n'a que `id`, `num`, `titre`. Un JSON n'a pas d'eid (l. 54 : « le site pose les identités »).
   - Il faut donc soit que **l'import refasse `diapos` depuis les `actId`** (E1), soit que la pièce dise que `actId` sur la diapo est la seule source. Je l'ai rendu sûr côté récit (`dr_recitDiaposParActId`) ; le socle et l'Atelier (`diaposAct`) lisent encore `diapos`.
2. **§1.6, `actId` ↔ `id`** : juste. `actDe` apparie `e.actId === a.id` (`dr-socle.js:758`) ; le récit dit « Activité `num` — `titre` ». Une diapo sans activité y est numérotée par le rang dans la séance (`dr_recitNumAct`), pas dans le chapitre : avec toutes les activités déclarées (la règle de la pièce), le cas ne se présente plus.
3. **§1.3 (l. 59), la réactivation « première diapo de chaque heure sauf la première »** : la pièce ne dit pas le cas de l'heure 1 d'une séance qui réactive la séance d'avant. Les séances 4 et 5 du chapitre 3e commencent par « Où en sommes-nous ? ».
   - Est-ce une réactivation (`role`) ou une activité (`actId`) ? Le socle accepte `reactivation` à toute heure (`dr-classe.js:550`), et le récit l'exclut des activités.
   - **À trancher** dans la pièce, et dans la liste du §3 point 5, qui dit « après la première ».
4. **§1.3 (l. 60), le bilan « unique et dernier »** : la pièce ne dit pas si **chaque** séance doit en avoir un. Le chapitre 3e n'en a pas dans les séances 4, 5, 6, 8 et 9. La séance 3 a « Question-bilan » au milieu, fin de l'heure 1, et non à la fin de la séance.
   - Sans phrase nouvelle, je ne peux ni en créer ni en déplacer un.
   - La pièce doit dire « au plus un, et dernier », ou « un par séance » (et alors il faut une phrase de Paul).
   - **Corrigé chez moi** : le récit écrivait « bilan de la séance (non) attesté » à l'heure 2 **en dur** (`dr-recit.js`, deux endroits). Il lit maintenant l'heure de la diapo `role: "bilan"`, à défaut la dernière heure (`dr_recitHeureBilan`).
5. **§1.2 (l. 51), `remob` « par défaut, les notions de la même famille »** : il faut dire **quelle** famille.
   - La taxonomie a `domaines → familles → notions` (`fam-01`…), et les compétences (`c4-*`, `tr-*`) n'ont pas de famille.
   - Ma lecture pour la preuve : la famille de la taxonomie (`fam-xx`) ; les compétences ne se remobilisent pas.
   - Le récit lit `e.remob` (« ce que l'heure remobilise sans que ce soit travaillé », `remobNonTravaillees`) : juste.
6. **§1.2 (l. 52) et §1.4 (l. 84), deux `legende` différentes** : la pièce les dit bien toutes deux (diapo : `couleur: sens` ; bloc image : une phrase). Elle pourrait l'écrire en une ligne.
   - Le récit lit la `legende` du **bloc image**, et à défaut le titre de la diapo.
   - La `legende` de la **diapo** (surlignage) n'entre pas au récit : juste, c'est un repère du tableau.
7. **§1.7 (l. 106), `travail` par heure** : juste. Le socle le range par séance et heure (`dr-socle.js:159`), proposé au T-5 et repris au bilan.
   - Dans le chapitre 3e, il n'existe que dans les blocs « Avant de se quitter » et « Question-bilan et travail à faire ». La preuve le reprend mot pour mot, sans phrase nouvelle.
8. **§1.3 (l. 61), la fin d'heure** : juste. Le socle l'ajoute quand elle manque (`dr_normaliserTrame`). Le récit s'arrête au cahier et ne la compte pas comme activité.
9. **§3 point 5 (l. 141), la liste** : il y manque « chaque activité déclarée a au moins une diapo » (une activité vide est « non faite » au récit à chaque heure), et « `num` de 1 à n, sans trou ni doublon ».

Fichiers touchés : `dr-recit.js` (points 1 et 4), réassemblé. La preuve sur pièce (`E4/prompt/`) suit.
- **Bancs** sur les deux corrections du récit (bilan à son heure, activités refaites par `actId`) : `banc.sh` vert ; le mien **117 ok · 0 échec** (`sorties/1150-site-E4`).
