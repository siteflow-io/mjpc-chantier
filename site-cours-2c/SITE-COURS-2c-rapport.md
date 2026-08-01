# SITE-COURS-2c — RAPPORT D'EXÉCUTION : le prompt maître de chapitre
**01/08 · exécutant → conscience · checklist à preuves**

## 1. md5
DISPOSITIF `6546b8b2ff84397e2549da60eac184d2` · DOCTRINE `fb3da0c7aa87cae38737e5944cbd7659` · doctrine du site `bbc34f10fd772eb16b0268cafaebe3f5` · CHANTIER `cc4dce63391d55faa3e1ef4f6afe0a5c` · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d` · journal `8ceedbd58c984263fc70863285a874a3` · canon `d89d456389f598c7a731cf894a60a4cb` (1.4.0) · **taxonomie lue au hub** 54 466 o · `5600f48122e16f41fde291d75e944f74`.
**Base** `index.html` re-téléchargée à l'instant de l'édition : 585 177 o · `7731b10b421579055596816be4597b84` (8.11.0) → **livré 623 281 o · `ff0d05badcd7ffd485ebc7875ba55386` · 8.12.0**.

## 2. UNE MESURE QUI CHANGE LE MORCEAU, ET UN PIÈGE ÉVITÉ
**`index.html` embarquait encore le canon 1.3.0** : SITE-COURS-2a (8.11.0) est antérieur à M-PROMPT-1, donc **le site n'avait jamais reçu la §12** — dont ce morceau dépend (`mjpcPromptVocabulaire`, `mjpcValidation`). Le mandat ne le disait pas ; mesuré, corrigé.
**⚠ PIÈGE ÉVITÉ, à consigner** : dans `index.html`, **la pastille `APP_VERSION` et son en-tête de commentaire sont INSÉRÉS AU MILIEU du socle embarqué** (entre la §9 et la §11 — mesuré : socle 156 075→175 836, pastille à 171 981). Remplacer le socle en bloc, comme dans les huit apps, **aurait supprimé la pastille et tout son en-tête de restauration**. J'ai donc **ajouté la §12 seule, verbatim**, sans toucher une ligne du reste — et le canon ↔ embarqué ressort à **31/31 à l'octet**. *Leçon pour les morceaux suivants : le socle d'`index.html` n'est pas contigu.*

## 3. La preuve que « ajouter un produit = une entrée de plus »
**Vraie, et prouvée deux fois** : ① l'entrée `fiche_seance` du seed est **présente à l'identique** dans le livré ; ② les **neuf fonctions de la mécanique** (`atIAChargerPrompt`, `atIACopier`, `atIAModifier`, `atIAEnregistrerTpl`, `atIAValider`, `atIAApercu`, `atIAAppliquer`, `atIAInjecterNeuve`, `atIARemplacer`) sont **identiques à l'octet**. Le chapitre s'ajoute par **une entrée de seed + une source de vocabulaire**. Seule `atPromptTexte` change — d'une ligne, pour brancher les jetons du nouveau produit sans toucher celui de la fiche. **Diff : 7 hunks, +623, −3 lignes**, et les trois retraits sont la pastille, la version du socle et cette ligne.

## 4. Le prompt maître
Composé par le canon : cadrage imposé (`NE PRODUIS AUCUN JSON TOUT DE SUITE`), **demande de SES documents** (« de quels documents je dispose »), consignes de **mise en cohérence** (séance sans compétence, notion hors attendus, trou, doublon — **rendues en discussion, pas dans le JSON**), les **7 types de séance mesurés**, et **la taxonomie ENTIÈRE générée** : 154 notions + compétences, chacune avec ses niveaux entre crochets, groupées par domaine. Longueur totale mesurée à l'écran : **14 346 caractères** — sous les 14 974 du `PROMPT_CHAPTER` de worktrack qui tourne en production. **Aucun bornage, argumenté au cadrage et adopté.**

## 5. Le parcours ①→⑦ (banc mémoire 25/25, banc navigateur 13/13)
① **prompt** : cadrage + 7 types + taxonomie générée, `[6e-3e]` affiché, aucun jeton résiduel · **preuve de génération** : une notion factice ajoutée paraît (155 entrées), une notion **inactive** est exclue.
② **inventaire face à face** : l'existant **listé précisément** (séance, item, `kind`/`source`, état de liaison), en regard **NOUVEAU / DÉJÀ LÀ / DIFFÉRENT** par item ; **notions nommées EN LIBELLÉ**, jamais l'identifiant seul (règle des deux publics).
③ **compléter** : **écriture PAR INDEX** (`/site/3e/chapitres/3/seances/1/items/…`), **jamais la liste entière, jamais `push`** — prouvé au journal réseau ; l'item déjà là **n'est pas retouché** ; la séance nouvelle prend un rang neuf ; **le trou d'index 0 est traversé, jamais supprimé** ; les tags ne s'ajoutent que là où il n'y en avait pas.
④ **remplacer** : **archive AVANT** (arch@0 < doc@1), archive `{_meta,data}` portant l'ancien chapitre, et **archive en échec → ABANDON, « rien n'a été remplacé »** ; la **publication existante est conservée**, jamais décidée ici.
⑤ **jumeau** : rang neuf en fin de liste, titre suffixé « (proposition) », **non publié**, l'existant intact.
⑥ **liste de travail** : « À lier toi-même (1) » — la séance, l'item, l'outil et la raison, affichés.
⑦ **refus** : cinq défauts → motifs **accumulés**, chacun citant l'élément (type de séance inconnu, clé non conforme, `kind` inconnu, `published` interdit) — et **une notion inventée est refusée EN ÉTANT NOMMÉE**.
**`published` n'est JAMAIS écrit par l'injection** : vérifié au banc mémoire (nettoyage récursif) et **au journal réseau** du banc navigateur.

## 6. Le reste des preuves
**PORTÉE** (règle du 01/08) : les **19 fonctions** vérifiées présentes sur `window` dans la page réelle. **Une ancre a d'ailleurs failli être fausse** : `/* ═══ fin § ZONE PROMPT IA ═══ */` existe **deux fois** — une dans le CSS, une dans le JS ; ancrée par contexte sur la portée JS.
**Statique** : double parseur script par script **VERT** · **canon ↔ embarqué 31/31 à l'octet** · **0 fonction supprimée**, 2 modifiées (`atPromptTexte`, `atIARendre` — le bouton d'accès), 23 ajoutées · diff **0 retrait hors motifs**.
**Écran** : signalement discret des **deux graphies de classe**, sans bouton de correction (dette au §7) · overlay des règles **neutralisé**, captures nettes `img-j01…j05` · **mobile 390 : aucun débordement introduit**, écran chapitre ouvert · trois voies à cibles ≥ 44 px, **aucune pré-choisie** · **aucune écriture avant le choix**.
**Symptômes instruits** : `/manifestes` et `/presence` au journal → **pré-existants** (leurs appels sont dans `index.base.html`, 4 occurrences), écartés par preuve ; la garde `secuExigeCle` bloquait mon banc → la clé posée, la garde est légitime.

## 7. Dettes et signalements
· **Les deux graphies de `published`** (`3e_charles_de_gaulle` / `3E Charles de Gaulle`) : signalées à l'écran, **non corrigées**. La répartition suit l'ordre des chapitres — trace de deux époques d'écriture.
· **Le dispatch des outils est reporté (2d)** : trois impossibles (réécriture → `tokenIdx`, tokenisation interdite ; dictée → `analyseGramm` et `pairs` ; correction_dictee → sans dictée), deux redondants (QCM, analyse_logique ont leur chaîne canonique).
· `atIAAppliquer` écrit déjà `chapitre`/`seance` (pour SITE-COURS-2b, cascade d'adresses).
· Créée ici : le socle d'`index.html` n'est **pas contigu** — tout morceau qui voudra le remplacer en bloc doit le savoir.

## 8. DÉCLARATION DE COUVERTURE
**Testé** : tout le §5 et le §6. **Non testé, déclaré** : le hub réel (interceptions ; **aucune écriture réelle**, le vrai `/site/3e` est intact) · une vraie discussion avec une IA et la qualité de ce qu'elle renvoie · Chrome Windows · l'impression · le rendu visuel des captures (aperçu local en défaut ; dimensions et assertions DOM cohérentes) · le comportement quand deux chapitres portent le même titre (le premier trouvé gagne — comportement déclaré, non éprouvé) · la recette de Paul.

## 9. Livraison
`site-cours-2c/` : `index.staging.html` · ce rapport · le cadrage · `bancsc2c-memoire.js` + `bancsc2c-verdicts.json` (25) · `bancsc2c-nav.js` + `bancsc2c-nav-verdicts.json` (13) + `bancsc2c-reseau.json` · `diffsc2c-bilan.json` · `assemble-sc2c.py` + `assemble-sc2c-b.py` · `taxonomie.json` (la lecture du hub qui a servi de source) · captures `img-j01…j05.png`. Bit à bit vérifié après téléversement.
