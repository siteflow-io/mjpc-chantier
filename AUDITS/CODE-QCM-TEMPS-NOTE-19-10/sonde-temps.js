// SONDE DE LA CONSCIENCE N°12 — 28, le temps tapé (19/10, Paul 09:43 : « 28: oui »).
// Les contrôles fixés d'avance dans la section de DEFAUTS-OUVERTS (fb9a961d) : « 45 » tapé pendant un tour (le tour continue, le temps vaut 45
// à Entrée) ; « 130 » tapé à la lecture (aucune lecture figée) ; « +10 » avant et après le 0.
// Par le geste, dans le mode test (la vraie console, la classe de test et ses tablettes simulées, la démo), sur le faux hub.
// Le journal du faux hub dit chaque écriture : pendant la frappe, aucune écriture de temps/ ni de deroule/duree.
// usage : APP_FILE=<app.html> BANC=<faux hub> CTL=<AUDITS/CONTROLES-QCM-APP> node sonde-temps.js [sortie.txt]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC), CTL = path.resolve(process.env.CTL);
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const SORTIE = process.argv[2] || null;
const TAXO = JSON.parse(fs.readFileSync(path.join(CTL, "attendus", "taxonomie-competences.json")));
const PORT = 8790 + Math.floor(Math.random() * 100);
const RAPPORT = []; let nb = 0, echecs = 0;
function verif(n, ok, quoi, detail) { nb++; if (!ok) echecs++; RAPPORT.push((ok ? "  ok     " : "  ÉCHEC  ") + "T" + n + " · " + quoi + (detail && !ok ? " — " + String(detail).slice(0, 500) : "")); return ok; }
const pause = ms => new Promise(r => setTimeout(r, ms));
const norm = s => (s || "").replace(/[  ]/g, " ");
async function texte(p, sel) { return norm(await p.evaluate(sel => { const r = sel ? document.querySelector(sel) : document.body; return r ? r.innerText : ""; }, sel || null)); }
async function cliquer(p, re, sel) {
  const ok = await p.evaluate(([src, fl, sel]) => {
    const re = new RegExp(src, fl); const racine = sel ? document.querySelector(sel) : document; if (!racine) return false;
    const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const c = [...racine.querySelectorAll("button, a, [role=button], [data-va]")].filter(e => vis(e) && !e.disabled && re.test((e.textContent || "").replace(/[  ]/g, " ").trim()));
    c.sort((a, b) => a.textContent.length - b.textContent.length);
    if (!c[0]) return false; document.querySelectorAll("[data-ctl]").forEach(x => x.removeAttribute("data-ctl")); c[0].setAttribute("data-ctl", "1"); return true;
  }, [re.source, re.flags, sel || null]);
  if (!ok) return false;
  await p.click("[data-ctl='1']", {timeout: 3000}).catch(() => {});
  await pause(500);
  return true;
}

