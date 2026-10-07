# micro 175 : aucun identifiant de notion vu par l'élève (Hortense, données réelles des Hugo, copie locale)
import sys, copy, json, os, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_175.html')
T=json.load(open('/tmp/hugo2.json')); DID=T['id']
db=copy.deepcopy(L.BASE); db['classes']['4_hugo']=T['classe']; D=copy.deepcopy(T['dictee']); db['correction_dictee']={DID:D}
db['correction_dictee_textes']=json.load(open('/tmp/textes.json')); db['taxonomie']={'domaines':json.load(open('/tmp/taxo_domaines.json'))}
b=Banc(F,1280,900); p=b.ouvrir('?mode=eleve',db=db,session={'display':'BURKHARD Hortense','classe':'4_hugo'}); p.wait_for_timeout(1500)
if p.get_by_role('button',name='👤 1 élève').count(): p.get_by_role('button',name='👤 1 élève').click(); p.wait_for_timeout(800)
li=p.locator('.mesdictees-ligne',has_text='travaux')
if li.count(): li.first.click(); p.wait_for_timeout(2500)
t=p.locator('body').inner_text()
ph=[l for l in t.split('\n') if 'regagné' in l and 'Pour cette dictée' in l]
lignes=[l for l in t.split('\n') if l.startswith('Question regagnée') or l.startswith('Question ratée')]
R={'phrase':ph[:1],'lignes':lignes[:4],'ids_visibles':re.findall(r'\b[a-z]+(?:-[a-z]+)*-\d{3}\b',t)[:5]}
print(json.dumps(R,ensure_ascii=False))
p.screenshot(path='/home/claude/MICRO23/hortense.png',full_page=True)
ok=bool(ph) and not R['ids_visibles'] and 'l’accord du verbe avec le sujet' in ph[0].replace("'","’")
print('BANC 175 : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b.erreurs[:1]); b.fermer()
