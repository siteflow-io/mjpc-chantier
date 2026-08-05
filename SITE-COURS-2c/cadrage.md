# SITE-COURS-2c — CADRAGE (TEMPS 1)
**L'arrivée des feuilles : dépôt, statut, envoi aux élèves.**
Exécutant SITE-COURS-2c, sous conscience n°5 · 05/08/2026

BASE mesurée : production 749 771 o, md5 `9f13a070e024aa41530ec140dd09971d`, pastille 8.28.0 — conforme à l'attendu.

## 1 · Architecture de l'envoi (proposition, contrainte respectée)

**Deux nœuds, deux rôles** :
- `/site/atelier/documents/<ref>` — le **vivant** (inchangé) : c'est l'éditeur de Paul.
- `/site/atelier/envois/<ref>` — la **version envoyée** : `{meta:{envoyeLe, versionDoc, message, premier:true|false}, doc:<copie complète du vivant à l'envoi>}`.

**Le viewer (2b) ne change pas de principe** : `openAtelierItem` lit désormais `secuLire('site/atelier/envois/'+ref)` et rend `.doc` — l'envoi change **ce qui est référencé**, pas le mécanisme. Une seule lecture à l'ouverture (B① de 2b préservé, côté prof comme côté élève : le viewer du site montre à Paul exactement ce que voient les élèves ; son brouillon vivant reste dans l'atelier). Les briques à venir (résultats, aménagements) se calculeront toujours à l'ouverture, sur `.doc`.

**Métas dénormalisées dans le vivant** (pour que cartes et rappels ne coûtent aucune lecture de plus) : au dépôt, le doc gagne `depot:{niveau,chapitre,seance,itemId,le}` ; à chaque envoi, `envoi:{envoyeLe,versionDoc}`. Ordre d'écriture : le nœud de vérité d'abord (`envois/<ref>` ou l'item), la méta ensuite ; si la 2e échoue, message, rien de perdu. Vérité terrain toujours recroisée avec `chapitresData` (l'item existe-t-il encore) — hub muet → « adresse non vérifiable pour l'instant ».

**Message élève daté** : bandeau rendu par le viewer AU-DESSUS du document (dans l'overlay, hors iframe — il ne s'imprime pas ; si Paul le veut imprimable, une ligne à déplacer, à trancher sur captures). Affiché seulement si `meta.message` non vide ; le premier envoi (dépôt) écrit `premier:true, message:''`. Défaut du libellé : `/site/atelier/config/messageEnvoiDefaut` (créé au premier envoi s'il n'existe pas), texte par défaut : *« Cette fiche a changé le <date> — reporte les changements sur ta fiche du cahier. »* La modale d'envoi porte un textarea prérempli (patron des modales atelier) + case « Faire de ce texte le nouveau message par défaut » (écrasement du défaut : demande explicite uniquement).

## 2 · Les cinq objets — chemins retenus

① **Proposition de dépôt** — accrochée dans `atEnregistrerMaintenant` après le PUT réussi : si adresse complète (niveau+chapitre+seance) ET chapitres du niveau chargés ET aucun item de la séance ne pointe `ref` ET pas déjà proposé dans cette session d'édition (`AT.propositionDepotFaite`), alors `atModaleChoix` : *« Cette feuille est adressée à 3e › Chapitre 1 › Séance 8 — la déposer dans la séance ? »* [Déposer] [Plus tard]. Déposer = `atDeposerFeuille` (voir écrivain unique ci-dessous) **+ premier envoi** (`envois/<ref>` écrit dans le même geste : un item déposé n'est jamais vide pour l'élève). « Plus tard » pose le drapeau de session, rien d'autre.

**Écrivain unique (mesuré)** : le cœur d'`addItem` (slug, ordre max+1, collision -2, `mjpcPutJson` vers `…/items/<id>.json`, maj locale, re-render) est **extrait** en `itemCreer(level,chnum,snum,title,props,cb)` ; `addItem` devient prompt + `itemCreer` (décroissance déclarée : extraction du cœur partagé, seule alternative au second écrivain interdit) ; `atDeposerFeuille` appelle `itemCreer` avec `{source:'atelier', ref, kind:'doc'}`. Deux dépôts de la même feuille : refus doux (« Cette feuille est déjà déposée dans cette séance »). Séance sans nœud `items` : le cœur gère déjà (`items={}`).

② **Rappel côté progression** — dans `renderSeance`, mode admin seulement : si des feuilles adressées à cette séance n'y sont pas déposées → ligne discrète « N feuille(s) de l'atelier adressée(s) à cette séance — [Les déposer] ». Besoin des docs hors atelier : **une** lecture `atSiteGetDocs` au premier rendu admin, cache partagé avec `AT.liste`, rafraîchi par les gestes de l'atelier. [Les déposer] enchaîne `atDeposerFeuille` par feuille, garde nominative de 2b réutilisée telle quelle si `rattachement.eleve` nominatif.

③ **Statut sur les cartes** (`atRendreListe`) : « Sans adresse » · « Adressée à … — pas encore déposée » · « Déposée dans … » · « Déposée dans X · adresse actuelle Y » (croisement `depot` ↔ `rattachement`, jamais de déplacement silencieux) · « modifiée depuis l'envoi aux élèves » (`dates.versionDoc > envoi.versionDoc`) · hub muet → « adresse non vérifiable pour l'instant ».

④ **Supprimer sans archiver** — `atSupprimerDoc` : 3e choix `{danger}` « Supprimer sans garder de copie » à côté de « Mettre à la corbeille puis supprimer » (inchangé, par défaut) et « Annuler ». Si la feuille est **déposée** : garde « prévenu, pas bloqué » en amont, texte : *« Cette feuille est déposée dans <adresse>. La supprimer retire aussi la version que voient les élèves : l'item du cours affichera "document plus disponible". Supprimer quand même ? »* — la suppression (les deux chemins) supprime `documents/<ref>` ET `envois/<ref>` (proposition : la version envoyée suit la feuille ; l'item devient mort, message doux du viewer 2b déjà en place). Aucune suppression automatique.

