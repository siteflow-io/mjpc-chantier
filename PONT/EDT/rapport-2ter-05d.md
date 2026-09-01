# RAPPORT — LOT 2ter · livraison ⑤d · LE BANC UNIQUE, ET DEUX RÈGLES DE BANC
Exigence ajoutée par Paul le 01/09. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat
| | octets | md5 | version |
|---|---|---|---|
| Candidat au sas, **inchangé** | 1 727 359 | `885ae067afe7025d1213efe85930fbe3` | 8.73.0-⑤c-ter |

**Aucune ligne d'`index.html` n'a été touchée** : cette livraison ne porte que sur les bancs. md5 relu au sas après le push des bancs : identique.

## `tests/banc-tout.mjs` — un banc, une commande
22 bancs enchaînés dans l'ordre des livraisons, **une ligne par banc**, **sortie ≠ 0 si un seul échoue**. Il n'invente aucun test : pour chaque banc il vérifie **3 repères en moyenne, 62 en tout**, et ces repères **sont les chiffres publiés par les rapports** (« conservés depuis le hub : 3 / 3 », « IDENTIQUE BIT À BIT : true », « evc: 15, jal: 30, eta: 59, fer: 11, vac: 7 »…). Il tue le navigateur entre deux bancs, pose une limite de temps par banc, et accepte une tranche (`node tests/banc-tout.mjs index.html 0 5`).

Commande : `node tests/banc-tout.mjs index.html`

## LE COMPTE-RENDU COMPLET, mesuré
| | banc | durée | repères |
|---|---|---|---|
| ✔ | ①bis-a · la mise à niveau au chargement | 58 s | 3/3 |
| ✔ | ①bis-b · l'identité des périodes | 23 s | 3/3 |
| ✔ | ①ter · la grille datée | 7 s | 3/3 |
| ✔ | ②a · la coche sort de l'objet | 11 s | 3/3 |
| ✔ | ②b · la migration des coches héritées | 63 s | 3/3 |
| ✔ | ② · ce que devient une coche quand les choses bougent | 57 s | 3/3 |
| ✔ | ③a · l'appariement branché | 55 s | 3/3 |
| ✔ | ③b · le différentiel et la classe renommée | 51 s | 3/3 |
| ✔ | ③ · l'archivage avant écrasement (par clics) | 36 s | 3/3 |
| ✔ | ③bis-a · la classe d'essai en mode test | 13 s | 3/3 |
| ✔ | ③bis-b · l'identifiant dit sa famille | 32 s | 3/3 |
| ✔ | ④a · un seul collage | 40 s | 3/3 |
| ✔ | ④ · l'épreuve de bout en bout | 119 s | 3/3 |
| ✔ | ⑤a · l'écran Heures perdues | 11 s | 3/3 |
| ✔ | ⑤b · une heure ne compte jamais deux fois | 21 s | 3/3 |
| ✔ | ⑤c · banaliser, classer, basculer, déplacer | 19 s | 3/3 |
| ✔ | ⑤c-bis · l'archive des décisions | 11 s | 2/2 |
| ✔ | ⑤c-ter · les archives des autres objets | 15 s | 3/3 |
| ✔ | audit adverse ② · les coches | 39 s | 2/2 |
| ✔ | audit adverse ③ · l'appariement | 63 s | 2/2 |
| ✔ | audit adverse ③bis · la classe d'essai | 39 s | 2/2 |
| ✔ | le calendrier réel · 122 identifiants | 3 s | 3/3 |

**22 bancs, 62 repères, tous verts.** Total mesuré : environ 13 minutes.

## Ce que le banc unique a trouvé du premier coup
1. **`banc-coches-bougent-02` était mort sans que personne le sache.** Il cherchait la case unique d'un événement — supprimée en ⑤a au profit d'**une case par heure**. Il rendait « (ligne absente) » partout, **0 repère sur 3**. J'avais adapté `banc-coche-02a` à ce changement et **oublié celui-là** : la livraison ⑤a annonçait « les neuf bancs rejoués » sans l'avoir rejoué. Adapté (il coche maintenant les heures de la fiche, une par une, par clics réels), il repasse **3/3** et retrouve ses quatre cas du §④ : réinjection à l'identique → coches gardées ; événement déplacé → cases vides et « tu avais coché 2 heures sur les dates précédentes » ; grille changée → « 1 heure » ; événement supprimé → nommé avant le geste.
2. **Deux de mes repères étaient faux, pas les bancs** : celui de ②a (le banc coche deux heures depuis ⑤a, donc deux écritures) et celui de la grille datée (j'y avais mis la permutation, qui est mesurée par le banc de l'appariement). Corrigés, vérifiés.

