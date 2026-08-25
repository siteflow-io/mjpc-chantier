# LOT D — RAPPORT DE PHASE 0 : LE DÉFAUT EST REPRODUIT
Exécutant MJPC · 25/08/2026 · **écrit AVANT toute ligne de correctif**, comme le mandat l'exige.

## ⓪ SCEAU D'ENTRÉE
| | |
|---|---|
| production retéléchargée | md5 **`d93207f7d49fbd673955a9567a010bfe`**, **1 490 438 o** = attendu (v8.67.1, `APP_VERSION` L2832) |
| lectures faites | `MJPC6-OU-TROUVER-QUOI.md` · `MJPC6-1-DISPOSITIF.md` · `MJPC6-2-DOCTRINE.md` · `MJPC6-INDEX-FONCTIONS.md` (par recherche) · sas : `DETTE-VUE-TABLEAU-DISTANTE.md`, `TABLEAU-DISTANT/rapport.md`, `lotB-rapport.md`, `LOTC/c3a-rapport.md`, `PASSATION-C6-C7.md §⑦` |
| hub | **lecture seule** (`curl`), instantané rangé dans `tests/hub/` ; le navigateur du banc ne l'a jamais joint |

## ① LES PIÈCES DU HUB RÉEL — instruites avant le banc
Relevé le 25/08 sur `site/3e/chapitres/0/seances/0`, après la séance réelle de 11h19 :

| pièce | mesure |
|---|---|
| `deroule/ecrans` (préparation, 14 écrans) | **`eid` : AUCUN** sur les 14 |
| `deroule_joue/3E Charles de Gaulle/ecrans` (14 écrans) | **`eid` : AUCUN** sur les 14 |
| `deroule_joue/3E Charles de Gaulle/scene` | `{ecran: 4, **eid: "emt8kol39pmxj0"**, morceau: 0, rev: 2, vues: [0]}` |

**La scène porte une identité qui n'existe dans aucune trame du hub.** La chaîne se lit alors sans hypothèse :
`sesTabPoll` (L16833) → `_sesRangLocal` (L16611) → `_drRangDeLEid(...)` → **`null`** → repli sur `o.ecran|0`, c'est-à-dire **le rang du pilote, qui compte les fils du zoom**.

Et la fabrique d'identités neuves est confirmée : `_drNormaliserTrame` (L15194) appelle `_drIdentifierEcrans` **à chaque entrée de trame** (L15196) — y compris au montage de la vue distante (L16824) et à la sixième porte (L16864). La vue se fabrique donc des identités qui ne sont celles de personne.

Côté pilote, `atDrJouer` (L14858) copie `tr.ecrans` **sans passer par l'identification** (L14870) ; les `eid` ne naissent qu'au crochet de `rendre()` (L16478) et ne remontent qu'à la prochaine `_drCopieAuto` (L16007).

**La cause instruite par la conscience est exacte.** Elle est ci-dessous reproduite, pas seulement lue.

## ② LE BANC — deux pages, faux hub en mémoire, parcours par CLICS RÉELS
`tests/banc-phase0.mjs` · `tests/socle.mjs` · `tests/hub-faux.mjs` · `tests/gestes.mjs`

