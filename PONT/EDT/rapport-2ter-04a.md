# RAPPORT — LOT 2ter · livraison ④a · UN SEUL BOUTON, UN SEUL COLLAGE
Version **8.73.0-④a**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ④ | 1 690 354 | `a04a8e5855172efd2f4fddb0a186237f` | 8.73.0-③bis |
| **Candidat ④a** | **1 708 032** | **`9ac8e8a8b1ed55abe5d80258e2a4a943`** | **8.73.0-④a** |

md5 de la base vérifié avant d'écrire une ligne : conforme. md5 du candidat **relu au sas après le push** : identique, garde VERTE sur ses quatre questions.

## Ce qui a été fait — le patron du site, repris tel quel
- **`EDT_PROMPTS`** : les deux consignes (`prompts/calendrier.md`, `prompts/grille.md`, 6 573 et 7 494 octets) sont **embarquées dans le site**, comme l'atelier le fait déjà avec `ATELIER_PROMPT_SEED`. C'est ce qui pèse les +17,7 ko du candidat.
- **`edtPromptComplet(voie)`** — la consigne, puis une charnière nommée, puis **le JSON du hub tel quel**.
- **`edtCopierPrompt(voie)`** — un bouton par voie, à côté de « Sortir le JSON ». Copie par `navigator.clipboard.writeText`, repli par `textarea` + `execCommand` (le chemin qu'utilise déjà `edtSortirJson`), et **si les deux refusent, le texte s'ouvre dans le panneau, à sélectionner**.
**`function edt*` 169 → 171**, aucune disparue, les deux nommées ci-dessus.
**Le contrat de la garde n'a pas eu besoin d'être élargi** : `navigator.clipboard`, `document.createElement` et `execCommand` ne sont pas des fonctions du site — la garde ne surveille que celles-là. Aucun iota ajouté.

## Preuves — §④
Banc : `tests/banc-prompt-04a.mjs`. Le presse-papier est remplacé par un **espion** qui mesure ce qui partirait, et qu'on peut faire refuser. Panneau prof ouvert par clic, bouton **cliqué**. Commande : `node tests/banc-prompt-04a.mjs index.html`

**④.2 — hub vide, l'état réel.** Le bouton existe, la copie part, et le bloc se termine par :
> **aucun calendrier en service — c'est une première injection**

6 643 caractères copiés : la consigne entière, et cette phrase à la place du JSON. **Jamais un vide muet.**

**④.1 et ④.3 — hub garni, un seul collage.** **26 544 caractères** copiés d'un seul geste. Premières lignes :
> \# PROMPT IA — « CALENDRIER DE L'ANNÉE » (à coller dans une IA avec le fichier du calendrier en pièce jointe)

La charnière, entre la consigne et l'existant :
> ─── CE QUI EST EN SERVICE AUJOURD'HUI ───
> Voici l'objet « calendrier » tel qu'il est enregistré. Reconduis les identifiants de tout ce que tu reconnais ; n'en invente aucun.

Et le JSON inséré : **19 959 caractères, md5 `02032ce9bc0a2a5ffe17953c2643ebd7`** — le hub : **19 959 caractères, md5 `02032ce9bc0a2a5ffe17953c2643ebd7`**. **Identique bit à bit.** Ni retouché, ni réordonné, ni allégé.

**④.4 — « Sortir le JSON » n'a pas changé.** Cliqué sur le même objet : **19 959 caractères**, commence par `{ "annee": "2026-2027", "source": "cal…`, **ne contient pas la consigne**. Deux boutons, deux usages, aucun n'a bougé.

**④.5 — la copie qui échoue.** Presse-papier refusé : **0 caractère parti**, le site le dit —
> La copie automatique a échoué — le texte est ouvert dessous, sélectionne-le et copie-le à la main.

— et la zone s'ouvre dans le panneau avec les **16 486 caractères** du prompt de la grille, sélectionnables d'un clic. Jamais un bouton qui ne fait rien.

**④.9 — non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**La classe d'essai reste invisible hors mode test** : 30 créneaux éteint, 34 allumé, **7 classes sur 7 aux comptes identiques**.
**Les huit bancs rejoués** : classe d'essai · identifiants menteurs · mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · migration ②b (réinjection 10 → 10) · appariement ③a (15/15, 0 permutation) · archivage ③ (3 fois « 1 archive puis 1 écriture »).

**④.10 — garde** : VERTE sur ses quatre questions, sur le candidat et sur le fichier relu. **ROUGE sur quatre contrôles négatifs, un par question** — `mjpcSucces()` dans `edtCopierPrompt` → ① · `edtPromptComplet()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main dans `edtEcrireArchive` → ④.

## Écarts signalés, jamais ajustés
1. **Les consignes sont désormais en deux endroits** : les fichiers `prompts/*.md` du sas **et** la copie embarquée dans `index.html`. Elles doivent rester identiques — c'est le prix du collage unique, puisque le site ne peut pas lire un fichier du dépôt. **En ④, quand je réécrirai les prompts, je mettrai les deux à jour dans la même livraison**, et je le vérifierai par comparaison. Je le signale parce que c'est exactement le genre de chose qu'on oublie dans trois mois.
2. **Le prompt embarqué est celui d'aujourd'hui, pas encore réécrit** : il ne parle pas d'identifiants. La charnière ajoutée par le site le dit déjà (« Reconduis les identifiants de tout ce que tu reconnais ; n'en invente aucun »), mais les sept consignes du §② sont la livraison **④**.
3. **Il n'y a de bouton que pour les deux voies qui ont une consigne** — calendrier et grille. La voie « créneaux » n'a pas de prompt propre : ses horaires arrivent avec la grille. Aucun bouton mort n'est affiché.
4. **Le poids du site augmente de 17,7 ko** (les deux consignes embarquées). C'est le patron de l'atelier, mais c'est un poids : je le dis.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- **Une vraie copie dans le presse-papier du système** : le banc mesure ce que le site **envoie** au presse-papier (espion), pas ce que le navigateur en fait. Le chemin de repli, lui, est mesuré en entier.
- **Les captures par clics** : livraison ④, comme la découpe le prévoit.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-④a**) · `tests/banc-prompt-04a.mjs` · `rapport-2ter-04a.md` (ce rapport).

## ARRÊT
Un bouton, un collage : la consigne et le JSON en service partent ensemble, le hub vide se dit en toutes lettres, « Sortir le JSON » n'a pas bougé, et une copie refusée ouvre le texte au lieu de ne rien faire. **Aucune dette ouverte dans le périmètre.** Reste la livraison **④** : les deux prompts réécrits, l'épreuve de bout en bout, les captures, l'audit adverse. Paul relance par « continuer ».
