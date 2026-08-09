# CORRECTEUR DE SNAPSHOTS — rapport de mission
Conscience n°5 · MJPC 6 · 09/08/2026

## Ce que la mesure a montré (et qui corrige le modèle du brief)

Le décalage n'est **pas constant** : essayés loyalement de −12 à +12, les meilleurs
décalages uniques ne remettent en place que 30 % (3e), 22 % (Banksy), 21 % (Pythagore)
et 64 % (Grandes découvertes) des positions. La cartographie le long du texte montre
pourquoi : le décalage évolue **en paliers monotones** (Banksy : 0 → −1 → −2 … → −9 ;
Grandes découvertes : 0 → +1 → +2). C'est la signature d'une **translation entre deux
découpages** : à chaque site où l'ancienne tokenisation différait de l'actuelle, le
décalage change d'un cran et reste stable jusqu'au site suivant.

Les sites sont identifiés : **les apostrophes d'élision**.
- Les trois brevets ont été corrigés sous une tokenisation où **l'apostrophe était un
  jeton à part** (« s'approchèrent » → « s », « ' », « approchèrent ») : remise en place
  de **100 %** des erreurs-mots des trois dictées (262/262, 358/358, 353/353) — c'est la
  preuve de l'identification.
- Grandes découvertes a été corrigée sous une tokenisation plus ancienne encore, où
  **l'apostrophe restait collée au mot entier** (« s'approchèrent » = un seul jeton) :
  **100 %** également (169/169).
- La 5e Utopie est à 100 % sous la tokenisation **actuelle** : corrigée après le
  changement, rien à faire.

## La méthode appliquée par l'outil (`correcteur_snapshots.js`)

1. `tokenize` actuel : **extrait verbatim** du `correction_dictee.html` de production
   passé en argument et exécuté tel quel — jamais réécrit.
2. Identification de l'ancienne tokenisation **par dictée**, parmi trois candidates
   plausibles : retenue uniquement si elle remet **100 %** des erreurs-mots en place ;
   sinon la dictée n'est pas corrigée (rien d'incertain n'est réinjecté).
3. **Translation par positions de caractères** : chaque jeton couvre une plage du texte ;
   l'idx ancien est envoyé sur le jeton actuel qui couvre son caractère de départ.
   Déterministe et monotone — **aucune recherche d'occurrence de mot** : les quatre
   « caddie » du brevet 4e ne peuvent pas être confondus, chacun est à sa plage.
4. **Vérification finale position par position** : `tokens[idx corrigé] === word` à
   l'identique, sinon la position est signalée, pas corrigée.
5. **Seul `idx` change** — comparaison structurelle intégrée, et contre-vérification
   indépendante relue depuis les fichiers écrits : **1 073 idx modifiés, 0 champ modifié
   hors `/errors/N/idx`, sur l'ensemble des cinq fichiers.**

## Dictée par dictée

### 5e Utopie (Hergé) — INCHANGÉE
Avant : 547/547. L'outil ne modifie rien ; le fichier de sortie est la **copie à l'octet
près** de l'entrée (md5 identiques : `15db72d7511d9513fc3ec94be51f1582`).

### Brevet blanc 3e (Charles de Gaulle) — 33/262 → **262/262**
Ancienne tokenisation : apostrophe séparée. 256 idx modifiés (229 mots + 27 M/P).
Aucune position non corrigée. Détail M/P (position d'insertion translatée, invérifiable
par mot — à relire d'un œil si besoin) : le signe P oublié par 18 élèves passe de
l'idx 128 à **125** ; les M de chalumeau_jules, heinrich_clovis (×3), laury_mael (×3),
poulain_helin_zelia, tenneguin_arthur, deslin_lucas et chan_aymeric (P) suivent le même
mouvement (liste complète dans `*_verdict.json`).

### Brevet blanc 4e Banksy — 22/358 → **357/358 + 1 cas déclaré**
Ancienne tokenisation : apostrophe séparée. 340 idx modifiés (335 mots + 4 M/P +
1 apostrophe). Le cas déclaré : moquet_mathis, mot « qu » — le jeton actuel est « qu' »
(l'apostrophe a rejoint le mot au changement de découpage). Sa **position est corrigée**
(idx 110 → 104, prouvée par la translation) mais l'égalité stricte `jeton === word` est
impossible par nature ; l'option `--strict` de l'outil le laisserait intouché.
M/P translatés : cadiou_fourrier_louann (M ×2 : 32→30, 44→41),
grosbois_cailloneau_margaux (M : 91→86), montais_sacha (P : 113→106) ; le P restant de
cadiou_fourrier_louann était en zone de décalage nul, déjà en place.

### Brevet blanc 4e Pythagore — 21/353 → **353/353**
Ancienne tokenisation : apostrophe séparée. 336 idx modifiés (332 mots + 4 M/P :
alligand_louka 44→41, colas_nathan 65→61, gaucher_julian 63→59, znidi_iyad 116→109).
Aucune position non corrigée.

### 5e Grandes découvertes — 24/169 → **163/169, 6 signalées**
Ancienne tokenisation : apostrophe collée au mot entier. 141 idx modifiés (139 mots +
2 M : bouton_amauri 72→73, meunier_annabelle 45→46). **Six positions ne peuvent pas être
corrigées avec certitude** : leur mot est une élision entière que la tokenisation
actuelle découpe en deux jetons — l'égalité stricte est impossible. Elles restent à leur
idx d'origine et sont listées pour traitement manuel :

| élève | idx actuel | mot attendu | jetons actuels à la position proposée |
|---|---|---|---|
| bourdais_maxime | 20 | s'approchèrent | « s' » + « approchèrent » (position 20) |
| gasoyan_lucas | 20 | s'approchèrent | idem |
| oriot_lisa | 20 | s'approchèrent | idem |
| reclu_philippine | 20 | s'approchèrent | idem |
| zilli_marin | 20 | s'approchèrent | idem |
| guegnard_lysandre | 72 | d'une | « d' » + « une » (position 73) |

Note pour Paul : leur idx d'origine (20 et 72) tombe aujourd'hui par coïncidence sur le
premier jeton de l'élision (« s' », « d' ») — la position visuelle est donc déjà presque
juste ; reste à décider si le `word` doit devenir « approchèrent »/« une » (et l'idx 72
passer à 73/74), ce qui touche `word` et sort du mandat de l'outil.

## Ce que l'outil garantit
- Tokenisation de production exécutée verbatim (le chemin du fichier est un argument :
  l'outil suit la production, il ne la copie pas).
- Une dictée déjà exacte ou non identifiable à 100 % ressort **inchangée à l'octet près**.
- Chaque `idx` écrit a été vérifié individuellement contre le texte, hors les M/P
  (translatés et listés un à un) et le cas d'apostrophe déclaré.
- Aucun accès réseau ; aucune écriture au hub ; `index.html` et
  `correction_dictee.html` intouchés.

## Fichiers livrés
- `correcteur_snapshots.js` — l'outil (Node, sans dépendance).
- `*_corrige.json` — les cinq snapshots corrigés, prêts à réinjecter.
- `*_verdict.json` — le verdict machine complet par dictée (tous les M/P et cas
  particuliers, nominativement).
- `rapport.md` — ce rapport.
