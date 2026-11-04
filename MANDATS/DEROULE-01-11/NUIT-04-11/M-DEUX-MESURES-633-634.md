# MANDAT M — DEUX MESURES, SANS RIEN CORRIGER (C16 633, 634)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `mesure/nuit-m`, depuis `dbe59dc88` (le dernier commit de `nuit/e` : toute la nuit). **20 minutes au plus**, 10 par mesure. Aucune ligne du site ne change.*

## 0 · CE QUE PAUL A DIT, ET CE QUI EST VU
- C16 548 : « dans la copie de ta classe, la consigne de la diapo « Groupe 1 » contenait des mots de l'éditeur (« BLOC 1 · QUESTION · 1 ÉLÉMENT… »). Tu les as effacés en début d'heure. Je ne sais pas encore d'où ils viennent. » ; C16 633 : « d'où ils viennent ».
- Paul, 04/11 12:45 (634) : « le vidéoprojecteur de la salle est mal calibré et donc la vue tableau debordait de limage projetée au tableau. Vu que c'est une fenêtre, je me suis dit que j'allais pouvoir la redimensionner sur l'ordi qui avait la page du tableau distant. Peine perdue, je pense que c'est dû à l'histoire du plein écran en double clic. »

## 1 · CE QUE TU MESURES
1. (633) Par quel geste de l'éditeur ou du pilotage les mots de l'éditeur (l'étiquette d'un bloc : « BLOC 1 · QUESTION · 1 ÉLÉMENT… ») peuvent entrer dans le texte d'une consigne rangé dans la copie de la classe : le code qui dessine cette étiquette, et s'il existe un geste (copier-coller dans la diapo, glisser, écrire dans le bloc) qui la fait ranger avec le texte. Joue le geste trouvé, au faux hub ; compté.
2. (634) La fenêtre du tableau distant (`?vue=tableau`), ouverte comme Paul (« Ouvrir le tableau »), puis le double clic : ce que fait le double clic (plein écran du navigateur ou non), si la fenêtre peut ensuite être réduite ou redimensionnée par ses bords, et ce qui l'en empêche dans le code (le plein écran, une taille posée, un écouteur) ; et si la vue tableau suit la taille de la fenêtre. Compté.
Ce que tu crois utile en plus, tu le dis, tu ne le codes pas.

## 2 · LA SUPPOSITION (À VÉRIFIER)
- 633 : l'étiquette du bloc est dessinée dans l'éditeur comme un élément de la diapo (dr-editeur, ou le dessin des blocs) et peut être prise avec le texte quand on sélectionne et copie un bloc entier.
- 634 : le double clic du tableau appelle `requestFullscreen` (dr-tableau) ; en plein écran du navigateur, la fenêtre ne se redimensionne pas ; la vue tableau est dessinée pour la taille de l'écran.

## 3 · CE QUE TU LIVRES
`LIVRAISONS/DEROULE-01-11/MESURE-NUIT-M/` : la sonde et une NOTE courte : pour chaque mesure, ce qui se passe, compté, et la ligne de code qui le fait.
