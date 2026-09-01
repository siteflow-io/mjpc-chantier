# RAPPORT — LOT 2ter · livraison ③bis-a · LA CLASSE D'ESSAI, VISIBLE SEULEMENT EN MODE TEST
Version **8.73.0-③bis-a**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ③bis | 1 686 881 | `efb57889867c5a968ba6da1949bfe851` | 8.73.0-③ |
| **Candidat ③bis-a** | **1 687 952** | **`cc353aceb20a572e9af1990dc3ab9b23`** | **8.73.0-③bis-a** |

md5 de la base vérifié avant d'écrire une ligne : conforme. md5 du candidat **relu au sas après le push** : identique, garde VERTE sur le fichier relu.

## Ce qui a été fait
1. **Les quatre créneaux d'essai sont posés** dans `json/grille-2026-2027.json`, clé `creneauxFictifs` — à la forme d'un créneau normal, `classeMjpc:"3E Charles de Gaulle"`, `fictif:true`, `semaine:"AB"` : **lundi 08:00-08:55 · mardi 08:00-08:55 · jeudi 10:07-11:02 · vendredi 13:00-13:55**. Les quatre trous sont vérifiés **libres** dans la grille réelle (aucun créneau existant à ces jour+heure).
2. **Le site les lit dans `edtCasesA`, et seulement en mode test.** C'est le point de passage unique de toutes les lectures de la grille (`edtCasesDuJour`, `edtProjeter`, la peinture, les comptes) : une seule branche à ajouter, une seule à vérifier.
3. **Une fonction ajoutée, nommée** — **`function edt*` 167 → 168**, aucune disparue : `edtEnEssai()`, qui demande au site « suis-je en mode test ? » et rend `false` si la question n'a pas de réponse.
4. **Elles portent une identité comme les autres** : `edtPoserIdsObjet('grille', o)` traite désormais `creneauxFictifs` avec le même mécanisme, **même hors mode test** — une identité ne dépend pas de l'écran qui la regarde.
5. **Le contrat de la garde est élargi d'une entrée, en LECTURE seule** : `m8TestOn`, déclaré dans `outils/verif_edt.py` avec sa raison (« le bloc demande « suis-je en mode test ? » pour n'afficher la classe d'essai que là. Il n'écrit rien par ce biais. »).

## Preuves — §⑤
Banc : `tests/banc-classe-essai-03bis.mjs`, faux hub REST (aucune requête ne sort) avec **la grille réelle de Paul**, `json/grille-2026-2027.json`. Commande : `node tests/banc-classe-essai-03bis.mjs index.html`

**⑤.1 — mode test éteint : rien n'a changé.** Même semaine (16/11), même grille, sur les deux versions :

| | 8.73.0-③ (avant) | 8.73.0-③bis-a (après) |
|---|---|---|
| créneaux lus par `edtCasesA` | **30** | **30** |
| dont fictifs | 0 | **0** |
| cases peintes dans la semaine | **20** | **20** |
| comptes par classe | 3 FRANKLIN 5 · X Français 4 TURING 1 · 4 HUGO 5 · 4 TURING 4 · 3 DYLAN 3 · X Français 4 BANKSY 1 · X Français 4 PYTHAGORE 1 | **identiques, à l'unité près** |
| la classe d'essai | absente | **absente** |
| écritures | `[]` | `[]` |

**⑤.2 — mode test allumé** : `edtCasesA` rend **34** créneaux, dont **4 fictifs**, et les quatre heures apparaissent **aux trous exacts**, semaine AB, chacune avec son identifiant :
`lundi 08:00-08:55 AB crn:ui01nk` · `mardi 08:00-08:55 AB crn:1r9movk` · `jeudi 10:07-11:02 AB crn:ud6v1s` · `vendredi 13:00-13:55 AB crn:1ssimd0`.
Cases peintes : 20 → **24**.

