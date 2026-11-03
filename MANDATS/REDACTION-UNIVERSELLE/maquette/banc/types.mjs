// [C14 1.4.30] (Paul 03/11 00:39 : « tu ne trouves pas quelque chose de bizarre, notamment sur les mots manquants? » ; 00:53 : « tu me fais juste 99 pour que demain les élèves
// aient des fichiers qui ne racontent pas n'importe quoi »). L'IA écrit {M} après des mots qu'elle a corrigés (au site : « augmentent{M} », « soigner{M} ») ; l'app le prenait tel quel.
// Joué après les points : une copie de plus recopiée comme une vraie lettre, exportée, son retour collé avec les lettres de l'IA telles qu'on les a trouvées au site ;
// la bande au clavier (le type de chaque arrêt lu sur sa carte) ; le fichier de l'élève (« 🧪 Tester comme l'élève ») ; puis une copie corrigée avec la 1.4.29,
// dont une faute porte « M » : son fichier, sa carte, sa bande. Tout par le geste ; les évaluations lisent l'écran, l'état et le fichier de l'élève.
const FAUTIF = ["Les prix augmentes chaque semaine et le pain manque,", "le major refuse de soigné les blessés qui arrive,", "la guerre se gagnera la force des soldats français.",
  "Tout va mal auquel s'ajoute la faim, et nous , attendons."];
const CORR = ["Les prix augmentent{M} chaque semaine et le pain manque,", "le major refuse de soigner{M} les blessés qui arrivent{G},", "la guerre se gagnera par{M} la force des soldats français.",
  "Tout va mal,{P} à{M} quoi{G} s'ajoute la faim, et nous {X} attendons."];
