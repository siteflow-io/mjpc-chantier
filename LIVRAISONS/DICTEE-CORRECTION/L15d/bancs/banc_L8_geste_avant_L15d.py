"""L8 — le mode texte au clavier : la recherche permanente (un mot unique s'ouvre ; des doublons clignotent, flèches, Entrée),
le curseur (← → sautent la ponctuation ; ↑ ↓ changent de ligne, vérifié par la géométrie ; Entrée), le menu au clavier
(G, L avec la garde du mot juste, M adaptée, I, A), Ctrl+Z ; aucune collision avec ⇧R ni avec un champ ouvert.
Par le geste (touches réelles), faux hub du kit, ZZTEST."""
import sys, copy, os, json; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_663.html'); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'; CAP=os.environ.get('CAPTURES','')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+['ZZTEST Whiskey']
R={}
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d:(dlg.append(d.message[:90]),d.dismiss()))
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(2500)
p.locator('.eleve-card',has_text='Z. Whiskey').first.click(); p.wait_for_timeout(1000)
def hub(): r=b.lire(p,'correction_dictee/%s/results/zztest_whiskey'%D3) or {}; return [(e['idx'],e['type'],e.get('fautif')) for e in (r.get('errors') or []) if e]
def popup(): return p.evaluate("()=>{const e=document.querySelector('.popup-word');return e?e.textContent:null}")
def classe(c): return p.evaluate("(c)=>[...document.querySelectorAll('.word-btn.'+c)].map(e=>+e.dataset.wordIdx)",c)
def mot(i): return p.evaluate("(i)=>{const e=document.querySelector('[data-word-idx=\"'+i+'\"]');return e?e.childNodes[0].textContent:null}",i)
def boite(i): return p.evaluate("(i)=>{const r=document.querySelector('[data-word-idx=\"'+i+'\"]').getBoundingClientRect();return [r.left,r.top,r.width,r.height]}",i)
def tape(s,att=250):
    for ch in s: p.keyboard.press(ch); p.wait_for_timeout(80)
    p.wait_for_timeout(att)
