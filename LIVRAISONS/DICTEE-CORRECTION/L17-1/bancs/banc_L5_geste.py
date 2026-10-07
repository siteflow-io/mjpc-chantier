"""L5 — le reclassement réel à l'ouverture (une fois, corbeille d'abord), le signe « en plus » au forfait, le bouton « M→P » retiré.
Par le geste (ouvrir la dictée, poser un signe en trop), faux hub du kit (instantané anonymisé), ZZTEST pour la saisie."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
ATTENDU=json.load(open(os.environ.get('RAPPORT_L4','/home/claude/dc/L4/rapport_kit.json')))
att=[d for d in ATTENDU['dictees'] if d['id']==D3][0]
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Quebec']
R={}
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d:(dlg.append(d.message[:90]),d.accept()))
avant=b.lire(p,'correction_dictee/%s/results'%D3) or {}
def ouvrir_dictee():
    p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
ouvrir_dictee()
apres=b.lire(p,'correction_dictee/%s/results'%D3) or {}
corb=b.lire(p,'corbeille') or {}
ent=[v for j in corb.values() if isinstance(j,dict) for k,v in j.items() if k.startswith('reclassement-ponctuation_')]
R['ligne']=p.evaluate("()=>{const e=document.getElementById('ligne-reclassement');return e?e.innerText:null}")
if CAP: p.screenshot(path=CAP+'/L5-ouverture.png')
def N(c):   # [accordé à L9 et L10] l'identité de la copie (posée à l'ouverture) et le lien de forme ne comptent pas comme un reclassement
    if not isinstance(c,dict): return c
    c={k:v for k,v in c.items() if k not in ('id','creeLe','creeLeInconnu','modifieLe')}
    if isinstance(c.get('errors'),list): c['errors']=[{k:v for k,v in e.items() if k!='formeId'} if isinstance(e,dict) else e for e in c['errors']]
    return c
touchees=sorted(k for k in avant if json.dumps(N(avant[k]),sort_keys=True)!=json.dumps(N(apres.get(k)),sort_keys=True))
R['touchees']=len(touchees); R['attendu']=len(att['touchees'])
# [accordé à L17 — micro L15k-d, Paul 06/10] le trait d'union compte en « Acc. » : le reclassement touche aussi les copies qui ont un « - » (M/X/P → C) ;
# les copies du rapport restent touchées avec leur note ; les autres touchées sont EXACTEMENT celles dont seul le « - » change.
def N2(c):
    c=N(c)
    if not isinstance(c,dict): return c
    c={k:v for k,v in c.items() if k not in ('counts','deduction','note')}
    for f in ('errors','extras'):
        if isinstance(c.get(f),list): c[f]=[dict(e,type='C') if isinstance(e,dict) and e.get('word')=='-' else e for e in c[f]]
    return c
PONCT=set('.,;:!?«»"()…—–')
def _vals(x): return list(x.values()) if isinstance(x,dict) else (x or [])
def _a_ponct(c):   # une copie du rapport : un mot manquant (M) ou en trop (X) qui est un signe de ponctuation (hors « - »)
    return any(isinstance(e,dict) and (e.get('type') or ('X' if f=='extras' else '')) in ('M','X') and e.get('word') in PONCT for f in ('errors','extras') for e in _vals(c.get(f)))
def _a_trait(c):   # une copie au trait d'union : un « - » en M, X ou P
    return any(isinstance(e,dict) and e.get('word')=='-' and (e.get('type') or ('X' if f=='extras' else '')) in ('M','X','P') for f in ('errors','extras') for e in _vals(c.get(f)))
_seul_trait=lambda k: _a_trait(avant[k]) and json.dumps(N2(avant[k]),sort_keys=True)==json.dumps(N2(apres.get(k)),sort_keys=True)
cles_rapport=set(k for k in touchees if not _seul_trait(k))   # les copies du rapport : celles dont le changement n'est pas seulement le « - »
extra=[k for k in touchees if k not in cles_rapport]
R['extra_trait']=(len(extra),all(_a_trait(avant[k]) and json.dumps(N2(avant[k]),sort_keys=True)==json.dumps(N2(apres.get(k)),sort_keys=True) for k in extra),len(cles_rapport)==R['attendu'] and cles_rapport<=set(touchees))
R['intactes_identiques']=all(json.dumps(N(avant[k]),sort_keys=True)==json.dumps(N(apres.get(k)),sort_keys=True) for k in avant if k not in touchees)
R['notes_apres']=sorted(apres[k]['note'] for k in touchees if (not cles_rapport) or k in cles_rapport); R['notes_rapport']=sorted(t['note_apres'] for t in att['touchees'])
R['champs_gardes']=all(set(avant[k].keys())<=set(apres[k].keys()) for k in touchees)
R['corbeille']=(len(ent),all(e['_meta']['motif']=='reclassement-ponctuation' and e['_meta']['chemin']=='correction_dictee/%s/results/%s'%(D3,e['_meta']['cle']) and json.dumps(N(e['data']),sort_keys=True)==json.dumps(N(avant[e['_meta']['cle']]),sort_keys=True) for e in ent))
R['bouton_MP']=p.evaluate("()=>[...document.querySelectorAll('button')].some(b=>b.textContent.includes('M→P'))")
# rouverte : rien de plus (une fois)
p.locator('button:has-text("← Retour")').first.click(); p.wait_for_timeout(1200); ouvrir_dictee()
corb2=b.lire(p,'corbeille') or {}; ent2=[1 for j in corb2.values() if isinstance(j,dict) for k in j if k.startswith('reclassement-ponctuation_')]
R['une_fois']=(len(ent2)==len(ent), json.dumps({k:N(v) for k,v in (b.lire(p,'correction_dictee/%s/results'%D3) or {}).items()},sort_keys=True)==json.dumps({k:N(v) for k,v in apres.items()},sort_keys=True), p.evaluate("()=>!document.getElementById('ligne-reclassement')"))
# désormais : un signe posé « en plus » va au forfait ponctuation
p.locator('.eleve-card',has_text='Z. Quebec').first.click(); p.wait_for_timeout(900)
p.locator('.word-grid>.insert-zone').nth(3).click(); p.wait_for_timeout(300); p.keyboard.type(','); p.keyboard.press('Enter'); p.wait_for_timeout(500)
q=b.lire(p,'correction_dictee/%s/results/zztest_quebec'%D3) or {}
R['signe_en_plus']=(q.get('extras'),q.get('note'),q.get('counts',{}).get('P'),q.get('counts',{}).get('X'),p.evaluate("()=>{const e=document.querySelector('.extra-word.extra-ponct');return e?e.innerText:null}"))
if CAP: p.screenshot(path=CAP+'/L5-signe-en-plus.png')
p.locator('.word-grid>.insert-zone').nth(5).click(); p.wait_for_timeout(300); p.keyboard.type('zzmot'); p.keyboard.press('Enter'); p.wait_for_timeout(500)
q=b.lire(p,'correction_dictee/%s/results/zztest_quebec'%D3) or {}; R['mot_en_plus']=([x for x in (q.get('extras') or {}).values()] if isinstance(q.get('extras'),dict) else q.get('extras'),q.get('note'))
R['fenetres']=dlg; R['erreurs']=b.erreurs[:3]
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
ex=R['signe_en_plus'][0]; exl=list(ex.values()) if isinstance(ex,dict) else (ex or [])
from collections import Counter as _C
# [accordé à L17] une copie du rapport dont la seule conversion était un « - » en trop (alors → P) passe maintenant en « Acc. » : elle rejoint les copies au trait d'union
_inclus=not (_C(R['notes_apres'])-_C(R['notes_rapport'])) and 0<=len(R['notes_rapport'])-len(R['notes_apres'])<=R['extra_trait'][0]
ok=((R['touchees']==R['attendu'] or (R['extra_trait'][1] and _inclus and R['touchees']==len(R['notes_apres'])+R['extra_trait'][0])) and R['intactes_identiques'] and (R['notes_apres']==R['notes_rapport'] or _inclus) and R['champs_gardes'] and R['corbeille']==[R['touchees'],True]
    and R['ligne'] and ('%d copies reclassées'%R['touchees']) in R['ligne'] and R['bouton_MP'] is False and R['une_fois']==[True,True,True]
    and len(exl)==1 and exl[0].get('type')=='P' and exl[0].get('word')==',' and R['signe_en_plus'][1]==10 and R['signe_en_plus'][2]==1 and R['signe_en_plus'][3]==0 and R['signe_en_plus'][4]
    and R['mot_en_plus'][1]==9.5 and R['fenetres']==[] and R['erreurs']==[])
print('BANC L5 PAR LE GESTE :','VERT' if ok else 'ROUGE'); b.fermer(); sys.exit(0 if ok else 1)
