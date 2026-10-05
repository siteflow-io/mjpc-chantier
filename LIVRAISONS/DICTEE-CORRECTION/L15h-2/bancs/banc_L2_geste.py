"""L2 — ⇧R est une bascule, sur la même copie, sans perte. Par le geste (clics réels, touches réelles), faux hub du kit, ZZTEST."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Mike','ZZTEST November']
R={}
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d:(dlg.append(d.message[:90]),d.dismiss()))
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
def ouvrir(n): p.locator('.eleve-card',has_text=n).first.click(); p.wait_for_timeout(900)
def marque(i,t,mot=None):
    p.locator('.word-grid button.word-btn[data-word-idx="%d"]'%i).click(); p.wait_for_timeout(200); p.locator('.popup-btn-'+t).first.click(); p.wait_for_timeout(200)
    if t in 'gl': p.keyboard.type(mot or 'zzx'); p.keyboard.press('Enter'); p.wait_for_timeout(250)
def hub(k): r=b.lire(p,'correction_dictee/%s/results/%s'%(D3,k)) or {}; return [(e['idx'],e['type']) for e in (r.get('errors') or []) if e]
def mode(): return p.evaluate("()=>document.querySelector('.fast-word')?'rapide':(document.querySelector('.word-grid')?'texte':'autre')")
def eleve():
    t=p.evaluate("()=>document.body.innerText"); noms=[n for n in db['classes'][cl]['eleves'] if isinstance(n,str) and n in t]
    return max(noms,key=len) if noms else None
def bascule(): p.keyboard.press('Shift+R'); p.wait_for_timeout(900); return (mode(),eleve())
ouvrir('Z. Mike'); marque(3,'g','fautt'); marque(7,'l','lexik'); R['texte_0']=(mode(),eleve(),hub('zztest_mike'))
R['aller_1']=bascule()+(hub('zztest_mike'),)
p.keyboard.press('i'); p.wait_for_timeout(400); R['rapide_1']=hub('zztest_mike')
R['retour_1']=bascule()+(hub('zztest_mike'),)
marque(9,'m'); R['texte_1']=hub('zztest_mike')
R['aller_2']=bascule(); R['retour_2']=bascule(); R['aller_3']=bascule()
if CAP: p.screenshot(path=CAP+'/L2-rapide.png')
R['retour_3']=bascule()+(hub('zztest_mike'),)
if CAP: p.screenshot(path=CAP+'/L2-texte.png')
R['texte_final']=p.evaluate("()=>{const t=document.body.innerText;const i=t.indexOf('🔀');return i>0?t.slice(0,i).replace(/\\n/g,' '):''}")
# ⇧R dans un champ de saisie : rien ne bascule, la lettre s'écrit
p.locator('.word-grid button.word-btn[data-word-idx="11"]').click(); p.wait_for_timeout(200); p.locator('.popup-btn-g').first.click(); p.wait_for_timeout(200)
p.keyboard.type('aR'); p.wait_for_timeout(500); R['champ']=(mode(),p.evaluate("()=>{const i=document.activeElement;return i&&i.tagName==='INPUT'?i.value:null}")); p.keyboard.press('Enter'); p.wait_for_timeout(400)
# l'onglet Rapide ouvert depuis la grille (aucune copie) : ⇧R ramène la copie qu'il montrait, en mode texte
p.locator('button:has-text("←")').first.click(); p.wait_for_timeout(600)
p.get_by_text('⚡ Rapide').first.click(); p.wait_for_timeout(900); R['onglet_rapide']=(mode(),eleve())
R['onglet_retour']=bascule()
R['fenetres']=dlg; R['erreurs']=b.erreurs[:3]
print(json.dumps(R,ensure_ascii=False))
attendu=[(3,'G'),(7,'L')]
ok=(R['texte_0'][0]=='texte' and R['texte_0'][2]==attendu
    and R['aller_1'][:2]==('rapide','ZZTEST Mike') and R['aller_1'][2]==attendu
    and R['rapide_1']==[(3,'G'),(7,'I')] and R['retour_1'][:2]==('texte','ZZTEST Mike') and R['retour_1'][2]==[(3,'G'),(7,'I')]   # [accordé à L15-0b, dette 124] ⇧R ouvre le rapide sur le mot où l'on est (le 7), « i » le marque
    and len(R['texte_1'])==3 and R['aller_2']==('rapide','ZZTEST Mike') and R['retour_2']==('texte','ZZTEST Mike') and R['aller_3']==('rapide','ZZTEST Mike')
    and R['retour_3'][:2]==('texte','ZZTEST Mike') and R['retour_3'][2]==R['texte_1']
    and R['champ']==('texte','aR') and R['onglet_rapide'][0]=='rapide' and R['onglet_rapide'][1] and R['onglet_retour']==('texte',R['onglet_rapide'][1])
    and R['fenetres']==[] and R['erreurs']==[])
print('BANC L2 PAR LE GESTE :','VERT' if ok else 'ROUGE'); b.fermer(); sys.exit(0 if ok else 1)
