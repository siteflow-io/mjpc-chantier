"""L15h-1 — le type C (accent / majuscule / trait d'union), par le geste ; la règle du reclassement ; le forfait Brevet. Faux hub du kit, ZZTEST."""
import sys, copy, os, json, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']
ck=[k for k,v in db['classes'].items() if k==cl or (v or {}).get('nom')==cl][0]; db['classes'][ck]['eleves']=list(db['classes'][ck]['eleves'])+['ZZTEST Cesar']
R={}
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1500)
# la règle (les fonctions de l'app)
R['regle']=p.evaluate("""()=>[['eleve','élève'],['Paris','paris'],['peut-etre','peut-être'],['ce-là','cela'],['facon','façon'],['a','à'],['ou','où'],['elevé','élève'],['élèves','élève'],['sur','sûr'],['','élève']].map(x=>reclassableEnC(x[0],x[1]))""")
# le forfait Brevet : 4 C → 0,5 ; 9 C → 1 ; avec 7 P → plafond 2 (sur 10)
R['brevet']=p.evaluate("""()=>{var C=n=>Array.from({length:n},(x,i)=>({idx:i,type:'C',word:'w'+i,fautif:'x'}));var P=n=>Array.from({length:n},(x,i)=>({idx:100+i,type:'P',word:'p'+i}));
  return [computeNote(C(4),[],10,'brevet').deduction,computeNote(C(9),[],10,'brevet').deduction,computeNote(C(9).concat(P(10)),[],10,'brevet').deduction,computeNote(C(3),[],20,'preparee').deduction]}""")
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
p.locator('.eleve-card',has_text='Z. Cesar').first.click(); p.wait_for_timeout(900)
# mode texte : le menu, l'entrée C
p.locator('.word-grid button.word-btn[data-word-idx="1"]').click(); p.wait_for_timeout(400); R['menu_c']=p.locator('#popup-c-l15h').inner_text().replace('\n',' ')
p.keyboard.press('c'); p.wait_for_timeout(400); p.keyboard.type('Devint'); p.keyboard.press('Enter'); p.wait_for_timeout(1500)
hub=lambda: [(e['idx'],e['type'],e.get('fautif')) for e in (b.lire(p,'correction_dictee/%s/results/zztest_cesar'%D3) or {}).get('errors',[]) if e]
R['texte_pose_c']=hub()
# mode rapide : la touche C et le bouton
p.keyboard.press('Shift+R'); p.wait_for_timeout(1000)
for _ in range(2): p.keyboard.press(' '); p.wait_for_timeout(150)
R['bouton_c']=p.locator('#fast-c-l15h').count()   # sur un mot sans erreur
p.keyboard.press('c'); p.wait_for_timeout(400); p.keyboard.type('Xy'); p.keyboard.press('Enter'); p.wait_for_timeout(1500)
R['rapide_pose_c']=hub()
if CAP: p.screenshot(path=CAP+'/L15h-rapide.png')
fe=b.lire(p,'correction_dictee_erreurs') or {}
R['objets_l10_c']=sorted(set((o.get('type'),o.get('forme')) for o in fe.values() if isinstance(o,dict) and o.get('type')=='C')) if fe else []
# la copie de l'élève (l'aperçu = le fichier exporté) : la légende en mots simples
p.locator('button:has-text("← Texte")').first.click() if p.locator('button:has-text("← Texte")').count() else None; p.wait_for_timeout(600)
p.locator('button:has-text("Retour à la grille"), button[title="Retour à la grille des élèves"]').first.click() if p.locator('button[title="Retour à la grille des élèves"]').count() else None; p.wait_for_timeout(600)
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(500); p.locator('button.tab:has-text("Copies")').first.click(); p.wait_for_timeout(1000)
p.locator('button',has_text='Cesar').first.click(); p.wait_for_timeout(1200)
p.locator('button.tab:has-text("Fiches élèves")').first.click(); p.wait_for_timeout(1200)
p.evaluate("()=>{window.prompt=()=> 'ZZTEST Cesar'}")   # « Une fiche » demande le nom de l'élève
with p.context.expect_page(timeout=8000) as np: p.locator('button:has-text("Une fiche")').first.click()   # la fiche s'ouvre dans un nouvel onglet
fiche=np.value; fiche.wait_for_timeout(1500); txt=fiche.locator('body').inner_text()   # la fiche de l'élève : le libellé de chaque erreur
if CAP: fiche.screenshot(path=CAP+'/L15h-fiche.png')
v=txt[txt.find('Correction'):]; R['eleve']=('MAJUSCULE' in v.upper() and 'ACCENT' in v.upper(), any(w in v.lower() for w in ('type c','illisible')))   # le verso, en capitales ; rien de technique
if CAP: p.screenshot(path=CAP+'/L15h-copie.png')
R['erreurs']=b.erreurs[:3]; b.fermer()
R['erreurs2']=[]
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'regle':R['regle']==[True,True,True,True,False,False,False,True,False,False,False],   # « elevé » pour « élève » : l'accent mal placé, seul : C
 'brevet_forfait':R['brevet']==[0.5,1,2,1.5],
 'menu_c':'C' in R['menu_c'] and 'Accent' in R['menu_c'],
 'texte_pose_c':any(t=='C' and f=='Devint' for _,t,f in R['texte_pose_c']),
 'rapide_bouton_touche':R['bouton_c']==1 and any(t=='C' and f=='Xy' for _,t,f in R['rapide_pose_c']),
 'objets_l10_c':len(R['objets_l10_c'])>=1,
 'eleve_mots_simples':R['eleve']==[True,False],
 'propre':R['erreurs']==[] and R['erreurs2']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15h-1 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
