# MANDAT EXÉCUTANT — MJPC · LOT 2ter · LIVRAISON ⑭ · LA BORNE DES DATES DE L'ANNÉE

## ⓪ QUI TU ES, ET COMMENT ÇA MARCHE — lis cette section en entier avant tout

**Tu es l'exécutant.** Tu codes, tu mesures, tu prouves, tu livres — puis **tu t'arrêtes**.

**Paul** est professeur de français au collège Saint-Joseph de Doué-en-Anjou. **MJPC** — *Monsieur J'ai Pas Compris* — est le site qu'il utilise en classe, tous les jours, devant ses élèves. **Ce n'est pas un projet : c'est son outil de travail.** Tout ce que tu écris, il le verra en cours, souvent sur son téléphone.

**La conscience** — une autre instance — cadre avec Paul, écrit ce mandat, et auditera ton travail sur pièces. **Elle ne code pas. Tu ne cadres pas.** Si le mandat te paraît faux ou troué : **tu le signales et tu attends. Tu ne le réécris jamais.** Les deux mandats précédents avaient des trous, et c'est en les signalant qu'on les a fermés.

### Les deux dépôts, et l'étanchéité

| | dépôt | ce que c'est |
|---|---|---|
| **le sas** | `siteflow-io/mjpc-chantier` | **c'est là que tu livres.** Rien n'y est en ligne. |
| **la production** | `siteflow-io/monsieurjaipascompris` | **le site réel de Paul. Tu n'y écris JAMAIS.** |

**Ton jeton n'ouvre que le sas** — l'étanchéité a été prouvée le 31/08 par écriture croisée : sas→production **403**, production→sas **403**. Si une écriture en production te renvoie 403, **c'est normal, ce n'est pas une panne à contourner.**

**TON JETON DU SAS** — **Paul te le donne dans la conversation, une fois.** Il ne figure pas ici : **un jeton ne va jamais dans un fichier du dépôt.** Si tu ne l'as pas reçu, demande-le en une ligne et attends — **ne travaille pas sans, tu ne pourrais pas livrer, et deux exécutants s'y sont déjà cassé les dents.**

### Ce que tu ne fais jamais

- **Tu n'écris pas en production.** **La promotion est le geste de Paul, et de lui seul.**
- **Tu ne livres pas dans la conversation.** **Le sas fait foi** : c'est le **md5 relu après ta poussée** qui prouve qu'on audite bien le fichier qui sera promu. Deux exécutants ont déjà livré dans le fil faute de jeton — leur travail n'a pas pu être audité.
- **Tu ne réécris pas ce mandat.** Tu signales, tu attends.
- **Tu ne livres jamais avec une dette.** Un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout **dans la même livraison**.

### Comment tu livres

Tu pousses au sas, **tu relis le fichier après la poussée**, et **tu publies sa taille et son md5 relus**. Puis **tu t'arrêtes** et tu attends que Paul te relance par « continuer ». **Le « continuer » natif plante une fois sur deux : c'est pour ça qu'on découpe en livraisons courtes closes par un arrêt.**

### Les règles de preuve — elles ont été payées cher

1. **UN BANC PASSE PAR LE GESTE, JAMAIS PAR LA FONCTION.** Ce qui n'est pas atteignable par un clic **n'est pas prouvé**, et se déclare comme tel. **Deux trous de ce lot venaient de là** : la banalisation par-dessus une coche, et les dates de l'année — **elles existaient dans le code, prouvées par des bancs qui appelaient la fonction, et n'étaient atteignables par aucun clic.** **Une fonction sans chemin n'existe pas pour Paul.**
2. **UNE PREUVE DIT CE QU'ELLE CONTIENT**, pas seulement qu'elle existe. « Une archive est partie » ne prouve rien : donne ce qu'il y a dedans, compté.
3. **« appel de fonction : déclaré » est une ALERTE, pas une formalité.** Quand tu l'écris, tu dis : *ce geste n'est peut-être atteignable par aucun clic*. **Vérifie-le tout de suite.**
4. **Une mesure à zéro ne prouve pas une absence** — elle prouve que le nom que tu as cherché n'est pas là. **Lis le code, ne compte pas des motifs.**
5. **Paul promeut sur captures.** Écran entier, journal des clics. **Aucune livraison n'en dispense.**

### Deux règles d'écriture

- **Tout nom de variable locale du bloc EDT commence par `edt`.** La garde a refusé deux livraisons de ce lot pour une variable nommée `poser`, puis `suite` — des noms qui existent aussi hors du bloc.
- **Tu écris dans les mots de Paul**, pas dans le vocabulaire du chantier. Il vient de demander une passe de vocabulaire : n'aggrave pas la dette.

