# -*- coding: utf-8 -*-
import re
s=open('index.staging.html',encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a); assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    s=s.replace(a,n)

# ── ③ le bouton QUITTE l'atelier ──
sub("""    +'<button class="at-btn" onclick="ecartOuvrir()">\\ud83d\\udce1 Fiches des applications\\u2026</button>'\n""","")

# ── la section ──
# le marqueur existe DEUX fois (CSS @94884 et JS @544866) : ancre par contexte JS
ANCRE="""  });
}
/* ═══ fin § MANIFESTES : L'ÉCART ═══ */"""
assert s.count(ANCRE)==1, s.count(ANCRE)
SEC = r'''
/* ═══════════════════════════════════════════════════════════════════════════
   § FICHES DES APPLICATIONS — MISE À JOUR SANS GESTE CACHÉ (M-MANIFESTE-2)
   Mesuré : `publierManifeste` vit dans un useEffect d'un composant qui ne se
   monte qu'APRÈS le portail prof. Ouvrir une app ne publie donc rien — il faut y
   ENTRER. Les fiches du hub dataient du 17/07 au 31/07 pour un socle en 1.6.0.
   Paul : « il faut un mécanisme qui fasse que je n'aie pas besoin d'aller ouvrir
   les apps, ni un élève. »
   ⚠ LE SITE NE PORTE AUCUNE COPIE DES DÉCLARATIONS. Il TÉLÉCHARGE les neuf
   fichiers à la même origine et en EXTRAIT MJPC_APP et MJPC_MANIFESTE à chaque
   clic : rien ne peut diverger (M-PROMPT-4 avait refusé la copie pour cette
   raison). 6 Mo, sur la connexion de Paul, quelques secondes — d'où le bouton,
   et non un automatisme : c'est une question de MOMENT, pas de dose.
   ⚠ RIEN N'EST EXÉCUTÉ : l'extraction est textuelle.
   ═══════════════════════════════════════════════════════════════════════════ */
var FICHES_APPS=['correction_dictee','worktrack','dictee_universelle','pilotage_debat_s3',
                 'evaluation-qcm','analyse_logique','applause_meter','reecriture','reecriture_bb4e'];
/* Extraction TEXTUELLE d'un objet littéral déclaré `var NOM = { … }`.
   ⚠ On écarte d'abord les lignes commentées : la première occurrence est souvent
   le gabarit commenté du canon (piège payé trois fois sur ce chantier).
   Ce que la méthode NE COUVRE PAS : une déclaration construite dynamiquement,
   une valeur calculée, ou un objet écrit sur une seule ligne avec des accolades
   dans une chaîne — dans ces cas l'extraction rend null et l'app est signalée. */
function fichesExtraireObjet(src,nom){
  var re=new RegExp('(?:^|\\n)\\s*(?:var|const|let)\\s+'+nom+'\\s*=\\s*\\{','g');
  var m,deb=-1;
  while((m=re.exec(src))){
    var ligne=src.slice(src.lastIndexOf('\n',m.index)+1,src.indexOf('\n',m.index+1));
    if(/^\s*(\/\/|\*)/.test(ligne))continue;          /* gabarit commenté : écarté */
    deb=src.indexOf('{',m.index);break;
  }
  if(deb<0)return null;
  var p=0,i=deb,q=null,prev='';
  for(;i<src.length;i++){
    var c=src[i];
    if(q){ if(c==='\\'){i++;continue;} if(c===q)q=null; continue; }
    if(c==='"'||c==="'"||c==='`'){q=c;continue;}
    if(c==='/'&&src[i+1]==='/'){i=src.indexOf('\n',i);continue;}
    if(c==='/'&&src[i+1]==='*'){i=src.indexOf('*/',i)+1;continue;}
    if(c==='{')p++;
    else if(c==='}'){p--;if(p===0)break;}
  }
  var txt=src.slice(deb,i+1);
  try{ return JSON.parse(txt.replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g,'$1"$2":').replace(/'/g,'"').replace(/,(\s*[}\]])/g,'$1')); }
  catch(e){
    /* repli : les champs simples, un par un — suffit pour id/nom/contenant/usage/quandPas */
    var o={},f=['id','nom','contenant','usage','quandPas'];
    f.forEach(function(k){
      var mm=new RegExp(k+'\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"').exec(txt)||new RegExp(k+"\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'").exec(txt);
      if(mm)o[k]=mm[1].replace(/\\u([0-9a-fA-F]{4})/g,function(_,h){return String.fromCharCode(parseInt(h,16));});
    });
    return Object.keys(o).length?o:null;
  }
}
function fichesMajUne(id,socle,cb){
  fetch(id+'.html',{cache:'no-store'}).then(function(r){
    if(!r.ok)throw new Error('HTTP '+r.status);
    return r.text();
  }).then(function(src){
    var app=fichesExtraireObjet(src,'MJPC_APP');
    var man=fichesExtraireObjet(src,'MJPC_MANIFESTE')||{};
    if(!app||!app.id)throw new Error('d\u00e9claration illisible');
    var payload={version:socle,app:app,manifeste:man,
                 purge:fichesExtraireObjet(src,'MJPC_PURGE')||{preserver:[],purger:[]},
                 publie_le:Date.now()};
    return secuLire('/manifestes/'+id).then(function(publie){
      if(mjpcManifesteAJour(publie,socle,app,man)){cb({id:id,etat:'deja',nom:app.nom});return;}
      return secuEcrire('/manifestes/'+id,payload).then(function(r2){
        cb(r2.ok?{id:id,etat:'publiee',nom:app.nom}:{id:id,etat:'echec',nom:app.nom,pourquoi:'l\u2019\u00e9criture n\u2019a pas abouti'});
      });
    });
  }).catch(function(e){ cb({id:id,etat:'echec',nom:id,pourquoi:String(e&&e.message||e)}); });
}
/* Un échec sur une app n'arrête pas les autres : chacune est indépendante. */
function fichesMettreAJour(cb){
  var socle=(typeof MJPC_CORE_VERSION!=='undefined')?MJPC_CORE_VERSION:'?';
  var res=[],reste=FICHES_APPS.length;
  FICHES_APPS.forEach(function(id,i){
    fichesAvancement(i,FICHES_APPS.length,id);
    fichesMajUne(id,socle,function(r){
      res.push(r);fichesAvancement(res.length,FICHES_APPS.length,id);
      if(--reste===0)cb(res);
    });
  });
}
function fichesAvancement(n,total,id){
  var d=document.getElementById('fiches-avance');
  if(d)d.textContent='Lecture des fiches\u2026 '+n+' sur '+total+(id?(' \u2014 '+id):'');
}
/* ── ④ le calcul, corrigé : une fiche ABSENTE n'est jamais « à jour » ── */
function fichesEtat(entree,socle){
  if(!entree)return {aJour:false,libelle:'jamais publi\u00e9e',declare:'\u2014',date:'jamais'};
  var v=String(entree.version||'');
  var aJour=(v===String(socle));
  return {aJour:aJour,
    libelle:aJour?'conforme au socle en cours':'d\u00e9clare '+(v||'?')+', socle actuel '+socle,
    declare:v||'\u2014',date:entree.publie_le};
}
function fichesDateFr(ts){
  if(!ts)return 'jamais';
  var d=new Date(Number(ts));
  return isNaN(d.getTime())?'date illisible':('mise \u00e0 jour le '+d.toLocaleDateString('fr-FR'));
}
function fichesMomentFr(){
  var d=new Date();
  return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})
    +' \u00e0 '+d.getHours()+' h '+String(d.getMinutes()).padStart(2,'0');
}
function fichesLignes(entrees,socle){
  return FICHES_APPS.map(function(id){
    var e=entrees&&entrees[id];
    var st=fichesEtat(e,socle);
    return {id:id,nom:(e&&e.app&&e.app.nom)||id,quand:fichesDateFr(st.date),
            etat:st.libelle,aJour:st.aJour,usage:!!(e&&e.app&&e.app.usage)};
  });
}
/* ── l'écran, dans le TABLEAU DE BORD ── */
function _profSectionFiches(){
  return '<div id="fiches-zone"><p class="tprof-placeholder">Lecture des fiches\u2026</p></div>';
}
function fichesCharger(){
  var socle=(typeof MJPC_CORE_VERSION!=='undefined')?MJPC_CORE_VERSION:'?';
  secuLire('/manifestes').then(function(m){
    var z=document.getElementById('fiches-zone');if(!z)return;
    z.innerHTML=fichesRendre(fichesLignes(m||{},socle),socle);
  });
}
function fichesRendre(lignes,socle){
  var ko=lignes.filter(function(l){return !l.aJour;});
  var h='<div class="fi-sec"><h4>\ud83d\udce1 Fiches des applications</h4>';
  h+='<div class="fi-intro">Chaque application publie au hub une fiche qui dit ce qu\u2019elle fait et quand la proposer. '
    +'Le prompt de chapitre s\u2019en sert. <button class="at-i" onclick="fichesInfo()" aria-label="En savoir plus">\u24d8</button></div>';
  h+= ko.length
    ? '<div class="fi-bilan fi-ko"><b>'+ko.length+' fiche'+(ko.length>1?'s ne sont':' n\u2019est')+' pas \u00e0 jour.</b> Le bouton ci-dessous les republie toutes, sans que tu aies \u00e0 ouvrir les applications.</div>'
    : '<div class="fi-bilan fi-ok"><b>Toutes les fiches sont \u00e0 jour.</b></div>';
  h+='<div class="fi-actions"><button class="at-btn at-btn-prim" onclick="fichesCliqueMaj()">Mettre les fiches \u00e0 jour</button>'
    +'<span id="fiches-avance" class="fi-avance"></span></div>';
  h+='<div id="fiches-cr"></div>';
  h+='<div class="fi-socle">Socle en cours : <b>'+atEsc(socle)+'</b></div>';
  h+='<table class="fi-tab"><thead><tr><th>Application</th><th>Fiche \u00e9crite</th><th>Version d\u00e9clar\u00e9e</th></tr></thead><tbody>';
  lignes.forEach(function(l){
    h+='<tr class="'+(l.aJour?'fi-l-ok':'fi-l-ko')+'">'
      +'<td data-ent="Application">'+atEsc(l.nom)+'</td>'
      +'<td data-ent="Fiche \u00e9crite">'+atEsc(l.quand)+'</td>'
      +'<td data-ent="Version d\u00e9clar\u00e9e">'+atEsc(l.etat)+'</td></tr>';
  });
  h+='</tbody></table>';
  h+='<p class="fi-moment">'+(ko.length?'V\u00e9rifi\u00e9 le ':'Toujours \u00e0 jour au ')+fichesMomentFr()+'.</p>';
  return h+'</div>';
}
function fichesInfo(){
  atModaleChoix('Chaque application \u00e9crit au hub une fiche : son nom, ce qu\u2019elle fait pour un \u00e9l\u00e8ve, et quand la proposer. '
    +'C\u2019est cette fiche que l\u2019IA re\u00e7oit quand tu lui demandes de construire un chapitre.<br><br>'
    +'<b>Deux colonnes, deux choses diff\u00e9rentes.</b> \u00ab Fiche \u00e9crite \u00bb dit QUAND la fiche a \u00e9t\u00e9 \u00e9crite ; '
    +'\u00ab Version d\u00e9clar\u00e9e \u00bb dit QUELLE version du socle elle annonce. Une fiche ancienne peut \u00eatre conforme : '
    +'ce qui compte, c\u2019est la version.<br><br>'
    +'Le bouton lit les applications \u00e0 la source et republie ce qui a chang\u00e9. Tu n\u2019as pas \u00e0 les ouvrir.',
    [{lib:'Compris',prim:true,fn:function(){}}]);
}
function fichesCliqueMaj(){
  var d=document.getElementById('fiches-cr');if(d)d.innerHTML='';
  fichesAvancement(0,FICHES_APPS.length,'');
  fichesMettreAJour(function(res){
    fichesAvancement(FICHES_APPS.length,FICHES_APPS.length,'');
    var pub=res.filter(function(r){return r.etat==='publiee';});
    var dej=res.filter(function(r){return r.etat==='deja';});
    var ech=res.filter(function(r){return r.etat==='echec';});
    var h='<div class="fi-cr"><b>Compte rendu</b><ul>';
    res.forEach(function(r){
      var t=r.etat==='publiee'?'fiche republi\u00e9e':(r.etat==='deja'?'d\u00e9j\u00e0 \u00e0 jour':'\u00e9chec \u2014 '+(r.pourquoi||''));
      h+='<li class="fi-cr-'+r.etat+'">'+atEsc(r.nom)+' : '+atEsc(t)+'</li>';
    });
    h+='</ul><p>'+pub.length+' republi\u00e9e(s) \u00b7 '+dej.length+' d\u00e9j\u00e0 \u00e0 jour'
      +(ech.length?(' \u00b7 <b>'+ech.length+' en \u00e9chec</b> \u2014 les autres ont bien \u00e9t\u00e9 trait\u00e9es'):'')+'</p></div>';
    if(d)d.innerHTML=h;
    var ov=document.getElementById('fi-overlay');
    if(ov)ov.setAttribute('data-fait','1');
    fichesCharger();
  });
}
/* ── ② L'OVERLAY BLOQUANT, à l'ouverture du panneau prof ── */
function fichesVerifierAlerte(){
  var socle=(typeof MJPC_CORE_VERSION!=='undefined')?MJPC_CORE_VERSION:'?';
  secuLire('/manifestes').then(function(m){
    var lignes=fichesLignes(m||{},socle);
    var ko=lignes.filter(function(l){return !l.aJour;});
    if(!ko.length)return;                       /* aucun écart → AUCUN voile */
    if(document.getElementById('fi-overlay'))return;
    var d=document.createElement('div');
    d.id='fi-overlay';d.className='fi-overlay';
    var h='<div class="fi-ov-boite"><div class="fi-ov-titre">\u26a0\ufe0f '+ko.length+' fiche'+(ko.length>1?'s d\u2019applications ne sont':' d\u2019application n\u2019est')+' pas \u00e0 jour</div>';
    h+='<p class="fi-ov-sous">Voici exactement pourquoi chacune doit \u00eatre republi\u00e9e :</p><ul class="fi-ov-liste">';
    ko.forEach(function(l){
      h+='<li><b>'+atEsc(l.nom)+'</b> \u2014 '+atEsc(l.quand)+' \u00b7 '+atEsc(l.etat)+'.<br>'
        +'<span class="fi-ov-cons">'+(l.usage?'Sa description est peut-\u00eatre p\u00e9rim\u00e9e : ':'Le prompt de chapitre ne sait pas quand te proposer cet outil : ')
        +'l\u2019IA travaille avec une information ancienne sans que rien ne le montre.</span></li>';
    });
    h+='</ul><div class="fi-ov-actions">'
      +'<button class="at-btn at-btn-prim" onclick="fichesOverlayMaj()">Mettre les fiches \u00e0 jour</button>'
      +'<button class="at-btn" id="fi-ov-fermer" onclick="fichesOverlayFermer()" disabled>Fermer</button></div>'
      +'<div id="fiches-avance" class="fi-avance"></div><div id="fiches-cr"></div></div>';
    d.innerHTML=h;
    document.body.appendChild(d);
  });
}
function fichesOverlayMaj(){
  var b=document.getElementById('fi-ov-fermer');
  fichesCliqueMaj();
  if(b)b.disabled=false;                        /* fermable APRÈS le clic, même si une app échoue */
}
function fichesOverlayFermer(){
  var e=document.getElementById('fi-overlay');if(e)e.remove();
}
/* ═══ fin § FICHES DES APPLICATIONS ═══ */
'''
sub(ANCRE,ANCRE+SEC)

