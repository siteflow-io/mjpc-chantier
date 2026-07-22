# M11 — RAPPORT DE LIVRAISON · `analyse_logique` v2.0.0 (passe complète) + extraction onglet site
**[exécutant M11] · 22/07/2026 · MENTION PROVISOIRE (pt 21) — Paul seul déclare fini.**

Livrables au sas : `analyse_logique.staging.html` (md5 `93fb6e32fa4243afd2fc344fc9bca510`, 522 047 o) · `index.staging.html` (md5 `f2bfefb648fcd42f3e3b3bddee119824`, 365 082 o) · ce rapport · 12 captures (`captures-M11/`). Bases : `analyse_logique.html` prod 138 414 o md5 `2f0e15…` (relevé au cadrage) ; `index.html` prod **363 446 o, md5 `c9c3d326d85081a9fce45bfe68158d09`**. Je ne promeus jamais.

## 1. Q1 — Vendorisation (option A)
4 balises `src` → 4 blocs inline extraits VERBATIM de `dictee_universelle` (M9) : React 18.2.0 (10 737 car, md5 `d86dcdbfed4c273c`) · ReactDOM 18.2.0 (131 882, `64141792105ea486`) · firebase-app-compat 9.23.0 (28 949, `c90bd0ff996299d3`) · firebase-database-compat 9.23.0 (165 658, `a663070df0cc1277`). Aucune balise `src` restante. Le bloc DIAGNOSTIC (§8) documente le nouvel état : l'app boote sans aucun CDN.

## 2. Socle 1.1.0
Suppression-puis-insertion entre marqueurs exacts (`// ═══ MJPC-CORE v1.0.0` → `fin MJPC-CORE`), référence `mjpc-core.js` de production (10 886 o). **Vérification nommée fonction par fonction** : les 12 fonctions du socle (sanMJPC `1d99c7bed340`, cleClasse, classeTestId, estClasseInterne, estClasseTest, extractEleves `e7209d51b66d`, ecrireClasse, renvoyerVersMJPC, resolveEleves, publierManifeste, lireSessionMJPC `4cfcb1a42c80`, validerEleveMJPC `d4b68c51d444`) sont présentes à l'identique bit à bit ; `MJPC_CORE_VERSION="1.1.0"` ; aucun résidu 1.0.0.

