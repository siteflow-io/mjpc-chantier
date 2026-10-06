"""L15.1b-2 — le Panneau prof, Taxonomie → « Correspondances » (valider / refuser les rattachements proposés, app par app), par le geste,
le lien profond des apps ; le hub est un arbre en mémoire (rien ne sort de la page)."""
import sys, os, json, copy; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from banc_site import BancSite
F = os.environ.get('FICHIER'); CAP = os.environ.get('CAPTURES','')
import time
ARBRE = {'site': {'config': {'dernierControleRegles': int(time.time()*1000)}}, 'taxonomie': {'meta': {'version': '3.0.0', 'date': '2026-09-30'}, 'domaines': [
  {'id':'dom-ortho-lex','libelleProf':'Orthographe lexicale','libelleEleve':'Orthographe','familles':[{'id':'fam-01','libelleProf':'Doubles consonnes','notions':[{'id':'ortho-lex-001','libelleProf':'Doubles consonnes courantes','libelleEleve':'Les doubles consonnes','niveaux':['5e'],'actif':True},{'id':'ortho-lex-099','libelleProf':'Le son [è] : e / ai','libelleEleve':'e ou ai','niveaux':['4e'],'actif':True}]}]},
  {'id':'dom-ortho-gram','libelleProf':'Orthographe grammaticale','libelleEleve':'Grammaire','familles':[{'id':'fam-07','libelleProf':'Accords dans le groupe nominal','notions':[{'id':'ortho-gram-010','libelleProf':'Pluriel des noms','libelleEleve':'Le pluriel','niveaux':['5e'],'actif':True}]}]}],
  'alias': {'tables': {
    'correction_dictee': [{'terme':'D1.4 Accords','cibles':['fam-07'],'relation':'inclus','statut':'valide','valide_le':'2026-07-21'},
                          {'terme':'cat-son-ill','cibles':['ortho-lex-099'],'relation':'egal','statut':'propose','propose_le':'2026-10-06'},
                          {'terme':'cat-pl-fam','cibles':['fam-07'],'relation':'egal','statut':'propose','propose_le':'2026-10-06'},
                          {'terme':'cat-x','cibles':['ortho-lex-001'],'relation':'egal','statut':'propose','propose_le':'2026-10-06'}],
    'reecriture': [{'terme':'Temps des verbes','cibles':['dom-ortho-gram'],'relation':'inclus','statut':'valide'}]}}}}
