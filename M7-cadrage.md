# M7 — NOTE DE CADRAGE · QCM (`evaluation-qcm`)
*Exécutant M7, tour 1. Aucun code, aucune app téléchargée.*

**Lu intégralement** : `docs/MJPC6-plan-de-travail.md` (956 lignes, 207 830 o, md5 `416fb72a65a2fa1dbe49bf23bbc4583a`) et `docs/MJPC6-registre-bugs.md` (218 lignes, 23 877 o, md5 `d3827fe3d0f04df40227f91d695c5146`).

## 1. Le dispositif (3 lignes)

Une **conscience** (mémoire du chantier, audits sur lectures complètes, tenue du plan, seule détentrice de la clé de production) et des **exécutants** (un morceau, périmètre gelé, livraison au sas `mjpc-chantier`, commits signés). Le **plan est le pont** : toute règle m'arrive par lui, jamais par les messages de Paul ; je le relis à l'ouverture et à chaque reprise. Le **verrou** : je ne promeus jamais, aucune écriture hub hors `_test_`, la promotion se fait sur le mot « promeus » de Paul après audit vert et son essai.

Le **serrage de la vis** du 18/07, que j'applique sans qu'on me le rappelle : ① aucun symptôme écarté — deux issues seulement, prouvé artefact ou ouvert comme anomalie, « probablement mon environnement » est interdit ; ② je teste **le parcours**, pas le point corrigé — le bug M6 vivait *entre* les étapes ; ③ mon rapport est une **checklist à preuves**, une ligne sans preuve rend la livraison non auditable.

## 2. Ce qu'est le QCM dans l'écosystème, et ce qui le distingue

**Trois choses le rendent différent de la souche :**

- **Sa charte propre est CONSERVÉE** (décision du 15/07) : gradient violet/rose/turquoise. Elle n'est pas un retard d'uniformisation mais une identité assumée — le QCM et l'applaudimètre sont cités par Paul parmi ses apps les plus abouties. J'applique donc **la grammaire structurelle, jamais l'habillage** : deux niveaux, ⓘ, Préparation, Réglages sont des rangements ; les couleurs ne bougent pas d'un octet.
- **Il porte LE bilan longitudinal élève** — « le précédent de tous les *Mes…* » (plan L301, L143). « Mes évaluations » ne s'invente pas ici : il se **recycle de son propre bilan**. Et son `archiverDansProfilsMJPC` est le patron doctrinal désigné pour M15. Je touche donc cette zone avec la main la plus légère possible : c'est un modèle pour les autres, pas un chantier.
- **C'est l'app la plus temps réel de l'écosystème** : chrono, pilotage en direct, réponses simultanées de 30 tablettes. C'est précisément **l'angle mort structurel du harnais** (adaptateur REST en polling, pas de websocket) — et c'est de là que vient le bug le plus grave du registre, les clics fantômes de Maëva. D'où le bloc C à deux appareils au critère de fin.

Un quatrième trait, moins flatteur : **c'est l'app dont le désordre produisait les bugs**. Lectures de `classesData` au mauvais format éparpillées, classe de test non filtrée **en cinq endroits**. Le point 20 n'est pas décoratif ici, il est la cause racine.

## 3. Les points de grille que j'appliquerai

