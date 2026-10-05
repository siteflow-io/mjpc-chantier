"""L11 — les formes acceptées (complément corrigé le 02/10 : un BOUTON, aucun raccourci ; le 0 reste un chiffre).
Par le geste, faux hub du kit, ZZTEST : Préparation (dire d'avance, garde, ✕), la correction (le bouton, l'annulation, le pavé sur une forme
acceptée), l'autre texte (« acceptée dans « … » » + « accepter ici »), Réglages (partagées avec, retirer), l'élève (feuille, autocorrection)."""
import sys, copy, os, json, time, re; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
J='dictee_zz_jumelle'; A='dictee_zz_autre'; IDX=32
db=copy.deepcopy(L.BASE); cfg3=db['correction_dictee'][D3]['config']; cl=cfg3['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Alpha','ZZTEST Bravo','ZZTEST Charlie','ZZTEST Delta','ZZTEST Kilo','ZZTEST Lima','ZZTEST Mike']
def cp(errs): return {'errors':errs,'extras':[],'note':5,'deduction':5,'counts':{},'timestamp':1700000000000,'amenagee':False}
R3=db['correction_dictee'][D3]['results']
R3['zztest_alpha']=cp([{'idx':IDX,'type':'G','word':'syllabes','fautif':'syllabe'}])
R3['zztest_bravo']=cp([{'idx':IDX,'type':'G','word':'syllabes','fautif':'syllabe'},{'idx':1,'type':'L','word':'devint','fautif':'devin'}])
db['correction_dictee'][J]={'config':dict(cfg3,title='ZZTEST jumelle'),'results':{'zztest_charlie':cp([{'idx':IDX,'type':'G','word':'syllabes','fautif':'syllabe'}])}}
db['correction_dictee'][A]={'config':dict(cfg3,title='ZZTEST autre texte',text='Les syllabes chantent la nuit.'),'results':{'zztest_delta':cp([{'idx':1,'type':'G','word':'syllabes','fautif':'syllab'}])}}
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000)
def ouvrir_dictee(t):
    p.evaluate('''()=>{document.querySelectorAll(`.niveau-l15c[data-ouvert="0"] h3`).forEach(function(h){h.click()})}'''); p.wait_for_timeout(300); p.evaluate('''(t)=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes(t)&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}''',t); p.wait_for_timeout(3000)
