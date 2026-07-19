# M-TEST — RAPPORT · rattrapage des modes test (souche · débat · QCM)
*18/07/2026. Plan relu : v50 (16/07), md5 `f66e88fd11647ef05dde1c1d60611395`. Livraison au sas — aucune promotion, aucune écriture hub.*

---

## 0. Empreintes et banc

| Fichier | md5 | Taille | Banc |
|---|---|---|---|
| `correction_dictee.staging.html` | `2d0d39417bcb5f7126bb24e0ba0425aa` | 541 588 o | **153/156** |
| `evaluation-qcm.staging.html` | `d6b36229b30a5c53dd98bef530c1998c` | 503 211 o | **112/112** |
| `pilotage_debat_s3.staging.html` | `cc8e9c063725dcfb17b86bd544f24db5` | 452 033 o | **21/21** |

Double parseur (`node --check` + acorn) **OK** sur les trois, après chaque patch.
Les 3 échecs de la souche sont **antérieurs à cette passe** (dette D6 : tests M6 couplés à un état de hub mouvant — Léonie a désormais un résultat, `clement_lylou` existe en clé canonique). Aucun n'est une régression.

Bases de travail (production, toutes promues) : souche `9145d8b8…`, QCM `8637a41b…`, débat `3973f8f8…`.

---

## 1. Checklist à preuves — chaque mécanisme : atteignable ? par la vraie fonction ?

### ① `correction_dictee`

| Mécanisme | Atteignable depuis le bac à sable | **Passe par la fonction réelle** |
|---|---|---|
| **Les 4 états de « Mes dictées »** | ✔ bouton « ✓ Vérifier les 4 états » | ✔ `etatDicteeEleve(d, san(e))` — *preuve au banc* : le test **rejoue les 4 cas** avec la fonction extraite du fichier et obtient `terminee · afaire · absent · attente`. Un second test vérifie qu'aucune logique d'état (`copyPublishedAt ?`) n'est recopiée dans les outils. |
| État **« Terminée »** | ✔ **manquait** : aucun élève de test n'avait d'autocorrection achevée | ✔ ajouté aux données de test : `autocorrection:{durand_alice:{solved:3, total:3}}` — le contrat réel exige `total > 0 && solved >= total`, vérifié |
| **Éditeur de textes** | ✔ bouton « ✏️ Tester l'éditeur de textes » (bascule + retour à l'original) | ✔ écrit dans `correction_dictee_textes` et **relit par `txt("liste_vide")`**, l'accesseur réel |
| **Corbeille avant suppression** | ✔ bouton « 🧹 Tester la corbeille », puis vérification de `corbeille/<jour>/` | ✔ `supprimerDicteeAvecCorbeille(...)` — **fonction EXTRAITE du bouton de l'accueil** (déplacement, pas réécriture). *Preuve au banc* : une seule définition dans le fichier, **3 appels** — le bouton de l'accueil et le bac à sable appellent la même |
| **Portail élève** | ✔ il vit dans `AppEleve`, pas dans un `EleveLogin` (confirmé) ; traversable par `?mode=eleve&incarner=` | ✔ l'incarnation pose l'identité réelle (`via:"incarnation"`), bornée à `classeTestId()` |

### ② `pilotage_debat_s3`

| Mécanisme | Atteignable | **Fonction réelle** |
|---|---|---|
| **Cours déclaré — démarrage** | ✔ existait (« ▶ Démarrer (2 h) ») | ✔ `coursTest()` écrit le vrai nœud `debat_config/cours` |
| **Alerte T-5** | ✔ **« ⚡ T-5 maintenant »** — nouveau. L'existant (« fin dans 6 min ») imposait d'attendre une minute | ✔ pose `fin = now + 4 min 30` **puis appelle `checkCoursDebat()`**, la vraie fonction d'alerte. *Preuve au banc* : aucun `toast("⏰…")` n'est émis directement par l'outil — l'alerte vient du mécanisme |
| **Bandeau élève T-5** | ✔ `_coursBandVu` remis à faux, donc il réapparaît | ✔ même chemin |
| **Fin de cours atteinte** | ✔ **« ⚡ Fin atteinte maintenant »** — nouveau | ✔ pose une fin passée puis `checkCoursDebat()` → la modale « clôturer ou prolonger » s'ouvre |
| **Clôture / refus hors cours** | ✔ existait (« ■ Clôturer ») | ✔ inchangé |
| **Injection de documents** | ✔ **« 📄 Documents de test »** — nouveau : colle un jeu de 10 documents valides | ✔ **ne fait que remplir le champ** ; l'injection reste au clic sur « Injecter les documents », donc par `injecterDocuments()` **validation comprise**. *Preuve au banc* : l'outil ne contient ni `db.ref(ROOT+"/documents")` ni `validerDocumentsJSON` |
| **Existant non dégradé** | ✔ | *preuve au banc* : `coursTest`, `incarnerTest`, `purgerEtSortirTest` intacts |

