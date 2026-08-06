# SITE-MOBILE — CADRAGE (TEMPS 1)
**La passe tactile du site (dette D-M8M-2).** Exécutant [C5-SM], sous conscience n°5 · 06/08/2026.
BASE mesurée : production **815 207 o, md5 `deef60b9099c1de4e131226c8c089b6c`** (conforme au mandat).

## 1 · État des lieux — mesuré au harnais tactile (390 px, `is_mobile` + `has_touch`), `page-level` hors console

### 1.1 · Vue ÉLÈVE — 34 cibles, **8 sous la norme**, page sans débordement (sw 390 = cw 390)

| cible | mesuré | manque |
|---|---|---|
| `.back-btn` « ← Accueil » | **72 × 34** | hauteur (−10) |
| `.tab` « Chapitres » | 101 × **34** | hauteur (−10) |
| `.tab` « Fiches transversales » | 161 × **34** | hauteur |
| `.tab` « Zone autonomie » | 137 × **34** | hauteur |
| `.tab` « ✍️ Réécriture » | 124 × **34** | hauteur |
| `.tab` « 🧠 Évaluation des connaissances » | 242 × **34** | hauteur |
| `.tab` « 📖 Étude de texte » | 148 × **34** | hauteur |
| `.section-label` « Chapitres » | 326 × 15 | *(libellé, non tactile — hors liste de contrôle, déclaré)* |

Débordements : la page ne déborde pas, mais **trois `.gc-acts` / `.gc-pub` de lignes d'items sortent de l'écran** (bord droit à 553 et 393 px pour un écran de 390) — colonnes de grille conservées au mobile. Hauteur `#page-level` : 2 598 px (≈ 3 écrans, mais c'est un défilement vertical de contenu, pas un panneau : critère ② non engagé).

### 1.2 · Vue PROF — 192 cibles, **166 sous la norme**, **la page déborde (sw 458 > cw 390)**

Familles (le détail complet des 166 est produit au rapport du TEMPS 2) :

| famille | occurrences | mesuré |
|---|---|---|
| `.admin-action-btn` (✏ 🔗 🚀 ↑ ↓ 📋 ✕) | 34 + 34 + 25 = **93** | 26×20, 22×18, 30×20 |
| `.pub-dot` « ✓ Toutes » | 17 | **62 × 19** |
| `.pub-dot.clk` « CHARLES DE GAULLE » | 17 | **141 × 18** |
| `.pub-dot.clk` « CLASSE TEST » | 17 | **93 × 18** |
| `.ch-publish-btn` | 4 + 3 = 7 | 141×25, 77×25 |
| `.tab` (onglets) | 6 | ×34 de haut |
| `.back-btn` | 1 | 72×34 |

Débordements horizontaux (uniques) : **PAGE 458/390** · `.level-header` 458/390 · **`.chapter-card` 552/324** · `.chapter-header.gr-row` 520/324 · `.chapter-body.open` 552/324 · `.seance-block` 530/280 · `.seance-header.gr-row` 530/280 · `.gc-acts` et `.admin-action-btn` hors écran (bord droit 483 → 585).

### 1.3 · LE CAS DE PAUL, mesuré (chapitre 1, titre long, 3 classes)

`.chapter-title` = **64 px de large × 126 px de haut** — le titre est étranglé sur ~6 lignes dans une colonne de 64 px, pendant que la carte réclame **520 px pour 324 disponibles** : les pastilles de classe partent à droite hors de l'écran (« CHARLES DE GAULL… » coupé). C'est exactement le constat de la capture.

Capture d'état : `captures/avant_390_carte_chapitre.png`, `avant_390_eleve.png`, `avant_390_prof.png`.

### 1.4 · Accueil des niveaux (cartes 6e-3e) à 390

Ne déborde pas (sw = cw = 390) dans les deux vues. Rien à corriger là : constaté, pas touché.

### 1.5 · Desktop (référence de la mesure croisée)

192 cibles, page 1440/1440, aucune anomalie — c'est la référence d'INCHANGÉ du TEMPS 2.

## 2 · Ce que je compte changer — sous `@media (max-width:480px)` UNIQUEMENT

Le seuil **480 px** est le seuil dominant du fichier (déjà 6 blocs en usage, dont celui du volet ⑥) : réutilisé, aucun seuil nouveau.

1. **La carte de chapitre s'empile** — `.chapter-header` et `.seance-header` (grilles `gr-row`) passent en une colonne : `grid-template-columns: 1fr`, le numéro et le titre en pleine largeur (le titre respire sur 1-2 lignes), puis les pastilles de classe **dessous** en `flex-wrap: wrap`, et la rangée d'actions `.gc-acts` dessous également, en `wrap`. Objectif chiffré : `.chapter-card` scrollWidth == clientWidth, plus une seule pastille coupée.
2. **Le bandeau haut** — `.level-header` en deux rangs sous 480 (retour + niveau, puis le compte à rebours), `flex-wrap`, plus de chevauchement possible ; **« ← Accueil » porté à ≥ 44 px** (hauteur et zone tactile).
3. **Les onglets** — hauteur ≥ 44 px ; la rangée devient une **bande scrollable dédiée** (`overflow-x:auto`, `flex-wrap:nowrap`, `-webkit-overflow-scrolling:touch`) : le défilement horizontal, s'il a lieu, est **propre et contenu dans la bande**, jamais celui de la page.
4. **Les cibles sous-norme restantes** — `.admin-action-btn` (93 occurrences), `.pub-dot` / `.pub-dot.clk` (51), `.ch-publish-btn` (7) portées à ≥ 44 px de haut (et largeur ≥ 44 pour les carrées), avec `flex-wrap` sur leurs rangées pour qu'elles restent dans l'écran. Toutes listées une à une, AVANT/APRÈS, au rapport.

**Méthode et limites** : du CSS d'abord ; si une enveloppe de rendu est indispensable (par exemple une classe sur la rangée des pastilles pour la faire passer à la ligne), elle sera **minimale et déclarée avec tailles avant/après**. Aucune logique JS, aucun texte, aucun rendu réécrit, la console (déjà passée le 20/07) non touchée, et **rien au-dessus de 480 px**.

## 3 · Plan de preuve (TEMPS 2)

- **Le même harnais rejoué** sur le livré : tableau **AVANT/APRÈS complet** des cibles relevées ici, aux deux vues.
- `scrollWidth == clientWidth` **partout** (page, `.chapter-card`, `.chapter-body`, `.seance-block`, `.level-header`), aucune boîte au-delà de 390 px sauf l'intérieur de la bande d'onglets (défilement voulu, mesuré comme tel).
- **Toutes** les cibles relevées ≥ 44 px après correctif.
- Le cas de Paul rejoué : titre sur 1-2 lignes (largeur ≥ 240 px), 3 classes visibles sans coupure.
- **Vue élève rejouée et capturée** (règle du dispositif) : AVANT/APRÈS à 390.
- **DESKTOP : mesure croisée base/livré** — mêmes cibles, mêmes dimensions, même disposition (le contrepoids du 20/07 est opposable : le desktop est un usage de plein droit).
- Captures : 390 vue élève et vue prof AVANT/APRÈS, la carte de chapitre AVANT/APRÈS, desktop base/livré côte à côte.

---
**STOP.** J'attends le feu vert de la conscience n°5 sur ce cadrage avant d'éditer une seule ligne (TEMPS 2 : `SITE-MOBILE/index.html` + rapport + captures, pastille 8.34.0).
*[exécutant C5-SM]*
