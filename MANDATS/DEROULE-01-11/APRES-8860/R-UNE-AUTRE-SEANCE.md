# MANDAT R — « UNE AUTRE SÉANCE… » DANS LA CASE (C16 342, 639, 764)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`. Branche : `deroule/suite`, depuis son dernier commit (la conscience te le donne). **30 minutes au plus** ; à la limite, tu pousses ce qui est prouvé et tu dis ce qui reste.*

## 0 · CE QUE PAUL A DIT (ses mots)
- 03/11 11:29 : « La séance de dylan dans l'edt est à la séance 2 aujourd'hui, je n'ai donc pas pu lancer la séance 1. » ; 12:16 : « une séance 4 faites à la place d'une séance 1 par exemple ne doit pas faire que la séance 1 doit être indiqué en non joué ou non fait ou je ne sais quoi. » ; 12:42 : « une séance peut ne pas être terminée, donc il faut reprendre là où je me serai arrêté! »
- C16 764 (05/11 07:25) : « dans la case, sous « ▶ Ouvrir le pilotage et lancer », un lien « une autre séance… » qui liste les séances du chapitre avec leur état (finie, commencée, à jouer) ; celle que tu choisis se lance comme une vraie heure. Une séance commencée et pas finie passe en tête : la case suivante la continue, là où tu t'es arrêté. « Où en sommes-nous ? » lit la dernière heure que la classe a vraiment jouée, quel que soit son numéro ; quand on joue dans l'ordre, rien ne change. »
- Paul, 05/11 07:35 : « oui pour 764 ».

## 1 · CE QUE TU FAIS
Ce que dit 764, rien d'autre. Le lancement passe le numéro d'heure de la séance jouée, pas celui de la case (vérifie d'abord, l. 19565 de l'assemblé de la base).

## 2 · LA SUPPOSITION (mesurée par le mandat N, sas `mesure/autre-seance` `e13df3cb6`, sa NOTE ; À VÉRIFIER)
Une séance est finie quand ses heures prévues sont jouées et que la dernière n'a rien reporté (l. 18742-18755) ; la file = les séances non finies dans l'ordre du chapitre (18814) ; une case à venir prend la tête de la file (18959-18965) ; `edtLancer` (19539-19566) et `dr_lancer` (dr-classe.js 892) lancent déjà n'importe quelle séance ; « Où en sommes-nous ? » lit la séance d'avant dans l'ordre (dr-recit.js 588).

## 3 · LA PREUVE
Par le geste, au faux hub (la sonde du mandat N, devenue une sonde par le geste) : la classe inventée, la séance 4 choisie par « une autre séance… » et jouée à la place de la 1 ; base → après, compté : la case de ce jour-là, les cases suivantes, l'état des séances, la Relecture et « Le chapitre », le travail à faire, « Où en sommes-nous ? » (il lit la 4, puis, la 1 jouée, il lit la 1) ; une séance 4 pas finie : la case suivante la continue ; une classe qui joue dans l'ordre : rien ne change ; le parcours vert.
