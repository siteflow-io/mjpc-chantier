"""Fuzzing de l'écran de correction (fichier en ligne), comme le professeur travaille : gestes au hasard sur des copies
neuves, un MODÈLE de chaque copie tenu à part, comparé au hub après chaque enregistrement et à l'écran après réouverture.
MODE=classique|rapide|mixte ; GRAINE ; NB (copies)."""
import sys, copy, json, random, math, os, re, unicodedata; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER','../live_0aeb.html'); MODE=os.environ.get('MODE','classique'); G=int(os.environ.get('GRAINE','1')); NB=int(os.environ.get('NB','3'))
rnd=random.Random(G); D3='dictee_brevet_blanc_3e-3e_charles_de_gaulle'
COST={'G':1,'L':0.5,'M':1,'I':1,'X':0.5,'P':0.5,'A':0,'E':0.5}; COSTB={'G':1,'L':0.5,'M':0.5,'I':0.5,'X':0.5,'P':0,'A':0,'E':0.5}
def note_attendue(errs,extras,base,br):
    C=COSTB if br else COST; vus={}; ded=0; nP=0
    for e in sorted(errs,key=lambda e:e['idx']):
        k=str(e['word']).lower()+'|'+e['type']
        if br and k in vus: continue
        vus[k]=1
        if br and e['type']=='P': nP+=1; continue
        ded+=C[e['type']]
    ded+=len(extras)*C['X']
    if br: ded+=math.floor(nP/4)*0.5*(base/10)
    return round(max(0,base-ded)*10)/10
def san(n): return re.sub(r'[^a-z0-9]+','_',''.join(c for c in unicodedata.normalize('NFD',n.lower()) if unicodedata.category(c)!='Mn')).strip('_')
# une classe neuve sur la dictée de 3e (barème brevet) : élèves sans copie
db=copy.deepcopy(L.BASE); D=db['correction_dictee'][D3]; cfg=D['config']; base=cfg.get('base',10); br=cfg.get('bareme')=='brevet'
NOMS=['ZZTEST Alpha','ZZTEST Bravo','ZZTEST Charlie','ZZTEST Delta','ZZTEST Echo','ZZTEST Foxtrot']
db['classes'][cfg['classe']]['eleves']=list(db['classes'][cfg['classe']]['eleves'])+NOMS
b=Banc(F,1400,900); p=b.ouvrir('?mode=prof',db=db); p.wait_for_timeout(1000); dlg=[]
p.on('dialog',lambda d: dlg.append(d.message[:80]))
p.evaluate('''()=>{const el=[...document.querySelectorAll('div')].filter(x=>x.children.length<12&&x.textContent.includes('brevet blanc 3E')&&x.textContent.includes('Ouvrir'));const c=el[el.length-1];[...c.querySelectorAll('button,a,span')].find(x=>x.textContent.trim().startsWith('Ouvrir')).click()}'''); p.wait_for_timeout(1400)
bugs=[]; journal=[]
def bug(s,detail): bugs.append((s,detail)); print('  BUG',s,'—',detail[:260],flush=True)
def ouvrir(nom): p.evaluate("(n)=>{const x=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim()===n);(x[0].closest('button,[role=button],div[style*=cursor]')||x[0]).click()}",'Z. '+nom.split(' ')[-1]); p.wait_for_timeout(900)
def retour(): p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent==='←');b&&b.click()}"); p.wait_for_timeout(600)
def toks(): return p.evaluate("()=>[...document.querySelectorAll('.word-grid button.word-btn')].map(b=>b.textContent)")
def barre(): return p.evaluate("()=>{const t=document.body.innerText;const i=t.indexOf('🔀');return i>0?t.slice(0,i).replace(/\\n/g,' '):''}")
def popup_btn(t): return p.evaluate("(t)=>{const b=document.querySelector('.popup-btn-'+t.toLowerCase());if(!b)return false;b.click();return true}",t)
def fautif(v):
    if v is None: return p.evaluate("()=>{const b=[...document.querySelectorAll('.popup-overlay button')].find(x=>x.textContent.trim()==='Passer');if(b){b.click();return true}return false}")
    ok=p.evaluate("(v)=>{const i=[...document.querySelectorAll('.popup-overlay input')][0];if(!i)return false;const d=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;d.call(i,v);i.dispatchEvent(new Event('input',{bubbles:true}));return true}",v)
    p.wait_for_timeout(80); p.keyboard.press('Enter'); return ok
