// Les textes rendus des maquettes existantes, réunies telles quelles dans maquette-qcm-v1.html (l'étape 1, sans rien changer) :
// c'est, mot pour mot, ce que Paul a vu sur les captures. Le banc les ajoute à ses sources (mandat §8.3).
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1280, height: 800}});
  const url = "file://" + path.join(__dirname, "..", "maquette-qcm-v1.html");
  await p.goto(url); await p.waitForFunction(() => window.SCENE_PRETE);
  const ids = await p.evaluate(() => window.LISTE_SCENES.map(s => s.id));
  const out = [];
  for(const id of ids){
    await p.evaluate(i => location.hash = "#scene=" + i, id);
    await p.waitForFunction(i => window.SCENE_PRETE === i, id);
    const t = await p.evaluate(() => { const a = []; const tw = document.createTreeWalker(document.getElementById("root"), NodeFilter.SHOW_TEXT); let n; while((n = tw.nextNode())) if(n.nodeValue.trim()) a.push(n.nodeValue.trim()); return a.join("\n"); });
    out.push("### " + id + "\n" + t);
  }
  fs.writeFileSync(path.join(__dirname, "corpus-v1.txt"), out.join("\n"));
  console.log(ids.length, "scènes,", out.join("\n").length, "caractères");
  await b.close();
})();
