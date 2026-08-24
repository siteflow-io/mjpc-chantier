# LOT C1 — LA TRACE DE L'HEURE
Exécutant · 24/08/2026 · candidat `PONT/LOTC/c1-index.html`. **STOP après livraison.**
Lus avant de coder : `docs/MJPC6-3-CHANTIER.md` (« LE TEMPS DU COURS »), `docs/MJPC6-journal.md`, `OU-EST-CE-DEJA-ECRIT.md`, `DEROULE/CADRAGE-TEMPS.md`. **Rien n'a été créé là où quelque chose existait.**

## ⓪ SCEAU
| | |
|---|---|
| base re-téléchargée | md5 **`7e4d2c92cdd3356598f08261b6361a67`**, **1 454 444 o** = attendu (v8.62.0) |
| candidat | **1 461 851 o**, md5 **`ab12de9a8b6382a05e34eeb64fe3c00a`** |
| `APP_VERSION` | **8.63.0** |
| double parseur | `node --check` + acorn ES2020 : **verts** |
| moteur `AT_DR_B64` | **identique** · `secu*` : **29, aucune divergente** · `published` : 97 → 97 |
| fonctions | **5 modifiées, 6 neuves, 0 supprimée, 0 rétrécie** · **7 zones de diff** |

## ① TAILLES — et ce qui n'a pas bougé
| fonction | avant | après |
|---|---|---|
| `_drCreneauHeure` · `_drCleHeure` · `_drBaseHeure` | — | 302 · 281 · 289 o (neuves) |
| `_drPaquetHeure` · `_drTraceAuto` · `_drTraceReprendre` | — | 1 370 · 427 · 992 o (neuves) |
| `atVecuDemarrer` | 142 | 362 (+220) |
| `atVecuEntrer` · `atVecuSortir` | 179 · 261 | 238 · 320 (+59 chacune) |
| `atT5Choix` | 215 | 323 (+108) |
| `atVecuEcrire` | 1 387 | 1 909 (+522) |
**Intouchés, corps comparés à l'octet** : `atT5Modale`, `atT5Appel`, `atT5Appliquer`, `atT5Etat`, `atT5Veille` (**tout le T-5**) · `atDrReprendre` (la reprise dans la préparation) · `_drCopieAuto` (la copie au fil de l'eau) · `_drRefusionner` (la refusion) · `atVecuMinutes`, `atVecuAfficher`, `atTempsUtile` · `atDrCloreFin` — **toutes IDENTIQUES**. Aucune identité, aucun rang, aucune indexation ne change (LOT C2).

## ② CE QUI A ÉTÉ FAIT — et sur quel mécanisme
**Le nœud `vecu`, unique sous la classe, devient une collection `heures/<clé>`.** Une entrée par heure de cours. `ecrans`, `scene` et `part` **n'ont pas bougé** : ils restent sous la classe.
**L'horaire EST l'identifiant** — et c'est le **créneau**, pas l'heure de lancement. `AT_DR_COURS.debut` porte l'heure réelle du démarrage (Paul lance en retard : *« le démarrage, c'est moi qui lance »*, CADRAGE §4) ; bâtir la clé dessus ferait naître une seconde trace à chaque relance. La **fin est fixe** et vient de l'emploi du temps : `_drCreneauHeure()` retrouve le créneau d'`AT_EDT` par son heure de fin. La clé porte le **jour** et le **créneau** — `2026-08-24_10h07-11h02` — parce que sans le jour, deux mardis au même horaire s'écraseraient, et la règle « relance dans le même créneau = même heure » ne se juge que dans la même journée. **Écart signalé au mandat, non tranché seul** : le mandat dit « l'horaire EST l'identifiant » ; j'y ai ajouté la date, pour cette raison précise — à confirmer ou corriger par la conscience.
**Le paquet n'est pas réinventé** : `_drPaquetHeure()` est **exactement** celui que composait `atVecuEcrire` (classe, créneau, début et fin réels, temps utile prévu, minutes jouées, activités avec prévu/réel/passages/compétences, décisions du T-5), extrait pour servir aussi au fil de l'eau, plus l'activité en cours et un drapeau `clos`.
**La poussée est celle de `_drCopieAuto`** : `_drTraceAuto()` en est le jumeau — même débounce de 900 ms, même `mjpcPutJson`, même chemin de base. Aucun second mécanisme. Points de poussée : **naissance** (`atVecuDemarrer`), **changement d'activité** (`atVecuEntrer`/`atVecuSortir`), **décision du T-5** (`atT5Choix`), **clôture** (`atVecuEcrire`).
**La reprise** suit le patron du chrono accumulé de worktrack (CADRAGE §2) : au lancement, `_drTraceReprendre()` lit la trace du créneau, restitue le `debutReel`, cumule les minutes et les passages par activité, **et rend les décisions du T-5** ; un message le dit à Paul.
**`vecu` continue d'exister à l'identique** : l'affichage des minutes le lit (L14327-14332). Rien de ce qui marchait ne bouge — la collection s'ajoute à côté.

