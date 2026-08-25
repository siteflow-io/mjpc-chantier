# LOT F — LE MUR SUIT LA POSITION, ET LE DÉVOILEMENT NE SE PERD PLUS
Exécutant MJPC · 25/08/2026 · candidat `PONT/TABLEAU-DISTANT/lotF/index.html`. **STOP après livraison. Je ne promeus pas.**
Phase 0 dans `rapport-phase0.md`. **Aucune dette déclarée.**

## CE QUE ÇA CHANGE POUR LA CLASSE
La classe voit **exactement le morceau que le professeur a sous les yeux**, et **rien de ce qui a été dévoilé ne se revoile** quand le zoom bouge, quel que soit l'appareil qui le bouge. Au téléphone, le zoom du tableau se pilote avec **deux gros boutons** au lieu d'une réglette impossible à viser au doigt.

## ⓪ SCEAU
| | commande | sortie |
|---|---|---|
| base 8.69.0 | `md5sum` / `wc -c` | `3b945b55daee272a1809a638ed170531` · 1 513 609 octets |
| candidat | `wc -c` puis `stat -c '%s'` | **1 522 285 octets** (deux fois) |
| md5 | `md5sum` | **`2cbd75cd4d0a6262a71adf1d9106c975`** · **+8 676 octets** |
| `APP_VERSION` | | **8.70.0** |
| double parseur | `node --check` + acorn ES2020 | **VERT** |
| moteur `AT_DR_B64` | | **identique à l'octet** · `AT_DR_SHA256` inchangé |
| `secu*` **29 → 29** · `published` **97 → 97** · fonctions perdues **0** · neuves **4** | | |

## ① LA RACINE — une ligne
`sesPhoto` calculait le cumul du dévoilement ainsi : `if(e.suite) _vp=_drVuePere(W,n)`. **Le cumul n'était calculé que depuis un morceau de SUITE.** Un PC scindé resté sur le morceau 0 émettait donc les `vues` de ce seul morceau — **3** au lieu de **6**. Tout le reste en découlait : le mur se trompait de morceau, le PC recevait son propre chiffre faux et l'écrasait sur lui-même, et le dézoom recollait 3 + 0. **Les deux conflits n'en faisaient qu'un.**

## ② CE QUI A ÉTÉ ÉCRIT
| | |
|---|---|
| `_drVueGroupe` (neuve) | le dévoilement du **groupe entier** — le référentiel unique. `_drVuePere` intouchée, elle garde son emploi pour l'offset de fiche |
| `_drRangDuMorceau` (neuve) | le rang local d'un morceau donné, `null` s'il n'existe pas — le récepteur reste alors où il est plutôt que de sauter |
| `_drLargeurEcran` (neuve) | la **fenêtre du moteur** de l'émetteur, pas sa boîte `.ecran` : celle-ci dépend des colonnes de l'hôte, et la reproduire seule effondre la mise en page (mesuré : cadre à 632 px → `.ecran` tombait à 152×0) |
| `sesTelCranPas` (neuve) | un appui = un cran, avec butées |
| `sesPhoto` | émet le dévoilement du groupe, `pos` (**déclaré**, pas déduit), et la boîte de l'émetteur |
| `sesAppliquer` | un récepteur scindé **recolle avant d'appliquer**, puis se place sur le morceau reçu |
| `_sesTabComposer` | le mur suit la **position** quand la source en a une ; **un seul gabarit décide** |
| `_sesTabBoite` | le cadre de découpe prend la **boîte exacte** de l'écran de contrôle |

## ③ CE QUE LE BANC A CORRIGÉ EN COURS DE ROUTE — trois erreurs à moi, nommées
1. **J'ai cru que la géométrie suffisait.** J'ai donné au cadre du mur la boîte exacte du pilote — contenu 585×313, police 32,3505 px, identiques au centième. **La découpe n'a pas bougé** : `[2,1,3]` contre `[3,3]`. Ce n'était pas ça.
2. **Deux gabarits décidaient pour une seule découpe.** Le LOT E coupait d'après le **cadre** et vérifiait le rognage sur la **toile** — qui rend 0,848× la hauteur du cadre à contenu et proportion égaux (mesuré). **Compteur au banc : 1 re-découpe de trop.** Le professeur voyait [1·2·3], le mur projetait [1·2].
3. **J'ai d'abord supprimé le filet, et j'ai cassé le LOT E** (3 échecs sur 9) : la cascade de `degorge` ne vérifie que l'écran courant, un morceau suivant peut déborder — le filet était nécessaire. Il est revenu, **mesuré sur le cadre**, le gabarit qui décide. Jamais sur la toile.

