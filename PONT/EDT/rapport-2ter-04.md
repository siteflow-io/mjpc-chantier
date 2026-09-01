# RAPPORT — LOT 2ter · livraison ④ (finale) · L'IA NE CASSE PLUS LES IDENTITÉS
Version **8.73.0-④**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ④ | 1 690 354 | `a04a8e5855172efd2f4fddb0a186237f` | 8.73.0-③bis |
| ④a | 1 708 032 | `9ac8e8a8b1ed55abe5d80258e2a4a943` | 8.73.0-④a |
| **Candidat ④** | **1 711 939** | **`8736d113d9f92827ba46d73b3fa4a6e1`** | **8.73.0-④** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses quatre questions.

## ④.8 — L'ÉPREUVE DE BOUT EN BOUT, donnée en premier
Le rôle de l'IA est tenu **à la main par le banc**, et c'est déclaré : il lit le prompt copié, en extrait l'existant après la charnière, applique les consignes, et rend son JSON. Puis Paul colle et vérifie, par le chemin réel. Dans les deux cas : un libellé retouché (« Séjour Verdun 3e » → « Séjour Verdun 3e (Meuse) »), une date déplacée (16/11 → 17/11), un vrai nouvel élément (« Sortie théâtre 3e »).

| | prompt copié | appariement | questions à Paul |
|---|---|---|---|
| **IA qui suit le prompt** (reçoit l'existant, reconduit les `id`) | 28 410 car. | **122 forts · 1 arrivant · 0 faible · 0 ambiguïté · 0 identifiant menteur** | **aucune** |
| **IA à l'aveugle** (ce qui se passait avant : pas d'existant, pas d'`id`) | 28 410 car. | 120 forts · 1 arrivant · **2 faibles** | **2** |

**Écritures à la vérification : `[]`** dans les deux cas. Le seul arrivant est le vrai nouvel élément — celui qui doit arriver. Le différentiel affiché est le même dans les deux cas pour ce qui a bougé ; ce qui change, c'est que dans le premier, **le site n'a rien à demander** : l'identité n'a jamais été perdue.

C'est là que se joue le lot : **avant, l'appariement rattrapait ce qu'il pouvait ; maintenant, il n'y a rien à rattraper.**

## §② — LES DEUX PROMPTS RÉÉCRITS
Une section identique a été ajoutée aux deux : **« LES IDENTIFIANTS — c'est ma mémoire, ne la casse pas »**, écrite dans les mots de Paul, sans jargon.

**④.6 — les sept consignes, avec leur ligne** (`prompts/calendrier.md` L57-63, `prompts/grille.md` L79-85) :
1. **Reconduis l'`id` de tout ce que tu reconnais** — même libellé retouché, même date déplacée.
2. **N'en invente aucun** — un vrai nouvel élément sort **sans `id`**, le site lui en donnera un.
3. **Ne reformule jamais un libellé** — « Je reconnais mes sorties à leur nom. Une reformulation, pour moi, c'est un objet perdu. »
4. **Ne renumérote rien** : ni rangs, ni ordre, ni périodes.
5. **Ne produis aucun champ `justifie`** — il n'existe plus.
6. **Les préfixes disent la famille** — les huit sont listés et expliqués, avec l'interdiction d'en mettre un sur un objet d'une autre famille (« mon site refuse ces `id` et l'objet repart à zéro »).
7. **Dis-moi ce que tu as fait** — ajouté, déplacé (avec l'ancien et le nouveau), supprimé, et ce dont tu n'étais pas sûr. « C'est ce que je lis avant d'injecter. »

Et la phrase qui manquait pour le cas courant : « Si rien ne t'est donné sous CE QUI EST EN SERVICE AUJOURD'HUI, c'est ma première injection : aucun élément n'a d'`id`, et tu n'en mets aucun. »

**④.7 — `justifie`** : 2 mentions dans `calendrier.md`, 1 dans `grille.md`, **toutes des interdits** (l'interdit de ②a, conservé, et la consigne 5). Aucune ne demande de le produire.

**L'écart signalé en ④a est refermé dans la même livraison** : les consignes vivent à deux endroits (les fichiers du sas et la copie embarquée dans le site), et j'ai vérifié qu'elles sont **identiques bit à bit** — `calendrier` md5 `8a32a91e0abf71a0eaa9495d7d1f294d`, `grille` md5 `c1226d8637108921f10cd944eace0c64`, comparaison faite sur le texte extrait du candidat lui-même.

## ④.11 — LES CAPTURES PAR CLICS
`tests/captures-prompt-04.mjs`, trois captures écran entier + journal (`tests/APRES-04-prompt-*`).
- **capture 1** — les boutons du panneau : `⤓ Sortir le JSON — calendrier · — grille · — creneaux` **et** `📋 Copier le prompt — calendrier · — grille`.
- **capture 2** — après le clic : **28 410 caractères copiés**, et le site dit « Prompt copié — 28410 caractères, consigne et JSON ensemble. Un seul collage suffit. »
- **capture 3** — presse-papier refusé, clic à nouveau : **0 caractère parti**, « La copie automatique a échoué — le texte est ouvert dessous, sélectionne-le et copie-le à la main. », et la zone s'ouvre avec les **28 410 caractères**.
Deux choses ne sont pas des clics et sont déclarées : `admin-mode`, et l'espion qui remplace le presse-papier du système pour mesurer ce qui partirait.

## ④.12 — AUDIT ADVERSE
`tests/banc-bout-en-bout-04.mjs`. **Aucune casse.**

| Cas cherché | Mesuré |
|---|---|
| hub vide (l'état réel) | **2 boutons**, et le bloc se termine par « aucun calendrier en service — c'est une première injection » |
| JSON énorme (2 419 éléments, 40 fois le calendrier) | **345 970 caractères copiés en 7 millisecondes**, aucune casse |
| le JSON contient déjà la consigne (prompt recollé dans le hub) | 31 360 car., 3 occurrences de la charnière, **JSON toujours relisible** |
| presse-papier refusé deux fois de suite | **0 caractère parti**, **une seule zone** ouverte, celle du dernier bouton (grille) — rien ne s'empile |
| un objet sans `id` mêlé à des objets qui en ont | **122 forts, 0 arrivant, 0 faible** : celui-là s'apparie par ses critères, les autres par leur `id` |
| une IA qui rend des identifiants **inventés** | **122 forts, 0 arrivant, 0 faible, 0 menteur** : l'`id` inconnu ne fait pas foi, on retombe sur les critères, rien n'est volé |
| le prompt copié deux fois de suite | **2 copies identiques**, 28 410 car. chacune, rien ne s'accumule |

## ③ — NON-RÉGRESSION, remesurée sur le candidat final
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**`function edt*` : 169 → 171**, aucune disparue ; les deux ajoutées sont `edtPromptComplet` et `edtCopierPrompt` (④a).
**La classe d'essai reste invisible hors mode test** : 30 créneaux, 7 classes sur 7 aux comptes identiques.
**Les neuf bancs rejoués** : classe d'essai · identifiants menteurs · mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · migration ②b (réinjection 10 → 10) · appariement ③a (15/15, 0 permutation) · archivage ③ (3 fois « 1 archive puis 1 écriture ») · prompt ④a (**JSON copié identique bit à bit au hub**).

**④.10 — garde** : VERTE sur ses quatre questions ; **ROUGE sur quatre contrôles négatifs, un par question** — `mjpcSucces()` dans `edtCopierPrompt` → ① · `edtPromptComplet()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④. **Aucun élargissement du contrat n'a été nécessaire** dans tout le lot ④.

## Écarts signalés, jamais ajustés
1. **Les consignes restent en deux endroits.** Le site ne peut pas lire un fichier du dépôt : la copie embarquée est le prix du collage unique. **Elles sont identiques aujourd'hui, md5 à l'appui** — mais la prochaine main qui touche `prompts/*.md` doit toucher `EDT_PROMPTS` dans le même geste. C'est le seul endroit du lot où une vérité vit à deux exemplaires, et je préfère le redire qu'une fois de trop.
2. **Le rôle de l'IA est tenu par le banc**, pas par une vraie IA : l'épreuve prouve que **le site tient sa part** (donner l'existant, reconduire, ne rien demander pour rien). Ce qu'une vraie IA fera des consignes ne se mesure pas ici.
3. **Il n'y a de bouton que pour les deux voies qui ont une consigne**, calendrier et grille ; les horaires arrivent avec la grille.
4. **Le site pèse 21,6 ko de plus** que la base ③bis : ce sont les deux consignes embarquées, réécrites.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- **Une vraie copie dans le presse-papier du système** : le banc mesure ce que le site envoie, pas ce que le navigateur en fait. Le chemin de repli, lui, est mesuré en entier.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-④**) · `prompts/calendrier.md` et `prompts/grille.md` réécrits · `rapport-2ter-04a.md`, `rapport-2ter-04.md` · `tests/banc-prompt-04a.mjs`, `tests/banc-bout-en-bout-04.mjs`, `tests/captures-prompt-04.mjs` · les trois captures `APRES-04-prompt-*.png` et leur journal.

## ARRÊT
Un bouton, un collage : l'IA reçoit l'existant et le respecte. Épreuve faite : **122 forts, 0 faible, aucune question** là où l'aveugle en posait deux. **Aucune dette ouverte dans le périmètre.** Paul promeut sur captures : elles sont au sas, avec leur journal.