## RÈGLE 1 — un banc passe par le geste, jamais par la fonction
**`tests/banc-archivage-03.mjs` faisait zéro clic** : il appelait `edtReglagePoser`, `edtSansSeance`, `edtPeriodeAjouter` directement. C'est bien par là qu'une dette est passée — l'archive qui portait l'état d'après (⑤c-bis, ⑤c-ter) n'a été vue par aucun banc.
Réécrit : ses six gestes passent par **la case « arriver sur l'emploi du temps » et le bouton « + Ajouter une période », cliqués**, dans le panneau prof ouvert par clics. Le banc note aussi si le clic a bien porté (`clic passé : true`).

## RÈGLE 2 — une preuve dit ce qu'elle contient
Le même banc ne dit plus « une archive est partie ». Il relit **l'archive réellement écrite à la corbeille** et publie son contenu, à côté de celui du hub :

| geste, par clic | ce que l'archive contient | ce que le hub porte |
|---|---|---|
| la case, second clic | `{"annee":"2026-2027","arriverSurEdt":false}` | `…"arriverSurEdt":true}` |
| « + Ajouter une période », 2ᵉ fois | `["P1"]` | `["P1","P2"]` |
| la case, corbeille en panne | `…false}` (inchangée) | `…true}` (inchangé) |
| une période, corbeille en panne | `["P1"]` | `["P1","P2"]` (inchangé) |

Et pour le premier geste sur un nœud vide : **`(aucune archive)`, 1 écriture** — une écriture qui ne remplace rien n'a rien à archiver.

## Écarts signalés, jamais ajustés
1. **Mon environnement coupe toute commande au-delà d'environ 90 secondes**, et tue les processus détachés avec elle — mesuré cinq fois. J'ai donc joué `banc-tout` **en douze tranches** (`0 1`, `1 2`, … `19 22`) et reconstitué le compte-rendu ci-dessus. **Chaque banc a bien été joué par `banc-tout`, sur le candidat `⑤c-ter`, mais pas les 22 d'affilée dans un seul processus.** Chez Paul, `node tests/banc-tout.mjs index.html` rendra le tableau d'un coup ; c'est pour ça que la tranche existe.
2. **La règle du 31/08 sur la case cochée ne s'applique plus telle quelle** : il n'y a plus de case unique par événement depuis ⑤a, mais une case par heure. Le banc lit donc « toutes les cases de la fiche sont-elles cochées ». Quand une seule heure sur deux a bougé, une case reste cochée et l'autre est vide — ce qui est le comportement voulu, mais **ce n'est plus la même phrase que dans le mandat**. Je le signale.
3. **Trois bancs restent hors du banc unique** : les trois scripts de captures (`captures-clics-01ter`, `captures-coche-02`, `captures-prompt-04`, `captures-mode-test-03bis`, `captures-reinjection-03`). Ils produisent des images, pas des chiffres à comparer ; les y mettre reviendrait à inventer des repères. À trancher par Paul s'il veut qu'ils y entrent.
4. **`banc-tout` juge sur des chaînes**, pas sur une structure. Un banc qui changerait sa mise en forme sans changer ses chiffres passerait pour cassé. C'est le prix d'un banc qui n'invente rien : il lit ce que les bancs impriment.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- **Les 22 bancs d'affilée dans un seul processus** (écart 1).

## Livrables poussés au sas (`PONT/EDT/`)
`tests/banc-tout.mjs` · `tests/banc-archivage-03.mjs` (réécrit, par gestes) · `tests/banc-coches-bougent-02.mjs` (adapté à l'écran de ⑤a) · `rapport-2ter-05d.md` (ce rapport). **`index.html` n'a pas bougé.**

## ARRÊT
Une commande, 22 bancs, 62 repères, et le premier passage a trouvé un banc mort depuis ⑤a. **Aucune dette ouverte dans le périmètre.** Reste la livraison **⑤** : l'alerte mensuelle (§⑤), la cinquième question de la garde (§⑥), les captures, l'audit adverse, le rapport final. Paul relance par « continuer ».
