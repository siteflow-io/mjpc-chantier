// Audit : textes méta visibles (renvois au cadrage, numéros de points, mots du chantier) dans chaque scène.
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const F = process.argv[2];
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1536, height: 900}});
  await p.goto("file://" + F);
  await p.waitForTimeout(500);
  const scenes = await p.evaluate(() => window.LISTE_SCENES.map(s => s.id));
  const RE = [/\(\s*\d{2,3}(\s*[,à-]\s*\d{2,3})*\s*\)/, /\btour\s+\d{2,3}\b/i, /\bcadrage\b/i, /\bmandat\b/i, /\bmaquette\b/i, /\bdette\b/i, /\bx6\d\d\b/, /\bpoints?\s+\d{3}\b/i, /\bconscience\b/i, /\bexécutant\b/i];
  const out = [];
  for(const id of scenes){
    await p.goto("file://" + F + "#scene=" + id);
    try { await p.waitForFunction(i => window.SCENE_PRETE === i, id, {timeout: 8000}); } catch(e){}
    await p.waitForTimeout(80);
    const t = await p.evaluate(() => Array.from(document.querySelectorAll("[title]")).map(e => e.getAttribute("title")).concat(Array.from(document.querySelectorAll(".info-tip, [data-tip], [data-infobulle]")).map(e => e.textContent || e.getAttribute("data-tip") || e.getAttribute("data-infobulle"))).join("\n"));
    const lignes = t.split("\n");
    for(const l of lignes) for(const re of RE) if(re.test(l)){ out.push(id + " | " + l.trim().slice(0, 200)); break; }
  }
  const uniq = [...new Set(out)];
  console.log(uniq.length + " lignes"); console.log(uniq.join("\n"));
  await b.close();
})();
