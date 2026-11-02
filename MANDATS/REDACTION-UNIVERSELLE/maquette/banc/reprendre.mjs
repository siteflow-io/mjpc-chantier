// [C14 1.4.28] (Paul 02/11 20:37 : « ce principe doit être tenu pour tout. si je modifie après un import, et que je veux réexport, c'est le nouvel export qui part avec les
// modifications et après je n'ai plus que ces nouvelles choses à revérifier dans la bande (ça passe dans la fonctionnalité du "il reste"). C'est le moment aussi de me coder
// le bouton "la bande" afin que je puisse passer les élèves en continu sans devoir toujours repasser par les scans etc. » ; C14 66 à 74, « ok » 21:52).
// Joué après « Tout effacer » : la classe sans corrigé, la recopie intacte, le faux site qui renvoie chaque écriture. Une vraie lettre de poilu recopiée avec ses fautes ;
// tout par le geste (export, retour de l'IA collé, bande au clavier, ¶ Paragraphe, ligne retapée, Réglages) ; les évaluations lisent l'état, l'export et le faux site.
const FAUTIF = ["Mon cher frère, je t'écrit depuis le front ou il pleut", "sans arret. Les obus tombe toute la nuit et nous", "avons peur. Mes camarade sont fatigués et", "malades, la soupe et froide quand elle arrive.",
  "Je pense a vous tous les soirs, à la ferme et aux bêtes.", "Embrasse maman pour moi, ton frère qui t'aime, Louis."];
const CORR = ["Mon cher frère, je t'écris{G} depuis le front où{G} il pleut", "sans arrêt{C}. Les obus tombent{G} toute la nuit et nous", "avons peur. Mes camarades{G} sont fatigués et", "malades, la soupe est{G} froide quand elle arrive.",
  "Je pense à{G} vous tous les soirs, à la ferme et aux bêtes.", "Embrasse maman pour moi, ton frère qui t'aime, Louis."];
