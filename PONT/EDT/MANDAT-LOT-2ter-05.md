# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ⑤ · CE QUE L'ANNÉE COÛTE À PAUL
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 711 939 octets**, md5 **`8736d113d9f92827ba46d73b3fa4a6e1`**, **171 fonctions `edt*`**, version affichée **8.73.0-④**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-⑤**.*

*Les livraisons ①, ②, ③, ③bis et ④ sont closes et auditées. Tu t'appuies dessus, tu n'y reviens pas.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **ce qui est dans le calendrier, c'est l'établissement, donc si je perds des heures elles sont tout à fait justifiées.** »

« **tout ce qui concerne le pédagogique et le cours d'une façon ou d'une autre (le français) est du temps de classe** » — le reste est une heure perdue sèche.

« **banaliser cette heure** » — pas « ne plus compter cette séance » : **la séance continue ailleurs, c'est l'heure qui est banalisée**.

« **une heure, une clé, un seul motif** » · « **rien ne s'écrase en silence** ».

**Concrètement.** En juin, Paul doit dire au chef d'établissement combien d'heures il a réellement faites, et pourquoi il en a perdu. Aujourd'hui le site sait ce qui est prévu, pas ce que l'année a coûté. Cette livraison lui donne l'écran qui répond : **combien d'heures perdues, par classe, pour quel motif, et lesquelles sont justifiées.** Et elle ferme la faute la plus coûteuse : **une même heure comptée deux fois**, parce qu'elle a reçu deux motifs.

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL · CE QUI EXISTE DÉJÀ