# ── ③ l'écran dans le TABLEAU DE BORD ──
sub("if(id==='dashboard')return _profSectionDashboard();",
    "if(id==='dashboard')return _profSectionDashboard()+_profSectionFiches();   /* M-MANIFESTE-2 */")
sub("""  var c=document.getElementById('tprof-content');
  c.innerHTML=_renderProfSection(id);""",
"""  var c=document.getElementById('tprof-content');
  c.innerHTML=_renderProfSection(id);
  if(id==='dashboard'){try{fichesCharger();}catch(e){}}   /* M-MANIFESTE-2 */""")
# ── l'overlay à l'ouverture du panneau prof ──
sub("""  document.getElementById('tprof-overlay').classList.add('visible');
  document.body.style.overflow='hidden';
  showProfSection('dashboard');""",
"""  document.getElementById('tprof-overlay').classList.add('visible');
  document.body.style.overflow='hidden';
  showProfSection('dashboard');
  try{fichesVerifierAlerte();}catch(e){}                  /* M-MANIFESTE-2 : l'alerte bloquante */""")

CSS = """<style>
/* ═══ § FICHES DES APPLICATIONS (M-MANIFESTE-2) ═══ */
.fi-sec{margin-top:22px;padding-top:14px;border-top:1px solid rgba(255,255,255,.15)}
.fi-sec h4{margin:0 0 6px 0;font-size:1.02rem}
.fi-intro{font-size:.88rem;opacity:.8;line-height:1.5;margin-bottom:10px}
.fi-bilan{padding:10px 12px;border-radius:10px;margin-bottom:10px;font-size:.92rem;line-height:1.5}
.fi-ok{background:rgba(46,125,79,.18);border:1px solid rgba(46,125,79,.5)}
.fi-ko{background:rgba(230,57,70,.16);border:1px solid rgba(230,57,70,.5)}
.fi-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
.fi-actions .at-btn{min-height:44px;min-width:44px}
.fi-avance{font-size:.85rem;opacity:.8}
.fi-socle{font-size:.84rem;opacity:.75;margin:8px 0}
.fi-tab{width:100%;border-collapse:collapse;font-size:.89rem}
.fi-tab th,.fi-tab td{border:1px solid rgba(255,255,255,.2);padding:.45rem .55rem;text-align:left}
.fi-tab th{background:rgba(255,255,255,.07)}
.fi-l-ko td{background:rgba(230,57,70,.10)}
.fi-moment{font-size:.85rem;opacity:.8;margin-top:10px}
.fi-cr{margin:10px 0;padding:10px 12px;border:1px solid rgba(255,255,255,.2);border-radius:10px;font-size:.9rem}
.fi-cr ul{margin:6px 0 6px 18px}
.fi-cr-echec{color:#ff9b9b}.fi-cr-publiee{color:#8ce7a8}
.fi-sec .at-i{min-width:44px;min-height:44px;color:inherit}
.fi-overlay{position:fixed;inset:0;z-index:10000;background:rgba(10,8,20,.86);display:flex;align-items:center;justify-content:center;padding:1rem;overflow:auto}
.fi-ov-boite{max-width:640px;width:100%;max-height:88vh;overflow:auto;background:#1c1830;color:#f2eefb;border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:18px}
.fi-ov-titre{font-size:1.1rem;font-weight:700;margin-bottom:8px}
.fi-ov-sous{font-size:.92rem;opacity:.85;margin:0 0 10px}
.fi-ov-liste{margin:0 0 12px 18px;font-size:.92rem;line-height:1.55}
.fi-ov-liste li{margin:8px 0}
.fi-ov-cons{opacity:.8;font-size:.86rem}
.fi-ov-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
.fi-ov-actions .at-btn{min-height:44px;min-width:44px}
.fi-ov-actions .at-btn[disabled]{opacity:.45;cursor:not-allowed}
@media (max-width:480px){
  .fi-tab,.fi-tab thead,.fi-tab tbody,.fi-tab tr,.fi-tab td{display:block;width:100%;box-sizing:border-box}
  .fi-tab thead{display:none}
  .fi-tab tr{border:1px solid rgba(255,255,255,.2);border-radius:8px;margin-bottom:.5rem}
  .fi-tab td{border:0;border-bottom:1px solid rgba(255,255,255,.1);padding:.4rem .55rem}
  .fi-tab td:last-child{border-bottom:0}
  .fi-tab td:before{content:attr(data-ent);display:block;font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;opacity:.65}
  .fi-ov-boite{padding:14px}
  .fi-ov-actions{flex-direction:column;align-items:stretch}
}
/* ═══ fin § FICHES DES APPLICATIONS ═══ */
</style>
"""
m=re.search(r'^<body[\s>]',s,re.M)
s=s[:m.start()]+CSS+s[m.start():]
sub('var APP_VERSION="8.19.0"','var APP_VERSION="8.20.0"')
open('index.staging.html','w',encoding='utf-8').write(s)
print("assemblé :",len(s),"c.")
