# M-DOC-1b — RAPPORT : la preuve d'écran qui manquait à M-DOC-1
**01/08 · exécutant → conscience · ce rapport COMPLÈTE `M-DOC-1-rapport.md`, il ne le remplace pas**

## 1. Les fichiers éprouvés : ceux du sas, md5 vérifiés
Repris **au sas**, pas reconstruits :
| app | md5 au sas | = md5 du rapport M-DOC-1 |
|---|---|---|
| applause_meter | 665 724 o · `62cee16d74e95662e14354d6651199a6` | ✓ identique |
| analyse_logique | 581 601 o · `5e3663bf86625a581a7468fae31d6dd5` | ✓ identique |
| evaluation-qcm | 546 502 o · `06fd33ebcd23376dfb3e4fe1150a5ab5` | ✓ identique |

## 2. CE QUE LE BANC A TROUVÉ — et que le statique ne pouvait pas voir
**`evaluation-qcm` n'avait que SIX volets, pas sept.** Mon cadrage en annonçait 7 ; le volet **« Chronomètre et déroulé »** portait la mention *« à préciser au moment de la rédaction »* et **je ne l'ai jamais écrit**. Le rapport M-DOC-1 annonçait pourtant « 7 volets pour `evaluation-qcm` » : **c'était faux, et seul le comptage à l'écran l'a révélé.**
**Comblé, avec ses sources** : le volet **« Le déroulé d'une passation »** est écrit à partir des boutons mesurés dans le code — `🚀 Lancer Q1`, `✋ Autoriser la réponse`, `⏸️ Pause`, `Relancer le chrono`, `🛑 Clore`, `Question suivante →` — et de la phase de réflexion (`isReflex`). Son intention : *le professeur garde la main sur le rythme — le chronomètre cadence, il ne commande pas.* **Rien n'enchaîne tout seul** : c'est le fait mesuré qui compte pour Paul.
**`evaluation-qcm` livré : 547 444 o · `2588a35aa077f02796dab999cce55652` · 7 volets · parse VERT.** Les deux autres fichiers sont **inchangés à l'octet**.

## 3. LA PREUVE D'ÉCRAN — 21/21 verts
Pour **chacune des trois apps** :
· **la constante `DOC_PROF_HTML` vit dans la page** (type `string`) ;
· **les volets sont rendus en `<details>` natifs** — 8, 7 et 7, comptés dans le DOM ;
· **un clic sur un `<summary>` OUVRE le volet** : `open` passe de `false` à `true` et le contenu prend une hauteur mesurable — **l'interaction ne dépend d'aucun JavaScript** ;
· **l'intention est en tête**, en italique, commençant par « Intention : » ;
· **le lexique est le dernier volet** ;
· **390 px, TOUS volets ouverts : zéro débordement horizontal**, `scrollWidth` ≤ 392, et **toutes les cibles `<summary>` mesurent ≥ 44 px** de haut ;
· **à l'impression** (`emulateMediaType('print')`) : **tous les contenus sont visibles même si les volets sont fermés à l'écran** (`details > .db { display:block }`), **chaque volet est non coupé** (`break-inside: avoid` effectif sur les 8/7/7), **rien ne déborde de la page**.
**Captures** : `img-m01…m03` (section dépliée, desktop) · `img-m04…m06` (390 px, tous volets ouverts) · **`img-m07` (rendu d'impression)**.
Contrôle visuel fait : le gabarit rend bien l'intention en italique, les listes, les définitions encadrées, et la doc tient dans 390 px sans balayage.

## 4. Ce que ce banc ne prouve pas — déclaré
Le descriptif est rendu **dans la page réelle, avec le CSS de l'app**, mais **hors du chemin d'authentification prof** (le banc injecte `DOC_PROF_HTML` dans le corps plutôt que de simuler une session professeur complète). Ce qui est prouvé : **le gabarit, l'interaction, le mobile, l'impression**. Ce qui ne l'est pas : **que Paul, connecté, voie la section à sa place exacte en queue des réglages** — la pose est vérifiée statiquement (§5 du rapport M-DOC-1 : 1 fonction modifiée par app, l'écran des réglages) mais pas cliquée. **Restent non testés** : Chrome Windows, l'impression papier réelle (le rendu `print` est vérifié, pas le spouleur), et la recette de Paul.

## 5. Ce qui reste, inchangé
Les **intentions sont des propositions** : Paul les tranche volet par volet, et sa formulation fait autorité. **Aucune référence pédagogique n'a été écrite** ; les trois emplacements où elle aurait sa place sont nommés au rapport M-DOC-1.

## 6. Livraison
`m-doc-1/` : `evaluation-qcm.staging.html` **remplacé** (7 volets) · `banc-ecran.js` + `bancmdoc1b-verdicts.json` (21) · ce rapport · captures `img-m01…m07.png`. Les deux autres stagings restent ceux de M-DOC-1, à l'octet.
