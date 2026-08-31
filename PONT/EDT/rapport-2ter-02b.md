# RAPPORT — LOT 2ter · livraison ②b · LA REPRISE DES COCHES HÉRITÉES
Version **8.73.0-②b**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ②a | 1 667 148 | `64908545b78f0749f87c225d10e072be` | 8.73.0-②a |
| **Candidat ②b** | **1 670 478** | **`4af687cf86bac6dc5a4875d6ae35ea03`** | **8.73.0-②b** |

md5 du candidat **relu au sas après le push** : identique. Garde VERTE.

## LA PREUVE DU LOT — §⑥.8, donnée en premier comme le mandat le demande
Calendrier hérité migré, coches en place, puis **réinjection du calendrier par le geste réel du site** (`EDT_INJ` + `edtInjInjecter('calendrier')`, celui du bouton « Injecter ») :

| | |
|---|---|
| heures justifiées de 3E Charles de Gaulle | **10 → 10** |
| décisions encore au magasin | **10** |
| écritures de la réinjection | `/site/edt/calendrier/2026-2027`, `/site/config/brevetDates/3e` |
| objet réinjecté | 15 événements, **0 portant le champ** |

**Le calendrier a été remplacé de bout en bout, et pas une coche n'a bougé.** C'est ce que le lot existe pour obtenir.

