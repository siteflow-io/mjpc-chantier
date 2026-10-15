// Les contrôles de la conscience n°12 pour l'app QCM codée d'après la maquette (mandat de code, §5.3 ; protocole de l'audit du 12/10).
// L'app est servie par le faux hub du mode test (AUDITS/QCM-MODE-TEST-09-10/banc : la base partagée entre toutes les pages, par WebSocket).
// Tout passe par le geste, dans plusieurs pages à la fois : la console, une tablette partagée, le tableau, le téléphone.
// Les attendus viennent de la maquette validée (ses libellés, ses règles) et de la base elle-même, jamais de l'app contrôlée.
// usage : APP_FILE=<evaluation-qcm.staging.html> BANC=<dossier du faux hub, avec node_modules> node controles-app.js [sortie.txt]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC || path.join(__dirname, "..", "QCM-MODE-TEST-09-10", "banc"));
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const SORTIE = process.argv[2] || null;
const EV = JSON.parse(fs.readFileSync(path.join("/home/claude/mjpc-chantier/AUDITS/CONTROLES-QCM-APP", "attendus", "evaluation-essai.json")));
// (tour 673) les compétences du hub, avec leurs libellés élève, telles que la conscience les a écrites au hub le 12/10 (COMMUN §3.1)
const TAXO = JSON.parse(fs.readFileSync(path.join("/home/claude/mjpc-chantier/AUDITS/CONTROLES-QCM-APP", "attendus", "taxonomie-competences.json")));
const PORT = 8790 + Math.floor(Math.random() * 100);
const RAPPORT = []; let nb = 0, echecs = 0;
function verif(n, ok, quoi, detail) { nb++; if (!ok) echecs++; RAPPORT.push((ok ? "  ok     " : "  ÉCHEC  ") + "K" + n + " · " + quoi + (detail && !ok ? " — " + String(detail).slice(0, 300) : "")); return ok; }
const pause = ms => new Promise(r => setTimeout(r, ms));
const norm = s => (s || "").replace(/[  ]/g, " ");

// Le texte visible d'une page, cadres compris
async function texte(p) { return norm(await p.evaluate(() => { const t = [document.body.innerText]; document.querySelectorAll("iframe").forEach(f => { try { t.push(f.contentDocument.body.innerText); } catch (e) {} }); return t.join("\n"); })); }
async function attendre(p, re, ms) { const fin = Date.now() + (ms || 10000); while (Date.now() < fin) { if (re.test(await texte(p))) return true; await pause(250); } return false; }
// Clique l'élément visible (bouton, lien, élément cliquable) dont le texte correspond, dans la zone donnée (sélecteur ou index de moitié)
async function cliquer(p, re, zone) {
  const ok = await p.evaluate(([src, fl, zone]) => {
    const re = new RegExp(src, fl);
    let racine = document;
    if (typeof zone === "number") { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
      const m = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x); racine = m[zone]; if (!racine) return false; }
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const c = [...racine.querySelectorAll("button, a, [role=button], [data-va], option, label, .tc")].filter(e => vis(e) && !e.disabled && re.test((e.textContent || "").replace(/[  ]/g, " ").trim()));
    c.sort((a, b) => a.textContent.length - b.textContent.length);
    if (!c[0]) return false; document.querySelectorAll("[data-ctl]").forEach(x => x.removeAttribute("data-ctl")); c[0].setAttribute("data-ctl", "1"); return true;
  }, [re.source, re.flags, zone === undefined ? null : zone]);
  if (!ok) return false;
  await p.click("[data-ctl='1']", {timeout: 3000}).catch(() => {});
  await pause(400);
  return true;
}
async function fermeOuvert(p, re) { return p.evaluate(([src, fl]) => { const re = new RegExp(src, fl); const b = [...document.querySelectorAll("button")].find(e => re.test(e.textContent || "")); return b ? (b.disabled || /ferm|disabled|lock/i.test(b.className) ? "fermé" : "ouvert") : "absent"; }, [re.source, re.flags]); }
async function moities(p) { return (await p.evaluate(() => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
  return all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x).map(e => e.innerText); })).map(norm); }
