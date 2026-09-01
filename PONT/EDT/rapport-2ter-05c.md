# RAPPORT — LOT 2ter · livraison ⑤c · BANALISER UNE HEURE, ET CE QUE ÇA COÛTE
Version **8.73.0-⑤c**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ⑤b | 1 719 497 | `f871fb05aa584d11dbcbd35e582b847c` | 8.73.0-⑤b |
| **Candidat ⑤c** | **1 724 157** | **`c1c997e5c934914d7be4a7ffc060b9c0`** | **8.73.0-⑤c** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses quatre questions.

## §③.1 — LE MOT JUSTE
« Ne plus compter cette séance dans la prévision horaire » a disparu : **0 occurrence** dans tout le fichier. La modale d'une case porte maintenant :
> **Banaliser cette heure**
> *La séance continue ailleurs : c'est l'heure qui est banalisée.*
> [les dix catégories] · [préciser la raison] · **[Banaliser cette heure]**

Mesuré sur une heure sans décision : « Banaliser » 2 fois (le titre et le bouton), ancien libellé **0**. Le journal, lui, disait déjà « heure banalisée » depuis ⑤b. Les dix catégories et la précision libre n'ont pas bougé.

## §③.2 — LES DIX CATÉGORIES ET LEUR CLASSEMENT
`EDT_CLASSEMENT`, mesuré catégorie par catégorie sur une vraie heure (⑧.6) — chaque ligne a été posée puis effacée pour la suivante :

| Catégorie | Classement obtenu | Compte |
|---|---|---|
| Évaluation hors séance | **temps de classe** | 0 |
| Reprise ou rattrapage | **temps de classe** | 0 |
| Gestion de classe | **temps de classe** | 0 |
| Événement d'établissement | heure perdue · justifiée | 1 |
| Sortie, voyage, projet | heure perdue · justifiée | 1 |
| Orientation et vie de classe | heure perdue · justifiée | 1 |
| Absence du professeur | heure perdue · justifiée | 1 |
| Absence massive d'élèves | heure perdue · justifiée | 1 |
| Temps libre choisi | heure perdue · **non justifiée** | 1 |
| Autre | heure perdue · **non justifiée** | 1 |

**Le tableau du mandat, ligne pour ligne.** Une heure classée *temps de classe* **sort du compte** : c'est mesuré par la colonne de droite.

## §③.3 — LA BASCULE EST UNE PROPOSITION, ET LE CHOIX DE PAUL SURVIT
Deux boutons dans la modale d'une heure banalisée : *La compter comme temps de classe* / *comme heure perdue*, et *La déclarer justifiée* / *non justifiée* (le second n'apparaît que si l'heure est comptée perdue).

**⑧.7 — la bascule survit au rechargement.** Heure banalisée en « Temps libre choisi » → par défaut **perdue, non justifiée**. Paul la déclare justifiée → puis **rechargement complet depuis le hub** : `{categorie:'Temps libre choisi', justifiee:true, tempsDeClasse:false}`. **C'est son choix qui revient, pas celui de la catégorie.**

**⑧.7bis — temps de classe, l'heure sort du compte.** Bascule mesurée : compte **1 → 0**, `tempsDeClasse:true`, totaux vides.

## §④ — UNE HEURE DÉPLACÉE N'EST PAS UNE HEURE PERDUE
**⑧.8**, mesuré : `edtDeplacerVers` sur une heure de la 3E Charles de Gaulle →
- **nature de la case de départ : `deplacee`** (et non plus `sansSeance`), avec `deplaceeVers:'2026-11-20|10:07-11:02'` ;
- à l'écran, le départ affiche **« heure déplacée vers le vendredi 20 novembre 10:07-11:02 »**, l'arrivée porte `venantDe:'2026-11-17|15:07-16:02'` ;
- dans la modale : « Elle n'est pas perdue : elle a lieu ailleurs, et elle ne compte pas dans tes heures perdues. » ;
- **le compteur l'ignore : 0 avant, 0 après**, totaux vides.

**`sansSeance` n'a pas été retiré du déplacement** — vérifié dans le code (`{sansSeance:true, categorie:'Reprise ou rattrapage', …}` intact). **↶ Annuler défait toujours les deux côtés** : après annulation, plus aucune trace du départ ni de l'arrivée (la clé qui reste au hub est l'heure du test précédent, classée *temps de classe*, et le compte est bien à 0).

## Non-régression — §⑦
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **les dix catégories inchangées, comparées mot pour mot** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**`function edt*` 182 → 185**, aucune disparue ; trois ajoutées, nommées : `edtClassementDe`, `edtBasculerClassement`, `edtBasculerStatut`.
**Les onze bancs rejoués** : heures perdues ⑤a (6 fiches) · motifs ⑤b (↶ Annuler) · coche ②a (0 → 2) · classe d'essai (7/7) · périodes (3/3) · grille datée (pose 6) · migration ②b (10 → 10) · appariement ③a (15/15) · archivage ③ (3 fois archive puis écriture) · prompt ④a (identique bit à bit) · identifiants menteurs.

**Garde** : VERTE ; **ROUGE sur quatre contrôles négatifs** — `mjpcSucces()` dans `edtClassementDe` → ① · `edtClassementDe()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④.

## Écarts signalés, jamais ajustés
1. **Une catégorie inconnue est classée « heure perdue, non justifiée ».** C'est le choix prudent : on ne fait pas disparaître une heure d'un compte sur une catégorie qu'on ne connaît pas, et Paul peut basculer. Aucune catégorie n'est dans ce cas aujourd'hui — les dix sont couvertes.
2. **La bascule n'est offerte que sur les heures banalisées.** Une heure perdue à cause d'un événement du calendrier n'a pas de bouton : c'est la règle de Paul (« sans exception et sans bascule »). Les deux autres motifs, `priseAutreClasse` et `aReplacer`, seront basculables quand les gestes qui les posent existeront — **livraison ⑥**.
3. **Le déplacement écrit toujours `categorie:'Reprise ou rattrapage'`**, donc `tempsDeClasse:true` s'il était relu comme une banalisation. Sans effet : `deplaceeVers` sort l'heure du compte **avant** que la catégorie soit regardée. Je le dis parce que c'est deux règles qui disent la même chose au même endroit.
4. **Les deux bascules ne passent pas par une annonce** : elles ne remplacent aucun motif, elles précisent le classement d'un motif déjà posé. Le journal en garde l'`avant` et l'`après`, et ↶ Annuler les défait comme le reste.
5. **L'écran « Heures perdues » ne montre pas encore le détail par motif** : il donne le total par classe et les fiches d'événements. Le tri par motif n'est pas demandé.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- Les gestes de la modale d'une case passent par **appel de fonction**, déclaré : `edtSansSeance`, `edtBasculerClassement`, `edtBasculerStatut`, `edtDeplacerVers`, `edtAnnulerDecision`. La coche d'une heure dans l'écran Heures perdues reste un **clic réel**. Le parcours complet par clics est la livraison ⑤.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑤c**) · `tests/banc-banalisation-05c.mjs` · `rapport-2ter-05c.md` (ce rapport).

## ARRÊT
Le mot est juste, les dix catégories disent ce qu'elles coûtent, le choix de Paul survit au rechargement, et une heure déplacée ne compte plus comme perdue. **Aucune dette ouverte dans le périmètre.** Reste la livraison **⑤** : l'alerte mensuelle, la cinquième question de la garde, les captures, l'audit adverse. Paul relance par « continuer ».
