// ═══════════════════════════════════════════════════════════════════════════
// MJPC-CORE v1.4.0 (2026-08-01) — socle commun de l'écosystème MJPC
// v1.4.0 : + §12 zone prompt IA (composition, persistance, validation, injection) —
// v1.3.0 : + §11 coffre (dérivation de clé, chiffrement, empreinte — WebCrypto) —
//          la protection est dans la donnée, pas dans le mur : le hub peut rester
//          ouvert, il ne montre plus que de l'illisible. Prépare M-SÉCU-2/3.
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
  /* CORRECTION CONSCIENCE (30/07) — le verdict se CALCULE dans la cha\u00eene, le callback
     est appel\u00e9 APR\u00c8S, dans un maillon s\u00e9par\u00e9. Avant : `.then(A).catch(B)` avec cb
     appel\u00e9 DANS A — si quoi que ce soit levait en aval (bug d'affichage, globale
     manquante), le catch destin\u00e9 aux pannes r\u00e9seau attrapait ce bug et rappelait cb
     avec un verdict PANNE : callback jou\u00e9 DEUX FOIS et verdict FAUX (prouv\u00e9 : serveur
     200, cb re\u00e7oit « acceptee » puis « panne »). C'est la famille m\u00eame du d\u00e9faut que
     ce morceau r\u00e9pare : une erreur qui se d\u00e9guise en une autre.
     Le second argument de `.then` ne capture QUE le rejet du fetch, jamais le premier
     handler. Si cb l\u00e8ve, l'erreur reste visible en console et ne falsifie plus rien. */
  var quand=Date.now();
  fetch(url,options).then(function(r){
    return {etat:r.ok?MJPC_ISSUE.ACCEPTEE:MJPC_ISSUE.REFUSEE,status:r.status,url:url,quand:quand};
  },function(){
    return {etat:MJPC_ISSUE.PANNE,status:0,url:url,quand:quand};
  }).then(function(issue){
    if(cb)cb(issue);
  });
}

// ── 11. Coffre : dérivation, chiffrement, empreinte (v1.3.0) ──
// (Le canon porte deux sections « 8 » — dette de numérotation connue, non corrigée
//  ici pour ne pas toucher l'existant ; cette section est la 11.)
// Modèle éprouvé des conventions de stage : le serveur ne stocke que de l'illisible,
// chiffré SUR L'APPAREIL avec une clé qui n'est JAMAIS envoyée. WebCrypto n'existe
// que sur https:// et localhost — toute entrée passe par mjpcCryptoDispo(), et
// l'absence se DIT (jamais d'échec muet).
// Discipline de promesses (leçon mjpcEcrireRest du 30/07) : jamais un .catch qui
// avalerait un bug d'aval — les rejets remontent à l'appelant, qui décide.
var MJPC_COFFRE_SEL_DERIVATION="mjpc-coffre-derivation-v1"; // sel constant : la même clé saisie donne la même clé dérivée sur tout appareil
var MJPC_COFFRE_ITER_CLE=310000;      // PBKDF2 de la clé de chiffrement
var MJPC_COFFRE_ITER_EMPREINTE=100000; // PBKDF2 d'une empreinte (sel PAR ENTRÉE fourni par l'appelant)

function mjpcCryptoDispo(){
  return !!(typeof crypto!=="undefined"&&crypto.subtle&&crypto.getRandomValues);
}
function _mjpcTxt(s){return new TextEncoder().encode(String(s));}
function _mjpcB64(buf){var b="",a=new Uint8Array(buf);for(var i=0;i<a.length;i++)b+=String.fromCharCode(a[i]);return btoa(b);}
function _mjpcDeB64(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;}
function _mjpcHex(buf){var a=new Uint8Array(buf),h="";for(var i=0;i<a.length;i++)h+=("0"+a[i].toString(16)).slice(-2);return h;}

// Dérive la clé AES-GCM 256 du secret saisi. → Promise<CryptoKey>
function mjpcDeriverCle(secret){
  return crypto.subtle.importKey("raw",_mjpcTxt(secret),"PBKDF2",false,["deriveKey"])
    .then(function(base){
      return crypto.subtle.deriveKey(
        {name:"PBKDF2",salt:_mjpcTxt(MJPC_COFFRE_SEL_DERIVATION),iterations:MJPC_COFFRE_ITER_CLE,hash:"SHA-256"},
        base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
    });
}
// Chiffre un texte. → Promise<"v1."+b64(iv)+"."+b64(chiffré)> — IV aléatoire par appel.
function mjpcChiffrer(cle,texte){
  var iv=crypto.getRandomValues(new Uint8Array(12));
  return crypto.subtle.encrypt({name:"AES-GCM",iv:iv},cle,_mjpcTxt(texte))
    .then(function(ct){return "v1."+_mjpcB64(iv)+"."+_mjpcB64(ct);});
}
// Déchiffre un paquet "v1.iv.ct". → Promise<texte> — REJETTE si la clé est fausse
// (AES-GCM est authentifié : c'est ce qui rend le canari fiable) ou le paquet corrompu.
function mjpcDechiffrer(cle,paquet){
  var p=String(paquet||"").split(".");
  if(p.length!==3||p[0]!=="v1")return Promise.reject(new Error("paquet inconnu"));
  return crypto.subtle.decrypt({name:"AES-GCM",iv:_mjpcDeB64(p[1])},cle,_mjpcDeB64(p[2]))
    .then(function(buf){return new TextDecoder().decode(buf);});
}
// Sel aléatoire d'empreinte (16 octets, hex) — un par entrée, stocké à côté d'elle.
function mjpcSelAleatoire(){
  return _mjpcHex(crypto.getRandomValues(new Uint8Array(16)));
}
// Empreinte d'un texte : PBKDF2-SHA-256, sel PAR ENTRÉE, 32 octets hex. → Promise<hex>
// Vérifiable par toute app (le sel est lisible) SANS la clé du coffre. Contre un
// secret court (code à 4 chiffres), le sel par entrée interdit la table précalculée
// et le coût par essai ralentit l'essai exhaustif — il ne l'empêche pas : l'objectif
// est de ne plus EXPOSER le clair, pas de rendre un code de 4 chiffres incassable.
function mjpcEmpreinte(texte,selHex){
  return crypto.subtle.importKey("raw",_mjpcTxt(texte),"PBKDF2",false,["deriveBits"])
    .then(function(base){
      return crypto.subtle.deriveBits(
        {name:"PBKDF2",salt:_mjpcTxt("mjpc-empreinte-v1|"+selHex),iterations:MJPC_COFFRE_ITER_EMPREINTE,hash:"SHA-256"},
        base,256);
    })
    .then(function(bits){return _mjpcHex(bits);});
}


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

var MJPC_CORE_VERSION="1.4.0";
// ═══════════════════════════════ fin MJPC-CORE ══════════════════════════════
