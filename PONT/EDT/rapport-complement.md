# LOT 2bis — RAPPORT DE COMPLÉMENT · ④bis LA VUE ANNÉE

*Candidat `8.71.0` au sas, 1 620 999 octets. Aucune promotion.*
*Écrit pour une conscience qui n'a pas vu la conversation.*

---

## ⓪ CE QUI ÉTAIT DÉJÀ FAIT AVANT CE MANDAT — et ce qui ne l'était pas

Paul a demandé la refonte de la vue Année **avant** l'arrivée de ce mandat de complément (« ta capture de la vue année montre quelque chose qui a l'air cassé »). Une première refonte a donc été livrée et déposée au sas. Le §④bis recoupe ce travail. Point par point, l'état **avant** ce mandat :

| Exigence du §④bis | État à l'arrivée du mandat |
|---|---|
| les mois nommés (septembre → juillet) | **déjà fait** — 12 mois écrits |
| les vacances en bandes | **déjà fait** (bandes) — mais **sans leur nom** |
| les jalons repérables **au survol** | **déjà fait** (infobulle date + libellé) |
| les jalons repérables **au clic** | *manquait* |
| un trait « aujourd'hui » identifié | **déjà fait** — trait rouge, nommé dans la légende |
| une légende | **déjà fait** — joué / prévu / sans cours / jalon / aujourd'hui |
| sans scroll aux deux tailles | **déjà fait** |
| **une ligne par classe de la grille, toujours, même vide** | *manquait* — seules les classes appariées avaient une ligne |
| **dire ce qui n'est pas là** (« non encore importée », « aucun chapitre publié ») | *manquait* |
| **occuper la hauteur** | *manquait* — lignes de 34 px collées en haut |
| pourcentage de surface mesuré, avant / après | *manquait* |

*Fait au passage, non demandé :* les boutons flottants du site (« Panneau prof », « Mes applications ») passaient **par-dessus** l'écran de l'EDT, à cheval sur sa barre. Ils sont effacés le temps de l'affichage, au patron de `at-corps-fige`, et reviennent à la fermeture. Cela valait pour les quatre vues.

Le présent complément traite les cinq points qui manquaient.

## ① UNE LIGNE PAR CLASSE DE LA GRILLE, ET ELLE DIT POURQUOI ELLE EST VIDE

La boucle sautait toute case sans `classeMjpc`. Résultat : trois des quatre classes de Paul n'existaient pas à l'écran, et rien ne disait pourquoi. Désormais **une ligne par classe de la grille**, appariée ou non, publiée ou non, avec son motif écrit dans la piste :

- `classe non encore importée — à apparier dans le panneau prof`
- `aucun chapitre publié à cette classe`

**Mesuré, état réel du hub** (une seule classe appariée, un chapitre) : **4 lignes**, dont **3 motifs écrits**.
**Mesuré, aucune classe appariée** : 4 lignes, 4 motifs — l'année vide dit ce qu'elle est.

## ② LA HAUTEUR OCCUPÉE — mesurée, avant et après

La mesure porte sur la surface sous la barre d'outils (717 px à 1366×768), et compte ce qui porte réellement de l'information : l'échelle des mois, les pistes, la légende.

| | surface porteuse | % de la surface utile | lignes |
|---|---|---|---|
| **avant ce complément** (état réel du hub) | ~110 px | **~15 %** | 1 |
| **après** (état réel du hub) | 566 px | **58,9 %** | 4 |
| **après** (4 classes appariées, 2 chapitres) | 566 px | **58,9 %** | 4 |

Les pistes se répartissent dans la hauteur (34 px au minimum, 96 px au maximum) et le bloc est **centré verticalement** : le vide restant est réparti, pas rejeté en bas. Je n'ai pas cherché les 100 % : une barre de 300 px de haut pour une classe ne dirait rien de plus, elle mentirait sur la place qu'occupe une classe. Le critère tenu est celui du mandat — plus de « filet de 8 pixels perdu en haut d'une page noire ».

## ③ LES TROIS AUTRES POINTS

