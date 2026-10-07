# patch-p8-3d.py — (p8-3d) la carte de démonstration qui tient (complément MANDATS/COMPLEMENT-DEROULE-P8-3d.md, C13 tour 28)
# usage : python3 patch-p8-3d.py <gabarit p8-3c> <gabarit p8-3d en sortie>
# Un seul remplacement, exigé une fois : la source du schéma de la diapo plausible devient « Figures d'analogie » + « Figures d'amplification »,
# leurs notions telles quelles dans la vraie carte. Rien d'autre ne change sur la diapo (sa consigne, son titre, sa place, sa durée).
import sys
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
AV = "src: \"Figures d'analogie : personnification, comparaison, métaphore, allégorie\\nFigures d'opposition : antithèse, oxymore, antiphrase\\nFigures d'insistance : anaphore, répétition, pléonasme\" }] }); })();"
AP = "src: \"Figures d'analogie : personnification, comparaison, métaphore, allégorie\\nFigures d'amplification : hyperbole, accumulation, gradation\" /* (p8-3d) la plus grande des cartes qui tiennent sous la consigne d'une ligne (mesure de la conscience, C13 tour 28) */ }] }); })();"
n = s.count(AV)
if n != 1: sys.exit('ARRÊT : la source de la diapo plausible trouvée %d fois' % n)
s = s.replace(AV, AP)
open(out, 'w', encoding='utf-8').write(s)
print('simulation : la carte de la diapo plausible : %d → %d o' % (len(AV.encode()), len(AP.encode())))
