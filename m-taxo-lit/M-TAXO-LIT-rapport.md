# M-TAXO-LIT — RAPPORT D'EXÉCUTION : le pan littéraire de la taxonomie
**02/08 · exécutant → conscience · Paul tranche notion par notion**

## 1. md5 — les deux supports
| support | base | livré |
|---|---|---|
| `taxonomie_atelier.json` (dépôt) | 80 663 o · `62d0ed999ab3569310d86f77ca8485eb` (v1.3.1) | **93 110 o · `26128f95a0c0b59f45f6cc672218497b` · v1.4.0** |
| `/taxonomie` (hub) | identique à la base du dépôt (vérifié) | **le MÊME fichier** |
**Comment je garantis qu'ils restent identiques** : le générateur écrit **une seule chaîne JSON**, sérialisée une fois, dans les deux destinations — `open(dépôt).write(s)` et `open(hub).write(s)`. **Ce n'est pas une comparaison après coup, c'est une identité par construction.** Vérifié : md5 égaux.
Documents lus : **les trois « ATTENDUS de fin d'année » (5e, 4e, 3e), en entier, par moi** · programme cycle 4 (BO 2015) · `index.html` production 679 981 o · `97bf48794e7dc4cd5821332ae467d9e6` (8.15.0) · canon `d9b40cc390a5034b294fbc8e31ca15cf` (1.5.0).

## 2. Ce qui est livré
**2 domaines · 11 familles (`fam-41` à `fam-51`) · 56 notions.** Total : 5→**7 domaines**, 40→**51 familles**, 154→**210 notions**.
**28 PRESCRITES** (citation verbatim) · **28 CHOIX DE PAUL**. `meta.version` **1.4.0**, `meta.date` 2026-08-02, `meta.notes` disant ce qui est ajouté et d'où il vient.
**Chaque notion porte un champ `source`** — c'est ce qui rend les deux colonnes lisibles dans la donnée elle-même, pas seulement dans ce rapport.

## 3. LE TABLEAU DES NOTIONS — trois colonnes, une ligne par notion
*(niveaux de la colonne B : **propositions graduées**, à trancher par Paul — « c'est moi qui dis, et l'IA conseille »)*

### dom-litterature — Le texte et ses formes

**fam-41 · Genres et formes littéraires**

| notion | niveau | source |
|---|---|---|
| `litt-001` **Les caractéristiques des genres littéraires** — *« Reconnaître à quelle famille appartient un texte »* — ex. : Un texte avec des répliques et des didascalies est du théâtre. | 5e-3e | **PRESCRIT** — 5e : « Il distingue les principales caractéristiques des différents genres littéraires » |
| `litt-002` **La tragédie** — *« Une pièce où le héros ne peut pas échapper à son malheur »* — ex. : Dans Antigone, l’héroïne sait qu’elle va mourir et avance quand même. | 4e-3e | **PRESCRIT** — 4e : « À la lecture d’un passage de tragédie » |
| `litt-003` **Le merveilleux, le réalisme et le fantastique** — *« Savoir si le récit accepte l’impossible, l’imite le réel, ou hésite »* — ex. : Dans un conte, une fée est normale ; dans un récit fantastique, elle inquiète. | 4e-3e | **PRESCRIT** — 4e : « Il distingue le merveilleux du réalisme, repère dans un récit le glissement propre au fantastique » |
| `litt-004` **La nouvelle à chute** — *« Une histoire courte dont la fin retourne tout »* — ex. : La dernière phrase révèle que le narrateur était le coupable. | 3e | **PRESCRIT** — 3e : « Il formule des hypothèses sur la fin d’une nouvelle à chute » |
| `litt-005` **Le poème en prose** — *« Un poème écrit sans vers »* — ex. : Le Parti pris des choses de Francis Ponge. | 3e | **PRESCRIT** — 3e : « Il rédige des poèmes en prose, à la manière de Francis Ponge » |
| `litt-006` **Le sonnet** — *« Un poème de quatorze vers, en quatre strophes »* — ex. : Deux quatrains puis deux tercets. | 5e-3e | **PRESCRIT** — 5e : « il récite un poème court, par exemple un sonnet » |

**fam-42 · Énonciation et voix narrative**

