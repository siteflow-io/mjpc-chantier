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
  // [1.4.13] (Paul 01/11 09:17 : « Comment charger une copie d'élève seule, après avoir chargé un paquet? ») : depuis la carte d'un élève sans copie, « 📄 Charger sa copie »
  globalThis.BANC_COPIE_SEULE = Buffer.from(await pg.evaluate(() => { const c = document.createElement("canvas"); c.width = 1240; c.height = 1754; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, 1240, 1754); x.fillStyle = "#1d2a5a"; x.font = "italic 40px serif";
    ["Le 12 mars 1916, dans la tranchée", "Ma chère maman, je t'écris enfin", "le froid ne nous quitte plus et la boue", "monte jusqu'aux genoux. Hier soir", "les obus sont tombés toute la nuit", "mais je pense à vous tous et à la ferme", "Embrasse ma petite sœur pour moi"].forEach((t, i) => x.fillText(t, 140, 260 + i * 92)); return c.toDataURL("image/png").split(",")[1]; }), "base64");
  const s4 = await pg.evaluate(() => { const L = Array.from(document.querySelectorAll("#gridEleves .eleve-card")), i = L.findIndex(c => { const n = c.querySelector(".eleve-nom"); return n && !scPagesDe(eleveId(n.textContent)).length; }); return { i, nom: L[i].querySelector(".eleve-nom").textContent, k: eleveId(L[i].querySelector(".eleve-nom").textContent), pages: Object.keys(SC.pages).length }; });
  await pg.locator("#gridEleves .eleve-card").nth(s4.i).click(); await att(800);
  const ch4 = pg.waitForEvent("filechooser"); await pg.click("#avChargerSa"); await (await ch4).setFiles({ name: "copie-seule.png", mimeType: "image/png", buffer: globalThis.BANC_COPIE_SEULE });
  await pg.waitForFunction(() => typeof RC !== "undefined" && RC.ouvert, null, { timeout: 30000 }).catch(() => {}); await att(1200);
  const o4 = await pg.evaluate(k => ({ scans: SC.ouvert, recopie: typeof RC !== "undefined" && !!RC.ouvert, copie: typeof RC !== "undefined" ? RC.copie : null, pages: scPagesDe(k).length, tout: Object.keys(SC.pages).length, source: scPagesDe(k).every(p => p.source), initiales: SC.attrib, mot: (document.getElementById("toast") || {}).textContent || "" }), s4.k);
  await cap("C14-54-charger-sa-copie");
  verif("carte (1.4.13) : la carte de " + s4.nom + ", sans copie : « 📄 Charger sa copie », une photo choisie ; sa page lui est donnée d'office (" + o4.pages + " page, " + (o4.tout - s4.pages) + " nouvelle au paquet, avec son origine : " + o4.source + "), sans les initiales (" + !o4.initiales + ") ; sa copie s'ouvre, dans la recopie (" + (o4.recopie && o4.copie === s4.k) + ") ; « " + o4.mot + " »",
    o4.scans && o4.recopie && o4.copie === s4.k && o4.pages === 1 && o4.tout === s4.pages + 1 && o4.source && !o4.initiales && new RegExp("Copie de " + s4.nom + " chargée : 1 page").test(o4.mot));
  await pg.click("#rcFermer"); await att(250); await pg.locator('button[onclick="scFermer()"]').click(); await att(800);
}
// [C14 1.4.13] (Paul 31/10 17:09 ; 01/11 08:04 : « Mes photos/pdf de copies sont sur clef usb. Je peux designer un dossier ( celui des copies) et l'App retrouve les copies ? Il faudrait que
// les feuilles des copies se voient attribuer un identifiant interne alors ? » ; 08:27 : « est ce que je peux supprimer une copie pour un ou des élèves ? Typiquement mauvaise qualité, je veux la refaire »)
// Chaque feuille garde l'identité de son premier chargement ; son origine (le contenu de son fichier, le numéro de sa page) la retrouve sur un autre ordinateur, même si l'image s'y calcule autrement.
export async function eprouverAutreOrdinateur({ pg, verif, cap, att, dir }) {
  const fs = await import("node:fs"), os = await import("node:os"), path = await import("node:path");
  if (!(await pg.evaluate(() => SC.ouvert))) { await pg.click("#btnScan"); } await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1200);
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
  const photo = () => pg.evaluate(() => ({ pages: Object.values(SC.pages).filter(p => p && p.id).map(p => ({ id: p.id, eleve: p.eleve || null, w: p.w, h: p.h, retouche: !!(p.angle || p.recadre), source: !!p.source })),
    marques: JSON.stringify(Object.keys(state.copies).map(k => Object.values(((state.copies[k] || {}).scan || {}).marques || {}).map(m => m.id + ":" + m.x0.toFixed(4) + ":" + m.y0.toFixed(4)).sort())),
    recopie: JSON.stringify(Object.keys(state.copies).map(k => Object.keys((((state.copies[k] || {}).scan || {}).recopie || {}).pages || {}).length)) }));
  const avant = await photo();
  // « 🗑 Retirer les photos » de la copie affichée : seulement de ce navigateur
  const r0 = await pg.evaluate(() => { const k = scK(), P = scPagesDe(k); return { k, nom: nomEleveDe(k), ids: P.map(p => p.id), avec: P.filter(p => SC.imgs[p.id]).length }; });
  await pg.click('.sc-passe >> nth=0'); await att(300); await pg.click('#scPanneau >> text=Retirer les photos'); await att(250); await pg.click('#scRetirerOui'); await att(800);
  const r1 = await pg.evaluate(async r => { const db = await scDb(); const n = await new Promise(res => { const q = db.transaction("pages").objectStore("pages").getAll(); q.onsuccess = () => res(q.result.filter(o => r.ids.includes(o.id)).length); });
    return { avec: r.ids.filter(id => SC.imgs[id]).length, idb: n, meta: r.ids.filter(id => SC.pages[id] && SC.pages[id].eleve === r.k).length, recopie: Object.keys((((state.copies[r.k] || {}).scan || {}).recopie || {}).pages || {}).length }; }, r0);
  verif("feuilles (1.4.13) : « 🗑 Retirer les photos » de la copie de " + r0.nom + " : ses " + r0.avec + " photos quittent ce navigateur (" + r1.avec + " ici, " + r1.idb + " gardées) ; ses " + r1.meta + " feuilles restent à elle, au site, et sa recopie reste (" + r1.recopie + " page" + (r1.recopie > 1 ? "s" : "") + ")",
    r0.avec >= 1 && r1.avec === 0 && r1.idb === 0 && r1.meta === r0.ids.length);
  // un autre ordinateur : aucune photo, et une image qui se calcule autrement (un point de l'empreinte 16 × 16 change) ; le dossier de la clé, sans mémoire du navigateur
  await pg.evaluate(() => new Promise(res => { (SC.dbp || Promise.resolve(null)).then(db => { try { db && db.close(); } catch (e) {} const r = indexedDB.deleteDatabase("mjpc_scans"); r.onsuccess = r.onerror = r.onblocked = () => res(); }); }));
  await pg.reload(); await pg.locator("#gridEleves .eleve-card").first().waitFor({ state: "visible", timeout: 20000 }); await att(800);
  await pg.evaluate(() => { const g = CanvasRenderingContext2D.prototype.getImageData; CanvasRenderingContext2D.prototype.getImageData = function (x, y, w, h) { const d = g.call(this, x, y, w, h); if (w === 16 && h === 16) for (let i = 0; i < 3; i++) d.data[i] = 255 - d.data[i]; return d; }; window.showDirectoryPicker = undefined; });
  if (!(await pg.evaluate(() => SC.ouvert))) { await pg.click("#btnScan"); } await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1200);
  if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
  const sans = await pg.evaluate(() => Object.keys(SC.imgs).length);
  const D = fs.mkdtempSync(path.join(os.tmpdir(), "cle-")); for (const n of ["paquet-essai.pdf", "paquet-reperes.pdf"]) fs.copyFileSync(path.join(dir, n), path.join(D, n)); fs.copyFileSync(path.join(dir, "banc/recopie-lignes-essai.png"), path.join(D, "recopie-lignes-essai.png"));
  if (globalThis.BANC_PHOTO_REFAITE) fs.writeFileSync(path.join(D, "photo-refaite.png"), globalThis.BANC_PHOTO_REFAITE);
  if (globalThis.BANC_COPIE_SEULE) fs.writeFileSync(path.join(D, "copie-seule.png"), globalThis.BANC_COPIE_SEULE);   // la copie chargée seule, depuis la carte de son élève   // la photo refaite est sur la clé, à côté de l'ancienne
  fs.writeFileSync(path.join(D, "nouvelle-copie.png"), Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64"));
  const choix = pg.waitForEvent("filechooser"); await pg.click('#scanEcran .sc-haut >> text=Mon dossier'); const fc = await choix; await fc.setFiles(D);
  await pg.waitForFunction(n => Object.keys(SC.imgs).length >= n, avant.pages.filter(p => p.source).length, { timeout: 90000 }).catch(() => {}); await att(2000);
  const inconnu = await pg.evaluate(() => { const m = document.getElementById("scModale"); return m && getComputedStyle(m).display !== "none" ? m.textContent.replace(/\s+/g, " ").slice(0, 400) : ""; });
  const mot = await pg.evaluate(() => Array.from(document.querySelectorAll(".toast, #toast, [class*=toast]")).map(e => e.textContent).join(" ").replace(/\s+/g, " "));
  await cap("C14-46-autre-ordinateur"); await pg.keyboard.press("Escape"); await att(200);
  const apres = await photo(), vus = await pg.evaluate(() => Object.keys(SC.imgs).filter(id => SC.pages[id]).length);
  const revenues = apres.pages.filter(p => avant.pages.some(q => q.id === p.id)), justes = revenues.filter(p => { const a = avant.pages.find(q => q.id === p.id); return a.eleve === p.eleve && a.w === p.w && a.h === p.h; });
  const sources = avant.pages.filter(p => p.source).length, nouvelles = apres.pages.length - avant.pages.length;
  verif("feuilles (1.4.13) : sur un autre ordinateur, sans aucune photo (" + sans + ") et avec une empreinte d'image calculée autrement, « 📂 Mon dossier de copies » relit la clé : les " + sources + " feuilles qui ont leur origine reviennent par elle, sous leur identité de toujours, à leur élève et à leur taille (" + vus + " photos, " + justes.length + " sur " + revenues.length + "), retouches comprises (" + revenues.filter(p => p.retouche).length + ") ; marques et recopies identiques (" + (apres.marques === avant.marques && apres.recopie === avant.recopie) + ") ; aucune feuille en double (" + nouvelles + ") ; l'ancienne photo d'une feuille remplacée reste de côté (" + (/1 ancienne photo remplacée, laissée de côté/.test(mot) && !/recopie-lignes-essai/.test(inconnu)) + ") ; le fichier inconnu est montré, rien n'est chargé sans toi (« " + inconnu.slice(0, 70) + " »)",
    sans === 0 && sources >= 9 && vus >= sources && justes.length === revenues.length && revenues.some(p => p.retouche) && apres.marques === avant.marques && apres.recopie === avant.recopie && nouvelles === 0 && /1 ancienne photo remplacée, laissée de côté/.test(mot) && !/recopie-lignes-essai/.test(inconnu) && /1 fichier que cette rédaction ne connaît pas/.test(inconnu) && /nouvelle-copie\.png/.test(inconnu));
}
