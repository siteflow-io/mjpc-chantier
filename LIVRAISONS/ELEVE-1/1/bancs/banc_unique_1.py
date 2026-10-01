# BANC UNIQUE ELEVE-1 ① — rejoue tous les bancs du lot d'une commande ; échoue si UN SEUL échoue.
import sys,json,time,urllib.request
from banc_1 import jouer as banc1
from banc_vue_eleve import jouer as vue
from playwright.sync_api import sync_playwright
from hub_simule import Hub
from PIL import Image, ImageChops
HUB='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app'
def vrai_hub(): return {n:len(json.load(urllib.request.urlopen(f'{HUB}/{n}.json?shallow=true')) or {}) for n in ['classes','codes','eleves','eleves_index','corbeille','manifestes']}
def classe_test_survit(cible):
    """la dette rencontrée : une classe créée EN MODE TEST survit-elle à l'ouverture d'« Élèves & codes » ?"""
    hub=Hub(); hub.root['classes']={}; hub.root['codes']={}
    hub.root['manifestes']=json.load(urllib.request.urlopen(f'{HUB}/manifestes.json'))
    with sync_playwright() as pw:
        b=pw.chromium.launch(); pg=b.new_page(viewport={'width':1500,'height':960})
        pg.route('**/*',lambda route,req: hub.handle(route,req) if 'firebasedatabase.app' in req.url else (route.continue_() if req.url.startswith('file:') else route.abort()))
        pg.add_init_script("sessionStorage.setItem('mjpc_eleve',JSON.stringify({is_prof:true,display:'Professeur',ts:Date.now()}))")
        pg.goto('file://'+cible); time.sleep(2); pg.click('[onclick="openProfPanel()"]'); time.sleep(0.6); pg.click('#tprof-testpill'); time.sleep(0.6)
        pg.click('.tprof-section-btn[data-section="classes"]'); time.sleep(1); pg.click('[onclick="openCreateClassModal()"]'); time.sleep(0.3)
        pg.fill('#class-modal-nom','ZZTEST 5e'); pg.fill('#class-modal-annee','2026-2027'); pg.click('[onclick="submitCreateClass()"]'); time.sleep(0.8)
        pg.click('.tprof-section-btn[data-section="eleves"]')
        try: pg.wait_for_selector('#el-import-ta, .tprof-placeholder:not(:has-text("Chargement"))',timeout=10000)
        except Exception: pass
        time.sleep(0.8); r=pg.locator('.lens-pill:has-text("ZZTEST 5e")').count()
        ks=pg.evaluate('Object.keys(classesData)'); b.close(); print('   (survie',cible.split('/')[-1],': classes vues',ks,')'); return r==1
BASE,LIV,D=sys.argv[1],sys.argv[2],sys.argv[3]
avant=vrai_hub()
R=banc1(LIV,'livree',D); vb=vue(BASE,'base',D); vl=vue(LIV,'livree',D)
sb=classe_test_survit(BASE); sl=classe_test_survit(LIV)
apres=vrai_hub()
E=R.get('etapes',{}); A=E.get('A_nouvelle',{}).get('chips',[]); P=E.get('A_presente',{}).get('chips',[]); Bd=E.get('B_doublon',{}); C=E.get('C_colle',{}).get('chips',[]); N=E.get('D_noms',{}).get('chips',[])
has=lambda L,t: any(t in x for x in L)
def amas(p1,p2):
    m=ImageChops.difference(Image.open(p1).convert('RGB'),Image.open(p2).convert('RGB')).convert('L').point(lambda p:255 if p>16 else 0)
    W,H=m.size; px=m.load(); am=[]
    for y in range(H):
        for x in range(W):
            if not px[x,y]: continue
            for c in am:
                if c[0]-40<=x<=c[2]+40 and c[1]-40<=y<=c[3]+40: c[0]=min(c[0],x);c[1]=min(c[1],y);c[2]=max(c[2],x);c[3]=max(c[3],y);break
            else: am.append([x,y,x,y])
    return am
