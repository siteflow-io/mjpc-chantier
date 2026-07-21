# M8-IDENTITÉ 8.4.1 — NOTE DE LIVRAISON (exécutant, 21/07/2026)
*Un seul geste : le bouton d'affichage du code, demande de Paul. Livré au sas avec `index.staging.html`. Je ne promeus jamais.*

## Le choix : le MOT, pas l'icône — et pourquoi
« Afficher » / « Masquer », en italique discret à droite du champ. Trois raisons : ① le public est un collégien qui n'a pas d'habitude établie — un mot français est sans AUCUNE ambiguïté là où l'œil demande de connaître la convention ; ② l'exigence ⑤ (l'état doit être visible) est servie PAR CONSTRUCTION : le libellé qui change DIT l'état, sans second canal ; ③ c'est la ligne du chantier — lisibilité avant densité, et le site n'a aucune icône-bouton textuelle à imiter. Coût accepté : ~71 px de largeur dans le champ (padding-right posé, la saisie de 5 chiffres ne l'atteint jamais).
**Textes élève SOUMIS** : « Afficher » · « Masquer » (libellés du bouton) ; aria-labels « Afficher le code » / « Masquer le code ».

## Le geste
- HTML : `.val-code-wrap` (relatif) autour du champ ; bouton `type="button"` (ne soumet pas), `aria-label` porté, `onclick="basculerAffichageCode()"`.
- CSS (section M8-IDENTITÉ) : bouton absolu à droite, `min-height/min-width: 44px`, transparent/italique — le submit « Entrer » reste le geste dominant (plein cadre, dessous).
- JS : `basculerAffichageCode()` — toggle `type`, libellé et aria ensemble.
- L'écran « lien invalide » masque le wrapper entier (pas de bouton orphelin).
- Pastille : **8.4.1**.

## Les preuves (harnais, deux tailles)
| Preuve | Mobile 390 | Desktop 1280 |
|---|---|---|
| **`type` AU CHARGEMENT** (autocomplétion intacte) | **`password`** | **`password`** |
| — et dans le SOURCE HTML | `id="val-code" type="password"` (grep) | idem |
| Bouton (cible tactile) | **71×44** — ≥ 44 | 71×44 |
| Champ / Entrer | 244×49 / 244×46 | 338×49 / 338×46 |
| Chevauchement toggle ↔ Entrer | **aucun** | aucun |
| Clic 1 | `type=text`, « Masquer », aria « Masquer le code », **valeur 1234 lisible**, formulaire NON soumis | idem |
| Clic 2 | `type=password`, « Afficher » | idem |
| Écran « lien invalide » | wrapper caché | — |

Double parseur : `node --check` OK · acorn 2020 OK. Diff 8.4.0→8.4.1 : 4 coutures + pastille, rien d'autre touché. Écritures hub : zéro (harnais tout-avorté hors file://).
**Empreintes** : `index.staging.html` **363353 o, md5 `02d84dcbf46bdc352cfe31a239e1fae1`**, base 8.4.0 `bf86ffc9…`.
