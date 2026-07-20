# M8-FUSION — NOTE DE CADRAGE (exécutant — lundi 20/07/2026, après-midi, heure du conteneur TZ Paris ; l'outil d'heure de la plateforme est resté muet toute la journée)
*Une seule administration du site. Rien n'est codé : cette note attend l'audit de la conscience n°2.*

## Q0 — À TRANCHER AVANT TOUT : cette conversation EST M8-MOBILE
Le prompt me demande de lire « la conversation de l'exécutant précédent (M8-MOBILE) » : **c'est ce fil-ci** — Paul a collé le prompt M8-FUSION dans la conversation qui a livré M8-MOBILE ce matin. Or la règle gravée au plan (décision de Paul, 19/07, section A0) dit : **« FIN DES CONVERSATIONS EXÉCUTANTES CONTINUÉES — une conversation exécutante NEUVE par morceau »**, née de l'amnésie M6→M8. Deux lectures : erreur de collage (le prompt visait une conversation neuve — auquel cas cette note se recolle là-bas et je m'arrête ici), ou choix assumé de continuer (l'avantage réel : ma connaissance de M8-MOBILE est TOTALE, contexte vif, pas des extraits). **Je ne code pas avant cet arbitrage.** Si la continuation est retenue, j'applique le contrôle d'amnésie des exécutants continués à chaque reprise (mtimes du conteneur, historique du sas) — premier contrôle déjà fait : jeton présent (`10:14 UTC`), fichiers du morceau précédent intacts dans `/home/claude/mjpc`, tout reconnu comme mien.

## 1. Lecture ① — M8-MOBILE : totale, par mémoire vive
Rien à chercher par outil : cadrage, arbitrages (Q1 accordéon partout, Q2 sommaire sans mémorisation, Q3 porte incluse, Q4 hors-périmètre constaté), livraison (md5 `5b6eb7e1…`), preuves (diff 3 lignes retirées, `<details name>` écarté sur preuve de re-render), dettes D-M8M-1/2, et l'erreur ⑩ de la conscience (attribution CSS, contestation fondée) — tout est dans mon contexte direct. **Rien de manquant à déclarer** ; c'est la seule fois du chantier où la lecture ① est exhaustive par construction.

## 2. Lecture ② — plan ET cahier des charges
- **Plan** re-téléchargé authentifié : **284 805 o, md5 `15e9fddb79144f84766c50756a310ff0`** (il a évolué depuis ma lecture de ce matin, +8 179 o). Diff lu intégralement : promotion M8-MOBILE (11h50, commit `f3fca16f4a`), **règle « LE DESKTOP RESTE UN USAGE DE PLEIN DROIT » et ses 4 critères + corollaire de sécurité**, rapport de dérive du 20/07 (M7 soldé, M-SÉCU conforme au choix données martyres, 7 promotions/65 commits), erreurs ⑪ et ⑫ au registre. *Nota : je n'ai pas vu l'erreur ⑩ (attribution CSS, annoncée à mon audit M8-MOBILE) dans le diff du registre — soit elle est ailleurs dans le fichier, soit elle n'y est pas encore consignée ; simple constat.*
- **`MJPC6-audit-ergonomie.md`** : **7 571 o, 61 lignes, md5 `1109a0a55bb2541ff78e4565334fcbeb`** — **lu intégralement, ligne à ligne** (inventaire A, doublons B1-B6, coût en gestes C, mesures tactiles D, vocabulaire E, recommandations F1-F6, limites G). C'est bien le cahier des charges : le morceau exécute F1 (fusion, rangement Contenu/Système, bascule d'en-tête), F2 (panneau au téléphone, seuil 768), F3 (boutons flottants) ; F4 est absorbé par F1 (plus de « Console » du tout) ; F5 (passe `page-level`) et F6 (vocabulaire prof) restent HORS morceau — dettes déjà consignées (D-M8M-2) ou à consigner.

