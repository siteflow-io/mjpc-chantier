# BANC UNIQUE ELEVE-1 ④ — la correction de dictée, PAR LE GESTE, sur une base EN MÉMOIRE (faux Firebase : rien ne sort
# du navigateur), données ZZTEST ; rejoue tout d'une commande et échoue si UNE SEULE vérification échoue.
# Hors geste, déclaré : l'empreinte d'un code prof d'essai posée dans la base simulée ; la session de l'élève fictif ;
# la LECTURE de la base simulée pour prouver ; le bilan exporté et la feuille papier prouvés PAR LA FONCTION.
import sys,os,json,time,subprocess,re,urllib.request
from banc_4 import *
BASE,LIV,D=sys.argv[1:4]
HUB='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app'
def vrai_hub(): return {n:len(json.load(urllib.request.urlopen(f'{HUB}/{n}.json?shallow=true')) or {}) for n in ['classes','correction_dictee','classes_amenages','codes','corbeille']}
SRV=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd='/home/claude/work4',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
EMP=json.load(open('/home/claude/work4/banc/empreinte.json'))
def H0():
    H=hub_initial(); H.setdefault('site',{}).setdefault('config',{})['profEmpreintes']=[{'sel':'selzz','empreinte':EMP}]; return H
def entrer(pg):
    pg.click('text=Accès professeur'); time.sleep(0.4); pg.fill('input[type=password]','ZZ4242'); pg.click('button:has-text("→")'); time.sleep(2.5); pg.click('text=Ouvrir →'); time.sleep(2.5)
