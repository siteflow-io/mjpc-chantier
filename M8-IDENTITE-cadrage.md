# M8-IDENTITÉ — NOTE DE CADRAGE (exécutant continué M8-MOBILE-2 → M8-IDENTITÉ, 21/07/2026 — heure du conteneur TZ Paris)
*Le site applique sa propre doctrine. Rien n'est codé : cette note attend l'audit de la conscience n°2.*

## Q0 — À TRANCHER AVANT TOUT : cette conversation EST M8-MOBILE-2
Le prompt demande de lire « les conversations des exécutants précédents (M8-FUSION, M8-MOBILE-2) » : **M8-MOBILE-2, c'est ce fil-ci** — cadrage poussé le 20/07, morceau suspendu par B6, deux tours de vérification de la conscience le 21/07. La règle gravée (Paul, 19/07) impose une conversation exécutante NEUVE par morceau ; le précédent M8-FUSION a été continué sur arbitrage explicite (« tant pis, on continue », consigné en A0/DISPOSITIF). Erreur de collage ou choix assumé ? **Je ne code pas avant cet arbitrage.** Avantages réels de la continuation : lecture ③ totale par construction, base du morceau déjà dans mon conteneur (md5 identique bit à bit), harnais Playwright lecture-seule éprouvé, doctrine et documents déjà en contexte. Risque : celui-là même qui a fondé la règle — je m'engage au contrôle de traces à chaque reprise (premier contrôle fait : `ls -lat`, tous fichiers datés de mes deux sessions, tous reconnus ; sas conforme à mes actes).
**Nota sur le nommage** : cette conversation porte déjà un titre (celui de M8-MOBILE-2) ; je ne peux pas la renommer moi-même. Si la continuation est retenue, le titre restera trompeur dans ta liste — à toi de dire si Paul le renomme à la main ou si c'est accepté.

## 1. Lectures ①② — les documents (téléchargés authentifiés, tailles + md5 vérifiés)
- **`MJPC6-0-INDEX.md`** (4 883 o, lu intégralement) → ordre de lecture respecté.
- **`MJPC6-1-DISPOSITIF.md`** (97 761 o) : c'est l'extraction du plan que j'ai lu intégralement le 20/07 (A0 + grille + principe cardinal), **contre-vérifiée par moi ce matin à 920/923 lignes identiques** ; les ajouts du 21/07 (erreurs ⑬⑭⑮, « la conscience lit, elle ne sonde pas », contrôle du socle, point 13bis) lus au fil de mes deux tours de vérification. Déclaré : je n'ai pas relu les 97 Ko ligne à ligne aujourd'hui — je m'appuie sur ma lecture d'hier plus les diffs, méthode que je déclare plutôt que de simuler une relecture.
- **`MJPC6-3-CHANTIER.md`** (79 479 o) : chronologie + B6 + dettes lues ; fiches d'apps parcourues par titres (extraction de l'ancien plan).
- **`MJPC6-doctrine-du-site.md`** (52 277 o, md5 `0a323d23e215adde73b763836acd71f6`) : **LU INTÉGRALEMENT, ligne à ligne, les 316 lignes** — §I trois axes et témoins, §II ressource/acte et niveaux, §III publication (forme canonique slug, tolérance de lecture, interdiction du test direct), §IV-V profil, §VI bypass (`is_prof` déjà au contrat, seul manque « ce que la session autorise »), §VII sorties, §VIII Firebase/dur, §IX poignées, §X Drive, §XI Apps Script, §XIII atelier (hors périmètre), §XII à trancher.
- **`MJPC6-audit-existant.md`** (6 883 o, md5 `6e7b50a814f74b0f83a5aeaa8bff826b`) : **lu intégralement** — I1→I8, principe directeur, angles morts déclarés.
- **Journal** (29 999 o) : lu intégralement ce matin (B1→B6 + cas du 21/07).

