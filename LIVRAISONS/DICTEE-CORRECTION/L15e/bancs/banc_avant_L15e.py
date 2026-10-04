import os
"""Harnais du banc correction_dictee.
Ouvre l'application dans Chromium, avec le simulacre Firebase à la place du SDK.
Aucune requête ne sort : tout accès au vrai hub est bloqué et compté comme violation."""
import json, os, time
from playwright.sync_api import sync_playwright

ICI = os.path.dirname(os.path.abspath(__file__))
VENDOR = os.path.join(ICI, 'vendor')
NOEUDS = ['correction_dictee', 'classes', 'codes', 'manifestes', 'site', 'classes_amenages']


def instantane(dossier=os.path.join(ICI, '..', 'root')):
    db = {}
    for n in NOEUDS:
        f = os.path.join(dossier, n + '.json')
        if os.path.exists(f):
            v = json.load(open(f, encoding='utf-8'))
            if v is not None:
                db[n] = v
    db.get('correction_dictee', {}).pop('__rien__', None)
    return db


OUVERTS=[]
class Banc:
    def __init__(self, html, largeur=1366, hauteur=900, dsf=1):
        OUVERTS.append(self)
        self.dsf = dsf
        self.html = open(html, 'rb').read()
        self.fake = open(os.path.join(ICI, 'fakefb.js'), encoding='utf-8').read()
        self.react = open(os.path.join(VENDOR, 'react-18.3.1/umd/react.production.min.js'), 'rb').read()
        self.rdom = open(os.path.join(VENDOR, 'react-dom-18.3.1/umd/react-dom.production.min.js'), 'rb').read()
        self.violations = []
        self.bloques = []
        self.erreurs = []
        self.pw = sync_playwright().start()
        self.nav = self.pw.chromium.launch(executable_path='/opt/google/chrome/chrome',args=['--no-sandbox'])
        self.taille = {'width': largeur, 'height': hauteur}

    def _route(self, route):
        u = route.request.url
        if u.startswith('http://banc.local/') or u.startswith('http://localhost/'):
            return route.fulfill(status=200, body=self.html, headers={'Content-Type': 'text/html; charset=utf-8'})
        if 'react-dom' in u and 'unpkg.com' in u:
            return route.fulfill(status=200, body=self.rdom, headers={'Content-Type': 'application/javascript'})
        if 'unpkg.com/react@' in u:
            return route.fulfill(status=200, body=self.react, headers={'Content-Type': 'application/javascript'})
        if 'firebase-app.js' in u:
            return route.fulfill(status=200, body=self.fake, headers={'Content-Type': 'application/javascript'})
        if 'firebase-database.js' in u:
            return route.fulfill(status=200, body='', headers={'Content-Type': 'application/javascript'})
        if 'fonts.googleapis.com' in u or 'fonts.gstatic.com' in u:
            return route.fulfill(status=200, body='', headers={'Content-Type': 'text/css'})
        if 'firebasedatabase.app' in u:
            self.violations.append(u)
            return route.abort()
        self.bloques.append(u)
        return route.abort()

    def ouvrir(self, requete='', db=None, session=None, local=None):
        ctx = self.nav.new_context(viewport=self.taille, device_scale_factor=self.dsf, locale='fr-FR', timezone_id='Europe/Paris')
        page = ctx.new_page()
        page.route('**/*', self._route)
        try:
            page.route_web_socket('**/*', lambda ws: (self.violations.append('ws:' + ws.url), ws.close()))
        except Exception:
            pass
        donnees = db if db is not None else instantane()
        script = 'window.__FAKE_DB__=' + json.dumps(donnees, ensure_ascii=False) + ';'
        if session:
            s = dict(session); s.setdefault('ts', int(time.time() * 1000))
            script += 'try{localStorage.setItem("mjpc_eleve",' + json.dumps(json.dumps(s, ensure_ascii=False)) + ')}catch(e){};'
        for k, v in (local or {}).items():
            script += 'try{localStorage.setItem(%s,%s)}catch(e){};' % (json.dumps(k), json.dumps(v))
        page.add_init_script(script)
        page.on('pageerror', lambda e: self.erreurs.append(str(e)))
        page.on('dialog', lambda d: d.accept())
        page.goto(('http://localhost/' if os.environ.get('BANC_SECURISE') else 'http://banc.local/') + 'correction_dictee.html' + requete)
        page.wait_for_timeout(600)
        return page

    def log(self, page):
        return page.evaluate('window.__FB_LOG__')

    def lire(self, page, chemin):
        return page.evaluate('p=>window.__FAKE_DB_GET__(p)', chemin)

    def fermer(self):
        try: OUVERTS.remove(self)
        except ValueError: pass
        self.nav.close(); self.pw.stop()