| notion | niveau | source |
|---|---|---|
| `litt-007` **La situation d’énonciation** — *« Repérer qui parle, à qui, où et quand »* — ex. : « Je t’attendrai ici demain » : qui est « je » ? qui est « tu » ? où est « ici » ? | 5e-3e | **PRESCRIT** — 5e : « Il identifie et interprète les éléments de la situation d’énonciation : qui parle à qui ? où ? quand ? » |
| `litt-008` **Les voix narratives** — *« Plusieurs personnes racontent dans le même texte »* — ex. : Un roman où chaque chapitre est raconté par un personnage différent. | 3e | **PRESCRIT** — 3e : « textes longs impliquant plusieurs voix narratives » |
| `litt-009` **Les énonciations imbriquées** — *« Un récit dans le récit »* — ex. : Un personnage raconte une histoire à l’intérieur de l’histoire. | 3e | **PRESCRIT** — 3e : « ou plusieurs situations d’énonciation imbriquées » |
| `litt-010` **La modalisation** — *« Les mots qui montrent si l’auteur est sûr, ou doute »* — ex. : « Il viendrait peut-être » : le doute s’entend. | 3e | **PRESCRIT** — 3e : « Il repère et interprète des marques de modalisation » |
| `litt-011` **La focalisation (interne, externe, omnisciente)** — *« Par les yeux de qui on voit l’histoire »* — ex. : En focalisation interne, on ne sait que ce que le personnage sait. | 4e-3e | **choix de Paul** |

**fam-43 · La construction du récit**

| notion | niveau | source |
|---|---|---|
| `litt-012` **L’ellipse narrative** — *« Un moment que le récit saute »* — ex. : « Dix ans plus tard… » : ces dix ans ne sont pas racontés. | 4e-3e | **PRESCRIT** — 4e : « Il comble l’ellipse narrative » |
| `litt-013` **L’anticipation** — *« Deviner la suite à partir d’indices »* — ex. : Un objet montré au début servira à la fin. | 4e-3e | **PRESCRIT** — 4e : « il formule des hypothèses… (anticipation) » |

**fam-44 · Les registres**

| notion | niveau | source |
|---|---|---|
| `litt-014` **Les procédés du comique** — *« Ce qui fait rire, et comment »* — ex. : Répétition, quiproquo, mot d’esprit. | 5e-3e | **PRESCRIT** — 5e : « il est sensible… aux différents modes de l’expression du comique dont il repère certains procédés » |
| `litt-015` **Le registre comique** — *« Un texte qui cherche à faire rire »* — ex. : Une scène de farce chez Molière. | 5e-3e | **choix de Paul** |
| `litt-016` **Le registre tragique** — *« Un texte où le malheur est inévitable »* — ex. : Le héros lutte contre un destin plus fort que lui. | 4e-3e | **choix de Paul** |
| `litt-017` **Le registre pathétique** — *« Un texte qui cherche à émouvoir »* — ex. : La mort d’un enfant racontée en détail. | 4e-3e | **choix de Paul** |
| `litt-018` **Le registre lyrique** — *« Un texte qui dit les sentiments de celui qui parle »* — ex. : Un poème d’amour à la première personne. | 4e-3e | **choix de Paul** |
| `litt-019` **Le registre satirique** — *« Un texte qui se moque pour critiquer »* — ex. : Une fable qui ridiculise les puissants. | 3e | **choix de Paul** |

**fam-45 · Les figures de style**

