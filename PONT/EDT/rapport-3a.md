# LOT 2bis — LIVRAISON ③a · LES PÉRIODES DEVIENNENT UN OBJET, ET LE RELEVÉ DU « EN DUR »

*Candidat `8.71.0` mis à jour au sas. Aucune promotion. Faux hub, zéro sortie réseau.*

---

## ① LES PÉRIODES — même nature que les créneaux

`/site/edt/periodes/<annee>` porte désormais une liste ordonnée de `{rang, nom, debut, fin}`.
**Le code n'écrit aucun nom de période.** Il lit l'objet, comme il lit les créneaux. Le découpage d'une année est déclaré, jamais déduit.

**Comment il arrive** — par la même injection que la grille. Une seule voie, « Grille de l'emploi du temps », écrit **trois nœuds** : `grille` (les cases), `creneaux` (les horaires, plus les jours ouvrés et les demi-journées sans cours), `periodes` (le découpage, noms tels qu'écrits sur la feuille, dates vides). L'écran de vérification montre les trois avant le geste.

**Éditable ensuite**, exactement comme les horaires : `edtPeriodeAjouter` · `edtPeriodePoser(rang, champ, valeur)` (renommer, dater) · `edtPeriodeSupprimer` · `edtPeriodeDeplacer`. Tout passe par `edtPeriodesEcrire`, qui valide **avant** d'écrire.

**Refus nommés** — `edtValiderPeriodes` : nom vide, nom en double, date mal écrite, fin avant début, chevauchement de deux périodes datées.

**Cohérence** — `edtEtiquettesOrphelines()` compare ce que la grille cite à ce que les périodes déclarent, et l'écran l'affiche : « La grille cite PFIN — non déclarée dans les périodes. » Signalé, jamais bloquant.

**Repli** — objet absent ou vide : `edtPeriodes()` rend une liste vide, `edtPeriodeA()` rend `null`, l'écran dit « l'année compte une seule période, et les cases étiquetées valent partout ». Comportement d'avant, inchangé.

## ② LES DATES SURVIVENT — et ce qui disparaîtrait est DIT AVANT

À la réinjection, `edtFusionnerPeriodes` garde les dates d'une période dont le nom existe déjà. **Mesuré** : P1 daté 01/09 → 06/11 et P2 daté 15/11 → 08/01 sont intacts après réinjection complète de la grille.

Mais une réinjection remet la liste de la feuille : une période **ajoutée ou renommée à la main** n'y est pas, et disparaîtrait. Le mandat ne tranche pas ce cas. Je n'ai pas décidé à la place de Paul et je n'ai rien laissé se perdre en silence : l'écran de vérification **annonce le différentiel avant le geste**, au patron du site (« tu vois exactement ce qui sera écrit, et tu choisis »). Mesuré, mot pour mot :

> Lu sans erreur. 30 cases lues, sans doublon. 8 horaires. Périodes : 2 gardent leurs dates (P1, P2) · PFIN arrive · ⚠ P5, P6 seraient RETIRÉES — si tu les as ajoutées ou renommées à la main, elles disparaîtront.

