/* ═══ (p8-2) LES SCHÉMAS — LE MOTEUR DE L'ANCIEN DÉROULÉ, REPRIS À PART SOUS LE PRÉFIXE p8 ═══
   Source : AT_DR_B64 d'index.html de production (base c9bc2d9), décodé : schLignes, schemaHTML, carte, frise, arbre, cycle, grille,
   mesure, cle, separe, surface, dessine, SCH_COUL / COUL, et la préhension (tirSch, jalSch, repeintSch, le mousedown sur g.n / g.jal).
   Chaque écart avec l'ancien code est écrit dans la NOTE de p8-2, avec la ligne du tableau des télescopages qui le justifie (T1 à T7). */
var P8_SCH_COUL = ['#7b1113','#e8484c','#d64fd6','#4a1258','#6f4fd8','#2f6fe0','#25c8a5','#5bc236','#c99a4e','#8a7a5a'];
var P8_COUL = ["#7b1113","#e8484c","#d64fd6","#4a1258","#6f4fd8","#2f6fe0","#25c8a5","#5bc236","#c99a4e","#8a7a5a"];
var P8_POLICE = 'EB Garamond,Garamond,serif';
var P8_MEMO = {}, P8_MESURES = {};
function p8Lignes(b){ return String(b.src||'').split('\n').map(function(s){return s.replace(/\s+$/,'');}).filter(function(s){return s.trim();}); }
/* l'ancien schEch : la même réglette, lue sur le cran de « Texte au tableau » ; elle ne donne plus que la géométrie (rayons, écarts), jamais la police (T1) */
function p8Ech(pt){ var k=pt/32; return Math.max(0.6,Math.min(2.4, k*1.35)); }
function p8Cle(txt){ return 'k'+String(txt).replace(/[^a-zA-Z0-9À-ÿ]/g,'').slice(0,24); }
/* T4 : la boîte réelle du texte rendu (mesurée dans un SVG caché, même police), plus les marges de l'ancien mesure() */
function p8Mesure(txt,fs,poids,u,parts){
  var ps=parts||[{t:String(txt),fs:fs}], cle0=poids+'|'+ps.map(function(p){return p.fs.toFixed(2)+':'+p.t;}).join('|'), l=P8_MESURES[cle0];
  if(l===undefined){
    var d=document, NS='http://www.w3.org/2000/svg', sv=d.getElementById('p8-mesureur');
    if(!sv){ sv=d.createElementNS(NS,'svg'); sv.setAttribute('id','p8-mesureur'); sv.setAttribute('aria-hidden','true'); sv.setAttribute('style','position:fixed;left:-10000px;top:0;width:10px;height:10px;visibility:hidden;pointer-events:none'); d.body.appendChild(sv); }
    var t=d.createElementNS(NS,'text'); t.setAttribute('font-family',P8_POLICE); t.setAttribute('font-weight',poids);
    ps.forEach(function(p){ var s=d.createElementNS(NS,'tspan'); s.setAttribute('font-size',p.fs); s.textContent=p.t; t.appendChild(s); });
    sv.appendChild(t); l=t.getComputedTextLength(); sv.removeChild(t); P8_MESURES[cle0]=l;
  }
  var fsMax=Math.max.apply(null,ps.map(function(p){return p.fs;}));
  return {w:Math.max(52*u,l)+14*u, h:fsMax*2.1};
}
/* T5 : la place qu'une bulle a encore dans le cadre, dans une direction (une bulle placée à la main ne bouge pas) */
function p8Place(n,axe,sens,W,H,u){ if(n.fixe)return 0; if(axe==='x')return Math.max(0,sens>0?(W-n.w/2-4*u)-n.x:n.x-(n.w/2+4*u)); return Math.max(0,sens>0?(H-n.h/2-4*u)-n.y:n.y-(n.h/2+4*u)); }
function p8Separe(N,W,H,marge,u){
  if(false)return N;    /* pendant qu'on tire, rien ne bouge tout seul */
  marge=marge||6*u;
  for(var pas=0;pas<600;pas++){
    var bouge=false;
    for(var a=0;a<N.length;a++)for(var b=a+1;b<N.length;b++){
      var A=N[a],B=N[b];
      var dx=B.x-A.x, dy=B.y-A.y;
      var ox=(A.w+B.w)/2+marge-Math.abs(dx), oy=(A.h+B.h)/2+marge-Math.abs(dy);
      if(ox>0&&oy>0){
        bouge=true;
        if(A.fixe&&B.fixe)continue;          /* deux boîtes fixées par Paul : on ne touche à rien */
        /* T5 : le cadre visible est une limite ; une poussée que le cadre bloque passe sur l'autre axe, s'il a la place */
        var sx=(dx>=0?1:-1), sy=(dy>=0?1:-1);
        var placeX=p8Place(A,'x',-sx,W,H,u)+p8Place(B,'x',sx,W,H,u), placeY=p8Place(A,'y',-sy,W,H,u)+p8Place(B,'y',sy,W,H,u);
        var surX=(ox<oy)?(placeX>=ox||placeY<oy):!(placeY>=oy||placeX<ox);
        if(surX){ var s=(dx>=0?1:-1)*ox/2;
          if(!A.fixe)A.x-=s; if(!B.fixe)B.x+=s;
          if(A.fixe&&!B.fixe)B.x+=s; if(B.fixe&&!A.fixe)A.x-=s;
        } else { var t=(dy>=0?1:-1)*oy/2;
          if(!A.fixe)A.y-=t; if(!B.fixe)B.y+=t;
          if(A.fixe&&!B.fixe)B.y+=t; if(B.fixe&&!A.fixe)A.y-=t;
        }
      }
    }
    N.forEach(function(n){ if(n.fixe)return;
      n.x=Math.max(n.w/2+4*u,Math.min(W-n.w/2-4*u,n.x));
      n.y=Math.max(n.h/2+4*u,Math.min(H-n.h/2-4*u,n.y)); });
    if(!bouge)break;
  }
  /* dernier recours, RÉPÉTÉ jusqu'à ce que plus rien ne se touche : on descend la plus basse —
     T5 : sans jamais sortir du cadre visible ; ce qui se touche encore, la mesure le dit (« trop dense ») */
  for(var tour=0;tour<80;tour++){
    var reste=false;
    for(var a2=0;a2<N.length;a2++)for(var b2=a2+1;b2<N.length;b2++){
      var A2=N[a2],B2=N[b2];
      if(A2.fixe&&B2.fixe)continue;
      var ox2=(A2.w+B2.w)/2+marge-Math.abs(B2.x-A2.x), oy2=(A2.h+B2.h)/2+marge-Math.abs(B2.y-A2.y);
      if(ox2>0&&oy2>0){ var c=(A2.y>=B2.y?A2:B2); if(c.fixe)c=(c===A2?B2:A2);
        if(!c.fixe){ var y2=Math.min(H-c.h/2-4*u, c.y+oy2+3*u); if(y2>c.y+0.5){ c.y=y2; reste=true; }
          else { /* T5 : le cadre l'arrête en bas — elle part sur le côté qui a de la place (jamais hors du cadre) */
            var o=(c===A2?B2:A2), sens=(c.x>=o.x?1:-1); if(p8Place(c,'x',sens,W,H,u)<1)sens=-sens;
            var x2=Math.max(c.w/2+4*u,Math.min(W-c.w/2-4*u,c.x+sens*(ox2+3*u))); if(Math.abs(x2-c.x)>0.5){ c.x=x2; reste=true; } } } }
    }
    if(!reste)break;
  }
  return N;
}
/* T2 : la place est calculée sur le schéma entier ; ce qui n'est pas encore dévoilé porte « p8-pas » (pâle au pilote, absent au tableau) */
function p8Cls(c,k){ if(k==null||k<0)return ''; return (k>=c.vu?' p8-pas':'')+(c.flash===k?' spot-on':''); }
function p8Dessine(n,c){
  var u=c.u, aide=c.atelier?'<title>Tire pour la placer ; elle gardera cette place. Si tu renommes la notion, elle reprendra une place calculée.</title>':'';
  var txt=n.parts ? n.parts.map(function(p){ return '<tspan font-size="'+p.fs.toFixed(2)+'"'+(p.b?' font-weight="700"':'')+'>'+esc(p.t)+'</tspan>'; }).join('') : esc(n.t);
  /* T2 : sous la bulle, un fond opaque — pâle au pilote, elle cache quand même les traits qui passent dessous */
  return '<g class="p8-n'+(n.fixe?' p8-bouge':'')+p8Cls(c,n.k)+'" data-k="'+p8Cle(n.t)+'">'+aide
    +'<rect class="p8-fond" x="'+(n.x-n.w/2).toFixed(2)+'" y="'+(n.y-n.h/2).toFixed(2)+'" width="'+n.w.toFixed(2)+'" height="'+n.h.toFixed(2)+'" rx="'+(n.h/3).toFixed(2)+'" fill="#fff" stroke="none"/>'
    +'<rect x="'+(n.x-n.w/2).toFixed(2)+'" y="'+(n.y-n.h/2).toFixed(2)+'" width="'+n.w.toFixed(2)+'" height="'+n.h.toFixed(2)+'" rx="'+(n.h/3).toFixed(2)+'" '
    +'fill="'+(n.clair?'#fff':n.c)+'" stroke="'+(n.noyau?'#b01414':n.c)+'" stroke-width="'+((n.noyau?3:1.6)*u).toFixed(2)+'"/>'
    +'<text x="'+n.x.toFixed(2)+'" y="'+(n.y+n.fs*0.36).toFixed(2)+'" text-anchor="middle" font-family="'+P8_POLICE+'" '
    +'font-size="'+n.fs.toFixed(2)+'" font-weight="'+(n.noyau?700:600)+'" fill="'+(n.clair?'#1c1c1c':'#fff')+'">'+txt+'</text></g>';
}
function p8Trait(x1,y1,x2,y2,coul,larg,opac,k,a,b,c){ return '<line class="p8-l'+p8Cls(c,k)+'" data-a="'+(a?p8Cle(a.t):'')+'" data-b="'+(b?p8Cle(b.t):'')+'" x1="'+x1.toFixed(2)+'" y1="'+y1.toFixed(2)+'" x2="'+x2.toFixed(2)+'" y2="'+y2.toFixed(2)+'" stroke="'+coul+'" stroke-width="'+larg.toFixed(2)+'" opacity="'+opac+'"/>'; }
function p8Svg(c,s){ return '<svg class="p8-svg" data-w="'+c.W+'" data-h="'+c.H+'" viewBox="0 0 '+c.W+' '+c.H+'" preserveAspectRatio="none">'+s+'</svg>'; }
function p8Carte(L,c){
  var fam=L.map(function(s){ var p=s.split(':');
    return {nom:(p[0]||'').trim(), membres:(p[1]||'').split(',').map(function(x){return x.trim();}).filter(Boolean)}; })
    .filter(function(f){return f.nom;});
  var e=c.e, u=c.u, W=1000,H=560,cx=W/2,cy=H/2;
  var R=Math.min(W,H)*(0.30+0.03*e), r2=Math.min(W,H)*(0.47+0.04*e);
  var fsT=c.fsT, fsF=c.fsT, fsM=c.fsN;   /* T1 : 32 pt le centre et les familles, 26 pt les notions (la loi de la maquette) */
  var tit=c.titre||'—';
  var N=[], liens=[], k=0;
  function pousse(txt,x,y,fs,col,clair,noyau,kk){
    var m=p8Mesure(txt,fs,noyau?700:600,u), p=(c.pos||{})[p8Cle(txt)];
    var n={t:txt,x:(p?p.x:x)*c.sx,y:(p?p.y:y)*c.sy,w:m.w,h:m.h,fs:fs,c:col,clair:clair,noyau:noyau,fixe:!!p,k:kk};
    N.push(n); return n;
  }
  var nc=pousse(tit,cx,cy,fsT,'#b01414',false,true,-1);
  fam.forEach(function(f,kf){
    var a=(-Math.PI/2)+(2*Math.PI*kf/fam.length), col=P8_SCH_COUL[kf%P8_COUL.length];
    var nf=pousse(f.nom, cx+Math.cos(a)*R, cy+Math.sin(a)*R, fsF, col, false, false, k++);
    liens.push({a:nc,b:nf,c:col,w:5});
    f.membres.forEach(function(m,j){
      var sp=Math.min(0.34,1.15/Math.max(1,f.membres.length));
      var a2=a+(j-(f.membres.length-1)/2)*sp;
      var nm=pousse(m, cx+Math.cos(a2)*r2, cy+Math.sin(a2)*r2, fsM, col, true, false, k++);
      liens.push({a:nf,b:nm,c:col,w:1.6});
    });
  });
  p8Separe(N,c.W,c.H,7*e*u,u);
  var s='';
  liens.forEach(function(l){ s+=p8Trait(l.a.x,l.a.y,l.b.x,l.b.y,l.c,l.w*u,(l.w>3?1:.75),l.b.k,l.a,l.b,c); });
  N.forEach(function(n){ s+=p8Dessine(n,c); });
  return p8Svg(c,s);
}
function p8Frise(L,c){
  var e=c.e, u=c.u, W=c.W, H=c.H;
  var pts=L.map(function(s,i){ var p=s.split(':'); if(p.length<2)p=s.split('=');   /* T9 : la frise des feuilles écrit « date = événement » */
    return {d:parseInt((p[0]||'').replace(/\D/g,''),10), t:(p[1]||'').trim(), i:i}; })
    .filter(function(p){return !isNaN(p.d);});
  if(!pts.length)return '';        /* rien à montrer : jamais de consigne d'auteur au tableau */
  var min=Math.min.apply(null,pts.map(function(p){return p.d;})),
      max=Math.max.apply(null,pts.map(function(p){return p.d;}));
  var yL=H/2, N=[];
  pts.forEach(function(p,k){
    var x=(max===min)?W/2:(((p.d-min)/(max-min))*(W*0.86)+W*0.07);
    var alt=(k%2)?1:-1;
    var parts=[{t:String(p.d),fs:c.fsT,b:1},{t:' · '+p.t,fs:c.fsN}];   /* T1 : la date en 32 pt, l'événement en 26 pt */
    var m=p8Mesure(p.d+' · '+p.t,c.fsT,600,u,parts), pos=(c.pos||{})[p8Cle(p.d+p.t)];
    N.push({t:p.d+' · '+p.t, parts:parts, jalonX:x, x:pos?pos.x*c.sx:x, y:pos?pos.y*c.sy:yL+alt*(58*e*u+m.h/2),
            w:m.w, h:m.h, fs:c.fsT, c:P8_SCH_COUL[k%P8_COUL.length], clair:true, noyau:false, fixe:!!pos, cleFrise:p8Cle(p.d+p.t), k:p.i});
  });
  p8Separe(N,W,H,9*e*u,u);
  var s='<line class="p8-l" data-a="" data-b="" x1="'+(W*0.04)+'" y1="'+yL+'" x2="'+(W*0.96)+'" y2="'+yL+'" stroke="#d9cdb4" stroke-width="'+(4*e*u).toFixed(2)+'"/>';
  N.forEach(function(n,k){
    s+=p8Trait(n.jalonX,yL,n.x,n.y,n.c,1.4*u,.6,n.k,null,n,c);
    s+='<g class="p8-jal'+p8Cls(c,n.k)+'" data-i="'+k+'" data-min="'+min+'" data-max="'+max+'" data-w="'+W+'">'+(c.atelier?'<title>Tire ce point pour changer sa date.</title>':'')
      +'<circle cx="'+n.jalonX+'" cy="'+yL+'" r="'+(13*e*u).toFixed(2)+'" fill="transparent"/>'
      +'<circle cx="'+n.jalonX+'" cy="'+yL+'" r="'+(7*e*u).toFixed(2)+'" fill="'+n.c+'" stroke="#fff" stroke-width="'+(2.5*e*u).toFixed(2)+'"/>'
      +'</g>';
  });
  N.forEach(function(n){ s+=p8Dessine(n,c); });
  return p8Svg(c,s);
}
/* ── ARBRE : profondeur déduite de l'indentation ── */
function p8Arbre(L,c){
  var e=c.e, u=c.u, W=1000,H=560, noeuds=L.map(function(s,k){ var d=(s.match(/^ */)||[''])[0].length/2; return {d:d,t:s.trim(),k:k}; });
  var parNiv={}; noeuds.forEach(function(n){ (parNiv[n.d]=parNiv[n.d]||[]).push(n); });
  var maxD=Math.max.apply(null,noeuds.map(function(n){return n.d;}));
  noeuds.forEach(function(n){
    var rang=parNiv[n.d].indexOf(n), tot=parNiv[n.d].length;
    n.fs=n.d?c.fsN:c.fsT; var m=p8Mesure(n.t,n.fs,n.d?600:700,u); n.w=m.w; n.h=m.h;   /* T1 : les nœuds de tête en 32 pt, les autres en 26 pt */
    var p=(c.pos||{})[p8Cle(n.t)];
    n.x=(p?p.x:(rang+1)/(tot+1)*W)*c.sx; n.y=(p?p.y:60+n.d*(H-110)/Math.max(1,maxD))*c.sy; n.fixe=!!p;
  });
  p8Separe(noeuds,c.W,c.H,7*e*u,u);
  var s='';
  noeuds.forEach(function(n,k){
    if(!n.d)return;
    for(var j=k-1;j>=0;j--){ if(noeuds[j].d===n.d-1){
      var P=noeuds[j];
      s+='<path class="p8-l'+p8Cls(c,n.k)+'" data-a="'+p8Cle(P.t)+'" data-b="'+p8Cle(n.t)+'" d="M'+P.x.toFixed(2)+' '+(P.y+14*u).toFixed(2)+' C'+P.x.toFixed(2)+' '+((P.y+n.y)/2).toFixed(2)+' '
        +n.x.toFixed(2)+' '+((P.y+n.y)/2).toFixed(2)+' '+n.x.toFixed(2)+' '+(n.y-14*u).toFixed(2)+'" fill="none" stroke="#c9b79a" stroke-width="'+(2*u).toFixed(2)+'"/>';
      break; } }
  });
  noeuds.forEach(function(n){ n.c=P8_SCH_COUL[n.d%P8_COUL.length]; n.clair=n.d>1; n.noyau=!n.d; s+=p8Dessine(n,c); });
  return p8Svg(c,s);
}
/* ── CYCLE : étapes réparties sur un cercle ── */
function p8Cycle(L,c){
  var e=c.e, u=c.u, W=1000,H=560,cx=W/2,cy=H/2,R=Math.min(W,H)*(0.30+0.035*e);
  var N=L.map(function(t,k){ var a=(-Math.PI/2)+2*Math.PI*k/L.length, fs=c.fsN, m=p8Mesure(t,fs,600,u), p=(c.pos||{})[p8Cle(t)];   /* T1 : les étapes en 26 pt */
    return {t:t,x:(p?p.x:cx+Math.cos(a)*R)*c.sx,y:(p?p.y:cy+Math.sin(a)*R)*c.sy,w:m.w,h:m.h,fs:fs,
            c:P8_SCH_COUL[k%P8_COUL.length],clair:false,noyau:false,fixe:!!p,k:k}; });
  p8Separe(N,c.W,c.H,9*e*u,u);
  /* la flèche s'arrête AU BORD de la boîte visée : sa pointe n'est jamais recouverte */
  function bord(de,vers){
    var dx=de.x-vers.x, dy=de.y-vers.y, l=Math.hypot(dx,dy)||1; dx/=l; dy/=l;
    var tx=dx!==0 ? (vers.w/2+6*u)/Math.abs(dx) : 1e9;
    var ty=dy!==0 ? (vers.h/2+6*u)/Math.abs(dy) : 1e9;
    var t=Math.min(tx,ty);
    return {x:vers.x+dx*t, y:vers.y+dy*t};
  }
  var cxp=cx*c.sx, cyp=cy*c.sy;
  var s='<defs><marker id="p8-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="'+(5*e)
   +'" markerHeight="'+(5*e)+'" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#8a7a5a"/></marker></defs>';
  N.forEach(function(n,k){
    var m=N[(k+1)%N.length];
    var d=bord(m,n), f=bord(n,m);
    var mx=(d.x+f.x)/2, my=(d.y+f.y)/2;
    var vx=cxp-mx, vy=cyp-my, l=Math.hypot(vx,vy)||1;
    var qx=mx-vx/l*26*e*u, qy=my-vy/l*26*e*u;            /* légère courbure vers l'extérieur */
    var kk=((k+1)%N.length===0)?N.length-1:k+1;          /* T2 : la flèche paraît avec l'étape qu'elle atteint (la dernière referme le cycle) */
    s+='<path class="p8-l'+p8Cls(c,kk)+'" data-a="'+p8Cle(n.t)+'" data-b="'+p8Cle(m.t)+'" d="M'+d.x.toFixed(2)+' '+d.y.toFixed(2)+' Q'+qx.toFixed(2)+' '+qy.toFixed(2)+' '+f.x.toFixed(2)+' '+f.y.toFixed(2)+'" fill="none" stroke="'+n.c
      +'" stroke-width="'+(3*e*u).toFixed(2)+'" marker-end="url(#p8-fl)" opacity=".85"/>';
  });
  N.forEach(function(n){ s+=p8Dessine(n,c); });          /* les boîtes PAR-DESSUS les flèches */
  return p8Svg(c,s);
}
/* ── TABLEAU ── */
function p8Grille(L,c){
  if(!L.length)return '';
  var t='<table class="p8-grille"><tr class="p8-r'+p8Cls(c,0)+'">'+L[0].split('|').map(function(x){return '<th style="font-size:'+c.fsT.toFixed(2)+'px">'+esc(x.trim())+'</th>';}).join('')+'</tr>';
  L.slice(1).forEach(function(l,i){ t+='<tr class="p8-r'+p8Cls(c,i+1)+'">'+l.split('|').map(function(x){return '<td style="font-size:'+c.fsN.toFixed(2)+'px">'+esc(x.trim())+'</td>';}).join('')+'</tr>'; });
  return t+'</table>';
}
/* T3 : la source n'est jamais coupée au dévoilé (b.vues n'est pas repris) ; le dévoilement passe par le compteur de la maquette (c.vu) */
function p8SchemaHTML(b,c){
  var L=p8Lignes(b), t=b.forme||'carte';
  if(t==='carte')return p8Carte(L,c);
  if(t==='frise')return p8Frise(L,c);
  if(t==='arbre')return p8Arbre(L,c);
  if(t==='cycle')return p8Cycle(L,c);
  if(t==='tableau')return p8Grille(L,c);
  return ''; }
