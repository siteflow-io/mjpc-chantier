# micro L15c-c : chaque niveau est un dépliant, replié par défaut ; le titre dit le compte ; un clic déplie, un second replie
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15cc.html')
db=copy.deepcopy(L.BASE)
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1500)
R={}
R['replies_par_defaut']=p.evaluate("()=>[...document.querySelectorAll('.niveau-l15c')].map(n=>[n.dataset.niveau,n.dataset.ouvert,n.querySelectorAll('.ligne-dictee-l15c').length,n.querySelector('h3').textContent.trim()])")
p.screenshot(path='/home/claude/MICRO7/capture-replie.png')
p.locator('.niveau-l15c[data-niveau="4e"] h3').click(); p.wait_for_timeout(300)
R['apres_clic_4e']=p.evaluate("()=>[...document.querySelectorAll('.niveau-l15c')].map(n=>[n.dataset.niveau,n.dataset.ouvert,n.querySelectorAll('.ligne-dictee-l15c').length])")
p.screenshot(path='/home/claude/MICRO7/capture-4e-deplie.png')
p.locator('.niveau-l15c[data-niveau="4e"] h3').click(); p.wait_for_timeout(300)
R['second_clic_replie']=p.evaluate("()=>document.querySelector('.niveau-l15c[data-niveau=\"4e\"]').dataset.ouvert")
print(json.dumps(R,ensure_ascii=False))
d0=dict((x[0],x) for x in R['replies_par_defaut']); d1=dict((x[0],x) for x in R['apres_clic_4e'])
ok=all(x[1]=='0' and x[2]==0 for x in R['replies_par_defaut']) and 'dictée' in d0['4e'][3] and d1['4e'][1]=='1' and d1['4e'][2]>=2 and d1['3e'][2]==0 and R['second_clic_replie']=='0' and 'vide pour l' in d0['6e'][3]
print('BANC L15c-c : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b.erreurs[:1]); b.fermer()
