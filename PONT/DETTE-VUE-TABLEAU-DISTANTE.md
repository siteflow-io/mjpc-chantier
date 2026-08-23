# DETTE — LA VUE TABLEAU DU DEROULE PILOTEE ENTRE DEUX APPAREILS (Paul, 22/08, verse le 23/08)
Ses mots exacts : « en classe je serai connecte sur mon ordinateur portable, et le videoprojecteur
en windows k. mais il faut que je puisse aussi avoir le flow : ordi portable avec l ecran de
pilotage, ordi DE CLASSE avec videoproj (windows P), et donc en etant connecte sur mon ecran de
pilotage sur mon ordi, en fait avoir aussi le pilotage sur l ordi classe ET la vue tableau sur
cet ordi de classe. »
LES DEUX SCENARIOS : (1) portable seul + projection sans fil Windows+K : la fenetre tableau
LOCALE suffit (window.open du meme appareil). (2) portable (pilotage) + ORDI DE CLASSE branche
au videoproj : la vue tableau vit sur UNE AUTRE MACHINE et doit SUIVRE le pilotage a distance —
la synchro locale ne suffit plus, il faut une vue tableau qui LIT L ETAT JOUE AU HUB
(deroule_joue existe deja comme noeud ecrit par le pilotage : la brique de lecture distante est
a construire/verifier — URL dediee ? quel appareil ecrit, lequel lit, quelle latence, quel
verrou de classe ?).
A INSTRUIRE PUIS TESTER par le banc reel de Paul : portable + ordi de bureau cote a cote, URL
de production. NON MESURE en prod a ce jour — la conscience n8 n a pas verifie si la vue
tableau actuelle est locale ou lisible du hub. PREMIERE ACTION de la reprise : le determiner
sur pieces avant tout code.