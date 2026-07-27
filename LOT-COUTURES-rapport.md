# LOT-COUTURES — RAPPORT DE LIVRAISON

`[exécutant LOT-COUTURES]` · 27/07/2026 · **PROVISOIRE (pt 21)** — rien n'est réputé fini tant que la conscience ne l'a pas déclaré. **Je ne promeus jamais.**

Livrables au sas : `analyse_logique.staging.html` · `dictee_universelle.staging.html` · `worktrack.staging.html` · ce rapport. Diffs intégraux joints : `diff_analyse_logique.txt`, `diff_dictee_universelle.txt`, `diff_worktrack.txt`.

---

## 0. LES CINQ COUTURES — VERDICT

| # | Couture | Fichier(s) | État |
|---|---|---|---|
| ① | Gestes de base (Modifier / Supprimer / Dupliquer) | analyse_logique | ✅ livré, parcours joués |
| ② | Sous-onglet homonyme → « 🧪 Outils » | analyse_logique | ✅ livré, vu à l'écran |
| ③ | Deep-link `?travail=<id>` (autorisé/refusé) | analyse_logique | ✅ livré, deux cas joués |
| ④ | Corbeille vers la racine (format canonique) | analyse_logique + dictee_universelle | ✅ livré |
| ⑤ | `contenu:` → `data:` | worktrack | ✅ livré (une ligne) |

## 1. BASES REVÉRIFIÉES (lecture GitHub AUTHENTIFIÉE, taille + md5)

| Fichier | Taille | md5 | Attendu prompt | Verdict |
|---|---|---|---|---|
| `analyse_logique.html` | 522 047 o · 3 107 l | `93fb6e32fa4243afd2fc344fc9bca510` | idem | ✅ |
| `dictee_universelle.html` | 1 956 829 o · 10 616 l | `f8362a876ceefe1dc1e6d7f668f00848` | idem | ✅ |
| `worktrack.html` | 1 017 258 o · 9 269 l | `9bd370fb43940b9cba9ba495d5cf2eb1` | idem | ✅ |

Fichiers > 1 Mo (`dictee_universelle`, `worktrack`) lus par `git/blobs/<sha>`. Aucun `raw.githubusercontent.com`. Aucun fichier de 279 o reçu. `index.html` (393 791 o, `c09a8bff…`) lu en seule lecture pour le contrat de restauration.

## 2. LIVRABLES — md5 APRÈS coutures

| Fichier | Taille | md5 |
|---|---|---|
| `analyse_logique.staging.html` | 538 786 o | `75f9f3695ffba9224c5ac8cdbf2dab0b` |
| `dictee_universelle.staging.html` | 1 957 540 o | `6342dd533fe20c9107af27fe824a7aa2` |
| `worktrack.staging.html` | 1 017 371 o | `e37a0f8ad9f259f23020184d954a5bce` |

## 3. DIFF INTÉGRAL LIGNE À LIGNE, CLASSÉ PAR FICHIER

### 3.1 `worktrack` — 2 changements (diff_worktrack.txt : 4 lignes `<`/`>`)
- **L7 — pastille** : `content="2026-07-23a"` → `content="2026-07-27a"`.
- **L7722 — couture ⑤** : `contenu:` → `data:` dans `delChapter`. Motif : `index.html` L4464 restaure sur `data` ; `contenu` tombait en branche « brut » et le bouton « Restaurer » n'était jamais rendu.
- **Rien d'autre touché.** md5 `9bd370fb…` → `e37a0f8a…`.

