"""L10 — la capitalisation des formes fautives (maquette v2), par le geste : la reconstruction unique, la liste (toutes les dictées,
triée, sans le mot juste ni le vide), le pavé qui compose (3 → prise ; 1 → attend ; 1,2 → la 12 ; 1 + Entrée), la rangée du haut qui
écrit « 3 », Ctrl+2, la garde, Échap (le numéro puis la case), une forme nouvelle qui rejoint la liste, Ctrl+Z qui retire l'objet,
le mode texte, la suppression d'une copie et d'une dictée qui laisse les objets, le contrat de purge. Faux hub du kit, ZZTEST."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
def deplierNiveaux(p):
    p.evaluate("() => { document.querySelectorAll('.niveau-l15c[data-ouvert=\"0\"] h3').forEach(function(h){ h.click() }) }"); p.wait_for_timeout(300)   # [L15c-c] les niveaux sont repliés par défaut

F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cfg3=db['correction_dictee'][D3]['config']; cl=cfg3['classe']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Xray']
IDX=32   # « syllabes » dans le texte du brevet blanc 3E
def copie(f,t='G'): return {'errors':[{'idx':IDX,'type':t,'word':'syllabes','fautif':f}],'extras':[],'note':9,'deduction':1,'counts':{t:1},'timestamp':1,'amenagee':False}
jum={'zztest_a%d'%i:copie('silabes') for i in (1,2,3)}
jum.update({'zztest_b1':copie('2'),'zztest_b2':copie('Syllabes','L'),'zztest_b3':copie('')})
for i,f in enumerate(['sylabes','syllabe','syllabbes','sillabes','syllables','sylabe','syllabs','cilabes','syllabees','sylllabes']): jum['zztest_c%d'%i]=copie(f)
db['correction_dictee']['dictee_zz_jumelle']={'config':dict(cfg3,title='ZZTEST jumelle'),'results':jum}
db['correction_dictee']['dictee_zz_autre']={'config':dict(cfg3,title='ZZTEST autre texte',text='Les syllabes chantent la nuit.'),'results':{'zztest_d1':{'errors':[{'idx':1,'type':'G','word':'syllabes','fautif':'syllab'}],'extras':[],'note':9,'deduction':1,'counts':{'G':1},'timestamp':1,'amenagee':False}}}
CLES=set(k for d in db['correction_dictee'].values() for k in (d.get('results') or {}))
R={}
b=Banc(F,1366,768); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; CONS=[]; p.on('console',lambda m:(CONS.append(m.text[:200]) if m.type=='error' else None))
R['avant_noeud']=b.lire(p,'correction_dictee_erreurs')
def ouvrir_dictee(t='brevet blanc 3E'):
    p.evaluate('''(t)=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes(t)&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}''',t); p.wait_for_timeout(2800)
ouvrir_dictee()
R['ligne']=p.evaluate("()=>{const e=document.getElementById('ligne-formes');return e?e.innerText:null}")
objs=b.lire(p,'correction_dictee_erreurs') or {}; R['objets']=len(objs)
R['objets_propres']=all(set(o.keys())<={'id','creeLe','mot','forme','type','dicteeId','texteKey','niveau'} and not any(str(v) in CLES or str(v)==cl for v in o.values()) for o in objs.values())
def attendue():   # la liste attendue, recalculée depuis les objets du hub (la règle de la maquette)
    o=b.lire(p,'correction_dictee_erreurs') or {}; acc={}; ordre=[]
    for x in o.values():
        if x.get('mot')!='syllabes': continue
        f=str(x.get('forme','')).strip()
        if not f or f=='syllabes': continue   # [accordé à L15-0] casse comprise
        k=f
        if k not in acc: acc[k]=[f,0]; ordre.append(k)
        acc[k][1]+=1
    import functools
    return [f'{i+1} {f} ×{c}' for i,(f,c) in enumerate(sorted((acc[k] for k in ordre),key=lambda a:(-a[1],a[0].casefold(),a[0])))]   # [accordé à L15-0] l'ordre de localeCompare (la casse après les lettres)
def liste(): return [' '.join(t.split()) for t in p.locator('.liste-formes .forme').all_inner_texts()]
def hub(): r=b.lire(p,'correction_dictee/%s/results/zztest_xray'%D3) or {}; return [(e['idx'],e['type'],e.get('fautif')) for e in (r.get('errors') or []) if e]
def ouvrir_g(t='g'): p.keyboard.press(t); p.wait_for_timeout(400)
p.locator('.eleve-card',has_text='Z. Xray').first.click(); p.wait_for_timeout(900); p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
for _ in range(IDX): p.keyboard.press(' '); p.wait_for_timeout(40)
p.wait_for_timeout(300); ouvrir_g('g')
L0=liste(); R['liste']=L0; R['liste_attendue']=attendue()
if CAP: p.screenshot(path=CAP+'/L10-rapide-liste.png')
p.keyboard.press('Numpad3'); p.wait_for_timeout(600); R['numpad3']=hub()[-1:]
p.keyboard.press('Backspace'); p.wait_for_timeout(300); ouvrir_g('l'); p.keyboard.press('Numpad1'); p.wait_for_timeout(300)
R['compose']=(p.evaluate("()=>{const e=document.querySelector('.num-formes');return e?e.innerText:null}"),p.locator('.liste-formes .forme.candidat').count(),p.locator('.liste-formes .forme.exact').count())
if CAP: p.screenshot(path=CAP+'/L10-rapide-compose.png')
p.keyboard.press('Numpad2'); p.wait_for_timeout(600); R['numpad12']=hub()[-1:]
p.keyboard.press('Backspace'); p.wait_for_timeout(300); ouvrir_g('g'); L1=liste(); p.keyboard.press('Numpad1'); p.keyboard.press('Enter'); p.wait_for_timeout(600); R['numpad1_entree']=(hub()[-1:],L1[0] if L1 else None)
p.keyboard.press('Backspace'); p.wait_for_timeout(300); ouvrir_g('l'); p.keyboard.press('Digit3'); p.wait_for_timeout(200); v3=p.evaluate("()=>document.activeElement&&document.activeElement.value"); p.keyboard.press('Enter'); p.wait_for_timeout(600); R['digit3']=(v3,hub()[-1:])
p.keyboard.press('Backspace'); p.wait_for_timeout(300); ouvrir_g('g'); L2=liste(); p.keyboard.press('Numpad2'); p.wait_for_timeout(600); R['ctrl2']=(hub()[-1:],L2[1] if len(L2)>1 else None)   # [L10b — Paul] Ctrl + chiffre retiré : le pavé seul choisit
p.keyboard.press('Backspace'); p.wait_for_timeout(300); ouvrir_g('g'); n0=len(hub()); p.keyboard.type('syllabes'); p.keyboard.press('Enter'); p.wait_for_timeout(400)
R['garde']=(p.evaluate("()=>!!document.getElementById('garde-mot')"),hub()[-1:])
p.keyboard.press('Control+a'); p.keyboard.press('Delete'); p.wait_for_timeout(150); p.keyboard.press('Numpad1'); p.wait_for_timeout(300)
p.keyboard.press('Escape'); p.wait_for_timeout(200)
R['echap']=(p.evaluate("()=>{const e=document.querySelector('.num-formes');return e?e.innerText:null}"),p.locator('.liste-formes').count()>0)
p.keyboard.press('Escape'); p.wait_for_timeout(300); R['echap2']=p.locator('.liste-formes').count()==0
ouvrir_g('g'); p.keyboard.type('zzneuve'); p.keyboard.press('Enter'); p.wait_for_timeout(600)
o=b.lire(p,'correction_dictee_erreurs') or {}; R['neuve_objet']=sum(1 for x in o.values() if x.get('forme')=='zzneuve')
p.keyboard.press('Backspace'); p.wait_for_timeout(300); ouvrir_g('g'); R['neuve_liste']=any('zzneuve' in t for t in liste()); p.keyboard.press('Escape'); p.wait_for_timeout(200); p.keyboard.press('Escape'); p.wait_for_timeout(200)
# le mode texte : la même liste, les mêmes gestes ; Ctrl+Z retire l'objet
p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
p.locator('.word-grid button.word-btn[data-word-idx="30"]').click(); p.wait_for_timeout(300); p.locator('.popup-btn-g').first.click(); p.wait_for_timeout(300)
p.keyboard.type('zzctrlz'); p.keyboard.press('Enter'); p.wait_for_timeout(600)
o=b.lire(p,'correction_dictee_erreurs') or {}; R['ctrlz_avant']=sum(1 for x in o.values() if x.get('forme')=='zzctrlz')
p.keyboard.press('Control+z'); p.wait_for_timeout(700); o=b.lire(p,'correction_dictee_erreurs') or {}; R['ctrlz_apres']=sum(1 for x in o.values() if x.get('forme')=='zzctrlz')
p.locator('.word-grid button.word-btn[data-word-idx="%d"]'%IDX).click(); p.wait_for_timeout(400)
if p.locator('.popup-btn-g').count()==0: p.locator('.word-grid button.word-btn[data-word-idx="%d"]'%IDX).click(); p.wait_for_timeout(400)
p.keyboard.press('g'); p.wait_for_timeout(400); LT=liste(); R['texte_liste']=(LT[:3],len(LT))

if CAP: p.screenshot(path=CAP+'/L10-texte-liste.png')
p.keyboard.press('Numpad3'); p.wait_for_timeout(600); R['texte_numpad3']=[x for x in hub() if x[0]==IDX]

# la suppression d'une copie, puis d'une dictée : les objets restent ; la reconstruction n'a lieu qu'une fois
nb_avant=len(b.lire(p,'correction_dictee_erreurs') or {})
R['avant_reset']=p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='↻');if(!b)return 'absent';const r=b.getBoundingClientRect();const e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return [r.top,r.left,e?e.className+'|'+e.tagName:null,!!document.querySelector('.popup-overlay')]}")
p.locator('button:has-text("↻")').first.scroll_into_view_if_needed(); p.locator('button:has-text("↻")').first.click(); p.wait_for_timeout(1500)
R['copie_effacee']=b.lire(p,'correction_dictee/%s/results/zztest_xray'%D3) is None; R['apres_copie']=len(b.lire(p,'correction_dictee_erreurs') or {})==nb_avant
p.locator('button:has-text("← Retour")').first.click(); p.wait_for_timeout(1500)
p.locator('div',has_text='ZZTEST jumelle').filter(has=p.locator('button[title^="Supprimer (archiv"]')).last.locator('button[title^="Supprimer (archiv"]').first.click(); p.wait_for_timeout(2500)
R['dictee_effacee']=b.lire(p,'correction_dictee/dictee_zz_jumelle/results') is None; R['apres_dictee']=len(b.lire(p,'correction_dictee_erreurs') or {})==nb_avant
ouvrir_dictee(); R['une_fois']=(p.evaluate("()=>!document.getElementById('ligne-formes')"),len(b.lire(p,'correction_dictee_erreurs') or {})==nb_avant)
man=b.lire(p,'manifestes/correction_dictee') or {}; R['contrat']=('correction_dictee_erreurs' in json.dumps(man.get('purge',man)), json.dumps(man)[:0])
R['fenetres']=dlg; R['erreurs']=b.erreurs[:3]
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
Lst=R['liste']
conds={'avant_vide':R['avant_noeud'] is None,
 'reconstruit':bool(R['ligne']) and ('%d formes retenues'%R['objets']) in R['ligne'] and R['objets']>=15 and R['objets_propres'],
 'liste_complete_triee':Lst==R['liste_attendue'] and Lst[0].startswith('1 silabes ×3') and any(' syllab ×' in x for x in Lst) and any(' 2 ×' in x for x in Lst) and any(' Syllabes ×' in x for x in Lst) and not any(' syllabes ×' in x for x in Lst) and len(Lst)>=14,
 'numpad3':R['numpad3'] and R['numpad3'][0][2]==Lst[2].split(' ',1)[1].rsplit(' ×',1)[0],
 'compose':R['compose'][0]=='n° 1' and R['compose'][1]==1+sum(1 for i in range(10,len(Lst)+1) if str(i).startswith('1')) and R['compose'][2]==1,
 'numpad12':R['numpad12'] and len(Lst)>=12,
 'numpad1_entree':R['numpad1_entree'][0] and R['numpad1_entree'][1] and R['numpad1_entree'][0][0][2]==R['numpad1_entree'][1].split(' ',1)[1].rsplit(' ×',1)[0],
 'digit3':R['digit3'][0]=='3' and R['digit3'][1][0][2]=='3' and R['digit3'][1][0][1]=='L',
 'ctrl2':R['ctrl2'][0] and R['ctrl2'][1] and R['ctrl2'][0][0][2]==R['ctrl2'][1].split(' ',1)[1].rsplit(' ×',1)[0],
 'garde':R['garde'][0] is True,
 'echap':R['echap'][0] in ('',None) and R['echap'][1] is True and R['echap2'] is True,
 'neuve':R['neuve_objet']==1 and R['neuve_liste'] is True,
 'ctrlz':R['ctrlz_avant']==1 and R['ctrlz_apres']==0,
 'texte':R['texte_liste'][1]>=13 and R['texte_numpad3'] and R['texte_numpad3'][0][1]=='G',
 'survie':R['copie_effacee'] and R['apres_copie'] and R['dictee_effacee'] and R['apres_dictee'],
 'une_fois':R['une_fois']==[True,True], 'contrat':R['contrat'][0] is True,
 'propre':R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L10 PAR LE GESTE :','VERT' if ok else 'ROUGE'); b.fermer(); sys.exit(0 if ok else 1)
