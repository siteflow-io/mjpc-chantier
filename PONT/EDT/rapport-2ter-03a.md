# RAPPORT — LOT 2ter · livraison ③a · L'APPARIEMENT EST BRANCHÉ
Version **8.73.0-③a**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ③ | 1 673 446 | `92880802422d67c825e4dbd95313cac0` | 8.73.0-② |
| **Candidat ③a** | **1 678 220** | **`afb31fc8438ea16c21e7d7ef19b3e4af`** | **8.73.0-③a** |

md5 de la base vérifié avant d'écrire une ligne : conforme. md5 du candidat **relu au sas après le push** : identique, garde VERTE sur le fichier relu.

## Ce qui a été fait — `edtApparier` est branchée, pas réécrite
Elle n'a **pas** été modifiée : les quatre temps, la biunivocité et `sansAppariement` étaient justes. Six fonctions ajoutées pour la brancher, nommées comme le §⑤ l'exige — **`function edt*` 154 → 160**, aucune disparue :
- `edtListesFamilles(nom, o)` — les listes de chaque famille dans un objet ; l'entrant arrive en forme simple, l'existant peut être en forme datée : on compare alors **la version la plus récente**, celle que la réinjection remplace ;
- `edtReconduire(nom, entrant)` — apparie famille par famille contre `EDT[nom]`, **applique les forts en silence**, rend les faibles sans les appliquer, nomme les ambiguïtés ;
- `edtQuestionsFaibles(liste, apres)` — les pose **une par une**, rien ne s'écrit tant que Paul n'a pas répondu ;
- `edtPhraseFaible(q)`, `edtNomCritere(c)`, `edtEtiquette(el)` — la phrase de la question, qui **nomme ce qui change**.

Points de branchement : **`edtInjInjecter`, avant `edtPoserIdsObjet`** (donc avant toute écriture), et **`edtInjecterAvecLaGrille`** pour les créneaux horaires que la grille apporte.

## Preuves — §⑥, mesurées
Banc : `tests/banc-appariement-03a.mjs`, faux hub REST, écran ouvert, session prof par `admin-mode`. Commande : `node tests/banc-appariement-03a.mjs index.html`

**⑥.1 — l'appariement est atteignable** : `edtApparier` — déclaration L17887, **1 appel L17980, dans `edtReconduire`**. Base : 0 appel. `edtReconduire` est appelée depuis `edtInjInjecter` (avant la pose d'identifiants) et depuis `edtInjecterAvecLaGrille`.

**⑥.2 — l'entrant qui porte un `id` connu fait foi.** Calendrier réinjecté avec **tous les libellés remplacés** mais les `id` conservés → **122 forts, 0 faible, 0 arrivant, 0 disparaissant**, aucune question, **15/15** identifiants d'événements conservés. Rien d'autre n'est regardé.

**⑥.3 — fort silencieux.** Réinjection **sans aucun `id`**, contenu identique → **122 forts, 0 question posée**, identifiants inchangés : **15/15** événements, **11/11** fériés. Aucun `id` neuf.

**⑥.4 — faible proposé, jamais appliqué seul.** Un libellé retouché (« Séjour Verdun 3e » → « Séjour à Verdun 3e ») et une date déplacée → **120 forts, 2 faibles, 0 arrivant, 0 disparaissant** et **2 questions**. Texte de la première, mesuré :
> Séjour Verdun 3e (2026-10-14) semble être devenu « Séjour à Verdun 3e (2026-10-14) ».
> libellé : Séjour Verdun 3e → Séjour à Verdun 3e
> C'est bien le même ? — *Non, c'est autre chose* / *Oui, c'est le même*

**Écritures avant la réponse : `[]`.** Après « Oui » aux deux : **15/15** conservés. La comparaison se fait sur la valeur normalisée, mais la question affiche **le texte de Paul**, pas le normalisé (corrigé en cours de livraison, voir écarts).

**⑥.5 — biunivocité, la preuve qui protège les décisions.** Quatre événements de même libellé (« Sortie jumelle 3e ») et même date, `evc:JUM0` à `evc:JUM3`, dont **deux portent des coches** (2 heures sur `evc:JUM0`). Réinjection des quatre **sans `id`** :
- résultat de l'appariement : **0 fort sur les jumelles, 0 faible, 4 ambiguïtés nommées** (`{famille:'evenementsClasse', candidats:4, par:'fort'}` × 4), **4 disparaissants** ;
- avant toute écriture, le site prévient : « Ce calendrier ne contient plus 1 événement que tu avais coché : • Sortie jumelle 3e — 2 heures. Leurs heures restent marquées et comptent toujours » ;
- après « Injecter quand même » : les quatre entrants reçoivent des identifiants **neufs** (`evc:zl7fd8`, `#2`, `#3`, `#4`), les coches restent sur **`evc:JUM0`**, **0 permutation**, **2 heures** toujours comptées.

