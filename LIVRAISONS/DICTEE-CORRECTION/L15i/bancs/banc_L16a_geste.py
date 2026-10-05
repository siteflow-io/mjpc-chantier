"""L16a — mode rapide : la liste par type, la bascule, « Changer → » vers l'autre type, Suppr, la ligne centrée. Par le geste, faux hub du kit
(la 5e « rêvaient » : formes G et L), ZZTEST."""
import sys, copy, os, json, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D='dictee_5e_chapitre_utopie-5e_herge'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D]['config']['classe']
reg=[k for k,v in db['classes'].items() if k==cl or (v or {}).get('nom')==cl]; ck=reg[0] if reg else cl
db['classes'][ck]['eleves']=list(db['classes'][ck]['eleves'])+['ZZTEST Lima']
G_SEUL={'rêvait','révais','rêver','rêvée'}; L_SEUL={'révaient','rêveaient'}; LES_DEUX={'revaient'}
R={}
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1500)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('chapitre utopie')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(4000)
p.locator('.eleve-card',has_text='Z. Lima').first.click(); p.wait_for_timeout(900); p.keyboard.press('Shift+R'); p.wait_for_timeout(1000)
mot=lambda: p.evaluate("()=>{const e=document.querySelector('.fast-word');return e?e.childNodes[0].textContent.trim():null}")
def k(t,att=350): p.keyboard.press(t); p.wait_for_timeout(att)
# la ligne centrée, sur 16 mots d'affilée
ecarts=[];bouts=[]
for _ in range(16):
    ecarts.append(p.evaluate("()=>{const a=document.querySelector('.fast-word'),b=document.querySelector('.ctx-mot-l16');if(!a||!b)return 999;const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();return Math.abs((ra.left+ra.width/2)-(rb.left+rb.width/2))}"))
    bouts.append(p.evaluate("()=>{const t=document.querySelector('.ctx-centree-l16');return t?[t.innerText.trim().startsWith('…'),t.innerText.trim().endsWith('…')]:null}"))
    k(' ',120)
R['ecart_max']=round(max(ecarts),2); R['bouts_milieu']=bouts[-1]
if CAP: p.screenshot(path=CAP+'/L16a-ligne.png')
n=0
while mot()!='rêvaient' and n<400: k(' ',40); n+=1
hub=lambda: [(e['idx'],e['type'],e.get('fautif')) for e in (b.lire(p,'correction_dictee/%s/results/zztest_lima'%D) or {}).get('errors',[]) if e]
liste=lambda: [re.sub(r'^\d+\s+','',' '.join(t.split())).split(' ×')[0] for t in p.locator('.liste-formes .forme').all_inner_texts()]
k('g',500); R['liste_G']=liste()
if CAP: p.screenshot(path=CAP+'/L16a-liste-G.png')
k('Numpad1',700); R['pave_G']=hub()[-1:]
k('Backspace'); k('l',500); R['liste_L']=liste(); k('Escape'); k('Escape')
# la bascule : une forme vue en L seulement, tapée en G
k('g'); p.keyboard.type('révaient'); k('Enter',600)
R['bascule']=p.evaluate("()=>{const e=document.getElementById('bascule-l16');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
if CAP: p.screenshot(path=CAP+'/L16a-bascule.png')
p.locator('#passer-type-l16').click(); p.wait_for_timeout(700); R['passer_L']=(hub()[-1:],mot()!='rêvaient')
k('Backspace'); k('g'); p.keyboard.type('rêveaient'); k('Enter',600); R['bascule2']=p.locator('#bascule-l16').count()
p.locator('#garder-type-l16').click(); p.wait_for_timeout(700); R['garder_G']=hub()[-1:]
k('Backspace'); k('g'); p.keyboard.type('revaient'); k('Enter',600); R['les_deux']=(p.locator('#bascule-l16').count(),hub()[-1:])
# mot marqué G : « Changer → » vers L seulement
k('Backspace',500); R['changer']=p.evaluate("()=>[...document.querySelectorAll('button.fast-btn')].map(b=>b.innerText.trim()).filter(t=>t.startsWith('Changer'))")
# Suppr hors champ : l'erreur annulée, on avance
n0=len(hub()); k('Delete',700); R['suppr']=(len(hub()),n0,mot()!='rêvaient')
# Suppr dans le champ : un caractère effacé
k('Backspace'); k('g'); p.keyboard.type('abc'); k('Home',100); k('Delete',200); R['suppr_champ']=p.evaluate("()=>document.activeElement&&document.activeElement.value")
k('Escape'); k('Escape')
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'ligne_centree_16_mots':R['ecart_max']<=2,'points_de_suite':R['bouts_milieu']==[True,True],
 'liste_G_seulement':bool(R['liste_G']) and set(R['liste_G'])<=G_SEUL|LES_DEUX and not set(R['liste_G'])&L_SEUL,
 'pave_dans_la_liste_G':bool(R['pave_G']) and R['pave_G'][0][1]=='G' and R['pave_G'][0][2]==R['liste_G'][0],
 'liste_L_seulement':bool(R['liste_L']) and set(R['liste_L'])<=L_SEUL|LES_DEUX and not set(R['liste_L'])&G_SEUL,
 'bascule':R['bascule']=='« révaient » a déjà été enregistrée en L (×4). Passer en L ? Passer en L Garder G',
 'passer_en_L':R['passer_L'][0][0][1:]==['L','révaient'] and R['passer_L'][1] is True,
 'garder_G':R['bascule2']==1 and R['garder_G'][0][1:]==['G','rêveaient'],
 'forme_des_deux_rien':R['les_deux'][0]==0 and R['les_deux'][1][0][1:]==['G','revaient'],
 'changer_vers_l_autre':R['changer']==['Changer → L'],
 'suppr':R['suppr'][0]==R['suppr'][1]-1 and R['suppr'][2] is True,
 'suppr_dans_le_champ':R['suppr_champ']=='bc',
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L16a PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
