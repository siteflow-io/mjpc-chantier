// Fausse classe sur l'évaluation de 3e de demain, app 7.7.1 telle quelle.
// Tout passe par le geste : le poste du prof clique ses boutons, chaque
// tablette (un élève par tablette, format actuel) touche ses lettres, puis
// chaque élève fait sa saisie papier dans « Tes évaluations passées ».
const fs = require("fs");
const crypto = require("crypto");
const { chromium } = require("playwright");
const { startServer, installRoutes } = require("./server");
const { buildTree } = require("./tree");

const OUT = __dirname + "/out";
fs.mkdirSync(OUT, {recursive: true});
const T0 = Date.now();
const logf = fs.createWriteStream(OUT + "/run.log");
function log(m){ const l = "[" + ((Date.now() - T0) / 1000).toFixed(1).padStart(6) + "s] " + m; logf.write(l + "\n"); console.log(l); }
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const URL = "http://localhost:8765/evaluation-qcm.html";
const EVAL_LABEL = "3e- éval 1 Analyse logique - Construire une phrase complexe (11 questions)";

(async () => {
  const md5 = crypto.createHash("md5").update(fs.readFileSync("/home/claude/QCM/evaluation-qcm.html")).digest("hex");
  log("app servie telle quelle, md5 " + md5);
  const B = buildTree();
  const S = JSON.parse(fs.readFileSync(__dirname + "/scenario.json", "utf8"));
  const srv = await startServer(B.tree, 8765, (m) => { if(!/^REST GET/.test(m)) log(m); });
  const browser = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});

  async function nouvellePage(nom, vw){
    const ctx = await browser.newContext({viewport: vw, deviceScaleFactor: 1});
    await installRoutes(ctx, srv, (m) => { if(!/^REST GET/.test(m)) log(nom + " " + m); });
    const page = await ctx.newPage();
    page.on("pageerror", e => log(nom + " ERREUR PAGE " + e.message));
    page.on("console", m => { if(m.type() === "error") log(nom + " console " + m.text().slice(0, 200)); });
    page.on("dialog", d => { log(nom + " fenêtre « " + d.message().replace(/\s+/g, " ").slice(0, 110) + " » → OK"); d.accept(); });
    return {ctx, page};
  }

  // ── Le poste du prof ──
  const P = await nouvellePage("PROF", {width: 1440, height: 1000});
  const prof = P.page;
  await prof.goto(URL + "?mode=prof");
  await prof.getByText("Lancer une nouvelle session").waitFor();
  // ── Le tableau de la classe (vue tableau, projetée) ──
  const TB = await nouvellePage("TABLEAU", {width: 1280, height: 720});
  const board = TB.page;
  await board.goto(URL + "?mode=prof&view=board");

  // ── Les tablettes : connexion par le code ──
  const E = [];
  for(let i = 0; i < S.eleves.length; i++){
    const se = S.eleves[i], be = B.eleves[i];
    const np = await nouvellePage(se.nomComplet, {width: 1024, height: 768});
    E.push(Object.assign({}, np, {se, be, i, clics: []}));
  }
  async function connecter(e){
    const pg = e.page;
    await pg.goto(URL + "?mode=eleve");
    await pg.getByRole("button", {name: B.CLASSE_NOM}).click();
    await pg.getByPlaceholder("Mon code (4 chiffres)").fill(e.be.code);
    await pg.getByPlaceholder("Prénom", {exact: true}).fill(e.be.prenom);
    await pg.getByPlaceholder("Nom", {exact: true}).fill(e.be.nom);
    await pg.getByRole("button", {name: "Entrer →"}).click();
    await pg.getByText("Identifie-toi").waitFor({state: "detached", timeout: 30000});
    await pg.waitForFunction(() => document.body.innerText.trim().length > 20, null, {timeout: 30000});
  }
  for(let k = 0; k < E.length; k += 5) await Promise.all(E.slice(k, k + 5).map(connecter));
  log("25 tablettes connectées ; présence au hub : " + Object.keys(srv.store.get("qcm/presence/" + B.CLASSE_CLE) || {}).length);

  // ── Lancer la session ──
  await prof.locator("select").nth(0).selectOption({label: B.CLASSE_NOM + " (25 élèves)"});
  await prof.locator("select").nth(1).selectOption({label: EVAL_LABEL});
  await prof.getByRole("button", {name: "🚀 Lancer la session"}).click();
  await prof.getByRole("button", {name: "Tout le monde présent"}).click();
  await prof.getByRole("button", {name: "🚀 Lancer la session"}).last().click();
  await sleep(1500);
  const sid = srv.store.get("qcm/sessionActive/" + B.CLASSE_CLE);
  log("session lancée : " + sid);
  const sess = () => srv.store.get("qcm/sessions/" + sid) || {};
  async function attendre(cond, quoi, max){
    const t = Date.now();
    while(!cond()){ if(Date.now() - t > (max || 120000)) throw new Error("trop long : " + quoi); await sleep(150); }
  }
  // Chrono de réponse : 20 s au lieu des 5 s par défaut (case « ✋ Réponse » du pilotage)
  const caseRep = prof.locator('input[type="number"][min="3"][max="30"]');
  await caseRep.fill("20"); await caseRep.blur();
  log("chrono de réponse réglé à 20 s");
  await prof.getByRole("button", {name: "▶️ Lancer Q1"}).click();

  const nQ = S.bonnes.length;
  for(let q = 0; q < nQ; q++){
    await attendre(() => sess().qIdx === q && sess().phase === "reflexion", "réflexion Q" + (q + 1));
    log("Q" + (q + 1) + " réflexion");
    if(q === 0){
      // Mesuré : quand la réflexion finit d'elle-même, la réponse dure sess.chronoReponse||5,
      // la case « ✋ Réponse » n'est prise que par le bouton « ✋ Autoriser la réponse ».
      // Le prof l'appuie donc à la fin de la réflexion de Q1 : la valeur reste pour la séance.
      await attendre(() => Date.now() - sess().phaseStart > 14000, "fin de réflexion Q1", 30000);
      await prof.getByRole("button", {name: "✋ Autoriser la réponse"}).click();
      log("Q1 : « ✋ Autoriser la réponse » appuyé à la fin de la réflexion");
    }
    await attendre(() => sess().qIdx === q && sess().phase === "reponse", "réponse Q" + (q + 1), 90000);
    log("Q" + (q + 1) + " réponse ouverte, chronoReponse=" + sess().chronoReponse);
    if(q === 6) await prof.screenshot({path: OUT + "/pilotage_reponse_Q7.png"});
    await Promise.all(E.map(async (e) => {
      const tab = e.se.questions[q].tablette;
      if(!tab) return;
      await sleep(400 + Math.floor(Math.random() * 6000));
      const btns = e.page.locator(".eleve-choix-btn");
      await btns.first().waitFor({timeout: 8000});
      for(const j of tab){ await btns.nth(j).click(); e.clics.push([q, j]); await sleep(150); }
      if(e.i === 13 && q === 6) await e.page.screenshot({path: OUT + "/tablette_sacha_Q7.png"});
    }));
    await attendre(() => sess().qIdx === q && sess().phase === "attente", "fermeture Q" + (q + 1), 60000);
    const rep = srv.store.get("qcm/sessions/" + sid + "/reponses/" + q) || {};
    log("Q" + (q + 1) + " close : " + Object.keys(rep).length + " réponses au hub");
    if(q < nQ - 1) await prof.getByRole("button", {name: "Q suiv. →"}).click();
  }

  // ── Autoévaluation puis correction ──
  await prof.getByRole("button", {name: "📊 Lancer l'autoévaluation"}).click();
  await attendre(() => sess().phase === "autoeval", "autoéval");
  await Promise.all(E.map(async (e) => {
    const f = e.page.locator(".autoeval-fourchette");
    await f.first().waitFor({timeout: 15000});
    const justes = e.se.questions.filter((r, q) => JSON.stringify(r.feuille) === JSON.stringify(S.bonnes[q])).length;
    await f.nth(Math.min(3, Math.floor(justes / 11 * 4))).click();
  }));
  log("autoévaluation : " + Object.keys((sess().autoevals) || {}).length + " votes");
  await prof.getByRole("button", {name: "📝 Lancer la correction"}).click();
  await attendre(() => sess().phase === "correction", "correction");
  async function ecransVides(){
    let n = 0;
    for(const e of E){ const t = (await e.page.locator("body").innerText()).trim(); if(t.length < 3) n++; }
    return n;
  }
  for(let k = 0; k < nQ; k++){
    await prof.getByRole("button", {name: /Révéler/}).click();
    await sleep(900);
    if(k === 0){
      await E[13].page.screenshot({path: OUT + "/tablette_sacha_correction.png"});
      await board.screenshot({path: OUT + "/tableau_correction_Q1.png"});
      await prof.screenshot({path: OUT + "/pilotage_correction.png"});
      const tb = (await board.locator("body").innerText()).trim();
      log("correction, 1re question révélée : " + (await ecransVides()) + " tablettes sur 25 à l'écran vide ; le tableau affiche " + tb.length + " caractères");
    }
    await prof.getByRole("button", {name: "Question suivante →"}).click();
    await sleep(700);
  }
  await attendre(() => sess().phase === "finie", "fin");
  log("phase finie ; tablettes à l'écran vide : " + (await ecransVides()));
  await sleep(2500);

  fs.writeFileSync(OUT + "/hub_fin_correction.json", JSON.stringify(srv.store.tree(), null, 1));
  async function ouvrirSeancePassee(e){
    const row = e.page.locator(".results-eval-row").first();
    await row.waitFor({timeout: 20000});
    await row.click();
  }
  try {
  // ── Ce que chaque élève voit à la fin de la séance : il recharge sa page et retape son code ──
  for(let k = 0; k < E.length; k += 5) await Promise.all(E.slice(k, k + 5).map(async (e) => {
    await connecter(e);
    await e.page.getByText(/Points pour la note/).waitFor({timeout: 20000}).catch(() => null);
  }));
  log("tablettes rechargées en fin de séance ; écrans vides : " + (await ecransVides()));
  const bilan = {};
  for(const e of E){
    const t = await e.page.locator("body").innerText();
    const m1 = t.match(/(\d+)\s*\/\s*(\d+) bonnes réponses/);
    const m2 = t.match(/Points pour la note :\s*(\d+)\s*\/\s*(\d+)/);
    bilan[e.se.nomComplet] = {bonnes: m1 ? +m1[1] : null, sur: m1 ? +m1[2] : null, points: m2 ? +m2[1] : null, maxPoints: m2 ? +m2[2] : null};
  }
  await E[13].page.screenshot({path: OUT + "/fin_seance_sacha.png", fullPage: true});
  fs.writeFileSync(OUT + "/bilan_fin_seance.json", JSON.stringify(bilan, null, 1));
  log("bilans de fin de séance relevés");

  // ── Terminer la session ──
  await prof.getByRole("button", {name: /Terminer la session/}).first().click();
  await attendre(() => sess().etat === "terminee", "clôture", 30000);
  log("session terminée (etat=terminee)");
  await sleep(2500);
  await E[0].page.screenshot({path: OUT + "/apres_terminer_julien.png"});
  log("après « Terminer la session », écrans vides : " + (await ecransVides()));

  // ── Saisies papier, par le geste, dans « Tes évaluations passées » ──
  const apresEnvoi = {};
  await Promise.all(E.map(async (e) => {
    await sleep(Math.floor(Math.random() * 3000));
    await ouvrirSeancePassee(e);
    await e.page.getByText("Saisis tes réponses papier").waitFor({timeout: 20000});
    if(!e.se.saisie_faite){ log(e.se.nomComplet + " : ne fait pas sa saisie"); return; }
    const blocs = e.page.locator(".beta-q");
    for(let q = 0; q < nQ; q++){
      for(const j of e.se.questions[q].saisie){ await blocs.nth(q).locator(".lettre-pick").nth(j).click(); await sleep(60); }
    }
    if(e.i === 13) await e.page.screenshot({path: OUT + "/saisie_sacha.png", fullPage: true});
    await e.page.getByRole("button", {name: "Envoyer →"}).click();
    await e.page.waitForEvent("load", {timeout: 15000}).catch(() => null);
    await sleep(1500);
    const t = await e.page.locator("body").innerText();
    apresEnvoi[e.se.nomComplet] = t.includes("Choisis ta classe") ? "Choisis ta classe" : t.slice(0, 80).replace(/\s+/g, " ");
    if(e.i === 13) await e.page.screenshot({path: OUT + "/apres_envoi_sacha.png"});
  }));
  log("après « Envoyer », écran des élèves : " + JSON.stringify(Object.values(apresEnvoi).reduce((a, v) => { a[v] = (a[v] || 0) + 1; return a; }, {})));

  // ── L'élève revient voir ses résultats : il se reconnecte et rouvre la séance ──
  const resultatsEleve = {};
  for(let k = 0; k < E.length; k += 5) await Promise.all(E.slice(k, k + 5).map(async (e) => {
    if(!e.se.saisie_faite) return;
    await connecter(e);
    await ouvrirSeancePassee(e);
    await e.page.locator(".score-card").first().waitFor({timeout: 20000});
    const cartes = await e.page.locator(".score-card").evaluateAll(els => els.map(x => [x.querySelector(".l").innerText.trim(), x.querySelector(".v").innerText.replace(/\s+/g, " ").trim()]));
    resultatsEleve[e.se.nomComplet] = cartes;
    if([13, 2, 0, 7, 23, 24].includes(e.i)) await e.page.screenshot({path: OUT + "/resultats_" + e.be.nom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") + ".png", fullPage: true});
  }));
  fs.writeFileSync(OUT + "/resultats_eleves.json", JSON.stringify(resultatsEleve, null, 1));
  log("résultats élèves relevés : " + Object.keys(resultatsEleve).length);

  } catch(err){ log("ÉTAPE EN ÉCHEC (la séance est gardée) : " + (err.stack || err).split("\n").slice(0, 3).join(" | ")); }
  fs.writeFileSync(OUT + "/hub_final.json", JSON.stringify(srv.store.tree(), null, 1));
  fs.writeFileSync(OUT + "/journal.json", JSON.stringify(srv.journal));
  fs.writeFileSync(OUT + "/clics.json", JSON.stringify(E.map(e => ({nom: e.se.nomComplet, clics: e.clics}))));
  log("état du faux hub enregistré ; la console reste ouverte pour la suite");
  // garder le navigateur ouvert pour la lecture de la console (étape suivante)
  fs.writeFileSync(OUT + "/PRET", "1");
  global.__ctx = {browser, prof, srv, E, sid};
  // petit serveur de commande : on lit des ordres dans out/cmd.js
  for(;;){
    await sleep(1000);
    if(fs.existsSync(OUT + "/cmd.js")){
      const code = fs.readFileSync(OUT + "/cmd.js", "utf8"); fs.unlinkSync(OUT + "/cmd.js");
      try{ const r = await eval("(async () => {" + code + "})()"); fs.writeFileSync(OUT + "/cmd.out", String(r == null ? "ok" : r)); }
      catch(err){ fs.writeFileSync(OUT + "/cmd.out", "ERREUR " + err.stack); }
      if(code.includes("__FIN__")) break;
    }
  }
  await browser.close(); await srv.close(); process.exit(0);
})().catch(e => { log("ÉCHEC " + (e.stack || e)); process.exit(1); });
