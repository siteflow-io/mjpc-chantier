# M7 — RAPPORT DE LIVRAISON · QCM (`evaluation-qcm`)
*Exécutant M7, 18/07/2026. Livraison au sas — aucune promotion, aucune écriture hub.*

---

## CHECKLIST À PREUVES

| # | Point | État | **Preuve** |
|---|---|---|---|
| 1 | **md5 + taille** | ✔ | `evaluation-qcm.staging.html` → md5 **`231cb93e418e61c250bf88728a67c80f`**, **484 786 o**. Source production lue : md5 `712059bdb427b7b00318da2a17be6e2b`, 470 628 o, 7 647 lignes. |
| 2 | **Parseurs** | ✔ | `node --check` **OK** et `acorn` (ecmaVersion 2020) **OK** — rejoués après chacun des 17 patchs. |
| 3 | **Banc, export réel** | ✔ | **83/83** sur `hub7.json` (8 classes, 128 codes, 4 évaluations, 3 sessions, tirés du hub le 18/07). |
| 4 | **Non-régression du banc** | ✔ | Souche `correction_dictee` production : **145/148** — *les 3 échecs sont antérieurs à moi et viennent des DONNÉES, preuve au §5*. QCM production (avant passe) : **5/5**, la suite M7 s'ignore proprement. |
| 5 | **Écritures hub** | ✔ | **Aucune.** Lectures seules (`/classes`, `/codes`, `/qcm`, `/correction_dictee`) pour construire l'export du banc. |
| 6 | **Écrans intacts (octet pour octet)** | ✔ | **13 intacts** : `EleveBilan`, `EleveCorrection`, `Scoresheet`, `BilanClasse`, `StudentReport`, `genererBilanHTML`, `preparerQuestionsBilan`, **`calculerScoreQuestion`**, **`parseEvaluation`**, `OverlayQRPhone`, `NiveauxEditor`, `PonderationEditor`, `FeuilleImpression`. **Le moteur de barème et le parseur n'ont pas été touchés.** |
| 7 | **Écrans modifiés** | ✔ | 7, aux lignes comptées : `VueBoard`(1), `VuePhone`(1), `SessionLive`(1), `EleveEval`(3), `EleveAutoeval`(1), `AppTest`(6), `EleveSimule`(2) — tous des textes élève ou l'extension du bac à sable. |
| 8 | **Textes élève soumis, non décidés** | ✔ | §6 ci-dessous : 9 reformulations proposées, aucune imposée. |
| 9 | **Parcours joué** | ⚠ **PARTIEL** | §7 : ce que j'ai pu exercer, et ce que je n'ai pas pu. |
| 10 | **Dettes** | ✔ | §8. |

---

## 1. P2 — neutralisé selon la décision de Paul

**Le mécanisme, établi sur pièces** : aucun score n'est stocké. `calculerScoreQuestion` est appelé à la volée par quatre écrans depuis l'évaluation **courante**. Firebase ne garde que les choix bruts. Modifier `bonnes`, `mode` ou la liste des questions changeait donc tous les scores passés, profil longitudinal compris.

**Livré, les quatre points de la décision :**

① **Snapshot à la clôture.** `construireEvalSnapshot(ev)` fige questions + mode + version sous `sessions/<id>/evalSnapshot`. *Preuve au banc* : « le snapshot est une COPIE : modifier l'éval après coup ne le change pas » (test sur mutation réelle).

② **Identité versionnée.** Modifier une éval qui a déjà servi (`evalADesResultats`) incrémente `version` et demande une confirmation chiffrée nommant les deux versions. *Preuve* : « modifier une éval qui a servi crée une VERSION, avec confirmation chiffrée ».

③ **Aucune agrégation de deux versions.** Le profil longitudinal porte `evalVersion` et `evalIdentite` (`eval_1@v2`), et `archiverDansProfilsMJPC` lit `sess.evalSnapshot || ev`. *Preuve* : deux tests dédiés.

④ **Versions visibles côté prof.** Pastille « version N » sur la ligne d'évaluation, avec infobulle expliquant que les résultats précédents restent figés.

