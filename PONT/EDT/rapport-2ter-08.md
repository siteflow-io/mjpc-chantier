# RAPPORT — LOT 2ter · livraison ⑧ (finale) · LA MATRICE, LA SÉQUENCE, LES CAPTURES, L'ÉTAT DU LOT
Version **8.73.0-⑧**. Exécutant 11. **Dernière livraison du lot.**

## Base et candidat

| | octets | md5 | version |
|---|---|---|---|
| Base ⑦ | 1 750 002 | `47cb5add128eea6fdcb241cf70cc3dd0` | 8.73.0-⑦ |
| ⑧-a | 1 753 662 | `84e2e5f57b44c186e53315be2a981f4b` | 8.73.0-⑧a |
| **Candidat ⑧** | *(relu au sas — voir en fin de rapport)* | | **8.73.0-⑧** |

## ② LA MATRICE ACTIONS × ÉTAT

*Reconstituée du code, pas de mémoire : `edtProjeter` pour les états,
`edtPeindreModale` pour ce qui est proposé, `edtRefusDepot` / `edtTroisIssues` /
`edtSansSeance` / `edtAnnulerDecision` / `edtReplacerHeure` / `edtPerteSeche` /
`edtJustifier` pour ce que chaque geste écrit.*

### Les huit états d'une case

| état | ce que c'est |
|---|---|
| `prevu` | une séance est prête, l'heure est à venir |
| `rienDePret` | la classe est appariée, mais aucune séance n'attend |
| `jouee` | l'heure a eu lieu — une trace existe |
| `sansSeance` | heure banalisée, avec sa catégorie |
| `deplacee` | l'heure est partie ailleurs |
| `horsTemps` | vacances, férié, jour sans cours |
| `horsMjpc` | groupe partagé, hors français |
| `nonImportee` | la classe de la grille n'est pas encore appariée |

### Ce que chaque geste fait, selon l'état

| geste | `prevu` / `rienDePret` | `sansSeance` | `deplacee` | `jouee` | `horsTemps` · `horsMjpc` · `nonImportee` |
|---|---|---|---|---|---|
| **Lancer le pilotage** | ouvre le déroulé sur la bonne classe et le bon créneau | non proposé | non proposé | **refusé** | **refusé** |
| **Banaliser** | écrit `sansSeance` + catégorie + classement (temps de classe, ou heure perdue justifiée / non) | **prévient d'abord** : le motif en place est nommé, « la banaliser remplacera ce motif » — deux boutons | non proposé (une décision existe) | **refusé** — l'heure a eu lieu | **refusé** |
| **Déplacer** (liste) | départ → `sansSeance` + `deplaceeVers` ; arrivée → 📌 `venantDe` | non proposé | non proposé | **refusé** | **refusé** |
| **Ajouter une heure** (créneau libre) | arrivée `ajoutee` + 📌 — **ce n'est pas un déplacement** : rien n'est retiré ailleurs, et l'heure compte | non proposé | non proposé | **refusé** | **refusé** |
| **Glisser-déposer** | ouvre la question du dépôt (durable / une fois) | ne se saisit pas | ne se saisit pas | ne se saisit pas | ne se saisit pas |
| **Échanger** (créneau pris par une classe appariée) | 4 décisions, **1 écriture** : les deux départs `deplaceeVers`, les deux arrivées 📌 — **personne ne perd d'heure** | — | — | — | — |
| **Prendre le créneau** (écraser) | la source part et arrive 📌 ; **la classe évincée reçoit `aReplacer`**, non justifiée, basculable — jamais perdue en silence | — | — | — | — |
| **Replacer** (écran Heures perdues) | pose `replacee`, `aReplacer:false`, arrivée `ajoutee` + 📌. Si le créneau visé est **pris**, le site **dit le prix** — « deux classes au même moment » — et Paul tranche | — | — | — | — |
| **Perte sèche** | motif `priseAutreClasse`, `aReplacer:false` — l'heure entre au compte des heures perdues | — | — | — | — |
| **Cocher / justifier** (depuis le calendrier) | écrit `ecartJustifie` **dans les décisions**, jamais dans le calendrier injecté, avec l'`id` de l'événement | idem | idem | idem | aucune heure de cours sur ces dates → « rien à marquer » |
| **↶ Annuler** | proposé dès qu'une décision existe : **rend le motif précédent**, pas le vide | rend le motif d'avant | **défait des deux côtés** (départ et arrivée) | **refusé** — mesuré à la matrice, « Annuler » y apparaissait à tort | **refusé** |
| **Les absents** | non proposé | non proposé | non proposé | **le seul geste possible** | non proposé |

