# M8-MOBILE — NOTE DE CADRAGE (exécutant, conversation neuve — 20/07/2026)
*Passe tactile de la console du site (`index.html`). Rien n'est codé : cette note attend l'audit de la conscience n°2 avant toute ligne.*

## 0. Changement de conscience — pris en compte
La conscience n°1 a été close le 19/07 ; la conscience n°2 audite. Je connais le droit-devoir de contestation sourcée (lignes, md5, horodatages) : un fait sourcé suspend son avis.

## 1. Lecture ① — la conversation de l'exécutant M8bis
**Ce que j'ai pu lire** (outil de recherche de conversations passées, conversation « exécutant m8 », plusieurs sondages croisés + résumé long) :
- Le déroulé en deux phases : cadrage poussé au sas AVANT code (M8bis-cadrage.md, 11 657 o, md5 vérifié bit à bit) → audit de la conscience → code → banc 41/41 extrait du fichier livré → diff exhaustif (6 hunks = 6 changements déclarés) → livraison EN UNE FOIS (staging + rapport, md5 local↔sas).
- Le ton de l'audit : chaque affirmation revérifiée dans le code par la conscience (« toutes exactes ») ; les arbitrages Q1-Q4 rendus avec leurs raisons ; Q2 tranché SUR PREUVE (lecture du hub) contre la proposition de l'exécutant ; Q3 ÉLARGI contre le prompt initial (un éditeur qui écrit un champ sans pouvoir le corriger rend toute coquille définitive).
- Les pièges hérités : l'exemple commenté du socle (3 épisodes — regex qui lit `// var MJPC_MANIFESTE` au lieu de la déclaration réelle) ; l'API GitHub non authentifiée qui renvoie un JSON ~279 o déguisé en fichier ; le banc sans `'use strict'` pour partager la portée de l'eval ; `meta` en UN PUT ; la structure JSON lue et jamais devinée (trous d'ids 009/033, `domaines` = tableau).
- La manière de travailler de Paul : le fichier fait foi, jamais le bilan ; preuves chiffrées à chaque ligne ; zéro écriture hub en développement ; l'exécutant ne promeut jamais.
**Ce que je n'ai PAS trouvé** : le fil chronologique continu tour par tour (l'outil restitue des extraits et un résumé, pas la conversation intégrale) ; les éventuels petits allers-retours entre le feu vert et la livraison ; le détail des échanges après la livraison (audit final de la conscience, promotion). Je déclare ce trou plutôt que de simuler la continuité.

## 2. Lecture ② — le plan de travail, INTÉGRAL
`docs/MJPC6-plan-de-travail.md` lu en entier, en lecture AUTHENTIFIÉE et vérifiée : **276 626 o, 1158 lignes, md5 `0c033ca525de5af14409c10c07ceb8ee`**.
**ÉCART À DÉCLARER** : le prompt annonce ~1190 lignes ; le fichier en ligne en a 1158. Taille cohérente avec un plan v50 vivant — je le signale sans en tirer de conclusion.
Points intégrés qui gouvernent ce morceau : la règle « LE MOBILE EST UN USAGE DE PLEIN DROIT, CÔTÉ PROF AUSSI » et ses 4 critères opposables (L19) · le constat mesuré de la conscience (L21) · l'ordonnancement « passe mobile AVANT M8ter » (L31) · point 17 responsive · point 19 aucun piège assumé · point 20 (déplacer, pas réécrire ; sections nommées) · règle de la pastille (toute promotion incrémente APP_VERSION, point bloquant) · harnais en lecture seule stricte (L182) · piège de l'exemple commenté (L184) · amnésie (L150-160) · le rapport = checklist à preuves (L172) · déclaration de couverture (L176).

## 3. La production, vérifiée sur pièces
- `index.html` téléchargé authentifié : **352 684 o, md5 `f939e60d0d23fbb4b291f460b3277709`, `APP_VERSION="8.1.0"` (L1816)** — conforme au prompt, octet pour octet.
- Structure de la console confirmée dans le code : `renderConsoleM8` (L1128) concatène les 5 blocs (L1133) ; CSS m8 aux L342-381, m8tx aux L382-416 ; media queries existantes vérifiées : `@media (max-width:700px)` L92, `@media (max-width: 480px)` L376 et L412 — la structure d'accroche existe, comme annoncé.
- Contrôle d'amnésie fait : `ls -lat` du conteneur — rien que mes fichiers de ce jour, aucun code inconnu (conversation neuve).

