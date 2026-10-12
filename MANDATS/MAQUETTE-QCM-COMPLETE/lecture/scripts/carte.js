// Carte des gestes de la v7 : pour chaque scène, chaque élément cliquable, ce que fait un clic.
// usage : node carte.js INDEX_DEBUT INDEX_FIN sortie.jsonl
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
const SC = JSON.parse(fs.readFileSync("/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/lecture/scenes.json"));
const [d, f, out] = [+process.argv[2], +process.argv[3], process.argv[4]];
const TAILLE = {console: [1536, 864], telephone: [390, 844], tablette: [1280, 800], tableau: [1280, 800], eleve: [1280, 800]};

const LISTER = () => {
  const root = document.getElementById("root");
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const lib = e => { const c = e.cloneNode(true); c.querySelectorAll(".info-i,.info-tip").forEach(x => x.remove()); return (c.textContent || "").replace(/\s+/g, " ").trim().slice(0, 90); };
  const cands = [];
  const vus = new Set();
  root.querySelectorAll("button, input, select, textarea, a, .tel-el, .qdf-c, [role=button]").forEach(e => { if (!e.closest(".som-gear, .sommaire")) { cands.push(e); vus.add(e); } });
  root.querySelectorAll("*").forEach(e => {
    if (vus.has(e) || e.closest("button, a, .tel-el, .qdf-c, .som-gear, .sommaire, .info-tip")) return;
    if (getComputedStyle(e).cursor === "pointer" && !(e.parentElement && getComputedStyle(e.parentElement).cursor === "pointer" && !e.parentElement.matches("#root"))) { cands.push(e); vus.add(e); }
  });
  return cands.map((e, k) => {
    e.setAttribute("data-k", k);
    const r = e.getBoundingClientRect(), t = e.closest("[title]");
    return {k, tag: e.tagName.toLowerCase(), cls: (typeof e.className === "string" ? e.className : "").slice(0, 60), type: e.type || null,
      lib: lib(e) || e.value || e.placeholder || e.getAttribute("aria-label") || "", title: t ? t.getAttribute("title") : null,
      va: e.getAttribute("data-va"), local: e.hasAttribute("data-local"), dis: !!e.disabled, vis: vis(e),
      ptr: getComputedStyle(e).cursor === "pointer", x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height)};
  });
};
const EMPREINTE = () => { const r = document.getElementById("root"); let s = r.innerHTML; r.querySelectorAll("input, textarea, select").forEach(e => { s += "|" + e.value + (e.checked ? "1" : "0"); }); let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return {h, txt: r.innerText}; };

async function charger(p, id) {
  await p.goto("about:blank");
  await p.goto("file://" + V + "#scene=" + id + "&cap=1");
  await p.waitForFunction(i => window.SCENE_PRETE === i, id, {timeout: 5000}).catch(() => {});
  await p.waitForTimeout(250);
}
function diffTxt(a, b) {
  const A = a.split("\n"), B = b.split("\n"); const sa = new Set(A), sb = new Set(B);
  return {plus: B.filter(x => !sa.has(x) && x.trim()).slice(0, 4).map(x => x.slice(0, 120)), moins: A.filter(x => !sb.has(x) && x.trim()).slice(0, 4).map(x => x.slice(0, 120))};
}

(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const w = fs.createWriteStream(out, {flags: "a"});
  for (const sc of SC.slice(d, f)) {
    const [W, H] = TAILLE[sc.vue];
    const p = await b.newPage({viewport: {width: W, height: H}});
    await p.addInitScript(() => { window.__ouvert = []; window.open = function (u) { window.__ouvert.push(String(u)); return null; }; window.close = function () { window.__ouvert.push("window.close"); }; window.print = function () { window.__ouvert.push("window.print"); }; });
    p.on("dialog", dlg => dlg.dismiss().catch(() => {}));
    await charger(p, sc.id);
    const liste = await p.evaluate(LISTER);
    for (const c of liste) {
      c.res = null;
      if (c.dis || !c.vis) { w.write(JSON.stringify({n: sc.n, id: sc.id, vue: sc.vue, ...c}) + "\n"); continue; }
      if (c.va) { c.res = {aller: c.va}; w.write(JSON.stringify({n: sc.n, id: sc.id, vue: sc.vue, ...c}) + "\n"); continue; }
      await charger(p, sc.id);
      await p.evaluate(LISTER);
      const avant = await p.evaluate(EMPREINTE);
      const el = await p.$(`[data-k="${c.k}"]`);
      let err = null;
      try {
        if (c.tag === "input" && /text|search|number|password|email|^$/.test(c.type || "") || c.tag === "textarea") { await el.click({timeout: 800}); await p.keyboard.type("7a"); }
        else if (c.tag === "select") { const vals = await el.evaluate(s => [...s.options].map(o => o.value)); const cur = await el.evaluate(s => s.value); const autre = vals.find(v => v !== cur); if (autre !== undefined) await el.selectOption(autre, {timeout: 800}); }
        else await el.click({timeout: 800, force: false});
      } catch (e) { err = String(e).split("\n")[0].slice(0, 160); }
      await p.waitForTimeout(350);
      const hash = await p.evaluate(() => location.hash);
      const ap = await p.evaluate(EMPREINTE);
      const ouvert = await p.evaluate(() => window.__ouvert);
      const m = /scene=([^&]+)/.exec(hash); const dest = m ? decodeURIComponent(m[1]) : null;
      c.res = {aller: dest !== sc.id ? dest : null, change: ap.h !== avant.h, ouvert: ouvert.length ? ouvert : null, err};
      if (c.res.change && !c.res.aller) c.res.diff = diffTxt(avant.txt, ap.txt);
      w.write(JSON.stringify({n: sc.n, id: sc.id, vue: sc.vue, ...c}) + "\n");
      if (dest !== sc.id) { /* la scène a changé : on recharge au tour suivant */ }
    }
    await p.close();
    process.stdout.write(sc.n + " ");
  }
  w.end(); await b.close();
})();
