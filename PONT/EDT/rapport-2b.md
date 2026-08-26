# LOT 2bis — EMPLOI DU TEMPS · RAPPORT DE LA LIVRAISON ②b (le code)

*Candidat `8.71.0` déposé au sas. Aucune promotion. Aucune écriture au vrai hub : le banc tourne sur un faux hub en mémoire, amorcé par un instantané pris en lecture seule.*

---

## ⓪ CE QUI EST DANS CE CANDIDAT

| | |
|---|---|
| Base | 8.70.1, md5 `6c7560afa9e431f23f89aa6fe167bb6b`, 1 522 853 o |
| Candidat | **8.71.0**, 1 546 467 o (+23 614) |
| Ajouté | un bloc unique `EDT — début … EDT — fin`, **29 fonctions `edt*`**, un `<style id="edt-css">` posé par le bloc lui-même |
| Modifié hors du bloc | **trois lignes** : le bouton « 📅 Emploi du temps » dans la barre du panneau prof · une ligne dans `_renderProfSection` · le numéro de version |

L'écran de la semaine n'est pas dans ce candidat : il vient en ③. Ce lot pose **les objets** et **la porte par laquelle ils entrent**.

## ① LES FONCTIONS, ET CE QU'ELLES FONT

**Les objets** — `edtChemin(objet, annee)` donne `/site/edt/<objet>/<annee>` ; `edtCharger(apres)` lit les six d'un coup (calendrier, grille, creneaux, periodes, decisions, photos), aucun n'est obligatoire, une panne est notée dans `EDT.pannes` et jamais fatale.

**Les créneaux (exception ②)** — `edtAppliquerCreneaux()` remplace `AT_EDT` par la liste de l'objet, après avoir mis la valeur en dur de côté (`EDT.creneauxRepli`). Objet absent ou vide → `AT_EDT` reprend le dur. `edtTempsUtile(creneau)` applique la règle du site : fin − début − 5.

