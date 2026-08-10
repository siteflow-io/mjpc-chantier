# LOT ⑦a — LE DÉPÔT : nouveau script, code mort retiré, zone visible, le fil suit, l'image se dépose

**DÉCOUPAGE ANNONCÉ (règle du mandat)** : les neuf points ne tiennent pas en deux tours sans bâcler. Ce lot livre **⑦a = le DÉPÔT (points ①, ⑦, ⑧, ⑨)** — tout ce qui tourne autour d'`_uploadBlobToDrive`. **⑦b = L'ENVOI ET SES ÉTATS (points ②, ③, ④, ⑤, ⑥)** — tout ce qui tourne autour de `/site/atelier/envois` et de l'adressage — attend un mandat de reprise : ③ seul (quatre états × deux écrans × « i » × avertissement × envoi en masse) est un demi-lot.

**Base vérifiée** : production 954 985 o, md5 `042ebfa1416b25d1936f25ab7f115810`.
**Livré** : `index.html` **949 748 o** (le fichier MAIGRIT : le mort pèse plus que le neuf), md5 `0dfa7915d6bab1bfe74b18db239e3399`, pastille **8.47.0**. Dual parser vert. **837 → 829 fonctions : 2 neuves (`_cheminDriveLisible`, `diapoImagePoser`), 10 retirées — toutes listées, justifiées, prouvées ci-dessous.** Vue élève publiée base ↔ lot : **22 264 o identiques, 0 exception.** Banc : hub intercepté, **0 écriture réelle** (mur réseau : tout non-file:// aborté), **0 appel réel au script Drive** (stub journalisé qui rend la forme exacte de réponse du nouveau script).

---

## ① Le dépôt passe au nouveau script

**`_uploadBlobToDrive` réécrite** (1 010 → 1 788 o) : action **`deposer`** vers la nouvelle URL (constante dédiée `APPS_SCRIPT_DEPOT_URL`), corps `{action, fichier, nom, type, chemin}`. **`chemin` = noms lisibles** composés par `_cheminDriveLisible` (neuve, 474 o — une seule fonction compose ce chemin) : `[niveau, titre du chapitre, "Séance N — titre"]` avec N = le rang d'`ordre` (la seule vérité). Prouvé au banc (t100) : le stub reçoit `["4e","Poésie et peinture","Séance 2 — Lire un tableau"]`. **Le principe tenu** : le site ne retient que `id` (`ref = res.id`), jamais le chemin — le commentaire du code le grave. **Compatibilité totale** : la réponse est adaptée en `{drive_file_id:res.id, file_name, ext, url, affichage}` — les quatre appelants (`uploadFileForChapterItem`, `addImageToGallery`, `convertItemToGalleryAndAdd` via `pasteIntoItem`/`_routeFileToTarget`, le drop de la modale Lier) lisent `res.drive_file_id` (mesuré) et fonctionnent sans réécriture (t100/t102 les traversent). Le refus > 30 Mo dit désormais le geste de remplacement : « dépose-le à la main sur Drive puis colle son lien (bouton Lier) ».

**L'INVENTAIRE DU MORT — mesures, puis retraits prouvés.** L'ancien circuit parallèle de dépôt (`_initOutilsProf` → `initAdminDragDrop_`) visait les `.doc-item[data-docid]` et `.fiche-drop-zone` des onglets statiques et appelait les actions d'AVANT Firebase (injection de HTML dans GitHub, jeton resté `COLLE_TON_TOKEN_GITHUB_ICI` : **échec depuis toujours**, confirmé par la mesure du mandat). Les dix retraits :

| fonction (octets) | action morte | pourquoi c'était mort |
|---|---|---|
| `initAdminDragDrop_` (2 096) | — | l'ancien circuit entier ; unique appelant : `_initOutilsProf` (nettoyé) |
| `uploadFile_` (1 501) · `uploadFileToSection_` (1 342) | `upload` | injection GitHub, jeton placeholder — échouaient toujours |
| `associateBigFile` (1 572) | `associate` | même architecture ; bouton de l'overlay retiré |
| `loadDocsList_` (378) · `applyDocsToUI_` (291) | `getdocs` | registre de feuille de calcul disparu ; catch silencieux |
| `deleteDoc_` (813) | `remove_doc` | le ✕ posé par l'ancien circuit ; même registre disparu |
| `showBigFileGuide_` (1 521) · `closeBigFile` (149) · `dismissBigFileGuide` (121) | `get_folder_url` | **atteignabilité mesurée comme exigé** : l'unique entrée du flux « gros fichier » était `showBigFileGuide_`, appelée SEULEMENT par `initAdminDragDrop_` (l'ancien circuit) — avec lui retiré, plus aucune entrée ; le circuit ACTUEL (> 30 Mo) affiche le message de remplacement ci-dessus |

