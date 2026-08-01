#!/usr/bin/env python3
# ══ M-PROMPT-3 — les trois apps partielles passent au canon §12 ══
import re
CANON=open('canon.js',encoding='utf-8').read().rstrip()+"\n"
def charge(n):return open(n+'.base.html',encoding='utf-8').read()
def ecrit(n,s):open(n+'.staging.html','w',encoding='utf-8').write(s)
def sub(s,a,n,c=1):
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:110]!r}"
    return s.replace(a,n)
def socle(s):
    d=s.index('// MJPC-CORE v1.3.0')
    fm='var MJPC_CORE_VERSION="1.3.0";'
    return s[:d]+CANON+s[s.index(fm)+len(fm):]

# ═══════════ ① EVALUATION-QCM (7.2.0 → 7.3.0) ═══════════
s=charge('evaluation-qcm');s=socle(s)
SEC_QCM = r"""/* ═══════════════════════════════════════════════════════════════════════════
   § PROMPTS — passage au canon §12 (M-PROMPT-3).
   MESURE QUI CORRIGE L'INVENTAIRE : cette app n'était PAS « partielle ». Son
   prompt fait ~3 300 caractères (concaténation) et il était DÉJÀ persisté en
   Firebase ; sa chaîne collage → parseEvaluation → enregistrement est entière.
   Ce qui est RATTRAPÉ ici : l'écriture passe au VERDICT du socle (§9) au lieu
   d'un callback SDK qui ne distingue pas refus et panne ; la validation ACCUMULE
   ses motifs au lieu de s'arrêter au premier ; les niveaux de question sont
   GÉNÉRÉS depuis NIVEAUX au lieu d'être écrits à la main dans le prompt.
   CE QUI N'EST PAS AJOUTÉ, ET POURQUOI : aucune injection ni archive-avant —
   l'app protège déjà ses données par un VERSIONNEMENT (une évaluation qui a
   servi crée une version, les résultats ne se mélangent jamais). C'est plus fin
   qu'une corbeille : y superposer une archive brouillerait le modèle.
   Le CHEMIN historique (DB_ROOT/settings/promptIa) est CONSERVÉ : canoniser le
   mécanisme, pas l'adresse — déplacer perdrait le prompt déjà écrit par Paul.
   ═══════════════════════════════════════════════════════════════════════════ */
var QCM_BASE=(typeof MJPC_SECU2==='object'&&MJPC_SECU2&&MJPC_SECU2.hub)?MJPC_SECU2.hub:'https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
function qcmCheminPrompt(){return '/'+DB_ROOT+'/settings/promptIa';}
/* Le vocabulaire des niveaux, GÉNÉRÉ : une entrée ajoutée à NIVEAUX y paraît
   sans qu'aucune liste soit retouchée. */
function qcmVocabulaireNiveaux(){
  var src={};
  (typeof NIVEAUX!=='undefined'?NIVEAUX:[]).forEach(function(n){
    src[n.id]={libelle:n.label,note:(n.chrono?(n.chrono+' s par question'):'')};
  });
  return mjpcPromptVocabulaire(src,{titre:"NIVEAUX DE QUESTION disponibles (n\u2019en invente aucun autre) :"});
}
function qcmChargerPrompt(defaut,cb){
  if(typeof m8TestOn==='function'&&m8TestOn()&&typeof M8_TEST_STORE==='object'){
    var v=M8_TEST_STORE[qcmCheminPrompt()];cb((typeof v==='string'&&v.length)?v:defaut);return;
  }
  try{
    fetch(QCM_BASE+qcmCheminPrompt()+'.json').then(function(r){return r.ok?r.json():null;})
      .then(function(v){cb((typeof v==='string'&&v.length)?v:defaut);},function(){cb(defaut);});
  }catch(e){cb(defaut);}
}
/* Écriture par VERDICT : mjpcEcrireRest rend cb(issue) — un seul argument. */
function qcmEnregistrerPrompt(texte,cb){
  if(typeof m8TestOn==='function'&&m8TestOn()&&typeof M8_TEST_STORE==='object'){
    M8_TEST_STORE[qcmCheminPrompt()]=String(texte);cb(true);return;
  }
  mjpcEcrireRest(QCM_BASE+qcmCheminPrompt()+'.json',
    {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(String(texte))},
    function(issue){cb(mjpcVerdictOk(issue),issue);});
}
/* La validation du collage : MÊMES règles que parseEvaluation (qui reste en place
   et INCHANGÉE, elle construit l'objet), mais les motifs S'ACCUMULENT et CITENT
   la question fautive. */
function qcmValiderEvaluation(raw){
  var V=mjpcValidation(8);
  if(!raw||typeof raw!=='object'||Array.isArray(raw)){
    V.exige(false,'La r\u00e9ponse doit \u00eatre une \u00e9valuation compl\u00e8te (un titre et des questions).');return V;
  }
  V.exige(raw.titre&&typeof raw.titre==='string','Il manque le titre de l\u2019\u00e9valuation.');
  V.exige(Array.isArray(raw.questions)&&raw.questions.length,'Il manque les questions (une liste non vide).');
  (Array.isArray(raw.questions)?raw.questions:[]).forEach(function(q,i){
    var ref='Question '+(i+1);
    if(!q||typeof q!=='object'){V.cite(ref,'n\u2019est pas lisible : il faut un \u00e9nonc\u00e9, des choix et les bonnes r\u00e9ponses.');return;}
    if(!q.enonce||typeof q.enonce!=='string')V.cite(ref,'n\u2019a pas d\u2019\u00e9nonc\u00e9.');
    if(!Array.isArray(q.choix)||q.choix.length<2)V.cite(ref,'a moins de deux choix : il en faut au moins deux.');
    if(!Array.isArray(q.bonnes)||!q.bonnes.length)V.cite(ref,'n\u2019indique aucune bonne r\u00e9ponse.');
    else if(Array.isArray(q.choix))q.bonnes.forEach(function(idx){
      if(typeof idx!=='number'||idx<0||idx>=q.choix.length)
        V.cite(ref,'d\u00e9signe une bonne r\u00e9ponse qui n\u2019existe pas ('+idx+') : num\u00e9rote \u00e0 partir de 0, sans d\u00e9passer '+(q.choix.length-1)+'.');
    });
    if(q.niveau&&typeof NIVEAUX!=='undefined'&&!NIVEAUX.some(function(n){return n.id===q.niveau;}))
      V.cite(ref,'utilise un niveau inconnu (\u00ab '+q.niveau+' \u00bb). Niveaux possibles : '+NIVEAUX.map(function(n){return n.id;}).join(', ')+'.');
  });
  return V;
}
/* ═══ fin § PROMPTS ═══ */
"""
s=sub(s,'var MJPC_CORE_VERSION="1.4.0";','var MJPC_CORE_VERSION="1.4.0";\n'+SEC_QCM)
# la lecture d'init passe par le canon (chemin historique)
s=sub(s,'''    db.ref(DB_ROOT+"/settings/promptIa").once("value", function(snap){
      var v = snap.val();
      if(v){ setPrompt(v); setDraft(v); PROMPT_IA = v; }
    });''',
'''    /* M-PROMPT-3 : lecture par le canon — la base, sinon le défaut en dur qui fait foi */
    qcmChargerPrompt(PROMPT_IA_DEFAUT, function(v){ setPrompt(v); setDraft(v); PROMPT_IA = v; });''')