## 3. État vérifié (le fichier fait foi)
- **Production** : 356 815 o, md5 `5b6eb7e1aee516da6e04aeb08745d19e`, v8.2.0 — **c'est mon staging M8-MOBILE promu**, vérifié identique bit à bit à ce que j'ai livré.
- **Anatomie lue sur pièces** : boutons flottants L787 (`⚙️ Outils prof`, ambre, top:36) et L788 (`🛠 Panneau prof`, violet, top:76) · menu lanceur L~2510 : 7 liens actifs + **3 grisés** (« Grammaire (bientôt) », « Profil élève (à venir) », « Archives (à venir) ») · sidebar L797-812 : 4 labels, 8 sections · routeur `_renderProfSection` L3196 (if-chain), `showProfSection` L3191 (innerHTML de `#tprof-content`) · CSS `.tprof-*` L201-225, **aucune media query `tprof` dans le fichier** (les 4 `@media` du fichier : levels-grid + les 3 de la zone m8) — constat du cahier des charges confirmé · `m8BasculerModeTest` L946-951 (bascule `M8_TEST` + sessionStorage + `chargerBrevetDates`→`renderConsoleM8`) · `verifierAlerteRegles`/`ouvrirOverlayRegles` L1028+ : overlay bloquant J+29 **indépendant de la console**, intact par construction.
- **Appelants de `renderConsoleM8` en v8.2.0 — NEUF, pas huit** (le prompt en compte 8 : les 8 de la v8.1.0 ; ma section M8-MOBILE en a ajouté un) : L952 (`m8BasculerModeTest`) · L1011, L1019 (dates brevet) · L1071 (mode test/annonces) · L1115, L1126 (annonces) · **L1154 (`m8ToggleBloc` — le mien d'hier)** · L1264 (`ouvrirConsoleM8`) · L1560 (gestes taxonomie). Fait sourcé, à intégrer à la table des appelants du rapport.
- **Mesure de départ refaite au harnais** (même protocole lecture seule stricte que M8-MOBILE, stub GET, zéro clic) :
  - **390 px** : sidebar 230 px, **contenu 98 px** (le chiffre de la conscience, reproduit à l'identique) ; 9 cibles visibles sur mon stub (dashboard placeholder), 9 sous-norme — le 22/24 de la conscience comptait des sections peuplées de données réelles ; même verdict de fond, écart de données déclaré comme en M8-MOBILE.
  - **1280 px (référence à préserver)** : sidebar 230, contenu 868 ; boutons de section **229×41** — au desktop ils RESTENT à 41 px (règle desktop ① : dimensions d'avant la passe), le 44 px ne s'applique que sous le seuil.

## 4. Conception proposée
**Principe directeur : la symétrie avec M8-MOBILE.** Hier, une seule ligne de logique touchée (l'assemblage de `renderConsoleM8`) ; aujourd'hui, le même point de couture bouge encore — et rien d'autre dans la mécanique.

### ① La console rejoint le panneau — le pont `renderConsoleM8`
- **Sidebar** : sous *Contenu*, trois boutons nouveaux après Archives — `📢 Annonces aux élèves` (`data-section="annonces"`), `🎓 Dates du brevet` (`brevet`), `📚 Taxonomie` (`taxo`). Sous *Système* : le bouton `⚙ Configuration` est renommé **« ⚙ Configuration & Firebase »**.
- **Routeur** : trois lignes ajoutées à l'if-chain + trois fonctions de section nouvelles (`_profSectionAnnonces/Brevet/Taxo`), chacune rendant `<h2>…</h2>` + sous-titre + **`<div id="m8-console"></div>`**, posant `M8_UI.section` et déclenchant `renderConsoleM8()` (motif `setTimeout(…,0)` de `_blocTaxonomie`, motif de chargement async de `_profSectionProfilTest` — les deux existent déjà).
- **Le pont** : le corps de `renderConsoleM8` change — mêmes chargements (`chargerAnnonces` + `_siteGet('/site/config/dernierControleRegles')`), même cible `#m8-console`, mais l'assemblage rend LE bloc de la section active (`M8_UI.section` : annonces→`_blocAnnonces(annonces)` · brevet→`_blocBrevet()` · taxo→`_blocTaxonomie()` · config→`_blocRegles(ctrl)`) au lieu des cinq en accordéon. **Conséquence décisive : les 9 appelants n'ont pas à être modifiés** — ils appellent `renderConsoleM8()` qui re-rend la section du panneau où le geste vient d'avoir lieu (un geste d'annonce n'est possible QUE dans la section annonces, un geste taxo QUE dans la section taxo) ; si aucune section m8 n'est affichée, `#m8-console` est absent et la garde `if(!el) return` existante fait son office. `id="m8-console"` DÉMÉNAGE de `page-level` vers le contenu du panneau : l'id, la garde, les chargements et les chemins survivent tels quels.
- **`_blocRegles` dans Configuration** : `_profSectionConfig` existante est ENRICHIE (son rendu actuel + le rendu règles) — j'ouvre la fonction avant de trancher la couture exacte (concaténation en aval, sans réécrire son contenu) et je documente le hunk.
- **Aucun invariant touché** : gardes `admin-mode`, chemins Firebase, invariants taxonomie, contrat des annonces — les `_bloc*` sont appelées telles quelles, à l'octet près.

### ② Mode test : bascule permanente d'en-tête
- Dans `.tprof-header`, à droite du titre : pastille arrondie conforme à la maquette validée — état ACTIF : point orange lumineux + « Mode test actif » + mention discrète « rien n'est enregistré » ; état INACTIF (forme à confirmer, Q3) : pastille neutre « Mode test » cliquable. Sous 768 px : elle passe SOUS le titre (spécifié).
- **Câblage additif** : la pastille appelle un wrapper nouveau `m8BasculePastille()` → `m8BasculerModeTest()` (intacte) puis rafraîchit la pastille ; `renderConsoleM8` rafraîchit aussi la pastille à chaque rendu (une ligne additive) pour que l'état reste juste après tout geste.
- `_blocModeTest` cesse d'être appelée (ni section ni accordéon) — sort à trancher en Q1.

### ③ `#m8-console-wrap` disparaît de `page-level`
Le div L752 (titre « ⚙ Console du site » + bouton « Ouvrir / fermer la console » + `#m8-console`) est retiré ; `ouvrirConsoleM8` (L1260, appelée uniquement par ce bouton — grep joint) devient orpheline → Q1. L'appelant L1264 (`renderConsoleM8` dans `ouvrirConsoleM8`) disparaît avec elle si retrait ; sinon il reste inerte.

### ④ Boutons flottants
- `⚙️ Outils prof` → **« 📚 Mes applications »** ; retrait des **3 entrées grisées** (Grammaire · Profil élève · Archives — la 3e est le doublon B2 du cahier des charges).
- **Hiérarchie proposée (Q2)** : `🛠 Panneau prof` MONTE en premier (top:36, violet — l'administration d'abord), `📚 Mes applications` en second (top:76, ambre — le lanceur), le menu du lanceur suit son bouton (top:68→108). Purement CSS/HTML, desktop et mobile.
- *Constat annexe, hors périmètre sauf ordre contraire* : 5 libellés du lanceur portent « — panneau prof » (celui des APPS cibles) — homonymie avec « Panneau prof » du site, non traitée par le cahier des charges ; je le consigne au rapport sans y toucher.

### ⑤ Le panneau au téléphone — media query `(max-width: 768px)`, la première `tprof` du fichier
- `.tprof-overlay { padding: 12px }` · `.tprof-body { flex-direction: column }` · `.tprof-sidebar` : pleine largeur, hauteur auto, **barre horizontale défilante** (`display:flex; overflow-x:auto`, boutons `flex:none`, labels de groupe masqués sous le seuil), cibles ≥ 44 px · `.tprof-section-btn { min-height:44px }` · `.tprof-close` 44×44 · contenu pleine largeur. Variante « repliable » écartée (la barre défilante est validée par F2 et coûte zéro état JS).
- **Au-dessus du seuil : RIEN ne change** — sidebar verticale permanente 230 px, boutons 41 px, paddings d'origine ; preuve par mesure comparée avant/après à 1280 px (colonne desktop du rapport).

### Table de correspondance (préfigurée, au rapport en version prouvée)
| Ancien (console, `page-level`) | Nouveau (Panneau prof) |
|---|---|
| 🧪 Mode test (bloc accordéon) | Bascule permanente d'en-tête |
| 📢 Annonces aux élèves | Section *Contenu* → Annonces aux élèves |
| 🎓 Dates du brevet | Section *Contenu* → Dates du brevet |
| 📚 Taxonomie | Section *Contenu* → Taxonomie |
| 🔒 Règles Firebase | Section *Système* → Configuration & Firebase |
| « ⚙ Console du site » + porte d'entrée | disparaissent (fusion F1/F4) |

## 5. Aveux d'écart anticipés
- **`renderConsoleM8` sera réécrite en son corps** — c'est le point de couture, inévitable (le conteneur qu'elle servait disparaît) ; signature, cible `#m8-console`, chargements et garde conservés ; hunk documenté ligne à ligne au rapport. Les `_bloc*`, elles, restent intactes à l'octet (md5 de chaque fonction avant/après au rapport, comme l'audit conscience l'a fait hier).
- **`M8_UI` réaffectée** : `{ blocOuvert }` (accordéon d'hier) → `{ section }` — variable créée par moi hier, jamais persistée.
- L'accordéon M8-MOBILE (CSS `m8-acc*`, `_m8Accordeon`, `m8ToggleBloc`) a vécu **un jour** : la fusion le rend orphelin — Q1.

## 6. Questions à l'audit
- **Q0 — la continuation de conversation** (§0) : je m'arrête ici ou je continue ici ?
- **Q1 — sort des fonctions rendues orphelines par la fusion** (`_blocModeTest`, `_m8Accordeon`, `m8ToggleBloc`, `ouvrirConsoleM8`, CSS `m8-acc*`) : ma préférence — **retrait, avec preuve par grep** (zéro référence restante, point 20) : la dette se résout activement, et du code mort dans un fichier de 357 Ko est un piège pour les lectures futures. Alternative : conservation inerte. *(Les libellés utiles de `_blocModeTest` — « rien n'est enregistré » — sont repris par la pastille.)*
- **Q2 — l'ordre des boutons flottants** : Panneau prof en haut (proposé) ?
- **Q3 — la pastille au repos** (mode test INACTIF) : pastille neutre discrète « Mode test » cliquable (proposé), ou masquée avec activation ailleurs ? Et une **suggestion de sécurité** au-delà de la maquette : un point orange sur le bouton flottant `🛠` quand le mode test est actif, pour que l'état reste visible PANNEAU FERMÉ (le corollaire de sécurité du plan dit que la visibilité du mode test ne se tranche pas sur l'encombrement) — je ne l'implémente pas sans validation.
- **Q4 — le pont `renderConsoleM8`** (§4-①, les 9 appelants inchangés) : validé ?
- **Q5 — `_profSectionConfig` + `_blocRegles`** : concaténation en aval du rendu existant (proposé), sans réécrire la fonction — validé sur principe, couture exacte documentée au rapport ?

## 7. Écritures hub : ZÉRO
Toutes lectures authentifiées GitHub (tailles + md5 ci-dessus) ; harnais en stub GET, toute écriture avortée par construction.

J'attends l'audit avant de coder.
