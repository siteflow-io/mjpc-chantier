#!/usr/bin/env python3
# ══ M-PROMPT-4 — la présentation dans les huit fichiers ══
import re
CANON=open('mjpc-core.staging.js',encoding='utf-8').read()
# la §12 v1.5.0, à substituer au bloc §12 v1.4.0 embarqué (le socle d'index n'est
# PAS contigu : on ne remplace jamais en bloc, on substitue la section nommée)
I12=CANON.index('// ── 12. Zone prompt IA')
F12=CANON.index('var MJPC_CORE_VERSION="1.5.0";')
SEC12=CANON[I12:F12]

def charge(n):return open(n+'.base.html',encoding='utf-8').read()
def ecrit(n,s):open(n+'.staging.html','w',encoding='utf-8').write(s)
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    return s.replace(a,n)

def socle12(s):
    """Remplace la §12 embarquée (v1.4.0) par la v1.5.0. Le reste du socle,
       pastille comprise, n'est pas touché — index.html n'est pas contigu."""
    d=s.index('// ── 12. Zone prompt IA')
    fm='var MJPC_CORE_VERSION="1.4.0";'
    f=s.index(fm)
    return s[:d]+SEC12+'var MJPC_CORE_VERSION="1.5.0";'+s[f+len(fm):]

# ── les neuf déclarations d'usage, MESURÉES dans les apps (titres + écrans) ──
USAGES={
 'correction_dictee':("\u00c0 partir des erreurs relev\u00e9es dans une dict\u00e9e, chaque \u00e9l\u00e8ve re\u00e7oit ses propres exercices de rem\u00e9diation, et la classe une s\u00e9rie commune.",
   "Pas sans dict\u00e9e corrig\u00e9e en amont : cet outil part des erreurs r\u00e9elles."),
 'worktrack':("Un parcours de s\u00e9ances que l\u2019\u00e9l\u00e8ve suit \u00e0 son rythme, en autonomie : il franchit une \u00e9tape quand il a r\u00e9ussi le contr\u00f4le de fin.",
   "Pas pour une activit\u00e9 d\u2019une heure : c\u2019est fait pour une s\u00e9quence longue."),
 'dictee_universelle':("Le professeur dicte, chaque \u00e9l\u00e8ve \u00e9crit sur son appareil, puis les \u00e9l\u00e8ves se corrigent DEUX \u00c0 DEUX : chacun corrige la copie d\u2019un camarade et peut contester une correction.",
   "Pas quand le professeur veut corriger seul : la co\u00e9valuation entre \u00e9l\u00e8ves est le c\u0153ur de l\u2019outil."),
 'pilotage_debat_s3':("Un d\u00e9bat organis\u00e9 en \u00e9quipes et en manches, que le professeur pilote : les \u00e9l\u00e8ves argumentent, il note chacun avec un commentaire, la classe suit le tournoi.",
   "Pas pour la lecture \u00e0 voix haute : pour cela, c\u2019est L\u2019Applaudim\u00e8tre."),
 'evaluation-qcm':("Un questionnaire \u00e0 choix multiples chronom\u00e9tr\u00e9, dont chaque question porte son niveau de difficult\u00e9.",
   "Pas pour \u00e9valuer une r\u00e9daction ou un raisonnement long : il v\u00e9rifie des connaissances pr\u00e9cises."),
 'analyse_logique':("L\u2019\u00e9l\u00e8ve analyse une phrase \u00e0 l\u2019\u00e9cran : il pose des crochets autour des propositions, les \u00e9tiquette et relie chaque subordonnant \u00e0 son ant\u00e9c\u00e9dent.",
   "Pas pour l\u2019orthographe ni le lexique : c\u2019est la grammaire de phrase."),
 'applause_meter':("Les \u00e9l\u00e8ves \u00e9coutent un camarade lire \u00e0 voix haute et votent sur des crit\u00e8res que le professeur a d\u00e9finis \u00e0 l\u2019avance ; la classe voit le r\u00e9sultat.",
   "Pas pour \u00e9valuer une production \u00e9crite ni un oral argument\u00e9 : pour le d\u00e9bat, c\u2019est Pilotage d\u00e9bat."),
}
def poserUsage(s,app):
    """usage/quandPas DANS MJPC_APP (là où vit déjà le nom), pas dans une structure parallèle."""
    u,q=USAGES[app]
    m=None
    for mm in re.finditer(r'MJPC_APP\s*=\s*\{',s):
        deb=s.rfind('\n',0,mm.start())+1
        if s[deb:s.find('\n',mm.start())].strip().startswith('//'):continue   # gabarit commenté écarté
        m=mm;break
    assert m, 'MJPC_APP actif introuvable : '+app
    j=s.index('{',m.start());p=0;k=j
    while k<len(s):
        c=s[k]
        if c=='{':p+=1
        elif c=='}':
            p-=1
            if p==0:break
        k+=1
    bloc=s[j:k+1]
    assert 'usage' not in bloc, 'usage déjà présent : '+app
    # ⚠ le DERNIER champ porte souvent un commentaire de fin de ligne : y ajouter
    # une virgule la mettrait DANS le commentaire. On insère donc juste après la
    # ligne `id:` (premier champ), dont la forme est stable.
    m2=re.search(r'(\n\s*id:\s*"[^"]*",)',bloc)
    assert m2, 'ligne id: introuvable dans MJPC_APP : '+app
    ajout=('\n  usage: "'+u+'",   // M-PROMPT-4 : ce que l\'app fait POUR UN ÉLÈVE (mesuré dans ses écrans)'
           '\n  quandPas: "'+q+'",')
    neuf=bloc[:m2.end()]+ajout+bloc[m2.end():]
    return s[:j]+neuf+s[k+1:]

