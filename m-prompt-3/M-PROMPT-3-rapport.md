# M-PROMPT-3 — RAPPORT D'EXÉCUTION : les trois apps « partielles » passent au canon
**01/08 · exécutant → conscience · checklist à preuves**

## 1. md5
Documents : DISPOSITIF `4417009c2bd2cf9758a977e64d1ac49d` · DOCTRINE `e07900648409685caec7f2a2dae78265` · CHANTIER `a206952eedb4b7c3ea4fc2c85b476430` · ÉTAT-DES-LIEUX `8edbc8d7daa09a3ab61355cc0b3135e0` · journal `8f09dc2234f02bbe53d30ddb85eaaccc` · restauration `dd11543922d9ee20392bd0fdba2a3bc8`. Contrat : **canon `d89d456389f598c7a731cf894a60a4cb` (1.4.0)**. Modèles lus : `correction_dictee` 577 012 o (6.3.0) · `worktrack` 1 048 372 o (M-PROMPT-2 promu).
| app | base | livré | pastille |
|---|---|---|---|
| evaluation-qcm | 520 197 o · `542ba6c50a25d1d01eb8e3da7858cc39` | **534 063 o · `7cec4f78285fce830f6a50fc6b7f9d69`** | 7.2.0 → **7.3.0** |
| analyse_logique | 555 950 o · `4e49d6d714b40b362679e507ea7f840d` | **568 116 o · `90b8401a0dbac5b9b38cc2c55f8bc649`** | 2.3.0 → **2.4.0** |
| applause_meter | 640 373 o · `c94e6f88020c830f8af0a6c61145dba5` | **651 889 o · `4b1c6bdffac9f1cc04a251e0508e89fa`** | 2.2.0 → **2.3.0** |

## 2. TABLEAU PAR APP — avec la colonne « ce que je n'ajoute pas »
| | ce qu'elle avait | ce que le canon apporte | **NON AJOUTÉ, et pourquoi** |
|---|---|---|---|
| **evaluation-qcm** | prompt ~3 300 c. **déjà persisté** (`qcm/settings/promptIa`), écriture SDK `set(draft, cb)` · `parseEvaluation` : messages nommés mais **arrêt au premier** · niveaux écrits à la main dans le prompt | écriture **par VERDICT** · validation qui **accumule** (`qcmValiderEvaluation`, posée à côté) · **vocabulaire des niveaux GÉNÉRÉ** depuis `NIVEAUX` · chemin **historique conservé** | **aucune injection ni archive-avant** : l'app protège par **versionnement** (une éval qui a servi crée une version, résultats jamais mélangés) — plus fin qu'une corbeille · `snapshotImport` non touché (import de sauvegarde, hors chaîne prompt) |
| **analyse_logique** | `promptCorrige` **jamais persisté**, vocabulaire déjà généré à la main · `parseCorrige` **ignore en silence** les lignes fautives | **persistance** (`/analyse_logique_prompts/corrige/*`) · jetons `{{PHRASE}}`/`{{CODES}}` · **vocabulaire canonisé à SORTIE IDENTIQUE** · `alValiderCorrige` **nomme chaque ligne** refusée | **aucune injection** : cette app **affiche**, elle n'écrit rien au hub · `parseCorrige` et le rendu du noyau **intouchés** · **ses bugs signalés ne sont ni cherchés ni réparés** |
| **applause_meter** | `genererPromptIA` **jamais persisté** · `parseCriteresJSON` : `{err}` **unique** | **persistance** (`/applause_prompts/criteres/*`) · jetons `{{THEME}}`/`{{NB}}` · `amValiderCriteres` **accumule et cite** | **aucune injection** : `appliquer()` remplit le formulaire **que Paul ajuste** avant d'enregistrer — une injection court-circuiterait l'ajustement que l'écran promet · **les cinq `valider` métier intouchées** |

