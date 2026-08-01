# M-PROMPT-1 — RAPPORT D'EXÉCUTION : le canon de la zone prompt
**01/08 · exécutant → conscience · checklist à preuves**

## 1. md5
Documents : DISPOSITIF `ce116a8cdb82c5ad4a8b0365cfa4613a` · DOCTRINE `e07900648409685caec7f2a2dae78265` · CHANTIER `a206952eedb4b7c3ea4fc2c85b476430` · ÉTAT-DES-LIEUX `8edbc8d7daa09a3ab61355cc0b3135e0` · journal `d8f94d0efeab8119a2ee5cb33d3b232e`.
Les quatre chaînes lues sur pièces : `correction_dictee` 558 431 o `d86e56fa79377389c21621b063f97355` · `worktrack` 1 034 102 o `2dfe32e911b4064851fcd09ba6f89683` · `dictee_universelle` 1 974 360 o `db6f242b4aeb0714209fdd796fcf3e4e` · `pilotage_debat_s3` 468 885 o `1cd9feeb3311d42abc8408e0256f06f1`. Lu sans y toucher : `index.html` 585 177 o (SITE-COURS-2a promu).
**Bases → livrés** (re-téléchargées à l'instant de l'édition) :
· `mjpc-core.js` 17 620 o `f5e81602f8aee1ca17a9721546066efa` (1.3.0) → **25 143 o `d89d456389f598c7a731cf894a60a4cb` · 1.4.0**
· `correction_dictee.html` 558 431 o `d86e56fa79377389c21621b063f97355` (6.2.0) → **577 012 o `9b700154a45d0f589bcf0d6caf957471` · 6.3.0**

## 2. Le canon — § 12 (et les deux anomalies signalées, non rangées)
Le canon porte **deux sections « 8 »** (Manifeste L153, Session partagée L169) **et n'a pas de §10** : je prends **§12**, je ne renumérote rien. La §12 porte : `MJPC_PROMPT_CADRAGE` (le texte de worktrack, constante réutilisable) · `mjpcPromptVocabulaire(source,options)` — **génère** la liste depuis une source fournie par l'app, réservées exclues, types traduits en français · `mjpcPromptComposer(pieces)` — assemble directives + cadrage + format + vocabulaire, puis **substitue les jetons `{{…}}`** de `donnees` · `mjpcPromptChemin/Charger/Enregistrer` — persistance par app **et par produit**, **défaut en dur qui fait foi si la base est muette**, écriture par `mjpcEcrireRest` · `mjpcVerdictOk(issue)` · `mjpcValidation(max)` — **l'accumulateur** (`exige`, `cite`, `inconnu`, `motifs`) · `mjpcInjecterAvecArchive(opts,cb)` — **archive AVANT s'il y a quelque chose à perdre, ABANDON si elle échoue**, écriture ensuite, verdict rendu.

## 3. LE TABLEAU DE CORRESPONDANCE (extrait, pas inventé)
| | `correction_dictee` | `worktrack` | `dictee_universelle` | `pilotage_debat_s3` | canon 1.4.0 |
|---|---|---|---|---|---|
| composition | **2 pièces assemblées** + 2e jeu séparé | monolithe 14 975 c. | littéral à la volée | lignes concaténées | **EXTRAIT d'elle** + vocabulaire + données |
| interpolation | **`{{JSON_DICTEE}}`** | — | données dans le littéral | valeurs concaténées | **RETENU et généralisé** |
| vocabulaire | à la main | à la main | — | — | **RATTRAPE** (patron SITE-COURS-2a) |
| persistance | **Firebase + défaut en dur** | **aucune** (dette) | aucune | aucune | **EXTRAIT d'elle**, + axe produit |
| écriture | SDK sans garde | — | — | — | **RATTRAPE** : verdicts §9 |
| cadrage imposé | dans les directives | **texte de référence** | partiel | absent | **EXTRAIT de worktrack** |
| validation | s'arrête au 1er, cite l'index | s'arrête au 1er | — | **booléen nu** | **RATTRAPE les trois exigences** |
| injection | `.set()` — **ni aperçu ni archive** | direct | direct | direct | **RATTRAPE** (l'archive-avant vient du chantier, d'AUCUNE des quatre) |

