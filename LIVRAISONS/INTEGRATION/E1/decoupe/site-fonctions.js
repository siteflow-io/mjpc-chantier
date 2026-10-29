/* E1-a — les fonctions du site que la barre fusionnée (proposition 96) et le socle remplacent.
   Chaque fonction est posée à la place de celle du même nom dans index.html par E1/decouper.mjs. */
function atVuesRappeler(){ try{ var v=sessionStorage.getItem('atvues'); if(v)ATVUES.vue=({deroule:'atelier',papier:'relecture'})[v]||v; }catch(e){} }   /* E1 : les vues d'avant la 96 (deroule, papier) reviennent à Atelier, Relecture */

function atVuesBarreHtml(){
  /* E1 (96) : une seule barre — Structure · Atelier · Pilotage · Relecture ; les trois onglets du déroulé portent les ids de la maquette (contrat §7) */
  var defs=[['structure','Structure','Le chapitre : son titre, ses séances, ses documents — là où tu le conçois'],
    ['atelier','Atelier','La préparation de la séance, diapo par diapo : tu écris, tu ranges, tu joues en avance — rien n’est joué pour une classe, tout s’enregistre'],
    ['pilotage','Pilotage','L’écran de classe : la diapo, le tableau, la participation, le chrono'],
    ['relecture','Relecture','Le récit de l’heure, ce qui s’est passé, le chapitre — et le papier du cahier (R)']];
  var ids={atelier:'ong-atelier',pilotage:'ong-pilotage',relecture:'ong-relecture'};
  return '<div class="at-vues-barre">'+defs.map(function(d){
    return '<button class="at-onglet'+(ATVUES.vue===d[0]?' at-onglet-actif':'')+'" data-vue="'+d[0]+'"'+(ids[d[0]]?' id="'+ids[d[0]]+'"':'')+(d[0]==='atelier'?' data-atelier="1"':'')
      +' title="'+d[2]+'" onclick="atVuesAller(this.dataset.vue)">'+d[1]+'</button>';
  }).join('')+'<span class="at-dr-etat" id="at-dr-etat" title="L’enregistrement de la trame au hub : il se fait seul, moins d’une seconde après chaque modification"></span></div>';
}

function atVuesMarquer(v){   /* E1 : l'onglet actif suit la vue, sans redessiner la colonne ni le déroulé */
  var b=document.querySelectorAll('.at-vues-barre .at-onglet');
  for(var i=0;i<b.length;i++) b[i].classList.toggle('at-onglet-actif', b[i].dataset.vue===v);
}

function atVuesAller(v){
  if(v==='deroule')v='atelier'; if(v==='papier')v='relecture';   /* E1 : les vues d'avant la 96 */
  ATVUES.vue=v; atVuesRetenir();
  if(v==='structure'){ if(typeof dr_parquer==='function')dr_parquer(); atEditerChapitreRendre(); return; }   /* E1 : lisait DR.dr_fermer() (le cadre) */
  if(typeof dr_actif==='function'&&dr_actif()&&document.querySelector('.at-vues-dr')){ atVuesMarquer(v); dr_onglet(v); return; }   /* E1 : déjà monté — on change d'onglet, rien ne se redessine */
  atVuesPoser(v);
}

function atVuesPoser(v){
  /* E1 : la colonne du site + la zone du déroulé, dr-zone (le déroulé p8, dans la page — plus d'iframe ni de tête de préparation) */
  var z=document.getElementById('at-zone'); if(!z) return;
  if(v==='deroule')v='atelier'; if(v==='papier')v='relecture';
  ATVUES.vue=v;
  if(ATVUES.snum===null||ATVUES.snum===undefined) ATVUES.snum=(typeof atArbrePremiereSeance==='function')?atArbrePremiereSeance():'0';
  if(typeof dr_parquer==='function') dr_parquer();   /* la zone sort avant que le site ne réécrive la sienne */
  var h=atVuesBarreHtml()
    +'<div class="at-vues-corps">'+atSommaireNatifHtml()
    +'<div class="at-vues-zone at-vues-zone-dr" id="at-vues-zone"></div></div>';
  z.innerHTML='<div class="at-vues-cadre at-vues-dr">'+h+'</div>';
  if(typeof dr_monter==='function'){
    dr_monter(document.getElementById('at-vues-zone'));
    if(!DR_MEM.demarre) dr_demarrer(); else dr_suivreSeance();
    dr_onglet(v);
  }
}

function atSommaireNatifHtml(){
  var ec=AT.edChap||AT_FIL; if(!ec) return '<div class="at-vues-arbre" id="at-arbre"></div>';
  try{
    var docs=ed2Documents(ec.level,ec.chnum);
    var h=ed2Sommaire(ec.level,ec.chnum,docs);
    if(ATVUES.vue!=='structure') h=atSomInjecterEcrans(h);   /* E1 : les trois vues du déroulé (lisait ATVUES.vue==='deroule') */
    return '<div class="at-vues-arbre" id="at-arbre">'+h+'</div>';
  }catch(e){ return '<div class="at-vues-arbre" id="at-arbre"></div>'; }
}

