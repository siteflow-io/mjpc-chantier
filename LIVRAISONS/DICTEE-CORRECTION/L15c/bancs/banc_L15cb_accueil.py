# micro L15c-b : l'accueil à 1100 px, chaque dictée en deux lignes (titre + infos / actions) ; la hauteur d'une ligne de dictée ≤ 90 px
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15cb.html')
db=copy.deepcopy(L.BASE)
for i,d in db['correction_dictee'].items(): d['config']['title']='Dictée n°1 type brevet (avec révisions), extrait de la lettre de Fritz'   # un titre long partout
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1500)
r=p.evaluate("()=>{const c=document.querySelector('.container');const l=[...document.querySelectorAll('.ligne-dictee-l15c')];return {largeur:Math.round(c.getBoundingClientRect().width),hauteurs:l.map(x=>Math.round(x.getBoundingClientRect().height)),n:l.length,titreSurUneLigne:l.map(x=>{const t=x.querySelector('span');const r=t.getBoundingClientRect();return Math.round(r.height)})}}")
p.screenshot(path='/home/claude/MICRO6/capture-'+('apres' if 'cb' in F else 'avant')+'.png')
print(json.dumps(r)); ok=r['largeur']>=1000 and r['n']>=5 and max(r['hauteurs'])<=100
print('BANC L15c-b : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b.erreurs[:1]); b.fermer()
