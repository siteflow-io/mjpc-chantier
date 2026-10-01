import sys,os,time,subprocess
from banc_3 import *
SRV=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd='/home/claude/work3',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
D='/home/claude/work3/captures3'
def clip(pg,path,haut):
    pg.evaluate("(h)=>{const c=document.getElementById('tprof-content');if(c)c.scrollTop=h?0:c.scrollHeight;}",haut); time.sleep(0.6)
    bb=pg.locator('#tprof-content').bounding_box(); pg.screenshot(path=path,clip={'x':bb['x'],'y':bb['y'],'width':bb['width'],'height':min(bb['height'],860)})
with sync_playwright() as pw:
    hub=hub0(); b,pg,err,ext=ouvrir(pw,'http://127.0.0.1:8765/index-8.74.0-3.html',hub,'2026-09-16'); eleves(pg); cle(pg); importer_nouvelle(pg,'ZZTEST-4e.xlsx')
    ouvrir_fiche(pg,'4 ZZTEST','ZZTEST BETA Bruno'); pg.check('#elf-c-pap-03'); pg.check('#elf-c-pap-15'); pg.fill('#elf-r-pap-03','lecture par un tiers en évaluation'); pg.fill('#elf-syn','vigilance : fatigue en fin de journée')
    pg.click('#elf-enregistrer'); pg.wait_for_selector('#elf-msg',timeout=15000); time.sleep(0.8)
    clip(pg,f'{D}/fiche-haut.png',True); clip(pg,f'{D}/fiche-bas.png',False); b.close()
    hub=hub0(); b,pg,err,ext=ouvrir(pw,'http://127.0.0.1:8765/index-8.74.0-3.html',hub,'2026-09-16'); eleves(pg); importer_nouvelle(pg,'ZZTEST-4e.xlsx')
    ouvrir_fiche(pg,'4 ZZTEST','ZZTEST BETA Bruno'); pg.evaluate("()=>{const c=document.getElementById('tprof-content');const f=document.getElementById('elf');if(c&&f)c.scrollTop=f.offsetTop-10;}"); time.sleep(0.5)
    bb=pg.locator('#tprof-content').bounding_box(); pg.screenshot(path=f'{D}/fiche-sans-cle.png',clip={'x':bb['x'],'y':bb['y'],'width':bb['width'],'height':min(bb['height'],700)}); b.close()
SRV.terminate()
from PIL import Image, ImageDraw, ImageFont
fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22); fn=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
def legende(src,dst,titre,lignes,coul):
    im=Image.open(src).convert('RGB'); band=46+24*len(lignes); o=Image.new('RGB',(max(im.width,760),im.height+band),coul); d=ImageDraw.Draw(o)
    d.text((16,12),titre,font=fb,fill=(255,255,255))
    for i,l in enumerate(lignes): d.text((16,46+24*i),l,font=fn,fill=(255,255,255))
    o.paste(im,(0,band)); o.save(dst); return o.size
B=(30,64,140)
print(legende(f'{D}/fiche-haut.png',f'{D}/T3-fiche-haut.png','La fiche d’un élève fléché, enregistrée (en haut)',['◆, né le, sexe F/M, dispositif oui/non, « cases cochées le 16/09/2026 » ;','les lignes de la fiche PAP, mot pour mot, une remarque par ligne.'],B))
print(legende(f'{D}/fiche-bas.png',f'{D}/T4-fiche-bas.png','La même fiche, en bas',['pap-15 cochée : « dictée aménagée : oui » pour les apps ; la synthèse ;','« Enregistrer la fiche », le compte rendu, la place réservée à l’historique.'],B))
print(legende(f'{D}/fiche-sans-cle.png',f'{D}/T5-sans-cle.png','La fiche sans ta clé',['Elle s’ouvre : le sexe se règle ; le reste dit « saisis ta clé ».'],B))
ims=[Image.open(f'{D}/'+p) for p in ['T3-fiche-haut.png','T4-fiche-bas.png','T5-sans-cle.png']]
g=Image.new('RGB',(sum(i.width for i in ims)+20,max(i.height for i in ims)),(255,255,255)); x=0
for i in ims: g.paste(i,(x,0)); x+=i.width+10
g.save('/home/claude/work3/regard_T345.png'); print(g.size)
