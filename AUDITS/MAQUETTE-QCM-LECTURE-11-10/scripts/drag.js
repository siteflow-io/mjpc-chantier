const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
const OUT = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud3/drag";
const [id, src, dst, nom] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1536, height: 864}});
  await p.goto("file://" + V + "#scene=" + id + "&cap=1"); await p.waitForTimeout(900);
  const S = p.locator(".tab-mini-m", {hasText: src}).first(), D = dst === "VIDE" ? p.locator(".tab-mini-m.vide").first() : p.locator(".tab-mini-m", {hasText: dst}).first();
  await S.dragTo(D); await p.waitForTimeout(500);
  console.log((await p.evaluate(() => [...document.querySelectorAll(".tab-mini")].map(t => t.innerText.replace(/\s+/g, " ")).join(" | "))).slice(0, 900));
  console.log(await p.evaluate(() => { const r = document.querySelector(".refus-excl"); return r ? r.innerText : "pas de refus"; }));
  await p.screenshot({path: OUT + "/" + nom + ".png", fullPage: true});
  await b.close();
})();
