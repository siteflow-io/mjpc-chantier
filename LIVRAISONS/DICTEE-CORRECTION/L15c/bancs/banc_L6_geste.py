"""L6 — en fin de copie en mode rapide : la recherche par initiales, le curseur dedans ; les lettres ne marquent rien ;
Entrée ouvre le premier proposé directement en mode rapide ; absents et copies corrigées signalés. Par le geste, faux hub du kit, ZZTEST."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Romeo','ZZTEST Sierra','ZZTEST Tango','ZZTEST Uniform']
db['correction_dictee'][D3].setdefault('absents',{})['zztest_tango']=True
db['correction_dictee'][D3]['results']['zztest_uniform']={'errors':[{'idx':0,'type':'G','word':'Marguerite','fautif':'zz'}],'extras':[],'note':9,'deduction':1,'counts':{'G':1},'timestamp':1,'amenagee':False}
R={}
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d:(dlg.append(d.message[:90]),d.dismiss()))
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
def hub(k): r=b.lire(p,'correction_dictee/%s/results/%s'%(D3,k)) or {}; return [(e['idx'],e['type']) for e in (r.get('errors') or []) if e]
def eleve_ecran(): t=p.evaluate("()=>document.body.innerText"); return [n for n in ('ZZTEST Romeo','ZZTEST Sierra','ZZTEST Tango','ZZTEST Uniform') if n in t.split('Copie suivante')[0]]
p.locator('.eleve-card',has_text='Z. Romeo').first.click(); p.wait_for_timeout(900)
p.keyboard.press('Shift+R'); p.wait_for_timeout(900); p.keyboard.press('m'); p.wait_for_timeout(300)
p.locator('button:has-text("Terminer →")').first.click(); p.wait_for_timeout(700)
R['fin']=p.evaluate("()=>{const a=document.activeElement;return {champ:!!document.getElementById('recherche-fin-champ'),focus:a&&a.id==='recherche-fin-champ'}}")
avant=hub('zztest_romeo')
p.keyboard.type('zt'); p.wait_for_timeout(400); R['zt']=p.locator('.recherche-fin-prop').all_inner_texts()
p.keyboard.press('Control+a'); p.keyboard.type('unif'); p.wait_for_timeout(400); R['zu']=p.locator('.recherche-fin-prop').all_inner_texts()
p.keyboard.press('Control+a'); p.keyboard.type('gl'); p.wait_for_timeout(400)
R['lettres_sans_effet']=(hub('zztest_romeo')==avant, p.evaluate("()=>!!document.getElementById('recherche-fin-champ')"))
p.keyboard.press('Control+a'); p.keyboard.type('zs'); p.wait_for_timeout(400); R['zs']=p.locator('.recherche-fin-prop').all_inner_texts()
if CAP: p.screenshot(path=CAP+'/L6-recherche.png')
p.keyboard.press('Enter'); p.wait_for_timeout(1200)
R['apres_entree']=(p.evaluate("()=>document.querySelector('.fast-word')?'rapide':(document.querySelector('.word-grid')?'texte':(document.querySelector('.eleve-card')?'grille':'autre'))"),eleve_ecran())
if CAP: p.screenshot(path=CAP+'/L6-ouvert.png')
p.keyboard.press('g'); p.wait_for_timeout(300); p.keyboard.type('zzx'); p.keyboard.press('Enter'); p.wait_for_timeout(500); R['sierra']=hub('zztest_sierra')
R['romeo_intact']=hub('zztest_romeo')==avant; R['fenetres']=dlg; R['erreurs']=b.erreurs[:3]
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
ok=(R['fin']=={'champ':True,'focus':True} and any('ZZTEST Tango' in x and 'absent' in x for x in R['zt']) and any('ZZTEST Uniform' in x and 'corrigée' in x for x in R['zu'])
    and R['lettres_sans_effet']==[True,True] and R['zs'] and R['zs'][0].startswith('ZZTEST Sierra')
    and R['apres_entree']==['rapide',['ZZTEST Sierra']] and R['sierra']==[[0,'G']] and R['romeo_intact'] and R['fenetres']==[] and R['erreurs']==[])
print('BANC L6 PAR LE GESTE :','VERT' if ok else 'ROUGE'); b.fermer(); sys.exit(0 if ok else 1)
