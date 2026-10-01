# BANC MICRO 6.6.2 — « la duplication est totale » — par le geste (le bouton ⧉ de la liste), base EN MÉMOIRE (faux Firebase), données ZZTEST.
# Rien ne sort du navigateur. Base 6.6.1 : la copie n'a que /config. Livrée 6.6.2 : tous les réglages, aucun état d'élève.
import sys,os,json,time,re,subprocess
sys.path.insert(0,'/home/claude/L2b/bancs')
from banc_2bis import hub, ouvrir, prof
from playwright.sync_api import sync_playwright
D=sys.argv[1] if len(sys.argv)>1 else '/tmp/microout'; os.makedirs(D,exist_ok=True)
SRV=subprocess.Popen(['python3','-m','http.server','8766','--bind','127.0.0.1'],cwd='/home/claude/MICRO',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
DICTEE={'correction_dictee':{'dictee_zz_amen':{
  'config':{'title':'Dictée ZZTEST aménagée','classe':'zztest_3e','niveau':'3e','base':20,'bareme':'brevet','text':'Le chat dort sur le mur.','published':True,'competences':['C1']},
  'dictee':{'amenagee':{'enabled':True,'defaultMode':'A','base':10,'consigne':'Complète les trous.','lacunes':[{'tokenIdx':1,'mode':'A','propositions':['chat','chas','chatte']},{'tokenIdx':4,'mode':'C','indice':'m…'}]}},
  'copyOptions':{'police':'grand','interligne':2},
  'exercices':{'ex1':{'titre':'Accord du verbe','items':['a','b']}},'exercices_html':'<p>exo</p>','binomes':{'zztest_alpha_anna':'zztest_beta_bruno'},'heure':'10:07',
  'results':{'zztest_alpha_anna':{'note':8,'errors':[],'amenagee':True,'mode':'A+C','base':10}},
  'absents':{'zztest_gamma_clara':True},'amenages':{'zztest_beta_bruno':False},'autocorrection':{'zztest_alpha_anna':{'fait':True}},
  'effacees':{'x':1},'exercices_results':{'zztest_alpha_anna':{'score':2}},'exercices_consultes':{'zztest_alpha_anna':1},'exercices_imprimes':{'a':1},'copyPublishedAt':123}}}
REGLAGES=["config","dictee","copyOptions","exercices","exercices_html","binomes","heure"]; ETAT=["results","absents","amenages","autocorrection","effacees","exercices_results","exercices_consultes","exercices_imprimes","copyPublishedAt"]
R={}; ok=[]
def check(nom,cond,det): ok.append(cond); print(('OK  ' if cond else 'ÉCHEC ')+nom+' — '+json.dumps(det,ensure_ascii=False)[:220])
def jouer(tag,f):
    with sync_playwright() as pw:
        b,pg,err,ext,dial=ouvrir(pw,'http://127.0.0.1:8766/'+f,hub(DICTEE)); prof(pg); time.sleep(2)
        # la liste des dictées : le bouton ⧉ de « Dictée ZZTEST aménagée »
        carte=pg.locator('div', has_text=re.compile(r'^Dictée ZZTEST aménagée')).filter(has=pg.locator('button[title^="Dupliquer"]')).first
        pg.screenshot(path=f'{D}/{tag}-1-liste.png')
        btn=pg.locator('button[title^="Dupliquer"]').first; titre=btn.get_attribute('title'); btn.click(); time.sleep(1.5)
        pg.screenshot(path=f'{D}/{tag}-2-apres-dup.png')
        arbre=pg.evaluate('window.__LIRE("correction_dictee")') or {}
        copies=[k for k in arbre if k.startswith('dictee_zz_amen_copie_')]
        c=arbre.get(copies[0]) if copies else {}
        W=pg.evaluate('window.__ECRITURES'); orig=arbre.get('dictee_zz_amen')
        b.close()
        return {'copies':copies,'noeuds':sorted(c.keys()) if c else [],'copie':c,'orig':orig,'titre_btn':titre,'dial':list(dial),'err':err,'ext':ext,'ecr':W}
A=jouer('base','dictee-6.6.1.html'); L=jouer('livree','dictee-6.6.2.html')
check('6.6.1 (avant) : une copie, avec /config seulement', len(A['copies'])==1 and A['noeuds']==['config'], A['noeuds'])
check('6.6.2 : une copie, tous les réglages, aucun état d\'élève', len(L['copies'])==1 and sorted(set(L['noeuds']))==sorted(REGLAGES) , L['noeuds'])
c=L['copie']; am=(c.get('dictee') or {}).get('amenagee') or {}
check('6.6.2 : la version aménagée est copiée entière (2 lacunes, modes A et C, base 10, consigne)', am.get('enabled') is True and len(am.get('lacunes') or [])==2 and am.get('base')==10 and am.get('consigne')=='Complète les trous.', {k:am.get(k) for k in ('enabled','base','defaultMode','consigne')})
check('6.6.2 : options de copie, exercices, page d\'exercices, binômes, heure copiés', c.get('copyOptions')==DICTEE['correction_dictee']['dictee_zz_amen']['copyOptions'] and c.get('exercices_html')=='<p>exo</p>' and c.get('heure')=='10:07' and 'ex1' in (c.get('exercices') or {}) and c.get('binomes')=={'zztest_alpha_anna':'zztest_beta_bruno'}, sorted(c.keys()))
check('6.6.2 : rien de l\'état des élèves dans la copie', all(k not in c for k in ETAT), [k for k in ETAT if k in c])
cf=c.get('config') or {}
check('6.6.2 : titre « Copie de … », non publiée, le reste de la config identique', cf.get('title')=='Copie de Dictée ZZTEST aménagée' and cf.get('published') is False and cf.get('base')==20 and cf.get('bareme')=='brevet' and cf.get('classe')=='zztest_3e' and cf.get('competences')==['C1'], {k:cf.get(k) for k in ('title','published','base','bareme','classe')})
check('6.6.2 : l\'original n\'a pas bougé (comparé nœud à nœud à ce qui a été semé)', L['orig']==DICTEE['correction_dictee']['dictee_zz_amen'], sorted((L['orig'] or {}).keys()))
check('6.6.2 : une seule écriture de dictée, sous la copie (l\'autre écriture est le contrat de l\'app, publié à l\'ouverture — existant)', [w for w in L['ecr'] if w[0] in ('set','update','remove') and str(w[1]).startswith('correction_dictee')]==[['set','correction_dictee/'+L['copies'][0]]] if L['copies'] else False, [w[:2] for w in L['ecr']][:6])
check('6.6.2 : le message dit le nombre de réglages et « version aménagée comprise »', any('version aménagée comprise' in d and '7 réglages' in d for d in L['dial']), L['dial'])
check('6.6.2 : l\'infobulle du bouton dit ce qu\'elle copie et ce qu\'elle laisse', 'version aménagée' in (L['titre_btn'] or '') and 'sans rien de ce que les élèves ont fait' in (L['titre_btn'] or ''), (L['titre_btn'] or '')[:120])
check('0 erreur JS, 0 sortie du navigateur (base, livrée)', not A['err'] and not L['err'] and not A['ext'] and not L['ext'], {'err':[A['err'],L['err']],'ext':[A['ext'],L['ext']]})
SRV.terminate()
print('BANC UNIQUE : '+('VERT (0 échec)' if all(ok) else 'ROUGE'))
json.dump({'avant':A,'livree':L},open(f'{D}/resultats.json','w'),ensure_ascii=False,indent=1,default=str)
