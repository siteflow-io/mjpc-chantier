// Les contrôles de la conscience n°12 pour l'app QCM codée d'après la maquette (mandat de code, §5.3 ; protocole de l'audit du 12/10).
// L'app est servie par le faux hub du mode test (AUDITS/QCM-MODE-TEST-09-10/banc : la base partagée entre toutes les pages, par WebSocket).
// Tout passe par le geste, dans plusieurs pages à la fois : la console, une tablette partagée, le tableau, le téléphone.
// Les attendus viennent de la maquette validée (ses libellés, ses règles) et de la base elle-même, jamais de l'app contrôlée.
// usage : APP_FILE=<evaluation-qcm.staging.html> BANC=<dossier du faux hub, avec node_modules> node controles-app.js [sortie.txt]
const path = require("path"), fs = require("fs");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const BANC = path.resolve(process.env.BANC || "/tmp/claude-0/-home-claude/6f83f394-f2d4-5070-8d91-714cb465417b/scratchpad/banchub");
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

    // K2 — la tablette, ouverte sans rechargement après le lancement (reprise 7, point 13, Paul 15/10 09:19) : ni la classe ni « Combien êtes-vous » ;
    // sans session MJPC, « 👋 Identifie-toi » ; l'élève entré, l'autre moitié est son binôme de la grille (« Ton binôme : … »), qui tape son code
    const tab = await ouvrir("?mode=eleve", 1280, 800);
    const vuEntree = await attendre(tab, /Identifie-toi/, 10000);
    const tE = await texte(tab);
    verif(2, vuEntree && !/Combien êtes-vous|Choisis ta classe/.test(tE), "la tablette ouvre « 👋 Identifie-toi », sans demander la classe ni « Combien êtes-vous »", tE.slice(0, 200));

    // K3 — l'entrée par le vrai code (son empreinte est au hub), au clavier de l'app ; le binôme vient de la grille de la console
    await taper(tab, 0, "code", codeDe("ABRIAL Julien")); await taper(tab, 0, "Prénom", "julien"); await taper(tab, 0, "Nom", "abrial");
    await cliquer(tab, /Entrer/, 0);
    const vuJ = await attendre(prof, /ABRIAL Julien/, 10000);
    verif(3, vuJ, "Julien entré sur la tablette se voit sur ta console sans rechargement");
    await attendre(tab, /Ton binôme :/, 10000);
    let m = await moities(tab);
    const iB = m.findIndex(x => /Ton binôme :/.test(x));
    const voisin = (((m[iB] || "").match(/Ton binôme : ([^\n]+)/) || [])[1] || "").trim();
    verif(2, m.length === 2 && iB >= 0 && !!voisin && !/Combien êtes-vous|Choisis ta classe/.test(m.join(" ")), "Julien entré, l'autre moitié est son binôme : « Ton binôme : " + voisin + " », sans « Combien êtes-vous »", m.map(x => x.slice(0, 60)).join(" | "));
    await taper(tab, iB, "", codeDe(voisin));
    await cliquer(tab, /^Entrer/, iB);
    let deux = false; for (let k = 0; k < 20 && !deux; k++) { await pause(500); const mm = await moities(tab); deux = mm.length === 2 && mm.every(x => /Avant de commencer/.test(x)); }
    verif(3, deux, voisin + ", entré par son code dans l'autre moitié : les deux moitiés sont à « Avant de commencer »", (await moities(tab)).map(x => x.slice(0, 60)).join(" | "));
    // un code faux ne fait pas entrer (la maquette : « Ce code ne correspond pas. Vérifie tes 4 chiffres. »)
    const tab2 = await ouvrir("?mode=eleve", 1280, 800);
    await attendre(tab2, /Identifie-toi/, 8000);
    await pause(500);
    await taper(tab2, 0, "code", "9999").catch(() => {});
    const un = await texte(tab2);
    if (/Identifie-toi/.test(un)) { await taper(tab2, 0, "Prénom", "tom"); await taper(tab2, 0, "Nom", "carré"); await cliquer(tab2, /Entrer/); await pause(600);
      verif(3, /Ce code ne correspond pas/.test(await texte(tab2)), "un code faux : « Ce code ne correspond pas. Vérifie tes 4 chiffres. »", (await texte(tab2)).slice(0, 200)); }

    // K4 — la première attestation : une coche par ligne, « Je commence » s'ouvre quand tout est coché
    for (const i of [0, 1]) {
      for (let k = 0; k < 12; k++) { const fait = await tab.evaluate(i => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
          const h = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[i]; if (!h) return false;
          const c = [...h.querySelectorAll("input[type=checkbox], [role=checkbox]")].find(x => !x.checked && x.getAttribute("aria-checked") !== "true" && x.getBoundingClientRect().width > 0); if (!c) return false; c.click(); return true; }, i); if (!fait) break; await pause(250); }
      await cliquer(tab, /Je commence/, i);
    }
    verif(4, await attendre(prof, /prêt|Prêt|PRÊT/, 8000), "les deux attestations faites, ta console le montre");

    // K5 — la question 1 lancée de la console arrive sur la tablette, le tableau et le téléphone
    const tableau = await ouvrir("?mode=prof&view=board", 1280, 800);
    const tel = await ouvrir("?mode=prof&view=phone", 390, 844);
    await cliquer(prof, /Lancer Q1/);
    m = await moities(tab);
    const q1 = new RegExp(EV.questions[0].enonce.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    verif(5, await attendre(tab, /QUESTION 1/i, 8000) && (await moities(tab)).every(x => q1.test(x)), "« ▶️ Lancer Q1 » : l'énoncé de la question 1 sur les deux moitiés", (await moities(tab)).map(x => x.slice(0, 80)).join(" | "));
    verif(5, await attendre(tableau, q1, 8000), "le tableau montre la question 1, sans rechargement");
    verif(5, await attendre(tel, /Q1|Question 1|QUESTION 1/, 8000), "le téléphone montre la question 1, sans rechargement");

    // (défini ici depuis le tour 677, pour K6 et K7 comme pour K10) une moitié est « active » quand ses choix de la question sont cliquables ; chaque moitié répond une fois, à son tour (le 1er tour n'est pas toujours celui de gauche)
    const active = (cote, qi) => tab.evaluate(([cote, choix]) => { const W = innerWidth; const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > W * 0.35 && r.width < W * 0.6 && r.height > 300; });
      const h = all.filter(e => !all.some(o => o !== e && o.contains(e))).sort((a, b) => a.getBoundingClientRect().x - b.getBoundingClientRect().x)[cote]; if (!h) return false;
      return [...h.querySelectorAll("button, [role=button]")].some(b => !b.disabled && b.getBoundingClientRect().width > 0 && choix.includes((b.textContent || "").trim())); }, [cote, EV.questions[qi].choix]);
    const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reBonne1 = new RegExp("^" + esc(EV.questions[0].choix[EV.questions[0].bonnes[0]]) + "$");
    const compte = t => { const m = /(\d+)\s*\/\s*(\d+)\s*ont répondu/iu.exec(t); return m ? +m[1] : null; };   // la console peut l'écrire en capitales (« ONT RÉPONDU »)
    const moitieActive = async (qi, sauf) => { for (let k = 0; k < 40; k++) { for (const c of [0, 1]) if (c !== sauf && await active(c, qi)) return c; await pause(250); } return -1; };

    // K6 — un redessin n'efface jamais une saisie : un champ de ta console garde sa valeur et le focus quand une tablette agit
    // (corrigé au tour 677 : le passage, « POSE TON STYLO » et son décompte, vient avant le 1er tour ; le champ est pris sur l'écran du 1er tour,
    //  après « Autoriser la réponse », car un clic de la console sur un bouton prend lui-même le focus ; « se voit sur ta console » se lit au compteur)
    await cliquer(prof, /Autoriser la réponse/);
    const c1 = await moitieActive(0, -1);
    const champ = await prof.evaluate(() => { const f = [...document.querySelectorAll("input[type=number], input[type=text]")].find(x => x.getBoundingClientRect().width > 0 && !x.disabled && !x.readOnly); if (!f) return null; f.setAttribute("data-k6", "1"); return true; });
    if (champ) { await prof.click("[data-k6='1']"); await prof.keyboard.press("End"); await prof.keyboard.type("7"); }
    const nAvant = compte(await texte(prof));
    const choisi = c1 >= 0 && await cliquer(tab, reBonne1, c1);
    verif(6, choisi, "au 1er tour, une moitié peut cliquer un choix de la question 1", "aucune moitié n'a ses choix cliquables 10 s après « Autoriser la réponse »");
    let nApres = nAvant; for (let k = 0; k < 30 && !(nApres !== null && nAvant !== null && nApres > nAvant); k++) { await pause(300); nApres = compte(await texte(prof)); }
    verif(6, nAvant !== null && nApres > nAvant, "la réponse cliquée sur la tablette se voit sur ta console sans rechargement (« n / N ont répondu » augmente)", JSON.stringify({avant: nAvant, apres: nApres}) + " · console : " + (t => { const i = t.search(/répondu/iu); return i < 0 ? "« répondu » absent : " + t.slice(0, 400) : t.slice(Math.max(0, i - 120), i + 40); })((await texte(prof)).replace(/\n/g, " ⏎ ")));
    if (champ) { const st = await prof.evaluate(() => { const f = document.querySelector("[data-k6='1']"); return f ? {focus: document.activeElement === f, v: f.value} : null; });
      verif(6, !!st && st.focus && /7$/.test(st.v), "le champ où tu tapais garde sa valeur et le curseur pendant que la tablette répond", JSON.stringify(st)); }
    else verif(6, true, "aucun champ de saisie à cet écran de la console (rien à mesurer)");

    // K7 — le 2e tour : l'autre moitié répond ; puis la question se clôt
    await cliquer(prof, /Tour suivant/);
    const c2 = await moitieActive(0, c1);
    const autre = c2 >= 0 && await cliquer(tab, reBonne1, c2);
    // ===== Sonde B (conscience n°12, 13/10 10:10) : B paraît-il à la 2e moitié ? =====
    const CAP = process.env.CAP;
    const bVu = async (cote, ms) => { const t1 = Date.now(); while (Date.now() - t1 < ms) { const mm = await moities(tab); if (/Oui, la même chose/.test(mm[cote] || "")) return Math.round((Date.now() - t1) / 100) / 10; await pause(250); } return -1; };
    const b1pendant = await bVu(c1, 1500);
    RAPPORT.push("  info   Q1 : 1re moitié = " + c1 + ", 2e moitié = " + c2 + " ; B de la 1re moitié pendant le 2e tour : " + b1pendant + " s");
    await cliquer(prof, /Clore la question/);
    await tab.screenshot({path: CAP + "/q1-apres-clore-0s.png"});
    const bA2 = await bVu(c2, 15000);
    await tab.screenshot({path: CAP + "/q1-apres-clore-fin.png"});
    verif(20, bA2 >= 0, "Q1, « Clore » cliqué dès que la 2e moitié a répondu : B paraît à la 2e moitié", "B jamais vu en 15 s ; 2e moitié : " + ((await moities(tab))[c2] || "").replace(/\n/g, " ⏎ ").slice(0, 300));
    if (bA2 >= 0) await cliquer(tab, /Oui, la même chose/, c2);
    const bA1 = b1pendant >= 0 ? b1pendant : await bVu(c1, 3000);
    verif(20, bA1 >= 0, "Q1 : B a paru à la 1re moitié", "1re moitié : " + ((await moities(tab))[c1] || "").replace(/\n/g, " ⏎ ").slice(0, 300));
    if (bA1 >= 0) await cliquer(tab, /Oui, la même chose/, c1);
    RAPPORT.push("  info   console après Q1 : " + (await texte(prof)).replace(/\n/g, " ⏎ ").match(/.{0,200}(À lire|n'a pas dit).{0,200}/)?.[0]);
    // Q2 : personne ne clique « Clore » ni « Tour suivant » ; les temps comptés de la question (réflexion 30 s, réponse 20 s par tour) font tout
    await cliquer(prof, /Lancer Q2/); await attendre(tab, /QUESTION 2/i, 8000);
    await cliquer(prof, /Autoriser la réponse/);
    const d1 = await moitieActive(1, -1);
    for (const c of EV.questions[1].bonnes) await cliquer(tab, new RegExp("^" + esc(EV.questions[1].choix[c]) + "$"), d1);
    const t2 = Date.now(); let d2 = -1;
    for (let k = 0; k < 120 && d2 < 0; k++) { for (const c of [0, 1]) if (c !== d1 && await active(c, 1)) d2 = c; if (d2 < 0) await pause(250); }
    RAPPORT.push("  info   Q2 : 1re moitié = " + d1 + " ; 2e tour ouvert seul après " + Math.round((Date.now() - t2) / 1000) + " s (moitié " + d2 + ")");
    if (d2 >= 0) await cliquer(tab, /^Madrid$/, d2);
    const bB1 = await bVu(d1, 2000);
    const bB2 = await bVu(d2, 35000);
    await tab.screenshot({path: CAP + "/q2-fin-du-temps.png"});
    verif(21, bB2 >= 0, "Q2, sans « Clore » : B paraît à la 2e moitié à la fin de son temps", "2e moitié : " + ((await moities(tab))[d2] || "").replace(/\n/g, " ⏎ ").slice(0, 300));
    verif(21, bB1 >= 0 || true, "Q2 : B de la 1re moitié (info) : " + bB1 + " s");
    await prof.screenshot({path: CAP + "/q2-console.png"});
  } catch (e) { verif(0, false, "la sonde s'est arrêtée", e.stack); }
  await navig.close(); await srv.close();
  const txt = "Sonde B — " + (process.env.APP_FILE || "?") + " — " + new Date().toISOString() + "\nDurée : " + Math.round((Date.now() - t0) / 1000) + " s · vérifications : " + nb + " · échecs : " + echecs + "\n" + RAPPORT.join("\n") + "\n";
  if (SORTIE) fs.writeFileSync(SORTIE, txt);
  process.stdout.write(txt);
  process.exit(echecs ? 1 : 0);
})();