/* ce qui se dévoile, bulle par bulle, dans l'ordre de la source (l'ancien elems) : réglé « Un à un » seulement ; « Tout ensemble » (et sans réglage) : rien, il paraît d'un coup */
function p8Elements(b){
  if(b.devoilerTout!==false)return [];
  var L=p8Lignes(b);
  if((b.forme||'carte')==='carte'){ var out=[]; L.forEach(function(s){ var p=s.split(':'); out.push((p[0]||'').trim()); (p[1]||'').split(',').map(function(x){return x.trim();}).filter(Boolean).forEach(function(m){ out.push(m); }); }); return out; }
  return L.map(function(s){ return s.trim(); });
}
/* T1 : les tailles viennent de la loi de la maquette (policePx) — 32 pt les titres, 26 pt les éléments, jamais moins à aucun cran */
function p8Contexte(b,W,H,hDiapo,cran,vu,flash,atelier,titre){
  var kc=Math.max(1,cran/32), fsT=policePx(hDiapo,32*kc), fsN=policePx(hDiapo,26*kc), e=p8Ech(cran);
  return {W:W,H:H,sx:W/1000,sy:H/560,e:e,u:fsN/(13*e),fsT:fsT,fsN:fsN,pos:b.pos||{},titre:titre,vu:vu,flash:flash,atelier:!!atelier};
}
function p8Dessin(b,W,H,hDiapo,cran,vu,flash,atelier,titre){
  if(!W||!H)return '';
  var cle0=JSON.stringify([b.forme||'carte',b.src||'',b.pos||{},titre,W,H,hDiapo,cran,vu,flash,!!atelier]);
  if(P8_MEMO[cle0]!==undefined)return P8_MEMO[cle0];
  if(Object.keys(P8_MEMO).length>300)P8_MEMO={};
  var h=p8SchemaHTML(b,p8Contexte(b,W,H,hDiapo,cran,vu,flash,atelier,titre)); P8_MEMO[cle0]=h; return h;
}
/* le dessin se pose dans la place « plein » réellement disponible (T6 : le repère 1000 × 560 y est étiré) ; mesurée après le rendu, reposée par le morph — rien n'est reconstruit si rien n'a changé */
function p8Poser(mur,et){
  var e=DATA.seances[et.si].ecrans[et.di]; if(!e)return;
  mur._p8=mur._p8||{};
  mur.querySelectorAll('.p8-dessin').forEach(function(z){
    var bi=+z.dataset.p8, b=e.blocs[bi]; if(!b||b.t!=='schema')return;
    var W=z.clientWidth, H=z.clientHeight; if(!W||!H)return;
    mur._p8[bi]={W:W,H:H};
    var h=p8Dessin(b,W,H,mur.clientHeight||616,TAILLES[et.taille].pt,+z.dataset.vu,z.dataset.fl===''?null:+z.dataset.fl,!!et.atelier,z.dataset.titre);
    if(z.dataset.wh!==W+'x'+H||z.innerHTML.length===0){ z.dataset.wh=W+'x'+H; }
    poserHtml(z,h);
  });
}
/* LA MESURE — une seule, pour les bancs et pour l'atelier (C13, tour 2 : les boîtes réelles, contre le cadre réellement visible) :
   les chevauchements (entre bulles, et avec les autres couches de la diapo), les bulles hors du cadre visible, les traits qui passent
   à travers un mot, les libellés sur deux lignes, les polices sous 26 pt. Ne compte que ce qui est affiché (au tableau, le non-dévoilé est absent). */
