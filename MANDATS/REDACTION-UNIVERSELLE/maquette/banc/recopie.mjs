import path from "node:path";
// Épreuves de la recopie : seulement des gestes ; les évaluations lisent l'état et le DOM.
export async function eprouverRecopie({ pg, verif, cap, att, dir, out }) {
  await pg.bringToFront();
  // [1.4.15] (Paul 01/11 13:12) sans la phrase qui m'a marqué, on ne quitte pas une copie recopiée jusqu'à sa dernière page : la phrase est demandée ; ici, « Pas de phrase », le geste de Paul
  const sansPhrase = async () => { await att(150); if (await pg.evaluate(() => typeof RC !== "undefined" && !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(350); } };
  const allerCopie = async k => { await pg.selectOption("#rcCopie", k); await sansPhrase(); };
  const copieSuite = async () => { await pg.click("#rcCopieSuite"); await sansPhrase(); };
  const avant = await pg.evaluate(() => {
    const k = SC.copies[SC.ic], c = state.copies[k], s = c.scan || {};
    return { k, lignes: s.lignes, marques: JSON.stringify(s.marques || {}), rep: JSON.stringify(s.rep || {}), note: scNote(k), copies: Object.keys(state.copies).length };
  });
  await pg.click("#btnRecopier"); await pg.locator("#rcEcran").waitFor({ state: "visible" });
  const debut = await pg.evaluate(() => ({ n: document.querySelectorAll("#rcFeuille .rc-saisie").length, k: RC.copie, page: RC.page, ids: Array.from(document.querySelectorAll("#rcFeuille .rc-saisie")).map(e => e.dataset.ligne) }));
  verif("recopie : photo et feuille ouvertes sur la bonne copie, lignes proposées (" + debut.n + ")", debut.k === avant.k && debut.n >= 3);
  const champ = n => pg.locator("#rcFeuille .rc-saisie").nth(n);
  const textes = ["je t'écrit [vite], mon ami.", "Deux mots", "une phra-"];
  const noeud = await champ(0).elementHandle();
  await champ(0).fill(textes[0]); await pg.keyboard.press("Enter");
  await pg.keyboard.type(textes[1]); await pg.keyboard.press("Enter"); await pg.keyboard.type(textes[2]);
  const frappe = await pg.evaluate(() => ({
    textes: Array.from(document.querySelectorAll("#rcFeuille .rc-saisie")).slice(0, 3).map(e => e.value),
    active: document.activeElement.dataset.ligne,
    lignes: state.copies[RC.copie].scan.lignes
  }));
  verif("recopie : trois lignes exactes, dont deux mots, rature entre crochets, ponctuation et mot coupé", JSON.stringify(frappe.textes) === JSON.stringify(textes) && frappe.active === debut.ids[2]);
  await pg.keyboard.press("ArrowUp"); const haut = await pg.evaluate(() => document.activeElement.dataset.ligne);
  await pg.keyboard.press("ArrowDown"); const bas = await pg.evaluate(() => document.activeElement.dataset.ligne);
  verif("recopie : les flèches changent de ligne, Entrée ne touche pas les corrections", haut === debut.ids[1] && bas === debut.ids[2]);
  await champ(0).click(); await pg.keyboard.press("End"); await pg.keyboard.type(" À demain.");
  await att(1400);
  const stable = await pg.evaluate(e => e === document.querySelector(".rc-saisie") && e.value.endsWith(" À demain."), noeud);
  verif("recopie : la sauvegarde garde le même champ et son texte pendant la frappe", stable);
  const id = debut.ids[0];
  const poignee = cote => pg.locator('circle[data-rc-ligne="' + id + '"][data-rc-cote="' + cote + '"]');
  const geom = async () => pg.evaluate(id => {
    const p = state.copies[RC.copie].scan.recopie.pages[RC.page], l = p.lignes[id];
    return { x0: l.x0, x1: l.x1, y0: l.y0, y1: l.y1, texte: l.texte, id: l.id };
  }, id);
  const g0 = await geom();
  for (const [cote, dx, dy] of [["gauche", 15, 5], ["droite", -18, 9]]) {
    const r = await poignee(cote).boundingBox(); await pg.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
    await pg.mouse.down(); await pg.mouse.move(r.x + r.width / 2 + dx, r.y + r.height / 2 + dy, { steps: 5 }); await pg.mouse.up(); await att(120);
  }
  const g1 = await geom();
  verif("recopie : les deux poignées recalent la ligne avec sa pente, sans changer son identité ni son texte", g1.x0 > g0.x0 && g1.x1 < g0.x1 && g1.y0 !== g0.y0 && g1.y1 !== g0.y1 && g1.id === g0.id && g1.texte === g0.texte);
  const alignement = await pg.evaluate(id => {
    const d = state.copies[RC.copie].scan.recopie.pages[RC.page], l = d.lignes[id];
    const photo = document.getElementById("rcPhoto").getBoundingClientRect();
    const feuille = document.getElementById("rcFeuille").getBoundingClientRect();
    const row = Array.from(document.querySelectorAll(".rc-ligne")).find(e => e.dataset.ligne === id);
    const style = getComputedStyle(row), m = new DOMMatrix(style.transform), longueur = parseFloat(row.style.width);
    const origine = style.transformOrigin.split(" ").map(parseFloat);
    return Math.abs(photo.width - feuille.width) < 1
      && Math.abs(parseFloat(row.style.left) - l.x0 * photo.width) < 1
      && Math.abs(parseFloat(row.style.top) + origine[1] - l.y0 * photo.height) < 1
      && Math.abs(m.a * longueur - (l.x1 - l.x0) * photo.width) < 1.5
      && Math.abs(m.b * longueur - (l.y1 - l.y0) * photo.height) < 1.5;
  }, id);
  verif("recopie : le début et la pente de la saisie suivent la ligne photographiée, à 1,5 pixel près", alignement);
  await cap("C15-21-recopie-poignees");
  await pg.click("#rcAjouter"); const ajout = await pg.evaluate(() => RC.ligne);
  await pg.keyboard.type("Une ligne ajoutée."); await pg.click("#rcRetirer");
  const apresRetrait = await pg.evaluate(() => Array.from(document.querySelectorAll("#rcFeuille .rc-saisie")).map(e => e.dataset.ligne));
  await pg.click("#rcAnnuler");
  const retablie = await pg.evaluate(id => {
    const e = Array.from(document.querySelectorAll("#rcFeuille .rc-saisie")).find(e => e.dataset.ligne === id);
    return e && e.value;
  }, ajout);
  const gardees = await pg.evaluate(ids => {
    const d = state.copies[RC.copie].scan.recopie.pages[RC.page];
    return ids.map(id => [id, d.lignes[id].texte]);
  }, debut.ids.slice(0, 3));
  verif("recopie : ajout et retrait sans changer les autres identités ; Annuler remet la ligne et son texte", !apresRetrait.includes(ajout) && retablie === "Une ligne ajoutée." && gardees[0][1] === textes[0] + " À demain." && gardees[1][1] === textes[1] && gardees[2][1] === textes[2]);
  const reprise = await pg.evaluate(() => ({ copie: RC.copie, page: RC.page, ligne: RC.ligne }));
  await att(1400); await pg.reload(); await pg.locator("#rcEcran").waitFor({ state: "visible", timeout: 20000 }); await att(500);
  const reload = await pg.evaluate(() => ({ copie: RC.copie, page: RC.page, ligne: RC.ligne, textes: Array.from(document.querySelectorAll("#rcFeuille .rc-saisie")).map(e => e.value) }));
  verif("recopie : après rechargement, même copie, page, ligne, textes et poignées", reload.copie === reprise.copie && reload.page === reprise.page && reload.ligne === reprise.ligne && reload.textes.includes("Une ligne ajoutée.") && JSON.stringify(await geom()) === JSON.stringify(g1));
  const ancienne = await pg.evaluate(k => {
    const s = state.copies[k].scan || {};
    return { lignes: s.lignes, marques: JSON.stringify(s.marques || {}), rep: JSON.stringify(s.rep || {}), note: scNote(k), copies: Object.keys(state.copies).length };
  }, avant.k);
  verif("recopie : anciennes marques, réponses, note, total de lignes et nombre de copies conservés", ancienne.lignes === avant.lignes && ancienne.marques === avant.marques && ancienne.rep === avant.rep && JSON.stringify(ancienne.note) === JSON.stringify(avant.note) && ancienne.copies === avant.copies);
  const photoAvant = await pg.evaluate(() => SC.imgs[RC.page].url);
  const pageRetouchee = reprise.page;
  // [C14 402, 404] la retouche se fait depuis la recopie, par « 📷 La photo » (plus de panneau des passes)
  await pg.evaluate(pid => { if (RC.page !== pid) rcActiverPage(pid); }, pageRetouchee); await pg.click("#rcPhotoOuvrir"); await att(150); await pg.click("#rcPhRetoucher");
  await pg.locator("#scRtAngle").waitFor({ state: "visible" }); await pg.locator("#scRtAngle").focus(); await pg.keyboard.press("ArrowRight");
  await pg.locator('button[onclick="scRtFermer(true)"]').click();
  await pg.waitForFunction(({pid, url}) => SC.imgs[pid] && SC.imgs[pid].url !== url, {pid: pageRetouchee, url: photoAvant}); await att(300);
  const g2 = await geom();
  const noteRetouchee = await pg.evaluate(k => scNote(k), avant.k);
  verif("recopie : retoucher la photo déplace ses lignes, garde leurs identités et textes, et conserve la note", g2.id === g1.id && g2.texte === g1.texte && (Math.abs(g2.x0 - g1.x0) > 0.00001 || Math.abs(g2.y0 - g1.y0) > 0.00001) && JSON.stringify(noteRetouchee) === JSON.stringify(avant.note));
  await cap("C15-25-recopie-apres-retouche");
  const double = await pg.evaluate(() => SC.copies.find(k => Object.values(SC.pages).filter(p => p.eleve === k && !p.blanche).length > 1));
  await allerCopie(double); const pages = await pg.locator("#rcPage option").evaluateAll(es => es.map(e => e.value));
  await pg.selectOption("#rcPage", pages[1]); await champ(0).fill("Sur la deuxième page.");
  await pg.selectOption("#rcPage", pages[0]); await champ(0).fill("Sur la première page.");
  await pg.selectOption("#rcPage", pages[1]);
  verif("recopie : deux pages d'une copie gardent chacune leurs propres lignes et leur texte", await champ(0).inputValue() === "Sur la deuxième page.");
  await copieSuite(); await champ(0).fill("Une autre copie.");
  await allerCopie(double); await pg.selectOption("#rcPage", pages[1]);
  verif("recopie : changer de copie ne rattache pas la saisie à un autre élève", await champ(0).inputValue() === "Sur la deuxième page.");
  const tailles = [];
  for (const [w, h] of [[1280, 720], [1366, 768], [1536, 864], [1920, 1080]]) {
    await pg.setViewportSize({ width: w, height: h }); await att(180);
    tailles.push(await pg.evaluate(() => {
      const a = document.getElementById("rcPhoto").getBoundingClientRect(), b = document.getElementById("rcFeuille").getBoundingClientRect();
      const s = document.getElementById("rcDefile").getBoundingClientRect();
      return Math.abs(a.height - b.height) < 1 && Math.abs(a.top - b.top) < 1 && s.height > 250 && b.right <= innerWidth + 1;
    }));
    await cap("C15-22-recopie-" + w);
  }
  verif("recopie : photo et feuille de même hauteur, un seul défilement, aux quatre tailles de bureau", tailles.every(Boolean));
  await pg.setViewportSize({ width: 390, height: 800 }); await att(150); await cap("C15-23-recopie-mobile");
  verif("recopie : sur mobile la feuille reste atteignable dans le défilement", await pg.locator("#rcEcran").isVisible() && await champ(0).isVisible());
  await pg.setViewportSize({ width: 1536, height: 864 }); await pg.click("#rcFermer"); await att(250);
  await pg.setInputFiles("#scanEcran .sc-haut input[type=file]", path.join(dir, "banc/recopie-lignes-essai.png"));
  await pg.locator("#scInit").waitFor({ state: "visible" }); await pg.locator("#scInit").fill("ec"); await pg.locator("#scInit").press("Enter"); await att(300);
  const derniere = await pg.evaluate(() => Object.values(SC.pages).sort((a, b) => a.ordre - b.ordre).at(-1));
  await pg.click("#btnRecopier"); await allerCopie(derniere.eleve); await pg.selectOption("#rcPage", derniere.id);
  const six = await pg.evaluate(() => ({ n: document.querySelectorAll("#rcFeuille .rc-saisie").length, lignes: Object.values(RC.documents[RC.page].lignes).map(l => ({ y: l.y0, w: l.x1 - l.x0 })) }));
  verif("recopie : six lignes trouvées sur six dans la page inventée, avec ligne courte, rature, pente et grand blanc (" + six.n + ")", six.n === 6);
  await champ(1).fill("Deux mots"); await pg.keyboard.press("Enter");
  verif("recopie : la ligne de deux mots se saisit et se garde comme les autres", await champ(1).inputValue() === "Deux mots");
  const pos = await pg.evaluate(() => { const d = RC.documents[RC.page]; return { g: d.ordre.map(id => d.lignes[id].x0), dr: d.ordre.map(id => d.lignes[id].x1), sans: !!(RC.sansMarge && RC.sansMarge[RC.page]) }; });
  verif("recopie (C14) : les poignées gauches se posent seules juste avant la marge rouge, les droites au bord de la copie (" + pos.g.map(x => x.toFixed(3)).join(" ") + " | " + pos.dr.map(x => x.toFixed(3)).join(" ") + ")", !pos.sans && pos.g.length === 6 && pos.g.every(x => x < 150 / 1240 && x > 150 / 1240 - 0.02) && pos.dr.every(x => x >= 0.98));
  const nums = await pg.evaluate(() => ({ t: Array.from(document.querySelectorAll("#rcLignesSVG text.rc-numero")).map(t => t.textContent).join(","), av: rcEcritesAvant(RC.page), tot: rcEcritesCopie(), titre: document.querySelector("#rcLigneTitre").textContent, compte: document.querySelector("#rcCompte").textContent }));
  verif("recopie (1.3.2) : seules les lignes écrites comptent, la ligne vide après Entrée non, et le compte court sur toute la copie (" + nums.t + " · " + nums.titre + " · " + nums.compte + ")", nums.t === String(nums.av + 1) && nums.tot === nums.av + 1 && nums.compte === nums.tot + (nums.tot > 1 ? " lignes écrites" : " ligne écrite") + " sur la copie" && /^Ligne vide/.test(nums.titre));
  // 1.3.2 : une page ouverte avant (poignées encore à leur place automatique) se range à la marge ; une poignée tirée par Paul ne bouge pas
  if (await pg.evaluate(() => rcPhraseManque(RC.copie))) { await pg.click("#rcPhraseOuvrir"); await att(200); await pg.click("#rcPhraseAucune"); await att(300); }   // [1.4.15] la recopie de cette copie finie d'abord : partir n'est plus bloqué
  const ancien = await pg.evaluate(() => { const s = state.copies[RC.copie].scan.recopie.pages[RC.page], o = rcListe(s.ordre); s.lignes[o[3]].x0 = 0.0204; s.lignes[o[3]].x1 = 0.9685; s.lignes[o[4]].x0 = 0.0211921755; s.lignes[o[4]].recale = true; delete s.marge; return { copie: RC.copie, page: RC.page, a: o[3], b: o[4] }; });
  const autre = await pg.evaluate(c => SC.copies.find(k => k !== c), ancien.copie);
  await allerCopie(autre); await att(150); await allerCopie(ancien.copie); await att(150); await pg.selectOption("#rcPage", ancien.page); await att(200);
  const rg = await pg.evaluate(o => { const d = RC.documents[RC.page]; return { a0: d.lignes[o.a].x0, a1: d.lignes[o.a].x1, b0: d.lignes[o.b].x0 }; }, ancien);
  verif("recopie (1.3.2) : une page ouverte avant se range seule à la marge et au bord, une poignée tirée à la main reste où elle est (" + rg.a0.toFixed(3) + " · " + rg.a1.toFixed(3) + " · " + rg.b0.toFixed(4) + ")", rg.a0 < 150 / 1240 && rg.a0 > 150 / 1240 - 0.02 && rg.a1 >= 0.98 && rg.b0 === 0.0211921755);
  await champ(1).click(); await att(100);
  await champ(2).fill("Une ligne écrite très serrée, sans une place, ".repeat(3));
  const mg = await pg.evaluate(() => { const i = document.querySelectorAll("#rcFeuille .rc-saisie")[2]; return { sw: i.scrollWidth, cw: i.clientWidth, fs: parseFloat(getComputedStyle(i).fontSize), base: 18 * RC.echelle }; });
  verif("recopie (C14) : une ligne trop pleine rapetisse et se lit en entier, rien n'est mangé (" + mg.sw + " / " + mg.cw + " px, lettres " + mg.fs.toFixed(1) + " au lieu de " + mg.base.toFixed(1) + ")", mg.sw <= mg.cw + 1 && mg.fs < mg.base);
  await champ(2).fill("");
  await champ(3).click(); await pg.click("#rcAjouter"); await att(150); await pg.keyboard.type("Ligne ajoutée");
  const nouv = await pg.evaluate(() => RC.ligne);
  const cible = await pg.locator('#rcLignesSVG circle[data-rc-cote="gauche"]').first().boundingBox();
  for (const cote of ["gauche", "droite"]) {
    const c = await pg.locator('#rcLignesSVG circle[data-rc-ligne="' + nouv + '"][data-rc-cote="' + cote + '"]').boundingBox();
    await pg.mouse.move(c.x + c.width / 2, c.y + c.height / 2); await pg.mouse.down(); await pg.mouse.move(c.x + c.width / 2, cible.y - 10, { steps: 8 }); await pg.mouse.up(); await att(120);
  }
  const rang = await pg.evaluate(id => { const d = RC.documents[RC.page]; return { i: d.ordre.indexOf(id), n: rcNumeros(d)[id], champ: document.querySelectorAll("#rcFeuille .rc-saisie")[0].value, titre: document.querySelector("#rcLigneTitre").textContent }; }, nouv);
  verif("recopie (C14) : une ligne ajoutée puis remontée aux poignées prend sa place, son numéro et sa place sur la feuille (rang " + rang.i + ", n° " + rang.n + ", " + rang.titre + ")", rang.i === 0 && rang.n === nums.av + 1 && rang.champ === "Ligne ajoutée");
  for (let k = 0; k < 3; k++) { await pg.click("#rcAnnuler"); await att(80); }
  // 1.4.14 (Paul 01/11 09:22 : « à gauche elle est alignée sur le bord de l'image et non sur le bord de la ligne rouge. Or, c'est bien lui la limite » ; « les boutons de zoom me cachent
  // le coin supérieur droit de la bande ») : la bande va de la marge rouge au bord de la copie ; les boutons à côté, jamais dessus ; Retour arrière au début d'une ligne ; plusieurs poignées avec Ctrl
  await champ(1).click(); await att(150);
  const al = await pg.evaluate(() => { const c = document.querySelector("#rcAgrandie"), cv = c.getBoundingClientRect(), B = RC.bande, d = rcDocument(RC.page), l = rcCourante(), bt = document.querySelector(".rc-zoom-boutons").getBoundingClientRect(), k = c.width / cv.width;
    const fe = document.querySelector("#rcFeuille").getBoundingClientRect(), xm = d.marge && !d.marge.absente ? rcMargeX(d, (l.y0 + l.y1) / 2) : null; return B ? { marge: xm == null ? null : (B.gauche + xm * B.largeur) / k, fin: (B.gauche + B.fin * B.largeur) / k, larg: cv.width, feuille: fe.width, dessus: bt.left < cv.right && bt.right > cv.left && bt.top < cv.bottom && bt.bottom > cv.top } : null; });
  verif("recopie (1.4.14) : la bande du haut commence à la marge rouge (à " + (al && al.marge != null ? al.marge.toFixed(1) : "?") + " px de son bord gauche) et va jusqu'au bord de la copie (à " + (al ? (al.larg - al.fin).toFixed(1) : "?") + " px de son bord droit), large de " + (al ? Math.round(al.larg) : "?") + " points pour une feuille de " + (al ? Math.round(al.feuille) : "?") + " ; les boutons du zoom à côté d'elle, pas dessus (" + (al && !al.dessus) + ")",
    al && al.marge != null && Math.abs(al.marge - 4) <= 2 && Math.abs(al.larg - al.fin - 4) <= 3 && al.larg >= al.feuille - 70 && !al.dessus);
  const un = await pg.evaluate(() => RC.bande && { h: RC.bande.hauteur, pas: RC.bande.pas });
  verif("recopie (1.3.2) : la bande ne montre qu'une ligne de l'élève (" + (un ? un.h.toFixed(0) + " px pour des lignes espacées de " + un.pas.toFixed(0) : "?") + ")", un && un.h <= un.pas * 1.15);
  await champ(2).click(); await pg.keyboard.press("Home"); await pg.keyboard.press("Backspace"); await att(100);
  const rb = await pg.evaluate(() => { const a = document.activeElement; return { meme: a === document.querySelectorAll("#rcFeuille .rc-saisie")[1], pos: a.selectionStart, n: a.value.length }; });
  await pg.keyboard.press("Backspace"); const efface = await champ(1).inputValue(); await pg.keyboard.type("s");
  verif("recopie (C14) : Retour arrière au début d'une ligne remonte à la fin de la précédente, puis efface comme un traitement de texte (" + efface + ")", rb.meme && rb.pos === rb.n && efface === "Deux mot" && await champ(1).inputValue() === "Deux mots");
  const ids = await pg.evaluate(() => RC.documents[RC.page].ordre.slice(0, 2)), avantG = await pg.evaluate(ids => ids.map(id => RC.documents[RC.page].lignes[id].x0), ids);
  const cg = id => pg.locator('#rcLignesSVG circle[data-rc-ligne="' + id + '"][data-rc-cote="gauche"]');
  await pg.keyboard.down("Control"); for (const id of ids) { const b = await cg(id).boundingBox(); await pg.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await att(60); } await pg.keyboard.up("Control");
  const b0 = await cg(ids[0]).boundingBox(); await pg.mouse.move(b0.x + b0.width / 2, b0.y + b0.height / 2); await pg.mouse.down(); await pg.mouse.move(b0.x + b0.width / 2 + 30, b0.y + b0.height / 2, { steps: 6 }); await pg.mouse.up(); await att(120);
  const apresG = await pg.evaluate(ids => ids.map(id => RC.documents[RC.page].lignes[id].x0), ids);
  const dx = apresG.map((x, i) => x - avantG[i]);
  await pg.click("#rcAnnuler"); await att(100); const annuleG = await pg.evaluate(ids => ids.map(id => RC.documents[RC.page].lignes[id].x0), ids);
  verif("recopie (C14) : Ctrl + clic choisit deux poignées, elles se déplacent ensemble, Annuler les remet (" + dx.map(v => v.toFixed(3)).join(" / ") + ")", dx[0] > 0.01 && Math.abs(dx[0] - dx[1]) < 1e-9 && annuleG.every((x, i) => x === avantG[i]));
  // 1.3.2 (Paul 08:08) : le trait de marge et ses deux poignées ; les débuts de ligne le suivent, sauf une ligne tirée à la main
  const tm = await pg.evaluate(() => { const d = RC.documents[RC.page]; return d.marge && { xh: d.marge.xh, xb: d.marge.xb, n: document.querySelectorAll("#rcLignesSVG circle[data-rc-marge]").length }; });
  verif("recopie (1.3.2) : le trait de marge est posé seul sur la marge rouge, avec ses deux poignées (" + (tm ? tm.xh.toFixed(3) + " · " + tm.xb.toFixed(3) + " · " + tm.n : "absent") + ")", tm && tm.n === 2 && Math.abs(tm.xh - 0.121) < 0.01 && Math.abs(tm.xb - 0.121) < 0.01);
  const o = await pg.evaluate(() => RC.documents[RC.page].ordre.slice()), x0s = () => pg.evaluate(o => o.map(id => RC.documents[RC.page].lignes[id].x0), o);
  const c2 = await pg.locator('#rcLignesSVG circle[data-rc-ligne="' + o[2] + '"][data-rc-cote="gauche"]').boundingBox();
  await pg.mouse.move(c2.x + c2.width / 2, c2.y + c2.height / 2); await pg.mouse.down(); await pg.mouse.move(c2.x + c2.width / 2 - 25, c2.y + c2.height / 2, { steps: 5 }); await pg.mouse.up(); await att(100);
  await pg.locator('#rcLignesSVG circle[data-rc-marge="haut"]').scrollIntoViewIfNeeded(); await att(100);
  const avM = await x0s(), mb = await pg.locator('#rcLignesSVG circle[data-rc-marge="haut"]').boundingBox();
  await pg.mouse.move(mb.x + mb.width / 2, mb.y + mb.height / 2); await pg.mouse.down(); await pg.mouse.move(mb.x + mb.width / 2 + 40, mb.y + mb.height / 2, { steps: 6 }); await pg.mouse.up(); await att(120);
  const apM = await x0s(), dM = apM.map((x, i) => x - avM[i]);
  const main = await pg.evaluate(o => o.map(id => !!RC.documents[RC.page].lignes[id].recale), o);
  await pg.click("#rcAnnuler"); await att(100); const reM = await x0s(), tm2 = await pg.evaluate(() => RC.documents[RC.page].marge);
  verif("recopie (1.3.2) : tirer le trait de marge recale tous les débuts de ligne, sauf celui tiré à la main ; Annuler remet tout (" + dM.map(v => v.toFixed(3)).join(" ") + ")", main[2] && dM.every((v, i) => main[i] ? v === 0 : v > 0.005) && reM.every((x, i) => x === avM[i]) && Math.abs(tm2.xh - tm.xh) < 1e-9);
  await pg.click("#rcAnnuler"); await att(80);
  // 1.3.2 (Paul 08:20) : passer d'une page à l'autre au clavier ; guillemets français
  const p0 = await pg.evaluate(() => RC.page); await champ(0).click(); await pg.keyboard.press("ArrowUp"); await att(250);
  const p1 = await pg.evaluate(() => { const d = RC.documents[RC.page]; return { page: RC.page, derniere: RC.ligne === d.ordre[d.ordre.length - 1] }; });
  await pg.keyboard.type("Embrasse bien fort les petits");
  await pg.keyboard.press("Enter"); await att(250); const p2 = await pg.evaluate(() => { const d = RC.documents[RC.page], n = Array.from(document.querySelectorAll("#rcLignesSVG text.rc-numero")).map(t => t.textContent); return { page: RC.page, premiere: RC.ligne === d.ordre[0], av: rcEcritesAvant(RC.page), n, tot: rcEcritesCopie(), compte: document.querySelector("#rcCompte").textContent }; });
  verif("recopie (1.3.2) : le compte court sur toute la copie : une ligne écrite sur la page d'avant décale les numéros de celle-ci (" + p2.av + " avant · " + p2.n.join(",") + " · " + p2.compte + ")", p2.av >= 1 && p2.n[0] === String(p2.av + 1) && p2.compte === p2.tot + " lignes écrites sur la copie");
  verif("recopie (1.3.2) : ↑ sur la première ligne passe à la fin de la page précédente, Entrée sur la dernière revient à la page suivante, sans le menu « Page »", p1.page !== p0 && p1.derniere && p2.page === p0 && p2.premiere);
  await champ(4).click(); await pg.keyboard.press("End"); const garde = await champ(4).inputValue(); await champ(4).fill(""); await pg.keyboard.type('Il dit "bonjour" puis "au revoir"');
  const gu = await champ(4).inputValue(); await champ(4).fill(garde);
  verif("recopie (1.3.2) : les guillemets tapés deviennent français, avec leurs espaces insécables (" + gu + ")", gu === "Il dit «\u00a0bonjour\u00a0» puis «\u00a0au revoir\u00a0»");
  // 1.3.3 (Paul 08:20) : les pages de la copie l'une sous l'autre, dans un seul défilement ; écrire sur l'autre page sans menu
  const bl = await pg.evaluate(() => ({ n: document.querySelectorAll("#rcPages .rc-papiers").length, pages: scPagesDe(RC.copie).length, tops: Array.from(document.querySelectorAll("#rcPages .rc-papiers")).map(b => b.offsetTop) }));
  verif("recopie (1.3.3) : toutes les pages de la copie sont l'une sous l'autre, dans un seul défilement (" + bl.n + " pages)", bl.n === bl.pages && bl.n >= 2 && bl.tops.every((t, i) => i === 0 || t > bl.tops[i - 1]));
  const autreChamp = pg.locator("#rcPages .rc-papiers:not(#rcPapiers) .rc-saisie").first(); await autreChamp.scrollIntoViewIfNeeded(); await att(150);
  const pageAvant = await pg.evaluate(() => RC.page); await autreChamp.click(); await pg.keyboard.press("End"); await pg.keyboard.type("§"); await att(150);
  const ap = await pg.evaluate(() => { const d = RC.documents[RC.page]; return { page: RC.page, texte: d.lignes[RC.ligne].texte }; });
  await cap("C14-27-recopie-pages-a-la-suite"); await pg.keyboard.press("Backspace");
  verif("recopie (1.3.3) : un clic sur une ligne de l'autre page y écrit directement, sans le menu « Page » (" + ap.texte.slice(-12) + ")", ap.page !== pageAvant && ap.texte.endsWith("§"));
  await pg.selectOption("#rcPage", pageAvant); await att(200);
  const vue = await pg.evaluate(async () => { const z = document.querySelector("#rcDefile"), bs = Array.from(document.querySelectorAll("#rcPages .rc-papiers")), r = [];
    for (const b of bs) { z.scrollTop = b.offsetTop - z.firstElementChild.offsetTop + 20; await new Promise(f => setTimeout(f, 120)); r.push(document.querySelector("#rcPage").value === b.dataset.page); }
    return r; });
  verif("recopie (1.3.4) : le menu « Page » suit la page que l'on voit en faisant défiler (" + vue.join(" ") + ")", vue.length >= 2 && vue.every(Boolean));
  await pg.selectOption("#rcPage", pageAvant); await att(200);
  await cap("C15-24-recopie-six-lignes");
  await pg.setViewportSize({ width: 390, height: 800 }); await att(180);
  const lisible = await pg.evaluate(() => {
    const es = Array.from(document.querySelectorAll("#rcFeuille .rc-saisie")), boites = es.map(e => e.getBoundingClientRect());
    return es.length === 6 && boites.slice(0,-1).every((b,i) => b.bottom <= boites[i+1].top + 2);
  });
  verif("recopie : à 390 pixels, les six lignes de saisie ne se chevauchent pas", lisible);
  await cap("C15-26-recopie-six-lignes-mobile");
  // 1.4.0 (Paul 31/10, 182 et consigne validée 10:16) : l'export pour l'IA et son retour vérifié
  await pg.setViewportSize({ width: 1536, height: 864 }); await att(150);
  const fs = await import("node:fs");
  const [dl] = await Promise.all([pg.waitForEvent("download"), pg.click("#rcExportIA")]); const brut = fs.readFileSync(await dl.path(), "utf8"), ex = JSON.parse(brut);
  const noms = await pg.evaluate(() => ({ consigne: RC_CONSIGNE_IA, avant: typeof RC_CONSIGNE_AVANT === "string" ? RC_CONSIGNE_AVANT : "", noms: state.classe.slice(), cles: state.classe.map(n => eleveId(n)) }));
  const nbL = ex.copies.reduce((a, c) => a + c.pages.reduce((b, q) => b + q.lignes.length, 0), 0);
  verif("recopie (1.4.0) : « Exporter pour l'IA » donne la consigne validée et les copies numérotées, sans aucun nom d'élève (" + ex.copies.length + " copies, " + nbL + " lignes)", (ex.consigne.startsWith(noms.consigne) || (!!noms.avant && ex.consigne.startsWith(noms.avant + noms.consigne))) /* [C14 669] avec une grille de stickers, la consigne commence par les questions au professeur */ && ex.copies.length >= 1 && nbL > 0 && ex.copies.every((c, i) => c.numero === i + 1) && !noms.noms.some(n => brut.includes(n)) && !noms.cles.some(k => brut.includes(k)));
  const env = await pg.evaluate(ids => ids.every(id => { for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.id === id); if (x) return !!x.l.envoiIA && x.l.envoiIA.texte === x.l.texte; } return false; }), ex.copies.flatMap(c => c.pages.flatMap(q => q.lignes.map(l => l.id))));
  verif("recopie (1.4.10) : l'export demande la correction et le type de chaque faute dans le même envoi (lettres entre accolades, retour compact « " + ex.format + " »), 8 copies au plus ; chaque ligne garde le texte envoyé", ex.format === "mjpc-recopie-ia-3" && /\{G\} grammaire/.test(ex.consigne) && /\{X\}/.test(ex.consigne) && ex.copies.length <= 8 && env);
  const faux = JSON.parse(brut); faux.copies[0].pages[0].lignes.pop();
  await pg.click("#rcImportIA"); await pg.locator("#rcIATexte").fill(JSON.stringify(faux)); await pg.click("#rcIAValider"); await att(150);
  const refus = await pg.locator("#rcIAMessage").textContent(), rien = await pg.evaluate(ids => ids.every(id => { for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.id === id); if (x) return x.l.corrige === undefined; } return true; }), faux.copies[0].pages.flatMap(q => q.lignes.map(l => l.id)));
  verif("recopie (1.4.10) : un retour où il manque une ligne : cette copie-là ne change pas, le message le dit ; les copies entières se chargent (" + refus.slice(0, 120) + ")", (/^Rien n’a changé/.test(refus) && /manque/.test(refus) || /incomplète/.test(refus)) && rien);
  await pg.locator("#rcIATexte").fill(brut.slice(0, Math.floor(brut.length / 2))); await pg.click("#rcIAValider"); await att(200);
  const coupe = await pg.locator("#rcIAMessage").textContent(), vis = await pg.evaluate(() => { const r = document.querySelector("#rcIAMessage").getBoundingClientRect(); return r.height > 10 && r.bottom <= innerHeight; });
  verif("recopie (1.4.2) : un retour de l'IA coupé avant la fin le dit, en clair et bien visible (" + coupe.slice(0, 70) + ")", /coupé/.test(coupe) && vis);
  const bon = JSON.parse(brut), l0 = bon.copies[0].pages[0].lignes[0], l1 = bon.copies[0].pages[0].lignes[1] || bon.copies[0].pages[0].lignes[0];
  l0.texte = l0.texte + " ajouté"; if (l1 !== l0) l1.texte = "Mot " + l1.texte;
  bon.copies[0].pages = Object.fromEntries(bon.copies[0].pages.map((q, i) => [String(i + 1), q]));
  bon.reussites = Object.fromEntries(bon.copies.map(c => [c.copie, [{ s: "fin" }]]));   /* [C14 1.4.18] la grille des stickers est partie avec la correction : l'IA rend la liste des réussites de chaque copie (ici, aucune) */
  await pg.locator("#rcIATexte").fill("Voici le fichier corrigé :\n```json\n" + JSON.stringify(bon) + "\n```"); await pg.click("#rcIAValider"); await att(200);
  const ok1 = await pg.locator("#rcIAMessage").textContent(), att1 = l1 !== l0 ? 2 : 1;
  const st = await pg.evaluate(ids => ids.map(id => { for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.id === id); if (x) return x.l.corrige; } return null; }), [l0.id, l1.id]);
  verif("recopie (1.4.0) : le bon retour, même entouré de texte, est chargé ligne par ligne et compte ses fautes (" + ok1 + ")", /^Chargé/.test(ok1) && ok1.includes(att1 + " faute") && st[0] === l0.texte && st[1] === l1.texte);
  await cap("C14-28-corrige-ia");
  // 1.4.8 (Paul 15:59) : le compteur de toute la classe, toujours visible, et sur le bouton d'export
  const cpt = await pg.evaluate(() => { const c = rcCompteIA(), t = document.querySelector("#rcIAEtat").textContent, b = document.querySelector("#rcExportIA").textContent;
    const attendu = []; for (const k of SC.copies) { const L = rcLignesEcrites(k); if (L.length) attendu.push(L.some(x => typeof x.l.corrige !== "string" || x.l.texte !== x.l.corrigeDe)); }
    return { c, t, b, rec: attendu.length, aFaire: attendu.filter(Boolean).length }; });
  verif("recopie (1.4.8) : le compteur d'en haut (le même, pas un nouveau) donne le compte de toute la classe : « " + cpt.t + " » (" + cpt.rec + " copies recopiées, " + cpt.aFaire + " à exporter) ; le bouton reste « " + cpt.b.trim() + " »",
    cpt.c.rec === cpt.rec && cpt.c.aFaire === cpt.aFaire && cpt.t.includes("Le flux : " + cpt.rec + " recopiée") && (cpt.aFaire ? cpt.t.includes(cpt.aFaire + " à exporter") : cpt.t.includes(cpt.rec + " chargée")) && !/\(\d+\)/.test(cpt.b));
  await pg.click("#rcIAFermer"); await pg.click("#rcExportIA"); await att(150); const tout = await pg.locator("#rcIAEtat").textContent(); await pg.click("#rcImportIA"); await att(100);
  verif("recopie (1.4.2) : l'export ne reprend que les copies sans corrigé à jour, 8 au plus ; quand tout est fait, il le dit (" + tout + ")", /Le flux : (\d+) recopiées? · \d+ envoyées? · \1 chargées?/.test(tout) && !/à exporter/.test(tout) && ex.copies.length <= 8);
  await att(1500); const auSite = await pg.evaluate(t => { let s = ""; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/hub/.test(k)) s += localStorage.getItem(k); } return s.includes(JSON.stringify(t).slice(1, -1)) && s.includes('"corrigeLe"'); }, l0.texte);
  verif("recopie (1.4.0) : le corrigé chargé est enregistré au site (faux hub), pas seulement à l'écran", auSite);
  // 1.4.10 (Paul 17:18 : « tout devait se faire en une fois ») : le retour compact, la correction et ses lettres ; coupé : les copies entières se chargent ;
  // une ligne changée depuis l'envoi : sa copie attend le prochain export
  const lignesEx = c => c.pages.flatMap(q => q.lignes);
  const corrigeLettre = t => { const m = t.match(/^(\S*?)([A-Za-zÀ-ÿ]{3,})/); if (!m) return t + " ok{M}"; const w = m[2], w2 = (w[0] === w[0].toUpperCase() ? w[0].toLowerCase() : w[0].toUpperCase()) + w.slice(1); return t.replace(w, w2 + "{L}"); };   // une majuscule changée, que l'IA dit « Lexique »
  const comp = {}; ex.copies.forEach(c => lignesEx(c).forEach((l, j) => { comp[l.id] = j === 0 ? corrigeLettre(l.texte) : l.texte; }));
  const txt13 = JSON.stringify({ format: "mjpc-recopie-ia-3", lignes: comp }), dern13 = lignesEx(ex.copies[ex.copies.length - 1]).map(l => l.id), coupe13 = txt13.indexOf('"' + dern13[0] + '"') + dern13[0].length + 8;
  if (!(await pg.locator("#rcIA").isVisible())) { await pg.click("#rcImportIA"); await att(100); } await pg.locator("#rcIATexte").fill(txt13.slice(0, coupe13)); await pg.click("#rcIAValider"); await att(250);
  const m13 = await pg.locator("#rcIAMessage").textContent();
  const r13 = await pg.evaluate(cs => cs.map(c => { const id = c[0]; for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.id === id); if (x) { const A = rcArrets(k).filter(a => a.id === id); return { charge: !!x.l.corrigeMarque, net: !/[{}]/.test(x.l.corrige || "{"), types: A.map(a => rcCodeArret(a) + "/" + rcCodeFaute(a.g)).join(" ") }; } } return null; }), ex.copies.map(c => lignesEx(c).map(l => l.id)));
  verif("recopie (1.4.10) : un retour compact, la correction avec ses lettres, coupé dans la dernière copie : les " + (ex.copies.length - 1) + " copies entières se chargent, sans accolades dans le corrigé, et chaque faute prend la lettre de l'IA (« " + (r13[0] || {}).types + " », IA/moteur) ; la coupée attend (« " + m13.slice(0, 120) + " »)",
    ex.copies.length < 2 || (r13.slice(0, -1).every((r, i) => { const l0 = comp[lignesEx(ex.copies[i])[0].id], att = /\{L\}/.test(l0) ? "L" : "M"; return r && (r.charge || att === "M") && r.net && r.types.startsWith(att + "/"); }) && r13[0].types === "L/C" && r13[r13.length - 1] && !r13[r13.length - 1].charge && /coupé/.test(m13) && /avec leur type/.test(m13)));
  const ici13 = await pg.evaluate(ids => { const k = RC.copie, x = rcLignesEcrites(k).find(y => ids.includes(y.id) && y.pid === RC.page); return x ? { id: x.id, texte: x.l.texte } : null; }, Object.keys(comp));
  if (ici13) { await pg.click("#rcIAFermer"); await att(100); const champ13 = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + ici13.id + '"]'); await champ13.scrollIntoViewIfNeeded(); await champ13.fill(ici13.texte + " encore"); await att(300);
    await pg.click("#rcImportIA"); await att(100); await pg.locator("#rcIATexte").fill(txt13); await pg.click("#rcIAValider"); await att(250); }
  const m14 = await pg.locator("#rcIAMessage").textContent(), r14 = ici13 ? await pg.evaluate(id => { const x = rcLignesEcrites(RC.copie).find(y => y.id === id); return !(x.l.corrigeMarque || "").includes("{L}") || x.l.corrigeDe !== x.l.texte; }, ici13.id) : false;
  await pg.click("#rcIAFermer"); await att(100);
  if (ici13) { const champ13 = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + ici13.id + '"]'); await champ13.fill(ici13.texte); await att(300); }
  await pg.click("#rcImportIA"); await att(100); await pg.locator("#rcIATexte").fill(JSON.stringify(bon)); await pg.click("#rcIAValider"); await att(250);   // le bon retour d'avant, remis : la suite du banc s'appuie dessus ; la fenêtre reste ouverte
  verif("recopie (1.4.10) : une ligne retapée après l'envoi à l'IA : sa copie ne reçoit pas la correction de l'ancien texte, et le message le dit (« " + m14.slice(0, 120) + " »)", !!ici13 && r14 && /changé depuis l’envoi/.test(m14));
  // 1.4.12 (Paul 15:59 : « les élèves doivent être identifiés. sinon c'est la porte ouverte au mélange de données ») : chaque copie part avec son
  // identité interne, jamais son nom ; une ligne rendue qui ne ressemble plus à la ligne envoyée (l'IA a échangé deux lignes de deux copies) fait refuser sa copie
  if (ex.copies.length >= 3) {
    const plus = c => lignesEx(c).slice().sort((p, q) => q.texte.split(/\s+/).length - p.texte.split(/\s+/).length)[0], lA = plus(ex.copies[0]), lB = plus(ex.copies[1]);
    const comp2 = Object.assign({}, comp); comp2[lA.id] = comp[lB.id]; comp2[lB.id] = comp[lA.id];
    const av16 = await pg.evaluate(ids => ids.map(id => { for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.id === id); if (x) return { k, c: x.l.corrige, le: x.l.corrigeLe, r: 0 }; } return null; }), [lA.id, lB.id]);
    const res16 = await pg.evaluate(([a, b]) => rcRessemblance(a, b), [lA.texte, lB.texte]);
    if (!(await pg.locator("#rcIA").isVisible())) { await pg.click("#rcImportIA"); await att(100); }
    await pg.locator("#rcIATexte").fill(JSON.stringify({ format: "mjpc-recopie-ia-3", lignes: comp2 })); await pg.click("#rcIAValider"); await att(300);
    const m16 = await pg.locator("#rcIAMessage").textContent();
    const ap16 = await pg.evaluate(([ids, autres]) => ({ deux: ids.map(id => { for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.id === id); if (x) return { c: x.l.corrige, le: x.l.corrigeLe, refus: !!((scCopie(k).recopie || {}).refusIA) }; } return null; }),
      autres: autres.filter(id => { for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.id === id); if (x) return x.l.corrigeLe && x.l.corrigeMarque !== undefined || typeof x.l.corrige === "string"; } return false; }).length,
      noms: SC.copies.map(k => nomEleveDe(k)).filter(Boolean) }), [[lA.id, lB.id], ex.copies.slice(2).map(c => lignesEx(c)[0].id)]);
    await pg.click("#rcIAFermer"); await att(100); await pg.click("#rcFluxOuvrir"); await att(200); const fl16 = await pg.locator("#rcFluxTable").textContent(); await cap("C14-41-retour-ia-refus"); await pg.click("#rcFluxFermer"); await att(100);
    const exTxt = JSON.stringify(ex), sansNom = !ap16.noms.some(n => exTxt.includes(n));
    await pg.click("#rcImportIA"); await att(100); await pg.locator("#rcIATexte").fill(JSON.stringify(bon)); await pg.click("#rcIAValider"); await att(250);   // le bon retour remis, pour la suite du banc
    const apres16 = await pg.evaluate(ids => ids.map(id => { for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.id === id); if (x) return !((scCopie(k).recopie || {}).refusIA); } return false; }), [lA.id, lB.id]);
    verif("recopie (1.4.12) : chaque copie part chez l'IA avec son identité interne (" + ex.copies.filter(c => typeof c.copie === "string" && c.copie).length + " sur " + ex.copies.length + "), sans aucun nom d'élève (" + sansNom + ") ; un retour où l'IA a échangé deux lignes de deux copies (ressemblance " + res16.toFixed(2) + ", seuil 0,6) : ces 2 copies sont refusées, rien n'y est écrit (" + ap16.deux.filter((d, i) => d && d.c === av16[i].c && d.le === av16[i].le).length + " sur 2), le message le dit et le flux le montre (« " + m16.slice(0, 60) + " … " + (m16.match(/\d+ copies? refusées?[^:]*/) || [""])[0] + " », flux : " + (fl16.match(/refusée/g) || []).length + ") ; les autres copies se chargent ; un bon retour efface le refus (" + apres16.filter(Boolean).length + " sur 2)",
      ex.copies.every(c => typeof c.copie === "string" && c.copie) && sansNom && res16 < 0.6 && ap16.deux.every((d, i) => d && d.refus && d.c === av16[i].c && d.le === av16[i].le) && /2 copies refusées/.test(m16) && /ne ressemble plus/.test(m16) && /^Chargé/.test(m16) && (fl16.match(/refusée/g) || []).length === 2 && apres16.every(Boolean));
  }
  // 1.4.12 (Paul 23:19, « Ok » à 336) : quand le sujet laisse le choix, l'IA dit, dans le même envoi, lequel l'élève a traité ; aucun geste ; un choix déjà fait reste
  { const V = await pg.evaluate(() => rcVariantes().map(v => v.id));
    if (V.length >= 2) {
      const c20 = ex.copies.find(c => c.copie), k20 = await pg.evaluate(id => SC.copies.find(k => (state.copies[k] || {}).id === id), c20.copie), av20 = await pg.evaluate(k => state.copies[k].sujet || null, k20);
      if (!(await pg.locator("#rcIA").isVisible())) { await pg.click("#rcImportIA"); await att(100); }
      await pg.locator("#rcIATexte").fill(JSON.stringify({ format: "mjpc-recopie-ia-3", lignes: comp, sujets: { [c20.copie]: V[1] } })); await pg.click("#rcIAValider"); await att(300);
      const m20 = (await pg.locator("#rcIAMessage").textContent()) || "", ap20 = await pg.evaluate(k => state.copies[k].sujet || null, k20);
      await pg.locator("#rcIATexte").fill(JSON.stringify(bon)); await pg.click("#rcIAValider"); await att(250);   // le bon retour remis, pour la suite du banc
      verif("recopie (1.4.12) : le sujet laisse le choix (" + V.length + " sujets) : la consigne le demande à l'IA (" + /Ce sujet laisse le choix/.test(ex.consigne) + ") ; son retour le dit pour une copie : « " + (av20 || "pas choisi") + " » → « " + ap20 + " »" + (av20 ? " (ton choix reste)" : "") + ", et le message le dit (« " + (m20.match(/Le sujet traité[^.]*\./) || [""])[0] + " »)",
        /Ce sujet laisse le choix/.test(ex.consigne) && (av20 ? ap20 === av20 : ap20 === V[1] && /Le sujet traité, dit par l’IA : 1 copie/.test(m20)));
    } else verif("recopie (1.4.12) : le sujet de la maquette n'a qu'un sujet : la consigne ne demande rien de plus à l'IA (" + !/Ce sujet laisse le choix/.test(ex.consigne) + ")", !/Ce sujet laisse le choix/.test(ex.consigne));
  }
  // 1.4.11 (Paul 17:18 ; C14 284) : le flux de la classe, chaque étape datée ; une ligne retapée depuis l'envoi se voit
  await pg.click("#rcIAFermer"); await att(100); await pg.click("#rcFluxOuvrir"); await att(200);
  const fl = await pg.evaluate(() => { const rows = Array.from(document.querySelectorAll("#rcFluxTable tr[data-k]")).map(tr => Array.from(tr.children).map(td => td.textContent)); const F = SC.copies.map(rcFluxCopie); return { rows, n: F.length, envoyees: F.filter(f => f.envoi).length, chargees: F.filter(f => f.charge).length }; });
  await cap("C14-37-le-flux");
  await pg.click("#rcFluxFermer"); await att(100); await pg.click("#rcImportIA"); await att(100);   // la suite attend la fenêtre du corrigé ouverte
  verif("recopie (1.4.11) : « 📋 Le flux » montre chaque copie et ses étapes, datées (" + fl.rows.length + " copies ; envoyées " + fl.envoyees + ", chargées " + fl.chargees + " ; première ligne : « " + (fl.rows[0] || []).join(" | ").slice(0, 120) + " »)",
    fl.rows.length === fl.n && fl.envoyees > 0 && fl.chargees > 0 && fl.rows.some(r => /envoi \d+ · \d{2}:\d{2}/.test(r[2])) && fl.rows.some(r => /✓ \d{2}:\d{2} · \d+ faute/.test(r[3])));
  await pg.keyboard.press("Escape"); await att(120);
  verif("recopie (1.4.0) : Échap ferme la fenêtre du corrigé, pas la recopie", await pg.evaluate(() => RC.ouvert && document.querySelector("#rcIA").hidden));
  // 1.4.1 (Paul 31/10 : 181, 183, 186, 187) : la bande des fautes
  const kB = await pg.evaluate(id => SC.copies.find(k => rcLignesEcrites(k).some(x => x.id === id)), l0.id);
  await allerCopie(kB); await att(250);
  const n0 = await pg.evaluate(k => scFautes(k).length, kB);
  await pg.click("#rcBandeOuvrir"); await att(200);
  if (n0) { const avis = await pg.locator("#rcBandeAvis").textContent(); await pg.click("#rcBandeCommencer"); await att(150);
    const apres = await pg.evaluate(k => ({ f: scFautes(k).length, anc: Object.keys(scCopie(k).marquesAnciennes || {}).length }), kB);
    verif("recopie (1.4.1) : à l'entrée dans la bande, les " + n0 + " fautes d'avant sont annoncées avec la note, puis mises de côté (gardées, ne comptent plus)", avis.includes(String(n0)) && /Note avant/.test(avis) && apres.f === 0 && apres.anc === n0); }
  const carte = await pg.locator("#rcBandeCarte").textContent(); await cap("C14-29-la-bande");
  await pg.keyboard.press("Enter"); await att(200);
  const oui = await pg.evaluate(k => { const F = scFautes(k); return { n: F.length, bonne: F[0] && F[0].bonne, cle: F[0] && F[0].bande && F[0].bande.cle, fin: document.querySelector("#rcBandeCarte").textContent }; }, kB);
  verif("recopie (1.4.1) : la bande s'arrête sur la faute proposée ; Entrée la garde, avec sa bonne forme, et passe à la suite (" + carte.slice(0, 40) + " · " + oui.fin.slice(0, 50) + ")", /ajouté/.test(carte) && oui.n === 1 && oui.bonne === "ajouté" && !!oui.cle && /Bande finie|✓ Copie corrigée|Il reste le commentaire général/.test(oui.fin) && /note maintenant/.test(oui.fin));   /* [C14 633, 638] au bout, la copie entièrement corrigée le dit */
  await pg.keyboard.press("Backspace"); await att(120); await pg.keyboard.press("n"); await att(200);
  const non = await pg.evaluate(k => { const x = rcArrets(k)[0]; return { n: scFautes(k).length, d: x.l.decisions && x.l.decisions[x.cle] }; }, kB);
  verif("recopie (1.4.1) : Retour revient à l'arrêt ; N enlève la faute gardée et note le refus", non.n === 0 && non.d === "n");
  await pg.keyboard.press("Escape"); await att(200);
  verif("recopie (1.4.1) : Échap ferme la bande et rend la recopie", await pg.evaluate(() => !RC.bd && RC.ouvert && !document.querySelector("#rcEcran").classList.contains("rc-mode-bande")));
  // 1.4.2 (Paul 11:01) : le repérage dans l'encre ; un bouton pour revenir ; changer de copie ferme la bande
  const re2 = JSON.parse(brut); let cibleId = null; re2.copies.forEach(c => c.pages.forEach(q => q.lignes.forEach(l => { if (l.texte === "Deux mots") { l.texte = "Deux mot"; cibleId = l.id; } })));
  await pg.click("#rcImportIA"); await pg.locator("#rcIATexte").fill(JSON.stringify(re2)); await pg.click("#rcIAValider"); await att(300); const msg2 = await pg.locator("#rcIAMessage").textContent(); await pg.click("#rcIAFermer");
  const kC = await pg.evaluate(id => SC.copies.find(k => rcLignesEcrites(k).some(x => x.id === id)), cibleId); await allerCopie(kC); await att(250);
  await pg.click("#rcBandeOuvrir"); await att(200); if (await pg.locator("#rcBandeCommencer").count() && await pg.locator("#rcBandeCommencer").isVisible()) { await pg.click("#rcBandeCommencer"); await att(150); }
  const iC = await pg.evaluate(id => RC.bd.A.findIndex(x => x.id === id), cibleId); await pg.click('#rcBandeListe li[data-i="' + iC + '"]'); await att(150);
  const pl = await pg.evaluate(id => { const a = RC.bd.A.find(x => x.id === id); const q = rcPlaceSeg(a); return { q, x1L: a.l.x1, mot: a.g.eleve }; }, cibleId); await cap("C14-30-bande-dans-l-encre");
  verif("recopie (1.4.2) : la faute « " + pl.mot + " » se place dans l'encre de la ligne, pas d'une poignée à l'autre (" + msg2.slice(0, 20) + " · encre " + (pl.q.encre || []).map(v => v.toFixed(3)).join("-") + " · mot " + pl.q.x0.toFixed(3) + "-" + pl.q.x1.toFixed(3) + ")", /^Chargé/.test(msg2) && pl.q.encre && pl.q.x0 >= pl.q.encre[0] - 1e-6 && pl.q.x1 <= pl.q.encre[1] + 0.013 && pl.q.x1 < pl.x1L - 0.2 && pl.q.x0 > (pl.q.encre[0] + pl.q.encre[1]) / 2 - 0.02);
  await pg.click("#rcBandeRetour"); await att(200); const sorti = await pg.evaluate(() => !RC.bd && RC.ouvert && !document.querySelector("#rcEcran").classList.contains("rc-mode-bande"));
  await pg.click("#rcBandeOuvrir"); await att(200); const autreK = await pg.evaluate(k => SC.copies.find(x => x !== k), kC); await allerCopie(autreK); await att(250);
  const change = await pg.evaluate(k => !RC.bd && RC.copie === k && !document.querySelector("#rcEcran").classList.contains("rc-mode-bande"), autreK);
  verif("recopie (1.4.2) : « ← Revenir à la recopie » sort de la bande ; changer de copie ferme la bande et ouvre la recopie de l'autre élève", sorti && change);
  // 1.4.3 (Paul 11:25 et 12:15) : le type de faute, le cadre qu'on glisse, le clic droit (faute de ma recopie) et Ctrl + Z
  const cible2 = (await pg.evaluate(pid => { for (const k of SC.copies) { const x = rcLignesEcrites(k).find(y => y.pid === pid && y.l.texte === "Deux mots"); if (x) return x.id; } return null; }, derniere.id)) || cibleId;
  const kC2 = await pg.evaluate(id => SC.copies.find(k => rcLignesEcrites(k).some(x => x.id === id)), cible2);
  const re3 = JSON.parse(brut); re3.copies.forEach(c => c.pages.forEach(q => q.lignes.forEach(l => { if (l.id === cible2) l.texte = "Deux beaux mots"; })));
  await allerCopie(kC2); await att(250); await pg.click("#rcImportIA"); await pg.locator("#rcIATexte").fill(JSON.stringify(re3)); await pg.click("#rcIAValider"); await att(300); await pg.click("#rcIAFermer");
  await pg.click("#rcBandeOuvrir"); await att(200); if (await pg.locator("#rcBandeCommencer").count() && await pg.locator("#rcBandeCommencer").isVisible()) { await pg.click("#rcBandeCommencer"); await att(150); }
  const i3 = await pg.evaluate(id => RC.bd.A.findIndex(x => x.id === id), cible2); await pg.click('#rcBandeListe li[data-i="' + i3 + '"]'); await att(150);
  const t3 = await pg.evaluate(() => { const a = RC.bd.A[RC.bd.i], q = rcPlaceSeg(a), m = (q.x0 + q.x1) / 2, tr = q.encre.traits || [], bl = []; for (let i = 0; i + 1 < tr.length; i++) bl.push([tr[i][1], tr[i + 1][0]]); bl.sort((p, r) => (r[1] - r[0]) - (p[1] - p[0]));
    return { nom: q.type.nom, large: q.x1 - q.x0, dans: !!bl.length && m >= bl[0][0] && m <= bl[0][1], haut: q.y1 > q.y0, carte: document.querySelector("#rcBandeCarte").textContent }; });
  await cap("C14-31-mot-manquant");
  verif("recopie (1.4.3) : un mot manquant ne tombe pas sur un mot : un ∧ étroit dans le blanc entre « Deux » et « mots » sur la photo, et la carte dit « Mot manquant » (" + t3.nom + ", " + t3.large.toFixed(3) + ")", t3.nom === "Mot manquant" && t3.large < 0.01 && t3.dans && t3.haut && /Mot manquant/.test(t3.carte));
  // 1.4.4 (Paul 13:41) : le cadre prend la couleur de l'erreur, code de la dictée
  const c4 = await pg.evaluate(() => { const b = RC.bd.boite, d0 = document.querySelector("#rcBandePhoto").getContext("2d").getImageData(Math.round(b.bord) - 2, Math.round(b.ym), 5, 1).data, pxs = [0, 1, 2, 3, 4].map(i => [d0[i * 4], d0[i * 4 + 1], d0[i * 4 + 2]]).sort((u, v) => (u[0] + u[1] + u[2]) - (v[0] + v[1] + v[2])), px = pxs[0], mk = document.querySelector("#rcBandeContexte mark");
    const cas = [["a", "à", "G"], ["lou", "loup", "L"], ["etait", "était", "C"], ["", ",", "P"], ["le", "l ’", "E"], ["ma", "m ’ a", "G"], ["etre", "- être", "C"], ["sest", "s ’ est", "E"], ["très", "", "X"], ["", "loup", "M"], ["mangé", "manger", "G"], ["enfant", "enfants", "G"], ["maizon", "maison", "L"]].map(c => [c[0] + "→" + c[1], rcCodeFaute({ eleve: c[0], corrige: c[1] }), c[2]]);
    return { code: b.code, px: [px[0], px[1], px[2]], fond: mk ? getComputedStyle(mk).backgroundColor : "", chip: (document.querySelector(".rc-bande-type") || {}).textContent || "", li: getComputedStyle(document.querySelector("#rcBandeListe li.on")).borderLeftColor, faux: cas.filter(c => c[1] !== c[2]) }; });
  verif("recopie (1.4.4) : le cadre du mot manquant est de la couleur « Mot manquant » de la dictée (#975a16 ; lu " + c4.px.join(",") + "), le mot dans la ligne et la liste aussi, l'étiquette dit « " + c4.chip + " » (fond " + c4.fond + ", liste " + c4.li + ") ; types : " + (c4.faux.length ? "faux " + JSON.stringify(c4.faux) : "13/13 comme la dictée"),
    c4.code === "M" && Math.abs(c4.px[0] - 0x97) < 30 && Math.abs(c4.px[1] - 0x5a) < 30 && Math.abs(c4.px[2] - 0x16) < 30 && c4.fond === "rgb(254, 243, 199)" && c4.chip === "Mot manquant" && c4.li === "rgb(151, 90, 22)" && !c4.faux.length);
  const cvb = await pg.locator("#rcBandePhoto").boundingBox(), bo = await pg.evaluate(() => ({ a0: RC.bd.boite.a0, a1: RC.bd.boite.a1, w: document.querySelector("#rcBandePhoto").width, x0: rcPlaceSeg(RC.bd.A[RC.bd.i]).x0 }));
  const cx = cvb.x + (bo.a0 + bo.a1) / 2 * cvb.width / bo.w, cy = cvb.y + cvb.height / 2;
  await pg.mouse.move(cx, cy); await pg.mouse.down(); await pg.mouse.move(cx + 40, cy, { steps: 6 }); await pg.mouse.up(); await att(150);
  const gl = await pg.evaluate(() => { const a = RC.bd.A[RC.bd.i]; return { x0: rcPlaceSeg(a).x0, garde: !!(a.l.places && a.l.places[a.cle]) }; });
  verif("recopie (1.4.3) : le cadre se glisse à la souris et garde sa nouvelle place (" + bo.x0.toFixed(3) + " → " + gl.x0.toFixed(3) + ")", gl.x0 > bo.x0 + 0.005 && gl.garde);
  const avR = await pg.evaluate(() => ({ n: RC.bd.A.length, t: RC.bd.A[RC.bd.i].l.texte })), bo2 = await pg.evaluate(() => ({ a0: RC.bd.boite.a0, a1: RC.bd.boite.a1, w: document.querySelector("#rcBandePhoto").width }));
  await pg.mouse.click(cvb.x + (bo2.a0 + bo2.a1) / 2 * cvb.width / bo2.w, cy, { button: "right" }); await att(200);
  const apR = await pg.evaluate(id => ({ n: RC.bd.A.length, t: rcLignesEcrites(RC.bd.k).find(x => x.id === id).l.texte, note: document.querySelector("#rcBandeTouches").textContent }), cible2);
  await pg.keyboard.press("Control+z"); await att(200);
  const reR = await pg.evaluate(id => ({ n: RC.bd.A.length, t: rcLignesEcrites(RC.bd.k).find(x => x.id === id).l.texte }), cible2);
  verif("recopie (1.4.3) : clic droit sur le cadre = faute de ma recopie : la ligne devient « " + apR.t + " », la faute disparaît ; Ctrl + Z la remet (" + avR.n + " → " + apR.n + " → " + reR.n + " arrêts)", apR.t === "Deux beaux mots" && apR.n === avR.n - 1 && /Faute de recopie/.test(apR.note) && reR.t === avR.t && reR.n === avR.n);
  await pg.click("#rcBandeRetour"); await att(150);
  const feuille = await pg.evaluate(id => { const i = document.querySelector('.rc-saisie[data-ligne="' + CSS.escape(id) + '"]'); return i ? i.value : null; }, cible2);
  verif("recopie (1.4.3) : de retour dans la recopie, la feuille montre le texte à jour", feuille === null || feuille === reR.t);
  await pg.setViewportSize({ width: 1536, height: 864 }); await pg.click("#rcFermer"); await att(180);
  verif("recopie (C14 404) : fermer rend le paquet en vignettes", await pg.locator("#scanEcran").isVisible() && !(await pg.locator("#rcEcran").isVisible()) && await pg.evaluate(() => document.getElementById("scanEcran").classList.contains("sc-vue-paquet") && document.querySelectorAll("#scCopie .sc-pq-vig").length >= 7));
  const hubLire = c => pg.evaluate(c => window.__FAUX_HUB_FETCH("https://x.firebasedatabase.app/" + c + ".json").then(r => r.json()), c);
  const av0 = await pg.evaluate(() => ({ chemin: ruCheminCopies().join("/") }));   /* [C14 401] « ↺ Remettre à zéro » (dette ⑤, 1re moitié) est parti avec l'ancien flux ; « 🗑 Tout effacer » de la fenêtre du corrigé reste (1.4.9) */
  // dette ⑤, 2e moitié : une copie effacée au site (ailleurs) quitte la page ouverte ; un geste sur elle ne réécrit pas l'ancienne
  const k3 = await pg.evaluate(async ([ch, garde]) => { const tous = await window.__FAUX_HUB_FETCH("https://x.firebasedatabase.app/" + ch + ".json").then(r => r.json()) || {};
    window.EventSource = class { constructor() { window.__es = this; this.l = {}; } addEventListener(t, f) { this.l[t] = f; } close() {} };
    ruAbonner(); window.__es.l.put({ data: JSON.stringify({ path: "/", data: tous }) });
    const C = SC.copies.filter(x => x !== garde && tous[x]).sort((a, b) => rcLignesEcrites(a).length - rcLignesEcrites(b).length), k = C[0];   /* jamais une copie que la suite recopie : celle qui a le moins de lignes */
    return { k, id: tous[k] && tous[k].id, m: Object.keys(((tous[k] || {}).scan || {}).marques || {}).length }; }, [av0.chemin, kC2]);
  await pg.evaluate(([ch, k]) => window.__FAUX_HUB_FETCH("https://x.firebasedatabase.app/" + ch + "/" + k + ".json", { method: "DELETE" }).then(() => window.__es.l.put({ data: JSON.stringify({ path: "/" + k, data: null }) })), [av0.chemin, k3.k]);
  const oublie = await pg.evaluate(k => ruVierge(state.copies[k]), k3.k);
  /* [C14 404] le geste sur la copie effacée : une ligne recopiée, depuis sa vignette */
  await pg.locator('#scCopie .sc-pq-el[data-k="' + k3.k + '"] .sc-pq-vig').first().click(); await att(700);
  const surK3 = await pg.evaluate(k => RC.ouvert && RC.copie === k, k3.k); await pg.locator(".rc-saisie").first().click(); await pg.keyboard.press("End"); await pg.keyboard.type(" neuve"); await pg.keyboard.press("Enter"); await att(1800);
  const h3 = await hubLire(av0.chemin + "/" + k3.k); await pg.click("#rcFermer"); await att(250);
  verif("dette ⑤ : une copie effacée au site pendant que la page est ouverte (" + k3.m + " marques) quitte la page ; un geste sur elle y écrit une copie neuve, jamais l'ancienne (au site : " + (h3 ? "id " + (h3.id === k3.id ? "ancien" : "neuf") + ", " + Object.keys(((h3 || {}).scan || {}).marques || {}).length + " marques" : "rien") + ")",
    !!k3.k && oublie && surK3 && !!h3 && h3.id !== k3.id && !Object.keys((h3.scan || {}).marques || {}).length && Object.values((((h3.scan || {}).recopie || {}).pages) || {}).some(p => Object.values(p.lignes || {}).some(l => / neuve$/.test(l.texte || ""))));
  await pg.evaluate(() => { try { RU.flux = null; } catch (e) {} window.EventSource = undefined; });
  // 1.4.5 (Paul 14:16 et 14:46) : un arrêt par mot ; un arrêt déjà décidé qui prenait deux mots (copie d'avant) est coupé, ses marques suivent
  await pg.click("#btnRecopier"); await att(300); await allerCopie(kC2); await att(250);
  const pid5 = await pg.evaluate(id => { const x = rcLignesEcrites(RC.copie).find(y => y.id === id); if (x && RC.page !== x.pid) rcActiverPage(x.pid); return x ? x.pid : null; }, cible2); await att(200);
  const champ5 = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + cible2 + '"]'); await champ5.scrollIntoViewIfNeeded(); await champ5.fill("Mes camarades et moi se plaint"); await att(300);
  const [dl5] = await Promise.all([pg.waitForEvent("download"), pg.click("#rcExportIA")]); const brut5 = fs.readFileSync(await dl5.path(), "utf8");   // 1.4.10 : la ligne retapée repart chez l'IA
  const re5 = JSON.parse(brut5); let trouve5 = false; re5.copies.forEach(c => c.pages.forEach(q => q.lignes.forEach(l => { if (l.id === cible2) { l.texte = "Mes camarades et moi nous plaignons"; trouve5 = true; } })));
  await pg.click("#rcImportIA"); await pg.locator("#rcIATexte").fill(JSON.stringify(re5)); await pg.click("#rcIAValider"); await att(300); await pg.click("#rcIAFermer");
  // la copie telle qu'une 1.4.4 l'a laissée : l'arrêt « se plaint → nous plaignons » dit « oui », une seule marque, un cadre glissé
  const av5 = await pg.evaluate(id => { const k = RC.copie, x = rcLignesEcrites(k).find(y => y.id === id), r = rcEcartsBruts(x.l.texte, x.l.corrige), g = r.segs.find(u => u.eleve === "se plaint"); if (!g) return null;
    const cle = rcCle(g), a = { k, pid: x.pid, id, l: x.l, g, cle }, q = rcPlaceSeg(a), s = scCopie(k), place = { x0: q.x0 - 0.004, x1: q.x1 - 0.004 };
    const m = { page: x.pid, forme: "faute", sens: "lieu", passe: "langue", point: "orthographe", q: null, x0: place.x0, x1: place.x1, y0: q.y0, y1: q.y1, bonne: g.corrige, bande: { ligne: id, cle, eleve: g.eleve, corrige: g.corrige, type: "Mot faux", code: "L" } };
    m.id = scId("marque"); m.eleve = k; m.creeLe = m.modifieLe = new Date().toISOString(); s.marques[m.id] = m;
    rcLigneMaj(k, x.pid, id, l => { l.decisions = Object.assign({}, l.decisions, { [cle]: "o" }); l.marquesBande = Object.assign({}, l.marquesBande, { [cle]: m.id }); l.places = Object.assign({}, l.places, { [cle]: place }); });
    scNumeroter(k); saveState(); return { cle, mk: m.id, place, fautes: Object.values(s.marques).filter(z => z.forme === "faute").length }; }, cible2);
  await pg.click("#rcBandeOuvrir"); await att(250); if (await pg.locator("#rcBandeCommencer").count() && await pg.locator("#rcBandeCommencer").isVisible()) { await pg.click("#rcBandeCommencer"); await att(150); }
  const ap5 = await pg.evaluate(([id, av]) => { const k = RC.copie, x = rcLignesEcrites(k).find(y => y.id === id), s = scCopie(k), D = x.l.decisions || {}, M = x.l.marquesBande || {}, P = x.l.places || {};
    const arr = RC.bd.A.filter(a => a.id === id).map(a => a.g.eleve + "→" + a.g.corrige), ms = Object.values(M).map(i => s.marques[i]).filter(Boolean);
    return { arr, d: [D["4-5/4-5"], D["5-6/5-6"], D[av.cle] || null], ancienne: !!s.marques[av.mk], marques: ms.map(m => m.bande.eleve + ":" + m.bande.code), dedans: Object.keys(P).filter(c => c !== av.cle).every(c => P[c].x0 >= av.place.x0 - 1e-9 && P[c].x1 <= av.place.x1 + 1e-9) && Object.keys(P).filter(c => c !== av.cle).length === 2,
      fautes: Object.values(s.marques).filter(z => z.forme === "faute").length }; }, [cible2, av5]);
  await cap("C14-32-un-arret-par-mot");
  verif("recopie (1.4.5) : « se plaint → nous plaignons » donne deux arrêts (" + ap5.arr.join(" ; ") + ") ; sur une copie d'avant où il était un seul arrêt dit « oui », il est coupé : chaque mot garde le « oui » (" + ap5.d.join(", ") + "), la marque unique devient " + ap5.marques.length + " marques (" + ap5.marques.join(", ") + "), les deux cadres restent dans celui que tu avais glissé ; fautes " + av5.fautes + " → " + ap5.fautes,
    trouve5 && !!av5 && ap5.arr.join("|") === "se→nous|plaint→plaignons" && ap5.d[0] === "o" && ap5.d[1] === "o" && ap5.d[2] === null && !ap5.ancienne && ap5.marques.length === 2 && ap5.dedans && ap5.fautes === av5.fautes + 1);
  // 1.4.6 (Paul 15:12) : le cadre ignore les jambages de la ligne du dessus. La photo reçoit, au-dessus du mot visé, la queue d'un « p » de la ligne
  // du dessus (qui descend jusqu'à 0,66 interligne au-dessus de la ligne) et, sous elle, séparée par un blanc, la hampe d'un « l » du mot.
  const i6 = await pg.evaluate(id => RC.bd.A.findIndex(a => a.id === id && a.g.eleve === "plaint"), cible2); await pg.click('#rcBandeListe li[data-i="' + i6 + '"]'); await att(150);
  const t6 = await pg.evaluate(async () => { const a = RC.bd.A[RC.bd.i], im = SC.imgs[a.pid], d = RC.documents[a.pid] || ((scCopie(a.k).recopie || {}).pages || {})[a.pid], pas = rcPasDoc(d), L = a.l, q0 = rcPlaceSeg(a);
    const cv = document.createElement("canvas"); cv.width = im.w; cv.height = im.h; const c = cv.getContext("2d"); c.drawImage(im.el, 0, 0);
    const xm = (q0.x0 + q0.x1) / 2 * im.w, base = Math.max(L.y0, L.y1) * im.h, P = pas * im.h; c.strokeStyle = "#1d3fa8"; c.lineWidth = Math.max(2, P * 0.06); c.lineCap = "round";
    c.beginPath(); c.moveTo(xm - P * 0.1, base - P * 1.2); c.quadraticCurveTo(xm, base - P * 0.9, xm - P * 0.05, base - P * 0.52); c.stroke();   // la queue d'un « p » de la ligne du dessus, qui descend loin
    c.beginPath(); c.arc(xm + P * 0.02, base - P * 0.16, P * 0.13, 0, 2 * Math.PI); c.stroke();   // un « o » du mot, sans hampe
    c.save(); c.strokeStyle = "#7d6fc4"; c.lineWidth = Math.max(1, P * 0.03); for (let gx = xm - 3 * P; gx <= xm + 3 * P; gx += P * 0.9) { c.beginPath(); c.moveTo(gx, base - P * 2); c.lineTo(gx, base + P); c.stroke(); } c.beginPath(); c.moveTo(xm + P * 0.02, base - P * 2); c.lineTo(xm + P * 0.02, base + P); c.stroke(); c.restore();   // les traits verticaux du cahier, dont un à travers le « o »
    const ancien = im.el, el = new Image(); await new Promise(r => { el.onload = r; el.src = cv.toDataURL("image/png"); }); im.el = el; RC.encre = {};
    const q = rcPlaceSeg(a); im.el = ancien; RC.encre = {}; return { haut: (base - q.y0 * im.h) / P, queue: 0.52 }; });
  verif("recopie (1.4.7) : la queue d'une lettre de la ligne du dessus descend jusqu'au-dessus du mot visé, et les traits verticaux du cahier traversent la bande, dont un à travers le mot : le cadre s'arrête au haut des lettres du mot (" + t6.haut.toFixed(2) + " interligne au-dessus de la ligne), sous la queue (" + t6.queue + ")", t6.haut > 0.25 && t6.haut < t6.queue - 0.02);
  // 1.4.11 (Paul 15:41) : la bande en continu ; le texte et la photo en ruban, le mot de l'arrêt au milieu ; d'un arrêt à l'autre, le ruban glisse
  const ruban = async () => { await att(320); return pg.evaluate(() => { const ctx = document.querySelector("#rcBandeContexte"), b = ctx.querySelector(".rc-ruban"), m = ctx.querySelector(".rc-ruban-t mark"), R = RC.bd.ruban, a = RC.bd.A[RC.bd.i];
    const rb = b.getBoundingClientRect(), mb = m ? m.getBoundingClientRect() : null, cur = R && R.lignes.find(l => l.id === a.id);
    return { lignes: ctx.querySelectorAll(".rc-ruban-l").length, ecrites: rcLignesEcrites(RC.bd.k).length, ecart: mb ? Math.abs((mb.left + mb.width / 2) - (rb.left + rb.width / 2)) : 999, photo: R ? R.lignes.length : 0, dedans: !!cur && cur.X <= R.centre && cur.X + cur.W >= R.centre, id: a.id + "|" + a.cle, n: a.n }; }); };
  const r15a = await ruban();
  const i15 = await pg.evaluate(cle => { const j = RC.bd.A.findIndex(a => a.id + "|" + a.cle !== cle && a.id !== cle.split("|")[0]); return j >= 0 ? j : RC.bd.A.findIndex(a => a.id + "|" + a.cle !== cle); }, r15a.id); if (i15 >= 0) await pg.click('#rcBandeListe li[data-i="' + i15 + '"]');
  const r15b = await ruban(); await cap("C14-38-bande-en-continu");
  verif("recopie (1.4.11) : la bande en continu : le texte recopié de toute la copie (" + r15a.lignes + " lignes sur " + r15a.ecrites + ") et la photo de toutes ses lignes bout à bout (" + r15a.photo + ") en un seul ruban, le mot de l'arrêt au milieu (à " + Math.round(r15a.ecart) + " point" + (r15a.ecart >= 2 ? "s" : "") + " près) ; à un autre arrêt (ligne " + r15a.n + " → " + r15b.n + "), le ruban a glissé et le mot est encore au milieu (à " + Math.round(r15b.ecart) + " près)",
    r15a.lignes === r15a.ecrites && r15a.photo === r15a.ecrites && r15a.ecart <= 3 && r15a.dedans && i15 >= 0 && r15b.id !== r15a.id && r15b.ecart <= 3 && r15b.dedans);
  // 1.4.12 (C14 183 « ⇧R = la dictée », C14 196 : F = faute, Entrée et Espace = le mot est correct) : le mot par mot, dans la bande
  const mpm = () => pg.evaluate(() => { const B = RC.bd, w = B.W && B.W[B.j], s = scCopie(B.k), ms = Object.values(s.marques);
    return { mot: !!B.mot, j: B.j, i: B.i, n: B.W ? B.W.length : 0, id: w && w.id, m: w && w.m, ia: !!(w && w.ia), oub: ms.filter(m => m.bande && m.bande.oubliee), fautes: ms.filter(m => m.forme === "faute").length,
      titre: document.querySelector("#rcBandeTitre").textContent, mode: (document.querySelector("#rcBandeTouches .rc-bande-mode") || {}).textContent || "", arret: JSON.stringify(((s.recopie || {}).bandeArret) || null) }; });
  await pg.click('#rcBandeListe li[data-i="0"]'); await att(200);
  const a16 = await pg.evaluate(() => { const a = RC.bd.A[RC.bd.i]; return { id: a.id, de: a.g.de, d: a.l.decisions && a.l.decisions[a.cle] }; });
  await pg.keyboard.press("Shift+R"); await att(250); const m0 = await mpm();
  for (const t of ["Backspace", "Backspace", "Backspace"]) { await pg.keyboard.press(t); await att(110); } const m0b = await mpm();
  await pg.keyboard.press("Enter"); await att(110); await pg.keyboard.press("Enter"); await att(110); await pg.keyboard.press(" "); await att(200); const m1 = await mpm();
  const c16 = await pg.evaluate(() => { const B = RC.bd, rb = document.querySelector("#rcBandeContexte .rc-ruban").getBoundingClientRect();
    for (const sp of document.querySelectorAll("#rcBandeContexte .rc-mot[data-id]")) { const r = sp.getBoundingClientRect(), j = B.W.findIndex(w => w.id === sp.dataset.id && w.m === +sp.dataset.m), w = B.W[j];
      if (w && !w.ia && j !== B.j && /[a-zà-ÿ]{3,}/i.test(w.g.eleve) && r.left > rb.left + 30 && r.right < rb.right - 30) return { id: w.id, m: w.m, j }; } return null; });
  if (c16) await pg.click('#rcBandeContexte .rc-mot[data-id="' + c16.id + '"][data-m="' + c16.m + '"]'); await att(220); const m2 = await mpm();
  await pg.keyboard.press("f"); await att(250); const m3 = await mpm();
  await pg.keyboard.press("Backspace"); await att(300); await cap("C14-40-bande-mot-par-mot");
  await pg.keyboard.press("f"); await att(250); const m4 = await mpm();
  await pg.click('#rcBandeListe li[data-i="0"]'); await att(200); await pg.keyboard.press("Shift+R"); await att(220); const m5 = await mpm();
  const dec16 = () => pg.evaluate(() => { const a = RC.bd.A[0], mk = a.l.marquesBande && a.l.marquesBande[a.cle], m = mk && scCopie(RC.bd.k).marques[mk]; return { d: a.l.decisions && a.l.decisions[a.cle] || null, code: m && m.bande ? m.bande.code : null, fautes: Object.values(scCopie(RC.bd.k).marques).filter(z => z.forme === "faute").length }; });
  await pg.keyboard.press("F"); await att(250); const e1 = await dec16(), j16 = (await mpm()).j; if (j16 !== m5.j) { await pg.keyboard.press("Backspace"); await att(150); } await pg.keyboard.press("F"); await att(250); const e2 = await dec16();   // F sur une faute gardée la refuse et reste ; sur une faute pas gardée, la garde et avance
  const ia16 = e1.d === "o" ? e1 : e2, non16 = e1.d === "o" ? e2 : e1;
  await pg.keyboard.press("Shift+R"); await att(220); const m7 = await mpm();
  await pg.keyboard.press("Shift+R"); await att(200); await pg.keyboard.press("Backspace"); await att(200); const m8 = await mpm();
  await pg.click("#rcBandeOuvrir"); await att(250); await pg.click("#rcBandeOuvrir"); await att(450); const m9 = await mpm();
  await pg.keyboard.press("Shift+R"); await att(200); const m10 = await mpm();
  verif("recopie (1.4.12) : ⇧R passe la bande en mot par mot (titre « " + m0.titre.split(" · ").pop() + " », touches « " + m0.mode + " »), sur le mot de l'arrêt (" + (m0.id === a16.id && m0.m === a16.de) + ") ; Retour trois fois, puis Entrée, Entrée, Espace : 3 mots passés (" + (m1.j - m0b.j) + "), aucune faute posée (" + m0.fautes + " → " + m1.fautes + ") ; un clic sur un mot du texte y amène la bande (" + (!!c16 && m2.j === c16.j) + ") ; F sur ce mot, que l'IA n'avait pas proposé : une faute oubliée par l'IA, grise et sans type (" + (m3.oub.length - m2.oub.length) + ", type " + JSON.stringify(m3.oub.length ? m3.oub[m3.oub.length - 1].bande.code : "?") + "), fautes " + m2.fautes + " → " + m3.fautes + ", mot suivant ; Retour puis F la retire (" + m4.oub.length + ", fautes " + m4.fautes + ")",
    m0.mot && /mot par mot/.test(m0.titre) && m0.mode === "Mot par mot" && m0.id === a16.id && m0.m === a16.de && m0b.j === m0.j - 3 && m1.j === m0b.j + 3 && m1.fautes === m0.fautes && !!c16 && m2.j === c16.j && m3.oub.length === m2.oub.length + 1 && m3.oub[m3.oub.length - 1].bande.code === null && m3.fautes === m2.fautes + 1 && m3.j === m2.j + 1 && m4.oub.length === m2.oub.length && m4.fautes === m2.fautes && m4.j === m2.j);
  verif("recopie (1.4.12) : en mot par mot, F sur un mot d'une faute proposée par l'IA la garde avec son type (« " + ia16.d + " », " + ia16.code + "), encore F la refuse (« " + non16.d + " », fautes " + non16.fautes + " → " + ia16.fautes + ") ; ⇧R revient aux arrêts (" + !m7.mot + ") ; fermée puis rouverte, la bande reprend en mot par mot au même mot (" + (m9.mot && m9.id === m8.id && m9.m === m8.m) + ", gardé dans la copie : " + /"mot":true/.test(m8.arret) + ") ; ⇧R, retour aux arrêts (" + !m10.mot + ")",
    m5.mot && m5.ia && ia16.d === "o" && !!ia16.code && non16.d === "n" && ia16.fautes === non16.fautes + 1 && !m7.mot && m8.mot && /"mot":true/.test(m8.arret) && m9.mot && m9.id === m8.id && m9.m === m8.m && !m10.mot);
  // 1.4.12 (Paul 23:09 : « si je viens retoucher une recopie après avoir validé l'erreur dans la bande, il faut que ce soit rétroactif bien sûr. Une modif change partout. »)
  await pg.keyboard.press("Escape"); await att(300);
  const r17 = () => pg.evaluate(id => { const x = rcLignesEcrites(RC.copie).find(y => y.id === id), s = scCopie(RC.copie), A = rcArrets(RC.copie).filter(a => a.id === id);
    return { texte: x.l.texte, de: x.l.corrigeDe, arrets: A.map(a => a.g.eleve + "→" + a.g.corrige + ":" + ((x.l.decisions || {})[a.cle] || "")).join(" | "), marques: Object.values(x.l.marquesBande || {}).filter(m => s.marques[m]).map(m => s.marques[m].bande.eleve).sort().join(","), fautes: Object.values(s.marques).filter(m => m.forme === "faute").length, aExporter: rcCopieACorriger(RC.copie) }; }, cible2);
  const av17 = await r17(), champ17 = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + cible2 + '"]'); await champ17.scrollIntoViewIfNeeded();
  await champ17.fill(av17.texte.replace("camarades", "camarade")); await champ17.press("Tab"); await att(350); const ap17 = await r17();
  await champ17.fill(ap17.texte.replace(" se ", " ce ")); await champ17.press("Tab"); await att(350); const ap17b = await r17();
  await champ17.fill(av17.texte); await champ17.press("Tab"); await att(350); const fin17 = await r17();
  verif("recopie (1.4.12) : une ligne retapée après la bande (« " + av17.arrets + " ») : un autre mot retapé (« camarades » → « camarade ») garde tes réponses et leurs marques (« " + ap17.arrets + " », marques " + ap17.marques + ", fautes " + av17.fautes + " → " + ap17.fautes + ") et le mot nouveau devient un arrêt ; le mot d'une réponse retapé (« se » → « ce ») perd sa marque (marques " + ap17b.marques + ", fautes " + ap17b.fautes + ") ; la copie ne repart pas chez l'IA (" + !ap17.aExporter + ") ; le texte remis : « " + fin17.arrets + " »",
    /se→nous:o/.test(av17.arrets) && /plaint→plaignons:o/.test(av17.arrets) && /camarade→camarades:(\s|$)/.test(ap17.arrets + " ") && /se→nous:o/.test(ap17.arrets) && /plaint→plaignons:o/.test(ap17.arrets) && ap17.marques === "plaint,se" && ap17.fautes === av17.fautes && ap17.de === ap17.texte && !ap17.aExporter
    && /ce→nous:(\s|$)/.test(ap17b.arrets + " ") && ap17b.marques === "plaint" && ap17b.fautes === av17.fautes - 1 && /se→nous:(\s|$)/.test(fin17.arrets + " ") && /plaint→plaignons:o/.test(fin17.arrets) && fin17.texte === av17.texte);
  await pg.click("#rcBandeOuvrir"); await att(450);
  // 1.4.12 (C14 322, acquis) : un cadre glissé pour la première fois garde aussi la place où l'app l'avait posé
  { const i21 = await pg.evaluate(() => RC.bd.A.findIndex(a => !(a.l.places && a.l.places[a.cle]) && !(a.l.placesApp && a.l.placesApp[a.cle])));
    if (i21 >= 0) { await pg.click('#rcBandeListe li[data-i="' + i21 + '"]'); await att(200); }
    const av21 = await pg.evaluate(() => { const a = RC.bd.A[RC.bd.i]; return { cle: a.cle, q: (({ x0, x1 }) => ({ x0, x1 }))(rcPlaceSeg(a)) }; });
    await pg.keyboard.press("ArrowRight"); await att(150); await pg.keyboard.press("ArrowRight"); await att(200);
    const ap21 = await pg.evaluate(cle => { const a = RC.bd.A[RC.bd.i]; return { app: a.l.placesApp && a.l.placesApp[cle], ici: a.l.places && a.l.places[cle] }; }, av21.cle);
    verif("recopie (1.4.12) : un cadre glissé pour la première fois (deux fois →) garde la place où l'app l'avait posé (" + (ap21.app ? ap21.app.x0.toFixed(3) : "—") + ") à côté de la tienne (" + (ap21.ici ? ap21.ici.x0.toFixed(3) : "—") + ") : la mesure se fera sur ton travail",
      i21 >= 0 && !!ap21.app && Math.abs(ap21.app.x0 - av21.q.x0) < 1e-9 && !!ap21.ici && Math.abs(ap21.ici.x0 - av21.q.x0 - 0.008) < 1e-6); }
  // 1.4.7 (Paul 15:41) : la bande se rouvre à l'arrêt où l'on était, après l'avoir fermée, puis après un rechargement de la page
  const i8 = await pg.evaluate(id => RC.bd.A.findIndex(a => a.id === id && a.g.eleve === "se"), cible2); await pg.click('#rcBandeListe li[data-i="' + i8 + '"]'); await att(200);
  const vise8 = await pg.evaluate(() => { const a = RC.bd.A[RC.bd.i]; return a.id + "|" + a.cle; });
  await pg.click("#rcBandeRetour"); await att(200); await pg.click("#rcBandeOuvrir"); await att(250);
  const rouvre8 = await pg.evaluate(() => RC.bd ? RC.bd.A[RC.bd.i].id + "|" + RC.bd.A[RC.bd.i].cle : null);
  await att(1500); await pg.reload(); await att(6000);
  const recharge8 = await pg.evaluate(() => ({ bande: !!(typeof RC !== "undefined" && RC.bd), ici: RC.bd && RC.bd.A[RC.bd.i] ? RC.bd.A[RC.bd.i].id + "|" + RC.bd.A[RC.bd.i].cle : null, mot: RC.bd && RC.bd.A[RC.bd.i] ? RC.bd.A[RC.bd.i].g.eleve : null }));
  await cap("C14-35-bande-rechargee");
  verif("recopie (1.4.7) : la bande se rouvre à l'arrêt où tu étais (« se → nous », pas le premier non décidé) : après l'avoir fermée (" + (rouvre8 === vise8) + "), et après un rechargement de la page, bande ouverte au même mot (« " + recharge8.mot + " »)", rouvre8 === vise8 && recharge8.bande && recharge8.ici === vise8);
  await pg.click("#rcBandeRetour"); await att(150);
  // 1.4.7 (Paul 15:33 et 15:41) : le zoom cranté de la seule ligne en grand ; la photo et les lignes vertes ne bougent jamais ; la ligne reste entière
  const lignes9 = () => pg.evaluate(() => { const b = rcBloc(RC.page), r = b.querySelector(".rc-image").getBoundingClientRect(); return JSON.stringify([Math.round(r.width), Math.round(r.height)].concat(Array.from(b.querySelectorAll(".rc-trait")).slice(0, 6).map(t => { const q = t.getBoundingClientRect(); return [Math.round(q.left - r.left), Math.round(q.top - r.top)]; }))); });
  const av9 = await lignes9(), h9a = await pg.evaluate(() => RC.bande ? RC.bande.hauteur : 0);
  await pg.click("#rcZoomPlus"); await att(250);   // [1.4.14] ×1 va déjà de la marge rouge au bord de la copie : un cran suffit à faire passer la bande sur toute la largeur de l'écran
  const ap9 = await lignes9(), z9 = await pg.evaluate(() => { const cv = document.querySelector("#rcAgrandie"), l = rcCourante(), im = SC.imgs[RC.page], B = RC.bande, ap = document.querySelector(".rc-apercu");
    const larg = (l.x1 - l.x0 + 0.02) * im.w * (B.hauteur / (2 * Math.max(0.012, Math.min(0.035, rcPasDoc(rcDocument(RC.page)) * 0.55)) * im.h));
    return { cran: document.querySelector("#rcZoomCran").textContent, h: B.hauteur, entiere: B.gauche + B.debut * B.largeur >= -1 && B.gauche + B.fin * B.largeur <= cv.width + 2 && B.fin >= Math.min(1, l.x1 + 0.01) - 1e-9, defile: ap.scrollWidth > ap.clientWidth + 1 || document.querySelector("#rcEcran").scrollWidth > document.querySelector("#rcEcran").clientWidth + 1, garde: (() => { try { return localStorage.getItem("mjpc_rc_zoom_bande"); } catch (e) { return null; } })() }; });
  await cap("C14-33-zoom-ligne-en-grand");
  await pg.click("#rcZoomMoins"); await att(200); const re9 = await lignes9(), h9r = await pg.evaluate(() => RC.bande ? RC.bande.hauteur : 0);
  verif("recopie (1.4.7) : le zoom cranté de la ligne en grand (" + z9.cran + ") la grossit (" + Math.round(h9a) + " → " + Math.round(z9.h) + " px de haut), entière, sans barre de défilement ; la photo et les lignes vertes n'ont pas bougé d'un point (" + (av9 === ap9) + ") ; gardé dans ce navigateur ; − revient à ×1 (" + Math.round(h9r) + " px)",
    z9.cran === "×1,5" && z9.h > h9a * 1.2 && z9.entiere && !z9.defile && av9 === ap9 && z9.garde === "1.5" && Math.abs(h9r - h9a) < 1 && re9 === av9);
  await pg.click("#rcFermer"); await att(180);
  // 1.4.6 (Paul 15:18) : la page 2 d'une copie, préparée avant que sa photo soit prête, trouve son trait rouge dès que la photo arrive
  const k7 = await pg.evaluate(() => { for (const k of SC.copies) { const P = scPagesDe(k), r = ((scCopie(k).recopie || {}).pages) || {}; if (P.length >= 2 && !r[P[1].id]) return { k, i: SC.copies.indexOf(k), p2: P[1].id }; } return null; });
  let t7 = { avant: null, apres: null };
  if (k7) { await pg.locator('#scCopie .sc-pq-el[data-k="' + k7.k + '"] .sc-pq-vig').first().click(); await att(500); await pg.click("#rcFermer"); await att(300);   /* [C14 404] la copie choisie par sa vignette */
    await pg.evaluate(p2 => { window.__el7 = SC.imgs[p2].el; SC.imgs[p2].el = new Image(); }, k7.p2);   // la photo pas encore prête
    await pg.click("#btnRecopier"); await att(400);
    t7.avant = await pg.evaluate(p2 => !!(rcBloc(p2) && rcBloc(p2).querySelector(".rc-marge-trait")), k7.p2);
    await pg.evaluate(p2 => { SC.imgs[p2].el = window.__el7; const img = rcBloc(p2).querySelector(".rc-image"), u = img.src; img.removeAttribute("src"); img.src = u; }, k7.p2); await att(500);   // la photo arrive
    t7.apres = await pg.evaluate(p2 => !!(rcBloc(p2) && rcBloc(p2).querySelector(".rc-marge-trait")), k7.p2);
    await cap("C14-34-marge-page-2"); await pg.click("#rcFermer"); await att(180); }
  verif("recopie (1.4.6) : une page préparée avant que sa photo soit prête n'a pas de trait rouge (" + t7.avant + ") ; la photo arrivée, son trait rouge apparaît (" + t7.apres + ")", !!k7 && t7.avant === false && t7.apres === true);
  // 1.4.12 (Paul 23:09 : « à la fin d'une recopie je dois pouvoir surligner facilement la phrase qui m'a marqué […] Si pas de phrase, pas de phrase ( coche pas de phrase ).
  // Cette phase là marque la fin d'une recopie. »)
  const k19 = await pg.evaluate(() => SC.copies.find(k => Object.values(scCopie(k).marques).some(m => m.bande && m.bande.code)));
  await pg.click("#btnRecopier"); await att(400); if (await pg.evaluate(k => RC.copie !== k, k19)) { await allerCopie(k19); await att(300); }
  const fl19a = (await pg.locator("#rcIAEtat").textContent()) || "";
  const deja19 = await pg.evaluate(k => rcFluxCopie(k).finie, k19), cptPh = t => { const m = String(t).match(/la phrase qui m’a marqué : (\d+) sur (\d+)/); return m ? +m[1] : null; };
  // 1.4.12 (exigences du 29/10 : « Je veux max 30 clics par copie » ; « mesurer le gain ») : le temps et les gestes de chaque copie, comptés seuls
  await pg.click("#rcFluxOuvrir"); await att(200); const tg19 = await pg.evaluate(k => { const f = rcFluxCopie(k), tr = document.querySelector('#rcFluxTable tr[data-k="' + CSS.escape(k) + '"]'); return { t: f.temps, g: f.gestes, cell: tr ? tr.lastElementChild.textContent : "" }; }, k19); await pg.click("#rcFluxFermer"); await att(100);
  verif("recopie (1.4.12) : le flux compte seul, pour chaque copie, le temps de recopie, le temps de bande et les gestes (« " + tg19.cell + " »)", !!tg19.t && tg19.t.bande > 0 && tg19.t.recopie > 0 && !!tg19.g && tg19.g.bande >= 5 && /gestes/.test(tg19.cell));
  // [C14 403] le chrono de la copie affichée, en haut de la recopie : il compte seul, au geste, sans toucher au focus ; le total de la classe sous le flux
  const ch0 = await pg.evaluate(() => ({ txt: document.getElementById("rcChrono").textContent, r: ((scCopie(RC.copie).recopie || {}).temps || {}).recopie || 0, titre: document.getElementById("rcChrono").title }));
  await pg.click("#rcLargeur"); await att(1300); await pg.locator(".rc-saisie").first().click(); await att(100); const foc0 = await pg.evaluate(() => document.activeElement && document.activeElement.className);
  await pg.click("#rcLargeur"); await att(150);
  const ch1 = await pg.evaluate(() => { const T = (scCopie(RC.copie).recopie || {}).temps || {}, c = s => { s = Math.floor((s || 0) / 1000); return s < 60 ? s + " s" : Math.floor(s / 60) + " min"; }; return { txt: document.getElementById("rcChrono").textContent, attendu: "⏱ recopie " + c(T.recopie) + " · bande " + c(T.bande), r: T.recopie || 0 }; });
  await pg.locator(".rc-saisie").first().click(); await att(80); await pg.keyboard.press("End"); await att(1100); await pg.keyboard.press("End"); await att(120);
  const foc1 = await pg.evaluate(() => ({ cl: document.activeElement && document.activeElement.className, txt: document.getElementById("rcChrono").textContent }));
  await cap("C14-403-chrono-recopie");
  await pg.click("#rcFluxOuvrir"); await att(200);
  const tot = await pg.evaluate(() => { const F = SC.copies.map(rcFluxCopie), S = F.reduce((s, f) => { const T = f.temps || {}, G = f.gestes || {}; s.r += T.recopie || 0; s.b += T.bande || 0; s.g += (G.recopie || 0) + (G.bande || 0); return s; }, { r: 0, b: 0, g: 0 }), tf = document.querySelector("#rcFluxTable tfoot"); return { txt: tf ? tf.textContent : "", attendu: "Toute la classerecopie " + rcDuree(S.r) + " · bande " + rcDuree(S.b) + " · " + S.g + " geste" + (S.g > 1 ? "s" : "") }; });
  await cap("C14-403-flux-total"); await pg.click("#rcFluxFermer"); await att(100);
  // [C14 407] l'aide « ? » de la recopie et de la bande : seulement ce qui reste
  const aide407 = async () => { await pg.click(".rp-aide-btn"); await att(250); const x = await pg.evaluate(() => { const a = document.getElementById("ruAide"); return a && !a.hidden ? a.innerText : ""; }); return x; };
  const a407r = await aide407(); await cap("C14-407-aide-recopie"); await pg.click(".rp-aide-btn"); await att(150);
  await pg.click("#rcBandeOuvrir"); await att(400); const a407b = await aide407(); await cap("C14-407-aide-bande"); await pg.click(".rp-aide-btn"); await att(150);
  await pg.click("#rcBandeRetour"); await att(250); const a407r2 = await pg.evaluate(() => AIDE.courant);
  const vieux407 = /pinceau|passe de la|les questions|récapitulatif|interrogatif|mode test/i;
  verif("aide (C14 407) : « ? » dans la recopie : « " + a407r.split("\n")[0] + " », " + (a407r.match(/\n/g) || []).length + " lignes (dont « ⇪ Exporter pour l'IA », « 📷 La photo », « ⏱ ») ; dans la bande : « " + a407b.split("\n")[0] + " » (Entrée, N, ⇧ R, ＋ Un sticker, les remarques) ; rien de l'ancien flux ; revenue à la recopie, l'aide la suit (" + a407r2 + ")",
    /^Recopier/.test(a407r) && /Exporter pour l'IA/.test(a407r) && /La photo/.test(a407r) && /⏱/.test(a407r) && /^La bande/.test(a407b) && /⇧ R/.test(a407b) && /Un sticker/.test(a407b) && /remarques/.test(a407b) && !vieux407.test(a407r + a407b) && a407r2 === "recopie");
  verif("recopie (C14 403) : en haut de la recopie, « " + ch1.txt + " » pour la copie affichée, compté seul au geste (" + Math.round(ch0.r / 1000) + " s → " + Math.round(ch1.r / 1000) + " s), le focus reste dans la ligne (« " + foc1.txt + " ») ; sous le flux : « " + tot.txt + " »",
    /^⏱ recopie \d+ (s|min) · bande \d+ (s|min)$/.test(ch1.txt) && ch1.txt === ch1.attendu && ch1.r > ch0.r && /Le flux/.test(ch0.titre) && /rc-saisie/.test(foc0 || "") && /rc-saisie/.test(foc1.cl || "") && tot.txt === tot.attendu);
  await pg.click("#rcPhraseOuvrir"); await att(250); const mots19 = await pg.locator("#rcPhraseTexte [data-j]").count(), fin19 = Math.min(mots19 - 1, 7);
  await pg.click("#rcPhraseTexte [data-j] >> nth=1"); await att(100); await pg.click("#rcPhraseTexte [data-j] >> nth=" + fin19); await att(150);
  const or19 = await pg.locator("#rcPhraseTexte .or").count(); await cap("C14-47-phrase-qui-m-a-marque");
  await pg.click("#rcPhraseOui"); await att(300);
  const r19 = await pg.evaluate(k => { const s = scCopie(k), E = Object.values(s.marques).filter(m => m.forme === "etoile" && m.recopie); return { etoiles: E.length, segs: E.reduce((n, m) => n + m.segs.length, 0), phrase: ((s.recopie || {}).phrase || {}).texte || "", finie: rcFluxCopie(k).finie }; }, k19);
  const fl19b = (await pg.locator("#rcIAEtat").textContent()) || "";
  await pg.click("#rcPhraseOuvrir"); await att(200); await pg.click("#rcPhraseAucune"); await att(300);
  const r19b = await pg.evaluate(k => { const s = scCopie(k); return { etoiles: Object.values(s.marques).filter(m => m.forme === "etoile" && m.recopie).length, aucune: !!((s.recopie || {}).phrase || {}).aucune, finie: rcFluxCopie(k).finie }; }, k19);
  await pg.click("#rcPhraseOuvrir"); await att(200); await pg.click("#rcPhraseTexte [data-j] >> nth=1"); await att(100); await pg.click("#rcPhraseTexte [data-j] >> nth=" + fin19); await att(100); await pg.click("#rcPhraseOui"); await att(300);   // la phrase remise, pour le fichier de l'élève
  await pg.click("#rcFermer"); await att(200);
  verif("recopie (1.4.12) : « ★ La phrase qui m'a marqué » : clic sur le 2e mot puis sur le " + (fin19 + 1) + "e (" + or19 + " mots en or), « ✓ C'est elle » : la phrase passe en or sur la photo (" + r19.etoiles + " marque" + (r19.etoiles > 1 ? "s" : "") + ", " + r19.segs + " bandes, une par ligne : « " + r19.phrase + " ») ; la recopie de cette copie est finie : le compteur passe de « " + (fl19a.match(/la phrase qui m’a marqué : \d+ sur \d+/) || ["—"])[0] + " » à « " + (fl19b.match(/la phrase qui m’a marqué : \d+ sur \d+/) || ["toutes finies"])[0] + " » ; « Pas de phrase » coché : plus d'or (" + r19b.etoiles + "), finie quand même (" + r19b.finie + ")",
    or19 === fin19 && r19.etoiles >= 1 && r19.segs >= 2 && r19.phrase.split(" ").length === fin19 && r19.finie && cptPh(fl19a) !== null && (cptPh(fl19b) === null ? !deja19 : cptPh(fl19b) === cptPh(fl19a) + (deja19 ? 0 : 1)) && r19b.etoiles === 0 && r19b.aucune && r19b.finie);
  // 1.4.13 (Paul 01/11 08:27 : « imaginons que je reprenne une photo en meilleure qualité pour un élève […] je veux la refaire ») : « 📷 Remplacer la photo » d'une page
  await pg.click("#btnRecopier"); await att(400); if (await pg.evaluate(k => RC.copie !== k, k19)) { await allerCopie(k19); await att(300); }
  const pid22 = await pg.evaluate(id => { const x = rcLignesEcrites(RC.copie).find(y => y.id === id); if (x && RC.page !== x.pid) rcActiverPage(x.pid); return x ? x.pid : null; }, cible2); await att(250);
  const av22 = await pg.evaluate(pid => { const k = RC.copie, d = (scCopie(k).recopie.pages || {})[pid], s = scCopie(k), L = rcListe(d.ordre).map(id => d.lignes[id]).filter(l => (l.texte || "").trim());
    return { textes: L.map(l => l.texte).join("|"), ids: L.map(l => l.id).join("|"), y: L.map(l => (l.y0 + l.y1) / 2), bande: Object.values(s.marques).filter(m => m.page === pid && m.bande).map(m => (m.y0 + m.y1) / 2), page: JSON.stringify({ e: SC.pages[pid].eleve, o: SC.pages[pid].ordre }) }; }, pid22);
  const png22 = await pg.evaluate(pid => { const im = SC.imgs[pid], c = document.createElement("canvas"); c.width = im.w; c.height = im.h; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im.el, 0, Math.round(0.03 * im.h)); return c.toDataURL("image/png").split(",")[1]; }, pid22);
  const ch22 = pg.waitForEvent("filechooser"); await pg.click("#rcPhotoOuvrir"); await att(150); await pg.click("#rcRemplacer"); const fc22 = await ch22; globalThis.BANC_PHOTO_REFAITE = Buffer.from(png22, "base64"); await fc22.setFiles({ name: "photo-refaite.png", mimeType: "image/png", buffer: globalThis.BANC_PHOTO_REFAITE }); await att(2500);
  const ap22 = await pg.evaluate(pid => { const k = RC.copie, d = (scCopie(k).recopie.pages || {})[pid], s = scCopie(k), L = rcListe(d.ordre).map(id => d.lignes[id]).filter(l => (l.texte || "").trim());
    return { textes: L.map(l => l.texte).join("|"), ids: L.map(l => l.id).join("|"), y: L.map(l => (l.y0 + l.y1) / 2), bande: Object.values(s.marques).filter(m => m.page === pid && m.bande).map(m => (m.y0 + m.y1) / 2), page: JSON.stringify({ e: SC.pages[pid].eleve, o: SC.pages[pid].ordre }), remplacee: !!SC.pages[pid].remplaceeLe, toast: (document.querySelector(".toast, #toast") || {}).textContent || "" }; }, pid22);
  await cap("C14-48-photo-remplacee"); await pg.click("#rcFermer"); await att(200);
  const dy = (a, b) => a.length && a.length === b.length ? Math.min(...a.map((v, i) => b[i] - v)) : -1;
  verif("feuilles (1.4.13) : « 📷 Remplacer la photo » d'une page par une photo refaite (décalée de 3 % vers le bas) : la feuille garde son identité, son élève et sa place (" + (av22.page === ap22.page && ap22.remplacee) + ") ; ta recopie garde ses lignes et leurs textes (" + (av22.ids === ap22.ids && av22.textes === ap22.textes) + ") et se recale sur la nouvelle photo (lignes descendues de " + (dy(av22.y, ap22.y) * 100).toFixed(1) + " %) ; les cadres de la bande suivent (" + av22.bande.length + " ; " + (dy(av22.bande.sort(), ap22.bande.sort()) * 100).toFixed(1) + " %)",
    !!pid22 && av22.page === ap22.page && ap22.remplacee && av22.ids === ap22.ids && av22.textes === ap22.textes && dy(av22.y, ap22.y) > 0.015 && (!av22.bande.length || dy(av22.bande.sort(), ap22.bande.sort()) > 0.01));
  // [C14 402] un seul bouton « 📷 La photo » : une petite fenêtre, les gestes rares ; un bouton grisé dit pourquoi ; Échap ferme la fenêtre, pas la recopie ;
  // la retouche et la confirmation ouvertes d'ici gardent leurs touches ; quatre quarts de tour reviennent au même, la recopie tourne avec la page ; l'ordre des pages suit
  await pg.click("#btnRecopier"); await att(400); if (await pg.evaluate(k => RC.copie !== k, k19)) { await allerCopie(k19); await att(300); }
  await pg.evaluate(pid => { if (RC.page !== pid) rcActiverPage(pid); }, pid22); await att(200);
  const haut402 = await pg.evaluate(() => Array.from(document.querySelectorAll("#rcEcran .rc-outils button:not([hidden])")).map(b => b.textContent));
  await pg.click("#rcPhotoOuvrir"); await att(200);
  const w402 = await pg.evaluate(() => { const B = Array.from(document.querySelectorAll("#rcPhotoF .rc-photo-b button")), pq = document.getElementById("rcPhotoPourquoi").textContent; return { boutons: B.map(b => b.textContent), titres: B.every(b => (b.title || "").length > 30), gris: B.filter(b => b.disabled).map(b => b.textContent), pq, dit: B.filter(b => b.disabled).every(b => pq.includes(b.textContent + " : ")), qui: document.getElementById("rcPhotoQui").textContent }; });
  await cap("C14-402-la-photo"); await pg.keyboard.press("Escape"); await att(150);
  const esc402 = await pg.evaluate(() => ({ f: document.getElementById("rcPhotoF").hidden, rc: RC.ouvert }));
  const lig402 = () => pg.evaluate(pid => { const d = (scCopie(RC.copie).recopie.pages || {})[pid]; const p = SC.pages[pid] || {}, I = rcListe(d.ordre).slice().sort();   // par identité de ligne : l'ordre des lignes suit leur hauteur, il change quand la page tourne
    return { ids: I.join("|"), textes: I.map(id => d.lignes[id].texte || "").join("|"), P: I.map(id => [d.lignes[id].x0, d.lignes[id].y0, d.lignes[id].x1, d.lignes[id].y1]), id: RC.page, ouvert: RC.ouvert, rot: p.rot || 0, rep: !!(p.lignes && p.lignes.reperes), vt: !!p.vueTournee, orig: !!SC.origs[pid], marge: JSON.stringify(d.marge || null) }; }, pid22);
  const t402 = await lig402(); const tours402 = [];
  for (let i = 0; i < 4; i++) { await pg.click("#rcPhotoOuvrir"); await att(120); await pg.click("#rcPhTourner"); await att(1800); tours402.push(await lig402()); }
  const ecart402 = (A, B) => Math.max(0, ...A.map((a, i) => Math.max(...a.map((v, j) => Math.abs(v - B[i][j])))));
  const quart402 = t402.P.map(([x0, y0, x1, y1]) => [1 - y0, x0, 1 - y1, x1]), eq402 = ecart402(quart402, tours402[0].P), er402 = ecart402(t402.P, tours402[3].P);
  await pg.click("#rcPhotoOuvrir"); await att(150); const rtGris402 = await pg.evaluate(() => document.getElementById("rcPhTourner") && document.getElementById("rcPhRetoucher").disabled);
  let rt402 = "grisé";
  if (!rtGris402) { await pg.click("#rcPhRetoucher"); await att(1500); const o = await pg.evaluate(() => !!SC.rt && !document.getElementById("scRetouche").hidden); await cap("C14-402-retoucher-depuis-la-recopie"); await pg.keyboard.press("Escape"); await att(300); const f = await pg.evaluate(() => ({ rt: !!SC.rt, rc: RC.ouvert })); rt402 = o && !f.rt && f.rc ? "ouverte, Échap la ferme, la recopie reste" : "défaut (" + o + "/" + JSON.stringify(f) + ")"; }
  else { rt402 = "grisé : « " + (await pg.locator("#rcPhotoPourquoi").textContent()) + " »"; await pg.click("#rcPhotoFermer"); await att(100); }
  const nIm402 = await pg.evaluate(() => scPagesDe(RC.copie).filter(p => SC.imgs[p.id]).length);
  await pg.click("#rcPhotoOuvrir"); await att(120); await pg.click("#rcPhRetirer"); await att(200);
  const mo402 = await pg.evaluate(() => document.getElementById("scModale").classList.contains("show") && /Retirer les photos/.test(document.querySelector("#scModale .sc-modale-c").textContent));
  await cap("C14-402-retirer-demande"); await pg.keyboard.press("Escape"); await att(200);
  const apMo402 = await pg.evaluate(() => ({ mo: document.getElementById("scModale").classList.contains("show"), rc: RC.ouvert, im: scPagesDe(RC.copie).filter(p => SC.imgs[p.id]).length }));
  const ord402a = await pg.evaluate(() => scPagesDe(RC.copie).map(p => p.id)); let ord402b = ord402a, ord402n = ord402a, blocs402 = "";
  if (ord402a.length > 1) { for (let i = 0; i < ord402a.length; i++) { await pg.click("#rcPhotoOuvrir"); await att(120); await pg.click("#rcPhOrdre"); await att(400); const o = await pg.evaluate(() => ({ p: scPagesDe(RC.copie).map(p => p.id), b: document.getElementById("rcPages").dataset.pages })); if (i === 0) { ord402b = o.p; blocs402 = o.b; } ord402n = o.p; } }
  else { await pg.click("#rcPhotoOuvrir"); await att(120); ord402b = (await pg.evaluate(() => document.getElementById("rcPhOrdre").disabled && /qu’une page/.test(document.getElementById("rcPhotoPourquoi").textContent))) ? ["grisé"] : []; await pg.click("#rcPhotoFermer"); await att(100); }
  await pg.click("#rcFermer"); await att(200);
  verif("recopie (C14 402) : un seul bouton « " + haut402.filter(x => /📷/.test(x)).join(" / ") + " » en haut ; sa fenêtre : « " + w402.boutons.join(" · ") + " », chacun son infobulle, " + (w402.gris.length ? "grisés : « " + w402.pq + " »" : "aucun grisé") + " ; Échap ferme la fenêtre, pas la recopie ; quatre quarts de tour : la recopie tourne avec la page (écart au quart402 de tour attendu " + eq402.toExponential(1) + "), revient au même (" + er402.toExponential(1) + "), mêmes lignes et textes ; ✂ Retoucher : " + rt402 + " ; 🗑 Retirer demande d'abord, Échap ferme la demande, rien n'est retiré (" + apMo402.im + " / " + nIm402 + " photos) ; ⇄ " + (ord402a.length > 1 ? ord402a.length + " pages : la première passe, la recopie suit (" + (blocs402 === ord402b.join(",")) + "), " + ord402a.length + " clics reviennent au même ordre" : "une page : grisé, il dit pourquoi"),
    haut402.filter(x => /📷/.test(x)).length === 1 && haut402.includes("📷 La photo") && w402.boutons.length === 5 && w402.titres && w402.dit && /Page \d+ \/ \d+ de la copie de/.test(w402.qui) && esc402.f && esc402.rc
    && tours402.every(x => x.ids === t402.ids && x.textes === t402.textes && x.id === t402.id && x.ouvert) && eq402 < 1e-6 && er402 < 1e-6 && (/^grisé : /.test(rt402) || /Échap la ferme, la recopie reste/.test(rt402))
    && mo402 && !apMo402.mo && apMo402.rc && apMo402.im === nIm402 && nIm402 > 0 && (ord402a.length > 1 ? ord402b.join() !== ord402a.join() && blocs402 === ord402b.join(",") && ord402n.join() === ord402a.join() : ord402b[0] === "grisé"));
  // 1.4.12 (Paul 14:03 : « les mots sont soulignés dans la couleur de leur erreur et ils ont le détail dans la marge » ; C14 226 ; C14 234 et Paul 23:09 : « type d'erreur ») :
  // la copie de l'élève en couleurs, une pastille par faute dans une marge ajoutée à gauche de la photo, sans la bonne forme
  const k18 = await pg.evaluate(() => SC.copies.find(k => Object.values(scCopie(k).marques).some(m => m.bande && m.bande.code)));
  const att18 = await pg.evaluate(k => { const ids = scPagesDe(k).map(p => p.id), ms = Object.values(scCopie(k).marques).filter(m => m.forme === "faute" && ids.includes(m.page)), T = scTypesEleve(), t = m => T[(m.bande && m.bande.code) || "_"];
    return { n: ms.length, couleurs: ms.map(m => t(m).couleur).sort().join(","), lettres: ms.map(m => t(m).court).sort().join(" "), nom: nomEleveDe(k) }; }, k18);
  await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(300);
  const dl18 = pg.waitForEvent("download"); await pg.click('.sc-table tr:has-text("' + att18.nom + '") >> text=Télécharger'); const d18 = await dl18, f18 = path.join(path.dirname(await d18.path()), "eleve-couleurs.html"); await d18.saveAs(f18);
  // [C14 405] « 📦 Tout rendre » : un seul zip, un fichier par élève, « NOM Prénom.html » écrit comme dans la liste de la classe ; un lecteur de zip ordinaire l'ouvre
  const nom405 = d18.suggestedFilename(), att405 = await pg.evaluate(() => scCopiesED().map(k => nomEleveDe(k) + ".html"));
  const btn405 = await pg.locator("#scToutRendre").textContent(), corr405 = await pg.evaluate(() => Array.from(document.querySelectorAll("#scModale .sc-table tr")).slice(1).map(tr => tr.children[3].textContent)); await cap("C14-405-tout-rendre");
  const dlz = pg.waitForEvent("download", { timeout: 120000 }); await pg.click("#scToutRendre"); const dz = await dlz, fz = path.join(out, "C14-405-fichiers-eleves.zip"); await dz.saveAs(fz); await att(300);
  const etat405 = await pg.locator("#scZipEtat").textContent();
  const { execFileSync } = await import("node:child_process");
  const z405 = JSON.parse(execFileSync("python3", ["-I", "-c", "import zipfile,json,sys\nz=zipfile.ZipFile(sys.argv[1])\nprint(json.dumps({'bad':z.testzip(),'noms':z.namelist(),'html':all(z.read(n)[:15].lower()==b'<!doctype html>' for n in z.namelist())}))", fz]).toString());
  verif("fichiers (C14 405) : « " + btn405 + " » : un seul zip (« " + dz.suggestedFilename() + " »), " + z405.noms.length + " fichiers, un par élève, nommés comme dans la liste de la classe (« " + z405.noms.slice(0, 3).join(" », « ") + " »…), chacun une page HTML, le zip lu sans erreur par un lecteur ordinaire ; « " + etat405 + " » ; un fichier seul : « " + nom405 + " » ; la colonne « Correction » suit le flux unique (« " + corr405.slice(0, 3).join(" », « ") + " »)",
    /^Redaction-.+-fichiers-eleves_\d{4}-\d\d-\d\d_\d\dh\d\d\.zip$/.test(dz.suggestedFilename()) && z405.bad === null && JSON.stringify(z405.noms) === JSON.stringify(att405) && z405.html && att405.length >= 2 && nom405 === att18.nom + ".html" && /Le zip est prêt : \d+ fichiers/.test(etat405) && corr405.length >= 2 && corr405.every(c => /^(\d+(,\d+)? \/ \d+|corrigée|en cours, \d+ %|pas commencée)$/.test(c)) && corr405.some(c => /en cours/.test(c)));
  await pg.keyboard.press("Escape"); await att(200);
  const pe = await pg.context().newPage(); await pe.setViewportSize({ width: 1536, height: 864 }); await pe.goto("file://" + f18); await att(600); await pe.click("#passer").catch(() => {}); await att(400);
  const e18 = await pe.evaluate(() => ({ soul: Array.from(document.querySelectorAll("#col .mk.f")).map(e => e.style.getPropertyValue("--c").trim()).sort().join(","), pas: Array.from(document.querySelectorAll("#col .pas span:not(.rqn), #col .pas2 span:not(.rqn)")).map(e => e.textContent).sort().join(" "),
    /* [C14 1.4.17] (Paul 01/11 15:09 : « il faut utiliser la marge ») : les pastilles sont sur la photo, dans sa marge rouge : à gauche du trait, dans la page */
    marge: Array.from(document.querySelectorAll("#col .pas2")).map(p => { const P = p.closest(".pg"), i = +P.dataset.i, m = D.pages[i].marge, r = P.getBoundingClientRect(), q = p.getBoundingClientRect(), y = (q.top + q.height / 2 - r.top) / r.height, xm = r.left + (m.xh + (m.xb - m.xh) * y) * r.width; return q.right <= xm + 1 && q.left >= r.left - 1; }),
    colonne: document.querySelectorAll("#col .marge .pas").length,
    tes: (Array.from(document.querySelectorAll("#pan .bloc")).find(b => /Tes fautes|La langue/.test(b.textContent)) || {}).textContent || "",   /* [C14 1.4.18] corrigée avec ses stickers : « La langue » */ rouge: /en rouge/.test(document.body.innerText), bonne: document.body.innerText.includes("→") }));
  await pe.click("#col .pas2 span:not(.rqn) >> nth=0"); await att(300); const h18 = (await pe.locator("#pan h3").first().textContent()) || "";
  await pe.screenshot({ path: path.join(out, "C14-45-copie-eleve-couleurs.png") });
  const p18 = await (await pg.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } })).newPage(); await p18.goto("file://" + f18); await att(400);
  const s18 = await p18.evaluate(() => ({ pas: document.querySelectorAll("#statique .pas span, #statique .pas2 span:not(.rqn)").length, large: document.documentElement.scrollWidth <= window.innerWidth + 1 }));
  await p18.screenshot({ path: path.join(out, "C14-45b-copie-eleve-telephone.png") }); await p18.context().close(); await pe.close(); await pg.bringToFront();
  // [C14 1.4.17] (C14 545-546, Paul 18:38 : « règle 546 ») au téléphone, avec son script : les pastilles et les numéros de la marge ne se chevauchent pas et restent dans l'écran
  const t18 = await (await pg.context().browser().newContext({ viewport: { width: 390, height: 844 } })).newPage(); await t18.goto("file://" + f18); await att(700); await t18.click("#passer").catch(() => {}); await att(400);
  const m18 = await t18.evaluate(() => { const E = Array.from(document.querySelectorAll("#col .pas2 span")).map(e => e.getBoundingClientRect()); let x = 0; E.forEach((a, i) => E.slice(i + 1).forEach(c => { if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) x++; }));
    const P = document.querySelector("#col .pas2") ? document.querySelector("#col .pas2").closest(".pg") : null; return { n: E.length, x, ecran: E.filter(r => r.left < 0 || r.right > innerWidth).length, h: P ? getComputedStyle(P).getPropertyValue("--h").trim() : "", large: document.documentElement.scrollWidth <= innerWidth + 1 }; });
  await t18.screenshot({ path: path.join(out, "C14-45c-copie-eleve-telephone-marge.png") }); await t18.context().close(); await pg.bringToFront();
  verif("recopie (1.4.17) : au téléphone, la marge : " + m18.n + " pastilles et numéros, à la hauteur d'une ligne de la copie (" + m18.h + "), " + m18.x + " chevauchement, " + m18.ecran + " hors de l'écran, pas de défilement de côté : " + m18.large,
    m18.n >= att18.n && m18.x === 0 && m18.ecran === 0 && /px$/.test(m18.h) && m18.large);
  verif("recopie (1.4.12) : le fichier de l'élève en couleurs : " + att18.n + " fautes soulignées chacune dans la couleur de son type d'erreur (" + e18.soul + "), une pastille par faute dans la marge rouge de la copie, à gauche du trait (« " + e18.pas + " », " + e18.marge.filter(Boolean).length + " rang" + (e18.marge.length > 1 ? "s" : "") + " sur " + e18.marge.length + ", plus de colonne ajoutée : " + (e18.colonne === 0) + "), sans la bonne forme (" + !e18.bonne + ") ; « " + e18.tes.replace(/^Tes fautes/, "").trim() + " » ; une pastille cliquée : « " + h18 + " » ; plus de « en rouge » (" + !e18.rouge + ") ; au téléphone sans interactivité, les pastilles se voient (" + s18.pas + ") sans défilement de côté (" + s18.large + ")",
    att18.n >= 1 && /[A-Z∅+⚠?]/.test(e18.pas) && e18.soul === att18.couleurs && e18.pas === att18.lettres && e18.marge.length >= 1 && e18.marge.every(Boolean) && e18.colonne === 0 && !e18.bonne && /chacune dans la couleur de son type d'erreur/.test(e18.tes) && /^Faute \d+ sur \d+/.test(h18) && !e18.rouge && s18.pas === att18.n && s18.large);
  // 1.4.9 (Paul 19:27 et 19:39) : tout effacer, les corrigés de l'IA et tout ce qui vient de la bande ; rien de la recopie ne bouge
  const photo12 = () => pg.evaluate(() => { const IA = ["corrige", "corrigeDe", "corrigeLe", "corrigeMarque", "types", "typesDe", "envoiIA", "decisions", "marquesBande", "places", "placesApp"], o = {}; let n = 0, bande = 0, autres = 0, arret = 0;
    SC.copies.forEach(k => { const c = state.copies[k] || {}, sc = c.scan || {}, r = JSON.parse(JSON.stringify(sc.recopie || null));
      if (r) { if (r.bandeArret) arret++; if (r.envoi || r.charge) arret++; delete r.bandeArret; delete r.reprise; delete r.envoi; delete r.charge; delete r.temps; delete r.gestes; delete r.stickersIA; delete r.remarquesIA; delete r.refusIA;   /* [C14 669] ce que l'IA a rendu part aussi */   /* [1.4.12] le temps et les gestes se comptent à chaque clic : ce ne sont pas la recopie */ Object.values(r.pages || {}).forEach(p => { delete p.modifieLe; Object.values(p.lignes || {}).forEach(l => { if (IA.some(f => l[f] !== undefined)) n++; IA.forEach(f => delete l[f]); }); }); }
      const ms = Object.values(sc.marques || {}); bande += ms.filter(m => m.bande).length + (sc.bandeDebut ? 1 : 0); autres += ms.filter(m => !m.bande).length;
      o[k] = { r, anciennes: Object.keys(sc.marquesAnciennes || {}).length, autres: ms.filter(m => !m.bande).map(m => m.id).sort() }; });
    return { sans: JSON.stringify(o), n, bande, autres, arret }; });
  await pg.click("#btnRecopier"); await att(400); const av12 = await photo12();
  await pg.click("#rcImportIA"); await att(150); await pg.click("#rcIAEffacer"); await att(150);
  const q12 = await pg.locator("#rcIAEffacerQ").textContent(); await pg.click("#rcIAEffacerNon"); await att(150); const annule12 = await photo12();
  const dl12 = []; pg.on("download", d => dl12.push(d.suggestedFilename()));
  await pg.click("#rcIAEffacer"); await att(150); await pg.click("#rcIAEffacerOui"); await att(1600);
  const m12 = await pg.locator("#rcIAMessage").textContent(), ap12 = await photo12();
  const corb12 = await pg.evaluate(() => window.__FAUX_HUB_FETCH("https://x.firebasedatabase.app/corbeille.json").then(r => r.json())), ent12 = Object.values(corb12 || {}).flatMap(j => Object.keys(j || {})).filter(n => /^nettoyage-ia-et-bande_/.test(n));
  const hub12 = await pg.evaluate(() => window.__FAUX_HUB_FETCH("https://x.firebasedatabase.app/" + ruCheminCopies().join("/") + ".json").then(r => r.json()).then(c => Object.values(c || {}).some(cp => Object.values(((cp || {}).scan || {}).marques || {}).some(m => m.bande) || Object.values((((cp || {}).scan || {}).recopie || {}).pages || {}).some(p => Object.values(p.lignes || {}).some(l => l.corrige !== undefined || l.decisions !== undefined)))));
  await cap("C14-36-tout-effacer"); await pg.click("#rcIAFermer"); await att(100);
  verif("recopie (1.4.9) : « 🗑 Tout effacer » demande d'abord (« " + q12.slice(0, 70) + "… »), « Annuler » ne change rien ; « Tout effacer » range dans la corbeille (" + ent12.length + "), télécharge l'export (" + dl12.length + "), efface les corrigés et la bande (lignes touchées " + av12.n + " → " + ap12.n + ", marques et début de bande " + av12.bande + " → " + ap12.bande + ", arrêts gardés " + av12.arret + " → " + ap12.arret + " ; au site : " + (hub12 ? "il en reste" : "plus rien") + ") ; la recopie, les marques d'avant et les autres marques ne bougent pas d'un caractère (" + (ap12.sans === av12.sans) + ")",
    av12.n > 0 && av12.bande > 0 && /Ta recopie ne bouge pas/.test(q12) && annule12.sans === av12.sans && annule12.n === av12.n && ent12.length === 1 && dl12.length === 1 && ap12.n === 0 && ap12.bande === 0 && ap12.arret === 0 && !hub12 && ap12.sans === av12.sans && /^Effacé/.test(m12));
  await pg.click("#rcFermer"); await att(180);
}