- **Faux hub** : GET servis depuis l'instantané en mémoire ; **PUT / PATCH / POST / DELETE interceptés, comptés, JAMAIS transmis** ; toute autre sortie réseau (polices, QR, Drive) **avortée**. Le préalable CORS (`OPTIONS`) reçoit une vraie réponse 204 — sans quoi aucun `PUT` du site n'aurait lieu et le banc mesurerait une session morte (**piège rencontré et corrigé : la première passe montrait 12 « écritures » qui n'étaient que des préalables**).
- **Décor** : le chapitre 3e RÉEL de Paul (« Poésie et peinture au XIXe siècle (proposition) », 9 séances), ses classes, sa taxonomie, ses manifestes.
- **Parcours réel** : `#tprof-btn` → **Atelier** → **Mes chapitres** → **Modifier** → **Déroulé** → **▶ Lancer la séance**. Aucun raccourci de code sur cette chaîne. *(Seul l'amorçage — `admin-mode`, `SECU.valide`, garde masquée, `loadPublished('3e')` — est posé programmatiquement : ce sont les quatre étapes que le mandat énumère séparément de la chaîne.)*
- **Deux pages** : pilote 1440×900 · `?vue=tableau` 1360×768.
- **Le zoom scinde réellement** : au cran maximal (`PT = 24·32·38·44·52`, cran 5 = 52 pt), l'écran 1 passe de **1 à 15 écrans puis 18** au fil du dévoilement, avec `grp: g1` et des fils `suite 1, 2, 3, 4`.

## ③ LA REPRODUCTION CHIFFRÉE — base 8.67.1

**Identités : `eid` dans la copie jouée écrite au hub au lancement → `AUCUN` sur les 14.**
**Identités communes pilote / vue distante : 0 sur 14.**

| pas | pilote | scène émise | tableau distant | verdict |
|---|---|---|---|---|
| état initial | i=0 · « Analyse d'images » · rev 0 | eid=`emt8lqjfgzm8ac` ecran=0 | i=0 · « Analyse d'images » | ✔ |
| dévoilement 1 | i=0 · rev 1 | ecran=0 | i=0 · « Analyse d'images » | ✔ |
| dévoilement 2 | i=0 · rev 2 | ecran=0 | i=0 · « Analyse d'images » | ✔ |
| dévoilement 3 | i=0 · rev 2 | ecran=0 | i=0 · « Analyse d'images » | ✔ |
| dévoilement 4 | i=0 · rev 2 | ecran=0 | i=0 · « Analyse d'images » | ✔ |
| **dévoilement 5** | **i=1 · suite 1** | eid=`emt8lqjfgzm8ac` **ecran=1** | **i=1 · « Heure 1 · Tableau 1 »** | **✖ DÉCALAGE** |
| dévoilement 6 | i=1 · suite 1 | ecran=1 | i=1 · « Tableau 1 » | ✖ |
| **dévoilement 7** | **i=2 · suite 2** | **ecran=2** | **i=2 · « Tableau 2 »** | **✖** |
| dévoilement 8 | i=2 · suite 2 | ecran=2 | i=2 · « Tableau 2 » | ✖ |
| **dévoilement 9** | **i=3 · suite 3** | **ecran=3** | **i=3 · « Tableau 3 »** | **✖** |
| dévoilement 10 | i=3 · suite 3 | ecran=3 | i=3 · « Tableau 3 » | ✖ |

**6 pas en décalage sur 11.** Le décalage vaut **exactement un cran par fil** : sur le morceau *n*, le tableau montre l'activité *n* rangs plus loin. **Les fils n'apparaissent jamais au tableau** — et ils n'ont pas à y apparaître : ils n'existent pas dans sa trame, qui n'a pas scindé.

C'est **mot pour mot le symptôme du professeur** : « *quand les fils se génèrent, la vue tableau saute directement à la diapo suivante* ».

**Captures entières des deux pages côte à côte** : `D-avant-8.67.1.png` — le pilote est sur le 4ᵉ morceau de « Analyse d'images » ; le tableau projette « HEURE 1 · TABLEAU 3 », *Le Radeau de la Méduse*. Trois activités d'avance sur ce que la classe devrait voir.

## ④ CE QUE LE BANC A AUSSI MESURÉ SUR LA BASE (`D2-base`)
| épreuve | base 8.67.1 |
|---|---|
| replier ×3 depuis le morceau 2 | tableau sur « Tableau 1 » — **décalage** |
| dézoom (les fils meurent) | tableau **inchangé**, 186 signes ✔ |
| gel, pilote avancé | image **figée** à 181 signes ✔ mais sur le **mauvais écran** |
| dégel — rattrapage | tableau rattrape sur « **Tableau 4** » — **décalage** |
| reprise à froid de la page tableau | rouverte sur « **Tableau 4** » — **mauvais écran** |

**4 pas en décalage sur 7.**

## ⑤ COMPTES DU BANC
| | |
|---|---|
| écritures **sorties** vers le hub | **0** (18 interceptées, rangées en mémoire, jamais transmises) |
| GET servis en mémoire | 151 |
| `pageerror` | **0** sur les deux pages |

## ⑥ CE QUE CE BANC NE PROUVE PAS
Le hub réel (latence, règles Firebase, coupure en cours d'écriture) · le réseau de l'établissement · le vidéoprojecteur · deux machines physiques distinctes · le redimensionnement à la souris par paliers. **Le test de Paul sur ses deux machines reste le juge.**

---
*Phase 0 close. Le correctif est instruit dans `rapport.md`.*