def passe_copie(nom,k,modele,extras,passe,sidx):
    dlg.clear(); ouvrir(nom); T=toks(); n=len(T)
    if not T: bug('ouverture','copie de %s introuvable'%nom); return
    punct=[i for i,w in enumerate(T) if w in ',;:.!?«»"'] ; apos=[i for i,w in enumerate(T) if w in "'’"]; mots=[i for i in range(n) if i not in punct and i not in apos]
    GLm=[e for e in modele.values() if e['type'] in 'GL']
    tousGL_fautif=(all(e['fautif'] for e in GLm) if GLm else rnd.random()<0.7)
    gestes=[]
    for g in range(rnd.randint(6,16)):
        a=rnd.choice(['marquer','marquer','marquer','demarquer','changer','trop'])
        if a=='marquer' or (a in('demarquer','changer') and not modele):
            i=rnd.choice(mots+punct+apos)
            if i in modele: continue
            t='P' if i in punct else (rnd.choice(['E','G','L']) if i in apos else rnd.choice(['G','L','M','I','A','G','L']))
            p.evaluate("(i)=>document.querySelectorAll('.word-grid button.word-btn')[i].click()",i); p.wait_for_timeout(200)
            if not popup_btn(t): bug('choix du type','pas de bouton %s pour « %s »'%(t,T[i])); p.keyboard.press('Escape'); continue
            p.wait_for_timeout(200); f=None
            if t in 'GL':
                f=(T[i]+'x') if tousGL_fautif else None
                fautif(f); p.wait_for_timeout(200)
            modele[i]={'idx':i,'type':t,'word':T[i],'fautif':f}; gestes.append('marquer %d %s'%(i,t))
        elif a in ('demarquer','changer'):
            i=rnd.choice(list(modele)); p.evaluate("(i)=>document.querySelectorAll('.word-grid button.word-btn')[i].click()",i); p.wait_for_timeout(250)
            if p.evaluate("()=>!!document.querySelector('.popup-overlay')"): bug('démarquer','re-cliquer « %s » ouvre une fenêtre au lieu de retirer'%T[i]); p.keyboard.press('Escape')
            else: del modele[i]; gestes.append('démarquer %d'%i)
        elif a=='trop':
            z=rnd.randint(0,max(0,n-2)); w=rnd.choice(['très','donc','les','bien'])
            ok=p.evaluate("(z)=>{const zz=document.querySelectorAll('.word-grid .insert-zone');if(!zz[z])return false;zz[z].click();return true}",z); p.wait_for_timeout(200)
            if not ok: continue
            p.fill('input[placeholder="Le mot en trop..."]',w); p.evaluate("()=>[...document.querySelectorAll('button')].find(x=>x.textContent.startsWith('Ajouter')).click()"); p.wait_for_timeout(250)
            extras.append(w); gestes.append('trop %s'%w)
    na=note_attendue(list(modele.values()),extras,base,br); fr=lambda x:(('%g'%x).replace('.',','))
    bb=barre()
    if not bb.startswith(fr(na)+' '): bug('barre avant enregistrement','%s passe %d : barre « %s », attendu %s (gestes : %s)'%(nom,passe,bb[:40],fr(na),'; '.join(gestes)))
    p.evaluate("()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.startsWith('Enregistrer'));b&&b.click()}"); p.wait_for_timeout(900)
    r=b.lire(p,'correction_dictee/%s/results/%s'%(D3,k))
    incomplet=any(e['type'] in 'GL' and e['fautif'] for e in modele.values()) and any(e['type'] in 'GL' and not e['fautif'] for e in modele.values())
    if not r:
        if not incomplet: bug('enregistrement','%s passe %d : copie non enregistrée (fenêtres : %s ; gestes : %s)'%(nom,passe,dlg[:1],'; '.join(gestes)))
        if p.evaluate("()=>!!document.querySelector('.word-grid')"): retour()
        return
    re_=sorted((e['idx'],e['type'],e['word'],e.get('fautif') or None) for e in (r.get('errors') or []) if e)
    me=sorted((e['idx'],e['type'],e['word'],e['fautif'] or None) for e in modele.values())
    if re_!=me: bug('erreurs enregistrées','%s passe %d : hub %s ≠ modèle %s (gestes : %s)'%(nom,passe,re_,me,'; '.join(gestes)))
    rx=sorted(x['word'] for x in (r.get('extras') or []) if x)
    if rx!=sorted(extras): bug('mots en trop enregistrés','%s passe %d : hub %s ≠ %s'%(nom,passe,rx,sorted(extras)))
    if abs((r.get('note') or 0)-na)>1e-9: bug('note enregistrée','%s passe %d : %s ≠ %s'%(nom,passe,r.get('note'),na))
    if p.evaluate("()=>!!document.querySelector('.word-grid')"): retour()
    ouvrir(nom); bb2=barre()
    if not bb2.startswith(fr(r.get('note') or 0)+' '): bug('réouverture','%s passe %d : barre « %s » ≠ note %s'%(nom,passe,bb2[:40],fr(r.get('note') or 0)))
    retour(); print('copie %d %s passe %d : %d erreurs, %d en trop, note %s %s'%(sidx+1,nom,passe,len(modele),len(extras),fr(na),'(fenêtre : '+dlg[0]+')' if dlg else ''),flush=True)
for s_ in range(NB):
    nom=NOMS[s_%len(NOMS)]; k=san(nom); modele={}; extras=[]
    for passe in (1,2): passe_copie(nom,k,modele,extras,passe,s_)
print('\nBILAN fuzzing correction %s graine %d : %d copies, %d bugs'%(MODE,G,NB,len(bugs)))
print('réseau : accès au vrai hub',len(b.violations),'| erreurs de page',b.erreurs[:2]); b.fermer()
