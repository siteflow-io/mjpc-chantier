# BANC ② bis — dictée, réécriture, QCM sur une base EN MÉMOIRE (faux Firebase) : rien ne sort du navigateur. Données ZZTEST.
import json,time,re,urllib.parse
from playwright.sync_api import sync_playwright
R17='/home/claude/work5/node_modules/'; R18='/home/claude/work4/node_modules/'
FAUX=open('/home/claude/work5/banc/faux_firebase.js').read()
EMP=json.load(open('/home/claude/work4/banc/empreinte.json'))   # empreinte du code d'essai « ZZ4242 » (sel « selzz »), calculée par l'app elle-même
def lib(u):
    v=R17 if 'react@17' in u or 'react-dom@17' in u else R18
    if 'react-dom' in u: return v+'react-dom/umd/react-dom.production.min.js'
    if 'react' in u: return v+'react/umd/react.production.min.js'
    return None
def lire_arbre(t,p):
    n=t
    for k in [urllib.parse.unquote(x) for x in p.strip('/').split('/') if x]:
        if not isinstance(n,dict) or k not in n: return None
        n=n[k]
    return n
def hub(extra=None):
    H={'site':{'config':{'profEmpreintes':[{'sel':'selzz','empreinte':EMP}],'dernierControleRegles':int(time.time()*1000)}},
       'classes':{'3E Charles de Gaulle':{'nom':'3E Charles de Gaulle','niveau':'3e','eleves':['ZZTEST TEMOIN Un','ZZTEST TEMOIN Deux']},
                  'zztest_3e':{'nom':'ZZTEST 3e','niveau':'3e','annee':'2026-2027','eleves':['ZZTEST ALPHA Anna','ZZTEST BETA Bruno','ZZTEST GAMMA Clara']},
                  'zztest_4e':{'nom':'ZZTEST 4e','niveau':'4e','annee':'2026-2027','eleves':['ZZTEST DELTA Dan']}},
       'codes':{}}
    if extra: H.update(extra)
    return H
def ouvrir(pw,url,H,vp=(1500,960)):
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':vp[0],'height':vp[1]},timezone_id='Europe/Paris',locale='fr-FR')
    err=[]; ext=[]; dial=[]; pg.on('pageerror',lambda e: err.append(str(e)[:200]))
    pg.on('dialog',lambda d: (dial.append(d.message[:300]), d.accept()))
    pg.add_init_script('window.__HUB_INITIAL='+json.dumps(H)+';')
    def r(route,req):
        u=req.url
        if 'gstatic.com/firebasejs' in u: return route.fulfill(status=200,content_type='application/javascript',body=FAUX if 'firebase-app' in u else '')
        if 'unpkg.com/react' in u:
            p=lib(u); return route.fulfill(status=200,content_type='application/javascript',body=open(p,'rb').read())
        if 'firebasedatabase.app' in u and req.method=='GET':
            m=re.search(r'firebasedatabase\.app(/.*?)\.json',u); return route.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=json.dumps(lire_arbre(H,m.group(1) if m else '/')))
        if u.startswith('http://127.0.0.1:8766/'): return route.continue_()
        if 'fonts.g' not in u: ext.append((req.method,u[:80]))
        return route.abort()
    pg.route('**/*',r); pg.goto(url); time.sleep(2.5)
    return b,pg,err,ext,dial
def prof(pg):
    pg.click('text=Accès professeur'); time.sleep(0.4); pg.fill('input[type=password]','ZZ4242')
    if pg.locator('button:has-text("→")').count(): pg.click('button:has-text("→")')
    else: pg.keyboard.press('Enter')
    time.sleep(3)