Retirés aussi : les variables `BIGFILE_CTX`/`BIGFILE_DISMISSED`, l'overlay HTML `#bigfile-overlay` et son CSS `.bigfile-*`. **Preuve d'inatteignabilité** : après retrait, `grep` de tous les noms et de toutes les actions mortes (`upload`, `associate`, `getdocs`, `get_folder_url`, `upload_drive_only`) = **0 appel réel** (2 occurrences restantes = les commentaires de retrait). Conservés en connaissance de cause : `DOCS_CACHE` (lu par `openDoc`, vivant — reste vide, `openDoc` fonctionne par `data-embed`) ; `openDoc` ; le CSS `.fiche-drop-zone` (décor des onglets statiques, qui perdent leur drop mort et leurs ✕ morts — déclaré).

**Observation hors périmètre, consignée sans retrait** : `APPS_SCRIPT_URL` (l'ancienne URL) reste portée par le suivi de présence (`sendToBackend`, `trackOpen`/`trackClose`) — comportement conservé à l'identique ; et **`trackLogin` n'a plus aucun appelant** (le login vit dans les codes M-SÉCU). À arbitrer un jour, pas dans un lot de dépôt.

## ⑦ La zone de dépôt se voit

La section « 📎 Fichier Drive ou URL externe » de la modale Lier porte désormais **une vraie zone** (bordure dorée pointillée permanente, icône ⬇) : « **Glisse un fichier ici** — il part sur Drive, rangé dans le dossier du chapitre, et l'item est lié aussitôt. », puis « ou colle un lien : » + le champ (usage conservé). Le survol renforce le signal (`.link-drop-actif`). Capture `captures/cap_zone_survol.png` (examinée).

## ⑧ Le fil montre le document — prouvé sur cette base

Le re-rendu `if(AT.edChap)atEditerChapitreRendre()` livré au LOT ⑥ est **dans cette base** ; t100 le rejoue de bout en bout : drop → « ✅ Document lié : lecture-analytique.pdf » → **le fil montre « Support de lecture » à sa place en séance 2, sans rechargement** (capture `captures/cap_depot_fini.png`, sommaire « 12 documents sur 30 attendus », coût « 12 f. » recalculé). Le constat de Paul datait de la production d'avant la promotion du LOT ⑥. Complément ⑨ : la pose d'une image re-rend aussi le fil (`diapoImagePoser`).

## ⑨ Déposer une image directement dans la composante

**Mesure d'abord** : les blocs d'image du gabarit ne sont rendus **que dans le viewer du diaporama** (`diapoRendre` n'est appelé que là — le fil montre la vignette de l'item, pas les blocs). Le dépôt est donc branché **sur la composante existante** (`.dp-img-btn`, la zone « À déposer » que seul le professeur reçoit), ouverte depuis l'éditeur : le contexte (chapitre, séance) se retrouve **par la ref du diaporama** dans le chapitre ouvert.

**Aucun second mécanisme** : l'écrivain de la ref est extrait en **`diapoImagePoser`** (neuve, 1 012 o — mémoire OU `secuEcrire .../ref` + `AT_DIAPOS` + re-rendu viewer + fil) et les DEUX gestes passent par lui : le lien collé (`diapoDeposerImage`, refactorée dessus, invite complétée) et le fichier déposé (délégation `dragover`/`drop` sur `.dp-img-btn[data-dpmode]`, data-attrs posés au rendu — `diapoRendreBloc` 2 918 → 3 050). Le fichier part par **le chemin de ①** (même `_uploadBlobToDrive`, même dossier lisible). L'aide de la zone dit le geste : « glisse l'image ici — ou clique pour coller un lien Drive ».

**Preuves t102** : zone signalée au survol (capture `captures/cap_img_survol.png`) ; **garde** : un PDF déposé → « Ce fichier n'est pas une image — la composante attend une image (jpg, png, webp…). » ; l'image → stub reçoit `(deposer, turner-pluie.png, image/png, ["4e","Poésie et peinture","Séance 2 — Lire un tableau"])` — **la séance retrouvée par la ref** ✓ ; ref `DRV_IMG_9` écrite au store par l'écrivain unique ✓ ; **l'image paraît aussitôt** dans le bloc (capture `captures/cap_img_posee.png`) ; « ✅ Image déposée : turner-pluie.png » ; 0 exception. Hors éditeur : message sobre (« Ouvre le diaporama depuis l'éditeur de chapitre… ou colle un lien Drive »).

## Tailles (déclaration→déclaration ; artefacts de frontière déclarés)
Modifiées : `_uploadBlobToDrive` 1 010→1 788 · `diapoDeposerImage` 1 831→3 647 (l'IIFE du drop vit dans son segment) · `diapoRendreBloc` 2 918→3 050 · `_initOutilsProf` 191→256 · neuves : `_cheminDriveLisible` 474, `diapoImagePoser` 1 012. Artefacts de frontière (corps **prouvés identiques** par diff) : `handleBadgeTap` 228→1 183 et `showUploadToast` 337→720 (les commentaires de retrait voisins entrent dans leur segment), `openDiaporamaById` 1 729→1 966 (le commentaire de l'écrivain précède la déclaration suivante), `mjpcEcrireRest` 5 776→5 776 (la pastille dans son segment).

## Caches et écritures déclarés
`chapitresData` (lu par `_cheminDriveLisible` — titres réels — et par la recherche de séance de ⑨) · `AT_DIAPOS` (écrit par `diapoImagePoser`, déclaration existante) · `DP.json` (mode mémoire, existant) · `M8_TEST_STORE` + `__REST` + stub `__SCRIPT` au banc · `published` : **aucune écriture nouvelle** — le trajet upload conserve son `published:true` historique (arbitrage M8-IDENTITÉ toujours ouvert, à trancher avec ⑦b/③ qui traite précisément publié≠envoyé).

## Textes français soumis à Paul
« Glisse un fichier ici — il part sur Drive, rangé dans le dossier du chapitre, et l'item est lié aussitôt. » · « ou colle un lien : » · « Fichier > 30 Mo — dépose-le à la main sur Drive puis colle son lien (bouton Lier). » · « glisse l'image ici — ou clique pour coller un lien Drive » · « Colle le lien Google Drive de l'image — ou ferme, et glisse directement le fichier sur la zone « À déposer ». » · « Ce fichier n'est pas une image — la composante attend une image (jpg, png, webp…). » · « ⏳ Envoi de l'image… » · « ✅ Image déposée : <nom> » · « Ouvre le diaporama depuis l'éditeur de chapitre pour déposer l'image directement — ou clique la zone et colle un lien Drive. » · dossiers Drive : « Séance N — <titre> ».

## Dettes
Aucune dette nouvelle. **⑦b (②③④⑤⑥) attend son mandat** — l'envoi et ses états : condition d'envoi d'`atDeposerFeuille`, les quatre états aux deux endroits, les messages d'`openAtelierItem`, « Sans adresse », l'UI d'adressage. Observations consignées : `trackLogin` sans appelant · `APPS_SCRIPT_URL` du suivi de présence pointe l'ancien script.