**⑤.3 — on éteint : elles disparaissent, sans rien écrire.** Créneaux lus **30**, fictifs **0**, classe d'essai absente, **écritures : `[]`**, et l'état est **identique à celui du départ** (comparaison des comptes par classe : `true`). Aucun geste de nettoyage n'existe, aucun n'est nécessaire.

**⑤.4 — elles ne polluent aucun compte réel.** Entre mode test éteint et allumé : **7 classes sur 7 aux comptes identiques**. Le seul écart est la classe d'essai elle-même, 0 → 4 — c'est exactement ce qui est demandé. Et **aucune écriture** n'a lieu pendant les trois bascules.

**Identités** : 30 identifiants réels + 4 fictifs = **34, tous distincts**. Le préfixe est bien `crn:` (famille `creneauxGrille`), posé par le mécanisme existant.

**⑤.9 — non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**Les sept bancs rejoués** : mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · coche ②a (1 écriture au magasin) · migration ②b (10 décisions, réinjection 10 → 10) · appariement ③a (15/15 conservés, **0 permutation**) · différentiel ③b (rattachement mesuré) · archivage ③ (**3 fois « 1 archive puis 1 écriture »**).

**Garde** : VERTE sur le candidat et sur le fichier relu, avec l'élargissement déclaré. **ROUGE sur trois contrôles négatifs** — `mjpcSucces()` dans `edtEnEssai` → « ① appelle hors contrat » · `edtEnEssai()` appelée hors du bloc → « ② appelé hors du bloc sans être une porte » · l'écriture centrale détournée vers `/site/ailleurs/` → « ③ écriture hub hors de /site/edt/ ».

## Écarts signalés, jamais ajustés
1. **La note d'amorce de `creneauxFictifs` a été remplacée par les créneaux qu'elle demandait.** Elle listait les trous disponibles et disait « à poser par Paul » : son rôle est rempli. Son contenu utile est conservé dans une clé voisine `noteFictifs`, qui explique en une phrase à quoi servent ces quatre heures et qu'il n'y a rien à nettoyer. **Une clé a donc été ajoutée au JSON de la grille** : je le signale plutôt que de le glisser.
2. **Les fictifs reçoivent leur identifiant même hors mode test.** C'était le choix le plus sûr — une identité ne dépend pas de l'écran — mais cela veut dire que l'objet grille écrit au hub porte quatre identifiants de plus qu'avant. **Aucun identifiant réel n'est touché** (34 distincts, 30 réels inchangés), et aucun compte ne bouge.
3. **`edtToutesLesCases()` n'inclut pas les fictifs.** Elle sert à parcourir toutes les versions ; les fictifs ne vivent pas dans les versions. Conséquence mesurée : l'appariement des classes (`edtApparierNom`) ne les voit pas — ce qui est cohérent, la classe d'essai est déjà appariée par construction. Je le dis.
4. **En mode test, la classe d'essai compte comme une classe ordinaire** — c'est ce que le mandat demande pour que le flux soit éprouvable. Hors mode test elle n'existe pas : aucune de ses heures ne peut entrer dans un compte réel.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- **Les captures par clics du basculement** (mode test éteint puis allumé, la grille dans les deux états) : elles sont la livraison **③bis**, comme la découpe le prévoit.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-③bis-a**) · `json/grille-2026-2027.json` (quatre créneaux d'essai) · `outils/verif_edt.py` (`m8TestOn` déclaré en lecture) · `tests/banc-classe-essai-03bis.mjs` · `rapport-2ter-03bis-a.md` (ce rapport).

## ARRÊT
Paul peut éprouver son emploi du temps sur une classe qui n'existe que le temps du mode test, sans polluer un seul de ses comptes et sans rien avoir à nettoyer. **Aucune dette ouverte dans le périmètre.** La suite est **③bis-b** : l'identifiant qui dit sa famille, et le site qui le vérifie. Paul relance par « continuer ».
