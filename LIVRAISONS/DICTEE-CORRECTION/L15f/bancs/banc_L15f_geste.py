"""L15f — côté élève : la note après le chrono, le regain en clair, le bilan, l'actualisation. Par le geste ; le professeur agit en écrivant au hub
de la page de l'élève (ce que fait son clic, reçu par l'écoute). Faux hub du kit, ZZTEST."""
import sys, copy, os, json, re, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; cl=d['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Thomas']
d['copyPublishedAt']=NOW; d['config']['published']=True; d['heure']={'debut':NOW-20*60000,'fin':NOW+30*60000}
MOTS={1:'devint',2:'naturellement',4:'centre',6:'nos'}
d['results']['zztest_thomas']={'errors':[{'idx':i,'type':'G','word':w,'fautif':w+'x'} for i,w in MOTS.items()],'extras':[],'note':5,'deduction':5,'counts':{'G':4},'timestamp':NOW-3600000,'amenagee':False}
def ac(styloFin,questions=None):
    return {'attestation':{'t':NOW-3600000},'sessionDebut':NOW-15*60000,'results':{'0':True,'1':True,'2':True,'3':True},'attempts':{'0':2,'1':2,'2':2,'3':1},'total':4,'solved':4,'styloFin':styloFin,'questions':questions or {}}
R={}
def eleve(acn,quoi):
    d2=copy.deepcopy(db); d2['correction_dictee'][D3]['autocorrection']={'zztest_thomas':acn}
    b=Banc(F,1366,900); q=b.ouvrir('',db=d2,session={'display':'ZZTEST Thomas','classe':cl}); q.wait_for_timeout(900)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(700); q.locator('button:has-text("1 élève")').first.click(); q.wait_for_timeout(1300)
    if quoi!='liste': q.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); q.wait_for_timeout(2200)
    return b,q
