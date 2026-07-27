# M14 — CADRAGE · `applause_meter.html`, la passe

`[exécutant M14]` · 27/07/2026 · **PROVISOIRE (pt 21)** — rien n'est réputé fini tant que Paul ne l'a pas déclaré. **Je ne promeus jamais.** Aucune ligne de code ne sera écrite avant le feu vert de la conscience.

---

## 0. CE QUI A ÉTÉ LU, ET CE QUI NE L'A PAS ÉTÉ

Lectures GitHub **authentifiées**, taille + md5 vérifiés pour chacune (aucun fichier de ~279 o reçu, aucun `raw.githubusercontent.com`) :

| Document | Taille | md5 | Lu |
|---|---|---|---|
| `docs/MJPC6-1-DISPOSITIF.md` | 112 108 o | `ced6a0213f377b55a6a2731305a4329e` | intégralement |
| `docs/MJPC6-2-DOCTRINE.md` | 71 039 o | `a34f6f58fab1452663684426a633b783` | intégralement (16bis à L110) |
| `docs/MJPC6-3-CHANTIER.md` | 97 868 o | `fe539e8fae99bf8a5acdc4a58b4461ad` | intégralement |
| `docs/MJPC6-doctrine-du-site.md` | 52 277 o | `0a323d23e215adde73b763836acd71f6` | I à XII + XIII.1→1ter ; **XIII.2→XIII.8 non lus** (composantes du gabarit, hors périmètre M14) |
| `docs/MJPC6-journal.md` | 68 519 o | `443ec9eb87fc618ac180818fc86e87f5` | entrées 21/07 → 27/07 |
| `docs/MJPC6-registre-bugs.md` | 26 585 o | `a37622d3d916d30476712d20521019d9` | §9quinquies + transversaux |
| `docs/MJPC6-0-INDEX.md`, `-memo-paul.md`, `-bloc-diagnostic.md`, `-restauration.md` | — | — | intégralement |

**Conversations exécutantes lues** (outil de recherche) : M13 (`worktrack`), LOT-COUTURES, M11 (`analyse_logique`), M8. **Limite déclarée honnêtement** : l'outil rend des extraits, pas les fils entiers ; j'ai les patrons de code, les preuves exigées et les reproches, mais pas le déroulé tour par tour de M11.

---

## 1. LA BASE — REVÉRIFIÉE AVANT TOUTE LIGNE

| Mesure | Valeur | Attendu au prompt |
|---|---|---|
| Taille | **565 216 o** | 565 216 o ✅ |
| md5 | **`11a8971573b6e27bdde8722fc726f5ec`** | idem ✅ |
| Lignes | **3 944** | 3 944 ✅ |
| Socle | **MJPC-CORE 1.0.0** (L1047, `MJPC_CORE_VERSION="1.0.0"` L1205) | 1.0.0 ✅ |
| Commit courant | `650aa0ec7b9f` (2026-07-14T10:44:40Z) | — |

*Le registre-bugs annonce « ~3 474 lignes » (§9quinquies) : valeur périmée, le fichier en porte 3 944. Correction à porter au registre.*

**Socle 1.1.0 de référence récupéré** pour la comparaison bit à bit : `mjpc-core.js`, **10 887 o, md5 `1b106b4082ee5b44154027c5a0a6552c`, 196 lignes**, `MJPC_CORE_VERSION="1.1.0"`. Son unique apport est le **§8 « Session partagée MJPC »** (`lireSessionMJPC`, `validerEleveMJPC`) — conforme au constat de la doctrine du site (L206) : « 1.0.0 » ne veut pas dire *app à risque* mais *app n'ayant pas encore reçu le bypass*.

**Architecture du fichier** — 6 blocs `<script>` : L659-690 React 18.2.0 (vendorisé) · L691-958 React-DOM · L959-967 firebase-app-compat · L968-970 firebase-database-compat 0.14.4 · L972-977 `initializeApp` · L979-1778 socle + constantes + helpers + aide · L1779-3942 application (accueil, panneau prof, vue tableau, tablette élève, vote, bilan, QR, routeur).

---

## 2. LE DANGER N°1 — MESURÉ, ET IL N'EST PAS CELUI QU'ON CRAIGNAIT

### 2.1 La question posée par le prompt : l'app écrit-elle dans `/codes` ou `/classes` réels ?

**Relevé exhaustif des écritures** (`.set|.update|.remove|.push|.transaction` sur `db.ref`, hors blocs vendorisés) : **132 occurrences**. Toutes visent `applaudimetre/*`, **sauf trois** :

| Ligne | Cible | Appelée par |
|---|---|---|
| L1134 | `classes/<nom>` (transaction du socle `ecrireClasse`) | L1807 (`lancerTest`, avec `TEST_SLUG`) et L2607 (`OngletClasses.creer`, classe réelle voulue par Paul) |
| L3876 | `classes/_test_applause_meter`.remove() | `quitterTest` |
| L1195 | `manifestes/applause_meter` | `publierManifeste` |

