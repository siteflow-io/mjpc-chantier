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
