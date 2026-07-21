# M8-BADGE — badge de version, retrait du bandeau dev · note de livraison
**[exécutant M8-BADGE] · 21/07/2026 · base : production v8.4.2 · livré : `index.staging.html` v8.4.3**

## 1 · Base revérifiée
Production `index.html` re-téléchargée par l'API authentifiée : **363 510 o, md5 `b1deabcc72ca47efee6eec25eaab7586`** — exactement les valeurs annoncées. Aucune ligne écrite avant cette vérification.

## 2 · Les mesures, établies par moi dans le fichier
- **Bandeau dev** : trois vies — CSS `#dev-banner` + `#dev-banner a` (L58-59) · bloc HTML L703 (« ⚠ MODE DÉVELOPPEMENT — Cette page centrale est à supprimer lors du déploiement » + 4 liens `?n=`) · le fragment `document.getElementById('dev-banner').style.display='block';` dans le `DOMContentLoaded` (L2955), branche `if(!currentLevel)`.
- **« PROTOTYPE »** : **UNE seule occurrence** dans tout le fichier — le texte HTML du badge `#proto-badge` (L930, « Prototype », rendu en capitales par `text-transform:uppercase`). Les autres textes du badge (« ⚡ ADMIN » L2992/L3216, « 👁 TEST » L3387) ne contiennent pas « PROTOTYPE » : ce sont les témoins doctrinaux d'identité prof et de mode test — **hors périmètre, intacts octet pour octet**. Aucun chemin de code ne remettait « Prototype » après ces états (grep : zéro write d'un texte au repos).
- **Cinq tapes** : `handleBadgeTap` (L3266) → `basculerVue()`. Le geste vit sur TROIS cibles : `#proto-badge` (L930) et les deux logos (`val-logo` L705, `logo` L728) — les logos sont hors périmètre, non touchés.
- **Pastille** : `APP_VERSION` (L1907) déclarée mais **affichée nulle part** en 8.4.2 — le badge devient sa première pastille d'accueil.

## 3 · Le diff — 7 changements, chacun classé
| # | Lignes (base) | Nature | Classement |
|---|---|---|---|
| 1 | 58-59 | −2 règles CSS `#dev-banner` | retrait ① du périmètre |
| 2 | 179 | +1 règle `.proto-badge::after` (inset −12 px, contenu vide) | zone tactile ≥ 44 px sans changement visuel |
| 3 | 703 | −1 bloc HTML `#dev-banner` | retrait ① |
| 4 | 930 | texte « Prototype » → vide (rempli par JS) | badge ② — plus aucun texte en dur |
| 5 | 1907 | `8.4.2` → `8.4.3` | pastille ③ (toute promotion incrémente) |
| 6 | 2955 | −`…dev-banner….display='block';` | retrait ① — l'écran « lien invalide » lui-même NON touché |
| 7 | 2955 | +`_pb.textContent='v'+APP_VERSION` en tête du `DOMContentLoaded` | badge ② — la constante est LUE ; placé AVANT `restoreSession()`, les états ⚡ ADMIN / 👁 TEST écrasent ensuite, comme avant |

`APP_VERSION_DATE` reste `"2026-07-21"` (déjà la date du jour — aucune ligne modifiée sans nécessité).

## 4 · Preuves mécaniques
- **Complétude** : `dev-banner` 0 occurrence · « MODE DÉVELOPPEMENT » 0 · « Prototype » (hors `Object.prototype`/`Array.prototype`) **0**.
- **Double parseur** : JS extrait (262 513 o, 1 bloc) — `node --check` **OK** · `acorn ecmaVersion 2020` **OK**.

