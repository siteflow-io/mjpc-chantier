# SITE-COURS-2b — RAPPORT DE LIVRAISON
**L'adresse des feuilles (cascade niveau → chapitre → séance) et la 3e source du bouton LIER (document de l'atelier).**
Exécutant SITE-COURS-2b, sous conscience n°5 · 04/08/2026 · Pastille livrée : **8.28.0**

---

## 1 · La base et le livré (identités)

| | taille | md5 |
|---|---|---|
| BASE (production, re-téléchargée à l'instant de l'édition, sha git `2367856…`) | 729 520 o | `1d7732e09561ba828dc15897ae6e6601` |
| LIVRÉ `SITE-COURS-2b/index.html` | 749 369 o | `fa59b7cf460052d72f08f8e10a897c5b` |

La base re-téléchargée au TEMPS 2 est identique bit à bit à celle du cadrage : aucune promotion n'est intervenue entre les deux temps.

## 2 · Ce qui est livré (mandat du 29/07, gelé, + compléments imposés au FEU VERT)

1. **La cascade d'adresse** dans le bandeau « Cette feuille est pour » : niveau → chapitre → séance, menus alimentés par les **données réelles du hub** (`/site/<niveau>/chapitres`, lues par la même normalisation `sanitizeChapitres` que la navigation du site — aucun second parseur). Le rattachement gagne `chapitre`, `chapitreTitre`, `seance`, `seanceTitre` ; les libellés viennent du hub, jamais retapés. Changer le niveau (ou une classe d'un autre niveau) remet chapitre et séance à zéro.
2. **Flux Windows, sens unique** : les champs d'affichage `chapitre`/`seance` de la feuille suivent l'adresse et passent en **lecture seule** dans l'éditeur, avec la mention : *« Cette ligne suit l'adresse de la feuille — elle se règle dans les menus ci-dessus ; les titres se renomment dans l'arborescence du site. »* Une feuille d'avant la cascade garde son ancien texte affiché (secours) tant que l'adresse n'est pas posée.
3. **Le libellé à l'écran est recalculé** depuis le hub quand il est chargé (Q1 validée) — dans l'éditeur **et** dans l'aperçu/rendu (`ATELIER_FORMES.meta` : le ctx du hub prime, la valeur stockée fait secours). Prouvé au banc : hub renommé → éditeur et aperçu suivent ensemble.
4. **L'adresse venue d'une IA se valide** contre les données réelles avant tout verdict. Refus **nommés** (chapitre inexistant → liste des chapitres réels ; séance inexistante → liste des séances ou « ce chapitre n'a pas encore de séance » ; séance sans chapitre ; feuille sans niveau ; hub illisible). Comparaisons **strictes en codepoints** : « XIXe » ≠ « XIXème » (démonstration jouée sur la feuille réelle). L'adresse acceptée s'écrit avec les **libellés du hub, jamais ceux de l'IA**, et s'annonce dans l'aperçu (« Adresse vérifiée : … » — l'aperçu ne ment pas). Le prompt remis à l'IA porte la consigne correspondante sur `chapitre`/`seance`.
5. **La 3e source du bouton LIER** : section « 📄 Document de l'atelier » dans la modale, liste triée par date (titre · produit · date), liaison par `applyLinkChanges('atelier', ref, null)` (fonction existante, non modifiée). La liaison actuelle s'affiche par le **titre** de la feuille dès que la liste est chargée.
6. **Complément A — garde « prévenu, pas bloqué »** : lier une feuille au rattachement nominatif ouvre la confirmation : *« Cette feuille est au nom de <élève>. Si la séance est publiée, toute la classe pourra l'ouvrir et lire ce document à son nom. Lier quand même ? »* Jamais de blocage (patron `_modaleConfirme`, celui de Délier).
7. **L'ouverture d'un item lié** : `openItem` route `source==='atelier'` vers un viewer plein écran (patron du diaporama : barre, fermer, imprimer, cibles 44 px), rendu par `atelierPageHTML` — **aucune divergence possible** entre ce que le professeur compose et ce que l'élève ouvre. Exemplaire selon le rattachement : nominatif → ce nom (code personnel jamais rempli dans ce contexte) ; « toute la classe » + élève connecté → son exemplaire ; sinon générique. Messages doux si le document manque.
8. `published` n'est **jamais** écrit par ce chantier. Aucune écriture vers l'arborescence : la cascade **lit** seulement.

## 3 · Preuves de fabrication

- **Double parseur VERT** (node --check + acorn) sur la base ET le livré.
- **Inventaire acorn** : 671 → 685 fonctions déclarées. **0 supprimée** · 661 intactes (md5 identique) · **14 ajoutées** · **10 modifiées, toutes en croissance**, chacune relue EN ENTIER :

| modifiée | avant | après |
|---|---|---|
| openItem | 2 762 | 2 871 |
| openLinkModal | 1 388 | 1 630 |
| atPromptComposantes | 1 316 | 1 533 |
| atIAVerifier | 1 194 | 1 924 |
| atIAApercu | 2 005 | 2 313 |
| atIAAppliquer | 986 | 1 673 |
| atelierDocumentHTML | 6 255 | 6 610 |
| atHtmlRattachement | 1 654 | 3 319 |
| atSetRatt | 487 | 836 |
| atHtmlChampsUnique | 533 | 1 307 |

  Ajoutées : atChargerChapitres 711 · atRattRecharger 116 · atChapitresDe 335 · atSeancesDe 437 · atRattPoserChapitre 259 · atRattPoserSeance 229 · atAdresseVersValeurs 501 · atAdresseAffichage 630 · atIAValiderAdresse 1 921 · atTrouverChapitre 499 · atTrouverSeance 452 · loadAtelierDocList 1 773 · linkModalApplyAtelier 735 · openAtelierItem 1 534 o.
- Hors inventaire des déclarations : `ATELIER_FORMES.meta` (expression assignée) modifiée sur ses deux lignes `chapitre`/`seance`, relue en entier ; HTML de la modale (+1 section) ; deux blocs CSS (viewer `.atdoc-viewer*`, cascade `.at-ratt-note`/`.at-in-adresse`/`.at-ch-note`) ; composantes `chapitre`/`seance` : marqueur `adresse:true`.
- **Lecture d'`openDiaporamaById` sur pièces AVANT le code du viewer** (exigence confirmée au FEU VERT) : 947 o, md5 `b0e65d8507804e7067a83cc877dc3e51`.
- Socle non contigu respecté : 20 remplacements ancrés par portée, chaque ancre vérifiée **unique** avant remplacement, aucun remplacement en bloc.

## 4 · Le banc — 36/36 verdicts VERTS (chemin réel, clics, libellés exacts)

Playwright 1.56 / Chromium, page servie en HTTP local, **hub intégralement intercepté** : les GET répondent depuis un instantané réel du hub (lecture seule, prise du jour) ; **toute écriture est journalisée et JAMAIS transmise** (réponse simulée). Session prof/élève posée par le mécanisme réel `restoreSession` (sessionStorage), déclaré. Dialogues refusés par défaut.

- **P1 · feuille neuve** : cascade 3e → ch1 → s8 par les menus ; rattachement `{chapitre:"1", chapitreTitre:"Poésie et peinture au XIXème siècle", seance:"8", seanceTitre:"Tâche finale"}` ; champs d'affichage écrits (« Chapitre 1 — … », « Séance 8 — Tâche finale »), cases cochées, champs en **lecture seule** ; l'enregistrement part vers `/site/atelier/documents/…` et il est intercepté. Chapitre 9 (sans séance) : note douce, rien ne casse.
- **P2 · recette ④ (feuille réelle `feuille_1785850139338`)** : la feuille d'avant la cascade affiche son ancien « …XIXe siècle » (secours) ; la cascade pose l'adresse après coup ; le PUT intercepté porte l'adresse. **Q1 prouvée** : chapitre renommé dans le cache du hub → l'éditeur ET l'aperçu affichent le nouveau titre ensemble (mutation du cache en page : raccourci de banc, déclaré).
- **P2-IA** : « Chapitre 1 — Poésie et peinture au **XIXe** siècle » → refus nommé listant les chapitres réels (codepoints) ; adresse exacte (« XIXème ») → « Adresse vérifiée » puis **écrite** au rattachement, libellés du hub ; feuille neuve **sans niveau** + adresse IA → refus nommé (« l'adresse se choisit dans la feuille, par ses menus »).
- **P3 · l'item** : modale LIER → 3e section présente et peuplée ; liaison actuelle affichée par le **titre** ; **garde nominative** jouée sur une feuille de banc au nom fictif « BANC Zoé » (vérifié absent du hub) → confirmation au texte imposé, « Oui, continuer » → lié ; écriture au nœud de l'item interceptée ; item ouvert → viewer, rendu atelier ; fermeture ; **Délier intact**.
- **P4 · hub muet** : « La liste des chapitres n'a pas pu être lue. [Réessayer] » ; hub revenu + Réessayer → la cascade arrive.
- **P5 · complément B①, session élève** : pendant TOUTE la navigation (accueil → 3e → chapitre → séance) : **zéro requête vers `site/atelier`** ; l'ouverture de l'item publié fait **exactement UNE lecture** (`GET /site/atelier/documents/feuille_1785850139338.json`) ; l'exemplaire s'ouvre au nom de l'élève connecté ; **zéro écriture élève** vers `site/atelier`. Le viewer n'ouvre aucune porte qui contourne la publication.
- **P6 · complément B②, mode test** : bascule par la **pastille réelle** du panneau ; feuille composée puis enregistrée : **zéro écriture réseau** (journal), l'écriture est dans `M8_TEST_STORE["/site/atelier/documents/…"]` (magasin lu). Prouvé, pas affirmé.
- **Mobile 390 px** : menus de la cascade à 44 px ; boutons de la modale LIER à 44 px.

**Journal réseau final** : les seules écritures émises (et interceptées) sont `PUT /site/atelier/documents/<id>.json` (enregistrements de feuilles), `PUT /site/3e/chapitres/1/seances/8/items/questionnaire-letranger/ref.json` + champs frères (le geste LIER/Délier existant) et `PUT /presence/…` (le heartbeat existant du site). **Aucune requête n'a atteint le hub réel ; rien n'a été écrit nulle part.**

## 5 · Écarts de plan (déclarés)

- Le cadrage annonçait `atHtmlCase` et `atBlocEdition` touchées : **finalement non modifiées** — le chemin juste passait par `atHtmlChampsUnique` (le rendu des champs d'une composante unique), plus étroit et sans effet de bord.
- `atIAApercu` gagne la ligne « Adresse vérifiée : … » (non prévue au cadrage) : un aperçu qui tairait l'adresse sur le point d'être écrite serait un aperçu menteur.
- `atelierDocumentHTML` + `ATELIER_FORMES.meta` modifiées (non prévues au cadrage) pour que la décision Q1 vaille aussi à l'aperçu et au viewer : sans cela, un renommage au hub aurait fait diverger le champ de l'éditeur et la feuille rendue.
- La modale LIER entière passe au standard tactile (`min-height:44px` sur `.link-modal-btn`, `.link-modal-select`, `.link-modal-input`) : la 3e section arrive avec le composant, ses boutons faisaient 32 px ; grossir seulement la section neuve aurait cassé l'homogénéité. Une règle CSS, composant dans le périmètre du mandat ③ — à confirmer à l'audit.

## 6 · Constats préexistants (hors périmètre, à consigner)

- En 1440×900, les boutons flottants du site (« Panneau prof », « Mes applications », « ✕ Fermer l'atelier ») se superposent et **recouvrent partiellement « ＋ Nouvelle feuille »** dans l'atelier (le clic reste possible sur la bande découverte). Mesures : bouton y=60-104 ; « Panneau prof » finit vers y≈65 ; « Mes applications » commence à y=76.
- L'entrée au niveau est à double geste (premier clic : minuteur + sondage d'intention ; second : entrée) — constaté, conforme au design, consigné pour les prochains bancs.

## 7 · Non-couverture (déclarée)

Temps réel multi-appareils · vraies polices (Google Fonts coupées au banc) · Chrome Android réel (Chromium 390 px en tient lieu) · charge (une seule feuille de production dans l'atelier) · écriture réelle vers le hub (interdite au banc par construction) · impression papier effective (le geste d'appel est joué, pas la sortie imprimante).

## 8 · Textes soumis à Paul (tous en place, modifiables au mot près)

1. Mention des champs suivis : « Cette ligne suit l'adresse de la feuille — elle se règle dans les menus ci-dessus ; les titres se renomment dans l'arborescence du site. »
2. Garde nominative : « Cette feuille est au nom de <élève>. Si la séance est publiée, toute la classe pourra l'ouvrir et lire ce document à son nom. Lier quand même ? »
3. Sous-titre de la modale LIER : « Lie cet item à une ressource : un fichier Drive ou une adresse web, un travail d'une application (dictée, réécriture, QCM, débat…), ou un document de l'atelier. La nouvelle liaison remplace l'ancienne. »
4. Refus IA (adresse) : formulations du §2-4.
5. Consigne du prompt IA sur `chapitre`/`seance` : « ne mets une valeur que si tu la CONNAIS exactement : l'adresse d'une feuille se choisit normalement dans la feuille, par ses menus — une adresse fausse sera refusée. »
6. Hub muet : « La liste des chapitres n'a pas pu être lue. [Réessayer] » · chapitre vide : « — aucune séance dans ce chapitre pour l'instant — ».

## 9 · Captures livrées (12)

Desktop : p1_cascade_complete_desktop · p1_chapitre_sans_seance · p2_recette_adresse_posee · p2_ia_refus_nomme · p3_modale_lier_3e_source · p3_garde_nominative · p3_viewer_document · p4_hub_muet_reessayer · p5_eleve_viewer_exemplaire · **p6_mode_test_bandeau (MODE TEST — bandeau visible, rien n'est parti au hub)**.
Mobile 390 px : m390_cascade · m390_modale_lier.
Toute donnée nominative visible est **fictive** (« BANC Zoé », vérifiée absente du hub).

---
**STOP.** Livraison au sas complète. Audit de la conscience n°5, puis « promeus » de Paul.
*Commit signé [exécutant SITE-COURS-2b].*
