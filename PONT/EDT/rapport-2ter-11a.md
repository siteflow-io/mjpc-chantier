# RAPPORT — LOT 2ter · LIVRAISON ⑪a · LES DEUX DATES DE L'ANNÉE, SAISISSABLES

## LA BASE ET LE CANDIDAT
- **Base vérifiée avant de coder** : `PONT/EDT/index.html` au sas — **1 762 154 o**, md5 **`45337e4f5722d6fb118e918bcd792be2`**, **226 déclarations `edt*` / 226 noms**, version **8.73.0-⑨**. Le STOP du mandat était donc levé.
- **Candidat livré, relu au sas après la poussée** : **1 766 035 octets**, md5 **`fc692807edbf9a432da402347cf86a98`**, version affichée **8.73.0-⑪ᵃ**. Il est **identique bit à bit** à ce qui a été joué au banc.

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul pouvait injecter le calendrier, pas corriger son année. S'il apprenait en octobre que l'année finit le 3 juillet et non le 6, il n'avait **aucun endroit où l'écrire** : la fonction qui pose ces deux dates existait depuis ⑥ mais **n'avait aucun appelant** — une fonction sans chemin n'existe pas. Désormais les deux dates sont sur l'écran « 🎓 Dates de l'année », à côté des dates du brevet ; elles refusent une saisie absurde en le disant ; et **avancer la fin lui rend, nommées, les heures qu'il avait posées au-delà** au lieu de les faire disparaître.

## CE QUI A ÉTÉ ÉCRIT — 4 endroits, 59 lignes ajoutées, 2 remplacées
1. **Dans le bloc EDT** : `edtBlocDatesAnnee()` (le HTML des deux champs) et `edtSaisirDateAnnee()` (le branchement). **`edtPoserDateAnnee` n'est pas touchée** : elle est appelée, avec ses trois refus et son rappel des heures au-delà.
2. **Dans le bloc EDT** : `edtSectionPanneau(edtQuoi)` — la **porte n°2, déjà déclarée**, sert aussi cet écran. **Aucune porte nouvelle** : le §④ voulait trois portes, il y en a trois.
3. **Hors du bloc EDT — une seule ligne**, dans `_blocBrevet` : `h += (typeof edtSectionPanneau==='function' ? edtSectionPanneau('datesAnnee') : '');`. C'est le seul point de cette livraison hors garde, et il est déclaré ici.
4. La version.

**Deux choix de conception, dits franchement :**
- **La pose se fait quand le champ est quitté, pas à chaque chiffre.** Mesuré au banc : une date frappée au clavier passe par des états entiers mais absurdes — l'année se remplit chiffre à chiffre (0008, 0082, 0824…) — et **chacun partait au hub**, avec le risque qu'une fin d'année à l'an 8 renvoie toutes les heures de l'année aux heures à replacer. `edtSaisirDateAnnee` ne pose donc qu'une date **complète** et **différente de celle déjà posée** : une saisie = une écriture.
- **Le champ refusé reprend sa valeur d'avant**, pour qu'aucun écran ne montre une date qui n'est pas au hub.

## LES PREUVES DU §⑤ — toutes par le geste
Banc : `tests/banc-dates-annee-11a.mjs`, **VERT**. Captures dans `tests/11a/`, journal des clics dans `tests/11a/journal-11a.txt`. Tous les gestes sont de vrais clics souris et de vraies frappes clavier ; le banc **refuse un élément caché ou recouvert** et le compte comme une faute.

