import sys, copy, os; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ['FICHIER']; OUT=os.environ['OUT']; D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Mike']
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
p.locator('.eleve-card',has_text='Z. Mike').first.click(); p.wait_for_timeout(900)
for i,t,m in ((3,'g','fautt'),(7,'l','lexik')):
    p.locator('.word-grid button.word-btn[data-word-idx="%d"]'%i).click(); p.wait_for_timeout(200); p.locator('.popup-btn-'+t).first.click(); p.wait_for_timeout(200); p.keyboard.type(m); p.keyboard.press('Enter'); p.wait_for_timeout(250)
p.keyboard.press('Shift+R'); p.wait_for_timeout(900); p.screenshot(path=OUT+'-1-apres-un-shiftR.png')
p.keyboard.press('Shift+R'); p.wait_for_timeout(900); p.screenshot(path=OUT+'-2-apres-deux-shiftR.png'); b.fermer()
