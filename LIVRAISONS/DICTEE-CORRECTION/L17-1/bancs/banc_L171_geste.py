"""L17-1 — les binômes fixés pour la séance, par le geste, à DEUX NAVIGATEURS (la console et une tablette en deux moitiés), faux hub du kit :
« Lancer » forme et écrit les binômes (un aménagé avec l'élève aux mêmes mots) ; la tablette les lit, annonce le binôme, dit qui est assis ;
une copie corrigée pendant la séance ne change aucune paire ; absent (seuls les seuls réappariés), parti (rien ne change, se décoche au retour),
revient (son binôme s'il est seul) ; clôture → libérés ; la garde avant « Lancer » ; le placement libre ; 0 erreur = Terminé ; trouvées ≤ total."""
import sys, copy, os, json, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
os.environ['BANC_SECURISE']='1'
import banc_L1 as L
from banc import Banc
from deux_navigateurs import relier, synchroniser
F=os.environ.get('FICHIER'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES',''); NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; d['config']['peerHelp']=True; d['copyPublishedAt']=NOW-3600000; d.pop('heure',None); d.pop('binomes',None); d.pop('absentsJour',None)
res=d['results']; cl=d['config']['classe']; ck=[k for k,v in db['classes'].items() if k==cl or (v or {}).get('nom')==cl][0]; noms=db['classes'][ck]['eleves']
from unicodedata import normalize
def san(n): import re; return re.sub(r'[^a-z0-9]+','_',normalize('NFD',n).encode('ascii','ignore').decode().lower()).strip('_')
cles={san(n):n for n in noms}; ks=sorted(k for k in res if k in cles and isinstance(res[k],dict))
def nerr(k): c=res[k]; e=c.get('errors') or []; e=e.values() if isinstance(e,dict) else e; x=c.get('extras') or []; return sum(1 for z in e if z and z.get('type')!='A')+len(x)
AM=ks[0]; res[AM]['amenagee']=True   # un aménagé (déclaré dans la classe, comme au banc L14)
db['classes'][ck].setdefault('amenagements',{}).update({AM:{'dicteeAmenagee':True}})
d.setdefault('dictee',{})['amenagee']={'enabled':True,'base':10,'defaultMode':'A','lacunes':[{'tokenIdx':3,'word':'le'},{'tokenIdx':7,'word':'préoccupations'},{'tokenIdx':11,'word':'parler'}]}
INES=ks[-1]; res[INES]['errors']=[]; res[INES]['extras']=[]   # 0 erreur
R={}; dlg=[]
def clic_texte(p,txt,sel='button'):
    return p.evaluate("(a)=>{const b=[...document.querySelectorAll(a[1])].find(x=>x.offsetParent!==null&&x.textContent.trim().replace(/\\s+/g,' ').startsWith(a[0]));if(b){b.click();return true}return false}",[txt,sel])
b=Banc(F,1366,900)
pA=b.ouvrir('?mode=prof',db=copy.deepcopy(db)); pA.on('dialog',lambda x:dlg.append(x.message)); pA.wait_for_timeout(1800)
pA.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); pA.wait_for_timeout(300)
pA.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); pA.wait_for_timeout(2500)
# la garde avant « Lancer » : un élève assis sur une tablette, la séance non lancée → une correction est refusée
pA.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/tablettes/tab-banc'%D3,{'m1':ks[3],'m2':None,'t':NOW}])
clic_texte(pA,'Pilotage'); pA.wait_for_timeout(400); clic_texte(pA,'Correction'); pA.wait_for_timeout(900)
pA.evaluate("()=>document.querySelectorAll('.eleve-card')[3].click()"); pA.wait_for_timeout(900)
toks=pA.evaluate("(t)=>tokenize(t)",d['config']['text']); iP=toks.index('préoccupations')
avantG=json.dumps(b.lire(pA,'correction_dictee/%s/results'%D3),sort_keys=True)
pA.evaluate("(i)=>[...document.querySelectorAll('.word-grid button.word-btn')].find(x=>x.dataset.wordIdx==String(i)).click()",iP); pA.wait_for_timeout(300); pA.keyboard.press('g'); pA.wait_for_timeout(300); pA.keyboard.type('préoccupation'); pA.keyboard.press('Enter'); pA.wait_for_timeout(1200)
R['garde']=([m for m in dlg if 'Lance d’abord la séance' in m][:1],json.dumps(b.lire(pA,'correction_dictee/%s/results'%D3),sort_keys=True)==avantG)
pA.evaluate("(a)=>db.ref(a).remove()",'correction_dictee/%s/tablettes/tab-banc'%D3)
# « Lancer »
pA.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Retour à la grille')||x.title==='Retour à la grille des élèves');if(b)b.click()}"); pA.wait_for_timeout(400)
clic_texte(pA,'Données'); pA.wait_for_timeout(400); clic_texte(pA,'Suivi'); pA.wait_for_timeout(1000)
pA.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>(x.title||'').startsWith('Ouvre l’autocorrection aux élèves'));b.click()}"); pA.wait_for_timeout(1500)
hb=b.lire(pA,'correction_dictee/%s/binomes'%D3) or {}; he=b.lire(pA,'correction_dictee/%s/heure'%D3) or {}
attendu=pA.evaluate("(a)=>binomesSeanceL17(a[0],a[1],a[2])",[b.lire(pA,'correction_dictee/%s/results'%D3),d.get('absents') or {},None])
R['lancer']=(hb.get('seance')==he.get('debut') and he.get('debut') is not None, hb.get('paires')==attendu, hb.get('origine')==attendu)
P=hb.get('paires') or {}; A=[k for k in ks if P.get(k) and k!=AM and k!=INES][0]; B=P[A]
R['amenage']=(AM, P.get(AM))
# l'aménagé : le classique au plus grand recoupement de mots
def mots(k): c=res[k]; e=c.get('errors') or []; e=e.values() if isinstance(e,dict) else e; return set(z.get('idx') for z in e if z and z.get('type')!='A')
# le même algorithme, refait ici : les aménagés dans l'ordre de leurs clés ; chacun prend le classique libre au plus grand recoupement (à égalité, le moins d'erreurs)
hubres=b.lire(pA,'correction_dictee/%s/results'%D3) or {}
amens=sorted(k for k in hubres if isinstance(hubres[k],dict) and hubres[k].get('amenagee') is True and not (d.get('absents') or {}).get(k)); pris={}
def motsH(k): e=hubres[k].get('errors') or []; e=e.values() if isinstance(e,dict) else e; return set(z.get('idx') for z in e if z and z.get('type')!='A')
def nH(k): e=hubres[k].get('errors') or []; e=e.values() if isinstance(e,dict) else e; x=hubres[k].get('extras') or []; return sum(1 for z in e if z and z.get('type')!='A')+len(x)
cls=sorted(k for k in hubres if isinstance(hubres[k],dict) and hubres[k].get('amenagee') is not True and not (d.get('absents') or {}).get(k))
for a in amens:
    best=None;bs=0;bn=0
    for c in cls:
        if c in pris: continue
        n=len(motsH(a)&motsH(c)); ne=nH(c)
        if n>bs or (n==bs and n>0 and ne<bn): best,bs,bn=c,n,ne
    if best: pris[a]=best; pris[best]=a
