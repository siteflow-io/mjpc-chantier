const { chromium } = require("/opt/node22/lib/node_modules/playwright");
(async () => {
  const [F, id] = process.argv.slice(2);
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1536, height: 900}});
  await p.goto("file://" + F + "#scene=" + id);
  try { await p.waitForFunction(i => window.SCENE_PRETE === i, id, {timeout: 8000}); } catch(e){}
  const r = await p.evaluate(() => ({t: document.body.innerText, b: Array.from(document.querySelectorAll("button")).map(x => x.innerText.trim() + " ⟨" + (x.getAttribute("title")||"") + "⟩")}));
  console.log(r.t); console.log("---- BOUTONS ----"); console.log(r.b.join("\n"));
  await b.close();
})();
