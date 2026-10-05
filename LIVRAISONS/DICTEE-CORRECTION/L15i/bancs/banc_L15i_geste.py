"""L15i — suspendre / fermer une séance (dette 132 ; maquette T459), par le geste, à DEUX NAVIGATEURS (professeur / élève, même faux hub)."""
import sys, copy, os, json, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
os.environ['BANC_SECURISE']='1'
import banc_L1 as L
from banc import Banc
from deux_navigateurs import relier, synchroniser
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
NOW=int(time.time()*1000)
def base_db():
    db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; cl=d['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Thomas']
    d['copyPublishedAt']=NOW; d['config']['published']=True; d['heure']={'debut':NOW-20*60000,'fin':NOW+30*60000,'classe':cl,'source':'dictee','seanceId':''}
    d['results']['zztest_thomas']={'errors':[{'idx':1,'type':'G','word':'devint','fautif':'devin'}],'extras':[],'note':9,'deduction':1,'counts':{'G':1},'timestamp':NOW-3600000,'amenagee':False}
    d['autocorrection']={'zztest_thomas':{'attestation':{'t':NOW-3600000},'sessionDebut':NOW-15*60000,'results':{'0':True},'attempts':{'0':1},'total':1,'solved':1,'styloFin':NOW+120000,'lastSeen':NOW-5000}}
    return db,cl
R={}
def seance(sans_reprise):
    db,cl=base_db(); b=Banc(F,1366,900)
    pA=b.ouvrir('?mode=prof',db=copy.deepcopy(db)); pA.wait_for_timeout(1200)
    pB=b.ouvrir('',db=copy.deepcopy(db),session={'display':'ZZTEST Thomas','classe':cl}); pB.wait_for_timeout(900)
    relier(pA,pB)
    pA.evaluate("()=>mjpcEmpreinte('4321','00112233445566778899aabbccddeeff').then(e=>db.ref('codes/zztest_thomas').set({empreinte:e,sel:'00112233445566778899aabbccddeeff',name:'ZZTEST Thomas',classe:%s,createdAt:1}))"%json.dumps(cl)); pA.wait_for_timeout(500); synchroniser(500)
    pA.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); pA.wait_for_timeout(300)
    pA.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); pA.wait_for_timeout(2500)
    pA.get_by_role('button',name='Données',exact=True).first.click(); pA.wait_for_timeout(500); pA.locator('button.tab:has-text("Suivi")').first.click(); pA.wait_for_timeout(1500)
    pB.locator('text=Mode élève').first.click(); pB.wait_for_timeout(700); pB.locator('button:has-text("1 élève")').first.click(); pB.wait_for_timeout(1500)
    pB.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); pB.wait_for_timeout(2500)
    return b,pA,pB
def entrer(pB):
    if pB.locator('text=Mode élève').count(): pB.locator('text=Mode élève').first.click(); pB.wait_for_timeout(400)
    if pB.locator('button:has-text("1 élève")').count(): pB.locator('button:has-text("1 élève")').first.click(); pB.wait_for_timeout(600)
    ins=pB.locator('input:visible')
    for i,v in enumerate(['4321','ZZTEST','Thomas'][:ins.count()]): ins.nth(i).fill(v)
    pB.locator('button:has-text("Entrer")').first.click(); pB.wait_for_timeout(2500)
    pB.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); pB.wait_for_timeout(2500)
