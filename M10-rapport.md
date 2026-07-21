# M10 — Les jumelles réécriture : rapport de livraison

**Exécutant → conscience n°2 / Paul.** Livré au sas : `reecriture.staging.html` (251 992 o, md5 `65b7c357c56e8b107c7e7dca0416b418`, base `a4a73129…` 239 262 o) + `reecriture_bb4e.staging.html` (121 250 o, md5 `ea93996a3c3b824f191e2909cf4bb8aa`, base `5798f252…` 108 540 o). Pastille **2.0.0** ×2 — **PREMIÈRE pastille de ces deux apps** : aucun historique de versions à chercher avant elle. Socle porté à **MJPC-CORE 1.1.0** ×2.

## 1. L'engagement n°1 : le moteur de pièges est INTACT — md5 avant/après

Toutes mesurées sur `reecriture` (bb4e n'en possède aucune — fait recroisé par toi) :

| Fonction | avant | après |
|---|---|---|
| mapSplitWordsToTokens | `4dd0aa8fa315` | `4dd0aa8fa315` |
| recomputeTokensForModif | `35e4c5e449b2` | `35e4c5e449b2` |
| tokenizeForCorrection | `2ef11505273a` | `2ef11505273a` |
| extractChangedWords | `da075005f085` | `da075005f085` |
| splitModif | `bae9f42fd412` | `bae9f42fd412` |
| buildModifMap | `5780b8d89deb` | `5780b8d89deb` |

**6/6 identiques.** Les 56 `piege` / 141 `attendu` / 74 `fautif` n'ont pas bougé d'un octet.

## 2. La parade anti-incident : vérification NOMMÉE du socle, ×2

Méthode déclarée (écart motivé) : le bloc socle embarque les constantes app-spécifiques (`MJPC_APP`, `MJPC_MANIFESTE`, `MJPC_PURGE`) — un remplacement de bloc entier les aurait écrasées. J'ai donc **prouvé d'abord** que 1.1.0 = 1.0.0 + §8 : les **10 fonctions communes sont md5-IDENTIQUES entre la souche 1.1.0 et les jumelles 1.0.0** (sanMJPC `1d99c7bed340`, cleClasse `784fcf80c6ab`, classeTestId `69ced895371f`, estClasseInterne `3ebd7d263773`, estClasseTest `5115aae90f02`, extractEleves `e7209d51b66d`, ecrireClasse `d5f084d58b72`, renvoyerVersMJPC `be1874f53801`, resolveEleves `06e42b4d2882`, publierManifeste `4584459262d2`, identiques dans les trois fichiers). Puis **ajout VERBATIM du §8** de la souche (lignes 439–470, 1 615 c : `lireSessionMJPC` + `validerEleveMJPC` + commentaires) avant la ligne de fin du bloc, en-tête et `MJPC_CORE_VERSION` portés à 1.1.0. Aucun regex de suppression n'a touché le socle.

Vérification nommée, une ligne par fonction, `grep -c "function X"` (lignes `//` écartées), **dans chacun des deux fichiers** :
sanMJPC=1 · cleClasse=1 · classeTestId=1 · estClasseInterne=1 · estClasseTest=1 · extractEleves=1 · ecrireClasse=1 · renvoyerVersMJPC=1 · resolveEleves=1 · publierManifeste=1 · lireSessionMJPC=1 · validerEleveMJPC=1.
Double parseur : `node --check` + acorn ES2020, verts ×2.

## 3. Table de gémellité R ↔ B (mêmes coutures, mêmes ancres sauf mention)

| Couture | reecriture | bb4e | Note |
|---|---|---|---|
| S1–S3 socle 1.1.0 + §8 verbatim | ✔ | ✔ | ancres identiques |
| P1 states (code, visibilité, shunt, mesLots) | ✔ | ✔ | identiques |
| P2 champ « Code personnel » + bouton Afficher | ✔ | ✔ | ancre B sans `title:` (variante historique de son formulaire) |
| P3 doLogin réécrit (MENEY retiré, 3 champs, textes validés, porte PROF_CODES) | ✔ | ✔ | fonction d'origine identique à l'octet dans les deux |
| P4 shunt §8 (garde anti-double, prof exclu, validation /classes) | ✔ | ✔ | identiques |
| P5a `?mode=prof` n'authentifie PLUS | ✔ | ✔ | voir §4 |
| P5b porte prof du portail (`onProf`) | ✔ | ✔ | identiques |
| P6 chargement `/codes` (lecture) | ✔ | ✔ | identiques |
| P7 écran « Mes réécritures » | ✔ | ✔ | identiques |
| E1/E3 pastille 2.0.0 + « ? » (annonces `site/annonces`, filtre contrat M6, LECTURE seule) + Réglages | ✔ | ✔ | second root React — zéro couture dans App |
| E2 bloc diagnostic en commentaire | ✔ | ✔ | identiques |
| F passe tactile `@media ≤480px` | ✔ | ✔ | premier `</style>` (le second vit dans un gabarit imprimable) |
| Sous-titre login + title accueil alignés sur le flux réel | ✔ | sous-titre ✔ / title absent | le title « connecte-toi avec ton nom et ton prénom » n'existe que dans R |

## 4. Constat de sécurité TROUVÉ ET FERMÉ (doctrine §VI, grille pt 7)

`?mode=prof` dans l'URL **authentifiait sans code** (`setProfAuth(true)` directement) — dans les deux fichiers. Une URL est déclarative, donc falsifiable : n'importe quel élève pouvait entrer prof. Corrigé : l'URL **pré-ouvre le champ code** (`setShowProfLogin(true)`), l'authentification n'a plus qu'un chemin, `tryProfCode`/portail. Prouvé au banc : `authDirecte:false` + champ code présent, ×2.

## 5. Preuves d'exécution (harnais lecture seule : Firebase FACTICE sur fixtures réelles du hub, React 18 servi localement, écritures journalisées jamais émises — le hub est intouché par construction)

Fixtures GET réelles : `/classes` (7 clés), `/codes`, `/reecritures` (lot « Réécriture brevet blanc 3e — 3E Charles de Gaulle »), `/reecriture_bb4e` (bb4e-4E BANKSY, bb4e-4E PYTHAGORE), `/site/annonces`. Fixtures de banc DÉCLARÉES : code `4242` injecté pour l'élève testé (voir §6), lot dupliqué `__lot_test_2` pour le multi-lots.

- **Sans code** → « Écris ton nom, ton prénom et ton code personnel. » ✔×2
- **Code faux** → « Ce code ne correspond pas. Vérifie-le, ou vois avec moi en classe. » ✔×2
- **Nom inconnu** → « Nom non reconnu. Vérifie l'orthographe, ou vois avec moi en classe. » ✔×2
- **MENEY/monsieur sans code** → refusé comme n'importe qui (la branche n'existe plus ; grep : seule trace = commentaire de retrait) ✔×2
- **Code bon** → entre : l'écran réel d'AUDEBERT Elise s'affiche (autocorrection achevée, note 5.5/10 — données réelles) ✔
- **Porte prof `1312` au portail** → panneau prof (« Réécritures existantes ») ✔×2 ; `?mode=prof` → refus d'auth ✔×2
- **Shunt §8** : session `mjpc_eleve` posée → l'élève entre **sans aucune saisie** — R : AUDEBERT Elise sur sa réécriture ; B : ALOYEAU Elyse sur sa copie 4E BANKSY ✔ ; session `is_prof:true` → shunt REFUSÉ, portail affiché ✔×2
- **« Mes réécritures »** : élève dans 2 lots → écran de choix, 2 boutons « → Ouvrir », retour ✔×2
- **Bouton Afficher** : `type=password` au chargement, bascule Afficher/Masquer, cible 65×44 ✔×2
- **Pastille/« ? »** : monté (second root), panneau version 2.0.0 + socle 1.1.0 + Nouveautés (filtre `!a.app||a.app===id||a.app==="*"`) ✔×2
- **Tactile 390** : 0 cible <44 px sur le parcours de connexion ✔×2. **Desktop 1280** : 5 cibles sous 44 px = l'état desktop PRÉEXISTANT hors media query — la passe ne s'applique qu'à ≤480 px : desktop inchangé, c'est une non-régression, pas un défaut.

