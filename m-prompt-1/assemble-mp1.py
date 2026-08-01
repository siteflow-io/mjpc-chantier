#!/usr/bin/env python3
# ══ M-PROMPT-1 — correction_dictee : canon 1.4.0 embarqué + passage à la §12 ══
import re
CANON=open('mjpc-core.staging.js',encoding='utf-8').read().rstrip()+"\n"
s=open("correction_dictee.base.html",encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x (attendu {c}) : {a[:100]!r}"
    s=s.replace(a,n)

# ── 1. le canon ENTIER, verbatim, à la place du 1.3.0 embarqué ──
deb=s.index('// MJPC-CORE v1.3.0')
finm='var MJPC_CORE_VERSION="1.3.0";'
fin=s.index(finm)+len(finm)
s=s[:deb]+CANON+s[fin:]

# ── 2. la section d'app : les prompts de correction_dictee passent au canon ──
ANCRE="function assemblePrompt(directives, format){"
SECTION = r"""/* ═══════════════════════════════════════════════════════════════════════════
   § PROMPTS — passage au canon §12 (M-PROMPT-1).
   Ce que l'app garde : ses DEUX jeux de prompts (banque d'exercices / exercices
   personnalisés), ses trois défauts en dur, son interpolation {{JSON_DICTEE}},
   ses contrôles métier (qcm, trous), et le format écrit au hub — INCHANGÉ.
   Ce que le canon apporte : la persistance à VERDICT (§9) au lieu d'une écriture
   SDK sans garde, la validation qui ACCUMULE et NOMME, l'aperçu avant écriture
   et l'archive AVANT remplacement (seulement s'il y a quelque chose à perdre).
   ═══════════════════════════════════════════════════════════════════════════ */
/* La base REST de l'app : correction_dictee n'a PAS de constante FIREBASE_BASE
   (elle est propre à index.html) — mesuré. On reprend le hub déjà déclaré par la
   section M-SÉCU-2, seule adresse du hub écrite dans ce fichier. */
var CD_BASE=(typeof MJPC_SECU2==='object'&&MJPC_SECU2&&MJPC_SECU2.hub)?MJPC_SECU2.hub:'https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
var CD_APP='dictee';                       /* l'axe app du canon */
var CD_PRODUITS={banque:'banque',exos:'exercices'};
/* Les chemins historiques restent maîtres : dictee_settings/* est lu et écrit
   comme avant (aucun format de données déplacé) — seul le MÉCANISME change. */
var CD_PIECES={
  banque:{prompt:'promptIaBanque'},
  exos:{directives:'promptDirectives',format:'promptFormat'}
};
function cdCheminPrompt(piece){return '/dictee_settings/'+piece;}
/* Lecture : la base, sinon le défaut en dur qui FAIT FOI. */
function cdChargerPrompt(piece,defaut,cb){
  if(typeof m8TestOn==='function'&&m8TestOn()&&typeof M8_TEST_STORE==='object'){
    var v=M8_TEST_STORE[cdCheminPrompt(piece)];
    cb((typeof v==='string'&&v.length)?v:defaut);return;
  }
  try{
    fetch(CD_BASE+cdCheminPrompt(piece)+'.json')
      .then(function(r){return r.ok?r.json():null;})
      .then(function(v){cb((typeof v==='string'&&v.length)?v:defaut);},function(){cb(defaut);});
  }catch(e){cb(defaut);}
}
/* Écriture : par le VERDICT du socle (§9) — trois issues, jamais un succès supposé.
   Le mode test est gratuit : il écrit dans le magasin de test, jamais au hub. */
function cdEnregistrerPrompt(piece,texte,cb){
  if(typeof m8TestOn==='function'&&m8TestOn()&&typeof M8_TEST_STORE==='object'){
    M8_TEST_STORE[cdCheminPrompt(piece)]=String(texte);cb(true,{etat:MJPC_ISSUE.ACCEPTEE});return;
  }
  /* chemin HISTORIQUE conservé (aucune donnée déplacée) ; seul le mécanisme change */
  mjpcEcrireRest(CD_BASE+cdCheminPrompt(piece)+'.json',
    {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(String(texte))},
    function(issue){cb(mjpcVerdictOk(issue),issue);});   /* cb(issue) : un seul argument — mesuré au canon */
}
/* La validation des exercices — MÊMES contrôles métier qu'avant, mais les motifs
   S'ACCUMULENT et CITENT l'élément fautif au lieu de s'arrêter au premier. */
function cdValiderExercices(parsed){
  var V=mjpcValidation(8);
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)){
    V.exige(false,'La r\u00e9ponse doit \u00eatre un ensemble d\u2019exercices, pas une simple liste ni un texte.');
    return V;
  }
  V.exige(Array.isArray(parsed.exercices_classe),'Il manque les exercices pour toute la classe (\u00ab exercices_classe \u00bb, une liste).');
  V.exige(parsed.exercices_personnels&&typeof parsed.exercices_personnels==='object'&&!Array.isArray(parsed.exercices_personnels),
          'Il manque les exercices personnels (\u00ab exercices_personnels \u00bb, un ensemble par \u00e9l\u00e8ve).');
  var TYPES=['qcm','trous','reecriture','ordre','paires','libre'];
  function exercices(list,ou){
    if(!Array.isArray(list)){V.cite(ou,'devrait contenir une liste d\u2019exercices.');return;}
    list.forEach(function(ex,n){
      var titre=(ex&&(ex.titre||ex.id))||('n\u00b0 '+(n+1));
      if(!ex||!Array.isArray(ex.items)){V.cite(ou+', exercice '+titre,'n\u2019a pas de questions (\u00ab items \u00bb, une liste).');return;}
      items(ex.items,ou+', exercice '+titre);
    });
  }
  function items(list,ou){
    if(!Array.isArray(list)){V.cite(ou,'devrait contenir une liste de questions.');return;}
    list.forEach(function(it,i){
      var ref=ou+', question '+(i+1);
      if(!it||!it.type){V.cite(ref,'n\u2019indique pas son type. Types possibles : '+TYPES.join(', ')+'.');return;}
      if(TYPES.indexOf(it.type)<0)V.cite(ref,'utilise un type inconnu (\u00ab '+it.type+' \u00bb). Types possibles : '+TYPES.join(', ')+'.');
      if(it.type==='qcm'){
        if(!Array.isArray(it.propositions)||it.propositions.length<2)V.cite(ref,'est un choix multiple : il lui faut au moins deux propositions.');
        if(typeof it.reponse!=='number')V.cite(ref,'est un choix multiple : indique le num\u00e9ro de la bonne proposition (0 pour la premi\u00e8re).');
      }else if(it.type==='trous'){
        if(!Array.isArray(it.segments))V.cite(ref,'est un texte \u00e0 trous : il lui faut la liste des morceaux de phrase (\u00ab segments \u00bb).');
        if(!Array.isArray(it.reponses))V.cite(ref,'est un texte \u00e0 trous : il lui faut la liste des r\u00e9ponses.');
        if(Array.isArray(it.segments)&&Array.isArray(it.reponses)){
          var n=it.segments.filter(function(x){return x===null;}).length;
          if(n!==it.reponses.length)V.cite(ref,'a '+n+' trou(s) mais '+it.reponses.length+' r\u00e9ponse(s) : il en faut autant.');
        }
      }else if(it.type==='reecriture'||it.type==='ordre'||it.type==='paires'){
        if(it.type==='ordre'&&!Array.isArray(it.elements))V.cite(ref,'demande de remettre en ordre : il lui faut la liste des \u00e9l\u00e9ments.');
        if(it.type==='paires'&&!Array.isArray(it.paires))V.cite(ref,'demande d\u2019associer : il lui faut la liste des paires.');
        if(it.type==='reecriture'&&!it.consigne)V.cite(ref,'est une r\u00e9\u00e9criture : il lui faut une consigne.');
      }
    });
  }
  if(parsed.exercices_classe)exercices(parsed.exercices_classe,'Exercices de la classe');
  if(parsed.exercices_personnels&&typeof parsed.exercices_personnels==='object'){
    Object.keys(parsed.exercices_personnels).forEach(function(cle){
      var bloc=parsed.exercices_personnels[cle];
      exercices(Array.isArray(bloc)?bloc:[bloc],'Exercices de '+cle);
    });
  }
  return V;
}
"""
sub(ANCRE,SECTION+ANCRE)

# ── 3. PromptIaModal : chargement par le canon (défaut en repli) ──
sub("""    db.ref("dictee_settings/promptIaBanque").once("value").then(function(snap){
      var v = snap.val();
      setPromptText(v && typeof v === "string" ? v : PROMPT_IA_BANQUE_DEFAUT);
    }).catch(function(){setPromptText(PROMPT_IA_BANQUE_DEFAUT)});""",
"""    /* M-PROMPT-1 : lecture par le canon — la base, sinon le défaut en dur qui fait foi */
    cdChargerPrompt(CD_PIECES.banque.prompt, PROMPT_IA_BANQUE_DEFAUT, function(v){setPromptText(v);});""")

# ── 4. PromptIaModal : enregistrement à VERDICT ──
sub("""  function enregistrer(){
    db.ref("dictee_settings/promptIaBanque").set(draft).then(function(){
      setPromptText(draft); setEditing(false);
      setMsg("\\u2705 Template enregistr\\u00e9 dans Firebase");
      setTimeout(function(){setMsg("")},3000);
    });
  }""",
"""  function enregistrer(){
    /* M-PROMPT-1 : écriture à VERDICT (§9) — un échec ne passe plus pour un succès */
    setMsg("Enregistrement\\u2026");
    cdEnregistrerPrompt(CD_PIECES.banque.prompt, draft, function(ok){
      if(ok){
        setPromptText(draft); setEditing(false);
        setMsg("\\u2705 Consignes enregistr\\u00e9es \\u2014 elles te suivent d\\u2019un appareil \\u00e0 l\\u2019autre.");
      }else{
        setMsg("\\u26a0 L\\u2019enregistrement n\\u2019a pas abouti \\u2014 ton texte est toujours \\u00e0 l\\u2019\\u00e9cran. R\\u00e9essaie quand la connexion est stable.");
      }
      setTimeout(function(){setMsg("")},5000);
    });
  }""")

# ── 5. PromptIaExoModal : chargement des deux pièces par le canon ──
sub("""    db.ref("dictee_settings/promptDirectives").once("value").then(function(snap){
      var v = snap.val();
      setDirectives(v && typeof v === "string" ? v : PROMPT_DIRECTIVES_DEFAULT);
    }).catch(function(){setDirectives(PROMPT_DIRECTIVES_DEFAULT)});""",
"""    /* M-PROMPT-1 : les deux pièces se chargent par le canon (défauts en repli) */
    cdChargerPrompt(CD_PIECES.exos.directives, PROMPT_DIRECTIVES_DEFAULT, function(v){setDirectives(v);});""")

# ── 6. PromptIaExoModal : enregistrement à VERDICT ──
sub("""  function enregistrer(){
    var path = editMode === "directives" ? "dictee_settings/promptDirectives" : "dictee_settings/promptFormat";
    db.ref(path).set(draft).then(function(){
      if(editMode === "directives") setDirectives(draft); else setFormatSpec(draft);
      setEditMode("none");
      setMsg("\\u2705 Enregistr\\u00e9");setTimeout(function(){setMsg("")},3000);
    });
  }""",
"""  function enregistrer(){
    /* M-PROMPT-1 : écriture à VERDICT (§9) */
    var piece = editMode === "directives" ? CD_PIECES.exos.directives : CD_PIECES.exos.format;
    setMsg("Enregistrement\\u2026");
    cdEnregistrerPrompt(piece, draft, function(ok){
      if(ok){
        if(editMode === "directives") setDirectives(draft); else setFormatSpec(draft);
        setEditMode("none");
        setMsg("\\u2705 Enregistr\\u00e9 \\u2014 \\u00e7a te suit d\\u2019un appareil \\u00e0 l\\u2019autre.");
      }else{
        setMsg("\\u26a0 L\\u2019enregistrement n\\u2019a pas abouti \\u2014 ton texte est toujours \\u00e0 l\\u2019\\u00e9cran.");
      }
      setTimeout(function(){setMsg("")},5000);
    });
  }""")

# ── 7. l'injection : validation qui accumule, APERÇU, archive AVANT (si banque existante) ──
sub("""  function injecter(){
    setErrMsg("");
    var parsed;
    try{ parsed = JSON.parse(jsonInput); }
    catch(e){ setErrMsg("JSON invalide : "+e.message); return; }""",
"""  function injecter(){
    setErrMsg("");
    var parsed;
    var brut = String(jsonInput||"").trim().replace(/^```(?:json)?/i,"").replace(/```$/,"").trim();
    try{ parsed = JSON.parse(brut); }
    catch(e){ setErrMsg("Je ne peux pas lire cette r\\u00e9ponse : elle est incompl\\u00e8te ou mal ferm\\u00e9e ("+e.message+"). Demande \\u00e0 l\\u2019IA de redonner le r\\u00e9sultat en entier, sans rien autour."); return; }
    /* M-PROMPT-1 : les motifs de refus S'ACCUMULENT et CITENT l'exercice fautif */
    var V = cdValiderExercices(parsed);
    if(!V.ok()){ setErrMsg("Je ne peux pas utiliser cette r\\u00e9ponse :\\n\\u2022 "+V.motifs().join("\\n\\u2022 ")); return; }
    setApercu(parsed); return;
  }
  /* L'écriture n'a lieu qu'APRÈS confirmation de l'aperçu. */
  function injecterConfirme(parsed){
    setApercu(null);
    var ancien = exercices || null;   /* rien à remplacer → pas d'archive de rien */""")
# la suite de l'ancienne fonction : neutraliser les contrôles désormais portés par le validateur
sub("""    // Validation structurelle minimale
    if(!parsed || typeof parsed!=="object"){setErrMsg("Le JSON doit \\u00eatre un objet.");return}
    if(!Array.isArray(parsed.exercices_classe)){setErrMsg("Champ 'exercices_classe' manquant ou invalide (doit \\u00eatre un tableau).");return}
    if(!parsed.exercices_personnels || typeof parsed.exercices_personnels!=="object"){setErrMsg("Champ 'exercices_personnels' manquant ou invalide (doit \\u00eatre un objet).");return}""",
"""    /* M-PROMPT-1 : ces contrôles vivent désormais dans cdValiderExercices (§12),
       où ils s'accumulent au lieu de s'arrêter au premier. */""")

open("correction_dictee.staging.html","w",encoding='utf-8').write(s)
print(f"correction_dictee.staging.html écrit ({len(s)} car.) — reste : aperçu, archive, pastille (passage 2)")