# 1. suspendre / reprendre ; le stylo vert gelé ; la fin repoussée ; puis fermer (sans reprise), le verrou, rouvrir
b,pA,pB=seance(True)
lire=lambda p,ch: b.lire(p,ch)
R['avant']=(pB.locator('#ecran-pause-132').count(),pB.locator('text=correction en vert').count()>0)
sf0=lire(pA,'correction_dictee/%s/autocorrection/zztest_thomas/styloFin'%D3); fin0=lire(pA,'correction_dictee/%s/heure/fin'%D3)
pA.locator('#btn-suspendre-132').click(); pA.wait_for_timeout(500); synchroniser(1200)
R['pause_eleve']=pB.evaluate("()=>{const e=document.getElementById('ecran-pause-132');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
R['suivi_suspendue']=(pA.evaluate("()=>{const e=document.getElementById('suspendue-depuis-132');return e?e.innerText:null}"),pA.locator('#btn-suspendre-132').inner_text(),pA.locator('#btn-suspendre-132').get_attribute('title'))
if CAP: pB.screenshot(path=CAP+'/L15i-pause-eleve.png'); pA.screenshot(path=CAP+'/L15i-suivi-suspendue.png')
pA.wait_for_timeout(3000)
t_rep=int(time.time()*1000); pA.locator('#btn-suspendre-132').click(); pA.wait_for_timeout(500); synchroniser(1500)
sf1=lire(pB,'correction_dictee/%s/autocorrection/zztest_thomas/styloFin'%D3); synchroniser(800)
h1=lire(pA,'correction_dictee/%s/heure'%D3) or {}
R['reprise']=(pB.locator('#ecran-pause-132').count(),pB.locator('text=correction en vert').count()>0,(sf1 or 0)-(sf0 or 0),(h1.get('fin') or 0)-(fin0 or 0),h1.get('pauseTotale'),h1.get('suspendue'))
# fermer (sans reprise, coché par défaut)
pA.locator('#btn-fermer-132').click(); pA.wait_for_timeout(400); R['confirm']=(pA.locator('#sans-reprise-132').is_checked(),pA.locator('#confirm-fermer-132').inner_text().replace('\n',' '))
if CAP: pA.screenshot(path=CAP+'/L15i-fermer.png')
pA.locator('#btn-fermer-ok-132').click(); pA.wait_for_timeout(500); synchroniser(1800)
h2=lire(pA,'correction_dictee/%s/heure'%D3) or {}
R['fermee']=(h2.get('cloture'),h2.get('verrou'),bool(h2.get('fermee')),'Entre ton code personnel' in pB.locator('body').inner_text())
entrer(pB); R['ferme_eleve']=pB.evaluate("()=>{const e=document.getElementById('ecran-ferme-132');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
if CAP: pB.screenshot(path=CAP+'/L15i-ferme-eleve.png')
R['verrou_suivi']=pA.evaluate("()=>{const e=document.getElementById('verrou-132');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
pA.evaluate("()=>document.getElementById('btn-rouvrir-132').click()"); pA.wait_for_timeout(500); synchroniser(1500)
pB.wait_for_timeout(1500)   # « Rouvrir » : l'écran de l'élève suit sans rechargement
R['rouvert']=(pB.locator('#ecran-ferme-132').count(),'hors classe' in pB.locator('body').inner_text())
R['err1']=b.erreurs[:3]; b.fermer()
# 2. fermer, case décochée : une clôture ordinaire
b,pA,pB=seance(False)
pA.locator('#btn-fermer-132').click(); pA.wait_for_timeout(400); pA.locator('#sans-reprise-132').uncheck(); pA.locator('#btn-fermer-ok-132').click(); pA.wait_for_timeout(500); synchroniser(1800)
h3=b.lire(pA,'correction_dictee/%s/heure'%D3) or {}
entrer(pB); R['decochee']=(h3.get('cloture'),h3.get('verrou'),pB.locator('#ecran-ferme-132').count(),'hors classe' in pB.locator('body').inner_text())
R['err2']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'avant_rien':R['avant'][0]==0,
 'pause_mot_pour_mot':R['pause_eleve']=='⏸ Séance suspendue par le professeur. Attends.',
 'suivi_suspendue':bool(R['suivi_suspendue'][0]) and R['suivi_suspendue'][0].startswith('⏸ suspendue depuis ') and R['suivi_suspendue'][1]=='▶ Reprendre' and bool(R['suivi_suspendue'][2]),
 'reprise_identique':R['reprise'][0]==0 and R['reprise'][1]==R['avant'][1],
 'stylo_gele_repart':R['reprise'][2]>=3000,
 'fin_repoussee':R['reprise'][3]>=3000 and R['reprise'][4]==R['reprise'][3] and R['reprise'][5] is None,
 'confirmation_cochee':R['confirm'][0] is True and 'Fermer la séance maintenant ?' in R['confirm'][1] and 'sans reprise hors classe' in R['confirm'][1],
 'fermer_cloture_verrou_portail':R['fermee']==[True,True,True,True],
 'ferme_mot_pour_mot':R['ferme_eleve']=='La séance est fermée. Ton professeur te dira quand tu pourras reprendre. ← Mes dictées',
 'verrou_suivi':bool(R['verrou_suivi']) and R['verrou_suivi'].startswith('🔒 Séance fermée sans reprise hors classe : la dictée reste fermée pour les élèves.'),
 'rouvrir_45_min':R['rouvert'][0]==0 and R['rouvert'][1] is True,
 'decochee_cloture_ordinaire':R['decochee'][0] is True and not R['decochee'][1] and R['decochee'][2]==0 and R['decochee'][3] is True,
 'propre':R['err1']==[] and R['err2']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15i PAR LE GESTE (deux navigateurs) :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