def cartes(pg): return {t.split('\n')[0].replace('📘',''):t.replace('\n',' | ') for t in pg.locator('.eleve-card').all_inner_texts()}
def lire(pg,p): return pg.evaluate('(p)=>window.__LIRE(p)',p)
def menu(pg,nom): pg.locator('.eleve-card',has_text=nom).click(button='right'); time.sleep(0.5); return pg.locator('div[style*="position: fixed"] button').all_inner_texts()
def groupe(pg,g): pg.click('button.nav2-groupe:has-text("'+g+'")'); time.sleep(1)
def onglet(pg,t): pg.get_by_text(t,exact=True).first.click(); time.sleep(1.5)
def enregistrer(pg,lib): pg.wait_for_selector('button:has-text("Enregistrer ('+lib+')")',state='visible',timeout=10000); pg.click('button:has-text("Enregistrer ('+lib+')")'); time.sleep(2)
def moyenne(pg): e=pg.locator('div:has(> div:text-is("Moyenne"))').first; return e.inner_text() if e.count() else None
avant=vrai_hub(); R={}
with sync_playwright() as pw:
    b,pg,e0,x0=ouvrir(pw,'http://127.0.0.1:8765/'+os.path.basename(BASE),H0()); entrer(pg); R['avant_cartes']=cartes(pg); R['avant_pap']=pg.locator('#pap-ligne').count()
    pg.screenshot(path=f'{D}/avant-correction.png'); b.close()
    b,pg,err,ext=ouvrir(pw,'http://127.0.0.1:8765/'+os.path.basename(LIV),H0()); entrer(pg)
    R['cartes0']=cartes(pg); R['pap0']=pg.locator('#pap-ligne').inner_text() if pg.locator('#pap-ligne').count() else None
    R['trace_anna']=lire(pg,'correction_dictee/dictee_zz/results/zztest_alpha_anna'); pg.screenshot(path=f'{D}/apres-correction.png')
    pg.click('button:has-text("← Retour")'); time.sleep(1.5); pg.click('text=Ouvrir →'); time.sleep(2.5)
    R['migrations']=[w for w in pg.evaluate('window.__ECRITURES') if w[0]=='update' and w[1].endswith('/results') and any('amenagee' in k for k in (w[2] if len(w)>2 else []))]
    R['menu1']=menu(pg,'Bruno'); pg.locator('div[style*="position: fixed"] button',has_text='Retirer am').click(); time.sleep(1)
    R['ov1']=lire(pg,'correction_dictee/dictee_zz/amenages'); R['cartes1']=cartes(pg)
    R['menu2']=menu(pg,'Bruno'); pg.locator('div[style*="position: fixed"] button',has_text='Aménagé (cette dictée)').click(); time.sleep(1)
    R['ov2']=lire(pg,'correction_dictee/dictee_zz/amenages'); R['cartes2']=cartes(pg)
    pg.click('#pap-bloc'); time.sleep(1); R['ov3']=lire(pg,'correction_dictee/dictee_zz/amenages'); R['pap3']=pg.locator('#pap-ligne').inner_text(); pg.locator('#pap-ligne').screenshot(path=f'{D}/el-pap-non.png')
    pg.click('#pap-bloc'); time.sleep(1); R['ov4']=lire(pg,'correction_dictee/dictee_zz/amenages'); R['pap4']=pg.locator('#pap-ligne').inner_text(); pg.locator('#pap-ligne').screenshot(path=f'{D}/el-pap.png')
    pg.locator('.eleve-card',has_text='Bruno').click(); time.sleep(1.5); pg.screenshot(path=f'{D}/apres-copie-bruno.png'); enregistrer(pg,'10/10'); R['res_bruno']=lire(pg,'correction_dictee/dictee_zz/results/zztest_beta_bruno')
    time.sleep(1.5); enregistrer(pg,'20/20'); R['res_clara']=lire(pg,'correction_dictee/dictee_zz/results/zztest_gamma_clara')
    R['cartes5']=cartes(pg); pg.screenshot(path=f'{D}/apres-cartes-corrigees.png')
    groupe(pg,'Données'); onglet(pg,'Bilan'); R['moyenne1']=moyenne(pg); pg.locator('div:has(> div:text-is("Moyenne"))').first.screenshot(path=f'{D}/el-moyenne.png')
    onglet(pg,'📄 Copies'); pg.locator('button.btn-primary').filter(has_text=re.compile('Rendre')).first.click(); time.sleep(1.5); R['rendue']=lire(pg,'correction_dictee/dictee_zz/copyPublishedAt')
    groupe(pg,'Pilotage'); onglet(pg,'Préparation'); pg.locator('.config-field:has(label:has-text("Note sur")) input').first.fill('12'); time.sleep(0.4)
    pg.locator('button:visible').filter(has_text=re.compile('^Enregistrer$')).first.click(); time.sleep(3)
    R['apres_base']={k:(lire(pg,'correction_dictee/dictee_zz/results/'+k) or {}).get('note') for k in ['zztest_alpha_anna','zztest_beta_bruno','zztest_gamma_clara']}; R['config_base']=lire(pg,'correction_dictee/dictee_zz/config/base')
    groupe(pg,'Données'); onglet(pg,'Bilan'); R['moyenne2']=moyenne(pg); pg.locator('div:has(> div:text-is("Moyenne"))').first.screenshot(path=f'{D}/el-moyenne-apres-base.png')
    groupe(pg,'Pilotage'); onglet(pg,'Correction'); R['cartes6']=cartes(pg)
    pg.locator('.eleve-card',has_text='Clara').click(); time.sleep(1.5); R['lib_clara2']=pg.locator('button:visible:has-text("Enregistrer (")').first.inner_text(); enregistrer(pg,'12/12')
    R['res_clara2']=lire(pg,'correction_dictee/dictee_zz/results/zztest_gamma_clara')
    R['papier']=pg.evaluate("""()=>{const a={enabled:true,defaultMode:'A',base:10,lacunes:[{idx:1,mode:'A'},{idx:3,mode:'C'}],consigne:''};const t='Le petit chat dort sur le tapis rouge.';
       const tx=x=>x.replace(/<style[\\s\\S]*?<\\/style>/gi,'').replace(/<script[\\s\\S]*?<\\/script>/gi,'').replace(/<[^>]+>/g,' ');
       const h1=buildAmenageePapierHtml({title:'',text:t,tokens:tokenize(t),base:20},a,'dictee_zz'),h2=buildAmenageePapierHtml({title:'Dictée ZZTEST',text:t,tokens:tokenize(t),base:20},a,'dictee_zz');
       return {mot:/am[ée]nag/i.test(tx(h1)+tx(h2)),id:/dictee_zz/.test(tx(h2)),titre1:(h1.match(/<title>([^<]*)<\\/title>/)||[])[1],titre2:(h2.match(/<title>([^<]*)<\\/title>/)||[])[1]};}""")
    R['export']=pg.evaluate("""()=>{const res=window.__LIRE('correction_dictee/dictee_zz/results');const j=buildDicteeJSON({title:'Dictée ZZTEST',classe:'ZZTEST 5e',niveau:'5e',base:12,text:'',eleves:['ZZTEST ALPHA Anna','ZZTEST BETA Bruno','ZZTEST GAMMA Clara'],competences:[]},res,{});
       return {eleves:j.eleves.map(e=>[e.prenom,e.note,e.note_sur]),bilan:j.bilan_classe,mot:/am[ée]nag/i.test(JSON.stringify(j))};}""")
    R['ecritures']=pg.evaluate('window.__ECRITURES'); R['err']=err; R['ext']=[x for x in ext if 'fonts.g' not in x[1]]
    ETAT=pg.evaluate("window.__LIRE('')"); b.close()
    b,pg,errE,extE=ouvrir(pw,'http://127.0.0.1:8765/'+os.path.basename(LIV),ETAT)
    pg.evaluate("sessionStorage.setItem('mjpc_eleve',JSON.stringify({nom:'ZZTEST',prenom:'BETA Bruno',display:'ZZTEST BETA Bruno',classe:'zztest_5e',ts:Date.now()}))"); pg.reload(); time.sleep(2.5)
    try: pg.click('text=Mode élève'); time.sleep(2)
    except Exception: pass
    try: pg.click('button:has-text("👤")'); time.sleep(2.5)
    except Exception: pass
    R['eleve_liste']=pg.locator('body').inner_text()[:600]; pg.screenshot(path=f'{D}/eleve-liste.png')
    try: pg.click('text=Dictée ZZTEST'); time.sleep(3)
    except Exception: pass
    R['eleve_ecran']=pg.locator('body').inner_text()[:1500]; pg.screenshot(path=f'{D}/eleve-dictee.png')
    tout=R['eleve_liste']+' '+R['eleve_ecran']; R['eleve_mots']={m:(m in tout) for m in ['aménag','Aménag','PAP','◆','pap-15']}; R['eleve_err']=errE; b.close()
