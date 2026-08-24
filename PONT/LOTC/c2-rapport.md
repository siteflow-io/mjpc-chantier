# LOT C2 — L'IDENTITÉ DES ÉCRANS
Exécutant · 24/08/2026 · candidat `PONT/LOTC/c2-index.html`. **STOP après livraison.**
Lus avant de coder : `PASSATION-C6-C7.md` (§⑦ et la matrice), `OU-EST-CE-DEJA-ECRIT.md`, `DEROULE/CADRAGE-TEMPS.md`, `docs/MJPC6-2-DOCTRINE.md`. **Le principe n'est pas inventé : il est étendu.**

## ⓪ SCEAU
| | |
|---|---|
| base re-téléchargée | md5 **`ab12de9a8b6382a05e34eeb64fe3c00a`**, **1 461 851 o** = attendu (v8.63.0) |
| candidat | **1 474 448 o**, md5 **`a4a985efff9e1f902ea2fabd3bc64fc3`** |
| `APP_VERSION` | **8.64.0** · double parseur (node + acorn ES2020) : **verts** |
| moteur `AT_DR_B64` | **identique** (l'identité se pose depuis le pont) |
| `secu*` | **29, aucune divergente** · `published` : 97 → 97 |
| fonctions | **14 modifiées, 7 neuves, 0 supprimée, 0 rétrécie** · 21 zones de diff |
**Intouchés, corps comparés à l'octet** : `atT5Modale`, `atT5Appel`, `atT5Appliquer`, `atT5Etat`, `atT5Veille`, **`atT5Choix`** (tout le T-5) · `atDrReprendre` (reprise dans la préparation) · `_drCopieAuto` (copie au fil de l'eau) · `_drTraceAuto`, `atVecuSortir` (trace de C1) · `atVecuMinutes`, `atVecuAfficher`, `atTempsUtile`, `atDrCloreFin` — **toutes IDENTIQUES**.
**Aucune donnée existante n'est migrée** : les écrans déjà au hub n'ont pas d'identité et n'en recevront qu'à leur premier passage dans le moteur. Paul purge avant la rentrée — dit en toutes lettres, comme demandé.

## ① L'IDENTITÉ, POSÉE EN UN POINT DE PASSAGE — **aucune des treize fonctions du moteur n'est touchée**
`_drIdentifierEcrans()` suit le patron `idBloc` : l'identité s'attribue **au passage, si elle manque**. Elle est posée dans **l'enveloppe existante de `W.rendre`** (pilote et téléphone) et dans `_drNormaliserTrame` (les six portes d'entrée du LOT A). Identité **opaque** (`e` + base36) et **immuable** ; le libellé `act` reste séparé.
| mesure (banc trois pages) | 8.63.0 | candidat |
|---|---|---|
| écrans portant une identité | **0 / 11** | **11 / 11** |
| identités opaques | 0 | **11** |
| **doublons d'identité** | — | **0** |

## ② LES FILS DU ZOOM N'ONT PAS D'IDENTITÉ PROPRE — règle de Paul (24/08)
Un écran de suite ne reçoit **jamais** d'identité stable : il porte celle de son père via `grp`, et meurt au dézoom. Mesuré après scission : **2 fils, 0 identité** (`filsAvecEid: 0`).
**Le piège nommé est traité** : `_drRefusionner` **conserve l'identité du père** et n'en fabrique aucune pour les morceaux — une ligne y efface toute identité qui aurait survécu à l'absorption, parce que **deux écrans partageant une identité seraient pires que pas d'identité du tout**.
**Les ancres sont toujours le père** : `atVecuEntrer` normalise le rang reçu en rang du père (`_drRangPere`) — sans quoi zoomer pendant une activité la couperait en deux lignes de vécu dont l'une mourrait au dézoom.

## ③ LES CINQ CONSOMMATEURS — dans l'ordre de risque demandé
**1. La comparaison de clôture — l'effet le plus visible, prouvé.** Scénario : séance jouée, **un écran inséré pendant le cours** (le geste d'appoint de Paul), rien d'autre modifié.
| | 8.63.0 | candidat |
|---|---|---|
| modifications annoncées | **11** | **1** |
| dont écrans réellement ajoutés | 1 | 1 |
| **écrans faussement « modifiés »** | **10** — « Révision », « Interro de cours », « Mise en commun », « Notion », « Travail individuel »… | **0** |
C'est le « Tu as modifié 1 chose » du test réel du 23/08, à l'échelle : dès qu'un rang glisse, la base attribue à chaque écran le contenu de son voisin. L'appariement se fait désormais par identité ; **à défaut d'identité (préparation antérieure au lot), on retombe sur le rang — jamais pire qu'avant**.
**2. Les décisions du T-5** — écrites par identité (`decisionsParEcran`), le rang restant lisible à côté. **Signalé sourcé** : le mandat classe le T-5 parmi les intouchés *et* demande que ses choix cessent de parler en rangs. J'ai tranché en gardant `AT_T5_CHOIX` indexé par rang **en mémoire vive** (les six fonctions du T-5 sont identiques à l'octet) et en traduisant **à l'écriture** — conformément à la règle générale du mandat : « ce qui pourrait se tromper se vérifie à l'écriture, jamais à la lecture ». Mesuré : `decParEcran: 1` pour une décision prise.
**3. Le vécu** — chaque ligne porte `eid` en plus de `n`, et s'ancre sur le père (②).
**4. La participation** — le moteur écrit `ecran:i` (un rang) et **n'est pas touché** : l'identité du père est ajoutée **à l'écriture** de `part.json`.
**5. La scène** — bascule en dernier, puisqu'elle circule entre trois appareils : elle transporte `eid` + `morceau`, le rang restant émis pour le repli. `_sesRangLocal()` résout l'identité en rang **local** chez chaque appareil.

