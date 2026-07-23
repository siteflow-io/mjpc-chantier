# LOT-COUTURES — MESURES ET CONSTATS PRÉALABLES

> **CE DOCUMENT N'EST PAS LA LIVRAISON.** Aucune ligne de code n'a été écrite à ce stade.
> Il porte les mesures des bases, deux constats sourcés qui modifient le patron d'une des
> quatre coutures, et les textes d'interface soumis à Paul.
> Le rapport de livraison viendra sous `LOT-COUTURES-rapport.md`, avec `analyse_logique.staging.html`
> et `dictee_universelle.staging.html`.
>
> **PROVISOIRE (pt 21)** — rien n'est réputé fini tant que Paul ne l'a pas déclaré tel.

`[exécutant LOT-COUTURES]` · 23/07/2026

---

## 1. LECTURES FAITES

`docs/MJPC6-1-DISPOSITIF.md` (111 259 o, md5 `139961c89598d176e2f350ede799820e`) — intégralement.
`docs/MJPC6-2-DOCTRINE.md` (71 039 o, md5 `a34f6f58fab1452663684426a633b783`) — intégralement.
`docs/MJPC6-journal.md` (64 804 o, md5 `ddf58f97aa26d1eeb5a9292e2e70ee24`) — entêtes + entrées des 22 et 23/07 (M9, micro-pastille, mode test point de grille, M11, M12, M13).
`docs/MJPC6-3-CHANTIER.md` (96 212 o, md5 `4ec1bdb63643d4a7122a06376795a834`) — fiche `analyse_logique`, dettes M11, morceau M-MODETEST, M-TEST.
Conversation exécutante M13 (`1f04bd3f`) — recherche faite : `delChapter`, mode test, purge vérifiée récupérés.

**La grille est bien répartie sur DEUX documents** (rectification du 22/07) : le point 16bis vit dans la DOCTRINE, les points 17-28 y sont aussi ; le DISPOSITIF porte le circuit, le principe cardinal et le registre des pièges. Les deux ont été interrogés.

## 2. BASES — TOUTES LECTURES GITHUB AUTHENTIFIÉES, TAILLE + md5 VÉRIFIÉS

| Fichier | Taille mesurée | md5 mesuré | Attendu | Verdict |
|---|---|---|---|---|
| `analyse_logique.html` | 522 047 o · 3 107 lignes | `93fb6e32fa4243afd2fc344fc9bca510` | idem (prompt) | ✅ **conforme**, `APP_VERSION = "2.0.0"` |
| `dictee_universelle.html` | 1 956 829 o · 10 616 lignes | `f8362a876ceefe1dc1e6d7f668f00848` | non fourni | ⚠ **déclaré** — voir §2bis |
| `index.html` *(lecture seule, contrat corbeille)* | 393 791 o | `c09a8bff758ed368b22c4e24c245be46` | M12 v8.5.0 | ✅ conforme au journal |
| `worktrack.html` *(lecture seule, patron M13)* | 1 017 258 o | `9bd370fb43940b9cba9ba495d5cf2eb1` | M13 promu 23/07 | ✅ conforme au journal |

Fichiers > 1 Mo (`dictee_universelle`, `worktrack`) téléchargés par `git/blobs/<sha>`. Aucune lecture par `raw.githubusercontent.com`. Aucun fichier de 279 o reçu.

### 2bis. Écart déclaré sur `dictee_universelle`

