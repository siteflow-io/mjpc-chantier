# 687 (b) : l'élève qui REVIENT pendant la séance — la règle validée par Paul (06/10, tour 533), ses trois cas, prouvés au hub :
#  (1) son binôme est resté seul → ils se retrouvent ;
#  (2) son binôme a été réapparié mais ils n'ont pas commencé → ils se retrouvent ; l'autre redevient seul (ou rejoint un élève seul) ;
#  (3) son binôme travaille déjà avec un autre → il ne le reprend pas : il rejoint un élève seul, sinon il est seul ;
#  et toujours : aucune autre paire ne bouge. (Données du kit ; aménagements retirés pour isoler la règle ; 28 présents : aucun élève seul au départ.)
import sys, copy, json, os, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_fusion.html'); DGD='dictee_preparee_5e_grandes_decouvertes-5e_herge'
db0=copy.deepcopy(L.BASE); D=db0['correction_dictee'][DGD]; D['copyPublishedAt']=1790000000000
for k in list((D.get('autocorrection') or {}).keys()): D['autocorrection'].pop(k)
for k,v in D['results'].items():
    if isinstance(v,dict): v.pop('amenagee',None)
d=time.localtime(); J='%04d-%02d-%02d'%(d.tm_year,d.tm_mon,d.tm_mday)
pres=sorted(k for k,v in D['results'].items() if isinstance(v,dict) and not (D.get('absents') or {}).get(k))
Z=pres[0] if len(pres)%2==1 else '__aucun__'
if Z!='__aucun__': D['absentsJour']={'date':J,'eleves':{Z:True}}   # un nombre pair de présents : aucun élève seul au départ
R={}
def ouvrir():
    b=Banc(F,1366,1000); p=b.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%DGD,db=copy.deepcopy(db0)); p.wait_for_timeout(3000)
    p.locator('button:has-text("Suivi")').first.click(); p.wait_for_timeout(1500)
    p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>(x.title||'').startsWith('Ouvre l’autocorrection aux élèves'));b.click()}"); p.wait_for_timeout(1500)
    return b,p
def paires(b,p): return dict((b.lire(p,'correction_dictee/%s/binomes/paires'%DGD) or {}))
def tuile(p,k):
    if p.locator('#etape1-absents').count(): p.locator('#etape1-absents').click(); p.wait_for_timeout(400)
    p.locator('.tuile-absent-l15k[data-cle="%s"]'%k).click(); p.wait_for_timeout(1200)
def commence(p,k): p.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/autocorrection/%s'%(DGD,k),{'attestation':{'t':int(time.time()*1000)},'history':{'0':[{'typed':'x','ok':False}]}}]); p.wait_for_timeout(400)
def inchangees(P0,P2,exclus): return [k for k in P0 if k not in exclus and P2.get(k)!=P0.get(k)]
ok={}
# cas 1
b,p=ouvrir(); P0=paires(b,p); seuls0=[k for k in pres if k!=Z and not P0.get(k)]
X=[k for k in pres if k!=Z and P0.get(k)][0]; O=P0[X]
tuile(p,X); P1=paires(b,p); tuile(p,X); P2=paires(b,p)
R['cas1']={'seuls_au_depart':seuls0,'O_pendant':P1.get(O),'X_au_retour':P2.get(X),'autres':inchangees(P0,P2,(X,O))}
ok['1']=(not seuls0 and P1.get(O) is None and P2.get(X)==O and P2.get(O)==X and not R['cas1']['autres']); b.fermer()
# cas 2 et 3
for cas in ('2','3'):
    b,p=ouvrir(); P0=paires(b,p)
    X=[k for k in pres if k!=Z and P0.get(k)][0]; O=P0[X]; W=[k for k in pres if k not in (Z,X,O) and P0.get(k)][0]; V=P0[W]
    tuile(p,X); tuile(p,W); P1=paires(b,p)
    if cas=='3': commence(p,O); commence(p,V)
    tuile(p,X); P2=paires(b,p)
    R['cas'+cas]={'O_avec_V_pendant':P1.get(O)==V,'X_au_retour':P2.get(X),'O_au_retour':P2.get(O),'V_au_retour':P2.get(V),'autres':inchangees(P0,P2,(X,O,W,V))}
    if cas=='2': ok['2']=(P1.get(O)==V and P2.get(X)==O and P2.get(O)==X and P2.get(V) is None and not R['cas2']['autres'])
    else: ok['3']=(P1.get(O)==V and P2.get(O)==V and P2.get(V)==O and P2.get(X) is None and not R['cas3']['autres'])
    R['erreurs'+cas]=b.erreurs[:2]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); print('cas :',ok)
print('BANC REVIENT : '+('VERT' if all(ok.values()) and not R['erreurs2'] and not R['erreurs3'] else 'ROUGE'))
