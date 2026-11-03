// [C14 1.4.33] (Paul 03/11 19:45 : « l'IA a relevé plusieurs fois oeil mal écrit parce que je l'ai tapé sans le e dans l'o et quand j'ai relu la bande je suis allé un peu vite » ;
// « Ok pour tout », 19:52 ; C14 127). Ta recopie ne tape ni « œ » ni « æ » : « oe » pour « œ » n'est jamais une faute. Joué après la correction détaillée, sur la lettre aux quatre lignes :
// 1. une cinquième ligne, tapée comme tu tapes (« Mon coeur se serre quand je pense a vous, ») ; l'IA rend « Mon cœur … à{G} vous, » : la bande ne s'arrête que sur « a → à » ;
// 2. la même faute « coeur → cœur », gardée comme la 1.4.32 l'a écrite dans la copie (au site : 9) : elle n'est plus nulle part (fichier de l'élève, bilan, numéros), la copie reste
//    corrigée, rien à revoir dans la bande, la note ne bouge pas. Tout par le geste ; la faute gardée d'avant est écrite comme la 1.4.32 l'écrivait.
const TAPE = "Mon coeur se serre quand je pense a vous,", IA = "Mon cœur se serre quand je pense à{G} vous,";
export async function eprouverLigature({ pg, verif, cap, att }) {
  const fs = await import("node:fs");
  await pg.bringToFront();
  const modale = async () => { if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { const f = pg.locator("#scModale button", { hasText: /Fermer|Annuler/ }).first(); if (await f.count()) await f.click().catch(() => {}); else await pg.keyboard.press("Escape"); await att(250); } };
  const fermerTout = async () => { await modale();
    if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } await pg.click("#rcFermer"); await att(300); }
    if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); } };
  const scans = async () => { await modale(); if (!(await pg.evaluate(() => typeof SC !== "undefined" && SC.ouvert))) { await pg.click('#ruOnglets [data-o="pilotage"]').catch(() => {}); await att(300); await pg.click('#ruSous [data-s="correction"]').catch(() => {}); await att(500); await pg.click("#btnScan"); await att(1500); } };
  const recopie = async () => { await scans(); if (!(await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(1000); } if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } };
  const sansPhrase = async () => { await att(150); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } };
  const choisir = async k => { if (await pg.evaluate(k => RC.copie !== k, k)) { await pg.selectOption("#rcCopie", k); await att(700); await sansPhrase(); if (await pg.evaluate(k => RC.copie !== k, k)) { await pg.selectOption("#rcCopie", k); await att(700); } } };
  const exporter = async () => { const dl = pg.waitForEvent("download", { timeout: 4000 }).catch(() => null); await pg.click("#rcExportIA"); const d = await dl; await att(400); return d ? JSON.parse(fs.readFileSync(await d.path(), "utf8")) : null; };
  const charger = async ret => { await pg.click("#rcImportIA"); await att(200); await pg.locator("#rcIATexte").fill(JSON.stringify(ret)); await pg.click("#rcIAValider"); await att(1200);
    const m = await pg.evaluate(() => document.getElementById("rcIAMessage").textContent); await pg.keyboard.press("Escape"); await att(300); return m; };
  const fichier = async k => { await fermerTout(); await scans(); const i0 = await pg.evaluate(k => scCopiesED().indexOf(k), k);
    await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(900);
    const pop = pg.waitForEvent("popup"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Tester comme l'élève").click(); const w = await pop; await w.waitForLoadState(); await w.waitForTimeout(1200); await w.click(".passer").catch(() => {}); await w.waitForTimeout(600);
    const r = await w.evaluate(() => ({ fautes: D.fautes.length, ids: D.fautes.map(f => f.id), tys: Array.from(document.querySelectorAll("#pan .ty")).map(e => e.innerText.replace(/\s+/g, " ").trim()) }));
    await w.close(); await modale(); return r; };
  const etat = k => pg.evaluate(k => ({ corrigee: svCopieCorrigee(k), pct: (scAvancement(k) || {}).pct, bilan: Object.values(avFautes(k) || {}).reduce((a, x) => a + x, 0), numeros: scFautes(k).length, note: stNoteCopie(k).n,
    marques: Object.values(scCopie(k).marques || {}).filter(m => m.forme === "faute").length, marquesCoeur: Object.values(scCopie(k).marques || {}).filter(m => m.bande && /coeur|cœur/.test((m.bande.eleve || "") + (m.bande.corrige || ""))).length, arrets: rcArrets(k).map(a => (a.g.eleve || "∅") + " → " + (a.g.corrige || "∅")), sansDecision: rcArrets(k).filter(a => !(a.l.decisions || {})[a.cle]).length }), k);
  await fermerTout(); await scans();
  const kT = await pg.evaluate(() => SC.copies.find(k => rcLignesEcrites(k).some(x => /^Les prix augmentes/.test(x.l.texte || ""))) || null);
  if (!kT) { verif("1.4.33 : la lettre aux quatre lignes", false); return; }
  // 1. une cinquième ligne, tapée sans « œ »
  await recopie(); await choisir(kT); { const p0 = await pg.evaluate(k => scPagesDe(k)[0].id, kT); if (await pg.evaluate(p => RC.page !== p, p0)) { await pg.selectOption("#rcPage", { index: 0 }); await att(500); } }
  const L5 = await pg.evaluate(() => { const E = Array.from(document.querySelectorAll("#rcFeuille .rc-saisie[data-ligne]")).filter(e => e.offsetParent && e.getBoundingClientRect().height > 4 && !e.disabled); const e = E.find((e, i) => i >= 4 && !e.value.trim()); return e ? e.dataset.ligne : null; });
  if (!L5) { verif("1.4.33 : une cinquième ligne libre sur la page de la lettre", false); return; }
  { const c = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + L5 + '"]'); await c.scrollIntoViewIfNeeded({ timeout: 5000 }); await c.fill(TAPE); await att(300); }
  await pg.click("#rcPhraseOuvrir"); await att(250); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } if (await pg.evaluate(() => !!RC.phrase)) { await pg.keyboard.press("Escape"); await att(200); }
  const exs = []; for (let i = 0; i < 6; i++) { const e = await exporter(); if (!e) break; exs.push(e); }
  const idT = await pg.evaluate(k => state.copies[k].id, kT), cT = exs.flatMap(e => e.copies).find(c => c.copie === idT);
  if (!cT) { verif("1.4.33 : la ligne part à l’IA (" + exs.length + " envoi(s))", false); return; }
  const parti = cT.pages.flatMap(p => p.lignes).find(l => l.id === L5);
  /* le retour de l'IA : la ligne avec « œ » et la vraie faute ; les stickers de la copie, rendus tels quels */
  const ret = { format: "mjpc-recopie-ia-3", lignes: {}, reussites: {}, aReprendre: {}, commentaires: {} };
  const deja = await pg.evaluate(() => { const o = {}; SC.copies.forEach(k => { const L = (((scCopie(k).recopie || {}).stickersIA || {}).liste || []).filter(e => e.par !== "prof"); o[state.copies[k].id] = L.map(e => e.lettre ? { s: e.num } : { s: e.num, l: e.l, m: e.mots }); }); return o; });
  exs.flatMap(e => e.copies).forEach(c => { c.pages.flatMap(p => p.lignes).forEach(l => { if (!c.seulementStickers) ret.lignes[l.id] = l.id === L5 ? IA : l.texte; }); ret.reussites[c.copie] = (deja[c.copie] || []).concat([{ s: "fin" }]); ret.commentaires[c.copie] = "Relis chaque faute soulignée, puis récris dans ton cahier la phrase où elle se trouve."; });
  const m1 = await charger(ret);
  // la bande, au clavier : chaque arrêt de la copie
  await choisir(kT); await pg.click("#rcBandeOuvrir"); await att(600); if (await pg.evaluate(() => RC.bd && RC.bd.attente)) { await pg.keyboard.press("Enter"); await att(300); }
  const vus = [];
  for (let i = 0; i < 40; i++) { const e = await pg.evaluate(() => { const c = document.querySelector("#rcBandeCarte"), a = RC.bd && RC.bd.A[RC.bd.i];
      return { fin: !!RC.bd && !a && /✓ Copie corrigée/.test(c ? c.textContent : ""), k: RC.bd && RC.bd.k, mot: a && !a.st ? (a.g.eleve || "∅") + " → " + (a.g.corrige || "∅") : null }; });
    if (e.fin || !e.k) break; if (e.mot && !vus.includes(e.mot)) { vus.push(e.mot); if (e.mot === "a → à") await cap("C14-1433-bande-a"); }
    await pg.keyboard.press("Enter"); await att(260); }
  await pg.keyboard.press("Escape"); await att(300);
  const e1 = await etat(kT), f1 = await fichier(kT), idA = await pg.evaluate(k => (Object.values(scCopie(k).marques || {}).find(m => m.forme === "faute" && m.bande && m.bande.eleve === "a" && m.bande.corrige === "à") || {}).id || null, kT);
  verif("1.4.33 (C14 127) : la ligne tapée « " + TAPE + " » part à l’IA telle quelle (" + (parti && parti.texte === TAPE) + ") ; son retour « " + IA + " » chargé (« " + m1.slice(0, 60) + " ») ; la bande s’arrête sur « " + vus.join(" · ") + " », jamais sur « coeur → cœur » ; la copie est corrigée (" + e1.corrigee + ", " + e1.pct + " %) ; son fichier : " + f1.fautes + " fautes, dont « a → à » (" + f1.ids.includes(idA) + ")",
    !!parti && parti.texte === TAPE && vus.includes("a → à") && !vus.some(v => /coeur|cœur/.test(v)) && !e1.arrets.some(v => /coeur|cœur/.test(v)) && e1.corrigee && e1.pct === 100 && e1.sansDecision === 0 && !!idA && f1.ids.includes(idA) && !e1.marquesCoeur);
  // 2. la même faute, gardée comme la 1.4.32 l'a écrite (au site : 9 fautes) : une marque « coeur → cœur », sa décision « o » sous la clé d'alors
  const avant = await pg.evaluate(({ k, L5 }) => { const x = rcLignesEcrites(k).find(x => x.id === L5), l = x.l, A = rcTokenize(l.texte), B = rcTokenize(l.corrige), i = A.indexOf("coeur"), j = B.indexOf("cœur");
    const cle = i + "-" + (i + 1) + "/" + j + "-" + (j + 1), g = { de: i, a: i + 1, de2: j, a2: j + 1, eleve: "coeur", corrige: "cœur" }, a = { k, pid: x.pid, id: x.id, l, g, cle }, q = rcPlaceSeg(a);
    const m = { page: x.pid, forme: "faute", sens: "lieu", passe: "langue", point: "orthographe", q: null, x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1, bonne: "cœur", bande: { ligne: x.id, cle, eleve: "coeur", corrige: "cœur", type: q.type.nom, code: "L", notion: rcNotion(g) } };
    scPoser(m); rcLigneMaj(k, x.pid, x.id, L => { L.marquesBande = Object.assign({}, L.marquesBande, { [cle]: m.id }); L.decisions = Object.assign({}, L.decisions, { [cle]: "o" }); }); saveState(); return { cle, i, j, id: m.id }; }, { k: kT, L5 });
  await fermerTout(); await scans(); await att(800);
  const e2 = await etat(kT), f2 = await fichier(kT);
  await recopie(); await choisir(kT); await pg.click("#rcBandeOuvrir"); await att(600);
  const b2 = await pg.evaluate(() => { const B = RC.bd; return { ouverte: !!B, reste: B ? rcBandeNonDecides(B).length : -1, coeur: B ? B.A.filter(a => !a.st && /coeur|cœur/.test((a.g.eleve || "") + (a.g.corrige || ""))).length : -1, carte: (document.querySelector("#rcBandeCarte") || {}).textContent || "" }; });
  await cap("C14-1433-bande-sans-coeur"); await pg.keyboard.press("Escape"); await att(300);
  verif("1.4.33 (C14 127) : la faute « coeur → cœur » gardée comme la 1.4.32 l’écrivait (" + (e2.marques - e1.marques) + " marque de plus dans la copie, non réécrite) : elle n’est plus nulle part : fichier de l’élève " + f1.fautes + " → " + f2.fautes + " fautes (« coeur » n’y est pas : " + !f2.ids.includes(avant.id) + ") ; bilan " + e1.bilan + " → " + e2.bilan + " ; fautes numérotées " + e1.numeros + " → " + e2.numeros + " ; note " + e1.note + " → " + e2.note + " ; la copie reste corrigée (" + e2.corrigee + ", " + e2.pct + " %) ; la bande : rien à revoir (" + b2.reste + "), aucun arrêt « coeur » (" + b2.coeur + ")",
    avant.i >= 0 && avant.j >= 0 && e2.marques === e1.marques + 1 && e2.marquesCoeur === 1 && f2.fautes === f1.fautes && !f2.ids.includes(avant.id) && f2.ids.includes(idA) && e2.bilan === e1.bilan && e2.numeros === e1.numeros && e2.note === e1.note && e2.corrigee && e2.pct === 100 && b2.ouverte && b2.reste === 0 && b2.coeur === 0);
  await fermerTout();
}