// Taper au clavier de l'app (ses touches sont des boutons), sinon au clavier de l'ordinateur
async function taper(p, moitie, placeholder, valeur) {
  const ok = await p.evaluate(([i, ph]) => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
    const m = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[i]; if (!m) return false;
    const f = [...m.querySelectorAll("input")].find(x => (x.placeholder || "").includes(ph)); if (!f) return false; document.querySelectorAll("[data-champ]").forEach(x => x.removeAttribute("data-champ")); f.setAttribute("data-champ", "1"); return true; }, [moitie, placeholder]);
  if (!ok) return false;
  await p.click("[data-champ='1']").catch(() => {});
  const avecTouches = await p.evaluate(() => document.querySelectorAll(".tc").length > 0);
  for (const c of valeur) {
    if (avecTouches) { const fait = await cliquer(p, new RegExp("^" + c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"), moitie); if (!fait) await p.keyboard.type(c); }
    else await p.keyboard.type(c);
  }
  return true;
}

(async () => {
  // La base de départ : la fausse classe du faux hub (25 élèves, leurs codes) et l'évaluation d'essai de la maquette, complète
  const B = buildTree();
  B.tree.qcm.evaluations = Object.assign({}, B.tree.qcm.evaluations, {essai: EV});
  B.tree.taxonomie = Object.assign({}, B.tree.taxonomie, {competences: TAXO});
  const srv = await startServer(B.tree, PORT, () => {});
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  async function ouvrir(q, w, h) { const ctx = await navig.newContext({viewport: {width: w, height: h}}); await installRoutes(ctx, {...srv, port: PORT}, null);
    const p = await ctx.newPage(); const err = []; p.on("pageerror", e => err.push(e.message)); p.on("dialog", d => { err.push("boîte système : " + d.type()); d.dismiss().catch(() => {}); });
    await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html" + q); await pause(1500); p.__err = err; return p; }
  const t0 = Date.now();
  const codeDe = nom => B.eleves.find(e => e.nomComplet === nom).code;
  try {
    const prof = await ouvrir("?mode=prof", 1536, 864);
    // K1 — lancer la séance de la classe, sur l'évaluation d'essai, par le geste
    await cliquer(prof, /^Pilotage$/);
    await prof.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].find(x => /3 ESSAI/.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); } } });
    await pause(300);
    await prof.evaluate(() => { for (const s of document.querySelectorAll("select")) { const o = [...s.options].find(x => /Évaluation d'essai/.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event("change", {bubbles: true})); } } });
    await pause(300);
    await cliquer(prof, /Lancer la séance/);
    await pause(800);
    await cliquer(prof, /Lancer la séance/);   // l'appel, puis le départ (comme dans la maquette : c-lancer, puis c-appel)
    await pause(1200);
    const actives = srv.store.get("qcm/sessionActive") || {};
    verif(1, Object.keys(actives).length > 0, "« 🚀 Lancer la séance » écrit une séance active dans la base", JSON.stringify(actives).slice(0, 200));

    // ===== Sonde « œil » (conscience n°12, 13/10 14:35) : une tablette où personne n'est entré, Q1 lancée =====
    const CAP = process.env.CAP;
    const tab = await ouvrir("?mode=eleve", 1280, 800);
    await attendre(tab, /Identifie-toi/, 10000);   // reprise 7, point 13 : plus de « Combien êtes-vous »
    await tab.screenshot({path: CAP + "/1-tablette-avant-q1.png"});
    await cliquer(prof, /Lancer Q1/); await pause(2500);
    const tTab = (await texte(tab)).replace(/\n/g, " ⏎ ");
    await tab.screenshot({path: CAP + "/2-tablette-apres-q1.png"});
    RAPPORT.push("  info   la vraie tablette, personne d'entré, Q1 lancée : " + tTab.slice(0, 300));
    verif(30, !/QUESTION 1/i.test(tTab) && /Combien êtes-vous|Identifie-toi/.test(tTab), "la vraie tablette reste à l'entrée tant que personne n'est entré (Q1 lancée)", tTab.slice(0, 200));
    const tProf = (await texte(prof)).replace(/\n/g, " ⏎ ");
    RAPPORT.push("  info   la console, carte des tablettes : " + (tProf.match(/Tablette 1.{0,260}/) || ["?"])[0]);
    await prof.screenshot({path: CAP + "/3-console-q1.png", fullPage: true});
    const oeil = await prof.evaluate(() => { const b = [...document.querySelectorAll("button.tab-oeil")].find(x => x.getBoundingClientRect().width > 0); if (!b) return false; b.setAttribute("data-oeil", "1"); return true; });
    if (oeil) await prof.click("[data-oeil='1']").catch(() => {});
    await pause(1500);
    const tFen = (await prof.evaluate(() => { const f = document.querySelector(".voir-tab"); const m = f && f.closest(".modal, .fenetre, [role=dialog]") || f; return m ? m.innerText : ""; })).replace(/\n/g, " ⏎ ");
    await prof.screenshot({path: CAP + "/4-console-oeil.png"});
    RAPPORT.push("  info   « 👁 » de la tablette 1 : " + tFen.slice(0, 400));
    verif(31, !!oeil, "le bouton « 👁 » d'une tablette existe et s'ouvre");
    verif(32, !/QUESTION 1/i.test(tFen), "« 👁 » montre ce que montre la vraie tablette (pas la question, puisque personne n'est entré)", tFen.slice(0, 300));
  } catch (e) { verif(0, false, "la sonde s'est arrêtée", e.stack); }
  await navig.close(); await srv.close();
  const txt = "Sonde œil — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString() + "\nDurée : " + Math.round((Date.now() - t0) / 1000) + " s · vérifications : " + nb + " · échecs : " + echecs + "\n" + RAPPORT.join("\n") + "\n";
  if (SORTIE) fs.writeFileSync(SORTIE, txt);
  process.stdout.write(txt);
  process.exit(0);
})();
