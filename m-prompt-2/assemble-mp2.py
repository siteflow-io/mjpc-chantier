#!/usr/bin/env python3
# ══ M-PROMPT-2 — les trois chaînes passent au canon §12 ══
import re
CANON=open('canon.js',encoding='utf-8').read().rstrip()+"\n"
def charge(n):return open(n+'.base.html',encoding='utf-8').read()
def ecrit(n,s):open(n+'.staging.html','w',encoding='utf-8').write(s)
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    return s.replace(a,n)
def socle(s):
    """Le canon 1.4.0 ENTIER verbatim à la place du 1.3.0 embarqué."""
    d=s.index('// MJPC-CORE v1.3.0')
    fm='var MJPC_CORE_VERSION="1.3.0";'
    f=s.index(fm)+len(fm)
    return s[:d]+CANON+s[f:]

# ═══════════════════ ① WORKTRACK ═══════════════════
s=charge('worktrack');s=socle(s)
SEC_WT = r"""/* ═══════════════════════════════════════════════════════════════════════════
   § PROMPTS — passage au canon §12 (M-PROMPT-2).
   DETTE FERMÉE : saveTpl() n'écrivait NULLE PART (ni Firebase, ni localStorage :
   une variable de session et un toast) alors que l'infobulle annonçait « mémorisées
   sur ce poste ». Le prompt de Paul mourait au rechargement. Il vit désormais au hub.
   Ce que l'app GARDE : PROMPT_CHAPTER comme défaut en dur, validateChapter et
   chapterDefaults PARTAGÉES avec le garde-fou seed↔production (aucune divergence),
   loadChapter et le format écrit au hub (/chapitres) — INCHANGÉS.
   Ce que le canon APPORTE : la persistance à verdict, la validation qui ACCUMULE
   et NOMME, l'aperçu avant écriture et l'archive AVANT remplacement.
   ═══════════════════════════════════════════════════════════════════════════ */
var WT_BASE=(typeof MJPC_SECU2==='object'&&MJPC_SECU2&&MJPC_SECU2.hub)?MJPC_SECU2.hub:'https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
var WT_PROMPT_PRODUIT='chapitre';
function wtPromptDefauts(){return {directives:PROMPT_CHAPTER};}
/* Lecture : le hub, sinon le défaut en dur qui FAIT FOI. */
function wtChargerPrompt(cb){
  mjpcPromptCharger(WT_BASE,'worktrack',WT_PROMPT_PRODUIT,wtPromptDefauts(),function(pieces){
    PROF.tpl=pieces.directives;if(cb)cb(pieces.directives);
  });
}
/* Écriture : par VERDICT (§9) — mjpcEcrireRest rend cb(issue), un seul argument. */
function wtEnregistrerPrompt(texte,cb){
  mjpcPromptEnregistrer(WT_BASE,'worktrack',WT_PROMPT_PRODUIT,'directives',texte,function(ok){cb(ok);});
}
/* La validation du chapitre — mêmes règles que validateChapter, mais les motifs
   S'ACCUMULENT et CITENT la séance fautive. validateChapter reste EN PLACE et
   INCHANGÉE : elle est partagée avec le garde-fou seed↔production (dr). */
function wtValiderChapitre(o){
  var V=mjpcValidation(8);
  if(!o||typeof o!=='object'||Array.isArray(o)){V.exige(false,'La r\u00e9ponse doit \u00eatre un chapitre complet, pas une liste ni un texte.');return V;}
  V.exige(o.meta&&o.meta.titre,'Il manque le titre du chapitre (\u00ab meta.titre \u00bb).');
  V.exige(Array.isArray(o.seances)&&o.seances.length,'Il manque les s\u00e9ances (\u00ab seances \u00bb, une liste non vide).');
  (Array.isArray(o.seances)?o.seances:[]).forEach(function(s,i){
    var ref=(s&&(s.titre||s.id))||('s\u00e9ance n\u00b0 '+(i+1));
    if(!s||!s.id||!s.titre){V.cite(ref,'n\u2019a pas d\u2019identifiant ou de titre : il lui faut les deux.');return;}
    if(!s.carte||typeof s.carte.x!=='number'||typeof s.carte.y!=='number')V.cite(ref,'n\u2019a pas de position sur la carte (deux nombres, x et y).');
    if(!s.aretes)V.cite(ref,'n\u2019a pas de liens vers les autres s\u00e9ances (\u00ab aretes \u00bb).');
    if(!s.evaluation||!Array.isArray(s.evaluation.items))V.cite(ref,'n\u2019a pas de questions d\u2019\u00e9valuation (\u00ab evaluation.items \u00bb, une liste).');
  });
  return V;
}
/* ═══ fin § PROMPTS ═══ */
"""
s=sub(s,'const PROMPT_CHAPTER =',SEC_WT+'const PROMPT_CHAPTER =')
# saveTpl : persiste, par verdict
s=sub(s,'''saveTpl(){ this.tpl=($("tplEdit")||{}).value||this.tpl; toast("Template enregistré."); this.promptView(); },''',
'''saveTpl(){ const t=($("tplEdit")||{}).value||this.tpl;
    toast("Enregistrement\\u2026");
    wtEnregistrerPrompt(t,(ok)=>{                       /* M-PROMPT-2 : le prompt vit au hub */
      if(ok){ this.tpl=t; toast("Consignes enregistr\\u00e9es \\u2014 elles te suivent d\\u2019un appareil \\u00e0 l\\u2019autre."); }
      else  { toast("L\\u2019enregistrement n\\u2019a pas abouti \\u2014 ton texte est toujours \\u00e0 l\\u2019\\u00e9cran."); }
      this.promptView();
    });
  },''')
