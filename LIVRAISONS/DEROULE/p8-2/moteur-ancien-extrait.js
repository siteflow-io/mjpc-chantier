/* EXTRAIT, LU EN ENTIER — le moteur de l'ancien déroulé : AT_DR_B64 d'index.html de production, base c9bc2d9 (md5 d'index.html ac792b28f40d3a0510e725fc4a6b6985), décodé : 232 358 octets, 229 960 caractères, md5 e7ceefa87d9bce00ebcf860cfa636d9f. Lignes du fichier décodé indiquées. Non exécuté dans la maquette : la pièce de référence de la NOTE. */

/* ───── lignes 284 à 288 : le style de la préhension ───── */
  #contenu .sch g.n{cursor:move}
  #contenu .sch g.n.bouge rect{stroke-dasharray:4 3}
  #contenu .sch g.n.pris rect{stroke:#0f8f53!important;stroke-width:3.4!important}
  #contenu .sch g.jal{cursor:ew-resize}
  #contenu .sch g.jal:hover circle:last-child{stroke:#c99a4e;stroke-width:4}

/* ───── lignes 820 à 1060 : schLignes, schemaHTML, SCH_COUL, schEch, cle, mesure, COUL, separe, surface, dessine, carte, frise, arbre, cycle, grille ───── */
function schLignes(b){ return String(b.src||'').split('\n').map(function(s){return s.replace(/\s+$/,'');}).filter(function(s){return s.trim();}); }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
var bSch=null;
function schemaHTML(b,pourClasse){ bSch=b;
  var L=schLignes(b), t=b.forme||'carte';
  if(pourClasse&&b.devoilerTout===false){
    var vu=(b.vues||0);
    if(t==='carte'){                       /* on coupe famille par famille, puis membre par membre */
      var out=[],reste=vu;
      L.forEach(function(s){ if(reste<=0)return;
        var p=s.split(':'), mem=(p[1]||'').split(',').filter(function(x){return x.trim();});
        reste--; if(reste<=0){ out.push(p[0]+' :'); return; }
        var pris=Math.min(mem.length,reste); reste-=pris;
        out.push(p[0]+' : '+mem.slice(0,pris).join(',')); });
      L=out;
    } else L=L.slice(0,vu);
  }
  if(t==='carte')return carte(L);
  if(t==='frise')return frise(L);
  if(t==='arbre')return arbre(L);
  if(t==='cycle')return cycle(L);
  if(t==='tableau')return grille(L);
  return ''; }
