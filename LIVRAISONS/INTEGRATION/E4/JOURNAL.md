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