## 3. La preuve
**Banc mémoire 32/32** — dont le contrôle de la règle du 01/08 (signature `cb(issue)` **lue au canon**, stub conforme) · **persistance ×3** : écrite par verdict, **retrouvée après rechargement**, **défaut en dur si la base est muette**, **panne → verdict FAUX**, **mode test → rien au hub** (qcm) · **vocabulaire généré ×2 avec preuve par élément factice** (un niveau ajouté à `NIVEAUX` paraît ; une étiquette ajoutée au référentiel paraît) · **SORTIE IDENTIQUE prouvée** pour `analyse_logique` (ancienne ligne `- CODE : libellé` comparée à la nouvelle, aux espaces de tête près — condition posée par la conscience) · **validations qui accumulent ×3** : quatre questions citées (qcm), quatre lignes citées avec leur raison (analyse), quatre critères cités (applause).
**Banc navigateur 11/11** — **RÈGLE DU 01/08 APPLIQUÉE** : chaque fonction posée **vérifiée présente sur `window`** dans la page réelle (8 par app, aucune `undefined`) · persistance réelle écrite puis relue depuis le hub ×3 · validations à l'écran ×3 · **mobile 390 mesuré en DELTA base↔livré : aucun débordement introduit** · journal limité aux nœuds de prompts.
**Statique ×3** : double parseur script par script **VERT** (seul KO : le gabarit pré-existant d'`analyse_logique`, base-KO-identique) · **canon ↔ embarqué 31/31 à l'octet ×3** · **0 fonction supprimée ×3** ; modifiées : `ModalCreerEval`+`ModalPromptIA` (qcm), `promptCorrige` (analyse), `CarteIACriteres` (applause) — le périmètre exact · diff : qcm 6 hunks +249/−14 (**2 hors motifs : `var v = snap.val();` et `});`, lignes de l'ancienne lecture SDK remplacées**), analyse 4/+228/−5 (**0**), applause 4/+205/−3 (**0**) — `diffmp3-bilan.json`.
**Les cinq `valider` d'`applause_meter`** : comptées (5), extraites une par une, **md5 identiques base ↔ livré**. Intactes à l'octet, prouvé.

## 4. UN BUG PRÉ-EXISTANT TROUVÉ, SIGNALÉ, NON RÉPARÉ
`evaluation-qcm` porte **deux déclarations de pastille** : la vraie (`var APP_VERSION="7.2.0"`, octet 116 548) **puis un gabarit de commentaire resté en dur — `var APP_VERSION = "…";` à l'octet 119 263 — qui l'ÉCRASE**. À l'exécution, `window.APP_VERSION` vaut littéralement `…` : **la pastille affichée à l'écran ne dit pas la version depuis un moment**. Vérifié : le gabarit vient après, il gagne ; **isolé à cette app** (absent d'`analyse_logique` et d'`applause_meter`). **Je ne le répare pas** — hors mandat, et c'est la règle : signaler plutôt que faire. **Conséquence pratique à connaître : ma pastille 7.3.0 est correctement posée à la source mais restera invisible tant que le gabarit n'est pas retiré.** Un morceau d'une ligne suffirait.

## 5. Trois symptômes de banc instruits (aucun code en cause)
① `evaluation-qcm` charge **React 17** et le **SDK Firebase v8** — mon banc ne servait que React 18 et le SDK 9. ② Ses balises portent `crossorigin` : une réponse sans `Access-Control-Allow-Origin` est **rejetée** par le navigateur. ③ Vérifié à chaque fois **contre la base** : elle se comportait à l'identique. Corrigé côté banc (stub v8 minimal, React 17 servi, en-tête CORS), jamais côté code.

## 6. Constat demandé : les chemins de prompts ne sont pas uniformes
`qcm/settings/promptIa` (historique) · `/analyse_logique_prompts/corrige/*` · `/applause_prompts/criteres/*` · `/dictee_settings/*` (correction_dictee) · `/worktrack_prompts/chapitre/*` · `/dictee_universelle_prompts/analyse/*` · `/pilotage_prompts/documents/*`. **C'est un constat, pas une dette** : uniformiser des adresses qui marchent coûterait une migration pour rien, et risquerait de perdre les prompts déjà écrits par Paul. **Le mécanisme est canonique partout ; l'adresse reste locale.**

## 7. DÉCLARATION DE COUVERTURE
**Testé** : tout le §3. **Non testé, déclaré** : le hub réel (interceptions ; aucune écriture réelle) · une vraie IA · Chrome Windows · les écrans prof en usage réel (les fonctions sont éprouvées et présentes sur `window`, la recette revient à Paul) · l'impression · le rendu visuel des captures (aperçu local en défaut ; dimensions cohérentes) · **`evaluation-qcm` sous SDK v8 réel** (le banc utilise un stub minimal : le chargement est prouvé, pas le comportement Firebase v8 complet) · les bugs d'`analyse_logique` (non cherchés, comme demandé — aucun croisé pendant le travail sur sa chaîne prompt).

## 8. Livraison
`m-prompt-3/` : les trois `.staging.html` · ce rapport · le cadrage · `bancmp3-memoire.js` + `bancmp3-verdicts.json` (32) · `bancmp3-nav.js` + `bancmp3-nav-verdicts.json` (11) + `bancmp3-reseau.json` · `diffmp3-bilan.json` · `assemble-mp3.py` · `_fb8.js` (stub v8 du banc) · captures `img-i01…i06.png`. Bit à bit vérifié après téléversement.
