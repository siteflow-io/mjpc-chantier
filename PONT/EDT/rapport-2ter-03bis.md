# RAPPORT — LOT 2ter · livraison ③bis (finale) · LA GARDE REPREND LA SURVEILLANCE
Version **8.73.0-③bis**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ③bis | 1 686 881 | `efb57889867c5a968ba6da1949bfe851` | 8.73.0-③ |
| ③bis-a | 1 687 952 | `cc353aceb20a572e9af1990dc3ab9b23` | 8.73.0-③bis-a |
| ③bis-b | 1 689 863 | `d8f66035387aad74bfb25f3865c00924` | 8.73.0-③bis-b |
| **Candidat ③bis** | **1 690 354** | **`a04a8e5855172efd2f4fddb0a186237f`** | **8.73.0-③bis** |

md5 **relu au sas après le push** : identique. Garde VERTE sur le fichier relu.

## §③ — LA GARDE VÉRIFIE ELLE-MÊME OÙ L'ÉCRITURE CENTRALE ÉCRIT
Depuis la livraison ③, toutes les écritures qui remplacent un état passent par `edtEcrireArchive(motif, chemin, avant, valeur, …)`, et l'exception `"chemin+'.json'"` empêchait la garde de voir **où** elles écrivent — c'était la conscience qui relisait les appelants à chaque audit. **Un quatrième contrôle a été ajouté à `outils/verif_edt.py`** : pour chaque appel à `edtEcrireArchive` dans le bloc, il découpe les arguments au premier niveau de parenthèses et vérifie que le **deuxième** est un chemin fabriqué par le site — `edtChemin(…)`, `edtCheminTrace(…)`, ou la trace d'une heure jouée (`t.chemin+'/absents'`, déclarée). La déclaration de la fonction elle-même est ignorée, pas ses appels.

La garde annonce désormais quatre lignes :
> ① le bloc EDT n'appelle que le contrat · ② rien hors du bloc n'appelle edt* sauf les portes déclarées · ③ tous ses nœuds sont sous /site/edt/, hors les exceptions nommées · **④ l'écriture centrale n'écrit que là où le site l'envoie**

**⑤.7 — la garde refuse un chemin écrit à la main.** Contrôle négatif posé sur le candidat : `edtEcrireArchive(nom,'/site/classes/y',…)` →
> ROUGE — ④ edtEcrireArchive : chemin qui n'est pas fabriqué par le site : '/site/classes/y'
(et, du même coup, ③ chemin hub en dur hors de /site/edt/). Le contrôle a été retiré après mesure.

**⑤.8 — la garde reste verte** sur le candidat et sur le fichier relu, avec **les deux élargissements déclarés en commentaire** : `m8TestOn` (lecture seule, ③bis-a) et l'exception de l'écriture centrale (③), désormais **encadrée** par le contrôle ④.
**Quatre contrôles négatifs, un par question** : `mjpcSucces()` dans `edtEnEssai` → ① · `edtIdMenteur()` hors du bloc → ② · l'écriture centrale détournée vers `/site/ailleurs/` → ③ · le chemin écrit à la main → ④.

## §⑤.10 — LES CAPTURES PAR CLICS
`tests/captures-mode-test-03bis.mjs`, trois captures écran entier + journal (`tests/APRES-03bis-test-*`). Parcours : clic « 🛠 Panneau prof » → clic « 📅 Emploi du temps » → clic « Ouvrir l'emploi du temps » → **clic sur la pastille « mode test » du panneau** (`#tprof-testpill`, un vrai bouton du site) → clic à nouveau.

| | mode test | créneaux lus | cases peintes | classes |
|---|---|---|---|---|
| capture 1 | **éteint** | 30 | 20 | les 7 vraies |
| capture 2 | **allumé** | **34** | **24** | les 7 vraies **aux mêmes comptes** + 3E Charles de Gaulle 4 |
| capture 3 | **rééteint** | 30 | 20 | **identique à l'état de départ** |

**Écritures des deux bascules : `[]`.** Une seule ligne du parcours n'est pas un clic, déclarée : `admin-mode`.

## §⑤.11 — AUDIT ADVERSE
`tests/audit-adverse-03bis.mjs`. **Aucune erreur de page.**

