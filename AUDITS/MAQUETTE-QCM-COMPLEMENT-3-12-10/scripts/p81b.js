const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud4/v8.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 390, height: 844}, deviceScaleFactor: 1});
  await p.goto("file://" + V + "#scene=" + (process.argv[2] || "p-corr-apres")); await p.waitForTimeout(900);
  const el = p.locator("#root :text('Sur les tablettes, avant la correction')").first();
  await el.scrollIntoViewIfNeeded(); const bb = await el.boundingBox();
  // masquer le texte pour lire le fond, puis le remettre
  const clip = {x: Math.max(0,bb.x), y: bb.y, width: Math.min(bb.width, 370), height: bb.height};
  await el.evaluate(e => e.style.visibility = "hidden"); const fond = await p.screenshot({clip});
  require("fs").writeFileSync("p81-fond.png", fond);
  await b.close();
})();
