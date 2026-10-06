# micro L15k-d : le trait d'union compte en « Acc. » ; la copie l'écrit et ne montre plus « −0,5 » ; pas d'espace après « - » ; les notes ne bougent pas
import sys, copy, json, re, os, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_tu.html')
T=json.load(open('/tmp/dylan.json')); DID=T['id']
db=copy.deepcopy(L.BASE); db['classes']['3_dylan_bob']=T['classe']; db['correction_dictee']={DID:copy.deepcopy(T['dictee'])}; db['correction_dictee_erreurs']=json.load(open('/tmp/formes.json')); db['correction_dictee_textes']=json.load(open('/tmp/textes.json'))   # les formes acceptées (le « sans coût ») vivent là
notes_avant={k:v.get('note') for k,v in T['dictee']['results'].items() if isinstance(v,dict)}
b=Banc(F,1366,1100); p=b.ouvrir('?mode=prof&dictee=%s&onglet=correction'%DID,db=db); p.wait_for_timeout(5000)
res=b.lire(p,'correction_dictee/%s/results'%DID) or {}
lt=res.get('azema_fatihoussoundi_leto') or {}
R={'leto_extras':[(x.get('word'),x.get('type')) for x in (lt.get('extras') or []) if x],'leto_note':lt.get('note')}
R['notes_diff']=[(k,notes_avant.get(k),res[k].get('note')) for k in res if isinstance(res[k],dict) and res[k].get('note')!=notes_avant.get(k)];R['notes_identiques']=not R['notes_diff']
corb=b.lire(p,'corbeille') or {}; R['corbeille']=sum(len(v) for v in corb.values() if isinstance(v,dict))
p.get_by_text('Données',exact=True).first.click() if p.get_by_text('Données',exact=True).count() else None
b.fermer()
b=Banc(F,1366,1100); db2=copy.deepcopy(db); db2['correction_dictee'][DID]['results']=res
p=b.ouvrir('?mode=prof&dictee=%s&onglet=donnees'%DID,db=db2); p.wait_for_timeout(3500)
p.locator('button:has-text("Copies")').first.click(); p.wait_for_timeout(1200)
p.locator('.copies-left').first.locator('text=Leto').first.click(); p.wait_for_timeout(1800)
t=''
for f in p.frames:
    try:
        x=f.locator('body').inner_text()
        if 'AZEMA' in x: t=x
    except Exception: pass
R['la_bas']='là-bas' in t and 'là- bas' not in t; R['saint_laurent']='Saint-Laurent' in t
L2=t.split('\n');R['trop']=[' | '.join(L2[i:i+3]) for i,l in enumerate(L2) if '« - »' in l][:4]
R['moins05_sur_tiret']=bool(re.search(r'«\s*-\s*»\s*\n?\s*(MOT|TRAIT|SIGNE)[^\n]*\n?\s*−0,5',t))
p.screenshot(path='/home/claude/MICRO19/leto-apres.png')
print(json.dumps(R,ensure_ascii=False))
ok=all(t2=='C' for w,t2 in R['leto_extras'] if w=='-') and R['notes_identiques'] and R['la_bas'] and R['saint_laurent'] and not R['moins05_sur_tiret'] and any('trait d’union en trop' in l.lower() for l in R['trop'])
print('BANC TRAIT D\'UNION : '+('VERT' if ok else 'ROUGE'), '| erreurs :', b.erreurs[:1]); b.fermer()
