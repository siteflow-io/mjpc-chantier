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
    SC.grille = scGrilleNormale(g); SC.pages = pg || {}; SC.retours = rt || {}; if (typeof AV === "object") AV.red = RU.id;
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
function scFermer() { if (typeof RC !== "undefined" && RC.ouvert) rcFermer(true); scChrono(); SC.ouvert = false; state.modeOuvert = null; aidePoser(SC.aideAvant || "correction"); document.getElementById("scanEcran").classList.add("hidden"); document.body.classList.remove("sc-ouvert"); saveState(); if (typeof renderDashboard === "function") renderDashboard(); }
function scPagesOrdre() { return Object.values(SC.pages).filter(p => p && p.id).sort((a, b) => (a.ordre || 0) - (b.ordre || 0)); }
function scPremiereSans() { const i = scPagesOrdre().findIndex(p => !p.eleve && !p.blanche); return i < 0 ? 0 : i; }
function scPagesSans() { return scPagesOrdre().filter(p => !p.eleve && !p.blanche); }
function scPagesDe(k) { return scPagesOrdre().filter(p => p.eleve === k && !p.blanche); }
function scCopiesOrdre() { const cour = SC.copies[SC.ic]; const vu = []; scPagesOrdre().forEach(p => { if (p.eleve && !p.blanche && vu.indexOf(p.eleve) < 0) vu.push(p.eleve); }); SC.copies = vu; const j = cour ? vu.indexOf(cour) : -1; SC.ic = j >= 0 ? j : Math.min(SC.ic, Math.max(0, vu.length - 1)); }
function scManquantes() { return scPagesOrdre().filter(p => !SC.imgs[p.id]); }
// ── charger le paquet (PDF ou photos) : tout reste dans ce navigateur ──
function scCharger(ev) {
  const fs = Array.from(ev.target.files || []); ev.target.value = ""; if (!fs.length) return; scChargerFichiers(fs);
}
/* [C14 1.4.13] (Paul 01/11 08:04 et 08:27) : chaque feuille garde l'identité donnée au premier chargement ; son origine (l'empreinte du contenu
   de son fichier et le numéro de sa page) la retrouve sur un autre ordinateur, sans dépendre ni de l'image recalculée ni du nom du fichier */
function scEmpreinteFichier(f) { return f.arrayBuffer().then(b => crypto.subtle.digest("SHA-256", b)).then(h => Array.from(new Uint8Array(h)).slice(0, 12).map(x => x.toString(16).padStart(2, "0")).join("")); }
function scChargerFichiers(fs, opts) {
  if (!fs.length) return Promise.resolve(0);
  const pour = opts && opts.pour; SC.chargement = { pour: pour || null, donnees: 0, autres: [] };   // [C14 1.4.13] « 📄 Charger sa copie » : ses pages lui sont données d'office
  let ordre = scPagesOrdre().reduce((m, p) => Math.max(m, p.ordre || 0), 0);
  const nouvelles = []; let n = 0, anciennes = 0;
  const parImage = opts && opts.parImage;   // [C14 1.4.28] ces fichiers-là ont été reconnus par leur image : leur feuille peut avoir sa photo ici
  const traiter = (cv, src, img) => scPage(cv, src, img).then(o => { if (o.ancienne) { anciennes++; return; } n++; scTemoinCharge("Page " + n + " lue…");
    const ex = SC.pages[o.id];
    if (ex && src && !(ex.source && ex.source.f === src.f && ex.source.p === src.p)) { ex.source = src; ruEcrire(scChemin(["pages", o.id]), ex, "l'origine d'une page"); }   // une page déjà connue reçoit son origine, une fois
    SC.imgs[o.id] = scImg(o.blob, o.w, o.h); if (SC.encres) delete SC.encres[o.id]; if (o.orig) SC.origs[o.id] = { blob: o.orig, w: o.ow, h: o.oh };
    const meta = ex || Object.assign({ id: o.id, eleve: null, ordre: ++ordre, blanche: o.blanche, lignes: o.lignes, rot: o.rot, w: o.w, h: o.h, creeLe: new Date().toISOString() }, src ? { source: src } : {});
    if (pour && !meta.blanche) { if (!meta.eleve) { meta.eleve = pour; meta.modifieLe = new Date().toISOString(); SC.chargement.donnees++; if (ex) ruEcrire(scChemin(["pages", o.id]), meta, "la page de " + nomEleveDe(pour)); } else if (meta.eleve === pour) SC.chargement.donnees++; else SC.chargement.autres.push(meta.eleve); }   // une page déjà à un autre élève lui reste
    if (!ex) { SC.pages[o.id] = meta; nouvelles.push(meta); ruEcrire(scChemin(["pages", o.id]), meta, "une page du paquet"); }
    return scDbMettre({ id: o.id, red: RU.id, classe: RU.classe, blob: o.blob, w: o.w, h: o.h, le: new Date().toISOString() }); });   // [C14 1.4.12, mesuré] une page déjà connue reprend ici sa retouche (scPage) : le même paquet, rechargé sur un autre ordinateur, rend tout
  let ch = Promise.resolve();
  fs.forEach(f => { ch = ch.then(() => scEmpreinteFichier(f).catch(() => null)).then(fh => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name) ? scLirePdf(f, (cv, i) => traiter(cv, fh ? { f: fh, p: i } : null, parImage && parImage.has(f))) : scLireImage(f).then(cv => traiter(cv, fh ? { f: fh, p: 1 } : null, parImage && parImage.has(f)))); });
  return ch.then(() => { scCopiesOrdre(); if (pour) { state.paquetOrdre = SC.copies.slice(); saveState(); } SC.attrib = scPagesSans().length > 0; SC.ia = scPremiereSans(); scTemoinCharge("");
    toast(n + " page" + (n > 1 ? "s" : "") + " lue" + (n > 1 ? "s" : "") + (nouvelles.length < n ? " · " + (n - nouvelles.length) + " déjà connue" + (n - nouvelles.length > 1 ? "s" : "") + " : leurs marques reviennent" : "") + (anciennes ? " · " + anciennes + " ancienne" + (anciennes > 1 ? "s" : "") + " photo" + (anciennes > 1 ? "s" : "") + " remplacée" + (anciennes > 1 ? "s" : "") + ", laissée" + (anciennes > 1 ? "s" : "") + " de côté" : ""));
    scRendre(); return n; }, e => { scTemoinCharge(""); toast("⚠ Ce fichier n'a pas pu être lu."); console.error(e); return 0; });
}
function scTemoinCharge(t) { const e = document.getElementById("scCharge"); if (e) e.textContent = t; }
function scLireImage(f) { return createImageBitmap(f).then(b => { const k = Math.min(1, 1800 / b.height); const cv = document.createElement("canvas"); cv.width = Math.round(b.width * k); cv.height = Math.round(b.height * k); cv.getContext("2d").drawImage(b, 0, 0, cv.width, cv.height); return cv; }); }
function scPdfJs() { if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib); return new Promise((res, rej) => { const s = document.createElement("script"); s.src = SC_PDFJS + "pdf.min.js"; s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = SC_PDFJS + "pdf.worker.min.js"; res(window.pdfjsLib); }; s.onerror = rej; document.head.appendChild(s); }); }
function scLirePdf(f, traiter) {
  return Promise.all([scPdfJs(), f.arrayBuffer()]).then(([lib, buf]) => lib.getDocument({ data: buf }).promise).then(doc => {
    let ch = Promise.resolve();
    for (let i = 1; i <= doc.numPages; i++) ch = ch.then(() => doc.getPage(i)).then(pg => { const v0 = pg.getViewport({ scale: 1 }); const v = pg.getViewport({ scale: 1800 / v0.height });
      const cv = document.createElement("canvas"); cv.width = Math.round(v.width); cv.height = Math.round(v.height);
      return pg.render({ canvasContext: cv.getContext("2d"), viewport: v }).promise.then(() => traiter(cv, i)); });
    return ch;
  });
}
// une page : son empreinte (son identité), ses lignes écrites, page blanche ou non, l'image en JPEG
function scTourner(cv, deg) {   // deg : un quart de tour dans le sens inverse des aiguilles d'une montre, par 90
  const q = ((deg % 360) + 360) % 360; if (!q) return cv; const c = document.createElement("canvas"); c.width = q % 180 ? cv.height : cv.width; c.height = q % 180 ? cv.width : cv.height;
  const x = c.getContext("2d"); x.translate(c.width / 2, c.height / 2); x.rotate(-q * Math.PI / 180); x.drawImage(cv, -cv.width / 2, -cv.height / 2); return c; }
