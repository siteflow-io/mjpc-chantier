// [C14 710] (Paul 02/11 14:09 : « Tu l'enlèves de la grille, c'est tout ») : un sticker enlevé de la grille par le geste (Réglages → sa carte → « 🗑 », puis confirmer)
// ne part plus à l'IA, ne s'arrête plus dans la bande, et l'élève ne le lit plus nulle part : ni réussi, ni en remarque. Rien n'est effacé.
// Seulement des gestes ; les évaluations lisent l'état et le fichier de l'élève.
export async function eprouverEnlever({ pg, verif, cap, att }) {
  await pg.bringToFront();
  if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { await pg.keyboard.press("Escape"); await att(200); }
  /* le sticker : une remarque gardée sur une copie, et, si possible, un arrêt dans la bande d'une copie */
  const c = await pg.evaluate(() => { const E = []; SC.copies.forEach(k => stRqVisibles(k).forEach(e => E.push({ k, e }))); if (!E.length) return null;
    const nA = id => SC.copies.reduce((n, k) => n + stArrets(k).filter(a => a.stId === id).length, 0), x = E.find(x => nA(x.e.st) > 0) || E[0], st = stTous().find(s => s.id === x.e.st);
    return { k: x.k, id: st.id, num: st.num, ligne: st.ligne, r: x.e.r, texte: st.texteEleve, arrets: nA(st.id), grille: (stEnvoiGrille() || []).filter(g => g.s === st.num).length }; });
  if (!c) { verif("710 : une copie avec une remarque gardée, pour enlever son sticker", false); return; }
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } await pg.click("#rcFermer"); await att(300); }
  if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); }
  await pg.click('#ruOnglets [data-o="reglages"]'); await att(900);
  await pg.locator('button.st-ligne[onclick*="\'' + c.ligne + '\'"]').click(); await att(400);
  const carte = pg.locator(".st-carte").filter({ has: pg.locator(".st-carte-haut b", { hasText: new RegExp("^" + c.num + "$") }) });
  await carte.click(); await att(300); await carte.locator("button", { hasText: "🗑" }).click(); await att(300);
  const conf = await pg.evaluate(() => document.querySelector("#scModale").innerText.replace(/\s+/g, " "));
  await pg.locator("#scModale button", { hasText: "🗑" }).click(); await att(500);
  let notes = "";
  if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { notes = await pg.evaluate(() => document.querySelector("#scModale h3").innerText); await pg.locator("#scModale button", { hasText: "Appliquer" }).click(); await att(500); }
  await cap("C14-710-enleve");
  const apres = await pg.evaluate(c => scEleveFichier(c.k).then(f => ({ actif: stActifs().some(s => s.id === c.id), garde: !!(SUJET.stickers[c.id] && SUJET.stickers[c.id].etat === "range"),
    rq: stRqVisibles(c.k).some(e => e.st === c.id), arrets: SC.copies.reduce((n, k) => n + stArrets(k).filter(a => a.stId === c.id).length, 0), grille: (stEnvoiGrille() || []).filter(g => g.s === c.num).length,
    fichier: f.html.includes(c.r) || f.html.includes(c.texte), liste: (stRqRelecture(c.k).match(/son sticker est enlevé de la grille : elle ne part pas/g) || []).length })), c);
  const site = await pg.evaluate(c => ruLire(["redactions", RU.id, "config", "stickers", c.id]).then(s => (s && s.etat) || ""), c);
  verif("710 : « 🗑 » sur la carte de " + c.num + " (« " + conf.slice(0, 160) + " »)" + (notes ? ", puis « " + notes + " » → Appliquer" : "") + " : il ne part plus à l’IA (" + c.grille + " → " + apres.grille + "), ne s’arrête plus dans la bande (" + c.arrets + " → " + apres.arrets + "), sa remarque ne part plus (" + !apres.rq + "), le fichier de l’élève ne le dit plus (" + !apres.fichier + ") ; ta liste la montre grisée (" + apres.liste + ") ; rien d’effacé (au site : " + site + ")",
    /l’élève ne le lit plus nulle part/.test(conf) && c.grille === 1 && apres.grille === 0 && c.arrets >= 1 && apres.arrets === 0 && !apres.rq && !apres.fichier && apres.liste === 1 && !apres.actif && apres.garde && site === "range");
}
