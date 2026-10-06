"""L15.1b-1d — Réglages de l'analyse (maquette T474 v2), le Prompt IA, Vérifier, Injecter (archive, alias proposés, reclassement), la partition,
l'événement du profil (une erreur = un événement), le Bilan « toutes dictées ». Par le geste, faux hub du kit (+ une petite taxonomie), ZZTEST."""
import sys, copy, os, json, re, time; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES',''); NOW=int(time.time()*1000)
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; ck=[k for k,v in db['classes'].items() if k==cl or (v or {}).get('nom')==cl][0]
db['classes'][ck]['eleves']=list(db['classes'][ck]['eleves'])+['ZZTEST Ia']
db['taxonomie']={'domaines':[{'id':'dom-ortho-lex','libelleProf':'Orthographe lexicale','familles':[{'id':'fam-01','libelleProf':'Doubles consonnes','notions':[{'id':'ortho-lex-001','libelleProf':'Doubles consonnes courantes','actif':True},{'id':'ortho-lex-099','libelleProf':'Le son [j] : ill / y','actif':True}]}]},
  {'id':'dom-ortho-gram','libelleProf':'Orthographe grammaticale','familles':[{'id':'fam-07','libelleProf':'Accords dans le groupe nominal','notions':[{'id':'ortho-gram-010','libelleProf':'Pluriel des noms','actif':True}]}]}],
  'alias':{'tables':{'correction_dictee':[{'terme':'D1.1 Orthographe grammaticale','cibles':['dom-ortho-gram'],'relation':'egal','statut':'valide'},{'terme':'D1.2 Orthographe lexicale','cibles':['dom-ortho-lex'],'relation':'egal','statut':'valide'},{'terme':'D1.4 Accords','cibles':['fam-07'],'relation':'inclus','statut':'valide'}]}}}
R={}
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1800)
toks=p.evaluate("(t)=>tokenize(t)",db['correction_dictee'][D3]['config']['text']); iF=toks.index('Penanster'); iN=toks.index('naturellement')
p.evaluate("(a)=>db.ref(a[0]).set(a[1])",['correction_dictee/%s/results/zztest_ia'%D3,{'errors':[{'idx':iF,'type':'L','word':'Penanster','fautif':'Penanstair'},{'idx':iN,'type':'L','word':'naturellement','fautif':'naturelement'}],'extras':[],'note':9,'deduction':1,'counts':{'L':2},'timestamp':NOW-3600000,'amenagee':False}]); p.wait_for_timeout(400)
p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300)
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
p.get_by_role('button',name='Réglages',exact=True).first.click(); p.wait_for_timeout(1000)
R['entete']=p.evaluate("()=>{const c=document.getElementById('carte-commentaires-l151');return c?c.querySelector('span').innerText:null}")
p.locator('#carte-commentaires-l151 .categorie-l151[data-id="cat-consonne-double"]').first.click(); p.wait_for_timeout(300)
R['apercu']=p.locator('#apercu-l151').inner_text()
# le Prompt IA
p.locator('#btn-prompt-ia-l151').click(); p.wait_for_timeout(2500)
pr=p.locator('#prompt-ia-l151').input_value(); R['prompt']=('TAXONOMIE' in pr,'ortho-lex-099' in pr,'D1.2' in pr,'Penanstair → Penanster · L · NON RECONNUE' in pr,'cat-consonne-double' in pr,pr.find('NON RECONNUE')<pr.find('naturelement') if 'naturelement' in pr else None)
if CAP: p.screenshot(path=CAP+'/L151d-prompt.png')
def verifier(j):
    p.locator('#json-ia-l151').fill(json.dumps(j,ensure_ascii=False)); p.locator('#verifier-ia-l151').click(); p.wait_for_timeout(700)
    return p.evaluate("()=>{const e=document.getElementById('verdict-ia-l151');return e?e.innerText:null}")
avant=json.dumps(b.lire(p,'site/analyses/categories') or {},sort_keys=True)
R['motif_inconnu']=verifier({'categories':[{'id':'cat-magie','nom':'Magie','famille':'lexique','competence':'D1.2','motifs':[{'type':'magie'}],'commentaire':'x','exemples':[{'forme':'a','mot':'b'}]}]})
R['injecter_grise']=p.locator('#injecter-ia-l151').is_disabled()
R['partition']=verifier({'categories':[{'id':'cat-pl-fam','nom':'Pluriel','famille':'accords','competence':'D1.4','motifs':[{'type':'suffixe','attendu':'s','ecrit':''}],'commentaire':'x','exemples':[{'forme':'chat','mot':'chats'}],'alias':{'cibles':['fam-07'],'relation':'egal'}}]})
p.evaluate('()=>{window.__REST_LOCAL__=true}')   # l'injection écrit par REST : appliquée au faux hub, jamais au vrai
R['rien_ecrit']=json.dumps(b.lire(p,'site/analyses/categories') or {},sort_keys=True)==avant
JS={'categories':[{'id':'cat-son-ill','nom':'Le son [è] : e / ai','famille':'lexique','competence':'D1.2','motifs':[{'type':'lettre','de':'e','vers':'ai'}],'commentaire':'Tu as écrit « {forme} » : ici le son [è] s’écrit « e » : « {mot} ».','exemples':[{'forme':'Penanstair','mot':'Penanster'}],'alias':{'cibles':['ortho-lex-099'],'relation':'egal'}}],'homophones':[{'a':'pain','b':'pin','regle':'« pain » se mange ; « pin » est un arbre.'}]}
R['valide']=verifier(JS)
if CAP: p.screenshot(path=CAP+'/L151d-verifier.png')
p.locator('#injecter-ia-l151').click(); p.wait_for_timeout(3500)
R['msg']=p.evaluate("()=>{const e=document.getElementById('msg-commentaires-l151');return e?e.innerText:null}")
c=b.lire(p,'site/analyses/categories/cat-son-ill') or {}; tab=b.lire(p,'taxonomie/alias/tables/correction_dictee') or []
tab=list(tab.values()) if isinstance(tab,dict) else tab
R['injecte']=(c.get('origine'),c.get('actif'),[ (x.get('terme'),x.get('statut'),x.get('cibles')) for x in tab if x and x.get('terme')=='cat-son-ill'],bool(b.lire(p,'site/analyses/homophones/hom-pain-pin')),
  sum(1 for j,v in (b.lire(p,'corbeille') or {}).items() for k in (v or {}) if k.startswith('analyses-avant-ia_')))
