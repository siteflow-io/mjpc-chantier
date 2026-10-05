"""L3 — M s'adapte (mot / signe / apostrophe), P et E retirés, le bouton mis en avant validé par Entrée, la garde du mot juste
(mode rapide et mode texte). Par le geste (touches et clics réels), faux hub du kit, ZZTEST."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Papa']
R={}
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d:(dlg.append(d.message[:90]),d.dismiss()))
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
p.locator('.eleve-card',has_text='Z. Papa').first.click(); p.wait_for_timeout(900)
def hub(): r=b.lire(p,'correction_dictee/%s/results/zztest_papa'%D3) or {}; return [(e['idx'],e['type'],e.get('fautif')) for e in (r.get('errors') or []) if e]
def mot(): return p.evaluate("()=>{const e=document.querySelector('.fast-word');return e?e.childNodes[0].textContent.trim():null}")
def pre(): return p.evaluate("()=>{const e=document.getElementById('fast-preselect');return e?e.textContent:null}")
def touche(k,att=350): p.keyboard.press(k); p.wait_for_timeout(att)
def aller(cible):
    for _ in range(40):
        m=mot()
        if m==cible or (cible=="'" and m in ("'","\u2019")): return True
        touche(' ',150)
    return False
tokens=None
p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
R['debut']=mot(); touche('m'); R['m_sur_mot']=hub()[-1:]
aller('.'); R['pre_point']=pre()
if CAP: p.screenshot(path=CAP+'/L3-preselection.png')
touche('m'); R['entree_sur_point']=hub()[-1:]   # [accordé à L6b : Entrée avance ; M valide le bouton mis en avant]
aller(','); R['pre_virgule']=pre(); touche('m'); R['m_sur_virgule']=hub()[-1:]
aller("'"); R['pre_apostrophe']=pre(); touche('m'); R['entree_sur_apostrophe']=hub()[-1:]
aller(','); nS=len(hub()); touche('Enter'); R['entree_sur_signe_avance']=(len(hub())==nS, mot()!=',')   # L6b : Entrée sur un signe avance, sans rien marquer
n0=len(hub()); m0=mot(); touche('p'); touche('e'); R['p_e_retirees']=(len(hub())==n0, mot()==m0, m0)
R['pre_sur_mot']=pre(); touche('Enter'); R['entree_sur_mot']=(len(hub())==n0, mot()!=m0)
w=mot(); touche('g'); p.keyboard.type(w); touche('Enter',500); R['garde_rapide_exact']=(p.evaluate("()=>!!document.getElementById('garde-mot')"), len(hub())==n0)
if CAP: p.screenshot(path=CAP+'/L3-garde.png')
wc=w[:1].upper()+w[1:] if w[:1].islower() else w.lower()
p.keyboard.press('Control+a'); p.keyboard.type(wc); touche('Enter',500); R['garde_rapide_casse']=(p.evaluate("()=>!!document.getElementById('garde-mot')"), hub()[-1:]==[(hub()[-1][0],'G',wc)] if hub() else False)   # [accordé à L15-0] la majuscule seule : acceptée
touche('Backspace'); touche('g'); p.keyboard.type('zzautre'); touche('Enter',500); R['autre_mot']=hub()[-1:]
touche('l'); touche('Enter',500); R['vide']=hub()[-1:]
# le mode texte
p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
def clic_mot(i,t):
    p.locator('.word-grid button.word-btn[data-word-idx="%d"]'%i).click(); p.wait_for_timeout(200); p.locator('.popup-btn-'+t).first.click(); p.wait_for_timeout(250)
n1=len(hub()); clic_mot(4,'g'); p.keyboard.type('centre'); touche('Enter',500); R['garde_texte_exact']=(p.evaluate("()=>!!document.getElementById('garde-mot-texte')"), len(hub())==n1)
p.keyboard.press('Control+a'); p.keyboard.type('sentre'); touche('Enter',500); R['texte_autre']=[x for x in hub() if x[0]==4]
clic_mot(9,'g'); p.keyboard.type('pour'); touche('Enter',500); R['garde_texte_casse']=(p.evaluate("()=>!!document.getElementById('garde-mot-texte')"), [x for x in hub() if x[0]==9])   # « Pour » attendu (début de phrase), « pour » tapé : accepté   # [accordé à L15-0]
clic_mot(5,'l'); p.keyboard.type('de'); p.locator('button:has-text("Passer")').first.click(); p.wait_for_timeout(500); R['passer']=[x for x in hub() if x[0]==5]
clic_mot(6,'g'); p.keyboard.type('zzclic'); p.locator('button.btn-primary:has-text("✓")').last.click(); p.wait_for_timeout(500); R['bouton_valider']=[x for x in hub() if x[0]==6]
R['fenetres']=dlg; R['erreurs']=b.erreurs[:3]
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
ok=(R['m_sur_mot']==[[0,'M',None]] and R['pre_point'] and 'Ponct' in R['pre_point'] and R['entree_sur_point'][0][1]=='P'
    and 'Ponct' in (R['pre_virgule'] or '') and R['m_sur_virgule'][0][1]=='P' and 'lision' in (R['pre_apostrophe'] or '') and R['entree_sur_apostrophe'][0][1]=='E'
    and R['entree_sur_signe_avance']==[True,True] and R['p_e_retirees'][:2]==[True,True] and R['pre_sur_mot'] is None and R['entree_sur_mot']==[True,True]
    and R['garde_rapide_exact']==[True,True] and R['garde_rapide_casse']==[False,True] and R['autre_mot'][0][1]=='G' and R['autre_mot'][0][2]=='zzautre'
    and R['vide'][0][1]=='L' and R['vide'][0][2] is None
    and R['garde_texte_exact']==[True,True] and R['garde_texte_casse']==[False,[[9,'G','pour']]] and R['texte_autre']==[[4,'G','sentre']] and R['passer']==[[5,'L',None]] and R['bouton_valider'] and R['bouton_valider'][-1]==[6,'G','zzclic']
    and R['fenetres']==[] and R['erreurs']==[])
print('BANC L3 PAR LE GESTE :','VERT' if ok else 'ROUGE'); b.fermer(); sys.exit(0 if ok else 1)
