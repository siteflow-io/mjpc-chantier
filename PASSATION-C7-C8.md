# PASSATION — CONSCIENCE n°7 → n°8 · MJPC 6 · intégration du déroulé
*Version du 21/08/2026 (remplace celle du 20/08, conservée sous `PASSATION-C7-C8-v1-20aout.md`).*
*À lire EN ENTIER avant tout geste. Rien n'est promu : la production 8.57.1 est intacte.*

---

## ① LA DÉCISION QUI COMMANDE TOUT — LE PONT

**`deroule86.html` ne sera JAMAIS transformé.** Il est déployé **tel quel, bit pour bit**, à côté d'`index.html`, et chargé dans un **cadre isolé (iframe)**. Zéro préfixage, zéro renommage, zéro retouche.

**Pourquoi** — la voie précédente (IIFE `window.DR` + préfixage `dr-` du CSS, des ids et des gestionnaires sur 230 Ko) a produit **cinq familles de fautes**, découvertes une à une, chacune après un test de Paul :
1. la « charte des fiches » (`<style id="charte-fiche">`) **oubliée** à l'intégration → `tableau()` plantait ;
2. ids **lus** préfixés mais **écrits** non préfixés (`att.id='att'` vs `getElementById('dr-att')`) → l'écran d'attente restait par-dessus la diapo (« filtre noir ») ; idem `qui` ;
3. **CSS de la fenêtre tableau** resté en `.e`/`.w` alors que son HTML était écrit en `.dr-e`/`.dr-w` → diapo sans fond ;
4. **79 gestionnaires générés dynamiquement par le JS** (43 fonctions : `setForme`, `setSupport`, `setDev`, `loupe`, `ouvrirPart`, menus contextuels…) appelaient leurs fonctions **sans `DR.`** → boutons morts (schéma, illustration) ;
5. **trois fonctions non exportées** (`envoie` — point de sortie unique vers le tableau —, `horaires`, `majVues`).

**Deux leçons.** Transformer mécaniquement un gros fichier est *vaste et silencieux* ; un pont est *petit et vérifiable*. Et : la n°7 a patché les symptômes plusieurs tours durant au lieu de **comparer systématiquement au comportement d'origine** dès la deuxième faute — c'est Paul qui a dû déboguer. Reproche fondé, à ne pas répéter.

---

## ② LE CADRE (posé avec Paul, non négociable)

1. **Le déroulé n'est jamais transformé.**
2. **MJPC garde le cadre, le déroulé garde le jeu.** Le pont ne transporte que **CINQ messages** : ① voici la trame à jouer · ② voici la classe et l'heure · ③ voilà mes écrans (pour la colonne MJPC) · ④ va à l'écran n · ⑤ voici ce qui s'est passé (le vécu). **Rien d'autre ne traverse.**
3. **Une livraison = une étape prouvée, jamais un patch.** Contrôles FIXES au banc, livrés AVEC le fichier : md5 du déroulé identique à l'original · les cinq messages passent dans les deux sens · les quatre onglets répondent · le temps calcule juste · zéro erreur au démarrage. Puis **trois ou quatre gestes précis** à vérifier par Paul — jamais « teste au hasard ».

**Estimation donnée à Paul** : 3 échanges pour une version éprouvable (onglets + bandeau + temps + T-5 + déroulé intact dedans), +2 pour le raccord de la colonne (miniatures via le pont) et le vécu.
**Ce que Paul exige de retrouver à la fin** : tout ce qui a été prévu ET déjà codé — le temps, l'agenda, les régimes, le T-5, la reprise, le vécu.

---

## ③ ACQUIS DE CONCEPTION (ne pas rouvrir)