## ③ SCÉNARIO DE L'HEURE INTERROMPUE — base → candidat (`tests/banc_c1.js`)
Parcours réel par les gestes du site (admin-mode, `#page-validation` masqué, `loadPublished('3e')`, Atelier → Mes chapitres → Modifier → Déroulé), créneau **10:07-11:02** choisi au sélecteur, classe lancée, **trois activités jouées**, **deux décisions au T-5**, puis **page coupée sans clôture**, puis **relance dans le même créneau**.
| mesure | 8.62.0 | candidat |
|---|---|---|
| clé de l'heure | **`_drCleHeure` absente** | `2026-08-24_10h07-11h02` |
| trace après le jeu | **aucune** (`heures` inexistant) | 1 trace · **3 activités · 2 décisions** |
| trace après la coupure | **aucune** — tout est perdu | **intacte** : 3 activités, 2 décisions, `debutReel` conservé |
| après relance dans le même créneau | rien à reprendre | **même trace, même `debutReel`** — aucune seconde entrée |
| état repris **en mémoire** | 0 activité, 0 décision | **3 activités, 2 décisions**, `debutReel` d'origine |
| **clé stable malgré un lancement tardif** (début forcé à 10:41) | — | `2026-08-24_10h07-11h02` **inchangée** (`identique: true`) |
Capture regardée : `tests/c1-apres-reprise.png` — le bandeau « **Heure de 10:07-11:02 reprise — 0 min déjà comptées et tes décisions de fin d'heure.** » (0 min : le banc joue en secondes, pas en minutes).

## ④ SCÉNARIO DES DEUX HEURES — même jour, même classe, même séance
Second créneau **11:04-11:59** lancé après le premier :
| clé | créneau | activités | décisions |
|---|---|---|---|
| `2026-08-24_10h07-11h02` | 10:07-11:02 | 3 | **2** |
| `2026-08-24_11h04-11h59` | 11:04-11:59 | 3 | 0 |
**Deux traces, aucune n'écrase l'autre**, chacune avec son horaire et ses décisions propres. Sur la base, ce scénario ne produit **rien du tout**.

## ⑤ HARNAIS
Hub **simulé en mémoire** : les GET sont servis, **les PUT rangés localement et JAMAIS transmis au hub réel** (26 écritures simulées, comptées). **Écritures non-GET sorties vers l'extérieur : 0.** `pageerrors` : 0 sur tous les parcours, base comme candidat.
**Ce que la simulation ne prouve pas** : la latence réelle de Firebase, ses règles, une coupure en cours d'écriture. Le lot n'ajoute aucun chemin d'écriture nouveau — il réutilise `mjpcPutJson`, déjà éprouvé en production par `_drCopieAuto`.

## ⑥ CE QUE LE BANC NE PROUVERA PAS
Une vraie heure de classe (55 minutes, minutes réelles au lieu de secondes) · la fermeture brutale de l'onglet par le système plutôt que par le banc · le réseau de l'établissement · l'enchaînement de deux classes séparées par deux minutes (8h55→8h57). **Le test de Paul reste le juge.**

## ⑦ POINT LAISSÉ À L'ARBITRAGE
La date dans la clé (§②). Si la conscience préfère l'horaire seul, la modification tient en une ligne de `_drCleHeure` — mais deux jours au même créneau s'écraseraient alors mutuellement.
