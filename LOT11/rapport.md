# LOT ⑪a — LE GESTE D'ENVOI ABOUTIT : une seule vérité, un seul écrivain

**Découpage (validé)** : ⑪a = ①+② (ce rapport, pastille 8.56.0) ; ⑪b = ③+④+⑤ s'empile (8.56.1). La promotion emportera les deux.

**Base vérifiée** : production 1 003 600 o, md5 `3a34823d3c8b087186b6c747541d7bb7` (8.55.1), re-téléchargée. **Livré** : `LOT11/index.html` **1 006 811 o, md5 `bd1f5bfd26417259451a627918e60317`, pastille 8.56.0**, vérifié bit à bit. Dual parser vert à chaque édition ; banc à hub intercepté (snapshot du 18/08 : site 183 660 o + classes + codes + taxonomie), **0 écriture réelle, 0 exception** sur tous les parcours ; vue élève prouvée identique base↔lot (rayons langue 7 · brevet 3 · ancres 1 · ignores 1, 7 chapitres, les deux fichiers).

## Le cas réel de Paul — l'état du bug était INTACT au hub (aucune mutation)
La fiche « **Les différents registres** » (`feuille_1786256440919`) porte au hub réel : `depot` **absent**, `envoi` présent, rattachement 3e › ch10 › s2, et le document **`fiche-registres`** de la séance la pointe. (L'adresse s'affiche « Chapitre 1 › Séance 3 » — les rangs lisibles ; le mandat citait l'affichage.)

**AVANT (base 8.55.1, rejoué)** : « 📤 Envoyer aux élèves » → « la déposer dans la séance ? » → Déposer → **« Cette feuille est déjà déposée dans cette séance. »** → fin. **0 écriture.** Le geste ne peut jamais aboutir (captures avant-01, avant-02).

**APRÈS (8.56.0, même geste, même fiche)** : « 📤 Envoyer aux élèves » → **réparation silencieuse** (`PUT …/depot` avec l'itemId réel `fiche-registres` — et le `rattachement` existant **préservé**, non réécrit) → **la modale d'envoi s'ouvre** (le geste est délibéré : le message se choisit) → Envoyer → `PUT /site/atelier/envois/<ref>` + `PUT /site/atelier/documents/<ref>` — **les écritures d'`atEnvoyerVersion`, aucune autre**. `AT.doc.depot` posé en mémoire. (captures apres-01, apres-02 ; 390 px : apres-05, boutons 44 px.)

## ① Une seule vérité : le document du chapitre fait foi
- **`atFeuilleDeposee(docId,doc)`** (755 o, neuve) — LA lectrice : si les chapitres du niveau sont chargés, `atItemPointant` fait foi (un `depot` qui pointe un document disparu est un mensonge → « pas déposée ») ; sinon, repli sur `depot`. Utilisée par `atEnvoyerClic` et par la garde d'`atEnvoyer`.
- **`atDeposerFeuille` ne s'arrête plus** : document pointant → **réparation** (`atFeuilleDepotPoser`) et réponse vraie ; sinon `itemCreer` puis `atFeuilleDepotPoser`. **Ordre sûr inversé** : le document d'abord, l'envoi après — un document sans envoi se détecte (garde LOT7b-③) ; un envoi sans document était invisible (l'ancien ordre écrivait l'envoi en premier).
- **Aucun refus muet** : chaque sortie sans envoi porte sa cause à l'écran (« Le document n'a pas pu se créer dans la séance — rien n'a été envoyé. Réessaie le dépôt. » · « La feuille n'a pas d'adresse : choisis niveau, chapitre et séance d'abord. » — prouvé) et le détail technique en console (`console.warn`, réparation de `depot` échouée = jamais bloquante : le document du chapitre fait foi).

## ② Un seul écrivain des envois : `atEnvoyerVersion`
- **`atDeposerFeuille` n'écrit PLUS l'envoi** (son écriture directe de `AT_ENVOIS_NOEUD` est retirée — la charge était déjà au même format `{meta,doc}`, aucune migration).
- **`atEnvoyerParDefaut(docId,doc,cb)`** (434 o, neuve) — le dépôt envoie « sans cérémonie » : message par défaut (`atEnvoiDefautLire`), `premier=!doc.envoi`, TOUJOURS par `atEnvoyerVersion`.
- **Q1 appliquée** : dépôt spontané/proposé → `atProposerDepot()` sans suite → dépôt puis envoi par défaut, atInfo « **Déposée et envoyée aux élèves — ils verront cette version quand la séance sera publiée.** » (prouvé : écritures `items/<id>` + `depot` + `envois/<ref>` + `documents/<ref>`, capture apres-03) ; geste « Envoyer aux élèves » → `atProposerDepot(suite=atEnvoyer)` → dépôt puis **la modale de message**, comme tout envoi délibéré. `atDeposerToutes` (« Les déposer ») enchaîne l'envoi par défaut pour chaque feuille.
- **Échec d'envoi APRÈS dépôt : dit** — « ⚠ Déposée, mais l'envoi n'a pas pu s'écrire — utilise « Envoyer aux élèves » pour réessayer. » (prouvé au mur d'écriture, capture apres-04).

## Un défaut attrapé au banc et corrigé dans le lot (déclaré)
`atFeuilleDepotPoser` ne lisait la feuille que dans `LINK_ATELIER_DOCS` (vide dans l'atelier) : sa garde anti-écrasement du `rattachement` ne voyait pas l'adresse existante et la **réécrivait** (mesuré : les champs `classe`/`classeNom`/`eleve` du rattachement réel de la fiche des registres étaient perdus). Correctif d'une ligne : depuis l'atelier, la feuille vivante `AT.doc` entre dans la lecture — l'écrivain reste unique, la garde retrouve sa vue. Rejoué : `rattachement` **non réécrit** sur le cas réel.

## Tailles (déclaration→déclaration)
`atFeuilleDeposee` **755 (neuve)** · `atEnvoyerParDefaut` **434 (neuve)** · `atDeposerFeuille` 2 667→2 344 (l'écriture d'envoi retirée) · `atProposerDepot` 574→1 351 · `atEnvoyerClic` 301→938 · `atEnvoyer` 2 278→2 481 (garde) · `atDeposerToutes` 1 255→1 426 · `atFeuilleDepotPoser` 1 879→2 175 (la ligne de source vivante + commentaire). 2 neuves, 0 retirée, aucun chemin d'écriture nouveau, `published` intouché (prouvé sur toutes les écritures captées).

## Textes soumis à Paul (⑪a)
① « Déposée et envoyée aux élèves — ils verront cette version quand la séance sera publiée. » ② « ⚠ Déposée, mais l'envoi n'a pas pu s'écrire — utilise « Envoyer aux élèves » pour réessayer. » ③ « ⚠ Le document n'a pas pu se créer dans la séance — rien n'a été envoyé. Réessaie le dépôt. » (l'ancien disait « L'item n'a pas pu se créer. La version envoyée est écrite… » — l'ordre sûr rend la seconde phrase fausse, et « item » → « document » anticipe ⑤). Le message « déjà déposée » disparaît avec sa cause.

## Captures (`LOT11/captures/`)
avant-01 (le clic propose le dépôt) · avant-02 (« déjà déposée », 0 écriture — le cul-de-sac) · apres-01 (le même clic ouvre la modale d'envoi, réparation faite) · apres-02 (envoyé — écritures d'`atEnvoyerVersion`) · apres-03 (dépôt spontané : « Déposée et envoyée aux élèves ») · apres-04 (l'échec dit sa cause) · apres-05 (390 px).

## Dettes
Aucune nouvelle. ⑪b suit (③ retrait de la zone « À classer » + select ré-émetteur, ④ symétrie « envoyé mais pas encore ouvert », ⑤ vocabulaire « ligne »→« document », liste intégrale soumise).

---

# LOT ⑪b — la zone « À classer » disparaît, le type se décide dans l'éditeur, le vocabulaire de Paul

**Base** : le sas 8.56.0 (1 006 811 o, `bd1f5bfd26417259451a627918e60317`). **Livré** : `LOT11/index.html` **1 001 241 o, md5 `770dbe3afebdf758621e08c832ba34ac`, pastille 8.56.1**, vérifié bit à bit. Dual parser vert ; banc 0 écriture réelle, 0 exception ; vue élève identique base↔8.56.1 (rayons 7·3·1·1, 7 chapitres, les deux fichiers).

## ③ Le retrait — avec ses preuves d'inatteignabilité
Retirés : **`atCtrlNonRangees`** (2 286 o, bloc avec sa fonction interne `ligne`), **`atCtrlEnvoyer`** (678 o), **`atCtrlOuvrirItem`** (221 o), l'appel dans `atRendreChapitres`, le paquet CSS **`.at-nr*`** (7 règles, 653 o), la branche `[LOT9-⑧] else if(...atRendreListe...)` d'`itemProduitPoser` (le re-rendu du panneau). **Preuves** : `atCtrlEnvoyer` et `atCtrlOuvrirItem` n'étaient appelées QUE par le HTML généré par `atCtrlNonRangees` (l.11145/11156/11157 de la base) ; `atCtrlNonRangees` n'était appelée QUE par `atRendreChapitres` (l.11195) ; après retrait, **0 occurrence** de chacun dans le fichier (grep), et plus aucune règle `.at-nr` (2 mentions restantes = commentaires d'histoire). Un commentaire de `collectRayons` qui les citait est ajusté. **CONSERVÉS, prouvés vivants** : `itemProduitPoser`/`atFeuilleProduitPoser` (écrivains), le menu de type de l'éditeur (`itemProduitMenu`, l.12782) et de la carte de feuille (`atProduitMenu`, C5-AR), le rangement par type des onglets, toutes les détections de ④. ⚠ Incident de tour déclaré : un premier ancrage de découpe avait emporté 712 Ko — attrapé AVANT tout push par le compte de fonctions du bloc, refait au cordeau depuis la base saine (le fichier livré est propre, tailles à l'appui).

## ③ Le menu de type entend la re-sélection
`_produitSelectHTML` 376→1 036 o : au **focus**, la sélection s'efface (étiquette « Produit… ») ; choisir — même le type d'avant — redevient un vrai `change` ; refermer sans choisir **restaure** l'affichage (`onblur`). Même écrivain (celui passé en paramètre), rien d'écrit si la valeur est vide. **Prouvé au banc** : re-choisir `support_cours` déjà en place → `PUT …/items/tableaux/produit` capté (capture b-02). Vaut pour les DEUX menus (éditeur + carte de feuille), même gabarit.

## ④ La symétrie existait — contestation sourcée de la mesure « 0 occurrence »
L'état « **envoyée, pas encore ouverte** » est DÉJÀ détecté et affiché sur le document dans l'éditeur (`atEditerChapitreRendre`, branche `!_p&&_envAt`, + `edEnvoiInfo('envoye-non-publie')` : « Envoyée mais pas publiée : la version est prête… ») — signalement sobre, sans action forcée, exactement la demande. **Prouvé au banc** : la fiche des registres dépubliée (mutation du snapshot, `published:{}`) affiche « envoyée, pas encore ouverte » ⓘ (capture b-03). Rien n'a été codé en doublon ; les détections « ouvert jamais envoyé » (garde `edPublierItem`, bandeau de lecture, lot `edFeuillesJamaisEnvoyees`) fonctionnent après ③ — **l'envoi en lot prouvé** : « ✉ Envoyer les 2 feuilles jamais envoyées » → exactement `PUT envois/<ref>`+`PUT documents/<ref>` ×2 par `atEnvoyerVersion` (captures b-04, b-05). Les **deux propositions automatiques** post-enregistrement rejouées : dépôt (« la déposer dans la séance ? », b-06) et envoi (« …jamais été envoyée aux élèves — ils ne peuvent pas l'ouvrir. L'envoyer ? », b-07).

## ⑤ Le vocabulaire — restreint (Q2), liste intégrale ancienne → nouvelle (textes soumis à Paul)
« publier/publication » CONSERVÉS (vocabulaire de Paul) ; « ouvert aux élèves » existant conservé ; seul l'OBJET change. Cinq chaînes, aucune autre occurrence de « ligne »-objet dans les textes d'ouverture/envoi (inventaire par balayage, faux positifs écartés : « en ligne », « un élève par ligne », formes techniques `*_ligne`) :
1. Carte de feuille (tooltip ⚠) : « …la **ligne** s'ouvre sur rien… » → « …le **document** s'ouvre sur rien… »
2. ⓘ publiée-sans-envoi : « la **ligne** apparaît aux élèves » → « le **document** apparaît aux élèves »
3. ⓘ envoyée-non-publiée : « ne voient pas encore la **ligne** » → « …pas encore le **document** »
4. ⓘ ni-ni : « la publication ouvre la **ligne** » → « la publication ouvre le **document** »
5. Garde d'edPublierItem : « publier **sa ligne** maintenant, c'est leur montrer **un document** qui ne s'ouvre sur rien » → « publier **ce document** maintenant, c'est leur montrer **une fiche** qui ne s'ouvre sur rien »
(⑪a avait déjà porté « L'item n'a pas pu se créer » → « Le document n'a pas pu se créer ».)

## Tailles (8.56.0 → 8.56.1)
`atCtrlNonRangees` 2 286→**retirée** · `atCtrlEnvoyer` 678→**retirée** · `atCtrlOuvrirItem` 221→**retirée** · CSS `.at-nr*` −653 o · `atRendreChapitres` 2 235→2 215 · `itemProduitPoser` 989→751 · `_produitSelectHTML` 376→1 036 · `edEnvoiInfo` 1 062→1 071 (« ligne »→« document ») · `edPublierItem` 2 769→2 770. 0 fonction neuve, 3 retirées avec preuves, `published` intouché.

## Captures ⑪b (`LOT11/captures/`)
b-01 l'atelier sans la zone (desktop) · b-02 le select qui écrit à la re-sélection · b-03 « envoyée, pas encore ouverte » · b-04/b-05 l'envoi en lot (modale, envoyé) · b-06/b-07 les deux propositions automatiques · b-08 390 px.

## Dettes
Aucune nouvelle. Textes soumis à Paul : les 5 chaînes ⑤ ci-dessus + les 3 de ⑪a. Cahier des charges post-⑪ inchangé (ex-LOT ⑩ : impression/densité, images de feuille, suppression Drive).