Quatre candidats identiques ne se départagent pas : le site ne devine pas, il nomme.

**⑥.6 — pas de faible sur les familles à critère unique.** Un férié renommé **et** déplacé (le seul critère est la date) → **1 arrivant + 1 disparaissant, 0 faible, aucune proposition**. Les périodes suivent la même règle (`critereUnique`), et leur reconduction par nom reste celle de ①bis-b.

**⑥.7 — créneaux horaires : début-fin, jamais le rang.** Un créneau inséré en deuxième position (le nombre change, tous les rangs décalent) → **8 forts, 1 arrivant, 0 faible**, l'inséré reçoit `hor:olqzy0`, tous les autres gardent le leur, **0 identifiant ayant changé d'horaire**. Aucune permutation.

**⑥.11 — non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtMettreANiveau` 2 appels** (inchangé) · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**Les cinq bancs rejoués sur ce candidat** : mise à niveau (hub vide 0 · complet 0 · échec 0 · abandon global 0) · périodes (3/3 partout) · grille datée (pose 6) · coche ②a (1 écriture au magasin, 0 → 2 puis 2 → 2 avec avertissement) · migration ②b (**10 décisions, 0 écriture au second chargement, réinjection 10 → 10**).

**⑥.12 — garde** : VERTE sur le candidat et sur le fichier relu. **Le contrat n'a pas eu besoin d'être élargi** en ③a : `edtReconduire` n'appelle que `edtApparier`, `edtListesFamilles`, `atModaleChoix` et `escapeHtml`, tous déjà au contrat. **ROUGE sur trois contrôles négatifs** — `mjpcSucces()` dans `edtReconduire` · `edtReconduire()` appelée hors du bloc · écriture d'injection vers `/site/ailleurs/`.

## Un trou trouvé et fermé pendant le travail
**La garde a refusé une première version** : ma variable locale s'appelait `suite`, et une fonction `suite(` existe hors du bloc. Même piège qu'en ②a avec `poser` — renommée `edtSuite`, garde verte. **Deux fois la même faute en deux livraisons** : pour la suite, tout nom de variable locale du bloc EDT devrait commencer par `edt`.

## Écarts signalés, jamais ajustés
1. **Le second recours par rang, pour les créneaux horaires, n'existe pas dans le code.** Le §①.4 dit « le rang **seulement** en second recours et **seulement** si le nombre est inchangé, jamais le rang seul ». `EDT_FAMILLES.creneauxHoraires` ne porte que `debut` et `fin` : le rang n'est utilisé **nulle part**. C'est plus conservateur que la règle — aucune permutation possible — et la preuve ⑥.7 le confirme. Je ne l'ajoute pas : ce serait modifier `edtApparier`, que le mandat déclare complète. **Je signale et j'attends** : si Paul veut le second recours, c'est une décision, pas une correction.
2. **Un créneau horaire dont l'horaire change entièrement devient un arrivant**, conséquence directe du point 1 : ni `debut` ni `fin` ne concordent, donc pas même un faible (2 critères, un faible en exigerait un concordant).
3. **Dans `edtInjecterAvecLaGrille`, les faibles ne sont pas proposés** : les créneaux horaires apportés par la grille reconduisent leurs identités par appariement **fort** seulement ; un faible y reste un arrivant. Jamais de conservation silencieuse — mais la question n'y est pas posée. L'écran de vérification de **③b** est le bon endroit pour les poser : je le signale plutôt que de multiplier les modales pendant une écriture déjà lancée.
4. **Le différentiel est calculé mais pas encore montré.** `edtReconduire` rend les quatre listes et elles sont mémorisées (`EDT.diffInjection`) ; leur affichage nominatif dans l'écran de vérification est **③b**, comme la découpe le prévoit.
5. **Pour la grille, l'existant comparé est la version datée la plus récente.** Un créneau qui n'existe que dans une version ancienne n'entre pas dans l'appariement. C'est cohérent avec « on ne modifie pas le passé, on le fige », mais c'est un choix : je le déclare.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tout tourne sur un faux hub ; le sas n'est pas publié en Pages.
- **Les preuves ⑥.2 à ⑥.7 passent par `EDT_INJ` + `edtInjInjecter`**, c'est-à-dire par le chemin réel du bouton « Injecter », mais **appelé par script** et non cliqué. Les captures par clics sont la livraison ③, comme la découpe le prévoit.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-③a**) · `tests/banc-appariement-03a.mjs` · `rapport-2ter-03a.md` (ce rapport).

## ARRÊT
L'appariement tourne avant toute écriture, les forts sont silencieux, les faibles sont posés en question et jamais appliqués seuls, les ambiguïtés sont nommées, les familles à critère unique n'ont pas de faible, et aucune permutation n'est possible. **Aucune dette ouverte dans le périmètre.** La suite est **③b** : le différentiel nominatif dans l'écran de vérification et la classe renommée. Paul relance par « continuer ».