**Le calendrier, en lecture** — `edtSemaineLettre(date)` lit la table, **ligne à ligne, jamais par parité** (le numéro repart à 1 au 1er janvier, la parité s'y retourne) ; `edtJourSansCours(date)` répond `vacances`, `pont` ou `ferie` ; `edtPeriodeA(date)` renvoie la période en vigueur, et `null` tant qu'aucune date n'est saisie — une seule période toute l'année.

**Les refus nommés** — `edtValiderCalendrier`, `edtValiderGrille`, `edtValiderCreneaux`. Un JSON n'est jamais rejeté en bloc : chaque défaut est dit avec sa case et sa raison. La grille refuse un jour inconnu, un créneau qui n'existe pas dans les créneaux de l'année, un doublon jour+créneau+semaine (**« je ne choisis pas à ta place »**), et le mercredi après 11h59.

**L'injection** — `edtInjOuvrir / edtInjVerifier / edtInjInjecter`, même flow que partout : coller, vérifier, voir, injecter. Rien n'est enregistré avant le geste d'injection.

**L'exception ①** — `edtEcrireBrevet(cal)` écrit `/site/config/brevetDates/<niveau>` depuis `calendrier.brevet`. C'est la seule écriture de l'EDT hors de `/site/edt/`.

**La modification à la main** — `edtPeriodePoser(nom, date)` (les dates de P1…PFIN, saisies le jour de la rentrée) · `edtCreneauPoser(rang, champ, valeur)` (un horaire modifié, sans jamais toucher aux traces d'heures déjà jouées) · `edtApparierNom(nomDeGrille, nomDuHub)` (toutes les cases d'une même classe appariées d'un geste).

**La porte ②** — `edtSectionPanneau()`, appelée par `_renderProfSection`. C'est le seul appel `edt*` hors du bloc dans ce candidat.

## ② LA GARDE — `verif_edt.py`, VERTE, et qui sait refuser

Déposée en `PONT/EDT/outils/verif_edt.py`, à poser en production à côté de `index_fonctions.py`. Trois questions :

```
VERT — ① le bloc EDT n'appelle que le contrat
       ② rien hors du bloc n'appelle edt* sauf les portes déclarées
       ③ tous ses nœuds sont sous /site/edt/, hors les exceptions nommées
```

**Une garde qui ne dit jamais non ne garde rien.** Trois contrôles négatifs, sur des copies du candidat :

| Ce qu'on introduit | Réponse |
|---|---|
| un appel `atSupprimerChapitre()` dans le bloc | ROUGE ① — `atSupprimerChapitre` |
| un appel `edtCharger()` dans le routeur du panneau prof | ROUGE ② — `edtCharger` |
| une écriture `mjpcPutJson(FIREBASE_BASE+'/classes/triche'…)` dans le bloc | ROUGE ③ — chemin cité |

**Note de méthode, écrite dans le fichier.** J'ai d'abord écrit un balayage qui écartait commentaires et chaînes avant d'analyser. Sur 1,5 Mo il se désynchronisait — regex littérales, apostrophes françaises des commentaires — et **passait au vert en ayant perdu 58 % du fichier** : une garde aveugle qui se tait. Elle travaille désormais sur le texte brut : un identifiant cité dans un commentaire élargit l'ensemble des « fonctions du site » et rend donc la garde **plus stricte, jamais plus laxiste**. L'erreur possible penche du bon côté.

*Effet de bord relevé et corrigé par cette garde :* mon paramètre de rappel s'appelait `suite`, or le site déclare `var suite = function(){…}`. Collision de nom avec une variable globale. Renommé `apres`.

## ③ LES PREUVES — banc `tests/banc-2b.mjs`

Faux hub en mémoire amorcé par instantané (`/classes`, `/site/3e`, `/site/config`), tout PUT/PATCH/DELETE capté et compté, **aucune sortie réseau**. Chrome 131, 1366×768, parcours par appels de l'interface.

| Ce qui est prouvé | Mesure |
|---|---|
| l'entrée existe dans le panneau prof | `true` |
| la section s'ouvre sans aucun objet injecté | trois lignes « aucun objet injecté », aucune erreur |
| refus nommés sur une grille fautive | 3 refus : doublon lundi 08:57 semaine A · mercredi après 11h59 · jour « samedi » |
| les trois injections | acceptées, écrites, relues |
| `AT_EDT` commandée par l'objet | injection d'horaires **différents** → `08:10-09:05 · 09:10-10:05 · 10:20-11:15` |
| le repli | objet retiré → `AT_EDT` reprend les huit valeurs en dur |
| écritures au hub | 8, dont **une seule hors `/site/edt/`** : `PUT /site/config/brevetDates/3e` |
| `brevetDates` après injection | `3e = 2027-06-25T08:00:00`, les autres niveaux intacts |
| période saisie à la main | `{P1: 2026-09-01}` écrite et relue |
| appariement d'une classe | 7 cases de « 3 FRANKLIN Aretha » appariées d'un geste |
| lectures du calendrier | 7 sept → **B** · 16 sept → **A** · 20 oct → vacances de la Toussaint · lundi ordinaire → rien · temps utile 10:07-11:02 → **50 min** · période au 7 sept → P1 |
| sorties réseau | **0** (18 requêtes captées = chargement des pages sœurs du site en `file://`) |

Captures : `2b-1-panneau-prof` · `2b-2-section-vide` · `2b-3-refus-nomme` · `2b-4-apres-injection` · `2b-5-periodes-et-appariement`.

**Une seule erreur de console, et elle est étrangère au lot :** `403` sur `fonts.googleapis.com` (EB Garamond) — le banc n'a pas accès au réseau. Sur le site déployé, la police se charge.

## ④ INVARIANTS — base contre candidat

| | base | candidat | |
|---|---|---|---|
| moteur du déroulé `AT_DR_B64` | 309 812 car., md5 `2ba70f9ef8aacb6f` | idem | **intact** |
| `published` | 97 | 97 | inchangé |
| `atDrJouerClic` | 2 | 2 | inchangé |
| double parseur | — | `new Function` + acorn ES2020 sur les 2 scripts | vert |

`secuLire` 19→20, `isPubFor` 17→18, `mjpcPutJson` 35→42, `AT_EDT` 6→15 : ce sont les usages du bloc EDT et ses mentions au commentaire du contrat. Aucun appel du site n'a été retiré ni déplacé.

## ⑤ CE QUI RESTE, ET CE QUI N'EST PAS UNE DETTE

**Livré sans dette pour ce qui est de son périmètre.** Ce qui suit relève des livraisons annoncées, pas d'un trou laissé :

- **③** le prévu calculé et la semaine sans scroll — avec elles, les portes ① (arrivée du professeur) et ③ (bandeau du déroulé), déjà déclarées dans `PORTES` de la garde.
- **④** la modale d'une case, les décisions horaires, annuler, le journal, les photos.
- **⑤** mois, année, divergence, écarts justifiés, classe expérimentale, absence.
- **⑥** bancs complets, séquence de test, rapport final.

**Ce qu'un lot suivant doit savoir de ce code** (le mandat le demande) : l'état vit dans `EDT` (un objet, six champs, `charge`, `pannes`) ; tout passe par `edtChemin` ; `edtAppliquerCreneaux` doit être rappelée après toute écriture des créneaux ; `edtSemaineLettre` et `edtJourSansCours` sont les deux seules lectures du calendrier dont le prévu aura besoin ; le banc `tests/banc-2b.mjs` expose `creerHub` et l'interception `fetch` — à reprendre tel quel pour les lots suivants.

*Mot à attendre : **continuer**.*