**Le nom des périodes sans cours** est écrit sur la bande quand elle est assez large : `d'été (avant`, `Toussaint`, `Noël`, `Hiver`, `Printemps`, `été` — six sur sept, la septième (le pont de l'Ascension, 3 jours) reste en infobulle faute de place.

**Les jalons au clic** : les **30** jalons portent un `onclick` qui dit la date et le libellé (`edtDireJalon`, qui passe par `atInfo`, déjà au contrat). Le survol reste.

**La légende dit tout ce que l'écran montre** : joué (première → dernière heure) · prévu, pas encore joué · sans cours · jalon commun (cliquable) · aujourd'hui · et une ligne sur ce que portent les noms — le palier de divergence, et « expérimentale = ses chiffres comptent mais se déclarent ».

## ④ UN DÉFAUT TROUVÉ PAR LA CAPTURE « ANNÉE REMPLIE »

Avec deux chapitres publiés et aucun joué, les deux barres « prévu » se posaient **au même endroit, à la même largeur** : elles se recouvraient et leurs titres devenaient illisibles. C'est la capture exigée par le mandat qui l'a montré — l'état à une classe ne pouvait pas le révéler. Les barres prévues se suivent désormais dans l'ordre du chapitre.

## ⑤ CE QUI N'A PAS BOUGÉ

Rejoué en entier après la modification :

| | |
|---|---|
| porte du pilotage | **les six champs toujours identiques** |
| sans scroll | 1366×768 et 1920×1080, `scrollY` 0 après tentative à 4000 px |
| portes ① et ③ | présentes, mesurées |
| moteur `AT_DR_B64` | **intact**, md5 inchangé |
| `published` | **97** |
| `secu*` | **141 occurrences** — inchangé |
| double parseur | vert, 2 scripts |
| garde `verif_edt.py` | **VERT**, rouge sur les trois contrôles négatifs |
| contrat | **inchangé** — `edtDireJalon` n'appelle que `atInfo`, déjà déclaré |

---

# LIVRAISON ① — LES VERSIONS DATÉES DE LA GRILLE

*Candidat **8.72.0**, 1 628 778 octets.*

## ⑦ LE MODÈLE

La grille porte des **versions**, chacune avec sa date d'effet : `{debut, libelle, creneaux[]}`. `edtGrilleA(iso)` rend la dernière dont `debut <= iso`. **Toute lecture de cases passe par elle** : `edtCasesDuJour` (donc `edtProjeter`, donc les quatre vues) lit la version de **sa** date ; ce qui n'est pas daté — appariement, cartes, divergence, vue Année — lit la version en vigueur aujourd'hui (`edtCasesCourantes`) ou toutes les versions (`edtToutesLesCases`) quand c'est la classe qui compte et non la date.

**Compatibilité, mesurée sur le fichier du sas tel quel** : forme ancienne au hub (`creneaux` à la racine), **1 version lue**, datée du `2026-08-01`, marquée « ancienne », **30 cases**. Aucune réinjection exigée. La bascule vers la forme datée se fait au premier geste sur les versions (`edtNormaliserGrille`), pas avant.

## ⑧ LES PREUVES

**Deux versions, la même page, deux dates.** Une version au 3 novembre où la 4 HUGO passe du mardi 13:00 au jeudi 11:04 :

| Semaine affichée | Ce que la 4 HUGO occupe |
|---|---|
| 7 septembre, **avant** le changement | mar 8/9 **13:00-13:55** · mer · jeu 15:07 · ven |
| 7 septembre, **après** le changement | **identique, au caractère près** |
| 9 novembre | plus de mardi 13:00 · **jeu 12/11 11:04-11:59** |

**Le passé ne bouge pas** : la trace du 7 septembre au hub, champ à champ après le changement — `creneau: 08:57-09:52`, `clos: true`, `fin: 09:52`, 3 activités. Inchangée.

**La marque sur la semaine** : « emploi du temps modifié le 2026-11-03 », affichée dans le bandeau dès que la version en vigueur n'est plus la première. Discrète, et seulement là.

**Trois refus nommés** :
- deux versions au même jour → « une autre version commence déjà le 2026-09-01 — deux versions ne peuvent pas prendre effet le même jour » ;
- date hors année scolaire → « cette date est hors de l'année scolaire (2026-08-01 → 2027-07-31) » ;
- version sans créneau → « aucun créneau : une version vide effacerait ta semaine ».
Et la dernière version ne peut pas être retirée.

**L'écran des versions**, dans la section Emploi du temps : 2 lignes, date et libellé modifiables, nombre de cases, la version en vigueur marquée **en vigueur**, un bouton de retrait, « + Nouvelle version à partir d'une date » (qui recopie la version en vigueur), et le **journal des changements d'emploi du temps** — séparé du journal des décisions horaires, comme le mandat l'exige. Mesuré : `["4 HUGO : mardi 13:00 → jeudi 11:04 / effet le 2026-11-03", "version créée — changement de novembre / effet le 2026-11-03"]`.

**Le prompt de la grille** produit désormais la forme `versions` avec **une seule entrée**, datée du jour de la rentrée. Le JSON déjà validé au sas reste valable et n'est pas touché.

## ⑨ NON-RÉGRESSION

| | |
|---|---|
| porte du pilotage | **six champs identiques** |
| sans scroll | 1366×768 et 1920×1080, `scrollY` 0 |
| décisions horaires, ↶ Annuler | inchangés |
| divergence, écarts justifiés | inchangés |
| portes ① et ③ | présentes |
| moteur `AT_DR_B64` | **intact** |
| `published` | **97** · `secu*` **141** |
| double parseur | vert |
| garde | **VERT**, rouge sur les trois contrôles négatifs |
| contrat | **inchangé** |

Banc dédié : `tests/banc-versions.mjs`. Captures : `7-1-semaine-version1`, `7-2-semaine-version2`, `7-3-ecran-versions`.

## ⑩ CE QUI RESTE DU MANDAT DE COMPLÉMENT

Non commencé, dans la découpe proposée par la conscience :

- **②** le glisser-déposer et la question du dépôt (changement d'emploi du temps / déplacement d'une heure) ;
- **③** le déplacement au-delà de 21 jours, sur un trou (« heure ajoutée »), et les refus nommés ;
- **⑤** bancs complets, matrice refaite avec le glissé, mise à jour de `SEQUENCE-TEST-PAUL.md`.

Le candidat est passé en **8.72.0** avec cette livraison ①.

**Fichiers touchés** : `index.html` · `tests/banc-annee.mjs` (trois états mesurés) · `tests/5-2-annee.png`, `tests/5-2b-annee-vide.png`, `tests/5-2c-annee-remplie.png`.

*Mot à attendre : **continuer**.*
