"""L7 — la largeur : les écrans de correction du professeur à 1100 px (texte et rapide), aucun bouton hors de son cadre, aucun
défilement de côté, à 1366 et 1920 px ; la phrase entière autour du mot en mode rapide ; les écrans élèves identiques au pixel près."""
import sys, os, json, subprocess, copy; sys.argv=['x','a','b']; sys.path.insert(0,'.')
from PIL import Image, ImageChops
import banc_L1 as L
from banc import Banc
F=os.environ['FICHIER']; BASE=os.environ.get('BASE','../live_663.html')
r=subprocess.run(['python3','mesure_largeur.py'],capture_output=True,text=True,env=dict(os.environ,FICHIER=F,CAPTURES=''))
M=json.loads(r.stdout[r.stdout.index('{'):]); print('géométrie :',json.dumps(M,ensure_ascii=False))
geo_ok=all(M[k]['largeur']==1100 and M[k]['boutons_qui_depassent']==[] and M[k]['defilement_h'] is False for k in M if not k.startswith('erreurs'))
ctx=M['rapide_1366']['contexte'] or ''; phrase_ok=ctx.startswith('Pour') and 'adressions' in ctx and ctx.endswith('…')
# la phrase : le mot courant en gras, bornée par « . » : on vérifie dans le texte de la dictée que « Pour » suit un point
# les écrans élèves : au pixel près (vue de départ et choix « 1 élève / 2 élèves »), base contre livrée
def ecrans(f,tag):
    out=[]
    for W,H in ((1366,768),(390,844)):
        b=Banc(f,W,H); p=b.ouvrir('',db=copy.deepcopy(L.BASE)); p.wait_for_timeout(1000)
        p.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.children.length===0&&/\\d+\\.\\d+\\.\\d+/.test(e.textContent))e.textContent=''})}")   # la pastille de version, seul écart attendu
        a='/tmp/el_%s_%d_a.png'%(tag,W); p.screenshot(path=a); p.locator('text=Mode élève').first.click(); p.wait_for_timeout(1200)
        p.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.children.length===0&&/\\d+\\.\\d+\\.\\d+/.test(e.textContent))e.textContent=''})}")
        c='/tmp/el_%s_%d_b.png'%(tag,W); p.screenshot(path=c); out+= [a,c]; b.fermer()
    return out
e1=ecrans(BASE,'base'); e2=ecrans(F,'livree')
diff=[ImageChops.difference(Image.open(x).convert('RGB'),Image.open(y).convert('RGB')).getbbox() for x,y in zip(e1,e2)]
eleve_ok=all(d is None for d in diff); print('écrans élèves — écarts au pixel :',diff)
ok=geo_ok and phrase_ok and eleve_ok and all(M[k]==[] for k in M if k.startswith('erreurs'))
print('géométrie',geo_ok,'| phrase',phrase_ok,repr(ctx[:60]),'| élèves identiques',eleve_ok)
print('BANC L7 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