| notion | niveau | source |
|---|---|---|
| `litt-020` **La comparaison** — *« Rapprocher deux choses avec un mot de comparaison »* — ex. : « Il est fort comme un lion. » | 3e | **PRESCRIT** — 3e : « Il a recours à la comparaison et à la métaphore pour enrichir un écrit » |
| `litt-021` **La métaphore** — *« Rapprocher deux choses sans mot de comparaison »* — ex. : « Ce lion s’est jeté dans la bataille » (pour un homme). | 3e | **PRESCRIT** — 3e : « …et à la métaphore pour enrichir un écrit » |
| `litt-022` **L’ironie** — *« Dire le contraire de ce qu’on pense pour critiquer »* — ex. : « Quel beau travail ! » devant un devoir bâclé. | 3e | **PRESCRIT** — 3e : « il identifie l’ironie en relevant les techniques employées par Voltaire » |
| `litt-023` **Les figures d’opposition** — *« Mettre deux idées contraires côte à côte »* — ex. : « Je vis, je meurs. » | 4e-3e | **PRESCRIT** — 4e : « des indices textuels tels que les figures d’opposition » |
| `litt-024` **L’antithèse** — *« Opposer deux mots ou deux idées dans la même phrase »* — ex. : « Le jour succède à la nuit. » | 4e-3e | **choix de Paul** — les « figures d’opposition » sont attendues en 4e ; l’antithèse en est UN cas, que le texte ne nomme pas |
| `litt-025` **Les images du poème (continuité, discontinuité)** — *« Suivre comment les images se répondent dans un poème »* — ex. : Toutes les images parlent de la mer, puis soudain du feu. | 4e-3e | **PRESCRIT** — 4e : « il repère et interprète, dans un poème d’amour, la continuité ou la discontinuité des images » |
| `litt-026` **La personnification** — *« Faire agir une chose comme une personne »* — ex. : « Le vent hurlait. » | 5e-3e | **choix de Paul** |
| `litt-027` **L’hyperbole** — *« Exagérer pour frapper »* — ex. : « Je meurs de faim. » | 4e-3e | **choix de Paul** |
| `litt-028` **La litote** — *« Dire moins pour faire entendre plus »* — ex. : « Ce n’est pas mauvais » pour « c’est très bon ». | 3e | **choix de Paul** |
| `litt-029` **L’oxymore** — *« Réunir deux mots qui se contredisent »* — ex. : « Un silence assourdissant. » | 3e | **choix de Paul** |
| `litt-030` **L’anaphore** — *« Répéter le même mot en début de phrase ou de vers »* — ex. : « Rien n’est plus… Rien n’est mieux… » | 4e-3e | **choix de Paul** |
| `litt-031` **La gradation** — *« Ranger les mots du plus faible au plus fort »* — ex. : « C’est un roc, un pic, un cap. » | 4e-3e | **choix de Paul** |
| `litt-032` **La métonymie** — *« Nommer une chose par une autre qui lui est liée »* — ex. : « Boire un verre. » | 3e | **choix de Paul** |

**fam-46 · L’argumentation**

| notion | niveau | source |
|---|---|---|
| `litt-033` **Les formes argumentatives** — *« Reconnaître les différentes façons de défendre une idée »* — ex. : Une fable, un discours, un article peuvent tous argumenter. | 3e | **PRESCRIT** — 3e : « Il identifie différentes formes argumentatives » |
| `litt-034` **Thèse, arguments et exemples** — *« Distinguer l’idée défendue, les raisons et les preuves »* — ex. : La thèse : il faut lire. Un argument : cela enrichit. Un exemple : ce roman. | 3e | **PRESCRIT** — 3e : « il identifie la thèse défendue, les arguments et les exemples » |
| `litt-035` **Persuader et convaincre** — *« Toucher le cœur ou toucher la raison »* — ex. : Convaincre par des preuves, persuader par l’émotion. | 3e | **PRESCRIT** — 3e : « distingue dans l’argumentation le fait de persuader ou de convaincre » |

**fam-47 · L’analyse de l’image**

| notion | niveau | source |
|---|---|---|
| `litt-036` **Décrire une image fixe ou mobile** — *« Dire ce qu’on voit, avec les mots justes »* — ex. : Une photographie en noir et blanc, cadrée serré. | 5e-3e | **PRESCRIT** — 5e : « Il décrit des images fixes et mobiles » |
| `litt-037` **Les plans et le cadrage** — *« Savoir si l’on voit de près ou de loin, et ce qui est choisi »* — ex. : Un gros plan sur un visage ; un plan large sur un paysage. | 4e-3e | **PRESCRIT** — 4e et 3e : « vocabulaire adapté (formes, couleurs, contrastes, plans, cadrage et point de vue) » |
| `litt-038` **Le point de vue dans l’image** — *« D’où l’on regarde la scène »* — ex. : En plongée, on regarde d’en haut : le personnage paraît écrasé. | 4e-3e | **PRESCRIT** — 4e et 3e : « …plans, cadrage et point de vue » |
| `litt-039` **Le hors champ** — *« Ce que l’image ne montre pas, mais fait deviner »* — ex. : Un regard tourné vers quelque chose qu’on ne voit pas. | 3e | **PRESCRIT** — 3e : « Il comprend le hors champ et l’implicite » |

### dom-versification — Le vers et les sons

**fam-48 · Le vers et le mètre**