## 3. Identité unique (Q4-cadrage, plan §6.3) — `?role=` SUPPRIMÉ
- **Racine `App()`** : session d'onglet → shunt §8 (élève **ET prof** : `lireSessionMJPC().is_prof` fait démarrer `Prof` authentifié — **dette M9 soldée**, acceptée au feu vert) → portail natif en secours. Plus aucun rôle en URL.
- **Portail** (patron M9 `PortailMJPC`) : code personnel + nom + prénom sur `/codes` ; `codeAttendu` tolérant (`/codes` hétérogène constaté : chaînes nues, entrées sans `classe`) ; classe résolue via `/classes` (`resoudreClasse`, sanMJPC canonique — le `san()` local du patron M9 remplacé). Aucune liste de prénoms exposée, aucun code généré par l'app.
- **Porte prof** : plus AUCUN littéral hors seed — `PROF_CODES=[3141,1312]` (seed) surchargé par `analyse_logique/config/profCodes` ; comparaisons `map(String)` ; trace `analyse_logique_traces/acces_prof` à chaque entrée par code ou shunt. Auth par code retenue le temps de l'onglet (sessionStorage `al_session_m11`).
- Cas prof au portail : nom hors registre + code prof → entrée acceptée (le professeur n'est pas au roster élève).

## 4. Q4 — LA NOMINATION EST CONSTITUTIVE (mécanisme `nonAvenu` supprimé)
- **Constat prouvé** : rien ne posait jamais `d.nonAvenu` (mécanisme mort) — grep exhaustif : les 4 seuls sites étaient sa *consommation* (L1312, L1775, L1778, L2017 de la base).
- Supprimés : neutralisation dans `agregerResultats` (seule modification légitime d'une fonction du moteur — déclarée), affichages écran Correction + fiche imprimée ; commentaire moteur (ex-L1241) réécrit.
- **`motifsDe(d)`** : LISTE de motifs construite à partir des verdicts déjà calculés, cumulable, purement explicative (aucune pénalité, aucun champ stocké). Motifs fixés codés : « crochets mal placés » (marque partiel/faux), « nommé à tort » (nomination faux), « non nommé » (nomination absent **avec** repérage — une copie blanche dit « absent », pas « non nommé »). Rendus tels quels sur écran Correction, écran élève et fiche imprimée.
- **Le calcul d'`evaluer` est INTOUCHÉ et PROUVÉ conforme** (§7) : mal nommé → faux, rien → absent, tous deux à 0, dénominateur inchangé.
- **Motifs supplémentaires PROPOSÉS (Paul tranche, rien n'est codé)** : marque absente avec étiquette posée → « crochets absents » ; couleur fausse → « couleur à revoir » ; lien partiel/absent → « flèche incomplète » / « flèche absente ». Sans jargon ; à valider ou reformuler.

## 5. Passe de grille (les points visibles)
- **pt 2 — nav 2 niveaux** : Pilotage (Travaux·Correction·Bilan) / Données (Copies·Fiches·Suivi·Exercices) / Réglages (Référentiel·Barème·Réglages·🛠 Développement **[Q3 arbitré]**) / « ? ». Atterrissage Pilotage>Travaux.
- **pt 5 — Réglages** : mode test, test d'intégrité, textes (pt 26), corbeille, état accès prof.
- **pt 6 — ⓘ** : helper `ifo()` posé sur mode test, intégrité, textes, corbeille, accès prof, consigne élève.
- **pt 8 — « Mes analyses »** : liste des travaux **publiés** de SA classe, note recalculée anti-péremption (`recalcResult` + barème effectif conforme au patron `collecteSuivi`), détail verdicts + motifs par élément, tokens bruts `buildTokens` (indexation canonique).
- **pt 17 — responsive ≤480** : media query dédiée (nav pliable, cibles ≥44 px, tables réduites), desktop strictement inchangé au-dessus ; captures 480 px jointes.
- **pt 18 — pastille** : `bottom:10/right:10`, 44×60 px mesurés au navigateur ; `elementFromPoint` au centre = la pastille elle-même (**aucun flottant dessous** — leçon refresh-btn M9). Métas anti-cache posées.
- **pt 19 — corbeille** : les 3 gestes destructeurs (`corrige/marks`, `bareme` travail, tâche todo) passent par `analyse_logique/corbeille` (étiquette + chemin + horodatage), restaurables depuis Réglages ; corbeille ajoutée aux `preserver` du contrat de purge.
- **pt 22 — présence** : patron M9 verbatim (`/presence/<clé>_<app>`, sendBeacon sortie), signalée à l'entrée élève.
- **pt 23 — bloc DIAGNOSTIC** : inséré en tête de script après le socle, verbatim de `docs/MJPC6-bloc-diagnostic.md`, **section 3 mise à jour honnêtement** (vendorisation M11 : plus de CDN, restent Firebase + polices). Constat : ni M9 ni la souche ne portent encore le bloc — dette d'écosystème, à verser au plan.
- **pts 24-25 — pastille+annonces** : `InfosMJPC` (lecteur `site/annonces` filtré `analyse_logique|*`, absence = cas normal), version 2.0.0 (2026-07-22) + socle affichés.
- **pt 26 — dictionnaire de textes** : seed + surcharge `analyse_logique_textes` (patron M9 : nœud racine `<app>_textes` — ajouté au manifeste `noeuds`), 3 annonces éditables (consigne délimitation, modes à venir, aucun travail) ; constats en dur.
- **pt 27 — tokenisation contrat** : les DEUX `buildTokens` intouchées (§6) ; les copies de test sont construites PAR `parseCorrige`/`_localiser` (aucun offset en dur).

## 6. Invariants §4 — prouvés AVANT/APRÈS (même extracteur, base↔staging)
`buildTokens`×2 `02058bad0985ceae`/`795e35d0d47b6d27` · `evaluer` `3f50052c9fb420a0` · `parseCorrige` `3a3dd49aecc1ed14` · `_localiser` `356cc62c04aefb4d` · `_contentToks` · `modeleVersMarks` · `marksVersModele` · `analyseSemantique` · `baremeEffectif` · `recalcResult` · `_meilleur`/`_spanEq`/`_ovlLen`/`_iou`/`_pts` · **NOYAU ENTIER** `62c3aecf8efc489e` — tous IDENTIQUES base↔staging. (Note de méthode : les md5 du cadrage §4 avaient un découpage d'extraction différent — ex. `evaluer` `247bfd…` ; l'invariance est prouvée ici par comparaison base↔staging au MÊME extracteur, et par le md5 du noyau entier.) `agregerResultats` : modifié par Q4 uniquement (déclaré §4).

## 7. Pt 14bis — LE CALCUL LIVRÉ AVEC SON TEST (12/12, deux exécutions)
`testIntegrite()` rejoue les six copies contre le moteur RÉEL (`evaluer` + `motifsDe`) : ① 20/20 · ② nomination FAUX + motif « nommé à tort » seul, marque JUSTE (l'élément reste au total) · ③ marque PARTIEL + « crochets mal placés » seul · ④ **LE CUMUL** des deux motifs · ⑤ nomination ABSENT + « non nommé » + **dénominateur INCHANGÉ (6 = 6)** · ⑥ copie blanche : note 0 calculée sans planter, ABSENT sans motif. **Exécuté 12/12 en Node (moteur extrait verbatim) ET dans le navigateur** (capture `05`). Bouton « Lancer le test » sous Réglages.

## 8. Pt 16 — MODE TEST (patron rectifié du 22/07, assemblage)
- Mécanique QCM : vrais nœuds (`/classes`, `/codes`, `analyse_logique/*`) sous `_test_analyse_logique` ; **nettoyage des zombies AVANT génération** (la purge s'exécute à l'ouverture) ; **purge exhaustive en sortie** : classe, travail, `modeTest`, `baremeDefauts` test, les 6 codes, présence des fictifs, résidus de corbeille `_test_*`.
- Noms `worktrack` : BERNARD Emma, DUPONT Marie, LEROY Hugo, MARTIN Lucas, MOREAU Léa, PETIT Thomas — **PREUVE au hub réel (GET /codes, 22/07) : aucune des 6 clés `sanMJPC` (`bernard_emma`, `dupont_marie`, `leroy_hugo`, `martin_lucas`, `moreau_lea`, `petit_thomas`) n'existe** ; codes séquentiels 9001-9006 ; la purge de codes ne touche QUE ces 6 clés (jamais un balayage).
- Pastille M8 : bandeau orange permanent monté à la RACINE (visible portail/élève/prof), repliable en point orange.
- Incarnation : l'élève fictif entre par le VRAI portail (code 9001…) et voit le VRAI écran « Mes analyses » (captures 09-11).
- Couverture : travail « Quand le vent se lève, les marins qui connaissent la baie rentrent au port. » (PP + PSCc + PSR), corrigé déposé (via `parseCorrige`), barème {marque:1, nomination:1}, six copies = les six états du §7.

## 9. Harnais LECTURE SEULE STRICTE + captures d'office
Playwright indisponible → `@sparticuz/chromium` + `puppeteer-core` (comme prescrit). Le proxy réseau du conteneur bloque le shard websocket Firebase (`s-gke-euw1-*`, hors liste) → conformément au feu vert, **fixtures GET RÉELLES** téléchargées du hub (REST : `/classes`, `/codes`, `/analyse_logique`, `/site/annonces`, `/analyse_logique_textes`) servies par un stub `firebase.database()` verrouillé (`defineProperty`) où **tout SET/UPDATE/REMOVE/PUSH est AVORTÉ et JOURNALISÉ** ; en parallèle, interception réseau avorte tout PUT/POST/PATCH/DELETE. **Journal : 1 seule écriture tentée sur tout le parcours — `SET manifestes/analyse_logique` (`publierManifeste`, additive, attendue). Zéro écriture au hub pendant toute la passe M11.** Pour les captures élève, les fixtures ont été enrichies LOCALEMENT du travail de test fabriqué par le moteur réel (même code que `genererModeTest`). Limite déclarée : harnais de rendu sur fixtures, pas de bout en bout websocket — l'essai en production revient à Paul.
Captures (12) : 01 portail desktop · 02 portail 480 px · 03 shunt prof → Pilotage>Travaux (données réelles) · 04 Réglages · 05 intégrité 12/12 à l'écran · 06 🛠 sous Réglages · 07 aide · 08 Données · 09 « Mes analyses » incarné (BERNARD Emma, 20/20) · 10 élève 480 px · 11 **détail copie ④ : « crochets mal placés · nommé à tort » affiché** (13,33/20) · 12 site : onglet Analyse logique. Cahier registre-bugs §5 (flèches SVG) : non rejouable sur fixtures sans corrigé `marks` — vérification limitée à l'invariance md5 du noyau (aucune ligne touchée) ; à l'œil de Paul en essai réel.

## 10. Q2/Q5 — `index.staging.html` (traité EN DERNIER, coutures ①-⑥ du §3 uniquement)
Base md5 `c9c3d326d85081a9fce45bfe68158d09` déclarée. Diff : **27 lignes**. ① bouton `tab-btn-analyse` 📐 dans `.tabs` · ② `<div id="tab-analyse">` (zone dynamique + conteneur statique) · ③ `gotoAnalyse()` sur patron `gotoEvalConn` + `openAnalyse()` → `openViewer('Analyse logique','analyse_logique.html')` — **sans `?mode=`/`?role=`** : le shunt §8 reconnaît la session MJPC (même origine) · ④ `PUBLISHABLE_TABS`+`TAB_LABELS` (+`analyse`) — publiable par niveau via le mécanisme générique existant, panneau admin compris · ⑤ chapter-card 📐 (avec sa drop-zone `data-section="analyse-logique"`) déplacée VERBATIM de `tab-fiches` vers le nouvel onglet · ⑥ `hideAllTabs` (+`tab-analyse`). Smoke test navigateur : bouton/onglet/carte/drop-zone présents, carte absente de `tab-fiches`, rendu capturé (12). Double parseur vert. Aucune autre modification du site.

## 11. Textes élève — SOUMIS (rien n'est décidé)
1. Consigne « Mes analyses » (défaut éditable) : *« Pour ce travail, tu fais l'analyse sur la feuille papier que je t'ai remise. Tes résultats corrigés apparaîtront ici. »* — 1re personne, action accomplie du professeur (principe cardinal). 2. Annonce modes à venir (éditable) : *« Les modes où tu rédiges directement à l'écran arriveront ici. »* 3. Aucun travail (éditable) : *« Aucun travail n'est publié pour ta classe pour l'instant. »* 4. Portail : messages d'erreur repris du patron M9 mot pour mot (déjà passés par Paul en M9). 5. Texte « À propos » de la pastille (en dur, sur le modèle M9) : soumis. 6. Motifs affichés (« crochets mal placés », « nommé à tort », « non nommé ») : libellés du feu vert, tels quels. Les verdicts « juste/partiel/faux/absent » des fiches restent en l'état (Q4-cadrage : vocabulaire de classe, non arbitré → inchangé).

## 12. Pt 12 — fondement pédagogique (note d'une ligne, chantier Fondements)
L'app incarne : *la nomination grammaticale est l'objectif d'apprentissage — repérer sans savoir nommer n'est pas su ; le motif affiché dit à l'élève CE QUI lui manque sans le punir deux fois.*

## 13. ④ ÉTAT DU HUB (obligation de passe du 22/07 — constats, rien n'est traité)
GET frais du 22/07 : `/classes` 8 classes · `/codes` 122 entrées. **Constats** : ① 29 entrées `/codes` SANS champ `classe` (le défaut 5e Hergé, confirmé) ; ② 2 entrées format chaîne nue ; ③ 5 orphelins : les 2 fossiles connus (`CL_MENT_Lylou`, `PINEAU_Cl_mence`) + **`ELIO-1381`, `ELIO-8378` (nouveaux, format de clé hors convention)** + `MONSIEUR_Meney` (compte d'essai) ; ④ **NOUVEAU — la classe interne `_TEST` (30 élèves) porte les NOMS RÉELS de la 3e Charles de Gaulle** : 28 clés d'élèves réels existent dans DEUX classes — même famille de risque que l'incident fondateur ; ⑤ `CLASSE TEST` (4 élèves) sans préfixe `_` : hors convention, visible des apps ; ⑥ **zombie `_test_pilotage_debat_s3`** (6 élèves) : une session de test du débat n'a pas été purgée ; ⑦ `analyse_logique` : un seul travail jetable `qfqfq-3e-charles-de-gaulle` sans résultat élève (conforme cadrage), pas de résidu de test. Doublons de clé sanMJPC dans `/codes` : 0. → tous versés à la conscience (arbitrages M-TEST / purge d'août).

## 14. Pt 24 + sécurité — CONSTATS, NON CODÉS (M-SÉCU, 6-10/08)
Alerte règles Firebase (29 j) : relève du site, rien ici. Constats versés à M-SÉCU : règles ouvertes en lecture/écriture (le harnais a lu ET aurait pu écrire sans authentification) ; les codes à 4 chiffres transitent en clair dans `/codes` lisible publiquement ; `analyse_logique_traces` accessible en écriture anonyme. Rien traité dans M11.

## 15. Écarts et décisions d'exécution (déclarés)
① Bloc diagnostic §3 adapté à la vendorisation (honnêteté du fichier autoportant). ② Nœud textes : patron M9 `<app>_textes` (racine) suivi, ajouté à `MJPC_MANIFESTE.noeuds`. ③ `className:"inp"` sur les champs du portail : la base style `input/textarea` par sélecteur d'élément — classe inerte, conservée par symétrie M9. ④ Purge du mode test étendue à `baremeDefauts/_test_*` et aux items de corbeille `_test_*` (esprit « TOUS les nœuds touchés »). ⑤ Le bandeau test est monté à la racine (pas seulement Réglages) pour la permanence M8.

## 16. Diff intégral classé
`analyse_logique` (1 120 lignes de diff) : A-métas+CSS (anti-cache, pastille, modal, nav, ifo, bandeau, corbeille, ≤480) · B-bloc diagnostic+version · C-identité (PROF_CODES/config, registre, codeAttendu/resoudreClasse, session onglet, textes pt 26, présence, InfosMJPC, ifo, PortailMJPC) · D-Q4 motifs (5 coutures) · E-App() · F-nav 2 niveaux+rendus · G-« Mes analyses » · H-corbeille (4 coutures) · I-mode test+ReglagesApp+AideProf+testIntegrite · J-vendorisation (4 blocs) · K-socle 1.1.0. `index` : 27 lignes = coutures ①-⑥. Double parseur (node `--check` + acorn ES2020) vert sur TOUS les blocs des deux fichiers, noyau compris (`@@ENDSCRIPT@@` rétabli comme `noyauTemplate()`). Bit à bit local↔sas vérifié après push (sha/md5 ci-dessous).

## 17. Annonce élève (pt « annonces nouveautés » — SOUMISE)
*« L'atelier d'analyse logique est ouvert sur le site. Vous y entrez avec votre code habituel et vous y retrouvez vos analyses corrigées, avec le détail de ce qui est juste et de ce qui manque. »*

---

## SPEC VIVANTE — dettes et restes (fin de livraison M11)
1. **Écrans à venir** : Copies · Exercices (placeholders assumés) ; modes élève « phrase imposée / paragraphe » (annonce pt 26).
2. **Concordance** : déclarée non codée (D4 du feu vert) — étiquette du référentiel seulement.
3. **Motifs supplémentaires** (couleur, lien, crochets absents) : proposés §4, en attente d'arbitrage.
4. **Bloc diagnostic absent des autres apps** (M9, souche…) : dette d'écosystème → plan.
5. **Hub** : 29 codes sans classe · `_TEST` aux noms réels (28 doubles) · `CLASSE TEST` hors convention · zombie `_test_pilotage_debat_s3` · orphelins `ELIO-*`/fossiles → arbitrages conscience (M-TEST / purge août).
6. **M-SÉCU** : règles Firebase ouvertes, codes en clair, traces anonymes (§14) — calé 6-10/08.
7. **Dette QCM niveau de classe** : `deduireNiveauDuNom` en place ici ; l'arbitrage global (option B préférée) reste ouvert.
8. **Registre-bugs §5 (flèches SVG)** : non rejouable au harnais fixtures — à l'essai réel de Paul.
9. **applause_meter** : `slice` + blocs debug (dette connue, hors périmètre M11).

[exécutant M11]