const RETAPEE = "Toujours sans arret, nos tranchée s'effondrent sous la pluie", RETAPEE_C = "Toujours sans arrêt{C}, nos tranchées{G} s'effondrent sous la pluie";
const CG1 = "Relis chaque remarque, puis récris dans ton cahier la phrase qu'elle vise, en suivant son conseil. Garde ta copie dans ton classeur : tu la reprendras pour la prochaine lettre.";
const CG2 = "Ta lettre a maintenant ses parties : recopie-la au propre en allant à la ligne à chaque partie, puis relis chaque remarque et récris dans ton cahier la phrase qu'elle vise.";
export async function eprouverReprendre({ pg, verif, cap, att }) {
  const fs = await import("node:fs");
  await pg.bringToFront();
  const modale = async () => { if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { await pg.keyboard.press("Escape"); await att(200); } };
  const ouvrir = async () => { await modale();
    if (!(await pg.evaluate(() => typeof SC !== "undefined" && SC.ouvert))) { await pg.click('#ruOnglets [data-o="pilotage"]').catch(() => {}); await att(300); await pg.click('#ruSous [data-s="correction"]').catch(() => {}); await att(500); await pg.click("#btnScan"); await att(1500); }
    if (!(await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(1000); }
    if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } };
  const sansPhrase = async () => { await att(150); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } };
  const choisir = async k => { if (await pg.evaluate(k => RC.copie !== k, k)) { await pg.selectOption("#rcCopie", k); await att(700); await sansPhrase(); if (await pg.evaluate(k => RC.copie !== k, k)) { await pg.selectOption("#rcCopie", k); await att(700); } } };
  const exporter = async () => { const dl = pg.waitForEvent("download", { timeout: 4000 }).catch(() => null); await pg.click("#rcExportIA"); const d = await dl; await att(400); return d ? JSON.parse(fs.readFileSync(await d.path(), "utf8")) : null; };
  const charger = async ret => { await pg.click("#rcImportIA"); await att(200); await pg.locator("#rcIATexte").fill(JSON.stringify(ret)); await pg.click("#rcIAValider"); await att(1200);
    const m = await pg.evaluate(() => document.getElementById("rcIAMessage").textContent); await pg.keyboard.press("Escape"); await att(300); return m; };
  const toastTexte = () => pg.evaluate(() => Array.from(document.querySelectorAll(".toast, #toast, [class*=toast]")).map(e => e.textContent).join(" ").replace(/\s+/g, " "));
  const etatA = k => pg.evaluate(k => { const L = rcLignesEcrites(k), s = scCopie(k);
    return { dec: L.map(x => JSON.stringify(Object.keys(x.l.decisions || {}).sort().map(c => c + "=" + x.l.decisions[c]))), st: JSON.stringify(Object.keys(s.stickers || {}).sort().map(i => i + "=" + s.stickers[i].v)),
      nd: rcArretsBande(k).filter(a => a.st ? !stDecision(k, a.stId) : !(a.l.decisions && a.l.decisions[a.cle])).map(a => a.st ? a.sticker.num + (a.plusVu ? "(plus vu)" : "") : a.g.eleve + "→" + a.g.corrige),
      rq: typeof stRqARelire === "function" && stRqARelire(k), rqNouvelles: ((((s.recopie || {}).remarquesIA) || {}).liste || []).filter(e => e.nouvelle).map(e => e.num), cg: (s.commentaire || {}).texte || "", cgNouveau: rcCgNouveau(k),
      corrigee: svCopieCorrigee(k), pct: (scAvancement(k) || {}).pct, rp: rcReprise(k), marques: Object.values(s.marques || {}).filter(m => m && m.bande).length,
      arrets: rcArrets(k).map(a => a.id + "|" + a.g.eleve + "→" + a.g.corrige + "=" + (((a.l.decisions || {})[a.cle]) || "")) }; }, k);
  const finirBande = async (n) => { for (let i = 0; i < (n || 60); i++) { const e = await pg.evaluate(() => { const c = document.querySelector("#rcBandeCarte"); return { fin: !!RC.bd && !RC.bd.A[RC.bd.i] && /✓ Copie corrigée/.test(c ? c.textContent : ""), k: RC.bd && RC.bd.k }; }); if (e.fin || !e.k) return e; await pg.keyboard.press("Enter"); await att(260); } return null; };
  /* la sauvegarde, plus haut, a marqué absents tous les élèves sauf un : trois élèves qui ont une copie redeviennent présents (clic droit sur leur carte) */
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } await pg.click("#rcFermer"); await att(300); }
  if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); }
  await pg.click('#ruOnglets [data-o="pilotage"]').catch(() => {}); await att(300); await pg.click('#ruSous [data-s="correction"]').catch(() => {}); await att(500);
  for (let n = 0; n < 3; n++) { const i = await pg.evaluate(() => Array.from(document.querySelectorAll("#gridEleves .eleve-card")).findIndex(c => c.classList.contains("absent") && scPagesDe(eleveId(c.querySelector(".eleve-nom").textContent)).length));
    if (i < 0) break; await pg.locator("#gridEleves .eleve-card").nth(i).click({ button: "right" }); await att(250); await pg.click("#avAbsentBtn"); await att(900); }
  await ouvrir();
  // la copie de la lettre : six lignes recopiées avec leurs fautes, sur les six premières lignes de sa première page
  const kA = await pg.evaluate(() => SC.copies.filter(k => scPagesDe(k).length && !(typeof avAbsent === "function" && avAbsent(k)))[0] || null);
  if (!kA) { verif("1.4.28 : une copie présente, avec sa photo", false); return; }
  await choisir(kA); { const p0 = await pg.evaluate(k => scPagesDe(k)[0].id, kA); if (await pg.evaluate(p => RC.page !== p, p0)) { await pg.selectOption("#rcPage", { index: 0 }); await att(500); } }
  /* deux autres copies présentes, deux lignes recopiées chacune s'il le faut : la bande ira de copie en copie */
  const autresK = await pg.evaluate(kA => SC.copies.filter(k => k !== kA && scPagesDe(k).length && !(typeof avAbsent === "function" && avAbsent(k))).slice(0, 2), kA);
  for (const [j, k] of autresK.entries()) { if (await pg.evaluate(k => rcLignesEcrites(k).length >= 2, k)) continue; await choisir(k);
    const ids = await pg.evaluate(() => Array.from(document.querySelectorAll("#rcFeuille .rc-saisie[data-ligne]")).filter(e => e.offsetParent && e.getBoundingClientRect().height > 4 && !e.disabled).slice(0, 2).map(e => e.dataset.ligne));
    const T = j ? ["Chère maman, nous sommes au repos à l'arrière,", "loin du bruit des canons, et je dors enfin."] : ["Mon cher Paul, je t'écris depuis la tranchée,", "il pleut depuis trois jours et la boue monte."];
      for (let i = 0; i < ids.length; i++) { const c = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + ids[i] + '"]'); await c.scrollIntoViewIfNeeded({ timeout: 5000 }); await c.fill(T[i]); await att(250); }
    await pg.click("#rcPhraseOuvrir"); await att(250); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } }
  await choisir(kA); { const p0 = await pg.evaluate(k => scPagesDe(k)[0].id, kA); if (await pg.evaluate(p => RC.page !== p, p0)) { await pg.selectOption("#rcPage", { index: 0 }); await att(500); } }
  /* les lignes d'une page jamais recopiée prennent leur identité à son ouverture : on les lit maintenant, sur la copie ouverte */
  const L = await pg.evaluate(() => Array.from(document.querySelectorAll("#rcFeuille .rc-saisie[data-ligne]")).filter(e => e.offsetParent && e.getBoundingClientRect().height > 4 && !e.disabled).slice(0, 6).map(e => e.dataset.ligne));
  if (L.length < 6) { verif("1.4.28 : six lignes sur la première page de la copie (" + L.length + ")", false); return; }
  for (let i = 0; i < 6; i++) {
    const c = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + L[i] + '"]'); await c.scrollIntoViewIfNeeded({ timeout: 5000 }); await c.fill(FAUTIF[i]); await att(250); }
  await pg.click("#rcPhraseOuvrir"); await att(250); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } if (await pg.evaluate(() => !!RC.phrase)) { await pg.keyboard.press("Escape"); await att(200); }
  // les stickers de la grille : deux des paragraphes, deux autres (portée « passage »)
  const G = await pg.evaluate(() => { const A = stActifs().filter(s => s.etat === "valide"), P = A.filter(stDesParagraphes), N = A.filter(s => !stDesParagraphes(s) && s.portee !== "lettre");
    return { P: P.map(s => ({ id: s.id, num: s.num, portee: s.portee, ligne: s.ligne })), N: N.slice(0, 2).map(s => ({ id: s.id, num: s.num, ligne: s.ligne })) }; });
  const P1 = G.P.find(s => s.portee !== "lettre") || G.P[0], P2 = G.P.find(s => s !== P1), N1 = G.N[0], N2 = G.N[1];
  if (!P1 || !P2 || !N1 || !N2) { verif("1.4.28 : la grille a des stickers des paragraphes (" + G.P.length + ") et d'autres (" + G.N.length + ")", false); return; }
  // 1. le premier export : la copie entière ; puis les paquets suivants, jusqu'à ce que tout soit parti (les retours se chargent ensemble)
  const ex1 = await exporter(); const idA = await pg.evaluate(k => state.copies[k].id, kA), c1 = ex1 && ex1.copies.find(c => c.copie === idA);
  const exs = ex1 ? [ex1] : []; for (let i = 0; i < 6; i++) { const e = await exporter(); if (!e) break; exs.push(e); }
  const env1 = await pg.evaluate(k => (scCopie(k).recopie || {}).envoi || null, kA);
  verif("1.4.28 : le premier export emporte la copie entière (" + (c1 ? c1.pages.flatMap(p => p.lignes).length : 0) + " lignes, sans « reprendre » : " + !!(c1 && !c1.reprendre) + ") ; l’app retient ses paragraphes envoyés (" + ((env1 || {}).paras || []).length + ") et les stickers jugés (" + Object.keys((env1 || {}).st || {}).length + ")",
    !!c1 && !c1.reprendre && Array.isArray((env1 || {}).paras) && Object.keys((env1 || {}).st || {}).length === (await pg.evaluate(() => stActifs().length)));
  // 2. le retour de l'IA : la lettre corrigée, ses réussites, ses remarques, son commentaire ; les autres copies, rendues telles quelles
  const ret1 = { format: "mjpc-recopie-ia-3", lignes: {}, reussites: {}, aReprendre: {}, commentaires: {} };
  exs.flatMap(e => e.copies).forEach(c => { c.pages.flatMap(p => p.lignes).forEach(l => { const i = L.indexOf(l.id); if (!c.seulementStickers) ret1.lignes[l.id] = i >= 0 ? CORR[i] : l.texte; }); ret1.reussites[c.copie] = [{ s: "fin" }]; ret1.commentaires[c.copie] = CG1; });
  ret1.reussites[idA] = [{ s: P1.num, l: L[2], m: "avons peur" }, { s: N1.num, l: L[0], m: "Mon cher frère" }, { s: "fin" }];
  ret1.aReprendre[idA] = [{ s: P2.num, r: "Ta lettre est écrite d'un seul bloc. Va à la ligne quand tu passes à une autre partie." }, { s: N2.num, l: L[4], m: "Je pense a vous", r: "Tu dis que tu penses à eux, sans dire à quoi. Ajoute un souvenir précis de la ferme." }, { s: "fin" }];
  const m1 = await charger(ret1);
  // 3. la bande de la lettre jusqu'au bout : la première faute refusée (N), le reste gardé (Entrée), les remarques, le commentaire
  await choisir(kA); await pg.click("#rcBandeOuvrir"); await att(600); if (await pg.evaluate(() => RC.bd && RC.bd.attente)) { await pg.keyboard.press("Enter"); await att(300); }
  await pg.keyboard.press("n"); await att(260); const fin1 = await finirBande();
  const S1 = await etatA(kA);
  verif("1.4.28 : le retour chargé (« " + m1.slice(0, 120) + " ») ; la bande de la lettre jusqu’au bout, au clavier : " + (fin1 && fin1.fin ? "✓ Copie corrigée" : "pas finie") + ", sa carte à " + S1.pct + " %", !!(fin1 && fin1.fin) && S1.corrigee && S1.pct === 100 && !S1.rp);
  await pg.keyboard.press("Escape"); await att(300);
  // 4. (C14 71) rien n'a changé : « ⇪ Exporter » dit pourquoi rien ne part
  const ex0 = await exporter(), t0 = await toastTexte();
  verif("1.4.28 (C14 71) : tout est revenu et rien n’a changé : « ⇪ Exporter » ne télécharge rien (" + !ex0 + ") et dit pourquoi (« " + (t0.match(/Rien à envoyer[^.]*\./) || [""])[0] + " »)", !ex0 && /Rien à envoyer : toutes tes copies recopiées sont revenues de l’IA, et rien n’a changé depuis leur retour\./.test(t0));
  // 5. les changements : un ¶ posé (« ¶ Paragraphe »), et une ligne retapée, qui a trop changé pour garder son corrigé
  await choisir(kA);
  const par0 = await pg.evaluate(([k, id]) => rcParagraphes(k).has(id), [kA, L[3]]);
  await pg.locator('#rcFeuille .rc-saisie[data-ligne="' + L[3] + '"]').click(); await att(200); await pg.click("#rcPar"); await att(300);
  const par1 = await pg.evaluate(([k, id]) => rcParagraphes(k).has(id), [kA, L[3]]);
  const cR = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + L[1] + '"]'); await cR.scrollIntoViewIfNeeded({ timeout: 5000 }); await cR.fill(RETAPEE); await att(300); await pg.keyboard.press("Tab"); await att(300);
  const ress = await pg.evaluate(([a, b]) => Math.round(rcRessemblance(a, b) * 100) / 100, [FAUTIF[1], RETAPEE]);
  const S2 = await etatA(kA), flux2 = await pg.evaluate(() => document.querySelector("#rcIAEtat").textContent);
  verif("1.4.28 (C14 66) : après le retour, un ¶ posé (" + par0 + " → " + par1 + ") et une ligne retapée (ressemblance " + ress + ", sous 0,6) : la copie redevient « à envoyer » (" + (S2.rp ? rcTxt(S2.rp) : "rien") + ") ; sa carte redescend sous 100 % (" + S2.pct + " %) ; le flux le dit (« " + (flux2.match(/\d+ changée[^·]*/) || [""])[0].trim() + " »)",
    par0 !== par1 && ress < 0.6 && !!S2.rp && S2.rp.paras && S2.rp.lignes.length === 1 && S2.rp.lignes[0] === L[1] && S2.pct < 100 && !S2.corrigee && /1 changée depuis leur retour/.test(flux2));
  // 6. l'export : cette copie seule, avec ses seuls changements
  const ex2 = await exporter(), c2 = ex2 && ex2.copies.find(c => c.copie === idA), Pn = G.P.map(s => s.num);
  verif("1.4.28 (C14 67, 68) : l’export suivant n’emporte que cette copie (" + (ex2 ? ex2.copies.length : 0) + ") : « reprendre » dit la ligne à corriger (" + (c2 && c2.reprendre ? c2.reprendre.lignes.length : "?") + "), les stickers à revoir (" + (c2 && c2.reprendre ? [].concat(c2.reprendre.stickers).join(" ") : "?") + " : ceux des paragraphes, et ceux posés sur la ligne retapée) et redemande le commentaire (" + !!(c2 && c2.reprendre && c2.reprendre.commentaire) + ") ; la consigne explique « reprendre » ; la copie part entière, ses paragraphes compris",
    !!ex2 && ex2.copies.filter(c => c.reprendre).length === 1 && !!c2 && !!c2.reprendre && c2.reprendre.lignes.join() === L[1] && Pn.every(n => c2.reprendre.stickers.includes(n)) && c2.reprendre.commentaire === true && !c2.seulementStickers
    && /Une copie qui porte « reprendre » a déjà été corrigée/.test(ex2.consigne) && c2.pages.flatMap(p => p.lignes).length >= 6 && c2.pages.flatMap(p => p.lignes).some(l => l.id === L[3] && l.par === true) === par1);
  // 7. le retour : la seule ligne reprise ; les stickers des paragraphes rejugés (P1, gardé, ne l'est plus ; P2 l'est devenu) ; un nouveau commentaire
  const ret2 = { format: "mjpc-recopie-ia-3", lignes: { [L[1]]: RETAPEE_C }, reussites: { [idA]: [{ s: P2.num, l: L[3], m: "malades, la soupe" }, { s: "fin" }] }, aReprendre: { [idA]: [{ s: P1.num, r: "Tes parties ne sont pas dans l'ordre du sujet. Remets-les dans l'ordre : où tu es, puis le plus dur, puis ton inquiétude." }, { s: "fin" }] }, commentaires: { [idA]: CG2 } };
  const m2 = await charger(ret2), S3 = await etatA(kA);
  const autresLignes = (A, B) => A.filter((d, i) => i !== 1).join("|") === B.filter((d, i) => i !== 1).join("|");
  verif("1.4.28 (C14 67, 70) : le retour chargé (« " + m2.slice(0, 220) + " ») ; les autres lignes gardent leurs décisions (" + autresLignes(S1.dec, S3.dec) + ") ; la faute restée la même sur la ligne retapée garde ta décision (« arret → arrêt » : " + S3.arrets.includes(L[1] + "|arret→arrêt=o") + ") ; la bande ne s’arrêtera que sur ce qui a changé : « " + S3.nd.join(" · ") + " » ; une remarque nouvelle (" + S3.rqNouvelles.join(" ") + ") ; le commentaire de l’IA à côté du tien (" + S3.cgNouveau + ")",
    /Dont 1 ligne reprise après ton changement/.test(m2) && /1 que tu avais gardée et que l’IA ne voit plus : la bande s’y arrête/.test(m2) && autresLignes(S1.dec, S3.dec)
    && S3.nd.length === 3 && S3.nd.includes("tranchée→tranchées") && S3.nd.includes(P1.num + "(plus vu)") && S3.nd.includes(P2.num) && S3.arrets.includes(L[1] + "|arret→arrêt=o") && S3.arrets.includes(L[1] + "|tranchée→tranchées=") && S3.rq && S3.rqNouvelles.join() === P1.num && S3.cgNouveau && S3.cg === CG1 && !S3.rp);
  // 8. la bande : Entrée sur ce qui reste, les remarques, puis le commentaire : « ↧ Prendre la sienne », Entrée
  await choisir(kA); await pg.click("#rcBandeOuvrir"); await att(700);
  const titre3 = await pg.evaluate(() => { const B = RC.bd; return B ? rcBandeNonDecides(B).length : -1; });
  for (let i = 0; i < 3; i++) { await pg.keyboard.press("Enter"); await att(300); }
  const rqVu = await pg.evaluate(() => (document.querySelector("#rcRqListe") || {}).innerText || ""); await pg.keyboard.press("Enter"); await att(400);
  const cgVu = await pg.evaluate(() => ({ champ: (document.querySelector("#rcCgTexte") || {}).value || "", sien: (document.querySelector("#rcCgSien") || {}).textContent || "", tete: (document.querySelector(".rc-cg-tete span") || {}).textContent || "" }));
  await cap("C14-1428-commentaire-cote-a-cote");
  await pg.click("#rcCgPrendre"); await att(250); await pg.keyboard.press("Enter"); await att(500);
  const S4 = await etatA(kA), fin4 = await pg.evaluate(() => /✓ Copie corrigée/.test(document.querySelector("#rcBandeCarte").textContent));
  verif("1.4.28 (C14 70) : la bande rouverte : " + titre3 + " arrêts à revoir, Entrée sur chacun ; la remarque nouvelle marquée (« " + (rqVu.match(/nouvelle/) || [""])[0] + " »), Entrée ; le commentaire : le tien dans le champ, celui de l’IA dessous (« " + cgVu.tete.slice(0, 70) + "… ») ; « ↧ Prendre la sienne », Entrée : " + (fin4 ? "✓ Copie corrigée" : "pas finie") + ", carte à " + S4.pct + " %",
    titre3 === 3 && /nouvelle/.test(rqVu) && cgVu.champ === CG1 && cgVu.sien === CG2 && fin4 && S4.cg === CG2 && S4.corrigee && S4.pct === 100 && S4.nd.length === 0);
  await pg.keyboard.press("Escape"); await att(300);
  // 9. (C14 69) un sticker dont tu changes la question, dans Réglages, puis que tu revalides : il part seul, pour toutes les copies revenues
  await pg.click("#rcFermer"); await att(300); await pg.locator('button[onclick="scFermer()"]').click(); await att(1000);
  await pg.click('#ruOnglets [data-o="reglages"]'); await att(900);
  await pg.locator('button.st-ligne[onclick*="\'' + N2.ligne + '\'"]').click(); await att(400);
  const carte = pg.locator(".st-carte").filter({ has: pg.locator(".st-carte-haut b", { hasText: new RegExp("^" + N2.num + "$") }) }); await carte.click(); await att(300);
  const q0 = await pg.evaluate(id => (SUJET.stickers[id] || {}).cherche || "", N2.id);
  const ta = pg.locator('textarea[data-st="' + N2.id + '"][data-champ="cherche"]'); await ta.fill(q0 + " Un souvenir précis compte, même court."); await ta.press("Tab"); await att(500);   // comme Paul : il écrit, puis quitte le champ
  await pg.locator('button[onclick*="stValider(\'' + N2.id + '\')"]').first().click(); await att(500); await modale();
  await pg.click('#ruOnglets [data-o="pilotage"]'); await att(300); await pg.click('#ruSous [data-s="correction"]'); await att(500); await ouvrir();
  const rev = await pg.evaluate(() => SC.copies.filter(k => rcRevenue(k)).map(k => ({ k, rp: rcReprise(k) })));
  const ex3 = await exporter(), seuls = ex3 ? ex3.copies.filter(c => c.reprendre && [].concat(c.reprendre.stickers).join() === N2.num && !c.reprendre.lignes.length && c.seulementStickers && !c.reprendre.commentaire).length : 0;
  verif("1.4.28 (C14 69) : la question de " + N2.num + " changée dans Réglages, puis revalidée : les " + rev.length + " copies revenues sont « à envoyer » pour ce seul sticker (" + rev.filter(x => x.rp && x.rp.stickers.join() === N2.id && !x.rp.lignes.length).length + ") ; l’export les emporte pour lui seul (" + seuls + " sur " + (ex3 ? ex3.copies.length : 0) + "), sans lignes ni commentaire",
    rev.length >= 2 && rev.every(x => x.rp && x.rp.stickers.join() === N2.id && !x.rp.lignes.length) && !!ex3 && seuls === ex3.copies.length && seuls === Math.min(8, rev.length));
  const ret3 = { format: "mjpc-recopie-ia-3", lignes: {}, reussites: {}, aReprendre: {} }; (ex3 ? ex3.copies : []).forEach(c => { ret3.reussites[c.copie] = c.copie === idA ? [{ s: N2.num, l: L[4], m: "Je pense a vous" }, { s: "fin" }] : [{ s: "fin" }]; });
  const m3 = await charger(ret3), S5 = await etatA(kA), autres = await pg.evaluate(id => SC.copies.filter(k => rcRevenue(k) && state.copies[k].id !== id).map(k => ({ nd: rcArretsBande(k).filter(a => a.st && !stDecision(k, a.stId)).length, rp: !!rcReprise(k) })), idA);
  verif("1.4.28 (C14 69, 70) : le retour chargé (« " + m3.slice(0, 120) + " ») : sur la lettre, seul " + N2.num + " s’arrête (« " + S5.nd.join(" · ") + " »), ses autres stickers et ses fautes ne bougent pas ; sur les autres copies, rien de neuf (" + autres.filter(a => !a.nd && !a.rp).length + " sur " + autres.length + ")",
    S5.nd.join() === N2.num && S5.dec.join("|") === S4.dec.join("|") && autres.every(a => !a.nd && !a.rp) && !S5.rp);
  if (S5.nd.length) { await choisir(kA); await pg.click("#rcBandeOuvrir"); await att(600); await pg.keyboard.press("Enter"); await att(300); await pg.keyboard.press("Escape"); await att(300); }
}
function rcTxt(rp) { return (rp.lignes.length ? rp.lignes.length + " ligne(s)" : "") + (rp.paras ? ", ses paragraphes" : "") + (rp.stickers.length ? ", " + rp.stickers.length + " sticker(s)" : ""); }