| notion | niveau | source |
|---|---|---|
| `vers-001` **Le décompte des syllabes** — *« Compter les syllabes d’un vers »* — ex. : « Je fais souvent ce rêve » : six syllabes. | 5e-3e | **choix de Paul** |
| `vers-002` **Le rythme du vers** — *« Dire un vers en respectant ses temps »* — ex. : On marque une pause au milieu de l’alexandrin. | 5e-3e | **PRESCRIT** — 5e : « il récite un poème court… en en respectant le rythme » |
| `vers-003` **L’alexandrin** — *« Un vers de douze syllabes »* — ex. : « Demain, dès l’aube, à l’heure où blanchit la campagne. » | 5e-3e | **choix de Paul** |
| `vers-004` **L’octosyllabe** — *« Un vers de huit syllabes »* — ex. : « Je me souviens des jours anciens. » | 5e-3e | **choix de Paul** |
| `vers-005` **Le décasyllabe** — *« Un vers de dix syllabes »* — ex. : Fréquent dans la poésie du Moyen Âge. | 4e-3e | **choix de Paul** |
| `vers-006` **Le e muet** — *« Un « e » qui se compte ou non selon la place »* — ex. : « Une rose » : le e final ne se compte pas devant une consonne. | 5e-3e | **choix de Paul** |
| `vers-007` **La césure** — *« La coupe qui partage le vers »* — ex. : L’alexandrin se coupe souvent après la sixième syllabe. | 4e-3e | **choix de Paul** |
| `vers-008` **L’enjambement** — *« Une phrase qui continue au vers suivant »* — ex. : La phrase ne s’arrête pas à la fin du vers. | 4e-3e | **choix de Paul** |
| `vers-009` **Le rejet et le contre-rejet** — *« Un mot isolé au début ou à la fin du vers »* — ex. : Un seul mot passe au vers suivant : il frappe. | 3e | **choix de Paul** |

**fam-49 · Les rimes**

| notion | niveau | source |
|---|---|---|
| `vers-010` **Les mots à la rime** — *« Relier les mots qui riment pour comprendre le poème »* — ex. : « Amour » rime avec « toujours » : le poème lie les deux idées. | 4e-3e | **PRESCRIT** — 4e : « il est capable de relier avec pertinence… dans un poème les mots à la rime » |
| `vers-011` **La disposition des rimes (plates, croisées, embrassées)** — *« L’ordre dans lequel les rimes reviennent »* — ex. : AABB : plates. ABAB : croisées. ABBA : embrassées. | 4e-3e | **choix de Paul** |
| `vers-012` **La richesse des rimes (pauvre, suffisante, riche)** — *« Combien de sons les mots ont en commun »* — ex. : « Ami / fourmi » : deux sons communs, rime suffisante. | 4e-3e | **choix de Paul** |

**fam-50 · Strophes et formes**

| notion | niveau | source |
|---|---|---|
| `vers-013` **La strophe (distique, tercet, quatrain)** — *« Les groupes de vers »* — ex. : Un quatrain a quatre vers. | 5e-3e | **choix de Paul** |
| `vers-014` **Le vers libre** — *« Un poème sans mètre ni rime réguliers »* — ex. : Les vers ont des longueurs différentes. | 3e | **choix de Paul** |

**fam-51 · Les sonorités**

| notion | niveau | source |
|---|---|---|
| `vers-015` **Les sonorités du poème** — *« Entendre les sons qui reviennent »* — ex. : Les sons durs peuvent traduire la colère. | 5e-3e | **PRESCRIT** — 5e : « Dans un poème, il perçoit les éléments (images, rythmes, sonorités) » |
| `vers-016` **L’allitération** — *« La répétition d’un même son de consonne »* — ex. : « Pour qui sont ces serpents qui sifflent sur nos têtes ? » | 5e-3e | **choix de Paul** |
| `vers-017` **L’assonance** — *« La répétition d’un même son de voyelle »* — ex. : « Les sanglots longs des violons. » | 5e-3e | **choix de Paul** |

## 4. La nuance de l'antithèse, à dire à un inspecteur
Les **« figures d'opposition » sont attendues en 4e** ; **l'antithèse en est un cas, que le texte ne nomme pas**. Elle est donc en **colonne B**, et son champ `source` le dit explicitement. Paul pourra dire : *« les figures d'opposition sont attendues en 4e ; j'ai choisi de nommer l'antithèse »* — **plus solide qu'une prescription empruntée**.

## 5. L'analyse de l'image — deux raisons, pas une
① **Prescrite aux trois niveaux** : 5e « Il décrit des images fixes et mobiles » · 4e et 3e « vocabulaire adapté (formes, couleurs, contrastes, plans, cadrage et point de vue) » · 3e ajoute « le hors champ ».
② **`CH_TYPES_SEANCE` porte `intro_image` — « Introduction et analyse d'image »** : c'est **le premier type de la progression de Paul**, donc **la séance 1 de chacun de ses chapitres**, et elle n'avait **aucune notion à porter**. Même trou que la poésie, sur le type le plus fréquent.
**`image` manque à `CH_KINDS` : je ne l'ai PAS ajouté** — il donnerait un type d'item que rien ne sait ouvrir, donc des items morts. C'est le morceau de l'app d'analyse d'image qui l'apportera avec son viewer, comme SITE-COURS-3a l'a fait pour le diaporama. **Signalé pour que personne ne le redécouvre.**

