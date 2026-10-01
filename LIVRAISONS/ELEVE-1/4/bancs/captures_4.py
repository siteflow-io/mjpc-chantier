import sys,os,json,time,subprocess,re
from banc_4 import *
D='/home/claude/work4/captures4'
SRV=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd='/home/claude/work4',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
EMP=json.load(open('/home/claude/work4/banc/empreinte.json'))
def H0():
    H=hub_initial(); H.setdefault('site',{}).setdefault('config',{})['profEmpreintes']=[{'sel':'selzz','empreinte':EMP}]; return H
def entrer(pg):
    pg.click('text=Accès professeur'); time.sleep(0.4); pg.fill('input[type=password]','ZZ4242'); pg.click('button:has-text("→")'); time.sleep(2.5); pg.click('text=Ouvrir →'); time.sleep(2.5)
def zone(pg,path,sels,marge=12):
    bs=[pg.locator(s).first.bounding_box() for s in sels]; bs=[b for b in bs if b]
    x0=min(b['x'] for b in bs)-marge; y0=min(b['y'] for b in bs)-marge; x1=max(b['x']+b['width'] for b in bs)+marge; y1=max(b['y']+b['height'] for b in bs)+marge
    pg.screenshot(path=path,clip={'x':max(0,x0),'y':max(0,y0),'width':x1-max(0,x0),'height':y1-max(0,y0)})
with sync_playwright() as pw:
    b,pg,e,x=ouvrir(pw,'http://127.0.0.1:8765/base-dictee-6.5.0.html',H0()); entrer(pg); zone(pg,f'{D}/z-avant.png',['h1','.eleve-grid']); b.close()
    b,pg,e,x=ouvrir(pw,'http://127.0.0.1:8765/dictee-6.6.0.html',H0()); entrer(pg); zone(pg,f'{D}/z-apres.png',['h1','#pap-ligne','.eleve-grid'])
    pg.locator('.eleve-card',has_text='Bruno').click(); time.sleep(1.5); zone(pg,f'{D}/z-copie-bruno.png',['button:has-text("Enregistrer (10/10)")','.eleve-card, h2, h3'],20) if False else None
    bb=pg.locator('button:has-text("Enregistrer (10/10)")').bounding_box(); pg.screenshot(path=f'{D}/z-copie-bruno.png',clip={'x':bb['x']-10,'y':max(0,bb['y']-260),'width':bb['width']+20,'height':bb['height']+275})
    pg.click('button:has-text("Enregistrer (10/10)")'); time.sleep(3); pg.click('button:has-text("Enregistrer (20/20)")'); time.sleep(2.5)
    pg.click('button.nav2-groupe:has-text("Données")'); time.sleep(1); pg.get_by_text('Bilan',exact=True).first.click(); time.sleep(1.5)
    pg.locator('div:has(> div:text-is("Moyenne"))').first.screenshot(path=f'{D}/z-moyenne.png')
    pg.get_by_text('📄 Copies',exact=True).first.click(); time.sleep(1.2); pg.locator('button.btn-primary').filter(has_text=re.compile('Rendre')).first.click(); time.sleep(1.5)
    ETAT=pg.evaluate("window.__LIRE('')"); b.close()
    b,pg,e,x=ouvrir(pw,'http://127.0.0.1:8765/dictee-6.6.0.html',ETAT)
    pg.evaluate("sessionStorage.setItem('mjpc_eleve',JSON.stringify({nom:'ZZTEST',prenom:'BETA Bruno',display:'ZZTEST BETA Bruno',classe:'zztest_5e',ts:Date.now()}))"); pg.reload(); time.sleep(2.5)
    pg.click('text=Mode élève'); time.sleep(2); pg.click('button:has-text("👤")'); time.sleep(2.5)
    pg.click('text=Dictée ZZTEST'); time.sleep(3); zone(pg,f'{D}/z-eleve.png',['text=Bravo','text=À savoir'],20); b.close()
SRV.terminate()
from PIL import Image, ImageDraw, ImageFont
fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22); fn=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
def legende(src,dst,titre,lignes,coul,zoom=1.0):
    im=Image.open(src).convert('RGB')
    if zoom!=1.0: im=im.resize((int(im.width*zoom),int(im.height*zoom)))
    band=46+24*len(lignes); o=Image.new('RGB',(max(im.width,820),im.height+band),(255,255,255)); d=ImageDraw.Draw(o)
    d.rectangle([0,0,o.width,band],fill=coul); d.text((16,12),titre,font=fb,fill=(255,255,255))
    for i,l in enumerate(lignes): d.text((16,46+24*i),l,font=fn,fill=(255,255,255))
    o.paste(im,(0,band)); o.save(dst); return o.size
R=(150,30,30); V=(20,110,60); B=(30,64,140)
for f in ['z-avant.png','z-apres.png','z-copie-bruno.png','z-moyenne.png','z-eleve.png']: print(f,Image.open(f'{D}/{f}').size)
print(legende(f'{D}/z-avant.png',f'{D}/W1-avant.png','AVANT (en ligne, 6.5.0) — la correction de la dictée',['Rien ne dit qui est aménagé ; Anna (ancien registre) : 8/20 ;','la fiche de Bruno (pap-15) n’est pas lue.'],R))
print(legende(f'{D}/z-apres.png',f'{D}/W2-apres.png','APRÈS (6.6.0) — le même écran',['La ligne PAP (capture validée) ; Bruno « aménagé » d’après sa fiche ;','la copie d’Anna tracée une fois : 8/10.'],V))
print(legende(f'{D}/z-copie-bruno.png',f'{D}/W3-copie-bruno.png','La copie de Bruno se corrige et s’enregistre sur 10',['La base de sa version aménagée ; la trace est gardée.'],B,1.3))
print(legende(f'{D}/z-moyenne.png',f'{D}/W4-moyenne.png','L’encart « Moyenne » : rien n’est mêlé',['La dictée sur sa base ; les copies aménagées à part, sur la leur.'],B,2.0))
print(legende(f'{D}/z-eleve.png',f'{D}/W5-eleve.png','Ce que voit Bruno (élève) : 10/10',['Sa note sur la base de sa copie ; aucun mot sur l’aménagement.'],B,1.2))
ims=[Image.open(f'{D}/'+p) for p in ['W1-avant.png','W2-apres.png','W3-copie-bruno.png','W4-moyenne.png','W5-eleve.png']]
g=Image.new('RGB',(sum(i.width for i in ims)+40,max(i.height for i in ims)),(200,200,200)); x=0
for i in ims: g.paste(i,(x,0)); x+=i.width+10
g.save('/home/claude/work4/regard_W.png'); print(g.size)
