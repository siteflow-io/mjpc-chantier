"""L9 — l'identité des copies (posée à la création, une fois pour les anciennes, modifieLe à chaque enregistrement), la date de correction
réglée dans Réglages et vue par l'élève (liste et feuille), le « Non » du bandeau et l'échange qui ne le réveille plus.
Par le geste, faux hub du kit, ZZTEST."""
import sys, copy, os, json, time, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
T0=1700000000000   # 14/11/2023
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Yankee','ZZTEST Notime','ZZTEST Zulu','ZZTEST Echo','ZZTEST Tango']
res=db['correction_dictee'][D3]['results']
res['zztest_notime']={'errors':[{'idx':0,'type':'G','word':'Marguerite'}],'extras':[],'note':9,'deduction':1,'counts':{'G':1},'amenagee':False}
res['zztest_zulu']={'errors':[{'idx':1,'type':'L','word':'devint','fautif':'devin'}],'extras':[],'note':9.5,'deduction':.5,'counts':{'L':1},'timestamp':T0,'amenagee':False}
# Echo et Tango n'ont plus de copie : le bandeau ne s'affiche que pour une copie absente (mesuré : effacee = pas de copie ? la dernière effacée : rien)
cb='corbeille/2026-10-01/zz_echange'; db.setdefault('corbeille',{}).setdefault('2026-10-01',{})['zz_echange']={'_meta':{'motif':'copie-echanger'},'data':{'results':res['zztest_zulu']}}
db['correction_dictee'][D3]['effacees']={'zztest_echo':{'1759300000000':{'chemin':cb,'geste':'echanger','le':1759300000000,'note':9.5}},
                                         'zztest_tango':{'1759300000001':{'chemin':cb,'geste':'transferer','le':1759300000001,'note':9.5}}}
sans_id=sum(1 for r in res.values() if isinstance(r,dict) and not r.get('id'))
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
def ouvrir_dictee():
    p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2800)
def hubr(): return b.lire(p,'correction_dictee/%s/results'%D3) or {}
ouvrir_dictee()
h1=hubr(); R['ligne']=p.evaluate("()=>{const e=document.getElementById('ligne-identites');return e?e.innerText:null}")
R['identites']=(sans_id,sum(1 for r in h1.values() if isinstance(r,dict) and str(r.get('id','')).startswith('copie_')),len(h1))
R['notime']=(h1['zztest_notime'].get('creeLeInconnu'),h1['zztest_notime'].get('creeLe')); R['zulu']=h1['zztest_zulu'].get('creeLe')
p.locator('button:has-text("← Retour")').first.click(); p.wait_for_timeout(1200); ouvrir_dictee()
h2=hubr(); R['une_fois']=(all(h2[k].get('id')==h1[k].get('id') for k in h1 if isinstance(h1[k],dict)), p.evaluate("()=>!document.getElementById('ligne-identites')"))
# une copie neuve : id, creeLe, modifieLe ; modifieLe avance à chaque geste (texte, puis rapide)
p.locator('.eleve-card',has_text='Z. Yankee').first.click(); p.wait_for_timeout(900)
def marque(i,t,m):
    p.locator('.word-grid button.word-btn[data-word-idx="%d"]'%i).click(); p.wait_for_timeout(200); p.locator('.popup-btn-'+t).first.click(); p.wait_for_timeout(200); p.keyboard.type(m); p.keyboard.press('Enter'); p.wait_for_timeout(500)
