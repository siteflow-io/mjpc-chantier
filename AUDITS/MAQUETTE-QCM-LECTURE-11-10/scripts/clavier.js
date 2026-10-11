const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport: {width: 1280, height: 800}});
  await p.goto("file://" + V + "#scene=t-login"); await p.waitForTimeout(700);
  const info = await p.evaluate(() => { const k = [...document.querySelectorAll("#root *")].find(e => e.children.length === 0 && e.textContent.trim() === "z"); return k ? {tag: k.tagName, cls: k.className, cursor: getComputedStyle(k).cursor, parent: k.parentElement.tagName + "." + k.parentElement.className} : null; });
  console.log("touche z :", JSON.stringify(info));
  const avant = await p.evaluate(() => [...document.querySelectorAll("#root input")].map(i => i.value).join("|"));
  await p.locator("#root :text-is('z')").first().click(); await p.locator("#root :text-is('7')").first().click(); await p.waitForTimeout(300);
  const apres = await p.evaluate(() => [...document.querySelectorAll("#root input")].map(i => i.value).join("|"));
  console.log("champs avant :", avant, "\nchamps après z et 7 :", apres);
  await b.close();
})();
