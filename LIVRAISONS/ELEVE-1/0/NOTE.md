# ELEVE-1 · LIVRAISON ⓪ — le mode test étanche

*Exécutante : l'instance relectrice (mandat « L'ÉLÈVE — 1 » v4). 30/09/2026. Rien n'est promu : la livraison attend l'audit de la conscience puis ton « promeus ».*

## Ce que ça change pour toi
En mode test, **retirer un élève, vider la corbeille par la purge, ou créer un identifiant élève n'écrit plus rien dans la vraie base**. Avant, ces trois gestes passaient à côté du mode test : en mode test, une purge de rentrée effaçait pour de bon. Et la purge de rentrée du site emporte maintenant aussi les fiches `/eleves` de l'an dernier (« un élève ne vit qu'un an »).

## Le fichier
- `index.html` : base `8.73.0-⑭` (1 774 212 o, md5 `a841534fce9661bad089af862900b9a9`, re-téléchargée et vérifiée à la commande) → livrée `8.74.0-⓪` (**1 775 768 o, +1 556**), `APP_VERSION_DATE` 2026-09-30, la pastille suit.
- Fonctions modifiées : `mjpcFetchOk` 484 → 1 997 o (le passage par le mode test) ; `ensureEleveUuid` 1 687 → 1 692 o (`annee: _anneeScolaire()` au lieu de `'2025-2026'`). Constantes : `MJPC_MANIFESTE.noeuds` et `MJPC_PURGE.purger` gagnent `"eleves"`. Rien d'autre ne bouge (éditions ciblées, comptées une à une).
- Mesure avant : `mjpcFetchOk` ne regardait pas le mode test ; 13 appels, dont 12 vers la base (corbeille `_fbPutPath`, purge `_fbDeletePath`, identifiant élève, dépôts de documents d'atelier) et 1 vers le dépôt Drive (non touché : ce n'est pas la base). Après : les 12 appels vers la base passent par le magasin de test quand le mode test est actif. Un effacement y laisse `null`, pour que la lecture suivante voie le vide.
- Syntaxe : 2 blocs de script, `node --check` 0 erreur et `acorn --ecma2020` 0 erreur, sur la base comme sur la livrée.
- Dettes réglées : n°12 · 77 (fuite du mode test), 78 (l'année en dur), 76 (`/eleves` à la purge) — marquées au registre « réglé au sas, attend le promeus » ; le ✔ vient après ta promotion.

## Les bancs (dans `bancs/`) — par le geste, sur un hub SIMULÉ
Données 100 % fictives (classe `zztest_3e` « ZZTEST 3e », élèves `ZZTEST Alpha Anna`, `ZZTEST Beta Bruno`, `ZZTEST Gamma Gina`) ; toute requête est servie ou retenue par le banc : **rien ne peut atteindre le vrai hub, même si le correctif était faux**. Les contrats des apps sont copiés du vrai hub en lecture (ce sont des contrats, aucun élève dedans).
Hors geste, déclaré : l'identité (professeur, puis élève fictif) est posée par la session, comme les bancs `PONT/LOTC` — le banc ne connaît pas ton code ; le sélecteur de fichier natif est retiré pour que la sauvegarde avant purge passe par le téléchargement (le repli du site).
Mesuré : la classe `_test_index` du mandat n'apparaît pas dans « Élèves & codes » (« aucune classe active ») ; le banc prend donc `zztest_3e`.

Parcours joué sur la base PUIS sur la livrée : Panneau prof → 🧪 Mode test → Élèves & codes → ✕ « Retirer l'élève » → « Oui, continuer » → Configuration & Firebase → « 🧹 Purge de rentrée… » → « Continuer vers la purge réelle… » → « ⬇ Enregistrer la sauvegarde… » → taper PURGER → « 🧹 Purger définitivement ».

Banc unique `banc_unique_0.py` : **VERT, 15 vérifications, 0 échec** (sortie dans `sortie_banc_unique_0.txt`) :
- **base 8.73.0 : 4 écritures parties vers la base en mode test** — 2 PUT `/corbeille/…` (le retrait, la purge), 1 DELETE `/eleves_index`, 1 DELETE `/codes` ; écran : « 2 emplacements purgés » sous « Mode test actif — rien n'est enregistré ».
- **livrée 8.74.0-⓪ : 0 écriture vers la base, 0 hors de la base**, en mode test, pendant tout le parcours ; au magasin : la corbeille du retrait et celle de la purge, `/eleves_index`, `/codes` et `/eleves` vidés ; écran : « ✓ 3 emplacements purgés · 0 échec » (le 3e est `/eleves`, nouveau au contrat) ; 0 erreur JS.
- **vue élève** (élève fictif connecté, base et livrée) : 0 erreur JS ; ni « aménag », ni « PAP », ni ◆, ni « mode test » à l'écran ; mêmes écritures (la présence de l'élève) ; écart d'image : **la seule pastille de version** (V8.73.0-⑭ → V8.74.0-⓪), regardé à l'agrandi (`captures/vue_eleve_ecarts_zoom.png`). (Un passage précédent montrait aussi deux points de ≤ 5 px sur les étoiles animées des cartes de niveau : animation.)
- **le vrai hub inchangé**, lu avant et après (comptes, jamais un nom) : classes 9, codes 128, eleves 3, eleves_index 3, corbeille 25, manifestes 11 — identiques.

## Attendus hub (après ta promotion)
Aucun nœud nouveau. Quand tu te connectes en professeur, le site publie son contrat (`publierManifesteREST`, l. 4819) : `/manifestes/index/purge/purger` deviendra `["eleves_index","codes","eleves"]`. La prochaine purge de rentrée emportera alors `/eleves`.

## Infobulles
Aucun geste ajouté par ⓪, donc aucune infobulle nouvelle.

## Captures (`captures/`, écran entier, regardées)
`base-*` (avant) et `livree-*` (après), même parcours : 1 panneau · 2 élèves en mode test · 3 Configuration en mode test · 4 simulation de purge · 5 purge terminée · vue élève ; plus `planche_0.png` (Configuration et fins de purge, agrandies) et `vue_eleve_ecarts_zoom.png`.

## Avant ta promotion — attention
Sur le site en ligne (8.73.0), **ne fais ni retrait d'élève ni purge en mode test** : c'est précisément ce qui écrit pour de bon aujourd'hui.

## Tes tests, geste par geste, après promotion
1. Ouvre https://siteflow-io.github.io/monsieurjaipascompris/?n=3e&v=8.74.0 et vérifie la pastille **V8.74.0-⓪**.
2. Connecte-toi en professeur, puis Panneau prof → clique **🧪 Mode test** : le bandeau dit « Mode test actif — rien n'est enregistré ».
3. Élèves & codes → classe témoin 3E Charles de Gaulle → ✕ sur un élève → « Oui, continuer » : il disparaît de la liste.
4. Configuration & Firebase → « 🧹 Purge de rentrée… » : la simulation compte maintenant aussi les fiches élèves (`eleves`) pour le site. Arrête-toi là (« Fermer »).
5. Clique « Quitter le mode test » : l'élève est revenu dans la liste (rien n'était parti).
6. Corbeille : aucune entrée nouvelle datée d'aujourd'hui.
