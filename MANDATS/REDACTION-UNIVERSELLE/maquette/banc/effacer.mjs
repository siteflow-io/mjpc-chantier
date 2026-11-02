// [C14 669] (Paul 02/11 12:46 : « Je préfère en réalité effacer l'ensemble des corrigés IA actuellement en ligne, afin de repartir sur du propre complet ») :
// « 🗑 Tout effacer : corrigés de l'IA et bande » efface aussi ce qui est venu depuis la 1.4.9 (les stickers de l'IA, tes décisions sur eux, ses remarques, les copies refusées) ;
// ta recopie, la marge de l'élève recopiée, la phrase qui t'a marqué et le contexte donné à l'IA restent. En dernier : il vide la classe de ses corrigés.
export async function eprouverEffacer({ pg, verif, cap, att }) {
  await pg.bringToFront();
  if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { await pg.keyboard.press("Escape"); await att(200); }
  if (!(await pg.evaluate(() => typeof SC !== "undefined" && SC.ouvert))) { await pg.click('#ruOnglets [data-o="pilotage"]'); await att(300); await pg.click('#ruSous [data-s="correction"]'); await att(500); await pg.click("#btnScan"); await att(1500); }
  if (!(await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(800); }
  if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); }
  const photo = () => pg.evaluate(() => { const C = SC.copies.filter(k => rcLignesEcrites(k).length); return { n: C.length,
    textes: JSON.stringify(C.map(k => rcLignesEcrites(k).map(x => [x.id, x.l.texte, x.l.x0, x.l.y0, x.l.marge || "", x.l.par === undefined ? "" : x.l.par]))),
    phrases: C.filter(k => ((scCopie(k).recopie || {}).phrase)).length,
    ia: C.filter(k => { const s = scCopie(k), r = s.recopie || {}; return r.stickersIA || r.remarquesIA || r.charge || r.envoi || r.refusIA || (s.stickers && Object.keys(s.stickers).length) || s.commentaire || r.commentaireIA || rcLignesEcrites(k).some(x => x.l.corrige !== undefined || x.l.decisions); }).length,
    marques: C.reduce((n, k) => n + Object.values(scCopie(k).marques || {}).filter(m => m && m.bande).length, 0), contexte: !!(SUJET.contexteIA && SUJET.contexteIA.texte) }; });
  const avant = await photo();
  await pg.click("#rcImportIA"); await att(300); await pg.click("#rcIAEffacer"); await att(300);
  const q = await pg.evaluate(() => document.getElementById("rcIAEffacerQ").innerText.replace(/\s+/g, " ")); await cap("C14-669-tout-effacer");
  await pg.evaluate(() => { window.__journalEcho = []; const t0 = Date.now(), ia = () => SC.copies.filter(k => { const r = scCopie(k).recopie || {}; return !!(r.charge || r.stickersIA || rcLignesEcrites(k).some(x => x.l.corrige !== undefined)); }).length;
    ["ruEstMien", "ruGarderLocal", "synchroniser"].forEach(f => { if (typeof window[f] !== "function") return; const g = window[f]; window[f] = function () { const r = g.apply(this, arguments); window.__journalEcho.push([Date.now() - t0, f, arguments[0] ? String(arguments[0]).slice(0, 12) : "", r === undefined ? "" : String(r).slice(0, 5), ia()]); return r; }; });
    if (window.EventSource && window.EventSource.prototype && window.EventSource.prototype.emettre) { const e0 = window.EventSource.prototype.emettre; window.EventSource.prototype.emettre = function (ty, d) { const D = d && d.data, ia = v => !!(v && v.scan && v.scan.recopie && (v.scan.recopie.charge || v.scan.recopie.stickersIA)); window.__journalEcho.push([Date.now() - t0, "écho", (d && d.path || "").slice(0, 40), d && d.path === "/" ? Object.keys(D || {}).filter(k => ia(D[k])).length + " copies ia" : (ia(D) ? "ia" : "-"), ia()]); return e0.apply(this, arguments); }; }
    const iv = setInterval(() => { window.__journalEcho.push([Date.now() - t0, "ia", "", "", ia()]); if (Date.now() - t0 > 4000) clearInterval(iv); }, 150); });
  const dl = pg.waitForEvent("download", { timeout: 15000 }).catch(() => null); await pg.click("#rcIAEffacerOui"); const d = await dl; await att(1500);
  console.log("JOURNAL ÉCHO " + JSON.stringify(await pg.evaluate(() => window.__journalEcho.filter((x, i, A) => x[1] !== "ia" || !A[i - 1] || A[i - 1][4] !== x[4]))));
  const msg = await pg.evaluate(() => document.getElementById("rcIAMessage").textContent); await pg.keyboard.press("Escape"); await att(300);
  const apres = await photo();
  verif("669 : « 🗑 Tout effacer » sur la classe : la question dit tout ce qui part (« " + q.slice(0, 230) + "… ») ; un export d’abord (" + !!d + ") ; " + avant.ia + " copies avec un corrigé de l’IA → " + apres.ia + ", " + avant.marques + " cadres de la bande → " + apres.marques + " ; restent, intacts : la recopie des " + apres.n + " copies, ses places et les ¶ (" + (apres.textes === avant.textes) + "), " + apres.phrases + " phrases qui t’ont marqué, le contexte de l’IA (" + apres.contexte + ") ; « " + msg.slice(0, 120) + " »",
    avant.ia >= 2 && /les stickers rendus par l’IA sur \d+ copies? et tes \d+ décisions? sur eux/.test(q) && /remarques? de l’IA/.test(q) && /ni la phrase qui t’a marqué/.test(q) && !!d && apres.ia === 0 && apres.marques === 0 && apres.n === avant.n && apres.textes === avant.textes && apres.phrases === avant.phrases && apres.contexte === avant.contexte && avant.contexte && /ses stickers et ses remarques/.test(msg));
}
