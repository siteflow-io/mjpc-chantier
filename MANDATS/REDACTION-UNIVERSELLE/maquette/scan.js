// =====================================================================
// RU-SCAN — CORRIGER SUR LA COPIE SCANNÉE (cadrage C13, 29-30/10/2026, tours 371 à 399)
// =====================================================================
// Le paquet scanné (PDF ou photos) reste dans ce navigateur (IndexedDB) : jamais au site, jamais au hub.
// Au hub : la grille (config/grille2), les pages sans leur image (scan/<classe>/pages/<id> : élève, ordre, lignes),
// les marques et les réponses dans la copie (copies/<classe>/<élève>.scan), les retours des élèves (retours/<classe>/<élève>).
// Une page a pour identité l'empreinte de son image : remettre le même PDF, sur n'importe quel ordinateur, ramène ses marques.
// Une marque est un objet : un id né une fois, l'horodatage, la page et la place sur la page (jamais un rang).
const SC = { grille: null, passes: [], passe: 0, copies: [], ic: 0, ip: 0, iq: 0, pages: {}, imgs: {}, sel: null, outil: null, annule: [],
  attrib: false, ia: 0, trace: null, champ: null, retours: {}, ir: 0, actif: 0, ouvert: false, dbp: null };
const SC_COUL = { 0: "#c54040", 1: "#c47820", 2: "#5a8a32", 3: "#3a6e1c" };
const SC_FOND = { 0: "#f4b0b0", 1: "#f5c98a", 2: "#a8d088", 3: "#7eb55c" };
const SC_CRIT = { langue: "#c54040", theme: "#2f5d8a", construction: "#1f7a72", organisation: "#7a3f8f", etoile: "#c08a4a" };
const SC_PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
function scId(p) { return p + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8); }
function scChemin(x) { return ["redactions", RU.id, "scan", RU.classe].concat(x || []); }
function scCheminRetours(x) { return ["redactions", RU.id, "retours", RU.classe].concat(x || []); }
// jamais de copie sans élève : une clé vide écrirait par-dessus toute la classe au hub (piège payé au banc du 30/10)
function scCopie(k) { if (!k || !state.classe.some(n => eleveId(n) === k)) return { marques: {}, rep: {}, chrono: {}, vu: {} }; const c = state.copies[k] = state.copies[k] || {}; c.scan = c.scan || {}; const s = c.scan; s.marques = s.marques || {}; s.rep = s.rep || {}; s.chrono = s.chrono || {}; return s; }
function scLong() { const n = Number(SUJET && SUJET.longueur); return n > 0 ? n : 30; }
// ── la mémoire du navigateur : les images des pages ──
function scDb() { return SC.dbp || (SC.dbp = new Promise((res, rej) => { const r = indexedDB.open("mjpc_scans", 1); r.onupgradeneeded = () => r.result.createObjectStore("pages", { keyPath: "id" }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); })); }
function scDbFaire(mode, f) { return scDb().then(db => new Promise((res, rej) => { const t = db.transaction("pages", mode); const st = t.objectStore("pages"); let out; const q = f(st); if (q) q.onsuccess = () => { out = q.result; }; t.oncomplete = () => res(out); t.onerror = () => rej(t.error); })); }
function scDbMettre(o) { return scDbFaire("readwrite", st => st.put(o)); }
function scDbTout() { return scDbFaire("readonly", st => st.getAll()); }
// ── ouvrir l'écran ──
function scOuvrir() {
  if (!RU.id || !RU.classe) { toast("Choisis d'abord la classe."); return; }
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  Promise.all([ruLire(["redactions", RU.id, "config", "grille2"]), ruLire(scChemin(["pages"])), ruLire(scCheminRetours()), scDbTout().catch(() => [])]).then(([g, pg, rt, loc]) => {
    if (!g || !g.criteres) { toast("Ce sujet n'a pas encore de grille à cases : la correction sur les scans attend sa grille."); return; }
    SC.grille = g; SC.pages = pg || {}; SC.retours = rt || {};
    const L = g.criteres.find(c => c.id === "langue");
    SC.passes = [{ id: "langue", nom: L ? L.nom : "La langue", pts: L ? L.points : [], crit: "langue" }]
      .concat(g.criteres.filter(c => c.id !== "langue").map(c => ({ id: c.id, nom: c.nom, pts: c.points, crit: c.id })))
      .concat([{ id: "retours", nom: "Les retours des élèves", pts: [], crit: "retours" }]);
    Object.values(SC.imgs).forEach(u => { try { URL.revokeObjectURL(u.url); } catch (e) {} }); SC.imgs = {};
    (loc || []).forEach(o => { if (o && o.blob) SC.imgs[o.id] = { url: URL.createObjectURL(o.blob), w: o.w, h: o.h, blob: o.blob }; });
    scCopiesOrdre(); SC.ouvert = true; SC.actif = Date.now();
    document.getElementById("scanEcran").classList.remove("hidden"); document.body.classList.add("sc-ouvert");
    SC.attrib = scPagesSans().length > 0; SC.ia = 0;
    scRendre();
  });
}
function scFermer() { scChrono(); SC.ouvert = false; scChampFermer(true); document.getElementById("scanEcran").classList.add("hidden"); document.body.classList.remove("sc-ouvert"); saveState(); if (typeof renderDashboard === "function") renderDashboard(); }
function scPagesOrdre() { return Object.values(SC.pages).filter(p => p && p.id).sort((a, b) => (a.ordre || 0) - (b.ordre || 0)); }
function scPagesSans() { return scPagesOrdre().filter(p => !p.eleve && !p.blanche); }
function scPagesDe(k) { return scPagesOrdre().filter(p => p.eleve === k && !p.blanche); }
function scCopiesOrdre() { const vu = []; scPagesOrdre().forEach(p => { if (p.eleve && !p.blanche && vu.indexOf(p.eleve) < 0) vu.push(p.eleve); }); SC.copies = vu; if (SC.ic >= vu.length) SC.ic = Math.max(0, vu.length - 1); }
function scManquantes() { return scPagesOrdre().filter(p => !SC.imgs[p.id]); }
// ── charger le paquet (PDF ou photos) : tout reste dans ce navigateur ──
function scCharger(ev) {
  const fs = Array.from(ev.target.files || []); ev.target.value = ""; if (!fs.length) return;
  let ordre = scPagesOrdre().reduce((m, p) => Math.max(m, p.ordre || 0), 0);
  const nouvelles = []; let n = 0;
  const traiter = cv => scPage(cv).then(o => { n++; scTemoinCharge("Page " + n + " lue…");
    const ex = SC.pages[o.id];
    SC.imgs[o.id] = { url: URL.createObjectURL(o.blob), w: o.w, h: o.h, blob: o.blob };
    const meta = ex || { id: o.id, eleve: null, ordre: ++ordre, blanche: o.blanche, lignes: o.lignes, w: o.w, h: o.h, creeLe: new Date().toISOString() };
    if (!ex) { SC.pages[o.id] = meta; nouvelles.push(meta); ruEcrire(scChemin(["pages", o.id]), meta, "une page du paquet"); }
    return scDbMettre({ id: o.id, red: RU.id, classe: RU.classe, blob: o.blob, w: o.w, h: o.h, le: new Date().toISOString() }); });
  let ch = Promise.resolve();
  fs.forEach(f => { ch = ch.then(() => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name) ? scLirePdf(f, traiter) : scLireImage(f).then(traiter)); });
  ch.then(() => { scCopiesOrdre(); SC.attrib = scPagesSans().length > 0; SC.ia = 0; scTemoinCharge("");
    toast(n + " page" + (n > 1 ? "s" : "") + " lue" + (n > 1 ? "s" : "") + (nouvelles.length < n ? " · " + (n - nouvelles.length) + " déjà connue" + (n - nouvelles.length > 1 ? "s" : "") + " : leurs marques reviennent" : ""));
    scRendre(); }, e => { scTemoinCharge(""); toast("⚠ Ce fichier n'a pas pu être lu."); console.error(e); });
}
function scTemoinCharge(t) { const e = document.getElementById("scCharge"); if (e) e.textContent = t; }
function scLireImage(f) { return createImageBitmap(f).then(b => { const k = Math.min(1, 1800 / b.height); const cv = document.createElement("canvas"); cv.width = Math.round(b.width * k); cv.height = Math.round(b.height * k); cv.getContext("2d").drawImage(b, 0, 0, cv.width, cv.height); return cv; }); }
function scPdfJs() { if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib); return new Promise((res, rej) => { const s = document.createElement("script"); s.src = SC_PDFJS + "pdf.min.js"; s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = SC_PDFJS + "pdf.worker.min.js"; res(window.pdfjsLib); }; s.onerror = rej; document.head.appendChild(s); }); }
function scLirePdf(f, traiter) {
  return Promise.all([scPdfJs(), f.arrayBuffer()]).then(([lib, buf]) => lib.getDocument({ data: buf }).promise).then(doc => {
    let ch = Promise.resolve();
    for (let i = 1; i <= doc.numPages; i++) ch = ch.then(() => doc.getPage(i)).then(pg => { const v0 = pg.getViewport({ scale: 1 }); const v = pg.getViewport({ scale: 1800 / v0.height });
      const cv = document.createElement("canvas"); cv.width = Math.round(v.width); cv.height = Math.round(v.height);
      return pg.render({ canvasContext: cv.getContext("2d"), viewport: v }).promise.then(() => traiter(cv)); });
    return ch;
  });
}
// une page : son empreinte (son identité), ses lignes écrites, page blanche ou non, l'image en JPEG
function scPage(cv) {
  const p = document.createElement("canvas"); p.width = 16; p.height = 16; const pc = p.getContext("2d"); pc.drawImage(cv, 0, 0, 16, 16);
  const d = pc.getImageData(0, 0, 16, 16).data; const g = []; for (let i = 0; i < 256; i++) g.push(d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]);
  const moy = g.reduce((a, b) => a + b, 0) / 256; let hex = ""; for (let i = 0; i < 256; i += 4) { let v = 0; for (let j = 0; j < 4; j++) v = v * 2 + (g[i + j] > moy ? 1 : 0); hex += v.toString(16); }
  const id = "page_" + hex + "_" + cv.width.toString(36) + cv.height.toString(36);
  const lig = scLignes(cv);
  return new Promise(res => cv.toBlob(b => res({ id, blob: b, w: cv.width, h: cv.height, lignes: lig, blanche: lig.n === 0 }), "image/jpeg", 0.82));
}
// les lignes écrites (mesuré le 30/10 sur une copie de l'an dernier : 30 sur 30, à 1 pixel près) : l'encre plus sombre que le papier autour,
// la réglure (longues traînées horizontales) retirée, le profil ligne par ligne ; le début et la fin de l'écriture de chaque ligne
function scLignes(src) {
  const W = 540, H = Math.round(src.height * W / src.width); const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const cx = cv.getContext("2d"); cx.drawImage(src, 0, 0, W, H); const d = cx.getImageData(0, 0, W, H).data;
  const lum = new Float32Array(W * H), rouge = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) { const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2]; lum[i] = (r + g + b) / 3; rouge[i] = (r > g + 30 && r > b + 30) ? 1 : 0; }
  const I = new Float64Array((W + 1) * (H + 1)); for (let y = 0; y < H; y++) { let s = 0; for (let x = 0; x < W; x++) { s += lum[y * W + x]; I[(y + 1) * (W + 1) + x + 1] = I[y * (W + 1) + x + 1] + s; } }
  const R = 10, encre = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const x0 = Math.max(0, x - R), x1 = Math.min(W, x + R + 1), y0 = Math.max(0, y - R), y1 = Math.min(H, y + R + 1);
    const m = (I[y1 * (W + 1) + x1] - I[y0 * (W + 1) + x1] - I[y1 * (W + 1) + x0] + I[y0 * (W + 1) + x0]) / ((x1 - x0) * (y1 - y0)); encre[y * W + x] = (lum[y * W + x] < m - 16 && !rouge[y * W + x]) ? 1 : 0; }
  for (let y = 0; y < H; y++) { let x = 0; while (x < W) { if (!encre[y * W + x]) { x++; continue; } let e = x; while (e < W && encre[y * W + e]) e++; if (e - x >= 35) for (let k = x; k < e; k++) { encre[y * W + k] = 0; if (y > 0) encre[(y - 1) * W + k] = 0; if (y < H - 1) encre[(y + 1) * W + k] = 0; } x = e; } }
  const bx = Math.round(W * 0.02), ex = Math.round(W * 0.97);
  const prof = new Float32Array(H); for (let y = 0; y < H; y++) { let s = 0; for (let x = bx; x < ex; x++) s += encre[y * W + x]; prof[y] = s; }
  const lis = new Float32Array(H); const sg = 3; for (let y = 0; y < H; y++) { let s = 0, w = 0; for (let k = -9; k <= 9; k++) { const yy = y + k; if (yy < 0 || yy >= H) continue; const c = Math.exp(-k * k / (2 * sg * sg)); s += prof[yy] * c; w += c; } lis[y] = s / w; }
  const tri = Array.from(lis).sort((a, b) => a - b); const p95 = tri[Math.floor(H * 0.95)] || 0; const seuil = Math.max(2.5, 0.25 * p95);
  const pics = []; for (let y = 8; y < H - 8; y++) { if (lis[y] < seuil) continue; let mx = true; for (let k = -8; k <= 8; k++) if (lis[y + k] > lis[y]) { mx = false; break; } if (mx && (!pics.length || y - pics[pics.length - 1] > 8)) pics.push(y); }
  const L = pics.map(y => { const col = new Float32Array(W); for (let yy = Math.max(0, y - 8); yy < Math.min(H, y + 5); yy++) for (let x = bx; x < ex; x++) col[x] += encre[yy * W + x];
    let a = -1, b = -1; for (let x = bx; x < ex; x++) { let s = 0; for (let k = -3; k <= 3; k++) s += col[Math.min(W - 1, Math.max(0, x + k))]; if (s > 1.5) { if (a < 0) a = x; b = x; } }
    return { y: +(y / H).toFixed(4), x0: +((a < 0 ? bx : a) / W).toFixed(4), x1: +((b < 0 ? ex : b) / W).toFixed(4) }; });
  const ecarts = L.slice(1).map((l, i) => l.y - L[i].y).sort((a, b) => a - b); const pas = ecarts.length ? ecarts[Math.floor(ecarts.length / 2)] : 0.03;
  return { n: L.length, pas: +pas.toFixed(4), l: L };
}
// ── les initiales : chaque page dans l'ordre où elle est dans le paquet ──
function scAttribuer(k) {
  const p = scPagesOrdre()[SC.ia]; if (!p) return;
  p.eleve = k; p.modifieLe = new Date().toISOString(); ruEcrire(scChemin(["pages", p.id]), p, "la page de " + nomEleveDe(k));
  scCopiesOrdre(); state.paquetOrdre = SC.copies.slice(); saveState();
  scAttribSuivante();
}
function scAttribSuivante() { const L = scPagesOrdre(); let i = SC.ia + 1; while (i < L.length && L[i].blanche) i++; SC.ia = i; if (i >= L.length) { SC.attrib = scPagesSans().length > 0; SC.ia = 0; if (!SC.attrib) toast("Toutes les pages ont leur élève."); } scRendre(); }
function scPrecedentEleve() { const L = scPagesOrdre(); for (let i = SC.ia - 1; i >= 0; i--) if (L[i].eleve && !L[i].blanche) return L[i].eleve; return null; }
function scBlanche(v) { const p = scPagesOrdre()[SC.ia]; if (!p) return; p.blanche = v; if (v) p.eleve = null; ruEcrire(scChemin(["pages", p.id]), p, "une page blanche"); scCopiesOrdre(); if (v) scAttribSuivante(); else scRendre(); }
// ── la grille : questions sautées, cases calculées ──
function scQ(pt, i) { return pt.questions.find(q => q.id === i); }
function scSautee(q, rep) { if (!q.saute) return false; const [t, i] = q.saute.split(":"); return t === "n" ? rep[i] === "n" : rep[i] === "o"; }
function scQuestions(pt, rep) { return pt.questions.filter(q => !scSautee(q, rep || {})); }
function scFautes(k) { return Object.values(scCopie(k).marques).filter(m => m.forme === "faute"); }
function scLignesCopie(k) { const s = scCopie(k); if (s.lignes != null) return s.lignes; return scPagesDe(k).reduce((n, p) => n + ((p.lignes && p.lignes.n) || 0), 0); }
function scCase(pt, k) {
  const s = scCopie(k); const rep = s.rep[pt.id] || {};
  if (pt.calcul) {
    const n = scLignesCopie(k); if (!n) return null; const e = scFautes(k).length;
    const r = pt.calcul === "lignes" ? n / scLong() : e / n;
    const c = pt.cases.find(c => { const m = /^calc:\w+:([\d.]+)-([\d.]+)$/.exec(c.si); return m && r >= +m[1] && r <= +m[2]; });
    return c ? { c, txt: c.fait.replace("{n}", n).replace("{e}", e), complet: !!s.vu && !!s.vu[scPasseDe(pt)] } : null;
  }
  const qs = scQuestions(pt, rep); const complet = qs.every(q => rep[q.id] === "o" || rep[q.id] === "n");
  const non = i => rep[i] === "n" && !scSautee(scQ(pt, i), rep), oui = i => rep[i] === "o" && !scSautee(scQ(pt, i), rep);
  const ok = c => { const si = c.si; if (si === "tout") return qs.every(q => rep[q.id] !== "n");
    let m = /^([no]):(\d+)$/.exec(si); if (m) return m[1] === "n" ? non(+m[2]) : oui(+m[2]);
    m = /^k(>=|=)(\d+):([\d,]+)$/.exec(si); if (m) { const nb = m[3].split(",").filter(i => non(+i)).length; return m[1] === "=" ? nb === +m[2] : nb >= +m[2]; } return false; };
  const ms = pt.cases.filter(ok); if (!ms.length) return null;
  const c = ms.reduce((a, b) => b.niveau < a.niveau ? b : a, ms[0]);
  const lab = pt.questions.filter(q => non(q.id) && q.etiquette).map(q => q.etiquette);
  const liste = lab.length > 1 ? lab.slice(0, -1).join(", ") + " et " + lab[lab.length - 1] : (lab[0] || "");
  const txt = c.fait.replace("{…}", liste).replace("{n}", liste).replace(/\{[^}]*\|[^}]*\}/, liste);
  return { c, txt, tache: (c.tache || "").replace("{n}", liste), complet };
}
function scPasseDe(pt) { const p = SC.passes.find(p => p.pts.indexOf(pt) >= 0); return p ? p.id : ""; }
function scTousPoints() { return SC.grille ? SC.grille.criteres.reduce((a, c) => a.concat(c.points.map(p => Object.assign({ crit: c.id, critNom: c.nom }, p))), []) : []; }
function scNote(k) { let n = 0, tot = 0, ok = true; SC.grille.criteres.forEach(c => c.points.forEach(pt => { tot += pt.poids; const r = scCase(pt, k); if (!r || !r.complet) ok = false; else n += pt.bareme[String(r.c.niveau)]; })); return { n, tot, ok }; }
// ── le parcours d'une passe : point, question ──
function scP() { return SC.passes[SC.passe]; }
function scK() { return SC.copies[SC.ic]; }
function scPt() { const P = scP(); return P && P.pts[SC.ip]; }
function scEtapes(k) { if (!k) return []; const P = scP(), rep = scCopie(k).rep; const L = []; P.pts.forEach((pt, ip) => { if (pt.calcul) L.push({ ip, iq: -1 }); else scQuestions(pt, rep[pt.id]).forEach(q => L.push({ ip, iq: q.id })); }); return L; }
function scRepondre(v) {
  const k = scK(), pt = scPt(); if (!k || !pt) return; scToucher();
  const s = scCopie(k);
  if (pt.calcul) { scAvancer(); return; }
  if (v === "o" && Object.values(s.marques).some(m => m.point === pt.id && m.q === SC.iq && m.sens === "non")) v = "n";   // Entrée passe ; la marque « non » posée reste un non
  s.rep[pt.id] = s.rep[pt.id] || {}; s.rep[pt.id][SC.iq] = v; saveState(); scAvancer();
}
function scAvancer() {
  const k = scK(); const L = scEtapes(k); const i = L.findIndex(e => e.ip === SC.ip && e.iq === SC.iq);
  if (i >= 0 && i < L.length - 1) { SC.ip = L[i + 1].ip; SC.iq = L[i + 1].iq; SC.outil = null; scRendre(); return; }
  const s = scCopie(k); s.vu = s.vu || {}; s.vu[scP().id] = true; saveState();
  if (SC.ic < SC.copies.length - 1) scAllerCopie(SC.ic + 1); else { toast("Dernière copie du paquet : « " + scP().nom + " » est fait pour tout le paquet."); scRendre(); }
}
function scReculer() { const L = scEtapes(scK()); const i = L.findIndex(e => e.ip === SC.ip && e.iq === SC.iq); if (i > 0) { SC.ip = L[i - 1].ip; SC.iq = L[i - 1].iq; scRendre(); } }
function scAllerCopie(i) { scChrono(); SC.ic = Math.max(0, Math.min(SC.copies.length - 1, i)); const L = scEtapes(scK() || ""); SC.ip = L.length ? L[0].ip : 0; SC.iq = L.length ? L[0].iq : -1; SC.sel = null; SC.outil = null; scChampFermer(); scRendre(); }
function scAllerPasse(i) { scChrono(); SC.passe = i; SC.ir = 0; scAllerCopie(SC.ic); }
// le chrono : le temps passé sur chaque copie, passe par passe (une minute sans geste ne compte pas)
function scToucher() { const t = Date.now(); if (SC.actif && SC.ouvert && scK() && scP()) { const s = scCopie(scK()); s.chrono[scP().id] = (s.chrono[scP().id] || 0) + Math.min(60000, t - SC.actif); } SC.actif = t; }
function scChrono() { scToucher(); }
// ── le pinceau : la forme vient de ce que tu montres ──
function scOutil() {
  if (SC.outil === "etoile") return { forme: "etoile", sens: "lieu", coul: SC_CRIT.etoile };
  const P = scP(), pt = scPt(); if (!P || !pt) return null;
  if (P.id === "langue" && pt.calcul === "fautes") return { forme: "faute", sens: "lieu", coul: SC_CRIT.langue };
  const q = pt.calcul ? null : scQ(pt, SC.iq); const m = q && q.marque;
  return { forme: m ? m.forme : "encadre", sens: m ? m.sens : "lieu", coul: SC_CRIT[P.crit] || "#6b1a2a" };
}
function scCurseur(coul) { const s = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><path d='M12 1v22M1 12h22' stroke='${coul}' stroke-width='2'/><circle cx='12' cy='12' r='2.5' fill='none' stroke='${coul}'/></svg>`; return `url("data:image/svg+xml,${encodeURIComponent(s)}") 12 12, crosshair`; }
function scLigneDe(p, y) { const L = p.lignes && p.lignes.l; if (!L || !L.length) return -1; let b = 0; L.forEach((l, i) => { if (Math.abs(l.y - y) < Math.abs(L[b].y - y)) b = i; }); return Math.abs(L[b].y - y) < (p.lignes.pas || 0.03) * 0.75 ? b : -1; }
// le tracé posé : calé sur les lignes quand l'appli les a trouvées
function scCaler(m, p) {
  const L = p.lignes && p.lignes.l, pas = (p.lignes && p.lignes.pas) || 0.03;
  const ya = Math.min(m.y0, m.y1), yb = Math.max(m.y0, m.y1), xa = Math.min(m.x0, m.x1), xb = Math.max(m.x0, m.x1);
  m.x0 = xa; m.x1 = xb; m.y0 = ya; m.y1 = yb;
  const la = scLigneDe(p, ya + (yb - ya) * (m.forme === "surligne" || m.forme === "etoile" || m.forme === "marge" ? 0 : 0.5)), lb = scLigneDe(p, yb);
  if (m.forme === "marge") { m.x0 = 0.015; m.x1 = 0.03; if (la >= 0) m.y0 = L[la].y - pas * 0.5; if (lb >= 0) m.y1 = L[lb].y + pas * 0.35; m.l0 = la; m.l1 = lb; return m; }
  if (la < 0) { m.l0 = m.l1 = null; return m; }
  if (m.forme === "surligne" || m.forme === "etoile") { m.l0 = la; m.l1 = lb >= la ? lb : la; m.y0 = L[m.l0].y - pas * 0.48; m.y1 = L[m.l1].y + pas * 0.3; return m; }
  m.l0 = m.l1 = la; m.y0 = L[la].y - pas * 0.45; m.y1 = L[la].y + pas * 0.28; return m;
}
function scSegments(m, p) {   // un surlignage sur plusieurs lignes suit les lignes, du mot où tu as appuyé au mot où tu as lâché
  const L = p.lignes && p.lignes.l, pas = (p.lignes && p.lignes.pas) || 0.03;
  if (!(m.forme === "surligne" || m.forme === "etoile") || m.l0 == null || m.l1 == null || m.l1 === m.l0 || !L) return [[m.x0, m.y0, m.x1, m.y1]];
  const S = []; for (let l = m.l0; l <= m.l1; l++) { const a = l === m.l0 ? m.x0 : Math.min(L[l].x0, 0.12), b = l === m.l1 ? m.x1 : Math.max(L[l].x1, 0.9); S.push([a, L[l].y - pas * 0.48, b, L[l].y + pas * 0.3]); }
  return S;
}
function scMarquesPage(pid) { const k = scK(); if (!k) return []; return Object.values(scCopie(k).marques).filter(m => m.page === pid); }
function scVisible(m) { const P = scP(); if (!P) return false; if (P.id === "langue") return m.passe === "langue"; return m.passe === P.id; }
function scSvgMarque(m, p, sel) {
  const W = 1000, H = Math.round(1000 * p.h / p.w); const X = x => (x * W).toFixed(1), Y = y => (y * H).toFixed(1);
  const coul = m.forme === "faute" ? SC_CRIT.langue : m.forme === "etoile" ? SC_CRIT.etoile : (SC_CRIT[m.passe] || "#6b1a2a");
  let s = `<g class="sc-m${sel ? " sel" : ""}" data-id="${m.id}">`;
  if (m.forme === "faute") s += `<rect x="${X(m.x0)}" y="${Y(m.y0)}" width="${X(m.x1 - m.x0)}" height="${Y(m.y1 - m.y0)}" fill="transparent"/><line x1="${X(m.x0)}" y1="${Y(m.y1)}" x2="${X(m.x1)}" y2="${Y(m.y1)}" stroke="${coul}" stroke-width="4" stroke-linecap="round"/>`;
  else if (m.forme === "encadre") s += `<rect x="${X(m.x0)}" y="${Y(m.y0)}" width="${X(m.x1 - m.x0)}" height="${Y(m.y1 - m.y0)}" rx="4" fill="${coul}14" stroke="${coul}" stroke-width="3"/>`;
  else if (m.forme === "marge") s += `<rect x="${X(m.x0)}" y="${Y(m.y0)}" width="${X(m.x1 - m.x0)}" height="${Y(m.y1 - m.y0)}" rx="5" fill="${coul}"/>`;
  else scSegments(m, p).forEach(r => { s += `<rect x="${X(r[0])}" y="${Y(r[1])}" width="${X(r[2] - r[0])}" height="${Y(r[3] - r[1])}" fill="${coul}40"/>`; });
  if (m.forme === "faute" && m.num) s += `<circle cx="${X(m.x1)}" cy="${Y(m.y0) - 2}" r="11" fill="${coul}"/><text x="${X(m.x1)}" y="${+Y(m.y0) + 3}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui">${m.num}</text>`;
  if (sel) { s += `<rect x="${X(m.x0) - 3}" y="${Y(m.y0) - 3}" width="${X(m.x1 - m.x0) + 6}" height="${+Y(m.y1 - m.y0) + 6}" fill="none" stroke="#2b2520" stroke-dasharray="6 4" stroke-width="1.5"/>`;
    [["a", m.x0, m.y0], ["b", m.x1, m.y1]].forEach(([h, x, y]) => { s += `<rect class="sc-poignee" data-p="${h}" x="${X(x) - 7}" y="${Y(y) - 7}" width="14" height="14" fill="#fff" stroke="#2b2520" stroke-width="2"/>`; }); }
  return s + "</g>";
}
// les fautes de la copie, numérotées dans l'ordre de la copie ; la banque des formes du paquet, numérotée à la première rencontre
function scBanque() { const vu = {}; const L = []; SC.copies.forEach(k => Object.values(scCopie(k).marques).filter(m => m.forme === "faute" && m.bonne).sort((a, b) => a.creeLe < b.creeLe ? -1 : 1).forEach(m => { if (!vu[m.bonne]) { vu[m.bonne] = { forme: m.bonne, copies: new Set(), le: m.creeLe }; L.push(vu[m.bonne]); } vu[m.bonne].copies.add(k); })); return L.sort((a, b) => a.le < b.le ? -1 : 1); }
function scNumeroter(k) { const pg = scPagesDe(k).map(p => p.id); scFautes(k).sort((a, b) => (pg.indexOf(a.page) - pg.indexOf(b.page)) || (a.y0 - b.y0) || (a.x0 - b.x0)).forEach((m, i) => { m.num = i + 1; }); }
// ── poser, déplacer, effacer, annuler ──
function scPoser(m) { const k = scK(); m.id = scId("marque"); m.eleve = k; m.creeLe = m.modifieLe = new Date().toISOString(); scCopie(k).marques[m.id] = m; SC.annule.push({ t: "pose", k, id: m.id });
  if (m.q != null && m.point && (m.sens === "non" || m.sens === "oui")) { const s = scCopie(k); s.rep[m.point] = s.rep[m.point] || {}; s.rep[m.point][m.q] = m.sens === "non" ? "n" : "o"; }
  scNumeroter(k); saveState(); return m; }
function scEffacer(id) { const k = scK(); const s = scCopie(k); const m = s.marques[id]; if (!m) return; SC.annule.push({ t: "efface", k, m: JSON.parse(JSON.stringify(m)) }); delete s.marques[id]; SC.sel = null; scNumeroter(k); saveState(); scRendre(); }
function scAnnuler() { const a = SC.annule.pop(); if (!a) { toast("Rien à annuler."); return; } const s = scCopie(a.k);
  if (a.t === "pose") delete s.marques[a.id]; else if (a.t === "efface") s.marques[a.m.id] = a.m; else if (a.t === "change") s.marques[a.m.id] = a.m;
  SC.sel = null; scNumeroter(a.k); saveState(); scRendre(); }
function scPointeur(ev) {
  const pg = ev.target.closest(".sc-page"); if (!pg || SC.attrib || scP().id === "retours") return; const p = SC.pages[pg.dataset.p]; if (!p) return;
  const r = pg.getBoundingClientRect(); const at = e => ({ x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) });
  const a = at(ev); scToucher(); scChampFermer(true);
  const g = ev.target.closest(".sc-m"), poi = ev.target.closest(".sc-poignee");
  if (g) {   // une marque : la sélectionner ; la tirer la déplace ; ses poignées la redimensionnent
    const m = scCopie(scK()).marques[g.dataset.id]; if (!m) return; SC.sel = m.id; const avant = JSON.parse(JSON.stringify(m)); let bouge = false;
    const mv = e => { const b = at(e); bouge = true; if (poi) { if (poi.dataset.p === "a") { m.x0 = b.x; m.y0 = b.y; } else { m.x1 = b.x; m.y1 = b.y; } } else { const dx = b.x - a.x, dy = b.y - a.y; m.x0 = avant.x0 + dx; m.x1 = avant.x1 + dx; m.y0 = avant.y0 + dy; m.y1 = avant.y1 + dy; } scDessinerPages(); };
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); if (bouge) { scCaler(m, p); m.modifieLe = new Date().toISOString(); SC.annule.push({ t: "change", k: scK(), m: avant }); scNumeroter(scK()); saveState(); } scRendre(); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up); ev.preventDefault(); scRendre(); return;
  }
  const o = scOutil(); if (!o) return; SC.sel = null;
  SC.trace = { page: p.id, x0: a.x, y0: a.y, x1: a.x, y1: a.y, forme: o.forme };
  const mv = e => { const b = at(e); SC.trace.x1 = b.x; SC.trace.y1 = b.y; scDessinerPages(); };
  const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); const t = SC.trace; SC.trace = null; if (!t) return;
    if (Math.abs(t.x1 - t.x0) < 0.012 && Math.abs(t.y1 - t.y0) < 0.008) { t.x0 -= 0.045; t.x1 += 0.045; }   // un clic sans glisser : la taille d'un mot
    const P = scP(), pt = scPt();
    const m = scCaler({ page: t.page, forme: o.forme, sens: o.sens, passe: o.forme === "faute" || o.forme === "etoile" ? "langue" : P.id, point: o.forme === "etoile" ? "etoile" : pt && pt.id, q: pt && !pt.calcul && o.forme !== "etoile" ? SC.iq : null, x0: t.x0, y0: t.y0, x1: t.x1, y1: t.y1, bonne: null }, p);
    scPoser(m); SC.sel = m.id; if (o.forme === "etoile") SC.outil = null; scRendre(); if (o.forme === "faute") scChampOuvrir(m); };
  addEventListener("pointermove", mv); addEventListener("pointerup", up); ev.preventDefault();
}
// le champ de la bonne forme, sous la faute : une forme neuve, ou son numéro dans la banque du paquet
function scChampOuvrir(m) {
  scChampFermer(false); const pg = document.querySelector(`.sc-page[data-p="${m.page}"]`); if (!pg) return;
  const d = document.createElement("div"); d.className = "sc-champ"; d.style.left = (m.x0 * 100) + "%"; d.style.top = (m.y1 * 100 + 1) + "%";
  d.innerHTML = `<span>bonne forme :</span><input id="scChampIn" autocomplete="off" spellcheck="false" title="Tape la bonne forme, ou son numéro dans les formes déjà vues, puis Entrée. Entrée seule : la faute reste, sans bonne forme (l'élève te l'enverra à relire).">`;
  pg.appendChild(d); SC.champ = { id: m.id, el: d };
  const inp = d.querySelector("input"); inp.value = m.bonne || ""; setTimeout(() => inp.focus(), 0);
  inp.addEventListener("keydown", e => { e.stopPropagation();
    if (e.key === "Enter") { e.preventDefault(); scChampFermer(true); scRendre(); }
    else if (e.key === "Escape") { e.preventDefault(); scChampFermer(false); scRendre(); } });
}
// fermer le champ : ce qui est tapé est gardé (Échap seul l'abandonne) ; un numéro reprend la forme du paquet
function scChampFermer(garder) {
  const c = SC.champ; SC.champ = null; if (!c) return; const inp = c.el && c.el.querySelector("input");
  if (garder !== false && inp && scK()) { const v = inp.value.trim(); const mm = scCopie(scK()).marques[c.id];
    if (mm && v !== (mm.bonne || "")) { const B = scBanque(); mm.bonne = /^\d{1,3}$/.test(v) && B[+v - 1] ? B[+v - 1].forme : (v || null); mm.modifieLe = new Date().toISOString(); saveState(); } }
  if (c.el) c.el.remove();
}
// ── le clavier ──
function scClavier(e) {
  if (!SC.ouvert) return; const a = document.activeElement; const ecrit = a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA");
  if (SC.attrib) { if (!ecrit) { if (e.key === "ArrowRight") { e.preventDefault(); scAttribSuivante(); } } return; }
  if (ecrit) return;
  const P = scP(); scToucher();
  if (e.key === "?") { e.preventDefault(); scAide(); return; }
  if (e.key === "Escape") { e.preventDefault(); if (document.getElementById("scModale").classList.contains("show")) { scModaleFermer(); return; } SC.sel = null; SC.outil = null; scRendre(); return; }
  if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) { e.preventDefault(); scAnnuler(); return; }
  if (e.key === "Delete" && SC.sel) { e.preventDefault(); scEffacer(SC.sel); return; }
  if (P.id === "retours") { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scVerdict("bon"); } else if (e.key === "n" || e.key === "N") { e.preventDefault(); scVerdict("arefaire"); } else if (e.key === "ArrowRight") { e.preventDefault(); SC.ir++; scRendre(); } else if (e.key === "ArrowLeft") { e.preventDefault(); SC.ir = Math.max(0, SC.ir - 1); scRendre(); } return; }
  if (e.key === "ArrowRight") { e.preventDefault(); scAllerCopie(SC.ic + 1); return; }
  if (e.key === "ArrowLeft") { e.preventDefault(); scAllerCopie(SC.ic - 1); return; }
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scRepondre("o"); return; }
  if (e.key === "n" || e.key === "N") { e.preventDefault(); if (!scPt() || scPt().calcul) return; scRepondre("n"); return; }
  if (e.key === "Backspace") { e.preventDefault(); scReculer(); return; }
}
document.addEventListener("keydown", scClavier);
// ── le rendu : le haut, la copie, le panneau, le paquet ──
function scRendre() {
  const E = document.getElementById("scanEcran"); if (!E || !SC.ouvert) return;
  if (SC.passe >= SC.passes.length) SC.passe = 0;
  const L = scEtapes(scK() || ""); if (scK() && !L.some(e => e.ip === SC.ip && e.iq === SC.iq) && L.length) { SC.ip = L[0].ip; SC.iq = L[0].iq; }
  const P = scP(), k = scK();
  document.getElementById("scPasses").innerHTML = SC.passes.map((p, i) => { const fait = p.id === "retours" ? scRetoursListe().filter(r => r.etat).length + " / " + scRetoursListe().length : SC.copies.filter(c => (scCopie(c).vu || {})[p.id]).length + " / " + SC.copies.length;
    return `<button class="sc-passe${i === SC.passe ? " on" : ""}" style="--c:${SC_CRIT[p.crit] || "#6b1a2a"}" onclick="scAllerPasse(${i})" title="${p.id === "retours" ? "Relire ce que les élèves t'ont renvoyé, case par case : Entrée, c'est bon ; N, à refaire." : "Passer toutes les copies sur « " + escapeAttr(p.nom) + " » : un critère à la fois, les copies défilent."}"><i>${i + 1}</i>${escapeHtml(p.nom)}<b>${fait}</b></button>`; }).join("");
  const ch = k && P ? (scCopie(k).chrono[P.id] || 0) : 0; document.getElementById("scChrono").textContent = "⏱ " + Math.floor(ch / 60000) + ":" + String(Math.floor(ch / 1000) % 60).padStart(2, "0") + " sur cette copie";
  const man = scManquantes(); document.getElementById("scManque").innerHTML = man.length ? `⚠ ${man.length} page${man.length > 1 ? "s" : ""} de ce paquet ne ${man.length > 1 ? "sont" : "est"} pas dans ce navigateur : remets ton paquet (clé USB) avec « Charger le paquet ». Les marques reviendront d'elles-mêmes.` : "";
  scDessinerPages(); scPanneau(); scPaquet();
}
function scPagesAffichees() { if (SC.attrib) { const p = scPagesOrdre()[SC.ia]; return p ? [p] : []; } const k = scK(); return k ? scPagesDe(k) : []; }
function scDessinerPages() {
  const Z = document.getElementById("scCopie"); const ps = scPagesAffichees(); const P = scP();
  if (!ps.length) { Z.innerHTML = `<div class="sc-vide">${Object.keys(SC.pages).length ? "Aucune copie à afficher." : "Charge ton paquet scanné (PDF ou photos) : il reste dans ce navigateur, jamais au site."}</div>`; return; }
  if (P.id === "retours" && !SC.attrib) { scDessinerRetour(Z); return; }
  const W = Z.clientWidth - 16, H = Z.clientHeight - 12; const somme = ps.reduce((a, p) => a + p.w / p.h, 0); const h = Math.min(H, W / somme);
  const o = scOutil(); const curseur = SC.attrib ? "default" : scCurseur(o ? o.coul : "#6b1a2a");
  let html = ""; const champ = SC.champ ? SC.champ.id : null;
  ps.forEach(p => { const im = SC.imgs[p.id]; const Hs = Math.round(1000 * p.h / p.w);
    let svg = ""; if (!SC.attrib) { const ms = scMarquesPage(p.id).filter(scVisible); ms.forEach(m => { svg += scSvgMarque(m, p, m.id === SC.sel); }); }
    if (SC.trace && SC.trace.page === p.id) { const t = SC.trace; svg += `<rect x="${Math.min(t.x0, t.x1) * 1000}" y="${Math.min(t.y0, t.y1) * Hs}" width="${Math.abs(t.x1 - t.x0) * 1000}" height="${Math.abs(t.y1 - t.y0) * Hs}" fill="none" stroke="${o ? o.coul : "#333"}" stroke-width="2" stroke-dasharray="5 4"/>`; }
    html += `<div class="sc-page${p.blanche ? " blanche" : ""}" data-p="${p.id}" style="width:${Math.round(h * p.w / p.h)}px;height:${Math.round(h)}px;cursor:${curseur}">${im ? `<img src="${im.url}" alt="" draggable="false">` : `<div class="sc-absente">Page absente de ce navigateur</div>`}<svg viewBox="0 0 1000 ${Hs}" preserveAspectRatio="none">${svg}</svg></div>`; });
  const garde = SC.champ && SC.champ.el && document.activeElement && document.activeElement.id === "scChampIn";
  if (garde) { Z.querySelectorAll(".sc-page svg").forEach((s, i) => { const p = ps[i]; if (!p) return; const Hs = Math.round(1000 * p.h / p.w); let svg = ""; scMarquesPage(p.id).filter(scVisible).forEach(m => { svg += scSvgMarque(m, p, m.id === SC.sel); }); s.innerHTML = svg; }); return; }
  Z.innerHTML = html;
  if (champ) { const m = scCopie(scK()).marques[champ]; SC.champ = null; if (m) scChampOuvrir(m); }
}
function scChip(n, txt) { return `<span class="sc-chip" style="background:${SC_FOND[n]};border-color:${SC_COUL[n]}">${txt}</span>`; }
function scPanneau() {
  const Z = document.getElementById("scPanneau"); const P = scP(), k = scK();
  if (SC.attrib) { scPanneauAttrib(Z); return; }
  if (P.id === "retours") { scPanneauRetours(Z); return; }
  if (!k) { Z.innerHTML = `<div class="sc-bloc"><h3>Le paquet</h3><p>Charge ton paquet, puis donne à chaque page les initiales de son élève.</p></div>`; return; }
  const s = scCopie(k); const pt = scPt(); let h = "";
  h += `<div class="sc-bloc"><h3>Passe ${SC.passe + 1} · ${escapeHtml(P.nom)} · copie ${SC.ic + 1} sur ${SC.copies.length}</h3><div class="sc-nom">${escapeHtml(nomEleveDe(k) || k)}</div>`;
  h += `<div class="sc-pts">${P.pts.map((p, i) => { const r = scCase(p, k); return `<span class="${i === SC.ip ? "on" : ""}" style="${r && r.complet ? "border-color:" + SC_COUL[r.c.niveau] : ""}">${i + 1} · ${escapeHtml(p.titre)}${r && r.complet ? " ✓" : ""}</span>`; }).join("")}</div></div>`;
  if (pt) {
    const rep = s.rep[pt.id] || {};
    if (pt.calcul === "fautes") {
      const F = scFautes(k), n = scLignesCopie(k);
      h += `<div class="sc-bloc"><h3>Les fautes · toute la copie</h3><p>Tu lis la copie en entier, une seule fois. Souligne chaque faute au pinceau (appuie, glisse, lâche), tape la bonne forme ou son numéro, Entrée. Entrée sur la copie : tu as fini les fautes.</p>
        <p class="sc-m">${F.length} faute${F.length > 1 ? "s" : ""} · ${n || "?"} lignes écrites${n ? "" : " (l'appli ne les a pas trouvées : tape-les ci-dessous)"}</p>
        <label class="sc-m" title="Le nombre de lignes écrites, trouvé par l'appli sur les pages de cette copie. Corrige-le s'il est faux : il compte pour la longueur et pour les fautes.">Lignes écrites : <input id="scLig" type="number" min="0" max="120" value="${s.lignes != null ? s.lignes : (n || "")}" style="width:64px" onchange="scLignesFixer(this.value)"></label>
        <div style="margin-top:8px"><button class="sc-btn${SC.outil === "etoile" ? " on" : ""}" onclick="SC.outil=SC.outil==='etoile'?null:'etoile';scRendre()" title="Le pinceau doré : surligne la phrase qui t'a touché. Un seul tracé, puis le pinceau revient aux fautes.">★ La phrase qui t'a touché</button></div></div>`;
      const B = scBanque(); h += `<div class="sc-bloc"><h3>Les formes déjà vues dans le paquet</h3>${B.length ? `<div class="sc-banque">${B.map((b, i) => `<span class="sc-touche">${i + 1}</span><span>${escapeHtml(b.forme)} <i class="sc-m">· ${b.copies.size} copie${b.copies.size > 1 ? "s" : ""}</i></span>`).join("")}</div>` : `<p class="sc-m">Aucune encore : chaque forme tapée prend un numéro.</p>`}</div>`;
    } else if (pt.calcul === "lignes") {
      const r = scCase(pt, k); h += `<div class="sc-bloc"><h3>${escapeHtml(pt.titre)} · calculé</h3><p>${r ? scChip(r.c.niveau, r.txt) : "Les lignes ne sont pas comptées : tape-les dans la passe de la langue."}</p><p class="sc-m">Entrée : point suivant.</p></div>`;
    } else {
      h += `<div class="sc-bloc"><h3>${escapeHtml(pt.titre)} · ${pt.poids} points</h3>${scQuestions(pt, rep).map(q => { const v = rep[q.id]; const nb = scMarquesPage ? Object.values(s.marques).filter(m => m.point === pt.id && m.q === q.id).length : 0;
        return `<div class="sc-q${q.id === SC.iq ? " on" : ""}" onclick="SC.iq=${q.id};scRendre()" title="${q.marque ? "Le pinceau " + (q.marque.forme === "surligne" ? "surligne une citation" : q.marque.forme === "marge" ? "trace un trait dans la marge (un paragraphe)" : "encadre un mot") + (q.marque.sens === "non" ? " : une marque répond « non »" : q.marque.sens === "oui" ? " : une marque répond « oui »" : "") : "Pas de marque attendue : Entrée ou N."}"><span>${escapeHtml(q.texte)}</span><b class="${v === "n" ? "non" : v === "o" ? "oui" : ""}">${v === "n" ? "NON" : v === "o" ? "oui" : "…"}${nb ? " · " + nb + " marque" + (nb > 1 ? "s" : "") : ""}</b><em>${escapeHtml(q.moment)}${q.marque ? " · " + (q.marque.forme === "surligne" ? "surligné" : q.marque.forme === "marge" ? "marge" : "encadré") : ""}</em></div>`; }).join("")}</div>`;
      const r = scCase(pt, k);
      h += `<div class="sc-bloc"><h3>La case où tombe cette copie</h3>${pt.cases.map(c => `<div class="sc-case${r && r.c === c ? " on" : ""}"><i style="background:${SC_COUL[c.niveau]}"></i><span>${escapeHtml(r && r.c === c ? r.txt : c.fait)}</span><b>${pt.bareme[c.niveau]}</b></div>`).join("")}<p class="sc-m">${r ? (r.complet ? "Calculée de tes réponses : tu ne choisis jamais la case." : "Provisoire : il reste des questions.") : "Réponds aux questions."}</p></div>`;
      const vus = SC.copies.map((c, i) => ({ i, r: scCase(pt, c) })).filter(x => x.r && x.r.complet);
      h += `<div class="sc-bloc"><h3>Sur ce point, les copies déjà vues</h3><div class="sc-points">${vus.length ? vus.map(x => `<span title="${escapeAttr(nomEleveDe(SC.copies[x.i]) || "")}"><i style="background:${SC_COUL[x.r.c.niveau]}"></i>${x.i + 1}</span>`).join("") : '<span class="sc-m">aucune encore</span>'}</div></div>`;
    }
  }
  const nt = scNote(k); h += `<div class="sc-bloc"><h3>Cette copie</h3><p>${nt.ok ? "Note : <b>" + String(nt.n).replace(".", ",") + " / " + nt.tot + "</b>" : "La note se calcule quand tous les points sont passés."}</p></div>`;
  h += `<div class="sc-bloc sc-touches"><h3>Les touches</h3><div class="sc-cle"><span>pinceau</span><span>appuie, glisse, lâche : la forme vient avec la question</span><span class="sc-touche">Entrée</span><span>oui · suivant</span><span class="sc-touche">N</span><span>non · suivant</span><span class="sc-touche">⌫</span><span>question précédente</span><span class="sc-touche">→ ←</span><span>copie suivante · précédente</span><span>clic</span><span>sur une marque : la choisir ; tire-la ou ses poignées</span><span class="sc-touche">Suppr</span><span>effacer la marque choisie</span><span class="sc-touche">Ctrl+Z</span><span>annuler</span><span class="sc-touche">?</span><span>l'aide</span></div></div>`;
  Z.innerHTML = h;
}
function scLignesFixer(v) { const k = scK(); if (!k) return; const s = scCopie(k); s.lignes = v === "" ? null : Math.max(0, Math.round(+v)); saveState(); scRendre(); }
function scPanneauAttrib(Z) {
  const L = scPagesOrdre(); const p = L[SC.ia]; const reste = scPagesSans().length; const prec = scPrecedentEleve();
  Z.innerHTML = `<div class="sc-bloc"><h3>Le paquet · page ${SC.ia + 1} sur ${L.length}</h3><p>Tape les initiales de l'élève de cette page, Entrée. <b>Entrée seule</b> : même élève que la page d'avant${prec ? " (" + escapeHtml(nomEleveDe(prec)) + ")" : ""}.</p>
    <input id="scInit" class="sc-init" autocomplete="off" placeholder="initiales" title="Les initiales, dans n'importe quel ordre (CF ou FC pour Chevalier Flavie)."><div id="scInitSug" class="sc-m"></div>
    ${p && p.blanche ? `<p class="sc-alerte">L'appli n'y voit aucune ligne écrite : page blanche, sautée.</p><button class="sc-btn" onclick="scBlanche(false)" title="Cette page porte bien une copie : elle reprend sa place dans le paquet.">Ce n'est pas une page blanche</button>` : `<button class="sc-btn" onclick="scBlanche(true)" title="Écarter cette page : elle ne va à aucun élève.">Page blanche</button>`}
    <p class="sc-m">${reste} page${reste > 1 ? "s" : ""} sans élève · ${SC.copies.length} copie${SC.copies.length > 1 ? "s" : ""} reconnue${SC.copies.length > 1 ? "s" : ""}. L'ordre du paquet devient celui de tes flèches.</p>
    ${reste ? "" : `<button class="sc-btn" onclick="SC.attrib=false;scAllerCopie(0)" title="Commencer la correction, passe 1.">Corriger</button>`}</div>`;
  const inp = document.getElementById("scInit"); setTimeout(() => inp.focus(), 0);
  const sug = () => { const c = inp.value.trim().length >= 2 ? eleveDePar(inp.value) : []; document.getElementById("scInitSug").innerHTML = !inp.value.trim() ? "" : !c.length ? "Aucun élève avec ces initiales." : c.map((n, i) => `${c.length > 1 ? `<span class="sc-touche">${i + 1}</span>` : "→"} <b>${escapeHtml(n)}</b>`).join(" · ") + (c.length > 1 ? " : tape son chiffre" : " : Entrée"); return c; };
  inp.addEventListener("input", sug);
  inp.addEventListener("keydown", e => { e.stopPropagation(); const c = sug();
    if (e.key === "Enter") { e.preventDefault(); if (!inp.value.trim()) { if (prec) scAttribuer(prec); else toast("Pas de page d'avant : tape les initiales."); return; } if (c.length === 1) scAttribuer(eleveId(c[0])); }
    else if (/^[1-9]$/.test(e.key) && c.length > 1 && c[+e.key - 1]) { e.preventDefault(); scAttribuer(eleveId(c[+e.key - 1])); }
    else if (e.key === "ArrowRight") { e.preventDefault(); scAttribSuivante(); } });
}
function scPaquet() {
  const Z = document.getElementById("scPaquet"); const pt = scPt();
  if (SC.attrib) { Z.innerHTML = '<span class="sc-m">Le paquet :</span>' + scPagesOrdre().map((p, i) => `<span class="sc-vig${i === SC.ia ? " cour" : ""}${p.blanche ? " blanche" : ""}" onclick="SC.ia=${i};scRendre()" title="Page ${i + 1}${p.eleve ? " · " + escapeAttr(nomEleveDe(p.eleve)) : ""}">${SC.imgs[p.id] ? `<img src="${SC.imgs[p.id].url}" alt="">` : ""}<em>${p.eleve ? escapeHtml(initialesEleve(nomEleveDe(p.eleve) || "?")) : i + 1}</em></span>`).join(""); return; }
  Z.innerHTML = '<span class="sc-m">Le paquet :</span>' + SC.copies.map((k, i) => { const p = scPagesDe(k)[0]; const r = pt && scCase(pt, k); const vu = (scCopie(k).vu || {})[scP().id];
    return `<span class="sc-vig${i === SC.ic ? " cour" : ""}${vu ? " vu" : ""}" onclick="scAllerCopie(${i})" title="${escapeAttr(nomEleveDe(k) || k)}">${p && SC.imgs[p.id] ? `<img src="${SC.imgs[p.id].url}" alt="">` : ""}<em>${i + 1}</em>${r && r.complet ? `<i style="background:${SC_COUL[r.c.niveau]}"></i>` : ""}</span>`; }).join("");
}
// ── la passe des retours : ce que les élèves ont renvoyé, relu case par case ──
function scRetoursListe() {
  const L = []; Object.keys(SC.retours || {}).forEach(k => { const R = SC.retours[k] || {}; Object.keys(R).forEach(cle => { const r = R[cle]; if (!r || !r.texte || r.ok) return; L.push(Object.assign({ eleve: k, cle }, r)); }); });
  return L.sort((a, b) => ((a.groupe || "") < (b.groupe || "") ? -1 : (a.groupe || "") > (b.groupe || "") ? 1 : (a.le < b.le ? -1 : 1)));
}
function scPanneauRetours(Z) {
  const L = scRetoursListe(); const r = L[SC.ir];
  Z.innerHTML = `<div class="sc-bloc"><h3>Les retours des élèves · ${L.length ? (Math.min(SC.ir, L.length - 1) + 1) + " sur " + L.length : "aucun"}</h3>${r ? `<div class="sc-nom">${escapeHtml(nomEleveDe(r.eleve) || r.eleve)}</div><p class="sc-m">${escapeHtml(r.titre || "")}</p><p>${escapeHtml(r.consigne || "")}</p><div class="sc-papillon">${escapeHtml(r.texte)}</div>${r.etat ? `<p class="sc-m">Déjà relu : ${r.etat === "bon" ? "c'est bon" : "à refaire"}.</p>` : ""}` : `<p>Rien à relire : les retours arrivent quand les élèves ouvrent leur fichier et écrivent leurs papillons.</p>`}
    <button class="sc-btn" onclick="scRetoursRelire()" title="Relire au site ce que les élèves ont envoyé depuis leur fichier.">↻ Relire les retours</button></div>
    <div class="sc-bloc sc-touches"><h3>Les touches</h3><div class="sc-cle"><span class="sc-touche">Entrée</span><span>c'est bon</span><span class="sc-touche">N</span><span>à refaire : l'élève reçoit la tâche à refaire</span><span class="sc-touche">→ ←</span><span>retour suivant · précédent</span></div></div>`;
}
function scRetoursRelire() { ruLire(scCheminRetours()).then(rt => { SC.retours = rt || {}; scRendre(); toast("Retours relus."); }); }
function scDessinerRetour(Z) {
  const r = scRetoursListe()[SC.ir]; if (!r) { Z.innerHTML = '<div class="sc-vide">Aucun retour à relire.</div>'; return; }
  const s = scCopie(r.eleve); const ms = Object.values(s.marques).filter(m => (r.marque && m.id === r.marque) || (!r.marque && m.point === r.point)); const m = ms[0];
  const p = m ? SC.pages[m.page] : scPagesDe(r.eleve)[0]; const im = p && SC.imgs[p.id];
  if (!p || !im) { Z.innerHTML = '<div class="sc-vide">La page de ce retour n\'est pas dans ce navigateur : remets ton paquet.</div>'; return; }
  const y0 = m ? Math.max(0, m.y0 - 0.06) : 0, y1 = m ? Math.min(1, m.y1 + 0.08) : 0.3; const W = Math.min(Z.clientWidth - 40, 900); const Hp = W * p.h / p.w;
  Z.innerHTML = `<div class="sc-retour"><div class="sc-extrait" style="width:${W}px;height:${Math.round((y1 - y0) * Hp)}px;background-image:url(${im.url});background-size:${W}px ${Math.round(Hp)}px;background-position:0 -${Math.round(y0 * Hp)}px">${m ? `<div class="sc-ext-m" style="left:${m.x0 * 100}%;top:${(m.y0 - y0) * Hp}px;width:${(m.x1 - m.x0) * 100}%;height:${(m.y1 - m.y0) * Hp}px"></div>` : ""}</div><div class="sc-papillon grand">${escapeHtml(r.texte)}</div></div>`;
}
function scVerdict(v) { const L = scRetoursListe(); const r = L[SC.ir]; if (!r) return; const o = Object.assign({}, SC.retours[r.eleve][r.cle], { etat: v, relu: new Date().toISOString() });
  SC.retours[r.eleve][r.cle] = o; ruEcrire(scCheminRetours([r.eleve, r.cle]), o, "un retour relu"); SC.ir = Math.min(SC.ir + 1, L.length - 1); scRendre(); }
// ── l'aide, la fenêtre ──
function scAide() { scModale(`<h3>Corriger sur les scans</h3><p>Un critère à la fois : les copies défilent, chacune à la place de la précédente. La langue d'abord, la seule passe où tu lis toute la copie ; puis chaque critère de la grille, de haut en bas.</p><p>Le pinceau : pointeur en croix, de la couleur du critère. Appuie, glisse, lâche. La forme vient avec la question : souligné rouge, une faute ; surligné, une citation ; encadré, un mot ; trait dans la marge, un paragraphe. Une marque calée sur les lignes que l'appli a trouvées.</p><p>Les cases se calculent de tes réponses : Entrée, oui ; N, non. Une marque qui répond « non » ou « oui » répond pour toi.</p><p>Le paquet reste dans ce navigateur (et sur ta clé) ; les marques et les réponses vont au site, chacune avec son identité : elles reviennent sur n'importe quel ordinateur dès que tu remets le paquet.</p>`); }
function scModale(h) { const m = document.getElementById("scModale"); m.querySelector(".sc-modale-c").innerHTML = h + `<div style="text-align:right;margin-top:10px"><button class="sc-btn" onclick="scModaleFermer()">Fermer</button></div>`; m.classList.add("show"); }
function scModaleFermer() { document.getElementById("scModale").classList.remove("show"); }
addEventListener("resize", () => { if (SC.ouvert) scDessinerPages(); });
