# -*- coding: utf-8 -*-
"""M-MANIFESTE — la publication ne s'exécute que s'il y a un écart."""
import re,json,hashlib
APPS=['correction_dictee','worktrack','dictee_universelle','pilotage_debat_s3',
      'evaluation-qcm','analyse_logique','applause_meter','reecriture','reecriture_bb4e']
ANCIEN = '''function publierManifeste(db){
  try{
    db.ref("manifestes/"+MJPC_APP.id).set({
      version: MJPC_CORE_VERSION,
      app: MJPC_APP,
      manifeste: MJPC_MANIFESTE||{},
      purge: MJPC_PURGE||{preserver:[],purger:[]},
      publie_le: Date.now()
    });
  }catch(e){ /* le manifeste ne doit jamais casser l'app */ }
}'''
NOUVEAU = '''function publierManifeste(db){
  /* ═══ M-MANIFESTE (02/08) — LA PUBLICATION NE S'EXÉCUTE QUE S'IL Y A UN ÉCART.
     Constat qui l'exige : le hub portait des manifestes vieux de deux semaines et
     de quatre versions de socle (evaluation-qcm : 19/07 ; pilotage : 17/07), sans
     que rien le signale. La cause n'était pas le code — `app: MJPC_APP` remonte
     déjà l'objet entier — mais le fait qu'il n'avait pas tourné.
     ⚠ Et cette version ÉCRIT MOINS que la précédente : avant, chaque ouverture
     réécrivait le manifeste même identique ; désormais on ne réécrit qu'en cas
     d'écart, soit une fois par promotion. Le geste de Paul reste inutile. ═══ */
  try{
    var _payload=function(){ return {
      version: MJPC_CORE_VERSION,
      app: MJPC_APP,
      manifeste: MJPC_MANIFESTE||{},
      purge: MJPC_PURGE||{preserver:[],purger:[]},
      publie_le: Date.now()
    }; };
    var ref=db.ref("manifestes/"+MJPC_APP.id);
    var ecrire=function(){ try{ ref.set(_payload()); }catch(e){} };
    var lu=ref.once("value");
    if(lu&&typeof lu.then==="function"){
      lu.then(function(snap){
        var publie=snap&&snap.val?snap.val():null;
        if(mjpcManifesteAJour(publie,MJPC_CORE_VERSION,MJPC_APP,MJPC_MANIFESTE))return;  /* rien à republier */
        ecrire();
      },ecrire);
    }else ecrire();                                  /* pas de promesse : on publie comme avant */
  }catch(e){ /* le manifeste ne doit jamais casser l'app */ }
}'''
# ── la fonction de comparaison, posée au canon (§8) et embarquée ──
CANON_AJOUT = '''
/* ── M-MANIFESTE : le manifeste publié est-il celui du code qui tourne ? ──
   Compare la version du socle, la déclaration de l'app (nom, usage, quandPas,
   contenant) et les nœuds déclarés. Toute divergence => republication.
   Motif : rien ne garantissait qu'un manifeste au hub corresponde au code promu ;
   l'aval (le prompt maître) raisonnait alors sur du périmé sans le savoir. */
function mjpcManifesteAJour(publie,versionSocle,app,manifeste){
  if(!publie||typeof publie!=='object')return false;
  if(String(publie.version||'')!==String(versionSocle||''))return false;
  var a=publie.app||{};
  var champs=['id','nom','contenant','usage','quandPas'];
  for(var i=0;i<champs.length;i++){
    if(String(a[champs[i]]||'')!==String((app||{})[champs[i]]||''))return false;
  }
  try{
    if(JSON.stringify(publie.manifeste||{})!==JSON.stringify(manifeste||{}))return false;
  }catch(e){return false;}
  return true;
}
'''
# ═══ le canon 1.5.0 → 1.6.0 ═══
c=open('canon.js',encoding='utf-8').read()
assert c.count('var MJPC_CORE_VERSION="1.5.0";')==1
c=c.replace('var MJPC_CORE_VERSION="1.5.0";',CANON_AJOUT+'\nvar MJPC_CORE_VERSION="1.6.0";')
c=c.replace('// v1.5.0 : + §12 présentation de MJPC','// v1.6.0 : + §8 manifeste à jour (publication seulement en cas d\'écart) —\n// v1.5.0 : + §12 présentation de MJPC')
c=c.replace("// MJPC-CORE v1.5.0 (2026-08-01) — socle commun de l'écosystème MJPC",
            "// MJPC-CORE v1.6.0 (2026-08-02) — socle commun de l'écosystème MJPC")
open('mjpc-core.staging.js','w',encoding='utf-8').write(c)
I=c.index("/* ── M-MANIFESTE : le manifeste publié")
F=c.index('var MJPC_CORE_VERSION="1.6.0";')
BLOC=c[I:F]
print(f"canon 1.6.0 : {len(c)} c.")

def majSocle(s,nom):
    """ajoute la fonction au socle embarqué. ⚠ La version embarquée est MESURÉE :
       reecriture/bb4e sont hors canon et portent un socle antérieur — on y ajoute
       la fonction SANS toucher à leur version, qui n'est pas la nôtre à changer."""
    m=re.search(r'var MJPC_CORE_VERSION="([^"]+)";',s)
    assert m, 'pas de socle : '+nom
    v=m.group(1)
    if v=='1.5.0':
        return s.replace('var MJPC_CORE_VERSION="1.5.0";',BLOC+'var MJPC_CORE_VERSION="1.6.0";'),v,'1.6.0'
    return s.replace(m.group(0),BLOC+m.group(0)),v,v

for n in APPS:
    s=open(n+'.html',encoding='utf-8').read()
    assert s.count(ANCIEN)==1, n
    s=s.replace(ANCIEN,NOUVEAU)
    s,vAv,vAp=majSocle(s,n)
    if vAv!=vAp:pass
    else:print(f'  {n:22s} ⚠ socle {vAv} conservé (hors canon)')
    # pastille
    # ⚠ PIÈGE DE L'EXEMPLE COMMENTÉ, 3e occurrence du chantier : reecriture et
    # reecriture_bb4e portent AUSSI le gabarit `var APP_VERSION = "…"` — ACTIF, et
    # il écrase la vraie pastille (2.2.0). On prend la dernière déclaration qui
    # porte une vraie valeur, jamais le gabarit. Signalé, non réparé.
    cands=[mm for mm in re.finditer(r'(?:var|const)\s+APP_VERSION\s*=\s*"([^"]+)"',s) if mm.group(1)!='\u2026']
    m=cands[-1] if cands else None
    if m:
        v=m.group(1)
        def inc(v):
            p=v.split('.')
            if len(p)==3 and all(x.isdigit() for x in p):return f"{p[0]}.{int(p[1])+1}.0"
            import re as _r
            mm=_r.match(r'^(\d{4}-\d{2}-\d{2})-(\d+)$',v)
            if mm:return mm.group(1)+'-'+str(int(mm.group(2))+1)
            return v+'-2'
        s=s[:m.start(1)]+inc(v)+s[m.end(1):]
        print(f"  {n:22s} pastille {v} → {inc(v)}")
    else:
        mm=re.search(r'<meta name="app-version" content="([^"]+)">',s)
        if mm:
            v=mm.group(1);nv=v[:-1]+chr(ord(v[-1])+1) if v[-1].isalpha() else v+'b'
            s=s[:mm.start(1)]+nv+s[mm.end(1):]
            print(f"  {n:22s} meta {v} → {nv}")
    open(n+'.staging.html','w',encoding='utf-8').write(s)
print("neuf apps assemblées")
