# M8bis — RAPPORT DE LIVRAISON (exécutant, 19/07/2026)
*Livrable ④ du lot M8 : l'éditeur de taxonomie. Livré EN UNE FOIS au sas : `index.staging.html` + ce rapport. Je ne promeus jamais.*

## 1. Identité du livrable

| | |
|---|---|
| Base | production md5 `93db733dc3fb7fde4da027dd8fcf1193`, 327 344 o, v8.0.0 |
| Livrable | `index.staging.html`, **md5 `f939e60d0d23fbb4b291f460b3277709`, 352 684 o** |
| Pastille | `APP_VERSION` **"8.0.0" → "8.1.0"** (preuve : diff hunk L1360c1816) ; `APP_VERSION_DATE` déjà à `"2026-07-19"` = date de livraison, inchangée à dessein |
| Arbitrages appliqués | Q1 (marqueur test permanent) · Q2 (commentaire seul, MJPC_PURGE intact) · Q3 (éditables : libelleProf, libelleEleve, niveaux, exemple) · Q4 (notions seules) · meta en UN PUT (objet frais, version+date ensemble) · relecture fraîche conservée |

## 2. Checklist à preuves

| Point | Preuve |
|---|---|
| **Double parseur** | `node --check` ✔ + acorn ecmaVersion 2020 ✔ sur le bloc `<script>` unique extrait (256 267 c) |
| **Banc** | **41/41** sur le code EXTRAIT DU FICHIER LIVRÉ (entre marqueurs de section, jamais une copie), exécuté sur le VRAI `taxonomie_atelier.json` (md5 `dc007a57903a38be163a4bfab0b71905`). Suites : résolution 154/154 notions et 40/40 familles aux indices vérifiés par parcours indépendant · préfixes dérivés (5/5) · ids neufs max+1 (030/044/044/030/013), trous 009/033 jamais comblés · collision · version (1.1.0→1.1.1, 1.1.9→1.1.10, dégradé) · **parcours complet en mode test** (création→édition→exemple vidé→champ inconnu préservé→désactivation→réactivation) · refus propres (id/famille inexistants) · rendu HTML (154 ids présents, échappement, bandeau test, raison pédagogique, zéro bouton « supprimer ») · sûreté des ids injectés |
| **Non-régression** | diff production↔staging : **6 hunks = exactement les 6 modifications déclarées** (§3) ; **2 seules lignes remplacées** (`renderConsoleM8` composition + `APP_VERSION`), 460 lignes ajoutées, tout le reste identique octet pour octet (preuve : `grep "^<" diff` → 2 lignes) |
| **Parcours joué** | mode test : joué au banc de bout en bout (6 gestes enchaînés sur la copie du magasin, invariants vérifiés APRÈS l'enchaînement — règle ② du serrage : le test couvre la séquence, y compris ce qui devait rester inchangé : 154 ids, 154 positions, champs voisins) |
| **Écritures hub pendant le développement** | **ZÉRO.** Preuve au banc : `_sitePut` jamais appelé en mode test (test « ZÉRO écriture réelle » ✔) ; côté conteneur, seules des lectures GET ont eu lieu (`/taxonomie` en cadrage, aucune requête PUT/DELETE émise vers le hub à aucun moment) |
| **Textes** | écran PROF exclusivement (aucun texte élève dans ce livrable) ; textes prof soumis, non décidés : la conscience les relit (§6) |
| **Piège de l'exemple commenté** | déjoué : `MJPC_PURGE` lu et modifié aux lignes RÉELLES (L1379+), les exemples `// var MJPC_PURGE` L1216 écartés (le diff le prouve : le hunk 1381 tombe dans le bloc réel) |

## 3. Les 6 modifications, exhaustives (hunks du diff dans l'ordre du fichier)

1. **L382a** — CSS `.m8tx-*` (34 lignes) inséré entre la fin du `@media` m8 et le bloc « M8 ① », y compris règles mobiles ≤480 px (boutons pleine largeur, marges resserrées).
2. **L886a** — table des matières du bloc M8 : ligne « ④ TAXONOMIE » ajoutée.
3. **L1098c** — `renderConsoleM8` : `+ _blocTaxonomie()` en 5e position (seule ligne existante modifiée avec la pastille).
4. **L1183a** — la SECTION M8bis entière (≈420 lignes) après `ouvrirConsoleM8`, en-tête de section avec table des matières et invariants documentés (point 23 : le code porte son mode d'emploi).
5. **L1360c** — `APP_VERSION` → `"8.1.0"`.
6. **L1381a** — 2 lignes de COMMENTAIRE de co-écriture dans `MJPC_PURGE` ; `preserver`/`purger` **intacts au caractère près** (arbitrage Q2, vérifié par extraction du bloc).

## 4. Liste EXHAUSTIVE des chemins hub que le code écrira en production

Toutes les écritures passent par `_sitePut` (qui teste le mode test AVANT tout fetch) et sont CIBLÉES — jamais le document entier. Preuve : simulation en mode réel (stub `_sitePut` capteur) sur les trois gestes :

| Geste | PUT n°1 (la notion, objet entier fusionné depuis l'état FRAIS) | PUT n°2 |
|---|---|---|
| Édition (ex. gram-003) | `/taxonomie/domaines/2/familles/0/notions/2` (indices recalculés à chaque geste par résolution PAR ID sur relecture fraîche) | `/taxonomie/meta` |
| Création (ex. dans fam-15) | `/taxonomie/domaines/2/familles/2/notions/6` (index = longueur FRAÎCHE du tableau : append pur, aucun index existant déplacé) | `/taxonomie/meta` |
| Désactivation/réactivation (ex. lex-007) | `/taxonomie/domaines/4/familles/6/notions/0` | `/taxonomie/meta` |

**C'est tout.** Aucun autre chemin, aucun DELETE, aucun PUT racine. `/taxonomie/meta` est écrit en UN SEUL PUT (objet meta frais entier : version patch+1 et date du jour posées ensemble, `notes` et champs inconnus préservés — remarque §5-A de la conscience appliquée). Lectures : GET `/taxonomie` (relecture fraîche avant chaque geste et au chargement de l'éditeur — y compris l'amorçage du mode test, lecture pure).

## 5. Gestes destructeurs et leur neutralisation

- **Suppression de notion : N'EXISTE PAS** — aucune fonction, aucun bouton (prouvé au banc : rendu intégral sans occurrence de « supprimer »). La raison pédagogique est affichée EN PERMANENCE dans l'éditeur (« le travail des élèves est étiqueté par ces identifiants… une notion qui ne sert plus se désactive »).
- **Modification d'id : IMPOSSIBLE** — le champ n'est jamais éditable ; le formulaire d'édition affiche l'id avec la mention « ne change jamais ».
- **Renumérotation/réordonnancement : IMPOSSIBLE** — aucun geste de tri ou déplacement n'existe (Q4) ; la création est un append en fin de tableau (prouvé au banc : les 154 positions d'origine inchangées après les 6 gestes).
- **Désactivation** : confirmation qui CITE le libellé et explique la portée (sortie des choix des apps, historique lisible, réversibilité).
- **Écriture ciblée** : un PUT ne peut abîmer que la notion visée — jamais le document (§5-A du cadrage, validé).
- **Trous d'ids historiques** (ortho-lex-009, ortho-gram-033) : structurellement jamais comblés (max+1 ; prouvé au banc).
- **Id infabricable** (domaine sans repère de nommage — cas aujourd'hui impossible) : refus explicite AVANT toute écriture, message « rien n'a été écrit ».

## 6. Textes PROF embarqués (soumis à relecture, non décidés)

- Bloc console : « L'arbre Domaine › Famille › Notion que lisent les applications. Ici tu peux créer une notion, corriger ses libellés, ses niveaux et son exemple, ou la désactiver. »
- Règle permanente de l'éditeur : « Une notion ne se supprime jamais et son identifiant ne change jamais : le travail des élèves est étiqueté par ces identifiants, une étiquette qui disparaît ou change de numéro décrocherait des années de travail. Une notion qui ne sert plus se **désactive** — elle sort des choix des applications, l'historique reste lisible. »
- Bandeau mode test (permanent tant que le mode est actif, exigence Q1) : « 🧪 MODE TEST — tu édites une COPIE de la taxonomie. Rien n'est enregistré au référentiel : toutes tes modifications disparaîtront en quittant le mode test. »
- Confirmation de désactivation : « Désactiver « [libellé] » ? Elle sortira des choix proposés par les applications. L'historique des élèves qui portent cette étiquette reste lisible, et tu pourras la réactiver à tout moment. »
- Messages d'erreur : « Notion introuvable dans le référentiel — recharge et réessaie. » · « Impossible de fabriquer un identifiant neuf pour ce domaine — rien n'a été écrit. Vois ce cas avec le plan de travail. » · variantes « n'a pas pu être enregistrée. Réessaie. » · dégradé version : « …enregistrée, mais le numéro de version n'a pas pu être mis à jour. »

## 7. Ce que je N'AI PAS pu tester (déclaration de couverture)

- **Le rendu PEINT** : je n'ai pas de navigateur qui peint — CSS, dépliage réel au clic, formulaires dans un vrai DOM, mobile 390 px : c'est le harnais Playwright de la conscience (captures desktop + mobile avant « promeus », règle des preuves visuelles).
- **L'amorçage réseau du mode test** : la logique est prouvée au banc (fetch appelé UNIQUEMENT si le magasin est vide, sinon interdit par stub) mais aucun fetch réel n'a été exécuté.
- **La recomposition de la console dans un vrai DOM** : `_blocTaxonomie()` restitue l'éditeur ouvert via un `setTimeout(0)` quand `renderConsoleM8` recompose (gestes des 4 autres blocs) ; testé logiquement, pas dans un DOM. Le cache mémorise son MODE (`TAXO_CACHE_MODE`) et se recharge si le mode test a basculé entre-temps — logique vérifiée à la lecture, pas jouée en DOM.
- **Les écritures Firebase réelles** : interdites avant promotion — les chemins sont prouvés par simulation (§4), pas par écriture.
- **La concurrence réelle** (deux onglets prof éditant en même temps) : hors de portée du banc ; la relecture fraîche avant chaque geste réduit la fenêtre mais ne l'annule pas (dernier écrivain gagne sur UNE notion ciblée — jamais sur le document).

## 8. Annonce élèves

**AUCUNE.** Le livrable est purement professeur : l'éditeur vit dans la console du site (`.admin-tabs-publish`, masquée hors admin-mode — vérifié L392-393 de la production). Rien ne change pour les élèves.

## 9. Amnésie — contrôle de traces

Conversation NEUVE (ouverte aujourd'hui pour ce seul morceau) : `ls -lat` du conteneur ne montre que les fichiers de cette session (cadrage, section, banc, staging) ; aucun code non reconnu trouvé. Rien à déclarer.

## 10. Dettes / restes (spec vivante du morceau)

- Aucune dette ouverte par ce livrable.
- Constat annexe transmis au cadrage et confirmé par la conscience, inscrit par elle comme dette du site, HORS de mon périmètre, non touché : `sessionStorage 'mjpc_m8_test'` écrit mais jamais relu au boot.
- Premier usage réel attendu de l'éditeur : l'application par Paul des renommages de l'audit Éduscol (E1/E2 + optionnels A1-A4 du récapitulatif de `MJPC6-audit-eduscol.md`) — les arbitrages y sont déjà gravés, l'éditeur les permet tous (renommage de libellés, création si besoin dans fam-15).
