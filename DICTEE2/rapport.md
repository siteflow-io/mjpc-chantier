# DICTEE2 — La copie quand la faute n'a pas été saisie

**Base** : production `correction_dictee.html`, 589 922 o, md5 `f62be8d5f89c5a5a9d3729ada5b7aaa9` (vérifiée).
**Livraison** : `DICTEE2/correction_dictee.html`, 594 421 o, md5 `32eddd4a4bd1100e3632ab7515dc1acf`.

## Le défaut, prouvé sur les données réelles (BASE, capture `capture-00-defaut-base.png`)

Sur la copie réelle d'ALOYEAU Elyse (dictée 4e Banksy, 14 erreurs, aucun `fautif`) :
« Il se tortilla en tremblant ~~Hors~~ *hors* du sac », « du ventre du caddie~~Caddie~~ » — et au détail « Essai retenu : *Hors* ».

Deux mécanismes, mesurés :

1. **`displayTranscript` piochait l'historique d'autocorrection** : sans `fautif`, il prenait le **dernier** essai (`chain[chain.length-1]`). Or le dernier essai est presque toujours le mot juste, puisque l'autocorrection s'achève quand l'élève trouve (mesuré : `history[0]` d'Elyse = `[{ok:true, typed:"Hors"}]`). D'où le mot correct barré dans le texte et présenté comme « essai » au détail.
2. **Découverte en cours de banc — les `idx` de la 4e ne pointent plus les bons jetons.** Mesure : 5e Hergé **547/547** idx exacts ; 4e Banksy **22/358** seulement (l'erreur « caddie » pointe le jeton « . », « courut » pointe « (…) »…). Cette dictée a été corrigée sous une indexation antérieure. Conséquence visible en production : le **point de « du caddie. Il s'approcha » disparaissait** (absorbé dans le mot fautif) et, en BASE, une erreur décalée écrasait « ce » (« Est- Abandonner » au lieu de « Est- ce »). Sans traitement, les trous numérotés seraient tombés aux mauvais endroits sur la dictée pilote du correctif.

## Ce qui a été fait

### ① Trou numéroté quand `fautif` est absent
Types G/L/I/A sans `fautif` → un espace pointillé portant un numéro (1, 2, 3… dans l'ordre du texte), visible **dans tous les modes** d'affichage (y compris « Vert direct » : le mot correct n'apparaît jamais dans le corps du texte). Badge de type et points conservés. M et P sont inchangés (leur rendu existant ne barre rien).

### ③ Point d'accroche M16
Chaque trou (dans le texte **et** au détail) porte `data-trou="N"` ; la numérotation est stable (ordre du texte). **Aucune question, aucun renvoi, aucune règle n'ont été codés.**

### ④ Détail des erreurs
- « Essai retenu : … » **supprimé** : sans `fautif`, on ne prétend pas savoir ce qui a été écrit (l'historique d'autocorrection n'est plus jamais une source de transcript).
- Les erreurs à trou portent **le numéro de leur trou** (carré pointillé, même graphie que le trou).
- **Collision découverte et traitée** : chez CADIOU-FOURRIER Louann (36 trous + 3 M/P), les M/P au rang de liste (3, 6, 9) entraient en collision avec les trous 3, 6, 9 — deux « 3 » différents dans la même liste. Dans une copie **avec** trous, les items sans trou prennent une puce neutre « · » (le rang de liste n'est référencé nulle part ailleurs) ; dans une copie **sans** trou, le rang 1, 2, 3… est inchangé.
- Le **mot correct reste affiché au détail**, comme aujourd'hui (« ⌐2⌐ « caddie » LEXIQUE »). Le brief ① ne l'interdit que dans le corps du texte ; décider ce que le bas de copie révèle appartient à M16. Signalé pour arbitrage : tant que M16 n'existe pas, un élève qui lit le détail retrouve les mots (le commentaire d'homophones les cite aussi).

### Alignement au rendu (nouvelle fonction `alignerErreurs`, la seule ajoutée)
Au moment de construire la copie — et seulement là —, chaque `idx` est **vérifié** contre le texte : s'il pointe déjà le bon mot, rien ne bouge (5e : 547/547 exacts, la fonction est neutre) ; sinon le mot est retrouvé **par contenu, dans l'ordre du texte** (4e : 357/358, le dernier — « qu » face au jeton « qu' » — se résout par tolérance d'apostrophe finale : 358/358). Les M/P, absents du texte par nature, suivent le décalage local constaté (approximation prudente, déclarée). **Les données ne sont jamais modifiées** ; le dernier recours reste l'idx brut (comportement d'avant).

### ⑤ Espace avant parenthèse
`tokSp` : une parenthèse **ouvrante** prend un espace avant elle → « fourrure (…) » (vérifié au banc).

## Banc — gestes réels sur les données réelles (hub lu en GET, aucune écriture réelle)

| Scénario | Résultat |
|---|---|
| 4e ALOYEAU Elyse (14 err, 0 fautif) — onglet Copies | trous **1→14**, ordre du texte ; « la » 3 occ. restantes (4−1 trou), « ce » 1 (2−1) : l'occurrence fautive seule a disparu ; point de « du ⌐2⌐. Il » restauré ; « fourrure (…) » ✓ |
| Export autonome ouvert seul | identique : 14 trous, détail 1→14, badges/points |
| Modale élève (portail réel, code banc) | identique : 14 trous, aucune fuite |
| 4e CADIOU-FOURRIER Louann (39 err dont 3 M/P) | 36 trous 1→36 ; M/P inchangés, puce « · » au détail |
| Copie sans faute (RENAULT Adélie) | texte intégral, aucun trou, aucun badge |
| 5e PINEAU Clemence (11/11 fautif) | **diff BASE↔WORK : 2 lignes = le bloc `<style>`** (3 règles CSS ajoutées, inertes sans trou). Corps de copie strictement identique |
| 5e NOUTEAU Quentin (mixte réel : 8 fautif + 4 sans) | fautifs barrés + trous 1→4 côte à côte ; « n' » restant = l'autre occurrence légitime du texte |

`mockWrites` : `set manifestes/correction_dictee` uniquement (publication de manifeste préexistante de l'app). `node --check` : tous les blocs OK. Aucune erreur de page.

## Données de banc déclarées (en mémoire seulement, rien au hub)
- Levée de l'absence réelle de RENAULT Adélie + copie vierge (note 20 — sur une dictée /10 : artefact d'affichage du banc, sans objet en livraison).
- Empreinte du code élève 1234 substituée pour ALOYEAU (modale).

## Tailles (octets) — 0 fonction supprimée (285 → 286 occurrences nommées)
- `buildCopieHtml` : 19 303 → 21 778
- `displayTranscript` : 535 → 124
- `tokSp` : 123 → 155
- ajoutée : `alignerErreurs` (1 097)
- fichier : 589 922 → 594 421

## À trancher par la conscience (rien n'a été fait au-delà du mandat)
1. **Nuance à la mesure « fautif partout » en 5e** : Hergé a aussi **54 erreurs sans fautif** (sur 571) — ces copies auront des trous aussi (c'est le comportement voulu ; NOUTEAU Quentin en est l'exemple réel).
2. **Écran de correction prof et onglet Fiches** utilisent les `idx` bruts (`Fiches`/`generateHTML`, `errMap[e.idx]`) : sur la 4e, ils souffrent du même décalage. Remède candidat : brancher `alignerErreurs` (une ligne par site). Non fait — hors périmètre.
3. **M/P sur dictée à ancienne indexation** : position approchée par décalage local (les 5 cas de la 4e) — exactes sur toute dictée récente.
4. **Divergence de recomposition préexistante** : « Est-ce » est rendu « Est- ce » (espace après tiret, règle `tokSp` par défaut, non modifiée — visible en BASE comme en WORK sur la capture sans-faute).
5. **Donnée réelle curieuse** : deux « Mot manquant » de Louann portent le mot « ' » (une apostrophe seule).

## Texte français nouveau visible par l'élève
Aucune phrase nouvelle : seuls les **numéros** (dans les trous et au détail) et la puce « · ». Projet d'annonce élèves, soumis :

> Les copies de dictée changent un peu : quand je n'ai pas recopié ce que tu avais écrit, tu verras un espace pointillé numéroté à la place du mot. À toi de retrouver ce qui manque — le détail en bas de copie reprend les mêmes numéros.

## Captures livrées
`capture-00-defaut-base.png` (BASE : le défaut) · `capture-01-banksy-ecran.png` · `capture-02-banksy-detail.png` · `capture-03-louann-mp.png` · `capture-04-sans-faute.png` · `capture-05-herge-inchange.png` · `capture-06-mixte.png` · `capture-07-modale-eleve.png` · `capture-08-export-seul.png`

---

## RÉVISION du 09/08 — retrait d'`alignerErreurs` (avant promotion)

Sur décision de Paul (« les données martyres » : on corrige les données, pas le code),
la fonction `alignerErreurs` et son appel sont **retirés**. La faiblesse mesurée par la
conscience était réelle : la recherche par contenu en avançant dans le texte ne
garantit pas la bonne occurrence d'un mot répété (« caddie » ×4 dans le brevet 4e).
Le rendu utilise à nouveau l'`idx` tel qu'il est enregistré. Rien d'autre n'a bougé :
trous numérotés, `data-trou`, suppression de l'« essai retenu », puces neutres,
espace avant parenthèse — tout est conservé.

**Tailles et empreintes** : livraison précédente 594 421 o, md5
`32eddd4a4bd1100e3632ab7515dc1acf` → livraison révisée **592 783 o**, md5
`a52eb5fc481302688391312f0a3ec98e`. Fonctions : 285, comme la production
(`alignerErreurs`, seule ajoutée, est retirée ; `buildCopieHtml` passe de 21 778 à
21 864 o — le commentaire de décision remplace l'appel ; `displayTranscript` 124 o et
`tokSp` 155 o inchangés depuis DICTEE2).

**Banc rejoué (mêmes gestes, mêmes données réelles)** :
- 5e Hergé (idx justes) : copie de PINEAU Clemence **strictement identique octet pour
  octet** à la livraison auditée ; mixte NOUTEAU Quentin : trous 1→4 identiques.
- 4e Banksy (idx encore faux au hub) : trous au mauvais endroit et mots corrects
  visibles — **attendu et non compensé** : ce sera juste après réinjection des
  snapshots corrigés.
- **Preuve de convergence** : le même banc, rejoué avec le snapshot corrigé de la 4e
  injecté en mémoire dans le seed, redonne exactement le comportement audité —
  Elyse 14 trous 1→14 aux bonnes places, Louann 36, aucune fuite illégitime,
  trois contextes conformes.

**Noté pour la suite (rien codé)** : l'apostrophe et les guillemets cliquables
(famille « Apostrophes et élisions » de la taxonomie) changeront le découpage donc
les positions ; les trous numérotés devront suivre cette migration le moment venu.