## 4. Les chiffres de départ — VÉRIFIÉS AU HARNAIS, avec un écart instruit
Harnais monté dans mon conteneur : Playwright + Chromium, profil iPhone 12, **390 px, `isMobile:true`, `hasTouch:true`**, page servie en local, **lecture seule stricte** (aucun clic sur bouton : fonctions appelées par leur nom exact vérifié dans le code ; `activateAdmin()` JAMAIS appelée car elle publie un manifeste — `admin-mode` posé en DOM pur ; dialogues journalisés et refusés par défaut ; surveillance réseau : **ZÉRO écriture Firebase émise**, GET seuls).

**Mes mesures (reproductibles)** :
| Fenêtre | Cibles | Sous 44 px | Hauteur console |
|---|---|---|---|
| 1 domaine taxo déplié, 0 famille | 25 | 18 | 2 024 px = 2,4 écrans |
| 1 domaine + 1 famille dépliés | 34 | 27 | 2 844 px = 3,4 écrans |

Valeurs unitaires confirmées : `.m8-btn` → **32 px** de haut · `.m8-btn-min` (« Revenir aux dates par défaut », « ⚡ Simuler J+29 », « Voir la marche à suivre », « ✏️ Modifier », « Désactiver » des notions) → **25 px** · en-têtes de famille `.m8tx-fam-titre` → **28 px** · select/dates → 33-34 px · bouton « Ouvrir / fermer la console » (`.ch-publish-btn` du wrap) → **25 px**.
**ÉCART avec les chiffres de la conscience (31 / 24 / 3 195)** — instruit, pas écarté : ① le nœud `/site/annonces` est **VIDE aujourd'hui (null)** — lors de sa mesure, la liste d'annonces rendait ses boutons « Modifier »/« Supprimer » (25 px chacun) ; ② sa fenêtre de dépliage n'est pas connue exactement (domaine seul ou + famille). Mon couple de mesures ENCADRE ses chiffres ; les valeurs unitaires (25/28/32/34) sont identiques aux siennes. Le tableau avant/après du rapport sera fait sur MA fenêtre de référence, redonnée à l'identique après passe.

## 5. Découpage proposé
**Contrainte cardinale intégrée : AUCUNE FONCTION NE CHANGE** — ni logique, ni chemins Firebase, ni libellés, ni gardes `admin-mode`, ni mode test, ni invariants taxo. Je déplace et je mets en forme. La SEULE addition de JS est le mécanisme d'accordéon exigé par le critère ② (un état d'interface + un enrobage de rendu), déclarée comme telle.

