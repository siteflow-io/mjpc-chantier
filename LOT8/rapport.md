# LOT ⑧a — LA FIABILITÉ DE CE QUI EXISTE : l'abyme réparée, les rayons parlent, les échecs nomment, la matrice jouée

**DÉCOUPAGE ANNONCÉ (règle du mandat)** : **⑧a = points ①②③④⑤⑥** (ce rapport) ; **⑧b = points ⑦⑧⑨⑩** s'empile par-dessus (⑨ attend l'arbitrage d'architecture demandé à la conscience — proposé en conversation : option A, champ `produit` sur l'item ; option B, entrée légère au nœud atelier ; recommandation A). La promotion emportera ⑧a + ⑧b ensemble.

**Base vérifiée** : production 961 711 o, md5 `8c84942a43bd6fb6f8f95f16ea2e8317` (8.48.0), re-téléchargée immédiatement avant édition.
**Livré** : `LOT8/index.html` **968 155 o**, md5 `481f1482fd13bd7a89ffed374beb63bd`, pastille **8.49.0**. Dual parser vert (node --check + acorn ES2020). **0 fonction retirée, 0 fonction neuve** — 8 fonctions modifiées, toutes déclarées ci-dessous. Banc : hub intercepté depuis un snapshot lecture-seule du hub réel (mur réseau : tout non-file:// vers un domaine non prévu ABORTÉ ; seul abort constaté : Google Fonts), **0 écriture réelle**, **0 appel réel au script Drive** (stub à la forme exacte `{status,id,nom,ext,url,affichage,dossier,dossier_url}`), **0 exception JS sur tous les parcours joués**.

⚠ **CE LOT CHANGE LA VUE ÉLÈVE** — les trois changements, déclarés un par un et capturés :
1. **Clic sur une fiche d'un onglet transversal** : avant, le site entier se rechargeait dans la modale (cap-04) ; après, la version envoyée s'ouvre en srcdoc (cap-16, vue élève réelle).
2. **Onglet Zone autonomie** : la carte figée « Aller plus loin / Zone autonomie » est retirée (cap-18 avant / cap-17 après) — voir ③.
3. **Garde d'iframe** : une URL invalide afficherait « Ce document n'est pas disponible pour l'instant. » au lieu de recharger le site — aucun chemin sain ne l'atteint (inventaire ci-dessous).
Hors ces zones, la vue élève est inchangée : mêmes rayons (comptes identiques base↔lot au balayage ④), bloc des ignorées structurellement vide côté élève (rendu conditionné à `admin-mode`, prouvé au banc : innerHTML vide en session élève).

---

## ① L'iframe jamais en abyme

**Mesure de la conscience revérifiée, exacte** : `atOuvrirFeuilleEleve` n'existe nulle part (0 déclaration, grep) ; le repli `openViewer('Feuille','?feuille='+ref)` posait l'URL RELATIVE dans l'iframe → rechargement d'index.html dans le cadre. **Reproduit au banc sur la base** : capture `cap-04-abyme-avant.png` (l'accueil du site entier dans la modale « Feuille »).

**Réparé** : `_openAtelierFromList` appelle **`openAtelierItem(ref, titre)`** — le viewer sain : il lit `/site/atelier/envois/<ref>`, distingue message prof (bandeau « Jamais envoyée aux élèves » + [Envoyer maintenant], cap-06) et message élève (« Ce document n'est pas encore distribué. »), et pose TOUJOURS un srcdoc. Prouvé au banc : cap-05 (prof, la fiche versification rendue), cap-16 (élève réel, srcdoc posé, bandeau prof ABSENT).

**Inventaire de TOUS les points où une iframe du site reçoit une source** (grep exhaustif `.src=` / `srcdoc` / `<iframe`) :
| iframe | poseurs | garantie |
|---|---|---|
| `doc-viewer-frame` (modale openViewer) | `openViewer` (unique poseur de `.src`) ; `closeViewer` (`about:blank`) | **garde neuve** : URL vide, `?…`, `#…` ou `index.html` → srcdoc de message, jamais le site ; `removeAttribute('srcdoc')` avant tout `.src` (un srcdoc résiduel PRIME sur src) ; `closeViewer` retire aussi le srcdoc |
| `atdoc-viewer-frame` (openAtelierItem) | `openAtelierItem` seul | srcdoc posé sur TOUS les chemins (feuille / message prof / message élève / catch « Affichage impossible ») — mesuré, inchangé |
| `at-apercu` (aperçu de feuille) | l'aperçu de l'atelier | srcdoc avec try/catch sur toutes les branches (l.13178-13195) — mesuré, inchangé |

Les 20+ appelants d'`openViewer` relus un par un : tous posent soit une app du site (`*.html?…` — une AUTRE page, jamais index.html), soit une URL https (Drive preview, external, data-embed). Le seul chemin fautif était `_openAtelierFromList`. `openItem` `src==='external'` avec **ref vide** aurait posé une URL vide (rechargement) : la garde le couvre désormais.

## ② Les rayons disent l'ignoré — côté prof seulement

**Mesure revérifiée** : `collectRayons` comptait `sansProduit`/`ancres`, `renderRayons` ne les affichait jamais. **ET MA MESURE AJOUTE UNE 4e CAUSE, qui est celle du rayon Prépa brevet vide de Paul** (sa mesure fait foi, à entériner par la conscience) : la feuille `prepa_brevet` (feuille_1786257555731) est liée en **ch10 « Poésie et peinture » / S7 « Tâche finale »** dont `published` est VIDE (séance ET items) — le filtre `_visiblePourSession` à trois étages l'écarte AVANT la collecte, **y compris côté prof** (lentille « all » : `_isPubAny` = false). Elle n'atteignait jamais `collectRayons` : aucune des trois causes du mandat ne pouvait la dire.

**Livré** :
- `collectChapterItems` reçoit un **3e argument de diagnostic `avecInvisibles`** (posé par `collectRayons` côté prof seulement) : les items du kind demandé écartés par la publication sont rendus AUSSI, marqués `invisible:'chapitre'|'seance'|'ligne'`. **Sans ce 3e argument, comportement STRICTEMENT identique** — la publication reste la seule vérité élève ; aucun des appelants existants ne le passe (mesuré). UN seul moteur, pas de collecte parallèle.
- `collectRayons` garde le DÉTAIL (`ignores:[{cause,ref,titre,produit,etage}]`) : quatre causes — `nonPubliee` (l'étage est nommé), `pasCache` (feuille inconnue de LINK_ATELIER_DOCS), `sansProduit` (feuille au cache sans produit déclaré), `ancre` (produit sans rayon).
- `renderRayons` rend, **si et seulement si `admin-mode`**, le bloc « **⚠ Non rangées dans les onglets — visible par toi seul** » : titre de la feuille, cause en clair, bouton **Ouvrir** (openAtelierItem) et le **menu de requalification existant** (`atProduitMenu`). Après requalification, `atFeuilleProduitPoser` re-rend les rayons **sans rechargement** (si l'onglet fiches est affiché).
- Côté élève : le conteneur `#rayons-ignores` reste VIDE (prouvé au banc, session élève réelle : innerHTML='', cap-15).

**Prouvé au banc sur les données réelles** : 3 feuilles écartées par la publication, nommées avec gestes (capture `cap-03-ignores.png`) ; rayon Prépa brevet « 0 fiche » MAIS le bloc dit pourquoi. `published` n'est JAMAIS écrit par ce lot.

## ③ L'écart « Aller plus loin » — mesure divergente déclarée, corrigé au fond

**MA MESURE DIVERGE du registre** (déclarée en conversation, à trancher par la conscience) : dans la 8.48.0 **et déjà dans la 8.35.0** (vérifié au blob du commit `1371239e8cdb`), `zone('analyse-logique', r.loin)` alimente l'onglet **Analyse logique**, pas la Zone autonomie. L'écart RÉEL est un double vestige : ⓐ le rayon s'appelle `'loin'` (« Aller plus loin » — le vocabulaire de la Zone autonomie) ; ⓑ le tab-autonomie porte une carte HTML FIGÉE « Aller plus loin / Zone autonomie » avec une drop-zone `data-section="autonomie"` et un compteur `count-autonomie` que RIEN n'alimente ni ne lit (grep exhaustif : 0 code).

**Corrigé** : le rayon `'loin'` devient **`'analyse'`** (ATELIER_PRODUITS.fiche_analyse_logique, collectRayons, renderRayons, commentaire d'en-tête) ; la carte figée est **retirée** du tab-autonomie (commentaire de retrait posé, preuve d'inatteignabilité au rapport : aucun sélecteur, aucun getElementById). La Zone autonomie ne montre plus que `autonomie-dyn` (renderZoneAutonomie — les items marqués, comportement intact). Changement élève capturé : cap-18 (avant) / cap-17 (après).

## ④ Le balayage des onglets, au banc, sur le chapitre réel de Paul

Snapshot lecture-seule du hub réel (site.json 150 570 o, classes, codes — **ces données ne sont PAS poussées au sas**). Session prof réelle, 3e. Deux états joués :
- **État réel de production** : Grammaire 0 · Fiches notions 4 (versification, lecture à voix haute, registres exclu, révision interro, méthode paragraphe) · Prépa brevet 0 · Analyse logique 0 — ET le bloc prof dit les 3 écartées par la publication (registres [ligne], tâche finale ×2 [séance]). Captures `cap-02`, `cap-03`.
- **État S7 publiée** (mutation du snapshot local, aucune écriture réelle) : **la feuille prepa_brevet PARAÎT au rayon Prépa brevet — « 1 fiche »** (capture `cap-07-brevet-publiee.png`) ; comptes du balayage base↔lot IDENTIQUES (grammaire 0 / notions 4 / brevet 1 / analyse 0) : aucune régression de rangement. Captures avant/après de chaque onglet : `cap-08-avant-*` / `cap-09-apres-*` (fiches-langue, fiches-brevet, analyse).

Nota mandat : le mandat situait la prepa_brevet « dans la tâche finale (séance 8) » du chapitre satire ; la mesure au hub la situe en ch10/S7 « Tâche finale » (ordre 8). La satire (ch3) porte en S8 l'item `swift-2027` (kind `tache`, ref = la fiche MÉTHODE) — c'est le théâtre de l'écrasement du point ⑦, instruit en ⑧b.

## ⑤ Les échecs du dépôt nomment — cause ET geste

`_uploadBlobToDrive` (le SEUL point d'entrée, LOT7-①) enrichi ; les 5 appelants (`uploadFileForChapterItem`, `addImageToGallery`, `convertItemToGalleryAndAdd`, `uploadFileForNewItem`/`_createGalleryItemWithFirstImage`, le drop d'image du diaporama) partagent le même `catch(err){…err.message…}` (mesuré) : chacun hérite des messages. **Les quatre familles jouées au banc sur l'appelant principal, toasts capturés** :
| famille | toast affiché | capture |
|---|---|---|
| script muet (`status:'erreur'`) | « ⚠ le script de dépôt a répondu sans détail — réessaie ; si ça persiste, dépose le fichier à la main sur Drive puis colle son lien (bouton Lier). » | cap-11 |
| réponse sans id | « ⚠ Le dépôt n'a pas rendu d'identifiant — rien n'est lié. Réessaie ; si ça persiste, dépose le fichier à la main sur Drive puis colle son lien (bouton Lier). » | cap-12 |
| réseau coupé | « ⚠ pas de liaison — rien n'est parti. Vérifie la connexion, puis reglisse le fichier. » | cap-13 |
| fichier > 30 Mo | « ⚠ Fichier > 30 Mo — dépose-le à la main sur Drive puis colle son lien (bouton Lier). » | cap-14 |
Ajoutés aussi : refus HTTP du script (« le script de dépôt a refusé (HTTP N) — … ») et lecture de fichier impossible (« … reprends-le depuis ton ordinateur et reglisse-le. »). **Le chemin nominal prouvé intact** : stub ok → « ✅ Document lié : fichier-test.pdf », item lié `DRV_TEST_1`, écritures capturées `source`/`ref`/`published` — le `published:true` du trajet upload est le comportement HISTORIQUE conservé (arbitrage M8-IDENTITÉ toujours ouvert, désormais visible grâce aux états ⑦b — rien de touché ici).

## ⑥ Le banc des gestes d'écriture — la matrice, capteur branché

Instrument construit (`banc.py` + `matrice6.py`, rejouables) : chaque écriture interceptée journalise **chemin, méthode, charge utile** ; case rouge si exception à un moment quelconque du geste, même après l'écriture ; « l'écran reflète le résultat sans rechargement » vérifié sur le DOM après chaque geste. **Résultat : 0 case rouge de code.** Les cases jouées (chemins d'écriture cités — la règle) :

| objet · geste | chemin d'écriture capté | écran sans rechargement |
|---|---|---|
| séance · créer (`edInsererSeanceAvant`) | PUT `/site/3e/chapitres/10/seances/8` + PUT `…/7/ordre` + `…/8/ordre` (la neuve prend sa place, les ordres resserrés) | ✔ sommaire montre « Séance de banc » |
| séance · ordonner (`edDeplacerSeance`) | PUT `…/seances/1/ordre` + `…/seances/2/ordre` (échange) | ✔ |
| séance · supprimer (`edSupprimerSeance`→`deleteSeance`) | PUT `/corbeille/2026-08-11/site-seance_…` PUIS DELETE `…/seances/4` + resserrement | ✔ (corbeille d'abord) |
| item · créer (`edAjouterItem`→`itemCreer`) | PUT `…/seances/1/items/item-de-banc` | ✔ sommaire montre « Item de banc » |
| item · ordonner (`edDeplacerItem`) | PUT `…/items/<a>/ordre` + `…/items/<b>/ordre` | ✔ |
| item · lier (`edLierConfirme`) | PUT `…/items/fiche-registres/ref` + `/source` + `/kind` | ✔ cache + fil |
| item · publier (`edPublierItem`) | **AUCUNE écriture sans le choix explicite** — la modale des classes s'ouvre ; `published` jamais écrit par le geste seul | ✔ |
| item · supprimer (`edSupprimerItem`→`deleteItem`) | PUT `/corbeille/…/site-item_…` PUIS DELETE `…/items/fiche-versification` | ✔ |
| feuille · créer (`edCreerFeuilleIci`) | PUT `/site/atelier/documents/feuille_<ts>` + PUT `…/items/feuille-de-banc` (l'item lié) | ✔ sommaire ET papier (cadre `ed2-fcadre` rendu) |
| feuille · envoyer (`atEnvoyerVersion`) | PUT `/site/atelier/envois/<id>` + PUT `/site/atelier/documents/<id>` (la feuille vivante note son envoi) | ✔ (cb ok) |

**N/A justifiés** (le banc prouve l'existant, il n'invente pas) : chapitre·créer/supprimer (écran Chapitres de l'atelier, joués à la passe ORDRE 8.37.0) · chapitre·ordonner (aucun geste dans l'éditeur — l'ordre vient du socle ORDRE) · chapitre/séance/item·envoyer (seule une feuille s'envoie, doctrine publié≠envoyé) · chapitre/séance·lier (n'existe pas) · chapitre/séance·publier (pastilles de l'arborescence page-level, hors éditeur) · feuille·supprimer (écran Feuilles ; l'éditeur retire l'ITEM, jamais la feuille) · feuille·ordonner/lier/publier (= les cases item correspondantes) · diaporama·créer/supprimer (écran Diaporamas) · diaporama·ordonner/lier/publier (= cases item) · diaporama·envoyer (un diaporama se publie, ne s'envoie pas — pas de version figée).

**Deux faux rouges du banc instruits avant verdict** (règle : vérifier le parcours avant d'annoncer un défaut) : les gestes à `_modalePrompt` exigent la saisie du titre — rejoués avec saisie, VERTS. Le troisième (feuille·créer) : mon critère cherchait le titre dans le CORPS du papier — or le cadre est bien rendu ; le corps d'une feuille neuve affiche « Sans titre » car le titre saisi va sur `doc.titre` (métadonnée) et non sur la composante titre du corps : **comportement de la BASE, observation consignée, hors périmètre des gestes d'écriture**.

## Tailles (déclaration→déclaration ; artefacts de frontière expliqués)
`_openAtelierFromList` 173→561 · `openViewer` 308→1041 · `closeViewer` 1371→1471 (le segment porte le commentaire ajouté ; corps +1 instruction) · `collectChapterItems` 1751→2530 · `collectRayons` 751→1750 · `renderRayons` 906→2501 (mesure au segment réel : la fonction interne `zone()` coupe le comptage naïf à 470/473) · `atFeuilleProduitPoser` 1043→1318 · `_uploadBlobToDrive` 1777→2733 · `atProduitRayon` 1167→1167 (identique — son segment inclut les commentaires voisins, corps intact). HTML : +conteneur `#rayons-ignores` (tab-fiches), −carte figée (tab-autonomie), +6 règles CSS `.rayons-ignores-bloc/.ri-*`.

## Écritures et caches déclarés
**Aucune écriture nouvelle vers le hub** hors gestes de Paul existants ; `published` JAMAIS écrit par ce lot ; les seules écritures ajoutées au code sont des rendus d'écran. Caches lus : `LINK_ATELIER_DOCS` (rayons, titres du viewer), `chapitresData` (collecte). Le banc n'écrit rien au hub réel (mur prouvé : 0 abort imprévu hors Google Fonts).

## Textes français soumis à Paul
« ⚠ Non rangées dans les onglets — visible par toi seul » · les 4 causes : « écartée par la publication (chapitre, séance ou ligne non publiés) — publie-la depuis le chapitre » / « la feuille n'a pas pu être lue dans l'atelier — recharge la page, ou vérifie qu'elle existe encore » / « aucun type de feuille déclaré — choisis-le ici pour la ranger » / « son type vit dans sa séance, pas dans un onglet — change-le si elle doit paraître ici » · « Ouvrir » · (garde iframe) « Ce document n'est pas disponible pour l'instant. » · (dépôt) « le script de dépôt a répondu sans détail — réessaie ; si ça persiste, dépose le fichier à la main sur Drive puis colle son lien (bouton Lier). » · « Le dépôt n'a pas rendu d'identifiant — rien n'est lié. Réessaie ; si ça persiste, … » · « pas de liaison — rien n'est parti. Vérifie la connexion, puis reglisse le fichier. » · « le script de dépôt a refusé (HTTP N) — réessaie ; si ça persiste, … » · « Lecture du fichier impossible — reprends-le depuis ton ordinateur et reglisse-le. »

## Captures jointes (captures/, examinées une par une)
cap-01 chapitres · cap-02 fiches (prof) · cap-03 bloc des ignorées · cap-04 ABYME AVANT (base) · cap-05 viewer APRÈS (prof) · cap-06 bandeau jamais envoyée · cap-07 prepa_brevet au rayon (S7 publiée) · cap-08/09 balayage avant/après (×3 onglets chacun) · cap-10 éditeur · cap-11→14 les 4 toasts d'échec du dépôt · cap-15 fiches (élève, bloc vide) · cap-16 viewer élève srcdoc · cap-17/18 Zone autonomie après/avant (élève).

## Dettes, limites, arbitrages
**Aucune dette nouvelle.** Arbitrages demandés à la conscience : ⓐ **⑨ (⑧b)** — option A (produit sur l'item) vs B (entrée au nœud atelier), recommandation A ; ⓑ entériner la **4e cause** du point ② (nonPubliee, ma mesure) et la **divergence de mesure** du point ③ (le rayon n'a jamais alimenté la Zone autonomie — l'écart réel était le nom 'loin' + la carte figée). Observations consignées sans correction : le corps d'une feuille neuve affiche « Sans titre » (doc.titre ≠ composante titre — base) · `zone()` écrase la fiche Drive statique « Analyse logique 3e » de la drop-zone analyse-logique à chaque rendu des rayons (défaut de la BASE, la fiche statique reste visible tant que les rayons ne sont pas rendus ; ⑨ la rangera proprement) · registre du 06/08 non repris au mandat (rubriques par domaines de la taxonomie + onglet Méthode) — signalé, non codé sans mandat. Suite : ⑧b (⑦⑧⑩ francs ; ⑨ sur feu vert).

---

# LOT ⑧b — LES RESSOURCES EXTERNES : le remplacement averti et tracé, le cadre dans le fil, le dépôt écrit au lien

**Empilé sur ⑧a** (base = le sas `481f1482…`). **Livré** : `LOT8/index.html` **977 482 o**, md5 `9395cf93040c1df282bd8eb5e123c47b`, pastille **8.50.0**. Dual parser vert. **⑨ N'EST PAS DANS CETTE LIVRAISON** — il attend l'arbitrage d'architecture de la conscience (option A recommandée) ; il s'empilera par-dessus.

**Vue élève : AUCUN changement** — les trois points sont des écrans prof (panneau de l'éditeur, modale Lier, papier de l'éditeur) et des champs de données neutres (`remplace` sur l'item, `depot`/`rattachement` sur la feuille — aucun rendu élève ne les lit, mesuré). Banc élève 8.50 : rayons identiques, bloc des ignorées vide, 0 exception.

## ⑦ Un item ne porte qu'une ressource, et il le dit

**Le vécu réparé à la source** : le site `jeromeswifteasteregg` de Paul a été écrasé sans un mot par la liaison d'une feuille sur l'item `swift-2027` (satire, S8 « Tâche finale » — le théâtre confirmé par ma mesure au hub). **Les DEUX écrivains de liaison** reçoivent la même garde :
- **`applyLinkChanges`** (modale Lier — URL, Drive, app, atelier, délier) : scindée en garde + `_applyLinkEcrire`. Si l'item porte déjà une ressource différente et que la nouvelle n'est pas vide → `_modaleConfirme` **nommant l'ancienne et la nouvelle** (« Cet item est déjà lié à … La remplacer par … ? L'ancienne restera notée sur l'item. »). Le délier garde sa confirmation existante (pas de double demande) mais TRACE aussi. L'écriture ajoute **`remplace` = {source, ref, kind, le}` (l'ancien couple)** au même lot M-ÉCHECS-1 : tout passe ou rien.
- **`edLierConfirme`** (Prendre une feuille, IA depuis trou, Lier par les titres) : scindée en garde + `_edLierEcrire`. Les lignes « occupées » sont listées dans UNE modale (« ‹n› items portent déjà une ressource : ‹ancien› → ‹nouveau›… Remplacer ? ») ; la trace s'écrit ligne par ligne avec la liaison (`secuEcrire …/remplace`).

**L'historique simple, lisible à deux endroits** : le panneau de l'éditeur (ligne discrète « Ressource précédente : site https://… — remplacée le 11/08/2026 », rendue SANS rechargement après le geste) et la modale Lier (« Liaison actuelle — … · Ressource précédente : … »). Libellés par `_resLibelle` (feuille « titre » / fichier Drive id / site url / activité ref).

**Prouvé au banc — le cas swift rejoué** (l'item remis à l'état d'avant l'écrasement) : la garde nomme « site https://jeromeswifteasteregg.example → feuille « Sujet de la tâche finale… » » ; **0 écriture avant confirmation** ; après : `ref`/`source`/`kind`/`remplace` écrits (chemins captés), panneau et modale montrent la trace. Captures cap-19 (la garde), cap-20 (la trace au panneau), cap-21 (la garde de la modale Lier), cap-22 (l'historique à la réouverture). 0 exception.

## ⑧ Les ressources externes se voient dans le fil

`ed2Documents` expose `src` ; en fin d'`ed2Papier`, un document **drive** ou **external** lié reçoit un **cadre** : barre identifiable (📎/🌐 + adresse en monospace + « Ouvrir en modale → ») **+ aperçu iframe** (lazy, sandbox). **Jamais une page blanche muette** : même si le site refuse l'embed, la barre nomme la ressource. Le clic sur la barre ouvre la ressource **en modale par `openViewer`** — le chemin élève existant (la garde ① s'applique). La règle **`@media print`** masque `.ed2-xcadre` (avec les trous — le papier imprimé reste le papier). Prouvé au banc : 2 cadres rendus dans la satire (le Drive de l'analyse logique + le site swift), clic → modale visible avec la bonne src, `display:none` à l'impression. Captures cap-23 (le cadre dans le fil), cap-24 (la modale ouverte). 0 exception.

**Défaut d'écran découvert par la capture et RÉPARÉ** : la première cap-24 montrait la modale mesurée « visible » au DOM mais INVISIBLE à l'écran — `doc-viewer-overlay` était à z-index 5000, l'atelier à 7000 : depuis l'éditeur, « Ouvrir en modale » ouvrait DERRIÈRE l'écran (le défaut LOT4-③ déjà vécu sur la modale Lier, révélé ici sur un autre overlay par le premier chemin qui appelle openViewer depuis l'atelier). Réparé : `doc-viewer-overlay` passe à **9500** (au-dessus de l'atelier 7000 et de Lier 7500, SOUS le viewer de feuille 9600). Rejoué : `elementFromPoint` au centre de l'en-tête rend `doc-viewer-header` — la modale est réellement devant (cap-24 rejouée). Aucun autre chemin ne dépendait de l'ancien empilement (openViewer hors atelier était seul à l'écran ; le viewer de feuille reste au-dessus).

## ⑩ Le lien écrit le dépôt — le cas fantôme cesse à la source

**`atFeuilleDepotPoser(docId, level, chnum, snum, itemId, cb)`** — l'écrivain UNIQUE du champ `depot` posé par une liaison : `{niveau, chapitre, seance, chapitreUid, seanceUid, itemId, le}` (l'identité à côté du rang, C5-UID), et le **`rattachement`** (l'adresse) écrit **SEULEMENT si la feuille n'en a pas** — une adresse divergente n'est JAMAIS écrasée (atStatutFeuille continue de la dire). Les caches (`LINK_ATELIER_DOCS`, `AT_DOCS`, `AT.liste`, `AT.doc`) suivent. Appelé par les TROIS voies de liaison : `_edLierEcrire` (après chaque ligne réussie), `edPrendreFeuille` voie itemCreer, `edIAdepuisTrou` voie itemCreer (signature `itemCreer` → `cb(itemId)` vérifiée sur le code réel).

**Prouvé au banc — le cas fantôme rejoué** : une feuille SANS rattachement liée par « Prendre une feuille existante » → écritures captées `…/depot` ET `…/rattachement` ; la carte dit désormais **« Déposée dans 3e › Chapitre 3 › Séance 5 · jamais envoyée aux élèves »** au lieu de « Sans adresse ». Et sur une feuille DÉJÀ adressée (la prepa_brevet) : `depot` écrit, `rattachement` NON réécrit (0 écriture — la règle). La limite « Sans adresse le temps du chargement » du registre ⑦b disparaît avec sa cause. 0 exception.

## Tailles ⑧b (déclaration→déclaration ; segments réels pour les fonctions à internes)
`applyLinkChanges` 1307→1299 **+ `_applyLinkEcrire` 1633 (neuve, la moitié écrivaine)** + `_resLibelle` 443 (neuve) — zone réelle 1225→2850 · `edLierConfirme` 1770→1380 **+ `_edLierEcrire` 2212 (neuve)** · `atFeuilleDepotPoser` 1879 (neuve, l'écrivain ⑩) · `edPrendreFeuille` 2666→2927 · `edIAdepuisTrou` 3132→3280 · `ed2Papier` segment réel 5172→6415 · `ed2Documents` 1432→1504 · `openLinkModal` 2254→2614 · `atEditerChapitreRendre` 12359→12685. **4 fonctions neuves déclarées** (les moitiés écrivaines des deux gardes + le libellé + l'écrivain du dépôt), 0 retirée. CSS : +7 règles `.ed2-x*`, +1 `.at-edch-rempl`, `.ed2-xcadre` ajouté au `@media print` existant.

## Écritures déclarées (⑧b)
Nouveaux champs de DONNÉES (jamais lus par un rendu élève) : `remplace` sur l'item (écrit par les deux écrivains de liaison, dans leur lot/Promise.all existant) ; `depot` + `rattachement` sur la feuille (par `atFeuilleDepotPoser`, primitives `secuEcrire` existantes). `published` JamAIS écrit. Aucun chemin d'écriture parallèle : `atDeposerFeuille` (le dépôt par glisser) garde son écriture de feuille entière — la COMPOSITION du champ est cohérente entre les deux flux (mêmes clés + uids).

## Textes français soumis à Paul (⑧b)
« Cet item est déjà lié à ‹ancienne›. La remplacer par ‹nouvelle› ? L'ancienne restera notée sur l'item. » · « ‹n› items portent déjà une ressource : ‹liste ancien → nouveau›. L'ancienne restera notée sur chaque item. Remplacer ? » · « Ressource précédente : ‹libellé› — remplacée le ‹date› » · libellés : « feuille « ‹titre› » » / « fichier Drive ‹id› » / « site ‹url› » / « ‹kind› ‹ref› » / « (aucune) » · barre du cadre : « Ouvrir en modale → ».

## Captures ⑧b (captures/, examinées une par une)
cap-19 la garde du remplacement (lot) · cap-20 la trace au panneau · cap-21 la garde de la modale Lier · cap-22 l'historique à la réouverture · cap-23 le cadre externe dans le fil · cap-24 le clic ouvre la modale.

## Dettes, limites, arbitrages (état après ⑧b)
Aucune dette nouvelle. **⑨ attend le feu vert de la conscience** (option A : champ `produit` sur l'item, seconde passe drive/external dans collectChapterItems, filtre atelier ADDITIONNÉ — vs option B : entrée légère `/site/atelier/externes/` ; recommandation A) — il s'empilera sur 8.50.0. À entériner aussi : la 4e cause ② (nonPubliee) et la divergence de mesure ③ (rapport ⑧a). Observations sans correction (base) : corps de feuille neuve « Sans titre » · `zone()` écrase la fiche Drive statique de la drop-zone analyse-logique (⑨ la rangera) · registre 06/08 (rubriques par domaines + onglet Méthode) signalé, non codé sans mandat.

---

# LOT ⑧c — 8.51.0 : LA SUITE ET FIN DU LOT ⑧ (mandat du 11/08)

**Empilé sur 8.50.0** (base re-téléchargée du sas, vérifiée **977 482 o, md5 `9395cf93040c1df282bd8eb5e123c47b`**). **Livré** : `LOT8/index.html` **984 104 o**, md5 `c4270bfbb5e1380e5198f3ccfc1f910a`, pastille **8.51.0**. Dual parser vert (new Function + acorn ES2020). Banc reconstruit (`banc8.js`, rejouable) : **snapshot lecture-seule du hub réel** (site.json 150 570 o + classes — non poussés au sas), hub intercepté (GET servis du snapshot, OPTIONS/preflight servis, PUT/PATCH/DELETE journalisés + mutés en mémoire), **mur réseau : tout le reste ABORTÉ** — **exception unique déclarée : `http://localhost:8077`**, un serveur local du banc servant une page réelle, pour la seule preuve ③ (le chargement RÉEL ne peut pas se prouver avec un réseau muré). **0 écriture réelle, 0 exception JS** sur tous les parcours joués.

⚠ **CE LOT CHANGE LA VUE ÉLÈVE (⑨)** — déclaré et capturé : une ressource externe **qualifiée** (produit posé sur l'item) **et publiée pour la classe de l'élève** paraît désormais aux onglets transversaux, comme une fiche (cap-29-m : la carte au rayon Analyse logique, « 1 fiche », élève 390 ; **cap-33** : la même vue élève en desktop — page-level réelle, « 1 fiche », bloc des ignorées vide) ; elle s'ouvre par `openViewer` — donc avec **l'issue ② « Ouvrir dans un onglet ↗ »** (cap-30-m). Le bloc des ignorées reste structurellement vide côté élève (prouvé : innerHTML='', sessions élève rejouées). Hors ⑨ et ② (l'issue paraît aussi à l'élève dans toute modale de document — c'est le but), rien d'autre ne change pour l'élève.

## ② « Ouvrir dans un onglet ↗ » — la modale n'est jamais un cul-de-sac
L'en-tête du `doc-viewer` porte une ancre `#doc-viewer-newtab` (`target="_blank" rel="noopener"`, min-height 44px), masquée par défaut. `openViewer` la règle : **source http(s) → href posé + visible, SYSTÉMATIQUEMENT** (un refus d'embarquement — X-Frame-Options/CSP — n'est pas détectable de façon fiable cross-origin : l'issue est donc toujours offerte, jamais conditionnée à une détection) ; branche srcdoc (garde ①) → masquée ; `closeViewer` masque et retire le href. Prouvé : cap-27 (desktop, Drive), cap-30-m/32-m (390), la barre du cadre ⑧ y mène aussi.

## ③ La preuve de chargement réel
Un item `external` pointé sur `http://localhost:8077/page-banc` (l'exception du mur) : **ⓐ** le cadre du fil montre la page réellement rendue dans l'aperçu (cap-28 desktop, cap-31-m 390) ; **ⓑ** « Ouvrir en modale → » ouvre la modale avec le même contenu réel (cap-29 desktop, cap-32-m 390) ; **ⓒ** l'issue ② y est visible et porte l'URL. NB : sur les captures Drive (cap-27, cap-30-m), l'aperçu est gris — c'est **le mur du banc** qui aborte drive.google.com, pas un défaut : la preuve de chargement est précisément le jeu localhost.

## ⑨ (option A entérinée) — le produit vit SUR l'item
- **`collectChapterItems`** accepte la valeur spéciale `kind='@externes'` : le MÊME moteur (mêmes trois étages de publication, même `avecInvisibles` prof) collecte par SOURCE (`drive`/`external` avec ref) au lieu du kind — une ligne de filtre, aucun appel existant ne passe cette valeur (mesuré), comportement inchangé partout ailleurs. L'objet collecté expose désormais `snum` (clé neuve, aucun lecteur existant).
- **`collectRayons`** : une **seconde passe** range les externes par `item.produit` (identité du rangement = l'item — uid/clé —, la ref reste l'id Drive ou l'URL) ; **sans produit → ignorées CÔTÉ PROF, cause `sansProduitExt`** (libellé soumis : « fichier ou site déposé sans type déclaré — choisis-le ici pour le ranger dans un onglet ») ; invisible → `nonPubliee` (l'étage nommé) ; produit sans rayon → `ancre`. **La publication reste souveraine** (prouvé au banc : l'item qualifié mais non publié reste ignoré et dit pourquoi — cap-26 t121 ; publié pour une classe réelle → rangé, cap-26 finale).
- **L'écrivain UNIQUE** : `itemProduitPoser(level,chnum,snum,itemId,prod)` → `_sitePut('…/items/<k>/produit')`, cache `chapitresData` suivi, re-rendu rayons + panneau sans rechargement. **Le menu est LE menu existant** : `_produitSelectHTML` factorise les options (une seule source, ATELIER_PRODUITS) ; `atProduitMenu` (feuilles, écrivain `atFeuilleProduitPoser` inchangé — corps prouvé identique au md5) et `itemProduitMenu` (items) le partagent. Il paraît **aux deux endroits existants** : le bloc des ignorées (cap-25 desktop, cap-25-m 390 : les 4 externes réels de Paul — L'Albatros, le questionnaire, les 2 fiches notions Drive de t747 — avec leur menu) et **le panneau de l'éditeur** sur la ligne d'un item drive/external lié (cap-27-m). Écriture captée au banc : `PUT /site/3e/chapitres/10/seances/0/items/tableaux/produit` — **une seule, `published` JAMAIS écrit** (la publication du décor = mutation mémoire du banc, 0 écriture).
- **`_openAtelierFromList` discrimine** : ref au cache atelier → `openAtelierItem` (inchangé) ; URL http(s) → `openViewer` direct ; motif id Drive → `openViewer` preview ; sinon le viewer atelier (message sain). La garde ① et l'issue ② s'appliquent à tous ces chemins.
- **La fiche Drive statique « Analyse logique 3e » retirée du HTML** (commentaire posé, 0 occurrence) : `zone()` l'écrasait à chaque rendu (défaut de base consigné en 8.50) — elle revit proprement par ⑨ dès que Paul qualifie l'item Drive correspondant. **AUCUNE migration de données : l'existant se qualifie à la main, item par item, par le menu.**

## ① La campagne mobile 390 px et la règle des conteneurs bornés
Sessions réelles prof ET élève à 390×844, captures examinées une par une : cap-25-m (onglets + « Non rangées » prof, menus d'items présents) · cap-26-m (**la garde du remplacement ⑦** : `#console-modal` DEVANT la modale Lier — z-index 9999, `elementFromPoint` rend l'en-tête de la garde —, l'ancienne et la nouvelle nommées) · cap-27-m (la trace « Ressource précédente… » au panneau + le menu produit ⑨) · cap-28-m (toast d'échec « ⚠ pas de liaison — rien n'est parti… ») · cap-29-m (rayons élève avec la fiche ⑨) · cap-30-m (viewer élève + issue) · cap-31-m/32-m (③). **Conteneurs bornés MESURÉS** (boîte dans le viewport, actions visibles, cibles ≥44px) : garde du remplacement ✓ (Annuler 44, Oui continuer 44) · viewer ✓ après **UN correctif de cible : `.doc-viewer-close` mesuré 27px → `min-height:44px`** (re-mesuré 44 ✓) ; l'issue ② était à 44 d'origine. Écritures du remplacement captées à 390 : `source` + `ref` + `remplace` (le lot M-ÉCHECS-1), modale fermée après confirmation, trace rendue sans rechargement.

## Tailles ⑧c (déclaration→déclaration ; base 8.50.0 → lot)
`openViewer` 1041→1703 · `closeViewer` 1471→1586 · `collectChapterItems` 2530→3012 · `collectRayons` 1750→3112 · `renderRayons` 2501→2960 (CAUSES + le menu discriminé) · `_openAtelierFromList` 561→1062 · `atProduitMenu` 397→131 (refactoré sur la source commune) · `atEditerChapitreRendre` 12685→13106 (⑨ panneau) · **neuves : `_produitSelectHTML` 376 · `itemProduitMenu` 535 · `itemProduitPoser` 750** · `atFeuilleProduitPoser` segment 1318→1596 = **artefact de frontière** (le segment absorbe le commentaire du bloc neuf voisin) — **corps prouvé IDENTIQUE, md5 `ca4b620a…` des deux côtés** · `applyLinkChanges`/`_applyLinkEcrire` strictement identiques. HTML : en-tête du viewer (+`doc-viewer-actions`/ancre), −fiche statique analyse-logique. CSS : +2 règles (`.doc-viewer-actions`, `.doc-viewer-newtab`) + min-height sur `.doc-viewer-close`. **0 fonction retirée.**

## Écritures et textes (⑧c)
Écritures ajoutées : **`itemProduitPoser` seul** (le champ `produit` de l'item, par `_sitePut` existant — mode test respecté). `published` jamais écrit. Caches : `chapitresData` muté par l'écrivain puis re-rendus. Textes français soumis : « Ouvrir dans un onglet ↗ » · « fichier ou site déposé sans type déclaré — choisis-le ici pour le ranger dans un onglet ».

## Dettes, limites, arbitrages (état après ⑧c)
**Aucune dette nouvelle.** Notes de banc, déclarées : le décor publie LOCALEMENT (mutations mémoire) pour la classe réelle « 3E Charles de Gaulle » ou une classe de banc `3a` selon la session — aucune écriture réelle ; l'aperçu Drive gris sur cap-27/30-m = le mur du banc. Observations de BASE inchangées (corps « Sans titre », registre 06/08). L'arbitrage `published:true` du trajet upload (M8-IDENTITÉ) reste ouvert — et l'item `tableaux` du hub réel porte ce `published:true` historique, visible depuis les états ⑦b.


---

# RETOUCHE D'AUDIT ⑧c — 8.52.0 (constats de l'examen visuel des 43 captures)

**Base vérifiée** : le sas 8.51.0 (984 104 o, `c4270bfbb5e1380e5198f3ccfc1f910a`), re-téléchargé avant édition. **Livré** : `LOT8/index.html` 984 629 o, pastille **8.52.0**, dual parser vert. **Deux changements de code seulement (① et ③, la règle ④)** : ⓐ `#mjpc-upload-toast` passe à **z-index 10500** (au-dessus des boutons flottants à 10000 — cap-14 montrait la fin du message sous « Panneau prof ») + `max-width:min(72vw,560px)` ; ⓑ `renderZoneAutonomie` : le vide se dit — « **Rien à signaler ici** » (texte arrêté par Paul), au gabarit exact des messages de vide du site, élève ET prof, sans condition. **Tailles** : `renderZoneAutonomie` 1793→2142 (AST) ; inventaire complet base→lot : **aucune autre fonction ne bouge, 0 neuve, 0 retirée**. Vue élève : le seul changement est le message de vide ③ (déclaré, capturé) ; le toast ① est un écran prof.

## ② Les preuves d'écran des SIX familles d'échec du dépôt (capturées toast affiché)
Rejouées au banc (stub du script de dépôt réglable par famille ; snapshot réel, 0 écriture réelle, 0 exception JS) — une capture par famille, texte intégral lisible, toast DEVANT les flottants :
- **cap-34** script muet (`status:'erreur'`) : « ⚠ le script de dépôt a répondu sans détail — réessaie ; si ça persiste, dépose le fichier à la main sur Drive puis colle son lien (bouton Lier). »
- **cap-35** réponse sans id : « ⚠ Le dépôt n'a pas rendu d'identifiant — rien n'est lié. Réessaie ; … »
- **cap-36** réseau coupé : « ⚠ pas de liaison — rien n'est parti. Vérifie la connexion, puis reglisse le fichier. »
- **cap-37** fichier > 30 Mo (31 Mo réels au banc, la garde coupe avant tout réseau) : « ⚠ Fichier > 30 Mo — dépose-le à la main sur Drive puis colle son lien (bouton Lier). » — **le cas même de cap-14, désormais lisible en entier**
- **cap-38** refus HTTP : « ⚠ le script de dépôt a refusé (HTTP 500) — réessaie ; … »
- **cap-39** lecture de fichier impossible (FileReader du banc rendu défaillant — instrument déclaré, la seule voie de provoquer `reader.onerror`) : « ⚠ Lecture du fichier impossible — reprends-le depuis ton ordinateur et reglisse-le. »
La famille mobile : cap-28-m (8.51.0, réseau coupé à 390) reste la preuve 390 du toast ; **cap-40-m** ajoute la preuve ① à 390.

## ① Le toast intégralement lisible — MESURÉ puis capturé
Desktop (cap-34→39) : `elementFromPoint` aux trois points de la zone de texte (gauche/centre/droite) rend `mjpc-upload-toast` — rien ne le recouvre, z-index calculé 10500. **390 px (cap-40-m)** : même mesure aux trois points → `mjpc-upload-toast` partout, toast intégralement DANS l'écran (`right ≤ innerWidth`), les pastilles rondes prof derrière.

## ③ Le vide de la Zone autonomie — capturé
- **cap-41** élève desktop : l'onglet Zone autonomie affiche « Rien à signaler ici » au gabarit des vides du site (carte centrée, italique).
- **cap-42-m** élève 390 : le même message, pastille 8.52.0 visible.
Côté prof : même rendu (même fonction, aucune condition — conforme au mandat).

## Dettes, limites (après 8.52.0)
Aucune dette nouvelle. Le stub des familles d'échec et le FileReader défaillant sont des instruments de banc, jamais livrés. La promotion emportera ⑧a+⑧b+⑧c+retouche en un seul geste (8.52.0).

---

# RETOUCHE DE TEXTES ⑧c — 8.53.0 (constat de Paul : plus aucun jargon à l'écran)

**Base vérifiée** : le sas 8.52.0 (984 629 o, `9891292bec780957bd0290da070777f1`), re-téléchargé avant édition. **Livré** : `LOT8/index.html` 985 326 o, pastille **8.53.0**, dual parser vert. **Aucun changement de logique** : seules les chaînes ci-dessous + les `console.error` (la règle, posée en commentaire à l'endroit des toasts : « la cause dans le langage de Paul à l'écran, le détail technique en console »). `published` intouché ; vue élève inchangée (tous ces écrans sont prof).

## La liste exacte des chaînes remplacées (ancienne → nouvelle)
**① Les toasts du dépôt** (`_uploadBlobToDrive` — 6 familles, 5 textes ; script muet et refus HTTP partagent le même texte, leurs causes distinctes partent en `console.error('MJPC dépôt — …', détail)`) :
1. « le script de dépôt a répondu sans détail — réessaie ; si ça persiste, dépose le fichier à la main sur Drive puis colle son lien (bouton Lier). » (et sa variante `res.error/res.message` affichée brute) → « Le fichier n'est pas arrivé sur Drive. Réessaie ; si ça continue, dépose-le toi-même sur Drive puis colle son lien (bouton Lier…). »
2. « le script de dépôt a refusé (HTTP N) — réessaie ; … » → **le même texte qu'en 1** ; le code HTTP part en console.
3. « Le dépôt n'a pas rendu d'identifiant — rien n'est lié. Réessaie ; si ça persiste, … » → « Drive n'a pas confirmé le dépôt — le fichier n'est pas lié à la ligne. Réessaie ; si ça continue, dépose-le toi-même sur Drive puis colle son lien (bouton Lier…). »
4. « pas de liaison — rien n'est parti. Vérifie la connexion, puis reglisse le fichier. » → « Pas de connexion internet — le fichier n'est pas parti sur Drive. Vérifie ta connexion, puis reglisse le fichier. »
5. « Fichier > 30 Mo — dépose-le à la main sur Drive puis colle son lien (bouton Lier). » → « Fichier trop lourd (plus de 30 Mo) — dépose-le toi-même sur Drive puis colle son lien (bouton Lier…). »
6. « Lecture du fichier impossible — reprends-le depuis ton ordinateur et reglisse-le. » → « Impossible de lire ce fichier — reprends-le depuis ton ordinateur et reglisse-le. »
**② La garde de remplacement** (`applyLinkChanges` / `edLierConfirme`, libellés toujours par `_resLibelle`, inchangé) :
- « Cet item est déjà lié à ‹ancien›. La remplacer par ‹nouveau› ? L'ancienne restera notée sur l'item. » → « Cet item porte déjà : ‹ancien›. Le remplacer par : ‹nouveau› ? Tu retrouveras l'ancienne adresse sous l'item, dans l'éditeur. »
- (multiple) « …L'ancienne restera notée sur chaque item. Remplacer ? » → « …Remplacer ? Tu retrouveras les anciennes adresses sous chaque item, dans l'éditeur. »
**③ La trace sous la ligne** (panneau de l'éditeur) : « Ressource précédente : ‹libellé› — remplacée le ‹date› » → « Ancien document : ‹libellé› — remplacé le ‹date›. » (La mention de la modale Lier — « Ressource précédente : … (remplacée le …) » — n'était pas au mandat : intouchée, règle ④.)

## Tailles (AST, base→lot) — les quatre segments porteurs, rien d'autre
`_uploadBlobToDrive` 2731→3392 · `applyLinkChanges` 1298→1319 · `edLierConfirme` 1379→1409 · `atEditerChapitreRendre` 12568→12553 · 0 neuve, 0 retirée · fichier 984 629→985 326.

## Banc (snapshot réel, 0 écriture réelle, 0 exception JS) — captures examinées une à une
Six familles rejouées, **cinq textes** à l'écran, six causes distinctes en console (captées au banc) : cap-43 muet · cap-44 sans identifiant · cap-45 réseau · cap-46 trop lourd (31 Mo réels) · cap-47 refus HTTP 500 (**même texte que cap-43**) · cap-48 lecture impossible — chaque texte intégral, toast devant (elementFromPoint re-mesuré, z 10500). La garde : cap-49 (simple, le texte exact) · cap-51 (multiple : « 2 items portent déjà une ressource : ‹liste ancien → nouveau› Remplacer ? Tu retrouveras les anciennes adresses sous chaque item, dans l'éditeur. ») ; la confirmation écrit `source`/`ref`/`remplace` (captées) et la trace paraît sans rechargement : cap-50 (« Ancien document : fichier Drive … — remplacé le 12/08/2026. »). La famille 390 : cap-52-m (réseau, texte neuf, toast devant, dans l'écran).

## Dettes, limites (après 8.53.0)
Aucune dette nouvelle. La promotion emportera ⑧a+⑧b+⑧c+les deux retouches en un seul geste (**8.53.0**).

---

# MICRO-RETOUCHE ⑧c — 8.53.1 (unification de vocabulaire, décision de Paul)

**Base vérifiée** : le sas 8.53.0 (985 326 o, `54e98975889e0482653555682b8c33aa`), re-téléchargé avant édition. **Livré** : `LOT8/index.html` 985 386 o, pastille **8.53.1**, dual parser vert. **UNE seule chaîne** (modale Lier, `openLinkModal`) : « · Ressource précédente : ‹libellé› (remplacée le ‹date›) » → « · Ancien document : ‹libellé› — remplacé le ‹date›. » — le vocabulaire de la trace du panneau, à l'accord près. `_resLibelle` et la date inchangés ; aucune fonction ne change de logique (le segment porte la chaîne + un commentaire) ; `published` intouché ; 0 écriture réelle, 0 exception. **cap-53** : la modale Lier sur l'item porteur d'une trace (le décor de cap-49) montre la mention unifiée, intégralement lisible.