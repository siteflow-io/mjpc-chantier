# BANC ELEVE-1 ⓪ — le mode test étanche, PAR LE GESTE : panneau prof → mode test → retirer un élève
# fictif (✕ puis confirmer) → Configuration → Purge de rentrée → taper PURGER → confirmer.
# Hub SIMULÉ (données ZZTEST) : rien n'atteint le vrai hub ; on compte ce qui serait parti.
# Identité : la session prof est posée (le banc ne connaît pas le code de Paul) — seul acte hors geste.
import sys,json,time,re
from playwright.sync_api import sync_playwright
from hub_simule import Hub
def jouer(cible, tag, dossier):
    hub=Hub(); ext=[]; R={'cible':cible,'tag':tag,'etapes':[]}
    try:
     with sync_playwright() as pw:
         b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1500,'height':960},accept_downloads=True)
         err=[]; pg.on('pageerror',lambda e: err.append(str(e)[:140]))
         pg.on('dialog',lambda d: d.dismiss())
         def r(route,req):
             u=req.url
             if 'firebasedatabase.app' in u: return hub.handle(route,req)
             if u.startswith('file:') or u.startswith('data:'): return route.continue_()
             if req.method!='GET': ext.append((hub.phase,req.method,u[:50]))
             return route.abort()
         pg.route('**/*',r)
         # le sélecteur de fichier natif n'existe pas sans écran : le banc le retire pour que la sauvegarde
         # passe par le téléchargement classique (le chemin de repli du site)
         pg.add_init_script("try{window.showSaveFilePicker=undefined;}catch(e){}")
         pg.add_init_script("sessionStorage.setItem('mjpc_eleve',JSON.stringify({is_prof:true,display:'Professeur',ts:Date.now()}))")
         # les contrats des apps : copiés du vrai hub en LECTURE (ce sont des contrats, aucun élève dedans)
         import urllib.request
         hub.root['manifestes']=json.load(urllib.request.urlopen('https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/manifestes.json'))
         pg.goto('file://'+cible); time.sleep(2)
         # le contrat publié = celui du fichier joué (lecture de la constante, posé au hub simulé)
         hub.root['manifestes']['index']['purge']=pg.evaluate('MJPC_PURGE')
         R['contrat_purger']=hub.root['manifestes']['index']['purge']['purger']
         ov=pg.locator('#m8-regles-overlay')
         if ov.count():
             R['etapes'].append(('alerte des règles (préexistante)',ov.locator('button').all_inner_texts()))
             raise SystemExit('alerte des règles affichée : le hub simulé doit porter dernierControleRegles')
         pg.click('[onclick="openProfPanel()"]'); time.sleep(0.8)
         pg.screenshot(path=f'{dossier}/{tag}-1-panneau.png')
         pg.click('#tprof-testpill'); time.sleep(0.8)
         R['mode_test']=pg.evaluate('m8TestOn()'); hub.phase='test'
         pg.click('.tprof-section-btn[data-section="eleves"]'); time.sleep(1.2)
         pg.screenshot(path=f'{dossier}/{tag}-2-eleves-mode-test.png')
         btn=pg.locator('button.admin-action-btn.danger[title*="Retirer"]').first
         R['boutons_retirer']=pg.locator('button.admin-action-btn.danger[title*="Retirer"]').count()
         btn.click(); time.sleep(0.6)
         lbl=pg.locator('.cm-actions button, .cm-btn').all_inner_texts(); R['etapes'].append(('modale retrait',lbl))
         pg.locator('.cm-btn').filter(has_text=re.compile('Retirer|Confirmer|Oui|OK',re.I)).last.click(); time.sleep(1.5)
         R['ecritures_apres_retrait']=[e for e in hub.ecritures if e['phase']=='test']
         pg.click('.tprof-section-btn[data-section="config"]'); time.sleep(1.2)
         pg.screenshot(path=f'{dossier}/{tag}-3-configuration-mode-test.png')
         pg.click('[onclick="_purgeOpen()"]'); time.sleep(2)
         R['etapes'].append(('modale purge 1',pg.locator('.cm-btn').all_inner_texts()))
         pg.screenshot(path=f'{dossier}/{tag}-4-purge-simulation.png')
         pg.locator('.cm-btn').filter(has_text='Continuer vers la purge').click(); time.sleep(0.8)
         R['etapes'].append(('modale purge 2',pg.locator('.cm-btn').all_inner_texts()))
         try:
             with pg.expect_download(timeout=8000) as dl:
                 pg.locator('.cm-btn').filter(has_text='Enregistrer la sauvegarde').click()
             d=dl.value; R['sauvegarde_telechargee']=d.suggested_filename
         except Exception as e:
             R['sauvegarde_telechargee']='pas de téléchargement capté : '+str(e)[:80]
         time.sleep(1.0)
         R['etapes'].append(('modale purge 3',pg.locator('.cm-btn').all_inner_texts()))
         pg.fill('#prcf','PURGER')
         pg.locator('.cm-btn').filter(has_text='Purger définitivement').click(); time.sleep(3)
         R['fin_purge']=pg.locator('.cm-sub,.cm-ok').all_inner_texts()[:3]
         pg.screenshot(path=f'{dossier}/{tag}-5-purge-terminee.png')
         R['ecritures_hub_en_mode_test']=[e for e in hub.ecritures if e['phase']=='test']
         R['externes_non_GET']=ext
         R['magasin']=pg.evaluate("""()=>{const o={};for(const k in M8_TEST_STORE){const v=M8_TEST_STORE[k];o[k]=v===null?'∅ (effacé)':(typeof v==='object'?'objet':String(v).slice(0,20));}return o;}""")
         R['erreurs_js']=err
         b.close()
    except Exception as e:
        R['ECHEC']=str(e)[:300]
    return R
if __name__=='__main__':
    print(json.dumps(jouer(sys.argv[1],sys.argv[2],sys.argv[3]),ensure_ascii=False,indent=1))
