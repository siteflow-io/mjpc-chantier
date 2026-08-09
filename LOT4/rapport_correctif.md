# CORRECTIF AU LOT ④ — ⑦ trajet panneau → zone · ⑧ synchronisation au retour au chapitre

**Base du correctif** : LOT ④ livré et audité (934 558 o, md5 `f0415ccc6ce3fe5d8a03980540ad40e5` — vérifié identique sas ↔ local avant toute édition).
**Livré** : `index.html` **937 765 o**, md5 `7d0960f0fd3f6f1314d69a416937d621`, pastille **8.44.1**.
**Diff global : 61 lignes touchées.** Dual parser : `new Function` OK + acorn ES2020 OK (script unique, 777 876 car). **0 fonction supprimée** (828 → 829, la neuve est `ed2ZoneDe`). `published` : jamais écrit `true` — prouvé au banc (l'item né du dépôt porte `published:false`).

---

## ⑦ Le trajet milieu → droite

**Mesures du mandat, confirmées une à une :**
- `ed2ClicChamp` → `ed2Selectionner(ED2.courant, champ, 'panneau')` → `ed2PapierVers(document.querySelector('.ed2-pdoc[data-item=…]'))` : **le document entier**, jamais la zone. Rien ne s'allumait dans le papier. ✓ (mesuré avant édition, l. 11540-11543 du LOT ④.)

**Mesure imprévue, faite au banc par le geste réel (t70c)** : le clic souris sur une ligne fine déclenchait `ed2ClicChamp('c-d1-definition-2')` **puis** `ed2ClicChamp('item-d1')` — les lignes fines vivent dans le bloc d'item qui porte son propre `onclick` (`item-<k>`), et la **propagation** écrasait aussitôt la clé fine par la clé d'item. Ce n'est pas un artefact de banc : dans l'appli, la sélection fine ne survivait à aucun clic souris (elle ne marchait qu'en appel direct). Réparé au même geste.

**Éditions (`[LOT4c-⑦]`) :**
1. **`ed2ZoneDe(item, champ)`** (neuve, 1 276 o, posée sous `ed2Cle`) — le sens inverse de la clé : depuis `c-<item>-<comp>-<rang>`, retrouve l'élément `[data-c]` **dans le bon document**, même règle de rang que `ed2ClicPapier` (blocs multiples : n-ième de `.f-contenu [data-c=…]` ; uniques : premier du document). Décomposition sûre : aucun id de composante ne contient de tiret (mesuré : tous en snake_case) — le dernier tiret sépare le rang. Clé étrangère au motif (`title`, `item-…`) → `null` : le document entier, comme avant.
2. **`ed2Selectionner`** (1 156 → 1 552 o) — branche `depuis==='panneau'` : la zone s'allume (`.ed2-zsel`) et `ed2PapierVers(zone‖document)`. Le nettoyage de tête retire `.ed2-sel` **et** `.ed2-zsel`.
3. **`ed2MajZone`** (404 → 598 o) — le re-rendu du cadre à la frappe effaçait la zone allumée : elle se repose depuis `ED2.caseSel` après le re-rendu.
4. **`ed2PanneauFeuille`** (2 740 → 2 836 o) — `event.stopPropagation()` sur les **4** générateurs de lignes fines (uniques hors contenu, blocs, sans-champ compris). La ligne d'item (`item-<k>`) est intacte.
5. **CSS** : `.ed2-zsel` (une ligne, à côté de `.ed2-sel` — même doré, liseré fin adapté au papier blanc).

**Preuves (banc réel, hub intercepté, 0 écriture réelle, 0 exception) :**
- **t70** — clic souris sur les lignes du panneau : **les quatre définitions de la fiche notion**, une à une → chacune vient à l'écran **au bon rang** (0, 1, 2, 3 — vérifié par identité d'élément dans `.f-contenu`), centrée, seule allumée. Champs uniques (`titre` de la 1re feuille, `objectif` d'une feuille du milieu) : zone exacte. Clé document (`item-a1`) : 0 zone allumée, document sélectionné — pas de régression. **Survie au re-rendu** : frappe (`ed2SetValeurFeuille` → `ed2MajZone`) → la zone reste allumée, texte à jour.
- **Capture `captures/cap_panneau_vers_zone.png`** (examinée) : ligne « Ajouter une définition (3) » dorée au panneau, zone « Allitération » seule allumée dans la feuille A4, à l'écran.
- **t61 rejoué** (sens papier → panneau) : identique au LOT ④ — le `stopPropagation` ne touche pas ce sens.

---

## ⑧ La synchronisation au retour au chapitre

**Mesuré, pas supposé — le chemin complet d'un geste fait depuis l'éditeur de feuille :**

| maillon | écrit au hub ? | met la mémoire à jour ? |
|---|---|---|
| `itemCreer` (le dépôt crée l'item) | ✓ PUT `/site/<lvl>/chapitres/<ch>/seances/<j>/items/<id>` | ✓ **`chapitresData`** (`sce.items[itemId]=newItem` — `sce` est l'objet mémoire) |
| `atEnregistrerMaintenant` (tout enregistrement de la feuille : contenu, **adresse**) | ✓ PUT `/site/atelier/documents/<id>` | `AT.liste` ✓ · **`LINK_ATELIER_DOCS` ✗ · `AT_DOCS` ✗** |
| `atDeposerFeuille` (envoi + item + statut) | ✓ PUT envoi + item + document | `AT.liste` ✓ · **`LINK_ATELIER_DOCS` ✗** |

Et **`atOuvrirDoc` fait une copie profonde** (`AT.doc=JSON.parse(JSON.stringify(base))`) : rien ne se propage par référence. Or le fil (`ed2Papier`) **dessine les feuilles depuis `LINK_ATELIER_DOCS[it.ref]`** (mesuré). Donc, réponse à la question de Paul : **oui, le chapitre se désynchronisait**, de deux façons :
- **⑧-a** feuille existante modifiée depuis l'éditeur de feuille → « ← Le chapitre » remontrait **l'ancien contenu** (le cache gardait la copie lue à l'entrée) ;
- **⑧-b** feuille **créée** puis liée/déposée depuis l'éditeur → l'item entrait bien dans le fil (`chapitresData` à jour par `itemCreer`) mais **sans son contenu** (cadre réduit au titre — `LINK_ATELIER_DOCS[ref]` absent).

**Réparation à l'ÉCRITURE** (le point le plus proche de la vérité — même famille que le `LINK_ATELIER_DOCS` servi au LOT ①), marques `[LOT4c-⑧]` :
- **`atEnregistrerMaintenant`** (1 797 → 2 476 o) : après `AT.liste[docId]`, pose `LINK_ATELIER_DOCS[docId]` et `AT_DOCS[docId]` avec **la même copie**. Cache jamais chargé (`null`) : rien à poser — l'entrée du chapitre le lira frais du hub, qui vient d'être écrit.
- **`atDeposerFeuille`** (2 254 → 2 756 o) : même pose après l'écriture du statut.
- `edRetourChapitre` **inchangé** : il rend depuis des caches désormais justes — pas de relecture réseau au retour.

**Preuves (t71 + t71b, gestes réels : `edEditerFeuille('1','a1')` depuis le fil) :**
- **⑧A** : objectif réécrit dans l'éditeur de feuille → `atEnregistrerMaintenant` → `LINK_ATELIER_DOCS` à jour → `edRetourChapitre()` → **le fil montre le nouveau texte, sans recharger la page**. Magasin : le hub porte le nouvel objectif.
- **⑧B (la preuve du mandat)** : feuille **créée** dans l'éditeur, **adressée à la séance 2**, **déposée** → l'item `feuille-nee-au-banc` est né dans `chapitresData` (ordre 5, uid posé, `published:false`), le hub porte l'envoi + l'item + le document avec `depot` → retour → **la feuille est à sa place dans le fil, cadre rendu avec son contenu**.
- **Contre-preuve sur la base** (LOT ④ sans correctif, même scénario) : `linkAJour:false`, `filMontreNeuf:false` — le trou existait bien, le correctif le ferme.
- **Capture `captures/cap_retour_sync.png`** (examinée) : au retour, « OBJECTIF RÉÉCRIT AU BANC » rendu dans la feuille d'ouverture du fil, « Feuille née au banc » sous « Lire un tableau » dans l'inventaire, compteur passé à « 12 documents sur 30 attendus ».

---

## Non-régression et vérités du chantier

- **t60** rejoué : fil mixte identique (aucun manque en tête, 18 trous à leur place, 11 docs, 5 pages, 51 lignes fines).
- **t61** rejoué : pointage papier → panneau identique (trois feuilles dont la dernière, les quatre définitions).
- **t64** rejoué : **vue élève publiée base ↔ correctif : 22 264 o identiques, 0 exception** (le correctif ne vit que dans l'éditeur : CSS `.ed2-zsel`, panneau prof, caches admin).
- Tailles : méthode « déclaration → déclaration » (les commentaires entre fonctions comptent dans la précédente) — d'où `ed2Cle` 621 → 565 o **à ligne de code strictement identique** (prouvé : 1 occurrence exacte de la ligne des deux côtés ; l'écart est le commentaire déplacé vers `ed2ZoneDe`).
- Caches en jeu, tous déclarés : `LINK_ATELIER_DOCS`, `AT_DOCS`, `AT.liste`, `chapitresData`, `ED2.caseSel` (existant, porte désormais la clé rejouée par `ed2MajZone`). Aucun cache nouveau.
- `renderChapitres` (appelé par `itemCreer` pendant que l'éditeur de feuille est à l'écran) : sort si `#chapters-dynamic` absent — mesuré inoffensif, inchangé.

## Dette observée en passant (préexistante, hors mandat, non traitée)
Dans le panneau, cliquer le bloc d'un item **non courant** (`item-<k>`) sélectionne la ligne `item-<k>` mais le halo du papier suit `ED2.courant` (car `ed2ClicChamp` passe `ED2.courant`, pas l'item de la clé). Effet cosmétique (halo), comportement d'avant le correctif — consigné à la spec.
