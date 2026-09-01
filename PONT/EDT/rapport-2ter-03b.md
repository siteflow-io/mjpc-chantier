# RAPPORT — LOT 2ter · livraison ③b · PAUL VOIT AVANT D'APPUYER
Version **8.73.0-③b**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ③a | 1 678 220 | `afb31fc8438ea16c21e7d7ef19b3e4af` | 8.73.0-③a |
| **Candidat ③b** | **1 685 752** | **`0ba3822ff6719e0e4b30599e3dc1d19e`** | **8.73.0-③b** |

md5 **relu au sas après le push** : identique. Garde VERTE sur le fichier relu.

## §② — LE DIFFÉRENTIEL NOMINATIF, DANS L'ÉCRAN, AVANT LE GESTE
L'appariement tourne désormais **à la vérification** (`edtInjVerifier`), pas seulement au moment d'injecter : Paul appuie sur « Vérifier », il lit ce que ça va changer, et **rien n'est écrit** — mesuré : `écritures à la vérification : []`, bouton « Injecter » présent.

Différentiel affiché, mesuré au banc sur un calendrier réinjecté **sans identifiants**, avec un libellé retouché, une date déplacée, un événement supprimé (qui portait une coche) et un événement neuf :

> **Ce que cette injection va changer**
> **Ce qui arrive (1)** — Sortie théâtre 3e (2027-05-12)
> **Ce qui a seulement bougé (2)** — Séjour Verdun 3e (2026-10-14) — libellé : Séjour Verdun 3e → Séjour à Verdun 3e · Stages 3e (uniquement 3e Horizon pro) (2026-11-16) — debut : 2026-11-16 → 2026-11-17
> **Ce qui disparaît EN EMPORTANT DES COCHES (1)** — Visite des lycées St-Louis / les Ardilliers 3e (2026-11-23) — 1 heure cochée
> **Ce qui garde ses décisions (1)** — Séjour Verdun 3e (2026-10-14) — 2 heures conservées
> **À te demander avant d'écrire (2)** — Séjour Verdun 3e (2026-10-14) → Séjour à Verdun 3e (2026-10-14) · Stages 3e (uniquement 3e Horizon pro) (2026-11-16) → Stages 3e (uniquement 3e Horizon pro) (2026-11-17)

Des **noms**, jamais des compteurs seuls. Ce qui disparaît en emportant des coches est **nommé à part**, avec son nombre d'heures. Les ambiguïtés, quand il y en a, ont leur propre liste (« Impossible de trancher — 4 candidats identiques : traité comme un objet neuf »). Quand rien ne change, le bloc le dit en une ligne.

Les questions d'appariement faible restent posées **au moment du geste**, une par une, comme en ③a : le différentiel les annonce, l'injection les pose, et **rien ne s'écrit avant la réponse**.

## §④ — LA CLASSE RENOMMÉE
L'écart signalé par la livraison ② est fermé, **par une proposition, jamais par un automatisme**.

Mesuré : 2 heures décidées sous « 3E Charles de Gaulle », puis la classe est renommée « 3E CHARLES DE GAULLE » dans `/classes` **et** dans la grille.
- **Détection** : `[{ancien:'3E Charles de Gaulle', heures:2, candidates:['3E CHARLES DE GAULLE']}]` · comptes : ancien **2**, nouveau **0**.
- **Encart dans le panneau** : « ⚠ Des décisions sous un nom de classe qui n'existe plus — 3E Charles de Gaulle — 2 heures décidées. Elles comptent toujours, là où elles sont. » avec un bouton **« Rattacher à 3E CHARLES DE GAULLE »** par candidate. Aucune candidate → « Aucune classe libre à proposer : je ne devine pas. »
- **Proposition** : « Rattacher à « 3E CHARLES DE GAULLE » les 2 heures décidées sous « 3E Charles de Gaulle » ? Les motifs et le journal suivent. Rien n'est effacé : si tu refuses, elles restent où elles sont. » — *Laisser comme ça* / *Rattacher*.
- **Refus** : **0 écriture**, 2 heures toujours sous l'ancien nom, et le site le dit : « Rien n'a bougé : les 2 heures restent sous « 3E Charles de Gaulle ». »
- **Acceptation** : **1 écriture**, ancien **0**, nouveau **2**, comptes ancien **0** / nouveau **2**, journal : deux lignes « rattachée depuis « 3E Charles de Gaulle » ». **Aucune décision perdue.** Une décision déjà présente sous le nouveau nom n'est **jamais écrasée** : elle reste où elle est et le site le dit.

