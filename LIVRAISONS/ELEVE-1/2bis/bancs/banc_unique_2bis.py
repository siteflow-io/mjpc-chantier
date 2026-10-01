# BANC UNIQUE ② bis — par le geste, base EN MÉMOIRE (faux Firebase), données ZZTEST ; échoue si UNE SEULE vérification échoue.
# Hors geste, déclaré : l'empreinte du code prof d'essai ; la lecture de la base simulée pour prouver ; pour les captures, la liste
# « Classe » est dépliée (attribut size) — un menu déroulant natif ne se photographie pas.
import sys,os,json,time,subprocess,re,urllib.request
from banc_2bis import *
HUB='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app'
def vrai_hub(): return {n:len(json.load(urllib.request.urlopen(f'{HUB}/{n}.json?shallow=true')) or {}) for n in ['classes','correction_dictee','corbeille','codes']}|{'qcm_classes':len(json.load(urllib.request.urlopen(f'{HUB}/qcm/classes.json?shallow=true')) or {})}
D='/home/claude/work5/captures'
SRV=subprocess.Popen(['python3','-m','http.server','8766','--bind','127.0.0.1'],cwd='/home/claude/work5',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
def options(pg,lab):
    return [pg.locator('.config-field:has(label:has-text("'+lab+'")) select').nth(i).locator('option').all_inner_texts() for i in range(pg.locator('.config-field:has(label:has-text("'+lab+'")) select').count())]
def niveau(pg,v,idx=-1):
    sel=pg.locator('.config-field:has(label:has-text("Niveau")) select'); n=sel.count(); sel.nth(idx if idx>=0 else n-1).select_option(v); time.sleep(0.6)
def deplier_capture(pg,path):
    pg.evaluate("()=>{document.querySelectorAll('.config-field select').forEach(s=>{if(s.parentElement&&/Classe/.test(s.parentElement.innerText))s.setAttribute('size',Math.max(2,s.options.length));});}"); time.sleep(0.4)
    el=pg.locator('.config-field:has(label:has-text("Classe")) select').last; bb=el.bounding_box(); fl=pg.locator('.config-field:has(label:has-text("Niveau"))').last.bounding_box()
    x0=min(bb['x'],fl['x'])-12; y0=min(bb['y'],fl['y'])-40; x1=max(bb['x']+bb['width'],fl['x']+fl['width'])+12; y1=max(bb['y']+bb['height'],fl['y']+fl['height'])+12
    pg.screenshot(path=path,clip={'x':max(0,x0),'y':max(0,y0),'width':x1-max(0,x0),'height':y1-max(0,y0)})
QCM_EXTRA={'qcm':{'classes':{'3e-charles-de-gaulle':{'nom':'3E Charles de Gaulle','eleves':['ZZTEST TEMOIN Un']},'zztest-fantome':{'nom':'ZZTEST FANTOME','niveau':'4e','eleves':['ZZTEST FANTOME Un','ZZTEST FANTOME Deux']}}}}
DICTEE_EXTRA={'correction_dictee':{'dictee_zz3':{'config':{'title':'Dictée ZZTEST 3e','classe':'3E Charles de Gaulle','niveau':'3e','base':20,'bareme':'preparee','text':'Le chat dort.','published':True},'results':{}}}}
avant=vrai_hub(); R={}
with sync_playwright() as pw:
    for tag,f in (('base','dictee-6.6.0.html'),('livree','dictee-6.6.1.html')):
        b,pg,err,ext,dial=ouvrir(pw,'http://127.0.0.1:8766/'+f,hub(DICTEE_EXTRA)); prof(pg)
        niveau(pg,'3e'); R['dictee_nouvelle_'+tag]=options(pg,'Classe')[-1]; deplier_capture(pg,f'{D}/dictee-classe-3e-{tag}.png')
        try:
            pg.locator('button:has-text("✏️"), span:has-text("✏️")').first.click(); time.sleep(1.5); R['dictee_edition_'+tag]=options(pg,'Classe')[0] if pg.locator('.config-field:has(label:has-text("Classe")) select').count()>1 else 'formulaire d’édition non ouvert'
        except Exception as e: R['dictee_edition_'+tag]='ERREUR '+str(e)[:80]
        R['dictee_err_'+tag]=err; R['dictee_ext_'+tag]=ext; b.close()
    for tag,f in (('base','reecriture-2.4.0.html'),('livree','reecriture-2.4.1.html')):
        b,pg,err,ext,dial=ouvrir(pw,'http://127.0.0.1:8766/'+f,hub()); prof(pg); niveau(pg,'3e'); R['reec_'+tag]=options(pg,'Classe')[-1]; deplier_capture(pg,f'{D}/reecriture-classe-3e-{tag}.png')
        R['reec_err_'+tag]=err; R['reec_ext_'+tag]=ext; b.close()
    for tag,f in (('base','qcm-7.7.0.html'),('livree','qcm-7.7.1.html')):
        b,pg,err,ext,dial=ouvrir(pw,'http://127.0.0.1:8766/'+f,hub(QCM_EXTRA)); prof(pg); time.sleep(2)
        W=pg.evaluate('window.__ECRITURES'); R['qcm_ecritures_classes_'+tag]=[w for w in W if w[1].startswith('classes')]; R['qcm_dialogues_'+tag]=list(dial)
        R['qcm_fantome_dans_classes_'+tag]=pg.evaluate("Object.keys(window.__LIRE('classes')||{}).filter(k=>/FANTOME/i.test(k))")
        pg.screenshot(path=f'{D}/qcm-prof-{tag}.png')
        R['qcm_options_'+tag]=[t for t in pg.locator('select option').all_inner_texts() if 'élèves)' in t]
        try:
            sel=pg.locator('select:has(option:has-text("élèves)"))').first; pg.evaluate("(e)=>e.setAttribute('size',e.options.length)",sel.element_handle()); time.sleep(0.3); sel.screenshot(path=f'{D}/qcm-classes-{tag}.png')
        except Exception: pass
        if tag=='livree':
            pg.click('button.nav2-groupe:has-text("Données")'); time.sleep(1); pg.get_by_text('💾 Sauvegarde',exact=False).first.click(); time.sleep(1.5); n0=len(dial)
            pg.locator('#ranger-ancien-carnet').scroll_into_view_if_needed(); pg.locator('#ranger-ancien-carnet').screenshot(path=f'{D}/qcm-bouton.png')
            zone=pg.locator('div:has(> h3:has-text("Maintenance"))').first
            if zone.count(): zone.screenshot(path=f'{D}/qcm-maintenance.png')
            pg.click('#ranger-ancien-carnet'); time.sleep(2.5); R['qcm_rangement_dialogues']=dial[n0:]
            corb=pg.evaluate("window.__LIRE('corbeille')") or {}; R['qcm_corbeille']={k:{'meta':v.get('_meta'),'classes':sorted(((v.get('data') or {}).get('qcm') or {}).get('classes',{}).keys())} for k,v in corb.items()}
            R['qcm_classes_apres']=pg.evaluate("window.__LIRE('qcm/classes')"); R['qcm_manifeste_purger']=(pg.evaluate("window.__LIRE('manifestes/evaluation-qcm')") or {}).get('purge',{}).get('purger')
            n1=len(dial); pg.click('#ranger-ancien-carnet'); time.sleep(1.5); R['qcm_rangement_2e']=dial[n1:]
        R['qcm_err_'+tag]=err; R['qcm_ext_'+tag]=ext; b.close()
    for app,(fb,fl) in {'dictee':('dictee-6.6.0.html','dictee-6.6.1.html'),'reecriture':('reecriture-2.4.0.html','reecriture-2.4.1.html'),'qcm':('qcm-7.7.0.html','qcm-7.7.1.html')}.items():
        t=[]
        for f in (fb,fl):
            b,pg,err,ext,dial=ouvrir(pw,'http://127.0.0.1:8766/'+f,hub()); pg.click('text=Mode élève'); time.sleep(2); t.append((re.sub(r'\d+\.\d+\.\d+','v',pg.locator('body').inner_text()),err)); b.close()
        R['eleve_'+app]=(t[0][0]==t[1][0], t[0][1], t[1][1], t[1][0][:120])
SRV.terminate(); apres=vrai_hub()
has=lambda L,t: any(t in x for x in (L or []))
chk=[
 ('dictée 6.6.0 — « Nouvelle dictée », niveau 3e : la classe importée ZZTEST 3e ABSENTE', not has(R['dictee_nouvelle_base'],'ZZTEST 3e') and not has(R['dictee_nouvelle_base'],'zztest_3e') and has(R['dictee_nouvelle_base'],'3E Charles de Gaulle'), R['dictee_nouvelle_base']),
 ('dictée 6.6.1 — niveau 3e : « ZZTEST 3e (3) » présente, par son nom ; la 4e absente', has(R['dictee_nouvelle_livree'],'ZZTEST 3e (3)') and has(R['dictee_nouvelle_livree'],'3E Charles de Gaulle') and not has(R['dictee_nouvelle_livree'],'ZZTEST 4e'), R['dictee_nouvelle_livree']),
 ('dictée 6.6.1 — à l’édition (niveau 3e) : ZZTEST 3e présente', has(R['dictee_edition_livree'],'ZZTEST 3e'), (R['dictee_edition_base'],R['dictee_edition_livree'])),
 ('réécriture 2.4.0 — niveau 3e : ZZTEST 3e ABSENTE ; 2.4.1 : présente par son nom, la 4e absente', not has(R['reec_base'],'ZZTEST 3e') and has(R['reec_livree'],'ZZTEST 3e (3)') and not has(R['reec_livree'],'ZZTEST 4e'), (R['reec_base'],R['reec_livree'])),
 ('QCM 7.7.0 — à l’ouverture, recrée la classe de l’ancien carnet (la fuite)', len(R['qcm_ecritures_classes_base'])>0 and R['qcm_fantome_dans_classes_base']!=[], (R['qcm_ecritures_classes_base'],R['qcm_fantome_dans_classes_base'])),
 ('QCM 7.7.1 — 0 écriture vers /classes, la classe ne revient pas, aucun message', R['qcm_ecritures_classes_livree']==[] and R['qcm_fantome_dans_classes_livree']==[] and R['qcm_dialogues_livree']==[], (R['qcm_ecritures_classes_livree'],R['qcm_dialogues_livree'])),
 ('« Ranger l’ancien carnet » : la corbeille reçoit les 2 classes (3 élèves), motif qcm-classes-legacy', any((v['meta'] or {}).get('motif')=='qcm-classes-legacy' and (v['meta'] or {}).get('classes')==2 and (v['meta'] or {}).get('eleves')==3 and v['classes']==['3e-charles-de-gaulle','zztest-fantome'] for v in R.get('qcm_corbeille',{}).values()), R.get('qcm_corbeille')),
 ('puis le nœud est vide, et le contrat de purge du QCM ne le porte plus', R.get('qcm_classes_apres') is None and isinstance(R.get('qcm_manifeste_purger'),list) and 'qcm/classes' not in R['qcm_manifeste_purger'], (R.get('qcm_classes_apres'),R.get('qcm_manifeste_purger'))),
 ('les messages : la confirmation dit le compte ; le second clic dit « déjà vide »', has(R.get('qcm_rangement_dialogues'),'2 classe(s) et 3 élève(s)') and has(R.get('qcm_rangement_2e'),'déjà vide'), (R.get('qcm_rangement_dialogues'),R.get('qcm_rangement_2e'))),
 ('QCM — la liste des classes montre leur NOM (7.7.0 : la clé « zztest_3e » ; 7.7.1 : « ZZTEST 3e (3 élèves) »)', has(R['qcm_options_base'],'zztest_3e (3 élèves)') and has(R['qcm_options_livree'],'ZZTEST 3e (3 élèves)') and not has(R['qcm_options_livree'],'zztest_3e'), (R['qcm_options_base'],R['qcm_options_livree'])),
 ('vues élève inchangées (dictée, réécriture, QCM) ; 0 erreur JS', all(R['eleve_'+a][0] and R['eleve_'+a][1]==[] and R['eleve_'+a][2]==[] for a in ('dictee','reecriture','qcm')), {a:R['eleve_'+a][:3] for a in ('dictee','reecriture','qcm')}),
 ('0 erreur JS et 0 sortie du navigateur (professeur)', all(R[k]==[] for k in R if k.endswith(('_err_base','_err_livree','_ext_base','_ext_livree'))), {k:R[k] for k in R if k.endswith(('_err_livree','_ext_livree'))}),
 ('vrai hub inchangé', avant==apres, (avant,apres)),
]
ok=True
for nom,res,val in chk: print(('OK  ' if res else 'ÉCHEC ')+nom+' — '+json.dumps(val,ensure_ascii=False,default=str)[:260]); ok=ok and bool(res)
json.dump(R,open(f'{D}/resultats.json','w'),ensure_ascii=False,indent=1,default=str)
print('BANC UNIQUE :','VERT (0 échec)' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
