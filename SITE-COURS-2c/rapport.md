# SITE-COURS-2c — RAPPORT DE LIVRAISON
**L'arrivée des feuilles : dépôt, statut, envoi aux élèves.**
Exécutant SITE-COURS-2c, sous conscience n°5 · 05/08/2026

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.28.0) | 749 771 o | `9f13a070e024aa41530ec140dd09971d` |
| LIVRÉ (8.29.0) | 767 559 o | `3cf2d409bf62d0b4d318a1605b95ed84` |

Double parseur (acorn + node --check) : **VERT** sur base et livré.

## 2 · Architecture livrée (conforme au cadrage validé)

- `/site/atelier/documents/<ref>` reste le **vivant** ; `/site/atelier/envois/<ref>` porte la **version envoyée** : `{meta:{envoyeLe, versionDoc, message, premier}, doc:copie}`.
- Le viewer (2b) garde son principe et change de cible : **une seule lecture** vers `envois` (B① rejoué au banc, côté prof comme élève). Si `envois` est absent (feuille supprimée), message doux existant « Ce document n'est plus disponible ».
- Métas dénormalisées dans le vivant : `depot:{niveau,chapitre,seance,itemId,le}` au dépôt, `envoi:{envoyeLe,versionDoc}` à chaque envoi. **Ordre vérité-d'abord** : `envois` → item → méta ; chaque échec intermédiaire a son message, rien n'est perdu en silence.
- **Exigence B honorée** : aucun compteur inventé — la version du vivant est `dates.modifieLe` (timestamp existant posé par `atMarquerModifie` à chaque geste), recopiée dans `envoi.versionDoc` à l'envoi. « Modifiée depuis l'envoi » = `dates.modifieLe > envoi.versionDoc`.
- **Écrivain unique** : le cœur d'`addItem` est extrait en `itemCreer(level,chnum,snum,title,props,cb)` (slug, ordre max+1, collision `-2`, `mjpcPutJson`, mise à jour locale, re-rendu). `addItem` = prompt + `itemCreer` : c'est la **seule décroissance** (1 190 → 233 o), déclarée au cadrage. Le parcours ordinaire « + Nouvel item » est **rejoué au banc à l'identique** (exigence A, capture `pa_nouvel_item_ordinaire.png`).
- Bandeau du message élève **hors iframe** (Q1 confirmée) : il ne s'imprime pas ; la date d'édition du document reste la référence papier.
- Message par défaut : `/site/atelier/config/messageEnvoiDefaut` (créé au premier usage), jeton `<date>` substitué par la date du jour au préremplissage ; la case « Faire de ce texte le nouveau message par défaut » ré-insère le jeton avant d'écrire le défaut. Le défaut n'est **jamais** écrasé sans cette demande explicite.
- Seuil de proposition d'envoi : `AT_ENVOI_SEUIL = 3` (champs de valeurs différents + cases basculées + blocs modifiés, comparaisons strictes par codepoints). **À valider par Paul sur captures** (exigence C : `p2_modale_envoi_desktop.png`, `p2_eleve_bandeau_desktop.png`, `p2_eleve_bandeau_390.png`).
- Commentaires obligatoires posés à `atEnvoiEcart` : « À RATTACHER AU COCKPIT (M-PILOTAGE) » et « ÉVOLUTION PRÉVUE : identifier précisément ce qui a changé (champ par champ) et classer l'alerte par degrés d'importance — pour l'instant, mesure globale seulement. »
- `published` des séances : **jamais écrit** par ce morceau (vérifié au banc sur le journal des écritures). Rien d'automatique : chaque dépôt et chaque envoi est un clic de Paul.

## 3 · Suppression et corbeille (Q2 confirmée + exigence liée)