/* ═══ SCHÉMAS — le contenu est déclaré, positions, traits et couleurs sont calculés ═══ */
var SCH_COUL=['#7b1113','#e8484c','#d64fd6','#4a1258','#6f4fd8','#2f6fe0','#25c8a5','#5bc236','#c99a4e','#8a7a5a'];
/* une seule réglette pour tout l'écran : le schéma en dérive, comme la fiche et l'image */
function schEch(){ var k=PT[iz]/32; return Math.max(0.6,Math.min(2.4, k*1.35)); }
function cle(txt){ return 'k'+String(txt).replace(/[^a-zA-Z0-9À-ÿ]/g,'').slice(0,24); }
function mesure(txt,fs){ return {w:Math.max(52,String(txt).length*fs*0.54)+14, h:fs*2.1}; }                 /* positions déplacées à la main : elles priment sur le calcul */
var COUL=["#7b1113","#e8484c","#d64fd6","#4a1258","#6f4fd8","#2f6fe0","#25c8a5","#5bc236","#c99a4e","#8a7a5a"];
function separe(N,W,H,marge){
  if(false)return N;    /* pendant qu'on tire, rien ne bouge tout seul */
  marge=marge||6;
  for(var pas=0;pas<600;pas++){
    var bouge=false;
    for(var a=0;a<N.length;a++)for(var b=a+1;b<N.length;b++){
      var A=N[a],B=N[b];
      var dx=B.x-A.x, dy=B.y-A.y;
      var ox=(A.w+B.w)/2+marge-Math.abs(dx), oy=(A.h+B.h)/2+marge-Math.abs(dy);
      if(ox>0&&oy>0){
        bouge=true;
        if(A.fixe&&B.fixe)continue;          /* deux boîtes fixées par Paul : on ne touche à rien */
        if(ox<oy){ var s=(dx>=0?1:-1)*ox/2;
          if(!A.fixe)A.x-=s; if(!B.fixe)B.x+=s;
          if(A.fixe&&!B.fixe)B.x+=s; if(B.fixe&&!A.fixe)A.x-=s;
        } else { var t=(dy>=0?1:-1)*oy/2;
          if(!A.fixe)A.y-=t; if(!B.fixe)B.y+=t;
          if(A.fixe&&!B.fixe)B.y+=t; if(B.fixe&&!A.fixe)A.y-=t;
        }
      }
    }
    N.forEach(function(n){ if(n.fixe)return;
      n.x=Math.max(n.w/2+4,Math.min(W-n.w/2-4,n.x));
      n.y=Math.max(n.h/2+4,Math.min(H-n.h/2-4,n.y)); });
    if(!bouge)break;
  }
  /* dernier recours, RÉPÉTÉ jusqu'à ce que plus rien ne se touche : on descend la plus basse.
     Aucune limite de cadre ici — mieux vaut un dessin plus haut qu'un chevauchement. */
  for(var tour=0;tour<80;tour++){
    var reste=false;
    for(var a=0;a<N.length;a++)for(var b=a+1;b<N.length;b++){
      var A=N[a],B=N[b];
      if(A.fixe&&B.fixe)continue;
      var ox=(A.w+B.w)/2+marge-Math.abs(B.x-A.x), oy=(A.h+B.h)/2+marge-Math.abs(B.y-A.y);
      if(ox>0&&oy>0){ reste=true; var c=(A.y>=B.y?A:B); if(c.fixe)c=(c===A?B:A);
        if(!c.fixe)c.y+=oy+3; }
    }
    if(!reste)break;
  }
  return N;
}
function surface(N,W,H,marge){
  /* si le contenu ne peut pas tenir sans chevauchement, la SURFACE grandit :
     l'écran garde son format, le dessin est simplement plus vaste et le texte reste net */
  var aire=0; N.forEach(function(n){ aire+=(n.w+marge)*(n.h+marge); });
  var k=Math.sqrt(aire/(W*H*0.34));
  if(k>1){ return {W:Math.round(W*k), H:Math.round(H*k), k:k}; }
  return {W:W,H:H,k:1};
}
function dessine(n){
  return '<g class="n'+(n.fixe?' bouge':'')+'" data-k="'+cle(n.t)+'">'
    +'<rect x="'+(n.x-n.w/2)+'" y="'+(n.y-n.h/2)+'" width="'+n.w+'" height="'+n.h+'" rx="'+(n.h/3)+'" '
    +'fill="'+(n.clair?'#fff':n.c)+'" stroke="'+(n.noyau?'#b01414':n.c)+'" stroke-width="'+(n.noyau?3:1.6)+'"/>'
    +'<text x="'+n.x+'" y="'+(n.y+n.fs*0.36)+'" text-anchor="middle" font-family="EB Garamond,Garamond,serif" '
    +'font-size="'+n.fs+'" font-weight="'+(n.noyau?700:600)+'" fill="'+(n.clair?'#1c1c1c':'#fff')+'">'+esc(n.t)+'</text></g>';
}
function carte(L){
  var fam=L.map(function(s){ var p=s.split(':');
    return {nom:(p[0]||'').trim(), membres:(p[1]||'').split(',').map(function(x){return x.trim();}).filter(Boolean)}; })
    .filter(function(f){return f.nom;});
  var e=schEch(), W=1000,H=560,cx=W/2,cy=H/2;
  var R=Math.min(W,H)*(0.30+0.03*e), r2=Math.min(W,H)*(0.47+0.04*e);
  var fsT=20*e, fsF=16*e, fsM=13*e;   /* plus gros d'origine : lisible au vidéoprojecteur */
  var tit=(bSch.titre||'')||'—';
  var N=[], liens=[];
  function pousse(txt,x,y,fs,c,clair,noyau){
    var m=mesure(txt,fs), p=(bSch.pos||{})[cle(txt)];
    var n={t:txt,x:p?p.x:x,y:p?p.y:y,w:m.w,h:m.h,fs:fs,c:c,clair:clair,noyau:noyau,fixe:!!p};
    N.push(n); return n;
  }
  var nc=pousse(tit,cx,cy,fsT,'#b01414',false,true);
  fam.forEach(function(f,k){
    var a=(-Math.PI/2)+(2*Math.PI*k/fam.length), c=SCH_COUL[k%COUL.length];
    var nf=pousse(f.nom, cx+Math.cos(a)*R, cy+Math.sin(a)*R, fsF, c, false, false);
    liens.push({a:nc,b:nf,c:c,w:5});
    f.membres.forEach(function(m,j){
      var sp=Math.min(0.34,1.15/Math.max(1,f.membres.length));
      var a2=a+(j-(f.membres.length-1)/2)*sp;
      var nm=pousse(m, cx+Math.cos(a2)*r2, cy+Math.sin(a2)*r2, fsM, c, true, false);
      liens.push({a:nf,b:nm,c:c,w:1.6});
    });
  });
  var su=surface(N,W,H,7*e);
  if(su.k>1){ N.forEach(function(n){ if(n.fixe)return; n.x=(n.x-W/2)*su.k+su.W/2; n.y=(n.y-H/2)*su.k+su.H/2; }); }
  W=su.W; H=su.H;
  separe(N,W,H,7*e);
  /* on recadre au plus juste sur ce qui a été dessiné, puis on complète le repère
     pour retrouver EXACTEMENT le format de l'écran : plus de bandes vides. */
  var x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;
  N.forEach(function(n){ x1=Math.min(x1,n.x-n.w/2); y1=Math.min(y1,n.y-n.h/2);
                         x2=Math.max(x2,n.x+n.w/2); y2=Math.max(y2,n.y+n.h/2); });
  var m=14*e; x1-=m; y1-=m; x2+=m; y2+=m;
  var lw=x2-x1, lh=y2-y1, r=16/9;
  if(lw/lh < r){ var nw=lh*r; x1-=(nw-lw)/2; lw=nw; }   /* trop étroit : on élargit le repère */
  else { var nh=lw/r; y1-=(nh-lh)/2; lh=nh; }            /* trop large : on grandit en hauteur */
  var s='<svg '+'viewBox="'+x1+' '+y1+' '+lw+' '+lh+'" preserveAspectRatio="none"'+'>';
  liens.forEach(function(l){ s+='<line x1="'+l.a.x+'" y1="'+l.a.y+'" x2="'+l.b.x+'" y2="'+l.b.y
    +'" stroke="'+l.c+'" stroke-width="'+l.w+'" opacity="'+(l.w>3?1:.75)+'"/>'; });
  N.forEach(function(n){ s+=dessine(n); });
  return s+'</svg>';
}
function frise(L){
  var e=schEch(), W=1000,H=560;
  var pts=L.map(function(s){ var p=s.split(':');
    return {d:parseInt((p[0]||'').replace(/\D/g,''),10), t:(p[1]||'').trim()}; })
    .filter(function(p){return !isNaN(p.d);});
  if(!pts.length)return '';        /* rien à montrer : jamais de consigne d'auteur au tableau */
  var min=Math.min.apply(null,pts.map(function(p){return p.d;})),
      max=Math.max.apply(null,pts.map(function(p){return p.d;}));
  var yL=H/2, N=[];
  pts.forEach(function(p,k){
    var x=(max===min)?W/2:(((p.d-min)/(max-min))*(W*0.86)+W*0.07);
    var alt=(k%2)?1:-1;
    var fs=14*e, m=mesure(p.d+' · '+p.t,fs), pos=(bSch.pos||{})[cle(p.d+p.t)];
    N.push({t:p.d+' · '+p.t, jalonX:x, x:pos?pos.x:x, y:pos?pos.y:yL+alt*(58*e+m.h/2),
            w:m.w, h:m.h, fs:fs, c:SCH_COUL[k%COUL.length], clair:true, noyau:false, fixe:!!pos, cleFrise:cle(p.d+p.t)});
  });
  separe(N,W,H,9*e);
  var s='<line x1="'+(W*0.04)+'" y1="'+yL+'" x2="'+(W*0.96)+'" y2="'+yL+'" stroke="#d9cdb4" stroke-width="'+(4*e)+'"/>';
  N.forEach(function(n,k){
    s+='<line x1="'+n.jalonX+'" y1="'+yL+'" x2="'+n.x+'" y2="'+n.y+'" stroke="'+n.c+'" stroke-width="1.4" opacity=".6"/>';
    s+='<g class="jal" data-i="'+k+'" data-min="'+min+'" data-max="'+max+'" data-w="'+W+'">'
      +'<circle cx="'+n.jalonX+'" cy="'+yL+'" r="'+(13*e)+'" fill="transparent"/>'
      +'<circle cx="'+n.jalonX+'" cy="'+yL+'" r="'+(7*e)+'" fill="'+n.c+'" stroke="#fff" stroke-width="'+(2.5*e)+'"/>'
      +'</g>';
  });
  N.forEach(function(n){ s+=dessine(n); });
  var x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;
  N.forEach(function(n){ x1=Math.min(x1,n.x-n.w/2-30); y1=Math.min(y1,n.y-n.h/2-30);
                         x2=Math.max(x2,n.x+n.w/2+30); y2=Math.max(y2,n.y+n.h/2+30); });
  x1=Math.min(x1,W*0.02); x2=Math.max(x2,W*0.98); y1=Math.min(y1,yL-40); y2=Math.max(y2,yL+40);
  var lw=x2-x1, lh=y2-y1, r=16/9;
  if(lw/lh<r){ var nw=lh*r; x1-=(nw-lw)/2; lw=nw; } else { var nh=lw/r; y1-=(nh-lh)/2; lh=nh; }
  return '<svg '+'viewBox="'+x1+' '+y1+' '+lw+' '+lh+'" preserveAspectRatio="none"'+'>'+s+'</svg>';
}
/* ── ARBRE : profondeur déduite de l'indentation ── */
function arbre(L){
  var e=schEch(), W=1000,H=560, noeuds=L.map(function(s){ var d=(s.match(/^ */)||[''])[0].length/2; return {d:d,t:s.trim()}; });
  var parNiv={}; noeuds.forEach(function(n){ (parNiv[n.d]=parNiv[n.d]||[]).push(n); });
  var maxD=Math.max.apply(null,noeuds.map(function(n){return n.d;}));
  var pos=[];
  noeuds.forEach(function(n,k){
    var rang=parNiv[n.d].indexOf(n), tot=parNiv[n.d].length;
    n.fs=(n.d?12:15)*e; var m=mesure(n.t,n.fs); n.w=m.w; n.h=m.h;
    var p=(bSch.pos||{})[cle(n.t)];
    n.x=p?p.x:(rang+1)/(tot+1)*W; n.y=p?p.y:60+n.d*(H-110)/Math.max(1,maxD); n.fixe=!!p; pos.push(n);
  });
  var su=surface(noeuds,W,H,7*e);
  if(su.k>1){ noeuds.forEach(function(n){ if(n.fixe)return; n.x=(n.x-W/2)*su.k+su.W/2; n.y=(n.y-H/2)*su.k+su.H/2; }); }
  W=su.W; H=su.H;
  separe(noeuds,W,H,7*e);
  var x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;
  noeuds.forEach(function(n){ x1=Math.min(x1,n.x-n.w/2); y1=Math.min(y1,n.y-n.h/2);
                              x2=Math.max(x2,n.x+n.w/2); y2=Math.max(y2,n.y+n.h/2); });
  var mm=14*e; x1-=mm; y1-=mm; x2+=mm; y2+=mm;
  var lw=x2-x1, lh=y2-y1, r=16/9;
  if(lw/lh<r){ var nw=lh*r; x1-=(nw-lw)/2; lw=nw; } else { var nh=lw/r; y1-=(nh-lh)/2; lh=nh; }
  var s='<svg '+'viewBox="'+x1+' '+y1+' '+lw+' '+lh+'" preserveAspectRatio="none"'+'>';
  noeuds.forEach(function(n,k){
    if(!n.d)return;
    for(var j=k-1;j>=0;j--){ if(noeuds[j].d===n.d-1){
      s+='<path d="M'+noeuds[j].x+' '+(noeuds[j].y+14)+' C'+noeuds[j].x+' '+((noeuds[j].y+n.y)/2)+' '
        +n.x+' '+((noeuds[j].y+n.y)/2)+' '+n.x+' '+(n.y-14)+'" fill="none" stroke="#c9b79a" stroke-width="2"/>';
      break; } }
  });
  noeuds.forEach(function(n){ n.c=SCH_COUL[n.d%COUL.length]; n.clair=n.d>1; n.noyau=!n.d; s+=dessine(n); });
  return s+'</svg>';
}
/* ── CYCLE : étapes réparties sur un cercle ── */
function cycle(L){
  var e=schEch(), W=1000,H=560,cx=W/2,cy=H/2,R=Math.min(W,H)*(0.30+0.035*e);
  var N=L.map(function(t,k){ var a=(-Math.PI/2)+2*Math.PI*k/L.length, fs=15*e, m=mesure(t,fs), p=(bSch.pos||{})[cle(t)];
    return {t:t,x:p?p.x:cx+Math.cos(a)*R,y:p?p.y:cy+Math.sin(a)*R,w:m.w,h:m.h,fs:fs,
            c:SCH_COUL[k%COUL.length],clair:false,noyau:false,fixe:!!p}; });
  separe(N,W,H,9*e);
  /* la flèche s'arrête AU BORD de la boîte visée : sa pointe n'est jamais recouverte */
  function bord(de,vers){
    /* on avance depuis le centre de « vers » vers « de » jusqu'à sortir du rectangle :
       la pointe se pose juste à l'extérieur, elle n'est ni recouverte ni détachée */
    var dx=de.x-vers.x, dy=de.y-vers.y, l=Math.hypot(dx,dy)||1; dx/=l; dy/=l;
    var tx=dx!==0 ? (vers.w/2+6)/Math.abs(dx) : 1e9;
    var ty=dy!==0 ? (vers.h/2+6)/Math.abs(dy) : 1e9;
    var t=Math.min(tx,ty);
    return {x:vers.x+dx*t, y:vers.y+dy*t};
  }
  var s='<defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="'+(5*e)
   +'" markerHeight="'+(5*e)+'" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#8a7a5a"/></marker></defs>';
  N.forEach(function(n,k){
    var m=N[(k+1)%N.length];
    var d=bord(m,n), f=bord(n,m);                    /* départ au bord de A, arrivée au bord de B */
    var mx=(d.x+f.x)/2, my=(d.y+f.y)/2;
    var vx=cx-mx, vy=cy-my, l=Math.hypot(vx,vy)||1;
    var qx=mx-vx/l*26*e, qy=my-vy/l*26*e;            /* légère courbure vers l'extérieur */
    s+='<path d="M'+d.x+' '+d.y+' Q'+qx+' '+qy+' '+f.x+' '+f.y+'" fill="none" stroke="'+n.c
      +'" stroke-width="'+(3*e)+'" marker-end="url(#fl)" opacity=".85"/>';
  });
  N.forEach(function(n){ s+=dessine(n); });          /* les boîtes PAR-DESSUS les flèches */
  var x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;
  N.forEach(function(n){ x1=Math.min(x1,n.x-n.w/2-50*e); y1=Math.min(y1,n.y-n.h/2-50*e);
                         x2=Math.max(x2,n.x+n.w/2+50*e); y2=Math.max(y2,n.y+n.h/2+50*e); });
  var lw=x2-x1, lh=y2-y1, r=16/9;
  if(lw/lh<r){ var nw=lh*r; x1-=(nw-lw)/2; lw=nw; } else { var nh=lw/r; y1-=(nh-lh)/2; lh=nh; }
  return '<svg '+'viewBox="'+x1+' '+y1+' '+lw+' '+lh+'" preserveAspectRatio="none"'+'>'+s+'</svg>';
}
/* ── TABLEAU ── */
function grille(L){
  if(!L.length)return '';
  var t='<table><tr>'+L[0].split('|').map(function(c){return '<th>'+esc(c.trim())+'</th>';}).join('')+'</tr>';
  L.slice(1).forEach(function(l){ t+='<tr>'+l.split('|').map(function(c){return '<td>'+esc(c.trim())+'</td>';}).join('')+'</tr>'; });
  return t+'</table>';
}

