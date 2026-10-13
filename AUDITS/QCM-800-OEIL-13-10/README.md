# L'œil d'une tablette, mesuré sur la 8.0.0 en ligne — 13/10/2026 14:35 (conscience n°12, tour 706)

Paul, 14:28 : « en lançant la question 1, puis en cliquant sur l'oeil depuis mon pilotage, j'ai vu que la question était lancée, alors que les élèves ne s'étaient pas connectés. ça veut dire que leur écran de connexion est shunté par le fait que je lance, ou alors c'est la vue oeil qui est mensongère? mesure. »

Mesuré par le geste sur le faux hub, avec l'app en ligne (md5 `9a5f581453edbf5f7778d4fffb2f8fdd`, téléchargée du site) : la séance de 3 ESSAI est lancée, une tablette est ouverte et personne n'y entre, puis « ▶️ Lancer Q1 » est cliqué.

| Ce qui est regardé | Ce qu'il montre |
| --- | --- |
| La vraie tablette | « Combien êtes-vous sur cette tablette ? » : l'entrée n'est pas sautée (`captures/2-tablette-apres-q1.png`) |
| La console, « 0/25 CONNECTÉS » | juste |
| La console, les cartes des tablettes | « ✍️ écrit » sous chacun des 25 élèves, alors qu'aucun n'est entré : **faux** (`captures/3-console-q1-haut.png`) |
| « 👁 » de la tablette 1 | les deux moitiés sur « QUESTION 1 / 3 », « TEMPS DE RÉFLEXION 16 », au nom d'ABRIAL Julien et de BAUDRY Léa : **faux** (`captures/4-console-oeil.png`) |

Pourquoi, dans le code (`code-qcm`, `src/c3-objets.js`, `voirTablette`) : la fenêtre prend les deux élèves que le plan de classe met sur cette tablette (`PAIRES`) et dessine leur écran à la phase de la séance (`TabletteVue` sans interaction, puis `MoitieH`). Elle ne regarde pas s'ils sont entrés.

`sortie.txt` : 4 vérifications, 1 échec (K32, l'œil).
