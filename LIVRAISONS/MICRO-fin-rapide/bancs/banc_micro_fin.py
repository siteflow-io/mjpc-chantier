# BANC MICRO 6.6.3 — « sauter à la fin » en correction rapide — par le geste, base EN MÉMOIRE (faux Firebase), données ZZTEST.
# 6.6.2 : ReferenceError (editForm) à l'écran « Terminé ! » ; 6.6.3 : l'écran s'affiche, 0 erreur.
import sys,os,json,time,re,subprocess
sys.path.insert(0,'/home/claude/L2b/bancs')
from banc_2bis import hub, ouvrir, prof
from playwright.sync_api import sync_playwright
D=sys.argv[1] if len(sys.argv)>1 else '/tmp/micro2out'; os.makedirs(D,exist_ok=True)
SRV=subprocess.Popen(['python3','-m','http.server','8766','--bind','127.0.0.1'],cwd='/home/claude/MICRO2',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
DICTEE={'correction_dictee':{'dictee_zz':{'config':{'title':'Dictée ZZTEST','classe':'zztest_3e','niveau':'3e','base':20,'bareme':'preparee','text':'Le chat dort sur le mur du jardin.','published':True}}}}
ok=[]
def check(nom,cond,det): ok.append(cond); print(('OK  ' if cond else 'ÉCHEC ')+nom+' — '+json.dumps(det,ensure_ascii=False)[:200])
def jouer(tag,f):
    with sync_playwright() as pw:
        b,pg,err,ext,dial=ouvrir(pw,'http://127.0.0.1:8766/'+f,hub(DICTEE)); prof(pg); time.sleep(2)
        pg.click('text=Ouvrir →'); time.sleep(1.5)
        pg.locator('button', has_text='Rapide').first.click(); time.sleep(1.5)   # l'onglet ⚡ Rapide (le premier élève est pris)
        pg.screenshot(path=f'{D}/{tag}-1-rapide.png')
        btn=pg.locator('button[title^="Sauter"]').first; present=btn.count()>0
        if present: btn.click(); time.sleep(1.5)
        pg.screenshot(path=f'{D}/{tag}-2-fin.png')
        txt=pg.locator('body').inner_text()
        b.close()
        return {'bouton':present,'termine':('Terminé' in txt),'erreurs':err,'ext':ext,'blanc':len(txt.strip())<40}
A=jouer('base','dictee-6.6.2.html'); L=jouer('livree','dictee-6.6.3.html')
check('6.6.2 (avant) : « Sauter à la fin » fait tomber la page (ReferenceError editForm)', A['bouton'] and any('editForm' in e for e in A['erreurs']), A['erreurs'][:2])
check('6.6.3 : « Sauter à la fin » affiche « Terminé ! », 0 erreur JS', L['bouton'] and L['termine'] and not L['erreurs'], {'termine':L['termine'],'err':L['erreurs']})
check('0 sortie du navigateur (base, livrée)', not A['ext'] and not L['ext'], [A['ext'],L['ext']])
SRV.terminate()
print('BANC UNIQUE : '+('VERT (0 échec)' if all(ok) else 'ROUGE'))
