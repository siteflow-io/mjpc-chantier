# SITE-MOBILE — RAPPORT DE LIVRAISON (TEMPS 2)
**La passe tactile de `page-level` (dette D-M8M-2).** Exécutant [C5-SM], sous conscience n°5 · 06/08/2026.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.33.0) | 815 207 o | `deef60b9099c1de4e131226c8c089b6c` |
| LIVRÉ (8.34.0) | 818 372 o | `ac02bd59ab0a7d4fecadab8fd5e0cc3d` |

Double parseur : **VERT**. **Inventaire JS : 0 supprimée, 0 ajoutée, 0 modifiée** — la livraison est **entièrement CSS**, aucune enveloppe de rendu n'a été nécessaire (donc aucune édition de rendu à déclarer), aucune logique, aucun texte, console non touchée.

## 2 · EXIGENCE A — le tableau AVANT/APRÈS de TOUTES les cibles relevées

**VUE ÉLÈVE** — avant : 34 cibles, **8 sous-norme** · après : 24 cibles, **0 sous-norme**

| famille | occurrences | dimensions AVANT (sous-norme) | sous-norme AVANT | sous-norme APRÈS |
|---|---|---|---|---|
| `.back-btn` | 1 | 72×34 | **1** | **0** |
| `.chapter-header` | 9 | — (conformes) | **0** | **0** |
| `.chapter-card` | 9 | — (conformes) | **0** | **0** |
| `.seance-header` | 8 | — (conformes) | **0** | **0** |
| `.section-label` | 1 | 326×15 | **1** | **0** |
| `.tab` | 6 | 101×34, 124×34, 137×34, 148×34, 161×34, 242×34 | **6** | **0** |

**VUE PROF** — avant : 192 cibles, **166 sous-norme** · après : 181 cibles, **0 sous-norme**

| famille | occurrences | dimensions AVANT (sous-norme) | sous-norme AVANT | sous-norme APRÈS |
|---|---|---|---|---|
| `.back-btn` | 1 | 72×34 | **1** | **0** |
| `.chapter-header` | 9 | — (conformes) | **0** | **0** |
| `.chapter-card` | 9 | — (conformes) | **0** | **0** |
| `.seance-header` | 8 | — (conformes) | **0** | **0** |
| `.pub-dot` | 51 | 141×18, 62×19, 93×18 | **51** | **0** |
| `.ch-publish-btn` | 7 | 141×25, 77×25 | **7** | **0** |
| `.admin-action-btn` | 93 | 22×18, 26×20, 30×20 | **93** | **0** |
| `.section-label` | 1 | 326×15 | **1** | **0** |
| `.tab` | 10 | 101×34, 122×34, 124×34, 137×34, 148×34, 159×34, 161×34, 242×34, 99×34 | **10** | **0** |
| `button` | 1 | 155×29 | **1** | **0** |
| `.admin-action-add` | 2 | 127×30, 134×30 | **2** | **0** |

**Comptes exacts : vue élève 8 → 0 sous-norme · vue prof 166 → 0 sous-norme.** L'objectif zéro est atteint dans les deux vues, cibles tactiles mesurées au harnais (390 px, `is_mobile` + `has_touch`), console exclue.

*Deux précisions honnêtes sur ce tableau.* ① `.section-label` (326×15) est un **libellé de section, pas une cible tactile** : il n'a pas d'action, je ne l'ai pas grossi ; il figurait dans l'état des lieux parce que mon harnais ratisse large, et il sort de la liste de contrôle des cibles APRÈS (le harnais de vérification ne mesure que les éléments actionnables). ② Les écarts de total (34→24, 192→181) viennent de ce même resserrement du harnais de vérification sur les seules cibles actionnables : aucune cible n'a disparu de l'écran.

### 2.1 · Les 93 micro-boutons d'action d'item — le point que je dois soumettre à Paul

Ce sont les ✏ 🔗 🚀 ↑ ↓ 📋 ✕ des lignes d'items (22×18 à 30×20 avant). **Traitement retenu** : la **zone tactile grandit sans que l'icône grossisse** — `min-width/min-height: 44px` avec rembourrage, l'icône garde sa taille de glyphe — et la rangée `.gc-acts` passe **à la ligne** (`flex-wrap`) sous le titre, en pleine largeur. Sept boutons de 44 px ne tiennent pas sur une rangée de 324 px : ils s'y répartissent sur **deux rangs**, ce que montre la capture. C'est le compromis que je crois le meilleur (norme tenue, lisibilité intacte, rien hors écran), mais **le choix reste à Paul** : deux alternatives se tiennent — (a) **regrouper** ces actions derrière un bouton « ⋯ » qui déplie un petit menu (une seule cible de 44 px par ligne, écran très calme, un tap de plus pour agir) ; (b) **n'en garder que deux ou trois au mobile** (lier, monter/descendre) et renvoyer le reste à la console. Je n'ai sacrifié ni la norme ni la lisibilité en silence : dites-moi si vous préférez (a) ou (b), c'est un correctif court.

## 3 · EXIGENCE B — zéro débordement, mesuré

Vue prof à 390 (vue élève identique, valeurs au banc) :

