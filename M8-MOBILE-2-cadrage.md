# M8-MOBILE-2 — NOTE DE CADRAGE (exécutant neuf, conversation ouverte le 20/07/2026 — heure du conteneur TZ Paris, l'outil d'heure de la plateforme n'a pas été interrogeable dans ce tour, déclaré)
*Accueil en grille d'applications et allègement du mode admin. Rien n'est codé : cette note attend l'audit de la conscience n°2.*

## 0. Lecture ① — la conversation de l'exécutant précédent (M8-MOBILE → M8-FUSION, fil `MJPC6-M8 MOBILE`)
**Lu par outil de recherche des conversations passées** (extraits + résumés, PAS le fil intégral — limite structurelle de l'outil, déclarée) :
- Le **cadrage M8-MOBILE** (mesures avant 26 cibles/19 sous-norme sur stub, plan A-E, correction sourcée `.m8-btn-min` L353 contre `.ch-publish-btn` du prompt — erreur ⑩ conscience, contestation FONDÉE), les arbitrages Q1-Q4, la livraison v8.2.0 (md5 `5b6eb7e1…`, diff 3 retirées/51 ajoutées, `<details name>` écarté sur preuve de re-render, motif `M8_UI`/`TAXO_UI`).
- La **bascule M8-FUSION dans le même fil** : Q0 posée (contradiction avec la règle « une conversation neuve par morceau »), tranchée par Paul « tant pis, on continue » — consignée en A0. Le cadrage M8-FUSION (plan re-téléchargé 284 805 o md5 `15e9fddb…`, 9 appelants de `renderConsoleM8` et non 8 — contestation FONDÉE, règle « la conscience ne fournit plus de chiffres de périmètre »), les 15 coutures à ancres uniques, la livraison v8.3.0 (358 720 o, md5 `bf6ba1e1…`, 5 `_bloc*` md5-identiques, diff 50/85/23, mobile 98→364 px, desktop 229×41 inchangé), la reprise fondée de l'exécutant sur la pastille au repos (« 🧪 Mode test » discret conservé, sinon inactivable), la suggestion acceptée du point orange flottant, et l'échange final sur le statut des dettes d'exécutant (constatées, jamais soldées hors mandat).
**Ce que je n'ai PAS trouvé** : le tour d'audit détaillé de la conscience sur M8-FUSION (je n'en ai que la trace au journal : promu commit `2ef74c102b`, point de retour `62f32f7e89`) ; les tours intermédiaires entre le feu vert M8-FUSION et la livraison (questions/réponses de milieu de codage, si elles ont existé). Je ne simule pas cette continuité : ce que la promotion a validé, je le tiens du journal et du fichier de production, pas du fil.

## 1. Lecture ② — les trois documents (téléchargés authentifiés, taille + md5 vérifiés avant usage)
- **`docs/MJPC6-plan-de-travail.md`** : 290 933 o, md5 `fc9715144fcc3f83fd4d199f8cabeecc`, 1 180 lignes. **Lu intégralement** : chronologie + rapport de dérive rectifié (L5-60), **A0 entier** (L117-223 : circuit, amnésies, bifurcations, correctifs mécaniques, lecture seule stricte, piège de l'exemple commenté, pastille bloquante, jeton + vérification), principe cardinal + grille normative (L235-372 : point 20 déplacer-pas-réécrire et doctrine du refactor sûr, point 19 aucun piège assumé, 25/25bis/26/28 textes, 27 tokenisation). Sections historiques (B à K, comptes rendus M1-M6) parcourues par table des matières seulement — déclaré.
- **`docs/MJPC6-audit-ergonomie.md`** : 7 571 o, md5 `1109a0a55bb2541ff78e4565334fcbeb`, 61 lignes — **lu intégralement, ligne à ligne**. Identique bit à bit à la version lue par l'exécutant M8-FUSION. Mon morceau exécute la suite de F1-F3 : le lanceur rejoint le panneau, le doublon n°5 (Tableau de bord vs zone de publication) se réduit (une seule ligne d'état), F5 (`page-level`) et F6 (vocabulaire) restent HORS morceau.
- **`docs/MJPC6-journal.md`** : 19 685 o, md5 `8c06ec740648996413c7a9da04af64c8`, 132 lignes — **lu intégralement**. B1→B5, les trois contestations fondées, les reproches (purge doublons · « affirmations infondées » · « une erreur par tour »), la décision « les consciences vivent longtemps ». **Ma bifurcation B5** : déclencheur cité de Paul (« les 4 overlays en haut ne sont pas pratiques » · « un tableau de plateformes style netflix » · « chaque app porterait une icône »), constat conscience (débordement 64 px, 15/16 sous-norme, chevauchement bandeau/bouton 14 px), résolution en 5 points + champ `icone`. Le prompt des 7 icônes est déjà chez Paul (palette #1a1030 / #ffb86c / #ffd9a8 / #8b5cf6).

## 2. État vérifié (le fichier fait foi)
- **Production `index.html`** : **358 720 o, md5 `bf6ba1e165640f8ae3f51fb13720f0f3`, `APP_VERSION="8.3.0"`** (grep, lignes `//` écartées d'abord) — **bit à bit le staging M8-FUSION promu**. Base de mon morceau.
- **Anatomie lue sur pièces** : bandeau `#admin-banner` L189/806 (`position:fixed`, top 0, texte « 📁 MODE ADMIN — Glisse tes fichiers sur les documents. Ctrl+Espace pour quitter. ») · `#admin-tools-btn` L193/807 (« 📚 Mes applications », ambre, top:76) · `#tprof-btn` L201/808 (violet, top:36, porte `#tprof-testdot`) · lanceur `#admin-tools-menu` L196/863-870 (7 entrées, 5 avec le suffixe « — panneau prof ») · `openAdminTool` L4462 (**une seule définition, un seul appelant par entrée du menu : les 7 `onclick` L864-870** ; ferme le menu puis `window.open` par outil) · fermeture au clic extérieur L4465 (référence `admin-tools-btn` + `admin-tools-menu` — **appelant à traiter au retrait**) · sidebar L819-832 (« Tableau de bord » `dashboard`, 🏠 déjà en icône) · `_profSectionDashboard` L3330-3343 (Session · Niveau courant · 4 lignes « N chapitres en cache » — les informations que Paul ne lit pas) · routeur `_renderProfSection` L3227+ · sections historiques : `_profSectionEleves` L3249 · `_profSectionProfilTest` L3294 · `_profSectionArchi` L3344 · `_profSectionArchives` L4255 · `_profSectionPresence` L4276 · `_profSectionClasses` L4299 · media queries `tprof` : 768 (L434-450) + 480 (L451-453), héritage M8-FUSION · `activateAdmin` L3192 (appelle `publierManifesteREST` L1919 : **PUT réel** — avorté par mon harnais, preuve au journal réseau).

## 3. Mesures AVANT — établies par moi, harnais lecture seule stricte, DONNÉES RÉELLES du hub en GET
*Protocole : `file://` local ; GET vers `FIREBASE_BASE` autorisés (lecture des vraies classes) ; toute autre requête AVORTÉE (journal : 16 entrées/taille, 4 écritures avortées — 2 PUT `manifestes/index.json`, 2 POST `script.google.com` : un appel Apps Script de tracking subsiste dans le fichier, constat hors périmètre). Zéro clic : `activateAdmin()` / `toggleAdminTools()` / `openProfPanel()` / `showProfSection(id)` appelées PAR NOM, vérifié aux lignes citées §2. Dialogues refusés par défaut (aucun n'est apparu).*

### Mobile 390×844 (`is_mobile` + `has_touch`)
**Les quatre surfaces fixed, le problème vécu par Paul, reproduit et chiffré** :
| Surface | Rect | Constat |
|---|---|---|
| `#admin-banner` | (0,0) **390×51** | deux lignes, masque le haut |
| `#tprof-btn` | (247,36) 127×29 | **CHEVAUCHE le bandeau : 127×15 px** — le texte tronqué de la capture de Paul |
| `#admin-tools-btn` | (223,76) 151×30 | troisième étage |
| `#proto-badge` | (286,751) 88×25 | bas droite (entrée 5-tapes + pastille) |

**Lanceur ouvert** : 345×305 @y=108, 7 entrées **343×41 chacune — 7/7 sous-norme** (41 < 44).
**Panneau prof, section par section** (cibles = éléments interactifs visibles, sous-norme = h<44 OU w<44) :
| Section | Cibles | Sous-norme | Hauteur | Débordement X | Notes |
|---|---|---|---|---|---|
| dashboard | 0 | 0 | 661 | 0 | aucune cible ; Session + Niveau + 4× « chapitres en cache » |
| **classes** | 16 | **15** | 661 | **64 px** | **6 cibles HORS ÉCRAN à droite** ; pire bloc `tprof-class-row` 77 px ; actions ✏/📦/✕ **32 px de large** |
| **eleves** | 67 | **63** | **2 476** (2,9 écrans) | 0 | chips de classe **30 px de haut** (`[onclick]` non couverts par la règle générique M8-FUSION) ; ↻ 26 px de large |
| profil-test | 7 | 6 | 661 | 0 | mêmes chips 30 px |
| archi | 2 | 0 | 661 | 0 | |
| archives | 1 | 0 | 661 | 0 | |
| annonces / brevet / taxo | 3/5/1 | **0** | 661 | 0 | héritage M8-FUSION tenu |
| config | 7 | 0 | 883 | 0 | héritage M8-FUSION tenu |
| presence | 0 | 0 | 661 | 0 | **aucune cible rendue — personne en ligne à l'heure de la mesure ; couverture incomplète, déclarée §7** |

*Pourquoi 15 et 63 malgré la règle générique 44 px de M8-FUSION : elle couvre `button/input/select/textarea` en **hauteur** ; elle ne couvre ni les `[onclick]` sur div/span (chips 30 px), ni la **largeur** (actions d'icône 32, ↻ 26).*

### Desktop 1280×800 (référence à PRÉSERVER, pas à juger — la norme 44 px ne s'y applique pas)
Bandeau (0,0) 1280×33 (une ligne, aucun chevauchement : tprof-btn y=36 > 33) · lanceur 345×305, entrées 343×41 · classes : 16 cibles, actions 32×32, « + Nouvelle classe » 143×33, **0 débordement** · eleves 1 623 px de haut · toutes dimensions relevées dans `mesure_avant.json` — ce sont les valeurs que le rapport APRÈS devra retrouver inchangées.

## 4. Plan d'implémentation proposé (section dédiée « M8-MOBILE-2 », point 20 : on déplace, on ne réécrit pas)
**① Liseré.** `#admin-banner` devient le liseré : même élément, CSS remplacé — `position:fixed; inset:0; border:3px solid rgba(255,184,108,.85); pointer-events:none; z-index:9998; background:transparent;` — zéro pixel de contenu, visible en permanence, non cliquable par construction. Son TEXTE (glisser-déposer + Ctrl+Espace pour quitter) descend en tête de la section Accueil du panneau. → **Q1** : je le lis STRUCTUREL (les deux tailles : le bandeau masque aussi 33 px au desktop, et la règle « bénéfique aux deux écrans, à faire une fois pour toutes » s'applique) — à confirmer.
**② Bouton unique.** `#admin-tools-btn` disparaît avec son lanceur (④). `#tprof-btn` : au-dessus du seuil 768, **aucune ligne CSS desktop modifiée** (top:36 conservé) ; sous 768, media query : barre basse — `top:auto; bottom:0; left:0; right:0; border-radius:0; min-height:52px;` zone du pouce. Le point orange `#tprof-testdot` reste dedans (marqueur permanent du mode test, panneau fermé — invariant). → **Q2** : la barre basse recouvre la zone du `#proto-badge` (286,751) — le badge est l'entrée admin 5-tapes ET la pastille de version (règle bloquante de visibilité). Proposition : sous 768 **en mode admin seulement**, `bottom` du badge remonté au-dessus de la barre (`bottom:60px`) ; hors admin, rien ne change (le badge élève reste où il est, la barre n'existe pas hors admin). À trancher.
**③ Accueil.** Bouton sidebar : libellé « Tableau de bord » → « Accueil » (l'icône 🏠 existe déjà L819). `_profSectionDashboard` : retrait de Session, Niveau courant et « chapitres en cache » ; **une seule ligne d'état** — proposition : `Niveaux élèves : 3e ✅ · 4e ✅ · 5e 🚧 bloqué · 6e 🚧 bloqué` (source `BLOCKED_LEVELS`, la seule donnée à conséquence réelle). Dessous, **la grille** : `display:grid`, 2 colonnes sous 480, `repeat(auto-fill,minmax(150px,1fr))` au-dessus ; cartes ≥ 44 px évidemment, icône + nom, rien d'autre. Chaque carte : `onclick="openAdminTool('<id>')"` — **les cibles de `openAdminTool` ne changent pas d'un octet**.
**④ Retrait du lanceur.** Suppression : `#admin-tools-menu` (HTML L863-870), `#admin-tools-btn` (L807), leurs CSS (L193-200), `toggleAdminTools` (L3207), et la référence des deux ids dans le listener de fermeture L4465. Preuve par grep à zéro sur : `admin-tools-menu`, `admin-tools-btn`, `toggleAdminTools`, `atm-icon`. `openAdminTool` **conservé intact** (nouvel appelant : les cartes) — table des appelants avant/après au rapport.
**⑤+⑥ Données des cartes.** Une constante déclarative unique (schéma déclaratif, point 20) :
```js
var APPS_GRILLE=[
 {id:'dictee',          icone:'📝', nom:'Dictées coévaluées'},
 {id:'correction',      icone:'📋', nom:'Correction dictée'},
 {id:'reecriture',      icone:'✍️', nom:'Réécriture'},
 {id:'reecriture_bb4e', icone:'🎯', nom:'Réécriture BB4E'},
 {id:'evaluation_qcm',  icone:'🗳️', nom:'Évaluation QCM'},
 {id:'applause',        icone:'👏', nom:'Applaudimètre'},
 {id:'debat_s3',        icone:'🗣️', nom:'Pilotage du débat'}
];
```
D-M8F-2 se solde ici (plus aucun « — panneau prof »). → **Q3** : les noms courts ci-dessus retirent AUSSI les descripteurs (« (déconstruction note) », « — lecture coévaluée », « — Le triomphe simien ») au nom de « une icône, le nom de l'app, rien d'autre » — à valider ou amender.
→ **Q4, le champ `icone`** : le rendu passe par UNE fonction nommée `rendreIconeApp(app)` — aujourd'hui elle rend l'emoji en texte dans un conteneur dimensionné ; le jour des vraies icônes, SEULE cette fonction change (aucune ligne de mise en page). Je ne code PAS de détection d'extension ni de balise `<img>` spéculative : le format des futures icônes est inconnu (« tu prépares le point d'entrée, tu ne codes pas l'inconnu »). À confirmer.
**⑦ Passe tactile des sections historiques** (media query, desktop intact par construction) :
- Générique sous 768 : étendre la couverture M8-FUSION aux manques mesurés — `min-width:44px` sur les boutons d'icône du panneau, `min-height:44px` sur les `[onclick]` non-boutons (chips) via classe posée ou sélecteur d'attribut.
- `classes` : le débordement de 64 px — `flex-wrap` sur `tprof-class-row` sous 768, actions pleine largeur sous 480 (critère ④ : aucune action hors écran).
- `eleves` : 2 476 px = 2,9 écrans > critère ② (2 écrans max sans repli). → **Q5** : repli par classe (enveloppe de présentation autour du rendu intact, motif M8-MOBILE éprouvé), actif sous 768 seulement (matchMedia), desktop octet pour octet inchangé. C'est le geste le plus lourd du morceau — je demande le feu vert AVANT, ou le report en dette si tu juges le risque > le gain.
- `profil-test` : couvert par le générique (chips).
- `archi`, `archives` : déjà 0 sous-norme au mobile — vérification maintenue au rapport.
- `presence` : mesurée VIDE (personne en ligne) — je livrerai la couverture CSS générique et je déclarerai la limite ; je ne peux pas peupler la présence sans ÉCRIRE au hub, ce qui est interdit.
**Pastille** : `APP_VERSION` → `8.4.0` (+ date). Double parseur avant livraison. Annonce élève : AUCUNE (livrable purement prof).

## 5. Les invariants que je m'engage à prouver au rapport
Gardes `admin-mode` intactes (grep comparatif) · chemins Firebase inchangés · `openAdminTool` et ses `window.open` md5-identiques · marqueur permanent du mode test : pastille d'en-tête ET point flottant, re-vérifiés panneau fermé aux deux tailles APRÈS la passe (le bouton devient barre basse : le point doit y rester visible) · zéro écriture hub (journal réseau joint) · desktop : toutes les dimensions du §3 retrouvées inchangées · aucune fonction supprimée sans grep à zéro.

## 6. Questions à trancher avant code
- **Q1** liseré aux deux tailles (ma lecture : oui, structurel) ?
- **Q2** cohabitation barre basse / `#proto-badge` (ma proposition : badge remonté sous 768 en mode admin seulement) ?
- **Q3** noms courts des 7 cartes (liste §4⑤) ?
- **Q4** anticipation `icone` : fonction nommée seule, pas de rendu `<img>` spéculatif ?
- **Q5** repli par classe de « Élèves & codes » sous 768 : feu vert, ou dette ?

## 7. Écritures hub : ZÉRO
Lectures GitHub authentifiées (tailles + md5 §1-2) ; harnais : GET seuls, 4 écritures sortantes AVORTÉES par construction (journal `mesure_avant_reseau.json`). Je ne promeus jamais.
