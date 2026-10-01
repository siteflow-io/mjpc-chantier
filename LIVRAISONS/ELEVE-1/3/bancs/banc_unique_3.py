# BANC UNIQUE ELEVE-1 ③ — rejoue tout d'une commande ; échoue si UN SEUL échoue.
import sys,os,json,time,subprocess,urllib.request
from banc_3 import *
from banc_vue_eleve import jouer as vue
from PIL import Image, ImageChops
HUB='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app'
def vrai_hub(): return {n:len(json.load(urllib.request.urlopen(f'{HUB}/{n}.json?shallow=true')) or {}) for n in ['classes','codes','eleves','eleves_index','corbeille','manifestes','classes_amenages']}
BASE,LIV,D=sys.argv[1:4]
SRV=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd=os.path.dirname(LIV),stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
URL='http://127.0.0.1:8765/'+os.path.basename(LIV); avant=vrai_hub(); R={}
with sync_playwright() as pw:
    hub=hub0(); b,pg,err,ext=ouvrir(pw,URL,hub,'2026-09-10'); eleves(pg); cle(pg); R['cle']=pg.evaluate('SECU.valide')
    R['imp4']=importer_nouvelle(pg,'ZZTEST-4e.xlsx'); R['imp3']=importer_nouvelle(pg,'ZZTEST-3e.xlsx'); classe_vide(pg,'ZZTEST 5e','5e')
    R['r0910']=rappels(pg,'2026-09-10'); pg.locator('#tprof-content').screenshot(path=f'{D}/el-classes-0910.png')
    R['r0914']=rappels(pg,'2026-09-14'); R['r0915']=rappels(pg,'2026-09-15'); R['r0916']=rappels(pg,'2026-09-16'); pg.locator('#tprof-content').screenshot(path=f'{D}/el-classes-0916-cle.png')
    # la case de l'heure : par la fonction (déclaré), au 16/09 avant les fiches, sur des cases fictives de la semaine
    R['case']=pg.evaluate("""()=>{const cr=(AT_EDT&&AT_EDT.length)?AT_EDT:['08:00-09:00','09:00-10:00','10:00-11:00','11:00-12:00'];const cel={a:{iso:'2026-10-21',creneau:cr[2],classe:'4 ZZTEST',classeMjpc:'4_zztest'},b:{iso:'2026-10-19',creneau:cr[3],classe:'4 ZZTEST',classeMjpc:'4_zztest'},c:{iso:'2026-10-19',creneau:cr[1],classe:'ZZTEST 5e',classeMjpc:'zztest_5e'}};
      const p=elfPremieresCases(cel,cr);return {premieres:p,html:Object.keys(p).map(k=>[k,elfRappelCaseHtml(p[k])])};}""")
    ouvrir_fiche(pg,'4 ZZTEST','ZZTEST BETA Bruno'); R['f_tete']=pg.locator('.elf-tete').inner_text(); R['f_sous']=pg.locator('.elf-sous').inner_text()
    R['f_disp_on']=pg.locator('#elf-disp-oui.on').count()==1; pg.locator('#elf').screenshot(path=f'{D}/el-fiche-vide.png')
    pg.check('#elf-c-pap-03'); pg.check('#elf-c-pap-15'); pg.fill('#elf-r-pap-03','lecture par un tiers en évaluation'); pg.fill('#elf-syn','vigilance : fatigue en fin de journée')
    pg.click('.tprof-section-btn[data-section="eleves"]'); time.sleep(1.5)   # un redessin pendant la saisie
    R['f_redessin_garde']=[pg.is_checked('#elf-c-pap-03'),pg.is_checked('#elf-c-pap-15'),pg.input_value('#elf-r-pap-03'),pg.input_value('#elf-syn')]
    pg.click('#elf-enregistrer'); pg.wait_for_selector('#elf-msg',timeout=15000); time.sleep(0.8); R['f_msg']=pg.locator('#elf-msg').inner_text()
    pg.locator('#elf').screenshot(path=f'{D}/el-fiche-remplie.png'); R['p_bruno']=profil(pg,'4_zztest','zztest_beta_bruno')
    pg.click('.elf-retour'); time.sleep(0.8); ouvrir_fiche(pg,'4 ZZTEST','ZZTEST BETA Bruno')
    R['f_rouverte']=[pg.is_checked('#elf-c-pap-03'),pg.is_checked('#elf-c-pap-15'),pg.is_checked('#elf-c-pap-01'),pg.input_value('#elf-r-pap-03'),pg.input_value('#elf-syn'),pg.locator('#elf-majle').inner_text()]
    ouvrir_fiche(pg,'4 ZZTEST','ZZTEST ALPHA Anna'); pg.click('#elf-disp-oui'); pg.click('#elf-enregistrer'); pg.wait_for_selector('#elf-msg',timeout=15000); time.sleep(0.8)
    R['p_alpha']=profil(pg,'4_zztest','zztest_alpha_anna')
    ouvrir_fiche(pg,'4 ZZTEST','ZZTEST GAMMA Clara'); pg.click('#elf-sexe-m'); time.sleep(1.2); R['p_clara']=profil(pg,'4_zztest','zztest_gamma_clara')
    pg.click('.elf-retour'); time.sleep(1.5); R['flags']=pg.evaluate("[...document.querySelectorAll('.elf-flag')].filter(e=>e.textContent==='◆').map(e=>e.id)")
    R['r0916b']=rappels(pg,'2026-09-16'); pg.locator('#tprof-content').screenshot(path=f'{D}/el-classes-0916-eteint.png')
    R['r1020']=rappels(pg,'2026-10-20')
    R['A_hub']=[e for e in hub.ecritures if e['phase']=='test']; R['A_ext']=ext; R['A_err']=err
    b.close()
    # mobile : la fiche à 390 et 360 px — « Enregistrer la fiche » reste visible en bas, le contenu défile
    for w,hgt in ((390,844),(360,740)):
        hub=hub0(); b,pg,err2,ext2=ouvrir(pw,URL,hub,'2026-09-16',(w,hgt)); eleves(pg); cle(pg); importer_nouvelle(pg,'ZZTEST-4e.xlsx'); ouvrir_fiche(pg,'4 ZZTEST','ZZTEST BETA Bruno')
        pg.evaluate("()=>{const c=document.getElementById('tprof-content');if(c)c.scrollTop=c.scrollHeight/3;}"); time.sleep(0.5)
        bb=pg.locator('#elf-enregistrer').bounding_box(); R[f'mobile_{w}']={'bouton':bb,'visible':bool(bb and bb['y']>=0 and bb['y']+bb['height']<=hgt),'err':err2}
        pg.screenshot(path=f'{D}/el-fiche-{w}px.png'); b.close()
    # sans la clé
    hub=hub0(); b,pg,err,ext=ouvrir(pw,URL,hub,'2026-09-16'); eleves(pg); R['B_imp']=importer_nouvelle(pg,'ZZTEST-4e.xlsx')
    R['B_r0916']=rappels(pg,'2026-09-16'); pg.locator('#tprof-content').screenshot(path=f'{D}/el-classes-0916-sans-cle.png')
    ouvrir_fiche(pg,'4 ZZTEST','ZZTEST BETA Bruno'); R['B_sous']=pg.locator('.elf-sous').inner_text(); R['B_cases_inactives']=pg.locator('#elf-c-pap-01').is_disabled()
    pg.locator('#elf').screenshot(path=f'{D}/el-fiche-sans-cle.png')
    pg.click('#elf-enregistrer'); time.sleep(0.6); R['B_fenetre']=pg.locator('.cm-sub').last.inner_text() if pg.locator('.cm-sub').count() else None
    pg.locator('.cm-btn').filter(has_text='Compris').click(); time.sleep(0.4)
    pg.click('#elf-sexe-f'); time.sleep(1.2); R['B_sexe']=pg.evaluate("(_m8Superposer('/classes',{})['4_zztest'].amenagements||{}).zztest_beta_bruno")
    R['B_hub']=[e for e in hub.ecritures if e['phase']=='test']; R['B_ext']=ext; R['B_err']=err; b.close()
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
g=lambda d,n: next((v for k,v in (d or {}).items() if k.startswith(n)),None)
pb=R.get('p_bruno') or {}; pa=R.get('p_alpha') or {}; pc=R.get('p_clara') or {}
chk=[
 ('09-10 (avant l’ESS) : 4e — « ESS de la 4e : mardi 15/09 », Bruno nommé « jamais cochées », la marge lit la 1re date', 'mardi 15/09' in (g(R.get('r0910'),'4 ZZTEST') or '') and 'ZZTEST BETA Bruno — jamais cochées' in (g(R.get('r0910'),'4 ZZTEST') or '') and '18h30 Parents 4e' in (g(R.get('r0910'),'4 ZZTEST') or ''), g(R.get('r0910'),'4 ZZTEST')),
 ('09-10 : 3e sans ESS au calendrier — la ligne de septembre sans date ; 5e sans fléché — « rien à signaler »', 'leurs cases PAP sont à mettre à jour' in (g(R.get('r0910'),'3 ZZTEST') or '') and (g(R.get('r0910'),'ZZTEST 5e') or '').startswith('rien à signaler'), (g(R.get('r0910'),'3 ZZTEST'),g(R.get('r0910'),'ZZTEST 5e'))),
 ('09-14 : « c’est demain »', 'c’est demain' in (g(R.get('r0914'),'4 ZZTEST') or ''), g(R.get('r0914'),'4 ZZTEST')),
 ('09-15 : « aujourd’hui »', 'aujourd’hui' in (g(R.get('r0915'),'4 ZZTEST') or ''), g(R.get('r0915'),'4 ZZTEST')),
 ('09-16 : « les cases de 4 ZZTEST sont-elles à jour ? »', 'sont-elles à jour' in (g(R.get('r0916'),'4 ZZTEST') or ''), g(R.get('r0916'),'4 ZZTEST')),
 ('fiche de Bruno : « ◆ ZZTEST BETA Bruno — 4 ZZTEST », né le 27/09/2013, dispositif oui, « jamais »', R.get('f_tete','').startswith('◆ ZZTEST BETA Bruno — 4 ZZTEST') and 'né le 27/09/2013' in R.get('f_sous','') and R.get('f_disp_on') and 'jamais' in R.get('f_sous',''), (R.get('f_tete'),R.get('f_sous'))),
 ('un redessin pendant la saisie n’efface rien', R.get('f_redessin_garde')==[True,True,'lecture par un tiers en évaluation','vigilance : fatigue en fin de journée'], R.get('f_redessin_garde')),
 ('enregistrée : cases [pap-03, pap-15], remarque et synthèse chiffrées, majLe 2026-09-16, « dictée aménagée » pour les apps', pb.get('pap')=='["pap-03","pap-15"]' and 'lecture par un tiers' in (pb.get('remarques') or '') and 'fatigue' in (pb.get('synthese') or '') and pb.get('majLe')=='2026-09-16' and (pb.get('amen') or {}).get('dicteeAmenagee') is True, pb),
 ('rouverte : les cases et les textes reviennent ; « cases cochées le 16/09/2026 »', R.get('f_rouverte')==[True,True,False,'lecture par un tiers en évaluation','vigilance : fatigue en fin de journée','16/09/2026'], R.get('f_rouverte')),
 ('Anna : dispositif non → oui, le compte de la classe 1 → 2', pa.get('dispositif')=='true' and pa.get('nb')==2, (pa.get('dispositif'),pa.get('nb'))),
 ('Clara : le sexe M, aussitôt, à la fiche et pour les apps', pc.get('sexe')=='m' and (pc.get('amen') or {}).get('sexe')=='m', (pc.get('sexe'),pc.get('amen'))),
 ('la liste : ◆ à côté d’Anna et de Bruno', sorted(R.get('flags',[]))==['elf-flag-zztest_alpha_anna','elf-flag-zztest_beta_bruno'], R.get('flags')),
 ('09-16, les deux fiches cochées après l’ESS : le rappel de la 4e s’éteint (la marge reste)', 'sont-elles' not in (g(R.get('r0916b'),'4 ZZTEST') or '') and 'lu dans le calendrier' in (g(R.get('r0916b'),'4 ZZTEST') or ''), g(R.get('r0916b'),'4 ZZTEST')),
 ('10-20 : hors septembre, la 3e (sans ESS) — plus rien', g(R.get('r1020'),'3 ZZTEST') is None, g(R.get('r1020'),'3 ZZTEST')),
 ('la case de l’heure (par la fonction, le 16/09) : la 1re heure de la semaine de la 4e porte « 1 fléché · cases PAP (ESS 15/09) », aucun nom ; la 5e (sans fléché) rien', any(('4 ZZTEST' in k) and ('1 fléché · cases PAP (ESS 15/09)' in h) and ('ZZTEST' not in h) for k,h in (R.get('case') or {}).get('html',[])) and all(h=='' for k,h in (R.get('case') or {}).get('html',[]) if 'ZZTEST 5e' in k) and any(('2026-10-19' in k and '4 ZZTEST' in k) for k in (R.get('case') or {}).get('premieres',{})), (R.get('case') or {}).get('html')),
 ('mobile 390 et 360 px : « Enregistrer la fiche » visible, 0 erreur', R.get('mobile_390',{}).get('visible') and R.get('mobile_360',{}).get('visible') and not R.get('mobile_390',{}).get('err') and not R.get('mobile_360',{}).get('err'), (R.get('mobile_390'),R.get('mobile_360'))),
 ('sans la clé : rappel « 1 élève à dispositif … saisis ta clé pour ouvrir leurs fiches »', 'saisis ta clé pour ouvrir leurs fiches' in (g(R.get('B_r0916'),'4 ZZTEST') or '') and '1 élève à dispositif' in (g(R.get('B_r0916'),'4 ZZTEST') or ''), g(R.get('B_r0916'),'4 ZZTEST')),
 ('sans la clé : la fiche s’ouvre, « saisis ta clé », cases inactives ; « Enregistrer » → la fenêtre propre à la fiche ; le sexe s’écrit quand même', 'saisis ta clé' in R.get('B_sous','') and R.get('B_cases_inactives') and 'nécessaire pour enregistrer la fiche' in (R.get('B_fenetre') or '') and (R.get('B_sexe') or {}).get('sexe')=='f', (R.get('B_fenetre'),R.get('B_sexe'))),
 ('0 écriture au hub, 0 hors hub, 0 erreur JS (avec et sans clé)', R.get('A_hub')==[] and R.get('B_hub')==[] and R.get('A_ext')==[] and R.get('B_ext')==[] and R.get('A_err')==[] and R.get('B_err')==[], {k:R.get(k) for k in ['A_hub','B_hub','A_err','B_err']}),
 ('vue élève : 0 erreur, aucun mot interdit, mêmes écritures ; seul écart la pastille', vb['erreurs_js']==[] and vl['erreurs_js']==[] and not any(vl['mots_interdits'].values()) and vb['ecritures_hub']==vl['ecritures_hub'] and all((c[0]>=1380 and c[1]>=850) or (c[2]-c[0]+1)*(c[3]-c[1]+1)<=25 for c in dv), dv),
 ('vrai hub inchangé', avant==apres, (avant,apres)),
]
ok=True
for nom,res,val in chk: print(('OK  ' if res else 'ÉCHEC ')+nom+('' if val is None else ' — '+json.dumps(val,ensure_ascii=False,default=str)[:260])); ok=ok and bool(res)
json.dump({'R':R,'vue':{'base':vb,'livree':vl},'hub':[avant,apres]},open(f'{D}/resultats.json','w'),ensure_ascii=False,indent=1,default=str)
print('BANC UNIQUE :','VERT (0 échec)' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
