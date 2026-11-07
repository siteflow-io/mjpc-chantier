# LA CARTE DES CHEMINS DE LA BASE (mandat X, mesure seule)
*Exécutant X, 07/11/2026, pour la conscience n°16. Production lue : `siteflow-io/monsieurjaipascompris` commit `7c64d7d` (`index.html` 8.89.2-㉓-micro), en lecture seule. Aucune requête vers le vrai hub, aucune valeur de données, aucun nom d'élève. Données complètes : `carte.json` (même dossier).*

## 0 · CE QUI EST MESURÉ (compté)
1. **Une seule base** est adressée : `mjpc-hub` (30 adresses en clair dans 11 fichiers). L'ancienne base `dictee-5e-ch4` n'apparaît plus nulle part.
2. **12 fichiers + le socle parlent à la base** : `index.html`, `mjpc-core.js`, `analyse_logique`, `applause_meter`, `correction_dictee`, `dictee_universelle`, `evaluation-qcm`, `pilotage_debat_s3`, `redaction`, `reecriture`, `reecriture_bb4e`, `worktrack`. La supposition de la conscience est juste.
3. **4 fichiers ne parlent à aucune base** : `Console_ateliers_revisions`, `etude_dugain`, `redaction_dugain_v3` (seulement `localStorage`), `deploy-monitor` (parle à l'API GitHub et lit les fichiers du site, jamais Firebase). `mjpc-bench.js` n'a qu'un faux `fetch` de banc (`https://mock`).
4. **Aucune app n'utilise Firebase Auth** : 0 appel `auth()`, `signIn…`, `onAuthStateChanged` hors des lignes du SDK embarqué. Supposition juste.
5. **Deux voies d'accès**, confirmées : le REST (`fetch`, `EventSource`, `_siteGet/_sitePut/_siteDelete`, `mjpcEcrireRest`, `mjpcPutJson`, `mjpcDeleteJson`, `mjpcLot`) et le SDK (`.ref/.child` puis `set/update/push/remove/transaction/on/once`). Le REST sert aussi d'**abonnement** : `EventSource` dans `index.html` (déroulé : `dr_tabFluxOuvrir`, `dr_sesEcouter`) et `redaction.html`.
6. **Comptes du balayage** : 1 567 sites d'appel lus ; 23 faux positifs écartés (noms de fichiers `.json` téléchargés) ; 37 doublons de même ligne écartés ; **1 282 sites résolus en 651 gabarits sur 39 entrées** : 37 nœuds de premier niveau, plus `.info` (connexion, décalage d'horloge) et la racine `/` ; s'y ajoute `/profil`, écrit seulement par les update racine (signalement 2) : **38 nœuds réels** ; 109 sites de relais (la fonction reçoit le chemin de son appelant, qui est compté à part) ; **116 sites non résolus** (chemin passé en paramètre ou bâti hors ligne, listés au § 6).
7. **Qui le fait** sur les 1 282 sites résolus : professeur 906, élève 162, les deux 75, tableau 18, je ne sais pas 121. Méthode : déduit du nom de l'écran ou de la fonction de premier niveau qui contient l'appel (`AppEleve`, `AppProf`, `VueBoard`, `doLogin`…). Seuls les cas du signalement 3 ont été vérifiés en lisant l'appelant.

## 1 · LES CINQ SIGNALEMENTS (ce qui décide des règles)

