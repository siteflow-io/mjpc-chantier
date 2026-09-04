# RAPPORT — LOT 2ter · LIVRAISON ⑭-a · LA BORNE DES DATES DE L'ANNÉE (l'affichage et le passé)

## CE QUE ÇA CHANGE POUR LA CLASSE

Paul déclare sa rentrée au 3 septembre, et ses séances commencent le 3. Les jours d'avant
gardent leurs cases — le CODIR, la pré-rentrée, la rentrée des 6e, la rentrée des 5e-4e-3e
restent affichés — mais grises, sans séance, avec leur mot : « avant ta rentrée ».

**Et l'heure qu'il a vraiment faite le 31 août reste jouée, avec ses activités.** Une heure
qu'il a banalisée reste banalisée. Le passé ne se réécrit pas.

**UN EFFET MESURÉ QUE LE MANDAT NE DEMANDAIT PAS EXPLICITEMENT, ET QUI COMPTE** : les jours
hors année **ne consomment plus la file des séances**. Avant cette livraison, les cases du
27 août brûlaient les premières séances du chapitre : la séance 1 était déjà « faite » avant
la rentrée, et tout le reste était décalé d'autant. Ce n'est plus le cas.

## BASE ET CANDIDAT

| | taille | md5 | version |
|---|---|---|---|
| **base** (sas = production, bit à bit) | 1 769 457 | `8837063de4466afb71622e89181ae44a` | 8.73.0-⑪ |
| **candidat** (relu au sas après la poussée) | **1 773 173** | **`1ab4d4a08602abd622572081a42a4b78`** | **8.73.0-⑭a** |

## CE QUI A ÉTÉ ÉCRIT

**① `edtHorsAnnee(iso)` — une seule fonction décide.** Posée juste après `edtDebutAnnee()`.
Elle rend `null` quand le jour est dans l'année ou quand rien n'est déclaré ; sinon un objet
`{cote, borne, libelle}`. Bornes **incluses**.

**ELLE LIT `EDT_DATES.debutAnnee` ET `EDT_DATES.finAnnee` BRUTES.** Mesuré et vérifié :
`edtDebutAnnee()` et `edtFinAnnee()` **inventent** une date quand Paul n'a rien posé
(`…-08-01`, `…-07-31`). Une borne qui les appellerait bornerait toujours, même sur un site
où rien n'est déclaré, et la preuve ⑥.12 serait infaisable. **Les deux côtés sont
indépendants** : Paul peut poser sa rentrée sans poser sa fin d'année.

**② La garde dans `edtProjeter` — posée APRÈS la recherche de trace.** C'est le point dur du
mandat. Les trois gardes du haut (`horsTemps`, `horsMjpc`, `nonImportee`) coupent la suite
avant que le réel ne soit cherché : une quatrième garde posée là aurait effacé les heures
réellement jouées avant la rentrée. La borne remplace **le prévu**, et rien d'autre.

Sont donc protégés, dans cet ordre, parce qu'ils coupent avant elle : les trois natures
existantes, une heure banalisée ou déplacée (`sansSeance`), une heure jouée (`jouee`).
**Et protégés explicitement par la garde elle-même**, parce que ce sont aussi des décisions
de Paul : une heure **ajoutée** à la main, **épinglée**, ou **venue** d'un déplacement
(`cel.ajoutee`, `dec.epingle`, `dec.ajoutee`, `dec.venantDe`).

**③ Le rendu et l'infobulle** — `edtCelluleCorps`, sur le patron exact de `horsTemps` :
`<div class="edt-b edt-b-off" title="…">`. L'infobulle, dans les mots de Paul :

> Ce jour est avant ta rentrée du jeudi 3 septembre. Le site n'y pose aucune séance et ne
> t'y compte aucune heure. Ce que ton établissement a mis ce jour-là reste affiché, et une
> heure que tu as vraiment faite reste jouée. Pour déplacer cette limite : le panneau du
> prof, les deux dates de l'année.