## 5 · Harnais — LECTURE SEULE STRICTE (Chromium, routes verrouillées : GET seuls, tout PUT/POST/PATCH/DELETE avorté)
**A · Adresse NUE, 390×844 tactile** : « MODE DÉVELOPPEMENT » **absent** · « PROTOTYPE » **absent** · badge affiche **« v8.4.3 »** · `#dev-banner` **absent du DOM** · écran « lien invalide » **intact** : badge « Lien invalide », « Utilise le lien fourni par M. Meney. », champs nom/prénom/bouton en `display:none` — identique au comportement 8.4.2, bandeau en moins. Capture `cap_A_nue_390.png`.
**B · `?n=4e`, 390 px** : badge de niveau `val-badge` = **« 4ème »** (inchangé), portail normal (champ nom affiché), badge « v8.4.3 ». Capture `cap_B_n4e_390.png`.
**C · CINQ TAPES, prouvées dans les DEUX SENS** : porte prof (`?n=4e`, code 1312, nom/prénom vides) → badge « ⚡ ADMIN », vue envers active. Cinq tapes → `admin-mode` **True → False** ; cinq tapes encore → **False → True**. Le geste bascule la vue, donc **ouvre l'admin** depuis l'endroit. Capture `cap_C_admin_390.png`, `cap_E_prof_nav_390.png`.
**D · Adresse nue, 1280×800** : mêmes verts qu'en A, badge « v8.4.3 » (61×25 px). Capture `cap_D_nue_1280.png`.
**E · Zone tactile** : rect du badge **61×25 px** ; extension `::after` −12 px → **85×49 px ≥ 44 px**, prouvée par hit-test `elementFromPoint` aux quatre côtés (+10 px hors du rect visuel → le badge répond, 4/4). En état ADMIN (texte plus long) : 88×25 → 112×49.
**F · Non-interception de la `bottom-nav`** — couverture déclarée : la nav (enfant de `page-level`, L816) **n'a été peinte sur aucun écran atteint par le harnais** (hauteur rendue 0 même après entrée dans le niveau 4e) ; la preuve de non-chevauchement est donc **par les valeurs CSS fixes du fichier**, indépendantes du viewport : nav `bottom:0; height:54px` → sommet à 54 px du bas ; zone étendue du badge : `bottom:68px` − 12 = **56 px du bas → 2 px de marge**. Mon premier contrôle desktop avait affiché « CHEVAUCHE » : **faux positif de mon propre filtre** (rect nul d'une nav non peinte), détecté et recalibré avant toute conclusion — consigné ici par transparence.

## 6 · Écritures hub : ZÉRO
Toutes les écritures émises par l'app au fil des parcours ont été **avortées par le harnais** et sont listées : `PUT /manifestes/index.json` (passage admin, ×3 runs) · `PUT /presence/prof.json` (heartbeat, ×3) · `POST script.google.com/macros/…` (tracking Apps Script, ×2 — la dette D-APPSCRIPT-RESIDUEL, constatée au passage, déjà au registre). Aucune requête d'écriture n'a atteint le réseau.

## 7 · Textes élève
**Aucun texte élève nouveau décidé par moi.** Le seul texte qui change côté élève est le contenu du badge : « PROTOTYPE » → « v8.4.3 » — c'est la lettre de la décision de Paul (« la valeur d'`APP_VERSION`, précédée de “v” ») et la règle de la pastille. Il n'est pas en dur : il suit `APP_VERSION` automatiquement. L'écran « lien invalide » n'a pas gagné ni perdu un mot.

## 8 · Empreintes de livraison
`index.staging.html` : **363 244 o, md5 `fc32d7088005022b5ee2e0cf51c4657b`**, pastille **8.4.3**. Vérification bit à bit local↔sas au push (ci-dessous, complétée dans le commit).

## 9 · Constats hors périmètre, pour la conscience
- Les **deux logos** portent aussi `handleBadgeTap` (L705, L728) — cibles alternatives des cinq tapes, non touchées, non mesurées tactilement (hors périmètre M8-BADGE).
- Le badge en état « ⚡ ADMIN » ne revient jamais à l'état repos dans la même session (aucun chemin de code ne le restaure) — comportement préexistant, inchangé par ce morceau ; la version n'est donc visible qu'avant identification prof (et pour tout élève). À router si la conscience juge que la pastille doit rester lisible en session prof.
- La `bottom-nav` de `page-level` ne s'est pas peinte au harnais même après entrée dans le niveau — soit un état de données (chapitres non chargés dans ce contexte), soit un artefact d'environnement **non prouvé** : ouvert en observation, pas écarté.

[exécutant M8-BADGE]
