# SITE-COURS-1 — RAPPORT DE LIVRAISON
**Exécutant → conscience n°4 · 29/07/2026 · sas `mjpc-chantier`**

---

## 1 · Identité de la livraison

| Pièce | Valeur |
|---|---|
| Base éditée | `index.html` production, **re-téléchargée juste avant édition** : 395 148 o, md5 `dcbc4afe4d31a0b56bbd11c80cb045fb` (identique au registre du cadrage) |
| Livraison | `index.staging.html` : **483 209 o**, md5 `317f0a1205267b07951f7c02ed81c299` |
| Version | `APP_VERSION` **8.5.2 → 8.6.0**, date 2026-07-29 (pastille : incrément bloquant respecté) |
| Périmètre | Une section nommée « ATELIER DE COMPOSITION (SITE-COURS-1) » : un bloc CSS, un bouton de panneau, un écran, une tranche JS. Rien d'autre. |

## 2 · Ce qui est livré

L'**atelier de composition** : Paul part d'une feuille vierge, coche des cases, des choses apparaissent sur la feuille — l'aperçu à droite EST le document qui s'imprime (même chaîne HTML, `srcdoc` → `contentWindow.print()` : la propriété « ce que je vois est ce qui sort » est obtenue par construction, pas par promesse).

- **121 composantes déclarées** au schéma (`ATELIER_COMPOSANTES`), dont **114 codées** (familles A, B, C, D, E, H, I, J) et **7 réservées** visibles avec leur mention en français (diapositive convertie, syllabation colorée, QR code, résultats F, absence G, agrégats K, strates de niveau). Une composante = une entrée déclarative ; l'éditeur, le rendu écran et le rendu papier en découlent (patron `EVAL_TYPES`).
- **Q1 (décision conscience)** : la case active la zone ; dans la zone, « ＋ Ajouter » crée un second bloc du même type, réordonnable (↑ ↓) et retirable (✕). Décocher masque sans détruire ; recocher restitue la saisie.
- **Trois groupes (Q4)** : « Ce qui se remplit tout seul » · « Ce que la feuille contient » · « Présentation », sous-groupés par zone de la feuille.
- **Produit « Fiche de séance »** (seul livré, décision du cadrage) : un piston qui pré-coche, ne verrouille rien.
- **Rattachement** niveau / classe / élève / toute la classe : lot = un exemplaire par élève, aperçu feuilletable élève par élève (patron `previewIdx`), numérotation d'exemplaires n / N. Classes internes (`_*`) proposées en mode test seulement.
- **Grisage qui conseille** : une case dépendante ou sans rattachement est grisée mais s'active quand même, avec l'avertissement « l'aperçu fait foi ». Le professeur n'est jamais bloqué.
- **Nœud** : `site/atelier/documents/<id>` (français), écrit **exclusivement** par la couche `_site*` → couvert par le mode test par construction. Manifeste : `site/atelier` nommé dans `noeuds` et `preserver` (même politique que M8 : nommer même ce que le préfixe couvre).
- **Quatre gestes** : créer · dupliquer · supprimer (dénombrement → archive corbeille → destruction seulement si l'archive a réussi) · modifier. Archive au format du site `{_meta:{motif,chemin,…},data}`, `_meta.chemin` sans slash initial : restaurable par l'écran Corbeille existant.

## 3 · Diff intégral, classé (invariants)

`diff base.html index.staging.html` : **7 hunks, 1 355 lignes ajoutées, 4 lignes remplacées, zéro suppression** :

| Hunk | Contenu |
|---|---|
| `695a696,778` | bloc CSS atelier (avant `</head>` réel — l'autre `</head>` du fichier vit dans une chaîne JS, l'ancre `</head>\n<body>` est unique) |
| `855a939` | bouton « 🛠 Atelier » (panneau prof, section Contenu, après Taxonomie) |
| `955a1040,1044` | HTML de l'écran (avant l'unique `<script>`) |
| `2007,2008c2096,2097` | `APP_VERSION` + date (remplacement déclaré) |
| `2023c2112` · `2031c2120` | manifeste `noeuds` + `preserver` += `site/atelier` (remplacements déclarés) |
| `4951a5041,6302` | tranche JS de l'atelier (avant l'unique `</script>`) |

Les 4 lignes `<` du diff sont exactement les 4 remplacées. **Tout le reste du fichier est identique à l'octet** — c'est la structure même du diff qui le prouve. Chaque ancre d'insertion a été **assertée unique** par le script d'assemblage avant insertion.

## 4 · Double parseur et comptes de blocs