SRV.terminate(); apres=vrai_hub()
has=lambda s,t: t in (s or '')
c0=R['cartes0']; c5=R['cartes5']
chk=[
 ('avant (6.5.0) : pas de ligne PAP ; Anna « 8/20 »', R['avant_pap']==0 and has(R['avant_cartes'].get('Z. Anna'),'8/20'), R['avant_cartes']),
 ('la ligne PAP de la capture T284-e4', has(R['pap0'],'1 élève pap-15') and has(R['pap0'],'aménagés pour cette dictée, d’après leur fiche') and has(R['pap0'],'Tout passer en non aménagé pour cette dictée') and has(R['pap0'],'ou élève par élève, par le clic droit'), R['pap0']),
 ('Bruno « aménagé » d’après sa fiche', has(c0.get('Z. Bruno'),'aménagé'), c0.get('Z. Bruno')),
 ('l’ancienne copie d’Anna tracée une fois (aménagée, « A+C », base 10) et affichée « 8/10 »', (R['trace_anna'] or {}).get('amenagee') is True and R['trace_anna'].get('mode')=='A+C' and R['trace_anna'].get('base')==10 and has(c0.get('Z. Anna'),'8/10') and len(R['migrations'])==1, (R['trace_anna'],len(R['migrations']))),
 ('le clic droit : plus d’entrée « registre » ; un clic → « non aménagé (cette dictée) » ; un second → retour à la fiche', not any('registre' in t for t in R['menu1']+R['menu2']) and R['ov1']=={'zztest_beta_bruno':False} and has(R['cartes1'].get('Z. Bruno'),'non aménagé (cette dictée)') and (R['ov2'] in (None,{})) and has(R['cartes2'].get('Z. Bruno'),'aménagé'), (R['menu1'],R['ov1'],R['ov2'])),
 ('le bloc : « Tout passer en non aménagé » puis « Tout repasser en aménagé (leur fiche) »', R['ov3']=={'zztest_beta_bruno':False} and has(R['pap3'],'non aménagés pour cette dictée') and (R['ov4'] in (None,{})) and has(R['pap4'],'d’après leur fiche'), (R['ov3'],R['ov4'])),
 ('copie de Bruno : « Enregistrer (10/10) », note 10, trace aménagée « A+C » base 10', (R['res_bruno'] or {}).get('note')==10 and R['res_bruno'].get('amenagee') is True and R['res_bruno'].get('mode')=='A+C' and R['res_bruno'].get('base')==10, R['res_bruno']),
 ('copie de Clara : « Enregistrer (20/20) », note 20, non aménagée (aucune base écrite)', (R['res_clara'] or {}).get('note')==20 and R['res_clara'].get('amenagee') is False and 'base' not in R['res_clara'] and 'baseDictee' not in R['res_clara'], R['res_clara']),
 ('les cartes : « 10/10 » et « 20/20 »', has(c5.get('Z. Bruno'),'10/10') and has(c5.get('Z. Clara'),'20/20'), c5),
 ('l’encart « Moyenne » : « 20/20 », puis « 2 copies aménagées — moyenne 9/10 »', has(R['moyenne1'],'20/20') and has(R['moyenne1'],'2 copies aménagées — moyenne 9/10'), R['moyenne1']),
 ('rendre les copies (geste) : la dictée est rendue', bool(R['rendue']), R['rendue']),
 ('la base 20 → 12 : Clara recalculée 12 ; Anna 8 et Bruno 10 intactes', R['config_base']==12 and R['apres_base']=={'zztest_alpha_anna':8,'zztest_beta_bruno':10,'zztest_gamma_clara':12}, R['apres_base']),
 ('sans rouvrir, le bilan se met à jour : « 12/12 » et « 2 copies aménagées — moyenne 9/10 »', has(R['moyenne2'],'12/12') and has(R['moyenne2'],'moyenne 9/10'), R['moyenne2']),
 ('une nouvelle copie normale se note sur la base actuelle : « Enregistrer (12/12) »', has(R['lib_clara2'],'12/12') and (R['res_clara2'] or {}).get('note')==12, (R['lib_clara2'],R['res_clara2'] and R['res_clara2'].get('note'))),
 ('la feuille papier (par la fonction) : aucun « aménag… », pas d’identifiant, titres « Dictée » / « Dictée ZZTEST »', R['papier']['mot'] is False and R['papier']['id'] is False and R['papier']['titre1']=='Dictée' and R['papier']['titre2']=='Dictée ZZTEST', R['papier']),
 ('le bilan exporté (par la fonction) : chaque note avec sa base ; moyenne sur 12 des seules copies sur 12 ; aucun mot', R['export']['eleves']==[['Anna',8,10],['Bruno',10,10],['Clara',12,12]] and R['export']['bilan'].get('moyenne')==12 and R['export']['bilan'].get('moyenne_sur')==12 and R['export']['bilan'].get('corriges')==1 and R['export']['mot'] is False, R['export']),
 ('l’écran de Bruno (élève) : sa note « 10/10 », ni « aménagé », ni « PAP », ni ◆', ('10/10' in R['eleve_liste']+R['eleve_ecran']) and not any(R['eleve_mots'].values()) and R['eleve_err']==[], (R['eleve_mots'],re.findall(r'\d+/\d+',R['eleve_liste']+' '+R['eleve_ecran'])[:6])),
 ('0 erreur JS, 0 sortie du navigateur', R['err']==[] and R['ext']==[], (R['err'],R['ext'])),
 ('vrai hub inchangé (lu avant et après)', avant==apres, (avant,apres)),
]
ok=True
for nom,res,val in chk: print(('OK  ' if res else 'ÉCHEC ')+nom+' — '+json.dumps(val,ensure_ascii=False,default=str)[:230]); ok=ok and bool(res)
json.dump(R,open(f'{D}/resultats.json','w'),ensure_ascii=False,indent=1,default=str)
print('BANC UNIQUE :','VERT (0 échec)' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
