// Sonde de la conscience n°12 (16/10, Paul 07:15 : « l'affichage du nom des classes ») : où l'app montre-t-elle le nom d'une classe, et sous quelle forme ?
// Faux hub au format réel des classes de Paul : la clé du registre est « 3_essai » (sanMJPC du nom), le nom est en capitales « 3 ESSAI », le niveau « 3e »
// (comme « 3_dylan_bob » / « 3 DYLAN BOB » au hub). Une seconde classe, « 4_essai » / « 4 ESSAI ». Élèves fictifs seulement.
// usage : APP_FILE=<app> BANC=<faux hub> BASE=<qcm du soir> TAXO=<taxonomie> CAP=<dossier> node sonde-classes.js
const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = process.env.BANC, CAP = process.env.CAP;
const { startServer, installRoutes, empreinte } = require(path.join(BANC, "server.js"));
const pause = ms => new Promise(r => setTimeout(r, ms));
const BRUT = new RegExp(process.env.MOTIF || "3_essai|3 ESSAI|4_essai|4 ESSAI");
function sanMJPC(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }
(async () => {
  const noms3 = JSON.parse(fs.readFileSync(path.join(BANC, "fausse_classe.json")));
  const noms4 = ["AUBRY Jules", "BESNARD Léna", "COLIN Mathis", "DROUET Elsa"];
  const codes = {}, eleves = [];
  [["3_essai", noms3], ["4_essai", noms4]].forEach(([cl, l]) => l.forEach((n, i) => { const code = String((cl[0] === "3" ? 2101 : 3101) + i * 7), sel = crypto.randomBytes(16).toString("hex");
    eleves.push({nom: n, classe: cl, code}); codes[sanMJPC(n)] = {name: n, classe: cl, createdAt: Date.now(), sel, empreinte: empreinte(code, sel), chiffre: "banc"}; }));
  let qcm = JSON.parse(fs.readFileSync(process.env.BASE, "utf8").replace(/"3 ESSAI"/g, '"3_essai"'));
  const evals = JSON.parse(fs.readFileSync(path.join(BANC, "evals_now.json")));
  const tree = {
    classes: {"3_essai": {nom: "3 ESSAI", niveau: "3e", archivee: false, eleves: noms3}, "4_essai": {nom: "4 ESSAI", niveau: "4e", archivee: false, eleves: noms4}},
    codes,
    qcm: Object.assign({evaluations: evals, settings: {niveaux: [{chrono: 10, id: "facile"}, {chrono: 15, id: "standard"}, {chrono: 20, id: "approfondi"}, {chrono: 30, id: "expert"}]}}, qcm),
    taxonomie: {competences: JSON.parse(fs.readFileSync(process.env.TAXO))}
  };
  qcm.evaluations = Object.assign({}, evals, qcm.evaluations || {});
  console.log("arbre prêt");
  const PORT = 8840 + Math.floor(Math.random() * 50);
  const srv = await startServer(tree, PORT, () => {});
  console.log("serveur", PORT);
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const ouvrir = async (q, w, h) => { const ctx = await navig.newContext({viewport: {width: w || 1536, height: h || 864}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); p.__err = []; p.on("pageerror", e => p.__err.push(e.message)); p.on("dialog", d => { p.__err.push("boîte : " + d.type()); d.dismiss().catch(() => {}); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await pause(2500); return p; };
  const vus = new Map(); let n = 0;
  // tout ce que Paul ou l'élève peut lire : le texte, les options des listes, les infobulles
  const relever = async (p, ecran) => {
    const r = await p.evaluate((src) => { const re = new RegExp(src, "g"), out = [];
      const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
      const t = document.body.innerText.split("\n"); t.forEach(l => { if (re.test(l)) out.push("texte : " + l.trim().slice(0, 160)); re.lastIndex = 0; });
      document.querySelectorAll("select").forEach(s => { if (!vis(s)) return; [...s.options].forEach(o => { if (re.test(o.textContent)) out.push("liste : " + o.textContent.trim().slice(0, 120)); re.lastIndex = 0; }); });
      document.querySelectorAll("[title], [data-bulle], [data-tip]").forEach(e => { const v = e.getAttribute("title") || e.getAttribute("data-bulle") || e.getAttribute("data-tip") || ""; if (re.test(v)) out.push("infobulle : " + v.trim().slice(0, 160)); re.lastIndex = 0; });
      return out; }, BRUT.source);
    r.forEach(l => { const k = ecran + " │ " + l; if (!vus.has(l)) vus.set(l, ecran); });
    await p.screenshot({path: path.join(CAP, String(++n).padStart(2, "0") + "-" + ecran.replace(/[^a-z0-9]+/gi, "-").slice(0, 40) + ".png")});
    console.log("— " + ecran + " : " + r.length + " forme(s) brute(s)"); r.forEach(l => console.log("    " + l));
  };
  const clic = async (p, re) => { const ok = await p.evaluate(([s, f]) => { const r = new RegExp(s, f); const b = [...document.querySelectorAll("button, a, [role=button], [data-va], [data-onglet], .onglet, .tab")].filter(e => e.getBoundingClientRect().width > 0 && !e.disabled && r.test((e.textContent || "").trim())).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!b) return false; document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return true; }, [re.source, re.flags]); if (ok) { await p.click("[data-c='1']").catch(() => {}); await pause(900); } return ok; };
  const prof = await ouvrir("?mode=prof");
  await relever(prof, "console à l'ouverture");
  for (const o of [/^Pilotage$/, /^Données$/, /^Réglages$/]) { if (await clic(prof, o)) await relever(prof, "onglet " + o.source.replace(/[\^$]/g, "")); }
  await clic(prof, /^Données$/);
  const sousOnglets = await prof.evaluate(() => [...document.querySelectorAll("button, [role=tab]")].filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().y < 260).map(e => e.textContent.trim()).filter(t => t && t.length < 40));
  console.log("boutons du haut (Données) :", JSON.stringify(sousOnglets));
  for (const t of sousOnglets) { if (!/Résultats|Sauvegarde|Évaluations|^▸ /.test(t)) continue; await clic(prof, /^Données$/); if (await clic(prof, new RegExp("^" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"))) await relever(prof, "Données › " + t); }
  await clic(prof, /^Pilotage$/);
  const hautP = await prof.evaluate(() => [...document.querySelectorAll("button, [role=tab]")].filter(e => e.getBoundingClientRect().width > 0).map(e => e.textContent.trim()).filter(t => t && t.length < 40));
  console.log("boutons (Pilotage) :", JSON.stringify(hautP));
  for (const t of hautP) { if (!/Évaluations|^▸ /.test(t)) continue; await clic(prof, /^Pilotage$/); if (await clic(prof, new RegExp("^" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"))) await relever(prof, "Pilotage › " + t); }
  await clic(prof, /^Données$/); await clic(prof, /Résultats/);
  if (await clic(prof, /📊 Ouvrir/)) { await relever(prof, "tableau de la séance"); if (await clic(prof, /Lire les copies/)) await relever(prof, "Lire les copies"); }
  // la séance : lancer sur la classe « 3 ESSAI » (par sa valeur, la clé), puis l'appel
  await clic(prof, /^Pilotage$/);
  await prof.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].find(x => x.value === "3_essai"); if (o) { s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); } } }); await pause(400);
  await prof.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].find(x => /Évaluation d'essai|essai/i.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); } } }); await pause(400);
  await relever(prof, "Pilotage, la classe choisie");
  if (await clic(prof, /Lancer la séance/)) { await pause(800); await relever(prof, "l'appel"); await clic(prof, /Lancer la séance/); await pause(1500); await relever(prof, "console, séance lancée"); }
  const tel = await ouvrir("?mode=prof&view=phone", 390, 844); await relever(tel, "téléphone");
  const tab = await ouvrir("?mode=prof&view=board", 1536, 864); await relever(tab, "tableau de la classe");
  const elv = await ouvrir("?mode=eleve", 1280, 800); await relever(elv, "tablette, entrée");
  console.log("\n══ Les formes brutes vues, une fois chacune (écran où elle paraît en premier) ══");
  [...vus.entries()].forEach(([l, e]) => console.log(e + " │ " + l));
  console.log("erreurs de page :", JSON.stringify([prof, tel, tab, elv].flatMap(p => p.__err).slice(0, 5)));
  await navig.close(); await srv.close();
})().catch(e => { console.error(e); process.exit(1); });
