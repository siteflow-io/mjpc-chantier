# Captures de ① : l'écran « Élèves & codes » avant/après (même parcours), et l'aperçu photographié EN ENTIER.
import json,time,urllib.request
from playwright.sync_api import sync_playwright
from hub_simule import Hub
SHEETJS=open('/home/claude/work1/node_modules/xlsx/dist/xlsx.full.min.js','rb').read(); FI='/home/claude/work1/fichiers/'; D='/home/claude/work1/captures1'
MAN=json.load(urllib.request.urlopen('https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/manifestes.json'))
def ouvrir(pw,cible):
    hub=Hub(); hub.root.update({'classes':{},'codes':{},'eleves':{},'eleves_index':{},'manifestes':MAN})
    b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1500,'height':960},timezone_id='Europe/Paris',locale='fr-FR')
    def r(route,req):
        if 'firebasedatabase.app' in req.url: return hub.handle(route,req)
        if 'xlsx.full.min.js' in req.url: return route.fulfill(status=200,content_type='application/javascript',body=SHEETJS)
        return route.continue_() if req.url.startswith('file:') else route.abort()
    pg.route('**/*',r); pg.on('dialog',lambda d:d.dismiss())
    pg.add_init_script("sessionStorage.setItem('mjpc_eleve',JSON.stringify({is_prof:true,display:'Professeur',ts:Date.now()}))")
    pg.goto('file://'+cible); time.sleep(2); pg.click('[onclick="openProfPanel()"]'); time.sleep(0.6); pg.click('#tprof-testpill'); time.sleep(0.6)
    return b,pg
def classe(pg,nom,niv):
    pg.click('.tprof-section-btn[data-section="classes"]'); time.sleep(1); pg.click('[onclick="openCreateClassModal()"]'); time.sleep(0.3)
    pg.fill('#class-modal-nom',nom); pg.select_option('#class-modal-niveau',niv); pg.fill('#class-modal-annee','2026-2027'); pg.click('[onclick="submitCreateClass()"]'); time.sleep(0.8)
def eleves(pg):
    pg.click('.tprof-section-btn[data-section="eleves"]')
    try: pg.wait_for_selector('#el-import-ta, .tprof-placeholder:not(:has-text("Chargement"))',timeout=10000)
    except Exception: pass
    time.sleep(0.8)
with sync_playwright() as pw:
    for tag,cible in (('base','/home/claude/work1/base-8.74.0-0.html'),('livree','/home/claude/work1/index-8.74.0-1.html')):
        b,pg=ouvrir(pw,cible); classe(pg,'ZZTEST 3e','3e'); eleves(pg); pg.screenshot(path=f'{D}/{tag}-0-eleves-apres-creation-classe.png'); pg.locator('#tprof-content').screenshot(path=f'{D}/{tag}-0-contenu.png'); b.close()
    b,pg=ouvrir(pw,'/home/claude/work1/index-8.74.0-1.html')
    classe(pg,'ZZTEST 4e','4e'); classe(pg,'ZZTEST 3e','3e'); eleves(pg)
    pg.locator('#eli-bloc').screenshot(path=f'{D}/el-zone.png')
    pg.click('.lens-pill:has-text("ZZTEST 3e")'); time.sleep(0.6); pg.fill('#el-import-ta','ZZTEST ALPHA Anna\nZZTEST HORS Fichier'); pg.click('[onclick^="_importEleves"]'); time.sleep(1)
    pg.click('.lens-pill:has-text("ZZTEST 4e")'); time.sleep(0.6)
    def choisir(f):
        pg.set_input_files('#eli-fichier',FI+f); pg.wait_for_function("(f)=>{var c=document.querySelector('#eli-apercu .eli-chip');return c&&c.textContent.indexOf(f)>=0;}",arg=f,timeout=10000); time.sleep(0.5)
    choisir('ZZTEST-3e.xlsx'); pg.click('#eli-valider'); time.sleep(0.6)
    pg.locator('#eli-apercu .eli-ap').screenshot(path=f'{D}/el-apercu.png')
    choisir('ZZTEST-3e-doublon.xlsx'); pg.locator('#eli-apercu .eli-ap').screenshot(path=f'{D}/el-doublon.png')
    b.close()
from PIL import Image, ImageDraw, ImageFont
fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22); fn=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
def legende(src,dst,titre,lignes,coul,boite=None):
    im=Image.open(src).convert('RGB')
    if boite: im=im.crop(boite)
    band=46+24*len(lignes); o=Image.new('RGB',(im.width,im.height+band),coul); d=ImageDraw.Draw(o)
    d.text((16,12),titre,font=fb,fill=(255,255,255))
    for i,l in enumerate(lignes): d.text((16,46+24*i),l,font=fn,fill=(255,255,255))
    o.paste(im,(0,band)); o.save(dst); return o.size
R=(150,30,30); V=(20,110,60); B=(30,64,140)
print(legende(f'{D}/base-0-contenu.png',f'{D}/Q1-avant.png','AVANT (la version en ligne)',['Mode test : je crée « ZZTEST 3e », j’ouvre Élèves & codes.','La classe a disparu (« Aucune classe active ») ; pas d’import de fichier.'],R))
print(legende(f'{D}/livree-0-contenu.png',f'{D}/Q2-apres.png','APRÈS (la livraison ①)'.replace('①','1'),['Même parcours : la classe est là ;','en haut, le nouveau bloc « Importer la liste d’une classe ».'],V))
print(legende(f'{D}/el-apercu.png',f'{D}/Q3-apercu.png','L’aperçu d’un fichier déposé — rien n’est écrit',['« 3 ZZTEST » reconnue comme « ZZTEST 3e » ; tout est compté et dit.','« Valider » répond seulement : l’écriture arrive à la livraison suivante.'],B))
print(legende(f'{D}/el-doublon.png',f'{D}/Q4-doublon.png','Un doublon dans le fichier : l’import est refusé',['Les deux lignes sont nommées ; « Valider » est grisé.'],R))
