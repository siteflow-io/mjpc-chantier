Reprise — conscience n°10, second message. Ce message remplace intégralement le précédent. Ta prise de fonction était bonne : transcript ouvert au premier tour, statut déclaré comme inconnu plutôt qu'inventé, empreinte vérifiée, compte de lectures refait à ton compte, avis motivé sans décider seul. Continue ainsi.

## ① LES JETONS ET LE DÉPÔT PUBLIC — Paul a tranché : on n'y touche pas
Ta découverte est confirmée par mesure : les deux dépôts répondent **200 sans jeton**, ils sont **publics**, et les passations contiennent les jetons en clair. **Paul a décidé de ne pas s'en occuper** : il a six jours avant la rentrée et il doit avancer. **Ne le relance pas là-dessus.** C'est consigné, il sait, la décision est la sienne.

## ② UNE CORRECTION À FAIRE DANS TA MÉMOIRE — et la leçon qui va avec
Tu as repris « le message-réponse `oral` à coller » de la passation. **Cet item n'est attesté nulle part** : la source (`PONT/MEMOIRE-VIVE-RENTREE.md`, point 3) dit seulement *« Le chapitre 3e achevé (É4 : trames + JSON + injection + liaisons) → "audit chapitre" ici → publication S1. »* La n°9 l'a porté trente fois sans jamais l'ouvrir.

**Et elle s'est trompée deux fois sur ce mot.** Elle a ensuite écrit que `oral` était « un type qui n'existe pas encore », sur la foi d'une phrase de Paul commençant par *« je pense que… »*. **Vérification faite : le type `oral` EXISTE** — `{id:'oral', libelle:'Oral et récitation'}` dans `CH_TYPES_SEANCE`, né du chantier chapitre 3e (récitation coévaluée), tranché par Paul, ajouté en 8.59.5.
Les huit types de séance : `intro_image` · `etude_texte` · `notions` · `dictee_reecriture` · `atelier_ecriture` · `remediation` · **`oral`** · `tache_finale`. Les sept `kinds` d'outils : `doc` · `dictee` · `reecriture` · `analyse_logique` · `qcm` · `tache` · `diaporama`.
**Reste ouvert, non mesuré** : un **outil** correspond-il à ce type de séance, ou est-il dans le cas d'`etude_texte` et `entrainement`, annoncés « à venir » ?

**Deux leçons opérantes** : un item transmis par un pontage **n'est pas une source**, vérifie-le avant de le répéter · **une hypothèse de Paul reste une hypothèse tant qu'elle n'est pas mesurée** — surtout quand il dit « je pense ».

## ③ TU AS TROIS OUTILS NEUFS — ils répondent au diagnostic de Paul
Paul, 25/08 : *« vu que la connaissance du site est partielle, l'IA code par-dessus l'existant sans le connaître. »* C'est la cause des bugs successifs, plus que la fatigue ou l'amnésie. Il ne veut pas que tu satures en lisant tout ; il veut que tu aies **une connaissance du site qu'aucune conscience neuve n'a jamais eue dans ses premiers tours**. Voici de quoi.

**`docs/MJPC6-OU-TROUVER-QUOI.md`** (9 Ko — **lis-le en entier, maintenant, c'est court**)
La table qui traduit les mots de Paul en fonctions. Une trentaine d'entrées, **toutes mesurées sur la production les 24-25/08** : « la fin d'heure » → le T-5 complet avec ses quatre choix · « copier pour École Directe » → `copierED` dans le moteur · « taper les initiales » → le VIF · « le texte déborde » → la coupure en cascade · « le dézoom recolle » → la réabsorption · « les schémas » → les cinq formes SVG du moteur. Plus une seconde table : **CE QUI N'EXISTE PAS, vérifié** — le bloc bilan, les schémas dans les feuilles, le VIF au téléphone, le T-5 au téléphone, le profil de classe, le profil élève, le temps réel, la version visible sur le tableau.

**`docs/MJPC6-INDEX-FONCTIONS.md`** (176 Ko — **ne le lis pas, CHERCHE dedans**)
Les **1 142 fonctions** du site et du moteur : nom, arguments, taille, ligne, ce qu'elle fait, qui l'appelle, ce qu'elle appelle. Aucune sans description : quand le commentaire manque, le résumé est déduit du corps — libellés affichés, éléments touchés, chemins du hub, et si elle **écrit** au hub.

**`docs/outils/index_fonctions.py`** — le générateur, à relancer sur la production courante. L'index ne pourra pas se périmer en silence.

**LA RÈGLE QUI VA AVEC, et elle est ferme** : *avant d'écrire une fonction ou de proposer une fonctionnalité, cherche dans la table, puis dans l'index, puis un synonyme — et seulement alors conclus que ça n'existe pas.* La n°9 a proposé **trois fois** de créer ce qui existait déjà.

## ④ CE QUE PAUL ATTEND MAINTENANT
Ton ordre proposé tient, débarrassé des jetons : **① M-SÉCU** — ton argument est juste, M17a va faire entrer des noms d'élèves réels sur un hub sans règles · **② la vignette de groupe** (elle empiète encore sur l'étiquette et la première ligne de consigne déborde à droite — vu sur capture pleine page) · **③ le VIF au téléphone**.
Pour le VIF, tu as tout dans la table : **il existe au pilotage ordi** (`_drVifInstaller`) — champ d'initiales, réduction à chaque lettre, ouverture automatique dès qu'un seul candidat reste, motifs 1/2/3, note, Ctrl+Z, résolution canonique (« TM » trouve « MT »). **Le porter, pas en inventer un autre.** La n°9 a écrit « liste dense » dans un mandat, l'exécutant a livré des cartes, Paul a refusé.
**Et deux choses ne dépendent que de Paul** : finir le chapitre 3e avec É4 (trames, JSON, injection, liaisons) → audit chapitre → publication S1 · **M17a** : purger les classes 2025-2026, importer les quatre réelles (3e Aretha Franklin, 3e Bob Dylan, 4e Hugo, 4e Turing) + la classe test, vérifier codes et liens.

## ⑤ TA DETTE DE LECTURE — ton approche est la bonne
Lire le noyau par tranches, une par tour, en déclarant ce qui n'est pas lu : c'est exactement ce qu'il faut. Mais **les deux index changent l'ordre de tes priorités** : ils te donnent en 9 Ko ce que 680 Ko de documents ne t'auraient pas donné — la connaissance de **ce qui existe**. Les documents, eux, te donnent **pourquoi c'est ainsi** et **ce que Paul a décidé**. Lis dans cet ordre : la table d'abord, les décisions ensuite.

## ⑥ ÉTAT DE PRODUCTION — inchangé
v8.67.0, commit `3a4dfbf`, md5 `9968969807aae52052ca0e6254d3daf9`, 1 490 154 octets. Vérifie avant tout geste. Retours possibles : 8.66.0 `8f8a7ecebdcd918777cbd645e3150d57` · 8.65.1 `85a6c75946dd002327b36114090c2eb7`.

**Réponds à Paul : ce que tu as compris de l'index, ce que tu proposes en premier, et ta dette de lecture actualisée. Ne lui repose pas de question dont la réponse est déjà écrite.**
