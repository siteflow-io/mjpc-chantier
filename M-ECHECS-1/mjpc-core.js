// ═══════════════════════════════════════════════════════════════════════════
// MJPC-CORE v1.2.0 (2026-07-30) — socle commun de l'écosystème MJPC
// v1.2.0 : + §9 écritures, les trois issues (MJPC_ISSUE, mjpcEcrireRest) —
//          une écriture n'a jamais deux issues (« fait »/« erreur ») mais trois :
//          acceptée / refusée (définitif) / panne (temporaire). Prérequis M-SÉCU.
// v1.1.0 : + §8 session partagée MJPC (lireSessionMJPC, validerEleveMJPC) —
//          l'app reconnaît l'élève ou le prof déjà connecté au site MJPC
//          et saute son écran de connexion. Sans session : portail natif inchangé.
// Bloc versionné, IDENTIQUE dans chaque app. Ne jamais le modifier localement :
// toute évolution passe par une nouvelle version diffusée partout.
// Seul le bloc « DÉCLARATION DE L'APP » (MJPC_APP / MJPC_MANIFESTE / MJPC_PURGE)
// est propre à chaque app — il se remplit, il ne se réécrit pas.
// Dépendances : firebase 8.x (db = firebase.database()) déjà initialisé par l'app.
// ═══════════════════════════════════════════════════════════════════════════

// ── DÉCLARATION DE L'APP (à remplir par app — exemple ci-dessous) ──
// var MJPC_APP = {
//   id: "correction_dictee",          // identifiant technique (anglais/ascii)
//   nom: "Correction de dictée",      // libellé lisible
//   contenant: "aucun"                // "aucun" | "binome" | "groupe" | "classe"
// };                                  // = l'élève travaille seul / à 2-3 / en groupe / classe entière
// var MJPC_MANIFESTE = { notions: [], noeuds: [] };   // vocabulaire + nœuds Firebase de l'app (vue projetée)
// var MJPC_PURGE = { preserver: [], purger: [] };     // contrat de purge : chemins à garder / à effacer au reset

// ── 1. Identité élève : clé canonique ──
// "CLÉMENT Noé" → "clement_noe". Déterministe, recalculable, lisible.
function sanMJPC(s){
  return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"");
}

// ── 2. Identité classe : la clé du hub EST l'identifiant ──
// Décision du 14/07/2026 : aucune app ne transforme le nom de classe.
// La clé de /classes (ex. "4E BANKSY") est l'unique étiquette de rangement.
function cleClasse(nom){ return String(nom||"").trim(); }

// ── 3. Classes de test (bac à sable) : convention unique "_test_<app>" ──
// Préfixe "_" = classe interne : jamais montrée aux élèves, jamais archivée
// dans les profils, nettoyable sans risque. "CLASSE TEST" et "_TEST" sont
// reconnues comme héritage le temps de leur nettoyage (dette B).
function classeTestId(){ return "_test_"+MJPC_APP.id; }
function estClasseInterne(nom){ return !!nom && String(nom).charAt(0)==="_"; }
function estClasseTest(nom){
  return estClasseInterne(nom) || nom==="CLASSE TEST"; // héritage toléré en lecture
}

// ── 4. Lecture robuste d'un roster : extractEleves ──
// Tolère les 3 formats rencontrés dans les données réelles :
//   liste ["NOM Prénom", …] · objet indexé {0:…, archivee:…} ·
//   objet {nom, eleves:[{nomComplet}|{nom,prenom}|{name}|"…"]}
function extractEleves(fbClasse, cfgEleves){
  cfgEleves = cfgEleves || [];
  var META={niveau:1,annee:1,id:1,title:1,nom:1,archivee:1,couleur:1,cree_le:1,published:1,eleves:1};
  function clean(a){return (a||[]).filter(function(x){return x&&typeof x==="string"&&x.trim();});}
  function nomDe(v){
    if(typeof v==="string") return v;
    if(v&&typeof v==="object"){
      if(v.nomComplet) return v.nomComplet;
      if(v.nom&&v.prenom) return String(v.nom).toUpperCase()+" "+v.prenom;
      if(v.name) return v.name;
    }
    return null;
  }
  if(Array.isArray(fbClasse)){ var a=clean(fbClasse.map(nomDe)); if(a.length) return a; }
  if(fbClasse&&typeof fbClasse==="object"&&!Array.isArray(fbClasse)){
    if(Array.isArray(fbClasse.eleves)){ var e=clean(fbClasse.eleves.map(nomDe)); if(e.length) return e; }
    var names=clean(Object.keys(fbClasse).filter(function(k){return !META[k]&&k.charAt(0)!=="_";}).map(function(k){return nomDe(fbClasse[k]);}));
    if(names.length) return names;
  }
  return clean(cfgEleves.map(nomDe));
}