**Lis avant de coder** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` **§⑥, §⑦, §⑧, §⑨** — c'est le cadrage de Paul, il fait foi, et il est détaillé · `PONT/EDT/rapport-2ter-04.md` · `outils/verif_edt.py`. **`index.html` fait 1,6 Mo : ne le lis jamais en entier.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**RÈGLE DE NOMMAGE** : la garde a refusé deux livraisons de ce lot parce qu'une variable locale s'appelait `poser`, puis `suite`. **Tout nom de variable locale du bloc EDT commence par `edt`.**

**CHERCHER AVANT DE FABRIQUER — tout le socle existe, mesuré dans le candidat :**
- **Le magasin des décisions** : `edtDecisions`, `edtEcrireDecision`, `edtEcrireDecisionsGroupe`, `edtDecisionPour`, `edtCleHeure`, et le `journal[]` qui garde l'`avant` et l'`apres` de chaque geste.
- **La banalisation** : `edtSansSeance` (2 occurrences) et **`EDT_CATEGORIES`, les dix catégories, déjà écrites** : Événement d'établissement · Évaluation hors séance · Sortie, voyage, projet · Orientation et vie de classe · Gestion de classe · Absence du professeur · Absence massive d'élèves · Reprise ou rattrapage · Temps libre choisi · Autre. **Ne les change pas, ne les renomme pas.**
- **Le déplacement d'heure** : `edtDeplacerVers` **pose déjà `deplaceeVers:'<iso>|<creneau>'`** en plus de `sansSeance:true` (L19739), et `edtAnnulerDecision` s'en sert pour défaire les deux côtés (L19749). **Tu n'as rien à créer.**
- **Le compte** : `edtHeuresJustifiees`. **L'écran** : l'entrée « Calendrier de l'année… ».
- **Le libellé fautif est à une seule ligne** : L19721, « ne plus compter cette séance ».
- **Les captures** : `tests/captures-*.mjs`. Session prof sans code (`admin-mode`), voile `fi-overlay` à retirer.

**L'état réel** : `/site/edt` au hub est **`null`**.

## ① L'ÉCRAN « HEURES PERDUES »

1. **L'entrée « Calendrier de l'année… » devient « Heures perdues ».** Elle ne règle pas le calendrier : **elle dit ce qu'il coûte**.
2. **Chaque événement dit le coût puis l'effet, au niveau qu'il porte réellement** : « Séjour Verdun 3e · 14-16 octobre · **tes 3e perdraient 3 heures ; tes 4e, zéro** ». **Jamais un nom de classe qui n'est pas dans l'événement** — mesuré : les 15 événements portent un niveau et `classes: []`. Annoncer « la 3e Franklin » ferait **inventer une donnée**.
3. **Une case n'apparaît que si l'événement coûte au moins une heure** à au moins une classe. **Un événement qui ne coûte rien n'a pas de case.**
4. **UN écran par ÉVÉNEMENT, pas un par jour** : un stage de trois jours donne **une seule fiche**, listant les heures de ses trois jours, **une case par heure** :
   > **Les stages de 3e — voici tes heures des 16, 17 et 18 novembre.**
   > ☐ 3e Franklin · lundi 16 novembre, 10:07 → 1 heure
   > ☐ 3e Dylan · lundi 16 novembre, 15:07 → 1 heure
5. **Les cases sont VIDES au départ. Tant que rien n'est coché, aucune heure n'est retirée.** Conditionnel avant confirmation — « **perdrait** », jamais « perd ». **Pas de vocabulaire d'ingénieur** : Paul vient de demander une passe de simplification, n'en fabrique pas de nouveau besoin.
6. **UNE SEULE CASE**, dont le sens est « cette heure a bien été perdue ». **Toute heure perdue par un événement du calendrier est justifiée, sans exception et sans bascule** — c'est la décision de Paul, elle ne se discute pas.
7. **En tête, le total par classe** : « cette année, X heures perdues, dont Y déclarées justifiées ».

## ② LES QUATRE MOTIFS, ET UNE HEURE NE COMPTE JAMAIS DEUX FOIS

**Toute heure perdue porte un MOTIF et un STATUT. Le statut ne se saisit pas : il découle du motif.**

| Motif | Statut par défaut | Basculable ? |
|---|---|---|
| événement du calendrier | **justifiée** | **non** |
| heure banalisée | selon la catégorie (§③) | **oui**, d'un clic |
| heure prise par une autre classe | **justifiée** | **oui** |
| heure à replacer jamais replacée | **non justifiée** | **oui** |

**LE POINT LE PLUS IMPORTANT DE CETTE LIVRAISON.** La coche « heure perdue » et la banalisation vivent **à la même clé** du magasin. Mesuré : `edtEcrireDecision` fait `d[nomClasse].heures[cleHeure]=valeur` — **un remplacement total, pas une fusion**. Sans règle, le second geste efface le premier **en silence**.

**RÈGLE : le geste le plus récent remplace le motif, et le site le dit AVANT.**
- **Jamais de refus** : Paul n'est jamais bloqué sur un geste de classe.
- **Jamais en silence** : « cette heure est déjà comptée perdue à cause de *Stages 3e* — la banaliser remplacera ce motif. » **Symétrique dans l'autre sens.**
- **Une heure ne compte JAMAIS deux fois** dans le total : un seul motif par clé.
- **Le motif qui gagne apporte ses règles** : une heure du calendrier remplacée par une banalisation devient basculable ; l'inverse redevient non basculable.
- **La case affiche le motif retenu**, et la fiche de l'événement montre cette heure décochée avec « banalisée le \<date\> ».
- **↶ Annuler restaure le motif précédent** : le journal capture déjà l'`avant`, **appuie-toi dessus, n'invente rien**.

**Le statut retenu est ÉCRIT dans la décision, jamais recalculé à l'affichage** : une bascule de Paul survit à tout.

## ③ BANALISER UNE HEURE — le mot juste, et ce que ça coûte

1. **Le libellé devient « Banaliser cette heure »**, partout : bouton, modale, journal, infobulle. **Mesuré : le libellé fautif est à une seule ligne, L19721.** Les dix catégories et la précision libre ne changent pas.
2. **Ce qui est nouveau : une heure banalisée entre — ou non — dans les heures perdues, selon sa catégorie.**

| Catégorie | Classement par défaut |
|---|---|
| Évaluation hors séance | **temps de classe** |
| Reprise ou rattrapage | **temps de classe** |
| Gestion de classe | **temps de classe** |
| Événement d'établissement | heure perdue · **justifiée** |
| Sortie, voyage, projet | heure perdue · **justifiée** |
| Orientation et vie de classe | heure perdue · **justifiée** |
| Absence du professeur | heure perdue · **justifiée** |
| Absence massive d'élèves | heure perdue · **justifiée** |
| Temps libre choisi | heure perdue · **non justifiée** |
| Autre | heure perdue · **non justifiée** |

3. **Le classement est une PROPOSITION** : Paul bascule d'un clic entre « temps de classe » et « heure perdue », et entre « justifiée » et « non justifiée ». **Le classement retenu est écrit dans la décision**, pas recalculé depuis la catégorie : **son choix survit**.

## ④ UNE HEURE DÉPLACÉE N'EST PAS UNE HEURE PERDUE

**Le champ existe déjà** : `edtDeplacerVers` pose `deplaceeVers` en plus de `sansSeance:true`. **Trois gestes, et rien d'autre :**
1. **Une nature de plus à l'affichage** : `sansSeance` **+** `deplaceeVers` → `nature='deplacee'`, avec son rendu et son libellé (« heure déplacée vers le \<date\> \<créneau\> », et à l'arrivée « heure venue du … »). `sansSeance` seul reste `'sansSeance'`.
2. **Le compteur ignore toute décision portant `deplaceeVers`**, quelle que soit sa catégorie et quelle que soit la bascule du §③ : `if(h[k] && h[k].sansSeance && !h[k].deplaceeVers) n++;`
3. **↶ Annuler reste intact** : mêmes deux côtés, même champ.

**TU NE RETIRES PAS `sansSeance` DU DÉPLACEMENT.** La nature d'une case vient de `dec.sansSeance` ; le retirer ferait **réapparaître la séance des deux côtés** et casserait ↶ Annuler. C'est mesuré et c'est écrit dans le mandat v2 : ne le rouvre pas.

## ⑤ L'ALERTE MENSUELLE — aveugle, sans réseau

Le nœud `calendrier` porte la date de sa dernière injection. **Un calendrier déjà au hub qui n'en porte pas reçoit la date du premier chargement** — jamais d'alerte immédiate. **Un mois après**, une ligne discrète, **non bloquante** : « Le calendrier de l'année a été injecté il y a un mois — pense à le réinjecter s'il a bougé », avec « Réinjecter maintenant… » et « Plus tard » (repousse de 30 jours). **Le site ne lit rien à l'extérieur : il compte les jours.** La date de dernière injection est affichée pour chaque objet.

## ⑥ LA GARDE GAGNE SA CINQUIÈME QUESTION — décidé par Paul le 01/09

**Mesuré à la livraison ④** : les consignes existent **en deux exemplaires** — les fichiers `prompts/*.md` et la copie embarquée `EDT_PROMPTS`. Identiques aujourd'hui (`calendrier` 8 272 car. md5 `c6ef9d23d4fb` · `grille` 9 201 car. md5 `e9823409e47e`), **mais rien ne le garantit demain** : la prochaine main qui corrige l'un sans l'autre crée une divergence silencieuse, et Paul lirait un prompt qui n'est pas celui que le bouton copie.

**Ce qu'on attend** : `verif_edt.py` **compare `EDT_PROMPTS` aux fichiers `prompts/*.md` et refuse s'ils diffèrent**, nommément. Elle lit le fichier tel que le navigateur lit la chaîne. **Tu poses toi-même le contrôle négatif** : change un caractère dans un des deux, la garde doit devenir **ROUGE**, puis remets-le.

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT — ne l'anticipe pas

- **Les trois issues, l'heure à replacer, la liste des destinations, les télescopages, les dates de l'année** : livraison ⑥.
- **La vue Année** : livraison ⑦. **Les photos, la matrice, `SEQUENCE-TEST-PAUL.md`** : livraison ⑧.
- **La passe de simplification des textes affichés** : dette déclarée par Paul, **livraison à part**. Mais **n'aggrave pas** : écris tes nouveaux textes dans ses mots.
- **La confrontation des dettes au code** : ce n'est pas un travail d'exécutant.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ⑦ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`EDT_ANNEE` 12** · **`function edt*` 171**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels**.
- **Les dix catégories inchangées**, mot pour mot.
- **La classe d'essai reste invisible hors mode test** : 30 créneaux, comptes par classe inchangés.
- **Les neuf bancs des livraisons précédentes rejoués**, avec leurs chiffres.
- **Les 122 identifiants du calendrier réel** : 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision.
- **Double parseur vert** · **garde verte sur ses cinq questions**.

## ⑧ PREUVES EXIGÉES — mesurées, aucune affirmée

Un chiffre, un chemin, une commande. Une preuve obtenue en appelant une fonction à la main **se déclare comme telle**.

1. **Une fiche par événement** : le stage de 3e sur trois jours donne **une seule fiche**, listant les heures de ses trois jours. Donne l'écran.
2. **Cases vides au départ** : avant toute coche, **0 heure retirée**, total inchangé.
3. **Un événement qui ne coûte rien n'a pas de case.**
4. **Jamais un nom de classe absent de l'événement** : cherche-le, prouve qu'il n'y en a aucun.
5. **LA PREUVE QUI COMPTE — une heure ne compte jamais deux fois.** Coche une heure depuis la fiche d'un événement, puis banalise la même heure : **l'annonce du remplacement s'affiche AVANT l'écriture** (donne le texte) · **le total ne bouge que d'une unité, jamais de deux** · le statut devient basculable · **↶ Annuler rend la coche d'origine, relue au hub** · **et le geste inverse, mesuré de la même façon**.
6. **Les dix catégories, une par une** : classement par défaut obtenu, comparé au tableau du §③.
7. **La bascule survit** : Paul bascule une catégorie, on recharge → **le classement retenu est toujours le sien**, pas celui de la catégorie.
8. **Heure déplacée** : `nature='deplacee'`, libellé au départ et à l'arrivée, **et le compteur l'ignore** — avant/après, chiffres à l'appui. ↶ Annuler défait les deux côtés.
9. **Alerte mensuelle** : calendrier sans date → **aucune alerte immédiate**, la date est posée au premier chargement · à J+31 → la ligne s'affiche · « Plus tard » repousse de 30 jours · **aucune requête sortante** (journal du réseau à l'appui).
10. **La cinquième question de la garde** : verte quand les deux copies concordent, **ROUGE quand tu changes un caractère** — donne le texte du refus, puis remets-le.
11. **Non-régression** : la liste chiffrée du §⑦, les neuf bancs rejoués.
12. **Garde** : verte sur ses cinq questions, **et rouge sur cinq contrôles négatifs que tu poses toi-même**, un par question.
13. **Captures par clics** : l'écran Heures perdues, une coche, une banalisation par-dessus avec son annonce, le total en tête. Avant/après, écran entier, journal.
14. **Audit adverse** : cherche ce qui casse. Un événement sans heure · un événement qui couvre des vacances · deux événements sur la même heure · une banalisation puis une coche puis ↶ Annuler deux fois · une catégorie inconnue · une heure déplacée puis banalisée · le calendrier réinjecté pendant qu'une fiche est ouverte. **Hub vide : c'est l'état réel.**

## ⑨ MÉTHODE ET DÉCOUPE

**Quatre livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **⑤-a** — l'écran « Heures perdues », une fiche par événement, cases vides, total en tête (§①). Version **8.73.0-⑤a**. Rapport, puis STOP.
- **⑤-b** — les quatre motifs, **une heure ne compte jamais deux fois**, ↶ Annuler (§②). Version **8.73.0-⑤b**. Rapport, puis STOP.
- **⑤-c** — « Banaliser cette heure », les dix catégories et leur classement, la bascule qui survit, l'heure déplacée (§③ et §④). Version **8.73.0-⑤c**. Rapport, puis STOP.
- **⑤** — l'alerte mensuelle (§⑤), la cinquième question de la garde (§⑥), les captures, l'audit adverse, le rapport final. Version **8.73.0-⑤**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison, avant la finale. **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑩ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · `outils/verif_edt.py` (cinquième question, raison en commentaire) · un rapport par livraison (`rapport-2ter-05a.md`, `-05b.md`, `-05c.md`, `-05.md`) · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑧, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.
