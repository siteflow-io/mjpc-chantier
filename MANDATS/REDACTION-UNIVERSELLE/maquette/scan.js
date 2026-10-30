// =====================================================================
// RU-SCAN — CORRIGER SUR LA COPIE SCANNÉE (cadrage C13, 29-30/10/2026, tours 371 à 399)
// =====================================================================
// Le paquet scanné (PDF ou photos) reste dans ce navigateur (IndexedDB) : jamais au site, jamais au hub.
// Au hub : la grille (config/grille2), les pages sans leur image (scan/<classe>/pages/<id> : élève, ordre, lignes),
// les marques et les réponses dans la copie (copies/<classe>/<élève>.scan), les retours des élèves (retours/<classe>/<élève>).
// Une page a pour identité l'empreinte de son image : remettre le même PDF, sur n'importe quel ordinateur, ramène ses marques.
// Une marque est un objet : un id né une fois, l'horodatage, la page et la place sur la page (jamais un rang).
const SC = { grille: null, passes: [], passe: 0, copies: [], ic: 0, ip: 0, iq: 0, pages: {}, imgs: {}, sel: null, outil: null, annule: [],
  attrib: false, ia: 0, trace: null, champ: null, retours: {}, ir: 0, actif: 0, ouvert: false, dbp: null, origs: {}, rt: null };
const SC_COUL = { 0: "#c54040", 1: "#c47820", 2: "#5a8a32", 3: "#3a6e1c" };
const SC_FOND = { 0: "#f4b0b0", 1: "#f5c98a", 2: "#a8d088", 3: "#7eb55c" };
const SC_CRIT = { langue: "#c54040", theme: "#2f5d8a", construction: "#1f7a72", organisation: "#7a3f8f", etoile: "#c08a4a" };
// ════════════════════════════════════════════════════════════════════════════════════════════════
// SECTION ENTIÈRE À CODER (Paul, 30/10 10:57) : LA CORRECTION PAR L'ÉLÈVE — une seconde étape, ouverte par une coche,
// lancée en classe comme la correction de dictée. Tant qu'elle n'est pas codée : la coche est grisée et décochée (config/correctionEleve
// n'est jamais écrit), l'élève reçoit sa copie corrigée en lecture seule (eleve.js : scEleveLecture), et la passe « Les retours des élèves »
// n'apparaît pas. Le code de l'ancien parcours (scEleveApp, la passe des retours, scVerdict, le transport des retours) reste en place,
// derrière ce drapeau, pour être repris : rien ne l'appelle quand le drapeau est faux. Dettes : docs/MJPC6-DETTES.md (production).
const SC_CORRECTION_ELEVE_CODEE = false;
function scCorrectionEleve() { return SC_CORRECTION_ELEVE_CODEE && !!SC.correctionEleve; }
// ════════════════════════════════════════════════════════════════════════════════════════════════
const SC_PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
function scImg(blob, w, h) { const url = URL.createObjectURL(blob); const el = new Image(); el.src = url; return { url, w, h, blob, el }; }
function scId(p) { return p + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8); }
function scChemin(x) { return ["redactions", RU.id, "scan", RU.classe].concat(x || []); }
function scCheminRetours(x) { return ["redactions", RU.id, "retours", RU.classe].concat(x || []); }
// jamais de copie sans élève : une clé vide écrirait par-dessus toute la classe au hub (piège payé au banc du 30/10)
function scCopie(k) { if (!k || !state.classe.some(n => eleveId(n) === k)) return { marques: {}, rep: {}, chrono: {}, vu: {} }; const c = state.copies[k] = state.copies[k] || {}; c.scan = c.scan || {}; const s = c.scan; s.marques = s.marques || {}; s.rep = s.rep || {}; s.chrono = s.chrono || {}; return s; }
// la partie « scan » d'une copie a-t-elle quelque chose ? (le site n'enregistre ni objet vide ni tableau vide : une partie vide n'y existe pas, et ne doit pas faire réécrire la copie)
function scPlein(v) { if (v == null) return false; if (typeof v !== "object") return true; return Object.keys(v).some(k => scPlein(v[k])); }
// la forme qu'a une copie au site (le site jette les vides et les nuls, rend en tableau un objet aux clés 0..n, range les clés) : comparer sous cette forme,
// sinon rouvrir la classe réécrit des copies qui n'ont pas bougé (1.2.0 : 28 écritures à l'ouverture, mesuré au banc)
/* 1.2.3 (C14, 30/10) — le site refuse un nom qui contient . # $ / [ ] (mesuré : « Key value can't be empty or contain $ # [ ] / or . ») ;
   l'identité d'une question en porte un (« lexique.les-mots-disent-ils-ce-que ») : une réponse rangée sous elle faisait refuser toute la copie.
   Au site, ces caractères s'écrivent %2E, %23… ; ils se relisent tels quels. Rien ne change dans l'app, dans la grille, ni dans les copies déjà au site. */
const SC_CLE_SITE = [["%", "%25"], [".", "%2E"], ["#", "%23"], ["$", "%24"], ["/", "%2F"], ["[", "%5B"], ["]", "%5D"]];
function scCleSite(k, versSite) { let s = String(k); if (versSite) SC_CLE_SITE.forEach(([a, b]) => { s = s.split(a).join(b); }); else SC_CLE_SITE.slice().reverse().forEach(([a, b]) => { s = s.split(b).join(a); }); return s; }
function scCles(v, versSite) { if (v == null || typeof v !== "object") return v; if (Array.isArray(v)) return v.map(x => scCles(x, versSite)); const o = {}; Object.keys(v).forEach(k => { o[scCleSite(k, versSite)] = scCles(v[k], versSite); }); return o; }
function scFb(v) { if (v == null) return null; if (Array.isArray(v)) v = Object.assign({}, v); if (typeof v !== "object") return v;
  const o = {}; Object.keys(v).sort().forEach(k => { const y = scFb(v[k]); if (y !== null) o[k] = y; }); const K = Object.keys(o); if (!K.length) return null;
  if (K.every(k => /^(0|[1-9]\d*)$/.test(k))) { const mx = Math.max.apply(null, K.map(Number)); if (mx < 2 * K.length) { const a = []; for (let i = 0; i <= mx; i++) a.push(i in o ? o[i] : null); return a; } }
  return o; }