## 6. **FAIT DE TERRAIN À ARBITRER PAR PAUL — les codes élèves**

**Aucun élève des lots réels actuels ne porte de code dans `/codes`.** Au portail durci, ils seraient tous refusés (« Ce code ne correspond pas ») tant que les codes ne sont pas attribués. Ce n'est pas un défaut de l'app — c'est le durcissement voulu, le même que le site — mais c'est un préalable d'usage : **avant toute utilisation en classe, attribuer les codes** (console MJPC / M17 à la rentrée). Le banc a utilisé un code fabriqué localement (`4242`), jamais écrit au hub.

## 7. Textes élève : posés / relevés / soumis

**Posés** (libellés déjà validés par Paul sur le site) : les trois messages du portail + sous-titre « Identifie-toi pour retrouver ta réécriture. » + title accueil R aligné (« …ton nom, ton prénom et ton code personnel »). **Relevés conformes au flux réel, non modifiés** : « 🎉 Bravo ! … Tu as travaillé sur toutes tes erreurs. C'est ce travail qui te fait progresser. » (affiché après travail effectivement complet — vu au banc), « Ta copie n'est pas encore corrigée », « (modifié, save en attente) ». **Soumis, non appliqués** : écran « Mes réécritures » — titre, « Choisis la réécriture sur laquelle tu veux travailler. », « → Ouvrir », « ← Retour » (textes nouveaux, nécessaires à la fonction, dans le ton sobre ; à valider).

## 8. Déclarations d'audit (Q1–Q7) et hors périmètre

Q1 retrait MENEY : fait, Paul entre par PROF_CODES au portail. Q2 textes du site : fait. Q3 alignement minimal : respecté — badges/libellés, zéro refonte du panneau React, charte propre conservée ; Réglages/annonces servis par un composant global sur second root (aucune couture dans les composants existants). Q4 pt 13 Concordance : N/A motivé, rien codé (pièges = paires sans catégorie ; couture future par le cycle certifié/déduit). Q5 présence bb4e : DETTE, aucun contrat de nœud modifié. Q6 annonces : lecture seule, filtre cloné du contrat M6. Q7 : 2.0.0, première pastille, noté.
Non testé : autocomplétion réelle de Chrome (enregistrement du code — à vérifier par Paul en vif), SDK Firebase réel et CDN réels (le banc les remplace), `?id=<lot>` (forcedId respecté par lecture de code, non joué au banc). Hors périmètre constaté : pas de métas anti-cache dans ces deux apps (dette ci-dessous) ; `?mode=eleve` URL conservé (pré-choix de mode, pas d'identité).

**Je ne promeus jamais** — les deux fichiers attendent ton audit au sas.
