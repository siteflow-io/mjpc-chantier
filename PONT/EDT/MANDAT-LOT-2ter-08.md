# MANDAT EXÉCUTANT — LOT 2ter · LIVRAISON ⑧ · LA DERNIÈRE · CE QUE PAUL POURRA COMPARER
*Base : le candidat au sas, `PONT/EDT/index.html` — **1 750 002 octets**, md5 **`47cb5add128eea6fdcb241cf70cc3dd0`**, **217 fonctions `edt*`**, version affichée **8.73.0-⑦**. **STOP si le md5 diffère** : ne code rien, dis-le et attends. Candidat à produire : **8.73.0-⑧**.*

*Les livraisons ① à ⑦ sont closes et auditées. **C'est la dernière du lot** : après elle, Paul promeut.*

## CE QUE ÇA CHANGE POUR LA CLASSE — dans les mots de Paul

« **le cockpit compare le réel à la photo de ton choix.** »

« **le mot “figer” est interdit** » — on dit **« photo du prévu »**.

« **tout est un objet, encore une fois** » · « **objet, donc id** ».

**Concrètement.** En juin, Paul veut savoir ce qu'il avait prévu en septembre et ce qu'il a réellement fait. Pour cela il faut qu'une photo du prévu ait été prise **au bon moment** — à la rentrée, au début de chaque période — **sans qu'il ait à y penser**. Aujourd'hui la photo n'existe que s'il clique sur un bouton : s'il oublie, il n'a rien à comparer, et **on ne peut pas rattraper le passé**.

## ⓪ LECTURES · JETON · L'ÉTAT RÉEL · CE QUI EXISTE DÉJÀ

**Lis avant de coder** : `PONT/EDT/MANDAT-LOT-2ter-v2.md` **§⑭** (les photos) et **§⑱** (ce que la livraison finale doit porter) · `PONT/EDT/rapport-2ter-07.md` · `PONT/EDT/SEQUENCE-TEST-PAUL.md` (il existe, HTTP 200) · `outils/verif_edt.py` (cinq questions). **`index.html` fait 1,75 Mo : ne le lis jamais en entier.**

**Le jeton du sas te sera donné dans la conversation, une fois.** Jamais dans un fichier. Aucun accès en écriture à la production : Paul seul promeut.

**RÈGLE DE NOMMAGE** : **tout nom de variable locale du bloc EDT commence par `edt`.**

**DEUX RÈGLES DE BANC, gravées par Paul :**
1. **UN BANC PASSE PAR LE GESTE, JAMAIS PAR LA FONCTION** — ce qui n'est pas atteignable par un clic n'est pas prouvé, **et se déclare comme tel**.
2. **UNE PREUVE DIT CE QU'ELLE CONTIENT**, pas seulement qu'elle existe.

**CHERCHER AVANT DE FABRIQUER — mesuré dans le candidat :**
- **`edtPhoto` existe et elle est déjà propre** : elle prend la photo de l'état d'avant (`edtPhotoDe('photos')`), pousse `{prise, depuis, cellules}` et passe par `edtEcrireArchive`. **Elle a UN SEUL appelant : le bouton « 📷 Photo » de la vue semaine** (L21018). C'est là qu'est le manque.
- **`edtPeriodes` et le magasin des périodes** portent les dates de début de période : c'est ce qui déclenche la photo automatique.
- **`SEQUENCE-TEST-PAUL.md` est au sas** et **doit être mis à jour**. **Paul la joue APRÈS la promotion — ne la lui donne pas maintenant.**
- **`tests/banc-tout.mjs`** enchaîne tous les bancs du lot : **c'est lui qui doit être vert en entier à la fin.**

## ① LA PHOTO SE PREND TOUTE SEULE — c'est le manque mesuré

1. **À la rentrée et au début de chaque période**, une photo du prévu est prise **sans que Paul ait à y penser**. Le déclencheur est le passage d'une date de début de période, lu dans le magasin des périodes.
2. **Elle ne se prend qu'une fois par échéance** : deux chargements le même jour ne font pas deux photos automatiques. **Le site sait laquelle il a déjà prise.**
3. **La photo à la main reste** : le bouton « 📷 Photo » ne bouge pas, et **plusieurs photos le même jour sont normales — rien n'écrase rien**.
4. **Chaque photo porte un identifiant**, comme tout objet du lot — c'est le manque relevé au §⑭. `edtPoserIdsObjet` sait le faire, la famille `pho:` existe déjà dans `EDT_FAMILLES`.
5. **Elle est nommée** : Paul doit pouvoir dire « la photo de la rentrée », « la photo du 2e trimestre ». Une photo automatique porte le nom de son échéance ; une photo à la main porte sa date.
6. **Le mot « figer » n'apparaît nulle part** : on dit **« photo du prévu »**, partout — bouton, message, journal, infobulle. **Vérifie-le à zéro occurrence.**

## ② LA MATRICE ACTIONS × ÉTAT

Le site en porte déjà trois mentions (L15857, L20252, L21063). **Tu la publies en clair, à jour, dans ton rapport** : pour chaque geste de l'emploi du temps — cocher, banaliser, déplacer, échanger, écraser, replacer, perte sèche, annuler — **ce qu'il fait selon l'état de la case**, et ce qu'il refuse. C'est la table que la conscience n°12 lira pour comprendre le bloc sans avoir vu la conversation.

## ③ `SEQUENCE-TEST-PAUL.md` — mise à jour, pas donnée

