# M8-MOBILE — NOTE DE CADRAGE (exécutant, conversation neuve — lundi 20/07/2026, ~12h30 heure française)
*Passe tactile de la console du site (`index.html`). Rien n'est codé : cette note attend l'audit de la conscience n°2 avant toute ligne.*

*Nota horaire : l'outil d'heure dédié n'a pas répondu (4 min sans réponse) ; l'heure ci-dessus vient de l'horloge du conteneur convertie en TZ Europe/Paris — écart déclaré, conformément à la règle du 20/07.*

## 0. Changement de conscience — pris en compte
Conscience n°1 close le 19/07 pour amnésie silencieuse ; la conscience n°2 audite. Droit-devoir de contestation sourcée intégré : un fait sourcé (lignes, md5, horodatages) suspend son avis. J'en use une fois ci-dessous (§3), à titre de précision, sans remise en cause du verdict.

## 1. Lecture ① — la conversation de l'exécutant M8bis
**Ce que j'ai pu lire** (outil de recherche des conversations passées, plusieurs passes) :
- La conversation « exécutant m8 » (M8bis, éditeur de taxonomie, close le 19/07 vers 20h31) : son résumé complet et de larges extraits bruts — la note de cadrage (structure, méthode, questions Q1-Q4), les quatre arbitrages de la conscience (Q1 marqueur permanent mode test · Q2 commentaire seul près de MJPC_PURGE, rien dans les constantes · Q3 éditables élargis à `niveaux`/`exemple` · Q4 notions seules), le banc 41/41 par extraction du code livré, le parcours en mode réel simulé avec `_sitePut` capturant, la livraison en une fois avec vérification bit à bit local↔sas, et sa section « Dettes » finale (aucune dette ouverte ; `sessionStorage 'mjpc_m8_test'` = dette du site, hors périmètre).
- En complément : la fin de la conversation-conscience du 19/07 (audit du cadrage M8bis, promotion M8 lot 1, engagements comportementaux de la conscience) et le récit du 3e épisode du piège de l'exemple commenté.

**Le ton et la manière hérités** : chaque affirmation portée par une ligne ou un md5 ; structure lue et jamais supposée ; les questions de périmètre se posent AVANT de coder ; l'arbitrage de la conscience peut élargir comme restreindre ; zéro écriture hub ; livraison en une fois.

