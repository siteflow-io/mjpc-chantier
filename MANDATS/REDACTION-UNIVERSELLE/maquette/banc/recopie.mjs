import path from "node:path";
// Épreuves de la recopie : seulement des gestes ; les évaluations lisent l'état et le DOM.
export async function eprouverRecopie({ pg, verif, cap, att, dir }) {
  await pg.bringToFront();
  const avant = await pg.evaluate(() => {
    const k = SC.copies[SC.ic], c = state.copies[k], s = c.scan || {};
    return { k, lignes: s.lignes, marques: JSON.stringify(s.marques || {}), rep: JSON.stringify(s.rep || {}), note: scNote(k), copies: Object.keys(state.copies).length };
  });
  await pg.click("#btnRecopier"); await pg.locator("#rcEcran").waitFor({ state: "visible" });
  const debut = await pg.evaluate(() => ({ n: document.querySelectorAll(".rc-saisie").length, k: RC.copie, page: RC.page, ids: Array.from(document.querySelectorAll(".rc-saisie")).map(e => e.dataset.ligne) }));
  verif("recopie : photo et feuille ouvertes sur la bonne copie, lignes proposées (" + debut.n + ")", debut.k === avant.k && debut.n >= 3);
  const champ = n => pg.locator(".rc-saisie").nth(n);
  const textes = ["je t'écrit [vite], mon ami.", "Deux mots", "une phra-"];
  const noeud = await champ(0).elementHandle();
  await champ(0).fill(textes[0]); await pg.keyboard.press("Enter");
  await pg.keyboard.type(textes[1]); await pg.keyboard.press("Enter"); await pg.keyboard.type(textes[2]);
  const frappe = await pg.evaluate(() => ({
    textes: Array.from(document.querySelectorAll(".rc-saisie")).slice(0, 3).map(e => e.value),
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
  const apresRetrait = await pg.evaluate(() => Array.from(document.querySelectorAll(".rc-saisie")).map(e => e.dataset.ligne));
  await pg.click("#rcAnnuler");
  const retablie = await pg.evaluate(id => {
    const e = Array.from(document.querySelectorAll(".rc-saisie")).find(e => e.dataset.ligne === id);
    return e && e.value;
  }, ajout);
  const gardees = await pg.evaluate(ids => {
    const d = state.copies[RC.copie].scan.recopie.pages[RC.page];
    return ids.map(id => [id, d.lignes[id].texte]);
  }, debut.ids.slice(0, 3));
  verif("recopie : ajout et retrait sans changer les autres identités ; Annuler remet la ligne et son texte", !apresRetrait.includes(ajout) && retablie === "Une ligne ajoutée." && gardees[0][1] === textes[0] + " À demain." && gardees[1][1] === textes[1] && gardees[2][1] === textes[2]);
  const reprise = await pg.evaluate(() => ({ copie: RC.copie, page: RC.page, ligne: RC.ligne }));
  await att(1400); await pg.reload(); await pg.locator("#rcEcran").waitFor({ state: "visible", timeout: 20000 }); await att(500);
  const reload = await pg.evaluate(() => ({ copie: RC.copie, page: RC.page, ligne: RC.ligne, textes: Array.from(document.querySelectorAll(".rc-saisie")).map(e => e.value) }));
  verif("recopie : après rechargement, même copie, page, ligne, textes et poignées", reload.copie === reprise.copie && reload.page === reprise.page && reload.ligne === reprise.ligne && reload.textes.includes("Une ligne ajoutée.") && JSON.stringify(await geom()) === JSON.stringify(g1));
  const ancienne = await pg.evaluate(k => {
    const s = state.copies[k].scan || {};
    return { lignes: s.lignes, marques: JSON.stringify(s.marques || {}), rep: JSON.stringify(s.rep || {}), note: scNote(k), copies: Object.keys(state.copies).length };
  }, avant.k);
  verif("recopie : anciennes marques, réponses, note, total de lignes et nombre de copies conservés", ancienne.lignes === avant.lignes && ancienne.marques === avant.marques && ancienne.rep === avant.rep && JSON.stringify(ancienne.note) === JSON.stringify(avant.note) && ancienne.copies === avant.copies);
  const photoAvant = await pg.evaluate(() => SC.imgs[RC.page].url);
  const pageRetouchee = reprise.page;
  await pg.click("#rcFermer");
  await pg.locator('.sc-passe[onclick="scAllerPasse(0)"]').click();
  await pg.locator('#scPanneau button[onclick^="scRecadrerDebut("]').first().click();
  await pg.locator("#scRtAngle").waitFor({ state: "visible" }); await pg.locator("#scRtAngle").focus(); await pg.keyboard.press("ArrowRight");
  await pg.locator('button[onclick="scRtFermer(true)"]').click();
  await pg.waitForFunction(({pid, url}) => SC.imgs[pid] && SC.imgs[pid].url !== url, {pid: pageRetouchee, url: photoAvant});
  await pg.click("#btnRecopier"); await att(200); const g2 = await geom();
  const noteRetouchee = await pg.evaluate(k => scNote(k), avant.k);
  verif("recopie : retoucher la photo déplace ses lignes, garde leurs identités et textes, et conserve la note", g2.id === g1.id && g2.texte === g1.texte && (Math.abs(g2.x0 - g1.x0) > 0.00001 || Math.abs(g2.y0 - g1.y0) > 0.00001) && JSON.stringify(noteRetouchee) === JSON.stringify(avant.note));
  await cap("C15-25-recopie-apres-retouche");
  const double = await pg.evaluate(() => SC.copies.find(k => Object.values(SC.pages).filter(p => p.eleve === k && !p.blanche).length > 1));
  await pg.selectOption("#rcCopie", double); const pages = await pg.locator("#rcPage option").evaluateAll(es => es.map(e => e.value));
  await pg.selectOption("#rcPage", pages[1]); await champ(0).fill("Sur la deuxième page.");
  await pg.selectOption("#rcPage", pages[0]); await champ(0).fill("Sur la première page.");
  await pg.selectOption("#rcPage", pages[1]);
  verif("recopie : deux pages d'une copie gardent chacune leurs propres lignes et leur texte", await champ(0).inputValue() === "Sur la deuxième page.");
  await pg.click("#rcCopieSuite"); await champ(0).fill("Une autre copie.");
  await pg.selectOption("#rcCopie", double); await pg.selectOption("#rcPage", pages[1]);
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
  await pg.click("#btnRecopier"); await pg.selectOption("#rcCopie", derniere.eleve); await pg.selectOption("#rcPage", derniere.id);
  const six = await pg.evaluate(() => ({ n: document.querySelectorAll(".rc-saisie").length, lignes: Object.values(RC.documents[RC.page].lignes).map(l => ({ y: l.y0, w: l.x1 - l.x0 })) }));
  verif("recopie : six lignes trouvées sur six dans la page inventée, avec ligne courte, rature, pente et grand blanc (" + six.n + ")", six.n === 6);
  await champ(1).fill("Deux mots"); await pg.keyboard.press("Enter");
  verif("recopie : la ligne de deux mots se saisit et se garde comme les autres", await champ(1).inputValue() === "Deux mots");
  const pos = await pg.evaluate(() => { const d = RC.documents[RC.page]; return { g: d.ordre.map(id => d.lignes[id].x0), dr: d.ordre.map(id => d.lignes[id].x1), sans: !!(RC.sansMarge && RC.sansMarge[RC.page]) }; });
  verif("recopie (C14) : les poignées gauches se posent seules juste avant la marge rouge, les droites au bord de la copie (" + pos.g.map(x => x.toFixed(3)).join(" ") + " | " + pos.dr.map(x => x.toFixed(3)).join(" ") + ")", !pos.sans && pos.g.length === 6 && pos.g.every(x => x < 150 / 1240 && x > 150 / 1240 - 0.02) && pos.dr.every(x => x >= 0.98));
  const nums = await pg.evaluate(() => Array.from(document.querySelectorAll("#rcLignesSVG text.rc-numero")).map(t => t.textContent).join(",") + " · " + document.querySelector("#rcLigneTitre").textContent);
  verif("recopie (C14) : seules la ligne écrite et celle où l'on écrit portent un numéro, à la suite (" + nums + ")", nums === "1,2 · Ligne 2 sur 2");
  await champ(2).fill("Une ligne écrite très serrée, sans une place, ".repeat(3));
  const mg = await pg.evaluate(() => { const i = document.querySelectorAll(".rc-saisie")[2]; return { sw: i.scrollWidth, cw: i.clientWidth, fs: parseFloat(getComputedStyle(i).fontSize), base: 18 * RC.echelle }; });
  verif("recopie (C14) : une ligne trop pleine rapetisse et se lit en entier, rien n'est mangé (" + mg.sw + " / " + mg.cw + " px, lettres " + mg.fs.toFixed(1) + " au lieu de " + mg.base.toFixed(1) + ")", mg.sw <= mg.cw + 1 && mg.fs < mg.base);
  await champ(2).fill("");
  await cap("C15-24-recopie-six-lignes");
  await pg.setViewportSize({ width: 390, height: 800 }); await att(180);
  const lisible = await pg.evaluate(() => {
    const es = Array.from(document.querySelectorAll(".rc-saisie")), boites = es.map(e => e.getBoundingClientRect());
    return es.length === 6 && boites.slice(0,-1).every((b,i) => b.bottom <= boites[i+1].top + 2);
  });
  verif("recopie : à 390 pixels, les six lignes de saisie ne se chevauchent pas", lisible);
  await cap("C15-26-recopie-six-lignes-mobile");
  await pg.setViewportSize({ width: 1536, height: 864 }); await pg.click("#rcFermer"); await att(180);
  verif("recopie : fermer rend les quatre passes, les anciennes corrections et leurs gestes", await pg.locator("#scanEcran").isVisible() && !(await pg.locator("#rcEcran").isVisible()) && await pg.locator(".sc-passe").count() === 4);
}