**Préalable structurel** : il y avait **deux chemins de clôture** (`sessActions.terminerSession`, `terminerSession` d'`OngletPilotage`) plus une écriture directe. Le snapshot aurait manqué par l'un d'eux. **Une seule fonction `cloturerSession` désormais** — *preuve au banc* : aucun `.set("terminee")` direct ne subsiste.

**Sessions déjà closes** : repli assumé sur l'éval courante, aucune écriture hub rétroactive (conforme à ta réponse). `sessionEstFigee(sess)` permet de le signaler côté prof — le signalement visuel reste à poser (dette D5).

---

## 2. Les 17 bugs — vérifiés un par un

| # | État | Preuve |
|---|---|---|
| `classe.slug` undefined | **corrigé** (avant moi) | repli documenté, L3083-3086 de la production |
| Classe de test non filtrée ×5 | **corrigé, et re-cassé silencieusement** → **réparé par moi** | voir C1 |
| `ajouterClasse` réintroduit les sexes | **supprimé** | l'onglet et la fonction ont disparu ; grep : plus aucune référence vive |
| `classesData` mal lu | **corrigé** (avant moi) | `normaliserClassesQCM` L1294 |
| Snapshots sans `/classes` | **corrigé** (avant moi) | `snapshotExport` version 2 |
| **Chrono, clics fantômes** | **corrigé** (avant moi) | L2521 : `peutRepondre = reouvert \|\| (phase === "reponse" && (chronoRestant == null \|\| chronoRestant > 0))`, avec le commentaire du fix ; 14 occurrences de `chronoRestant` |
| `width:100vw` | **corrigé** (avant moi) | **0 occurrence** de `100vw` dans le fichier |
| `qIdx` au lieu de `correctionIdx` | **corrigé** (avant moi) | 26 occurrences de `correctionIdx` |
| `explication` abandonné | **corrigé** (avant moi) | L1731 `explication: q.explication ? String(q.explication).trim() : ""` ; consommé L3703 |
| **Recalcul rétroactif (P2)** | **NEUTRALISÉ par moi** | §1 |
| #20 sessions supprimées | **corrigé** (avant moi) | `normaliserClassesQCM` appliqué avant `!classes[slug]` |
| #21 fuite de listener | **corrigé** (avant moi) | `.on` et `.off` tous deux sur `slug` |
| #22 snapshots sans classes | **corrigé** (avant moi) | idem #5 |
| #7 médiane décimale | **non traité** | dette D1 |
| #8 `eleveSexes` orphelins | **sans objet ici** | la suppression de classe n'existe plus dans le QCM ; le nettoyage appartient au site → dette D2 |
| #14 fourchettes ≤ 2 | **non traité** | dette D3 |
| #9/#10/#11 mineurs | **non traités** | dette D4 |

---

## 3. Mes trois constats — corrigés

**C1** — `estClasseInterne` était défini deux fois : socle (chaîne) L1052, app (objet) L1311, la seconde écrasant la première. La fonction app est **renommée `estClasseInterneObj`** (jamais supprimée) et les appels qui passaient un objet redirigés — **preuve par grep** : 3 occurrences avant, 2 après (la troisième vivait dans `OngletClasses`, retiré). *Preuve au banc* : `estClasseTest("_test_evaluation-qcm") === true` et `estClasseTest("4E BANKSY") === false`, ce qui était faux avant.

**C2** — le snapshot d'avant-effacement lisait `DB_ROOT` seul : le fichier promis à Paul ne contenait pas les classes. Passé en `Promise.all([DB_ROOT, "classes"])`, payload version 2. *Preuve au banc*.

**C3** — six `"terminee"` contre quatre `"termine"` : une session close normalement n'était jamais reconnue par le nettoyage. Unifié sur `"terminee"` (4 sites). *Preuve au banc* : plus aucun `"termine"` dans le fichier.

---

## 4. La grille appliquée

Nav deux niveaux (structure ; **aucune couleur nouvelle**, la charte QCM est intouchée) · atterrissage sur Pilotage classe · **onglet Classes retiré**, remplacé par `renvoyerVersMJPC` dans Réglages, avec **sauvetage de `deduireNiveauDuNom`** (la fonction recommandée par le plan pour la dette « niveau écrasé » vivait dans l'onglet supprimé) · Préparation et Réglages créés, montant des composants existants · « ? » : `ModeEmploi` rangé derrière, plus le lecteur d'annonces `site/annonces` tolérant à l'absence · **portail élève** code MJPC + nom + prénom, plus shunt `lireSessionMJPC` (socle v1.1.0 recopié verbatim, 12 fonctions vérifiées) · **dictionnaire de 4 textes** éditables + éditeur dans Réglages · manifeste et purge à jour (`qcm/textes` déclaré **et préservé**) · pastille de version, metas anti-cache, **bloc diagnostic verbatim** · responsive 390 px · mention « VERSION À COMPLÉTER » · **mode test étendu** : les élèves fictifs ont désormais des codes déterministes dans `/codes`, purgés à la sortie — sans quoi le nouveau portail aurait refusé le bac à sable (c'est exactement ce qui était arrivé à la souche en M6).

---

## 5. Deux erreurs de ma main, et une du banc — déclarées

**① J'ai commis l'incident contre lequel tu m'avais mis en garde.** Mon remplacement global de `"Attends la prochaine question."` → `txt("attente_question")` a frappé **la définition du dictionnaire elle-même**, produisant `attente_question: txt("attente_question")` — une définition récursive. C'est le banc qui l'a attrapé, pas moi, et pas les parseurs (syntaxe valide). Réparé. *La leçon du registre sur les rechercher-remplacer globaux se vérifie sur moi-même, deux heures après l'avoir lue.*

**② Mes premiers tests du barème étaient faux, pas le code.** Je supposais que `calculerScoreQuestion` rendait un nombre ; elle rend `{score, max, ok, partiel}`. J'ai lu le contrat réel et réécrit les tests dessus, plutôt que de « corriger » un calcul sain.

**③ Le banc était cassé par sa propre garde.** La suite M6 se déclenchait sur `function Nav2(` — qui n'identifie pas la souche mais **toute app passée à la grille**. Elle s'est appliquée au QCM et a planté. Corrigé par `idDeLApp()`, qui lit la déclaration réelle de `MJPC_APP` — au deuxième essai : le premier matchait l'**exemple commenté** du socle, présent dans toutes les apps. Symptôme observé → instruit → cause prouvée, jamais attribué à l'environnement.

**Les 3 échecs sur la souche ne sont pas des régressions** : `hub_all.json` a été tiré aujourd'hui et le hub a bougé depuis M6 — Léonie a maintenant un résultat sur l'Utopie, et `clement_lylou` existe désormais en clé canonique à côté de `CL_MENT_Lylou`. Vérifié sur les données. **Dette D6** : trois tests M6 sont couplés à un état de données mouvant.

---

## 6. Textes soumis à Paul (point 26, jamais décidés seul)

**Convertis au « je » (accompli et adresse)** : « ⏸️ **J'ai** mis le chrono en pause » · « ⏱️ **J'ai** ajouté du temps de réflexion » · « ⏱️ **J'ai** ajouté N secondes » · « 🔔 **Mes** messages » · « Voir l'historique de **mes** messages ».

**Passés au flux impersonnel (inaccompli — jamais le professeur en défaut)**, et devenus éditables :
- `attente_session` : « L'évaluation n'a pas encore commencé. Elle s'ouvrira quand nous la lancerons ensemble. »
- `attente_correction` : « La correction s'ouvrira dans un instant. » *(remplace « Attends que le professeur lance la correction… »)*
- `attente_question` : « Attends la prochaine question. » *(constat, mais éditable car il rythme la séance)*
- `fin_session` : « C'est terminé. Tes réponses sont enregistrées. » *(parle du travail fait, jamais de la réussite — leçon du « Bravo »)*

**Point à ton arbitrage** : j'ai rendu `attente_question` éditable alors que c'est plutôt un constat. Je l'ai fait parce qu'il dépend du rythme de la séance, mais le critère du point 26 plaiderait pour le laisser en dur. À trancher.

---

## 7. Couverture du test — ce qui n'a PAS été joué

**Exercé** : les fonctions pures au banc sur données réelles (barème dans les deux modes, plancher à zéro, sur-sélection, question sans bonne réponse, scores réels ne dépassant jamais le maximum), la logique P2 (snapshot, versions, repli), les gardes de structure, les textes.

**NON exercé, et je ne peux pas l'exercer** : je n'ai pas de navigateur qui peint. Rien de ce qui suit n'est prouvé par moi — **le parcours complet reste entier à jouer** :
- lancer une session, répondre depuis un appareil élève, clôturer, **vérifier que `evalSnapshot` s'écrit réellement** ;
- modifier ensuite l'évaluation, vérifier que la version passe à 2 et que **les résultats de la veille n'ont pas bougé** ;
- entrer comme élève avec un code réel, et par le shunt de session ;
- créer le bac à sable, incarner un élève fictif avec son code généré, purger, vérifier qu'aucun code fictif ne reste dans `/codes` ;
- **le bloc C à deux appareils** : chrono, pilotage en direct, réponses simultanées — la couche que le harnais ne voit pas par construction, et d'où vient le bug de Maëva.

---

## 8. Dettes

**D1** — #7 médiane décimale · **D2** — #8 `eleveSexes` orphelins (relève du site) · **D3** — #14 fourchettes pour total ≤ 2 · **D4** — #9/#10/#11 mineurs · **D5** — signalement visuel des sessions non figées (`sessionEstFigee` existe, l'affichage manque) · **D6** — trois tests M6 couplés à des données mouvantes · **D7** — présence QCM à aligner sur le contrat du site (inventaire fait : `qcm/presence/<classe>/<élève>` = `{nomComplet, last}`, heartbeat 8 s, `onDisconnect().remove()`, **pas de `sendBeacon`**, entrée supprimée au lieu d'être marquée `offline` — donc aucune trace après coup) → lot présence, avec la souche · **D8** — « Mes évaluations » (point 8) **non fait faute de temps**, à reprendre : les briques existent (`EleveBilan` lit déjà `mjpcProfils`, `EleveSessionPasseeRow` affiche les sessions passées) · **D9** — chantier V (prompt de génération IA, cause racine de P2) : `ModalPromptIA` n'a été que rangé, comme demandé.

---

## 9. Avant promotion

Audit de la conscience (dont visuel desktop + mobile 390 px) · **arbitrage des textes du §6** · **test de Paul avec le bloc C à deux appareils** · les dettes D1-D4 à solder ou justifier · promotion sur son ordre. Je ne promeus pas.