### ③ `evaluation-qcm`

| Mécanisme | Atteignable | **Fonction réelle** |
|---|---|---|
| **Clôture de session** | ✔ « 🔒 Clôturer (chemin réel) » | ✔ `cloturerSession(sess, ev, cb)`. *Preuve au banc* : l'outil ne contient **aucun** `.set("terminee")` |
| **Snapshot P2** | ✔ affichage « énoncé FIGÉ / non figé » + version | ✔ `evalDeSession`, `sessionEstFigee`, `versionEval` — les trois fonctions de P2 |
| **Modifier l'éval après coup** | ✔ « ✏️ Modifier l'éval après coup » (change la bonne réponse de Q1, incrémente la version) | ✔ écrit dans `TEST_EVAL_ID` seul |
| **Preuve que P2 protège** | ✔ « ⚖️ Comparer figé / courant » : recompte les scores **deux fois** et affiche les deux totaux | ✔ `calculerScoreQuestion(...)` et `modeEval(...)`. *Preuve au banc* : aucune variable de calcul (`nbBon`, `maxPartiel`, `parfait`) n'apparaît dans les outils — **rien n'est réimplémenté** |
| **Verrou du chrono (bug de Maëva)** | ✔ « ⏱️ Faire expirer le chrono » — **immédiat** | ✔ repousse `phaseStart` dans le passé ; `peutRepondre` recalcule seul et refuse |
| **Portail élève** | ✔ « 👋 Ouvrir le portail élève » + les codes du bac à sable affichés | ✔ monte **le vrai `AppEleve`** (donc `EleveLogin`). Les codes viennent de **`codesTest()`**, la fonction qui les a écrits — la table n'est pas recopiée |
| **« Mes évaluations »** | ✔ depuis la vue élève ouverte | ✔ le vrai composant |
| **Bac à sable non dégradé** | ✔ | 30 élèves simulés, `EleveSimule`, réponses échelonnées : intacts |

**Un obstacle rencontré, et son traitement.** `AppEleve` masque les classes internes — la classe du bac à sable était donc invisible depuis le vrai portail. Plutôt que de contourner le composant (ce qui aurait fabriqué une seconde entrée, contraire au principe), je lui passe `bacASable:true` **depuis le mode test seulement**. *Preuve au banc* : le filtrage vu par les élèves est inchangé, et seul l'appel du bac à sable porte le drapeau.

---

## 2. Séquences exactes de clics

### ① `correction_dictee` — 4 états · éditeur · corbeille

**Préparer** : accueil prof → **🧪 Créer le bac à sable** (ou 🔄 Regénérer).

**A. Les 4 états** — 3 clics
1. Panneau « 🧪 Mode test » → **✓ Vérifier les 4 états**.
2. Lire la liste : `Alice → Terminée` · `Lucas → À faire` · `Sacha → Tu étais absent(e)` · `Chloé (dictée B) → Pas encore corrigée`.
3. Pour le voir côté élève : **Alice**, puis **Sacha**, puis **Chloé** dans « Se mettre à la place d'un élève ».

**B. Éditeur de textes** — 4 clics
1. **✏️ Tester l'éditeur de textes** (le message affiche le nouveau texte).
2. Incarner **Chloé** (sans dictée) → la liste vide affiche « [test] Ce texte a été modifié depuis le bac à sable. »
3. Revenir à l'onglet prof → **✏️ Tester l'éditeur de textes** (rebascule).
4. Recharger la vue élève → le texte d'origine est revenu.
*Variante par l'interface réelle : Réglages → « Ce que lisent les élèves » → modifier « Quand l'élève n'a aucune dictée » → sortir du champ.*

**C. Corbeille** — 3 clics
1. **🧹 Tester la corbeille** → confirmer.
2. Le message donne le chemin `corbeille/<jour>/suppression-dictee_<HHMMSS>` ; un export JSON est téléchargé.
3. **🔄 Regénérer** pour retrouver la dictée B.