⑤ **Envoi** — bouton « Envoyer aux élèves » permanent dans l'éditeur (barre du doc). Proposition automatique : dans `atEnregistrerMaintenant`, si déposée ET `atEnvoiEcart(vivant, envoi) ≥ seuil` ET pas déjà proposé cette session → *« Cette fiche a bien changé depuis la version que voient les élèves — leur envoyer la nouvelle ? »* [Envoyer…] [Plus tard]. **Mesure d'écart** `atEnvoiEcart` : compte les champs de valeurs dont le texte diffère + les cases basculées + les blocs de contenu ajoutés/retirés/modifiés (comparaison par bloc, codepoints). **Seuil proposé : nb ≥ 3** (à valider sur captures). Commentaires obligatoires posés à cette fonction : « À RATTACHER AU COCKPIT (M-PILOTAGE) » et « ÉVOLUTION PRÉVUE : identifier précisément ce qui a changé (champ par champ) et classer l'alerte par degrés d'importance — pour l'instant, mesure globale seulement. »

## 3 · Fonctions touchées (tailles de base mesurées)

Modifiées : atEnregistrerMaintenant 689 · addItem 1 190 (extraction du cœur, décroissance déclarée) · atSupprimerDoc 1 369 · atRendreListe 3 391 · renderSeance 3 264 · openAtelierItem 1 534 · atChargerListe 262 (cache partagé). HTML : bouton « Envoyer aux élèves » dans la barre de l'éditeur. Nouvelles : itemCreer · atDeposerFeuille · atEnvoyer (modale + écritures) · atEnvoiEcart · atStatutFeuille · atFeuillesAdresseesA (pour ②) · atEnvoiDefautLire. CSS : bandeau du message élève + ligne de rappel + statuts de carte. Pastille → 8.29.0. 0 supprimée.

## 4 · Textes soumis à Paul

1. Dépôt : « Cette feuille est adressée à <niveau> › Chapitre <n> › Séance <n> — la déposer dans la séance ? » [Déposer] [Plus tard]
2. Rappel : « N feuille(s) de l'atelier adressée(s) à cette séance — [Les déposer] »
3. Statuts : « Sans adresse » / « Adressée à … — pas encore déposée » / « Déposée dans … » / « Déposée dans X · adresse actuelle Y » / « modifiée depuis l'envoi aux élèves » / « adresse non vérifiable pour l'instant »
4. Proposition d'envoi : « Cette fiche a bien changé depuis la version que voient les élèves — leur envoyer la nouvelle ? »
5. Message élève (défaut) : « Cette fiche a changé le <date> — reporte les changements sur ta fiche du cahier. » + case « Faire de ce texte le nouveau message par défaut »
6. Garde suppression déposée : texte du §2-④ · Double dépôt : « Cette feuille est déjà déposée dans cette séance. »

## 5 · Plan de preuve (banc, chemin réel, hub intercepté, zéro écriture réelle)

P1 dépôt proposé à l'enregistrement → item créé par l'écrivain unique + premier envoi écrit, élève ouvre l'item non vide sans message. P2 modifications < seuil → rien ; ≥ 3 → proposition ; « Envoyer… » → modale, message édité, `envois` remplacé, méta à jour ; élève voit LA version envoyée + bandeau daté ; le vivant retravaillé n'y change rien. P3 statuts des cartes (les 6 états, dont ré-adresse après dépôt et « modifiée depuis l'envoi »). P4 rappel ② + [Les déposer] + garde nominative. P5 suppression : sans copie · déposée (garde enrichie, envois supprimé, item mort → message doux du viewer) · corbeille inchangée par défaut. P6 cas limites : jamais ré-envoyée (l'élève voit la version du dépôt) · double dépôt refusé · séance sans items · hub muet · apostrophes codepoints · B① rejoué (une seule lecture élève, vers envois) · mode test B②. Captures desktop + 390 px, dont l'écran élève avec le message daté.

## 6 · Questions au feu vert

Q1 — Le bandeau du message élève **hors iframe** (ne s'imprime pas) : confirmé, ou imprimable ?
Q2 — La suppression d'une feuille déposée supprime aussi `envois/<ref>` (l'item devient mort) : confirmé ?
Q3 — Le rappel ② charge les docs une fois par session admin (cache partagé AT.liste) : confirmé ?

**STOP — attente du feu vert de la conscience n°5.**
*[exécutant SITE-COURS-2c]*
