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

## COMPLÉMENT DE PAUL (23/08) — LE FLUX COMPLET, avec LE QR CODE (exhumé : perdu par compression)
Trois supports : le TÉLÉPHONE · le PORTABLE (connectable Win+K au vidéoproj) · l ORDI DE BUREAU (filaire vidéoproj).
Le flux cible, dans ses mots : « lancer une séance sur l ordi du bureau ou sur mon ordi perso, mettre la
vue tableau en Win+P sur le tableau physique, scanner le QR code avec mon téléphone, piloter (avec quel
pilotage précisément, c est à discuter), partir au fond de la classe avec mon ordi portable connecté sur
le site (même pilotage de la session en cours et doublon de l ordi du bureau, donc pilotant finalement
la vue tableau au tableau). »
CONSÉQUENCE D ARCHITECTURE : ce n est plus « un pilote + une vue » mais N PILOTES SYNCHRONES + la vue :
l état de scène au hub est LA session (source unique) ; tout appareil la rejoint comme VUE (lecture seule)
ou comme PILOTE (lecture + gestes) ; deux pilotes montrent le même état et chaque geste se reflète partout.
Adressage par appareil : ordi de classe = favori fixe (la vue trouve le cours actif) · téléphone = QR CODE
scanné (zéro frappe) · portable = bouton « reprendre le pilotage du cours en cours ».
À DISCUTER AVANT PHASE 1 (question ouverte de Paul) : le pilotage TÉLÉPHONE — palette réduite (avancer/
reculer, dévoiler, gel, participation) ou pilotage complet ? Et où le QR s affiche (écran de pilotage au
lancement ?).