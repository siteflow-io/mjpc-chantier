# M7 — SPEC VIVANTE · QCM (`evaluation-qcm`)
*Exécutant M7, tour 2. Aucun code écrit, aucune écriture hub.*

**Base de travail** : `evaluation-qcm.html` production — **7 647 lignes, 470 628 o, md5 `712059bdb427b7b00318da2a17be6e2b`** (copie de référence conservée). Registre relu : md5 `5caa79c9a9637e5cd23373c08c6a811a`.

---

## A. Les 17 bugs — état vérifié sur pièces

Vérification faite avant toute autre chose, comme demandé.

| # | Bug | État constaté | Preuve |
|---|---|---|---|
| 1 | `classe.slug` undefined dans `EleveBilan` | **CORRIGÉ** avec repli documenté | L3083-3086 : `p.classe.slug \|\| slugClasse(p.classe.nom \|\| "")` + commentaire expliquant le cas `EleveSimule` |
| 2 | Classe de test non filtrée en 5 endroits | **CORRIGÉ**, socle appliqué | `estClasseTest()`/`estClasseInterne()` du socle utilisés ; ex. L2703 `if(classeSlug === TEST_CLASSE_SLUG \|\| estClasseTest(classeSlug) \|\| estClasseTest(classe.nom)) return;` — **mais voir constat C1** |
| 3 | `ajouterClasse` réintroduisait les sexes M/F | à traiter — **la fonction part avec l'onglet** (Q5 validée) | `OngletClasses` L4943 |
| 4 | Lectures de `classesData` au mauvais format | **CORRIGÉ** : `normaliserClassesQCM` L1294 produit `{slug, nom, eleves, niveau}` indexé par slug, appliqué en amont | L1294-1306 |
| 5 | Snapshots ne couvrant plus `/classes` | **CORRIGÉ** en version 2 | L1586-1610 : `Promise.all([db.ref(DB_ROOT).once, db.ref("classes").once])`, `payload.classes` — **mais voir constat C2** |
| 6 | **Chrono — clics fantômes (Maëva)** | à vérifier au tour de code (couche temps réel) | fix annoncé : `chronoRestant` dans `peutRepondre` + `disabled` + 4 messages |
| 7 | `width:100vw` dans `VueBoard` | à vérifier | `VueBoard` L3826 |
| 8 | Blocage correction (`qIdx` au lieu de `correctionIdx`) | à vérifier | `VueBoard` L3826, `VuePhone` L4214 |
| 9 | Champ `explication` abandonné par `parseEvaluation` | à vérifier | `parseEvaluation` L1500 |
| 10 | **Recalcul rétroactif des scores** = **P2** | **NON CORRIGÉ — confirmé** | voir §B |
| 20 | Sessions actives supprimées abusivement | **CORRIGÉ** | L7495 : `var classes = normaliserClassesQCM(results[2].val())` avant le test `!classes[slug]` L7512 |
| 21 | Fuite de listener `SessionLive` | **CORRIGÉ** | L6261 `.on` et L6264 `.off` utilisent tous deux `slug` |
| 22 | Snapshots sans les classes | **CORRIGÉ** (même fix que #5) | L1586-1610 |
| #7 moyen | Médiane décimale affichée telle quelle | à vérifier | `construireCompaBilan` L2594, `EleveBilan` L3080+ |
| #8 moyen | `qcm/eleveSexes/<nom>/*` orphelins | à vérifier — **disparaît sans doute avec l'onglet classes** | L4615 |
| #14 moyen | Fourchettes invalides (total ≤ 2) | à vérifier | `bornesFourchette` L3054, `libelleFourchette` L3062 |
| #9 mineur | Commentaire trompeur `mjpcProfils` | à vérifier | L956 |
| #10 mineur | `.sort()` sans comparateur | à vérifier | `preparerQuestionsBilan` L2672 |
| #11 mineur | `surveillerClassesAvecSexes` : deux `setState` | à vérifier | L1321 |

**Les cinq « corrigés » ci-dessus le sont réellement dans le fichier de production** ; je les reverifierai après mes modifications (non-régression), c'est là le vrai risque.

---

## B. P2 — le mécanisme exact, et où le neutraliser

**Confirmé, non corrigé.** Aucun score n'est stocké : ils sont **recalculés à chaque affichage** depuis l'évaluation courante.

- `calculerScoreQuestion(choix, bonnes, mode)` L1233 et `scoreMaxEval(ev)` L1223 sont appelés à la volée par `EleveResultats` (L2006-2009), `preparerQuestionsBilan` (L2675-2678), `archiverDansProfilsMJPC` (L2705-2738), `EleveBilan` (L2861-2866).
- Firebase ne conserve que `sessions/<id>/reponses` (les choix bruts) — **jamais le barème ni les bonnes réponses du jour de la session**.
- Conséquence : corriger une coquille dans `ev.questions[i].bonnes`, changer `ev.mode`, ou ajouter/retirer une question **change les scores de toutes les sessions passées**, y compris ceux déjà archivés au profil longitudinal.

**Voie A retenue (snapshot à la clôture).** Ancrage :
- **Deux chemins de clôture existent** et sont dupliqués : `sessActions.terminerSession` L2967 et `terminerSession` de `OngletPilotage` L5830 (plus `updates["/sessions/"+sid+"/etat"]` L5765). **Premier geste : une seule fonction de clôture**, sinon le snapshot manquera par un des chemins — c'est exactement le point 20.
- **Ce que le snapshot doit figer** : l'énoncé (`questions` avec `bonnes`, `ponderation`), le `mode`, et les maxima dérivés (`scoreMaxEval`, `calculerMaxPondere`). Écrit sous `sessions/<id>/evalSnapshot`.
- **Lecture** : partout où l'évaluation sert au calcul d'une session **close**, lire `sess.evalSnapshot` en priorité, `evals[sess.evalId]` en repli (sessions closes avant cette livraison). Un accesseur unique — `evalDeSession(sess, evals)` — et **aucun autre point d'accès**, sinon le piège renaît au premier oubli.

**Question de portée (Q6 ci-dessous)** : les sessions déjà closes n'ont pas de snapshot. Faut-il en fabriquer un rétroactivement (écriture hub hors `_test_`, donc soumise au vert de Paul), ou les laisser en repli sur l'éval courante ?

---

## C. Mes propres constats de lecture (présentés comme tels, hors registre)

- **C1 — `estClasseInterne` est défini DEUX FOIS** : L1052 (socle MJPC-CORE, signature `(nom)` → chaîne) et L1311 (code app, signature `(classe)` → objet avec `.nom`). **La seconde écrase la première pour tout le fichier.** Les appels du socle qui passent une chaîne — notamment `estClasseTest(nom)` L1053, qui appelle `estClasseInterne(nom)` — reçoivent donc une fonction qui attend un objet et renvoie `false` sur une chaîne. Conséquence probable : `estClasseTest("_test_evaluation-qcm")` retourne `false`, et seule l'égalité littérale `classeSlug === TEST_CLASSE_SLUG` sauve les filtres. **C'est une régression silencieuse du socle**, et exactement la famille « classe de test non filtrée » du registre. À instruire au tour de code avant de conclure — je ne l'affirme pas encore.
- **C2 — `effacerSession` snapshote sans les classes** : L7040 `db.ref(DB_ROOT).once("value")` — le même défaut que le bug #22, à un autre endroit, non couvert par le fix de `snapshotExport`. Le fichier `qcm_AVANT-effacement_*.json` promis à Paul dans la confirmation ne contient donc pas les classes.
- **C3 — incohérence `"termine"` / `"terminee"`** : la clôture écrit `"terminee"` (L2971, L5833) ; le nettoyage teste `sess.etat === "termine"` (L7515) et réécrit `"termine"` (L5765, L7561). **Une session terminée normalement n'est jamais reconnue comme telle** par le nettoyage des sessions actives.
- **C4 — aucune pastille de version, aucun meta anti-cache, aucun bloc diagnostic** (points 18 et 23).
- **C5 — responsive** : 5 `@media` seulement, dont 3 pour l'impression et 2 pour la grille de pilotage (1200 px et 768 px). **Rien en 390 px** (point 17).
- **C6 — présence** (inventaire pour le futur lot, aucun code) : contrat propre à l'app, `qcm/presence/<classeSlug>/<eleveSlug>` = `{nomComplet, last}`, heartbeat 8 s, `onDisconnect().remove()`, lu par `SessionLive` L6261. **Écart avec le contrat du site** : nœud sous `qcm/` au lieu de `/presence` racine, pas de contexte de travail, pas de `sendBeacon` (0 occurrence), et l'entrée est **supprimée** au départ au lieu d'être marquée `offline` + `last_seen` — donc aucune trace après coup.

---

## D. Le découpage, écran par écran

**1. `App` racine (L1669)** — routage prof/élève/test. *Touché* : pastille de version, metas anti-cache, bloc diagnostic en tête de script.

**2. `AppProf` (L4608) — navigation deux niveaux.** Barre plate actuelle (L4713-4717) : `📋 Classes · 📝 Évaluations · 🎯 Pilotage classe · 📊 Résultats · 💾 Sauvegarde`.
Cible : `Pilotage{Préparation · Évaluations · Pilotage classe}` · `Données{Résultats · Sauvegarde}` · `Réglages` + « ? ». Atterrissage sur **Pilotage → Pilotage classe** (le travail principal ; l'atterrissage actuel est `classes`, qui disparaît).
**Méthode** : un état `groupe` au-dessus de l'état `tab` existant ; **les composants d'onglets sont montés à l'identique**, mêmes props. Structure seule — aucune règle CSS de la charte modifiée (S0-④ / A1).

**3. Retrait de l'onglet Classes.** `OngletClasses` L4943 et `ajouterClasse` supprimés ; une carte dans Réglages renvoie vers la console par `renvoyerVersMJPC("...")`. **Preuve par grep exigée avant toute suppression** (point 20) : je listerai chaque référence retirée. À vérifier : `NiveauxEditor` L6000 et `PonderationEditor` L7401 sont-ils logés dans cet onglet ? S'ils y sont, **ils déménagent dans Réglages, ils ne disparaissent pas**.

**4. Préparation (nouveau sous-onglet).** `ModalCreerEval` L5409 + `PreviewEval` L5483 + `ModalPromptIA` L5334 existent déjà : Préparation les monte pour l'évaluation courante, sans les réécrire. `parseEvaluation` L1500 n'est pas touché (point 27 : aucune tokenisation nouvelle ; je vérifie seulement le champ `explication`, bug #9).

**5. Réglages (nouveau).** Candidats : `NiveauxEditor`, `PonderationEditor` (s'ils viennent de l'onglet Classes), le renvoi MJPC pour l'identité, et l'éditeur de textes (point 26).

**6. « ? » (nouveau).** `ModeEmploi` L4778 existe — je le **range derrière le « ? »**, je ne le réécris pas, et j'y ajoute le lecteur d'annonces `site/annonces`, tolérant à l'absence du nœud (chemin figé en M6).

**7. Connexion élève (point 7).** `EleveLogin` L1785 : aujourd'hui **prénom + nom en texte libre**, comparés au roster par slug, **aucune preuve d'identité** — n'importe qui entre en tant que n'importe qui. Cible : code MJPC + nom + prénom vérifiés contre `/codes`, plus le shunt `lireSessionMJPC`/`validerEleveMJPC`. **Prérequis** : le socle embarqué est en **v1.0.0 sans le §8** (`lireSessionMJPC` et `validerEleveMJPC` absents, vérifié) → recopie verbatim de `mjpc-core.js` v1.1.0, comme en M6.
**Point d'attention propre au QCM** : l'entrée élève passe aussi par **QR code** (`OverlayQRPhone` L4180, `qcm/qrScans`). Il faudra vérifier que le portail ne casse pas ce flux — question Q7.

**8. « Mes évaluations » (point 8).** À **recycler** de l'existant : `EleveBilan` L3080 lit déjà `mjpcProfils/<classeSlug>/<slug>/sessions`, et `EleveSessionPasseeRow` L1924 affiche déjà les sessions passées. Je compose un écran « Mes évaluations » à partir de ces deux briques — **lecture seule, aucune écriture, aucun recalcul nouveau**.

**9. Textes (points 25, 26, 28, principe cardinal).** Relevé initial : `« ⏳ Attends que le professeur lance la correction… »`, `« ⏸️ Pause demandée par le professeur »`, `« ⏱️ Le professeur a ajouté du temps de réflexion »`, `« En attente d'une session active… »`, `« 🔔 Messages du professeur »`. Aucun n'impute de manquement, mais tous parlent du professeur à la 3e personne (point 28). Reformulations à **soumettre**, jamais décidées.

**10. Mode test (point 16) — analyse, pas remplacement.** L'existant (`AppTest` L3453) fait déjà : nettoyage des zombies au montage, classe `_test_evaluation-qcm` (convention ✔), éval de test, session lancée, simulation d'élèves (`EleveSimule` L3714), purge exhaustive en sortie (L3510-3527 : sessions, sessionActive, classe, eleveSexes, évaluation, présence). **C'est bien le patron de l'écosystème, je ne le dégrade pas.** Deux extensions que mes ajouts rendront nécessaires : ① les élèves fictifs auront besoin de **codes** dans `/codes` (sinon le nouveau portail les refuse — c'est précisément ce qui était arrivé à la souche en M6), et la purge devra les effacer ; ② vérifier que le mode test couvre encore la chaîne après le portail.

**11. Responsive 390 px** (point 17) : nav deux niveaux, portail élève, « Mes évaluations », Réglages, « ? ». Les grilles de pilotage ont déjà 1200/768 px ; je descends à 390 px sans toucher la charte.

---

## E. Ce que je ne touche pas

La **charte** (gradient, couleurs, ambiance) · le **moteur de double barème** (`calculerScoreQuestion`, `scoreMaxEval`, `calculerMaxPondere`) — je l'instrumente au banc, je ne le réécris pas · le **bilan longitudinal** et `archiverDansProfilsMJPC` (patron M15) — recyclés, pas refondus · le **chrono et le pilotage temps réel** (`SessionLive`, `VueBoard`, `VuePhone`) sauf si un bug du registre l'exige, et alors signalé comme non testable de mon côté · le **mode test** (étendu, pas remplacé) · `parseEvaluation` (point 27) · les **données hors `_test_`**.

---

## F. Questions

**Q6 — P2, portée rétroactive** : les sessions déjà closes n'ont pas de snapshot. ① On les laisse en repli sur l'éval courante (le piège reste ouvert pour elles, mais aucune écriture hub) ; ② on fabrique leur snapshot une fois, depuis l'état actuel des évals — ce qui **fige l'état d'aujourd'hui, pas celui du jour de la session** (donc fige peut-être déjà des scores faux) ; ③ on ne fige que les sessions non encore modifiées, si c'est décidable. Je penche pour ① + un signalement visible côté prof, mais c'est une écriture hub potentielle : décision de Paul.

**Q7 — le QR code** : `OverlayQRPhone` + `qcm/qrScans` semblent constituer une seconde porte d'entrée élève. Le portail MJPC doit-il ① s'appliquer aussi après scan (le QR amène à la classe, le code prouve l'identité — cohérent avec la décision M6 sur le lien nominatif), ou ② le scan vaut-il preuve suffisante ? Je recommande ① par cohérence, mais le QR est un geste de classe dont je ne connais pas le déroulé réel.

**Q8 — `NiveauxEditor` et `PonderationEditor`** : s'ils vivent dans l'onglet Classes, je les déménage en Réglages (jamais je ne les supprime). Confirmer que Réglages est leur bonne destination, plutôt que Préparation — `PonderationEditor` touche au barème, donc à la préparation d'une évaluation.

**Q9 — le double barème et le point 14bis** : je ne modifie pas le calcul, mais dois-je livrer **ses tests au banc** dans cette passe (ils n'existent pas) ? Le plan dit « aucune mécanique de comptage ne se livre sans ses tests ». Le calcul n'est pas livré par moi, mais P2 le fige — donc je le fais entrer dans un contrat. Je propose de livrer les tests (cas piégeux : réponse partielle, sur-sélection, question sans bonne réponse, total ≤ 2 pour le bug #14). Confirmer que ce n'est pas hors périmètre.

---

## G. Registre M7 (spec vivante)

**À faire** : socle v1.1.0 · nav 2 niveaux · retrait onglet classes + `renvoyerVersMJPC` · Préparation · Réglages · « ? » + annonces · portail élève + shunt · « Mes évaluations » · P2 voie A (clôture unifiée + `evalSnapshot` + accesseur unique) · pastille version + anti-cache · bloc diagnostic · responsive 390 · textes (25/26/28 + cardinal) · mode test étendu aux codes · vérification des 17 bugs.

**Constats à instruire** : C1 doublon `estClasseInterne` · C2 `effacerSession` sans classes · C3 `termine`/`terminee`.

**Dettes pressenties** : présence QCM à aligner sur le contrat du site (lot présence, avec la souche) · `qcm/eleveSexes` (sort du périmètre avec l'onglet classes — à décider) · Concordance (M19+).

**STOP** — j'attends la validation de cette spec et les réponses Q6-Q9 avant de coder.
