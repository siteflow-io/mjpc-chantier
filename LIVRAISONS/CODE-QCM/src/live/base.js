/* ═══════════════ QCM-1 · SOCLE — la séance réelle sous les écrans de la maquette ═══════════════
   Ce fichier remplace le scénario écrit d'avance (src/scenario.js de la maquette) : SCN garde les noms de fonctions que les écrans
   appellent déjà, mais tout se calcule sur la vraie séance, lue dans la base (mjpc-hub, DB_ROOT « qcm », COMMUN §3.1).
   ACT (les gestes de Paul) et ELV (les gestes de l'élève) écrivent dans la base ; chaque page abonnée voit le changement sans
   rechargement (LIVE.abonner). Un élève se désigne par son eleveSlug (sanMJPC du « NOM Prénom » de /classes).
   Le contrat : MANDATS/CODE-QCM/COMMUN.md §3 (sur main) et LIVRAISONS/CODE-QCM/CONTRAT-CHANGEMENTS.md (C1 à C4).
   La séance de la 7.7.1 reste lisible : ses champs (phase, qIdx, phaseStart, paused, absents, reponses, autoevals, papier, notifs,
   etat « en_cours » / « terminee », evalSnapshot) sont lus tels quels, et tenus à jour à chaque passage. */

/* ── La base : la configuration de la 7.7.1, telle quelle ── */
var FIREBASE_CONFIG = {apiKey:"AIzaSyD2ZcVITz80UTUZWiWmTg13PGLyPNMV6MY",authDomain:"mjpc-hub.firebaseapp.com",databaseURL:"https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app",projectId:"mjpc-hub",storageBucket:"mjpc-hub.firebasestorage.app",messagingSenderId:"1037162673483",appId:"1:1037162673483:web:19b61a10dd7a1c21d9a4ce"};
var DB_ROOT = "qcm";
var db = null;
try { if(typeof firebase !== "undefined"){ if(!firebase.apps || !firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG); db = firebase.database(); } } catch(e){ console.error("QCM : la base ne s'ouvre pas", e); }
if(typeof sanMJPC === "undefined") var sanMJPC = function(s){ return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""); };

