# RAPPORT — LOT 2ter · livraison ⑤b · UNE HEURE NE COMPTE JAMAIS DEUX FOIS
Version **8.73.0-⑤b**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ⑤a | 1 716 493 | `20dc0ca1a8d271e0777056f1dd0e0f64` | 8.73.0-⑤a |
| **Candidat ⑤b** | **1 719 497** | **`f871fb05aa584d11dbcbd35e582b847c`** | **8.73.0-⑤b** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses quatre questions.

## Ce qui a été fait
**`EDT_MOTIFS`** — les quatre motifs, avec le statut qui en découle et la règle de bascule, mesurés à l'écran :

| motif | libellé | statut par défaut | basculable |
|---|---|---|---|
| `calendrier` | événement du calendrier | **justifiée** | **non** |
| `banalisee` | heure banalisée | justifiée | **oui** |
| `priseAutreClasse` | heure prise par une autre classe | justifiée | oui |
| `aReplacer` | heure à replacer jamais replacée | **non justifiée** | oui |

Quatre fonctions ajoutées, nommées — **`function edt*` 178 → 182**, aucune disparue : `edtMotifDe(v)` (qui reconnaît aussi les décisions posées **avant** cette livraison), `edtMotifEnClair(v)`, `edtBasculable(v)`, `edtDatePose(v)`.
**Le statut est écrit dans la décision** (`justifiee`), jamais recalculé à l'affichage.

## Preuves — §⑧.5, LA PREUVE QUI COMPTE
Banc : `tests/banc-motifs-05b.mjs`. Commande : `node tests/banc-motifs-05b.mjs index.html`

**Sens 1 — coche d'un événement, puis banalisation de la même heure.**
1. Clic réel sur « 3E Charles de Gaulle · mercredi 14 octobre, 10:07-11:02 → 1 heure » → décision `{ecartJustifie:true, motif:'calendrier', justifiee:true, evenement:'evc:dqzc47', libelle:'Séjour Verdun 3e'}`, **non basculable**, total **1 perdue / 1 justifiée**.
2. Banalisation de la même heure → **l'annonce s'affiche AVANT l'écriture** :
> Cette heure est déjà comptée perdue — événement du calendrier — Séjour Verdun 3e.
> La banaliser remplacera ce motif. L'heure ne sera comptée qu'une fois, et son statut deviendra modifiable.
> — *Annuler* / *Remplacer le motif*

**Écritures avant la réponse : `[]`.**
3. Après « Remplacer le motif » : motif `banalisee`, **basculable true**, et **le total ne bouge pas** — `1 perdue / 1 justifiée` **avant et après**. Jamais deux.

**↶ Annuler rend le motif d'origine**, relu au hub : `{ecartJustifie:true, motif:'calendrier', …, evenement:'evc:dqzc47'}`, avec la même `pose` qu'au départ, et le journal porte « retour arrière — événement du calendrier — Séjour Verdun 3e revient ». Ce n'est pas un effacement : c'est une restauration, prise dans l'`avant` du journal.

**Sens 2 — banalisation d'abord, puis coche de l'événement.** Symétrique, mesuré de la même façon :
- la fiche montre l'heure **décochée** avec son motif et sa date : « 3E Charles de Gaulle · mercredi 14 octobre, 10:07-11:02 → 1 heure · *heure banalisée (Événement d'établissement) le 1 septembre* » ;
- clic réel sur la case → **l'annonce s'affiche avant l'écriture** :
> Cette heure est déjà comptée perdue — heure banalisée (Événement d'établissement).
> La compter perdue à cause de « Séjour Verdun 3e » remplacera ce motif. L'heure ne sera comptée qu'une fois, et son statut ne sera plus modifiable.

**Écritures avant la réponse : `[]`** · heures comptées avant : **1** ;
- après « Remplacer le motif » : motif `calendrier`, **basculable false** (le motif qui gagne apporte ses règles), total **1 perdue / 1 justifiée**.

**Jamais de refus, jamais en silence, jamais deux fois** : les deux sens sont mesurés, et dans les deux le compte reste à 1.

## Non-régression — §⑦
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **les dix catégories inchangées, comparées mot pour mot** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**La classe d'essai reste invisible hors mode test** : 7 classes sur 7 aux comptes identiques.
**Les dix bancs rejoués** (les neuf des livraisons précédentes + celui de ⑤a) : écran Heures perdues (6 fiches, 10 cases) · coche ②a (0 → 2) · mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · identifiants menteurs · migration ②b (réinjection 10 → 10) · appariement ③a (15/15, 0 permutation) · archivage ③ (3 fois « 1 archive puis 1 écriture ») · prompt ④a (JSON identique bit à bit).

**Garde** : VERTE ; **ROUGE sur quatre contrôles négatifs** — `mjpcSucces()` dans `edtMotifEnClair` → ① · `edtMotifDe()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④.

## Écarts signalés, jamais ajustés
1. **Deux des quatre motifs ne sont encore posés par aucun geste** : `priseAutreClasse` et `aReplacer`. Leur table est écrite et lisible, mais **les gestes qui les posent sont la livraison ⑥** (les trois issues, l'heure à replacer). Je ne les ai pas branchés : ce serait anticiper.
2. **Le statut d'une heure banalisée est encore `justifiee:true` pour toutes les catégories.** Le classement par catégorie — les dix lignes du §③ — est la livraison **⑤c** ; en attendant, la valeur écrite est celle du motif. Aucune bascule n'est possible pour l'instant : le bouton qui bascule est aussi ⑤c.
3. **↶ Annuler ne restaure que le dernier geste.** Deux annulations de suite rendent la même chose la seconde fois (le journal n'est pas dépilé). Le mandat demande « restaure le motif précédent » — c'est fait ; un vrai historique à plusieurs crans n'est pas demandé, et je ne l'ai pas fabriqué.
4. **Une heure déplacée garde le comportement d'origine** : `edtAnnulerDecision` la défait des deux côtés **sans restauration**, comme le §④ l'exige (« ↶ Annuler reste intact »). La restauration ne s'applique qu'aux heures qui ne portent ni `deplaceeVers` ni `venantDe`.
5. **Le libellé « ne plus compter cette séance » a disparu du journal** (remplacé par « heure banalisée ») mais **le bouton et la modale portent encore l'ancien mot** : le renommage complet est le §③, livraison **⑤c**.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- Deux gestes du banc passent par un **appel de fonction et non un clic**, déclarés : `edtSansSeance(cle)` et `edtAnnulerDecision(cle)` — ils vivent dans la modale d'une case, dont le parcours par clics sera fait aux captures de la livraison ⑤. La coche de l'heure, elle, est un clic réel dans les deux sens.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑤b**) · `tests/banc-motifs-05b.mjs` · `rapport-2ter-05b.md` (ce rapport).

## ARRÊT
Une heure porte un motif et un seul ; le remplacement se dit avant, dans les deux sens ; le total ne double jamais ; le motif qui gagne apporte ses règles ; et ↶ Annuler rend le motif d'avant, pas le vide. **Aucune dette ouverte dans le périmètre.** La suite est **⑤c** : « Banaliser cette heure », les dix catégories et leur classement, la bascule qui survit, l'heure déplacée. Paul relance par « continuer ».
