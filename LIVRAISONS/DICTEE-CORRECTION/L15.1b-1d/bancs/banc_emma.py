# Reproduction : « conflit d'identification entre Emma DANARD et Emma LANDAIS » — toutes les configurations, hub local (copie de la dictée des Franklin), codes de test
import sys, copy, json, time, os, re, unicodedata; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc_https import Banc
F=os.environ.get('FICHIER','../live_L15kc.html')
FR=json.load(open('/tmp/franklin.json')); DID=FR['id']
def san(n): s=unicodedata.normalize('NFD',n).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+','_',s).strip('_')
db=copy.deepcopy(L.BASE); db['classes']['3_franklin_aretha']=FR['classe']; D=copy.deepcopy(FR['dictee']); now=int(time.time()*1000)
D['heure']={'debut':now-10*60000,'fin':now+40*60000,'classe':'3_franklin_aretha'}; D['autocorrection']={}; D.pop('absentsJour',None)
db['correction_dictee']={DID:D}
CODES={'danard_emma':'1111','landais_emma':'2222','litou_emma':'3333','laine_ferelloc_eden':'4444','lacroix_oceane':'5555','moreau_ines':'6666'}
noms={san(n):n for n in FR['classe']['eleves']}
# empreintes calculées par l'app elle-même
b0=Banc(F,800,600); p0=b0.ouvrir('?mode=eleve',db=copy.deepcopy(db)); p0.wait_for_timeout(800)
codes={}
for k,c in CODES.items():
    sel='sel'+k[:6]; emp=p0.evaluate("(a)=>mjpcEmpreinte(a[0],a[1])",[c,sel]); codes[k]={'name':noms[k],'classe':'3_franklin_aretha','sel':sel,'empreinte':emp,'chiffre':'x','createdAt':now}
b0.fermer(); db['codes']=codes
mots={k:[e.get('word') for e in (D['results'][k].get('errors') or []) if e] for k in CODES}
R={}
def portail(p,moitie=None):
    return p.locator('.moitie').nth(moitie-1) if moitie else p
def login(p,cle,moitie=None,libre=True):
    zone=portail(p,moitie); nom=noms[cle]; parts=nom.split(' '); N=' '.join(parts[:-1]); P=parts[-1]
    if libre:
        ins=zone.locator('input'); 
        # code, nom, prénom
        vals=[CODES[cle],N,P]
        for i,v in enumerate(vals):
            el=ins.nth(i); el.click(); el.evaluate("(e,v)=>{const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(e,v);e.dispatchEvent(new Event('input',{bubbles:true}))}",v)
        zone.locator('button:has-text("Entrer")').first.click()
    else:
        for ch in CODES[cle]: zone.locator('button',has_text=ch).first.click()
        zone.locator('button:has-text("Entrer")').first.click()
    p.wait_for_timeout(1800)
def texte(p,moitie=None): return (p.locator('.moitie').nth(moitie-1).inner_text() if moitie else p.locator('body').inner_text())
def qui(t): return [k for k in CODES if noms[k] in t]
# K1/K2 : « 1 élève », chacune seule
for k in ('danard_emma','landais_emma'):
    b=Banc(F,1280,800); p=b.ouvrir('?mode=eleve',db=copy.deepcopy(db)); p.wait_for_timeout(1000)
    p.get_by_role('button',name='👤 1 élève').click(); p.wait_for_timeout(900); login(p,k)
    t=texte(p); R['1eleve_'+k]={'nom_affiche':qui(t),'erreur':[l for l in t.split('\n') if 'code' in l.lower()][:1]}
    b.fermer()
# K3/K4 : « 2 élèves », Emma en moitié 1 (saisie libre), son binôme annoncé en moitié 2, il entre par son code
for k in ('danard_emma','landais_emma'):
    b=Banc(F,1280,800); p=b.ouvrir('?mode=eleve',db=copy.deepcopy(db)); p.wait_for_timeout(1000)
    p.get_by_role('button',name='👥 2 élèves').click(); p.wait_for_timeout(900); login(p,k,1)
    t2=texte(p,2); ann=[l for l in t2.split('\n') if 'Ton binôme' in l]; R['2eleves_'+k+'_annonce']=ann[:1]
    attendu=None
    for kk in CODES:
        if ann and noms[kk] in ann[0]: attendu=kk
    if attendu: login(p,attendu,2,libre=False)
    R['2eleves_'+k+'_moities']=[qui(texte(p,1)),qui(texte(p,2))]; R['2eleves_'+k+'_voile']=p.locator('.moitie-refusee').count()
    p.reload(); p.wait_for_timeout(2000); R['2eleves_'+k+'_apres_rechargement']=[qui(texte(p,1)),qui(texte(p,2))]
    b.fermer()
# K5 : Danard en moitié 1, Landais tape sur la moitié 2 (« Pas là ? »)
b=Banc(F,1280,800); p=b.ouvrir('?mode=eleve',db=copy.deepcopy(db)); p.wait_for_timeout(1000)
p.get_by_role('button',name='👥 2 élèves').click(); p.wait_for_timeout(900); login(p,'danard_emma',1)
z=p.locator('.moitie').nth(1); z.locator('button:has-text("Pas là")').first.click(); p.wait_for_timeout(800); login(p,'landais_emma',2)
R['danard_puis_landais']={'moities':[qui(texte(p,1)),qui(texte(p,2))],'voile':p.locator('.moitie-refusee').count()}
b.fermer()
# K6 : deux tablettes en même temps (deux navigateurs, un hub partagé) : chacune corrige un mot
bA=Banc(F,1280,800); pA=bA.ouvrir('?mode=eleve',db=copy.deepcopy(db)); pA.wait_for_timeout(900)
pA.get_by_role('button',name='👤 1 élève').click(); pA.wait_for_timeout(700); login(pA,'danard_emma')
dbB=json.loads(json.dumps(db)); 
pB=bA.ctx.new_page() if hasattr(bA,'ctx') else None
R['deux_tablettes']='(même navigateur : voir K6b)'
bA.fermer()
print(json.dumps(R,ensure_ascii=False))
