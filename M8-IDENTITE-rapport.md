# M8-IDENTITÉ — RAPPORT DE LIVRAISON (exécutant continué M8-MOBILE-2 → M8-IDENTITÉ, 21/07/2026)
*Le site applique sa propre doctrine. Livré au sas EN UNE FOIS avec `index.staging.html`. Je ne promeus jamais.*

## 0. Contrôle de traces (exécutant continué)
`ls -lat` avant codage : tous les fichiers du conteneur datés de mes sessions (20/07 13:48-13:54 · 21/07 10:13-10:54 · cette phase), tous reconnus. Sas conforme à mes actes (cadrage seul). Aucune trace étrangère.

## 1. Empreintes
- **Base** : production `index.html`, 358 720 o, md5 `bf6ba1e165640f8ae3f51fb13720f0f3`, v8.3.0 (re-téléchargée et re-vérifiée le 21/07).
- **Livré** : `index.staging.html`, **362 098 o, md5 `bf86ffc96008bcf48fe3451e46c9d873`, `APP_VERSION="8.4.0"`** (grep, lignes `//` écartées).
- **Double parseur** : `node --check` OK · acorn ecmaVersion 2020 OK (bloc script unique).
- **Diff** : **49 retirées · 106 ajoutées · 36 hunks** — les 49 retirées classées à 100 % dans les coutures ci-dessous (aucune ligne retirée hors périmètre déclaré).

## 2. Un point par illogisme — preuve avant/après (parcours joués au harnais, DONNÉES RÉELLES en GET)

