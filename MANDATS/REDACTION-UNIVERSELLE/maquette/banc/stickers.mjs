// [C14 1.4.16] les stickers, objets du sujet (Paul 01/11 07:59 et 13:12 : « le chantier principal à faire en premier c'est les stickers afin que je puisse enfin exporter
// un fichier que l'IA peut analyser en entier avec toutes ses marques à poser »). Seulement des gestes ; les évaluations lisent l'état, le DOM, les fichiers téléchargés.
export async function eprouverStickers({ pg, verif, cap, att, dir, out }) {
  const fs = await import("node:fs"), path = await import("node:path");
  await pg.bringToFront();
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
  if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); }
  // 1. Réglages → la grille et ses stickers : le fichier de la proposition se charge, tout « à valider »
  await pg.click('#ruOnglets [data-o="reglages"]'); await att(900);
  const vide = await pg.evaluate(() => document.querySelector(".st-pret") ? document.querySelector(".st-pret").textContent : "");
  await pg.setInputFiles("#ruVue_reglages input[type=file]", path.join(dir, "banc/stickers-lettre-grande-guerre.json")); await att(1500);
  const charge = await pg.evaluate(() => ({ pret: document.querySelector(".st-pret").textContent, lignes: document.querySelectorAll(".st-ligne").length, cartes: document.querySelectorAll(".st-carte").length }));
  const auSite = await pg.evaluate(() => ruLire(["redactions", RU.id, "config", "stickers"]).then(S => Object.values(S || {}).filter(s => s.etat === "a-valider").length));
  await cap("C14-58-stickers-reglages");
  verif("stickers (1.4.16) : Réglages → « La grille et ses stickers » : « 📥 Charger des stickers » (le fichier de la proposition) : « " + charge.pret + " » ; la grille en arbre (" + charge.lignes + " lignes), les stickers de la ligne choisie (" + charge.cartes + "), gardés au site, à valider (" + auSite + ")",
    /Aucun sticker/.test(vide) && /^44 stickers · 0 validé/.test(charge.pret) && charge.lignes === 12 && charge.cartes === 6 && auSite === 44);
  // 2. l'éditeur : le texte d'un sticker se change en place ; une notion de la taxonomie s'ajoute par la recherche ; « ✓ Je valide »
  const t1 = pg.locator('.st-carte >> nth=0').locator('textarea[data-champ="texteEleve"]'); await t1.fill("Tu dis d'où tu écris : du front, ou de la maison."); await t1.press("Tab"); await att(500);
  await pg.fill("#stTaxoCherche", "litote"); await att(300); const res = await pg.locator("#stTaxoRes button").count(); await pg.locator("#stTaxoRes button >> nth=0").click(); await att(500);
  const s1 = await pg.evaluate(() => { const s = stTous().find(x => x.num === "S1"); return { t: s.texteEleve, taxo: s.taxo.length, etat: s.etat }; });
  await pg.click(".st-valider"); await att(500);
  const s1b = await pg.evaluate(() => stTous().find(x => x.num === "S1").etat);
  verif("stickers (1.4.16) : le texte de S1 changé en place (« " + s1.t + " »), une notion ajoutée par la recherche (" + res + " réponses, " + s1.taxo + " notions) ; « ✓ Je valide » : " + s1b,
    s1.t === "Tu dis d'où tu écris : du front, ou de la maison." && res > 0 && s1.taxo === 2 && s1.etat === "a-valider" && s1b === "valide");
  // 3. ✓ Valider ligne par ligne : une ligne par écran, Entrée valide la ligne entière ; le sujet est prêt pour l'IA
  await pg.click("text=Valider ligne par ligne"); await att(500); const ecran = await pg.evaluate(() => document.querySelectorAll(".st-valid-s").length); await cap("C14-59-stickers-valider");
  let n = 0; while (await pg.evaluate(() => !!document.getElementById("stValid")) && n < 20) { await pg.keyboard.press("Enter"); await att(250); n++; }
  const pret = await pg.evaluate(() => ({ ok: stPret().ok, t: stPretTexte() }));
  verif("stickers (1.4.16) : « ✓ Valider ligne par ligne » : " + ecran + " stickers sur le premier écran, Entrée valide la ligne entière (" + n + " écrans) : « " + pret.t + " »", ecran === 6 && n === 10 && pret.ok);
  // 4. l'export pour l'IA : la correction et toutes les marques à poser, dans le même envoi ; une copie déjà corrigée part pour ses seules réussites
  await pg.click('#ruOnglets [data-o="pilotage"]'); await att(300); await pg.click('#ruSous [data-s="correction"]'); await att(600);
  await pg.click("#btnScan"); await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1200);
  if (!(await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(600); }
  // l'en-tête d'une vraie lettre de poilu, recopié à la main sur une copie encore à corriger (Paul 27/10 : « un exemple pour le banc doit toujours etre réaliste »)
  const kE = await pg.evaluate(() => { const L = SC.copies.filter(k => rcLignesEcrites(k).length >= 2); const k = L.find(k => rcCopieACorriger(k)) || L[0]; return { k, id: (state.copies[k] || {}).id || null, l: rcLignesEcrites(k).slice(0, 2).map(x => x.id) }; });
  if (await pg.evaluate(k => RC.copie !== k, kE.k)) { await pg.selectOption("#rcCopie", kE.k); await att(400); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } }
  const ENTETE = ["Tranchée de la cote 304, près de Verdun, le 14 avril 1916", "Ma chère Louise,"];
  for (let i = 0; i < kE.l.length; i++) {   // la page de la ligne choisie dans « Page », puis la ligne réécrite
    const ip = await pg.evaluate(([k, id]) => { const x = rcLignesEcrites(k).find(y => y.id === id); return x && x.pid !== RC.page ? Array.from(document.querySelectorAll("#rcPage option")).findIndex(o => o.value === x.pid || o.value === String(x.page - 1) || o.value === String(x.page)) : -1; }, [kE.k, kE.l[i]]);
    if (ip >= 0) { await pg.selectOption("#rcPage", { index: ip }); await att(400); }
    const c = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + kE.l[i] + '"]'); await c.scrollIntoViewIfNeeded({ timeout: 5000 }); await c.fill(ENTETE[i]); await att(300); }
  const dl = pg.waitForEvent("download"); await pg.click("#rcExportIA"); const fichier = await (await dl).path(); const ex = JSON.parse(fs.readFileSync(fichier, "utf8"));
  const nCop = ex.copies.length, seul = ex.copies.filter(c => c.seulementStickers).length, sansId = ex.copies.filter(c => !c.copie).length;
  const idE = await pg.evaluate(k => (state.copies[k] || {}).id, kE.k), c0 = ex.copies.find(c => c.copie === idE);
  const L0 = c0 ? c0.pages.flatMap(p => p.lignes) : [], entete = L0.slice(0, 2).map(l => l.texte).join(" / ");
  verif("stickers (1.4.16) : « ⇪ Exporter pour l’IA » : la grille part avec la correction (" + (ex.grille || []).length + " stickers, le sujet : " + (ex.sujet || "").length + " signes, la consigne demande les réussites : " + /reussites/.test(ex.consigne) + ") ; " + nCop + " copies, " + seul + " déjà corrigée(s) pour leurs seules réussites ; chaque copie avec son identité interne (" + (nCop - sansId) + " sur " + nCop + "), aucun nom ; la copie recopiée à l’instant part avec ses lignes (« " + entete + " »)",
    (ex.grille || []).length === 44 && (ex.sujet || "").length > 100 && /reussites/.test(ex.consigne) && /\{"s":"fin"\}/.test(ex.consigne.replace(/\\"/g, '"')) && nCop >= 2 && seul >= 1 && sansId === 0 && !!c0 && !c0.seulementStickers && entete === ENTETE.join(" / ") && !JSON.stringify(ex).includes(await pg.evaluate(() => nomEleveDe(SC.copies[0]))));
  if (!c0 || L0.length < 2) return;
  verif("remarques (1.4.17) : la consigne de l’export demande les remarques, au format de C14 451 (une par sticker non réussi, deux phrases, quarante mots au plus, jamais la phrase corrigée ; « aReprendre » : " + /aReprendre/.test(ex.consigne) + ")",
    /pour chaque sticker de la grille qui n'est pas réussi, écris une remarque/.test(ex.consigne) && /sans jamais écrire la phrase corrigée/.test(ex.consigne) && /aReprendre/.test(ex.consigne));
  // 5. le retour de l'IA : des réussites sur deux lignes, une de toute la lettre ; une réussite posée sur la ligne d'une autre copie est refusée
  const c1 = ex.copies.find(c => c !== c0);
  const ret = { format: "mjpc-recopie-ia-3", lignes: {}, reussites: {} };
  ex.copies.filter(c => !c.seulementStickers).forEach(c => c.pages.flatMap(p => p.lignes).forEach(l => { ret.lignes[l.id] = l.texte; }));
  ret.reussites[c0.copie] = [{ s: "S2", l: L0[0].id, m: "Tranchée de la cote 304, près de Verdun" }, { s: "S36", l: L0[1].id, m: "Ma chère Louise" }, { s: "S38" }, { s: "fin" }];
  if (c1) ret.reussites[c1.copie] = [{ s: "S8", l: L0[0].id, m: "Tranchée de la cote 304" }, { s: "fin" }];
  // [C14 1.4.17] les remarques de l'IA : une sur une ligne, une pour la grille, une pour un sticker que tu poseras de ta main ; une sur un sticker réussi et une sur la ligne d'une autre copie, refusées
  const RQ4 = "Tu dis où tu es (« Tranchée de la cote 304 »), pas depuis quand tu as quitté Louise. Ajoute depuis combien de temps vous êtes séparés.", RQ7 = "Ta lettre est écrite d'un seul bloc. Va à la ligne quand tu passes à une autre partie.", RQ43 = "Ta lettre n'emploie aucun mot de 14-18 comme « poilu » ou « permission ». Ajoute-en un là où tu racontes ta vie au front.";
  ret.aReprendre = { [c0.copie]: [{ s: "S4", l: L0[0].id, m: "Tranchée de la cote 304", r: RQ4 }, { s: "S7", r: RQ7 }, { s: "S43", r: RQ43 }, { s: "S2", l: L0[0].id, r: "Tu dis où tu es." }, { s: "fin" }] };
  if (c1) ret.aReprendre[c1.copie] = [{ s: "S5", l: L0[0].id, r: "Dis qui tu es." }, { s: "fin" }];
  await pg.click("#rcImportIA"); await att(200); await pg.locator("#rcIATexte").fill(JSON.stringify(ret)); await pg.click("#rcIAValider"); await att(900);
  const msg = await pg.evaluate(() => document.getElementById("rcIAMessage").textContent); await pg.keyboard.press("Escape"); await att(200);
  const k0 = await pg.evaluate(id => Object.keys(state.copies).find(k => state.copies[k].id === id), c0.copie);
  const ia0 = await pg.evaluate(k => { const r = (scCopie(k).recopie || {}).stickersIA; return r ? { n: r.liste.length, complet: r.complet, places: r.liste.filter(e => e.a > e.de).length } : null; }, k0);
  verif("stickers (1.4.16, 1.4.17) : le retour de l’IA chargé : « " + msg.slice(0, 330) + " » ; sur la copie : " + (ia0 ? ia0.n + " réussites, " + ia0.places + " avec leur passage retrouvé dans la ligne, liste entière : " + ia0.complet : "rien"),
    /Les stickers : 3 réussites proposées sur (1 copie|2 copies)/.test(msg) && /Les remarques : 3 à relire à la fin de la bande · 1 sur un sticker réussi, refusée · 1 sur une ligne d’une autre copie, refusée\./.test(msg) && (!c1 || /1 sur une ligne d’une autre copie, refusée/.test(msg)) && ia0 && ia0.n === 3 && ia0.places === 2 && ia0.complet);
  // 6. la bande : après les fautes, chaque sticker proposé ; Entrée gardé, N non ; le compte de la ligne et la note en direct
  if (await pg.evaluate(k => RC.copie !== k, k0)) { await pg.selectOption("#rcCopie", k0); await att(400); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } }
  await pg.click("#rcBandeOuvrir"); await att(600); if (await pg.evaluate(() => RC.bd && RC.bd.attente)) { await pg.keyboard.press("Enter"); await att(300); }
  await pg.locator("#rcBandeListe li.rc-st-li").first().click(); await att(300);
  const carte = await pg.evaluate(() => ({ t: document.getElementById("rcBandeCarte").innerText.replace(/\s+/g, " "), touches: document.getElementById("rcBandeTouches").innerText.replace(/\s+/g, " "), cadre: !!(RC.bd.boite) }));
  await cap("C14-60-bande-sticker");
  await pg.keyboard.press("Enter"); await att(250); await pg.keyboard.press("n"); await att(250); await pg.keyboard.press("Enter"); await att(300);
  const apres = await pg.evaluate(k => { const D = scCopie(k).stickers || {}, M = Object.values(scCopie(k).marques).filter(m => m.forme === "sticker"); return { d: Object.values(D).map(x => x.num + x.v).sort().join(" "), marques: M.length, fin: document.getElementById("rcBandeCarte").innerText.replace(/\s+/g, " ") }; }, k0);
  verif("stickers (1.4.16) : dans la bande, après les fautes, le sticker proposé (« " + carte.t.slice(0, 110) + " »), son cadre sur la photo (" + carte.cadre + ") ; Entrée, N, Entrée : " + apres.d + " ; posé sur la photo de l’élève (" + apres.marques + " marque) ; la fin : « " + apres.fin.slice(0, 120) + " »",
    /★ Tu dis où tu es/.test(carte.t) && /la note pour l’instant/.test(carte.t) && /Les stickers/.test(carte.touches) && carte.cadre && apres.d === "S2o S36n S38o" && apres.marques === 1 && /1 sticker|2 stickers gardés sur 3/.test(apres.fin) && /note : /.test(apres.fin));
  const rq1 = await pg.evaluate(() => { const q = document.getElementById("rcRqListe"); return { vu: !!q && !q.hidden, n: q ? q.querySelectorAll(".st-rq").length : 0, tete: q ? q.querySelector(".st-rq-tete").innerText.replace(/\s+/g, " ") : "", carte: document.getElementById("rcBandeCarte").innerText.replace(/\s+/g, " ") }; });
  await cap("C14-62-relecture-remarques");
  verif("remarques (1.4.17) : au bout de la bande, la liste des remarques à relire (" + rq1.n + ", « " + rq1.tete.slice(0, 90) + " ») ; la fin de la bande sans l’ancienne note (« " + rq1.carte.slice(0, 100) + " »)",
    rq1.vu && rq1.n === 3 && /À relire/.test(rq1.tete) && /Bande finie/.test(rq1.carte) && !/note avant/.test(rq1.carte));
  // 7. ＋ un sticker que l'IA n'a pas vu, posé de ta main depuis la bande
  await pg.click("#rcStPlus"); await att(300); await pg.click('#scModale >> text=S43'); await att(400);
  const prof = await pg.evaluate(k => { const d = (scCopie(k).stickers || {}); return Object.values(d).filter(x => x.de === "prof").map(x => x.num + x.v).join(" "); }, k0);
  verif("stickers (1.4.16) : « ＋ Un sticker » dans la bande : la liste des stickers validés, S43 choisi, posé de ta main (" + prof + ")", prof === "S43o");
  { let i = 0; while (i < 6 && await pg.evaluate(() => !!(RC.bd && RC.bd.A[RC.bd.i]))) { await pg.keyboard.press("Enter"); await att(250); i++; } }
  const rq2 = await pg.evaluate(k => ({ off: Array.from(document.querySelectorAll("#rcRqListe .st-rq.off")).map(e => e.querySelector("b").textContent).join(" "), relu: !!stRq(k).relu }), k0);
  await pg.keyboard.press("Enter"); await att(400);
  const rq3 = await pg.evaluate(k => ({ relu: !!stRq(k).relu, vis: stRqVisibles(k).map(e => e.num).join(" "), tete: document.querySelector("#rcRqListe .st-rq-tete").innerText.replace(/\s+/g, " ") }), k0);
  verif("remarques (1.4.17) : S43 posé de ta main, sa remarque ne part plus (grisée : « " + rq2.off + " ») ; Entrée au bout de la bande garde les autres (« " + rq3.tete.slice(0, 80) + " », l’élève lira : " + rq3.vis + ")",
    rq2.off === "S43" && !rq2.relu && rq3.relu && rq3.vis === "S4 S7" && /relues/.test(rq3.tete));
  await pg.click("#rcBandeRetour"); await att(200); await pg.click("#rcFermer"); await att(300);
  // 8. le fichier de l'élève : ses stickers sur sa copie, sa grille ligne par ligne, « Pas encore réussi »
  const i0 = await pg.evaluate(k => SC.copies.indexOf(k), k0);
  await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(600);
  const pop = pg.waitForEvent("popup"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Tester comme l'élève").click(); const w = await pop; await w.waitForLoadState(); await w.waitForTimeout(1200);
  await w.click(".passer").catch(() => {}); await w.waitForTimeout(500);
  const el = await w.evaluate(() => ({ st: document.querySelectorAll("#col .mk.st").length, lignes: document.querySelectorAll("#pan [data-l]").length, note: (document.querySelector("#pan .note") || {}).textContent || "" }));
  await w.screenshot({ path: path.join(out, "C14-61-eleve-stickers.png") }).catch(() => {});
  await w.locator("#pan [data-l]").first().click(); await w.waitForTimeout(300); const ligne = await w.evaluate(() => document.getElementById("pan").innerText.replace(/\s+/g, " "));
  await w.click("#gr").catch(() => {}); await w.waitForTimeout(200);
  // [C14 1.4.17] (Paul 15:42 : « à chaque fois que je clique sur un encadré […] ça me met "la phrase qui m'a marqué" ») : un cadre cliqué montre son sticker
  await w.locator("#col .mk.st").first().click(); await w.waitForTimeout(300); const cs = await w.evaluate(() => document.getElementById("pan").innerText.replace(/\s+/g, " "));
  verif("fichier de l’élève (1.4.17) : un cadre cliqué sur la copie montre son sticker (« " + cs.slice(0, 120) + " »), pas la phrase qui m’a marqué", /★ /.test(cs) && !/phrase qui m'a marqué/i.test(cs));
  await w.click("#gr").catch(() => {}); await w.waitForTimeout(200);
  const nq = await w.locator("#col .rqn").count(); await w.locator("#col .rqn").first().click(); await w.waitForTimeout(300); const q1 = await w.evaluate(() => document.getElementById("pan").innerText.replace(/\s+/g, " "));
  await w.screenshot({ path: path.join(out, "C14-63-eleve-remarque.png") }).catch(() => {});
  await w.click("#gr"); await w.waitForTimeout(200); await w.locator("#pan [data-l]").nth(1).click(); await w.waitForTimeout(300); const q2 = await w.evaluate(() => document.getElementById("pan").innerText.replace(/\s+/g, " "));
  await w.click("#gr"); await w.waitForTimeout(200); const formule = await w.evaluate(() => document.querySelector("#pan [data-l] span").textContent);
  await w.click("#gc"); await w.waitForTimeout(300); const gc = await w.evaluate(() => ({ lignes: document.querySelectorAll(".gc table tr").length, on: document.querySelectorAll(".gc td.on").length, th: Array.from(document.querySelectorAll(".gc th")).map(e => e.textContent).join("|") }));
  await w.screenshot({ path: path.join(out, "C14-64-eleve-grille-complete.png") }).catch(() => {}); await w.click("#gcF"); await w.waitForTimeout(200);
  const tout = await w.evaluate(() => document.body.innerText);
  verif("remarques (1.4.17) : dans le fichier de l’élève, " + nq + " numéro dans la marge ; au clic : « " + q1.slice(0, 200) + " »",
    nq === 1 && /À reprendre · 1/i.test(q1) && /Dis depuis quand vous êtes séparés/.test(q1) && /Ta phrase/i.test(q1) && /Tranchée de la cote 304/.test(q1) && q1.includes(RQ4) && !tout.includes(RQ43));
  verif("grille (1.4.17) : une ligne formulée pour l’élève (« " + formule.slice(0, 70) + " ») ; son échelle et la remarque de la grille sous « Pas encore réussi » (« " + q2.slice(0, 160) + " ») ; « 🪟 Voir ma grille complète » : " + gc.lignes + " rangs, " + gc.on + " cases à elle (" + gc.th.slice(0, 80) + ")",
    /Ta lettre est bien celle d'un soldat/.test(formule) && /Insuffisant/.test(q2) && /sur 7/.test(q2) && /Va à la ligne entre les parties/.test(q2) && q2.includes(RQ7) && gc.lignes === 17 && gc.on >= 10 && /Ce qui est attendu/.test(gc.th));
  await w.close(); await pg.keyboard.press("Escape"); await att(200);
  // [C14 1.4.17] (C14 465) au téléphone, le panneau de la note est en bas de l'écran, la copie au-dessus
  { const tel = await (await pg.context().browser().newContext({ viewport: { width: 390, height: 844 } })).newPage(); await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(500);
    const dl = pg.waitForEvent("download"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Télécharger").click(); const f = path.join(path.dirname(await (await dl).path()), "eleve-telephone.html"); await (await dl).saveAs(f); await pg.keyboard.press("Escape"); await att(200);
    await tel.goto("file://" + f); await tel.waitForTimeout(800); await tel.click(".passer").catch(() => {}); await tel.waitForTimeout(400);
    const r = await tel.evaluate(() => { const q = document.getElementById("pan").getBoundingClientRect(); return { haut: Math.round(q.top), bas: Math.round(q.bottom), h: innerHeight }; });
    await tel.screenshot({ path: path.join(out, "C14-65-eleve-telephone.png") }); await tel.context().close();
    verif("fichier de l’élève (1.4.17) : au téléphone, le panneau de la note est en bas (de " + r.haut + " à " + r.bas + " sur " + r.h + ")", r.bas >= r.h - 2 && r.haut >= r.h * 0.45); }
  verif("stickers (1.4.16) : le fichier de l’élève : ses stickers encadrés sur sa copie (" + el.st + "), sa grille ligne par ligne (" + el.lignes + " lignes, note « " + el.note + " ») ; une ligne cliquée : « " + ligne.slice(0, 140) + " »",
    el.st >= 1 && el.lignes === 12 && /\/ 40/.test(el.note) && /★ Tu dis où tu es/.test(ligne) && /Pas encore réussi/i.test(ligne));
}