| Cas cherché | Mesuré |
|---|---|
| mode test allumé pendant une injection | **0 écriture sortie** : en mode test, le garde-fou du site intercepte les écritures — le hub garde ses 4 créneaux d'essai. La grille en mémoire suit le JSON injecté. Rien ne casse, rien ne se mélange. |
| un trou d'essai devenu occupé par une vraie classe | les deux **cohabitent** : `['4E BANKSY', '3E Charles de Gaulle (essai)']` sur le même créneau, 35 cases lues. La vraie classe n'est ni masquée ni écrasée. |
| **deux créneaux d'essai sur le même trou** | **trou trouvé et fermé — voir ci-dessous** |
| bascule du mode test pendant qu'une modale est ouverte | aucune casse, **0 écriture**, 24 cases repeintes ; la modale se referme à la repeinte (comportement du site, pas une erreur) |
| un identifiant menteur qui est **aussi** un identifiant en service dans sa vraie famille | l'identifiant de période n'est **pas volé** : il est relevé comme menteur, l'événement reçoit `evc:dqzc47` par appariement fort, la période garde le sien |
| la grille en **forme datée** avec des créneaux d'essai | 1 version, **34 créneaux lus dont 4 d'essai**, identifiants intacts : les fictifs ne vivent pas dans les versions, ils restent lus |

### Le trou trouvé et fermé dans cette livraison
**Deux créneaux d'essai différents pouvaient porter le même identifiant.** Mesuré à l'audit : un fictif recopié gardait celui de son modèle — **5 créneaux, 4 identifiants distincts**, et `edtPoserIdsObjet` ne reposait rien (la règle de ① interdit de recalculer un identifiant en service). C'est exactement le défaut que ①ter avait fermé **dans une version**, jamais porté à `creneauxFictifs`. Corrigé par la même règle : le second perd le sien et en reçoit un neuf. Remesuré : **5 créneaux, 5 identifiants distincts**, le doublon reçoit `crn:ui01nk#2`.

## §④ — NON-RÉGRESSION, remesurée sur le candidat final
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**`function edt*` : 167 → 169**, aucune disparue. Deux ajoutées sur tout le lot ③bis, nommées : `edtEnEssai` (③bis-a), `edtIdMenteur` (③bis-b).
**Hors mode test, la grille de Paul est identique à celle d'avant ce lot** — la preuve la plus importante : 30 créneaux, 20 cases, 7 classes aux mêmes comptes, mesurés côte à côte sur 8.73.0-③ et sur le candidat.
**Les neuf bancs rejoués** : classe d'essai (30/34/30, 7 classes sur 7 inchangées, 34 identifiants distincts) · identifiants menteurs (2 refusés, 15/15 + 30/30 + 11/11 conservés) · mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · coche ②a · migration ②b (10 décisions, réinjection 10 → 10) · appariement ③a (15/15, 0 permutation) · archivage ③ (3 fois « 1 archive puis 1 écriture »).

## Écarts signalés, jamais ajustés
1. **En mode test, les écritures ne sortent pas** — c'est le garde-fou du site (correctif ③ du LOT 2ter ①), pas une décision de ce lot. Conséquence utile : Paul peut éprouver une injection en mode test **sans rien écrire au hub**. Conséquence à connaître : ce qu'il fait en mode test ne se retrouve pas au hub en quittant le mode test.
2. **La modale d'une case se referme quand on bascule le mode test** : la grille est repeinte. Ce n'est pas une casse, mais ce n'est pas un état conservé : je le dis.
3. **Un créneau d'essai et une vraie classe peuvent occuper le même créneau** si Paul remplit plus tard un des quatre trous. Les deux cohabitent — le site ne masque ni n'écrase rien. Choisir un autre trou est une décision de Paul, pas une correction.
4. Rappels de ③bis-a et ③bis-b : la note d'amorce du JSON a été remplacée par les quatre créneaux et une clé `noteFictifs` ; les identifiants des fictifs sont posés même hors mode test ; le contrôle de famille ne porte que sur ce qui entre par l'injection ; une famille sans préfixe déclaré ne serait pas contrôlée.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages, je n'ai pas d'adresse à donner pour un essai à la main.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-③bis**) · `json/grille-2026-2027.json` (quatre créneaux d'essai) · `outils/verif_edt.py` (deux élargissements déclarés + le contrôle ④) · `rapport-2ter-03bis-a.md`, `rapport-2ter-03bis-b.md`, `rapport-2ter-03bis.md` · `tests/banc-classe-essai-03bis.mjs`, `tests/banc-id-famille-03bis.mjs`, `tests/audit-adverse-03bis.mjs`, `tests/captures-mode-test-03bis.mjs` · les trois captures `APRES-03bis-test-*.png` et leur journal.

## ARRÊT
Paul peut éprouver son emploi du temps sur une classe qui n'existe que le temps du mode test, un identifiant qui ment sur sa famille est refusé et nommé, et **la garde surveille elle-même où l'écriture centrale écrit** — plus besoin qu'une conscience s'en souvienne. **Aucune dette ouverte dans le périmètre.** Paul promeut sur captures : elles sont au sas, avec leur journal.
