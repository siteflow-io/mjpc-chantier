// Avant / après un clic : la différence de pixels autour de l'élément cliqué
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
const cas = JSON.parse(process.argv[2]); // [[scene, texte du bouton, rang]]
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  for (const [id, txt, rang] of cas) {
    const p = await b.newPage({viewport: {width: 1280, height: 800}});
    await p.goto("file://" + V + "#scene=" + id + "&cap=1"); await p.waitForTimeout(700);
    const el = p.locator(`#root button:has-text("${txt}"), #root .qdf-c:has-text("${txt}")`).nth(rang || 0);
    const bb = await el.boundingBox();
    const clip = {x: Math.max(0, bb.x - 20), y: Math.max(0, bb.y - 20), width: Math.min(1280, bb.width + 40), height: bb.height + 40};
    const a = await p.screenshot({clip});
    const cls0 = await el.evaluate(e => e.className + " | bg=" + getComputedStyle(e).backgroundColor + " border=" + getComputedStyle(e).borderColor + " color=" + getComputedStyle(e).color);
    await el.click(); await p.waitForTimeout(400);
    const z = await p.screenshot({clip});
    const cls1 = await el.evaluate(e => e.className + " | bg=" + getComputedStyle(e).backgroundColor + " border=" + getComputedStyle(e).borderColor + " color=" + getComputedStyle(e).color);
    console.log(id, "«" + txt + "»", a.equals(z) ? "PIXELS IDENTIQUES" : "pixels changés", "\n   avant:", cls0, "\n   après:", cls1);
    const safe = (id + "-" + txt).replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
    require("fs").writeFileSync("clic-" + safe + "-avant.png", a); require("fs").writeFileSync("clic-" + safe + "-apres.png", z);
    await p.close();
  }
  await b.close();
})();
