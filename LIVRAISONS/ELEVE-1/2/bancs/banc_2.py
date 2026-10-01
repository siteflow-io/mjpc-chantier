# BANC ELEVE-1 ② — l'écriture, PAR LE GESTE, en mode test, sur un hub SIMULÉ (données ZZTEST).
# Hors geste, déclaré : l'identité prof posée par la session ; la LECTURE du magasin de test et le déchiffrement
# des paquets avec la clé de test, pour PROUVER ce qui a été écrit (aucune action ne passe par là).
import sys,json,time,urllib.request
from playwright.sync_api import sync_playwright
from hub_simule import Hub
SHEETJS=open('/home/claude/work1/node_modules/xlsx/dist/xlsx.full.min.js','rb').read(); FI='/home/claude/work2/fichiers/'
MAN=json.load(urllib.request.urlopen('https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/manifestes.json'))
CLE='zztest-cle-de-banc'
def hub0(sans_annee=False):
    h=Hub(); h.root.update({'classes':{},'codes':{},'eleves':{},'eleves_index':{},'manifestes':MAN,'corbeille':{},
      'qcm':{'eleveSexes':{'ZZTEST 3e':{'zztest_iota_ines':'f','zztest_alpha_anna':'m'},'ZZTEST 5e ancienne':{'zztest_x_y':'m','zztest_z_w':'f'}}},
      'classes_amenages':{'ZZTEST 3e':{'zztest_beta_bruno':True},'ZZTEST 5e ancienne':{'zztest_x_y':True}}})
    if sans_annee: h.root['classes']['zztest_3e']={'nom':'ZZTEST 3e','niveau':'3e','archivee':False}
    return h
def ouvrir(pw,cible,hub,D,tag):
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1500,'height':960},timezone_id='Europe/Paris',locale='fr-FR',accept_downloads=True)
    err=[]; pg.on('pageerror',lambda e: err.append(str(e)[:160])); pg.on('dialog',lambda d: d.accept())
    ext=[]
    def r(route,req):
        if 'firebasedatabase.app' in req.url: return hub.handle(route,req)
        if 'xlsx.full.min.js' in req.url: return route.fulfill(status=200,content_type='application/javascript',body=SHEETJS)
        if req.url.startswith('file:') or req.url.startswith('data:') or req.url.startswith('http://127.0.0.1:8765/'): return route.continue_()
        if req.method!='GET': ext.append((hub.phase,req.method,req.url.split('/')[2]))
        return route.abort()
    pg.route('**/*',r); pg.add_init_script("sessionStorage.setItem('mjpc_eleve',JSON.stringify({is_prof:true,display:'Professeur',ts:Date.now()}))")
    pg.goto(cible if cible.startswith('http') else 'file://'+cible); time.sleep(2); pg.click('[onclick="openProfPanel()"]'); time.sleep(0.6); pg.click('#tprof-testpill'); time.sleep(0.6); hub.phase='test'
    return b,pg,err,ext
def classe(pg,nom,niv):
    pg.click('.tprof-section-btn[data-section="classes"]'); time.sleep(1); pg.click('[onclick="openCreateClassModal()"]'); time.sleep(0.3)
    pg.fill('#class-modal-nom',nom); pg.select_option('#class-modal-niveau',niv); pg.fill('#class-modal-annee','2026-2027'); pg.click('[onclick="submitCreateClass()"]'); time.sleep(0.8)
def eleves(pg):
    pg.click('.tprof-section-btn[data-section="eleves"]')
    try: pg.wait_for_selector('#el-import-ta, .tprof-placeholder:not(:has-text("Chargement"))',timeout=10000)
    except Exception: pass
    time.sleep(0.8)
def cle(pg):
    attendre="()=>{var m=document.getElementById('secu-cle-msg');return (typeof SECU!=='undefined'&&SECU.valide)||!!document.getElementById('secu-cle-confirm')||(m&&m.textContent&&m.textContent.indexOf('rification')<0);}"
    pg.fill('#secu-cle-input',CLE); pg.click('[onclick="secuPoserCle()"]')
    try: pg.wait_for_function(attendre,timeout=30000)
    except Exception: pass
    if pg.locator('#secu-cle-confirm').count() and not pg.evaluate('SECU.valide'):
        pg.fill('#secu-cle-confirm',CLE); pg.click('[onclick="secuPoserCle()"]')
        try: pg.wait_for_function("()=>SECU.valide",timeout=30000)
        except Exception: pass
    time.sleep(1.5)
    return pg.evaluate("(document.getElementById('secu-cle-msg')||{}).textContent||''")
def choisir(pg,f):
    pg.set_input_files('#eli-fichier',FI+f)
    pg.wait_for_function("(f)=>{var c=document.querySelector('#eli-apercu .eli-chip');return c&&c.textContent.indexOf(f)>=0;}",arg=f,timeout=10000)
    pg.wait_for_function("()=>!document.querySelector('#eli-apercu') || document.querySelector('#eli-apercu').textContent.indexOf('je lis ce que le QCM')<0",timeout=10000); time.sleep(0.4)
def chips(pg): return pg.locator('#eli-apercu .eli-chip').all_inner_texts()
def valider(pg):
    pg.click('#eli-valider'); pg.wait_for_selector('#eli-resultat',timeout=15000); time.sleep(0.6); return pg.locator('#eli-resultat').inner_text()
ETAT_JS="""async()=>{const T=_m8Superposer('/classes',{})||{};const K=(typeof SECU!=='undefined'&&SECU.valide)?SECU.cle:null;const out={};
  const dec=async x=>{if(!x)return null;if(!K)return '(clé absente)';try{return await mjpcDechiffrer(K,x);}catch(e){return 'ÉCHEC';}};
  for(const s of Object.keys(T)){const c=T[s]||{};const pr=c.profils||{};const d={};
    for(const k of Object.keys(pr)){const p=pr[k]||{};d[k]={sexe:p.sexe||null,attente:p.attente,naissance:await dec(p.naissance),dispositif:await dec(p.dispositif),pap:await dec(p.pap),champs:Object.keys(p).sort(),forme_naissance:p.naissance?String(p.naissance).split('.').length+' morceaux':null};}
    out[s]={eleves:(c.eleves||[]).length,nb:c.nbDispositifs,annee:c.annee,amen:c.amenagements||{},profils:d};}
  const S=M8_TEST_STORE;
  return {classes:out,corbeille:Object.keys(S).filter(k=>k.indexOf('/corbeille/')===0).map(k=>({k:k,motif:(S[k]&&S[k]._meta||{}).motif,data:S[k]&&S[k].data})),
    tombes:Object.keys(S).filter(k=>S[k]===null&&(k.indexOf('/qcm/')===0||k.indexOf('/classes_amenages')===0))};}"""
def etat(pg): return pg.evaluate(ETAT_JS)
