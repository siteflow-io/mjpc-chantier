# RAPPORT — LOT 2ter · livraison ② (finale) · CE QUE DEVIENT UNE COCHE QUAND LES CHOSES BOUGENT
Version **8.73.0-②**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ② | 1 662 507 | `cb20546e7abe9b4c32e322a5b03f7c60` | 8.73.0-①ter |
| ②a | 1 667 148 | `64908545b78f0749f87c225d10e072be` | 8.73.0-②a |
| ②b | 1 670 478 | `4af687cf86bac6dc5a4875d6ae35ea03` | 8.73.0-②b |
| **Candidat ②** | **1 673 446** | **`92880802422d67c825e4dbd95313cac0`** | **8.73.0-②** |

md5 **relu au sas après le push** : identique. Garde VERTE sur le fichier relu.

## §④ — LES QUATRE CAS, DANS LES MOTS DE PAUL
Banc : `tests/banc-coches-bougent-02.mjs`. L'événement « Séjour Verdun 3e » (14→16/10) est coché **par clic réel** sur sa case, ce qui pose 2 décisions d'heure. Puis les choses bougent.

| Cas | Mesuré |
|---|---|
| **L'événement ne bouge pas** — réinjection à l'identique | case **cochée**, 2 décisions au magasin, **2** heures justifiées, **aucun message**. Les coches restent, sans un mot. |
| **L'événement se déplace** (14→16/10 devient 16→18/11) | case **VIDE** · les 2 décisions **restent au magasin**, heures justifiées **2** · la ligne affiche « **tu avais coché 2 heures sur les dates précédentes** ». **Rien n'est reporté** : Paul recoche s'il veut. |
| **La grille change sous l'événement** (le mercredi de la 3e passe au jeudi) | même règle : l'heure qui n'est plus sous l'événement est comptée à part, la ligne dit « **tu avais coché 1 heure sur les dates précédentes** », les décisions restent. |
| **L'événement disparaît** (calendrier réinjecté sans lui) | **modale AVANT le geste** : « Ce calendrier ne contient plus 1 événement que tu avais coché : • Séjour Verdun 3e — 2 heures. Leurs heures restent marquées et comptent toujours : rien n'est effacé. » · **0 écriture avant la réponse** · après « Injecter quand même » : 14 événements, Verdun parti, **2 décisions toujours là, 2 heures justifiées**. |

Trois fonctions portent cela, nommées comme le §⑤ l'exige — `function edt*` **152 → 154** :
- `edtCochesDeLEvenement(id)` — toutes les coches posées par un événement, où qu'elles soient ;
- `edtCochesDeplacees(ev)` — celles qui ne sont plus sous lui ;
- `edtEvenementJustifie(ev)` **modifiée** : elle ne regarde plus que les heures que l'événement recouvre **aujourd'hui**. C'est ce qui fait revenir la case vide quand il a bougé.

## §⑥.11 — LES CAPTURES PAR CLICS
`tests/captures-coche-02.mjs`, joué **deux fois, même parcours** : sur `8.73.0-①ter` (préfixe `AVANT-01ter-coche-*`) et sur le candidat (préfixe `APRES-02-coche-*`), quatre captures écran entier chacune plus le journal.
Parcours : clic « 🛠 Panneau prof » → clic « 📅 Emploi du temps » → clic « Ouvrir l'emploi du temps » → clic « Calendrier de l'année… » → **clic sur la case de l'événement** → retour vue Semaine.

| | AVANT (①ter) | APRÈS (②) |
|---|---|---|
| ce que le clic écrit | `/site/edt/calendrier/2026-2027` | **`/site/edt/decisions/2026-2027`** |
| magasin après le clic | 0 décision | **2 décisions** |
| champ dans l'objet calendrier | **1** | **0** |
| heures justifiées | 2 | **2** |

Une seule ligne du parcours n'est pas un clic, déclarée : `document.body.classList.add('admin-mode')`.

## §⑥.12 — AUDIT ADVERSE
`tests/audit-adverse-02.mjs`. **Aucune casse, aucune erreur de page.**