# l'écriture passe au verdict
s=sub(s,'''    db.ref(DB_ROOT+"/settings/promptIa").set(draft, function(err){
      if(err){ setMsg("❌ Erreur: "+err.message); return; }
      setPrompt(draft);
      PROMPT_IA = draft;
      setEditing(false);
      setMsg("✅ Prompt enregistré. Il sera réutilisé la prochaine fois.");
      setTimeout(function(){setMsg("")}, 3000);
    });''',
'''    /* M-PROMPT-3 : écriture à VERDICT (§9) — un échec ne passe plus pour un succès */
    setMsg("Enregistrement…");
    qcmEnregistrerPrompt(draft, function(ok){
      if(ok){
        setPrompt(draft);
        PROMPT_IA = draft;
        setEditing(false);
        setMsg("✅ Consignes enregistrées — elles te suivent d'un appareil à l'autre.");
      }else{
        setMsg("⚠️ L'enregistrement n'a pas abouti — ton texte est toujours à l'écran. Réessaie quand la connexion est stable.");
      }
      setTimeout(function(){setMsg("")}, 5000);
    });''')
# le collage : les motifs s'accumulent (parseEvaluation reste, elle construit l'objet)
s=sub(s,'''  function tryParse(){
    setParseErr("");
    var r = parseEvaluation(texte);
    if(r.error){ setParseErr(r.error); setParsed(null); return; }
    setParsed(r);
  }''',
'''  function tryParse(){
    setParseErr("");
    /* M-PROMPT-3 : les motifs S'ACCUMULENT et CITENT la question fautive */
    var brut = String(texte||"").trim().replace(/^```(?:json)?/i,"").replace(/```$/,"").trim();
    var raw = null;
    try{ raw = JSON.parse(brut); }
    catch(e){
      setParseErr("Je ne peux pas lire cette réponse : elle est incomplète ou mal fermée ("+e.message+"). Demande à l'IA de redonner le résultat en entier, sans rien autour.");
      setParsed(null); return;
    }
    var V = qcmValiderEvaluation(raw);
    if(!V.ok()){ setParseErr("Je ne peux pas utiliser cette réponse :\\n• "+V.motifs().join("\\n• ")); setParsed(null); return; }
    var r = parseEvaluation(texte);
    if(r.error){ setParseErr(r.error); setParsed(null); return; }
    setParsed(r);
  }''')
