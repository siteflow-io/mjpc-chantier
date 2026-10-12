// Banc de la réparation 7.7.2 (dettes n°12 · 198 et 210), par le geste, sur le faux hub.
// Une console, un tableau, un téléphone qui pilote toute la séance après le lancement, trois tablettes.
// Usage : APP_FILE=<evaluation-qcm.html> BANC=<dossier du faux hub, avec node_modules> node banc.js <sortie.txt>
// Code de sortie 1 si une seule vérification échoue.
const path = require("path"), fs = require("fs");
const BANC = process.env.BANC || path.join(__dirname, "..", "QCM-MODE-TEST-09-10", "banc");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const SORTIE = process.argv[2] || path.join(__dirname, "sortie.txt");
const CAPT = path.join(path.dirname(SORTIE), "captures-" + path.basename(SORTIE, ".txt")); fs.mkdirSync(CAPT, {recursive: true});
const PORT = 8791, sleep = ms => new Promise(r => setTimeout(r, ms));
// L'évaluation du banc : les trois premières questions de l'évaluation de 4e en ligne, au format de la 7.7.1
const EV4 = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "MANDATS", "EVAL-4E-PARIS", "eval_1791380799497.json")));
const EV = {titre: "Banc de la 7.7.2", questions: EV4.questions.slice(0, 3), createdAt: 1, updatedAt: 1, version: 1};
// Ce que clique chaque élève (index des choix), question par question ; null : il ne répond pas
const PLAN = [[[1], [0, 2], [3]], [[0], [0], [3]], [[1], null, [2]]];
const lignes = [], echecs = [];
function verif(ok, quoi){ const l = (ok ? "OK    " : "ÉCHEC ") + quoi; lignes.push(l); console.log(l); if(!ok) echecs.push(quoi); }
function note(m){ lignes.push("      " + m); console.log("      " + m); }
const juste = (c, b) => c && c.length && JSON.stringify(c.slice().sort()) === JSON.stringify(b.slice().sort());

