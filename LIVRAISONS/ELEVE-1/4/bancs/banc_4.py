# BANC ELEVE-1 ④ — la correction de dictée sur une base EN MÉMOIRE (faux Firebase), données ZZTEST ; rien ne sort du navigateur.
import sys,os,json,time
from playwright.sync_api import sync_playwright
NM='/home/claude/work4/node_modules/'
LIBS={'react.production.min.js':NM+'react/umd/react.production.min.js','react-dom.production.min.js':NM+'react-dom/umd/react-dom.production.min.js','jszip':NM+'jszip/dist/jszip.min.js'}
FAUX=open('/home/claude/work4/banc/faux_firebase.js').read()
def hub_initial():
    noms=['ZZTEST ALPHA Anna','ZZTEST BETA Bruno','ZZTEST GAMMA Clara']
    return {'classes':{'zztest_5e':{'nom':'ZZTEST 5e','niveau':'5e','annee':'2026-2027','eleves':noms,
        'amenagements':{'zztest_alpha_anna':{'sexe':'f'},'zztest_beta_bruno':{'sexe':'m','dicteeAmenagee':True},'zztest_gamma_clara':{'sexe':'f'}}}},
      'classes_amenages':{'ZZTEST 5e':{'zztest_alpha_anna':True}},
      'codes':{},
      'correction_dictee':{'dictee_zz':{'config':{'title':'Dictée ZZTEST','classe':'ZZTEST 5e','base':20,'bareme':'preparee','text':'Le petit chat dort sur le tapis rouge.','published':True,'niveau':'5e','showNote':True},
        'dictee':{'amenagee':{'enabled':True,'defaultMode':'A','base':10,'lacunes':[{'idx':1,'mode':'A'},{'idx':3,'mode':'C'}],'consigne':''}},
        'results':{'zztest_alpha_anna':{'errors':[],'extras':[],'note':8,'deduction':0,'counts':{},'timestamp':1}}}}}
import urllib.parse
def lire_arbre(t,p):
    n=t
    for k in [urllib.parse.unquote(x) for x in p.strip('/').split('/') if x]:
        if not isinstance(n,dict) or k not in n: return None
        n=n[k]
    return n
def ouvrir(pw,url,hub=None,vp=(1500,960)):
    hub=hub or hub_initial()
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':vp[0],'height':vp[1]},timezone_id='Europe/Paris',locale='fr-FR')
    err=[]; ext=[]; pg.on('pageerror',lambda e: err.append(str(e)[:200])); pg.on('dialog',lambda d: d.accept())
    pg.add_init_script('window.__HUB_INITIAL='+json.dumps(hub)+';')
    def r(route,req):
        u=req.url
        if 'gstatic.com/firebasejs' in u: return route.fulfill(status=200,content_type='application/javascript',body=FAUX if 'firebase-app' in u else '')
        for k,v in LIBS.items():
            if k in u: return route.fulfill(status=200,content_type='application/javascript',body=open(v,'rb').read())
        if 'firebasedatabase.app' in u and req.method=='GET':   # les lectures REST (coffre) : servies depuis l'arbre semé
            import re as _re; m=_re.search(r'firebasedatabase\.app(/.*?)\.json',u); return route.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=json.dumps(lire_arbre(hub,m.group(1) if m else '/')))
        if u.startswith('http://127.0.0.1:8765/'): return route.continue_()
        ext.append((req.method,u[:80])); return route.abort()
    pg.route('**/*',r); pg.goto(url); time.sleep(2.5)
    return b,pg,err,ext