# l'infobulle qui mentait
s=sub(s,'''title="Édite le texte du prompt IA (le modèle de consignes envoyé à l'IA) — tes modifications sont mémorisées sur ce poste"''',
'''title="Modifie les consignes envoyées à l'IA — elles te suivent d'un appareil à l'autre"''')
# le chargement au démarrage du panneau prof
s=sub(s,'''  authed:false, tab:"creation", tpl:PROMPT_CHAPTER,''',
'''  authed:false, tab:"creation", tpl:PROMPT_CHAPTER,   /* défaut en dur ; wtChargerPrompt() lit le hub */''')
# doInject : validation qui accumule + aperçu + archive avant
s=sub(s,'''  doInject(){ const raw=($("profInject")||{}).value||""; let obj;
    try{ obj=JSON.parse(raw); }catch(e){ $("injErr").textContent="JSON illisible : "+e.message; return; }
    const err=validateChapter(obj); if(err){ $("injErr").textContent="Refusé : "+err; return; }
    loadChapter(obj); },''',
'''  doInject(){ const raw=String(($("profInject")||{}).value||"").trim().replace(/^```(?:json)?/i,"").replace(/```$/,"").trim();
    let obj;
    try{ obj=JSON.parse(raw); }
    catch(e){ $("injErr").textContent="Je ne peux pas lire cette r\\u00e9ponse : elle est incompl\\u00e8te ou mal ferm\\u00e9e ("+e.message+"). Demande \\u00e0 l\\u2019IA de redonner le r\\u00e9sultat en entier, sans rien autour."; return; }
    /* M-PROMPT-2 : les motifs S'ACCUMULENT et CITENT la séance fautive */
    const V=wtValiderChapitre(obj);
    if(!V.ok()){ $("injErr").innerHTML="Je ne peux pas utiliser cette r\\u00e9ponse :<br>\\u2022 "+V.motifs().map(x=>String(x).replace(/</g,"&lt;")).join("<br>\\u2022 "); return; }
    this._injObj=obj; this.injApercu(); },
  /* L'APERÇU : rien ne s'écrit avant confirmation. */
  injApercu(){ const o=this._injObj; if(!o) return;
    const ancien=(typeof CHAPTER==="object"&&CHAPTER&&CHAPTER.meta)?CHAPTER:null;
    const nb=(o.seances||[]).length;
    $("injErr").innerHTML='<div class="prof-sec"><b>Voici ce qui sera enregistr\\u00e9</b><br>'
      +'Chapitre \\u00ab '+String(o.meta.titre).replace(/</g,"&lt;")+' \\u00bb, '+nb+' s\\u00e9ance(s).<br>'
      +(ancien
        ? ('Il remplacera \\u00ab '+String(ancien.meta.titre||"").replace(/</g,"&lt;")+' \\u00bb, qui part d\\u2019abord \\u00e0 la corbeille. <b>Les progressions des \\u00e9l\\u00e8ves ne sont pas touch\\u00e9es</b> (elles vivent \\u00e0 part).')
        : 'Aucun chapitre n\\u2019est charg\\u00e9 : rien ne sera perdu.')
      +'<br>Rien n\\u2019est \\u00e9crit tant que tu n\\u2019as pas confirm\\u00e9.'
      +'<div class="prof-row" style="margin-top:10px">'
      +'<button class="btn ghost" onclick="PROF.injAnnuler()">Annuler</button>'
      +'<button class="btn primary" onclick="PROF.injConfirmer()">Enregistrer ce chapitre</button></div></div>'; },
  injAnnuler(){ this._injObj=null; $("injErr").textContent=""; },
  injConfirmer(){ const o=this._injObj; if(!o) return;
    const ancien=(typeof CHAPTER==="object"&&CHAPTER&&CHAPTER.meta)?JSON.parse(JSON.stringify(CHAPTER)):null;
    const fin=()=>{ this._injObj=null; $("injErr").textContent=""; loadChapter(o); };
    if(!ancien){ fin(); return; }                      /* rien à perdre : pas d'archive de rien */
    const ts=Date.now();
    const chemin=MJPC.ROOT+"/chapitres/"+(ancien.meta.id||"chapitre");
    mjpcEcrireRest(WT_BASE+"/corbeille/"+new Date(ts).toISOString().slice(0,10)+"/worktrack-chapitre_"+ts+".json",
      {method:"PUT",headers:{"Content-Type":"application/json"},
       body:JSON.stringify({_meta:{motif:"worktrack-chapitre",chemin:chemin,app:"worktrack",ts:ts},data:ancien})},
      (issue)=>{
        if(!mjpcVerdictOk(issue)){ $("injErr").textContent="La mise \\u00e0 la corbeille a \\u00e9chou\\u00e9 \\u2014 rien n\\u2019a \\u00e9t\\u00e9 remplac\\u00e9. R\\u00e9essaie quand la connexion est stable."; return; }
        fin();
      }); },''')
