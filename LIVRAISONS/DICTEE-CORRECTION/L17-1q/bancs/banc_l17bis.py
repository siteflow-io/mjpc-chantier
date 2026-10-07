# micro L17-1 bis : deux binômes sur deux tablettes (deux navigateurs, un même faux hub) — données des Hugo, copie locale
import sys, copy, json, time, os, re, unicodedata; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
from deux_navigateurs import relier, synchroniser
F=os.environ.get('FICHIER','../live_l17bis.html')
T=json.load(open('/tmp/hugo.json')); DID=T['id']
def san(n): s=unicodedata.normalize('NFD',n).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+','_',s).strip('_')
noms={san(n):n for n in T['classe']['eleves']}
db=copy.deepcopy(L.BASE); db['classes']['4_hugo']=T['classe']; D=copy.deepcopy(T['dictee']); D['autocorrection']={}; D.pop('places',None); db['correction_dictee']={DID:D}
D.setdefault('config',{})['peerHelp']=True   # [fusion L17-1q] le mode binôme (la case « Binômes imposés ») est coché
db['correction_dictee_textes']=json.load(open('/tmp/textes.json'))
_b=Banc(F,800,600); _p=_b.ouvrir('?mode=prof',db=copy.deepcopy(db)); _p.wait_for_timeout(800)
_P=_p.evaluate("(x)=>binomesSeanceL17(x[0],x[1],null)",[D['results'],D.get('absents') or {}]); _b.fermer()
LOU=sorted(k for k in _P if k in noms)[0]; THA=_P[LOU]; R={}   # [fusion L17-1q] une paire de la séance
def seed(p,n,cle,arr): p.evaluate("(a)=>localStorage.setItem('cd_moitie_'+a[0],JSON.stringify({identite:{nom:a[1],cle:a[2],classe:'4_hugo',via:'code'},t:a[3],arrivee:a[3]}))",[n,noms[cle],cle,arr])
bA=Banc(F,1280,800); bB=bA
pA=bA.ouvrir('?mode=eleve',db=copy.deepcopy(db)); pB=bA.ouvrir('?mode=eleve',db=copy.deepcopy(db)); pA.wait_for_timeout(800); pB.wait_for_timeout(800)
relier(pA,pB)
for p in (pA,pB): p.get_by_role('button',name='👥 2 élèves').click(); p.wait_for_timeout(400)
now=int(time.time()*1000)
seed(pB,1,THA,now+1000); pB.reload(); pB.wait_for_timeout(2000); synchroniser(800)   # (l'ordre de chargement ne compte pas : c'est l'heure d'arrivée qui départage — Lou est arrivée 1 s avant)
seed(pA,1,LOU,now); pA.reload(); pA.wait_for_timeout(2000); synchroniser(1200); pB.wait_for_timeout(800); synchroniser(600)
ex=pB.locator('.exclusion-l17'); R['B_exclue']=ex.count()==1 and (('Tu es avec '+noms[LOU].split(' ')[-1]+' : laisse cette tablette') in ex.first.inner_text())
R['A_intacte']=pA.locator('.exclusion-l17').count()==0
R['A_moitie2']=[l for l in pA.evaluate("()=>document.querySelectorAll('.moitie')[1].innerText").split('\n') if 'binôme' in l][:1]
pB.screenshot(path='/home/claude/MICRO20/tablette-B.png')
pB.locator('#exclusion-compris-l17').click(); pB.wait_for_timeout(1200)
R['B_liberee']=pB.locator('.exclusion-l17').count()==0 and ('tape ton code' in pB.evaluate("()=>document.querySelectorAll('.moitie')[0].innerText") or 'Mon code' in pB.evaluate("()=>document.querySelectorAll('.moitie')[0].innerText"))
# Thaïs rejoint Lou sur A (moitié 2) : aucune exclusion
seed(pA,2,THA,now+5000); pA.reload(); pA.wait_for_timeout(2000); synchroniser(800)
R['meme_tablette_ok']=pA.locator('.exclusion-l17').count()==0
places=bA.lire(pA,'correction_dictee/%s/places'%DID) or {}; R['places']={k:(v or {}).get('moitie') for k,v in places.items()}
pA.screenshot(path='/home/claude/MICRO20/tablette-A.png')
print(json.dumps(R,ensure_ascii=False))
ok=R['B_exclue'] and R['A_intacte'] and R['B_liberee'] and R['meme_tablette_ok']
print('BANC L17-1 bis : '+('VERT' if ok else 'ROUGE'), '| erreurs :', bA.erreurs[:1]); bA.fermer()