## ④ LES PREUVES
### Les deux conflits, avant / après (banc à trois pages, téléphone comme source)
| | 8.69.0 | 8.70.0 |
|---|---|---|
| tout dévoilé | 6/6 · scène `vues {0:6}` | 6/6 |
| **cran 5** | scène **`{0:3}`** · PC morceau 0 · **mur morceau 1** · **étape 3 seule** | scène **`{0:6}`** · PC morceau 0 · **mur morceau 0** · **étapes 1 2 3** |
| cran 3 | 3/6 | 6/6 · étapes 1 2 3 |
| **dézoom** | **3/6** — étapes 4·5·6 **revoilées** | **6/6** · étapes 1 2 3 4 5 6 |
| découpe au cran 5 | PC `[3,3]` / mur `[2,1,3]` | **PC `[3,3]` / mur `[3,3]`** |

### Tous les bancs rejoués sur le candidat
| banc | résultat |
|---|---|
| phase 0 LOT F (3 pages) | **rien n'est revoilé · même morceau à chaque cran** |
| LOT E · mur **16/9** (5 crans, replier, gel, dégel, reprise à froid) | **9 / 9** |
| LOT E · mur **4/3** | **9 / 9** |
| LOT E · **téléphone** (3 gestes + téléphone seul, PC fermé) | **4 / 4** · rien d'amputé (389/765) |
| LOT E · **deux réglettes** (3 pages) | **3 / 3** · 5 → 2 → 4 · 30 cycles sans oscillation |
| LOT E · **étape longue** | **8 / 8** · recollée à 405 signes = l'original · export 1 étape · récit une fois |
| LOT E · Win+K non-régression | 30,2 · 40,3 · 47,9 · 55,4 · 65,5 px · **0 rogné** |
| LOT D · identités | **0 décalage / 11 pas** |
| **total** | **41 épreuves, 0 échec · 0 écriture sortie · 0 `pageerror`** |

### La télécommande
Réglette supprimée du téléphone ; **deux boutons de 64 px** (le mandat en demandait 56), un cran par appui, **butées aux crans 1 et 5** (bouton désactivé), le cran affiché entre les deux. `ses-tel-rz` n'apparaît **plus une seule fois** dans le fichier. `W.zoom()` jamais appelé : l'empreinte du prompteur du téléphone est **identique** à chaque geste, son `iz` reste à 1.

## ⑤ MATRICE ACTIONS × ÉTAT
| ligne | effet du LOT F |
|---|---|
| copier / dupliquer · couper / coller · déplacer · supprimer · ajouter | **aucun** : aucun chemin de ces gestes n'est touché |
| **zoom / dézoom** | le dévoilement émis est celui du **groupe entier**, jamais un cumul partiel : **il ne recule plus jamais sous le zoom**. Le mur suit **la position** quand la source en déclare une, et découpe dans la **boîte exacte** de l'écran de contrôle — même découpe, prouvée. Les fils n'ont toujours aucune identité et ne traversent jamais la scène |
| ouvrir / fermer une fiche | la fiche suit le morceau choisi ; `_drVuePere` intouchée, son offset est conservé |

## ⑥ CE QU'AUCUN BANC NE PROUVERA
Le hub réel · **la latence** (hors périmètre, lot 3) · le vidéoprojecteur · trois appareils physiques · **le doigt de Paul sur les boutons** · et si un élève du fond lit vraiment. Le seul juge est Paul, debout au fond de sa salle.

---
*Livré au sas, non promu, sans dette. Point de retour : production 8.69.0, md5 `3b945b55daee272a1809a638ed170531`.*