function p8MesureLisible(mur){
  var res={chevauchements:0,horsCadre:0,traits:0,deuxLignes:0,sousPlancher:0,total:0,blocs:{},details:[]};
  if(!mur)return res;
  var M=mur.getBoundingClientRect(); if(!M.height)return res;
  var ptDe=function(px){ return px/(M.height*0.056)*32; };
  var vu=function(el){ if(!el.getClientRects().length)return false; for(var x=el;x&&x!==mur;x=x.parentElement){ var cs=getComputedStyle(x); if(cs.display==='none'||cs.visibility==='hidden')return false; } return true; };
  var inter=function(a,b){ return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)); };
  mur.querySelectorAll('.p8-sch').forEach(function(sch){
    var z=sch.querySelector('.p8-dessin'); if(!z)return; var bi=sch.dataset.bloc;
    var r={chevauchements:0,horsCadre:0,traits:0,deuxLignes:0,sousPlancher:0,total:0,details:[]};
    var Z=z.getBoundingClientRect(), L0=Math.max(Z.left,M.left), T0=Math.max(Z.top,M.top), R0=Math.min(Z.right,M.right), B0=Math.min(Z.bottom,M.bottom);
    for(var x=z.parentElement;x&&x!==mur;x=x.parentElement){ var cs=getComputedStyle(x); if(cs.overflowX!=='visible'||cs.overflowY!=='visible'){ var q=x.getBoundingClientRect(); L0=Math.max(L0,q.left); T0=Math.max(T0,q.top); R0=Math.min(R0,q.right); B0=Math.min(B0,q.bottom); } }
    var V={left:L0,top:T0,right:R0,bottom:B0};
    var bulles=[].slice.call(z.querySelectorAll('g.p8-n')).filter(vu).map(function(g){ return {k:g.dataset.k,nom:g.querySelector('text').textContent.trim().slice(0,40),r:g.querySelector('rect').getBoundingClientRect(),tr:g.querySelector('text').getBoundingClientRect(),texte:g.querySelector('text')}; });
    var cases=[].slice.call(z.querySelectorAll('.p8-grille th, .p8-grille td')).filter(vu).map(function(td){ return {k:'',nom:td.textContent.trim().slice(0,40),r:td.getBoundingClientRect(),tr:td.getBoundingClientRect(),cel:td}; });
    for(var i=0;i<bulles.length;i++)for(var j=i+1;j<bulles.length;j++)if(inter(bulles[i].r,bulles[j].r)>1){ r.chevauchements++; r.details.push('chevauchement : '+bulles[i].nom+' × '+bulles[j].nom); }
    var couches=[].slice.call(mur.querySelectorAll('*')).filter(function(x){ return !z.contains(x)&&!x.contains(z)&&!(x.closest&&x.closest('.alertes-diapo, .bloc-barre'))&&[].some.call(x.childNodes,function(n){return n.nodeType===3&&n.textContent.trim();})&&vu(x); }).map(function(x){ return {nom:x.textContent.trim().slice(0,30),r:x.getBoundingClientRect()}; });
    var toutes=bulles.concat(cases);
    if(cases.length){ var tb=z.querySelector('.p8-grille'); if(tb&&vu(tb))toutes.push({nom:'le tableau',r:tb.getBoundingClientRect(),tr:tb.getBoundingClientRect()}); }
    toutes.forEach(function(b){ couches.forEach(function(k){ if(inter(b.r,k.r)>1){ r.chevauchements++; r.details.push('chevauchement avec la diapo : '+b.nom+' × '+k.nom); } });
      if(b.r.left<V.left-0.5||b.r.right>V.right+0.5||b.r.top<V.top-0.5||b.r.bottom>V.bottom+0.5){ r.horsCadre++; r.details.push('hors du cadre visible : '+b.nom); } });
    /* une bulle de tableau compte une fois de trop si on garde aussi la table entière : la table ne sert qu'aux couches et au cadre */
    if(cases.length){ r.horsCadre=Math.min(r.horsCadre,cases.filter(function(b){ return b.r.left<V.left-0.5||b.r.right>V.right+0.5||b.r.top<V.top-0.5||b.r.bottom>V.bottom+0.5; }).length||(r.horsCadre?1:0)); }
    [].slice.call(z.querySelectorAll('.p8-l')).filter(vu).forEach(function(l){
      var ctm=l.getScreenCTM(), lg=l.getTotalLength(); if(!ctm||!lg)return; var a=l.dataset.a, b2=l.dataset.b, vus={};
      for(var s=1;s<60;s++){ var P=l.getPointAtLength(lg*s/60), X=ctm.a*P.x+ctm.c*P.y+ctm.e, Y=ctm.b*P.x+ctm.d*P.y+ctm.f;
        bulles.forEach(function(bb){ if(bb.k===a||bb.k===b2||vus[bb.k])return; if(X>bb.tr.left+1&&X<bb.tr.right-1&&Y>bb.tr.top+1&&Y<bb.tr.bottom-1){ vus[bb.k]=1; r.traits++; r.details.push('trait à travers : '+bb.nom); } }); }
    });
    cases.forEach(function(cl){ var rg=document.createRange(); rg.selectNodeContents(cl.cel); var tops={}; [].forEach.call(rg.getClientRects(),function(q){ if(q.width>1)tops[Math.round(q.top)]=1; }); if(Object.keys(tops).length>1){ r.deuxLignes++; r.details.push('sur deux lignes : '+cl.nom); }
      var px=parseFloat(getComputedStyle(cl.cel).fontSize)*(M.height/(mur.offsetHeight||M.height)); if(ptDe(px)<25.9){ r.sousPlancher++; r.details.push('sous 26 pt : '+cl.nom+' ('+ptDe(px).toFixed(1)+' pt)'); } });
    bulles.forEach(function(bb){ var t=bb.texte, ctm=t.getScreenCTM(); var tailles=[].slice.call(t.querySelectorAll('tspan')).map(function(s){return +s.getAttribute('font-size');}); if(!tailles.length)tailles=[+t.getAttribute('font-size')];
      var mi=Math.min.apply(null,tailles)*(ctm?Math.hypot(ctm.a,ctm.b):1); if(ptDe(mi)<25.9){ r.sousPlancher++; r.details.push('sous 26 pt : '+bb.nom+' ('+ptDe(mi).toFixed(1)+' pt)'); }
      var rg=document.createRange(); rg.selectNodeContents(t); var tops={}; [].forEach.call(t.getClientRects(),function(q){ if(q.width>1)tops[Math.round(q.top)]=1; }); if(Object.keys(tops).length>1){ r.deuxLignes++; r.details.push('sur deux lignes : '+bb.nom); } });
    r.total=r.chevauchements+r.horsCadre+r.traits+r.deuxLignes+r.sousPlancher; r.bulles=bulles.length+cases.length;
    res.blocs[bi]=r; ['chevauchements','horsCadre','traits','deuxLignes','sousPlancher','total'].forEach(function(q){ res[q]+=r[q]; }); res.details=res.details.concat(r.details);
  });
  return res;
}