> **VERDICT : `/codes` n'est JAMAIS écrit — zéro occurrence.** L'app ne lit même pas `/codes`. **Le mécanisme exact qui a détruit les codes de 7 élèves via le bac à sable du QCM (écriture par élève dans `/codes` sous clé `sanMJPC`, puis suppression à la purge) n'existe pas dans cette app.** L'écriture de test dans `/classes` est confinée à la clé `_test_applause_meter` (L1292 : `TEST_SLUG = classeTestId()`, convention du socle) et passe par la transaction **non destructive** du socle.

**Preuve au hub** (GET seuls) : `/classes` porte **8 clés** — `3E Charles de Gaulle` (29), `4E BANKSY` (29), `4E PYTHAGORE` (28), `5e HERGÉ` (31), `6e_saint_michel` (0), `CLASSE TEST` (4), `_TEST` (30), `_test_pilotage_debat_s3` (6). **Aucun `_test_applause_meter`** : la purge de sortie a bien fait son travail sur ce point précis. `/codes` : **122 entrées**.

### 2.2 Le danger RÉEL, qui est ailleurs et que le prompt ne visait pas

Les 24 noms de `TEST_ELEVES` (L1434-1441) produisent les **vraies clés `sanMJPC`** — `san` est l'alias direct du socle (L1572 : `var san = sanMJPC;`). Et l'app **indexe ses propres nœuds par ces clés** :

| Nœud | Ligne | Écriture |
|---|---|---|
| `applaudimetre/compteurLectures/<slug>` | L2218 | `transaction(v => (v||0)+1)` — le **compteur d'équité** du lecteur |
| `applaudimetre/file/<slug>` | L1968, L3541, L3547 | inscription en file d'attente |
| `applaudimetre/historiqueLectures/<pid>.lecteur` | L3551, L2211 | nom complet du lecteur |
| `applaudimetre/tablettes/<t>.occupants[].slug` | L3218 | occupants de la tablette |

**Or `quitterTest` (L3875-3882) ne purge que** `classes/_test_applause_meter`, `live`, `compliments`, `liveSnapshot`, et remet `session` à plat. **Ne sont PAS purgés** : `compteurLectures`, `file`, `historiqueLectures`, `seances`, `votes`, `tablettes`, `qrScans`.

Conséquence mesurable : une séance de test jouée avec « AUDEBERT Élise » incrémente durablement `compteurLectures/audebert_elise`, c'est-à-dire **le compteur d'équité de la vraie élève**, qui pilote l'avertissement de L1966 (« a déjà lu N fois — c'est plus que l'écart autorisé »). Et l'écosystème traite déjà ces nœuds comme des empreintes nominatives : `index.html` (production, 393 791 o, md5 `c09a8bff758ed368b22c4e24c245be46`) scanne `applaudimetre/historiqueLectures.lecteur` (L3826) et `applaudimetre/compteurLectures/<s>/<k>` (L3827-3829) pour construire l'empreinte élève et la purger nommément. **Un slug de test y serait indistinguable d'un élève réel.**

**Preuve que le sinistre n'a pas encore eu lieu** : au hub, `applaudimetre/compteurLectures`, `file`, `live`, `liveSnapshot`, `tablettes`, `votes`, `compliments` sont **tous ABSENTS**. Le nœud ne porte que `classes`, `historiqueLectures`, `qrScans`, `seances`, `session`.

### 2.3 Ce que je propose (à valider)

