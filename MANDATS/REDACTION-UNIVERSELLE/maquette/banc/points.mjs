// [C14 1.4.29] (Paul 02/11 22:33 : « je trouve les notes extrêmement basses. Il faut que je puisse régler les points de la grille, c'est faisable? » ; 22:41 : « ok pour 80.
// Il faut aussi une case "afficher la note dans les html rendus". si je décoche, les html partent sans note, bien qu'avec leur grille. »). Joué après la bande, copie après copie :
// des copies corrigées avec leurs stickers. Tout par le geste (Réglages, « ⚖ Les points », la fenêtre des notes qui changent, la case, « 🧪 Tester comme l'élève ») ;
// les évaluations lisent l'état, le faux site et le fichier de l'élève.
export async function eprouverPoints({ pg, verif, cap, att }) {
  await pg.bringToFront();
  const modaleTexte = () => pg.evaluate(() => { const m = document.getElementById("scModale"); return m && m.classList.contains("show") ? m.innerText.replace(/\s+/g, " ") : ""; });
  if (await modaleTexte()) { await pg.keyboard.press("Escape"); await att(200); }
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } await pg.click("#rcFermer"); await att(300); }
  if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); }
  const notes = () => pg.evaluate(() => { const o = stNotesClasse(); return { o, tot: stTotal() }; });
  const n0 = await notes();
  const kN = Object.keys(n0.o); if (!kN.length) { verif("1.4.29 : des copies corrigées avec leurs stickers", false); return; }
  /* une ligne à stickers et un niveau où se trouve au moins une copie corrigée (le niveau 1 ou 2 d'abord) : ses points montent d'un point */
  const L1 = await pg.evaluate(K => { const L = stSujetLignes().filter(l => !l.calcul && stComptent(l.id).length), C = [];
    L.forEach(l => K.forEach(k => { const x = stNoteCopie(k).det.find(y => y.ligne === l.id); if (x && x.niveau != null) C.push({ l, n: x.niveau }); }));
    const c = C.find(x => x.n === 1 || x.n === 2) || C.find(x => x.n === 3) || C[0]; return c ? { id: c.l.id, titre: c.l.titre, bareme: c.l.bareme.slice(), poids: c.l.poids, n: c.n } : null; }, kN);
  if (!L1) { verif("1.4.29 : une ligne à stickers où se trouve une copie corrigée", false); return; }
  await pg.click('#ruOnglets [data-o="reglages"]'); await att(900);
  /* [trouvé au vrai site, en lecture seule] « ⚖ Les points » puis « Garder » sans rien changer, sur chaque ligne : rien ne change, rien ne s'écrit (la grille du site dit « 1-1,3334 » pour 30 à 40 lignes) */
  const g0 = await pg.evaluate(() => JSON.stringify(SUJET.grille2)), s0 = await pg.evaluate(() => ruLire(["redactions", RU.id, "config", "grille2"]).then(g => JSON.stringify(g)));
  const lignesG = await pg.evaluate(() => stSujetLignes().map(l => l.id)); let fenetres = 0, rien = 0;
  for (const id of lignesG) { await pg.locator('button.st-ligne[onclick*="\'' + id + '\'"]').click(); await att(200); await pg.click("#stBaremeRegler"); await att(200); await pg.evaluate(() => { const x = document.getElementById("toast"); if (x) x.textContent = ""; }); await pg.click("#stBaremeGarder"); await att(300);
    if (/change la note de/.test(await modaleTexte())) { fenetres++; await pg.locator("#scModale button", { hasText: "Annuler" }).click(); await att(200); }
    if (await pg.evaluate(() => /Rien n’a changé/.test((document.getElementById("toast") || {}).textContent || ""))) rien++; }
  const g1 = await pg.evaluate(() => JSON.stringify(SUJET.grille2)), s1 = await pg.evaluate(() => ruLire(["redactions", RU.id, "config", "grille2"]).then(g => JSON.stringify(g)));
  const avant = await pg.evaluate(() => { const L = stSujetLignes().find(l => l.calcul === "lignes"), p = L && stPoint(L.id), lg = scLong(); if (!p) return null; const S = stLignesSeuils(p);
    return [S.L1 - 1, S.L1, S.L2 - 1, S.L2, S.L3 - 1, S.L3, S.Lm, S.Lm + 1].map(n => { const r = n / lg, c = (p.cases || []).find(c => { const m = /^calc:\w+:([\d.]+)-([\d.]+)$/.exec(c.si); return m && r >= +m[1] && r <= +m[2]; }); return n + ":" + (c ? c.niveau : "—"); }).join(" "); });
  verif("1.4.29 (C14 80) : « ⚖ Les points » puis « Garder » sans rien changer, sur les " + lignesG.length + " lignes : aucune note ne change (" + fenetres + " fenêtre), « Rien n’a changé » (" + rien + "), la grille reste la même, en mémoire (" + (g0 === g1) + ") et au site (" + (s0 === s1) + ") ; les lignes lues comme la grille les compte (« " + avant + " »)",
    fenetres === 0 && rien === lignesG.length && g0 === g1 && s0 === s1);
  await pg.locator('button.st-ligne[onclick*="\'' + L1.id + '\'"]').click(); await att(400);
  const tx0 = await pg.evaluate(() => (document.querySelector(".st-bareme") || {}).innerText || "");
  await pg.click("#stBaremeRegler"); await att(300);
  /* comme Paul : le niveau où sont les copies monte d'un point (les niveaux au-dessus suivent s'il le faut) */
  const B = L1.bareme.map(Number); B[L1.n] += 1; for (let i = L1.n + 1; i < 4; i++) B[i] = Math.max(B[i], B[i - 1]);
  for (const n of [0, 1, 2, 3]) { await pg.locator("#stPts" + n).fill(String(B[n])); await att(80); }
  await pg.click("#stBaremeGarder"); await att(500);
  const apercu = await modaleTexte(); await cap("C14-1429-points-apercu");
  const change = /change la note de/.test(apercu); if (change) { await pg.locator("#scModale button", { hasText: "Appliquer" }).click(); await att(800); }
  const n1 = await notes(), site1 = await pg.evaluate(id => ruLire(["redactions", RU.id, "config", "grille2"]).then(g => { const p = (g.criteres || []).flatMap(c => c.points || []).find(p => p.id === id); return p ? JSON.stringify(p.bareme) : ""; }), L1.id);
  const plus = kN.filter(k => n1.o[k] > n0.o[k] + 1e-9).length, moins = kN.filter(k => n1.o[k] < n0.o[k] - 1e-9).length, tx1 = await pg.evaluate(() => (document.querySelector(".st-bareme") || {}).innerText || "");
  verif("1.4.29 (C14 80) : Réglages → « " + L1.titre + " » (« " + tx0.slice(0, 60) + " ») → « ⚖ Les points » : le niveau " + L1.n + " monte d’un point (" + JSON.stringify(L1.bareme) + " → " + JSON.stringify(B) + ") ; avant de rien changer, la fenêtre dit chaque note qui change et la moyenne de la classe (« " + (apercu.match(/La moyenne de la classe[^)]*\)/) || [""])[0] + " ») ; Appliquer : " + plus + " note(s) montent, aucune ne baisse (" + moins + ") ; au site (" + site1 + ") ; le total suit le niveau 3 (" + n0.tot + " → " + n1.tot + ")",
    change && /La moyenne de la classe : [\d,]+ \/ \d+ → [\d,]+ \/ \d+/.test(apercu) && plus >= 1 && moins === 0 && site1 === JSON.stringify(B) && n1.tot === n0.tot + (B[3] - L1.bareme[3]) && tx1 !== tx0);
  // la ligne de l'orthographe : ses seuils, en erreurs pour dix lignes
  const LO = await pg.evaluate(() => { const l = stSujetLignes().find(l => l.calcul === "fautes"); return l ? { id: l.id, titre: l.titre } : null; });
  if (LO) {
    await pg.locator('button.st-ligne[onclick*="\'' + LO.id + '\'"]').click(); await att(400); await pg.click("#stBaremeRegler"); await att(300);
    for (const [n, v] of [[3, "1"], [2, "3"], [1, "6"]]) { await pg.locator("#stSeuilF" + n).fill(v); await att(80); }
    await pg.click("#stBaremeGarder"); await att(500); const ap2 = await modaleTexte(); if (/change la note de/.test(ap2)) { await pg.locator("#scModale button", { hasText: "Appliquer" }).click(); await att(800); }
    const g2 = await pg.evaluate(id => { const p = stPoint(id); return { si: (p.cases || []).map(c => c.niveau + ":" + c.si).join(" "), fait: (p.cases || []).map(c => c.fait).join(" | "), ech: stEchelle(stLigne(id)).map(e => e.n + ":" + e.texte).join(" · ") }; }, LO.id);
    const bordsF = await pg.evaluate(id => { const p = stPoint(id); return [[3, 30], [4, 30], [9, 30], [10, 30], [18, 30], [19, 30]].map(([e, n]) => { const r = e / n, c = (p.cases || []).find(c => { const m = /^calc:\w+:([\d.]+)-([\d.]+)$/.exec(c.si); return m && r >= +m[1] && r <= +m[2]; }); return c ? c.niveau : null; }); }, LO.id);
    verif("1.4.29 (C14 80) : « " + LO.titre + " », aux bords, sur 30 lignes : 3, 4, 9, 10, 18, 19 erreurs ont les niveaux " + JSON.stringify(bordsF), JSON.stringify(bordsF) === "[3,2,2,1,1,0]");
    verif("1.4.29 (C14 80) : « " + LO.titre + " » : ses seuils réglés, au plus 1, 3 puis 6 erreurs pour dix lignes (« " + g2.si + " ») ; ce que l’élève lit suit (« " + g2.fait.slice(0, 160) + " ») ; son échelle : « " + g2.ech.slice(0, 160) + " »",
      /3:calc:fautes:0-0\.1 2:calc:fautes:0\.1001-0\.3 1:calc:fautes:0\.3001-0\.6 0:calc:fautes:0\.6001-99/.test(g2.si) && /une toutes les dix lignes au plus/.test(g2.fait) && /3 pour dix lignes au plus/.test(g2.fait) && /6 pour dix lignes au plus/.test(g2.fait));
  }
  // la ligne des trente lignes : ses seuils, en lignes
  const LL = await pg.evaluate(() => { const l = stSujetLignes().find(l => l.calcul === "lignes"); return l ? { id: l.id, titre: l.titre } : null; });
  if (LL) {
    await pg.locator('button.st-ligne[onclick*="\'' + LL.id + '\'"]').click(); await att(400); await pg.click("#stBaremeRegler"); await att(300);
    for (const [c, v] of [["L3", "27"], ["Lmax", "42"], ["L2", "22"], ["L1", "15"]]) { await pg.locator("#stSeuil" + c).fill(v); await att(80); }
    await pg.click("#stBaremeGarder"); await att(500); const ap3 = await modaleTexte(); if (/change la note de/.test(ap3)) { await pg.locator("#scModale button", { hasText: "Appliquer" }).click(); await att(800); }
    const g3 = await pg.evaluate(id => { const p = stPoint(id); return { quand: (p.cases || []).map(c => c.niveau + ":" + c.quand).join(" · "), tx: (document.querySelector(".st-bareme") || {}).innerText || "", trop: ((p.cases || []).find(c => /:1\.4/.test(c.si)) || {}).tache || "" }; }, LL.id);
    const bords = await pg.evaluate(id => { const p = stPoint(id), lg = scLong(); return [14, 15, 21, 22, 26, 27, 42, 43].map(n => { const r = n / lg, c = (p.cases || []).find(c => { const m = /^calc:\w+:([\d.]+)-([\d.]+)$/.exec(c.si); return m && r >= +m[1] && r <= +m[2]; }); return c ? c.niveau : null; }); }, LL.id);
    verif("1.4.29 (C14 80) : « " + LL.titre + " », aux bords : 14, 15, 21, 22, 26, 27, 42, 43 lignes ont les niveaux " + JSON.stringify(bords) + " (la trop longue : son niveau d’avant)", JSON.stringify(bords.slice(0, 7)) === "[0,1,1,2,2,3,3]" && bords[7] != null && bords[7] !== 3);
    verif("1.4.29 (C14 80) : « " + LL.titre + " » : niveau 3 de 27 à 42 lignes, niveau 2 dès 22, niveau 1 dès 15 (« " + g3.quand + " ») ; trop longue : « " + g3.trop + " » ; la ligne le dit (« " + g3.tx.slice(0, 120) + " »)",
      /3:de 27 à 42 lignes/.test(g3.quand) && /2:de 22 à 26 lignes/.test(g3.quand) && /1:de 15 à 21 lignes/.test(g3.quand) && /0:moins de 15 lignes/.test(g3.quand) && /plus de 42 lignes/.test(g3.quand) && /Resserre ta lettre à 42 lignes au plus\./.test(g3.trop) && /27 à 42 \(3\), dès 22 \(2\), dès 15 \(1\)/.test(g3.tx));
  }
  // les mêmes points pour une autre classe : la maquette n'a qu'une rédaction, la fenêtre le dit
  await pg.click("#stBaremeReporter"); await att(1200); const rep = await modaleTexte(); await pg.locator("#scModale button", { hasText: "Fermer" }).click().catch(() => {}); await att(300);
  verif("1.4.29 (C14 80) : « ⧉ Mêmes points pour une autre classe » : la liste des autres classes du même sujet (ici : « " + rep.slice(0, 110) + " »)", /Mêmes points pour une autre classe/.test(rep) && (/Aucune autre classe/.test(rep) || /reçoivent les points et les seuils d’ici/.test(rep)));
  await cap("C14-1429-reglages-points");
  // 81 : la case « Afficher la note dans les fichiers des élèves »
  await pg.click('#ruOnglets [data-o="pilotage"]'); await att(300); await pg.click('#ruSous [data-s="correction"]'); await att(500);
  await pg.click("#btnScan"); await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1200); if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
  const k = await pg.evaluate(K => K.find(k => svCopieCorrigee(k)) || K[0], kN), i0 = await pg.evaluate(k => scCopiesED().indexOf(k), k);   // une copie entièrement corrigée : sa note est connue
  await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(600);
  const case0 = await pg.evaluate(() => { const c = document.getElementById("scNoteEleve"); return c ? { coche: c.checked, dit: c.closest("label").innerText.replace(/\s+/g, " ") } : null; });
  const ed = async () => { if (!(await pg.evaluate(() => !!document.getElementById("scNoteEleve") && document.getElementById("scModale").classList.contains("show")))) { await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(600); } };
  const ouvrirEleve = async () => { await ed(); const pop = pg.waitForEvent("popup"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Tester comme l'élève").click(); const w = await pop; await w.waitForLoadState(); await w.waitForTimeout(1200); await w.click(".passer").catch(() => {}); await w.waitForTimeout(500); return w; };
  const lire = async (w, nom) => { const r = await w.evaluate(() => ({ pan: document.getElementById("pan").innerText.replace(/\s+/g, " "), source: document.documentElement.outerHTML, lignes: document.querySelectorAll("#pan [data-l]").length })); if (nom) await cap(nom, w);
    await w.click("#gc").catch(() => {}); await w.waitForTimeout(300); r.grille = await w.evaluate(() => (document.querySelector(".gc") || {}).innerText || ""); if (nom) await cap(nom.replace("fichier", "grille"), w); await w.close(); return r; };
  const avec = await lire(await ouvrirEleve());
  await ed(); await pg.locator("#scNoteEleve").click(); await att(800);
  const case1 = await pg.evaluate(() => ({ coche: document.getElementById("scNoteEleve").checked, sujet: SUJET.noteEleve })); await cap("C14-1429-case-note");
  const site = await pg.evaluate(() => ruLire(["redactions", RU.id, "config", "noteEleve"]));
  const sans = await lire(await ouvrirEleve(), "C14-1429-fichier-sans-note");
  const nb = s => (s.match(/\d+(,\d+)? \/ \d+/g) || []).length;
  verif("1.4.29 (C14 81) : « 📨 Fichiers École Directe » : la case « Afficher la note dans les fichiers des élèves », cochée (" + (case0 && case0.coche) + ") ; décochée (" + !case1.coche + ", au site : " + site + ") : le fichier de l’élève garde sa grille (" + sans.lignes + " lignes, comme avec la note : " + avec.lignes + ") sans aucun point (« Ta note » : " + /ta note/i.test(sans.pan) + ", « / » : " + nb(sans.pan + sans.grille) + ", « Tes points » : " + /tes points/i.test(sans.grille) + ") ; les nombres ne sont même pas dans le fichier (" + !/"note":\s*\d/.test(sans.source) + ") ; avec la note : « " + (avec.pan.match(/ta note [\d,]+ \/ \d+/i) || [avec.pan.slice(0, 60)])[0] + " »",
    !!case0 && case0.coche && !case1.coche && case1.sujet === false && site === false && sans.lignes === avec.lignes && sans.lignes >= 3 && !/ta note/i.test(sans.pan) && nb(sans.pan + sans.grille) === 0 && !/tes points/i.test(sans.grille) && !/ pt\b/.test(sans.grille) && /ta note [\d,]+ \/ \d+/i.test(avec.pan) && /tes points/i.test(avec.grille) && !/"note":\s*\d/.test(sans.source) && /"sansNote":\s*true/.test(sans.source));
  await ed(); await pg.locator("#scNoteEleve").click(); await att(800); const remis = await pg.evaluate(() => SUJET.noteEleve);
  verif("1.4.29 (C14 81) : recochée, la note revient (" + remis + ")", remis === true);
  await pg.keyboard.press("Escape"); await att(200);
}
