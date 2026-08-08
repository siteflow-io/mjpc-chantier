# ORDRE — RAPPORT DE LIVRAISON
**La numérotation unique et les caches qui mentent.** Exécutant [C5-ORD], sous conscience n°5 · 07/08/2026. Livraison directe (urgence).

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.36.0) | 834 674 o | `86006b1db34e95ac695ed66545340150` |
| LIVRÉ (8.37.0) | 841 907 o | `1469b7c6b52a44b0168738c87c05c200` |

Double parseur **VERT** · **0 fonction supprimée** · 16 éditions · production en lecture seule.

## 2 · La règle appliquée : `ordre` est la seule vérité

Un socle unique, cinq fonctions, qui remplace les calculs dispersés :

| fonction | rôle |
|---|---|
| `ordDe(o,repli)` | lit un `ordre` (absent/illisible → repli) |
| `ordPaires(coll)` | rend `{k:clé RÉELLE, o:objet}` **triés par ordre** ; à égalité la clé départage — l'affichage reste stable |
| `ordSuivant(coll)` | **max(ordre) + 1** : le rang d'une création (fin de liste) |
| `ordResserrer(coll,base,cb)` | ③ 1,2,3… sans trou ; **écritures fines**, un chemin par `ordre` ; **idempotent** |
| `ordNormaliserNiveau(level)` | ④ chapitres, séances, items — **silencieux, sans bouton** |

**① Les créations** — `addChapter` et `addSeance` posaient `ordre = max(CLÉ)+1` : elles posent désormais `ordSuivant(...)`. La clé reste un rangement technique (elle continue de venir du max des clés) ; le rang vient de l'ordre. Le nouvel objet arrive **en fin de liste**, Paul le remonte aux flèches.