function scLong() { const n = Number(SUJET && SUJET.longueur); return n > 0 ? n : 30; }
// ── la mémoire du navigateur : les images des pages ──
function scDb() { return SC.dbp || (SC.dbp = new Promise((res, rej) => { const r = indexedDB.open("mjpc_scans", 1); r.onupgradeneeded = () => r.result.createObjectStore("pages", { keyPath: "id" }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); })); }
function scDbFaire(mode, f) { return scDb().then(db => new Promise((res, rej) => { const t = db.transaction("pages", mode); const st = t.objectStore("pages"); let out; const q = f(st); if (q) q.onsuccess = () => { out = q.result; }; t.oncomplete = () => res(out); t.onerror = () => rej(t.error); })); }
function scDbMettre(o) { const g = SC.origs[o.id]; if (g && !o.orig) { o.orig = g.blob; o.ow = g.w; o.oh = g.h; } return scDbFaire("readwrite", st => st.put(o)); }
function scDbTout() { return scDbFaire("readonly", st => st.getAll()); }
// ── ouvrir l'écran ──
function scOuvrir() {
  if (!RU.id || !RU.classe) { toast("Choisis d'abord la classe."); return; }
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  Promise.all([ruLire(["redactions", RU.id, "config", "grille2"]), ruLire(scChemin(["pages"])), ruLire(scCheminRetours()), scDbTout().catch(() => []), ruLire(["redactions", RU.id, "config", "aRefaire"])]).then(([g, pg, rt, loc, ar]) => {
    SC.aRefaire = ar || "";
    if (!g || !g.criteres) { toast("Ce sujet n'a pas encore de grille à cases : la correction sur les scans attend sa grille."); return; }
    SC.grille = scGrilleNormale(g); SC.pages = pg || {}; SC.retours = rt || {};
    const L = g.criteres.find(c => c.id === "langue");
    SC.passes = [{ id: "langue", nom: L ? L.nom : "La langue", pts: L ? L.points : [], crit: "langue" }]
      .concat(g.criteres.filter(c => c.id !== "langue").map(c => ({ id: c.id, nom: c.nom, pts: c.points, crit: c.id })))
      .concat([{ id: "retours", nom: "Les retours des élèves", pts: [], crit: "retours" }]);
    Object.values(SC.imgs).forEach(u => { try { URL.revokeObjectURL(u.url); } catch (e) {} }); SC.imgs = {};
    (loc || []).forEach(o => { if (o && o.blob) SC.imgs[o.id] = scImg(o.blob, o.w, o.h); if (o && o.orig) SC.origs[o.id] = { blob: o.orig, w: o.ow, h: o.oh }; });
    scCopiesOrdre(); SC.ouvert = true; SC.actif = Date.now();
    const c = state.scanCurseur; if (c) { const ip = SC.passes.findIndex(p => p.id === c.passe); if (ip >= 0) SC.passe = ip; const j = SC.copies.indexOf(c.copie); if (j >= 0) SC.ic = j; const P = SC.passes[SC.passe]; const k = P.pts.findIndex(p => p.id === c.point); if (k >= 0) SC.ip = k; SC.iq = c.q != null ? c.q : null; }
    state.modeOuvert = "scan"; SC.aideAvant = AIDE.courant; aidePoser("scan");
    document.getElementById("scanEcran").classList.remove("hidden"); document.body.classList.add("sc-ouvert");
    SC.attrib = scPagesSans().length > 0; SC.ia = scPremiereSans();
    scRendre();
    if (state.scanRecopie && state.scanRecopie.ouverte && typeof rcOuvrir === "function") rcOuvrir(true);
  });
}
function scFermer() { if (typeof RC !== "undefined" && RC.ouvert) rcFermer(true); scChrono(); SC.ouvert = false; scChampFermer(true); state.modeOuvert = null; aidePoser(SC.aideAvant || "correction"); document.getElementById("scanEcran").classList.add("hidden"); document.body.classList.remove("sc-ouvert"); saveState(); if (typeof renderDashboard === "function") renderDashboard(); }
function scPagesOrdre() { return Object.values(SC.pages).filter(p => p && p.id).sort((a, b) => (a.ordre || 0) - (b.ordre || 0)); }
function scPremiereSans() { const i = scPagesOrdre().findIndex(p => !p.eleve && !p.blanche); return i < 0 ? 0 : i; }
function scPagesSans() { return scPagesOrdre().filter(p => !p.eleve && !p.blanche); }
function scPagesDe(k) { return scPagesOrdre().filter(p => p.eleve === k && !p.blanche); }
function scCopiesOrdre() { const cour = SC.copies[SC.ic]; const vu = []; scPagesOrdre().forEach(p => { if (p.eleve && !p.blanche && vu.indexOf(p.eleve) < 0) vu.push(p.eleve); }); SC.copies = vu; const j = cour ? vu.indexOf(cour) : -1; SC.ic = j >= 0 ? j : Math.min(SC.ic, Math.max(0, vu.length - 1)); }
function scManquantes() { return scPagesOrdre().filter(p => !SC.imgs[p.id]); }
// ── charger le paquet (PDF ou photos) : tout reste dans ce navigateur ──
function scCharger(ev) {
  const fs = Array.from(ev.target.files || []); ev.target.value = ""; if (!fs.length) return;
  let ordre = scPagesOrdre().reduce((m, p) => Math.max(m, p.ordre || 0), 0);
  const nouvelles = []; let n = 0;
  const traiter = cv => scPage(cv).then(o => { n++; scTemoinCharge("Page " + n + " lue…");
    const ex = SC.pages[o.id];
    SC.imgs[o.id] = scImg(o.blob, o.w, o.h); if (SC.encres) delete SC.encres[o.id]; if (o.orig) SC.origs[o.id] = { blob: o.orig, w: o.ow, h: o.oh };
    const meta = ex || { id: o.id, eleve: null, ordre: ++ordre, blanche: o.blanche, lignes: o.lignes, rot: o.rot, w: o.w, h: o.h, creeLe: new Date().toISOString() };
    if (!ex) { SC.pages[o.id] = meta; nouvelles.push(meta); ruEcrire(scChemin(["pages", o.id]), meta, "une page du paquet"); }
    return scDbMettre({ id: o.id, red: RU.id, classe: RU.classe, blob: o.blob, w: o.w, h: o.h, le: new Date().toISOString() }); });
  let ch = Promise.resolve();
  fs.forEach(f => { ch = ch.then(() => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name) ? scLirePdf(f, traiter) : scLireImage(f).then(traiter)); });
  ch.then(() => { scCopiesOrdre(); SC.attrib = scPagesSans().length > 0; SC.ia = scPremiereSans(); scTemoinCharge("");
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
function scTourner(cv, deg) {   // deg : un quart de tour dans le sens inverse des aiguilles d'une montre, par 90
  const q = ((deg % 360) + 360) % 360; if (!q) return cv; const c = document.createElement("canvas"); c.width = q % 180 ? cv.height : cv.width; c.height = q % 180 ? cv.width : cv.height;
  const x = c.getContext("2d"); x.translate(c.width / 2, c.height / 2); x.rotate(-q * Math.PI / 180); x.drawImage(cv, -cv.width / 2, -cv.height / 2); return c; }
function scPage(cvLu) {
  const p = document.createElement("canvas"); p.width = 16; p.height = 16; const pc = p.getContext("2d"); pc.drawImage(cvLu, 0, 0, 16, 16);
  const d = pc.getImageData(0, 0, 16, 16).data; const g = []; for (let i = 0; i < 256; i++) g.push(d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]);
  const moy = g.reduce((a, b) => a + b, 0) / 256; let hex = ""; for (let i = 0; i < 256; i += 4) { let v = 0; for (let j = 0; j < 4; j++) v = v * 2 + (g[i + j] > moy ? 1 : 0); hex += v.toString(16); }
  const id = "page_" + hex + "_" + cvLu.width.toString(36) + cvLu.height.toString(36);
  const ex = SC.pages[id]; const rot = ex && ex.rot != null ? ex.rot : (cvLu.width > cvLu.height * 1.08 ? 90 : 0);   // une page en paysage : photographiée de côté
  let cv0 = scTourner(cvLu, rot); if (ex && ex.angle) cv0 = scIncliner(cv0, ex.angle); if (ex && ex.recadre) cv0 = scCouper(cv0, ex.recadre); const H = scReperes(cv0); const cv = H ? scRedresser(cv0, H) : cv0;   // une copie de l'appli : remise droite, lignes connues
  const lig = H ? scLignesConnues(cv) : scLignes(cv);
  return new Promise(res => cv.toBlob(b => cvLu.toBlob(g => res({ id, rot, blob: b, w: cv.width, h: cv.height, lignes: lig, blanche: lig.fiable !== false && lig.n === 0, orig: g, ow: cvLu.width, oh: cvLu.height }), "image/jpeg", 0.85), "image/jpeg", 0.82));
}
// les lignes écrites (mesuré le 30/10 sur une copie de l'an dernier : 30 sur 30, à 1 pixel près) : l'encre plus sombre que le papier autour,
// la réglure (longues traînées horizontales) retirée, le profil ligne par ligne ; le début et la fin de l'écriture de chaque ligne
function scLignes(src, options) {
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
  const tri = Array.from(lis).sort((a, b) => a - b); const p95 = tri[Math.floor(H * 0.95)] || 0; const seuil = options && options.recopie ? Math.max(1.2, 0.10 * p95) : Math.max(2.5, 0.25 * p95);
  const pics = []; for (let y = 8; y < H - 8; y++) { if (lis[y] < seuil) continue; let mx = true; for (let k = -8; k <= 8; k++) if (lis[y + k] > lis[y]) { mx = false; break; } if (mx && (!pics.length || y - pics[pics.length - 1] > 8)) pics.push(y); }
  const L = pics.map(y => { const col = new Float32Array(W); for (let yy = Math.max(0, y - 8); yy < Math.min(H, y + 5); yy++) for (let x = bx; x < ex; x++) col[x] += encre[yy * W + x];
    let a = -1, b = -1; for (let x = bx; x < ex; x++) { let s = 0; for (let k = -3; k <= 3; k++) s += col[Math.min(W - 1, Math.max(0, x + k))]; if (s > 1.5) { if (a < 0) a = x; b = x; } }
    return { y: +(y / H).toFixed(4), x0: +((a < 0 ? bx : a) / W).toFixed(4), x1: +((b < 0 ? ex : b) / W).toFixed(4) }; });
  const ecarts = L.slice(1).map((l, i) => l.y - L[i].y).sort((a, b) => a - b); const pas = ecarts.length ? ecarts[Math.floor(ecarts.length / 2)] : 0.03;
  if (L.length > 45 || (L.length >= 6 && pas < 0.016)) return { n: null, pas: 0.03, l: [], fiable: false };   // trop serrées : la réglure, pas l'écriture
  return { n: L.length, pas: +pas.toFixed(4), l: L };
}
// ── les initiales : chaque page dans l'ordre où elle est dans le paquet ──
function scAttribuer(k) {
  const p = scPagesOrdre()[SC.ia]; if (!p) return;
  p.eleve = k; p.modifieLe = new Date().toISOString(); ruEcrire(scChemin(["pages", p.id]), p, "la page de " + nomEleveDe(k));
  scCopiesOrdre(); state.paquetOrdre = SC.copies.slice(); saveState();
  scAttribSuivante();
}
function scAttribSuivante() { const L = scPagesOrdre(); let i = SC.ia + 1; while (i < L.length && L[i].blanche) i++; SC.ia = i; if (i >= L.length) { SC.attrib = scPagesSans().length > 0; SC.ia = 0; if (!SC.attrib) { setTimeout(scLignesAccueil, 0); } if (!SC.attrib) toast("Toutes les pages ont leur élève."); } scRendre(); }
function scPrecedentEleve() { const L = scPagesOrdre(); for (let i = SC.ia - 1; i >= 0; i--) if (L[i].eleve && !L[i].blanche) return L[i].eleve; return null; }
function scBlanche(v) { const p = scPagesOrdre()[SC.ia]; if (!p) return; p.blanche = v; if (v) p.eleve = null; ruEcrire(scChemin(["pages", p.id]), p, "une page blanche"); scCopiesOrdre(); if (v) scAttribSuivante(); else scRendre(); }
// ── la grille : questions sautées, cases calculées ──
// une question a son identité (cle) : les réponses et les marques la portent ; la grille, elle, écrit ses conditions par numéro, traduit ici
// le site (Firebase) n'enregistre pas un tableau vide : un point calculé revient sans « questions » ; et il rend le barème (clés 0 à 3) en tableau
function scGrilleNormale(g) { (g.criteres = g.criteres || []).forEach(c => { c.points = c.points || []; c.points.forEach(pt => { pt.questions = pt.questions || []; pt.cases = pt.cases || []; pt.bareme = pt.bareme || {}; }); }); return g; }
function scQ(pt, c) { return pt.questions.find(q => q.cle === c); }
function scCleDe(pt, i) { const q = pt.questions.find(q => q.id === +i); return q ? q.cle : null; }
function scSautee(pt, q, rep) { if (!q || !q.saute) return false; const [t, i] = q.saute.split(":"); const c = scCleDe(pt, i); return t === "n" ? rep[c] === "n" : rep[c] === "o"; }
// la case que décide une question : celle où tombe la copie si la réponse est non (ou oui), ou que comptent ses marques
function scCaseLiee(pt, q) { if (!q) return null; let c = pt.cases.find(c => c.si === "n:" + q.id); if (c) return { c, dit: "Si non" }; c = pt.cases.find(c => c.si === "o:" + q.id); if (c) return { c, dit: "Si oui" };
  c = pt.cases.find(c => String(c.si || "").indexOf("m:" + q.id + ":") === 0); return c ? { c, dit: "Avec tes marques" } : null; }
function scQuestions(pt, rep) { return pt.questions.filter(q => !scSautee(pt, q, rep || {})); }
function scFautes(k) { return Object.values(scCopie(k).marques).filter(m => m.forme === "faute"); }
// les lignes écrites : comptées d'office sur les copies de l'appli (lignes connues) ; sur une photo, l'appli propose, tu gardes ou tu corriges (mesuré le 30/10 sur tes copies : la réglure et les feuilles voisines faussent le compte)
function scLignesProposees(k) { const P = scPagesDe(k); if (P.some(p => !p.lignes || p.lignes.fiable === false)) return 0; return P.reduce((n, p) => n + (p.lignes.n || 0), 0); }
function scLignesCopie(k) { const s = scCopie(k); if (s.lignes != null) return s.lignes; const P = scPagesDe(k); return P.length && P.every(p => p.lignes && p.lignes.reperes) ? scLignesProposees(k) : 0; }
// 1451 : les lignes écrites, demandées au début de chaque copie dans la passe de la langue ; tant qu'elles manquent, la copie ne se quitte pas
function scLignesManquent(k) { return !!k && scPagesDe(k).length > 0 && !scLignesCopie(k); }
function scLignesBloque() { const P = scP(), k = scK(); return !SC.attrib && P && P.id === "langue" && scLignesManquent(k); }
function scLignesDemander() {
  const a = document.getElementById("scLigAlerte"); if (a) a.hidden = false;
  let b = document.getElementById("scAlerte"); if (!b) { b = document.createElement("div"); b.id = "scAlerte"; b.className = "sc-alerte-copie"; document.getElementById("scanEcran").appendChild(b); }
  b.textContent = "⚠ D'abord les lignes écrites de cette copie : tape le nombre à droite, puis Entrée. Sans lui, la copie ne se quitte pas."; b.hidden = false; const Zr = document.getElementById("scCopie").getBoundingClientRect(); b.style.left = (Zr.left + Zr.width / 2) + "px"; b.style.top = (Zr.top + 18) + "px"; b.style.maxWidth = Math.max(240, Zr.width - 60) + "px"; clearTimeout(SC.alerteT); SC.alerteT = setTimeout(() => { b.hidden = true; }, 4500);   // au-dessus de la copie, jamais sur le panneau ; partie seule après 4,5 s
  scLignesFocus(true); }
function scLignesFocus(flash) { setTimeout(() => { const e = document.getElementById("scLig"); if (!e) return; e.focus({ preventScroll: false }); e.select(); if (flash) { const b = e.closest(".sc-bloc"); if (b) { b.classList.remove("sc-flash"); void b.offsetWidth; b.classList.add("sc-flash"); } } }, 30); }
function scLignesAccueil() { if (scLignesBloque()) scLignesFocus(false); }
function scCase(pt, k) {
  const s = scCopie(k); const rep = s.rep[pt.id] || {};
  if (pt.calcul) {
    const n = scLignesCopie(k); if (!n) return null; const e = scFautes(k).length;
    const r = pt.calcul === "lignes" ? n / scLong() : e / n;
    const c = pt.cases.find(c => { const m = /^calc:\w+:([\d.]+)-([\d.]+)$/.exec(c.si); return m && r >= +m[1] && r <= +m[2]; });
    return c ? { c, txt: c.fait.replace("{n}", n).replace("{e}", e).replace(/\b1 erreurs\b/, "1 erreur").replace(/\b1 lignes\b/, "1 ligne"), complet: !!s.vu && !!s.vu[scPasseDe(pt)] } : null;
  }
  const qs = scQuestions(pt, rep); const complet = qs.every(q => rep[q.cle] === "o" || rep[q.cle] === "n");
  const non = i => { const c = scCleDe(pt, i); return rep[c] === "n" && !scSautee(pt, scQ(pt, c), rep); }, oui = i => { const c = scCleDe(pt, i); return rep[c] === "o" && !scSautee(pt, scQ(pt, c), rep); };
  const ok = c => { const si = c.si; if (si === "tout") return qs.every(q => rep[q.cle] !== "n");
    let m = /^([no]):(\d+)$/.exec(si); if (m) return m[1] === "n" ? non(+m[2]) : oui(+m[2]);
    m = /^m:(\d+):(\d+)-(\d+)$/.exec(si); if (m) { const nb = Object.values(s.marques).filter(x => x.point === pt.id && x.q === scCleDe(pt, +m[1])).length; return nb >= +m[2] && nb <= +m[3]; }
    m = /^k(>=|=)(\d+):([\d,]+)$/.exec(si); if (m) { const nb = m[3].split(",").filter(i => non(+i)).length; return m[1] === "=" ? nb === +m[2] : nb >= +m[2]; } return false; };
  const ms = pt.cases.filter(ok); if (!ms.length) return null;
  const c = ms.reduce((a, b) => b.niveau < a.niveau ? b : a, ms[0]);
  const lab = pt.questions.filter(q => non(q.id) && q.etiquette).map(q => q.etiquette);
  const liste = lab.length > 1 ? lab.slice(0, -1).join(", ") + " et " + lab[lab.length - 1] : (lab[0] || "");
  const txt = c.fait.replace("{…}", liste).replace("{n}", liste).replace(/\{[^}]*\|[^}]*\}/, liste);
  const qDe = si => { const m = /^(?:[no]|m):(\d+)/.exec(si || ""); return m ? +m[1] : null; }, qc = qDe(c.si);
  const autres = ms.filter(x => x !== c && x.si !== "tout" && x.niveau < 3 && (qc == null || qDe(x.si) !== qc)).sort((a, b) => a.niveau - b.niveau).map(x => ({ c: x, txt: x.fait.replace("{…}", liste).replace("{n}", liste).replace(/\{[^}]*\|[^}]*\}/, liste), tache: (x.tache || "").replace("{n}", liste) }));
  return { c, txt, tache: (c.tache || "").replace("{n}", liste), complet, autres };
}
function scPasseDe(pt) { const p = SC.passes.find(p => p.pts.indexOf(pt) >= 0); return p ? p.id : ""; }
function scTousPoints() { return SC.grille ? SC.grille.criteres.reduce((a, c) => a.concat(c.points.map(p => Object.assign({ crit: c.id, critNom: c.nom }, p))), []) : []; }
function scNote(k) { let n = 0, tot = 0, ok = true; SC.grille.criteres.forEach(c => c.points.forEach(pt => { tot += pt.poids; const r = scCase(pt, k); if (!r || !r.complet) ok = false; else n += pt.bareme[String(r.c.niveau)]; })); return { n, tot, ok }; }
// ── le parcours d'une passe : point, question ──
function scP() { return SC.passes[SC.passe]; }
function scK() { return SC.copies[SC.ic]; }
function scPt() { const P = scP(); return P && P.pts[SC.ip]; }
function scEtapes(k) { if (!k) return []; const P = scP(), rep = scCopie(k).rep; const L = []; P.pts.forEach((pt, ip) => { if (pt.calcul) L.push({ ip, iq: null }); else scQuestions(pt, rep[pt.id]).forEach(q => L.push({ ip, iq: q.cle })); }); return L; }
function scRepondre(v) {
  const k = scK(), pt = scPt(); if (!k || !pt) return; scToucher();
  const s = scCopie(k);
  if (pt.calcul) { scAvancer(); return; }
  if (v === "o" && Object.values(s.marques).some(m => m.point === pt.id && m.q === SC.iq && m.sens === "non")) v = "n";   // Entrée passe ; la marque « non » posée reste un non
  s.rep[pt.id] = s.rep[pt.id] || {}; s.rep[pt.id][SC.iq] = v; saveState(); scAvancer();
}
function scAvancer() {
  const k = scK(); const pt0 = scPt(); if (pt0 && pt0.calcul === "fautes" && scLignesBloque()) { scLignesDemander(); return; }
  const L = scEtapes(k); const i = L.findIndex(e => e.ip === SC.ip && e.iq === SC.iq);
  if (i >= 0 && i < L.length - 1) { SC.ip = L[i + 1].ip; SC.iq = L[i + 1].iq; SC.outil = null; scRendre(); return; }
  const s = scCopie(k); s.vu = s.vu || {}; s.vu[scP().id] = true; saveState();
  if (scNote(k).ok && scP().id !== "retours") { scRecap(k, true); return; }   // 1450 : tous ses points sont passés, la copie se montre en entier avant la suivante
  scSuiteCopie();
}
function scSuiteCopie() {
  if (SC.ic < SC.copies.length - 1) scAllerCopie(SC.ic + 1); else if (SC.passe < SC.passes.length - 2) { const fait = scP().nom; SC.ic = 0; scAllerPasse(SC.passe + 1); toast("« " + fait + " » est fait pour tout le paquet : « " + scP().nom + " » commence, copie 1."); } else { toast("Dernière copie du paquet : « " + scP().nom + " » est fait pour tout le paquet."); scRendre(); }
}
function scReculer() { const L = scEtapes(scK()); const i = L.findIndex(e => e.ip === SC.ip && e.iq === SC.iq); if (i > 0) { SC.ip = L[i - 1].ip; SC.iq = L[i - 1].iq; scRendre(); } }
function scAllerCopie(i) { if (i !== SC.ic && scLignesBloque()) { scLignesDemander(); return; } scChrono(); SC.ic = Math.max(0, Math.min(SC.copies.length - 1, i)); const L = scEtapes(scK() || ""); SC.ip = L.length ? L[0].ip : 0; SC.iq = L.length ? L[0].iq : null; SC.sel = null; SC.outil = null; scChampFermer(); scRendre(); scLignesAccueil(); }
function scAllerPasse(i) { if (SC.passes[i] && SC.passes[i].id === "retours" && !scCorrectionEleve()) return; scChrono(); SC.passe = i; SC.ir = 0; scAllerCopie(SC.ic); }
// le chrono : le temps passé sur chaque copie, passe par passe (une minute sans geste ne compte pas)
function scToucher() { const t = Date.now(); if (typeof RC !== "undefined" && RC.ouvert) { SC.actif = t; return; } if (SC.actif && SC.ouvert && scK() && scP()) { const s = scCopie(scK()); s.chrono[scP().id] = (s.chrono[scP().id] || 0) + Math.min(60000, t - SC.actif); } SC.actif = t; }
function scChrono() { scToucher(); }
// ── le pinceau : la forme vient de ce que tu montres ──
function scOutil() {
  if (SC.outil === "etoile") return { forme: "etoile", sens: "lieu", coul: SC_CRIT.etoile };
  if (SC.outil === "remarque") return { forme: "remarque", sens: "lieu", coul: "#6b1a2a" };
  if (SC.outil === "faute") return { forme: "faute", sens: "lieu", coul: SC_CRIT.langue };
  const P = scP(), pt = scPt(); if (!P || !pt) return null;
  if (P.id === "langue" && pt.calcul === "fautes") return { forme: "faute", sens: "lieu", coul: SC_CRIT.langue };
  const q = pt.calcul ? null : scQ(pt, SC.iq); const m = q && q.marque;
  return { forme: m ? m.forme : "encadre", sens: m ? m.sens : "lieu", coul: SC_CRIT[P.crit] || "#6b1a2a" };
}
function scCurseur(coul) { const s = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><path d='M12 1v22M1 12h22' stroke='${coul}' stroke-width='2'/><circle cx='12' cy='12' r='2.5' fill='none' stroke='${coul}'/></svg>`; return `url("data:image/svg+xml,${encodeURIComponent(s)}") 12 12, crosshair`; }
// les lignes ne servent que là où elles sont connues (copies de l'appli)
function scLigneDe(p, y) { const L = p.lignes && p.lignes.reperes ? p.lignes.l : null; if (!L || !L.length) return -1; let b = 0; L.forEach((l, i) => { if (Math.abs(l.y - y) < Math.abs(L[b].y - y)) b = i; }); return Math.abs(L[b].y - y) < (p.lignes.pas || 0.03) * 0.75 ? b : -1; }
// le tracé posé : calé sur les lignes quand l'appli les a trouvées
function scCaler(m, p) {   // calée sur les lignes seulement sur une copie de l'appli, où elles sont connues : sur une photo, la réglure trompe l'appli
  const L = p.lignes && p.lignes.reperes ? p.lignes.l : null, pas = (p.lignes && p.lignes.pas) || 0.03;
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
function scVisible(m) { const P = scP(); if (!P) return false; if (SC.toutVoir || m.forme === "remarque" && m.passe === P.id) return true; if (P.id === "langue") return m.passe === "langue"; return m.passe === P.id; }
function scSvgMarque(m, p, sel) {
  const W = 1000, H = Math.round(1000 * p.h / p.w); const X = x => (x * W).toFixed(1), Y = y => (y * H).toFixed(1);
  const coul = m.forme === "faute" ? SC_CRIT.langue : m.forme === "etoile" ? SC_CRIT.etoile : (SC_CRIT[m.passe] || "#6b1a2a");
  const fin = 'vector-effect="non-scaling-stroke"';
  const dit = m.forme === "faute" ? "Faute n° " + (m.num || "") + (m.bonne ? " · bonne forme : « " + m.bonne + " »" : " · sans bonne forme (à taper : un clic sur le trait rouvre son champ)") : m.forme === "etoile" ? "La phrase qui t'a touché" : m.forme === "remarque" ? "Ta remarque : « " + (m.texte || "") + " »" : (() => { const pt = scTousPoints().find(x => x.id === m.point); const q = pt && m.q != null ? scQ(pt, m.q) : null; return (pt ? pt.titre : "") + (q ? " · " + q.texte : "") + (m.sens === "non" ? " — répond « non »" : m.sens === "oui" ? " — répond « oui »" : ""); })();
  let s = `<g class="sc-m${sel ? " sel" : ""}" data-id="${m.id}"><title>${escapeHtml(dit)} — clic : ${m.forme === "faute" ? "rouvrir sa bonne forme, pour la taper ou la changer" : m.forme === "remarque" ? "rouvrir ta remarque" : "la choisir"} ; la tirer la déplace, ses poignées la redimensionnent ; Suppr : l'effacer</title>`;
  if (m.forme === "faute") s += `<rect x="${X(m.x0)}" y="${Y(m.y0)}" width="${X(m.x1 - m.x0)}" height="${Y(m.y1 - m.y0)}" fill="transparent"/><line x1="${X(m.x0)}" y1="${(+Y(m.y1) + 1.5).toFixed(1)}" x2="${X(m.x1)}" y2="${(+Y(m.y1) + 1.5).toFixed(1)}" stroke="${coul}" stroke-width="2.5" stroke-linecap="round" ${fin}/>`;
  else if (m.forme === "encadre" || m.forme === "remarque") { const dx = 0.004, dy = 0.003; s += `<rect x="${X(m.x0 - dx)}" y="${Y(m.y0 - dy)}" width="${X(m.x1 - m.x0 + 2 * dx)}" height="${Y(m.y1 - m.y0 + 2 * dy)}" rx="4" fill="none" stroke="${m.forme === "remarque" ? "#6b1a2a" : coul}" stroke-width="2" ${m.forme === "remarque" ? 'stroke-dasharray="6 3"' : ""} ${fin}/>`; }
  else if (m.forme === "marge") s += `<rect x="${X(m.x0)}" y="${Y(m.y0)}" width="${X(m.x1 - m.x0)}" height="${Y(m.y1 - m.y0)}" rx="5" fill="${coul}" style="mix-blend-mode:multiply"/>`;
  else scSegments(m, p).forEach(r => { s += `<rect x="${X(r[0])}" y="${Y(r[1])}" width="${X(r[2] - r[0])}" height="${Y(r[3] - r[1])}" fill="${coul}55" style="mix-blend-mode:multiply"/>`; });
  if (m.forme === "faute" && m.num) { const cx = X(0.022 + (m.rang || 0) * 0.03), cy = Y((m.y0 + m.y1) / 2); s += `<circle cx="${cx}" cy="${cy}" r="11" fill="${coul}"/><text x="${cx}" y="${+cy + 4.5}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui">${m.num}</text>`; }
  if (sel) { s += `<rect x="${X(m.x0) - 3}" y="${Y(m.y0) - 3}" width="${X(m.x1 - m.x0) + 6}" height="${+Y(m.y1 - m.y0) + 6}" fill="none" stroke="#2b2520" stroke-dasharray="6 4" stroke-width="1.5"/>`;
    const u = SC.upx || 1, v = 16 * u, z = 34 * u;   // des poignées de 16 points à l'écran quel que soit le zoom, prises à 34 points (Paul, 30/10 12:08 : « les poignées lâchent »)
    [["a", m.x0, m.y0], ["b", m.x1, m.y1]].forEach(([h, x, y]) => { s += `<rect class="sc-poignee" data-p="${h}" x="${X(x) - z / 2}" y="${Y(y) - z / 2}" width="${z}" height="${z}" fill="transparent"/><rect class="sc-poignee" data-p="${h}" x="${X(x) - v / 2}" y="${Y(y) - v / 2}" width="${v}" height="${v}" fill="#fff" stroke="#2b2520" stroke-width="2" vector-effect="non-scaling-stroke"/>`; }); }
  return s + "</g>";
}
// les fautes de la copie, numérotées dans l'ordre de la copie ; la banque des formes du paquet, numérotée à la première rencontre
function scBanque() { const vu = {}; const L = []; SC.copies.forEach(k => Object.values(scCopie(k).marques).filter(m => m.forme === "faute" && m.bonne).sort((a, b) => a.creeLe < b.creeLe ? -1 : 1).forEach(m => { if (!vu[m.bonne]) { vu[m.bonne] = { forme: m.bonne, copies: new Set(), le: m.creeLe }; L.push(vu[m.bonne]); } vu[m.bonne].copies.add(k); })); return L.sort((a, b) => a.le < b.le ? -1 : 1); }
function scNumeroter(k) { const pg = scPagesDe(k).map(p => p.id); const L = scFautes(k).sort((a, b) => (pg.indexOf(a.page) - pg.indexOf(b.page)) || (a.y0 - b.y0) || (a.x0 - b.x0)); L.forEach((m, i) => { m.num = i + 1; m.rang = L.slice(0, i).filter(x => x.page === m.page && Math.abs((x.y0 + x.y1) / 2 - (m.y0 + m.y1) / 2) < 0.012).length; }); }
// ── poser, déplacer, effacer, annuler ──
function scPoser(m) { const k = scK(); m.id = scId("marque"); m.eleve = k; m.creeLe = m.modifieLe = new Date().toISOString(); scCopie(k).marques[m.id] = m; SC.annule.push({ t: "pose", k, id: m.id });
  if (m.q != null && m.point && (m.sens === "non" || m.sens === "oui")) { const s = scCopie(k); s.rep[m.point] = s.rep[m.point] || {}; s.rep[m.point][m.q] = m.sens === "non" ? "n" : "o"; }
  scNumeroter(k); saveState(); return m; }