### Les outils, au sas

- **La garde** : `PONT/EDT/outils/verif_edt.py` — **cinq questions**. Elle doit être **verte** à la fin, et tu poses toi-même **cinq contrôles négatifs** qui la font passer au rouge, pour prouver qu'elle mord encore.
- **Les bancs** : `PONT/EDT/tests/` — **`banc-tout.mjs` les rejoue tous d'une commande et échoue si un seul échoue.** Il en compte **35**. Compte-les avant d'écrire « entier ».
- **Le double parseur** : `node --check` **et** acorn ES2020.
- **Les données** : `PONT/EDT/json/` et `PONT/EDT/tests/hub/`. *Un exécutant a perdu du temps à les chercher sous de mauvais noms : les fichiers du hub sont `tests/hub/classes.json`, `tests/hub/site_3e.json`, `tests/hub/site_config.json`.*

### L'état, mesuré ce jour

**`index.html` — 1 769 457 octets, md5 `8837063de4466afb71622e89181ae44a`, version 8.73.0-⑪.**
**La production et le sas portent le même fichier, identique bit à bit** — il a été promu ce matin (commit `c5e893bbc208`) après douze livraisons auditées.
**STOP si le md5 diffère** : ne code rien, dis-le, attends.
**Candidat à produire : 8.73.0-⑭.**

---

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **mjpc c'est pour les cours, c'est les cours qui sont importants. je dois pouvoir déclarer mon début d'année tel jour et puis le reste se cale, c'est tout. c'est ça la logique.** »

« **l'année prochaine ça se trouve j'aurai des cours dès le mercredi, on ne sait pas.** »

« **l'injection respecte bien le calendrier fourni, et je peux quand même poser librement mon premier jour de cours et mon dernier jour (sachant qu'il peut aussi y avoir des choses après le dernier jour, c'est le pendant inverse).** »

**Le défaut, constaté par Paul le jour de sa rentrée** : ses séances apparaissent **depuis le 27 août** alors que ses premiers cours sont le **3 septembre**. Il a posé `debutAnnee: 2026-09-03` — **et rien n'a changé.**

**Ce que sa phrase sépare, et qui fonde tout ce mandat** : le **calendrier de l'établissement** dit ce qui occupe ses journées, il est injecté tel quel et **jamais retouché** ; **ses dates de cours** sont posées librement par lui. **Les deux coexistent. On ne bricole pas l'un pour compenser l'autre.**

## ⓪bis LA CAUSE, MESURÉE — et « le reste se cale » veut dire partout

**Pourquoi le 27 août** : les vacances d'été du calendrier vont du `2026-08-01` au **`2026-08-26`**. Le 27 est donc le premier jour où le site s'autorise à poser une séance, parce que **`edtJourSansCours` ne lit que `vacances` et `feries`**.

**Pourquoi déclarer la date n'a rien changé** : `edtDebutAnnee()` a **trois appelants — `edtVersions` (L17855), `edtNormaliserGrille` (L19031), `edtEcheancesPhoto` (L20002). Aucun ne calcule le prévu.** Et `edtFinAnnee()` en a **trois** — `edtHeuresJamaisReplacees` (L18356, L18379) et `edtCreneauxOu` (L20391). *(La mention dans `edtDestinationsPour` à la L20563 est **dans un commentaire**, pas du code : corrigé après audit.)* **Ni l'une ni l'autre ne borne ce que Paul voit et ce que le site compte.**

**LA SOURCE COMMUNE : `edtCasesDuJour`, DIX APPELS DANS NEUF FONCTIONS.** Mesuré, avec ce que chacune sert :

| fonction | ligne(s) | ce qu'elle sert |
|---|---|---|
| `edtProjeter` | 19729 | **les cases de la semaine et du mois — et LA PHOTO DU PRÉVU** (voir ci-dessous) |
| `edtPeindreAnnee` | 20934, 20939 | **la vue Année** |
| `edtHeuresDeLEvenement` | 21135 | **les heures perdues** — six appelants : `edtCoutParNiveau`, `edtJustifier`, `edtEvenementJustifie`, `edtCochesDeplacees`, `edtPeindreCalendrier`, `edtChargeInscrire` |
| `edtCreneauxOu` | 20400 | **la liste des destinations** |
| `edtCreneauxLibresLe` | 21527 | **la liste des destinations** (créneaux libres) |
| `edtQuiEstEn` · `edtRefusDepot` · `edtOccupantDe` · `edtProjeterJour` | 20382 · 21432 · 21451 · 20630 | les gestes de dépôt et de déplacement |

