# M7 bis — RAPPORT · les trois points bloquants
*Exécutant M7, 18/07/2026. Sas — aucune promotion, aucune écriture hub.*

**Livrable** : `evaluation-qcm.staging.html` — md5 **`8637a41b34a1c39639090c9e4c18cdba`**.
Parseurs : `node --check` **OK**, `acorn` **OK**. Banc : **102/102** sur l'export réel (83 → 102).
Non-régression : souche `correction_dictee` **145/148** (les 3 échecs restent ceux des données, §6), QCM production **5/5**.

---

## ① P2 — les portes dérobées, refermées

**Ma faute d'abord.** J'ai écrit « aucun `.set("terminee")` direct ne subsiste » sans avoir passé le grep. Il en restait **trois**, pas deux : tu en as vu deux, il y avait aussi `terminerDefinitivement` (L5983 de la version auditée). Une affirmation de checklist qui repose sur l'intention plutôt que sur la commande est exactement ce que le serrage de la vis interdit — et elle m'a fait rater un cas de plus que l'audit.

**Preuve par grep, cette fois.** Commande : `grep -c 'etat").set("terminee")\|etat"] = "terminee"'` → **2**, et les voici :

| Ligne | Où | Statut |
|---|---|---|
| **1399** | *dans* `cloturerSession` | c'est la seule écriture légitime |
| **7919** | nettoyage en lot | traité, voir ci-dessous |

`grep -n "cloturerSession("` → **5 lignes** : la définition (1396) et **4 appels** (3340 `sessActions.terminerSession`, 5214 `purgerSessionMenu`, 6106 `terminerDefinitivement`, 6174 `terminerSession` du pilotage). Les quatre chemins de clôture passent désormais par la même fonction.

**Porte 1 — `purgerSessionMenu` (L5092).** Le bouton du menu de sessions clôturait sans figer. Routé par `cloturerSession`. Il lui fallait les évaluations : `AppProf` les charge maintenant dans `evalsPourCloture`.

**Porte 2 — `terminerDefinitivement`.** Une session interrompue que le professeur termine **est** une clôture : ses réponses restent consultables, donc son énoncé doit être figé comme les autres. Routée aussi.

**Le nettoyage en lot (L7919) — décision et justification.** Cas différent, comme tu l'as noté : ces sessions sont abandonnées (>24 h), jamais clôturées. **J'ai choisi de les figer, en disant ce que je fige.**

- *Pourquoi figer* : le nettoyage annonce explicitement que « les données des sessions et leurs réponses sont CONSERVÉES ». Ce sont donc de vraies réponses d'élèves qui survivent. Sans snapshot, elles restaient **la dernière porte ouverte du recalcul rétroactif** — précisément ce que la passe devait fermer.
- *Pourquoi le marquer* : l'énoncé disponible au moment du nettoyage est celui d'aujourd'hui, qui n'est peut-être plus celui du jour de la session. Écrire `evalSnapshotOrigine: "nettoyage"` empêche de faire passer ce figement pour un autre. `sessionEstFigee` reste vrai, mais l'origine est lisible.
- *Et le prof le sait* : la confirmation dit maintenant « L'énoncé actuel de chaque évaluation sera figé sur ces sessions […] (marqué « figé au nettoyage » : ce n'est pas forcément l'énoncé du jour de la session) ».

L'alternative — les laisser non figées — donnait une catégorie de sessions durablement exposées au recalcul, sans que personne s'en souvienne. J'ai préféré un figement honnête à une exception silencieuse. Si Paul préfère l'inverse, c'est une ligne.

**Tests au banc** : 7 tests dédiés, dont le comptage du grep lui-même (`ecrituresEtat === 2`), et deux tests qui vérifient que les deux portes ne peuvent plus écrire l'état directement (regex sur le corps des fonctions).

---

## ② Le portail élève — contestation sourcée, et un vrai défaut corrigé

**Sur les faits, je conteste, preuve à l'appui.** Le portail à code **était** monté dans la version auditée :
- `grep -n "EleveLogin"` → **L1979** : `return h(EleveLogin, {classe:classes[classeSlug], …})` ;
- le rendu de `EleveLogin` contient bien `placeholder:"Mon code (4 chiffres)"` et le refus `if(!code.trim())`.

Il est monté **au deuxième écran**, après le choix de classe. L'écran 1 (« 🎓 Choisis ta classe ») est inchangé, et il n'y a **pas de liste de noms** dans le portail — je ne retrouve pas ce que ton harnais décrit. Deux hypothèses que je ne peux pas départager d'ici : le harnais s'est arrêté au premier écran, ou il a rendu le fichier de production. Je le signale sans conclure.

**Mais ton constat pointait un vrai défaut, ailleurs.** Le shunt `lireSessionMJPC` était **dans `EleveLogin`**, donc **après** le choix de classe : un élève déjà connecté au site devait quand même désigner sa classe à la main, alors que sa session la porte. Le point 7 n'était rempli qu'à moitié.

