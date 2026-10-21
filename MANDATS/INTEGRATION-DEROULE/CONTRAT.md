# LE CONTRAT DES QUATRE — intégration du déroulé p8 dans `index.html`, en parallèle

*Conscience n°13, 21/10/2026, 08:35 → 10:30. Ordre de Paul (08:23) : « Le mandat entier doit être codé en parallèle par 4 exécutants Claude code, avec planification des vérifications de leur travail. Je veux être déchargé de la vérification moi-même et je veux que dans 24h j'ai mon déroulé intégré au site et tout fonctionnel. » Acquis le même jour : la proposition 96 (une seule barre Structure · Atelier · Pilotage · Relecture, Papier = face de la Relecture), p8-5h se fait dans le site (plus sur la page à part), la dette 13 · 25 se règle tout de suite (micro de la conscience, à part).*

*Ce contrat est la loi commune des quatre exécutants E1, E2, E3, E4. Chaque mandat (`MANDAT-E1…E4.md`) ne dit que ce qui est propre à son territoire ; tout le reste est ici. Le plan (`MANDATS/PLAN-INTEGRATION-DEROULE.md`) dit le pourquoi et le détail écran par écran et donnée par donnée : il se lit en entier avant de commencer.*

---

## 1 · CE QUE ÇA CHANGE POUR LA CLASSE

Aujourd'hui Paul a deux objets : le site, qui contient un déroulé ancien (l'ancien moteur dans un cadre), et la maquette p8-5g, le nouveau déroulé qu'il a joué et validé mais qui tourne seul, avec une fausse classe, une fausse heure, et n'enregistre rien. Au bout de ce mandat, **le nouveau déroulé est dans le site** : Paul ouvre son emploi du temps, clique la case de l'heure, « lancer », et c'est le nouveau déroulé qui s'ouvre avec sa vraie classe, sa vraie heure, sa vraie séance ; tout ce qu'il fait en classe est enregistré ; s'il rouvre le site en pleine heure, il retrouve tout ; le tableau projeté et l'appareil distant suivent ; la relecture, le papier du cahier et la copie pour École Directe sortent de ce qui s'est réellement passé.

## 2 · LES DEUX OBJETS DE DÉPART (md5 à vérifier avant tout)

| objet | où | md5 | taille |
|---|---|---|---|
| le site de production | `siteflow-io/monsieurjaipascompris` → `index.html` (8.74.0-③) | `ac792b28f40d3a0510e725fc4a6b6985` | 1 838 175 o |
| la maquette validée | sas, branche `deroule/p8-5g` → `LIVRAISONS/DEROULE/p8-5g/maquette-pilotage-ordi-v9c15p8-manipulable.html` | `62d9557ac8fe…` (vérifie contre `EMPREINTES.md5` de la livraison) | 605 996 o |

La chaîne `v9c15p8-template.html` + `patch-*.py` + `regen.sh` de la maquette **tombe** : on part du fichier généré, et le code entre dans le site. Plus aucune livraison sur la page à part.

## 3 · OÙ ON TRAVAILLE — une seule branche, des fichiers séparés

- **Branche du sas : `integration`** (créée depuis `main` par le premier qui pousse — l'audit de mission 0 arrive avant E1-a —, les autres s'y joignent ; `git pull --rebase` règle les croisements). Jamais `main`. Jamais la production.
- **Dossier : `LIVRAISONS/INTEGRATION/`** :
  - `index.html` — le site, modifié (copie de la production, md5 vérifié au départ).
  - `dr/` — les modules du déroulé pendant le chantier, un fichier par territoire : `dr.css`, `dr-gabarit.js` (le corps HTML de la maquette, chaîne `dr_gabarit`), `dr-socle.js` (E1), `dr-atelier.js` (E1), `dr-classe.js` (E2), `dr-tableau.js` (E3), `dr-recit.js` (E4). `index.html` les charge par `<link rel="stylesheet" href="dr/dr.css">` et `<script src="dr/…"></script>`, **dans cet ordre**, à l'endroit où vivait `AT_DR_B64`.
  - `assemble/index.html` — **le fichier assemblé**, un seul fichier, produit par `AUDITS/INTEGRATION-DEROULE/assembler.mjs` (chaque `<script src>`/`<link>` du dossier `dr/` remplacé par son contenu en ligne). **C'est lui que les bancs jouent et c'est lui que Paul promeut.** On ne l'édite jamais à la main.
  - `E1/`, `E2/`, `E3/`, `E4/` — par exécutant : `JOURNAL.md` (tenu à chaque poussée : fait · reste · bloqué), `bancs/`, `sorties/`, `captures/`, `NOTE.md` (à la fin).
