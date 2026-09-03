# RAPPORT — LOT 2ter · LIVRAISON ⑪b · LA CLASSE D'ESSAI EN COULEUR

## LA BASE ET LE CANDIDAT
- **Base** : le candidat ⑪a au sas — 1 766 035 o, md5 `fc692807edbf9a432da402347cf86a98`, version 8.73.0-⑪ᵃ.
- **Candidat livré** : **1 767 472 octets**, md5 **`4a5aa3d23d2e0eac38cf55ebd5a5fec7`**, version affichée **8.73.0-⑪ᵇ** — relu au sas après poussée, identique bit à bit à ce qui a été joué au banc.

## CE QUE ÇA CHANGE POUR LA CLASSE
Paul : « **il faut simplement qu'elle soit en couleur.** » Au parcours ⑩, la classe d'essai apparaissait bien en mode test — mais sous le nom « 3E Charles de Gaulle », **exactement comme une heure ordinaire** : rien à l'écran ne disait que ces quatre heures étaient des heures d'essai. Devant sa grille, Paul ne pouvait pas distinguer ce qu'il essaie de ce qu'il enseigne. Maintenant, **ses quatre créneaux d'essai sont violets**, dans la semaine comme dans le mois, et **seulement quand le mode test est allumé**.

## CE QUI A ÉTÉ ÉCRIT — 4 endroits, tous dans le bloc EDT
1. **La case retient son origine** : à la construction de la cellule (`edtProjeter`), `essai:!!c.fictif`. Hors mode test, `edtCasesA` ne rend aucun créneau fictif : **la marque ne peut pas exister, et la couleur non plus.**
2. **La semaine** : `edtCelluleHtml` devient une façade de deux lignes qui ajoute la classe `edt-b-essai` au bloc rendu ; **le corps de la case n'est pas réécrit** — il passe tel quel dans `edtCelluleCorps` (fonction ajoutée, nommée). Aucun des huit rendus de nature n'a bougé d'un caractère.
3. **Le mois** : la pastille reçoit `edt-m-essai` en plus de sa classe de nature.
4. **Le CSS**, posé par le bloc lui-même dans `edtPoserCss` : `#a78bfa` — un violet franc, **tenu à l'écart des couleurs déjà prises** (gris pour le prévu, vert pour le joué, ambre pour le banalisé, rouge pour l'alerte).

**Une couleur, rien d'autre** : ni nom changé, ni texte ajouté, ni comportement touché, ni compte modifié — c'est ce que Paul a demandé, et rien de plus.

## LES PREUVES DU §⑤.4 — par le geste
Banc : `tests/banc-classe-essai-couleur-11b.mjs`, **VERT**. Captures dans `tests/11b/`, journal dans `tests/11b/journal-11b.txt`. Tous les gestes sont des clics souris ; le banc refuse un élément caché ou recouvert.

| ce qui est prouvé | mesuré |
|---|---|
| `b01` — **mode test éteint, semaine** | 18 cases, **0 case d'essai, 0 case colorée** |
| `b02` — **l'année, éteinte** | 104 bandeaux |
| `b03` — **mode test allumé, semaine** | 22 cases, **4 cases d'essai, 4 cases colorées** — bordure `rgb(167, 139, 250)`, fond `rgba(167, 139, 250, .16)`, aux quatre créneaux exacts (lundi 8:00, mardi 8:00, jeudi 10:07, vendredi 13:00) |
| `b04` — **mode test allumé, mois** | **24 pastilles colorées** sur 138 cases |
| `b05` — **l'année, allumée** | 104 bandeaux — **autant qu'éteinte** |
| `b06` — **mode test rééteint, semaine** | 18 cases, **0 case d'essai, 0 case colorée** : la couleur disparaît avec la classe |

**Autant de cases colorées que de cases d'essai** : 4 = 4 en semaine. Aucune case réelle n'a été colorée par erreur.

**L'année : rien à colorer, et je le déclare plutôt que d'inventer.** Mesuré : elle montre **104 bandeaux éteinte comme allumée**. Elle ne dessine pas les créneaux de cours mais les événements et les jours de classe ; les heures d'essai n'y apparaissent donc pas du tout. **Il n'y a pas d'omission ici : il n'y a rien à peindre.** Si Paul veut que l'année compte aussi les heures d'essai, c'est un autre mécanisme et un autre mandat — je ne l'ai pas décidé seul.

## NON-RÉGRESSION — le §④, remesuré sur le candidat livré
| ce qui ne devait pas bouger | mesuré |
|---|---|
| `AT_DR_B64` | **309 812 car · `2ba70f9ef8aacb6f81962ea4e1b62944`** |
| **`mjpcEcrireRest`** | **`668cda2757a5`** — inchangé |
| `function secu*` · `published` · `edt-fige` | **29 · 97 · 9** |
| `EDT_CATEGORIES` + `EDT_MOTIFS` | `6817baddf5c2` — mot pour mot |
| portes hors bloc | **trois**, les mêmes |
| `edt*` | **229 déclarations / 229 noms** — 228 + `edtCelluleCorps`, nommée ; aucune disparue, aucun doublon |
| hors mode test, la grille de Paul | **18 cases, identiques** à avant ; les comptes par classe ne bougent pas |
| double parseur | `node --check` **VERT** · `acorn` ES2020 **VERT** |
| garde `verif_edt.py` | **VERTE sur ses cinq questions** |
| `banc-tout` | **34 bancs joués en six tranches, tous verts** — dont ③bis-a « la classe d'essai en mode test », l'audit adverse ③bis, et ⑦b « la vue Année » |

## ÉCARTS SIGNALÉS, NON AJUSTÉS
- **La couleur passe par-dessus la couleur de nature** (`border-left-color` en `!important`). Une heure d'essai déjà jouée ou banalisée serait donc violette plutôt que verte ou ambre. C'est voulu — une heure d'essai ne doit se confondre avec aucune heure réelle — mais **c'est un choix, et Paul peut le renverser d'un mot**.
- **`banc-tout` a été joué en six tranches** (`0→5`, `5→10`, `10→15`, `15→21`, `21→27`, `27→34`) et non d'une seule commande : les commandes longues sont coupées par l'outil dont je dispose. Les 34 bancs ont tourné sur **le même fichier**, celui qui est livré. **Ce n'est pas une commande unique comme la règle le veut ; je le dis au lieu de laisser croire le contraire.**

## CE QUE JE N'AI PAS PU MESURER
- **Le rendu de la couleur sur l'écran de Paul.** Les captures viennent du banc ; le violet mesuré est celui que le navigateur calcule (`rgb(167, 139, 250)`), pas celui que rend sa dalle.
- **La lisibilité en classe, au vidéoprojecteur** : c'est Paul qui la tranchera en regardant `b03` et `b04`.

## LIVRÉ
`PONT/EDT/index.html` (**8.73.0-⑪ᵇ**, 1 767 472 o, `4a5aa3d23d2e0eac38cf55ebd5a5fec7`) · `tests/banc-classe-essai-couleur-11b.mjs` · `tests/banc-tout.mjs` (banc ⑪b ajouté au lot) · `tests/11b/` (6 captures + le journal) · ce rapport. **Rien en production.**