/* ══════════════════════ LIVE : ce qui est lu, et qui le regarde ══════════════════════ */
// LIVE s'appelle aussi : LIVE() est vrai dans l'app (l'aide de QCM-2 du même nom : « vrai si SCN.eleves existe »)
var LIVE = (function(){
  var L = function(){ return typeof SCN !== "undefined" && typeof SCN.eleves === "function"; };
  L.pret = false; L.offset = 0; L.journal = [];
  // l'adresse : ?mode=prof, &view=board, &view=phone, ?mode=eleve, &qr= (le hash d'abord, comme la 7.7.1 : getURLParams)
  L.params = function(){
    var hash = (location.hash || "").replace(/^#/, ""), search = (location.search || "").replace(/^\?/, "");
    return new URLSearchParams((search ? search + (hash ? "&" : "") : "") + hash);
  };
  L.appareil = function(){
    var p = L.params(), md = p.get("mode"), vw = p.get("view");
    if(md === "prof") return vw === "board" ? "tableau" : vw === "phone" ? "telephone" : "console";
    if(md === "eleve") return "tablette";
    return L.modeChoisi || "accueil";
  };
  // ce qui est lu : les classes, les évaluations, les séances, les séances actives, les réglages, la taxonomie
  L.d = {classes:null, evaluations:{}, sessions:{}, sessionActive:{}, settings:{}, competences:null, codes:null};
  L.classeSlug = null;   // la classe regardée (tablette : celle de l'élève ; console : celle de la séance pilotée)
  L.sid = null;          // la séance regardée
  var abonnes = [], prevu = false;
  L.abonner = function(f){ abonnes.push(f); return function(){ abonnes = abonnes.filter(function(g){ return g !== f; }); }; };
  L.changer = function(){
    if(prevu) return; prevu = true;
    (typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout)(function(){ prevu = false; L.version = (L.version || 0) + 1; abonnes.slice().forEach(function(f){ try { f(); } catch(e){ console.error(e); } }); });
  };
  L.maintenant = function(){ return Date.now() + (L.offset || 0); };
  function ecouter(chemin, cle, transformer){
    if(!db) return;
    db.ref(chemin).on("value", function(s){ var v = s.val(); L.d[cle] = transformer ? transformer(v) : (v || {}); L.pret = L.d.classes !== null; L.changer(); },
      function(e){ console.error("QCM : lecture refusée " + chemin, e); });
  }
  L.demarrer = function(){
    if(L.demarre || !db) return; L.demarre = true;
    db.ref(".info/serverTimeOffset").on("value", function(s){ L.offset = s.val() || 0; });
    ecouter("classes", "classes", function(v){ return v || {}; });
    ecouter(DB_ROOT + "/evaluations", "evaluations");
    ecouter(DB_ROOT + "/sessions", "sessions");
    ecouter(DB_ROOT + "/sessionActive", "sessionActive");
    ecouter(DB_ROOT + "/settings", "settings");
    ecouter("taxonomie/competences", "competences", function(v){ return v || null; });
    // le tic des chronos : une fois par seconde, seulement pendant un temps compté
    setInterval(function(){ var e = SCN.etat(); if(e && e.duree && ["pause", "fin", "avant"].indexOf(e.ph) < 0) L.changer(); }, 1000);
  };
  // les codes ne se lisent qu'à l'entrée d'un élève (la 7.7.1 : EleveLogin, db.ref("codes").once)
  L.lireCodes = function(){ if(!db) return Promise.resolve({}); return db.ref("codes").once("value").then(function(s){ L.d.codes = s.val() || {}; return L.d.codes; }, function(){ return {}; }); };
  L.log = function(){ var a = Array.prototype.slice.call(arguments); L.journal.push([Date.now()].concat(a)); if(L.journal.length > 400) L.journal.shift(); };
  return L;
})();

/* ── Écrire : un seul passage, qui journalise ── */
// le vrai Firebase refuse une écriture qui porte undefined, NaN ou une fonction (le faux hub les efface sans rien dire) : on les retire avant
function nettoyerQCM(v){
  if(v === undefined || (typeof v === "number" && !isFinite(v)) || typeof v === "function") return null;
  if(v === null || typeof v !== "object") return v;
  if(Array.isArray(v)) return v.map(nettoyerQCM);
  var o = {}; Object.keys(v).forEach(function(k){ var x = nettoyerQCM(v[k]); if(x !== null) o[k] = x; }); return o;
}
function ecrireQCM(maj, quoi){
  LIVE.log("écrit", quoi || "", Object.keys(maj));
  var propre = {}; Object.keys(maj).forEach(function(k){ propre[k] = nettoyerQCM(maj[k]); }); maj = propre;
  if(!db) return Promise.resolve();
  return db.ref(DB_ROOT).update(maj).catch(function(e){ console.error("QCM : écriture refusée (" + (quoi || "") + ")", e); throw e; });
}
function cheminS(sid, sous){ return "/sessions/" + sid + (sous ? "/" + sous : ""); }

/* ══════════════════════ SCN : les fonctions de la maquette, sur la séance réelle ══════════════════════ */
var SCN = (function(){
  var S = {LIVE:true};   // LIVE : la séance réelle (QCM-2 et QCM-3 le testent : SCN.LIVE)
  /* ── Les aides de la maquette, telles quelles ── */
  function sec(h){ var p = String(h).split(":").map(Number); return p[0] * 3600 + p[1] * 60 + (p[2] || 0); }
  function hm(s){ s = Math.round(s / 60) * 60; var h = Math.floor(s / 3600) % 24, mn = Math.floor((s % 3600) / 60); return h + ":" + (mn < 10 ? "0" : "") + mn; }
  function cle(d, h){ var p = String(d).split("/"); return p[2] + p[1] + p[0] + " " + (h || "00:00"); }
  function deux(n){ return (n < 10 ? "0" : "") + n; }
  function dateFr(ms){ var d = new Date(ms); return deux(d.getDate()) + "/" + deux(d.getMonth() + 1) + "/" + d.getFullYear(); }
  function heureFr(ms, s){ var d = new Date(ms); return deux(d.getHours()) + ":" + deux(d.getMinutes()) + (s ? ":" + deux(d.getSeconds()) : ""); }
  S.sec = sec; S.hm = hm; S.cle = cle; S.dateFr = dateFr; S.heureFr = heureFr;
  S.fr1 = function(x){ return (Math.round(x * 10) / 10).toFixed(1).replace(".", ",").replace(",0", ""); };
  var IDX = ["rouge", "orange", "bleu", "vert"];
  S.IDX_MAITRISE = IDX;
  S.maitriseDe = function(sur20){ return sur20 >= 15 ? "vert" : sur20 >= 10 ? "bleu" : sur20 >= 5 ? "orange" : "rouge"; };
  S.LIB_MAITRISE = {vert:"Très bonne maîtrise", bleu:"Maîtrise satisfaisante", orange:"Maîtrise fragile", rouge:"Maîtrise insuffisante"};
  S.EM_MAITRISE = {vert:"🟢", bleu:"🔵", orange:"🟠", rouge:"🔴"};
  // les durées de la séance (Réglages) : celles de la base, sinon celles de la maquette
  var DUREES_DEFAUT = {installation:5 * 60, estimAttest:3 * 60, correctionParQ:60, coevalBilan:2 * 60, decompte:3, b:5, entre:15};
  S.DUREES = Object.assign({}, DUREES_DEFAUT);
  function durees(){ var d = (LIVE.d.settings || {}).durees; S.DUREES = Object.assign({}, DUREES_DEFAUT, d || {}); return S.DUREES; }
  S.durees = durees;
  // SCN.DUREES se relit à chaque changement de la base (les Réglages peuvent changer pendant la séance)
  LIVE.abonner(durees);

  /* ── Les classes et leurs élèves ── */
  // la classe d'une séance : sa clé au hub (« 3 ESSAI ») ; une séance d'avant le 14/07 la porte en slug (« 3_essai », « 3-essai ») : on la retrouve
  function cleDeClasse(x){ var c = LIVE.d.classes || {}; if(!x) return null; if(c[x]) return x; var s = sanMJPC(x); return Object.keys(c).filter(function(k){ return sanMJPC(k) === s; })[0] || x; }
  S.cleDeClasse = cleDeClasse;
  // les listes de la classe se calculent une fois par version de /classes (elles servent des centaines de fois par seconde)
  var CACHE = {classes:null, rosters:{}, indexe:false};
  function cache(){ if(CACHE.classes !== LIVE.d.classes){ CACHE.classes = LIVE.d.classes; CACHE.rosters = {}; CACHE.indexe = false; } return CACHE; }
  function rosterDe(classe){
    var C = cache(), k = cleDeClasse(classe); if(C.rosters[k]) return C.rosters[k].slice();
    var c = (LIVE.d.classes || {})[k]; if(!c) return [];
    var l = typeof extractEleves === "function" ? extractEleves(c, []) : (Array.isArray(c.eleves) ? c.eleves : []).map(function(e){ return typeof e === "string" ? e : (e && (e.nomComplet || e.name)) || null; }).filter(Boolean);
    C.rosters[k] = l.slice().sort(function(a, b){ return a.localeCompare(b, "fr"); });
    return C.rosters[k].slice();
  }
  S.classes = function(){ var c = LIVE.d.classes || {}; return Object.keys(c).filter(function(k){ return c[k] && !c[k].archivee && k.charAt(0) !== "_"; }).sort(function(a, b){ return a.localeCompare(b, "fr"); }); };
  S.roster = rosterDe;
  var NOMS = {};   // eleveSlug → « NOM Prénom », toutes classes
  function indexer(){ var C = cache(); if(C.indexe) return; C.indexe = true; var c = LIVE.d.classes || {}; Object.keys(c).forEach(function(k){ rosterDe(k).forEach(function(n){ NOMS[sanMJPC(n)] = n; }); }); }
  S.classe = function(){ var s = S.sess(); return (s && s.classeSlug) || LIVE.classeSlug || null; };
  S.CLASSE = null;
  S.niveauClasse = function(classe){ var c = (LIVE.d.classes || {})[classe || S.classe()] || {}; return c.niveau || (String(classe || S.classe() || "").match(/^\s*(\d)/) ? RegExp.$1 + "e" : null); };
  // les élèves de la séance : sa liste propre (rattrapage), sinon la classe ; triés
  S.eleves = function(sid){
    var s = S.sess(sid), le = s && s.lancee && s.lancee.eleves; var l = le ? (Array.isArray(le) ? le : Object.values(le)).filter(Boolean).slice() : rosterDe((s && s.classeSlug) || S.classe()).map(sanMJPC);
    indexer(); return l.sort(function(a, b){ return S.nomDe(a).localeCompare(S.nomDe(b), "fr"); });
  };
  // « NOM Prénom » ; le prénom : les mots après le dernier mot en capitales
  S.nomDe = function(x){ if(!x) return ""; if(NOMS[x]) return NOMS[x]; indexer(); return NOMS[x] || NOMS[sanMJPC(x)] || String(x); };
  S.pre = function(x){ var n = S.nomDe(x), m = n.split(" "), i = 0; while(i < m.length - 1 && m[i] === m[i].toUpperCase() && /[A-ZÀ-Ý]/.test(m[i])) i++; return m.slice(i).join(" ") || n; };
  S.nom = function(x){ var n = S.nomDe(x), p = S.pre(x); return n.slice(0, n.length - p.length).trim(); };
  S.sexe = function(x){ var sl = sanMJPC(S.nomDe(x)), c = (LIVE.d.classes || {})[cleDeClasse(S.classe())] || {}, am = (c.amenagements || {})[sl] || {}; return am.sexe === "f" ? "F" : am.sexe === "m" ? "M" : null; };
  S.exclusions = function(x, classe){ var c = (LIVE.d.classes || {})[cleDeClasse(classe || S.classe())] || {}, e = (c.exclusions || {})[x]; return Array.isArray(e) ? e : e ? Object.values(e) : []; };

  /* ── La séance regardée ── */
  S.sid = function(){ if(LIVE.sid) return LIVE.sid; var c = LIVE.classeSlug; return c ? (LIVE.d.sessionActive || {})[c] || null : null; };
  S.sess = function(sid){ sid = sid || S.sid(); var s = sid ? (LIVE.d.sessions || {})[sid] : null; if(s && !s.id) s.id = sid; return s || null; };
  S.etat = function(sid){ var s = S.sess(sid); if(!s) return null;
    if(s.deroule) return s.deroule;
    // une séance de la 7.7.1 : son état d'après phase / qIdx
    var ph = {idle:"entree", reflexion:"reflexion", reponse:"reponse", attente:"close", autoeval:"estim", correction:"revele", finie:"bilan"}[s.phase] || "avant";
    if(s.etat === "terminee") ph = "fin";
    return {ph:ph, qi:s.qIdx != null ? s.qIdx : null, tour:ph === "reponse" ? 1 : null, cote:null, depuis:s.phaseStart || null, duree:null, legacy:true};
  };
  // le temps qui reste au temps en cours, en secondes (le chrono tient si la page se recharge : il se recalcule de depuis + duree)
  S.reste = function(e){ e = e || S.etat(); if(!e || !e.duree) return e && e.reprise ? e.reprise.reste : null; if(e.ph === "pause") return e.reprise ? e.reprise.reste : null;
    return Math.max(0, Math.ceil(e.duree - (LIVE.maintenant() - (e.depuis || 0)) / 1000)); };
  // l'évaluation de la séance, gardée tant que la séance et les évaluations ne changent pas (elle sert des centaines de fois par rendu)
  var MEMO_EV = {};
  S.ev = function(sid){ var s = S.sess(sid); if(!s) return null; var m = MEMO_EV[s.id];
    if(m && m.s === s && m.e === LIVE.d.evaluations) return m.v;
    var v = S.evalDeSeance(s.id); MEMO_EV[s.id] = {s:s, e:LIVE.d.evaluations, v:v}; return v; };
  S.places = function(sid){ var s = S.sess(sid), p = (s && s.places) || {};
    return Object.keys(p).map(Number).filter(function(n){ return !isNaN(n); }).sort(function(a, b){ return a - b; }).map(function(n){ var x = p[n] || {}; return {n:n, g:x.g || null, d:x.d || null, seul:!!x.seul}; }); };
  // les binômes au format de la maquette : [[« NOM Prénom », « NOM Prénom » ou null], …], tablette par tablette
  S.paires = function(sid){ return S.places(sid).map(function(t){ return [t.g ? S.nomDe(t.g) : null, t.d ? S.nomDe(t.d) : null]; }); };
  S.tabletteDe = function(x, sid){ var r = null; S.places(sid).forEach(function(t){ if(t.g === x) r = {n:t.n, cote:"g"}; else if(t.d === x) r = {n:t.n, cote:"d"}; }); return r; };
  S.voisinDe = function(x, sid){ var t = S.tabletteDe(x, sid); if(!t) return null; var p = S.places(sid).filter(function(y){ return y.n === t.n; })[0]; return t.cote === "g" ? p.d : p.g; };
  S.cote = function(x, sid){ var t = S.tabletteDe(x, sid); return t ? t.cote : null; };
  S.premierCote = function(qi, sid){ var s = S.sess(sid); return ((s && s.premier) || {})[qi] || "g"; };
  S.coteDuTour = function(qi, tour, sid){ var p = S.premierCote(qi, sid); return tour === 2 ? (p === "g" ? "d" : "g") : p; };
  // une liste lue dans la base revient en objet si elle a des trous : on la relit toujours en liste
  function liste(v){ return !v ? [] : Array.isArray(v) ? v.filter(function(x){ return x != null; }) : Object.keys(v).map(function(k){ return v[k]; }).filter(function(x){ return x != null; }); }
  S.liste = liste;
  S.absents = function(sid){ var s = S.sess(sid); return liste(s && s.absents); };
  S.partis = function(sid){ var s = S.sess(sid); return (s && s.partis) || {}; };
  S.presents = function(k, sid){ var s = S.sess(sid); if(!s) return []; var abs = S.absents(sid), pt = S.partis(sid);
    return S.eleves(sid).filter(function(x){ return abs.indexOf(x) < 0 && !pt[x]; }); };
  // les présents qui sont entrés sur une tablette : eux seuls peuvent cocher, lire, estimer ; ceux qui ne sont jamais entrés ne bloquent rien
  // (une séance de la 7.7.1, sans « entres » : tous les présents)
  S.actifs = function(k, sid){ var s = S.sess(sid); if(!s) return []; var en = s.entres || null, p = S.presents(k, sid); return en ? p.filter(function(x){ return !!en[x]; }) : p; };
  S.ecartees = function(sid){ var s = S.sess(sid); return liste(s && s.ecartees).map(Number); };
  S.annulees = function(sid){ var s = S.sess(sid); return liste(s && s.annulees).map(Number); };
  S.lancees = function(sid){ var s = S.sess(sid); return (s && s.questionsLancees) || {}; };

  /* ── Les évaluations ── */
  S.DEMO = {id:"demo", titre:"🎓 Démo — apprendre le déroulé", mode:"strict", demo:true, niveau:null, questions:[
    {enonce:"Quelle est la capitale de l'Italie ?", choix:["Milan","Naples","Rome","Venise"], bonnes:[2], niveau:"facile", reflexion:20, reponse:15, competences:[]},
    {enonce:"Lesquelles sont des capitales européennes ?", choix:["Madrid","Genève","Berlin","Sydney"], bonnes:[0,2], niveau:"standard", reflexion:30, reponse:20, competences:[]},
    {enonce:"Pourquoi l'araignée n'est-elle pas un insecte ?", choix:["Parce qu'elle a six pattes","Parce qu'elle a huit pattes","Parce qu'elle tisse une toile","Parce qu'elle est trop grande"], bonnes:[1], niveau:"standard", reflexion:30, reponse:20, competences:[]}]};
  // le chapitre : « <niveau>-ch<n> » ; son libellé, s'il a une fiche au hub (sinon « 4e · Ch. 1 »)
  S.chapitreLib = function(id){ if(!id) return null; var m = /^(\d)e-ch(\d+)$/.exec(id); return m ? m[1] + "e · Ch. " + m[2] : String(id); };
  S.niveauDuChapitre = function(id){ var m = /^(\d)e-ch\d+$/.exec(id || ""); return m ? m[1] + "e" : null; };
  function versMaquette(id, e){
    if(!e) return null;
    var qs = (Array.isArray(e.questions) ? e.questions : Object.values(e.questions || {})).map(function(q){ q = q || {};
      return Object.assign({}, q, {choix:Array.isArray(q.choix) ? q.choix : Object.values(q.choix || {}), bonnes:(Array.isArray(q.bonnes) ? q.bonnes : Object.values(q.bonnes || {})).map(Number),
        competences:Array.isArray(q.competences) ? q.competences : Object.values(q.competences || {})}); });
    var comps = []; qs.forEach(function(q){ q.competences.forEach(function(c){ if(comps.indexOf(c) < 0) comps.push(c); }); });
    return Object.assign({}, e, {id:id, titre:e.titre || "Évaluation", mode:e.mode || null, chapitre:e.chapitre || null, chap:e.chapitre ? S.chapitreLib(e.chapitre) : null,
      niveau:S.niveauDuChapitre(e.chapitre) || e.niveau || null, cree:e.createdAt ? dateFr(e.createdAt) : null, competences:comps, questions:qs, demo:id === "demo" || !!e.demo});
  }
  S.versMaquette = versMaquette;
  S.evals = function(){
    var E = LIVE.d.evaluations || {}, l = [];
    var demo = E.demo ? versMaquette("demo", E.demo) : S.DEMO;
    Object.keys(E).filter(function(id){ return id !== "demo" && id.charAt(0) !== "_"; }).sort(function(a, b){ return (E[b].createdAt || 0) - (E[a].createdAt || 0); })
      .forEach(function(id){ l.push(versMaquette(id, E[id])); });
    S.DEMO_COURANTE = demo;
    return l;
  };
  S.evalParId = function(id){ if(!id) return null; var E = LIVE.d.evaluations || {}; if(id === "demo") return E.demo ? versMaquette("demo", E.demo) : S.DEMO; return E[id] ? versMaquette(id, E[id]) : null; };
  // l'énoncé qui fait foi pour une séance : son instantané figé, sinon l'évaluation (la 7.7.1 : evalDeSession)
  S.evalDeSeance = function(id){ var s = S.sess(id); if(!s) return null; if(s.evalSnapshot) return versMaquette(s.evalId, Object.assign({}, S.evalParId(s.evalId) || {}, s.evalSnapshot)); return S.evalParId(s.evalId); };
  S.evalDu = function(){ return S.ev() || S.DEMO; };
  // ce qu'il manque pour lancer (cadrage 741) : le chapitre, et pour chaque question ses deux temps et ses compétences
  S.manques = function(ev){ var m = []; if(!ev) return ["l'évaluation"]; if(!ev.chapitre && !ev.demo) m.push("le chapitre");
    (ev.questions || []).forEach(function(q, i){ if(!ev.demo && (!q.reflexion || !q.reponse)) m.push("les temps de la question " + (i + 1)); if(!ev.demo && !(q.competences || []).length) m.push("les compétences de la question " + (i + 1)); });
    return m; };

  /* ── Les compétences : taxonomie/competences, trouvées par leur id, jamais par leur place ── */
  S.competences = function(){ var t = LIVE.d.competences || {}, l = [];
    ["francaisC4", "transversales"].forEach(function(liste){ (Array.isArray(t[liste]) ? t[liste] : Object.values(t[liste] || {})).forEach(function(g){ if(!g) return;
      (Array.isArray(g.items) ? g.items : Object.values(g.items || {})).forEach(function(it){ if(it && it.id) l.push({id:it.id, libelle:it.libelle, libelleEleve:it.libelleEleve || null, actif:it.actif !== false, groupe:g.libelle, liste:liste}); }); }); });
    return l; };
  S.competence = function(id){ return S.competences().filter(function(c){ return c.id === id; })[0] || null; };
  S.libelleEleve = function(id){ var c = S.competence(id); return (c && c.libelleEleve) || (typeof LIBELLES_ELEVE !== "undefined" && LIBELLES_ELEVE[id]) || (c && c.libelle) || id; };
  S.competenceValide = function(id){ var c = S.competence(id); return !!(c && c.actif); };

  /* ── Les temps ── */
  function niveauChrono(niv){ var l = (LIVE.d.settings || {}).niveaux || []; l = Array.isArray(l) ? l : Object.values(l); var n = l.filter(function(x){ return x && x.id === niv; })[0]; return n && n.chrono ? n.chrono : {facile:10, standard:15, approfondi:20, expert:30}[niv] || 15; }
  S.tempsDe = function(qi, k, surcharges, sid){
    var ev = S.ev(sid) || S.DEMO, q = ev.questions[qi] || {}, s = S.sess(sid), t = ((s && s.temps) || {})[qi] || {};
    return Object.assign({reflexion:q.reflexion || niveauChrono(q.niveau), reponse:q.reponse || 20}, t, (surcharges || {})[qi] || {});
  };
  S.dureeEstimee = function(ev, seul){
    var D = durees(), q = 0, tours = seul ? 1 : 2;
    (ev.questions || []).forEach(function(x){ q += (x.reflexion || niveauChrono(x.niveau)) + tours * (D.decompte + (x.reponse || 20) + D.b) + D.entre; });
    var c = (ev.questions || []).length * D.correctionParQ, total = D.installation + q + D.estimAttest + c + (seul ? 0 : D.coevalBilan);
    return {questions:q, correction:c, total:total, min:Math.round(total / 60)};
  };
  // la fin de l'heure : celle réglée à l'appel, sinon le lancement + 55 min
  S.finHeure = function(k, sid){ var s = S.sess(sid); if(!s) return null; if(s.lancee && s.lancee.fin) return s.lancee.fin; return hm(sec(heureFr(s.date || LIVE.maintenant())) + 55 * 60); };
  S.FIN_HEURE = null;

  /* ── Les réponses ── */
  S.reponse = function(x, qi, sid){ var s = S.sess(sid); var r = (((s && s.reponses) || {})[qi] || {})[x]; return r && r.choix ? Object.assign({}, r, {choix:(Array.isArray(r.choix) ? r.choix : Object.values(r.choix)).map(Number)}) : null; };
  S.repondu = function(qi, k, sid){ var s = S.sess(sid); var r = ((s && s.reponses) || {})[qi] || {}; return S.presents(k, sid).filter(function(x){ return r[x] && r[x].choix; }); };
  function juste(choix, q){ if(!choix || choix === "aucun" || !q) return false; var a = choix.slice().map(Number).sort(), b = (q.bonnes || []).slice().map(Number).sort(); return a.length === b.length && a.every(function(v, i){ return v === b[i]; }); }
  S.juste = juste;
  S.justeTablette = function(x, qi, sid){ var r = S.reponse(x, qi, sid), ev = S.ev(sid); return !!(r && ev && juste(r.choix, ev.questions[qi])); };
  S.ditB = function(x, qi, sid){ var s = S.sess(sid); return ((((s && s.b) || {})[qi]) || {})[x] || null; };
  S.lecture = function(x, qi, sid){ var s = S.sess(sid), l = ((((s && s.lectures) || {})[qi]) || {})[x]; if(!l) return null;
    return Object.assign({}, l, {choix:l.choix === "aucun" ? "aucun" : (Array.isArray(l.choix) ? l.choix : Object.values(l.choix || {})).map(Number)}); };
  S.doitDireB = function(x, sid){ var e = S.etat(sid); if(!e || !x || e.qi == null) return false; var c = S.cote(x, sid);
    if(e.ph === "b") return c === (e.cote || S.coteDuTour(e.qi, e.tour || 1, sid)) && !S.ditB(x, e.qi, sid) && !!S.reponse(x, e.qi, sid);
    var b = e.bPour; return !!(b && Number(b.qi) === e.qi && b.cote === c && LIVE.maintenant() < b.jusqua && !S.ditB(x, e.qi, sid) && S.reponse(x, e.qi, sid)); };
  S.estimationDe = function(x, sid){ var s = S.sess(sid); return ((s && s.autoevals) || {})[x] || null; };
  S.coevalDe = function(x, sid){ var s = S.sess(sid); return ((s && s.coeval) || {})[x] || null; };
  S.attestDe = function(n, x, sid){ var s = S.sess(sid); return ((((s && s.attest) || {})[n]) || {})[x] || null; };
  S.trouveeDe = function(x, sid){ var s = S.sess(sid), t = ((s && s.trouvee) || {})[x]; return t == null ? null : Number(t); };
  // l'ordre des choix d'un élève : celui qui répond au 1er tour les voit dans l'ordre ; au 2e tour, mélangés (le même ordre à chaque rechargement)
  S.ordreChoix = function(x, qi, sid){
    var ev = S.ev(sid), n = ev && ev.questions[qi] ? ev.questions[qi].choix.length : 4, o = []; for(var i = 0; i < n; i++) o.push(i);
    if(S.cote(x, sid) === S.premierCote(qi, sid) || n < 2) return o;
    var graine = 0, t = (S.sid() || "") + "|" + x + "|" + qi; for(var j = 0; j < t.length; j++) graine = (graine * 31 + t.charCodeAt(j)) >>> 0;
    for(var k = n - 1; k > 0; k--){ graine = (graine * 1103515245 + 12345) >>> 0; var r = graine % (k + 1); var tmp = o[k]; o[k] = o[r]; o[r] = tmp; }
    if(o.every(function(v, i){ return v === i; })) o.push(o.shift());
    return o;
  };
  // l'ordre de la correction : fixé au lancement de la correction ; avant, de la plus ratée à la mieux réussie sur les tablettes
  S.ordreCorr = function(sid){ var s = S.sess(sid); if(s && s.ordreCorr) return (Array.isArray(s.ordreCorr) ? s.ordreCorr : Object.values(s.ordreCorr)).map(Number);
    var ev = S.ev(sid); if(!ev) return []; var ec = S.ecartees(sid), pres = S.presents(null, sid);
    var qs = ev.questions.map(function(q, i){ return i; }).filter(function(i){ return ec.indexOf(i) < 0; });
    var taux = {}; qs.forEach(function(i){ var rep = pres.filter(function(x){ return S.reponse(x, i, sid); }); taux[i] = rep.length ? rep.filter(function(x){ return S.justeTablette(x, i, sid); }).length / rep.length : 1; });
    return qs.sort(function(a, b){ return taux[a] - taux[b] || a - b; }); };
  S.corrigeesAu = function(k, sid){ var s = S.sess(sid); return liste(s && s.revelees).map(Number); };

  /* ── La note : la règle (288 à 293, 303, 332) ── */
  // st par question : j juste, t « Trouvée au dernier moment », f faux, a « aucun de ces choix », n pas encore corrigée, x pas posée (parti avant)
  // un élève était-il parti à l'instant t ? (partis, puis presence_history : un retour retire la clé de partis, l'historique garde le départ)
  S.partiA = function(x, t, sid){ var s = S.sess(sid); if(!s || !t) return false; var pt = (s.partis || {})[x]; if(pt && pt <= t) return true;
    var hs = (s.presence_history || {})[x]; if(!hs) return false; var ev = Object.keys(hs).map(function(k){ return hs[k]; }).filter(function(e){ return e && e.ts <= t; }).sort(function(a, b){ return a.ts - b.ts; });
    if(!ev.length) return false; var dernier = ev[ev.length - 1]; return dernier.etat === "absent" && liste(s.absents).indexOf(x) < 0; };
  // « Trouvée au dernier moment » : la question fixée à la révélation (trouvee/<slug>) ; sinon la première, dans l'ordre de la correction,
  // dont la feuille, lue, est fausse et la tablette entièrement juste ; une fois par évaluation
  S.trouveeCalculee = function(x, sid){ var tr = S.trouveeDe(x, sid); if(tr != null) return tr; var ev = S.evalDeSeance(sid || S.sid()); if(!ev) return null; var r = null;
    S.corrigeesAu(null, sid).some(function(qi){ var q = ev.questions[qi], lu = S.lecture(x, qi, sid), rep = S.reponse(x, qi, sid);
      if(lu && lu.choix !== "aucun" && !juste(lu.choix, q) && rep && juste(rep.choix, q)){ r = qi; return true; } return false; });
    return r; };
  function partiel(choix, q){ if(!choix || choix === "aucun" || !(q.bonnes || []).length) return 0; var b = q.bonnes.map(Number), bon = 0, mauvais = 0;
    choix.forEach(function(c){ if(b.indexOf(Number(c)) >= 0) bon++; else mauvais++; }); return Math.max(0, bon - mauvais) / b.length; }
  // une séance de la 7.7.1 (sans deroule) : la note se lit avec ce qu'elle a — la recopie de la feuille (papier/<slug>/choix), sinon la tablette
  function noteAncienne(x, s, ev){
    var pap = ((s.papier || {})[x] || {}).choix, st = [], pts = [];
    if(pap && !Array.isArray(pap)) pap = Object.keys(pap).map(function(k){ return pap[k]; });
    ev.questions.forEach(function(q, qi){ var c = pap ? (pap[qi] ? (Array.isArray(pap[qi]) ? pap[qi] : Object.values(pap[qi])).map(Number) : []) : ((S.reponse(x, qi, s.id) || {}).choix || null);
      // une correction du soir (« Que dit la feuille ? » : lectures/<qi>/<slug>) l'emporte
      var lu = S.lecture(x, qi, s.id); if(lu){ if(lu.choix === "aucun"){ st.push("a"); pts.push(0); return; } c = lu.choix; }
      if(c == null){ st.push("f"); pts.push(0); return; }
      if(juste(c, q)){ st.push("j"); pts.push(1); } else { st.push("f"); pts.push(ev.mode === "partiel" ? partiel(c, q) : 0); } });
    var n = pts.reduce(function(a, b){ return a + b; }, 0), total = ev.questions.filter(function(q){ return !q.bonus; }).length, sur20 = total ? Math.min(20, n * 20 / total) : 0, comp = {};
    ev.questions.forEach(function(q, qi){ (q.competences || []).forEach(function(c){ comp[c] = comp[c] || {n:0, max:0}; if(!q.bonus) comp[c].max++; comp[c].n += pts[qi]; }); });
    return {p:x, st:st, pts:pts, n:n, total:total, complet:true, sur20:sur20, maitrise:S.maitriseDe(Math.round(sur20 * 10) / 10), comp:comp, corrigees:[], annulees:[], ecartees:[], trouvee:null, ancienne:true};
  }
  S.note = function(x, k, sid){
    var s = S.sess(sid), ev = S.evalDeSeance(sid || S.sid()); if(!s || !ev) return null;
    if(!s.deroule && !s.lancee) return noteAncienne(x, s, ev);
    var an = S.annulees(sid), ec = S.ecartees(sid), corr = S.corrigeesAu(k, sid), lanc = S.lancees(sid);
    var papier = s.lancee && s.lancee.mode === "papier", tr = papier ? null : S.trouveeCalculee(x, sid), st = [], pts = [];
    ev.questions.forEach(function(q, qi){
      var rep = S.reponse(x, qi, sid);
      if(!rep && lanc[qi] && S.partiA(x, lanc[qi], sid)){ st.push("x"); pts.push(null); return; }
      if(papier){ var g = ((s.papier || {})[x] || {})[qi]; if(g == null){ st.push("n"); pts.push(null); } else { st.push(g === "j" || g === true || g === 1 ? "j" : "f"); pts.push(st[st.length - 1] === "j" ? 1 : 0); } return; }
      if(corr.indexOf(qi) < 0){ st.push("n"); pts.push(null); return; }
      var lu = S.lecture(x, qi, sid);
      // sans lecture de la feuille, pas de note (cadrage : la note, c'est la feuille)
      if(!lu){ st.push("n"); pts.push(null); return; }
      if(lu.choix === "aucun"){ st.push("a"); pts.push(0); return; }
      if(juste(lu.choix, q)){ st.push("j"); pts.push(1); return; }
      if(tr === qi){ st.push("t"); pts.push(1); return; }
      // en mode partiel, une fraction du point par bonne case, autant de retiré par mauvaise, plancher 0 (cadrage, 288 à 293)
      st.push("f"); pts.push(ev.mode === "partiel" ? partiel(lu.choix, q) : 0);
    });
    // la question bonus (prompt de création : "bonus": true) compte dans les points gagnés, pas dans le total ; la note ne dépasse pas 20
    var compte = ev.questions.map(function(q, i){ return i; }).filter(function(i){ return an.indexOf(i) < 0 && ec.indexOf(i) < 0 && st[i] !== "x"; });
    var n = compte.reduce(function(a, i){ return a + (pts[i] || 0); }, 0), total = compte.filter(function(i){ return !ev.questions[i].bonus; }).length;
    var complet = compte.every(function(i){ return pts[i] !== null; });
    var sur20 = total ? Math.min(20, n * 20 / total) : 0, comp = {};
    ev.questions.forEach(function(q, qi){ if(compte.indexOf(qi) < 0) return; (q.competences || []).forEach(function(c){ comp[c] = comp[c] || {n:0, max:0}; if(!q.bonus) comp[c].max++; comp[c].n += (pts[qi] || 0); }); });
    var corrigees = Object.keys((s.aLire) || {}).map(function(id){ return s.aLire[id]; }).filter(function(a){ return a && a.eleveSlug === x && a.corrige; }).map(function(a){ return Number(a.qi); });
    return {p:x, st:st, pts:pts, n:n, total:total, complet:complet, sur20:sur20, maitrise:S.maitriseDe(Math.round(sur20 * 10) / 10), comp:comp, corrigees:corrigees, annulees:an, ecartees:ec, trouvee:tr};
  };
  S.resultat = function(id, x, k){ var s = S.sess(id); if(!s) return null; if(S.absents(id).indexOf(x) >= 0 || S.eleves(id).indexOf(x) < 0) return null; return S.note(x, k, id); };
  S.estimation = function(x, k, sid){ var e = S.estimationDe(x, sid); if(!e) return null; var nt = S.note(x, k, sid); if(!nt) return null; var iE = IDX.indexOf(e), iR = IDX.indexOf(nt.maitrise);
    return {k:e, type:iE === iR ? "ok" : iE > iR ? "sur" : "sous", ecart:Math.abs(iE - iR)}; };
  S.autonomie = function(x, k, sid){ var s = S.sess(sid), a = ((s && s.autonomie) || {})[x]; if(!a || !a.retire) return {retire:false};
    var quand = a.quand === "soir" ? "le " + dateFr(a.ms).slice(0, 5) + " à " + heureFr(a.ms) : "à " + heureFr(a.ms);
    return {retire:true, quand:quand, heure:heureFr(a.ms), ms:a.ms, moment:a.quand || "heure"}; };
  S.retiresSeance = function(id, k){ return S.eleves(id).filter(function(x){ return S.autonomie(x, k, id).retire; }); };
  S.provisoire = function(k, sid){ return !S.rendueAu(sid || S.sid()); };

  /* ── « À lire sur les feuilles » : les lignes, d'après ce que chacun a dit et ce que le voisin a lu ── */
  function choixTexte(q, c){ if(c === "aucun") return "aucun de ces choix"; return (c || []).map(function(i){ return q.choix[i]; }).join(" et "); }
  function queNom(n){ return (/^[AEIOUYÉÈÊÀÂÎÔÛaeiouyéèêàâîôû]/.test(n) ? "qu'" : "que ") + n; }
  S.aLireSeance = function(id, k){
    var s = S.sess(id); if(!s) return [];
    var ev = S.evalDeSeance(id); if(!ev) return [];
    var stock = s.aLire || {}, l = [], corr = S.corrigeesAu(k, id), tr = s.alertes || {};
    function ajouter(x, qi, sorte, txt){ var cl = x + "_" + qi + "_" + sorte, st = stock[cl] || {};
      // une alerte tranchée la feuille en main ferme sa ligne
      var tranchee = Object.keys(tr).some(function(a){ var al = tr[a]; return al && Number(al.qi) === qi && (al.eleves || []).indexOf(x) >= 0 && al.tranche && al.tranche.decision === "feuille"; });
      if(tranchee && sorte !== "co") return;
      l.push({id:cl, p:x, eleveSlug:x, q:qi, qi:qi, sorte:sorte, txt:txt, nom:S.nomDe(x), lue:!!st.lue, corrigee:!!st.corrige}); }
    S.eleves(id).forEach(function(x){
      if(S.absents(id).indexOf(x) >= 0) return;
      corr.forEach(function(qi){
        // le lecteur nommé est le voisin qui a lu la feuille (une lecture corrigée par Paul ou par la feuille garde le nom du voisin)
        var q = ev.questions[qi], rep = S.reponse(x, qi, id), lu = S.lecture(x, qi, id), b = S.ditB(x, qi, id), lec = lu && lu.par && NOMS[lu.par] ? lu.par : S.voisinDe(x, id), v = lec ? S.pre(lec) : "son voisin";
        if(lu && lu.choix === "aucun"){ ajouter(x, qi, "aucun", "aucun de ces choix"); return; }
        if(!rep) return;
        var memes = lu && !(lu.choix === "aucun") && juste(lu.choix, {bonnes:rep.choix});
        if(!b) ajouter(x, qi, "b", "n'a pas dit si sa feuille disait son clic");
        else if(b === "oui" && lu && !memes) ajouter(x, qi, "b", "a dit que sa feuille disait son clic, " + choixTexte(q, rep.choix) + " ; " + v + " y a lu " + choixTexte(q, lu.choix));
        else if(b === "non" && lu && memes) ajouter(x, qi, "b", "a dit que sa feuille ne disait pas son clic, " + choixTexte(q, rep.choix) + " ; " + v + " y a lu " + choixTexte(q, lu.choix));
      });
      // une alerte que Paul relit le soir (« 📌 Je relis ce soir la question n ») : « ⚠️ À relire »
      Object.keys(tr).forEach(function(aid){ var al = tr[aid]; if(al && al.tranche && al.tranche.decision === "soir" && (al.eleves || [])[0] === x){ var lv = (al.eleves || [])[1] || S.voisinDe(x, id);
        ajouter(x, Number(al.qi), "co", "pense " + queNom(S.nomDe(lv)) + " a mal lu sa feuille ; à relire"); } });
      var co = S.coevalDe(x, id);
      if(co && co.statut === "peut" && co.qi != null){ var vo = S.voisinDe(x, id); ajouter(x, Number(co.qi), "co", "🤔 pense " + queNom(S.pre(vo)) + " a peut-être mal lu sa feuille" + (co.ecrit ? " ; " + (S.sexe(x) === "F" ? "elle" : "il") + " dit avoir écrit : " + choixTexte(ev.questions[co.qi], co.ecrit) : "")); }
    });
    return l;
  };
  S.aLire = function(k){ return S.aLireSeance(S.sid(), k); };

  /* ── Les comptes de la console ── */
  S.compteurs = function(k, sid){
    var s = S.sess(sid), e = S.etat(sid) || {}, pres = S.presents(k, sid), qi = e.qi, ev = S.ev(sid);
    var ec = S.ecartees(sid), nbQ = ev ? ev.questions.length - ec.length : 0, inscrits = S.eleves(sid).length;
    var o = {presents:pres.length, absents:S.absents(sid).length, inscrits:inscrits, nbQ:nbQ};
    if(!s) return o;
    if(qi != null && ["reflexion", "reponse", "close", "b", "passage", "rouvert", "pause"].indexOf(e.ph) >= 0){
      var rep = S.repondu(qi, k, sid), pc = S.premierCote(qi, sid);
      var attendu = (e.ph === "reponse" || e.ph === "passage" || e.ph === "b") && e.tour === 1 ? pres.filter(function(x){ return S.cote(x, sid) === pc; }).length : pres.length;
      o.repondu = [e.ph === "reflexion" ? 0 : rep.length, attendu];
      o.justes = [rep.filter(function(x){ return S.justeTablette(x, qi, sid); }).length, rep.length];
      o.question = [qi + 1 - ec.filter(function(x){ return x < qi; }).length, nbQ];
    }
    var act = S.actifs(k, sid);
    if(e.ph === "entree" || e.ph === "pret"){
      var entres = pres.filter(function(x){ return S.tabletteDe(x, sid) && (((s.entres || {})[x])); });
      var finis = entres.filter(function(x){ var a = S.attestDe(1, x, sid); return a && a.fini; });
      o.connectes = [entres.length, pres.length]; o.attestations = [finis.length, entres.length]; o.repondu = [0, pres.length];
      o.pasEntres = pres.filter(function(x){ return entres.indexOf(x) < 0; });
      o.attestEnCours = {}; pres.forEach(function(x){ var a = S.attestDe(1, x, sid); if(entres.indexOf(x) >= 0 && !(a && a.fini)) o.attestEnCours[x] = a ? a.lignes || 0 : 0; });
    }
    // la lecture, la co-évaluation, l'estimation, la seconde attestation : ceux qui sont entrés (S.actifs) ; une feuille se lit si l'élève a un voisin entré, ou seul (il la lit lui-même)
    if(e.ph === "lecture" && qi != null){ var pas = act.filter(function(x){ return !S.lecture(x, qi, sid); }); o.lus = [act.length - pas.length, act.length]; o.manquent = pas.map(S.nomDe); o.pasLu = pas; }
    if(e.ph === "coeval"){ var att = act.filter(function(x){ var v = S.voisinDe(x, sid); return !S.coevalDe(x, sid) && v && act.indexOf(v) >= 0; }); var avecV = act.filter(function(x){ var v = S.voisinDe(x, sid); return v && act.indexOf(v) >= 0; });
      o.coeval = [avecV.length - att.length, avecV.length]; o.manquent = att.map(S.nomDe); o.pasCoeval = att; }
    if(e.ph === "estim"){ var pe = act.filter(function(x){ return !S.estimationDe(x, sid); }); o.estime = [act.length - pe.length, act.length]; o.manquent = pe.map(S.nomDe); o.pasEstime = pe; }
    if(e.ph === "att2"){ var ec2 = act.filter(function(x){ var a = S.attestDe(2, x, sid); return !(a && a.fini); }); o.prets = [act.length - ec2.length, act.length]; o.manquent = ec2.map(S.nomDe);
      o.enCours = {}; ec2.forEach(function(x){ var a = S.attestDe(2, x, sid); o.enCours[x] = a ? a.lignes || 0 : 0; }); }
    return o;
  };
  S.compteursTest = S.compteurs;

  /* ── Le moment : l'état de la séance réelle, au format des moments de la maquette (k = « LIVE ») ── */
  S.moment = function(k){
    var sid = k && k !== "LIVE" && (LIVE.d.sessions || {})[k] ? k : S.sid(), s = S.sess(sid), e = S.etat(sid);
    if(!s || !e) return {k:"LIVE", seance:null, ph:"avant", date:dateFr(LIVE.maintenant()), heure:heureFr(LIVE.maintenant()), heureS:heureFr(LIVE.maintenant(), true), etape:"avant l'heure", ecartees:[], annulees:[], partis:{}};
    var now = LIVE.maintenant(), c = S.compteurs("LIVE", sid), m = {k:"LIVE", seance:sid, date:dateFr(now), heure:heureFr(now), heureS:heureFr(now, true), ph:e.ph, qi:e.qi, tour:e.tour || null, reste:S.reste(e),
      cote:e.cote || null, pour:e.pour || null, ecartees:S.ecartees(sid), annulees:S.annulees(sid), temps:s.temps || {}, partis:{}, etape:e.ph};
    Object.keys(S.partis(sid)).forEach(function(x){ m.partis[x] = heureFr(S.partis(sid)[x]); });
    if(e.ph === "pause" && e.reprise){ m.pause = {qi:e.reprise.qi, tour:e.reprise.tour, ph:e.reprise.ph}; m.qi = e.reprise.qi; m.tour = e.reprise.tour; }
    if(e.ph === "reponse" || e.ph === "rouvert"){ var cr = e.ph === "rouvert" ? null : S.coteDuTour(e.qi, e.tour, sid);
      m.nonRep = S.presents(k, sid).filter(function(x){ return (!cr || S.cote(x, sid) === cr) && !S.reponse(x, e.qi, sid) && (e.ph !== "rouvert" || x === e.pour); }); }
    if(e.ph === "close") m.sansRep = S.presents(k, sid).filter(function(x){ return !S.reponse(x, e.qi, sid); });
    // la moitié qui dit encore B pendant que la suite a commencé (un geste de Paul a coupé l'attente) : {cote, qi, tour, reste}
    if(e.bPour && Number(e.bPour.qi) === e.qi && LIVE.maintenant() < e.bPour.jusqua) m.bPour = {cote:e.bPour.cote, qi:Number(e.bPour.qi), tour:e.bPour.tour, reste:Math.ceil((e.bPour.jusqua - LIVE.maintenant()) / 1000)};
    if(e.ph === "entree" || e.ph === "pret"){ m.pasEntres = c.pasEntres; m.attestEnCours = c.attestEnCours; }
    if(e.ph === "lecture") m.pasLu = c.pasLu;
    if(e.ph === "estim") m.pasEstime = c.pasEstime;
    if(e.ph === "att2") m.enCours = c.enCours;
    var alertes = s.alertes || {}; m.alertes = Object.keys(alertes).map(function(id){ return Object.assign({id:id}, alertes[id]); });
    m.tranche = m.alertes.length && m.alertes.every(function(a){ return a.tranche; }) ? "oui" : null;
    m.retires = S.retiresSeance(sid, k);
    return m;
  };
  S.MOMENT_DE = {};
  S.appareilDe = function(id, vue){ return vue; };
  S.rang = function(){ return -1; };
  S.apres = function(){ return false; };

  /* ── La fin prévue : l'heure présente, plus les temps qui restent ── */
  S.finPrevue = function(k, surcharges, sid){
    var e = S.etat(sid), ev = S.ev(sid); if(!e || !ev) return null;
    var D = durees(), ec = S.ecartees(sid), qi = e.qi, reste = 0, ph = e.ph === "pause" && e.reprise ? e.reprise.ph : e.ph;
    function tour(t){ return D.decompte + t.reponse + D.b; }
    var nQ = ev.questions.length - ec.length, corrRestantes = nQ;
    if(["reflexion", "reponse", "passage", "b", "close", "pret", "entree", "rouvert", "appel"].indexOf(ph) >= 0){
      var debut = 0;
      if(qi != null){
        var t = S.tempsDe(qi, k, surcharges, sid), r = (S.reste(e) || 0) + ((surcharges || {}).reste || 0), tr = e.tour || (e.reprise && e.reprise.tour);
        if(ph === "reflexion") reste += r + 2 * tour(t);
        else if(ph === "passage") reste += r + t.reponse + D.b + (tr === 1 ? tour(t) : 0);
        else if(ph === "reponse" || ph === "rouvert") reste += r + D.b + (tr === 1 ? tour(t) : 0);
        else if(ph === "b") reste += r + (tr === 1 ? tour(t) : 0);
        debut = qi + 1;
      }
      for(var j = debut; j < ev.questions.length; j++){ if(ec.indexOf(j) >= 0) continue; var tj = S.tempsDe(j, k, surcharges, sid); reste += D.entre + tj.reflexion + 2 * tour(tj); }
      reste += D.estimAttest;
    } else if(ph === "estim") reste += D.estimAttest;
    else if(ph === "att2") reste += D.estimAttest / 2;
    else if(ph === "lecture" || ph === "revele") corrRestantes = nQ - S.corrigeesAu(k, sid).length;
    else if(ph === "coeval") corrRestantes = 0;
    else return null;
    var now = sec(heureFr(LIVE.maintenant(), true));
    var fin = now + reste + corrRestantes * D.correctionParQ + (ph === "coeval" ? D.coevalBilan / 2 : D.coevalBilan);
    var fh = S.finHeure(k, sid);
    return {sec:fin, hm:hm(fin), deborde:fh ? fin - sec(fh) : 0};
  };

  /* ── Les séances : celles de la base, au format du calendrier de la maquette ── */
  // une séance du scénario de la maquette (« S08 », « PAP »…) que nomme encore un écran : une séance vide, jamais une erreur
  var SCENARIO = ["S08", "PAP", "S3E", "RATT", "CH1", "JB", "DEMO", "TEST"];
  S.seance = function(id){
    var s = S.sess(id); if(!s){ if(SCENARIO.indexOf(id) >= 0){ var now = LIVE.maintenant(); return {id:id, vide:true, eval:null, classe:S.classe(), date:dateFr(now), heure:heureFr(now), mode:"tablettes", absents:[], fin:null, rendues:null, demo:false, rattrapage:false, eleves:null, ms:now, aLire:0}; } return null; }
    var l = s.lancee || {}, d = s.date || l.date || 0, ev = S.evalParId(s.evalId);
    return {id:id, eval:s.evalId, classe:s.classeSlug, date:dateFr(d), heure:l.heure || heureFr(d), mode:l.mode || "tablettes",
      absents:S.absents(id).map(S.nomDe), fin:s.etat === "terminee" ? dateFr(s.finLe || d) + " " + heureFr(s.finLe || d) : null,
      rendues:s.copies && s.copies.rendues && !s.copies.masquees ? dateFr(s.copies.rendues) + " " + heureFr(s.copies.rendues) : null,
      demo:s.evalId === "demo" || !!l.demo, rattrapage:!!l.rattrapage, eleves:l.eleves ? l.eleves.map(S.nomDe) : null, ms:d,
      aLire:S.aLireSeance(id).filter(function(x){ return !x.lue; }).length, enPause:!!(s.deroule && s.deroule.autreHeure), titre:ev ? ev.titre : (s.evalSnapshot || {}).titre};
  };
  S.SEANCES = [];
  S.seances = function(classe){ var all = LIVE.d.sessions || {}, cl = classe ? cleDeClasse(classe) : null; return Object.keys(all).filter(function(id){ var s = all[id]; return s && (!cl || cleDeClasse(s.classeSlug) === cl) && s.classeSlug && s.classeSlug.charAt(0) !== "_"; })
    .map(S.seance).filter(Boolean).sort(function(a, b){ return b.ms - a.ms; }); };
  // les séances terminées, avant maintenant (la séance en cours n'y est pas)
  S.seancesAvant = function(k, classe){ var cur = S.sid(); return S.seances(classe || S.classe()).filter(function(x){ return x.fin && x.id !== cur; }); };
  S.rendueAu = function(id){ var s = S.sess(id); return !!(s && s.copies && s.copies.rendues && !s.copies.masquees); };
  S.qcmPrecedent = function(k, classe){ return S.seancesAvant(k, classe).filter(function(x){ return !x.demo && !x.rattrapage; })[0] || null; };
  S.passees = function(evalId, k){ return S.seances().filter(function(x){ return x.fin && x.eval === evalId && !x.demo; }).map(function(x){ return {classe:x.classe, date:x.date.slice(0, 5)}; }); };
  S.mesEvaluations = function(x, k, classe){
    return S.seances(classe || S.classe()).filter(function(se){ return !se.demo && (S.eleves(se.id).indexOf(x) >= 0) && (se.fin || se.id === S.sid()); }).map(function(se){
      var abs = S.absents(se.id).indexOf(x) >= 0, rendue = S.rendueAu(se.id);
      return {titre:se.titre, date:se.date, etat:abs ? "absente" : rendue ? "bilan" : "relecture", note:abs || !rendue ? null : S.note(x, k, se.id), seance:se.id};
    });
  };

  /* ── Les binômes proposés au lancement : les exclusions de MJPC, puis le classement du QCM précédent (1-2, 3-4…) ── */
  S.binomesProposes = function(classe, presents){
    var pres = (presents || rosterDe(classe).map(sanMJPC)).slice(), prec = S.qcmPrecedent(null, classe), classes = [];
    if(prec){
      var notes = {}; pres.forEach(function(x){ var r = S.resultat(prec.id, x); notes[x] = r ? r.sur20 : null; });
      var avec = pres.filter(function(x){ return notes[x] != null; }).sort(function(a, b){ return notes[b] - notes[a] || S.nomDe(a).localeCompare(S.nomDe(b), "fr"); });
      var sans = pres.filter(function(x){ return notes[x] == null; }).sort(function(a, b){ return S.nomDe(a).localeCompare(S.nomDe(b), "fr"); });
      classes = avec.concat(sans);
    } else classes = pres.sort(function(a, b){ return S.nomDe(a).localeCompare(S.nomDe(b), "fr"); });
    var paires = []; for(var i = 0; i < classes.length; i += 2) paires.push([classes[i], classes[i + 1] || null]);
    // deux exclus ne sont jamais ensemble : le second s'échange avec le premier élève compatible plus loin
    for(var a = 0; a < paires.length; a++){ var p = paires[a]; if(!p[1] || S.exclusions(p[0], classe).indexOf(p[1]) < 0 && S.exclusions(p[1], classe).indexOf(p[0]) < 0) continue;
      for(var b = a + 1; b < paires.length; b++){ for(var c2 = 0; c2 < 2; c2++){ var y = paires[b][c2]; if(!y) continue;
        if(S.exclusions(p[0], classe).indexOf(y) < 0 && S.exclusions(y, classe).indexOf(p[0]) < 0){ var autre = paires[b][1 - c2];
          if(!autre || (S.exclusions(p[1], classe).indexOf(autre) < 0 && S.exclusions(autre, classe).indexOf(p[1]) < 0)){ paires[b][c2] = p[1]; p[1] = y; b = paires.length; break; } } } } }
    return paires;
  };
  S.binomesRefus = function(a, b, classe){ if(!a || !b) return null; if(S.exclusions(a, classe).indexOf(b) >= 0 || S.exclusions(b, classe).indexOf(a) >= 0) return S.nomDe(a) + " et " + S.nomDe(b) + " ne sont jamais ensemble (exclusion de MJPC)."; return null; };

  /* ── Les compatibilités : ce qui était une table du scénario est une fonction ── */
  S.MOMENTS = {};
  S.ORDRE_S08 = [];
  ["TEST", "R_3E", "R_JB", "R_CH1", "ESTIM_3E", "DIT_EXCEPTIONS", "FEUILLE_SOIR", "EV3_COMPLETEE"].forEach(function(n){ S[n] = {}; });
  /* Les tables du scénario, rebranchées : un écran qui lit encore ORD[qi][e.cle], TABL[e.cle][qi], LU[e.cle][qi], FEUI, DIT_B, RT[p],
     ESTIM[p], CO[p] ou SEXE[p] lit la séance réelle, e.cle (ou p) étant l'eleveSlug. Elles servent le temps que chaque écran appelle
     directement SCN.ordreChoix, SCN.reponse, SCN.lecture, SCN.ditB, SCN.estimationDe, SCN.coevalDe, SCN.sexe. */
  function table(par){ return typeof Proxy === "undefined" ? {} : new Proxy({}, {get:function(o, k){ if(typeof k !== "string") return undefined; return par(k); }, has:function(){ return true; }}); }
  function slugDe(k){ if(NOMS[k]) return k; var s = sanMJPC(k); if(NOMS[s]) return s; indexer(); var r = Object.keys(NOMS).filter(function(x){ return S.pre(x) === k; })[0]; return r || s; }
  function parQuestion(f){ return function(cle){ var x = slugDe(cle); return table(function(qi){ if(qi === "length"){ var ev = S.ev(); return ev ? ev.questions.length : 0; } return f(x, Number(qi)); }); }; }
  S.ORD = table(function(qi){ return table(function(cle){ return S.ordreChoix(slugDe(cle), Number(qi)); }); });
  S.TABL = table(parQuestion(function(x, qi){ var r = S.reponse(x, qi); return r ? r.choix : []; }));
  S.LU_JM = table(parQuestion(function(x, qi){ var l = S.lecture(x, qi); return l ? l.choix : []; }));
  S.FEUI = S.LU_JM;
  S.DIT_B = table(parQuestion(function(x, qi){ return S.ditB(x, qi); }));
  function codes(x, f){ var ev = S.ev(); return ev ? ev.questions.map(function(q, qi){ return f(x, qi, q); }).join("") : ""; }
  S.RT = table(function(k){ var x = slugDe(k); return codes(x, function(y, qi, q){ var r = S.reponse(y, qi); return !r ? "-" : juste(r.choix, q) ? "J" : "F"; }); });
  S.LU = table(function(k){ var x = slugDe(k); return codes(x, function(y, qi, q){ var l = S.lecture(y, qi); return !l ? "-" : l.choix === "aucun" ? "A" : juste(l.choix, q) ? "J" : "F"; }); });
  S.ESTIM = table(function(k){ return S.estimationDe(slugDe(k)); });
  S.CO = table(function(k){ var c = S.coevalDe(slugDe(k)); return !c ? "att" : c.statut === "ok" ? "ok" : c.statut + (c.qi != null ? Number(c.qi) + 1 : ""); });
  S.SEXE = table(function(k){ return S.sexe(slugDe(k)); });
  ["PAIRES", "PAIRES_AVANT", "NOMS", "PREMIER", "ORDRE_CORR", "A_LIRE", "CO_LIRE", "A_LIRE_3E", "CORBEILLE", "RETRAITS"].forEach(function(n){ S[n] = []; });
  S.EV_ESSAI = S.DEMO;
  S.ID_CH1 = S.ID_JB = S.ID_3E = null;
  S.complete3e = function(){ return false; };
  S.heureAttest = function(x, n){ var a = S.attestDe(n, x); return a && a.ms ? heureFr(a.ms) : ""; };
  S.feuilleVraie = function(){ return ""; };
  S.choixDe = function(code){ return []; };
  S.notePapier = function(x, k){ return S.note(x, k); };
  S.note3e = function(){ return null; };
  S.noteSeance = function(id, nom){ var r = S.resultat(id, sanMJPC(nom)); return r ? {n:r.n, total:r.total, sur20:r.sur20, maitrise:r.maitrise} : null; };
  return S;
})();

/* ══════════════════════ ACT : les gestes de Paul ══════════════════════ */
function _ph717(ph){ return {appel:"idle", entree:"idle", pret:"idle", reflexion:"reflexion", passage:"reponse", reponse:"reponse", b:"attente", close:"attente", rouvert:"reponse",
  estim:"autoeval", att2:"autoeval", lecture:"correction", revele:"correction", coeval:"correction", bilan:"finie", fin:"finie", pause:"attente", avant:"idle"}[ph] || "idle"; }
// le passage d'une phase à une autre : deroule, et le miroir de la 7.7.1
function poserDeroule(sid, d, plus){
  d = Object.assign({qi:null, tour:null, cote:null, duree:null, pour:null, bPour:null}, d); d.depuis = d.depuis || LIVE.maintenant();
  var maj = {}; maj[cheminS(sid, "deroule")] = d; maj[cheminS(sid, "phase")] = _ph717(d.ph); maj[cheminS(sid, "phaseStart")] = d.depuis;
  if(d.qi != null) maj[cheminS(sid, "qIdx")] = d.qi;
  maj[cheminS(sid, "paused")] = d.ph === "pause" && d.reprise ? {remaining:d.reprise.reste || 0} : null;
  Object.keys(plus || {}).forEach(function(k){ maj[cheminS(sid, k)] = plus[k]; });
  return ecrireQCM(maj, "deroule " + d.ph);
}
var ACT = (function(){
  var A = {};
  function sid(){ var s = SCN.sid(); if(!s) LIVE.log("ACT sans séance"); return s; }
  function e(){ return SCN.etat() || {}; }
  function D(){ return SCN.durees(); }
  // lancer : la séance s'écrit (la forme de la 7.7.1, plus « lancee », « places », « deroule ») ; l'appel s'ouvre
  A.lancerSeance = function(classe, evalId, o){
    o = o || {}; var now = LIVE.maintenant();
    if(o.reprise){ var s0 = SCN.sess(o.reprise); if(!s0) return Promise.reject(new Error("séance introuvable"));
      var maj0 = {}; maj0["/sessionActive/" + s0.classeSlug] = o.reprise; LIVE.sid = o.reprise; LIVE.classeSlug = s0.classeSlug;
      return ecrireQCM(maj0, "reprise").then(function(){ return poserDeroule(o.reprise, {ph:"appel", reprise:(s0.deroule || {}).reprise || null}); }).then(function(){ return o.reprise; }); }
    var id = "sess_" + now, eleves = o.eleves ? o.eleves.slice() : SCN.roster(classe).map(sanMJPC);
    var paires = o.paires || SCN.binomesProposes(classe, eleves), places = {};
    // une paire nomme ses élèves par leur slug ou par « NOM Prénom » : la base garde le slug
    paires.forEach(function(p, i){ var a = p[0] ? sanMJPC(p[0]) : null, b = p[1] ? sanMJPC(p[1]) : null;
      places[i + 1] = {g:a || b || null, d:a ? b : null}; if(!a || !b) places[i + 1].seul = true; });
    var ev = SCN.evalParId(evalId), fin = o.fin || SCN.hm(SCN.sec(SCN.heureFr(now)) + 55 * 60);
    var sess = {classeSlug:classe, evalId:evalId, date:now, phase:"idle", qIdx:null, etat:"en_cours",
      lancee:{date:now, heure:SCN.heureFr(now), fin:fin, mode:o.mode || "tablettes", demo:evalId === "demo", rattrapage:!!o.rattrapage, eleves:o.eleves || null},
      places:places, deroule:{ph:"appel", depuis:now}};
    if(o.absents && o.absents.length) sess.absents = o.absents.slice();
    if(ev && !ev.demo) sess.evalSnapshot = construireSnapshot(ev);
    var maj = {}; maj["/sessions/" + id] = sess; maj["/sessionActive/" + classe] = id;
    LIVE.sid = id; LIVE.classeSlug = classe;
    return ecrireQCM(maj, "lancerSeance").then(function(){ return id; });
  };
  function construireSnapshot(ev){ return {titre:ev.titre || "", mode:ev.mode === "partiel" ? "partiel" : "strict", version:typeof ev.version === "number" ? ev.version : 1, questions:JSON.parse(JSON.stringify(ev.questions || [])), figeLe:LIVE.maintenant()}; }
  // la fin de l'appel : les absents sortent ; les élèves restés seuls sont mis ensemble, sur la tablette du premier
  A.appelFini = function(absents, fin){
    var id = sid(); if(!id) return Promise.resolve(); absents = (absents || []).map(function(x){ return SCN.nomDe(x) !== x ? x : sanMJPC(x); });
    var pl = SCN.places(id), seuls = [], places = {};
    pl.forEach(function(t){ var g = t.g && absents.indexOf(t.g) < 0 ? t.g : null, d = t.d && absents.indexOf(t.d) < 0 ? t.d : null;
      if(g && d) places[t.n] = {g:g, d:d}; else if(g || d) seuls.push({n:t.n, x:g || d, avait:!!(t.g && t.d)}); });
    for(var i = 0; i + 1 < seuls.length; i += 2) places[seuls[i].n] = {g:seuls[i].x, d:seuls[i + 1].x};
    if(seuls.length % 2){ var r = seuls[seuls.length - 1]; places[r.n] = {g:r.x, d:null, seul:true}; }
    var s = SCN.sess(id), maj = {}; maj[cheminS(id, "absents")] = absents.length ? absents : null; maj[cheminS(id, "places")] = places;
    if(fin) maj[cheminS(id, "lancee/fin")] = fin;
    var hist = {}; absents.forEach(function(x){ hist[x] = {}; hist[x]["h_" + LIVE.maintenant()] = {ts:LIVE.maintenant(), etat:"absent"}; }); if(absents.length) maj[cheminS(id, "presence_history")] = hist;
    var rep = s && s.deroule && s.deroule.reprise;
    return ecrireQCM(maj, "appelFini").then(function(){ return poserDeroule(id, {ph:"entree", reprise:rep || null}); });
  };
  // échanger deux élèves (avant ou pendant la séance) : une paire exclue est refusée, avec sa raison
  A.echanger = function(a, b){
    var id = sid(); if(!id) return Promise.resolve({ok:false});
    var ta = SCN.tabletteDe(a), tb = SCN.tabletteDe(b); if(!ta || !tb) return Promise.resolve({ok:false, raison:"Élève sans tablette."});
    var va = SCN.voisinDe(b), vb = SCN.voisinDe(a);
    var refus = SCN.binomesRefus(a, va === a ? b : va) || SCN.binomesRefus(b, vb === b ? a : vb); if(ta.n === tb.n) refus = null;
    if(refus) return Promise.resolve({ok:false, raison:refus});
    var maj = {}; maj[cheminS(id, "places/" + ta.n + "/" + ta.cote)] = b; maj[cheminS(id, "places/" + tb.n + "/" + tb.cote)] = a;
    maj[cheminS(id, "deplaces/" + a)] = LIVE.maintenant(); maj[cheminS(id, "deplaces/" + b)] = LIVE.maintenant();
    return ecrireQCM(maj, "echanger").then(function(){ return {ok:true}; });
  };
  A.deplacer = function(x, tablette, cote){
    var id = sid(); if(!id) return Promise.resolve({ok:false}); var p = SCN.places().filter(function(t){ return t.n === Number(tablette); })[0];
    var occ = p ? p[cote] : null; if(occ) return A.echanger(x, occ);
    var t = SCN.tabletteDe(x), maj = {}; if(t) maj[cheminS(id, "places/" + t.n + "/" + t.cote)] = null;
    var autre = p ? p[cote === "g" ? "d" : "g"] : null, refus = SCN.binomesRefus(x, autre); if(refus) return Promise.resolve({ok:false, raison:refus});
    maj[cheminS(id, "places/" + tablette + "/" + cote)] = x; maj[cheminS(id, "places/" + tablette + "/seul")] = autre ? null : true; maj[cheminS(id, "deplaces/" + x)] = LIVE.maintenant();
    return ecrireQCM(maj, "deplacer").then(function(){ return {ok:true}; });
  };
  // une question : la réflexion, puis les deux tours (le moteur passe de l'un à l'autre au bout du temps)
  A.lancerQuestion = function(qi){
    var id = sid(); if(!id) return Promise.resolve(); var s = SCN.sess(), ev = SCN.ev();
    if(qi == null){ var ec = SCN.ecartees(), lanc = SCN.lancees(); qi = 0; while(qi < ev.questions.length && (ec.indexOf(qi) >= 0 || lanc[qi])) qi++; }
    if(!ev || qi >= ev.questions.length) return Promise.resolve();
    var avant = Object.keys(s.premier || {}).length, premier = avant % 2 === 0 ? "g" : "d", plus = {};
    plus["premier/" + qi] = (s.premier || {})[qi] || premier; plus["questionsLancees/" + qi] = LIVE.maintenant(); plus["reouverts"] = null;
    return poserDeroule(id, {ph:"reflexion", qi:qi, duree:SCN.tempsDe(qi).reflexion}, plus);
  };
  /* Les gestes de Paul coupent l'attente (les bulles de la maquette : « ✋ Autoriser la réponse » coupe la réflexion ; « ⏭️ Tour suivant » :
     « les premiers sont figés et disent si leur feuille dit la même chose que leur clic, puis le 2e tour commence » ; « 🔒 Clore la question » :
     « les seconds sont figés et disent… ; la question est close »). La suite commence tout de suite ; la moitié qui vient de répondre dit B
     pendant ce temps, jusqu'à la fin de son temps de B (deroule.bPour = {cote, qi, tour, jusqua}). Au bout du temps, sans geste, la séance
     enchaîne comme les moments de la maquette : B, puis le passage. */
  function bPour(x){ return {cote:x.cote || SCN.coteDuTour(x.qi, x.tour || 1), qi:x.qi, tour:x.tour || 1, jusqua:LIVE.maintenant() + D().b * 1000}; }
  A.autoriserReponse = function(){ var x = e(), id = sid(); if(!id || x.ph !== "reflexion") return Promise.resolve();
    return poserDeroule(id, {ph:"reponse", qi:x.qi, tour:1, cote:SCN.coteDuTour(x.qi, 1), duree:SCN.tempsDe(x.qi).reponse}); };
  A.tourSuivant = function(){ var x = e(), id = sid(); if(!id) return Promise.resolve();
    if((x.ph === "reponse" || x.ph === "passage" || x.ph === "b") && x.tour === 1){
      var autre = SCN.coteDuTour(x.qi, 2), quelquun = SCN.presents().some(function(y){ return SCN.cote(y) === autre; });
      var b = x.ph === "b" ? Object.assign(bPour(x), {jusqua:(x.depuis || 0) + (x.duree || 0) * 1000}) : bPour(x);
      if(!quelquun) return poserDeroule(id, {ph:"close", qi:x.qi, bPour:b});
      return poserDeroule(id, {ph:"reponse", qi:x.qi, tour:2, cote:autre, duree:SCN.tempsDe(x.qi).reponse, bPour:b});
    }
    return Promise.resolve(); };
  A.cloreQuestion = function(){ var x = e(), id = sid(); if(!id) return Promise.resolve();
    if((x.ph === "reponse" || x.ph === "passage") && x.tour === 2) return poserDeroule(id, {ph:"close", qi:x.qi, bPour:bPour(x)});
    if(x.ph === "b") return poserDeroule(id, {ph:"close", qi:x.qi, bPour:Object.assign(bPour(x), {jusqua:(x.depuis || 0) + (x.duree || 0) * 1000})});
    if(x.ph === "rouvert" || x.ph === "reponse" || x.ph === "passage" || x.ph === "reflexion") return poserDeroule(id, {ph:"close", qi:x.qi});
    return Promise.resolve(); };
  // le temps tapé en direct vaut pour toute la question ; le temps en cours suit
  A.ajouterTemps = function(sorte, s, qi){
    var id = sid(); if(!id) return Promise.resolve(); var x = e(); qi = qi != null ? qi : x.qi; if(qi == null) return Promise.resolve();
    var t = SCN.tempsDe(qi), maj = {}; maj[cheminS(id, "temps/" + qi + "/" + sorte)] = Math.max(1, t[sorte] + s);
    var enCours = x.qi === qi && ((sorte === "reflexion" && x.ph === "reflexion") || (sorte === "reponse" && (x.ph === "reponse" || x.ph === "rouvert" || x.ph === "lecture")));
    if(enCours) maj[cheminS(id, "deroule/duree")] = Math.max(1, (x.duree || 0) + s);
    return ecrireQCM(maj, "ajouterTemps");
  };
  A.fixerTemps = function(qi, sorte, v){ var id = sid(); if(!id) return Promise.resolve(); var t = SCN.tempsDe(qi); return A.ajouterTemps(sorte, v - t[sorte], qi); };
  A.relancerChrono = function(){ var id = sid(); if(!id) return Promise.resolve(); var maj = {}; maj[cheminS(id, "deroule/depuis")] = LIVE.maintenant(); return ecrireQCM(maj, "relancer"); };
  A.pause = function(){ var x = e(), id = sid(); if(!id || x.ph === "pause") return Promise.resolve();
    return poserDeroule(id, {ph:"pause", qi:x.qi, tour:x.tour, reprise:{ph:x.ph, qi:x.qi, tour:x.tour, cote:x.cote, duree:x.duree, reste:SCN.reste(x), pour:x.pour}}); };
  A.reprendre = function(){ var x = e(), id = sid(); if(!id || x.ph !== "pause" || !x.reprise) return Promise.resolve(); var r = x.reprise;
    return poserDeroule(id, {ph:r.ph, qi:r.qi, tour:r.tour, cote:r.cote, duree:r.reste != null ? r.reste : r.duree, pour:r.pour}); };
  function liste(nom, qi, ajouter){ var id = sid(); var l = (nom === "ecartees" ? SCN.ecartees() : SCN.annulees()).filter(function(x){ return x !== qi; }); if(ajouter) l.push(qi);
    var maj = {}; maj[cheminS(id, nom)] = l.length ? l.sort(function(a, b){ return a - b; }) : null; return ecrireQCM(maj, nom); }
  A.ecarter = function(qi){ return sid() ? liste("ecartees", qi, true) : Promise.resolve(); };
  A.annuler = function(qi){ return sid() ? liste("annulees", qi, true) : Promise.resolve(); };
  A.remettre = function(qi){ if(!sid()) return Promise.resolve(); return Promise.all([liste("ecartees", qi, false), liste("annulees", qi, false)]); };
  // rouvrir une question close : une seule fois par question
  A.rouvrirTous = function(qi){ var id = sid(), s = SCN.sess(); if(!id || ((s.rouverts || {})[qi])) return Promise.resolve();
    var plus = {}; plus["rouverts/" + qi] = "tous";
    return poserDeroule(id, {ph:"passage", qi:qi, tour:1, cote:SCN.coteDuTour(qi, 1), duree:D().decompte, rouvert:"tous"}, plus); };
  A.rouvrirPour = function(qi, x){ var id = sid(), s = SCN.sess(); if(!id || ((s.rouverts || {})[qi])) return Promise.resolve();
    var plus = {}; plus["rouverts/" + qi] = x; plus["reouverts/" + x] = true;
    return poserDeroule(id, {ph:"rouvert", qi:qi, tour:SCN.cote(x) === SCN.premierCote(qi) ? 1 : 2, cote:SCN.cote(x), duree:SCN.tempsDe(qi).reponse, pour:x}, plus); };
  A.depart = function(x){ var id = sid(); if(!id) return Promise.resolve(); var maj = {}, now = LIVE.maintenant(); maj[cheminS(id, "partis/" + x)] = now;
    maj[cheminS(id, "presence_history/" + x + "/h_" + now)] = {ts:now, etat:"absent"}; return ecrireQCM(maj, "depart"); };
  A.retour = function(x){ var id = sid(); if(!id) return Promise.resolve(); var maj = {}, now = LIVE.maintenant(); maj[cheminS(id, "partis/" + x)] = null;
    maj[cheminS(id, "presence_history/" + x + "/h_" + now)] = {ts:now, etat:"present"}; return ecrireQCM(maj, "retour"); };
  // l'estimation, puis la seconde attestation, puis la correction (dans l'ordre fixé ici : de la plus ratée à la mieux réussie)
  A.lancerEstimation = function(){ var id = sid(); return id ? poserDeroule(id, {ph:"estim"}) : Promise.resolve(); };
  A.lancerCorrection = function(){ var id = sid(); if(!id) return Promise.resolve(); var plus = {ordreCorr:SCN.ordreCorr()}; return poserDeroule(id, {ph:"att2"}, plus); };
  // la lecture d'une question de la correction : le temps de réponse de la question
  A.lireQuestion = function(qi){ var id = sid(); if(!id) return Promise.resolve(); if(qi == null){ var o = SCN.ordreCorr(), rv = SCN.corrigeesAu(); qi = o.filter(function(q){ return rv.indexOf(q) < 0; })[0]; }
    if(qi == null) return A.ouvrirCoeval(); return poserDeroule(id, {ph:"lecture", qi:qi, duree:SCN.tempsDe(qi).reponse}); };
  // révéler : la question se corrige d'après la lecture du voisin ; « Trouvée au dernier moment » se fixe ici, une fois par évaluation
  A.reveler = function(){ var x = e(), id = sid(); if(!id || x.qi == null) return Promise.resolve();
    var rv = SCN.corrigeesAu().filter(function(q){ return q !== x.qi; }).concat([x.qi]), plus = {revelees:rv}, ev = SCN.ev();
    SCN.presents().forEach(function(y){ if(SCN.trouveeDe(y) != null) return; var lu = SCN.lecture(y, x.qi), rep = SCN.reponse(y, x.qi), q = ev.questions[x.qi];
      if(rep && SCN.juste(rep.choix, q) && lu && lu.choix !== "aucun" && !SCN.juste(lu.choix, q)) plus["trouvee/" + y] = x.qi; });
    return poserDeroule(id, {ph:"revele", qi:x.qi}, plus); };
  A.questionSuivante = function(){ return A.lireQuestion(null); };
  A.retirerAutonomie = function(x, quand, sidX){ var id = sidX || sid(); if(!id) return Promise.resolve(); var maj = {}; maj[cheminS(id, "autonomie/" + x)] = {retire:true, ms:LIVE.maintenant(), quand:quand || "heure"}; return ecrireQCM(maj, "retirerAutonomie"); };
  A.rendreAutonomie = function(x, sidX){ var id = sidX || sid(); if(!id) return Promise.resolve(); var maj = {}; maj[cheminS(id, "autonomie/" + x)] = null; return ecrireQCM(maj, "rendreAutonomie"); };
  A.ouvrirCoeval = function(){ var id = sid(); return id ? poserDeroule(id, {ph:"coeval"}) : Promise.resolve(); };
  // trancher une alerte de la co-évaluation : « feuille » (Paul clique ce que dit la feuille : decision.choix), « lecteur » (la lecture tient), « michel »…
  // trancher une alerte : {decision:"feuille", choix, eleve} (Paul clique ce que dit la feuille) ; {decision:"auteur", choix, eleve} (raison à celui
  // qui a lancé l'alerte : la lecture devient ce qu'il dit avoir écrit) ; "lecteur" (la lecture tient) ; "soir" (la question « ⚠️ À relire » le soir) ;
  // null : « ↩️ Défaire » — la décision s'efface, et la lecture qu'elle avait changée revient à celle de l'alerte (alertes/<id>/lu)
  A.trancher = function(alerte, decision){ var id = sid(); if(!id) return Promise.resolve(); var al = (SCN.sess().alertes || {})[alerte]; if(!al) return Promise.resolve();
    var maj = {}, now = LIVE.maintenant();
    if(decision == null){ var av = al.tranche || {}; maj[cheminS(id, "alertes/" + alerte + "/tranche")] = null;
      if(av.choix && av.eleve != null){ var vo = SCN.voisinDe(av.eleve); maj[cheminS(id, "lectures/" + al.qi + "/" + av.eleve)] = al.lu ? {choix:al.lu, par:vo || av.eleve, ms:now} : null; }
      return ecrireQCM(maj, "trancher (défaire)"); }
    var dec = typeof decision === "string" ? {decision:decision} : Object.assign({}, decision); dec.ms = now;
    if(dec.eleve == null && (dec.decision === "auteur" || dec.decision === "feuille")) dec.eleve = (al.eleves || [])[0];
    maj[cheminS(id, "alertes/" + alerte + "/tranche")] = dec;
    if(dec.choix && dec.eleve != null && (dec.decision === "feuille" || dec.decision === "auteur" || !dec.decision)) maj[cheminS(id, "lectures/" + al.qi + "/" + dec.eleve)] = {choix:dec.choix, par:"prof", ms:now};
    return ecrireQCM(maj, "trancher"); };
  // « ← Question précédente » de la correction : la question d'avant dans l'ordre de la correction, révélée
  A.questionPrecedente = function(){ var x = e(), id = sid(); if(!id || x.qi == null) return Promise.resolve(); var o = SCN.ordreCorr(), i = o.indexOf(x.qi);
    if(i <= 0) return Promise.resolve(); return poserDeroule(id, {ph:"revele", qi:o[i - 1]}); };
  A.afficherBilan = function(){ var id = sid(); return id ? poserDeroule(id, {ph:"bilan"}, {bilanAffiche:LIVE.maintenant()}) : Promise.resolve(); };
  A.finirAutreHeure = function(){ var x = e(), id = sid(); if(!id) return Promise.resolve(); var s = SCN.sess();
    var rep = x.ph === "pause" ? x.reprise : {ph:x.ph, qi:x.qi, tour:x.tour, cote:x.cote, duree:x.duree, reste:x.duree, pour:x.pour}, maj = {};
    maj["/sessionActive/" + s.classeSlug] = null;
    return poserDeroule(id, {ph:"pause", qi:x.qi, tour:x.tour, reprise:rep, autreHeure:LIVE.maintenant()}).then(function(){ return ecrireQCM(maj, "finirAutreHeure"); }); };
  // terminer : l'archive s'écrit avec les notes telles qu'elles sont ; les tablettes oublient leurs élèves ; la démo s'efface
  A.terminer = function(sidX){ var id = sidX || sid(); if(!id) return Promise.resolve(); var s = SCN.sess(id), maj = {}, now = LIVE.maintenant();
    maj[cheminS(id, "etat")] = "terminee"; maj[cheminS(id, "finLe")] = now;
    if(!s.evalSnapshot && s.evalId !== "demo"){ var ev = SCN.evalParId(s.evalId); if(ev) maj[cheminS(id, "evalSnapshot")] = construireSnapshot(ev); }
    maj["/sessionActive/" + s.classeSlug] = null;
    return poserDeroule(id, {ph:"fin"}).then(function(){ return ecrireQCM(maj, "terminer"); }); };
  A.rouvrirSeance = function(id){ var s = SCN.sess(id); if(!s) return Promise.resolve(); var maj = {}; maj[cheminS(id, "etat")] = "en_cours"; if(s.copies && s.copies.rendues) maj[cheminS(id, "copies/masquees")] = true;
    return ecrireQCM(maj, "rouvrirSeance").then(function(){ return A.lancerSeance(s.classeSlug, s.evalId, {reprise:id}); }); };
  // le soir : une feuille lue (« Que dit la feuille ? ») ; rendre, masquer les copies
  A.lireFeuille = function(aLireId, choix, sidX){ var id = sidX || sid(); if(!id) return Promise.resolve(); var l = SCN.aLireSeance(id).filter(function(x){ return x.id === aLireId; })[0];
    var maj = {}, now = LIVE.maintenant(); if(!l) return Promise.resolve();
    var lu = SCN.lecture(l.eleveSlug, l.qi, id), change = choix != null && JSON.stringify(choix) !== JSON.stringify(lu ? lu.choix : null);
    maj[cheminS(id, "aLire/" + aLireId)] = {eleveSlug:l.eleveSlug, qi:l.qi, sorte:l.sorte, txt:l.txt, lue:now, corrige:!!change};
    if(change) maj[cheminS(id, "lectures/" + l.qi + "/" + l.eleveSlug)] = {choix:choix, par:"feuille", ms:now};
    return ecrireQCM(maj, "lireFeuille"); };
  A.rendreCopies = function(id){ id = id || sid(); var maj = {}; maj[cheminS(id, "copies")] = {rendues:LIVE.maintenant(), masquees:false}; return ecrireQCM(maj, "rendreCopies"); };
  A.masquerCopies = function(id){ id = id || sid(); var maj = {}; maj[cheminS(id, "copies/masquees")] = true; return ecrireQCM(maj, "masquerCopies"); };
  // la grille du papier : une case par élève et par question
  A.grillePapier = function(x, qi, v, sidX){ var id = sidX || sid(); var maj = {}; maj[cheminS(id, "papier/" + x + "/" + qi)] = v; return ecrireQCM(maj, "grillePapier"); };
  // l'appel annulé : la séance qui venait de s'ouvrir n'a jamais commencé ; elle s'efface
  A.abandonner = function(){ var id = sid(); if(!id) return Promise.resolve(); var s = SCN.sess(id), e0 = SCN.etat(id) || {}; if(e0.ph !== "appel" || (s.deroule && s.deroule.reprise)) return Promise.resolve();
    var maj = {}; maj["/sessions/" + id] = null; maj["/sessionActive/" + s.classeSlug] = null; LIVE.sid = null; return ecrireQCM(maj, "abandonner"); };
  A.piloter = function(id){ var s = SCN.sess(id); if(s){ LIVE.sid = id; LIVE.classeSlug = s.classeSlug; LIVE.changer(); } };
  return A;
})();

/* ══════════════════════ ELV : les gestes de l'élève, dans sa moitié de tablette ══════════════════════ */
var ELV = (function(){
  var E = {tab:null, cotes:{}};
  // la tablette : son numéro (celui du premier élève entré), ses moitiés ; gardés sur l'appareil pour tenir un rechargement
  try { var t = JSON.parse(localStorage.getItem("qcm_tablette") || "null"); if(t){ E.tab = t.tab; E.cotes = t.cotes || {}; E.n = t.n || null; E.sid = t.sid || null; if(t.classe) LIVE.classeSlug = t.classe; } } catch(e){}
  function garder(){ if(SCN.sid()) E.sid = SCN.sid(); if(typeof presence === "function") setTimeout(presence, 0); try { localStorage.setItem("qcm_tablette", JSON.stringify({tab:E.tab, cotes:E.cotes, n:E.n, sid:E.sid, classe:LIVE.classeSlug})); } catch(e){} LIVE.changer(); }
  E.oublier = function(){ E.tab = null; E.cotes = {}; E.n = null; try { localStorage.removeItem("qcm_tablette"); } catch(e){} presence(); LIVE.changer(); };
  /* La présence (la 7.7.1, EleveSession, l. 2781 à 2787) : qcm/presence/<classe>/<élève> = {nomComplet, last}, mise à jour toutes les 8 s,
     effacée quand la tablette se déconnecte ou oublie l'élève */
  var PRES = {};
  function presence(){
    if(!db) return; var cl = LIVE.classeSlug || SCN.classe(), voulus = {};
    if(cl) [E.cotes.g, E.cotes.d].forEach(function(x){ if(x) voulus[x] = 1; });
    Object.keys(PRES).forEach(function(k){ if(!voulus[k.split("|")[1]] || k.split("|")[0] !== cl){ try { db.ref(DB_ROOT + "/presence/" + k.split("|")[0] + "/" + k.split("|")[1]).remove(); } catch(e){} delete PRES[k]; } });
    Object.keys(voulus).forEach(function(x){ var k = cl + "|" + x; if(PRES[k]) return; var ref = db.ref(DB_ROOT + "/presence/" + cl + "/" + x);
      ref.set({nomComplet:SCN.nomDe(x), last:Date.now()}); try { ref.onDisconnect().remove(); } catch(e){} PRES[k] = ref; });
  }
  setInterval(function(){ Object.keys(PRES).forEach(function(k){ try { PRES[k].update({last:Date.now()}); } catch(e){} }); }, 8000);
  E.presence = presence;
  E.courant = null;
  // qui est sur cet appareil : {combien, n (la tablette), g, d (les slugs des deux moitiés), classe}
  E.ici = function(){ return {combien:E.n || null, n:E.tab || null, g:E.cotes.g || null, d:E.cotes.d || null, classe:LIVE.classeSlug || null}; };
  E.moitie = function(cote){ E.courant = cote; return E.cotes[cote] || null; };
  function qui(x){ return x || (E.courant && E.cotes[E.courant]) || null; }
  function sid(){ return SCN.sid(); }
  function w(chemin, v, quoi){ var id = sid(); if(!id) return Promise.resolve(); var maj = {}; maj[cheminS(id, chemin)] = v; return ecrireQCM(maj, quoi); }
  E.choisirClasse = function(classe){ LIVE.classeSlug = classe; garder(); };
  // « Combien êtes-vous sur cette tablette ? »
  E.combien = function(n){ E.n = n; garder(); };
  // l'entrée : le code, vérifié contre l'empreinte de /codes (la 7.7.1 : mjpcEntreeCode, mjpcVerifierCode), le prénom et le nom
  E.entrer = function(cote, code, prenom, nom){
    var classe = LIVE.classeSlug || SCN.classe();
    var roster = SCN.roster(classe), cible = sanMJPC(String(prenom || "").trim() + " " + String(nom || "").trim()), inv = sanMJPC(String(nom || "").trim() + " " + String(prenom || "").trim());
    if(!String(prenom || "").trim() || !String(nom || "").trim()) return Promise.resolve({ok:false, err:"Renseigne ton prénom et ton nom."});
    if(!String(code || "").trim()) return Promise.resolve({ok:false, err:"Entre ton code personnel (4 chiffres)."});
    var trouve = roster.filter(function(n){ return sanMJPC(n) === cible || sanMJPC(n) === inv; })[0];
    if(!trouve) return Promise.resolve({ok:false, err:"Élève introuvable dans la classe. Vérifie l'orthographe."});
    var x = sanMJPC(trouve);
    return LIVE.lireCodes().then(function(codes){
      var entree = typeof mjpcEntreeCode === "function" ? mjpcEntreeCode(codes, x) : codes[x];
      // la phrase de la maquette (t-login-inconnu), mot pour mot
      if(!entree) return {ok:false, inconnu:true, err:"Ton code n'est pas encore enregistré : lève la main."};
      var verif = typeof mjpcVerifierCode === "function" ? mjpcVerifierCode(entree, String(code).trim()) : Promise.resolve({ok:false, voie:"indisponible"});
      return verif.then(function(r){
        if(!r.ok) return {ok:false, err:(typeof mjpcMessageRefusEleve === "function" && mjpcMessageRefusEleve(r.voie)) || "Ce code ne correspond pas. Vérifie tes 4 chiffres."};
        return placer(cote, x);
      });
    });
  };
  // placer l'élève entré : sa tablette est celle des binômes ; l'autre moitié doit être son binôme (« rejoins … »)
  function placer(cote, x){
    var t = SCN.tabletteDe(x), id = sid();
    var autre = E.cotes[cote === "g" ? "d" : "g"];
    if(autre && SCN.voisinDe(autre) !== x && t){ return Promise.resolve({ok:false, rejoins:SCN.voisinDe(x), tablette:t.n, eleve:x}); }
    if(!t && id){ // pas dans la grille (arrivé après l'appel) : une moitié vide l'accueille
      var libre = SCN.places().filter(function(p){ return !p.d || !p.g; })[0], maj = {};
      if(E.tab){ libre = SCN.places().filter(function(p){ return p.n === E.tab; })[0] || libre; }
      if(libre){ var c = libre.g ? "d" : "g"; maj[cheminS(id, "places/" + libre.n + "/" + c)] = x; maj[cheminS(id, "places/" + libre.n + "/seul")] = null; t = {n:libre.n, cote:c}; }
      else { var nn = SCN.places().length + 1; maj[cheminS(id, "places/" + nn)] = {g:x, d:null, seul:true}; t = {n:nn, cote:"g"}; }
      maj[cheminS(id, "absents")] = SCN.absents().filter(function(y){ return y !== x; }); ecrireQCM(maj, "placer arrivé");
    }
    if(t && E.tab && E.tab !== t.n && autre) return Promise.resolve({ok:false, rejoins:SCN.voisinDe(x), tablette:t.n, eleve:x});
    if(t) E.tab = t.n;
    // la moitié de l'élève : celle de la grille (gauche ou droite), quelle que soit celle où il a tapé (un élève seul : la gauche)
    var c2 = t ? t.cote : cote; E.cotes[c2] = x; if(c2 !== cote && E.cotes[cote] === x) delete E.cotes[cote];
    garder();
    if(id){ var m2 = {}; m2[cheminS(id, "entres/" + x)] = LIVE.maintenant(); ecrireQCM(m2, "entrer"); }
    if(typeof mjpcRetirerBoutonProf === "function") mjpcRetirerBoutonProf();
    return Promise.resolve({ok:true, eleve:x, tablette:E.tab, cote:c2, voisin:SCN.voisinDe(x)});
  }
  E.cocher = function(attest, ligne, x){ x = qui(x); if(!x) return Promise.resolve(); var a = SCN.attestDe(attest, x) || {}; return w("attest/" + attest + "/" + x, {lignes:Math.max(ligne, a.lignes || 0), fini:!!a.fini, ms:LIVE.maintenant()}, "cocher"); };
  E.commencer = function(x, attest){ x = qui(x); if(!x) return Promise.resolve(); var n = attest || ((SCN.etat() || {}).ph === "att2" ? 2 : 1); var a = SCN.attestDe(n, x) || {};
    return w("attest/" + n + "/" + x, {lignes:a.lignes || 0, fini:true, ms:LIVE.maintenant()}, "commencer"); };
  // répondre : la forme de la 7.7.1 ({choix, ts}), plus le tour et l'heure ; une réponse donnée à une question rouverte est définitive
  E.repondre = function(qi, choix, x){ x = qui(x); var id = sid(); if(!x || !id) return Promise.resolve(); var e = SCN.etat() || {};
    var ouvert = (e.ph === "reponse" || e.ph === "rouvert") && e.qi === qi && (e.ph === "rouvert" ? e.pour === x : SCN.cote(x) === e.cote) && (SCN.reste(e) == null || SCN.reste(e) > 0);
    if(!ouvert) return Promise.resolve({ok:false});
    if(e.rouvert === "tous" && SCN.reponse(x, qi) && !SCN.reponse(x, qi).rouverte) return Promise.resolve({ok:false});
    if(!choix || !choix.length) return w("reponses/" + qi + "/" + x, null, "repondre (vide)");
    return w("reponses/" + qi + "/" + x, {choix:choix.slice().map(Number).sort(function(a, b){ return a - b; }), ts:LIVE.maintenant(), ms:LIVE.maintenant(), tour:e.tour || 1, rouverte:e.ph === "rouvert" || !!e.rouvert || null}, "repondre"); };
  E.direB = function(qi, ouiNon, x){ x = qui(x); return x ? w("b/" + qi + "/" + x, ouiNon, "direB") : Promise.resolve(); };
  // la moitié de cet élève doit-elle dire B maintenant ? (la phase b de son tour, ou la suite déjà commencée par un geste de Paul : bPour)
  E.doitDireB = function(x){ return SCN.doitDireB(qui(x)); };
  E.estimer = function(niveau, x){ x = qui(x); return x ? w("autoevals/" + x, niveau, "estimer") : Promise.resolve(); };
  // lire la feuille du voisin : x est le propriétaire de la feuille (sa moitié) ; le lecteur est son voisin
  E.lire = function(qi, choix, x){ x = qui(x); if(!x) return Promise.resolve(); var v = SCN.voisinDe(x);
    return w("lectures/" + qi + "/" + x, {choix:choix === "aucun" ? "aucun" : (choix || []).slice().map(Number).sort(function(a, b){ return a - b; }), par:v || x, ms:LIVE.maintenant()}, "lire"); };
  // la co-évaluation : « ok », « mal » ou « peut » ; « mal » ouvre une alerte que Paul tranche
  E.coeval = function(statut, qi, ecrit, x){ x = qui(x); var id = sid(); if(!x || !id) return Promise.resolve();
    var maj = {}, now = LIVE.maintenant(); maj[cheminS(id, "coeval/" + x)] = {statut:statut, qi:qi == null ? null : qi, ecrit:ecrit == null ? null : ecrit, ms:now};
    if(statut === "mal" && qi != null){ var aid = "a_" + x + "_" + qi; maj[cheminS(id, "alertes/" + aid)] = {qi:qi, eleves:[x, SCN.voisinDe(x)].filter(Boolean), ms:now, ecrit:ecrit == null ? null : ecrit, lu:(SCN.lecture(x, qi) || {}).choix || null}; }
    return ecrireQCM(maj, "coeval"); };
  E.sortir = function(cote){ delete E.cotes[cote]; if(!E.cotes.g && !E.cotes.d){ E.tab = null; E.n = null; } garder(); };
  return E;
})();

/* ══════════════════════ Le moteur : il fait passer les temps comptés (console, téléphone, tableau) ══════════════════════
   Le passage s'écrit par transaction : deux pages qui le tentent ensemble n'en font qu'un. */
var MOTEUR = (function(){
  var M = {actif:false};
  function suivant(e, sid){
    var D = SCN.durees(), t = SCN.tempsDe(e.qi, null, null, sid);
    if(e.ph === "reflexion") return {ph:"passage", qi:e.qi, tour:1, cote:SCN.coteDuTour(e.qi, 1, sid), duree:D.decompte, rouvert:e.rouvert || null};
    if(e.ph === "passage") return {ph:"reponse", qi:e.qi, tour:e.tour, cote:e.cote, duree:t.reponse, rouvert:e.rouvert || null};
    if(e.ph === "reponse") return {ph:"b", qi:e.qi, tour:e.tour, cote:e.cote, duree:D.b, rouvert:e.rouvert || null};
    if(e.ph === "b" && e.tour === 1){
      var autre = SCN.coteDuTour(e.qi, 2, sid), quelquun = SCN.presents(null, sid).some(function(x){ return SCN.cote(x, sid) === autre; });
      if(quelquun) return {ph:"passage", qi:e.qi, tour:2, cote:autre, duree:D.decompte, rouvert:e.rouvert || null};
      return {ph:"close", qi:e.qi};
    }
    if(e.ph === "b" || e.ph === "rouvert") return {ph:"close", qi:e.qi};
    return null;
  }
  M.tic = function(){
    var sid = SCN.sid(), e = SCN.etat(sid); if(!sid || !e || !e.duree || e.legacy) return;
    if(["reflexion", "passage", "reponse", "b", "rouvert"].indexOf(e.ph) < 0) return;
    if(SCN.reste(e) > 0) return;
    // une tablette ne passe la phase que si la console ne l'a pas fait 1,5 s après la fin du temps (console fermée, réseau perdu)
    if(M.relais && LIVE.maintenant() - ((e.depuis || 0) + e.duree * 1000) < 1500) return;
    var n = suivant(e, sid); if(!n || !db) return;
    var attendu = e.depuis, ph = e.ph;
    db.ref(DB_ROOT + "/sessions/" + sid + "/deroule").transaction(function(cur){
      if(!cur || cur.ph !== ph || cur.depuis !== attendu) return;   // déjà passé ailleurs
      return nettoyerQCM(Object.assign({qi:null, tour:null, cote:null, duree:null, pour:null}, n, {depuis:LIVE.maintenant()}));
    }, function(err, ok, snap){ if(ok && snap){ var d = snap.val(), maj = {}; maj[cheminS(sid, "phase")] = _ph717(d.ph); maj[cheminS(sid, "phaseStart")] = d.depuis; ecrireQCM(maj, "miroir"); } });
  };
  // l'entrée finie : quand tous les présents ont fini l'attestation, la console passe à « prêts »
  M.entree = function(){ var sid = SCN.sid(), e = SCN.etat(sid); if(!sid || !e || e.ph !== "entree") return; var c = SCN.compteurs(null, sid);
    if(c.attestations && c.attestations[1] > 0 && c.attestations[0] === c.attestations[1]) poserDeroule(sid, {ph:"pret"}); };
  // la seconde attestation finie : la lecture de la première question commence
  M.att2 = function(){ var sid = SCN.sid(), e = SCN.etat(sid); if(!sid || !e || e.ph !== "att2") return; var c = SCN.compteurs(null, sid);
    if(c.prets && c.prets[1] > 0 && c.prets[0] === c.prets[1]) ACT.lireQuestion(null); };
  // la console, le téléphone et le tableau mènent ; une tablette relaie seulement les temps comptés (M.relais), jamais l'entrée ni la correction
  M.demarrer = function(relais){ if(M.actif) return; M.actif = true; M.relais = !!relais;
    setInterval(function(){ try { M.tic(); if(!M.relais){ M.entree(); M.att2(); } } catch(e){ console.error(e); } }, relais ? 500 : 250); };
  return M;
})();
