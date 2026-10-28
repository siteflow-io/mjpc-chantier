# NOTE — la Rédaction universelle (RU) · E4 · 27/10/2026

## Ce que ça change pour la classe
Paul corrige les copies papier de **n'importe quelle** rédaction avec toute la finesse de sa grille Dugain : la grille est une donnée du site, un nouveau sujet (la lettre de la Grande Guerre des 3e) entre en collant le JSON préparé avec Claude. Il choisit **une vraie classe du site** (ses élèves sont ceux du site) ; chaque geste s'enregistre au site, et il retrouve tout, à l'endroit exact, en rouvrant. Chaque élève reçoit sa fiche (imprimée ou École Directe), **mot pour mot** celle d'aujourd'hui, avec le nom de sa classe ; **aucune fiche ne part avec une phrase que Paul n'a pas lue** (lue dans « Préparer le sujet », ou choisie en corrigeant).

## Les pièces
| pièce | où | |
|---|---|---|
| l'app | `LIVRAISONS/REDACTION/redaction.html` | md5 `231519ef…` ; départ : `redaction_dugain_v3.html` (production, 349 982 o, md5 `f61f1ec0…`) |
| le premier sujet | `sujets/dugain.json` | extrait par script (`outils/extraire-dugain.mjs`) : 80 niveaux, 640 sous-niveaux, 24 consignes — 0 phrase perdue |
| la lettre | `sujets/lettre-grande-guerre.json` | écrite par la conscience (R10 bis) ; **passe « Vérifier » sans refus** |
| le prompt | `MANDATS/REDACTION-UNIVERSELLE/PROMPT-REDACTION.md` | le JSON exact que « Vérifier » accepte ; les refus mot pour mot |
| le banc | `banc/banc-ru.mjs` (+ `fauxhub.mjs`, `nonreg.mjs`) — RU0-RU11 | **42 ok · 0 échec** (`sorties/<heure>-27-10/banc-ru.txt`) |
| les captures (1707 × 743) | `captures/1-…6-…png` | la liste des sujets, « Préparer le sujet », le tableau de bord avec une classe du site, une copie en mode interrogatif (et son récapitulatif), une fiche, le mode test |

## Pour E1 (§12.32, R7) — ce que le portail doit appeler
- **L'adresse** : `redaction.html?mode=prof[&id=<sujet>][&classe=<clé ou nom de la classe>][&vue=preparer][&test=1]`
  - sans `id` : la liste des sujets (Ouvrir · Préparer · ➕ Nouveau sujet) — c'est l'entrée du **panneau prof** ;
  - `id=<sujet>` : le sujet ; `classe=` (la clé du site, ou le nom : résolu comme `edtCleClasse`) ouvre directement ses copies — c'est l'entrée de **l'onglet « Rédaction » d'une séance** (le sujet rattaché à la séance, la classe du cours si le portail la connaît) ; sans `classe`, la dernière ouverte pour ce sujet, sinon le choix de la classe ;
  - `vue=preparer` : « Préparer le sujet » ;
  - `test=1` : **à passer quand le portail est en mode test** (l'app le lit aussi seule dans `window.opener` / `parent` `m8TestOn()` quand c'est lisible, mais une adresse ouverte dans un onglet neuf ne le voit pas).
- **La session** : l'app lit la session prof partagée (`mjpc_eleve`, `is_prof`, M-SÉCU) ; sans elle, sa porte (clé ou code, `mjpcVerifierProf`).
- **Le rattachement sujet ↔ séance** n'existe pas encore au site : à décider (un item de séance `{kind: "redaction", ref: "<id>"}` ? ). Je n'ai rien écrit côté portail.