### I1 · Un seul chemin de lecture — PROUVÉ
- AVANT : `collectChapterItems` testait `!ch.published` / `!sce.published` / `!it.published` (L3142/3145/3149) — un objet par classe passait pour tous.
- APRÈS : les trois tests → `_visiblePourSession(node, level)` (prof : loupe `ADMIN_LENS` ; élève : `isPubFor(_eleveClasse())`).
- **Preuve exécutée** : `I1_objet_ne_passe_plus: true` (élève de 4E PYTHAGORE ne voit PAS `{published:{"4E BANKSY":true}}`) · `I1_bonne_classe_voit: true` (l'élève de 4E BANKSY le voit).
- **Interdiction tenue** : grep « `.published` testé directement » → **0 occurrence** hors module (`isPubFor`/`_markPub`/`_isPubAny`/cascade) ; restent les classes CSS `.ch-publish-btn.published`/`.item-pub-btn.published` (styles, pas des tests) et `published_tabs`/`published_extras` (autre contrat, §III).

### I5 · Une seule forme de clé, tolérance PROUVÉE AUX DEUX SENS (exigence Q1)
- `isPubFor` : lecteur unique tolérant (normalisation par slug des deux côtés ; la clé exactement canonique PRIME si deux clés coexistent).
- `_eleveClasse()` : renvoie la classe brute (la normalisation vit dans `isPubFor`, une fois).
- `_markPub` : écrit la clé en **slug** ; mode `'*'` = toutes classes (forme `true`, conservée en lecture).
- `_applyPubCascade` : le PUT hub passe au **slug canonique** ; toute ancienne clé brute du même slug est **purgée** (mémoire `delete` + `DELETE` hub) — migration douce : chaque re-publication migre la clé, une classe = une clé, jamais deux.
- **Preuves exécutées** : `brute_lue_par_eleve: true` (publication existante de Paul `{"4E BANKSY":true}` lue par un élève de la classe) · `brute_autre_classe: false` · `slug_lu_par_loupe_brute: true` (publication canonique `{"4e_banksy":true}` lue par la loupe prof en clé brute) · `forme_true: true` · `mixte_canonique_prime: true` (`{"4E BANKSY":true,"4e_banksy":false}` → non publié) · `markPub_ecrit_slug: {"4e_banksy":true}` · `markPub_etoile: true`.
- **AUCUNE migration de données** : les publications actuelles de Paul restent lisibles telles quelles (premier test ci-dessus).

### I2 · Le site ne liste plus le nominatif
- `gotoDictee` ne lit plus `/correction_dictee.json` ; `showDicteeList(dictees, level)` : la section « Correction de ma dictée manuscrite » porte UNE carte → `openMesDictees()` → `correction_dictee.html?mode=eleve` (l'app applique « Mes dictées », le bon filtre). Le chemin depuis le site est préservé (arbitrage Q6 : carte, pas retrait).
- `openCorrectionDictee` supprimée : **grep 0** (son unique appelant était la liste retirée). `_findEleveByCode` supprimée : **grep 0** (unique appelant : la branche code-seul retirée).

### I3 · Entrée unique code + nom + prénom — les trois cas réels d'un jour de classe (exigence de l'audit)
`<form id="val-form">` : nom `autocomplete="username"` · prénom `additional-name` · code `type="password" inputmode="numeric" autocomplete="current-password"` · bouton `type="submit"` — **c'est la structure qui déclenche l'enregistrement navigateur**. Le listener Enter global (L3023) retiré : le form gère Enter, sinon double appel.
Parcours joués sur une élève RÉELLE (AUDEBERT Elise, 3E Charles de Gaulle, code réel lu en mémoire de page) :
| Cas réel | Résultat | Texte affiché (SOUMIS, voir §5) |
|---|---|---|
| **N'a pas son code sur lui** | refusé | « Écris ton nom, ton prénom et ton code personnel. » |
| **Se trompe de code** | refusé | « Ce code ne correspond pas. Vérifie-le, ou vois avec moi en classe. » |
| **Nom mal orthographié** | refusé | « Nom non reconnu. Vérifie l'orthographe, ou vois avec moi en classe. » |
| Code seul (ancienne entrée) | refusé | (message des trois champs) |
| Nom + prénom + code exact | **entré** | « Bienvenue, AUDEBERT Elise ! » |

### I4 · Une seule identité prof — `DEV_MODE` A DISPARU
- **Grep de preuve : `DEV_MODE` → 0 occurrence de code** (3 mentions restantes, toutes dans des commentaires `/* */` de la section M8-IDENTITÉ ; idem `activateAdmin` : 2 mentions en commentaires). La classe fictive `'DEV'` a disparu avec.
- **PORTE PROF PROUVÉE, dite explicitement (exigence Q2)** : un code de `PROF_CODES` (`1312`) accompagné de N'IMPORTE QUELS nom et prénom — « Monsieur MENEY » **ET champs vides** — ouvre la session prof : `isProf: true`, vue envers, liseré actif, badge `⚡ ADMIN`. **C'est l'entrée quotidienne de Paul ; il ne peut pas être enfermé dehors.** Le navigateur lui proposera d'enregistrer nom+code.
- `basculerVue()` remplace `activateAdmin` (2 appelants re-câblés : Ctrl+Espace, badge 5 tapes) : bascule ×2 jouée — `envers false→true`, **mémo écrit `0`→`1` ET RELU** (clé `mjpc_vue_envers`, exigence Q4 : écrite et relue, pas de seconde dette `sessionStorage`), identité INCHANGÉE à la bascule (`M. Meney (prof)`), badge inchangé (il dit l'identité, plus jamais « DEV »).
- **Élève + Ctrl+Espace : RIEN** (exigence Q3) — `admin:false, liseré:none`, aucun message, aucun signal.
- Les 11 lecteurs d'`is_prof` (accès niveaux, exemption `BLOCKED_LEVELS`, présence, notification…) : **intacts** (aucun hunk du diff ne les touche).
- L'alerte règles J+29 : `verifierAlerteRegles()` vivait dans `activateAdmin` (disparu) → **déplacée à `loginAsProf` et `_atterrirProf`** — elle se déclenche désormais à chaque connexion/retour prof (invariant préservé, chemin déclaré).

### Témoins — trois signaux, trois sens (doctrine §I)
- **Liseré ambre** (vue envers) : l'élément `#admin-banner` réutilisé — `inset:0`, bordure 3 px, `pointer-events:none` (prouvé : `lisereClique: "none"`), 390×844 au mobile, **zéro pixel de contenu**. Le texte de l'ancien bandeau vit en tête du Tableau de bord (« Vue envers — Glisse tes fichiers… Ctrl+Espace… », texte PROF).
- **Badge** `⚡ ADMIN` = identité. **Point orange + pastille** = mode test : re-vérifiés APRÈS la passe — `testdotVisible: true`, pastille « Mode test actif — rien n'est enregistré », panneau fermé.

### I6 · Le prof n'atterrit jamais sur un refus élève
Rechargement SANS `?n=`, session prof restaurée : `home: true, lienInvalide: false`, **vue RELUE** (mise à l'endroit avant rechargement → rendue à l'endroit après), badge `⚡ ADMIN`. Arbitrage Q7 appliqué : atterrissage sur l'écran « choisir son niveau », ni niveau en dur ni préférence inventée. Couture jumelle : un prof restauré AVEC `?n=` n'est plus renvoyé au portail (sa condition d'entrée n'exige plus `niveau===currentLevel`). La branche « lien invalide » (élève sans lien) est INTACTE et cache aussi le champ code.

## 3. Aucune fonction supprimée sans grep — table des retraits
| Retirée | Preuve |
|---|---|
| `activateAdmin` | grep 0 (hors commentaires) ; remplacée par `basculerVue`/`_atterrirProf`, 2 appelants re-câblés |
| `DEV_MODE` (var + 5 usages) | grep 0 (hors commentaires) |
| `openCorrectionDictee` | grep 0 ; unique appelant = liste retirée ; remplacée par `openMesDictees` |
| `_findEleveByCode` | grep 0 ; unique appelant = branche code-seul retirée |
| listener Enter global | le `<form>` couvre Enter (double appel sinon) — retrait prouvé au parcours (submit fonctionne) |

## 4. Les deux colonnes
- **Mobile 390 (tactile)** : portail 4 cibles, **0 sous-norme** (49/49/49/46 px) ; liseré plein cadre non cliquable ; marqueurs test visibles panneau fermé.
- **Desktop 1280** : `val-nom` 164×49, `val-prenom` 164×49, `val-btn` 338×46, `val-box` 420 de large — **identiques à l'AVANT mesuré sur production** (le champ code, 338×49, est un AJOUT STRUCTUREL, bénéfique aux deux écrans ; `val-box` passe de 401 à 460 px de HAUT par ce champ — aucune dimension d'élément existant modifiée, aucune media query desktop touchée). Panneau prof : aucun hunk du diff ne touche ses sections ni son CSS.

## 5. Textes élève NOUVEAUX — SOUMIS, pas décidés (principe cardinal · 25bis · 28)
1. « Écris ton nom, ton prénom et ton code personnel. » (placeholder du champ : « Code personnel »)
2. « Ce code ne correspond pas. Vérifie-le, ou vois avec moi en classe. »
3. « Nom non reconnu. Vérifie l'orthographe, ou vois avec moi en classe. »
4. Carte : « Mes dictées corrigées » · « Identifie-toi et retrouve tes corrections » · « → Ouvrir »
Aucun mot du code ; jamais le professeur en sujet d'une négation ; « vois avec moi » = première personne du professeur (point 28). Conservés tels quels : « Le prof a corrigé ta dictée sur papier… » (accompli, sujet légitime) et le sous-texte points bonus.
**Pas d'annonce élève** dans cette livraison (structure ; le portail changera pour les élèves À LA RENTRÉE — une annonce pourra accompagner la rentrée, décision de Paul).

## 6. Écritures hub : ZÉRO — et le harnais l'a prouvé en conditions réelles
Le parcours de connexion d'une élève réelle a DÉCLENCHÉ les écritures du site (`PUT /eleves/<uuid>`, `PUT /eleves_index/audebert_elise`, `PUT /presence/…`) : **toutes AVORTÉES par le harnais** (journal `mesure_apres_reseau.json`, 33 entrées, 20 avortées dont ces PUT et les POST Apps Script). Lectures GitHub authentifiées, tailles+md5 au §1.

## 7. Ce que je n'ai pas pu tester
- L'**enregistrement effectif du code par le navigateur** (autocomplete) : Chromium headless ne propose pas la sauvegarde de mots de passe — la structure `<form>`/`autocomplete` est celle documentée, mais seule la main de Paul sur son Chrome le prouvera. **À vérifier à son premier passage.**
- La **cascade de publication en écriture réelle** (PUT slug + DELETE clés brutes) : jouée en mémoire (`_markPub`, purge) mais les PUT sont avortés par construction — le premier clic de publication de Paul en production fera la première migration réelle d'une clé. Réversible : la lecture tolère les deux formes, dans les deux sens.
- Le vrai pouce, les vraies polices (Google Fonts avorté), le vrai Chrome Android.
- `?mode=eleve` sans `&dictee=` sur `correction_dictee.html` : je n'ai pas ouvert l'app (hors fichier du morceau) — l'app affiche son portail/« Mes dictées » par construction ; un regard de Paul au premier usage est prudent.

## 8. Écarts et défauts HORS PÉRIMÈTRE constatés (une ligne chacun, sans corriger)
- **« Un document uploadé est publié d'emblée pour toutes les classes »** (L2640-2642, routé par `_markPub('*')` à comportement identique) — **mérite un arbitrage de Paul** (consigne de l'audit).
- `_markPub` sur un nœud `published:true` + dé-publication d'UNE classe : écrase `true` par `{classe:false}` (les autres classes perdent la publication en mémoire) — **comportement PRÉEXISTANT, non modifié**, à instruire un jour avec le contrat de publication.
- `trackLogin` envoie nom/prénom à l'Apps Script à chaque connexion (D-APPSCRIPT-RESIDUEL, déjà consignée).
- `ensureEleveUuid` slugifie la classe avec sa PROPRE normalisation locale (`toLowerCase().replace(...)`) au lieu de `_slugifyClass` — divergence potentielle sur accents, hors périmètre.
- Le `dev-banner` de `page-validation` (« MODE DÉVELOPPEMENT — page centrale à supprimer au déploiement ») s'affiche encore sur l'écran « lien invalide » — vestige, hors périmètre.

## 9. Dettes / restes
Voir la liste de fin de message de la conversation (règle 14ter : sans le morceau en cours).
