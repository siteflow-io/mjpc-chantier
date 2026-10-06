"""L15h-2 — le reclassement réel en C, par le geste (l'ouverture de chaque dictée par le professeur), sur une COPIE LOCALE des quatre dictées
du hub (lues en lecture seule à l'instant, dans un faux hub : rien n'est écrit au vrai hub ; aucun nom n'est affiché ni gardé)."""
import sys, copy, os, json, urllib.request; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER'); H='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app'
ids=["dictee_n_1_type_brevet_avec_revisions_extrait_de_la_lettre_de_fritz-3_dylan_bob","dictee_n_1_type_brevet_avec_revisions_extrait_de_la_lettre_de_fritz-3_dylan_bob_copie_1790916580740","dictee_n_1_preparee_les_travaux_de_paris-4_hugo","dictee_n_1_preparee_les_travaux_de_paris-4_hugo_copie_1790951115880"]
db=copy.deepcopy(L.BASE); vrai={}
for i in ids:
    vrai[i]=json.load(urllib.request.urlopen(H+'/correction_dictee/%s.json'%i)); db['correction_dictee'][i]=copy.deepcopy(vrai[i])
for n in ('classes','classes_amenages','amenagements','correction_dictee_textes','correction_dictee_erreurs','site'):   # les vraies conditions : registre, formes acceptées (L11), formes (L10), réglages — en mémoire seulement
    v=json.load(urllib.request.urlopen(H+'/%s.json'%n))
    if v: db[n]=dict(db.get(n) or {},**copy.deepcopy(v))
attendu={ids[0]:10,ids[1]:4,ids[2]:9,ids[3]:2}
R={}
b=Banc(F,1366,900)
for i in ids:
    p=b.ouvrir('?mode=prof&dictee=%s&onglet=correction'%i,db=db) if False else None
p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1500)
def compte(i):
    res=b.lire(p,'correction_dictee/%s/results'%i) or {}; nC=0;notes={}
    for k,c in res.items():
        if not isinstance(c,dict): continue
        nC+=sum(1 for e in (c.get('errors') or []) if e and e.get('type')=='C'); notes[k]=c.get('note')
    return nC,notes
for i in ids:
    avant_n,avant_notes=compte(i)
    p.evaluate("(id)=>{history.replaceState(null,'','?mode=prof&dictee='+id+'&onglet=correction');}",i)
    p.evaluate('''(id)=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}''',i); p.wait_for_timeout(300)
    p.evaluate('''(id)=>{const l=document.querySelector('.ligne-dictee-l15c[data-id="'+id+'"]');const b=l&&[...l.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir'));if(b)b.click()}''',i); p.wait_for_timeout(3500)
    apres_n,apres_notes=compte(i); mig=b.lire(p,'correction_dictee/%s/migrations/reclassementC_v1'%i) or {}
    corb=sum(1 for j,v in (b.lire(p,'corbeille') or {}).items() for k in (v or {}) if k.startswith('reclassement-accents_') and (v[k].get('_meta') or {}).get('dictee')==i)
    rayees=sum(1 for c in (b.lire(p,'correction_dictee/%s/results'%i) or {}).values() if isinstance(c,dict) for e in (c.get('errors') or []) if e and e.get('type')=='L' and e.get('fautif') in ('ce-là','mémé'))
    monte=sum(1 for k in apres_notes if apres_notes[k]!=avant_notes.get(k) and (apres_notes[k] or 0)>(avant_notes.get(k) or 0)); baisse=sum(1 for k in apres_notes if (apres_notes[k] or 0)<(avant_notes.get(k) or 0))
    monte_ordinaires=sum(1 for k in apres_notes if (apres_notes[k] or 0)>(avant_notes.get(k) or 0) and not (vrai[i].get('results') or {}).get(k,{}).get('amenagee'))   # une copie aménagée prend aussi sa base actuelle (L15g, dette 130)
    cles=sorted(k for k in (vrai[i].get('results') or {}))
    amen=[(cles.index(k)+1,avant_notes.get(k),apres_notes[k],(vrai[i]['results'][k] or {}).get('base')) for k in apres_notes if apres_notes[k]!=avant_notes.get(k) and (vrai[i].get('results') or {}).get(k,{}).get('amenagee')]
    R.setdefault('amenagees_changees',{})[i[-20:]]=amen   # (copie n°, note avant, note après, base enregistrée) — sans nom
    R[i[-20:]]={'reclassees':apres_n-avant_n,'migration':[mig.get('erreurs'),mig.get('copies')],'corbeille':corb,'rayees_restent_L':rayees,'notes_montent':monte,'notes_baissent':baisse,'montent_ordinaires':monte_ordinaires}
    p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim().startsWith('← Retour'));if(b)b.click()}"); p.wait_for_timeout(1200)
# une seconde ouverture ne refait rien
i=ids[0]; n0,_=compte(i)
p.evaluate('''(id)=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()});const l=document.querySelector('.ligne-dictee-l15c[data-id="'+id+'"]');const b=l&&[...l.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir'));if(b)b.click()}''',i); p.wait_for_timeout(3000)
n1,_=compte(i); R['seconde_ouverture']=n1-n0
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
v=list(R[k] for k in R if k not in ('seconde_ouverture','erreurs','amenagees_changees'))
conds={'dylan_10':v[0]['reclassees']==10 and v[0]['migration'][0]==10,'franklin_4':v[1]['reclassees']==4,'hugo_9':v[2]['reclassees']==9,'turing_2':v[3]['reclassees']==2,
 'total_25':sum(x['reclassees'] for x in v)==25,'corbeille_par_copie':all(x['corbeille']==x['migration'][1] for x in v),
 'rayees_restent_L':v[0]['rayees_restent_L']>=1 and v[3]['rayees_restent_L']>=1,
 'aucune_note_ne_baisse':all(x['notes_baissent']==0 for x in v),'preparee_inchangee':v[2]['montent_ordinaires']==0 and v[3]['montent_ordinaires']==0,   # en Préparée, C et L coûtent 0,5 : aucune copie ordinaire ne bouge
 'une_seule_fois':R['seconde_ouverture']==0,'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15h-2 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
