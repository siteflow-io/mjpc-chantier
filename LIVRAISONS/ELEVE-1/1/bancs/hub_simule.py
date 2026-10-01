# Hub SIMULÉ pour les bancs ELEVE-1 : données 100 % fictives (préfixe ZZTEST) ;
# les GET sont servis ici, les écritures rangées ici et COMPTÉES ; rien n'atteint le vrai hub.
import json, re, time, urllib.parse
def arbre_initial():
    noms=['ZZTEST Alpha Anna','ZZTEST Beta Bruno','ZZTEST Gamma Gina']
    cles=['zztest_alpha_anna','zztest_beta_bruno','zztest_gamma_gina']
    return {
      'classes':{'zztest_3e':{'nom':'ZZTEST 3e','niveau':'3e','annee':'2026-2027','archivee':False,'eleves':noms}},
      'codes':{k:{'name':n,'classe':'zztest_3e','createdAt':1} for k,n in zip(cles,noms)},
      'eleves':{'u-zz1':{'uuid':'u-zz1','nom':'ZZTEST','prenom':'Alpha','inscriptions':[{'annee':'2026-2027','niveau':'3e','classe':'zztest_3e'}]}},
      'eleves_index':{'zztest_alpha_anna':'u-zz1'},
      'manifestes':{}, 'site':{'config':{'dernierControleRegles':int(time.time()*1000)}}, 'corbeille':{}
    }
class Hub:
    def __init__(s): s.root=arbre_initial(); s.ecritures=[]; s.phase='avant'
    def _parts(s,p): return [urllib.parse.unquote(x) for x in p.strip('/').split('/') if x]
    def get(s,p):
        n=s.root
        for k in s._parts(p):
            if not isinstance(n,dict) or k not in n: return None
            n=n[k]
        return n
    def put(s,p,v):
        ks=s._parts(p)
        if not ks: s.root=v or {}; return
        n=s.root
        for k in ks[:-1]:
            if not isinstance(n.get(k),dict): n[k]={}
            n=n[k]
        if v is None: n.pop(ks[-1],None)
        else: n[ks[-1]]=v
    def handle(s,route,req):
        u=req.url; m=re.search(r'firebasedatabase\.app(/.*?)\.json',u)
        p=m.group(1) if m else '/'
        if req.method=='GET':
            return route.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=json.dumps(s.get(p)))
        body=None
        try: body=json.loads(req.post_data) if req.post_data else None
        except Exception: pass
        s.ecritures.append({'phase':s.phase,'methode':req.method,'chemin':urllib.parse.unquote(p)})
        if req.method=='DELETE': s.put(p,None)
        elif req.method=='PATCH' and isinstance(body,dict):
            for k,v in body.items(): s.put(p.rstrip('/')+'/'+k,v)
        else: s.put(p,body)
        return route.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body='null')
