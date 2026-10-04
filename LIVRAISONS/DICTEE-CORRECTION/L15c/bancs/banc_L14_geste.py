"""L14 — la note des élèves aménagés : seuls les mots à compléter comptent ; le reste visible, sans coût ; la reprise à l'ouverture ;
un trou retiré → recalcul ; l'élève : la phrase de Paul, rien dans le corps du texte ; sa feuille ; le bilan. Faux hub du kit, ZZTEST."""
import sys, copy, os, json, time, re, difflib; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
def deplierNiveaux(p):
    p.evaluate("() => { document.querySelectorAll('.niveau-l15c[data-ouvert=\"0\"] h3').forEach(function(h){ h.click() }) }"); p.wait_for_timeout(300)   # [L15c-c] les niveaux sont repliés par défaut

F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
PHRASE='J’ai corrigé toute ta copie : tu dois faire l’autocorrection complète, mais la note ne compte que pour les mots que tu avais à compléter le jour de la dictée.'
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; cl=d['config']['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Echo','ZZTEST Foxtrot','ZZTEST Vieux']
db['classes'][cl].setdefault('amenagements',{}).update({'zztest_echo':{'dicteeAmenagee':True},'zztest_vieux':{'dicteeAmenagee':True}})
d.setdefault('dictee',{})['amenagee']={'enabled':True,'base':10,'defaultMode':'A','lacunes':[{'tokenIdx':3,'word':'le'},{'tokenIdx':7,'word':'préoccupations'},{'tokenIdx':11,'word':'parler'}]}
d['results']['zztest_vieux']={'errors':[{'idx':3,'type':'G','word':'le','fautif':'la'},{'idx':20,'type':'G','word':'Penanster','fautif':'Penenster'}],'extras':[{'afterIdx':5,'word':'zz'}],'note':7,'deduction':3,'counts':{'G':2,'X':1},'timestamp':1700000000000,'amenagee':True,'mode':'A','base':10}
def N(c):
    if not isinstance(c,dict): return c
    c={k:v for k,v in c.items() if k not in ('id','creeLe','creeLeInconnu','modifieLe')}
    if isinstance(c.get('errors'),list): c['errors']=[{k:v for k,v in e.items() if k!='formeId'} if isinstance(e,dict) else e for e in c['errors']]
    return c
R={}
# les autres copies : exactement ce que fait la L13 à la même ouverture (reclassement L5, identité L9, formes L10 compris) — L14 ne touche que la copie aménagée
b0=Banc(os.environ.get('BASE_L13','/home/claude/dc/L14/base-L13.html'),1366,768); p0=b0.ouvrir('?mode=prof',db=copy.deepcopy(db)); p0.wait_for_timeout(1000)
p0.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p0.wait_for_timeout(3500)
ref=b0.lire(p0,'correction_dictee/%s/results'%D3) or {}; b0.fermer()
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
avant=b.lire(p,'correction_dictee/%s/results'%D3) or {}
deplierNiveaux(p); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(3500)
apres=b.lire(p,'correction_dictee/%s/results'%D3) or {}
R['ligne']=p.evaluate("()=>{const e=document.getElementById('ligne-amenage');return e?e.innerText:null}")
v=apres.get('zztest_vieux',{}); R['vieux']=([(e['idx'],bool(e.get('sansCout')),e.get('motifSansCout')) for e in v.get('errors',[])],[bool(x.get('sansCout')) for x in v.get('extras',[])],v.get('note'))
corb=b.lire(p,'corbeille') or {}; ent=[e for j in corb.values() if isinstance(j,dict) for k,e in j.items() if k.startswith('recalcul-amenage_')]
R['corbeille']=(len(ent),bool(ent) and json.dumps(N(ent[0]['data']),sort_keys=True)==json.dumps(N(avant['zztest_vieux']),sort_keys=True))
R['autres_identiques']=all(json.dumps(N(ref[k]),sort_keys=True)==json.dumps(N(apres.get(k)),sort_keys=True) for k in ref if k!='zztest_vieux')
# la correction en mode rapide : M sur 1, 2, 3, 4, 7 (trous : 3 et 7)
def rapide(nom,idxs):
    p.locator('.eleve-card',has_text=nom).first.click(); p.wait_for_timeout(900); p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
    cur=0
    for i in idxs:
        while cur<i: p.keyboard.press(' '); p.wait_for_timeout(60); cur+=1
        p.keyboard.press('m'); p.wait_for_timeout(250); cur+=1
    p.wait_for_timeout(500); p.keyboard.press('Shift+R'); p.wait_for_timeout(800); p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)
