// [C14 1.4.31] (Paul 03/11 07:57 : « il me faut une case dans mon pilotage qui permet d'afficher dans le html une fiche de correction élève avec l'ensemble du corrigé. Donc le html
// partirait avec trois réglages optionnels: la note, ouvrir la correction à l'élève, et la correction détaillée »). Joué après les types : la copie de la lettre aux quatre lignes
// (toutes ses fautes gardées) et une copie où une faute a été refusée (N). Tout par le geste : la case, « 🧪 Tester comme l'élève », « 📝 Ma copie corrigée » ;
// les évaluations lisent la fenêtre de l'élève, ses données et le faux site.
export async function eprouverDetail({ pg, verif, cap, att }) {
  await pg.bringToFront();
  const modale = async () => { if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { const f = pg.locator("#scModale button", { hasText: /Fermer|Annuler/ }).first(); if (await f.count()) await f.click().catch(() => {}); else await pg.keyboard.press("Escape"); await att(250); } };
  const fermerTout = async () => { await modale();
    if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } await pg.click("#rcFermer"); await att(300); } };
  const scans = async () => { await modale(); if (!(await pg.evaluate(() => typeof SC !== "undefined" && SC.ouvert))) { await pg.click('#ruOnglets [data-o="pilotage"]').catch(() => {}); await att(300); await pg.click('#ruSous [data-s="correction"]').catch(() => {}); await att(500); await pg.click("#btnScan"); await att(1500); } };
  const ed = async () => { if (!(await pg.evaluate(() => !!document.getElementById("scDetail") && document.getElementById("scModale").classList.contains("show")))) { await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(900); } };
  /* le fichier de l'élève : son bouton, puis sa fenêtre « Ma copie corrigée » */
  const fichier = async (k, nom) => { await ed(); const i0 = await pg.evaluate(k => scCopiesED().indexOf(k), k);
    const pop = pg.waitForEvent("popup"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Tester comme l'élève").click(); const w = await pop; await w.waitForLoadState(); await w.waitForTimeout(1200); await w.click(".passer").catch(() => {}); await w.waitForTimeout(600);
    const bouton = await w.evaluate(() => !!document.getElementById("cd")); let r = { bouton, lignes: [], barres: [], bonnes: [], soulignes: [], net: [], pieces: 0, fautes: 0 };
    if (bouton) { await w.click("#cd"); await w.waitForTimeout(400); if (nom) await cap(nom, w);
      Object.assign(r, await w.evaluate(() => { const P = Array.from(document.querySelectorAll(".cdv p"));
        const net = P.map(p => { const c = p.cloneNode(true); c.querySelectorAll("s, u").forEach(x => x.remove()); return c.textContent.replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim(); });
        return { lignes: P.map(p => p.textContent.replace(/\s+/g, " ").trim()), barres: Array.from(document.querySelectorAll(".cdv s")).map(e => e.textContent), bonnes: Array.from(document.querySelectorAll(".cdv b")).map(e => e.textContent), soulignes: Array.from(document.querySelectorAll(".cdv u")).map(e => e.textContent), net,
          pieces: D.detail.flat().filter(p => p.x == null).length, fautes: D.fautes.length }; })); }
    r.sansDonnees = await w.evaluate(() => D.detail == null && !document.documentElement.outerHTML.includes('"detail":[')); await w.close(); return r; };
  await fermerTout(); await scans();
  const kT = await pg.evaluate(() => SC.copies.find(k => rcLignesEcrites(k).some(x => /^Les prix augmentes/.test(x.l.texte || ""))) || null);
  const kN = await pg.evaluate(kT => SC.copies.find(k => k !== kT && svCopieCorrigee(k) && rcArrets(k).some(a => (a.l.decisions || {})[a.cle] === "n")) || null, kT);
  if (!kT || !kN) { verif("1.4.31 : la lettre aux quatre lignes (" + !!kT + ") et une copie avec une faute refusée (" + !!kN + ")", false); return; }
  // 1. la case : décochée au départ ; le fichier n'a pas le bouton
  await ed(); const c0 = await pg.evaluate(() => { const c = document.getElementById("scDetail"); return c ? { coche: c.checked, dit: c.closest("label").innerText.replace(/\s+/g, " "), cases: document.querySelectorAll("#scModale .sc-coche").length } : null; });
  const sans = await fichier(kT);
  // 2. cochée : la classe la garde au site ; le fichier a « 📝 Ma copie corrigée »
  await ed(); await pg.locator("#scDetail").click(); await att(900); await cap("C14-1431-trois-cases");
  const site = await pg.evaluate(() => ruLire(["redactions", RU.id, "config", "correctionDetaillee"]));
  const attendu = await pg.evaluate(k => rcLignesEcrites(k).map(x => String(x.l.corrige || "").replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim()), kT);
  const avec = await fichier(kT, "C14-1431-copie-corrigee");
  verif("1.4.31 : « 📨 Fichiers École Directe » : trois cases (" + (c0 && c0.cases) + ") ; « Afficher la correction détaillée… », décochée au départ (" + (c0 && !c0.coche) + ") : le fichier n’a pas « 📝 Ma copie corrigée » (" + !sans.bouton + ") ; cochée (au site : " + site + ") : il l’a (" + avec.bouton + ")",
    !!c0 && c0.cases === 3 && !c0.coche && !sans.bouton && site === true && avec.bouton);
  verif("1.4.31 : « 📝 Ma copie corrigée » de la lettre : " + avec.lignes.length + " lignes ; barrés : « " + avec.barres.join(" · ") + " » ; bonnes formes : « " + avec.bonnes.join(" · ") + " » ; sans les mots barrés, chaque ligne est son corrigé (" + avec.net.filter((t, i) => t === attendu[i]).length + " sur " + attendu.length + ") ; une pièce par faute du fichier (" + avec.pieces + " pour " + avec.fautes + ")",
    avec.lignes.length === 4 && ["augmentes", "soigné", "arrive", "auquel", ","].every(m => avec.barres.includes(m)) && ["augmentent", "soigner", "arrivent", "par"].every(m => avec.bonnes.includes(m)) && avec.net.every((t, i) => t === attendu[i]) && avec.pieces === avec.fautes);
  // 2 bis. (Paul 07:53, 08:11 : « il ne devait pas y avoir d'empilement. Sinon c'est incliquable pour l'élève ») trois stickers sur les mêmes mots : un seul cadre, trois étoiles, chacune ouvre le sien
  { await ed(); const i0 = await pg.evaluate(k => scCopiesED().indexOf(k), kT); const pop = pg.waitForEvent("popup"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Tester comme l'élève").click(); const w = await pop; await w.waitForLoadState(); await w.waitForTimeout(1200); await w.click(".passer").catch(() => {}); await w.waitForTimeout(700);
    const g = await w.evaluate(() => { const S = (D.stickers || []).filter(t => /le pain manque/.test(t.cite || t.mots || "") || true), sig = t => JSON.stringify((t.segs || []).map(s => s.map(v => Math.round(v * 250)))), c = {}; S.forEach((t, i) => { if (t.page >= 0) (c[t.page + sig(t)] = c[t.page + sig(t)] || []).push(i); });
      const memes = Object.values(c).filter(v => v.length >= 3)[0] || []; const cadre = Array.from(document.querySelectorAll("#col .mk.st")).find(e => e.querySelectorAll(".stx").length >= 3);
      return { memes: memes.length, textes: memes.map(i => D.stickers[i].texte), cadres: Array.from(document.querySelectorAll("#col .mk.st, #col .mk.stp")).length, stickers: (D.stickers || []).filter(t => t.page >= 0).length, etoiles: document.querySelectorAll("#col .stx").length, dansLeCadre: cadre ? Array.from(cadre.querySelectorAll(".stx")).map(e => e.dataset.s) : [],
        poses: (() => { const r = Array.from(document.querySelectorAll("#col .stx")).map(e => e.getBoundingClientRect()); let n = 0; r.forEach((a, i) => r.forEach((b, j) => { if (i < j && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) n++; })); return n; })() }; });
    const ouverts = []; for (const j of g.dansLeCadre) { await w.click('#col .stx[data-s="' + j + '"]'); await w.waitForTimeout(300); ouverts.push(await w.evaluate(j => { const p = document.getElementById("pan").innerText.replace(/\s+/g, " "); return p.includes(D.stickers[+j].texte); }, j)); if (!ouverts.length || ouverts.length === 1) await cap("C14-1431-trois-etoiles", w); }
    await w.close();
    verif("1.4.31 (C14 110) : trois stickers sur les mêmes mots (« le pain manque ») : un seul cadre pour eux (" + g.dansLeCadre.length + " étoiles dans le même cadre) ; " + g.cadres + " cadres pour " + g.stickers + " stickers, " + g.etoiles + " étoiles ; aucune étoile n’en touche une autre (" + g.poses + ") ; chaque étoile se clique et ouvre son sticker (" + ouverts.filter(Boolean).length + " sur " + ouverts.length + ")",
      g.memes >= 3 && g.dansLeCadre.length >= 3 && g.etoiles === g.stickers && g.cadres < g.stickers && g.poses === 0 && ouverts.length >= 3 && ouverts.every(Boolean)); }
  // 3. une copie où tu as refusé une faute (N) : ses mots ne sont pas barrés ; chaque faute gardée l'est
  const ref = await pg.evaluate(k => rcArrets(k).filter(a => (a.l.decisions || {})[a.cle] === "n").map(a => a.g.eleve + " → " + a.g.corrige), kN);
  const avN = await fichier(kN);
  verif("1.4.31 : une copie dont tu as refusé " + ref.length + " faute(s) (« " + ref.join(" · ") + " ») : sa copie corrigée n’en montre aucune (" + avN.pieces + " pièces pour " + avN.fautes + " fautes gardées) ; barrés : « " + avN.barres.join(" · ") + " »",
    avN.bouton && avN.pieces === avN.fautes && ref.length >= 1);
  // 4. décochée : le fichier repart sans les bonnes formes
  await ed(); await pg.locator("#scDetail").click(); await att(900); const site2 = await pg.evaluate(() => ruLire(["redactions", RU.id, "config", "correctionDetaillee"])); const sans2 = await fichier(kT);
  verif("1.4.31 : décochée de nouveau (au site : " + site2 + ") : le fichier n’a plus le bouton (" + !sans2.bouton + "), ses données n’ont plus les bonnes formes (" + sans2.sansDonnees + ")", site2 === false && !sans2.bouton && sans2.sansDonnees && sans.sansDonnees);
  await modale();
}