def note(d,k): return (b.lire(p,'correction_dictee/%s/results/%s'%(d,k)) or {}).get('note')
def sc(d,k): return [bool(e.get('sansCout')) for e in ((b.lire(p,'correction_dictee/%s/results/%s'%(d,k)) or {}).get('errors') or []) if e]
def onglet(t): p.locator('button:has-text("%s")'%t).first.click(); p.wait_for_timeout(900)
ouvrir_dictee('brevet blanc 3E')
n0=(note(D3,'zztest_alpha'),note(D3,'zztest_bravo'),note(J,'zztest_charlie'))
# 1. Préparation : dire d'avance
onglet('Préparation'); p.wait_for_timeout(800); p.locator('#btn-formes-acceptees').click(); p.wait_for_timeout(1500)
p.locator('#formes-acceptees-prep .fa-mot[data-idx="%d"]'%IDX).click(force=True); p.wait_for_timeout(400)
p.locator('#fa-champ').fill('syllabes'); p.keyboard.press('Enter'); p.wait_for_timeout(500); R['prep_garde']=p.evaluate("()=>{const e=document.getElementById('fa-garde');return e?e.innerText:null}")   # [accordé à L15-0] casse comprise
p.locator('#fa-champ').fill('syllabe'); p.keyboard.press('Enter'); p.wait_for_timeout(2500)
R['prep_msg']=p.evaluate("()=>{const e=document.getElementById('msg-fa-prep');return e?e.innerText:null}")
n1=(note(D3,'zztest_alpha'),note(D3,'zztest_bravo'),note(J,'zztest_charlie')); R['prep_sc']=(sc(D3,'zztest_alpha'),sc(J,'zztest_charlie'))
p.keyboard.press('Escape'); p.wait_for_timeout(400)
R['prep_souligne']=p.evaluate("(i)=>{const e=document.querySelector('#formes-acceptees-prep .fa-mot[data-idx=\"'+i+'\"]');return e?[e.className,e.innerText]:null}",IDX)
if CAP: p.screenshot(path=CAP+'/L11-preparation.png')
p.locator('#formes-acceptees-prep .fa-mot[data-idx="%d"]'%IDX).click(force=True); p.wait_for_timeout(400); p.locator('.fa-retirer').first.click(force=True); p.wait_for_timeout(2500)
n2=(note(D3,'zztest_alpha'),note(D3,'zztest_bravo'),note(J,'zztest_charlie')); R['notes']=(n0,n1,n2); p.keyboard.press('Escape'); p.wait_for_timeout(300)
# 2. la correction : le bouton (aucun raccourci), l'annulation, le 0 qui reste un chiffre
onglet('Correction'); p.locator('.eleve-card',has_text='Z. Kilo').first.click(); p.wait_for_timeout(900); p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
for _ in range(IDX): p.keyboard.press(' '); p.wait_for_timeout(35)
p.wait_for_timeout(300); p.keyboard.press('g'); p.wait_for_timeout(400)
R['bouton_inactif']=p.evaluate("()=>{const b=document.querySelector('.btn-accepter');return b?[b.disabled,b.title]:null}")
p.keyboard.type('syllabe'); p.wait_for_timeout(200)
R['bouton_actif']=p.evaluate("()=>{const b=document.querySelector('.btn-accepter');return b?[b.disabled,b.innerText]:null}")
if CAP: p.screenshot(path=CAP+'/L11-case-bouton.png')
p.locator('.btn-accepter').click(); p.wait_for_timeout(2500)
R['msg_accept']=p.evaluate("()=>{const e=document.getElementById('msg-accept');return e?e.innerText:null}")
R['kilo']=(sc(D3,'zztest_kilo'),note(D3,'zztest_kilo')); R['apres_bouton']=(sc(D3,'zztest_alpha'),sc(J,'zztest_charlie'),note(D3,'zztest_alpha'))
p.keyboard.press('Backspace'); p.wait_for_timeout(300); p.keyboard.press('g'); p.wait_for_timeout(400); p.keyboard.type('syllabe'); p.wait_for_timeout(200)
R['bouton_annuler']=p.evaluate("()=>{const b=document.querySelector('.btn-accepter');return b?b.innerText:null}")
p.locator('.btn-accepter').click(); p.wait_for_timeout(2500)
R['annule']=(p.evaluate("()=>{const e=document.getElementById('msg-accept');return e?e.innerText:null}"),sc(D3,'zztest_alpha'),sc(J,'zztest_charlie'))
# re-accepter, puis un autre élève : le pavé 1 sur la forme acceptée ne coûte rien ; le 0 reste un chiffre
p.keyboard.press('Backspace'); p.wait_for_timeout(300); p.keyboard.press('g'); p.wait_for_timeout(400); p.keyboard.type('syllabe'); p.locator('.btn-accepter').click(); p.wait_for_timeout(2500)
p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)
p.locator('.eleve-card',has_text='Z. Lima').first.click(); p.wait_for_timeout(900); p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
for _ in range(IDX): p.keyboard.press(' '); p.wait_for_timeout(35)
p.wait_for_timeout(300); p.keyboard.press('g'); p.wait_for_timeout(500)
R['liste_lima']=[' '.join(t.split()) for t in p.locator('.liste-formes .forme').all_inner_texts()]
if CAP: p.screenshot(path=CAP+'/L11-liste-acceptee.png')
p.keyboard.press('Numpad1'); p.wait_for_timeout(1200); R['lima']=(sc(D3,'zztest_lima'),note(D3,'zztest_lima'))
p.keyboard.press('Backspace'); p.wait_for_timeout(300); p.keyboard.press('l'); p.wait_for_timeout(400); p.keyboard.press('Numpad0'); p.wait_for_timeout(300)
R['zero_chiffre']=(p.evaluate("()=>{const e=document.getElementById('msg-formes');return e?e.innerText:null}"),p.locator('.liste-formes').count()>0)
p.keyboard.press('Escape'); p.wait_for_timeout(200); p.keyboard.press('Escape'); p.wait_for_timeout(300)
# 3. Réglages : partagées avec, la liste
p.keyboard.press('Shift+R'); p.wait_for_timeout(900); p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)
onglet('Réglages'); p.wait_for_timeout(1200)
R['reglages']=p.evaluate("()=>{const e=document.getElementById('carte-formes-acceptees');return e?e.innerText:null}")
if CAP: p.screenshot(path=CAP+'/L11-reglages.png')
# 4. l'autre texte : « acceptée dans « … » » et « accepter ici »
p.locator('button:has-text("← Retour")').first.click(); p.wait_for_timeout(1500); ouvrir_dictee('ZZTEST autre texte')
p.locator('.eleve-card',has_text='Z. Mike').first.click(); p.wait_for_timeout(900)
p.locator('.word-grid button.word-btn[data-word-idx="1"]').click(); p.wait_for_timeout(300); p.locator('.popup-btn-g').first.click(); p.wait_for_timeout(500)
R['autre_liste']=[' '.join(t.split()) for t in p.locator('.liste-formes .forme').all_inner_texts()]
if CAP: p.screenshot(path=CAP+'/L11-autre-texte.png')
p.locator('.btn-accepter-ici').first.click(); p.wait_for_timeout(2500)
R['autre_ici']=(sc(A,'zztest_mike'),(b.lire(p,'correction_dictee/%s/results/zztest_mike'%A) or {}).get('errors'))
regles=b.lire(p,'correction_dictee_textes') or {}
def _d(x): return dict(enumerate(x)) if isinstance(x,list) else (x or {})   # [accordé à L15-0] les places numérotées peuvent revenir en liste
R['regles']=sorted((tk,str(mk),fk) for tk,v in regles.items() for mk,m in _d((v or {}).get('formesAcceptees')).items() if m for fk in _d(m))
p.keyboard.press('Escape'); p.wait_for_timeout(300)
if p.locator('button[title="Retour à la grille des élèves"]').count(): p.locator('button[title="Retour à la grille des élèves"]').first.click(); p.wait_for_timeout(800)
# le bilan exporté compte les erreurs sans coût (Données → Bilan → « Prompt IA », l'aperçu du JSON)
p.get_by_role('button',name='Données',exact=True).first.click(); p.wait_for_timeout(800)
p.get_by_role('button',name='Bilan',exact=True).first.click(); p.wait_for_timeout(900); p.locator('button[title^="G\u00e9n\u00e8re un pr"],button:has-text("Prompt IA")').first.click(); p.wait_for_timeout(1500)
bil=p.locator('body').inner_text(); R['bilan_sans_cout']=re.findall(r'"sans_cout": (\d+)',bil)
p.keyboard.press('Escape'); p.wait_for_timeout(300)
if p.locator('.popup-overlay').count(): p.locator('.popup-overlay').last.click(position={'x':5,'y':5}); p.wait_for_timeout(400)   # fermer l'aperçu en cliquant à côté
# 5. Réglages : retirer (dans le brevet blanc)
p.locator('button:has-text("← Retour")').first.click(); p.wait_for_timeout(1500)
ouvrir_dictee('brevet blanc 3E'); onglet('Réglages'); p.wait_for_timeout(1200)
p.locator('#carte-formes-acceptees button:has-text("retirer")').first.click(); p.wait_for_timeout(2500)
R['retirer']=(p.evaluate("()=>{const e=document.getElementById('msg-fa-reglages');return e?e.innerText:null}"),sc(D3,'zztest_alpha'),sc(J,'zztest_charlie'))
R['erreurs_prof']=b.erreurs[:3]; b.fermer()
# 6. l'élève : la feuille et l'autocorrection disent « forme acceptée », et rien d'autre (la même copie, L9 contre la livrée)
def feuille(f):
    d2=copy.deepcopy(db); d2['correction_dictee'][D3]['copyPublishedAt']=int(time.time()*1000)
    d2['correction_dictee'][D3]['results']['zztest_alpha']={'errors':[{'idx':IDX,'type':'G','word':'syllabes','fautif':'syllabe','sansCout':True},{'idx':1,'type':'L','word':'devint','fautif':'devin'}],'extras':[],'note':9.5,'deduction':.5,'counts':{'L':1,'sansCout':1},'timestamp':1700000000000,'amenagee':False}
    b3=Banc(f,1366,768); q=b3.ouvrir('?dictee=%s&eleveKey=zztest_alpha&screen=copie'%D3,db=d2,session={'display':'ZZTEST Alpha','classe':cl}); q.wait_for_timeout(1200)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(1000)
    if q.locator('button:has-text("1 élève")').count(): q.locator('button:has-text("1 élève")').first.click()
    q.wait_for_timeout(3000); src=q.evaluate("()=>[...document.querySelectorAll('iframe')].map(x=>x.getAttribute('srcdoc')||'').join(' ')")
    if CAP and 'L11' in f: q.screenshot(path=CAP+'/L11-eleve-feuille.png')
    txt=re.sub(r'<[^>]+>',' ',src); txt=re.sub(r'\s+',' ',txt); b3.fermer(); return txt