e=[x for x in (b.lire(p,'correction_dictee/%s/results/zztest_ia'%D3) or {}).get('errors',[]) if x and x.get('idx')==iF]; R['reclassee']=e[0].get('categorie') if e else None
# l'événement du profil : une correction (mode texte) → un événement par erreur, mis à jour, jamais doublé
p.locator('button.tab:has-text("Correction")').first.click() if p.locator('button.tab:has-text("Correction")').count() else None
p.get_by_role('button',name='Pilotage',exact=True).first.click(); p.wait_for_timeout(300); p.locator('button.tab:has-text("Correction")').first.click(); p.wait_for_timeout(800)
p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.title==='Retour à la grille des élèves');if(b)b.click()}"); p.wait_for_timeout(500)
p.locator('.eleve-card').first.click(); p.wait_for_timeout(900)
iP=toks.index('préoccupations'); p.evaluate("(i)=>[...document.querySelectorAll('.word-grid button.word-btn')].find(x=>x.dataset.wordIdx==String(i)).click()",iP); p.wait_for_timeout(400); p.keyboard.press('g'); p.wait_for_timeout(300); p.keyboard.type('préoccupation'); p.keyboard.press('Enter'); p.wait_for_timeout(1500)
res=b.lire(p,'correction_dictee/%s/results'%D3) or {}; cle=[k for k,c in res.items() if isinstance(c,dict) and any(x and x.get('fautif')=='préoccupation' for x in (c.get('errors') or []))][0]
ev1=b.lire(p,'profil/%s/events'%cle) or {}; nerr=len([x for x in res[cle].get('errors') if x and x.get('type')!='A'])
iC=toks.index('centre'); p.evaluate("(i)=>[...document.querySelectorAll('.word-grid button.word-btn')].find(x=>x.dataset.wordIdx==String(i)).click()",iC); p.wait_for_timeout(400); p.keyboard.press('g'); p.wait_for_timeout(300); p.keyboard.type('centres'); p.keyboard.press('Enter'); p.wait_for_timeout(1500)
ev2=b.lire(p,'profil/%s/events'%cle) or {}; res2=b.lire(p,'correction_dictee/%s/results/%s'%(D3,cle)) or {}
evP=[v for v in ev2.values() if v and (v.get('detail') or {}).get('mot_fautif')=='préoccupation']
R['profil']=(len(ev1),nerr,len(ev2),len([x for x in res2.get('errors') if x and x.get('type')!='A']),evP[0].get('categorie') if evP else None,evP[0].get('notion_ids') if evP else None,evP[0].get('notions_proposees') if evP else None,len(evP),evP[0].get('notions_etat') if evP else None)
# le Bilan
p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.title==='Retour à la grille des élèves');if(b)b.click()}"); p.wait_for_timeout(400)
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(400); p.locator('button.tab:has-text("Bilan")').first.click(); p.wait_for_timeout(2000)
R['bilan']=p.evaluate("()=>{const e=document.querySelector('#carte-non-reconnus-l151 summary');return e?e.innerText:null}")
R['erreurs']=b.erreurs[:3]; b.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'entete':bool(R['entete']) and 'catégories · objets au hub' in R['entete'],
 'apercu_vraie_erreur':(R['apercu'] or '').startswith('Tu as écrit « naturelement » : attention au l,'),
 'prompt':R['prompt'][:5]==[True,True,True,True,True],
 'motif_inconnu_refuse':bool(R['motif_inconnu']) and 'motif inconnu' in R['motif_inconnu'] and R['injecter_grise'] is True,
 'partition_refusee':bool(R['partition']) and 'partition cassée' in R['partition'],
 'rien_ecrit_avant_injecter':R['rien_ecrit'] is True,
 'verdict_valide':bool(R['valide']) and R['valide'].startswith('1 catégorie valide (cat-son-ill)'),
 'injecte':R['injecte'][0]=='ia' and R['injecte'][1] is True and R['injecte'][2]==[['cat-son-ill','propose',['ortho-lex-099']]] and R['injecte'][3] is True and R['injecte'][4]>=1,
 'reclassee':R['reclassee']=='cat-son-ill',
 'profil_un_evenement_par_erreur':R['profil'][0]==R['profil'][1] and R['profil'][2]==R['profil'][3] and R['profil'][7]==1 and R['profil'][4]=='cat-pluriel-manquant' and R['profil'][5] is None and R['profil'][6] is None and R['profil'][8]=='aucun_rattachement',
 'bilan_toutes_dictees':bool(R['bilan']) and 'toutes dictées' in R['bilan'],
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15.1b-1d PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