### Signalement 1 — écritures à la racine ou sur un nœud parent entier
1. **Racine, lecture de toute la base** : `index.html:6326` `_fbReadAll()` (GET `/`), appelée 3 fois (`index.html:6531`, `6736`, `6808` : sauvegarde, diagnostic, archivage). Écran du professeur.
2. **Racine, écriture de toute la base** : `index.html:6327` `_fbWriteRoot(data,method)` écrit `/` avec la méthode reçue. **Définie, jamais appelée** (0 appel trouvé).
3. **Restaurations et imports à chemin libre** (le chemin vient de l'appelant ou du fichier importé) : `snapshotImport` (set sur le chemin donné) dans `correction_dictee:2344`, `dictee_universelle:2507`, `reecriture`, `reecriture_bb4e` ; `restaurerCorbeille` (`analyse_logique:2681`, set) ; `restoreFullBackup` (`pilotage_debat_s3:6691`, set de `/debats/$debat` entier) ; `importerSnapshot` et `purgerTout` (`evaluation-qcm:16077`, `16091`, set de `/qcm` entier) ; `_fbPutPath` / `_fbDeletePath` (`index.html:6516`, `6522`, archivage par lot, chemins calculés) ; `restoreSnapshot` (`reecriture`).
4. **Nœud entier remplacé** : `/correction_dictee` (set, `correction_dictee:3547`, AppProf) ; `/correction_dictee_textes` (set, 3 endroits) ; `/dictee_universelle_textes` (set, `dictee_universelle:3641`) ; `/qcm` (set, 2 endroits) ; `/site/annonces`, `/site/cours_actif`, `/site/horloge`, `/site/cle_vue`, `/site/analyses` (PUT entier) ; `/applaudimetre/{live, liveSnapshot, file, tablettes, compteurLectures, compliments, votes}` (34 remove et 1 set du tableau, dont `_setReaderImpl` et `Accueil` hors écran du professeur).
5. **Purges et remises à zéro** : `resetChapitres` (`index.html:3818`, DELETE `/site/$niveau/chapitres` entier) ; `purgerModeTest` (`analyse_logique:3708-3736` : classes, codes, présence, corbeille) ; `purgerDonneesTest` (`correction_dictee:8258`) ; `purge` (`index.html:3733-3734`, lot de PUT/DELETE à chemins calculés) ; `supprimerDicteeAvecCorbeille` (`correction_dictee:8184`, remove `/correction_dictee/$id` entier) ; `deleteClass` (`index.html:7603`, DELETE `/classes/$classe`).
6. **Corbeille** (archives avant effacement) : `mjpcInjecterAvecArchive` (socle, PUT `/corbeille/$app-$ts`) présent dans les 11 apps ; `corbeille/$jour/$motif_…` écrit par les update racine de `correction_dictee` (signalement 2) ; `_cpArchive`, `_secuPurgerClair` (`index.html`).

### Signalement 2 — `update` à plusieurs chemins lancées haut dans l'arbre
1. **`db.ref().update({...})` à la racine : 15 sites dans `correction_dictee.html`, 11 fonctions, tous écran du professeur** (`formesOuverture:1335`, `accepteesCharger:1367`, `recalculerTexte:1378`, `recalculerDicteeL15g:1756`, `reclasserCL15h2:2564`, `ImportPdfL15e:3233`, `AppProf:3318`, `injecterIaL151:3774/3779`, `emettreEvenementsProfilL151:3792`, `ModeTest:8366`). Clés écrites en une fois (gabarits, jamais de valeur) :
   `correction_dictee/$dictee/results/$eleve/errors(/$i/formeId)` · `correction_dictee/$dictee/config(/creeLe)` · `correction_dictee/$dictee/dictee/amenagee` · `correction_dictee/$dictee/migrations/…` · `correction_dictee/$id` (dictée entière, `ModeTest:8366`) · `correction_dictee_erreurs/$forme/type` · `correction_dictee_textes/$texte/formesAcceptees/$i(/$forme)` · `corbeille/$jour/$motif_…` · `profil/$eleve/events/$evenement/(modifieLe|retire)` · `taxonomie/alias/tables/correction_dictee/$i` · **`codes/$cle`** (`ModeTest:8366`).
   Conséquence pour les règles : une règle posée sur un de ces nœuds s'applique à chaque clé de l'update ; un seul refus fait échouer toute l'update.
2. `/qcm` : `ecrireQCM` (`evaluation-qcm:3715`, les deux écrans) et les `v3Update` à clés relatives (`sessions/$id/…`, `sessionActive/$classe`, `questionsLancees/$qi`, `aLire/$id/…`, `lectures/$qi/$eleve`, `papier/$eleve/$i`, `entres/$eleve`).
3. `/codes` : update du nœud entier, `pilotage_debat_s3:2902` (`_testCodeDe`, préparation du mode test).
4. `/correction_dictee_erreurs` : update du nœud entier, `correction_dictee:1319`, `1335`.
5. `/presence` : update multi-clés, `index.html:5062` (`updatePresence`, **écran de l'élève**).
6. `/reecritures/…/snapshots/$id` : update multi-clés, `reecriture.html:953`.

### Signalement 3 — lectures d'un grand nœud entier depuis un écran d'élève (vérifiées en lisant l'appelant)
1. **Portail `index.html`** — `doLogin` (`4914`, connexion de l'élève) appelle `loadClasses` puis `loadCodes` : GET **`/classes` entier** (`7457`) et **`/codes` entier** (`7436`). Aussi `ensureEleveUuid` : GET `/eleves_index/$prenom` (`5007`).
2. **`pilotage_debat_s3`** — `doStudentLogin` (`3304`) : **`/codes` entier** (`3313`) ; `identifieEleve` (`3357`) : **`/debats` entier** (`3365`). `watchClasses` (`3052`, abonné à `/classes` entier) — je ne sais pas s'il tourne chez l'élève.
3. **`evaluation-qcm`** — `L.lireCodes` (`3698`, « à l'entrée d'un élève ») : **`/codes` entier**.
4. **`correction_dictee`** — `AppEleveCoeurL15f` : **`/codes` entier** (`8736`), **`/classes` entier** (`8737`), **`/correction_dictee` entier** (`8771`, toutes les dictées de toutes les classes avec leurs copies).
5. **`dictee_universelle`** — `App` lance `chargerRegistreMJPC` au démarrage, avant le choix de l'écran (`3732`) : **`/classes`** et **`/codes` entiers** (`3381-3382`) ; `DicteeSelector` (`3575`) et `MesDictees` (`3504`) : **`/dictees` entier**.
6. **`analyse_logique`** — `App` lance `chargerRegistreMJPC` au démarrage (`2881`) : **`/classes`** et **`/codes` entiers** (`2316-2317`) ; `AppEleve` abonné à **`/analyse_logique/travaux` entier** (`3931`), `/referentiel`, `/baremeDefauts`.
7. **`applause_meter`** — `AppEleve` abonné à **`/classes` entier** (`4440`) ; `EleveVote` abonné à `/applaudimetre/file`, `/historiqueLectures`, `/tablettes`, `/compteurLectures` ; `MesLectures` lit `/classes` entier (`5193`), `/applaudimetre/historiqueLectures`, `/seances`.
8. **`reecriture`** — `AppEleve` (`3622`) : **`/reecritures` entier** (`3643`).
9. **`reecriture_bb4e`** — `AppEleve` (`1473`) et `EleveSaisie` (`1595`) : **`/reecriture_bb4e` entier**.
10. **`worktrack`** — au chargement de la page, pour tout écran (`4827`) : `chargerCodes()` abonné à **`/codes` entier** (`4756`).

### Signalement 4 — requêtes (les règles devront porter `.indexOn`)
1. `dictee_universelle:2400` : `students/$eleve/errors` (ou `students_sim/…` en simulation) `.orderByChild("dicteeId").equalTo($dictee)` — **`.indexOn: ["dicteeId"]`** sur `/students/$eleve/errors`. Écran de l'élève (carnet d'erreurs).
2. `evaluation-qcm:12448` : `/qcm/corbeille` `.orderByKey().startAt("qcm-").endAt(…)` — tri par clé, aucun `.indexOn` requis.
3. REST `shallow=true` (lecture des seules clés) : `index.html:4464-4465` (`loadAppList` : `/redactions`, `/correction_dictee`) ; `redaction.html:10664`, `10841`. Pas d'`.indexOn`, mais la règle `.read` du nœud entier doit l'autoriser.
4. Aucun `orderBy=` / `equalTo=` en REST dans le code des apps (les seuls trouvés sont dans le SDK embarqué).

### Signalement 5 — données nominatives (nœud et chemin, jamais une valeur)
| nœud | ce qu'il porte | chemins où la clé ou la valeur est nominative |
|---|---|---|
| `/classes` | listes de classe (noms, prénoms) | `/classes/$classe/eleves` |
| `/codes` | code de connexion de chaque élève, avec nom et classe | `/codes/$cle` |
| `/eleves`, `/eleves_index` | identifiant d'élève, index par prénom | `/eleves/$uuid`, `/eleves_index/$prenom` (écrits par l'élève) |
| `/presence` | présence en ligne ; la **clé est l'identité de l'élève** | `/presence/$identite_$id`, `/presence/$cle` |
| `/classes_amenages` | élèves à aménagements | `/classes_amenages/$classe` |
| `/correction_dictee` | copies, erreurs, notes, absents, autocorrections | `…/$dictee/results/$eleve`, `…/autocorrection/$eleve`, `…/absents` |
| `/dictees` | copies, brouillons, corrections croisées, contestations, codes | `/dictees/$id/(results|drafts|contestations|codes)/…` |
| `/students`, `/students_sim` | carnet d'erreurs ; **clé = nom complet de l'élève** | `/students/$eleve/errors` |
| `/reecritures`, `/reecriture_bb4e` | réponses et autocorrections | `…/$id/autocorrection/$eleve` |
| `/redactions` | copies de rédaction | non cartographié en détail (mandat : lecture seule, voie `ruUrl`) |
| `/qcm` | sessions, réponses, lectures | `/qcm/sessions/$id/…`, `lectures/$qi/$eleve`, `papier/$eleve` |
| `/analyse_logique` | travaux par élève | `/analyse_logique/travaux/…` |
| `/applaudimetre` | lectures, votes, historique | `/applaudimetre/(historiqueLectures|votes|file)/…` |
| `/debats`, `/debat_config` | groupes, poules, matchs, bilans ; routage élève → débat | `/debats/$debat/active/…`, `/debat_config/routage` |
| `/plan_de_travail` | progression par élève | `/plan_de_travail/…` |
| `/profil`, `/mjpcProfils` | événements et profils d'élèves | `/profil/$eleve/events/…`, `/mjpcProfils/$nom` |
| `/site` | l'appel (absences), participation du déroulé, envois d'atelier | `/site/edt/…` (appel : `edtAppelGeste`), `/site/…/deroule_joue/$classe/…`, `/site/atelier/envois` |
| `/corbeille` | archives de tout ce qui précède | `/corbeille/$app-$ts`, `/corbeille/$jour/$motif_…` |
| `/intent` | réponses à l'enquête, par identifiant d'élève (écrit par l'élève) | `/intent/$uuid/$ts` |

Secrets du professeur (non nominatifs mais à fermer) : `/site/config/profEmpreintes` (empreintes), `/debat_config/profPassword` (`pilotage_debat_s3:4223`, set).

## 2 · L'ÉMULATEUR (faisabilité du banc) : **OUI**
1. Java présent (`/usr/bin/java`), Node 22. `firebase-tools@13.29.1` installé dans le scratchpad en **41 s, 227 Mo** ; l'émulateur Realtime Database (`firebase-database-emulator-v4.11.2.jar`, **33 Mo**) se télécharge au premier démarrage. Tout le cache est gardé dans le scratchpad (`FIREBASE_EMULATORS_PATH`, `XDG_CONFIG_HOME`, `XDG_CACHE_HOME`).
2. Démarré avec `{"rules":{".read":true,".write":true}}`, projet `demo-carte`, port 9123 : **prêt en environ 4 s** (téléchargement compris). PUT `/essai.json` puis GET `/essai.json` : la valeur écrite est relue à l'identique ; GET `/.json?shallow=true` répond aussi.
3. Arrêté (SIGINT), port fermé vérifié ; dossier supprimé. Aucune app branchée. Total disque pendant l'essai : environ 260 Mo.

## 3 · CE QUI RESTE
1. **116 sites non résolus** (§ 6) : chemins passés en paramètre ou bâtis hors ligne, surtout dans `index.html` (déroulé `dr_*`, `edt*`, relais `_siteGet(chemin)`). Leurs appelants nommés sont comptés dans la carte ; reste à remonter les autres d'un cran.
2. **« Qui »** : 121 sites « je ne sais pas » ; l'attribution est déduite du nom de l'écran, non vérifiée hors signalement 3. Le tableau (`dr_tab*`, `VueBoard`) et le pilotage par téléphone (`PhonePilot`) sont à confirmer écran par écran.
3. `redaction.html` : seulement compté (17 sites) ; sa voie propre `ruUrl` (REST + `EventSource`) n'est pas déroulée en gabarits.
4. `watchClasses` (`pilotage_debat_s3`) : je ne sais pas s'il tourne chez l'élève.

## 4 · NOMS DE VARIABLES
Les variables du code sont renommées comme dans des règles quand le sens est sûr : `$niveau` (level), `$chapitre` (chnum), `$seance` (snum, sk), `$dictee` (dicteeId), `$item` (itemId), `$classe` (classeSlug, classeInput…), `$eleve` (eleveFull, selectedEleve, ek…), `$cle` (k, key : souvent la clé d'un élève, pas toujours). Les autres gardent le nom du code avec `$`. Une clé faite de plusieurs morceaux s'écrit collée (`$identite_$id`).

## 5 · LA CARTE PAR NŒUD
Opérations : lu une fois / abonné / écrit en entier (set, PUT) / fusionné (update, PATCH) / ajouté (push, POST) / effacé (remove, DELETE) / transaction. « Endroits » = sites d'appel. Un gabarit sans opération est une URL bâtie puis envoyée par un relais (`mjpcLot`, `lot.push({url…})`).

### `/.info`
Fichiers : `pilotage_debat_s3.html` (1), `evaluation-qcm.html` (1).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/.info/connected` | abonné | professeur | `pilotage_debat_s3.html:3094` | 1 |
| `/.info/serverTimeOffset` | abonné | professeur | `evaluation-qcm.html:3687` | 1 |

### `/ (racine)`
Fichiers : `correction_dictee.html` (15), `index.html` (2).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/` | fusionné (update), lu une fois (GET), écrit à la racine (méthode reçue en paramètre ; fonction jamais appelée) | professeur | `index.html:6326` | 17 |

### `/analyse_logique`
Fichiers : `analyse_logique.html` (60), `index.html` (1). **Nominatif** : travaux par élève.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/analyse_logique/baremeDefauts` | abonné | professeur, élève | `analyse_logique.html:3374` | 5 |
| `/analyse_logique/baremeDefauts/$cl` | effacé (remove) | professeur | `analyse_logique.html:3711` | 1 |
| `/analyse_logique/baremeDefauts/$classe/dims` | abonné, écrit en entier (set) | professeur | `analyse_logique.html:3257` | 2 |
| `/analyse_logique/config` | lu une fois | les deux | `analyse_logique.html:2308` | 1 |
| `/analyse_logique/corbeille` | abonné, lu une fois | professeur | `analyse_logique.html:3721` | 2 |
| `/analyse_logique/corbeille/$cle` | effacé (remove) | professeur | `analyse_logique.html:3724` | 1 |
| `/analyse_logique/corbeille/$id` | effacé (remove) | professeur | `analyse_logique.html:3894` | 1 |
| `/analyse_logique/modeTest` | abonné, effacé (remove), écrit en entier (set) | les deux, professeur | `analyse_logique.html:2877` | 4 |
| `/analyse_logique/referentiel` | abonné, lu une fois, écrit en entier (set) | professeur, élève | `analyse_logique.html:2516` | 4 |
| `/analyse_logique/referentiel/etiquettes/$g` | écrit en entier (set) | professeur | `analyse_logique.html:3344` | 1 |
| `/analyse_logique/todo` | abonné, ajouté (push) | professeur | `analyse_logique.html:3430` | 2 |
| `/analyse_logique/todo/$id` | effacé (remove) | professeur | `analyse_logique.html:3433` | 1 |
| `/analyse_logique/todo/$id/fait` | écrit en entier (set) | professeur | `analyse_logique.html:3432` | 1 |
| `/analyse_logique/travaux` | abonné | professeur, élève | `index.html:4461` | 4 |
| `/analyse_logique/travaux/$g-$slice/config` | écrit en entier (set) | professeur | `analyse_logique.html:2998` | 2 |
| `/analyse_logique/travaux/$id` | effacé (remove), lu une fois | professeur | `analyse_logique.html:3009` | 3 |
| `/analyse_logique/travaux/$id/bareme/dims` | abonné | professeur | `analyse_logique.html:3227` | 1 |
| `/analyse_logique/travaux/$id/config` | fusionné (update), lu une fois | professeur | `analyse_logique.html:3030` | 2 |
| `/analyse_logique/travaux/$id/corrige` | (op. hors ligne : URL bâtie puis envoyée par un relais) | je ne sais pas | `analyse_logique.html:3289` | 1 |
| `/analyse_logique/travaux/$id/corrige/marks` | abonné, effacé (remove), écrit en entier (set) | je ne sais pas, professeur | `analyse_logique.html:3228` | 3 |
| `/analyse_logique/travaux/$id/corrige/modele` | abonné, écrit en entier (set) | je ne sais pas, professeur | `analyse_logique.html:3226` | 3 |
| `/analyse_logique/travaux/$id/corrige/retour` | abonné, écrit en entier (set) | je ne sais pas, professeur | `analyse_logique.html:3225` | 2 |
| `/analyse_logique/travaux/$id/results/$eleve` | fusionné (update) | professeur | `analyse_logique.html:3267` | 1 |
| `/analyse_logique/travaux/$id/results/$eleve/marks` | lu une fois, écrit en entier (set) | je ne sais pas | `analyse_logique.html:3207` | 2 |
| `/analyse_logique/travaux/$tid/bareme` | effacé (remove) | professeur | `analyse_logique.html:3384` | 1 |
| `/analyse_logique/travaux/$tid/bareme/dims` | abonné, écrit en entier (set) | professeur | `analyse_logique.html:3375` | 4 |
| `/analyse_logique/travaux/$tid/corrige/modele` | abonné | professeur | `analyse_logique.html:3496` | 2 |
| `/analyse_logique/travaux/$tid/results` | abonné | professeur | `analyse_logique.html:3495` | 2 |
| `/analyse_logique/travaux/_test_analyse_logique_travail` | effacé (remove), écrit en entier (set) | professeur | `analyse_logique.html:3709` | 2 |

### `/analyse_logique_prompts`
Fichiers : `analyse_logique.html` (2).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/analyse_logique_prompts/corrige/$piece` | lu une fois (GET) | je ne sais pas | `analyse_logique.html:2055` | 1 |
| `/analyse_logique_prompts/corrige/directives` | écrit en entier (PUT) | je ne sais pas | `analyse_logique.html:2058` | 1 |

### `/analyse_logique_textes`
Fichiers : `analyse_logique.html` (3).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/analyse_logique_textes` | abonné | les deux, professeur | `analyse_logique.html:2377` | 2 |
| `/analyse_logique_textes/$cle` | écrit en entier (set) | professeur | `analyse_logique.html:3882` | 1 |

### `/analyse_logique_traces`
Fichiers : `analyse_logique.html` (1).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/analyse_logique_traces/acces_prof` | ajouté (push) | les deux | `analyse_logique.html:2905` | 1 |

### `/applaudimetre`
Fichiers : `applause_meter.html` (127), `index.html` (1). **Nominatif** : lectures, votes, historique par élève.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/applaudimetre` | lu une fois | professeur | `applause_meter.html:3616` | 1 |
| `/applaudimetre/compliments` | abonné, effacé (remove) | professeur, tableau, élève | `applause_meter.html:2221` | 8 |
| `/applaudimetre/compliments/$i` | transaction | élève | `applause_meter.html:4942` | 1 |
| `/applaudimetre/compteurLectures` | abonné, effacé (remove) | professeur, élève | `applause_meter.html:3153` | 5 |
| `/applaudimetre/compteurLectures/$slugLec` | transaction | professeur | `applause_meter.html:3393` | 1 |
| `/applaudimetre/diagnostic` | ajouté (push) | professeur | `applause_meter.html:1136` | 1 |
| `/applaudimetre/file` | abonné, effacé (remove) | professeur, élève | `applause_meter.html:3152` | 6 |
| `/applaudimetre/file/$occ` | fusionné (update), écrit en entier (set) | élève | `applause_meter.html:4855` | 2 |
| `/applaudimetre/file/$slug` | effacé (remove), écrit en entier (set) | professeur | `applause_meter.html:3099` | 3 |
| `/applaudimetre/historiqueLectures` | abonné, lu une fois | professeur, élève | `applause_meter.html:3151` | 5 |
| `/applaudimetre/historiqueLectures/$passageId` | effacé (remove), fusionné (update) | professeur, élève | `applause_meter.html:3344` | 3 |
| `/applaudimetre/historiqueLectures/$passageId/annule` | écrit en entier (set) | professeur | `applause_meter.html:3352` | 1 |
| `/applaudimetre/historiqueLectures/$passageId/checkpoints` | abonné, ajouté (push) | tableau | `applause_meter.html:4154` | 2 |
| `/applaudimetre/historiqueLectures/$passageId/courbe/s$secEch` | écrit en entier (set) | tableau | `applause_meter.html:4232` | 1 |
| `/applaudimetre/historiqueLectures/$pid` | lu une fois | professeur | `applause_meter.html:3252` | 1 |
| `/applaudimetre/historiqueLectures/p_$now` | fusionné (update) | professeur | `applause_meter.html:2238` | 1 |
| `/applaudimetre/live` | abonné, effacé (remove), fusionné (update) | professeur, tableau, élève | `applause_meter.html:2220` | 11 |
| `/applaudimetre/live/$tableId` | effacé (remove), onDisconnect, transaction, écrit en entier (set) | élève | `applause_meter.html:4911` | 2 |
| `/applaudimetre/liveSnapshot` | abonné, effacé (remove), écrit en entier (set) | professeur, tableau, élève | `applause_meter.html:2222` | 10 |
| `/applaudimetre/presence` | abonné | professeur | `applause_meter.html:3139` | 1 |
| `/applaudimetre/presence/$cle` | fusionné (update) | élève | `applause_meter.html:2432` | 2 |
| `/applaudimetre/qrScans/$nonce` | abonné, effacé (remove), écrit en entier (set) | professeur, tableau | `applause_meter.html:5138` | 2 |
| `/applaudimetre/seances` | abonné, lu une fois | professeur, élève | `index.html:4462` | 3 |
| `/applaudimetre/seances/$sId` | lu une fois | professeur | `applause_meter.html:3251` | 3 |
| `/applaudimetre/seances/$sessionId` | écrit en entier (set) | professeur | `applause_meter.html:3203` | 1 |
| `/applaudimetre/seances/$sessionId/passages/p_$now` | écrit en entier (set) | professeur | `applause_meter.html:2232` | 1 |
| `/applaudimetre/seances/$sid/termineLe` | écrit en entier (set) | professeur | `applause_meter.html:3215` | 2 |
| `/applaudimetre/session` | abonné, fusionné (update), lu une fois | les deux, professeur, tableau, élève | `applause_meter.html:2242` | 21 |
| `/applaudimetre/session/modeTest` | abonné, lu une fois | les deux, professeur | `applause_meter.html:2956` | 2 |
| `/applaudimetre/session/reglages` | fusionné (update) | professeur | `applause_meter.html:3490` | 2 |
| `/applaudimetre/session/textes` | abonné, fusionné (update) | les deux, professeur | `applause_meter.html:3845` | 2 |
| `/applaudimetre/tablettes` | abonné, effacé (remove) | les deux, professeur, tableau, élève | `applause_meter.html:2896` | 6 |
| `/applaudimetre/tablettes/$table` | abonné, effacé (remove), écrit en entier (set) | élève | `applause_meter.html:4446` | 5 |
| `/applaudimetre/votes` | effacé (remove) | professeur | `applause_meter.html:3235` | 1 |
| `/applaudimetre/votes/$passageId` | abonné, effacé (remove), fusionné (update), lu une fois | professeur, tableau, élève | `applause_meter.html:3173` | 8 |
| `/applaudimetre/votes/$passageId/$votant` | écrit en entier (set) | élève | `applause_meter.html:4626` | 1 |

### `/applause_prompts`
Fichiers : `applause_meter.html` (2).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/applause_prompts/criteres/$piece` | lu une fois (GET) | je ne sais pas | `applause_meter.html:1761` | 1 |
| `/applause_prompts/criteres/directives` | écrit en entier (PUT) | je ne sais pas | `applause_meter.html:1764` | 1 |

### `/classes`
Fichiers : `index.html` (41), `correction_dictee.html` (8), `applause_meter.html` (5), `pilotage_debat_s3.html` (5), `analyse_logique.html` (4), `reecriture.html` (3), `reecriture_bb4e.html` (3), `worktrack.html` (3), `evaluation-qcm.html` (3), `dictee_universelle.html` (2), `mjpc-core.js` (1), `redaction.html` (1). **Nominatif** : listes de classe (noms et prénoms des élèves).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/classes` | abonné, lu une fois, lu une fois (GET) | je ne sais pas, les deux, professeur, élève | `index.html:7457` | 21 |
| `/classes/$ELF/amenagements/$ELF/dicteeAmenagee` | écrit en entier (PUT) | je ne sais pas | `index.html:6105` | 1 |
| `/classes/$ELF/amenagements/$ELF/sexe` | écrit en entier (PUT) | je ne sais pas | `index.html:6092` | 1 |
| `/classes/$ELF/eleves` | écrit en entier (PUT) | professeur | `index.html:6211` | 1 |
| `/classes/$ELF/nbDispositifs` | écrit en entier (PUT) | je ne sais pas | `index.html:6107` | 1 |
| `/classes/$ELF/profils/$ELF/dispositif` | écrit en entier (PUT) | je ne sais pas | `index.html:6104` | 1 |
| `/classes/$ELF/profils/$ELF/majLe` | écrit en entier (PUT) | je ne sais pas | `index.html:6105` | 1 |
| `/classes/$ELF/profils/$ELF/pap` | écrit en entier (PUT) | je ne sais pas | `index.html:6104` | 1 |
| `/classes/$ELF/profils/$ELF/remarques` | écrit en entier (PUT) | je ne sais pas | `index.html:6104` | 1 |
| `/classes/$ELF/profils/$ELF/sexe` | écrit en entier (PUT) | je ne sais pas | `index.html:6092` | 1 |
| `/classes/$ELF/profils/$ELF/synthese` | écrit en entier (PUT) | je ne sais pas | `index.html:6105` | 1 |
| `/classes/$TEST_DEBAT_CLASSE` | lu une fois | professeur | `pilotage_debat_s3.html:4946` | 1 |
| `/classes/$cl` | effacé (remove) | professeur | `analyse_logique.html:3708` | 1 |
| `/classes/$classe/amenagements` | abonné, écrit en entier (set) | professeur | `correction_dictee.html:4229` | 2 |
| `/classes/$classeTestId` | lu une fois | professeur | `correction_dictee.html:8347` | 1 |
| `/classes/$nom` | transaction | les deux | `index.html:2942` | 12 |
| `/classes/$remove` | effacé (remove) | professeur | `worktrack.html:6984` | 1 |
| `/classes/$sl/annee` | écrit en entier (PUT) | professeur | `index.html:7549` | 1 |
| `/classes/$sl/niveau` | écrit en entier (PUT) | professeur | `index.html:7549` | 1 |
| `/classes/$slug` | effacé (DELETE), écrit en entier (PUT) | professeur | `index.html:7562` | 3 |
| `/classes/$slug/amenagements/$cle` | écrit en entier (PUT) | professeur | `index.html:5922` | 1 |
| `/classes/$slug/amenagements/$cle/sexe` | écrit en entier (PUT) | professeur | `index.html:5928` | 1 |
| `/classes/$slug/amenagements/$y` | effacé (DELETE) | professeur | `index.html:5988` | 1 |
| `/classes/$slug/archivee` | écrit en entier (PUT) | professeur | `index.html:7584` | 2 |
| `/classes/$slug/eleves` | écrit en entier (PUT) | professeur | `index.html:5660` | 2 |
| `/classes/$slug/nbDispositifs` | écrit en entier (PUT) | professeur | `index.html:5938` | 3 |
| `/classes/$slug/nom` | écrit en entier (PUT) | professeur | `index.html:7576` | 1 |
| `/classes/$slug/profils/$cle` | écrit en entier (PUT) | professeur | `index.html:5923` | 2 |
| `/classes/$slug/profils/$cle/attente` | écrit en entier (PUT) | professeur | `index.html:5931` | 1 |
| `/classes/$slug/profils/$cle/dispositif` | écrit en entier (PUT) | professeur | `index.html:5931` | 1 |
| `/classes/$slug/profils/$cle/naissance` | écrit en entier (PUT) | professeur | `index.html:5931` | 2 |
| `/classes/$slug/profils/$cle/sexe` | écrit en entier (PUT) | professeur | `index.html:5928` | 1 |
| `/classes/$slug/profils/$y` | effacé (DELETE) | professeur | `index.html:5987` | 1 |
| `/classes/$slug/profils/$y/attente` | écrit en entier (PUT) | professeur | `index.html:5970` | 1 |
| `/classes/$slug/profils/$y/dispositif` | écrit en entier (PUT) | professeur | `index.html:5970` | 1 |
| `/classes/$slug/profils/$y/naissance` | écrit en entier (PUT) | professeur | `index.html:5970` | 1 |
| `/classes/$slug/profils/$y/pap` | écrit en entier (PUT) | professeur | `index.html:5970` | 1 |
| `/classes/_test_evaluation-qcm` | lu une fois | professeur | `evaluation-qcm.html:6790` | 1 |
| `/classes/_test_pilotage_debat_s3` | effacé (remove) | professeur | `pilotage_debat_s3.html:2876` | 1 |

### `/classes_amenages`
Fichiers : `index.html` (1), `correction_dictee.html` (1). **Nominatif** : élèves à aménagements (par classe).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/classes_amenages` | lu une fois (GET) | professeur | `index.html:5850` | 1 |
| `/classes_amenages/$classe` | lu une fois | professeur | `correction_dictee.html:4144` | 1 |

### `/codes`
Fichiers : `pilotage_debat_s3.html` (5), `index.html` (4), `worktrack.html` (4), `analyse_logique.html` (3), `evaluation-qcm.html` (3), `applause_meter.html` (2), `correction_dictee.html` (1), `dictee_universelle.html` (1), `reecriture.html` (1), `reecriture_bb4e.html` (1). **Nominatif** : codes de connexion des élèves, avec nom et classe.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/codes` | abonné, fusionné (update), lu une fois, lu une fois (GET) | je ne sais pas, les deux, professeur, élève | `index.html:7436` | 13 |
| `/codes/$ELF` | effacé (DELETE) | professeur | `index.html:6212` | 1 |
| `/codes/$TEST_NOMS` | lu une fois | professeur | `evaluation-qcm.html:6795` | 1 |
| `/codes/$c` | lu une fois | professeur | `applause_meter.html:2273` | 1 |
| `/codes/$ch` | fusionné (PATCH) | professeur | `index.html:14876` | 1 |
| `/codes/$cle` | effacé (remove), lu une fois, écrit en entier (PUT) | professeur, élève | `index.html:5622` | 3 |
| `/codes/$code` | effacé (remove) | professeur | `pilotage_debat_s3.html:3628` | 1 |
| `/codes/$e2` | effacé (remove) | professeur | `analyse_logique.html:3714` | 1 |
| `/codes/$nom` | écrit en entier (set) | professeur | `worktrack.html:6971` | 1 |
| `/codes/$nomC` | écrit en entier (set) | professeur | `analyse_logique.html:3750` | 1 |
| `/codes/$remove` | effacé (remove) | professeur | `worktrack.html:6985` | 1 |

### `/corbeille`
Fichiers : `correction_dictee.html` (6), `index.html` (4), `analyse_logique.html` (4), `pilotage_debat_s3.html` (2), `worktrack.html` (2), `applause_meter.html` (1). **Nominatif** : archives de tout ce qui précède (copies, classes, codes effacés).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/corbeille` | abonné, lu une fois, lu une fois (GET) | professeur | `index.html:7175` | 3 |
| `/corbeille/$__cle` | effacé (remove) | professeur | `analyse_logique.html:3894` | 1 |
| `/corbeille/$c` | effacé (remove) | professeur | `analyse_logique.html:3736` | 1 |
| `/corbeille/$date/debat-$id` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:3550` | 1 |
| `/corbeille/$date/documents-$DEBAT_ID` | écrit en entier (set) | je ne sais pas | `pilotage_debat_s3.html:2805` | 1 |
| `/corbeille/$j` | lu une fois | professeur | `correction_dictee.html:8318` | 1 |
| `/corbeille/$jour/$gi_$slice$slice$slice` | écrit en entier (PUT) | professeur | `index.html:6674` | 1 |
| `/corbeille/$jour/effacement-copie_$slice$slice$slice_$l` | écrit en entier (set) | professeur | `correction_dictee.html:8154` | 1 |
| `/corbeille/$jour/suppression-chapitre-worktrack_ch$slice_$hh` | écrit en entier (set) | professeur | `worktrack.html:8342` | 1 |
| `/corbeille/$jour/suppression-dictee_$slice$slice$slice` | écrit en entier (set) | professeur | `correction_dictee.html:8184` | 1 |
| `/corbeille/$slice/recalcul-amenage_$slice$slice$slice_$cle` | écrit en entier (set) | professeur | `correction_dictee.html:1553` | 1 |
| `/corbeille/$slice/recalcul-amenage_$slice$slice$slice_$fautif \u2192 $word` | écrit en entier (set) | professeur | `correction_dictee.html:4185` | 1 |
| `/corbeille/$slice/reclassement-ponctuation_$slice$slice$slice_$fautif \u2192 $word` | écrit en entier (set) | professeur | `correction_dictee.html:4157` | 1 |
| `/corbeille/$slice/worktrack-chapitre_$ts` | écrit en entier (PUT) | professeur | `worktrack.html:8450` | 1 |
| `/corbeille/code-prof-$ts` | écrit en entier (PUT) | professeur | `index.html:15143` | 1 |
| `/corbeille/retrait-clair-$ts` | écrit en entier (PUT) | professeur | `index.html:15045` | 1 |
| `/corbeille/…/$chemin` | écrit en entier (set) | professeur | `applause_meter.html:2487` | 1 |

### `/correction_dictee`
Fichiers : `correction_dictee.html` (209), `index.html` (1). **Nominatif** : copies de dictée, erreurs, notes, absents, autocorrections par élève.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/correction_dictee` | lu une fois, écrit en entier (set) | je ne sais pas, professeur, élève | `index.html:4465` | 13 |
| `/correction_dictee/$?-$now-$now-$now-$now/config` | lu une fois | professeur | `correction_dictee.html:3230` | 1 |
| `/correction_dictee/$dictId/autocorrection/$eleve/attempts` | écrit en entier (set) | professeur | `correction_dictee.html:3577` | 1 |
| `/correction_dictee/$dictId/autocorrection/$eleve/history` | écrit en entier (set) | professeur | `correction_dictee.html:3576` | 1 |
| `/correction_dictee/$dictId/autocorrection/$eleve/score` | écrit en entier (set) | professeur | `correction_dictee.html:3578` | 1 |
| `/correction_dictee/$dictee` | lu une fois, écrit en entier (set) | professeur | `correction_dictee.html:3969` | 4 |
| `/correction_dictee/$dictee/absents/$eleve` | effacé (remove), écrit en entier (set) | professeur | `correction_dictee.html:3624` | 2 |
| `/correction_dictee/$dictee/absentsJour` | abonné, écrit en entier (set) | professeur | `correction_dictee.html:5723` | 2 |
| `/correction_dictee/$dictee/amenages` | abonné, fusionné (update) | professeur | `correction_dictee.html:4220` | 2 |
| `/correction_dictee/$dictee/amenages/$eleve` | effacé (remove), écrit en entier (set) | professeur | `correction_dictee.html:4241` | 3 |
| `/correction_dictee/$dictee/autocorrection` | abonné, lu une fois | je ne sais pas, professeur | `correction_dictee.html:5553` | 3 |
| `/correction_dictee/$dictee/autocorrection/$cle` | effacé (remove), lu une fois | professeur | `correction_dictee.html:4348` | 2 |
| `/correction_dictee/$dictee/autocorrection/$cle/copieRamassee` | écrit en entier (set) | professeur | `correction_dictee.html:5995` | 1 |
| `/correction_dictee/$dictee/autocorrection/$curKey` | lu une fois, écrit en entier (set) | professeur | `correction_dictee.html:4297` | 2 |
| `/correction_dictee/$dictee/autocorrection/$eleve` | effacé (remove), fusionné (update), lu une fois | professeur | `correction_dictee.html:3380` | 6 |
| `/correction_dictee/$dictee/autocorrection/$eleve/attempts` | écrit en entier (set) | professeur | `correction_dictee.html:4407` | 1 |
| `/correction_dictee/$dictee/autocorrection/$eleve/attempts/$i` | effacé (remove), écrit en entier (set) | professeur | `correction_dictee.html:6206` | 3 |
| `/correction_dictee/$dictee/autocorrection/$eleve/errorRefs` | écrit en entier (set) | professeur | `correction_dictee.html:3454` | 1 |
| `/correction_dictee/$dictee/autocorrection/$eleve/history/$i` | lu une fois, écrit en entier (set) | professeur | `correction_dictee.html:6228` | 2 |
| `/correction_dictee/$dictee/autocorrection/$eleve/history/$i/$j` | effacé (remove) | professeur | `correction_dictee.html:6226` | 1 |
| `/correction_dictee/$dictee/autocorrection/$eleve/history/$i/$j/ok` | écrit en entier (set) | professeur | `correction_dictee.html:6207` | 1 |
| `/correction_dictee/$dictee/autocorrection/$eleve/results` | écrit en entier (set) | professeur | `correction_dictee.html:4406` | 1 |
| `/correction_dictee/$dictee/autocorrection/$eleve/results/$i` | effacé (remove), écrit en entier (set) | professeur | `correction_dictee.html:6205` | 3 |
| `/correction_dictee/$dictee/autocorrection/$eleve/score` | écrit en entier (set) | professeur | `correction_dictee.html:4408` | 3 |
| `/correction_dictee/$dictee/autocorrection/$eleve/solved` | écrit en entier (set) | professeur | `correction_dictee.html:4409` | 3 |
| `/correction_dictee/$dictee/autocorrection/$eleve/total` | écrit en entier (set) | professeur | `correction_dictee.html:3453` | 1 |
| `/correction_dictee/$dictee/autocorrection/$sek` | effacé (remove) | professeur | `correction_dictee.html:4330` | 1 |
| `/correction_dictee/$dictee/autocorrection/$tek` | effacé (remove) | professeur | `correction_dictee.html:4329` | 1 |
| `/correction_dictee/$dictee/binomes` | abonné, fusionné (update), lu une fois, écrit en entier (set) | professeur | `correction_dictee.html:5723` | 4 |
| `/correction_dictee/$dictee/binomes/partis/$cle` | effacé (remove), écrit en entier (set) | professeur | `correction_dictee.html:5721` | 3 |
| `/correction_dictee/$dictee/config` | fusionné (update) | professeur | `correction_dictee.html:4023` | 1 |
| `/correction_dictee/$dictee/config/base` | abonné | professeur | `correction_dictee.html:4118` | 1 |
| `/correction_dictee/$dictee/config/dateCorrection` | abonné, écrit en entier (set) | professeur | `correction_dictee.html:3856` | 2 |
| `/correction_dictee/$dictee/config/exercicesOuverts` | abonné | professeur | `correction_dictee.html:7501` | 1 |
| `/correction_dictee/$dictee/config/peerHelp` | abonné | professeur | `correction_dictee.html:5719` | 1 |
| `/correction_dictee/$dictee/copyOptions` | écrit en entier (set) | professeur | `correction_dictee.html:7523` | 2 |
| `/correction_dictee/$dictee/copyPublishedAt` | abonné, effacé (remove), écrit en entier (set) | professeur | `correction_dictee.html:7544` | 3 |
| `/correction_dictee/$dictee/deconnexion/$cle` | écrit en entier (set) | professeur | `correction_dictee.html:6092` | 1 |
| `/correction_dictee/$dictee/deconnexion/tous` | écrit en entier (set) | professeur | `correction_dictee.html:6030` | 1 |
| `/correction_dictee/$dictee/dictee/amenagee` | abonné, lu une fois, écrit en entier (set) | professeur | `correction_dictee.html:4037` | 6 |
| `/correction_dictee/$dictee/dictee/amenagee/enabled` | écrit en entier (set) | professeur | `correction_dictee.html:4041` | 2 |
| `/correction_dictee/$dictee/effacees` | abonné | professeur | `correction_dictee.html:4273` | 1 |
| `/correction_dictee/$dictee/effacees/$curKey/$le/ignoree` | écrit en entier (set) | professeur | `correction_dictee.html:4289` | 1 |
| `/correction_dictee/$dictee/effacees/$curKey/$le/restauree` | écrit en entier (set) | professeur | `correction_dictee.html:4298` | 1 |
| `/correction_dictee/$dictee/effacees/$l/$le` | écrit en entier (set) | professeur | `correction_dictee.html:8155` | 1 |
| `/correction_dictee/$dictee/exercices` | abonné, effacé (remove), écrit en entier (set) | professeur, élève | `correction_dictee.html:5742` | 6 |
| `/correction_dictee/$dictee/exercices_consultes` | abonné | professeur | `correction_dictee.html:9354` | 1 |
| `/correction_dictee/$dictee/exercices_consultes/$consultedKey` | écrit en entier (set) | professeur | `correction_dictee.html:10055` | 1 |
| `/correction_dictee/$dictee/exercices_html` | abonné, effacé (remove), écrit en entier (set) | professeur, élève | `correction_dictee.html:7541` | 5 |
| `/correction_dictee/$dictee/exercices_imprimes` | abonné, effacé (remove), fusionné (update) | professeur | `correction_dictee.html:9379` | 3 |
| `/correction_dictee/$dictee/exercices_results` | abonné, effacé (remove) | professeur | `correction_dictee.html:5745` | 3 |
| `/correction_dictee/$dictee/exercices_results/$eleve` | lu une fois, écrit en entier (set) | élève | `correction_dictee.html:10321` | 2 |
| `/correction_dictee/$dictee/heure` | abonné, fusionné (update), écrit en entier (set) | professeur | `correction_dictee.html:3357` | 4 |
| `/correction_dictee/$dictee/heure/fin` | écrit en entier (set) | professeur | `correction_dictee.html:5883` | 1 |
| `/correction_dictee/$dictee/places` | abonné | professeur | `correction_dictee.html:3357` | 2 |
| `/correction_dictee/$dictee/places/$bcle` | effacé (remove), fusionné (update), onDisconnect, écrit en entier (set) | élève | `correction_dictee.html:8835` | 1 |
| `/correction_dictee/$dictee/places/$moi` | effacé (remove), fusionné (update), onDisconnect, écrit en entier (set) | élève | `correction_dictee.html:8835` | 1 |
| `/correction_dictee/$dictee/results` | fusionné (update) | professeur | `correction_dictee.html:4187` | 1 |
| `/correction_dictee/$dictee/results/$cle` | effacé (remove), lu une fois | professeur | `correction_dictee.html:4347` | 2 |
| `/correction_dictee/$dictee/results/$curKey` | écrit en entier (set) | professeur | `correction_dictee.html:4296` | 1 |
| `/correction_dictee/$dictee/results/$eleve` | écrit en entier (set) | professeur | `correction_dictee.html:3377` | 1 |
| `/correction_dictee/$dictee/results/$sek` | effacé (remove), écrit en entier (set) | professeur | `correction_dictee.html:4322` | 2 |
| `/correction_dictee/$dictee/results/$tek` | écrit en entier (set) | professeur | `correction_dictee.html:4321` | 2 |
| `/correction_dictee/$id` | effacé (remove), lu une fois | professeur | `correction_dictee.html:8168` | 4 |
| `/correction_dictee/$id/absentsJour` | abonné | élève | `correction_dictee.html:8745` | 1 |
| `/correction_dictee/$id/autocorrection` | lu une fois | élève | `correction_dictee.html:10737` | 1 |
| `/correction_dictee/$id/autocorrection/$cle` | abonné, effacé (remove), fusionné (update), off(value) | élève | `correction_dictee.html:10880` | 4 |
| `/correction_dictee/$id/autocorrection/$cle/attempts` | écrit en entier (set) | élève | `correction_dictee.html:10849` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/direct` | écrit en entier (set) | élève | `correction_dictee.html:11013` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/errorRefs` | écrit en entier (set) | élève | `correction_dictee.html:10674` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/history` | lu une fois | élève | `correction_dictee.html:10907` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/history/$hk` | écrit en entier (set) | élève | `correction_dictee.html:10846` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/lastSeen` | écrit en entier (set) | élève | `correction_dictee.html:10762` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/questions/$i` | écrit en entier (set) | élève | `correction_dictee.html:11105` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/results` | écrit en entier (set) | élève | `correction_dictee.html:10848` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/score` | écrit en entier (set) | élève | `correction_dictee.html:10857` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/sessionDebut` | écrit en entier (set) | élève | `correction_dictee.html:10796` | 3 |
| `/correction_dictee/$id/autocorrection/$cle/solved` | écrit en entier (set) | élève | `correction_dictee.html:10858` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/status` | écrit en entier (set) | élève | `correction_dictee.html:10765` | 5 |
| `/correction_dictee/$id/autocorrection/$cle/styloFin` | écrit en entier (set) | élève | `correction_dictee.html:11050` | 1 |
| `/correction_dictee/$id/autocorrection/$cle/total` | écrit en entier (set) | élève | `correction_dictee.html:10673` | 1 |
| `/correction_dictee/$id/autocorrection/$idL` | fusionné (update), lu une fois | élève | `correction_dictee.html:8985` | 1 |
| `/correction_dictee/$id/binomes` | abonné | élève | `correction_dictee.html:8746` | 1 |
| `/correction_dictee/$id/config` | abonné, lu une fois | professeur, élève | `correction_dictee.html:2552` | 2 |
| `/correction_dictee/$id/config/peerHelp` | abonné | élève | `correction_dictee.html:8748` | 1 |
| `/correction_dictee/$id/config/published` | abonné, écrit en entier (set) | professeur, élève | `correction_dictee.html:3490` | 2 |
| `/correction_dictee/$id/copyPublishedAt` | abonné | élève | `correction_dictee.html:8742` | 1 |
| `/correction_dictee/$id/deconnexion` | abonné | élève | `correction_dictee.html:8756` | 1 |
| `/correction_dictee/$id/dictee/amenagee` | lu une fois | professeur | `correction_dictee.html:2552` | 1 |
| `/correction_dictee/$id/exercices` | lu une fois | élève | `correction_dictee.html:10718` | 1 |
| `/correction_dictee/$id/exercices_html` | lu une fois | élève | `correction_dictee.html:10718` | 1 |
| `/correction_dictee/$id/heure` | abonné | élève | `correction_dictee.html:8747` | 3 |
| `/correction_dictee/$id/migrations/reclassementC_v1` | lu une fois | professeur | `correction_dictee.html:2551` | 1 |
| `/correction_dictee/$id/results` | lu une fois | professeur | `correction_dictee.html:2552` | 1 |
| `/correction_dictee/$id/results/$cle` | abonné | élève | `correction_dictee.html:10661` | 1 |
| `/correction_dictee/$id_copie_$now` | écrit en entier (set) | professeur | `correction_dictee.html:8175` | 1 |
| `/correction_dictee/$titleInput-$classe` | lu une fois | professeur | `correction_dictee.html:3345` | 1 |
| `/correction_dictee/$titleInput-$classe/absents` | lu une fois | professeur | `correction_dictee.html:3339` | 1 |
| `/correction_dictee/$titleInput-$classe/config` | écrit en entier (set) | professeur | `correction_dictee.html:3336` | 1 |
| `/correction_dictee/$titleInput-$classe/results` | lu une fois | professeur | `correction_dictee.html:3338` | 1 |
| `/correction_dictee/+encodeURIComponent(dicteeId)+"&eleveKey="+encodeURIComponent(eleveKey)+"&screen=exercices/autocorrection/$cle` | lu une fois | élève | `correction_dictee.html:8034` | 1 |
| `/correction_dictee/+encodeURIComponent(dicteeId)+"&eleveKey="+encodeURIComponent(eleveKey)+"&screen=exercices/copyOptions` | abonné | élève | `correction_dictee.html:8045` | 1 |
| `/correction_dictee/+encodeURIComponent(dicteeId)+"&eleveKey="+encodeURIComponent(eleveKey)+"&screen=exercices/copyPublishedAt` | abonné | élève | `correction_dictee.html:8047` | 1 |
| `/correction_dictee/+encodeURIComponent(dicteeId)+"&eleveKey="+encodeURIComponent(eleveKey)+"&screen=exercices/exercices` | abonné | élève | `correction_dictee.html:8049` | 1 |
| `/correction_dictee/+encodeURIComponent(dicteeId)+"&eleveKey="+encodeURIComponent(eleveKey)+"&screen=exercices/exercices_html` | abonné | élève | `correction_dictee.html:8051` | 1 |
| `/correction_dictee/+encodeURIComponent(dicteeId)+"&screen=copie/autocorrection` | abonné | professeur | `correction_dictee.html:7605` | 1 |
| `/correction_dictee/+encodeURIComponent(dicteeId)+"&screen=copie/results/$selectedKey/bilanComment` | écrit en entier (set) | professeur | `correction_dictee.html:7639` | 1 |
| `/correction_dictee/+encodeURIComponent(dicteeId)+"&screen=copie/results/$selectedKey/errors` | écrit en entier (set) | professeur | `correction_dictee.html:7653` | 1 |
| `/correction_dictee/dictee_test_en_attente` | lu une fois | professeur | `correction_dictee.html:8314` | 1 |
| `/correction_dictee/dictee_test_rendue` | lu une fois | professeur | `correction_dictee.html:8346` | 1 |
| `/correction_dictee/fe_$?_$seq/results` | fusionné (update) | professeur | `correction_dictee.html:1554` | 1 |
| `/correction_dictee/p_$nom_$now/amenages` | lu une fois | professeur | `correction_dictee.html:4143` | 1 |
| `/correction_dictee/p_$nom_$now/autocorrection/$fautif \u2192 $word/errorRefs` | lu une fois, écrit en entier (set) | professeur | `correction_dictee.html:4161` | 1 |
| `/correction_dictee/p_$nom_$now/dictee/amenagee` | lu une fois | professeur | `correction_dictee.html:4144` | 1 |
| `/correction_dictee/p_$nom_$now/results` | fusionné (update), lu une fois | professeur | `correction_dictee.html:4143` | 3 |
| `/correction_dictee/toast-recalcul-l15g/config` | lu une fois | professeur | `correction_dictee.html:1746` | 1 |
| `/correction_dictee/toast-recalcul-l15g/dictee/amenagee` | lu une fois | professeur | `correction_dictee.html:1746` | 1 |
| `/correction_dictee/toast-recalcul-l15g/results` | lu une fois | professeur | `correction_dictee.html:1746` | 1 |

### `/correction_dictee_erreurs`
Fichiers : `correction_dictee.html` (4).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/correction_dictee_erreurs` | fusionné (update), lu une fois | professeur | `correction_dictee.html:1319` | 4 |

### `/correction_dictee_textes`
Fichiers : `correction_dictee.html` (11).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/correction_dictee_textes` | abonné, lu une fois, écrit en entier (set) | les deux, professeur | `correction_dictee.html:1361` | 7 |
| `/correction_dictee_textes/$tk/formesAcceptees/$i/$forme` | effacé (remove), écrit en entier (set) | élève | `correction_dictee.html:4919` | 2 |
| `/correction_dictee_textes/$tk/formesAcceptees/$idx/$forme` | effacé (remove), écrit en entier (set) | professeur | `correction_dictee.html:1383` | 2 |

### `/debat_config`
Fichiers : `pilotage_debat_s3.html` (20). **Nominatif** : routage élève → débat.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/debat_config/cours` | abonné | je ne sais pas | `pilotage_debat_s3.html:4635` | 1 |
| `/debat_config/cours/$TEST_DEBAT_CLASSE` | effacé (remove), écrit en entier (set) | professeur | `pilotage_debat_s3.html:2892` | 2 |
| `/debat_config/cours/$cl` | écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:4675` | 2 |
| `/debat_config/cours/$classe` | effacé (remove) | professeur | `pilotage_debat_s3.html:4691` | 1 |
| `/debat_config/cours/$cle` | effacé (remove), écrit en entier (set) | professeur | `pilotage_debat_s3.html:2950` | 4 |
| `/debat_config/profPassword` | écrit en entier (set) | je ne sais pas | `pilotage_debat_s3.html:4223` | 1 |
| `/debat_config/routage` | lu une fois | professeur | `pilotage_debat_s3.html:2888` | 3 |
| `/debat_config/routage/$TEST_DEBAT_CLASSE` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:2910` | 1 |
| `/debat_config/routage/$classe` | lu une fois, écrit en entier (set) | professeur, élève | `pilotage_debat_s3.html:3362` | 2 |
| `/debat_config/routage/$cle` | effacé (remove) | professeur | `pilotage_debat_s3.html:2889` | 2 |
| `/debat_config/routage/__t__` | effacé (remove) | professeur | `pilotage_debat_s3.html:3554` | 1 |

### `/debats`
Fichiers : `pilotage_debat_s3.html` (173), `index.html` (1). **Nominatif** : groupes, poules et matchs nominatifs, bilans.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/debats` | lu une fois | je ne sais pas, professeur, élève | `index.html:4460` | 5 |
| `/debats/$M5bis/active/classeEnCours` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4967` | 1 |
| `/debats/$M5bis/active/debat` | effacé (remove) | professeur | `pilotage_debat_s3.html:4965` | 1 |
| `/debats/$M5bis/active/debats/$slot` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4964` | 1 |
| `/debats/$M5bis/active/debats/$sousDebat/currentMatch` | effacé (remove), fusionné (update) | je ne sais pas, professeur | `pilotage_debat_s3.html:5022` | 12 |
| `/debats/$M5bis/active/debats/$sousDebat/currentMatch/durations` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:5087` | 1 |
| `/debats/$M5bis/active/debats/$sousDebat/grilleEcoute/$id` | effacé (remove) | professeur | `pilotage_debat_s3.html:5018` | 1 |
| `/debats/$M5bis/active/debats/$sousDebat/grilleEcoute/$id/$myBinomeId` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:5172` | 1 |
| `/debats/$M5bis/active/debats/$sousDebat/matches/$id` | effacé (remove) | professeur | `pilotage_debat_s3.html:5018` | 1 |
| `/debats/$M5bis/active/debats/$sousDebat/poules/$pid` | effacé (remove), écrit en entier (set) | professeur | `pilotage_debat_s3.html:5013` | 2 |
| `/debats/$M5bis/active/debats/$sousDebat/reactions` | effacé (remove), écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:5294` | 2 |
| `/debats/$M5bis/active/debats/$sousDebat/reactions/$cle` | transaction, écrit en entier (set) | je ne sais pas | `pilotage_debat_s3.html:5311` | 1 |
| `/debats/$M5bis/active/debats/$sousDebat/reveal` | effacé (remove), écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:5293` | 2 |
| `/debats/$M5bis/config` | lu une fois | professeur | `pilotage_debat_s3.html:4935` | 1 |
| `/debats/$_blank/active` | lu une fois | élève | `pilotage_debat_s3.html:3378` | 1 |
| `/debats/$_blank/active/binomes/$binomeId` | écrit en entier (set) | élève | `pilotage_debat_s3.html:3263` | 1 |
| `/debats/$_blank/active/classe` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:3065` | 1 |
| `/debats/$_blank/active/classeEnCours` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:3066` | 1 |
| `/debats/$_blank/config` | lu une fois | professeur, élève | `pilotage_debat_s3.html:3110` | 2 |
| `/debats/$debat` | lu une fois, écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:6681` | 2 |
| `/debats/$debat/active` | abonné, effacé (remove), lu une fois, off(value), écrit en entier (set) | je ne sais pas, professeur, élève | `pilotage_debat_s3.html:3423` | 11 |
| `/debats/$debat/active/attente/$_attenteMoi` | effacé (remove) | je ne sais pas | `pilotage_debat_s3.html:4568` | 1 |
| `/debats/$debat/active/attente/$cle` | effacé (remove) | professeur | `pilotage_debat_s3.html:4616` | 1 |
| `/debats/$debat/active/attente/$el` | écrit en entier (set) | je ne sais pas | `pilotage_debat_s3.html:4558` | 1 |
| `/debats/$debat/active/binomes` | effacé (remove), fusionné (update), lu une fois, écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:3995` | 4 |
| `/debats/$debat/active/binomes/$bid/blocked` | effacé (remove), écrit en entier (set) | professeur | `pilotage_debat_s3.html:4070` | 2 |
| `/debats/$debat/active/binomes/$bid/names` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4612` | 1 |
| `/debats/$debat/active/binomes/$binomeId` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4197` | 1 |
| `/debats/$debat/active/binomes/$editingId/blocked` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4066` | 1 |
| `/debats/$debat/active/binomes/$editingId/names` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4017` | 1 |
| `/debats/$debat/active/binomes/$id/tokens` | écrit en entier (set) | élève | `pilotage_debat_s3.html:4263` | 1 |
| `/debats/$debat/active/binomes/$myBinomeId` | fusionné (update) | je ne sais pas | `pilotage_debat_s3.html:4382` | 1 |
| `/debats/$debat/active/binomes/$myBinomeId/away` | effacé (remove), écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:3637` | 2 |
| `/debats/$debat/active/binomes/$myBinomeId/reformulations/$cle` | écrit en entier (set) | je ne sais pas | `pilotage_debat_s3.html:4470` | 1 |
| `/debats/$debat/active/binomes/$tr` | effacé (remove), fusionné (update) | professeur, élève | `pilotage_debat_s3.html:3975` | 2 |
| `/debats/$debat/active/binomes/$tr/pendingValidation/$i` | écrit en entier (set) | professeur, élève | `pilotage_debat_s3.html:3941` | 3 |
| `/debats/$debat/active/binomes/$tr/statuses/$i` | écrit en entier (set) | professeur, élève | `pilotage_debat_s3.html:3938` | 4 |
| `/debats/$debat/active/binomes/$uid` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4614` | 1 |
| `/debats/$debat/active/debats` | effacé (remove) | professeur | `pilotage_debat_s3.html:4245` | 1 |
| `/debats/$debat/active/debats/$sousDebat` | fusionné (update), écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:4538` | 8 |
| `/debats/$debat/active/debats/$sousDebat/bracket` | effacé (remove), écrit en entier (set) | professeur | `pilotage_debat_s3.html:6041` | 5 |
| `/debats/$debat/active/debats/$sousDebat/bracket/rounds` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:6299` | 1 |
| `/debats/$debat/active/debats/$sousDebat/commentMod/$id` | effacé (remove) | professeur | `pilotage_debat_s3.html:4031` | 1 |
| `/debats/$debat/active/debats/$sousDebat/commentMod/$mid/$sid/$camp` | effacé (remove), écrit en entier (set) | professeur | `pilotage_debat_s3.html:6768` | 2 |
| `/debats/$debat/active/debats/$sousDebat/currentMatch` | effacé (remove), fusionné (update), écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:4036` | 12 |
| `/debats/$debat/active/debats/$sousDebat/grilleEcoute/$id` | effacé (remove) | professeur | `pilotage_debat_s3.html:4031` | 3 |
| `/debats/$debat/active/debats/$sousDebat/matches` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:6211` | 1 |
| `/debats/$debat/active/debats/$sousDebat/matches/$id` | effacé (remove), écrit en entier (set) | professeur | `pilotage_debat_s3.html:4031` | 4 |
| `/debats/$debat/active/debats/$sousDebat/poules` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:6209` | 1 |
| `/debats/$debat/active/debats/$sousDebat/poules/$cle/binomes` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:6087` | 1 |
| `/debats/$debat/active/debats/$sousDebat/poules/$cle/matches` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:6088` | 1 |
| `/debats/$debat/active/debats/$sousDebat/poules/$pid` | effacé (remove) | professeur | `pilotage_debat_s3.html:6093` | 1 |
| `/debats/$debat/active/debats/$sousDebat/poules/$pid/binomes` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4026` | 2 |
| `/debats/$debat/active/debats/$sousDebat/poules/$pid/matches` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:4030` | 2 |
| `/debats/$debat/active/debats/$sousDebat/poules/$pouleId/matches` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:5412` | 1 |
| `/debats/$debat/active/debats/$sousDebat/rebalances/$rid` | effacé (remove) | professeur | `pilotage_debat_s3.html:6215` | 1 |
| `/debats/$debat/active/debats/$sousDebat/rebalances/reb_$now` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:6078` | 1 |
| `/debats/$debat/active/debats/$sousDebat/scores` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:5406` | 2 |
| `/debats/$debat/active/debats/$sousDebat/scores/$bid` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:6092` | 1 |
| `/debats/$debat/active/debats/$sousDebat/scores/$tr` | effacé (remove) | professeur | `pilotage_debat_s3.html:4034` | 1 |
| `/debats/$debat/active/debats/$sousDebat/swiss` | fusionné (update) | professeur | `pilotage_debat_s3.html:6252` | 1 |
| `/debats/$debat/active/debats/$sousDebat/tournament` | fusionné (update), écrit en entier (set) | professeur | `pilotage_debat_s3.html:6042` | 9 |
| `/debats/$debat/active/groupsLocked` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:3442` | 6 |
| `/debats/$debat/active/logoutEpoch` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:3447` | 1 |
| `/debats/$debat/archives` | lu une fois | professeur | `pilotage_debat_s3.html:4823` | 1 |
| `/debats/$debat/archives/$active_$now` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:3627` | 1 |
| `/debats/$debat/archives/$cle` | lu une fois | professeur | `pilotage_debat_s3.html:4842` | 1 |
| `/debats/$debat/config` | fusionné (update), lu une fois | professeur | `pilotage_debat_s3.html:3564` | 4 |
| `/debats/$debat/documents` | effacé (remove), lu une fois, écrit en entier (set) | je ne sais pas, professeur | `pilotage_debat_s3.html:2773` | 4 |
| `/debats/$debat/tournamentArchives` | lu une fois | je ne sais pas | `pilotage_debat_s3.html:6386` | 1 |
| `/debats/$debat/tournamentArchives/$code/$ts` | effacé (remove) | professeur | `pilotage_debat_s3.html:6435` | 1 |
| `/debats/$debat/tournamentArchives/$code/$ts_$uid` | écrit en entier (set) | je ne sais pas | `pilotage_debat_s3.html:6381` | 1 |
| `/debats/$i/active/classe` | lu une fois | élève | `pilotage_debat_s3.html:3367` | 1 |
| `/debats/$id` | effacé (remove), lu une fois | professeur | `pilotage_debat_s3.html:2884` | 3 |
| `/debats/$niveau-$slice/active` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:3576` | 1 |
| `/debats/$niveau-$slice/config` | lu une fois, écrit en entier (set) | professeur | `pilotage_debat_s3.html:3573` | 2 |
| `/debats/$val/config` | lu une fois | élève | `pilotage_debat_s3.html:3363` | 1 |
| `/debats/_test-debat-s3` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:2903` | 1 |
| `/debats/_test-debat-s3/active/binomes` | fusionné (update) | professeur | `pilotage_debat_s3.html:3008` | 1 |
| `/debats/_test-debat-s3/config/modeGroupes` | écrit en entier (set) | professeur | `pilotage_debat_s3.html:3000` | 1 |

### `/dictee_settings`
Fichiers : `correction_dictee.html` (3).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/dictee_settings/$piece` | lu une fois (GET), écrit en entier (PUT) | je ne sais pas | `correction_dictee.html:9168` | 2 |
| `/dictee_settings/promptFormat` | lu une fois | je ne sais pas | `correction_dictee.html:10209` | 1 |

### `/dictee_universelle_prompts`
Fichiers : `dictee_universelle.html` (2).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/dictee_universelle_prompts/analyse/$piece` | lu une fois (GET) | je ne sais pas | `dictee_universelle.html:1165` | 1 |
| `/dictee_universelle_prompts/analyse/directives` | écrit en entier (PUT) | je ne sais pas | `dictee_universelle.html:1168` | 1 |

### `/dictee_universelle_textes`
Fichiers : `dictee_universelle.html` (3).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/dictee_universelle_textes` | abonné, lu une fois, écrit en entier (set) | les deux, professeur | `dictee_universelle.html:3426` | 3 |

### `/dictees`
Fichiers : `dictee_universelle.html` (127), `index.html` (1). **Nominatif** : copies (results, drafts), corrections croisées, contestations, codes par élève.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/dictees` | lu une fois | professeur, élève | `index.html:4457` | 5 |
| `/dictees/$button/codes` | abonné, effacé (remove) | les deux | `dictee_universelle.html:1396` | 1 |
| `/dictees/$button/config` | lu une fois | les deux | `dictee_universelle.html:1426` | 1 |
| `/dictees/$button/contestLock` | abonné, effacé (remove) | les deux | `dictee_universelle.html:1396` | 1 |
| `/dictees/$button/contestations` | abonné, effacé (remove) | les deux | `dictee_universelle.html:1396` | 1 |
| `/dictees/$button/distribution` | abonné, effacé (remove) | les deux | `dictee_universelle.html:1396` | 1 |
| `/dictees/$button/drafts` | abonné, effacé (remove) | les deux | `dictee_universelle.html:1396` | 1 |
| `/dictees/$button/drafts/$corrKey` | effacé (remove), écrit en entier (set) | professeur | `dictee_universelle.html:7167` | 2 |
| `/dictees/$button/locks` | abonné, effacé (remove) | les deux | `dictee_universelle.html:1396` | 1 |
| `/dictees/$button/locks/$corrKey` | effacé (remove), écrit en entier (set) | professeur | `dictee_universelle.html:7166` | 2 |
| `/dictees/$button/locks/$identite_$id` | lu une fois, écrit en entier (set) | élève | `dictee_universelle.html:3907` | 2 |
| `/dictees/$button/results` | abonné, effacé (remove) | les deux | `dictee_universelle.html:1396` | 1 |
| `/dictees/$button/results/$ck` | fusionné (update), lu une fois | professeur | `dictee_universelle.html:9925` | 4 |
| `/dictees/$button/results/$cle` | fusionné (update), écrit en entier (set) | les deux, professeur | `dictee_universelle.html:1154` | 5 |
| `/dictees/$button/results/$corrKey` | fusionné (update), lu une fois | professeur, élève | `dictee_universelle.html:3348` | 9 |
| `/dictees/$button/results/$elKey` | fusionné (update), écrit en entier (set) | professeur | `dictee_universelle.html:7168` | 2 |
| `/dictees/$button/results/$eleve` | effacé (remove), fusionné (update), lu une fois | je ne sais pas, professeur, élève | `dictee_universelle.html:3331` | 18 |
| `/dictees/$dictee` | lu une fois | professeur | `dictee_universelle.html:8063` | 1 |
| `/dictees/$dictee/absents` | abonné, écrit en entier (set) | les deux, professeur | `dictee_universelle.html:3785` | 2 |
| `/dictees/$dictee/autocorrect` | effacé (remove) | professeur | `dictee_universelle.html:7035` | 4 |
| `/dictees/$dictee/autocorrect/$eleve` | effacé (remove), lu une fois, écrit en entier (set) | je ne sais pas | `dictee_universelle.html:4038` | 2 |
| `/dictees/$dictee/codes` | (op. hors ligne : URL bâtie puis envoyée par un relais) | je ne sais pas | `dictee_universelle.html:4036` | 1 |
| `/dictees/$dictee/codes/$cle` | effacé (remove) | professeur | `dictee_universelle.html:10462` | 1 |
| `/dictees/$dictee/codes/$eleve` | effacé (remove), lu une fois, écrit en entier (set) | je ne sais pas, professeur | `dictee_universelle.html:4143` | 3 |
| `/dictees/$dictee/config` | écrit en entier (set) | professeur | `dictee_universelle.html:8077` | 1 |
| `/dictees/$dictee/config/live` | abonné, fusionné (update) | les deux, professeur | `dictee_universelle.html:3801` | 4 |
| `/dictees/$dictee/config/transcriptionMode` | abonné, écrit en entier (set) | professeur | `dictee_universelle.html:8169` | 4 |
| `/dictees/$dictee/contestLock` | abonné | je ne sais pas | `dictee_universelle.html:4035` | 1 |
| `/dictees/$dictee/contestations` | abonné | je ne sais pas | `dictee_universelle.html:4034` | 1 |
| `/dictees/$dictee/contestations/$cKey` | fusionné (update) | professeur | `dictee_universelle.html:9853` | 3 |
| `/dictees/$dictee/contestations/$eleve_W$word` | écrit en entier (set) | professeur | `dictee_universelle.html:4137` | 1 |
| `/dictees/$dictee/contestations/_W$g_$pr` | écrit en entier (set) | professeur | `dictee_universelle.html:7304` | 1 |
| `/dictees/$dictee/correction` | effacé (remove) | professeur | `dictee_universelle.html:7035` | 4 |
| `/dictees/$dictee/correction/$corrKey` | écrit en entier (set) | élève | `dictee_universelle.html:3344` | 1 |
| `/dictees/$dictee/distribution` | abonné, écrit en entier (set) | professeur, élève | `dictee_universelle.html:2751` | 2 |
| `/dictees/$dictee/distribution/confirmed/$corrName` | écrit en entier (set) | élève | `dictee_universelle.html:2826` | 1 |
| `/dictees/$dictee/distribution/wave` | écrit en entier (set) | professeur | `dictee_universelle.html:2858` | 1 |
| `/dictees/$dictee/drafts/$corrKey` | effacé (remove) | élève | `dictee_universelle.html:3364` | 1 |
| `/dictees/$dictee/drafts/$eleve` | effacé (remove) | je ne sais pas | `dictee_universelle.html:4317` | 1 |
| `/dictees/$dictee/locks/$corrKey` | effacé (remove) | élève | `dictee_universelle.html:3362` | 1 |
| `/dictees/$dictee/locks/$eleve` | effacé (remove) | je ne sais pas | `dictee_universelle.html:4316` | 1 |
| `/dictees/$dictee/locks/$name` | effacé (remove) | professeur | `dictee_universelle.html:10506` | 1 |
| `/dictees/$dictee/results` | écrit en entier (set) | professeur | `dictee_universelle.html:8068` | 1 |
| `/dictees/$id` | effacé (remove) | professeur | `dictee_universelle.html:4830` | 1 |
| `/dictees/$id/config` | fusionné (update), lu une fois | professeur | `dictee_universelle.html:4560` | 2 |
| `/dictees/$id/drafts` | lu une fois | professeur | `dictee_universelle.html:4819` | 1 |
| `/dictees/$id/results` | lu une fois | professeur | `dictee_universelle.html:4818` | 1 |
| `/dictees/_test_flux_$seed` | (op. hors ligne : URL bâtie puis envoyée par un relais) | professeur | `dictee_universelle.html:6484` | 1 |
| `/dictees/_test_flux_$seed/codes` | lu une fois | professeur | `dictee_universelle.html:6511` | 1 |
| `/dictees/_test_flux_$seed/codes/$e` | écrit en entier (set) | professeur | `dictee_universelle.html:6508` | 1 |
| `/dictees/_test_flux_$seed/config` | lu une fois, écrit en entier (set) | professeur | `dictee_universelle.html:6490` | 2 |
| `/dictees/_test_flux_$seed/contestations` | lu une fois | professeur | `dictee_universelle.html:6714` | 1 |
| `/dictees/_test_flux_$seed/contestations/_t_$ce_0` | fusionné (update), lu une fois, écrit en entier (set) | professeur | `dictee_universelle.html:6675` | 4 |
| `/dictees/_test_flux_$seed/contestations/_t_$ce_1` | fusionné (update), lu une fois, écrit en entier (set) | professeur | `dictee_universelle.html:6692` | 3 |
| `/dictees/_test_flux_$seed/distribution` | lu une fois, écrit en entier (set) | professeur | `dictee_universelle.html:6515` | 2 |
| `/dictees/_test_flux_$seed/distribution/confirmed/$c` | écrit en entier (set) | professeur | `dictee_universelle.html:6517` | 1 |
| `/dictees/_test_flux_$seed/results` | lu une fois | professeur | `dictee_universelle.html:6607` | 3 |
| `/dictees/_test_flux_$seed/results/$eleve` | fusionné (update) | professeur | `dictee_universelle.html:6656` | 1 |
| `/dictees/_test_flux_$seed/results/$pr` | écrit en entier (set) | professeur | `dictee_universelle.html:6598` | 1 |

### `/eleves`
Fichiers : `index.html` (1).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/eleves/$randomUUID` | écrit en entier (PUT) | élève | `index.html:5016` | 1 |

### `/eleves_index`
Fichiers : `index.html` (2). **Nominatif** : index des élèves par prénom.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/eleves_index/$prenom` | lu une fois (GET), écrit en entier (PUT) | élève | `index.html:5007` | 2 |

### `/intent`
Fichiers : `index.html` (2). **Nominatif** : réponses d'élèves à l'enquête d'intention.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/intent/$uuid/$ts` | écrit en entier (PUT) | élève | `index.html:5153` | 2 |

### `/manifestes`
Fichiers : `index.html` (8), `dictee_universelle.html` (2), `mjpc-core.js` (1), `analyse_logique.html` (1), `applause_meter.html` (1), `correction_dictee.html` (1), `evaluation-qcm.html` (1), `pilotage_debat_s3.html` (1), `redaction.html` (1), `reecriture.html` (1), `reecriture_bb4e.html` (1), `worktrack.html` (1).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/manifestes` | lu une fois (GET) | je ne sais pas, professeur | `index.html:8141` | 4 |
| `/manifestes/$id` | lu une fois, lu une fois (GET), écrit en entier (PUT), écrit en entier (set) | je ne sais pas, les deux | `index.html:3003` | 15 |
| `/manifestes/$id/$entryId` | fusionné (update) | les deux | `dictee_universelle.html:2393` | 1 |

### `/mjpcProfils`
Fichiers : `applause_meter.html` (2), `pilotage_debat_s3.html` (1). **Nominatif** : profils d'élèves.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/mjpcProfils/$classe/$idn/lectures` | lu une fois | élève | `applause_meter.html:5217` | 1 |
| `/mjpcProfils/$classe/$reader/lectures/$passageId` | fusionné (update) | professeur | `applause_meter.html:3387` | 1 |
| `/mjpcProfils/$nm` | effacé (remove) | professeur | `pilotage_debat_s3.html:2891` | 1 |

### `/pilotage_prompts`
Fichiers : `pilotage_debat_s3.html` (2).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/pilotage_prompts/documents/$piece` | lu une fois (GET) | je ne sais pas | `pilotage_debat_s3.html:6714` | 1 |
| `/pilotage_prompts/documents/directives` | écrit en entier (PUT) | je ne sais pas | `pilotage_debat_s3.html:6717` | 1 |

### `/plan_de_travail`
Fichiers : `worktrack.html` (11), `index.html` (1). **Nominatif** : progression par élève.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/plan_de_travail/$default/$pfx$pfx$pfx$pfx$?` | abonné, lu une fois, écrit en entier (set) | les deux | `worktrack.html:4730` | 3 |
| `/plan_de_travail/actifs` | (op. hors ligne : URL bâtie puis envoyée par un relais) | professeur | `worktrack.html:4877` | 1 |
| `/plan_de_travail/actifs/$niv` | écrit en entier (set) | professeur | `worktrack.html:4878` | 1 |
| `/plan_de_travail/chapitres` | (op. hors ligne : URL bâtie puis envoyée par un relais) | professeur | `index.html:4463` | 1 |
| `/plan_de_travail/chapitres$cle` | (op. hors ligne : URL bâtie puis envoyée par un relais) | professeur | `worktrack.html:4868` | 1 |
| `/plan_de_travail/config` | lu une fois | les deux | `worktrack.html:4761` | 1 |
| `/plan_de_travail/default/$fam/$ch` | lu une fois | professeur | `worktrack.html:6988` | 1 |
| `/plan_de_travail/default/$fam/$ch/$remove` | effacé (remove) | professeur | `worktrack.html:6989` | 1 |
| `/plan_de_travail/traces/acces_prof` | ajouté (push) | professeur | `worktrack.html:7399` | 2 |

### `/presence`
Fichiers : `analyse_logique.html` (3), `worktrack.html` (3), `index.html` (2), `dictee_universelle.html` (2). **Nominatif** : présence en ligne, clé = identité de l'élève.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/presence/$cle` | écrit en entier (PUT) | élève | `index.html:5041` | 2 |
| `/presence/$e2_$id` | effacé (remove) | professeur | `analyse_logique.html:3718` | 1 |
| `/presence/$identite_$id` | écrit en entier (set) | élève | `analyse_logique.html:2390` | 2 |
| `/presence/$identite_$id/sorties` | (op. hors ligne : URL bâtie puis envoyée par un relais) | élève | `analyse_logique.html:2396` | 2 |
| `/presence/$name_$id/sorties` | (op. hors ligne : URL bâtie puis envoyée par un relais) | élève | `worktrack.html:4844` | 1 |
| `/presence/$nom_$id` | écrit en entier (set) | élève | `worktrack.html:4835` | 1 |
| `/presence/$remove_worktrack` | effacé (remove) | professeur | `worktrack.html:6985` | 1 |

### `/qcm`
Fichiers : `evaluation-qcm.html` (68), `index.html` (2). **Nominatif** : sessions, réponses, lectures par élève (eleveSlug).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/qcm` | fusionné (update), lu une fois | les deux, professeur | `evaluation-qcm.html:3715` | 4 |
| `/qcm/$c` | abonné | je ne sais pas | `evaluation-qcm.html:12452` | 1 |
| `/qcm/$chemin` | abonné, écrit en entier (set) | je ne sais pas, professeur | `evaluation-qcm.html:12451` | 3 |
| `/qcm/classes/$c/eleves` | écrit en entier (set) | professeur | `evaluation-qcm.html:16078` | 1 |
| `/qcm/classes/_test_evaluation-qcm` | écrit en entier (set) | professeur | `evaluation-qcm.html:6790` | 2 |
| `/qcm/codes/$cle` | écrit en entier (set) | professeur | `evaluation-qcm.html:6806` | 1 |
| `/qcm/codes/$n` | écrit en entier (set) | professeur | `evaluation-qcm.html:6796` | 1 |
| `/qcm/corbeille/$cle` | écrit en entier (set) | professeur | `evaluation-qcm.html:12559` | 2 |
| `/qcm/corbeille/qcm-$tout-$now` | écrit en entier (set) | professeur | `evaluation-qcm.html:12551` | 1 |
| `/qcm/corbeille/qcm-tout-$ts` | écrit en entier (set) | professeur | `evaluation-qcm.html:16073` | 2 |
| `/qcm/eleveSexes` | lu une fois (GET) | professeur | `index.html:5849` | 1 |
| `/qcm/evaluations` | (op. hors ligne : URL bâtie puis envoyée par un relais) | professeur | `index.html:4459` | 1 |
| `/qcm/evaluations/_test_evaluation-qcm` | lu une fois | professeur | `evaluation-qcm.html:6791` | 1 |
| `/qcm/presence/$cl/$x` | onDisconnect, écrit en entier (set) | élève | `evaluation-qcm.html:4510` | 1 |
| `/qcm/presence/$split/$split` | effacé (remove) | élève | `evaluation-qcm.html:4509` | 1 |
| `/qcm/qcm` | écrit en entier (set) | professeur | `evaluation-qcm.html:16077` | 2 |
| `/qcm/qcm/$cle` | écrit en entier (set) | professeur | `evaluation-qcm.html:12559` | 1 |
| `/qcm/qcm/evaluations/$vide` | écrit en entier (set) | je ne sais pas | `evaluation-qcm.html:12888` | 1 |
| `/qcm/qcm/evaluations/_test_evaluation-qcm` | écrit en entier (set) | professeur | `evaluation-qcm.html:6793` | 2 |
| `/qcm/qcm/evaluations/_test_evaluation-qcm/questions/0/bonnes` | écrit en entier (set) | professeur | `evaluation-qcm.html:6901` | 1 |
| `/qcm/qcm/evaluations/demo` | écrit en entier (set) | je ne sais pas | `evaluation-qcm.html:12535` | 1 |
| `/qcm/qcm/evaluations/eval_$now` | écrit en entier (set) | professeur | `evaluation-qcm.html:12890` | 1 |
| `/qcm/qcm/presence/_test_evaluation-qcm` | écrit en entier (set) | professeur | `evaluation-qcm.html:6805` | 1 |
| `/qcm/qcm/sessionActive/$c` | écrit en entier (set) | je ne sais pas | `evaluation-qcm.html:16098` | 1 |
| `/qcm/qcm/sessionActive/_test_evaluation-qcm` | écrit en entier (set) | professeur | `evaluation-qcm.html:6805` | 1 |
| `/qcm/qcm/sessions/$id` | fusionné (update) | je ne sais pas | `evaluation-qcm.html:6869` | 4 |
| `/qcm/qcm/sessions/$id/autonomie/$slug` | écrit en entier (set) | je ne sais pas | `evaluation-qcm.html:15749` | 2 |
| `/qcm/qcm/sessions/$id/b/$bPour/$slug` | écrit en entier (set) | je ne sais pas | `evaluation-qcm.html:6879` | 1 |
| `/qcm/qcm/sessions/$id/bilans/$slug` | écrit en entier (set) | professeur | `evaluation-qcm.html:15827` | 2 |
| `/qcm/qcm/sessions/$id/feuillesTest/$bPour/$slug` | écrit en entier (set) | je ne sais pas | `evaluation-qcm.html:6877` | 1 |
| `/qcm/qcm/sessions/$id/feuillesTest/$qf/$x` | écrit en entier (set) | je ne sais pas | `evaluation-qcm.html:6965` | 1 |
| `/qcm/qcm/sessions/$id/feuillesTest/$qi/$x` | écrit en entier (set) | professeur | `evaluation-qcm.html:6833` | 1 |
| `/qcm/qcm/sessions/$id/papier/$eleveParam/$q` | écrit en entier (set) | professeur | `evaluation-qcm.html:16203` | 1 |
| `/qcm/qcm/sessions/$id/publiee` | écrit en entier (set) | professeur | `evaluation-qcm.html:15616` | 1 |
| `/qcm/qcm/sessions/$s/evalSnapshot` | écrit en entier (set) | je ne sais pas, professeur | `evaluation-qcm.html:12886` | 2 |
| `/qcm/qcm/sessions/$sid` | écrit en entier (set) | professeur | `evaluation-qcm.html:6804` | 1 |
| `/qcm/qcm/sessions/$sid/copies` | écrit en entier (set) | professeur | `evaluation-qcm.html:15618` | 1 |
| `/qcm/qcm/sessions/$sid/copies/masquees` | écrit en entier (set) | professeur | `evaluation-qcm.html:15619` | 1 |
| `/qcm/qcm/sessions/$sid/deroule/depuis` | écrit en entier (set) | professeur | `evaluation-qcm.html:6905` | 1 |
| `/qcm/qcm/settings/durees` | écrit en entier (set) | professeur | `evaluation-qcm.html:13223` | 1 |
| `/qcm/qcm/settings/maitrise` | écrit en entier (set) | je ne sais pas | `evaluation-qcm.html:13241` | 1 |
| `/qcm/qcm/settings/promptCreation` | écrit en entier (set) | professeur | `evaluation-qcm.html:13331` | 1 |
| `/qcm/qcm/textes/$cle` | écrit en entier (set) | professeur | `evaluation-qcm.html:13258` | 1 |
| `/qcm/qrScans/$nonce` | abonné, effacé (remove) | professeur | `evaluation-qcm.html:13619` | 1 |
| `/qcm/qrScans/$qr` | écrit en entier (set) | élève | `evaluation-qcm.html:17178` | 1 |
| `/qcm/sessionActive` | lu une fois | je ne sais pas | `evaluation-qcm.html:16096` | 1 |
| `/qcm/sessions` | lu une fois | je ne sais pas, professeur | `evaluation-qcm.html:6802` | 2 |
| `/qcm/sessions/$id/consoleVue` | écrit en entier (set) | élève | `evaluation-qcm.html:17192` | 1 |
| `/qcm/sessions/$sid/deroule` | lu une fois, transaction | les deux, professeur | `evaluation-qcm.html:4658` | 2 |
| `/qcm/sessions/$sid/lastDisconnect` | onDisconnect, écrit en entier (set) | élève | `evaluation-qcm.html:17188` | 1 |
| `/qcm/settings/promptIa` | lu une fois (GET), écrit en entier (PUT) | je ne sais pas | `evaluation-qcm.html:3453` | 2 |

### `/redactions`
Fichiers : `index.html` (1). **Nominatif** : copies de rédaction par élève.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/redactions` | (op. hors ligne : URL bâtie puis envoyée par un relais) | professeur | `index.html:4464` | 1 |

### `/reecriture_bb4e`
Fichiers : `reecriture_bb4e.html` (26). **Nominatif** : réponses et autocorrections par élève (brevet blanc).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/reecriture_bb4e` | lu une fois | professeur, élève | `reecriture_bb4e.html:859` | 3 |
| `/reecriture_bb4e/$currentId/absents/$eleve` | effacé (remove), écrit en entier (set) | professeur | `reecriture_bb4e.html:959` | 2 |
| `/reecriture_bb4e/$currentId/autocorrection` | abonné | professeur | `reecriture_bb4e.html:893` | 1 |
| `/reecriture_bb4e/$currentId/notesFictives` | écrit en entier (set) | professeur | `reecriture_bb4e.html:959` | 1 |
| `/reecriture_bb4e/$currentId/notesFictives/$eleve` | effacé (remove), écrit en entier (set) | professeur | `reecriture_bb4e.html:902` | 2 |
| `/reecriture_bb4e/$id/autocorrection/$cle` | fusionné (update), lu une fois | élève | `reecriture_bb4e.html:1683` | 2 |
| `/reecriture_bb4e/$id/autocorrection/$cle/bilanAnswers` | écrit en entier (set) | élève | `reecriture_bb4e.html:1859` | 1 |
| `/reecriture_bb4e/$id/autocorrection/$cle/bilanStep` | écrit en entier (set) | élève | `reecriture_bb4e.html:1859` | 1 |
| `/reecriture_bb4e/$id/autocorrection/$cle/edits` | écrit en entier (set) | élève | `reecriture_bb4e.html:1718` | 1 |
| `/reecriture_bb4e/$id/autocorrection/$cle/lastSeen` | écrit en entier (set) | élève | `reecriture_bb4e.html:1664` | 1 |
| `/reecriture_bb4e/$id/autocorrection/$cle/status` | écrit en entier (set) | élève | `reecriture_bb4e.html:1664` | 2 |
| `/reecriture_bb4e/$id/config/title` | écrit en entier (set) | professeur | `reecriture_bb4e.html:926` | 1 |
| `/reecriture_bb4e/$id/notesFictives/$cle` | lu une fois | élève | `reecriture_bb4e.html:1675` | 1 |
| `/reecriture_bb4e/$id/notesFictives/meney_monsieur` | écrit en entier (set) | élève | `reecriture_bb4e.html:1677` | 1 |
| `/reecriture_bb4e/$reeId` | lu une fois, écrit en entier (set) | professeur | `reecriture_bb4e.html:1021` | 2 |
| `/reecriture_bb4e/$reeId/autocorrection/$eleve` | effacé (remove) | professeur | `reecriture_bb4e.html:1158` | 1 |
| `/reecriture_bb4e/$reeId/config` | abonné | élève | `reecriture_bb4e.html:1586` | 1 |
| `/reecriture_bb4e/bb4e-$classe` | lu une fois | professeur | `reecriture_bb4e.html:879` | 1 |
| `/reecriture_bb4e/bb4e-$classe/config` | écrit en entier (set) | professeur | `reecriture_bb4e.html:870` | 1 |

### `/reecritures`
Fichiers : `reecriture.html` (33), `index.html` (1). **Nominatif** : réponses et autocorrections par élève.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/reecritures` | lu une fois | professeur, élève | `index.html:4458` | 3 |
| `/reecritures/$classe` | lu une fois | professeur | `reecriture.html:1450` | 2 |
| `/reecritures/$classe/config` | fusionné (update) | professeur | `reecriture.html:1440` | 1 |
| `/reecritures/$currentId/absents` | abonné | professeur | `reecriture.html:1605` | 1 |
| `/reecritures/$currentId/absents/$eleve` | effacé (remove), écrit en entier (set) | professeur | `reecriture.html:1980` | 2 |
| `/reecritures/$currentId/config/pieges` | écrit en entier (set) | professeur | `reecriture.html:1587` | 2 |
| `/reecritures/$currentId/corrections` | abonné, effacé (remove) | professeur | `reecriture.html:1596` | 2 |
| `/reecritures/$currentId/corrections/$eleve` | effacé (remove), fusionné (update) | professeur | `reecriture.html:1512` | 2 |
| `/reecritures/$currentId/corrections/$sek` | effacé (remove), écrit en entier (set) | professeur | `reecriture.html:2124` | 2 |
| `/reecritures/$currentId/corrections/$tek` | écrit en entier (set) | professeur | `reecriture.html:2123` | 2 |
| `/reecritures/$currentId/paquetOrder` | écrit en entier (set) | professeur | `reecriture.html:2017` | 1 |
| `/reecritures/$currentId/presence` | abonné | professeur | `reecriture.html:1614` | 1 |
| `/reecritures/$id/config` | lu une fois | professeur | `reecriture.html:1472` | 1 |
| `/reecritures/$id/corrections/$cle` | abonné | élève | `reecriture.html:3657` | 1 |
| `/reecritures/$id/corrections/$cle/autoCorrection` | écrit en entier (set) | élève | `reecriture.html:3897` | 1 |
| `/reecritures/$id/corrections/$cle/autoCorrection/bilan` | écrit en entier (set) | élève | `reecriture.html:3871` | 1 |
| `/reecritures/$id/presence/$cle` | écrit en entier (set) | élève | `reecriture.html:3670` | 1 |
| `/reecritures/$reecritureId` | fusionné (update), lu une fois | professeur | `reecriture.html:939` | 3 |
| `/reecritures/$reecritureId/$cle` | effacé (remove), écrit en entier (set) | professeur | `reecriture.html:973` | 2 |
| `/reecritures/$reecritureId/snapshots` | lu une fois | professeur | `reecriture.html:2261` | 1 |
| `/reecritures/$reecritureId/snapshots/$id` | effacé (remove) | professeur | `reecriture.html:2288` | 1 |
| `/reecritures/$reecritureId/snapshots/snap_$ts` | lu une fois | professeur | `reecriture.html:962` | 1 |

### `/site`
Fichiers : `index.html` (155), `correction_dictee.html` (12), `analyse_logique.html` (3), `dictee_universelle.html` (3), `reecriture.html` (3), `reecriture_bb4e.html` (3), `applause_meter.html` (2), `evaluation-qcm.html` (2), `pilotage_debat_s3.html` (2), `redaction.html` (2), `worktrack.html` (2). **Nominatif** : sous-nœuds nominatifs : edt (l'appel = absences), deroule_joue (participation), atelier/envois.

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/site/$n/chapitres` | lu une fois (GET) | professeur | `index.html:26920` | 1 |
| `/site/$niveau` | lu une fois (GET) | je ne sais pas, professeur | `index.html:3589` | 3 |
| `/site/$niveau/chapitres` | effacé (DELETE), lu une fois (GET) | je ne sais pas, professeur | `index.html:11335` | 5 |
| `/site/$niveau/chapitres/$_cleNeuve` | écrit en entier (PUT) | je ne sais pas | `index.html:9299` | 1 |
| `/site/$niveau/chapitres/$chKey` | lu une fois (GET) | je ne sais pas | `index.html:9414` | 1 |
| `/site/$niveau/chapitres/$chKey/uid` | écrit en entier (PUT) | je ne sais pas | `index.html:9416` | 1 |
| `/site/$niveau/chapitres/$chapitre` | effacé (DELETE), écrit en entier (PUT) | professeur | `index.html:4094` | 2 |
| `/site/$niveau/chapitres/$chapitre/$_stat` | écrit en entier (PUT) | professeur | `index.html:14049` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$j/$_stat` | écrit en entier (PUT) | professeur | `index.html:14069` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$j/items/$cle` | effacé (DELETE) | professeur | `index.html:12598` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$j/items/$cle/$_stat` | écrit en entier (PUT) | professeur | `index.html:14092` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$j/retoucheLe` | écrit en entier (PUT) | professeur | `index.html:14079` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$jc/items/$cle-$i` | écrit en entier (PUT) | professeur | `index.html:12595` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$nums$?` | écrit en entier (PUT) | professeur | `index.html:4041` | 3 |
| `/site/$niveau/chapitres/$chapitre/seances/$rang` | écrit en entier (PUT) | professeur | `index.html:14132` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance` | effacé (DELETE) | professeur | `index.html:4153` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule` | lu une fois (GET), écrit en entier (PUT) | les deux, professeur | `index.html:17524` | 3 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule/$nm` | écrit en entier (PUT) | professeur | `index.html:17371` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule/ecrans/$q` | écrit en entier (PUT) | professeur | `index.html:17369` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule/maj` | écrit en entier (PUT) | professeur | `index.html:17372` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule_joue/$classe` | écrit en entier (PUT) | professeur | `index.html:15970` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule_joue/$classe/classe` | écrit en entier (PUT) | professeur | `index.html:15978` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule_joue/$classe/demarreLe` | écrit en entier (PUT) | professeur | `index.html:15977` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule_joue/$classe/ecrans` | écrit en entier (PUT) | professeur | `index.html:15976` | 3 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule_joue/$classe/etat` | écrit en entier (PUT) | professeur | `index.html:19629` | 2 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule_joue/$classe/heures/$heure` | fusionné (PATCH) | professeur | `index.html:21207` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule_joue/$classe/journal` | écrit en entier (PUT) | professeur | `index.html:20593` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/deroule_joue/$classe/scene` | écrit en entier (PUT) | professeur | `index.html:22152` | 4 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$item/$cle` | écrit en entier (PUT) | professeur | `index.html:4667` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$item/autonomie` | écrit en entier (PUT) | élève | `index.html:5336` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$item/kind` | écrit en entier (PUT) | professeur | `index.html:4571` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$item/produit` | écrit en entier (PUT) | professeur | `index.html:8034` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$item/ref` | écrit en entier (PUT) | professeur | `index.html:4568` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$item/remplace` | écrit en entier (PUT) | professeur | `index.html:4574` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$item/source` | écrit en entier (PUT) | professeur | `index.html:4567` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$l/kind` | écrit en entier (PUT) | professeur | `index.html:13956` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$l/ref` | écrit en entier (PUT) | professeur | `index.html:13954` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$l/remplace` | écrit en entier (PUT) | professeur | `index.html:13957` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$l/source` | écrit en entier (PUT) | professeur | `index.html:13955` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$substring-$i` | effacé (DELETE), écrit en entier (PUT) | je ne sais pas, professeur | `index.html:4064` | 3 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$substring-$i/images/img$ordres$?-$slice` | effacé (DELETE) | professeur | `index.html:4751` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/items/$substring-$i/images/img$ordres$?-$slice/titre` | écrit en entier (PUT) | professeur | `index.html:4726` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$seance/noteEleve` | écrit en entier (PUT) | professeur | `index.html:3864` | 1 |
| `/site/$niveau/chapitres/$chapitre/seances/$t/deroule/reactivation` | écrit en entier (PUT) | professeur | `index.html:21625` | 1 |
| `/site/$niveau/chapitres/$idx` | écrit en entier (PUT) | je ne sais pas | `index.html:9318` | 1 |
| `/site/$niveau/chapitres/$maxK` | écrit en entier (PUT) | professeur | `index.html:14291` | 1 |
| `/site/$niveau/chapitres/$nums$?` | écrit en entier (PUT) | professeur | `index.html:4014` | 1 |
| `/site/$niveau/published_extras` | écrit en entier (PUT) | professeur | `index.html:7659` | 1 |
| `/site/$niveau/published_tabs` | écrit en entier (PUT) | professeur | `index.html:7650` | 1 |
| `/site/analyses` | abonné, fusionné (update), lu une fois, écrit en entier (PUT) | les deux, professeur | `correction_dictee.html:2532` | 4 |
| `/site/analyses/categories/$id` | fusionné (update) | professeur | `correction_dictee.html:3830` | 1 |
| `/site/analyses/homophones/hom-$a-$b` | écrit en entier (set) | professeur | `correction_dictee.html:3839` | 1 |
| `/site/annonces` | lu une fois, lu une fois (GET), écrit en entier (PUT) | je ne sais pas, les deux, professeur | `index.html:2079` | 8 |
| `/site/atelier/config/messageEnvoiDefaut` | lu une fois (GET), écrit en entier (PUT) | professeur | `index.html:11709` | 2 |
| `/site/atelier/documents` | lu une fois (GET) | professeur | `index.html:10833` | 1 |
| `/site/atelier/documents/$cadre` | écrit en entier (PUT) | je ne sais pas | `index.html:13558` | 1 |
| `/site/atelier/documents/$checked` | lu une fois (GET), écrit en entier (PUT) | je ne sais pas | `index.html:9459` | 2 |
| `/site/atelier/documents/$docId` | écrit en entier (PUT) | professeur | `index.html:11168` | 2 |
| `/site/atelier/documents/$docId/depot` | écrit en entier (PUT) | professeur | `index.html:13993` | 1 |
| `/site/atelier/documents/$docId/rattachement` | écrit en entier (PUT) | professeur | `index.html:14001` | 1 |
| `/site/atelier/documents/$id/produit` | écrit en entier (PUT) | professeur | `index.html:7987` | 1 |
| `/site/atelier/documents/$ref` | lu une fois (GET) | je ne sais pas | `index.html:11522` | 1 |
| `/site/atelier/documents/feuille_$now` | effacé (DELETE), écrit en entier (PUT) | professeur | `index.html:11088` | 4 |
| `/site/atelier/envois/$_docId` | lu une fois (GET) | professeur | `index.html:11739` | 1 |
| `/site/atelier/envois/$docId` | lu une fois (GET), écrit en entier (PUT) | professeur | `index.html:11790` | 2 |
| `/site/atelier/envois/$ref` | lu une fois (GET) | je ne sais pas | `index.html:11508` | 1 |
| `/site/atelier/envois/feuille_$now` | effacé (DELETE), lu une fois (GET) | professeur | `index.html:11128` | 2 |
| `/site/atelier/envois/feuille_$now/doc` | lu une fois (GET) | professeur | `index.html:11057` | 1 |
| `/site/atelier/prompts/$produit` | lu une fois (GET), écrit en entier (PUT) | professeur | `index.html:8152` | 3 |
| `/site/atelier/prompts_archives/$produit` | lu une fois (GET) | professeur | `index.html:8686` | 1 |
| `/site/atelier/prompts_archives/$produit/$ts` | écrit en entier (PUT) | professeur | `index.html:8679` | 1 |
| `/site/baremes` | abonné | professeur | `correction_dictee.html:1741` | 1 |
| `/site/baremes/$id` | écrit en entier (set) | professeur | `correction_dictee.html:1765` | 1 |
| `/site/baremes/p_$nom_$now` | écrit en entier (set) | professeur | `correction_dictee.html:3997` | 1 |
| `/site/cle_vue` | écrit en entier (PUT) | professeur | `index.html:18149` | 1 |
| `/site/config/brevetDates` | effacé (DELETE), lu une fois (GET), écrit en entier (PUT) | professeur | `index.html:1966` | 4 |
| `/site/config/brevetDates/$champ` | écrit en entier (PUT) | professeur | `index.html:26203` | 1 |
| `/site/config/brevetDates/$edtCh` | écrit en entier (PUT) | professeur | `index.html:26278` | 1 |
| `/site/config/brevetDates/$niv` | écrit en entier (PUT) | professeur | `index.html:26284` | 1 |
| `/site/config/brevetDates/debutAnnee` | lu une fois (GET) | professeur | `index.html:26114` | 1 |
| `/site/config/brevetDates/finAnnee` | lu une fois (GET) | professeur | `index.html:26118` | 1 |
| `/site/config/coffreAppareils` | lu une fois (GET) | professeur | `index.html:14974` | 1 |
| `/site/config/coffreAppareils/$secuIdAppareil` | écrit en entier (PUT) | professeur | `index.html:14970` | 1 |
| `/site/config/coffreAppareils/$secuIdAppareil/oublie_le` | écrit en entier (PUT) | professeur | `index.html:14963` | 1 |
| `/site/config/coffreCanari` | lu une fois (GET), écrit en entier (PUT) | je ne sais pas, professeur | `index.html:14885` | 12 |
| `/site/config/dernierControleRegles` | lu une fois (GET), écrit en entier (PUT) | professeur | `index.html:2011` | 4 |
| `/site/config/profEmpreintes` | lu une fois (GET), écrit en entier (PUT) | professeur, élève | `index.html:4937` | 18 |
| `/site/cours_actif` | abonné (EventSource), lu une fois (GET), écrit en entier (PUT) | professeur | `index.html:24899` | 6 |
| `/site/edt/$objet/$annee` | lu une fois (GET), écrit en entier (PUT) | je ne sais pas, professeur | `index.html:6179` | 4 |
| `/site/horloge` | effacé (DELETE), écrit en entier (PUT) | professeur | `index.html:20934` | 2 |
| `/site/libelles/onglets` | lu une fois (GET) | professeur | `index.html:2810` | 1 |
| `/site/libelles/onglets/$tabId` | écrit en entier (PUT) | professeur | `index.html:2816` | 1 |
| `/site/repetition/ecrans` | écrit en entier (PUT) | professeur | `index.html:19792` | 1 |
| `/site/repetition/pointeur` | abonné (EventSource), écrit en entier (PUT) | professeur, tableau | `index.html:19790` | 3 |
| `/site/repetition/scene` | écrit en entier (PUT) | professeur, tableau | `index.html:19790` | 3 |
| `/site/tableau_test$sous` | écrit en entier (PUT) | tableau | `index.html:22172` | 1 |
| `/site/tableau_test/ecrans` | lu une fois (GET) | professeur | `index.html:23995` | 1 |
| `/site/tableau_test/pointeur` | abonné (EventSource), lu une fois (GET) | professeur, tableau | `index.html:22209` | 3 |
| `/site/tableau_test/vif` | lu une fois (GET) | professeur | `index.html:23995` | 1 |
| `/site/textes/seanceSansDoc` | lu une fois (GET), écrit en entier (PUT) | professeur | `index.html:1903` | 2 |

### `/students`
Fichiers : `dictee_universelle.html` (1).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/students/$eleve/errors` | fusionné (update), lu une fois, requête:orderByChild("dicteeId")+equalTo, écrit en entier (set) | les deux | `dictee_universelle.html:2352` | 1 |

### `/students_sim`
Fichiers : `dictee_universelle.html` (1).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/students_sim/$e/errors` | effacé (remove) | professeur | `dictee_universelle.html:7676` | 1 |

### `/taxonomie`
Fichiers : `index.html` (4), `correction_dictee.html` (4).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/taxonomie` | lu une fois (GET) | les deux, professeur | `index.html:2304` | 3 |
| `/taxonomie/$sousChemin` | écrit en entier (PUT) | professeur | `index.html:2328` | 1 |
| `/taxonomie/alias/tables/correction_dictee` | lu une fois | les deux, professeur | `correction_dictee.html:3727` | 2 |
| `/taxonomie/domaines` | abonné, lu une fois | les deux | `correction_dictee.html:295` | 2 |

### `/worktrack_prompts`
Fichiers : `worktrack.html` (2).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/worktrack_prompts/chapitre/$piece` | lu une fois (GET) | je ne sais pas | `worktrack.html:7875` | 1 |
| `/worktrack_prompts/chapitre/directives` | écrit en entier (PUT) | je ne sais pas | `worktrack.html:7881` | 1 |

### `/worktrack_textes`
Fichiers : `worktrack.html` (2).

| gabarit | opérations | qui | exemple | endroits |
|---|---|---|---|---|
| `/worktrack_textes` | abonné | les deux | `worktrack.html:4823` | 1 |
| `/worktrack_textes/$cle` | écrit en entier (set) | professeur | `worktrack.html:9268` | 1 |

## 6 · SITES NON RÉSOLUS (116, chemin passé en paramètre ou bâti hors ligne)
- `correction_dictee.html` (9) : lignes 4292, 8258, 11116, 11117, 11121, 11146, 11285, 2364, 2367
- `dictee_universelle.html` (5) : lignes 9046, 9696, 4829, 7048, 7076
- `evaluation-qcm.html` (1) : lignes 16061
- `index.html` (83) : lignes 3733, 3734, 4093, 4312, 4313, 4469, 5331, 6323, 6588, 6588, 7250, 7401, 7401, 17522, 23999, 24899, 24899, 24899, 28377, 28388, 4151, 4168, 4253, 4291, 5948, 6627, 6629, 6783, 6836, 7123, 8560, 8681, 9311, 9345, 11122, 14155, 14778, 15885, 15990, 16839, 20695, 20696, 20697, 20702, 20743, 20743, 20743, 20744, 20871, 20871, 21519, 21542, 21565, 21565, 21587, 21667, 21839, 21840, 21862, 21862, 21864, 22478, 22526, 22792, 23039, 23636, 23659, 23938, 23984, 24101, 24146, 24158, 24169, 24170, 24225, 24233, 24241, 24903, 24904, 25556, 25569, 25577, 28376
- `pilotage_debat_s3.html` (3) : lignes 1507, 6684, 6698
- `redaction.html` (8) : lignes 1356, 2372, 2994, 3058, 7872, 8792, 9100, 10486
- `reecriture.html` (2) : lignes 906, 909
- `reecriture_bb4e.html` (5) : lignes 2036, 2036, 2064, 776, 779

## 7 · SITES DE RELAIS (109 : la fonction reçoit le chemin de son appelant, compté ailleurs)
`analyse_logique.html` 12, `applause_meter.html` 11, `correction_dictee.html` 9, `dictee_universelle.html` 10, `evaluation-qcm.html` 11, `index.html` 27, `mjpc-core.js` 5, `pilotage_debat_s3.html` 6, `redaction.html` 6, `reecriture.html` 3, `reecriture_bb4e.html` 3, `worktrack.html` 6