function scEffacer(id) { const k = scK(); const s = scCopie(k); const m = s.marques[id]; if (!m) return; SC.annule.push({ t: "efface", k, m: JSON.parse(JSON.stringify(m)) }); delete s.marques[id]; SC.sel = null; scNumeroter(k); saveState(); scRendre(); }
function scAnnuler() { const a = SC.annule.pop(); if (!a) { toast("Rien à annuler."); return; } const s = scCopie(a.k);
  if (a.t === "pose") delete s.marques[a.id]; else if (a.t === "efface") s.marques[a.m.id] = a.m; else if (a.t === "change") s.marques[a.m.id] = a.m;
  SC.sel = null; scNumeroter(a.k); saveState(); scRendre(); }
function scPointeur(ev) {
  const pg = ev.target.closest(".sc-page");
  if (!pg && !SC.attrib && ev.target.closest("#scCopie") && !ev.target.closest(".sc-champ, label, button")) {   // Paul, 30/10 11:57 : un clic dans le blanc, hors de la page, lâche l'outil : le champ se ferme (gardé), l'outil d'un tracé et la marque choisie se relâchent
    scChampFermer(true); SC.outil = null; SC.sel = null; scRendre(); return; }
  if (!pg || SC.attrib || scP().id === "retours") return; const p = SC.pages[pg.dataset.p]; if (!p) return;
  const r = pg.getBoundingClientRect(); const at = e => ({ x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) });
  if (ev.target.closest(".sc-champ")) return;   // dans le champ ouvert : on tape, on choisit une forme, on le tire ; rien sur la copie
  const a = at(ev); scToucher(); scChampFermer(true);
  const g = ev.target.closest(".sc-m"), poi = ev.target.closest(".sc-poignee");
  let gid = g ? g.dataset.id : null;
  if (!gid) {   // Paul, 30/10 12:08 : un clic sur un mot déjà marqué ouvre cette marque, jamais une nouvelle ; à quelques points près autour d'elle, et sur le mot au-dessus du trait d'une faute (une faute, ou une marque de la forme du pinceau)
    const o = scOutil(), tx = 6 / r.width, ty = 8 / r.height, E = SC.encres && SC.encres[p.id], pas = E && E.pas ? E.pas / E.H : 0.027;
    const boite = m => { const y1 = Math.max(m.y0, m.y1); return [Math.min(m.x0, m.x1) - tx, Math.max(m.x0, m.x1) + tx, Math.min(Math.min(m.y0, m.y1), m.forme === "faute" ? y1 - pas * 0.7 : 1) - ty, y1 + ty]; };   // une faute se prend aussi sur son mot, au-dessus du trait
    const loin = m => { const b = boite(m), cx = (b[0] + b[1]) / 2, cy = (b[2] + b[3]) / 2; return Math.hypot((a.x - cx) * r.width, (a.y - cy) * r.height); };
    const C = scMarquesPage(p.id).filter(scVisible).filter(m => m.forme === "faute" || (o && m.forme === o.forme)).filter(m => { const b = boite(m); return a.x >= b[0] && a.x <= b[1] && a.y >= b[2] && a.y <= b[3]; });
    C.sort((u, v) => loin(u) - loin(v)); if (C[0]) gid = C[0].id; }
  if (gid) {   // une marque : la sélectionner ; la tirer la déplace ; ses poignées la redimensionnent
    const m = scCopie(scK()).marques[gid]; if (!m) return; SC.sel = m.id; const avant = JSON.parse(JSON.stringify(m)); let bouge = false;
    const mv = e => { const b = at(e); if (!bouge && Math.hypot((b.x - a.x) * r.width, (b.y - a.y) * r.height) < 4) return;   // un clic qui tremble n'est pas un déplacement
      bouge = true; const dx = b.x - a.x, dy = b.y - a.y; if (poi) { if (poi.dataset.p === "a") { m.x0 = avant.x0 + dx; m.y0 = avant.y0 + dy; } else { m.x1 = avant.x1 + dx; m.y1 = avant.y1 + dy; } } else { m.x0 = avant.x0 + dx; m.x1 = avant.x1 + dx; m.y0 = avant.y0 + dy; m.y1 = avant.y1 + dy; } scDessinerPages(); };   // la poignée suit la main du point où on l'a prise : elle ne saute pas sous le curseur
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); if (bouge) { if (m.x0 > m.x1) { const t = m.x0; m.x0 = m.x1; m.x1 = t; } if (m.y0 > m.y1) { const t = m.y0; m.y0 = m.y1; m.y1 = t; } scCaler(m, p); m.modifieLe = new Date().toISOString(); SC.annule.push({ t: "change", k: scK(), m: avant }); scNumeroter(scK()); saveState(); } scRendre();
      if (!bouge && !poi && (m.forme === "faute" || m.forme === "remarque")) scChampOuvrir(m); };   // un clic sur une faute rouvre sa bonne forme ; sur une remarque, son texte
    addEventListener("pointermove", mv); addEventListener("pointerup", up); ev.preventDefault(); scRendre(); return;
  }
  const o = scOutil(); if (!o) return; SC.sel = null;
  SC.trace = { page: p.id, x0: a.x, y0: a.y, x1: a.x, y1: a.y, forme: o.forme };
  const mv = e => { const b = at(e); SC.trace.x1 = b.x; SC.trace.y1 = b.y; scDessinerPages(); };
  const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); const t = SC.trace; SC.trace = null; if (!t) return;
    if (Math.abs(t.x1 - t.x0) < 0.012 && Math.abs(t.y1 - t.y0) < 0.008) { const w = scMotSous(t.page, t.x0, t.y0); if (w) Object.assign(t, w); else { t.x0 -= 0.045; t.x1 += 0.045; } }   // un clic sans glisser : le mot sous le clic, lu dans l'encre
    const P = scP(), pt = scPt();
    const m = scCaler({ page: t.page, forme: o.forme, sens: o.sens, passe: o.forme === "faute" || o.forme === "etoile" ? "langue" : P.id, point: o.forme === "etoile" ? "etoile" : o.forme === "remarque" ? "remarque" : o.forme === "faute" ? "orthographe" : pt && pt.id, q: pt && !pt.calcul && ["etoile", "remarque", "faute"].indexOf(o.forme) < 0 ? SC.iq : null, x0: t.x0, y0: t.y0, x1: t.x1, y1: t.y1, bonne: null }, p);
    scPoser(m); SC.sel = m.id; if (["etoile", "remarque", "faute"].indexOf(SC.outil) >= 0) SC.outil = null; scRendre(); if (o.forme === "faute" || o.forme === "remarque") scChampOuvrir(m); };
  addEventListener("pointermove", mv); addEventListener("pointerup", up); ev.preventDefault();
}
// le champ de la bonne forme, sous la faute : une forme neuve, ou son numéro dans la banque du paquet
function scChampOuvrir(m) {
  scChampFermer(false); const pg = document.querySelector(`.sc-page[data-p="${m.page}"]`); if (!pg) return;
  const d = document.createElement("div"); d.className = "sc-champ"; d.style.left = (m.x0 * 100) + "%"; d.style.top = (m.y1 * 100 + 1) + "%";
  const rq = m.forme === "remarque"; if (rq) { d.style.borderColor = "#6b1a2a"; }
  d.innerHTML = rq ? `<span class="sc-tire" title="Tire ici pour déplacer ce champ, s'il cache un mot que tu veux lire ; la place choisie reste pour les champs suivants.">⠿ ta remarque :</span><input id="scChampIn" autocomplete="off" style="width:320px" title="Ta remarque, telle que l'élève la lira à cet endroit de sa copie, puis Entrée. Échap : la remarque reste comme elle était. Suppr, le champ fini : la remarque s'efface.">`
    : `<span class="sc-tire" title="Tire ici pour déplacer ce champ, s'il cache un mot que tu veux lire ; la place choisie reste pour les champs suivants.">⠿ bonne forme :</span><input id="scChampIn" autocomplete="off" spellcheck="false" title="Tape la bonne forme, ou son numéro dans les formes déjà vues, puis Entrée. En tapant, les formes du paquet qui commencent pareil s'affichent : Tab prend la première. Entrée seule : la faute reste, sans bonne forme (un clic sur son trait rouvre ce champ). Suppr, le champ fini : la faute s'efface."><div class="sc-sugg"></div>`;
  pg.appendChild(d); const lien = document.createElementNS("http://www.w3.org/2000/svg", "svg"); lien.setAttribute("class", "sc-lien"); lien.innerHTML = '<line stroke="#c54040" stroke-width="2" stroke-dasharray="4 3"/><circle r="4" fill="#c54040"/>'; if (rq) lien.querySelectorAll("line,circle").forEach(e => { e.setAttribute("stroke", "#6b1a2a"); e.setAttribute("fill", "#6b1a2a"); }); pg.appendChild(lien);
  SC.champ = { id: m.id, el: d, rq, lien, m }; scChampPlacer();
  d.addEventListener("pointerdown", e => { e.stopPropagation(); if (!e.target.closest(".sc-tire")) return; e.preventDefault(); const x0 = e.clientX, y0 = e.clientY, L0 = d.offsetLeft, T0 = d.offsetTop;
    const mv = ev => { d.style.left = (L0 + ev.clientX - x0) + "px"; d.style.top = (T0 + ev.clientY - y0) + "px"; scChampLien(); };
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); const W = pg.clientWidth, H = pg.clientHeight; SC.champDecal = { dx: d.offsetLeft - m.x0 * W, dy: d.offsetTop - m.y0 * H }; try { localStorage.setItem("mjpc_scan_champ", JSON.stringify(SC.champDecal)); } catch (x) {} setTimeout(() => { const i = d.querySelector("input"); if (i) i.focus({ preventScroll: true }); }, 0); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up); });
  const inp = d.querySelector("input"); inp.value = (rq ? m.texte : m.bonne) || ""; setTimeout(() => { inp.focus({ preventScroll: true }); inp.setSelectionRange(inp.value.length, inp.value.length); }, 0);
  const sug = () => { const z = d.querySelector(".sc-sugg"); if (!z) return []; const v = inp.value.trim().toLowerCase(); const L = v && !/^\d+$/.test(v) ? scBanque().map(b => b.forme).filter(f => f.toLowerCase().startsWith(v) && f.toLowerCase() !== v).slice(0, 5) : []; z.innerHTML = L.map((f, i) => `<span${i ? "" : ' class="on"'}>${escapeHtml(f)}</span>`).join(""); return L; };
  inp.addEventListener("input", sug);
  inp.addEventListener("keydown", e => { e.stopPropagation();
    if (e.key === "Tab" && !rq) { const L = sug(); if (L.length) { e.preventDefault(); inp.value = L[0]; sug(); } return; }
    // Suppr au bout du champ (plus rien à effacer à droite) : efface la marque elle-même, comme sur une marque choisie
    if (e.key === "Delete" && inp.selectionStart === inp.value.length && inp.selectionEnd === inp.value.length) { e.preventDefault(); scChampFermer(false); scEffacer(m.id); return; }
    if (e.key === "Enter") { e.preventDefault(); scChampFermer(true); scRendre(); }
    else if (e.key === "Escape") { e.preventDefault(); scChampFermer(false); scRendre(); } });
}
// fermer le champ : ce qui est tapé est gardé (Échap seul l'abandonne) ; un numéro reprend la forme du paquet
function scChampFermer(garder) {
  const c = SC.champ; SC.champ = null; if (!c) return; const inp = c.el && c.el.querySelector("input");
  if (garder !== false && inp && scK()) { const v = inp.value.trim(); const mm = scCopie(scK()).marques[c.id];
    if (mm && c.rq) { if (v !== (mm.texte || "")) { mm.texte = v; mm.modifieLe = new Date().toISOString(); saveState(); } }
    else if (mm && v !== (mm.bonne || "")) { const B = scBanque(); mm.bonne = /^\d{1,3}$/.test(v) && B[+v - 1] ? B[+v - 1].forme : (v || null); mm.modifieLe = new Date().toISOString(); saveState(); } }
  if (c.el) c.el.remove(); if (c.lien) c.lien.remove();
}
// 1444 : le champ se pose au-dessus du mot, sur les lignes déjà lues, relié au mot par un trait : il ne cache jamais la suite de la copie ; tiré ailleurs, il garde cette place pour les champs suivants
try { SC.champDecal = JSON.parse(localStorage.getItem("mjpc_scan_champ") || "null"); } catch (e) { SC.champDecal = null; }
function scChampPlacer() {
  const c = SC.champ; if (!c) return; const d = c.el, m = c.m, pg = d.parentNode; if (!pg) return; const W = pg.clientWidth, H = pg.clientHeight, fw = d.offsetWidth, fh = d.offsetHeight;
  const dec = SC.champDecal || { dx: 0, dy: -(fh + 30) }; let L = m.x0 * W + dec.dx, T = m.y0 * H + dec.dy;
  if (T < 4) T = m.y1 * H + 30;   // la première ligne : pas de place au-dessus, le champ passe dessous
  L = Math.max(4, Math.min(W - fw - 4, L)); T = Math.max(4, Math.min(H - fh - 4, T)); d.style.left = L + "px"; d.style.top = T + "px"; scChampLien();
}
function scChampLien() {
  const c = SC.champ; if (!c || !c.lien) return; const d = c.el, m = c.m, pg = d.parentNode; if (!pg) return; const W = pg.clientWidth, H = pg.clientHeight;
  const L = d.offsetLeft, T = d.offsetTop, fw = d.offsetWidth, fh = d.offsetHeight; const mx = (m.x0 + m.x1) / 2 * W, au = T + fh / 2 < m.y0 * H; const my = au ? m.y0 * H : m.y1 * H;
  const fx = Math.max(L + 12, Math.min(L + fw - 12, mx)), fy = au ? T + fh : T; c.lien.setAttribute("viewBox", "0 0 " + W + " " + H);
  const l = c.lien.querySelector("line"); l.setAttribute("x1", fx); l.setAttribute("y1", fy); l.setAttribute("x2", mx); l.setAttribute("y2", my); const o = c.lien.querySelector("circle"); o.setAttribute("cx", mx); o.setAttribute("cy", my);
}
// ── le clavier ──
function scClavier(e) {
  if (typeof rcClavier === "function" && rcClavier(e)) return;
  if (!SC.ouvert) return;
  if (SC.recap) { if (e.key === "Enter" || e.key === "Escape") { e.preventDefault(); e.stopPropagation(); scRecapFermer(e.key === "Enter"); } return; }
  if (SC.rt) { const t = { Enter: () => scRtFermer(true), Escape: () => scRtFermer(false), ArrowLeft: () => scRtTourner(-1), ArrowRight: () => scRtTourner(1) }[e.key]; if (t) { e.preventDefault(); e.stopPropagation(); t(); } return; } const a = document.activeElement; const ecrit = a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA");
  if (SC.attrib) { if (!ecrit) { if (e.key === "ArrowRight") { e.preventDefault(); scAttribSuivante(); } } return; }
  if (ecrit) return;
  const P = scP(); scToucher();
  if (e.key === "Escape") { const ai = document.getElementById("ruAide"); if (ai && !ai.hidden) return; e.preventDefault(); if (document.getElementById("scModale").classList.contains("show")) { scModaleFermer(); return; } SC.sel = null; SC.outil = null; scRendre(); return; }
  if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) { e.preventDefault(); scAnnuler(); return; }
  if (e.key === "Delete" && SC.sel) { e.preventDefault(); scEffacer(SC.sel); return; }
  if (P.id === "retours") { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scVerdict("bon"); } else if (e.key === "n" || e.key === "N") { e.preventDefault(); scVerdict("arefaire"); } else if (e.key === "ArrowRight") { e.preventDefault(); SC.ir++; scRendre(); } else if (e.key === "ArrowLeft") { e.preventDefault(); SC.ir = Math.max(0, SC.ir - 1); scRendre(); } return; }
  if (e.key === "ArrowRight") { e.preventDefault(); scAllerCopie(SC.ic + 1); return; }
  if (e.key === "ArrowLeft") { e.preventDefault(); scAllerCopie(SC.ic - 1); return; }
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); scRepondre("o"); return; }
  if (e.key === "n" || e.key === "N") { e.preventDefault(); if (!scPt() || scPt().calcul) return; scRepondre("n"); return; }
  if (e.key === "Backspace") { e.preventDefault(); scReculer(); return; }
}
addEventListener("keydown", e => { const avant = e.defaultPrevented; scClavier(e); if (!avant && e.defaultPrevented) e.stopPropagation(); }, true);
// ── le rendu : le haut, la copie, le panneau, le paquet ──
function scRendre() {
  const E = document.getElementById("scanEcran"); if (!E || !SC.ouvert) return;
  if (SC.passe >= SC.passes.length) SC.passe = 0;
  const L = scEtapes(scK() || ""); if (scK() && !L.some(e => e.ip === SC.ip && e.iq === SC.iq) && L.length) { SC.ip = L[0].ip; SC.iq = L[0].iq; }
  const P = scP(), k = scK();
  if (scP() && scP().id === "retours" && !scCorrectionEleve()) SC.passe = 0;
  document.getElementById("scPasses").innerHTML = SC.passes.map((p, i) => { if (p.id === "retours" && !scCorrectionEleve()) return ""; const fait = p.id === "retours" ? scRetoursListe().filter(r => r.etat).length + " / " + scRetoursListe().length : SC.copies.filter(c => (scCopie(c).vu || {})[p.id]).length + " / " + SC.copies.length;
    return `<button class="sc-passe${i === SC.passe ? " on" : ""}" style="--c:${SC_CRIT[p.crit] || "#6b1a2a"}" onclick="scAllerPasse(${i})" title="${p.id === "retours" ? "Relire ce que les élèves t'ont renvoyé, case par case : Entrée, c'est bon ; N, à refaire." : "Passer toutes les copies sur « " + escapeAttr(p.nom) + " » : un critère à la fois, les copies défilent."}"><i>${i + 1}</i>${escapeHtml(p.nom)}<b>${fait}</b></button>`; }).join("");
  const ch = k && P ? (scCopie(k).chrono[P.id] || 0) : 0; document.getElementById("scChrono").textContent = "⏱ " + Math.floor(ch / 60000) + ":" + String(Math.floor(ch / 1000) % 60).padStart(2, "0") + " sur cette copie";
  const man = scManquantes(); document.getElementById("scManque").innerHTML = man.length ? `⚠ ${man.length} page${man.length > 1 ? "s" : ""} de ce paquet ne ${man.length > 1 ? "sont" : "est"} pas dans ce navigateur : remets ton paquet (clé USB) avec « Charger le paquet ». Les marques reviendront d'elles-mêmes.` : "";
  scDessinerPages(); scPanneau(); scPaquet(); scBande(); scZoomAffiche(); scTitreCopie();
  if (typeof rcActualiser === "function") rcActualiser();
  const cur = { passe: P && P.id, copie: k || null, point: scPt() ? scPt().id : null, q: SC.iq };   // l'endroit exact, par identités
  if (JSON.stringify(cur) !== JSON.stringify(state.scanCurseur || null)) { state.scanCurseur = cur; saveState(); }
}
function scPagesAffichees() { if (SC.attrib) { const p = scPagesOrdre()[SC.ia]; return p ? [p] : []; } const k = scK(); return k ? scPagesDe(k) : []; }
// le tracé en cours, dessiné sous la main à chaque mouvement (Paul, 30/10 12:59 : « le trait rouge n'apparaît pas au fur et à mesure de mon tiré, il n'apparaît qu'au relâcher » — le redessin rapide oubliait le tracé)
function scSvgTrace(p, Hs, o) { const t = SC.trace; if (!t || t.page !== p.id) return ""; const c = o ? o.coul : "#333", X0 = Math.min(t.x0, t.x1) * 1000, X1 = Math.max(t.x0, t.x1) * 1000;
  if (t.forme === "faute") { const y = Math.max(t.y0, t.y1) * Hs + 1.5; return `<line class="sc-trace" x1="${X0}" y1="${y}" x2="${Math.max(X1, X0 + 1)}" y2="${y}" stroke="${c}" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`; }   // une faute : le trait rouge lui-même, tel qu'il restera
  return `<rect class="sc-trace" x="${X0}" y="${Math.min(t.y0, t.y1) * Hs}" width="${X1 - X0}" height="${Math.abs(t.y1 - t.y0) * Hs}" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>`; }
