"""418 (Paul : A) — choisir un profil remplit la « Note sur » avec la base du profil ; rien n'est écrit avant « Enregistrer ». Par le geste."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); DP='dictee_preparee_5e_grandes_decouvertes-5e_herge'
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=copy.deepcopy(L.BASE)); p.wait_for_timeout(1500)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('grandes découvertes')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
p.locator('button.tab:has-text("Préparation")').first.click(); p.wait_for_timeout(800)
noteSur=lambda: p.locator('.config-field:has(label:text-is("Note sur")) input').first.input_value()
R={'avant':noteSur()}
p.locator('#profil-dictee-l15g').select_option('preparee'); p.wait_for_timeout(300); R['preparee']=noteSur()
p.locator('#profil-dictee-l15g').select_option('brevet'); p.wait_for_timeout(300); R['brevet']=noteSur()
R['hub_inchange']=(b.lire(p,'correction_dictee/%s/config/base'%DP),b.lire(p,'correction_dictee/%s/config/bareme'%DP))
R['erreurs']=b.erreurs[:2]; b.fermer()
print(json.dumps(R,ensure_ascii=False))
ok=R['avant']=='10' and R['preparee']=='20' and R['brevet']=='10' and list(R['hub_inchange'])==[10,None] and R['erreurs']==[]
print('BANC 418 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
