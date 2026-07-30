# M-ÉCHECS-1 — CADRAGE (exécutant → conscience)
**30/07/2026 · avant tout code · j'attends le feu vert**

## 0 · Conteneur, date, lectures — preuves

- **Conteneur hérité déclaré** : ce conteneur porte le travail SITE-COURS-1 (`/home/claude/build`), dont je me souviens intégralement (même conversation, mandat précédent, promu en 8.6.0 le 29/07). Rien n'y est inconnu ; le présent morceau part exclusivement de la production re-téléchargée.
- **Date vérifiée à deux sources indépendantes** (règle du 29/07) : horloge conteneur `Thursday 30 July 2026 07:57 UTC` · en-tête GitHub `date: Thu, 30 Jul 2026 07:57:50 GMT` — concordantes : **jeudi 30/07/2026**.
- **Lectures obligatoires** (méthode différentielle validée : mes copies du mandat précédent, md5 vérifiés identiques au registre, puis lecture intégrale des deltas) :

| Document | Taille | md5 mesuré |
|---|---|---|
| `MJPC6-1-DISPOSITIF.md` | 121 650 o | `ce116a8cdb82c5ad4a8b0365cfa4613a` |
| `MJPC6-2-DOCTRINE.md` | 78 342 o | `a304e9010ceaafdd0e74d4e7edbc9d32` |
| `MJPC6-3-CHANTIER.md` | 129 834 o | `4656241e745e71930305281b2755f6f9` |
| `MJPC6-journal.md` | 90 860 o | `e471edb60f654f051a4b9193d23f8617` |
| `MJPC6-doctrine-du-site.md` | 86 663 o | `bbc34f10fd772eb16b0268cafaebe3f5` |

- **Base** : `index.html` production re-téléchargée ce matin — **492 213 o, md5 `ba698e667635164fb855282e844eb2fc`, v8.6.1** : identique à l'entrée du journal du 29/07 ~14h. C'est d'elle que je partirai (et je la re-téléchargerai à nouveau juste avant d'éditer).
- Pourquoi le morceau existe (lu) : DOCTRINE ⑦ — tout repose sur des données arrivées et rattachées ; un échec d'écriture silencieux fabrique un diagnostic mal fondé « à l'autorité douce d'un graphique ». Journal 29/07 : `seanceSansDoc`, sept jours de mensonge d'écran.

## 1 · Inventaire mesuré des écritures — MA mesure

