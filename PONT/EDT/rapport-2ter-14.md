# RAPPORT — LOT 2ter · LIVRAISON ⑭ · LA BORNE DES DATES DE L'ANNÉE (les comptes, les propositions, les gestes)

## CE QUE ÇA CHANGE POUR LA CLASSE

Un événement de l'établissement posé avant la rentrée de Paul **ne lui coûte plus une heure** :
sa fiche disparaît de « Heures perdues ». Quand il cherche où replacer une heure, **aucun jour
hors de son année ne lui est proposé**. S'il y glisse une heure quand même, le site lui dit
pourquoi il refuse, en clair. Et la photo du prévu ne photographie plus que des séances de
son année — c'est elle que le cockpit comparera au réel en juin.

## BASE ET CANDIDAT

| | taille | md5 | version |
|---|---|---|---|
| **base du lot** (production) | 1 769 457 | `8837063de4466afb71622e89181ae44a` | 8.73.0-⑪ |
| **livraison ⑭a** (au sas) | 1 773 173 | `1ab4d4a08602abd622572081a42a4b78` | 8.73.0-⑭a |
| **candidat ⑭** | *voir « RELECTURE AU SAS » en fin de rapport* | | 8.73.0-⑭ |

## CE QUI A ÉTÉ ÉCRIT — DEUX ENDROITS, PAS NEUF

**§①.2 — LES COMPTES.** Dans `edtHeuresDeLEvenement`, une heure hors année ne sort plus :
l'événement ne coûte rien, et sa fiche quitte « Heures perdues ».

**SAUF SI PAUL A DÉCIDÉ QUELQUE CHOSE DESSUS.** Mesuré : cette fonction sert six appelants, et
deux d'entre eux (`edtEvenementJustifie`, `edtCochesDeplacees`) s'en servent pour **retrouver
les coches de Paul**. Borner sans exception aurait rendu introuvable une coche qu'il a posée
avant sa rentrée — c'est-à-dire lui effacer un travail fait. La garde laisse donc passer toute
heure qui porte une décision.

**§①.3 ET §①.4 — LES PROPOSITIONS ET LE REFUS : UN SEUL ENDROIT.** Mesuré avant d'écrire :
`edtCreneauxOu` et `edtCreneauxLibresLe` passent **toutes les deux** par `edtRefusDepot`. Le
refus hors année y a donc été posé **une seule fois**, et les deux listes s'en trouvent servies.
Il n'y avait rien à écrire ailleurs.

Le refus est placé **après** « sans cours », comme le veut §③ : un jour de vacances dit
« vacances d'été », pas « avant ta rentrée ». Le mot le plus précis gagne.

**§①.5 — LA PHOTO.** Aucune ligne écrite : elle passe par `edtProjeter`, bornée en ⑭a.
Mesurée ci-dessous, comme le mandat l'exige.

## LES PREUVES — PAR LE GESTE

Banc `tests/banc-borne-annee-14.mjs`. Onze captures d'écran entier et le journal des clics
dans `tests/14/`.

**Une donnée a dû être posée pour que la mesure existe, et je le déclare** : le calendrier réel
ne porte **aucun événement de classe avant la rentrée**. Sans en poser un, le §①.2 n'était pas
mesurable. Le banc en pose donc un au calendrier de test — *« sortie 3e AVANT la rentrée »*,
1er septembre, niveau 3e — comme un vrai séjour.

### §⑥.7 — LES HEURES PERDUES

| | fiches | heures cochables |
|---|---|---|
| avant | **13** | **21** |
| après | **12** | **20** |

La fiche de l'événement d'avant la rentrée a disparu, et l'heure qu'il coûtait avec elle.

### §⑥.8 — LA LISTE DES DESTINATIONS

Depuis une case du 28 août, la liste proposait **957 créneaux** (« — choisir parmi 957
créneaux — »). Après que Paul a posé sa rentrée : **0**. La case hors année n'offre plus de
destination du tout.

### §⑥.9 — LE DÉPÔT REFUSÉ, ET NOMMÉ

Par un vrai glisser-déposer à la souris, d'une case prévue vers une case hors année :

> **Dépôt refusé : ce jour est après ton dernier jour du mercredi 9 septembre.**

**Une mesure qui vaut d'être dite** : du côté de la rentrée, ce n'est pas ce refus qui sort,
mais celui du passé — « on ne pose pas une heure dans le passé ». C'est le bon ordre, et c'est
pour ça que la preuve est faite du côté de la fin d'année.

### §⑥.10 — LA PHOTO DU PRÉVU

| | cases | dont prévues | dont hors année | `depuis` |
|---|---|---|---|---|
| avant | **18** | **3** | 0 | `2026-08-31` |
| après | **18** | **1** | **6** | `2026-08-31` |

L'archive garde le même nombre de cases — rien n'en disparaît — mais elle ne photographie
plus que des séances de l'année. `depuis` reste le lundi de la semaine affichée : la photo
couvre toujours les trois jours d'avant la rentrée, mais elle les enregistre désormais
**comme hors année**, et non plus comme des séances dues.

### §⑥.11 — LE PENDANT INVERSE, PAR LE GESTE