**DEUX PRÉCISIONS QUE LA CONSCIENCE A MESURÉES ET QUI CORRIGENT L'AUDIT PRÉCÉDENT — ne te fie pas à ce qu'on t'a dit avant, fie-toi à ceci :**
1. **La photo du prévu NE passe PAS par `edtHeuresDeLEvenement`.** Mesuré : `edtPhotoPrendre` fait `var edtLundi=edtLundiCourant(), edtCel=edtProjeter(edtLundi,5)`. **Elle passe par `edtProjeter`.** Une borne posée là la borne donc aussi.
2. **`edtHeuresDeLEvenement` sert aux HEURES PERDUES**, pas à la photo. C'est elle qui décide quelles heures un événement du calendrier recouvre.

**ET LE FAIT QUI MONTRE QUE ÇA COMPTE DÉJÀ** : la photo automatique prise ce matin porte `nom:"Rentrée"`, `prise:"2026-09-03"`, **`depuis:"2026-08-31"`** — parce que `edtLundiCourant()` rend le lundi de la semaine affichée. **Elle photographie donc la semaine du 31 août : trois jours qui sont avant la rentrée de Paul.** C'est cette photo que le cockpit comparera au réel en juin.

## ① CE QU'ON ATTEND

**Une seule fonction décide** — écris-la, nomme-la clairement, et appelle-la partout : **« cette date est-elle dans l'année scolaire de Paul ? »**, c'est-à-dire entre `debutAnnee` et `finAnnee` **inclus**. **Ne recopie pas la comparaison à neuf endroits : un jour Paul changera la règle, et il faut qu'il n'y ait qu'un endroit à changer.**

**Et l'effet diffère selon l'endroit — c'est le cœur du mandat :**

