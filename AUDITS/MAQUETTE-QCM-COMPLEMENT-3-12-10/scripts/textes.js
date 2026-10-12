// Le texte visible de chaque scène (innerText), aux tailles de sa vue, et les title.
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud4/v8.html";
const SC = JSON.parse(fs.readFileSync("/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud4/scenes.json"));
const OUT = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud4/txt";
const TAILLE = {console: [1536, 864], telephone: [390, 844], tablette: [1280, 800], tableau: [1280, 800], eleve: [1280, 800]};
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage();
  for (const sc of SC) {
    const [W, H] = TAILLE[sc.vue];
    await p.setViewportSize({width: W, height: H});
    await p.goto("about:blank");
    await p.goto("file://" + V + "#scene=" + sc.id + "&cap=1");
    await p.waitForFunction(i => window.SCENE_PRETE === i, sc.id, {timeout: 6000}).catch(() => {});
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const root = document.getElementById("root");
      const titres = [...root.querySelectorAll("[title]")].map(e => ({tag: e.tagName.toLowerCase(), lib: (e.innerText || e.value || "").replace(/\s+/g, " ").trim().slice(0, 60), title: e.getAttribute("title")}));
      const tips = [...root.querySelectorAll(".info-tip")].map(e => e.textContent.replace(/\s+/g, " ").trim());
      const iframes = [...root.querySelectorAll("iframe")].map(f => { try { return f.contentDocument.body.innerText; } catch (e) { return "(iframe)"; } });
      return {txt: root.innerText, titres, tips, iframes};
    });
    fs.writeFileSync(`${OUT}/${String(sc.n).padStart(3, "0")}-${sc.id}.json`, JSON.stringify({n: sc.n, id: sc.id, vue: sc.vue, ...r}, null, 1));
  }
  await b.close();
})();
