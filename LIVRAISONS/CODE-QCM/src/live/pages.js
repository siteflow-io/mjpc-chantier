/* ═══════════════ QCM-1 · SOCLE — les pages : chaque appareil montre l'écran de la maquette qui va à son moment ═══════════════
   La console (?mode=prof), le tableau (&view=board), le téléphone (&view=phone, le QR), la tablette (?mode=eleve), l'accueil.
   PAGES.ecran() rend {id, render?} : l'écran de la maquette (son id, celui des scènes) que l'appareil montre maintenant.
   NAV : ce que Paul a ouvert sur place (un onglet, une fenêtre, une fiche), avec l'objet cliqué (NAV.params : q, eleve, seance…) ;
   une fenêtre se ferme en revenant à l'écran d'où elle s'est ouverte (NAV.pile). Rien de tout cela n'est dans l'adresse : un
   rechargement revient à l'écran du moment, la séance gardant tout dans la base. */
var NAV = {ecran:null, params:{}, pile:[]};
function navOuvrir(id, params){
  NAV.pile.push({ecran:NAV.ecran, params:NAV.params}); NAV.ecran = id; NAV.params = params || {}; LIVE.changer();
}
function navFermer(){ var p = NAV.pile.pop(); if(p){ NAV.ecran = p.ecran; NAV.params = p.params; } else { NAV.ecran = null; NAV.params = {}; } LIVE.changer(); }
function navRemettre(){ NAV.ecran = null; NAV.params = {}; NAV.pile = []; LIVE.changer(); }

