# M12 — Cadrage : site (`index.html`), lot 2
*Signé : [exécutant M12] — 22/07/2026 · MENTION PROVISOIRE (pt 21)*

## 0. Base vérifiée
`index.html` production : **365 082 o, md5 `f2bfefb648fcd42f3e3b3bddee119824`, v8.4.3, 4 547 lignes** — conforme au prompt, c'est l'état post-M11 (onglet Analyse logique promu, commit `f82be1360d`). Lectures ①-⑧ faites (conversation M11 en contexte ; DISPOSITIF bit à bit identique à ma lecture intégrale M11, point 16 rectifié compris ; DOCTRINE-SITE lue intégralement — 317 lignes). Patrons annexes vérifiés : `worktrack.html` 790 029 o, `applause_meter.html` 565 216 o (lecture seule, paramètres URL relevés).

## 1. État mesuré — grille de passe appliquée au site

| Pt | Objet | État mesuré | Geste M12 |
|----|-------|-------------|-----------|
| 16 | Mode test | Bascule M8 présente (pastille + point orange + `M8_TEST_STORE`) mais elle n'intercepte QUE `_siteGet/_sitePut/_siteDelete` (console M8 : dates, annonces, taxonomie). **Hors couverture : `_fbPutPath` (corbeille !), `_fbWriteRoot`, `_putCode`, ~20 `fetch(...PUT/DELETE)` inline des chapitres/items/liaisons** | Mes AJOUTS passent par le mode test (restauration corbeille, marqueur autonomie, kind des liaisons) ; la couverture générale des écritures chapitres préexistantes déborde M12 → déclaré (§8-Q5) |
| 18 | Pastille + anti-cache | `APP_VERSION="8.4.3"` en dur ✓, badge `proto-badge` suit ✓, métas anti-cache L6-7 ✓ | Numérotation **8.5.0** proposée (fonctionnalités nouvelles) |
| 19 | Corbeille | Écriture ✓ (5 motifs) ; **lecture/restauration : 0** — c'est le périmètre A | Écran complet |
| 22 | Présence | `updatePresence` + heartbeat 15 s + sendBeacon ✓ | RAS |
| 25/25bis | Textes élève | Relevé §6 | Soumis |
| 26 | Dictionnaire de textes | **ABSENT** (0 `TEXTES_DEFAUT`) ; la doctrine VIII exige la migration de `TAB_LABELS`/`PUBLISHABLE_TABS` (textes élève les plus visibles) | Périmètre à arbitrer (Q3) |
| 17 | Tactile ≤480 | 6 media queries existantes (383, 419, 425, 458 = 480 px ; 441 = 768 ; 90 = 700) | Mes écrans nouveaux : ≥44 px, ≤480 vérifié ; desktop inchangé |
| 2/5/6 | Nav, réglages, ⓘ | Panneau prof sectionné existant (dashboard/classes/eleves/profil-test/archi/archives/presence…), modale charte `_showConsoleModal` existante | Corbeille = nouvelle section du panneau ; ⓘ sur mes écrans |
| 21 | Mention provisoire | — | Portée par les deux livrables |
| 24 | Alerte règles Firebase | Overlay présent (L374, L1063, côté prof) | M-SÉCU, pas touché |

## 2. A · CORBEILLE — état mesuré et conception

**Écriture (existant, invariant)** : `_corbeillePut(motif,extract,meta)` → `corbeille/<AAAA-MM-JJ>/<motif>_<HHMMSS>`, payload `{_meta:{motif,date,ts,annee,source:'index',…meta},data:extract}` ; `_corbeillePuis` (archive AVANT destruction, refus arbitré si échec). **5 écrivains index** : `retrait-eleve`, `archive-eleves`/`suppression-eleves`, `purge-rentree`, `orphelin-<noeud>`, `suppression-classe`. La souche et le débat écrivent au même nœud racine (section W du plan).

