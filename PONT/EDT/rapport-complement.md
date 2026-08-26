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

## ⑥ CE QUI RESTE DU MANDAT DE COMPLÉMENT

Non commencé, dans la découpe proposée par la conscience :

- **①** les versions datées de la grille (`edtGrilleA(iso)`), la compatibilité avec la forme actuelle, l'écran des versions ;
- **②** le glisser-déposer et la question du dépôt (changement d'emploi du temps / déplacement d'une heure) ;
- **③** le déplacement au-delà de 21 jours, sur un trou (« heure ajoutée »), et les refus nommés ;
- **⑤** bancs complets, matrice refaite avec le glissé, mise à jour de `SEQUENCE-TEST-PAUL.md`.

Le candidat reste en **8.71.0** : le passage en 8.72.0 accompagnera la première livraison de ce mandat, qui touche la forme de la grille.

**Fichiers touchés** : `index.html` · `tests/banc-annee.mjs` (trois états mesurés) · `tests/5-2-annee.png`, `tests/5-2b-annee-vide.png`, `tests/5-2c-annee-remplie.png`.

*Mot à attendre : **continuer**.*
