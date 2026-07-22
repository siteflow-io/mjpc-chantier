# M11 — Cadrage : analyse_logique.html, passe complète
*Signé : [exécutant M11] — 22/07/2026*

## 0. Base vérifiée

`analyse_logique.html` production (`siteflow-io/monsieurjaipascompris`) : **138 414 o, md5 `35313d011c6f3522bc4ade6b03d75c6d`**, 2 124 lignes, socle MJPC-CORE 1.0.0, lue intégralement. 7 blocs `<script>` (dont le noyau al-core en `text/plain` monté en iframe srcdoc). Patrons téléchargés et vérifiés : `mjpc-core.js` (1b106b40…), `correction_dictee.html` (2d0d3941…), `dictee_universelle.html` (f8362a87… — écart vs md5 attendu instruit : commit postérieur `833bdda5a1` du 22/07 08h48, dette M9 soldée ; le fichier fait foi), `index.html` v8.4.3 (c9c3d326…, lecture seule pour Q5).

## 1. État mesuré — grille point par point

| Pt | Objet | État mesuré | Geste M11 |
|----|-------|-------------|-----------|
| 1 | Panneau accueil cloné souche | Absent — l'app s'ouvre directement sur l'espace | Cloner depuis souche |
| 2 | Nav 2 niveaux (Pilotage·Données·Réglages·?) | Absente — **10 onglets plats** (Travaux·Correction·Bilan·Copies·Fiches·Suivi·Exercices·Référentiel·Barème·🛠 Développement ; Copies/Exercices = stubs) | Répartir (plan §6) |
| 3 | Charte souche (#fafaf8/#2563eb/r14, Literata) | Charte propre différente | Aligner |
| 4 | Préparation = édition complète | Travaux : création OK, édition partielle | Compléter |
| 5 | Réglages présent | Absent | Créer |
| 6 | ⓘ partout | **0 occurrence** | Ajouter |
| 7 | Portail élève code MJPC+nom+prénom | **Aucun portail** — AppEleve v0 purement informatif ; **0** `lireSessionMJPC`/`validerEleveMJPC` ; rôle par `?role=` URL | Portail complet /codes (patron M9) |
| 8 | Shunt MJPC élève **et prof** (leçon M9) | Absent (socle 1.0.0 sans lireSessionMJPC) | Socle 1.1.0 + shunt double |
| — | Porte prof | **Aucun code** : bouton simple ou `?role=prof` — falsifiable, contraire doctrine | PROF_CODES seed `['1312','3141']` + surcharge Firebase, trace « accès professeur », suppression `?role=` |
| 9 | « Mes analyses » | **0** | Créer (patron « Mes dictées » M9) |
| 10 | Annonces site + app via « ? » | **0** | Câbler `/site/annonces` + annonces app |
| 11 | Manifeste/purge | Présents et publiés (constaté au hub, `publie_le` 1784035770397) | RAS — vérifier cohérence après refonte nœuds |
| 12 | — | — | — |
| 13 | Concordance | Non codée | **Déclarée, pas codée** (contrat H du prompt) |
| 14/14bis | Intégrité comptage | Moteur `evaluer`/`agregerResultats` présents, **aucun test** | Test d'intégrité livré avec |
| 15 | Universalisation | Un moteur, N travaux : structure conforme | RAS |
| 16/16bis | Mode test reflet exact | **Aucun mode test monté** (2 `_test_` = socle seul) | Créer, vrais composants |
| 17 | Responsive 390 px | **3 media queries** (reduced-motion + 2 print) — **aucune tactile** | Passe ≤480, desktop inchangé, cibles ≥44 px |
| 18 | Pastille + anti-cache | **0** APP_VERSION, **0** méta anti-cache | Pastille bottom:10/right:10 ≥44 px sans flottant dessous ; métas |
| 19 | Aucun piège assumé | **3 `.remove()` destructeurs sans corbeille** : L1742 `corrige/marks` (onSave PromptIA), L1838 `resetTravail` barème, L1887 `del(it)` todo ; 3 confirm/alert | Corbeille avant destruction, neutralisation code |
| 20 | Qualité code | Correct, sections dédiées à maintenir | Diff intégral classé |
| 22 | Présence | **0** `/presence`, **0** sendBeacon | Câbler contrat du site |
| 23 | Bilan autonome + bloc diagnostic | Bilan présent ; **0 bloc diagnostic** en tête de script | Ajouter |
| 25/25bis | Textes élève vrais et compréhensibles | Relevé casse-insensible fait (§5) | Soumettre, corriger |
| 26 | Éditables vs en-dur | Textes du noyau en dur ; infos élève en dur | Dictionnaire seed + surcharge Firebase pour ce qui annonce |
| 27 | Tokenisation = contrat | **2 exemplaires de `buildTokens`** (noyau + zone 3ter) — copies conformes entre elles | Ne jamais réimplémenter ; empreintes §4 |
| 28 | « L'app c'est moi » | « ton professeur » 3ᵉ personne sur de l'accompli (L2115) | 1ʳᵉ personne prof sur l'accompli, flux sur l'inaccompli |

## 2. Vendorisation (périmètre A) — chiffrée, deux options

La base est la seule app à charger 4 CDN (`unpkg` react@18 ×2, `gstatic` firebase 8.10.1 ×2). Constat annexe : la souche `correction_dictee` a encore ses 4 CDN (L217-220) — hors périmètre M11, signalé pour le registre.

**Option A (recommandée) — blocs M9 verbatim.** Extraction bit à bit des 4 blocs vendorisés de `dictee_universelle` (éprouvés en production depuis M9) : React 18.2.0 (10 737 car, md5 d86dcdbf…), ReactDOM 18.2.0 (131 882, 64141792…), firebase-app-compat 9.23.0 (28 949, c90bd0ff…), firebase-database-compat 9.23.0 (165 658, a663070d…). L'API compat 9 sert exactement la surface v8 (`firebase.initializeApp`, `firebase.database()`) que le code applicatif utilise — c'est la migration qu'a faite M9 sans toucher au code applicatif. **+337 226 car → fichier ≈ 464 Ko.** Aucun octet nouveau sur le site.

**Option B — npm exact des CDN actuels.** react@18.3.1 + react-dom (142 586 o) + firebase 8.10.1 natif (209 864 o), fichiers téléchargés et empreintés (e91b2616…, 7d4842a9…, f61459b8…, 5b6536a2…). **+352 450 o → ≈ 479 Ko.** Colle aux versions actuellement référencées, mais introduit des octets jamais éprouvés sur le site.

Dans les deux cas : seules les 4 balises `<script src=…>` sont réécrites en blocs inline, rien d'autre.

## 3. Cadrage Q5 — extraction de l'onglet site (index.html, lecture seule)

Le contenu analyse logique vit dans `tab-fiches` section « Langue » : chapter-card 📐 L793-794 (`data-chapitre="analyse-logique"`, 1 doc Drive `3e-analyse-logique-mmynhk1z`, drop-zone d'upload). Patron de branchement le plus proche : `gotoEvalConn` L4528 (liste d'items par chapitre + carte « Ouvrir l'app », connexion classe+nom+prénom). Coutures identifiées :
① bouton `tab-btn-analyse` dans `.tabs` (L774-784) ; ② `<div id="tab-analyse">` ; ③ `gotoAnalyse()` sur patron `gotoEvalConn` ; ④ `PUBLISHABLE_TABS` L1731 + `TAB_LABELS` L1732 (+ analyse publiable par niveau) ; ⑤ déplacement de la chapter-card 📐 (avec sa drop-zone) hors de `tab-fiches` vers le nouvel onglet ; ⑥ `hideAllTabs`.
**Aucune ligne écrite dans index.html — j'attends l'arbitrage** (morceau séparé ou intégré à M11).

## 4. Invariants — empreintes AVANT toute ligne (md5 16 hex · taille car)

`buildTokens` ×2 : noyau off 18289 `02058bad0985ceae`·394 ; zone 3ter off 78873 `795e35d0d47b6d27`·414 (pt 27 — jamais réimplémentées, extraites verbatim si déplacement) · `nearestTokenIdx` 4918eb75b79aac30·112 · `nearestByRect` 89a6dc97fe793999·502 · `tokenTargeted` 55cc9bc7f8a10a21·131 · `evaluer` 247bfdb6eb7d4444·2789 · `baremeEffectif` 41ad8c7095f19a0b·550 · `recalcResult` 1acbc87f2de79d9c·349 · `agregerResultats` e54931128e500c5a·1066 · `collecteSuivi` d3fa10ebd8b12873·801 · `parseCorrige` 3a3dd49aecc1ed14·1248 · `_localiser` 356cc62c04aefb4d·446. Vérification avant/après au rapport.

## 5. Textes élève relevés (casse-insensible, tout l'écran élève) — à soumettre

1. L2115 AppEleve : « En mode délimitation, tu travailles sur la feuille papier remise par ton professeur » → « mode délimitation » = jargon ; « ton professeur » + accompli → proposer : « Tu travailles sur la feuille papier que je t'ai remise. » ; 2. L2115 : « Les modes où tu rédiges directement à l'écran… arriveront ici » = annonce (pt 26 → éditable) ; 3. L1173 : « Élève introuvable : … Vérifie l'orthographe » (remplacé par le portail M9) ; 4. Feuille élève L1592 : « Fais l'analyse logique du texte ci-dessous (crochets, soulignements, étiquettes, flèches) » ; 5. Fiches imprimées : verdicts « juste / partiel / absent / faux » + « (non avenu : non nommé) » — compréhensibilité 4ᵉ à arbitrer ; 6. Textes du noyau (« Glisse… », infos outils) : manipulés par le prof en mode délimitation, deviendront écran élève dans les modes libres — dictionnaire pt 26 dès maintenant.

## 6. Plan de codage ordonné (après feu vert)

1. **Vendorisation** (option arbitrée) — 4 balises src → 4 blocs inline ; double parseur sur tous les blocs.
2. **Socle 1.1.0** : remplacement du bloc socle par la référence `mjpc-core.js` (sanMJPC canonique, lireSessionMJPC, validerEleveMJPC…) ; suppression `?role=`.
3. **Identité** : portail code+nom+prénom `/codes` (patron M9 `resoudreClasse`/`codeAttendu` — /codes hétérogène constaté : entrées sans `classe`, résidus chaîne → résolution via `/classes`) ; shunt §8 élève ET prof (Prof démarre authentifié si `lireSessionMJPC().is_prof` ; auth par code retenue le temps de l'onglet — dette M9 soldée d'office) ; porte prof PROF_CODES seed+surcharge, trace « accès professeur », `map(String)` sur comparaisons.
4. **Nav 2 niveaux** + panneau accueil + charte. Répartition proposée : Pilotage = Travaux·Correction·Bilan ; Données = Copies·Fiches·Suivi·Exercices ; Réglages = Référentiel·Barème·Réglages app ; ? = aide + annonces. (Sort de 🛠 Développement/Todo : Q3.)
5. **« Mes analyses »** (élève) : patron « Mes dictées » — liste des travaux publiés de sa classe, verdicts et note ; le profil MJPC affiche l'état, l'app le contenu.
6. **Point 19** : corbeille avant les 3 gestes destructeurs ; confirm natifs remplacés.
7. **Point 26** : dictionnaire des textes qui annoncent (seed + surcharge Firebase).
8. **Présence** (pt 22), **bloc diagnostic** (pt 23), **pastille 2.0.0 + métas anti-cache** (pt 18, bottom:10/right:10, aucun flottant dessous — leçon M9 refresh-btn), **ⓘ** (pt 6).
9. **Mode test** (pt 16) : 6 élèves fictifs, vrais composants, slug `_test_analyse_logique`, auto-nettoyé.
10. **Responsive ≤480** (pt 17) : mesures aux deux tailles, desktop inchangé.
11. **Test d'intégrité comptage** (pt 14bis) livré avec le calcul.
12. **Captures d'office** (@sparticuz/chromium + puppeteer-core) : portail (sans code / code faux / nom inconnu / code réel), shunt (élève entre / prof reconnu sans code / session périmée), « Mes analyses », tactile aux deux tailles ; + cahier registre-bugs §5 : flèches SVG (arcs 80-100 non aplatis, dorées dans conteneur, gap).
13. **Rapport** : diff intégral classé, invariants avant/après, harnais LECTURE SEULE STRICTE (PUT/POST/PATCH/DELETE avortés journalisés), parcours joués, textes soumis. Bit à bit local↔sas.

Fixture hub favorable : un seul travail (jetable « qfqfq », aucun résultat élève) — harnais sans risque de données réelles.

## 7. Décisions de plan (tranchées par les documents — appliquées sauf contre-ordre)

D1. `?role=` supprimé (doctrine : jamais de rôle falsifiable en URL). D2. Libellé élève : **« Mes analyses »**. D3. Pastille **v2.0.0** (précédent M9 : passe complète = 2.0.0). D4. Concordance déclarée non codée. D5. Texte AppEleve réécrit 1ʳᵉ personne/flux, soumis au rapport.

## 8. Questions — uniquement ce que les documents ne tranchent pas

**Q1.** Vendorisation : **option A** (blocs M9 verbatim, React 18.2.0 + Firebase 9.23.0 compat — recommandée) ou option B (npm 18.3.1 + 8.10.1 natif) ?
**Q2.** Q5/index.html : morceau séparé ou intégré au livrable M11 ? (Coutures prêtes §3 ; je ne touche pas index.html sans arbitrage.)
**Q3.** Onglet 🛠 Développement (Todo prof persisté Firebase) : le ranger sous **Réglages** (proposition), le garder à part, ou l'extraire du livrable ?
**Q4.** Fiches imprimées : les verdicts « partiel » / « (non avenu : non nommé) » sont-ils du vocabulaire de classe assumé, ou à reformuler (pt 25bis) ?

J'attends le feu vert avant toute ligne de code. Zéro écriture hub à ce stade.
