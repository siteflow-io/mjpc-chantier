# M8bis — NOTE DE CADRAGE (exécutant, conversation neuve — 19/07/2026)
*Livrable ④ du lot M8 : l'éditeur de taxonomie dans `index.html`. Rien n'est codé : cette note attend l'audit de la conscience n°2 avant toute ligne.*

## 0. Changement de conscience — pris en compte
La conscience n°1 a été close le 19/07 ; la conscience n°2 audite. Je connais le droit-devoir de contestation sourcée (lignes, md5, horodatages) : un verdict sourcé suspend le sien.

## 1. Ce que j'ai lu, avec preuves

| Pièce | Preuve |
|---|---|
| `docs/MJPC6-plan-de-travail.md` | lu INTÉGRALEMENT (1130 lignes, md5 `ea3a60c705ad9d1b8923aa2cd920a966`), téléchargement authentifié par le jeton sas |
| `docs/MJPC6-audit-eduscol.md` | lu intégralement (76 lignes, md5 `c88b80e7ff196d93b25138666c33123c`) — v4 appliquée, 154 notions, arbitrages de Paul gravés |
| `taxonomie_atelier.json` | lu et analysé par script (72 279 o, md5 `dc007a57903a38be163a4bfab0b71905`) |
| `index.html` production | 327 344 o, md5 `93db733dc3fb7fde4da027dd8fcf1193` — **conforme à l'annonce de la conscience, à l'octet et au md5** ; `APP_VERSION="8.0.0"` (L1360) |
| Nœud hub `/taxonomie` | **lecture GET seule** (aucune écriture) : égalité profonde nœud ↔ fichier vérifiée par script (`noeud == fichier → True`), meta v1.1.0 du 19/07, 154 notions au nœud |
| Piège du JSON d'erreur ~279 o | écarté : les 4 téléchargements font 258 403 / 11 399 / 72 279 / 327 344 o |
| Occurrences « taxonomie » dans la production | `grep -ci taxonomie index.html` → **0**. Je pars de zéro, confirmé |

## 2. La structure EXACTE du JSON, telle que je l'ai lue (pas supposée)

**Racine (5 clés)** : `meta` (objet) · `domaines` (TABLEAU) · `typesErreur` (tableau de 4) · `competences` (objet : `francaisC4`, `transversales`) · `alias` (objet : `relations`, `reglesStructure`, `regleComptage`, `circuit`, `tables` — dont `tables.terminologie`, 2 entrées, statut `valide`).

**Arborescence** : `domaines[i]` = `{id, ordre, libelleProf, libelleEleve, familles[]}` ; `familles[j]` = `{id, ordre, libelleProf, libelleEleve, notions[]}` ; `notions[k]` = `{id, libelleProf, libelleEleve, niveaux, actif}` + champ **`exemple` optionnel** (présent sur 73 notions, absent sur 81 — les deux jeux de clés relevés par script, aucun autre).

**Comptes vérifiés** : 5 domaines · 40 familles · **154 notions** (28+42+43+29+12 par domaine, dans cet ordre : ortho-lex, ortho-gram, grammaire, conjugaison, lexique). `actif: true` partout (154/154).

