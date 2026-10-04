"""L6b — Entrée en mode rapide = correct / mot suivant, MÊME sur un signe (jamais une erreur) ; M sur un signe = ponctuation ; le bouton mis en avant dit « (M) ».
Par le geste, faux hub du kit, ZZTEST. (dette n°12 · 98 : L3 faisait marquer P à chaque Entrée sur un signe)"""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_L6b.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Papa']
R={}
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d:(dlg.append(d.message[:90]),d.dismiss()))
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
p.locator('.eleve-card',has_text='Z. Papa').first.click(); p.wait_for_timeout(900)
def hub(): r=b.lire(p,'correction_dictee/%s/results/zztest_papa'%D3) or {}; return [(e['idx'],e['type']) for e in (r.get('errors') or []) if e]
def mot(): return p.evaluate("()=>{const e=document.querySelector('.fast-word');return e?e.childNodes[0].textContent.trim():null}")
def pre(): return p.evaluate("()=>{const e=document.getElementById('fast-preselect');return e?e.textContent:null}")
def touche(k,att=350): p.keyboard.press(k); p.wait_for_timeout(att)
def aller(cible):
    for _ in range(60):
        m=mot()
        if m==cible: return True
        touche(' ',120)
    return False
p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
# 1. Entrée sur un signe : AVANCE, aucune erreur
aller('.'); R['pre_point']=pre(); n0=len(hub()); m0=mot(); touche('Enter'); R['entree_sur_point']=(len(hub())==n0, mot()!=m0, hub())
if CAP: p.screenshot(path=CAP+'/L6b-entree-point.png')
# 2. Entrée sur une virgule puis sur 3 signes de suite : avance, 0 erreur
aller(','); touche('Enter'); R['entree_sur_virgule']=(len(hub())==n0, hub())
# 3. M sur un signe : ponctuation
aller('.'); touche('m'); R['m_sur_point']=hub()[-1:]
# 4. Entrée sur un mot : avance
w=mot(); touche('Enter'); R['entree_sur_mot']=(mot()!=w, len(hub())==n0+1)
# 5. la ligne d'aide et le libellé du bouton
R['aide']=p.evaluate("()=>{const t=document.body.innerText;return {entree_correct:t.includes('Entrée = correct'), valide_bouton:t.includes('valide le bouton')}}")
aller(','); R['libelle_pre']=pre()
ok=[R['entree_sur_point'][0] and R['entree_sur_point'][1], R['entree_sur_virgule'][0], R['m_sur_point'] and R['m_sur_point'][0][1]=='P', R['entree_sur_mot'][0], R['aide']['entree_correct'] and not R['aide']['valide_bouton'], R['libelle_pre'] and '(M)' in R['libelle_pre'], not dlg]
print(json.dumps(R,ensure_ascii=False)[:600]); print('fenêtres :',dlg)
print('BANC L6b PAR LE GESTE : '+('VERT' if all(ok) else 'ROUGE '+str(ok)))
b.fermer()
