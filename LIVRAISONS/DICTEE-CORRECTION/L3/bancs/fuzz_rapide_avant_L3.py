"""Fuzzing du MODE RAPIDE (fichier en ligne) : touches au clavier comme le professeur, modèle tenu à part,
comparé au hub après chaque touche (le mode rapide enregistre à chaque erreur), puis au retour en mode texte."""
import sys, copy, json, random, math, os, re, unicodedata; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_0aeb.html'); G=int(os.environ.get('GRAINE','1')); NB=int(os.environ.get('NB','2')); rnd=random.Random(G)
D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
def san(n): return re.sub(r'[^a-z0-9]+','_',''.join(c for c in unicodedata.normalize('NFD',n.lower()) if unicodedata.category(c)!='Mn')).strip('_')
db=copy.deepcopy(L.BASE); cl=db['correction_dictee'][D3]['config']['classe']; NOMS=['ZZTEST Golf','ZZTEST Hotel','ZZTEST India','ZZTEST Juliet']
db['classes'][cl]['eleves']=list(db['classes'][cl]['eleves'])+NOMS
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]; p.on('dialog',lambda d: dlg.append(d.message[:80]))
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
bugs=[]
def bug(s,d): bugs.append((s,d)); print('  BUG',s,'—',d[:300],flush=True)
def ouvrir(nom): p.evaluate("(n)=>{const x=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim()===n);(x[0].closest('button,[role=button],div[style*=cursor]')||x[0]).click()}",'Z. '+nom.split(' ')[-1]); p.wait_for_timeout(900)
def pos():
    t=p.evaluate("()=>{const m=document.body.innerText.match(/Mot (\\d+)\\/(\\d+)/);return m?[+m[1],+m[2]]:null}"); return t
def fastword(): return p.evaluate("()=>{const e=document.querySelector('.fast-word');return e?e.textContent:null}")
def fautif_popup(): return p.evaluate("()=>!![...document.querySelectorAll('input')].find(i=>(i.placeholder||'').length&&i.offsetParent&&!i.closest('.word-grid'))")
for s_ in range(NB):
    nom=NOMS[s_%len(NOMS)]; k=san(nom); modele={}; journal=[]
    ouvrir(nom); T=p.evaluate("()=>[...document.querySelectorAll('.word-grid button.word-btn')].map(b=>b.textContent)")
    p.keyboard.press('Shift+R'); p.wait_for_timeout(900)
    if not pos(): bug('entrée en mode rapide','pas de « Mot x/y » pour %s'%nom); continue
    for g in range(rnd.randint(25,45)):
        ps=pos()
        if not ps: bug('mode rapide','compteur disparu après : %s'%'; '.join(journal[-4:])); break
        i=ps[0]-1; w=fastword()
        if not (w or '').startswith(T[i]): bug('mot courant','« %s » affiché, le mot n°%d du texte est « %s » (après : %s)'%(w,i+1,T[i],'; '.join(journal[-3:])))
        punct=T[i] in ',;:.!?«»"'; apos=T[i] in "'’"
        a=rnd.choice(['espace','espace','espace','marquer','marquer','retour'])
        if a=='espace': p.keyboard.press(' '); journal.append('espace@%d'%i)
        elif a=='retour': p.keyboard.press('Backspace'); journal.append('retour@%d'%i)
        else:
            if i in modele: p.keyboard.press(' '); journal.append('espace@%d (déjà marqué)'%i); p.wait_for_timeout(120); continue
            t='p' if punct else ('e' if apos else rnd.choice(['g','l','m','i','a','g','l']))
            p.keyboard.press(t); p.wait_for_timeout(250); f=None
            if t in 'gl':
                if fautif_popup():
                    if rnd.random()<0.7:
                        f=T[i]+'z'; p.keyboard.type(f); p.wait_for_timeout(80); p.keyboard.press('Enter')
                    else:
                        p.keyboard.press('Enter'); f=None
                else: bug('saisie de la forme écrite','pas de champ après %s sur « %s »'%(t.upper(),T[i]))
            modele[i]={'idx':i,'type':t.upper(),'word':T[i],'fautif':f}; journal.append('%s@%d%s'%(t.upper(),i,' «%s»'%f if f else ''))
        p.wait_for_timeout(220)
        r=b.lire(p,'correction_dictee/%s/results/%s'%(D3,k)) or {}
        hub=sorted((e['idx'],e['type'],e.get('fautif') or None) for e in (r.get('errors') or []) if e)
        mod=sorted((e['idx'],e['type'],e['fautif']) for e in modele.values())
        if modele and hub!=mod: bug('enregistrement automatique','%s après « %s » : hub %s ≠ modèle %s'%(nom,journal[-1],hub[-4:],mod[-4:])); break
    # retour au mode texte : les erreurs y sont toutes
    p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('← Texte'));b&&b.click()}"); p.wait_for_timeout(900)
    n_ecran=p.evaluate("()=>[...document.querySelectorAll('.word-grid button.word-btn')].filter(b=>/err|marked|badge/.test(b.className)||b.querySelector('sup,.badge')).length")
    bb=p.evaluate("()=>{const t=document.body.innerText;const i=t.indexOf('🔀');return i>0?t.slice(0,i).replace(/\\n/g,' '):''}")
    print('copie %d %s : %d erreurs au modèle | barre en mode texte : %s'%(s_+1,nom,len(modele),bb[:50]),flush=True)
    p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent==='←');b&&b.click()}"); p.wait_for_timeout(600)
print('\nBILAN fuzzing mode rapide graine %d : %d copies, %d bugs | fenêtres : %s'%(G,NB,len(bugs),dlg[:2]))
print('réseau : accès au vrai hub',len(b.violations),'| erreurs de page',b.erreurs[:2]); b.fermer()