**État réel du hub (GET 22/07)** : 3 jours — `2026-07-14/orphelin-results_170709` (source index, `_meta.noeud:"results"`, data.results) · `2026-07-19/suppression-dictee_185629` (source correction_dictee, `_meta.dictee:"dictee_test_en_attente"`, `_meta.le` au lieu de `ts`, data.config) · `2026-07-17/legacy-debat_singes` : **HORS FORMAT** (données brutes d'un ancien débat, ni `_meta` ni `data`). L'écran doit donc tolérer trois formes : canonique index, variantes d'apps (champs `_meta` hétérogènes), archive brute legacy.

**Conception proposée (patron M11 `analyse_logique`)** :
- Nouvelle section « 🗑 Corbeille » du panneau prof : liste par jour (desc), chaque item avec **étiquette lisible** (motif humanisé + titre/meta), **source**, **horodatage**, taille estimée, et détail dépliable (arborescence `data`, réutilise `_hubDetailHtml`-like léger).
- **Restauration** : la corbeille racine ne porte AUCUN champ de chemin de restauration (contrairement au patron M11). Proposition en deux temps : ① **table motif→cible** pour les motifs connus (`orphelin-<n>` → `/<n>` ; `suppression-dictee` → `dictees/<_meta.dictee>` ; `suppression-classe` → `classes/<_meta.classe>` + codes ? — voir Q1 ; `retrait-eleve` → réinsertion dans `classes/<_meta.classe>` + `codes/<clé>`) ; ② les items sans cible déductible (legacy, motifs inconnus) : consultation + export JSON seulement, PAS de restauration automatique, état dit à l'écran.
- **Confirmation chiffrée obligatoire** : avant restauration, GET de la cible ; si elle existe et diffère → modale charte « la cible contient déjà N enfants ; la restauration les remplacera » avec re-frappe d'un mot (patron du déblocage existant L3724) pour l'écrasement, simple confirmation si cible vide.
- **Complément au format** (soumis Q1) : les NOUVELLES écritures `_corbeillePut` gagnent `_meta.chemin` (la cible de restauration) — une ligne, rend les items futurs restaurables sans table.
- **Rétention** : affichage de l'âge + libellé « conservé 1 an » (promesse W) ; purge datée NON codée ici (W la veut « annoncée, jamais silencieuse » — conception à part), déclaré.
- **Mode test** : la restauration passe par un canal unique nouveau `_corbeilleRestaure()` qui respecte `m8TestOn()` (écrit dans `M8_TEST_STORE`).

## 3. B · MODALES ADMIN — recensement exhaustif et ordre proposé

Moteur existant conforme charte : `_showConsoleModal(title,bodyHtml,actions)` (cm-box). Il manque un équivalent `prompt` → j'ajoute `_modalePrompt(titre,label,valeur,cb)` et `_modaleConfirme(titre,corps,cbOui[,motConfirmation])` sur ce moteur.

**7 `prompt()`** (tous à remplacer — ils saisissent) : L2340 nouveau chapitre · L2358 nouvelle séance · L2377 nouvel item · L2405 renommage titre (ch/sce/item) · L2787 renommage image · L4473 renommage classe · L4497 **re-frappe du nom pour suppression de classe** (déjà une confirmation chiffrée en boîte native → passe en modale avec champ).

**16 `confirm()`** — ordre de remplacement proposé, DESTRUCTEURS d'abord :
1. Destructions de données pédagogiques : L2171 purge chapitres niveau (⚠ le plus lourd) · L2425 chapitre · L2435 séance · L2445 item · L3274 document (dans `initAdminDragDrop_`) · L2814 image · L1164 annonce.
2. Destructions d'identité : L3362 retrait élève · L3361 régénération TOUS les codes · L4495 suppression classe · L4482 archivage classe.
3. Autres saisies/valeurs : L2594 délier · L1585 désactiver notion · L1057 reset dates.
**EXCLUS et déclarés** : L1862 (`renvoyerVersMJPC` — SOCLE versionné, jamais modifié localement) · L3804 (`_corbeillePuis` échec corbeille — garde-fou de dernier recours volontairement natif : il doit fonctionner même si le DOM de modale est cassé ; je propose de le CONSERVER natif, dit à l'écran nulle part ailleurs).

**44 `alert()`** : informatifs/erreurs — HORS périmètre B (le prompt l'autorise), déclaré ; sauf les alert des flux que je touche (liaison, corbeille), convertis au passage.

## 4. C · GENRES D'ITEMS — cartographie complète

**Câblés bout en bout** (déclaration UI + chargement liste + ouverture) : `dictee` (liste `/dictees`, ouvre `openDicteeById`) · `reecriture` (`/reecritures`, `openReecriture`) · `qcm` (`QCM_FIREBASE_BASE/qcm/evaluations`, viewer `?mode=eleve&eval=`) · `debat` (`/debats`, viewer `?debat=`). **Câblés hors apps** : `doc` (défaut, Drive/external/html) · `gallery` (viewer dédié).
**Présents dans les DONNÉES mais pas dans le CODE** : `analyse_logique` (type d'item relevé au hub par la doctrine XIII) · `tache` — stylé (`iconClass='html'` L2244) mais **AUCUNE ouverture** : un item `kind:'tache', source:'firebase_app'` tombe sur `alert('Type d'item non supporté')`. **Absents partout** : `applaudimetre`, `worktrack`.
**Kinds du journal de sauvegarde** (`export`, `import`, `diagnostic`, `dry-run-purge`, `avant-unification`, `archive-avant-import` — `_logBackup`) : AUTRE espace de noms, jamais des genres d'items ; consignés pour lever l'ambiguïté de la fiche S5-⑤.

**Câblage proposé (aucun genre inventé — les 4 de la fiche)** :
- `analyse` (nom du kind : Q2) : liste `/analyse_logique/travaux` (titre = config.titre) ; ouverture `openViewer('Analyse logique','analyse_logique.html')` — l'app M11 ne lit AUCUN paramètre d'URL (`?role=` supprimé) : l'élève shunté arrive sur « Mes analyses » où le travail figure. Deep-link `?travail=` = dette côté app (déclarée, non traitée ici).
- `debat` : déjà complet — vérifié, rien à faire (constat vs fiche S5-⑤).
- `applaudimetre` : liste `/applaudimetre/seances` ; ouverture `applause_meter.html?n=<niveau>` (paramètres relevés : `qr`, `mode`, `view` — pas de deep-link séance : ouverture app, ref = trace de liaison).
- `worktrack` : liste `/plan_de_travail/chapitres` (aujourd'hui : `ch07`) ; ouverture `worktrack.html?n=<niveau>` (paramètres relevés : `n`, `classe` — pas de deep-link chapitre : dette app déclarée).
- `tache` : réparation minimale — ouverture = comportement `doc` (le fallback `src` joue déjà pour drive/external ; le cas `firebase_app` sans handler affiche un message propre au lieu de l'alert).
Chaque nouveau genre : section dans la modale de liaison (patron des 4 existantes), `loadAppList` étendu, icône, `openItem` étendu. `_markPub`/`isPubFor` intouchés.

## 5. D · MARQUEUR « AUTONOMIE » + ZONE AUTONOMIE

**État** : onglet `tab-autonomie` = carte statique unique avec drop-zone `data-section="autonomie"` (des documents déposés à la main), compteur à 0. **Aucun marqueur, aucune vue par étiquette.**
**Conception** : ① marqueur `autonomie:true` sur l'item (côté prof : bouton 🚀 discret dans `renderItem` en mode admin, toggle → PUT `<basePath>/autonomie` — passe par le canal mode test) ; ② vue élève : `switchTab('autonomie')` rend EN PLUS de la carte statique une vue dynamique « rassemblés pour toi » — variante de `collectChapterItems` **par marqueur** (`collectAutonomieItems(level)` : tous kinds, `_visiblePourSession` respecté — un item non publié pour la classe ne s'y montre pas, ref facultative pour rester listable), groupée par chapitre d'origine (patron `renderItemListByChapter`), clic = `openItem` normal ; ③ le marqueur est visible côté prof sur l'item (chip 🚀). La publication reste souveraine : autonomie n'outrepasse JAMAIS `isPubFor`.

## 6. Textes élève — relevé (casse-insensible, écran élève)
1. L727 « Cours de français — Monsieur Meney » (logo, RAS). 2. L2960 « Utilise le lien fourni par M. Meney. » (lien invalide — constat, conforme cardinal). 3. L3103/3115 « pas encore en ligne » (niveaux bloqués — à re-vérifier en contexte au codage). 4. gotoEvalConn : « QCM en classe avec ton prof… », « Si ton prof vient de lancer un QCM… » — 3ᵉ personne sur de l'inaccompli/flux : CONFORME au principe cardinal (le flux se dit, seul l'accompli passe à la 1ʳᵉ personne) ; soumis sans proposition de changement. 5. showDicteeList : « Le prof a corrigé ta dictée sur papier » — **accompli à la 3ᵉ personne** → proposer « J'ai corrigé ta dictée sur papier » (patron M9/M11). 6. Onglet autonomie : texte nouveau à SOUMETTRE (« Ce que tu peux faire en autonomie… » — proposition au rapport). 7. `TAB_LABELS` : lus par les élèves, en dur (doctrine VIII) — Q3.

## 7. Invariants déclarés (md5 AVANT, base `f2bfefb6…`)
`isPubFor` 97c89b70b639005f·354 · `_markPub` e085b2cbce189265·318 · `_visiblePourSession` 2c5987fedbb0bb33·254 · `collectChapterItems` efe1a48e79014883·1178 · `renderChapitres` fc54c4fa3636e446·2756 · `openViewer` 739f0775670a6827·307 · `switchTab` bb2f970673a2f681·475 · `m8TestOn` 7a2a1dad853c3045·47 · `_siteGet/_sitePut/_siteDelete` dacb…/ff19…/1283… · `_corbeillePut` 4742da548bff3315·546 · `_corbeillePuis` 8bcb68e33813aaab·321 · `_showConsoleModal` cfd96fe1284d3bee·950 · `restoreSession` 110a32a659cb1f81·597 · `_writeSharedSession` 8834296c4027ea88·211 · `sanMJPC` 1d99c7bed340·163 · `extractEleves` e7209d51b66d·1036 · `applyPublished` 9a4ad3c39aebfebd·1708 · `gotoAnalyse` cba7c3eec70f6925·1191 · socle MJPC (bloc versionné) intouché. Modifiés LÉGITIMEMENT et déclarés d'avance : `renderItem` (chip+toggle autonomie), `openItem` (nouveaux kinds), `hideAllTabs` non, `_corbeillePut` (ajout `_meta.chemin` si Q1 ✔), les 7 sites `prompt` et 14 sites `confirm` remplacés, `switchTab`/onglet autonomie (rendu dynamique ajouté SANS toucher la carte statique). Tout autre écart = défaut.

## 8. Plan de codage ordonné (après feu vert)
1. **Socles UI** : `_modalePrompt` + `_modaleConfirme` (sur `_showConsoleModal`) ; canal `_corbeilleRestaure` respectant `m8TestOn`.
2. **A · Écran corbeille** (section panneau prof) : liste, détail, export JSON d'un item, restauration par table motif→cible + confirmation chiffrée + refus sans confirmation ; tolérance legacy ; `_meta.chemin` sur les nouvelles écritures (si Q1 ✔).
3. **B · Modales** : les 7 `prompt` puis les 14 `confirm` (ordre §3), boîtes natives exclues déclarées.
4. **C · Genres** : `analyse` + `applaudimetre` + `worktrack` + réparation `tache` (modale de liaison, loadAppList, openItem, icônes).
5. **D · Autonomie** : marqueur admin + vue élève par étiquette.
6. **Pastille 8.5.0** + textes soumis + ⓘ + tactile de mes écrans.
7. **Double parseur, captures d'office** (chromium npm + puppeteer-core, harnais fixtures GET réelles + stub verrouillé — méthode M11), **état du hub**, rapport, bit à bit.
Parcours joués prévus : corbeille (consulter, restaurer sur cible vide, REFUS sans confirmation sur cible occupée), suppression de chapitre en modale, zone autonomie côté élève avec 1 item marqué, genre `analyse` lié et ouvert, tactile 480/1280.

## 9. Questions — uniquement ce que les documents ne tranchent pas
**Q1.** Format d'archive : puis-je ajouter `_meta.chemin` (cible de restauration) aux écritures `_corbeillePut` d'index ? C'est une EXTENSION du format unique W (les apps devront suivre à leurs passes — dette de propagation déclarée). Sans lui, seule la table motif→cible restaure. Recommandation : oui.
**Q2.** Nom du kind analyse logique : `analyse` (court, cohérent avec l'onglet `tab-analyse`) ou `analyse_logique` (déjà présent dans les données du hub selon la doctrine XIII) ? Recommandation : **`analyse_logique`** (coller aux données existantes, zéro migration).
**Q3.** Point 26 côté site : dans M12, je propose de limiter le dictionnaire de textes aux TEXTES DES VUES QUE JE TOUCHE (annonce de la zone autonomie, textes de l'écran corbeille côté prof n'en relèvent pas) — la migration de `TAB_LABELS`/`PUBLISHABLE_TABS` en base (doctrine VIII) est un chantier propre avec défauts en dur. La traiter ici ou la laisser au lot suivant ? Recommandation : lot suivant (déclarée en dette), M12 est déjà large.
**Q4.** `retrait-eleve`/`suppression-classe` : la restauration remet la classe/l'élève ET ses codes — la table de restauration peut-elle réécrire `/codes/<clé>` (données d'identité) ou doit-elle se limiter au nœud archivé tel quel (`data`) avec avertissement ? Recommandation : restaurer STRICTEMENT ce que `data` contient, rien d'inféré ; si les codes n'y sont pas, l'écran le dit.

**Constat annexe versé à la conscience (état du hub, sera refait au rapport)** : zombie `_test_pilotage_debat_s3` toujours présent · `_TEST` (30 noms réels 3e) et `CLASSE TEST` hors convention toujours là · corbeille legacy `legacy-debat_singes` hors format. Aucune écriture hub effectuée ; j'attends le feu vert avant toute ligne de code.
