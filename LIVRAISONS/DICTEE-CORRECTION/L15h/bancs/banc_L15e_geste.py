"""L15e — l'import depuis un PDF, par le geste (de vrais PDF déposés dans le navigateur, lus par pdf.js) : les groupes reconnus, la bonne forme
tirée du texte classique, les notes en indices, la fenêtre d'un mot, rien d'écrit avant « Enregistrer la dictée », puis la dictée créée ;
un PDF sans crochets ; un PDF sans texte (image). Faux hub du kit, ZZTEST. (Les deux PDF de Paul : à ajouter quand il les aura donnés.)"""
import sys, copy, os, json, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); CAP=os.environ.get('CAPTURES',''); P=os.environ.get('PDFS','/home/claude/dc/L15e/pdfs/')
db=copy.deepcopy(L.BASE); R={}
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1500)
avant=sorted((b.lire(p,'correction_dictee') or {}).keys())
p.locator('#btn-import-pdf').click(); p.wait_for_timeout(500)
p.locator('#zone-pdf-0 input[type=file]').set_input_files(P+'zz_adaptee.pdf'); p.wait_for_timeout(5000)
R['etat0']=p.locator('#zone-pdf-0 .etat-pdf-l15e').inner_text()
p.locator('#zone-pdf-1 input[type=file]').set_input_files(P+'zz_classique.pdf'); p.wait_for_timeout(4000)
R['etat1']=p.locator('#zone-pdf-1 .etat-pdf-l15e').inner_text()
R['lacunes']=p.evaluate("()=>[...document.querySelectorAll('#texte-lu-l15e .mot-l15e.lacune')].map(e=>e.innerText)")
R['texte']=p.evaluate("()=>{const e=document.getElementById('texte-lu-l15e');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
R['titre']=p.locator('#titre-l15e').input_value(); R['notes']=p.evaluate("()=>document.body.innerText.includes('sont gardées comme indices pour le mode C')")
R['rien_ecrit']=sorted((b.lire(p,'correction_dictee') or {}).keys())==avant
if CAP: p.screenshot(path=CAP+'/L15e-import.png')
# la fenêtre d'un mot reconnu, puis d'un mot ordinaire
p.locator('#texte-lu-l15e .mot-l15e.lacune',has_text='couchés').first.click(); p.wait_for_timeout(500)
R['fenetre_couches']=p.evaluate("()=>[...document.querySelectorAll('#fenetre-mot-l15e .prop-l15e input:not([type=radio])')].map(x=>x.value)")
if CAP: p.screenshot(path=CAP+'/L15e-fenetre.png')
p.keyboard.press('Escape'); p.wait_for_timeout(300)
p.locator('#texte-lu-l15e .mot-l15e',has_text='signal').first.click(); p.wait_for_timeout(400); R['fenetre_signal']=p.evaluate("()=>[...document.querySelectorAll('#fenetre-mot-l15e .prop-l15e input:not([type=radio])')].map(x=>x.value)")
p.keyboard.press('Enter'); p.wait_for_timeout(400); R['lacunes_apres']=p.evaluate("()=>[...document.querySelectorAll('#texte-lu-l15e .mot-l15e.lacune')].map(e=>e.innerText)")
# enregistrer
cl=db['correction_dictee']['dictee_brevet_blanc_3e-3e_charles_de_gaulle']['config']['classe']
p.locator('#classe-l15e').select_option(cl); p.locator('#enregistrer-import-l15e').click(); p.wait_for_timeout(3000)
apres=b.lire(p,'correction_dictee') or {}; nouv=[k for k in apres if k not in avant]
R['creee']=nouv; d=apres[nouv[0]] if nouv else {}
R['config']=({k:(d.get('config') or {}).get(k) for k in ('title','classe','bareme','published','importePdf')},(d.get('config') or {}).get('text'))
am=((d.get('dictee') or {}).get('amenagee') or {}); R['amenagee']=(am.get('enabled'),am.get('base'),[(l.get('word'),l.get('propositions'),bool(l.get('indice'))) for l in (am.get('lacunes') or [])])
R['ouverte_preparation']=p.evaluate("()=>[...document.querySelectorAll('button.tab')].some(b=>b.className.includes('active')&&b.textContent.trim()==='Préparation')")
R['erreurs1']=b.erreurs[:3]; b.fermer()
# un PDF sans crochets ; un PDF sans texte
def seul(fichier):
    b2=Banc(F,1366,900); q=b2.ouvrir('?mode=prof',db=copy.deepcopy(db)); q.wait_for_timeout(1200); q.locator('#btn-import-pdf').click(); q.wait_for_timeout(400)
    q.locator('#zone-pdf-0 input[type=file]').set_input_files(P+fichier); q.wait_for_timeout(5000)
    e=q.locator('#zone-pdf-0 .etat-pdf-l15e').inner_text(); t=q.evaluate("()=>!!document.getElementById('texte-lu-l15e')"); err=b2.erreurs[:2]
    if CAP and 'image' in fichier: q.screenshot(path=CAP+'/L15e-image.png')
    b2.fermer(); return e,t,err
R['sans_crochets']=seul('zz_sans_crochets.pdf'); R['image']=seul('zz_image.pdf')
# un crochet qui couvre plusieurs mots : la première forme, dite à l'écran
b3=Banc(F,1366,900); q=b3.ouvrir('?mode=prof',db=copy.deepcopy(db)); q.wait_for_timeout(1200); q.locator('#btn-import-pdf').click(); q.wait_for_timeout(400)
q.locator('#zone-pdf-0 input[type=file]').set_input_files(P+'zz_multi.pdf'); q.wait_for_timeout(5000)
R['multi']=(q.evaluate("()=>{const e=document.getElementById('multi-l15e');return e?e.innerText:null}"),q.evaluate("()=>[...document.querySelectorAll('#texte-lu-l15e .mot-l15e.lacune')].map(e=>e.innerText)"),q.evaluate("()=>{const e=document.getElementById('texte-lu-l15e');return e?e.innerText.replace(/\\s+/g,' ').trim():null}"))
b3.fermer()
# LES DEUX PDF DE PAUL (03/10) : le premier banc
PP=os.environ.get('PDFS_PAUL','/home/claude/dc/L15e/pdfs_paul/')
b4=Banc(F,1366,900); q=b4.ouvrir('?mode=prof',db=copy.deepcopy(db)); q.wait_for_timeout(1200); q.locator('#btn-import-pdf').click(); q.wait_for_timeout(400)
q.locator('#zone-pdf-0 input[type=file]').set_input_files(PP+'Dictee_adaptee.pdf'); q.wait_for_timeout(5000)
q.locator('#zone-pdf-1 input[type=file]').set_input_files(PP+'Dictee_classique.pdf'); q.wait_for_timeout(5000)
R['paul_etats']=(q.locator('#zone-pdf-0 .etat-pdf-l15e').inner_text(),q.locator('#zone-pdf-1 .etat-pdf-l15e').inner_text())
R['paul_lacunes']=q.evaluate("()=>[...document.querySelectorAll('#texte-lu-l15e .mot-l15e.lacune')].map(e=>e.innerText)")
R['paul_texte']=q.evaluate("()=>{const e=document.getElementById('texte-lu-l15e');return e?e.innerText.replace(/\\s+/g,' ').trim():null}")
R['paul_notes']=q.evaluate("()=>document.body.innerText.includes('sont gardées comme indices pour le mode C')")
R['paul_base']=q.evaluate("()=>{const i=document.querySelector('#carte-import-pdf input[type=number]');return i?i.value:null}")
if CAP: q.screenshot(path=CAP+'/L15e-pdf-paul.png')
q.locator('#texte-lu-l15e .mot-l15e.lacune',has_text='couchés').first.click(); q.wait_for_timeout(500)
R['paul_couches']=q.evaluate("()=>[...document.querySelectorAll('#fenetre-mot-l15e .prop-l15e input:not([type=radio])')].map(x=>x.value)")
if CAP: q.screenshot(path=CAP+'/L15e-pdf-paul-couches.png')
q.keyboard.press('Escape'); q.wait_for_timeout(300)
avant4=sorted((b4.lire(q,'correction_dictee') or {}).keys())
q.locator('#classe-l15e').select_option(cl); q.locator('#enregistrer-import-l15e').click(); q.wait_for_timeout(3000)
ap=b4.lire(q,'correction_dictee') or {}; nv=[k for k in ap if k not in avant4]; am=((ap.get(nv[0]) or {}).get('dictee') or {}).get('amenagee') if nv else {}
R['paul_hub']=[(l.get('word'),l.get('propositions'),(l.get('indice') or '')[:40]) for l in ((am or {}).get('lacunes') or [])]
R['erreurs_paul']=b4.erreurs[:2]; b4.fermer()
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
conds={'groupes_reconnus':'3 groupes « [a / b / c] » reconnus' in R['etat0'],
 'bonnes_formes_du_classique':R['lacunes']==['entendu','venu','couchés'],
 'texte_classique':bool(R['texte']) and 'On est venu nous chercher' in R['texte'] and 'couchés dans les trous' in R['texte'] and '[' not in R['texte'],
 'titre_notes':R['titre']=='Dictée n°1 — lettre de Fritz' and R['notes'] is True,
 'rien_avant_enregistrer':R['rien_ecrit'] is True,
 'fenetre_groupe':R['fenetre_couches'][0]=='couchés' and sorted(R['fenetre_couches'][1:])==['couché','couchée'],
 'fenetre_mot_ordinaire':R['fenetre_signal'][0]=='signal' and all(x and x!='signal' for x in R['fenetre_signal'][1:]) and 'signal' in R['lacunes_apres'],
 'dictee_creee':len(R['creee'])==1 and R['config'][0]['title']=='Dictée n°1 — lettre de Fritz' and R['config'][0]['importePdf'] is True and R['amenagee'][0] is True and R['amenagee'][1]==10 and len(R['amenagee'][2])==4 and any(w=='couchés' and ps[0]=='couchés' and ind for w,ps,ind in R['amenagee'][2]),
 'ouverte_preparation':R['ouverte_preparation'],
 'sans_crochets':'rien de reconnu' in R['sans_crochets'][0] and R['sans_crochets'][1] is True,
 'image_message_honnete':'aucun texte' in R['image'][0],
 'crochet_plusieurs_mots':bool(R['multi'][0]) and "« l'a vu »" in R['multi'][0] and R['multi'][1]==['sommes'] and "Il l'a vu hier" in (R['multi'][2] or '').replace(' ’ ',"'").replace("l ' a","l'a"),
 'paul_12_groupes':'12 groupes « [a / b / c] » reconnus' in R['paul_etats'][0],
 'paul_bonnes_formes':R['paul_lacunes']==['entendu','venu','amenés','pouvez','vu','trouvions','passé','couchés','recouvre','exhume','veut','tombe'],
 'paul_texte':bool(R['paul_texte']) and 'trois jours couchés dans les trous' in R['paul_texte'] and 'jourscouchés' not in R['paul_texte'] and 'Consigne' not in R['paul_texte'] and 'Sujet souligné' not in R['paul_texte'] and 'Nom Prénom' not in R['paul_texte'],
 'paul_sur_10_et_notes':R['paul_base']=='10' and R['paul_notes'] is True,
 'paul_couches_2e_du_crochet':R['paul_couches'][0]=='couchés' and sorted(R['paul_couches'][1:])==['couché','couchée'],
 'paul_enregistre':len(R['paul_hub'])==12 and [w for w,_,_ in R['paul_hub']][7]=='couchés' and R['paul_hub'][7][1][0]=='couchés' and 'participe employé comme' in R['paul_hub'][7][2],
 'propre':R['erreurs1']==[] and R['sans_crochets'][2]==[] and R['image'][2]==[] and R['erreurs_paul']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L15e PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
