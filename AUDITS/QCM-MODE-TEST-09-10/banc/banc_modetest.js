// Banc : le mode test de la 7.7.1, tel qu'il est. Captures de l'écran entier.
const fs = require("fs");
const { chromium } = require("playwright");
const { startServer, installRoutes } = require("./server");
const { buildTree } = require("./tree");
const OUT = __dirname + "/out_modetest"; fs.mkdirSync(OUT, {recursive: true});
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
function log(m){ console.log(m); }
async function shot(page, path){
  const hgt = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
  await page.setViewportSize({width: 1440, height: Math.min(hgt, 9000)}); await sleep(500);
  await page.screenshot({path, fullPage: false});
  await page.setViewportSize({width: 1440, height: 1000}); await sleep(200);
}
(async () => {
  const B = buildTree();
  const srv = await startServer(B.tree, 8768, () => {});
  const browser = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const ctx = await browser.newContext({viewport: {width: 1440, height: 1000}});
  await installRoutes(ctx, { ...srv, port: 8768 }, null);
  const prof = await ctx.newPage();
  const errs = [];
  prof.on("dialog", d => d.accept());
  prof.on("pageerror", e => { errs.push(e.message); log("pageerror " + e.message); });
  await prof.goto("http://localhost:8768/evaluation-qcm.html?mode=prof");
  await prof.getByText("Lancer une nouvelle session").waitFor();
  await prof.locator("button.btn-test").first().click();
  await prof.locator(".test-prof-zone").waitFor({timeout: 20000});
  await sleep(2500);
  await shot(prof, OUT + "/1-mode-test-ouverture.png");
  log("ouverture : " + (await prof.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 600));
  // Q1 : lancer, autoriser, tous répondent
  const lancer = prof.getByRole("button", {name: /Lancer Q1/});
  if(await lancer.count()){ await lancer.first().click(); await sleep(1200); }
  const aut = prof.getByRole("button", {name: /Autoriser la réponse/});
  if(await aut.count()){ await aut.first().click(); await sleep(1500); }
  await shot(prof, OUT + "/2-mode-test-q1-reponse.png");
  const tous = prof.getByRole("button", {name: /Tous les élèves répondent/});
  if(await tous.count()){ await tous.first().click(); await sleep(3000); }
  await shot(prof, OUT + "/3-mode-test-q1-tous-repondu.png");
  // le portail élève
  const portail = prof.getByRole("button", {name: /Ouvrir le portail élève/});
  if(await portail.count()){ await portail.first().click(); await sleep(2000);
    await prof.screenshot({path: OUT + "/4-mode-test-portail-eleve.png", fullPage: false}); }
  log("nombre de panneaux élèves : " + await prof.locator(".test-eleve-panel").count());
  log("erreurs de page : " + errs.length);
  await browser.close(); srv.close && srv.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
