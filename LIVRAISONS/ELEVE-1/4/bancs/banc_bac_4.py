# Le bac à sable de la dictée, PAR LE GESTE (« 🧪 Créer le bac à sable ») sur la base simulée : son 2e élève fictif est aménagé d'après sa « fiche » ;
# puis « Effacer le bac à sable » : l'aménagement part avec la classe de test.
import json,time,subprocess,re
from banc_4 import *
SRV=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd='/home/claude/work4',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
EMP=json.load(open('/home/claude/work4/banc/empreinte.json')); H=hub_initial(); H.setdefault('site',{}).setdefault('config',{})['profEmpreintes']=[{'sel':'selzz','empreinte':EMP}]
with sync_playwright() as pw:
    b,pg,err,ext=ouvrir(pw,'http://127.0.0.1:8765/dictee-6.6.0.html',H)
    pg.click('text=Accès professeur'); time.sleep(0.4); pg.fill('input[type=password]','ZZ4242'); pg.click('button:has-text("→")'); time.sleep(2.5)
    pg.click('button:has-text("Créer le bac à sable")'); time.sleep(3)
    print('ÉLÈVES FICTIFS :',json.dumps((pg.evaluate("window.__LIRE('classes/_test_correction_dictee')") or {}).get('eleves'),ensure_ascii=False)); print('CODES FICTIFS :',sorted(k for k in (pg.evaluate("window.__LIRE('codes')") or {})))
    am=pg.evaluate("window.__LIRE('classes/_test_correction_dictee/amenagements')"); print('APRÈS CRÉATION — aménagements de la classe de test :',json.dumps(am,ensure_ascii=False))
    eff=pg.locator('button').filter(has_text=re.compile('Tout effacer'))
    if eff.count(): eff.first.click(); time.sleep(3)
    print('ÉLÈVES FICTIFS :',json.dumps((pg.evaluate("window.__LIRE('classes/_test_correction_dictee')") or {}).get('eleves'),ensure_ascii=False)) if False else None
    print('APRÈS EFFACEMENT — classe de test :',json.dumps(pg.evaluate("window.__LIRE('classes/_test_correction_dictee')"))); print('erreurs JS :',err)
    b.close()
SRV.terminate()
