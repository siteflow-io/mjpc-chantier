// [C14 406] le Bilan avec les stickers : les lignes recopiées et ton temps ; « ▸ sa grille » : chaque ligne de la grille d'une copie corrigée avec les stickers.
// Seulement des gestes ; les évaluations lisent l'état et le DOM.
export async function eprouverBilan({ pg, verif, cap, att }) {
  await pg.bringToFront();
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
  if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); }
  await pg.click('#ruOnglets [data-o="donnees"]'); await att(400); await pg.click('#ruSous [data-s="bilan"]'); await att(1200);
  const b0 = await pg.evaluate(() => { const v = document.getElementById("ruVue_bilan"), th = Array.from(v.querySelectorAll("thead th")).map(x => x.textContent), iL = th.indexOf("Lignes"), iT = th.indexOf("Ton temps");
    const rows = Array.from(v.querySelectorAll("tbody tr:not(.av-ligne-abs):not(.av-classe):not(.av-det)")), dur = ms => { const s = Math.round((ms || 0) / 1000); return s < 60 ? s + " s" : s < 3600 ? Math.floor(s / 60) + " min" : Math.floor(s / 3600) + " h " + String(Math.floor(s / 60) % 60).padStart(2, "0"); };
    let justes = 0, avec = 0; rows.forEach(r => { const nom = r.firstElementChild.firstChild.textContent.trim(), k = eleveId(nom), f = avFlux(k) || {}, T = f.temps || {}, t = (T.recopie || 0) + (T.bande || 0), c = r.children;
      const okL = c[iL].textContent === String(f.lignes || ""), okT = c[iT].textContent === (t ? dur(t) : ""); if (okL && okT) justes++; if (f.lignes) avec++; });
    const cl = v.querySelector("tr.av-classe"), k = state.classe.map(eleveId).find(k => stCorrigeeAvec(k) && !avAbsent(k));
    return { th: th.length, iL, iT, n: rows.length, justes, avec, classe: cl ? cl.children[iL].textContent + " · " + cl.children[iT].textContent : "", k, nom: k ? nomEleveDe(k) : "", boutons: v.querySelectorAll(".av-grille-b").length }; });
  let g = { n: 0, att: -1, somme: -1, note: -1, total: "" }, ferme = false;
  if (b0.k) { await pg.click('#ruVue_bilan .av-grille-b[data-k="' + b0.k + '"]'); await att(400);
    g = await pg.evaluate(k => { const d = document.querySelector("#ruVue_bilan tr.av-det"), L = d ? Array.from(d.querySelectorAll(".av-grille li")) : [], nt = stNoteCopie(k);
      return { n: L.length, att: stSujetLignes().length, somme: Math.round(100 * L.reduce((a, li) => a + parseFloat(li.querySelector(".av-g-pts").textContent.split("/")[0].replace(",", ".")), 0)) / 100, note: Math.round(100 * nt.n) / 100, total: d ? d.querySelector("td > .av-m").textContent : "", premier: L[0] ? L[0].innerText.replace(/\s+/g, " ") : "", finie: stFinie(k) }; }, b0.k);
    await cap("C14-406-bilan-sa-grille");
    await pg.click('#ruVue_bilan .av-grille-b[data-k="' + b0.k + '"]'); await att(300); ferme = await pg.evaluate(() => !document.querySelector("#ruVue_bilan tr.av-det")); }
  else await cap("C14-406-bilan");
  await pg.click('#ruOnglets [data-o="pilotage"]'); await att(300); await pg.click('#ruSous [data-s="correction"]'); await att(800);
  verif("bilan (C14 406) : deux colonnes de plus, « Lignes » et « Ton temps », justes pour les " + b0.justes + " élèves sur " + b0.n + " (" + b0.avec + " avec des lignes ; la classe : « " + b0.classe + " ») ; « ▸ sa grille » de " + b0.nom + " : " + g.n + " lignes de la grille sur " + g.att + " (« " + (g.premier || "").slice(0, 90) + " »), leurs points font " + g.somme + " = la note " + g.note + " (« " + g.total + " ») ; un autre clic la replie (" + ferme + ")",
    b0.iL > 0 && b0.iT === b0.iL + 1 && b0.n >= 2 && b0.justes === b0.n && b0.avec >= 1 && !!b0.k && b0.boutons >= 1 && g.n === g.att && g.n >= 1 && Math.abs(g.somme - g.note) < 0.011 && (g.finie ? /^Total : /.test(g.total) : /^Pas finie/.test(g.total)) && ferme);
}
