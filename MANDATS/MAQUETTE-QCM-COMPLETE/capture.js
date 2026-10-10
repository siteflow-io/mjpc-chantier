// Capture chaque scène de la maquette, dans l'ordre de la séance : captures/NN-id.png.
//   node capture.js <maquette-qcm-vN.html> [filtre]
// Tablette 1280×800, l'écran entier ; console 1536 de large (l'écran de Paul à 125 %), toute la page, ou la hauteur de la fenêtre ouverte ;
// téléphone 390 de large, toute la page, à l'échelle 2 ; tableau 1280×800 ; élève hors séance 1280 de large, toute la page.
const path = require("path"), fs = require("fs"), crypto = require("crypto");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const FICHIER = path.resolve(process.argv[2]);
const seul = process.argv[3] || null;
const OUT = process.env.OUT || path.join(__dirname, "captures");
// Les écrans identiques voulus : t-fin est, par définition, le retour à « Combien êtes-vous ? » (cadrage 64)
const VOULU = {"t-fin": true};
const VUES = {
  tablette:  {w: 1280, h: 800, full: false, dsf: 1},
  console:   {w: 1536, h: 864, full: true,  dsf: 1},
  telephone: {w: 390,  h: 844, full: true,  dsf: 2},
  tableau:   {w: 1280, h: 800, full: false, dsf: 1},
  eleve:     {w: 1280, h: 800, full: true,  dsf: 1}
};
(async () => {
  if(!seul){ fs.rmSync(OUT, {recursive: true, force: true}); }
  fs.mkdirSync(OUT, {recursive: true});
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const url = "file://" + FICHIER;
  const p0 = await b.newPage(); await p0.goto(url); await p0.waitForFunction(() => window.SCENE_PRETE);
  const scenes = await p0.evaluate(() => window.LISTE_SCENES); await p0.close();
  const empreintes = {}, liste = [];
  for(const sc of scenes){
    const nom = String(sc.n).padStart(3, "0") + "-" + sc.id + ".png";
    liste.push({n: sc.n, id: sc.id, fichier: nom, vue: sc.vue, section: sc.section, titre: sc.titre});
    if(seul && !sc.id.includes(seul)) continue;
    const V = VUES[sc.vue];
    const page = await b.newPage({viewport: {width: V.w, height: sc.vh || V.h}, deviceScaleFactor: V.dsf});
    await page.goto(url + "#scene=" + sc.id + "&cap=1");
    await page.waitForFunction(id => window.SCENE_PRETE === id, sc.id);
    await page.waitForTimeout(120);
    const f = path.join(OUT, nom);
    await page.screenshot({path: f, fullPage: sc.vh ? false : V.full, animations: "disabled"});
    const md5 = crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex");
    if(empreintes[md5] && !VOULU[sc.id]) console.log("  DOUBLON", nom, "=", empreintes[md5]);
    empreintes[md5] = nom;
    await page.close();
  }
  fs.writeFileSync(path.join(OUT, "liste.json"), JSON.stringify(liste, null, 1));
  console.log(liste.length, "scènes ;", Object.keys(empreintes).length, "captures prises");
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
