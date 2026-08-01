
// ── 12. Zone prompt IA : composition, persistance, validation, injection (v1.4.0) ──
//   EXTRAIT des quatre chaînes existantes, pas inventé :
//   · la composition en pièces assemblées à la volée vient de correction_dictee
//     (assemblePrompt(directives, format)) — le cadrage change souvent, le format jamais ;
//   · l'interpolation par jetons {{…}} vient d'elle aussi ({{JSON_DICTEE}}) ;
//   · le vocabulaire GÉNÉRÉ depuis une source vient de l'atelier du site (SITE-COURS-2a) :
//     une entrée ajoutée à la source y paraît sans qu'aucune liste soit retouchée ;
//   · le cadrage imposé (« NE PRODUIS AUCUN JSON TOUT DE SUITE… ») vient de worktrack ;
//   · les trois exigences de validation RATTRAPENT ce qu'aucune app ne fait entièrement :
//     l'élément fautif CITÉ, le message qui dit QUOI CORRIGER, les refus qui S'ACCUMULENT ;
//   · l'archive-avant-écrasement n'est dans AUCUNE des quatre : elle vient du chantier
//     (M-SÉCU-3/-4, atCorbeilleCle) et le canon la rend disponible à toutes.
//   NOTE DE NUMÉROTATION : ce canon porte DEUX sections « 8 » (Manifeste, Session partagée)
//   et n'a PAS de §10. Rien n'est renuméroté ici — la dette est signalée, pas rangée.

var MJPC_PROMPT_CADRAGE =
  "NE PRODUIS AUCUN JSON TOUT DE SUITE.\n"+
  "Commence par une discussion de cadrage, un point \u00e0 la fois. Proc\u00e8de par allers-retours : "+
  "reformule, propose, mais attends mes validations.\n"+
  "QUAND, ET SEULEMENT QUAND, JE TE DIS \u00ab produis le JSON \u00bb, tu produis le r\u00e9sultat SEUL, "+
  "sans commentaire ni texte autour, sans balises de code.";

/* Le vocabulaire, GÉNÉRÉ depuis une source fournie par l'app (jamais écrit à la main).
   source : { id: { libelle, champs:[{k,l,kind}], reserve, groupe, note } }
   options : { titre, groupes:{cle:'Libellé'}, exclureReserve (défaut true) } */
function mjpcPromptVocabulaire(source, options){
  var o=options||{};
  var exclure=(o.exclureReserve===undefined)?true:!!o.exclureReserve;
  var groupes=o.groupes||null;
  var par={},ordre=[];
  Object.keys(source||{}).forEach(function(id){
    var e=source[id]||{};
    if(exclure&&e.reserve)return;
    var g=e.groupe||'';
    if(!par[g]){par[g]=[];ordre.push(g);}
    par[g].push({id:id,e:e});
  });
  var out=[];
  if(o.titre)out.push(o.titre);
  var cles=groupes?Object.keys(groupes).filter(function(g){return par[g]&&par[g].length;}):ordre;
  cles.forEach(function(g){
    if(g&&groupes&&groupes[g])out.push('### '+groupes[g]);
    else if(g)out.push('### '+g);
    (par[g]||[]).forEach(function(x){
      var e=x.e;var l='- '+x.id+(e.libelle?(' : '+e.libelle):'');
      if(e.note)l+=' ['+e.note+']';
      var ch=e.champs||[];
      if(ch.length){
        l+=' \u2192 champs : '+ch.map(function(f){
          var t=(f.kind==='list')?'liste de lignes':((f.kind==='area')?'texte long':((f.kind==='date')?'date AAAA-MM-JJ':'texte court'));
          return f.k+(f.l?(' ('+f.l+', '+t+')'):(' ('+t+')'));
        }).join(', ');
      }
      out.push(l);
    });
  });
  return out.join('\n');
}
/* L'assemblage à la volée. pieces : {directives, vocabulaire, format, donnees:{JETON:valeur}}
   Les jetons {{NOM}} sont remplacés en dernier, dans le texte entier. */
