# SITE-COURS-3a-COMPLÉMENT-2 — RAPPORT-CORRECTIF (avant promotion)
**Cinq volets : retrait de « Changer l'image », surfaces qui effacent leurs entrées, pastilles mobiles, bascule de vue 👁, neutralité de la vue élève.**
Exécutant [C5-3ac2b], sous conscience n°5 · 05-06/08/2026. Le livré du sas est CORRIGÉ et REMPLACÉ ; pastille inchangée **8.33.0**.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (= le livré du sas, re-téléchargé et vérifié) | 812 700 o | `438c279647a249614c503e7b78fa6989` |
| LIVRÉ CORRIGÉ, 5 volets (étape 1) | 814 870 o | `a3b46b0c67643c01e16e6ddc60484b49` |
| **LIVRÉ FINAL, volet ⑥ compris (8.33.0)** | **815 207 o** | **`deef60b9099c1de4e131226c8c089b6c`** |

Double parseur : **VERT**. 10 éditions (`editer2.py`), chaîne reproductible.

## 2 · ⑴ Retrait total de « Changer l'image » (décision de Paul)

Le bouton disparaît du rendu (les deux modes), la classe `dp-fig-prof` avec lui, et ses **4 règles CSS** (`.dp-fig-prof`, `.dp-fig-change`, la règle de survol, le `@media (hover:none)`). Le **dépôt initial est intact** : emplacement « À déposer » cliquable, modale, écriture fine — prouvés au clic. Une image posée est une **figure nue** (aucun bouton, survol compris). Assumé : une image ne se change plus par l'écran.

## 3 · ⑵ Une surface ouverte efface ses boutons d'entrée

Mesure : le panneau prof pose l'état existant **`#tprof-overlay.visible`** → CSS pur, même patron que la modale LIER du complément 1 : `body:has(#tprof-overlay.visible)` masque `#tprof-btn`, `#admin-tools-btn`, `#admin-tools-menu` et `#vue-btn`. Le ✕ Fermer respire ; les flottants **reviennent d'eux-mêmes** à la fermeture (prouvé au display calculé, capture). **Mesure dite au rapport** : `toggleAdminTools` n'ouvre pas une surface couvrante mais un **menu déroulant** (`#admin-tools-menu`, `min-width:220px`, ancré sous son bouton) — aucun masquage nécessaire pour lui. Amusant et probant : la règle neuve a piégé le banc lui-même (l'atelier fermé retombe sur le panneau ouvert → flottants légitimement absents).

## 4 · ⑶ Pastilles compactes au mobile

Seuil réutilisé : **480 px**, le breakpoint dominant du fichier (5 blocs `@media (max-width:480px)` en usage). Sous ce seuil, les deux flottants deviennent des **pastilles rondes 44×44** icône-seule (🛠, 📚), empilées en haut à droite (36/88), libellés portés par `<span class="btn-lib">` masqué au mobile, **`aria-label` complets** (« Panneau prof », « Mes applications »). Desktop : strictement inchangé (libellés complets, `display:block` d'origine).

## 5 · ⑷ La pastille de bascule de vue 👁

Troisième pastille (**mobile uniquement** ; desktop : rien de nouveau, Ctrl+Espace existe), visible si **l'IDENTITÉ est prof** (`TRACK.eleve.is_prof` — pas `ADMIN_MODE` : elle reste là en vue élève pour le retour ; un élève véritable ne la voit jamais, prouvé). Un tap → **`basculerVue()` réutilisée telle quelle** (l'onclick l'appelle directement — rien d'inventé). `majPastilleVue()` (nouvelle, 399 o) tient la pastille : pose `body.est-prof`, icône et libellés selon la vue — **👁 « Voir comme un élève »** en vue prof, **🛠 « Revenir à la vue professeur »** en vue élève (aria+title, soumis à Paul) — appelée par les **trois poseurs de vue** (loginAsProf, restoreSession, basculerVue), si bien que Ctrl+Espace et les 5 tapes la tiennent à jour aussi. **Le secours des 5 tapes reste vivant** (prouvé : bascule + pastille qui suit). Bascule prouvée **dans les deux sens** au tap réel.

## 6 · ⑸ « Non lié » et pulse réservés à la vue prof