### ② `pilotage_debat_s3` — cours déclaré · injection

**Préparer** : panneau du bac à sable (classe `_test_pilotage_debat_s3`).

**A. T-5 sans attendre** — 3 clics
1. **▶ Démarrer (2 h)**.
2. **⚡ T-5 maintenant** → le toast prof tombe immédiatement.
3. Incarner un élève → le bandeau T-5 s'affiche (recharger la vue élève si elle était déjà ouverte).

**B. Fin de cours** — 2 clics
1. **⚡ Fin atteinte maintenant** → la modale « clôturer ou prolonger » s'ouvre.
2. Choisir **Prolonger** (le cours repart) ou **Clôturer**.

**C. Les deux refus** — 2 clics
1. **■ Clôturer** → incarner un élève : il est refoulé « hors cours », « Mes débats » reste accessible.
2. Groupes verrouillés : verrouiller les groupes, puis incarner → second refus.

**D. Injection de documents** — 4 clics
1. Préparation → **Les 10 documents du parcours**.
2. **📄 Documents de test** (le JSON se colle dans le champ).
3. **Injecter les documents** → validation réelle, message « Documents injectés ✔ ».
4. Incarner un élève → les documents « [TEST] Document N » sont là. Retour : **↩ Revenir au jeu d'exemple**.

### ③ `evaluation-qcm` — P2 · chrono · portail · Mes évaluations

**Préparer** : accès prof → **🧪 Mode test**.

**A. P2, la démonstration complète** — 7 clics
1. Lancer une question, puis **Tous les élèves répondent**.
2. **⚖️ Comparer figé / courant** → « Cette session n'est pas figée : clôture-la d'abord. »
3. **🔒 Clôturer (chemin réel)** → l'état passe à « énoncé **FIGÉ** ».
4. **⚖️ Comparer figé / courant** → les deux totaux sont **identiques** (l'éval n'a pas bougé).
5. **✏️ Modifier l'éval après coup** → « version 2 ».
6. **⚖️ Comparer figé / courant** → les totaux **diffèrent** : le message nomme celui que l'app affiche. *C'est la preuve visible que P2 protège.*
7. **🔄 Relire l'état** → l'évaluation est en version 2, l'énoncé lu par l'app reste en version 1.

**B. Chrono (bug de Maëva)** — 3 clics
1. Lancer une question **avec un chrono**.
2. **⏱️ Faire expirer le chrono**.
3. Dans la zone élève simulée, cliquer une réponse → refusée.

