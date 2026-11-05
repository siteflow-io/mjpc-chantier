# MANDAT Q — LE TABLEAU DISTANT, UNE SESSION À LA FOIS, SANS JAMAIS BLOQUER PAUL (㊶, C16 640, 759)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`. Branche : `deroule/suite`, depuis son dernier commit (la conscience te le donne). **30 minutes au plus** ; à la limite, tu pousses ce qui est prouvé et tu dis ce qui reste.*

## 0 · CE QUE PAUL A DIT (ses mots)
- 03/11 12:26 : « l'adresse du tableau distant, quand elle est occupée, ne peut JAMAIS être utilisée par une autre session ou autre chose. C'est une session à la fois, que ce soit répétition, séance en mode test ou séance en vraie classe. »
- 03/11 12:42 : « attention au "jamais bloqué". »
- C16 759 (05/11 07:19) : « le tableau appartient à la session qui l'a pris ; toute autre est refusée, et le site dit laquelle le tient et depuis quand, avec deux boutons, depuis n'importe quel appareil : « Reprendre cette session » (tu la retrouves où elle en était), ou, pour une répétition ou un essai seulement, « L'arrêter et prendre le tableau » (un clic). Une vraie heure abandonnée ne s'arrête que par « Reprendre » puis « Clore l'heure », pour ne sauter aucune étape de la fin d'heure. »
- Paul, 05/11 07:35 : « 759 ok ça me va. Ce qu'il faudrait c'est des informations supplémentaires sur la session qui a le tableau au moment où je veux le prendre pour une vraie séance, car ça me permettrait de savoir de quelle session il s'agit (des infos telles que le type de session lancée, à quelle heure, quel jour, sur quelle séance et quelle classe, etc). »

## 1 · CE QUE TU FAIS
1. Le tableau appartient à la session qui l'a pris : une vraie heure, une répétition ou un essai (mode test) lancé ailleurs pendant ce temps est refusé ; plus aucune session ne prend le tableau d'une autre sans rien dire.
2. Le refus dit, en clair, quelle session tient le tableau : son type (vraie heure, répétition, essai en mode test), sa classe, sa séance (et l'heure de la séance), le jour et l'heure de son lancement, depuis combien de temps, la diapo où elle en est.
3. Sous ce refus, depuis n'importe quel appareil : « Reprendre cette session » ; pour une répétition ou un essai, « L'arrêter et prendre le tableau » (un clic, puis la session demandée part) ; pour une vraie heure, « Reprendre » seulement (puis « Clore l'heure »). Cela marche même si l'appareil qui tenait le tableau a disparu.
Chaque bouton nouveau porte son infobulle écrite pour Paul.

## 2 · LA SUPPOSITION (mesurée par le mandat L, sas `mesure/une-session` `3bec17c5f`, sa NOTE ; À VÉRIFIER)
Les sessions s'annoncent à `/site/cours_actif` (vraie heure), `/site/repetition/pointeur` (répétition), `/site/tableau_test/pointeur` (essai et répétition en mode test) ; l'heure de l'annonce est écrite au lancement ou à la reprise ; « fraîche » 4 h ; le tableau suit la plus forte (`dr_tabLirePointeur`) ; seule une vraie heure refuse aujourd'hui une répétition (« tableau distant pris ») ; les bandeaux « … en cours — Reprendre » existent ; « Clore l'heure », « ■ Arrêter », l'annulation, l'arrêt du mode test effacent l'annonce.

## 3 · LA PREUVE
La sonde du mandat L (`LIVRAISONS/DEROULE-01-11/MESURE-UNE-SESSION/`, avec la partie ㊶ de `AUDIT-GLOBAL/sonde-audit-I.mjs`), reprise : base → après, compté, pour chaque combinaison jouée (une session tient, une autre est lancée ailleurs : refusée, et ce que dit le refus) et chaque disparition (reprendre, ou arrêter et prendre, depuis un autre appareil) ; le parcours vert ; le banc 1255 et la sonde de l'appel verts (sur `banc/nuit`).