**Ids** : familles `fam-01`→`fam-40` (ordre de tableau ≠ ordre numérique : `fam-30`/`fam-31` intercalées dans le 1er domaine — l'ordre d'affichage est l'ordre du TABLEAU, pas le numéro). Notions par préfixe de domaine : `ortho-lex-001→029` (trou : 009), `ortho-gram-001→043` (trou : 033), `gram-001→043`, `conj-001→029`, `lex-001→012`. **Les deux trous sont des retraits de mai, ids JAMAIS réutilisés** (meta.notes le grave) — ma génération d'id neuf = max(préfixe)+1, jamais un comblement de trou.

**`meta`** : `{version: "1.1.0", date: "2026-07-19", chantier, source, notes[]}`.

**Contraintes gravées dans meta.notes que mon code doit respecter** : ids opaques immuables (notions ET familles) ; libellés librement modifiables ; `/taxonomie` préservé à la purge (manifeste dédié, publié en M2).

## 3. Ce que j'ai vérifié dans le code de production (points d'accroche)

- `renderConsoleM8()` L1093 compose `_blocModeTest() + _blocAnnonces(annonces) + _blocBrevet() + _blocRegles(ctrl)` dans `#m8-console` (div L702, visible via « ⚙ Console du site », affichée en admin-mode). Mon bloc sera le 5e.
- Helpers L904-922 : `_siteGet` / `_sitePut` / `_siteDelete` testent `m8TestOn()` AVANT tout fetch — je les RÉUTILISE, aucune réécriture (point 20). En mode test tout vit dans `M8_TEST_STORE` (mémoire).
- `MJPC_PURGE` réel : **L1379-1384** (lignes NON commentées — les exemples commentés du socle L1210-1216 écartés, piège des 3 épisodes connu) : `preserver:["site","site/annonces","site/config"]`, `purger:["eleves_index","codes"]`. **`taxonomie` n'y est PAS** → à compléter (voir §5-G).
- `escapeHtml` existe (L1713) — je l'utilise pour tout libellé injecté.
- Styles `.m8-*` existants (L343-370) réutilisés ; le motif `UI_OPEN` (état de dépliage survivant aux re-renders, L1190) existe déjà dans le fichier — je réplique ce motif pour l'arborescence.
- Constat annexe, hors périmètre, déclaré sans y toucher : `sessionStorage 'mjpc_m8_test'` est écrit (L899) mais jamais RELU au boot — le mode test ne survit pas à un rechargement. Aucun effet sur mon livrable (je passe par `m8TestOn()` à chaque geste) ; à l'attention de la conscience.

## 4. Ce que l'éditeur fera — mon découpage

**Bloc ① — `_blocTaxonomie()`, bloc léger dans la console** : titre, une phrase d'état (version meta + compte de notions une fois chargé), bouton « Ouvrir l'éditeur ». La taxonomie (72 Ko) N'est PAS chargée par `renderConsoleM8()` (qui se recompose à chaque action des 4 autres blocs) : elle se charge au clic, dans un conteneur dédié interne au bloc, avec re-render LOCAL de l'éditeur seul après chaque geste — l'état de dépliage (variable globale, motif `UI_OPEN`) survit.

**Bloc ② — Navigation** : arborescence Domaine > Famille > Notion repliable, ordre = ordre des tableaux (pas les numéros d'ids), les 154 notions atteignables. Chaque notion : `libelleProf`, `libelleEleve`, `niveaux`, `exemple` s'il existe, badge « désactivée » le cas échéant, id affiché discrètement (écran PROF : le vocabulaire technique est celui de Paul).

**Bloc ③ — Renommer** : édition de `libelleProf` et `libelleEleve` UNIQUEMENT (les autres champs affichés, non éditables — `niveaux`/`exemple` hors périmètre du morceau tel qu'énoncé ; je le confirme au §6-Q3). Écriture ciblée sur la notion + incrément meta.

**Bloc ④ — Créer** : « + Nouvelle notion » par famille. Champs : `libelleProf`, `libelleEleve`, `niveaux` (défaut `"6e-3e"`), `exemple` optionnel, `actif:true`. **Id neuf** : préfixe DÉRIVÉ des ids existants des notions du domaine (extrait par regex sur les données, pas une table en dur) + `max+1` zéro-paddé à 3 chiffres ; vérification d'absence de collision sur les 154+ ids de TOUT le document, relu FRAIS juste avant l'écriture ; les trous (009, 033) jamais comblés puisque max > trous.

**Bloc ⑤ — Désactiver / réactiver** : bascule `actif` avec confirmation qui explique. **La raison pédagogique EST DANS L'INTERFACE** : un texte permanent du bloc dit, en substance, que le travail des élèves est étiqueté par ces identifiants — supprimer ou renuméroter une notion, c'est décrocher l'étiquette d'années de travail ; c'est pourquoi une notion se range (désactivation) et ne se déchire jamais (aucun bouton de suppression n'existe, nulle part).

**Bloc ⑥ — Version** : CHAQUE écriture (création, renommage, bascule actif) incrémente `meta/version` (patch : 1.1.0 → 1.1.1 → …) et met `meta/date` au jour ISO courant.

**Interdits portés par le code, pas par une notice (point 19)** : aucune fonction de suppression de notion n'existe dans le livrable · aucun champ id n'est éditable · aucune renumérotation possible (pas de réordonnancement dans ce morceau).

## 5. Décisions techniques soumises à l'audit

**A — Écritures CIBLÉES, jamais le document entier.** Firebase RTDB adresse les tableaux par index (`/taxonomie/domaines/0/familles/2/notions/5`). Ces chemins sont STABLES par construction des invariants mêmes de l'éditeur : on ne supprime jamais, on ne réordonne jamais, la création est un append en fin de tableau (index = longueur relue fraîche). Un PUT du document entier (45 Ko au nœud) pourrait détruire le référentiel si la lecture amont était fausse ; un PUT ciblé ne peut abîmer que le champ visé. Écritures par geste : PUT sur le champ/la notion + PUT sur `meta/version` + PUT sur `meta/date` (3 PUT ciblés via `_sitePut`).

**B — Relecture fraîche avant chaque écriture.** Le geste relit `/taxonomie` (GET), recalcule l'index/l'id sur l'état frais, écrit, puis relit pour re-render. Évite les collisions d'index et d'id si le nœud a bougé entre deux gestes.

**C — Mode test : amorçage du magasin.** `_siteGet` en mode test lit `M8_TEST_STORE`, qui démarre VIDE — l'éditeur n'aurait rien à montrer. Proposition (point 16, « reflet exact du réel ») : à l'ouverture de l'éditeur en mode test, si `M8_TEST_STORE['/taxonomie']` est absent, un GET de LECTURE PURE amorce le store avec une copie de la vraie taxonomie ; ensuite tous les gestes passent par `_sitePut`/`_siteGet` → le store. Rien ne part jamais au hub (la promesse du mode test porte sur l'ÉCRITURE) ; on édite une copie réelle qui s'évapore en sortant. Je n'ai PAS modifié `_siteGet` (contrat des 4 autres blocs intact) : l'amorçage est une fonction propre à l'éditeur. **À valider.**

**D — Pastille** : `APP_VERSION` → `"8.1.0"`, `APP_VERSION_DATE` → date de livraison (point bloquant connu).

**E — Style de code** : ES5 comme la section M8 existante (var, function, concat de chaînes), fonctions de rendu nommées et linéaires (point 20), section dédiée avec table des matières en tête, `escapeHtml` sur tout libellé.

**F — Mobile 390 px** : styles `.m8-*` réutilisés + arborescence en colonne, boutons repliés sous ~480 px (point 17).

**G — Manifeste (directive du prompt : « complète si besoin »)** : je propose d'ajouter `"taxonomie"` au `preserver` de `MJPC_PURGE` (L1382) avec commentaire de CO-ÉCRITURE (« propriétaire : manifeste dédié `taxonomie`, publié en M2 ; index co-écrit via l'éditeur ») — SANS l'ajouter à `noeuds` du `MJPC_MANIFESTE`, conformément à la décision « un nœud = une app propriétaire ; les co-écrivains le mentionnent en commentaire » (plan §5). `preserver` prime sur `purger` : redondance protectrice, aucune casse. **À valider — c'est le seul point où deux règles du plan se croisent.**

## 6. Questions avant code (réponses courtes suffisent)

- **Q1 (§5-C)** : amorçage du mode test par lecture pure du hub — validé ?
- **Q2 (§5-G)** : `taxonomie` dans `preserver` d'index sans entrer dans `noeuds` — validé ?
- **Q3** : renommage limité à `libelleProf`/`libelleEleve` comme l'énonce le prompt — ou `niveaux` et `exemple` deviennent-ils aussi éditables tant qu'on y est ? (Je code le périmètre strict par défaut.)
- **Q4** : la création s'étend-elle aux FAMILLES ? Le prompt dit « créer une notion dans une famille » ; la spec historique du plan (L528) évoquait aussi déplacer/réordonner — je lis le périmètre M8bis comme : notions seulement, ni déplacement ni réordonnancement. Je confirme ?

## 7. Ce que je ferai après le feu vert

Code en section dédiée → banc Node des fonctions pures (génération d'id, collision, préfixe dérivé, incrément de version, parcours des 154) exécuté sur le VRAI `taxonomie_atelier.json` → double parseur (`node --check` + acorn ecmaVersion 2020) → parcours joué en mode test → poussée EN UNE FOIS au sas : `index.staging.html` + `M8bis-rapport.md` (checklist à preuves, chemins hub exhaustifs, zéro écriture pendant le développement, gestes destructeurs neutralisés, non-testé déclaré, annonce élèves : AUCUNE — livrable purement professeur, je le confirme d'avance). Je ne promeus jamais.

**Écritures hub à ce stade : ZÉRO.** Seules lectures GET effectuées : `/taxonomie` (comparaison nœud↔fichier, §1).