/* ───── lignes 1455 à 1466 : elems — la part du schéma ───── */
  /* les blocs visuels se dévoilent comme les autres, par les flèches ▶ ◀ :
     une image par ses marques, un schéma par ses éléments déclarés */
  if(b.t==='image')  return (b.devoilerTout===false)?((b.marques||[]).length):0;
  if(b.t==='schema'){
    if(b.devoilerTout!==false)return 0;
    var L=String(b.src||'').split('\n').filter(function(s){return s.trim();});
    if((b.forme||'carte')==='carte')
      return L.reduce(function(n,s){ var p=s.split(':');
        return n+1+((p[1]||'').split(',').filter(function(x){return x.trim();}).length); },0);
    return L.length;
  }
  if(b.etapes)return b.etapes.length;

/* ───── lignes 1619 à 1619 : PRIS, tirSch, jalSch ───── */
var PRIS={}, tirSch=null, jalSch=null, tirMk=null, selMk=null, VBfige=null, dernierMk={k:-1,t:0};

/* ───── lignes 1703 à 1726 : repeintSch, marquePris, le mousedown (g.jal, g.n) ───── */
function repeintSch(){ dessineEcran(); marquePris(); }
function marquePris(){ document.querySelectorAll('#contenu .sch g.n').forEach(function(g){
  g.classList.toggle('pris', !!PRIS[g.dataset.k]); }); }
