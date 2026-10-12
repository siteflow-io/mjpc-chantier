// Mise en page de chaque scène, à chaque taille de sa vue : ce qui sort, ce qui est coupé, ce qui se chevauche,
// ce qu'on ne peut pas atteindre, les petits textes, les contrastes faibles.
// usage : node mise.js DEBUT FIN sortie.jsonl
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const fs = require("fs");
const V = "/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/maquette-qcm-v9.html";
const SC = JSON.parse(fs.readFileSync("/home/user/mjpc-chantier/MANDATS/MAQUETTE-QCM-COMPLETE/lecture/scenes.json"));
const [d, f, out] = [+process.argv[2], +process.argv[3], process.argv[4]];
const TAILLES = {console: [[1366, 768], [1536, 864], [1920, 1080]], telephone: [[390, 844]], tablette: [[1280, 800]], tableau: [[1280, 800], [1920, 1080]], eleve: [[1280, 800], [390, 844]]};

const MESURE = () => {
  const root = document.getElementById("root");
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05; };
  const nom = e => e.tagName.toLowerCase() + (typeof e.className === "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
  const court = s => (s || "").replace(/\s+/g, " ").trim().slice(0, 60);
  const R = {W: innerWidth, H: innerHeight, docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, horsFenetreH: [], inatteignable: [], coupe: [], sort: [], chevauche: [], petit: [], contraste: [], mots: []};
  // 1. fenêtres fixes plus hautes que l'écran, sans défilement
  root.querySelectorAll("*").forEach(e => {
    const cs = getComputedStyle(e);
    if (cs.position === "fixed" && vis(e)) {
      const r = e.getBoundingClientRect();
      // le contenu le plus bas, dans cette fenêtre fixe
      let bas = 0; e.querySelectorAll("*").forEach(x => { if (vis(x)) { const rx = x.getBoundingClientRect(); if (rx.height < 4000) bas = Math.max(bas, rx.bottom); } });
      let scrolleur = false; let x = e; e.querySelectorAll("*").forEach(y => { const c = getComputedStyle(y); if (/(auto|scroll)/.test(c.overflowY) && y.scrollHeight > y.clientHeight + 2) scrolleur = true; });
      if (/(auto|scroll)/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 2) scrolleur = true;
      if (bas > innerHeight + 2 && !scrolleur) R.inatteignable.push(nom(e) + " : contenu jusqu'à y=" + Math.round(bas) + " pour une fenêtre de " + innerHeight + ", rien ne défile");
    }
  });
  // 2. textes : coupés, sortis de leur boîte, hors de la fenêtre, petits, contrastés, chevauchés
  const boite = e => { let x = e; while (x && x !== root) { const cs = getComputedStyle(x); const fond = !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor); const bord = parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderLeftWidth) > 0 && parseFloat(cs.borderRightWidth) > 0; if (x.tagName === "BUTTON" || fond || bord) return x; x = x.parentElement; } return null; };
  const lum = c => { const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const fondDe = e => { let x = e; const couches = []; while (x) { const cs = getComputedStyle(x); if (cs.backgroundImage !== "none") return null; const c = (cs.backgroundColor.match(/[\d.]+/g) || []).map(Number); if (c.length && (c.length < 4 || c[3] > 0)) { couches.push(c); if (c.length < 4 || c[3] >= 0.99) break; } x = x.parentElement; } let base = [255, 255, 255]; for (let i = couches.length - 1; i >= 0; i--) { const c = couches[i], a = c.length > 3 ? c[3] : 1; base = [0, 1, 2].map(k => c[k] * a + base[k] * (1 - a)); } return base; };
  const lignes = [];
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) {
    const t = n.textContent.trim(); if (!t) continue;
    const pe = n.parentElement; if (!pe || !vis(pe) || pe.closest(".info-tip, .deco, script, style, .som-gear")) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const rects = [...rg.getClientRects()].filter(r => r.width > 1 && r.height > 1); if (!rects.length) continue;
    const cs = getComputedStyle(pe);
    if (/\bundefined\b|\bNaN\b|\[object|\bnull\b/.test(t)) R.mots.push("« " + court(t) + " »");
    const fsz = parseFloat(cs.fontSize); if (fsz < 12) R.petit.push(fsz.toFixed(1) + " px « " + court(t) + " » " + nom(pe));
    // coupé : un ancêtre proche en overflow hidden plus petit que le texte
    let a = pe, k = 0; while (a && a !== root && k < 4) { const c = getComputedStyle(a); if ((c.overflowX !== "visible" || c.overflowY !== "visible" || c.textOverflow === "ellipsis") && (a.scrollWidth > a.clientWidth + 1 || a.scrollHeight > a.clientHeight + 2) && !/(auto|scroll)/.test(c.overflowY + c.overflowX)) { R.coupe.push("« " + court(a.innerText) + " » " + nom(a) + " " + a.clientWidth + "×" + a.clientHeight + " pour " + a.scrollWidth + "×" + a.scrollHeight); break; } a = a.parentElement; k++; }
    const B = boite(pe);
    if (B) { const b = B.getBoundingClientRect(); for (const r of rects) if (r.right > b.right + 2 || r.left < b.left - 2 || r.bottom > b.bottom + 3 || r.top < b.top - 3) { R.sort.push("« " + court(t) + " » sort de " + nom(B) + " de " + Math.round(Math.max(r.right - b.right, b.left - r.left, r.bottom - b.bottom, b.top - r.top)) + " px"); break; } }
    for (const r of rects) if (r.right > innerWidth + 1 || r.left < -1) { R.horsFenetreH.push("« " + court(t) + " » x=" + Math.round(r.left) + "→" + Math.round(r.right)); break; }
    const col = (cs.color.match(/[\d.]+/g) || []).map(Number); const fd = fondDe(pe);
    if (fd && col.length && !pe.closest("button:disabled, .ferme-env, [disabled]")) { const ac = col.length > 3 ? col[3] : 1; const c2 = [0, 1, 2].map(i => col[i] * ac + fd[i] * (1 - ac)); const l1 = lum(c2), l2 = lum(fd); const cr = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); const grand = fsz >= 24 || (fsz >= 18.6 && +cs.fontWeight >= 700); if (cr < (grand ? 3 : 4.5)) R.contraste.push(cr.toFixed(2) + " « " + court(t) + " » " + fsz.toFixed(0) + "px " + nom(pe)); }
    for (const r of rects) { const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2; if (cy < 0 || cy > innerHeight || cx < 0 || cx > innerWidth) continue; const el = document.elementFromPoint(cx, cy); if (el && (el === pe || pe.contains(el) || el.contains(pe))) lignes.push({r, n, t: court(t)}); }
  }
  for (let i = 0; i < lignes.length; i++) for (let j = i + 1; j < lignes.length; j++) { const A = lignes[i], Bb = lignes[j]; if (A.n === Bb.n) continue; const ix = Math.min(A.r.right, Bb.r.right) - Math.max(A.r.left, Bb.r.left), iy = Math.min(A.r.bottom, Bb.r.bottom) - Math.max(A.r.top, Bb.r.top); if (ix > 3 && iy > 4) R.chevauche.push("« " + A.t + " » × « " + Bb.t + " »"); }
  for (const k of ["coupe", "sort", "petit", "contraste", "horsFenetreH", "chevauche"]) R[k] = [...new Set(R[k])];
  return R;
};

(async () => {
  const b = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const w = fs.createWriteStream(out, {flags: "a"});
  for (const sc of SC.slice(d, f)) for (const [W, H] of TAILLES[sc.vue]) {
    const p = await b.newPage({viewport: {width: W, height: H}});
    await p.goto("file://" + V + "#scene=" + sc.id);
    await p.waitForFunction(i => window.SCENE_PRETE === i, sc.id, {timeout: 6000}).catch(() => {});
    await p.waitForTimeout(400);
    let m; try { m = await p.evaluate(MESURE); } catch (e) { m = {err: String(e).slice(0, 200)}; }
    // et en bas de page, pour les textes du bas (les mesures 1 et 2 portent sur ce qui est dans la fenêtre)
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(150);
    let m2; try { m2 = await p.evaluate(MESURE); } catch (e) { m2 = {}; }
    for (const k of ["coupe", "sort", "chevauche", "contraste", "petit", "horsFenetreH"]) if (m2[k]) m[k] = [...new Set((m[k] || []).concat(m2[k]))];
    w.write(JSON.stringify({n: sc.n, id: sc.id, vue: sc.vue, taille: W + "x" + H, ...m}) + "\n");
    await p.close();
  }
  w.end(); await b.close();
})();
