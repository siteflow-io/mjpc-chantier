// SONDE DE LA CONSCIENCE N°12 — « Le mode test joue les vraies évaluations » (16/10, Paul 16:56 et 17:02 ; cadrage 559).
// Les contrôles fixés d'avance dans la section de DEFAUTS-OUVERTS (174f0d8c) : la carte de lancement du mode test (le menu, la démo,
// une évaluation de 3e, une de 4e), la console au premier tour et une tablette simulée avec l'évaluation de 4e, puis la sortie ;
// l'évaluation réelle identique bit à bit avant et après, et jamais écrite (journal du faux hub) ; la carte de lancement de la console inchangée.
// Tout par le geste. Les évaluations : « Évaluation d'essai » (3e, les attendus de la conscience) et une de 4e tirée de celle de Paul
// déjà au faux hub (4 questions), complétée pour être prête ; aucune donnée d'élève.
// usage : APP_FILE=<app.html> BANC=<faux hub> CTL=<AUDITS/CONTROLES-QCM-APP> node sonde-modetest.js [sortie.txt]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC);
const CTL = path.resolve(process.env.CTL);
const { startServer, installRoutes, canon } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const SORTIE = process.argv[2] || null;
const EV3 = JSON.parse(fs.readFileSync(path.join(CTL, "attendus", "evaluation-essai.json")));
const TAXO = JSON.parse(fs.readFileSync(path.join(CTL, "attendus", "taxonomie-competences.json")));
const PORT = 8890 + Math.floor(Math.random() * 100);
const RAPPORT = []; let nb = 0, echecs = 0;
function verif(n, ok, quoi, detail) { nb++; if (!ok) echecs++; RAPPORT.push((ok ? "  ok     " : "  ÉCHEC  ") + "T" + n + " · " + quoi + (detail && !ok ? " — " + String(detail).slice(0, 400) : "")); return ok; }
const pause = ms => new Promise(r => setTimeout(r, ms));
const norm = s => (s || "").replace(/[\u00a0\u202f]/g, " ");
const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
async function texte(p, sel) { return norm(await p.evaluate(sel => { const r = sel ? document.querySelector(sel) : document.body; return r ? r.innerText : ""; }, sel || null)); }
async function attendre(p, re, ms, sel) { const fin = Date.now() + (ms || 10000); while (Date.now() < fin) { if (re.test(await texte(p, sel))) return true; await pause(250); } return false; }
async function cliquer(p, re, sel) {
  const ok = await p.evaluate(([src, fl, sel]) => {
    const re = new RegExp(src, fl); const racine = sel ? document.querySelector(sel) : document; if (!racine) return false;
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const c = [...racine.querySelectorAll("button, a, [role=button], [data-va]")].filter(e => vis(e) && !e.disabled && re.test((e.textContent || "").replace(/[  ]/g, " ").trim()));
    c.sort((a, b) => a.textContent.length - b.textContent.length);
    if (!c[0]) return false; document.querySelectorAll("[data-ctl]").forEach(x => x.removeAttribute("data-ctl")); c[0].setAttribute("data-ctl", "1"); return true;
  }, [re.source, re.flags, sel || null]);
  if (!ok) return false;
  await p.click("[data-ctl='1']", {timeout: 3000}).catch(() => {});
  await pause(500);
  return true;
}
const menuTest = p => p.evaluate(() => { const s = document.querySelector("select[data-eval-test]"); return s ? {valeur: s.value, options: [...s.options].map(o => ({v: o.value, t: o.textContent.trim()})), ouvert: !s.disabled} : null; });
const dureeTest = p => p.evaluate(() => { const b = document.querySelector(".test-console .duree-box"); return b ? b.innerText.trim() : null; });