var PAGES = (function(){
  var P = {};
  // la console, d'après la phase réelle de la séance pilotée ; hors séance, le lancement
  P.CONSOLE = {avant:"c-lancer", appel:"c-appel", entree:"c-pret", pret:"c-pret", reflexion:"c-q1-reflexion", passage:"c-q1-tour1", reponse:"c-q1-tour1", b:"c-q1-tour1",
    close:"c-q1-close", rouvert:"c-q1-tour1", pause:"c-q1-tour1", estim:"c-estim", att2:"c-attest2", lecture:"c-corr-q2-avant", revele:"c-corr-q2-apres",
    coeval:"c-coeval-attente", bilan:"c-bilan", fin:"c-lancer", papier:"c-papier-seance"};
  // le 2e tour a son écran de console (« 🔒 Clore la question »)
  P.console = function(){
    var e = SCN.etat();
    if(!SCN.sid() || !e) return "c-lancer";
    var ph = e.ph === "pause" && e.reprise ? e.reprise.ph : e.ph, tour = e.ph === "pause" && e.reprise ? e.reprise.tour : e.tour;
    if(e.autreHeure) return "c-lancer";
    if(["reponse", "passage", "b"].indexOf(ph) >= 0 && tour === 2) return "c-q1-tour2";
    return P.CONSOLE[ph] || "c-lancer";
  };
  // le tableau : l'énoncé et le chrono, jamais les choix ; à la correction, la lecture puis les choix révélés
  P.tableau = function(){ var e = SCN.etat() || {}; return e.ph === "lecture" ? "b-recopie" : e.ph === "revele" ? "b-correction" : "b-reponse"; };
  // le téléphone : la télécommande ; à la correction, avant et après la révélation
  P.telephone = function(){ var e = SCN.etat() || {}; return e.ph === "lecture" ? "p-corr-avant" : e.ph === "revele" || e.ph === "coeval" || e.ph === "bilan" ? "p-corr-apres" : "p-reponse"; };
  /* Les points d'entrée des écrans (DEMANDES : QCM-2 · HEURE, 17:40 ; QCM-3 · SOIR, 17:45) : quand ils existent, ce sont eux qui dessinent.
     EcranConsoleHeure() (la console de l'appel au bilan), EcranTablette(), EcranTableau(), EcranTelephone() ; EcranConsoleSoir(id) pour les
     écrans hors de l'heure (ECRANS_SOIR_V) ; EcranMesEvaluations() pour l'élève. À défaut, l'écran de la maquette (son id). */
  function fn(n){ return typeof window[n] === "function" ? window[n] : null; }
  function soir(id){ var l = (typeof ECRANS_SOIR_V !== "undefined" && ECRANS_SOIR_V) || {}, l2 = (typeof ECRANS_EVALS_V !== "undefined" && ECRANS_EVALS_V) || {}; return !!(l[id] || l2[id]) && !!fn("EcranConsoleSoir"); }
  P.estSoir = soir;
  P.ecran = function(){
    var app = LIVE.appareil();
    if(app === "accueil") return {id:"c-accueil", vue:"console"};
    if(app === "tablette"){
      if(NAV.ecran === "e-mes-evals" && fn("EcranMesEvaluations")) return {id:"e-mes-evals", vue:"tablette", render:function(){ return fn("EcranMesEvaluations")(); }, cle:JSON.stringify(NAV.params)};
      // la tablette de QCM-2 dès que la classe est connue (« Combien êtes-vous ? », l'entrée, les moitiés) ; avant, le choix de la classe
      if(fn("EcranTablette") && LIVE.pret && classeTablette() && SCN.sid()){ if((ELV.cotes.g || ELV.cotes.d) && SCN.sid() !== ELV.sid){ ELV.oublier(); ELV.sid = SCN.sid(); }
        return {id:"t-live", vue:"tablette", render:function(){ return fn("EcranTablette")(); }, cle:"tablette-heure"}; }
      return {id:"t-live", vue:"tablette", render:function(){ return h(TabletteLive); }, cle:"tablette"};
    }
    // la console, le tableau, le téléphone : la séance pilotée est celle de la classe choisie, sinon la seule séance active
    choisirSeance();
    if(app === "console"){
      if(NAV.ecran && soir(NAV.ecran)) return {id:NAV.ecran, vue:"console", render:function(){ return fn("EcranConsoleSoir")(NAV.ecran); }, cle:NAV.ecran + JSON.stringify(NAV.params)};
      // une fenêtre ouverte sur place : EcranConsoleHeure la dessine s'il le déclare (EcranConsoleHeure.fenetres), sinon l'écran de la maquette
      if(NAV.ecran && fn("EcranConsoleHeure") && fn("EcranConsoleHeure").fenetres) return {id:NAV.ecran, vue:"console", render:function(){ return fn("EcranConsoleHeure")(); }, cle:"console-heure"};
      if(NAV.ecran) return {id:NAV.ecran, cle:JSON.stringify(NAV.params)};
      var id = P.console();
      // la séance sur papier, pendant l'heure : l'écran de QCM-3 (c-papier-seance) ; sa correction : c-papier-correction
      if(id === "c-papier-seance" && soir(id)) return {id:id, vue:"console", render:function(){ return fn("EcranConsoleSoir")(id); }, cle:"papier"};
      if(id !== "c-lancer" && fn("EcranConsoleHeure")) return {id:id, vue:"console", render:function(){ return fn("EcranConsoleHeure")(); }, cle:"console-heure"};
      return {id:id};
    }
    if(app === "tableau"){ if(fn("EcranTableau")) return {id:P.tableau(), vue:"tableau", render:function(){ return fn("EcranTableau")(); }, cle:"tableau"}; return {id:P.tableau()}; }
    if(app === "telephone"){
      if(NAV.ecran) return {id:NAV.ecran, cle:JSON.stringify(NAV.params)};
      // sans séance active : l'écran de la 7.7.1 (VuePhone), mot pour mot ; la maquette n'en a pas
      if(LIVE.pret && !SCN.sid()) return {id:"p-sans-seance", vue:"telephone", render:TelephoneSansSeance, cle:"telephone-sans"};
      if(fn("EcranTelephone")) return {id:P.telephone(), vue:"telephone", render:function(){ return fn("EcranTelephone")(); }, cle:"telephone"};
      return {id:P.telephone()};
    }
    return {id:"c-accueil"};
  };
  function choisirSeance(){
    if(LIVE.sid && SCN.sess(LIVE.sid) && SCN.sess(LIVE.sid).etat !== "terminee") return;
    var actives = LIVE.d.sessionActive || {}, cl = Object.keys(actives).filter(function(c){ return c.charAt(0) !== "_" && (LIVE.d.sessions || {})[actives[c]]; });
    if(LIVE.classeSlug && actives[LIVE.classeSlug]){ LIVE.sid = actives[LIVE.classeSlug]; return; }
    // la séance la plus récente (une séance d'hier restée ouverte ne prend pas la place de celle de ce matin)
    if(cl.length >= 1){ var r = SCN.seancesActives()[0]; if(r){ LIVE.classeSlug = r.classe; LIVE.sid = r.id; return; } LIVE.classeSlug = cl[0]; LIVE.sid = actives[cl[0]]; return; }
    if(LIVE.sid && (!SCN.sess(LIVE.sid) || SCN.sess(LIVE.sid).etat === "terminee")) LIVE.sid = null;
  }
  P.choisirSeance = choisirSeance;
  return P;
})();

