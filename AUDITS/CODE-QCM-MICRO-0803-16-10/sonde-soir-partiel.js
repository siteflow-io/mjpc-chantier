// SONDE DU MICRO 8.0.3, LE SOIR D'UNE SÉANCE CORRIGÉE À MOITIÉ (16/10, Paul 10:54 et 11:02 ; dettes n°12 · 217, 218) — conscience n°12
// La séance du banc du 13/10 (3 ESSAI, élèves fictifs), terminée, dont seule Q2 a été révélée (`revelees` = [1]) : comme la séance de Paul du 16/10 07:24.
// Par le geste : Données → Résultats → « 📊 Ouvrir » ; puis « 📄 Lire les copies », la copie de Tom.
// usage : APP_FILE=<app> BANC=<faux hub> BASE=<qcm du soir> TAXO=<taxonomie> CAP=<dossier> node sonde-soir-partiel.js [sortie.txt]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = process.env.BANC, CAP = process.env.CAP, SORTIE = process.argv[2] || null;
const { startServer, installRoutes } = require(path.join(BANC, "server.js"));
const { buildTree } = require(path.join(BANC, "tree.js"));
const pause = ms => new Promise(r => setTimeout(r, ms));
const R = []; let nb = 0, ech = 0;
const verif = (n, ok, quoi, det) => { nb++; if (!ok) ech++; R.push((ok ? "  ok     " : "  ÉCHEC  ") + n + " · " + quoi + (det && !ok ? " — " + String(det).slice(0, 400) : "")); };
(async () => {
  const t0 = Date.now();
  const B = buildTree();
  const base = JSON.parse(fs.readFileSync(process.env.BASE));
  const S = base.sessions.sess_1791877316846; S.revelees = {0: 1};   // seule Q2 révélée
  B.tree.qcm = Object.assign({}, B.tree.qcm, base);
  B.tree.taxonomie = Object.assign({}, B.tree.taxonomie, {competences: JSON.parse(fs.readFileSync(process.env.TAXO))});
  const PORT = 8960 + Math.floor(Math.random() * 30);
  const srv = await startServer(B.tree, PORT, () => {});
  const navig = await chromium.launch({executablePath: "/opt/pw-browsers/chromium"});
  const ctx = await navig.newContext({viewport: {width: 1536, height: 864}}); await installRoutes(ctx, {...srv, port: PORT}, null);
  const p = await ctx.newPage(); const err = []; p.on("pageerror", e => err.push(e.message)); p.on("dialog", d => { err.push("boîte : " + d.type()); d.dismiss().catch(() => {}); });
  await p.goto("http://localhost:" + PORT + "/evaluation-qcm.html?mode=prof"); await pause(2500);
  const clic = async (re) => { const ok = await p.evaluate(([s, f]) => { const r = new RegExp(s, f); const b = [...document.querySelectorAll("button, a, [role=button], [data-va], .lire-prop")].filter(e => e.getBoundingClientRect().width > 0 && !e.disabled && r.test((e.textContent || "").trim())).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!b) return false; document.querySelectorAll("[data-c]").forEach(x => x.removeAttribute("data-c")); b.setAttribute("data-c", "1"); return true; }, [re.source, re.flags]); if (ok) { await p.click("[data-c='1']"); await pause(1000); } return ok; };
  try {
    await clic(/^Données$/); await clic(/Résultats/);
    verif("M5", await clic(/📊 Ouvrir/), "Résultats : « 📊 Ouvrir » la séance");
    const ligne = sl => p.evaluate(sl => { const r = document.querySelector("tr[data-eleve='" + sl + "']"); return r ? [...r.querySelectorAll("td")].map(x => x.innerText.replace(/\s+/g, " ").trim()) : null; }, sl);
    const tom = await ligne("carre_tom"), julien = await ligne("abrial_julien");
    const tete = await p.evaluate(() => [...document.querySelectorAll("thead th")].map(x => x.innerText.replace(/\s+/g, " ").trim()));
    const iN = tete.indexOf("Note"), iS = tete.indexOf("Sur 20"), iM = tete.indexOf("Maîtrise de la note");
    const ok = l => !!l && /^\d+(,\d+)?\/3 2 questions pas encore lues$/.test(l[iN]) && /^\d+(,\d)?$/.test(l[iS]) && l[iM] === "—";
    verif("M5", ok(tom) && ok(julien), "le tableau de la séance, seule Q2 révélée : la note telle qu'elle est (« n/3 »), « 2 questions pas encore lues », la note sur 20, et « — » pour la maîtrise", JSON.stringify({tete, tom, julien}));
    const iA = tete.findIndex(t => /Autonomie/.test(t)), comps = tete.slice(iM + 1, iA);
    verif("M5", comps.length > 0 && comps.every((c, k) => tom[iM + 1 + k] === "—" && julien[iM + 1 + k] === "—"), "et « — » pour chaque compétence (" + comps.length + ")", JSON.stringify({comps, tom, julien}));
    const bulle = await p.evaluate(() => { const e = document.querySelector("tr[data-eleve='carre_tom'] .non-lues"); return e ? e.title : null; });
    verif("M5", !!bulle && /pas encore données/.test(bulle), "« 2 questions pas encore lues » a son infobulle, pour toi", String(bulle));
    await p.screenshot({path: CAP + "/m5-tableau-seance-partielle.png"});
    verif("M6", await clic(/Lire les copies/), "« 📄 Lire les copies »");
    await p.click("[data-initiales='1']").catch(() => {}); await p.keyboard.type("ct", {delay: 60}); await pause(500); await p.keyboard.press("Enter"); await pause(1200);
    const nd = await p.evaluate(() => { const n = document.querySelector("[data-note-directe]"); return n ? n.innerText.replace(/\s+/g, " ") : null; });
    verif("M6", !!nd && /Question 1 : pas encore lue/.test(nd) && /Question 3 : pas encore lue/.test(nd) && !/écartée/.test(nd) && /2 questions pas encore lues/.test(nd), "la copie de Tom, « 🧮 La note, en direct » : « Question 1 : pas encore lue », « Question 3 : pas encore lue », jamais « écartée », puis « 2 questions pas encore lues »", String(nd));
    await p.screenshot({path: CAP + "/m6-lire-les-copies-partielle.png"});
    verif("M8", err.length === 0, "aucune erreur de page ni boîte système", err.slice(0, 3).join(" · "));
  } catch (e) { verif("M0", false, "la sonde s'est arrêtée", e.stack); }
  await navig.close(); await srv.close();
  const txt = "Sonde du soir, séance corrigée à moitié (micro 8.0.3) — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString() + "\nDurée : " + Math.round((Date.now() - t0) / 1000) + " s · vérifications : " + nb + " · échecs : " + ech + "\n" + R.join("\n") + "\n";
  if (SORTIE) fs.writeFileSync(SORTIE, txt); process.stdout.write(txt); process.exit(ech ? 1 : 0);
})();