d=amas(f'{D}/base-vue-eleve.png',f'{D}/livree-vue-eleve.png')
chk=[
 ('la zone d’import est là, le cadre de secours aussi', R.get('zone_presente')==1 and R.get('cadre_secours_present')==1, (R.get('zone_presente'),R.get('cadre_secours_present'))),
 ('SheetJS chargé à la demande (1 fois, adresse cdnjs 0.18.5)', R.get('sheetjs_demande')==1, R.get('sheetjs_demande')),
 ('fichier A, aucune classe 3e : « nouvelle classe »', has(A,'nouvelle classe') and has(A,'3 ZZTEST'), A[:2]),
 ('fichier A : 25 élèves, 12 F · 12 M · 1 sans sexe, 1 dispositif', has(A,'25 élèves') and has(A,'12 F · 12 M · 1 sans sexe') and has(A,'1 dispositif'), [x for x in A if 'élève' in x or ' F ·' in x or 'dispositif' in x]),
 ('fichier A : colonnes ignorées Age, Régime ; 1 ligne sans nom ; 1 date illisible ; aucun doublon', has(A,'colonnes ignorées : Age, Régime') and has(A,'1 ligne sans nom') and has(A,'1 date de naissance illisible') and has(A,'✔ aucun doublon'), None),
 ('fichier A : 25 lignes au tableau', E.get('A_nouvelle',{}).get('lignes')==25, E.get('A_nouvelle',{}).get('lignes')),
 ('« 3 ZZTEST » = « ZZTEST 3e » (mots sans ordre, 3 = 3e) : déjà présente, à compléter', has(P,'déjà présente : ZZTEST 3e') and E.get('A_presente',{}).get('select')=='zztest_3e', P[1:2]),
 ('déjà présents 1 · nouveaux 24 ; 1 absent du fichier ; autre classe ouverte dite', has(P,'déjà présents : 1 · nouveaux : 24') and has(P,'absent du fichier') and has(P,'pas de la classe ouverte « ZZTEST 4e »'), None),
 ('Valider : le dit, et rien n’est écrit (magasin et hub identiques)', R.get('valider_rien_ecrit') is True and (R.get('valider_message') or '').startswith('L’écriture arrive'), R.get('valider_message')),
 ('fichier à doublon : refusé, les deux lignes nommées, Valider désactivé ; « x » lu comme oui', has(Bd.get('chips',[]),'lignes 8 et 33') and Bd.get('valider_desactive') is True and has(Bd.get('chips',[]),'« x » lu comme oui'), None),
 ('Ctrl+V du tableau : le même aperçu que le fichier', has(C,'tableau collé : 3 ZZTEST') and has(C,'25 élèves') and has(C,'12 F · 12 M · 1 sans sexe') and E.get('C_colle',{}).get('lignes')==25, None),
 ('Ctrl+V d’une liste de noms : un nom par ligne, 2 élèves', has(N,'un nom par ligne') and E.get('D_noms',{}).get('lignes')==2, None),
 ('Annuler efface l’aperçu', R.get('annuler_vide') is True, None),
 ('0 écriture au hub, 0 hors hub, en mode test ; 0 erreur JS', R.get('ecritures_hub_en_mode_test')==[] and R.get('externes_non_GET')==[] and R.get('erreurs_js')==[], (R.get('ecritures_hub_en_mode_test'),R.get('externes_non_GET'),R.get('erreurs_js'))),
 ('dette rencontrée : base ⓪ — la classe créée en mode test disparaît ; livrée — elle reste', sb is False and sl is True, (sb,sl)),
 ('vue élève : 0 erreur JS, aucun mot interdit, mêmes écritures', vb['erreurs_js']==[] and vl['erreurs_js']==[] and not any(vl['mots_interdits'].values()) and vb['ecritures_hub']==vl['ecritures_hub'], vl['mots_interdits']),
 ('vue élève : seuls écarts la pastille de version et des points ≤ 25 px² (étoiles animées)', all((c[0]>=1380 and c[1]>=850) or (c[2]-c[0]+1)*(c[3]-c[1]+1)<=25 for c in d), d),
 ('vrai hub inchangé', avant==apres, (avant,apres)),
]
ok=True
for nom,res,val in chk: print(('OK  ' if res else 'ÉCHEC ')+nom+('' if val is None else ' — '+json.dumps(val,ensure_ascii=False)[:220])); ok=ok and res
json.dump({'livree':R,'vue_base':vb,'vue_livree':vl,'classe_test_survit':{'base':sb,'livree':sl},'hub_avant':avant,'hub_apres':apres},open(f'{D}/resultats.json','w'),ensure_ascii=False,indent=1)
print('BANC UNIQUE :','VERT (0 échec)' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
