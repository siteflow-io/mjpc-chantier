# RAPPORT — LOT 2ter · livraison ⑥a · LES TROIS ISSUES, AU LIEU DU REFUS SEC
Version **8.73.0-⑥a**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ⑥ | 1 729 825 | `b0be8f4d62dbb7b53d3f6f0579ec702c` | 8.73.0-⑤ |
| **Candidat ⑥a** | **1 734 473** | **`bc02c791eb2506fb9d25dc8c46d06721`** | **8.73.0-⑥a** |

md5 de la base vérifié avant d'écrire une ligne. md5 du candidat **relu au sas après le push** : identique. Garde VERTE sur ses cinq questions.

## Ce qui a été fait
Quatre fonctions ajoutées, nommées — **`function edt*` 190 → 194**, aucune disparue :
`edtOccupantDe(c, dst)` · `edtTroisIssues(cleSource, dst)` · `edtEchangerHeures(cleSource, dst)` · `edtEcraserHeure(cleSource, dst)`.
Le refus « ce créneau est déjà pris » ne part plus quand la classe est **appariée** : `edtDepot` ouvre les trois sorties. Il **reste** pour une classe que le site ne connaît pas encore, avec ses mots : « une classe que le site ne connaît pas encore — apparie-la d'abord ».
**L'échange et l'écrasement s'écrivent en UNE seule écriture**, par `edtEcrireDecisionsGroupe` — donc archive de l'état d'avant, journal par heure, tout ce que les livraisons précédentes ont posé.

## Preuves — §⑦
Banc : `tests/banc-trois-issues-06a.mjs`. **Le dépôt se fait au glisser-déposer réel** (souris, `mouse.down/move/up`), sur une case occupée par une autre classe appariée. Pièce : `tests/grille-deux-classes.json` — la grille du sas, avec une seconde classe appariée (6 créneaux) pour que l'échange soit jouable. Commande : `node tests/banc-trois-issues-06a.mjs index.html`

**⑦.1 — trois sorties, et le prix dit avant.** Glissé : 3E Charles de Gaulle (lundi 08:57) → la case de 4E BANKSY (lundi 15:07). Texte mesuré :
> lundi 31 août à 15:07-16:02, c'est **4E BANKSY**.
> **Échanger** : 3E Charles de Gaulle et 4E BANKSY permutent leurs deux heures — personne ne perd rien.
> **Prendre le créneau** : 4E BANKSY perd son heure du lundi 31 août — elle devient une heure à replacer, et le site te la rappellera.

Boutons : **« Ne rien faire » · « Échanger les deux heures » · « Prendre le créneau »**. **Écritures avant la réponse : `[]`.**

**⑦.2 — refuser ne change rien.** Clic sur « Ne rien faire » : **md5 du hub avant `07b88714a9cb1da85de8ccd95278b6dc`, après `07b88714a9cb1da85de8ccd95278b6dc`** — identique, **0 écriture**.

**⑦.3 — échanger : personne ne perd d'heure.** **1 écriture.** Quatre décisions : les deux départs portent `deplaceeVers`, les deux arrivées `venantDe`. **Heures perdues comptées : 3E Charles de Gaulle 0, 4E BANKSY 0.** Les deux classes retrouvent leur heure ailleurs, aucun compte ne bouge.

**⑦.4 — prendre le créneau : l'heure évincée est à replacer.** **1 écriture.** La 3E part vers la case prise (`deplaceeVers`), et l'heure de 4E BANKSY porte **`motif: 'aReplacer'`, `aReplacer: true`, `prisePar: '3E Charles de Gaulle'`** — statut non justifié, basculable, comme déclaré en ⑤b. **Comptes : 3E 0, 4E BANKSY 1.** Le prix annoncé avant le geste est exactement celui qui est payé.

**§⑥ non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** (inchangé) · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · dix catégories et quatre motifs inchangés · **node --check** et **acorn ES2020** VERTS.
**`banc-tout.mjs` rejoué EN ENTIER — 24 bancs (le banc ⑥a ajouté), 72 repères, aucun échec** :
①bis-a 39 s · ①bis-b 24 s · ①ter 8 s · ②a 11 s · ②b 63 s · ② 52 s · ③a 50 s · ③b 58 s · ③ archivage 36 s · ③bis-a 13 s · ③bis-b 32 s · ④a 40 s · ④ 131 s · ⑤a 11 s · ⑤b 18 s · ⑤c 19 s · ⑤c-bis 11 s · ⑤c-ter 15 s · audits ② 45 s, ③ 62 s, ③bis 39 s · **⑥a 40 s** · ⑤ alerte 33 s · 122 identifiants 3 s.

**⑦.13 — garde** : VERTE sur cinq questions ; **ROUGE sur cinq contrôles négatifs, un par question** — `mjpcSucces()` dans `edtTroisIssues` → ① · `edtTroisIssues()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④ · **un caractère ajouté à `prompts/calendrier.md` → ⑤ « la consigne « calendrier » diffère : 8274 caractères contre 8273 — premier écart au caractère 8273 »**. Fichier remis, garde verte.

## Écarts signalés, jamais ajustés
1. **L'échange et l'écrasement passent par des décisions d'heure, pas par la grille.** C'est cohérent avec « horaire, jamais contenu » et avec le déplacement existant (`edtDeplacerVers`), et ça rend le geste **ponctuel** : l'emploi du temps durable n'est pas modifié. Si Paul veut qu'un échange soit durable, c'est un autre geste — je ne l'ai pas inventé.
2. **L'heure à replacer compte déjà comme perdue** (motif `aReplacer`, non justifié) tant qu'elle n'est pas reposée. C'est ce qui la rend visible dans les totaux ; **son rappel dans la vue de la classe et au bandeau est la livraison ⑥b**, ainsi que la perte sèche (`priseAutreClasse`).
3. **Les preuves ⑦.7 et ⑦.8 ne sont pas faites** : l'heure dont la trace existe, l'heure du jour non lancée, la trace vide supprimée — et le comptage des séances/activités/traces avant et après. Elles demandent un faux hub avec des traces jouées ; **je les déclare non mesurées à cette livraison**, elles restent dues.
4. **Le banc apparie une seconde classe dans sa pièce**, parce que la grille du sas n'en apparie qu'une : sans deux classes appariées, le geste de Paul n'existe pas. La pièce est au sas, nommée.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : faux hub ; le sas n'est pas publié en Pages.
- **Les 24 bancs d'affilée dans un seul processus** : mon environnement coupe au-delà d'environ 90 secondes ; joués en sept tranches, toutes par `banc-tout`, sur ce candidat.
- **⑦.7 et ⑦.8** (écart 3).

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑥a**) · `tests/banc-trois-issues-06a.mjs` · `tests/grille-deux-classes.json` · `tests/banc-tout.mjs` (24 bancs) · `rapport-2ter-06a.md` (ce rapport).

## ARRÊT
Le geste le plus courant de la vie de Paul est redevenu possible : au lieu d'un refus, trois sorties, et le prix dit avant. **Une dette déclarée : les preuves ⑦.7 et ⑦.8.** La suite est **⑥b** : l'heure à replacer, son rappel jusqu'à ce qu'elle soit posée, la perte sèche. Paul relance par « continuer ».
