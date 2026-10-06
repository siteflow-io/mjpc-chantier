# micro L15.1b-1f : le temps de recopie en vert réglé en Préparation (config.recopieSec) ; l'élève qui finit reçoit ce temps (fenêtre + chrono)
import sys, copy, os, json, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L151f.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; cl=d['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Thomas']
d['copyPublishedAt']=NOW; d['config']['published']=True; d['heure']={'debut':NOW-20*60000,'fin':NOW+30*60000}
d['results']['zztest_thomas']={'errors':[{'idx':1,'type':'G','word':'devint','fautif':'devintx'}],'extras':[],'note':9,'deduction':1,'counts':{'G':1},'timestamp':NOW-3600000,'amenagee':False}
R={}
# 1. le professeur règle 45 s en Préparation
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(3000)
p.get_by_role('button',name='Préparation',exact=True).first.click(); p.wait_for_timeout(1500)
champ=p.locator('input[type=number][min="15"]').first; R['champ_defaut']=champ.input_value() if champ.count() else None
champ.fill('45'); p.locator('button:has-text("Enregistrer")').first.click(); p.wait_for_timeout(1500)
R['config']=(b.lire(p,'correction_dictee/%s/config'%D3) or {}).get('recopieSec'); b.fermer()
# 2. l'élève qui finit (autocorrection faite, styloFin pas encore posé) : la fenêtre dit 45 secondes, le chrono ≈ 45 s
d2=copy.deepcopy(db); d2['correction_dictee'][D3]['config']['recopieSec']=45
d2['correction_dictee'][D3]['autocorrection']={'zztest_thomas':{'attestation':{'t':NOW-3600000},'sessionDebut':NOW-15*60000,'results':{'0':True},'attempts':{'0':1},'total':1,'solved':1,'questions':{}}}
b2=Banc(F,1366,900); q=b2.ouvrir('',db=d2,session={'display':'ZZTEST Thomas','classe':cl}); q.wait_for_timeout(900)
q.locator('text=Mode élève').first.click(); q.wait_for_timeout(700); q.locator('button:has-text("1 élève")').first.click(); q.wait_for_timeout(1300)
q.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); q.wait_for_timeout(3000)
t=q.locator('body').inner_text(); fen=[l for l in t.split('\n') if 'Tu as' in l and 'pour' in l]; R['fenetre']=fen[:1]
ac=b2.lire(q,'correction_dictee/%s/autocorrection/zztest_thomas'%D3) or {}; sf=ac.get('styloFin'); R['chrono_s']=round((sf-int(time.time()*1000))/1000) if sf else None
q.screenshot(path='/home/claude/MICRO13/capture.png'); print(json.dumps(R,ensure_ascii=False))
ok=R['champ_defaut']=='60' and R['config']==45 and R['fenetre'] and '45 secondes' in R['fenetre'][0] and R['chrono_s'] is not None and 30<=R['chrono_s']<=46
print('BANC L15.1b-1f : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b2.erreurs[:1]); b2.fermer()