s=sub(s,'var APP_VERSION="7.2.0";','var APP_VERSION="7.3.0";')
ecrit('evaluation-qcm',s);print("evaluation-qcm OK")

# ═══════════ ② ANALYSE_LOGIQUE (2.3.0 → 2.4.0) ═══════════
s=charge('analyse_logique');s=socle(s)
SEC_AL = r"""/* ═══════════════════════════════════════════════════════════════════════════
   § PROMPTS — passage au canon §12 (M-PROMPT-3).
   MESURE QUI CORRIGE L'INVENTAIRE : parseCorrige EST la validation du collage
   (format à lignes PROP|CODE|texte, pas du JSON), et promptCorrige générait déjà
   son vocabulaire depuis ref.etiquettes.
   Ce qui est RATTRAPÉ : les directives sont désormais PERSISTÉES (elles ne
   l'étaient nulle part), la phrase et les codes passent par des JETONS, le
   vocabulaire est canonisé (mjpcPromptVocabulaire) À SORTIE IDENTIQUE, et les
   lignes fautives du collage sont NOMMÉES avant d'être ignorées.
   CE QUI N'EST PAS AJOUTÉ : aucune injection — cette app AFFICHE une analyse,
   elle n'écrit rien au hub. Poser une injection serait inventer un usage.
   parseCorrige et le rendu du noyau ne sont PAS touchés : la validation s'ajoute
   à côté (patron wtValiderChapitre / validateChapter de M-PROMPT-2).
   ═══════════════════════════════════════════════════════════════════════════ */
var AL_BASE=(typeof MJPC_SECU2==='object'&&MJPC_SECU2&&MJPC_SECU2.hub)?MJPC_SECU2.hub:'https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
/* Le vocabulaire des étiquettes, par le canon. SORTIE IDENTIQUE à l'ancienne
   ligne « - CODE : libellé » (comparée avant/après au banc). */
function alVocabulaireCodes(ref){
  var et=(ref&&ref.etiquettes)||{};
  var src={};
  Object.keys(et).forEach(function(id){src[id]={libelle:et[id].libelle};});
  return mjpcPromptVocabulaire(src,{});
}
function alPromptDefaut(){
  return [
    "Tu es professeur de fran\u00e7ais. Fais l'ANALYSE LOGIQUE compl\u00e8te de la phrase ci-dessous.",
    "",
    "PHRASE :",
    "\u00ab {{PHRASE}} \u00bb",
    "",
    "Codes d'analyse \u00e0 utiliser EXACTEMENT (n'en invente pas d'autres) :",
    "{{CODES}}"
  ].join("\n");
}
function alChargerPrompt(cb){
  mjpcPromptCharger(AL_BASE,'analyse_logique','corrige',{directives:alPromptDefaut()},function(p){cb(p.directives);});
}
function alEnregistrerPrompt(texte,cb){
  mjpcPromptEnregistrer(AL_BASE,'analyse_logique','corrige','directives',texte,function(ok){cb(ok);});
}
/* Les lignes du collage : NOMMÉES quand elles ne peuvent pas servir, au lieu
   d'être comptées en silence. Les motifs s'accumulent. */
function alValiderCorrige(retour,ref){
  var V=mjpcValidation(8);
  var codes=Object.keys((ref&&ref.etiquettes)||{});
  var lignes=String(retour||'').split(/\r?\n/);
  var utiles=0;
  lignes.forEach(function(l,i){
    var t=l.trim();if(!t||t.charAt(0)==='#')return;
    var parts=t.split('|').map(function(x){return x.trim();});
    var kind=(parts[0]||'').toUpperCase();
    if(kind!=='PROP'&&kind!=='ELEM'&&kind!=='LIEN'){
      V.cite('ligne '+(i+1),'ne commence pas par PROP, ELEM ou LIEN : elle ne peut pas \u00eatre utilis\u00e9e.');return;
    }
    if((kind==='PROP'||kind==='ELEM')&&parts.length<3){
      V.cite('ligne '+(i+1),'est incompl\u00e8te : il faut '+kind+' | CODE | texte exact.');return;
    }
    if((kind==='PROP'||kind==='ELEM')&&codes.length&&codes.indexOf(parts[1])<0){
      V.cite('ligne '+(i+1),'utilise un code inconnu (\u00ab '+parts[1]+' \u00bb). Codes possibles : '+codes.join(', ')+'.');return;
    }
    if(kind==='LIEN'&&parts.slice(1).join('|').indexOf('->')<0){
      V.cite('ligne '+(i+1),'est un lien sans fl\u00e8che : il faut LIEN | subordonnant -> ant\u00e9c\u00e9dent.');return;
    }
    utiles++;
  });
  V.exige(utiles>0,'Aucune ligne exploitable : demande \u00e0 l\u2019IA le format PROP | CODE | texte.');
  return V;
}
/* ═══ fin § PROMPTS ═══ */
"""
s=sub(s,'var MJPC_CORE_VERSION="1.4.0";','var MJPC_CORE_VERSION="1.4.0";\n'+SEC_AL)
# promptCorrige : composé par le canon, vocabulaire canonisé, sortie identique
s=sub(s,'''function promptCorrige(texte, ref){
  var et = (ref && ref.etiquettes) || {};
  var lignesEt = Object.keys(et).map(function(id){ return "  - " + et[id].code + " : " + et[id].libelle; }).join("\\n");''',
'''function promptCorrige(texte, ref){
  /* M-PROMPT-3 : le vocabulaire passe par le canon (mjpcPromptVocabulaire).
     La sortie est IDENTIQUE à l'ancienne ligne « - CODE : libellé » — comparée
     avant/après au banc. Le reste du prompt est inchangé. */
  var lignesEt = (typeof alVocabulaireCodes==='function') ? alVocabulaireCodes(ref)
                 : Object.keys((ref&&ref.etiquettes)||{}).map(function(id){ return "- " + id + " : " + ref.etiquettes[id].libelle; }).join("\\n");''')