def y(): return b.lire(p,'correction_dictee/%s/results/zztest_yankee'%D3) or {}
marque(3,'g','zz'); a1=y(); time.sleep(.05); marque(7,'l','zzl'); a2=y()
p.keyboard.press('Shift+R'); p.wait_for_timeout(900); p.keyboard.press('i'); p.wait_for_timeout(600); a3=y()
R['neuve']=(str(a1.get('id','')).startswith('copie_'),a1.get('creeLe') is not None,a1.get('modifieLe') is not None)
R['avance']=(a2.get('id')==a1.get('id'),a2.get('creeLe')==a1.get('creeLe'),a2.get('modifieLe',0)>a1.get('modifieLe',0),a3.get('id')==a1.get('id'),a3.get('modifieLe',0)>a2.get('modifieLe',0))
p.keyboard.press('Shift+R'); p.wait_for_timeout(800)
# le bandeau : un effacement (réinitialiser) → bandeau ; « Non » → fermé, ne revient pas, la corbeille garde la version
p.locator('button:has-text("↻")').first.click(); p.wait_for_timeout(1500)
p.locator('button:has-text("← Retour")').first.click() if p.locator('.eleve-card').count()==0 else None; p.wait_for_timeout(300)
if p.locator('.eleve-card',has_text='Z. Yankee').count()==0: p.locator('button[title*="grille"],button:has-text("←")').first.click(); p.wait_for_timeout(800)
p.locator('.eleve-card',has_text='Z. Yankee').first.click(); p.wait_for_timeout(900)
R['bandeau']=p.evaluate("()=>!!document.getElementById('bandeau-non')")
if CAP: p.screenshot(path=CAP+'/L9-bandeau.png')
p.locator('#bandeau-non').click() if R['bandeau'] else None; p.wait_for_timeout(700)
ef=b.lire(p,'correction_dictee/%s/effacees/zztest_yankee'%D3) or {}; R['ignoree']=[bool(v.get('ignoree')) for v in ef.values()]
R['ferme']=p.evaluate("()=>!document.getElementById('bandeau-non')")
corb=json.dumps(b.lire(p,'corbeille') or {}); R['corbeille_garde']=all(v.get('chemin','').split('/')[-1] in corb for v in ef.values())
p.locator('button[title*="grille"],button:has-text("←")').first.click(); p.wait_for_timeout(800); p.locator('.eleve-card',has_text='Z. Yankee').first.click(); p.wait_for_timeout(900)
R['ne_revient_pas']=p.evaluate("()=>!document.getElementById('bandeau-non')")
p.locator('button[title*="grille"],button:has-text("←")').first.click(); p.wait_for_timeout(800)
p.locator('.eleve-card',has_text='Z. Echo').first.click(); p.wait_for_timeout(900); R['echange_sans_bandeau']=p.evaluate("()=>!document.getElementById('bandeau-non')")
p.locator('button[title*="grille"],button:has-text("←")').first.click(); p.wait_for_timeout(800)
p.locator('.eleve-card',has_text='Z. Tango').first.click(); p.wait_for_timeout(900); R['transfert_avec_bandeau']=p.evaluate("()=>!!document.getElementById('bandeau-non')")
p.locator('button[title*="grille"],button:has-text("←")').first.click(); p.wait_for_timeout(800)
# Réglages : la date de correction
p.locator('button:has-text("Réglages")').first.click(); p.wait_for_timeout(800)
R['carte']=p.locator('#carte-date-correction').count()==1
if p.locator('#date-correction').count(): p.locator('#date-correction').fill('2026-09-15'); p.wait_for_timeout(600)
R['date_posee']=b.lire(p,'correction_dictee/%s/config/dateCorrection'%D3)
if CAP: p.screenshot(path=CAP+'/L9-reglages.png')
p.locator('#date-premiere').click() if p.locator('#date-premiere').count() else None; p.wait_for_timeout(600); R['date_premiere']=b.lire(p,'correction_dictee/%s/config/dateCorrection'%D3)
hh=hubr(); mins=min((r.get('creeLe') or r.get('timestamp')) for r in hh.values() if isinstance(r,dict) and (r.get('creeLe') or r.get('timestamp')))
R['date_premiere_attendue']=time.strftime('%Y-%m-%d',time.localtime(mins/1000))
R['modifieLe_intact']=hubr()['zztest_zulu'].get('modifieLe')==h1['zztest_zulu'].get('modifieLe')
R['erreurs_prof']=b.erreurs[:3]; b.fermer()
# l'élève : sa liste et sa feuille montrent la date réglée ; aucun champ d'identité à l'écran
def eleve(date):
    d2=copy.deepcopy(db); d2['correction_dictee'][D3]['copyPublishedAt']=int(time.time()*1000); d2['correction_dictee'][D3]['config']['published']=True
    d2['correction_dictee'][D3]['results']['zztest_zulu']=dict(d2['correction_dictee'][D3]['results']['zztest_zulu'],id='copie_zz123',creeLe=T0,modifieLe=T0+5)
    if date: d2['correction_dictee'][D3]['config']['dateCorrection']=date
    d2['correction_dictee'][D3].setdefault('autocorrection',{})['zztest_zulu']={'total':1,'solved':1}   # l'autocorrection finie : la ligne ouvre sa feuille
    b2=Banc(F,1366,768); q=b2.ouvrir('',db=d2,session={'display':'ZZTEST Zulu','classe':cl}); q.wait_for_timeout(1000)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(800); q.locator('button:has-text("1 élève")').first.click(); q.wait_for_timeout(1500)
    liste=q.locator('body').inner_text()
    if CAP and date: q.screenshot(path=CAP+'/L9-eleve-liste.png')
    b2.fermer()
    # la feuille : le lien de la copie (?dictee=…&eleveKey=…&screen=copie), la feuille dans son cadre
    b3=Banc(F,1366,768); q=b3.ouvrir('?dictee=%s&eleveKey=zztest_zulu&screen=copie'%D3,db=d2,session={'display':'ZZTEST Zulu','classe':cl}); q.wait_for_timeout(1200)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(1000)
    if q.locator('button:has-text("1 élève")').count(): q.locator('button:has-text("1 élève")').first.click()
    q.wait_for_timeout(3000)
    src=q.evaluate("()=>{const f=[...document.querySelectorAll('iframe')].map(x=>x.getAttribute('srcdoc')||'').join(' ');return f}")
    txt=src.replace('<br>',' ')
    if CAP and date: q.screenshot(path=CAP+'/L9-eleve-feuille.png')
    b2=b3
    out=(('corrigée le' in liste) and re.findall(r'corrigée le ([\d/]+)',liste)[:1], re.findall(r'Corrigé le ([\d/]+)',txt)[:1], 'copie_zz123' in liste+txt or 'creeLe' in liste+txt or 'modifieLe' in liste+txt, b2.erreurs[:2]); b2.fermer(); return out
