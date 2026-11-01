// [C14 1.4.12] l'accueil de la correction dans le flux (C14 225 ; Paul 31/10 22:36 « fais tout le reste », 22:45 « la liste de ce qui ne sert à rien ») :
// la carte d'un élève montre les étapes de sa copie, son clic l'ouvre là où tu travailles ; le Bilan et les Fiches se tirent des scans ; ce qui ne sert plus est rangé.
// Seulement des gestes ; les évaluations lisent l'état et le DOM.
export async function eprouverAccueil({ pg, verif, cap, att }) {
  await pg.bringToFront();
  const k = await pg.evaluate(() => SC.copies.find(k => rcLignesEcrites(k).length));   // une copie recopiée (le banc de la recopie vient de tout effacer de l'IA et de la bande)
  const nom = await pg.evaluate(k => nomEleveDe(k), k);
  const at = await pg.evaluate(k => { const f = rcFluxCopie(k); return { lignes: f.lignes, decides: f.decides, arrets: f.arrets, finie: f.finie, charge: !!f.charge, envoi: !!(f.envoi || f.charge), fini: f.fini }; }, k);
  // la recopie est le dernier écran où tu as travaillé : la carte y rouvrira la copie
  await pg.click("#btnRecopier"); await att(500); await pg.click("#rcFermer"); await att(250);
  await pg.locator('button[onclick="scFermer()"]').click(); await att(1500);
  const log0 = await pg.evaluate(() => (window.__LOG || []).length);
  const carte = pg.locator("#gridEleves .eleve-card").filter({ hasText: nom });
  const et = (await carte.locator(".av-et").allInnerTexts()).map(t => t.trim()), coches = await carte.locator(".av-et.ok").count();
  const vus = await pg.evaluate(() => ({ classer: (() => { const b = document.getElementById("btnClasserPaquet"); return !!b && b.offsetParent !== null; })(), bilanCarte: document.querySelectorAll("#gridEleves .eleve-bilan-btn").length, sansSujet: /Sujet non choisi/.test(document.getElementById("gridEleves").textContent) }));
  await cap("C14-42-accueil-flux");
  const attendus = 1 * at.finie + 1 * at.envoi + 1 * at.charge + 1 * at.fini;
  await carte.click(); await att(2000);
  const ouvert = await pg.evaluate(k => ({ scans: SC.ouvert, recopie: typeof RC !== "undefined" && RC.ouvert, copie: typeof RC !== "undefined" ? RC.copie : null, grille: !document.getElementById("correctionView").classList.contains("hidden"), interro: document.getElementById("interroOverlay").classList.contains("show") || getComputedStyle(document.getElementById("interroOverlay")).display !== "none" }), k);
  verif("accueil (1.4.12) : la carte de " + nom + " montre les étapes de sa copie (« " + et.join(" · ") + " », " + coches + " cochées sur " + attendus + " attendues) ; plus de « 📋 Classer le paquet » (" + !vus.classer + "), ni de bilan détaillé sur les cartes (" + vus.bilanCarte + "), ni de « Sujet non choisi » (" + !vus.sansSujet + ") ; un clic sur la carte rouvre la copie là où tu travaillais, dans la recopie (" + (ouvert.recopie && ouvert.copie === k) + "), jamais la grille d'origine ni le mode interrogatif (" + (!ouvert.grille && !ouvert.interro) + ")",
    et.length === 4 && /recopiée/.test(et[0]) && (at.arrets ? new RegExp("bande " + at.decides + "/" + at.arrets) : /^bande$/).test(et[3]) && coches === attendus && !vus.classer && vus.bilanCarte === 0 && !vus.sansSujet && ouvert.scans && ouvert.recopie && ouvert.copie === k && !ouvert.grille && !ouvert.interro);
  await pg.click("#rcFermer"); await att(250); await pg.locator('button[onclick="scFermer()"]').click(); await att(1200);
  // l'onglet « Bilan » : la note, les critères et les fautes par type d'erreur, de chaque élève, puis la classe
  await pg.click('#ruOnglets [data-o="donnees"]'); await att(400); await pg.click('#ruSous [data-s="bilan"]'); await att(900);
  const bi = await pg.evaluate(k => { const v = document.getElementById("ruVue_bilan"), rows = Array.from(v.querySelectorAll("tbody tr")), f = avFautes(k), n = Object.values(f).reduce((a, b) => a + b, 0), tr = rows.find(r => r.firstElementChild.textContent === nomEleveDe(k));
    return { lignes: rows.length, eleves: state.classe.length, classe: !!v.querySelector(".av-classe"), fautes: n, lu: tr ? tr.children[3 + SC.grille.criteres.length].textContent.trim() : "?", types: v.querySelectorAll("thead .av-ty").length, crit: SC.grille.criteres.length, larg: v.scrollWidth <= document.documentElement.clientWidth + 1 }; }, k);
  await cap("C14-43-bilan-classe");
  verif("accueil (1.4.12) : l'onglet « Bilan » se tire des scans et de la bande : une ligne par élève (" + (bi.lignes - 1) + " sur " + bi.eleves + ") et la classe en bas (" + bi.classe + ") ; les " + bi.crit + " critères ; les fautes de " + nom + " comptées (" + bi.lu + ", ses marques : " + bi.fautes + "), par type d'erreur (" + bi.types + " colonnes, et « sans type ») ; sans défilement de côté de la page (" + bi.larg + ")",
    bi.lignes === bi.eleves + 1 && bi.classe && String(bi.fautes || "") === bi.lu && bi.types >= 7 && bi.larg);
  // l'onglet « Fiches élèves » : les fichiers École Directe des scans
  await pg.click('#ruSous [data-s="fiches"]'); await att(700);
  const fi = await pg.evaluate(() => ({ lignes: document.querySelectorAll("#ruVue_fiches tbody tr").length, bouton: !!document.querySelector('#ruVue_fiches button[onclick="avFichiersED()"]'), html: !!document.getElementById("ruBtnToutHTML"), eleves: state.classe.length }));
  await cap("C14-44-fiches-ed");
  const log1 = await pg.evaluate(() => (window.__LOG || []).length);
  await pg.click('#ruVue_fiches button[onclick="avFichiersED()"]'); await att(3000);
  const ed = await pg.evaluate(() => ({ scans: SC.ouvert, table: document.querySelectorAll(".sc-table tr").length }));
  verif("accueil (1.4.12) : l'onglet « Fiches élèves » mène aux fichiers École Directe : une ligne par élève (" + fi.lignes + "), plus de fiche HTML d'origine (" + !fi.html + ") ; « 📨 Fichiers École Directe » ouvre l'écran des scans et sa liste des fichiers (" + (ed.table - 1) + " élèves) ; ouvrir la classe, le Bilan et les Fiches n'écrit rien au site (" + (log1 - log0) + " écriture)",
    fi.lignes === fi.eleves && fi.bouton && !fi.html && ed.scans && ed.table >= 2 && log1 === log0);
  await pg.keyboard.press("Escape"); await att(300); await pg.locator('button[onclick="scFermer()"]').click(); await att(800);
  // une page rouverte sur un mode rangé (le mode interrogatif d'une ancienne session) revient au tableau des élèves
  await pg.evaluate(k => { state.modeOuvert = "interrogatif"; state.current = k; state.interroBookmark = Object.assign({}, state.interroBookmark || {}, { [k]: { indicIdx: 0 } }); saveState(); }, k); await att(1800);
  await pg.reload(); await pg.locator("#gridEleves .eleve-card").first().waitFor({ state: "visible", timeout: 20000 }); await att(1200);
  const rep = await pg.evaluate(() => ({ dash: !document.getElementById("dashboard").classList.contains("hidden"), grille: !document.getElementById("correctionView").classList.contains("hidden"), interro: getComputedStyle(document.getElementById("interroOverlay")).display !== "none", mode: state.modeOuvert }));
  verif("accueil (1.4.12) : une page rouverte sur le mode interrogatif rangé revient au tableau des élèves (" + rep.dash + "), sans grille d'origine ni mode interrogatif (" + (!rep.grille && !rep.interro) + ")", rep.dash && !rep.grille && !rep.interro);
  // [1.4.12.1] (Paul 01/11 08:47 : « quand je clique sur la carte d'un élève sans copie, ça affiche la copie et l'espace de correction d'un autre élève ») :
  // la recopie est le dernier écran où tu as travaillé ; la carte d'un élève sans page dans le paquet n'ouvre rien, ni les scans ni la recopie d'un autre ; une carte avec copie ouvre toujours la sienne
  await pg.evaluate(() => { state.scanDernier = "recopie"; }); await att(300);
  const i0 = await pg.evaluate(() => Array.from(document.querySelectorAll("#gridEleves .eleve-card")).findIndex(c => { const n = c.querySelector(".eleve-nom"); return n && !scPagesDe(eleveId(n.textContent)).length; }));
  const sansCopie = async (titre) => {
    const s = await pg.evaluate(i => { const L = Array.from(document.querySelectorAll("#gridEleves .eleve-card")); return { i, nom: i >= 0 ? L[i].querySelector(".eleve-nom").textContent : "", carte: i >= 0 ? L[i].innerText.replace(/\s+/g, " ") : "" }; }, i0);
    await pg.locator("#gridEleves .eleve-card").nth(s.i).click(); await att(2000);
    const o = await pg.evaluate(() => ({ scans: SC.ouvert, recopie: typeof RC !== "undefined" && !!RC.ouvert, modale: (() => { const m = document.getElementById("scModale"); return m && m.classList.contains("show") ? m.textContent.replace(/\s+/g, " ") : ""; })() }));
    if (titre) await cap(titre); if (o.modale) { await pg.click("#scModale >> text=Fermer"); await att(300); }
    return Object.assign(s, o);
  };
  const s1 = await sansCopie("C14-49-carte-sans-copie");
  await pg.evaluate(() => { AV.red = null; AV.lit = RU.id; SC.pages = {}; });   // la page vient de s'ouvrir : les pages du paquet sont en train d'être lues ; la carte les lit elle-même
  const s2 = await sansCopie(null);
  verif("carte (1.4.12.1) : la carte de " + s1.nom + ", sans page dans le paquet, le dit (« " + (s1.carte.match(/pas de copie dans le paquet/) || ["?"])[0] + " ») ; son clic n'ouvre ni les scans ni la recopie d'un autre élève (" + (!s1.scans && !s1.recopie) + "), la fenêtre dit pourquoi (« " + s1.modale.slice(0, 60) + " ») ; même chose quand les pages ne sont pas encore lues (" + (!s2.scans && !s2.recopie && s2.modale.includes(s2.nom)) + ")",
    s1.i >= 0 && /pas de copie dans le paquet/.test(s1.carte) && !s1.scans && !s1.recopie && s1.modale.includes(s1.nom) && /n'a pas de copie dans le paquet/.test(s1.modale) && !s2.scans && !s2.recopie && s2.modale.includes(s2.nom));
  const avec = await pg.evaluate(() => { const L = Array.from(document.querySelectorAll("#gridEleves .eleve-card")), i = L.findIndex(c => { const n = c.querySelector(".eleve-nom"); return n && scPagesDe(eleveId(n.textContent)).length; }); return { i, k: eleveId(L[i].querySelector(".eleve-nom").textContent) }; });
  await pg.locator("#gridEleves .eleve-card").nth(avec.i).click(); await att(2500);
  const s3 = await pg.evaluate(() => ({ scans: SC.ouvert, recopie: typeof RC !== "undefined" && !!RC.ouvert, copie: typeof RC !== "undefined" ? RC.copie : null, sc: scK() }));
  verif("carte (1.4.12.1) : la carte d'un élève qui a sa copie ouvre toujours la sienne, dans la recopie (" + (s3.recopie && s3.copie === avec.k && s3.sc === avec.k) + ")", s3.scans && s3.recopie && s3.copie === avec.k && s3.sc === avec.k);
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(250); } if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(800); }
}
// [C14 1.4.12] (Paul 31/10 17:09 : « il faudra trouver une solution pour emporter les copies d'un ordi à un autre ») : mesuré, le même paquet rechargé
// sur un autre ordinateur (ici : le même faux hub, et un navigateur sans aucune photo) rend chaque page à son élève, avec sa retouche, ta recopie et tes marques.
export async function eprouverAutreOrdinateur({ pg, verif, cap, att, dir }) {
  const avant = await pg.evaluate(() => ({ pages: Object.values(SC.pages).filter(p => p && p.id).map(p => ({ id: p.id, eleve: p.eleve || null, w: p.w, h: p.h, retouche: !!(p.angle || p.recadre) })), marques: JSON.stringify(Object.keys(state.copies).map(k => Object.values(((state.copies[k] || {}).scan || {}).marques || {}).map(m => m.id + ":" + m.x0.toFixed(4) + ":" + m.y0.toFixed(4)).sort())), recopie: JSON.stringify(Object.keys(state.copies).map(k => Object.keys((((state.copies[k] || {}).scan || {}).recopie || {}).pages || {}).length)) }));
  await pg.evaluate(() => new Promise(res => { (SC.dbp || Promise.resolve(null)).then(db => { try { db && db.close(); } catch (e) {} const r = indexedDB.deleteDatabase("mjpc_scans"); r.onsuccess = r.onerror = r.onblocked = () => res(); }); }));
  await pg.reload(); await pg.locator("#gridEleves .eleve-card").first().waitFor({ state: "visible", timeout: 20000 }); await att(800);
  if (!(await pg.evaluate(() => SC.ouvert))) { await pg.click("#btnScan"); } await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1200);
  const sans = await pg.evaluate(() => Object.keys(SC.imgs).length);
  await pg.setInputFiles("#scanEcran .sc-haut input[type=file]", (await import("node:path")).join(dir, "paquet-essai.pdf")); await pg.waitForFunction(() => Object.keys(SC.imgs).length >= 8, null, { timeout: 60000 }); await att(1500);
  const apres = await pg.evaluate(ids => ({ revenues: ids.filter(p => SC.imgs[p.id]).map(p => ({ id: p.id, eleve: (SC.pages[p.id] || {}).eleve || null, w: SC.imgs[p.id].w, h: SC.imgs[p.id].h, retouche: p.retouche })), marques: JSON.stringify(Object.keys(state.copies).map(k => Object.values(((state.copies[k] || {}).scan || {}).marques || {}).map(m => m.id + ":" + m.x0.toFixed(4) + ":" + m.y0.toFixed(4)).sort())), recopie: JSON.stringify(Object.keys(state.copies).map(k => Object.keys((((state.copies[k] || {}).scan || {}).recopie || {}).pages || {}).length)) }), avant.pages);
  const retouchees = apres.revenues.filter(p => p.retouche), justes = apres.revenues.filter(p => { const a = avant.pages.find(q => q.id === p.id); return a && a.eleve === p.eleve && a.w === p.w && a.h === p.h; });
  await cap("C14-46-autre-ordinateur");
  verif("autre ordinateur (1.4.12, mesuré) : un navigateur sans aucune photo (" + sans + ") recharge le même paquet : " + apres.revenues.length + " pages reviennent, chacune à son élève et à sa taille (" + justes.length + " sur " + apres.revenues.length + "), dont " + retouchees.length + " retouchée" + (retouchees.length > 1 ? "s" : "") + " avec sa retouche ; marques et recopies identiques (" + (apres.marques === avant.marques && apres.recopie === avant.recopie) + ")",
    sans === 0 && apres.revenues.length >= 8 && justes.length === apres.revenues.length && retouchees.length >= 1 && apres.marques === avant.marques && apres.recopie === avant.recopie);
}
