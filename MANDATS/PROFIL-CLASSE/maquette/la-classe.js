/* ═══ MAQUETTE « LA CLASSE » — le profil de classe (cadrage relu du 26/10, T1-T6). Conscience n°13, 26/10/2026.
   Ce bloc est AJOUTÉ à la fin du fichier de production 8.75.0-③ (rien du fichier n'est réécrit) et joué sur le faux hub.
   Trois fonctions de l'EDT sont recouvertes : `edtCarteClic` (la carte de classe ouvre la vue, T1), `edtPeindre` (le mode
   'classe' de l'écran de l'EDT), `edtLancer` en mode « Préparer » (la case à venir atterrit dans la vue, sur cette heure, T1).
   Tout le reste est lu tel quel : `edtProjeter` (le même calcul que l'EDT, T2), `edtFileDAttente`, `edtHeuresPour`, la copie
   de classe `deroule_joue/<classe>` (T3, T6), `dr_edtRelire` et la Relecture (T4), les traces des heures closes (T5).
   C'est la proposition à valider, pas le code promu : validée, elle devient le contrat §12.27. ═══ */
(function(){
var EDT_CL={classe:null, volet:'heures', cle:null, taxo:null, lignes:null};
window.EDT_CL=EDT_CL;
var edtPeindre0=window.edtPeindre, edtLancer0=window.edtLancer;

/* ── T1 · les trois entrées ─────────────────────────────────────────────── */
window.edtCarteClic=function(nom){ edtClOuvrir(nom,null); };
window.edtPeindre=function(){ if(EDT_VUE.mode==='classe')return edtClPeindre(); return edtPeindre0(); };
window.edtLancer=function(cle,preparer){
  if(preparer){ var c=edtCellule(cle); if(c&&c.classeMjpc){ edtClOuvrir(c.classeMjpc,cle); return; } }
  return edtLancer0(cle,preparer);
};
function edtClOuvrir(nom,cle){
  EDT_CL.classe=nom; EDT_CL.cle=cle||null; EDT_CL.volet='heures'; EDT_VUE.mode='classe';
  try{ edtModaleFermer(); }catch(e){}
  if(EDT_CL.taxo){ edtClPeindre(); return; }
  _siteGet('/taxonomie',function(v){ EDT_CL.taxo=v||{}; edtClPeindre(); });
}
window.edtClOuvrir=edtClOuvrir;
window.edtClVolet=function(v){ EDT_CL.volet=v; edtClPeindre(); };
window.edtClChoisir=function(cle){ EDT_CL.cle=cle; EDT_CL.volet='heures'; edtClPeindre(); };

/* ── T2 · l'emploi du temps de cette classe seule : le même calcul que l'EDT, sur l'année ── */
function edtClProjeter(nom){
  var deb=edtDebutAnnee(), fin=edtFinAnnee(), nb=0; while(nb<400&&edtPlusJour(deb,nb)<=fin)nb++;
  var cel=edtProjeter(deb,nb); EDT_VUE.cellules=cel;   /* la clé de case de l'EDT : « Relire », « Préparer », « Lancer » la lisent tels quels */
  var l=[]; Object.keys(cel).forEach(function(k){ var c=cel[k]; if(!c||c.classeMjpc!==nom)return;
    if(c.nature==='horsTemps'||c.nature==='horsAnnee'||c.nature==='horsMjpc'||c.nature==='nonImportee')return; c.__cle=k; l.push(c); });
  l.sort(function(a,b){ return (a.iso+'|'+a.creneau).localeCompare(b.iso+'|'+b.creneau); });
  /* la séance de chaque heure à venir : la même file que l'EDT, parcourue dans le même ordre (`edtProjeter` ne garde que le titre) */
  var files={};
  l.forEach(function(c){ if(c.nature!=='prevu')return; var fk=c.fil||''; if(files[fk]===undefined)files[fk]=edtFileDAttente(nom,c.fil||null);
    var f=files[fk]; if(!f||!f.seances.length)return; var s=f.seances[f.i]; if(!s)return;
    c.__seance=s; c.__chapitre=f.chapitre; var total=edtHeuresPour(s,c.creneau); f.faites++; if(f.faites>=total){ f.i++; f.faites=0; } });
  return l;
}
function edtClPeindre(){
  var e=document.getElementById('edt-ecran'); if(!e)return; var nom=EDT_CL.classe; if(!nom)return edtPeindre0();
  var l=edtClProjeter(nom); EDT_CL.lignes=l;
  if(!EDT_CL.cle||!l.some(function(c){return c.__cle===EDT_CL.cle;})){
    var prochain=null; for(var i=0;i<l.length&&!prochain;i++){ if(l[i].nature==='prevu')prochain=l[i]; }
    EDT_CL.cle=prochain?prochain.__cle:(l.length?l[l.length-1].__cle:null);
  }
  var h=edtClTeteHtml(nom);
  if(EDT_CL.volet==='stats')h+='<div class="edtcl-corps"><div class="edtcl-stats" id="edtcl-stats">'+edtClStatsHtml(nom,l)+'</div></div>';
  else h+='<div class="edtcl-corps"><div class="edtcl-heures">'+(l.length?l.map(edtClLigneHtml).join(''):'<span class="edt-mini-t">aucune heure de cette classe dans la grille</span>')+'</div>'
       +'<div class="edtcl-panneau">'+edtClPanneauHtml(nom,l)+'</div></div>';
  e.innerHTML=h;
  var sel=e.querySelector('.edtcl-h-sel'); if(sel&&sel.scrollIntoView)sel.scrollIntoView({block:'center'});
}
function edtClTeteHtml(nom){
  var f=edtFileDAttente(nom,null), dv=edtDivergence(nom);
  var total=f?edtListe(f.chapitre.seances).length:0, reste=f?f.seances.length:0;
  return '<div class="edt-tete">'
   +'<button class="edt-btn" onclick="edtVue(\'semaine\')">‹ Semaine</button>'
   +'<span class="edt-sep"></span><b>'+escapeHtml(nom)+' — la classe</b>'
   +(edtEstExperimentale(nom)?' <i class="edt-exp" title="'+EDT_MENTION_EXP+'">expérimentale</i>':'')
   +'<span class="edt-mini-t">'+(f?(escapeHtml(f.chapitre.title||'')+' · '+(total-reste)+'/'+total):'aucun chapitre publié')+'</span>'
   +(dv?'<em class="edt-pal edt-pal-'+dv.palier.split(' ')[0]+'">'+escapeHtml(dv.palier)+(dv.brut?(' · '+dv.brut+' h de retard'):'')+'</em>':'')
   +'<span class="edt-sep"></span>'
   +'<button class="edt-btn'+(EDT_CL.volet==='heures'?' edt-btn-actif':'')+'" onclick="edtClVolet(\'heures\')">Les heures</button>'
   +'<button class="edt-btn'+(EDT_CL.volet==='stats'?' edt-btn-actif':'')+'" onclick="edtClVolet(\'stats\')">Les stats</button>'
   +'<span class="edt-souple"></span>'
   +'<button class="edt-btn" onclick="edtFermer()">✕ Fermer l’emploi du temps</button></div>';
}
function edtClLigneHtml(c){
  var auj=edtAujourdhui();
  var cls='edtcl-h edtcl-h-'+c.nature+(c.__cle===EDT_CL.cle?' edtcl-h-sel':'')+(c.iso===auj?' edtcl-h-auj':'');
  var ks=JSON.stringify(c.__cle).replace(/"/g,'&quot;');
  var d='<span class="edtcl-d">'+escapeHtml(edtDateCourte(c.iso))+'<i>'+escapeHtml(String(c.creneau).split('-')[0])+'</i></span>';
  var corps='';
  if(c.nature==='jouee')corps='<u>'+escapeHtml(c.titre||'')+'</u><i>'+c.activites+' activité'+(c.activites>1?'s':'')+(c.reportees?(' · '+c.reportees+' reportée'+(c.reportees>1?'s':'')):'')+(c.clos?'':' · pas close')+'</i>';
  else if(c.nature==='passee')corps='<i>passée · pas jouée</i>';
  else if(c.nature==='sansSeance')corps='<i>'+escapeHtml('heure banalisée — '+(c.categorie||''))+(c.precision?(' — '+escapeHtml(c.precision)):'')+'</i>';
  else if(c.nature==='deplacee'){ var p=String(c.deplaceeVers||'').split('|'); corps='<i>heure déplacée vers le '+escapeHtml(edtJourEnClair(p[0]))+' '+escapeHtml(p[1]||'')+'</i>'; }
  else if(c.nature==='rienDePret')corps='<i>aucune séance prête'+(c.fil?' · fil « '+escapeHtml(c.fil)+' »':'')+'</i>';
  else corps=(c.epingle||c.ajoutee?'📌 ':'')+'<u>'+escapeHtml(c.titre||'')+'</u><i>'+(c.ajoutee?'heure ajoutée · ':'')+(c.fil?('fil '+escapeHtml(c.fil)+' · '):'')+'heure '+c.heure+'/'+c.sur+(c.chapitre?' · '+escapeHtml(c.chapitre):'')+'</i>';
  return '<div class="'+cls+'" onclick="edtClChoisir('+ks+')">'+d+'<span class="edtcl-c">'+corps+'</span></div>';
}

/* ── la copie de classe d'une séance (deroule_joue/<classe>) ───────────────── */
function edtClSlugDe(nom){ return String(nom||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,''); }
function edtClCopie(s,nom){
  var d=(s&&s.deroule_joue)||{}, slug=null, sl0=null; try{ sl0=dr_slugDe(nom); }catch(e){}
  Object.keys(d).forEach(function(sl){ var b=d[sl]; if(!b||slug)return; if((b.classe&&b.classe===nom)||sl===sl0||sl===edtClSlugDe(nom))slug=sl; });
  return slug?{slug:slug,b:d[slug]}:null;
}
/* la trace de l'heure h de cette séance pour cette classe (une heure close ou en cours) */
function edtClTraceHeure(s,nom,h){ var cp=edtClCopie(s,nom); if(!cp)return null; var hs=cp.b.heures||{}, res=null; Object.keys(hs).forEach(function(k){ var t=hs[k]; if(t&&+t.heure===+h)res=t; }); return res; }

/* ── T3 · le déroulé par classe d'une heure à venir ─────────────────────── */
/* les diapos de l'heure h, dans l'ordre de l'écran d'ouverture (`ordreHeureCalc0` du pilote, à l'identique) : la réactivation construite,
   puis ce qui glisse des heures d'avant (une décision « suivante / terminer / preparer » posée pendant l'heure, lue dans sa trace :
   `decisionsParEcran`), puis les diapos propres à l'heure, le bilan en dernier. L'heure d'une diapo : la frontière `heure` posée dans
   la copie ou la trame quand elle existe (plus d'une heure distincte hors fin), sinon les durées cumulées sur le temps utile du
   créneau — le partage de `dr_partagerHeures` / `edtHeuresPour`, à l'identique. */
function edtClEcransHeure(E,h,creneau,glissees){
  var fr={}; E.forEach(function(e){ if(!e||e.role==='fin')return; var x=+e.heure; if(x>0&&x===Math.floor(x))fr[x]=1; });
  var hs=[]; if(Object.keys(fr).length>1){ E.forEach(function(e,i){ hs[i]=e?(+e.heure||1):0; }); }
  else { var utile=edtTempsUtile(creneau)||50, cum=0; E.forEach(function(e,i){ if(!e||e.role==='fin'){ hs[i]=0; return; } hs[i]=1+Math.floor(cum/utile); cum+=(+e.dur||0); }); }
  var rit=function(e){ return e.role==='reactivation'; }, bil=function(e){ return e.role==='bilan'||(!e.role&&/bilan/i.test(String(e.act||''))); };
  var react=[], gl=[], propres=[], bilan=[];
  E.forEach(function(e,i){ if(!e||e.role==='fin')return; var x={e:e,i:i,h:hs[i]};
    if(hs[i]===h&&rit(e))react.push(x); else if(hs[i]<h&&glissees[e.eid]){ x.glisse=glissees[e.eid]; gl.push(x); } else if(hs[i]===h&&!rit(e)&&!bil(e))propres.push(x); else if(hs[i]===h&&bil(e))bilan.push(x); });
  return react.concat(gl,propres,bilan);
}
/* ce qui glisse vers l'heure h : les décisions posées pendant les heures d'avant de cette séance, pour cette classe (leurs traces) */
function edtClGlissees(s,nom,h){
  var cp=edtClCopie(s,nom), out={}; if(!cp)return out; var hs=cp.b.heures||{};
  Object.keys(hs).forEach(function(k){ var t=hs[k]; if(!t||!(+t.heure<h))return; var d=t.decisionsParEcran||{};
    Object.keys(d).forEach(function(eid){ var x=d[eid]; if(x&&['suivante','terminer','preparer'].indexOf(x.choix)>=0)out[eid]={choix:x.choix,heure:+t.heure}; }); });
  return out;
}
function edtClNotion(code){
  var t=EDT_CL.taxo, res=null;
  (function marcher(n,prof){ if(res||!n||prof>7)return; if(Array.isArray(n)){ n.forEach(function(x){marcher(x,prof+1);}); return; }
    if(typeof n!=='object')return; if(n.id===code){ res=n.libelleProf||n.libelle||n.libelleEleve||code; return; }
    Object.keys(n).forEach(function(k){ marcher(n[k],prof+1); }); })(t,0);
  return res||code;
}
function edtClPanneauHtml(nom,l){
  var c=null; l.forEach(function(x){ if(x.__cle===EDT_CL.cle)c=x; }); if(!c)return '';
  var ks=JSON.stringify(c.__cle).replace(/"/g,'&quot;');
  var h='<div class="edtcl-ptete"><b>'+escapeHtml(edtDateLisible(c.iso))+' · '+escapeHtml(c.creneau)+'</b>';
  if(c.nature==='jouee'){
    var t=edtCheminTrace(nom,c.iso,c.creneau), tr=t&&t.trace;
    h+='<span>'+escapeHtml(c.titre||'')+(tr&&tr.heure?(' · heure '+tr.heure+'/'+(tr.sur||'?')):'')+'</span>'
      +'<span class="edt-souple"></span><button class="edt-btn" onclick="dr_edtRelire('+ks+')">Relire cette heure</button>'
      +'<button class="edt-btn" onclick="edtClChapitre('+ks+')">Le chapitre</button></div>';
    return h+edtClTraceHtml(tr);
  }
  if(c.nature!=='prevu'||!c.__seance)return h+'</div>';
  var s=c.__seance, ch=c.__chapitre, cp=edtClCopie(s,nom);
  h+='<span>'+escapeHtml(c.titre||'')+' · heure '+c.heure+'/'+c.sur+' · '+escapeHtml((ch&&ch.title)||'')+(cp&&cp.b&&cp.b.ecrans?' · la copie de la classe':' · la trame')+'</span>'
    +'<span class="edt-souple"></span>'
    +'<button class="edt-btn edt-btn-prim" onclick="edtClLancer('+ks+')">▶ Ouvrir le pilotage et lancer</button>'
    +'<button class="edt-btn" onclick="edtClAtelier('+ks+')">✎ Éditer dans l’atelier</button></div>';
  var E=edtListe((cp&&cp.b&&cp.b.ecrans)||((s.deroule||{}).ecrans)||[]);
  var dec=(cp&&cp.b&&cp.b.decisions)||{};
  var gl=c.heure>1?edtClGlissees(s,nom,c.heure):{};
  if(c.heure>1&&!edtClTraceHeure(s,nom,c.heure-1))h+='<div class="edtcl-glisse edt-mini-t">l\u2019heure '+(c.heure-1)+' n\u2019est pas encore jouée : ce qui glisse et la réactivation construite se sauront à sa clôture</div>';
  var diapos=edtClEcransHeure(E,c.heure,c.creneau,gl);
  if(!diapos.length)return h+'<p class="edt-mini-t">aucune diapo pour cette heure dans la trame</p>';
  return h+diapos.map(function(x,r){ return edtClDiapoHtml(x,c,dec,ks,r+1); }).join('');
}
function edtClDiapoHtml(x,c,dec,ks,rang){
  var e=x.e, eid=e.eid||('i'+x.i), d=dec[eid]||{}, pour=d.pour||'';
  var lignes=[]; (e.blocs||[]).forEach(function(b){ if(!b)return; var t=b.txt||b.q||b.titre||''; if(t)lignes.push(t); (b.etapes||b.el||[]).forEach(function(z){ if(typeof z==='string')lignes.push(z); else if(z&&z.txt)lignes.push(z.txt); }); });
  var plus=lignes.length>4?lignes.length-4:0; lignes=lignes.slice(0,4);
  var comp=(e.comp||[]).map(edtClNotion).filter(Boolean);
  var react=e.role==='reactivation', mod=false; if(react){ try{ mod=!!dr_reactEstModifiee(e); }catch(z){} }
  var es=JSON.stringify(eid).replace(/"/g,'&quot;');
  return '<div class="edtcl-diapo'+(pour==='non'?' edtcl-diapo-non':'')+(pour==='seule'?' edtcl-diapo-seule':'')+(react?' edtcl-diapo-react':'')+'">'
    +'<div class="edtcl-dtete"><b>'+rang+'. '+escapeHtml(e.act||'')+'</b><i>'+(+e.dur||0)+' min'
    +(react?(' · construite à la clôture de l’heure '+(c.heure-1)+(mod?' · ta version':'')):'')
    +(x.glisse?(' · ↩ glissée de l’heure '+x.glisse.heure):'')+'</i>'
    +'<span class="edtcl-badges">'
    +'<button class="edtcl-badge'+(pour==='non'?' on':'')+'" onclick="edtClBadge('+ks+','+es+',\'non\')">pas pour cette classe</button>'
    +'<button class="edtcl-badge'+(pour==='seule'?' on':'')+'" onclick="edtClBadge('+ks+','+es+',\'seule\')">pour cette classe seulement</button></span></div>'
    +'<div class="edtcl-dlignes">'+lignes.map(function(t){return '<p>'+escapeHtml(t)+'</p>';}).join('')+(plus?'<p class="edt-mini-t">+ '+plus+' ligne'+(plus>1?'s':'')+'</p>':'')+'</div>'
    +(comp.length?'<div class="edtcl-dcomp">'+comp.map(escapeHtml).join(' · ')+'</div>':'')+'</div>';
}
/* ── T6 · le badge : une décision de la copie de la classe, par identité de diapo — la trame ne change pas ── */
window.edtClBadge=function(cle,eid,valeur){
  var c=edtCellule(cle); if(!c||!c.__seance||!c.__chapitre)return;
  var s=c.__seance, ch=c.__chapitre, nom=c.classeMjpc, cp=edtClCopie(s,nom), slug=cp?cp.slug:null;
  if(!slug){ try{ slug=dr_slugDe(nom); }catch(e){ slug=nom; } }
  var niv=edtNiveauDe(nom), chemin='/site/'+niv+'/chapitres/'+ch.__cle+'/seances/'+s.__i+'/deroule_joue/'+slug+'/decisions/'+eid;
  var b=(s.deroule_joue=s.deroule_joue||{})[slug]; if(!b)b=s.deroule_joue[slug]={classe:nom}; if(!b.decisions)b.decisions={};
  var nv=((b.decisions[eid]||{}).pour===valeur)?null:{pour:valeur,posee:Date.now(),depuis:'la classe'};   /* le même badge une seconde fois : on le retire */
  if(nv)b.decisions[eid]=nv; else delete b.decisions[eid];
  if(nv)mjpcPutJson(FIREBASE_BASE+chemin+'.json',nv,'le badge de la classe',null); else mjpcDeleteJson(FIREBASE_BASE+chemin+'.json','le badge de la classe',null);
  edtClPeindre();
};
window.edtClLancer=function(cle){ edtLancer0(cle,false); };
window.edtClAtelier=function(cle){ edtLancer0(cle,true); };

/* ── T4 · une heure passée : la trace, « Relire cette heure » (existe), « Le chapitre » = la face de la Relecture ── */
function edtClTraceHtml(tr){
  if(!tr)return '<p class="edt-mini-t">la trace de cette heure est introuvable</p>';
  var h='<p class="edtcl-p">'+(+tr.minutesJouees||0)+' min jouées sur '+(+tr.tempsUtilePrevu||0)+' prévues'+(tr.clos?' · close':' · pas close')
    +' · '+((tr.parts||[]).length)+' parole'+((tr.parts||[]).length>1?'s':'')+'</p>';
  h+='<table class="edtcl-tab"><tr><th>activité</th><th>prévu</th><th>réel</th></tr>'
    +(tr.activites||[]).map(function(a){ return '<tr'+(a.reel===0?' class="edtcl-rep"':'')+'><td>'+escapeHtml(a.act||'')+'</td><td>'+(+a.prevu||0)+' min</td><td>'+(a.reel===0?'reportée':((+a.reel||0)+' min'))+'</td></tr>'; }).join('')+'</table>';
  if(tr.travailTexte)h+='<p class="edtcl-p">'+escapeHtml(tr.travailTexte)+'</p>';
  return h;
}
window.edtClChapitre=function(cle){
  var cel=edtCellule(cle); if(!cel)return; var t=edtCheminTrace(cel.classeMjpc,cel.iso,cel.creneau);
  if(!t||!t.trace){ atInfo('La trace de cette heure est introuvable.'); return; }
  var m=/^\/site\/([^/]+)\/chapitres\/([^/]+)\/seances\/([^/]+)\/deroule_joue\/([^/]+)\//.exec(t.chemin); if(!m)return;
  if(typeof S==='object'&&S&&S.lancee&&!S.close){ atInfo('Une heure est en cours : relis celle-ci une fois l’heure en cours close.'); return; }
  try{ edtFermer(); edtModaleFermer(); }catch(e){} try{ atelierOuvrir(); }catch(e){}
  atChargerChapitres(m[1],function(){ atEditerChapitre(m[1],m[2]); ATVUES.snum=String(m[3]);
    edtQuandPilotagePret(function(manque){ if(manque){ atInfo('La Relecture ne s’ouvre pas (manque : '+manque+').'); return; } try{ atVuesAller('relecture'); }catch(e){}
      dr_recitChargerClasse(decodeURIComponent(m[4]),function(){ S.face='chapitre'; S.faceH=0; try{ relecture(); }catch(e){} }); }); });
};

/* ── T5 · les stats, à côté : lues des traces des heures de cette classe (jamais inventées), copiables ── */
function edtClHeuresJouees(nom){
  var niv=edtNiveauDe(nom), out=[];
  (EDT_CHAP[niv]||[]).forEach(function(ch){ edtListe(ch.seances).forEach(function(s){ var d=s.deroule_joue||{};
    Object.keys(d).forEach(function(sl){ var b=d[sl]; if(!b||(b.classe&&b.classe!==nom))return; if(!b.classe&&sl!==edtClSlugDe(nom))return;
      Object.keys(b.heures||{}).forEach(function(k){ if(b.heures[k])out.push({cle:k,t:b.heures[k],s:s,ch:ch}); }); }); }); });
  return out.sort(function(a,b){ return a.cle.localeCompare(b.cle); });
}
function edtClStatsHtml(nom,l){
  var H=edtClHeuresJouees(nom), eleves=edtElevesDe(nom);
  var h='<div class="edtcl-ptete"><b>'+escapeHtml(nom)+' — les stats</b><span>'+H.length+' heure'+(H.length>1?'s':'')+' jouée'+(H.length>1?'s':'')+'</span>'
    +'<span class="edt-souple"></span><button class="edt-btn" onclick="edtClCopier()">Copier</button></div>'
    +(edtEstExperimentale(nom)?'<p class="edtcl-p"><i class="edt-exp" title="'+EDT_MENTION_EXP+'">expérimentale</i> '+EDT_MENTION_EXP+' \u2014 ses stats ne se comparent à aucune autre classe.</p>':'')+'<div id="edtcl-copie">';
  /* le temps : réel / prévu par heure */
  h+='<h3>Les heures</h3><table class="edtcl-tab"><tr><th>jour</th><th>créneau</th><th>séance</th><th>heure</th><th>joué</th><th>prévu</th><th>activités</th><th>reportées</th><th>paroles</th></tr>';
  H.forEach(function(x){ var t=x.t, m=/^(\d{4}-\d{2}-\d{2})_(\d{2})h(\d{2})-(\d{2})h(\d{2})_/.exec(x.cle)||[]; var act=t.activites||[];
    h+='<tr><td>'+escapeHtml(m[1]?edtDateCourte(m[1]):x.cle)+'</td><td>'+(m[2]?(m[2]+':'+m[3]+'-'+m[4]+':'+m[5]):escapeHtml(t.creneau||''))+'</td><td>'+escapeHtml(x.s.title||'')+'</td><td>'+(t.heure||'?')+'/'+(t.sur||'?')+'</td>'
      +'<td>'+(+t.minutesJouees||0)+' min</td><td>'+(+t.tempsUtilePrevu||0)+' min</td><td>'+act.filter(function(a){return a&&a.reel>0;}).length+'/'+act.length+'</td><td>'+act.filter(function(a){return a&&a.reel===0;}).length+'</td><td>'+(t.parts||[]).length+'</td></tr>'; });
  h+='</table>';
  /* la participation : par élève, sur les heures jouées */
  var parts={}, abs={}; H.forEach(function(x){ (x.t.parts||[]).forEach(function(p){ if(p&&p.nom)parts[p.nom]=(parts[p.nom]||0)+1; });
    var ap=x.t.appel||{}; Object.keys(ap).forEach(function(n){ var a=false; (ap[n]||[]).forEach(function(z){ if(!z)return; if(z.type==='absent'||z.type==='parti')a=true; if(z.type==='arrive'||z.type==='revenu')a=false; }); if(a)abs[n]=(abs[n]||0)+1; }); });
  var noms=eleves.slice(); Object.keys(parts).forEach(function(n){ if(noms.indexOf(n)<0)noms.push(n); });
  h+='<h3>La participation</h3>';
  if(!H.length)h+='<p class="edt-mini-t">aucune heure jouée : rien à compter</p>';
  else h+='<table class="edtcl-tab"><tr><th>élève</th><th>paroles</th><th>absences</th></tr>'+noms.map(function(n){ return '<tr><td>'+escapeHtml(n)+'</td><td>'+(parts[n]||0)+'</td><td>'+(abs[n]||0)+'</td></tr>'; }).join('')+'</table>';
  /* la couverture : les notions des diapos jouées, contre celles du chapitre en cours */
  var vues={}; H.forEach(function(x){ (x.t.activites||[]).forEach(function(a){ if(a&&a.reel>0)(a.comp||[]).forEach(function(k){ vues[k]=1; }); }); });
  var f=edtFileDAttente(nom,null), toutes={}; if(f)edtListe(f.chapitre.seances).forEach(function(s){ edtListe((s.deroule||{}).ecrans).forEach(function(e){ (e.comp||[]).forEach(function(k){ toutes[k]=1; }); }); (s.notions||[]).forEach(function(k){ toutes[k]=1; }); });
  var kv=Object.keys(vues), kr=Object.keys(toutes).filter(function(k){return !vues[k];});
  h+='<h3>La couverture</h3><p class="edtcl-p">vues : '+(kv.length?kv.map(function(k){return escapeHtml(edtClNotion(k));}).join(' · '):'aucune')+'</p>'
    +'<p class="edtcl-p">pas encore vues'+(f?' ('+escapeHtml(f.chapitre.title||'')+')':'')+' : '+(kr.length?kr.map(function(k){return escapeHtml(edtClNotion(k));}).join(' · '):'aucune')+'</p>';
  /* les heures sans séance et leurs motifs : les décisions de l'EDT pour cette classe */
  var dec=((edtDecisions()[nom]||{}).heures)||{}, sans=Object.keys(dec).filter(function(k){ return dec[k]&&dec[k].sansSeance; }).sort();
  h+='<h3>Les heures sans séance</h3>';
  if(!sans.length)h+='<p class="edt-mini-t">aucune</p>';
  else h+='<table class="edtcl-tab"><tr><th>jour</th><th>créneau</th><th>motif</th></tr>'+sans.map(function(k){ var d=dec[k], m=/^(\d{4}-\d{2}-\d{2})_(\d{2})h(\d{2})-(\d{2})h(\d{2})_/.exec(k)||[];
    return '<tr><td>'+escapeHtml(m[1]?edtDateCourte(m[1]):k)+'</td><td>'+(m[2]?(m[2]+':'+m[3]+'-'+m[4]+':'+m[5]):'')+'</td><td>'+escapeHtml(d.deplaceeVers?('déplacée vers le '+String(d.deplaceeVers).replace('|',' ')):(d.categorie||''))+(d.precision?(' — '+escapeHtml(d.precision)):'')+'</td></tr>'; }).join('')+'</table>';
  return h+'</div>';
}
window.edtClCopier=function(){
  var z=document.getElementById('edtcl-copie'); if(!z)return; var html=z.innerHTML, txt=z.innerText;
  var fait=function(){ if(typeof atInfo==='function')atInfo('Copié, mise en forme comprise.'); };
  try{ if(navigator.clipboard&&window.ClipboardItem){ navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([txt],{type:'text/plain'})})]).then(fait,function(){ navigator.clipboard.writeText(txt).then(fait); }); return; } }catch(e){}
  try{ navigator.clipboard.writeText(txt).then(fait); }catch(e){}
};

/* ── le style : celui de l'EDT (mêmes couleurs, mêmes boutons), deux colonnes ── */
var css='.edtcl-corps{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:minmax(280px,2fr) 3fr;gap:10px;padding:6px 12px 10px;overflow:hidden}'
+'.edtcl-heures{overflow:auto;min-height:0;border:1px solid rgba(255,255,255,.1);border-radius:8px}'
+'.edtcl-h{display:flex;gap:8px;align-items:flex-start;padding:5px 8px;border-bottom:1px solid rgba(255,255,255,.06);border-left:3px solid rgba(255,255,255,.18);cursor:pointer;font-size:.74rem}'
+'.edtcl-h:hover{background:rgba(255,255,255,.05)}.edtcl-h-sel{background:rgba(224,185,120,.12)}.edtcl-h-auj .edtcl-d{color:#e0b978}'
+'.edtcl-h-jouee{border-left-color:#34d399}.edtcl-h-sansSeance,.edtcl-h-deplacee{border-left-color:#e0b978}.edtcl-h-passee,.edtcl-h-rienDePret{border-left-color:rgba(200,120,120,.5)}'
+'.edtcl-d{flex:0 0 64px;color:#c9bfa4}.edtcl-d i{display:block;font-style:normal;font-size:.66rem;color:#7a7060}'
+'.edtcl-c{flex:1 1 auto;min-width:0}.edtcl-c u{display:block;text-decoration:none;color:#e8e0cf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.edtcl-c i{display:block;font-style:normal;font-size:.66rem;color:#9c8f74;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
+'.edtcl-panneau{overflow:auto;min-height:0;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 12px}'
+'.edtcl-stats{overflow:auto;min-height:0;grid-column:1/-1;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 12px}'
+'.edtcl-ptete{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:8px;font-size:.86rem}.edtcl-ptete span{color:#c9bfa4;font-size:.76rem}'
+'.edtcl-glisse{font-size:.74rem;color:#e0b978;margin:2px 0 8px}.edtcl-p{font-size:.78rem;color:#c9bfa4;margin:4px 0}'
+'.edtcl-diapo{border:1px solid rgba(255,255,255,.1);border-left:3px solid rgba(155,155,155,.5);border-radius:6px;padding:6px 9px;margin-bottom:7px;background:rgba(255,255,255,.02)}'
+'.edtcl-diapo-react{border-left-color:#e0b978}.edtcl-diapo-seule{border-left-color:#34d399}.edtcl-diapo-non{opacity:.45;border-left-color:rgba(200,120,120,.6)}'
+'.edtcl-dtete{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.edtcl-dtete b{font-size:.8rem}.edtcl-dtete i{font-style:normal;font-size:.68rem;color:#9c8f74}'
+'.edtcl-badges{margin-left:auto;display:flex;gap:4px}.edtcl-badge{font:inherit;font-size:.66rem;background:transparent;color:#9c8f74;border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:2px 8px;cursor:pointer}.edtcl-badge.on{color:#14100c;background:#e0b978;border-color:#e0b978}'
+'.edtcl-dlignes p{margin:3px 0;font-size:.74rem;color:#c9bfa4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.edtcl-dcomp{font-size:.64rem;color:#7a7060;margin-top:3px}'
+'.edtcl-stats h3{font-size:.86rem;margin:12px 0 4px;color:#e0b978;font-weight:normal}'
+'.edtcl-tab{border-collapse:collapse;font-size:.74rem}.edtcl-tab th,.edtcl-tab td{border-bottom:1px solid rgba(255,255,255,.08);padding:2px 9px;text-align:left;white-space:nowrap}.edtcl-tab th{color:#9c8f74;font-weight:normal}.edtcl-rep td{color:#e0b978}';
var st=document.createElement('style'); st.id='edtcl-css'; st.textContent=css; document.head.appendChild(st);
})();
