# NOTE DE CADRAGE — M6 · Souche (correction_dictee)
*Exécutant M6 — tour 1, aucun code. Plan lu intégralement (v50 du 16/07, 719 lignes, md5 6c8d4ee9a1dc91ded64b5575db8fe7cc).*

## 1. Le dispositif (3 lignes)

Deux étages : une **conscience** (mémoire totale, audits sur lectures complètes, tenue du plan, seule détentrice de la clé de production) et des **exécutants** comme moi (un morceau, périmètre gelé, livraison au **sas** `mjpc-chantier` sous `correction_dictee.staging.html`, commit signé `[exécutant M6]` + md5 annoncés). Je ne promeus **jamais** : promotion par la conscience seule, sur ordre explicite de Paul (« promeus »), après audit vert + preuves visuelles desktop/mobile 390 px + essai de Paul. Le plan est le pont : toute règle m'arrive par lui ; ma contestation sourcée (lignes, md5) suspend un verdict de la conscience — et le fichier fait foi, jamais le bilan.

## 2. Ce qu'est la souche, et pourquoi M6 est le test de la méthode

`correction_dictee.html` est **l'étalon unique et permanent** de l'écosystème : son panneau de départ et sa charte (#fafaf8/#fff/#e5e3de/#2563eb/radius 14, Literata) sont LE modèle cloné partout ; sa grammaire (accueil d'instances → onglets par fonction → actions transverses) est la grammaire du panneau universel. C'est aussi l'app **critique** de Paul (usage quotidien, 281 tests Dugain, correction rapide Maj+R, moteur GRAMM). M6 est « le test de la méthode » parce que la passe y est **légère par construction** (l'étalon a déjà presque tout : accueil ✔, ⓘ ✔, charte ✔, manifeste ✔) : si la grille ne s'applique pas COURT ici, c'est la méthode qui déraille, pas l'app. Signal du plan : un morceau qui dépasse une conversation = relire grille et fiche, pas continuer.

## 3. Les points de grille que j'appliquerai (état vérifié contre la matrice L101 et la fiche S2 L147-150)

- **Pt 2 — Navigation deux niveaux** : re-rangement des 7 onglets plats en Pilotage{Préparation·Correction·Rapide} · Données{Bilan·Copies·Fiches·Suivi·Exercices?} · Réglages + « ? », atterrissage sur Correction. **Règle : re-ranger sans rouvrir** (les onglets sont des composants autonomes), raccourcis clavier inchangés.
- **Pt 4 — Préparation** : l'écran config existant devient le sous-onglet Préparation (re-rangement, pas réécriture).
- **Pt 5 — Réglages** : onglet à créer (principe « doter », même peu garni — candidat naturel : les options de copie actuelles).
- **Pt 7 — Connexion élève MJPC** : code personnel + nom + prénom via socle §8 (`validerEleveMJPC`) + shunt `lireSessionMJPC`, sur le mode Copies — fin des listes où se choisir. MJPC = shunt, jamais portail : l'app reste autonome si MJPC tombe.
- **Pt 8 — « Mes dictées »** : travaux antérieurs de l'élève (libellé acté 15/07), aujourd'hui copies par dictée seulement.
- **Pt 10 — « ? »** : aide d'usage + lecteur d'annonces (voir Q2).
- **Pt 11 — Manifeste** : mise à jour du contrat si Réglages/« Mes dictées » créent des sous-nœuds.
- **Pt 14 — Wording élève** : test du collégien sur tous les nouveaux écrans (connexion, Mes dictées).
- **Pt 17 — Responsive 390 px** : vérification, replis en colonne si débordement (côté nouveaux écrans surtout).
- **Pt 18 — Pastille de version + anti-cache** (voir Q5).
- **Pt 16 — Mode test** : analyse de l'existant obligatoire à chaque passe (voir Q3).
- **Doc, pas code** : re-repérer le mécanisme de mutualisation des décisions de correction (K0 : « mécanisme source exact à re-repérer en M6 ») — consignation pour la Banque pédagogique.
- **Méthode** : lecture profonde du fichier avant tout geste · double parseur + banc sur export réel · périmètre `_test_` seul pour le hub · auto-vérification sur pièces · dettes découvertes = consignées, jamais des rallonges · dettes du morceau soldées ou justifiées avant la fin (14ter) · spec vivante restituée en fin de chaque message.

**Points sans objet en M6** : pt 1 et 3 (la souche EST le modèle), pt 9 (déjà branchée au site, genre `dictee`), pt 12 (chantier Fondements M18+), pt 15 (déjà universelle par instances), pt 14bis (aucune mécanique de comptage nouvelle prévue ; si j'en touche une malgré tout, tests au banc dans la même livraison).

## 4. Ce que je m'interdis

L'architecture de la **correction rapide** (Maj+R, audio, remappage), le moteur **GRAMM** (L479), le système de snapshots, la présence temps réel, l'écran de correction copie par copie : **re-rangés, jamais rouverts** — zéro modification interne des écrans de travail. Les **données** du hub hors `_test_` : aucune écriture sans annonce et vert de Paul. L'onglet **Exercices** : re-rangé seulement, aucun couplage nouveau (il deviendra l'app « Banque d'exercices », code déjà isolé). La **charte** : intouchée (c'est elle, la référence). Jamais de promotion, jamais de push production.

## 5. Questions de cadrage

1. **Exercices — Pilotage ou Données ?** La fiche S2 écrit « Exercices? » dans Données avec un point d'interrogation. Je propose Données (c'est du « ce qui sort ») — à confirmer.
2. **Le « ? » et le canal d'annonces** : le canal central naît en M8 (site, lot 1). En M6, le « ? » embarque l'aide d'usage + un lecteur **tolérant à l'absence du nœud** — quel chemin de nœud figer dès maintenant (ex. `site/annonces`) pour que M8 n'ait pas à retoucher la souche ?
3. **Mode test (pt 16)** : la souche a-t-elle un mode test existant à analyser, ou faut-il le **créer** façon patron QCM (classe `_test_correction_dictee`, génération un clic, incarnation, purge exhaustive) ? Créer un mode test complet sur l'app la plus riche menace le « COURT » — création complète en M6, ou analyse + dette consignée ?
4. **Amélioration pédagogique n°1 (K.1)** : « M6 · Autocorrection dictée : l'élève formule UNE action suivante en fin de parcours ». Elle est affectée à M6 mais touche le **parcours d'autocorrection élève** (écran de travail existant → lecture profonde obligatoire) et pose la question du nœud de stockage (sous `dictees/*/` ? vers la strate/M15 ?). Incluse dans cette passe, ou datée ailleurs ?
5. **Pastille de version (pt 18)** : « à loger au socle » — M6 doit-il livrer une évolution de `mjpc-core.js` (v1.2.0, impact 10 apps) ou poser la pastille **en dur dans la souche** en attendant une promotion au socle groupée (M15, avec `taxoCompter`) ?
6. **Point 13 (Concordance)** : la souche porte 13 mentions de compétences + champ `notions:[]` L403, mais les 26 alias de M2 sont en statut « proposé », **arbitrage de Paul non fait**. Je présume : hors périmètre M6, dette consignée — à confirmer.

**STOP.** Attente du retour de la conscience (validation + réponses Q1-Q6) avant tout téléchargement d'app et tout code.