## 6. Anti-doublon — vérifié notion par notion
**NON créés, ils existent** : discours direct `gram-029`, indirect `gram-030`, indirect libre `gram-031`, transposition `gram-032` (`fam-17`) · sens propre/figuré `lex-006` (`fam-37`) · dénotation/connotation `lex-012` · champ lexical `lex-008` (`fam-40`) · niveaux de langue (`fam-38`) · **forme emphatique `gram-022`** · formes active/passive (`fam-15`).
**Le cas de l'emphase** : les attendus 3e la citent comme technique de l'ironie ; `gram-022` existe déjà en grammaire → **réutilisée**. C'est ce qui permettra à la Concordance de relier une emphase travaillée en grammaire et la même repérée chez Voltaire.
**Prouvé au banc** : aucun identifiant dupliqué (210), **aucun libellé professeur dupliqué**, et **les 154 notions existantes sont identiques à l'octet** (comparaison JSON notion par notion : 0 modifiée).

## 7. Les preuves — banc 15/15
· **Le prompt hérite SANS RETOUCHE** : `chVocabulaireTaxo` **non modifiée**, 182 → **238 entrées** (+56), les notions littéraires paraissent avec leurs niveaux (`- litt-020 : La comparaison [3e]`, `- vers-007 : La césure [4e-3e]`).
· **PREUVE PAR NOTION FACTICE** : une notion ajoutée paraît (239), **aucune liste retouchée**.
· **Désactivation réversible** : une notion `actif:false` disparaît du prompt **sans être supprimée** de la donnée — le mécanisme de l'éditeur M8bis fonctionne sur les domaines nouveaux.
· **LE POIDS, REMESURÉ (non estimé)** : vocabulaire **13 226 → 15 610 c., +2 384 c.** — j'annonçais +3 800 au cadrage, **la mesure est plus basse**. Prompt de chapitre : **14 346 → ≈ 16 730 c.** — **sous les 17 550 annoncés**, et du même ordre que le `PROMPT_CHAPTER` de worktrack. **Aucun bornage nécessaire.**
· **Numérotation** : `fam-01` à `fam-51`, **sans trou ni doublon**, à la suite de `fam-40`.
· **Forme** : chaque notion porte `libelleProf`, `libelleEleve` (**écrit pour un élève, jamais identique au libellé prof**), `exemple`, `niveaux`, `actif`, `source`.

## 8. UN DÉFAUT PRÉ-EXISTANT TROUVÉ, SIGNALÉ, NON RÉPARÉ
`chVocabulaireTaxo` compose ses en-têtes avec **`dom.libelle`** — mais les domaines portent **`libelleProf`**. Le prompt affiche donc **`### dom-ortho-lex`** au lieu de « Orthographe lexicale », **et ce depuis toujours, pour les cinq domaines existants**. Vérifié : le comportement est **identique avant et après** mon ajout — **rien n'est introduit**. Correction d'une ligne, dans `index.html`, hors de mon périmètre (je ne touche pas ce fichier dans ce morceau). **Signalé.**

## 9. DÉCLARATION DE COUVERTURE
**Testé** : tout le §7, sur les fichiers livrés.
**NON TESTÉ, ET JE LE DIS SANS L'ATTÉNUER** : **le banc navigateur n'a pas été joué** — donc **l'éditeur de taxonomie (M8bis) n'a pas été éprouvé à l'écran** sur les domaines nouveaux (arborescence, création, renommage, désactivation cliqués), **ni le mobile 390 px, ni les captures**. Le mécanisme de désactivation est prouvé **en mémoire** (une notion inactive disparaît du prompt sans être supprimée), la structure est identique à celle des cinq domaines existants que l'éditeur gère déjà — **mais rien n'est prouvé à l'écran**. **Le morceau ne doit pas être promu en l'état.**
Restent aussi non testés : l'écriture réelle au hub (aucune faite), Chrome Windows, et la lecture de Paul.

## 10. Reste à faire
1. **Banc écran** : éditeur M8bis sur `dom-litterature` et `dom-versification` (arborescence, création, renommage, désactivation réversible), 390 px, **captures**.
2. Les niveaux de la colonne B, à trancher par Paul.
3. Signalé : `dom.libelle` vs `libelleProf` dans `chVocabulaireTaxo` · `image` absent de `CH_KINDS`.
