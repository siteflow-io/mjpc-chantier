// [C14 1.4.32] (Paul 03/11 09:58, au collège : « j'ai chargé les copies. […] 2 pages n'ont pas été reconnues en Franklin […] leur deuxième page apparaissait en blanc ».
// Mesuré au site : deux feuilles chargées le 30/10, avant que l'app retienne l'origine de chaque photo ; relues sur l'ordinateur du collège, leur image ressort à 9 et
// 15 points (la règle était 8) : deux pages nouvelles, données aux deux élèves, et leur vraie page 2, avec la recopie et les marques, « photo à remettre ».)
// Joué à la fin : une copie où tu as recopié et posé des marques ; sa feuille comme avant la 1.4.13 (sans origine), sa photo absente de ce navigateur (comme au collège).
// 1. La même photo, un peu autre (12 points environ), rechargée par « 📄 Charger des copies » : elle retrouve sa feuille, aucune page nouvelle.
// 2. Ce qui est arrivé au collège, tel que la 1.4.31 l'a écrit (une page nouvelle avec la photo, donnée à l'élève) : à l'ouverture des scans, la feuille reprend sa photo,
//    la page en double disparaît ; la recopie, les marques, la carte et le fichier de l'élève n'ont pas bougé.
export async function eprouverRetrouver({ pg, verif, cap, att, DIR }) {
  const fs = await import("node:fs"), path = await import("node:path");
  await pg.bringToFront();
  const modale = async () => { if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { const f = pg.locator("#scModale button", { hasText: /Fermer|Annuler|Non/ }).first(); if (await f.count()) await f.click().catch(() => {}); else await pg.keyboard.press("Escape"); await att(250); } };
  const fermerTout = async () => { await modale();
    if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } await pg.click("#rcFermer"); await att(300); }
    if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); } };
  const scans = async () => { await modale(); if (!(await pg.evaluate(() => typeof SC !== "undefined" && SC.ouvert))) { await pg.click('#ruOnglets [data-o="pilotage"]').catch(() => {}); await att(300); await pg.click('#ruSous [data-s="correction"]').catch(() => {}); await att(500); await pg.click("#btnScan"); await att(2500); } };
  await fermerTout(); await scans();
  // une copie où tu as travaillé : une page avec ta recopie et au moins une marque
  const C = await pg.evaluate(() => { for (const k of SC.copies) { const s = scCopie(k), rp = (s.recopie || {}).pages || {};
      const p = scPagesDe(k).find(p => SC.imgs[p.id] && rp[p.id] && Object.values(rp[p.id].lignes || {}).some(l => (l.texte || "").trim()) && Object.values(s.marques || {}).some(m => m.page === p.id));
      if (p) return { k, pid: p.id, n: scPagesDe(k).length, lignes: Object.values(rp[p.id].lignes).filter(l => (l.texte || "").trim()).length, marques: Object.values(s.marques).filter(m => m.page === p.id).length, pct: (scAvancement(k) || {}).pct }; } return null; });
  if (!C) { verif("1.4.32 : une copie avec une page recopiée et marquée", false); return; }
  /* la photo de cette feuille, un peu autre : un voile très léger, de plus en plus fort, jusqu'à ce que son empreinte s'écarte de 10 à 15 points de celle de la feuille */
  const F = await pg.evaluate(async pid => { const g = SC.origs[pid] || SC.imgs[pid], bm = await createImageBitmap(g.blob), hex0 = pid.slice(5, 69);
    for (let s = 0; s <= 60; s += 1) { const c = document.createElement("canvas"); c.width = bm.width; c.height = bm.height; const x = c.getContext("2d"); x.drawImage(bm, 0, 0);
      const gr = x.createLinearGradient(0, 0, c.width, c.height); gr.addColorStop(0, "rgba(255,255,255," + (s / 200) + ")"); gr.addColorStop(1, "rgba(0,0,0," + (s / 400) + ")"); x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height);
      const b = await new Promise(r => c.toBlob(r, "image/jpeg", 0.9)), cv = await scLireImage(new File([b], "x.jpg", { type: "image/jpeg" })), d = scDistHex(scEmpreinteImage(cv), hex0);
      if (d >= 10 && d <= 15) { const u8 = new Uint8Array(await b.arrayBuffer()); let bin = ""; for (let i = 0; i < u8.length; i += 8192) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return { d, s, b64: btoa(bin) }; } }
    return null; }, C.pid);
  if (!F) { verif("1.4.32 : une photo de la même feuille à 10-15 points", false); return; }
  const fichier = path.join(DIR || "/tmp", "C14-1432-meme-feuille.jpg"); fs.writeFileSync(fichier, Buffer.from(F.b64, "base64"));
  /* la feuille comme avant la 1.4.13 (sans origine), sa photo absente de ce navigateur, comme sur l'ordinateur du collège */
  const avant = async () => pg.evaluate(async pid => { const p = SC.pages[pid]; delete p.source; ruEcrire(scChemin(["pages", pid]), p, "banc : la feuille sans origine");
    const im = SC.imgs[pid]; delete SC.imgs[pid]; delete SC.origs[pid]; if (SC.encres) delete SC.encres[pid]; await scDbOter(pid); scRendre(); return !!im; }, C.pid);
  const etat = () => pg.evaluate(c => { const s = scCopie(c.k), rp = ((s.recopie || {}).pages || {})[c.pid];
    return { pages: scPagesDe(c.k).length, total: Object.keys(SC.pages).length, photo: !!SC.imgs[c.pid], source: !!(SC.pages[c.pid] && SC.pages[c.pid].source), lignes: rp ? Object.values(rp.lignes || {}).filter(l => (l.texte || "").trim()).length : 0, marques: Object.values(s.marques || {}).filter(m => m.page === c.pid).length, pct: (scAvancement(c.k) || {}).pct,
      manque: (document.getElementById("scManque") || {}).textContent || "", vides: scPagesDe(c.k).filter(p => !SC.imgs[p.id]).length }; }, C);
  // 1. la règle : rechargée, la même photo retrouve sa feuille
  await avant(); const e0 = await etat();
  await pg.setInputFiles('#scanEcran input[type=file]', fichier); await att(3500); await modale();
  const e1 = await etat();
  verif("1.4.32 : une feuille chargée avant la 1.4.13, sa photo absente de ce navigateur (« " + e0.manque.slice(0, 60) + " ») ; la même photo relue autrement (à " + F.d + " points, la règle d’avant s’arrêtait à 8), rechargée par « 📄 Charger des copies » : elle retrouve sa feuille (photo " + e1.photo + ", origine " + e1.source + ") ; aucune page nouvelle (" + e0.total + " → " + e1.total + " pages, " + e1.pages + " pour l’élève) ; sa recopie (" + e1.lignes + " lignes) et ses marques (" + e1.marques + ") ; carte à " + e1.pct + " %",
    !e0.photo && /pas dans ce navigateur/.test(e0.manque) && !/ne est/.test(e0.manque) && e1.photo && e1.source && e1.total === e0.total && e1.pages === C.n && e1.lignes === C.lignes && e1.marques === C.marques && e1.pct === C.pct && !e1.manque);
  // 2. ce qui est arrivé au collège : la page nouvelle, telle que la 1.4.31 l'a écrite (la photo à elle, donnée à l'élève) ; la feuille sans photo ici
  await avant();
  const nv = await pg.evaluate(async ({ c, b64 }) => { const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); const f = new File([u8], "C14-1432-meme-feuille.jpg", { type: "image/jpeg" });
    const cv = await scLireImage(f), hex = scEmpreinteImage(cv), id = "page_" + hex + "_" + cv.width.toString(36) + cv.height.toString(36), o = await scPage(cv, null, false);
    const ordre = scPagesOrdre().reduce((m, p) => Math.max(m, p.ordre || 0), 0) + 1, meta = { id, eleve: c.k, ordre, blanche: false, lignes: o.lignes, rot: o.rot, w: o.w, h: o.h, creeLe: new Date().toISOString(), source: { f: "c14banc1432", p: 1 } };
    SC.pages[id] = meta; ruEcrire(scChemin(["pages", id]), meta, "banc : la page nouvelle de la 1.4.31"); SC.imgs[id] = scImg(o.blob, o.w, o.h); SC.origs[id] = { blob: o.orig, w: o.ow, h: o.oh };
    await scDbMettre({ id, red: RU.id, classe: RU.classe, blob: o.blob, w: o.w, h: o.h, orig: o.orig, ow: o.ow, oh: o.oh, le: new Date().toISOString() }); scCopiesOrdre(); scRendre(); return { id, d: scDistHex(hex, c.pid.slice(5, 69)) }; }, { c: C, b64: F.b64 });
  const e2 = await etat(); await cap("C14-1432-avant-reparation");
  // l'ouverture des scans, comme au collège après le rechargement
  await fermerTout(); await scans(); await att(2500);
  const e3 = await etat(), parti = await pg.evaluate(id => !SC.pages[id], nv.id), auSite = await pg.evaluate(id => ruLire(scChemin(["pages", id])), nv.id), toast = await pg.evaluate(() => (document.getElementById("toast") || {}).textContent || "");
  await cap("C14-1432-apres-reparation");
  verif("1.4.32 : ce qui est arrivé au collège : une page nouvelle avec la photo (à " + nv.d + " points), donnée à l’élève (" + e2.pages + " pages, dont " + e2.vides + " « photo à remettre ») ; à l’ouverture des scans : « " + toast.slice(0, 110) + " » ; la feuille a sa photo (" + e3.photo + "), la page en double est partie, ici (" + parti + ") et au site (" + (auSite === null) + ") ; " + e3.pages + " pages ; sa recopie (" + e3.lignes + " lignes), ses marques (" + e3.marques + "), sa carte (" + e3.pct + " %) n’ont pas bougé ; plus aucune page à remettre (« " + e3.manque.slice(0, 40) + " »)",
    e2.pages === C.n + 1 && e2.vides === 1 && e3.photo && parti && auSite === null && e3.pages === C.n && e3.vides === 0 && e3.lignes === C.lignes && e3.marques === C.marques && e3.pct === C.pct && !e3.manque && /retrouvée/.test(toast));
  // 3. le fichier de l'élève : sa feuille, avec sa photo et ses marques
  const D = await pg.evaluate(k => scEleveFichier(k, true).then(f => ({ pages: f.D.pages.length, fautes: f.D.fautes.length, photos: (f.html.match(/data:image\/jpeg;base64,/g) || []).length })), C.k);
  verif("1.4.32 : son fichier : " + D.pages + " page(s), " + D.photos + " photo(s), " + D.fautes + " faute(s) marquées", D.pages === C.n && D.photos >= C.n);
  await modale();
}