- **Pt 1** — Accueil d'instances : vérifier l'existant (onglet `evals`) et l'aligner sur le patron souche (liste + badges d'état + création) sans toucher la charte.
- **Pt 2** — Navigation deux niveaux `Pilotage · Données · Réglages` + « ? », atterrissage sur le travail principal. **Structure seule** (voir question Q1).
- **Pt 4** — Sous-onglet Préparation = édition complète d'une évaluation créée.
- **Pt 5** — Onglet Réglages (principe « doter »).
- **Pt 6** — ⓘ sur les badges, boutons et mentions non évidentes — en priorité sur le **double barème**, qui est le plus opaque de l'app.
- **Pt 7** — Connexion élève : code MJPC + nom + prénom (socle §8) + shunt `lireSessionMJPC`/`validerEleveMJPC`. Vérifier d'abord ce que fait réellement l'entrée élève aujourd'hui.
- **Pt 8** — « Mes évaluations », **recyclé du bilan longitudinal existant**, pas réécrit.
- **Pt 10** — « ? » : aide d'usage + lecteur d'annonces sur `site/annonces`, tolérant à l'absence du nœud (chemin déjà figé en M6).
- **Pt 11** — Manifeste/purge à jour si les nœuds évoluent (notamment le retrait de l'onglet classes et tout nœud de textes).
- **Pt 14** — Wording élève : test du collégien sur tous les écrans.
- **Pt 14bis** — **Intégrité du comptage** : le double barème (« Tout ou rien » / « Points par bonne case ») ne se livre pas sans ses tests au banc. C'est le point le plus sensible de cette passe.
- **Pt 16** — Mode test : **analyser d'abord**. C'est LUI le patron de l'écosystème (le débat en a été transposé) — je ne le dégrade pas ; je vérifie qu'il couvre encore la chaîne réelle après mes ajouts (connexion MJPC comprise).
- **Pt 17** — Responsive 390 px.
- **Pt 18** — Pastille de version + metas anti-cache.
- **Pt 19** — **P2 neutralisé** (voir §5).
- **Pt 20** — Structure du code : section dédiée pour tout ajout, aucune suppression sans preuve par grep, pas de fonction cachée sous une autre. **On déplace, on ne réécrit pas** ; « fais au plus secure ».
- **Pt 22** — Présence : inventorier ce qui existe (voir question Q4).
- **Pt 23** — Bloc diagnostic en tête de script, depuis `docs/MJPC6-bloc-diagnostic.md`.
- **Pt 25** — Les textes en dur disent le flux réel, vérifiés **dans les deux états** de chaque toggle.
- **Pt 26** — Textes éditables selon le critère : *constater = en dur, annoncer = éditable*. Trois ou quatre champs, pas trente.
- **Pt 27** — **Aucune tokenisation nouvelle.** Si `parseEvaluation` fait du découpage, j'emprunte l'existant ; je n'écris pas la dix-septième fonction.
- **Pt 28** — « L'app, c'est moi », **subordonné au principe cardinal** : le professeur est sujet de ce qui est FAIT, jamais de ce qui MANQUE.
- **Principe cardinal** — relecture de tous les textes élève : aucun manquement imputé au professeur, aucune révélation que la machine fait le travail, aucun défaut système raconté en désignant quelqu'un.
- **Retrait de l'onglet classes** — l'identité appartient au site (voir question Q5).
- **Les 17 bugs du registre** — chacun constaté corrigé ou consigné (voir question Q2).

**Sans objet ou hors périmètre** : pt 3 (charte propre conservée — la largeur par type d'écran reste à vérifier, elle est structurelle) · pt 9 (branchement au site : à confirmer, dépend des décisions Q4-Q7 du site) · pt 12 (Fondements, M18+) · pt 13 (Concordance : le plan note que le QCM « n'a rien d'explicite », référentiels implicites — M19+) · pt 15 (à vérifier : le QCM est déjà « un moteur, N contenus » par nature) · pt 24 (alerte règles Firebase : c'est `index.html`, M8).

## 4. Ce que je m'interdis de toucher

- **La charte** : gradient, couleurs, ambiance. Décision de Paul, pas un retard.
- **Le moteur de double barème** : je peux le tester, l'instrumenter, l'expliquer par des ⓘ — je ne le réécris pas. Toute modification de comptage viendrait avec ses tests (14bis).
- **Le bilan longitudinal et `archiverDansProfilsMJPC`** : patron doctrinal de M15. Je le **recycle** pour « Mes évaluations », je ne le refonds pas.
- **Le chrono et le pilotage en direct** : la couche que le harnais ne voit pas et qui a produit les clics fantômes. J'y touche seulement si un bug du registre l'exige, et je le signale explicitement dans le rapport comme non testable de mon côté.
- **Le mode test** : je l'analyse et je l'étends si mes ajouts l'exigent ; je ne le remplace pas — l'écosystème s'aligne sur lui.
- **Les données hors `_test_`** : aucune écriture.

## 5. P2 — le piège à neutraliser

Modifier une évaluation après une session **recalcule rétroactivement les scores déjà rendus** : les résultats de la veille deviennent faux. Incident réel, consigné au registre. Le point 19 est explicite — ce n'est pas un avertissement à écrire, c'est un accident à rendre impossible.

Deux neutralisations sont au plan, et elles n'ont pas les mêmes conséquences en classe :

- **A — figer par snapshot à la clôture** : les résultats d'une session close portent leur propre barème et leur propre énoncé. Paul garde le droit de corriger une coquille dans l'évaluation pour les sessions suivantes, sans jamais toucher au passé. Plus de travail, mais aucun geste perdu.
- **B — verrouiller l'édition dès qu'il existe des résultats** : plus simple, imparable — mais Paul ne peut plus corriger une faute de frappe dans une évaluation déjà passée, même pour les classes suivantes. En pratique il devra dupliquer.

Ma recommandation est **A**, parce que B déplace le piège au lieu de le supprimer : un prof empêché de corriger une coquille dupliquera l'éval, et les statistiques par question — celles qui survivent d'une année sur l'autre par cohorte, doctrine v2 — se fragmenteront. Mais **c'est un arbitrage de Paul**, pas le mien : je le pose, je ne le tranche pas (question Q3).

## 6. Questions de cadrage

**Q1 — S0-④ est-elle tranchée ?** Le plan la porte encore comme **question ouverte** (L573) : « la GRAMMAIRE (accueil d'instances, deux niveaux, ⓘ, Préparation) s'applique-t-elle à ces deux apps dans leur habillage propre ? », avec la recommandation « oui — la grammaire est structurelle, la charte est cosmétique ». La fiche M7 (L302) écrit pourtant « deux niveaux (structure, pas charte) **selon décision S0-④** », comme si elle l'était. Je pars sur « oui, structure seule » — mais je préfère le confirmer que le supposer.

**Q2 — Les 17 bugs : où sont les autres ?** Le registre §3 titre « 17 bugs (12 critiques, 4 moyens, 3 mineurs) » — ce qui fait **19**, pas 17 — et n'en **détaille que 10**. Je ne peux pas « constater corrigé » ce qui n'est pas décrit. Ma proposition : je vérifie les 10 documentés un par un avec preuve, **et** j'établis en lecture complète la liste des écarts que je trouve, en la présentant comme *mes* constats et non comme les bugs manquants du registre. Si la conscience a la source (conv. « QCM evaluation suite », 19/06, `05574666`), les 7 à 9 autres seraient utiles.

**Q3 — P2 : voie A (snapshot à la clôture) ou voie B (verrou d'édition) ?** Analyse au §5. Arbitrage de Paul.

**Q4 — Point 22, la présence : dans cette passe ou pas ?** Le plan la veut « détaillée et systématique dans toutes les apps », le mécanisme de référence existe dans `index.html`, et la dette est déjà ouverte pour la souche. Mais l'ajouter au QCM, c'est ajouter de l'écriture temps réel dans l'app la plus temps réel — **exactement la couche que le harnais ne peut pas voir**. Deux options : la faire ici avec un test de Paul à deux appareils qui la couvre explicitement, ou la dater avec la dette de la souche pour un lot « présence » unique. Je penche pour la seconde (un seul contrat écrit une fois, testé une fois), mais c'est une décision de séquencement.

**Q5 — Retrait de l'onglet classes : que fait-on d'`ajouterClasse` ?** Cette fonction réintroduisait les sexes M/F dans `/classes` (bug du registre). Je propose : suppression de l'onglet **et** de la fonction, remplacés par `renvoyerVersMJPC()` du socle (§6) — l'app renvoie vers la console au lieu de gérer l'identité. À confirmer, car cela retire à Paul un geste qu'il pouvait faire depuis le QCM.

---

**STOP.** J'attends la validation de cette note et les réponses Q1-Q5 avant tout téléchargement d'app et tout code.