(async () => {
  const B = buildTree();
  const src4 = B.tree.qcm.evaluations["eval_1791380799497"];
  const q0 = EV3.questions[0];
  const EV4 = {titre: src4.titre, chapitre: "4e-ch1", mode: "strict", createdAt: 1791380799497,
    questions: src4.questions.slice(0, 4).map(q => Object.assign({}, q, {reflexion: q0.reflexion, reponse: q0.reponse, competences: q0.competences.slice(), verifie: "le vocabulaire du chapitre 1 de 4e"}))};
  B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: EV3, e4: EV4});
  B.tree.taxonomie = Object.assign({}, B.tree.taxonomie, {competences: TAXO});
  const srv = await startServer(B.tree, PORT, () => {});
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const err = [];
  async function ouvrir(q, w, h) { const ctx = await navig.newContext({viewport: {width: w, height: h}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); p.on("pageerror", e => err.push(e.message)); p.on("dialog", d => { err.push("boîte système : " + d.type()); d.dismiss().catch(() => {}); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await pause(1500); return p; }
  const t0 = Date.now();
  const VRAIES = ["qcm/evaluations/essai", "qcm/evaluations/e4"];
  const avant = VRAIES.map(p => canon(srv.store.get(p)));
  let demoAvant = null, jEntree = 0;
  // une écriture touche une vraie évaluation si son chemin est elle ou sous elle, ou si, au-dessus d'elle, elle la remplace (set) ou y écrit (update)
  const sous = (a, b) => a === b || a.startsWith(b + "/");
  const touche = j => { const op = j.op || {}, p = String(op.p == null ? "" : op.p).replace(/^\/+|\/+$/g, "");
    return VRAIES.some(v => { if (sous(p, v)) return true; if (!(p === "" || v.startsWith(p + "/"))) return false;
      if (op.t === "set") return true;
      const val = op.v; return !!val && typeof val === "object" && Object.keys(val).some(k => { const c = (p ? p + "/" : "") + String(k).replace(/^\/+/, ""); return sous(c, v) || sous(v, c); }); }); };
  try {
    const prof = await ouvrir("?mode=prof", 1536, 864);
    // T1 — la carte de lancement de la console, avant le mode test : son menu « Évaluation »
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(800);
    const carteConsole = () => prof.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].map(x => x.textContent.trim()); if (o.some(t => /Évaluation d'essai/.test(t))) return o; } return null; });
    const L0 = await carteConsole();
    verif(1, !!L0 && L0.some(t => /Évaluation d'essai/.test(t)) && L0.some(t => /Paris à la barre/.test(t)), "avant le mode test, la carte de lancement de la console propose l'évaluation de 3e et celle de 4e", JSON.stringify(L0));
    verif(1, !!L0 && !L0.some(t => /_test|🧪/.test(t)), "la carte de lancement de la console ne propose aucune évaluation de test", JSON.stringify(L0));

    // la démo permanente, telle qu'elle est au hub à l'entrée du mode test (l'app l'écrit à son premier chargement : avant le mode test)
    demoAvant = canon(srv.store.get("qcm/evaluations/demo")); jEntree = srv.journal.length;
    const demoAvantEntree = srv.journal.filter(j => /^\/?qcm\/evaluations\/demo/.test(String((j.op || {}).p || ""))).length;
    // T2 — « 🧪 Mode test » : la carte de lancement du mode test, la démo choisie par défaut, puis les évaluations prêtes dans l'ordre de la console
    await cliquer(prof, /🧪 Mode test/); let M = null;
    for (let k = 0; k < 40 && !(M = await menuTest(prof)); k++) await pause(300);
    verif(2, !!M, "le mode test ouvre sa carte de lancement, avec un menu « Évaluation » qui se choisit", "aucun select[data-eval-test]");
    if (M) {
      verif(2, M.valeur === "demo" && /Démo/.test(M.options[0].t), "la démo est en premier et choisie par défaut", JSON.stringify(M).slice(0, 300));
      const titres = M.options.slice(1).map(o => o.t.replace(/ \(\d+ questions?\)$/, ""));
      const ordreConsole = (L0 || []).filter(t => titres.includes(t));
      verif(2, titres.length === ordreConsole.length && titres.every((t, i) => t === ordreConsole[i]) && titres.length === (L0 || []).filter(t => !/Démo/.test(t)).length,
        "après la démo, les évaluations prêtes, la même liste et le même ordre que la carte de la console", JSON.stringify({mode_test: titres, console: L0}));
      verif(2, M.options.slice(1).every(o => / \(\d+ questions?\)$/.test(o.t)) && M.options.some(o => o.v === "e4" && /\(4 questions\)$/.test(o.t)) && M.options.some(o => o.v === "essai" && /\(3 questions\)$/.test(o.t)),
        "chaque ligne donne le titre et le nombre de questions", JSON.stringify(M.options));
    }
    const dDemo = await dureeTest(prof);
    // T3 — le choix de l'évaluation de 4e : la copie est réécrite d'après elle, la vraie n'est pas écrite ; la durée suit
    await prof.selectOption("select[data-eval-test]", "e4").catch(e => err.push("selectOption : " + e.message)); await pause(1500);
    let cp = srv.store.get("qcm/evaluations/_test_evaluation-qcm") || {};
    verif(3, (await menuTest(prof) || {}).valeur === "e4", "le menu garde le choix de l'évaluation de 4e après le redessin");
    verif(3, cp.titre === EV4.titre && canon(cp.questions) === canon(EV4.questions) && cp.chapitre === "4e-ch1" && cp.test === true && !cp.demo,
      "la copie de test prend le titre, les questions telles qu'elles sont, le chapitre de l'évaluation de 4e, et test:true", JSON.stringify({titre: cp.titre, chapitre: cp.chapitre, test: cp.test, n: (cp.questions || []).length}));
    const d4 = await dureeTest(prof);
    verif(3, !!d4 && d4 !== dDemo && /Durée estimée/.test(d4), "la carte de la durée suit l'évaluation choisie", JSON.stringify({demo: dDemo, e4: d4}));
    // T4 — l'évaluation de 3e, puis de nouveau celle de 4e
    await prof.selectOption("select[data-eval-test]", "essai").catch(() => {}); await pause(1500);
    cp = srv.store.get("qcm/evaluations/_test_evaluation-qcm") || {};
    verif(4, cp.titre === EV3.titre && canon(cp.questions) === canon(EV3.questions) && cp.chapitre === "3e-ch1", "l'évaluation de 3e choisie : la copie est la sienne", JSON.stringify({titre: cp.titre, chapitre: cp.chapitre}));
    await prof.selectOption("select[data-eval-test]", "e4").catch(() => {}); await pause(1500);

    // T5 — la séance de test sur l'évaluation de 4e, jusqu'au premier tour de Q1 : la console et une tablette simulée
    verif(5, await cliquer(prof, /^🚀 Lancer la séance$/, ".test-console"), "« 🚀 Lancer la séance » de la carte du mode test"); await pause(1500);
    await cliquer(prof, /^🚀 Lancer la séance$/); await pause(2500);
    await cliquer(prof, /🎲 Tous les élèves répondent/); await pause(1500);
    verif(5, await cliquer(prof, /▶️ Lancer Q1\b/, ".test-console"), "« ▶️ Lancer Q1 »"); await pause(1500);
    let auto = false; for (let k = 0; k < 40 && !auto; k++) { auto = await cliquer(prof, /Autoriser la réponse/, ".test-console"); if (!auto) await pause(500); }
    verif(5, auto, "« Autoriser la réponse » : le premier tour"); await pause(1500);
    const E1 = norm(EV4.questions[0].enonce);
    const sa = srv.store.get("qcm/sessionActive") || {}, sid = sa["_test_evaluation-qcm"], S = sid ? srv.store.get("qcm/sessions/" + sid) : null;
    verif(5, !!S && S.evalId === "_test_evaluation-qcm" && S.evalSnapshot && S.evalSnapshot.titre === EV4.titre && canon(S.evalSnapshot.questions) === canon(EV4.questions),
      "la séance de test joue la copie, et son énoncé conservé est celui de l'évaluation de 4e", JSON.stringify(S ? {evalId: S.evalId, titre: S.evalSnapshot && S.evalSnapshot.titre} : sa).slice(0, 300));
    const tc = await texte(prof, ".test-console");
    verif(5, tc.includes(E1) && /ont répondu/i.test(tc), "la console du mode test, au premier tour : l'énoncé de Q1 de l'évaluation de 4e et « n / N ont répondu »", tc.slice(0, 400));
    const ts = await texte(prof, "[data-sim-tab='1']");
    verif(5, ts.includes(E1) || EV4.questions[0].choix.some(c => ts.includes(norm(c))), "la tablette simulée 1 montre la question 1 de l'évaluation de 4e", ts.slice(0, 300));
    await prof.screenshot({path: path.join(path.dirname(SORTIE || "x"), "T5-console-4e.png"), fullPage: false}).catch(() => {});

    // T6 — la sortie : « 🗑️ Sortir et purger »
    verif(6, await cliquer(prof, /🗑️ Sortir et purger/), "« 🗑️ Sortir et purger »"); await pause(3500);
    const apres = VRAIES.map(p => canon(srv.store.get(p)));
    verif(6, apres.every((x, i) => x === avant[i]), "les deux vraies évaluations sont identiques bit à bit avant l'entrée et après la sortie");
    const ecr = srv.journal.filter(touche);
    verif(6, ecr.length === 0, "le journal du faux hub ne montre aucune écriture sur les vraies évaluations", JSON.stringify(ecr.slice(0, 3)));
    const iCree = srv.journal.findIndex(j => /^\/?qcm\/evaluations\/demo$/.test(String((j.op || {}).p || "")));
    if (iCree >= 0 && iCree >= jEntree) { jEntree = iCree + 1; demoAvant = canon(srv.journal[iCree].op.v); }
    const opsDemo = srv.journal.slice(jEntree).filter(j => /^\/?qcm\/evaluations\/demo/.test(String((j.op || {}).p || "")) || (j.op && j.op.t === "set" && /^\/?qcm\/evaluations\/?$/.test(String(j.op.p || ""))));
    verif(6, opsDemo.length === 0 && !!srv.store.get("qcm/evaluations/demo"), "la démo du hub : absente du faux hub, créée une fois par l'app à l'entrée du mode test (remettreDemo, maquette620.js l. 446, hors de la livraison ; " + (iCree >= 0 ? "créée" : "jamais créée") + ", " + demoAvantEntree + " écriture avant l'entrée), puis plus jamais écrite", JSON.stringify({egale: canon(srv.store.get("qcm/evaluations/demo")) === demoAvant, ops: opsDemo.slice(0, 2)}).slice(0, 400));
    const X = srv.store.get("qcm/sessions") || {};
    verif(6, !srv.store.get("qcm/evaluations/_test_evaluation-qcm") && !srv.store.get("classes/_test_evaluation-qcm") && !Object.values(X).some(s => s && (s.classeSlug === "_test_evaluation-qcm" || s.evalId === "_test_evaluation-qcm" || s.evalId === "e4" || s.evalId === "essai")),
      "la copie, la classe et la séance de test sont effacées ; aucune séance ne porte une vraie évaluation", JSON.stringify(Object.keys(X)));
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(1000);
    const L1 = await carteConsole();
    verif(6, canon(L1) === canon(L0), "la carte de lancement de la console est inchangée", JSON.stringify({avant: L0, apres: L1}));
    // T7 — l'entrée suivante : la démo de nouveau choisie par défaut
    await cliquer(prof, /🧪 Mode test/); let M2 = null; for (let k = 0; k < 40 && !(M2 = await menuTest(prof)); k++) await pause(300);
    verif(7, !!M2 && M2.valeur === "demo", "à l'entrée suivante, la démo est choisie par défaut", JSON.stringify(M2).slice(0, 200));
    await cliquer(prof, /🗑️ Sortir et purger/); await pause(2500);
    verif(8, err.length === 0, "aucune erreur de page ni boîte système", err.join(" | "));
  } catch (e) { verif(0, false, "la sonde a pu aller au bout", e.stack); }
  const tete = "Sonde de la conscience n°12 — le mode test joue les vraies évaluations — " + process.env.APP_FILE + " — " + new Date().toISOString() + "\nDurée : " + Math.round((Date.now() - t0) / 1000) + " s · vérifications : " + nb + " · échecs : " + echecs;
  const out = tete + "\n" + RAPPORT.join("\n") + "\n";
  if (SORTIE) fs.writeFileSync(SORTIE, out); console.log(out);
  await navig.close(); await srv.close(); process.exit(echecs ? 1 : 0);
})();