/* ══════════════════════ La tablette réelle : deux moitiés, chacune à son élève ══════════════════════
   L'entrée (la classe, « Combien êtes-vous sur cette tablette ? », « 👋 Identifie-toi » par le code) est celle de la maquette,
   vérifiée contre l'empreinte de /codes (ELV.entrer). Ensuite, chaque moitié montre l'écran de son élève au moment réel :
   MOITIES.ecran(e, cote) (src/live/pages.js, à compléter par les écrans de l'heure : QCM-2). */
function eleveDe(x, sansVoisin){ if(!x) return null; var n = SCN.nomDe(x), e = {cle:x, slug:x, nom:n, prenom:SCN.pre(x), sexe:SCN.sexe(x) || "M"};
  if(!sansVoisin){ var v = SCN.voisinDe(x); e.voisin = v ? eleveDe(v, true) : null; }
  return e; }
function classeTablette(){
  if(LIVE.classeSlug && (LIVE.d.classes || {})[LIVE.classeSlug]) return LIVE.classeSlug;
  var a = LIVE.d.sessionActive || {}, cl = Object.keys(a).filter(function(c){ return c.charAt(0) !== "_"; });
  if(cl.length === 1){ LIVE.classeSlug = cl[0]; return cl[0]; }
  return null;
}
function TabletteLive(){
  if(!LIVE.pret) return Page(null, "Chargement...", null);
  var classe = classeTablette();
  // la séance de la classe s'est terminée : la tablette oublie ses élèves et revient à « Combien êtes-vous ? »
  if(ELV.tab && ELV.sid && SCN.sid() !== ELV.sid){ ELV.oublier(); ELV.fin = !SCN.sid(); ELV.sid = SCN.sid(); }
  if(!classe) return h(ChoixClasse);
  // t-fin : la séance finie, « Combien êtes-vous ? » (puis, sans séance, l'entrée par le code)
  if(ELV.fin && !SCN.sid()) return EcrCombienLive();
  if(SCN.sid()) ELV.fin = false;
  /* Sans séance active (chez lui, ou avant le lancement) : l'élève entre par son code sur une demi-tablette, puis voit sa moitié, avec
     « 📊 Mes évaluations » ; au lancement d'une séance, la tablette l'oublie et revient à « Combien êtes-vous sur cette tablette ? » */
  if(!SCN.sid()){
    var ici = ELV.cotes.g || ELV.cotes.d;
    if(!ici) return h("div", {className:"tablette seule seule-login"}, h("div", {className:"moitie g"}, h(LoginLive, {cote:"g", key:"lg-hors"})));
    var e0 = eleveDe(ici);
    return h("div", {className:"tablette seule"}, h("div", {className:"moitie g"}, Page(badgeDe(e0), null, h("div", {className:"etat-attente"}, "⏳ En attente du démarrage…"))));
  }
  if((ELV.cotes.g || ELV.cotes.d) && ELV.sid !== SCN.sid()){ ELV.oublier(); ELV.sid = SCN.sid(); }
  if(!ELV.n) return EcrCombienLive();
  if(ELV.n === 1){ var x1 = ELV.cotes.g; return h("div", {className:"tablette seule" + (x1 ? "" : " seule-login")}, h("div", {className:"moitie g"}, x1 ? MOITIES.ecran(eleveDe(x1), "g") : h(LoginLive, {cote:"g", key:"lg"}))); }
  var g = ELV.cotes.g, d = ELV.cotes.d;
  return Tablette(g ? MOITIES.ecran(eleveDe(g), "g") : h(LoginLive, {cote:"g", key:"lg"}), d ? MOITIES.ecran(eleveDe(d), "d") : h(LoginLive, {cote:"d", key:"ld"}));
}
// la classe : celle de la séance active ; s'il y en a plusieurs, l'élève la choisit (la 7.7.1 : « 🎓 Choisis ta classe »)
function ChoixClasse(){
  var a = LIVE.d.sessionActive || {}, cl = Object.keys(a).filter(function(c){ return c.charAt(0) !== "_"; });
  var liste = cl.length ? cl : SCN.classes();
  return h("div", {className:"eleve-page"}, DECO.map(function(e, i){ return h("span", {key:i, className:"deco"}, e); }),
    h("div", {className:"eleve-card"}, h("h1", null, "🎓 Choisis ta classe"),
      liste.length === 0 ? h("p", {style:{color:"var(--gris)"}}, "Aucune classe disponible.")
        : h("div", {className:"eleves-grid"}, liste.map(function(c){ return h("button", {key:c, className:"eleve-btn", "data-local":"1", onClick:function(){ ELV.choisirClasse(c); }}, ((LIVE.d.classes || {})[c] || {}).libelle || c); }))));
}
function EcrCombienLive(){
  return Page(null, "Combien êtes-vous sur cette tablette ?",
    h("div", {className:"combien"},
      h("button", {className:"btn btn-ghost", "data-local":"1", onClick:function(){ ELV.combien(1); }}, "👤 1 élève"),
      h("button", {className:"btn btn-primary", "data-local":"1", onClick:function(){ ELV.combien(2); }}, "👥 2 élèves")));
}
// « 👋 Identifie-toi » : les trois champs et le clavier de la maquette (c3-tablettes.js, LoginMoitie) ; « Entrer → » vérifie le code contre son empreinte
function LoginLive(p){
  var s = useState({code:"", prenom:"", nom:"", champ:"code", err:"", maj:false, attente:false}), st = s[0], set = s[1];
  var r = React.useRef(st); r.current = st;
  function maj(o){ set(function(x){ return Object.assign({}, x, o); }); }
  function entrer(){
    var c = r.current; if(c.attente) return;
    maj({attente:true});
    ELV.entrer(p.cote, c.code, c.prenom, c.nom).then(function(res){
      if(res.ok) return;
      if(res.rejoins){ var v = eleveDe(res.rejoins); maj({attente:false, err:"", rejoins:{eleve:res.eleve, voisin:v, n:res.tablette}}); return; }
      maj({attente:false, err:res.err || "Ce code ne correspond pas. Vérifie tes 4 chiffres."});
    }, function(){ maj({attente:false, err:"Ce code ne correspond pas. Vérifie tes 4 chiffres."}); });
  }
  function touche(c){
    if(c === "✓") return entrer();
    if(c === "⇧") return maj({maj:!r.current.maj});
    var x = r.current, o = {err:"", maj:false}; o[x.champ] = x.champ === "code" ? taper(x.code, c).replace(/\D/g, "").slice(0, 4) : taper(x[x.champ], c, x.maj); maj(o);
  }
  if(st.rejoins && typeof EcrRejoins === "function") return h("div", {className:"rejoins-live"}, EcrRejoins(eleveDe(st.rejoins.eleve), st.rejoins.voisin, "👬"),
    h("div", {style:{textAlign:"center", marginTop:8}}, h("button", {className:"btn btn-ghost btn-sm", "data-local":"1", onClick:function(){ maj({rejoins:null, code:"", prenom:"", nom:"", champ:"code"}); }}, "Pas là ? Choisir un autre élève")));
  function champ(c, ph, extra){ return h("input", Object.assign({inputMode:"none", value:st[c], placeholder:ph, className:st.champ === c ? "focus" : "", "data-champ":c, onFocus:function(){ if(r.current.champ !== c) maj({champ:c}); }, onClick:function(){ maj({champ:c}); },
    onKeyDown:function(e){ if(e.key === "Enter") entrer(); },
    onChange:function(e){ var o = {err:"", champ:c}; o[c] = c === "code" ? e.target.value.replace(/\D/g, "").slice(0, 4) : e.target.value; maj(o); }}, extra || {})); }
  return Page(null, "👋 Identifie-toi", h("div", {className:"eleve-form"},
    champ("code", "Mon code (4 chiffres)", {style:{textAlign:"center", letterSpacing:".3em", fontWeight:700}}),
    champ("prenom", "Prénom"), champ("nom", "Nom"),
    st.err && h("div", {className:"eleve-erreur"}, st.err),
    Clavier(st.champ === "code", touche, st.maj),
    h("button", {className:"btn-accueil", "data-local":"1", disabled:st.attente, onClick:entrer}, "Entrer →")));
}

