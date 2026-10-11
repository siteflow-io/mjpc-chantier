const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs");
const corpus = fs.readFileSync(process.argv[3], "utf8");
const norm = s => s.replace(/’/g, "'").replace(/\s+/g, " ").trim();
(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const p = await b.newPage({viewport:{width:1536,height:864}});
  const base = "file://" + process.argv[2];
  await p.goto(base); await p.waitForTimeout(800);
  const scenes = await p.evaluate(() => (window.LISTE_SCENES||[]).filter(s => ["console","telephone"].includes(s.vue)).map(s => s.id));
  const vus = new Map();
  for (const id of scenes) {
    await p.goto(base + "#scene=" + id); await p.reload(); await p.waitForTimeout(200);
    const t = await p.evaluate(() => { const out = []; const docs = [document, ...[...document.querySelectorAll("iframe")].map(f => { try { return f.contentDocument; } catch(e) { return null; } }).filter(Boolean)];
      for (const d of docs) for (const e of d.querySelectorAll("p, div, span, li, small, em, i, label, td")) {
        if (e.closest(".som-gear, [data-sommaire], .sommaire, #sommaire")) continue;
        const own = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("").trim();
        const txt = (e.innerText || "").trim();
        if (txt.length >= 70 && own.length >= 20 && getComputedStyle(e).display !== "none") out.push(txt.split("\n")[0]); }
      return out; });
    for (const x of t) { const k = norm(x); if (k.length < 70) continue; if (!vus.has(k)) vus.set(k, []); vus.get(k).push(id); }
  }
  const neufs = [...vus].filter(([k]) => !corpus.includes(k.slice(0, 60)) && !corpus.includes(k.slice(15, 75)));
  console.log(scenes.length + " scènes de Paul ; " + vus.size + " textes longs ; " + neufs.length + " absents du site d'aujourd'hui :");
  for (const [k, l] of neufs) console.log(String(l.length).padStart(3) + " · " + l[0] + " · " + k.slice(0, 230));
  await b.close();
})();