def copie(k): c=b.lire(p,'correction_dictee/%s/results/%s'%(D3,k)) or {}; return c
rapide('Z. Echo',[1,2,3,4,7]); rapide('Z. Foxtrot',[3,7])
e=copie('zztest_echo'); f=copie('zztest_foxtrot')
R['echo']=([(x['idx'],bool(x.get('sansCout'))) for x in e.get('errors',[])],e.get('note'),e.get('amenagee')); R['foxtrot_note']=f.get('note')
# une erreur hors trou : la note ne bouge pas ; dans un trou : elle bouge (mode texte)
p.locator('.eleve-card',has_text='Z. Echo').first.click(); p.wait_for_timeout(900)
n0=copie('zztest_echo').get('note')
p.locator('.word-grid button.word-btn[data-word-idx="9"]').click(); p.wait_for_timeout(300); p.locator('.popup-btn-m').first.click(); p.wait_for_timeout(700); n1=copie('zztest_echo').get('note')
p.locator('.word-grid button.word-btn[data-word-idx="11"]').click(); p.wait_for_timeout(300); p.locator('.popup-btn-m').first.click(); p.wait_for_timeout(700); n2=copie('zztest_echo').get('note')
R['hors_trou_dans_trou']=(n0,n1,n2)
if CAP: p.screenshot(path=CAP+'/L14-prof-copie.png')
p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)
# un élève non aménagé : tout compte
p.locator('.eleve-card',has_text='Z. Foxtrot').first.click(); p.wait_for_timeout(900); nf0=copie('zztest_foxtrot').get('note')
p.locator('.word-grid button.word-btn[data-word-idx="9"]').click(); p.wait_for_timeout(300); p.locator('.popup-btn-m').first.click(); p.wait_for_timeout(700)
R['non_amenage']=(nf0,copie('zztest_foxtrot').get('note')); p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)
# un trou retiré (7) : recalcul, message
p.evaluate("(pth)=>db.ref(pth).set([{tokenIdx:3,word:'le'},{tokenIdx:11,word:'parler'}])",'correction_dictee/%s/dictee/amenagee/lacunes'%D3); p.wait_for_timeout(2500)
R['trou_retire']=(p.evaluate("()=>{const e=document.getElementById('ligne-amenage');return e?e.innerText:null}"),[(x['idx'],bool(x.get('sansCout'))) for x in copie('zztest_echo').get('errors',[]) if x['idx']==7],copie('zztest_echo').get('note'))
# le bilan exporté
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(700); p.get_by_role('button',name='Bilan',exact=True).first.click(); p.wait_for_timeout(800)
p.locator('button:has-text("Prompt IA")').first.click(); p.wait_for_timeout(1500); bil=p.locator('body').inner_text()
m=re.search(r'"ZZTEST Echo"[\s\S]{0,900}?"erreurs_comptees": (\d+)',bil); R['bilan_echo']=m.group(1) if m else None
R['erreurs_prof']=b.erreurs[:3]; b.fermer()
# l'élève : l'encart, le corps du texte identique à celui d'un élève non aménagé, sa feuille
def eleve(nom,cle,amen):
    d2=copy.deepcopy(db); d2['correction_dictee'][D3]['copyPublishedAt']=int(time.time()*1000); d2['correction_dictee'][D3]['heure']={'debut':int(time.time()*1000),'fin':int(time.time()*1000)+55*60000}
    MOTS={1:'devint',2:'naturellement',3:'le',4:'centre',7:'préoccupations'}
    errs=[{'idx':i,'type':'M','word':MOTS[i]} for i in (1,2,3,4,7)]
    if amen: errs=[dict(x,sansCout=True,motifSansCout='amenage') if x['idx'] not in (3,7) else x for x in errs]
    d2['correction_dictee'][D3]['results'][cle]={'errors':errs,'extras':[],'note':9,'deduction':1,'counts':{'M':2},'timestamp':1700000000000,'amenagee':amen,'mode':'A' if amen else None,'base':10}
    b3=Banc(F,1366,768); q=b3.ouvrir('',db=d2,session={'display':nom,'classe':cl}); q.wait_for_timeout(1000)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(800); q.locator('button:has-text("1 élève")').first.click(); q.wait_for_timeout(1500)
    q.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); q.wait_for_timeout(1500)
    if q.locator('input[type=checkbox]').count(): q.locator('input[type=checkbox]').first.check(); q.wait_for_timeout(200); q.locator('button:has-text("Commencer")').first.click(); q.wait_for_timeout(1800)
    encart=q.evaluate("()=>{const e=document.getElementById('encart-amenage');return e?e.innerText.trim():null}")
    corps=q.evaluate("()=>{const t=[...document.querySelectorAll('div')].find(x=>x.innerText&&x.innerText.startsWith('Clique sur un mot masqué'));const c=t&&t.parentElement;return c?c.innerText:null}")
    if CAP and amen: q.screenshot(path=CAP+'/L14-eleve.png')
    b3.fermer()
    b4=Banc(F,1366,768); q=b4.ouvrir('?dictee=%s&eleveKey=%s&screen=copie'%(D3,cle),db=d2,session={'display':nom,'classe':cl}); q.wait_for_timeout(1200)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(1000)
    if q.locator('button:has-text("1 élève")').count(): q.locator('button:has-text("1 élève")').first.click()
    q.wait_for_timeout(3000); src=q.evaluate("()=>[...document.querySelectorAll('iframe')].map(x=>x.getAttribute('srcdoc')||'').join(' ')")
    if CAP and amen: q.screenshot(path=CAP+'/L14-eleve-feuille.png')
    err=b3.erreurs[:2]+b4.erreurs[:2]; b4.fermer()
    return encart,corps,src,err