export async function eprouverTypes({ pg, verif, cap, att }) {
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
  /* le fichier de l'élève, comme il le verra : les étiquettes de « La langue » (« ∅ Mot manquant · 2 ») et les pastilles de la marge */
  const fichier = async (k, nom) => { await fermerTout(); await scans(); const i0 = await pg.evaluate(k => scCopiesED().indexOf(k), k);
    await pg.click('#scanEcran .sc-haut >> text=Fichiers École Directe'); await att(900);
    const pop = pg.waitForEvent("popup"); await pg.locator("#scModale .sc-table tr").nth(i0 + 1).locator("text=Tester comme l'élève").click(); const w = await pop; await w.waitForLoadState(); await w.waitForTimeout(1200); await w.click(".passer").catch(() => {}); await w.waitForTimeout(600);
    const r = await w.evaluate(() => ({ tys: Array.from(document.querySelectorAll("#pan .ty")).map(e => e.innerText.replace(/\s+/g, " ").trim()), pas: Array.from(document.querySelectorAll("#col .pas2 span:not(.rqn), #col .pas span:not(.rqn)")).map(e => e.textContent.trim()) }));
    if (nom) await cap(nom, w); await w.close(); await modale(); return r; };
  const compte = (tys, mot) => { const t = tys.find(x => x.includes(mot)); const m = t && t.match(/(\d+)\s*$/); return m ? +m[1] : 0; };
  // une copie de plus, présente, avec sa photo : quatre lignes recopiées, telles qu'une élève les écrit
  await fermerTout(); await pg.click('#ruOnglets [data-o="pilotage"]').catch(() => {}); await att(300); await pg.click('#ruSous [data-s="correction"]').catch(() => {}); await att(500);
  let kT = await pg.evaluate(() => SC.copies.find(k => scPagesDe(k).length && !(typeof avAbsent === "function" && avAbsent(k)) && !rcLignesEcrites(k).length) || null);
  if (!kT) { const i = await pg.evaluate(() => Array.from(document.querySelectorAll("#gridEleves .eleve-card")).findIndex(c => c.classList.contains("absent") && scPagesDe(eleveId(c.querySelector(".eleve-nom").textContent)).length && !rcLignesEcrites(eleveId(c.querySelector(".eleve-nom").textContent)).length));
    if (i >= 0) { await pg.locator("#gridEleves .eleve-card").nth(i).click({ button: "right" }); await att(250); await pg.click("#avAbsentBtn"); await att(900); }
    kT = await pg.evaluate(() => SC.copies.find(k => scPagesDe(k).length && !(typeof avAbsent === "function" && avAbsent(k)) && !rcLignesEcrites(k).length) || null); }
  if (!kT) { verif("1.4.30 : une copie présente, avec sa photo, pas encore recopiée", false); return; }
  await recopie(); await choisir(kT); { const p0 = await pg.evaluate(k => scPagesDe(k)[0].id, kT); if (await pg.evaluate(p => RC.page !== p, p0)) { await pg.selectOption("#rcPage", { index: 0 }); await att(500); } }
  const L = await pg.evaluate(() => Array.from(document.querySelectorAll("#rcFeuille .rc-saisie[data-ligne]")).filter(e => e.offsetParent && e.getBoundingClientRect().height > 4 && !e.disabled).slice(0, 4).map(e => e.dataset.ligne));
  if (L.length < 4) { verif("1.4.30 : quatre lignes sur la première page de la copie (" + L.length + ")", false); return; }
  for (let i = 0; i < 4; i++) { const c = pg.locator('#rcFeuille .rc-saisie[data-ligne="' + L[i] + '"]'); await c.scrollIntoViewIfNeeded({ timeout: 5000 }); await c.fill(FAUTIF[i]); await att(250); }
  await pg.click("#rcPhraseOuvrir"); await att(250); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } if (await pg.evaluate(() => !!RC.phrase)) { await pg.keyboard.press("Escape"); await att(200); }
  // l'export, puis le retour de l'IA avec ses lettres : {M} après deux mots qu'elle a corrigés, {M} vrai, {P} devant des mots, {X} pour une virgule retirée
  const exs = []; for (let i = 0; i < 6; i++) { const e = await exporter(); if (!e) break; exs.push(e); }
  const idT = await pg.evaluate(k => state.copies[k].id, kT), cT = exs.flatMap(e => e.copies).find(c => c.copie === idT);
  if (!cT) { verif("1.4.30 : la copie part à l’IA (" + exs.length + " envoi(s))", false); return; }
  const ret = { format: "mjpc-recopie-ia-3", lignes: {}, reussites: {}, aReprendre: {}, commentaires: {} };
  exs.flatMap(e => e.copies).forEach(c => { c.pages.flatMap(p => p.lignes).forEach(l => { const i = L.indexOf(l.id); if (!c.seulementStickers) ret.lignes[l.id] = i >= 0 ? CORR[i] : l.texte; }); ret.reussites[c.copie] = [{ s: "fin" }]; ret.commentaires[c.copie] = "Relis chaque faute soulignée, puis récris dans ton cahier la phrase où elle se trouve."; });
  /* [C14 1.4.31] (Paul 07:53, 08:11) comme au site : l'IA cite les mêmes mots pour trois stickers d'une même ligne de la grille ;
     [C14 1.4.33] (Paul 19:45 : « quand ils cliquent sur les erreurs de langue et qu'il y a un cadre, le cadre affiche son commentaire à droite ») des mots où se trouve une faute (« augmentes ») */
  const TROIS = await pg.evaluate(() => { const G = {}; stActifs().filter(s => s.etat === "valide" && s.portee !== "lettre" && !stDesParagraphes(s)).forEach(s => { (G[s.ligne] = G[s.ligne] || []).push(s.num); }); return (Object.values(G).find(v => v.length >= 3) || []).slice(0, 3); });
  ret.reussites[idT] = TROIS.map(n => ({ s: n, l: L[0], m: "Les prix augmentes chaque semaine" })).concat([{ s: "fin" }]);
  const m1 = await charger(ret);
  // la bande, au clavier : à chaque arrêt, le type lu sur sa carte
  await choisir(kT); await pg.click("#rcBandeOuvrir"); await att(600); if (await pg.evaluate(() => RC.bd && RC.bd.attente)) { await pg.keyboard.press("Enter"); await att(300); }
  const vus = [];
  for (let i = 0; i < 40; i++) { const e = await pg.evaluate(() => { const c = document.querySelector("#rcBandeCarte"), a = RC.bd && RC.bd.A[RC.bd.i];
      return { fin: !!RC.bd && !a && /✓ Copie corrigée/.test(c ? c.textContent : ""), k: RC.bd && RC.bd.k, mot: a && !a.st ? (a.g.eleve || "∅") + " → " + (a.g.corrige || "∅") : null, type: a && !a.st ? ((c.querySelector(".rc-bande-type") || {}).textContent || "") : null }; });
    if (e.fin || !e.k) break; if (e.mot && !vus.some(v => v.mot === e.mot)) { vus.push({ mot: e.mot, type: e.type }); if (/augmentes/.test(e.mot)) await cap("C14-1430-bande-augmentes"); }
    await pg.keyboard.press("Enter"); await att(260); }
  const ty = m => (vus.find(v => v.mot.startsWith(m)) || {}).type || "?";
  const S = await pg.evaluate(k => ({ corrigee: svCopieCorrigee(k), pct: (scAvancement(k) || {}).pct, bilan: avFautes(k) }), kT);
  verif("1.4.30 (C14 94) : le retour chargé (« " + m1.slice(0, 90) + " ») ; dans la bande, chaque arrêt dit le type de ses mots : « augmentes → augmentent » : " + ty("augmentes") + " ; « soigné → soigner » : " + ty("soigné") + " ; « ∅ → par » : " + ty("∅ → par") + " ; « auquel → , à quoi » : " + ty("auquel") + " ; « , → ∅ » : " + ty(", → ∅") + " ; la copie corrigée au clavier (" + S.corrigee + ", " + S.pct + " %) ; son bilan " + JSON.stringify(S.bilan),
    ty("augmentes") !== "?" && !/Mot manquant/.test(ty("augmentes")) && /Grammaire/.test(ty("soigné")) && /Mot manquant/.test(ty("∅ → par")) && /Mot manquant/.test(ty("auquel")) && /Ponctuation/.test(ty(", → ∅")) && S.corrigee && S.pct === 100 && S.bilan.M === 2 && !S.bilan.X);
  await pg.keyboard.press("Escape"); await att(300);
  const fT = await fichier(kT, "C14-1430-fichier-types");
  verif("1.4.30 (C14 94) : son fichier (« 🧪 Tester comme l’élève ») : « " + fT.tys.join(" · ") + " » ; dans la marge : " + fT.pas.join(" "), compte(fT.tys, "Mot manquant") === 2 && !fT.tys.some(x => /Mot en trop/.test(x)) && fT.pas.filter(x => x === "∅").length === 2);
  /* une copie corrigée avec la 1.4.29 : une faute gardée dont le retour de l'IA disait « M » (« je t'écrit → écris{M} », comme au site) ; la 1.4.29 l'écrivait ainsi dans la copie */
  const kA = await pg.evaluate(kT => SC.copies.find(k => k !== kT && svCopieCorrigee(k) && Object.values(scCopie(k).marques || {}).some(m => m.forme === "faute" && m.bande && m.bande.code === "G" && m.bande.eleve && m.bande.corrige && rcMotsDe(m.bande.eleve).length === rcMotsDe(m.bande.corrige).length)) || null, kT);
  if (!kA) { verif("1.4.30 : une copie corrigée avec une faute gardée d’un mot pour un mot", false); return; }
  const avant = await pg.evaluate(k => { const s = scCopie(k), m = Object.values(s.marques).find(m => m.forme === "faute" && m.bande && m.bande.code === "G" && m.bande.eleve && m.bande.corrige && rcMotsDe(m.bande.eleve).length === rcMotsDe(m.bande.corrige).length);
    m.bande.code = "M"; const x = rcLignesEcrites(k).find(x => x.id === m.bande.ligne); if (x) rcLigneMaj(k, x.pid, x.id, l => { l.types = Object.assign({}, l.types, { [m.bande.cle]: "M" }); l.typesDe = l.corrige; }); saveState(); return { mot: m.bande.eleve + " → " + m.bande.corrige, corrigee: svCopieCorrigee(k), pct: (scAvancement(k) || {}).pct, dec: JSON.stringify(rcLignesEcrites(k).map(x => x.l.decisions || {})), M: avFautes(k).M || 0, vraisM: Object.values(s.marques).filter(q => q.forme === "faute" && rcCodeMarque(q) === "M").length }; }, kA);
  const fA = await fichier(kA);
  await recopie(); await choisir(kA); await pg.click("#rcBandeOuvrir"); await att(600);
  const bA = await pg.evaluate(mot => { const B = RC.bd, a = B && B.A.find(x => !x.st && (x.g.eleve + " → " + x.g.corrige) === mot); return { ouverte: !!B, type: a ? RC_TYPES[rcCodeArret(a)].libelle : "?", reste: B ? rcBandeNonDecides(B).length : -1 }; }, avant.mot);
  await pg.keyboard.press("Escape"); await att(300);
  const apres = await pg.evaluate(k => ({ corrigee: svCopieCorrigee(k), pct: (scAvancement(k) || {}).pct, dec: JSON.stringify(rcLignesEcrites(k).map(x => x.l.decisions || {})), M: avFautes(k).M || 0, code: Object.values(scCopie(k).marques).filter(m => m.bande && m.bande.code === "M").length }), kA);
  verif("1.4.30 (C14 94) : une copie corrigée avec la 1.4.29, dont la faute « " + avant.mot + " » porte « M » : son fichier ne la compte pas en mot manquant (« " + fA.tys.join(" · ") + " », les vrais : " + avant.vraisM + ") ; sa bande dit « " + bA.type + " », rien à y revoir (" + bA.reste + ") ; la copie reste corrigée (" + apres.corrigee + ", " + apres.pct + " %), ses décisions n’ont pas bougé (" + (avant.dec === apres.dec) + "), rien n’est réécrit (la faute porte toujours « M » : " + apres.code + ") ; son bilan compte les seuls vrais mots manquants (" + apres.M + ")",
    compte(fA.tys, "Mot manquant") === avant.vraisM && fA.pas.filter(x => x === "∅").length === avant.vraisM && bA.type !== "?" && bA.type !== "Mot manquant" && bA.reste === 0 && apres.corrigee && apres.pct === 100 && avant.dec === apres.dec && apres.code >= 1 && apres.M === avant.vraisM);
  await fermerTout();
}