- Blocs `<script>` : **1** (compte inchangé). Balises `<style>` : **5 ouvrantes réelles** (3 nues existantes + `id="b2-styles"` + la mienne) / **5 fermantes**. Les marqueurs `<style>`/`</style>` produits par le générateur dans des chaînes JS sont **scindés** (`'<sty'+'le>'`) pour ne jamais créer de faux marqueurs (piège des coutures documenté).
- `node --check` : OK. `acorn` ES2020 sur le bloc script entier : OK.
- Bloc DIAGNOSTIC d'index : intact (aucun hunk ne le touche).

## 5 · Table de couverture mécanique (complément ③)

Jointe : `SITE-COURS-1-preuves/table-couverture.txt`. Produite par `couverture.js` qui :
1. **extrait la tranche livrée d'`index.staging.html`** entre les marqueurs de section et **prouve son identité** avec les sources de build ;
2. pour chacune des 114 composantes codées, génère la feuille case DÉCOCHÉE puis COCHÉE (valeurs de démonstration) et vérifie apparition/disparition — par marqueur `data-c="<id>"`, par classe de rendu (`r-*`), ou par **effet spécifique** monté (reformulation qui substitue le texte, allègement qui substitue la variante, numérotation qui pose les numéros, date d'édition dont seul le masquage écran varie, numérotation de lot avec rang) ;
3. vérifie 7 effets d'impression dans la charte livrée (`@media print`, date d'édition forcée, demi-A4 148 mm + saut toutes les 2, saut de page, écran-seul masqué…).

**Résultat : 114 OK · 0 échec · 7 réservées · 121 déclarées.** Écran et papier sont le même document ; le marqueur vaut pour les deux, les divergences volontaires (masquages) sont testées à part.

## 6 · Parcours joué — 35 / 35 verts

Joints : `SITE-COURS-1-preuves/parcours-verdicts.json` (les 35 verdicts), `journal-requetes.json` (chaque requête réseau émise), `parcours.js` (le harnais rejouable).

**Méthode.** Navigateur réel (chromium headless), `index.staging.html` chargé tel quel. Le hub est **simulé par interception réseau** (mock RTDB : GET/PUT/DELETE sur un magasin, en-têtes CORS, pannes commutables) : le circuit interdit d'écrire au hub réel depuis le conteneur, mais les requêtes **partent réellement du code livré** et le journal fait foi. Élèves fictifs canoniques (BERNARD Emma, DUPONT Marie, LEROY Hugo, MARTIN Lucas, MOREAU Léa, PETIT Thomas), classes `3e_temoin` + `_test_atelier` (interne).