| Cas cherché | Mesuré |
|---|---|
| coche sur un événement dont aucune classe n'est appariée (4e) | 0 heure trouvée, **0 écriture**, le site dit « Aucune heure de cours sur ces dates : rien à marquer » |
| deux événements cochés sur la même heure | le site **dit avant** (« 2 heure(s) portent déjà un autre motif — 2026-10-14 10:07-11:02 … »), le plus récent devient propriétaire des 2 clés, **2 heures comptées, pas 4** |
| calendrier à moitié migré | 5 décisions reprises, champ retiré de 7 événements, aucune casse |
| magasin `decisions` absent (hub vide, l'état réel) | 0 décision, **0 écriture inutile** |
| **classe renommée entre deux chargements** | les décisions restent sous l'ancien nom : **1 clé sous l'ancien, 0 sous le nouveau**, compte **1** pour l'ancien, **0** pour le nouveau. Rien n'est perdu, rien n'est déplacé tout seul. **Voir écarts.** |
| décision dont l'événement a disparu | la décision **reste**, l'heure compte toujours (**1**), 1 coche orpheline nommée, 0 écriture |
| le hub tombe entre les deux écritures | mesuré en ②b : coche en double, rien de perdu, reprise au chargement suivant |

## §⑤ — NON-RÉGRESSION, remesurée sur le candidat final
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 0 appel** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**Les cinq bancs rejoués sur ce candidat** : mise à niveau (hub vide 0 · hub complet 0 · archive puis écriture · échec 0 · abandon global 0 · concurrents 1) · périodes (3/3 partout) · grille datée (pose 6, déplacé garde `crn:1a22nwk`) · coche ②a (1 écriture au magasin, 0 → 2, puis 2 → 2 avec avertissement) · migration ②b (10 décisions, 0 écriture au second chargement, reprise après panne, **réinjection : 10 → 10**).
**Garde** : VERTE ; **ROUGE sur trois contrôles négatifs** — `mjpcSucces()` dans `edtCochesDeplacees` · `edtCochesDeLEvenement()` hors du bloc · écriture des décisions vers `/site/ailleurs/`.

## Écarts signalés, jamais ajustés
1. **Une classe renommée emporte le compte avec l'ancien nom.** La clé d'heure contient le nom de la classe (`edtCleHeure`) : après un renommage, les décisions restent lisibles sous l'ancien nom et la nouvelle classe compte 0. **Rien n'est perdu**, mais rien ne suit non plus. Réapparier des décisions à un nouveau nom, c'est de l'appariement — **livraison ③**. Je le signale et j'attends.
2. **Quand la grille change, la case peut rester cochée.** Si l'événement recouvre encore au moins une heure marquée, la case reste cochée et le message ne compte que les heures sorties. Le §④ dit « cases VIDES » : c'est vrai quand **toutes** les heures ont changé (cas de l'événement déplacé, mesuré). Quand une partie tient encore, vider la case effacerait une information vraie. Je le dis plutôt que de le taire.
3. **`justifie` : 3 occurrences subsistent**, toutes dans la charge de reprise (`②b`). Une migration doit lire le champ pour le faire disparaître.
4. **`edtMettreANiveau` : 2 appels** (le second **est** le temps 2 de la migration, dans le rappel de succès du premier) — déjà signalé en ②b.
5. **La modale de disparition compte les événements, pas les heures, dans son titre** (« 1 événement que tu avais coché »), le détail des heures suit ligne par ligne. Choix d'écriture, pas de mesure.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages, je n'ai pas d'adresse à donner pour un essai à la main.
- **Le décochage heure par heure dans la semaine** (ce que la modale de disparition propose) : il passe par la modale d'une case, qui relève des livraisons ⑥ à ⑧.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-②**) · `rapport-2ter-02a.md`, `rapport-2ter-02b.md`, `rapport-2ter-02.md` · `json/calendrier-2026-2027.json` · `prompts/calendrier.md` · `tests/banc-coche-02a.mjs`, `tests/banc-migration-02b.mjs`, `tests/banc-coches-bougent-02.mjs`, `tests/audit-adverse-02.mjs`, `tests/captures-coche-02.mjs` · `tests/calendrier-herite-justifie.json`, `tests/calendrier-herite-coche.json` · les huit captures `AVANT-01ter-coche-*` / `APRES-02-coche-*` et leurs journaux.

## ARRÊT
Le mandat ② est fini : la coche est sortie de l'objet, le champ a disparu, la migration est ordonnée et reprenable, la réinjection ne perd plus rien, et ce qui bouge est **nommé** au lieu d'être décidé à la place de Paul. **Aucune dette ouverte dans le périmètre.** Deux sujets attendent une décision : la classe renommée (appariement, livraison ③) et le décochage heure par heure (livraisons ⑥ à ⑧). Paul promeut sur captures : elles sont au sas, avant et après, écran entier.
