"""L15-0 — la forme acceptée vaut pour une PLACE du texte (règle par place ; Préparation, Réglages, la liste ; la conversion des règles d'avant ;
le même mot à une autre place coûte toujours) ; la majuscule (la garde refuse le mot identique, casse comprise). Par le geste, faux hub du kit, ZZTEST."""
import sys, copy, os, json, re, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
def empreinte(t):   # la même empreinte que l'app (empreinteTexte)
    x=re.sub(r'\s+',' ',str(t).lower()).strip(); hh=5381
    for ch in x: hh=((hh<<5)+hh+ord(ch))&0xffffffff
    s='';n=hh
    while True:
        s='0123456789abcdefghijklmnopqrstuvwxyz'[n%36]+s; n//=36
        if n==0: break
    return 't'+s+'_'+str(len(x))
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; cl=d['config']['classe']; tk=empreinte(d['config']['text'])
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Alpha','ZZTEST Golf']
# une règle d'AVANT (rangée par mot) : « luy » pour « lui » ; « lui » est aux places 10 et 23 ; des copies la portent à la place 10 seulement
db.setdefault('correction_dictee_textes',{})[tk]={'formesAcceptees':{'lui':{'luy':{'mot':'lui','forme':'luy','origine':'preparation','dicteeId':D3,'creeLe':1}}}}
d['results']['zztest_alpha']={'errors':[{'idx':10,'type':'G','word':'lui','fautif':'luy','sansCout':True}],'extras':[],'note':10,'deduction':0,'counts':{'sansCout':1},'timestamp':1700000000000,'amenagee':False}
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(4000)
R['ligne']=p.evaluate("()=>{const e=document.getElementById('ligne-acceptees');return e?e.innerText:null}")
fa=(b.lire(p,'correction_dictee_textes/%s/formesAcceptees'%tk) or {}); fa=dict(enumerate(fa)) if isinstance(fa,list) else fa
R['regles']=sorted((str(k),sorted((v or {}).keys())) for k,v in fa.items() if v)
R['alpha_garde']=[(e['idx'],bool(e.get('sansCout'))) for e in (b.lire(p,'correction_dictee/%s/results/zztest_alpha'%D3) or {}).get('errors',[])]
# la correction : « luy » posé à la place 23 coûte ; la liste dit « acceptée » à la place 10, « acceptée ailleurs » à la place 23
p.locator('.eleve-card',has_text='Z. Golf').first.click(); p.wait_for_timeout(900)
def case(i):
    p.locator('.word-grid button.word-btn[data-word-idx="%d"]'%i).click(); p.wait_for_timeout(300); p.locator('.popup-btn-g').first.click(); p.wait_for_timeout(500)
def liste(): return [' '.join(t.split()) for t in p.locator('.liste-formes .forme').all_inner_texts()]
case(23); R['liste_23']=liste()
if CAP: p.screenshot(path=CAP+'/L150-liste-23.png')
p.keyboard.type('luy'); p.keyboard.press('Enter'); p.wait_for_timeout(800)
g=(b.lire(p,'correction_dictee/%s/results/zztest_golf'%D3) or {}); R['golf_23']=[(e['idx'],e.get('fautif'),bool(e.get('sansCout'))) for e in g.get('errors',[])]; R['golf_note']=g.get('note')
case(10); R['liste_10']=liste(); p.keyboard.type('luy'); p.keyboard.press('Enter'); p.wait_for_timeout(800)
g=(b.lire(p,'correction_dictee/%s/results/zztest_golf'%D3) or {}); R['golf_10']=[(e['idx'],e.get('fautif'),bool(e.get('sansCout'))) for e in g.get('errors',[]) if e['idx']==10]
# la majuscule : « Centre » pour « centre » accepté ; « centre » refusé
case(4); p.keyboard.type('centre'); p.keyboard.press('Enter'); p.wait_for_timeout(500); R['maj_refus']=(p.evaluate("()=>!!document.getElementById('garde-mot-texte')"),[e for e in (b.lire(p,'correction_dictee/%s/results/zztest_golf'%D3) or {}).get('errors',[]) if e['idx']==4])
p.keyboard.press('Control+a'); p.keyboard.type('Centre'); p.keyboard.press('Enter'); p.wait_for_timeout(700)
R['maj_acceptee']=[(e['idx'],e.get('fautif')) for e in (b.lire(p,'correction_dictee/%s/results/zztest_golf'%D3) or {}).get('errors',[]) if e['idx']==4]
p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)
# Préparation : seule la place 10 soulignée ; Réglages : la place dite en clair
p.get_by_role('button',name='Préparation',exact=True).first.click(); p.wait_for_timeout(1200); p.locator('#btn-formes-acceptees').click(); p.wait_for_timeout(1500)
R['prep']=p.evaluate("()=>[10,23].map(i=>{const e=document.querySelector('#formes-acceptees-prep .fa-mot[data-idx=\"'+i+'\"]');return e?e.className.includes('tol'):null})")
if CAP: p.screenshot(path=CAP+'/L150-preparation.png')
p.get_by_role('button',name='Réglages',exact=True).first.click(); p.wait_for_timeout(1500)
R['reglages']=p.evaluate("()=>{const e=document.getElementById('carte-formes-acceptees');return e?e.innerText:null}")
if CAP: p.screenshot(path=CAP+'/L150-reglages.png')
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'conversion':bool(R['ligne']) and '1 règle mise à sa place' in R['ligne'] and R['regles']==[['10',['luy']]] and R['alpha_garde']==[[10,True]],
 'autre_place_coute':R['golf_23']==[[23,'luy',False]],
 'liste_23_ailleurs':any(x.startswith('1 luy') and 'acceptée ailleurs' in x and 'accepter ici' in x for x in R['liste_23']),
 'liste_10_acceptee':any('luy' in x and 'acceptée' in x and 'ailleurs' not in x for x in R['liste_10']) and R['golf_10']==[[10,'luy',True]],
 'majuscule':R['maj_refus'][0] is True and R['maj_refus'][1]==[] and R['maj_acceptee']==[[4,'Centre']],
 'preparation':R['prep']==[True,False],
 'reglages':bool(R['reglages']) and 'sur « lui » (2e mot de la phrase 2 / place 10) : luy' in R['reglages'],
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15-0 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
