# SITE-COURS-2b — CADRAGE (TEMPS 1)
**Exécutant sous conscience n°5 · mardi 04/08/2026, 16h55 (heure vérifiée sur deux sources : en-tête `date:` de l'API GitHub + horloge conteneur, concordantes : 14h55 UTC).**
**VERSION À COMPLÉTER — soumise à la conscience. Rien n'est codé.**

---

## 0. ÉTAT MESURÉ AU MOMENT DU CADRAGE

- **Production `index.html`** : 729 520 octets · md5 `1d7732e09561ba828dc15897ae6e6601` · sha blob `23678568649e36ec7c4768d5ed0b0d04b73462c2` · pastille `APP_VERSION="8.27.1"` datée 2026-07-30. *(Ce md5 date du cadrage ; conformément à la règle du 29/07, la base sera RE-TÉLÉCHARGÉE depuis la production à l'instant de l'édition au TEMPS 2, et son md5 déclaré à ce moment-là.)*
- **Sas `mjpc-chantier`** : propre (README.md seul).
- **Conteneur** : vierge à la prise de fonction (aucun fichier antérieur à figer).
- **Outillage de mesure** : les tailles/md5 de fonctions ci-dessous sont établis par **parse acorn** (extraction AST des blocs `<script>`), pas par regex. Mon premier extracteur naïf (équilibrage d'accolades) a déraillé sur les littéraux regex contenant des backticks (`atIAModifier` mesurée 18 545 o à tort, 1 660 o réels) — il est écarté ; acorn fait foi.

## 1. CONSTATS VÉRIFIÉS SUR PIÈCES (mes mesures, refaites)

### 1a. L'adresse vit aujourd'hui à DEUX endroits, incohérents entre eux
1. **`doc.rattachement`** = `{niveau, classe, classeNom, eleve}` — des **sélecteurs** (`atHtmlRattachement`, 1 654 o). Ni chapitre ni séance n'y figurent.
2. **Les composantes d'affichage `chapitre` et `seance`** (famille A, en-tête, lignes 6048-6049) = **saisie libre** `CH('texte','Chapitre')` / `CH('texte','Séance (n° et titre)')`. Le constat de la doctrine (§ADRESSE, 29/07) est exact.

### 1b. La feuille de recette, lue au hub
`site/atelier/documents/feuille_1785850139338` — titre « Tâche finale — Questionnaire "L'Étranger" (version standard) », produit `fiche_seance`, versionDoc 32.
- `rattachement` : `{niveau:"3e", classe:"", classeNom:"", eleve:"*"}` — **incomplet** (élève « toute la classe » sans classe choisie ; pas d'adresse chapitre/séance, le modèle ne la porte pas).
- `valeurs.chapitre.texte` = « Chapitre 1 — Poésie et peinture au XIXe siècle » · `valeurs.seance.texte` = « Séance 8 — Tâche finale » — **textes libres**, retapés par Paul.
- **Correspondance dans le hub, vérifiée** : 3e → chapitre 1 « Poésie et peinture au XIXème siècle » (nota : « XIXème » au hub, « XIXe » sur la feuille — exactement la divergence orthographique que la cascade supprime) → séance 8 `{ordre:8, title:"Tâche finale", type:"tache_finale"}`. **La séance 8 existe mais `items:[]` — elle n'a AUCUN item** : le cas de recette ④ passera par la création d'un item (geste EXISTANT de l'arborescence, `addItem` ligne 3399 — vérifié) avant le LIER.

### 1c. La structure du hub (lecture seule, mesurée le 04/08)
- `/site/<niveau>/chapitres` : 3e = 9 chapitres · 4e = 3 · 5e = 1 · 6e = 1.
- Chapitre = `{ordre, published, seances, title}`. `seances` revient de Firebase en **TABLEAU CREUX** (clés numériques denses → index 0 = `null`, séances aux index 1..n). Séance = `{ordre, title, type, published(par classe), items?}`. Item = clé textuelle → `{icon, kind, ordre, published, ref, source, subtitle, title}`.
- **Cas limites RÉELS présents dans les données** : 3e ch9 « Chapitre facultatif » **sans séance** ; 4e ch2 et ch3 **sans séance** (état normal de préparation, doctrine §XII).
- `sanitizeChapitres` (1 023 o) normalise déjà cette forme côté site — la cascade la réutilise, elle n'invente rien.

### 1d. Le chargement des chapitres N'EST PAS GARANTI dans l'atelier
`chapitresData[level]` n'est rempli que par `loadPublished(level)` (ligne 2948), appelé à la navigation par niveau. `atelierOuvrir` (686 o) charge **classes + codes, pas les chapitres**. Si Paul ouvre l'atelier et choisit « 4e » sans avoir visité la page 4e, la cascade n'a rien à afficher. → Il faut un chargement dédié, en lecture seule (voir §2-C).

### 1e. `atIAAppliquer` — précision de mesure sur le mandat
Le prompt de mission dit « `atIAAppliquer` écrit aussi ces champs ». **Mesuré (986 o)** : elle n'écrit PAS `doc.rattachement` — elle recopie `o.valeurs`, donc **`valeurs.chapitre.texte` / `valeurs.seance.texte` si l'IA les remplit**. C'est bien un chemin d'écriture de l'adresse AFFICHÉE, sans aucune validation aujourd'hui : la règle ② s'y applique. Ma mesure fait foi sur le mécanisme exact ; l'esprit du mandat est confirmé. Contrainte structurelle relevée : **le JSON IA ne porte ni niveau ni rattachement** (titre/produit/cases/valeurs/blocs seulement) — la validation d'une adresse IA n'a donc de référentiel que le niveau de la feuille COURANTE (voir §2-E).

### 1f. Le bouton LIER, lu sur pièces
- Modale HTML lignes 1320-1360 : 1 section URL/Drive + 7 sections d'apps (dictée, réécriture, QCM, débat, analyse logique, applaudimètre, worktrack).
- `openLinkModal` (1 388 o) · `applyLinkChanges` (1 231 o — écrit `source`/`ref`(/`kind`) en LOT via `mjpcLot`, verdicts M-ÉCHECS-1) · `linkModalApplyUrl` (715 o) · `linkModalApplyApp` (262 o) · `linkModalUnlink` (239 o) · `loadAppList` (1 663 o) · `closeLinkModal` (124 o).
- `openItem` (2 762 o) route par `(kind, source)` ; sources existantes : `drive`, `external`, `html`, `firebase_app`. `CH_SOURCES` (ligne 6942, validation du chapitre IA) = ces 4.
- **Le rendu d'un document d'atelier existe déjà** : `atelierDocumentHTML` (6 255 o) + `atelierPageHTML` (765 o) produisent le HTML autonome servi à l'aperçu et à l'impression. La 3e source n'a pas de moteur de rendu à inventer, seulement une route d'ouverture.

### 1g. Autres mesures de référence (acorn, base du 04/08)
`atSetRatt` 487 o · `atRendreEditeur` 2 439 o · `atHtmlCase` 903 o · `atBlocEdition` 796 o · `atIAValider` 3 435 o · `atIAVerifier` 1 194 o · `atIAInjecterNeuve` 222 o · `atIARemplacerConfirme` 820 o · `atOuvrirDoc` 854 o · `atDocNeuf` 454 o · `atEnregistrerMaintenant` 689 o · `renderChapitres` 2 758 o · `_sitePut` 633 o · `_siteGet` 287 o · `mjpcLot` 866 o · `atelierOuvrir` 686 o · `m8TestOn` 47 o. Les md5 complets sont dans mon relevé ; ils seront REFAITS sur la base re-téléchargée au TEMPS 2.

---

## 2. PLAN DE CODAGE

### A. Le modèle — deux clés nouvelles dans le rattachement
`doc.rattachement` gagne `chapitre` (clé du chapitre au hub, ex. `"1"`) et `seance` (index de séance, ex. `"8"`), plus les libellés dérivés `chapitreTitre` et `seanceTitre` écrits **à la sélection** — patron EXACT de `classeNom` déjà en place dans `atSetRatt`. La source de vérité est le couple de numéros ; les libellés sont l'affichage.
*Point de vigilance déclaré : un chapitre renommé dans l'arborescence APRÈS la sélection laisse un libellé périmé sur la feuille jusqu'à re-sélection. Proposition : au rendu de l'éditeur, si `chapitresData[niveau]` est chargé, le libellé affiché se recalcule depuis le hub (l'écran est à jour, le stocké est le secours hors ligne). À valider par la conscience.*

### B. La cascade dans `atHtmlRattachement` + `atSetRatt`
Après les sélecteurs niveau/classe/élève existants : **deux selects** — chapitre (chapitres du niveau, triés par `ordre`, libellé « n. titre ») puis séance (séances du chapitre, triées par `ordre`, libellé « Séance n — titre »).
- Niveau vide → chapitre et séance vides-inactifs (« — chapitre — »).
- **Chapitre sans séance** (3e ch9, 4e ch2/ch3 — cas réels) → select séance avec la seule mention « — aucune séance dans ce chapitre — », non bloquante : la feuille peut rester adressée au chapitre seul.
- Changement de niveau → remise à zéro chapitre + séance (patron existant : `k==='niveau'` vide déjà `classe`). Changement de chapitre → remise à zéro séance.
- Rien d'obligatoire : une feuille peut rester sans adresse (fiches transversales) — **aucun blocage, conformément à ⑤**.

### C. Le chargement — `atChargerChapitres(niveau, cb)`, nouvelle fonction, LECTURE SEULE
`fetch` de `/site/<niveau>/chapitres.json`, passage par `sanitizeChapitres` (la MÊME normalisation que le site — aucun second parseur), rangement dans `chapitresData[niveau]` (cache partagé : si déjà rempli par la navigation, pas de re-fetch). Aucune écriture, aucun effet de bord de `loadPublished` (pas d'`applyPublished`, pas de rendu de page).
- **Hub muet** (fetch en échec) → la cascade affiche « La liste des chapitres n'a pas pu être lue — réessaie quand la connexion est stable » et les selects restent inactifs ; la feuille reste éditable pour tout le reste. Rien de bloquant.
- **Mode test** : les chapitres se LISENT en réel (lecture seule, sans danger) ; `M8_TEST_STORE` ne porte pas d'arborescence de test. Déclaré comme limite (voir §4).

### D. Les composantes `chapitre` et `seance` passent sous le flux Windows
Décision ② de Paul, appliquée telle quelle : leurs champs texte deviennent **en lecture seule hors cascade**. À la sélection dans la cascade, `atSetRatt` remplit `valeurs.chapitre.texte` (« Chapitre n — titre ») et `valeurs.seance.texte` (« Séance n — titre ») et coche les cases correspondantes si le produit les prévoit. Dans l'éditeur (`atHtmlCase`/`atBlocEdition`), ces deux champs s'affichent avec `readonly` et la mention en français : « Cette ligne suit l'adresse de la feuille — elle se règle dans les menus ci-dessus ; les titres se renomment dans l'arborescence du site. » Le rendu du document (`atelierDocumentHTML`) est INCHANGÉ : il lit les valeurs comme avant.
*(Décochage : la case reste décochable — afficher ou non le chapitre sur la feuille reste un choix de composition ; seul le CONTENU du texte suit l'adresse.)*

### E. `atIAAppliquer` / `atIAValider` — l'adresse IA se valide, refus nommé
- `atIAVerifier` devient orchestrateur : si `o.valeurs.chapitre` ou `o.valeurs.seance` sont présents ET qu'un niveau est connu (`AT.doc.rattachement.niveau` pour un Remplacer ; pour une feuille neuve, aucun niveau n'existe), il charge d'abord les chapitres du niveau (`atChargerChapitres`) puis valide.
- **Validation** : correspondance sur le numéro OU sur le titre exact (comparaison en codepoints après trim — l'écart « XIXème/XIXe » du cas réel sera un REFUS NOMMÉ, c'est voulu : la machine ne devine pas). Échec → erreur accumulée dans `atIAValider`, message qui NOMME et LISTE : « Le chapitre « X » n'existe pas en 3e. Chapitres existants : 1. Poésie… ». L'injection est refusée comme pour tout identifiant inconnu — patron existant.
- **Feuille neuve sans niveau** : l'adresse IA est refusée avec le message « L'adresse d'une feuille se choisit dans la feuille (menus déroulants), pas par l'IA » — formulation soumise.
- **Hub muet pendant la vérification** : refus nommé « La liste des chapitres n'a pas pu être lue — réessaie… » (jamais d'adresse invérifiée écrite).
- **Réussite** : `atIAAppliquer` écrit alors le rattachement (numéros + libellés du HUB, pas ceux de l'IA) ET les valeurs d'affichage. La machine conseille, les données réelles décident.
- **Prompts** : les composantes `chapitre`/`seance` reçoivent un marqueur (`adresse:true`) et la liste `@@COMPOSANTES@@` générée les présente comme « ne pas remplir : l'adresse se choisit dans la feuille » — la liste reste générée depuis le schéma, aucune table à maintenir.

### F. Le bouton LIER — troisième source « un document de l'atelier »
- Modale : nouvelle section « 📄 Un document de l'atelier » — select des feuilles (chargé par `atSiteGetDocs` : titre + type de produit + date de modification), bouton Lier → `applyLinkChanges('atelier', docId, null)`. `kind` n'est pas écrit (le lot existant ne pousse `kind` que s'il est fourni — vérifié) ; l'item garde son `kind` (`doc` par défaut à la création).
- `openLinkModal` : sous-titre passant de « 4 sections » à la formulation à jour (texte soumis) ; libellé de liaison actuelle : cas `source==='atelier'` → « 📄 Feuille : <titre> ».
- `openItem` : nouvelle route `src==='atelier'` (par source seule, comme drive/external) → **viewer de feuille** : lecture du document au hub (`/site/atelier/documents/<id>`), rendu par `atelierPageHTML` existant, affiché dans le viewer du site (patron du diaporama/galerie : contenu interne, pas d'URL externe — mécanisme exact à confirmer à la lecture d'`openDiaporamaById` au TEMPS 2). Contexte élève : si la feuille est rattachée `eleve:'*'` et qu'un élève est connecté, son nom passe en `ctxEleve` ; sinon rendu générique. **Un lien sans ouverture serait un piège assumé (point 19) — l'ouverture minimale est DANS le périmètre.**
- Item supprimé ou feuille supprimée après liaison : l'ouverture d'une ref morte affiche un message doux (« Ce document n'est plus disponible ») — cas limite couvert au banc.
- `CH_SOURCES` (validation du chapitre IA) n'est PAS touché : une IA n'a pas à inventer des identifiants de feuilles. Déclaré hors périmètre.
- **`published` n'est jamais écrit par ce morceau** (⑤) : le LIER n'écrit que `source`/`ref`, comme aujourd'hui.

### G. Ce qui n'est PAS touché
`atRendreEditeur` (appelle `atHtmlRattachement`, inchangé sauf si une retouche d'appel est inévitable — auquel cas mesurée), le rendu élève des chapitres, la publication, les prompts de chapitre (`chInjecter`…), le socle MJPC-CORE, les autres apps. **0 fonction supprimée attendue.**

### H. Pastille
`APP_VERSION` 8.27.1 → **8.28.0** (mécanisme nouveau, pas un correctif).

---

## 3. ÉCRANS ET FONCTIONS TOUCHÉS (tailles de base mesurées)

| Fonction | Base (o) | Geste |
|---|---|---|
| `atHtmlRattachement` | 1 654 | modifiée — cascade chapitre/séance |
| `atSetRatt` | 487 | modifiée — clés + libellés + resets + valeurs dérivées |
| `atHtmlCase` | 903 | modifiée — readonly des champs adresse |
| `atBlocEdition` | 796 | modifiée — même règle si les champs y passent (à confirmer sur pièces au TEMPS 2 : chapitre/seance ne sont pas `multiple`, `atBlocEdition` pourrait être hors chemin — mesure avant geste) |
| `atIAVerifier` | 1 194 | modifiée — orchestration asynchrone |
| `atIAValider` | 3 435 | modifiée — validation d'adresse, messages nommés |
| `atIAAppliquer` | 986 | modifiée — écriture du rattachement validé |
| `openLinkModal` | 1 388 | modifiée — section atelier + libellé de liaison |
| `applyLinkChanges` | 1 231 | inchangée attendue (l'appel `('atelier',docId,null)` passe tel quel) — vérifiée à l'octet |
| `openItem` | 2 762 | modifiée — route `atelier` |
| HTML modale (l. 1320-1360) | — | modifié — section nouvelle, boutons ancrés (≥ 44 px, règle 02/08) |
| `atChargerChapitres` | — | **nouvelle** (lecture seule) |
| `loadAtelierDocList` | — | **nouvelle** (peuple le select de la modale) |
| viewer feuille (`openAtelierDoc`…) | — | **nouvelle** (rendu par `atelierPageHTML` existant) |
| `ATELIER_COMPOSANTES` chapitre/seance | — | marqueur `adresse:true` |
| `APP_VERSION` | 8.27.1 | → 8.28.0 |

Chaque fonction modifiée sera relue EN ENTIER après édition et sa taille comparée avant/après (règle du 04/08) ; toute ancre vérifiée par PORTÉE et unicité (le socle n'est pas contigu, marqueurs en double CSS/JS — ancrage contextuel).

## 4. CAS LIMITES (tous instruits au banc)

1. **Chapitre sans séance** — réels : 3e ch9, 4e ch2/ch3 → mention non bloquante, feuille adressable au chapitre seul.
2. **Hub muet** — cascade inactive + message ; validation IA → refus nommé ; le reste de la feuille vit.
3. **Feuille sans adresse** — toutes les feuilles existantes (1 seule au hub à ce jour) : cascade vide à l'ouverture, rien ne casse, adresse posable après coup (= recette ④).
4. **Adresse IA inexistante** — refus nommé listant les chapitres réels ; « XIXème vs XIXe » du cas réel en est la démonstration vivante.
5. **Feuille neuve + adresse IA** — pas de niveau de référence → refus nommé.
6. **Séance visée sans item** (recette : 3e/ch1/s8, `items:[]`) — le LIER exige un item : création par le geste EXISTANT `addItem`, montrée dans la recette.
7. **Ref de feuille morte** (feuille supprimée après liaison) — message doux à l'ouverture.
8. **Tableau creux Firebase** (index 0 `null`) — la cascade passe par `sanitizeChapitres`, même traitement que le site.
9. **Renommage postérieur d'un chapitre** — libellé stocké périmé : recalcul à l'écran quand le hub est chargé (proposition §2-A, à valider).
10. **Mode test** — chapitres lus en réel (lecture seule) ; les écritures de feuille restent intercepteés par `M8_TEST_STORE` comme aujourd'hui.
11. **Apostrophes** — toute comparaison de titres en CODEPOINTS (U+0027 vs U+2019) ; le banc rejouera un titre à apostrophe courbe (« L'Étranger » de la feuille réelle en porte une).

## 5. PLAN DE PREUVE (TEMPS 2)

1. **Base** : re-téléchargement production à l'instant de l'édition, taille + md5 déclarés, comparés au registre de restauration.
2. **Double parseur** : `node --check` + parse script par script (acorn) sur la BASE et sur le LIVRÉ.
3. **Inventaire des fonctions** : communes / modifiées / ajoutées / supprimées (0 attendue), avec **taille avant/après de chaque modifiée** (règle du 04/08).
4. **Banc navigateur par le CHEMIN RÉEL** (clics, jamais d'appels directs) — page servie en HTTP local (`python3 -m http.server`), **écritures interceptées et journalisées** (shim sur fetch/PUT : AUCUNE écriture ne part vers le hub réel ni la production). Parcours joués :
   - ouvrir l'atelier → feuille neuve → cascade 3e → ch1 → s8 → champs d'affichage remplis et en lecture seule → enregistrer (intercepté, journalisé) ;
   - cas ④ REJOUÉ : ouvrir la copie de `feuille_1785850139338` (données réelles injectées au banc) → poser 3e/ch1/s8 par la cascade → enregistrer → panneau prof 3e → créer un item en séance 8 (`addItem`) → LIER → section « document de l'atelier » → choisir la feuille → lier (intercepté) → ouvrir l'item → la feuille se rend ;
   - chapitre sans séance (3e ch9) · hub muet (fetch coupé) · JSON IA avec chapitre inexistant (refus nommé affiché) · JSON IA avec adresse exacte (rattachement écrit) · délier.
5. **Journal réseau** livré : aucune écriture hors des nœuds attendus ; en banc, aucune écriture réelle du tout.
6. **Captures** desktop ET 390 px, d'office : cascade (3 états), champs en lecture seule, modale LIER avec la 3e section (boutons ancrés, cibles ≥ 44 px, contenu défile / actions non), refus nommé IA, item lié ouvert. Toute capture en mode test légendée comme telle.
7. **Pastille** incrémentée, visible sur capture.
8. **Codepoints** : test dédié apostrophe droite/courbe sur la comparaison de titres.

## 6. CE QUE MON BANC NE COUVRE PAS (déclaré d'avance)
- Le TEMPS RÉEL multi-appareils (polling REST, pas de websocket) — sans objet direct ici (aucun mécanisme temps réel ajouté), mais dit.
- Les vraies polices, le vrai Chrome Android, le clavier mobile — les captures 390 px sont un viewport, pas un téléphone.
- La CHARGE (30 élèves ouvrant des items liés).
- L'écriture RÉELLE au hub : le banc intercepte tout ; la première écriture vraie sera celle de Paul en production après « promeus ».
- Les parcours que je n'imagine pas — le test de Paul en aval reste le filet.

## 7. QUESTIONS AU FIL (aucune ne bloque le cadrage ; réponses au feu vert)
1. §2-A : recalcul du libellé à l'écran quand le hub est chargé (proposé OUI) ?
2. §2-D : formulation exacte de la mention des champs en lecture seule (texte soumis).
3. §2-F : mécanisme du viewer — je confirme le patron exact à la lecture d'`openDiaporamaById` sur pièces au TEMPS 2 (lecture faite avant tout code, mesure déclarée).

---
**STOP — TEMPS 1 livré. J'attends le feu vert de la conscience avant tout code.**