function mjpcPromptComposer(pieces){
  var p=pieces||{};
  var bouts=[];
  if(p.directives)bouts.push(p.directives);
  if(p.cadrage!==false)bouts.push(MJPC_PROMPT_CADRAGE);
  if(p.format)bouts.push(p.format);
  if(p.vocabulaire)bouts.push(p.vocabulaire);
  var t=bouts.join("\n\n");
  var d=p.donnees||{};
  Object.keys(d).forEach(function(k){
    t=t.split('{{'+k+'}}').join(d[k]==null?'':String(d[k]));
  });
  return t;
}
/* La persistance : chemin par app ET par produit, défaut en dur qui fait foi si la base
   est muette. Lecture REST (le mode test de l'app la court-circuite si elle en a un). */
function mjpcPromptChemin(app,produit,piece){
  return '/'+String(app)+'_prompts/'+String(produit)+'/'+String(piece);
}
function mjpcPromptCharger(base,app,produit,defauts,cb){
  var pieces=Object.keys(defauts||{});
  var res={},reste=pieces.length;
  if(!reste){cb({});return;}
  pieces.forEach(function(piece){
    var url=String(base)+mjpcPromptChemin(app,produit,piece)+'.json';
    var fini=function(v){
      res[piece]=(typeof v==='string'&&v.length)?v:defauts[piece];   /* la base, sinon le défaut */
      if(--reste===0)cb(res);
    };
    try{
      fetch(url).then(function(r){return r.ok?r.json():null;}).then(fini,function(){fini(null);});
    }catch(e){fini(null);}
  });
}
/* L'écriture passe par les verdicts du socle (§9) : trois issues, jamais un succès supposé. */
function mjpcPromptEnregistrer(base,app,produit,piece,texte,cb){
  /* mjpcEcrireRest rend UNE issue (cb(issue)) — le canon la traduit en (ok, issue)
     pour ses appelants : un verdict autre qu'ACCEPTEE n'est JAMAIS un succès. */
  mjpcEcrireRest(String(base)+mjpcPromptChemin(app,produit,piece)+'.json',
    {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(String(texte))},
    function(issue){cb(mjpcVerdictOk(issue),issue);});
}
/* Le verdict, lu d'UNE façon partout : accepté, ou pas. */
function mjpcVerdictOk(issue){
  return !!(issue&&issue.etat===MJPC_ISSUE.ACCEPTEE);
}

/* LA VALIDATION — un accumulateur. Les refus s'ADDITIONNENT, chacun CITE l'élément
   fautif et dit QUOI CORRIGER. (validateChapter et validateItems s'arrêtent au premier ;
   validateDebatImport ne rend qu'un booléen : c'est ce que ceci remplace.) */
function mjpcValidation(max){
  var motifs=[],plafond=max||8;
  return {
    exige:function(condition,message){ if(!condition&&motifs.length<plafond)motifs.push(String(message)); return this; },
    cite:function(element,message){ if(motifs.length<plafond)motifs.push('\u00ab '+String(element)+' \u00bb '+String(message)); return this; },
    inconnu:function(element,ou,quoiFaire){
      if(motifs.length<plafond)motifs.push('\u00ab '+String(element)+' \u00bb'+(ou?(' ('+ou+')'):'')+' n\u2019existe pas'+(quoiFaire?(' \u2014 '+quoiFaire):'.'));
      return this;
    },
    ok:function(){ return motifs.length===0; },
    motifs:function(){ return motifs.slice(); },
    texte:function(){ return motifs.join('\n'); }
  };
}
/* L'INJECTION : archive AVANT s'il y a quelque chose à remplacer, ABANDON si l'archive
   échoue, écriture ensuite, verdict rendu. Rien n'écrit sans que l'appelant ait confirmé.
   opts : {base, chemin, donnees, ancien (null si rien à remplacer), cheminArchive, app} */
function mjpcInjecterAvecArchive(opts,cb){
  var o=opts||{};
  var ecrire=function(){
    mjpcEcrireRest(String(o.base)+o.chemin+'.json',
      {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(o.donnees)},
      function(issue){cb(mjpcVerdictOk(issue),issue,{archive:!!o.ancien});});
  };
  if(o.ancien==null){ecrire();return;}                 /* rien à remplacer : pas d'archive de rien */
  var ts=Date.now();
  var payload={_meta:{chemin:o.chemin,app:o.app||'',ts:ts},data:o.ancien};
  mjpcEcrireRest(String(o.base)+(o.cheminArchive||('/corbeille/'+String(o.app||'app')+'-'+ts))+'.json',
    {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)},
    function(issue){
      if(!mjpcVerdictOk(issue)){cb(false,issue,{archive:false,abandon:true});return;}   /* ABANDON : rien n'est remplacé */
      ecrire();
    });
}
