# RAPPORT — LOT 2ter · livraison ⑥ (finale) · LES DATES DE L'ANNÉE
Version **8.73.0-⑥**.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ⑥ | 1 729 825 | `b0be8f4d62dbb7b53d3f6f0579ec702c` | 8.73.0-⑤ |
| **Candidat ⑥** | **1 748 712** | **`966eaafd1e1f260c2cdef9e3826aebca`** | **8.73.0-⑥** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses cinq questions.

## §⑤ — LES DATES DE L'ANNÉE
Six fonctions ajoutées, nommées — **`function edt*` 203 → 210** : `edtChargerDatesAnnee`, `edtRecalerAnnee`, `edtDebutAnnee`, `edtFinAnnee`, `edtValiderDatesAnnee`, `edtHeuresApres`, `edtPoserDateAnnee`.

**⑦.11, mesuré** (`tests/banc-dates-06.mjs`) :
- **Même nœud, deux champs de plus** : les écritures sont `/site/config/brevetDates/debutAnnee` et `/site/config/brevetDates/finAnnee`. Au hub : `{"debutAnnee":"2026-09-01","finAnnee":"2027-06-26"}` **à côté** des dates de brevet existantes. Le nœud n'a pas changé de nom ; **seule l'étiquette à l'écran** devient « Dates de l'année » (onglet, titre et bloc).
- **Le prompt peut les produire** : `edtEcrireBrevet` écrit `debutAnnee`/`finAnnee` s'ils arrivent avec le calendrier, par le même chemin.
- **`EDT_ANNEE` n'est plus deviné** : `edtRecalerAnnee()` le recalcule dès que la date de début est connue. Mesuré : `2026-2027 → 2026-2027` — la déduction d'avant était juste ici, mais elle **n'est plus une déduction**. Dates utilisées après pose : **2026-09-01 → 2027-06-26**.
- **Tout se recale dessus** : la liste des destinations s'arrête à la fin déclarée — **695 destinations, la dernière étant « ven 25/6 · 16:04-16:59 »** pour une fin au 26 juin.

**Les trois refus, nommés et chiffrés :**
| cas | ce que le site répond |
|---|---|
| fin avant début | « la fin de l'année (vendredi 26 juin) tombe avant son début (mardi 1 septembre) » |
| écart de plus de treize mois | « l'année ferait **455 jours**, soit plus de treize mois » |
| hors du calendrier injecté | « le début, dimanche 1 septembre, est **hors du calendrier injecté** (samedi 1 août → samedi 31 juillet, **un mois de marge**) » |

**⑦.11 — `finAnnee` avancée à la main : rien ne disparaît.** Deux heures posées les 22 et 24 juin, fin ramenée au 15 juin :
> **2 heures posées après la nouvelle fin d'année : à replacer — 3E Charles de Gaulle mardi 22 juin 08:00-08:55, 3E Charles de Gaulle jeudi 24 juin 08:00-08:55.**

Les deux clés sont toujours au hub (**aucune ne disparaît**), elles portent le motif `aReplacer` et **reviennent dans le rappel** des heures à replacer. Écritures : la date, puis **1 archive et 1 écriture** pour les décisions.

## Non-régression — §⑥
`function secu*` **29** · `published` **97** · `AT_DR_B64` md5 `2ba70f9ef8aacb6f81962ea4e1b62944` · trois portes · `edtApparier` 1 appel · `edtMettreANiveau` 2 appels · dix catégories et quatre motifs inchangés · **node --check** et **acorn ES2020** VERTS · **aucune fuite globale dans le bloc EDT** (`tests/fuites.mjs` : 6 restantes, toutes hors EDT, préexistantes).
**`EDT_ANNEE` : 12 → 17 occurrences**, comme le §⑥ l'autorise à condition de les nommer : la déclaration inchangée, **`edtRecalerAnnee`** (une lecture, une écriture), **`edtFinAnnee`** et **`edtDebutAnnee`** (un repli chacun), et l'usage existant conservé dans `edtChemin`. Aucune n'est une nouvelle déduction : elles lisent ou recalculent la même variable.
**`banc-tout.mjs` rejoué en entier — 27 bancs (le banc ⑥ ajouté), 82 repères, aucun échec** : ①bis-a 38 s · ①bis-b 23 s · ①ter 7 s · ②a 10 s · ②b 58 s · ② 48 s · ③a 43 s · ③b 54 s · ③ 34 s · ③bis-a 12 s · ③bis-b 30 s · ④a 31 s · ④ 113 s · ⑤a 11 s · ⑤b 19 s · ⑤c 18 s · ⑤c-bis 11 s · ⑤c-ter 15 s · audits ② 37 s, ③ 52 s, ③bis 32 s · ⑥a 34 s · ⑥b 21 s · ⑥c 15 s (4/4) · **⑥ dates 20 s** · alerte 32 s · 122 identifiants 3 s.

## Dettes déclarées — ce qui reste dû sur le lot ⑥
1. **Les captures par clics du §⑦.14** (le dépôt sur une case occupée, les trois issues, l'échange, l'écrasement, l'heure rappelée) **ne sont pas faites**.
2. **L'audit adverse du §⑦.15 n'est pas fait** (échange entre classes non appariées, écrasement d'une heure déjà à replacer, heure replacée sur sa propre case, trois classes qui tournent, `finAnnee` avancée avec dix heures au-delà, deux gestes concurrents, classe disparue de la grille).
3. **La recherche par mois, semaine et type A/B dans la liste** (§③.1) reste due.
4. **Le refus de déplacer une heure dont la trace existe** (§⑦.7) n'est toujours pas mesuré, faute d'heure jouée dans la semaine des bancs.
5. **La bascule de fin d'année** — une heure à replacer jamais replacée qui deviendrait « non justifiée » au 26 juin — n'est pas automatique : `finAnnee` existe maintenant, mais rien ne déclenche le passage.

J'ai livré ce qui était **prouvable dans le temps de ce tour** plutôt que cinq choses à moitié, et je nomme le reste au lieu de le taire.

## Écarts signalés, jamais ajustés
1. **Les dates sont lues en deux appels ciblés** (`/site/config/brevetDates/debutAnnee` et `/finAnnee`) plutôt qu'en une lecture du nœud : c'est ce qui permet de **ne pas élargir la garde d'un iota** — l'exception ① du contrat porte sur le chemin avec son slash.
2. **Aucune déduction depuis les vacances** : la fin d'année est celle que Paul déclare, ou, à défaut, le 31 juillet comme avant. Le repère du 25-26 juin est le sien, pas une règle du site.
3. **Une phrase de refus a dû être réécrite** : « la fin (26 juin) est hors… » ressemblait à un appel de fonction `fin(` et la garde ① la refusait. Écrit « la fin, 26 juin, est hors… ». La garde a eu raison de m'arrêter, même sur une chaîne de texte.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : faux hub ; le sas n'est pas publié en Pages.
- **Les 27 bancs d'affilée dans un seul processus** : environnement coupé à ~90 s ; joués en sept tranches, toutes par `banc-tout`.
- Les points 1 à 5 des dettes ci-dessus.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑥**) · `tests/banc-dates-06.mjs` · `tests/banc-tout.mjs` (27 bancs) · `rapport-2ter-06.md` (ce rapport).

## ARRÊT
Les dates de l'année vivent au même endroit que celles du brevet, refusent ce qui n'a pas de sens en le disant, recalent l'année et la liste des destinations, et **avancer la fin ne fait disparaître aucune heure** : elles reviennent à replacer, nommées. **Cinq dettes déclarées, dont les captures et l'audit adverse du lot.**