function scDessinerPages() {
  const Z = document.getElementById("scCopie"); const ps = scPagesAffichees(); const P = scP();
  if (!ps.length) { Z.dataset.sig = ""; Z.innerHTML = Object.keys(SC.pages).length ? `<div class="sc-vide">Aucune copie à afficher.</div>` : `<label class="sc-vide sc-vide-btn" title="Choisir ton paquet scanné, sur ta clé : un PDF, ou des photos (plusieurs à la fois). Il reste dans ce navigateur, jamais au site.">📄 Charger le paquet<small>un PDF ou des photos · il reste dans ce navigateur, jamais au site</small><input type="file" accept="application/pdf,.pdf,image/*" multiple onchange="scCharger(event)" hidden></label>`; return; }
  if (P.id === "retours" && !SC.attrib) { Z.dataset.sig = ""; scDessinerRetour(Z); return; }
  const lw = Math.max(240, Z.clientWidth - 30) * (SC.zoom || 1); SC.upx = 1000 / lw;   // la page à la largeur de la zone, fois ton zoom ; SC.upx : une unité de dessin par point d'écran
  const o = scOutil(); const curseur = SC.attrib ? "default" : scCurseur(o ? o.coul : "#6b1a2a");
  let html = ""; const champ = SC.champ ? SC.champ.id : null;
  ps.forEach(p => { const im = SC.imgs[p.id]; const Hs = Math.round(1000 * p.h / p.w);
    let svg = ""; if (!SC.attrib) { const ms = scMarquesPage(p.id).filter(scVisible); ms.forEach(m => { svg += scSvgMarque(m, p, m.id === SC.sel); }); }
    svg += scSvgTrace(p, Hs, o);
    html += `<div class="sc-page${p.blanche ? " blanche" : ""}" data-p="${p.id}" style="width:${Math.round(lw)}px;height:${Math.round(lw * p.h / p.w)}px;cursor:${curseur}">${im ? `<img src="${im.url}" alt="" draggable="false">` : `<div class="sc-absente">Page absente de ce navigateur</div>`}<svg viewBox="0 0 1000 ${Hs}" preserveAspectRatio="none">${svg}</svg></div>`; });
  const sig = ps.map(p => p.id + ":" + p.w + "x" + p.h).join("|") + "|" + (SC.attrib ? 1 : 0);
  const garde = Z.dataset.sig === sig && Z.querySelectorAll(".sc-page").length === ps.length;
  if (garde) { Z.querySelectorAll(".sc-page").forEach((e, i) => { e.style.cursor = curseur; const p = ps[i]; if (p) { e.style.width = Math.round(lw) + "px"; e.style.height = Math.round(lw * p.h / p.w) + "px"; } }); Z.querySelectorAll(".sc-page > svg:not(.sc-lien)").forEach((s, i) => { const p = ps[i]; if (!p) return; const Hs = Math.round(1000 * p.h / p.w); let svg = ""; scMarquesPage(p.id).filter(scVisible).forEach(m => { svg += scSvgMarque(m, p, m.id === SC.sel); }); svg += scSvgTrace(p, Hs, o); s.innerHTML = svg; }); scChampPlacer(); return; }
  Z.innerHTML = html; Z.dataset.sig = sig;
  if (champ) { const m = scCopie(scK()).marques[champ]; SC.champ = null; if (m) scChampOuvrir(m); }
}
function scChip(n, txt) { return `<span class="sc-chip" style="background:${SC_FOND[n]};border-color:${SC_COUL[n]}">${txt}</span>`; }
function scPanneau() {
  const Z = document.getElementById("scPanneau"); const P = scP(), k = scK();
  const a = document.activeElement; if (!SC.attrib && a && a.id !== "scInit" && Z.contains(a) && (a.tagName === "INPUT" || a.tagName === "TEXTAREA")) { SC.panneauAttend = true; return; }   // un champ en cours n'est jamais touché par un rendu
  if (SC.attrib) { scPanneauAttrib(Z); return; }
  if (P.id === "retours") { scPanneauRetours(Z); return; }
  if (!k) { Z.innerHTML = `<div class="sc-bloc"><h3>Le paquet</h3><p>Charge ton paquet, puis donne à chaque page les initiales de son élève.</p></div>`; return; }
  const s = scCopie(k); const pt = scPt(); let h = "";
  if (P.id === "langue" && scLignesManquent(k)) h += `<div class="sc-bloc sc-lig-manque"><h3>D'abord : les lignes écrites</h3><p>Compte les lignes écrites de cette copie, tape le nombre, Entrée. Tant qu'il manque, la copie ne se quitte pas : la longueur et le compte des fautes en dépendent.</p>${scLignesChamp(k, true)}<p class="sc-lig-alerte" id="scLigAlerte" hidden>⚠ Il manque le nombre de lignes écrites : tape-le ici, puis Entrée.</p></div>`;
  h += `<div class="sc-bloc"><h3>Passe ${SC.passe + 1} · ${escapeHtml(P.nom)} · copie ${SC.ic + 1} sur ${SC.copies.length}</h3><div class="sc-nom">${escapeHtml(nomEleveDe(k) || k)}</div>`;
  h += `<div class="sc-outils"><button class="sc-btn${SC.outil === "remarque" ? " on" : ""}" onclick="SC.outil=SC.outil==='remarque'?null:'remarque';scRendre()" title="Le pinceau de ta remarque : un tracé (un cadre en pointillé), puis tu tapes ta phrase ; l'élève la lit à cet endroit de sa copie. Un seul tracé, puis le pinceau revient à la question.">💬 Remarque</button>${P.id !== "langue" ? `<button class="sc-btn${SC.outil === "faute" ? " on" : ""}" onclick="SC.outil=SC.outil==='faute'?null:'faute';scRendre()" title="Une faute vue pendant cette passe : un tracé souligné en rouge, puis sa bonne forme ; elle compte avec celles de la langue. Un seul tracé, puis le pinceau revient à la question.">Faute</button>` : ""}<button class="sc-btn${SC.toutVoir ? " on" : ""}" onclick="SC.toutVoir=!SC.toutVoir;scRendre()" title="Voir aussi les marques des autres passes (les fautes, les autres critères). Clique encore pour ne voir que celles de cette passe.">👁 Toutes les marques</button><button class="sc-btn" onclick="scReplier(true)" title="Replier ce panneau : la copie prend toute la largeur ; la question en cours reste dans une bande en haut. Entrée, N et les flèches marchent pareil.">⇥ Replier</button></div>`;
  h += `<div class="sc-pts">${P.pts.map((p, i) => { const r = scCase(p, k); return `<span class="${i === SC.ip ? "on" : ""}" style="${r && r.complet ? "border-color:" + SC_COUL[r.c.niveau] : ""}">${i + 1} · ${escapeHtml(p.titre)}${r && r.complet ? " ✓" : ""}</span>`; }).join("")}</div></div>`;
  if (pt) {
    const rep = s.rep[pt.id] || {};
    if (pt.calcul === "fautes") {
      const F = scFautes(k), n = scLignesCopie(k);
      h += `<div class="sc-bloc"><h3>Les fautes · toute la copie</h3><p>Tu lis la copie en entier, une seule fois. Souligne chaque faute au pinceau (appuie, glisse, lâche), tape la bonne forme ou son numéro, Entrée. Entrée sur la copie : tu as fini les fautes.</p>
        <p class="sc-m">${F.length} faute${F.length > 1 ? "s" : ""} · ${n ? n + " lignes écrites" : "lignes écrites à taper"}</p>
        ${scLignesManquent(k) ? "" : scLignesChamp(k, false)}
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${scPagesDe(k).map((p, i) => `<button class="sc-btn" onclick="scTournerPage('${p.id}')" title="Tourner la page ${i + 1} de cette copie d'un quart de tour vers la droite ; ses marques tournent avec elle.">↻ Page ${i + 1}</button><button class="sc-btn" onclick="scRecadrerDebut('${p.id}')" title="Retoucher la page ${i + 1} comme une photo : le cadre (ce qui dépasse, une autre copie, la table, disparaît de la copie et du fichier de l'élève) et la rotation degré par degré. Rien n'est perdu, les marques suivent leurs mots.">✂ Page ${i + 1}</button>`).join("")}${scPagesDe(k).length > 1 ? `<button class="sc-btn" onclick="scOrdrePages('${escapeAttr(k)}')" title="Changer l'ordre des pages de cette copie : la dernière passe en premier.">⇄ Ordre des pages</button>` : ""}</div>
        <div style="margin-top:8px"><button class="sc-btn${SC.outil === "etoile" ? " on" : ""}" onclick="SC.outil=SC.outil==='etoile'?null:'etoile';scRendre()" title="Le pinceau doré : surligne la phrase qui t'a touché. Un seul tracé, puis le pinceau revient aux fautes.">★ La phrase qui t'a touché</button></div></div>`;
      const B = scBanque(); h += `<div class="sc-bloc"><h3>Les formes déjà vues dans le paquet</h3>${B.length ? `<div class="sc-banque">${B.map((b, i) => `<span class="sc-touche">${i + 1}</span><span>${escapeHtml(b.forme)} <i class="sc-m">· ${b.copies.size} copie${b.copies.size > 1 ? "s" : ""}</i></span>`).join("")}</div>` : `<p class="sc-m">Aucune encore : chaque forme tapée prend un numéro.</p>`}</div>`;
    } else if (pt.calcul === "lignes") {
      const r = scCase(pt, k); h += `<div class="sc-bloc"><h3>${escapeHtml(pt.titre)} · calculé</h3><p>${r ? scChip(r.c.niveau, r.txt) : "Les lignes écrites manquent : tape-les ici, Entrée."}</p><p>${scLignesChamp(k, !r)}</p><p class="sc-m">Entrée : point suivant.</p></div>`;
    } else {
      h += `<div class="sc-bloc"><h3>${escapeHtml(pt.titre)} · ${pt.poids} points</h3>${scQuestions(pt, rep).map(q => { const v = rep[q.cle]; const nb = Object.values(s.marques).filter(m => m.point === pt.id && m.q === q.cle).length;
        const sel = q.cle === SC.iq, lien = scCaseLiee(pt, q), forme = q.marque ? (q.marque.forme === "surligne" ? "il surligne une citation" : q.marque.forme === "marge" ? "il trace un trait dans la marge (un paragraphe)" : "il encadre un mot") : "";
        return `<div class="sc-q${sel ? " on" : ""}" onclick="SC.iq='${q.cle}';scRendre()" title="${sel ? "La question en cours : réponds Oui (Entrée) ou Non (N)." : "Aller à cette question : sa réponse se change, et la case qu'elle décide s'entoure en bas."}${q.marque ? " Le pinceau de cette question : " + forme + (q.marque.sens === "non" ? " ; une marque posée répond « non »." : q.marque.sens === "oui" ? " ; une marque posée répond « oui »." : ".") : " Pas de pinceau pour cette question."}"><span>${escapeHtml(q.texte)}</span><b class="${v === "n" ? "non" : v === "o" ? "oui" : ""}">${v === "n" ? "NON" : v === "o" ? "oui" : "à répondre"}${nb ? " · " + nb + " marque" + (nb > 1 ? "s" : "") : ""}</b><em>${escapeHtml(q.moment)} · ${q.marque ? "pinceau : " + (q.marque.forme === "surligne" ? "surligné" : q.marque.forme === "marge" ? "trait dans la marge" : "encadré") : "sans pinceau"}</em>${sel ? `${lien ? `<div class="sc-q-si">${lien.dit} : « ${escapeHtml(lien.c.fait)} » <b>${pt.bareme[lien.c.niveau]}</b></div>` : ""}<div class="sc-q-rep"><button class="sc-btn${v === "o" ? " on" : ""}" onclick="event.stopPropagation();scRepondre('o')" title="Oui : la réponse est rangée, et la question suivante vient. Même chose que la touche Entrée.">Oui · Entrée</button><button class="sc-btn${v === "n" ? " on" : ""}" onclick="event.stopPropagation();scRepondre('n')" title="Non : la réponse est rangée${lien && lien.dit === "Si non" ? ", la copie tombe dans la case entourée en bas" : ""}, et la question suivante vient. Même chose que la touche N.">Non · N</button></div>` : ""}</div>`; }).join("")}</div>`;
      const r = scCase(pt, k);
      h += `<div class="sc-bloc"><h3>La case où tombe cette copie</h3>${pt.cases.map(c => { const li = SC.iq && scQ(pt, SC.iq) ? scCaseLiee(pt, scQ(pt, SC.iq)) : null; return `<div class="sc-case${r && r.c === c ? " on" : ""}${li && li.c === c ? " si" : ""}" title="${li && li.c === c ? li.dit + " à la question en cours, la copie tombe ici. " : ""}${c.tache ? "À reprendre : " + escapeAttr(c.tache) + (scCorrectionEleve() ? (c.relire ? " — tu la relis (passe des retours)." : " — l'élève la valide seul.") : " — l'élève la lit dans son fichier.") : "Rien à reprendre."}"><i style="background:${SC_COUL[c.niveau]}"></i><span>${escapeHtml(r && r.c === c ? r.txt : c.fait)}${c.tache && scCorrectionEleve() ? (c.relire ? " <em class=\"sc-m\">✎ relue</em>" : " <em class=\"sc-m\">✓ seul</em>") : ""}</span><b>${pt.bareme[c.niveau]}</b></div>`; }).join("")}<p class="sc-m">${r ? (r.complet ? "Calculée de tes réponses : tu ne choisis jamais la case." : "Provisoire : il reste des questions.") : "Réponds aux questions."}</p></div>`;
      const vus = SC.copies.map((c, i) => ({ i, r: scCase(pt, c) })).filter(x => x.r && x.r.complet);
      h += `<div class="sc-bloc"><h3>Sur ce point, les copies déjà vues</h3><div class="sc-points">${vus.length ? vus.map(x => `<span title="${escapeAttr(nomEleveDe(SC.copies[x.i]) || "")}"><i style="background:${SC_COUL[x.r.c.niveau]}"></i>${x.i + 1}</span>`).join("") : '<span class="sc-m">aucune encore</span>'}</div></div>`;
    }
  }
  const nt = scNote(k); h += `<div class="sc-bloc"><h3>Cette copie</h3><p>${nt.ok ? "Note : <b>" + String(nt.n).replace(".", ",") + " / " + nt.tot + "</b>" : "La note se calcule quand tous les points sont passés."}</p><button class="sc-btn" onclick="scRecap(scK(), false)" title="Le récapitulatif de cette copie : la note, la grille point par point, le bilan tel que l'élève le lira, « À reprendre » et les fautes. Il s'ouvre aussi tout seul quand tous ses points sont passés.">📋 Le récapitulatif</button></div>`;
  h += `<div class="sc-bloc sc-touches"><h3>Les touches</h3><div class="sc-cle"><span>pinceau</span><span>appuie, glisse, lâche : la forme vient avec la question ; un clic sur un mot le prend ; un clic dans le blanc relâche</span><span class="sc-touche">Entrée</span><span>oui · suivant</span><span class="sc-touche">N</span><span>non · suivant</span><span class="sc-touche">⌫</span><span>question précédente</span><span class="sc-touche">→ ←</span><span>copie suivante · précédente</span><span>clic</span><span>sur une marque : la choisir ; tire-la ou ses poignées</span><span class="sc-touche">Suppr</span><span>effacer la marque choisie</span><span class="sc-touche">Ctrl+Z</span><span>annuler</span><span class="sc-touche">?</span><span>l'aide (celle de l'app, pour cet écran)</span></div></div>`;
  const haut = Z.scrollTop; Z.innerHTML = h; Z.scrollTop = haut;
}
function scLignesChamp(k, gros) { const s = scCopie(k), n = scLignesCopie(k);
  return `<label class="${gros ? "sc-lig-gros" : "sc-m"}" title="Le nombre de lignes écrites de cette copie : il compte pour la longueur (trente lignes) et pour le compte des fautes. Sur une copie de l'appli, il est compté d'office ; sur une photo, tu le tapes, puis Entrée.">Lignes écrites : <input id="scLig" type="number" min="0" max="120" value="${s.lignes != null ? s.lignes : (n || "")}" onkeydown="if(event.key==='Enter'){event.preventDefault();event.stopPropagation();const v=this.value;this.blur();scLignesFixer(v);}" onchange="scLignesFixer(this.value)"></label>`; }