document.addEventListener('mousedown',function(ev){
  var c=ev.target.closest&&ev.target.closest('#contenu'); if(!c)return;
  /* — un point de frise : sa date suit — */
  var jl=ev.target.closest('#contenu .sch g.jal');
  if(jl){ var svg=jl.ownerSVGElement, vb=svg.viewBox.baseVal, r=svg.getBoundingClientRect();
    jalSch={i:+jl.dataset.i, min:+jl.dataset.min, max:+jl.dataset.max, W:+jl.dataset.w};
    ev.preventDefault(); return; }
  /* — une boîte de schéma — */
  var g=ev.target.closest('#contenu .sch g.n');
  if(g){ var k=g.dataset.k;
    if(ev.ctrlKey||ev.metaKey){ if(PRIS[k])delete PRIS[k]; else PRIS[k]=1; marquePris(); ev.preventDefault(); return; }
    if(!PRIS[k]){ PRIS={}; PRIS[k]=1; marquePris(); }
    var sv=g.ownerSVGElement, vb2=sv.viewBox.baseVal, r2=sv.getBoundingClientRect(), dep={};
    VBfige=sv.getAttribute('viewBox');
    Object.keys(PRIS).forEach(function(kk){
      var gg=document.querySelector('#contenu .sch g.n[data-k="'+kk+'"]'); if(!gg)return;
      var rc=gg.querySelector('rect');
      dep[kk]={x:+rc.getAttribute('x')+ +rc.getAttribute('width')/2, y:+rc.getAttribute('y')+ +rc.getAttribute('height')/2};});
    tirSch={dep:dep, sx:ev.clientX, sy:ev.clientY, kx:vb2.width/r2.width, ky:vb2.height/r2.height};
    ev.preventDefault(); return; }
  /* — une poignée de cadre — */

/* ───── lignes 1759 à 1786 : le mousemove (jalSch, tirSch) ───── */
function blocImg(){ var e=ECRANS[i]; return e?e.blocs.filter(function(b){return b.t==='image';})[0]:null; }
document.addEventListener('mousemove',function(ev){
  if(jalSch){
    var sv=document.querySelector('#contenu .sch svg'); if(!sv)return;
    var vb=sv.viewBox.baseVal, r=sv.getBoundingClientRect();
    var u=vb.x+(ev.clientX-r.left)*(vb.width/r.width), W=jalSch.W;
    var frac=Math.max(0,Math.min(1,(u-W*0.07)/(W*0.86)));
    var d=Math.round(jalSch.min+frac*(jalSch.max-jalSch.min));
    d=Math.max(jalSch.min,Math.min(jalSch.max,d));
    var b=ECRANS[i].blocs.filter(function(x){return x.t==='schema';})[0]; if(!b)return;
    var L=String(b.src||'').split('\n');
    var autres=L.map(function(s,n){ return n===jalSch.i?null:parseInt(s.replace(/\D/g,''),10); })
                .filter(function(x){return x!==null&&!isNaN(x);});
    var pasMin=Math.max(1,Math.round((jalSch.max-jalSch.min)/28));
    autres.forEach(function(a){ if(Math.abs(d-a)<pasMin) d=(d>a? a+pasMin : a-pasMin); });
    var p=L[jalSch.i].split(':'); L[jalSch.i]=d+' :'+(p.slice(1).join(':')||'');
    b.src=L.join('\n'); dessineEcran(); return;
  }
  if(tirSch){
    var sv2=document.querySelector('#contenu .sch svg');
    if(sv2){ var vb2=sv2.viewBox.baseVal, r2=sv2.getBoundingClientRect();
      tirSch.kx=vb2.width/r2.width; tirSch.ky=vb2.height/r2.height; }
    var dx=(ev.clientX-tirSch.sx)*tirSch.kx, dy=(ev.clientY-tirSch.sy)*tirSch.ky;
    var bs=ECRANS[i].blocs.filter(function(x){return x.t==='schema';})[0]; if(!bs)return;
    bs.pos=bs.pos||{};
    Object.keys(tirSch.dep).forEach(function(k){ bs.pos[k]={x:tirSch.dep[k].x+dx, y:tirSch.dep[k].y+dy}; });
    repeintSch(); return;
  }

/* ───── lignes 1806 à 1808 : le mouseup ───── */
document.addEventListener('mouseup',function(){
  if(tirSch||tirMk||jalSch){ sauve(); lire(); }
  tirSch=null; tirMk=null; jalSch=null; VBfige=null; reglages(); });
