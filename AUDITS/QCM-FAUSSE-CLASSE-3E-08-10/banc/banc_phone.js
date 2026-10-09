// Banc court : le téléphone (vue phone, 7.7.1) quand un élève a répondu.
// Le poste lance la séance ; le téléphone s'ouvre par l'adresse du QR ;
// un élève répond à Q1 (écriture dans le faux hub) ; on relève les erreurs
// de page du téléphone et ce qu'il affiche.
const fs = require("fs");
const { chromium } = require("playwright");
const { startServer, installRoutes } = require("./server");
const { buildTree } = require("./tree");
const OUT = __dirname + "/out_phone"; fs.mkdirSync(OUT, {recursive: true});
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const lines = [];
function log(m){ lines.push(m); console.log(m); }
(async () => {
  const B = buildTree();
  const srv = await startServer(B.tree, 8767, () => {});
  const browser = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const ctx = await browser.newContext({viewport: {width: 1440, height: 1000}});
  await installRoutes(ctx, { ...srv, port: 8767 }, null);
  const prof = await ctx.newPage();
  prof.on("dialog", d => d.accept());
  prof.on("pageerror", e => log("POSTE pageerror " + e.message));
  await prof.goto("http://localhost:8767/evaluation-qcm.html?mode=prof");
  await prof.getByText("Lancer une nouvelle session").waitFor();
  await prof.locator("select").nth(0).selectOption({label: B.CLASSE_NOM + " (25 élèves)"});
  await prof.locator("select").nth(1).selectOption({label: "3e- éval 1 Analyse logique - Construire une phrase complexe (11 questions)"});
  await prof.getByRole("button", {name: "🚀 Lancer la session"}).click();
  await prof.getByRole("button", {name: "Tout le monde présent"}).click();
  await prof.getByRole("button", {name: "🚀 Lancer la session"}).last().click();
  await sleep(1500);

  const ctxT = await browser.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});
  await installRoutes(ctxT, { ...srv, port: 8767 }, null);
  const tel = await ctxT.newPage();
  const errsTel = [];
  tel.on("pageerror", e => { errsTel.push(e.message); log("TÉLÉPHONE pageerror " + e.message); }); tel.on("console", m => { if(m.type() === "error"){ errsTel.push(m.text()); log("TÉLÉPHONE console.error " + m.text().slice(0, 200)); } });
  await tel.goto("http://localhost:8767/evaluation-qcm.html#mode=prof&view=phone&qr=qr_banc");
  await sleep(2000);
  await tel.screenshot({path: OUT + "/1-telephone-avant-q1.png"});
  log("téléphone, avant Q1 : " + (await tel.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 160));

  await prof.getByRole("button", {name: "▶️ Lancer Q1"}).click();
  const sid = srv.store.get("qcm/sessionActive/" + B.CLASSE_CLE);
  const sess = () => srv.store.get("qcm/sessions/" + sid) || {};
  await sleep(1200);
  await prof.getByRole("button", {name: "✋ Autoriser la réponse"}).click();
  const t0 = Date.now(); while(sess().phase !== "reponse"){ if(Date.now() - t0 > 20000) throw new Error("pas de phase réponse"); await sleep(100); }
  await sleep(1200);
  await tel.screenshot({path: OUT + "/2-telephone-reponse-sans-reponse.png"});
  log("téléphone, phase réponse, aucune réponse : " + errsTel.length + " erreur(s) de page");

  const slug = B.sanMJPC(B.eleves[0].nomComplet);
  const op = {t: "set", p: "qcm/sessions/" + sid + "/reponses/0/" + slug, v: {choix: [0], ts: Date.now()}};
  srv.store.apply(op); srv.record(op, "banc"); srv.broadcast(op, null);
  log("un élève répond à Q1 : " + B.eleves[0].nomComplet + " (" + slug + ")");
  await sleep(2000);
  await tel.screenshot({path: OUT + "/3-telephone-apres-une-reponse.png"});
  const txt = (await tel.locator("body").innerText()).replace(/\s+/g, " ");
  log("téléphone, après la réponse : " + errsTel.length + " erreur(s) de page ; texte affiché : « " + txt.slice(0, 120) + " » (" + txt.length + " caractères)");
  await prof.screenshot({path: OUT + "/4-poste-apres-une-reponse.png"});
  const n0 = errsTel.length;
  await tel.reload(); await sleep(2500);
  await tel.screenshot({path: OUT + "/5-telephone-recharge.png"});
  const txt2 = (await tel.locator("body").innerText()).replace(/\s+/g, " ");
  log("téléphone rechargé : " + (errsTel.length - n0) + " erreur(s) de page de plus ; texte affiché : " + txt2.length + " caractères");
  const posteTxt = (await prof.locator("body").innerText()).length;
  log("poste : " + posteTxt + " caractères affichés");
  fs.writeFileSync(OUT + "/phone.log", lines.join("\n") + "\n");
  await browser.close(); await srv.close();
})().catch(e => { console.error(e); process.exit(1); });