Si Paul veut un autre comportement (fusion plutôt qu'annonce), c'est une ligne à changer dans `edtInjecterAvecLaGrille`.

## ③ LES PREUVES EXIGÉES — les cinq, plus deux

| Exigé | Mesuré |
|---|---|
| l'objet livré avec les cinq périodes de 2026-2027, dates vides, affiché tel quel | `P1[→] P2[→] P3[→] P4[→] PFIN[→]` |
| renommer « PFIN » en « P5 » à la main → la grille et l'écran suivent | `P1 P2 P3 P4 P5`, sans redéploiement ; l'écran signale aussitôt « La grille cite PFIN — non déclarée dans les périodes » |
| ajouter une sixième période → acceptée | `P1 P2 P3 P4 P5 P6` |
| deux périodes qui se chevauchent → refus nommé | « P1 » et « P2 » se chevauchent (2026-11-30 / 2026-11-15) |
| objet vidé → repli « une seule période » | liste 0 · `edtPeriodeA` → `null` · l'écran porte la phrase |
| *(en plus)* nom en double et fin avant début | deux refus nommés, l'un par période |
| *(en plus)* la période en vigueur à une date | 7 septembre → P1 · 1er décembre → P2 |

Captures : `3a-1-periodes-livrees` · `3a-2-renommee-et-orpheline` · `3a-3-repli-une-seule-periode` · `3a-4-annonce-avant-reinjection`.

## ④ LE CONTRÔLE DU « EN DUR » — relecture ligne à ligne du bloc

**Ce qui a été retiré :**

| Était en dur | Est devenu |
|---|---|
| `['P1','P2','P3','P4','PFIN']` dans l'écran | lu dans l'objet `periodes` |
| `c.jour==='mercredi' && creneau>'12:00'` | `creneaux.sansApresMidi`, déclaré avec les horaires |
| `['lundi'…'vendredi']` imposé | `creneaux.jours`, déclaré |

**Ce qui reste, et pourquoi — je le déclare plutôt que de le cacher :**

1. **Le repli des jours ouvrés**, `['lundi'…'vendredi']`, quand l'objet ne les déclare pas. C'est un repli, du même ordre que celui des huit créneaux : sans lui, une grille non déclarée ne validerait plus rien. Il ne s'applique jamais quand l'objet parle.
2. **Les lettres de semaine `A` / `B`**, dans le validateur du calendrier et dans le filtrage des cases. Ce n'est pas une donnée d'année : c'est le vocabulaire de l'alternance, partagé par la grille, le calendrier et le code. Si un établissement passait à trois lettres, ce serait un lot, pas un réglage.
3. **La bascule d'année scolaire au mois d'août** dans `EDT_ANNEE` (`getMonth() >= 7`). Aucune année n'est écrite — l'année se calcule — mais le mois de bascule est une constante. À déclarer si une année devait basculer ailleurs.
4. **Le format des dates** `AAAA-MM-JJ` dans les validateurs, et le `08:00:00` de `brevetDates` : ce sont des formats, pas des valeurs.

**Aucune valeur d'année, aucun nom de période, aucun nom de classe, aucune date n'est écrite dans le bloc.** Vérifié par relecture et par recherche : les seules occurrences de « 2026 » sont dans un commentaire d'explication, aucune de « P1 », « PFIN », « mercredi » ni d'un nom de classe.

## ⑤ ÉTAT DU CANDIDAT

| | |
|---|---|
| Candidat | 8.71.0, **1 555 497 o** (+32 644 sur la base) |
| Double parseur | `new Function` + acorn ES2020, 2 scripts, vert |
| Garde `verif_edt.py` | **VERT** sur les trois questions |
| Moteur `AT_DR_B64` | **intact**, md5 inchangé |
| `published` | 97 → 97 |
| Appels `edt*` hors du bloc | `edtSectionPanneau` — la porte ②, et elle seule |
| Écritures hors `/site/edt/` | `PUT /site/config/brevetDates/3e` — l'exception ①, et elle seule |

**Aucune dette ouverte.** Une seule question ouverte, posée sans être comblée : le comportement voulu à la réinjection pour une période ajoutée à la main (§②) — aujourd'hui : annoncée avant le geste, jamais perdue en silence.

## ⑥ CE QUI VIENT — ③b

Le prévu calculé et la semaine sans scroll : la projection des séances non jouées sur les prochains créneaux, le fil langue, le réel qui colore les cases passées, les cartes de classe, et les deux portes restantes (arrivée du professeur, bandeau du déroulé) — déjà déclarées dans la garde, qui refusera tout appel qui n'en serait pas une.

*Mot à attendre : **continuer**.*
