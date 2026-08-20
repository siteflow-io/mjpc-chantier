# LOT ⑫ — RAPPORT C1 (réintégration des styles vivants)
*Exécutant LOT ⑫, 20/08/2026. Livraison : `LOT12/index.html` version **8.57.1** (écrase la 8.57.0). En attente d'audit — aucune promotion.*

## RECONNAISSANCE DU DÉGÂT
La coupe CSS L1078–1217 de la 8.57.0 appliquait la mauvaise preuve : « zéro usage des classes `dp-*` » ne couvrait qu'un sens. La preuve requise — **aucun sélecteur retiré encore utilisé** — n'avait pas été faite : 42+ sélecteurs vivants (at-btn, famille at-edch\*, onglets, sections, statuts, viewer atdoc, modale link, etc.) sont partis avec le bloc, déstylant l'atelier et l'éditeur. Promotion restaurée à la 8.56.2 : dégât confirmé, leçon prise — pour tout retrait de CSS, la preuve se fait dans les deux sens (sélecteur mort ⇒ zéro usage, ET usage ⇒ règle présente).

## BASES (re-téléchargées et vérifiées à la commande)
- Production restaurée 8.56.2 : 1 001 473 o, md5 `660956e0dc121c9d8e0a84c9ad98e690` ✅ — source du bloc original L1078–1217.
- `LOT12/index.html` 8.57.0 livrée : 948 957 o, md5 `de71f8c123564abd0550845714629207` ✅ — base des éditions C1.

## MÉTHODE (consignes ① et ②)
Le bloc original (99 règles + commentaires, 90 sélecteurs de classe distincts) a été analysé règle par règle. Critère strict de vitalité : le nom du sélecteur apparaît dans la 8.57.0 livrée (qui ne contient plus le bloc — toute occurrence est donc un usage). Chaque règle contenant **au moins un** sélecteur vivant est réintégrée **à l'identique**, dans l'ordre d'origine, **au même endroit** (la paire `<style></style>` vide laissée par la coupe, ex-L1073–1074). Seules les règles dont **tous** les sélecteurs sont morts restent retirées.

Résultat : **48 règles réintégrées** (46 sélecteurs conservés) + **2 `@keyframes`** ; **68 règles restées retirées** (42 sélecteurs morts purs, tous `dp-*`).