f9=feuille(os.environ.get('BASE_L9','/home/claude/dc/L11/base-L9.html')); f11=feuille(F)
import difflib; w9=f9.split(); w11=f11.split(); R['feuille_diff']=[(op,' '.join(w9[a1:a2]),' '.join(w11[b1:b2])) for op,a1,a2,b1,b2 in difflib.SequenceMatcher(None,w9,w11).get_opcodes() if op!='equal']
R['feuille_mention']=f11.count('forme acceptée'); R['feuille_identique_hors_mention']=(f11.replace(' forme acceptée','').replace('forme acceptée','')==f9)
# l'autocorrection : la carte de l'erreur dit « forme acceptée »
def autocorr(f):
    d2=copy.deepcopy(db); d2['correction_dictee'][D3]['copyPublishedAt']=int(time.time()*1000)
    d2['correction_dictee'][D3]['heure']={'debut':int(time.time()*1000),'fin':int(time.time()*1000)+50*60000,'classe':cl}   # [accordé à L13] une séance en cours : l'autocorrection n'attend plus
    n0=int(time.time()*1000); d2['correction_dictee'][D3]['heure']={'debut':n0,'fin':n0+3600000,'classe':'3E'}   # [accordé à L13] une séance lancée : l'autocorrection n'attend plus
    d2['correction_dictee'][D3]['heure']={'debut':int(time.time()*1000),'fin':int(time.time()*1000)+55*60000}   # [accordé à L13] une séance lancée : l'autocorrection s'ouvre
    d2['correction_dictee'][D3]['results']['zztest_bravo']={'errors':[{'idx':IDX,'type':'G','word':'syllabes','fautif':'syllabe','sansCout':True}],'extras':[],'note':10,'deduction':0,'counts':{'sansCout':1},'timestamp':1700000000000,'amenagee':False}
    b4=Banc(f,1366,768); q=b4.ouvrir('',db=d2,session={'display':'ZZTEST Bravo','classe':cl}); q.wait_for_timeout(1000)
    q.locator('text=Mode élève').first.click(); q.wait_for_timeout(800); q.locator('button:has-text("1 élève")').first.click(); q.wait_for_timeout(1500)
    q.locator('.mesdictees-ligne',has_text='brevet blanc 3E').first.click(); q.wait_for_timeout(1500)
    if q.locator('input[type=checkbox]').count(): q.locator('input[type=checkbox]').first.check(); q.wait_for_timeout(300)
    q.locator('button:has-text("Commencer")').first.click(); q.wait_for_timeout(2000)
    q.locator('text=•••').last.click(); q.wait_for_timeout(1200)   # le mot masqué : sa carte s'ouvre
    txt=q.locator('body').inner_text()
    if CAP and 'L11' in f: q.screenshot(path=CAP+'/L11-eleve-autocorrection.png')
    b4.fermer(); return ('forme acceptée' in txt, 'Erreur n°1' in txt or 'Erreur n° 1' in txt)
