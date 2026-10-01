# BANC — la vue élève inchangée : un élève FICTIF (ZZTEST, classe zztest_3e) ouvre le site.
# L'identité élève est posée par la session (comme la prof) — seul acte hors geste ; puis on regarde.
import sys,json,time
from playwright.sync_api import sync_playwright
from hub_simule import Hub
def jouer(cible,tag,dossier):
    hub=Hub(); ext=[]; R={'tag':tag}
    with sync_playwright() as pw:
        b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1500,'height':960},timezone_id='Europe/Paris',locale='fr-FR')
        err=[]; pg.on('pageerror',lambda e: err.append(str(e)[:140])); pg.on('dialog',lambda d:d.dismiss())
        def r(route,req):
            u=req.url
            if 'firebasedatabase.app' in u: return hub.handle(route,req)
            if u.startswith('file:') or u.startswith('data:'): return route.continue_()
            if req.method!='GET': ext.append((req.method,u.split('/')[2]))
            return route.abort()
        pg.route('**/*',r)
        pg.add_init_script("sessionStorage.setItem('mjpc_eleve',JSON.stringify({nom:'ZZTEST',prenom:'Alpha',display:'ZZTEST Alpha Anna',classe:'zztest_3e',niveau:'3e',uuid:'u-zz1',ts:Date.now()}))")
        pg.goto('file://'+cible+'?n=3e'); time.sleep(3)
        R['texte_visible']=pg.evaluate("document.body.innerText.length")
        R['mots_interdits']={m:pg.evaluate(f"document.body.innerText.includes({json.dumps(m)})") for m in ['aménag','PAP','◆','mode test','Mode test']}
        pg.screenshot(path=f'{dossier}/{tag}-vue-eleve.png'); R['ecritures_hub']=[(e['methode'],e['chemin']) for e in hub.ecritures]; R['externes_non_GET']=ext; R['erreurs_js']=err
        b.close()
    return R
if __name__=='__main__': print(json.dumps(jouer(sys.argv[1],sys.argv[2],sys.argv[3]),ensure_ascii=False))