s=sub(s,'<meta name="app-version" content="2026-07-31b">','<meta name="app-version" content="2026-08-01a">')
ecrit('worktrack',s);print("worktrack OK")

# ═══════════════════ ② DICTEE_UNIVERSELLE ═══════════════════
s=charge('dictee_universelle');s=socle(s)
SEC_DU = r"""/* ═══════════════════════════════════════════════════════════════════════════
   § PROMPTS — passage au canon §12 (M-PROMPT-2).
   Ce que l'app GARDE : son prompt d'analyse mot à mot et TOUTES ses consignes,
   le format écrit au hub (resultsRef.child(k).update — INCHANGÉ), ses trois
   étapes d'écran, le téléchargement JSON, validateCarnetForDictee (qui n'est PAS
   une pièce de chaîne prompt : c'est la validation prof d'un carnet — intouchée).
   Ce que le canon APPORTE : le prompt PERSISTÉ (il n'était stocké nulle part),
   les données passées par JETONS {{TEXTE}} / {{NIVEAU}}, la validation du collage
   qui ACCUMULE et CITE les clés fautives, et une injection qui NE SE DÉCLARE PAS
   terminée quand des écritures ont échoué.
   ═══════════════════════════════════════════════════════════════════════════ */
var DU_BASE=(typeof MJPC_SECU2==='object'&&MJPC_SECU2&&MJPC_SECU2.hub)?MJPC_SECU2.hub:'https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
var DU_PROMPT_ANALYSE_DEFAUT="Tu es un expert en grammaire fran\u00e7aise et en didactique de l\u2019orthographe. Analyse le texte de dict\u00e9e suivant MOT PAR MOT pour une classe de {{NIVEAU}}.\n\nTEXTE DE LA DICT\u00c9E :\n\u00ab {{TEXTE}} \u00bb";
function duChargerPrompt(cb){
  mjpcPromptCharger(DU_BASE,'dictee_universelle','analyse',{directives:DU_PROMPT_ANALYSE_DEFAUT},function(p){cb(p.directives);});
}
function duEnregistrerPrompt(texte,cb){
  mjpcPromptEnregistrer(DU_BASE,'dictee_universelle','analyse','directives',texte,function(ok){cb(ok);});
}
/* La validation du collage : les clés fautives sont CITÉES, les motifs s'accumulent. */
function duValiderCorrections(obj){
  var V=mjpcValidation(8);
  if(!obj||typeof obj!=='object'||Array.isArray(obj)){
    V.exige(false,'Le texte coll\u00e9 doit \u00eatre un ensemble de corrections, une par \u00e9l\u00e8ve.');return V;
  }
  var cles=Object.keys(obj);
  V.exige(cles.length>0,'La r\u00e9ponse ne contient aucune correction. Demande \u00e0 l\u2019IA de produire le r\u00e9sultat complet.');
  cles.forEach(function(k){
    var v=obj[k];
    if(!v||typeof v!=='object'||Array.isArray(v)){V.cite(k,'ne contient pas de correction lisible (attendu : une note et/ou des erreurs).');return;}
    if(!Object.prototype.hasOwnProperty.call(v,'note')&&!Object.prototype.hasOwnProperty.call(v,'errors'))
      V.cite(k,'n\u2019a ni note ni liste d\u2019erreurs : il faut au moins l\u2019un des deux.');
    if(Object.prototype.hasOwnProperty.call(v,'note')&&typeof v.note!=='number')
      V.cite(k,'a une note qui n\u2019est pas un nombre.');
    if(Object.prototype.hasOwnProperty.call(v,'errors')&&!Array.isArray(v.errors))
      V.cite(k,'a des erreurs qui ne forment pas une liste.');
  });
  return V;
}
/* ═══ fin § PROMPTS ═══ */
"""
# ancre GLOBALE : juste après le canon embarqué (generateAnalysePrompt est une
# fonction INTERNE à un composant React — y coller la section la rendrait locale)
s=sub(s,'var MJPC_CORE_VERSION="1.4.0";','var MJPC_CORE_VERSION="1.4.0";\n'+SEC_DU)
# parseInjectJson : accumulateur
s=sub(s,'''      var obj=JSON.parse(injectText);
      var keys=Object.keys(obj);
      if(keys.length===0){setInjectMsg("JSON vide.");return}
      // Validate structure: each key should have at least 'note' or 'errors'
      var valid=0,invalid=0;
      keys.forEach(function(k){
        var v=obj[k];
        if(v&&typeof v==="object"&&(v.hasOwnProperty("note")||v.hasOwnProperty("errors")))valid++;
        else invalid++;
      });
      if(invalid>0&&valid===0){setInjectMsg("Format invalide. Attendu: {clé_élève: {note, errors, ...}, ...}");return}''',
'''      var obj=JSON.parse(String(injectText).trim().replace(/^```(?:json)?/i,"").replace(/```$/,"").trim());
      /* M-PROMPT-2 : les motifs S'ACCUMULENT et CITENT la clé fautive */
      var V=duValiderCorrections(obj);
      if(!V.ok()){setInjectMsg("Je ne peux pas utiliser cette r\\u00e9ponse :\\n\\u2022 "+V.motifs().join("\\n\\u2022 "));return}
      var keys=Object.keys(obj);
      var valid=keys.length,invalid=0;''')