**58 écritures REST directes** (`fetch` + method) : **37 PUT · 10 POST · 11 DELETE** — concordant avec l'indicatif du prompt. S'y ajoutent **12 appels via `_sitePut`/`_siteDelete`** (le socle d'écriture du site) et **6 via `atSitePut`/`atSiteDelete`** (durcissement local SITE-COURS-1). Inventaire ligne à ligne tenu (ligne, fonction porteuse, verbe, traitement actuel) ; il sera joint au rapport final. **Contrôlent réellement la réponse aujourd'hui : 6 sur 58** — `_fbPutPath`/`_fbDeletePath` (corbeille, `throw` sur `!ok`), `submitCreateClass` (throw + `alert`), `sendToBackend` (sendBeacon, cas à part), `atSitePut`/`atSiteDelete` (mes deux, mais **binaires** : elles ne distinguent pas refus/panne).

**Par famille, avec traitement actuel constaté** :

| Famille | Écritures | Traitement actuel | Contexte |
|---|---|---|---|
| Socle `_sitePut`/`_siteDelete` (L1136/1142) + ses 12 appels (annonces, config, brevet, taxonomie, textes, publication site/<niv>) | 2 déf. | `then→cb(true)` même sur 500/401 ; `catch→cb(false)` | prof |
| Éditeur d'arborescence : `addChapter, addSeance, addItem, editTitle, deleteChapter/Seance/Item, _swapOrdre, resetChapitres` | 12 | `.then(reload)` aveugle — un refus recharge sans un mot | prof |
| **Publication en cascade** `_applyPubCascade` (fonction locale `purge`/`put`) | 2 boucles | **`catch` vide** — publier/dépublier peut échouer en silence : les élèves ne voient pas ce que Paul croit publié | prof |
| Bouton LIER `applyLinkChanges` | 3 | `Promise.all.then` **sans catch** : met à jour l'état local et ferme la modale même si le serveur a refusé (rejet non géré) | prof |
| Galerie/upload Drive côté Firebase (`uploadFileForChapterItem`, `addImageToGallery`, `convertItemToGalleryAndAdd`, `uploadFileForNewItem`, `_createGalleryItemWithFirstImage`, `renameImageInGallery`, `deleteImageInGallery`) | 9 | `.then` aveugle | prof |
| Canal Apps Script / Drive (POST `APPS_SCRIPT_URL` : `_uploadBlobToDrive`, `trackLogin`, `loadDocsList_`, `uploadFile_`, `uploadFileToSection_`, `deleteDoc_`, `showBigFileGuide_`, `associateBigFile`) | 8 | then/catch de qualité variable ; réponse **métier** JSON à interpréter en plus du HTTP | prof (upload) + élève (trackLogin) |
| Classes (`submitCreateClass✓, renameClass, archiveClass, unarchiveClass, deleteClass, togglePublishTab, togglePublishExtra`) | 7 | 1 vérifiée (alert), 6 aveugles | prof |
| Élèves & codes (`_putCode, _importEleves, _deleteEleveCls×2`) | 4 | **catch vides** | prof |
| **Écran élève** : `ensureEleveUuid` (login élève, 2 PUT) | 2 | then/catch → uuid local de repli, silencieux | **élève** |
| Télémétrie/présence (`notifyConnection` ntfy, `updatePresence`, `saveIntent`, `closeIntentSurvey`, `sendToBackend`) | 5 | catch vides | mixte |
| Manifeste `publierManifesteREST` | 1 | catch vide (au chargement) | système |
| Corbeille `_fbPutPath`/`_fbDeletePath` (+ `_corbeillePuis` : LE patron du choix offert) | 2 | `throw !ok` ✓ mais **binaire** (refus/panne confondus dans le même catch) | prof |
| Atelier `atSitePut`/`atSiteDelete` | 2 | `r.ok` ✓ mais **binaire** | prof |

**Constat de périmètre à porter** (vérifié) : **hors `_site*`, AUCUNE des 58 écritures directes n'est routée par le mode test** — en mode test, l'éditeur d'arborescence, la publication, les classes, les codes écrivent au hub RÉEL. Je propose de l'inscrire au relevé d'impact comme constat (réparation = M-MODETEST, au plan), pas de l'élargir à ce morceau (§Q6).

## 2 · Le mécanisme des trois issues — forme proposée (socle → 1.2.0)

**Au bloc socle MJPC-CORE embarqué** (section nommée, verbatim, zéro dépendance) :

```js
// Trois issues d'une écriture — jamais deux (« erreur ») ni une (« fait »).
var MJPC_ISSUE={ACCEPTEE:"acceptee", REFUSEE:"refusee", PANNE:"panne"};
// Le classeur d'issues pour le transport REST : la SEULE source de vérité.
// resolve + r.ok  → ACCEPTEE
// resolve + !r.ok → REFUSEE  (définitif : règle de sécurité, chemin invalide, charge rejetée)
// reject          → PANNE    (temporaire : liaison — une file pourra s'y brancher plus tard)
function mjpcEcrireRest(url, options, cb){ /* fetch(url,options) → cb(issue) */ }
// issue = { etat:MJPC_ISSUE.*, status:<int|0>, url:<string>, quand:<ts> }
```

**Dans `index.html`** : `_sitePut(chemin, valeur, cb)` et `_siteDelete(chemin, cb)` réécrits SUR ce mécanisme, **signature rétrocompatible** : `cb(ok, issue)` — `ok===true` seulement si ACCEPTÉE (les 12 appels existants, qui ne lisent que `ok`, restent justes sans retouche : refus et panne y redeviennent `false`, ce qui répare déjà leur mensonge) ; `issue` permet aux écrans d'afficher le bon message. Le routage mode test est conservé tel quel (magasin → `cb(true,{etat:ACCEPTEE,status:0})`, **aucune fausse alerte**, prouvé au parcours). `atSitePut`/`atSiteDelete` deviennent des **délégations pures** au mécanisme (leurs 6 appels inchangés) ; `_fbPutPath`/`_fbDeletePath` passent au classeur (le `catch` de `_corbeillePuis` reçoit l'issue et son message distingue enfin refus/panne).