def remonter(s,app):
    """publierManifeste emporte usage/quandPas : le site LIT ce que les apps déclarent."""
    a='app:{id:MJPC_APP.id,nom:MJPC_APP.nom,contenant:MJPC_APP.contenant}'
    b='app:{id:MJPC_APP.id,nom:MJPC_APP.nom,contenant:MJPC_APP.contenant,usage:MJPC_APP.usage||"",quandPas:MJPC_APP.quandPas||""}'
    if s.count(a)==1:return s.replace(a,b)
    # forme alternative : app: MJPC_APP (l'objet entier remonte déjà)
    m=re.search(r'app\s*:\s*MJPC_APP\b',s)
    assert m, 'point de remontée introuvable : '+app
    return s   # l'objet entier remonte : usage/quandPas suivent sans retouche

OUT={}
# ═══ index.html : les trois prompts reçoivent le TRONC COMPLET ═══
s=charge('index');s=socle12(s)
s=sub(s,"""  if(t.indexOf('@@BLOCS@@')>=0)t=t.replace('@@BLOCS@@',diapoVocabulaireBlocs());
  return t;""",
"""  if(t.indexOf('@@BLOCS@@')>=0)t=t.replace('@@BLOCS@@',diapoVocabulaireBlocs());
  /* M-PROMPT-4 : la présentation de MJPC en tête — pièce ASSEMBLÉE, jamais fondue
     dans le texte persisté (un prompt édité par Paul reste intact en base). */
  return mjpcPromptAvecPresentation(t,{});""")
# le site charge la liste des outils au démarrage (source : ce que les apps déclarent)
s=sub(s,"""function atIAChargerPrompt(suite){""",
"""/* M-PROMPT-4 : la liste des outils vient du hub, où les apps l'ont publiée. */
function atChargerOutils(){ mjpcChargerOutils(FIREBASE_BASE,function(){}); }
try{atChargerOutils();}catch(e){}
function atIAChargerPrompt(suite){""")
s=sub(s,'var APP_VERSION="8.13.0"','var APP_VERSION="8.14.0"')
OUT['index']=s

# ═══ les sept apps : FORME BRÈVE + usage déclaré + remontée ═══
BRANCHE={
 'correction_dictee':("function assemblePrompt(directives, format){",
   "function assemblePrompt(directives, format){\n  /* M-PROMPT-4 : présentation brève en tête (pièce assemblée, texte persisté intact) */\n  return mjpcPromptAvecPresentation(_assemblePromptBrut(directives,format),{breve:true});\n}\nfunction _assemblePromptBrut(directives, format){"),
 'worktrack':("  promptView(){ const tpl=this.tpl;",
   "  promptView(){ const tpl=mjpcPromptAvecPresentation(this.tpl,{breve:true});   /* M-PROMPT-4 */"),
 'dictee_universelle':("function generateAnalysePrompt(){",
   "function generateAnalysePrompt(){\n  /* M-PROMPT-4 */ return mjpcPromptAvecPresentation(_generateAnalysePromptBrut(),{breve:true});\n}\nfunction _generateAnalysePromptBrut(){"),
 'evaluation-qcm':("      navigator.clipboard.writeText(prompt);",
   "      navigator.clipboard.writeText(mjpcPromptAvecPresentation(prompt,{breve:true}));   /* M-PROMPT-4 */"),
 'analyse_logique':("function promptCorrige(texte, ref){",
   "function promptCorrige(texte, ref){\n  /* M-PROMPT-4 */ return mjpcPromptAvecPresentation(_promptCorrigeBrut(texte,ref),{breve:true});\n}\nfunction _promptCorrigeBrut(texte, ref){"),
 'applause_meter':("function genererPromptIA(theme, nbCriteres){",
   "function genererPromptIA(theme, nbCriteres){\n  /* M-PROMPT-4 */ return mjpcPromptAvecPresentation(_genererPromptIABrut(theme,nbCriteres),{breve:true});\n}\nfunction _genererPromptIABrut(theme, nbCriteres){"),
}
PAST={'correction_dictee':('var APP_VERSION="6.3.0";','var APP_VERSION="6.4.0";'),
      'worktrack':('<meta name="app-version" content="2026-08-01a">','<meta name="app-version" content="2026-08-01b">'),
      'dictee_universelle':('var APP_VERSION="2.3.0";','var APP_VERSION="2.4.0";'),
      'pilotage_debat_s3':('const APP_VERSION = "2026-08-01-1";','const APP_VERSION = "2026-08-01-2";'),
      'evaluation-qcm':('var APP_VERSION="7.3.0";','var APP_VERSION="7.4.0";'),
      'analyse_logique':('var APP_VERSION = "2.4.0";','var APP_VERSION = "2.5.0";'),
      'applause_meter':('var APP_VERSION = "2.3.0";','var APP_VERSION = "2.4.0";')}
for app in ['correction_dictee','worktrack','dictee_universelle','pilotage_debat_s3','evaluation-qcm','analyse_logique','applause_meter']:
    s=charge(app);s=socle12(s)
    s=poserUsage(s,app)
    s=remonter(s,app)
    if app in BRANCHE:
        a,b=BRANCHE[app];s=sub(s,a,b)
    else:
        # pilotage : le prompt des documents est copié dans copierPromptDocs
        s=sub(s,'  var texte=Lp.join("\\n");',
              '  var texte=mjpcPromptAvecPresentation(Lp.join("\\n"),{breve:true});   /* M-PROMPT-4 */')
    a,b=PAST[app];s=sub(s,a,b)
    OUT[app]=s

for n,s in OUT.items():
    ecrit(n,s);print(f"{n}: {len(s)} car.")
print("ASSEMBLAGE ×8 TERMINÉ")
