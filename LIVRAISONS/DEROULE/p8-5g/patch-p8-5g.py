# patch-p8-5g.py — (p8-5g) la fenêtre du tableau reçoit les pages dès son ouverture (dette n°13 · 17 ; complément p8-5g, validé par Paul le 12/10, tour 59)
# usage : python3 patch-p8-5g.py <gabarit p8-5f> <gabarit p8-5g en sortie>
# Chaque remplacement est exigé une fois exactement (sinon arrêt) ; les tailles avant / après de ce qui est touché sont écrites.
# Aucun nom nouveau.
import sys
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
journal = []
def un(avant, apres, quoi):
    global s
    n = s.count(avant)
    if n != 1: sys.exit('ARRÊT : « %s » trouvé %d fois' % (quoi, n))
    s = s.replace(avant, apres); journal.append('%s : %d o / %d ligne(s) → %d o / %d ligne(s)' % (quoi, len(avant.encode()), avant.count('\n') + 1, len(apres.encode()), apres.count('\n') + 1))

# 1. (point 1) à l'ouverture, la fenêtre dit « prête » et reçoit l'état à montrer. Elle recevait etatComplet() : un état neuf, que rendre n'a pas encore paginé —
#    ni pages (et.pages, et.pagesP), ni page courante calculée, ni police (et.policeRatio) : le tableau paginait seul sur ses lignes dévoilées.
#    Elle reçoit maintenant l'état que le pilote a poussé au mur à son dernier rendu (S.mur), qui porte tout cela — la page suivie ou choisie à la molette, et la police.
#    Pendant le gel aussi : le tableau gelé montre S.mur (le gel ne pousse rien ; « montrer la suite » pousse S.gel, qui devient S.mur), alors que S.gel = etatComplet()
#    n'a pas de pages (trouvé par un relecteur neuf : rouvert pendant le gel, « page 2 / 2 » au lieu de « page 2 / 3 »). S.gel ne sert plus que s'il n'y a rien au mur ;
#    sans état au mur (rien encore poussé, ou l'atelier), etatComplet() comme avant.
un("window.addEventListener('message', ev => { if (ev.data && ev.data.pret) pousser(S.gel || etatComplet()); });",
   "window.addEventListener('message', ev => { if (ev.data && ev.data.pret) pousser(S.mur || S.gel || etatComplet()); }); /* (p8-5g) à l'ouverture, l'état au mur — ce que la classe voit, gel compris — avec ses pages, sa page et sa police */",
   "l'écoute « prête » de la fenêtre du tableau")

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