Dans `renderItem` : **côté admin, rien ne change** (« ⚠ Non lié » + `at-lier-pulse` du bouton LIER, prouvés intacts). **Côté non-admin**, un item publié sans ref est **NEUTRE** : titre et sous-titre, aucune mention, aucun ⚠, aucune classe de pulse, aucun onclick (choix de Paul : rien du tout). Même neutralité pour la galerie vide (l'analogue exact, déclaré). Un item lié garde son « → Ouvrir ». **Vérification demandée sur le 🔒** : côté non-admin les items non visibles sont filtrés **en amont** (l. 3324 `if(!isAdmin && !_visiblePourSession(it,level))return;`) et côté admin `pubV` vaut toujours `true` — le 🔒 était donc un chemin **inatteignable** ; l'expression le conserve à l'identique côté admin, comme demandé.

## 7 · Fonctions — inventaire complet (0 supprimée)

**1 ajoutée** : `majPastilleVue` 399 o. **5 modifiées** (relues entières) :

| fonction | avant | après | objet |
|---|---|---|---|
| diapoRendreBloc | 2 925 | 2 918 | ⑴ retrait du bouton et de `dp-fig-prof` (décroissance mandatée) |
| renderItem | 5 031 | 5 224 | ⑸ neutralité non-admin (item + galerie) |
| basculerVue | 337 | 444 | ⑷ appel `majPastilleVue` |
| loginAsProf | 1 452 | 1 495 | ⑷ idem |
| restoreSession | 599 | 616 | ⑷ idem |

HTML : libellés en `span.btn-lib` + `aria-label` + la pastille `#vue-btn`. CSS : règle `:has(#tprof-overlay.visible)` (⑵), bloc pastilles ≤480 + `.vue-btn` (⑶⑷), retrait des 4 règles de ⑴. Pastille **8.33.0 inchangée**.

## 8 · Écarts et observations (déclarés)

1. Le curseur des lignes non cliquables : `renderItem` pose un **second attribut `style`** (le premier porte `--indent`) que le navigateur ignore — le `cursor:default` inline n'a jamais pris, sur toutes les lignes non cliquables, **défaut cosmétique préexistant** (l'absence d'onclick, elle, est réelle et prouvée). Hors périmètre, non corrigé, consigné.
2. Télémétries préexistantes au journal du banc : `/presence/` (heartbeat), le manifeste Apps Script, `/intent/` (l'intent survey élève, déclenché par le « passer » du parcours). **Aucune n'appartient au correctif** (écran seul) ; le verdict P7 les exclut en le disant.
3. Amenées de banc : `SECU.valide` (M-SÉCU hors objet) · l'image « posée » de P1 rendue en mémoire (l'écriture du dépôt a son banc au complément-2) · vue admin posée après stabilisation (P6) · l'intent survey passé par son bouton réel.
4. La capture 390 de la vue élève montre « → Ouvrir » légèrement serré sur sa ligne : layout préexistant des cartes séances à 390, hors périmètre.

## 9 · Banc de preuve — **BILAN : 15/15 VERTS** (run unique) — la RÈGLE NOUVELLE appliquée

**La vue élève est rejouée au banc et capturée** (390 ET desktop), identité élève réelle du magasin, intent survey compris. Hub intercepté, **aucune écriture réelle**.

```
VERT  · P1 · ⑴ l'emplacement « À déposer » reste un bouton ; « Changer l'image » a disparu (DOM et classe)
VERT  · P1 · ⑴ la modale de dépôt initial s'ouvre toujours
VERT  · P1 · ⑴ une image posée : figure nue (aucun bouton de changement, survol compris)
VERT  · P2 · ⑵ panneau ouvert : les deux flottants s'effacent (le ✕ Fermer respire)
VERT  · P2 · ⑵ fermeture : les flottants reviennent d'eux-mêmes
VERT  · P3 · ⑶ mobile prof : trois pastilles rondes 44×44 icône-seule (libellés cachés), aria complets
VERT  · P3 · ⑷ tap 👁 → vue élève : les entrées prof s'effacent, la pastille reste (🛠, « Revenir à la vue professeur »)
VERT  · P3 · ⑷ re-tap → vue prof revenue (👁)
VERT  · P3 · ⑷ le secours des 5 tapes reste vivant (bascule aussi, la pastille suit)
VERT  · P4 · ⑷ identité élève : AUCUNE pastille (ni 👁 ni outils prof)
VERT  · P5 · ⑸ vue élève 390 : l'item publié sans ref est NEUTRE
VERT  · P5 · ⑸ vue élève : un item lié garde son « → Ouvrir » normal
VERT  · P5 · ⑸ vue élève desktop : même neutralité
VERT  · P6 · ⑸ vue prof : « ⚠ Non lié » et le pulse du LIER intacts
VERT  · P7 · écran seul : AUCUNE écriture réseau du correctif (seule la télémétrie de présence préexistante circule), `published` jamais
=== BILAN 3ac2b : 15/15 VERTS ===
```

## 10 · Captures (au sas, `captures-correctif/`)

`p2_panneau_sans_flottants` · `p3_trois_pastilles` (**les 3 pastilles**, vue prof 👁) · `p3_vue_eleve_pastille_retour` (**la bascule, sens retour** : 🛠) · `p5_vue_eleve_item_neutre_390` / `p5_vue_eleve_item_neutre_desktop` (**la vue élève de l'item non lié, OBLIGATOIRES**) · `p6_vue_prof_non_lie_intact`.


## 11 · VOLET ⑥ — les survols ne mangent plus les taps

**Le bug, en une phrase** : au tactile, le premier tap déclenche `:hover` ; huit règles de survol **déplacent ou redimensionnent la cible**, qui s'échappe donc sous le doigt — d'où « je dois appuyer plusieurs fois sur Ouvrir » et « pour Publier je clique plus haut dans le vide ». Aucune garde tactile n'existait (0 `@media (hover:hover)`, 0 `touch-action`).

### 11.1 · Inventaire EXHAUSTIF des règles `:hover` (56 règles, 56 occurrences — le compte du fichier)

**GÉOMÉTRIQUES — 8, toutes déplacées sous le média :**

- `.val-btn:hover` — transform: translateY(-1px)
- `.level-card:hover .accent-bar` — top: 5% ; bottom: 5% ; width: 4px
- `.level-card:hover` — transform: translateY(-12px) scale(1.03) rotate(-0.5deg)
- `.level-card:hover .level-arrow` — transform: rotate(45deg)
- `.chapter-card:hover` — transform: translateX(4px)
- `.doc-item:hover` — transform: translateX(3px)
- `.fiche-card:hover` — transform: translateY(-3px)
- `.pub-dot.clk:hover` — transform:translateY(-1px)

**PURES — 48, laissées telles quelles :**

`.level-card:hover::before`, `.level-card:hover::after`, `.back-btn:hover`, `.chapter-card:hover .chapter-num`, `.admin-mode .doc-item:not([style*="opacity"]):hover`, `.val-code-toggle:hover`, `.admin-tools-btn:hover`, `.admin-tools-menu a:hover`, `.tprof-btn:hover`, `.tprof-close:hover`, `.tprof-section-btn:hover`, `.tprof-class-row .tcr-actions button:hover`, `.tprof-class-row .tcr-actions button.danger:hover`, `.tprof-add-btn:hover`, `.class-modal-actions button.primary:hover`, `.class-modal-actions button.cancel:hover`, `.admin-delete:hover`, `.doc-viewer-close:hover`, `.link-modal-btn:hover`, `.link-modal-btn.danger:hover`, `.link-modal-btn.cancel:hover`, `.intent-btn:hover`, `.intent-skip:hover`, `.bigfile-btn-main:hover`, `.bigfile-btn-cancel:hover`, `.bigfile-dismiss:hover`, `.ch-publish-btn:hover`, `.m8-btn:hover`, `.m8tx-dom-titre:hover`, `.m8tx-fam-titre:hover`, `.tprof-testpill:hover`, `.ch-publish-btn.published:hover`, `.item-pub-btn:hover`, `.item-pub-btn.published:hover`, `.gallery-viewer-close:hover`, `.admin-action-btn:hover`, `.admin-action-btn.danger:hover`, `.admin-action-add:hover`, `.mjpc-act:hover`, `.uni-i:hover`, `button.dp-img-btn:hover,button.dp-img-btn:focus-visible`, `.at-btn:hover`, `.at-btn-prim:hover`, `.at-ifo:hover`, `.mjpc-bd-btn:hover`, `.at-porte:hover`, `.at-porte-ch:hover`, `+'[data-c]:hover`

Note : la dernière « pure » de la liste (`[data-c]:hover`) vit dans une **chaîne JS** (le style de l'aperçu srcdoc de l'atelier), pas dans la feuille de la page — intouchée à ce titre aussi.

### 11.2 · Le geste

Les **8 géométriques** sont déplacées **telles quelles** (copie exacte, aucune réécriture) dans **UN bloc unique** `@media (hover: hover) and (pointer: fine)`, commenté « ⑥ effets de survol géométriques — souris seulement : au tactile, le premier tap déclenchait :hover et déplaçait la cible sous le doigt (bug du 05/08) ». Les **48 pures** restent où elles sont (un changement de couleur au premier tap est inoffensif, et donne même un retour utile). **Aucune règle supprimée** : le diff CSS ne montre que déplacement + enveloppe. Aucun `touch-action` ajouté ; `:active` et `:focus` intacts. Le moteur confirme la lecture : une règle `@media` avec **8 règles filles**.

### 11.3 · Preuves (banc ⑥ : 8/8)

- **Mobile** (`is_mobile` + `has_touch`, `hover:hover` faux) : la carte de niveau **ne bouge plus** au doigt (transform sans effet, `offsetTop`/`offsetHeight` inchangés au dixième de pixel), **le premier tap atteint sa cible** (`clickedLevel` armé au tap 1) et le second ouvre le niveau ; le **bouton Publier reste où il s'affiche** (plus de `translateY(-1px)` tactile). Captures 390.
- **Desktop** : mesure **croisée base/livré** — le survol de la carte donne des styles calculés **rigoureusement identiques** (`transform`, `background`, `animationName`) ; un `:hover` pur (couleur du bouton prof) joue toujours. Capture desktop.
- **Les 15 verdicts des volets ⑴–⑸ ont été REJOUÉS sur le livré ⑥ : 15/15**, vue élève comprise (règle du dispositif).

### 11.4 · Observation (déclarée)

Sur ces cartes, `transform` calculé au survol vaut la **matrice identité** et non la translation attendue : l'animation d'entrée `card-enter` (préexistante, `fill` actif) écrase le `transform` du `:hover`. Le bond visuel des cartes est donc, en l'état, largement neutralisé **avant comme après** mon volet — ce que la mesure croisée base/livré établit. Le volet ⑥ garde tout son sens pour les sept autres règles (dont `.pub-dot.clk` et `.doc-item`, les deux cibles du vécu de Paul) et met le fichier à l'abri si l'animation change. Signalé sans le corriger : hors périmètre.

## 12 · Banc complet — **volets ⑴–⑸ : 15/15 · volet ⑥ : 8/8**

```
VERT  · P1 · ⑴ l'emplacement « À déposer » reste un bouton ; « Changer l'image » a disparu (DOM et classe)
VERT  · P1 · ⑴ la modale de dépôt initial s'ouvre toujours
VERT  · P1 · ⑴ une image posée : figure nue (aucun bouton de changement, survol compris)
VERT  · P2 · ⑵ panneau ouvert : les deux flottants s'effacent (le ✕ Fermer respire)
VERT  · P2 · ⑵ fermeture : les flottants reviennent d'eux-mêmes
VERT  · P3 · ⑶ mobile prof : trois pastilles rondes 44×44 icône-seule (libellés cachés), aria complets
VERT  · P3 · ⑷ tap 👁 → vue élève : les entrées prof s'effacent, la pastille reste (🛠, « Revenir à la vue professeur »)
VERT  · P3 · ⑷ re-tap → vue prof revenue (👁)
VERT  · P3 · ⑷ le secours des 5 tapes reste vivant (bascule aussi, la pastille suit)
VERT  · P4 · ⑷ identité élève : AUCUNE pastille (ni 👁 ni outils prof)
VERT  · P5 · ⑸ vue élève 390 : l'item publié sans ref est NEUTRE
VERT  · P5 · ⑸ vue élève : un item lié garde son « → Ouvrir » normal
VERT  · P5 · ⑸ vue élève desktop : même neutralité
VERT  · P6 · ⑸ vue prof : « ⚠ Non lié » et le pulse du LIER intacts
VERT  · P7 · écran seul : AUCUNE écriture réseau du correctif (seule la télémétrie de présence préexistante circule), `published` jamais
=== volets 1-5 : 15/15 VERTS ===

VERT  · ⑥ · mobile : le média (hover:hover)+(pointer:fine) ne s'applique pas
VERT  · ⑥ · mobile : la carte de niveau NE bouge PAS sous le doigt (transform sans effet, géométrie stable)
VERT  · ⑥ · mobile : le premier tap atteint sa cible (openLevel armé au tap 1)
VERT  · ⑥ · mobile : le second tap ouvre le niveau (le geste entier au tactile)
VERT  · ⑥ · mobile : le bouton Publier reste où il s'affiche (aucun translateY tactile)
VERT  · ⑥ · desktop : le média s'applique
VERT  · ⑥ · desktop : le survol d'une carte est RIGOUREUSEMENT identique à la base (mesure croisée base/livré)
VERT  · ⑥ · desktop : un :hover PUR (couleur du bouton prof) joue toujours
```

---
**STOP (final).** `SITE-COURS-3a-complement2/index.html` **REMPLACÉ** au sas : **815 207 o, md5 `deef60b9099c1de4e131226c8c089b6c`**, pastille 8.33.0 inchangée + `rapport-correctif.md` complété + 9 captures (6 des volets ⑴–⑸ dans `captures-correctif/`, 3 du volet ⑥). J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-3a-c2 ⑥]*
