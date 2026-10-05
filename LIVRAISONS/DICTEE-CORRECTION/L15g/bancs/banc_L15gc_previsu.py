# micro L15g-c : dans « Prévisualiser toutes », les modes Brut/Barré/Placeholder suivent l'élève feuilleté (pas l'élève sélectionné dans l'onglet)
import sys, copy, os, json, re, unicodedata; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15gc.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
def san(n): s=unicodedata.normalize('NFD',n).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+','_',s).strip('_')
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; res=d['results']; eleves=db['classes'][d['config']['classe']]['eleves']
cles=[san(n) for n in eleves if san(n) in res and isinstance(res[san(n)],dict) and res[san(n)].get('errors')]
A,B=cles[0],cles[1]; nomA=[n for n in eleves if san(n)==A][0]; nomB=[n for n in eleves if san(n)==B][0]
for e in res[A]['errors']:
    if e and e.get('type') in ('G','L'): e['fautif']=e.get('word','')+'x'
for e in res[B]['errors']:
    if e and 'fautif' in e: e.pop('fautif')
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%D3,db=db); p.wait_for_timeout(3000)
p.locator('button:has-text("Copies")').first.click(); p.wait_for_timeout(800)
initA=nomA.split()[1][0]+'. '+nomA.split()[1] if False else None
p.locator('.copies-left').first.locator('text='+nomA.split()[0][0]+'. '+nomA.split()[1]).first.click(); p.wait_for_timeout(800)
p.locator('button:has-text("Prévisualiser toutes")').first.click(); p.wait_for_timeout(1000)
def modes(): return p.evaluate("()=>[...document.querySelectorAll('label')].filter(l=>/^(Brut|Barré|Placeholder)$/.test(l.textContent.trim())).map(l=>[l.textContent.trim(),getComputedStyle(l).opacity])")
ap=lambda: ([l for l in p.locator('body').inner_text().split('\n') if l.startswith('Aperçu :')] or ['?'])[0]
for i in range(60):
    if nomB.split()[0] in ap(): break
    p.keyboard.press('ArrowRight'); p.wait_for_timeout(300)
mB=modes(); print("élève feuilleté :", ap(), "(non recopié) | sélectionné dans l'onglet :", nomA, "(recopié) | modes (opacité) :", mB)
p.screenshot(path='/home/claude/MICRO10/capture-'+('apres' if 'gc' in F else 'avant')+'.png')
ok=len(mB)>=3 and all(float(o)<1 for _,o in mB[-3:]); print('BANC L15g-c : '+('VERT' if ok else 'ROUGE')+' | erreurs :', b.erreurs[:1]); b.fermer()
