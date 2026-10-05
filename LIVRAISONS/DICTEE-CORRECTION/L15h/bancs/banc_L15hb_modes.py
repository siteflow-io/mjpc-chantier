# micro L15h-b : la fenêtre d'un mot (Préparation) porte les libellés complets des modes ; le message du mode par défaut est dans les mots de Paul
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15hb.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; d.setdefault('dictee',{})['amenagee']={'enabled':True,'defaultMode':'A','base':10,'lacunes':[{'tokenIdx':3,'word':'le','mode':None,'type':'L','propositions':['le','la','les']},{'tokenIdx':7,'word':'x','mode':'B','type':'L','propositions':['x','y','z']}]}
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(3000)
p.get_by_role('button',name='Préparation',exact=True).first.click(); p.wait_for_timeout(1500)
def mot(i): p.evaluate("(i)=>{const e=[...document.querySelectorAll('span[data-idx]')].find(x=>x.getAttribute('data-idx')==String(i)&&!x.closest('#formes-acceptees-prep'));if(e)e.click()}",i); p.wait_for_timeout(700)
mot(3); opts=p.evaluate("()=>[...document.querySelectorAll('#mode-mot option')].map(o=>o.textContent)"); print("options de la fenêtre :", opts)
p.keyboard.press('Escape'); p.wait_for_timeout(400)
p.evaluate("()=>{const s=[...document.querySelectorAll('select')].find(x=>[...x.options].some(o=>o.value==='C')&&[...x.options].some(o=>o.textContent.startsWith('A \\u2014')));const set=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;set.call(s,'B');s.dispatchEvent(new Event('change',{bubbles:true}))}"); p.wait_for_timeout(1500)
msg=p.evaluate("()=>{const e=document.getElementById('msg-amenagee');return e?e.innerText:null}"); print("message :", msg)
p.screenshot(path='/home/claude/MICRO11/capture.png')
ok=len(opts)==4 and all(('propositions' in o or 'rou' in o) for o in opts) and msg and ('le suit' in msg or 'le suivent' in msg) and 'garde' in msg
print('BANC L15h-b : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b.erreurs[:1]); b.fermer()