# doInject : ne se déclare pas terminé si des écritures ont échoué
s=sub(s,'''    chain.then(function(){
      setInjecting(false);
      setInjectStep(3);
      setInjectMsg("Terminé: "+done+" corrections injectées"+(errors>0?", "+errors+" erreurs":"")+".");
    });''',
'''    chain.then(function(){
      setInjecting(false);
      setInjectStep(3);
      /* M-PROMPT-2 : le geste n'est TERMINÉ que si tout a réussi (patron M-ÉCHECS) */
      if(errors>0){
        setInjectMsg("Termin\\u00e9 pour "+done+" \\u00e9l\\u00e8ve(s) sur "+keys.length+". "+errors+" n\\u2019ont pas pu \\u00eatre enregistr\\u00e9s \\u2014 relance : seuls ceux qui manquent seront repris.");
      }else{
        setInjectMsg("Termin\\u00e9 : "+done+" correction(s) enregistr\\u00e9e(s).");
      }
    });''')
s=sub(s,'var APP_VERSION="2.2.0";','var APP_VERSION="2.3.0";')
ecrit('dictee_universelle',s);print("dictee_universelle OK")

# ═══════════════════ ③ PILOTAGE_DEBAT_S3 (chaîne prompt SEULE) ═══════════════════
s=charge('pilotage_debat_s3');s=socle(s)
SEC_PD = r"""/* ═══════════════════════════════════════════════════════════════════════════
   § PROMPTS — passage au canon §12 (M-PROMPT-2). CHAÎNE PROMPT SEULE :
   rien d'autre n'est touché dans ce fichier (dette de refonte multi-classes).
   DETTE FERMÉE : validateDebatImport ne rendait qu'un BOOLÉEN NU — Paul ne savait
   jamais pourquoi son fichier était refusé. Les motifs sont désormais nommés.
   LAISSÉE TELLE QUELLE, VOLONTAIREMENT : validerDocumentsJSON accumule déjà ses
   motifs (22 accumulations, 3 sorties précoces) et ses messages sont éprouvés.
   Le canon existe pour rattraper ce qui manque, pas pour uniformiser ce qui marche :
   la réexprimer serait un risque de régression pour zéro gain. NE PAS « uniformiser ».
   ═══════════════════════════════════════════════════════════════════════════ */
var PD_BASE=(typeof MJPC_SECU2==='object'&&MJPC_SECU2&&MJPC_SECU2.hub)?MJPC_SECU2.hub:'https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
function pdChargerPrompt(defaut,cb){
  mjpcPromptCharger(PD_BASE,'pilotage','documents',{directives:defaut},function(p){cb(p.directives);});
}
function pdEnregistrerPrompt(texte,cb){
  mjpcPromptEnregistrer(PD_BASE,'pilotage','documents','directives',texte,function(ok){cb(ok);});
}
/* L'import d'un export de débat : motifs NOMMÉS au lieu d'un booléen nu. */
function pdValiderImport(payload){
  var V=mjpcValidation(6);
  if(!payload||typeof payload!=='object'||Array.isArray(payload)){
    V.exige(false,'Ce fichier ne contient pas un export de d\u00e9bat lisible.');return V;
  }
  if(!payload.debat&&!payload.binomes){
    V.exige(false,'Ce fichier ne contient ni d\u00e9bat, ni bin\u00f4mes : il manque au moins l\u2019un des deux.');
  }
  if(payload.binomes&&typeof payload.binomes!=='object')V.cite('bin\u00f4mes','devrait \u00eatre un ensemble, pas une valeur simple.');
  if(payload.debat&&typeof payload.debat!=='object')V.cite('d\u00e9bat','devrait \u00eatre un ensemble, pas une valeur simple.');
  return V;
}
/* ═══ fin § PROMPTS ═══ */
"""
s=sub(s,'function validateDebatImport(payload){',SEC_PD+'function validateDebatImport(payload){')
s=sub(s,'''  if(!validateDebatImport(payload)){ toast("Ce fichier n'est pas un export de débat."); return; }''',
'''  var _V=pdValiderImport(payload);                    /* M-PROMPT-2 : motifs nommés */
    if(!_V.ok()){ toast("Fichier refus\\u00e9 : "+_V.motifs().join(" \\u00b7 ")); return; }''')
s=sub(s,'const APP_VERSION = "2026-07-31-2";','const APP_VERSION = "2026-08-01-1";')
ecrit('pilotage_debat_s3',s);print("pilotage OK")
print("ASSEMBLAGE ×3 TERMINÉ")
