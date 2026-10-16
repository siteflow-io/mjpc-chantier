// QCM-4 · BANC — « Le mode test joue les vraies évaluations — 16/10/2026 » (DEFAUTS-OUVERTS, point 4), par le geste, sur le faux hub.
// Trois évaluations ordinaires, prêtes à lancer, pas la démo :
//   E1 « Évaluation d'essai » (3e, 3 questions, celle du faux hub) ;
//   E2 une évaluation de 4e (4 questions), E3 une évaluation de 3e de 11 questions : écrites dans CE faux hub seulement, d'après deux évaluations
//      de Paul déjà au faux hub (« 4e- Chapitre 1 - Paris à la barre… », « 3e- éval 1 Analyse logique… »), complétées de ce qui leur manquait
//      pour être prêtes (chapitre, temps, compétences, « ce qu'elle vérifie ») ; aucune donnée d'élève.
// Pour chacune : la carte de la console (Pilotage classe, 3 ESSAI : ses menus) relevée ; « 🧪 Mode test » ; la démo choisie par défaut au menu
// « Évaluation » ; le menu (la démo en premier, puis les évaluations prêtes, comme la console) ; le choix de l'évaluation ; la carte de la durée
// suit ; la copie evaluations/_test_evaluation-qcm réécrite d'après elle (test:true) ; « 🚀 Lancer la séance », l'appel, la séance entière
// jusqu'au bilan avec les tablettes simulées (« 🎲 », « ⏱️ Faire expirer le chrono »), chacun des huit « 🎬 Préparer un cas » à son moment ;
// « 🛑 Terminer » ; « ✏️ Modifier l'éval après coup » puis « ⚖️ Vérifier que les notes n'ont pas bougé » ; « 🗑️ Sortir et purger ».
// Puis : evaluations/<la vraie> identique bit à bit à avant l'entrée, et aucune écriture sur elle de toute la séance (journal du faux hub) ;
// ni « passée par » ni résultat ; la carte de la console inchangée ; à l'entrée suivante, la démo est choisie par défaut.
//   APP_FILE=<app> node banc/banc-modetest-16-10.js <dossier de sortie>   → modetest.txt, captures-modetest/
const path = require("path"), fs = require("fs"), cp = require("child_process");
const O = require("./outils");
const { pause, esc, texte, cliquer, choisir, photo } = O;
const SORTIE = path.resolve(process.argv[2] || path.join(__dirname, "..", "sorties", "modetest-" + Date.now()));
const CAP = path.join(SORTIE, "captures-modetest"); fs.mkdirSync(CAP, {recursive: true});
const J = new O.Journal();
const H1 = "QCM-1 · SOCLE", H2 = "QCM-2 · HEURE", H3 = "QCM-3 · SOIR", BANC = "QCM-4 · BANC";
const CL = "_test_evaluation-qcm", TE = "_test_evaluation-qcm";
const t0 = Date.now();
let n = 0; const capt = async (p, id) => { const f = String(++n).padStart(2, "0") + "-" + id + ".png"; await photo(p, path.join(CAP, f)); return "captures-modetest/" + f; };
const note = s => { J.l.push({note: s}); console.log("  note   " + s); };
const canon = v => JSON.stringify(v, (k, x) => x && typeof x === "object" && !Array.isArray(x) ? Object.keys(x).sort().reduce((o, k2) => (o[k2] = x[k2], o), {}) : x);
const SRC = require(path.join(O.RACINE, "AUDITS", "QCM-MODE-TEST-09-10", "banc", "evals_now.json"));
// compléter une évaluation de Paul pour qu'elle soit prête à lancer (ce que manquesV demande), sans toucher à ses énoncés, choix, bonnes réponses
const complete = (src, nq, chapitre, quoi) => ({titre: src.titre, chapitre, mode: "strict", createdAt: src.createdAt, updatedAt: src.updatedAt,
  questions: src.questions.slice(0, nq).map((q, i) => Object.assign({}, q, {niveau: q.niveau || "standard", reflexion: 20, reponse: 15, competences: ["c4-lire-01"],
    verifie: quoi + ", question " + (i + 1), bonus: false, longueurAssumee: false}))});
