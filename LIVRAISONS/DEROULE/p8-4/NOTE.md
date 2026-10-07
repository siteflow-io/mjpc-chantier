# p8-4 — écrire directement dans la diapo (atelier et répétition)
*Exécutant, session cloud de Claude Code, 07/10/2026. Complément `MANDATS/COMPLEMENT-DEROULE-P8-4.md` (version 2, C13 tour 28), lu après le mandat (version 3) et les compléments p8-3b, p8-3c et p8-3d. Branche `deroule/p8-4`, partie de `deroule/p8-3d`.*

## Ce que ça change pour la classe
Paul écrit dans la diapo comme dans un document. Il n'y a plus de menu à ouvrir pour mettre du texte.
- **Un clic dans un texte, et on l'écrit.** Cela vaut pour la consigne, ses étapes, la question, sa réponse attendue, le titre d'une fiche, une légende. Dans l'atelier, c'était déjà possible depuis la p7 ; c'est maintenant aussi le cas en répétition.
- **Sous le dernier bloc, une ligne « ✎ clique ici et écris ».** La première lettre tapée crée un bloc « texte », qui a son identité tout de suite. Entrée ouvre une ligne nouvelle, c'est-à-dire un élément qui se dévoilera à son tour.
- **« + bloc » ne propose plus la carte « Texte »**, puisque le texte s'écrit directement. Il propose : consigne, question, fiche, schéma, image, vidéo, document, page HTML.
- **Clic droit → « Changer de type… »** : Texte, Consigne, Question ou Schéma. Le bloc prend la disposition de son nouveau type, comme s'il avait été créé par le menu. Chaque ligne reste un élément.
- **En répétition**, le tableau suit la frappe. À « ■ Arrêter », tout ce qui a été écrit est oublié, et la trame redevient exactement ce qu'elle était.
- **Pendant une heure lancée**, le texte des blocs reste fermé, comme avant. Les réponses s'écrivent comme avant. L'écriture en classe, dans la copie de la classe, vient en p8-5.

