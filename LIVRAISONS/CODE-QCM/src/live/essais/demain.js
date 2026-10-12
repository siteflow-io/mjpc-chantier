// QCM-1 · SOCLE — l'heure de demain, par ACT et ELV : la classe de 4e du banc (6 élèves, Iris absente), l'évaluation de 4e collée
// (11 questions, la 11e « bonus », chapitre 4e-ch1 ; banc/donnees/eval-4e-11.json), deux tablettes à deux et Paul seul sur la sienne ;
// les 11 questions à leurs deux tours, l'estimation, la correction des 11 dans l'ordre des plus ratées, la co-évaluation, le bilan, la fin ;
// les notes d'après la règle (la feuille ; « Trouvée au dernier moment » une fois ; la bonus dans les points, pas dans le total).
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC);
const { startServer, installRoutes, empreinte } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const crypto = require("crypto");
const RAC = path.join(__dirname, "..", "..", "..", "..", "..");
const EV4 = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "..", "banc", "donnees", "eval-4e-11.json")));
const TAXO = JSON.parse(fs.readFileSync(path.join(RAC, "AUDITS", "CONTROLES-QCM-APP", "attendus", "taxonomie-competences.json")));
const PORT = 8100 + Math.floor(Math.random() * 90);
const pause = ms => new Promise(r => setTimeout(r, ms));
const NOMS = ["ARNOUX Maël", "BESSON Lina", "CAMUS Yanis", "DELORME Rose", "EYMARD Paul", "FABRE Iris"];
// T : la tablette ; L : la feuille, lue par le voisin (Paul, seul, la lit lui-même) — j juste, f faux
const PLAN = {arnoux_mael: {T: "jjjjjjjjjjf", L: "jjjjjjjjjjf"}, besson_lina: {T: "jjfjfjjjfjf", L: "jffjfjjjfjf"}, camus_yanis: {T: "fffffffffff", L: "fffffffffff"},
  delorme_rose: {T: "jfjfjfjfjff", L: "jfjfjfjfjff"}, eymard_paul: {T: "jjjjjfffffj", L: "fjjjjfffffj"}};