// ── 5. Écriture NON destructive d'une classe : ecrireClasse ──
// Remplace UNIQUEMENT la liste d'élèves ; préserve toute métadonnée existante
// (archivee, niveau, couleur, …) ; normalise au format canonique
// {eleves:["NOM Prénom",…], …métadonnées} : les élèves-objets ({nomComplet},
// {nom,prenom}, {name}) sont ramenés à la chaîne, les résidus indexés {0:…} purgés.
// meta (optionnel) : métadonnées à poser/mettre à jour (ex. {niveau:"4e"}) —
// appliquées PAR-DESSUS l'existant, jamais en le remplaçant.
// Transaction Firebase : atomique, idempotente, sûre en concurrence.
function ecrireClasse(db, nomClasse, eleves, meta, cb){
  if(typeof meta==="function"){ cb=meta; meta=null; }
  var nom=cleClasse(nomClasse);
  if(!nom){ if(cb) cb(new Error("Nom de classe vide")); return; }
  function nomDe(v){
    if(typeof v==="string") return v.trim();
    if(v&&typeof v==="object"){
      if(v.nomComplet) return String(v.nomComplet).trim();
      if(v.nom&&v.prenom) return String(v.nom).toUpperCase()+" "+String(v.prenom).trim();
      if(v.name) return String(v.name).trim();
    }
    return null;
  }
  var propres=(eleves||[]).map(nomDe).filter(function(e){return e&&typeof e==="string";});
  db.ref("classes/"+nom).transaction(function(cur){
    var out={eleves:propres};
    if(cur&&typeof cur==="object"&&!Array.isArray(cur)){
      for(var k in cur){
        if(k==="eleves") continue;          // remplacée
        if(/^\d+$/.test(k)) continue;       // résidu indexé : purgé (les élèves vivent dans .eleves)
        out[k]=cur[k];                      // métadonnée : préservée
      }
    }
    if(meta&&typeof meta==="object"){ for(var m in meta){ if(meta[m]!==undefined) out[m]=meta[m]; } }
    if(out.archivee===undefined) out.archivee=false;
    return out;
  }, function(err, committed){ if(cb) cb(err||null, committed); });
}

// ── 6. Suppression d'élève : INTERDITE hors MJPC ──
// Une seule logique de suppression, dans la console MJPC (archive avant tout).
// Les apps remplacent leurs boutons de suppression par ce renvoi.
var MJPC_URL="https://siteflow-io.github.io/monsieurjaipascompris/index.html";
function renvoyerVersMJPC(motif){
  var msg="La gestion des \u00e9l\u00e8ves (ajout, retrait, archivage) se fait dans MJPC, pour que rien ne se perde."
        +(motif?"\n\n("+motif+")":"");
  if(typeof window!=="undefined"&&window.confirm(msg+"\n\nOuvrir MJPC ?")){ window.open(MJPC_URL,"_blank"); }
}

// ── 7. Identification nominative : le portail commun (logique) ──
// Toute identification produit des élèves SINGULIERS (clé canonique), que le
// travail soit individuel ou en groupe. Le groupe est un contenant, pas une identité.
// resolveEleves(roster, saisies) → [{nom, cle}] ou {erreur}
//   roster  : liste des noms de la classe (extractEleves)
//   saisies : ["DUPONT Marie", …] (chips) ou [{nom:"DUPONT",prenom:"Marie"}] (champs)
function resolveEleves(roster, saisies){
  var res=[], vus={};
  for(var i=0;i<(saisies||[]).length;i++){
    var s=saisies[i], trouve=null;
    if(typeof s==="string"){
      for(var j=0;j<roster.length;j++){ if(roster[j]===s){trouve=roster[j];break;} }
      if(!trouve){ var k=sanMJPC(s); for(j=0;j<roster.length;j++){ if(sanMJPC(roster[j])===k){trouve=roster[j];break;} } }
    } else if(s&&s.nom&&s.prenom){
      var nomU=String(s.nom).trim().toUpperCase(), preL=String(s.prenom).trim().toLowerCase();
      for(j=0;j<roster.length;j++){
        var parts=roster[j].split(" ");
        var rNom=parts.slice(0,-1).join(" ").toUpperCase(), rPre=(parts[parts.length-1]||"").toLowerCase();
        if(rNom===nomU&&rPre===preL){trouve=roster[j];break;}
      }
    }
    if(!trouve) return {erreur:"\u00c9l\u00e8ve introuvable : "+(typeof s==="string"?s:(s.nom+" "+s.prenom))+". V\u00e9rifie l'orthographe."};
    var cle=sanMJPC(trouve);
    if(vus[cle]) return {erreur:"\u00c9l\u00e8ve s\u00e9lectionn\u00e9 deux fois : "+trouve};
    vus[cle]=1; res.push({nom:trouve, cle:cle});
  }
  if(!res.length) return {erreur:"Aucun \u00e9l\u00e8ve identifi\u00e9."};
  return res;
}

