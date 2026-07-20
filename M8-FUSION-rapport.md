# M8-FUSION — RAPPORT DE LIVRAISON (exécutant continué M8-MOBILE→M8-FUSION, 20/07/2026)
*Une seule administration du site. Livré au sas EN UNE FOIS avec `index.staging.html`. Je ne promeus jamais.*

## 0. Contrôle de traces (exécutant continué — consigne Q0)
Fait avant codage et vérifié : `ls -lat` du conteneur — tous les fichiers datés de ma propre session (10:14→12:44 UTC), tous reconnus ; historique du sas — mes deux pushes M8-MOBILE (11:43), le nettoyage conscience post-promotion (11:50), ma note de cadrage (12:44). Aucune trace étrangère, aucun trou de mémoire détecté.

## 1. Empreintes
- **Base** : production `index.html`, 356 815 o, md5 `5b6eb7e1aee516da6e04aeb08745d19e`, v8.2.0.
- **Livré** : `index.staging.html`, **358 720 o, md5 `bf6ba1e165640f8ae3f51fb13720f0f3`, `APP_VERSION="8.3.0"`** (grep avec lignes `//` écartées d'abord).
- **Double parseur** : `node --check` OK · acorn 2020 OK.

## 2. Table de correspondance ancien → nouveau (prouvée au harnais)
| Ancien (console de `page-level`) | Nouveau | Preuve |
|---|---|---|
| 🧪 Mode test (bloc) | **Bascule permanente d'en-tête** (pastille) + **point orange sur le bouton flottant** quand actif | parcours §5 : repos « 🧪 Mode test » discret → tap → « Mode test actif — rien n'est enregistré » + point flottant visible PANNEAU FERMÉ |
| 📢 Annonces aux élèves | section *Contenu* → `annonces` | rendue dans le panneau, 22 cibles, 0 sous-norme |
| 🎓 Dates du brevet | section *Contenu* → `brevet` | rendue, 18 cibles, 0 sous-norme |
| 📚 Taxonomie | section *Contenu* → `taxo` | éditeur ouvert DANS le panneau : `{editeur:true, domaines:5, dansPanneau:true}` |
| 🔒 Règles Firebase | section *Système* → **« ⚙ Configuration & Firebase »**, EN TÊTE de section | `{reglesPresentes:true, reglesAvantDanger:true}` — zone dangereuse en bas, marge 40 px en mobile |
| « ⚙ Console du site » + « Ouvrir / fermer la console » | **disparus** (F1/F4) | `grep "Console du site"` → 0 occurrence |
| ⚙️ Outils prof (top:36) | **📚 Mes applications** (top:76), sans les 3 grisées | 7 entrées mesurées ; Panneau prof passé en premier (top:36) — Q2 |

## 3. Aucune fonction supprimée ni réécrite — preuves
- **Les 5 `_bloc*` : md5 IDENTIQUES avant/après** (extraction par équilibrage d'accolades) : `_blocModeTest 5c2792448968` · `_blocAnnonces 80ff68e94ee8` · `_blocBrevet 0db6d7d1d2fe` · `_blocRegles 08f431d3d4f2` · `_blocTaxonomie e41606bcdc9e` — déplacées, jamais réécrites.
- **Retraits Q1, périmètre EXACT de la consigne, greps de non-appel** : `M8_UI` → 0 · `m8ToggleBloc` → 0 · `_m8Accordeon` → 0 · `m8-acc` → 0 (les 9 règles CSS).
- **Conservées SANS appelant (garde-fou Q1-③, déclarées)** : `_blocModeTest` (L1208 — 1 occurrence = sa définition ; ses libellés vivent, la pastille reprend « rien n'est enregistré ») · `ouvrirConsoleM8` (L1283 — 1 occurrence = sa définition ; son bouton unique a disparu avec le wrap).
- **Diff exhaustif : 50 retirées / 85 ajoutées / 23 hunks, les 50 retirées classées à 100 %** : 9 CSS `.m8-acc-*` (Q1) · 27 section JS accordéon (Q1) · 1 assemblage (remplacé par le pont) · 1 wrap `page-level` · 3 entrées grisées · 7 lignes boutons/header/sidebar (remplacées par leurs versions renommées/enrichies) · 1 h2 config · 1 pastille version. Aucune ligne retirée hors catégorie.

## 4. Les appelants de `renderConsoleM8` — 9 avant, 9 après, tous aboutissent
| Avant (v8.2.0) | Origine | Après (staging) | Aboutissement |
|---|---|---|---|
| L952 | `m8BasculerModeTest` | L967 | pont → rafraîchit indicateurs (toujours) + section active si m8 |
| L1011 / L1019 | dates brevet (écriture/réinit) | L1026 / L1034 | pont → re-rend la section `brevet` (seul lieu du geste) |
| L1071 | annonces/mode test | L1086 | pont → section active |
| L1115 / L1126 | annonces (écriture/suppression) | L1130 / L1141 | pont → re-rend la section `annonces` |
| L1154 | `m8ToggleBloc` (accordéon) | **disparu AVEC son porteur** (retrait Q1) | sans objet |
| L1264 | `ouvrirConsoleM8` | L1287 | **inerte** : fonction conservée sans appelant (Q1-③) |
| L1560 | gestes taxonomie | L1583 | pont → re-rend la section `taxo` |
| — | — | **L3219 `showProfSection` (nouveau)** | pose `M8_SECTION` et déclenche le premier rendu de section |
Le mécanisme : `#m8-console` a déménagé dans le contenu des sections ; la garde EXISTANTE `if(!el) return` couvre tout appel hors section m8. Un geste d'annonce n'est possible QUE dans la section annonces : l'appelant re-rend toujours le bon endroit. **Preuve d'aboutissement au harnais** : dépliage taxonomie re-rendu dans `.tprof-content #m8-console .m8-bloc` (vrai), bascule mode test rafraîchissant pastille et point dans toutes les situations testées.

## 5. Mesures AUX DEUX TAILLES (harnais, stub identique : 3 annonces fabriquées — `/site/annonces` toujours null au hub —, `ctrl` réel, taxonomie canonique)
### MOBILE 390 px (`is_mobile` + `has_touch`)
| État | AVANT | APRÈS |
|---|---|---|
| Largeur de contenu du panneau | **98 px** | **364 px** |
| Sidebar | 230 px verticale (fixe, écrase le contenu) | barre horizontale défilante 364×57 |
| Dashboard : cibles sous 44 px | 9/9 | **0**/13 |
| Section Annonces | n'existait pas au panneau | **0**/22 sous-norme |
| Section Brevet | — | **0**/18 |
| Section Taxonomie | — | **0**/14 |
| Section Configuration & Firebase | — | **0**/20 (les 5 boutons de la zone dangereuse relevés à 44 px ; séparation +40 px de marge) |
| Débordement horizontal | — | **0 partout** |
Pastille active mesurée 292×44 (pleine largeur SOUS le titre en mobile, comme spécifié). Journal réseau : 20 requêtes, **exclusivement GET**.
### DESKTOP 1280 px (souris — rien ne doit changer au-dessus du seuil)
| Mesure | AVANT | APRÈS |
|---|---|---|
| Largeur de contenu | 868 px | **868 px** |
| Sidebar | 230 px, verticale, permanente | **230 px, verticale, permanente** |
| Bouton de section | 229×41 | **229×41 (inchangé — règle desktop ①)** |
| Labels de groupe (Vue d'ensemble…) | visibles | **visibles** |
La media query 768 est la PREMIÈRE `tprof` du fichier (constat du cahier des charges levé) ; tout l'adaptatif y vit, le structurel (fusion, rangement, renommages) vaut pour les deux écrans.

## 6. Aveux d'écart
- **La pastille au repos n'est pas « rien du tout »** : Q3 supprimait toute signalisation au repos, mais la bascule doit rester actionnable (sans elle, le mode test devient inactivable — `_blocModeTest`, qui portait le bouton, n'est plus rendue). Lecture retenue : le silence porte sur la SIGNALISATION d'état ; un contrôle discret non orné (« 🧪 Mode test », sans pastille d'état, sans « mode normal ») reste présent. Se réduit ou se déplace en une ligne si la conscience tranche autrement.
- **Le corps de `renderConsoleM8` est réécrit** (annoncé au cadrage, validé Q4) : signature, cible, chargements et garde conservés ; hunk `1204,1209`.
- **Deux coutures dans des fonctions existantes** (annoncées) : `showProfSection` +3 lignes commentées `/* M8-FUSION */` (le point de passage unique) ; `_profSectionConfig` : h2 renommé + `<div id="m8-console"></div>` inséré après le sous-titre — le reste de la fonction intact.
- **Correctif découvert au harnais** : le `✕` était comprimé par flex (44 px posés, 36 rendus) → `flex:none` ; les `.mjpc-act` (zone dangereuse et autres actions du panneau) n'étaient couverts par aucune règle tactile → `min-height:44px` générique sur `.tprof-content` sous 768, pleine largeur sous 480.
- Le point orange flottant se distingue d'un badge de notification (exigence Q3) : inline AVANT le texte du bouton (pas en coin), orange du thème mode test (pas rouge), pulsation lente — même langage visuel que la pastille.

## 7. Ce que je n'ai pas pu tester
- Le vrai pouce sur le vrai téléphone (harnais émulé) ; les polices réelles (repli).
- Les sections historiques du panneau (Classes, Élèves & codes, Archives, Profil test) avec DONNÉES RÉELLES : mon stub les rend en placeholder — la règle générique 44 px les couvre, mais leurs layouts denses (tableaux d'élèves) méritent le regard de l'audit et l'usage réel de Paul.
- L'alerte bloquante J+29 (`verifierAlerteRegles` → overlay) : non déclenchable sans manipuler l'horloge ; son code est intact (0 ligne du diff ne la touche).
- L'outil d'heure de la plateforme, muet toute la journée (heures du conteneur TZ Paris, déclaré).

## 8. Écritures hub : ZÉRO
Harnais en avortement de toute méthode non-GET ; journal joint aux mesures (20 requêtes, GET uniquement). Lectures GitHub authentifiées, tailles + md5 vérifiés.

## 9. Dettes / restes (spec vivante du morceau)
- **D-M8F-1** (nouvelle) : sélecteur CSS inerte `#m8-console-wrap .ch-publish-btn` dans la media query M8-MOBILE (sa cible HTML a disparu ; hors liste de retrait Q1) — à purger à la prochaine passe CSS.
- **D-M8F-2** (constat, hors périmètre) : 5 libellés du lanceur « Mes applications » disent « — panneau prof » (celui des APPS cibles) — homonymie avec le Panneau prof du site, à renommer un jour (« administration de l'app » ?).
- **D-M8F-3** (constat) : sections historiques du panneau non mesurées avec données réelles (§7) — à couvrir au regard d'audit ou à la passe mobile du site.
- Rappels hérités, non touchés : D-M8M-1 (bloc Annonces sans repli interne au-delà de ~10) · D-M8M-2 (passe tactile de `page-level`, 10/10 sous-norme) · `sessionStorage 'mjpc_m8_test'` écrit jamais relu · F6 du cahier des charges (vocabulaire prof : slug/nœud/hub) non ouvert.
