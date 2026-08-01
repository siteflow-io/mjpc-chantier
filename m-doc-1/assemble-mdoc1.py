#!/usr/bin/env python3
# ══ M-DOC-1 — pose du descriptif prof dans les trois apps ══
import re,ast
SEC=ast.literal_eval(open('_sections.py').read())
CSS=open('_css.txt').read()
def charge(n):return open(n+'.base.html',encoding='utf-8').read()
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    return s.replace(a,n)
def poseCSS(s):
    m=re.search(r'^<body[\s>]',s,re.M)
    return s[:m.start()]+CSS+s[m.start():]
def constante(nom,html):
    """le HTML de la doc, en constante nommée — rendu par dangerouslySetInnerHTML :
       les <details> restent NATIFS, aucun JavaScript d'interaction."""
    return 'var '+nom+' = '+repr(html).replace("'",'"',1)[::1].replace('\\n','')+';\n'

def cst(nom,html):
    import json
    return 'var '+nom+' = '+json.dumps(html,ensure_ascii=False)+';\n'

OUT={}
# ═══ ① applause_meter (2.4.0 → 2.5.0) ═══
s=charge('applause_meter')
# la constante se pose au NIVEAU GLOBAL (jamais dans une expression) : juste
# avant la fonction qui rend l'écran des réglages.
_anc='function CarteIACriteres('
if _anc not in s: _anc='function AppProf('
s=sub(s,_anc,cst('DOC_PROF_HTML',SEC['applause_meter'])
      +'/* M-DOC-1 : le descriptif prof, en QUEUE des réglages — la doc ne pousse pas les actions. */\n'+_anc)
# insertion du rendu : juste avant la fermeture du conteneur de l'écran Réglages
i=s.index('section("c","\U0001F39A\ufe0f R\u00e9glages utiles"')
j=s.index('\n  );',i)
s=s[:j]+',\n    h("div",{className:"prof-sec doc-sec",dangerouslySetInnerHTML:{__html:DOC_PROF_HTML}})'+s[j:]
s=poseCSS(s)
s=sub(s,'var APP_VERSION = "2.4.0";','var APP_VERSION = "2.5.0";')
OUT['applause_meter']=s

# ═══ ② analyse_logique (2.5.0 → 2.6.0) ═══
s=charge('analyse_logique')
m=re.search(r'function ReglagesApp\s*\(',s)
i=m.start();j=s.index('{',i);p=0;k=j
while k<len(s):
    c=s[k]
    if c=='{':p+=1
    elif c=='}':
        p-=1
        if p==0:break
    k+=1
# la fin du rendu : ` ) ); }` → on insère avant la dernière parenthèse du h(...)
fin=s.rindex('\n    )\n  );',i,k)   # fin du rendu : « ) \n ); »
s=s[:fin]+''',
    h("div",{className:"prof-sec doc-sec",dangerouslySetInnerHTML:{__html:DOC_PROF_HTML}})'''+s[fin:]
s=sub(s,'function ReglagesApp(',cst('DOC_PROF_HTML',SEC['analyse_logique'])+
      '/* M-DOC-1 : le descriptif prof, en QUEUE des réglages. */\nfunction ReglagesApp(')
s=poseCSS(s)
s=sub(s,'var APP_VERSION = "2.5.0";','var APP_VERSION = "2.6.0";')
OUT['analyse_logique']=s

# ═══ ③ evaluation-qcm (7.4.0 → 7.5.0) + le gabarit qui écrase la pastille ═══
s=charge('evaluation-qcm')
m=re.search(r'function OngletReglages\s*\(',s)
i=m.start()
fin=s.index('VERSION \u00c0 COMPL\u00c9TER',i)
fin2=s.index('\n    )\n  );',fin)
s=s[:fin2]+''',
    h("div",{className:"prof-sec doc-sec",dangerouslySetInnerHTML:{__html:DOC_PROF_HTML}})'''+s[fin2:]
s=sub(s,'function OngletReglages(',cst('DOC_PROF_HTML',SEC['evaluation-qcm'])+
      '/* M-DOC-1 : le descriptif prof, en QUEUE des réglages. */\nfunction OngletReglages(')
# CORRECTIF HORS MANDAT, mesuré et isolé : le gabarit de commentaire écrase la pastille
s=sub(s,'var APP_VERSION = "\u2026";','/* M-DOC-1 : gabarit de commentaire retiré — il ÉCRASAIT la pastille (var APP_VERSION = "…"), rendant le versionnement inutilisable. Mesuré, isolé à cette app. */')
s=poseCSS(s)
s=sub(s,'var APP_VERSION="7.4.0";','var APP_VERSION="7.5.0";')
OUT['evaluation-qcm']=s

for n,x in OUT.items():
    open(n+'.staging.html','w',encoding='utf-8').write(x)
    print(f"{n}: {len(x)} car.")
print("POSÉ ×3")
