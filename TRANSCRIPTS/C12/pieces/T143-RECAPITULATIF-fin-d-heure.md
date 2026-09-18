# RÉCAPITULATIF — la fin d'heure, le récit en trois temps, le temps par activité, le travail à faire, la participation (18/09/2026, tour 143)
*Ce que Paul a décidé ce matin, ce que j'avais fait et pourquoi, ce qui change, ce qui reste à trancher. Rien n'est codé dans ce tour ; ce texte est à valider, puis il entre aux cadrages 1, 2 et 4 et la v9c.14 le porte.*

## A. Ce que j'avais fait pour l'écran de fin intégré, et pourquoi
- La v9c.13 rend la vue de fin **dans le cadre du tableau** (le même « mur »), pour que les mêmes outils restent dessous et que le tableau des élèves reçoive la même chose que d'habitude par l'état envoyé. Les décisions sont allées dans la colonne de droite parce que c'est la colonne « Où on en est » qui devient, en fin d'heure, la colonne des décisions ; la barre « Clore » en bas parce qu'elle ferme l'heure.
- **Mais ce n'est pas une vraie diapo** : c'est un rendu à part du mur (un état `finHeure`), qui ne se dévoile pas au clic, ne se gèle pas, n'a pas de pages, ne se surligne pas, n'est pas dans le volet, n'est pas dans la trame, et le récit qu'elle montre ne défile pas et ne se modifie pas. Tu l'as vu tout de suite. C'est un choix d'exécution qui n'était pas cadré : il a fait ce que le protocole interdit (combler seul un trou). Tu le trancherais autrement, et tu as raison.

