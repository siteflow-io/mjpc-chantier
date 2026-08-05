# SITE-COURS-3a-COMPLÉMENT — RAPPORT DE LIVRAISON
**Cinq finitions : niveau du diaporama, modale LIER à 390, noms courts du conseil, dupliquer, compteur à trois états.**
Exécutant [C5-3ac], sous conscience n°5 · 05/08/2026. Circuit allégé : livraison directe, le cadrage tient ici.

## 1 · Identités

| pièce | taille | md5 |
|---|---|---|
| BASE (production re-téléchargée à l'instant de l'édition, 8.31.0) | 802 232 o | `8533d8f913f79d0ad70775d6a2f530e4` |
| LIVRÉ (8.32.0) | 808 951 o | `ad1f72c4d64f3cca3de31606289726f2` |

Double parseur : **VERT** sur base et livré. Chaîne reproductible : `editer.py` (13 éditions) rejoué depuis la base redonne exactement le md5 livré.

## 2 · ① Le niveau du diaporama

- **À la conversion** : un menu « Niveau » (3e/4e/5e/6e) à côté du nom d'enregistrement, **pré-rempli avec le niveau de la page** ; `diapoEnregistrer`/`diapoEcrire` ajoutent `niveau` au payload — rien d'autre ne change (prouvé au journal : clés exactes `{titre, diapos, maj, niveau}`).
- **Sur les cartes ③** : le niveau s'affiche ; le sélecteur de l'onglet **filtre** les diaporamas qui en portent un ; ceux qui n'en ont pas restent visibles à tous les niveaux avec le badge « niveau non renseigné » et le menu **« Poser le niveau… » directement sur la carte** — le geste d'étiquetage de l'existant (cas « Les figures de style »). Une écriture fine, prouvée au journal : `/site/diaporamas/<id>/niveau`. Le filtre agit aussitôt (prouvé dans les deux sens : disparu de 3e, présent en 4e avec son niveau). La logique du statut de liaison ne change pas.

**Chemins d'écriture nouveaux (liste exhaustive du complément)** : `/site/diaporamas/<id>/niveau` (étiquetage) · le champ `niveau` dans le payload existant de `diapoEcrire` · `/site/<niv>/chapitres/<rangSuivant>` (copie de chapitre, un seul PUT) · `/site/diaporamas/<idNeuf>` (copie de diaporama, un seul PUT).

## 3 · ② La modale LIER à 390 (dette du 04/08 résorbée)

