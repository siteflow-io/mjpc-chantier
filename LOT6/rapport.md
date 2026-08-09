# LOT ⑥ — le clic droit du sommaire, le trajet complété, le dépôt dans la modale Lier

**Base vérifiée** : production 941 574 o, md5 `35e0c5b4894dfc0aeb8ce9f8cc7bbe44`.
**Livré** : `index.html` **954 985 o**, md5 `042ebfa1416b25d1936f25ab7f115810`, pastille **8.46.0**. Dual parser vert. **830 → 837 fonctions (0 supprimée ; 7 neuves : le moteur `ctxOuvrir`/`ctxFermer`, la table `ctxEntreesItem`/`ctxEntreesSeance`, le branchement `ctxSommaireCible`/`ctxSommaireOuvrir`, et `sceDupliquer`).** Vue élève publiée base ↔ lot : **22 264 o identiques, 0 exception** — rien ne change pour les élèves (pas d'annonce, livraison outillage professeur).

---

## ① Le troisième trajet complété (sommaire → milieu + droite)

Mesuré au mandat : `ed2Aller` posait le halo et défilait le papier, **aucune sélection**. Réparé par le même chemin que les deux autres trajets : `ed2Selectionner(item, 'item-<k>', 'sommaire')` — **la clé du bloc d'item**, choisie parce qu'elle existe pour TOUT objet du sommaire (feuille, document, diaporama, app) et que son premier champ est le TITRE ; le sens `'sommaire'` défile le panneau et focalise, comme venir du papier. Preuve (t90, clics réels, trois feuilles éloignées — tête, milieu, queue) : courant posé, papier positionné, pdoc halo+sélection, **ligne du panneau sélectionnée, visible, focus dedans** — les trois fois. Capture `captures/cap_sommaire_sync.png`.

## ② Le menu contextuel — le premier du site

**Trois étages séparés** (réutilisables tels quels par un futur écran) : le MOTEUR (`ctxOuvrir`/`ctxFermer` — position clampée à la fenêtre, fermeture par Échap, clic ailleurs, défilement ; garde de 350 ms pour que le clic d'ouverture tactile ne referme pas), la TABLE (`ctxEntreesItem`/`ctxEntreesSeance` — chaque entrée porte `dispo()`), le BRANCHEMENT (délégation `contextmenu` + **appui long tactile** 550 ms/8 px sur le sommaire de l'éditeur). CSS `.ctx-menu` z-index 8000 (au-dessus de l'atelier 7000 et de Lier 7500).

**La règle du miroir, tenue — le tableau des gestes et de leurs écrans d'origine :**

| geste | objet | fonction d'origine appelée (miroir) |
|---|---|---|
| Ouvrir / Modifier | feuille · diaporama · autre | `edEditerFeuille(j,k)` · `openDiaporamaById(ref)` · `ed2Aller(k)` (sa ligne d'édition, sélection ① incluse) ; séance : `ed2Aller` du 1ᵉʳ item, ou `ed2PanVers` de sa section (ancre `data-sce`, posée ce lot) |
| Renommer… | item · séance | **`editTitle` — il existait** (le ✏ de l'arborescence, trois étages, `_modalePrompt` + `/title.json`) ; complété d'une ligne : `if(AT.edChap)atEditerChapitreRendre()` pour que l'éditeur suive |
| Dupliquer | item | `edDupliquerVers(j,k)` (LOT ⑤, patron ED_SEL) — `dispo : it.ref` |
| Dupliquer | séance | **`sceDupliquer` — CRÉÉ** (le fondamental généralisé, voir ci-dessous) |
| Où est-ce ? | item | `edFeuilleDepots(level, ref)` (LOT ②, générique par ref) mis en phrase — `dispo : it.ref` ; séance : son contenu listé depuis `chapitresData` (aucune écriture) |
| Supprimer… | item · séance | `edSupprimerItem`/`edSupprimerSeance` → `deleteItem`/`deleteSeance` — **mêmes confirmations nommées**, désormais corbeille d'abord (ci-dessous) |

**La limite tenue** : la table ne connaît que les objets de composition ; le branchement ne vit qu'au sommaire de l'éditeur (écran professeur) ; **les attendus (trous) ne portent aucun objet → aucun menu** (prouvé). Mesure d'éligibilité qui simplifie la table : `ed2Documents` classe `attendu:!it.ref` — **un item sans ref n'est jamais une ligne cliquable du sommaire** ; les `dispo()` restent des ceintures pour les futurs branchements.

**`sceDupliquer` (créé, au patron)** : séance neuve au patron d'`edInsererSeanceAvant` (clé=max+1, **uid neuf**, `published:true` comme toute séance née d'`addSeance` — héritage documenté LOT ②), chaque item recréé par `itemCreer` l'écrivain unique (**uids neufs, `published:false` — rien ne change côté élève**, refs conservées : la copie d'item pointe la même ressource, même conception qu'`edDupliquerVers`), copie en fin de chapitre, écran qui dit. Prouvé : « Notions du chapitre (copie) », ordre 9, 3/3 items, uids tous neufs et non publiés, 4 écritures journalisées. Capture `captures/cap_seance_dupliquee.png`.

**Le fondamental « Supprimer : corbeille d'abord » — mesure et mise au patron** : le commentaire d'`edSupprimerSeance` promettait « corbeille du site », **le corps de `deleteSeance` ne la faisait pas** (ni `deleteItem`) — DELETE direct après confirmation. Mis au patron d'`atSupprimerChapitre` : archive `{_meta:{motif,chemin,app,ts},data}` vers `atCorbeilleCle`, **échec = abandon nommé, rien n'est supprimé** ; confirmations et resserrement `[C5-ORD]` inchangés. Le menu ET les × des écrans d'origine en héritent ensemble (même fonction).

**Preuves t91 (clic droit réel)** : menu feuille (5 gestes, capture `captures/cap_menu_item.png` examinée) ; Ouvrir → l'éditeur de feuille s'ouvre sur `feuille_1` ; Renommer → `_modalePrompt`, mémoire + PUT `/title`, éditeur re-rendu ; Où est-ce ? → « « Grille de critères » se trouve : Ch. 1 · S. 7 » ; fermetures Échap/clic ailleurs ✓ ; attendu sans menu ✓ ; 0 exception. **Note de mesure (comportement existant, pas un défaut du lot)** : au sommaire, la ligne d'une feuille liée porte le titre **de la feuille** (`titre:(d&&d.titre)||it.title`, mesuré) — renommer l'ITEM ne la change donc pas ; le titre de la feuille s'édite dans le panneau. Le miroir renomme l'item, comme le ✏ d'origine.

## ③ Glisser un fichier dans la modale Lier

**Un branchement, pas une invention** : la row du champ « Fichier Drive » (`#link-modal-droprow`, id posé sur l'élément statique) reçoit `dragover/drop` (écouteurs posés une fois) → le fichier part par **`uploadFileForChapterItem(file, …LINK_MODAL_CONTEXT)`** — le trajet même de l'arborescence, avec le contexte que la modale porte déjà. Le champ garde son usage (coller un lien ; placeholder complété). Deux compléments AU TRAJET (partagés avec l'arborescence, déclarés) : le toast final est **nommé** (« ✅ Document lié : <nom> » au lieu de « Fichier lié à l'item ») et l'éditeur suit (`if(AT.edChap)atEditerChapitreRendre()`).

**Déclaration importante** : le trajet existant écrit **`published:true`** sur l'item lié (PUT `/published` + `_markPub(item,'*',true)`) — comportement conservé à l'identique ; le code porte déjà « l'opportunité de ce défaut reste à arbitrer par Paul » (M8-IDENTITÉ).

**Preuves t92** (drop d'un `File` réel dans un `DataTransfer`, transport Drive en stub — le mur réseau du banc aborte tout, **0 écriture réelle par construction** ; canal `mjpcFetchOk` doublé d'un filet de banc journalisé) : survol signalé puis éteint ✓ (capture `captures/cap_drop_survol.png`) ; « ⏳ Upload en cours… » pendant l'envoi, modale fermée ✓ ; le stub reçoit `(seance2-support.pdf, 4e, 1, 2)` ✓ ; **3 PUT exacts** `/source` `/ref` `/published` ✓ ; item lié (`ref=DRV_BANC_001`) ✓ ; **« ✅ Document lié : seance2-support.pdf »** ✓ ; **le fil montre le document sans rechargement** ✓ (capture `captures/cap_drop_apres.png`).

## Tailles (méthode déclaration→déclaration ; les blocs non-fonction comptent dans le segment précédent)
`ed2Aller` 1 716→2 475 · `ed2Sommaire` 1 190→1 224 (data-seance) · `atEditerChapitreRendre` 10 517→10 541 (data-sce) · `deleteSeance` 817→1 561 · `deleteItem` 1 872→2 387 · `editTitle` 919→1 030 · `uploadFileForChapterItem` 2 007→2 186 · `closeLinkModal` 124→1 658 (l'IIFE des écouteurs vit dans son segment) · neuves : `ctxOuvrir` 1 146, `ctxFermer` 101, `ctxEntreesItem` 1 056, `ctxEntreesSeance` 1 575, `ctxSommaireCible` 389, `ctxSommaireOuvrir` 2 751 (les listeners document vivent dans son segment), `sceDupliquer` 1 457 · `mjpcEcrireRest` : segment listé « modifié » par la constante `APP_VERSION` qui y vit — **fonction intacte** (5 776 = 5 776).

## Caches et écritures déclarés
`CTX` / `CTX_LONG` (neufs, état d'interface du menu, jamais persistés) · `ED2.caseSel` (① : ed2Aller pose la sélection via l'existant) · `chapitresData` (sceDupliquer par itemCreer ; editTitle mémoire) · `LINK_ATELIER_DOCS` (lu par ed2Documents/edFeuilleDepots) · corbeille : `atCorbeilleCle('site-seance'/'site-item')`, motifs neufs au patron des existants · `published` : jamais écrit `true` par le lot lui-même — `sceDupliquer` pose `true` sur la séance copie (patron addSeance, héritage documenté) et `false` sur tous ses items ; le trajet upload conserve son `published:true` historique (déclaré ci-dessus).

## Textes français soumis à Paul
Libellés du menu : « Ouvrir / Modifier » · « Renommer… » · « Dupliquer vers… » · « Dupliquer la séance » · « Où est-ce ? » / « Où est-ce ? (contenu) » · « Supprimer… ». Messages : « « X » se trouve : Ch. 1 · S. 7 » / « nulle part — aucune séance ne porte cette référence. » · « « X » contient N éléments : … » · « Séance « X » dupliquée en fin de chapitre — ses éléments n'y sont pas publiés. » · « Supprimer … ? Elle partira / Il partira d'abord à la corbeille. » · « ⚠ L'archivage en corbeille a ÉCHOUÉ — rien n'a été supprimé, la séance est intacte / l'item est intact. » · « ✅ Document lié : <nom> » · placeholder « … — ou glisse un fichier ici » · « Aucun fichier reçu — glisse un fichier depuis ton dossier Windows. »

## Dettes
Aucune dette nouvelle. Observations consignées sans dette : le titre du sommaire d'une feuille liée est celui de la feuille (existant, cohérent — le sommaire montre ce que l'élève lira) ; un item sans ref est un « attendu » du fil (existant), donc jamais de menu — les `dispo()` de la table couvrent les futurs branchements.