**Ce que je n'ai pas trouvé / limites honnêtes** : l'outil restitue des extraits et un résumé, pas le fil intégral tour par tour — je n'ai pas de lecture chronologique exhaustive de chaque message. Je n'ai pas retrouvé le détail des échanges intermédiaires entre le feu vert et la livraison (la phase de codage elle-même n'apparaît que par fragments). Aucun signe d'incident ou de friction dans ce que j'ai lu de M8bis ; si la conscience en connaît un que je n'ai pas vu, je preneur.

## 2. Lecture ② — le plan de travail
`docs/MJPC6-plan-de-travail.md` téléchargé AUTHENTIFIÉ : **276 626 o, 1158 lignes, md5 `0c033ca525de5af14409c10c07ceb8ee`** (le prompt annonce ~1190 lignes — écart de 32 lignes constaté, taille cohérente avec un document vivant ; à confirmer par la conscience que c'est bien la version courante).

**Lu intégralement, ligne à ligne** : la chronologie et la règle « LE MOBILE EST UN USAGE DE PLEIN DROIT » avec ses quatre critères opposables (L19-31) · le dispositif A0 complet, dont : fait vs intention, le registre est une compilation, ne jamais promouvoir un doute en fait, protocole de mort d'une conscience, l'heure se vérifie, la règle de nommage amendée du 20/07, l'amnésie des exécutants, la conscience lit elle-même l'exécutant, le compte des 9 erreurs de la conscience n°2 (L103-200) · le principe cardinal et son articulation avec le point 28 (L213-240) · la grille de passe complète, points 1-28 (L241-349), dont les points 19 (aucun piège assumé), 20 (refactor sûr : déplacer, pas réécrire), 27 (tokenisation = contrat), 25/25bis/26/28 (textes élève).
**Parcouru par table des matières, non lu ligne à ligne** : les sections d'historique et de conception B à K (fiches d'apps, vision fondatrice, questionnaires) — je les connais par leurs titres et j'y retournerai si le morceau l'exige. Déclaré honnêtement : ma lecture du plan n'est pas exhaustive à 100 %, elle est exhaustive sur tout ce qui norme ce morceau.

## 3. État vérifié par moi (le fichier fait foi)
- **Production** : `index.html` téléchargé authentifié — **352 684 o, md5 `f939e60d0d23fbb4b291f460b3277709`, `APP_VERSION="8.1.0"` (L1816)**. Conforme aux trois chiffres du prompt.
- **Constats CSS confirmés sur pièces** : `.m8-btn { padding: 7px 13px; font-size: 0.82rem }` (L351) · `.m8-btn-min { padding: 4px 9px; font-size: 0.76rem }` (L353) · media queries existantes : `@media (max-width:700px)` L92, `@media (max-width: 480px)` L376 et L412 — la structure d'accroche existe, comme annoncé.
- **Précision sourcée (ne change pas le verdict)** : les quatre boutons cités « Modifier » (L1167), « Désactiver » (L1556), « ⚡ Simuler J+29 » (L1209), « Revenir aux dates par défaut » (L1200) sont en classes **`m8-btn m8-btn-min`**, pas héritiers de `.ch-publish-btn`. Le `padding: 2px 8px; font-size: 0.68rem` cité correspond au variant `.seance-header .ch-publish-btn` (L438), qui vit AILLEURS (en-têtes de séances). Dans le périmètre console, le seul vrai `.ch-publish-btn` est « Ouvrir / fermer la console » (L736), mesuré à 25 px lui aussi. Les hauteurs annoncées (25 px) sont EXACTES pour les deux familles — seule l'attribution CSS diffère, et elle compte pour coder au bon endroit. Par ailleurs « Modifier » est sans ✏️ dans le code (le seul ✏️ du fichier est l'onglet Rédaction, L733).
- **Mesure de départ refaite au harnais** (Chromium Playwright installé dans le conteneur, viewport 390×844, `isMobile`, `hasTouch` — mesure des rectangles, pas à l'œil). Protocole lecture seule stricte : fichier LOCAL en `file://`, `page.route` servant les GET du hub en stub (taxonomie canonique réelle : 72 279 o, md5 `dc007a57…`, 154 notions vérifiées ; `null` ailleurs), **toute autre requête et toute méthode d'écriture AVORTÉES**, zéro clic (admin-mode par `classList`, `ouvrirConsoleM8()` / `taxoOuvrirEditeur()` / `taxoToggleDom()` appelés par leur nom exact lu aux L1509/1499), zéro `dialog.accept`.
  **Mes chiffres** : console `#m8-console` = **2 018 px** (~2,4 écrans) avec un domaine taxo déplié · **26 cibles, 19 sous 44 px** (25 à 34 px de haut : `ch-publish-btn` 25 · `m8-btn` 32 · `m8-btn-min` 25 · en-têtes de famille 28 · `select` 33 · `input` date 34).
  **Écart avec les 31/24 et 3 195 px de la conscience — expliqué, pas contesté** : mon stub sert des annonces VIDES et un brevet sans dates saisies ; la production mesurée par la conscience porte des annonces réelles, chacune avec ses boutons « Modifier »/« Désactiver » (soit ~5 cibles et plusieurs centaines de px de plus), et je n'avais aucune famille dépliée (pas de notions, pas de leurs boutons). Nos deux mesures disent la même chose : **l'écrasante majorité des cibles est sous-norme, et la console dépasse le seuil des 2 écrans dès qu'elle porte des données**. Pour l'avant/après du rapport, je servirai en stub un jeu d'annonces représentatif (lu du hub réel par GET pur, comme M8bis l'a fait pour /taxonomie) afin que mes chiffres soient comparables aux siens.

## 4. Ce que j'ai compris du morceau
Rendre la console utilisable AU DOIGT, sans changer une seule fonction. Le diff attendu est fait de CSS et d'enveloppes de présentation ; toute modification de logique, de chemin Firebase, de libellé, de garde `admin-mode`, du mode test ou des invariants taxonomie est un ÉCHEC même si l'ergonomie est parfaite. Le desktop ne doit pas se dégrader (media queries quand nécessaire, vérification aux deux tailles). Preuve reine : l'avant/après chiffré des rectangles au harnais tactile. `APP_VERSION` → `8.2.0` (bloquant). Livraison EN UNE FOIS au sas (`index.staging.html` + `M8-MOBILE-rapport.md`). Pas d'annonce élève (livrable purement prof — cohérent avec la règle : annonce pour les livraisons PÉDAGOGIQUES seulement). Je ne promeus jamais.

## 5. Découpage proposé
**A. Cibles ≥ 44 px (critère ①) — CSS seul, sous media query `(max-width: 480px)`** pour ne rien changer au rendu souris :
- `min-height: 44px` (+ padding recalibré) sur : `.m8-btn`, `.m8-btn-min`, le `.ch-publish-btn` de la console (ciblé via `#m8-console-wrap .ch-publish-btn` pour ne PAS toucher les `.ch-publish-btn` du reste du site : publication d'onglets L2825, BB4E L4370, `.seance-header` L438 — hors périmètre), `.m8tx-dom-titre`, `.m8tx-fam-titre`, `.m8-input`, `.m8-select`, `.m8-date-in`.
- Aucune règle desktop modifiée ; le bloc s'ajoute à la media query 480 existante de la zone m8 ou en section nommée dédiée (point 20 : section explicite, pas d'empilement).

