# CADRAGE — LE TEMPS ET LA PROGRESSION PAR CLASSE

**Statut** : cadrage arrêté avec Paul, à lire avant tout mandat. Aucun point n'est de mon
initiative : tout ce qui suit vient de ses décisions ou de l'existant mesuré.
**Ce document ne code rien.** Il fixe les objets, les règles et les gestes.
**Dernière mise à jour** : 19 août 2026, après le cadrage complet du bilan, des trois
natures de travail, de la boucle de fin d'heure et des deux rattrapages.

---

## 1 · LA DISTINCTION FONDATRICE

> « Je distingue "séance" dans un chapitre de "heure de cours", celle qui est conditionnée
> par les horaires. Idéalement, dans le meilleur des mondes, une séance égale une heure.
> Mais dans les faits, c'est impossible : on le voit bien avec l'agenda, l'heure de la
> journée, la motivation de la classe, etc. » — Paul

**La séance** est une unité **pédagogique** : elle appartient au chapitre, elle porte des
notions et des compétences, elle contient un déroulé.

**L'heure de cours** est une unité de **calendrier** : elle appartient à l'emploi du temps,
elle a un horaire fixe, elle est lancée puis close.

Elles ne coïncident presque jamais. **On lance une heure de cours**, qui contient tout ou
partie d'une séance.

**Conséquences directes** :
- l'heure de cours **se clôt toujours**, à son horaire — c'est une sécurité ;
- la séance **reste ouverte** tant que son déroulé n'est pas achevé, et reprend à l'heure
  suivante ;
- il n'y a jamais deux séances ouvertes en parallèle : *« une séance est à terminer,
  dusse-t-elle l'être à la maison »* (Paul).

---

## 2 · CE QUE FAIT DÉJÀ WORKTRACK (relevé, non inventé)

La distinction y est déjà nette, et le mécanisme est éprouvé :

- **le cours est un objet partagé** `{debut, fin}`, écrit au lancement ; tout s'y accroche
  (chronos élèves, réarmement des alertes, purge des signaux de l'heure précédente) ;
- **la clôture gèle les chronos, déconnecte, archive un instantané** — et ne touche pas au
  statut des séances ;
- **la séance porte son propre statut** : `à faire · en cours · terminée` ;
- **le chrono est accumulé et pausable** (`accumMs` + `runSince`) : il survit à une
  fermeture d'onglet, à une pause, à un retour le lendemain ;
- **plafond de vraisemblance** : un intervalle aberrant n'est pas compté, plutôt que
  d'ajouter des heures fantômes. Le code le dit : *« ceinture et bretelles »* ;
- **quatre états lisibles** : dans les temps · il te reste peu de temps (80 % du prévu) ·
  tu dépasses · terminée ;
- **alerte T-5 non bloquante**, réarmée à chaque nouveau cours ;
- **le travail hors cours existe déjà** : session d'autonomie de 45 min, alerte à 5 min de
  la fin, **compte double** (6 étoiles au lieu de 3), avec un message dédié à l'élève.

**Ce qui change ici** : dans worktrack, l'heure de fin est saisie et peut être prolongée.
Dans le déroulé, **l'heure de fin est connue de l'emploi du temps** : elle ne bouge pas.
La règle de vraisemblance devient donc inutile, le cadre étant connu d'avance.

---

## 3 · L'EMPLOI DU TEMPS 2026-2027 (lu)

Séances de **55 minutes** : 8h00-8h55 · 8h57-9h52 · 10h07-11h02 · 11h04-11h59 ·
13h00-13h55 · 13h57-14h52 · 15h07-16h02 · 16h04-16h59.

**Deux minutes seulement** entre certaines séances consécutives (8h55→8h57, 11h02→11h04) :
Paul enchaîne deux classes sans respiration. Le déroulé de l'une ne doit pas contaminer
l'autre.

Classes de français : 3e Franklin Aretha · 3e Dylan Bob · 4e Hugo · 4e Turing.
Les séances dédoublées (X Français) et les demi-groupes A/B ne relèvent pas du français.

**Le site connaît l'emploi du temps** — décision de Paul : *« évidemment, car il va aussi
nourrir mon cockpit »*. Il peut donc proposer la classe et l'heure de fin au lancement.

---

## 4 · LE TEMPS D'UNE HEURE

**La fin est fixe. Le début est lancé par Paul.**

> « Le démarrage, c'est moi qui lance à chaque fois, notamment pour gérer un retard de
> début de séance dû à ma faute. » — Paul

**Les cinq dernières minutes appartiennent à l'agenda** — non négociable :

> « Une séance doit terminer 5 minutes avant sa fin réelle, pour l'agenda. C'est un non
> négociable, je dois avoir le temps de faire noter le travail dans l'agenda. » — Paul

**Donc : temps utile = heure de fin − heure de lancement − 5 minutes.**
Lancée à 10h14 pour une fin à 11h02, l'heure offre **43 minutes** d'enseignement.

**Le retard recalcule tout le minutage** des activités prévues. Le site **montre le
débordement**, il ne le résorbe jamais de lui-même :

> « Oui il montre le débordement et je valide ou non. » — Paul

---

## 5 · LE BANDEAU DES CINQ DERNIÈRES MINUTES

Il paraît **dans la zone libre sous les commandes** de l'écran de pilotage (zone non encore
exploitée). Il ne coupe rien, ne fige rien.

