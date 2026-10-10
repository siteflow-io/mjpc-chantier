// Capture chaque scène de la maquette, dans l'ordre.
// Tablette 1280×800 (écran entier) ; console 1440 de large (page entière, ou hauteur fixe pour une fenêtre) ;
// téléphone 390 de large, page entière, à l'échelle 2 (lisible) ; tableau 1280×800 ; élève hors séance 1280 de large, page entière.
const path = require("path"), fs = require("fs");
const { chromium } = require(path.join(__dirname, "../banc/node_modules/playwright"));
const OUT = path.join(__dirname, "captures628"); fs.mkdirSync(OUT, {recursive: true});
const seul = process.argv[2] || null;
const VUES = {
  tablette:  {w: 1280, h: 800, full: false, dsf: 1},
  console:   {w: 1440, h: 900, full: true,  dsf: 1},
  telephone: {w: 390,  h: 844, full: true,  dsf: 2},
  tableau:   {w: 1280, h: 800, full: false, dsf: 1},
  eleve:     {w: 1280, h: 800, full: true,  dsf: 1}
};
(async () => {
  const browser = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const url = "file://" + path.join(__dirname, "maquette628.html");
  const p0 = await browser.newPage();
  const erreurs = [];
  p0.on("pageerror", e => erreurs.push(e.message));
  await p0.goto(url);
  const scenes = await p0.evaluate(() => window.LISTE_SCENES);
  await p0.close();
  let n = 0;
  for(const sc of scenes){
    if(!sc.id.startsWith("x628-")) continue;
    const V = VUES[sc.vue];
    const page = await browser.newPage({viewport: {width: V.w, height: sc.vh || V.h}, deviceScaleFactor: V.dsf});
    page.on("pageerror", e => erreurs.push(sc.id + " : " + e.message));
    await page.goto(url + "#scene=" + sc.id);
    await page.waitForFunction(id => window.SCENE_PRETE === id, sc.id);
    await page.waitForTimeout(150);
    const nom = sc.id.replace("x628-", "628-") + ".png";
    await page.screenshot({path: path.join(OUT, nom), fullPage: sc.vh ? false : V.full, animations: "disabled"});
    // une moitié qui déborde de l'écran : on le dit
    if(sc.vue === "tablette"){
      const deb = await page.evaluate(() => Array.from(document.querySelectorAll(".moitie")).map(m => { const c = m.querySelector(".eleve-page"); return c ? Math.max(0, c.scrollHeight - m.clientHeight) : 0; }));
      if(deb.some(x => x > 0)) console.log("  DÉBORDE", sc.id, deb.join(" / "), "px");
    }
    // une fenêtre plus haute que la capture : on le dit
    if(sc.vh){
      const m = await page.evaluate(() => { const x = document.querySelector(".modal, .checkin-modal, .sessions-menu"); return x ? Math.max(0, x.scrollHeight - x.clientHeight) : 0; });
      if(m > 0) console.log("  FENÊTRE COUPÉE", sc.id, m, "px");
    }
    console.log(nom);
    await page.close();
  }
  if(erreurs.length) console.log("ERREURS :\n" + erreurs.join("\n"));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