Le journal porte deux md5 pour ce fichier : `69e80bf833e255a76e011af30f8c6bd6` (M9, 1 956 871 o) puis `afdf2820f1955f288f32d4ad97ca9682` (micro-pastille, commit `6783936dcd`). **Ma mesure du 23/07 donne `f8362a876ceefe1dc1e6d7f668f00848`, 1 956 829 o** — un troisième état. Une livraison postérieure au journal existe donc. Constat neutre, sans conséquence sur ce lot (la couture ④ est ponctuelle et s'ancre sur une fonction que je re-mesure au moment du patch), mais **le journal n'est pas à jour sur ce fichier**.

## 3. CONSTAT ① — LE PATRON M13 N'EST PAS RESTAURABLE : IL ÉCRIT `contenu:`, LE SITE LIT `data:`

**Le contrat**, `index.html` (M12, écran Corbeille) :

- L4464 — `if(meta.chemin && data!==undefined && data!==null) return [{chemin:meta.chemin,valeur:data,libelle:meta.chemin}];`
- L4508 et L4541 — `var canonique=(raw&&typeof raw==='object'&&raw._meta!==undefined&&raw.data!==undefined);`

**Le patron**, `worktrack.html` (M13, promu le 23/07), L7720-7722 :

```js
db.ref("corbeille/"+jour+"/"+cle).set({
  _meta:{ chemin:"plan_de_travail/chapitres/"+id, app:"worktrack", ts:Date.now(), titre:… },
  contenu: JSON.parse(JSON.stringify(ch))
});
```

**Chaîne de conséquences, vérifiable en lecture** : `raw.data === undefined` → `canonique` est faux → l'item est construit en branche brute, où `_meta` est **remplacé par `null`** → `_corbPlanRestauration` reçoit `meta = {}` → `meta.chemin` absent → aucun plan → **le bouton « Restaurer » n'est pas rendu**. Le `_meta.chemin` que M13 a pris soin d'écrire est correct, mais il est inatteignable : l'archive s'affiche en « ancien format », consultable et exportable seulement.

**Ce que j'en fais** : je code contre le **contrat d'`index.html`** (`{_meta:{chemin,…}, data:…}`), non contre la lettre du prompt qui désigne M13 comme patron. Le fond du patron M13 (dénombrement avant, archive avant destruction, abandon si l'archive échoue, nœud entier) est repris intégralement — seul le nom du champ change.

**Dette à ouvrir, hors de mon périmètre** : `worktrack.html` doit passer `contenu:` → `data:`. Une ligne. Je n'y touche pas (le prompt ne me confie pas ce fichier). **Note importante** : les archives déjà écrites par la production depuis le 23/07, s'il y en a, resteront non restaurables même après correction — elles portent le mauvais champ.

## 4. CONSTAT ② — `analyse_logique` N'ÉCRIT PAS DANS LA CORBEILLE DU SITE

Le prompt pose que les deux apps « écrivent en corbeille SANS ce champ ». Mesure faite : c'est exact pour `dictee_universelle`, **inexact pour `analyse_logique`**.

`analyse_logique.html` L1979-1988 :

```js
function versCorbeille(chemin, etiquette, cb){
  …
  db.ref(ROOT+"/corbeille").push({chemin:chemin, etiquette:etiquette||chemin, donnees:v, ts:Date.now()}, …
```

`ROOT` vaut `analyse_logique` : l'archive part dans **`analyse_logique/corbeille`**, pas dans `/corbeille` racine. Le format n'a ni `_meta` ni `data` — les champs s'appellent `chemin`, `etiquette`, `donnees`. L'écran Corbeille du site lit `/corbeille` racine : **il ne voit rien de cette app, et aucun ajout de champ n'y changerait quoi que ce soit.** L'app a son propre écran de restauration dans Réglages (`ReglagesApp`, qui lit `ROOT+"/corbeille"` et restaure par `restaurerCorbeille`, L1989).

**Ce que j'en fais, et pourquoi je tranche sans t'attendre** : le doute est levé par la lecture, pas par un arbitrage. Le patron désigné (M13) écrit à la racine ; le canal de restauration est déclaré **unique** par M12 ; la doctrine dit que toute destruction passe par la corbeille. Les trois convergent. Donc :

- `versCorbeille` écrit désormais dans **`/corbeille/<jour>/<clé>`** au format canonique, avec `_meta.chemin` et `data` ;
- l'écran Réglages de l'app lit la racine, **filtrée sur `_meta.app === "analyse_logique"`** ;
- **tolérance de lecture des anciennes entrées locales** (`analyse_logique/corbeille`) conservée : rien de ce qui est déjà archivé n'est perdu ni rendu invisible ;
- `analyse_logique/corbeille` reste au `preserver` du manifeste tant que d'anciennes entrées y vivent ;
- la purge du mode test nettoie ses résidus **aux deux emplacements**.

**Si tu préfères l'autre voie** (garder la corbeille locale et n'écrire à la racine qu'une seconde ceinture), dis-le : c'est une inversion de deux blocs, pas une reprise.

## 5. ÉTAT COMPARÉ DES TROIS CORBEILLES — mesuré, pour la conscience

| App | Emplacement écrit | Format | `_meta.chemin` | Restaurable depuis le site |
|---|---|---|---|---|
| `index` (site) | `/corbeille/<jour>/<clé>` | `{_meta, data}` | oui | ✅ (c'est lui qui lit) |
| `worktrack` (M13) | `/corbeille/<jour>/<clé>` | `{_meta, **contenu**}` | écrit mais inatteignable | ❌ **constat ①** |
| `dictee_universelle` | `/corbeille/<jour>/<clé>` | `{_meta, data}` | **absent** | ❌ consultation seule |
| `analyse_logique` | `analyse_logique/corbeille` | `{chemin, etiquette, donnees, ts}` | sans objet | ❌ **constat ②** — invisible du site |

## 6. `dictee_universelle` — CE QUE LA COUTURE MINIMALE PEUT ET NE PEUT PAS FAIRE

`duArchiverCorbeille(motif, paths)` (L753-766) archive **N chemins à la fois** sous `data`, chacun sous une clé aplatie (`dictees_<id>_results`…). Trois appelants mesurés :

| Ligne | Motif | Chemins | `_meta.chemin` posable ? |
|---|---|---|---|
| L4194 | `suppression_dictee_<id>` | **1** (`dictees/<id>`) | ✅ oui |
| L6413 | `effacement_<action>_<id>` | 7 | ❌ non — archive multi-emplacements |
| L6441 | `simulation_<id>` | 7 | ❌ non — archive multi-emplacements |

Un `_meta.chemin` posé sur une archive à 7 emplacements ferait restaurer **l'enveloppe aplatie** à la place du nœud : le site écrirait `{dictees_x_results:…, dictees_x_drafts:…}` sous un seul chemin. Ce serait une corruption silencieuse — exactement ce que la règle interdit. La couture est donc **conditionnelle** : `_meta.chemin` et `data` = valeur brute **si et seulement si** `paths.length === 1`. Sinon, format strictement inchangé, et le site continue de proposer consultation + export, ce qui est le comportement honnête.

**Rien d'autre n'est touché dans `dictee_universelle`.**

## 7. `analyse_logique` — CE QUE LA COUTURE ① DOIT NEUTRALISER (point 19, aucun piège assumé)

Structure mesurée d'un travail : `analyse_logique/travaux/<id>` = `{config:{titre,classe,niveau,texte,modeCode,base,coef,consigne,published,ts}, corrige:{retour,modele}, bareme:{dims}, results:{<clé élève>:{analyse,ts}}}`.

**Le piège que « Modifier » ouvrirait si on le codait naïvement** : le champ `texte` est tokenisé par `buildTokens` (L645 et L2018 — deux définitions, invariants du lot), et **tous** les index stockés dans `results/<élève>/analyse` et dans `corrige.modele` désignent des positions de tokens **dans ce découpage-là**. Modifier le texte après qu'une copie ou un corrigé existe décale silencieusement les corrections sur les mauvais mots — c'est la faute documentée sept fois au point 27 (« la tokenisation est un contrat »).

**Neutralisation par le code, pas par un avertissement** : le champ `texte` se verrouille dès qu'il existe au moins une copie ou un corrigé, avec un motif affiché ; les autres champs (titre, classe, note sur, coefficient, mode, consigne) restent librement modifiables. Un travail vierge se modifie entièrement.

**Suppression** : dénombrement AVANT (copies, corrigé, barème), archive du nœud **entier** en corbeille AVANT destruction, **abandon si l'archive échoue**, confirmation par la modale de l'app (`.m11-modal`, L446-447) — jamais `confirm()` natif.

**Duplication** : coût faible (recopie de `config`, nouvel identifiant, sans `results` ni `corrige`) → livrée.

## 8. TEXTES D'INTERFACE — SOUMIS, NON DÉCIDÉS

### Couture ② — le sous-onglet homonyme

`analyse_logique.html` L2227 : `["reglages","Réglages",[["referentiel","Référentiel"],["bareme","Barème"],["reglages_app","Réglages"],["todo","🛠 Développement"]]]`.

Contenu réel du sous-onglet : mode test · test d'intégrité du comptage · textes de l'app · corbeille · accès professeur.

- **A · « Outils »** — court, dit l'usage, ne recouvre aucun autre sous-onglet.
- **B · « Mode test & corbeille »** — nomme les deux choses effectivement cherchées (constat du 22/07 : le mode test est introuvable).
- **C · « L'application »** — oppose les réglages *de l'app* aux réglages *pédagogiques* (Référentiel, Barème).

**Valeur provisoire livrée : B.** Une ligne à changer.

### Couture ③ — le refus de deep-link, texte élève

Quand l'URL désigne un travail que l'élève ne peut pas ouvrir (non publié, ou d'une autre classe), l'app ouvre l'accueil et le dit sobrement. **Trois propositions**, toutes conformes au principe cardinal (jamais le professeur en sujet d'une négation) et au test du collégien :

- **A ·** « Ce travail n'est pas encore ouvert. Tu retrouveras ici tes analyses dès qu'il le sera. »
- **B ·** « Ce lien ne correspond à aucun travail de ta classe. Voici tes analyses. »
- **C ·** « Ce travail s'ouvrira plus tard. En attendant, voici tes analyses. »

**Valeur provisoire livrée : A** — vraie dans les deux cas (non publié / autre classe) sans désigner personne. À ton arbitrage : le champ rejoindra le dictionnaire de textes (pt 26), donc éditable ensuite sans livraison de code.

## 9. CE QUI N'EST PAS À MOI — vérifié, non touché

Le mode test de l'app (morceau **M-MODETEST**, calé après M-SÉCU) : entrée en plusieurs gestes, pas de retour depuis l'élève incarné, pas de guidage, sortie non propagée aux autres onglets, **purge qui n'examine pas les refus du serveur** (mesurée : `purgerModeTest` enchaîne ses gestes par callbacks sans lire d'erreur). Le corrigé IA en JSON (dette distincte). Toute faille de sécurité se constate et se verse à **M-SÉCU (6-10/08)**.

## 10. CE QUI EST FAIT / CE QUI RESTE, SANS ENJOLIVER

**Fait** : lectures intégrales · bases mesurées et vérifiées · contrat de la corbeille du site établi sur pièces · deux constats sourcés · pièges de la couture ① identifiés avant d'écrire une ligne · textes soumis.

**Non fait, et donc non promouvable** : les quatre coutures. Aucun `.staging.html` n'existe. Aucun parseur n'a tourné. Aucune capture n'a été prise. Aucun parcours n'a été joué.

**Zéro écriture hub** : aucune requête autre que `GET` n'a été émise vers `mjpc-hub` à ce stade.
