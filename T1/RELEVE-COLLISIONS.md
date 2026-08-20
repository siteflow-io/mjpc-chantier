# T1 — RELEVÉ DE COLLISIONS POST-INTÉGRATION (les deux sens)
*Refait sur la livraison 8.58.0 contre la 8.57.1, comme exigé — pas hérité de la liste du mandat.*

## AVANT (le danger mesuré, maquette brute vs 8.57.1)
| Nom | Côté maquette | Côté 8.57.1 |
|---|---|---|
| `lire` | fonction globale | 1 déclaration locale, 17 usages du nom |
| `fin` | fonction globale | 1 déclaration locale, 50 usages |
| `t` | var globale (chrono) | 47 déclarations locales, 361 usages |
| `cour`, `mk`, `titre` | **locales** (pas globales — la liste du mandat était prudente) | usages nombreux |
| `.on .sel .page .ok .feuille` | règles CSS | règles CSS aussi (2, 2, 2, 1, 1) |
| `.liste .titre .type` | règles CSS | usages `class=` sans règle (5, 23, 8) |
| ids, keyframes, vars CSS | — | 0 collision |

## APRÈS (la livraison)
**JS — bloc scellé sous IIFE `window.DR`.** Plus AUCUNE globale du déroulé n'existe dans le scope de la page : preuve runtime au banc, `Object.keys(window)` bloc seul = `+DR` exactement, y compris après manipulation (va, devoile, gel×2, chrono×2) et `fuiteFinale:[]` en fin de banc complet. Les collisions `lire/fin/t` sont donc structurellement impossibles (option A actée par Paul : le renommage littéral de `t` aurait été un geste type-C1).

**CSS — préfixage littéral + scope.** 175 classes → `.dr-*` ; 7 keyframes → `dr-*` ; 43 ids → `dr-*` ; 13 vars CSS conservées mais portées par `#dr-racine` (plus de `:root`) ; toutes les règles scopées `#dr-racine` (les sélecteurs d'éléments nus — body, \*, h1, button — ne sortent pas du bloc).

**Sens bloc → MJPC** : anciennes classes maquette en position `class=` dans le bloc : **0/175** · classes non-`dr-` portées par le HTML du bloc : **0** · règles CSS du bloc applicables hors `#dr-racine` : **0** (scope intégral) · globales JS échappées : **0** (preuve runtime).

**Sens MJPC → bloc** : usages `.dr-` hors bloc : **1**, volontaire (`#at-dr-hote-zone #dr-racine{border…}` — la bordure de la porte, dans le CSS des coutures) · les règles MJPC ciblent des classes `at-/ed2-/ch-` absentes du bloc ; les règles d'éléments MJPC sont dominées par les règles scopées du bloc (vérité visuelle : captures du Déroulé rendu conformes à la maquette).

**Les noms neufs côté MJPC** (hors bloc, style maison) : `DR` + 17 coutures (`ATVUES`, `atVuesRetenir`, `atVuesRappeler`, `atVuesBarreHtml`, `atVuesMonter`, `atVuesAller`, `atVuesPoser`, `atArbrePremiereSeance`, `atArbreHtml`, `atArbreDeplier`, `atDrTrame`, `atDrTrameEnregistrer`, `atDrJouer`, `atDrMonter`, `atDrJouerClic`, `atDrCompChange`, `atDrTaxoOptions`) : **18/18 absents de la 8.57.1** — collision nulle. Classes CSS neuves des coutures (`at-vues-*`, `at-arbre-*`, `at-dr-*`) : absentes de la 8.57.1 et du bloc.

## LES 4 FAMILLES (rien de MJPC ne devient orphelin)
Fonctions 8.57.1 absentes de T1 : aucune · vars top-level absentes : aucune · classes CSS absentes : aucune · ids absents : aucun.