Le mandat autorisait à forcer ce point dans le banc. **Ça n'a pas été nécessaire.**
On ne peut pas cliquer 44 fois sur « › » pour atteindre juillet 2027 — alors Paul pose son
dernier jour au **mercredi 9 septembre 2026**. La semaine du 7 est à **un clic**, et elle porte
les deux côtés : lundi à mercredi dans l'année, jeudi et vendredi après.

Résultat, à l'écran : **20 cases**, dont **3 disent « après ton dernier jour »**, et **2 séances
encore prévues** avant le 9. Les cases d'après restent, sans séance.

### §⑥.17 — AUDIT ADVERSE

| cas | résultat |
|---|---|
| début postérieur à la fin | un jour du milieu est hors année des deux côtés, rien ne casse |
| seule la rentrée posée | l'avant est borné, le lointain après ne l'est pas |
| seule la fin posée | l'après est borné, l'avant ne l'est pas |
| dates effacées après coup | **plus rien n'est borné** |
| les bornes elles-mêmes | rentrée et dernier jour **inclus** ; veille et lendemain exclus |
| valeurs vides ou nulles | rien n'est borné, rien ne casse |

**⚠ APPEL DE FONCTION : DÉCLARÉ pour ce bloc.** L'écran refuse une fin antérieure au début —
c'est le refus de ⑥ et il est légitime — donc ces cas ne sont **pas atteignables au clic**.
Ils sont forcés dans le banc, et **ils ne sont pas prouvés au sens du mandat**.

Le mode test et la classe d'essai un jour hors année sont couverts par les bancs ⑪ et ⑪b,
verts sur ce candidat.

## LA GARDE — VERTE, ET ELLE MORD ENCORE

Verte sur ses cinq questions. Et **cinq contrôles négatifs, un par question**, posés à côté de
l'index puis effacés :

| blessure | réponse de la garde |
|---|---|
| le bloc appelle `chInjecterConfirme` | **ROUGE** ① le bloc EDT appelle hors contrat |
| `edtHorsAnnee` appelée hors du bloc | **ROUGE** ② appelé hors du bloc sans être une porte |
| un nœud hub `/site/ailleurs/borne` | **ROUGE** ③ chemin hub en dur hors de /site/edt/ |
| `edtEcrireArchive` avec un chemin en dur | **ROUGE** ④ chemin qui n'est pas fabriqué par le site |
| la copie embarquée du prompt modifiée | **ROUGE** ⑤ la consigne « calendrier » diffère |

## CE QUI NE DOIT PAS BOUGER — REMESURÉ

| | attendu | mesuré |
|---|---|---|
| `AT_DR_B64` | 309 812 car · `2ba70f9ef8aacb6f81962ea4e1b62944` | **conforme** |
| `function secu*` · `published` | 29 · 97 | **29 · 97** |
| `edt-fige` | 9 | **9** |
| `EDT_CATEGORIES` / `EDT_MOTIFS` | 248 / 404 car | **248 / 404** |
| `edtArriveeProf` · `edtOuvrir` · `edtSectionPanneau` | 2 · 4 · 4 | **2 · 4 · 4** |
| double parseur | `node --check` + acorn ES2020 | **VERT / VERT** |

**Un seul écart, demandé par le mandat** : `edt*` à **230** déclarations / 230 noms, aucun
doublon — la fonction unique de ⑭a. Aucune fonction ajoutée en ⑭.

## `banc-tout` — VERT EN ENTIER

**37 bancs, tous joués sur ce candidat, tous verts — 115 repères vérifiés.**

| tranche | bancs | repères |
|---|---|---|
| 0→7 | 7 | 21 |
| 7→14 | 7 | 21 |
| 14→21 | 7 | 17 |
| 21→28 | 7 | 22 |
| 28→33 | 5 | 18 |
| 33→37 | 4 | 16 |

*(Le mandat en annonçait 35 ; ⑭a et ⑭ en ont ajouté un chacun.)*
Joué en six commandes : une seule commande n'y suffit pas dans mon atelier.

## CE QUE JE N'AI PAS PU MESURER — DÉCLARÉ

1. **L'audit adverse n'est pas atteignable par le geste** (ci-dessus). Déclaré, non prouvé.
2. **Le pendant inverse est prouvé sur une fin d'année rapprochée** (9 septembre), pas sur le
   3 juillet réel. Le mécanisme est le même, la date ne l'est pas.
3. **La vue Mois porte une infobulle mais pas de mot écrit.** Le mandat ne demandait le mot
   que pour `edtProjeter` et `edtPeindreAnnee` ; je n'ai pas élargi sans ordre.
4. **Mon navigateur d'atelier est un Chromium 141**, pas celui des exécutants précédents.
5. **Les preuves des livraisons antérieures** (36 captures des lots ①bis à ⑪) ont été
   réécrites par les bancs rejoués, puis **restaurées à l'identique** avant la livraison.
   Le sas ne contient que les fichiers de ⑭.

## ÉTAT DU MANDAT

Tout le §① est fait et prouvé. Le §② tient : ni le réel ni une décision de Paul n'est bornée,
ni à l'affichage, ni dans les comptes. Le §③ est respecté. Le §④ (l'infobulle de la nature
nouvelle) est fait en ⑭a et complété dans le mois.

**La promotion reste le geste de Paul.**