- La modale de suppression garde son chemin par défaut (« Mettre à la corbeille puis supprimer ») et gagne le bouton danger « **Supprimer sans garder de copie** » et « Annuler ». Aucune suppression automatique.
- Feuille **déposée** : garde « prévenu, pas bloqué » en amont — « Cette feuille est déposée dans <adresse>. La supprimer retire aussi la version que voient les élèves : l'item du cours affichera "document plus disponible". Supprimer quand même ? »
- Les deux chemins suppriment `documents/<ref>` **et** `envois/<ref>` (jamais de version fantôme).
- **Le chemin corbeille d'une feuille déposée archive LES DEUX** : `data:{doc:<le vivant>, envoi:<le nœud envois complet, meta+doc>}` (les feuilles non déposées archivent `data:{doc, envoi:null}`).
- **Restauration documentée** : restaurer = réécrire `/site/atelier/documents/<ref>` = `data.doc`, puis, si `data.envoi` est non nul, `/site/atelier/envois/<ref>` = `data.envoi`. L'item de la séance, s'il a été retiré entre-temps, se recrée par un dépôt ordinaire (les métas `depot` du doc restauré pointent l'ancienne adresse et le statut de carte signale toute divergence). Rien d'autre à reconstruire : les métas dénormalisées voyagent dans `data.doc`.

## 4 · Fonctions — inventaire complet (0 supprimée)

BASE 685 fonctions → LIVRÉ 698. **677 intactes** (md5 identique). **13 ajoutées** : itemCreer 1 225 · atAdresseLisible 429 · atItemPointant 424 · atDeposerFeuille 1 505 · atEnvoiEcart 939 · atEnvoiDefautLire 167 · atEnvoyerClic 307 · atEnvoyer 2 368 · atProposerDepot 510 · atStatutFeuille 1 347 · atFeuillesAdresseesA 370 · atDocsAssurer 255 · atDeposerToutes 638 o. **8 modifiées** (relues entières) :

| fonction | avant | après | objet |
|---|---|---|---|
| addItem | 1 190 | 233 | extraction du cœur → itemCreer (seule décroissance, déclarée) |
| atEnregistrerMaintenant | 689 | 1 797 | propositions dépôt/envoi après PUT réussi, une par session |
| atOuvrirDoc | 854 | 1 236 | cache AT.envoiDoc (une lecture à l'ouverture), drapeaux remis à zéro |
| atRendreListe | 3 391 | 3 543 | statut sur les cartes |
| renderSeance | 3 264 | 3 991 | rappel de séance (admin) + [Les déposer] |
| atSupprimerDoc | 1 369 | 2 469 | garde déposée, 3 choix, envois supprimé, corbeille double |
| atRendreEditeur | 2 439 | 2 546 | bouton « 📤 Envoyer aux élèves » dans la barre |
| openAtelierItem | 1 534 | 1 995 | lecture vers ENVOIS + bandeau du message |

CSS : bandeau, statuts de cartes, rappel de séance, modale d'envoi (zone ≥ 44 px pour la case). Pastille 8.29.0 (2026-08-05).

## 5 · Écarts au plan (déclarés)

Trois corrections posées **après** la première passe d'édition, découvertes au banc :

1. **`atDocsAssurer` : cb du rappel** — le plan disait « le prochain rendu l'aura » ; or le dépliage des séances est du CSS pur (pas de re-rendu), le rappel ne serait jamais apparu. Le cb re-rend le niveau (`renderChapitres(level)`) dès l'arrivée des docs ; `UI_OPEN`/`UI_OPEN_S` conservent l'état des accordéons.
2. **`atDocsAssurer` : garde anti-boucle** — pendant un chargement en route, rappeler le cb faisait boucler le rendu (renderSeance → atDocsAssurer → cb → renderChapitres → renderSeance…). Désormais : `if(AT_DOCS_DEMANDE)return;` — le cb du premier appel re-rendra.
3. **Chemins avec slash initial** — quatre appels 2c (`atOuvrirDoc`, `atSupprimerDoc`, `atEnvoiDefautLire`, l'écriture du défaut dans `atEnvoyer`) construisaient des chemins **sans** slash initial, produisant des URL malformées (`…firebasedatabase.appsite/…`) qui auraient toutes échoué en production réelle (pas de proposition d'envoi, corbeille sans l'envoi). La convention du socle (`_siteGet`/`_sitePut` concatènent `FIREBASE_BASE + chemin`) exige le slash : corrigé partout. Le banc a été **durci** en conséquence : tout chemin sans slash initial reçoit `null` et n'est plus jamais masqué.

## 6 · Banc de preuve (chemin réel, hub intercepté, AUCUNE écriture réelle)

Playwright + Chromium, `livre.html` servi en HTTP local, session prof et session élève réelles, toutes les écritures interceptées et journalisées (magasin local rejouant les lectures, y compris les lectures composées `/site/3e.json`, `/site/3e/chapitres.json`, `/site/atelier/documents.json` fusionnées avec les écritures du parcours). Données : snapshot du hub réel, **séance 8 vierge d'items** (état de production), une feuille de Paul sans adresse, une feuille nominative de banc (« BANC Zoé », nom fictif) adressée à la séance 8 et non déposée.

**BILAN : 25/25 VERTS** (run complet, propre, aucun processus résiduel) :

```
VERT  · P-A · « + Nouvel item » ordinaire : geste et résultat IDENTIQUES (source drive, ref vide, published false)
VERT  · P1 · la proposition de dépôt apparaît à l'enregistrement, adresse en toutes lettres
VERT  · P1 · ordre d'écriture : envois (premier:true, message vide) → item (source atelier) → méta du doc
VERT  · P1 · le vivant porte depot+envoi (versionDoc = dates.modifieLe recopié) et le cache d'envoi est posé
VERT  · P1 · `published` des séances : JAMAIS écrit
VERT  · P1 · l'élève ouvre LA VERSION DU DÉPÔT (jamais vide), sans bandeau (premier envoi = distribution)
VERT  · P1 · B① rejoué : UNE lecture atelier, vers ENVOIS
VERT  · P2 · UNE modification (écart 1 < 3) : aucune proposition d'envoi
VERT  · P2 · écart ≥ 3 : la proposition d'envoi apparaît
VERT  · P2 · la modale d'envoi : champ prérempli, DATÉ du jour (le défaut garde le jeton)
VERT  · P2 · l'envoi écrit envois (premier:false, message daté édité) puis la méta du vivant
VERT  · P2 · l'élève voit LA VERSION ENVOYÉE + le bandeau daté ; le retravail d'après reste invisible
VERT  · P2 · 390 px : le bandeau daté est là, le document s'ouvre
VERT  · P3 · cartes : « Déposée dans … · modifiée depuis l'envoi » ET « Adressée à …
VERT  · P3 · ré-adresse après dépôt : « Déposée dans X · adresse actuelle Y », jamais déplacée en silence
VERT  · P4 · le rappel : « 1 feuille de l'atelier adressée à cette séance
VERT  · P4 · garde nominative de 2b réutilisée (BANC Zoé, prévenu pas bloqué)
VERT  · P4 · la feuille nominative est déposée (envois écrit, item créé)
VERT  · P5 · garde de suppression d'une feuille déposée : l'item deviendra mort, prévenu pas bloqué
VERT  · P5 · « sans garder de copie » : DELETE envois + DELETE documents, AUCUN passage corbeille
VERT  · P5 · l'item mort affiche le message doux du viewer
VERT  · P5 · le chemin corbeille d'une feuille déposée archive LES DEUX (data:{doc, envoi})
VERT  · P6 · le second dépôt de la même feuille est refusé (inerte, message doux)
VERT  · P6 · hub muet : « adresse non vérifiable pour l'instant », rien ne casse
VERT  · P6 · B② mode test : zéro écriture réseau atelier, tout dans M8_TEST_STORE
=== BILAN 2c : 25/25 VERTS ===
```

Cas limites couverts : feuille jamais ré-envoyée (l'élève voit la version du dépôt) · double dépôt refusé inerte · séance sans nœud `items` (le cœur d'itemCreer le crée) · feuille supprimée après dépôt (item mort → message doux du viewer, `envois` supprimé) · ré-adresse après dépôt (signalée, jamais déplacée) · hub muet (« adresse non vérifiable pour l'instant », rien ne casse) · apostrophes en codepoints dans tous les textes · B① une lecture élève vers ENVOIS · B② mode test (zéro réseau, tout dans `M8_TEST_STORE`).

Non-couverture assumée : la proposition automatique n'est jouée que sur le seuil 3 exact (pas de balayage de seuils — Paul tranche le seuil sur captures) ; l'impression du bandeau n'est pas testée (hors iframe par construction, Q1) ; la restauration depuis la corbeille n'a pas d'interface (documentée §3, geste manuel).

## 7 · Captures (au sas, dossier `captures/`)

`pa_nouvel_item_ordinaire.png` (exigence A) · `p1_proposition_depot.png` · `p2_modale_envoi_desktop.png` (exigence C) · `p2_eleve_bandeau_desktop.png` · `p2_eleve_bandeau_390.png` · `p3_statuts_cartes.png` · `p4_rappel_seance.png` · `p4_garde_nominative_depot.png` · `p5_garde_suppression_deposee.png`.

## 8 · Textes soumis à Paul (tous en français sobre)

1. Proposition de dépôt : « Cette feuille est adressée à 3e › Chapitre 1 › Séance 8 — la déposer dans la séance ? » [Déposer] [Plus tard]
2. Rappel de séance : « N feuille(s) de l'atelier adressée(s) à cette séance — [Les déposer] »
3. Statuts de cartes : « Sans adresse » · « Adressée à … — pas encore déposée » · « Déposée dans … » · « Déposée dans X · adresse actuelle Y » · « Déposée dans X (l'item n'y est plus) » · suffixe « · modifiée depuis l'envoi aux élèves » · « adresse non vérifiable pour l'instant »
4. Proposition d'envoi : « Cette fiche a bien changé depuis la version que voient les élèves — leur envoyer la nouvelle ? » [Envoyer…] [Plus tard]
5. Modale d'envoi : « Envoyer aux élèves — ils verront cette version de la fiche, avec ce message daté : » + défaut « Cette fiche a changé le <date> — reporte les changements sur ta fiche du cahier. » + case « Faire de ce texte le nouveau message par défaut »
6. Gardes : suppression déposée (§3) · double dépôt « Cette feuille est déjà déposée dans cette séance. » · dépôt réussi « Déposée — l'item est créé dans la séance, les élèves verront cette version quand la séance sera publiée. » · envoi réussi « Envoyé — les élèves voient désormais cette version. » · sans adresse « La feuille n'a pas d'adresse : choisis niveau, chapitre et séance d'abord. »

---
**STOP.** Livraison au sas complète : `SITE-COURS-2c/index.html` + `rapport.md` + captures. J'attends l'audit de la conscience n°5, puis le « promeus » de Paul.
*[exécutant SITE-COURS-2c]*
