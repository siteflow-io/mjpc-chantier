# M6-SOLDE — arbitrage ② + D1 · D4 · D6 · D8 · D10 · D13
*Exécutant M6, 18/07/2026. Livraison au sas — aucune promotion, aucune écriture hub.*

## 0. Empreintes

| Objet | md5 | Taille |
|---|---|---|
| Production (M6ter+ promue) | `7e7241fc49a925c4a355f1e0b81586c9` | 522 368 o |
| **M6-solde : `correction_dictee.staging.html`** | `e46cc2d76ecdeb421fd6e7708d5f5132` | 536 780 o |

Double parseur **OK** · banc **140/140 sur l'export réel** (105 → 140) · non-régression `pilotage_debat_s3.html` 12/12.

## 1. ② Arbitrage appliqué

`label:"Corrigée, pas encore rendue"` → **`"Disponible après la séance"`**. Tu avais raison : l'ancienne formulation nommait un état accompli du côté du professeur et un manque du côté de l'élève — la nouvelle ne dit plus que le déroulé.

## 2. D13 — dictionnaire de textes

**Architecture** : `TEXTES_DEFAUT` dans le code (seed, l'app vit si Firebase tombe) + surcharge par le nœud `correction_dictee_textes`. Un accesseur unique `txt(cle, vars)` ; aucun accès direct au dictionnaire ailleurs. **Un champ vide retombe toujours sur le défaut** — Paul efface pour revenir à l'original, il n'a jamais à le recopier.

**Les 4 champs**, avec la clé unique partagée demandée :

| Clé | Ce que voit l'élève | Où |
|---|---|---|
| `attente_copie` | *Elle sera disponible après la séance de correction.* | **deux emplacements, une seule clé** : écran d'attente du portail **et** arrivée sur le lien de copie |
| `liste_vide` | *Tu n'as pas encore de dictée. Celles de ta classe apparaîtront ici.* | « Mes dictées » vide |
| `invitation_rattrapage` | *Tu n'étais pas là le jour de cette dictée. Vois avec moi comment la rattraper, si c'est possible.* | écran d'attente, cas absent |
| `fin_parcours_titre` + `fin_parcours_emoji` | *🎉* / *Bravo {prenom} !* | fin d'autocorrection |

**Le « Bravo » est traité comme un ensemble** : le titre, l'emoji et le prénom sont trois décisions distinctes, éditables séparément. `{prenom}` est substitué ; **vider l'emoji n'affiche aucun bloc** (pas de div vide). Paul peut donc écrire « Tu as terminé, {prenom}. » sans emoji, ou tout autre chose.

**Éditeur** dans Réglages (« Ce que lisent les élèves ») : chaque champ avec son libellé, où il apparaît, un badge « modifié », et un bouton « Revenir au texte d'origine ». Enregistrement à la sortie du champ.

**Manifeste** : `correction_dictee_textes` déclaré **et préservé** (c'est du travail de conception, il doit survivre à la purge de rentrée). Nœud racine séparé, pas sous `correction_dictee/` — sinon il serait lu comme une dictée par `Object.keys()`.

**Ce qui reste en dur, volontairement** (critère du point 26) : « Pas encore corrigée », « Disponible après la séance », « Tu étais absent(e) », « Ce code ne correspond pas ». Ils constatent ; ils ne promettent rien. Testé.

## 3. D1 — mode test

**Analyse de l'existant d'abord** (point 16). L'ancien bouton créait une classe `_test_correction_dictee` (convention ✔) et une dictée corrigée pour 5 élèves. Ce qu'il ne faisait pas : **aucun code** (donc les élèves fictifs étaient refusés par le portail livré en M6 — le mode test était devenu inutilisable), aucun absent, aucune dictée non corrigée, aucune copie rendue, pas d'incarnation, pas de purge, rechargement manuel.

**Livré** : un composant `ModeTest` sur l'accueil.
- **Un clic** crée : classe `_test_correction_dictee` (6 élèves) + **leurs 6 codes** + **deux dictées** — A *rendue* (`copyPublishedAt` posé, corrections variées dont un type A) et B *pas encore corrigée* — avec **MOREAU Sacha marqué absent** sur A.
- **Les cinq états de l'élève sont donc testables en une minute** : Alice (10/10, rendue), Lucas et Thomas (à faire), Chloé (sans copie), Sacha (absent), dictée B (pas encore corrigée).
- **Nettoyage des zombies avant génération** : le bac à sable ne s'empile jamais.
- **Incarnation** : un bouton par élève ouvre l'**écran élève réel** dans un onglet (`?mode=eleve&incarner=<clé>`) — la chaîne se teste de bout en bout, pas une simulation. **Strictement limité au bac à sable** : l'incarnation ne résout que dans `classeTestId()`, un élève réel n'est jamais incarnable. Testé.
- **Purge exhaustive** : les 2 dictées, la classe, les 6 codes — et rien d'autre. Le message annonce ce qui sera supprimé avant de le faire.

## 4. D4 · D6 · D8 · D10

**D4 — corbeille.** La suppression d'une dictée archive maintenant sous `corbeille/<jour>/suppression-dictee_<HHMMSS>` ({_meta, data}, année scolaire dynamique) **avant** d'effacer. Deux ceintures : le fichier JSON local reste la première (immédiate, hors ligne), la corbeille du hub la seconde. Si l'archivage échoue, ce n'est pas un silence : un dialogue nomme l'erreur, rappelle que l'export local est fait, et **demande** s'il faut supprimer quand même.

**D6 — tableaux en mobile.** `Bilan` (9 colonnes) et `Suivi` (12) sont enveloppés dans `.table-scroll` : sous 820 px, `overflow-x:auto` et `min-width:620px` sur la table. Ils défilent au lieu de s'écraser. **Aucun effet en desktop** (la règle vit sous media query). Règles CSS ajoutées : `.table-scroll` et `.table-scroll table`, dans un bloc `@media (max-width:820px)`.

*Incident à signaler* : mon patch d'enveloppement a d'abord inséré un marqueur au milieu de `h("table"`, produisant `h("tab/*fx*/le")`. **Les deux parseurs sont passés** — c'était syntaxiquement valide, sémantiquement une balise inexistante. Rattrapé par ma vérification visuelle du résultat, pas par les parseurs. Rappel utile : `node --check` ne dit rien du sens.

**D8 — casse des classes.** Les trois résolutions côté prof passent par `classeDuRegistre`. Les deux accès directs restants (`CLASSES[c]`, `CLASSES[cn]`) itèrent sur les **clés du registre lui-même** : aucune divergence n'y est possible. J'ai d'abord écrit un test qui les condamnait à tort ; je l'ai corrigé plutôt que de « corriger » du code sain.

**D10 — « publier » désambiguïsé.** La dictée se **publie** (elle devient visible), les copies se **rendent**. Dix libellés côté prof : « 📤 Rendre les copies (n) », « 🔄 Rendre à nouveau », « ✕ Retirer les copies », « ✅ Copies rendues le … », « Copies pas encore rendues », « 🌐 Copies des élèves ». Le vocabulaire prof et le vocabulaire élève disent désormais le même geste avec le même mot.

## 5. Intégrité

Modifiés vs production : `Bilan` (2 lignes, enveloppe scroll), `Suivi` (2, idem), `Fiches` (1, point 28), `Copies` (5, libellés D10), `MaCopie` (1, point 28), `EleveCorrection` (6, point 28 + `txt()` de fin de parcours), `ExercicesEleve` (2, point 28), `buildCopieHtml` (2, principe cardinal). Intacts : `RapideGlobal`, `CorrEleve`, `ExercicesAdmin`, `ConfigAmenagee`, `gramComment` — **le moteur de correction et le moteur GRAMM n'ont pas été touchés de toute la passe**.

## 6. Wordings soumis (point 26 — je propose, Paul tranche)

**Mode test** — « 🧪 Créer le bac à sable » / « 🔄 Regénérer » / « 🧹 Tout effacer » · « Un clic crée une classe fictive, deux dictées et six élèves avec leurs codes — de quoi voir exactement ce que voit un élève dans chaque situation. Rien de réel n'est touché. » · « Se mettre à la place d'un élève (nouvel onglet) : » avec les mentions *(absent)* et *(sans copie)*.

**Suppression d'une dictée** — « Supprimer *<titre>* ? Elle sera archivée dans la corbeille MJPC (récupérable un an) et un export JSON sera téléchargé. Continuer ? »

**Éditeur de textes** — titre « Ce que lisent les élèves » · « Ces phrases s'affichent à l'écran de tes élèves. Modifie-les librement : un champ laissé vide revient au texte d'origine. » · l'ⓘ explique pourquoi certains messages ne sont pas là.

**D10** — les six libellés ci-dessus. Le seul point discutable à mes yeux : « Retirer les copies » (j'ai écarté « Dépublier », qui n'est pas un mot de classe).

## 7. Registre

**Soldées** : D1 · D4 · D6 · D8 · D10 · D13. **Rayée** : ~~D3~~.

**Ouvertes** : D2 (K.1, après M15) · D5 (alias Concordance, arbitrage Paul) · D7 (plan L69 : `validerEleveMJPC` mal décrit) · D9 (deux registres de classes en mémoire — la globale `CLASSES` et l'état `classesData`) · D12 (absence non partagée au hub, M15) · **chantier X** (rattrapage modal, brique posée).

**D14 (nouvelle)** — le dictionnaire de textes est **propre à la souche**. Le point 26 vise toutes les apps : quand une deuxième app en aura besoin, `txt`/`TEXTES_DEFAUT`/`chargerTextes` ont vocation à monter au socle (avec la pastille de version et `taxoCompter`, M15). Livrer deux implémentations divergentes serait le vrai risque.

## 8. Reste avant promotion

Audit visuel (desktop + mobile 390 px, dont les tableaux qui défilent) · **arbitrage des wordings du §6** · essai réel : créer le bac à sable, incarner Sacha (absent) et Chloé (sans copie), modifier un texte dans Réglages et vérifier côté élève, supprimer une dictée de test et vérifier la corbeille au hub · promotion sur son ordre. Je ne promeus pas.
