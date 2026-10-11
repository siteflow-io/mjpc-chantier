// Pour chaque scène : un texte ou un geste visible au-delà du bas (ou de la droite) de sa zone, que rien ne fait défiler jusqu'à lui.
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs");
const V = "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/v7.html";
const SC = JSON.parse(fs.readFileSync("/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/aud2/lecture/scenes.json"));
const TAILLES = {console: [[1366, 768], [1536, 864]], telephone: [[390, 844]], tablette: [[1280, 800]], tableau: [[1280, 800], [1920, 1080]], eleve: [[1280, 800], [390, 844]]};
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage();
  for (const sc of SC) for (const [W, H] of TAILLES[sc.vue]) {
    await p.setViewportSize({width: W, height: H});
    await p.goto("about:blank"); await p.goto("file://" + V + "#scene=" + sc.id);
    await p.waitForFunction(i => window.SCENE_PRETE === i, sc.id, {timeout: 6000}).catch(() => {});
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const out = [];
      const pageScroll = document.documentElement.scrollHeight > innerHeight + 2 && getComputedStyle(document.body).overflowY !== "hidden" && getComputedStyle(document.documentElement).overflowY !== "hidden";
      document.querySelectorAll("#root *").forEach(e => {
        if (e.children.length > 0 && !/^(BUTTON|INPUT|TEXTAREA|SELECT)$/.test(e.tagName)) { if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return; }
        const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none") return;
        const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
        // ancêtres : celui qui coupe (overflow non visible) ou qui défile
        let a = e.parentElement, coupe = null, defile = false, fixe = false;
        while (a && a.id !== "root") { const c = getComputedStyle(a); if (c.position === "fixed") fixe = true; if (/(auto|scroll)/.test(c.overflowY) && a.scrollHeight > a.clientHeight + 1) { defile = true; break; } if (c.overflowY !== "visible" || c.overflowX !== "visible") { const ra = a.getBoundingClientRect(); if (r.top >= ra.bottom - 1 || r.left >= ra.right - 1) { coupe = a; break; } } a = a.parentElement; }
        const txt = (e.innerText || e.value || e.placeholder || "").replace(/\s+/g, " ").trim().slice(0, 50); if (!txt) return;
        if (coupe && !defile) out.push("caché par " + coupe.className.toString().split(" ")[0] + " : « " + txt + " »");
        else if (!defile && r.top >= innerHeight - 1 && (fixe || !pageScroll)) out.push("sous le bas de l'écran (y=" + Math.round(r.top) + ") : « " + txt + " »");
      });
      return [...new Set(out)];
    });
    if (r.length) console.log(sc.n, sc.id, W + "x" + H, r.length, "\n   " + r.slice(0, 6).join("\n   "));
  }
  await b.close();
})();
