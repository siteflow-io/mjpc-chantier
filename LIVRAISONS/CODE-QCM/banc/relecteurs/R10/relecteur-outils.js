// R10 : copie de banc/relecteur-outils.js, le faux hub pris dans une copie qui a ses node_modules (ce conteneur)
// Pour un relecteur neuf : ouvrir une page de l'app servie par serveur-relecteurs.js, comme un appareil de la classe.
//   const R = require(".../relecteur-outils.js"); const info = JSON.parse(fs.readFileSync(<fichier de serveur-relecteurs>));
//   const nav = await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
//   const console = await R.ouvrir(nav, info, "?mode=prof", 1536, 864);   // la console de Paul
//   const tablette = await R.ouvrir(nav, info, "?mode=eleve", 1280, 800); // une tablette (chacune dans son propre contexte)
// Chaque page garde ses erreurs dans page.__erreurs (erreurs de page, boîtes système, erreurs écrites par l'app).
const fs = require("fs"), path = require("path");
const FAUX = "/tmp/claude-0/-home-user-mjpc-chantier/52c11395-36cd-5806-b59c-f726fdc82016/scratchpad/banc3";
async function ouvrir(nav, info, q, w, h){
  const ctx = await nav.newContext({viewport: {width: w, height: h}});
  const FAKE = fs.readFileSync(path.join(FAUX, "fakefb.js")), R = fs.readFileSync(path.join(FAUX, "node_modules/react/umd/react.production.min.js")), RD = fs.readFileSync(path.join(FAUX, "node_modules/react-dom/umd/react-dom.production.min.js"));
  await ctx.route("**/*", async route => { const u = route.request().url();
    if(u.startsWith("http://localhost:" + info.port + "/")) return route.continue();
    if(/firebase-app\.js/.test(u)) return route.fulfill({status: 200, contentType: "application/javascript", body: FAKE});
    if(/firebase-database\.js/.test(u)) return route.fulfill({status: 200, contentType: "application/javascript", body: "/* fakefb */"});
    if(/react\.production\.min\.js/.test(u)) return route.fulfill({status: 200, contentType: "application/javascript", body: R});
    if(/react-dom\.production\.min\.js/.test(u)) return route.fulfill({status: 200, contentType: "application/javascript", body: RD});
    const m = u.match(/^https:\/\/[^\/]*(firebasedatabase\.app|firebaseio\.com)(\/[^?]*)?(\?.*)?$/);
    if(m){ const r = await fetch("http://localhost:" + info.rest + (m[2] || "/") + (m[3] || ""), {method: route.request().method(), body: ["GET", "HEAD"].includes(route.request().method()) ? undefined : route.request().postData()});
      return route.fulfill({status: 200, contentType: "application/json", body: await r.text(), headers: {"access-control-allow-origin": "*"}}); }
    return route.abort(); });
  const p = await ctx.newPage(); p.__erreurs = [];
  p.on("pageerror", e => p.__erreurs.push("erreur de page : " + e.message));
  p.on("dialog", d => { p.__erreurs.push("boîte système : " + d.message()); d.dismiss().catch(() => {}); });
  p.on("console", m => { if(m.type() === "error") p.__erreurs.push("l'app écrit : " + m.text().slice(0, 300)); });
  await p.goto(info.adresse + q); await p.waitForTimeout(1200);
  return p;
}
module.exports = { ouvrir };