## La base et son md5
- Base : le gabarit livré en p8-3d, md5 `91dfc216485ff7e778998ed91fed9a05`.
- `regen.sh` refait toute la chaîne jusqu'à **p8-4**. Avant d'appliquer p8-4, il vérifie octet pour octet les gabarits p8-2, p8-3, p8-3b, p8-3c et p8-3d livrés. Sa sortie est dans `sorties/regen.txt`.
- Livrés :
  - le gabarit `v9c15p8-template.html` et la maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` (md5 en fin de NOTE) ;
  - les patches p8-2 à p8-3d et **`patch-p8-4.py`**, avec son code à part, `p8-4-ecrire.js`.

## Ce que j'ai mesuré avant de coder
- **L'atelier savait déjà écrire dans la diapo.** `brancherAtelier` rend écrivable tout texte qui porte `data-p`. Entrée crée un élément, Échap retire une ligne vide. L'audit de la conscience (« 2 champs éditables ») avait été fait au pilote, où seules les réponses s'écrivaient.
- **L'enregistrement.** Chaque frappe va dans la trame tout de suite (`ecrireDansDiapo`). Le témoin passe à « ✔ enregistré » après 3 s de calme, comme depuis la p7, et l'infobulle de chaque texte le dit. Je n'ai pas changé ce délai : le banc vérifie que la trame a changé dès la frappe, et que le témoin dit « ✔ enregistré ».
- **Le redessin « depuis un autre onglet », remplacé.** La fenêtre du tableau ne fait que recevoir : elle n'a ni ▶ ni clavier qui reviennent au pilote. **Le redessin choisi est celui que la maquette provoque elle-même en répétition** : à chaque frappe, le tableau suit le texte, donc le pilote et le tableau sont redessinés (`tout()`). Le banc tape 12 caractères et constate 12 redessins du tableau.

## Les décisions, et comment je les ai lues
1. **Un clic dans un texte.** Dans l'atelier et en répétition, tout texte de la diapo s'écrit. Les champs de réponse (`bloc.i.n`, `bloc.r.n`) et les cases du cahier gardent leur propre écriture : je les ai sortis du branchement de l'atelier. Avant, ils y recevaient aussi l'écoute de l'atelier, qui écrivait leur texte dans `bloc.el[NaN]`.
2. **Sous le dernier bloc.** La zone n'apparaît qu'au pilote, et jamais au tableau. Elle n'apparaît pas sur la diapo de fin d'heure, ni sur une diapo à schéma (son titre, le schéma, au plus une consigne d'une ligne). Elle est collée au bas du cadre quand la diapo déborde, pour rester à portée de clic.
   - **Lecture dite** : un bloc tapé n'a pas de ligne de tête. Chaque ligne est un élément, comme le veut « Entrée ouvre une nouvelle ligne, qui se dévoilera à son tour ». Le rendu d'un texte ou d'une consigne sans ligne de tête montre donc ses lignes seules.
3. **« + bloc » sans texte libre.** La carte « Texte » sort. **La consigne reste** : elle a sa propre disposition, la puce puis ses étapes. L'infobulle de « + bloc » dit que le texte s'écrit directement.
4. **« Changer de type… »** Il est proposé dans le menu du bloc, et aussi dans le menu d'une ligne, parce qu'un bloc tapé n'a que des lignes. On peut changer vers Texte, Consigne, Question ou Schéma. Chaque choix a son infobulle ; le type actuel est grisé avec « C'est déjà son type ».
   - **Texte et consigne** : chaque ligne devient une ligne ou une étape, c'est-à-dire un élément. **Lecture dite** : une consigne changée de type n'a pas de ligne de tête, puisque toutes ses lignes sont des étapes.
   - **Question** : chaque ligne devient une question, à sa place. La première garde l'identité du bloc, les suivantes en reçoivent une neuve. Chaque question a sa réponse attendue, vide, à écrire dessous (`el: ['']`). C'est le contrat d'une question créée par le menu (« la réponse attendue… c'est le contrat »). Le banc compare les données et le rendu : ils sont identiques.
   - **Schéma** : chaque ligne devient une famille de la carte. Le titre est celui de la diapo, et le réglage est « Un à un » (décision 6 ter). Si la diapo porte autre chose qu'une consigne d'une ligne, le schéma part dans une diapo nouvelle, juste après (décision 1). Après le bilan, c'est refusé avec sa raison.
   - Les règles tranchées tiennent. Sur une diapo à schéma, un autre bloc ne change pas de type ; l'infobulle dit pourquoi et quoi faire. Une fiche, une image, une vidéo ou un document ne sont pas faits de lignes : leur type ne change pas, et l'infobulle le dit.
   - **Lecture dite : « + bloc » et « Changer de type » sont des outils de l'atelier.** En répétition, la barre de l'atelier n'existe pas, et le clic droit est celui de la classe. Les décisions 1, 2 et 5 valent en répétition, et le banc les y éprouve.
5. **L'identité dès la première lettre.** Le bloc est créé à la première frappe, avec `nouveauBid()`, et il garde cette identité ensuite. Le banc vérifie l'identité après la première lettre, puis la même après deux lignes.

## Ce qui a été modifié, compté
`patch-p8-4.py` fait 21 remplacements, chacun exigé une fois. Chaque nom nouveau a été cherché dans le gabarit avant d'être écrit. Tailles relevées par le patch (`sorties/regen.txt`) ; j'ai relu chaque fonction en entier.

| fonction | avant | après | quoi |
|---|---|---|---|
| `morph` | 1 258 o / 13 lignes | 1 380 o / 13 lignes | **défaut trouvé** : le nœud qui a le focus garde ses attributs (voir « Les défauts ») |
| `rendre` | 17 459 o / 52 | 17 717 o / 53 | texte et consigne sans ligne de tête ; la zone sous le dernier bloc (au pilote, quand l'écriture est ouverte) |
| `tout` | 5 105 o / 13 | 5 267 o / 13 | l'écriture est ouverte dans l'atelier et en répétition ; en répétition, les textes se rebranchent à chaque rendu |
| `brancherAtelier` | 2 732 o / 6 | 3 192 o / 6 | marche aussi en répétition ; les champs de réponse et les cases du cahier sont mis à part ; en répétition, une infobulle propre et pas de barre du bloc |
| `ecrireDansDiapo` | 315 o | 443 o | en répétition, le tableau suit la frappe |
| `lancerRepetition` | 1 526 o | 1 620 o | l'instantané s'étend à la séance : ses diapos et leurs blocs |
| `arreterRepetition` | 697 o | 860 o | la séance est restaurée en place |
| `choixObjet` | 1 247 o | 1 343 o | plus de carte « Texte » |
| `menuAtelierMur` | 6 848 o / 4 | 7 578 o / 4 | « Changer de type… », depuis le bloc et depuis une ligne |
| liste des fonctions du tableau | — | +4 noms | `p8PeutEcrireSous`, `p8ZoneEcrire`, `p8EcritureOuverte`, `p8DiapoASchema` (n°12 · 75) |
| infobulle de « + bloc » | 106 o | 177 o | « … le texte, lui, s'écrit directement : clique sous le dernier bloc et écris » |
| style | — | 4 règles | `.p8-ecrire` (préfixée, cherchée avant d'être écrite) |

**Ajouté, à part** (`p8-4-ecrire.js`, 6 254 o, 9 fonctions) :
- `p8EcritureOuverte` (69 o) et `p8PeutEcrireSous` (85 o) ;
- `p8ZoneEcrire` (342 o) et `p8EcrireSous` (615 o) ;
- `p8LignesDe` (161 o), `p8GardeType` (393 o), `p8GardeVers` (415 o), `p8MenuType` (674 o) et `p8ChangerType` (1 648 o) ;
- la constante `P8_TYPES` ;
- deux écoutes du document : la frappe dans la zone, et Entrée / Tab dans la zone vide.

## Les bancs, comptés
- **`test-p8-4-ecrire`** (nouveau, 24 `ok(`), par la souris et le clavier :
  1. **Atelier, sous le dernier bloc.**
     - La zone est là, écrivable, avec son infobulle.
     - Après la première lettre, il existe un bloc « texte » avec son identité.
     - Après « Première ligne », Entrée et « Seconde ligne », le bloc a 2 éléments et garde la même identité.
     - Le témoin dit « ✔ enregistré ».
  2. **Atelier, une consigne.** Le banc double-clique sur « troisième » et tape « deuxième » : la trame a changé, et le témoin dit « ✔ enregistré ».
  3. **« + bloc »** ne propose plus « Texte », mais propose toujours la consigne et la question ; son infobulle le dit.
  4. **« Changer de type » → Question.**
     - Le menu de la ligne propose « Changer de type… » avec son infobulle. Les quatre types sont là avec leur infobulle, et le type actuel est grisé avec sa raison.
     - Résultat : 2 questions, à leur place. La première garde l'identité du bloc, la seconde en a une neuve.
     - Comparées à une question créée par le menu, elles ont les **mêmes clés de données** (`bid, el, t, txt`) et le **même rendu** (`p.q ul.etapes li div.libre.rep span.ini.vide span.dit`).
     - En répétition, ▶ les dévoile une à une. Au tableau, on compte 0,0,0,0,1,1,2,2,3,3 questions visibles ; le pilote et le tableau montrent les mêmes.
  5. **« À régler ».** Un bloc tapé de 10 lignes ne tient plus : « Diapo trop pleine », avec « Couper la diapo ici ». La diapo ne s'est pas coupée seule.
  6. **Répétition.**
     - Le banc corrige « fixe » en « libre » : le mot se voit au pilote et au tableau.
     - **La saisie tient** : 12 frappes, 12 redessins du tableau. Le texte reste entier, le focus reste sur la même ligne, le curseur reste en fin de texte, et le défilement ne bouge pas.
     - On écrit aussi sous le dernier bloc.
     - À « ■ Arrêter », la trame est **identique**, comparée en entier (JSON de la séance), et on revient à l'atelier.
  7. **Heure lancée.** Le texte de la consigne n'est pas écrivable, la frappe ne change rien et la zone sous le dernier bloc est absente. La réponse « Une nature immense. » s'écrit.
- **Recalé** : `test-p4a-p7` (28 `ok(`). La liste des cartes de « + bloc » n'a plus « Texte ». Le texte s'ajoute maintenant en cliquant sous le dernier bloc, et le curseur va dans sa première ligne (avant : dans sa ligne de tête). 2 vérifications sont changées, et marquées « recalé en p8-4 ».
- Inchangés : les 26 autres bancs.
- 28 bancs dans le banc unique, 589 `ok(` en tout.

## Le banc unique, résultat
`sh bancs/tous-les-bancs.sh` → `sorties/tous-les-bancs.txt`
- Lancé le 2026-10-07 à 13:01 UTC : node v22.22.0, Playwright 1.56.1, Chromium 141.0.7390.37.
- Maquette jouée : md5 `cc4d1017ad8dfc56811594d069026353`.
- **28 bancs, 28 × « fin : 0 défaut(s) », « TOUS LES BANCS : 0 défaut ».**

## Les captures (toutes regardées, écran entier) — les chiffres sont dans `captures/MESURES-p8-4.txt`
| capture | ce qu'elle prouve |
|---|---|
| `p8-4-bloc-tape.png` | dans l'atelier, « Le siècle des inventions » : le bloc tapé sous la consigne (« Première ligne », « Seconde ligne »), sa barre « BLOC 2 · TEXTE · 2 ÉLÉMENTS », la zone « ✎ clique ici et écris » dessous, et « ✔ enregistré » |
| `p8-4-change-question.png` | après « Changer de type » → Question : deux questions, chacune avec sa ligne de réponse attendue et sa ligne de réponse libre ; la notice « Type changé : 2 questions, une par ligne… ». La diapo est devenue trop pleine, et « Sur la forme » le dit. **Vu** : sur cette diapo trop pleine, la zone collée au bas du cadre passe sur la dernière ligne de réponse (dans l'atelier seulement) |
| `p8-4-questions-pilote.png` / `p8-4-questions-tableau.png` | en répétition, tout dévoilé : au tableau, les questions et leurs lignes, la page 1 de la diapo trop pleine |
| `p8-4-repetition-pilote.png` / `p8-4-repetition-tableau.png` | en répétition, « Une forme libre : le sonnet. » et « … — à retenir » sont au pilote (la ligne où l'on écrit est encadrée) et au tableau |
| `p8-4-heure-lancee.png` | heure lancée, « Question-bilan » : la réponse « GA · Une nature immense. » est écrite, la ligne libre suivante est prête ; il n'y a pas de zone sous le dernier bloc |

## Les défauts trouvés et corrigés (avec leur cause)
1. **Le premier redessin faisait perdre le focus au texte où l'on écrit, et la frappe partait aux raccourcis** (une lettre ouvrait la relecture, le gel, les notes). **Cause** : `morph` retirait les attributs absents du nouveau rendu **avant** de protéger le nœud qui a le focus. Le texte perdait `contenteditable`, donc le focus. C'était caché jusqu'ici, parce que rien ne redessinait pendant la frappe. Corrigé : le nœud qui a le focus garde ses attributs, ce qu'exige la règle « un redessin ne touche pas l'élément qui a le focus ».
2. **Le bloc créé depuis la zone ne prenait pas sa place.** **Cause** : la zone avait le focus pendant le redessin, et le morph ne la touchait pas, si bien que le bloc neuf ne s'insérait pas à son rang. Corrigé : la zone rend le focus, puis le curseur va dans la première ligne du bloc neuf.
3. **Le choix du type ne s'ouvrait pas.** **Cause** : le clic qui l'ouvrait remontait et refermait les menus. Corrigé : le choix s'ouvre après ce clic.
4. **Sur une diapo qui déborde, la zone sous le dernier bloc sortait du cadre**, et le clic tombait ailleurs. Corrigé : elle est collée au bas du cadre (`position: sticky`).
5. **Dans le menu, « Changer de type » manquait sur un bloc tapé.** **Cause** : un bloc tapé n'a pas de ligne de tête, et le clic droit sur une ligne ouvre le menu de l'élément. Corrigé : ce menu le propose aussi, sous le nom « Changer de type du bloc… ».

## Ce qui est simulé
Rien de nouveau.

## Ce qui reste
- L'écriture en classe, dans la copie de la classe, et son versement à la fin de l'heure : **p8-5**.
- L'import et son refus : mandat de production.

## Les empreintes
- maquette `maquette-pilotage-ordi-v9c15p8-manipulable.html` : `cc4d1017ad8dfc56811594d069026353`
- gabarit `v9c15p8-template.html` : `c1190046607ec2d21b22ab67623198c0`
- tous les fichiers livrés : `EMPREINTES.md5`, vérifié par `md5sum -c` avant l'envoi.
