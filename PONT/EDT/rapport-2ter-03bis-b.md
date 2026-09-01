# RAPPORT — LOT 2ter · livraison ③bis-b · L'IDENTIFIANT DIT SA FAMILLE
Version **8.73.0-③bis-b**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Livraison ③bis-a | 1 687 952 | `cc353aceb20a572e9af1990dc3ab9b23` | 8.73.0-③bis-a |
| **Candidat ③bis-b** | **1 689 863** | **`d8f66035387aad74bfb25f3865c00924`** | **8.73.0-③bis-b** |

md5 **relu au sas après le push** : identique. Garde VERTE sur le fichier relu.

## Ce qui a été fait — une fonction, un refus, une phrase
**`function edt*` 168 → 169**, aucune disparue : **`edtIdMenteur(el, famille)`** — l'identifiant d'un objet doit commencer par le préfixe de sa famille (`evc:` `jal:` `eta:` `fer:` `vac:` `crn:` `hor:` `per:` `pho:`, dans `EDT_FAMILLES`).

Le refus a lieu **dans `edtReconduire`, avant tout appariement** : l'identifiant menteur est retiré de l'entrant, l'objet **garde tout son contenu** et repart dans l'appariement comme n'importe quel entrant sans identifiant. Ce qui était attaché à l'ancien identifiant est **compté** au passage, pour pouvoir le dire.

**La règle de ① n'a pas bougé** : un identifiant en service n'est jamais recalculé. On refuse le menteur, on ne touche pas les autres.

## Preuves — §⑤
Banc : `tests/banc-id-famille-03bis.mjs`, faux hub REST, panneau prof ouvert par clic, texte collé puis **« Vérifier »**. Commande : `node tests/banc-id-famille-03bis.mjs index.html`

**⑤.5 — deux identifiants menteurs, refusés et nommés.** Calendrier réinjecté portant tous les identifiants du hub **sauf deux** : `per:MENSONGE` sur un événement de classe, `crn:MENSONGE` sur un jalon.
- **Écritures à la vérification : `[]`** — Paul voit avant que rien ne soit écrit.
- Relevé : `[{famille:'evenementsClasse', id:'per:MENSONGE', coches:0}, {famille:'jalons', id:'crn:MENSONGE', coches:0}]`.
- Le différentiel les nomme, dans une liste à part :

> **Identifiants d'une autre famille, refusés (2)**
> Séjour Verdun 3e (2026-10-14) — identifiant « per:MENSONGE » d'une autre famille, refusé
> Conseils intermédiaires 3e (2026-11-03) — identifiant « crn:MENSONGE » d'une autre famille, refusé
> *2 objets portaient un identifiant d'une autre famille : ils sont traités comme neufs.*

Quand des décisions sont attachées à l'identifiant refusé, la ligne le dit aussi : « · N heures cochées ne le suivront pas ».

**⑤.6 — les identifiants corrects ne sont pas touchés.** Dans la même injection : **15/15** événements, **30/30** jalons, **11/11** fériés conservés ; **tous les préfixes corrects** après écriture (`evc:` pour les événements, `jal:` pour les jalons) ; appariement **122 forts, 0 arrivant, 0 faible**.

**Ce que le refus ne casse pas.** L'événement dont l'identifiant a été refusé (« Séjour Verdun 3e ») **retrouve `evc:dqzc47`**, son identifiant d'origine : son contenu n'ayant pas changé, l'appariement **fort** le lui rend. Ses **2 heures cochées comptent toujours** (`heuresEncoreComptees: 2`, `decisions: 2`). Le refus d'un identifiant menteur n'est donc pas une perte quand l'objet est reconnaissable — et quand il ne l'est pas, l'objet arrive comme neuf avec un identifiant correct, et le différentiel dit ce qui ne le suit pas.

**⑤.9 — non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**Les huit bancs rejoués** : classe d'essai (**éteint 30 créneaux / allumé 34 / rééteint identique, 7 classes sur 7 inchangées**) · mise à niveau (4 scénarios à 0 écriture) · périodes (5 fois 3/3) · grille datée (pose 6) · coche ②a · migration ②b (10 décisions, réinjection 10 → 10) · appariement ③a (15/15, **0 permutation**) · différentiel ③b · archivage ③ (3 fois « 1 archive puis 1 écriture »).

**Garde** : VERTE sur le candidat et sur le fichier relu. **ROUGE sur trois contrôles négatifs** — `mjpcSucces()` dans `edtIdMenteur` · `edtIdMenteur()` appelée hors du bloc · l'écriture centrale détournée vers `/site/ailleurs/`.

## Écarts signalés, jamais ajustés
1. **Le refus ne porte que sur les objets qui entrent par l'injection.** Un identifiant menteur déjà écrit au hub — posé à la main dans la base, hors du site — ne serait pas refusé au chargement : il le sera à la première réinjection de son objet. Étendre le contrôle au chargement voudrait dire réécrire un identifiant en service sans que Paul l'ait demandé, ce que la règle de ① interdit. **Je signale et j'attends.**
2. **Les familles sans préfixe ne sont pas contrôlées** : `edtIdMenteur` rend `false` si la famille n'a pas de préfixe déclaré. Aucune n'est dans ce cas aujourd'hui — les neuf en ont un — mais une famille ajoutée sans préfixe passerait sans contrôle. C'est le comportement prudent (on ne refuse pas ce qu'on ne sait pas juger), pas un oubli.
3. **Le compte des décisions attachées à un identifiant refusé n'est fait que pour les coches d'écart justifié** (`edtCochesDeLEvenement`). Une décision d'un autre motif, posée à la même heure, n'est pas comptée dans cette phrase — elle n'est pas perdue pour autant : elle vit sous la clé de l'heure, pas sous l'identifiant de l'objet.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- **Le cas d'un identifiant menteur qui est aussi un identifiant en service dans sa vraie famille** : il est au programme de l'audit adverse de la livraison **③bis**, comme la découpe le prévoit.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-③bis-b**) · `tests/banc-id-famille-03bis.mjs` · `rapport-2ter-03bis-b.md` (ce rapport).

## ARRÊT
Un identifiant qui ment sur sa famille est refusé avant toute écriture, l'objet arrive comme neuf avec un identifiant correct, et le fait est nommé à Paul avec ce qu'il emporte. **Aucune dette ouverte dans le périmètre.** Reste la livraison **③bis** : la garde qui reprend elle-même la surveillance du chemin, les captures, l'audit adverse, le rapport final. Paul relance par « continuer ».