## ④ LES TROIS APPAREILS DÉSIGNENT LE MÊME ÉCRAN — banc trois pages, zoom à fond
| | 8.63.0 | candidat |
|---|---|---|
| écrans : pilote / téléphone / tableau | 13 / 11 / 11 | 13 / 11 / 11 |
| identité désignée par les trois | `null` / `null` / `null` | **`emt7b76p79ubbn` / idem / idem** |
| **`memeEcran`** | **false** | **true** |
| **la scission opère toujours** | oui | **oui** (`scissionOpere: true`) — la voie « suspendre le zoom » du LOT B est bien **écartée**, le contenu qui déborde reste reporté |
| écritures depuis la vue | 0 | **0** |

## ⑤ L'ANTICIPATION — la contamination rendue impossible par construction
- **La classe entre dans la clé** : `2026-08-24_10h07-11h02_c3a`. Deux classes ne peuvent plus se confondre, quoi qu'il advienne du calcul de créneau.
- **Le lancement refuse une trace incohérente** : si la trace trouvée porte une autre classe ou un autre créneau, elle **n'est pas reprise** et l'heure part à neuf, avec un message. *Une trace de trop se voit et se corrige ; une trace mêlée ment en silence.*
- **La clôture de l'heure précédente est certaine**, y compris après un rechargement (le cas réel : entre deux classes, Paul ferme la page) : `cours_actif` fait foi, et l'ancienne heure est close par **écritures ciblées** (`clos`, `finReel`, `closPar`) — **sans jamais réécrire son paquet**, puisque ses données ne sont plus en mémoire et qu'on n'invente rien. Le professeur n'est pas bloqué : on avertit d'une ligne, le lancement continue.
**Banc de l'enchaînement à deux minutes** (3e à 10:07-11:02, page fermée, 4e à 11:04-11:59) :
| | 8.63.0 | candidat |
|---|---|---|
| clés | `…_10h07-11h02` / `…_11h04-11h59` (sans classe) | `…_10h07-11h02_c3a` / `…_11h04-11h59_c4h` |
| heure de la 3e après lancement de la 4e | reste **ouverte** | **close** (`clos: true`) |
| trace de la 4e | — | **vierge** : son créneau, ses propres activités, **0 décision** héritée |
| écritures non-GET sorties | 0 | **0** |

## ⑥ MATRICE ACTIONS × ÉTAT — prouvée par l'ÉTAT, pour les écrans
| ligne | état mesuré |
|---|---|
| **ajouter** | l'écran inséré reçoit une identité **neuve** au premier rendu (11→12 identités, 0 doublon), dévoilement à zéro |
| **copier / dupliquer** | l'identité s'attribuant **si elle manque**, une copie porte l'identité de l'original **jusqu'à son premier passage**… **RÉSERVE, voir ⑦** |
| **couper / coller** | idem — même réserve |
| **déplacer** | tout conservé : l'identité voyage avec l'objet (c'est le même objet), les trois appareils le suivent — vérifié au zoom, qui déplace les rangs |
| **supprimer** | l'identité disparaît avec l'écran ; aucune trace ne la réutilise (0 doublon après scission/dézoom) |
| **zoom / dézoom** | dévoilement transmis au morceau reporté et **recollé au retour** : `rev`/`vues` retrouvés à l'identique après dézoom (11/11/11, `memeEcran: true`) ; les fils n'ont **aucune** identité |
| **fiche** | dévoilement interne conservé ; la scène transporte `ficheEid` |

## ⑦ CE QUI RESTE À TRANCHER — réserve nommée, non maquillée
**La duplication d'un écran copie son identité.** Le patron `idBloc` n'attribue que si l'identité **manque** : un écran dupliqué arrive donc avec celle de son original, et rien ne les distingue tant qu'un doublon n'est pas détecté. La matrice exige un **identifiant NEUF** à la duplication. Deux voies, aucune codée ici : (a) `_drIdentifierEcrans` détecte les doublons au passage et en réattribue une neuve au second — simple, mais le « second » est arbitraire ; (b) envelopper les deux fonctions de duplication du moteur depuis le pont — plus juste, mais elles sont treize à créer des écrans et le mandat interdit de les toucher une par une. **Je ne tranche pas seul : c'est un choix de doctrine.** Dans l'intervalle, l'effet est borné — un doublon d'identité ne provoque aucune perte, seulement un appariement possible du mauvais écran à la clôture, ce qui était le comportement de la base pour **tous** les écrans.

## ⑧ CE QUE LE BANC NE PROUVE PAS
Le hub réel (latence, règles, coupure en cours d'écriture) : toutes les écritures sont **simulées en mémoire et jamais transmises** — déclaré, compté (`nonGETautres: 0`) · une vraie heure de 55 minutes · le tactile Android et le clavier mobile · le réseau de l'établissement · le vidéoprojecteur · **et l'enchaînement réel à deux minutes, chronomètre en main**. **Le test de Paul sur ses trois appareils reste le juge.**
