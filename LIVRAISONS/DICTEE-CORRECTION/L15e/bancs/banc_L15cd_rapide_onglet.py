# micro L15c-d : l'onglet Rapide ouvert sans copie, puis Entrée ×5 → le même élève, mot 6, une seule copie enregistrée (avant : un élève par geste)
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15cd.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Alpha','ZZTEST Beta','ZZTEST Gamma']   # trois élèves non corrigés
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof&dictee=%s&onglet=rapide'%D3,db=db); p.wait_for_timeout(3500)
def nomCourant():
    import re; t=p.locator('body').inner_text(); m=re.search(r'\n([^\n]{3,60})\n\d+ err\.', t); return m.group(1).strip() if m else None
def motN(): 
    t=p.locator('body').inner_text(); import re; m=re.search(r'Mot (\d+)/', t); return int(m.group(1)) if m else None
res0=b.lire(p,'correction_dictee/%s/results'%D3) or {}; n0=nomCourant(); m0=motN()
for _ in range(5): p.keyboard.press('Enter'); p.wait_for_timeout(250)
p.wait_for_timeout(600); n1=nomCourant(); m1=motN()
res=b.lire(p,'correction_dictee/%s/results'%D3) or {}; nz=sorted(set(res)-set(res0))
p.screenshot(path='/home/claude/MICRO8/capture-'+('apres' if 'cd' in F else 'avant')+'.png')
R={'eleve_avant':n0,'mot_avant':m0,'eleve_apres':n1,'mot_apres':m1,'copies_nouvelles':nz}
print(json.dumps(R,ensure_ascii=False)); ok=n0 and n0==n1 and m0==1 and m1==6 and len(nz)==1
print('BANC L15c-d : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b.erreurs[:1]); b.fermer()
