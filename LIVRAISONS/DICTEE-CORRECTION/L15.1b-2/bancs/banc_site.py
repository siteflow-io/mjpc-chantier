"""BANC DU SITE (index.html) — une page servie en local (http://localhost, contexte sécurisé) ; le hub est un ARBRE EN MÉMOIRE dans la page :
toutes les requêtes REST vers le hub (GET, PUT, PATCH, DELETE) y sont servies par un relais — rien ne sort du navigateur ; tout autre hôte
est bloqué et compté. La session du professeur est celle que pose le site après sa connexion (sessionStorage « mjpc_eleve », is_prof)."""
import json, os
from playwright.sync_api import sync_playwright
RELAIS = r'''
(function(){
  var T = window.__ARBRE_INITIAL ? JSON.parse(JSON.stringify(window.__ARBRE_INITIAL)) : {}; window.__ECRITURES_REST = [];
  function parts(p){ return String(p||'').split('/').filter(Boolean).map(decodeURIComponent); }
  function get(p){ var n=T, ps=parts(p); for(var i=0;i<ps.length;i++){ if(n==null||typeof n!=='object') return null; n=n[ps[i]]; } return n===undefined?null:JSON.parse(JSON.stringify(n)); }
  function put(p,v){ var ps=parts(p); if(!ps.length){ T=v||{}; return; } var n=T; for(var i=0;i<ps.length-1;i++){ if(n[ps[i]]==null||typeof n[ps[i]]!=='object') n[ps[i]] = /^\d+$/.test(ps[i+1])&&false?[]:{}; n=n[ps[i]]; }
    if(v===null||v===undefined) delete n[ps[ps.length-1]]; else n[ps[ps.length-1]]=JSON.parse(JSON.stringify(v)); }
  window.__ARBRE_GET = get;
  var _f = window.fetch;
  window.fetch = function(url, opts){ var u = String((url&&url.url)||url), m = /firebasedatabase\.app\/?(.*?)\.json/.exec(u);
    if(!m) return _f.apply(this, arguments);
    var meth = String((opts&&opts.method)||'GET').toUpperCase(), corps = null; try{ corps = opts&&opts.body ? JSON.parse(opts.body) : null; }catch(e){}
    var p = m[1];
    if(meth==='PUT'){ put(p, corps); window.__ECRITURES_REST.push(['PUT','/'+p]); }
    else if(meth==='PATCH'){ Object.keys(corps||{}).forEach(function(k){ put(p+'/'+k, corps[k]); }); window.__ECRITURES_REST.push(['PATCH','/'+p]); }
    else if(meth==='DELETE'){ put(p, null); window.__ECRITURES_REST.push(['DELETE','/'+p]); }
    var v = meth==='GET' ? get(p) : corps;
    if(meth==='GET' && /shallow=true/.test(u) && v && typeof v==='object'){ var o={}; Object.keys(v).forEach(function(k){o[k]=true}); v=o; }
    return Promise.resolve(new Response(JSON.stringify(v), {status:200, headers:{'Content-Type':'application/json'}}));
  };
  var _ES = window.EventSource;
  window.EventSource = function(url){ if(/firebasedatabase\.app/.test(String(url))){ this.close=function(){}; this.addEventListener=function(){}; return; } return new _ES(url); };
})();
'''
class BancSite:
    def __init__(self, fichier, larg=1366, haut=900):
        self.fichier = fichier; self.pw = sync_playwright().start(); self.nav = self.pw.chromium.launch(); self.erreurs=[]; self.bloques=[]; self.taille={'width':larg,'height':haut}
    def ouvrir(self, requete, arbre, session=None):
        ctx = self.nav.new_context(viewport=self.taille, locale='fr-FR', timezone_id='Europe/Paris'); p = ctx.new_page()
        p.on('pageerror', lambda e: self.erreurs.append(str(e)[:200])); p.on('dialog', lambda d: d.accept())
        html = open(self.fichier, 'rb').read()
        def route(r):
            u = r.request.url
            if u.startswith('http://localhost/index.html'): return r.fulfill(status=200, body=html, headers={'Content-Type':'text/html; charset=utf-8'})
            self.bloques.append(u[:80]); return r.abort()
        p.route('**/*', route)
        init = 'window.__ARBRE_INITIAL=' + json.dumps(arbre, ensure_ascii=False) + ';' + RELAIS
        if session: init += "try{sessionStorage.setItem('mjpc_eleve',%s);}catch(e){}" % json.dumps(json.dumps(session))
        p.add_init_script(init); p.goto('http://localhost/index.html' + requete); p.wait_for_timeout(1500); return p
    def lire(self, p, chemin): return p.evaluate("(c)=>window.__ARBRE_GET(c)", chemin)
    def fermer(self): self.nav.close(); self.pw.stop()