const E2 = complete(SRC["eval_1791380799497"], 4, "4e-ch1", "le vocabulaire du chapitre 1 de 4e");
const E3 = complete(SRC["eval_1791393134857"], 11, "3e-ch1", "l'analyse logique");
const EVALS = [
  {id: "essai", nom: "E1 (3e, 3 questions)", niveau: "3e"},
  {id: "banc_4e", nom: "E2 (4e, 4 questions)", niveau: "4e"},
  {id: "banc_3e_11", nom: "E3 (3e, 11 questions)", niveau: "3e"}
];
if(process.env.EVALS) EVALS.splice(0, EVALS.length, ...EVALS.filter(E => process.env.EVALS.split(",").includes(E.id)));   // pour un essai : EVALS=essai
const CAS = ["Un faux « Oui »", "Rien de dit à la fin du temps", "Un lecteur qui clique « aucun » partout", "Deux élèves d'accord pour mentir", "Trouvée au dernier moment", "Le cas ambigu", "Une tablette en panne", "Un départ en cours de séance"];

(async () => {
  const fin = setTimeout(() => { J.v(false, BANC, "plafond de 24 minutes atteint"); ecrire(); process.exit(0); }, 24 * 60000);
  const {B, srv, port} = await O.fauxHub(B => { B.tree.qcm.evaluations.banc_4e = E2; B.tree.qcm.evaluations.banc_3e_11 = E3; });
  const A = new O.Appareils(srv, port); await A.demarrer();
  // le journal des écritures : toute écriture qui touche evaluations/<une vraie>
  const touche = {};
  const norme = p => String(p || "").replace(/^\/+|\/+$/g, "");
  srv.watchers.push(op => { const base = norme(op.p); const ch = op.t === "update" ? Object.keys(op.v || {}).map(k => base + "/" + norme(k)) : [base];
    for(const E of EVALS){ const cible = "qcm/evaluations/" + E.id; for(const c of ch) if(c === cible || c.startsWith(cible + "/") || cible.startsWith(c + "/") || c === "") (touche[E.id] = touche[E.id] || []).push(op.t + " " + c); } });
  const EV = id => srv.store.get("qcm/evaluations/" + id);
  const L = l => Array.isArray(l) ? l : l && typeof l === "object" ? Object.keys(l).sort((a, b) => a - b).map(k => l[k]) : [];
  const QS = e => L((e || {}).questions);
  let sid = null;
  const sess = () => { const a = srv.store.get("qcm/sessionActive") || {}; let id = a[CL]; if(id && typeof id === "object") id = id.sessionId || id.id || id.sid; if(id) sid = id; return sid ? srv.store.get("qcm/sessions/" + sid) || {} : {}; };
  const etat = () => { const s = sess(); return s.deroule && typeof s.deroule === "object" ? s.deroule : {}; };
  const de = () => JSON.stringify((({ph, qi, tour, cote}) => ({ph, qi, tour, cote}))(etat()));
  let prof;
  // ── les écrans de la console réelle ──
  const pilotageClasse = async () => { await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(600); };
  const carteConsole = async () => { // la carte de lancement de la vraie console, 3 ESSAI : chaque menu et ses lignes
    await pilotageClasse(); await choisir(prof, /^\s*3e Essai/); await pause(500);
    return prof.evaluate(() => [...document.querySelectorAll("select")].filter(s => s.getBoundingClientRect().width > 0).map(s => [...s.options].map(o => o.value + "=" + o.textContent.trim()).join(" | "))).catch(() => []); };
  const passee = async titre => { await cliquer(prof, /^Pilotage$/); await cliquer(prof, /^📝 Évaluations$|^Évaluations$/); await pause(700);
    return prof.evaluate(t => { const r = [...document.querySelectorAll(".eval-passee")].map(x => { let c = x; while(c.parentElement && c.parentElement.querySelectorAll(".eval-passee").length === 1) c = c.parentElement; return (c.textContent || "").includes(t) ? x.textContent.trim() : null; }).filter(Boolean); return r.join(" · ") || "(ligne absente)"; }, titre).catch(() => "?"); };
  // ── la carte de lancement du mode test ──
  const menuTest = () => prof.evaluate(() => { const z = document.querySelector(".test-console") || document;
    const s = [...z.querySelectorAll(".field")].filter(f => /Évaluation/.test((f.querySelector("label") || {}).textContent || "")).map(f => f.querySelector("select")).filter(Boolean)[0];
    if(!s) return null; return {ro: !!(s.readOnly || s.disabled || s.getAttribute("readonly") != null), sel: (s.options[s.selectedIndex] || {}).textContent, opts: [...s.options].map(o => o.textContent.trim()), title: s.title}; }).catch(() => null);
  const dureeTest = () => prof.evaluate(() => ((document.querySelector(".test-console .duree-box") || {}).textContent || "").trim()).catch(() => "");
  const choisirTest = async titre => { const ok = await prof.evaluate(t => { const z = document.querySelector(".test-console") || document;
      const s = [...z.querySelectorAll(".field")].filter(f => /Évaluation/.test((f.querySelector("label") || {}).textContent || "")).map(f => f.querySelector("select")).filter(Boolean)[0];
      if(!s) return false; const o = [...s.options].find(x => x.textContent.trim().startsWith(t)); if(!o) return false; s.setAttribute("data-banc", "menu"); return o.value; }, titre).catch(() => false);
    if(!ok) return false; await prof.selectOption("[data-banc='menu']", ok).catch(() => {}); await pause(1200); return true; };
  const msgTest = () => prof.evaluate(() => [...document.querySelectorAll(".test-msg")].map(x => x.textContent.replace(/[\u00a0\u202f]/g, " ").trim()).join(" ‖ ")).catch(() => "");
  const cas = async (nom, lib) => { const m0 = await msgTest(); const ok = await cliquer(prof, new RegExp("^🎬 " + esc(nom) + "$")); await pause(1000);
    const m = await msgTest(); const c = await capt(prof, "cas-" + nom.replace(/\W+/g, "").slice(0, 20));
    J.v(ok && m.includes("🎬 Cas préparé : « " + nom + " »"), H3, lib + " : « 🎬 " + nom + " » se prépare à son moment (" + de() + ")", (ok ? "message : « " + m.slice(0, 200) + " »" : "bouton absent") + " ; " + c); };
  const enMode = async () => { await pilotageClasse(); const deja = /MODE TEST/.test(await texte(prof)); if(!deja) await cliquer(prof, /🧪 Mode test/); await pause(2500);
    for(let k = 0; k < 30 && !(await menuTest()); k++) await pause(300); };

  // ── une séance de test, de l'appel au bilan ──
  const seance = async (E, nom) => {
    J.section(nom + " : « 🚀 Lancer la séance », l'appel, la séance entière avec les tablettes simulées et les huit cas");
    sid = null;
    J.v(await cliquer(prof, /^🚀 Lancer la séance$/, ".test-console"), H3, nom + " : « 🚀 Lancer la séance » de la carte du mode test"); await pause(1500);
    J.v(await cliquer(prof, /^🚀 Lancer la séance$/), H3, nom + " : « 🚀 Lancer la séance » de l'appel"); await pause(2000);
    const s0 = sess();
    J.v(!!sid && s0.evalId === TE, H1, nom + " : la séance de test joue la copie (evalId = " + TE + ")", JSON.stringify({sid, evalId: s0.evalId, classe: s0.classeSlug}));
    const snap = s0.evalSnapshot || {};
    const qs = QS(snap).map(q => q.enonce), qE = QS(EV(E.id)).map(q => q.enonce);
    J.v(qs.length === qE.length && qs.every((x, i) => x === qE[i]), H1, nom + " : l'énoncé de la séance (evalSnapshot) est celui de l'évaluation choisie, " + qE.length + " questions", qs.length + " questions : « " + (qs[0] || "") + " »");
    if(!sid) throw new Error("la séance de test n'est pas lancée");
    const fait = new Set(), casFaits = new Set(); let vuBilan = false, garde = 0, derniere = "", nLect = 0;
    const nq = QS(snap).length || qE.length;   // la séance joue son énoncé
    const des = async () => { await cliquer(prof, /🎲 Tous les élèves répondent/); await pause(800); };
    const expire = async () => { await cliquer(prof, /⏱️ Faire expirer le chrono/); await pause(500); };
    while(Date.now() - t0 < 23 * 60000 && garde++ < 900){
      const e = etat(), ph = e.ph, cle = ph + ":" + e.qi + ":" + e.tour;
      if(cle !== derniere){ derniere = cle; console.log("   " + Math.round((Date.now() - t0) / 1000) + " s  " + de()); }
      if(ph === "entree" || ph === "pret"){ if(!fait.has("entree")){ fait.add("entree"); await des(); } await cliquer(prof, /▶️ Lancer Q1\b/, ".test-console"); await pause(800); }
      else if(ph === "reflexion"){ if(!fait.has(cle)){ fait.add(cle); if(e.qi === 0){ const c = await capt(prof, E.id + "-q1-reflexion"); const t = await texte(prof);
            J.v(t.includes(qE[0]), H2, nom + " : à la console, Q1 est l'énoncé de l'évaluation choisie (« " + qE[0].slice(0, 60) + " »)", t.slice(0, 200) + " ; " + c); } }
        await cliquer(prof, /Autoriser la réponse/, ".test-console"); await pause(600); }
      else if(ph === "reponse"){
        if(!fait.has(cle)){ fait.add(cle);
          if(e.qi === 0 && e.tour === 1 && !casFaits.has(0)){ casFaits.add(0); await cas(CAS[0], nom);
            const c = await capt(prof, E.id + "-q1-tour1"); const zs = await prof.evaluate(() => ((document.querySelector(".sims [data-sim-tab='1'] .sim") || {}).innerText || "")).catch(() => "");
            J.v(zs.includes(qE[0]) || /pose ton stylo|laisse la tablette|Attends/.test(zs), H3, nom + " : la tablette simulée 1, au 1er tour de Q1, montre l'énoncé de l'évaluation choisie", zs.replace(/\s+/g, " ").slice(0, 200) + " ; " + c); }
          await des(); await pause(500); }
        if(etat().ph === "reponse") await expire(); else await pause(300); }
      else if(ph === "b"){ if(!casFaits.has(1)){ casFaits.add(1); await cas(CAS[1], nom); } await pause(300); if(etat().ph === "b" && garde % 6 === 0) await expire(); }
      else if(ph === "passage") await pause(300);
      else if(ph === "close"){ if(e.qi + 1 < nq){ if(!(await cliquer(prof, new RegExp("Lancer Q" + (e.qi + 2) + "\\b"), ".test-console"))) await pause(400); await pause(500); }
        else { await cliquer(prof, /Lancer l'autoévaluation/, ".test-console"); await pause(800); } }
      else if(ph === "estim"){ if(!fait.has("estim")){ fait.add("estim"); await des(); } await cliquer(prof, /Lancer la correction/, ".test-console"); await pause(800); }
      else if(ph === "att2"){ if(!fait.has("att2")){ fait.add("att2"); await des(); } await cliquer(prof, /Commencer la correction/, ".test-console"); await pause(800); }
      else if(ph === "lecture"){
        if(!fait.has(cle)){ fait.add(cle); const k = 2 + nLect++; if(k <= 4 && !casFaits.has(k)){ casFaits.add(k); await cas(CAS[k], nom); } await des(); }
        if(!(await cliquer(prof, /Révéler/, ".test-console"))){ await expire(); } await pause(600); }
      else if(ph === "revele"){ if(!(await cliquer(prof, /Question suivante/, ".test-console"))){ if(!(await cliquer(prof, /Ouvrir la co-évaluation/, ".test-console"))) await pause(400); } await pause(800); }
      else if(ph === "coeval"){ if(!fait.has("coeval")){ fait.add("coeval"); if(!casFaits.has(5)){ casFaits.add(5); await cas(CAS[5], nom); } await des(); }
        // les alertes des cas (le cas ambigu, le lecteur « aucun », les menteurs) : Paul les garde pour ce soir (« 📌 Je relis ce soir… »), sans changer de note
        for(let k = 0; k < 8 && await cliquer(prof, /📌 Je relis ce soir la question/, ".test-console"); k++) await pause(700);
        if(!(await cliquer(prof, /Afficher leur bilan aux élèves/, ".test-console"))){ if(garde % 10 === 0) await des(); } await pause(1000); }
      else if(ph === "bilan"){ vuBilan = true; await pause(800); for(const k of [6, 7]) if(!casFaits.has(k)){ casFaits.add(k); await cas(CAS[k], nom); } await capt(prof, E.id + "-bilan"); break; }
      else await pause(400);
    }
    J.v(vuBilan, H3, nom + " : la séance arrive au bilan", de());
    const manq = CAS.filter((x, k) => !casFaits.has(k));
    J.v(!manq.length, BANC, nom + " : les huit « 🎬 Préparer un cas » ont eu leur moment", "pas joués : " + manq.join(", "));
    // « 🛑 Terminer »
    await cliquer(prof, /🛑 Terminer la séance/, ".test-console"); await pause(600); await cliquer(prof, /^🛑 Terminer/); await pause(1500);
    const sf = srv.store.get("qcm/sessions/" + sid) || {};
    note(nom + " : après « 🛑 Terminer », la séance " + sid + " : " + JSON.stringify({etat: sf.etat, ph: (sf.deroule || {}).ph}));
    return sid;
  };

  try {
    prof = await A.ouvrir("console", "?mode=prof", 1536, 1000);
    J.section("Avant tout : la carte de lancement de la console réelle (3 ESSAI), les évaluations au faux hub");
    const carte0 = await carteConsole(); const cC = await capt(prof, "console-carte-avant");
    note("la carte de la console : " + carte0.join(" ‖ ").slice(0, 600) + " (" + cC + ")");
    for(const E of EVALS) J.v(carte0.some(m => m.includes(E.id + "=")), BANC, "la console propose " + E.nom + " (prête à lancer)", carte0.join(" ‖ ").slice(0, 300));
    const avant = {}, passeeAvant = {};
    for(const E of EVALS){ avant[E.id] = canon(EV(E.id)); passeeAvant[E.id] = await passee(EV(E.id).titre); }
    note("« passée par » avant : " + EVALS.map(E => E.id + " : « " + passeeAvant[E.id] + " »").join(" · "));
    const demo0 = canon(EV("demo"));

    for(let i = 0; i < EVALS.length; i++){
      const E = EVALS[i], nom = E.nom, titre = EV(E.id).titre, nq = QS(EV(E.id)).length;
      J.section(nom + " — « " + titre + " » : l'entrée en mode test, le menu, le choix");
      await enMode();
      const m0 = await menuTest(); const c0 = await capt(prof, E.id + "-carte-test");
      J.v(!!m0 && /démo|Démo/.test(m0.sel || ""), H3, nom + " : à l'entrée en mode test, la démo est choisie par défaut", JSON.stringify(m0) + " ; " + c0);
      J.v(!!m0 && !m0.ro, H3, nom + " : le menu « Évaluation » s'ouvre (plus en lecture seule)", JSON.stringify(m0 && {ro: m0.ro}));
      // la liste : la démo en premier, puis les évaluations prêtes, dans l'ordre de la console
      const pretes = (carte0.find(m => m.includes("essai=")) || "").split(" | ").map(x => x.replace(/^[^=]*=/, "")).filter(x => !/démo/i.test(x));
      const lt = m0 ? m0.opts : [];
      J.v(lt.length >= 1 && /démo/i.test(lt[0]) && pretes.every((x, k) => lt[k + 1] && lt[k + 1].startsWith(x.replace(/\s*\(.*$/, ""))), H3, nom + " : le menu, la démo en premier puis les évaluations prêtes, dans l'ordre de la carte de la console", "menu : " + lt.join(" | ") + " · console : " + pretes.join(" | "));
      J.v(lt.some(x => x.startsWith(titre) && new RegExp("\\(" + nq + " questions?\\)").test(x)), H3, nom + " : la ligne « " + titre + " (" + nq + " questions) »", lt.join(" | "));
      J.v(!!m0 && m0.title !== undefined, BANC, nom + " : l'infobulle du menu est lue", m0 && m0.title);
      const d0 = await dureeTest();
      const okC = await choisirTest(titre); const c1 = await capt(prof, E.id + "-choisie");
      const m1 = await menuTest(), d1 = await dureeTest();
      J.v(okC && m1 && (m1.sel || "").startsWith(titre), H3, nom + " : « " + titre + " » se choisit au menu", JSON.stringify(m1 && m1.sel) + " ; " + c1);
      J.v(d1 && d1 !== d0, H3, nom + " : la carte de la durée suit l'évaluation choisie", "avant « " + d0.slice(0, 120) + " » · après « " + d1.slice(0, 120) + " »");
      // la copie, réécrite d'après elle, avant « 🚀 »
      await pause(800);
      const cp_ = EV(TE) || {}, vraie = EV(E.id);
      const champs = ["enonce", "choix", "bonnes", "niveau", "competences", "verifie", "reflexion", "reponse", "explication"];
      const lq = q => Object.assign({}, q, {choix: L(q.choix), bonnes: L(q.bonnes), competences: L(q.competences)});
      const qd = QS(vraie).map((q, k) => champs.filter(f => canon(lq(q)[f]) !== canon(lq(QS(cp_)[k] || {})[f])).map(f => "Q" + (k + 1) + "." + f)).flat();
      J.v(cp_.titre === vraie.titre && QS(cp_).length === QS(vraie).length && !qd.length, H3, nom + " : la copie (evaluations/" + TE + ") est réécrite d'après elle : titre et questions telles qu'elles sont", "titre « " + cp_.titre + " », " + QS(cp_).length + " questions ; différences : " + qd.slice(0, 8).join(", "));
      J.v(cp_.chapitre === vraie.chapitre && (cp_.mode || null) === (vraie.mode || null) && cp_.test === true, H3, nom + " : la copie a son chapitre, son mode, et test:true", JSON.stringify({chapitre: cp_.chapitre, mode: cp_.mode, test: cp_.test}));
      J.v(canon(vraie) === avant[E.id], H3, nom + " : au choix, la vraie évaluation n'a pas bougé", "");

      const sidE = await seance(E, nom);
      // une séance déjà jouée garde son énoncé si Paul choisit ensuite une autre évaluation (le menu, après « 🛑 Terminer »)
      J.section(nom + " : « ✏️ Modifier l'éval après coup », « ⚖️ Vérifier que les notes n'ont pas bougé »");
      const snap0 = canon((srv.store.get("qcm/sessions/" + sidE) || {}).evalSnapshot);
      const ok1 = await cliquer(prof, /^✏️ Modifier l'éval après coup$/); await pause(1200); const msg1 = await msgTest(); const c3 = await capt(prof, E.id + "-modifier");
      const b0c = canon(L((QS(EV(TE))[0] || {}).bonnes)), b0v = canon(L((QS(EV(E.id))[0] || {}).bonnes));
      J.v(ok1 && /✏️ Évaluation modifiée/.test(msg1), H3, nom + " : « ✏️ Modifier l'éval après coup »", "message « " + msg1.slice(0, 200) + " » ; " + c3);
      J.v(b0c !== b0v, H3, nom + " : la modification porte sur la copie (sa Q1 a une autre bonne réponse)", "copie " + b0c + " · vraie " + b0v);
      J.v(canon(EV(E.id)) === avant[E.id], H3, nom + " : « ✏️ Modifier » ne touche pas la vraie évaluation", "");
      const ok2 = await cliquer(prof, /^⚖️ Vérifier que les notes n'ont pas bougé$/); await pause(1200); const msg2 = await msgTest(); const c4 = await capt(prof, E.id + "-verifier");
      J.v(ok2 && /⚖️ Les \d+ notes sont identiques/.test(msg2), H3, nom + " : « ⚖️ Vérifier que les notes n'ont pas bougé » : les notes sont identiques", "message « " + msg2.slice(0, 200) + " » ; " + c4);
      // choisir ensuite une autre évaluation : la séance jouée garde son énoncé
      const autre = EVALS[(i + 1) % EVALS.length];
      if((await menuTest())){ await choisirTest(EV(autre.id).titre); await pause(1000);
        J.v(canon((srv.store.get("qcm/sessions/" + sidE) || {}).evalSnapshot) === snap0, H1 + ", " + H3, nom + " : la séance jouée garde son énoncé (evalSnapshot) quand Paul choisit ensuite « " + EV(autre.id).titre.slice(0, 40) + " »", "");
      } else note(nom + " : après « 🛑 Terminer », la carte de lancement du mode test n'est pas revenue : le choix d'une autre évaluation n'est pas joué");

      J.section(nom + " : « 🗑️ Sortir et purger », puis la vraie évaluation, « passée par », la console");
      J.v(await cliquer(prof, /🗑️ Sortir et purger/), H3, nom + " : « 🗑️ Sortir et purger »"); await pause(3000);
      const st = srv.store.tree(); const ses = (st.qcm || {}).sessions || {};
      const reste = Object.keys(ses).filter(k => ses[k] && (ses[k].classeSlug === CL || ses[k].evalId === TE || ses[k].evalId === E.id));
      J.v(!reste.length && !(st.classes || {})[CL] && !((st.qcm || {}).evaluations || {})[TE], H3, nom + " : la purge efface la classe de test, la copie, les séances de test", JSON.stringify({seances: reste, classe: !!(st.classes || {})[CL], copie: !!((st.qcm || {}).evaluations || {})[TE]}));
      J.v(canon(EV(E.id)) === avant[E.id], H3, nom + " : evaluations/" + E.id + " identique bit à bit à avant l'entrée en mode test", canon(EV(E.id)).slice(0, 200));
      J.v(!(touche[E.id] || []).length, H3 + ", " + H1, nom + " : aucune écriture sur evaluations/" + E.id + " de toute la séance (journal du faux hub)", (touche[E.id] || []).slice(0, 5).join(" · "));
      const res = Object.keys(ses).filter(k => ses[k] && ses[k].evalId === E.id);
      J.v(!res.length, H3, nom + " : aucun résultat ni séance pour la vraie évaluation", res.join(", "));
      const pa = await passee(titre); const c5 = await capt(prof, E.id + "-evaluations-apres");
      J.v(pa === passeeAvant[E.id], H3, nom + " : « passée par » inchangé (« " + passeeAvant[E.id] + " »)", "« " + pa + " » ; " + c5);
      const carte1 = await carteConsole(); const c6 = await capt(prof, E.id + "-console-carte-apres");
      J.v(canon(carte1) === canon(carte0), H3, nom + " : la carte de lancement de la console est inchangée", carte1.join(" ‖ ").slice(0, 300) + " ; " + c6);
    }
    J.section("À l'entrée suivante : la démo, choisie par défaut ; la démo intacte");
    await enMode(); const mF = await menuTest(); const cF = await capt(prof, "entree-suivante");
    J.v(!!mF && /démo/i.test(mF.sel || ""), H3, "à l'entrée suivante en mode test, la démo est choisie par défaut", JSON.stringify(mF) + " ; " + cF);
    const cpF = EV(TE) || {};
    J.v(/démo|Démo/i.test(cpF.titre || "") || false || !EV("demo"), H3, "à l'entrée suivante, la copie est celle de la démo", "copie « " + cpF.titre + " »");
    J.v(canon(EV("demo")) === demo0, H3, "la démo du hub (evaluations/demo) n'a pas bougé", "");
    await cliquer(prof, /🗑️ Sortir et purger/); await pause(2500);
  } catch(e){ J.v(false, BANC, "le jeu s'est interrompu : " + e.message); try { await capt(prof, "interrompu"); } catch(x){} }
  for(const p of A.pages) J.v(p.__err.length === 0, H3, "page « " + p.__nom + " » sans erreur ni boîte système", p.__err.slice(0, 3).join(" · "));
  clearTimeout(fin);
  try { await A.nav.close(); } catch(e){}
  ecrire(); process.exit(0);
  function ecrire(){
    let app = ""; try { app = " · app md5 " + cp.execSync("md5sum " + JSON.stringify(process.env.APP_FILE || "")).toString().slice(0, 32); } catch(e){}
    const out = "vérifications : " + J.verifs.length + " · échecs : " + J.echecs.length + "\n" + J.l.map(x => x.section ? "── " + x.section : x.note ? "  note   " + x.note : x.secours ? "  NOTE   " + x.secours : (x.ok ? "  ok     " : "  ÉCHEC  ") + "[" + x.proprio + "] " + x.quoi + (x.ok ? "" : " — vu : " + x.vu)).join("\n");
    fs.writeFileSync(path.join(SORTIE, "modetest.txt"), "Le mode test joue les vraies évaluations, par le geste (QCM-4 · BANC) — durée " + Math.round((Date.now() - t0) / 1000) + " s" + app + "\n" + out + "\n");
    console.log(out);
  }
})();