## Au hub (mjpc-hub)
- `/redactions/<id>/config` — le sujet, rangé (`format: "mjpc-redaction-sujet/1"`, `variantes[]`).
- `/redactions/<id>/copies/<clé classe>/<clé MJPC élève>` — une copie (la forme d'avant + `nom`). **§12.63 (2)** : corrigée (tous ses points notés), elle porte aussi `competences: [{ competence, point, niveau }]` — une ligne par compétence de chaque point noté (0 Insuffisant … 3 Très satisfaisant ; un point « non évalué » n'y est pas), réécrite si un niveau change, tirée de la grille du sujet au hub ; pour le profil longitudinal, jamais à l'écran ni sur une fiche.
- `/redactions/<id>/suivi/<clé classe>` — le paquet, le tri, l'endroit exact (la reprise).
- `/redactions/<id>/validations/<clé>` — `{ le, par }` : `p~<variante>~<point>` (un point validé), `d~…~<niveau>`, `s~…~<niveau>~<sous>~sans|avec` (une phrase lue en corrigeant ou corrigée dans la case), `c~<variante>~<critère>` (les consignes), `fiche`.
- `/redactions_communes/validations/{liaisons, fixes}` — les phrases communes, lues une fois.
- **Ce que je ne sais pas** : si les règles de sécurité du hub laissent écrire `/redactions` et `/redactions_communes` (je n'ai rien écrit au vrai hub) — à vérifier avant la mise en ligne.

## Ce qui a changé dans l'app (fonctions)
- **Dérivé par script** (`outils/deriver.py`, une fois) : 34 remplacements exacts + 6 blocs réécrits ; ensuite modifié à la main (normalisation, Nouveau sujet, Préparer, R4 bis). Ce qui sort du code : `GRILLE`, `SOUS_IMAGINATION`, `SOUS_REFLEXION`, `CONSIGNES`, `reordonnerGrillePourFluxCorrection` (l'ordre du JSON est l'ordre de correction), « 3e De Gaulle », « Rédaction brevet blanc », « Brevet blanc », « / 40 », les ids `orthographe` / `longueur` du compteur, l'alerte DNB, « À faire avec cette correction », les libellés imagination / réflexion, la liste d'élèves collée, `localStorage` comme mémoire (gardé en secours).
- **Réécrites** : `seuilsOrthoPour`, `notificationDeclassementDNB`, `extraireSujet`, l'écran de choix du sujet, `eleveId` (la clé MJPC ; `eleveIdAncien` garde le tirage des mots de liaison d'avant), `saveState` / `loadState` (le site), `ouvrirGestionClasse` / `sauverClasse` (la classe du site), `sauverSujet` (l'énoncé au site), l'INIT.
- **Ajoutées** : le socle MJPC-CORE + M-SÉCU (tel quel, de `correction_dictee.html`), `appliquerSujet` / `normaliserSujet`, la couche site (`ru*` : porte, liste, classe, hub, mode test, abonnement, témoin, reprise), « Nouveau sujet » (`ruValiderSujet`, `ruVerifierNouveau`, `ruCreerNouveau`), « Préparer le sujet » (`ruPreparer`, `ruPrepRendre`, `ruPrepValider`, `ruPrepCase`), R4 bis (`ruLuEnCorrigeant`, `ruPhrasesNonLues`, `ruFicheBloquee`, `ruMajBoutonsFiche`).
- **Rien ne tombe de la finesse (R2)** : critères, poids, 4 niveaux, sous-niveaux, compteur et seuils, citation et marquage des fautes, crayon, 1-2-3-4, N puis E, paquet par initiales, tri, chrono / pause / statistiques, classique et interrogatif, la composition du commentaire, fiches HTML, ZIP, JSON automatique — la non-régression le prouve sur trois copies.

## Le banc (`banc/banc-ru.mjs`, faux hub, jamais le vrai)
RU0 la porte · RU1 la liste vide, « Vérifier » (vide, la lettre, une réponse cassée : 6 refus nommés, une réponse coupée), « Créer » Dugain par la porte (80 / 640 / 24) · RU2 la classe à clé simplifiée (`3_franklin_aretha`, par sa clé et par son nom « 3 FRANKLIN Aretha »), « 👥 Classe » · RU3 une copie corrigée au clavier de bout en bout (interrogatif, citation, marquage, compteur, crayon, meilleure citation), le mode classique, au hub · RU4 R4 bis : bloquée (la boîte dit lesquelles, « Exporter tous » grisé avec la raison), « Préparer » (communes, fiche, consignes ; une case corrigée → au hub et lue ; « 1 point validé sur 20 »), puis la fiche sort · RU5 recharger → la reprise exacte · RU6 l'abonnement (une autre page corrige → ce tableau de bord le montre sans recharger ; une saisie en cours intacte) · RU7 le mode test (zéro écriture, le bandeau, le témoin) · RU8 **la non-régression : trois fiches mot pour mot celles de la production** · RU9 1366 × 743, 1536 × 743, 1707 × 743, 1920 × 1080 : rien ne déborde · RU10 « {CIT} » ne sort jamais · RU11 l'énoncé entier (Dugain ×2, la lettre). La non-régression : au nom de classe près et à l'énoncé près. **RU18 (§12.63)** : la lettre compte par le geste avec les seuils de Paul (trente lignes 3 / 7 / 14 ; moins de quinze lignes 1 / 2 / 4 ; non évalué → trente lignes), Réglages les montre ; une copie corrigée (la lettre, Dugain) écrit ses `{ competence, point, niveau }` au faux hub, un niveau changé les suit, une copie corrigée avant les reçoit à l'ouverture (horodatage inchangé ; rien en mode test ; une copie sans élève pas réécrite) ; la fiche ne change pas ; aucun identifiant de compétence à l'écran (texte, infobulles, cases ; chaque écran de « Préparer le sujet » dit le nom de la compétence).

## Ce qui reste — jamais une dette cachée
1. ~~Les seuils du compteur de la lettre~~ **posés (§12.63 (1), Paul 28/10 « Oui »)** : Dugain divisé par deux — `{"3": [3, 8, 16], "2": [3, 7, 14], "1": [2, 5, 9], "0": [1, 2, 4]}` (la ligne de trente lignes : 0-3 / 4-7 / 8-14 / 15 et plus). Une lettre **déjà créée au site** garde les seuils de sa création : elle ne diffère que par la ligne « moins de quinze lignes » (Fragile jusqu'à 5 au lieu de 4).
2. ~~Les compétences de la grille~~ **rattachées (§12.63 (2), Paul 28/10 « Oui évidemment ! »)** : chaque point de Dugain et de la lettre a la sienne (la table est au JOURNAL, §12.63) ; la copie corrigée l'écrit au hub (ci-dessus).
3. **Les phrases communes** (mots de liaison, phrases fixes) se lisent et se valident, **elles ne se corrigent pas** (elles sont dans le code) : si Paul veut en changer, elles deviennent une donnée de `/redactions_communes/phrases` — à trancher.
4. ~~Deux défauts hérités~~ **réglés au contrôle n°79** : « {CIT} » ne sort jamais sur une fiche (la fiche attend la citation, RU10) ; l'énoncé de la fiche est celui de la variante, entier (RU11). Reste pour la conscience : l'énoncé de la lettre annonce « les cinq architectures ci-dessous » sans les donner.
5. **R7 (l'accès depuis le portail)** : à E1 (adresse ci-dessus) ; le rattachement sujet ↔ séance est à décider.
6. **Les relecteurs neufs** (protocole du 12/10) : pas lancés pour ce mandat (Paul est pressé) — à faire si la conscience le demande.
7. Le banc a demandé **un faux hub qui survit à la navigation** (`window.name` + `localStorage`, compteur de version) : le stockage de Chrome se recopie entre processus avec un retard, une navigation immédiate relisait parfois l'ancien (mesuré : 1 fois sur 6 avant la correction, 0 sur 8 après). C'est le banc, pas l'app.