Il dit **ce qui reste à faire** et propose, **activité par activité**, quatre choix :

| choix | effet |
|---|---|
| **reporter** | l'activité passe dans une séance ultérieure du chapitre — c'est un changement de progression |
| **donner à la maison** | l'activité devient un prolongement, avec sa date d'échéance |
| **annuler** | l'activité ne sera pas faite |
| **ne rien donner** | choix explicite, qui s'écrit (voir §8) |

Chaque choix affiche **son coût en compétences**, puisque chaque activité déclare ses
notions et ses compétences (taxonomie).

**Distinction à ne pas confondre** :
- **reporter une activité** = la déplacer dans une séance ultérieure (progression modifiée) ;
- **ne pas avoir fini** = continuer à la prochaine heure (la séance reste ouverte).

---

## 6 · LE BILAN CLÔT LA SÉANCE

> « Dès qu'une diapo bilan est atteinte, il y a une coche automatique qui apparaît dans les
> commandes, et si je la coche, ça veut dire que la séance est effectivement terminée et que
> les élèves ont bien écrit le bilan. C'est une sorte d'attestation de ma part. » — Paul

- le **bilan** est un bloc d'un **type propre**, **unique** dans la séance et **toujours
  dernier** ;
- **rien ne peut être inséré, collé ou déplacé après lui** — glisser-déposer et menus
  contextuels le refusent, comme ils refusent déjà d'insérer entre une diapo et sa suite.
  Raison de Paul : *« sinon mon système de coche n'a plus de sens et casse »* ;
- à son atteinte, une **coche paraît dans les commandes** ;
- **tant qu'elle n'est pas cochée, la séance reste en cours** ; cochée, elle est terminée ;
- Paul n'a donc jamais à se demander s'il a bien fermé une séance.

---

## 7 · LES TROIS NATURES DE TRAVAIL

Elles ne se mélangent jamais.

**① Le prolongement** — une activité prévue en classe, non faite, basculée à la maison.
Elle garde ses notions et compétences, donc elle compte dans la progression. Elle porte une
date d'échéance. À la séance suivante, elle se retrouve dans le déroulé, marquée
« donnée à la maison le … ».

**② Le travail donné** — prescrit volontairement, qui n'était pas une activité de classe.
Il naît dans le déroulé comme une consigne portant une échéance.

**③ La révision** — ce que l'élève fait de lui-même. **Elle n'a pas d'échéance et n'apparaît
jamais dans « travail à faire »**, sinon tout devient devoir.

Le **bouton « Travail à faire »** rassemble ① et ②, avec leur date, et paraît :
- dans le récit « Ce qu'on a fait aujourd'hui » ;
- dans le papier ;
- dans la copie pour École Directe.

---

## 8 · « PAS DE TRAVAIL À FAIRE » N'EST JAMAIS UN SILENCE

Le choix de ne rien donner **s'écrit** dans la fiche — pour que l'élève ne le confonde pas
avec un oubli — et **jamais seul** : il est toujours suivi d'une invitation à réviser,
accompagnée de **la liste de ce qui a déjà été fait**.

> « Cependant, tu peux réviser (et là, la liste de ce qui a déjà été fait depuis le début du
> chapitre, puis du début de l'année au fur et à mesure des chapitres). » — Paul

Cette liste :
- se construit **seule**, à partir de la progression réelle de la classe ;
- va du **chapitre en cours** vers les **chapitres précédents**, à mesure que l'année avance ;
- ne propose **jamais** ce qui n'a pas encore été vu ;
- reste une **invitation sans échéance**, hors du décompte du travail à faire.

---

## 9 · LA BOUCLE DE FIN D'HEURE

1. Paul lance l'heure (classe et fin proposées par l'emploi du temps).
2. Il déroule ; les durées réelles s'enregistrent, la participation aussi.
3. À T-5, le bandeau paraît : choix par activité, avec leur coût en compétences.
4. Les choix entrent dans la fiche (relecture **et** papier).
5. **Deux gestes** : copier pour École Directe « contenu de séance », puis « travail à faire ».
6. L'heure se clôt à son horaire ; la séance reste ouverte ou est attestée par la coche.

**La collecte est faite sans saisie supplémentaire** : durées réelles par activité,
participation orale, ce qui a été fait et ce qui ne l'a pas été avec son motif.

