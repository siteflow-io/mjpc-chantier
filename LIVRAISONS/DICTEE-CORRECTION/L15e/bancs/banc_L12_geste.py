"""L12 — l'aide « ? » qui suit l'écran : ? / F1 / Échap, rien ne fuit, « i » seul pour Illisible, le bouton sur tous les écrans du professeur,
le contenu de chaque endroit (et qui change quand l'écran change), et chaque touche annoncée vérifiée par une pression. Faux hub du kit, ZZTEST."""
import sys, copy, os, json, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Oscar','ZZTEST Papa']
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
def aide(): return p.evaluate("()=>{const o=document.getElementById('aide-ou');const t=document.getElementById('aide-table');return o?[o.innerText,[...t.querySelectorAll('td.k')].map(x=>x.innerText)]:null}")
def ferme(): return p.locator('#aide-voile').count()==0
def hub(k='zztest_oscar'): r=b.lire(p,'correction_dictee/%s/results/%s'%(D3,k)) or {}; return [(e['idx'],e['type']) for e in (r.get('errors') or []) if e]
def mode(): return p.evaluate("()=>document.querySelector('.fast-word')?(document.querySelector('.liste-formes,input[placeholder^=\"Mot fautif\"],input[placeholder^=\"recopie\"]')?'case':'rapide'):(document.querySelector('.word-grid')?'texte':'autre')")
def fastmot(): return p.evaluate("()=>{const e=document.querySelector('.fast-word');return e?e.childNodes[0].textContent.trim():null}")
def k(t,att=400): p.keyboard.press(t); p.wait_for_timeout(att)
# 1. l'accueil
R['accueil_bouton']=p.locator('#aide-btn').count()==1; k('?'); R['accueil']=aide()
if CAP: p.screenshot(path=CAP+'/L12-accueil.png')
k('Escape'); R['accueil_ferme']=ferme()
# 2. la grille ; l'aide qui change quand l'écran change (l'onglet Rapide ouvert sous l'aide)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2600)
R['grille_bouton']=p.locator('#aide-btn').count()==1; R['barre_sans_vieux_point']=p.locator('.nav2-aide').count()==0
k('F1'); R['grille']=aide()
p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Rapide')&&x.className.includes('tab'));if(b)b.click()}"); p.wait_for_timeout(1200)
R['change_sans_fermer']=aide(); k('Escape'); R['change_ferme']=ferme()
p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Correction');if(b)b.click()}"); p.wait_for_timeout(900)
if p.locator('.eleve-card').count()==0: p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)   # [accordé au micro L15c-d] l'onglet Rapide a posé une copie : on revient à la grille
# 3. une copie : le mode texte (menu fermé / ouvert), une couche à la fois
p.locator('.eleve-card',has_text='Z. Oscar').first.click(); p.wait_for_timeout(900)
k('?'); R['texte']=aide()
if CAP: p.screenshot(path=CAP+'/L12-texte.png')
k('g'); R['rien_ne_fuit_texte']=(p.evaluate("()=>!document.getElementById('bande-recherche')"),aide() is not None); k('Escape')
p.locator('.word-grid button.word-btn[data-word-idx="3"]').click(); p.wait_for_timeout(300); k('?'); R['texte_menu']=aide()
k('Escape'); R['une_couche']=(ferme(),p.locator('.popup-btn-g').count()>0)
for t in ('g',): pass
k('m',600); R['menu_M']=hub()[-1:]
p.locator('.word-grid button.word-btn[data-word-idx="4"]').click(); p.wait_for_timeout(300); k('i',600); R['menu_I']=hub()[-1:]
p.locator('.word-grid button.word-btn[data-word-idx="5"]').click(); p.wait_for_timeout(300); k('a',600); R['menu_A']=hub()[-1:]
p.locator('.word-grid button.word-btn[data-word-idx="6"]').click(); p.wait_for_timeout(300); k('Escape'); R['menu_Echap']=p.locator('.popup-btn-g').count()==0
p.locator('.word-grid button.word-btn[data-word-idx="7"]').click(); p.wait_for_timeout(300); k('l'); R['menu_L_case']=p.locator('input[placeholder^="Mot fautif"]').count()>0; k('Escape')
# 4. le mode rapide : chaque touche annoncée, « ? » n'est plus Illisible, rien ne fuit
k('Shift+R',900); R['shiftR']=mode()
m0=fastmot(); k(' '); m1=fastmot(); k('Enter'); m2=fastmot(); k('Backspace'); m3=fastmot(); R['espace_entree_retour']=(m0!=m1,m1!=m2,m3==m1)
n=len(hub()); k('?'); R['rapide']=aide()
if CAP: p.screenshot(path=CAP+'/L12-rapide.png')
k('g'); R['rien_ne_fuit_rapide']=(mode()!='case',len(hub())==n); k('Escape'); R['pas_illisible']=(len(hub())==n)
k('i',500); R['i_illisible']=hub()[-1:]
k('a',500); R['a_attention']=hub()[-1:]
k('m',500); R['m_manquant']=hub()[-1:]
k('g'); R['g_case']=mode(); k('F1'); R['case']=aide()
if CAP: p.screenshot(path=CAP+'/L12-case.png')
k('Escape'); R['case_reste']=(ferme(),mode()=='case')
p.keyboard.type('a?'); p.wait_for_timeout(300); R['point_interrogation_dans_la_case']=(p.evaluate("()=>document.activeElement&&document.activeElement.value"),ferme())
k('Escape'); k('Escape'); k('l'); R['l_case']=mode(); k('Escape')
k('Shift+R',900); R['retour_texte']=mode()
k('Shift+R',900)
# 5. la fin de copie
p.locator('button:has-text("Terminer →")').first.click(); p.wait_for_timeout(700); k('F1'); R['fin']=aide()
if CAP: p.screenshot(path=CAP+'/L12-fin.png')
k('Escape')
# 6. Préparation, ses sous-écrans ; Réglages ; Données ; l'onglet « Nouveautés »
p.evaluate("()=>{const f=document.activeElement;if(f&&f.blur)f.blur()}"); k('Shift+R',900)
R['copie_bouton']=p.locator('#aide-btn').count()==1
p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(900)
p.get_by_role('button',name='Pilotage',exact=True).first.click(); p.wait_for_timeout(500)
p.get_by_role('button',name='Préparation',exact=True).first.click(); p.wait_for_timeout(1200); k('?'); R['preparation']=aide(); k('Escape')
p.locator('#btn-formes-acceptees').click(); p.wait_for_timeout(1000); k('?'); R['formes_acceptees']=aide(); k('Escape')
p.locator('#btn-formes-acceptees').click(); p.wait_for_timeout(500)
p.evaluate("()=>{const l=[...document.querySelectorAll('label')].find(x=>x.textContent.includes('version am'));const c=l&&l.querySelector('input[type=checkbox]');if(c)c.click()}"); p.wait_for_timeout(1000)
# (cocher la version aménagée ramène à l'onglet Correction : c'est l'existant ; on revient à la Préparation, où son panneau est ouvert)
if p.get_by_role('button',name='Préparation',exact=True).count(): p.get_by_role('button',name='Préparation',exact=True).first.click()
p.wait_for_timeout(1200); p.evaluate("()=>{const f=document.activeElement;if(f&&f.blur)f.blur()}"); k('F1'); R['amenagee']=aide(); k('Escape')
p.get_by_role('button',name='Réglages',exact=True).first.click(); p.wait_for_timeout(1000); k('?'); R['reglages']=aide(); k('Escape')
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(800); k('?'); R['donnees']=aide()
p.locator('.aide-onglets button:has-text("Nouveautés")').click(); p.wait_for_timeout(600); R['nouveautes']=p.locator('#aide-table').count()==0 and p.locator('#aide-voile').count()==1
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
def ou(x): return x[0] if x else None
conds={'accueil':R['accueil_bouton'] and ou(R['accueil'])=='Accueil — la liste des dictées' and '⧉' in R['accueil'][1] and R['accueil_ferme'],
 'grille':R['grille_bouton'] and R['barre_sans_vieux_point'] and ou(R['grille'])=='Correction — la grille des élèves',
 'change_sans_fermer':ou(R['change_sans_fermer'])=='Mode rapide — sur un mot' and R['change_ferme'],
 'texte':ou(R['texte'])=='Mode texte — le menu fermé' and R['rien_ne_fuit_texte']==[True,True],
 'texte_menu':ou(R['texte_menu'])=='Mode texte — le menu ouvert' and R['une_couche']==[True,True],
 'touches_menu':R['menu_M']==[[3,'M']] and R['menu_I']==[[4,'I']] and R['menu_A']==[[5,'A']] and R['menu_Echap'] and R['menu_L_case'],
 'rapide':ou(R['rapide'])=='Mode rapide — sur un mot' and R['rapide'][1]==['G / L','M (ou /)','i','A','Espace / Entrée','Retour','⇧R','« ▶ Lancer l’autocorrection » (Données → Suivi)','? ou F1'],   # [L13] sa ligne
 'touches_rapide':R['shiftR']=='rapide' and R['espace_entree_retour']==[True,True,True] and R['i_illisible'][0][1]=='I' and R['a_attention'][0][1]=='A' and R['m_manquant'][0][1] in ('M','P','E') and R['g_case']=='case' and R['l_case']=='case' and R['retour_texte']=='texte',
 'rien_ne_fuit_rapide':R['rien_ne_fuit_rapide']==[True,True] and R['pas_illisible'],
 'case':ou(R['case'])=='La case « ce qu’a écrit l’élève »' and R['case_reste']==[True,True] and R['point_interrogation_dans_la_case']==['a?',True],
 'fin':ou(R['fin'])=='Mode rapide — fin de copie',
 'preparation':ou(R['preparation'])=='Préparation' and ou(R['formes_acceptees'])=='Préparation — formes acceptées' and ou(R['amenagee'])=='Préparation — version aménagée',
 'reglages_donnees':ou(R['reglages'])=='Réglages de la dictée' and ou(R['donnees'])=='Données de la dictée' and R['nouveautes'],
 'bouton_sur_la_copie':R['copie_bouton'],
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L12 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
