const path = require("path");
const { chromium } = require(path.join(__dirname, "../banc/node_modules/playwright"));
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const id of ["x610-1-b-julien","x610-2-b-michel","x610-3-a-correction","x610-6-coeval-laquelle","x610-7-coeval-ecrit"]) {
    const p = await b.newPage({viewport:{width:1280,height:800}});
    await p.goto("file://" + path.join(__dirname, "maquette610.html") + "#scene=" + id);
    await p.waitForFunction(i => window.SCENE_PRETE === i, id);
    const d = await p.evaluate(() => Array.from(document.querySelectorAll(".moitie")).map(m => { const c = m.querySelector(".eleve-page"); return c ? Math.max(0, c.scrollHeight - m.clientHeight) : 0; }));
    console.log(id, d.join(" / "));
    await p.close();
  }
  await b.close();
})();
