# RAPPORT — LOT 2ter · livraison ⑤c-ter · TOUTES LES ARCHIVES PORTENT L'ÉTAT D'AVANT
Version **8.73.0-⑤c-ter**. Correctif demandé par Paul le 01/09, dans le prolongement de ⑤c-bis.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ⑤c-bis | 1 725 303 | `a397e48a206b70b965648d77c4e9d0b5` | 8.73.0-⑤c-bis |
| **Candidat ⑤c-ter** | **1 727 359** | **`885ae067afe7025d1213efe85930fbe3`** | **8.73.0-⑤c-ter** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses quatre questions.

## Ce qui a été fait
`edtPhotoDecisions` devient un cas particulier de **`edtPhotoDe(nom)`** — une fonction ajoutée, nommée (**`function edt*` 186 → 187**), qui photographie `EDT[nom]` **avant toute mutation** et rend `null` si l'objet n'est pas au hub. Les quatre écritures signalées par Paul la prennent en tête de fonction et écrivent par `edtEcrireArchive` :

| Écriture | Ce qui était muté avant l'archivage |
|---|---|
| `edtCreneauPoser` | `t[champ]` sur un créneau de `EDT.creneaux` |
| `edtApparierNom` | `c.classeMjpc` sur les cases de `EDT.grille` |
| `edtReglagePoser` | `r[nom]` sur `EDT.reglages` |
| `edtPhoto` | `o.photos.push(...)` sur `EDT.photos` |

**`edtEcrireGrille`, vérifié selon ses appelants comme demandé** : elle ne peut pas prendre la photo elle-même, parce que `edtNormaliserGrille()` lui rend `EDT.grille` **déjà muté** (versions créées, `creneaux` supprimé). Elle reçoit donc un quatrième paramètre `avant`, et ses **quatre** appelants le lui passent, photo prise avant tout : `edtVersionAjouter`, `edtVersionPoser`, `edtVersionSupprimer`, `edtChangerEmploiDuTemps`. Sans photo reçue, elle retombe sur l'ancien comportement.

**Un cinquième cas trouvé en vérifiant les appelants, fermé ici et déclaré** : `edtPeriodesEcrire` a exactement le même problème — `edtPeriodes()` rend la liste vivante, et **trois gestes la mutent avant d'appeler** (`edtPeriodePoser` change un champ, `edtPeriodeAjouter` pousse, `edtPeriodeDeplacer` permute). Même remède, même quatrième paramètre. `edtPeriodeSupprimer` filtre dans un tableau neuf : il n'était pas concerné.

## Preuve — avant / après, geste par geste
`tests/banc-archives-objets-05cter.mjs` : pour chaque geste, on relit **l'archive réellement écrite à la corbeille** et on regarde ce qu'elle contient. Commande : `node tests/banc-archives-objets-05cter.mjs index.html`

| Geste | dans l'archive AVANT le correctif | dans l'archive APRÈS | au hub |
|---|---|---|---|
| `edtReglagePoser` — semaine A : A → B | **« B »** (l'état d'après) | **« A »** | « B » |
| `edtCreneauPoser` — un libellé d'horaire | **« HORAIRE RETOUCHÉ »** | **« (vide) »** | « HORAIRE RETOUCHÉ » |
| `edtApparierNom` — une classe appariée | **« 4E BANKSY »** | **« (vide) »** | « 4E BANKSY » |
| `edtPhoto` — une seconde photo | **2 photos** | **1 photo** | 2 photos |
| `edtVersionAjouter` — une version datée | **2 versions** | **la grille d'avant, forme simple, 30 créneaux** | 2 versions |
| `edtPeriodePoser` — une période renommée | **« Trimestre 1 (renommé) »** | **« Trimestre 1 »** | « Trimestre 1 (renommé) » |

Six gestes, six archives qui ne protégeaient rien, six archives qui protègent maintenant.

## Non-régression
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**Les treize bancs rejoués** : décisions ⑤c-bis (archive à 1 heure) · heures perdues ⑤a (6 fiches) · motifs ⑤b (↶ Annuler) · banalisation ⑤c (les 10 catégories) · coche ②a (0 → 2) · classe d'essai (7/7) · périodes (3/3 partout) · grille datée (pose 6, 0 permutation) · identifiants menteurs · mise à niveau (4 scénarios à 0 écriture) · migration ②b (10 → 10) · appariement ③a (15/15) · archivage ③ (3 fois « 1 archive puis 1 écriture ») · prompt ④a (identique bit à bit).
**Garde** : VERTE ; **ROUGE sur quatre contrôles négatifs** — `mjpcSucces()` dans `edtPhotoDe` → ① · `edtPhotoDe()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④.

## Écarts signalés, jamais ajustés
1. **Les quatre écritures qui restent sur `edtEcrireObjet` sont saines, vérifiées une par une** : `edtInjInjecter` écrit l'objet collé (neuf), `edtInjecterAvecLaGrille` écrit deux objets neufs (`k` et `p`), et `edtPeriodesEcrire` construit lui aussi un objet neuf — c'est **l'appelant** qui mutait, d'où le paramètre `avant`. Aucune autre écriture du bloc ne passe une référence vivante mutée.
2. **La photo est une copie JSON complète de l'objet, à chaque geste.** Sur la grille (≈ 8 ko) et le calendrier (≈ 20 ko), c'est indolore ; sur les **photos du prévu**, qui grossissent à chaque prise, la copie grandira avec elles. À remesurer le jour où Paul en aura pris beaucoup — je le signale plutôt que d'attendre qu'on le découvre.
3. **`edtEcrireGrille` garde un comportement de repli** si aucune photo ne lui est passée (elle reprend `EDT.grille`). Les quatre appelants la passent tous aujourd'hui ; le repli existe pour qu'un appelant futur qui l'oublierait n'écrive pas sans archive du tout — mais il archiverait alors l'état d'après. **Il n'y a pas de garde automatique là-dessus** : c'est un point à surveiller, ou à confier à `verif_edt.py` si Paul le veut.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : le banc tourne sur un faux hub ; le sas n'est pas publié en Pages.
- Les gestes du banc passent par **appel de fonction**, déclaré (`edtReglagePoser`, `edtCreneauPoser`, `edtApparierNom`, `edtPhoto`, `edtVersionAjouter`, `edtPeriodePoser`) : ils vivent dans le panneau prof et dans la modale d'une case, dont les parcours par clics sont couverts par les captures des livraisons précédentes.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑤c-ter**) · `tests/banc-archives-objets-05cter.mjs` · `rapport-2ter-05c-ter.md` (ce rapport).

## ARRÊT
Toutes les écritures du bloc qui remplacent un état archivent maintenant **l'état d'avant** — six gestes prouvés côte à côte. **Aucune dette ouverte dans le périmètre.** Reste la livraison **⑤** : l'alerte mensuelle, la cinquième question de la garde, les captures, l'audit adverse. Paul relance par « continuer ».
