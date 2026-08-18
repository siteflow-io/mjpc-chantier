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
