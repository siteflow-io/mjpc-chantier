# Reproduction 2 : une copie corrigée PENDANT la séance (Roullier, 15:37) — la tablette ouverte avant et celle ouverte après n'annoncent pas les mêmes binômes
import sys, copy, json, time, os, re, unicodedata; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc_https import Banc
F=os.environ.get('FICHIER','../live_L15kc.html')
FR=json.load(open('/tmp/franklin.json')); DID=FR['id']
def san(n): s=unicodedata.normalize('NFD',n).encode('ascii','ignore').decode().lower(); return re.sub(r'[^a-z0-9]+','_',s).strip('_')
noms={san(n):n for n in FR['classe']['eleves']}
db=copy.deepcopy(L.BASE); db['classes']['3_franklin_aretha']=FR['classe']; D=copy.deepcopy(FR['dictee']); now=int(time.time()*1000)
D['heure']={'debut':now-10*60000,'fin':now+40*60000,'classe':'3_franklin_aretha'}; D['autocorrection']={}; D.pop('absentsJour',None); db['correction_dictee']={DID:D}
avant=copy.deepcopy(db); avant['correction_dictee'][DID]['results'].pop('roullier_uijtdehaage_khais')   # la séance avant 15:37 : sa copie n'était pas là
R={}
for nom_,base in (('avant_15h37',avant),('apres_15h37',db)):
    for k in ('danard_emma','landais_emma'):
        b=Banc(F,1280,800); p=b.ouvrir('?mode=eleve',db=copy.deepcopy(base)); p.wait_for_timeout(900)
        p.get_by_role('button',name='👥 2 élèves').click(); p.wait_for_timeout(700)
        p.evaluate("(a)=>localStorage.setItem('cd_moitie_1',JSON.stringify({identite:{nom:a[0],cle:a[1],classe:'3_franklin_aretha',via:'code'},t:Date.now(),arrivee:Date.now()}))",[noms[k],k])
        p.reload(); p.wait_for_timeout(1800)
        t2=p.evaluate("()=>document.querySelectorAll('.moitie')[1].innerText"); R[nom_+'_'+k]=[l for l in t2.split('\n') if 'Ton binôme' in l][:1]
        b.fermer()
print(json.dumps(R,ensure_ascii=False))
