# micro L17-1 bis-b : trois binômes (fille-fille, garçon-fille, garçon-garçon) ; la tablette de la seconde arrivée : le message (émoji neutre) ET l'autre moitié n'annonce pas le binôme
import sys, copy, json, time, os, re, unicodedata; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
from deux_navigateurs import relier, synchroniser
F=os.environ.get('FICHIER','../live_l17bisc.html')
T=json.load(open('/tmp/hugo.json')); DID=T['id']
def san(n): s=unicodedata.normalize('NFD',n).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+','_',s).strip('_')
noms={san(n):n for n in T['classe']['eleves']}
db=copy.deepcopy(L.BASE); db['classes']['4_hugo']=T['classe']; D=copy.deepcopy(T['dictee']); D['autocorrection']={}; D.pop('places',None); db['correction_dictee']={DID:D}
db['correction_dictee_textes']=json.load(open('/tmp/textes.json'))
EMO={'fille-fille':'👭','fille-garcon':'👫','garcon-garcon':'👬'}
PAIRES=[('dekens_lou','guyon_thais','fille-fille'),('reclu_philippine','philias_evan','fille-garcon'),('gautier_jules','bouton_amauri','garcon-garcon')]
def seed(p,n,cle,arr): p.evaluate("(a)=>localStorage.setItem('cd_moitie_'+a[0],JSON.stringify({identite:{nom:a[1],cle:a[2],classe:'4_hugo',via:'code'},t:a[3],arrivee:a[3]}))",[n,noms[cle],cle,arr])
R={}; ok=True
for premier,second,lab in PAIRES:
    b=Banc(F,1280,800); pA=b.ouvrir('?mode=eleve',db=copy.deepcopy(db)); pB=b.ouvrir('?mode=eleve',db=copy.deepcopy(db)); pA.wait_for_timeout(700); pB.wait_for_timeout(700)
    relier(pA,pB)
    for p in (pA,pB): p.get_by_role('button',name='👥 2 élèves').click(); p.wait_for_timeout(300)
    now=int(time.time()*1000)
    seed(pB,1,second,now+1000); pB.reload(); pB.wait_for_timeout(1800); synchroniser(600)
    seed(pA,1,premier,now); pA.reload(); pA.wait_for_timeout(1800); synchroniser(1000); pB.wait_for_timeout(600); synchroniser(500)
    msg=pB.locator('.exclusion-l17').inner_text() if pB.locator('.exclusion-l17').count() else ''
    m2B=pB.evaluate("()=>document.querySelectorAll('.moitie')[1].innerText")
    m2A=pA.evaluate("()=>document.querySelectorAll('.moitie')[1].innerText")
    pr1=noms[premier].split(' ')[-1]
    r={'B_message':msg.replace('\n',' | '),'B_moitie2_annonce':[l for l in m2B.split('\n') if 'binôme' in l][:1],'A_moitie2':[l for l in m2A.split('\n') if 'binôme' in l][:1]}
    r_ok=('Tu es avec '+pr1+' : laisse cette tablette' in msg) and (EMO[lab] in msg) and not r['B_moitie2_annonce'] and r['A_moitie2']==['Ton binôme : '+noms[second]]
    r['ok']=r_ok; ok=ok and r_ok; R[lab]=r
    pA.screenshot(path='/home/claude/MICRO22/%s-A.png'%lab); pB.screenshot(path='/home/claude/MICRO22/%s-B.png'%lab); b.fermer()
print(json.dumps(R,ensure_ascii=False))
print('BANC L17-1 bis-c : '+('VERT' if ok else 'ROUGE'))
