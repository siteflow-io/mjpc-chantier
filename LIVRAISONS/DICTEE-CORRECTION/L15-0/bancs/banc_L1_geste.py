"""L1 — jamais de perte : le mode texte s'enregistre à CHAQUE geste ; la position est gardée et reprise (retour, rechargement).
Par le geste (clics réels de Playwright sur les mots et les boutons du menu, Entrée), faux hub du kit (sessionStorage), ZZTEST."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Kilo','ZZTEST Oscar']
# un élève fictif aménagé d'après sa « fiche » et la version aménagée de la dictée : la trace doit suivre l'enregistrement à chaque geste
db['classes'][cl].setdefault('amenagements',{})['zztest_oscar']={'sexe':'m','dicteeAmenagee':True}
db['correction_dictee'][D3].setdefault('dictee',{})['amenagee']={'enabled':True,'defaultMode':'A','base':10,'lacunes':[{'idx':1,'mode':'A'}],'consigne':''}
R={}
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d:(dlg.append(d.message[:90]),d.dismiss()))
def ouvrir_dictee():
    p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
def ouvrir(n): p.locator('.eleve-card',has_text=n).first.click(); p.wait_for_timeout(900)
def barre(): return p.evaluate("()=>{const t=document.body.innerText;const i=t.indexOf('🔀');return i>0?t.slice(0,i).replace(/\\n/g,' '):t.slice(0,60)}")
def marque(i,t,mot=None):
    p.locator('.word-grid button.word-btn[data-word-idx="%d"]'%i).click(); p.wait_for_timeout(200); p.locator('.popup-btn-'+t).first.click(); p.wait_for_timeout(200)
    if t in 'gl': p.keyboard.type(mot or 'zzx'); p.keyboard.press('Enter'); p.wait_for_timeout(250)
def hub(k): r=b.lire(p,'correction_dictee/%s/results/%s'%(D3,k)) or {}; return {'err':[(e['idx'],e['type']) for e in (r.get('errors') or []) if e],'texteIdx':r.get('texteIdx'),'note':r.get('note'),'amenagee':r.get('amenagee'),'base':r.get('base')}
def curseur(): return p.evaluate("()=>{const e=document.querySelector('.word-btn.last-touched');if(!e)return null;const r=e.getBoundingClientRect();return {idx:+e.dataset.wordIdx,visible:r.top>=0&&r.bottom<=innerHeight}}")
ouvrir_dictee(); ouvrir('Z. Kilo')
marque(3,'g','fautt'); R['apres_1_geste']=hub('zztest_kilo')
marque(7,'l','lexik'); R['apres_2_gestes']=hub('zztest_kilo'); R['barre_avant']=barre()
p.locator('button:has-text("←")').first.click(); p.wait_for_timeout(700)
ouvrir('Z. Kilo'); R['rouverte']=barre(); R['rouverte_curseur']=curseur(); R['rouverte_hub']=hub('zztest_kilo')
if CAP: p.screenshot(path=CAP+'/L1-rouverte.png')
p.reload(); p.wait_for_timeout(1500); ouvrir_dictee(); ouvrir('Z. Kilo'); R['rechargee']=barre(); R['rechargee_curseur']=curseur()
p.locator('button:has-text("←")').first.click(); p.wait_for_timeout(700)
ouvrir('Z. Oscar'); marque(5,'m'); R['oscar']=hub('zztest_oscar')
R['fenetres']=dlg; R['erreurs']=b.erreurs[:3]
print(json.dumps(R,ensure_ascii=False))
ok=(len(R['apres_1_geste']['err'])==1 and R['apres_2_gestes']['err']==[(3,'G'),(7,'L')] and R['apres_2_gestes']['texteIdx']==7
    and '1G1L' in R['rouverte'] and (R['rouverte_curseur'] or {}).get('idx')==7 and (R['rouverte_curseur'] or {}).get('visible')
    and '1G1L' in R['rechargee'] and (R['rechargee_curseur'] or {}).get('idx')==7
    and R['oscar']['amenagee'] is True and R['oscar']['base']==10 and R['fenetres']==[] and R['erreurs']==[])
print('BANC L1 PAR LE GESTE :','VERT' if ok else 'ROUGE'); b.fermer(); sys.exit(0 if ok else 1)
