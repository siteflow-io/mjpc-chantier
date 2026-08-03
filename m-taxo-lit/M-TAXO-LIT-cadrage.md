# M-TAXO-LIT — CADRAGE (exécutant → conscience)
**02/08 · j'attends le feu vert · Paul valide un vocabulaire qui vivra des années dans le profil de ses élèves**

## Lu (md5 mesurés)
plan de travail `bb37732b810ef75498ae5210e3d9e860` (avertissement lu en premier) · DOCTRINE `6918d27f3deb49dbc11083c9be127f79` · CHANTIER `aae67ef9209a5043811a7bacb07f488a` · ÉTAT-DES-LIEUX `a6749c3acd2a4721d5099debdb535a7d`.
**Les deux supports de la taxonomie, mesurés et COMPARÉS** : `/taxonomie` au hub et `taxonomie_atelier.json` au dépôt (80 663 o · `62d0ed999ab3569310d86f77ca8485eb`) — **version 1.3.1 des deux côtés, et strictement identiques** (comparaison JSON clés triées : `True`). C'est le point de départ, et c'est aussi ce que je devrai garantir en sortie.
**Source officielle lue en entier** : **Annexe 1 — Programme de français pour le cycle 4**, `education.gouv.fr/sites/default/files/document/Annexe 1 – Programme de français pour le cycle 4-480713.pdf` (le programme **rénové**, publié 2025).

## ⚠ CE QUE J'AI TROUVÉ SUR ÉDUSCOL — ET C'EST UNE CONTESTATION SOURCÉE
**Le programme du cycle 4 ne prescrit AUCUNE liste de notions littéraires.** J'ai lu le texte intégral : il ne nomme **ni « métaphore », ni « alexandrin », ni « sonnet », ni « allitération », ni « strophe », ni « registre tragique »**. Ce qu'il dit, littéralement :
· *« Apprendre à recourir à **quelques outils d'analyse pertinents** pour lire les textes rencontrés »* (5e) · *« Mobiliser à bon escient **quelques notions littéraires et outils d'analyse** pour interpréter un texte »* (4e) · *« Approfondir sa lecture en mobilisant **quelques notions littéraires et outils d'analyse pertinents** »* (3e).
· *« Chaque année, les élèves découvrent et mémorisent **une dizaine de notions** en lien avec les entrées de culture littéraire et artistique »* (Vocabulaire — indications quantitatives).
· *« **Compléter son lexique de l'analyse littéraire**, en particulier celui de **la poésie et de l'argumentation** »* (3e) · *« Enrichir son lexique de l'analyse littéraire, en particulier celui **du théâtre et du roman** »* (4e) · *« **Maitriser les outils d'analyse stylistique essentiels** »* (3e).
· Pour la poésie : *« la force des mots, **des sonorités, des rythmes et des images** »* · *« faire jouer la langue et **les contraintes formelles** »* · l'unité **« vers »** est employée partout (« une dizaine de lignes ou vers »).
**CONCLUSION, que je livre telle quelle** : **le texte officiel désigne des CATÉGORIES (sonorités, rythmes, images, formes, genres, style) et confie au professeur le choix des notions.** Donc **aucune notion de versification ou de figure ne peut être présentée comme « prescrite »**. Ma proposition sera **ancrée** dans ces catégories, mais **les notions elles-mêmes relèvent de l'usage scolaire et du choix de Paul** — et je le dirai notion par notion. *Le mandat suppose qu'Éduscol fournit la liste : il ne la fournit pas.*

## ⚠ LE CALENDRIER — sur quel programme je m'appuie
Le PDF lu est **le programme rénové** (5e à la rentrée 2026, 4e en 2027, 3e en 2028). **Les 3e et 4e de Paul sont donc sous l'ANCIEN programme cette année.** Sur le point qui nous occupe, **les deux ne divergent pas** : l'ancien programme employait déjà « quelques notions littéraires » sans les lister. **Je m'appuie sur le rénové** (il sera celui des élèves de Paul dès 2027) **et je signale qu'aucune divergence n'a été trouvée sur ce point précis.** Si le champ `niveaux` devait suivre l'ancien programme pour 2026-2027, c'est un arbitrage de Paul.

## Ce qui existe déjà, et que je ne duplique pas — vérifié notion par notion
· **Discours rapportés : DÉJÀ LÀ.** `dom-grammaire/fam-17` porte `gram-029` à `gram-032` (direct, indirect, indirect libre, transposition). **Je n'y touche pas et je ne crée aucun doublon** — alors que le mandat les cite comme manquants.
· **Registres de langue : DÉJÀ LÀ** en substance (le programme les range en grammaire : familier/courant/soutenu). ⚠ **À ne pas confondre avec les registres LITTÉRAIRES** (comique, tragique, pathétique) qui, eux, sont absents — et **absents aussi du texte officiel**.
· Les 9 occurrences de « rime »/« strophe » dans la taxonomie sont des **coïncidences** (élision, apostrophe, accords) : vérifié une par une.
· **Absents, confirmé** : sonnet (0), métaphore (0), comparaison (0), figure (0), énonciation (0), point de vue (0), narrateur (0), sonorité (0), allitération (0).

