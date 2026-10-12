// Le relevé d'une version de la maquette (protocole de l'audit, obligation 3) : pour chaque scène, et pour chaque écran
// à paramètres où mène un geste (data-va avec « & »), le texte (cadres compris), une capture, et les destinations des gestes.
// usage : node releve.js <maquette-qcm-vN.html> <dossier>
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs"), path = require("path");
const [V0, OUT] = process.argv.slice(2); const V = path.resolve(V0);
fs.mkdirSync(path.join(OUT, "img"), {recursive: true});
const TAILLES = {console: [[1536, 864]], telephone: [[390, 844]], tablette: [[1280, 800]], tableau: [[1280, 800]], eleve: [[1280, 800], [390, 844]], mjpc: [[1536, 864]]};
const cle = (h, w) => h.replace(/[^A-Za-z0-9=._-]+/g, "_") + "@" + w;
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p0 = await b.newPage(); await p0.goto("file://" + V); await p0.waitForTimeout(1500);
  const scenes = await p0.evaluate(() => window.LISTE_SCENES.map(s => ({id: s.id, vue: s.vue})));
  const vueDe = {}; scenes.forEach(s => vueDe[s.id] = s.vue);
  const SEULES = process.env.SCENES ? process.env.SCENES.split(",") : null;   // pour essayer le relevé sur quelques écrans
  const file = SEULES || scenes.map(s => s.id), vus = new Set(file), textes = {}, aretes = {};
  const pages = {};
  for (let i = 0; i < file.length; i++) {
    const h = file[i], base = h.split("&")[0], vue = vueDe[base] || "console";
    for (const [w, ht] of (TAILLES[vue] || TAILLES.console)) {
      if (!pages[w + "x" + ht]) { const ctx = await b.newContext({viewport: {width: w, height: ht}}); const p = await ctx.newPage();
        await p.addInitScript(() => { window.open = () => null; window.print = () => {}; window.close = () => {}; }); p.on("dialog", d => d.dismiss().catch(() => {})); pages[w + "x" + ht] = p; }
      const p = pages[w + "x" + ht];
      await p.goto("about:blank"); await p.goto("file://" + V + "#scene=" + h);
      await p.waitForFunction(() => window.SCENE_PRETE, null, {timeout: 6000}).catch(() => {});
      await p.waitForTimeout(350);
      const r = await p.evaluate(() => {
        const t = [document.getElementById("root").innerText]; document.querySelectorAll("iframe").forEach(f => { try { t.push(f.contentDocument.body.innerText); } catch (e) {} });
        const va = [...document.querySelectorAll("#root [data-va]")].map(e => [(e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60), e.getAttribute("data-va")]);
        return {t: t.join("\n\f\n"), va};
      });
      const k = cle(h, w);
      textes[k] = r.t; aretes[k] = r.va;
      await p.screenshot({path: path.join(OUT, "img", k + ".png")});
      if (!SEULES) for (const [, d] of r.va) { if (d && d.includes("&") && !vus.has(d)) { vus.add(d); file.push(d); } }
    }
  }
  fs.writeFileSync(path.join(OUT, "textes.json"), JSON.stringify(textes));
  fs.writeFileSync(path.join(OUT, "aretes.json"), JSON.stringify(aretes));
  await b.close();
  console.log(path.basename(V) + " : " + scenes.length + " scènes, " + Math.max(0, file.length - scenes.length) + " écrans à paramètres, " + Object.keys(textes).length + " relevés");
})();
