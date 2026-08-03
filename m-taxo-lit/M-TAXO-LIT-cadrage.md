# M-TAXO-LIT — CADRAGE (exécutant → conscience)
**02/08 · j'attends le feu vert · Paul valide un vocabulaire qui vivra des années**

## Lu (md5 mesurés)
`taxonomie_atelier.json` (dépôt) **80 663 o · `62d0ed999ab3569310d86f77ca8485eb`** · `/taxonomie` (hub) — **les deux supports sont IDENTIQUES à l'octet** (comparaison JSON triée : `True`). Version **1.3.1**, **5 domaines, 40 familles, 154 notions**, tous de langue. Structure mesurée : domaine `{id, libelleProf, libelleEleve, ordre, familles}` · famille `{id, libelleProf, libelleEleve, ordre, notions}` · notion `{id, libelleProf, libelleEleve, exemple, niveaux, actif}`. **Familles numérotées `fam-01`…`fam-40`** ; **notions préfixées par domaine** (`ortho-lex-029`, `gram-042`, `lex-012`…).

## ⚠ DEUX CONSTATS SOURCÉS QUI COMMANDENT TOUT LE MORCEAU

### ① Le programme 2015 NE PRESCRIT AUCUNE LISTE de figures de style ni de versification
Lu en entier (programme cycle 4, BO 2015 — celui **en vigueur pour les 3e et 4e de Paul cette année**). Ce qu'il emploie réellement, **verbatim** :
· « **Notions d'analyse littéraire** » · « **Procédés stylistiques** » — **comme catégories, sans énumération** ;
· « **Genres littéraires : romans, contes, nouvelles, poésie, théâtre** » ;
· « une première approche de la classification des **genres et des registres** utilisés pour **produire des effets sur le lecteur** » ;
· « éléments de la **situation d'énonciation** : qui parle à qui ? où ? quand ? (marques de personne, de lieu et de temps) » ;
· « **paroles rapportées**, directement ou indirectement » · « marques de **modalisation** » ;
· « éléments linguistiques de **cohésion textuelle** » · « **progression du texte** (à thème constant, linéaire, éclaté) » ;
· « Observation de la prosodie et de l'organisation du texte à l'oral et à l'écrit (segmentation, ponctuation, paragraphe, **vers**…) » — **la seule occurrence de « vers »**, et elle est prosodique.
**ET IL DIT EXPRESSÉMENT** : « **L'inflation terminologique doit être évitée** : au cycle 4, il s'agit moins de parvenir à une connaissance exhaustive de tous les éléments de la phrase et du texte que de comprendre que la langue est un système. »
**CONSÉQUENCE, ET C'EST LA DISTINCTION QUE LE MANDAT EXIGE** : *rime, strophe, alexandrin, métaphore, personnification, hyperbole* **ne figurent pas dans le programme**. Les proposer comme « prescrits » serait **exactement l'invention de référence plausible** contre laquelle le mandat met en garde. **Je les proposerai donc comme AJOUT DE PAUL, jamais comme prescription** — la colonne « source » du rapport le dira notion par notion.
**Une piste que je n'ai pas pu vérifier** : le programme renvoie à une **annexe terminologique** (« La terminologie qui figure à la suite du programme est celle qui doit être connue des élèves »). **Je ne l'ai pas trouvée dans le PDF lu.** Si elle contient des termes littéraires, elle changerait le statut de plusieurs notions. **Je le signale plutôt que de conclure.**

### ② Le calendrier : je m'appuie sur le programme 2015
Les nouveaux programmes entrent en vigueur **en 5e en 2026, 4e en 2027, 3e en 2028** — **les 3e et 4e de Paul restent sous 2015 cette année**. Je bâtis donc sur 2015. Le projet 2025 réorganise la culture littéraire en **entrées par genre** avec notices et corpus : **si divergence, je signalerai au lieu de trancher** (aucune divergence relevée sur les termes que je propose, qui sont absents des deux).

## Ce qui existe déjà — vérification anti-doublon
| ce que j'allais créer | **existe déjà** | ma décision |
|---|---|---|
| discours rapportés | **`fam-17 Discours rapporté`** — `gram-029` direct, `gram-030` indirect, `gram-031` indirect libre, `gram-032` transposer | **NE PAS CRÉER** — je réutilise ces ids |
| sens figuré, métaphore | **`fam-37 Sens propre et sens figuré`** — `lex-006`, `lex-012` (dénotation/connotation) | **je ne duplique pas** ; les figures renverront à ce socle |
| champ lexical | **`fam-40 Champ lexical`** — `lex-008` | **NE PAS CRÉER** |
| types et formes de phrase | **`fam-15`** — 6 notions dont emphase `gram-022` | **NE PAS CRÉER** |
**Rien d'équivalent n'existe** pour : versification, figures de style, genres et formes, énonciation littéraire (point de vue, narrateur), registres, temps du récit.