**C. Portail élève et « Mes évaluations »** — 5 clics
1. **👋 Ouvrir le portail élève** (les codes du bac à sable sont affichés au-dessus).
2. Choisir la classe `_test_evaluation-qcm`.
3. Saisir **code + prénom + nom** d'un élève de test → entrée refusée si le code est faux.
4. **📊 Mes évaluations** → la session close apparaît (avec « v2 » si l'éval a été modifiée).
5. **✕ Fermer la vue élève**.

**Purger** : **🗑️ Sortir et purger** (classe, éval, sessions, présence **et codes fictifs**).

---

## 3. Ce que je n'ai pas fait, et ce qui reste à éprouver par Paul

- **Le refus « groupes verrouillés »** (débat) : je n'ai pas ajouté de déclencheur dédié — le verrouillage des groupes est déjà un geste d'un clic dans le pilotage, donc atteignable sans outil. À confirmer par l'essai ; si le parcours est plus long que prévu, il mérite son bouton.
- **Rien du temps réel n'est prouvé par moi** : je n'ai pas de navigateur qui peint. Les séquences ci-dessus sont construites sur la lecture du code, pas sur une exécution. Le bloc C à deux appareils reste indispensable pour le QCM.
- **Les trois échecs du banc sur la souche** restent ouverts (dette D6) : ils viennent des données, pas du code, mais ils rendent le banc moins lisible à chaque exécution.

---

## 4. Dettes

**D6** — tests M6 couplés à un état de hub mouvant. **D7** — présence à aligner (lot commun). **D10 (nouvelle)** — les trois bacs à sable ont maintenant chacun leur bloc d'outils d'épreuve, écrits séparément : quand un quatrième arrivera, la question du patron commun se posera (le plan dit « TOUJOURS » pour l'évolution du mode test — autant que ce soit un mécanisme, pas une coutume).

Je ne promeus pas.

---

# ADDENDUM — correction du vocabulaire (18/07)

*Relivraison après audit du lexique. Banc : souche **153/156** (3 échecs antérieurs, dette D6) · QCM **112/112** · débat **21/21**. Double parseur OK sur les trois.*

| Fichier | md5 |
|---|---|
| `correction_dictee.staging.html` | `2d0d39417bcb5f7126bb24e0ba0425aa` *(inchangé — aucun terme à corriger)* |
| `evaluation-qcm.staging.html` | `154df3f870d680e219492954f3c51cc8` |
| `pilotage_debat_s3.staging.html` | `405d11bb461d804a93ba383262fab659` |

## ① et ② — QCM, les mots disent ce qu'ils font

| Avant | Après |
|---|---|
| ⚖️ Comparer figé / courant | **⚖️ Vérifier que les notes n'ont pas bougé** |
| Total de la classe d'après l'énoncé FIGÉ : X · d'après l'éval COURANTE : Y | **Le jour de l'évaluation : X · avec l'énoncé actuel : Y** |
| Cette session n'est pas figée : clôture-la d'abord | **Cette session n'est pas encore clôturée** |
| énoncé **FIGÉ** / **non figé** | énoncé **conservé ✔** / **non conservé** |
| DIFFÉRENTS — la preuve que P2 protège : l'app affiche X | **Différents — et c'est bien la preuve : l'application affiche X, la note du jour, pas Y** |

L'infobulle du bouton a suivi : elle parle maintenant de « recompter les notes telles qu'elles étaient le jour de l'évaluation », non plus d'énoncé figé.

**Précision sur ②** : le signalement « énoncé conservé / non conservé » **n'existe aujourd'hui que dans le mode test**. L'écran prof des sessions hors mode test ne l'affiche pas encore — c'est la **dette D5**, toujours ouverte. Quand elle sera traitée, le vocabulaire est prêt.

## ③ — Débat, deux textes élève corrigés… et un troisième trouvé

Les deux validés :
- « Revoir toutes les évaluations que ton groupe a envoyées (figées). » → **« …que ton groupe a envoyées. »**
- « Elles apparaîtront ici, figées, au fur et à mesure. » → **« Elles apparaîtront ici au fur et à mesure. »**

**Découverte — un troisième, au même endroit** : le sous-titre de l'écran « Mes évaluations » (L1458) disait « Tout ce que ton groupe a envoyé, **figé**. » Même écran, même mot, même élève. Je l'ai traité comme les deux autres — **« Tout ce que ton groupe a envoyé. »** — plutôt que de laisser un mot orphelin sur l'écran qu'on venait de nettoyer. Si tu préfères l'arbitrer séparément, c'est une ligne à rétablir.

## Balayage des trois apps — ce que je trouve, sans le changer

**Un seul texte élève porte encore un mot du code**, dans le QCM (`EleveEval`) :

> « ✅ Ta réponse est enregistrée — chrono terminé, elle est **figée** »

C'est le message que voit l'élève quand le temps est écoulé. Le mot ne lui apprend rien : ce qu'il a besoin de savoir, c'est qu'il ne peut plus changer d'avis. **Proposition** : « ✅ Ta réponse est enregistrée — le temps est écoulé, tu ne peux plus la changer. » Je ne l'ai pas modifié : il n'était pas dans ta liste, et il touche un écran de travail en séance. À ton arbitrage.

**Tout le reste est hors périmètre, vérifié** : les occurrences de `JSON`, `snapshot`, `Firebase`, `cache`, `nœud` sont **toutes** dans des écrans professeur (Sauvegarde, Préparation, prompts IA, mode expert) ou des commentaires. Aucun élève ne les lit. Je les laisse : le point 25 vise le discours adressé à l'élève, et « JSON » est le mot juste pour Paul quand il colle un JSON.

**Une remarque de méthode** : mon premier balayage automatique **n'a pas attrapé** ce « figée » du QCM — la chaîne vit dans un ternaire, que mon filtre excluait comme du code. Je ne l'ai trouvé qu'en relisant les occurrences brutes de « figé ». Un filtre trop prudent rate ce qu'il cherche ; c'est le troisième faux négatif de ce genre dans le chantier (les commentaires en M6, la définition récursive en M7, celui-ci). Le grep large suivi d'un tri à la main reste plus sûr que le filtre malin.