(async () => {
  const t0 = Date.now();
  note("app : " + process.env.APP_FILE + " (md5 " + require("crypto").createHash("md5").update(fs.readFileSync(process.env.APP_FILE)).digest("hex") + ")");
  const B = buildTree();
  B.tree.qcm.evaluations = {banc: EV};
  const srv = await startServer(B.tree, PORT, () => {});
  const nav = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const pages = {};
  async function ouvrir(nom, q, vw, mobile){
    const ctx = await nav.newContext(Object.assign({viewport: vw}, mobile ? {isMobile: true, hasTouch: true} : {}));
    await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); p.__err = []; p.__dlg = [];
    p.on("pageerror", e => p.__err.push(e.message));
    p.on("console", m => { if(m.type() === "error" && /Error|is not defined/.test(m.text())) p.__err.push("console : " + m.text().split("\n")[0].slice(0, 160)); });
    p.on("dialog", d => { p.__dlg.push(d.type() + " « " + d.message().replace(/\s+/g, " ").slice(0, 80) + " »"); d.accept(); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await sleep(1200);
    pages[nom] = p; return p;
  }
  const texte = async p => (await p.locator("body").innerText()).replace(/\s+/g, " ").trim();
  // la séance est retenue dès qu'elle est active : « Terminer » retire qcm/sessionActive juste après avoir écrit etat="terminee"
  let SID = null;
  const sid = () => SID || (SID = srv.store.get("qcm/sessionActive/" + B.CLASSE_CLE) || null);
  const sess = () => srv.store.get("qcm/sessions/" + sid()) || {};
  async function attendre(cond, quoi, max){ const t = Date.now(); while(!cond()){ if(Date.now() - t > (max || 30000)) throw new Error("trop long : " + quoi); await sleep(120); } }
  try {
    const prof = await ouvrir("console", "?mode=prof", {width: 1440, height: 1000});
    await ouvrir("tableau", "?mode=prof&view=board", {width: 1280, height: 720});
    const E = [];
    for(let i = 0; i < 3; i++){
      const e = B.eleves[i], p = await ouvrir(e.nomComplet, "?mode=eleve", {width: 1024, height: 768});
      await p.getByRole("button", {name: B.CLASSE_NOM}).click();
      await p.getByPlaceholder("Mon code (4 chiffres)").fill(e.code);
      await p.getByPlaceholder("Prénom", {exact: true}).fill(e.prenom);
      await p.getByPlaceholder("Nom", {exact: true}).fill(e.nom);
      await p.getByRole("button", {name: "Entrer →"}).click();
      await p.getByText("Identifie-toi").waitFor({state: "detached", timeout: 20000});
      E.push({e, p, slug: B.sanMJPC(e.nomComplet), plan: PLAN[i]});
    }
    note("3 tablettes entrées par leur code : " + E.map(x => x.e.nomComplet).join(", "));
    // Le lancement, à la console (le téléphone n'a pas ce geste)
    await prof.getByText("Lancer une nouvelle session").waitFor();
    await prof.locator("select").nth(0).selectOption({label: B.CLASSE_NOM + " (25 élèves)"});
    await prof.locator("select").nth(1).selectOption({label: EV.titre + " (3 questions)"});
    await prof.getByRole("button", {name: "🚀 Lancer la session"}).click();
    await prof.getByRole("button", {name: "Tout le monde présent"}).click();
    await prof.getByRole("button", {name: "🚀 Lancer la session"}).last().click();
    await attendre(() => !!sid(), "séance active");
    verif(!!sid(), "la console lance la séance (" + sid() + ")");
    // Le téléphone, par l'adresse du QR
    const tel = await ouvrir("téléphone", "#mode=prof&view=phone&qr=qr_banc", {width: 390, height: 844}, true);
    verif((await texte(tel)).length > 100, "le téléphone s'ouvre sur la séance (" + (await texte(tel)).length + " caractères)");
    // Les trois questions, pilotées au téléphone
    for(let q = 0; q < 3; q++){
      await tel.getByRole("button", {name: "🚀 Lancer Q" + (q + 1)}).click();
      await attendre(() => sess().qIdx === q && sess().phase === "reflexion", "réflexion Q" + (q + 1));
      await tel.getByRole("button", {name: "✋ Autoriser la réponse"}).click();
      await attendre(() => sess().qIdx === q && sess().phase === "reponse", "réponse Q" + (q + 1));
      let premiere = true;
      for(const x of E){
        const c = x.plan[q]; if(!c) continue;
        const btns = x.p.locator(".eleve-choix-btn"); await btns.first().waitFor({timeout: 8000});
        for(const j of c){ await btns.nth(j).click(); await sleep(120); }
        if(premiere){ premiere = false; await sleep(900);
          const n = (await texte(tel)).length;
          verif(n > 300 && tel.__err.length === 0, "Q" + (q + 1) + " : après la première réponse, le téléphone affiche toujours la séance (" + n + " caractères, " + tel.__err.length + " erreur(s) de page)");
          if(q === 0) await tel.screenshot({path: CAPT + "/1-telephone-apres-premiere-reponse.png"});
        }
      }
      await attendre(() => sess().qIdx === q && sess().phase === "attente", "fermeture Q" + (q + 1), 40000);
      const reps = srv.store.get("qcm/sessions/" + sid() + "/reponses/" + q) || {};
      const attendu = E.filter(x => x.plan[q]).length;
      verif(Object.keys(reps).length === attendu, "Q" + (q + 1) + " close : " + Object.keys(reps).length + " réponse(s) dans la base sur " + attendu + " attendue(s)");
    }
    // L'autoévaluation puis la correction, au téléphone
    await tel.getByRole("button", {name: "📊 Lancer l'autoévaluation"}).click();
    await attendre(() => sess().phase === "autoeval", "autoévaluation");
    for(const x of E){ const f = x.p.locator(".autoeval-fourchette"); await f.first().waitFor({timeout: 10000}); await f.first().click(); }
    await tel.getByRole("button", {name: "📝 Lancer la correction"}).click();
    await attendre(() => sess().phase === "correction", "correction");
    verif(sess().phase === "correction", "le téléphone lance la correction");
    for(let k = 0; k < 3; k++){
      const qi = sess().correctionIdx, Q = EV.questions[qi];
      await tel.getByRole("button", {name: "💡 Révéler la bonne réponse"}).click();
      await attendre(() => sess().corrRevealed === true, "révélation");
      await sleep(1200);
      for(const x of E){
        const t = await texte(x.p), c = x.plan[qi];
        const dit = c ? (juste(c, Q.bonnes) ? "✅ Tu avais juste !" : "❌ Tu avais faux.") : "⚠️ Tu n'as pas répondu à cette question.";
        const bonnesMarquees = await x.p.locator(".correction-choix-item.bonne, .correction-choix-item.eleve-juste").count();
        verif(t.length > 100 && x.p.__err.length === 0 && t.includes(dit) && bonnesMarquees === Q.bonnes.length,
          "correction de Q" + (qi + 1) + ", " + x.e.nomComplet + " : la tablette affiche « " + dit + " » et " + bonnesMarquees + " bonne(s) réponse(s) marquée(s) sur " + Q.bonnes.length + " (" + t.length + " caractères, " + x.p.__err.length + " erreur(s) de page)");
        if(k === 0 && x === E[1]) await x.p.screenshot({path: CAPT + "/2-tablette-correction.png"});
      }
      const n = (await texte(tel)).length;
      verif(n > 300 && tel.__err.length === 0, "correction de Q" + (qi + 1) + " : le téléphone affiche la séance (" + n + " caractères, " + tel.__err.length + " erreur(s) de page)");
      if(k === 0) await tel.screenshot({path: CAPT + "/3-telephone-correction.png"});
      await tel.getByRole("button", {name: "Question suivante →"}).click();
      await sleep(800);
    }
    await attendre(() => sess().phase === "finie", "fin de la correction");
    verif(sess().phase === "finie", "après la 3e question, la séance est finie");
    await tel.getByRole("button", {name: "🛑 Terminer la session"}).click();
    await attendre(() => sess().etat === "terminee", "clôture", 15000).catch(() => {});
    verif(sess().etat === "terminee", "le téléphone termine la séance");
    await sleep(1500);
    for(const x of E) await x.p.screenshot({path: CAPT + "/4-fin-" + x.slug + ".png"});
  } catch(err){ verif(false, "le parcours s'arrête : " + String(err.message || err).split("\n")[0]); }
  for(const [nom, p] of Object.entries(pages)){
    verif(p.__err.length === 0, nom + " : " + p.__err.length + " erreur(s) de page" + (p.__err.length ? " — " + [...new Set(p.__err)].join(" | ").slice(0, 200) : ""));
    if(p.__dlg.length) note(nom + " : boîte(s) système acceptée(s) : " + p.__dlg.join(" ; "));
  }
  note("durée : " + Math.round((Date.now() - t0) / 1000) + " s ; " + (lignes.filter(l => /^(OK|ÉCHEC)/.test(l)).length) + " vérifications, " + echecs.length + " échec(s)");
  fs.writeFileSync(SORTIE, lignes.join("\n") + "\n");
  await nav.close(); await srv.close().catch(() => {});
  process.exit(echecs.length ? 1 : 0);
})();
