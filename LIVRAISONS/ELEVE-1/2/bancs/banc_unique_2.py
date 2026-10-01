# BANC UNIQUE ELEVE-1 ② — rejoue tout d'une commande ; échoue si UN SEUL échoue.
import sys,os,json,time,subprocess,urllib.request
from banc_2 import *
from banc_vue_eleve import jouer as vue
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright
HUB='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app'
def vrai_hub(): return {n:len(json.load(urllib.request.urlopen(f'{HUB}/{n}.json?shallow=true')) or {}) for n in ['classes','codes','eleves','eleves_index','corbeille','manifestes','classes_amenages']}|{'qcm_eleveSexes':len(json.load(urllib.request.urlopen(f'{HUB}/qcm/eleveSexes.json?shallow=true')) or {})}
BASE,LIV,QB,QL,D=sys.argv[1:6]
SRV=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd=os.path.dirname(LIV),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
URL='http://127.0.0.1:8765/'+os.path.basename(LIV); avant=vrai_hub(); R={}
with sync_playwright() as pw:
    # A — avec la clé : premier import, réimport, retrait
    hub=hub0(); b,pg,err,ext=ouvrir(pw,URL,hub,D,'A'); classe(pg,'ZZTEST 3e','3e'); eleves(pg); cle(pg); R['A_cle']=pg.evaluate('SECU.valide')
    choisir(pg,'ZZTEST-3e.xlsx'); R['A_chips']=chips(pg); pg.locator('#eli-apercu .eli-ap').screenshot(path=f'{D}/el-A-apercu.png')
    R['A_msg']=valider(pg); pg.locator('#eli-apercu .eli-ap').screenshot(path=f'{D}/el-A-resultat.png'); E1=etat(pg); R['A']=E1['classes'].get('zztest_3e'); R['A_corb']=[(c['k'].split('/')[-1],c['motif']) for c in E1['corbeille']]; R['A_tombes']=E1['tombes']
    choisir(pg,'ZZTEST-3e.xlsx'); R['A2_chips']=chips(pg); R['A2_msg']=valider(pg); E2=etat(pg); R['A2']=E2['classes'].get('zztest_3e')
    pg.click('.lens-pill:has-text("ZZTEST 3e")'); time.sleep(0.6)
    pg.locator('.el-row:has-text("ZZTEST DELTA Carl") button[title*="Retirer"]').click(); time.sleep(0.5); pg.locator('.cm-btn').filter(has_text='Oui, continuer').click(); time.sleep(2.5)
    E3=etat(pg); R['A3']=E3['classes'].get('zztest_3e'); cr=[c for c in E3['corbeille'] if c['motif']=='retrait-eleve']; R['A3_corb']=json.dumps(cr[0]['data'],ensure_ascii=False)[:400] if cr else None
    R['A_hub']=[e for e in hub.ecritures if e['phase']=='test']; R['A_ext']=ext; R['A_err']=err; b.close()
    # B — classe sans année ; sans la clé ; puis la clé
    hub=hub0(sans_annee=True); b,pg,err,ext=ouvrir(pw,URL,hub,D,'B'); eleves(pg); choisir(pg,'ZZTEST-3e.xlsx'); R['B_chips']=chips(pg)
    pg.click('#eli-valider'); time.sleep(0.6); R['B_titre']=pg.locator('#class-modal-title').inner_text(); R['B_ro']=pg.evaluate("document.getElementById('class-modal-nom').readOnly")
    pg.locator('#class-modal .class-modal-box').screenshot(path=f'{D}/el-B-fenetre-annee.png')
    pg.fill('#class-modal-annee','2026-2027'); pg.click('[onclick="submitCreateClass()"]'); pg.wait_for_selector('#eli-resultat',timeout=15000); time.sleep(0.6)
    R['B_msg']=pg.locator('#eli-resultat').inner_text(); EB=etat(pg); R['B']=EB['classes'].get('zztest_3e'); pg.locator('#eli-bloc').screenshot(path=f'{D}/el-B-attente.png')
    cle(pg); time.sleep(3); EB2=etat(pg); R['B2']=EB2['classes'].get('zztest_3e')
    R['B_hub']=[e for e in hub.ecritures if e['phase']=='test']; R['B_ext']=ext; R['B_err']=err; b.close()
    # C — aucune classe : la fenêtre « Nouvelle classe » pré-remplie
    hub=hub0(); b,pg,err,ext=ouvrir(pw,URL,hub,D,'C'); eleves(pg); cle(pg); choisir(pg,'ZZTEST-3e.xlsx'); pg.click('#eli-valider'); time.sleep(0.6)
    R['C_pre']=[pg.input_value('#class-modal-nom'),pg.input_value('#class-modal-niveau'),pg.input_value('#class-modal-annee')]
    pg.click('[onclick="submitCreateClass()"]'); pg.wait_for_selector('#eli-resultat',timeout=15000); time.sleep(0.6); EC=etat(pg); R['C']={k:(v['eleves'],v['nb']) for k,v in EC['classes'].items()}
    R['C_hub']=[e for e in hub.ecritures if e['phase']=='test']; R['C_err']=err; b.close()
    # D — archiver un élève qui a une fiche : l'archive enregistrée ne porte pas la fiche ; la corbeille, si
    hub=hub0(); hub.root['classes']['zztest_arch']={'nom':'ZZTEST ARCH','niveau':'3e','annee':'2026-2027','eleves':['ZZTEST ARCH Ada','ZZTEST ARCH Bob'],
      'profils':{'zztest_arch_ada':{'sexe':'f','naissance':'v1.AAAA.BBBB','dispositif':'v1.CCCC.DDDD','attente':False}},'amenagements':{'zztest_arch_ada':{'sexe':'f'}},'nbDispositifs':1}
    b,pg,err,ext=ouvrir(pw,URL,hub,D,'D'); pg.add_init_script("try{window.showSaveFilePicker=undefined;}catch(e){}"); pg.evaluate("window.showSaveFilePicker=undefined")
    pg.click('.tprof-section-btn[data-section="config"]'); time.sleep(1); pg.click('[onclick="_b2Open()"]'); time.sleep(2)
    pg.locator('.b2-row:has-text("ZZTEST ARCH Ada") input[type=checkbox]').check(); pg.locator('.cm-btn').filter(has_text='Archiver la sélection').click(); time.sleep(0.8)
    R['D_verif']=pg.locator('.b2-elv').all_inner_texts(); pg.locator('.cm-actions .cm-btn').last.click(); time.sleep(0.8)
    with pg.expect_download(timeout=10000) as dl: pg.locator('.cm-btn').filter(has_text='Enregistrer l’archive').click()
    arch=json.loads(open(dl.value.path()).read()); R['D_archive']=json.dumps(arch,ensure_ascii=False)[:500]; R['D_archive_sans_fiche']=('profils' not in json.dumps(arch)) and ('amenagements' not in json.dumps(arch))
    time.sleep(0.6); pg.fill('#b2cf','ARCHIVER'); pg.locator('.cm-btn').filter(has_text='Archiver définitivement').click(); time.sleep(3)
    S=pg.evaluate("(()=>{const o={};for(const k in M8_TEST_STORE)o[k]=M8_TEST_STORE[k];return o;})()")
    cb=[v for k,v in S.items() if k.startswith('/corbeille/') and v and (v.get('_meta') or {}).get('motif')=='archive-eleves']
    R['D_corbeille_a_la_fiche']=bool(cb) and 'zztest_arch_ada' in json.dumps((cb[0].get('data') or {}).get('classes',{}))
    R['D_effaces']=[k for k,v in S.items() if v is None and 'zztest_arch' in k]
    R['D_hub']=[e for e in hub.ecritures if e['phase']=='test']; R['D_err']=err; b.close()