// [C14 1.4.28] (C14 72-73) « ▶ La bande » : depuis l'accueil, la bande s'ouvre sur la première copie qui a quelque chose à revoir ; Entrée, encore et encore, va de copie en copie
// sans jamais quitter la bande ; « ← Copie » et « Copie → » ; Échap revient à la recopie de la copie où l'on est ; « ▶ La bande » en haut des scans.
export async function eprouverBandeSuite({ pg, verif, cap, att }) {
  await pg.bringToFront();
  if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { await pg.keyboard.press("Escape"); await att(200); }
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { if (await pg.evaluate(() => !!RC.bd)) { await pg.keyboard.press("Escape"); await att(300); } await pg.click("#rcFermer"); await att(300); }
  if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); }
  await pg.click('#ruOnglets [data-o="pilotage"]').catch(() => {}); await att(300); await pg.click('#ruSous [data-s="correction"]').catch(() => {}); await att(500);
  await pg.click("#btnBandeAccueil"); await att(3500);
  const o1 = await pg.evaluate(() => { const C = typeof rcBandeCopies === "function" ? rcBandeCopies() : [], R = C.filter(rcBandeReste);
    return { bd: !!RC.bd, k: RC.bd && RC.bd.k, premier: R[0] || null, n: C.length, reste: R.length, ou: (document.querySelector("#rcBdOu") || {}).textContent || "", i: C.indexOf(RC.bd && RC.bd.k) }; });
  await cap("C14-1428-la-bande-depuis-l-accueil");
  verif("1.4.28 (C14 72) : « ▶ La bande » sur l’accueil ouvre la bande sur la première copie qui a quelque chose à revoir (" + (o1.k === o1.premier) + ") ; en haut : « " + o1.ou + " »",
    o1.bd && o1.reste >= 2 && o1.k === o1.premier && o1.ou === "Copie " + (o1.i + 1) + " sur " + o1.n + " · " + o1.reste + " à revoir");
  const vues = [o1.k]; let sorties = 0, n = 0, sauvegarde = "";
  while (n++ < 400) {
    /* le paquet entièrement corrigé propose sa sauvegarde (C14, Paul 13:12) : elle est rangée au site ; Paul ferme la fenêtre et continue */
    if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { sauvegarde = await pg.evaluate(() => document.querySelector("#scModale h3").innerText); await pg.keyboard.press("Escape"); await att(300); continue; }
    const e = await pg.evaluate(() => ({ bd: !!RC.bd, k: RC.bd && RC.bd.k, rc: RC.ouvert, sc: SC.ouvert, toutes: /Toutes les copies revenues de l’IA sont corrigées/.test((document.querySelector("#rcBandeCarte") || {}).textContent || ""), reste: rcBandeCopies().filter(rcBandeReste).length }));
    if (!e.bd) sorties++; if (e.k && vues[vues.length - 1] !== e.k) vues.push(e.k); if (e.toutes && !e.reste) break; await pg.keyboard.press("Enter"); await att(170); }
  const o2 = await pg.evaluate(() => ({ reste: rcBandeCopies().filter(rcBandeReste).length, ou: (document.querySelector("#rcBdOu") || {}).textContent || "", carte: (document.querySelector("#rcBandeCarte") || {}).textContent || "", bd: !!RC.bd }));
  await cap("C14-1428-toutes-corrigees");
  verif("1.4.28 (C14 73) : Entrée, encore et encore (" + n + " fois) : la bande va de copie en copie sans jamais se fermer (" + sorties + " sortie) ; " + vues.length + " copies revues, dans l’ordre du paquet" + (sauvegarde ? " (le paquet fini a proposé sa sauvegarde : « " + sauvegarde + " », fermée)" : "") + " ; au bout : « " + (o2.carte.match(/Toutes les copies[^.]*\./) || [""])[0] + " » ; en haut : « " + o2.ou + " »",
    sorties === 0 && o2.bd && vues.length === o1.reste && o2.reste === 0 && /Toutes les copies revenues de l’IA sont corrigées\./.test(o2.carte) && /· rien à revoir$/.test(o2.ou));
  const g = await pg.evaluate(() => { const C = rcBandeCopies(), i = C.indexOf(RC.bd.k); return { i, n: C.length, avant: C[i - 1] || null, apres: C[i + 1] || null, dAv: document.querySelector("#rcBdAvant").disabled, dSu: document.querySelector("#rcBdSuite").disabled, tSu: document.querySelector("#rcBdSuite").title }; });
  if (g.avant) { await pg.click("#rcBdAvant"); await att(700); } const k3 = await pg.evaluate(() => RC.bd && RC.bd.k);
  if (g.avant) { await pg.click("#rcBdSuite"); await att(700); } const k4 = await pg.evaluate(() => RC.bd && RC.bd.k);
  verif("1.4.28 (C14 72) : « ← Copie » ouvre la bande de la copie d’avant (" + (k3 === g.avant) + "), « Copie → » revient (" + (k4 === g.avant ? false : true) + ") ; sur la dernière copie, « Copie → » est grisé et dit pourquoi (« " + (g.dSu ? g.tSu : "") + " »)",
    !!g.avant && k3 === g.avant && k4 !== g.avant && !!k4 && (g.i !== g.n - 1 || (g.dSu && /Grisé : c’est la dernière copie revenue de l’IA\./.test(g.tSu))));
  await pg.keyboard.press("Escape"); await att(400);
  const o5 = await pg.evaluate(k => ({ bd: !!RC.bd, rc: RC.ouvert, copie: RC.copie === k }), k4);
  await pg.click("#rcFermer"); await att(400);
  await pg.click("#btnBande"); await att(1500); const t6 = await pg.evaluate(() => Array.from(document.querySelectorAll(".toast, #toast, [class*=toast]")).map(e => e.textContent).join(" "));
  const o6 = await pg.evaluate(() => ({ bd: !!RC.bd, k: RC.bd && RC.bd.k }));
  verif("1.4.28 (C14 72-73) : Échap revient à la recopie de la copie où l’on est (" + (o5.rc && !o5.bd && o5.copie) + ") ; « ▶ La bande » en haut des scans, tout étant corrigé, l’ouvre pour relire et le dit (« " + (t6.match(/Toutes les copies revenues[^.]*\./) || [""])[0] + " »)",
    o5.rc && !o5.bd && o5.copie && o6.bd && /Toutes les copies revenues de l’IA sont corrigées : la bande s’ouvre pour les relire\./.test(t6));
  await pg.keyboard.press("Escape"); await att(300);
}