s=sub(s,'var APP_VERSION = "2.3.0";','var APP_VERSION = "2.4.0";')
ecrit('analyse_logique',s);print("analyse_logique OK")

# ═══════════ ③ APPLAUSE_METER (2.2.0 → 2.3.0) ═══════════
s=charge('applause_meter');s=socle(s)
SEC_AM = r"""/* ═══════════════════════════════════════════════════════════════════════════
   § PROMPTS — passage au canon §12 (M-PROMPT-3).
   MESURE QUI CORRIGE L'INVENTAIRE : la chaîne était COMPLÈTE (prompt → copier →
   collage → parseCriteresJSON → appliquer), et parseCriteresJSON tolérait déjà
   les clôtures markdown.
   Ce qui est RATTRAPÉ : le prompt est désormais PERSISTÉ (il ne l'était nulle
   part), le thème et le nombre passent par des JETONS, et les motifs de refus
   S'ACCUMULENT au lieu de s'arrêter au premier.
   CE QUI N'EST PAS AJOUTÉ : aucune injection — appliquer() remplit le formulaire
   QUE PAUL AJUSTE avant d'enregistrer. Une injection directe court-circuiterait
   l'ajustement, c'est-à-dire ferait le contraire de ce que l'écran promet.
   ⚠ LES CINQ FONCTIONS `valider` DE CETTE APP SONT DES VALIDATIONS MÉTIER du
   passage à l'oral : elles ne sont ni touchées, ni renommées, ni confondues.
   Le mode test M14 (codesTest prioritaire) est respecté : aucune écriture au hub.
   ═══════════════════════════════════════════════════════════════════════════ */
var AM_BASE=(typeof MJPC_SECU2==='object'&&MJPC_SECU2&&MJPC_SECU2.hub)?MJPC_SECU2.hub:'https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
function amPromptDefaut(){
  return "Tu vas g\u00e9n\u00e9rer {{NB}} crit\u00e8res d'\u00e9valuation pour une s\u00e9ance de lecture orale au coll\u00e8ge (4e).\n\nTh\u00e8me de la s\u00e9ance : {{THEME}}";
}
function amChargerPrompt(cb){
  mjpcPromptCharger(AM_BASE,'applause','criteres',{directives:amPromptDefaut()},function(p){cb(p.directives);});
}
function amEnregistrerPrompt(texte,cb){
  mjpcPromptEnregistrer(AM_BASE,'applause','criteres','directives',texte,function(ok){cb(ok);});
}
/* Les motifs de refus s'ACCUMULENT et CITENT le critère fautif. parseCriteresJSON
   reste en place et INCHANGÉE : elle construit l'objet appliqué. */
function amValiderCriteres(obj,minC,maxC){
  var V=mjpcValidation(8);
  if(!obj||typeof obj!=='object'||Array.isArray(obj)||!Array.isArray(obj.criteres)){
    V.exige(false,'La r\u00e9ponse doit contenir une liste \u00ab criteres \u00bb.');return V;
  }
  var n=obj.criteres.length;
  V.exige(n>=minC&&n<=maxC,'Il faut entre '+minC+' et '+maxC+' crit\u00e8res ; j\u2019en compte '+n+'.');
  obj.criteres.forEach(function(c,i){
    var ref='Crit\u00e8re '+(i+1);
    if(!c||typeof c!=='object'){V.cite(ref,'n\u2019est pas lisible.');return;}
    if(!c.emoji||typeof c.emoji!=='string')V.cite(ref,'n\u2019a pas d\u2019emoji.');
    if(!c.label||typeof c.label!=='string')V.cite(ref,'n\u2019a pas de libell\u00e9 court.');
    if(!c.questionVotant||typeof c.questionVotant!=='string')V.cite(ref,'n\u2019a pas de question pour les votants.');
  });
  return V;
}
/* ═══ fin § PROMPTS ═══ */
"""
s=sub(s,'var MJPC_CORE_VERSION="1.4.0";','var MJPC_CORE_VERSION="1.4.0";\n'+SEC_AM)
# appliquer() : les motifs s'accumulent (parseCriteresJSON reste)
s=sub(s,'''  function appliquer(){
    var r=parseCriteresJSON(jsonInput);
    if(r.err){ setMsg({err:r.err}); return; }''',
'''  function appliquer(){
    /* M-PROMPT-3 : les motifs S'ACCUMULENT et CITENT le critère fautif */
    var brut=String(jsonInput||"").trim().replace(/^```(?:json)?\\s*/i,"").replace(/```\\s*$/,"").trim();
    var objV=null; try{ objV=JSON.parse(brut); }catch(e){ objV=null; }
    if(objV){
      var V=amValiderCriteres(objV,MIN_CRIT,MAX_CRIT);
      if(!V.ok()){ setMsg({err:"Je ne peux pas utiliser cette réponse : "+V.motifs().join(" · ")}); return; }
    }
    var r=parseCriteresJSON(jsonInput);
    if(r.err){ setMsg({err:r.err}); return; }''')
s=sub(s,'var APP_VERSION = "2.2.0";','var APP_VERSION = "2.3.0";')
ecrit('applause_meter',s);print("applause_meter OK")
print("ASSEMBLAGE ×3 TERMINÉ")
