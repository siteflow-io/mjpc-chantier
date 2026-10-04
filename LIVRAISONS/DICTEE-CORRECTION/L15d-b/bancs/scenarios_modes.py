"""Scénarios précis de passage entre mode texte (classique) et mode rapide, et de sortie sans « Enregistrer »."""
import sys, copy, os; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_0aeb.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Kilo','ZZTEST Lima','ZZTEST Mike']
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d: dlg.append(d.message[:90]))
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
ouvrir=lambda n:(p.evaluate("(n)=>{const x=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim()===n);(x[0].closest('button,[role=button],div[style*=cursor]')||x[0]).click()}",n),p.wait_for_timeout(900))
barre=lambda: p.evaluate("()=>{const t=document.body.innerText;const i=t.indexOf('🔀');return i>0?t.slice(0,i).replace(/\\n/g,' '):t.slice(0,60).replace(/\\n/g,' ')}")
def marque(i,t):
    p.evaluate("(i)=>document.querySelectorAll('.word-grid button.word-btn')[i].click()",i); p.wait_for_timeout(200); p.evaluate("(t)=>document.querySelector('.popup-btn-'+t).click()",t); p.wait_for_timeout(200)
    if t in 'gl': p.keyboard.press('Enter'); p.wait_for_timeout(200)
hub=lambda k: [(e['idx'],e['type']) for e in ((b.lire(p,'correction_dictee/%s/results/%s'%(D3,k)) or {}).get('errors') or []) if e]
clic=lambda t: p.evaluate("(t)=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes(t));if(!b)return false;b.click();return true}",t)
# S1 : mode texte, 2 erreurs, retour à la grille SANS « Enregistrer »
ouvrir('Z. Kilo'); marque(3,'g'); marque(7,'l'); print('S1 avant retour :',barre())
clic('←'); p.wait_for_timeout(600); print('    fenêtre à la sortie :',dlg[-1:] if dlg else 'aucune'); ouvrir('Z. Kilo'); print('    rouverte :',barre(),'| hub :',hub('zztest_kilo'))
clic('←'); p.wait_for_timeout(500)
# S2 : mode rapide, 2 erreurs, « ⏸ Pause » vers le mode texte, 1 erreur de plus, « Enregistrer »
ouvrir('Z. Lima'); p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
p.keyboard.press('g'); p.wait_for_timeout(250); p.keyboard.press('Enter'); p.wait_for_timeout(250); p.keyboard.press(' '); p.keyboard.press('l'); p.wait_for_timeout(250); p.keyboard.press('Enter'); p.wait_for_timeout(300)
print('S2 rapide, hub :',hub('zztest_lima'))
clic('⏸ Pause'); p.wait_for_timeout(900); print('    après « Pause » :',barre())
if p.evaluate("()=>!!document.querySelector('.word-grid')"): marque(9,'m'); print('    + 1 en mode texte :',barre()); clic('Enregistrer'); p.wait_for_timeout(900); print('    hub après Enregistrer :',hub('zztest_lima'))
# S3 : mode texte avec erreurs non enregistrées, puis ⇧R (le cas signalé)
clic('←'); p.wait_for_timeout(500); ouvrir('Z. Mike'); marque(3,'g'); marque(7,'l'); print('S3 mode texte :',barre())
p.keyboard.press('Shift+R'); p.wait_for_timeout(900); print('    après ⇧R :',p.evaluate("()=>{const m=document.body.innerText.match(/ZZTEST Mike\\s*\\n?\\s*([0-9]+ err\\.[^\\n]*)/);return m?m[1]:document.body.innerText.slice(0,120).replace(/\\n/g,' ')}"),'| hub :',hub('zztest_mike'))
print('fenêtres :',dlg,'| erreurs de page :',b.erreurs[:2]); b.fermer()