0. **AUCUNE DES TROIS NATURES EXISTANTES NE CHANGE** : une case `horsTemps` (vacances, férié), `horsMjpc` (heure de Paul non fléchée dans le site) ou **`nonImportee`** (classe qui n'est pas chez lui) **garde son nom et son comportement**, même hors année. Tu n'ajoutes qu'un cas : celui qui n'en avait aucun.

1. **À L'AFFICHAGE — la case RESTE, et c'est tranché par Paul.** Dans `edtProjeter` et `edtPeindreAnnee`, une date hors année donne une case **présente, grisée, sans séance**, avec son mot : **« avant ta rentrée »** ou **« après ton dernier jour »**. Rendu sur le patron exact de `horsTemps`, qui existe déjà dans `edtCelluleCorps` : `<div class="edt-b edt-b-off">…</div>`.
   **Pourquoi la case reste** : mesuré, le 27/08 porte le CODIR, le déjeuner d'équipe, la photo et la pré-rentrée ; le 28/08 la pré-rentrée ; le 31/08 la préparation ; le 01/09 **la rentrée des 6e** ; le 02/09 **la rentrée des 5e-4e-3e**. **Huit événements réels. Les faire disparaître serait mentir dans l'autre sens.**

2. **DANS LES COMPTES — l'heure ne compte pas.** `edtHeuresDeLEvenement` ne rend aucune heure hors année : un événement du calendrier qui tombe avant la rentrée **ne coûte rien** à Paul, et sa fiche n'apparaît pas dans « Heures perdues ».

3. **DANS LES PROPOSITIONS — le créneau n'est pas proposé.** `edtCreneauxOu` et `edtCreneauxLibresLe` n'offrent aucune destination hors année. `edtFinAnnee` y est déjà lue : **complète, ne réécris pas.**

4. **DANS LES GESTES — le dépôt hors année est refusé, et le refus est NOMMÉ.** `edtRefusDepot` rend un motif en clair, comme ses cinq refus actuels : « ce jour est avant ta rentrée du 3 septembre ».

5. **DANS LA PHOTO — elle ne photographie que des cases de l'année.** Elle passe par `edtProjeter`, donc le point 1 suffit ; **mais tu le mesures et tu le montres**, avec le nombre de cases avant et après.

## ② CE QUI N'EST JAMAIS BORNÉ — le passé ne se réécrit pas

**UNE CASE QUI PORTE UNE HEURE DÉJÀ JOUÉE, OU UNE DÉCISION DE PAUL, N'EST JAMAIS BORNÉE.**

**Mesuré, et c'est le risque le plus sérieux de ce mandat** : dans `edtProjeter`, **trois** gardes viennent en tête et coupent la suite — `horsTemps` (1323), `horsMjpc` (1440), **`nonImportee` (1521, la case d'une classe qui n'est pas chez Paul : `if(!cel.classeMjpc)`)** — **et le réel est traité APRÈS** — `edtChercherTrace` à l'offset 2649, avec ce commentaire du code : *« le réel ne dépend JAMAIS de ce qui attend : une heure jouée colore sa case même quand le chapitre est fini, dépublié ou supprimé de la file. »*

**Une garde `horsAnnee` placée bêtement en tête effacerait donc la trace d'une heure que Paul a réellement faite.** Si Paul a lancé une séance le 1er septembre et déclare ensuite sa rentrée au 3, **cette heure doit rester telle quelle** — jouée, avec ses activités.

**Il en va de même d'une décision** : une heure cochée, banalisée, déplacée ou à replacer **garde son état**.

## ③ QUEL MOT GAGNE, ET OÙ LA GARDE SE POSE — deux choses différentes, ne les confonds pas

**⚠ CETTE SECTION A ÉTÉ CORRIGÉE APRÈS UN AUDIT : lue de travers, elle te ferait effacer les heures que Paul a réellement faites. Lis les deux points.**

**① QUEL MOT GAGNE — c'est du vocabulaire, pas des lignes de code.** Une case hors année qui est **aussi** un jour de vacances dit **« vacances d'été »** ; une case hors année qui est **aussi** hors MJPC garde **« hors MJPC »** ; une case hors année d'une **classe non importée** garde **« classe non encore importée »**. **Le mot le plus précis gagne. « avant ta rentrée » ne s'affiche que s'il n'y a rien d'autre à dire.**

**② OÙ LA GARDE SE POSE — et c'est là que tout se joue.** Mesuré dans `edtProjeter` : **les trois gardes du haut coupent la suite** (`continue`) — `horsTemps` (offset 1323), `horsMjpc` (1440), **`nonImportee` (1521)** — **et le réel n'est cherché qu'à l'offset 2649** (`edtChercherTrace`).

**Si tu poses ta garde avec ces trois-là, tu effaces les heures que Paul a réellement jouées avant sa rentrée.** C'est exactement ce que le §② interdit.

**DONC : LA BORNE REMPLACE LE PRÉVU, JAMAIS LE RÉEL NI UNE DÉCISION. Elle se pose APRÈS la recherche de trace, pas avec les trois gardes du haut.** Le §③.① ci-dessus ne classe que **les mots**, il ne dit pas où mettre les lignes.

**Et pour que la case hors année garde le mot des trois gardes du haut alors que ta borne vient plus bas** : ces trois-là coupent déjà avant d'arriver à toi — **tu n'as rien à faire, l'ordre des mots est acquis.** Vérifie-le et dis-le.

## ⓪ter CE QUI N'EST PAS DANS CE MANDAT

- **La passe de vocabulaire et les infobulles** : **abandonnées par la conscience n°11 sur ordre de Paul**, léguées à la conscience suivante. **N'y touche pas.**
- **Le calendrier injecté** : **on ne le retouche pas**, ni au hub, ni dans les JSON. C'est le point de Paul.
- **Tout le reste du lot 2ter** : clos.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ④ MAIS UNE CHOSE EST EXIGÉE, ET PAUL L'A POSÉE CE MATIN

**« tout codage doit être accompagné d'une passe de tooltips. »** Ce mandat **ajoute une nature de case nouvelle**. **Elle porte son infobulle**, dans les mots de Paul : ce que la case est, et pourquoi elle ne porte pas de séance. **Une seule bulle, pas les 94 de la dette — celle que tu ajoutes.**

## ⑤ CE QUI NE DOIT PAS BOUGER — chiffré, remesuré ce jour, à republier

- **Moteur** `AT_DR_B64` : **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**.
- **Correctif du mode test dans `mjpcEcrireRest` : `668cda2757a5`**.
- **`function secu*` 29** · **`published` 97** · **`edt*` 229 déclarations / 229 noms, aucun doublon**.
- **`edt-fige` 9** — tu ne renommes rien · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels**.
- **`EDT_CATEGORIES` 248 caractères · `EDT_MOTIFS` 404 caractères**, inchangés mot pour mot.
- **Les portes** : `edtArriveeProf` **2** · `edtOuvrir` **4** · **`edtSectionPanneau` 4** — *ce dernier compte est passé de 2 à 4 à la livraison ⑪a, qui lui a donné un second appelant hors bloc, `_blocBrevet` (L2115), pour les deux champs de dates. C'est légitime et la garde est verte. Ne le réduis pas.*
- **La classe d'essai reste invisible hors mode test**, et en violet dedans.
- **`banc-tout.mjs` VERT EN ENTIER — il compte 35 bancs**, remesuré ce jour. *(Les mandats précédents disaient 32 : c'était vrai à la livraison ⑧, trois bancs ont été ajoutés depuis. Compte-les toi-même avant d'écrire « entier ».)*
- **Garde `verif_edt.py` verte sur ses cinq questions** · **double parseur vert**.

## ⑥ PREUVES EXIGÉES — par le geste, jamais par la fonction

1. **Les comptes de cases, avant et après, sur LES TROIS VUES** — semaine, mois, année. **Aucune case ne disparaît.** C'est la preuve n°1 parce que c'est le risque n°1.
2. **La semaine du 31 août, par clics** : les cases du 31/08, 01/09 et 02/09 sont **présentes, grisées, sans séance**, avec leur mot. **Capture.**
3. **La semaine du 3 septembre, par clics** : les séances commencent **le 3**. **Capture.**
4. **Les huit événements du 27/08 au 02/09 sont toujours visibles** — compte-les avant et après, et nomme-les.
5. **UNE HEURE JOUÉE AVANT LA RENTRÉE RESTE JOUÉE.** Pose une trace le 1er septembre, déclare la rentrée au 3, montre que la case **est toujours jouée, avec ses activités**. **C'est la preuve qui protège le passé de Paul.**
6. **Une décision avant la rentrée reste intacte** : coche une heure le 1er, borne, montre qu'elle est toujours là.
7. **Les heures perdues** : un événement du calendrier avant la rentrée **ne coûte plus rien**, sa fiche disparaît. Compte avant/après.
8. **La liste des destinations** ne propose plus de créneau hors année : nombre d'entrées avant/après.
9. **Le dépôt hors année est refusé, avec son motif en clair.** Donne le texte.
10. **La photo du prévu** : nombre de cases avant/après, et **`depuis`** — montre ce qu'elle photographie maintenant.
11. **Le pendant inverse** : `finAnnee` dépassée → les cases d'après restent, sans séance. **Si l'écran refuse une `finAnnee` passée — c'est le refus de ⑥ et il est légitime — force-la dans ton banc et DÉCLARE-LE.**
12. **Sans `debutAnnee` ni `finAnnee` déclarées : rien ne change.** Compte avant/après.
    **⚠ ATTENTION, ET C'EST UN PIÈGE MESURÉ** : `edtDebutAnnee()` et `edtFinAnnee()` **inventent une date quand Paul n'a rien posé** — `…-08-01` et `…-07-31`. **Si ta borne les appelle, elle bornera TOUJOURS, même sans rien de déclaré, et cette preuve sera infaisable.** **Ta borne lit `EDT_DATES.debutAnnee` et `EDT_DATES.finAnnee` BRUTES, et ne borne que du côté où Paul a effectivement posé une date.**
13. **L'infobulle de la nature nouvelle** est là.
14. **Non-régression** : la liste chiffrée du §⑤, **`banc-tout` en entier (35)**.
15. **Garde** : verte sur ses cinq questions, **et rouge sur cinq contrôles négatifs que tu poses toi-même**.
16. **Captures par clics, écran entier, journal des clics.** Paul promeut sur captures.
17. **Audit adverse** : `debutAnnee` postérieure à `finAnnee` · une heure à replacer posée hors année · le mode test allumé · la classe d'essai un jour hors année · une date d'année effacée après coup · un événement à cheval sur la rentrée (commence avant, finit après).

## ⑦ DÉCOUPE — deux livraisons, deux arrêts

- **⑭-a** — **l'affichage et le passé** : la fonction unique, la garde dans `edtProjeter` et `edtPeindreAnnee`, l'ordre du §③, **et la protection du §②**. Version **8.73.0-⑭a**. Rapport, puis **STOP**.
- **⑭** — **les comptes, les propositions, les gestes** (§①.2 à ①.5), l'infobulle, les captures, l'audit adverse, `banc-tout` en entier, le rapport final. Version **8.73.0-⑭**. **STOP**.

## ⑧ LIVRABLE

`PONT/EDT/index.html` au sas · les captures dans `PONT/EDT/tests/14a/` et `tests/14/` · `tests/banc-tout.mjs` enrichi · un rapport par livraison (`rapport-2ter-14a.md`, `rapport-2ter-14.md`). Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑥, les écarts signalés sans être ajustés, et **ce que tu n'as pas pu mesurer**.