PROF = {'is_prof': True, 'display': 'M. Meney (prof)', 'classe': '', 'niveau': '', 'code': ''}
R = {}
b = BancSite(F)
p = b.ouvrir('?panneau=taxonomie&onglet=correspondances&app=correction_dictee', ARBRE, PROF); p.wait_for_timeout(3500)
R['lien_profond'] = p.evaluate("()=>{const c=document.getElementById('m8tx-corr');return c?[c.dataset.app,document.getElementById('tprof-overlay').classList.contains('visible'),[...document.querySelectorAll('.m8tx-corr-ligne')].map(l=>l.dataset.terme+':'+l.dataset.statut)]:null}")
R['liste_app'] = p.evaluate("()=>{const s=document.getElementById('m8tx-corr-app');return s?[...s.options].map(o=>o.textContent):null}")
p.evaluate("()=>{[...document.querySelectorAll('body *')].filter(e=>{const cs=getComputedStyle(e);return (cs.position==='fixed')&&/ne sont pas à jour|Vérifier les règles Firebase/.test(e.innerText||'')&&!e.querySelector('#tprof-content')}).forEach(e=>e.style.display='none')}")   # l'alerte des fiches (due au faux hub du banc) masquée POUR LA CAPTURE seulement
if CAP: p.screenshot(path=CAP + '/L151b2-correspondances.png')
avant = b.lire(p, 'taxonomie/alias/tables/correction_dictee')
p.evaluate("()=>document.querySelector('.m8tx-valider[data-terme=\"cat-son-ill\"]').click()"); p.wait_for_timeout(1500)
apres = b.lire(p, 'taxonomie/alias/tables/correction_dictee')
R['valider'] = (apres[1].get('statut'), bool(apres[1].get('valide_le')), [apres[i] == avant[i] for i in (0, 2, 3)], b.lire(p, 'taxonomie/meta/version'))
p.evaluate("()=>document.querySelector('.m8tx-valider[data-terme=\"cat-pl-fam\"]').click()"); p.wait_for_timeout(1200)
R['partition'] = (p.evaluate("()=>{const e=document.getElementById('m8tx-corr-msg');return e?e.textContent:null}"), b.lire(p, 'taxonomie/alias/tables/correction_dictee/2/statut'))
p.evaluate("()=>{window.prompt=()=> 'hors sujet'}"); p.evaluate("()=>document.querySelector('.m8tx-refuser[data-terme=\"cat-x\"]').click()"); p.wait_for_timeout(1500)
x = b.lire(p, 'taxonomie/alias/tables/correction_dictee/3'); R['refuser'] = (x.get('statut'), x.get('raison'), bool(x.get('refuse_le')))
p.evaluate("()=>{[...document.querySelectorAll('body *')].filter(e=>{const cs=getComputedStyle(e);return (cs.position==='fixed')&&/ne sont pas à jour|Vérifier les règles Firebase/.test(e.innerText||'')&&!e.querySelector('#tprof-content')}).forEach(e=>e.style.display='none')}")   # l'alerte des fiches (due au faux hub du banc) masquée POUR LA CAPTURE seulement
if CAP: p.screenshot(path=CAP + '/L151b2-apres.png')
p.evaluate("()=>{const s=document.getElementById('m8tx-corr-app');s.value='reecriture';s.dispatchEvent(new Event('change',{bubbles:true}))}"); p.wait_for_timeout(500)
R['autre_app'] = p.evaluate("()=>[...document.querySelectorAll('.m8tx-corr-ligne')].map(l=>l.dataset.terme)")
p.evaluate("()=>document.getElementById('m8tx-onglet-arbre').click()"); p.wait_for_timeout(500)
R['arbre'] = p.evaluate("()=>!!document.querySelector('.m8tx-etat')")
R['ecritures'] = p.evaluate("()=>window.__ECRITURES_REST.filter(e=>/taxonomie/.test(e[1]))")
R['erreurs'] = b.erreurs[:3]; R['bloques_hub'] = [u for u in b.bloques if 'firebasedatabase' in u]
b.fermer()
# sans session de professeur : le lien profond n'ouvre rien
b = BancSite(F); p = b.ouvrir('?panneau=taxonomie&onglet=correspondances&app=correction_dictee', ARBRE, None); p.wait_for_timeout(3500)
R['eleve'] = p.evaluate("()=>document.getElementById('tprof-overlay').classList.contains('visible')"); R['erreurs2'] = b.erreurs[:3]; b.fermer()
print(json.dumps(R, ensure_ascii=False)); R = json.loads(json.dumps(R))
conds = {'lien_profond': bool(R['lien_profond']) and R['lien_profond'][0]=='correction_dictee' and R['lien_profond'][1] is True and R['lien_profond'][2][:3]==['cat-son-ill:propose','cat-pl-fam:propose','cat-x:propose'],
 'liste_app': bool(R['liste_app']) and 'correction_dictee — 3 proposés' in R['liste_app'],
 'valider_cible': R['valider'][0]=='valide' and R['valider'][1] and R['valider'][2]==[True,True,True] and R['valider'][3]!='3.0.0',
 'partition': bool(R['partition'][0]) and 'Partition cassée' in R['partition'][0] and 'D1.4 Accords' in R['partition'][0] and R['partition'][1]=='propose',
 'refuser': R['refuser'][0]=='refuse' and R['refuser'][1]=='hors sujet' and R['refuser'][2],
 'autre_app': R['autre_app']==['Temps des verbes'],
 'onglet_arbre': R['arbre'] is True,
 'ecritures_ciblees': all(e[0]=='PUT' and (e[1].startswith('/taxonomie/alias/tables/correction_dictee/') or e[1]=='/taxonomie/meta') for e in R['ecritures']) and len(R['ecritures'])==4,
 'eleve_rien': R['eleve'] is False,
 'propre': R['erreurs']==[] and R['erreurs2']==[] and R['bloques_hub']==[]}
print('conditions :', conds); ok = all(conds.values())
print('BANC L15.1b-2 PAR LE GESTE :', 'VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