function atSomEcransDe(seance){
  var ec=AT.edChap||AT_FIL; if(!ec) return [];
  if(AT.edChap&&typeof dr_trameDe==='function'){ try{ return dr_trameDe(String(seance)); }catch(e){} }   /* E1 : lisait DR.dr_exporterTrame() (le cadre) */
  try{
    var ch=(chapitresData[ec.level]||{})[ec.chnum]||{};
    var sce=(ch.seances||{})[seance]||{};
    return ((sce.deroule||{}).ecrans)||[];
  }catch(e){ return []; }
}

function atSomEcransHtml(seance){
  var ecr=atSomEcransDe(seance);
  if(!ecr.length) return '';
  var active=(String(seance)===String(ATVUES.snum));
  var cour=-1; if(active){ try{ cour=(typeof S!=='undefined'&&S)?S.di:0; }catch(e){ cour=0; } }   /* E1 : lisait DR.dr_ecranCourant() */
  var h='<div class="at-som-ecrans">';
  var cumul=0;
  ecr.forEach(function(e,n){
    var hh=active?((e&&e.h)||''):('+'+cumul+'′');   /* [12e] le relatif hors séance ouverte */
    cumul+=(+((e&&e.dur))||0);
    var act=(e&&(e.act||e.titre))||('Diapo '+(n+1));
    h+='<div class="at-ecr'+(n===cour?' at-ecr-sel':'')+'" data-ecr="'+n+'" data-ese="'+atEsc(String(seance))+'" title="Aller à cette diapo" onclick="atSomAllerEcran('+n+',\''+atEsc(String(seance))+'\')">'
      +'<span class="at-ecr-mini"><i class="at-ecr-t"></i><i></i><i></i><i></i></span>'
      +'<span class="at-ecr-txt">'+(hh?'<span class="at-ecr-h">'+atEsc(hh)+'</span><br>':'')
      +'<span class="at-ecr-n">'+atEsc(act)+'</span></span></div>';
  });
  return h+'</div>';
}

function atSomAllerEcran(n,seance){
  if(seance!==undefined && String(seance)!==String(ATVUES.snum)){
    ATVUES.snum=String(seance); AT_SOM_ETAT[String(seance)]=true;   /* on change de séance */
    if(ATVUES.vue!=='structure'){   /* E1 : les trois vues du déroulé (lisait ATVUES.vue==='deroule') */
      var scB=document.querySelector('#at-arbre .ed2-som'), posB=scB?scB.scrollTop:0;   /* [13e] la colonne ne remonte plus */
      atVuesPoser(ATVUES.vue);
      var scA=document.querySelector('#at-arbre .ed2-som'); if(scA)scA.scrollTop=posB;
      if(typeof dr_aller==='function') dr_aller(n);
      return; }
  }
  try{ if(typeof dr_aller==='function') dr_aller(n); }catch(e){}   /* E1 : lisait DR.va(n) (le cadre) */
  /* [LOT1-①] SÉLECTION SEULE — on déplace le halo, on ne reconstruit RIEN */
  var col=document.getElementById('at-arbre'); if(!col) return;
  var lst=col.querySelectorAll('.at-ecr');
  for(var k=0;k<lst.length;k++){ lst[k].classList.remove('at-ecr-sel'); }
  if(lst[n]) lst[n].classList.add('at-ecr-sel');
}

/* l'identité D'USAGE d'un rang : celle du PÈRE si le rang désigne un fils du zoom. */
function _drEidDuRang(n,ecrans){
  var t=ecrans||((typeof dr_trame==='function')?dr_trame():[])||[];   /* E1 : lisait (drWin()||{}).ECRANS (le cadre) */
  var e=t[n]; if(!e)return null;
  if(!e.suite)return e.eid||null;
  for(var k=n-1;k>=0;k--){ if(t[k]&&!t[k].suite&&t[k].grp===e.grp)return t[k].eid||null; }
  for(var j=0;j<t.length;j++){ if(t[j]&&!t[j].suite&&t[j].grp===e.grp)return t[j].eid||null; }
  return null;
}
/* le rang LOCAL d'une identité */
function _drRangDeLEid(eid,ecrans){
  if(!eid)return null;
  var t=ecrans||((typeof dr_trame==='function')?dr_trame():[])||[];   /* E1 : lisait (drWin()||{}).ECRANS (le cadre) */
  for(var k=0;k<t.length;k++){ if(t[k]&&!t[k].suite&&t[k].eid===eid)return k; }
  return null;
}
/* le rang du PÈRE : le vécu, la participation et les décisions s'y ancrent toujours. */
function _drRangPere(n,ecrans){
  var t=ecrans||((typeof dr_trame==='function')?dr_trame():[])||[];   /* E1 : lisait (drWin()||{}).ECRANS (le cadre) */
  var e=t[n]; if(!e||!e.suite)return n;
  for(var k=n-1;k>=0;k--){ if(t[k]&&!t[k].suite&&t[k].grp===e.grp)return k; }
  return n;
}

function atSomSuivreCourant(){
  var col=document.getElementById('at-arbre'); if(!col||typeof S==='undefined'||typeof dr_actif!=='function'||!dr_actif()) return;   /* E1 : lisait window.DR / DR.dr_ecranCourant() (le cadre) */
  var n=S.di||0;
  var lst=col.querySelectorAll('.at-ecr[data-ese="'+String(ATVUES.snum)+'"]');
  for(var k=0;k<lst.length;k++){ lst[k].classList.toggle('at-ecr-sel', k===n); }
}
