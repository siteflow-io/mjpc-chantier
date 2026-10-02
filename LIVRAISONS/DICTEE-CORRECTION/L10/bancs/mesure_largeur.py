"""Mesure, par la géométrie : la largeur des écrans de correction (texte, rapide) et les boutons qui dépassent de leur cadre, à 1366 et 1920 px."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ['FICHIER']; D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
GEO="""()=>{const out={};const c=document.querySelector('.word-grid')?document.querySelector('.word-grid').closest('.container'):document.querySelector('.fast-word')?document.querySelector('.fast-word').closest('.container'):null;
 out.largeur=c?Math.round(c.getBoundingClientRect().width):null; out.defilement_h=document.documentElement.scrollWidth>innerWidth;
 const dep=[];[...document.querySelectorAll('button')].forEach(b=>{const r=b.getBoundingClientRect();if(!r.width)return;let p=b.parentElement;while(p&&getComputedStyle(p).display==='contents')p=p.parentElement;if(!p)return;const q=p.getBoundingClientRect();
  const d=Math.max(r.right-q.right,q.left-r.left);if(d>1)dep.push([b.textContent.trim().slice(0,18),Math.round(d)]);});out.boutons_qui_depassent=dep;
 const ctx=document.querySelector('.fast-word')?document.querySelector('.fast-word').closest('.container').querySelector('div[style*=\"line-height: 1.8\"]'):null;out.contexte=ctx?ctx.innerText.replace(/\\n/g,' '):null;return out;}"""
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Victor']
R={}
for W,H in ((1366,768),(1920,1080)):
    b=Banc(F,W,H); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
    p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2200)
    p.locator('.eleve-card',has_text='Z. Victor').first.click(); p.wait_for_timeout(900)
    R['texte_%d'%W]=p.evaluate(GEO)
    if CAP: p.screenshot(path='%s/texte-%d.png'%(CAP,W))
    p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
    for _ in range(14): p.keyboard.press(' '); p.wait_for_timeout(60)
    R['rapide_%d'%W]=p.evaluate(GEO)
    if CAP: p.screenshot(path='%s/rapide-%d.png'%(CAP,W))
    R['erreurs_%d'%W]=b.erreurs[:2]; b.fermer()
print(json.dumps(R,ensure_ascii=False,indent=0))