SRV.terminate()
vb=vue(BASE,'base',D); vl=vue(LIV,'livree',D); apres=vrai_hub()
def amas(p1,p2):
    m=ImageChops.difference(Image.open(p1).convert('RGB'),Image.open(p2).convert('RGB')).convert('L').point(lambda p:255 if p>16 else 0); W,H=m.size; px=m.load(); am=[]
    for y in range(H):
        for x in range(W):
            if not px[x,y]: continue
            for c in am:
                if c[0]-40<=x<=c[2]+40 and c[1]-40<=y<=c[3]+40: c[0]=min(c[0],x);c[1]=min(c[1],y);c[2]=max(c[2],x);c[3]=max(c[3],y);break
            else: am.append([x,y,x,y])
    return am
dv=amas(f'{D}/base-vue-eleve.png',f'{D}/livree-vue-eleve.png')
q={}
for v,f in (('base',QB),('livree',QL)): q[v]=json.loads(subprocess.run(['node','qcm_harnais.js',f],capture_output=True,text=True).stdout)
A=R.get('A') or {}; P=A.get('profils',{}); pa=P.get('zztest_alpha_anna',{}); pb=P.get('zztest_beta_bruno',{}); pz=P.get('zztest_zeta_dan',{})
B=R.get('B') or {}; B2=R.get('B2') or {}; A2=R.get('A2') or {}; A3=R.get('A3') or {}
has=lambda L,t: any(t in x for x in (L or []))
chk=[
 ('A : clé saisie par le geste (encart), valide', R.get('A_cle') is True, R.get('A_cle')),
 ('A : aperçu — reprise 1 sexe du QCM · 1 aménagement de dictée ; restes 2 sexes + 1 aménagement → corbeille', has(R.get('A_chips'),'reprise : 1 sexe du QCM') and has(R.get('A_chips'),'1 aménagement de dictée') and has(R.get('A_chips'),'restes de l’an dernier'), [x for x in R.get('A_chips',[]) if 'reprise' in x or 'restes' in x]),
 ('A : écrit — 25 dans la liste, 25 fiches, 2 dispositifs (1 du fichier + 1 repris)', A.get('eleves')==25 and len(P)==25 and A.get('nb')==2, (A.get('eleves'),len(P),A.get('nb'))),
 ('A : fiche chiffrée — naissance « 2012-01-01 », dispositif « false » (Anna) ; en clair : seulement sexe, attente, majLe', pa.get('naissance')=='"2012-01-01"' and pa.get('dispositif')=='false' and pa.get('attente') is False and set(pa.get('champs',[]))<= {'sexe','attente','naissance','dispositif','pap','majLe'}, pa),
 ('A : repris de la dictée (Bruno) — dispositif « true », case « pap-15 », dictée aménagée pour les apps', pb.get('dispositif')=='true' and pb.get('pap')=='["pap-15"]' and (A.get('amen',{}).get('zztest_beta_bruno') or {}).get('dicteeAmenagee') is True, (pb.get('dispositif'),pb.get('pap'),A.get('amen',{}).get('zztest_beta_bruno'))),
 ('A : date impossible (Zeta) — pas de naissance', pz.get('naissance') is None, pz.get('naissance')),
 ('A : sexe repris du QCM là où le fichier n’en donne pas (Ines : f) ; le fichier l’emporte ailleurs (Anna : f, le QCM disait m)', (A.get('amen',{}).get('zztest_iota_ines') or {}).get('sexe')=='f' and (A.get('amen',{}).get('zztest_alpha_anna') or {}).get('sexe')=='f', ((A.get('amen',{}).get('zztest_iota_ines')),(A.get('amen',{}).get('zztest_alpha_anna')))),
 ('A : restes de l’an dernier en corbeille (motif restes-eleve-1), puis effacés', ('restes-eleve-1' in [m for _,m in R.get('A_corb',[])]) and len(R.get('A_tombes',[]))==2, (R.get('A_corb'),R.get('A_tombes'))),
 ('A2 : réimport — « ta fiche l’emporte », 0 doublé (25), fiches identiques', has(R.get('A2_chips'),'réimport') and A2.get('eleves')==25 and A2.get('profils')==A.get('profils') and A2.get('nb')==2, (A2.get('eleves'),A2.get('nb'))),
 ('A3 : retrait d’un élève à dispositif — sa fiche part (en corbeille avec lui), le compte passe à 1', 'zztest_delta_carl' not in A3.get('profils',{}) and A3.get('nb')==1 and R.get('A3_corb') and 'zztest_delta_carl' in R.get('A3_corb'), (A3.get('nb'),(R.get('A3_corb') or '')[:120])),
 ('B : classe sans année — « Compléter la classe : son année scolaire », nom verrouillé, puis l’import continue', R.get('B_titre','').startswith('Compléter la classe') and R.get('B_ro') is True and B.get('annee')=='2026-2027' and B.get('eleves')==25, (R.get('B_titre'),B.get('annee'))),
 ('B : sans la clé — 25 fiches « en attente », aucune date au hub', sum(1 for p in B.get('profils',{}).values() if p.get('attente') is True)==25 and all(p.get('forme_naissance') is None for p in B.get('profils',{}).values()), None),
 ('B : la clé saisie — les 25 se chiffrent ; Anna « 2012-01-01 »', sum(1 for p in B2.get('profils',{}).values() if p.get('attente') is False)==25 and (B2.get('profils',{}).get('zztest_alpha_anna') or {}).get('naissance')=='"2012-01-01"', (B2.get('profils',{}).get('zztest_alpha_anna'))),
 ('C : aucune classe — fenêtre pré-remplie « 3 ZZTEST » · 3e · 2026-2027, puis 25 élèves écrits', R.get('C_pre')==['3 ZZTEST','3e','2026-2027'] and (R.get('C',{}).get('3_zztest') or [0])[0]==25, (R.get('C_pre'),R.get('C'))),
 ('D : l’archive transmissible ne porte ni fiche ni aménagement', R.get('D_archive_sans_fiche') is True, (R.get('D_archive') or '')[:160]),
 ('D : la corbeille (pour toi) garde la fiche ; fiche et aménagement effacés de la classe', R.get('D_corbeille_a_la_fiche') is True and any('profils/zztest_arch_ada' in k for k in R.get('D_effaces',[])) and any('amenagements/zztest_arch_ada' in k for k in R.get('D_effaces',[])), R.get('D_effaces')),
 ('A–D : 0 écriture au hub en mode test, 0 hors hub, 0 erreur JS', all(R.get(x)==[] for x in ['A_hub','B_hub','C_hub','D_hub','A_ext','B_ext','A_err','B_err','C_err','D_err']), {x:R.get(x) for x in ['A_hub','B_hub','C_hub','D_hub','A_err','B_err','C_err','D_err']}),
 ('QCM 7.6.0 (base) : lit qcm/eleveSexes et y écrit (la fuite à fermer)', 'qcm/eleveSexes' in q['base']['ecoutes'] and len(q['base']['ecritures'])>0, q['base']),
 ('QCM 7.7.0 : n’écoute plus que /classes ; sexes = ceux de la console (Anna f, Bruno m) ; rien de l’ancien nœud (Clara : aucun) ; 0 écriture', q['livree']['ecoutes']==['classes'] and q['livree']['sexes']=={'ZZTEST ALPHA Anna':'f','ZZTEST BETA Bruno':'m','ZZTEST GAMMA Clara':None} and q['livree']['ecritures']==[], q['livree']),
 ('vue élève : 0 erreur, aucun mot interdit, mêmes écritures ; seul écart la pastille', vb['erreurs_js']==[] and vl['erreurs_js']==[] and not any(vl['mots_interdits'].values()) and vb['ecritures_hub']==vl['ecritures_hub'] and all((c[0]>=1380 and c[1]>=850) or (c[2]-c[0]+1)*(c[3]-c[1]+1)<=25 for c in dv), dv),
 ('vrai hub inchangé', avant==apres, (avant,apres)),
]
ok=True
for nom,res,val in chk: print(('OK  ' if res else 'ÉCHEC ')+nom+('' if val is None else ' — '+json.dumps(val,ensure_ascii=False,default=str)[:240])); ok=ok and res
json.dump({'R':R,'qcm':q,'vue':{'base':vb,'livree':vl},'hub':[avant,apres]},open(f'{D}/resultats.json','w'),ensure_ascii=False,indent=1,default=str)
print('BANC UNIQUE :','VERT (0 échec)' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