R['autocorrection']=autocorr(F)
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
n0,n1,n2=R['notes']
conds={'prep_garde':R['prep_garde'] and 'mot juste' in R['prep_garde'],
 'prep_recalc':bool(R['prep_msg']) and '3 copies recalculées' in R['prep_msg'] and 'ZZTEST jumelle' in R['prep_msg'] and R['prep_sc']==[[True],[True]],
 'prep_souligne':bool(R['prep_souligne']) and 'tol' in R['prep_souligne'][0] and R['prep_souligne'][1].strip().endswith('1'),
 'notes_montent_descendent':all(a<b2 for a,b2 in zip(n2,n1)) and n2==n0 or all(a<b2 for a,b2 in zip(n2,n1)),
 'bouton_inactif_sans_forme':R['bouton_inactif'] and R['bouton_inactif'][0] is True,
 'bouton':R['bouton_actif']==[False,'✓ forme acceptée (ce texte)'] and bool(R['msg_accept']) and 'est maintenant une forme acceptée' in R['msg_accept'] and 'ZZTEST jumelle' in R['msg_accept'] and R['kilo'][0]==[True] and R['apres_bouton'][0]==[True] and R['apres_bouton'][1]==[True],
 'annuler':R['bouton_annuler']=='✕ ne plus accepter' and R['annule'][0] and "n’est plus une forme acceptée" in R['annule'][0] and R['annule'][1]==[False] and R['annule'][2]==[False],
 'pave_sur_acceptee':bool(R['liste_lima']) and 'acceptée' in R['liste_lima'][0] and R['lima'][0]==[True],
 'zero_chiffre':R['zero_chiffre'][1] is True or R['zero_chiffre'][0]=='Pas de forme n° 0.',   # [accordé à L16a] en L, « syllabes » n'a pas de forme L : pas de liste, et le 0 n'a rien posé
 'reglages':bool(R['reglages']) and 'partagées avec' in R['reglages'] and 'ZZTEST jumelle' in R['reglages'] and 'syllabe' in R['reglages'],
 'autre_texte':any('acceptée ailleurs' in x and 'accepter ici' in x for x in R['autre_liste']) and R['autre_ici'][0]==[True],
 'retirer':bool(R['retirer'][0]) and R['retirer'][1]==[False] and R['retirer'][2]==[False],
 'eleve_feuille':[d for d in R['feuille_diff'] if '{' not in (d[1]+d[2]) and ('−1' in d[1] or 'forme acceptée' in d[2])]==[['replace','−1','forme acceptée'],['replace','−1 pt','forme acceptée']] and not any('« syllabe »' in d[2] for d in R['feuille_diff']),   # [accordé à L15.1b-1] les commentaires viennent maintenant de l'écart (ils changent) ; la forme acceptée n'en a pas   # [accordé à L15h] les règles de style du type C (sa couleur) ne comptent pas : seul le texte de la feuille   # sous le mot et dans la liste, la mention remplace le coût de cette erreur — rien d'autre ne change
 'eleve_autocorrection':R['autocorrection']==[True,True],
 'bilan':('1' in R['bilan_sans_cout']),
 'propre':R['erreurs_prof']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L11 PAR LE GESTE :','VERT' if ok else 'ROUGE'); sys.exit(0 if ok else 1)