**④ La vue Année** — `edtPeindreAnnee` : plus de pastille de prévu hors année. Une pastille
qui porte une décision de Paul, ou une heure jouée, **reste** : même règle qu'à la semaine.

**⑤ La vue Mois** — elle consomme `edtProjeter`, donc la nature arrive déjà bornée et la
pastille passe en gris (`edt-m-autre`). **Une infobulle lui a été ajoutée** pour qu'elle dise
ce qu'elle est, et pas seulement le nom de la classe.

## LES PREUVES — PAR LE GESTE, JAMAIS PAR LA FONCTION

Banc `tests/banc-borne-annee-14a.mjs`. Tout passe par le clic et le clavier : ouverture du
panneau prof, section « Emploi du temps », bouton « Ouvrir l'emploi du temps », flèches ‹ et ›,
boutons Semaine / Mois / Année, et la frappe des huit chiffres dans le champ de date.
Les seules choses posées « par la donnée » sont des contenus de hub (une heure jouée, une
heure banalisée) — jamais un appel de fonction du site pour produire un écran.
Journal des clics et douze captures d'écran entier : `tests/14a/`.

### ⑥.1 — AUCUNE CASE NE DISPARAÎT (la preuve n°1, parce que c'est le risque n°1)

| vue | cases avant | cases après |
|---|---|---|
| semaine du 24/08 | **20** | **20** |
| semaine du 31/08 | **18** | **18** |
| semaine du 07/09 | **20** | **20** |
| vue mois | **30** cases · **114** pastilles | **30** cases · **114** pastilles |
| vue année | **372** jours · **104** événements | **372** jours · **104** événements |

### ⑥.2 et ⑥.3 — CE QUE PAUL VOIT