### Les refus du dépôt, nommés

`edtRefusDepot` refuse, chacun avec sa phrase : une case qui n'est pas une
destination · **le passé** · un jour sans cours (le motif est dit) · un après-midi
sans cours (le jour et l'heure sont dits) · un créneau pris par une **classe non
appariée** — « apparie-la d'abord ».

Quand le créneau est pris par une **classe appariée**, il n'y a plus de refus :
**les trois issues** — Ne rien faire · Échanger les deux heures · Prendre le
créneau — avec le prix de chacune écrit avant le choix.

## ③ `SEQUENCE-TEST-PAUL.md` — MISE À JOUR

Le fichier passe de 96 à **148 lignes**, de 36 à **82 étapes**, toutes par clics.
Sept sections neuves ont été ajoutées, sans que le contenu soit donné ici : **les
heures perdues et leurs motifs** (H) · **les trois issues au dépôt** (I) ·
**l'heure à replacer** (J) · **les dates de l'année** (K) · **la vue Année** (L) ·
**la classe d'essai en mode test** (M) · **la photo du prévu, qui se prend toute
seule** (N). L'étape 28 (le bouton photo) a été réécrite, et l'en-tête porte le
candidat `8.73.0-⑧`. **Zéro occurrence de « figer »** dans tout le fichier.

## ⑥.12 LES CAPTURES PAR CLICS

`tests/captures-photo-08.mjs` — deux parcours identiques, une seule différence :
l'échéance a déjà sa photo, ou non. Écran entier à chaque fois.
`tests/08-photo-a1-arrivee-rien-a-prendre.png` ·
`tests/08-photo-b1-arrivee-photo-prise-toute-seule.png` ·
`tests/08-photo-b2-apres-clic-photo-a-la-main.png` ·
`tests/08-photo-b3-deux-photos-le-meme-jour.png` ·
journal : `tests/08-photo-journal.txt`.

Ce que le journal contient, et pas seulement qu'il existe :

- **Parcours A** — le hub porte `pho:20260901083000` « Trimestre 1 », échéance
  `per:UN`. Après l'arrivée par clics : **toujours une seule photo, la même**.
- **Parcours B** — le hub part vide. Après le même parcours :
  `pho:20260902110740` « Trimestre 1 », échéance `per:UN`, prise le 2026-09-02,
  semaine du 2026-08-31, **26 cases**. **Aucune modale** ouverte par-dessus l'écran.
- **Le bouton**, cliqué à la souris sur ses coordonnées réelles (`📷 Photo du
  prévu`, x 1071 y 25) : le site répond « Photo du prévu prise — 26 cases. ».
  Deux clics le même jour → **3 photos**, `…110740` (échéance), `…110745` et
  `…110749` (« mercredi 2 septembre »), **tous les identifiants distincts**.
- **L'archive** écrite avant la dernière photo, chemin `/site/edt/photos/2026-2027`,
  contient **deux photos** — « Trimestre 1 » et « mercredi 2 septembre » — quand le
  hub en porte trois.

**Les deux captures d'arrivée sont identiques pixel pour pixel** — même md5
`0e91c87f6cdab5b43bedf4322b757161`. **Ce n'est pas une erreur de capture : c'est la
preuve.** Que la photo se prenne ou non, l'écran que Paul a sous les yeux est
rigoureusement le même. La photo automatique ne se voit pas, ne se clique pas, ne
s'attend pas. Les deux autres captures diffèrent, elles : `b2` porte la réponse du
site au clic, `b3` l'écran après deux photos du même jour.

## ⑥.13 L'AUDIT ADVERSE

Les sept cas du mandat, joués dans `tests/banc-photo-auto-08a.mjs` :

| cas | mesuré |
|---|---|
| aucune période déclarée | 1 photo, « Rentrée », échéance `annee:2026-2027`, 27 cases |
| deux périodes qui commencent le même jour | **1** photo |
| une échéance passée depuis longtemps, au premier chargement | 1 photo, échéance `per:VIEUX`, prise aujourd'hui — le passé n'est pas rattrapé |
| le hub refuse l'écriture | **0** photo écrite, l'écran reste debout |
| vingt photos déjà en magasin | 21 photos, **21 identifiants distincts** |
| une photo dont les cellules sont vides | 2 photos, aucune casse |
| le mode test allumé | photos 1 → **1**, écritures photos **[]** |

Une écriture reste à l'arrivée dans les deux versions : la **mise à niveau** pose
la date d'injection sur les objets qui n'en ont pas. Mesuré ligne pour ligne sur la
base ⑦ et sur le candidat : **exactement les mêmes huit écritures**. Ce n'est pas
cette livraison.

## LA DETTE DU DISPOSITIF, RÉPARÉE

Déclarée en ⑧-a : aucun banc ne tournait depuis le dépôt. Ils lisent leurs données
sous des noms plats (`hub-classes.json`, `calendrier-2026-2027.json`) qui n'existent
nulle part au sas, où les vrais fichiers sont rangés en `tests/hub/` et `json/` ; et
plusieurs écrivent leurs captures dans `tests/…` alors qu'ils sont lancés **depuis**
`tests/`.

`banc-tout.mjs` **monte maintenant le plan de travail lui-même**, et il le dit :

```
plan de travail : hub-classes.json ← hub/classes.json · hub-site3e.json ← hub/site_3e.json ·
hub-siteconfig.json ← hub/site_config.json · calendrier-2026-2027.json ← ../json/calendrier-2026-2027.json ·
creneaux-2026-2027.json ← ../json/creneaux-2026-2027.json · grille-2026-2027.json ← ../json/grille-2026-2027.json
```

Aucun fichier du dépôt n'est déplacé ni renommé : on ne fait que poser les noms que
les bancs demandent, et un lien `tests/ → .` pour les captures. **Prouvé en effaçant
le plan monté à la main : les bancs repartent verts.**

## ④ L'ÉTAT COMPLET DU LOT 2ter — pour la conscience suivante

| livraison | ce qu'elle a apporté |
|---|---|
| ① | identité des objets — chaque élément porte un `id` |
| ①bis-a | la mise à niveau est branchée au chargement |
| ①bis | ce qui est posé survit à la réinjection |
| ①ter-a / ①ter | la grille datée garde ses identités ; captures et audit adverse |
| ②a | la coche sort de l'objet injecté — elle vit dans les décisions |
| ②b | la reprise des coches héritées |
| ② | ce que devient une coche quand les choses bougent |
| ③a | l'appariement est branché |
| ③b | Paul voit avant d'appuyer (le différentiel) |
| ③ | rien ne s'écrase en silence — archive avant écriture |
| ③bis-a | la classe d'essai, visible seulement en mode test |
| ③bis-b | l'identifiant dit sa famille |
| ③bis | la garde reprend la surveillance |
| ④a / ④ | un seul bouton, un seul collage ; l'IA ne casse plus les identités |
| ⑤a | l'écran « Heures perdues » |
| ⑤b | une heure ne compte jamais deux fois |
| ⑤c | banaliser une heure, et ce que ça coûte |
| ⑤c-bis / ⑤c-ter | toutes les archives portent l'état d'avant |
| ⑤d | le banc unique, et les deux règles de banc |
| ⑤ | l'alerte mensuelle et la cinquième question de la garde |
| ⑥a | les trois issues, au lieu du refus sec |
| ⑥b | l'heure à replacer, rappelée jusqu'à ce qu'elle soit posée |
| ⑥c / ⑥c-bis | la liste élargie, le replacement réel, la cohérence ; une fuite globale |
| ⑥ | les dates de l'année |
| ⑦a / ⑦b / ⑦ | la vue Année dans le site ; les pastilles, les captures, l'audit |
| **⑧a** | **la photo du prévu se prend toute seule, nommée et identifiée** |
| **⑧** | **la matrice, la séquence de test, les captures, le plan de travail des bancs** |

### Les dettes ouvertes qui restent

Reprises du rapport ⑦, **non traitées par ce lot** et toujours ouvertes :

1. la recherche par mois / semaine / type A-B dans la liste des destinations (⑥ §③.1) ;
2. le refus de déplacer une heure dont la trace existe (⑥ §⑦.7) ;
3. la bascule automatique de fin d'année pour une heure jamais replacée ;
4. les captures et l'audit adverse du **lot ⑥** (§⑦.14 et §⑦.15) ;
5. **la passe de simplification des textes affichés** — dette déclarée par Paul,
   livraison à part, explicitement hors de ce mandat.

Ouvertes par cette livraison :

6. **le message du mode test** : après un clic sur « 📷 Photo du prévu » en mode
   test, le site dit « Photo du prévu prise — 26 cases » alors que rien n'est
   enregistré. C'est le comportement de TOUS les gestes du site en mode test, et la
   pastille l'annonce en permanence. **Passe sur tout le site, pas sur l'EDT.**
7. **`EDT.photoAutoEmise`** : si l'écriture de la photo automatique échoue, elle
   n'est pas retentée dans la même session ; elle repart au chargement suivant.

### Ce qui a été déclaré et jamais tranché

- **La vue Année ne se repeint pas d'elle-même** quand le calendrier change sous
  elle (rapport ⑦, écart 2). Personne n'a dit si elle le devait.
- **Le cas « calendrier réinjecté pendant que la vue Année est ouverte »** est resté
  *non prouvé* au rapport ⑦ : la vue tient debout, mais l'injection n'a pas pu être
  établie.
- **Le cockpit qui compare le réel à la photo** : il existe, ce lot lui fabrique ses
  photos, mais personne n'a joué la comparaison de bout en bout.
- **Une photo automatique n'est visible nulle part dans l'écran** : elle se lit dans
  le magasin. Aucun écran ne liste les photos. Signalé, jamais demandé.

## §⑤ NON-RÉGRESSION

- Moteur `AT_DR_B64` : **309 812** caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944` — identique.
- `function secu*` **29** · `published` **97** · `function edt*` **221 déclarations / 221 noms**.
- Trois portes : `edtArriveeProf` 2 · `edtSectionPanneau` 2 · `edtOuvrir` 4 — pas une de plus.
- `edtApparier` 1 appel · `edtMettreANiveau` 2 appels · `EDT_CATEGORIES` et `EDT_MOTIFS` inchangés.
- `fig*` **24** · `edt-fige` 9 · `at-corps-fige` 7 — intactes.
- **Garde VERTE** sur ses cinq questions · **double parseur vert**.

## ⑥.10 `banc-tout.mjs` EN ENTIER

**30 bancs, tous verts** sur ce candidat. Le passage a été lancé d'une seule
commande ; la machine de l'exécutant a coupé le processus après le 29e banc, avant
la ligne de bilan. Le 30e a été rejoué juste après :
`⑧a · la photo du prévu se prend toute seule · 134 s · 3/3 repères ✔`.
Le bilan d'un seul tenant — `TOUT PASSE — 30 banc(s), 87 repères vérifiés` — a bien
été obtenu sur le candidat **⑧a**, dont `index.html` ne diffère de celui-ci que par
la chaîne de version. **Je le dis plutôt que de recopier un bilan que je n'ai pas lu
sur ce fichier-ci.**

```
BANC-TOUT — 30 banc(s) sur 30, fichier ../index.html

  ✔ ①bis-a · la mise à niveau au chargement              ·  40 s · 3/3 repères
  ✔ ①bis-b · l'identité des périodes                     ·  26 s · 3/3 repères
  ✔ ①ter · la grille datée                               ·   7 s · 3/3 repères
  ✔ ②a · la coche sort de l'objet                        ·  10 s · 3/3 repères
  ✔ ②b · la migration des coches héritées                ·  63 s · 3/3 repères
  ✔ ② · ce que devient une coche quand les choses bougent ·  52 s · 3/3 repères
  ✔ ③a · l'appariement branché                           ·  45 s · 3/3 repères
  ✔ ③b · le différentiel et la classe renommée           ·  57 s · 3/3 repères
  ✔ ③ · l'archivage avant écrasement (par clics)         ·  35 s · 3/3 repères
  ✔ ③bis-a · la classe d'essai en mode test              ·  13 s · 3/3 repères
  ✔ ③bis-b · l'identifiant dit sa famille                ·  32 s · 3/3 repères
  ✔ ④a · un seul collage                                 ·  33 s · 3/3 repères
  ✔ ④ · l'épreuve de bout en bout                        · 121 s · 3/3 repères
  ✔ ⑤a · l'écran Heures perdues                          ·  11 s · 3/3 repères
  ✔ ⑤b · une heure ne compte jamais deux fois            ·  19 s · 3/3 repères
  ✔ ⑤c · banaliser, classer, basculer, déplacer          ·  19 s · 3/3 repères
  ✔ ⑤c-bis · l'archive des décisions                     ·  11 s · 2/2 repères
  ✔ ⑤c-ter · les archives des autres objets              ·  15 s · 3/3 repères
  ✔ audit adverse ② · les coches                         ·  39 s · 2/2 repères
  ✔ audit adverse ③ · l'appariement                      ·  62 s · 2/2 repères
  ✔ audit adverse ③bis · la classe d'essai               ·  34 s · 2/2 repères
  ✔ ⑥a · les trois issues au dépôt                       ·  35 s · 3/3 repères
  ✔ ⑥b · l'heure à replacer et la perte sèche            ·  23 s · 3/3 repères
  ✔ ⑥c · la liste élargie et le replacement réel         ·  16 s · 4/4 repères
  ✔ ⑥ · les dates de l'année                             ·  22 s · 3/3 repères
  ✔ ⑦b · la vue Année dans le site                       ·  13 s · 3/3 repères
  ✔ ⑦ · la pastille d'événement et l'audit adverse       ·  62 s · 3/3 repères
  ✔ ⑤ · l'alerte mensuelle                               ·  33 s · 3/3 repères
  ✔ le calendrier réel · 122 identifiants                ·   3 s · 3/3 repères
  ✔ ⑧a · la photo du prévu se prend toute seule          · 134 s · 3/3 repères
     (rejoué seul — le passage d'un seul tenant a été coupé avant cette ligne)
```

## Ce que je n'ai pas pu mesurer

- Le geste sur le site réel de Paul : faux hub, le sas n'est pas publié en Pages.
- Le premier chargement d'une année réelle, avec son calendrier injecté.
- La comparaison réel / photo dans le cockpit.

## ARRÊT

Le lot 2ter est complet. La photo du prévu se prend toute seule, la matrice est
publiée, la séquence de test couvre les 82 étapes du lot, les captures montrent le
parcours avant et après, et les bancs se rejouent d'une seule commande depuis le
dépôt. **Sept dettes restent ouvertes, nommées ci-dessus. Rien n'est parti en
production : la promotion est le geste de Paul.**
