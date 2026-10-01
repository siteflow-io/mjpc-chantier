# BANC ELEVE-1 ③ — la fiche élève et le rappel des équipes éducatives, PAR LE GESTE, en mode test, hub SIMULÉ (ZZTEST).
# Hors geste, déclaré : l'identité prof (session) ; l'horloge du banc posée (jamais celle du conteneur) ; la LECTURE du
# magasin et le déchiffrement avec la clé de test pour PROUVER ce qui est écrit ; la case de l'heure prouvée par la fonction.
import sys,os,json,time,datetime,subprocess,urllib.request
from zoneinfo import ZoneInfo
from playwright.sync_api import sync_playwright
from hub_simule import Hub
SHEETJS=open('/home/claude/work1/node_modules/xlsx/dist/xlsx.full.min.js','rb').read(); FI='/home/claude/work3/fichiers/'
MAN=json.load(urllib.request.urlopen('https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/manifestes.json'))
CLE='zztest-cle-de-banc'; PARIS=ZoneInfo('Europe/Paris')
CAL={'annee':'2026-2027','etablissement':[{'id':'e1','date':'2026-09-15','heure':'17:00','libelle':'17h Equipes éducatives 4e 18h30 Parents 4e'},
  {'id':'e2','date':'2026-09-22','heure':'17:00','libelle':'17h Equipes éducatives 4e'},{'id':'e3','date':'2026-09-14','heure':'16:00','libelle':'16h Equipe éduc. N.Laury 17h Equipes éducatives 5e'}],'evenementsClasse':[]}
def hub0():
    h=Hub(); h.root.update({'classes':{},'codes':{},'eleves':{},'eleves_index':{},'manifestes':MAN,'corbeille':{},'qcm':{'eleveSexes':{}},'classes_amenages':{}})
    h.root['site']['edt']={'calendrier':{'2026-2027':CAL}}; return h
def jour(iso,h=10): y,m,d=map(int,iso.split('-')); return datetime.datetime(y,m,d,h,0,tzinfo=PARIS)
def ouvrir(pw,url,hub,iso,vp=(1500,960)):
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':vp[0],'height':vp[1]},timezone_id='Europe/Paris',locale='fr-FR')
    err=[]; ext=[]; pg.on('pageerror',lambda e: err.append(str(e)[:160])); pg.on('dialog',lambda d: d.accept())
    def r(route,req):
        if 'firebasedatabase.app' in req.url: return hub.handle(route,req)
        if 'xlsx.full.min.js' in req.url: return route.fulfill(status=200,content_type='application/javascript',body=SHEETJS)
        if req.url.startswith('http://127.0.0.1:8765/'): return route.continue_()
        if req.method!='GET': ext.append((hub.phase,req.method,req.url.split('/')[2]))
        return route.abort()
    pg.route('**/*',r); pg.clock.set_fixed_time(jour(iso))
    pg.add_init_script("sessionStorage.setItem('mjpc_eleve',JSON.stringify({is_prof:true,display:'Professeur',ts:Date.now()}))")
    pg.goto(url); time.sleep(2); pg.click('[onclick="openProfPanel()"]'); time.sleep(0.6); pg.click('#tprof-testpill'); time.sleep(0.6); hub.phase='test'
    return b,pg,err,ext
def section(pg,s,att=1.2): pg.click(f'.tprof-section-btn[data-section="{s}"]'); time.sleep(att)
def eleves(pg):
    pg.click('.tprof-section-btn[data-section="eleves"]')
    try: pg.wait_for_selector('#el-import-ta, #elf, .tprof-placeholder:not(:has-text("Chargement"))',timeout=10000)
    except Exception: pass
    time.sleep(0.8)
def cle(pg):
    pg.fill('#secu-cle-input',CLE); pg.click('[onclick="secuPoserCle()"]')
    try: pg.wait_for_function("()=>(typeof SECU!=='undefined'&&SECU.valide)||!!document.getElementById('secu-cle-confirm')",timeout=30000)
    except Exception: pass
    if pg.locator('#secu-cle-confirm').count() and not pg.evaluate('SECU.valide'):
        pg.fill('#secu-cle-confirm',CLE); pg.click('[onclick="secuPoserCle()"]'); pg.wait_for_function("()=>SECU.valide",timeout=30000)
    time.sleep(1.5)
def importer_nouvelle(pg,f):
    pg.set_input_files('#eli-fichier',FI+f)
    pg.wait_for_function("(f)=>{var c=document.querySelector('#eli-apercu .eli-chip');return c&&c.textContent.indexOf(f)>=0;}",arg=f,timeout=10000)
    pg.wait_for_function("()=>!document.getElementById('eli-valider').disabled",timeout=10000); pg.click('#eli-valider'); time.sleep(0.6)
    if pg.locator('#class-modal.visible').count(): pg.click('[onclick="submitCreateClass()"]')
    pg.wait_for_selector('#eli-resultat',timeout=20000); time.sleep(0.8); return pg.locator('#eli-resultat').inner_text()
def classe_vide(pg,nom,niv):
    section(pg,'classes'); pg.click('[onclick="openCreateClassModal()"]'); time.sleep(0.3)
    pg.fill('#class-modal-nom',nom); pg.select_option('#class-modal-niveau',niv); pg.fill('#class-modal-annee','2026-2027'); pg.click('[onclick="submitCreateClass()"]'); time.sleep(0.8)
RAPPELS_JS="""()=>[...document.querySelectorAll('.tprof-class-row')].map(r=>{const n=(r.querySelector('.tcr-name')||r).innerText.trim();const x=r.nextElementSibling;return [n,x&&x.classList.contains('elf-rappel')?x.innerText.trim():null];})"""
def rappels(pg,iso):
    pg.clock.set_fixed_time(jour(iso)); section(pg,'classes',1.0); time.sleep(2.5)
    return {n:t for n,t in pg.evaluate(RAPPELS_JS)}
def ouvrir_fiche(pg,classe,nom):
    eleves(pg)
    if pg.locator('#elf').count(): pg.click('.elf-retour'); time.sleep(0.8)
    pg.click(f'.lens-pill:has-text("{classe}")'); time.sleep(0.8); pg.click(f'.el-row:has-text("{nom}") .el-name'); pg.wait_for_selector('#elf',timeout=8000); time.sleep(2.2)
PROFIL_JS="""async([s,k])=>{const T=_m8Superposer('/classes',{})||{};const c=T[s]||{};const p=(c.profils||{})[k]||{};const K=SECU.valide?SECU.cle:null;
 const d=async x=>{if(!x)return null;if(!K)return '(clé absente)';try{return await mjpcDechiffrer(K,x);}catch(e){return 'ÉCHEC';}};
 return {sexe:p.sexe||null,majLe:p.majLe||null,attente:p.attente,dispositif:await d(p.dispositif),pap:await d(p.pap),remarques:await d(p.remarques),synthese:await d(p.synthese),
   amen:(c.amenagements||{})[k]||null,nb:c.nbDispositifs};}"""
def profil(pg,s,k): return pg.evaluate(PROFIL_JS,[s,k])
