# RAPPORT — LOT 2ter · livraison ⑤c-bis · L'ARCHIVE DES DÉCISIONS PORTE L'ÉTAT D'AVANT
Version **8.73.0-⑤c-bis**. Correctif demandé par Paul le 01/09. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ⑤c | 1 724 157 | `c1c997e5c934914d7be4a7ffc060b9c0` | 8.73.0-⑤c |
| **Candidat ⑤c-bis** | **1 725 303** | **`a397e48a206b70b965648d77c4e9d0b5`** | **8.73.0-⑤c-bis** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses quatre questions.

## Ce que Paul a vu, et ce que ça cachait
**Son signalement** : dans `edtHeurePerdue`, branche décoche, le `delete edtD[edtF.classe].heures[edtF.cle]` est redondant — `edtEcrireDecisionsGroupe` avec `valeur:null` fait déjà le retrait — **et il modifie la mémoire avant que l'archivage ait réussi**.

**Ce que la vérification a montré, et qui va plus loin.**
1. `edtDecisions()` rend **la référence vivante** `EDT.decisions`. Le `delete` la vidait donc **avant** l'appel suivant : `edtEcrireDecisionsGroupe` lisait ensuite `avant = d[classe].heures[cle]` et trouvait… **rien**. Le journal enregistrait **`avant: null`** : **↶ Annuler n'avait plus rien à rendre**, et le journal disait faux.
2. **La même faute vivait une couche plus bas, et pour toutes les décisions** : `edtEcrireDecision`, `edtEcrireDecisionsGroupe` et `edtRattacherDecisions` mutent `d` (= `EDT.decisions`) **puis** appellent `edtEcrireObjet('decisions', d, …)`, qui archive `EDT['decisions']` — la même référence, **déjà mutée**. **L'archive des décisions portait donc l'état d'après, jamais l'état d'avant.** C'est exactement la faute fermée en **①bis-a** pour la mise à niveau, jamais portée ici.

## Ce qui a été fait
- **Le `delete` est retiré**, comme demandé.
- **`edtPhotoDecisions()`** (une fonction ajoutée, nommée — **`function edt*` 185 → 186**) prend la photo du magasin **avant toute mutation**, et rend `null` quand le hub est vide (rien à remplacer, l'écriture part directement).
- Les **trois** écritures du magasin passent maintenant par `edtEcrireArchive('decisions', edtChemin('decisions'), photo, d, …)` : `edtEcrireDecision`, `edtEcrireDecisionsGroupe`, `edtRattacherDecisions`.

## Preuve — avant / après, même geste, même banc
`tests/banc-archive-decisions-05cbis.mjs` : on coche une heure par **clic réel** dans l'écran Heures perdues, puis on la décoche par **clic réel**. Commande : `node tests/banc-archive-decisions-05cbis.mjs index.html`

| | AVANT (8.73.0-⑤c) | APRÈS (8.73.0-⑤c-bis) |
|---|---|---|
| écritures de la décoche | 1 archive puis 1 écriture | **identique** |
| heures au hub après | 0 | 0 |
| **heures DANS L'ARCHIVE** | **0** — l'archive ne protégeait rien | **1** |
| **journal, `avant` du dernier geste** | **`null`** | **`[ecartJustifie, motif, justifiee, evenement, libelle, pose]`** |

L'archive contient désormais la décision effacée, et le journal garde la décision entière — ce que ↶ Annuler lit pour restaurer.

## Non-régression
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**Les acquis de ⑤a, ⑤b et ⑤c tiennent, remesurés** : coche → 1 écriture, tête « 1 heure perdue, dont 1 déclarée justifiée » · décoche → archive puis écriture, 0 décision · remplacement de motif → annonce avant écriture, total 1 → 1 · **↶ Annuler rend `{motif:'calendrier', evenement:'evc:dqzc47'}`, relu au hub** · les dix catégories inchangées · mise à niveau (4 scénarios à 0 écriture) · migration ②b (10 → 10).
**Garde** : VERTE ; **ROUGE sur quatre contrôles négatifs** — `mjpcSucces()` dans `edtPhotoDecisions` → ① · `edtPhotoDecisions()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④.

## Écarts signalés, jamais ajustés
1. **La photo est une copie JSON du magasin entier** à chaque écriture de décision. Le magasin est petit (une entrée par heure décidée), et c'est le prix d'une archive vraie. Si Paul décide un jour des centaines d'heures, ce sera à remesurer.
2. **↶ Annuler n'apparaît que sur une heure qui porte encore une décision.** Une heure décochée n'a plus de décision : le journal garde ce qu'elle valait, mais le bouton n'est pas là — on la recoche depuis la fiche. Le journal est désormais vrai, ce qui rend la restauration possible partout où le bouton existe.
3. **Les autres objets n'avaient pas ce défaut** : ils passent par `edtEcrireObjet`, qui lit `EDT[nom]` **avant** que l'appelant ne le remplace (l'objet écrit est un objet neuf, pas la référence mutée). Vérifié en relisant les appelants : injection, grille, périodes, créneaux, réglages, photos, absents.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : le banc tourne sur un faux hub ; le sas n'est pas publié en Pages.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑤c-bis**) · `tests/banc-archive-decisions-05cbis.mjs` · `rapport-2ter-05c-bis.md` (ce rapport).

## ARRÊT
Le `delete` est retiré, l'archive des décisions porte l'état d'avant, et le journal garde un « avant » vrai. **Aucune dette ouverte dans le périmètre.** Reste la livraison **⑤** : l'alerte mensuelle, la cinquième question de la garde, les captures, l'audit adverse. Paul relance par « continuer ».
