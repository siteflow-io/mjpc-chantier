// QCM-4 · BANC — la reprise 7 (DEFAUTS-OUVERTS, « Reprise 7 du 13/10, complétée le 15/10 », point 4), points 11, 12 et 13, rejoués par le geste :
//  A. (point 13) deux classes au faux hub (3 ESSAI, et 3 BANC ajoutée par O.ajouterClasse), une séance lancée pour chacune (deux consoles) ;
//     avant la séance de 3 BANC, un élève de 3 BANC (session MJPC, puis par son code) voit « ⏳ En attente du démarrage… » ; les deux séances
//     en cours : une tablette avec la session MJPC d'un élève de chaque classe, une tablette sans session où un élève de chaque classe tape
//     code, prénom, nom : chacun arrive dans la séance de sa classe ; « 🎓 Choisis ta classe » n'apparaît à aucune étape.
//  B. (points 11, 12) une séance de 3 ESSAI à deux tablettes (quatre élèves), une réponse fausse à Q1 ; à la lecture de la première question
//     corrigée, trois lecteurs cliquent, le quatrième non ; le chrono de lecture va à 0 : la lecture cliquée se fige, l'autre garde la main,
//     son nom en rouge sur la console, puis il clique : sa lecture est dans la base ; « 💡 Révéler » : la consigne en vert pour la réponse
//     fausse, le V vert pour la juste ; le texte de chaque moitié relevé à chaque phase : aucun « rouge », aucun élément .stylo-rouge.
//  C. (point 13 complété à 09:25) l'entrée unique, sans « Combien êtes-vous » : une session MJPC de professeur → « 👋 Identifie-toi », le code ;
//     une session d'une autre heure (un élève de 3 BANC, un autre élève de 3 ESSAI) → « Tu es bien … ? », « Non », puis le code ; le binôme qui
//     tape seulement son code (« Ton binôme : … », « …, tape ton code à 4 chiffres : ») ; un binôme absent à l'appel (l'élève seul, sans question),
//     puis marqué présent par Paul : l'autre moitié s'ouvre pour lui ; « 🛑 Terminer » : chaque tablette revient à l'entrée. Partout, à chaque
//     étape : jamais « Combien êtes-vous sur cette tablette ? » ni « 🎓 Choisis ta classe ».
//  Les tablettes s'ouvrent par A.ouvrir(nom, "?mode=eleve", 1280, 800) (A.tablette clique « Choisis ta classe », que ce banc doit voir).
//   APP_FILE=<app> BANC=<faux hub> node banc/banc-reprise7-d.js <dossier de sortie>   → <sortie>/reprise7-d.txt, <sortie>/captures-reprise7-d/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, slug, esc, norm, texte, zoneTexte, cliquer, choisir, taper, cocherTout, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "reprise7-d-" + Date.now()));
const CAP = path.join(SORTIE, "captures-reprise7-d"); fs.mkdirSync(CAP, {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H12 = H1 + ", " + H2, BANC = "QCM-4 · BANC";
const EV = JSON.parse(fs.readFileSync(path.join(O.RACINE, "AUDITS", "CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
const t0 = Date.now();
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return f; };
const hubs = [];

// ── la sortie : écrite à la fin, ou au plafond de 6 minutes ──
let ecrit = false;
function ecrire(fin){
  if(ecrit) return; ecrit = true;
  const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + (fin ? " · " + fin : "") + "\n" + J.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : x.secours ? "  SECOURS " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
  let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(e){}
  fs.writeFileSync(path.join(SORTIE, "reprise7-d.txt"), "Reprise 7, points 11, 12, 13, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
  console.log(out);
}
setTimeout(async () => { J.v(false, BANC, "plafond de 6 minutes atteint : le banc s'arrête là", J.partie); ecrire("arrêté au plafond de 6 minutes");
  try { for(const h of hubs) await h.A.fermer(); } catch(e){} process.exit(0); }, 6 * 60 * 1000).unref();
const veut = x => !process.env.SEULEMENT || process.env.SEULEMENT.includes(x);   // SEULEMENT=AC : ne jouer que ces parties (essais)
const note = s => { J.l.push({note: s}); console.log("  note   " + s); };

// ── outils de ce banc ──
const nouveauHub = async extra => { const h = await O.fauxHub(extra); const A = new O.Appareils(h.srv, h.port); await A.demarrer(); const x = {...h, A}; hubs.push(x); return x; };
const sidDe = (srv, cl) => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a[cl] || a[slug(cl)]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; return id || null; };
const sessDe = (srv, cl) => { const id = sidDe(srv, cl); return {sid: id, s: id ? srv.store.get("qcm/sessions/" + id) || {} : {}}; };
const CHOIX_CLASSE = /Choisis ta classe/;
// lancer une séance par le geste, depuis une console : Pilotage classe, la classe, l'évaluation d'essai, « 🚀 Lancer la séance », l'appel
async function lancer(prof, srv, cl, absents){
  await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(300);
  await choisir(prof, new RegExp("^\\s*" + esc(cl))); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(400);
  await cliquer(prof, /Lancer la séance/); await pause(500);
  for(const a of absents || []) await cliquer(prof, new RegExp(esc(a)));
  await cliquer(prof, /Lancer la séance/); await pause(1200);
  if(!sidDe(srv, cl)){ const f = await capt(prof, "lancer-" + slug(cl)); note("la séance de " + cl + " ne s'est pas lancée (" + f + ") : " + (await texte(prof)).slice(0, 300)); }
  return sidDe(srv, cl);
}
// une session MJPC d'élève sur la tablette (comme banc-jamais.js, « t-un-eleve »), puis le rechargement
async function sessionMJPC(p, e){
  await p.evaluate(e => { const s = JSON.stringify({display: e.nomComplet, nom: e.nom, prenom: e.prenom, classe: e.classe, ts: Date.now(), is_prof: false}); try { localStorage.setItem("mjpc_eleve", s); sessionStorage.setItem("mjpc_eleve", s); } catch(x){} }, e);
  await p.reload().catch(() => {}); await pause(1200);
}

// une session MJPC de professeur (Paul en « Voir comme un élève »)
async function sessionProf(p){
  await p.evaluate(() => { const s = JSON.stringify({display: "Professeur", is_prof: true, ts: Date.now()}); try { localStorage.setItem("mjpc_eleve", s); sessionStorage.setItem("mjpc_eleve", s); } catch(x){} });
  await p.reload().catch(() => {}); await pause(1200);
}
// ── la garde du point 13 : « Combien êtes-vous » et « Choisis ta classe », relevés à chaque étape de chaque tablette ──
const VU = new Map();   // page → [« écran » à « étape » (capture)]
async function garde(p, quoi){
  const t = await texte(p);
  for(const [re, ecran] of [[/Combien êtes-vous/, "« Combien êtes-vous sur cette tablette ? »"], [CHOIX_CLASSE, "« 🎓 Choisis ta classe »"]])
    if(re.test(t)){ const l = VU.get(p) || []; if(!l.some(x => x.startsWith(ecran))){ const f = await capt(p, "vu-" + slug(ecran).slice(0, 20) + "-" + slug(p.__nom)); l.push(ecran + " à " + quoi + " (" + f + ")"); VU.set(p, l); } }
  return t;
}
function verifGarde(p, qui){
  const l = VU.get(p) || [];
  J.v(!l.some(x => /Combien/.test(x)), H12, qui + " : jamais « Combien êtes-vous sur cette tablette ? »", l.filter(x => /Combien/.test(x)).join(" | "));
  J.v(!l.some(x => /Choisis/.test(x)), H12, qui + " : jamais « 🎓 Choisis ta classe »", l.filter(x => /Choisis/.test(x)).join(" | "));
}
// « 👋 Identifie-toi » : code, prénom, nom (dans la moitié si le formulaire y est, sinon l'écran entier), « Entrer »
async function ident(p, nom, code, cote){
  const [N, ...P] = nom.split(" "); let z = cote === undefined ? null : cote;
  if(!(await taper(p, z, "code", code))){ if(z === null) return false; z = null; if(!(await taper(p, null, "code", code))) return false; }
  await taper(p, z, "prenom", P.join(" ").toLowerCase()); await taper(p, z, "nom", N.toLowerCase());
  if(!(await cliquer(p, /Entrer/, z))) await cliquer(p, /Entrer/);
  await pause(700); return true;
}
// le binôme : « Ton binôme : … », « …, tape ton code à 4 chiffres : » sur sa moitié ; son code seul
async function codeBinome(p, cote, code){
  if(!(await taper(p, cote, "code", code))) return false;
  if(!(await cliquer(p, /Entrer/, cote))) await cliquer(p, /^✓$/, cote);
  await pause(700); return true;
}
// une tablette à deux : l'entrée unique (l'un s'identifie, la grille le place, son binôme tape son code), sinon l'ancienne (« 👥 2 élèves »)
async function entrerPaire(p, g, d, codeDe, quoi){
  for(let k = 0; k < 20; k++){ const t = await garde(p, quoi); if(/Combien êtes-vous|Identifie-toi|Tu es bien/.test(t)) break;
    if(CHOIX_CLASSE.test(t)){ J.secours(p.__nom + " : « Choisis ta classe » ; le banc clique « 3 ESSAI »"); await cliquer(p, /^3 ESSAI$/); } await pause(250); }
  const t = await garde(p, quoi);
  if(/Combien êtes-vous/.test(t)){ J.secours(p.__nom + " : l'ancienne entrée (« 👥 2 élèves », chaque moitié) pour jouer la suite"); await cliquer(p, /2 élèves/); await pause(300);
    await ident(p, g, codeDe(g), "g"); await ident(p, d, codeDe(d), "d"); return "ancienne"; }
  if(/Tu es bien/.test(t)){ await cliquer(p, /^Non$/); await pause(400); }
  await ident(p, g, codeDe(g), null);
  for(let k = 0; k < 12 && !/tape ton code/.test(await zoneTexte(p, "d")); k++) await pause(250);
  await codeBinome(p, "d", codeDe(d)); await garde(p, quoi);
  return "nouvelle";
}

(async () => {
  // ════════════════ A — point 13 : deux classes, deux séances, la classe vient de l'identité ════════════════
  if(veut("A")) try {
    J.section("Point 13 — deux classes au faux hub, la séance de 3 ESSAI lancée ; 3 BANC sans séance");
    let C2 = null;
    const {B, srv, A} = await nouveauHub(B => { C2 = O.ajouterClasse(B, "3 BANC", "3e", ["ALBERT Noé", "BRUN Lina", "COSTE Maël", "DIAZ Inès"], 4101); });
    const E1 = nm => { const e = B.eleves.find(x => x.nomComplet === nm); const [N, ...P] = nm.split(" "); return {nomComplet: nm, nom: N, prenom: P.join(" "), code: e.code, classe: "3 ESSAI"}; };
    const prof1 = await A.ouvrir("console-3essai", "?mode=prof", 1536, 864);
    const sid1 = await lancer(prof1, srv, "3 ESSAI", ["YVON Adam"]);
    J.v(!!sid1, H12, "la séance de 3 ESSAI est lancée par le geste (sessionActive/3 ESSAI)", JSON.stringify(srv.store.get("qcm/sessionActive")));
    if(!sid1) throw new Error("pas de séance pour 3 ESSAI");
    const pl1 = sessDe(srv, "3 ESSAI").s.places || {};
    const gauches = Object.keys(pl1).map(k => pl1[k].g).filter(Boolean);
    const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
    const eMJ1 = E1(nomDe(gauches[0])), eCO1 = E1(nomDe(gauches[1]));
    const eMJ2 = Object.assign({}, C2[0], {classe: "3 BANC"}), eCO2 = Object.assign({}, C2[2], {classe: "3 BANC"});
    note("3 ESSAI : " + eMJ1.nomComplet + " (session MJPC), " + eCO1.nomComplet + " (code) ; 3 BANC : " + eMJ2.nomComplet + " (session MJPC), " + eCO2.nomComplet + " (code)");

    // le parcours d'une tablette : à chaque étape, « Choisis ta classe » est-il là ? (vu une fois : noté, puis le banc choisit la classe pour voir la suite)
    const vuChoix = new Map();
    async function etape(p, e, quoi){
      const t = await garde(p, e.prenom + ", " + quoi);
      if(CHOIX_CLASSE.test(t)){
        if(!vuChoix.has(p)){ const f = await capt(p, "choix-classe-" + slug(e.prenom)); vuChoix.set(p, quoi + " (" + f + ")"); }
        await cliquer(p, new RegExp("^" + esc(e.classe) + "$")); await pause(400);
        J.secours("« 🎓 Choisis ta classe » affiché à " + e.prenom + " (" + quoi + ") : le banc clique « " + e.classe + " » pour voir la suite");
        return await texte(p);
      }
      return t;
    }
    // entrer : « 👤 1 élève », puis « Tu es bien … ? » → « Oui » (session MJPC) ou le code, le prénom, le nom (« 👋 Identifie-toi »)
    async function arriver(p, e, mode){
      for(let k = 0; k < 14; k++){
        const t = await etape(p, e, "étape " + (k + 1));
        if(/Combien êtes-vous/.test(t)){ if(!p.__s1){ p.__s1 = true; J.secours(e.prenom + " : « Combien êtes-vous ? » ; le banc clique « 👤 1 élève » pour voir la suite"); } await cliquer(p, /1 élève/); await pause(500); continue; }
        if(new RegExp("Tu es bien " + esc(e.prenom)).test(t)){ await cliquer(p, /^Oui$/); await pause(700); continue; }
        if(/Tu es bien/.test(t)){ note(e.prenom + " : la tablette demande « " + (t.match(/Tu es bien [^?]*\?/) || [""])[0] + " »"); await cliquer(p, /^Non$/); await pause(500); continue; }
        if(/Identifie-toi/.test(t)){
          if(mode === "mjpc"){ if(k < 3){ await pause(400); continue; } note(e.prenom + " (session MJPC) : « 👋 Identifie-toi » demande son code ; le banc ne le tape pas"); break; }
          if(p.__tape) break; p.__tape = true;
          await ident(p, e.nomComplet, e.code, "g"); await pause(200); continue; }
        break;
      }
      p.__tape = false;
      return etape(p, e, "après l'entrée");
    }
    const entreDans = (sl) => { const S = srv.store.get("qcm/sessions") || {}; return Object.keys(S).filter(id => S[id] && S[id].entres && S[id].entres[sl]).map(id => S[id].classeSlug + " (" + id + ")"); };

    J.section("Point 13 — sans séance pour 3 BANC : « ⏳ En attente du démarrage… »");
    const tMJ2 = await A.ouvrir("tablette-mjpc-3banc", "?mode=eleve", 1280, 800);
    await sessionMJPC(tMJ2, eMJ2);
    let t = await arriver(tMJ2, eMJ2, "mjpc"); let f = await capt(tMJ2, "13-attente-mjpc-" + slug(eMJ2.prenom));
    // sans séance, l'entrée par le code reste celle d'aujourd'hui (« comme aujourd'hui ») : la session MJPC n'y dispense pas (noté, non compté)
    if(/Identifie-toi/.test(t) && !/En attente du démarrage/.test(t)){ note(eMJ2.prenom + " (session MJPC), sans séance pour 3 BANC : « 👋 Identifie-toi » (" + f + ") ; la session ne l'entre pas sans code hors séance — non compté (« comme aujourd'hui ») ; il tape son code");
      t = await arriver(tMJ2, eMJ2, "code"); f = await capt(tMJ2, "13-attente-mjpc-code-" + slug(eMJ2.prenom)); }
    J.v(/En attente du démarrage/.test(t), H12, eMJ2.prenom + " (3 BANC, session MJPC), seule la séance de 3 ESSAI en cours : « ⏳ En attente du démarrage… »", "(" + f + ") " + t.slice(0, 220) + " · entré dans : " + JSON.stringify(entreDans(slug(eMJ2.nomComplet))));
    J.v(entreDans(slug(eMJ2.nomComplet)).length === 0, H1, eMJ2.prenom + " (3 BANC) n'est entré dans aucune séance (pas dans celle de 3 ESSAI)", JSON.stringify(entreDans(slug(eMJ2.nomComplet))));
    const tCO2 = await A.ouvrir("tablette-code-3banc", "?mode=eleve", 1280, 800);
    t = await arriver(tCO2, eCO2, "code"); f = await capt(tCO2, "13-attente-code-" + slug(eCO2.prenom));
    J.v(/En attente du démarrage/.test(t), H12, eCO2.prenom + " (3 BANC) tape code, prénom, nom, seule la séance de 3 ESSAI en cours : « ⏳ En attente du démarrage… »", "(" + f + ") " + t.slice(0, 220));
    J.v(entreDans(slug(eCO2.nomComplet)).length === 0, H1, eCO2.prenom + " (3 BANC) n'est entré dans aucune séance", JSON.stringify(entreDans(slug(eCO2.nomComplet))));

    J.section("Point 13 — la séance de 3 BANC lancée (seconde console) : deux séances en cours en même temps");
    const prof2 = await A.ouvrir("console-3banc", "?mode=prof", 1536, 864);
    let sid2 = await lancer(prof2, srv, "3 BANC", []);
    if(!sid2){
      note("« 🎯 Pilotage classe » d'une seconde console, une séance en cours (3 ESSAI), mène au pilotage de cette séance et non à « 🎯 Lancer une nouvelle séance » : la séance de 3 BANC ne se lance pas par le geste (à dire à QCM-1, QCM-2 ; non compté ici)");
      J.secours("la séance de 3 BANC lancée par ACT.lancerSeance(\"3 BANC\", \"essai\") + ACT.appelFini([]) sur la seconde console, pour jouer le point 13");
      await prof2.evaluate(() => ACT.lancerSeance("3 BANC", "essai", {}).then(() => ACT.appelFini([]))).catch(e => note("ACT a échoué : " + e.message)); await pause(1500);
      sid2 = sidDe(srv, "3 BANC");
    }
    const actives = srv.store.get("qcm/sessionActive") || {};
    J.v(!!sid2 && !!sidDe(srv, "3 ESSAI") && sid2 !== sidDe(srv, "3 ESSAI"), H12, "deux séances en cours : sessionActive porte 3 ESSAI et 3 BANC", JSON.stringify(actives));
    if(!sid2) throw new Error("pas de séance pour 3 BANC");
    await pause(800);

    J.section("Point 13 — par la session MJPC : chacun arrive dans la séance de sa classe");
    const tMJ1 = await A.ouvrir("tablette-mjpc-3essai", "?mode=eleve", 1280, 800);
    await sessionMJPC(tMJ1, eMJ1);
    for(const [p, e, sid, cl] of [[tMJ1, eMJ1, sid1, "3 ESSAI"], [tMJ2, eMJ2, sid2, "3 BANC"]]){
      t = await arriver(p, e, "mjpc"); f = await capt(p, "13-mjpc-" + slug(e.prenom));
      const ou = entreDans(slug(e.nomComplet));
      J.v(ou.length === 1 && ou[0].includes(sid), H12, e.prenom + " (" + cl + ", session MJPC) arrive dans la séance de " + cl + " (sessions/" + sid + "/entres)", "(" + f + ") entré dans : " + JSON.stringify(ou) + " · écran : " + t.slice(0, 200));
      J.v(new RegExp("Avant de commencer, " + esc(e.prenom)).test(t), H2, e.prenom + " : sa moitié montre la séance (« Avant de commencer, " + e.prenom + " »)", "(" + f + ") " + t.slice(0, 220));
    }
    J.section("Point 13 — sans session MJPC, par « 👋 Identifie-toi » : chacun arrive dans la séance de sa classe");
    const tCO1 = await A.ouvrir("tablette-code-3essai", "?mode=eleve", 1280, 800);
    for(const [p, e, sid, cl] of [[tCO1, eCO1, sid1, "3 ESSAI"], [tCO2, eCO2, sid2, "3 BANC"]]){
      t = await arriver(p, e, "code"); f = await capt(p, "13-code-" + slug(e.prenom));
      const ou = entreDans(slug(e.nomComplet));
      J.v(ou.length === 1 && ou[0].includes(sid), H12, e.prenom + " (" + cl + ", code, prénom, nom) arrive dans la séance de " + cl, "(" + f + ") entré dans : " + JSON.stringify(ou) + " · écran : " + t.slice(0, 200));
      J.v(new RegExp("Avant de commencer, " + esc(e.prenom)).test(t), H2, e.prenom + " : sa moitié montre la séance (« Avant de commencer, " + e.prenom + " »)", "(" + f + ") " + t.slice(0, 220));
    }
    J.section("Point 13 — « 🎓 Choisis ta classe » et « Combien êtes-vous » à aucune étape");
    for(const [p, e] of [[tMJ2, eMJ2], [tCO2, eCO2], [tMJ1, eMJ1], [tCO1, eCO1]]) verifGarde(p, e.prenom + " (" + e.classe + ")");
    for(const p of A.pages) if(p.__err.length) note(p.__nom + " : " + p.__err.slice(0, 3).join(" | "));
    await A.fermer();
  } catch(e){ J.v(false, BANC, "point 13 : le jeu s'est interrompu : " + e.message); }

  // ════════════════ B — points 11 et 12 : une séance de 3 ESSAI jusqu'à la correction ════════════════
  if(veut("B")) try {
    J.section("Points 11, 12 — la séance de 3 ESSAI, deux tablettes, quatre élèves");
    const {B, srv, A} = await nouveauHub();
    const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
    const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
    const pre = sl => nomDe(sl).split(" ").slice(1).join(" ");
    const sess = () => sessDe(srv, "3 ESSAI");
    let dernier = null; const sid = () => { const x = sidDe(srv, "3 ESSAI"); if(x) dernier = x; return x || dernier; };
    const S = () => { const id = sid(); return id ? srv.store.get("qcm/sessions/" + id) || {} : {}; };
    const etat = () => { const d = S().deroule; return d && typeof d === "object" ? d : {}; };
    const prof = await A.ouvrir("console", "?mode=prof", 1536, 864);
    await lancer(prof, srv, "3 ESSAI", ["YVON Adam"]);
    const pl = S().places || {};
    const T = Object.keys(pl).map(k => ({k, g: pl[k].g, d: pl[k].d})).filter(x => x.g && x.d);
    if(T.length < 2) throw new Error("pas de places : " + JSON.stringify(pl).slice(0, 200));
    const [tA, tB] = T;
    const entrer = async (p, cote, nom) => { const [N, ...P] = nom.split(" "); await taper(p, cote, "code", codeDe(nom)); await taper(p, cote, "prenom", P.join(" ").toLowerCase()); await taper(p, cote, "nom", N.toLowerCase()); await cliquer(p, /Entrer/, cote); await pause(400); };
    const t1 = await A.ouvrir("tablette-1", "?mode=eleve", 1280, 800), t2 = await A.ouvrir("tablette-2", "?mode=eleve", 1280, 800);
    await entrerPaire(t1, nomDe(tA.g), nomDe(tA.d), codeDe, "l'entrée"); await entrerPaire(t2, nomDe(tB.g), nomDe(tB.d), codeDe, "l'entrée");
    for(const [p, a, b] of [[t1, tA.g, tA.d], [t2, tB.g, tB.d]]){ const en = S().entres || {}; if(!en[a] || !en[b]) note(p.__nom + " : entrés " + JSON.stringify(Object.keys(en))); }
    const M = [[t1, "g", tA.g], [t1, "d", tA.d], [t2, "g", tB.g], [t2, "d", tB.d]];
    // le relevé du point 12 : le texte de chaque moitié, à chaque phase
    const rouges = [];
    async function releve(phase){
      const vus = [];
      for(const [p, c, sl] of M){
        const z = await zoneTexte(p, c);
        const sr = await p.evaluate(() => document.querySelectorAll(".stylo-rouge").length).catch(() => 0);
        if(/rouge/i.test(z)) vus.push(pre(sl) + " : « " + (z.match(/[^\n]{0,60}rouge[^\n]{0,60}/i) || [""])[0] + " »");
        if(sr) vus.push(pre(sl) + " : " + sr + " élément(s) .stylo-rouge sur la tablette");
      }
      let f = ""; if(vus.length) f = await capt(vus[0].startsWith(pre(M[2][2])) || vus[0].startsWith(pre(M[3][2])) ? t2 : t1, "12-rouge-" + slug(phase));
      J.v(!vus.length, H2, "point 12, " + phase + " : ni « rouge » ni .stylo-rouge dans les quatre moitiés", (f ? "(" + f + ") " : "") + [...new Set(vus)].join(" | "));
      rouges.push(...vus);
    }
    await releve("l'entrée et « Avant de commencer »");
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence$/, c); }
    await pause(800);
    // Q1 : la moitié de droite de la tablette 2 répond faux (Milan) ; tous les autres justes
    const [, , slF] = M[2];   // l'élève à la réponse fausse : la gauche de la tablette 2
    const JUSTE = [["Rome"], ["Madrid", "Berlin"], ["8"]];
    const choixDe = (qi, sl) => qi === 0 && sl === slF ? ["Milan"] : JUSTE[qi];
    note("tablette 1 : " + pre(tA.g) + " | " + pre(tA.d) + " ; tablette 2 : " + pre(tB.g) + " | " + pre(tB.d) + " ; " + pre(slF) + " répond « Milan » à Q1");

    J.section("Points 11, 12 — Q1 à Q3, chaque phase relevée");
    for(let qi = 0; qi < 3; qi++){
      await cliquer(prof, new RegExp("Lancer Q" + (qi + 1) + "\\b")); await pause(800);
      await cliquer(prof, /Autoriser la réponse/); await pause(1500);
      const fait = new Set(), vuPh = new Set();
      for(let k = 0; k < 90 && !/close/.test(etat().ph || ""); k++){
        const ph = (etat().ph || "?") + (etat().tour ? "-" + etat().tour : "");
        if(!vuPh.has(ph) && qi === 0){ vuPh.add(ph); await releve("Q1, phase " + ph); }
        for(const [p, c, sl] of M){
          const z = await zoneTexte(p, c), cle = qi + ":" + (etat().tour || 1) + ":" + sl;
          const bq = /la même chose que ton clic|avais-tu bien écrit .* sur ta copie/.test(z);
          if(!fait.has(cle) && !bq && (await O.choixOuverts(p, c, EV.questions[qi].choix)).length){ for(const x of choixDe(qi, sl)) await cliquer(p, new RegExp("^" + esc(x) + "$"), c); fait.add(cle); }
          if(bq) await cliquer(p, /Oui, la même chose/, c);
        }
        if(etat().ph === "reponse" && k > 6) await cliquer(prof, /Tour suivant/);
        await pause(400);
      }
      if(!/close/.test(etat().ph || "")){ await cliquer(prof, /Clore la question/); await pause(800); }
      if(qi === 0) await releve("Q1 close");
    }
    await cliquer(prof, /Lancer l'autoévaluation/); await pause(900);
    await releve("l'estimation");
    for(const [p, c] of M) await cliquer(p, /Maîtrise satisfaisante/, c);
    await cliquer(prof, /Lancer la correction/); await pause(900);
    await releve("« Avant la correction »");
    for(const [p, c] of M){ await cocherTout(p, c); await cliquer(p, /^Je commence la correction$/, c); }
    await pause(1200);
    await cliquer(prof, /Commencer la correction/); await pause(1200);
    J.v(etat().ph === "lecture", H1, "la correction commence au clic de Paul (deroule.ph = lecture)", JSON.stringify(etat()));
    const oc = S().ordreCorr; const ordre = (Array.isArray(oc) ? oc : Object.values(oc || {})).map(Number);
    if(!ordre.length) throw new Error("pas d'ordre de correction : " + JSON.stringify(etat()));

    for(let i = 0; i < ordre.length; i++){
      const qi = ordre[i], Q = EV.questions[qi];
      if(i){ await cliquer(prof, /Question suivante/); await pause(900); }
      if(i === 0){
        J.section("Point 11 — Q" + (qi + 1) + " : trois lecteurs cliquent, " + pre(M[2][2]) + " (lecteur de la feuille de " + pre(M[3][2]) + ") ne clique rien ; le chrono va à 0");
        await releve("la lecture de Q" + (qi + 1) + ", avant 0");
        // la moitié M[k] est celle du propriétaire de la feuille ; son voisin y clique
        for(const [p, c, sl] of M.slice(0, 3)) for(const x of choixDe(qi, sl)) await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 120});
        const [pX, cX, slX] = M[3];   // la feuille de slX, lue par son voisin, qui ne clique pas
        const lecteurX = M[2][2];
        const e0 = etat(); const fin = (e0.depuis || Date.now()) + (e0.duree || 20) * 1000;
        note("chrono de lecture : " + JSON.stringify({ph: e0.ph, qi: e0.qi, duree: e0.duree}) + ", 0 dans " + Math.round((fin - Date.now()) / 1000) + " s");
        while(Date.now() < fin + 1800 && etat().ph === "lecture") await pause(300);
        await pause(500);
        J.v(etat().ph === "lecture" && etat().qi === qi, H2, "à 0, la question reste en lecture (Paul révèle)", JSON.stringify(etat()));
        const fA = await capt(t1, "11-a0-tablette1"), fB = await capt(t2, "11-a0-tablette2"), fC = await capt(prof, "11-a0-console");
        // celui qui a cliqué : figé
        const [pA, cA, slA] = M[0], zA = await zoneTexte(pA, cA), ouvA = await O.choixOuverts(pA, cA, Q.choix);
        J.v(/⏱️ Temps fini : ta lecture est enregistrée/.test(zA), H2, "à 0, la moitié de " + pre(slA) + " (lue par " + pre(M[1][2]) + ", qui a cliqué) : « ⏱️ Temps fini : ta lecture est enregistrée »", "(" + fA + ") " + zA.slice(0, 260));
        J.v(ouvA.length === 0, H2, "à 0, les choix de cette lecture sont fermés", "(" + fA + ") ouverts : " + JSON.stringify(ouvA) + " · « " + ((zA.match(/[^\n]*(tu peux encore la changer|Temps fini)[^\n]*/) || [""])[0]) + " »");
        const avant = JSON.stringify((S().lectures || {})[qi] && S().lectures[qi][slA]);
        const autre = Q.choix.find(x => !choixDe(qi, slA).includes(x));
        await cliquer(pA, new RegExp("^" + esc(autre) + "$"), cA, {apres: 600});
        const apres = JSON.stringify((S().lectures || {})[qi] && S().lectures[qi][slA]);
        if(apres !== avant){ await cliquer(pA, new RegExp("^" + esc(autre) + "$"), cA, {apres: 400}); note("le clic d'essai sur « " + autre + " » a changé la lecture : le banc la remet (" + JSON.stringify((S().lectures || {})[qi] && S().lectures[qi][slA]) + ")"); }
        J.v(avant === apres && avant !== undefined, H12, "à 0, un clic sur « " + autre + " » ne change pas la lecture enregistrée (lectures/" + qi + "/" + slA + ")", "avant : " + avant + " · après : " + apres);
        // celui qui n'a rien cliqué : garde la main
        const zX = await zoneTexte(pX, cX), ouvX = await O.choixOuverts(pX, cX, Q.choix);
        J.v(ouvX.length > 0 && !/Temps fini/.test(zX), H2, "à 0, la moitié de " + pre(slX) + " (son lecteur " + pre(lecteurX) + " n'a rien cliqué) garde la main : ses choix ouverts", "(" + fB + ") ouverts : " + JSON.stringify(ouvX) + " · " + zX.slice(0, 200));
        // son nom en rouge sur la console (le lecteur ; à défaut, la feuille pas lue)
        const coul = await prof.evaluate(noms => { const out = [];
          const rouge = e => { const c = getComputedStyle(e).color.match(/\d+/g).map(Number); return c[0] > 150 && c[1] < 110 && c[2] < 110; };
          const cls = e => { let x = e; for(let k = 0; k < 4 && x; k++){ if(/rouge|alerte|retard|pasdit|manque|danger|err/.test(String(x.className))) return String(x.className); x = x.parentElement; } return ""; };
          for(const nm of noms){ const els = [...document.querySelectorAll("body *")].filter(e => e.getBoundingClientRect().width > 0 && [...e.childNodes].some(t => t.nodeType === 3 && t.textContent.includes(nm)));
            for(const e of els) out.push({nm, t: e.textContent.replace(/\s+/g, " ").slice(0, 80), couleur: getComputedStyle(e).color, rouge: rouge(e), cls: cls(e)}); }
          return out; }, [nomDe(lecteurX), pre(lecteurX), nomDe(slX), pre(slX)]).catch(() => []);
        const rL = coul.filter(x => (x.nm === nomDe(lecteurX) || x.nm === pre(lecteurX)) && (x.rouge || x.cls)), rF = coul.filter(x => (x.nm === nomDe(slX) || x.nm === pre(slX)) && (x.rouge || x.cls));
        // contrôle de la conscience de 11:50 : le nom en rouge est celui du lecteur qui n'a rien cliqué, et « Il en manque 1 : <lecteur> »
        const tC = await texte(prof), manque = (tC.match(/Il en manque\s*\d+\s*:\s*[^\n«»]*/) || [""])[0];
        J.v(rL.length > 0, H2, "à 0, sur la console, le nom de " + pre(lecteurX) + " (le lecteur qui n'a rien cliqué) est en rouge (style calculé, ou une classe d'alerte)", "(" + fC + ") " + JSON.stringify(coul.slice(0, 4)));
        J.v(new RegExp("Il en manque\\s*1\\s*:\\s*" + esc(nomDe(lecteurX))).test(tC), H2, "sous « 💡 Révéler » : « Il en manque 1 : " + nomDe(lecteurX) + " » (le lecteur, pas " + nomDe(slX) + ", dont la feuille n'est pas lue)", manque || tC.slice(0, 200));
        // puis il clique : sa lecture est dans la base
        for(const x of choixDe(qi, slX)) await cliquer(pX, new RegExp("^" + esc(x) + "$"), cX, {apres: 300});
        await pause(800);
        const lX = (S().lectures || {})[qi] && S().lectures[qi][slX];
        J.v(!!lX && lX.par === lecteurX, H12, "après le 0, " + pre(lecteurX) + " clique « " + choixDe(qi, slX).join(" » et « ") + " » : sa lecture est dans la base (lectures/" + qi + "/" + slX + ", par " + lecteurX + ")", JSON.stringify(lX));
        const zX2 = await zoneTexte(pX, cX); const fX2 = await capt(t2, "11-apres-clic");
        J.v(/⏱️ Temps fini : ta lecture est enregistrée/.test(zX2) || (await O.choixOuverts(pX, cX, Q.choix)).length === 0, H2, "après son clic (le temps fini), sa lecture se fige à son tour", "(" + fX2 + ") " + zX2.slice(0, 200));
        await releve("la lecture de Q" + (qi + 1) + ", après 0");
      } else {
        for(const [p, c, sl] of M) for(const x of choixDe(qi, sl)) await cliquer(p, new RegExp("^" + esc(x) + "$"), c, {apres: 120});
        await pause(900);
      }
      const rv = await cliquer(prof, /Révéler/); await pause(1200);
      if(!rv || etat().ph !== "revele") note("Q" + (qi + 1) + " : « 💡 Révéler » " + (rv ? "cliqué" : "introuvable") + ", deroule " + JSON.stringify(etat()));
      if(qi === 0){
        J.section("Point 12 — après « 💡 Révéler » : la consigne de correction");
        const zF = await zoneTexte(t2, "g"), fF = await capt(t2, "12-revele-faux");
        J.v(zF.includes("Barre ta réponse et écris la bonne réponse en entier en vert à côté."), H2, pre(slF) + " (réponse fausse, Milan) lit « Barre ta réponse et écris la bonne réponse en entier en vert à côté. »", "(" + fF + ") « " + ((zF.match(/[^\n]*Barre ta réponse[^\n]*/) || [zF.slice(0, 200)])[0]) + " »");
        const zJ = await zoneTexte(t1, "g"), fJ = await capt(t1, "12-revele-juste");
        J.v(zJ.includes("Sur ta feuille, mets simplement un V vert dans la marge à côté de ta réponse."), H2, pre(M[0][2]) + " (réponse juste) lit toujours « Sur ta feuille, mets simplement un V vert dans la marge à côté de ta réponse. »", "(" + fJ + ") " + zJ.slice(0, 250));
        const sr = await t2.evaluate(() => [...document.querySelectorAll(".stylo-rouge")].map(e => e.textContent)).catch(() => []);
        J.v(sr.length === 0, H2, "la tablette de " + pre(slF) + " n'a aucun élément .stylo-rouge", JSON.stringify(sr));
        await releve("Q" + (qi + 1) + " révélée");
      }
    }
    J.section("Point 12 — la co-évaluation et le bilan");
    await cliquer(prof, /Ouvrir la co-évaluation/); await pause(1200);
    await releve("la co-évaluation");
    for(const [p, c] of M) await cliquer(p, /^✅ Je pense que .* a bien lu ma feuille/, c);
    await pause(900);
    await cliquer(prof, /Afficher leur bilan aux élèves/); await pause(1500);
    await releve("le bilan");
    J.v(!rouges.length, H2, "point 12 : à aucun moment de la séance, « rouge » ou .stylo-rouge chez l'élève", [...new Set(rouges)].slice(0, 4).join(" | "));
    note("variante papier (LignesAttest2Papier, EcrRevele papier) : non atteinte par ce banc (séance en tablettes)");
    for(const p of A.pages) if(p.__err.length) note(p.__nom + " : " + p.__err.slice(0, 3).join(" | "));
    await A.fermer();
  } catch(e){ J.v(false, BANC, "points 11, 12 : le jeu s'est interrompu : " + e.message); }
  // ════════════════ C — point 13 complété (09:25) : l'entrée unique, le binôme, l'absent, la fin ════════════════
  if(veut("C")) try {
    J.section("Point 13 (09:25) — la séance de 3 ESSAI, deux absents à l'appel ; une session d'une autre classe possible (3 BANC)");
    let C2 = null;
    const {B, srv, A} = await nouveauHub(B => { C2 = O.ajouterClasse(B, "3 BANC", "3e", ["ALBERT Noé", "BRUN Lina", "COSTE Maël", "DIAZ Inès"], 4101); });
    const codeDe = nm => B.eleves.find(e => e.nomComplet === nm).code;
    const nomDe = sl => (B.eleves.find(e => slug(e.nomComplet) === sl) || {}).nomComplet;
    const pre = sl => (nomDe(sl) || sl).split(" ").slice(1).join(" ");
    const S = () => sessDe(srv, "3 ESSAI").s;
    const prof = await A.ouvrir("console-c", "?mode=prof", 1536, 864);
    // l'appel : la grille d'avant l'appel ; un absent X dans une paire (son binôme Y restera seul), et les élèves seuls de la grille (sans quoi Y irait avec eux)
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(300);
    await choisir(prof, /^\s*(3 ESSAI|3e Essai)/); await pause(200); await choisir(prof, /Évaluation d'essai/); await pause(400);
    await cliquer(prof, /Lancer la séance/); await pause(800);
    const pl0 = S().places || {}; const P0 = Object.keys(pl0).sort((a, b) => a - b).map(k => ({n: k, g: pl0[k].g, d: pl0[k].d}));
    const paires = P0.filter(x => x.g && x.d), seuls0 = P0.filter(x => !(x.g && x.d)).map(x => x.g || x.d);
    if(paires.length < 5) throw new Error("grille d'avant l'appel : " + JSON.stringify(pl0).slice(0, 200));
    const pX = paires[paires.length - 1], X = pX.d, Y = pX.g;
    const absents = [X].concat(seuls0);
    for(const a of absents) await cliquer(prof, new RegExp(esc(nomDe(a))));
    await cliquer(prof, /Lancer la séance/); await pause(1300);
    const sid = sidDe(srv, "3 ESSAI");
    J.v(!!sid && JSON.stringify(S().absents || []).includes(X), H12, "la séance lancée par le geste, " + nomDe(X) + (seuls0.length ? " et " + seuls0.map(nomDe).join(", ") : "") + " absents à l'appel", JSON.stringify({sid, absents: S().absents}));
    if(!sid) throw new Error("pas de séance");
    const pl = S().places || {}, Pl = Object.keys(pl).map(k => ({n: k, g: pl[k].g || null, d: pl[k].d || null}));
    const placeDe = x => Pl.find(t => t.g === x || t.d === x), coteDe = x => { const t = placeDe(x); return t ? (t.g === x ? "g" : "d") : null; };
    const pY = placeDe(Y);
    J.v(!!pY && !(pY.g && pY.d), H1, "à l'appel fini, " + pre(Y) + " (binôme de " + pre(X) + ", absent) est seul sur sa tablette", JSON.stringify(pY));
    const [p1, p2, p3] = paires.filter(x => x !== pX).slice(0, 3).map(x => placeDe(x.g)).filter(Boolean);
    note("tablette prof : " + pre(p1.g) + " | " + pre(p1.d) + " ; session d'un élève de 3 BANC : " + pre(p2.g) + " | " + pre(p2.d) + " ; session d'un autre élève : " + pre(p3.g) + " | " + pre(p3.d) + " ; " + pre(Y) + " seul (" + pre(X) + " absent)");
    const voitEntree = t => /Identifie-toi/.test(t) && !/Tu es bien/.test(t);
    const binomeVu = async (p, cote, x) => { for(let k = 0; k < 12; k++){ const z = await zoneTexte(p, cote); if(/tape ton code/.test(z)) return z; await pause(250); } return await zoneTexte(p, cote); };
    // le premier élève d'une tablette : il s'identifie ; puis l'autre moitié est celle de son binôme : « Ton binôme : … », « …, tape ton code à 4 chiffres : »
    async function suitePaire(p, t, quoi){
      const autre = coteDe(t.g) === "g" ? "d" : "g", x = autre === "d" ? t.d : t.g;
      const z = await binomeVu(p, autre, x); await garde(p, quoi); const f = await capt(p, "13c-binome-" + slug(pre(x)));
      J.v(new RegExp("Ton binôme : " + esc(nomDe(x))).test(z) && new RegExp(esc(pre(x)) + ", tape ton code à 4 chiffres :").test(z), H2, quoi + " : l'autre moitié est celle de " + pre(x) + " : « Ton binôme : " + nomDe(x) + " », « " + pre(x) + ", tape ton code à 4 chiffres : »", "(" + f + ") " + z.slice(0, 200));
      await codeBinome(p, autre, codeDe(nomDe(x))); await garde(p, quoi);
      const en = S().entres || {}; const tt = await texte(p); const f2 = await capt(p, "13c-paire-" + slug(pre(t.g)));
      p.__entres = Object.assign({}, p.__entres, en[t.g] ? {[t.g]: 1} : {}, en[t.d] ? {[t.d]: 1} : {});
      J.v(!!en[t.g] && !!en[t.d], H12, quoi + " : " + pre(x) + " tape seulement son code ; les deux sont entrés (entres/" + t.g + ", entres/" + t.d + ")", "(" + f2 + ") entres : " + JSON.stringify(Object.keys(en)) + " · " + tt.slice(0, 160));
      J.v(new RegExp("Avant de commencer, " + esc(pre(t.g))).test(tt) && new RegExp("Avant de commencer, " + esc(pre(t.d))).test(tt), H2, quoi + " : chaque moitié montre « Avant de commencer » de son élève", "(" + f2 + ") " + tt.slice(0, 220));
    }

    J.section("Point 13 (09:25) — une session MJPC de professeur (« Voir comme un élève ») : « 👋 Identifie-toi », le code");
    const tP = await A.ouvrir("tablette-prof", "?mode=eleve", 1280, 800); await sessionProf(tP);
    let t = await garde(tP, "l'ouverture (session de professeur)"); let f = await capt(tP, "13c-prof-entree");
    J.v(voitEntree(t), H12, "session de professeur : « 👋 Identifie-toi » (ni « Tu es bien … ? », ni liste de classes)", "(" + f + ") " + t.slice(0, 200));
    if(/Combien êtes-vous/.test(t)){ J.secours("tablette-prof : « Combien êtes-vous ? » → « 👥 2 élèves »"); await cliquer(tP, /2 élèves/); await pause(300); }
    await ident(tP, nomDe(p1.g), codeDe(nomDe(p1.g)), /Combien/.test(t) ? coteDe(p1.g) : null);
    await suitePaire(tP, p1, "tablette du professeur");

    J.section("Point 13 (09:25) — une session MJPC d'une autre heure : « Tu es bien … ? » → « Non », puis le code");
    for(const [nm, pp, autreE, quoi] of [["tablette-autre-classe", p2, Object.assign({}, C2[1], {classe: "3 BANC"}), "session d'un élève de 3 BANC"],
                                           ["tablette-autre-eleve", p3, (() => { const n0 = nomDe(Pl.find(x => x !== p1 && x !== p2 && x !== p3 && x.g && x.d).d); const [N, ...P] = n0.split(" "); return {nomComplet: n0, nom: N, prenom: P.join(" "), classe: "3 ESSAI"}; })(), "session d'un autre élève de 3 ESSAI"]]){
      const p = await A.ouvrir(nm, "?mode=eleve", 1280, 800); await sessionMJPC(p, autreE);
      t = await garde(p, "l'ouverture (" + quoi + ")"); f = await capt(p, "13c-" + slug(nm));
      if(/Combien êtes-vous/.test(t)){ J.secours(nm + " : « Combien êtes-vous ? » → « 👤 1 élève »"); await cliquer(p, /1 élève/); await pause(500); t = await garde(p, "après « 1 élève »"); f = await capt(p, "13c-" + slug(nm) + "-1"); }
      J.v(new RegExp("Tu es bien " + esc(autreE.prenom) + " \\?").test(t), H12, quoi + " (" + autreE.nomComplet + ") : « Tu es bien " + autreE.prenom + " ? »", "(" + f + ") " + t.slice(0, 200));
      await cliquer(p, /^Non$/); await pause(500); t = await garde(p, "après « Non »"); f = await capt(p, "13c-" + slug(nm) + "-non");
      J.v(voitEntree(t), H12, quoi + " : « Non » mène à « 👋 Identifie-toi »", "(" + f + ") " + t.slice(0, 200));
      if(!/Identifie-toi|Combien êtes-vous/.test(t)){ note(quoi + " : pas d'entrée possible sur cette tablette (" + f + ") : la suite (" + pre(pp.g) + " par son code, son binôme) n'est pas jouée"); continue; }
      await ident(p, nomDe(pp.g), codeDe(nomDe(pp.g)), null);
      if(!(S().entres || {})[pp.g]) await ident(p, nomDe(pp.g), codeDe(nomDe(pp.g)), "g");
      await suitePaire(p, pp, quoi + ", puis " + pre(pp.g) + " par son code");
    }

    J.section("Point 13 (09:25) — un binôme absent : l'élève seul, sans question ; puis marqué présent par Paul");
    const tY = await A.ouvrir("tablette-seul", "?mode=eleve", 1280, 800);
    t = await garde(tY, "l'ouverture"); if(/Combien êtes-vous/.test(t)){ J.secours("tablette-seul : « Combien êtes-vous ? » → « 👤 1 élève »"); await cliquer(tY, /1 élève/); await pause(400); }
    await ident(tY, nomDe(Y), codeDe(nomDe(Y)), null); if(!(S().entres || {})[Y]) await ident(tY, nomDe(Y), codeDe(nomDe(Y)), "g");
    await pause(600); t = await garde(tY, "après l'entrée de " + pre(Y)); f = await capt(tY, "13c-seul");
    J.v(!!(S().entres || {})[Y], H12, pre(Y) + " entre par son code", JSON.stringify(Object.keys(S().entres || {})));
    J.v(new RegExp("Avant de commencer, " + esc(pre(Y))).test(t) && !/Ton binôme|tape ton code|Identifie-toi|Tu es bien/.test(t), H2, pre(Y) + ", binôme absent : seul sur la tablette, sans question (ni « Ton binôme », ni une autre entrée)", "(" + f + ") " + t.slice(0, 220));
    // Paul marque X présent : ce que propose la console
    let fait = "";
    if(await cliquer(prof, /Retour d'un élève/)){ await pause(500);
      // « ↩️ Revenu » sur la ligne de l'élève (QCM-2, 6d7c287 : la fenêtre liste aussi les absents de l'appel)
      const rev = await prof.evaluate(nm => { const b = [...document.querySelectorAll("button")].filter(x => /Revenu/.test(x.textContent) && x.getBoundingClientRect().width > 0);
        const ligne = y => { let a = y; while(a.parentElement && [...a.parentElement.querySelectorAll("button")].filter(z => /Revenu/.test(z.textContent)).length === 1) a = a.parentElement; return a; };
        const x = b.find(y => ligne(y).textContent.includes(nm)) || null; if(!x) return false; x.setAttribute("data-banc", "revenu"); return true; }, nomDe(X));
      if(rev){ await prof.click("[data-banc='revenu']").catch(() => {}); await pause(700); fait = "« ↩️ Retour d'un élève », « ↩️ Revenu » pour " + nomDe(X); }
      else if(await cliquer(prof, new RegExp(esc(nomDe(X)) + "|^" + esc(pre(X))))){ await pause(400); await cliquer(prof, /^(Confirmer|Oui|↩️ .*revient|Revenir|Valider)/); fait = "« ↩️ Retour d'un élève », " + nomDe(X); }
      else { const fr = await capt(prof, "13c-retour-fenetre"); note("« ↩️ Retour d'un élève » ne propose pas " + nomDe(X) + " (" + fr + ")"); await prof.keyboard.press("Escape").catch(() => {}); await cliquer(prof, /^(Fermer|Annuler|✕)/); } }
    const libre = async () => (await cliquer(prof, /^moitié libre$/)) || (await prof.getByText("moitié libre", {exact: true}).first().click({timeout: 1500}).then(() => true).catch(() => false));
    if(!fait && await libre()){ await pause(500);
      if(await cliquer(prof, new RegExp(esc(nomDe(X)) + "|^" + esc(pre(X))))){ await pause(400); await cliquer(prof, /^(Confirmer|Oui|Valider|Placer)/); fait = "« moitié libre », puis " + nomDe(X); }
      else { await prof.keyboard.press("Escape").catch(() => {}); } }
    if(!fait){
      if(await cliquer(prof, new RegExp("^" + esc(nomDe(X)) + "$|^" + esc(pre(X)) + "$"))){ await pause(500);
        if(await cliquer(prof, /présent|arrivé|Retour|revient/i)){ await pause(400); await cliquer(prof, /^(Confirmer|Oui|Valider)/); fait = "le nom de " + nomDe(X) + " puis « présent »"; } }
    }
    await pause(1200);
    const fc = await capt(prof, "13c-present");
    const absApres = JSON.stringify(S().absents || []);
    J.v(!!fait && !absApres.includes(X), H12, "Paul marque " + nomDe(X) + " présent par un geste de la console (« ↩️ Retour d'un élève » ou ce qu'elle propose)", "(" + fc + ") geste : " + (fait || "aucun trouvé (ni dans « ↩️ Retour d'un élève », ni au clic sur son nom)") + " · absents : " + absApres);
    if(!absApres.includes(X)){
      const cX = coteDe(Y) === "g" ? "d" : "g"; const z = await binomeVu(tY, cX, X); await garde(tY, "après le retour de " + pre(X)); f = await capt(tY, "13c-present-tablette");
      J.v(/tape ton code/.test(z) && z.includes(nomDe(X)), H2, "l'autre moitié de la tablette de " + pre(Y) + " s'ouvre pour " + pre(X) + " (« Ton binôme : " + nomDe(X) + " », « " + pre(X) + ", tape ton code à 4 chiffres : »)", "(" + f + ") " + z.slice(0, 200));
      await codeBinome(tY, cX, codeDe(nomDe(X)));
      J.v(!!(S().entres || {})[X], H12, pre(X) + " tape son code : il est entré, à côté de " + pre(Y), JSON.stringify(Object.keys(S().entres || {})));
    }

    J.section("Point 13 (09:25) — « 🛑 Terminer » : chaque tablette oublie ses élèves et revient à l'entrée");
    await cliquer(prof, /Terminer la séance/); await pause(400); await cliquer(prof, /^🛑 Terminer la séance$|Terminer la séance/); await pause(2200);
    J.v(!sidDe(srv, "3 ESSAI"), H1, "la séance est terminée (sessionActive/3 ESSAI vide)", JSON.stringify(srv.store.get("qcm/sessionActive")));
    const tabs = A.pages.filter(p => /tablette/.test(p.__nom));
    // seules les tablettes où un élève est entré dans la séance (celle restée sur la session de 3 BANC n'y est jamais entrée)
    const dansSeance = [];
    for(const p of tabs){ if(Object.values(p.__entres || {}).length || p === tP || p === tY) dansSeance.push(p); }
    for(const p of tabs.filter(p => !dansSeance.includes(p))) note(p.__nom + " : aucun élève entré dans la séance ; pas de vérification après « Terminer »");
    for(const p of dansSeance){
      t = await garde(p, "après « Terminer »"); f = await capt(p, "13c-fin-" + slug(p.__nom));
      let ici = null; try { ici = await p.evaluate(() => typeof ELV !== "undefined" ? ELV.ici() : null); } catch(e){}
      J.v(/Identifie-toi|Tu es bien/.test(t) && !/Avant de commencer|Ton binôme/.test(t), H12, p.__nom + " : après « Terminer », l'entrée (« 👋 Identifie-toi », ou « Tu es bien … ? » s'il y a une session)", "(" + f + ") " + t.slice(0, 200));
      J.v(!!ici && !ici.g && !ici.d, H1, p.__nom + " : la tablette a oublié ses élèves (ELV.ici())", JSON.stringify(ici));
    }
    J.section("Point 13 (09:25) — « Combien êtes-vous » et « Choisis ta classe » à aucune étape");
    for(const p of tabs) verifGarde(p, p.__nom);
    for(const p of A.pages) if(p.__err.length) note(p.__nom + " : " + p.__err.slice(0, 3).join(" | "));
    await A.fermer();
  } catch(e){ J.v(false, BANC, "point 13 (09:25) : le jeu s'est interrompu : " + e.message); }
  ecrire(); process.exit(0);
})();