// ── 8. Manifeste (vue projetée, ADDITIVE) ──
// Les constantes en dur dans l'app restent la source de vérité ; le manifeste
// n'est qu'une photographie publiée pour MJPC. Incapable de diverger : republiée
// à chaque chargement prof.
function publierManifeste(db){
  try{
    db.ref("manifestes/"+MJPC_APP.id).set({
      version: MJPC_CORE_VERSION,
      app: MJPC_APP,
      manifeste: MJPC_MANIFESTE||{},
      purge: MJPC_PURGE||{preserver:[],purger:[]},
      publie_le: Date.now()
    });
  }catch(e){ /* le manifeste ne doit jamais casser l'app */ }
}

// ── 8. Session partagée MJPC : l'app reconnaît qui est déjà connecté au site ──
// Le site MJPC écrit 'mjpc_eleve' (sessionStorage + localStorage, même origine).
// L'app la LIT ; elle ne l'écrit jamais. Validité : 12 h par défaut (une journée
// de cours). Une session invalide ou périmée → null → portail natif de l'app.
function lireSessionMJPC(ttlMs){
  var ttl = ttlMs || 12*3600*1000;
  var brut = null;
  try{ brut = sessionStorage.getItem("mjpc_eleve") || localStorage.getItem("mjpc_eleve"); }catch(e){}
  if(!brut) return null;
  var s; try{ s = JSON.parse(brut); }catch(e){ return null; }
  if(!s || typeof s!=="object") return null;
  if(!s.ts || (Date.now()-s.ts) > ttl) return null;          /* périmée */
  if(s.is_prof===true) return {is_prof:true, display:s.display||"Professeur", ts:s.ts};
  var nom = s.display || ((s.nom||"")+" "+(s.prenom||"")).trim();
  if(!nom || !s.classe) return null;
  return {is_prof:false, nom:nom, classe:s.classe, ts:s.ts};
}
// La session dit « CLÉMENT Noé, 4e Hugo » — l'app VÉRIFIE contre le registre
// officiel (/classes) avant d'ouvrir : classe existante, élève au registre.
// Rend l'identité résolue {nom (celui du registre), classe, cle} ou null.
function validerEleveMJPC(session, classesData){
  if(!session || session.is_prof) return null;
  var cl = (classesData||{})[session.classe];
  if(!cl || (cl&&cl.archivee)) return null;
  var roster = extractEleves(cl, []);
  var cible = sanMJPC(session.nom);
  for(var i=0;i<roster.length;i++){
    if(sanMJPC(roster[i])===cible) return {nom:roster[i], classe:session.classe, cle:cible};
  }
  return null;
}

// ── 9. Écritures : les trois issues (v1.2.0) ──
// Une écriture ne connaît JAMAIS deux issues (« fait » / « erreur ») mais TROIS :
//   ACCEPTEE — la réponse est arrivée ET le serveur a accepté ;
//   REFUSEE  — la réponse est arrivée et dit non (règle de sécurité, chemin
//              invalide, charge rejetée) : DÉFINITIF, réessayer n'y changera rien ;
//   PANNE    — aucune réponse (liaison) : TEMPORAIRE, l'écriture pourra aboutir
//              plus tard (une file d'attente pourra se brancher sur cet état).
// Les confondre fait mentir l'écran : « enregistré » pendant que rien n'est parti.
var MJPC_ISSUE={ACCEPTEE:"acceptee",REFUSEE:"refusee",PANNE:"panne"};

// Le classeur d'issues pour le transport REST (fetch) — la SEULE source de vérité :
//   la promesse se résout ET r.ok        → ACCEPTEE
//   la promesse se résout ET !r.ok       → REFUSEE (le status est porté)
//   la promesse rejette (aucune réponse) → PANNE   (status 0)
// fetch ne rejette QUE sur panne de liaison : c'est précisément pourquoi un refus
// HTTP se faisait passer pour un succès partout où seul le then était regardé.
function mjpcEcrireRest(url,options,cb){
  var quand=Date.now();
  fetch(url,options).then(function(r){
    if(cb)cb({etat:r.ok?MJPC_ISSUE.ACCEPTEE:MJPC_ISSUE.REFUSEE,status:r.status,url:url,quand:quand});
  }).catch(function(){
    if(cb)cb({etat:MJPC_ISSUE.PANNE,status:0,url:url,quand:quand});
  });
}

var MJPC_CORE_VERSION="1.2.0";
// ═══════════════════════════════ fin MJPC-CORE ══════════════════════════════
