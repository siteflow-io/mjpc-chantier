// Capture chaque scène de la maquette, dans l'ordre : tablette 1280×800 (écran entier), console 1440×900 (page entière).
const path = require("path"), fs = require("fs");
const { chromium } = require(path.join(__dirname, "../banc/node_modules/playwright"));
const OUT = path.join(__dirname, "captures"); fs.mkdirSync(OUT, {recursive: true});
const seul = process.argv[2] || null;
(async () => {
  const browser = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const url = "file://" + path.join(__dirname, "maquette.html");
  const p0 = await browser.newPage();
  const erreurs = [];
  p0.on("pageerror", e => erreurs.push(e.message));
  await p0.goto(url);
  const scenes = await p0.evaluate(() => window.LISTE_SCENES);
  await p0.close();
  let n = 0;
  for(const sc of scenes){
    n++;
    if(seul && !sc.id.includes(seul)) continue;
    const vw = sc.vue === "tablette" ? {width: 1280, height: 800} : {width: 1440, height: 900};
    const page = await browser.newPage({viewport: vw, deviceScaleFactor: 1});
    page.on("pageerror", e => erreurs.push(sc.id + " : " + e.message));
    await page.goto(url + "#scene=" + sc.id);
    await page.waitForFunction(id => window.SCENE_PRETE === id, sc.id);
    await page.waitForTimeout(150);
    const nom = String(n).padStart(2, "0") + "-" + sc.id + ".png";
    await page.screenshot({path: path.join(OUT, nom), fullPage: sc.vue !== "tablette", animations: "disabled"});
    // une moitié qui déborde de l'écran : on le dit
    if(sc.vue === "tablette"){
      const deb = await page.evaluate(() => Array.from(document.querySelectorAll(".moitie")).map(m => { const c = m.querySelector(".eleve-page"); return c ? Math.max(0, c.scrollHeight - m.clientHeight) : 0; }));
      if(deb.some(x => x > 0)) console.log("  DÉBORDE", sc.id, deb.join(" / "), "px");
    }
    console.log(nom);
    await page.close();
  }
  if(erreurs.length) console.log("ERREURS :\n" + erreurs.join("\n"));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