**L'affichage commun** (section nommée, réutilise le vocabulaire visuel existant `at-etat`/`at-etat-ok`/`at-etat-echec`, patron `_corbeillePuis` pour l'échec-choix) :
- `mjpcIndicateurEcriture(zone)` — l'indicateur d'état par écran : « Enregistrement… » → « Enregistré à HH:MM » / message d'échec selon l'issue. **Jamais « enregistré » avant le verdict.**
- **Regroupement anti-rafale** : un collecteur par page agrège les échecs sur une fenêtre glissante ; au-delà de 1, un seul bandeau : « N enregistrements n'ont pas abouti depuis HH:MM » avec le détail dépliable (ⓘ cliquable) et un « Réessayer » global. Réessayer = **ré-émettre ponctuellement chaque écriture avec sa valeur courante** — pas de file d'attente, pas de mémoire de pannes (objet distinct, hors périmètre, §Q4).
- Les gestes destructifs gardent le patron `_corbeillePuis` : l'échec est un choix offert, l'option sûre nommée.

## 3 · Le tri proposé (traiter / laisser, nommément)

**TRAITER (trois issues + affichage)** : socle `_site*` et ses 12 appels · éditeur d'arborescence (12) · publication en cascade (2 boucles — **le plus grave côté pédagogique**) · LIER (3) · galerie (9) · classes (6 restantes, et `submitCreateClass` harmonisé de `alert` vers l'indicateur commun) · élèves & codes (4) · corbeille (2, passage au classeur) · atelier (2, délégation) · canal Apps Script d'upload (6 : geste prof explicite avec indicateur visuel existant — verdict métier : ACCEPTÉE = HTTP ok ET réponse `{status:'ok'}` ; REFUSÉE = HTTP !ok OU réponse métier en erreur ; PANNE = reject) · `ensureEleveUuid` (**écran élève** : texte au flux impersonnel, voir §5).

**LAISSER, avec justification nommée** :
- `notifyConnection` (ntfy.sh) — notification push d'agrément vers le téléphone de Paul : son échec ne perd aucune donnée métier ; l'alerter transformerait chaque connexion en source d'alarmes. `catch` vide **légitime**.
- `updatePresence` — battement de présence répété (boucle) : un échec est rattrapé par le battement suivant ; alerter = rafale garantie. Légitime (je vérifierai la période réelle au code).
- `trackLogin` / `sendToBackend` — télémétrie d'usage Apps Script (dont `sendBeacon` à la fermeture, par nature sans réponse). Légitime.
- `saveIntent` / `closeIntentSurvey` — sondage d'intention : à confirmer (§Q7) ; ma proposition : télémétrie, laisser.
- `publierManifesteREST` — au chargement, systémique : un échec ne doit pas ouvrir de modale à chaque visite ; M16-0 contrôle les manifestes. Proposition : verdict silencieux à l'écran, mais **compté dans le bloc DIAGNOSTIC** (§Q3).

## 4 · Le relevé d'impact — méthode (livrable de premier rang)