const ATTENDU = {arnoux_mael: 10, besson_lina: 7, camus_yanis: 0, delorme_rose: 5, eymard_paul: 6};   // sur 10 : Paul, bonus juste sur sa feuille → 5 + 1
let nb = 0, ko = 0; const R = [];
function verif(ok, quoi, detail){ nb++; if(!ok) ko++; R.push((ok ? "  ok     " : "  ÉCHEC  ") + quoi + (!ok && detail !== undefined ? " — " + JSON.stringify(detail).slice(0, 400) : "")); }
(async () => {
  const B = buildTree();
  const ev = JSON.parse(JSON.stringify(EV4)); ev.questions.forEach(q => { q.reflexion = 1; q.reponse = 4; });
  B.tree.qcm.evaluations = {eval4: ev}; B.tree.qcm.settings.durees = {decompte: 1, b: 1};
  B.tree.taxonomie = {competences: TAXO};
  const codes = {};
  B.tree.classes["4 ESSAI"] = {nom: "4 ESSAI", niveau: "4e", archivee: false, eleves: NOMS};
  NOMS.forEach((n, i) => { const sel = crypto.randomBytes(16).toString("hex"), c = String(3101 + i * 7), s = B.sanMJPC(n); codes[s] = c; B.tree.codes[s] = {name: n, classe: "4 ESSAI", sel, empreinte: empreinte(c, sel)}; });
  const srv = await startServer(B.tree, PORT, () => {});
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const err = [];
  async function ouvrir(q){ const ctx = await nav.newContext({viewport: {width: 1280, height: 800}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); p.on("pageerror", e => err.push(q + " : " + e.message)); await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q);
    await p.waitForFunction(() => window.LIVE && LIVE.pret, null, {timeout: 15000}); await pause(300); return p; }
  const base = p => srv.store.get("qcm/" + p);
  const t0 = Date.now();
  try {
    const prof = await ouvrir("?mode=prof");
    verif(await prof.evaluate(() => SCN.manques(SCN.evalParId("eval4")).length === 0), "l'évaluation de 4e (chapitre 4e-ch1, sans fiche au hub) est complète : « Lancer » s'ouvre", await prof.evaluate(() => SCN.manques(SCN.evalParId("eval4"))));
    const sid = await prof.evaluate(() => ACT.lancerSeance("4 ESSAI", "eval4", {}));
    await prof.evaluate(() => ACT.appelFini(["fabre_iris"])); await pause(300);
    const pl = await prof.evaluate(() => SCN.places());
    verif(pl.length === 3 && pl[2].g === "eymard_paul" && !pl[2].d && pl[2].seul, "les places : deux tablettes à deux, Paul seul sur la 3e (Iris absente)", pl);
    // les trois tablettes : chacune ses élèves, par leur code
    const tabs = [];
    for (const t of pl) { const p = await ouvrir("?mode=eleve"); await p.evaluate(n => ELV.combien(n), t.d ? 2 : 1);
      for (const [c, x] of [["g", t.g], ["d", t.d]]) if (x) { const n = NOMS.find(y => B.sanMJPC(y) === x).split(" "); const r = await p.evaluate(([c, code, pr, no]) => ELV.entrer(c, code, pr, no), [c, codes[x], n.slice(1).join(" "), n[0]]); if (!r.ok) verif(false, "entrée de " + x, r); }
      tabs.push(p); }
    const presents = await prof.evaluate(() => SCN.presents());
    verif(presents.length === 5, "5 présents", presents);
    for (const p of tabs) await p.evaluate(() => { const i = ELV.ici(); [i.g, i.d].filter(Boolean).forEach(x => ELV.commencer(x, 1)); });
    await pause(800);
    verif(base("sessions/" + sid + "/deroule/ph") === "pret", "les attestations faites : « prêt »", base("sessions/" + sid + "/deroule"));
    const choix = (qi, c) => { const Q = ev.questions[qi]; if (c === "j") return Q.bonnes.slice(); return [Q.choix.map((_, i) => i).filter(i => !Q.bonnes.includes(i))[0]]; };
    const repondre = async qi => { for (const p of tabs) await p.evaluate(([qi, plan]) => { const i = ELV.ici(); [i.g, i.d].filter(Boolean).forEach(x => { if (SCN.aLaMain(x) && !SCN.reponse(x, qi)) ELV.repondre(qi, plan[x], x); }); }, [qi, Object.fromEntries(presents.map(x => [x, choix(qi, PLAN[x].T[qi])]))]); };
    let seulDeuxTours = true;
    for (let qi = 0; qi < 11; qi++) {
      await prof.evaluate(q => ACT.lancerQuestion(q), qi); await pause(150);
      await prof.evaluate(() => ACT.autoriserReponse()); await pause(1500);
      await repondre(qi);
      if (qi === 1) seulDeuxTours = seulDeuxTours && await prof.evaluate(() => SCN.aLaMain("eymard_paul"));
      await prof.evaluate(() => ACT.tourSuivant()); await pause(250);
      if (qi === 1) seulDeuxTours = seulDeuxTours && await prof.evaluate(() => SCN.aLaMain("eymard_paul"));
      await repondre(qi);
      await prof.evaluate(() => ACT.cloreQuestion()); await pause(200);
    }
    verif(seulDeuxTours, "Paul, seul, a la main aux deux tours");
    const rep = base("sessions/" + sid + "/reponses") || {};
    verif(Object.keys(rep).length === 11 && Object.values(rep).every(r => Object.keys(r).length === 5), "les 11 questions : les 5 réponses chacune", Object.values(rep).map(r => Object.keys(r).length));
    await prof.evaluate(() => ACT.lancerEstimation());
    for (const p of tabs) await p.evaluate(() => { const i = ELV.ici(); [i.g, i.d].filter(Boolean).forEach(x => ELV.estimer("bleu", x)); });
    await prof.evaluate(() => ACT.lancerCorrection());
    for (const p of tabs) await p.evaluate(() => { const i = ELV.ici(); [i.g, i.d].filter(Boolean).forEach(x => ELV.commencer(x, 2)); });
    await pause(1000);
    const oc = await prof.evaluate(() => SCN.ordreCorr());
    verif(oc.length === 11, "l'ordre de la correction : les 11 questions", oc);
    for (let i = 0; i < 11; i++) {
      const qi = await prof.evaluate(() => SCN.etat().qi);
      for (const p of tabs) await p.evaluate(([qi, plan]) => { const i = ELV.ici(); [i.g, i.d].filter(Boolean).forEach(x => ELV.lire(qi, plan[x], x)); }, [qi, Object.fromEntries(presents.map(x => [x, choix(qi, PLAN[x].L[qi])]))]);
      await pause(200);
      const lus = await prof.evaluate(() => SCN.compteurs().lus);
      if (i === 0) verif(lus && lus[0] === 5 && lus[1] === 5, "la lecture de la 1re question corrigée : 5 feuilles lues (Paul lit la sienne)", lus);
      await prof.evaluate(() => ACT.reveler()); await pause(150); await prof.evaluate(() => ACT.questionSuivante()); await pause(200);
    }
    verif(base("sessions/" + sid + "/deroule/ph") === "coeval", "les 11 corrigées : la co-évaluation", base("sessions/" + sid + "/deroule"));
    for (const p of tabs) await p.evaluate(() => { const i = ELV.ici(); [i.g, i.d].filter(Boolean).forEach(x => { if (!SCN.seul(x)) ELV.coeval("ok", null, null, x); }); });
    await pause(300);
    const co = await prof.evaluate(() => SCN.compteurs().coeval);
    verif(co && co[0] === 4 && co[1] === 4, "la co-évaluation : les 4 qui ont un voisin ont répondu (Paul, seul, n'en a pas)", co);
    await prof.evaluate(() => ACT.afficherBilan()); await pause(300);
    const notes = await prof.evaluate(l => Object.fromEntries(l.map(x => { const n = SCN.note(x); return [x, {n: n.n, total: n.total, st: n.st.join(""), tr: n.trouvee}]; })), presents);
    for (const x of presents) verif(notes[x].n === ATTENDU[x] && notes[x].total === 10, "la note de " + x + " : " + ATTENDU[x] + " / 10 (la bonus dans les points, pas dans le total)", notes[x]);
    await prof.evaluate(() => ACT.terminer()); await pause(300);
    verif(base("sessions/" + sid + "/etat") === "terminee" && !base("sessionActive/4 ESSAI"), "la séance de 4e terminée");
    verif(err.length === 0, "aucune erreur de page", err.slice(0, 3));
  } catch (e) { verif(false, "l'essai s'est arrêté", e.stack); }
  await nav.close(); await srv.close();
  console.log("L'heure de demain, par ACT et ELV — " + Math.round((Date.now() - t0) / 1000) + " s · " + nb + " vérifications · " + ko + " échecs\n" + R.join("\n"));
  process.exit(ko ? 1 : 0);
})();
