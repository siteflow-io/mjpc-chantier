# micro 177 : « Je garde ma note » demande une confirmation ; rien n'est enregistré avant « Oui » ; « Non » revient aux questions (données d'Axel, copie locale)
import sys, copy, json, os, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_177.html')
T=json.load(open('/tmp/hugo2.json')); DID=T['id']; now=int(time.time()*1000)
db=copy.deepcopy(L.BASE); db['classes']['4_hugo']=T['classe']; D=copy.deepcopy(T['dictee']); db['correction_dictee']={DID:D}
db['correction_dictee_textes']=json.load(open('/tmp/textes.json')); db['taxonomie']={'domaines':json.load(open('/tmp/taxo_domaines.json'))}
D['heure']={'debut':now-30*60000,'fin':now+20*60000,'classe':'4_hugo'}
a=D['autocorrection']['martin_axel']; a.pop('garderNote',None); a['styloFin']=now-5*60000; a['copieRamassee']=now-4*60000
b=Banc(F,1280,1000); p=b.ouvrir('?mode=eleve',db=db,session={'display':'MARTIN Axel','classe':'4_hugo'}); p.wait_for_timeout(1500)
if p.get_by_role('button',name='👤 1 élève').count(): p.get_by_role('button',name='👤 1 élève').click(); p.wait_for_timeout(800)
p.locator('.mesdictees-ligne',has_text='travaux').first.click(); p.wait_for_timeout(2500)
R={'bouton':p.locator('#garder-note').count()==1}
p.locator('#garder-note').click(); p.wait_for_timeout(500)
R['confirmation']=p.locator('#confirmer-garder-note').count()==1 and 'Tu ne pourras plus répondre aux questions' in p.locator('#confirmer-garder-note').inner_text()
R['rien_ecrit']=(b.lire(p,'correction_dictee/%s/autocorrection/martin_axel/garderNote'%DID)) is None
p.locator('#confirmer-garder-note').scroll_into_view_if_needed(); p.wait_for_timeout(300); p.screenshot(path='/home/claude/MICRO24/confirmation.png')
p.locator('#garder-non').click(); p.wait_for_timeout(500)
R['non_revient']=p.locator('#repondre-question').count()==1 and (b.lire(p,'correction_dictee/%s/autocorrection/martin_axel/garderNote'%DID)) is None
p.locator('#garder-note').click(); p.wait_for_timeout(400); p.locator('#garder-oui').click(); p.wait_for_timeout(800)
R['oui_enregistre']=b.lire(p,'correction_dictee/%s/autocorrection/martin_axel/garderNote'%DID)==True and p.locator('#repondre-question').count()==0
print(json.dumps(R,ensure_ascii=False)); ok=all(R.values())
print('BANC 177 : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b.erreurs[:1]); b.fermer()
