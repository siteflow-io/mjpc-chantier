# LOT ⑫ — RAPPORT DE LIVRAISON (nettoyage diaporama)
*Exécutant LOT ⑫, 20/08/2026. Livraison : `LOT12/index.html` version **8.57.0**. En attente d'audit de la conscience — aucune promotion.*

## BASE
`index.html` production 8.56.2 — re-téléchargée à la commande : **1 001 473 o**, md5 **`660956e0dc121c9d8e0a84c9ad98e690`** ✅ conforme au mandat. Toutes les éditions faites sur cette base fraîche, jamais de mémoire.

## PÉRIMÈTRE EXÉCUTÉ (mandat + 3 amendements de Paul)
- ① IIFE drag-drop d'images L9426–9456 (signalement exécutant, retenu) — parti avec le bloc unique.
- ② Variable d'état `DP` (L9201, 27 occurrences brutes toutes dans le §) — partie avec le bloc unique, `\bDP\b` → 0.
- ③ Le § DIAPORAMAS L9086–9457 retiré d'UN SEUL bloc : **24 826 o** (les 19 fonctions y résidant + DP + DIAPO_FORME_INTERDITE + l'IIFE + tous les interstices).

## RETRAITS — mesures
| Retrait | Bornes (base ou courant) | Octets |
|---|---|---|
| Bloc unique § DIAPORAMAS (19 fonctions + DP + FORME_INTERDITE + IIFE) | L9086–9457 base | 24 826 |
| Module « Mes diaporamas » (comm ③ + `AT_DIAPOS`/`AT_DIAPOS_ETAT` + atDiaposAssurer + diapoStatutLiaison + atRendreDiapos + commentaire liaison + diapoLierModal + atSupprimerDiapo) | L12727–12851 | 7 586 |
| atDupliquerDiapo + commentaire ④ | L12974–12988 | 750 |
| atDiapoPoserNiveau + commentaire ① | L12925–12934 | 392 |
| ed2DiapoHtml + commentaire [LOT3] (machinerie AT_DIAPOS du papier) | L11639–11647 | ≈510 |
| CSS gabarit du lecteur (§ DIAPORAMAS styles, `.dp-*`) | L1078–1217 | 10 725 |
| CSS dépôt d'image diapo (`dp-img-btn/drop`, `dp-dep-aide`) | L878–881 | 442 |
| Bandeau § + `DIAPO_NOEUD` + `DIAPO_BLOCS` | L9022–9049 | 3 059 |
| Seed de prompt `ATELIER_PROMPT_SEED.diaporama` (mort : plus aucun chemin ne pose `produit='diaporama'` ; son jeton `@@BLOCS@@` appelait une fonction retirée) | L7223–7253 | 2 676 |
| Paragraphe MJPC_PRESENTATION « UN CAS QUE TU RISQUES DE MANQUER : les diaporamas » (recommande un outil qui n'existe plus) | 4 lignes | 467 |
| Éditions intra-fonctions (branches, UI, chaînes, `@@BLOCS@@`, commentaires) | — | ≈1 082 (reliquat) |
| **TOTAL** | | **52 515** |

**Mesure avant/après** : 1 001 473 o → **948 957 o**, delta **52 515 o** (les 23 057 o de définitions cartographiées + tables, caches, module Mes diaporamas, CSS du lecteur, seed de prompt, branches, UI et chaînes).

## BRANCHES APPELANTES — règle « visible, muet, silence sobre »
| Lieu | Traitement |
|---|---|
| `openItem` (arborescence, ex-L3651) | Branche d'ouverture → garde silencieuse `if(item.kind==='diaporama')return;`. Sans garde, l'item chutait dans `alert('Type non supporté')` — erreur interdite par le mandat. |
| `edOuvrirItem` (fil, ex-L11328) | Idem : garde silencieuse (sinon chute dans un `atInfo` trompeur). |
| `ctxEntreesItem` (menu contextuel, ex-L11832) | Variable `diapo` et branche `openDiaporamaById` retirées ; « Ouvrir / Modifier » retombe sur `ed2Aller(k)` (sélection de la ligne du panneau — geste neutre, pas d'ouverture diaporama). |
| Bouton « Ouvrir » atelier (ex-L13152) | Parti avec `atRendreDiapos` (module entier). |
| `ed2Papier` | `_dpH` purgé (déclaration + 2 usages) ; l'item diaporama reste rendu par sa carte titre. |
| `atEditerChapitreRendre` | `_edtb` : `it.kind==='diaporama'` retiré (plus de bouton « Ouvrir l'éditeur » pour un diaporama, l'item reste dans le fil). |
| `atChapitresAssurer` | Condition `AT.onglet==='diapos'` retirée. |
| Commentaire ex-L11790 | Mention `openDiaporamaById` retirée. |

## UI
Porte « Nouveau diaporama à convertir » (3 lignes du bouton) retirée · onglet « Mes diaporamas » retiré, condition de l'onglet « Mes feuilles » simplifiée, branche de rendu `diapos` retirée · lecteur : CSS entier retiré (zéro usage `dp-*` restant) · version → **8.57.0** (constante `APP_VERSION` + `APP_VERSION_DATE` 2026-08-20 ; la pastille et le badge lisent la constante).

## PREUVE 1 — GREP-ZÉRO (38 motifs, tous → 0)
| Motif | Occ. | Motif | Occ. |
|---|---|---|---|
| diapoCles | 0 | openDiaporamaById | 0 |
| diapoDeposerImage | 0 | DIAPO_BLOCS | 0 |
| diapoEcrire | 0 | DIAPO_FORME_INTERDITE | 0 |
| diapoEnregistrer | 0 | AT_DIAPOS | 0 |
| diapoIdPropose | 0 | AT_DIAPOS_ETAT | 0 |
| diapoImagePoser | 0 | **AT_DIAPO (forme nue, ④)** | 0 |
| diapoInfo | 0 | DIAPO_NOEUD | 0 |
| diapoLierModal | 0 | ed2DiapoHtml | 0 |
| diapoMarquer | 0 | atRendreDiapos | 0 |
| diapoOuvrir | 0 | atDiaposAssurer | 0 |
| diapoRelecture | 0 | atSupprimerDiapo | 0 |
| diapoRendre | 0 | atDiapoPoserNiveau | 0 |
| diapoRendreBloc | 0 | atDupliquerDiapo | 0 |
| diapoRendreEcran | 0 | « Mes diaporamas » | 0 |
| diapoStatutLiaison | 0 | « Nouveau diaporama » | 0 |
| diapoTexteBrut | 0 | @@BLOCS@@ | 0 |
| diapoToutRelu | 0 | _dpH | 0 |
| diapoValider | 0 | **`\bDP\b` (amendement ②)** | 0 |
| diapoVerifier | 0 | diapoVocabulaireBlocs | 0 |

Deux résidus interceptés en cours de preuve et traités : l'appel orphelin `diapoVocabulaireBlocs()` derrière le jeton `@@BLOCS@@` (aurait crashé sur un prompt persisté portant le jeton), et deux commentaires (mémoire du BUG 04/08 réécrite sans le nom `diapoRendreEcran` ; commentaire des portes ramené au seul flux chapitre).

## PREUVE 3 — DUAL PARSER (état final livré)
```
node --check extrait_final.js  → VERT (exit 0, aucune sortie d'erreur)
acorn ES2020                   → VERT — AST construit sans erreur
```

## PREUVE 4 — BANC NAVIGATEUR
Harnais `LOT12/tests/harnais_lot12.js`, adapté de `DEROULE/tests/harnais.js` : chemin `file://` vers l'index de travail, injection `__inv` retirée (spécifique déroulé), **dialogues journalisés et refusés**, **réseau bloqué** (seuls `file://` et `data:` passent — les requêtes Firebase/fonts bloquées apparaissent au journal comme `ERR_FAILED`, preuve du blocage, pas erreurs du code). Outillage : puppeteer-core + @sparticuz/chromium, `executablePath` via `(c.default||c).executablePath()`.

| Exigence | Résultat |
|---|---|
| Boot sans erreur console | ✅ v8.57.0 affichée, **0 pageerror**, 0 dialogue (console : uniquement les `ERR_FAILED` des ressources volontairement bloquées) |
| Chapitre avec item `kind==='diaporama'` : visible, aucune action, aucune erreur | ✅ item de banc publié VISIBLE dans l'arborescence (`itemDiapoVisible:true`, témoin doc aussi) ; **clic réel** : DOM stable, aucun overlay ouvert, 0 dialogue, 0 erreur |
| L'atelier s'ouvre | ✅ écran actif, zone remplie ; onglets « Mes feuilles / Mes chapitres » (sans « Mes diaporamas ») ; portes « Nouvelle feuille / Nouveau chapitre » (sans diaporama) |
| L'arborescence s'ouvre | ✅ rendu complet, item historique dans le fil de l'éditeur également visible |

Captures d'office : `capture-1-boot.png`, `capture-2-arborescence.png`, `capture-3-atelier.png`, `capture-4-editeur.png`.

Note de méthode : réseau bloqué ⇒ les données de chapitre sont injectées EN MÉMOIRE (`chapitresData`) avec `published:true` (au premier essai sans `published`, le filtre normal `_visiblePourSession` masquait l'item — comportement de production, pas une régression).

## PREUVE 5 — FONCTIONS VOISINES MODIFIÉES (taille avant → après)
| Fonction | Avant | Après | Δ |
|---|---|---|---|
| openItem | 2 871 | 2 785 | −86 |
| atRendreListe | 4 884 | 4 290 | −594 |
| atChapitresAssurer | 387 | 365 | −22 |
| edOuvrirItem | 378 | 403 | +25 (garde silencieuse + commentaire [LOT12] remplacent la branche) |
| ctxEntreesItem | 1 056 | 959 | −97 |
| ed2Papier | 10 400 | 10 232 | −168 |
| atEditerChapitreRendre | 13 512 | 13 471 | −41 |

Fonctions vivantes adjacentes aux découpes, vérifiées présentes et intactes : `chCalculerEcritures`, `uidRenouveler`, `atDupliquerChapitre`, `AT_NOMS_COURTS`, `ed2PagModeLu` (et toute la pagination ed2\*, hors périmètre par arbitrage).

## DEUX DÉCISIONS PRISES (à trancher à l'audit)
1. **`CH_KINDS` garde `'diaporama'`** : ce vocabulaire valide les données de chapitres ; le retirer ferait refuser les chapitres historiques porteurs d'items diaporama (données intouchables par mandat).
2. **`ATELIER_COMPOSANTES.diapositive_json` laissée** (composante `reserve:true`, invisible du vocabulaire) : hors liste fermée du mandat ; sa mention (« Cette partie arrivera avec le chantier des diapositives ») est désormais caduque → dette signalée ci-dessous.

## INCIDENTS (sans dégât)
Deux scripts de coupe ont planté sur assertion **avant toute modification** (commentaires à deux lignes mal bornés) — garde-fou efficace, fichier vérifié intact, bornes corrigées, recoupe propre. Écart de mesure signalé à la cartographie (21 744 o mesurés vs 21 697 o au mandat pour les 20 fonctions, 0,2 %) : différence de borne probable, sans effet sur les retraits (bloc unique).

## LIVRAISON
`LOT12/index.html` (8.57.0, 948 957 o, md5 `de71f8c123564abd0550845714629207`) · `LOT12/MATERIAUX-DIAPO.md` (accepté) · `LOT12/CARTOGRAPHIE.md` (acceptée) · `LOT12/RAPPORT.md` · `LOT12/tests/harnais_lot12.js` + `LOT12/tests/banc_lot12.js` · `LOT12/tests/capture-{1..4}.png`.
**Aucune promotion : le lot attend l'audit de la conscience puis le « promeus » de Paul.** Point de retour : blob de la 8.56.2 (md5 `660956e0dc121c9d8e0a84c9ad98e690`) à noter par la conscience.

## DETTES / TÂCHES RESTANTES (cahier des charges vivant)
- LOT12 : `ATELIER_COMPOSANTES.diapositive_json` (réservée) — mention caduque, à retirer ou reformuler (geste de conscience ou lot suivant).
- LOT12 (après promotion, geste de conscience) : corbeille + destruction du nœud `/site/diaporamas` au hub.
- Déroulé : intégration (lots suivants) ; relevé des collisions de noms à refaire au moment de l'intégration ; portage de la pagination `ed2Pages` en 16:9.
- Dette QCM : champ « niveau » de classe → déduire via `deduireNiveauDuNom`.
- pilotage_debat_s3.html : refonte multi-classes en suspens (« chantier à reprendre »).
- Banque d'exercices : onglet Exercices de correction_dictee → app autonome.
- M-SÉCU : chantier Firebase non négociable avant la rentrée.
