# NOTE — la Rédaction universelle (RU) · E4 · 27/10/2026

## Ce que ça change pour la classe
Paul corrige les copies papier de **n'importe quelle** rédaction avec toute la finesse de sa grille Dugain : la grille est une donnée du site, un nouveau sujet (la lettre de la Grande Guerre des 3e) entre en collant le JSON préparé avec Claude. Il choisit **une vraie classe du site** (ses élèves sont ceux du site) ; chaque geste s'enregistre au site, et il retrouve tout, à l'endroit exact, en rouvrant. Chaque élève reçoit sa fiche (imprimée ou École Directe), **mot pour mot** celle d'aujourd'hui, avec le nom de sa classe ; **aucune fiche ne part avec une phrase que Paul n'a pas lue** (lue dans « Préparer le sujet », ou choisie en corrigeant).

## Les pièces
| pièce | où | |
|---|---|---|
| l'app | `LIVRAISONS/REDACTION/redaction.html` | 306 444 o, md5 `676afcbf…` ; départ : `redaction_dugain_v3.html` (production, 349 982 o, md5 `f61f1ec0…`) |
| le premier sujet | `sujets/dugain.json` | extrait par script (`outils/extraire-dugain.mjs`) : 80 niveaux, 640 sous-niveaux, 24 consignes — 0 phrase perdue |
| la lettre | `sujets/lettre-grande-guerre.json` | écrite par la conscience (R10 bis) ; **passe « Vérifier » sans refus** |
| le prompt | `MANDATS/REDACTION-UNIVERSELLE/PROMPT-REDACTION.md` | le JSON exact que « Vérifier » accepte ; les refus mot pour mot |
| le banc | `banc/banc-ru.mjs` (+ `fauxhub.mjs`, `nonreg.mjs`) | **34 ok · 0 échec** (`sorties/<heure>-27-10/banc-ru.txt`) |
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
- `/redactions/<id>/copies/<clé classe>/<clé MJPC élève>` — une copie (la forme d'avant + `nom`).
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
RU0 la porte · RU1 la liste vide, « Vérifier » (vide, la lettre, une réponse cassée : 6 refus nommés, une réponse coupée), « Créer » Dugain par la porte (80 / 640 / 24) · RU2 la classe à clé simplifiée (`3_franklin_aretha`, par sa clé et par son nom « 3 FRANKLIN Aretha »), « 👥 Classe » · RU3 une copie corrigée au clavier de bout en bout (interrogatif, citation, marquage, compteur, crayon, meilleure citation), le mode classique, au hub · RU4 R4 bis : bloquée (la boîte dit lesquelles, « Exporter tous » grisé avec la raison), « Préparer » (communes, fiche, consignes ; une case corrigée → au hub et lue ; « 1 point validé sur 20 »), puis la fiche sort · RU5 recharger → la reprise exacte · RU6 l'abonnement (une autre page corrige → ce tableau de bord le montre sans recharger ; une saisie en cours intacte) · RU7 le mode test (zéro écriture, le bandeau, le témoin) · RU8 **la non-régression : trois fiches mot pour mot celles de la production** · RU9 1366 × 743, 1536 × 743, 1707 × 743, 1920 × 1080 : rien ne déborde.

## Ce qui reste — jamais une dette cachée
1. **Les seuils du compteur de la lettre** attendent le oui de Paul (point 538) : ils sont dans la donnée, pas dans le code.
2. **Les compétences de la grille Dugain** (R8) : ma proposition est dans `dugain.json` (orthographe → `c4-langue-01`, … ; la liste est au JOURNAL, poussée 2) — à valider par Paul.
3. **Les phrases communes** (mots de liaison, phrases fixes) se lisent et se valident, **elles ne se corrigent pas** (elles sont dans le code) : si Paul veut en changer, elles deviennent une donnée de `/redactions_communes/phrases` — à trancher.
4. **Vu dans l'app d'aujourd'hui, gardé tel quel (R2)** : une phrase au crayon qui garde `{CIT}` sans citation sort avec « {CIT} » sur la fiche ; l'énoncé par défaut de Dugain se découpe mal (« (suite du récit de Marguerite) ou ») — Paul tape l'énoncé exact par « 📝 Sujet ».
5. **R7 (l'accès depuis le portail)** : à E1 (adresse ci-dessus) ; le rattachement sujet ↔ séance est à décider.
6. **Les relecteurs neufs** (protocole du 12/10) : pas lancés pour ce mandat (Paul est pressé) — à faire si la conscience le demande.
7. Le banc a demandé **un faux hub qui survit à la navigation** (`window.name` + `localStorage`, compteur de version) : le stockage de Chrome se recopie entre processus avec un retard, une navigation immédiate relisait parfois l'ancien (mesuré : 1 fois sur 6 avant la correction, 0 sur 8 après). C'est le banc, pas l'app.