### Deux sauvetages au-delà des sélecteurs de classe
1. **`@keyframes atHalo` et `@keyframes atLierPulse`** vivaient dans le bloc : `.at-halo` et `.at-lier-pulse` (règles vivantes) les référencent. Sans keyframes, animations silencieusement mortes. Réintégrés à leur position d'origine.
2. **`at-lier-pulse` est VIVANT** (contrairement à la liste indicative C1) : 1 usage dans `renderItem` (« le LIER d'un item non lié respire ») — sa règle est réintégrée avec preuve d'usage. De même `at-st-flou` (3 occ.), `at-st-sans` (1), `atdoc-bandeau` (2). `at-nr` : 0 occurrence, et aucune règle `.at-nr` dans le bloc (déjà retirées au LOT11-③, seuls des commentaires en témoignent — commentaires d'histoire conservés).

### Quatre règles inertes gardées par consigne ①
`.dp-rel-tete .at-btn`, `.dp-choix .cm-input`, `.dp-choix .at-btn`, `.dp-choix .at-btn[disabled]` : contexte parent mort (`dp-rel-tete`, `dp-choix`) mais sélecteur vivant dans la règle → gardées entières comme exigé (« une règle groupée mêlant vivant et mort se garde ENTIÈRE »). Inoffensives (jamais appliquées) ; retirables sur décision de conscience.

### Commentaires
Conservés : tous les commentaires d'histoire attachés à des zones vivantes (LOT8-②/⑥, LOT9-⑦, LOT11-③, SITE-COURS-2b/2c/2d, C5-3a). Purgés : les bandeaux et commentaires ne parlant que du retiré (« § DIAPORAMAS », relecture diapo, « mobile 390 » du tableau dp-tab, « l'impression : c'est un cours » dont l'@media n'a gardé aucune sous-règle). Un bandeau `[LOT12-C1]` documente la reprise en tête du bloc.

## PREUVE (a) — SÉLECTEUR RETIRÉ → 0 USAGE (42/42, AUCUNE exception)
Grep à frontière de mot sur le fichier livré :
`dp-brut, dp-cit, dp-critere, dp-def, dp-diapo, dp-doc, dp-doc-titre, dp-ex, dp-ex-lib, dp-fig, dp-img, dp-img-vide, dp-leg, dp-note, dp-note-att, dp-note-lib, dp-num, dp-ol, dp-p, dp-rel-bloc, dp-rel-brut, dp-rel-case, dp-rel-diapo, dp-rel-forme, dp-rel-num, dp-rel-type, dp-relecture, dp-relu, dp-src, dp-sstitre, dp-tab, dp-tab-hote, dp-terme, dp-titre, dp-ul, dp-vide, dp-viewer, dp-viewer-barre, dp-viewer-corps, dp-viewer-imp, dp-viewer-titre, dp-viewer-x` → **0 chacun**.
(Nota : `dp-rel-tete` et `dp-choix` ne figurent pas dans cette liste car présents dans les 4 règles inertes gardées par ① — ils ne sont pas « retirés ».)

## PREUVE (b) — SÉLECTEUR CONSERVÉ → RÈGLE PRÉSENTE (46/46)
`at-btn, at-btn-danger, at-carte-st, at-edch, at-edch-in, at-edch-it, at-edch-itt, at-edch-lib, at-edch-num, at-edch-rempl, at-edch-se, at-edch-set, at-edch-ta, at-edch-ta-p, at-envoi-case, at-envoi-zone, at-halo, at-lier-pulse, at-onglet, at-onglet-actif, at-onglets, at-sec, at-sec-c, at-sec-ch, at-sec-o, at-sec-t, at-st-adresse, at-st-depose, at-st-diverge, at-st-flou, at-st-sans, at-tb-niveau, at-tb-tete, atdoc-bandeau, atdoc-viewer, atdoc-viewer-barre, atdoc-viewer-frame, atdoc-viewer-imp, atdoc-viewer-titre, atdoc-viewer-x, ch-atterrissage, cm-input, link-modal-btn, link-modal-input, link-modal-select, seance-rappel-atelier` → règle présente pour chacun. (`at-st-flou` a en plus une seconde définition pré-existante ailleurs dans le fichier — doublon aux valeurs distinctes mais identiques à la 8.56.2, qui portait déjà ce doublon.)

## PREUVE (c) — BANC SUR ÉCRANS RENDUS, C1 vs 8.56.2 CÔTE À CÔTE
Harnais lecture seule (dialogues refusés, réseau bloqué), session prof + `admin-mode`, chapitre de banc en mémoire ; le MÊME scénario joué sur les deux fichiers, styles CALCULÉS relevés (`getComputedStyle`) :

| Écran | 8.56.2 | 8.57.1 C1 | Verdict |
|---|---|---|---|
| ① Atelier — onglet | minHeight 44px, radius 10px, padding 8px 16px | idem | ✅ identique (seule différence : « Mes diaporamas » absent en C1, voulu) |
| ② Éditeur ouvert — champ (`at-edch-in/ta`) | border 1px solid, minHeight 44px, fond rgb(36,31,24) ; 11 champs | idem, 11 champs | ✅ identique |
| ② Éditeur — bouton (`at-btn`) | 1px solid, 44px | idem | ✅ identique |
| ③ Modale de liaison ouverte | visible ; btn/input/select minHeight 44px | idem | ✅ identique |

0 pageerror, 0 dialogue sur les deux fichiers. Captures côte à côte livrées : `c1-cote-a-cote-1-atelier.png`, `c1-cote-a-cote-2-editeur.png`, `c1-cote-a-cote-3-modale.png` (+ les 6 captures unitaires). Note : `.at-sec` n'apparaît dans AUCUN des deux fichiers pour ce scénario minimal (l'accordéon demande un autre chemin d'écran) — identique des deux côtés, donc hors régression.

## PREUVE (d) — DUAL PARSER (état livré 8.57.1)
```
node --check  → VERT
acorn ES2020  → VERT — AST construit sans erreur
```

## PREUVE (e) — DIFF C1 vs 8.57.0 : DEUX ZONES SEULEMENT
```
1073a1074,1143   ← insertion du bloc CSS C1 (70 lignes)
2666c2736        ← APP_VERSION "8.57.0" → "8.57.1"
```
Aucune autre ligne touchée.

## MESURES
8.57.0 : 948 957 o → **8.57.1 : 954 833 o** (+5 876 o de CSS réintégré). Le retrait net vs production reste **46 640 o**. md5 livré : `54da80f2847d865b7f1aea5ad3fcb984`.

## LIVRAISON
`LOT12/index.html` (écrasé, 8.57.1) · `LOT12/RAPPORT-C1.md` · `LOT12/tests/banc_c1.js` + `harnais_c1.js` · `LOT12/tests/c1-cote-a-cote-{1,2,3}-*.png` + 6 captures unitaires. **STOP : audit avant tout.**

## DETTES / TÂCHES RESTANTES (cahier vivant)
- LOT12 : 4 règles CSS inertes (contexte `dp-rel-tete`/`dp-choix`) gardées par ① — retirables sur décision de conscience.
- LOT12 : `ATELIER_COMPOSANTES.diapositive_json` (réservée) — mention caduque à reformuler.
- LOT12 (post-promotion, geste de conscience) : corbeille + destruction `/site/diaporamas` au hub.
- Déroulé : intégration (lots suivants) ; collisions à relever ; pagination `ed2Pages` à porter en 16:9.
- Dette QCM : `deduireNiveauDuNom`.
- pilotage_debat_s3.html : refonte multi-classes (« chantier à reprendre »).
- Banque d'exercices : à extraire de correction_dictee.
- M-SÉCU avant la rentrée.