Mesure d'abord : la modale pose déjà l'état **`#link-modal.visible`**, et le patron des flottants masqués existe (`body.at-corps-fige …{display:none}`). Le correctif est donc **du CSS pur, ancré sur l'état existant** — aucun JS, `openLinkModal`/`closeLinkModal` intacts :
`body:has(#link-modal.visible) #tprof-btn, … #admin-tools-btn, … #admin-tools-menu {display:none}` (`:has` : Chrome, l'environnement de Paul). Prouvé au **display calculé** (les flottants sont `position:fixed`, `offsetParent` ne dit rien) : effacés à l'ouverture, revenus d'eux-mêmes à la fermeture. Capture 390.

## 4 · ③ Les noms courts du conseil du filet

`libelle()` d'`atEcartDetail` consulte d'abord `AT_NOMS_COURTS`, repli sur le libellé de composante (jamais de trou). La table couvre **44 composantes** (fiche_seance et au-delà) — tous soumis à Paul :
le titre · le sous-titre · le nom de l'élève · la classe · le niveau · le groupe · le chapitre · la séance · la date de la séance · la date d'édition · l'année scolaire · la période · l'objectif · les compétences · les notions · le domaine du socle · l'attendu de cycle · les prérequis · ce qui sera évalué · les critères de réussite · la durée · la place dans la progression · le parcours · l'œuvre · l'auteur · le siècle et le courant · le corpus · le genre · l'histoire des arts · les prolongements · le lexique · l'étymologie · le repère chronologique · la consigne · la question · le sujet de rédaction · le nombre de mots · le matériel · la modalité de travail · le barème · le cadre de note · le temps passé · le travail à faire · l'échéance · la séance suivante.
Prouvé : le conseil dit « l'objectif, la durée » (plus aucun « Afficher… »), apostrophes en codepoints.

## 5 · ④ Dupliquer (chapitres et diaporamas)

- **Chapitre** : copie complète en fin de liste (`atChapitresRangSuivant` = max des clés réelles +1 — 9 chapitres réels → la copie va en 10), titre « <titre> (copie) », ordre = dernier+1, **ENTIÈREMENT DÉPUBLIÉE à tous les étages** par `chNettoyerPublished` — **réparé au passage pour la forme objet des seances** (`atSeances`, la réalité du chapitre 1 : dette 2e résorbée, le nettoyeur unique en profite partout). La dépublication **RETIRE** `published` (elle n'écrit ni true ni false) : c'est le patron 2e — l'absence vaut non-publié pour tout l'aval, et ainsi rien n'écrit jamais `published`, dans aucun sens. Prouvé au journal : **une seule écriture**, `"published"` absent du corps entier (test récursif), la carte de la copie apparaît « non publié » avec l'état neutre du compteur.
- **Diaporama** : copie sous un id neuf (`diapoIdPropose` du titre-copie, suffixe temporel si collision), titre « (copie) », sans liaison (« Pas encore lié — invisible des élèves »). Une seule écriture.
- Confirmation avant chaque duplication (textes §8) ; rien d'automatique.

## 6 · ⑤ Le compteur à trois états

`atChapitreLiaisons` retourne désormais `{total, sans}` ; la carte distingue : **0 item** → « Aucun item pour l'instant. » (classe neutre `at-st-flou`, pas de vert — le mensonge d'affichage constaté par Paul disparaît) · **des items dont certains sans ref** → « N liaisons restantes » · **tous liés** → « Tout est lié. ». Prouvé sur le chapitre 1 réel au fil d'un parcours : vide → un item créé → lié (3 captures).

## 7 · Fonctions — inventaire complet (0 supprimée, aucune décroissance)

BASE 732 → LIVRÉ 735. **724 intactes**. **3 ajoutées** : atDiapoPoserNiveau 318 · atDupliquerChapitre 921 · atDupliquerDiapo 603 o (+`atChapitresRangSuivant` interne). **8 modifiées** (relues entières) :

| fonction | avant | après | objet |
|---|---|---|---|
| chNettoyerPublished | 322 | 401 | forme objet des seances (atSeances) — dette 2e résorbée |
| diapoRelecture | 1 930 | 2 263 | le menu Niveau à l'enregistrement |
| diapoEnregistrer | 997 | 1 149 | le niveau dans le payload |
| atEcartDetail / libelle | 1 304/88 | 1 345/107 | noms courts d'abord |
| atChapitreLiaisons | 196 | 337 | `{total, sans}` (trois états) |
| atRendreChapitres | 1 817 | 2 095 | compteur 3 états + bouton Dupliquer |
| atRendreDiapos | 1 361 | 2 311 | niveau, badge, « Poser le niveau », filtre, Dupliquer |

CSS : `body:has(#link-modal.visible)` (②), `.at-sel-mini`, `.at-st-flou`. Pastille 8.32.0. `published` jamais écrit à true (P7 : ni en corps ni en chemin, sur tout le banc).

## 8 · Textes soumis à Paul

Menu conversion : « Niveau » (pré-rempli) · badge « niveau non renseigné » + « Poser le niveau… » · duplication chapitre : « Dupliquer « <titre> » ? La copie arrive en fin de liste, entièrement dépubliée : c'est un brouillon de travail, invisible des élèves. » · duplication diaporama : « … La copie naît sans liaison : invisible des élèves tant que tu ne l'as pas reliée. » · compteur : « Aucun item pour l'instant. » / « N liaisons restantes » / « Tout est lié. » · les 44 noms courts (§4).

## 9 · Écarts et observations (déclarés)

1. **② en CSS pur `:has`** : la modale posait déjà son état — l'esprit « ancré sur l'existant » du mandat pris au pied de la lettre, zéro fonction touchée.
2. **④ répare `chNettoyerPublished`** (forme objet) plutôt que d'ajouter un dépublieur parallèle : le nettoyeur reste unique, les voies d'injection 2e en profitent aussi.
3. La table ③ couvre 44 composantes (au-delà du seul gabarit fiche_seance demandé) : même coût, meilleure couverture ; le repli reste le libellé long.
4. **Amenées de banc (déclarées)** : `SECU.valide` posé (M-SÉCU hors objet) · l'écran de relecture alimenté directement puis **l'Enregistrement joué au clic réel** (modale comprise) · la liaison du compteur posée par écriture fine (l'objet testé est l'affichage) · `openLinkModal`/`openLevel` appelés en direct dans deux parcours (l'accueil se re-rend par à-coups) · vue admin posée après stabilisation du boot (M8).
5. **Anomalie d'environnement, consignée en transparence** : au fil de la session, des exécutions dont la sortie s'est perdue (commandes interrompues) ont laissé des versions concurrentes d'`editer.py` et `banc.py` dans le dossier de travail. L'état livré a été **adopté après audit complet** : base conforme au mandat, chaîne `editer.py`→livré **reproduite au md5 près**, les 13 éditions relues, l'inventaire vérifié, le banc **relu ligne à ligne** (verdicts sincères, chemin réel, hub intercepté, aucune écriture réelle) et son BILAN issu d'un run unique et propre. Aucune preuve n'est affaiblie ; la provenance double est signalée à l'audit de la conscience.

## 10 · Banc de preuve — **BILAN : 17/17 VERTS**

```
VERT  · P1 · ① le menu Niveau est là, pré-rempli avec le niveau de la page (3e)
VERT  · P1 · ① l'écriture porte niveau:'3e', payload sinon inchangé (titre, diapos, maj
VERT  · P2 · ① sans niveau : badge « niveau non renseigné » + menu « Poser le niveau » sur la carte
VERT  · P2 · ① « Poser le niveau » = UNE écriture fine /site/diaporamas/dp_banc/niveau
VERT  · P2 · ① le filtre agit aussitôt : le 4e disparaît de l'onglet 3e, la convertie (3e) reste
VERT  · P2 · ① sur l'onglet 4e, le diaporama étiqueté 4e est là (avec « niveau 4e »)
VERT  · P3 · ⑤ chapitre sans item : « Aucun item pour l'instant. » (neutre, pas de vert)
VERT  · P3 · ⑤ un item sans liaison : « 1 liaison restante »
VERT  · P3 · ⑤ tous les items liés : « Tout est lié. »
VERT  · P4 · ④ chapitre : UNE écriture (le nouvel objet en fin de liste), rien d'autre
VERT  · P4 · ④ la copie : titre « (copie) », ordre dernier+1, AUCUN published nulle part (dépubliée par retrait, jamais false ni true)
VERT  · P4 · ④ la carte de la copie apparaît, non publiée
VERT  · P4 · ④ diaporama : UNE écriture sous un id neuf, titre « (copie) », sans liaison
VERT  · P5 · ③ le conseil dit les noms courts naturels (« l'objectif, la durée »), apostrophes codepoints
VERT  · P6 · ② modale LIER ouverte à 390 : les boutons flottants s'effacent (plus de chevauchement)
VERT  · P6 · ② à la fermeture : les flottants reviennent d'eux-mêmes
VERT  · P7 · `published` : jamais écrit à true (corps) ni par chemin, sur tout le banc
=== BILAN complément : 17/17 VERTS ===
```

## 11 · Captures (au sas, `captures/`)

`p1_menu_niveau_conversion` · `p2_poser_niveau` (**la carte avec « Poser le niveau »**) · `p2_poser_niveau_390` · `p3_compteur_vide` / `p3_compteur_restante` / `p3_compteur_lie` (**les trois états**) · `p3_compteur_390` · `p4_chapitre_copie` · `p5_conseil_noms_courts` · `p6_lier_390_sans_flottants` (**la modale LIER 390 corrigée**).

---
**STOP.** Livraison au sas complète : `SITE-COURS-3a-complement/index.html` + `rapport.md` + 10 captures. J'attends l'audit de la conscience n°5, puis le « promeus ».
*[exécutant C5-3ac]*
