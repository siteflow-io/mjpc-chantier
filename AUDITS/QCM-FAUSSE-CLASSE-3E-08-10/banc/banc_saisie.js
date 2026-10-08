// Banc court : trois élèves restés sur la page de la séance font leur saisie
// papier juste après « Terminer la session ». Julien envoie la sienne pendant
// que Léa remplit la sienne et que Tom attend sur l'accueil.
const fs = require("fs");
const { chromium } = require("playwright");
const { startServer, installRoutes } = require("./server");
const { buildTree } = require("./tree");
const OUT = __dirname + "/out_saisie"; fs.mkdirSync(OUT, {recursive: true});
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const T0 = Date.now(); const lines = [];
function log(m){ const l = "[" + ((Date.now() - T0) / 1000).toFixed(1).padStart(6) + "s] " + m; lines.push(l); console.log(l); }
(async () => {
  const B = buildTree();
  const srv = await startServer(B.tree, 8767, () => {});
  const browser = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  async function page(vw){ const ctx = await browser.newContext({viewport: vw}); await installRoutes(ctx, {...srv, port: 8767}, null); const p = await ctx.newPage(); p.on("dialog", d => d.accept()); return p; }
  const U = "http://localhost:8767/evaluation-qcm.html";
  const prof = await page({width: 1440, height: 1000});
  await prof.goto(U + "?mode=prof");
  await prof.getByText("Lancer une nouvelle session").waitFor();
  const el = {};
  for(const i of [0, 1, 2]){
    const e = B.eleves[i], p = await page({width: 1024, height: 768});
    await p.goto(U + "?mode=eleve");
    await p.getByRole("button", {name: B.CLASSE_NOM}).click();
    await p.getByPlaceholder("Mon code (4 chiffres)").fill(e.code);
    await p.getByPlaceholder("Prénom", {exact: true}).fill(e.prenom);
    await p.getByPlaceholder("Nom", {exact: true}).fill(e.nom);
    await p.getByRole("button", {name: "Entrer →"}).click();
    await p.getByText("Salut " + e.nomComplet).waitFor();
    el[e.prenom] = p;
  }
  await prof.locator("select").nth(0).selectOption({label: B.CLASSE_NOM + " (25 élèves)"});
  await prof.locator("select").nth(1).selectOption({label: "3e- éval 1 Analyse logique - Construire une phrase complexe (11 questions)"});
  await prof.getByRole("button", {name: "🚀 Lancer la session"}).click();
  await prof.getByRole("button", {name: "Tout le monde présent"}).click();
  await prof.getByRole("button", {name: "🚀 Lancer la session"}).last().click();
  await sleep(1000);
  await prof.getByRole("button", {name: "▶️ Lancer Q1"}).click();
  await prof.getByRole("button", {name: "✋ Autoriser la réponse"}).click();
  for(const n of ["Julien", "Léa", "Tom"]){ await el[n].locator(".eleve-choix-btn").nth(3).click(); }
  await prof.getByRole("button", {name: "🔒 Clore la question"}).click();
  await sleep(800);
  await prof.getByRole("button", {name: /Terminer la session/}).first().click();
  await sleep(2000);
  log("séance terminée ; aucune tablette rechargée");
  for(const n of ["Julien", "Léa"]){
    await el[n].locator(".results-eval-row").first().click();
    await el[n].getByText("Saisis tes réponses papier").waitFor();
  }
  await el["Tom"].locator(".results-eval-row").first().waitFor();
  // Léa commence sa saisie : Q1 D, Q2 C D F
  const bl = el["Léa"].locator(".beta-q");
  await bl.nth(0).locator(".lettre-pick").nth(3).click();
  for(const j of [2, 3, 5]) await bl.nth(1).locator(".lettre-pick").nth(j).click();
  const avant = await el["Léa"].locator(".lettre-pick.selected").count();
  await el["Léa"].screenshot({path: OUT + "/lea_avant.png"});
  log("Léa est sur sa saisie, " + avant + " lettres cochées ; Tom est sur l'accueil (« Tes évaluations passées »)");
  // Julien envoie la sienne
  const bj = el["Julien"].locator(".beta-q");
  for(let q = 0; q < 11; q++) await bj.nth(q).locator(".lettre-pick").nth(0).click();
  await el["Julien"].getByRole("button", {name: "Envoyer →"}).click();
  log("Julien appuie sur « Envoyer → »");
  await sleep(2500);
  const tL = (await el["Léa"].locator("body").innerText()).replace(/\s+/g, " ");
  const tT = (await el["Tom"].locator("body").innerText()).replace(/\s+/g, " ");
  await el["Léa"].screenshot({path: OUT + "/lea_apres.png"});
  await el["Tom"].screenshot({path: OUT + "/tom_apres.png"});
  log("Léa voit maintenant : « " + tL.replace(/[⭐🎯✨💡🎲🔥]/gu, "").trim().slice(0, 90) + " » ; lettres cochées encore à l'écran : " + await el["Léa"].locator(".lettre-pick.selected").count());
  log("Tom voit maintenant : « " + tT.replace(/[⭐🎯✨💡🎲🔥]/gu, "").trim().slice(0, 90) + " »");
  log("au hub, saisies enregistrées : " + Object.keys(srv.store.get("qcm/sessions/" + Object.keys(srv.store.get("qcm/sessions"))[0] + "/papier") || {}).join(", "));
  fs.writeFileSync(OUT + "/saisie.log", lines.join("\n") + "\n");
  await browser.close(); await srv.close();
})().catch(e => { console.error(e); process.exit(1); });