# 1. le chrono du stylo vert : aucune note derrière ; à zéro, l'écran de fin
b,q=eleve(ac(NOW+90000),'fin')
R['chrono']=(q.locator('#notes-fin').count(),q.evaluate("()=>{const e=document.getElementById('note-apres-chrono');return e?e.innerText:null}"),q.locator('#detail-autocorrection').count(),'Note de dictée' in q.locator('body').inner_text())
if CAP: q.screenshot(path=CAP+'/L15f-chrono.png')
q.evaluate("(p)=>db.ref(p).set(Date.now()-1000)",'correction_dictee/%s/autocorrection/zztest_thomas/styloFin'%D3); q.wait_for_timeout(2500)
R['apres_chrono']=(q.locator('#notes-fin').count(),q.locator('#note-apres-chrono').count())
R['err1']=b.erreurs[:2]; b.fermer()
# 2. le regain en clair ; « Je garde ma note »
b,q=eleve(ac(NOW-60000),'fin')
R['consigne']=q.evaluate("()=>{const e=document.getElementById('consigne-regain');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
R['boutons']=(q.evaluate("()=>{const e=document.getElementById('garder-note');return e?e.innerText:null}"),q.locator('#repondre-question').count())
R['infobulles_encart']=q.evaluate("()=>{const c=document.getElementById('consigne-regain');const card=c&&c.closest('.card');return card?[...card.querySelectorAll('[title]')].length:-1}")
if CAP: q.screenshot(path=CAP+'/L15f-regain.png')
q.locator('#garder-note').click(); q.wait_for_timeout(1200)
R['garde']=(b.lire(q,'correction_dictee/%s/autocorrection/zztest_thomas/garderNote'%D3),q.locator('#repondre-question').count(),q.locator('#consigne-regain').count())
R['err2']=b.erreurs[:2]; b.fermer()
# 3. le bilan : le regain à part, le détail, la phrase
Q={'0':{'id':'q1','notion':'l’accord du verbe','ok':True,'t':NOW-60000},'1':{'id':'q2','notion':'l’imparfait','ok':False,'t':NOW-30000}}
b,q=eleve(ac(NOW-60000,Q),'fin')
R['detail_regain']=q.evaluate("()=>{const e=document.getElementById('detail-regain');return e?e.innerText:null}")
R['tableau']=q.evaluate("()=>{const e=document.getElementById('detail-autocorrection');return e?[...e.querySelectorAll('tr')].map(t=>t.innerText.replace(/\\s+/g,' ').trim()):null}")
R['phrase']=q.evaluate("()=>{const t=[...document.querySelectorAll('div')].find(x=>x.innerText&&x.innerText.startsWith('« Pour cette dictée'));return t?t.innerText:null}")
if CAP: q.screenshot(path=CAP+'/L15f-bilan.png')
R['err3']=b.erreurs[:2]; b.fermer()
# 3b. le Suivi professeur et le bilan exporté : le regain à part
d4=copy.deepcopy(db); d4['correction_dictee'][D3]['autocorrection']={'zztest_thomas':ac(NOW-60000,Q)}
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=d4); p.wait_for_timeout(1200)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(500); p.locator('button.tab:has-text("Suivi")').first.click(); p.wait_for_timeout(1800)
R['suivi']=p.evaluate("()=>[...document.querySelectorAll('.regain-suivi')].map(e=>e.innerText)")
p.locator('button.tab:has-text("Bilan")').first.click(); p.wait_for_timeout(600); p.locator('button:has-text("Prompt IA")').first.click(); p.wait_for_timeout(2000)
m=re.search(r'"autocorrection": \{[^}]*\}',p.locator('body').inner_text()); R['export']=m.group(0) if m else None
R['err4']=b.erreurs[:2]; b.fermer()
# 4. l'actualisation : masquer / rendre / dépublier, sans recharger
b,q=eleve(ac(NOW-60000),'liste')
ligne=lambda: q.evaluate("()=>{const l=[...document.querySelectorAll('.mesdictees-ligne')].find(x=>x.innerText.includes('brevet blanc 3E'));return l?l.innerText.replace(/\\s+/g,' '):null}")
R['liste0']=ligne()
q.evaluate("(p)=>db.ref(p).set(null)",'correction_dictee/%s/copyPublishedAt'%D3); q.wait_for_timeout(1500); R['masquee']=ligne()
q.evaluate("(p)=>db.ref(p).set(Date.now())",'correction_dictee/%s/copyPublishedAt'%D3); q.wait_for_timeout(1500); R['rendue']=ligne()
q.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); q.wait_for_timeout(2000); R['ouverte']='Mes dictées' not in q.locator('body').inner_text()[:400]
q.evaluate("(p)=>db.ref(p).set(null)",'correction_dictee/%s/copyPublishedAt'%D3); q.wait_for_timeout(1800); R['masquee_ouverte']=(ligne() is not None)
q.evaluate("(p)=>db.ref(p).set(false)",'correction_dictee/%s/config/published'%D3); q.wait_for_timeout(1500); R['depubliee']=ligne()
if CAP: q.screenshot(path=CAP+'/L15f-liste.png')
R['err5']=b.erreurs[:2]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
CONS='Comment ça marche : une question sur une règle que tu as ratée ; si tu réponds juste, tu regagnes 1,25 point sur ta note d’autocorrection. Si tu réponds faux, tu ne perds rien. Tu peux aussi garder ta note telle quelle.'
conds={'chrono_sans_note':R['chrono'][0]==0 and R['chrono'][1]=='Ta note de dictée s’affichera à la fin du chrono.' and R['chrono'][2]==0,
 'a_zero_l_ecran_de_fin':R['apres_chrono']==[1,0],
 'consigne_mot_pour_mot':R['consigne']==CONS,
 'je_garde_ma_note':R['boutons'][0]=='Je garde ma note (2,5/5)' and R['boutons'][1]==1 and R['garde']==[True,0,0],
 'pas_d_infobulle':R['infobulles_encart']==0,
 'regain_a_part':R['detail_regain']=='2,5/5 + 1,25 regagné',
 'tableau':bool(R['tableau']) and any('4 erreurs à retrouver, 7 essais (3 essais ratés, le premier offert)' in t and '2,5' in t for t in R['tableau']) and any('Question regagnée : l’accord du verbe' in t and '+1,25' in t for t in R['tableau']) and any('Question ratée : l’imparfait' in t for t in R['tableau']) and any('Note d’autocorrection' in t and '3,75 / 5' in t for t in R['tableau']),
 'phrase_regain':bool(R['phrase']) and 'j’ai regagné 1,25 point en répondant sur l’accord du verbe,' in R['phrase'],
 'suivi_regain':R['suivi']==['dont +1,25 regagné'],
 'export_regain':bool(R['export']) and '"regain": 1.25' in R['export'] and '"sans_regain": 2.5' in R['export'],
 'masquer_rendre':R['liste0']!=R['masquee'] and R['rendue']==R['liste0'],
 'masquer_copie_ouverte':R['ouverte'] is True and R['masquee_ouverte'] is True,
 'depublier':R['depubliee'] is None,
 'propre':all(R[k]==[] for k in ('err1','err2','err3','err4','err5'))}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15f PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
