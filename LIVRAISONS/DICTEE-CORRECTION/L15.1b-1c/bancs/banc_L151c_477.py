"""477 (Paul : oui) — la phrase « À recopier » choisit son engagement d'après l'écart (la catégorie qui va avec le type posé), parmi les engagements déjà écrits. Par le geste : la copie téléchargée."""
import sys, copy, os, json, re, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; ck=[k for k,v in db['classes'].items() if k==cl or (v or {}).get('nom')==cl][0]
db['classes'][ck]['eleves']=list(db['classes'][ck]['eleves'])+['ZZTEST Analyse']
b=Banc(F,1100,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1800)
toks=p.evaluate("(t)=>tokenize(t)",db['correction_dictee'][D3]['config']['text']); iN=toks.index('naturellement'); iC=toks.index('centre'); iP=toks.index('préoccupations')
p.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/results/zztest_analyse'%D3,{'errors':[{'idx':iN,'type':'L','word':'naturellement','fautif':'naturelement'},{'idx':iC,'type':'G','word':'centre','fautif':'centres'},{'idx':iP,'type':'G','word':'préoccupations','fautif':'préocupation'}],'extras':[],'note':7.5,'deduction':2.5,'counts':{'G':2,'L':1},'timestamp':NOW-3600000,'amenagee':False}]); p.wait_for_timeout(500)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(400); p.locator('button.tab:has-text("Copies")').first.click(); p.wait_for_timeout(900)
p.locator('button',has_text='Analyse').first.click(); p.wait_for_timeout(900)
with p.expect_download() as dl: p.locator('button:has-text("Télécharger cette copie")').first.click()
html=open(dl.value.path(),encoding='utf-8').read()
q=b.ctx.new_page() if hasattr(b,'ctx') else p.context.new_page(); q.set_content(html); q.wait_for_timeout(800)
el=q.locator('text=Tu as écrit').first; el.scroll_into_view_if_needed(); q.wait_for_timeout(300)
CAP=os.environ.get('CAPTURES','')
if CAP: q.locator('text=À recopier').first.scroll_into_view_if_needed(); q.screenshot(path=CAP+'/L151c-recopier.png')
txt=re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',html)); i=txt.find('À recopier'); phrase=txt[i:i+400]
print(json.dumps({'phrase':phrase},ensure_ascii=False))
ok=('je devrai accorder chaque mot avec le déterminant pluriel qui le précède' in phrase) and ('imparfait' not in phrase) and b.erreurs==[]
print('BANC 477 PAR LE GESTE :','VERT' if ok else 'ROUGE')
b.fermer(); sys.exit(0 if ok else 1)