(async () => {
  const B = buildTree();
  B.tree.taxonomie = Object.assign({}, B.tree.taxonomie, {competences: TAXO});
  const srv = await startServer(B.tree, PORT, () => {});
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const err = [];
  const ctx = await navig.newContext({viewport: {width: 1536, height: 864}}); await installRoutes(ctx, {...srv, port: PORT}, null);
  const prof = await ctx.newPage(); prof.on("pageerror", e => err.push(e.message)); prof.on("dialog", d => { err.push("boîte système : " + d.type()); d.dismiss().catch(() => {}); });
  await prof.goto("http://localhost:" + PORT + "/evaluation-qcm.html?mode=prof"); await pause(1500);
  const t0 = Date.now();
  const sid = () => (srv.store.get("qcm/sessionActive") || {})["_test_evaluation-qcm"];
  const S = () => srv.store.get("qcm/sessions/" + sid()) || {};
  const etat = () => S().deroule || {};
  const ecritTemps = j => srv.journal.slice(j).filter(o => /\/temps\/|deroule\/duree|"temps"|"duree"/.test(JSON.stringify(o.op)));
  const champ = async (sel) => prof.evaluate(sel => { const f = document.querySelector(sel); return f ? {v: f.value, focus: document.activeElement === f} : null; }, sel);
  const sims = () => texte(prof, ".sims");
  try {
    await cliquer(prof, /^Pilotage$/); await cliquer(prof, /Pilotage classe/); await pause(800);
    await cliquer(prof, /🧪 Mode test/);
    for (let k = 0; k < 40 && !(await prof.$("select[data-eval-test]")); k++) await pause(300);
    verif(0, await cliquer(prof, /^🚀 Lancer la séance$/, ".test-console"), "le mode test, sur la démo : « 🚀 Lancer la séance »"); await pause(1500);
    await cliquer(prof, /^🚀 Lancer la séance$/); await pause(2500);
    // jusqu'au 1er tour de Q1, sans faire répondre la classe
    let fait = new Set();
    for (let g = 0; g < 80; g++) { const e = etat();
      if (e.ph === "reponse" && e.qi === 0) break;
      if (e.ph === "entree" || e.ph === "pret") { if (!fait.has("e")) { fait.add("e"); await cliquer(prof, /🎲 Tous les élèves répondent/); await pause(800); } await cliquer(prof, /▶️ Lancer Q1\b/, ".test-console"); }
      else if (e.ph === "reflexion") await cliquer(prof, /Autoriser la réponse/, ".test-console");
      await pause(500); }
    const e1 = etat();
    verif(1, e1.ph === "reponse" && e1.qi === 0, "le 1er tour de Q1 est en cours", JSON.stringify(e1));
    // T1 — « 45 » tapé chiffre par chiffre dans le temps de réponse de Q1, pendant le tour
    const F1 = ".test-console input[data-temps='reponse'][data-q='1']";
    const t1 = ((S().temps || {})[0] || {}).reponse, d1 = e1.duree, tour1 = e1.tour;
    let j = srv.journal.length;
    await prof.click(F1, {clickCount: 3}).catch(x => err.push("clic champ : " + x.message));
    await prof.keyboard.type("4"); await pause(900);
    let e = etat();
    verif(1, ecritTemps(j).length === 0 && e.ph === "reponse" && e.tour === tour1 && e.duree === d1, "« 4 » tapé : rien n'est écrit, le tour continue (" + d1 + " s)", JSON.stringify({ecrit: ecritTemps(j).slice(0, 2), e}));
    await prof.keyboard.type("5"); await pause(900);
    e = etat(); const c45 = await champ(F1);
    verif(1, ecritTemps(j).length === 0 && e.ph === "reponse" && e.tour === tour1 && !!c45 && c45.v === "45" && c45.focus, "« 45 » tapé : toujours rien d'écrit, le tour continue, le champ garde « 45 » et le curseur", JSON.stringify({ecrit: ecritTemps(j).slice(0, 2), e, c45}));
    await prof.keyboard.press("Enter"); await pause(1300);
    e = etat(); const t1b = ((S().temps || {})[0] || {}).reponse;
    verif(1, t1b === 45 && e.duree === 45 && e.ph === "reponse" && e.tour === tour1, "à Entrée : le temps de réponse de Q1 vaut 45 (" + t1 + " avant), la durée du tour aussi, et le tour continue", JSON.stringify({temps: t1b, e}));
    const jQ = srv.journal.length;
    await prof.click("h1").catch(() => {}); await pause(800);
    verif(1, ecritTemps(jQ).length === 0 && ((S().temps || {})[0] || {}).reponse === 45, "en quittant le champ après Entrée, rien n'est écrit une seconde fois", JSON.stringify(ecritTemps(jQ).slice(0, 2)));

    // jusqu'à la lecture de la première question corrigée
    fait = new Set();
    for (let g = 0; g < 400; g++) { const x = etat(), ph = x.ph, cle = ph + ":" + x.qi + ":" + x.tour;
      if (ph === "lecture") break;
      if (ph === "reponse") { if (!fait.has(cle)) { fait.add(cle); await cliquer(prof, /🎲 Tous les élèves répondent/); await pause(600); } if (etat().ph === "reponse") await cliquer(prof, /⏱️ Faire expirer le chrono/); }
      else if (ph === "b") { if (g % 5 === 0) await cliquer(prof, /⏱️ Faire expirer le chrono/); }
      else if (ph === "reflexion") await cliquer(prof, /Autoriser la réponse/, ".test-console");
      else if (ph === "close") { if (x.qi + 1 < 3) await cliquer(prof, new RegExp("Lancer Q" + (x.qi + 2) + "\\b"), ".test-console"); else await cliquer(prof, /Lancer l'autoévaluation/, ".test-console"); }
      else if (ph === "estim") { if (!fait.has("estim")) { fait.add("estim"); await cliquer(prof, /🎲 Tous les élèves répondent/); } await cliquer(prof, /Lancer la correction/, ".test-console"); }
      else if (ph === "att2") { if (!fait.has("att2")) { fait.add("att2"); await cliquer(prof, /🎲 Tous les élèves répondent/); } await cliquer(prof, /Commencer la correction/, ".test-console"); }
      await pause(400); }
    let L = etat();
    verif(2, L.ph === "lecture", "la correction commence : la lecture de la feuille du voisin, Q" + ((L.qi || 0) + 1), JSON.stringify(L));
    // la classe lit d'abord : les lectures sont cliquées, donc une lecture figée se verrait (« ⏱️ Temps fini : ta lecture est enregistrée. »)
    await cliquer(prof, /🎲 Tous les élèves répondent/); await pause(1500);
    const qL = L.qi, F2 = ".test-console input[data-temps='lecture']";
    L = etat(); const dL = L.duree;
    j = srv.journal.length;
    await prof.click(F2, {clickCount: 3}).catch(x => err.push("clic champ lecture : " + x.message));
    let figee = false, ecr = [];
    for (const ch of "130") { await prof.keyboard.type(ch); await pause(900); const s = await sims(); if (/Temps fini/.test(s)) figee = true; ecr = ecr.concat(ecritTemps(j)); }
    L = etat(); const c130 = await champ(F2);
    verif(2, !figee && ecr.length === 0 && L.ph === "lecture" && L.duree === dL && !!c130 && c130.v === "130" && c130.focus, "« 130 » tapé pendant la lecture : aucune lecture figée sur les tablettes simulées, rien n'est écrit, le champ garde « 130 » et le curseur", JSON.stringify({figee, ecr: ecr.slice(0, 2), L, c130}));
    await prof.keyboard.press("Enter"); await pause(1300);
    L = etat(); const tq = ((S().temps || {})[qL] || {}).reponse;
    verif(2, tq === 130 && L.duree === 130 && L.ph === "lecture" && !/Temps fini/.test(await sims()), "à Entrée : le temps pour lire vaut 130, la lecture continue, aucune lecture figée", JSON.stringify({tq, L}));
    // T3 — « +10 » avant le 0 : tout de suite
    const plus10 = () => prof.evaluate(() => { const b = [...document.querySelectorAll(".test-console .saisie-carte button.t-plus")].find(x => x.textContent.trim() === "+10" && !x.disabled); if (!b) return false; b.click(); return true; });
    verif(3, await plus10(), "« +10 » de la carte de la lecture"); await pause(1200);
    L = etat();
    verif(3, L.duree === 140 && ((S().temps || {})[qL] || {}).reponse === 140 && L.ph === "lecture", "« +10 » avant le 0 : 140 s, tout de suite", JSON.stringify({L, t: (S().temps || {})[qL]}));
    // T4 — au 0, la lecture se fige ; « +10 » après le 0 la rouvre pour 10 s
    await cliquer(prof, /⏱️ Faire expirer le chrono/); await pause(1800);
    const fig0 = /Temps fini/.test(await sims());
    verif(4, fig0 && etat().ph === "lecture", "au 0 : les lectures cliquées se figent (« ⏱️ Temps fini : ta lecture est enregistrée. » sur les tablettes simulées)", (await sims()).slice(0, 300));
    const avant = Date.now();
    verif(4, await plus10(), "« +10 » après le 0"); await pause(1500);
    L = etat();
    verif(4, L.duree === 10 && L.depuis >= avant - 1500 && L.ph === "lecture" && !/Temps fini/.test(await sims()), "« +10 » après le 0 : la lecture repart pour 10 s, et plus aucune lecture n'est figée", JSON.stringify({L, sims: (await sims()).slice(0, 200)}));
    await prof.screenshot({path: path.join(path.dirname(SORTIE || "x"), "T4-lecture-rouverte.png")}).catch(() => {});
    await cliquer(prof, /🗑️ Sortir et purger/); await pause(3000);
    verif(5, !sid() && !srv.store.get("qcm/evaluations/_test_evaluation-qcm"), "« 🗑️ Sortir et purger » : la séance et la copie de test sont effacées");
    verif(5, err.length === 0, "aucune erreur de page ni boîte système", err.join(" | "));
  } catch (x) { verif(0, false, "la sonde a pu aller au bout", x.stack); }
  const tete = "Sonde de la conscience n°12 — 28, le temps tapé — " + process.env.APP_FILE + " — " + new Date().toISOString() + "\nDurée : " + Math.round((Date.now() - t0) / 1000) + " s · vérifications : " + nb + " · échecs : " + echecs;
  const out = tete + "\n" + RAPPORT.join("\n") + "\n";
  if (SORTIE) fs.writeFileSync(SORTIE, out); console.log(out);
  await navig.close(); await srv.close(); process.exit(echecs ? 1 : 0);
})();
