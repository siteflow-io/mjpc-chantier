"""L15f-b point 5 — la déconnexion (dette 129), par le geste, à DEUX NAVIGATEURS (professeur / élève, même faux hub) : l'élève clique
« Se déconnecter » → le portail de code, mjpc_eleve vidé, le Suivi « Déconnecté » ; il retape son code → il retrouve sa copie ; le professeur
« Déconnecter » → l'élève revient au portail sans rechargement ; « Déconnecter tous » → idem ; « Clôturer l'heure » → idem. Contexte sécurisé."""
import sys, copy, os, json, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
os.environ['BANC_SECURISE']='1'
import banc_L1 as L
from banc import Banc
from deux_navigateurs import relier, synchroniser
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; cl=d['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Thomas']
d['copyPublishedAt']=NOW; d['config']['published']=True; d['heure']={'debut':NOW-20*60000,'fin':NOW+30*60000,'classe':cl}
d['results']['zztest_thomas']={'errors':[{'idx':1,'type':'G','word':'devint','fautif':'devin'}],'extras':[],'note':9,'deduction':1,'counts':{'G':1},'timestamp':NOW-3600000,'amenagee':False}
d['autocorrection']={'zztest_thomas':{'attestation':{'t':NOW-3600000},'sessionDebut':NOW-15*60000,'results':{'0':False},'attempts':{},'total':1,'solved':0,'lastSeen':NOW-5000,'status':'active'}}
R={}
b=Banc(F,1366,900)
pA=b.ouvrir('?mode=prof',db=copy.deepcopy(db)); pA.wait_for_timeout(1200)
pB=b.ouvrir('',db=copy.deepcopy(db),session={'display':'ZZTEST Thomas','classe':cl}); pB.wait_for_timeout(900)
relier(pA,pB)
pA.evaluate("()=>mjpcEmpreinte('4321','00112233445566778899aabbccddeeff').then(e=>db.ref('codes/zztest_thomas').set({empreinte:e,sel:'00112233445566778899aabbccddeeff',name:'ZZTEST Thomas',classe:%s,createdAt:1}))"%json.dumps(cl)); pA.wait_for_timeout(500); synchroniser(600)
# le professeur : le Suivi de la dictée
pA.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); pA.wait_for_timeout(300)
pA.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); pA.wait_for_timeout(2500)
pA.get_by_role('button',name='Données',exact=True).first.click(); pA.wait_for_timeout(500); pA.locator('button.tab:has-text("Suivi")').first.click(); pA.wait_for_timeout(1500)
statutSuivi=lambda: pA.evaluate("()=>{const b=document.querySelector('.btn-deconnecter-l15f[data-cle=\"zztest_thomas\"]');const td=b&&b.closest('td');return td?td.innerText.replace(/\\s+/g,' ').trim():null}")
# l'élève, connecté par la tablette
pB.locator('text=Mode élève').first.click(); pB.wait_for_timeout(700); pB.locator('button:has-text("1 élève")').first.click(); pB.wait_for_timeout(1500)
portail=lambda: 'Entre ton code personnel' in pB.locator('body').inner_text()
sessionVide=lambda: pB.evaluate("()=>!sessionStorage.getItem('mjpc_eleve')&&!localStorage.getItem('mjpc_eleve')")
def entrer():
    pB.locator('text=Mode élève').first.click() if pB.locator('text=Mode élève').count() else None; pB.wait_for_timeout(400)
    if pB.locator('button:has-text("1 élève")').count(): pB.locator('button:has-text("1 élève")').first.click(); pB.wait_for_timeout(600)
    ins=pB.locator('input:visible')
    for i,v in enumerate(['4321','ZZTEST','Thomas'][:ins.count()]): ins.nth(i).fill(v)
    pB.locator('button:has-text("Entrer")').first.click(); pB.wait_for_timeout(2500)
# 1. l'élève clique « Se déconnecter »
R['avant']=(portail(),pB.locator('#se-deconnecter').count())
pB.locator('#se-deconnecter').click(); pB.wait_for_timeout(1200); synchroniser(1500)
R['eleve_se_deconnecte']=(portail(),sessionVide(),statutSuivi())
if CAP: pB.screenshot(path=CAP+'/L15fb5-portail.png'); pA.screenshot(path=CAP+'/L15fb5-suivi.png')
# 2. il retape son code : il retrouve sa copie rendue
entrer(); R['reconnexion']=(portail(),pB.evaluate("()=>{const l=[...document.querySelectorAll('.mesdictees-ligne')].find(x=>x.innerText.includes('brevet blanc 3E'));return l?l.innerText.replace(/\\s+/g,' '):null}"))
# le bouton sur l'écran de sa copie
pB.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); pB.wait_for_timeout(2000); R['bouton_fixe']=pB.locator('#se-deconnecter-fixe').count()
# 3. le professeur : « Déconnecter » sur l'élève
pA.locator('.btn-deconnecter-l15f[data-cle="zztest_thomas"]').click(); pA.wait_for_timeout(500); synchroniser(1500)
R['prof_deconnecte']=(portail(),sessionVide())
# 4. « Déconnecter tous »
entrer(); pA.locator('#deconnecter-tous-l15f').click(); pA.wait_for_timeout(500); synchroniser(1500); R['tous']=portail()
# 5. « Clôturer l'heure »
entrer(); R['avant_cloture']=portail()
pA.locator('button:has-text("Clôturer l’heure")').first.click(); pA.wait_for_timeout(800); synchroniser(2000); R['cloture']=portail()
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'eleve_se_deconnecte':R['avant'][0] is False and R['avant'][1]==1 and R['eleve_se_deconnecte'][0] is True and R['eleve_se_deconnecte'][1] is True and 'Déconnecté' in (R['eleve_se_deconnecte'][2] or ''),
 'reconnexion_par_code':R['reconnexion'][0] is False and bool(R['reconnexion'][1]) and 'Ouvrir' in R['reconnexion'][1],
 'bouton_sur_la_copie':R['bouton_fixe']==1,
 'prof_deconnecter':R['prof_deconnecte']==[True,True],
 'deconnecter_tous':R['tous'] is True,
 'cloture':R['avant_cloture'] is False and R['cloture'] is True,
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15f-b DÉCONNEXION (deux navigateurs) :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
