# BANC ELEVE-1 ① — l'aperçu d'import, PAR LE GESTE, en mode test, sur un hub SIMULÉ (données ZZTEST).
# Gestes : Panneau prof → Mode test → Classes → « + Nouvelle classe » (ZZTEST 4e) → Élèves & codes →
# choisir le fichier .xlsx → lire l'aperçu → créer ZZTEST 3e → cadre de secours (2 élèves) → choisir le fichier
# à nouveau → Valider → le fichier à doublon → Ctrl+V du tableau → Ctrl+V d'une liste de noms → Annuler.
# Hors geste, déclaré : l'identité prof posée par la session ; le presse-papiers rempli par le banc
# (comme Paul copie dans Excel) avant le Ctrl+V ; SheetJS servi depuis la copie npm 0.18.5 (même version que cdnjs).
import sys,json,time,re,urllib.request
from playwright.sync_api import sync_playwright
from hub_simule import Hub
SHEETJS=open('/home/claude/work1/node_modules/xlsx/dist/xlsx.full.min.js','rb').read()
FI='/home/claude/work1/fichiers/'
def jouer(cible,tag,D):
    hub=Hub(); hub.root['classes']={}; hub.root['codes']={}; hub.root['eleves']={}; hub.root['eleves_index']={}
    hub.root['manifestes']=json.load(urllib.request.urlopen('https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/manifestes.json'))
    ext=[]; R={'tag':tag,'sheetjs_demande':0,'etapes':{}}
    with sync_playwright() as pw:
        b=pw.chromium.launch(); ctx=b.new_context(viewport={'width':1500,'height':960},timezone_id='Europe/Paris',locale='fr-FR')
        ctx.grant_permissions(['clipboard-read','clipboard-write'])
        pg=ctx.new_page(); err=[]; pg.on('pageerror',lambda e: err.append(str(e)[:160])); pg.on('dialog',lambda d: d.dismiss())
        def r(route,req):
            u=req.url
            if 'firebasedatabase.app' in u: return hub.handle(route,req)
            if 'cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js' in u:
                R['sheetjs_demande']+=1; return route.fulfill(status=200,content_type='application/javascript',body=SHEETJS)
            if u.startswith('file:') or u.startswith('data:'): return route.continue_()
            if req.method!='GET': ext.append((hub.phase,req.method,u.split('/')[2]))
            return route.abort()
        pg.route('**/*',r)
        pg.add_init_script("sessionStorage.setItem('mjpc_eleve',JSON.stringify({is_prof:true,display:'Professeur',ts:Date.now()}))")
        pg.goto('file://'+cible); time.sleep(2)
        def chips(): return pg.locator('#eli-apercu .eli-chip').all_inner_texts()
        def lignes(): return pg.locator('#eli-apercu .eli-tab tbody tr').count()
        def classe(nom,niv):
            pg.click('.tprof-section-btn[data-section="classes"]'); time.sleep(1)
            pg.click('[onclick="openCreateClassModal()"]'); time.sleep(0.4)
            pg.fill('#class-modal-nom',nom); pg.select_option('#class-modal-niveau',niv); pg.fill('#class-modal-annee','2026-2027')
            pg.click('[onclick="submitCreateClass()"]'); time.sleep(0.8)
        pg.click('[onclick="openProfPanel()"]'); time.sleep(0.8)
        pg.click('#tprof-testpill'); time.sleep(0.8); hub.phase='test'; R['mode_test']=pg.evaluate('m8TestOn()')
        classe('ZZTEST 4e','4e')
        pg.click('.tprof-section-btn[data-section="eleves"]')
        try: pg.wait_for_selector('#el-import-ta',timeout=8000)
        except Exception: pass
        R['zone_presente']=pg.locator('#eli-zone').count(); R['cadre_secours_present']=pg.locator('#el-import-ta').count()
        pg.screenshot(path=f'{D}/{tag}-1-zone-vide.png')
        if not R['zone_presente']: b.close(); return R
        def choisir(f):
            pg.set_input_files('#eli-fichier',FI+f)
            pg.wait_for_function("(f)=>{var c=document.querySelector('#eli-apercu .eli-chip');return c&&c.textContent.indexOf(f)>=0;}",arg=f,timeout=10000); time.sleep(0.4)
        choisir('ZZTEST-3e.xlsx')
        R['etapes']['A_nouvelle']={'chips':chips(),'lignes':lignes()}
        pg.screenshot(path=f'{D}/{tag}-2-apercu-nouvelle-classe.png')
        classe('ZZTEST 3e','3e')
        pg.click('.tprof-section-btn[data-section="eleves"]'); pg.wait_for_selector('#eli-zone',timeout=8000); time.sleep(0.5)
        # le cadre de secours, sur ZZTEST 3e : un élève du fichier + un élève absent du fichier
        pg.click('.lens-pill:has-text("ZZTEST 3e")'); time.sleep(0.8)
        pg.fill('#el-import-ta','ZZTEST ALPHA Anna\nZZTEST HORS Fichier'); pg.click('[onclick^="_importEleves"]'); time.sleep(1)
        pg.click('.lens-pill:has-text("ZZTEST 4e")'); time.sleep(0.8)   # la classe ouverte n'est PAS celle du fichier
        choisir('ZZTEST-3e.xlsx')
        R['etapes']['A_presente']={'chips':chips(),'lignes':lignes(),'select':pg.locator('#eli-apercu select').input_value()}
        magasin_avant=pg.evaluate('JSON.stringify(M8_TEST_STORE)'); ecr_avant=len(hub.ecritures)
        pg.screenshot(path=f'{D}/{tag}-3-apercu-classe-presente.png')
        pg.click('#eli-valider'); time.sleep(0.8)
        R['valider_message']=pg.locator('#eli-pas-encore').inner_text() if pg.locator('#eli-pas-encore').count() else None
        R['valider_rien_ecrit']=(pg.evaluate('JSON.stringify(M8_TEST_STORE)')==magasin_avant and len(hub.ecritures)==ecr_avant)
        pg.screenshot(path=f'{D}/{tag}-4-valider.png')
        choisir('ZZTEST-3e-doublon.xlsx')
        R['etapes']['B_doublon']={'chips':chips(),'lignes':lignes(),'valider_desactive':pg.locator('#eli-valider').is_disabled()}
        pg.screenshot(path=f'{D}/{tag}-5-doublon-refuse.png')
        # Ctrl+V du tableau copié depuis Excel, sur la page (pas dans un champ)
        pg.evaluate('t=>navigator.clipboard.writeText(t)',open(FI+'ZZTEST-3e-colle.txt',encoding='utf-8').read())
        pg.click('.eli-titre'); pg.keyboard.press('Control+V'); time.sleep(1)
        R['etapes']['C_colle']={'chips':chips(),'lignes':lignes()}
        pg.screenshot(path=f'{D}/{tag}-6-tableau-colle.png')
        pg.evaluate('t=>navigator.clipboard.writeText(t)','ZZTEST UN Alpha\nZZTEST DEUX Beta')
        pg.click('.eli-titre'); pg.keyboard.press('Control+V'); time.sleep(1)
        R['etapes']['D_noms']={'chips':chips(),'lignes':lignes()}
        pg.click('#eli-annuler'); time.sleep(0.5); R['annuler_vide']=pg.locator('#eli-apercu .eli-ap').count()==0
        R['ecritures_hub_en_mode_test']=[e for e in hub.ecritures if e['phase']=='test']; R['externes_non_GET']=ext; R['erreurs_js']=err
        R['magasin_cles']=sorted(json.loads(pg.evaluate('JSON.stringify(Object.keys(M8_TEST_STORE))')))
        b.close()
    return R
if __name__=='__main__': print(json.dumps(jouer(sys.argv[1],sys.argv[2],sys.argv[3]),ensure_ascii=False,indent=1))