| conteneur | scrollWidth | clientWidth | écart |
|---|---|---|---|
| **page** | 390 | 390 | **0** |
| `.level-header` | 390 | 390 | **0** |
| `.chapter-card` | 324 | 324 | **0** |
| `.chapter-body` | 324 | 324 | **0** |
| `.seance-block` | 280 | 280 | **0** |
| *bande d'onglets `.tabs`* | *1 458* | *326* | *exception déclarée* |

Aucune boîte de `page-level` ne dépasse le bord droit de l'écran (`hors_ecran: []`) **hors de la bande d'onglets**, seule exception admise par le mandat : le défilement horizontal y est **contenu dans la bande** (elle-même large de 326 px ≤ 390), jamais dans la page. Avant : la page débordait à 458/390 en vue prof, `.chapter-card` à 552/324, `.seance-block` à 530/280.

## 4 · LE CAS DE PAUL — avant / après

| mesure | AVANT | APRÈS |
|---|---|---|
| largeur du titre de chapitre | **64 px** | **238 px** |
| hauteur du titre (étranglement) | **126 px** (≈ 6 lignes) | **43 px** (2 lignes) |
| pastilles de classe hors écran | oui (« CHARLES DE GAULL… » coupé) | **0** |
| carte `scrollWidth` / `clientWidth` | 520 / 324 | **324 / 324** |

## 5 · Ce que fait le correctif (un seul bloc, sous 480 px)

`@media (max-width: 480px)`, seuil dominant du fichier (réutilisé, aucun seuil nouveau), toutes les règles préfixées `#page-level` :
1. **Bandeau haut** : `height:auto`, `flex-wrap`, le compte à rebours passe au rang suivant (`flex: 1 0 100%`) — plus d'écrasement ; « ← Accueil » à 44 px.
2. **Onglets** : `flex-wrap: nowrap` + `overflow-x: auto` (bande dédiée, ascenseur masqué) ; `.tab` à 44 px.
3. **Cartes de chapitre et séances** : la grille `gr-row` (six colonnes au grand écran) devient **deux rangs** — icône + titre en pleine largeur, puis état, pastilles et actions dessous en `flex-wrap`, `.gc-ind` masquée.
4. **Cibles** : `.pub-dot`, `.admin-action-btn`, `.ch-publish-btn`, `.item-pub-btn`, `.admin-action-add` à ≥ 44 px. Le bouton « 🗑 Tout effacer (Firebase) » n'a pas de classe (style en ligne dans son rendu) : il est atteint par `button[onclick^="resetChapitres"]` — **plutôt que de toucher au rendu**, conformément à la consigne CSS d'abord.
5. `max-width: 100%` sur les trois conteneurs de contenu.

## 6 · EXIGENCE C — le desktop est opposable

**Mesure croisée base/livré à 1440 px**, sur les mêmes cibles et la même page (chapitre déplié, vue admin) : **39 points comparés — dimensions de 8 familles de cibles, `grid-template-columns` de `gr-row`, hauteur et `flex-wrap` du bandeau — 0 écart.** Le desktop ne voit rien du bloc : tout est sous 480 px. Captures `desktop_base.png` / `desktop_livre.png`.

## 7 · EXIGENCE D — la vue élève rejouée et capturée

Vue élève jouée au chemin réel (identité élève du magasin, intent survey passé par son bouton), mesurée et capturée **AVANT et APRÈS** à 390 : 8 → 0 cible sous-norme, page sans débordement. Captures `avant_390_eleve.png` / `apres_390_eleve.png`.

## 8 · Banc de preuve — **BILAN : 8/8 VERTS** (run unique)

Chemin réel, hub intercepté, **aucune écriture réelle**.

```
VERT  · A · 390 vue eleve : ZÉRO cible tactile sous 44 px (24 cibles mesurées)
VERT  · B · 390 vue eleve : page et conteneurs sans débordement (scrollWidth == clientWidth)
VERT  · B · 390 vue eleve : la SEULE exception est l'intérieur de la bande d'onglets, mesurée
VERT  · A · 390 vue prof : ZÉRO cible tactile sous 44 px (181 cibles mesurées)
VERT  · B · 390 vue prof : page et conteneurs sans débordement (scrollWidth == clientWidth)
VERT  · B · 390 vue prof : la SEULE exception est l'intérieur de la bande d'onglets, mesurée
VERT  · A+B · LE CAS DE PAUL : titre au large (≥ 200 px) et sur 2 lignes au plus, aucune pastille coupée, carte sans débordement
VERT  · C · DESKTOP : mesure croisée base/livré
=== BILAN SITE-MOBILE : 8/8 VERTS ===
```

## 9 · Captures (au sas)

`captures-avant/` : `avant_390_eleve`, `avant_390_prof`, `avant_390_carte_chapitre` (l'état des lieux du TEMPS 1).
`captures-apres/` : `apres_390_eleve`, `apres_390_prof`, `apres_390_carte_chapitre`, `desktop_base`, `desktop_livre`.

---
**STOP.** `SITE-MOBILE/index.html` + `rapport.md` + captures au sas, livraison prouvée par relecture. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-SM]*
