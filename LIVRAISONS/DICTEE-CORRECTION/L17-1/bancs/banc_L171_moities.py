"""Dette 152 — « la moitié gauche corrige, la droite reste sur sa liste » (le contrôle 4 du banc du lot 3b, refait par le geste :
le banc d'origine n'est pas au sas). Une tablette en deux moitiés, deux élèves, la séance lancée : la gauche ouvre sa dictée et corrige
un mot ; la droite reste sur « Mes dictées », intacte ; puis la droite ouvre la sienne sans rien changer à la gauche."""
import sys, copy, os, json, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
os.environ['BANC_SECURISE']='1'
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES',''); NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; d['config']['peerHelp']=False; d['copyPublishedAt']=NOW-3600000
d['heure']={'debut':NOW-60000,'fin':NOW+40*60000,'classe':d['config']['classe'],'source':'dictee','seanceId':''}
res=d['results']; cl=d['config']['classe']; ck=[k for k,v in db['classes'].items() if k==cl or (v or {}).get('nom')==cl][0]; noms=db['classes'][ck]['eleves']
from unicodedata import normalize
import re
def san(n): return re.sub(r'[^a-z0-9]+','_',normalize('NFD',n).encode('ascii','ignore').decode().lower()).strip('_')
cles={san(n):n for n in noms}; ks=sorted(k for k in res if k in cles and isinstance(res[k],dict) and (res[k].get('errors') or []))
A,B=ks[1],ks[2]; d.setdefault('autocorrection',{}); [d['autocorrection'].pop(k,None) for k in (A,B)]
iA={'nom':cles[A],'cle':A,'classe':cl,'via':'code'}; iB={'nom':cles[B],'cle':B,'classe':cl,'via':'code'}
b=Banc(F,1366,900)
p=b.ouvrir('',db=db,local={'cd_places':json.dumps({'n':2,'t':NOW}),'cd_moitie_1':json.dumps({'identite':iA,'t':NOW,'arrivee':NOW}),'cd_moitie_2':json.dumps({'identite':iB,'t':NOW,'arrivee':NOW+1})}); p.wait_for_timeout(1200)
p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Mode élève'));if(b)b.click()}"); p.wait_for_timeout(2500)
M=lambda n: p.locator('.moitie').nth(n-1)
R={'avant':[M(1).inner_text()[:80].replace('\n',' | '),M(2).inner_text()[:80].replace('\n',' | ')]}
M(1).locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); p.wait_for_timeout(2500)
t1=M(1).inner_text(); t2=M(2).inner_text()
R['gauche_ouvre']=('Mes dictées' not in t1[:60]) ; R['droite_liste']=('brevet blanc 3E' in t2 and 'Se déconnecter' in t2)
if CAP: p.screenshot(path=CAP+'/L171-moities.png')
M(2).locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); p.wait_for_timeout(2500)
R['droite_ouvre']=('Mes dictées' not in M(2).inner_text()[:60]); R['gauche_intacte']=(M(1).inner_text()[:200]==t1[:200])
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False))
ok=R['gauche_ouvre'] and R['droite_liste'] and R['droite_ouvre'] and R['erreurs']==[]
print('BANC 152 (DEUX MOITIÉS) PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