## 2. Lecture ③ — les conversations
- **M8-MOBILE-2 : c'est moi.** Lecture totale par construction (cadrage, mesures, 5 questions restées sans réponse, suspension B6, deux tours de vérification de la conscience).
- **M8-FUSION : lue par outil lors de mon cadrage du 20/07** (extraits + résumés) : Q0 du fil continué, 15 coutures, 5 `_bloc*` md5-identiques, reprise fondée sur la pastille au repos, dettes D-M8F-1/2/3. **Trou déclaré, inchangé** : le tour d'audit détaillé de la conscience sur M8-FUSION (je le tiens du journal : promu `2ef74c102b`, point de retour `62f32f7e89`) et les éventuels tours intermédiaires du codage.

## 3. État vérifié et anatomie ÉTABLIE PAR MOI (le fichier fait foi ; lignes de MA lecture, pas du prompt)
**Base** : production `index.html` re-téléchargée ce jour : **358 720 o, md5 `bf6ba1e165640f8ae3f51fb13720f0f3`, v8.3.0** — conforme au prompt, identique bit à bit à ma copie du 20/07.

**I1 — les deux chemins** :
- Chemin conforme : `renderChapitres` **L2085** → `isPubFor` **L2083** (`p===true` → toutes classes ; sinon `!!p[cls]`).
- Chemin fautif : `collectChapterItems` **L3138** — trois tests booléens directs : **L3142** `if(!ch.published)return` · **L3145** `if(!sce.published)return` · **L3149** `if(!it.published||…)return`. Ni `_eleveClasse` ni `isPubFor` dans son corps (grep). Un `published={classe:true}` est truthy → passe pour tous. Alimentés : les six onglets via `kind`.
- Autres lecteurs : `_isPubAny` **L1975** (loupe « Vue d'ensemble ») · `_dimNode` **L1976** · pastilles L1990-1993 — tous côté prof, via `isPubFor` : conformes.
- Écritures : `_markPub` **L2063** (la seule) + **une écriture directe hors `_markPub` : L2642** `item.published=true` à la création d'un item Drive (upload) — à router ou à déclarer (Q5).

**I5 — les deux clés, PROUVÉ SUR DONNÉES RÉELLES (GET purs)** :
- Clés réelles de `/classes` : **noms bruts** — `{"4E PYTHAGORE","CLASSE TEST","3E Charles de Gaulle","_test_pilotage_debat_s3","_TEST","4E BANKSY","5e HERGÉ"}`.
- `published` réel de `/site/4e/chapitres/1` : **`{"4E BANKSY":true,"4E PYTHAGORE":true}`** — clés brutes.
- Côté prof : `_lvlClasses` **L1973** renvoie `slug:k` où k = clé brute → `_markPub`/`isPubFor` cohérents entre eux (en clé brute).
- Côté élève : `TRACK.eleve.classe = found.slug` = clé brute, mais `_eleveClasse()` **L2084** la passe par `_slugifyClass` **L4353** → `"4e_banksy"` ≠ `"4E BANKSY"` → `isPubFor` toujours faux. **I5 confirmé par ma propre lecture.**
- ⚠ Écart avec le prompt (mineur, sourcé) : le prompt dit « le professeur publie sous une clé, l'élève lit sous une autre produite par une normalisation » — exact ; je précise que la clé prof N'EST PAS un slug non plus : **personne n'écrit en slug aujourd'hui**, la forme canonique de la doctrine (§III : « la clé est le SLUG ») n'existe pas encore dans les données.

**I2** : `gotoDictee` **L3171** lit `/correction_dictee.json`, filtre `published && niveau===level` — ni classe ni élève ; `showDicteeList` **L3173** affiche cette liste `corr` en section « Correction de ma dictée manuscrite », chaque carte ouvrant `correction_dictee.html?mode=eleve&dictee=<id>`.

**I3** : `doLogin` **L2926** : nom+prénom → `_findEleveByName` **L2922**, AUCUN code exigé ; code seul (3-5 chiffres) accepté aussi (`_findEleveByCode` L2923). Écran d'entrée **L694-710** : deux `<input>` hors `<form>`, `autocomplete="off"`.

**I4** : `DEV_MODE` — **5 occurrences** : L2951 (`loginAsProf` le pose), L3180 (`restoreSession`), L3190 (déclaration), L3192 (`activateAdmin`, tout sous `if(!DEV_MODE)` : le piège vérifié), L3313 (sortie profil test). Appelants d'`activateAdmin` : **L3193** (Ctrl+Espace) et **L3194** (`handleBadgeTap`, 5 tapes). `loginAsProf` **L2944** : identité `is_prof` propre + session partagée + heartbeat — le système riche. `is_prof` lu à **11 endroits** (L2984-85 notification, L3008 session, L3026 `isAllAccess`, L3084, L3132 `openLevel` exemption `BLOCKED_LEVELS`, L3180, L3337 dashboard…).

**I6** : `DOMContentLoaded` **L2920** : `restoreSession()` puis `if(!currentLevel)` → écran « Lien invalide · Utilise le lien fourni par M. Meney » **même si la session restaurée est prof**.

## 4. Plan d'implémentation proposé (section dédiée « M8-IDENTITÉ », point 20 : refonte propre, fonctions nommées)

**A · PUBLICATION (I1+I5, la cause racine)**
1. `isPubFor(node, classe)` devient le lecteur UNIQUE et TOLÉRANT : `p===true` → vrai ; sinon comparaison par slug des deux côtés — `_slugifyClass(k)===_slugifyClass(classe)` sur les clés de `p`. Couvre brut↔slug dans les deux sens, aujourd'hui et après transition, **sans migration de données** (les publications actuelles de Paul restent lisibles telles quelles).
2. `_eleveClasse()` renvoie la classe BRUTE (la normalisation vit dans `isPubFor`, une seule fois).
3. Une fonction nommée `_visiblePourSession(node, level)` : prof → selon la loupe (`ADMIN_LENS==='all'` → `_isPubAny`, sinon `isPubFor(node, ADMIN_LENS)`) ; élève → `isPubFor(node, _eleveClasse())`. `collectChapterItems` remplace ses trois tests par elle (chapitre, séance, item). `_isPubAny` réécrite pour boucler sur `isPubFor` (déjà le cas — inchangée).
4. `_markPub` écrit la clé en **slug** (forme canonique §III) — Q1.
5. Preuve finale : grep « aucun `.published` testé hors `isPubFor` / `_markPub` / `_isPubAny` » (les classes CSS `.published` L459-481 sont des styles, hors sujet, déclarées).

**B · PORTAIL (I3)**
6. Écran d'entrée : `<form>` avec nom (`autocomplete="username"`), prénom, **code** (`type="password" autocomplete="current-password"`), submit → `doLogin`. Élève : nom+prénom+code personnel vérifié contre `/codes` (`found.code`), refus au format principe cardinal (« Ce code ne correspond pas. Vérifie avec moi en classe. » — texte SOUMIS, non décidé). Prof : nom+prénom quelconques + code ∈ `PROF_CODES` → `loginAsProf`. **Le navigateur enregistre** : Paul ne retape plus son code. Q2 : le code SEUL (sans nom) cesse-t-il d'être accepté ?

**C · IDENTITÉ / VUE / TEST (I4) — les trois axes**
7. **`DEV_MODE` disparaît** (grep à zéro), la classe fictive `'DEV'` avec lui. `activateAdmin` remplacée par `basculerVue()` : exige `TRACK.eleve.is_prof` (sinon, rien — ou focus du portail, Q3) ; bascule `ADMIN_MODE` + `body.admin-mode` + ré-affichage ; **ne touche NI l'identité NI le mode test** (§VII). Les 2 appelants (Ctrl+Espace L3193, badge 5-tapes L3194) pointent sur elle. `restoreSession` L3180 et la sortie profil test L3313 nettoyées de `DEV_MODE`.
8. Vue par défaut à la connexion prof : **envers**, puis mémorisée (`sessionStorage`) — Q4.
9. **Témoins** (§I) : **liseré ambre** `position:fixed; inset:0; pointer-events:none` = vue envers, REMPLACE le bandeau `#admin-banner` (son texte descend en tête du Tableau de bord) ; badge `⚡` = identité prof (plus jamais « DEV ») ; point orange = mode test (INTACT, re-vérifié panneau fermé). Q5 : déconfliction avec M8-MOBILE-2 suspendu — le liseré était son point ① ; je le livre ICI comme témoin doctrinal, M8-MOBILE-2 le retirera de son périmètre à sa reprise.

**D · NAVIGATION DU NOMINATIF (I2)**
10. `gotoDictee` cesse de lister `corr` ; la section « Correction de ma dictée manuscrite » devient UNE carte unique → `correction_dictee.html?mode=eleve` (l'élève y est reconnu par le bypass et voit « Mes dictées », le bon filtre existant). Q6 : carte unique, ou retrait pur de la section ?

**E · ATTERRISSAGE PROF (I6)**
11. `DOMContentLoaded` : session prof restaurée et pas de `?n=` → `currentLevel` par défaut (`'3e'` ou dernier niveau mémorisé — Q7), `page-home` + `initHome()`, vue mémorisée. L'écran « lien invalide » ne s'affiche plus jamais à un prof identifié.

**Transversal** : pastille `APP_VERSION` → **8.4.0** + date · double parseur · harnais lecture seule stricte aux DEUX tailles (390 tactile + 1280), parcours joués : élève code-bon / code-faux / sans-code, prof + bascule ×2 + rechargement + Ctrl+Espace depuis l'envers, niveaux bloqués prof vs élève · zéro écriture hub (PUT manifeste et POST Apps Script avortés, journal joint) · textes élève nouveaux SOUMIS au rapport (principe cardinal + 25bis) · aucune annonce élève (livrable de structure — sauf avis contraire : le portail CHANGE pour les élèves à la rentrée, une annonce pourrait se justifier plus tard, pas à la promotion d'été).

## 5. Invariants que je m'engage à prouver
`lireSessionMJPC`/bypass NON touchés (le site écrit la session par `_writeSharedSession` L2925 — je n'y ajoute RIEN sans arbitrage ; « ce que la session autorise » (§VI) est HORS morceau : aucune app ne sait encore le lire) · gardes `admin-mode` (grep comparatif) · chemins Firebase inchangés · marqueur permanent du mode test aux deux tailles panneau fermé · desktop : dimensions d'avant retrouvées · aucune suppression sans grep de non-appel (liste : `activateAdmin` remplacée — grep 0 sur l'ancien nom ou conservation en alias ? je propose remplacement franc + grep) · `.published` : plus aucun test direct (grep final au rapport).

## 6. Les questions, avant code
- **Q0** : continuation de cette conversation (je suis M8-MOBILE-2) — arbitrage de Paul.
- **Q1** : `_markPub` écrit en SLUG dès maintenant (canonique §III) + lecture tolérante double sens, AUCUNE migration de données — confirmer.
- **Q2** : portail — 3 champs (nom/prénom/code) ; le code seul sans nom est-il encore accepté (élève ou prof) ? Ma lecture de la doctrine : non (« code + nom + prénom, comme partout »).
- **Q3** : `basculerVue()` pour un non-prof : ne fait rien, ou amène au portail ?
- **Q4** : vue par défaut à la connexion prof : envers (proposé) + mémorisation sessionStorage.
- **Q5** : liseré livré ICI (témoin §I) ; M8-MOBILE-2 suspendu perd son point ① — confirmer la déconfliction. Et L2642 (`item.published=true` à l'upload) : routé par `_markPub` en « toutes classes », ou conservé et déclaré ?
- **Q6** : section corrections de `showDicteeList` : carte unique vers l'app, ou retrait pur ?
- **Q7** : niveau d'atterrissage prof sans `?n=` : `'3e'` en dur, ou dernier niveau mémorisé ?
- **Périmètre déclaré du point de vue** : la bascule endroit utilise la loupe EXISTANTE (`ADMIN_LENS` partagé, fantôme = `'all'`) ; l'INCARNATION d'un élève nommé et l'annuaire du fantôme (§I « le fantôme est tout le monde ») sont des clients du profil (M15) — HORS morceau, sauf ordre contraire. À confirmer.

## 7. Écritures hub : ZÉRO
Toutes lectures GitHub authentifiées (tailles + md5 §1-3) ; hub en GET purs (`/classes` shallow, un `published`). Je ne promeus jamais.