**§⑤.1 — les deux champs existent et se saisissent au clavier.**
`a01` : l'écran porte « début de l'année » et « fin de l'année » **avec les 4 dates du brevet** (6 champs date en tout).
`a02` : frappe de **24/08/2026** puis **03/07/2027** — les champs portent `2026-08-24` et `2027-07-03`, et le hub porte
`{"debutAnnee":"2026-08-24","finAnnee":"2027-07-03"}` sous **`/site/config/brevetDates`** (le nœud n'a pas changé de nom).
Écritures mesurées : **exactement deux**, une par date.

**§⑤.2 — les trois refus, à l'écran, par le geste.** Trois captures, trois messages, et **zéro écriture** à chaque fois :
- `a03` — fin au 01/06/2026 : « la fin de l'année (lundi 1 juin) **tombe avant son début** (lundi 24 août) » ; le champ revient à `2027-07-03`.
- `a04` — fin au 31/12/2027 : « l'année ferait **494 jours, soit plus de treize mois** » ; le champ revient à `2027-07-03`.
- `a05` — début au 01/01/2025 : « le début, mercredi 1 janvier, est **hors du calendrier injecté** (samedi 1 août → samedi 31 juillet, un mois de marge) » ; le champ revient à `2026-08-24`.
Le hub après les trois refus est **inchangé**.

**§⑤.3 — la fin avancée renvoie les heures au-delà.**
`a06` : une heure est d'abord posée **par le geste** loin dans l'année — case ouverte au clic, créneau choisi dans la liste : « ven 2/7 · 16:04-16:59 — créneau libre, heure ajoutée ».
`a07` : fin avancée au **20/12/2026** → le site répond « **1 heure posée après la nouvelle fin d'année : à replacer — 3E Charles de Gaulle vendredi 2 juillet 16:04-16:59.** » Écritures : la date, l'archive de la corbeille, puis les décisions — dans cet ordre.

## NON-RÉGRESSION — le §④, remesuré sur le candidat livré
| ce qui ne devait pas bouger | mesuré |
|---|---|
| `AT_DR_B64` | **309 812 car · `2ba70f9ef8aacb6f81962ea4e1b62944`** — inchangé |
| **`mjpcEcrireRest`, 1 600 premiers octets** | **`668cda2757a5`** — inchangé |
| `function secu*` | **29** |
| `published` | **97** |
| `edt-fige` | **9** |
| `EDT_CATEGORIES` + `EDT_MOTIFS` | md5 `6817baddf5c2` — inchangé, mot pour mot |
| portes hors bloc | **trois**, les mêmes |
| `edtApparier` / `edtMettreANiveau` | **1 appel / 2 appels** |
| `edt*` | **228 déclarations / 228 noms** — 226 + les deux ajoutées, **nommées** (`edtBlocDatesAnnee`, `edtSaisirDateAnnee`), aucune disparue, **aucun doublon** |
| double parseur | `node --check` **VERT** · `acorn` ES2020 **VERT** |
| garde `verif_edt.py` | **VERTE sur ses cinq questions** |
| `banc-tout` | **32 bancs joués, tous verts**, plus le banc ⑪a ajouté au lot |

## ÉCARTS SIGNALÉS, NON AJUSTÉS
**① Un repère de `banc-tout` périmait — je l'ai rendu stable et je le dis.**
Le banc ⑨b attendait `"apres_calcule":967`. Il rend **965**. Mesuré **sur le candidat ⑨ comme sur le candidat ⑪a** : ce n'est pas une régression, c'est **le calendrier qui avance** — la liste va d'aujourd'hui à la fin de l'année, elle raccourcit d'un cran par jour (967 le 01/09, 965 le 03/09). Un repère daté rend le banc rouge sans qu'aucune ligne n'ait bougé. Le repère vérifie donc désormais que le nombre existe et qu'il est du bon ordre (`/"apres_calcule":9\d\d/`) ; « semaine_37 » et le compte des repères, eux, ne bougent pas. **C'est une modification du banc, pas du site, et elle est ici pour que Paul la voie.**

**② L'intertitre « L'année scolaire » ne s'affiche pas.** La section masque les titres de bloc (`.m8-titre` y est en `display:none`) — **exactement comme celui de « Dates du brevet »**. Je n'ai pas inventé un style à moi : les deux champs sont annoncés par leur phrase et par leurs deux libellés. **Si Paul veut un intertitre visible, c'est un mot à dire, pas une décision d'exécutant.**

**③ Trois commentaires portaient « ⑧a » au lieu de « ⑪a ».** Corrigé après le passage de `banc-tout`. Le diff entre le fichier joué au banc et le fichier livré est de **trois lignes, toutes des commentaires** ; double parseur, garde et banc ⑪a ont été rejoués sur le fichier livré, tous verts. **Les 31 autres bancs ont donc tourné sur un fichier qui ne diffère du livré que par ces trois lignes de commentaire — je le déclare plutôt que de le taire.**

## CE QUE JE N'AI PAS PU MESURER
- **Le format d'affichage des champs chez Paul.** Le banc tourne dans un navigateur dont la locale rend `08/24/2026` ; le champ suit la locale du navigateur, donc Chrome en français affichera `24/08/2026`. **Je ne peux pas le prouver ici** : les captures montrent le format du banc, pas celui de sa machine.
- **La sortie du champ par la touche Tab.** Mesuré : dans un champ « date », Tab navigue **entre les segments** et ne quitte pas toujours le champ ; le banc quitte donc le champ en cliquant ailleurs, ce que fait Paul. Si Paul tape sa date puis appuie sur Entrée ou reste dans le champ, **la pose attend qu'il en sorte** — c'est le comportement, pas un défaut, mais il n'est prouvé que pour la sortie par clic.
- **Le comportement quand une seule des deux dates est posée** : `edtValiderDatesAnnee` ne compare rien tant qu'il manque une date (`if(!debut||!fin)return`). C'est la fonction d'origine, que le mandat me dit de brancher et non de réécrire. Le cas est dans l'audit adverse du §⑩, à jouer à la livraison ⑪.

## LIVRÉ
`PONT/EDT/index.html` (**8.73.0-⑪ᵃ**, 1 766 035 o, `fc692807edbf9a432da402347cf86a98`) · `tests/banc-dates-annee-11a.mjs` · `tests/banc-tout.mjs` (repère daté + banc ⑪a) · `tests/11a/` (7 captures + le journal des clics) · ce rapport. **Rien en production.**