## B. Ce que tu décides : la diapo de fin d'heure est une vraie diapo
- **Une diapo de rôle « fin d'heure »**, prévue dans la trame du chapitre par le prompt de création (comme la réactivation et le bilan, qui sont des rôles) : **la dernière diapo de chaque heure**. Elle est vide dans la trame et **remplie par la vraie avancée de l'heure** : le travail à faire (avec l'échéance), le contenu de la séance (le récit de l'heure), la participation.
- **Elle hérite de tout ce qu'ont les autres diapos** : elle est dans le volet à sa place, elle se dévoile au clic sur ▶ élément par élément, elle se gèle, se surligne, se met en lumière, se pagine (le récit long défile par pages comme une réponse longue), se met à la taille, va au tableau par l'état, entre au journal ; on y va par ▶ depuis la dernière activité, par sa vignette (avec la garde), et T-5 propose d'y aller.
- **Ses éléments, dans l'ordre du dévoilement** (proposition) : 1) « Prenez vos agendas — pour le [date] » (l'échéance, en gros, qui pulse), 2) le travail à faire (l'agenda École Directe reconnaissable, en Garamond), 3) le contenu de la séance (le récit en trois temps), 4) qui a participé (avec ses métas). Chaque ▶ dévoile le suivant.
- **Tout ce qu'elle montre est modifiable dans la diapo, en direct** : le travail à faire s'écrit dedans (plus de champ à part) ; **le récit se modifie avec le même mécanisme que la relecture : figer, puis modifier** (tant qu'il n'est pas figé, il se recompose à chaque geste ; figé, ton texte tient). Ce que tu écris est ce qui part (École Directe, récit, historique) — et c'est **pour les élèves** autant que pour toi.
- Le contenu de séance **défile** (pages, molette, comme une réponse longue).

## C. Le récit en trois temps, calés sur l'horaire (cadrage 2)
- **« Au début de l'heure, on a commencé par… »** : tout ce qui s'est passé **dans les dix premières minutes**.
- **« Puis, au milieu de l'heure, on a fait… »** : tout ce qui s'est passé **entre la 25ᵉ et la 35ᵉ minute**.
- **« Enfin, à la fin de l'heure, on a fait… »** : tout ce qui s'est passé **entre la 45ᵉ et la 55ᵉ minute**, suivi de **« et on l'a terminé » / « mais on ne l'a pas terminé »** — le verdict porte sur **l'activité en cours à T-5** ; si elle vient d'être commencée (**entre 1 et 5 minutes** dedans), elle est non terminée mais **« tout juste commencée »**.
- **Les entre-temps** (10ᵉ-25ᵉ, 35ᵉ-45ᵉ) sont **racontés simplement, sans repère de temps** (les connecteurs de l'ancien moteur : « ensuite », « après quoi »…).
- Le paragraphe par activité (cadrage 2, 1.2) reste : une activité qui traverse deux temps est racontée dans le temps où elle a commencé, et le temps suivant la reprend (« on a continué… ») — **à trancher** : ou bien on la coupe entre les deux temps ?

## D. Le temps par activité, modifiable en direct (l'ancien, repris)
- Ce que l'ancien avait (moteur L783-785) : **une ligne par écran, un champ « min » modifiable pendant le cours, l'heure prévue de début calculée en cumulant depuis le début de l'heure, et la ligne de l'écran en cours qui clignote en ambre quand on est en retard sur l'horaire** ; c'est aussi ce qui dit « où on devrait être » à l'heure qu'il est.
- Repris **par activité** (avec ses diapos), et c'est ce qui donne aux trois temps du récit leur base : l'horaire prévu contre l'horaire réel.
- **La règle « tout dans le même écran, sans défilement »** — la disposition que je propose : « Où on en est » devient une **liste compacte dans la colonne de droite** : une ligne par activité de l'heure, `[min] hh:mm  Activité n — titre`, la ligne en cours en ambre si retard, les faites grisées ; les durées se tapent dans la ligne ; à 10 activités, ça tient (une ligne de 22 px chacune) ; s'il y en a plus, la colonne s'élargit d'une poignée avant de défiler. Le reste de la colonne (participation, vue du tableau) reste. **À valider sur capture** à la prochaine livraison.

## E. Le travail à faire
- **Ce que le site a déjà envoyé** pour la même échéance (les heures précédentes de la même classe, ou une autre de tes classes ? non : la même classe) **apparaît au tableau, dans le travail à faire, et le travail de cette heure vient s'y ajouter** — mesurable : c'est dans le hub.
- **Mise en tension** : ce que l'élève a déjà dans son agenda École Directe **par d'autres professeurs**, le site ne peut pas le lire (École Directe n'ouvre pas d'accès ; tu l'as vu au tour 101) — donc « ce que l'élève a déjà pour ce créneau » = ce que **toi** tu as déjà donné pour ce créneau, pas ce que les collègues ont donné. Si tu veux voir l'agenda complet de l'élève, c'est une copie manuelle, pas le site.
- **Les cases rapides** (les notions à apprendre, « ce que la trame prévoyait », le travail choisi par activité) **se répercutent au tableau à la lettre** quand tu coches ou décoches — et ton texte libre, écrit dans la diapo, remplace la composition tant qu'il est figé.
- **Plus de champ à part** : la diapo est le champ.

## F. La colonne de droite en fin d'heure : une séquence
- Tout ce que tu as à cliquer en fin d'heure t'est **proposé dans l'ordre, en sections qui s'empilent, repliées** : **1) l'échéance du travail à faire** (« prenez vos agendas pour le… » — la date part au tableau), **2) les cases à cocher** (par activité restante : à l'heure suivante / terminer / préparer / réserve / non fait ; les notions à apprendre ; ce que la trame prévoyait), **3) « avant de clore »** (verser les diapos modifiées, garder les notes, le mot aux absents), puis **Clore**. **Entre chaque section, une flèche de dévoilement** : tu ouvres la suivante quand la précédente est faite ; les faites se replient sur une ligne-résumé.
- Chaque section, une fois faite, se voit au tableau si elle y a sa place (l'échéance, le travail).

## G. La participation
- **Un bouton à part entière** dans la barre d'outils (plus dans ⋯), qui **affiche / retire** la boîte « qui a participé » au tableau, et **un raccourci : Maj + P** — vérifié : Maj+P n'est pris ni par Windows (Win+P est la projection, c'est une autre touche) ni par Chrome (Ctrl+P est l'impression) ; dans un champ de saisie, Maj+P écrit un P, comme les autres raccourcis.

## H. Ce qui est renvoyé au branchement dans le site (mandat), sur ton mot
- **Modifier les diapos pendant l'heure et verser (ou non) les modifications dans la trame du chapitre** — l'ancien l'avait (le pilote éditable, la question « verser ? » à la clôture) ; le cadrage 1 · 8 le prévoit (l'immuabilité pour la classe qui l'a vu, le versement diapo par diapo à la clôture) ; la maquette montre déjà « verser » à la clôture sans écrire. Tu dis : à voir au branchement. D'accord : la maquette garde le geste tel quel (éditer une diapo au double-clic, la question à la clôture), le mécanisme réel est du mandat.

## I. Fait ce tour, en attendant ta validation
- Rien. Le surlignage à la souris, l'agenda en Garamond et l'écran intégré (v9c.13) sont livrés ; la v9c.14 portera B à G tels que tu les valideras.

## Ce qui reste à trancher (trois questions)
1. **C** : une activité qui traverse deux temps du récit — racontée dans le temps où elle commence et reprise dans le suivant, ou coupée entre les deux ?
2. **B** : l'ordre des éléments de la diapo de fin (échéance → travail → récit → participation), et le T-5 qui **propose** d'y aller (un clic) ou qui **y va** tout seul ?
3. **D** : la liste compacte des durées dans la colonne de droite — d'accord pour la voir sur capture avant de trancher ?
