/* ══ ① IDENTITÉ DES OBJETS — amorce posée une fois, jamais recalculée ═══════
   L'id ne dit rien du contenu : il ne sert qu'à DÉSIGNER. On cherche par id
   stocké, jamais par formule. Aucun id ne contient de position. */

var EDT_FAMILLES={
  evenementsClasse:{prefixe:'evc:',forts:['niveau','debut','_lib'],classe:false},
  jalons:          {prefixe:'jal:',forts:['date','_lib'],          classe:false},
  etablissement:   {prefixe:'eta:',forts:['date','_lib'],          classe:false},
  feries:          {prefixe:'fer:',forts:['date'],                 classe:false,critereUnique:true},
  vacances:        {prefixe:'vac:',forts:['debut','fin'],          classe:false},
  creneauxGrille:  {prefixe:'crn:',forts:['jour','creneau','semaine','classe'],classe:true},
  creneauxHoraires:{prefixe:'hor:',forts:['debut','fin'],          classe:false},
  periodes:        {prefixe:'per:',forts:['_nom'],                 classe:false,critereUnique:true},
  photos:          {prefixe:'pho:',forts:[],                       classe:false,sansAppariement:true}
};

/* libellé normalisé : minuscules, accents retirés, espaces réduits, ponctuation ôtée */
function edtNormaliser(t){
  return String(t==null?'':t).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
}
/* condensé déterministe (FNV-1a 32 bits, base 36) — identique sur tous les
   appareils de Paul. Il ne sert QU'À LA POSE. */
function edtCondense(txt){
  var h=0x811c9dc5,s=String(txt);
  for(var i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=(h*0x01000193)>>>0; }
  return h.toString(36);
}
function edtValeurCritere(el,champ){
  if(champ==='_lib')return edtNormaliser(el&&(el.libelle||el.nom||el.titre));
  if(champ==='_nom')return edtNormaliser(el&&el.nom);
  return String((el&&el[champ])==null?'':el[champ]);
}
/* L'AMORCE — préfixe + condensé du contenu au moment de la pose,
   suffixé par la classe quand l'élément en dépend. */
function edtAmorce(famille,el,classe){
  var f=EDT_FAMILLES[famille]; if(!f)return null;
  if(famille==='photos')return f.prefixe+edtHorodatage(el);
  var base=f.forts.map(function(c){return edtValeurCritere(el,c);}).join('|');
  var a=f.prefixe+edtCondense(base);
  if(f.classe&&classe)a+=':'+edtNormaliser(classe);
  return a;
}
/* photo : horodatage complet à la seconde, jamais la seule date */
function edtHorodatage(el){
  var t=(el&&(el.quand||el.pose))||Date.now();
  return new Date(t).toISOString().replace(/[-:T]/g,'').slice(0,14);
}

/* POSE — un élément sans id en reçoit un à sa PREMIÈRE RENCONTRE.
   Un id existant n'est JAMAIS recalculé. Collision → #2, à la pose seulement.
   Rend {poses:n, collisions:[…]} ; ne touche à rien d'autre. */
function edtPoserIds(liste,famille,classe,dejaPris){
  var pris=dejaPris||{},poses=0,collisions=[];
  (liste||[]).forEach(function(el){
    if(!el||typeof el!=='object')return;
    if(el.id){ pris[el.id]=true; return; }
    var a=edtAmorce(famille,el,classe),id=a,n=1;
    while(pris[id]){ n++; id=a+'#'+n; }
    if(n>1)collisions.push({id:id,libelle:el.libelle||el.nom||'',rang:n});
    el.id=id; pris[id]=true; poses++;
  });
  return {poses:poses,collisions:collisions,pris:pris};
}

/* APPARIEMENT — quatre temps, dans cet ordre, et biunivoque.
   Rend {fort:[…], faible:[…], arrivent:[…], disparaissent:[…], ambigus:[…]}
   Le FAIBLE n'est jamais appliqué : il est PROPOSÉ. */
function edtApparier(entrants,existants,famille,classe){
  var f=EDT_FAMILLES[famille]||{forts:[]};
  var r={fort:[],faible:[],arrivent:[],disparaissent:[],ambigus:[]};
  if(f.sansAppariement){ r.arrivent=(entrants||[]).slice(); return r; }
  var libres=(existants||[]).slice(), pris=[];
  var parId={}; libres.forEach(function(e){ if(e&&e.id)parId[e.id]=e; });
  var reste=[];
  /* ① l'entrant porte un id connu → il fait foi */
  (entrants||[]).forEach(function(n){
    if(n&&n.id&&parId[n.id]&&pris.indexOf(parId[n.id])<0){
      r.fort.push({entrant:n,existant:parId[n.id],par:'id'}); pris.push(parId[n.id]);
    } else reste.push(n);
  });
  var dispo=function(){ return libres.filter(function(e){return pris.indexOf(e)<0;}); };
  var score=function(a,b){
    var n=0; f.forts.forEach(function(c){
      if(edtValeurCritere(a,c)===edtValeurCritere(b,c))n++; });
    return n;
  };
  /* ② FORT : tous les critères concordent, candidat unique */
  var apresFort=[];
  reste.forEach(function(n){
    var c=dispo().filter(function(e){return score(n,e)===f.forts.length;});
    if(c.length===1){ r.fort.push({entrant:n,existant:c[0],par:'fort'}); pris.push(c[0]); }
    else if(c.length>1){ r.ambigus.push({entrant:n,candidats:c.length,par:'fort'}); }
    else apresFort.push(n);
  });
  /* ③ FAIBLE : tous sauf un, au moins un qui concorde, candidat unique.
     Familles à critère unique : pas d'appariement faible. */
  apresFort.forEach(function(n){
    if(f.critereUnique||f.forts.length<2){ r.arrivent.push(n); return; }
    var c=dispo().filter(function(e){var s=score(n,e);return s===f.forts.length-1&&s>=1;});
    if(c.length===1){ r.faible.push({entrant:n,existant:c[0],par:'faible'}); pris.push(c[0]); }
    else if(c.length>1){ r.ambigus.push({entrant:n,candidats:c.length,par:'faible'}); }
    else r.arrivent.push(n);
  });
  r.disparaissent=dispo();
  return r;
}