### A. Accordéon exclusif (critère ②) — dans `renderConsoleM8`, les 5 `_blocX` INTACTS
- Un état `M8_UI_BLOC` (quel bloc est ouvert : un seul ou aucun).
- `renderConsoleM8` rend, pour chacun des 5 blocs : s'il est l'ouvert → la fonction `_blocX()` existante, appelée telle quelle ; sinon → un EN-TÊTE RÉDUIT cliquable (titre existant du bloc + flèche), qui ouvre ce bloc et replie l'autre.
- **Les 5 fonctions `_blocModeTest/_blocAnnonces/_blocBrevet/_blocRegles/_blocTaxonomie` ne sont pas modifiées d'un octet** — c'est l'enrobage qui change. Section dédiée nommée (point 20), table des matières mise à jour.
- Effet de bord vérifié dans le code : le `setTimeout(taxoRafraichir)` vit DANS `_blocTaxonomie` (L1631) — bloc replié = fonction non appelée = aucun rafraîchissement fantôme. `TAXO_UI.ouvert` conservé tel quel : rouvrir le bloc taxo retrouve l'éditeur dans son état (souplesse : reprendre où on s'est arrêté).
- **Marqueur mode test conservé même replié** (exigence M8bis : le prof doit voir EN PERMANENCE qu'il édite une copie) : l'en-tête réduit du bloc Mode test porte l'état (« ACTIF », style orange `m8-bloc-test`) quand `m8TestOn()`.

### B. Cibles ≥ 44 px (critère ①) — CSS, sous `@media (max-width: 480px)`
`min-height: 44px` (+ padding recalculé) sur : `.m8-btn`, `.m8-btn-min`, `.m8-input`, `.m8-select`, `.m8-date-in`, `.m8tx-dom-titre`, `.m8tx-fam-titre`, `#m8-console-wrap .ch-publish-btn`, les nouveaux en-têtes d'accordéon, `.m8-overlay-btn` (déjà ~48 px, vérifié). Le desktop garde ses tailles actuelles (aucune dégradation souris).

### C. Pleine largeur sous 480 px (critère ③) — compléter l'existant
La media query L376 fait déjà `.m8-ligne` en colonne et `.m8-select` 100 % ; j'y ajoute les boutons en pleine largeur (`width:100%`) et les champs restants. Jamais de colonnes sous 480 px.

### D. Zéro défilement horizontal (critère ④) — prouvé par mesure
Après passe : `scrollWidth === clientWidth` mesuré sur `#m8-console` et sur chaque bloc ouvert, à 390 px.

### E. Pastille
`APP_VERSION` → **"8.2.0"**, `APP_VERSION_DATE` → "2026-07-20".

## 6. Preuves annoncées au rapport (checklist à preuves)
① md5 + taille du staging · ② double parseur (`node --check` + acorn ecmaVersion 2020) · ③ tableau AVANT/APRÈS des cibles mesurées au harnais tactile (390 px, mêmes fenêtres de dépliage, rectangles chiffrés) · ④ hauteur de console avant/après (tous blocs repliés + chaque bloc ouvert un à un) · ⑤ critère ④ : scrollWidth mesuré · ⑥ **diff complet hunks par hunks, chacun rattaché à A/B/C/E — preuve qu'aucune logique, aucun chemin Firebase, aucun libellé métier, aucune garde n'est touché** (les regex de contrôle écartent d'abord les lignes `//`, piège du socle) · ⑦ desktop vérifié à 1280 px (accordéon fonctionnel, tailles de boutons inchangées, capture) · ⑧ surveillance réseau : zéro écriture hub · ⑨ ce que je n'ai pas pu tester : vrai Chrome Android, clavier mobile réel, pinch-zoom, vraies Google Fonts (bloquées par mon proxy — police de repli, limite structurelle déjà documentée au plan L176).
Pas d'annonce élève : livrable purement professeur.

## 7. Questions à l'audit (réponses courtes suffisent)
**Q1 — L'accordéon vaut-il PARTOUT (desktop compris) ou mobile seul ?** Ma recommandation : PARTOUT. Raisons : un seul comportement (moins de risque qu'un rendu bifurqué par matchMedia) ; la console desktop dépasse elle aussi 3 écrans (le mal n'est pas mobile-spécifique) ; à la souris, un accordéon ne coûte qu'un clic et TAXO_UI garde l'état. Les TAILLES restent différenciées par media query (44 px seulement ≤480 px).
**Q2 — État d'ouverture par défaut : AUCUN bloc ouvert** (console = 5 en-têtes, ~courte, le prof choisit) — avec le marqueur test permanent décrit en A. Alternative : premier bloc ouvert. Je recommande « aucun ».
**Q3 — Périmètre des 44 px : la console M8 seule** (`#m8-console-wrap`, blocs `m8-*`/`m8tx-*`, overlay règles) — les modales de la console d'administration historique (`_showConsoleModal` : purge, corbeille, orphelins) et les boutons de publication des chapitres/séances restent HORS morceau (la mesure de la conscience portait sur la console M8 ; élargir gonflerait le diff et le risque). Confirmes-tu ?
**Q4 — L'enrobage en `renderConsoleM8`** (5 `_blocX` inchangés octet pour octet, appelés seulement si ouverts) est-il la bonne lecture de « tu déplaces et tu mets en forme » — l'état d'accordéon étant la seule addition JS, strictement d'interface ?

**Écritures hub à ce stade : ZÉRO.** Seules lectures GET effectuées : `/site/annonces` (constat nœud vide), `/site/config/dernierControleRegles` et `/taxonomie` (chargées par la page elle-même au rendu de la console, lecture seule).

J'attends l'audit de la conscience avant de coder.
