# RAPPORT — LOT 2ter · livraison ⑤a · L'ÉCRAN « HEURES PERDUES »
Version **8.73.0-⑤a**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ⑤ | 1 711 939 | `8736d113d9f92827ba46d73b3fa4a6e1` | 8.73.0-④ |
| **Candidat ⑤a** | **1 716 493** | **`20dc0ca1a8d271e0777056f1dd0e0f64`** | **8.73.0-⑤a** |

md5 de la base vérifié avant d'écrire une ligne : conforme. md5 du candidat **relu au sas après le push** : identique, garde VERTE sur ses quatre questions.

## Ce qui a été fait
L'entrée s'appelle désormais **« Heures perdues… »**, et l'écran ne règle plus le calendrier : il dit ce qu'il coûte. Sept fonctions ajoutées, nommées — **`function edt*` 171 → 178**, aucune disparue :
`edtNiveauxConnus()` · `edtCoutParNiveau(ev)` · `edtPhraseCout(ev)` · `edtTotauxPerdues()` · `edtHeurePerdue(rang, coche)` · `edtJourEnClair(iso)` · `edtDatesEnClair(debut, fin)`.
Les dates s'écrivent en clair à l'écran (« mercredi 14 octobre », « 13-15 janvier »), jamais en ISO.

## Preuves — §⑧
Banc : `tests/banc-heures-perdues-05a.mjs`, faux hub REST, écran ouvert, **clics réels** sur les cases. Commande : `node tests/banc-heures-perdues-05a.mjs index.html`

**⑧.1 — une fiche par ÉVÉNEMENT, pas par jour.** 6 fiches affichées. Les stages, mesurés à l'écran :
> **Stages 3e** · 17-18 novembre · tes 3e perdraient 2 heures.
>  ☐ 3E Charles de Gaulle · mardi 17 novembre, 15:07-16:02 → 1 heure
>  ☐ 3E Charles de Gaulle · mercredi 18 novembre, 10:07-11:02 → 1 heure

> **Stages 3e horizon Pro** · 13-15 janvier · tes 3e perdraient 3 heures.
>  ☐ … mercredi 13 janvier, 10:07-11:02 → 1 heure · ☐ … jeudi 14 janvier, 16:04-16:59 · ☐ … vendredi 15 janvier, 10:07-11:02

Un stage de trois jours donne **une seule fiche**, avec **une case par heure**.

**⑧.2 — cases vides au départ.** 10 cases, **0 cochée**, **0 heure retirée**, totaux vides. Le conditionnel est là : « perdraient », mesuré.

**⑧.3 — un événement qui ne coûte rien n'a pas de case.** **9 événements** du calendrier ne tombent sur aucune heure de Paul : **aucune fiche pour eux**, vérifié.

**⑧.4 — jamais un nom de classe absent de l'événement.** **6 en-têtes de fiche, 0 nom de classe** : ils parlent en niveaux (« tes 3e perdraient 2 heures »), comme les événements qui portent un niveau et `classes: []`. Les **10 lignes d'heures** nomment une classe, et **les 10 viennent de la grille** — 0 ligne avec un nom qui n'y est pas. Exemple d'en-tête : « Séjour Verdun 3e · 14-16 octobre · tes 3e perdraient 2 heures. » Exemple de ligne : « 3E Charles de Gaulle · mercredi 14 octobre, 10:07-11:02 → 1 heure ».

**Une coche, puis une décoche, par clic réel.**
- coche → **1 écriture** (`/site/edt/decisions/2026-2027`), la décision vaut `{ecartJustifie:true, motif:'calendrier', justifiee:true, evenement:'evc:dqzc47', libelle:'Séjour Verdun 3e', pose:…}`, et la tête affiche : **« 3E Charles de Gaulle · cette année, 1 heure perdue, dont 1 déclarée justifiée. »**
- décoche → **1 archive puis 1 écriture**, 0 décision, 0 heure, totaux vides.

**Une seule case, et le statut ne se saisit pas** : cocher veut dire « cette heure a bien été perdue », et le motif `calendrier` porte `justifiee:true` sans bascule — c'est la règle de Paul, écrite **dans la décision**, pas recalculée à l'affichage.

**⑧.11 — non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **les dix catégories inchangées, comparées mot pour mot** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**La classe d'essai reste invisible hors mode test** : 30 créneaux, 7 classes sur 7 aux comptes identiques.
**Les neuf bancs rejoués** : classe d'essai · identifiants menteurs · mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · coche ②a · migration ②b (réinjection 10 → 10) · appariement ③a (15/15, 0 permutation) · archivage ③ (3 fois « 1 archive puis 1 écriture ») · prompt ④a (JSON copié identique bit à bit).

**⑧.12 — garde** : VERTE sur ses quatre questions ; **ROUGE sur quatre contrôles négatifs** — `mjpcSucces()` dans `edtPhraseCout` → ① · `edtTotauxPerdues()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④. **La cinquième question est la livraison ⑤**, comme la découpe le prévoit.

## Un banc adapté, et je le déclare
**`tests/banc-coche-02a.mjs` a dû être modifié** : il cliquait la case unique d'un événement, qui n'existe plus — il y a maintenant **une case par heure**. Il coche donc les deux heures de la fiche. Conséquence sur ses chiffres, mesurée : **2 clics, donc 2 écritures** au lieu d'une (la seconde précédée de son archive), pour le même résultat — **0 → 2 heures justifiées**, et l'avertissement de remplacement de motif s'affiche toujours, à l'identique. C'est le banc qui a changé, pas la règle.

## Écarts signalés, jamais ajustés
1. **Il n'y a pas de « tout cocher » sur une fiche.** Un stage de trois jours demande trois clics. Le mandat dit « UNE SEULE CASE », dont le sens est « cette heure a bien été perdue » : je n'ai pas ajouté de bouton de confort qui n'était pas demandé. **Je signale que trois clics pour un stage, ce sera peut-être long à l'usage.**
2. **La phrase du coût nomme tous les niveaux connus**, y compris à zéro (« tes 3e perdraient 2 heures ; tes 4e, zéro »), parce que c'est la phrase de Paul. Les niveaux viennent de la grille, pas d'une liste écrite en dur.
3. **Les totaux en tête comptent toute heure marquée perdue** — coche d'événement ou banalisation — **sauf les heures déplacées** (`deplaceeVers`), qui sont déjà exclues. Le §④ le formalise en ⑤c ; le compte est écrit pour ça dès maintenant, et je le dis.
4. **Le motif et le statut sont écrits dans la décision** (`motif:'calendrier'`, `justifiee:true`) : c'est ce que le §② demandera en ⑤b. Rien d'autre du §② n'est anticipé — **le remplacement de motif entre coche et banalisation reste celui de la livraison ②** (avertissement, un seul motif par clé), il sera repris et prouvé en ⑤b.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- **Les captures par clics** : livraison ⑤, comme la découpe le prévoit.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑤a**) · `tests/banc-heures-perdues-05a.mjs` · `tests/banc-coche-02a.mjs` (adapté) · `rapport-2ter-05a.md` (ce rapport).

## ARRÊT
L'écran dit ce que l'année coûte : une fiche par événement, une case par heure, rien de retiré tant que Paul n'a pas coché, et le total par classe en tête. **Aucune dette ouverte dans le périmètre.** La suite est **⑤b** : les quatre motifs, **une heure qui ne compte jamais deux fois**, et ↶ Annuler. Paul relance par « continuer ».