## Le découpage que je propose — DEUX domaines, 8 familles, ~46 notions
**`dom-litterature`** (« Le texte et ses formes ») — *ce que le programme nomme « notions d'analyse littéraire »* :
· **Genres et formes** (`fam-41`) : roman · nouvelle · conte · théâtre · poésie · autobiographie · fable — **SOURCE : programme, « Genres littéraires : romans, contes, nouvelles, poésie, théâtre » + entrées annuelles (autobiographie en 3e, fable en 3e satire)**
· **Énonciation et point de vue** (`fam-42`) : situation d'énonciation · narrateur interne/externe/omniscient · récit à la 1re/3e personne — **SOURCE : programme, « éléments de la situation d'énonciation : qui parle à qui ? »** ; *« point de vue » figure dans les compétences (« construire son point de vue ») mais **pas comme outil d'analyse** : la focalisation est un **ajout de Paul**.*
· **Temps du récit** (`fam-43`) : ordre (retour en arrière, anticipation) · rythme (ellipse, pause, scène) · système des temps du récit — **SOURCE : partielle** — le programme prescrit « système des temps » et « indicateurs de temps » ; **ellipse, sommaire, pause sont un ajout de Paul (terminologie de Genette, hors programme)**
· **Registres** (`fam-44`) : comique · tragique · pathétique · lyrique · satirique/ironique — **SOURCE : programme, « classification des genres et des registres »** — *le programme nomme la catégorie mais pas les registres : la liste est un **ajout de Paul**, ancré sur les entrées (satire en 3e, lyrisme en 4e « Dire l'amour », tragique en 4e)*
**`dom-versification`** (« Le vers et les sons ») — **entièrement un AJOUT DE PAUL**, le programme ne prescrit rien :
· **Le vers et le mètre** (`fam-45`) : syllabe et décompte · alexandrin, décasyllabe, octosyllabe · césure · enjambement, rejet, contre-rejet · **e** muet
· **Les rimes** (`fam-46`) : disposition (plates, croisées, embrassées) · richesse (pauvre, suffisante, riche)
· **Strophes et formes fixes** (`fam-47`) : distique, tercet, quatrain · sonnet · vers libre
· **Les sonorités** (`fam-48`) : allitération · assonance
**Et les figures de style** — dans `dom-litterature`, `fam-49` **Figures de style** : comparaison · métaphore · personnification · hyperbole · litote · antithèse · oxymore · anaphore · gradation · métonymie. **AJOUT DE PAUL** (le programme dit « procédés stylistiques » sans liste), **et adossé à l'existant** : `lex-006` sens figuré en est le socle, je ne le duplique pas.

**Numérotation** : familles **`fam-41` à `fam-49`** (à la suite du max `fam-40`, **les trous ne se comblent jamais**) ; notions **`litt-001…`** et **`vers-001…`** (nouveaux préfixes, cohérents avec l'existant).
**`niveaux`** : je m'appuierai sur les **entrées annuelles du programme** (elles datent les objets : lyrique en 4e « Dire l'amour », satire en 3e, autobiographie en 3e, poésie en 3e « Visions poétiques ») **et sur le repère « l'accent est mis sur le niveau textuel en 4e et 3e »**. Chaque attribution sera justifiée au rapport. **Les 3e et 4e étant les classes de Paul, je ne fixerai pas de niveaux 6e/5e que je ne peux pas fonder.**

## Le poids
Prompt de chapitre actuel : **14 346 c.** avec 154 notions. Le vocabulaire pèse **≈ 70 c. par notion** → **+46 notions ≈ +3 200 c.**, soit **≈ 17 550 c.** Au-delà du `PROMPT_CHAPTER` de worktrack (14 974) mais **du même ordre**. **Je ne propose pas de bornage** : la taxonomie sert à taguer, une notion absente du prompt ne peut pas être taguée. **Si tu veux un dosage, il faudra le décider ici et non le subir** — je le dirai au rapport avec le chiffre mesuré après coup.

## Questions (3)
**Q1 — Le statut des notions non prescrites.** ~35 des 46 notions sont des **ajouts de Paul**, pas des prescriptions. Est-ce recevable ? *Sans elles, une séance de poésie reste sans notion — mais je ne peux pas les présenter comme officielles.*
**Q2 — L'annexe terminologique du programme** : je ne l'ai pas trouvée. Faut-il que je la cherche plus avant avant de coder (elle pourrait requalifier plusieurs notions en « prescrites »), ou livre-t-on avec la distinction telle quelle ?
**Q3 — `dom-versification` séparé, ou une famille de `dom-litterature` ?** Je propose **séparé** : la versification a sa propre logique et Paul la travaille en bloc sur un chapitre de poésie. Mais cela fait **7 domaines** au lieu de 5 — l'éditeur M8bis les affichera tous. Confirmes-tu ?