/* ── Une moitié de tablette, au moment réel : l'écran de son élève ──
   MOITIES.ecran(e, cote) choisit l'écran de la maquette d'après la phase ; QCM-2 · HEURE peut le remplacer (MOITIES.ecran = …) ou
   le compléter phase par phase (MOITIES.PAR_PHASE[ph] = function(e, cote, m){…}). e : {cle, slug, nom, prenom, sexe}. */
var MOITIES = (function(){
  var M = {PAR_PHASE:{}};
  function voisin(e){ return eleveDe(SCN.voisinDe(e.slug)); }
  M.ecran = function(e, cote){
    var m = MOM(), ph = m.ph === "pause" && m.pause ? m.pause.ph : m.ph, qi = m.qi, reste = m.reste || 0, v = voisin(e) || e;
    try {
      if(M.PAR_PHASE[ph]) return M.PAR_PHASE[ph](e, cote, m);
      var a1 = SCN.attestDe(1, e.slug);
      if(!m.seance || ph === "avant" || ph === "fin") return typeof EcrAttente === "function" ? EcrAttente(e) : Page(null, "⏳", null);
      if(ph === "appel" || ph === "entree" || ph === "pret"){ if(!(a1 && a1.fini)) return Attest1(e, a1 ? a1.lignes || 0 : 0); return EcrPret(e); }
      if(ph === "reflexion") return EcrReflexion(e, qi, reste);
      var monTour = SCN.cote(e.slug) === SCN.coteDuTour(qi, m.tour || 1);
      if(ph === "passage") return monTour ? EcrReflexion(e, qi, reste) : Voile(e, false, v);
      if(ph === "reponse" || ph === "rouvert"){ if(!monTour && !(ph === "rouvert" && m.pour === e.slug)) return Voile(e, false, v);
        var rep = SCN.reponse(e.slug, qi); return EcrReponse(e, qi, SCN.ordreChoix(e.slug, qi), rep ? rep.choix : [], reste); }
      if(ph === "b"){ if(!monTour) return Voile(e, false, v); var r2 = SCN.reponse(e.slug, qi); return EcrDeclareFlux(e, qi, r2 ? r2.choix : [], reste); }
      if(ph === "close") return EcrAttente(e);
      if(ph === "estim") return EcrEstim(e, SCN.estimationDe(e.slug));
      if(ph === "att2"){ var a2 = SCN.attestDe(2, e.slug); return a2 && a2.fini ? EcrAttenteCorr(e) : Attest2(e, a2 ? a2.lignes || 0 : 0); }
      if(ph === "lecture") return EcrLecture(e, qi, !!SCN.lecture(e.slug, qi), reste);
      if(ph === "revele") return EcrRevele(e, qi);
      return EcrAttente(e);
    } catch(err){ console.error("QCM : la moitié de " + e.nom + " ne se dessine pas (" + ph + ")", err); return Page(null, e.prenom, null); }
  };
  return M;
})();

