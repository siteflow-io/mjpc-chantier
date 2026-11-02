// [C14] la sauvegarde JSON, étendue à tout (Paul 01/11 13:12 : « Quand un paquet est complètement corrigé, l'App propose un téléchargement du json de sauvegarde en local et le range aussi au hub. »)
// Seulement des gestes ; les évaluations lisent l'état, le DOM, le fichier téléchargé et le site simulé. Épreuve en dernier : elle marque absents tous les élèves sauf un.
import fs from "node:fs";
export async function eprouverSauvegarde({ pg, verif, cap, att }) {
  await pg.bringToFront();
  const fermerTout = async () => { if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); }
    if (await pg.evaluate(() => SC.ouvert)) { await pg.locator('button[onclick="scFermer()"]').click(); await att(1000); } };
  const sansPhrase = async () => { await att(150); if (await pg.evaluate(() => typeof RC !== "undefined" && !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(350); } };
  const ouvrirScans = async () => { await pg.click("#btnScan"); await pg.locator("#scanEcran").waitFor({ state: "visible" }); await att(1500); if (await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert)) { await pg.click("#rcFermer"); await att(300); } };
  await fermerTout(); await pg.locator("#gridEleves .eleve-card").first().waitFor({ state: "visible" });
  await ouvrirScans();
  // la copie qui finira le paquet : une copie chargée à qui il reste au moins un arrêt à décider (ou sa phrase)
  const choix = await pg.evaluate(() => { const Q = scCopiesED(), F = Q.map(k => ({ k, f: rcFluxCopie(k), reste: rcArretsBande(k).filter(a => a.st ? !stDecision(k, a.stId) : !(a.l.decisions && a.l.decisions[a.cle])).length })).filter(x => x.f.charge && (x.reste > 0 || !x.f.finie || stRqARelire(x.k)));
    F.sort((a, b) => (a.reste > 0 ? 0 : 1) - (b.reste > 0 ? 0 : 1) || a.reste - b.reste);   /* une copie dont la bande reste à finir d'abord : le dernier geste est dans la bande */ const k0 = F.length ? F[0].k : Q.find(k => rcFluxCopie(k).charge && rcLignesEcrites(k).some(x => typeof x.l.corrige === "string"));   /* tout est déjà fini : une ligne retapée fera un arrêt de plus */
    return { kS: k0 || null, nom: k0 ? nomEleveDe(k0) : "", reste: F.length ? F[0].reste : 0, retaper: !F.length, Q, base: svPaquet() }; });
  await fermerTout();
  // tous les autres élèves du paquet marqués absents, par le geste (clic droit sur leur carte)
  let nAbs = 0;
  for (const k of choix.Q) { if (k === choix.kS) continue;
    const i = await pg.evaluate(k => Array.from(document.querySelectorAll("#gridEleves .eleve-card")).findIndex(c => eleveId(c.querySelector(".eleve-nom").textContent) === k), k); if (i < 0) continue;
    if (await pg.evaluate(i => document.querySelectorAll("#gridEleves .eleve-card")[i].classList.contains("absent"), i)) continue;
    await pg.locator("#gridEleves .eleve-card").nth(i).click({ button: "right" }); await att(200); await pg.click("#avAbsentBtn"); await att(500); nAbs++; }
  await att(1200); const titre0 = await pg.locator("#ruSousTitre").innerText();
  await ouvrirScans(); await pg.locator('#scCopie .sc-pq-el[data-k="' + choix.kS + '"] .sc-pq-vig').first().click(); await att(700);   /* [C14 404] sa copie, par sa vignette */
  await sansPhrase();
  if (choix.retaper) { const id = await pg.evaluate(() => { const x = rcLignesEcrites(RC.copie).find(y => typeof y.l.corrige === "string"); if (x && RC.page !== x.pid) rcActiverPage(x.pid); return x ? x.id : null; }); await att(200);
    const c = pg.locator('.rc-saisie[data-ligne="' + id + '"]'); await c.scrollIntoViewIfNeeded(); await c.click(); await pg.keyboard.press("End"); await pg.keyboard.type(" vraiment"); await pg.keyboard.press("Enter"); await att(500); }   /* Paul retape une ligne : un mot que l'IA n'a pas vu devient un arrêt */
  const avant = await pg.evaluate(() => ({ paquet: svPaquet(), modale: document.getElementById("scModale").classList.contains("show"), base: SC.svComplet, copie: RC.copie }));
  const modale = () => pg.evaluate(() => document.getElementById("scModale").classList.contains("show"));
  let parPhrase = false; if (await pg.evaluate(k => !rcFluxCopie(k).finie, choix.kS)) { await pg.click("#rcPhraseOuvrir"); await att(250); await pg.click("#rcPhraseAucune"); await att(600); parPhrase = await modale(); }
  if (!parPhrase) { await pg.click("#rcBandeOuvrir"); await att(500); }
  let n = 0; for (; n < 400 && !parPhrase; n++) { if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) break; await pg.keyboard.press("Enter"); await att(60); }
  await att(1500);
  const mo = await pg.evaluate(() => ({ txt: document.querySelector("#scModale .sc-modale-c").innerText.replace(/\s+/g, " "), hub: (document.getElementById("svHub") || {}).textContent || "", bouton: !!document.getElementById("svTelechargerBtn"), titres: Array.from(document.querySelectorAll("#scModale button")).every(b => (b.title || "").length > 20) }));
  await cap("C14-sauvegarde-1-paquet-corrige");
  const dl1 = pg.waitForEvent("download"); await pg.click("#svTelechargerBtn"); const d1 = await dl1, j1 = JSON.parse(fs.readFileSync(await d1.path(), "utf8"));
  await att(200); const btn1 = await pg.locator("#svTelechargerBtn").textContent(); await cap("C14-sauvegarde-2-telechargee");
  await att(2500);   // les écritures du dernier geste arrivent au site
  const site = await pg.evaluate(() => Promise.all([window.__FAUX_HUB_FETCH("https://x.firebasedatabase.app/redactions/" + RU.id + ".json").then(r => r.json()), window.__FAUX_HUB_FETCH("https://x.firebasedatabase.app/sauvegardes/redactions/" + RU.id + ".json").then(r => r.json())])
    .then(([d, s]) => ({ d: JSON.stringify(scFb(d)), s: s ? Object.keys(s) : [], sv: s ? JSON.stringify(scFb(Object.values(s)[0])) : "", id: RU.id, classe: RU.classe })));
  const egal = JSON.stringify(j1.data) === site.d, rangee = site.s.length === 1 && site.sv === await pg.evaluate(o => JSON.stringify(scFb(o)), j1), c = j1._meta.contenu || {};   /* comparés sous la forme du site (clés rangées) */
  // ce que le fichier dit qu'il contient, recompté ici sur ses données
  const C = ((j1.data.copies || {})[site.classe]) || {}, ks = Object.keys(C), rc = k => ((C[k] || {}).scan || {}).recopie || {};
  const recompte = { copies: ks.length, envoyees: ks.filter(k => !!rc(k).envoi).length, phrases: ks.filter(k => !!rc(k).phrase).length, stickersGrille: Object.keys((j1.data.config || {}).stickers || {}).length, pages: Object.keys((((j1.data.scan || {})[site.classe]) || {}).pages || {}).length };
  const compteJuste = Object.keys(recompte).every(x => recompte[x] === c[x]);
  // « Plus tard » : fermé ; un geste de plus ne la repropose pas ; une seule sauvegarde au site
  await pg.click('#scModale button:has-text("Plus tard")'); await att(300); if (parPhrase) { await pg.click("#rcBandeOuvrir").catch(() => {}); await att(500); }
  if (await pg.locator("#rcBandeListe li").count()) { await pg.locator("#rcBandeListe li").first().click(); await att(250); await pg.keyboard.press("Enter"); await att(800); } else { await pg.click("#rcPhraseOuvrir"); await att(250); await pg.click("#rcPhraseAucune"); await att(800); }
  const encore = await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"));
  // « 💾 Télécharger la sauvegarde » du flux, à tout moment
  await pg.keyboard.press("Escape"); await att(300); await pg.click("#rcFluxOuvrir"); await att(250);
  const dl2 = pg.waitForEvent("download"); await pg.click("#rcSauvegarde"); const d2 = await dl2, j2 = JSON.parse(fs.readFileSync(await d2.path(), "utf8"));
  await cap("C14-sauvegarde-3-depuis-le-flux"); await pg.click("#rcFluxFermer"); await att(150);
  const s2 = await pg.evaluate(() => window.__FAUX_HUB_FETCH("https://x.firebasedatabase.app/sauvegardes/redactions/" + RU.id + ".json").then(r => r.json()).then(s => s ? Object.keys(s).length : 0));
  await pg.click("#rcFermer"); await att(200); await pg.locator('button[onclick="scFermer()"]').click(); await att(1000);
  const titre1 = await pg.locator("#ruSousTitre").innerText(), carteS = await pg.evaluate(k => { const c = Array.from(document.querySelectorAll("#gridEleves .eleve-card")).find(c => eleveId(c.querySelector(".eleve-nom").textContent) === k); return c ? c.innerText.replace(/\s+/g, " ") : ""; }, choix.kS);
  const fin0 = +((titre0.match(/· (\d+)\//) || [])[1]), fin1 = +((titre1.match(/· (\d+)\//) || [])[1]);
  verif("tableau (C14 401) : la copie entièrement corrigée compte dans le compteur de la classe (« " + titre0 + " » → « " + titre1 + " ») ; sa carte : « " + carteS.slice(0, 110) + " »",
    fin1 === fin0 + (choix.retaper ? 0 : 1) && /Corrigé/.test(carteS) && /100\s?%/.test(carteS));   /* une copie déjà finie, retapée puis refinie, était déjà comptée */
  const nom = /^Sauvegarde_Redaction-.+_\d{4}-\d\d-\d\d_\d\dh\d\d\.json$/;
  verif("sauvegarde (Paul 13:12) : " + nAbs + " élèves marqués absents par le geste, il reste la copie de " + choix.nom + " (" + (choix.retaper ? "finie : une ligne retapée lui donne un arrêt de plus" : choix.reste + " arrêt" + (choix.reste > 1 ? "s" : "") + " à décider") + ") ; le paquet " + (avant.paquet.complet ? "déjà fini" : "pas fini (" + avant.paquet.ok + " / " + avant.paquet.n + ")") + " à l'ouverture ; " + (parPhrase ? "« Pas de phrase » finit la copie" : n + " Entrée dans la bande") + " : la fenêtre s'ouvre seule (« " + mo.txt.slice(0, 150) + "… ») ; « " + mo.hub + " »",
    !!choix.kS && avant.copie === choix.kS && !avant.paquet.complet && !avant.modale && n < 400 && /Le paquet est entièrement corrigé/.test(mo.txt) && /(La copie du paquet est recopiée|Les \d+ copies du paquet sont recopiées)/.test(mo.txt) && /Les photos n’y sont pas/.test(mo.txt) && /^✓ Rangée au site/.test(mo.hub) && mo.bouton && mo.titres);
  verif("sauvegarde (Paul 13:12) : « 💾 Télécharger la sauvegarde » (« " + d1.suggestedFilename() + " », « " + btn1 + " ») : toute la rédaction telle qu'elle est au site, identique (" + egal + ") ; la même rangée au site, une seule (" + site.s.length + ", identique : " + rangee + ") ; au format du « 📸 Snapshot » (« " + j1._meta.source + " ») ; elle dit ce qu'elle contient, recompté juste (" + JSON.stringify(recompte) + ")",
    nom.test(d1.suggestedFilename()) && egal && rangee && j1._meta.source === "redactions/" + site.id && !!j1.data && j1._meta.exportedBy === "sauvegarde_paquet-corrige" && compteJuste && recompte.copies >= 1 && recompte.stickersGrille >= 1 && recompte.pages >= 1 && /Téléchargée/.test(btn1));
  verif("sauvegarde (Paul 13:12) : « Plus tard » la ferme ; un geste de plus ne la repropose pas (" + !encore + ", " + s2 + " au site) ; « 💾 Télécharger la sauvegarde » du flux en refait une à tout moment (« " + d2.suggestedFilename() + " », " + (j2._meta.contenu || {}).copies + " copies)",
    !encore && s2 === 1 && nom.test(d2.suggestedFilename()) && j2._meta.exportedBy === "sauvegarde_manuelle" && JSON.stringify(j2._meta.contenu) === JSON.stringify(j1._meta.contenu));
}