- **Qui écrit où.** Chaque exécutant n'écrit que dans **son** module `dr/dr-<territoire>.js`, son dossier `E<n>/`, et les fonctions d'`index.html` que son mandat lui attribue nominativement. `dr.css` et `dr-gabarit.js` appartiennent à E1 ; les autres y ajoutent des règles ou des éléments **en fin de fichier, dans un bloc marqué `/* E<n> */`**. Une fonction appartient à un territoire (§6) : si elle se trouve dans un autre module après la livraison E1-a, son propriétaire la **déplace** dans son module (couper-coller, sans la changer dans le même commit).
- **Pousser.** `git pull --rebase origin integration` avant chaque poussée ; on pousse **chaque morceau dès qu'il est fait**, jamais moins d'une poussée par heure de travail, avec `JOURNAL.md` à jour. Un conflit se résout **en faveur du propriétaire du fichier ou de la fonction** ; un conflit qu'on ne sait pas résoudre s'écrit dans `JOURNAL.md` et on continue sur autre chose.
- **Les relances.** La conscience écrit dans `MANDATS/INTEGRATION-DEROULE/RELANCES/E<n>.md`. **À chaque poussée, tu relis ton fichier de relances et tu traites ce qui y est, en premier.** Tu ne t'arrêtes jamais : tant que ton mandat n'est pas fini ou qu'une relance est ouverte, tu travailles.

## 4 · L'ORDRE DANS LE TEMPS

| heure | E1 | E2 · E3 · E4 |
|---|---|---|
| H0 | **mission 0 (§11) : l'audit du mandat**, poussé dans `E1/AUDIT-DU-MANDAT.md` dès qu'il est écrit ; puis lit la maquette et le pont du site, commence **E1-a** | **mission 0 (§11) : l'audit du mandat**, poussé dans `E<n>/AUDIT-DU-MANDAT.md` ; puis lisent leur territoire dans la maquette et dans le site ; écrivent leurs bancs **sur la maquette p8-5g** (les mêmes gestes passeront sur le site : §7) |
| H0 + 2 (cible) | **pousse E1-a** : la maquette dans le site, en modules, préfixée, l'iframe et le pont tombés, la barre fusionnée, les interfaces du socle (§5) ; parcours P0-P4 vert ; `assemble/index.html` produit | dès que `E1-a` est poussée (ils surveillent `integration` : `git fetch` toutes les cinq minutes) : **partent de là** et codent dans leur module |
| ensuite | la trame réelle complète, l'Atelier, la colonne unique, p8-5h, les activités/notes/travail au hub | leur territoire, morceau par morceau |
| toutes les 2 h | la conscience tire `integration`, assemble, rejoue le parcours et les contrôles, écrit les relances, fait le point à Paul | |
| fin | `NOTE.md` de chacun ; la conscience audite ; Paul promeut `assemble/index.html` | |

Un exécutant qui a fini son mandat et n'a plus de relance **ne s'arrête pas** : il prend les dettes de la section C du plan qui touchent son territoire (13 · 4, 5, 8, 12 ; 12 · 05, 14-19), puis la passe d'infobulles de son territoire, et il le dit dans `JOURNAL.md`.