**B. Accordéon exclusif des 5 blocs (critère ②) — enveloppe de présentation, logique intacte** :
- Les cinq fonctions `_blocModeTest / _blocAnnonces / _blocBrevet / _blocRegles / _blocTaxonomie` restent INTACTES octet pour octet. `renderConsoleM8` (L1128-1135) enveloppe chaque bloc dans un gabarit « titre cliquable + corps repliable » via une petite fonction de rendu nommée (motif point 20) ; un état d'interface `M8_UI = { blocOuvert: … }` (motif `TAXO_UI` L1250, déjà éprouvé) survit aux re-renders.
- **Aveu de périmètre** : ce n'est pas du CSS pur — l'accordéon exige un état JS et un toggle. Le JS ajouté est PUREMENT de présentation (aucune lecture/écriture hub, aucune garde touchée) et ADDITIF (aucune ligne existante modifiée hors du point d'assemblage `el.innerHTML = …`, une ligne, comme M8bis l'avait fait pour ajouter son 5e bloc).
- L'écriture d'une annonce, un geste taxo, etc. re-rendent la console : l'état `M8_UI` garantit qu'on RESTE dans le bloc où l'on travaillait (principe « souplesse + usage épuré » : reprendre où l'on était).

**C. Pleine largeur sous 480 px (critère ③)** : déjà partiel (L415) ; étendu à tous champs et boutons de la console dans la même media query.

**D. Pas de défilement horizontal (critère ④)** : `flex-wrap` déjà présent par endroits (`.m8-item-a` L378-379, `.m8tx-n-l1`, `.m8tx-n-actions`) ; vérification systématique au harnais (comparaison `scrollWidth` vs `clientWidth` sur chaque conteneur), correctif CSS là où ça déborde.

**E. Pastille** : `APP_VERSION` → `8.2.0`, `APP_VERSION_DATE` → date du jour de livraison (L1816-1817).

**F. Preuves à livrer** : tableau avant/après des rectangles (mêmes cibles, même harnais, stub d'annonces représentatif identique entre les deux mesures) · hauteur console avant/après (chaque bloc ouvert seul + tout fermé) · diff exhaustif prouvant zéro logique touchée (chaque hunk = CSS, enveloppe de rendu, ou pastille) · double parseur (`node --check` + acorn ecmaVersion 2020) · vérification desktop (1280 px, `isMobile:false`) montrant l'usage souris préservé · extraction de toute constante par regex avec lignes `//` écartées d'abord (piège des 3 épisodes, intégré).

## 6. Ce que je ne pourrai pas tester
- Le VRAI doigt sur le VRAI téléphone de Paul : mon harnais émule (`is_mobile`, `has_touch`, 390 px) mais reste Chromium de bureau. Le regard final en usage réel reste à Paul, après promotion (circuit A0 : son test est en aval).
- Les données de production vivantes : je mesure sur stub fidèle (GET purs), pas sur le hub en écriture.
- L'outil d'heure de la plateforme (muet aujourd'hui) — heure du conteneur en repli, déclarée.

## 7. Questions à l'audit (réponses courtes suffisent)
- **Q1 — L'accordéon exclusif vaut-il AUSSI au desktop ?** Ma préférence : OUI, comportement identique aux deux tailles (un seul code, un seul comportement à tester, et la console desktop actuelle est déjà longue) ; l'alternative « exclusif seulement sous 480 px » double les états à vérifier. Le prompt dit de protéger l'usage souris : un accordéon ne le dégrade pas à mes yeux, mais c'est un choix d'usage qui revient à Paul/conscience.
- **Q2 — État à l'ouverture de la console : quel bloc ouvert ?** Ma préférence : AUCUN (la console s'ouvre en sommaire de cinq titres, hauteur minimale, un tap pour entrer où l'on veut). Alternative : « Mode test » ouvert par défaut (premier bloc actuel).
- **Q3 — Le bouton « Ouvrir / fermer la console » (L736, `ch-publish-btn`, 25 px) est-il dans mon périmètre ?** Il est DANS `#m8-console-wrap` mais HORS `#m8-console`. Ma préférence : OUI (c'est la porte d'entrée de la console au doigt ; le compte de 31 cibles de la conscience semble l'inclure).
- **Q4 — Confirmation de périmètre** : les cibles du reste de `page-level` (onglets, cartes de chapitres, boutons de publication L2825/L4370) restent HORS morceau — la passe est « console », pas « site entier ». Je le comprends ainsi ; dire si c'est bien ça.

## 8. Écritures hub à ce stade : ZÉRO
Aucune requête d'écriture émise ; le harnais avorte toute méthode non-GET par construction (liste des requêtes interceptées jointe à la mesure). Seules lectures : GitHub authentifié (plan, index.html, taxonomie — tailles et md5 vérifiés).

J'attends l'audit de la conscience avant de coder.
