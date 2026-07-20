# M8-MOBILE — RAPPORT DE LIVRAISON (exécutant, 20/07/2026)
*Passe tactile de la console du site. Livré au sas EN UNE FOIS avec `index.staging.html`. Je ne promeus jamais.*

## 1. Empreintes
- **Base** : production `index.html`, 352 684 o, md5 `f939e60d0d23fbb4b291f460b3277709`, v8.1.0 — conforme au prompt.
- **Livré** : `index.staging.html`, **356 815 o, md5 `5b6eb7e1aee516da6e04aeb08745d19e`, `APP_VERSION="8.2.0"`, `APP_VERSION_DATE="2026-07-20"`** (pastille vérifiée par grep avec lignes `//` écartées d'abord — piège des 3 épisodes appliqué).
- **Double parseur** : `node --check` OK · acorn `ecmaVersion 2020` OK (l'unique bloc `<script>` non vide).

## 2. Le diff ne touche aucune logique — preuve exhaustive
`diff index.html index.staging.html` : **3 lignes retirées, 51 ajoutées, 5 hunks**, chacun nommé :

| Hunk | Contenu | Nature |
|---|---|---|
| `416a417,432` | section CSS `M8-MOBILE` (accordéon + media query 480) | CSS pur, additif |
| `921a938` | 1 ligne dans la table des matières commentée du bloc M8 | commentaire |
| `1122a1140,1165` | section JS `M8-MOBILE` : `M8_UI`, `m8ToggleBloc`, `_m8Accordeon` | présentation seule, additif |
| `1133c1176,1181` | le point d'assemblage de `renderConsoleM8` : les 5 blocs passent sous enveloppe | la SEULE ligne existante de JS modifiée |
| `1816,1817c1864,1865` | pastille 8.1.0→8.2.0, date | pastille |

**Les 3 lignes retirées, intégralement** : ① `el.innerHTML = _blocModeTest() + …` (remplacée par le même assemblage sous enveloppes) ② `var APP_VERSION="8.1.0";` ③ `var APP_VERSION_DATE="2026-07-19";`. **Aucune fonction existante modifiée** : les cinq `_bloc*` sont intactes octet pour octet et **toujours exécutées à chaque rendu, exactement comme avant** — l'enveloppe décide seulement de l'affichage (le `taxoRafraichir` déclenché par `_blocTaxonomie` bloc fermé est inoffensif : garde `if(!el || !TAXO_UI.ouvert) return;` L1621). Aucun chemin Firebase, aucun libellé existant, aucune garde `admin-mode`, aucun invariant taxonomie touché.

**Deux éléments d'affichage nouveaux, déclarés** : ① le badge « actif » et la bordure orange sur l'en-tête d'accordéon du bloc Mode test quand `m8TestOn()` — nécessaires pour que le **marqueur permanent du mode test** (exigence gravée à l'audit M8bis-Q1) reste visible bloc replié ; texte nouveau additif, écran prof. ② le titre interne `.m8-titre` du bloc ouvert est **masqué par CSS** (`.m8-acc-corps > .m8-bloc > .m8-titre { display:none }`) car son libellé exact vit déjà dans l'en-tête d'accordéon — les `.m8-titre` sont de pures étiquettes sans `onclick` (vérifié L1140/1149/1190/1206/1632), le masquage est de la mise en forme, réversible, le libellé reste dans le DOM.

## 3. Décision `<details name>` — écartée SUR PREUVE
Testé au harnais avant engagement, comme demandé : ① l'exclusivité native de `<details name>` **est** supportée par ce Chromium ; ② mais l'état `open` **ne survit pas** à un re-rendu `innerHTML` — or `renderConsoleM8` est rappelé depuis **8 points du code** (L935, 994, 1002, 1054, 1098, 1109, 1216, 1512 de la production : écriture d'annonce, dates brevet, bascule mode test, gestes taxonomie). Un état JS de restauration aurait donc été requis DE TOUTE FAÇON ; `<details>` n'économisait rien et ajoutait un risque de support sur le Chrome Android réel de Paul. **Retenu : enveloppe JS + état `M8_UI`** (motif `TAXO_UI` L1250, éprouvé par M8bis). Pas de mémorisation persistante (arbitrage Q2).

## 4. Les quatre critères, audités au harnais (mesure des rectangles, pas à l'œil)
Harnais : Chromium Playwright, 390×844, `isMobile`+`hasTouch` · fichiers LOCAUX `file://` · **réseau verrouillé** : GET du hub servis en stub, toute autre requête et TOUTE méthode d'écriture avortées (journal joint §7) · zéro clic à l'aveugle : fonctions appelées par leur nom exact vérifié, taps sur libellés exacts uniquement. **Stub identique avant/après** : 3 annonces représentatives fabriquées (le nœud réel `/site/annonces` est **null** au 20/07 ~12h45 — 4 o, vérifié par GET pur : les annonces mesurées par la conscience le 19/07 n'y sont plus), `dernierControleRegles` = valeur réelle du hub (1784496319219), taxonomie canonique réelle (72 279 o, 154 notions).

### AVANT (production, 390 px, 3 annonces, 1 domaine taxo déplié)
**Console : 2 467 px = 2,9 écrans · 32 cibles · 25 sous 44 px** — cohérent avec le relevé conscience (31/24/3 195 px sur les annonces réelles du 19/07). Détail des sous-normes : porte d'entrée 25 px · `m8-btn` 32 px · `m8-btn-min` 25 px (Modifier/Supprimer ×6, Revenir aux dates, Voir la marche, Simuler J+29) · `select` 33 px · `input` date 34 px · en-têtes de famille 28 px.

### APRÈS (staging, 390 px, même stub)
| État | Hauteur | Écrans | Cibles | Sous 44 px | Débord. horiz. |
|---|---|---|---|---|---|
| **Sommaire** (aucun bloc ouvert) | 288 px | 0,34 | 6 | **0** | 0 |
| Mode test ouvert seul | 391 px | 0,46 | 7 | **0** | 0 |
| Annonces ouvert seul (3 annonces) | 1 218 px | 1,44 | 15 | **0** | 0 |
| Brevet ouvert seul | 738 px | 0,87 | 11 | **0** | 0 |
| Règles ouvert seul | 435 px | 0,52 | 8 | **0** | 0 |
| Taxonomie ouvert seul, éditeur ouvert TOUT REPLIÉ | 969 px | 1,15 | — | **0** | 0 |
| Taxonomie + 1 domaine + 1 famille dépliés | 2 379 px | 2,82 | 29 | **0** | 0 |

- **① Cibles ≥ 44 px** : 0 cible sous-norme dans TOUS les états mesurés (avant : 25). La porte d'entrée « Ouvrir / fermer la console » passe de 159×25 à 292×44 (ciblée `#m8-console-wrap .ch-publish-btn` — les `.ch-publish-btn` du reste du site, L2825/L4370/L438, non touchés).
- **② ≤ 2 écrans sans repli** : accordéon EXCLUSIF vérifié (tap Annonces puis tap Brevet → 1 seul corps ouvert, `M8_UI.blocOuvert='brevet'`) ; persistance après re-rendu forcé vérifiée (le bloc reste ouvert). Tous les états ≤ 2 écrans **sauf** la taxonomie dépliée à 2,82 écrans — dépassement atteint uniquement par dépliage volontaire de sous-niveaux, chacun individuellement repliable (le repli interne domaines/familles EST le mécanisme exigé par le critère ; état par défaut : tout replié, 1,15 écran).
- **③ Pleine largeur sous 480 px** : boutons et champs à 290-292 px sur 390 (media query, `box-sizing` posé sur les champs).
- **④ Pas de défilement horizontal** : `scrollWidth − clientWidth = 0` dans tous les états mesurés.

### Marqueur permanent du mode test (exigence M8bis-Q1, préservée)
Mode test activé par sa fonction réelle au harnais (aucune écriture émise — journal §7, cohérent avec sa conception sessionStorage) : badge « actif » + bordure orange sur l'en-tête, **visibles bloc ouvert ET bloc replié au sommaire** (vérifié les deux).

### DESKTOP (staging, 1 280 px, souris, `isMobile:false`)
Sommaire 278 px, 6 cibles, 0 débordement ; accordéon fonctionne au clic ; bloc ouvert, le bouton « Passer en mode test » mesure **137×32 px — dimensions desktop INCHANGÉES** (la media query 480 ne s'applique pas) : l'usage souris n'est pas dégradé, l'accordéon exclusif s'applique aux deux tailles (arbitrage Q1), seules les dimensions divergent par media query.

## 5. Ce que je n'ai pas pu tester
- Le vrai doigt sur le vrai téléphone de Paul : harnais émulé (Chromium bureau en profil tactile), pas le Chrome Android réel. Le regard final reste à Paul, en aval de la promotion (circuit A0).
- Les annonces réelles : nœud null au moment des mesures — stub représentatif de 3 annonces à la place, jamais écrit au hub.
- Le comportement avec un TRÈS grand nombre d'annonces (le bloc Annonces croît linéairement ; à ~10 annonces il dépasserait 2 écrans — voir dette D-M8M-1).
- L'outil d'heure de la plateforme est resté muet toute la session ; heures données par l'horloge du conteneur en TZ Paris, déclaré.

## 6. Constat HORS PÉRIMÈTRE (arbitrage Q4 : dit en une ligne, non corrigé)
Sur `page-level` hors console, à 390 px : **10 cibles mesurées, 10 sous la norme** (ex. « ← Accueil » 90×17, onglets « Chapitres » 101×34, « Fiches transversales » 161×34, « Zone autonomie » 137×34) — dette à consigner pour un morceau ultérieur de passe mobile du site.

## 7. Écritures hub : ZÉRO
Le harnais avorte toute méthode non-GET par construction ; journal des requêtes de la session la plus gestuelle (bascule mode test comprise) : exclusivement des GET (`brevetDates`, `annonces`, `dernierControleRegles`, `taxonomie`, fonts avortées). Aucune requête d'écriture émise de toute la session, aucune donnée du hub modifiée.

## 8. Aveux d'écart
- Le badge « actif » est un TEXTE NOUVEAU (écran prof) non prévu au cadrage — ajouté pour ne pas dégrader le marqueur permanent du mode test quand le bloc est replié ; si la conscience le juge hors mandat, il se retire en une ligne.
- Le masquage CSS du `.m8-titre` interne des blocs ouverts est une intervention d'affichage sur un élément existant (jamais son libellé ni sa logique) — motivé par le doublon visuel titre d'accordéon / titre interne ; réversible en une ligne.
- Ma note de cadrage envisageait de ne pas appeler les `_bloc*` des blocs fermés ; j'ai finalement conservé leur exécution systématique (comportement d'exécution STRICTEMENT identique à la production) — écart de conception en faveur de la fidélité, déclaré.

## 9. Dettes / restes (spec vivante du morceau)
- **D-M8M-1** (nouvelle, constatée) : le bloc Annonces croît sans repli interne (~1,2 écran à 3 annonces, dépasserait 2 écrans vers ~10) — candidat : repli des annonces au-delà des N plus récentes, morceau ultérieur.
- **D-M8M-2** (nouvelle, constatée, HORS périmètre) : `page-level` hors console — 10/10 cibles sous-norme à 390 px (§6), pour la passe mobile du site.
- Rappel dette du site déjà ouverte, non touchée : `sessionStorage 'mjpc_m8_test'` écrit jamais relu (consignée à M8bis).