function TelephoneSansSeance(){
  return h("div", {style:{padding:"2rem", color:"#fff", textAlign:"center", minHeight:"100vh"}},
    h("div", {style:{fontSize:"3rem", marginBottom:"1rem"}}, "📱"),
    h("h2", {style:{marginBottom:".5rem"}}, "Pilotage mobile"),
    h("p", {style:{opacity:.9}}, "Aucune session active. Lance une session depuis l'ordinateur."));
}
/* Le téléphone scanné : il écrit qcm/qrScans/<nonce>, et la fenêtre du QR se ferme sur la console (la 7.7.1, VuePhone, l. 5374 à 5380) */
(function(){ try { var qr = LIVE.params().get("qr"); if(qr && LIVE.appareil() === "telephone" && db) db.ref(DB_ROOT + "/qrScans/" + qr).set(firebase.database.ServerValue.TIMESTAMP); } catch(e){ console.error(e); } })();

/* La séance interrompue (la 7.7.1 : AppProf, l. 6851 à 6887) : la console pose lastDisconnect quand elle se déconnecte ; à son ouverture,
   une séance active dont la dernière déconnexion n'a pas été reprise (lastDisconnect > repriseConfirmee) ouvre « ⚠️ Séance interrompue
   détectée » (c-interrompue), une seule fois par ouverture de la console : une coupure du réseau en cours d'heure ne l'ouvre pas. */
var INTERROMPUE = {vues:{}, posee:null};
LIVE.abonner(function(){
  if(LIVE.appareil() !== "console" || !LIVE.pret || !db) return;
  PAGES.choisirSeance();
  var sid = SCN.sid(), s = SCN.sess(sid); if(!sid || !s || s.etat === "terminee") return;
  if(INTERROMPUE.posee !== sid){ INTERROMPUE.posee = sid; try { db.ref(DB_ROOT + "/sessions/" + sid + "/lastDisconnect").onDisconnect().set(firebase.database.ServerValue.TIMESTAMP); } catch(e){ console.error(e); } }
  if(INTERROMPUE.vues[sid]) return; INTERROMPUE.vues[sid] = true;
  var e = SCN.etat(sid) || {};
  if(s.lastDisconnect && s.lastDisconnect > (s.repriseConfirmee || 0) && ["pause", "fin", "appel"].indexOf(e.ph) < 0 && !e.autreHeure) navOuvrir("c-interrompue");
});