**② `atSeances` trie sur `ordre`** — via `ordPaires`. Elle rend toujours la **clé réelle** en `j` : aucun écrivain fin n'a bougé. Ses **16 appelants** ont été relus : tous consomment `{j,se}` sans dépendre de l'ancien tri par clé (les rangs d'écriture passent par `atSeancesRangSuivant`, qui reste la clé libre suivante — et qui garde ce rôle, documenté en commentaire). L'atelier et l'arborescence affichent maintenant le **même ordre** : verdict dédié au banc.

**③ Les suppressions resserrent** dans le même geste (`deleteSeance`, `deleteItem`).

**④ La normalisation silencieuse** au chargement d'un niveau, **côté prof seulement** (l'écran élève n'écrit jamais) : doublons, trous et ordres absents sont renumérotés **dans l'ordre où les choses apparaissent déjà**. Pas de bouton (décision de Paul). Idempotente.

## 3 · ⑤ Les caches — inventaire, comme demandé

**56 fonctions écrivent au hub.** 36 rafraîchissent un cache ou redessinent. Les **20 restantes** se répartissent ainsi :

- **Écrivains de bas niveau** (ils n'ont pas de cache à rafraîchir, c'est leur appelant qui l'a) : `secuEcrire`, `_sitePut`, `atSitePut`, `mjpcPutJson`, `mjpcDeleteJson`, `_taxoEcrire`, `ordResserrer`, `garder`, `secuEcrireCanari`, `secuEnregistrerAppareil`, `_cpArchive`.
- **Écrivains dont l'appelant redessine** : `diapoEcrire`, `secuCpAjouter`, `secuCpRetirer`, `secuCpRemplacer`, `ecrireAnnonce`, `supprimerAnnonce`, `ecrireBrevetDate`, `leverAlerteRegles`, `simulerJ29`.

**Les deux cas nommés par le mandat sont corrigés** : `atFeuilleProduitPoser` rafraîchit désormais **`AT.liste`** — le cache que lit réellement le rendu — en plus de `LINK_ATELIER_DOCS` et `AT_DOCS` (sans quoi le menu revenait visuellement à « Fiche de séance ») ; et l'injection **recharge `chapitresData` puis redessine** la progression et la liste de l'atelier : **le chapitre créé apparaît immédiatement**, sans recharger le site.

## 4 · ⑥ La confirmation d'injection

Après une création réussie : « **Chapitre créé : N séances, N items — non publié** », suivi d'un bouton **« Voir le chapitre »** (passerelle `atVoirPanneau` existante). Le compte d'écritures reste affiché. Une écriture réussie n'est plus muette.

## 5 · ⑦ Un seul bouton quand le chapitre n'existe pas

Quand aucun chapitre ne porte ce titre (`CH.chapIdx === null`), les trois voies laissent place à **un seul bouton « Créer ce chapitre »**, avec la phrase « Rien n'existe encore sous ce titre : le chapitre sera créé en fin de liste, non publié. » Dès qu'un chapitre existe, **les trois voies reviennent inchangées** (verdict dédié).

## 6 · ⑧ Le produit « Fiche méthode » — lot soumis à Paul

**Fiche méthode** (`fiche_methode`), rayon **Langue** (avec les fiches notion, en attendant l'onglet Méthode). **9 cases pré-cochées** : `titre` · `niveau` · `notions` · `objectif` · `methode` · `exemple` · `criteres_reussite` · `attention_piege` · `mention_conserver`. La fiche réelle « Le paragraphe citation-justification » pourra y être requalifiée par le menu de produit livré au morceau précédent.

## 7 · UN DÉFAUT RÉEL DÉBUSQUÉ PAR LE BANC (hors mandat, réparé et déclaré)

En rejouant **le désordre réel du hub** (cases vides, doublons de titre, ordres 1 et 10 en cases 10 et 11), le banc a montré que **`chAfficherInventaire` faisait `chaps.forEach`** : or `/site/<niveau>/chapitres` arrive **en OBJET** dès qu'il a des trous — la fonction levait une exception dans sa promesse et **l'écran d'inventaire restait vide sans rien dire**. C'est exactement la situation de Paul. Réparé : parcours par clés réelles. Deux calculs voisins qui comptaient les éléments au lieu de lire les ordres (`neuf.ordre`, `out.position`) passent à `ordSuivant`, et la clé d'un chapitre « gardé à côté » est prise comme clé libre suivante (au lieu de `chaps.length`, faux sur un objet). Même famille que le trou d'index 0 du 05/08.

## 8 · Fonctions — inventaire (0 supprimée)

**5 ajoutées** : `ordDe` · `ordPaires` · `ordSuivant` 125 · `ordResserrer` 412 · `ordNormaliserNiveau` 559 o.
**10 modifiées** (relues entières) : `loadPublished` 1 042 → 1 530 (④) · `addChapter` 690 → 818 (①) · `addSeance` 761 → 815 (①) · `deleteSeance` 524 → 709 (③) · `deleteItem` 551 → 702 (③) · `atFeuilleProduitPoser` 484 → 756 (⑤) · `chAfficherInventaire` 4 840 → 5 576 (⑦ + §7) · `chInjecterConfirme` 4 550 → 5 784 (⑤⑥ + §7) · `atSeances` 322 → 381 (②) · `atSeancesRangSuivant` 198 → 293 (clarifiée). **Aucune décroissance.**

## 9 · Banc de preuve — **BILAN : 17/17 VERTS** (run unique)

Décor = **le désordre réel de la 3e** injecté dans le nœud servi. Chemin réel, hub intercepté, **aucune écriture réelle**.

```
VERT  · P1 · ④ le désordre réel est normalisé : 1,2,3… sans trou ni doublon
VERT  · P1 · ④ la liste garde l'ordre où les choses étaient (le premier reste le premier)
VERT  · P1 · ④ écritures FINES, un chemin par `ordre`, jamais de nœud entier
VERT  · P1 · `published` n'est jamais touché par la renumérotation
VERT  · P1 · ④ idempotent : une seconde normalisation n'écrit RIEN
VERT  · P2 · ① le rang d'une création = max(ordre)+1 (fin de liste), pas max(clé)+1
VERT  · P2 · ① idem pour une séance (rang suivant = nombre de séances + 1)
VERT  · P3 · ② l'atelier (atSeances) et l'arborescence (tri par ordre) affichent LE MÊME ordre
VERT  · P4 · ③ après suppression au milieu, les ordres se resserrent (1,2,3… sans trou)
VERT  · P5 · les flèches ⬆️⬇️ (_swapOrdre, inchangée) permutent bien les deux ordres après normalisation
VERT  · P6 · ⑧ « Fiche méthode » existe, rayon Langue, lot de cases posé
VERT  · P7 · ⑤ après changement de produit, AT.liste (le cache que LIT le rendu) porte la nouvelle valeur
VERT  · P8 · ⑦ chapitre inexistant : UN SEUL bouton « Créer ce chapitre » (plus de trois voies)
VERT  · P8 · ⑦ dès qu'un chapitre existe, les TROIS voies reviennent inchangées
VERT  · P9 · vue élève : la normalisation n'écrit RIEN côté élève (elle est réservée au prof)
VERT  · P9 · vue élève : la liste s'affiche normalement (ordres lus, pas réécrits)
VERT  · P9 · 390 vue élève : l'écran ne change pas et ne déborde pas
=== BILAN ORDRE : 17/17 VERTS ===
```

Cas du mandat tous joués : normalisation du désordre réel · liste stable, aucun doublon d'ordre · création après normalisation → **en fin** · suppression au milieu → **resserrement** · flèches **cohérentes après tout cela** · atelier et arborescence **au même ordre** · produit changé → l'écran garde la valeur **sans rechargement** · injection → **un seul bouton** quand rien n'existe, **trois voies** sinon · **vue élève rejouée et capturée** (aucune écriture côté élève) · **390 et desktop**.

## 10 · Textes soumis à Paul

« Chapitre créé : N séances, N items — non publié » + bouton « Voir le chapitre » · « Créer ce chapitre » · « Rien n'existe encore sous ce titre : le chapitre sera créé en fin de liste, non publié. Rien n'est écrit tant que tu n'as pas cliqué. » · libellé et info de « Fiche méthode » (§6).

## 11 · Écarts et observations (déclarés)

1. La réparation du §7 dépasse les huit objets : le banc l'a rendue nécessaire (sans elle, ⑦ ne pouvait pas s'afficher chez Paul).
2. La normalisation est **réservée au prof** (`TRACK.eleve.is_prof`) : l'écran élève ne doit jamais écrire — verdict dédié.
3. `atSeancesRangSuivant` **reste** la clé libre suivante (rangement technique) : elle n'est pas le rang. Documenté en commentaire pour lever l'ambiguïté qui a causé ①.
4. Captures : la preuve du bouton unique est **le verdict au DOM** (le rendu vit dans `#ch-inv`, hors écran quand l'atelier n'est pas monté) — j'ai retiré une capture qui montrait l'accueil et n'aurait rien prouvé, plutôt que de la laisser induire en erreur.
5. Amenées de banc : décor injecté dans le nœud réellement servi ; `_swapOrdre` mesurée au journal (elle écrit au hub sans muter l'objet local — comportement d'origine, conservé) ; télémétries préexistantes exclues des verdicts d'écriture.

---
**STOP.** `ORDRE/index.html` + `rapport.md` + 3 captures au sas. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-ORD]*