Verdicts saillants :
- **B** — le bouton du panneau prof ouvre l'atelier plein écran et referme le panneau (conflit z-index 6800/6000 détecté et corrigé : l'atelier vit à 7000, la fermeture rouvre le panneau).
- **C1–C4** — cocher fait apparaître, « ＋ » ajoute, décocher fait disparaître en gardant, recocher restitue.
- **D1–D2** — case grisée : avertie, activée quand même.
- **E0–E3** — classes internes absentes hors mode test ; lot navigable « BERNARD Emma (1 / 6) » → « DUPONT Marie (2 / 6) ».
- **F1–F4** — PUT au nœud `site/atelier/documents/<id>` et **nulle part ailleurs** ; indicateur « Enregistré à HH:MM » ; **Q6 prouvée** : notions stockées `["La phrase complexe","Les propositions subordonnées"]` — un tableau, pas un texte.
- **G** — le clic Imprimer appelle `print()` sur le document du **lot entier** (6 feuilles, une par élève, capturées au moment exact de l'appel), puis l'aperçu individuel se restaure.
- **H1–H2** — panne d'écriture (HTTP 500) : « ⚠ L'enregistrement a échoué — tes modifications sont gardées sur cet appareil. Réessayer » ; réessai → « Enregistré à … ».
- **I1–I2** — coupure + rechargement : reprise proposée (« Une version plus récente de cette feuille existe sur cet appareil… »), la saisie rescapée est là.
- **J1–J5** — duplication ; suppression : dénombrement affiché, **PUT corbeille AVANT DELETE** (ordre prouvé au journal), archive `{_meta.chemin:'site/atelier/documents/…',data}`, carte disparue, l'originale demeure.
- **K0–K3** — mode test : bascule réelle du site (`m8BasculerModeTest`), bandeau de guidage, composé/enregistré/supprimé avec **zéro écriture réseau** (journal vide), brouillons de test purgés au retour en mode réel (cycle joué).
- **L** — élève témoin : chargement + niveau 3e = 4 requêtes, **aucune vers `site/atelier`**. Rien ne change pour les élèves.
- **M1–M3** — mobile 390 px : 272 cibles mesurées ≥ 44×44 (la cible d'une checkbox est son label englobant), zéro débordement horizontal, composition et aperçu empilés (Q2).
- **N** — captures produites.

## 7 · La charte du document (complément ①)

**Décision de conception, EN DUR** (`atelierCharteCSS()`), sans réglage : le document composé n'emprunte pas la charte sombre du site. **Noir (`#1c1c1c`) sur blanc**, texte long en serif (EB Garamond, repli Georgia — le parcours a tourné polices coupées : le repli tient), intitulés techniques en `system-ui` petites capitales espacées, hiérarchie explicite : bandeau de métas → titre 1.45 rem → ancrage sur fond crème à liseré → encadrés à filet noir 1.4 px (À retenir plus épais, Attention en tirets, exemples sur crème, différenciation à liseré bleu-gris froid), zones de travail lignées/quadrillées aux gris chauds, pied à filet avec date d'édition. Patrons revendiqués : `buildCopieHtml` (correction) et `bilansPrintHTML` (débat). `@media print` : feuille = page, demi-A4 148 mm deux par feuille à pointillés, marges `@page` 8 mm.
**Rendus joints** : écran `img-05-feuille-ecran.png` (+ `img-02`, `img-04` dans leur contexte d'édition) · papier `img-06-feuille-papier.pdf` (le lot réel de 6 pages, une par élève, imprimé par le moteur).
**Invariant de datation** : la date d'édition est TOUJOURS imprimée (pied, `.f-de-forcee` + `@media print`) même décochée — décochée, elle n'est masquée qu'à l'écran. Testé (table + parcours).

## 8 · Le piège de la saisie perdue (complément ②)

Livré : **brouillon local à chaque frappe** (localStorage, clé par document, préfixe `__test_` en mode test) · **indicateur d'état en français** (« Modifications en attente… » / « Enregistrement… » / « Enregistré à HH:MM » / « ⚠ L'enregistrement a échoué — tes modifications sont gardées sur cet appareil. Réessayer ») · **reprise au rechargement** si le brouillon est plus récent que la base (choix explicite, deux boutons) · **refus explicite** : la suppression n'a lieu que si l'archive corbeille a réussi ; l'échec d'écriture est toujours dit.

**Constat de socle (découvert en éprouvant la panne)** : `_sitePut` et `_siteDelete` répondent `cb(true)` dès que `fetch` se résout — **un refus HTTP (500, règles de sécurité) y passe pour un succès** (`fetch` ne rejette que sur panne réseau). Le point 19 interdisant l'échec muet, la section atelier écrit par `atSitePut`/`atSiteDelete` : mêmes chemins réels, même délégation au magasin en mode test, mais **`r.ok` vérifié**. Hors de mon périmètre : le socle lui-même reste tel quel — dette déclarée (§ 12), à corriger site-wide, d'autant plus sensible quand M-SÉCU posera des règles qui refuseront des écritures.

## 9 · Décisions du feu vert — application point par point

Q1 → verdicts C1–C4 · Q2 → M3 (empilé < 900 px) · Q3 → F1/F3 (nœud exact) · Q4 → trois groupes livrés · Q5 → 121 déclarées, aucune composante n'a exigé de cas particulier hors schéma ; deux réserves posées comme acceptées · Q6 → F4 (tableau de valeurs) · Q7 → invariant de datation (§ 7) · Q8 → § 10 ci-dessous. Compléments ① § 7 · ② § 8 · ③ § 5 · ④ § 11.

## 10 · Textes élève générés par le gabarit — SOUMIS (Q8)

Tout libellé généré visible d'un élève est un **champ à valeur par défaut, éditable par document** dans l'atelier (« Intitulé sur la feuille ») : Paul peut le reformuler sans livraison. Les valeurs par défaut soumises :

**Intitulés d'encadrés de différenciation** : « Ce qu'on te demande vraiment : » · « Pour t'alléger : » · « Point d'étape : » · « Un exemple fait en entier : » · « Pour commencer : » · « Sous tes yeux : » · « J'ai réussi si… » · « ☐ J'ai lu la consigne et je l'ai comprise. » · « Si je bloque : » · « Temps majoré : ».
**Liens et suites** : « Sur le site : » · « Pour t'entraîner : » · « La prochaine fois : » · « Pour la prochaine fois : » · « À rendre pour le : » · « À retrouver en ligne : ».
**Pied et cadres** : « À conserver dans le cahier. » · « Temps passé : » · « Travail fait dans l'application : » · « MJPC · monsieurjaipascompris » · « Éditée le [date] » · « v[n] » · « [rang] / [total] ».
**Intitulés fixes de blocs** (non éditables à ce morceau — dette mineure § 12) : « Définition » · « À retenir » · « ⚠ Attention » · « Exemple » · « Contre-exemple » · « Méthode » · « Sujet » · « Étape par étape » · « Brouillon » · « Lexique de la séance » · « Mots expliqués » · « Les mots importants : » · « Le geste à faire : » · « Coup de pouce 1/2/3 : » · « Objectif : » · « Compétences travaillées : » · « Notions visées : » · « Critères de réussite : » · « Prérequis : » · « Ce qui sera évalué : » · « Durée prévue : » · « Dans la progression : » · « Parcours : » · « Domaine du socle : » · « Attendu de fin de cycle : » · « Œuvre : » · « Auteur : » · « Siècle et courant : » · « Corpus : » · « Genre : » · « Histoire des arts : » · « Pour aller plus loin : » · « Étymologie : » · « Repère : » · « Longueur attendue : » · « Modalité : » · « Matériel : » · « Barème / Points » · « Points bonus : » · « [Image à lier] » · libellés de métas (Élève · Classe · Niveau · Séance · Chapitre · Groupe · Période · Date de la séance · Année scolaire · Code personnel · Version).
**Mentions des places réservées** (éditeur, côté prof mais citées par exhaustivité) : « Cette partie arrivera… » (×7, texte intégral au schéma).

## 11 · Déclaration de couverture (complément ④)

**Testé** : tout le § 5 (114 composantes, mécaniquement, écran + effets print structurels) ; tout le § 6 (35 verdicts joués en navigateur réel, journal réseau à l'appui) ; l'identité tranche livrée ↔ sources ; les comptes de blocs ; le diff.
**Non testé, et pourquoi** :
- le **dialogue d'impression réel** n'est pas éprouvable en headless — l'appel `print()` et le document au moment de l'appel le sont (verdict G) ; le PDF `img-06` est la sortie moteur du même document. Le geste physique Chrome Windows reste à l'œil de la conscience/de Paul ;
- la **restauration depuis l'écran Corbeille** : le format d'archive est prouvé conforme au contrat de `_corbPlanRestauration` (`_meta.chemin` → data entier), mais le clic de restauration dans l'écran Corbeille n'a pas été joué (écran hors périmètre) ;
- `_siteGet` **ne distingue pas** « nœud vide » de « lecture en panne » : sur panne de lecture, la liste s'affiche vide sans alerte (dette § 12) ;
- les **polices Google absentes** : parcours joué hors ligne, repli serif vérifié visuellement sur captures — pas de vérification pixel de EB Garamond en ligne ;
- le rendu **des 114 composantes n'a pas été inspecté visuellement une à une** (le mécanique § 5 prouve présence/absence, pas la beauté) ; les captures montrent un échantillon réel.

## 12 · Constats et dettes (à l'attention de la conscience)

1. **Socle** `_sitePut`/`_siteDelete` : erreurs HTTP muettes (§ 8) — durci localement, à corriger site-wide (bloquant de fait pour M-SÉCU).
2. **Socle** `_siteGet` : `null` confond vide et panne — la liste de l'atelier peut afficher « aucune feuille » sur panne de lecture.
3. **Corbeille native** `_fbPutPath` : fetch direct **non couvert par le mode test** — l'atelier n'en dépend pas (il archive via `_sitePut`), mais toute suppression du reste du site en mode test écrit la corbeille au hub réel.
4. **Magasin de test plat** : lecture parent ≠ enfants — contourné dans l'atelier par reconstruction par préfixe (`atSiteGetDocs`) ; les écrans du site qui liraient un parent écrit par enfants auraient le même trou.
5. Intitulés fixes de blocs non éditables par document (§ 10) — candidat naturel du morceau ② (éditabilité totale).
6. Réserves : diapositive convertie (morceau ③), syllabation colorée, QR code, F, G, K, strates (morceau ④).
7. `verbe_action` et `mots_cles` ne sortent qu'au fil des consignes : sans bloc consigne, cocher ne montre rien (l'aperçu fait foi ; grisage conditionnel envisageable).

## 13 · Fichiers livrés au sas

`index.staging.html` · `SITE-COURS-1-rapport.md` (ce document) · `SITE-COURS-1-preuves/` : `table-couverture.txt`, `parcours-verdicts.json`, `journal-requetes.json`, `couverture.js`, `parcours.js`, `captures/img-01…img-06`. Chaque envoi vérifié bit à bit après push (GET + md5).
