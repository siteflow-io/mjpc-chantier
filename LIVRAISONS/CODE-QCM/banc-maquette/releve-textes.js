// Le relevé des textes de la maquette (absents du site), par scène, sur les vues de Paul : la matière de textes-console.json (outils/textes-console.py).
//   node banc/releve-textes.js <maquette-qcm-vN.html> <sortie.json>
const path = require("path"), fs = require("fs");
const B = __dirname + "/";
const G3 = require(B + "gardes3.js");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const F = path.resolve(process.argv[2]), OUT = process.argv[3];
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1366, height: 768}});
  await p.goto("file://" + F + "#scene=c-evals"); await p.waitForTimeout(500);
  const scenes = await p.evaluate(() => window.LISTE_SCENES);
  const K = G3.classement(); const tous = new Map(); const fen = [];
  for(const sc of scenes){
    if(!["console","telephone"].includes(sc.vue)) continue;
    const H = sc.vh ? Math.max(sc.vh, 768) : (sc.vue === "telephone" ? 844 : 768);
    await p.setViewportSize({width: sc.vue === "telephone" ? 390 : 1366, height: H});
    await p.goto("about:blank"); await p.goto("file://" + F + "#scene=" + sc.id + "&cap=1");
    await p.waitForFunction(i => window.SCENE_PRETE === i, sc.id, {timeout: 8000}).catch(() => {});
    await p.waitForTimeout(150);
    const lu = await p.evaluate(G3.lireTextes9);
    for(const x of lu.textes){ if(x.eleve || x.geste) continue; if(G3.dansSite(x.t) || G3.estDonnee(x.t) || (x.t.match(/\p{L}/gu) || []).length < 3) continue;
      const k = G3.formeTexte(x.t); if(!tous.has(k)) tous.set(k, {texte: x.t, scenes: [], cls: x.cls}); tous.get(k).scenes.push(sc.id); }
    lu.fenetres.forEach(f => fen.push(sc.id + " | " + f.titre + " | " + f.corps.join(" ¶ ").slice(0, 200)));
  }
  fs.writeFileSync(OUT, JSON.stringify([...tous.values()], null, 1));
  fs.writeFileSync(OUT + ".fen.txt", fen.join("\n"));
  console.log(tous.size, "textes");
  await b.close();
})();