**① Ce qui échoue déjà en silence** : audit statique (tous les chemins d'écriture reconstruits et vérifiés — slash initial, concaténations, motif exact du défaut `seanceSansDoc` ; les lignes `//` écartées d'abord, piège de l'exemple commenté) **+** parcours réel instrumenté : interception réseau qui **laisse passer les lectures vers le vrai hub** et intercepte les écritures en les journalisant sans les émettre — je vois tout ce qui partirait, où, avec quelle charge, sans rien écrire. **Datation** : `git log` de la production sur chaque défaut trouvé (pagination épuisée, règle ②), au commit près, avec « la fonctionnalité que Paul croit avoir ».
**② Pire cas « toute écriture refusée »** : interception qui répond **401 à toute écriture, avec `Access-Control-Allow-Origin:*`** (piège documenté : sans cet en-tête, depuis `file://`, tout devient panne et les `catch` masquent) ; lectures réelles. Tous les parcours joués **écran par écran, prof et élève** — c'est à la fois le relevé pour Paul (le message exact + la conduite offerte, classés PAR ÉCRAN, lisibles comme un plan de test) et le banc de recette du mécanisme.
**③ Écritures depuis un écran élève** : côté `index.html` : `ensureEleveUuid` (login), `updatePresence`, `trackLogin` — traitées en priorité ; côté apps (hors périmètre de code) : inventaire par grep de commande sur les 9 apps, **inscrit au relevé sans y toucher** (M-ÉCHECS-2), avec mention explicite de toute écriture d'app manifestement déjà cassée si j'en croise.
**Les trois issues seront jouées pour de vrai au rapport** : un succès (nœud de test réel du hub), un refus (401 forgé CORS-correct), une panne (abort réseau) — captures des trois affichages.

## 5 · Textes proposés — SOUMIS (rien de décidé)

**Côté professeur** (ferme, daté, sans euphémisme — « je suis un professionnel ») :
- Refus : « **Écriture refusée par la base (HTTP 403) à 14 h 03 — rien n'est enregistré.** Un refus n'est pas une panne : réessayer ne changera rien. Cause probable : règles de sécurité ou chemin invalide. »
- Panne : « **Pas de liaison à 14 h 03 — rien n'est parti.** La modification reste sur cet écran. Réessayer »
- Regroupé : « **3 enregistrements n'ont pas abouti depuis 14 h 02.** Détail · Tout réessayer »
- Corbeille (adaptation du texte existant de `_corbeillePuis`, deux causes distinguées) : refus → « ⚠ La corbeille a été **refusée** par la base — continuer SANS archive ? (annuler = rien n'est détruit) » ; panne → « ⚠ La corbeille n'a pas répondu — continuer sans archive ? (annuler = rien n'est détruit) ».
**Côté élève** (flux impersonnel, zéro jargon — ni serveur, ni requête, ni réseau, ni synchronisation) :
- `ensureEleveUuid` en échec : « **La connexion n'a pas abouti. Réessaie dans un instant.** » (aucune donnée de travail perdue à cet endroit ; le texte ne met personne en position de manque).
**Mode test** : bandeau existant inchangé ; aucune alerte d'écriture ne peut s'y déclencher (prouvé au parcours).

## 6 · Questions au feu vert

**Q1 — Version du socle d'index.** Le bloc embarqué d'`index.html` est en **1.0.0** (sans le §8 du canon 1.1.0 — vérifié : aucune fonction §8 nulle part dans le fichier, il n'en a pas l'usage). Passer ce bloc en « 1.2.0 » sans y embarquer §8 créerait deux « 1.2.0 » différents selon l'app, contre la doctrine « identique partout ». Ma proposition : **embarquer le canon entier** (1.0.0 + §8 + trois issues = 1.2.0), fonctions §8 inertes dans index (préuve par grep : zéro collision). Alternative si tu la préfères : numéroter le mécanisme seul et laisser le bloc en 1.0.0+extension — je m'y opposerais (versions illisibles).
**Q2 — Le canon `mjpc-core.js` au dépôt** : je livre aussi sa version 1.2.0 au sas dans la même livraison (petit coût, le canon reste la source), ou index seul et le canon suit M-ÉCHECS-2 ?
**Q3 — `publierManifesteREST`** : verdict silencieux + compteur au bloc DIAGNOSTIC te convient-il, ou veux-tu un signal visible ?
**Q4 — « Réessayer »** : ré-émission ponctuelle de l'écriture avec la **valeur courante de l'écran** — je confirme que ce n'est PAS la file d'attente interdite (aucune mémoire de pannes, rien en arrière-plan). Valide la frontière.
**Q5 — Canal Apps Script** (upload Drive) : je le traite comme transport à part avec verdict métier (HTTP **et** réponse `{status}`) — dans le périmètre ?
**Q6 — Mode test non couvrant** (56 écritures directes ignorent le magasin) : constat au relevé d'impact, réparation à M-MODETEST — ou veux-tu que ce morceau route aussi ces écritures ? Ma position : constat seulement (routage = objet propre, gros, risqué en même temps que celui-ci).
**Q7 — `saveIntent`/`closeIntentSurvey`** : télémétrie à laisser silencieuse ?
**Q8 — `_siteGet`** (dette connexe citée par le prompt) : mon classeur d'issues couvre les écritures ; la lecture n'en profite **pas** gratuitement (autre signature, autre usage). Je le dis au rapport et n'y touche pas, sauf ordre contraire.

## 7 · Ce que je ferai après le feu vert (rappel du circuit)

Base re-téléchargée à l'instant de l'édition · section socle 1.2.0 + section affichage nommées · application aux 52 écritures traitées, inventaire ligne à ligne au rapport · relevé d'impact 3 volets · trois issues jouées et capturées · double parseur avec comptes · diff classé + invariants md5 · parcours de bout en bout (prof + élève + mode test) · mobile 390 mesuré · pastille **8.7.0** (proposition : changement de socle = mineure, pas micro) · livraison sas : `index.staging.html`, `M-ECHECS-1-rapport.md`, `M-ECHECS-1-impact.md`, captures.