ea,ca,sa,erra=eleve('ZZTEST Echo','zztest_echo',True); en,cn,sn,errn=eleve('ZZTEST Foxtrot','zztest_foxtrot',False)
R['eleve_encart']=(ea,en)
def sans(t): return re.sub(r'\s+',' ',(t or '').replace(PHRASE,' ').replace('Echo','NOM').replace('Foxtrot','NOM')).strip()
R['corps_identique']=(ca is not None and sans(ca)==sans(cn))   # le corps de la dictée : identique, hors la phrase et le prénom
def txt(src): return re.sub(r'\s+',' ',re.sub(r'<style.*?</style>',' ',re.sub(r'<[^>]+>',' ',re.sub(r'<style.*?</style>','',src,flags=re.S)),flags=re.S)).strip()
fa,fn=txt(sa).replace('Echo','NOM'),txt(sn).replace('Foxtrot','NOM')
R['feuille_diff']=[(op,' '.join(fn.split()[b1:b2]),' '.join(fa.split()[a1:a2])) for op,b1,b2,a1,a2 in difflib.SequenceMatcher(None,fn.split(),fa.split()).get_opcodes() if op!='equal']
R['feuille']=(sa.count(PHRASE),sn.count(PHRASE),txt(sa).count('−0,5'),txt(sn).count('−0,5'),'forme accept' in sa)
import difflib; R['corps_diff']=[(op,ca.split()[a1:a2],cn.split()[b1:b2]) for op,a1,a2,b1,b2 in difflib.SequenceMatcher(None,(ca or '').split(),(cn or '').split()).get_opcodes() if op!='equal'][:6]
R['erreurs_eleve']=erra+errn
print(json.dumps({k:v for k,v in R.items() if k not in ('corps',)},ensure_ascii=False)[:3000]); R=json.loads(json.dumps(R))
conds={'reprise':bool(R['ligne']) and '1 copie aménagée recalculée' in R['ligne'] and R['vieux'][0]==[[3,False,None],[20,True,'amenage']] and R['vieux'][1]==[True] and R['corbeille']==[1,True] and R['autres_identiques'],
 'rapide':R['echo'][0]==[[1,True],[2,True],[3,False],[4,True],[7,False]] and R['echo'][2] is True and R['echo'][1]==R['foxtrot_note'],
 'hors_trou_dans_trou':R['hors_trou_dans_trou'][0]==R['hors_trou_dans_trou'][1] and R['hors_trou_dans_trou'][2]<R['hors_trou_dans_trou'][1],
 'non_amenage':R['non_amenage'][1]<R['non_amenage'][0],
 'trou_retire':bool(R['trou_retire'][0]) and 'la version aménagée a changé' in R['trou_retire'][0] and R['trou_retire'][1]==[[7,True]],
 'bilan':R['bilan_echo'] is not None,
 'eleve_encart':R['eleve_encart']==[PHRASE,None],'corps_identique':R['corps_identique'],
 'feuille':R['feuille'][0]==1 and R['feuille'][1]==0 and R['feuille'][2]==2*2 and R['feuille'][3]==2*5 and R['feuille'][4] is False,   # la phrase sous l'en-tête ; le coût (sous le mot et dans la liste) seulement pour les 2 erreurs des trous ; aucune autre marque
 'propre':R['erreurs_prof']==[] and R['erreurs_eleve']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L14 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
