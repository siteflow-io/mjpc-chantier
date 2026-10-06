# micro « toutes les copies en un fichier » : le bouton sous l'archive ZIP ; le fichier contient une section par copie corrigée, les noms, une seule fois le script, la classe du body
import sys, copy, json, os, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_unhtml.html'); DGD='dictee_preparee_5e_grandes_decouvertes-5e_herge'
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%DGD,db=copy.deepcopy(L.BASE)); p.wait_for_timeout(3000)
p.locator('button:has-text("Copies")').first.click(); p.wait_for_timeout(1200)
btn=p.locator('#btn-un-html'); R={'bouton':btn.count()==1,'libelle':btn.inner_text() if btn.count() else None}
zip_y=p.locator('button:has-text("Archive ZIP")').first.bounding_box(); un_y=btn.bounding_box() if btn.count() else None; R['sous_le_zip']=bool(un_y and zip_y and un_y['y']>zip_y['y'])
with p.expect_download() as dl: btn.click()
path=dl.value.path(); html=open(path,encoding='utf-8').read(); R['fichier']=dl.value.suggested_filename
n=html.count('<section class="copie-une"'); R['sections']=n; R['scripts']=html.count('<script'); R['body_class']=re.findall(r'<body class="([^"]*)"',html)[:1]
nb=int(re.search(r'\((\d+)\)',R['libelle']).group(1)); R['attendu']=nb
noms=re.findall(r'data-eleve="([^"]+)"',html); R['noms_distincts']=len(set(noms))
p2=b.ctx.new_page() if hasattr(b,'ctx') else None
open('/home/claude/MICRO18/toutes.html','w',encoding='utf-8').write(html)
print(json.dumps(R,ensure_ascii=False))
ok=R['bouton'] and R['sous_le_zip'] and n==nb and R['scripts']==1 and R['noms_distincts']==nb
print('BANC UN-HTML : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b.erreurs[:1]); b.fermer()
