"""L18 (13 · 61) — le même parcours du professeur, avant / après : l'accueil, la dictée ouverte (chaque onglet de Pilotage, Données, Réglages),
la correction (mode texte, mode rapide) ; à chaque écran : la largeur du cadre, le défilement de côté. Captures si CAPTURES=<dossier>."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ['FICHIER']; CAP=os.environ.get('CAPTURES',''); TAG=os.environ.get('TAG','x'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
TAILLES=[tuple(map(int,t.split('x'))) for t in os.environ.get('TAILLES','1707x743,1366x768').split(',')]
PONCT="""()=>{const P=/^[.,;:!?\u2026\u00bb\u201d\u2019'")\-\u2013\u2014]+$/;const bs=[...document.querySelectorAll('.word-grid .word-btn')];let lignes=bs.length?1:0,mauvaises=[];
 for(let i=1;i<bs.length;i++){const a=bs[i-1].getBoundingClientRect(),b=bs[i].getBoundingClientRect();if(b.top>a.top+a.height/2){lignes++;const t=bs[i].textContent.replace(/[A-Z]$/,'').trim();if(P.test(t))mauvaises.push(t+' '+(bs[i+1]?bs[i+1].textContent.trim():''));}}
 return {mots:bs.length,lignes:lignes,ponctuation_en_debut:mauvaises}}"""
GEO="""()=>{const c=[...document.querySelectorAll('.container,.container-wide')].filter(x=>x.getBoundingClientRect().width>0)[0];
 return {cadre:c?Math.round(c.getBoundingClientRect().width):null, gauche:c?Math.round(c.getBoundingClientRect().left):null, ecran:innerWidth, defilement_h:document.documentElement.scrollWidth>innerWidth+1}}"""
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Victor']
R={}
def clic(p,t):
    ok=p.evaluate('''t=>{const b=[...document.querySelectorAll('button')].filter(x=>x.getBoundingClientRect().width>0&&x.textContent.replace(/\s+/g,' ').trim().replace(/^\W+/,'').startsWith(t));if(!b.length)return false;b[0].click();return true}''',t)
    if not ok: raise Exception('bouton introuvable : '+t)
def cap(p,nom,W):
    R['%s_%d'%(nom,W)]=p.evaluate(GEO)
    if CAP: p.screenshot(path='%s/%s-%s-%d.png'%(CAP,TAG,nom,W))
def ouvrir(W,H):
    b=Banc(F,W,H); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1200)
    p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
    return b,p
def entrer(p):
    p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2200)
for W,H in TAILLES:
    b,p=ouvrir(W,H); cap(p,'1-accueil',W); entrer(p); cap(p,'2-ouverte',W)
    p.locator('.eleve-card',has_text='Z. Victor').first.click(); p.wait_for_timeout(900); cap(p,'3-copie-texte',W); R['ponct_%d'%W]=p.evaluate(PONCT)
    p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
    for _ in range(6): p.keyboard.press(' '); p.wait_for_timeout(60)
    cap(p,'4-copie-rapide',W); R['erreurs_a_%d'%W]=b.erreurs[:2]; R['violations_a_%d'%W]=b.violations[:2]; b.fermer()
    b,p=ouvrir(W,H); entrer(p)
    n=5
    for g,tabs in (('Pilotage',['Préparation','Rapide']),('Données',['Bilan','Copies','Fiches élèves','Suivi','Exercices']),('Réglages',[None])):
        for t in tabs:
            try:
                clic(p,g); p.wait_for_timeout(500)
                if t: clic(p,t); p.wait_for_timeout(900)
                cap(p,'%d-%s'%(n,(g if not t else t).lower().replace(' ','-').replace('é','e').replace('è','e')),W); n+=1
            except Exception as e: R['erreur_onglet_%s_%d'%(t,W)]=str(e)[:120]
    R['erreurs_b_%d'%W]=b.erreurs[:2]; R['violations_b_%d'%W]=b.violations[:2]; b.fermer()
print(json.dumps(R,ensure_ascii=False))
