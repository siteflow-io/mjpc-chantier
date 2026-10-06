# micro L15k-c : étape 1 (tuiles) → absent écrit ; étape 2 (tablettes) : la tablette de l'orphelin, toucher → vue en direct des deux ; ← Modifier ; pendant l'heure : étape 2 d'office
import sys, copy, json, time, os; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L15kc.html'); DGD='dictee_preparee_5e_grandes_decouvertes-5e_herge'
db=copy.deepcopy(L.BASE); D=db['correction_dictee'][DGD]; cl=L.classe_registre(D['config']['classe'])
R={}
b=Banc(F,1366,1000); p=b.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%DGD,db=copy.deepcopy(db)); p.wait_for_timeout(3000)
p.locator('button:has-text("Suivi")').first.click(); p.wait_for_timeout(1500)
R['etape1']=p.locator('#absents-binomes-l15k[data-etape="1"]').count()==1 and p.locator('.tuile-absent-l15k').count()>=20
p.locator('.tuile-absent-l15k[data-cle="gzzovov_lzzek"]').click(); p.wait_for_timeout(1000)
aj=b.lire(p,'correction_dictee/%s/absentsJour'%DGD) or {}; R['absent_ecrit']=bool((aj.get('eleves') or {}).get('gzzovov_lzzek'))
R['tuile_rouge']='absent' in p.locator('.tuile-absent-l15k[data-cle="gzzovov_lzzek"]').inner_text()
p.screenshot(path='/home/claude/MICRO17/etape1.png')
p.locator('#etape2-binomes').click(); p.wait_for_timeout(800)
R['etape2']=p.locator('#absents-binomes-l15k[data-etape="2"]').count()==1; n=p.locator('.tablette-l15k').count(); R['tablettes']=n
R['pas_de_bouton_absent']=p.evaluate("()=>[...document.querySelectorAll('#absents-binomes-l15k button')].filter(b=>b.textContent.trim()==='absent').length")==0
p.screenshot(path='/home/claude/MICRO17/etape2.png')
p.locator('.tablette-l15k').first.click(); p.wait_for_timeout(1000)
t=p.locator('body').inner_text(); R['vue_directe']='En direct — ' in t and ' et ' in [l for l in t.split('\n') if 'En direct' in l][0]
p.screenshot(path='/home/claude/MICRO17/direct.png')
p.locator('button:has-text("Fermer")').first.click(); p.wait_for_timeout(500)
p.locator('#etape1-absents').click(); p.wait_for_timeout(500); R['retour_etape1']=p.locator('#absents-binomes-l15k[data-etape="1"]').count()==1
b.fermer()
# pendant l'heure : étape 2 d'office
db2=copy.deepcopy(db); now=int(time.time()*1000); db2['correction_dictee'][DGD]['heure']={'debut':now-5*60000,'fin':now+40*60000,'classe':D['config']['classe']}
b2=Banc(F,1366,1000); p2=b2.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%DGD,db=db2); p2.wait_for_timeout(3000); p2.locator('button:has-text("Suivi")').first.click(); p2.wait_for_timeout(1500)
R['heure_etape2']=p2.locator('#absents-binomes-l15k[data-etape="2"]').count()==1; R['erreurs']=b2.erreurs[:1]+b.erreurs[:1]; b2.fermer()
print(json.dumps(R,ensure_ascii=False))
ok=R['etape1'] and R['absent_ecrit'] and R['tuile_rouge'] and R['etape2'] and R['tablettes']>=10 and R['pas_de_bouton_absent'] and R['vue_directe'] and R['retour_etape1'] and R['heure_etape2'] and not R['erreurs']
print('BANC L15k-c : '+('VERT' if ok else 'ROUGE'))
