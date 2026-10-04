"""L13b — l'heure close à fin + 10 min ; la session appartient à son heure ; « heure fermée seule » au Suivi et à l'accueil.
Par le geste, faux hub du kit, ZZTEST."""
import sys, copy, os, json, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
NOW=int(time.time()*1000); M=60000
db=copy.deepcopy(L.BASE); d=db['correction_dictee'][D3]; cl=d['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Zulu','ZZTEST Yankee']
d['copyPublishedAt']=NOW; d['config']['published']=True
d['results']['zztest_zulu']={'errors':[{'idx':1,'type':'L','word':'devint','fautif':'devin'}],'extras':[],'note':9.5,'deduction':.5,'counts':{'L':1},'timestamp':NOW-3*3600000,'amenagee':False}
R={}
def eleve(heure,ac=None):
    d2=copy.deepcopy(db); d2['correction_dictee'][D3]['heure']=heure
    d2['correction_dictee'][D3]['autocorrection']={'zztest_zulu':ac or {'attestation':{'t':NOW-3*3600000},'sessionDebut':heure['debut']+M,'results':{'0':False},'attempts':{'0':1},'total':1,'solved':0}}
    b=Banc(F,1366,768); q=b.ouvrir('',db=d2,session={'display':'ZZTEST Zulu','classe':cl}); q.wait_for_timeout(900)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(700); q.locator('button:has-text("1 élève")').first.click(); q.wait_for_timeout(1300)
    q.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); q.wait_for_timeout(1800)
    t=q.locator('body').inner_text(); ban=q.evaluate("()=>{const e=document.getElementById('bandeau-hors-classe');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
    if CAP and heure['fin']==NOW-11*M: q.screenshot(path=CAP+'/L13b-eleve-fin11.png')
    err=b.erreurs[:2]; b.fermer(); return ban,('Clique sur un mot masqué' in t),err
# 1. fin + 5 min, non clôturée : dans l'heure ; 2. fin + 11 : le bandeau
R['fin5']=eleve({'debut':NOW-60*M,'fin':NOW-5*M}); R['fin11']=eleve({'debut':NOW-60*M,'fin':NOW-11*M})
# 3. la même dictée relancée : une session de l'heure d'avant, une heure en cours → il travaille dans l'heure en cours, sans bandeau
R['relance_eleve']=eleve({'debut':NOW-10*M,'fin':NOW+40*M},{'attestation':{'t':NOW-5*3600000},'sessionDebut':NOW-4*3600000,'results':{'0':False},'attempts':{'0':1},'total':1,'solved':0})
# 4. le professeur : deux dictées, la première jamais clôturée (fermée seule), la seconde en cours ; l'accueil et le Suivi
d2=copy.deepcopy(db); d2['correction_dictee'][D3]['heure']={'debut':NOW-120*M,'fin':NOW-70*M,'classe':cl}
J='dictee_zz_jumelle'; d2['correction_dictee'][J]={'config':dict(d2['correction_dictee'][D3]['config'],title='ZZTEST jumelle'),'results':{},'heure':{'debut':NOW-10*M,'fin':NOW+40*M,'classe':cl}}
d2['correction_dictee'][D3]['autocorrection']={'zztest_zulu':{'attestation':{'t':NOW-3*3600000},'sessionDebut':NOW-115*M,'results':{'0':False},'attempts':{'0':1},'total':1,'solved':0}}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=d2); p.wait_for_timeout(1500)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)   # [accordé à L15c-c] les niveaux repliés
R['accueil']=p.evaluate("()=>[...document.querySelectorAll('.heure-fermee-seule')].map(e=>{const l=e.closest('.ligne-dictee-l15c');return (l?l.dataset.id:'?')+' | '+e.innerText})")   # [accordé à L15c-b] la ligne d'une dictée sur deux lignes : on la reconnaît par son identifiant
if CAP: p.screenshot(path=CAP+'/L13b-accueil.png')
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(600); p.locator('button:has-text("Suivi")').first.click(); p.wait_for_timeout(1500)
R['suivi']=p.evaluate("()=>{const e=document.getElementById('heure-fermee-seule');return e?e.innerText:null}")
R['pas_de_popup_depassee']=p.evaluate("()=>!document.body.innerText.includes('Fin de l’heure —')&&!document.body.innerText.includes('L’heure est dépassée')")
if CAP: p.screenshot(path=CAP+'/L13b-suivi.png')
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
import datetime, zoneinfo
hf=datetime.datetime.fromtimestamp((NOW-70*M+10*M)/1000,zoneinfo.ZoneInfo('Europe/Paris')); attendu='heure fermée seule à %d h %02d (non clôturée)'%(hf.hour,hf.minute)   # l'heure de Paris, comme le navigateur du banc
conds={'fin_plus_5_dans_l_heure':R['fin5'][0] is None and R['fin5'][1] is True,
 'fin_plus_11_bandeau':R['fin11'][0]=='🏠 Tu es hors classe : tu as 45 minutes. Il te reste 44 min.',
 'relance_session_a_son_heure':R['relance_eleve'][0] is None and R['relance_eleve'][1] is True,
 'accueil_C1':len(R['accueil'])==1 and R['accueil'][0].startswith(D3+' | ') and attendu in R['accueil'][0],
 'suivi_T4':R['suivi']==attendu and R['pas_de_popup_depassee'],
 'propre':R['erreurs']==[] and R['fin5'][2]==[] and R['fin11'][2]==[] and R['relance_eleve'][2]==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L13b PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