# 1. un mot unique s'ouvre : « pre » → « préoccupations » ? non : « pr » donne aussi « propos » ; « déc » → décomposition seul
tape('sy'); R['unique']=popup(); p.keyboard.press('Escape'); p.wait_for_timeout(300)
# 2. des doublons : « lui » (deux fois au début du texte) — clignotent, la bande, flèches, Entrée
tape('lui',400); R['doublons']={'clignotent':sorted(classe('cand-blink')+classe('cand-courant')),'courant':classe('cand-courant'),'bande':p.evaluate("()=>{const e=document.getElementById('bande-recherche');return e?e.innerText:null}")}
if CAP: p.screenshot(path=CAP+'/L8-recherche.png')
c0=R['doublons']['courant']; p.keyboard.press('ArrowRight'); p.wait_for_timeout(300); R['fleche_candidat']=(c0,classe('cand-courant'))
p.keyboard.press('Enter'); p.wait_for_timeout(400); R['entree_candidat']=(popup(),classe('cand-blink'))
# 3. le menu ouvert : G → le champ ; le mot juste refusé ; un autre mot accepté ; Ctrl+Z l'annule
cible=R['fleche_candidat'][1][0] if R['fleche_candidat'][1] else None
p.keyboard.press('g'); p.wait_for_timeout(300); p.keyboard.type('lui'); p.keyboard.press('Enter'); p.wait_for_timeout(400)
R['garde']=(p.evaluate("()=>!!document.getElementById('garde-mot-texte')"),len(hub()))
p.keyboard.press('Control+a'); p.keyboard.type('luit'); p.keyboard.press('Enter'); p.wait_for_timeout(500); R['g_pose']=hub()
p.keyboard.press('Control+z'); p.wait_for_timeout(500); R['ctrl_z']=hub()
# 4. le curseur : un mot ouvert par la recherche (« fort », suivi d'une virgule) devient le curseur ; → saute la ponctuation ; ↓ change de ligne (géométrie) ; Entrée ; M adaptée
tape('fort'); p.keyboard.press('Escape'); p.wait_for_timeout(300)
R['curseur_depart']=classe('curseur-blink')
dep=R['curseur_depart'][0] if R['curseur_depart'] else None
p.keyboard.press('ArrowRight'); p.wait_for_timeout(250); a1=classe('curseur-blink'); R['droite']=(dep,mot(dep) if dep is not None else None,a1,mot(a1[0]) if a1 else None)
y0=p.evaluate("()=>scrollY"); b1=boite(a1[0]) if a1 else None
p.keyboard.press('ArrowDown'); p.wait_for_timeout(300); a2=classe('curseur-blink'); b2=boite(a2[0]) if a2 else None
R['bas']=(a1,a2,b1,b2,p.evaluate("()=>scrollY")==y0)
p.keyboard.press('ArrowUp'); p.wait_for_timeout(300); a3=classe('curseur-blink'); R['haut']=(a3,boite(a3[0]) if a3 else None)
p.keyboard.press('Enter'); p.wait_for_timeout(300); R['entree_curseur']=popup(); p.keyboard.press('m'); p.wait_for_timeout(500); R['m_pose']=hub()
if CAP: p.screenshot(path=CAP+'/L8-curseur.png')
# 5. aucune collision : ⇧R bascule toujours ; un champ ouvert garde ses lettres
p.keyboard.press('Shift+R'); p.wait_for_timeout(800); R['shiftR']=p.evaluate("()=>!!document.querySelector('.fast-word')"); p.keyboard.press('Shift+R'); p.wait_for_timeout(800)
R['retour_texte']=p.evaluate("()=>!!document.querySelector('.word-grid')")
p.locator('.word-grid button.word-btn[data-word-idx="1"]').click(); p.wait_for_timeout(200); p.locator('.popup-btn-l').first.click(); p.wait_for_timeout(200)
p.keyboard.type('abc'); p.wait_for_timeout(300); R['champ']=(p.evaluate("()=>document.activeElement&&document.activeElement.value"),p.evaluate("()=>!!document.getElementById('bande-recherche')"))
p.keyboard.press('Enter'); p.wait_for_timeout(400)
R['fenetres']=dlg; R['erreurs']=b.erreurs[:3]
print(json.dumps(R,ensure_ascii=False)); R=json.loads(json.dumps(R))
d=R['droite']; bas=R['bas']
ok=(R['unique'] and 'décomposition' in R['unique']
    and len(R['doublons']['clignotent'])>=2 and R['doublons']['bande'] and 'lui' in R['doublons']['bande'] and len(R['doublons']['courant'])==1
    and R['fleche_candidat'][1] and R['fleche_candidat'][1][0]>R['fleche_candidat'][0][0]
    and R['entree_candidat'][0] and 'lui' in R['entree_candidat'][0] and R['entree_candidat'][1]==[]
    and R['garde'][0] is True and R['garde'][1]==0 and len(R['g_pose'])==1 and R['g_pose'][0][1]=='G' and R['g_pose'][0][2]=='luit' and R['ctrl_z']==[]
    and d[2] and d[3] not in (',','.',"'",'’') and d[2][0]>d[0]
    and bas[1] and bas[3][1]>bas[2][1]+bas[2][3]/2 and bas[4] is True
    and R['haut'][0] and abs(R['haut'][1][1]-bas[2][1])<2
    and R['entree_curseur'] and len(R['m_pose'])==1 and R['m_pose'][0][1]=='M'
    and R['shiftR'] is True and R['retour_texte'] is True and R['champ']==['abc',False]
    and R['fenetres']==[] and R['erreurs']==[])
conds={'unique':bool(R['unique'] and 'syllabes' in R['unique']),'doublons':bool(len(R['doublons']['clignotent'])>=2 and R['doublons']['bande'] and 'lui' in R['doublons']['bande'] and len(R['doublons']['courant'])==1),
 'fleche':bool(R['fleche_candidat'][1] and R['fleche_candidat'][1][0]>R['fleche_candidat'][0][0]),'entree':bool(R['entree_candidat'][0] and 'lui' in R['entree_candidat'][0] and R['entree_candidat'][1]==[]),
 'garde':R['garde']==[True,0],'g':bool(len(R['g_pose'])==1 and R['g_pose'][0][1]=='G' and R['g_pose'][0][2]=='luit'),'ctrlz':R['ctrl_z']==[],
 'droite':bool(d[2] and d[1]=='fort' and d[3]=='et'),'bas':bool(bas[1] and bas[3][1]>bas[2][1]+bas[2][3]/2 and bas[4] is True),'haut':bool(R['haut'][0] and abs(R['haut'][1][1]-bas[2][1])<2),
 'entree_curseur':bool(R['entree_curseur'] and len(R['m_pose'])==1 and R['m_pose'][0][1]=='M'),'collisions':bool(R['shiftR'] is True and R['retour_texte'] is True and R['champ']==['abc',False]),'propre':R['fenetres']==[] and R['erreurs']==[]}
print('conditions :',conds); ok=all(conds.values())
print('BANC L8 PAR LE GESTE :','VERT' if ok else 'ROUGE'); b.fermer(); sys.exit(0 if ok else 1)
