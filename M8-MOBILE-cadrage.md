# M8-MOBILE — NOTE DE CADRAGE (exécutant, conversation neuve — 20/07/2026)
*Passe tactile de la console du site (`index.html`). Rien n'est codé : cette note attend l'audit de la conscience n°2 avant toute ligne.*

## 0. Changement de conscience — pris en compte
Conscience n°1 close le 19/07 pour amnésie silencieuse ; la conscience n°2 audite. Je connais le droit-devoir de contestation sourcée (lignes, md5, horodatages) : un fait sourcé suspend son avis. J'en use au §3 de cette note, sur un point mineur d'attribution CSS.

## 1. Lecture de la conversation précédente — ce que j'ai lu, ce que je n'ai pas trouvé

**Lu** (trois passes de recherche, extraits de conversation `kind=conversation` + résumés `kind=summary`) :
- **« exécutant m8 » (M8bis, 19/07)** — la conversation-cible : sa note de cadrage (structure JSON lue et non devinée, `domaines` = TABLEAU, trous d'ids 009/033 jamais comblés, hooks localisés `renderConsoleM8`/`_siteGet`/`_sitePut`/`MJPC_PURGE`), les quatre questions Q1-Q4 et leurs arbitrages (Q3 élargi à `niveaux`/`exemple`, Q4 notions seules, meta en UN PUT), la livraison (banc 41/41 sur le code extrait du fichier livré, diff 6 hunks = 6 modifications déclarées, zéro écriture hub, non-testé déclaré honnêtement), le rituel de push au sas avec vérification md5 local↔sas, la signature `[exécutant M8bis]`. Md5 final annoncé `f939e60d…` / 352 684 o / v8.1.0 — **c'est exactement la production actuelle que j'ai téléchargée** : la chaîne M8bis→promotion est cohérente de bout en bout.
- **« Cadrage M6 — Souche correction_dictee »** — le ton des audits : premier tour sans code, note de cadrage sourcée aux lignes, refus de pousser sans jeton (comportement validé), spec vivante EN FICHIER au sas jamais en collage, « le fichier fait foi, jamais le bilan », l'épisode d'amnésie fondateur (code retrouvé au conteneur : `ls -lat` d'abord, jamais l'hypothèse d'intrusion), les contestations sourcées fondées.
- En contexte : la conversation-conscience du 19/07 (promotion M8 lot 1, règles gravées : grep pré-push, regex sur socle écarte les lignes commentées, captures d'office avec les verdicts).

**Non trouvé / lacunaire — déclaré honnêtement** : l'outil rapporte des extraits, pas le fil continu. Je n'ai pas pu lire : le déroulé tour par tour complet de M8bis entre le feu vert et la livraison (j'en ai le squelette par les extraits de code et le rapport final) ; les échanges exacts de l'incident d'amnésie M8 du 19/07 (26 Ko retrouvés) — je n'en connais que la version consignée au plan ; l'ambiance fine des messages courts de Paul dans ces fils. Je n'ai pas simulé de continuité sur ces trous.

## 2. Lecture du plan — intégrale
`docs/MJPC6-plan-de-travail.md` téléchargé AUTHENTIFIÉ : **1 158 lignes, 274 658 o, md5 `b24736733bc079b9a26e9d11748fb46d`** (pas le JSON d'erreur de ~279 o ; le prompt annonçait ~1180 lignes — écart de 22 lignes, vraisemblablement les mises à jour depuis la rédaction du prompt, à confirmer d'un mot). Lu en entier, en six tranches couvrant les lignes 1→1158. En particulier : A0 complet (dispositif, sas, verrou, amnésie, harnais lecture seule stricte, exemple commenté du socle, lecture GitHub authentifiée, protocole de mort, règle date/heure du 20/07), le principe cardinal, la grille (points 1→28), la règle « LE MOBILE EST UN USAGE DE PLEIN DROIT » (L19) avec ses quatre critères opposables, le constat mesuré de la conscience (L21), l'ordonnancement passe-mobile-avant-M8ter (L31), et les fiches d'apps.

## 3. Vérifications sur pièces — les chiffres de départ

**Production** : `index.html` téléchargé authentifié — **352 684 o, md5 `f939e60d0d23fbb4b291f460b3277709`, `APP_VERSION="8.1.0"` (L1816)**. Conforme au prompt, à l'octet.

**Media queries** (grep) : `@media (max-width:700px)` L92 · `@media (max-width: 480px)` L376 et L412 — les trois accroches annoncées existent. ✔

**CSS des cibles** :
- `.m8-btn` L351 : `padding: 7px 13px; font-size: 0.82rem` → mesuré **32 px** de haut au harnais. ✔ conforme au constat.
- `.m8-btn-min` L353 : `padding: 4px 9px; font-size: 0.76rem` → mesuré **25 px**. ✔
- `.m8tx-fam-titre` L~397 : mesuré **28 px** (en-têtes de famille). ✔ · `.m8tx-dom-titre` : **35 px**.

**⚠ CONTESTATION SOURCÉE (mineure — le constat tient, l'attribution est inexacte)** : le prompt attribue les boutons de 25 px (« ✏️ Modifier », « Désactiver », « Simuler J+29 », « Revenir aux dates par défaut ») à un héritage de `.ch-publish-btn` (`padding: 2px 8px`, `0.68rem`). **Le code dit autre chose** : ces quatre boutons sont en classe `m8-btn m8-btn-min` (L1555, L1556, L1209, L1200), régie par `.m8-btn-min` L353 (`4px 9px`, `0.76rem`). La règle `padding: 2px 8px; font-size: 0.68rem` existe mais c'est `.seance-header .ch-publish-btn` (L438), qui régit les boutons de publication des séances — HORS console. Le seul `.ch-publish-btn` de la console est « Ouvrir / fermer la console » (L736, règle L340 : `4px 12px`, `0.75rem`). **Conséquence pratique** : les hauteurs mesurées et le verdict « sous la norme » sont JUSTES (25 px confirmés au harnais) ; seul le sélecteur à corriger diffère — je viserai `.m8-btn-min` et non un héritage `ch-publish-btn`. Aucun impact sur le périmètre, mais le rapport d'audit doit viser les bonnes règles.

**Reproduction au harnais — capacité vérifiée dans mon conteneur** : Playwright 1.56 + Chromium sont PRÉSENTS (`/opt/pw-browsers/chromium-1194`). J'ai monté un harnais tactile (390 px, `is_mobile`, `has_touch`) en **réseau intégralement intercepté** — toutes les requêtes sont servies localement, toute écriture (PUT/POST/DELETE) est refusée-403 et journalisée : **zéro octet ne sort du navigateur**, plus strict encore que la lecture seule (les deux tentatives d'écriture au boot — `publierManifesteREST` et le POST Apps Script — ont été bloquées et journalisées, preuve que le filet fonctionne). Chemin d'entrée admin joué par le code réel (`activateAdmin()` → double `openLevel('3e')` → `ouvrirConsoleM8()`), aucun clic à l'aveugle, dialogues refusés par défaut. **Avec une taxonomie miniature** (2 domaines / 3 familles / 4 notions), j'obtiens : 18 cibles visibles, **17 sous 44 px**, console 1 762 px — et les hauteurs unitaires reproduisent exactement les tiennes (25 / 28 / 32 / 35 px, inputs 34 px). Les totaux (31 cibles, 24 sous norme, 3 195 px) seront reproduits au tour de code en servant le **vrai** `taxonomie_atelier.json` (154 notions) dans le harnais. **Conséquence pour le morceau** : je peux fournir moi-même le tableau avant/après mesuré, la conscience contre-mesure avec son harnais.

## 4. Ce que j'ai compris du morceau
Rendre la console du site (les 5 blocs `_blocModeTest` / `_blocAnnonces` / `_blocBrevet` / `_blocRegles` / `_blocTaxonomie`, assemblés en L1133) utilisable au doigt, **sans changer aucune fonction**. Quatre critères opposables, audités par mesure des rectangles : ① cibles ≥ 44×44 px ; ② ≤ 2 écrans par panneau → accordéon EXCLUSIF des 5 blocs (un seul ouvert) ; ③ pleine largeur sous 480 px ; ④ pas de défilement horizontal. Le desktop ne doit pas être dégradé — règles par media query quand nécessaire. Pastille → **8.2.0** (bloquant). Livraison EN UNE FOIS : `index.staging.html` + `M8-MOBILE-rapport.md`. Pas d'annonce élève. Je ne promeus jamais.

## 5. Découpage proposé (aucune ligne écrite)
1. **CSS tactile sous `@media (max-width: 480px)`** (extension du bloc L376/L412 existant, sections nommées, point 20) : `min-height: 44px` + padding recalibré sur `.m8-btn`, `.m8-btn-min`, `.m8tx-dom-titre`, `.m8tx-fam-titre`, `.m8tx-notion` actions, `#m8-console-wrap .ch-publish-btn`, `.m8-select`, `.m8-date-in`, inputs/textarea de la console ; pleine largeur (critère ③) ; `flex-wrap` où manquant (critère ④). **Desktop : zéro changement de rendu** (tout sous media query).
2. **Accordéon exclusif des 5 blocs** : chaque bloc reçoit un en-tête cliquable (titre existant du bloc) ; un état d'interface `M8_ACC` (variable globale, patron `TAXO_UI` L1250 — pas de `sessionStorage`, la dette du site reste intacte) ; `renderConsoleM8` assemble les 5 blocs avec repli. **Déclaration franche : ce point ajoute du JS** — mais du JS d'ÉTAT D'INTERFACE (dépliage), zéro logique métier, zéro écriture, zéro libellé changé ; les 5 fonctions `_bloc*` restent octet pour octet ce qu'elles produisent, seul leur emballage change. Le diff restera lisible : CSS + emballage + version.
3. **Pastille** : `APP_VERSION` 8.1.0→8.2.0, `APP_VERSION_DATE` → 2026-07-20 (L1816-1817).
4. **Banc de preuve** : harnais avant/après sur les MÊMES données (vrai JSON taxonomie servi localement), tableau des cibles mesurées, hauteur console, diff exhaustif justifié hunk par hunk, double parseur (node v22 dispo ; acorn à installer via npm — registre autorisé), regex sur socle écartant les lignes `//`.

**Intouchés, garantis par le diff** : logique, chemins Firebase, libellés, gardes `admin-mode`, mode test (`M8_TEST_STORE`, `m8TestOn`), invariants taxonomie, `MJPC_PURGE`, tout l'écran élève.

## 6. Questions de cadrage (avant toute ligne)
- **Q1 — Portée de l'accordéon** : exclusif PARTOUT (desktop compris — il réduit aussi les 3 195 px à la souris, et « souplesse + usage épuré » vaut aux deux tailles) ou seulement sous 480 px (desktop strictement inchangé, y compris dans sa structure) ? Je penche pour PARTOUT (plus simple, un seul comportement à auditer), mais le prompt insiste sur la non-dégradation desktop : je te laisse trancher.
- **Q2 — État à l'ouverture de la console** : tous les blocs repliés (liste de 5 titres, lecture immédiate de l'offre), ou le premier ouvert ? Je propose TOUS REPLIÉS.
- **Q3 — Norme 44 px : mobile seul ou partout ?** Je propose : ≥ 44 px sous 480 px (le critère est audité au harnais tactile 390 px), desktop conservant sa densité actuelle. Alternative : 44 px partout (Paul code aussi à la souris sur petits écrans tactiles ?). À trancher.
- **Q4 — Périmètre exact des « 31 cibles »** : je présume console = `#m8-console` + son bouton d'ouverture (L736). Les autres cibles admin de la page (pastilles de publication, `ch-publish-btn` des séances L438 à 2px/0.68rem — eux aussi minuscules) sont HORS morceau, dette à consigner. À confirmer.
- **Q5 — Le bloc Taxonomie et le critère ②** : même en accordéon des 5 blocs, la taxonomie dépliée dépasse 2 écrans (154 notions). Son repli interne domaine/famille existe déjà mais N'EST PAS exclusif (plusieurs domaines ouvrables). Proposition : dépliage de domaine EXCLUSIF sous 480 px (un domaine à la fois), repli interne actuel inchangé au desktop (selon Q1). À trancher.

## 7. Écritures à ce stade
**Zéro écriture hub** (le harnais n'a laissé sortir aucune requête — les deux tentatives du boot ont été bloquées-403 et journalisées). Seules écritures GitHub : ce fichier, au sas, signé `[exécutant M8-MOBILE]`.

**STOP.** J'attends ton audit et tes réponses Q1-Q5 avant toute ligne de code. R/A.
