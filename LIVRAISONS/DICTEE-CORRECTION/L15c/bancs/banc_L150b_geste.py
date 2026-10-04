"""L15-0b — points 7 et 8, par le geste : un élève marqué aménagé APRÈS correction → sa copie prend la trace de la version aménagée et est
recalculée (corbeille, message) ; démarqué → l'inverse ; une copie déjà dans ce cas → recalculée à l'ouverture (compté) ; ⇧R part du mot où
l'on est, dans les deux sens. Faux hub du kit, ZZTEST."""
import sys, copy, os, json, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
def deplierNiveaux(p):
    p.evaluate("() => { document.querySelectorAll('.niveau-l15c[data-ouvert=\"0\"] h3').forEach(function(h){ h.click() }) }"); p.wait_for_timeout(300)   # [L15c-c] les niveaux sont repliés par défaut

F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; cl=d['config']['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Hotel','ZZTEST India','ZZTEST Juliet']
d.setdefault('dictee',{})['amenagee']={'enabled':True,'base':10,'defaultMode':'A','lacunes':[{'tokenIdx':3,'word':'le'},{'tokenIdx':7,'word':'préoccupations'},{'tokenIdx':11,'word':'parler'}]}
MOTS={1:'devint',2:'naturellement',3:'le',4:'centre',7:'préoccupations'}; ERR=[{'idx':i,'type':'M','word':MOTS[i]} for i in (1,2,3,4,7)]   # 2 dans les trous (3, 7), 3 dehors
def cp(): return {'errors':copy.deepcopy(ERR),'extras':[],'note':7.5,'deduction':2.5,'counts':{'M':5},'timestamp':1700000000000,'amenagee':False}
d['results']['zztest_hotel']=cp(); d['results']['zztest_india']=cp(); d.setdefault('amenages',{})['zztest_india']=True   # India : déjà marquée aménagée, sa copie corrigée avant
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
deplierNiveaux(p); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(4500)
def copie(k): return b.lire(p,'correction_dictee/%s/results/%s'%(D3,k)) or {}
def resume(c): return (c.get('amenagee'),c.get('base'),c.get('note'),[(e['idx'],bool(e.get('sansCout'))) for e in c.get('errors',[]) if e])
def ligne(): return p.evaluate("()=>{const e=document.getElementById('ligne-amenage');return e?e.innerText:null}")
R['india_ouverture']=(resume(copie('zztest_india')),ligne())
def clic_droit_amenage(nom):
    p.locator('.eleve-card',has_text=nom).first.click(button='right'); p.wait_for_timeout(400)
    p.locator('button',has_text='ménag').first.click(); p.wait_for_timeout(2500)
clic_droit_amenage('Z. Hotel'); R['hotel_marque']=(resume(copie('zztest_hotel')),ligne())
if CAP: p.screenshot(path=CAP+'/L150b-marque.png')
corb=b.lire(p,'corbeille') or {}; R['corbeille']=sum(1 for j in corb.values() if isinstance(j,dict) for k,e in j.items() if k.startswith('recalcul-amenage_') and (e.get('_meta') or {}).get('cle') in ('zztest_hotel','zztest_india'))
clic_droit_amenage('Z. Hotel'); R['hotel_demarque']=(resume(copie('zztest_hotel')),ligne())
# ⇧R part du mot où l'on est : texte, curseur au mot 20 → rapide sur le 20 ; rapide, avancer au 30 → texte, curseur sur le 30
p.locator('.eleve-card',has_text='Z. Juliet').first.click(); p.wait_for_timeout(900)
for _ in range(17): p.keyboard.press('ArrowRight'); p.wait_for_timeout(60)
p.wait_for_timeout(300); R['curseur_texte']=p.evaluate("()=>[...document.querySelectorAll('.word-btn.curseur-blink')].map(e=>+e.dataset.wordIdx)")
p.keyboard.press('Shift+R'); p.wait_for_timeout(1200)
R['rapide_sur']=p.evaluate("()=>{const e=document.querySelector('.fast-word');return e?e.childNodes[0].textContent.trim():null}")
for _ in range(10): p.keyboard.press(' '); p.wait_for_timeout(60)
p.wait_for_timeout(300); R['rapide_avance']=p.evaluate("()=>{const e=document.querySelector('.fast-word');return e?e.childNodes[0].textContent.trim():null}")
p.keyboard.press('Shift+R'); p.wait_for_timeout(1200)
R['curseur_retour']=p.evaluate("()=>[...document.querySelectorAll('.word-btn.curseur-blink')].map(e=>+e.dataset.wordIdx)")
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
AM=[[1,True],[2,True],[3,False],[4,True],[7,False]]; ORD=[[1,False],[2,False],[3,False],[4,False],[7,False]]
conds={'deja_dans_ce_cas_a_l_ouverture':R['india_ouverture'][0][0] is True and R['india_ouverture'][0][1]==10 and R['india_ouverture'][0][3]==AM and R['india_ouverture'][0][2]==9 and bool(R['india_ouverture'][1]),
 'marque_apres_correction':R['hotel_marque'][0][0] is True and R['hotel_marque'][0][3]==AM and R['hotel_marque'][0][2]==9 and bool(R['hotel_marque'][1]) and 'copie recalculée : 2 erreurs comptées sur 3 mots à compléter' in R['hotel_marque'][1],
 'corbeille':R['corbeille']>=2,
 'demarque':R['hotel_demarque'][0][0] is False and R['hotel_demarque'][0][3]==ORD and R['hotel_demarque'][0][2]==7.5 and 'version ordinaire' in (R['hotel_demarque'][1] or ''),
 'shiftR_texte_vers_rapide':R['curseur_texte']==[20] and R['rapide_sur']=='Penanster',
 'shiftR_rapide_vers_texte':R['rapide_avance']=='décomposition' and R['curseur_retour']==[30],
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15-0b PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