| | prévu avant | prévu après |
|---|---|---|
| semaine du 24/08 | 2 | **0** |
| semaine du 31/08 | 3 | **1** (l'heure jouée) |
| semaine du 07/09 | 4 | **4 — intact** |

Le mot « avant ta rentrée » est à l'écran **4 fois** sur la semaine du 31/08.
Captures `a07-apres-semaine-du-24-aout.png`, `a08-apres-semaine-du-31-aout.png`,
`a09-apres-semaine-du-07-septembre.png`.

### ⑥.4 — LES ÉVÉNEMENTS DU CALENDRIER SONT TOUJOURS LÀ

Semaine du 31/08, **4 étiquettes avant, 4 après**, nommées : *préparation rentrée* ·
*Rentrée scolaire des élèves de 6e* · *Rentrée scolaire des élèves de 5e, 4 et 3e* ·
*matin, temps de cohésion*.
Semaine du 24/08 : *vacances d'été (avant la rentrée)* · *13h45 photo 14h30-18h pré-rentrée* ·
*8h30-17h pré-rentrée*.
Vue année : **104 événements, inchangé** — le calendrier injecté n'est pas touché.

### ⑥.5 — UNE HEURE JOUÉE AVANT LA RENTRÉE RESTE JOUÉE

Trace posée au hub sur `2026-08-31_08h57-09h52_3E_Charles_de_Gaulle`, 2 activités, close.
Avant la borne : **1 case jouée**. Après avoir déclaré la rentrée au 3 septembre :
**1 case jouée**. La case n'a pas changé de nature.

### ⑥.6 — UNE DÉCISION AVANT LA RENTRÉE RESTE INTACTE

Heure banalisée (sortie scolaire) posée sur `2026-09-01_15h07-16h02_3E_Charles_de_Gaulle`.
Avant : **1 heure banalisée**. Après : **1 heure banalisée**.

### ⑥.12 — SANS DATE DÉCLARÉE, RIEN NE CHANGE

Au chargement, `EDT_DATES` vaut `{"debutAnnee":null,"finAnnee":null}` et la semaine du 31/08
porte ses **3 séances prévues** : la borne ne s'est pas déclenchée. C'est la preuve que le
repli des deux fonctions n'a pas été appelé.

### ⑥.13 — L'INFOBULLE

Présente sur la case hors année, à la semaine et dans le mois.
Capture `a12-infobulle-de-la-case-hors-annee.png`.

## CE QUI NE DOIT PAS BOUGER — REMESURÉ SUR LE CANDIDAT

| | attendu | mesuré |
|---|---|---|
| `AT_DR_B64` | 309 812 car · `2ba70f9ef8aacb6f81962ea4e1b62944` | **conforme** |
| `function secu*` | 29 | **29** |
| `published` | 97 | **97** |
| `edt-fige` | 9 | **9** |
| `EDT_CATEGORIES` / `EDT_MOTIFS` | 248 / 404 car | **248 / 404** |
| `edtArriveeProf` · `edtOuvrir` · `edtSectionPanneau` | 2 · 4 · 4 | **2 · 4 · 4** |
| garde `verif_edt.py` | verte sur cinq questions | **VERTE** |
| double parseur | `node --check` + acorn ES2020 | **VERT / VERT** |

**UN SEUL ÉCART, ET IL EST DEMANDÉ PAR LE MANDAT** : `edt*` passe de **229 à 230**
déclarations — la fonction unique. 230 déclarations, 230 noms, **aucun doublon**.

## LES BANCS

`banc-tout.mjs` enrichi du banc ⑭a : **il en compte 36**.

Joués sur le candidat, **tous verts** :

- tranche 0→6 : ①bis-a, ①bis-b, ①ter, ②a, ②b, ② — 18 repères
- tranche 24→31 : ⑥ les dates, ⑦b la vue Année, ⑦ la pastille, ⑤ l'alerte, le calendrier réel, ⑧a la photo, ⑨b la trace — 21 repères
- tranche 31→36 : ⑪a les deux dates, ⑪b la classe d'essai, ⑪ le mode test, ⑨ le verrou, **⑭a la borne** — 21 repères

**Soit 18 bancs sur 36.**

## CE QUE JE N'AI PAS PU MESURER — DÉCLARÉ

1. **Les 18 bancs restants (tranche 6→24) n'ont pas été joués sur ce candidat.** Chaque
   tranche dépasse la limite de temps d'une commande dans mon atelier ; je les joue avant ⑭.
   **`banc-tout` n'a donc pas encore été prouvé VERT EN ENTIER sur ce candidat.**
2. **La vue Mois n'a pas de mot à l'écran, seulement une infobulle.** Le mandat ne demande
   le mot que pour `edtProjeter` et `edtPeindreAnnee` ; je ne suis pas allé au-delà sans ordre.
3. **Le pendant inverse (`finAnnee` dépassée) n'est pas encore prouvé** : il appartient à ⑭.
   La fonction le traite, mais ce n'est pas mesuré par un geste, donc ce n'est pas prouvé.
4. **L'audit adverse du §⑥.17 n'est pas fait** : il appartient à ⑭.
5. **Mon navigateur d'atelier est un Chromium 141**, pas celui des exécutants précédents.
   Les bancs passent, mais je le déclare.

## CE QUI RESTE À FAIRE — LIVRAISON ⑭

§①.2 les comptes (`edtHeuresDeLEvenement`) · §①.3 les propositions (`edtCreneauxOu`,
`edtCreneauxLibresLe`) · §①.4 le refus nommé au dépôt (`edtRefusDepot`) · §①.5 la photo du
prévu, mesurée · le pendant inverse · l'audit adverse · `banc-tout` en entier (36) ·
les captures de ⑭.

## RELECTURE AU SAS, APRÈS LA POUSSÉE

`PONT/EDT/index.html` relu depuis le sas après le push, et non depuis ma machine :
**1 773 173 octets**, md5 **`1ab4d4a08602abd622572081a42a4b78`**, version **8.73.0-⑭a**.
Identique bit à bit au fichier audité ici. Base + 3 716 octets.
**La production n'a pas été touchée : la promotion est le geste de Paul.**
