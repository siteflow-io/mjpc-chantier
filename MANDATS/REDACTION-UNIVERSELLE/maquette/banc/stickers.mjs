// [C14 1.4.18] (Paul 01/11 20:31 : « pas d'export possible avant que le sujet soit complet, stickers grille etc. » ; C14 565) : le sujet complet d'abord.
// Avant la recopie : l'export est grisé et dit pourquoi (grille absente, puis pas prête) ; la grille se charge, se règle et se valide dans Réglages ; puis l'export part.
export async function eprouverStickersReglages({ pg, verif, cap, att, dir }) {
  const path = await import("node:path");
  await pg.bringToFront();
  const versRecopie = async () => { if (!(await pg.evaluate(() => SC.ouvert))) { await pg.click('#ruOnglets [data-o="pilotage"]'); await att(300); await pg.click('#ruSous [data-s="correction"]'); await att(600);
      await pg.click("#btnScan"); await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1200); }
    if (!(await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(600); } };
  const versReglages = async () => { if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
    if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); }
    await pg.click('#ruOnglets [data-o="reglages"]'); await att(900); };
  const essai = async () => { let dl = false; const h = () => { dl = true; }; pg.on("download", h); await pg.click("#rcExportIA", { force: true });   /* le bouton grisé (aria-disabled) se clique quand même : rien ne part */ await att(900); pg.off("download", h);
    return pg.evaluate(t => ({ t: document.querySelector("#rcIAEtat").textContent, gris: document.querySelector("#rcExportIA").classList.contains("rc-gris"), titre: document.querySelector("#rcExportIA").title, dl: t }), dl); };
  await versRecopie(); const g0 = await essai();
  verif("export (1.4.18, C14 565) : sans grille de stickers, « ⇪ Exporter pour l’IA » est grisé, ne télécharge rien et dit pourquoi, à l’écran (« " + g0.t.slice(0, 140) + " »)",
    g0.gris && !g0.dl && /L’export attend : ta grille de stickers n’est pas chargée/.test(g0.t) && /^Pas encore : /.test(g0.titre));
  await versReglages();
  // 1. Réglages → la grille et ses stickers : le fichier de la proposition se charge, tout « à valider »
  const vide = await pg.evaluate(() => document.querySelector(".st-pret") ? document.querySelector(".st-pret").textContent : "");
  await pg.setInputFiles("#ruVue_reglages input[type=file]", path.join(dir, "banc/stickers-lettre-grande-guerre.json")); await att(1500);
  const charge = await pg.evaluate(() => ({ pret: document.querySelector(".st-pret").textContent, lignes: document.querySelectorAll(".st-ligne").length, cartes: document.querySelectorAll(".st-carte").length }));
  const auSite = await pg.evaluate(() => ruLire(["redactions", RU.id, "config", "stickers"]).then(S => Object.values(S || {}).filter(s => s.etat === "a-valider").length));
  await cap("C14-58-stickers-reglages");
  verif("stickers (1.4.16) : Réglages → « La grille et ses stickers » : « 📥 Charger des stickers » (le fichier de la proposition) : « " + charge.pret + " » ; la grille en arbre (" + charge.lignes + " lignes), les stickers de la ligne choisie (" + charge.cartes + "), gardés au site, à valider (" + auSite + ")",
    /Aucun sticker/.test(vide) && /^44 stickers · 0 validé/.test(charge.pret) && charge.lignes === 12 && charge.cartes === 6 && auSite === 44);
  await versRecopie(); const g1 = await essai(); await versReglages();
  verif("export (1.4.18, C14 565) : la grille chargée mais pas validée, l’export attend encore (« " + g1.t.slice(0, 140) + " »)", g1.gris && !g1.dl && /L’export attend : ta grille de stickers n’est pas prête : 44 à valider/.test(g1.t));
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
  await versRecopie(); const g2 = await pg.evaluate(() => ({ t: document.querySelector("#rcIAEtat").textContent, gris: document.querySelector("#rcExportIA").classList.contains("rc-gris") }));
  verif("export (1.4.18, C14 565) : le sujet complet, l’export n’est plus grisé (« " + g2.t.slice(0, 100) + " »)", !g2.gris && !/L’export attend/.test(g2.t));
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }   /* la recopie commence à l'écran des scans */
}
// [C14 1.4.16] les stickers, objets du sujet (Paul 01/11 07:59 et 13:12 : « le chantier principal à faire en premier c'est les stickers afin que je puisse enfin exporter
// un fichier que l'IA peut analyser en entier avec toutes ses marques à poser »). Seulement des gestes ; les évaluations lisent l'état, le DOM, les fichiers téléchargés.
export async function eprouverStickers({ pg, verif, cap, att, dir, out }) {
  const fs = await import("node:fs"), path = await import("node:path");
  await pg.bringToFront();
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
  if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); }
  // 4. l'export pour l'IA : la correction et toutes les marques à poser, dans le même envoi ; une copie déjà corrigée part pour ses seules réussites
  await pg.click('#ruOnglets [data-o="pilotage"]'); await att(300); await pg.click('#ruSous [data-s="correction"]'); await att(600);
  await pg.click("#btnScan"); await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1200);
  if (!(await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(600); }
  // l'en-tête d'une vraie lettre de poilu, recopié à la main sur une copie encore à corriger (Paul 27/10 : « un exemple pour le banc doit toujours etre réaliste »)
  const kE = await pg.evaluate(() => { const L = SC.copies.filter(k => rcLignesEcrites(k).length >= 4); const k = L.find(k => rcCopieACorriger(k)) || L[0]; return { k, id: (state.copies[k] || {}).id || null, l: rcLignesEcrites(k).slice(0, 4).map(x => x.id) }; });
  if (await pg.evaluate(k => RC.copie !== k, kE.k)) { await pg.selectOption("#rcCopie", kE.k); await att(400); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } }
  const ENTETE = ["Tranchée de la cote 304, près de Verdun, le 14 avril 1916", "Ma chère Louise,", "Je t'écris depuis la tranchée, où la boue monte", "jusqu'aux genoux et où personne ne dort."];   // [C14 1.4.17] un paragraphe, une phrase sur deux lignes
  for (let i = 0; i < kE.l.length; i++) {   // la page de la ligne choisie dans « Page », puis la ligne réécrite
    const ip = await pg.evaluate(([k, id]) => { const x = rcLignesEcrites(k).find(y => y.id === id); return x && x.pid !== RC.page ? Array.from(document.querySelectorAll("#rcPage option")).findIndex(o => o.value === x.pid || o.value === String(x.page - 1) || o.value === String(x.page)) : -1; }, [kE.k, kE.l[i]]);
    if (ip >= 0) { await pg.selectOption("#rcPage", { index: ip }); await att(400); }
    const c = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + kE.l[i] + '"]'); await c.scrollIntoViewIfNeeded({ timeout: 5000 }); await c.fill(ENTETE[i]); await att(300); }
  const dl = pg.waitForEvent("download"); await pg.click("#rcExportIA"); const fichier = await (await dl).path(); const ex = JSON.parse(fs.readFileSync(fichier, "utf8"));
  const nCop = ex.copies.length, seul = ex.copies.filter(c => c.seulementStickers).length, sansId = ex.copies.filter(c => !c.copie).length;
  const idE = await pg.evaluate(k => (state.copies[k] || {}).id, kE.k), c0 = ex.copies.find(c => c.copie === idE);
  const L0 = c0 ? c0.pages.flatMap(p => p.lignes) : [], entete = L0.slice(0, ENTETE.length).map(l => l.texte).join(" / ");
  verif("stickers (1.4.16) : « ⇪ Exporter pour l’IA » : la grille part avec la correction (" + (ex.grille || []).length + " stickers, le sujet : " + (ex.sujet || "").length + " signes, la consigne demande les réussites : " + /reussites/.test(ex.consigne) + ") ; " + nCop + " copies, " + seul + " déjà corrigée(s) pour leurs seules réussites ; chaque copie avec son identité interne (" + (nCop - sansId) + " sur " + nCop + "), aucun nom ; la copie recopiée à l’instant part avec ses lignes (« " + entete + " »)",
    (ex.grille || []).length === 44 && (ex.sujet || "").length > 100 && /reussites/.test(ex.consigne) && /\{"s":"fin"\}/.test(ex.consigne.replace(/\\"/g, '"')) && nCop >= 2 && seul === 0 && sansId === 0 && !!c0 && !c0.seulementStickers && entete === ENTETE.join(" / ") && !JSON.stringify(ex).includes(await pg.evaluate(() => nomEleveDe(SC.copies[0]))));
  if (!c0 || L0.length < 2) return;
  verif("remarques (1.4.17) : la consigne de l’export demande les remarques, au format de C14 451 (une par sticker non réussi, deux phrases, quarante mots au plus, jamais la phrase corrigée ; « aReprendre » : " + /aReprendre/.test(ex.consigne) + ")",
    /pour chaque sticker de la grille qui n'est pas réussi, écris une remarque/.test(ex.consigne) && /sans jamais écrire la phrase corrigée/.test(ex.consigne) && /aReprendre/.test(ex.consigne));
  // 5. le retour de l'IA : des réussites sur deux lignes, une de toute la lettre ; une réussite posée sur la ligne d'une autre copie est refusée
  const c1 = ex.copies.find(c => c !== c0);
  const ret = { format: "mjpc-recopie-ia-3", lignes: {}, reussites: {} };
  ex.copies.filter(c => !c.seulementStickers).forEach(c => c.pages.flatMap(p => p.lignes).forEach(l => { ret.lignes[l.id] = l.texte; }));
  ret.reussites[c0.copie] = [{ s: "S2", l: L0[0].id, m: "Tranchée de la cote 304, près de Verdun" }, { s: "S36", l: L0[1].id, m: "Ma chère Louise" }, { s: "S38" }, { s: "fin" }];
  if (c1) ret.reussites[c1.copie] = [{ s: "S8", l: L0[0].id, m: "Tranchée de la cote 304" }];   /* [C14 1.4.18] sa liste est coupée (pas de « fin ») : elle repart au prochain export, pour ses seuls stickers */
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
    /★ Tu dis où tu es/.test(carte.t) && /sa note, avec les stickers déjà gardés avant celui-ci/.test(carte.t) && /Si tu le gardes : Le thème tenu, \d sur 6/.test(carte.t) && /Les stickers/.test(carte.touches) && carte.cadre && apres.d === "S2o S36n S38o" && apres.marques === 1 && /1 sticker|2 stickers gardés sur 3/.test(apres.fin) && /note : /.test(apres.fin));
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

  // [C14 1.4.17] (C14 492, 493, 525 ; Paul 16:28 et 17:21) : un sticker de paragraphe et un sticker de phrase. Un second retour de l'IA, avec ses seules réussites,
  // pour une copie déjà corrigée ; la bande montre leur zone de la page et ce qu'ils rapportent ; le fichier de l'élève, leur accolade et leurs cadres
  { const PQ8 = "Ton paragraphe dit où tu es (« Je t'écris depuis la tranchée ») et ce que tu vois (« la boue »).", PQ24 = "P.P « Je t'écris depuis la tranchée » + PSR 1 « où la boue monte jusqu'aux genoux » + PSR 2 « et où personne ne dort ».";
    const ret2 = { format: "mjpc-recopie-ia-3", reussites: { [c0.copie]: [{ s: "S8", l: L0[2].id, m: "Je t'écris depuis la tranchée", l2: L0[3].id, p: PQ8 }, { s: "S24", l: L0[2].id, m: "où la boue monte", p: PQ24 }, { s: "S1", l: L0[2].id, m: "depuis la tranchée", p: "Avec « depuis la tranchée », tu dis que tu écris du front." }, { s: "fin" }] } };   // S1 : un mot dans la phrase de S24 (Paul 18:08, rien ne se chevauche)
    await pg.click("#btnRecopier"); await att(600); if (await pg.evaluate(k => RC.copie !== k, k0)) { await pg.selectOption("#rcCopie", k0); await att(400); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } }
    await pg.click("#rcImportIA"); await att(200); await pg.locator("#rcIATexte").fill(JSON.stringify(ret2)); await pg.click("#rcIAValider"); await att(900);
    const m2 = await pg.evaluate(() => document.getElementById("rcIAMessage").textContent); await pg.keyboard.press("Escape"); await att(200);
    await pg.click("#rcBandeOuvrir"); await att(600); if (await pg.evaluate(() => RC.bd && RC.bd.attente)) { await pg.keyboard.press("Enter"); await att(300); }
    const aller = async num => { const i = await pg.evaluate(n => Array.from(document.querySelectorAll("#rcBandeListe li.rc-st-li")).findIndex(li => (li.querySelector("b") || {}).textContent === n), num); await pg.locator("#rcBandeListe li.rc-st-li").nth(i).click(); await att(400);
      return pg.evaluate(() => ({ h: document.getElementById("rcBandePhoto").height, ctx: document.getElementById("rcBandeContexte").innerText.replace(/\s+/g, " "), carte: document.getElementById("rcBandeCarte").innerText.replace(/\s+/g, " ") })); };
    const b8 = await aller("S8"); await cap("C14-66-bande-paragraphe"); await pg.keyboard.press("Enter"); await att(300);
    const b24 = await aller("S24"); await cap("C14-67-bande-phrase"); await pg.keyboard.press("Enter"); await att(300);
    await aller("S1"); await pg.keyboard.press("Enter"); await att(300);
    const d2 = await pg.evaluate(k => { const D = scCopie(k).stickers || {}, M = Object.values(scCopie(k).marques).filter(m => m.forme === "sticker" && m.segs); return { s8: (D[stParNum("S8").id] || {}).v, s24: (D[stParNum("S24").id] || {}).v, segs: M.map(m => m.taille + ":" + m.segs.length).sort().join(" ") }; }, k0);
    verif("stickers (1.4.17) : un second retour de l’IA, ses seules réussites (« " + m2.slice(0, 80) + " ») ; dans la bande, le paragraphe montre sa zone de la page (" + b8.h + " points de haut) et tout son texte (« " + b8.ctx.slice(0, 90) + " »), la carte « Pour l’élève » ; la phrase sur deux lignes (« " + b24.carte.slice(b24.carte.indexOf("Si tu"), b24.carte.indexOf("Si tu") + 95) + " ») ; gardés : " + d2.segs,
      /Chargé\. Les stickers : 3 réussites proposées sur 1 copie/.test(m2) && b8.h > 110 && b8.ctx.includes("Je t'écris depuis la tranchée, où la boue monte jusqu'aux genoux et où personne ne dort.") && /l’accolade prendra tout le paragraphe/.test(b8.carte) && b8.carte.includes(PQ8)
      && b24.h > 110 && /le cadre prendra toute la phrase/.test(b24.carte) && /Si tu le gardes : Les cinq architectures, valorisées au-delà, 1 sur 6 → 2 \/ 7 pt/.test(b24.carte) && d2.s8 === "o" && d2.s24 === "o" && d2.segs === "paragraphe:2 phrase:2");
    await pg.click("#rcBandeRetour"); await att(200); await pg.click("#rcFermer"); await att(300);
    await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(500);
    const pop = pg.waitForEvent("popup"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Tester comme l'élève").click(); const w2 = await pop; await w2.waitForLoadState(); await w2.waitForTimeout(1000); await w2.click(".passer").catch(() => {}); await w2.waitForTimeout(400);
    const i24 = await w2.evaluate(() => D.stickers.findIndex(t => /architecture 1/.test(t.texte))), n24 = await w2.locator('#col [data-v="s:' + i24 + '"]').count(), nAcc = await w2.locator("#col .mk.stp").count();
    await w2.locator("#col .mk.stp").first().click(); await w2.waitForTimeout(300); const e8 = await w2.evaluate(() => document.getElementById("pan").innerText.replace(/\s+/g, " ")); await w2.screenshot({ path: path.join(out, "C14-68-eleve-paragraphe.png") });
    await w2.click("#gr"); await w2.waitForTimeout(200); await w2.locator('#col [data-v="s:' + i24 + '"]').last().click();   /* sa seconde ligne : la première porte le cadre de S1, dedans */ await w2.waitForTimeout(300); const e24 = await w2.evaluate(() => document.getElementById("pan").innerText.replace(/\s+/g, " "));
    // [C14 1.4.17] (Paul 18:08 : « aucun stickers ne doit se chevaucher jamais ») mesuré à l'écran, sur ordinateur puis sur téléphone : les étoiles entre elles,
    // avec la marge et les accolades ; les cadres qui se croisent ; un cadre dans un autre, avec un jour entre les bords
    const CHEV = () => { const R = e => e.getBoundingClientRect(), x = (a, c) => a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom, d = (a, c) => a.left >= c.left - 0.5 && a.right <= c.right + 0.5 && a.top >= c.top - 0.5 && a.bottom <= c.bottom + 0.5;
      const E = [...document.querySelectorAll("#col .stb")], M = [...document.querySelectorAll("#col .pas2 span, #col .mk.stp")], C = [...document.querySelectorAll("#col .mk.st, #col .mk.stp")];
      let ee = 0, em = 0, cc = 0, emb = 0, jour = 99; E.forEach((a, i) => { E.slice(i + 1).forEach(c => { if (x(R(a), R(c))) ee++; }); M.forEach(m => { if (m !== a.parentNode && x(R(a), R(m))) em++; }); });
      C.forEach((a, i) => C.slice(i + 1).forEach(c => { if (a.dataset.v === c.dataset.v) return; const p = R(a), q = R(c); if (!x(p, q)) return; if (d(p, q) || d(q, p)) { emb++; jour = Math.min(jour, Math.abs(p.left - q.left), Math.abs(p.top - q.top), Math.abs(p.right - q.right), Math.abs(p.bottom - q.bottom)); } else cc++; }));
      const P2 = [...document.querySelectorAll("#col .pas2 span")]; let mm = 0, ecran = 0; P2.forEach((a, i) => { if (R(a).left < 0 || R(a).right > innerWidth) ecran++; P2.slice(i + 1).forEach(c => { if (x(R(a), R(c))) mm++; }); });   // la marge (C14 546)
      return { n: E.length, ee, em, cc, emb, jour: Math.round(jour * 10) / 10, marge: P2.length, mm, ecran }; };
    const ch1 = await w2.evaluate(CHEV); await w2.screenshot({ path: path.join(out, "C14-69-eleve-rien-ne-se-chevauche.png") });
    await w2.close(); await pg.keyboard.press("Escape"); await att(200);
    let ch2; { const tel = await (await pg.context().browser().newContext({ viewport: { width: 390, height: 844 } })).newPage(); await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(500);
      const dl = pg.waitForEvent("download"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Télécharger").click(); const f = path.join(path.dirname(await (await dl).path()), "eleve-telephone-2.html"); await (await dl).saveAs(f); await pg.keyboard.press("Escape"); await att(200);
      await tel.goto("file://" + f); await tel.waitForTimeout(800); await tel.click(".passer").catch(() => {}); await tel.waitForTimeout(400); ch2 = await tel.evaluate(CHEV); await tel.screenshot({ path: path.join(out, "C14-70-eleve-telephone-rien-ne-se-chevauche.png") }); await tel.context().close(); }
    verif("fichier de l’élève (1.4.17) : rien ne se chevauche — ordinateur : " + JSON.stringify(ch1) + " ; téléphone : " + JSON.stringify(ch2) + " (étoiles, étoile sur étoile, étoile sur la marge ou une accolade, cadres croisés, cadres l’un dans l’autre, le plus petit jour entre leurs bords en points, pastilles et numéros de la marge, chevauchements entre eux, hors de l’écran)",
      [ch1, ch2].every(c => c.n >= 4 && c.ee === 0 && c.em === 0 && c.cc === 0 && c.emb >= 1 && c.jour >= 1 && c.marge >= 1 && c.mm === 0 && c.ecran === 0));
    verif("fichier de l’élève (1.4.17) : le paragraphe a son accolade (" + nAcc + ") ; au clic : « " + e8.slice(0, 150) + " » ; la phrase a un cadre par ligne (" + n24 + ") ; au clic : « " + e24.slice(e24.indexOf("TU AS"), e24.indexOf("TU AS") + 120) + " »",
      nAcc === 1 && /Réussi/.test(e8) && /Tu as écrit/i.test(e8) && e8.includes("jusqu'aux genoux et où personne ne dort.") && e8.includes(PQ8) && n24 === 2 && e24.includes("« Je t'écris depuis la tranchée, où la boue monte jusqu'aux genoux et où personne ne dort. »") && e24.includes(PQ24)); }
  // [C14 1.4.17] (C14 545-546 ; Paul 18:38 « règle 546 », 18:53 « continue à faire tourner le banc mobile ») une marge chargée, comme sur une vraie copie de 3e :
  // une autre copie, quatre lignes voisines recopiées avec leurs fautes, deux remarques ; la bande jusqu'au bout ; au téléphone, rien ne se chevauche dans la marge
  { const FAUTIF = ["Mon cher frère, je t'écrit depuis le front ou il pleut", "sans arret. Les obus tombe toute la nuit et nous", "avons peur. Mes camarade sont fatigués et", "malades, la soupe et froide quand elle arrive."];
    const CORR = ["Mon cher frère, je t'écris{G} depuis le front où{G} il pleut", "sans arrêt{C}. Les obus tombent{G} toute la nuit et nous", "avons peur. Mes camarades{G} sont fatigués et", "malades, la soupe est{G} froide quand elle arrive."];
    if (await pg.evaluate(() => !(typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(600); }
    const k2 = await pg.evaluate(k0 => { const k = SC.copies.find(k => k !== k0 && scPagesDe(k).length); return k ? { k, i: SC.copies.indexOf(k) } : null; }, k0);   /* une autre copie, ses quatre premières lignes */
    if (!k2) { verif("recopie (1.4.17) : une autre copie avec sa photo, pour la marge chargée", false); return; }
    if (await pg.evaluate(k => RC.copie !== k, k2.k)) { await pg.selectOption("#rcCopie", k2.k); await att(500); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } }
    k2.l = await pg.evaluate(() => Array.from(document.querySelectorAll("#rcFeuille .rc-saisie[data-ligne]")).slice(0, 4).map(e => e.dataset.ligne));
    for (let i = 0; i < k2.l.length; i++) { const c = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + k2.l[i] + '"]'); await c.scrollIntoViewIfNeeded({ timeout: 5000 }); await c.fill(FAUTIF[i]); await att(300); }
    if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); }
    const dl3 = pg.waitForEvent("download"); await pg.click("#rcExportIA"); const d3 = await dl3, nom3 = d3.suggestedFilename(), ex3 = JSON.parse(fs.readFileSync(await d3.path(), "utf8"));
    // [C14 1.4.19] (Paul 20:54 ; « Ok pour 571 », 22:16) : un second export ne renvoie pas les copies qui attendent leur retour ; « ↻ Renvoyer » les redonne ; le nom dit le contenu
    let dl4b = false; { const h = () => { dl4b = true; }; pg.on("download", h); await pg.click("#rcExportIA"); await att(900); pg.off("download", h); }
    const att3 = await pg.evaluate(() => ({ flux: document.querySelector("#rcIAEtat").textContent, rv: !document.querySelector("#rcRenvoyerIA").hidden }));
    const dlR = pg.waitForEvent("download"); await pg.click("#rcRenvoyerIA"); const dR = await dlR, nomR = dR.suggestedFilename(), exR = JSON.parse(fs.readFileSync(await dR.path(), "utf8"));
    const memes = exR.copies.map(c => c.copie).sort().join() === ex3.copies.map(c => c.copie).sort().join();
    verif("export (1.4.19, C14 571) : le fichier dit son contenu (« " + nom3 + " »), et la consigne demande à l’IA de rendre « corrige_ » + ce nom ; un second export ne renvoie rien (aucun fichier : " + !dl4b + ", « " + att3.flux.slice(0, 120) + " ») ; « ↻ Renvoyer les copies en attente » redonne les mêmes copies (« " + nomR + " »)",
      /^Redaction-1-[A-Za-z0-9-]+_[a-z0-9-]+_envoi-1-sur-1_\d+-copies?(-stickers-seuls)?_\d{4}-\d\d-\d\d_\d\dh\d\d\.json$/.test(nom3) && ex3.fichier === nom3 && /« corrige_ » suivi exactement du nom donné dans « fichier »/.test(ex3.consigne)
      && !dl4b && /en attente de leur retour/.test(att3.flux) && att3.rv && /_renvoi_/.test(nomR) && memes);
    const id2 = await pg.evaluate(k => (state.copies[k] || {}).id, k2.k), c2 = ex3.copies.find(c => c.copie === id2), L2 = c2 ? c2.pages.flatMap(p => p.lignes) : [];
    const seul3 = ex3.copies.filter(c => c.seulementStickers).length;   /* la copie dont la liste était coupée repart pour ses seuls stickers */
    const ret3 = { format: "mjpc-recopie-ia-3", lignes: {}, reussites: {}, aReprendre: {} };
    L2.forEach(l => { const i = k2.l.indexOf(l.id); ret3.lignes[l.id] = i >= 0 ? CORR[i] : l.texte; });
    ret3.reussites[id2] = [{ s: "fin" }];
    ret3.aReprendre[id2] = [{ s: "S2", l: k2.l[0], m: "depuis le front", r: "Tu écris « depuis le front », mais on ne sait pas où tu es. Donne le nom d'un lieu : une tranchée, un village." },
      { s: "S43", l: k2.l[2], m: "Mes camarade", r: "Ta lettre parle des obus, mais n'emploie aucun mot de 14-18 comme « poilu » ou « permission ». Ajoute-en un." }, { s: "fin" }];
    // deux retours de l'IA, choisis d'un coup : la correction de la copie, et les réussites des copies parties pour leurs seuls stickers
    const retB = { format: "mjpc-recopie-ia-3", reussites: Object.fromEntries(ex3.copies.filter(c => c.seulementStickers).map(c => [c.copie, [{ s: "fin" }]])) };
    const fA = path.join(out, "corrige_" + nom3), fB = path.join(out, "corrige_" + nomR); fs.writeFileSync(fA, JSON.stringify({ format: ret3.format, lignes: ret3.lignes, reussites: { [id2]: ret3.reussites[id2] }, aReprendre: ret3.aReprendre })); fs.writeFileSync(fB, JSON.stringify(retB));
    // (C14 591) le retour de la seule copie corrigée, d'abord : la copie partie pour ses seuls stickers, absente de ce retour, repart au prochain export
    await pg.click("#rcImportIA"); await att(200); await pg.locator("#rcIATexte").fill(fs.readFileSync(fA, "utf8")); await pg.click("#rcIAValider"); await att(900); await pg.keyboard.press("Escape"); await att(200);
    const lib = await pg.evaluate(() => ({ flux: document.querySelector("#rcIAEtat").textContent, rv: !document.querySelector("#rcRenvoyerIA").hidden }));
    let dl5n = ""; { const h = d => { dl5n = d.suggestedFilename(); }; pg.on("download", h); await pg.click("#rcExportIA"); await att(1200); pg.off("download", h); }
    verif("export (1.4.19, C14 591) : un retour arrivé sans une copie de son envoi : elle n’attend plus (« ↻ Renvoyer » caché : " + !lib.rv + ") et repart au prochain export (« " + dl5n + " »)",
      !/en attente de leur retour/.test(lib.flux) && !lib.rv && (!seul3 || /_envoi-1-sur-1_\d+-copies?-stickers-seuls_/.test(dl5n)));
    await pg.click("#rcImportIA"); await att(200); await pg.setInputFiles("#rcIAFichier", [fA, fB]); await att(2500);
    const m3 = await pg.evaluate(() => document.getElementById("rcIAMessage").textContent), apres3 = await pg.evaluate(() => ({ flux: document.querySelector("#rcIAEtat").textContent, rv: !document.querySelector("#rcRenvoyerIA").hidden }));
    verif("import (1.4.19, C14 571) : deux fichiers de l’IA choisis d’un coup se chargent l’un après l’autre (« " + m3.replace(/\s+/g, " ").slice(0, 200) + " ») ; plus rien n’attend son retour (« ↻ Renvoyer » caché : " + !apres3.rv + ")",
      (m3.match(/: Chargé/g) || []).length === 2 && m3.includes("corrige_" + nom3) && m3.includes("corrige_" + nomR) && !/en attente de leur retour/.test(apres3.flux) && !apres3.rv);
    await pg.keyboard.press("Escape"); await att(200);
    if (await pg.evaluate(k => RC.copie !== k, k2.k)) { await pg.selectOption("#rcCopie", k2.k); await att(400); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } }
    await pg.click("#rcBandeOuvrir"); await att(600); if (await pg.evaluate(() => RC.bd && RC.bd.attente)) { await pg.keyboard.press("Enter"); await att(300); }
    { let i = 0; while (i < 30 && await pg.evaluate(() => !!(RC.bd && RC.bd.A[RC.bd.i]))) { await pg.keyboard.press("Enter"); await att(250); i++; } }
    await pg.keyboard.press("Enter"); await att(400);
    const g3 = await pg.evaluate(k => ({ fautes: Object.values(scCopie(k).marques).filter(m => m.forme === "faute").length, rq: stRqVisibles(k).length }), k2.k);
    await pg.click("#rcBandeRetour"); await att(200); await pg.click("#rcFermer"); await att(300);
    await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(500);
    const dl4 = pg.waitForEvent("download"); await pg.locator("#scModale .sc-table tr").nth(k2.i + 1).locator("text=Télécharger").click(); const f4 = path.join(path.dirname(await (await dl4).path()), "eleve-marge-chargee.html"); await (await dl4).saveAs(f4); await pg.keyboard.press("Escape"); await att(200);
    const tel = await (await pg.context().browser().newContext({ viewport: { width: 390, height: 844 } })).newPage(); await tel.goto("file://" + f4); await tel.waitForTimeout(800); await tel.click(".passer").catch(() => {}); await tel.waitForTimeout(400);
    const mm = await tel.evaluate(() => { const S = Array.from(document.querySelectorAll("#col .pas2 span")), E = S.map(e => e.getBoundingClientRect()); let x = 0; E.forEach((a, i) => E.slice(i + 1).forEach(c => { if (a.left < c.right && c.left < a.right && a.top < c.bottom && c.top < a.bottom) x++; }));
      const rangs = new Set(Array.from(document.querySelectorAll("#col .pas2")).map(e => Math.round(e.getBoundingClientRect().top))).size, P = document.querySelector("#col .pas2") ? document.querySelector("#col .pas2").closest(".pg") : null;
      return { n: S.length, numeros: S.filter(e => e.classList.contains("rqn")).length, rangs, x, ecran: E.filter(r => r.left < 0 || r.right > innerWidth).length, h: P ? getComputedStyle(P).getPropertyValue("--h").trim() : "", decalage: P ? P.style.marginLeft || "0" : "", large: document.documentElement.scrollWidth <= innerWidth + 1 }; });
    await tel.screenshot({ path: path.join(out, "C14-71-eleve-telephone-marge-chargee.png") }); await tel.context().close();
    verif("l’export suivant : " + seul3 + " copie déjà corrigée, partie pour ses seuls stickers (sa liste était coupée) ; fichier de l’élève (1.4.17, C14 546) : une marge chargée au téléphone — le retour de l’IA (« " + m3.slice(0, 90) + " »), la bande jusqu’au bout (" + g3.fautes + " fautes gardées, " + g3.rq + " remarques) ; dans la marge : " + mm.n + " pastilles et numéros (" + mm.numeros + " numéros) sur " + mm.rangs + " rangs, à la hauteur d’une ligne de la copie (" + mm.h + "), " + mm.x + " chevauchement, " + mm.ecran + " hors de l’écran, photo décalée de " + mm.decalage + ", pas de défilement de côté : " + mm.large,
      (!c1 || seul3 >= 1) && g3.fautes >= 6 && g3.rq >= 2 && mm.n >= 8 && mm.numeros >= 2 && mm.rangs >= 4 && mm.x === 0 && mm.ecran === 0 && /px$/.test(mm.h) && mm.large); }
}