## Ce qui a été fait — une charge de plus, rien d'autre
Une charge `coches`, inscrite par `edtChargeInscrire` comme le mandat le demande, qui travaille **en deux temps** dans la mise à niveau déjà branchée. L'archivage avant écriture et l'abandon global de ①bis-a n'ont pas été touchés.
- **Temps 1** — les coches héritées entrent dans le magasin (clé heure + `id` de l'événement + `libelle` + `reprise:true`), une ligne de journal par heure. La charge pose alors le drapeau `EDT.miseANiveauSuite`.
- **Temps 2** — le champ sort de l'objet, et **seulement** si le temps 1 a été accepté : le branchement dans `edtCharger` relance la mise à niveau dans le rappel de succès (`apres(true)`), jamais autrement.
- **Si le temps 2 n'aboutit pas**, la coche existe en double — magasin **et** objet. Rien n'est perdu, le chargement suivant termine.

## Preuves — §⑥, mesurées
Banc : `tests/banc-migration-02b.mjs` (faux hub REST, écritures journalisées dans l'ordre, un nœud peut être refusé pour simuler la panne). Pièce : `tests/calendrier-herite-coche.json` — le calendrier réel avec ses 6 événements 3e cochés. Commande : `node tests/banc-migration-02b.mjs index.html`

**⑥.3 — migration, l'ordre des écritures.** Premier chargement, dans l'ordre :
`calendrier` · `grille` · `creneaux` · **`decisions`** · **`calendrier`**
→ **10 décisions** au magasin, **10 lignes de journal**, **0 champ** dans l'objet, heures justifiées **10**. Le site dit : « champ « justifie » retiré de 15 événement(s) ».
**Écart signalé, important** : le nœud `calendrier` apparaît **deux fois**. La première écriture est celle de la charge `identite` (pose des 122 identifiants) et porte l'objet **avec** le champ — aucune coche n'y est perdue. Le calendrier **amputé du champ** n'est écrit qu'en second, après acceptation de `decisions`. L'ordre exigé par le mandat porte sur l'écriture qui retire le champ, et il est tenu.

**⑥.5 — idempotence.** Second chargement sur l'état obtenu : **0 écriture**, 0 archive, magasin inchangé (10), champ à 0. Une coche déjà dans le magasin ne s'y remet pas ; un calendrier déjà sans champ ne déclenche rien.

**⑥.4 — migration interrompue.** Le hub refuse `/site/edt/calendrier` : `decisions` est écrit (**10 décisions, journal 10**), le champ reste dans l'objet (**15 portant le champ, 6 cochés**) → **la coche existe en double, aucune n'est perdue**. Le site dit « 10 coche(s) héritée(s) reprises dans les décisions ».
**Reprise** : chargement suivant, hub rétabli → **1 seule écriture** (`/site/edt/calendrier`), **0 nouvelle décision** (rien n'est reposé), champ à **0**. La migration aboutit.

**⑥.6 — aucun compte ne change.** Heures justifiées après migration : **10**, lues au magasin. Le banc de ②a rejoué sur ce candidat rend les mêmes chiffres qu'à sa livraison : cocher « Séjour Verdun 3e » → 1 écriture (`decisions`), 0 → **2** heures, écart `{0,0,0}` ; deux motifs sur la même heure → **2 → 2**, avec l'avertissement.

**⑥.9 — non-régression** : `function edt*` **152** (aucune ajoutée, aucune disparue) · `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 0 appel** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15·30·59·11·7, 0 collision**.
**Les trois bancs de ① rejoués** : mise à niveau → hub vide **0** · hub complet **0** · sans `id` **1 archive puis 1 écriture** · archivage en échec **0** + message · abandon global **0** · concurrents **1**. Périodes → **3/3** partout, E **4/4**, F **5 distincts**. Grille datée → pose **6**, déplacé garde `crn:1a22nwk`, neuf reçoit `crn:ajmk4z`.

**⑥.10 — garde** : VERTE sur le candidat et sur le fichier relu ; **ROUGE sur trois contrôles négatifs** — `mjpcSucces()` dans la charge `coches` → « ① appelle hors contrat » · `edtHeuresDeLEvenement()` hors du bloc → « ② appelé hors du bloc sans être une porte » · écriture de la mise à niveau vers `/site/ailleurs/` → « ③ écriture hub hors de /site/edt/ ».

## Écarts signalés, jamais ajustés
1. **`edtMettreANiveau` : 1 appel → 2.** Le §⑤ demande de le laisser à 1. Le second appel **est** le temps 2, et il n'existe que dans le rappel de succès du premier : c'est ce qui garantit « `calendrier` ensuite, et seulement si la première écriture a réussi ». Sans lui, l'ordre ne peut pas être tenu sans reprendre l'écriture — ce que le mandat interdit. Je le signale plutôt que de le cacher dans un chiffre.
2. **`justifie` : 3 occurrences subsistent dans le code**, toutes dans la charge `coches` (`e.justifie`, `'justifie' in e`, `delete e.justifie`). Une migration doit lire le champ pour le faire disparaître. Elles disparaîtront le jour où plus aucun calendrier hérité ne circule — c'est une décision de Paul, pas la mienne.
3. **Une coche que rien ne peut reprendre garde son champ, et le site le dit.** Si un événement coché ne recouvre aucune heure de cours (classe pas encore appariée, dates en vacances), la reprise ne peut poser aucune décision : le champ **reste**, avec le message « X coche(s) sans heure de cours : le champ reste, rien n'est effacé en silence ». Mesuré : avec les classes chargées, les 6 événements 3e donnent 10 heures et le message ne paraît pas.
4. **Sans les classes, la reprise attend.** `edtCharger` peut tourner avant `edtChargerClasses` selon la porte ; sans `EDT_CLASSES`, aucun niveau n'est connu. La charge ne reprend rien **et ne retire rien**, et le dit. En usage réel les deux portes (`edtSectionPanneau`, `edtOuvrir`) chargent les classes d'abord — mesuré dans le code, et le banc fait comme elles.
5. **La reprise horodate au moment de la migration** (`pose`), pas au moment où Paul avait coché : cette date-là n'existait nulle part. Le journal porte `reprise:true` pour les distinguer.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel** : tout tourne sur un faux hub, le sas n'est pas publié.
- **Les captures par clics** de la migration : la migration se déclenche au chargement, sans geste ; les captures de la livraison ② porteront sur la coche et sur ce que devient une coche quand les choses bougent (§④).

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-②b**) · `tests/banc-migration-02b.mjs` · `tests/calendrier-herite-coche.json` · `rapport-2ter-02b.md` (ce rapport).

## ARRÊT
La migration est faite, ordonnée, idempotente, reprenable, et la réinjection ne perd plus rien. **Aucune dette ouverte dans le périmètre.** Reste la livraison **②** : ce que devient une coche quand les choses bougent (§④ — l'événement déplacé, la grille changée, l'événement supprimé), les captures par clics, l'audit adverse, le rapport final. Paul relance par « continuer ».