## 4. Le passage de `correction_dictee`
Section nommée `§ PROMPTS` : `CD_BASE` (le hub, **mesuré** — cette app n'a PAS de `FIREBASE_BASE`, c'est une constante d'`index.html` ; on reprend le hub déclaré par sa section M-SÉCU-2), `CD_PIECES` (les deux jeux : `promptIaBanque` / `promptDirectives`+`promptFormat`, **chemins historiques conservés**), `cdChargerPrompt` (base → sinon défaut en dur), `cdEnregistrerPrompt` (**verdict**, mode test gratuit vers `M8_TEST_STORE`), `cdValiderExercices` (**accumulateur**, mêmes contrôles métier). L'injection : lecture tolérante des clôtures ```` ``` ````, **aperçu** avant toute écriture, **archive en corbeille AVANT** si une banque existe, **abandon si elle échoue**. Q2 appliquée : quand il n'y a rien à perdre, l'aperçu **le dit** (« Cette banque est vide pour l'instant : rien ne sera perdu ») au lieu de poser la même question.

## 5. La preuve
**Banc mémoire 22/22** : vocabulaire généré (réservée exclue, types traduits) et **PREUVE DE GÉNÉRATION** (une entrée ajoutée à la source paraît, aucune liste retouchée) · ① composition avec **cadrage imposé** · **NON-RÉGRESSION 1/5 : l'interpolation `{{JSON_DICTEE}}`** · ② écriture par verdict puis **relecture réussie** · ③ **base muette → défaut en dur**, échec d'écriture → **faux** (pas un succès supposé), **mode test → rien au hub** · ④ trois défauts → **trois motifs d'un coup**, chacun citant l'exercice et disant quoi corriger ; type inconnu cité avec la liste des types ; **NON-RÉGRESSION 2/5 : un JSON valide passe** · ⑤⑥⑦ **archive@0 < document@1**, archive `{_meta,data}` portant l'ancienne banque, **archive en échec → ABANDON**, et **rien à remplacer → aucune archive de rien** · **NON-RÉGRESSION 3/5, 4/5, 5/5** : les deux jeux, le format écrit au hub inchangé (`exercices_classe`/`exercices_personnels`, même chemin, même `.set`), les trois défauts en dur, les deux écrans, `assemblePrompt`, `supprimer()`.
**Banc navigateur 9/9** (serveur local, hub REST intercepté, CDN vendorisés, `dernierControleRegles` à aujourd'hui — overlay sans objet ici, il vit dans `index.html`) : canon 1.4.0 et §12 vivants dans la page, app en 6.3.0 · composition réelle · **`assemblePrompt` d'origine fonctionne toujours** · validation qui accumule à l'écran · **persistance réelle : écrite par verdict, relue depuis le hub** · défaut en dur sur pièce absente · les textes de l'aperçu présents · **mobile 390 : zéro débordement** · journal : aucune écriture hors `dictee_settings`/`correction_dictee`/`corbeille`.
**Statique** : double parseur script par script **VERT** · **canon ↔ embarqué 31/31 à l'octet** · **0 fonction supprimée**, 3 modifiées (`PromptIaModal`, `PromptIaExoModal`, `ExercicesAdmin` — le périmètre exact), 11 ajoutées · diff 13 hunks +334/−33, **2 retraits hors motifs, tous deux des lignes déplacées dans mes blocs asynchrones** (`setJsonInput`/`setShowInject`, `setEditMode`) — `diffmp1-bilan.json`.

## 6. UN DÉFAUT RÉEL, TROUVÉ PAR LE BANC ET CORRIGÉ (instruit, pas écarté)
J'avais écrit `mjpcEcrireRest(url,opts,function(ok,issue){…})`. **Mesuré au canon : `mjpcEcrireRest` appelle `cb(issue)` — UN seul argument.** Mon `ok` recevait donc l'objet issue, **toujours vrai** : un échec d'écriture serait passé pour un succès — exactement la famille de défauts que M-ÉCHECS répare, réintroduite par moi. **Le banc mémoire ne l'a pas vu parce que mon stub appelait `cb(true,{…})` : le stub était faux.** C'est le banc navigateur, sur le vrai code, qui l'a attrapé. Corrigé partout (`mjpcVerdictOk` posée au canon et utilisée par les trois appelants), **et le stub a été aligné sur la vraie signature** — leçon à retenir pour les huit passes suivantes : *un stub qui ne copie pas la signature réelle valide un code faux.*

## 7. Dettes signalées, non traitées (comme convenu)
· **L'injection des exercices reste sur le SDK** (`db.ref().set().then().catch()`) : décision Q1 — les prompts sont un réglage, l'injection porte le travail de Paul. **Rejoint M-ÉCHECS-2** (~525 écritures SDK sans garde, septembre).
· L'archive de la banque passe elle aussi par le SDK (même raison, même dette) ; le canon `mjpcInjecterAvecArchive` est **livré et éprouvé au banc**, prêt pour les apps qui écrivent en REST.
· Les deux « 8 » et le §10 absent du canon : **signalés, non rangés**.
· `PROMPT_CHAPTER` de worktrack n'est toujours pas persisté : c'est le morceau ③ (passe sur les apps).

## 8. DÉCLARATION DE COUVERTURE
**Testé** : tout le §5. **Non testé, déclaré** : le hub réel (interceptions ; aucune écriture réelle) · une vraie IA et la qualité de ses retours · Chrome Windows · l'écran prof complet de `correction_dictee` en usage (les composants React sont montés au banc mais la recette d'usage revient à Paul) · l'impression · le presse-papier réel · le rendu visuel des captures (aperçu local en défaut ; dimensions et assertions DOM cohérentes) · les huit autres apps (hors périmètre).

## 9. Livraison
`m-prompt-1/` : `mjpc-core.staging.js` · `correction_dictee.staging.html` · ce rapport · le cadrage · `bancmp1-memoire.js` + `bancmp1-verdicts.json` (22) · `bancmp1-nav.js` + `bancmp1-nav-verdicts.json` (9) + `bancmp1-reseau.json` · `diffmp1-bilan.json` · `assemble-mp1.py` + `assemble-mp1b.py` + `section12.js` · captures `img-g01…g02.png`. Bit à bit vérifié après téléversement.
