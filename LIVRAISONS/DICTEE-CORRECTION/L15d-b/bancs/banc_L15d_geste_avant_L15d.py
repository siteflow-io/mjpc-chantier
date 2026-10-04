"""L15d — les élèves de test entrent avec leur code, comme de vrais élèves (le bac à sable range leurs codes en empreinte ; « Tout effacer »
épargne la classe de test de MJPC) ; les modes Brut / Barré / Placeholder : une recopie attendue pour G et L seulement. Par le geste, faux hub."""
import sys, copy, os, json, re, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
os.environ['BANC_SECURISE']='1'   # un contexte sécurisé (http://localhost), comme le site en https : l'empreinte des codes y fonctionne
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Recopie','ZZTEST Rapide']
db['correction_dictee'][D3]['results']['zztest_recopie']={'errors':[{'idx':1,'type':'G','word':'devint','fautif':'devin'},{'idx':2,'type':'L','word':'naturellement','fautif':'naturelement'},{'idx':8,'type':'P','word':'.'},{'idx':4,'type':'I','word':'centre'}],'extras':[],'note':7,'deduction':3,'counts':{},'timestamp':1700000000000,'amenagee':False}
db['correction_dictee'][D3]['results']['zztest_rapide']={'errors':[{'idx':1,'type':'G','word':'devint'},{'idx':4,'type':'I','word':'centre'}],'extras':[],'note':8,'deduction':2,'counts':{},'timestamp':1700000000000,'amenagee':False}
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1500)
# le bac à sable : ses codes en empreinte
ELEVE_MJPC=db['classes']['CLASSE TEST']['eleves'][0]   # un élève de la classe de test de MJPC (anonymisé dans le kit)
NOM_MJPC=' '.join(w for w in ELEVE_MJPC.split() if w.isupper()); PRENOM_MJPC=ELEVE_MJPC[len(NOM_MJPC):].strip()
cleMJPC=p.evaluate("(n)=>san(n)",ELEVE_MJPC)
p.evaluate("(a)=>mjpcEmpreinte('7777','00112233445566778899aabbccddeeff').then(e=>db.ref('codes/'+a[0]).set({empreinte:e,sel:'00112233445566778899aabbccddeeff',name:a[1],classe:'CLASSE TEST',createdAt:1}))",[cleMJPC,ELEVE_MJPC]); p.wait_for_timeout(500)
p.locator('#mode-test-replie span:has-text("Ouvrir")').click(); p.wait_for_timeout(600)
p.locator('button:has-text("Créer le bac à sable"), button:has-text("Regénérer")').first.click(); p.wait_for_timeout(3500)
c=b.lire(p,'codes/zztest_durand_alice') or {}; R['code_bac']=sorted(c.keys())
snap={k:b.lire(p,k) for k in ('codes','classes','correction_dictee')}
# « Tout effacer » épargne la classe de test de MJPC
p.locator('button:has-text("Tout effacer")').first.click()   # (le banc accepte la confirmation); p.wait_for_timeout(3000)
R['tout_effacer']=(b.lire(p,'codes/zztest_durand_alice') is None, sorted((b.lire(p,'codes/'+cleMJPC) or {}).keys()))
# les modes de copie
p.locator('.ligne-dictee-l15c[data-id="%s"]'%D3).count()
p.evaluate("()=>{document.querySelectorAll('.niveau-l15c[data-ouvert=\"0\"] h3').forEach(h=>h.click())}"); p.wait_for_timeout(300)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(500); p.locator('button.tab:has-text("Copies")').first.click(); p.wait_for_timeout(1200)
def modes(nom):
    p.locator('button',has_text=nom.split(' ',1)[1]).first.click()   # la liste des copies corrigées de l'onglet Copies
    p.wait_for_timeout(800)
    return p.evaluate("()=>[...document.querySelectorAll('input[name=copyMode]')].map(i=>[i.value,!i.disabled,(i.closest('label')||{}).title||''])")
R['modes_recopie']=modes('ZZTEST Recopie'); R['modes_rapide']=modes('ZZTEST Rapide')
if CAP: p.screenshot(path=CAP+'/L15d-modes.png')
R['erreurs_prof']=b.erreurs[:3]; b.fermer()
# l'élève : entrer avec son code, comme un vrai élève (bac à sable, et classe de test de MJPC)
def entrer(nom,prenom,code):
    b2=Banc(F,1366,768); q=b2.ouvrir('',db=dict(copy.deepcopy(db),**{k:v for k,v in snap.items() if v})); q.wait_for_timeout(900)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(800)
    if q.locator('button:has-text("1 élève")').count(): q.locator('button:has-text("1 élève")').first.click(); q.wait_for_timeout(900)
    ins=q.locator('input:visible'); vals=[code,nom,prenom]   # l'écran : « Mon code (4 chiffres) », « Nom », « Prénom »
    for i in range(min(3,ins.count())): ins.nth(i).fill(vals[i])
    q.locator('button:has-text("Entrer")').first.click(); q.wait_for_timeout(3000)
    t=q.locator('body').inner_text(); err=b2.erreurs[:2]; b2.fermer()
    return ('Entre ton code personnel' not in t and 'ne correspond pas' not in t, 'ne correspond pas' in t or 'pas encore enregistr' in t, err)
R['entre_bac']=entrer('ZZTEST DURAND','Alice','2581'); R['entre_mjpc']=entrer(NOM_MJPC,PRENOM_MJPC,'7777'); R['refus_mauvais_code']=entrer('ZZTEST DURAND','Alice','0000')
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
d=lambda m:{v:ok for v,ok,_ in m}
conds={'codes_en_empreinte':R['code_bac']==['classe','createdAt','empreinte','name','sel'],
 'tout_effacer_epargne_mjpc':R['tout_effacer'][0] is True and 'empreinte' in R['tout_effacer'][1],
 'eleve_bac_entre':R['entre_bac'][0] is True and R['entre_bac'][1] is False,
 'eleve_mjpc_entre':R['entre_mjpc'][0] is True and R['entre_mjpc'][1] is False,
 'mauvais_code_refuse':R['refus_mauvais_code'][1] is True,
 'modes_disponibles_GL_P_I':all(d(R['modes_recopie']).get(v) for v in ('brut','barre','placeholder')),
 'modes_indispo_avec_compte':not any(d(R['modes_rapide']).get(v) for v in ('brut','barre','placeholder')) and any('il manque la recopie de 1 mot (G ou L)' in t for _,_,t in R['modes_rapide']),
 'propre':R['erreurs_prof']==[] and R['entre_bac'][2]==[] and R['entre_mjpc'][2]==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15d PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
