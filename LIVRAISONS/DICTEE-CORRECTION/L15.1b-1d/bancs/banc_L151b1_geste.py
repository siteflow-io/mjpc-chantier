"""L15.1b-1 — l'analyse des erreurs dans la dictée, par le geste (faux hub du kit, ZZTEST) : les objets au hub à la première ouverture ;
le commentaire par l'écart dans la copie rendue ; une forme acceptée sans commentaire ; Réglages : modifier un commentaire (toutes dictées),
ajouter une paire d'homophones ; la catégorie posée à la correction ; le Bilan des non-reconnus ; la césure relue (100 %)."""
import sys, copy, os, json, re, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; ck=[k for k,v in db['classes'].items() if k==cl or (v or {}).get('nom')==cl][0]
db['classes'][ck]['eleves']=list(db['classes'][ck]['eleves'])+['ZZTEST Analyse']; db.pop('site',None) if isinstance(db.get('site'),dict) and 'analyses' in db['site'] else None
R={}
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1800)
cats=b.lire(p,'site/analyses/categories') or {}; R['objets']=(len(cats),sorted({c.get('origine') for c in cats.values()}),bool(b.lire(p,'site/analyses/homophones/hom-ce-ceux')))
toks=p.evaluate("(t)=>tokenize(t)",db['correction_dictee'][D3]['config']['text'])
iN=toks.index('naturellement'); iC=toks.index('centre')
p.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/results/zztest_analyse'%D3,{'errors':[{'idx':iN,'type':'L','word':'naturellement','fautif':'naturelement'},{'idx':iC,'type':'G','word':'centre','fautif':'centres'},{'idx':1,'type':'L','word':toks[1],'fautif':'Devint','sansCout':True,'motif':'acceptee'}],'extras':[],'note':8.5,'deduction':1.5,'counts':{'G':1,'L':1},'timestamp':NOW-3600000,'amenagee':False}])
p.wait_for_timeout(500)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
def copie():
    p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(400); p.locator('button.tab:has-text("Copies")').first.click(); p.wait_for_timeout(900)
    p.locator('button',has_text='Analyse').first.click(); p.wait_for_timeout(900)
    with p.expect_download() as dl: p.locator('button:has-text("Télécharger cette copie")').first.click()
    t=open(dl.value.path(),encoding='utf-8').read(); return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',t))
t1=copie()
R['copie']=('Tu as écrit « naturelement » : attention au l, simple ou double : « naturellement ».' in t1,'Mot long — décompose-le en syllabes : na·tu·rel·lement.' in t1,'Tu as écrit « centres » : le -s est en trop, ici le mot est au singulier : « centre ».' in t1,'Devint' in t1 and 'Compare lettre à lettre' not in t1.split('Devint')[-1][:200])
# Réglages : le commentaire de « Consonne double », pour toutes les dictées
p.get_by_role('button',name='Réglages',exact=True).first.click(); p.wait_for_timeout(900)
R['reglages_presentes']=p.evaluate("()=>[...document.querySelectorAll('#carte-commentaires-l151 .categorie-l151')].filter(e=>!e.closest('details')).map(e=>e.dataset.id)")   # [accordé à L15.1b-1d] la liste de la maquette T474 (les autres catégories repliées)
p.locator('#carte-commentaires-l151 .categorie-l151[data-id="cat-consonne-double"]').first.click(); p.wait_for_timeout(300)   # [accordé à L15.1b-1d] choisir, réécrire, « Enregistrer »
p.locator('#texte-l151').fill('« {forme} » : regarde bien la consonne double ({lettre}) : « {mot} ».'); p.locator('#enregistrer-commentaire-l151').click(); p.wait_for_timeout(900)
R['hub_commentaire']=(b.lire(p,'site/analyses/categories/cat-consonne-double') or {}).get('commentaire')
if CAP: p.screenshot(path=CAP+'/L151-reglages.png')
p.locator('#hom-a-l151').fill('peint'); p.locator('#hom-b-l151').fill('pain'); p.locator('#hom-regle-l151').fill('« peint » vient de peindre ; « pain » se mange.'); p.locator('#hom-ajouter-l151').click(); p.wait_for_timeout(900)
R['hub_homophone']=b.lire(p,'site/analyses/homophones/hom-peint-pain')
t2=copie(); R['copie_suit']='« naturelement » : regarde bien la consonne double (l) : « naturellement ».' in t2
# la catégorie posée à la correction (mode rapide, une G recopiée)
p.locator('button.tab:has-text("Correction")').first.click() if p.locator('button.tab:has-text("Correction")').count() else None; p.wait_for_timeout(600)
p.get_by_role('button',name='Pilotage',exact=True).first.click() if p.get_by_role('button',name='Pilotage',exact=True).count() else None; p.wait_for_timeout(400)
p.locator('button.tab:has-text("Correction")').first.click(); p.wait_for_timeout(800)
p.evaluate("()=>{const b=document.querySelector('button[title=\"Retour à la grille des élèves\"]');if(b)b.click()}"); p.wait_for_timeout(600)

p.locator('.eleve-card').first.click(); p.wait_for_timeout(900)   # un élève de la grille (sa copie s'ouvre en mode texte)
iP=toks.index('préoccupations'); p.evaluate("(i)=>document.querySelector('.word-grid button.word-btn[data-word-idx=\"'+i+'\"]').click()",iP); p.wait_for_timeout(400); p.keyboard.press('g'); p.wait_for_timeout(300); p.keyboard.type('préoccupation'); p.keyboard.press('Enter'); p.wait_for_timeout(1500)
e=[x for c in (b.lire(p,'correction_dictee/%s/results'%D3) or {}).values() if isinstance(c,dict) for x in (c.get('errors') or []) if x and x.get('idx')==iP and x.get('fautif')=='préoccupation']
R['categorie_posee']=e[0].get('categorie') if e else None
# le Bilan
p.keyboard.press('Escape'); p.wait_for_timeout(200); p.evaluate("()=>{const b=document.querySelector('button[title=\"Retour à la grille des élèves\"]');if(b)b.click()}"); p.wait_for_timeout(600)
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(400); p.locator('button.tab:has-text("Bilan")').first.click(); p.wait_for_timeout(900)
R['bilan']=p.evaluate("()=>{const e=document.querySelector('#carte-non-reconnus-l151 summary');return e?e.innerText:null}")
# la césure relue (le rapport L15.1a, avec les 4 corrections de la relecture) : 100 %
liste=json.load(open('cesure_relue_L151.json'))
res=p.evaluate("(l)=>l.map(x=>[x[0],cesureL151(x[0]),x[1]])",liste); fausses=[r for r in res if r[1]!=r[2]]
R['cesure']=(len(res),len(fausses),fausses[:12])
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'objets_au_hub':R['objets'][0]>=40 and R['objets'][1]==['livré'] and R['objets'][2],
 'copie_commentaires':R['copie']==[True,True,True,True],
 'reglages_presentes':'cat-consonne-double' in R['reglages_presentes'] and 'cat-pluriel-en-trop' in R['reglages_presentes'],
 'commentaire_au_hub':R['hub_commentaire']=='« {forme} » : regarde bien la consonne double ({lettre}) : « {mot} ».',
 'copie_suit_le_commentaire':R['copie_suit'] is True,
 'homophone_ajoute':bool(R['hub_homophone']) and R['hub_homophone'].get('a')=='peint',
 'categorie_posee':R['categorie_posee']=='cat-pluriel-manquant',
 'bilan':bool(R['bilan']) and 'sans commentaire reconnu' in R['bilan'],
 'cesure_100':R['cesure'][1]==0,
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15.1b-1 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