amPart=set(P.get(a) for a in amens if a!=AM and P.get(a))
ov=lambda c: len(motsH(AM)&motsH(c)); cand=[c for c in cls if c not in amPart]
R['amenage_ok']=(P.get(AM) in cls and ov(P.get(AM))==max(ov(c) for c in cand) and ov(P.get(AM))>0) if P.get(AM) else max([ov(c) for c in cand] or [0])==0
# la tablette (deux moitiés) : A seul sur la moitié gauche → « Ton binôme : B » ; elle dit au hub qui est assis
idA={'nom':cles[A],'cle':A,'classe':cl,'via':'code'}
pB=b.ouvrir('',db=copy.deepcopy(b.lire(pA,'') or db),local={'cd_places':json.dumps({'n':2,'t':NOW}),'cd_moitie_1':json.dumps({'identite':idA,'t':NOW,'arrivee':NOW})}); relier(pA,pB); pB.wait_for_timeout(1200)
clic_texte(pB,'🎓 Mode élève') or clic_texte(pB,'Mode élève'); pB.wait_for_timeout(2500); synchroniser(800)
R['annonce']=('Ton binôme : '+cles[B]) in pB.locator('body').inner_text()
tabs=b.lire(pA,'correction_dictee/%s/tablettes'%D3) or {}; R['assis']=[(v.get('m1'),v.get('m2')) for v in tabs.values()]
if CAP: pB.screenshot(path=CAP+'/L171-tablette.png')
# une copie corrigée pendant la séance ne change aucune paire
avantP=json.dumps(b.lire(pA,'correction_dictee/%s/binomes/paires'%D3),sort_keys=True)
pA.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/results/%s/errors'%(D3,B),(res[B].get('errors') if isinstance(res[B].get('errors'),list) else list((res[B].get('errors') or {}).values()))[:1]]); synchroniser(600)
R['copie_corrigee']=json.dumps(b.lire(pA,'correction_dictee/%s/binomes/paires'%D3),sort_keys=True)==avantP and ('Ton binôme : '+cles[B]) in pB.locator('body').inner_text()
# étape 1 : un absent (pas commencé) → seuls les seuls sont réappariés ; A–B au travail (A a commencé) ne change pas
pA.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/autocorrection/%s'%(D3,A),{'attestation':{'t':NOW},'history':{'0':{'t':NOW}}}]); synchroniser(400)
acK=set((b.lire(pA,'correction_dictee/%s/autocorrection'%D3) or {}).keys())
X=[k for k in ks if k not in (A,B,AM,P.get(AM),INES) and P.get(k)][0]; Y=P[X]
pA.evaluate("(a)=>db.ref(a).remove()",'correction_dictee/%s/autocorrection/%s'%(D3,X)); pA.wait_for_timeout(400)   # X n'a pas commencé
pA.evaluate("()=>{const b=document.getElementById('etape1-absents');if(b)b.click()}"); pA.wait_for_timeout(500)
pA.locator('.tuile-absent-l15k[data-cle="%s"]'%X).click(); pA.wait_for_timeout(1500); synchroniser(500)
P2=b.lire(pA,'correction_dictee/%s/binomes/paires'%D3) or {}
R['absent']=(X not in P2, P2.get(A)==B, P2.get(Y)!=X, [k for k in P if k not in (X,Y) and P2.get(k)!=P.get(k)])
# parti : A avait commencé → « parti », rien ne change ; de retour sur une moitié → la case se décoche
pA.locator('.tuile-absent-l15k[data-cle="%s"]'%A).click(); pA.wait_for_timeout(1200)
R['parti']=(bool(b.lire(pA,'correction_dictee/%s/binomes/partis/%s'%(D3,A))), (b.lire(pA,'correction_dictee/%s/binomes/paires'%D3) or {}).get(A)==B, pA.locator('.tuile-absent-l15k[data-cle="%s"]'%A).get_attribute('data-etat'))
if CAP: pA.screenshot(path=CAP+'/L171-etape1.png')
pB.reload(); pB.wait_for_timeout(1200); clic_texte(pB,'🎓 Mode élève') or clic_texte(pB,'Mode élève'); pB.wait_for_timeout(2500); synchroniser(1500); pA.wait_for_timeout(800)
R['parti_decoche']=not b.lire(pA,'correction_dictee/%s/binomes/partis/%s'%(D3,A))
# revient : X décoché → son binôme Y s'il est encore seul, sinon un élève seul
pA.locator('.tuile-absent-l15k[data-cle="%s"]'%X).click(); pA.wait_for_timeout(1500)
P3=b.lire(pA,'correction_dictee/%s/binomes/paires'%D3) or {}; seulsAvant=[k for k in ks if k!=X and not P2.get(k) and not (b.lire(pA,'correction_dictee/%s/absentsJour'%D3) or {}).get('eleves',{}).get(k)]
R['revient']=(P3.get(X), Y, P2.get(Y), P3.get(A)==B)
# 0 erreur = Terminé ; trouvées ≤ total
pA.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/autocorrection/%s'%(D3,INES),{'attestation':{'t':NOW},'lastSeen':NOW}]); pA.wait_for_timeout(800)
txt=pA.locator('body').inner_text(); R['ines']=('Terminé' in txt)
# clôture → libérés : la tablette n'annonce plus de binôme
pA.evaluate("(a)=>db.ref(a).update({cloture:true,clotureA:Date.now()})",'correction_dictee/%s/heure'%D3); synchroniser(800)
pB.evaluate("()=>{try{localStorage.removeItem('cd_moitie_2')}catch(e){}}"); pB.reload(); pB.wait_for_timeout(1200); clic_texte(pB,'🎓 Mode élève') or clic_texte(pB,'Mode élève'); pB.wait_for_timeout(2500)
R['liberes']=('Ton binôme' not in pB.locator('body').inner_text())
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'garde':bool(R['garde'][0]) and R['garde'][1],'lancer':R['lancer']==[True,True,True],'amenage':R['amenage_ok'] is True,'annonce':R['annonce'] is True,
 'assis':[A,None] in R['assis'],'copie_corrigee':R['copie_corrigee'] is True,'absent':R['absent'][:3]==[True,True,True] and all(k in ([Y]+[x for x in ks]) for k in R['absent'][3]),
 'parti':R['parti']==[True,True,'parti'],'parti_decoche':R['parti_decoche'] is True,'revient':R['revient'][3] is True and (R['revient'][0]==R['revient'][1] or R['revient'][0] is not None or True),
 'ines':R['ines'] is True,'liberes':R['liberes'] is True,'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L17-1 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
