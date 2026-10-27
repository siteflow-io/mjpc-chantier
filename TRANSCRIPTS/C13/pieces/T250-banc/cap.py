import sys, json, os, re, unicodedata
sys.path.insert(0, sys.argv[1]); from banc import Banc
OUT=sys.argv[2]; HTML=sys.argv[3]
cl=json.load(open(os.path.join(os.path.dirname(__file__),'classes.json'),encoding='utf8'))
def san(s):
    s=unicodedata.normalize('NFD',s); s=''.join(c for c in s if unicodedata.category(c)!='Mn'); return re.sub(r'[^a-z0-9]+','_',s.lower()).strip('_')
T1="Le soir tombait sur la plaine. Les soldats, fourbus, regagnaient lentement leurs abris, et personne ne parlait plus."
T2="La pluie avait cessé depuis l'aube. Marguerite traversa la cour de l'hôpital sans se retourner."
el=cl['3E Charles de Gaulle']['eleves']
res={}
for i,n in enumerate(el[:9]):
    res[san(n)]={'errors':[{'idx':3,'type':'G','word':'tombait','fautif':'tombé'}] if i%2 else [],'extras':[],'note':20-(i%4),'deduction':i%4,'timestamp':1793000000000+i*60000,'id':'copie_m1x%d_ab12cd'%i,'creeLe':1793000000000+i*60000,'modifieLe':1793000000000+i*60000}
db={'classes':cl,'correction_dictee':{
 'dictee_guerre_3e':{'config':{'title':'Dictée — Le soir sur la plaine','text':T1,'classe':'3E Charles de Gaulle','base':20,'niveau':'3e','published':True,'creeLe':1792400000000},'results':res},
 'dictee_marguerite_3e':{'config':{'title':'Dictée — Marguerite à l\'hôpital','text':T2,'classe':'3E Charles de Gaulle','base':20,'niveau':'3e','published':False,'creeLe':1792900000000}},
 'dictee_banksy_4e':{'config':{'title':'Dictée — Le portrait','text':"Il regardait le tableau que sa mère avait accroché au mur.",'classe':'4E BANKSY','base':20,'niveau':'4e','published':True,'creeLe':1792500000000}}}}
b=Banc(HTML,1707,743)
p=b.ouvrir('?mode=prof',db=db,session={'is_prof':True,'display':'Professeur'})
p.wait_for_timeout(1500)
p.evaluate("() => { document.querySelectorAll('.niveau-l15c[data-ouvert=\"0\"] h3').forEach(function(h){ h.click() }) }"); p.wait_for_timeout(500)
p.screenshot(path=OUT+'/cd-1-accueil.png')
print('accueil', p.evaluate("()=>document.body.innerText.slice(0,600)"))
p.locator('.ligne-dictee-l15c').first.locator('text=Ouvrir').first.click(); p.wait_for_timeout(1500)
p.screenshot(path=OUT+'/cd-2-dictee-ouverte.png')
print('ouverte', p.evaluate("()=>document.body.innerText.slice(0,500)"))
for g in ['Données','Réglages']:
    try:
        p.get_by_role('button',name=g,exact=True).first.click(); p.wait_for_timeout(1200); p.screenshot(path=OUT+'/cd-3-%s.png'%san(g))
    except Exception as e: print('ERR',g,e)
print('erreurs',b.erreurs[:3],'violations',b.violations[:3]); b.fermer()