function scLignesFixer(v) { const k = scK(); if (!k) return; const s = scCopie(k); s.lignes = v === "" ? null : Math.max(0, Math.round(+v)); saveState(); scRendre(); }
function scPanneauAttrib(Z) {
  const L = scPagesOrdre(); const p = L[SC.ia]; const reste = scPagesSans().length; const prec = scPrecedentEleve();
  Z.innerHTML = `<div class="sc-bloc"><h3>Le paquet · page ${SC.ia + 1} sur ${L.length}</h3><p>Tape les initiales de l'élève de cette page, Entrée. <b>Entrée seule</b> : même élève que la page d'avant${prec ? " (" + escapeHtml(nomEleveDe(prec)) + ")" : ""}.</p>
    <input id="scInit" class="sc-init" autocomplete="off" placeholder="initiales" title="Les initiales, dans n'importe quel ordre (CE ou EC pour Chauvin Emma)."><div id="scInitSug" class="sc-m"></div>
    <button class="sc-btn" onclick="scTournerPage('${p ? p.id : ""}')" title="Tourner cette page d'un quart de tour vers la droite (une photo prise de côté). Ses marques tournent avec elle.">↻ Tourner</button>
    <button class="sc-btn" onclick="scRecadrerDebut('${p ? p.id : ""}')" title="Retoucher cette page comme une photo : le cadre (ce qui dépasse, une autre copie, la table, disparaît de la copie et du fichier de l'élève) et la rotation degré par degré. Rien n'est perdu.">✂ Retoucher</button>
    ${p && p.blanche ? `<p class="sc-alerte">L'appli n'y voit aucune ligne écrite : page blanche, sautée.</p><button class="sc-btn" onclick="scBlanche(false)" title="Cette page porte bien une copie : elle reprend sa place dans le paquet.">Ce n'est pas une page blanche</button>` : `<button class="sc-btn" onclick="scBlanche(true)" title="Écarter cette page : elle ne va à aucun élève.">Page blanche</button>`}
    <p class="sc-m">${reste} page${reste > 1 ? "s" : ""} sans élève · ${SC.copies.length} copie${SC.copies.length > 1 ? "s" : ""} reconnue${SC.copies.length > 1 ? "s" : ""}. L'ordre du paquet devient celui de tes flèches.</p>
    ${reste ? "" : `<button class="sc-btn" onclick="SC.attrib=false;scAllerCopie(0)" title="Commencer la correction, passe 1.">Corriger</button>`}</div>`;
  const inp = document.getElementById("scInit"); setTimeout(() => inp.focus({ preventScroll: true }), 0);
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
    <div class="sc-bloc"><h3>Ta phrase de « à refaire »</h3><p class="sc-m">Ce que reçoit l'élève, avec sa tâche, quand tu dis « à refaire ». Tu la donnes une fois pour toutes.</p><textarea id="scARefaire" rows="2" style="width:100%;font:14px system-ui" title="Enregistrée au sujet dès que tu quittes le champ ; elle part dans les fichiers École Directe que tu fabriques ensuite." onchange="scARefaireFixer(this.value)">${escapeHtml(SC.aRefaire || "")}</textarea></div>
    <div class="sc-bloc sc-touches"><h3>Les touches</h3><div class="sc-cle"><span class="sc-touche">Entrée</span><span>c'est bon</span><span class="sc-touche">N</span><span>à refaire : l'élève reçoit la tâche à refaire</span><span class="sc-touche">→ ←</span><span>retour suivant · précédent</span></div></div>`;
}
function scARefaireFixer(v) { SC.aRefaire = String(v || "").trim(); ruEcrire(["redactions", RU.id, "config", "aRefaire"], SC.aRefaire || null, "ta phrase de « à refaire »"); }
function scRetoursRelire() { ruLire(scCheminRetours()).then(rt => { SC.retours = rt || {}; scRendre(); toast("Retours relus."); }); }
function scDessinerRetour(Z) {
  const r = scRetoursListe()[SC.ir]; if (!r) { Z.innerHTML = '<div class="sc-vide">Aucun retour à relire.</div>'; return; }
  const s = scCopie(r.eleve); const ms = Object.values(s.marques).filter(m => (r.marque && m.id === r.marque) || (!r.marque && m.point === r.point)); const m = ms[0];
  const p = m ? SC.pages[m.page] : scPagesDe(r.eleve)[0]; const im = p && SC.imgs[p.id];
  if (!p || !im) { Z.innerHTML = '<div class="sc-vide">La page de ce retour n\'est pas dans ce navigateur : remets ton paquet.</div>'; return; }
  const y0 = m ? Math.max(0, m.y0 - 0.06) : 0, y1 = m ? Math.min(1, m.y1 + 0.08) : 0.3; const W = Math.min(Z.clientWidth - 40, 900); const Hp = W * p.h / p.w;
  Z.innerHTML = `<div class="sc-retour"><div class="sc-extrait" style="width:${W}px;height:${Math.round((y1 - y0) * Hp)}px;background-image:url(${im.url});background-size:${W}px ${Math.round(Hp)}px;background-position:0 -${Math.round(y0 * Hp)}px">${m ? `<div class="sc-ext-m" style="left:${m.x0 * 100}%;top:${(m.y0 - y0) * Hp}px;width:${(m.x1 - m.x0) * 100}%;height:${(m.y1 - m.y0) * Hp}px"></div>` : ""}</div><div class="sc-papillon grand">${escapeHtml(r.texte)}</div></div>`;
}
function scVerdict(v) { const L = scRetoursListe(); const r = L[SC.ir]; if (!r) return; const o = Object.assign({}, SC.retours[r.eleve][r.cle], { etat: v, relu: new Date().toISOString() }, v === "arefaire" && SC.aRefaire ? { phrase: SC.aRefaire } : {});
  SC.retours[r.eleve][r.cle] = o; ruEcrire(scCheminRetours([r.eleve, r.cle]), o, "un retour relu");
  // l'onglet de test de l'élève reçoit ton verdict, comme l'élève le reçoit du site
  scPousser(r.eleve); SC.ir = Math.min(SC.ir + 1, L.length - 1); scRendre(); }