## Ce qui a été ajouté — cinq fonctions, nommées
**`function edt*` 160 → 165**, aucune disparue :
`edtChangementsDe(existant, entrant, famille)` (ce qui change, en clair, réutilisé par la question et par le différentiel) · `edtDifferentielHtml(diff)` · `edtDecisionsOrphelines()` · `edtRattacherDecisions(ancien, nouveau)` · `edtRattacherGeste(ancien, nouveau)`.

## Preuves — §⑥
Banc : `tests/banc-differentiel-03b.mjs`, faux hub REST, **panneau prof ouvert par clic** (`#tprof-btn` puis la section Emploi du temps), voile retiré. Commande : `node tests/banc-differentiel-03b.mjs index.html`

- **⑥.8** — les quatre listes ci-dessus, plus les questions annoncées ; **0 écriture à la vérification**.
- **⑥.10** — proposition, refus, acceptation : chiffres ci-dessus.
- **⑥.11 non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15·30·59·11·7, 0 collision**.
  **Les six bancs rejoués** : mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · coche ②a (1 écriture au magasin) · migration ②b (10 décisions, réinjection 10 → 10) · appariement ③a (122 forts par id · 122 forts sans id · 2 faibles · 4 ambiguïtés · férié arrivant+disparaissant · **0 permutation**).
- **⑥.12 garde** : VERTE. **Le contrat n'a toujours pas eu besoin d'être élargi.** ROUGE sur trois contrôles négatifs — `mjpcSucces()` dans `edtDifferentielHtml` · `edtRattacherGeste()` hors du bloc · écriture des décisions vers `/site/ailleurs/`.

## Écarts signalés, jamais ajustés
1. **Le rattachement ne se propose que si la classe a disparu de `/classes`.** Si Paul crée le nouveau nom **sans** supprimer l'ancien, les deux existent et rien n'est proposé — les décisions restent sous l'ancien, qui reste une classe valide. C'est le comportement sûr, mais ce n'est pas un renommage détecté : je le dis.
2. **Les candidates proposées sont les classes appariées dans la grille du jour et sans aucune décision.** Une classe qui a déjà des décisions n'est jamais proposée comme cible : on ne mélange pas deux histoires. S'il y a plusieurs candidates, elles sont **toutes** proposées et Paul choisit — le site ne tranche pas.
3. **Un refus n'est pas mémorisé** : l'encart réapparaît au chargement suivant. Il informe, il ne force rien. Le rendre « masquable » serait une décision de Paul, pas une correction.
4. **Les clés qui ne se relisent pas ne sont pas déplacées** : `edtRattacherDecisions` reconstruit la clé à partir de la date et du créneau qu'elle contient ; une clé d'une autre forme resterait sous l'ancien nom, et le site le dit dans son message. Mesuré : 0 dans ce cas.
5. Rappels de ③a, toujours vrais : pas de second recours par rang pour les créneaux horaires ; les faibles ne sont pas proposés dans `edtInjecterAvecLaGrille`.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tout tourne sur un faux hub ; le sas n'est pas publié en Pages.
- Le parcours du banc ouvre le panneau prof **par clic**, mais le collage du texte et l'appel à « Vérifier » passent par le script. **Les captures par clics de bout en bout sont la livraison ③**, comme la découpe le prévoit.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-③b**) · `tests/banc-differentiel-03b.mjs` · `rapport-2ter-03b.md` (ce rapport).

## ARRÊT
Paul voit ce qui arrive, ce qui a bougé, ce qui disparaît — et ce que ça emporte de ses décisions — **avant** d'appuyer ; la classe renommée se propose et ne se fait jamais toute seule. **Aucune dette ouverte dans le périmètre.** Reste la livraison **③** : l'archivage généralisé aux 14 écritures, les captures par clics, l'audit adverse, le rapport final. Paul relance par « continuer ».