---

## 10 · RÈGLE GÉNÉRALE DES ALERTES

> « Je peux très bien par la suite modifier mon chapitre et créer une nouvelle activité ou
> séance avec cette fameuse compétence. Et donc l'alerte n'aura plus de sens si c'est prévu.
> Donc ça doit être une alerte mais qui n'ignore pas l'état général du site. Comme toutes
> les alertes d'ailleurs. » — Paul

**Une alerte ne constate jamais un manque sans regarder ce qui est prévu ailleurs dans le
site.** Elle dit « il faudra y revenir, c'est prévu séance 6 » plutôt que « vu une seule
fois », et **disparaît d'elle-même** dès que le prévu existe.

**Cette règle vaut pour toutes les alertes du site**, pas seulement celles de progression.

Les alertes de progression paraissent à trois endroits : **en fin de séance** (dans le
bandeau), **au profil de la classe**, **au cockpit prof**.

---

## 11 · L'ABSENCE

**Pratique de Paul, consignée** : l'absence n'est jamais reprochée en tant que telle, mais
un élève doit toujours être à jour de son travail. Aujourd'hui, Paul gère cela à l'oral et
**n'a aucune visibilité sur ce qui a réellement été rattrapé dans le cahier**.

**Ce que le site produit automatiquement** pour un absent : le récit du jour manqué, le
travail qui était donné, et le message — *« tu étais absent ; si une notion te manque, ne
tarde pas à demander »*.

**Ce qui est ajouté** : une **déclaration de mise à jour** par l'élève (j'ai recopié · j'ai
collé la fiche · je n'ai pas compris tel point + champ libre), produisant un **tableau des
retards de mise à jour** — et non des absences.

**Limite déclarée** : c'est déclaratif ; l'élève peut cocher sans avoir fait. D'où une
**confirmation possible par Paul** au vu du cahier, ou une levée.

---

## 12 · LES DEUX RATTRAPAGES SONT DISTINCTS

**Rattraper une évaluation** — chantier **X** de la doctrine, *« chantier à part entière par
app, à planifier explicitement, jamais à glisser dans une passe »*. Le rattrapage est
**modal** : la modalité change, pas seulement la date (dictée audio pour l'absent, fichiers
réels sur `mjpc-medias`, lecteur pausable, périmètre strict). La modalité est **tracée**
(flux étude, conditions connues), et un **écran de décision distinct** tranche
*compter / ne pas compter*, réversible.

**Rattraper un cours manqué** — se remettre à jour : recopier, coller, comprendre. Sans
note, sans modalité, sans décision.

**Ce qui leur est commun** : la **liste « ce qui me manque »**, point d'entrée unique pour
l'élève, renvoyant chacun vers son propre mécanisme.

---

## 13 · L'ARCHITECTURE À TROIS OBJETS (rappel, déjà arrêté)

- **la trame de référence** — le cours préparé, au niveau, dans le chapitre ; elle ne bouge
  que sur décision ;
- **la séance jouée par classe** — copie de la trame au démarrage, vérité de cette classe
  (horaires réels, saisies, participation, rythme) ; **rien ne circule entre classes** ;
- **la remontée par geste explicite** — « verser dans la trame », jamais automatique.

**Conséquence** : l'avancement est **propre à chaque classe**. La trame dit ce qui est
prévu, la séance jouée dit ce qui est arrivé.

---

## 14 · CE QUI RESTE OUVERT

- **la séance continuée à la maison** : sur quoi l'élève peut travailler (la relecture, les
  fiches et les activités d'application ont un sens ; le déroulé projeté n'en a pas seul) ;
- **le calendrier des séances** — prévision, et report ; chantier suivant, qui absorbera des
  parties du plan non encore touchées ;
- **le profil de classe** — morceau à part, après le calendrier ;
- **le tiroir « Sous la main »** — déjà cadré (approfondir la séance en cours ou rappeler
  les prérequis de la suivante, réglé sur la taxonomie, lien explicite affiché, jamais de
  temps en plus), à coder avec le temps ;
- **la liste du déjà-fait proposée à la révision** : identique pour toute la classe, ou
  tenant compte de ce que l'élève a personnellement manqué ? Élément de réponse donné par
  Paul : l'absent se voit mentionner qu'il était absent ce jour-là, et qu'il ne doit pas
  traîner s'il a une question sur la notion vue à ce moment-là.

---

## 15 · ORDRE DE TRAVAIL ARRÊTÉ PAR PAUL

1. **le temps** (ce cadrage) ;
2. **l'intégration du déroulé dans le site** — pour que Paul puisse finaliser son chapitre 1 ;
3. **les prompts** — rendus nécessaires par le module qui remplace le diaporama ;
4. **le calendrier** — qui absorbera naturellement des parties déjà au plan ;
5. **le profil longitudinal** — sur cette base.