Remplacer les 24 noms par les **six fictifs canoniques gravés le 22/07** — BERNARD Emma, DUPONT Marie, LEROY Hugo, MARTIN Lucas, MOREAU Léa, PETIT Thomas — et **prouver au rapport** que leurs six clés `sanMJPC` sont absentes des 122 `/codes` et des 8 rosters de `/classes` (contrôle sur la CLÉ, jamais sur l'orthographe). Voir **Q2** : six élèves suffisent-ils à éprouver une mécanique conçue pour 14 tables ?

---

## 3. ÉTAT MESURÉ, POINT PAR POINT DE LA GRILLE

Un point non mesuré est un point manquant : chaque ligne porte sa mesure ou la mention explicite « non mesuré ».

| Pt | Objet | État mesuré | Verdict |
|---|---|---|---|
| **1** | Accueil d'instances (liste + badges + création) | Les séances existent (`applaudimetre/seances/<sessionId>`, `demarrerSeance` L2051, `terminerSeance` L2071, liste + export JSON L2109 + récap imprimable L2125 + suppression L2099). Pas de « panneau de départ » cloné de la souche : l'accueil (L1800) est un menu à 4 boutons (prof / tableau / élève / mode test). | ~ partiel |
| **2** | Navigation deux niveaux | **UN seul niveau** : 3 onglets `pilot` / `classes` / `reglages` (L1850-1857, libellés « 🎛️ Pilotage », « 👥 Classes », « 🎚️ Réglages »). Aucun sous-onglet, ni « Préparation », ni « Données ». « ? » présent via `HelpFab` (L1862). | ✘ |
| **3** | Charte de la souche | **EXCEPTION DÉCLARÉE** (décision du 15/07, DISPOSITIF L226 et CHANTIER L232) : charte propre conservée. Variables locales L11-24 (`--turquoise`, `--bar-bas`…). **Je n'y touche pas.** | ✅ hors périmètre |
| **4** | Préparation = édition complète d'une instance | Absente comme sous-onglet. L'édition d'une séance en cours passe par Pilotage ; **une séance archivée ne se renomme pas** (aucun geste de modification trouvé). | ✘ |
| **5** | Réglages présent | Oui, `OngletReglages` L2633 : barres, minuteur, critères (2-6), seuils, compliments, messages timides, bornes, lecture spontanée. Riche. | ✅ |
| **6** | ⓘ partout | **55 appels `ifo(`** + **77 `title:`**. Le mieux doté de l'écosystème sur ce point. | ✅ |
| **7** | Connexion élève code MJPC + nom + prénom, shunt §8 | `FormConnexion` L3115 : NOM + Prénom comparés au roster de `/classes` par clé `san` (L3123-3127), **aucun code**, **aucune liste de prénoms exposée**. Shunt §8 : **ABSENT** (0 occurrence de `lireSessionMJPC`, `validerEleveMJPC`, `mjpc_eleve`, `is_prof`). Prof : `CodeGate` L3842, `PROF_CODES=["3141","1312"]` déjà extraits en constante (L1044), `sessionStorage.am_auth`. | ✘ shunt · voir **Q1** |
| **8** | Travaux antérieurs de l'élève | **Absent** : aucun « Mes lectures ». L'élève ne consulte rien après la séance. | ✘ voir **Q8** |
| **9** | Branchement au site (genre d'item + modale) | **DÉJÀ FAIT côté site par M12** : genre `applaudimetre` (`index.html` L2358), sélecteur alimenté par `applaudimetre/seances.json` (L2683), ouverture `openViewer('applause_meter.html?n=<niveau>')` (L2423). **Mais l'app ignore `?n=`** : son routeur ne lit que `mode` et `view` (L3868-3874). Sans conséquence de sécurité ; la classe n'est simplement pas pré-sélectionnée. | ~ côté app |
| **10** | Annonces : le « ? » lit le canal central | **Absent** : `HelpModal`/`HelpFab` (L1658+) sont 100 % locaux, aucune lecture de `site/annonces`. | ✘ |
| **11** | Manifeste / purge à jour | `MJPC_APP` L1209, `MJPC_MANIFESTE` L1214, `MJPC_PURGE` L1218-1229 : 12 chemins purgés, `applaudimetre/session/reglages` préservé, `applaudimetre/classes` (résidu d'avant mutualisation) couvert. `publierManifeste(db)` appelé à l'entrée du panneau prof (L1837). **À mettre à jour si des nœuds naissent dans cette passe.** | ✅ à maintenir |
| **12** | Fondement pédagogique documenté | Non trouvé dans le fichier ; note d'app inexistante. | ✘ (chantier Fondements) |
| **13 / 13bis** | Concordance | `MJPC_MANIFESTE.notions: []` avec commentaire « rattachement : Phase 3 (Concordance) » (L1216). Les 4 critères de lecture orale (L1235-1240) ne pointent aucune notion ni compétence. | ✘ déclaré non codé (M19) |
| **14** | Wording élève sans jargon | Relevé des textes élève fait (35 chaînes, §5) : **aucun mot de la liste interdite** (figé, nœud, slug, payload, cache, manifeste, purge, hub, push, ID). | ✅ |
| **14bis** | Intégrité du comptage | `median` (L1320), `compterVotants` (L1328), agrégation de la courbe et des checkpoints. **Bug ouvert au registre : « le tableau n'atteint jamais 100 % » (différé, non résolu).** Non mesuré à l'exécution — pas de banc. | ~ à instruire |
| **15** | Universalisation | Les critères, compliments, messages timides, seuils, bornes vivent déjà dans `applaudimetre/session/reglages` (éditables en Réglages) — conforme. Les 24 noms de test sont le seul contenu réel en dur. | ✅ |
| **16 / 16bis** | Mode test | Entrée : **un clic** (L1825 « ⚙️ Mode test » → `lancerTest` L1801). Badge « MODE TEST ACTIF » sur l'accueil (L1815) et bouton « ⏏ Quitter le test » dans l'en-tête prof (L1848). Incarnation : l'écran élève réel est atteignable (vrais composants). **MAIS** : ① purge **non exhaustive** (§2.2) ; ② purge **sans vérification des erreurs** — `remove()`/`update()` lancés sans `Promise.allSettled`, aucun retour examiné (défaut de fond relevé le 22/07) ; ③ nettoyage des zombies partiel et **à l'entrée seulement**, pas au montage ; ④ l'état test vit dans un `useState` React (L3865) — **perdu à tout rechargement**, non propagé aux autres onglets ni à la modale du site, aucune pastille persistante en base ; ⑤ le jeu de test ne couvre pas tous les états (aucun passage annulé, aucun échec, aucune absence de vote). | ✘ à reprendre |
| **17** | Mobile 390 px, écrans PROF compris | **UN seul bloc `@media` dans tout le CSS** : `@media(max-width:600px)` (L159). Aucune règle ≤480 px. Le panneau prof, le tableau de bord des séances et l'onglet Réglages (le plus dense) n'ont **aucune règle tactile dédiée**. Rendu non mesuré (pas de navigateur à ce stade du cadrage) — **sera capturé aux deux tailles au rapport, écrans prof compris**. | ✘ |
| **18** | Pastille de version + anti-cache | **Aucune version d'app** : 0 occurrence de `APP_VERSION`, 0 pastille (le seul numéro du fichier est `MJPC_CORE_VERSION`). **Aucune méta anti-cache** : le `<head>` ne porte que `charset` (L4) et `viewport` (L5). | ✘ voir **Q4** |
| **19** | Aucun piège assumé | **P3 du registre CONFIRMÉ PRÉSENT** : `window.onerror` peignant un bandeau rouge plein écran avec la trace de pile (bloc ouvert L992, commentaire « À retirer une fois le bug Cannot read 'slice' localisé ») **et** `ErrorBoundary` React couvrant toute l'app (L3903-3941, monté L3941). **Sur un vidéoprojecteur, devant une classe.** | ✘ voir **Q3** |
| **20** | Qualité et structure | Table des matières en tête de bloc (L980-989, L1780-1797), sections nommées par séparateurs, `PROF_CODES` extraits en constante, `renderPhase` cité comme patron par le DISPOSITIF (L313). Les paliers de refactor du 4 juin (`useApplauseLive`, `OP_HeaderClasse`, `EV_PhaseLive`) **ne sont pas dans la production** — constat confirmé, non bloquant (CHANTIER L324). | ✅ |
| **21** | Mention provisoire | Portée par ce document et par le rapport à venir. | ✅ |
| **22** | Présence hub | **ABSENTE** : 0 `presence`, 0 `heartbeat`, 0 `sendBeacon` dans le code applicatif. Le nœud `/presence` existe au hub (écrit par le site). | ✘ |
| **23a** | Bloc DIAGNOSTIC | **ABSENT** : 0 occurrence. | ✘ |
| **23b** | Bilan HTML autonome de l'élève | `recapSeance` (L2125) produit un HTML imprimable **de séance, pour le professeur** (`@media print` L2167). Pas de bilan par élève à serrure de code. Le point 23b est un **chantier à part entière** (DOCTRINE L50 : « jamais à glisser dans une passe ») — **hors périmètre M14**. | hors périmètre |
| **24** | Alerte règles Firebase | Point propre à `index.html`. `FbBanner` (L3894) détecte une config non renseignée : autre chose, et légitime. | hors périmètre |
| **25 / 25bis** | Textes vrais ET compréhensibles | Relevé complet §5. Deux textes **violent le principe cardinal**. Aucun texte contredit le flux réel par ailleurs. | ✘ 2 textes |
| **26** | Textes élève éditables | **Aucun dictionnaire** : 0 `TEXTES_DEFAUT`, 0 fonction `txt()`. Les 35 chaînes élève sont en dur. *(À noter : compliments, messages timides et intitulés de critères — les textes les plus vus par l'élève — sont **déjà** éditables via `session/reglages`. Le manque porte sur les messages d'état et de refus.)* | ✘ partiel |
| **27** | Tokenisation | **L'app n'en contient aucune** — pas de découpage de texte, donc rien à protéger et surtout **rien à réimplémenter**. Le registre de 16 fonctions (DISPOSITIF L258) ne cite pas cette app : confirmé. | ✅ sans objet |
| **28** | « L'app, c'est moi » | Les textes élève parlent du professeur **à la 3e personne** (« Le professeur n'a pas encore… », « par le prof »). | ✘ |
| **Cardinal** | Jamais le professeur mis en cause | **L3203** : « Le professeur n'a pas encore choisi la classe. Patiente… » — exactement l'occurrence relevée au DISPOSITIF L217. **L3211** : « En attente du démarrage de la séance par le prof. » — non relevée jusqu'ici, même famille. | ✘ 2 occurrences |
| **D** | Vendorisation | **0 CDN externe** : zéro `src="http`, zéro `href="http`, zéro `@import` distant. React 18.2.0, React-DOM et Firebase 8/9-compat 0.14.4 sont embarqués. **Le prompt annonçait 0 : confirmé, rien à faire.** | ✅ |
| **F** | Gestes de base du professeur | **Créer** : classes (L2602, écriture non destructive du socle), séances (L2051), critères / compliments / messages (Réglages). **Supprimer** : classe → **renvoi vers MJPC** (L2612, socle §6 : conforme) ; séance → **SUPPRESSION SÈCHE** (L2099-2107 : `historiqueLectures/<pid>`.remove() × N puis `seances/<sId>`.remove(), avec dénombrement chiffré et `confirm` natif, **mais aucune archive, aucune corbeille**) ; critère (L2706), compliment (L2744), message (L2823), entrée de file (L2524) → suppressions sèches. **Modifier** une séance archivée : impossible. **Dupliquer** : nulle part. **0 occurrence de `corbeille` dans tout le fichier.** | ✘ |
| **G** | Regard mobile sur les écrans PROF | Non mesuré à l'écran à ce stade ; le CSS ne porte aucune règle sous 480 px (pt 17). Captures aux deux tailles, **écrans professeur compris**, au rapport. | à produire |

---

## 4. ÉTAT DU HUB — INSPECTÉ (GET SEULS, POINT 31 DU 22/07)

Racine : `analyse_logique`, `applaudimetre`, `classes`, `classes_amenages`, `codes`, `corbeille`, `correction_dictee`, `debat_config`, `debats`, `dictees`, `eleves`, `eleves_index`, `manifestes`, `mjpcProfils`, `plan_de_travail`, `presence`, `qcm`, `reecriture_bb4e`, `reecritures`, `site`, `taxonomie`.

**`/classes` — 8 clés, 3 zombies** : `CLASSE TEST` (4 élèves), `_TEST` (30), `_test_pilotage_debat_s3` (6). Déjà consignés au journal M13 ; **hors périmètre M14**, rappelés ici parce qu'une séance archivée de l'applaudimètre en dépend (voir ci-dessous). `6e_saint_michel` porte **0 élève** avec `niveau:'6e'`. `/codes` : 122 entrées.

**`/applaudimetre`** — 5 sous-nœuds : `classes`, `historiqueLectures`, `qrScans`, `seances`, `session`. Absents : `compteurLectures`, `file`, `live`, `liveSnapshot`, `tablettes`, `votes`, `compliments`.
- `applaudimetre/classes` : **2 classes résiduelles d'avant la mutualisation** (`4e-banksy` et une autre, avec rosters complets) — nœud orphelin déjà nommé au registre L129, couvert par `MJPC_PURGE`, mais **doublon vivant des rosters de `/classes`**.
- `applaudimetre/qrScans` : 5 entrées horodatées (résidus du pilotage mobile).
- `applaudimetre/session` : propre (`classeSlug:""`, `reader:""`), avec ses `reglages` complets.

**Analyse des archives de séances réelles (niveau 4bis de la procédure Y)** — 3 séances, 30 passages :

| Séance | Classe | Passages | Terminée |
|---|---|---|---|
| `s_20260604_090728` | `4E PYTHAGORE` | 15 | oui |
| `s_20260604_111033` | `4E BANKSY` | 14 | oui |
| `s_20260611_070640` | `CLASSE TEST` | 1 | oui |

Confrontation aux bugs du registre, **sur les données** :
- **5 passages sans lecteur** (`p_1780557399310`, `p_1780557500605`, `p_1780557810511`, `p_1780558085461`, `p_1780559296089`) — le registre en annonçait 4. **Les passages fantômes existent toujours, et ils sont cinq.**
- **`critereIdx` n'est PLUS bloqué à 0** : distribution mesurée sur les 187 checkpoints archivés → `{0: 86, 1: 35, 2: 47, 3: 19}`. **Le bug du registre L188 ne se reproduit pas dans les données actuelles** — rectification à porter au registre (l'entrée reste vraie pour les archives de juin, fausse comme état présent).
- **Champs manquants confirmés** : 15 passages sur 30 sans `startsAt`, 16 sans `nbLignes`.
- **1 passage orphelin** hors de toute séance : `p_1781154329630` (passage joué sans `sessionId` — l'app le permet, `demarrerSeance` n'étant pas obligatoire pour désigner un lecteur).
- **22 passages sur 30 portent `bilanTermine` et `votes`** ; 3 sont marqués `annule`.

**Zéro écriture hub depuis ce cadrage** : toutes les requêtes ci-dessus sont des `GET` REST.

---

## 5. LES TEXTES ADRESSÉS À L'ÉLÈVE — RELEVÉ, ET REFORMULATIONS **SOUMISES**

35 chaînes relevées dans `FormConnexion`, `AppEleve`, `EleveVote`, `EleveBilan`. Je ne décide aucun texte (point 26 : c'est Paul).

**Les deux à corriger d'urgence (principe cardinal + point 28) :**

| Ligne | Texte actuel | Reformulation **soumise** (le flux, jamais l'acteur) |
|---|---|---|
| L3203 | « Le professeur n'a pas encore choisi la classe. Patiente… » | « La séance n'est pas encore ouverte. Reste sur cet écran, elle démarre dans un instant. » |
| L3211 | « En attente du démarrage de la séance par le prof. » | « La séance va commencer. Garde ta tablette prête. » |

**Constats (restent en dur, point 26 : « les textes qui CONSTATENT restent en dur »)** : « Ce nom n'est pas dans la liste de la classe. Vérifie l'orthographe. » (L3128) · « Tu es marqué absent. Demande au prof si c'est une erreur. » (L3130 — *« demande au prof » est une adresse, non un manquement : conforme au point 28, je propose de garder*) · « Tu es déjà connecté sur cette tablette. » (L3131) · « Réponds à toutes les questions avant de valider. » (L3332) · « Personne n'a voté pour ce passage. » (L3392) · « Tu as utilisé tes 2 désistements. » (L3461).

**Annonces (donc éditables) candidates au dictionnaire** : les deux textes d'attente ci-dessus · « Évaluation terminée » (L3384) · « Tu repasseras dès qu'un autre s'inscrit… » (L3451) · « Choisis le numéro de ta table : » (L3188) · « Le premier élève de la table tape son nom + prénom. » (L3239). **Six champs, pas trente** — conforme au critère de tri du point 26.

---

## 6. PLAN DE CODAGE ORDONNÉ (à exécuter APRÈS feu vert)

L'ordre est celui du risque décroissant : ce qui protège des données d'abord, ce qui embellit ensuite.

**Lot A — sécurité des données (non négociable)**
1. `TEST_ELEVES` → les 6 fictifs canoniques ; garde anti-collision **sur la clé** avant tout semis (refus motivé si une clé fictive existe dans `/codes` ou dans un roster de `/classes`), sur le patron `worktrack` M13.
2. `quitterTest` → **purge exhaustive et VÉRIFIÉE** : `Promise.allSettled` sur tous les nœuds touchés (`classes/_test_applause_meter`, `seances` de test, `historiqueLectures` des passages de test, `votes`, `file`, `compteurLectures` des 6 clés, `tablettes`, `live`, `liveSnapshot`, `compliments`, `session`), collecte des refus serveur, **affichage des erreurs**, et « terminé » **seulement si tout a réussi**.
3. **Marquage des données de test** : chaque séance et chaque passage semés en mode test portent un drapeau (`test:true`) — sans quoi une purge exhaustive ne peut pas distinguer un passage de test d'un passage réel dans `historiqueLectures`, qui est un nœud plat.
4. **Corbeille sur `supprimerSeance`** : archive AVANT destruction au format canonique racine `{_meta:{chemin,app,ts}, data}` (patron worktrack M13 **corrigé** : le champ est `data`, jamais `contenu`), **abandon complet si l'archive échoue** (patron `analyse_logique` LOT-COUTURES). Voir **Q5**.
5. Nettoyage des zombies **au montage**, pas seulement à l'entrée du mode test.

**Lot B — socle et identité**
6. Socle **1.1.0 embarqué verbatim** (bit à bit contre `mjpc-core.js`, md5 `1b106b4082ee5b44154027c5a0a6552c`), **jamais importé**.
7. **Shunt §8 côté ÉLÈVE et côté PROF** — leçon M9 : `is_prof` → authentifié **direct**, le prof shunté ne ressaisit pas son code dans `CodeGate`.
8. Portail élève : selon l'arbitrage **Q1**.

**Lot C — conformité de grille**
9. Pastille de version + métas anti-cache (**Q4**).
10. Bloc DIAGNOSTIC (patron `docs/MJPC6-bloc-diagnostic.md`, 5 causes externes dans l'ordre).
11. Présence hub (point 22) : `/presence/<clé>` au même contrat que le site (élève, classe, app, contexte, horodatage, `sendBeacon` à la fermeture) + affichage prof.
12. Dictionnaire de textes (seed + surcharge `applaudimetre/session/textes`) sur les 6 annonces du §5, éditeur en Réglages ; les 2 textes cardinaux corrigés dans le même geste.
13. Navigation à deux niveaux et gestes manquants (renommer une séance, dupliquer) — périmètre à confirmer.
14. Tactile ≤480 px, **panneau professeur compris**, desktop **inchangé au-dessus** du seuil.

**Lot D — le mouchard**
15. Selon l'arbitrage **Q3**.

---

## 7. INVARIANTS DÉCLARÉS — md5 AVANT, À REVÉRIFIER APRÈS

Ces fonctions ne doivent pas changer d'un octet. Empreintes mesurées sur la base (corps complet, accolade à accolade) :

| Fonction | Ligne | Taille | md5 |
|---|---|---|---|
| `sanMJPC` | 1066 | 163 o | `1d99c7bed340f034a8888593162ec6a7` |
| `cleClasse` | 1074 | 57 o | `784fcf80c6ab8c209362535313297a2c` |
| `classeTestId` | 1080 | 55 o | `69ced895371ff40c2435b914103ae017` |
| `estClasseTest` | 1082 | 115 o | `5115aae90f0206b05ad533a99c35cd22` |
| `extractEleves` | 1090 | 1 036 o | `e7209d51b66d845843abbc51d74e8c11` |
| `ecrireClasse` | 1120 | 1 267 o | `d5f084d58b7261669c36c27956edb516` |
| `renvoyerVersMJPC` | 1153 | 302 o | `be1874f53801c417269972c1964affbd` |
| `resolveEleves` | 1165 | 1 177 o | `06e42b4d28824bf7bb661247b797eb2e` |
| `publierManifeste` | 1193 | 324 o | `4584459262d2b00f622d7e5339b6be38` |
| `median` | 1320 | 206 o | `f8cb781eed0e5c9c92717a75ed1ba927` |
| `compterVotants` | 1328 | 362 o | `2a9bf66a564521c2b6013008de045f36` |
| `fmtSec` | 1444 | 117 o | `0bcee1932edc35cee17ccd270aca130e` |
| `newSessionId` | 1573 | 218 o | `6c77316371f45846cf700233f18022c1` |
| `prenom` | 1578 | 249 o | `66108fa2d6059939d3f871e27ced1fc3` |
| `toArr` | 1587 | 384 o | `26d814a390241c7357f7fdf0d4109981` |
| `reglagesSafe` | 1600 | 2 266 o | `647241c35c1f8e2bd1ff23de0972cdff` |
| `genererPromptIA` | 1449 | 1 453 o | `ad577ce33416e1e6c80dacdfa45c2e72` |

**Modifications déclarées d'avance** (les seules attendues sur ce lot) : les neuf premières deviennent celles du socle 1.1.0 (comparaison bit à bit contre `mjpc-core.js`, pas contre l'existant) ; `reglagesSafe` gagnera les valeurs par défaut du dictionnaire de textes. Toute autre divergence sera un défaut, pas une variante.

**Blocs vendorisés** (React, React-DOM, Firebase) : **intouchés**, md5 des quatre blocs relevé et revérifié au rapport.

**Autres invariants** : les 4 critères par défaut (L1235-1240) · le moteur de courbe et de checkpoints (`EleveVote`, `VueBoard`) · la charte CSS propre (exception du 15/07) · `MJPC_PURGE` (**complété** si des nœuds naissent, jamais réécrit).

---

## 8. QUESTIONS — SEULEMENT CE QUE LES DOCUMENTS NE TRANCHENT PAS

**Q1 · Le portail élève : code personnel, ou pas ?**
Le prompt demande un portail `/codes` « si l'app identifie des élèves ». Elle les identifie, nominativement, mais **sans code**. Or la DOCTRINE (L123) et la fiche du CHANTIER (L232) disent explicitement : *« pas de connexion élève classique (vote anonyme/simple) → la grille s'applique au PANNEAU prof seulement »*. Les documents ne tranchent donc pas : ils prévoient l'exception, le prompt demande le portail.
- **A** — statu quo : NOM + Prénom contre le roster, sans code. Conforme à la doctrine ; un élève peut voter sous le nom d'un camarade.
- **B** — code exigé pour tous les occupants d'une tablette. Aligne l'app sur les autres ; coûte 3 saisies de code par tablette au début de chaque séance, en classe, sur 14 tablettes.
- **C** — **code exigé pour le seul LECTEUR** (dont le passage est archivé nominativement et remonte au profil), nom + prénom pour les votants. Le nominatif engageant est attesté, le geste festif reste fluide.
*Mon avis, s'il t'est utile : C. Mais le vote alimente `votes/<passageId>/<votant>`, donc il est aussi nominatif — l'arbitrage t'appartient.*

**Q2 · Six élèves fictifs suffisent-ils ?**
La mécanique se règle sur 14 tables (`NB_TABLES_DEFAUT=14`, L1232), avec des seuils de votants, une file d'attente et des compteurs d'équité. Six élèves n'éprouvent ni la file, ni l'équité, ni le compteur « X / N votes ».
- **A** — 6 canoniques stricts (BERNARD Emma, DUPONT Marie, LEROY Hugo, MARTIN Lucas, MOREAU Léa, PETIT Thomas).
- **B** — les 6 canoniques + des noms **structurellement impossibles** pour compléter (ex. « ÉLÈVE Septième », « ÉLÈVE Huitième »… ), ce qui garde la garde sur la clé et rend la file éprouvable.
- **C** — 6 canoniques répartis sur plusieurs tables (un même élève ne peut pas occuper deux tablettes : `dejaInscrits` L3131 le refuse — donc **C est impraticable**, je le mentionne pour l'écarter proprement).

**Q3 · Le mouchard de débogage P3 — quelle option ?**
Le CHANTIER (L323) laisse deux voies « au choix de Paul le moment venu » : ⓐ retrait sec, ⓑ campagne complète du chantier Y. La recommandation du plan est ⓑ *parce que retirer le mouchard sans corriger le bug rend celui-ci invisible*. Je propose une **troisième voie qui respecte cette objection sans ouvrir le chantier Y dans M14** : remplacer le bandeau plein écran par une **capture d'erreur discrète et non projetable** (une pastille d'alerte côté prof uniquement, jamais sur la vue tableau) **plus une journalisation dans un nœud de diagnostic** — le bug reste traçable, le piège de classe disparaît. À trancher : ⓐ, ⓑ (hors M14), ou cette voie ⓒ.

**Q4 · Numérotation de la pastille.**
L'app n'a **jamais** porté de version. Les passes complètes récentes ont donné `2.0.0` (`dictee_universelle` M9, `analyse_logique` M11) ; `worktrack` porte une date (`2026-07-27a`). Je propose **`APP_VERSION = "2.0.0"`** + pastille au patron du site (bottom:10 / right:10), en vérifiant qu'elle ne chevauche aucun bouton flottant (l'incident `dictee_universelle` du 22/07). **Mesure faite** : `.help-fab` est en `position:fixed; bottom:18px; right:18px; 52×52` (L303) — une pastille à `bottom:10 / right:10` tomberait exactement dessous, **le conflit est certain**. Je décalerai le `HelpFab` vers le haut, jamais la pastille (patron du site). Valides-tu `2.0.0` et ce décalage ?

**Q5 · Format de l'archive de corbeille pour une séance.**
Supprimer une séance détruit **1 + N chemins** (`seances/<sId>` et N `historiqueLectures/<pid>`). La leçon de `dictee_universelle` (LOT-COUTURES, couture ④) est qu'on ne pose `_meta.chemin` + `data` brut **que si `paths.length === 1`**, sinon la restauration réécrit une enveloppe aplatie et corrompt.
- **A** — **une entrée de corbeille par chemin** (1 séance + N passages) : chaque élément redevient restaurable individuellement depuis le site, au prix de N+1 entrées par suppression.
- **B** — une entrée unique portant la séance et ses passages en sous-arbre : une ligne lisible dans la corbeille, mais **non restaurable par le mécanisme actuel du site** sans un traitement dédié.
*Mon avis : A, parce que le contrat du site est conçu pour un chemin par entrée — vérifié dans ce tour sur la production : `_corbPlanRestauration` (`index.html` L4462-4464) rend `[{chemin: meta.chemin, valeur: data}]` si et seulement si `meta.chemin` est non vide et `data` non nul, et le commentaire du contrat (L4448) le dit mot pour mot : « ① `_meta.chemin` non vide → `data` ENTIER à ce chemin ; ② sinon TABLE par motif ».*

**Q6 · Les deux reformulations du §5 te conviennent-elles ?** Je ne les écrirai pas sans ton texte ou ton accord.

**Q7 · L'amélioration pédagogique n°4, rattachée nommément à M14** (DOCTRINE L307) : *« 2-3 critères affichés AVANT la lecture, vote par critère — l'écoute des pairs devient apprentissage d'auditeur »*. Le **vote par critère existe déjà** (4 critères, `EleveVote` L3262). Ce qui manque est **l'affichage des critères aux élèves AVANT le passage**. Est-ce dans M14 (c'est un petit ajout, la donnée est là) ou différé ?

**Q8 · Le point 8 (« Mes lectures ») est-il au périmètre ?** L'app est vidéoprojetée, l'élève n'y a pas de session personnelle et n'y revient pas après la séance. Une vue « mes lectures » supposerait le portail à code de **Q1** et un accès hors séance : deux mécanismes nouveaux. Je propose de le **déclarer différé avec motif** plutôt que de le bâcler — mais c'est un point de grille, donc c'est à toi.

---

## 9. CE QUI N'EST PAS À MOI, ET QUE JE VERSE

- **M-SÉCU (6-10/08)** : `PROF_CODES` en clair dans une page publique (L1044) — constat, versé, non traité. Aucune règle Firebase ne protège `/classes` ni `applaudimetre/*` : l'écriture de test est possible depuis n'importe quel navigateur.
- **M-MODETEST** : la reprise fine des modes test de toutes les apps. Je livre le socle 16bis conforme sur cette app, je ne refais pas le chantier des autres.
- **CHANTIER L13 à corriger** : `applause_meter` y figure parmi les modes test « DÉJÀ CONFORMES, à ne pas retoucher ». Les mesures du §2.2 et du §3 (pt 16) le contredisent sur pièces.
- **REGISTRE à rectifier** : ~3 474 lignes → 3 944 ; `critereIdx` bloqué à 0 → ne se reproduit pas dans les données actuelles ; 4 passages fantômes → 5.
- **Zombies du hub** (`_TEST`, `CLASSE TEST`, `_test_pilotage_debat_s3`, `applaudimetre/classes`, 5 `qrScans`) : consignés, hors périmètre.
- **Chantier Y** (campagne complète de débogage, dont le bug `Cannot read 'slice'` et « le tableau n'atteint jamais 100 % ») : hors périmètre, sauf arbitrage **Q3**.
- **Visionneuse S5-⑦** : pas à moi.

---

## 10. CE QUE JE FERAI POUR PROUVER (rappel du contrat du rapport)

Base revérifiée · diff intégral **classé** · double parseur (`node --check` + acorn ES2020) sur **tous** les blocs · invariants md5 avant/après (§7) · socle 1.1.0 **bit à bit** · pastille incrémentée · harnais en **lecture seule stricte** (tout `PUT`/`POST`/`PATCH`/`DELETE` avorté et journalisé, fixtures `GET` réelles) · **captures POUSSÉES AU SAS** aux deux tailles, écrans professeur compris, toute capture de mode test **légendée comme telle** · pour chaque parcours, **l'état mesuré** (écritures, nœuds, valeurs) et pas seulement l'image · état du hub re-inspecté · parcours joués : portail, shunt élève **et** prof, mode test entrée + purge **vérifiant ses erreurs**, gestes de base, restauration depuis le site, tactile aux deux tailles · **zéro écriture hub** · textes **soumis**, jamais décidés.

**J'attends le feu vert. Aucune ligne avant.**