Le fichier existe. **Tu le mets à jour** avec tout ce que le lot a ajouté : les heures perdues et leurs motifs, les trois issues, l'heure à replacer, les dates de l'année, la vue Année, la classe d'essai en mode test, les photos. **Chaque étape est un geste par clics, avec ce que Paul doit voir.**

**Tu ne la lui donnes pas dans ton rapport : il la joue après la promotion.**

## ④ LE RAPPORT FINAL DU LOT

C'est la dernière livraison : ton rapport porte, en plus des preuves, **un état complet du lot 2ter** pour la conscience suivante —
- ce que chaque livraison a apporté, en une ligne ;
- **les dettes ouvertes qui restent**, s'il en reste ;
- **ce qui a été déclaré et jamais tranché** ;
- **la matrice du §②** ;
- **le compte-rendu de `banc-tout.mjs` en entier**.

## ⓪bis CE QUI N'EST PAS DANS CE MANDAT

- **La passe de simplification des textes affichés** : dette déclarée par Paul, **livraison à part**. **Mais n'aggrave pas** : écris tes textes dans ses mots.
- **La confrontation des dettes au code** : ce n'est pas un travail d'exécutant.
- **Le cockpit qui compare le réel à la photo** : il existe déjà, tu lui donnes des photos, tu ne le refais pas.

Si l'un de ces sujets te paraît nécessaire, **signale et attends**.

## ⑤ CE QUI NE DOIT PAS BOUGER — chiffré, à remesurer et publier

- **Moteur** : `AT_DR_B64`, **309 812 caractères**, md5 **`2ba70f9ef8aacb6f81962ea4e1b62944`**, identique bit à bit.
- **`function secu*` 29** · **`published` 97** · **`function edt*` 217**, aucune disparue ; toute fonction ajoutée est nommée.
- **Trois portes** : `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir`, et pas une de plus.
- **Correctif du mode test intact** · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels**.
- **`EDT_CATEGORIES` et `EDT_MOTIFS` inchangés**, mot pour mot.
- **La vue Année ne contient toujours AUCUNE écriture** : elle affiche, elle ne recalcule rien.
- **La classe d'essai reste invisible hors mode test** : 30 créneaux, comptes par classe inchangés.
- **Les comptes d'heures perdues sont identiques avant et après** cette livraison.
- **`banc-tout.mjs` VERT EN ENTIER** · **double parseur vert** · **garde verte sur ses cinq questions**.

## ⑥ PREUVES EXIGÉES — mesurées, aucune affirmée

1. **La photo automatique se prend** : au passage d'une date de début de période, **1 photo écrite**, nommée. Donne son contenu — nombre de cases, `depuis`, `prise`, identifiant.
2. **Elle ne se prend qu'une fois** : deux chargements le même jour → **1 seule photo**, pas deux. Trois chargements → toujours une.
3. **La photo à la main marche toujours**, et **deux photos le même jour ne s'écrasent pas** : compte avant, compte après.
4. **Chaque photo porte un identifiant** de la famille `pho:`, **tous distincts**. Donne-les.
5. **`figer` : ZÉRO occurrence** dans les textes affichés. Compte avant, compte après.
6. **Archive avant écriture** : une photo écrite sur un nœud existant archive l'état d'avant — **donne le contenu de l'archive**, pas seulement son existence.
7. **La matrice actions × état**, publiée en clair dans le rapport.
8. **`SEQUENCE-TEST-PAUL.md` à jour** : dis ce que tu y as ajouté, sans en donner le contenu à Paul.
9. **Non-régression** : la liste chiffrée du §⑤.
10. **`banc-tout.mjs` en entier** : compte-rendu complet, **tous verts**, une ligne par banc.
11. **Garde** : verte sur ses cinq questions, **et rouge sur cinq contrôles négatifs que tu poses toi-même**.
12. **Captures par clics** : la photo à la main, puis une photo automatique déclenchée, avec le journal.
13. **Audit adverse** : cherche ce qui casse. Aucune période déclarée · deux périodes qui commencent le même jour · une échéance passée depuis longtemps au premier chargement de l'année · le hub qui refuse l'écriture de la photo · vingt photos déjà en magasin · une photo dont les cellules sont vides · le mode test allumé (la photo ne doit pas partir au vrai hub).

## ⑦ MÉTHODE ET DÉCOUPE

**Deux livraisons courtes**, chacune poussée au sas et **close par un arrêt** ; Paul relance par « continuer ».

- **⑧-a** — la photo automatique, son identifiant, son nom, « figer » à zéro (§①). Version **8.73.0-⑧a**. Rapport, puis STOP.
- **⑧** — la matrice, `SEQUENCE-TEST-PAUL.md`, les captures, l'audit adverse, **`banc-tout` en entier**, et **le rapport final du lot** (§②, §③, §④). Version **8.73.0-⑧**. STOP.

**Tu ne livres jamais avec une dette** : un trou trouvé — même hors mandat, même préexistant — se **déclare** et se résout dans la même livraison. **C'est la dernière livraison du lot : rien ne doit rester ouvert derrière toi.** **Tu ne réécris pas ce mandat** : tu signales et tu attends.

## ⑧ LIVRABLE

`PONT/EDT/index.html` au sas (jamais en production) · `PONT/EDT/SEQUENCE-TEST-PAUL.md` à jour · `tests/banc-tout.mjs` enrichi · un rapport par livraison (`rapport-2ter-08a.md`, `rapport-2ter-08.md`) · les bancs rejouables d'une commande · les captures. Chaque rapport porte la base, le candidat (**taille et md5 relus au sas après le push**), les preuves du §⑥, les écarts signalés sans être ajustés, et ce que tu n'as pas pu mesurer.
