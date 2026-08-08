# IDENTITÉS — RAPPORT DE LIVRAISON
**Tout objet référençable porte une identité stable.** Exécutant [C5-UID], sous conscience n°5 · 08/08/2026. Livraison directe.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.37.0) | 841 907 o | `1469b7c6b52a44b0168738c87c05c200` |
| LIVRÉ (8.38.0) | 849 451 o | `b5bb13e1259442c0e679ddc12ff9ac06` |

Double parseur **VERT** · **0 fonction supprimée** · 16 éditions · production en lecture seule.

## 2 · La forme d'une identité

`uidNeuf(prefixe)` → **préfixe + horodatage base 36 + aléa de 5 caractères** : `ch-mfa12b3-k9x2p`, `sce-…`, `itm-…`. Opaque (elle ne dit ni la place ni le nom), stable (rien ne la réécrit jamais), non réutilisée (l'horodatage et l'aléa la rendent unique même pour deux créations dans la même milliseconde). Le rang et la clé **restent en place** : rangement technique, repli de lecture, libellé lisible.

## 3 · ③ INVENTAIRE EXHAUSTIF — tout ce qui référence un chapitre ou une séance

| référence | où | traitement |
|---|---|---|
| **`rattachement`** d'une feuille (`chapitre`, `seance`) | `atIAAppliquer` (écriture), `atIAValiderAdresse` (construction) | **`chapitreUid` / `seanceUid` AJOUTÉS à côté** du rang |
| **`depot`** d'une feuille (où l'item a été créé) | `atDeposerFeuille` | idem, **ajoutés** |
| **adresse affichée** (« Déposée dans 3e › Chapitre 1 › Séance 3 ») | `atAdresseLisible` | calculée **depuis l'identité**, repli rang |
| **statut d'une feuille** (item encore là ?) | `atStatutFeuille` → `atItemPointant` | la place actuelle résolue par identité (`atAdresseCles`) |
| **listes d'adressage** (menus chapitre/séance) | `atChapitresDe`, `atSeancesDe` | portent désormais l'`uid` |
| **liaison d'un diaporama** (`kind:'diaporama'`, `ref`) | `diapoStatutLiaison`, `diapoLierModal` | **référence l'ITEM par sa clé dans la séance**, pas un rang de séance : pas d'ambiguïté à réparer ici — les items reçoivent tout de même leur `uid` (migration), pour la suite |
| **envois** `/site/atelier/envois/<ref>` | `AT_ENVOIS_NOEUD` | indexés par **`ref` de feuille** (déjà une identité stable) — rien à changer, vérifié |
| **garde d'atterrissage** (injection) | `chCalculerEcritures`, `chAfficherInventaire` | travaille sur les **clés réelles** du moment T, pas sur des rangs mémorisés — rien à changer, vérifié |
| **passerelles atelier ↔ panneau** | `atVoirPanneau`, `atEditerChapitre` | passent la **clé** en paramètre immédiat (aucune mémorisation) — rien à changer, vérifié |

**Règle appliquée partout : on AJOUTE, on ne remplace pas.** La lecture cherche par `uid` d'abord ; le repli par rang ne vaut **que** pour les objets anciens, qui n'ont aucun `uid` enregistré.

**Une précision que le banc a imposée** : si une identité **est** enregistrée mais introuvable, on ne retombe **pas** sur le rang — ce serait désigner la nouvelle occupante de la place, c'est-à-dire exactement le défaut à réparer. On dit alors « la séance a été supprimée ».

## 4 · ② La migration, dans le patron d'hier

`uidMigrerNiveau(level)` est appelée **depuis `ordNormaliserNiveau`** (promue hier) : un seul passage, un seul mécanisme, **aucun bouton**. Tout objet sans `uid` en reçoit un ; **écritures fines** (`…/uid`), **idempotent** (rien à poser = rien à écrire), **`published` jamais touché**, **côté prof seulement** (`TRACK.eleve.is_prof`).

## 5 · ① Les créations et la duplication

`addChapter`, `addSeance`, `itemCreer` posent l'`uid` à la création. `uidRenouveler` donne à une **copie** des identités **neuves à tous les étages** — recopier celles de l'original ferait pointer les références de l'un sur l'autre.

## 6 · ④ La garde de suppression

`uidReferents(level, chnum, snum)` cherche les feuilles qui pointent vers l'objet — **par `rattachement` ET par `depot`**, par identité d'abord, par rang ensuite. `uidPhraseReferents` compose l'avertissement, inséré dans la confirmation de `deleteSeance` et dans celle d'`atSupprimerChapitre` : **prévenu, pas bloqué** (patron 2b). Prouvé : deux feuilles comptées, la troisième (ailleurs) ignorée.

## 7 · Fonctions — inventaire COMPLET (0 supprimée, 9 ajoutées, **13 modifiées**)

**Ajoutées** : `uidNeuf` 147 · `uidTrouver` 279 · `uidResoudre` 567 · `uidMigrerNiveau` 674 · `poser` 131 (interne) · `uidRenouveler` 395 · `atAdresseCles` 365 · `uidReferents` 892 · `uidPhraseReferents` 476 o.