## Le découpage que je propose — DEUX domaines, et pourquoi
Le mandat en évoque trois blocs. **Je propose deux domaines, pas trois** : la versification et les figures relèvent toutes deux de **la manière dont le texte est fait** ; les genres, l'énonciation et le point de vue relèvent de **la manière dont le texte est raconté**. Un troisième domaine « registres » n'aurait ni source officielle ni contenu propre.
· **`dom-poesie-forme` — « La forme du poème »** (élève : *« Comment un poème est fabriqué »*) : le vers, les sonorités, les strophes et formes fixes. **Ancré** : *« sonorités, rythmes »*, *« contraintes formelles »*, *« vers »*.
· **`dom-texte-litt` — « Le texte littéraire »** (élève : *« Comment un texte est écrit et raconté »*) : figures de style, énonciation et point de vue, genres et registres littéraires. **Ancré** : *« images »*, *« outils d'analyse stylistique »*, *« caractéristiques des genres littéraires »*, *« caractéristiques d'écriture »*.
**Numérotation à la suite** (règle M8bis, les trous ne se comblent jamais) : familles à partir de **`fam-41`** (max actuel `fam-40`), notions `poe-NNN` et `lit-NNN` à partir de 001. **Domaines `ordre` 6 et 7.**

## LES NOTIONS PROPOSÉES — avec, pour chacune, sa source et son statut
**Statut A = catégorie ancrée dans le texte officiel · Statut B = notion d'usage scolaire, proposée par moi, que Paul tranche.**
**`dom-poesie-forme`** — *fam-41 Le vers et le rythme* : compter les syllabes d'un vers (A — « lignes ou vers », « rythmes ») · reconnaître alexandrin, décasyllabe, octosyllabe (**B**) · repérer la césure et l'enjambement (**B**). *fam-42 Les sonorités* : repérer les rimes et leur disposition (**B** — la catégorie « sonorités » est A) · distinguer allitération et assonance (**B**). *fam-43 Les strophes et les formes* : reconnaître une strophe et sa longueur (**B**) · reconnaître un sonnet (**B**) · repérer une forme libre ou un vers libre (**B**).
**`dom-texte-litt`** — *fam-44 Les images* : reconnaître une comparaison (**B**) · reconnaître une métaphore (**B**) · reconnaître une personnification (**B**). *fam-45 Les figures d'insistance et d'opposition* : repérer une anaphore (**B**) · repérer une antithèse (**B**) · repérer une hyperbole (**B**) · repérer une litote ou un euphémisme (**B**). *fam-46 Qui parle, qui voit* : identifier le narrateur et sa personne (**B**) · distinguer les points de vue (**B**) · repérer les marques de l'énonciation (**B**). *fam-47 Genres et registres* : reconnaître les caractéristiques d'un genre (A — « quelques caractéristiques des genres littéraires ») · identifier un registre littéraire (**B**).
**Total : 18 notions, 7 familles, 2 domaines.** **2 relèvent du statut A, 16 du statut B** — et c'est la mesure honnête de ce que le texte officiel prescrit.
**`niveaux`** : je propose `4e-3e` pour les figures d'insistance, l'énonciation et les registres ; `5e-3e` pour les images, le vers, les rimes et les strophes ; `3e` pour la litote. **⚠ Le programme ne donne AUCUN repère de progressivité sur ces notions** (il n'en cite aucune) : ces attributions sont **les miennes**, fondées sur ce que le programme situe par niveau (« lexique de la poésie » en 3e, « du théâtre et du roman » en 4e). **Elles ne sont pas sourçables, et je le dis plutôt que de fabriquer une référence.**

## Le poids, chiffré
Le prompt de chapitre fait **14 346 c.** avec 154 notions. Le vocabulaire d'une notion pèse ~70 c. → **18 notions ≈ +1 300 c., soit ≈ 15 700 c. (+9 %)**. **Aucun dosage nécessaire** : on reste sous les 17 719 c. déjà atteints par le prompt avec la présentation de MJPC (mesuré à M-PROMPT-4). **Rien ne sera tronqué.**

## Deux supports, une seule vérité
Je livre **les deux fichiers, produits par le même script** depuis une seule source, et je **prouve leur identité par md5 croisé** après génération. Le hub étant en lecture seule pour moi, **la promotion écrira les deux** — et je signalerai au rapport que rien, aujourd'hui, ne garantit automatiquement qu'ils ne divergent pas : **c'est une dette de mécanisme, pas de contenu**.

## Questions (3)
**Q1 — 16 notions sur 18 sont de statut B.** Est-ce acceptable, ou Paul préfère-t-il n'en retenir qu'un noyau plus court ? **Je ne peux pas leur donner une autorité officielle qu'elles n'ont pas.**
**Q2 — les `niveaux` ne sont pas sourçables.** Faut-il les poser quand même (au risque qu'une IA signale un « débordement » sur une base non fondée), ou les laisser larges (`5e-3e`) partout jusqu'à ce que Paul tranche ?
**Q3 — registres littéraires** (comique, tragique, pathétique, lyrique) : absents du programme, mais universels en classe. Je les propose en **une seule notion** plutôt qu'une par registre. Est-ce le bon grain ?