**Corrigé** : le shunt remonte au niveau d'`AppEleve`. Une session MJPC valide détermine **classe et identité d'un coup** — l'élève connecté au site n'a plus rien à choisir ni à saisir. Sans session, rien ne change : le portail à code reste le seul chemin. Le shunt ignore les classes internes (`estClasseInterneObj`) et les sessions professeur (`sess.is_prof`). Trois tests au banc.

---

## ③ « Mes évaluations » — livré

Assemblé des briques existantes, comme demandé : le profil longitudinal (`mjpcProfils/<classe>/<élève>/sessions`) écrit par `archiverDansProfilsMJPC` **est** le modèle ; je lui donne un lieu, je ne le réécris pas.

- Liste des évaluations passées, la plus récente en tête, avec date et pourcentage.
- Ouverture du bilan détaillé **tel qu'il a été archivé** (`bilanHTML`) — **aucun recalcul de score** : P2 interdit de recompter après coup. *Preuve au banc* : le corps du composant ne contient ni `.set(`, ni `.update(`, ni `.remove(`, ni `calculerScoreQuestion`, ni `scoreMaxEval`.
- **Les versions ne se confondent pas** : une évaluation en v2 porte son marqueur dans la liste (P2 ③).
- Liste vide : « Tu n'as pas encore d'évaluation ici. Celles de ta classe apparaîtront après la correction. » — une annonce, jamais un reproche, et personne n'est mis en défaut.
- Accessible depuis l'écran élève par « 📊 Mes évaluations ».

---

## ④ Arbitrage appliqué

`attente_question` **repasse en dur** : c'est un constat, le critère du point 26 s'applique tel quel. Il ne reste que **trois** textes éditables — `attente_session`, `attente_correction`, `fin_session` — tous des annonces. *Preuve au banc* : `TEXTES_DEFAUT` compte exactement 3 clés, et le texte « ⏳ Attends la prochaine question… » est de retour en littéral.

---

## ⑤ Dettes traitées dans cette livraison

- **D1 (#7 médiane décimale)** : **déjà corrigé avant moi**, je l'avais consigné à tort. Preuve : `var medianeAff = Math.round(mediane);` avec le commentaire du fix. Test ajouté pour verrouiller.
- **D3 (#14 fourchettes invalides)** : **corrigé**. Sur un total de 2, « bleu » donnait `inf=2, sup=1` — soit « entre 2 et 1 ». Les bornes sont maintenant refermées (`if(b.inf > b.sup) b.inf = b.sup;`) et bornées à `[0, total]`. *Preuve* : test exhaustif au banc sur **tous les totaux de 0 à 40 × 4 fourchettes**, aucune borne inversée.
- **D2 (#8 `eleveSexes` orphelins)** : sans objet dans le QCM — la suppression de classe n'y existe plus. Le nettoyage appartient au site.
- **D4 (#9/#10/#11 mineurs)** : non traités, faute de budget. Consignés.

---

## ⑥ Intégrité

**14 composants intacts octet pour octet** vs production : `EleveBilan`, `EleveCorrection`, `Scoresheet`, `BilanClasse`, `StudentReport`, `genererBilanHTML`, `preparerQuestionsBilan`, **`calculerScoreQuestion`**, **`parseEvaluation`**, `OverlayQRPhone`, `NiveauxEditor`, `PonderationEditor`, `FeuilleImpression`, `construireCompaBilan`. **Le moteur de barème et le parseur n'ont pas été touchés de toute la passe.**

**7 modifiés**, aux lignes comptées : `VueBoard`(1), `VuePhone`(1), `SessionLive`(1), `EleveEval`(3), `EleveAutoeval`(1) — textes élève ; `AppTest`(6), `EleveSimule`(2) — extension du bac à sable.

**Les 3 échecs sur la souche ne sont pas des régressions** : vérifié sur les données, le hub a bougé depuis M6 (Léonie a désormais un résultat sur l'Utopie ; `clement_lylou` existe en clé canonique à côté de `CL_MENT_Lylou`). Dette D6 inchangée : ces tests sont couplés à un état mouvant.

**Un test de ma suite était faux** : « plus aucune mention du professeur » attrapait mes propres commentaires (le regex enjambait les guillemets). Corrigé en retirant les lignes de commentaire avant extraction — le même faux positif qu'en M6, que j'aurais dû anticiper.

---

## ⑦ Ce qui reste non prouvé par moi

Inchangé et entier : je n'ai pas de navigateur qui peint. **Le bloc C à deux appareils reste indispensable** — écriture réelle de `evalSnapshot` à la clôture, passage en version 2 sans que les résultats de la veille bougent, entrée élève par code et par shunt, bac à sable avec incarnation et purge des codes, chrono et réponses simultanées.

**Dettes ouvertes** : D2 · D4 (#9/#10/#11) · D5 (signalement visuel des sessions non figées) · D6 (tests couplés aux données) · D7 (présence à aligner, lot commun avec la souche) · D9 (chantier V, prompt IA).

Je ne promeus pas.