**Modifiées — toutes déclarées, y compris les plus légères :**

| fonction | avant | après | Δ |
|---|---|---|---|
| `addChapter` | 818 | 857 | +39 |
| `addSeance` | 815 | 855 | +40 |
| `itemCreer` | 1 225 | 1 265 | +40 |
| `deleteSeance` | 709 | 817 | +108 |
| `ordNormaliserNiveau` | 559 | 661 | +102 |
| `atIAAppliquer` | 1 673 | 1 961 | +288 |
| `atChapitresDe` | 335 | 373 | +38 |
| `atIAValiderAdresse` | 1 921 | 2 057 | +136 |
| `atAdresseLisible` | 429 | 1 065 | +636 |
| `atDeposerFeuille` | 1 505 | 1 651 | +146 |
| `atStatutFeuille` | 1 347 | 1 638 | +291 |
| `atSupprimerChapitre` | 1 759 | 1 868 | +109 |
| `atDupliquerChapitre` | 921 | 1 004 | +83 |

Aucune décroissance. (Rappel du mandat entendu : la livraison d'hier avait omis une fonction modifiée — ce tableau est produit depuis l'inventaire automatique, pas de mémoire.)

## 8 · Banc de preuve — **BILAN : 15/15 VERTS** (run unique)

Décor : les chapitres réels **privés de leur `uid`** (l'existant de Paul). Chemin réel, hub intercepté, **aucune écriture réelle**.

```
VERT  · P1 · ② tout objet a reçu une identité (chapitres, séances, items)
VERT  · P1 · ② écritures FINES, un chemin par `uid`
VERT  · P1 · ② `published` jamais touché par la migration
VERT  · P1 · ② les identités sont opaques et distinctes (aucun doublon)
VERT  · P1 · ② idempotent : une seconde migration n'écrit RIEN
VERT  · P2 · ① la forme d'une identité : préfixe + horodatage + aléa, jamais deux fois la même
VERT  · P2 · ① une duplication reçoit des identités NEUVES à tous les étages (jamais celles de l'original)
VERT  · P3 · LA PREUVE : une feuille adressée par identité SUIT sa séance quand les rangs changent
VERT  · P3 · une feuille ancienne, adressée au RANG seul, continue de fonctionner (repli)
VERT  · P3 · ⑤ si la séance n'existe plus, l'adresse le DIT au lieu d'afficher un rang qui désigne autre chose
VERT  · P4 · ④ la garde compte les feuilles qui pointent vers la séance (adresse ET dépôt), pas les autres
VERT  · P4 · ④ elle prévient sans bloquer, et dit ce qui arrive aux feuilles
VERT  · P5 · ⑤ après un déplacement aux flèches, l'adresse affichée suit la séance (le libellé change avec le rang)
VERT  · P6 · vue élève : AUCUNE écriture (la migration est réservée au prof)
VERT  · P6 · 390 vue élève : l'écran ne change pas et ne déborde pas
=== BILAN IDENTITÉS : 15/15 VERTS ===
```

**LA PREUVE DU MORCEAU** : une feuille adressée par identité **suit sa séance** quand une réinjection change les rangs (l'adresse affichée passe de « Séance 3 » à « Séance 1 » en désignant **la même séance**, résolue `par:'uid'`), tandis qu'une feuille ancienne adressée au rang seul **continue de fonctionner** par repli. Le cas de Paul — « Déposée dans 3e › Chapitre 1 › Séance 3 (l'item n'y est plus) » — ne peut plus se produire silencieusement.

Cas du mandat tous joués : migration une seule fois et **idempotente** · création → `uid` neuf · duplication → identités **neuves** · repli des feuilles anciennes · **survie à une réinjection** · suppression référencée → **garde affichée, rien d'écrasé** · adresse juste après déplacement aux flèches · **vue élève rejouée et capturée** (aucune écriture) · **390 et desktop**.

## 9 · Textes soumis à Paul

« **N feuilles pointent vers cette séance** : <titres>. Elles resteront **sans adresse** — tu pourras les réadresser depuis l'atelier. Rien n'est effacé de leur côté. » · « le chapitre a été supprimé » / « la séance a été supprimée » (adresse d'un objet disparu).

## 10 · Écarts et observations (déclarés)

1. **Le durcissement du repli** (§3) n'était pas explicite au mandat : le banc l'a rendu nécessaire pour que ⑤ dise vrai.
2. Trois références inventoriées **n'avaient rien à réparer** (envois indexés par `ref`, garde d'atterrissage sur clés du moment, passerelles en paramètre immédiat) : je le dis plutôt que de les modifier pour la forme.
3. Les items reçoivent leur `uid` bien qu'aucune référence ne les vise encore par rang : la migration est faite une fois pour toutes, la suite (liaisons, envois) pourra s'y appuyer.
4. Amenées de banc : décor injecté dans le nœud réellement servi ; `LINK_ATELIER_DOCS` peuplé pour la garde ; télémétries préexistantes exclues des verdicts d'écriture.

---
**STOP.** `IDENTITES/index.html` + `rapport.md` + 4 captures au sas. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-UID]*
