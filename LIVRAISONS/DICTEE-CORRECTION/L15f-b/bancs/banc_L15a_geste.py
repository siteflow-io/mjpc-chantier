"""L15a — le paramétrage de la version aménagée, par le geste : cocher reste sur Préparation ; le mode par défaut écrit au hub et suivi d'effets ;
la fenêtre d'un mot (D1) : les vraies formes d'abord, jamais vide, jamais le mot, jamais un doublement au hasard ; « Proposer d'autres formes » ;
le mode d'un mot ; « Retirer ce mot » ; Entrée / Échap. Faux hub du kit, ZZTEST."""
import sys, copy, os, json, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]
d.setdefault('dictee',{})['amenagee']={'enabled':False,'defaultMode':'A','base':10,'lacunes':[{'tokenIdx':3,'word':'le','mode':None,'type':'L','propositions':['le','la','les']},{'tokenIdx':7,'word':'préoccupations','mode':None,'type':'L','propositions':['préoccupations','préocupations','préoccupation']}]}
db['correction_dictee_erreurs']={'fe_a':{'id':'fe_a','mot':'syllabes','forme':'silabes','type':'L','dicteeId':D3,'creeLe':1},'fe_b':{'id':'fe_b','mot':'syllabes','forme':'silabes','type':'L','dicteeId':D3,'creeLe':1},'fe_c':{'id':'fe_c','mot':'syllabes','forme':'syllabe','type':'G','dicteeId':D3,'creeLe':1}}
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(3000)
p.get_by_role('button',name='Préparation',exact=True).first.click(); p.wait_for_timeout(1200)
p.evaluate("()=>{const l=[...document.querySelectorAll('label')].find(x=>x.textContent.includes('version am'));const c=l&&l.querySelector('input[type=checkbox]');if(c)c.click()}"); p.wait_for_timeout(2000)
amen=lambda: b.lire(p,'correction_dictee/%s/dictee/amenagee'%D3) or {}
R['reste_preparation']=(p.evaluate("()=>[...document.querySelectorAll('button.tab')].some(b=>b.textContent.trim()==='Préparation'&&b.className.includes('active'))||!!document.querySelector('.amenagee-card')"),amen().get('enabled'))
def mode_defaut(m):
    p.evaluate("(m)=>{const s=[...document.querySelectorAll('select')].find(x=>[...x.options].some(o=>o.value==='C')&&[...x.options].some(o=>o.textContent.startsWith('A \\u2014')));if(s){const set=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;set.call(s,m);s.dispatchEvent(new Event('change',{bubbles:true}))}}",m); p.wait_for_timeout(1200)
mode_defaut('B'); R['mode_B']=(amen().get('defaultMode'),p.evaluate("()=>{const e=document.getElementById('msg-amenagee');return e?e.innerText:null}"))
mode_defaut('C'); a=amen(); R['mode_C']=(a.get('defaultMode'),[(l.get('tokenIdx'),bool(l.get('indice')),bool(l.get('raisonnement'))) for l in a.get('lacunes',[]) if l])
if CAP: p.screenshot(path=CAP+'/L15a-preparation.png')
# la fenêtre d'un mot : « syllabes » (place 32), mis en mode A
def mot(i): p.evaluate("(i)=>{const e=[...document.querySelectorAll('.amenagee-card ~ .card span[data-idx], span[data-idx]')].find(x=>x.getAttribute('data-idx')==String(i)&&!x.closest('#formes-acceptees-prep'));if(e)e.click()}",i); p.wait_for_timeout(700)
mot(32); R['fenetre']=p.locator('#fenetre-mot').count()==1
p.evaluate("()=>{const s=document.getElementById('mode-mot');const set=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set;set.call(s,'A');s.dispatchEvent(new Event('change',{bubbles:true}))}"); p.wait_for_timeout(400)
props=lambda: p.evaluate("()=>[...document.querySelectorAll('#fenetre-mot .prop-l15a input:not([type=radio])')].map(x=>x.value)")
R['props']=props()
if CAP: p.screenshot(path=CAP+'/L15a-fenetre.png')
p.locator('#autres-formes').click(); p.wait_for_timeout(400); R['autres']=props()
p.keyboard.press('Enter'); p.wait_for_timeout(1200)
l32=[l for l in amen().get('lacunes',[]) if l and l.get('tokenIdx')==32]; R['enregistre']=(l32[0].get('mode'),l32[0].get('propositions')) if l32 else None
# Échap : un mot nouveau n'est pas ajouté
mot(30); p.keyboard.press('Escape'); p.wait_for_timeout(600); R['echap']=(p.locator('#fenetre-mot').count()==0,any(l and l.get('tokenIdx')==30 for l in amen().get('lacunes',[])))
# retirer : le mot rendu au texte
mot(32); p.locator('#retirer-mot').click(); p.wait_for_timeout(1200); R['retire']=not any(l and l.get('tokenIdx')==32 for l in amen().get('lacunes',[]))
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
DOUBLE=re.compile(r'([bcdfglmnprstz])\1')
def propre(ps,w): return all(x and x.strip() for x in ps) and ps[0]==w and all(x!=w for x in ps[1:]) and not any(DOUBLE.search(x) and not DOUBLE.search(w) for x in ps[1:]) and len(set(ps))==len(ps)
conds={'reste_sur_preparation':R['reste_preparation']==[True,True],
 'mode_ecrit_et_suivi':R['mode_B'][0]=='B' and bool(R['mode_B'][1]) and R['mode_C'][0]=='C' and all(x[1] and x[2] for x in R['mode_C'][1]),
 'fenetre':R['fenetre'],
 'vraies_formes_d_abord':R['props']==['syllabes','silabes','syllabe'] and propre(R['props'],'syllabes'),
 'autres_formes':propre(R['autres'],'syllabes') and R['autres']!=R['props'],
 'enregistrer_entree':R['enregistre'] is not None and R['enregistre'][0]=='A' and R['enregistre'][1][0]=='syllabes' and len(R['enregistre'][1])==3,
 'echap':R['echap']==[True,False],'retirer':R['retire'] is True,'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15a PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
