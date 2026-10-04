"""Vue élève inchangée : l'écran de l'élève (« Mode élève ») de la version livrée = celui de la base (texte à l'écran, version masquée), 0 erreur."""
import sys, os, re, copy; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
t=[]
for f in (os.environ['BASE'],os.environ['FICHIER']):
    b=Banc(f,1400,900); p=b.ouvrir('',db=copy.deepcopy(L.BASE)); p.wait_for_timeout(1000)
    p.locator('text=Mode élève').first.click(); p.wait_for_timeout(1200)
    t.append((re.sub(r'\d+\.\d+\.\d+(-L\d)?','v',p.locator('body').inner_text()),b.erreurs[:2])); b.fermer()
ok=t[0][0]==t[1][0] and t[0][1]==[] and t[1][1]==[]
print('écran élève identique :',t[0][0]==t[1][0],'| erreurs :',t[0][1],t[1][1]); print('VUE ÉLÈVE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