/* une empreinte d'image presque identique (8 points sur 256 au plus) : la même feuille, calculée un peu autrement sur un autre ordinateur ; seulement si une seule
   feuille de la rédaction est aussi proche, et si sa photo n'est pas déjà dans ce navigateur */
function scPageProche(hex, avecPhoto) {
  const bits = c => [8, 4, 2, 1].map(b => (parseInt(c, 16) & b) ? 1 : 0), dist = (a, b) => { let d = 0; for (let i = 0; i < 64; i++) { const x = bits(a[i]), y = bits(b[i]); for (let j = 0; j < 4; j++) if (x[j] !== y[j]) d++; } return d; };
  /* seulement une feuille sans origine (pas encore rechargée depuis la 1.4.13), pas blanche, sans photo ici ; la plus proche à 8 points au plus, et la suivante loin derrière (24 points) */
  const C = Object.values(SC.pages).filter(p => p && /^page_[0-9a-f]{64}_/.test(p.id) && !p.source && !p.blanche && (avecPhoto || !SC.imgs[p.id])).map(p => ({ p, d: dist(p.id.slice(5, 69), hex) })).sort((x, y) => x.d - y.d);
  return C[0] && C[0].d <= 8 && (!C[1] || C[1].d >= 24) ? C[0].p : null;
}
function scEmpreinteImage(cvLu) {   // l'empreinte de l'image (16 × 16 points) : l'identité donnée à une feuille à son premier chargement
  const p = document.createElement("canvas"); p.width = 16; p.height = 16; const pc = p.getContext("2d"); pc.drawImage(cvLu, 0, 0, 16, 16);
  const d = pc.getImageData(0, 0, 16, 16).data; const g = []; for (let i = 0; i < 256; i++) g.push(d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]);
  const moy = g.reduce((a, b) => a + b, 0) / 256; let hex = ""; for (let i = 0; i < 256; i += 4) { let v = 0; for (let j = 0; j < 4; j++) v = v * 2 + (g[i + j] > moy ? 1 : 0); hex += v.toString(16); }
  return hex;
}
function scPage(cvLu, src, avecPhoto) {
  const hex = scEmpreinteImage(cvLu);
  const id0 = "page_" + hex + "_" + cvLu.width.toString(36) + cvLu.height.toString(36), parSource = src && Object.values(SC.pages).find(p => p && p.source && p.source.f === src.f && p.source.p === src.p);
  const id = parSource ? parSource.id : SC.pages[id0] ? id0 : ((scPageProche(hex, avecPhoto) || {}).id || id0);
  /* [C14 1.4.13] une photo remplacée : son ancien fichier (ou la même image venue d'ailleurs) est laissé de côté, la nouvelle photo reste */
  const ancienne = !parSource && (src && Object.values(SC.pages).some(p => p && (p.anciennes || []).some(a => a.f === src.f && a.p === src.p)) || (SC.pages[id] && SC.pages[id].remplaceeLe && SC.pages[id].source && !(src && SC.pages[id].source.f === src.f && SC.pages[id].source.p === src.p)));
  if (ancienne) return Promise.resolve({ id, ancienne: true });
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
function scAttribSuivante() { const L = scPagesOrdre(); let i = SC.ia + 1; while (i < L.length && L[i].blanche) i++; SC.ia = i; if (i >= L.length) { SC.attrib = scPagesSans().length > 0; SC.ia = 0; if (!SC.attrib) toast("Toutes les pages ont leur élève."); } scRendre(); }
function scPrecedentEleve() { const L = scPagesOrdre(); for (let i = SC.ia - 1; i >= 0; i--) if (L[i].eleve && !L[i].blanche) return L[i].eleve; return null; }
function scBlanche(v) { const p = scPagesOrdre()[SC.ia]; if (!p) return; p.blanche = v; if (v) p.eleve = null; ruEcrire(scChemin(["pages", p.id]), p, "une page blanche"); scCopiesOrdre(); if (v) scAttribSuivante(); else scRendre(); }
// ── la grille : questions sautées, cases calculées ──
// une question a son identité (cle) : les réponses et les marques la portent ; la grille, elle, écrit ses conditions par numéro, traduit ici
// le site (Firebase) n'enregistre pas un tableau vide : un point calculé revient sans « questions » ; et il rend le barème (clés 0 à 3) en tableau
function scGrilleNormale(g) { (g.criteres = g.criteres || []).forEach(c => { c.points = c.points || []; c.points.forEach(pt => { pt.questions = pt.questions || []; pt.cases = pt.cases || []; pt.bareme = pt.bareme || {}; }); }); return g; }
function scQ(pt, c) { return pt.questions.find(q => q.cle === c); }
function scCleDe(pt, i) { const q = pt.questions.find(q => q.id === +i); return q ? q.cle : null; }
function scSautee(pt, q, rep) { if (!q || !q.saute) return false; const [t, i] = q.saute.split(":"); const c = scCleDe(pt, i); return t === "n" ? rep[c] === "n" : rep[c] === "o"; }
function scQuestions(pt, rep) { return pt.questions.filter(q => !scSautee(pt, q, rep || {})); }
function scFautes(k) { return Object.values(scCopie(k).marques).filter(m => m.forme === "faute"); }
// les lignes écrites : comptées d'office sur les copies de l'appli (lignes connues) ; sur une photo, l'appli propose, tu gardes ou tu corriges (mesuré le 30/10 sur tes copies : la réglure et les feuilles voisines faussent le compte)
function scLignesProposees(k) { const P = scPagesDe(k); if (P.some(p => !p.lignes || p.lignes.fiable === false)) return 0; return P.reduce((n, p) => n + (p.lignes.n || 0), 0); }
function scLignesCopie(k) { const s = scCopie(k); if (s.lignes != null) return s.lignes; const P = scPagesDe(k); return P.length && P.every(p => p.lignes && p.lignes.reperes) ? scLignesProposees(k) : 0; }
function scCase(pt, k, lecture) {
  const s = lecture || scCopie(k); const rep = s.rep[pt.id] || {};
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
function scK() { return SC.copies[SC.ic]; }
function scChrono() { SC.actif = Date.now(); }   // [C14 401] le chrono des passes est parti avec elles ; le temps se compte dans la recopie et la bande (403)
function scSegments(m, p) {   // un surlignage sur plusieurs lignes suit les lignes, du mot où tu as appuyé au mot où tu as lâché
  if (Array.isArray(m.segs) && m.segs.length) return m.segs;   // [C14 1.4.12] la phrase qui m'a marqué, choisie sur la recopie : une bande par ligne
  const L = p.lignes && p.lignes.l, pas = (p.lignes && p.lignes.pas) || 0.03;
  if (!(m.forme === "surligne" || m.forme === "etoile") || m.l0 == null || m.l1 == null || m.l1 === m.l0 || !L) return [[m.x0, m.y0, m.x1, m.y1]];
  const S = []; for (let l = m.l0; l <= m.l1; l++) { const a = l === m.l0 ? m.x0 : Math.min(L[l].x0, 0.12), b = l === m.l1 ? m.x1 : Math.max(L[l].x1, 0.9); S.push([a, L[l].y - pas * 0.48, b, L[l].y + pas * 0.3]); }
  return S;
}
function scNumeroter(k) { const pg = scPagesDe(k).map(p => p.id); const L = scFautes(k).sort((a, b) => (pg.indexOf(a.page) - pg.indexOf(b.page)) || (a.y0 - b.y0) || (a.x0 - b.x0)); L.forEach((m, i) => { m.num = i + 1; m.rang = L.slice(0, i).filter(x => x.page === m.page && Math.abs((x.y0 + x.y1) / 2 - (m.y0 + m.y1) / 2) < 0.012).length; }); }
// ── poser, déplacer, effacer, annuler ──
function scPoser(m) { if (!(typeof RC !== "undefined" && RC.ouvert)) state.scanDernier = "scans";   /* [C14 1.4.12] là où tu travailles : la carte d'un élève y rouvre sa copie */
  const k = scK(); m.id = scId("marque"); m.eleve = k; m.creeLe = m.modifieLe = new Date().toISOString(); scCopie(k).marques[m.id] = m; SC.annule.push({ t: "pose", k, id: m.id });
  if (m.q != null && m.point && (m.sens === "non" || m.sens === "oui")) { const s = scCopie(k); s.rep[m.point] = s.rep[m.point] || {}; s.rep[m.point][m.q] = m.sens === "non" ? "n" : "o"; }
  scNumeroter(k); saveState(); return m; }
function scEffacer(id) { const k = scK(); const s = scCopie(k); const m = s.marques[id]; if (!m) return; SC.annule.push({ t: "efface", k, m: JSON.parse(JSON.stringify(m)) }); delete s.marques[id]; SC.sel = null; scNumeroter(k); saveState(); scRendre(); }
// 1444 : le champ se pose au-dessus du mot, sur les lignes déjà lues, relié au mot par un trait : il ne cache jamais la suite de la copie ; tiré ailleurs, il garde cette place pour les champs suivants
try { SC.champDecal = JSON.parse(localStorage.getItem("mjpc_scan_champ") || "null"); } catch (e) { SC.champDecal = null; }
// ── le clavier ──
function scClavier(e) {
  if (typeof rcClavier === "function" && rcClavier(e)) return;
  if (!SC.ouvert) return;
  if (SC.rt) { const t = { Enter: () => scRtFermer(true), Escape: () => scRtFermer(false), ArrowLeft: () => scRtTourner(-1), ArrowRight: () => scRtTourner(1) }[e.key]; if (t) { e.preventDefault(); e.stopPropagation(); t(); } return; }
  const a = document.activeElement; const ecrit = a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA");
  if (SC.attrib) { if (!ecrit && e.key === "ArrowRight") { e.preventDefault(); scAttribSuivante(); } return; }
  if (ecrit) return;
  if (e.key === "Escape") { const ai = document.getElementById("ruAide"); if (ai && !ai.hidden) return; if (document.getElementById("scModale").classList.contains("show")) { e.preventDefault(); scModaleFermer(); } }   // [C14 401] le paquet : aucune touche de l'ancien flux
}
addEventListener("keydown", e => { const avant = e.defaultPrevented; scClavier(e); if (!avant && e.defaultPrevented) e.stopPropagation(); }, true);
// ── le rendu : le haut, la copie, le panneau, le paquet ──
function scRendre() {
  const E = document.getElementById("scanEcran"); if (!E || !SC.ouvert) return;
  /* [C14 404] hors des initiales, le milieu de l'écran est le paquet : ses pages en vignettes, rangées par élève ; un clic ouvre sa recopie à cette page.
     [C14 401] l'ancien flux (les passes, les questions, le pinceau, le récapitulatif) est retiré : restent le paquet et « 🔤 Les initiales » */
  E.classList.toggle("sc-vue-paquet", !SC.attrib);
  const man = scManquantes(); document.getElementById("scManque").innerHTML = man.length ? `⚠ ${man.length} page${man.length > 1 ? "s" : ""} de ce paquet ne ${man.length > 1 ? "sont" : "est"} pas dans ce navigateur : remets ton paquet (clé USB) avec « 📄 Charger des copies ». Ta recopie et tes marques reviendront d'elles-mêmes.` : "";
  if (SC.attrib) { scDessinerPages(); scPanneau(); scPaquet(); scZoomAffiche(); scTitreCopie(); } else scVuePaquet();
  if (typeof rcActualiser === "function") rcActualiser();
}
function scPagesAffichees() { const p = scPagesOrdre()[SC.ia]; return SC.attrib && p ? [p] : []; }
function scDessinerPages() {   // [C14 401] la page à donner à son élève, pendant « 🔤 Les initiales »
  const Z = document.getElementById("scCopie"); const ps = scPagesAffichees(); Z.dataset.pq = "";
  if (!ps.length) { Z.dataset.sig = ""; Z.innerHTML = `<div class="sc-vide">Aucune page à afficher.</div>`; return; }
  const lw = Math.max(240, Z.clientWidth - 30) * (SC.zoom || 1); SC.upx = 1000 / lw;   // la page à la largeur de la zone, fois ton zoom
  let html = "";
  ps.forEach(p => { const im = SC.imgs[p.id]; const Hs = Math.round(1000 * p.h / p.w);
    html += `<div class="sc-page${p.blanche ? " blanche" : ""}" data-p="${p.id}" style="width:${Math.round(lw)}px;height:${Math.round(lw * p.h / p.w)}px;cursor:default">${im ? `<img src="${im.url}" alt="" draggable="false">` : `<div class="sc-absente">Page absente de ce navigateur</div>`}<svg viewBox="0 0 1000 ${Hs}" preserveAspectRatio="none"></svg></div>`; });
  const sig = ps.map(p => p.id + ":" + p.w + "x" + p.h).join("|");
  if (Z.dataset.sig === sig && Z.querySelectorAll(".sc-page").length === ps.length) { Z.querySelectorAll(".sc-page").forEach((e, i) => { const p = ps[i]; if (p) { e.style.width = Math.round(lw) + "px"; e.style.height = Math.round(lw * p.h / p.w) + "px"; } }); return; }
  Z.innerHTML = html; Z.dataset.sig = sig;
}
function scPanneau() { scPanneauAttrib(document.getElementById("scPanneau")); }   // [C14 401] le panneau ne sert plus qu'aux initiales
function scPanneauAttrib(Z) {
  const L = scPagesOrdre(); const p = L[SC.ia]; const reste = scPagesSans().length; const prec = scPrecedentEleve();
  Z.innerHTML = `<div class="sc-bloc"><h3>Le paquet · page ${SC.ia + 1} sur ${L.length}</h3><p>Tape les initiales de l'élève de cette page, Entrée. <b>Entrée seule</b> : même élève que la page d'avant${prec ? " (" + escapeHtml(nomEleveDe(prec)) + ")" : ""}.</p>
    <input id="scInit" class="sc-init" autocomplete="off" placeholder="initiales" title="Les initiales, dans n'importe quel ordre (CE ou EC pour Chauvin Emma)."><div id="scInitSug" class="sc-m"></div>
    <button class="sc-btn" onclick="scTournerPage('${p ? p.id : ""}')" title="Tourner cette page d'un quart de tour vers la droite (une photo prise de côté). Ses marques tournent avec elle.">↻ Tourner</button>
    <button class="sc-btn" onclick="scRecadrerDebut('${p ? p.id : ""}')" title="Retoucher cette page comme une photo : le cadre (ce qui dépasse, une autre copie, la table, disparaît de la copie et du fichier de l'élève) et la rotation degré par degré. Rien n'est perdu.">✂ Retoucher</button>
    ${p && p.blanche ? `<p class="sc-alerte">L'appli n'y voit aucune ligne écrite : page blanche, sautée.</p><button class="sc-btn" onclick="scBlanche(false)" title="Cette page porte bien une copie : elle reprend sa place dans le paquet.">Ce n'est pas une page blanche</button>` : `<button class="sc-btn" onclick="scBlanche(true)" title="Écarter cette page : elle ne va à aucun élève.">Page blanche</button>`}
    <p class="sc-m">${reste} page${reste > 1 ? "s" : ""} sans élève · ${SC.copies.length} copie${SC.copies.length > 1 ? "s" : ""} reconnue${SC.copies.length > 1 ? "s" : ""}. L'ordre du paquet devient celui de tes flèches.</p>
    ${reste ? "" : `<button class="sc-btn" onclick="SC.attrib=false;scRendre()" title="Toutes les pages ont leur élève : revenir au paquet, en vignettes par élève.">✓ Le paquet</button>`}</div>`;
  const inp = document.getElementById("scInit"); setTimeout(() => inp.focus({ preventScroll: true }), 0);
  const sug = () => { const c0 = inp.value.trim().length >= 2 ? eleveDePar(inp.value) : [], c = c0.filter(n => !(typeof avAbsent === "function" && avAbsent(eleveId(n)))), ab = c0.filter(n => !c.includes(n));
    document.getElementById("scInitSug").innerHTML = !inp.value.trim() ? "" : !c.length && ab.length ? ab.map(n => `<b>${escapeHtml(n)}</b> est marqué absent : il n'a pas de page. <button class="sc-btn" onclick="avAbsentBasculer('${escapeAttr(eleveId(n))}');const i=document.getElementById('scInit');i.dispatchEvent(new Event('input'));i.focus()" title="Il était là : le marquer présent, puis lui donner cette page (Entrée).">✓ Marquer présent</button>`).join(" · ") : !c.length ? "Aucun élève avec ces initiales." : c.map((n, i) => `${c.length > 1 ? `<span class="sc-touche">${i + 1}</span>` : "→"} <b>${escapeHtml(n)}</b>`).join(" · ") + (c.length > 1 ? " : tape son chiffre" : " : Entrée"); return c; };
  inp.addEventListener("input", sug);
  inp.addEventListener("keydown", e => { e.stopPropagation(); const c = sug();
    if (e.key === "Enter") { e.preventDefault(); if (!inp.value.trim()) { if (prec) scAttribuer(prec); else toast("Pas de page d'avant : tape les initiales."); return; } if (c.length === 1) scAttribuer(eleveId(c[0])); }
    else if (/^[1-9]$/.test(e.key) && c.length > 1 && c[+e.key - 1]) { e.preventDefault(); scAttribuer(eleveId(c[+e.key - 1])); }
    else if (e.key === "ArrowRight") { e.preventDefault(); scAttribSuivante(); } });
}
function scPaquet() {   // [C14 401] la bande du bas, pendant « 🔤 Les initiales » : les pages du paquet, dans l'ordre
  const Z = document.getElementById("scPaquet");
  Z.innerHTML = '<span class="sc-m">Le paquet :</span>' + scPagesOrdre().map((p, i) => `<span class="sc-vig${i === SC.ia ? " cour" : ""}${p.blanche ? " blanche" : ""}" onclick="SC.ia=${i};scRendre()" title="Page ${i + 1}${p.eleve ? " · " + escapeAttr(nomEleveDe(p.eleve)) : ""}">${SC.imgs[p.id] ? `<img src="${SC.imgs[p.id].url}" alt="">` : ""}<em>${p.eleve ? escapeHtml(initialesEleve(nomEleveDe(p.eleve) || "?")) : i + 1}</em></span>`).join("");
}
// ── l'aide, la fenêtre ──
RU_AIDES.scan = { ou: "Corriger sur les scans", l: [   /* [C14 407] le paquet en vignettes : seulement ce qui reste */
  ["le paquet", "ses pages en vignettes, rangées par élève, avec son nom et ses étapes (recopiée, envoyée, chargée, la bande) ; une page sans élève vient en tête"],
  ["clic sur une page", "ouvre la recopie de son élève à cette page ; Échap y revient"],
  ["✍ Recopier", "la recopie de la copie où tu travaillais"],
  ["▶ La bande", "la bande, copie après copie : la première copie revenue de l'IA qui a encore quelque chose à revoir ; au bout, Entrée passe à la suivante ; aussi sur l'accueil"],
  ["📄 Charger des copies · 📂 Mon dossier", "ton paquet scanné, ou la copie d'un élève : un PDF ou des photos ; les pages neuves passent par « 🔤 Les initiales » ; elles restent dans ce navigateur et sur ta clé, jamais au site"],
  ["🔤 Les initiales", "l'élève de chaque page : tape ses initiales, Entrée ; Entrée seule : le même élève que la page d'avant ; → passe la page"],
  ["🖨 Copies vierges", "des copies de l'appli à imprimer : scannées, elles se remettent droites d'elles-mêmes"],
  ["📨 Fichiers École Directe", "le fichier de chaque élève, à tester comme lui, à télécharger, ou tous dans un zip (« 📦 Tout rendre »)"],
  ["sur un autre ordinateur", "recharge le même paquet : chaque page retrouve son élève, ta recopie, tes marques et tes retouches ; tout le reste est déjà au site"]] };
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
  if (!(p.lignes && p.lignes.reperes) && !p.vueTournee) { scOrigDe(pid).then(o => { if (!o) return scTournerPageVieux(pid); const r = p.recadre; scReglerPage(pid, { rot: ((p.rot || 0) + 270) % 360, angle: p.angle || 0, recadre: r ? [1 - r[3], r[0], 1 - r[1], r[2]] : null }); }); return; }
  scTournerPageVieux(pid);
}
function scTournerPageVieux(pid) {   // une page sans sa photo entière (une copie de l'appli, ou chargée avant) : l'image vue tourne
  const p = SC.pages[pid], im = SC.imgs[pid]; if (!p || !im) return;
  createImageBitmap(im.blob).then(bm => { const c = document.createElement("canvas"); c.width = bm.width; c.height = bm.height; c.getContext("2d").drawImage(bm, 0, 0); const r = scTourner(c, 270);
    if (typeof rcTransformerPage === "function") rcTransformerPage(pid, (x, y) => [1 - y, x]);
    /* [C14 402] une copie de l'appli (redressée par ses repères) tourne toujours ici, en vue : elle n'a pas de photo entière à laquelle se rapporter ; revenue droite, elle retrouve ses lignes connues */
    const vue = !!(p.lignes && p.lignes.reperes) || !!p.vueTournee; if (!(p.rot || 0) && p.lignes) p.lignesDroites = p.lignes;
    p.rot = (((p.rot || 0) + 270) % 360); if (p.recadre) { const [a0, b0, c0, d0] = p.recadre; p.recadre = [1 - d0, a0, 1 - b0, c0]; } p.w = r.width; p.h = r.height; p.lignes = !p.rot && p.lignesDroites ? p.lignesDroites : scLignes(r); p.blanche = false; p.modifieLe = new Date().toISOString();
    if (!p.rot) { delete p.lignesDroites; delete p.vueTournee; } else if (vue) p.vueTournee = true;
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
  const p = SC.pages[pid], im = SC.imgs[pid]; if (!p || !im || p.recadre || p.angle || (p.lignes && p.lignes.reperes) || p.vueTournee) return Promise.resolve(null);
  return createImageBitmap(im.blob).then(bm => { const c = document.createElement("canvas"); c.width = bm.width; c.height = bm.height; c.getContext("2d").drawImage(bm, 0, 0); const r = scTourner(c, (360 - (p.rot || 0)) % 360);
    return new Promise(res => r.toBlob(b => { SC.origs[pid] = { blob: b, w: r.width, h: r.height }; scDbMettre({ id: pid, red: RU.id, classe: RU.classe, blob: im.blob, w: im.w, h: im.h, le: new Date().toISOString() }); res(SC.origs[pid]); }, "image/jpeg", 0.9)); });
}
function scToile(blob) { return createImageBitmap(blob).then(bm => { const c = document.createElement("canvas"); c.width = bm.width; c.height = bm.height; c.getContext("2d").drawImage(bm, 0, 0); return c; }); }
// appliquer un réglage (quart de tour, inclinaison, cadre) à une page : l'image refaite de la photo entière, ses marques déplacées avec leurs mots
function scReglerPage(pid, B, cvO) {
  const p = SC.pages[pid]; if (!p) return Promise.resolve();
  const prend = cvO ? Promise.resolve(cvO) : scOrigDe(pid).then(o => o ? scToile(o.blob) : null);
  return prend.then(cv0 => {
    if (!cv0) { toast("Remets ton paquet une fois (« 📄 Charger des copies ») : l'appli garde alors la photo entière de cette page, pour la retoucher sans rien perdre."); return; }
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
  if ((p.lignes && p.lignes.reperes) || p.vueTournee) { toast("Une copie de l'appli se remet droite et se recadre d'elle-même : rien à retoucher."); return; }
  scOrigDe(pid).then(o => { if (!o) { toast("Remets ton paquet une fois (« 📄 Charger des copies ») : l'appli garde alors la photo entière de cette page, pour la retoucher sans rien perdre."); return; }
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


// l'infobulle de la copie : ce que fait la souris sur la copie, à cet instant (le pinceau change avec la question)
function scTitreCopie() {
  const Z = document.getElementById("scCopie"); if (!Z) return;
  SC.titreCopie = !Object.keys(SC.pages).length ? "Ton paquet de copies s'affichera ici. Clique au milieu pour le charger : un PDF ou des photos." : SC.attrib ? "La page à donner à un élève : tape ses initiales à droite, Entrée. Ctrl + molette : zoom. Maj tenue : la loupe." : "";
  if (Z.hasAttribute("title")) Z.removeAttribute("title");
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

// [C14 dette ⑤] Remettre une copie à zéro (Paul, 30/10 11:39 : « je veux supprimer la correction de flavie pour repartir de zéro »).
// Comme ruSupprimer : un export JSON téléchargé, puis la corbeille MJPC, puis l'effacement. S'effacent la correction : l'ancienne,
// les marques sur les scans et celles mises de côté, les réponses, la bande et ses décisions, le temps. Restent les pages de l'élève,
// la recopie, le corrigé de l'IA et le nombre de lignes : c'est la copie elle-même, pas son jugement.
function scOublierCopie(k) {   // la copie quitte la mémoire de cette page : plus rien ne la réécrit
  delete RU.sig[k]; if (RU.sigCorps) delete RU.sigCorps[k];
  delete state.copies[k]; copieFor(k);
}
function scApresOubli(k) {
  if (typeof RC !== "undefined" && RC.copie === k) { if (RC.bd) rcBandeFermer(true); RC.documents = {}; RC.annule = []; if (RC.ouvert) rcActualiser(); }   // la recopie en mémoire est relue depuis la copie
  if (SC.ouvert) scRendre();
}

/* ═══ [C14 1.4.13] le dossier des copies, la photo remplacée, les photos retirées (Paul 01/11 08:04 et 08:27 ; C14 356 à 359, 365 à 367) ═══ */
/* « 📂 Mon dossier de copies » : un dossier par rédaction (une rédaction = une classe), choisi une fois par ordinateur ; Chrome et Edge s'en souviennent */
function scDossier() {
  if (!RU.id) return; const cle = "dossier_" + RU.id;
  const choisir = () => { if (!window.showDirectoryPicker) { scDossierSansMemoire(); return null; } return window.showDirectoryPicker({ id: "mjpc-copies", mode: "read" }).then(h => scDbFaire("readwrite", st => st.put({ id: cle, dossier: h, red: RU.id, le: new Date().toISOString() })).then(() => h), () => null); };
  scDbFaire("readonly", st => st.get(cle)).catch(() => null).then(r => {
    const h = r && r.dossier; if (!h || !h.queryPermission) return choisir();
    return h.queryPermission({ mode: "read" }).then(e => e === "granted" ? e : h.requestPermission({ mode: "read" })).then(e => e === "granted" ? h : choisir(), () => choisir());
  }).then(h => { if (h) scDossierLire(h); });
}
function scDossierSansMemoire() {   // Firefox, Safari : le dossier se choisit à chaque fois
  const inp = document.createElement("input"); inp.type = "file"; inp.multiple = true; inp.webkitdirectory = true;
  inp.onchange = () => scDossierFichiers(Array.from(inp.files || []), "ton dossier"); inp.click();
}
function scDossierLire(h) {
  const F = []; const lire = d => (async () => { for await (const e of d.values()) { if (e.kind === "file" && /\.(pdf|jpe?g|png)$/i.test(e.name)) F.push(await e.getFile()); else if (e.kind === "directory") await lire(e); } })();
  scTemoinCharge("Lecture du dossier…"); lire(h).then(() => scDossierFichiers(F, "« " + h.name + " »"), () => { scTemoinCharge(""); toast("⚠ Le dossier n'a pas pu être lu."); });
}
function scDossierFichiers(fichiers, nom) {
  fichiers = fichiers.filter(f => /\.(pdf|jpe?g|png)$/i.test(f.name)); if (!fichiers.length) { scTemoinCharge(""); toast("Aucun PDF ni photo dans " + nom + "."); return Promise.resolve(); }
  return Promise.all(fichiers.map(f => scEmpreinteFichier(f).catch(() => null))).then(E => {
    const P = Object.values(SC.pages).filter(p => p && p.id);
    const connus = [], aVoir = []; let deja = 0, remplaces = 0;
    fichiers.forEach((f, i) => { const pg = P.filter(p => p.source && p.source.f === E[i]); if (pg.length && pg.every(p => SC.imgs[p.id])) deja++; else if (pg.length) connus.push(f);
      else if (P.some(p => (p.anciennes || []).some(a => a.f === E[i]))) remplaces++; else aVoir.push(f); });   // l'ancien fichier d'une photo remplacée : laissé de côté, sans te le demander
    /* [C14 1.4.28] (Paul 02/11 18:45, C14 55) la règle se décide feuille par feuille : un fichier dont l'origine n'est pas connue est d'abord comparé, par son image,
       aux feuilles qui n'ont pas encore la leur (chargées avant la 1.4.13) ; si c'est l'une d'elles, il la reprend et lui donne son origine ; seul un fichier qui ne ressemble à aucune feuille est montré */
    return scParImage(aVoir).then(({ oui, non }) => { const inconnus = non; SC.dossierInconnus = inconnus;
    return scChargerFichiers(connus.concat(oui), { parImage: new Set(oui) }).then(n => { scTemoinCharge("");
      toast(nom + " : " + (n ? n + " page" + (n > 1 ? "s" : "") + " retrouvée" + (n > 1 ? "s" : "") : "rien à recharger") + (deja ? " · " + deja + " fichier" + (deja > 1 ? "s" : "") + " déjà là" : "") + (remplaces ? " · " + remplaces + " ancienne" + (remplaces > 1 ? "s" : "") + " photo" + (remplaces > 1 ? "s" : "") + " remplacée" + (remplaces > 1 ? "s" : "") + ", laissée" + (remplaces > 1 ? "s" : "") + " de côté" : ""));
      if (inconnus.length) scModale(`<h3>${inconnus.length} fichier${inconnus.length > 1 ? "s" : ""} que cette rédaction ne connaît pas</h3><p>${inconnus.length > 1 ? "Ils sont" : "Il est"} dans ${escapeHtml(nom)}, mais aucune page de cette classe ne vient ${inconnus.length > 1 ? "d'eux. Ce sont peut-être de nouvelles copies" : "de lui. C'est peut-être une nouvelle copie"}.</p><ul>${inconnus.map(f => "<li>" + escapeHtml(f.name) + "</li>").join("")}</ul>
        <button class="sc-btn" id="scDossierOui" onclick="scModaleFermer();scChargerFichiers(SC.dossierInconnus||[])" title="Les charger comme un nouveau paquet : leurs pages passent par « Les initiales ».">Les charger</button> <button class="sc-btn" onclick="scModaleFermer()" title="Ne rien charger : ils restent sur ta clé.">Non</button>`); }); });
  });
}
/* une feuille sans origine que ce fichier refait : la même image (son empreinte exacte), ou presque (8 points sur 256 au plus, et la suivante loin derrière, à 24 points) ;
   mesuré au site le 02/11 : les deux feuilles les plus proches sont à 47 points chez les Dylan, à 37 chez les Franklin */
function scFeuilleParImage(cv) {
  const hex = scEmpreinteImage(cv), id0 = "page_" + hex + "_" + cv.width.toString(36) + cv.height.toString(36), ex = SC.pages[id0];
  if (ex && !ex.source) return ex; return scPageProche(hex, true);
}
function scParImage(fs) {
  const sans = Object.values(SC.pages).some(p => p && p.id && !p.source && !p.blanche); if (!fs.length || !sans) return Promise.resolve({ oui: [], non: fs.slice() });
  const oui = [], non = []; let ch = Promise.resolve(); scTemoinCharge("Les photos comparées à tes feuilles…");
  fs.forEach(f => { ch = ch.then(() => { const vus = []; const lu = /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name) ? scLirePdf(f, cv => { vus.push(scFeuilleParImage(cv)); return Promise.resolve(); }) : scLireImage(f).then(cv => { vus.push(scFeuilleParImage(cv)); });
    return lu.then(() => { (vus.some(Boolean) ? oui : non).push(f); }, () => non.push(f)); }); });
  return ch.then(() => ({ oui, non }));
}
/* « 📷 Remplacer la photo » d'une page : la feuille garde son identité ; ta recopie reste et se recale sur la nouvelle photo, les cadres de la bande se replacent */
function scRemplacerPage(pid) {
  if (!SC.pages[pid]) return; const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/pdf,.pdf,image/*";
  inp.onchange = () => { const f = inp.files && inp.files[0]; if (f) scRemplacerAvec(pid, f); }; inp.click();
}
function scRemplacerAvec(pid, f) {
  const p = SC.pages[pid]; let n = 0, cv = null; scTemoinCharge("La nouvelle photo…");
  const lu = /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name) ? scLirePdf(f, c => { n++; if (!cv) cv = c; }) : scLireImage(f).then(c => { n = 1; cv = c; });
  return Promise.all([lu, scEmpreinteFichier(f).catch(() => null)]).then(([, fh]) => {
    if (n !== 1 || !cv) { scTemoinCharge(""); toast("Choisis la photo d'une seule page, ou un PDF d'une page : ce fichier en a " + n + "."); return; }
    const rot = cv.width > cv.height * 1.08 ? 90 : 0, c0 = scTourner(cv, rot), H = scReperes(c0), c1 = H ? scRedresser(c0, H) : c0, lig = H ? scLignesConnues(c1) : scLignes(c1), le = new Date().toISOString();
    return Promise.all([new Promise(r => c1.toBlob(r, "image/jpeg", 0.85)), new Promise(r => cv.toBlob(r, "image/jpeg", 0.82))]).then(([b, g]) => {
      const im0 = SC.imgs[pid]; if (im0) { try { URL.revokeObjectURL(im0.url); } catch (e) {} }
      const anc = (p.anciennes || []).concat(p.source ? [p.source] : []).filter(a => !(fh && a.f === fh && a.p === 1));   // l'ancien fichier, sur ta clé, ne reviendra plus sur cette feuille
      Object.assign(p, { rot, angle: 0, recadre: null, w: c1.width, h: c1.height, lignes: lig, remplaceeLe: le, modifieLe: le }); if (anc.length) p.anciennes = anc; if (fh) p.source = { f: fh, p: 1 }; else delete p.source;
      SC.imgs[pid] = scImg(b, c1.width, c1.height); SC.origs[pid] = { blob: g, w: cv.width, h: cv.height }; if (SC.encres) delete SC.encres[pid];
      ruEcrire(scChemin(["pages", pid]), p, "une photo remplacée");
      return scDbMettre({ id: pid, red: RU.id, classe: RU.classe, blob: b, w: c1.width, h: c1.height, orig: g, ow: cv.width, oh: cv.height, le })
        .then(() => new Promise(r => { const el = SC.imgs[pid].el; if (el.complete && el.naturalWidth) r(); else { el.onload = r; el.onerror = r; } }))
        .then(() => { const k = p.eleve; let dit = "la feuille garde son identité";
          if (k && typeof rcRecalerPage === "function") dit += rcRecalerPage(k, pid);
          const main = k ? Object.values(scCopie(k).marques).filter(m => m.page === pid && !m.bande && !(m.forme === "etoile" && m.recopie)).length : 0;
          if (main) dit += " · " + main + " marque" + (main > 1 ? "s" : "") + " posée" + (main > 1 ? "s" : "") + " à la main sur l'ancienne photo : à revoir";
          scTemoinCharge(""); saveState(); const Z = document.getElementById("scCopie"); if (Z) Z.dataset.sig = ""; scRendre(); if (typeof RC !== "undefined" && RC.ouvert && typeof rcActualiser === "function") rcActualiser(true);
          toast("Photo remplacée : " + dit + "."); });
    });
  });
}
/* « Retirer les photos » de la copie affichée : seulement de ce navigateur ; la copie redevient à charger, sa recopie et sa correction restent au site */
function scRetirerPhotos() {
  const k = scK(); if (!k) return; const P = scPagesDe(k).filter(p => SC.imgs[p.id]); if (!P.length) { toast("Cette copie n'a pas de photo dans ce navigateur."); return; }
  scModale(`<h3>Retirer les photos de ${escapeHtml(nomEleveDe(k) || k)} ?</h3><p>${P.length} page${P.length > 1 ? "s" : ""} : leur photo quitte ce navigateur. La copie redevient à charger : recharge-la depuis ta clé, ou remplace chaque page par une meilleure photo (« 📷 »). Ta recopie, ta correction et tes marques restent au site.</p>
    <button class="sc-btn" id="scRetirerOui" onclick="scModaleFermer();scRetirerPhotosOui()" title="Retirer les photos de cette copie de ce navigateur.">Retirer</button> <button class="sc-btn" onclick="scModaleFermer()" title="Ne rien changer.">Annuler</button>`);
}
function scRetirerPhotosOui() {
  const k = scK(), P = scPagesDe(k).filter(p => SC.imgs[p.id]);
  return Promise.all(P.map(p => { const im = SC.imgs[p.id]; try { URL.revokeObjectURL(im.url); } catch (e) {} delete SC.imgs[p.id]; delete SC.origs[p.id]; if (SC.encres) delete SC.encres[p.id]; return scDbFaire("readwrite", st => st.delete(p.id)).catch(() => null); }))
    .then(() => { const Z = document.getElementById("scCopie"); if (Z) Z.dataset.sig = ""; scRendre(); toast(P.length + " photo" + (P.length > 1 ? "s" : "") + " retirée" + (P.length > 1 ? "s" : "") + " de ce navigateur."); });
}
/* ═══ [C14 404] le paquet en vignettes, rangées par élève, avec son nom et ses étapes ; une page sans élève en tête, pour « 🔤 Les initiales » ═══ */
function scVuePaquet() {
  const Z = document.getElementById("scCopie"); if (!Z) return; Z.dataset.sig = "";
  if (!Object.keys(SC.pages).length) { Z.dataset.pq = ""; Z.innerHTML = `<label class="sc-vide sc-vide-btn" title="Choisir ton paquet scanné, sur ta clé : un PDF, ou des photos (plusieurs à la fois). Il reste dans ce navigateur, jamais au site.">📄 Charger le paquet<small>un PDF ou des photos · il reste dans ce navigateur, jamais au site</small><input type="file" accept="application/pdf,.pdf,image/*" multiple onchange="scCharger(event)" hidden></label>`; return; }
  const O = scPagesOrdre(), vig = (p, titre, clic, n) => { const im = SC.imgs[p.id]; return `<button class="sc-pq-vig" onclick="${clic}" title="${escapeAttr(titre)}">${im ? `<img src="${im.url}" alt="" loading="lazy">` : `<span class="sc-pq-manque">photo à remettre</span>`}<i>${n}</i></button>`; };
  const sans = O.map((p, i) => ({ p, i })).filter(x => !x.p.eleve && !x.p.blanche), blanches = O.filter(p => p.blanche).length;
  let h = '<div class="sc-pq">';
  if (sans.length) h += `<section class="sc-pq-el sc-pq-sans"><div class="sc-pq-nom"><b>⚠ ${sans.length} page${sans.length > 1 ? "s" : ""} sans élève</b><span class="sc-m">donne chacune à son élève</span><button class="sc-btn" onclick="SC.attrib=true;SC.ia=${sans[0].i};scRendre()" title="Revoir, page par page, l'élève de chaque page (ses initiales), en commençant par la première page sans élève.">🔤 Les initiales</button></div><div class="sc-pq-vigs">${sans.map(x => vig(x.p, "Page " + (x.i + 1) + " du paquet, sans élève : clic pour lui donner son élève (ses initiales).", "SC.attrib=true;SC.ia=" + x.i + ";scRendre()", "page " + (x.i + 1))).join("")}</div></section>`;
  SC.copies.forEach(k => { const P = scPagesDe(k), nom = nomEleveDe(k) || k, abs = typeof avAbsent === "function" && avAbsent(k);
    h += `<section class="sc-pq-el${abs ? " abs" : ""}${k === scK() ? " cour" : ""}" data-k="${escapeAttr(k)}"><div class="sc-pq-nom"><b>${escapeHtml(nom)}</b>${abs ? '<b class="av-abs" title="Marqué absent : pas de fichier École Directe, il ne compte pas dans le Bilan.">ABS</b>' : ""}${typeof avCarteFlux === "function" ? avCarteFlux(k) : ""}</div>`
      + `<div class="sc-pq-vigs">${P.map((p, j) => vig(p, "Ouvrir la recopie de " + nom + " à sa page " + (j + 1) + (P.length > 1 ? " sur " + P.length : "") + ".", "scPqOuvrir('" + escapeAttr(k) + "','" + p.id + "')", "page " + (j + 1))).join("")}</div></section>`; });
  if (blanches) h += `<p class="sc-m">${blanches} page${blanches > 1 ? "s" : ""} blanche${blanches > 1 ? "s" : ""} dans le paquet : sans élève, elle${blanches > 1 ? "s" : ""} ne compte${blanches > 1 ? "nt" : ""} pas.</p>`;
  h += "</div>"; if (Z.dataset.pq === h) return;   // rien de neuf : rien ne se redessine
  /* un redessin ne touche jamais au focus : la vignette qui l'avait le garde */
  const a = document.activeElement, el = a && Z.contains(a) ? a.closest(".sc-pq-el") : null, ou = el ? { k: el.dataset.k || "", i: Array.from(el.querySelectorAll(".sc-pq-vig, button")).indexOf(a) } : null;
  Z.innerHTML = h; Z.dataset.pq = h;
  if (ou) { const e2 = Array.from(Z.querySelectorAll(".sc-pq-el")).find(x => (x.dataset.k || "") === ou.k), b = e2 && e2.querySelectorAll(".sc-pq-vig, button")[ou.i]; if (b) b.focus({ preventScroll: true }); }
}
function scPqOuvrir(k, pid) {
  const i = SC.copies.indexOf(k); if (i < 0) return; SC.ic = i; state.scanRecopie = { ouverte: false, copie: k, page: pid, ligne: null }; state.scanCurseur = Object.assign({}, state.scanCurseur || {}, { copie: k });   // là où tu travailles : l'écran des scans y revient
  rcOuvrir(); if (!RC.ouvert) return; if (RC.page !== pid) rcActiverPage(pid);
  const b = rcBloc(pid); if (b) b.scrollIntoView({ block: "start" });
}

