"""L13 — l'autocorrection attend la première séance (l'écran s'ouvre seul, sans recharger, quand l'heure est lancée) ; hors classe, 45 minutes
par ouverture, le bandeau et son compte, le retour à « Mes dictées » à zéro. Par le geste, faux hub du kit, ZZTEST."""
import sys, copy, os, json, time, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Zulu']
d=db['correction_dictee'][D3]; d['copyPublishedAt']=int(time.time()*1000); d['config']['published']=True; d.pop('heure',None)
d['results']['zztest_zulu']={'errors':[{'idx':1,'type':'L','word':'devint','fautif':'devin'}],'extras':[],'note':9.5,'deduction':.5,'counts':{'L':1},'timestamp':1700000000000,'amenagee':False}
R={}
ATT=["⏳ Ta correction s’ouvrira quand ton professeur lancera la séance.","Tu as lu et coché les consignes. Reste sur cette page : elle s’ouvrira toute seule, sans rien recharger.","← Mes dictées"]
def eleve(dbx):
    b=Banc(F,1366,768); q=b.ouvrir('',db=dbx,session={'display':'ZZTEST Zulu','classe':cl}); q.wait_for_timeout(1000)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(800); q.locator('button:has-text("1 élève")').first.click(); q.wait_for_timeout(1500)
    return b,q
def ouvrir_ligne(q): q.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); q.wait_for_timeout(1500)
# 1. aucune séance : l'attente, mot pour mot ; puis l'heure lancée → l'écran s'ouvre seul, sans recharger
b,q=eleve(copy.deepcopy(db)); ouvrir_ligne(q)
q.locator('input[type=checkbox]').first.check(); q.wait_for_timeout(200); q.locator('button:has-text("Commencer")').first.click(); q.wait_for_timeout(1500)
R['attente']=q.evaluate("()=>{const e=document.getElementById('attente-seance');return e?e.innerText.split('\\n').map(x=>x.trim()).filter(Boolean):null}")
R['attente_seule']=q.evaluate("()=>document.querySelectorAll('.card').length")
R['session_pas_posee']=(b.lire(q,'correction_dictee/%s/autocorrection/zztest_zulu'%D3) or {}).get('sessionDebut')
if CAP: q.screenshot(path=CAP+'/L13-attente.png')
q.evaluate("()=>{window.__marque=42}")
t0=time.time(); q.evaluate("(p)=>db.ref(p).set({debut:Date.now(),fin:Date.now()+55*60000})",'correction_dictee/%s/heure'%D3)
ouvert=False
for _ in range(20):
    q.wait_for_timeout(100)
    if q.locator('#attente-seance').count()==0 and 'Clique sur un mot' in q.locator('body').inner_text(): ouvert=True; break
R['bascule']=(ouvert,round(time.time()-t0,2),q.evaluate("()=>window.__marque===42"))
if CAP: q.screenshot(path=CAP+'/L13-ouverte.png')
q.wait_for_timeout(800); R['session_posee']=bool((b.lire(q,'correction_dictee/%s/autocorrection/zztest_zulu'%D3) or {}).get('sessionDebut'))
R['heure_en_cours_sans_bandeau']=q.locator('#bandeau-hors-classe').count()==0
R['erreurs1']=b.erreurs[:2]; b.fermer()
# 2. une séance close : chaque ouverture, le bandeau ; le compte descend ; à zéro « Mes dictées », la progression gardée
d2=copy.deepcopy(db); now=int(time.time()*1000); d2['correction_dictee'][D3]['heure']={'debut':now-3*3600000,'fin':now-2*3600000,'cloture':now-2*3600000,'clotureA':now-2*3600000}
d2['correction_dictee'][D3]['autocorrection']={'zztest_zulu':{'attestation':{'t':now-3*3600000},'sessionDebut':now-3*3600000,'results':{'0':False},'attempts':{'0':1},'total':1,'solved':0}}
b,q=eleve(d2); ouvrir_ligne(q)
R['bandeau']=q.evaluate("()=>{const e=document.getElementById('bandeau-hors-classe');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
R['pas_d_attente']=q.locator('#attente-seance').count()==0
if CAP: q.screenshot(path=CAP+'/L13-bandeau.png')
q.evaluate("()=>{const n=Date.now;const d0=n();window.__dec=0;Date.now=function(){return n()+window.__dec}}")
q.evaluate("()=>{window.__dec=61000}"); q.wait_for_timeout(11000)
R['bandeau_1min']=q.evaluate("()=>{const e=document.getElementById('bandeau-hors-classe');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
ac_avant=b.lire(q,'correction_dictee/%s/autocorrection/zztest_zulu'%D3)
q.evaluate("()=>{window.__dec=45*60000+1000}"); q.wait_for_timeout(11000)
txt=q.locator('body').inner_text(); R['a_zero']=('Mes dictées' in txt and q.locator('.mesdictees-ligne').count()>0, 'hors classe' in txt)
ac_apres=b.lire(q,'correction_dictee/%s/autocorrection/zztest_zulu'%D3) or {}
R['progression_gardee']=all(json.dumps((ac_apres or {}).get(k),sort_keys=True)==json.dumps((ac_avant or {}).get(k),sort_keys=True) for k in ('results','attempts','solved','total','attestation'))
R['erreurs2']=b.erreurs[:2]; b.fermer()
# 3. non publiée : inchangé
d3=copy.deepcopy(db); d3['correction_dictee'][D3]['copyPublishedAt']=None
b,q=eleve(d3); R['non_publiee']='Disponible après la séance' in q.locator('body').inner_text(); b.fermer()
# 4. le professeur : l'infobulle de « Lancer l'autocorrection », l'aide
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=copy.deepcopy(db)); p.wait_for_timeout(1000)
p.keyboard.press('?'); p.wait_for_timeout(400); R['aide_accueil']=p.evaluate("()=>[...document.querySelectorAll('#aide-table td.k')].some(x=>x.innerText.includes('Lancer l’autocorrection'))"); p.keyboard.press('Escape')
R['erreurs3']=b.erreurs[:2]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'attente_mot_pour_mot':R['attente']==ATT and R['attente_seule']==1 and not R['session_pas_posee'],
 'bascule_seule_sans_recharger':R['bascule'][0] is True and R['bascule'][1]<2 and R['bascule'][2] is True and R['session_posee'],
 'heure_en_cours_sans_bandeau':R['heure_en_cours_sans_bandeau'],
 'bandeau':R['bandeau']=='🏠 Tu es hors classe : tu as 45 minutes. Il te reste 44 min.' and R['pas_d_attente'],
 'compte_descend':R['bandeau_1min']=='🏠 Tu es hors classe : tu as 45 minutes. Il te reste 43 min.',
 'a_zero_mes_dictees':R['a_zero']==[True,False] and R['progression_gardee'],
 'non_publiee':R['non_publiee'],'aide':R['aide_accueil'],
 'propre':R['erreurs1']==[] and R['erreurs2']==[] and R['erreurs3']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L13 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