### 3.2 `dictee_universelle` — 2 zones (diff_dictee_universelle.txt : 25 lignes)
- **L729-730 — pastille** : 2.0.0 → 2.0.1, date 2026-07-27.
- **L761-773 — couture ④** : `duArchiverCorbeille` pose `_meta.chemin` + `data` = valeur BRUTE **uniquement si `paths.length===1`** (l'appelant L4194, `suppression_dictee_<id>`). Les deux archives multi-emplacements (L6413, L6441, 7 sous-nœuds aplatis) conservent le format d'origine — poser `_meta.chemin` sur elles ferait restaurer l'enveloppe aplatie, une corruption. Couture strictement minimale : rien d'autre dans le fichier.
- md5 `f8362a87…` → `6342dd53…`.

### 3.3 `analyse_logique` — 4 coutures (diff_analyse_logique.txt : 306 lignes)
Regroupées :
- **Pastille** (L1620-1621) : 2.0.0 → 2.1.0, date 2026-07-27.
- **② L2260** : `["reglages_app","Réglages"]` → `["reglages_app","🧪 Outils"]`.
- **③ deep-link** : `App()` lit `?travail=<id>` au boot et nettoie l'URL (`history.replaceState`) ; prop `cibleId` passée à `AppEleve` et `AppProf`. `AppEleve` ouvre le travail s'il est dans sa liste (publié + classe), sinon lit le seul nœud `config` du travail ciblé pour distinguer « autre classe » de « non publié / inexistant » et affiche le texte de refus (dictionnaire, pt 26). `AppProf` ouvre la Correction du travail (prof = tous droits). 2 textes ajoutés à `TEXTES_DEFAUT` : `eleve_lien_non_publie`, `eleve_lien_autre_classe`.
- **④ corbeille** : `versCorbeille` écrit à `/corbeille/<jour>/<clé>` au format `{_meta:{chemin,app,ts,motif,etiquette}, data}`, **abandon si l'archive échoue** (`cb(err)`, source non détruite) ; `restaurerCorbeille` polymorphe (racine `__racine` / ancien local) ; `ReglagesApp` lit les deux sources fusionnées (racine filtrée sur `_meta.app==="analyse_logique"` + ancien `analyse_logique/corbeille` en tolérance) ; bouton « Vider » ciblé par emplacement ; `purgerModeTest` nettoie les résidus aux deux emplacements.
- **① gestes de base** : composant `Travaux` étendu — `ouvrirEdition`/`enregistrerEdition` (verrou du champ `texte` dès qu'une copie ou un corrigé existe), `dupliquer` (recopie `config`, sans `results`/`corrige`, copie non publiée renommée), `ouvrirSuppression`/`confirmerSuppression` (dénombrement AVANT, `versCorbeille` archive le nœud entier puis détruit, abandon si l'archive échoue). Deux modales `.m11-modal` (jamais `confirm()` natif pour ces gestes).

## 4. DOUBLE PARSEUR (node --check + acorn ES2020) — TOUS LES BLOCS

- `analyse_logique.staging.html` : 5 blocs `<script>` exécutables → **node OK · acorn OK** (le template `type="text/plain" id="noyau-tpl"` correctement exclu comme non-JS).
- `dictee_universelle.staging.html` : 8 blocs → **node OK · acorn OK**.
- `worktrack.staging.html` : 4 blocs → **node OK · acorn OK**.

## 5. INVARIANTS md5 AVANT/APRÈS — le moteur ne bouge pas

| Invariant | md5 avant | md5 après | Verdict |
|---|---|---|---|
| `buildTokens` @L645 (noyau embarqué) | `06111ac38e6aae0e4adae76cea740feb` | idem | ✅ figé |
| `buildTokens` @L2018→L2042 (tokeniseur partagé) | `19bca7eb0439a666ea019249361d541b` | idem | ✅ figé |
| `evaluer` (moteur d'évaluation) | `c1706f2cb0a53c87331753acd5cc5687` | idem | ✅ figé |

La tokenisation et les deux `buildTokens` sont inchangés bit pour bit : les corrections déjà stockées gardent leur sens. Le second `buildTokens` a glissé de L2018 à L2042 (insertions plus haut) — contenu identique.

## 6. PASTILLES INCRÉMENTÉES (règle du 22/07 : M11 avait oublié, Paul a cru à un cache)

- analyse_logique **2.0.0 → 2.1.0** · dictee **2.0.0 → 2.0.1** · worktrack **2026-07-23a → 2026-07-27a**.
- Vérifié à l'écran : pastille dictee affiche **v2.0.1** (capture `DU_accueil_bureau`) ; pastille analyse_logique affiche **v2.1.0** (toutes captures prof). worktrack : valeur confirmée dans le fichier livré (`content="2026-07-27a"`, source unique lue par la pastille et par « Publier »).

## 7. HARNAIS — LECTURE SEULE STRICTE

- `@sparticuz/chromium` (npm) + `puppeteer-core`, page servie en HTTP local (pas de `file://`).
- **Deux ceintures anti-écriture** : (a) interception réseau — tout PUT/POST/PATCH/DELETE vers le hub avorté et journalisé ; (b) shim JS injecté avant le boot — `set/update/remove/push/setWithPriority/transaction` remplacés par des no-op journalisés (couvre le canal WebSocket que l'interception réseau ne voit pas).
- Résultat : **zéro écriture hub**. Le shim a même intercepté et avorté l'écriture automatique du manifeste (`set` sur `manifestes/analyse_logique`) sans faire planter l'app. Fixtures GET réelles du hub utilisées (voir §8).

## 8. PARCOURS JOUÉS — chaque capture accompagnée de l'ÉTAT MESURÉ (une capture n'est pas une preuve)

Toutes les captures aux deux tailles (**téléphone 380 px** et **bureau 1280 px**), **écrans professeur compris** (Paul travaille au téléphone). Aucune prise en mode test (le mode test n'a pas été activé — il aurait fallu écrire au hub, interdit ici).

### Parcours A — Modifier un travail vierge (capture `AL_prof_modifier_bureau`/`_tel`)
- **État mesuré** (fixture réelle `analyse_logique/travaux/qfqfq-3e-charles-de-gaulle`) : titre `qfqfq`, classe `3E Charles de Gaulle`, published=true, texte `qfqfq`, base 20 ; **results = 0 copie, corrigé = absent, barème propre = absent**.
- **Attendu** : `_texteVerrou = (0>0 || false) = false` → champ texte ÉDITABLE.
- **Capture** : modale « Modifier le travail », champ « Texte à analyser » éditable (non grisé), case « Publié » cochée. **C'est exactement le travail que Paul disait inamovible** : il est désormais modifiable ET supprimable.

### Parcours B — Modifier un travail AVEC copies (texte verrouillé)
- Le code : `_texteVerrou = (nbCopies>0 || aCorrige)`. Sur un travail à copies, le `<textarea>` texte est rendu `readOnly disabled` avec le motif orange « Texte verrouillé : N copie(s) évaluée(s)… Le modifier décalerait les corrections. » Les autres champs restent libres.
- Non joué à l'écran (aucun travail réel n'a de copies + il aurait fallu en fabriquer, donc écrire au hub). La branche est prouvée par lecture du code (diff §3.3) et par le dénombrement réel du parcours A qui exerce le même `once("value")`.

### Parcours C — Dupliquer
- Le code lit `config`, forge un id neuf, écrit `{...config, titre:"… (copie)", published:false}` **sans** `results`/`corrige`. Non exécuté à l'écran (écriture hub interdite) ; prouvé par le diff. La copie naît non publiée pour ne pas surgir chez les élèves.

### Parcours D — Supprimer avec archive prouvée + refus si l'archive échoue (capture `AL_prof_supprimer_bureau`/`_tel`)
- **État mesuré** : dénombrement affiché dans la modale = « 0 copie(s) d'élève évaluée(s) · aucun corrigé · pas de barème propre » — conforme à la fixture réelle.
- **Capture** : modale « Supprimer le travail », mention explicite « Une copie complète part d'abord à la corbeille… Si l'archivage échoue, la suppression est abandonnée », bouton rouge « Archiver puis supprimer ».
- **Refus si archive échoue** : `versCorbeille` ne retire la source qu'après un `set` réussi (`if(err){cb(err);return;}` avant `srcRef.remove()`) ; `confirmerSuppression` teste `if(err)` et affiche « Archivage REFUSÉ — suppression abandonnée, le travail est intact » sans rien détruire. Prouvé par lecture du code (patron `delChapter` M13, adapté au contrat `data` du site).

### Parcours E — Deep-link vers un travail autorisé (capture `AL_deeplink_autorise_bureau`/`_tel`)
- **État** : session élève réelle injectée = AUDEBERT Elise (roster réel de 3E Charles de Gaulle, 29 élèves), URL `?travail=qfqfq-3e-charles-de-gaulle`.
- **Capture** : l'app arrive sur « Mes analyses », le travail `qfqfq` visible (publié + sa classe), sans bannière de refus. **URL nettoyée** après boot (`…/analyse_logique.staging.html`, plus de `?travail=`).

### Parcours F — Deep-link vers un travail non accessible (capture `AL_deeplink_refus_non_publie_bureau`/`_tel`)
- **État** : même session, URL `?travail=inexistant-xyz`.
- **Capture** : bannière sobre « Ce travail n'est pas encore ouvert. Tu le retrouveras ici dès qu'il le sera. » puis l'accueil normal. Le contenu d'un travail non autorisé n'est jamais exposé. URL nettoyée.
- La distinction « autre classe » (texte `eleve_lien_autre_classe`) suit la même mécanique : `cfgCible.classe !== ma classe` → ce second message. Non joué faute d'un travail réel d'une autre classe accessible en lecture, mais prouvé par le diff.

### Parcours G — Sous-onglet « 🧪 Outils » (capture `AL_prof_outils_bureau`, `AL_corbeille_bureau`)
- **Capture** : l'onglet Réglages présente désormais « Référentiel · Barème · **🧪 Outils** · 🛠 Développement » ; « 🧪 Outils » ouvre Mode test / Test d'intégrité / Textes de l'app / Corbeille / Accès professeur. Le doublon « Réglages → Réglages » a disparu.

## 9. ZÉRO ÉCRITURE HUB

Confirmé par les deux ceintures du §7. Journaux : seule tentative captée = l'écriture automatique du manifeste (`publierManifeste`), avortée. Aucune écriture émise par les parcours.

## 10. TEXTES D'INTERFACE — SOUMIS, décidés par la conscience, appliqués tels quels

- Sous-onglet : « 🧪 Outils » (décision de Paul au prompt).
- Deep-link refusé : « Ce travail n'est pas encore ouvert. Tu le retrouveras ici dès qu'il le sera. » (non publié) et « Ce travail ne fait pas partie des tiens. Voici tes analyses. » (autre classe) — décisions de Paul, versées au dictionnaire (pt 26), donc éditables sans nouvelle livraison de code.

## 11. CE QUI N'A PAS ÉTÉ TOUCHÉ (hors périmètre)

Mode test incomplet d'`analyse_logique` (M-MODETEST, après M-SÉCU) ; corrigé IA en JSON (dette distincte) ; toute faille de sécurité (constatée, versée à M-SÉCU 6-10/08). Aucune réécriture de masse : coutures ciblées seulement.

## 12. DETTE OUVERTE PAR / RÉVÉLÉE PENDANT CE LOT

- **worktrack** : les archives déjà écrites en production depuis le 23/07 (avant la couture ⑤) portent `contenu:` et resteront non restaurables depuis le site même après cette livraison — seule une migration ponctuelle `contenu→data` des entrées existantes les récupérerait.
- **analyse_logique** : les anciennes entrées de `analyse_logique/corbeille` (format local) restent lisibles/restaurables depuis l'app (tolérance) mais invisibles du site — c'est voulu (on ne migre pas de force). Elles s'éteindront naturellement.

## 13. RAPPELS DE DÉPLOIEMENT

Après promotion : **déployer sur GitHub Pages** (CORS bloque depuis `file://`). worktrack et analyse_logique lisent `/classes` racine et `/corbeille` racine — vérifier que les règles Firebase (M-SÉCU) autorisent ces chemins avant la rentrée.

---

**PROVISOIRE (pt 21).** Signé `[exécutant LOT-COUTURES]`.