## 5 · LES INTERFACES DU SOCLE (E1 les écrit dans E1-a ; tous les utilisent ; personne d'autre ne les change)

Tout ce qui est repris de la maquette garde **son nom et son geste** (`S`, `J`, `journal`, `pousser`, `rendre`, `tout`, `reindexer`, `K`, `eidDe`, `indexDe`, `etatComplet`, `etatDiapo`, `ecran`, `seance`, `cle`, `now`, `hhmm`…) — propriété du socle, dans `dr-socle.js`. Ce qui remplace la simulation :

| interface | rend | remplace dans la maquette |
|---|---|---|
| `dr_ctx()` | `{level, chnum, snum, classeSlug, classeNom, debut, fin, heure, regime}` — depuis `AT.edChap`, `ATVUES.snum`, `AT_DR_COURS`, `AT_DR_REGIME` | `HEURES_SIM`, `S.heure` en dur |
| `dr_chapitre()` | `chapitresData[level][chnum]` | `DATA.chapitre` |
| `dr_seance(sk)` | `dr_chapitre().seances[sk]` | `DATA.seances[si]` |
| `dr_trame()` | en préparation : `dr_seance(snum).deroule.ecrans` ; en classe : la copie jouée (`C/ecrans`, celle qu'`atDrJouer` a faite) | `seance().ecrans` |
| `dr_blocLu(b)` | le bloc du site (`{t, id, txt, etapes, q, reps, pic, titre, corps, def, legende, ref, src, support, vues, devoilerTout}`) lu **tel quel** par le rendu de la maquette (qui lisait `{t, bid, txt, el}`) : un seul sens, à la lecture, jamais une seconde copie | le convertisseur que la n°12 avait appliqué pour fabriquer `DATA` |
| `dr_sauve()` | écrit la trame (`B/deroule` = `{ecrans, maj, activites, notes, travail}`) en préparation, la copie (`C/ecrans`) en classe ; débounce 900 ms ; témoin `atDrEnrConfirme` | `sauve` local |
| `dr_classe()` | `{slug, nom, eleves[]}` depuis `classesData[AT_DR_COURS.classeSlug]` (ou la classe proposée en préparation) ; `ELEVES`, `PRENOMS`, `INI` recalculés par les fonctions de la maquette | `ELEVES` en dur, `DATA.classe` |
| `dr_taxo()` | `CH.taxo` (chargée par `chChargerTaxo`) | `DATA.taxo` |
| `dr_lire(chemin, cb)` · `dr_ecrire(chemin, valeur, libelle, cb)` | lecture par `secuLire`, écriture par `mjpcPutJson` (classeur d'issues, témoin, **mode test**) ; `chemin` sans `FIREBASE_BASE`, sans `.json` | — |
| `dr_cheminB()` · `dr_cheminC()` · `dr_cheminH()` | `B = /site/<level>/chapitres/<chnum>/seances/<snum>` · `C = B/deroule_joue/<classeSlug>` · `H = C/heures/<clé>` (la clé par `_drCleHeureDe`, inchangée) | — |
| `window.dr` | `{S, J, ctx, trame, chapitre, classe, notes}` — la surface d'inspection des contrôles de la conscience (lecture seule) | `DATA`, `window.S`, `window.J` |

**Règle d'écriture, pour tous** : aucune écriture au hub autrement que par `dr_ecrire` (donc `mjpcPutJson`) ; aucun `fetch` direct ; rien ne s'écrit en répétition (`S.repetition`) ; rien ne se journalise dans l'atelier (`S.atelier`) ; **jamais un rang écrit au hub** : les écrans, activités, notes, décisions, participation et journal désignent par `eid`/`actId`.

## 6 · LES TERRITOIRES (qui possède quoi)

Les plages de lignes sont celles de la maquette p8-5g (le fichier généré) ; les noms de fonctions du site sont ceux d'`index.html` 8.74.0-③.

| | E1 — socle et Atelier | E2 — classe et heure | E3 — tableau | E4 — récit et papier |
|---|---|---|---|---|
| **module** | `dr-socle.js`, `dr-atelier.js`, `dr.css`, `dr-gabarit.js` | `dr-classe.js` | `dr-tableau.js` | `dr-recit.js` |
| **de la maquette** | CSS 3-298 ; corps 299-377 ; schémas 624-778 ; état/rendu/pousser/cadre/vue de droite/`tout` 779-972 ; atelier 973-1251 ; navigation/gardes/gel/marques/loupe/taille 1252-1322 ; surligner/clic droit 1450-1481 ; raccourcis/horloge/démarrage 1816-1835 | mise en commun, participation, notes N, commentaires, notion imprévue 1323-1428 ; réserve 1429-1438 ; T-5/fin d'heure/fin de séance 1482-1607 ; l'écran d'ouverture de l'heure suivante 1614-1638 ; l'EDT simulé 1608-1613 **tombe** | la fenêtre tableau 1804-1815 (`bvideoproj`, `message`, `pousser` → mur) ; `#mur2` | le moteur du récit 382-623 ; documents et vidéo 1439-1449 (+ `docHtml`, `videoHtml`, `loupeSur` du rendu) ; relecture 1639-1803 |
| **du site, repris et rebranché** | `atVuesBarreHtml`/`atVuesAller`/`atVuesPoser`/`ATVUES`, `atSommaireNatifHtml`/`atSomEcransDe`/`atSomSuivreCourant`/`atSomInjecterEcrans`, le bouton « Modifier », `atDrTrame`, `atDrEnrConfirme`, `_drIdentifierEcrans`/`_drEidNeuf`/`_drEidDuRang`/`_drRangDeLEid`, `chChargerTaxo`, `_lvlClasses`, `_drPrenomsDeLaClasse`/`_drInitialesDe` | `edtLancer`, `edtQuandPilotagePret`, `EDT_PILOTAGE_ELEMENTS`, la case EDT (« Préparer »), `atDrJouer`, `atDrJouerClic` → `dr_lancer`, `atDrClore`/`atDrCloreFin` → `dr_clore`, `_drCloreHeureRestee`, `_drCleHeureDe`/`_drBaseHeureDe`/`_drCreneauDe`/`_drSignatureCours`/`_drCoursActifEffacerSi`, `_drPaquetHeure`/`_drTraceAuto`/`_drTraceReprendre` → `dr_paquetHeure`/`dr_traceAuto`/`dr_reprendre`, `sesCoursEcrire`/`sesCoursFermer`, `atDrReprendre`/`sesReprendre`/`sesReprise*`, `_drProchainCreneau`, `AT_DR_COURS`, `AT_DR_REGIME` | `W.tableau`/`sesOuvrirTableau`, `sesPhoto` → `dr_scene`, `sesEmettre` → `dr_sceneAuto`, `sesPartEmettre` → `dr_part`, `sesChemins`, `sesBootTableau`/`sesTabCle`/`sesTabVeillePointeur`/`sesTabChercherCours`/`sesTabPoll`/`sesTabMonter` → `dr_rendreMur`, `sesBandeau*`, `sesQROuvrir`/`sesQRFermer`, la garde lecture seule de `?vue=tableau`, `SES` | `openViewer` (lecture), `DOCS_CACHE`, `ed2Documents`, les items de type doc de `sce.items` |
| **du site, qui tombe (à retirer, par le propriétaire)** | `AT_DR_B64`, `_drAssurerCadre`, `_drEnvelopper`, `_drHabiller`, `_drReconstruire`, `_drPontEtat`, `_drAfficher`, `_drTailleCadre`, `_drQuandPret`, `_drSain`, `_drVerifier`, `drWin`, l'iframe `at-dr-iframe`, `_drNormaliserTrame`, `_drFlushTrame`, `_drRechargerSi`, `_drEntreesEcran`, `_drTrameDe`, `_drEcrireTrame`, `_drLibelles`, `_drTitrerColonne`, `_drRecollerEtapes`, `_drRefusionner`, `_drMorceauDuDevoilement`, `_drRangDuMorceau`, `_drVueGroupe`, `_drVuePere`, `_drRatioEcran`, `_drLargeurEcran`, `_drPoserContexteMoteur`, `_drCalerStructure`, `atDrVueInterne`, `_drTexteBloc`, `_drEmpreinte`, `_drCoupe`, `atDrModifsDeLaSeance`, `atDrEnrAuto`, `atDrTrameEnregistrer`, `atDrMonter` (la tête), `atDrSynchroDebut`, `atDrMajUtile`, `atDrMaintenant`, `atDrCompChange`, `atDrTaxoOptions`, `atDrBrancherSuivi`, la vue `papier` comme onglet | `atVecu*` (6), `atT5*` (9), `AT_DR_VECU`, `AT_T5_CHOIX`, `AT_T5_TIMER`, `atDrClotureModale`, `atDrSuiviAppliquer`, `_drVifInstaller`/`_drVifAller`/`_drPaletteOuvrir`/`_drPaletteBrancher`, `sesIncident` (gardé si utile), `sesBrancherPilote`, `sesAppliquer`, `_sesRangLocal` | `sesTabChrono`, `sesTabQui`, tout `sesTel*`, `sesBootTel`, `sesBrancherPiloteTel`, `sesCurseurFin`, le bouton « 📱 Téléphone » | — |
| **nouveau** | la barre fusionnée (96) ; `#dr-zone` posé par `atVuesPoser` ; la colonne unique (§8.3) ; `dr_blocLu` ; `B/deroule/activites`, `/notes/<eid>`, `/travail/<heure>` ; « Éditer dans l'atelier » ; p8-5h (13 · 18-23) | « Préparer » sur la case EDT ; `C/journal`, `C/etat` au fil (900 ms) ; `dr_reprendre` ; le paquet `H` composé depuis `J` ; `S.heure` depuis la case EDT ; la fin de l'heure (7 étapes) avec les écritures du site ; la règle 13 · 25 (tout par `dr_ecrire`) | `index.html?vue=tableau&local=1` (la fenêtre locale = la page elle-même, lecture seule) ; `C/scene` = `et` + `{eid, origine, ts, trameMaj}` ; `dr_rendreMur(et)` unique pour local et distant ; le tableau autonome ; l'écran d'attente ; `C/part` depuis `S.parts` | `C/recit/<heure>` ; la face **Papier** ; `/classes/<slug>/ed` lu pour la copie ED ; les documents par référence (`sce.items` → `docHtml` → `openViewer`/Drive `/preview`) |

Ce que **personne** ne touche : l'EDT hors des fonctions nommées (229 fonctions `edt*` restent intactes), l'éditeur de chapitre (Structure), le transport (`mjpcPutJson`, `mjpcEcrireRest`, `mjpcFetchOk`, le mode test), les classes, la taxonomie, la corbeille, `correction_dictee.html` et les autres fichiers du dépôt, les contrôles de la conscience (`AUDITS/`).

## 7 · CE QUI NE CHANGE PAS DE NOM (pour que les contrôles passent)

- **Les ids de la maquette restent** : `#mur`, `#mur2`, `#volet`, `.vig[data-i]`, `[data-at-di]`, `#fin`, `#garde`, `#garde-devant`, `#compte`, `#notesd`, `#poignee-mur`, `#bdev #bprec #bfin #btableau #bvideoproj #bsurl #btxt #bgel`, `#rep-stop`, `#at-jouer`, `[data-lancer="1"]`, `[data-atelier]`, `li[data-p]`, `.page`, `.hors`, `.pas`, `.cour`, `#at-aide`.
- **Les onglets de la barre fusionnée** sont ceux du site (`.at-onglet[data-vue="structure|atelier|pilotage|relecture"]`) **et portent aussi** les ids de la maquette (`#ong-atelier`, `#ong-pilotage`, `#ong-relecture`) et `[data-atelier]` sur l'onglet Atelier.
- `[data-lancer="1"]` (le « Lancer » du Pilotage) lance **en un clic** avec la classe et le créneau proposés (`_drProchainCreneau`) quand on n'est pas passé par l'EDT.
- **Les collisions mesurées** (`AUDITS/INTEGRATION-DEROULE/collisions.json`) : 8 globales (`esc prenom presents tirer palier tout garde candidats`) → préfixées `dr_` ; 14 classes CSS (`on g d n h page seq ok c html pp err chip warn`) → préfixées `dr-` dans `dr.css`, le gabarit et le code ; 15 ids (`bgel bqui durees vif vif-* part ppop pnote`) : ceux du site sont dans le pont qui tombe — E1 vérifie qu'aucun ne subsiste, sinon préfixe. Les autres classes de la maquette gardent leur nom (la règle n°7 « `dr-` partout » s'applique aux **collisions** ; renommer 413 classes casserait les bancs pour rien).
- **Les globales de la maquette** (373) deviennent des propriétés d'un seul objet ou restent telles quelles si elles n'entrent pas en collision : E1 choisit, l'écrit dans sa NOTE, et le banc `collisions` (`AUDITS/INTEGRATION-DEROULE/collisions.mjs`) reste à 0.

## 8 · CE QUI EST TRANCHÉ ET QUE LE PLAN NE DISAIT PAS ENCORE

1. **Une seule branche**, des fichiers séparés, un assemblage : §3.
2. **Les contrôles de la conscience** (`AUDITS/CONTROLES-DEROULE/controles.mjs`, K1-K13) jouent sur le site intégré par l'entrée du site (`MJPC_ENTREE=site`) ; **le parcours** (`AUDITS/INTEGRATION-DEROULE/parcours.mjs`, P0-P12 : panneau prof → emploi du temps → case → lancer → classe → F2 → palette → tableau → fin de l'heure → relecture → papier → clôture) et **K15** (la liste exacte des chemins écrits au hub pendant le parcours, et zéro écriture en mode test) sont obligatoires avant chaque poussée, sur `assemble/index.html`. Un contrôle qui échoue : on corrige le site, jamais le contrôle ; s'il échoue **pour une raison de taille** (la zone du déroulé est moins haute dans le site : la barre et la colonne prennent de la place), on l'écrit dans `JOURNAL.md` avec la mesure et on continue — la conscience tranche.
3. **La colonne unique** (cadrage n°7 : « UNE seule colonne, un arbre »). La colonne « Le chapitre » du site reste (chapitre → séances repliables) ; **sous la séance dépliée, le `#volet` de la maquette** (ses vignettes, une par page — p8-5h) **remplace les écrans horodatés** qu'`atSomInjecterEcrans` y mettait. Il n'y a pas deux colonnes. Un clic sur une vignette ou sur une séance est un geste du socle (`dr_aller`).
4. **Les tailles** : 1280 × 800 et 1366 × 768 ; l'entête de la maquette tient à 1280 (13 · 23) dans la zone du site.
5. **Le faux hub** : `AUDITS/INTEGRATION-DEROULE/hub/` (classes, site_3e, site_config, grille, calendrier, créneaux, **taxonomie**). Lacunes connues, comblées par E1 dans E1-a : `/classes/3E Charles de Gaulle/ed` (`{espace, lien}`, valeur d'essai), rien d'autre n'est inventé.
6. **Les infobulles** : chaque geste de chaque territoire porte la sienne, écrite pour Paul (ce que le geste fait et ce qu'il coûte) ; un bouton grisé dit sa raison en clair à l'écran.
7. **Le redessin** ne touche jamais une saisie en cours ; une page ne dépend jamais d'un rechargement pour être à jour (la règle du 04/10).
8. **Les relecteurs neufs** (protocole du 12/10) : avant la `NOTE.md` finale, chacun lance deux sous-agents qui n'ont que le mandat, le contrat et `assemble/index.html` et jouent comme Paul son territoire ; chaque trouvaille est corrigée et reçoit une garde.

## 9 · CE QU'ON LIVRE (chacun, dans `E<n>/`)

- `JOURNAL.md` à chaque poussée : l'heure, fait · reste · bloqué · relances traitées.
- `bancs/` par le geste (Playwright, Chromium — le global `/opt/node22/lib/node_modules/playwright` si présent, sinon `npm i playwright && npx playwright install chromium`), un **banc unique** `banc.mjs` qui rejoue tout le lot et échoue si un seul échoue ; `sorties/` (la sortie réelle, horodatée, md5 du fichier joué en tête) ; `captures/` écran entier, nommées par le geste.
- `NOTE.md` à la fin : ce que ça change pour la classe ; le md5 de départ et d'arrivée ; chaque fonction touchée (nom, taille avant/après) ; ce qui tombe (compté) ; les bancs et leurs sorties ; les captures ; ce que les relecteurs neufs ont trouvé ; ce qui reste — **jamais une dette cachée** : ce qui n'est pas fait est écrit.

## 10 · CE QUI ARRÊTE UN EXÉCUTANT (et rien d'autre)

Rien. Si le mandat est contradictoire ou impossible à mesurer sur un point, on l'écrit dans `JOURNAL.md`, on livre le reste, on continue. Si `integration` ne reçoit pas `E1-a` à H0 + 3, E2-E4 commencent leur module **sur la maquette p8-5g copiée dans `LIVRAISONS/INTEGRATION/attente-E<n>/`** et le reporteront dans leur module dès `E1-a` — ils le disent dans `JOURNAL.md`.

## 11 · MISSION 0 — L'AUDIT DU MANDAT (Paul, 21/10, 08:49 : « il faut que les exécutants auditent ton mandat, c'est leur première mission. En effet, si tu t'es trompé, il faut qu'ils le signalent »)

Avant de coder, chaque exécutant **confronte ce contrat, le plan et son mandat au code réel** (`index.html` de production et la maquette p8-5g) et pousse `E<n>/AUDIT-DU-MANDAT.md` — c'est sa première poussée, dans l'heure :
1. **Ce qui est faux** : une fonction nommée qui n'existe pas ou ne fait pas ce que le mandat dit ; une plage de lignes qui ne correspond pas ; un chemin du hub qui n'est pas celui que le site écrit ; un id ou un nom que les contrôles attendent et qui n'existe pas.
2. **Ce qui est contradictoire** : entre le contrat et un mandat, entre un mandat et un cadrage (`DEROULE/CADRAGE-*.md`), entre deux territoires (deux exécutants à qui la même fonction est donnée, ou une fonction donnée à personne).
3. **Ce qui manque** : un geste de l'ancien déroulé qui marchait, absent de la maquette et absent de `RECYCLAGE-ANCIEN-DEROULE.md` (**E1 relit les 157 fonctions de `deroule86` une à une** et complète la table B de ce fichier, dans son audit) ; une donnée écrite aujourd'hui au hub que le plan §3 ne rebranche pas ; un écran du parcours T72 que personne ne reprend.
4. **Ce qui est impossible à mesurer** tel que le mandat le demande, avec la mesure qu'on propose à la place.
5. **Le verdict** par point du mandat : « tient » / « faux, parce que… » / « incomplet, il manque… ». Rien d'autre : pas de réécriture du mandat, pas de propositions de design.

Puis il continue sans attendre : il code ce qui n'est pas contesté ; ce qui est contesté attend la réponse de la conscience dans `RELANCES/E<n>.md` (au premier réveil, deux heures au plus). Un audit vide (« tout tient ») est suspect : la conscience le relit ligne à ligne.

MEMO
