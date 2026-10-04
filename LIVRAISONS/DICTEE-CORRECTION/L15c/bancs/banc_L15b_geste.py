"""L15b — la dictée, l'onglet et la copie dans l'adresse ; F5 (rechargement réel de la page) rouvre au même endroit ; « ← Retour » nettoie ;
une adresse tapée ouvre l'écran ; une dictée inexistante → l'accueil. Par le geste, faux hub du kit, ZZTEST."""
import sys, copy, os, json, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
from urllib.parse import urlparse, parse_qs
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Kilo']
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
def q(): u=parse_qs(urlparse(p.url).query); return {k:v[0] for k,v in u.items() if k in ('dictee','onglet','vue','copie','mode')}
def actif(): return p.evaluate("()=>{const t=[...document.querySelectorAll('button.tab.active,button.tab[class*=active]')].map(b=>b.textContent.trim());if(/date de correction/i.test(document.body.innerText)&&!t.length)t.push('Réglages');return t}")   # Réglages n'a pas de sous-onglet : on reconnaît son contenu
def ecran():
    return {'onglets':actif(),'copie':p.evaluate("()=>{const g=document.querySelector('.word-grid');const f=document.querySelector('.fast-word');const n=[...document.querySelectorAll('b,div')].find(x=>x.children.length===0&&/^ZZTEST /.test(x.textContent.trim()));return [g?'texte':(f?'rapide':null),n?n.textContent.trim():null]}")}
def f5(): p.reload(); p.wait_for_timeout(3500)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
R['ouverte']=q()
for nom,clic in (('preparation',lambda: p.get_by_role('button',name='Préparation',exact=True).first.click()),
                 ('suivi',lambda: (p.get_by_role('button',name='Données',exact=True).first.click(),p.wait_for_timeout(500),p.locator('button.tab:has-text("Suivi")').first.click())),
                 ('reglages',lambda: p.get_by_role('button',name='Réglages',exact=True).first.click())):
    clic(); p.wait_for_timeout(1000); avant=(q(),actif()); f5(); R['f5_'+nom]=(avant,q(),actif())
p.get_by_role('button',name='Pilotage',exact=True).first.click(); p.wait_for_timeout(400); p.get_by_role('button',name='Correction',exact=True).first.click(); p.wait_for_timeout(800)
p.locator('.eleve-card',has_text='Z. Kilo').first.click(); p.wait_for_timeout(1000); avant=q(); f5(); R['f5_copie_texte']=(avant,q(),ecran())
if CAP: p.screenshot(path=CAP+'/L15b-f5-copie.png')
p.keyboard.press('Shift+R'); p.wait_for_timeout(1200); avant=q(); f5(); R['f5_copie_rapide']=(avant,q(),ecran())
p.keyboard.press('Shift+R'); p.wait_for_timeout(1000); p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)
p.locator('button:has-text("← Retour")').first.click(); p.wait_for_timeout(1200); R['retour_nettoie']=q()
R['erreurs1']=b.erreurs[:3]; b.fermer()
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof&dictee=%s&onglet=reglages'%D3,db=db); p.wait_for_timeout(3500); R['adresse_tapee']=(q(),actif()); b.fermer()
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof&dictee=dictee_qui_n_existe_pas&onglet=correction',db=db); p.wait_for_timeout(3500); R['inexistante']=(q(),p.evaluate("()=>document.body.innerText.includes('Mes dictées')")); R['erreurs2']=b.erreurs[:2]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
def m(x,**kw): return all(x.get(k)==v for k,v in kw.items())
conds={'adresse_a_l_ouverture':m(R['ouverte'],dictee=D3,onglet='correction',mode='prof') and 'copie' not in R['ouverte'],
 'f5_preparation':m(R['f5_preparation'][0][0],onglet='preparation') and R['f5_preparation'][1]==R['f5_preparation'][0][0] and 'Préparation' in R['f5_preparation'][2],
 'f5_suivi':m(R['f5_suivi'][0][0],onglet='donnees',vue='suivi') and R['f5_suivi'][1]==R['f5_suivi'][0][0] and any('Suivi' in x for x in R['f5_suivi'][2]),
 'f5_reglages':m(R['f5_reglages'][0][0],onglet='reglages') and R['f5_reglages'][1]==R['f5_reglages'][0][0] and 'Réglages' in R['f5_reglages'][2],
 'f5_copie_texte':m(R['f5_copie_texte'][0],onglet='correction',copie='zztest_kilo') and R['f5_copie_texte'][1]==R['f5_copie_texte'][0] and R['f5_copie_texte'][2]['copie']==['texte','ZZTEST Kilo'],
 'f5_copie_rapide':m(R['f5_copie_rapide'][0],onglet='rapide',copie='zztest_kilo') and R['f5_copie_rapide'][1]==R['f5_copie_rapide'][0] and R['f5_copie_rapide'][2]['copie']==['rapide','ZZTEST Kilo'],
 'retour_nettoie':R['retour_nettoie']=={'mode':'prof'},
 'adresse_tapee':'Réglages' in R['adresse_tapee'][1],
 'inexistante_accueil':R['inexistante'][0]=={'mode':'prof'} and R['inexistante'][1] is True,
 'propre':R['erreurs1']==[] and R['erreurs2']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15b PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