R['eleve_date']=eleve('2026-09-15'); R['eleve_sans_date']=eleve(None)
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'identites':bool(R['ligne']) and ('%d copies'%R['identites'][0]) in R['ligne'] and R['identites'][1]==R['identites'][2],
 'creeLeInconnu':R['notime']==[True,None],'creeLe_ancien':R['zulu']==T0,'une_fois':R['une_fois']==[True,True],
 'neuve':R['neuve']==[True,True,True],'modifieLe_avance':R['avance']==[True,True,True,True,True],
 'bandeau_non':R['bandeau'] is True and R['ignoree']==[True] and R['ferme'] is True and R['corbeille_garde'] and R['ne_revient_pas'] is True,
 'echange':R['echange_sans_bandeau'] is True and R['transfert_avec_bandeau'] is True,
 'reglages':R['carte'] and R['date_posee']=='2026-09-15' and R['date_premiere']==R['date_premiere_attendue'] and R['modifieLe_intact'],
 'eleve_date':R['eleve_date'][0]==['15/09/2026'] and R['eleve_date'][1]==['15/09/2026'] and R['eleve_date'][2] is False,
 'eleve_sans_date':R['eleve_sans_date'][0]==['14/11/2023'] and R['eleve_sans_date'][1]==['14/11/2023'] and R['eleve_sans_date'][2] is False,
 'propre':R['erreurs_prof']==[] and R['eleve_date'][3]==[] and R['eleve_sans_date'][3]==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L9 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
