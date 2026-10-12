// QCM-4 · BANC — la référence de la fidélité : chaque scène de la maquette v9 (MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html),
// à la taille de son appareil, relevée (texte, gestes, infobulles) → banc/reference/maquette-v9.json. Se refait si la maquette change.
//   node LIVRAISONS/CODE-QCM/banc/releve-maquette.js
const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const { releve } = require("./releve");
const RACINE = path.resolve(__dirname, "..", "..", "..");
const MAQ = path.join(RACINE, "MANDATS", "MAQUETTE-QCM-COMPLETE", "maquette-qcm-v9.html");
const VUES = {tablette: [1280, 800], console: [1536, 864], telephone: [390, 844], tableau: [1280, 800], eleve: [1280, 800]};
(async () => {
  const t0 = Date.now();
  const md5 = crypto.createHash("md5").update(fs.readFileSync(MAQ)).digest("hex");
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const url = "file://" + MAQ;
  const p0 = await b.newPage(); await p0.goto(url); await p0.waitForFunction(() => window.SCENE_PRETE);
  const scenes = await p0.evaluate(() => window.LISTE_SCENES); await p0.close();
  const out = {maquette: path.relative(RACINE, MAQ), md5, quand: new Date().toISOString(), scenes: []};
  for(const sc of scenes){
    const [w, h] = VUES[sc.vue] || VUES.console;
    const p = await b.newPage({viewport: {width: w, height: sc.vh || h}});
    await p.goto(url + "#scene=" + sc.id + "&cap=1");
    await p.waitForFunction(id => window.SCENE_PRETE === id, sc.id, {timeout: 15000}).catch(() => {});
    await p.waitForTimeout(100);
    const r = await releve(p);
    out.scenes.push(Object.assign({n: sc.n, id: sc.id, vue: sc.vue, appareil: sc.appareil, section: sc.section, titre: sc.titre, moment: sc.moment}, r));
    await p.close();
  }
  await b.close();
  fs.writeFileSync(path.join(__dirname, "reference", "maquette-v9.json"), JSON.stringify(out, null, 1));
  console.log(out.scenes.length + " scènes relevées, maquette md5 " + md5 + ", en " + Math.round((Date.now() - t0) / 1000) + " s");
})().catch(e => { console.error(e); process.exit(1); });