// ── l'aide, la fenêtre ──
RU_AIDES.scan = { ou: "Corriger sur les scans", l: [["le pinceau", "appuie, glisse, lâche : la forme vient avec la question (souligné rouge, une faute ; surligné, une citation ; encadré, un mot ; trait dans la marge, un paragraphe) ; un clic sans glisser prend le mot sous la souris"], ["un clic dans le blanc", "hors de la page : l'outil se relâche (le champ se ferme, gardé ; la marque choisie et l'outil d'un tracé se relâchent)"], ["Entrée / N", "oui · non, puis la question suivante ; une marque qui répond « non » ou « oui » répond pour toi"], ["⌫", "la question précédente"], ["→ ←", "la copie suivante · précédente ; dans les retours : le retour suivant · précédent"], ["clic sur une marque", "la choisir ; sur une faute, sa bonne forme se rouvre (pour la taper ou la changer) ; sur une remarque, son texte ; tire-la, ou ses poignées"], ["Suppr · Ctrl+Z", "effacer la marque choisie · annuler"], ["★", "la phrase qui t'a touché, surlignée en doré (passe de la langue)"], ["Ctrl + molette", "zoomer, sous la souris ; « ↔ Largeur » revient à la largeur de l'écran"], ["Maj (tenue)", "la loupe : un rond grossi trois fois sous la souris"], ["Alt (tenue)", "la copie nue : les marques disparaissent tant que tu tiens la touche"], ["un clic sur un mot", "le trait prend la longueur du mot, lue dans l'encre (glisse si l'appli se trompe)"], ["Tab", "dans la bonne forme : prend la première forme du paquet qui commence pareil"], ["💬 Remarque · Faute", "un tracé avec ce pinceau, puis le pinceau revient à la question"], ["⇥ Replier", "la copie prend la largeur ; la question reste dans une bande"], ["📋 Le récapitulatif", "la note, la grille, le bilan tel que l'élève le lira, « À reprendre » ; il s'ouvre seul quand tous les points d'une copie sont passés : Entrée, la copie suivante ; Échap, rester"], ["les lignes écrites", "demandées au début de chaque copie, passe de la langue : tape le nombre, Entrée ; tant qu'il manque, la copie ne se quitte pas"], ["✂ Page", "retoucher la photo : le cadre et la rotation degré par degré (flèches), Entrée garde, Échap annule ; les marques suivent leurs mots"], ["⠿ bonne forme", "le champ se pose au-dessus du mot ; tire-le par ⠿ s'il cache quelque chose, il garde cette place"], ["le paquet", "il reste dans ce navigateur et sur ta clé, jamais au site ; les marques et les réponses vont au site, chacune avec son identité"]] };
document.addEventListener("focusout", () => setTimeout(() => { if (SC.panneauAttend && SC.ouvert) { const a = document.activeElement; if (!(a && document.getElementById("scPanneau").contains(a))) { SC.panneauAttend = false; scPanneau(); } } }, 0));
function scModale(h) { const m = document.getElementById("scModale"); m.querySelector(".sc-modale-c").innerHTML = h + `<div style="text-align:right;margin-top:10px"><button class="sc-btn" onclick="scModaleFermer()" title="Fermer cette fenêtre (Échap fait pareil) ; rien n'est perdu.">Fermer</button></div>`; m.classList.add("show"); }
function scModaleFermer() { document.getElementById("scModale").classList.remove("show"); }
addEventListener("resize", () => { if (SC.ouvert) scDessinerPages(); });
// ── les copies vierges de l'appli : quatre repères aux coins, les lignes à leur place ; au scan, la page est remise droite
// et ses lignes sont connues d'avance (la détection des repères : test-reperes.html, mesurée le 29/10 : 0,2 mm sur synthèse) ──
const SC_F = { W: 210, H: 297, cote: 16, trou: 8, reperes: [[20, 20], [190, 20], [190, 277], [20, 277]], l0: 36, pas: 8, n: 30, marge: 35, droite: 195 };
function scFeuilleSVG() {
  const s = ['<rect width="210" height="297" fill="#fff"/>'];
  for (let i = 0; i < SC_F.n; i++) { const y = SC_F.l0 + i * SC_F.pas; s.push(`<line x1="${SC_F.marge - 8}" y1="${y}" x2="${SC_F.droite}" y2="${y}" stroke="#bcd0e8" stroke-width="0.35"/>`); }
  s.push(`<line x1="${SC_F.marge}" y1="${SC_F.l0 - 8}" x2="${SC_F.marge}" y2="${SC_F.l0 + (SC_F.n - 1) * SC_F.pas + 2}" stroke="#f0b8b8" stroke-width="0.4"/>`);
  SC_F.reperes.forEach(([x, y], i) => { const h = SC_F.cote / 2; s.push(`<rect x="${x - h}" y="${y - h}" width="${SC_F.cote}" height="${SC_F.cote}" fill="#000"/>`); if (!i) s.push(`<rect x="${x - SC_F.trou / 2}" y="${y - SC_F.trou / 2}" width="${SC_F.trou}" height="${SC_F.trou}" fill="#fff"/>`); });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" width="210mm" height="297mm">${s.join("")}</svg>`;
}
function scImprimerVierges() {
  const n = Math.max(1, (state.classe || []).length + 4); const w = window.open("", "_blank"); if (!w) { toast("Le navigateur a bloqué la fenêtre d'impression : autorise-la pour ce fichier."); return; }
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Copies vierges</title><style>@page{size:A4;margin:0}body{margin:0}.p{width:210mm;height:297mm;page-break-after:always}</style></head><body>${Array.from({ length: n }, () => `<div class="p">${scFeuilleSVG()}</div>`).join("")}<script>setTimeout(()=>print(),300)<\/script></body></html>`); w.document.close();
}
function scResoudre(A, b) { const n = b.length; for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]]; if (Math.abs(A[c][c]) < 1e-12) return null; for (let r = c + 1; r < n; r++) { const f = A[r][c] / A[c][c]; for (let k = c; k < n; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; } } const x = new Array(n).fill(0); for (let r = n - 1; r >= 0; r--) { let s = b[r]; for (let k = r + 1; k < n; k++) s -= A[r][k] * x[k]; x[r] = s / A[r][r]; } return x; }
function scHomographie(src, dst) { const A = [], b = []; for (let i = 0; i < 4; i++) { const [X, Y] = src[i], [x, y] = dst[i]; A.push([X, Y, 1, 0, 0, 0, -x * X, -x * Y]); b.push(x); A.push([0, 0, 0, X, Y, 1, -y * X, -y * Y]); b.push(y); } const h = scResoudre(A, b); return h ? [[h[0], h[1], h[2]], [h[3], h[4], h[5]], [h[6], h[7], 1]] : null; }
function scAppliquer(H, x, y) { const w = H[2][0] * x + H[2][1] * y + H[2][2]; return [(H[0][0] * x + H[0][1] * y + H[0][2]) / w, (H[1][0] * x + H[1][1] * y + H[1][2]) / w]; }
function scReperes(src) {   // les quatre repères (le haut gauche évidé) : l'homographie page en mm → image en points, ou null
  const k = Math.min(1, 1400 / Math.max(src.width, src.height)), w = Math.round(src.width * k), h = Math.round(src.height * k);
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const cx = cv.getContext("2d"); cx.drawImage(src, 0, 0, w, h);
  const px = cx.getImageData(0, 0, w, h).data, N = w * h, g = new Uint8Array(N); for (let i = 0, j = 0; i < N; i++, j += 4) g[i] = (px[j] * 299 + px[j + 1] * 587 + px[j + 2] * 114) / 1000;
  const W1 = w + 1, I = new Float64Array(W1 * (h + 1)); for (let y = 0; y < h; y++) { let s = 0; for (let x = 0; x < w; x++) { s += g[y * w + x]; I[(y + 1) * W1 + x + 1] = I[y * W1 + x + 1] + s; } }
  const R = Math.max(8, Math.round(Math.max(w, h) / 12)), sb = new Uint8Array(N);
  for (let y = 0; y < h; y++) { const y0 = Math.max(0, y - R), y1 = Math.min(h, y + R + 1); for (let x = 0; x < w; x++) { const x0 = Math.max(0, x - R), x1 = Math.min(w, x + R + 1); sb[y * w + x] = g[y * w + x] < 0.62 * ((I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0]) / ((x1 - x0) * (y1 - y0))) ? 1 : 0; } }
  const lab = new Int32Array(N), pile = new Int32Array(N), C = [];
  for (let s = 0; s < N; s++) { if (!sb[s] || lab[s]) continue; const id = C.length + 1; let n = 0, sx = 0, sy = 0, x0 = w, x1 = 0, y0 = h, y1 = 0, bord = false, top = 0; pile[top++] = s; lab[s] = id;
    while (top) { const p = pile[--top], x = p % w, y = (p / w) | 0; n++; sx += x; sy += y; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; if (!x || !y || x === w - 1 || y === h - 1) bord = true;
      if (x > 0 && sb[p - 1] && !lab[p - 1]) { lab[p - 1] = id; pile[top++] = p - 1; } if (x < w - 1 && sb[p + 1] && !lab[p + 1]) { lab[p + 1] = id; pile[top++] = p + 1; } if (y > 0 && sb[p - w] && !lab[p - w]) { lab[p - w] = id; pile[top++] = p - w; } if (y < h - 1 && sb[p + w] && !lab[p + w]) { lab[p + w] = id; pile[top++] = p + w; } }
    C.push({ n, cx: sx / n, cy: sy / n, x0, x1, y0, y1, bord }); }
  const cands = []; for (const c of C) { if (c.bord || c.n < N * 0.0004 || c.n > N * 0.03) continue; const bw = c.x1 - c.x0 + 1, bh = c.y1 - c.y0 + 1; if (c.n / (bw * bh) < 0.45 || Math.max(bw, bh) / Math.min(bw, bh) > 2.5) continue;
    const r = Math.max(1, Math.round(Math.min(bw, bh) / 7)); let cl = 0, t = 0; for (let y = Math.round(c.cy) - r; y <= Math.round(c.cy) + r; y++) for (let x = Math.round(c.cx) - r; x <= Math.round(c.cx) + r; x++) { if (x < 0 || y < 0 || x >= w || y >= h) continue; t++; if (!sb[y * w + x]) cl++; } cands.push(Object.assign({}, c, { evide: t > 0 && cl / t > 0.7 })); }
  cands.sort((a, b) => b.n - a.n); const Q = cands.slice(0, 14); let best = null, aire = 0;
  for (let a = 0; a < Q.length; a++) for (let b = a + 1; b < Q.length; b++) for (let c = b + 1; c < Q.length; c++) for (let d = c + 1; d < Q.length; d++) { const q = [Q[a], Q[b], Q[c], Q[d]]; if (q.filter(m => m.evide).length !== 1) continue; const ns = q.map(m => m.n); if (Math.max(...ns) / Math.min(...ns) > 4) continue;
    const mx = q.reduce((s, m) => s + m.cx, 0) / 4, my = q.reduce((s, m) => s + m.cy, 0) / 4; q.sort((u, v) => Math.atan2(u.cy - my, u.cx - mx) - Math.atan2(v.cy - my, v.cx - mx)); let A = 0, cv2 = true, sg = 0;
    for (let i = 0; i < 4; i++) { const p = q[i], r = q[(i + 1) % 4], s = q[(i + 2) % 4]; A += p.cx * r.cy - r.cx * p.cy; const z = (r.cx - p.cx) * (s.cy - r.cy) - (r.cy - p.cy) * (s.cx - r.cx); if (!sg) sg = Math.sign(z); else if (Math.sign(z) !== sg) cv2 = false; } A = Math.abs(A) / 2; if (cv2 && A > aire && A > N * 0.25) { aire = A; best = q.slice(); } }
  if (!best) return null; const i0 = best.findIndex(m => m.evide); const pts = [0, 1, 2, 3].map(i => best[(i0 + i) % 4]).map(m => [m.cx / k, m.cy / k]);
  return scHomographie(SC_F.reperes, pts);
}
function scRedresser(src, H) {   // la page remise droite, à 6 points par millimètre
  const P = 6, Wp = SC_F.W * P, Hp = SC_F.H * P; const sx = src.getContext("2d").getImageData(0, 0, src.width, src.height); const s = sx.data, sw = src.width, sh = src.height;
  const out = document.createElement("canvas"); out.width = Wp; out.height = Hp; const oc = out.getContext("2d"); const od = oc.createImageData(Wp, Hp); const d = od.data;
  for (let j = 0; j < Hp; j++) for (let i = 0; i < Wp; i++) { const [x, y] = scAppliquer(H, (i + 0.5) / P, (j + 0.5) / P); const o = (j * Wp + i) * 4; if (!(x >= 0 && y >= 0 && x < sw - 1 && y < sh - 1)) { d[o] = d[o + 1] = d[o + 2] = 255; d[o + 3] = 255; continue; }
    const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0; for (let c = 0; c < 3; c++) { const a = s[(y0 * sw + x0) * 4 + c], b = s[(y0 * sw + x0 + 1) * 4 + c], e = s[((y0 + 1) * sw + x0) * 4 + c], f = s[((y0 + 1) * sw + x0 + 1) * 4 + c]; d[o + c] = (a * (1 - fx) + b * fx) * (1 - fy) + (e * (1 - fx) + f * fx) * fy; } d[o + 3] = 255; }
  oc.putImageData(od, 0, 0); return out;
}
function scLignesConnues(cv) {   // sur la copie de l'appli, les lignes sont à leur place : une ligne est écrite si sa bande porte de l'encre
  const W = 420, H = Math.round(W * SC_F.H / SC_F.W), c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d"); x.drawImage(cv, 0, 0, W, H);
  const d = x.getImageData(0, 0, W, H).data, k = W / SC_F.W; const res = [];
  for (let i = 0; i < SC_F.n; i++) { const yb = SC_F.l0 + i * SC_F.pas; const ya = Math.round((yb - 6.5) * k), yz = Math.round((yb - 0.6) * k), xa = Math.round((SC_F.marge + 1) * k), xz = Math.round(SC_F.droite * k);
    let n = 0, t = 0, g = -1, dr = -1; for (let yy = ya; yy < yz; yy++) for (let xx = xa; xx < xz; xx++) { const o = (yy * W + xx) * 4, r = d[o], gg = d[o + 1], bb = d[o + 2]; t++; if ((r + gg + bb) / 3 < 150 && !(r > gg + 30 && r > bb + 30)) { n++; if (g < 0 || xx < g) g = xx; if (xx > dr) dr = xx; } }
    res.push({ y: +((yb - 3) / SC_F.H).toFixed(4), x0: g >= 0 ? +(g / W).toFixed(4) : SC_F.marge / SC_F.W, x1: dr >= 0 ? +(dr / W).toFixed(4) : SC_F.droite / SC_F.W, ecrite: n / t > 0.004 }); }
  let der = -1; res.forEach((l, i) => { if (l.ecrite) der = i; });
  return { n: res.filter(l => l.ecrite).length, pas: +(SC_F.pas / SC_F.H).toFixed(4), l: res.slice(0, Math.max(der + 1, 1)), reperes: true };
}

// ↻ : la page tourne d'un quart de tour vers la droite ; ses marques tournent avec elle ; l'identité de la page ne change pas
function scTournerPage(pid) {
  const p = SC.pages[pid], im = SC.imgs[pid]; if (!p || !im) return;
  if (!(p.lignes && p.lignes.reperes)) { scOrigDe(pid).then(o => { if (!o) return scTournerPageVieux(pid); const r = p.recadre; scReglerPage(pid, { rot: ((p.rot || 0) + 270) % 360, angle: p.angle || 0, recadre: r ? [1 - r[3], r[0], 1 - r[1], r[2]] : null }); }); return; }
  scTournerPageVieux(pid);
}
function scTournerPageVieux(pid) {   // une page sans sa photo entière (une copie de l'appli, ou chargée avant) : l'image vue tourne
  const p = SC.pages[pid], im = SC.imgs[pid]; if (!p || !im) return;
  createImageBitmap(im.blob).then(bm => { const c = document.createElement("canvas"); c.width = bm.width; c.height = bm.height; c.getContext("2d").drawImage(bm, 0, 0); const r = scTourner(c, 270);
    if (typeof rcTransformerPage === "function") rcTransformerPage(pid, (x, y) => [1 - y, x]);
    p.rot = (((p.rot || 0) + 270) % 360); if (p.recadre) { const [a0, b0, c0, d0] = p.recadre; p.recadre = [1 - d0, a0, 1 - b0, c0]; } p.w = r.width; p.h = r.height; p.lignes = scLignes(r); p.blanche = false; p.modifieLe = new Date().toISOString();
    Object.keys(state.copies || {}).forEach(k => { const ms = (state.copies[k].scan || {}).marques || {}; Object.values(ms).forEach(m => { if (m.page !== pid) return; const [a, b, c2, d] = [m.x0, m.y0, m.x1, m.y1]; m.x0 = 1 - d; m.x1 = 1 - b; m.y0 = a; m.y1 = c2; m.l0 = m.l1 = null; m.modifieLe = p.modifieLe; }); });
    r.toBlob(b => { try { URL.revokeObjectURL(im.url); } catch (e) {} SC.imgs[pid] = scImg(b, r.width, r.height); if (SC.encres) delete SC.encres[pid]; scDbMettre({ id: pid, red: RU.id, classe: RU.classe, blob: b, w: r.width, h: r.height, le: p.modifieLe });
      ruEcrire(scChemin(["pages", pid]), p, "une page tournée"); saveState(); const Z = document.getElementById("scCopie"); if (Z) Z.dataset.sig = ""; scRendre(); }, "image/jpeg", 0.82); });
}
// ⇄ : la dernière page de la copie passe en premier (une copie de deux pages photographiée dans le désordre)
function scOrdrePages(k) { const P = scPagesDe(k); if (P.length < 2) return; const o = P.map(p => p.ordre); P.forEach((p, i) => { p.ordre = o[(i + 1) % P.length]; p.modifieLe = new Date().toISOString(); ruEcrire(scChemin(["pages", p.id]), p, "l'ordre des pages"); }); const Z = document.getElementById("scCopie"); if (Z) Z.dataset.sig = ""; scRendre(); }

// ✂ 1445 : retoucher une page comme une photo : le cadre et la rotation degré par degré. Rien n'est perdu : la photo entière reste dans ce navigateur,
// la page vue se refait d'elle (quart de tour, inclinaison, cadre). Les marques suivent leurs mots, à chaque retouche ; le cadre ne coupe jamais une marque déjà posée.
function scCouper(cv, r) { const [a, b, c, d] = r; const x0 = Math.round(a * cv.width), y0 = Math.round(b * cv.height), w = Math.max(1, Math.round((c - a) * cv.width)), h = Math.max(1, Math.round((d - b) * cv.height));
  const o = document.createElement("canvas"); o.width = w; o.height = h; o.getContext("2d").drawImage(cv, x0, y0, w, h, 0, 0, w, h); return o; }
function scIncliner(cv, deg) {   // deg : degrés dans le sens des aiguilles d'une montre ; la page garde sa taille, les coins découverts sont blancs
  if (!deg) return cv; const c = document.createElement("canvas"); c.width = cv.width; c.height = cv.height; const x = c.getContext("2d");
  x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.translate(c.width / 2, c.height / 2); x.rotate(deg * Math.PI / 180); x.drawImage(cv, -cv.width / 2, -cv.height / 2); return c; }
function scTheta(P) { return (((P.rot || 0) % 360) + 360) % 360; }
function scBaseDims(P, W0, H0) { return scTheta(P) % 180 ? [H0, W0] : [W0, H0]; }
function scRot(x, y, a) { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c]; }
// un point de la page vue (en fractions) dans la photo entière (en pixels), et l'inverse
function scVue2Orig(P, W0, H0, u, v) {
  const [Wb, Hb] = scBaseDims(P, W0, H0), Rc = P.recadre || [0, 0, 1, 1];
  const x = Wb * (Rc[0] + u * (Rc[2] - Rc[0])), y = Hb * (Rc[1] + v * (Rc[3] - Rc[1]));
  const [bx, by] = scRot(x - Wb / 2, y - Hb / 2, -(P.angle || 0) * Math.PI / 180);
  const [ox, oy] = scRot(bx, by, scTheta(P) * Math.PI / 180); return [W0 / 2 + ox, H0 / 2 + oy];
}
function scOrig2Vue(P, W0, H0, X, Y) {
  const [Wb, Hb] = scBaseDims(P, W0, H0), Rc = P.recadre || [0, 0, 1, 1];
  const [bx, by] = scRot(X - W0 / 2, Y - H0 / 2, -scTheta(P) * Math.PI / 180);
  const [ax, ay] = scRot(bx, by, (P.angle || 0) * Math.PI / 180);
  const x = (ax + Wb / 2) / Wb, y = (ay + Hb / 2) / Hb; return [(x - Rc[0]) / (Rc[2] - Rc[0]), (y - Rc[1]) / (Rc[3] - Rc[1])];
}
// une marque d'un réglage A au réglage B : son centre suit le mot ; sa longueur et sa hauteur restent les siennes (un quart de tour les échange)
function scRemap(m, A, B, W0, H0) {
  const f = (u, v) => { const [X, Y] = scVue2Orig(A, W0, H0, u, v); return scOrig2Vue(B, W0, H0, X, Y); };
  const [Wb, Hb] = scBaseDims(B, W0, H0), Rc = B.recadre || [0, 0, 1, 1], Wv = Wb * (Rc[2] - Rc[0]), Hv = Hb * (Rc[3] - Rc[1]);
  const x0 = Math.min(m.x0, m.x1), x1 = Math.max(m.x0, m.x1), y0 = Math.min(m.y0, m.y1), y1 = Math.max(m.y0, m.y1), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const c = f(cx, cy), ex = f(x1, cy), ey = f(cx, y1); const e1 = [(ex[0] - c[0]) * Wv, (ex[1] - c[1]) * Hv], e2 = [(ey[0] - c[0]) * Wv, (ey[1] - c[1]) * Hv];
  const l1 = Math.hypot(e1[0], e1[1]), l2 = Math.hypot(e2[0], e2[1]), hor = Math.abs(e1[0]) >= Math.abs(e1[1]); const hw = (hor ? l1 : l2) / Wv, hh = (hor ? l2 : l1) / Hv;
  m.x0 = c[0] - hw; m.x1 = c[0] + hw; m.y0 = c[1] - hh; m.y1 = c[1] + hh; m.l0 = m.l1 = null;
}
// la photo entière d'une page : gardée depuis son chargement, ou refaite d'une page jamais recadrée ni inclinée
function scOrigDe(pid) {
  if (SC.origs[pid]) return Promise.resolve(SC.origs[pid]);
  const p = SC.pages[pid], im = SC.imgs[pid]; if (!p || !im || p.recadre || p.angle || (p.lignes && p.lignes.reperes)) return Promise.resolve(null);
  return createImageBitmap(im.blob).then(bm => { const c = document.createElement("canvas"); c.width = bm.width; c.height = bm.height; c.getContext("2d").drawImage(bm, 0, 0); const r = scTourner(c, (360 - (p.rot || 0)) % 360);
    return new Promise(res => r.toBlob(b => { SC.origs[pid] = { blob: b, w: r.width, h: r.height }; scDbMettre({ id: pid, red: RU.id, classe: RU.classe, blob: im.blob, w: im.w, h: im.h, le: new Date().toISOString() }); res(SC.origs[pid]); }, "image/jpeg", 0.9)); });
}
function scToile(blob) { return createImageBitmap(blob).then(bm => { const c = document.createElement("canvas"); c.width = bm.width; c.height = bm.height; c.getContext("2d").drawImage(bm, 0, 0); return c; }); }
// appliquer un réglage (quart de tour, inclinaison, cadre) à une page : l'image refaite de la photo entière, ses marques déplacées avec leurs mots
function scReglerPage(pid, B, cvO) {
  const p = SC.pages[pid]; if (!p) return Promise.resolve();
  const prend = cvO ? Promise.resolve(cvO) : scOrigDe(pid).then(o => o ? scToile(o.blob) : null);
  return prend.then(cv0 => {
    if (!cv0) { toast("Remets ton paquet une fois (« Charger le paquet ») : l'appli garde alors la photo entière de cette page, pour la retoucher sans rien perdre."); return; }
    const W0 = cv0.width, H0 = cv0.height, A = { rot: p.rot || 0, angle: p.angle || 0, recadre: p.recadre || null };
    let cv = scTourner(cv0, B.rot || 0); if (B.angle) cv = scIncliner(cv, B.angle); if (B.recadre) cv = scCouper(cv, B.recadre);
    const le = new Date().toISOString();
    Object.keys(state.copies || {}).forEach(k => { const ms = (state.copies[k].scan || {}).marques || {}; Object.values(ms).forEach(m => { if (m.page !== pid) return; scRemap(m, A, B, W0, H0); m.modifieLe = le; }); });
    if (typeof rcTransformerPage === "function") rcTransformerPage(pid, (u, v) => { const [X, Y] = scVue2Orig(A, W0, H0, u, v); return scOrig2Vue(B, W0, H0, X, Y); });
    p.rot = B.rot || 0; p.angle = B.angle || 0; p.recadre = B.recadre ? B.recadre.map(v => +v.toFixed(4)) : null; p.w = cv.width; p.h = cv.height; p.lignes = scLignes(cv); p.modifieLe = le;
    return new Promise(res => cv.toBlob(b => { const im = SC.imgs[pid]; if (im) { try { URL.revokeObjectURL(im.url); } catch (e) {} } SC.imgs[pid] = scImg(b, cv.width, cv.height); if (SC.encres) delete SC.encres[pid];
      scDbMettre({ id: pid, red: RU.id, classe: RU.classe, blob: b, w: cv.width, h: cv.height, le });
      ruEcrire(scChemin(["pages", pid]), p, "une page retouchée"); saveState(); const Z = document.getElementById("scCopie"); if (Z) Z.dataset.sig = ""; scRendre(); res(); }, "image/jpeg", 0.82));
  });
}
// ── l'écran de la retouche ──
function scRecadrerDebut(pid) { scRetoucher(pid); }
function scRetoucher(pid) {
  const p = SC.pages[pid]; if (!p) return;
  if (p.lignes && p.lignes.reperes) { toast("Une copie de l'appli se remet droite et se recadre d'elle-même : rien à retoucher."); return; }
  scChampFermer(true);
  scOrigDe(pid).then(o => { if (!o) { toast("Remets ton paquet une fois (« Charger le paquet ») : l'appli garde alors la photo entière de cette page, pour la retoucher sans rien perdre."); return; }
    scToile(o.blob).then(c => { SC.rt = { pid, orig: c, W0: c.width, H0: c.height, rot: p.rot || 0, angle: p.angle || 0, cadre: (p.recadre || [0, 0, 1, 1]).slice(), A: { rot: p.rot || 0, angle: p.angle || 0, recadre: p.recadre || null } };
      scRtBase(); scRtOuvrir(); }); });
}
function scRtBase() { const R = SC.rt; R.base = scTourner(R.orig, R.rot); if (R.base === R.orig) { const c = document.createElement("canvas"); c.width = R.orig.width; c.height = R.orig.height; c.getContext("2d").drawImage(R.orig, 0, 0); R.base = c; } R.Wb = R.base.width; R.Hb = R.base.height; R.base.className = "sc-rt-img"; }
// les marques de la page, dans la photo tournée d'un quart de tour (avant l'inclinaison) : elles tournent avec elle à l'écran
function scRtMarques() { const R = SC.rt, L = []; Object.keys(state.copies || {}).forEach(k => Object.values(((state.copies[k].scan || {}).marques) || {}).forEach(m => { if (m.page !== R.pid) return;
  const pts = [[m.x0, m.y0], [m.x1, m.y0], [m.x1, m.y1], [m.x0, m.y1]].map(([u, v]) => { const [X, Y] = scVue2Orig(R.A, R.W0, R.H0, u, v); const [bx, by] = scRot(X - R.W0 / 2, Y - R.H0 / 2, -scTheta(R) * Math.PI / 180); return [bx + R.Wb / 2, by + R.Hb / 2]; });
  L.push({ m, pts }); })); return L; }
function scRtBoite() { const R = SC.rt; let a = 1, b = 1, c = 0, d = 0, n = 0;
  scRtMarques().forEach(o => o.pts.forEach(([x, y]) => { const [ax, ay] = scRot(x - R.Wb / 2, y - R.Hb / 2, R.angle * Math.PI / 180); const u = (ax + R.Wb / 2) / R.Wb, v = (ay + R.Hb / 2) / R.Hb; a = Math.min(a, u); b = Math.min(b, v); c = Math.max(c, u); d = Math.max(d, v); n++; }));
  if (typeof rcBornesRetouche === "function") rcBornesRetouche(R).forEach(([u, v]) => { a = Math.min(a, u); b = Math.min(b, v); c = Math.max(c, u); d = Math.max(d, v); n++; });
  return n ? [Math.max(0, a), Math.max(0, b), Math.min(1, c), Math.min(1, d)] : null; }
function scRtContenir() { const R = SC.rt, B = scRtBoite(), k = R.cadre; if (!B) return; k[0] = Math.max(0, Math.min(k[0], B[0] - 0.004)); k[1] = Math.max(0, Math.min(k[1], B[1] - 0.004)); k[2] = Math.min(1, Math.max(k[2], B[2] + 0.004)); k[3] = Math.min(1, Math.max(k[3], B[3] + 0.004)); }
function scRtOuvrir() {
  let E = document.getElementById("scRetouche"); if (!E) { E = document.createElement("div"); E.id = "scRetouche"; document.body.appendChild(E); }
  const R = SC.rt;
  E.innerHTML = `<div class="sc-rt-barre"><b>✂ Retoucher la page</b>
    <button class="sc-btn" onclick="scRtTourner(-1)" title="Tourner la photo d'un degré, dans le sens inverse des aiguilles d'une montre (aussi : flèche gauche). Les marques tournent avec elle.">⟲ 1°</button>
    <input id="scRtAngle" type="range" min="-45" max="45" step="1" value="${R.angle}" oninput="scRtTourner(0, +this.value)" title="Redresser la photo, degré par degré : tire le curseur, ou flèches gauche et droite. Les marques suivent leurs mots.">
    <button class="sc-btn" onclick="scRtTourner(1)" title="Tourner la photo d'un degré, dans le sens des aiguilles d'une montre (aussi : flèche droite). Les marques tournent avec elle.">⟳ 1°</button>
    <span id="scRtDeg" class="sc-rt-deg" title="L'inclinaison de la photo, en degrés : 0°, la photo telle qu'elle est.">${R.angle}°</span>
    <button class="sc-btn" onclick="scRtQuart()" title="Un quart de tour vers la droite : une photo prise de côté. Les marques tournent avec elle.">↻ Quart de tour</button>
    <button class="sc-btn" onclick="scRtTout()" title="Le cadre reprend toute la photo : rien n'a été perdu, la photo entière est gardée dans ce navigateur.">Toute la photo</button>
    <span class="sc-rt-aide">Tire les coins ou les bords du cadre, l'intérieur pour le déplacer. Il ne coupe jamais une marque déjà posée.</span>
    <button class="sc-btn" onclick="scRtFermer(false)" title="Fermer sans rien changer (Échap).">Annuler</button>
    <button class="sc-btn sc-rt-ok" onclick="scRtFermer(true)" title="Garder ce cadre et cette rotation (Entrée) : la page de la copie et le fichier de l'élève prennent la nouvelle image ; les marques restent sur leurs mots.">✓ Valider</button></div>
    <div class="sc-rt-zone" id="scRtZone"><div class="sc-rt-scene" id="scRtScene"><div class="sc-rt-rot" id="scRtRot"></div>
    <div class="sc-rt-cadre" id="scRtCadre" title="Le cadre : ce qui restera de la page. Tire ses coins ou ses bords pour le changer, l'intérieur pour le déplacer.">${[["nw", "ce coin"], ["n", "ce bord"], ["ne", "ce coin"], ["e", "ce bord"], ["se", "ce coin"], ["s", "ce bord"], ["sw", "ce coin"], ["w", "ce bord"]].map(([h, t]) => `<i class="sc-rt-p ${h}" data-h="${h}" title="Tirer ${t} du cadre."></i>`).join("")}</div></div></div>`;
  E.hidden = false; document.body.classList.add("sc-rt-ouvert");
  document.getElementById("scRtCadre").addEventListener("pointerdown", scRtTirer);
  scRtContenir(); scRtDessiner();
}
function scRtDessiner() {
  const R = SC.rt; if (!R) return; const Z = document.getElementById("scRtZone"), S = document.getElementById("scRtScene"), T = document.getElementById("scRtRot"), C = document.getElementById("scRtCadre"); if (!Z) return;
  const k = Math.min((Z.clientWidth - 28) / R.Wb, (Z.clientHeight - 28) / R.Hb); S.style.width = Math.round(R.Wb * k) + "px"; S.style.height = Math.round(R.Hb * k) + "px";
  if (R.base.parentNode !== T) { T.innerHTML = ""; T.appendChild(R.base); T.insertAdjacentHTML("beforeend", `<svg class="sc-rt-marques" viewBox="0 0 ${R.Wb} ${R.Hb}" preserveAspectRatio="none"></svg>`); }
  T.querySelector("svg").innerHTML = scRtMarques().map(o => { const coul = o.m.forme === "faute" ? SC_CRIT.langue : o.m.forme === "etoile" ? SC_CRIT.etoile : (SC_CRIT[o.m.passe] || "#6b1a2a"); return `<polygon points="${o.pts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ")}" fill="${coul}33" stroke="${coul}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>`; }).join("");
  T.style.transform = "rotate(" + R.angle + "deg)";
  const c = R.cadre; C.style.left = (c[0] * 100) + "%"; C.style.top = (c[1] * 100) + "%"; C.style.width = ((c[2] - c[0]) * 100) + "%"; C.style.height = ((c[3] - c[1]) * 100) + "%";
  const g = document.getElementById("scRtDeg"); if (g) g.textContent = R.angle + "°"; const a = document.getElementById("scRtAngle"); if (a && +a.value !== R.angle) a.value = R.angle;
}
function scRtTirer(e) {
  const R = SC.rt; if (!R) return; e.preventDefault(); const h = (e.target.dataset && e.target.dataset.h) || "tout"; const S = document.getElementById("scRtScene"), r = S.getBoundingClientRect(); const k0 = R.cadre.slice(), x0 = e.clientX, y0 = e.clientY, min = 0.15;
  const mv = ev => { const du = (ev.clientX - x0) / r.width, dv = (ev.clientY - y0) / r.height; const k = k0.slice();
    if (h === "tout") { const w = k0[2] - k0[0], hh = k0[3] - k0[1]; k[0] = Math.max(0, Math.min(1 - w, k0[0] + du)); k[1] = Math.max(0, Math.min(1 - hh, k0[1] + dv)); k[2] = k[0] + w; k[3] = k[1] + hh; }
    else { if (h.includes("w")) k[0] = Math.max(0, Math.min(k0[2] - min, k0[0] + du)); if (h.includes("e")) k[2] = Math.min(1, Math.max(k0[0] + min, k0[2] + du)); if (h.includes("n")) k[1] = Math.max(0, Math.min(k0[3] - min, k0[1] + dv)); if (h.includes("s")) k[3] = Math.min(1, Math.max(k0[1] + min, k0[3] + dv)); }
    R.cadre = k; scRtContenir(); scRtDessiner(); };
  const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); };
  addEventListener("pointermove", mv); addEventListener("pointerup", up);
}
function scRtTourner(d, v) { const R = SC.rt; if (!R) return; R.angle = Math.max(-45, Math.min(45, v != null ? Math.round(v) : R.angle + d)); scRtContenir(); scRtDessiner(); }
function scRtQuart() { const R = SC.rt; if (!R) return; const c = R.cadre; R.cadre = [1 - c[3], c[0], 1 - c[1], c[2]]; R.rot = (R.rot + 270) % 360; scRtBase(); scRtContenir(); scRtDessiner(); }
function scRtTout() { const R = SC.rt; if (!R) return; R.cadre = [0, 0, 1, 1]; scRtDessiner(); }
function scRtFermer(garder) {
  const R = SC.rt; if (!R) return; const E = document.getElementById("scRetouche");
  const fin = () => { SC.rt = null; if (E) { E.hidden = true; E.innerHTML = ""; } document.body.classList.remove("sc-rt-ouvert"); };
  if (!garder) { fin(); return; }
  const c = R.cadre, plein = c[0] <= 0.001 && c[1] <= 0.001 && c[2] >= 0.999 && c[3] >= 0.999; const B = { rot: R.rot, angle: R.angle, recadre: plein ? null : c.slice() };
  const A = R.A; if (B.rot === A.rot && B.angle === A.angle && JSON.stringify(B.recadre) === JSON.stringify(A.recadre ? A.recadre.map(v => +v.toFixed(4)) : null)) { fin(); return; }
  const pid = R.pid, cv = R.orig; fin(); scReglerPage(pid, B, cv).then(() => toast("Page retouchée : les marques sont restées sur leurs mots."));
}
addEventListener("resize", () => { if (SC.rt) scRtDessiner(); });

// ── 1450 : le récapitulatif d'une copie : la note, la grille, le bilan écrit par l'appli, « À reprendre ». Il s'ouvre seul quand tous ses points sont passés ; « 📋 » l'ouvre à tout moment ──
// Le bilan n'est fait que de tes phrases (les cases de ta grille, leurs tâches, tes remarques) ; les quelques mots qui les relient sont proposés (1452).
function scMin(t) { return t ? t.charAt(0).toLowerCase() + t.slice(1) : ""; }
function scBilan(k) {
  const pre = prenom(nomEleveDe(k) || ""), bien = [], manque = [], taches = [];
  SC.grille.criteres.forEach(c => c.points.forEach(pt => { const r = scCase(pt, k); if (!r || !r.complet) return;
    (r.c.niveau >= 3 && !r.tache ? bien : manque).push(r.txt);   // réussi : la case la plus haute, sans rien à reprendre ; tout le reste manque encore if (r.tache) taches.push({ fait: r.txt, t: r.tache, relire: r.c.relire !== false, niveau: r.c.niveau, titre: pt.titre });
    (r.autres || []).forEach(a => { manque.push(a.txt); if (a.tache) taches.push({ fait: a.txt, t: a.tache, relire: a.c.relire !== false, niveau: a.c.niveau, titre: pt.titre }); }); }));
  const vu = new Set(); const T = taches.filter(x => !vu.has(x.t) && vu.add(x.t)).sort((a, b) => a.niveau - b.niveau);
  const M = Object.values(scCopie(k).marques); const etoile = M.some(m => m.forme === "etoile"); const rq = M.filter(m => m.forme === "remarque" && m.texte).map(m => m.texte);
  const P = [], phrases = L => L.join(" ");
  if (bien.length) P.push((pre ? pre + ", " + scMin(bien[0]) : bien[0]) + (bien.length > 1 ? " " + phrases(bien.slice(1)) : ""));
  if (manque.length) P.push("Ce qui manque encore : " + scMin(manque[0]) + (manque.length > 1 ? " " + phrases(manque.slice(1)) : ""));
  if (etoile) P.push("La phrase qui m'a touché est surlignée en or sur ta copie.");
  if (rq.length) P.push("Mes remarques sur ta copie : " + rq.map(t => "« " + t + " »").join(" ; ") + ".");
  return { paras: P, taches: T };
}
function scRecap(k, suite) {
  k = k || scK(); if (!k) return; scChampFermer(true); SC.recap = { k, suite: !!suite };
  let E = document.getElementById("scRecap"); if (!E) { E = document.createElement("div"); E.id = "scRecap"; document.body.appendChild(E); }
  const nt = scNote(k), B = scBilan(k), F = scFautes(k).slice().sort((a, b) => (a.num || 0) - (b.num || 0)), lig = scLignesCopie(k);
  let manquent = 0; const grille = SC.grille.criteres.map(c => `<tr class="sc-rc-crit"><td colspan="3">${escapeHtml(c.nom)}</td></tr>` + c.points.map(pt => { const r = scCase(pt, k); const ok = r && r.complet; if (!ok) manquent++;
    return `<tr${ok ? "" : ' class="sc-rc-pas"'}><td>${escapeHtml(pt.titre)}</td><td>${ok ? `<i style="background:${SC_COUL[r.c.niveau]}"></i>${escapeHtml(r.txt)}${(r.autres || []).map(a => `<div class="sc-rc-autre">aussi : ${escapeHtml(a.txt)}</div>`).join("")}` : "pas encore passé"}</td><td>${ok ? String(pt.bareme[String(r.c.niveau)]).replace(".", ",") : "…"} / ${pt.poids}</td></tr>`; }).join("")).join("");
  E.innerHTML = `<div class="sc-rc-boite">
    <div class="sc-rc-tete"><div><small>Récapitulatif de la copie</small><h2>${escapeHtml(nomEleveDe(k) || k)}</h2><small>${lig ? lig + " lignes écrites · " : ""}${F.length} faute${F.length > 1 ? "s" : ""} soulignée${F.length > 1 ? "s" : ""}</small></div>
      <div class="sc-rc-note" title="${nt.ok ? "La note de la copie : la somme des points de ses cases." : "La note se calcule quand tous les points de la copie sont passés."}">${nt.ok ? String(nt.n).replace(".", ",") + " / " + nt.tot : "Provisoire<small>" + manquent + " point" + (manquent > 1 ? "s" : "") + " pas encore passé" + (manquent > 1 ? "s" : "") + "</small>"}</div></div>
    <div class="sc-rc-corps"><div class="sc-rc-col"><h3>La grille</h3><table class="sc-rc-grille">${grille}</table></div>
      <div class="sc-rc-col"><h3>Le bilan</h3>${B.paras.length ? B.paras.map(p => `<p>${escapeHtml(p)}</p>`).join("") : '<p class="sc-m">Rien encore : le bilan s\'écrit au fil des points passés.</p>'}
        ${B.taches.length ? `<h3>À reprendre</h3><ol>${B.taches.map(t => `<li><span class="sc-m">${escapeHtml(t.fait)}</span><br>${escapeHtml(t.t)}${scCorrectionEleve() ? ` <em class="sc-m" title="${t.relire ? "Une écriture : tu la relis dans la passe des retours." : "Se vérifie d'un coup d'œil : l'élève la valide seul."}">${t.relire ? "✎ relue" : "✓ seul"}</em>` : ""}</li>`).join("")}</ol>` : ""}
        ${F.length ? `<h3>Les fautes</h3><p class="sc-rc-fautes">${F.map(f => `<span><b>${f.num || "?"}</b> ${f.bonne ? escapeHtml(f.bonne) : '<i title="Sans bonne forme : un clic sur son trait, sur la copie, rouvre son champ.">sans bonne forme</i>'}</span>`).join("")}</p>` : ""}</div></div>
    <div class="sc-rc-pied"><button class="sc-btn" onclick="scRecapFermer()" title="Fermer le récapitulatif (Échap) et rester sur cette copie, pour reprendre un point.">Rester sur cette copie · Échap</button>
      <button class="sc-btn" onclick="scTesterEleve(scK())" title="Ouvrir le fichier que recevra l'élève, dans un onglet de test : sa copie, tes marques, sa grille et sa note, en lecture seule. Rien ne part chez lui.">🧪 Le fichier de l'élève</button>
      ${suite ? `<button class="sc-btn sc-rt-ok" onclick="scRecapFermer(true)" title="Passer à la copie suivante (Entrée).">Copie suivante · Entrée</button>` : ""}</div></div>`;
  E.hidden = false;
}
function scRecapFermer(suivre) { const R = SC.recap; SC.recap = null; const E = document.getElementById("scRecap"); if (E) { E.hidden = true; E.innerHTML = ""; } if (suivre && R && R.suite) scSuiteCopie(); else scRendre(); }

// ── 1417 : le mot sous le clic, lu dans l'encre de la page (une image d'analyse par page, gardée en mémoire) ──
function scEncrePage(pid) {
  SC.encres = SC.encres || {}; if (SC.encres[pid]) return SC.encres[pid]; const im = SC.imgs[pid]; if (!im || !im.el) return null;
  const W = 900, H = Math.round(W * im.h / im.w), cv = document.createElement("canvas"); cv.width = W; cv.height = H; const x = cv.getContext("2d"); x.drawImage(im.el, 0, 0, W, H);
  const d = x.getImageData(0, 0, W, H).data, lum = new Float32Array(W * H); for (let i = 0; i < W * H; i++) lum[i] = (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 3;
  const I = new Float64Array((W + 1) * (H + 1)); for (let y = 0; y < H; y++) { let a = 0; for (let k = 0; k < W; k++) { a += lum[y * W + k]; I[(y + 1) * (W + 1) + k + 1] = I[y * (W + 1) + k + 1] + a; } }
  const e = new Uint8Array(W * H), R = 12; for (let y = 0; y < H; y++) for (let k = 0; k < W; k++) { const x0 = Math.max(0, k - R), x1 = Math.min(W, k + R + 1), y0 = Math.max(0, y - R), y1 = Math.min(H, y + R + 1);
    const m = (I[y1 * (W + 1) + x1] - I[y0 * (W + 1) + x1] - I[y1 * (W + 1) + x0] + I[y0 * (W + 1) + x0]) / ((x1 - x0) * (y1 - y0)); const o = (y * W + k) * 4; e[y * W + k] = lum[y * W + k] < m - 28 && !(d[o] > d[o + 1] + 30 && d[o] > d[o + 2] + 30) ? 1 : 0; }
  // l'écart entre deux lignes d'écriture de cette page (son « pas »), lu dans l'encre : l'autocorrélation du profil des lignes ; il règle la taille de la bande cherchée autour d'un clic
  const prof = new Float64Array(H); for (let y = 0; y < H; y++) { let n = 0; for (let k = Math.round(W * 0.15); k < Math.round(W * 0.95); k++) n += e[y * W + k]; prof[y] = n; }
  const moy = prof.reduce((a, b) => a + b, 0) / H; const dv = Array.from(prof, v => v - moy); const ac = L => { let t = 0; for (let y = 0; y + L < H; y++) t += dv[y] * dv[y + L]; return t / (H - L); };
  const a0 = ac(0) || 1, L0 = Math.round(H * 0.012), L1 = Math.round(H * 0.08), A = []; let best = -1, pas = 0; for (let L = L0 - 2; L <= L1 + 2; L++) A[L] = ac(L) / a0; for (let L = L0; L <= L1; L++) if (A[L] > best) best = A[L];
  // le premier pic franc, pas le plus haut : le plus haut tombe souvent sur deux ou trois lignes d'un coup (mesuré sur une vraie copie : 93 au lieu de 31)
  if (best > 0.15) for (let L = L0; L <= L1; L++) if (A[L] >= best * 0.6 && A[L] >= A[L - 1] && A[L] >= A[L - 2] && A[L] >= A[L + 1] && A[L] >= A[L + 2]) { pas = L; break; }
  if (!pas) pas = Math.round(H * 0.027);
  return SC.encres[pid] = { W, H, e, pas };
}
function scMotSous(pid, x, y, reglage) {
  const R = reglage || {}, E = scEncrePage(pid); if (!E) return null; const { W, H, e } = E; const P = E.pas || Math.round(H * 0.027); const cx = Math.round(x * W), cy = Math.round(y * H), bh = Math.max(4, Math.round(P / 3));   // la bande suit le pas des lignes de cette page (Paul, 30/10 12:09 : un soulignement parti sur la ligne d'en dessous)
  // la bande de la ligne cliquée : le creux d'encre le plus proche au-dessus du clic, et au-dessous (une ligne écrite ≈ 2,7 % de la hauteur de la page) ; jamais la ligne voisine
  const fx0 = Math.max(0, cx - Math.round(W * 0.06)), fx1 = Math.min(W - 1, cx + Math.round(W * 0.06));
  const rg = yy => { if (yy < 0 || yy >= H) return 0; let n = 0; for (let k = fx0; k <= fx1; k++) n += e[yy * W + k]; return n; };
  const lisse = yy => rg(yy - 1) + rg(yy) + rg(yy + 1);
  let haut = Math.max(0, cy - 2 * bh), bas = Math.min(H - 1, cy + 2 * bh), m = Infinity;
  for (let yy = cy - Math.round(bh * 0.3); yy >= Math.max(0, cy - Math.round(bh * 2.2)); yy--) { const v = lisse(yy); if (v < m) { m = v; haut = yy; } }
  m = Infinity; for (let yy = cy + Math.round(bh * 0.3); yy <= Math.min(H - 1, cy + Math.round(bh * 2.2)); yy++) { const v = lisse(yy); if (v < m) { m = v; bas = yy; } }
  const col = k => { let n = 0; for (let yy = haut; yy <= bas; yy++) n += e[yy * W + k]; return n; };
  // l'écart qui sépare deux mots se lit sur la ligne même : ses blancs font deux familles, entre deux lettres (petits) et entre deux mots (grands) ; la coupure se cherche à l'échelle des rapports, pour qu'un grand vide (fin de ligne, correcteur blanc) ne l'emporte pas ; jamais sous 0,65 % de la largeur (une lettre levée dans un mot attaché)
  let gap = Math.round(W * (R.ecart || 0.009));
  if (!R.ecart) { const bl = []; let run = 0, vu = false; for (let k = Math.max(0, cx - Math.round(W * 0.3)); k <= Math.min(W - 1, cx + Math.round(W * 0.3)); k++) { if (col(k) > 1) { if (vu && run) bl.push(Math.log(Math.min(run, W * 0.03))); run = 0; vu = true; } else if (vu) run++; }
    if (bl.length >= 6) { const s = bl.sort((p, q) => p - q), moy = t => t.reduce((p, q) => p + q, 0) / t.length; let best = -1, seuil = Math.log(gap);
      for (let t = 1; t < s.length; t++) { const A = s.slice(0, t), B = s.slice(t), v = A.length * B.length * Math.pow(moy(A) - moy(B), 2); if (v > best) { best = v; seuil = (s[t - 1] + s[t]) / 2; } }
      gap = Math.max(Math.round(W * (R.plancher || 0.0065)), Math.min(Math.round(W * 0.016), Math.floor(Math.exp(seuil)))); } }
  let a = -1; for (let r = 0; r < Math.round(W * 0.02) && a < 0; r++) { if (cx + r < W && col(cx + r) > 1) a = cx + r; else if (cx - r >= 0 && col(cx - r) > 1) a = cx - r; } if (a < 0) return null;
  let x0 = a, vide = 0; for (let k = a - 1; k >= 0; k--) { if (col(k) > 1) { x0 = k; vide = 0; } else if (++vide > gap) break; }
  let x1 = a; vide = 0; for (let k = a + 1; k < W; k++) { if (col(k) > 1) { x1 = k; vide = 0; } else if (++vide > gap) break; }
  if ((x1 - x0) > W * 0.4 || (x1 - x0) < W * 0.01) return null;   // pas un mot : une ligne entière, la réglure, ou une poussière
  let y0 = bas, y1 = haut; for (let yy = haut; yy <= bas; yy++) { let n = 0; for (let k = x0; k <= x1; k++) n += e[yy * W + k]; if (n > 1) { if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; } }
  if (y1 < y0) { y0 = haut; y1 = bas; }
  y0 = Math.max(y0, cy - Math.round(P * 0.65)); y1 = Math.min(y1, cy + Math.round(P * 0.6));   // jamais plus haut ni plus bas que la ligne cliquée
  // le trait se pose sous le corps du mot, pas sous ses jambages (g, p, j) ni sous l'encre qui descend de la ligne : la dernière rangée encore pleine (Paul, 30/10 12:16 : des soulignés décalés en hauteur)
  if (!R.sansBase) { const L = []; let mx = 0; for (let yy = y0; yy <= y1; yy++) { let n = 0; for (let k = x0; k <= x1; k++) n += e[yy * W + k]; L.push(n); }
    const Ls = L.map((v, i) => (L[i - 1] || 0) + v + (L[i + 1] || 0)); Ls.forEach(v => { if (v > mx) mx = v; });
    for (let i = Ls.length - 1; i >= 0; i--) if (Ls[i] >= mx * 0.3) { y1 = Math.min(y1, y0 + i + Math.round(P * 0.06)); break; } }
  return { x0: (x0 - 2) / W, x1: (x1 + 2) / W, y0: (y0 - 1) / H, y1: (y1 + 1) / H };
}
// l'infobulle de la copie : ce que fait la souris sur la copie, à cet instant (le pinceau change avec la question)
function scTitreCopie() {
  const Z = document.getElementById("scCopie"); if (!Z) return; const vue = " Ctrl + molette : zoom. Maj tenue : la loupe. Alt tenue : la copie sans marques.";
  let t;
  if (!Object.keys(SC.pages).length) t = "Ton paquet de copies s'affichera ici. Clique au milieu pour le charger : un PDF ou des photos.";
  else if (SC.attrib) t = "La page à donner à un élève : tape ses initiales à droite, Entrée." + vue;
  else if (scP() && scP().id === "retours") t = "La copie de l'élève dont tu relis le retour, avec tes marques." + vue;
  else { const o = scOutil(); const f = o ? o.forme : "encadre";
    const dit = { faute: "souligne une faute", etoile: "surligne en or la phrase qui t'a touché", remarque: "encadre un passage, puis tu tapes ta remarque", surligne: "surligne une citation", marge: "trace un trait dans la marge, le long d'un paragraphe", encadre: "encadre un mot" }[f] || "pose une marque";
    t = "Le pinceau " + dit + " : appuie, glisse, lâche." + (f === "marge" ? "" : " Un clic sans glisser prend le mot sous la souris.") + " Un clic sur une faute rouvre sa bonne forme. Une marque choisie : Suppr l'efface, Ctrl + Z la remet." + vue; }
  SC.titreCopie = t; if (Z.hasAttribute("title")) Z.removeAttribute("title");   // Paul, 30/10 11:57 : l'infobulle de la copie s'affichait en permanence, « c'est pénible » : la copie n'en a plus ; ce qu'elle disait est dans l'aide (?) et dans « Les touches »
}
// ── 1410 : le zoom (Ctrl + molette, sous la souris) ; 1411 : la loupe (Maj) ; 1416 : la copie nue (Alt) ; 1412 : le panneau replié ──
try { SC.zoom = +(localStorage.getItem("mjpc_scan_zoom") || 1) || 1; } catch (e) { SC.zoom = 1; }
function scZoomAffiche() { const b = document.getElementById("scZoom"); if (b) b.textContent = Math.abs(SC.zoom - 1) < 0.01 ? "↔ Largeur" : "🔍 " + Math.round(SC.zoom * 100) + " %"; }
function scZoomLargeur() { SC.zoom = 1; try { localStorage.setItem("mjpc_scan_zoom", "1"); } catch (e) {} scDessinerPages(); scZoomAffiche(); }
(function () {
  const Z = document.getElementById("scCopie"); if (!Z) return;
  Z.addEventListener("wheel", e => { if (!e.ctrlKey || !SC.ouvert) return; e.preventDefault(); const r = Z.getBoundingClientRect(); const fy = (Z.scrollTop + e.clientY - r.top) / Math.max(1, Z.scrollHeight), fx = (Z.scrollLeft + e.clientX - r.left) / Math.max(1, Z.scrollWidth);
    SC.zoom = Math.max(0.5, Math.min(4, SC.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12))); try { localStorage.setItem("mjpc_scan_zoom", String(SC.zoom)); } catch (x) {}
    scDessinerPages(); Z.scrollTop = fy * Z.scrollHeight - (e.clientY - r.top); Z.scrollLeft = fx * Z.scrollWidth - (e.clientX - r.left); scZoomAffiche(); }, { passive: false });
  const L = document.getElementById("scLoupe");
  Z.addEventListener("mousemove", e => { const pg = e.target.closest && e.target.closest(".sc-page"); const im = pg && SC.imgs[pg.dataset.p];
    if (!e.shiftKey || !pg || !im || !L) { if (L) L.hidden = true; return; } const r = pg.getBoundingClientRect(), k = 3, D = 240;
    L.hidden = false; L.style.left = (e.clientX - D / 2) + "px"; L.style.top = (e.clientY - D / 2) + "px"; L.style.backgroundImage = "url(" + im.url + ")";
    L.style.backgroundSize = (r.width * k) + "px " + (r.height * k) + "px"; L.style.backgroundPosition = (-(e.clientX - r.left) * k + D / 2) + "px " + (-(e.clientY - r.top) * k + D / 2) + "px"; });
  addEventListener("keyup", e => { if (e.key === "Shift" && L) L.hidden = true; if (e.key === "Alt") { document.body.classList.remove("sc-nue"); if (SC.ouvert) e.preventDefault(); } });
  addEventListener("keydown", e => { if (e.key === "Alt" && SC.ouvert) { document.body.classList.add("sc-nue"); e.preventDefault(); } });
  addEventListener("blur", () => { document.body.classList.remove("sc-nue"); if (L) L.hidden = true; });
})();
function scReplier(v) { SC.replie = v; document.getElementById("scanEcran").classList.toggle("sc-replie", !!v); const Z = document.getElementById("scCopie"); if (Z) Z.dataset.sig = ""; scRendre(); }
function scBande() {
  const B = document.getElementById("scBande"); if (!B) return; if (!SC.replie || SC.attrib) { B.hidden = true; return; } B.hidden = false; const P = scP(), pt = scPt(), k = scK();
  const q = pt && !pt.calcul ? scQ(pt, SC.iq) : null; const r = pt && k ? scCase(pt, k) : null;
  B.innerHTML = `<b>${escapeHtml(P.nom)}</b> · ${escapeHtml(pt ? pt.titre : "")}${q ? " · " + escapeHtml(q.texte) : ""}${r && r.complet ? ` · <span style="color:${SC_COUL[r.c.niveau]}">●</span> ${escapeHtml(r.txt)}` : ""} <span class="sc-m">— Entrée oui · N non · → copie suivante</span><button class="sc-btn" onclick="scReplier(false)" title="Déplier le panneau de droite : les questions, la case, les copies déjà vues, les touches.">⇤ Déplier</button>`;
}