- Chapitre = **objet** ; **quatre vues sœurs : Structure · Déroulé · Relecture · Papier**. Pas d'onglet « Sommaire » (doublon avec la colonne), pas de « Documents » (devient Structure).
- **Structure** = l'éditeur de chapitre actuel renommé (on y décide titre, entrée, compétences, séances).
- Le **déroulé absorbe l'éditeur de chapitre** : le cadre, c'est le déroulé.
- **UNE colonne gauche** = le **sommaire natif** (`ed2Documents`+`ed2Sommaire`), qui porte la **corrélation à trois colonnes** (`ed2Selectionner` : halo, défilement panneau+papier, retour par `ed2ClicPapier`). Un arbre parallèle = colonne morte à côté d'une colonne vivante. Séances **repliables INDÉPENDAMMENT** (chaque flèche n'agit que sur la sienne), **écrans en miniatures** sous leur séance, documents en lignes.
- **Un écran = un item de séance**, appelé par **référence**, jamais copié.
- **Deux couches** : trame au **niveau** / séance jouée **par classe** (copie au démarrage). **Rien ne circule entre classes** ; remontée = **geste explicite**, libellé « **Reprendre dans ma préparation** » (jamais « verser »), **rien repris par défaut**.
- **Deux régimes** : PRÉPARATION (aucune classe, rien de projeté, **le suivi n'existe pas**) / EN CLASSE (le suivi apparaît). **Les outils restent dans les deux** (chrono, gel, lumière, à écrire, surligneurs) — décision de Paul. **Seule la participation** est réservée à la classe.
- **Le tableau** = fenêtre séparée projetée au mur ; le pilotage est un **prompteur** (il montre l'écran suivant). « Voir en grand » en préparation = **la même vue tableau**, en aperçu. Écart n°1 de la n°6 : au site, ce doit être une **page autonome** qui garde son état.
- **Temps au canon worktrack** : cours = objet partagé `{debut,fin}` écrit au lancement · **fin connue de l'EDT, immuable** · **temps utile = fin − début − 5 min d'agenda** · heure de début **saisie exactement** (+ « maintenant »), temps utile **affiché AVANT** le lancement · quatre états · **le professeur n'est JAMAIS bloqué** (on avertit, on lance). Créneaux 2026-27 : 08:00-08:55 · 08:57-09:52 · 10:07-11:02 · 11:04-11:59 · 13:00-13:55 · 13:57-14:52 · 15:07-16:02 · 16:04-16:59.
- **T-5** : **jamais dans la scène** (il l'écrasait) → appel discret dans le bandeau + **modale** qui **nomme l'activité, en donne un extrait, et NOMME les notions** non travaillées (« coût : 2 compétences » = obscur). Quatre choix : reporter · donner à la maison · annuler · ne rien donner.
- **Vécu de la séance** : le moteur calcule les horaires depuis les durées **prévues** ; `h` ne dit rien du vécu. Mesurer à part et écrire à la clôture dans `deroule_joue/<classe>/vecu` : début/fin **réels**, temps **réel** par activité, passages, notions, décisions T-5. Sans cela l'IA ne comparerait que du prévu à du prévu. **Notions en CODE** (`c4-culture-02`), jamais en libellé (doctrine « id opaque immuable »).
- **Éditeur de feuille SÉPARÉ**, foyer des prompts, **hors périmètre**.
- **Loi `[LOT1-①]`**, inscrite dans le code de production : « **sélection seule — plus de rendu complet ici** », « un défilement POSÉ ne vaut pas un suivi », « pas de suivi juste après un geste ». Un clic déplace le halo, ne reconstruit jamais. **Prouver par l'identité du nœud DOM avant/après.**

---

## ④ CODE MJPC DÉJÀ ÉCRIT — RÉUTILISER, NE PAS REFAIRE

Dans `/home/claude/travail.html` (clone 8.57.1 + bloc transformé + coutures). **Le bloc `DR` transformé est à JETER** ; **les coutures MJPC sont bonnes et doivent survivre au pont** :
`atVues*` (barre des 4 onglets ; routage par `data-vue`, **jamais par le libellé** — piège de l'accent de « Déroulé ») · `atSommaireNatifHtml`, `atSomEcransDe/Html`, `atSomInjecterEcrans`, `atSomPlier`/`AT_SOM_ETAT`, `atSomAllerEcran`, `atSomSuivreCourant` · `AT_DR_REGIME`, `AT_DR_COURS`, `AT_EDT`, `atTempsUtile`, `atDebutPropose`, `atDrMajUtile` · `atDrSuiviAppliquer` · `atT5*` · `atDrModifsDeLaSeance` (**empreinte signifiante** : titre + textes ; **jamais le JSON brut** — ids, compteurs et **horaires recalculés** créent des faux positifs), `atDrClotureModale`, `atDrReprendre` · `atVecu*` · `atDrEnrAuto` (**enregistrement automatique + confirmation verte datée** ; bouton manuel supprimé).

**Bancs** : `compare.js` (**comparaison geste par geste origine/clone — l'outil qui manquait**), `verif_exports.js`, `banc_reg.js`, `banc_vecu.js`, `test_tableau.js`, `doublons.js`.
**Coiffe d'essai** (`T1-bac-a-sable.html`) : `<script id="bac-a-sable">` (lectures OK, **écritures Firebase bloquées**, bandeau rouge) + `<script id="bac-decor">` (**décor JSON pur**, 22 écrans sur 5 séances du chapitre 3e/10, tiré du PowerPoint réel — **jamais en dur**, posé dans `seances[n].deroule.ecrans`, là où l'IA écrira). **Les deux se retirent avant tout push.**

---

## ⑤ PROTOCOLE EN COURS

Développement **direct par la conscience** sur clone local ; **livraisons coiffées** ouvertes en local avec `?n=3e`. **Aucun push GitHub, aucune écriture Firebase** sans ordre explicite de Paul. **Paul est facteur de PROMPTS** : on lui donne un prompt à coller, il répond « livré ». Cahier vivant : `/home/claude/CHANTIER-T1.md`. La livraison T1 de l'exécutant au sas est **à jeter**.

---

## ⑥ OUVERT / DETTES

- **MODE TEST du déroulé** *(neuf, non traité avec la n°6)* : MJPC a `m8TestOn`/`M8_TEST_STORE` et des classes `_test_<app>`. **À trancher** : classe `_test_deroule` ou drapeau sur la séance jouée ?
- **À vérifier** : le rendu complet `[LOT1-①]` existe-t-il ailleurs dans l'éditeur (clic document, séance, retour papier) ? Si oui → défaut préexistant MJPC, hors périmètre.
- **M-SÉCU** : hub ouvert en lecture/écriture anonyme à la racine, **prouvé** (22 nœuds, `codes` 126 clés, données de mineurs). **Avant la rentrée.**
- Reste : LOT ⑫ (4 règles inertes `dp-rel-tete`/`dp-choix`, mention `diapositive_json`) · questions EDT (dates P1→PFIN, « X Français », BANKSY/PYTHAGORE) · `pilotage_debat_s3` multi-classes (« chantier à reprendre ») · Banque d'exercices · dette QCM `niveau` (`deduireNiveauDuNom`) · étanchéité des jetons · `published:true` · 2 questions PROMPTS · lacune journal 22/07→18/08 · jalon Toussaint.

---

## ⑦ RÈGLES DE PAUL

Vocabulaire : **promeus** · **BUG** (restauration immédiate) · **R/A** · **chantier à reprendre**. Finir **chaque** réponse par la liste des dettes puis **MEMO** seul sur sa ligne. Raisonner en français. **Parler sur le RENDU VISUEL, jamais sur le seul code**, et **regarder les captures produites**. **Mesurer, jamais estimer.** Chrome Windows. Classes 2026-27 : **3e Aretha Franklin · 3e Bob Dylan · 4e Hugo · 4e Turing**.

MEMO
